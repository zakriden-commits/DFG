#!/usr/bin/env node
/**
 * Инспектор GLB/GLTF без зависимостей и без DOM.
 * Отвечает на главный вопрос: есть ли у модели скелет (skins/joints)
 * и какие анимации уже встроены.
 *
 * Использование:
 *   node tools/inspect-glb.mjs assets/models/character.glb
 *   node tools/inspect-glb.mjs model.glb report.json
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { basename } from 'node:path';

const GLB_MAGIC = 0x46546c67;
const CHUNK_JSON = 0x4e4f534a;
const CHUNK_BIN = 0x004e4942;

const file = process.argv[2];
if (!file) {
  console.error('Использование: node tools/inspect-glb.mjs <model.glb> [отчёт.json]');
  process.exit(2);
}
if (!existsSync(file)) {
  console.error(`✖ Файл не найден: ${file}`);
  console.error('  Залей .glb в assets/models/ и повтори.');
  process.exit(2);
}

/* ------------------------------- разбор контейнера ------------------------------- */

function loadGltf(path) {
  const buf = readFileSync(path);
  const dv = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
  if (dv.getUint32(0, true) !== GLB_MAGIC) {
    // .gltf (текстовый JSON)
    const json = JSON.parse(buf.toString('utf8'));
    return { json, binLength: 0, container: 'glTF (.gltf)', version: 2 };
  }
  const version = dv.getUint32(4, true);
  const totalLength = dv.getUint32(8, true);
  let offset = 12;
  let json = null;
  let binLength = 0;
  while (offset + 8 <= totalLength && offset + 8 <= buf.byteLength) {
    const len = dv.getUint32(offset, true);
    const type = dv.getUint32(offset + 4, true);
    const start = offset + 8;
    if (type === CHUNK_JSON) {
      json = JSON.parse(new TextDecoder().decode(buf.subarray(start, start + len)));
    } else if (type === CHUNK_BIN) {
      binLength = len;
    }
    offset = start + len;
  }
  if (!json) throw new Error('В GLB нет JSON-чанка');
  return { json, binLength, container: 'GLB (binary glTF)', version };
}

/* ----------------------------------- матрицы ----------------------------------- */

function quatToMat(q) {
  const [x, y, z, w] = q;
  const x2 = x + x;
  const y2 = y + y;
  const z2 = z + z;
  const xx = x * x2;
  const xy = x * y2;
  const xz = x * z2;
  const yy = y * y2;
  const yz = y * z2;
  const zz = z * z2;
  const wx = w * x2;
  const wy = w * y2;
  const wz = w * z2;
  return [
    1 - (yy + zz), xy + wz, xz - wy, 0,
    xy - wz, 1 - (xx + zz), yz + wx, 0,
    xz + wy, yz - wx, 1 - (xx + yy), 0,
    0, 0, 0, 1,
  ];
}

function localMatrix(node) {
  if (node.matrix) return node.matrix.slice();
  const t = node.translation || [0, 0, 0];
  const q = node.quaternion || [0, 0, 0, 1];
  const s = node.scale || [1, 1, 1];
  const m = quatToMat(q);
  m[0] *= s[0]; m[1] *= s[0]; m[2] *= s[0];
  m[4] *= s[1]; m[5] *= s[1]; m[6] *= s[1];
  m[8] *= s[2]; m[9] *= s[2]; m[10] *= s[2];
  m[12] = t[0]; m[13] = t[1]; m[14] = t[2];
  return m;
}

function matMul(a, b) {
  const o = new Array(16).fill(0);
  for (let c = 0; c < 4; c++) {
    for (let r = 0; r < 4; r++) {
      o[c * 4 + r] =
        a[r] * b[c * 4] +
        a[4 + r] * b[c * 4 + 1] +
        a[8 + r] * b[c * 4 + 2] +
        a[12 + r] * b[c * 4 + 3];
    }
  }
  return o;
}

function applyMat(m, p) {
  return [
    m[0] * p[0] + m[4] * p[1] + m[8] * p[2] + m[12],
    m[1] * p[0] + m[5] * p[1] + m[9] * p[2] + m[13],
    m[2] * p[0] + m[6] * p[1] + m[10] * p[2] + m[14],
  ];
}

/* ----------------------------------- анализ ----------------------------------- */

