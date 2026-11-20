import * as THREE from 'three';
import { loadModelFile } from '../tools/glb-model.mjs';
import { HumanoidRig } from '../src/anim/humanoidRig.js';
import { applyWalkPose, resolveConfig } from '../src/anim/walkClip.js';
import { Raster } from './raster.mjs';

/**
 * Раскадровка ходьбы на РЕАЛЬНОЙ геометрии: вершины скиннинга проецируются
 * в вид сбоку и спереди. Это единственная визуальная проверка, доступная без
 * браузера (в песочнице нет GL, см. docs/character-animation.md).
 *
 * node test/pose-sheet.mjs [model.glb] [preset] [out.png]
 */

const file = process.argv[2] || 'assets/models/character.glb';
const preset = process.argv[3] || 'stalker';
const outPath = process.argv[4] || 'test/_walk_sheet.png';

const gltf = await loadModelFile(file);
const root = gltf.scene;
const rig = new HumanoidRig(root);
const cfg = resolveConfig(rig, { preset });

const meshes = [];
root.traverse((o) => {
  if (o.isSkinnedMesh) meshes.push(o);
});
const vertexCount = meshes.reduce((n, m) => n + m.geometry.attributes.position.count, 0);

const buffer = [];
function skin() {
  root.updateMatrixWorld(true);
  for (const m of meshes) m.skeleton.update();
  const v = new THREE.Vector3();
  buffer.length = 0;
  for (const m of meshes) {
    const pos = m.geometry.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i);
      m.applyBoneTransform(i, v);
      v.applyMatrix4(m.matrixWorld);
      buffer.push(v.x, v.y, v.z);
    }
  }
  return buffer;
}

const frames = Array.from({ length: 8 }, (_, i) => (i / 16) * 1); // полцикла
const W = 320;
const H = 600;
const img = new Raster(W * frames.length, H * 2);
const scale = ((H - 90) / rig.height) * 0.92;
const F = rig.axes.forward;
const L = rig.axes.lateral;

function paint(view, row) {
  frames.forEach((phase, fi) => {
    rig.resetPose();
    applyWalkPose(rig, phase, cfg);
    rig.update();
    skin();

    const ox = fi * W + W / 2;
    const top = row * H + 25;
    const groundY = top + rig.height * scale;
    img.segment(fi * W, groundY, fi * W + W, groundY, [70, 80, 110], 1.2);
    img.segment(fi * W, 0, fi * W, H * 2, [40, 45, 70], 0.8);

    for (let i = 0; i < buffer.length; i += 3) {
      const x = buffer[i];
      const y = buffer[i + 1];
      const z = buffer[i + 2];
      const across = view === 'side' ? x * F.x + z * F.z : x * L.x + z * L.z;
      const depth = view === 'side' ? x * L.x + z * L.z : x * F.x + z * F.z;
      const px = Math.round(ox + across * scale);
      const py = Math.round(top + (rig.height - (y - rig.groundY)) * scale);
      const k = Math.max(0.25, Math.min(1, 0.6 - depth / (rig.height * 0.9)));
      const c = view === 'side' ? [150 * k, 190 * k, 255 * k] : [255 * k, 170 * k, 190 * k];
      img.blend(px, py, c, 0.55);
      img.blend(px + 1, py, c, 0.3);
      img.blend(px, py + 1, c, 0.3);
    }
  });
}

paint('side', 0);
paint('front', 1);
img.save(outPath);
console.log(`${file}: ${meshes.length} skinned mesh, ${vertexCount} вершин → ${outPath} (пресет ${preset})`);
