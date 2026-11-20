import * as THREE from 'three';

/**
 * Процедурная походка для гуманоидного рига — на two-bone IK.
 *
 * Почему IK, а не «уголки»: цель стопы задаётся в мировых координатах,
 * поэтому подошва стоит ровно на земле, шаг не проскальзывает, а высота таза
 * сама подстраивается под длину шага (естественное покачивание корпуса).
 *
 * Пресет `stalker` — Michael Myers: быстрый тяжёлый шаг, наклон вперёд,
 * почти неподвижные руки, склонённая набок голова.
 */

const TAU = Math.PI * 2;
const DEG = Math.PI / 180;
const clamp = THREE.MathUtils.clamp;
const smooth = (t) => {
  const x = clamp(t, 0, 1);
  return x * x * (3 - 2 * x);
};
const mod1 = (x) => ((x % 1) + 1) % 1;

export const WALK_PRESETS = {
  /** Michael Myers: быстрый преследующий шаг */
  stalker: {
    name: 'walk',
    duration: 0.8,
    strideS: 0.36, // половина шага (м) → скорость = 4S/T ≈ 1.8 м/с
    footLift: 0.125,
    heelAngle: 7 * DEG,
    toeAngle: 17 * DEG,
    ankleClear: 9 * DEG,
    reach: 0.985,
    crouch: 0.012,
    lean: 8 * DEG,
    chestLean: 2 * DEG,
    hipPitch: 2 * DEG,
    hipYaw: 7 * DEG,
    hipRoll: 4 * DEG,
    chestYaw: 0.55,
    sway: 0.014,
    armSwing: 7 * DEG,
    armOut: 5 * DEG,
    elbow: 14 * DEG,
    elbowSwing: 5 * DEG,
    shoulderRaise: 3 * DEG,
    headTilt: 9 * DEG,
    headNod: 2.5 * DEG,
    headYaw: 0.35,
    samples: 40,
  },
  /** Спокойная прогулка — фолбэк и ориентир */
  calm: {
    name: 'walk_calm',
    duration: 1.06,
    strideS: 0.3,
    footLift: 0.08,
    heelAngle: 6 * DEG,
    toeAngle: 14 * DEG,
    ankleClear: 7 * DEG,
    reach: 0.98,
    crouch: 0.006,
    lean: 3 * DEG,
    chestLean: 0.5 * DEG,
    hipPitch: 0,
    hipYaw: 5 * DEG,
    hipRoll: 3 * DEG,
    chestYaw: 0.6,
    sway: 0.01,
    armSwing: 17 * DEG,
    armOut: 2 * DEG,
    elbow: 9 * DEG,
    elbowSwing: 8 * DEG,
    shoulderRaise: 0,
    headTilt: 0,
    headNod: 1.2 * DEG,
    headYaw: 0.4,
    samples: 40,
  },
};

/** Траектория одной стопы (в системе координат тела) */
export function legTarget(q, cfg, rig) {
  const phase = mod1(q);
  const S = cfg.strideS;
  let forward;
  let lift;
  let pitch;
  const stance = phase < 0.5;

  if (stance) {
    const s = phase / 0.5;
    forward = S * (1 - 2 * s);
    lift = 0;
    // пятка опускается после контакта, затем отталкивание носком
    const heel = cfg.heelAngle * (1 - smooth(s / 0.16));
    const toe = -cfg.toeAngle * smooth((s - 0.72) / 0.28);
    pitch = heel + toe;
  } else {
    const s = (phase - 0.5) / 0.5;
    const e = smooth(s);
    forward = -S + 2 * S * e;
    lift = cfg.footLift * Math.sin(Math.PI * Math.sqrt(clamp(s, 0, 1)));
    const clear = cfg.ankleClear * Math.sin(Math.PI * clamp(s / 0.92, 0, 1));
    const heel = cfg.heelAngle * smooth((s - 0.82) / 0.18);
    pitch = clear + heel;
  }

  // при опущенном носке стопа «растёт» в высоте — поднимаем лодыжку
  const footLen = rig?.footLength || 0.13;
  const pitchLift = Math.max(0, -pitch) * footLen * 0.5;

  return { forward, lift, pitch, pitchLift, stance };
}

const _v = new THREE.Vector3();
const _v2 = new THREE.Vector3();
const _v3 = new THREE.Vector3();

