import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { clone as cloneSkinned } from 'three/addons/utils/SkeletonUtils.js';
import { HumanoidRig } from '../anim/humanoidRig.js';
import { buildWalkClip, buildIdleClip, analyzeFootPlant, resolveConfig } from '../anim/walkClip.js';
import { buildMannequin } from '../anim/mannequin.js';
import { installDiagnostics, webglSupport } from '../diag.js';

const diag = installDiagnostics('РИГ');
const gl = webglSupport();
if (!gl.ok) {
  diag.fatal(
    'WebGL недоступен в этом окне',
    'Браузер не выдал 3D-контекст. Открой страницу в отдельной вкладке (кнопка ⤢ в превью) — в iframe 3D иногда блокируется.',
  );
  throw new Error('webgl-unavailable');
}
diag.status(`WebGL: ${gl.version} · ${gl.name}`);
{
  const el = document.getElementById('iGL');
  if (el) {
    el.textContent = gl.ok ? `${gl.version} ✓` : 'НЕДОСТУПЕН';
    el.className = gl.ok ? 'good' : 'bad';
    el.title = gl.name;
  }
}

/* --------------------------------- сцена --------------------------------- */

const canvas = document.getElementById('scene');
let renderer;
try {
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
} catch (err) {
  diag.fatal('Не удалось создать 3D-рендерер', String(err?.message || err));
  throw err;
}

/** В iframe превью канвас может родиться с нулевым размером — подгоняем постоянно */
function fitRenderer() {
  const w = Math.max(1, canvas.clientWidth || window.innerWidth || 1);
  const h = Math.max(1, canvas.clientHeight || window.innerHeight || 1);
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const bw = Math.floor(w * dpr);
  const bh = Math.floor(h * dpr);
  if (canvas.width === bw && canvas.height === bh) return false;
  renderer.setPixelRatio(dpr);
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  return true;
}

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;
renderer.outputColorSpace = THREE.SRGBColorSpace;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x05070f);
scene.fog = new THREE.FogExp2(0x05070f, 0.055);

const camera = new THREE.PerspectiveCamera(46, (window.innerWidth || 1) / (window.innerHeight || 1), 0.05, 200);
camera.position.set(2.6, 1.9, 3.4);
fitRenderer();

try {
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
} catch (err) {
  console.warn('окружение не собралось:', err);
}

scene.add(new THREE.HemisphereLight(0x8fb4ff, 0x080a14, 0.65));

const key = new THREE.DirectionalLight(0xffffff, 2.1);
key.position.set(4, 7, 5);
key.castShadow = true;
key.shadow.mapSize.set(1024, 1024);
key.shadow.camera.near = 0.5;
key.shadow.camera.far = 30;
key.shadow.camera.left = -6;
key.shadow.camera.right = 6;
key.shadow.camera.top = 8;
key.shadow.camera.bottom = -2;
key.shadow.bias = -0.0006;
scene.add(key);

const rimCyan = new THREE.PointLight(0x00d5ff, 26, 16, 2);
rimCyan.position.set(-3.4, 2.2, -2.6);
scene.add(rimCyan);

const rimMagenta = new THREE.PointLight(0xff3fd0, 22, 16, 2);
rimMagenta.position.set(3.2, 1.4, 2.8);
scene.add(rimMagenta);

// пол
const floor = new THREE.Mesh(
  new THREE.CircleGeometry(26, 64),
  new THREE.MeshStandardMaterial({ color: 0x080c18, roughness: 0.72, metalness: 0.35 }),
);
floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;
scene.add(floor);

const grid = new THREE.GridHelper(52, 52, 0x1b4a7a, 0x0e2038);
grid.position.y = 0.002;
grid.material.transparent = true;
grid.material.opacity = 0.65;
scene.add(grid);

