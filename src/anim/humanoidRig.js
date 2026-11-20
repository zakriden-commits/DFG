import * as THREE from 'three';

/**
 * Универсальный гуманоидный риг.
 *
 * Задача: по любому GLB-скелету (Mixamo, Blender, UE, Rigify, самописный)
 * найти смысловые кости и уметь поворачивать их «по-человечески»:
 * pitch — наклон вперёд/назад (вокруг боковой оси),
 * yaw   — поворот вокруг вертикали,
 * roll  — наклон вбок (вокруг оси «вперёд»).
 *
 * Ключевая математика: вращение задаётся в МИРОВЫХ осях персонажа,
 * а затем переводится в локальную систему кости через rest-позу:
 *   L' = conj(P0) · R · P0 · L0
 * где P0 — мировой кватернион родителя в rest-позе, L0 — локальный rest.
 * Так анимация корректно работает при любой ориентации скелета и любых
 * осях костей (в т.ч. когда Blender-импорт разворачивает модель).
 */

const SEMANTIC = [
  'hips', 'spine', 'chest', 'neck', 'head',
  'shoulderL', 'shoulderR', 'upperArmL', 'upperArmR',
  'forearmL', 'forearmR', 'handL', 'handR',
  'thighL', 'thighR', 'shinL', 'shinR',
  'footL', 'footR', 'toeL', 'toeR',
];

const SKIP_WORDS = /(end|nub|ik|twist|roll|helper|target|pole|ctrl|control|marker|locator|dummy)/;

function tokensOf(name) {
  return String(name || '')
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((t) => t && t !== 'mixamorig' && t !== 'bip01' && t !== 'bip001');
}

function typeOf(name) {
  const toks = tokensOf(name);
  const j = toks.join('');
  if (!j) return null;
  if (SKIP_WORDS.test(j)) return null;
  if (/(hips?|pelvis)$/.test(j) || toks.includes('pelvis') || toks.includes('hip')) return 'hips';
  if (j.includes('headtop') || j.includes('headend')) return null;
  if (toks.includes('head')) return 'head';
  if (toks.includes('neck')) return 'neck';
  if (/spine|chest|torso/.test(j)) return 'spine'; // цепочку разложим по глубине
  if (/shoulder|clavicle/.test(j)) return 'shoulder';
  if (/forearm|lowerarm/.test(j)) return 'forearm';
  if (/hand/.test(j)) return 'hand';
  if (/foot|ankle/.test(j)) return 'foot';
  if (/toe|ball/.test(j)) return 'toe';
  if (/upleg|thigh|upperleg/.test(j)) return 'thigh';
  if (/lowerleg|shin|calf/.test(j)) return 'shin';
  if (j.endsWith('leg')) return 'shin'; // Mixamo: LeftLeg / RightLeg — голень
  if (/upperarm|arm/.test(j)) return 'upperArm';
  return null;
}

function sideOf(name, pos, hipsPos, lateralSign) {
  const toks = tokensOf(name);
  const j = toks.join('');
  const hasL = j.includes('left') || toks.includes('l') || /(^|[^a-z])l_?\d*$/.test(j);
  const hasR = j.includes('right') || toks.includes('r') || /(^|[^a-z])r_?\d*$/.test(j);
  if (hasL && !hasR) return 'L';
  if (hasR && !hasL) return 'R';
  // пространственный фолбэк: сторона по поперечной оси
  if (hipsPos) {
    const d = (pos.x - hipsPos.x) * lateralSign;
    return d >= 0 ? 'L' : 'R';
  }
  return null;
}

export class HumanoidRig {
  /**
   * @param {THREE.Object3D} root — загруженная сцена/модель (rest pose)
   */
  constructor(root) {
    this.root = root;
    root.updateWorldMatrix(true, true);

    this.allBones = [];
    root.traverse((o) => {
      if (o.isBone) this.allBones.push(o);
    });

    this.bones = {};
    this.depth = new Map();
    this.rest = new Map(); // semantic -> { localPos, localQuat, parentWorldQuat }
    this.warnings = [];

    this.findBones();
    this.computeAxes();
    this.captureRest();
    this.measure();
  }