/** Аналитическое two-bone IK: бедро + голень, полюс — колено вперёд */
export function solveLeg(rig, side, target, pitch) {
  const thighKey = 'thigh' + side;
  const shinKey = 'shin' + side;
  const footKey = 'foot' + side;
  if (!rig.has(thighKey) || !rig.has(shinKey)) return false;

  const a = rig.segmentLength(thighKey);
  const b = rig.segmentLength(shinKey);
  if (a <= 0 || b <= 0) return false;

  const hip = rig.worldPos(thighKey, _v).clone();
  const toTarget = _v2.copy(target).sub(hip);
  const dist = toTarget.length();
  if (dist < 1e-4) return false;

  const maxD = (a + b) * 0.9995;
  const minD = Math.abs(a - b) + 0.01;
  const d = clamp(dist, minD, maxD);
  const dir = toTarget.normalize();

  const cosAlpha = clamp((a * a + d * d - b * b) / (2 * a * d), -1, 1);
  const alpha = Math.acos(cosAlpha);

  // полюс (куда смотрит колено) — вперёд и чуть наружу
  const pole = _v3
    .copy(rig.axes.forward)
    .addScaledVector(rig.axes.lateral, side === 'L' ? 0.22 : -0.22);
  pole.addScaledVector(dir, -pole.dot(dir));
  if (pole.lengthSq() < 1e-8) pole.copy(rig.axes.forward);
  pole.normalize();

  const knee = hip
    .clone()
    .addScaledVector(dir, a * Math.cos(alpha))
    .addScaledVector(pole, a * Math.sin(alpha));

  rig.aimWorld(thighKey, knee.clone().sub(hip));
  rig.update();

  const kneeNow = rig.worldPos(shinKey, new THREE.Vector3());
  rig.aimWorld(shinKey, target.clone().sub(kneeNow));
  rig.update();

  if (rig.has(footKey)) {
    const dirFoot = new THREE.Vector3()
      .copy(rig.axes.forward)
      .multiplyScalar(Math.cos(pitch))
      .addScaledVector(rig.axes.up, Math.sin(pitch));
    rig.aimWorld(footKey, dirFoot);
    rig.update();
  }
  return true;
}

/**
 * Полная поза для фазы 0..1 (0 — контакт левой пятки).
 */
export function applyWalkPose(rig, phase, cfg) {
  const tL = legTarget(phase, cfg, rig);
  const tR = legTarget(phase + 0.5, cfg, rig);

  const ankleY = (t) => rig.ankleRestHeight + t.lift + t.pitchLift;

  // максимальная высота таза, при которой обе ноги дотягиваются до целей
  const reach = cfg.reach ?? 0.985;
  const maxLen = rig.legLength * reach;
  const hw = rig.hipHalfWidth;
  let h = Infinity;
  for (const t of [tL, tR]) {
    const freeV = Math.sqrt(Math.max(0.0025, maxLen * maxLen - t.forward * t.forward - hw * hw));
    h = Math.min(h, ankleY(t) + freeV);
  }
  h -= cfg.crouch || 0;
  h = clamp(h, rig.hipJointHeight - 0.18, rig.hipJointHeight + 0.02);
  const dy = h - rig.hipJointHeight;

  const s = Math.sin(TAU * phase);
  const c = Math.cos(TAU * phase);

  // ---- таз ----
  rig.pose('hips', cfg.hipPitch + cfg.lean * 0.3, cfg.hipYaw * s, cfg.hipRoll * -s);
  rig.offset('hips', cfg.sway * rig.legLength * s, dy, 0);

  // ---- корпус ----
  if (rig.has('spine')) {
    rig.pose('spine', cfg.lean * 0.45, -cfg.hipYaw * s * cfg.chestYaw, 0);
  }
  if (rig.has('chest')) {
    rig.pose(
      'chest',
      cfg.lean * 0.45 + cfg.chestLean,
      -cfg.hipYaw * s * cfg.chestYaw * 1.2,
      cfg.hipRoll * s * 0.4,
    );
  }

  // ---- голова: держит горизонт, но склонена набок ----
  if (rig.has('neck')) {
    rig.pose('neck', -cfg.lean * 0.3 + cfg.headNod * c, cfg.headYaw * cfg.hipYaw * s, 0);
  }
  if (rig.has('head')) {
    rig.pose(
      'head',
      -cfg.lean * 0.5 + cfg.headNod * c * 0.5,
      cfg.headYaw * cfg.hipYaw * s * 0.6,
      cfg.headTilt + Math.sin(TAU * phase + 0.6) * cfg.headTilt * 0.15,
    );
  }

  // ---- руки: противоход, но едва заметный ----
  const putArm = (side) => {
    const armPhase = side === 'L' ? phase : phase + 0.5;
    const sign = side === 'L' ? 1 : -1;
    const armPitch = -Math.cos(TAU * armPhase) * cfg.armSwing;
    const out = cfg.armOut + cfg.shoulderRaise * Math.abs(Math.sin(TAU * phase));
    if (rig.has('shoulder' + side)) {
      rig.pose('shoulder' + side, 0, 0, sign * out * 0.25);
    }
    if (rig.has('upperArm' + side)) {
      rig.pose('upperArm' + side, armPitch, 0, sign * out);
    }
    if (rig.has('forearm' + side)) {
      const bend =
        cfg.elbow +
        cfg.elbowSwing * Math.max(0, -Math.cos(TAU * armPhase)) +
        Math.abs(side === 'L' ? tL.lift : tR.lift) * 20 * cfg.elbowSwing;
      rig.pose('forearm' + side, -bend, 0, 0);
    }
    if (rig.has('hand' + side)) {
      rig.pose('hand' + side, -cfg.elbow * 0.25, 0, 0);
    }
  };
  putArm('L');
  putArm('R');

  rig.update();

  // ---- IK ног ----
  const rootPos = rig.root.getWorldPosition(new THREE.Vector3());
  const center = new THREE.Vector3(rootPos.x, 0, rootPos.z);

  const place = (side, t) => {
    if (!rig.has('thigh' + side) || !rig.has('shin' + side)) return;
    const sign = side === 'L' ? 1 : -1;
    const target = center
      .clone()
      .addScaledVector(rig.axes.lateral, sign * hw)
      .addScaledVector(rig.axes.forward, t.forward);
    target.y = ankleY(t);
    solveLeg(rig, side, target, t.pitch);
  };

  place('L', tL);
  place('R', tR);
}