// светящееся кольцо-подиум
const ring = new THREE.Mesh(
  new THREE.RingGeometry(1.35, 1.42, 96),
  new THREE.MeshBasicMaterial({ color: 0x00d5ff, transparent: true, opacity: 0.5, side: THREE.DoubleSide }),
);
ring.rotation.x = -Math.PI / 2;
ring.position.y = 0.004;
scene.add(ring);

/* ------------------------------- состояние ------------------------------- */

const state = {
  holder: new THREE.Group(),
  modelHolder: new THREE.Group(),
  model: null,
  modelName: 'манекен',
  rig: null,
  mixer: null,
  idleAction: null,
  walkAction: null,
  hasOwnIdle: false,
  walkClip: null,
  walkCfg: null,
  preset: 'stalker',
  matchedSpeed: 1.8,
  speed: 0,
  facing: 0,
  keys: new Set(),
  shift: false,
  skeleton: null,
  dragging: false,
  lastPointer: { x: 0, y: 0 },
  camYaw: 0.55,
  camPitch: 0.18,
  camDist: 4.1,
};
scene.add(state.holder);
state.holder.add(state.modelHolder);
scene.add(key.target);

/* --------------------------------- UI ---------------------------------- */

// превью в Arena открывается с токеном в query — сохраняем его при переходе
{
  const fpsLink = document.getElementById('fpsLink');
  if (fpsLink && location.search) fpsLink.href += location.search;
}

const $ = (id) => document.getElementById(id);
const ui = {
  model: $('iModel'),
  bones: $('iBones'),
  conv: $('iConv'),
  idle: $('iIdle'),
  walk: $('iWalk'),
  step: $('iStep'),
  speed: $('iSpeed'),
  warn: $('warn'),
  toast: $('toast'),
  loading: $('loading'),
};

let toastTimer = 0;
function toast(text, ms = 2600) {
  ui.toast.textContent = text;
  ui.toast.classList.remove('hidden');
  requestAnimationFrame(() => ui.toast.classList.add('show'));
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    ui.toast.classList.remove('show');
    setTimeout(() => ui.toast.classList.add('hidden'), 260);
  }, ms);
}

function setInfo() {
  ui.model.textContent = state.modelName;
  ui.bones.textContent = state.rig ? `${state.rig.allBones.length} · ${Object.keys(state.rig.bones).length} распознано` : '—';
  ui.bones.className = state.rig && state.rig.allBones.length ? 'good' : 'bad';
  ui.conv.textContent = state.rig ? detectConvention() : '—';
  ui.idle.textContent = state.hasOwnIdle ? 'свой клип из GLB' : 'процедурный';
  ui.idle.className = state.hasOwnIdle ? 'good' : '';
  ui.walk.textContent = state.walkClip ? (state.hasBakedWalk ? 'клип из GLB' : 'процедурная (IK)') : '—';
  ui.walk.className = state.walkClip ? 'good' : 'bad';
  ui.step.textContent = state.walkCfg
    ? `${state.walkCfg.strideS * 2} м · ${(2 / state.walkCfg.duration).toFixed(1)} ш/с`
    : '—';
}

function detectConvention() {
  if (!state.rig) return '—';
  const names = state.rig.allBones.map((b) => b.name).join(' ');
  if (/mixamorig/i.test(names)) return 'Mixamo';
  if (/pelvis|thigh|calf|upperarm/i.test(names)) return 'UE-подобная';
  if (/upper_arm|forearm|thigh|shin/i.test(names)) return 'Rigify-подобная';
  if (/hips|spine|arm|leg/i.test(names)) return 'самописная';
  return 'не распознана';
}

/* ----------------------------- загрузка модели ----------------------------- */

function clearModel() {
  if (state.model) {
    state.modelHolder.remove(state.model);
    state.model.traverse((o) => {
      if (o.geometry) o.geometry.dispose?.();
    });
  }
  if (state.skeleton) {
    state.holder.remove(state.skeleton);
    state.skeleton = null;
  }
  state.model = null;
  state.rig = null;
  state.mixer = null;
  state.idleAction = null;
  state.walkAction = null;
  state.walkClip = null;
  state.hasOwnIdle = false;
  state.hasBakedWalk = false;
  state.showSkeleton = state.showSkeleton || false;
}

