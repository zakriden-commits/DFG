import { buildMannequin } from '../src/anim/mannequin.js';
import { HumanoidRig } from '../src/anim/humanoidRig.js';
import { buildWalkClip } from '../src/anim/walkClip.js';
import { buildIdleClip } from '../src/anim/walkClip.js';

const root = buildMannequin();
const rig = new HumanoidRig(root);
console.log('кости:', rig.info());
const idle = buildIdleClip(rig);
const { clip, diagnostics } = buildWalkClip(rig, { preset: 'stalker' });
console.log('idle треков:', idle.tracks.length, '| walk треков:', clip.tracks.length);
console.log('диагностика:', diagnostics);

// имитируем контроллер: mixer + веса
import * as THREE from 'three';
const mixer = new THREE.AnimationMixer(root);
const ia = mixer.clipAction(idle).play();
const wa = mixer.clipAction(clip).play();
for (let i = 0; i < 120; i++) { wa.setEffectiveWeight(i / 120); ia.setEffectiveWeight(1 - i / 120); mixer.update(0.016); }
root.updateWorldMatrix(true, true);
const hips = root.getObjectByName('Hips');
console.log('hips world y после смешивания:', hips.getWorldPosition(new THREE.Vector3()).y.toFixed(3));
console.log('SMOKE OK');