const POSED_KEYS = [
  'hips', 'spine', 'chest', 'neck', 'head',
  'shoulderL', 'shoulderR', 'upperArmL', 'upperArmR', 'forearmL', 'forearmR',
  'handL', 'handR', 'thighL', 'thighR', 'shinL', 'shinR', 'footL', 'footR',
];

/** Точки подошвы (пятка / подушечка) в мире */
export function solePoints(rig, side, out = { heel: new THREE.Vector3(), ball: new THREE.Vector3() }) {
  const foot = rig.bones['foot' + side];
  if (!foot) return null;
  const ankle = foot.getWorldPosition(new THREE.Vector3());
  const toe = rig.bones['toe' + side];
  const toeW = toe ? toe.getWorldPosition(new THREE.Vector3()) : null;

  const fwd = new THREE.Vector3();
  if (toeW) fwd.subVectors(toeW, ankle);
  else fwd.copy(rig.axes.forward);
  fwd.y = 0;
  if (fwd.lengthSq() < 1e-8) fwd.copy(rig.axes.forward);
  fwd.normalize();

  out.heel.copy(ankle).addScaledVector(fwd, -rig.legLength * 0.055);
  out.heel.y -= rig.legLength * 0.085;
  if (toeW) out.ball.copy(toeW);
  else out.ball.copy(ankle).addScaledVector(fwd, rig.legLength * 0.14);
  out.ball.y -= rig.legLength * 0.03;
  return out;
}

function footLowestY(rig, side) {
  const pts = solePoints(rig, side);
  if (!pts) return null;
  return Math.min(pts.heel.y, pts.ball.y);
}

/** Замер качества: контакт с землёй, подъём стопы, скорость без проскальзывания */
export function analyzeFootPlant(rig, cfg) {
  const steps = 48;
  let minRel = Infinity;
  let maxSwing = -Infinity;
  let stanceSpread = 0;
  let forwardTravel = 0;

  for (const side of ['L', 'R']) {
    const offset = side === 'L' ? 0 : 0.5;
    let firstBall = null;
    let lastBall = null;

    for (let i = 0; i <= steps; i++) {
      const local = i / steps;
      const phase = offset + local;
      rig.resetPose();
      applyWalkPose(rig, phase, cfg);
      rig.update();

      const pts = solePoints(rig, side);
      if (!pts) continue;
      const rel = Math.min(pts.heel.y, pts.ball.y) - rig.groundY;

      minRel = Math.min(minRel, rel);
      if (local <= 0.5) {
        stanceSpread = Math.max(stanceSpread, Math.abs(rel));
        if (local === 0) firstBall = pts.ball.clone();
        if (local === 0.5) lastBall = pts.ball.clone();
      } else {
        maxSwing = Math.max(maxSwing, rel);
      }
    }

    if (firstBall && lastBall) {
      forwardTravel = Math.max(
        forwardTravel,
        Math.abs(lastBall.clone().sub(firstBall).dot(rig.axes.forward)),
      );
    }
  }

  const stanceTime = cfg.duration * 0.5;
  rig.resetPose();
  rig.update();

  return {
    measuredSpeed: +(forwardTravel / stanceTime).toFixed(3),
    theoreticalSpeed: +((4 * cfg.strideS) / cfg.duration).toFixed(3),
    stepLength: +((forwardTravel / stanceTime) * cfg.duration * 0.5).toFixed(3),
    cadence: +(2 / cfg.duration).toFixed(2),
    stanceTime: +stanceTime.toFixed(3),
    duration: cfg.duration,
    footLift: +maxSwing.toFixed(3),
    groundPenetration: +Math.max(0, -minRel).toFixed(4),
    stanceContactError: +stanceSpread.toFixed(4),
    groundY: +rig.groundY.toFixed(3),
  };
}

