#!/usr/bin/env node
/**
 * Add skeleton + skinning + run/fall ragdoll animations to the
 * Meshy AI UFC Warrior GLB. Preserves original textures/material.
 * Usage: node scripts/build-ragdoll.mjs
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as THREE from '../vendor/three.module.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const IN = join(ROOT, 'google_drive', 'Meshy_AI_UFC_Warrior_1122124213_texture.glb');
const OUT = join(ROOT, 'assets', 'fighter-ragdoll.glb');

// ---------- 1. parse original GLB ----------
const bin = readFileSync(IN);
let cursor = 12, json = null, binChunk = null;
while (cursor < bin.length) {
  const len = bin.readUInt32LE(cursor);
  const type = bin.readUInt32LE(cursor + 4);
  const off = cursor + 8;
  if (type === 0x4e4f534a) json = JSON.parse(bin.slice(off, off + len).toString('utf8'));
  if (type === 0x004e4942) binChunk = bin.slice(off, off + len);
  cursor += 8 + len;
}
console.log(`original JSON: nodes=${json.nodes?.length} meshes=${json.meshes?.length} skins=${(json.skins ?? []).length} animations=${(json.animations ?? []).length} accessors=${(json.accessors ?? []).length} bufferViews=${(json.bufferViews ?? []).length}`);

const vertCount = json.accessors[0].count;
const idxCount = json.accessors[3].count;
console.log(`verts=${vertCount} tris=${idxCount / 3}`);

function accessorData(accessorIndex, nComp) {
  const a = json.accessors[accessorIndex];
  const bv = json.bufferViews[a.bufferView];
  const offset = (bv.byteOffset || 0) + (a.byteOffset || 0);
  const buf = binChunk.subarray(offset, offset + a.count * nComp * 4);
  return new Float32Array(buf.buffer, buf.byteOffset, a.count * nComp);
}
const POSITION = accessorData(0, 3);
const NORMAL = accessorData(2, 3);

// ---------- 2. skeleton (mesh-local frame, faces +Z, feet at y≈-0.95) ----------
const D2R = Math.PI / 180;
const down = new THREE.Vector3(0, -1, 0);
const restQuatFromDir = (dir) => new THREE.Quaternion().setFromUnitVectors(down, dir.clone().normalize());

// Absolute rest positions in the mesh frame (character faces +Z)
const absolute = {
  hips:      [0, -0.12, 0],
  spine:     [0, 0.18, 0],
  chest:     [0, 0.38, 0],
  neck:      [0.01, 0.54, 0.02],
  head:      [0.02, 0.78, 0.03],
  shoulderR: [0.235, 0.47, 0],
  elbowR:    [0.330, 0.29, 0],
  wristR:    [0.410, 0.11, 0],
  shoulderL: [-0.235, 0.47, 0],
  elbowL:    [-0.330, 0.29, 0],
  wristL:    [-0.410, 0.11, 0],
  thighR:    [0.11, -0.14, 0],
  kneeR:     [0.19, -0.50, 0],
  ankleR:    [0.25, -0.88, 0],
  thighL:    [-0.11, -0.14, 0],
  kneeL:     [-0.19, -0.50, 0],
  ankleL:    [-0.25, -0.88, 0],
};
const jointParents = {
  hips: null, spine: 'hips', chest: 'spine', neck: 'chest', head: 'neck',
  shoulderR: 'chest', elbowR: 'shoulderR', wristR: 'elbowR',
  shoulderL: 'chest', elbowL: 'shoulderL', wristL: 'elbowL',
  thighR: 'hips', kneeR: 'thighR', ankleR: 'kneeR',
  thighL: 'hips', kneeL: 'thighL', ankleL: 'kneeL',
};
// Rest orientations: align local -Y with the segment direction in the parent's frame
const restDirs = {
  elbowR: new THREE.Vector3(absolute.elbowR[0] - absolute.shoulderR[0], absolute.elbowR[1] - absolute.shoulderR[1], 0),
  wristR: new THREE.Vector3(absolute.wristR[0] - absolute.elbowR[0], absolute.wristR[1] - absolute.elbowR[1], 0),
  elbowL: new THREE.Vector3(absolute.elbowL[0] - absolute.shoulderL[0], absolute.elbowL[1] - absolute.shoulderL[1], 0),
  wristL: new THREE.Vector3(absolute.wristL[0] - absolute.elbowL[0], absolute.wristL[1] - absolute.elbowL[1], 0),
  thighR: new THREE.Vector3(absolute.kneeR[0] - absolute.thighR[0], absolute.kneeR[1] - absolute.thighR[1], 0),
  kneeR: new THREE.Vector3(absolute.ankleR[0] - absolute.kneeR[0], absolute.ankleR[1] - absolute.kneeR[1], 0),
  thighL: new THREE.Vector3(absolute.kneeL[0] - absolute.thighL[0], absolute.kneeL[1] - absolute.thighL[1], 0),
  kneeL: new THREE.Vector3(absolute.ankleL[0] - absolute.kneeL[0], absolute.ankleL[1] - absolute.kneeL[1], 0),
};
const jointNames = Object.keys(absolute);
const J = {};
jointNames.forEach((name, i) => {
  J[name] = {
    nodeIndex: i + 1, // mesh node = 0
    name,
    parent: jointParents[name],
    restQuat: restDirs[name] ? restQuatFromDir(restDirs[name]) : new THREE.Quaternion(),
  };
});
const jointList = jointNames.map((n) => J[n]);

// Build a scene graph with the rest pose; then derive local transforms per bone
// (children expressed in their parent's rotated frame) so world positions are exact.
const nodes = {};
const container = new THREE.Object3D();
for (const name of jointNames) {
  const node = new THREE.Bone();
  node.name = name;
  node.quaternion.copy(J[name].restQuat);
  nodes[name] = node;
}
for (const name of jointNames) {
  const parent = jointParents[name];
  if (!parent) continue;
  nodes[parent].add(nodes[name]);
}
container.add(nodes['hips']);
container.updateMatrixWorld(true);
// Now set LOCAL positions so that world positions match absolute targets:
// compute world target then set local = parentWorld.inverse * target
const absoluteWorld = {};
for (const name of jointNames) {
  absoluteWorld[name] = new THREE.Vector3(...absolute[name]);
}
nodes['hips'].position.set(absolute.hips[0], absolute.hips[1], absolute.hips[2]);
for (const name of jointNames) {
  const parent = jointParents[name];
  if (!parent) continue;
  const pWorld = nodes[parent].matrixWorld.clone().invert();
  absoluteWorld[name] = nodes[name].getWorldPosition(new THREE.Vector3());
}
// Set skeleton root, then recursively derive each child local position
// so that absolute world positions match the mesh-space targets.
nodes['hips'].position.set(absolute.hips[0], absolute.hips[1], absolute.hips[2]);
const DEP = ['hips','spine','chest','neck','head','shoulderR','elbowR','wristR','shoulderL','elbowL','wristL','thighR','kneeR','ankleR','thighL','kneeL','ankleL'];
for (const name of DEP) {
  const parent = jointParents[name];
  container.updateMatrixWorld(true);
  if (!parent) continue;
  const target = new THREE.Vector3(...absolute[name]);
  const pWorld = nodes[parent].matrixWorld.clone().invert();
  const local = target.applyMatrix4(pWorld);
  nodes[name].position.set(local.x, local.y, local.z);
  J[name].localPos = [local.x, local.y, local.z];
}
// hips local pos
J['hips'].localPos = [absolute.hips[0], absolute.hips[1], absolute.hips[2]];
container.updateMatrixWorld(true);
// recompute invBind for final bind pose
const invBind = {};
for (const name of jointNames) {
  invBind[name] = nodes[name].matrixWorld.clone().invert();
}
const jointWorld = new Map();
for (const name of jointNames) {
  jointWorld.set(name, nodes[name].getWorldPosition(new THREE.Vector3()));
}
console.log('skeleton world check:');
for (const name of jointNames) {
  const p = jointWorld.get(name);
  console.log(`  ${name.padEnd(12)} abs(${p.x.toFixed(3)}, ${p.y.toFixed(3)}, ${p.z.toFixed(3)})`);
}

// ---------- 3. skin weights ----------
const NV = vertCount;
const ids = new Uint8Array(NV * 4);
const weights = new Float32Array(NV * 4);
const jointWorldList = jointNames.map((n) => jointWorld.get(n));
for (let i = 0; i < NV; i++) {
  const px = POSITION[i * 3], py = POSITION[i * 3 + 1], pz = POSITION[i * 3 + 2];
  const dist = jointWorldList.map((p) => {
    const dx = px - p.x, dy = py - p.y, dz = pz - p.z;
    return dx * dx + dy * dy + dz * dz + 1e-4;
  });
  const inv = dist.map((d) => 1 / d);
  const top = inv.map((v, i2) => ({ v, i: i2 })).sort((a, b) => b.v - a.v).slice(0, 4);
  const sum = top.reduce((s, t) => s + t.v, 0);
  for (let k = 0; k < 4; k++) {
    if (k < top.length) {
      ids[i * 4 + k] = top[k].i;
      weights[i * 4 + k] = top[k].v / sum;
    } else {
      ids[i * 4 + k] = 0;
      weights[i * 4 + k] = 0;
    }
  }
}

// ---------- 4. animations ----------
function qFromEuler(ex, ey, ez) {
  return new THREE.Quaternion().setFromEuler(new THREE.Euler(ex, ey, ez, 'XYZ'));
}
function sampleClip(frames, period, dqFn) {
  const times = new Float32Array(frames);
  const values = {};
  for (const name of jointNames) values[name] = new Float32Array(frames * 4);
  for (let f = 0; f < frames; f++) {
    const t = (f / (frames - 1)) * period;
    times[f] = t;
    const dq = dqFn(t);
    for (const name of jointNames) {
      const q = new THREE.Quaternion().copy(J[name].restQuat).multiply(dq[name] || new THREE.Quaternion());
      values[name][f * 4] = q.x;
      values[name][f * 4 + 1] = q.y;
      values[name][f * 4 + 2] = q.z;
      values[name][f * 4 + 3] = q.w;
    }
  }
  return { times, values };
}
function runFrameDelta(t) {
  const p = (t / 0.60) * Math.PI * 2;
  const s = Math.sin(p), c = Math.cos(p);
  return {
    hips: qFromEuler(0.03 + 0.03 * Math.abs(s), 0.04 * s, 0),
    spine: qFromEuler(0.14 + 0.04 * Math.sin(p * 2), 0, 0),
    chest: qFromEuler(0.18 + 0.05 * Math.sin(p * 2 + 0.4), 0, 0),
    neck: qFromEuler(-0.16 - 0.05 * Math.sin(p * 2 + 0.9), 0, 0),
    head: qFromEuler(-0.13 - 0.05 * Math.sin(p * 2 + 0.2), 0, 0),
    thighR: qFromEuler(-0.58 * s, 0, 0),
    thighL: qFromEuler(0.58 * s, 0, 0),
    kneeR: qFromEuler(0.95 * Math.max(0, Math.sin(p - 0.8)), 0, 0),
    kneeL: qFromEuler(0.95 * Math.max(0, Math.sin(p + Math.PI - 0.8)), 0, 0),
    shoulderR: qFromEuler(0.55 * s, 0, 0.12 * c),
    shoulderL: qFromEuler(-0.55 * s, 0, -0.12 * c),
    elbowR: qFromEuler(-1.05 - 0.35 * s, 0, 0),
    elbowL: qFromEuler(-1.05 + 0.35 * s, 0, 0),
    wristR: qFromEuler(-0.30, 0, 0),
    wristL: qFromEuler(-0.30, 0, 0),
    ankleR: qFromEuler(0.35 * Math.max(0, -s), 0, 0),
    ankleL: qFromEuler(0.35 * Math.max(0, s), 0, 0),
    kneeL_dummy: null,
  };
}

// run: hips bob up/down (slightly forward lean too)
const RUN_FRAMES = 9;
const RUN_PERIOD = 0.60;
const runHips = { times: new Float32Array(RUN_FRAMES), values: new Float32Array(RUN_FRAMES * 3) };
for (let f = 0; f < RUN_FRAMES; f++) {
  const t = (f / (RUN_FRAMES - 1)) * RUN_PERIOD;
  const p = (t / RUN_PERIOD) * Math.PI * 2;
  runHips.times[f] = t;
  runHips.values[f * 3] = 0;
  runHips.values[f * 3 + 1] = -0.12 + 0.035 * Math.abs(Math.sin(p));
  runHips.values[f * 3 + 2] = 0.05 * Math.sin(p);
}
function fallFrameDelta(t) {
  const s = Math.min(1, t / 1.50);
  const e = s < 0.5 ? 2 * s * s : 1 - Math.pow(-2 * s + 2, 2) / 2;
  const wob = Math.sin(s * 26) * Math.max(0, 1 - s * 1.5) * 0.22;
  return {
    hips: qFromEuler(0.10 * e, 0, 0),
    spine: qFromEuler(0.62 * e, 0, wob * 0.6),
    chest: qFromEuler(0.46 * e, 0, wob),
    neck: qFromEuler(-0.45 * e, 0, 0),
    head: qFromEuler(-0.12 * e + 0.10, 0, 0),
    thighR: qFromEuler(0.30 * e, 0, 0.26 * e),
    thighL: qFromEuler(0.30 * e, 0, -0.26 * e),
    kneeR: qFromEuler(0.72 * e, 0, 0),
    kneeL: qFromEuler(0.72 * e, 0, 0),
    shoulderR: qFromEuler(-0.70 * e, 0, 0.85 * e),
    shoulderL: qFromEuler(-0.70 * e, 0, -0.85 * e),
    elbowR: qFromEuler(-0.55 * e, 0, 0.55 * e),
    elbowL: qFromEuler(-0.55 * e, 0, -0.55 * e),
    wristR: qFromEuler(-0.30 * e, 0, 0),
    wristL: qFromEuler(-0.30 * e, 0, 0),
    ankleR: qFromEuler(0.20 * e, 0, 0),
    ankleL: qFromEuler(0.20 * e, 0, 0),
    kneeL_dummy: null,
  };
}
// fall: hips also translate (sink to floor)
const FALL_FRAMES = 17;
const FALL_PERIOD = 1.50;
const fallHips = { times: new Float32Array(FALL_FRAMES), values: new Float32Array(FALL_FRAMES * 3) };
for (let f = 0; f < FALL_FRAMES; f++) {
  const t = (f / FALL_FRAMES) * FALL_PERIOD;
  const s = Math.min(1, t / FALL_PERIOD);
  const e = s < 0.5 ? 2 * s * s : 1 - Math.pow(-2 * s + 2, 2) / 2;
  fallHips.times[f] = t;
  fallHips.values[f * 3] = 0;
  fallHips.values[f * 3 + 1] = -0.12 - 0.50 * e;
  fallHips.values[f * 3 + 2] = 0.12 * e;
}

const runClip = sampleClip(9, 0.60, runFrameDelta);
const fallClip = sampleClip(FALL_FRAMES, FALL_PERIOD, fallFrameDelta);

// ---------- 5. write final GLB ----------
const origBufferViews = json.bufferViews.slice();
const origAccessors = json.accessors.slice();

// NEW BINARY layout: [origBin][pad][joints][weights][ibm][per-track buffers]
const padOrig = (4 - (binChunk.length % 4)) % 4;
let finalLen = 0;
function offsetOf(len) { const off = finalLen; finalLen += len; return off; }
function padTo(alignment) {
  const pad = (alignment - (finalLen % alignment)) % alignment;
  if (pad) finalLen += pad;
}
// compute buffers first to know offsets
const ibmBuf = Buffer.alloc(jointNames.length * 64);
{
  const arr32 = new Float32Array(ibmBuf.buffer);
  jointNames.forEach((name, i) => {
    const m = invBind[name].elements; // column-major
    for (let k = 0; k < 16; k++) arr32[i * 16 + k] = m[k];
  });
}

const structures = []; // {offset, length, buf}
const takeBuf = (buf) => {
  padTo(4);
  const offset = finalLen;
  finalLen += buf.length;
  structures.push({ offset, length: buf.length, buf });
};

// joints JOINTS_0
const jointsBuf = Buffer.alloc(NV * 4);
for (let i = 0; i < NV * 4; i++) jointsBuf[i] = ids[i];
takeBuf(jointsBuf);
// weights WEIGHTS_0
const weightsBuf = Buffer.from(weights.buffer, weights.byteOffset, weights.byteLength);
takeBuf(weightsBuf);
// ibm
takeBuf(ibmBuf);

const runTrackViews = [];
for (const name of jointNames) {
  const timesBuf = Buffer.from(runClip.times.buffer, runClip.times.byteOffset, runClip.times.byteLength);
  const valuesBuf = Buffer.from(runClip.values[name].buffer, runClip.values[name].byteOffset, runClip.values[name].byteLength);
  takeBuf(timesBuf); 
  takeBuf(valuesBuf);
  runTrackViews.push({ name, timesIdx: structures.length - 2, valuesIdx: structures.length - 1 });
}
const fallTrackViews = [];
for (const name of jointNames) {
  const timesBuf = Buffer.from(fallClip.times.buffer, fallClip.times.byteOffset, fallClip.times.byteLength);
  const valuesBuf = Buffer.from(fallClip.values[name].buffer, fallClip.values[name].byteOffset, fallClip.values[name].byteLength);
  takeBuf(timesBuf);
  takeBuf(valuesBuf);
  fallTrackViews.push({ name, timesIdx: structures.length - 2, valuesIdx: structures.length - 1 });
}
const hipTimesBuf = Buffer.from(fallHips.times.buffer, fallHips.times.byteOffset, fallHips.times.byteLength);
const hipValuesBuf = Buffer.from(fallHips.values.buffer, fallHips.values.byteOffset, fallHips.values.byteLength);
takeBuf(hipTimesBuf);
takeBuf(hipValuesBuf);
const hipTimesIdx = structures.length - 2, hipValuesIdx = structures.length - 1;
// run hip translation buffers
const runHipTimesBuf = Buffer.from(runHips.times.buffer, runHips.times.byteOffset, runHips.times.byteLength);
const runHipValuesBuf = Buffer.from(runHips.values.buffer, runHips.values.byteOffset, runHips.values.byteLength);
takeBuf(runHipTimesBuf);
takeBuf(runHipValuesBuf);
const runHipTimesIdx = structures.length - 2, runHipValuesIdx = structures.length - 1;

const totalNewBin = padOrig + finalLen + 4; // generous
// compute actual new binary
const newParts = [Buffer.alloc(padOrig)];
for (const s of structures) newParts.push(s.buf);
// pad final to 4
const newConcatLen = newParts.reduce((s, p) => s + p.length, 0);
const padTail = (4 - (newConcatLen % 4)) % 4;
const newBin = Buffer.concat([...newParts, Buffer.alloc(padTail)]);
const finalBin = Buffer.concat([Buffer.from(binChunk), newBin]);
console.log('orig bin:', binChunk.length, 'pad:', padOrig, 'new bin:', newBin.length, 'total:', finalBin.length);

// map original bufferViews to the original region; new ones follow
const origBufferViewsMeta = json.bufferViews.map((bv) => Object.assign({}, bv));
const newBufferViewsMeta = structures.map((s) => ({ buffer: 0, byteOffset: binChunk.length + padOrig + s.offset, byteLength: s.length }));
const allBufferViews = [...origBufferViewsMeta, ...newBufferViewsMeta];

// accessors
const newAccessors = [];
function addAccessor(bufferViewsIndex, type, count, componentType) {
  newAccessors.push({ bufferView: origAccessors.length * 0 + newBufferViewsMeta.length ? 0 : 0 }); // placeholder
  const idx = origAccessors.length + newAccessors.length - 1; // placeholder
  return idx;
}
// explicit:
const jointAccessorIdx = origAccessors.length + 0;
const weightAccessorIdx = origAccessors.length + 1;
const ibmAccessorIdx = origAccessors.length + 2;
const runTimeAccessorStart = origAccessors.length + 3;
const runValueAccessorStart = runTimeAccessorStart + jointNames.length;
const fallTimeAccessorStart = runValueAccessorStart + jointNames.length;
const fallValueAccessorStart = fallTimeAccessorStart + jointNames.length;
const hipTimeAccessorIdx = fallValueAccessorStart + jointNames.length;
const hipValueAccessorIdx = hipTimeAccessorIdx + 1;

newAccessors.length = 0;
newAccessors.push({ bufferView: 0 + structures.length * 0 + 0, componentType: 5121, count: NV, type: 'VEC4' }); // joints
newAccessors[0].bufferView = 0; // placeholder, fixed below
// Simpler: build accessors directly as objects
newAccessors.length = 0;
newAccessors.push({ bufferView: 0, componentType: 5121, count: NV, type: 'VEC4' });                // 0: JOINTS
newAccessors.push({ bufferView: 0, componentType: 5126, count: NV, type: 'VEC4' });                // 1: WEIGHTS
newAccessors.push({ bufferView: 0, componentType: 5126, count: jointNames.length, type: 'MAT4' }); // 2: IBM
for (let i = 0; i < runTrackViews.length; i++) newAccessors.push({ bufferView: 0, componentType: 5126, count: runClip.times.length, type: 'SCALAR' }); // run times
for (let i = 0; i < runTrackViews.length; i++) newAccessors.push({ bufferView: 0, componentType: 5126, count: runClip.times.length, type: 'VEC4' });  // run values
for (let i = 0; i < fallTrackViews.length; i++) newAccessors.push({ bufferView: 0, componentType: 5126, count: fallClip.times.length, type: 'SCALAR' }); // fall times
for (let i = 0; i < fallTrackViews.length; i++) newAccessors.push({ bufferView: 0, componentType: 5126, count: fallClip.times.length, type: 'VEC4' });  // fall values
newAccessors.push({ bufferView: 0, componentType: 5126, count: fallHips.times.length, type: 'SCALAR' }); // fall hip times
newAccessors.push({ bufferView: 0, componentType: 5126, count: fallHips.times.length, type: 'VEC3' });   // fall hip values
newAccessors.push({ bufferView: 0, componentType: 5126, count: runHips.times.length, type: 'SCALAR' }); // run hip times
newAccessors.push({ bufferView: 0, componentType: 5126, count: runHips.times.length, type: 'VEC3' });   // run hip values

// fix bufferView references: original bufferViews occupy 0..origBufferViews.length-1; new ones start at origBufferViews.length
const origBVCount = origBufferViewsMeta.length;
function fixAccessorBufferView(accIdx, bufferViewOffsetIdx) {
  newAccessors[accIdx].bufferView = origBVCount + bufferViewOffsetIdx;
}
// joints, weights, ibm
fixAccessorBufferView(0, 0); // joints
fixAccessorBufferView(1, 1); // weights
fixAccessorBufferView(2, 2); // ibm
for (let i = 0; i < runTrackViews.length; i++) {
  fixAccessorBufferView(3 + i, 3 + i * 2);         // run times: local structures index 3+2i
  fixAccessorBufferView(3 + jointNames.length + i, 3 + i * 2 + 1); // run values
}
for (let i = 0; i < fallTrackViews.length; i++) {
  const base = 3 + jointNames.length * 2;
  fixAccessorBufferView(base + i, 3 + jointNames.length * 2 + i * 2);
  fixAccessorBufferView(base + jointNames.length + i, 3 + jointNames.length * 2 + i * 2 + 1);
}
// hip accessors
// fall hip accessors are the 2nd-to-last and 3rd-to-last in newAccessors
newAccessors[newAccessors.length - 4].bufferView = origBVCount + (3 + (runTrackViews.length + fallTrackViews.length) * 2);
newAccessors[newAccessors.length - 3].bufferView = origBVCount + (3 + (runTrackViews.length + fallTrackViews.length) * 2 + 1);
// run hip accessors — tail
newAccessors[newAccessors.length - 2].bufferView = origBVCount + (3 + (runTrackViews.length + fallTrackViews.length) * 2 + 2);
newAccessors[newAccessors.length - 1].bufferView = origBVCount + (3 + (runTrackViews.length + fallTrackViews.length) * 2 + 3);
// verify total new bufferViews count matches
console.log('orig bufferViews:', origBVCount, 'new bufferViews:', newBufferViewsMeta.length, 'total:', allBufferViews.length);

const allAccessors = [...origAccessors, ...newAccessors];

// nodes
const nodeNames = ['Mesh', ...jointNames];
const allNodes = [];
allNodes.push({ name: 'Mesh', mesh: 0, skin: 0 });
// bones
for (const name of jointNames) {
  const j = J[name];
  const node = { name, children: [] };
  node.translation = j.localPos;
  if (!j.restQuat.equals(new THREE.Quaternion())) {
    node.rotation = [j.restQuat.x, j.restQuat.y, j.restQuat.z, j.restQuat.w];
  }
  allNodes.push(node);
}
// wire children
for (let i = 0; i < jointNames.length; i++) {
  const name = jointNames[i];
  const parent = J[name].parent;
  if (!parent) continue;
  const pName = parent;
  const pIdx = allNodes.findIndex((x) => x.name === pName);
  const cIdx = allNodes.findIndex((x) => x.name === name);
  allNodes[pIdx].children.push(cIdx);
}
// mesh node is a child of the hips bone (canonical skinned-model pattern)
allNodes[1].children.push(0); // hips children: Mesh, spine, thighR, thighL
for (const i of allNodes[1].children) {
  // ensure unique
}

// accessors indices (canonical)
const jointAccessor = origAccessors.length + 0;
const weightAccessor = origAccessors.length + 1;
const ibmAccessor = origAccessors.length + 2;
const runTimeAcc0 = origAccessors.length + 3;
const runValueAcc0 = runTimeAcc0 + jointNames.length;
const fallTimeAcc0 = runValueAcc0 + jointNames.length;
const fallValueAcc0 = fallTimeAcc0 + jointNames.length;
const hipTimeAccessor = fallValueAcc0 + jointNames.length;
const hipValueAccessor = hipTimeAccessor + 1;
const runHipTimeAccessor = hipTimeAccessor + 2;
const runHipValueAccessor = hipTimeAccessor + 3;

// animations
const nodeIndexOf = (name) => allNodes.findIndex((n) => n.name === name);

function buildClip(name, tracks, frames, isHip = false) {
  const samplers = [];
  const channels = [];
  // time accessor is shared per clip? No - per-track times accessors exist; pick the one for each track
  for (let i = 0; i < tracks.length; i++) {
    const tr = tracks[i];
    const samplerIdx = samplers.length;
    samplers.push({ input: trackTimeAccessor(name, i), output: trackValueAccessor(name, i), interpolation: 'LINEAR' });
    channels.push({ sampler: samplerIdx, target: { node: nodeIndexOf(tr.name), path: 'rotation' } });
  }
  return { name, samplers, channels };
  function trackTimeAccessor(clipName, i) {
    if (clipName === 'run') return runTimeAcc0 + i;
    return fallTimeAcc0 + i;
  }
  function trackValueAccessor(clipName, i) {
    if (clipName === 'run') return runValueAcc0 + i;
    return fallValueAcc0 + i;
  }
}
// build clips with explicit channels
const animations = [];
function clipFromViews(clipName, trackViews, timeStart, valueStart) {
  const samplers = [];
  const channels = [];
  for (let i = 0; i < trackViews.length; i++) {
    samplers.push({ input: timeStart + i, output: valueStart + i, interpolation: 'LINEAR' });
    channels.push({ sampler: samplers.length - 1, target: { node: nodeIndexOf(trackViews[i].name), path: 'rotation' } });
  }
  return { name: clipName, samplers, channels };
}
{
  const runClipObj = clipFromViews('run', runTrackViews, runTimeAcc0, runValueAcc0);
  // add run hip translation channel
  const runHipSamplerIdx = runClipObj.samplers.length;
  runClipObj.samplers.push({ input: runHipTimeAccessor, output: runHipValueAccessor, interpolation: 'LINEAR' });
  runClipObj.channels.push({ sampler: runHipSamplerIdx, target: { node: nodeIndexOf('hips'), path: 'translation' } });
  animations.push(runClipObj);
  const fallClipObj = clipFromViews('fall', fallTrackViews, fallTimeAcc0, fallValueAcc0);
  // add hip translation channel
  const samplerIdx = fallClipObj.samplers.length;
  fallClipObj.samplers.push({ input: hipTimeAccessor, output: hipValueAccessor, interpolation: 'LINEAR' });
  fallClipObj.channels.push({ sampler: samplerIdx, target: { node: nodeIndexOf('hips'), path: 'translation' } });
  animations.push(fallClipObj);
}

// meshes
const newMeshes = [
  {
    name: 'Body',
    primitives: [
      {
        attributes: {
          POSITION: 0,
          NORMAL: 2,
          TEXCOORD_0: 1,
          JOINTS_0: jointAccessor,
          WEIGHTS_0: weightAccessor,
        },
        indices: 3,
        material: 0,
        mode: 4,
      },
    ],
  },
];

const newJSON = {
  asset: { version: '2.0', generator: 'DFG-ragdoll-builder' },
  scene: 0,
  scenes: [{ nodes: [1] }],
  nodes: allNodes,
  meshes: newMeshes,
  skins: [{ joints: jointNames.map(function(n) { return J[n].nodeIndex; }), inverseBindMatrices: ibmAccessor }],
  materials: json.materials,
  textures: json.textures,
  samplers: json.samplers ?? [{ magFilter: 9729, minFilter: 9987 }],
  images: json.images,
  accessors: allAccessors,
  bufferViews: allBufferViews,
  animations,
  buffers: [{ byteLength: finalBin.length }],
};

// ---------- 6. serialize ----------
const jsonStr = JSON.stringify(newJSON);
const jsonPadded = Buffer.concat([Buffer.from(jsonStr), Buffer.alloc((4 - (jsonStr.length % 4)) % 4, 0x20)]);
const binPadTail = (4 - (finalBin.length % 4)) % 4;
const finalBinPadded = Buffer.concat([finalBin, Buffer.alloc(binPadTail)]);
const totalLen = 12 + 8 + jsonPadded.length + 8 + finalBinPadded.length;

const out = Buffer.alloc(totalLen);
let o = 0;
out.writeUInt32LE(0x46546c67, o); o += 4;
out.writeUInt32LE(2, o); o += 4;
out.writeUInt32LE(totalLen, o); o += 4;
out.writeUInt32LE(jsonPadded.length, o); o += 4;
out.writeUInt32LE(0x4e4f534a, o); o += 4; // 'JSON'
jsonPadded.copy(out, o); o += jsonPadded.length;
out.writeUInt32LE(finalBinPadded.length, o); o += 4;
out.writeUInt32LE(0x004e4942, o); o += 4; // 'BIN0'
finalBinPadded.copy(out, o);

mkdirSync(join(ROOT, 'assets'), { recursive: true });
writeFileSync(OUT, out);
console.log(`wrote ${OUT} (${out.length} bytes)`);
console.log(`animations: ${animations.length} (run, fall), run tracks=${runTrackViews.length}, fall tracks=${fallTrackViews.length}+1 hip`);
console.log(`nodes=${allNodes.length} skins=1 joints=${jointNames.length} meshes=1`);