  findBones() {
    const hipsCandidate = this.allBones.find((b) => typeOf(b.name) === 'hips');
    const hipsPos = hipsCandidate
      ? hipsCandidate.getWorldPosition(new THREE.Vector3())
      : new THREE.Vector3();

    const depthOf = (bone) => {
      let d = 0;
      let p = bone.parent;
      while (p) {
        d++;
        p = p.parent;
      }
      return d;
    };

    const torso = { hips: [], spine: [], neck: [], head: [] };
    const limbs = new Map(); // "thighL" -> [{bone, depth}]

    for (const bone of this.allBones) {
      const type = typeOf(bone.name);
      if (!type) continue;
      const pos = bone.getWorldPosition(new THREE.Vector3());
      const d = depthOf(bone);

      if (type === 'hips') { torso.hips.push({ bone, d }); continue; }
      if (type === 'spine') { torso.spine.push({ bone, d }); continue; }
      if (type === 'neck') { torso.neck.push({ bone, d }); continue; }
      if (type === 'head') { torso.head.push({ bone, d }); continue; }

      const side = sideOf(bone.name, pos, hipsPos, 1);
      if (!side) continue;
      const key = type + side;
      if (!limbs.has(key)) limbs.set(key, []);
      limbs.get(key).push({ bone, d });
    }

    const shallowest = (arr) => arr.sort((a, b) => a.d - b.d)[0]?.bone;

    if (shallowest(torso.hips)) this.bones.hips = shallowest(torso.hips);

    // Цепочка корпуса: самая верхняя кость — spine, следующая — chest
    const spineChain = torso.spine.sort((a, b) => a.d - b.d).map((x) => x.bone);
    if (spineChain[0]) this.bones.spine = spineChain[0];
    if (spineChain[1]) this.bones.chest = spineChain[1];
    else if (spineChain[0]) this.bones.chest = null;

    const neckBone = shallowest(torso.neck);
    if (neckBone) this.bones.neck = neckBone;
    const headBone = shallowest(torso.head);
    if (headBone) this.bones.head = headBone;

    for (const [key, arr] of limbs) {
      const b = shallowest(arr);
      if (b) this.bones[key] = b;
    }

    if (!this.bones.hips) {
      this.bones.hips = this.guessHips();
      this.warnings.push('Кости не подписаны: hips определён геометрически');
    }
    if (!this.bones.spine && this.bones.chest) {
      this.bones.spine = this.bones.chest;
      this.bones.chest = null;
    }

    for (const key of SEMANTIC) {
      if (!this.bones[key]) this.warnings.push(`нет кости: ${key}`);
    }
  }

  guessHips() {
    // самая верхняя кость, у которой есть ≥2 потомка-конечности
    let candidate = null;
    for (const b of this.allBones) {
      let children = 0;
      b.traverse((o) => {
        if (o !== b && o.isBone) children++;
      });
      if (children >= 6 && !candidate) candidate = b;
    }
    return candidate || this.allBones[0];
  }

  computeAxes() {
    const up = new THREE.Vector3(0, 1, 0);
    const hips = this.bones.hips;
    const get = (k) => this.bones[k]?.getWorldPosition(new THREE.Vector3());

    // боковая ось: от правой ноги к левой (или от правой руки к левой)
    let lateral = new THREE.Vector3();
    const thighL = get('thighL');
    const thighR = get('thighR');
    if (thighL && thighR && thighL.distanceTo(thighR) > 1e-4) {
      lateral.subVectors(thighL, thighR).normalize();
    } else {
      const armL = get('upperArmL');
      const armR = get('upperArmR');
      if (armL && armR) lateral.subVectors(armL, armR).normalize();
      else lateral.set(1, 0, 0);
    }
    lateral.y = 0;
    if (lateral.lengthSq() < 1e-6) lateral.set(1, 0, 0);
    lateral.normalize();

    // «вперёд» — из направления стопы на носок, иначе перпендикуляр к боковой оси
    let forward = new THREE.Vector3();
    const foot = get('footL') || get('footR');
    const toe = get('toeL') || get('toeR');
    if (foot && toe) {
      forward.subVectors(toe, foot);
      forward.y = 0;
      if (forward.lengthSq() > 1e-6) forward.normalize();
    }
    if (forward.lengthSq() < 1e-6) {
      forward.crossVectors(lateral, up).normalize();
    }

    this.axes = {
      up: up.clone(),
      lateral, // влево
      right: lateral.clone().negate(),
      forward,
    };
    this.axes.forwardVerified = !!(foot && toe);
  }

