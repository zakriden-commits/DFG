import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { HumanoidRig } from '../anim/humanoidRig.js';
import { resolveConfig, analyzeFootPlant } from '../anim/walkClip.js';
import { makeAvatar, stepAvatar, damp, DEFAULTS } from './controller.js';
import { installDiagnostics, webglSupport } from '../diag.js';

const diag = installDiagnostics('MICHAEL');
const gl = webglSupport();
if (!gl.ok) {
  diag.fatal(
    'WebGL недоступен в этом окне',
    'Браузер не выдал 3D-контекст. Открой страницу в отдельной вкладке (кнопка ⤢ в превью) — в iframe 3D иногда блокируется.',
  );
  throw new Error('webgl-unavailable');
}

/**
 * Третье лицо в жёлтой пустоте.
 *
 * Вход — сразу в сцену: ни кнопки «ВОЙТИ», ни загрузочного экрана, ни леса.
 * Жёлтое пространство без предметов, камера за спиной, играешь Майклом.
 * Движение считается в src/game/controller.js (его гоняет test/tp-controller.mjs),
 * здесь только сцена, модель, камера и HUD.
 */

const CFG = {
  avatarHeight: 1.85,
  camPitch: 0.17, // наклон камеры сверху вниз
  camDist: 4.6,
  camMinDist: 2.2,
  camMaxDist: 9,
  camHeight: 1.42, // точка, вокруг которой крутится камера (пояс/грудь)
  lookHeight: 1.3,
  lookSpeed: 0.0026,
  camFollow: 14, // сглаживание позиции камеры, 1/с
  camPitchMin: -0.28,
  camPitchMax: 1.15,
  shadowHalf: 14,
};

const YELLOW = {
  sky: new THREE.Color(0xf2c41b),
  ground: 0xe6b90f, // чуть темнее неба: пол угадывается, но границы нет
  grid: 0xc08f06,
};

const clamp = THREE.MathUtils.clamp;

// рабочая копия: clipSpeed уточняется по факту загрузки модели
const MOVE = { ...DEFAULTS };

/* --------------------------------- рендерер ------------------------------- */

const canvas = document.getElementById('scene');
let renderer;
try {
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
} catch (err) {
  diag.fatal('Не удалось создать 3D-рендерер', String(err?.message || err));
  throw err;
}

const scene = new THREE.Scene();
scene.background = YELLOW.sky;
scene.fog = new THREE.Fog(YELLOW.sky, 26, 105); // пустота уходит в тот же жёлтый

const camera = new THREE.PerspectiveCamera(58, 1, 0.08, 600);
camera.rotation.order = 'YXZ';
scene.add(camera);

/** в iframe канвас может родиться нулевым — подгоняем постоянно */
function fitRenderer() {
  const w = Math.max(1, canvas.clientWidth || innerWidth || 1);
  const h = Math.max(1, canvas.clientHeight || innerHeight || 1);
  const dpr = Math.min(devicePixelRatio || 1, 2);
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
renderer.toneMappingExposure = 1.0;
fitRenderer();

canvas.addEventListener('webglcontextlost', (e) => {
  e.preventDefault();
  diag.fatal('Потерян 3D-контекст', 'GPU отвалился — обнови страницу. Если повторяется, открой её в отдельной вкладке.');
});

/* ---------------------------------- свет ---------------------------------- */

// тёплый верхний свет: тень Майкла на жёлтом — главный ориентир движения
const key = new THREE.DirectionalLight(0xfff4d6, 2.4);
key.position.set(6, 13, 5);
key.castShadow = true;
key.shadow.mapSize.set(2048, 2048);
key.shadow.camera.near = 1;
key.shadow.camera.far = 46;
key.shadow.camera.left = -CFG.shadowHalf;
key.shadow.camera.right = CFG.shadowHalf;
key.shadow.camera.top = CFG.shadowHalf;
key.shadow.camera.bottom = -CFG.shadowHalf;
key.shadow.bias = -0.0006;
key.shadow.normalBias = 0.03;
scene.add(key);
scene.add(key.target);

scene.add(new THREE.HemisphereLight(0xfff3cf, 0xb8860b, 1.55));

// контровой свет сзади — силуэт не сливается с жёлтым
const rim = new THREE.DirectionalLight(0xffd76a, 0.9);
rim.position.set(-6, 5, -9);
scene.add(rim);

/* -------------------------------- пустота --------------------------------- */

// Пол — плоский, без освещения и без tone mapping: он ровно того же жёлтого,
// что и фон, поэтому горизонта нет и пространство выглядит бесконечным.
// Плоскость едет за игроком, так что её край никогда не попадает в кадр.
const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(700, 700),
  new THREE.MeshBasicMaterial({ color: YELLOW.ground, toneMapped: false }),
);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