/**
 * Собирает AnimationClip ходьбы.
 * @returns {{clip: THREE.AnimationClip, diagnostics: object, cfg: object}}
 */
export function buildWalkClip(rig, options = {}) {
  const preset = options.preset || 'stalker';
  const base = WALK_PRESETS[preset] || WALK_PRESETS.stalker;
  const cfg = { ...base, ...options };

  const samples = cfg.samples || 40;
  const times = [];
  const rot = new Map();
  const hipsPos = [];
  const posWanted = rig.has('hips');

  for (const key of POSED_KEYS) {
    if (rig.has(key)) rot.set(key, []);
  }

  for (let i = 0; i <= samples; i++) {
    const phase = (i % samples) / samples; // последний кадр = первому
    times.push(+((i / samples) * cfg.duration).toFixed(5));

    rig.resetPose();
    applyWalkPose(rig, phase, cfg);

    for (const key of rot.keys()) {
      const q = rig.bones[key].quaternion;
      rot.get(key).push(q.x, q.y, q.z, q.w);
    }
    if (posWanted) {
      const p = rig.bones.hips.position;
      hipsPos.push(p.x, p.y, p.z);
    }
  }

  const tracks = [];
  for (const [key, values] of rot) {
    const name = rig.trackName(key, 'quaternion');
    if (name) tracks.push(new THREE.QuaternionKeyframeTrack(name, times, values));
  }
  if (posWanted) {
    const name = rig.trackName('hips', 'position');
    if (name) tracks.push(new THREE.VectorKeyframeTrack(name, times, hipsPos, THREE.InterpolateLinear));
  }

  const clip = new THREE.AnimationClip(cfg.name || 'walk', cfg.duration, tracks);
  clip.optimize?.();

  const diagnostics = analyzeFootPlant(rig, cfg);
  diagnostics.trackCount = tracks.length;
  diagnostics.matchedSpeed = diagnostics.measuredSpeed || diagnostics.theoreticalSpeed;
  diagnostics.strideS = cfg.strideS;

  rig.resetPose();
  rig.update();

  return { clip, diagnostics, cfg };
}

/** Минимальный idle-фолбэк (дыхание), если в модели нет своего */
export function buildIdleClip(rig, options = {}) {
  const duration = options.duration || 3.2;
  const samples = 24;
  const times = [];
  const rot = new Map();
  for (const key of ['spine', 'chest', 'neck', 'head', 'upperArmL', 'upperArmR', 'forearmL', 'forearmR']) {
    if (rig.has(key)) rot.set(key, []);
  }

  for (let i = 0; i <= samples; i++) {
    const phase = (i % samples) / samples;
    times.push(+(phase * duration).toFixed(4));
    rig.resetPose();
    const br = Math.sin(TAU * phase);
    if (rig.has('spine')) rig.pose('spine', br * 0.012, 0, 0);
    if (rig.has('chest')) rig.pose('chest', br * 0.02, 0, 0);
    if (rig.has('neck')) rig.pose('neck', -br * 0.012, 0, 0);
    if (rig.has('head')) {
      rig.pose('head', -br * 0.01, Math.sin(TAU * phase + 1) * 0.02, Math.sin(TAU * phase * 0.5) * 0.02);
    }
    if (rig.has('upperArmL')) rig.pose('upperArmL', br * 0.01, 0, 0.02 + br * 0.008);
    if (rig.has('upperArmR')) rig.pose('upperArmR', br * 0.01, 0, -0.02 - br * 0.008);
    if (rig.has('forearmL')) rig.pose('forearmL', -0.05, 0, 0);
    if (rig.has('forearmR')) rig.pose('forearmR', -0.05, 0, 0);

    for (const key of rot.keys()) {
      const q = rig.bones[key].quaternion;
      rot.get(key).push(q.x, q.y, q.z, q.w);
    }
  }

  const tracks = [];
  for (const [key, values] of rot) {
    const name = rig.trackName(key, 'quaternion');
    if (name) tracks.push(new THREE.QuaternionKeyframeTrack(name, times, values));
  }
  rig.resetPose();
  const clip = new THREE.AnimationClip(options.name || 'idle_procedural', duration, tracks);
  clip.optimize?.();
  return clip;
}
