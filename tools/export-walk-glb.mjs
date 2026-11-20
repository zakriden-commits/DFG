import { readFileSync, writeFileSync } from 'node:fs';
import { parseGlb, buildGlb, loadModelBuffer } from './glb-model.mjs';
import { HumanoidRig } from '../src/anim/humanoidRig.js';
import { buildWalkClip, applyWalkPose, resolveConfig } from '../src/anim/walkClip.js';
import * as THREE from 'three';

/**
 * Дописывает в GLB процедурный клип ходьбы, не трогая родной idle.
 *
 * Почему свой писатель, а не THREE.GLTFExporter: экспортёр r169 в Node не
 * раскладывает QuaternionKeyframeTrack по именам костей (см. docs/character-animation.md).
 * Здесь accessors/bufferViews создаются напрямую поверх исходного бинарного чанка.
 */

const POSED_KEYS = [
  'hips', 'spine', 'chest', 'neck', 'head',
  'shoulderL', 'shoulderR', 'upperArmL', 'upperArmR', 'forearmL', 'forearmR',
  'handL', 'handR', 'thighL', 'thighR', 'shinL', 'shinR', 'footL', 'footR',
];

const TYPE_SIZE = { SCALAR: 1, VEC3: 3, VEC4: 4 };
const align4 = (n) => (4 - (n % 4)) % 4;

function makePacker(json, baseBin) {
  const chunks = [Buffer.from(baseBin)];
  let length = baseBin.length;
  const tail = align4(length);
  if (tail) {
    chunks.push(Buffer.alloc(tail, 0));
    length += tail;
  }

  function addAccessor(type, values, { minMax = false } = {}) {
    const floats = values instanceof Float32Array ? values : Float32Array.from(values);
    const buf = Buffer.from(floats.buffer, floats.byteOffset, floats.byteLength);
    json.bufferViews.push({ buffer: 0, byteOffset: length, byteLength: buf.length });
    chunks.push(buf);
    length += buf.length;
    const p = align4(length);
    if (p) {
      chunks.push(Buffer.alloc(p, 0));
      length += p;
    }

    const accessor = {
      bufferView: json.bufferViews.length - 1,
      componentType: 5126, // FLOAT
      count: floats.length / TYPE_SIZE[type],
      type,
    };
    if (minMax) {
      const min = new Array(TYPE_SIZE[type]).fill(Infinity);
      const max = new Array(TYPE_SIZE[type]).fill(-Infinity);
      for (let i = 0; i < floats.length; i++) {
        const k = i % TYPE_SIZE[type];
        if (floats[i] < min[k]) min[k] = floats[i];
        if (floats[i] > max[k]) max[k] = floats[i];
      }
      accessor.min = min;
      accessor.max = max;
    }
    json.accessors.push(accessor);
    return json.accessors.length - 1;
  }

  const finish = () => {
    json.buffers = json.buffers || [{ byteLength: 0 }];
    json.buffers[0].byteLength = length;
    return Buffer.concat(chunks);
  };

  return { addAccessor, finish };
}

const nodeIndex = (json, name) => json.nodes.findIndex((n) => n.name === name);

export async function exportWalkGlb({ input, output, preset = 'stalker' } = {}) {
  const source = readFileSync(input);
  const { json, bin } = parseGlb(source);
  const gltf = await loadModelBuffer(source, { strip: true });
  const rig = new HumanoidRig(gltf.scene);
  const cfg = resolveConfig(rig, { preset });
  const n = cfg.samples || 40;

  const { addAccessor, finish } = makePacker(json, bin);

  // родной клип остаётся, просто получает понятное имя
  json.animations = json.animations || [];
  if (json.animations[0]) json.animations[0].name = 'Idle';

  const times = Array.from({ length: n + 1 }, (_, i) => +((i / n) * cfg.duration).toFixed(6));
  const timeAccessor = addAccessor('SCALAR', times, { minMax: true });

  const quat = new Map();
  const hipsPos = [];
  for (const key of POSED_KEYS) if (rig.has(key)) quat.set(key, []);

  for (let i = 0; i <= n; i++) {
    const phase = (i % n) / n; // последний кадр = первому: цикл без шва
    rig.resetPose();
    applyWalkPose(rig, phase, cfg);
    for (const [key, arr] of quat) {
      const q = rig.bones[key].quaternion;
      arr.push(q.x, q.y, q.z, q.w);
    }
    const p = rig.bones.hips?.position;
    if (p) hipsPos.push(p.x, p.y, p.z);
  }

  const samplers = [];
  const channels = [];
  const missing = [];
  const push = (bone, path, values, type) => {
    const node = nodeIndex(json, bone.name);
    if (node < 0) {
      missing.push(bone.name);
      return;
    }
    const output = addAccessor(type, values);
    samplers.push({ input: timeAccessor, output, interpolation: 'LINEAR' });
    channels.push({ sampler: samplers.length - 1, target: { node, path } });
  };

  for (const [key, arr] of quat) push(rig.bones[key], 'rotation', arr, 'VEC4');
  if (rig.has('hips')) push(rig.bones.hips, 'translation', hipsPos, 'VEC3');

  const animation = { name: cfg.name || 'Walk', samplers, channels };
  json.animations.push(animation);

  const out = buildGlb(json, finish());
  writeFileSync(output, out);

  // контроль: клип должен читаться THREE и совпадать с процедурной ходьбой
  const check = await loadModelBuffer(out, { strip: true });
  const clip = THREE.AnimationClip.findByName(check.animations, animation.name);
  const rigCheck = new HumanoidRig(check.scene);
  const built = buildWalkClip(rigCheck, { preset });

  return {
    output,
    bytes: out.length,
    animations: json.animations.map((a) => a.name),
    channels: channels.length,
    tracksInThree: clip ? clip.tracks.length : 0,
    duration: clip ? +clip.duration.toFixed(3) : null,
    bonesMissingInGraph: missing,
    proceduralTracks: built.diagnostics.trackCount,
    contactErrorMm: +(built.diagnostics.penetrationMeters * 1000).toFixed(2),
    speedKmh: +(built.diagnostics.matchedSpeedMeters * 3.6).toFixed(2),
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const input = process.argv[2] || 'google_drive/michael_myers.glb';
  const output = process.argv[3] || 'assets/models/character.glb';
  const preset = process.argv[4] || 'stalker';
  const report = await exportWalkGlb({ input, output, preset });
  console.log(JSON.stringify(report, null, 2));
}