// Тень: отдельная невидимая плоскость-приёмник поверх пола — настоящая,
// от направленного света, но не трогает цвет пола.
const shadowCatcher = new THREE.Mesh(
  new THREE.PlaneGeometry(90, 90),
  new THREE.ShadowMaterial({ color: 0x4a3400, opacity: 0.34, toneMapped: false }),
);
shadowCatcher.rotation.x = -Math.PI / 2;
shadowCatcher.position.y = 0.002;
shadowCatcher.receiveShadow = true;
scene.add(shadowCatcher);

// еле заметная сетка 2.5 м: даёт чувство скорости, но пространство остаётся пустым
const CELL = 2.5;
const GRID_DIV = 96;
const grid = new THREE.GridHelper(CELL * GRID_DIV, GRID_DIV, YELLOW.grid, YELLOW.grid);
grid.material.transparent = true;
grid.material.opacity = 0.16;
grid.material.depthWrite = false;
grid.material.toneMapped = false;
grid.position.y = 0.006;
scene.add(grid);

/* -------------------------------- персонаж -------------------------------- */

const avatar = makeAvatar({ x: 0, z: 0, facing: Math.PI });
const holder = new THREE.Group(); // позиция и поворот в мире
const inner = new THREE.Group(); // поправка «куда смотрит» сама модель
holder.add(inner);
scene.add(holder);

const michael = {
  root: null,
  mixer: null,
  idle: null,
  walk: null,
  clipSpeed: DEFAULTS.clipSpeed,
  ready: false,
  error: null,
};

const loader = new GLTFLoader();

async function loadMichael() {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 15000);
  let res;
  try {
    res = await fetch('assets/models/character.glb', { cache: 'no-store', signal: ctrl.signal });
  } finally {
    clearTimeout(timer);
  }
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buf = await res.arrayBuffer();
  if (buf.byteLength < 1024) throw new Error(`файл пустой (${buf.byteLength} Б)`);
  const gltf = await new Promise((resolve, reject) => loader.parse(buf, '', resolve, reject));
  const root = gltf.scene;

  // рост 1.85 м, ступни ровно на земле
  root.updateWorldMatrix(true, true);
  let box = new THREE.Box3().setFromObject(root);
  const size = box.getSize(new THREE.Vector3());
  const scale = size.y > 2.6 || size.y < 1.15 ? CFG.avatarHeight / size.y : 1;
  root.scale.multiplyScalar(scale);
  root.updateWorldMatrix(true, true);
  box = new THREE.Box3().setFromObject(root);
  root.position.y -= box.min.y;

  root.traverse((o) => {
    if (o.isMesh || o.isSkinnedMesh) {
      o.castShadow = true;
      o.receiveShadow = true;
      o.frustumCulled = false;
    }
  });

  michael.root = root;
  inner.add(root);

  // скорость шага берём из самого клипа: тогда timeScale = speed / clipSpeed
  const rig = new HumanoidRig(root);
  const cfg = resolveConfig(rig, { preset: 'stalker' });
  const plant = analyzeFootPlant(rig, cfg);
  michael.clipSpeed = plant.matchedSpeed || DEFAULTS.clipSpeed;
  MOVE.clipSpeed = michael.clipSpeed; // логика движения считает по этой же цифре

  // модель смотрит не строго в +Z — доворачиваем, иначе идёт боком
  if (rig.axes.forwardVerified) {
    inner.rotation.y = -Math.atan2(rig.axes.forward.x, rig.axes.forward.z);
  }

  michael.mixer = new THREE.AnimationMixer(root);
  const idleClip = THREE.AnimationClip.findByName(gltf.animations, 'Idle') || gltf.animations[0];
  const walkClip =
    THREE.AnimationClip.findByName(gltf.animations, 'walk') || gltf.animations.find((a) => /walk/i.test(a.name));

  if (idleClip) {
    michael.idle = michael.mixer.clipAction(idleClip);
    michael.idle.play();
  }
  if (walkClip) {
    michael.walk = michael.mixer.clipAction(walkClip);
    michael.walk.play();
    michael.walk.setEffectiveWeight(0);
  }
  michael.ready = true;
  console.info('[michael]', { clipSpeed: michael.clipSpeed, idle: idleClip?.name, walk: walkClip?.name });
}