  captureRest() {
    for (const key of Object.keys(this.bones)) {
      const bone = this.bones[key];
      if (!bone) continue;
      const parent = bone.parent;
      const parentQ = parent
        ? parent.getWorldQuaternion(new THREE.Quaternion())
        : new THREE.Quaternion();
      this.rest.set(key, {
        localPos: bone.position.clone(),
        localQuat: bone.quaternion.clone(),
        parentWorldQuat: parentQ,
        worldPos: bone.getWorldPosition(new THREE.Vector3()),
        worldQuat: bone.getWorldQuaternion(new THREE.Quaternion()),
      });
    }
  }

  measure() {
    const p = (k) => this.bones[k]?.getWorldPosition(new THREE.Vector3());
    const thigh = p('thighL');
    const foot = p('footL') || p('footR');
    const hips = p('hips');
    const head = p('head');

    this.legLength = thigh && foot ? thigh.distanceTo(foot) : 0.9;
    this.hipsHeight = hips ? hips.y : 0.95;
    this.height = head && foot ? Math.abs(head.y - foot.y) * 1.12 : this.hipsHeight * 2;
    this.footY = foot ? foot.y : 0;
    this.groundOffset = -this.footY;

    // геометрия для IK
    const hipsRest = this.rest.get('hips')?.worldPos;
    const thighL = this.rest.get('thighL')?.worldPos;
    const thighR = this.rest.get('thighR')?.worldPos;
    const footRest = this.rest.get('footL')?.worldPos || this.rest.get('footR')?.worldPos;
    this.hipJointHeight = thighL ? thighL.y : (hipsRest ? hipsRest.y - this.legLength * 0.1 : 0.9);
    this.ankleRestHeight = footRest ? footRest.y : this.hipJointHeight - this.legLength;
    this.hipHalfWidth =
      thighL && thighR && hipsRest
        ? Math.abs(thighL.clone().sub(hipsRest).dot(this.axes.lateral))
        : 0.1;
    this.footLength =
      this.rest.get('toeL') && this.rest.get('footL')
        ? this.rest.get('toeL').worldPos.distanceTo(this.rest.get('footL').worldPos)
        : this.legLength * 0.14;
    // земля / низ подошвы в rest-позе
    let soleY = Infinity;
    for (const side of ['L', 'R']) {
      const footBone = this.bones['foot' + side];
      if (!footBone) continue;
      const p = footBone.getWorldPosition(new THREE.Vector3());
      const toe = this.bones['toe' + side];
      const toeY = toe ? toe.getWorldPosition(new THREE.Vector3()).y : p.y;
      soleY = Math.min(soleY, p.y - this.legLength * 0.085, toeY - this.legLength * 0.03);
    }
    this.groundY = Number.isFinite(soleY) ? soleY : 0;
  }

  has(key) {
    return !!this.bones[key];
  }

  update() {
    this.root.updateWorldMatrix(true, true);
  }

  worldPos(key, out = new THREE.Vector3()) {
    const bone = this.bones[key];
    if (!bone) return null;
    return bone.getWorldPosition(out);
  }

  /** Длина сегмента: расстояние до дочерней кости */
  segmentLength(key) {
    const bone = this.bones[key];
    if (!bone) return 0;
    let child = null;
    for (const c of bone.children) {
      if (c.isBone) { child = c; break; }
    }
    if (!child) return 0;
    return child.position.length();
  }

  /**
   * Локальное направление кости, которое нужно «нацеливать».
   * Для бедра/голени — на дочернюю кость, для стопы — горизонталь подошвы.
   */
  aimLocalDir(key) {
    if (!this._aimDirs) this._aimDirs = new Map();
    if (this._aimDirs.has(key)) return this._aimDirs.get(key);

    const bone = this.bones[key];
    let dir = new THREE.Vector3();

    if (key.startsWith('foot')) {
      // подошва в rest-позе смотрит вперёд
      const rest = this.rest.get(key);
      dir.copy(this.axes.forward).applyQuaternion(rest.worldQuat.clone().invert()).normalize();
    } else {
      let child = null;
      for (const c of bone.children) {
        if (c.isBone) { child = c; break; }
      }
      if (child) dir.copy(child.position).normalize();
      else dir.set(0, -1, 0);
    }

    this._aimDirs.set(key, dir);
    return dir;
  }

