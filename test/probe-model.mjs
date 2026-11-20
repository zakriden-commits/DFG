import * as THREE from 'three';
import { loadModelFile } from '../tools/glb-model.mjs';
import { HumanoidRig } from '../src/anim/humanoidRig.js';
import { buildWalkClip } from '../src/anim/walkClip.js';

import { existsSync } from 'node:fs';

// в репозитории лежит только готовый character.glb, исходник — локально в google_drive/
const fallback = 'google_drive/michael_myers.glb';
const model = process.argv[2] || (existsSync(fallback) ? fallback : 'assets/models/character.glb');
const gltf = await loadModelFile(model);
const root = gltf.scene;
root.updateWorldMatrix(true, true);

const box = new THREE.Box3().setFromObject(root);
const size = box.getSize(new THREE.Vector3());
console.log('bbox:', size.toArray().map(v=>v.toFixed(3)).join(' x '), '| min y', box.min.y.toFixed(3));
console.log('анимации:', gltf.animations.map(a => `${a.name} (${a.duration.toFixed(2)}s, ${a.tracks.length} дорожек)`).join(', ') || 'нет');

const rig = new HumanoidRig(root);
console.log('РИГ:', JSON.stringify(rig.info(), null, 1));

// ориентация и поза
const p = (k) => rig.worldPos(k, new THREE.Vector3())?.toArray().map(v=>+v.toFixed(3));
console.log('hips', p('hips'), 'thighL', p('thighL'), 'footL', p('footL'), 'toeL', p('toeL'));
console.log('axes forward', rig.axes.forward.toArray().map(v=>+v.toFixed(2)), 'lateral', rig.axes.lateral.toArray().map(v=>+v.toFixed(2)));

// направление плеча (T-поза?)
const armDir = (side) => {
  const a = rig.worldPos('upperArm'+side, new THREE.Vector3());
  const b = rig.worldPos('forearm'+side, new THREE.Vector3());
  if (!a || !b) return null;
  return b.sub(a).normalize();
};
for (const s of ['L','R']) {
  const d = armDir(s);
  if (!d) continue;
  const down = new THREE.Vector3(0,-1,0);
  console.log(`плечо ${s}: направление`, d.toArray().map(v=>+v.toFixed(2)), '| угол от вертикали', (THREE.MathUtils.radToDeg(d.angleTo(down))).toFixed(1), '°');
}

// длины костей
for (const k of ['thighL','shinL','upperArmL','forearmL']) {
  console.log('длина', k, rig.segmentLength(k).toFixed(3));
}

const { clip, diagnostics, cfg } = buildWalkClip(rig, { preset: 'stalker' });
console.log('КЛИП:', clip.tracks.length, 'дорожек,', clip.duration, 'с');
console.log('ДИАГНОСТИКА:', diagnostics);