/* -------------------------------- ввод ------------------------------------ */

const keys = new Set();
const input = { forward: false, back: false, left: false, right: false, run: false };

function syncInput() {
  input.forward = keys.has('w') || keys.has('arrowup') || keys.has('ц');
  input.back = keys.has('s') || keys.has('arrowdown') || keys.has('ы');
  input.left = keys.has('a') || keys.has('arrowleft') || keys.has('ф');
  input.right = keys.has('d') || keys.has('arrowright') || keys.has('в');
  input.run = keys.has('shift');
}

addEventListener('keydown', (e) => {
  const k = e.key.toLowerCase();
  if (
    ['w', 'a', 's', 'd', 'shift', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'ц', 'ы', 'ф', 'в'].includes(k)
  ) {
    e.preventDefault();
  }
  keys.add(k);
  syncInput();
});
addEventListener('keyup', (e) => {
  keys.delete(e.key.toLowerCase());
  syncInput();
});
addEventListener('blur', () => {
  keys.clear();
  syncInput();
});

const cam = { yaw: 0, pitch: CFG.camPitch, dist: CFG.camDist };
const lookAt = new THREE.Vector3(0, CFG.lookHeight, 0);
const camPos = new THREE.Vector3();
const lookWant = new THREE.Vector3();

let locked = false;
let dragging = false;

canvas.addEventListener('mousedown', (e) => {
  if (e.button !== 0) return;
  dragging = true;
});
addEventListener('mouseup', () => {
  dragging = false;
});

canvas.addEventListener('click', () => {
  if (locked) return;
  // в iframe захват курсора может быть запрещён — тогда работает перетаскивание
  try {
    const p = canvas.requestPointerLock?.();
    if (p && typeof p.catch === 'function') p.catch(() => {});
  } catch {}
});

document.addEventListener('pointerlockchange', () => {
  locked = document.pointerLockElement === canvas;
  document.body.classList.toggle('locked', locked);
});

addEventListener('mousemove', (e) => {
  if (!locked && !dragging) return;
  cam.yaw -= e.movementX * CFG.lookSpeed;
  cam.pitch = clamp(cam.pitch + e.movementY * CFG.lookSpeed, CFG.camPitchMin, CFG.camPitchMax);
});

canvas.addEventListener(
  'wheel',
  (e) => {
    e.preventDefault();
    cam.dist = clamp(cam.dist * (1 + Math.sign(e.deltaY) * 0.1), CFG.camMinDist, CFG.camMaxDist);
  },
  { passive: false },
);

// на телефоне: палец по экрану — камера
let touchId = null;
let touchPrev = { x: 0, y: 0 };
canvas.addEventListener('touchstart', (e) => {
  const t = e.changedTouches[0];
  if (!t) return;
  touchId = t.identifier;
  touchPrev = { x: t.clientX, y: t.clientY };
});
canvas.addEventListener('touchmove', (e) => {
  for (const t of e.changedTouches) {
    if (t.identifier !== touchId) continue;
    cam.yaw -= (t.clientX - touchPrev.x) * CFG.lookSpeed * 1.6;
    cam.pitch = clamp(cam.pitch + (t.clientY - touchPrev.y) * CFG.lookSpeed * 1.6, CFG.camPitchMin, CFG.camPitchMax);
    touchPrev = { x: t.clientX, y: t.clientY };
  }
});
canvas.addEventListener('touchend', () => {
  touchId = null;
});

/* ---------------------------------- HUD ----------------------------------- */

const ui = {
  state: document.getElementById('gState'),
  speed: document.getElementById('gSpeed'),
  note: document.getElementById('gNote'),
  hint: document.getElementById('gHint'),
};

// ссылки должны нести токен превью, иначе из iframe получим 403
if (location.search) {
  for (const a of document.querySelectorAll('a.keep-token')) a.href += location.search;
}

function setNote(text, bad = false) {
  if (!ui.note) return;
  ui.note.textContent = text;
  ui.note.classList.toggle('bad', bad);
}

setNote(gl.ok ? `3D: ${gl.version} ✓` : '3D: недоступен в этом окне', !gl.ok);