const { json, binLength, container, version } = loadGltf(file);
const nodes = json.nodes || [];
const meshes = json.meshes || [];
const accessors = json.accessors || [];
const animations = json.animations || [];
const skins = json.skins || [];
const materials = json.materials || [];
const images = json.images || [];
const textures = json.textures || [];

// мировые матрицы узлов
const childrenOf = new Array(nodes.length).fill(null).map(() => []);
nodes.forEach((n, i) => (n.children || []).forEach((c) => childrenOf[i].push(c)));

const world = new Array(nodes.length).fill(null);
const parentOf = new Array(nodes.length).fill(-1);
nodes.forEach((n, i) => (n.children || []).forEach((c) => (parentOf[c] = i)));

const roots = nodes.map((_, i) => i).filter((i) => parentOf[i] === -1);
const walk = (i, parentMat) => {
  const m = matMul(parentMat, localMatrix(nodes[i]));
  world[i] = m;
  for (const c of childrenOf[i]) walk(c, m);
};
const IDENT = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
roots.forEach((r) => walk(r, IDENT));

// bounding box по POSITION-аксессорам всех примитивов
let bbox = { min: [Infinity, Infinity, Infinity], max: [-Infinity, -Infinity, -Infinity] };
let triangleCount = 0;
let vertexCount = 0;
let primitives = 0;
const meshInfo = [];

meshes.forEach((mesh, mi) => {
  const info = { name: mesh.name || `mesh_${mi}`, primitives: [], skinned: false, morphTargets: 0 };
  mesh.primitives.forEach((prim) => {
    primitives++;
    const attrs = prim.attributes || {};
    if (attrs.JOINTS_0 && attrs.WEIGHTS_0) info.skinned = true;
    if (prim.targets) info.morphTargets = Math.max(info.morphTargets, prim.targets.length);
    const posAcc = attrs.POSITION != null ? accessors[attrs.POSITION] : null;
    if (posAcc?.count) {
      vertexCount += posAcc.count;
      info.primitives.push({ vertices: posAcc.count, hasSkinAttrs: !!(attrs.JOINTS_0 && attrs.WEIGHTS_0) });
    }
    if (prim.indices != null && accessors[prim.indices]?.count) {
      triangleCount += accessors[prim.indices].count / 3;
    }
    if (posAcc?.min && posAcc?.max) {
      // учитываем трансформацию узла, который ссылается на этот меш
      const nodeIdx = nodes.findIndex((n) => n.mesh === mi);
      const m = nodeIdx >= 0 && world[nodeIdx] ? world[nodeIdx] : IDENT;
      for (let cx = 0; cx < 2; cx++)
        for (let cy = 0; cy < 2; cy++)
          for (let cz = 0; cz < 2; cz++) {
            const p = applyMat(m, [
              cx ? posAcc.max[0] : posAcc.min[0],
              cy ? posAcc.max[1] : posAcc.min[1],
              cz ? posAcc.max[2] : posAcc.min[2],
            ]);
            for (let k = 0; k < 3; k++) {
              bbox.min[k] = Math.min(bbox.min[k], p[k]);
              bbox.max[k] = Math.max(bbox.max[k], p[k]);
            }
          }
    }
  });
  meshInfo.push(info);
});

// скелет
const jointSet = new Set();
skins.forEach((s) => (s.joints || []).forEach((j) => jointSet.add(j)));
const joints = [...jointSet];
const boneNames = joints.map((j) => nodes[j]?.name || `node_${j}`);

const bonePositions = joints.map((j) => {
  const m = world[j] || IDENT;
  return { index: j, name: nodes[j]?.name || `node_${j}`, pos: applyMat(m, [0, 0, 0]).map((v) => +v.toFixed(3)) };
});

// дерево костей (только кости)
const boneTree = [];
if (joints.length) {
  const childBones = new Map();
  joints.forEach((j) => childBones.set(j, []));
  joints.forEach((j) => {
    let p = parentOf[j];
    while (p !== -1 && !jointSet.has(p)) p = parentOf[p];
    if (p !== -1) childBones.get(p).push(j);
  });
  const rootsBones = joints.filter((j) => {
    let p = parentOf[j];
    while (p !== -1 && !jointSet.has(p)) p = parentOf[p];
    return p === -1;
  });
  const rec = (j, depth) => {
    boneTree.push({ name: nodes[j]?.name || `node_${j}`, depth });
    childBones.get(j).forEach((c) => rec(c, depth + 1));
  };
  rootsBones.forEach((r) => rec(r, 0));
}

