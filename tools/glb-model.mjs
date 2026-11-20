import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { readFileSync } from 'node:fs';

const MAGIC = 0x46546c67;
const CHUNK_JSON = 0x4e4f534a;
const CHUNK_BIN = 0x004e4942;

/** Читает GLB: { json, bin: Buffer } */
export function parseGlb(buffer) {
  const dv = new DataView(buffer.buffer, buffer.byteOffset, buffer.byteLength);
  if (dv.getUint32(0, true) !== MAGIC) throw new Error('не GLB');
  const total = dv.getUint32(8, true);
  let offset = 12;
  let json = null;
  let bin = null;
  while (offset + 8 <= total) {
    const len = dv.getUint32(offset, true);
    const type = dv.getUint32(offset + 4, true);
    const start = offset + 8;
    if (type === CHUNK_JSON) {
      json = JSON.parse(new TextDecoder().decode(buffer.subarray(start, start + len)));
    } else if (type === CHUNK_BIN) {
      bin = buffer.subarray(start, start + len);
    }
    offset = start + len;
  }
  return { json, bin };
}

/** Собирает GLB из JSON + бинарного чанка */
export function buildGlb(json, bin) {
  let jsonBytes = Buffer.from(JSON.stringify(json), 'utf8');
  const jsonPad = (4 - (jsonBytes.length % 4)) % 4;
  if (jsonPad) jsonBytes = Buffer.concat([jsonBytes, Buffer.alloc(jsonPad, 0x20)]);
  const binPad = bin ? (4 - (bin.length % 4)) % 4 : 0;
  const binPadded = bin ? Buffer.concat([bin, Buffer.alloc(binPad, 0)]) : null;

  const total = 12 + 8 + jsonBytes.length + (binPadded ? 8 + binPadded.length : 0);
  const out = Buffer.alloc(total);
  let o = 0;
  out.writeUInt32LE(MAGIC, o); o += 4;
  out.writeUInt32LE(2, o); o += 4;
  out.writeUInt32LE(total, o); o += 4;
  out.writeUInt32LE(jsonBytes.length, o); o += 4;
  out.writeUInt32LE(CHUNK_JSON, o); o += 4;
  jsonBytes.copy(out, o); o += jsonBytes.length;
  if (binPadded) {
    out.writeUInt32LE(binPadded.length, o); o += 4;
    out.writeUInt32LE(CHUNK_BIN, o); o += 4;
    binPadded.copy(out, o);
  }
  return out;
}

/** Убирает текстуры из материала/JSON: в Node их всё равно не декодировать */
export function stripTextures(json) {
  delete json.images;
  delete json.textures;
  delete json.samplers;
  for (const mat of json.materials || []) {
    delete mat.normalTexture;
    delete mat.occlusionTexture;
    delete mat.emissiveTexture;
    if (mat.pbrMetallicRoughness) {
      delete mat.pbrMetallicRoughness.baseColorTexture;
      delete mat.pbrMetallicRoughness.metallicRoughnessTexture;
    }
    delete mat.extensions;
  }
  return json;
}

let loader = null;

/** Загружает GLB в Node (без текстур) */
export async function loadModelBuffer(buffer, { strip = true } = {}) {
  const { json, bin } = parseGlb(buffer);
  const clean = strip ? stripTextures(structuredClone(json)) : json;
  const glb = buildGlb(clean, bin);
  if (!loader) loader = new GLTFLoader();
  const arrayBuffer = glb.buffer.slice(glb.byteOffset, glb.byteOffset + glb.byteLength);
  const gltf = await new Promise((resolve, reject) => {
    loader.parse(arrayBuffer, '', resolve, reject);
  });
  gltf.json = clean;
  gltf.bin = bin;
  gltf.sourceJson = json;
  return gltf;
}

export async function loadModelFile(path) {
  return loadModelBuffer(readFileSync(path));
}

/** Достаёт картинку из GLB как Buffer (для декодирования через ImageMagick) */
export function extractImage(gltf, index) {
  const json = gltf.sourceJson || gltf.json;
  const img = json.images?.[index];
  if (!img) return null;
  const view = json.bufferViews?.[img.bufferView];
  if (!view) return null;
  const start = view.byteOffset || 0;
  return {
    mimeType: img.mimeType || 'image/png',
    data: gltf.bin.subarray(start, start + view.byteLength),
  };
}