/* -------------------------------- камера ---------------------------------- */

function updateCamera(dt, instant = false) {
  const horiz = Math.cos(cam.pitch) * cam.dist;
  camPos.set(
    avatar.x + Math.sin(cam.yaw) * horiz,
    CFG.camHeight + Math.sin(cam.pitch) * cam.dist,
    avatar.z + Math.cos(cam.yaw) * horiz,
  );
  // ниже земли не опускаемся
  camPos.y = Math.max(camPos.y, 0.35);

  const k = instant ? 1 : 1 - Math.exp(-CFG.camFollow * dt);
  camera.position.lerp(camPos, k);

  lookWant.set(avatar.x, CFG.lookHeight, avatar.z);
  lookAt.lerp(lookWant, instant ? 1 : 1 - Math.exp(-CFG.camFollow * 0.75 * dt));
  camera.lookAt(lookAt);

  // лёгкое расширение обзора на разгоне — «бежит»
  const fov = 58 + clamp((avatar.speed - MOVE.walkSpeed) / 2.2, -0.6, 1) * 4;
  if (Math.abs(camera.fov - fov) > 0.01) {
    camera.fov = damp(camera.fov, fov, 6, dt);
    camera.updateProjectionMatrix();
  }
}

/* --------------------------------- цикл ----------------------------------- */

const clock = new THREE.Clock();
let fpsAccum = 0;
let fpsFrames = 0;
let frameNo = 0;

function animate() {
  const dt = Math.min(clock.getDelta(), 0.05);
  if (frameNo++ % 20 === 0) fitRenderer();

  stepAvatar(avatar, input, cam.yaw, dt, MOVE);
  holder.position.set(avatar.x, 0, avatar.z);
  holder.rotation.y = avatar.facing;

  if (michael.ready) {
    if (michael.walk) {
      michael.walk.setEffectiveWeight(avatar.walkWeight);
      michael.walk.setEffectiveTimeScale(avatar.timeScale);
    }
    if (michael.idle) michael.idle.setEffectiveWeight(1 - avatar.walkWeight * 0.98);
    michael.mixer.update(dt);
  }

  // мир «бесконечный»: пол и сетка едут за игроком, сетка — по шагу клетки
  ground.position.set(avatar.x, 0, avatar.z);
  shadowCatcher.position.set(avatar.x, 0.002, avatar.z);
  grid.position.x = Math.round(avatar.x / CELL) * CELL;
  grid.position.z = Math.round(avatar.z / CELL) * CELL;

  key.position.set(avatar.x + 7, 15, avatar.z + 6);
  key.target.position.set(avatar.x, 0, avatar.z);

  updateCamera(dt);

  // спрятать подсказку, как только игрок пошёл
  if (avatar.travelled > 1.2 && ui.hint && !ui.hint.classList.contains('gone')) {
    ui.hint.classList.add('gone');
  }

  fpsAccum += dt;
  fpsFrames++;
  if (fpsAccum > 0.5) {
    const fps = Math.round(fpsFrames / fpsAccum);
    const label = avatar.state === 'idle' ? 'стоит' : avatar.state === 'run' ? 'быстрый шаг' : 'идёт';
    if (ui.state) ui.state.textContent = label;
    if (ui.speed) ui.speed.textContent = `${avatar.speed.toFixed(2)} м/с`;
    diag.status(
      `${gl.version} · ${fps} fps · Майкл: ${michael.ready ? 'в сцене' : michael.error ? 'не загрузился' : 'загружается…'} · ${avatar.state} ${avatar.speed.toFixed(1)} м/с`,
    );
    fpsAccum = 0;
    fpsFrames = 0;
  }

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

addEventListener('resize', () => fitRenderer());
new ResizeObserver(() => fitRenderer()).observe(canvas);

/* --------------------------------- старт ---------------------------------- */

holder.position.set(avatar.x, 0, avatar.z);
holder.rotation.y = avatar.facing;
updateCamera(0, true);
animate(); // рендер стартует сразу: жёлтая пустота видна до загрузки модели

loadMichael()
  .then(() => setNote(`3D: ${gl.version} ✓ · модель ${(michael.root ? 'в сцене' : '—')}`))
  .catch((err) => {
    console.error(err);
    michael.error = err;
    setNote(`модель не загрузилась: ${err?.message || err}`, true);
    diag.status?.(`Майкл: ошибка — ${err?.message || err}`);
  });