  /**
   * Направить кость в мировом пространстве по вектору dirWorld,
   * сохраняя корректную локальную позу (учёт анимации родителей).
   */
  aimWorld(key, dirWorld) {
    const bone = this.bones[key];
    if (!bone) return;
    this.root.updateWorldMatrix(true, true);

    const wq = bone.getWorldQuaternion(new THREE.Quaternion());
    const localDir = this.aimLocalDir(key);
    const cur = localDir.clone().applyQuaternion(wq).normalize();
    const target = dirWorld.clone().normalize();
    if (cur.lengthSq() < 1e-8 || target.lengthSq() < 1e-8) return;

    const q = new THREE.Quaternion().setFromUnitVectors(cur, target);
    const newWorld = q.multiply(wq);

    const parent = bone.parent;
    if (parent) {
      const pw = parent.getWorldQuaternion(new THREE.Quaternion());
      bone.quaternion.copy(pw.invert().multiply(newWorld));
    } else {
      bone.quaternion.copy(newWorld);
    }
    bone.updateMatrixWorld(true);
  }

  /**
   * Поворот кости на заданные углы (радианы) вокруг мировых осей персонажа.
   * Применяется поверх rest-позы.
   */
  pose(key, pitch = 0, yaw = 0, roll = 0) {
    const bone = this.bones[key];
    const rest = this.rest.get(key);
    if (!bone || !rest) return;

    const R = new THREE.Quaternion();
    if (roll) {
      R.multiply(new THREE.Quaternion().setFromAxisAngle(this.axes.forward, roll));
    }
    if (pitch) {
      R.multiply(new THREE.Quaternion().setFromAxisAngle(this.axes.right, pitch));
    }
    if (yaw) {
      R.multiply(new THREE.Quaternion().setFromAxisAngle(this.axes.up, yaw));
    }

    const inv = rest.parentWorldQuat.clone().invert();
    const localDelta = inv.multiply(R).multiply(rest.parentWorldQuat);
    bone.quaternion.copy(localDelta).multiply(rest.localQuat);
  }

  /** Смещение кости в мировых осях (для покачивания таза) */
  offset(key, dx = 0, dy = 0, dz = 0) {
    const bone = this.bones[key];
    const rest = this.rest.get(key);
    if (!bone || !rest) return;
    const world = new THREE.Vector3()
      .addScaledVector(this.axes.lateral, dx)
      .addScaledVector(this.axes.up, dy)
      .addScaledVector(this.axes.forward, dz);
    world.applyQuaternion(rest.parentWorldQuat.clone().invert());
    bone.position.copy(rest.localPos).add(world);
  }

  resetPose() {
    for (const key of Object.keys(this.bones)) {
      const rest = this.rest.get(key);
      const bone = this.bones[key];
      if (!rest || !bone) continue;
      bone.quaternion.copy(rest.localQuat);
      bone.position.copy(rest.localPos);
    }
  }

  /** Имя дорожки для AnimationClip (с защитой от дублей) */
  trackName(key, prop) {
    const bone = this.bones[key];
    if (!bone) return null;
    if (!this._dupNames) {
      const seen = new Set();
      this._dupNames = new Set();
      for (const b of this.allBones) {
        if (seen.has(b.name)) this._dupNames.add(b.name);
        seen.add(b.name);
      }
    }
    const id = this._dupNames.has(bone.name) ? bone.uuid : bone.name;
    return `${id}.${prop}`;
  }

  info() {
    return {
      bones: Object.fromEntries(Object.entries(this.bones).map(([k, b]) => [k, b?.name])),
      warnings: this.warnings,
      legLength: +this.legLength.toFixed(3),
      hipsHeight: +this.hipsHeight.toFixed(3),
      height: +this.height.toFixed(3),
      facing: this.axes.forward.toArray().map((v) => +v.toFixed(2)),
      forwardVerified: this.axes.forwardVerified,
      totalBones: this.allBones.length,
    };
  }
}
