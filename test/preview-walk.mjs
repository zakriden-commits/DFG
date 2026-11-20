import * as THREE from 'three';
import { buildHumanoidFixture, boneList } from './fixtures/humanoid.js';
import { HumanoidRig } from '../src/anim/humanoidRig.js';
import { buildWalkClip } from '../src/anim/walkClip.js';
import { Raster } from './raster.mjs';

const presetName = process.argv[2] || 'stalker';
const overrides = process.argv[3] ? JSON.parse(process.argv[3]) : {};

const root = buildHumanoidFixture();
const rig = new HumanoidRig(root);
const { clip, diagnostics } = buildWalkClip(rig, { preset: presetName, ...overrides });

console.log('РИГ:', JSON.stringify(rig.info()));
console.log('ДИАГНОСТИКА:', JSON.stringify(diagnostics, null, 2));

const mixer = new THREE.AnimationMixer(root);
mixer.clipAction(clip).play();

const parents = new Map();
root.traverse((o) => {
  if (o.isBone) parents.set(o.name, o.parent?.isBone ? o.parent.name : null);
});

// проверка цикла
const sample = (t) => {
  mixer.setTime(t);
  root.updateWorldMatrix(true, true);
  const m = new Map();
  for (const b of boneList(root)) m.set(b.name, b.getWorldPosition(new THREE.Vector3()));
  return m;
};
const a0 = sample(0);
const a1 = sample(clip.duration - 1e-5);
let loopErr = 0;
for (const [n, p] of a0) loopErr = Math.max(loopErr, p.distanceTo(a1.get(n)));
console.log('Ошибка замыкания цикла, м:', loopErr.toFixed(6));

const PANELS = 8;
const PW = 158;
const ROW_H = 350;
const W = PANELS * PW + 24;
const H = ROW_H * 2 + 8;
const SCALE = 112;

const raster = new Raster(W, H, [8, 12, 24]);
const COL = {
  torso: [232, 244, 255],
  leg: [57, 215, 255],
  arm: [255, 94, 203],
  head: [255, 224, 102],
  ground: [30, 52, 88],
  hint: [90, 130, 190],
};

for (let row = 0; row < 2; row++) {
  const view = row === 0 ? 'side' : 'front';
  const groundY = row * ROW_H + ROW_H - 34;

  // земля
  raster.rect(0, groundY, W, 1, COL.ground, 1);

  for (let panel = 0; panel < PANELS; panel++) {
    const phase = panel / PANELS;
    mixer.setTime(phase * clip.duration);
    root.updateWorldMatrix(true, true);

    const ox = 12 + panel * PW + PW / 2;
    const pos = new Map();
    for (const b of boneList(root)) pos.set(b.name, b.getWorldPosition(new THREE.Vector3()));

    const P = (p) => (view === 'side'
      ? [ox + p.z * SCALE, groundY - p.y * SCALE]
      : [ox + p.x * SCALE, groundY - p.y * SCALE]);

    // тень/разделитель панели
    if (panel > 0) raster.rect(panel * PW + 6, row * ROW_H + 8, 1, ROW_H - 20, [22, 34, 58], 1);

    for (const [bone, parent] of parents) {
      if (!parent) continue;
      const pa = pos.get(parent);
      const pb = pos.get(bone);
      const isLeg = /UpLeg|_Leg|Foot|Toe/.test(bone);
      const isArm = /Shoulder|_Arm|ForeArm|Hand/.test(bone);
      const isHead = /Neck|Head/.test(bone);
      const [x1, y1] = P(pa);
      const [x2, y2] = P(pb);
      const color = isLeg ? COL.leg : isArm ? COL.arm : isHead ? COL.head : COL.torso;
      raster.segment(x1, y1, x2, y2, color, isLeg || isArm ? 3.2 : 4.6, isLeg || isArm ? 1 : 0.6);
    }
    for (const [name, p] of pos) {
      const [x, y] = P(p);
      if (/Foot|Toe/.test(name)) raster.disc(x, y, 2.4, [126, 240, 255]);
      else if (/Hips|Spine|Head$/.test(name)) raster.disc(x, y, 3.4, [207, 230, 255]);
    }
  }
}

// легенда
raster.rect(0, 0, W, 2, [40, 70, 120], 1);
const out = `test/_walk_${presetName}.png`;
raster.save(out);

// отчёт по стопам
let minY = Infinity;
const series = [];
for (let i = 0; i <= 40; i++) {
  const t = (i / 40) * clip.duration;
  mixer.setTime(t);
  root.updateWorldMatrix(true, true);
  const lf = root.getObjectByName('mixamorig_LeftFoot').getWorldPosition(new THREE.Vector3());
  const lt = root.getObjectByName('mixamorig_LeftToeBase').getWorldPosition(new THREE.Vector3());
  const rf = root.getObjectByName('mixamorig_RightFoot').getWorldPosition(new THREE.Vector3());
  const rt = root.getObjectByName('mixamorig_RightToeBase').getWorldPosition(new THREE.Vector3());
  const ly = Math.min(lf.y, lt.y);
  const ry = Math.min(rf.y, rt.y);
  minY = Math.min(minY, ly, ry);
  series.push([i, ly, ry]);
}
console.log('Высоты стоп по фазам (0..40), минимум:', minY.toFixed(3));
console.log(series.map(([i, l, r]) => `${i}:${(l - minY).toFixed(2)}/${(r - minY).toFixed(2)}`).join('  '));
console.log('Картинка:', out);