const loader = new GLTFLoader();

async function loadGLB(url, name, timeoutMs = 15000) {
  // Vite на неизвестный путь отдаёт index.html — проверяем, что это правда GLB
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  let res;
  try {
    res = await fetch(url, { cache: 'no-store', signal: ctrl.signal });
  } finally {
    clearTimeout(timer);
  }
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const type = res.headers.get('content-type') || '';
  if (type.includes('text/html')) throw new Error('файл не найден');
  const buffer = await res.arrayBuffer();
  if (buffer.byteLength < 1024) throw new Error('файл пустой');
  if (buffer.byteLength < 12) throw new Error('пустой файл');
  const gltf = await new Promise((resolve, reject) => {
    loader.parse(buffer, '', resolve, reject);
  });
  setModel(gltf.scene, gltf.animations || [], name);
}

async function loadFile(file) {
  const url = URL.createObjectURL(file);
  try {
    const gltf = await loader.loadAsync(url);
    setModel(gltf.scene, gltf.animations || [], file.name);
    toast(`Загружено: ${file.name}`);
  } catch (err) {
    console.error(err);
    toast('Не удалось прочитать GLB — проверь файл');
  } finally {
    URL.revokeObjectURL(url);
  }
}

function setModel(root, animations, name) {
  clearModel();
  state.modelName = name;
  diag.status(`WebGL: ${gl.version} · модель: ${name}`);

  // нормализуем размер: рост ~1.85 м, ступни на полу
  root.updateWorldMatrix(true, true);
  let box = new THREE.Box3().setFromObject(root);
  let size = box.getSize(new THREE.Vector3());
  if (!Number.isFinite(size.y) || size.y <= 0.0001) size.set(1, 1.8, 1);
  const targetHeight = 1.85;
  const scale = size.y > 2.6 || size.y < 1.15 ? targetHeight / size.y : 1;
  root.scale.multiplyScalar(scale);
  root.updateWorldMatrix(true, true);
  box = new THREE.Box3().setFromObject(root);
  root.position.y -= box.min.y;

  // тени
  root.traverse((o) => {
    if (o.isMesh || o.isSkinnedMesh) {
      o.castShadow = true;
      o.receiveShadow = true;
      o.frustumCulled = false;
      if (o.material) o.material.side = THREE.FrontSide;
    }
  });

  state.model = root;
  state.modelHolder.add(root);

  // риг + автоориентация: модель должна смотреть в +Z
  state.modelHolder.rotation.y = 0;
  state.flipOffset = 0;
  state.holder.updateMatrixWorld(true);
  root.updateWorldMatrix(true, true);

  let rig = new HumanoidRig(root);
  if (rig.axes.forwardVerified) {
    const dir = rig.axes.forward;
    if (dir.z < 0.7) {
      const angle = Math.atan2(dir.x, dir.z);
      state.baseRot = -angle;
      state.modelHolder.rotation.y = state.baseRot;
      state.holder.updateMatrixWorld(true);
      root.updateWorldMatrix(true, true);
      rig = new HumanoidRig(root);
    } else {
      state.baseRot = 0;
    }
  } else {
    state.baseRot = 0;
  }

  state.rig = rig;
  state.mixer = new THREE.AnimationMixer(root);

  const ownIdle = animations.find((a) => /idle|stand|breath|дыш/i.test(a.name || ''));
  state.hasOwnIdle = !!ownIdle;
  const idleClip = ownIdle || buildIdleClip(rig);
  state.idleAction = state.mixer.clipAction(idleClip);
  state.idleAction.play();
  state.idleAction.setEffectiveWeight(1);

  const missing = ['hips', 'thighL', 'thighR', 'shinL', 'shinR', 'footL', 'footR'].filter((k) => !rig.has(k));
  if (missing.length) {
    ui.warn.classList.remove('hidden');
    ui.warn.textContent =
      'Не найдены ключевые кости: ' + missing.join(', ') +
      '. Походка не сможет построиться — проверь, что модель ригнута, и напиши мне.';
    state.walkAction = null;
    state.walkClip = null;
  } else {
    ui.warn.classList.add('hidden');
    // если в файле уже есть готовый клип ходьбы — играем его, иначе строим сами
    const bakedWalk = animations.find((a) => /walk|ходьб|run/i.test(a.name || ''));
    if (bakedWalk) {
      const cfg = resolveConfig(rig, { preset: state.preset });
      const diag = analyzeFootPlant(rig, cfg);
      state.walkCfg = cfg;
      state.hasBakedWalk = true;
      state.matchedSpeed = diag.matchedSpeed || 1.8;
      state.walkClip = bakedWalk;
      state.walkAction = state.mixer.clipAction(bakedWalk);
      state.walkAction.play();
      state.walkAction.setEffectiveWeight(0);
      state.walkDiagnostics = diag;
      console.info('[walk] из GLB', diag);
    } else {
      buildWalk(state.preset);
    }
  }

  if (state.skeleton) {
    state.holder.remove(state.skeleton);
    state.skeleton = null;
  }
  state.skeleton = new THREE.SkeletonHelper(root);
  state.skeleton.visible = !!state.showSkeleton;
  state.skeleton.material.color = new THREE.Color(0x00e0ff);
  state.holder.add(state.skeleton);

  state.speed = 0;
  setInfo();
}