// анимации
const animInfo = animations.map((a, ai) => {
  let duration = 0;
  const targets = new Set();
  (a.channels || []).forEach((ch) => {
    const s = a.samplers?.[ch.sampler];
    if (!s) return;
    const input = accessors[s.input];
    if (input?.max?.[0] != null) duration = Math.max(duration, input.max[0]);
    if (ch.target?.node != null) targets.add(nodes[ch.target.node]?.name || `node_${ch.target.node}`);
  });
  return {
    index: ai,
    name: a.name || `animation_${ai}`,
    duration: +duration.toFixed(3),
    channels: (a.channels || []).length,
    animatedNodes: [...targets],
  };
});

const idleAnim = animInfo.find((a) => /idle|stand|дыш|покой/i.test(a.name));
const walkAnim = animInfo.find((a) => /walk|run|jog|ходьб|бег/i.test(a.name));

const convention = (() => {
  const first = boneNames[0] || '';
  if (/mixamorig/i.test(boneNames.join(' '))) return 'Mixamo (mixamorig:*)';
  if (boneNames.some((n) => /^(Hips|Spine|LeftUpLeg|RightUpLeg)$/i.test(n))) return 'Blender/Mixamo-подобная (Hips, LeftUpLeg…)';
  if (boneNames.some((n) => /pelvis|thigh|calf|upperarm|lowerarm/i.test(n))) return 'UE/UE-подобная (pelvis, thigh, calf…)';
  if (boneNames.some((n) => /upper_arm|forearm|thigh|shin|foot/i.test(n))) return 'Rigify-подобная (upper_arm, thigh, shin…)';
  if (boneNames.some((n) => /hip|spine|arm|leg|head/i.test(n))) return 'смешанная / самописная';
  return 'не распознана';
})();

const size = {
  x: +(bbox.max[0] - bbox.min[0]).toFixed(3),
  y: +(bbox.max[1] - bbox.min[1]).toFixed(3),
  z: +(bbox.max[2] - bbox.min[2]).toFixed(3),
};

const report = {
  file: basename(file),
  container,
  version,
  binLength,
  generator: json.asset?.generator || '—',
  extensionsUsed: json.extensionsUsed || [],
  counts: {
    nodes: nodes.length,
    meshes: meshes.length,
    primitives,
    materials: materials.length,
    textures: textures.length,
    images: images.length,
    accessors: accessors.length,
    skins: skins.length,
    joints: joints.length,
    animations: animations.length,
    triangles: Math.round(triangleCount),
    vertices: vertexCount,
  },
  hasSkeleton: skins.length > 0 && joints.length > 0,
  convention,
  boneTree,
  bones: bonePositions,
  meshes: meshInfo,
  animations: animInfo,
  bbox,
  size,
  verdict: '',
  nextSteps: [],
};

/* ----------------------------------- вывод ----------------------------------- */

const C = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  magenta: '\x1b[35m',
};
const log = (s = '') => console.log(s);

log('');
log(`${C.bold}${C.cyan}◆ ПАСПОРТ МОДЕЛИ${C.reset}  ${basename(file)}`);
log(`  контейнер: ${container}, glTF версия ${version}, bin-чанк ${(binLength / 1024).toFixed(1)} КБ`);
log(`  генератор: ${report.generator}`);
if (report.extensionsUsed.length) log(`  расширения: ${report.extensionsUsed.join(', ')}`);

log('');
log(`${C.bold}Геометрия${C.reset}`);
log(`  узлов: ${nodes.length} · мешей: ${meshes.length} · примитивов: ${primitives}`);
log(`  вершин: ${report.counts.vertices} · треугольников: ${report.counts.triangles}`);
log(`  материалов: ${materials.length} · текстур: ${textures.length} · изображений: ${images.length}`);
for (const m of meshInfo) {
  log(
    `  · ${m.name}: ${m.primitives.map((p) => `${p.vertices} v${p.hasSkinAttrs ? ' [skin]' : ''}`).join(', ')}` +
      `${m.morphTargets ? ` · морфы: ${m.morphTargets}` : ''}`,
  );
}
log(
  `  размеры (м): ${size.x} × ${size.y} × ${size.z}` +
    `   bbox y: ${bbox.min[1].toFixed(2)} … ${bbox.max[1].toFixed(2)}`,
);

