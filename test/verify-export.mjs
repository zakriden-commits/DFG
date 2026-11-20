import * as THREE from 'three';
import { loadModelFile } from '../tools/glb-model.mjs';
import { HumanoidRig } from '../src/anim/humanoidRig.js';

/**
 * Проверка готового GLB: клип проигрывается миксером и подошва стоит на земле.
 * Мерим не процедурную позу, а то, что реально лежит в файле.
 */
const path = process.argv[2] || 'assets/models/character.glb';
const gltf = await loadModelFile(path);
const scene = gltf.scene;
const rig = new HumanoidRig(scene);
const clip = THREE.AnimationClip.findByName(gltf.animations, 'walk');
if (!clip) throw new Error(`нет клипа walk: ${gltf.animations.map((a) => a.name)}`);

const mixer = new THREE.AnimationMixer(scene);
const action = mixer.clipAction(clip);
action.play();

const unitsPerMeter = 1 / rig.metersPerUnit;
const steps = 24;
let minSole = Infinity;
let maxSole = -Infinity;
let maxLift = -Infinity;
let hipMin = Infinity;
let hipMax = -Infinity;
const first = [];
const last = [];

for (let i = 0; i <= steps; i++) {
  const t = (i / steps) * clip.duration;
  mixer.setTime(t);
  scene.updateMatrixWorld(true);
  const hl = rig.solePoints('L');
  const hr = rig.solePoints('R');
  const lMin = Math.min(hl.heel.y, hl.ball.y);
  const rMin = Math.min(hr.heel.y, hr.ball.y);
  minSole = Math.min(minSole, lMin - rig.groundY, rMin - rig.groundY);
  maxSole = Math.max(maxSole, lMin, rMin);
  maxLift = Math.max(maxLift, Math.max(lMin, rMin) - rig.groundY);
  const hipY = rig.worldPos('hips', new THREE.Vector3()).y;
  hipMin = Math.min(hipMin, hipY);
  hipMax = Math.max(hipMax, hipY);
  const sample = ['hips', 'thighL', 'footL', 'handL', 'handR'].flatMap((k) =>
    rig.worldPos(k, new THREE.Vector3()).toArray(),
  );
  if (i === 0) first.push(...sample);
  if (i === steps) last.push(...sample);
}

const seam = Math.max(...first.map((v, i) => Math.abs(v - last[i])));

const report = {
  file: path,
  clip: clip.name,
  duration: +clip.duration.toFixed(3),
  tracks: clip.tracks.length,
  animations: gltf.animations.map((a) => a.name),
  soleMinMm: +((minSole / unitsPerMeter) * 1000).toFixed(2),
  soleLowestAboveGroundMm: +(((maxSole - rig.groundY) / unitsPerMeter) * 1000).toFixed(2),
  footLiftMeters: +(maxLift / unitsPerMeter).toFixed(3),
  hipBobMeters: +((hipMax - hipMin) / unitsPerMeter).toFixed(3),
  loopSeamUnits: +seam.toFixed(4),
};
console.log(JSON.stringify(report, null, 2));

const ok = report.soleMinMm > -8 && report.soleMinMm < 8 && report.loopSeamUnits < 0.01;
console.log(ok ? 'EXPORT OK' : 'EXPORT FAIL');
process.exitCode = ok ? 0 : 1;