function buildWalk(preset) {
  if (!state.rig) return;
  state.preset = preset;
  if (state.walkAction) {
    state.walkAction.stop();
    if (state.walkClip) state.mixer.uncacheClip(state.walkClip);
    state.walkAction = null;
  }
  const { clip, diagnostics, cfg } = buildWalkClip(state.rig, { preset });
  state.hasBakedWalk = false;
  state.walkClip = clip;
  state.walkCfg = cfg;
  state.walkDiagnostics = diagnostics;
  state.matchedSpeed = diagnostics.matchedSpeed || 1.8;
  state.walkAction = state.mixer.clipAction(clip);
  state.walkAction.play();
  state.walkAction.setEffectiveWeight(0);
  setInfo();

  if (diagnostics) {
    console.info('[walk]', diagnostics);
  }
}

/* ------------------------------ управление ------------------------------ */

addEventListener('keydown', (e) => {
  const k = e.key.toLowerCase();
  if (['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' '].includes(k)) e.preventDefault();
  state.keys.add(k);
  if (e.shiftKey) state.shift = true;
  if (k === 'shift') state.shift = true;
  if (k === 'r') {
    state.holder.position.set(0, 0, 0);
    state.facing = 0;
    state.speed = 0;
  }
});
addEventListener('keyup', (e) => {
  state.keys.delete(e.key.toLowerCase());
  if (e.key === 'Shift') state.shift = false;
});
addEventListener('blur', () => {
  state.keys.clear();
  state.shift = false;
});

canvas.addEventListener('pointerdown', (e) => {
  state.dragging = true;
  state.lastPointer = { x: e.clientX, y: e.clientY };
  canvas.setPointerCapture(e.pointerId);
});
canvas.addEventListener('pointermove', (e) => {
  if (!state.dragging) return;
  const dx = e.clientX - state.lastPointer.x;
  const dy = e.clientY - state.lastPointer.y;
  state.lastPointer = { x: e.clientX, y: e.clientY };
  state.camYaw -= dx * 0.006;
  state.camPitch = THREE.MathUtils.clamp(state.camPitch + dy * 0.004, -0.35, 0.9);
});
canvas.addEventListener('pointerup', (e) => {
  state.dragging = false;
  canvas.releasePointerCapture?.(e.pointerId);
});
canvas.addEventListener('wheel', (e) => {
  e.preventDefault();
  state.camDist = THREE.MathUtils.clamp(state.camDist + e.deltaY * 0.0022, 1.6, 12);
});

/* --------------------------------- ввод UI -------------------------------- */

$('btnLoad').addEventListener('click', () => $('file').click());
$('file').addEventListener('change', (e) => {
  const file = e.target.files?.[0];
  if (file) loadFile(file);
  e.target.value = '';
});

$('btnSkeleton').addEventListener('click', (e) => {
  state.showSkeleton = !state.showSkeleton;
  if (state.skeleton) state.skeleton.visible = state.showSkeleton;
  e.currentTarget.classList.toggle('active', state.showSkeleton);
});

$('btnFlip').addEventListener('click', () => {
  state.flipOffset = (state.flipOffset || 0) + Math.PI;
  state.modelHolder.rotation.y = (state.baseRot || 0) + state.flipOffset;
  state.holder.updateMatrixWorld(true);
  if (state.model) {
    state.model.updateWorldMatrix(true, true);
    state.rig = new HumanoidRig(state.model);
    state.mixer = new THREE.AnimationMixer(state.model);
    // пересоздаём действия после пересборки рига
    const idleClip = state.idleAction?.getClip();
    if (idleClip) {
      state.idleAction = state.mixer.clipAction(idleClip).play();
      state.idleAction.setEffectiveWeight(1);
    }
    buildWalk(state.preset);
  }
});

$('btnPreset').addEventListener('click', (e) => {
  const next = state.preset === 'stalker' ? 'calm' : 'stalker';
  buildWalk(next);
  e.currentTarget.textContent = next === 'stalker' ? 'Походка: маньяк' : 'Походка: спокойная';
  e.currentTarget.classList.toggle('active', next === 'calm');
  toast(next === 'stalker' ? 'Быстрая «маньячная» походка' : 'Спокойная прогулка');
});

$('btnExport').addEventListener('click', async () => {
  if (!state.model) return;
  toast('Собираем GLB…');
  try {
    const animations = [];
    if (state.idleAction) animations.push(state.idleAction.getClip());
    if (state.walkClip) animations.push(state.walkClip);

    const clone = cloneSkinned(state.model);
    const exporter = new GLTFExporter();
    const glb = await new Promise((resolve, reject) => {
      exporter.parse(clone, resolve, reject, {
        binary: true,
        animations,
        onlyVisible: false,
        includeCustomExtensions: false,
      });
    });
    const blob = new Blob([glb], { type: 'model/gltf-binary' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = (state.modelName.replace(/\.(glb|gltf)$/i, '') || 'character') + '_walk.glb';
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 4000);
    toast('GLB с idle + walk скачан');
  } catch (err) {
    console.error(err);
    toast('Экспорт не удался: ' + (err?.message || err));
  }
});

/* --------------------------------- цикл --------------------------------- */

const clock = new THREE.Clock();
const camTarget = new THREE.Vector3(0, 1.1, 0);
let walkBlend = 0;

function animate() {
  const dt = Math.min(clock.getDelta(), 0.05);

  // --- ввод ---
  const k = state.keys;
  const forward = (k.has('w') || k.has('arrowup') ? 1 : 0) - (k.has('s') || k.has('arrowdown') ? 1 : 0);
  const strafe = (k.has('d') || k.has('arrowright') ? 1 : 0) - (k.has('a') || k.has('arrowleft') ? 1 : 0);
  const moving = forward !== 0 || strafe !== 0;

  const maxSpeed = state.matchedSpeed * (state.shift ? 1.5 : 1);
  const targetSpeed = moving ? maxSpeed : 0;
  state.speed = THREE.MathUtils.damp(state.speed, targetSpeed, moving ? 4.2 : 7, dt);

  if (moving) {
    // «вперёд» — от камеры к персонажу
    const camDir = new THREE.Vector3(-Math.sin(state.camYaw), 0, -Math.cos(state.camYaw));
    const rightDir = new THREE.Vector3(Math.cos(state.camYaw), 0, -Math.sin(state.camYaw));
    const dir = camDir.multiplyScalar(forward).add(rightDir.multiplyScalar(strafe)).normalize();
    const targetFacing = Math.atan2(dir.x, dir.z);
    let diff = targetFacing - state.facing;
    while (diff > Math.PI) diff -= Math.PI * 2;
    while (diff < -Math.PI) diff += Math.PI * 2;
    state.facing += diff * Math.min(1, dt * 9);
  }

  // поворот персонажа к направлению движения (модель уже смотрит в +Z внутри holder)
  state.holder.rotation.y = state.facing;

  if (state.speed > 0.001) {
    const dir = new THREE.Vector3(Math.sin(state.facing), 0, Math.cos(state.facing));
    state.holder.position.addScaledVector(dir, state.speed * dt);
    const limit = 22;
    state.holder.position.x = THREE.MathUtils.clamp(state.holder.position.x, -limit, limit);
    state.holder.position.z = THREE.MathUtils.clamp(state.holder.position.z, -limit, limit);
  }

  // --- анимация ---
  const canWalk = !!state.walkAction;
  const wanted = canWalk ? THREE.MathUtils.clamp(state.speed / (state.matchedSpeed * 0.85), 0, 1) : 0;
  walkBlend = THREE.MathUtils.damp(walkBlend, wanted, 9, dt);

  if (state.walkAction) {
    state.walkAction.setEffectiveWeight(walkBlend);
    const scale = state.matchedSpeed > 0.01 ? state.speed / state.matchedSpeed : 1;
    state.walkAction.setEffectiveTimeScale(THREE.MathUtils.clamp(scale, 0.35, 1.9));
  }
  if (state.idleAction) {
    state.idleAction.setEffectiveWeight(1 - walkBlend * 0.92);
    state.idleAction.setEffectiveTimeScale(1);
  }
  if (state.mixer) state.mixer.update(dt);

  // --- камера ---
  const focus = state.holder.position.clone().add(new THREE.Vector3(0, 1.15, 0));
  camTarget.lerp(focus, 1 - Math.exp(-8 * dt));
  const cp = state.camPitch;
  const offset = new THREE.Vector3(
    Math.sin(state.camYaw) * Math.cos(cp),
    Math.sin(cp) + 0.28,
    Math.cos(state.camYaw) * Math.cos(cp),
  ).multiplyScalar(state.camDist);
  camera.position.lerp(camTarget.clone().add(offset), 1 - Math.exp(-6 * dt));
  camera.lookAt(camTarget);

  // --- скелет и свет ---
  if (state.skeleton) state.skeleton.update();
  key.position.set(state.holder.position.x + 4, 7, state.holder.position.z + 5);
  key.target.position.copy(state.holder.position);
  key.target.updateMatrixWorld();

  // --- UI ---
  ui.speed.textContent = `${state.speed.toFixed(1)} м/с`;
  ui.speed.className = state.speed > 0.1 ? 'good' : '';

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

/* ------------------------------- старт --------------------------------- */

addEventListener('resize', () => fitRenderer());
new ResizeObserver(() => fitRenderer()).observe(canvas);

async function boot() {
  // сцену крутим сразу: даже если модель не приедет, экран не будет пустым
  animate();
  requestAnimationFrame(() => {
    ui.loading.classList.add('done');
    setTimeout(() => ui.loading.classList.add('hidden'), 400);
  });

  try {
    await loadGLB('assets/models/character.glb', 'character.glb');
    toast('Модель загружена из assets/models/character.glb');
  } catch (err) {
    console.warn('[load]', err);
    setModel(buildMannequin(), [], 'манекен');
    toast('Модель не загрузилась — показываю манекен. Можно подгрузить свой GLB.', 5000);
  }
}

boot();