log('');
log(`${C.bold}Скелет${C.reset}`);
if (report.hasSkeleton) {
  log(`  ${C.green}✔ кости есть${C.reset}: ${joints.length} шт., skins: ${skins.length}`);
  log(`  конвенция имён: ${C.magenta}${convention}${C.reset}`);
  log(`  корень: ${boneTree.filter((b) => b.depth === 0).map((b) => b.name).join(', ')}`);
  log(`  ${C.dim}— иерархия (фрагмент) —${C.reset}`);
  const shown = boneTree.slice(0, 70);
  for (const b of shown) log(`  ${'  '.repeat(b.depth)}${b.depth ? '└ ' : '■ '}${b.name}`);
  if (boneTree.length > shown.length) log(`  … ещё ${boneTree.length - shown.length} костей`);
} else {
  log(`  ${C.yellow}✖ скелета нет${C.reset} (skins: ${skins.length}, joints: 0)`);
  log('  → потребуется авто-риг: построение костей + скиннинг меша.');
}

log('');
log(`${C.bold}Анимации${C.reset}`);
if (!animInfo.length) {
  log(`  ${C.yellow}анимаций нет${C.reset}`);
} else {
  for (const a of animInfo) {
    log(
      `  · ${C.cyan}${a.name}${C.reset} — ${a.duration.toFixed(2)} с, каналов: ${a.channels}, ` +
        `задействовано узлов: ${a.animatedNodes.length}`,
    );
    log(`    ${C.dim}${a.animatedNodes.slice(0, 12).join(', ')}${a.animatedNodes.length > 12 ? '…' : ''}${C.reset}`);
  }
}
log(`  idle: ${idleAnim ? `${C.green}есть — ${idleAnim.name}${C.reset}` : `${C.yellow}нет${C.reset}`}`);
log(`  walk/run: ${walkAnim ? `${C.green}есть — ${walkAnim.name}${C.reset}` : `${C.yellow}нет${C.reset}`}`);

/* ----------------------------------- вердикт ----------------------------------- */

if (report.hasSkeleton) {
  if (walkAnim) {
    report.verdict = 'Скелет есть, анимация ходьбы уже присутствует — можно сразу подключать.';
    report.nextSteps = [
      'Проверить качество клипа ходьбы и при необходимости заменить на процедурный.',
      'Настроить AnimationMixer + crossfade idle ↔ walk.',
    ];
  } else {
    report.verdict =
      'Скелет есть, ходьбы нет — делаем анимацию ходьбы на существующем риге, встроенный idle сохраняем.';
    report.nextSteps = [
      'Снять пропорции и ориентацию костей из rest pose.',
      'Сгенерировать AnimationClip ходьбы (цикл, 4 фазы шага, противоход руками, покачивание бёдер).',
      'Собрать GLB с клипами idle + walk и проверить плавность переходов.',
    ];
  }
} else {
  report.verdict = 'Костей нет — нужен авто-риг (сегментация меша, кости, веса скиннинга) + idle/walk.';
  report.nextSteps = [
    'Определить ориентацию и пропорции персонажа по bbox и кластерам меша.',
    'Построить скелет: hips, spine, chest, head, плечи, руки, бёдра, голени, стопы.',
    'Разложить веса по расстоянию до костей + сгладить.',
    'Сгенерировать idle и walk, собрать итоговый GLB.',
  ];
}

log('');
log(`${C.bold}${C.cyan}◆ ВЕРДИКТ${C.reset}`);
log(`  ${report.verdict}`);
log('');
log(`${C.dim}Дальше:${C.reset}`);
report.nextSteps.forEach((s, i) => log(`  ${i + 1}. ${s}`));
log('');

const outPath = process.argv[3] || file.replace(/\.(glb|gltf)$/i, '.report.json');
writeFileSync(outPath, JSON.stringify(report, null, 2));
log(`${C.dim}Отчёт сохранён: ${outPath}${C.reset}`);
log('');

if (!report.hasSkeleton) process.exitCode = 3;
