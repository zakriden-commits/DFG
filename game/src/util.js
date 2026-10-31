import * as THREE from 'three';

/* ---------- math / random ---------- */
export function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
export const rnd = mulberry32(1234567);
export const rr = (a, b) => a + Math.random() * (b - a);
export const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
export const lerp = (a, b, t) => a + (b - a) * t;
export const smooth = (t) => t * t * (3 - 2 * t);
export const distXZ = (a, b) => Math.hypot(a.x - b.x, a.z - b.z);
export const angleDiff = (a, b) => {
  let d = (b - a) % (Math.PI * 2);
  if (d > Math.PI) d -= Math.PI * 2;
  if (d < -Math.PI) d += Math.PI * 2;
  return d;
};
export const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

/* ---------- canvas textures ---------- */
const texCache = new Map();
/* Банк настоящих PNG-текстур (game/assets/tex): если файл найден — берём его,
   иначе рисуем текстуру на canvas как раньше. */
const TEX_BANK = new Map();

export function loadTextureBank(base, names, timeoutMs = 8000) {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || typeof document === 'undefined' || typeof Image === 'undefined') {
      return resolve(0);
    }
    if (!names.length) return resolve(0);
    let left = names.length, ok = 0;
    const finish = () => { clearTimeout(timer); resolve(ok); };
    const timer = setTimeout(finish, timeoutMs);
    let loader;
    try { loader = new THREE.TextureLoader(); } catch (e) { return finish(); }
    for (const name of names) {
      try {
        loader.load(`${base}${name}.png`, (t) => {
          t.colorSpace = THREE.SRGBColorSpace;
          t.wrapS = t.wrapT = THREE.RepeatWrapping;
          t.anisotropy = 4;
          TEX_BANK.set(name, t);
          ok++;
          if (--left === 0) finish();
        }, undefined, () => { if (--left === 0) finish(); });
      } catch (e) {
        if (--left === 0) finish();
      }
    }
  });
}

export function makeCanvas(w, h, draw) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  const ctx = c.getContext('2d');
  draw(ctx, w, h);
  return c;
}

export function tex(name, w, h, draw, rx = 1, ry = 1) {
  const banked = TEX_BANK.get(name);
  if (banked) {
    const t = banked.clone();
    t.needsUpdate = true;
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(rx, ry);
    return t;
  }
  const key = name + rx + 'x' + ry;
  if (texCache.has(key)) return texCache.get(key);
  const c = makeCanvas(w, h, draw);
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(rx, ry);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  texCache.set(key, t);
  return t;
}

export function grain(ctx, w, h, amount = 20, count = 2600) {
  for (let i = 0; i < count; i++) {
    const x = Math.random() * w, y = Math.random() * h;
    const g = Math.floor(Math.random() * 255);
    ctx.fillStyle = `rgba(${g},${g},${g},${Math.random() * amount / 255})`;
    ctx.fillRect(x, y, 1 + Math.random() * 2, 1 + Math.random() * 2);
  }
}

export function blotch(ctx, w, h, color, count = 26, maxR = 40, alpha = 0.12) {
  for (let i = 0; i < count; i++) {
    const x = Math.random() * w, y = Math.random() * h, r = 8 + Math.random() * maxR;
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, color);
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.globalAlpha = alpha;
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill();
    ctx.globalAlpha = 1;
  }
}

export function textCanvas(w, h, lines, opts = {}) {
  const c = makeCanvas(w, h, (ctx) => {
    ctx.fillStyle = opts.bg || '#141414';
    ctx.fillRect(0, 0, w, h);
    if (opts.border) {
      ctx.strokeStyle = opts.border; ctx.lineWidth = Math.max(6, h * 0.05);
      ctx.strokeRect(ctx.lineWidth / 2, ctx.lineWidth / 2, w - ctx.lineWidth, h - ctx.lineWidth);
    }
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    const arr = Array.isArray(lines) ? lines : [{ t: lines, size: h * 0.5 }];
    let total = 0;
    arr.forEach((l) => (total += (l.size || h * 0.4) * (l.gap || 1.15)));
    let y = h / 2 - total / 2;
    arr.forEach((l) => {
      const s = l.size || h * 0.4;
      y += (s * (l.gap || 1.15)) / 2;
      ctx.font = `${l.weight || 900} ${s}px ${opts.font || 'Impact, "Arial Black", sans-serif'}`;
      ctx.fillStyle = l.color || '#ffcf3f';
      if (l.glow) { ctx.shadowColor = l.glow; ctx.shadowBlur = s * 0.35; }
      ctx.fillText(l.t, w / 2, y);
      ctx.shadowBlur = 0;
      y += (s * (l.gap || 1.15)) / 2;
    });
  });
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/* ---------- geometry helpers ---------- */
export function roundedBoxGeom(w, h, d, r = 0.06, steps = 2) {
  r = Math.min(r, w / 2 - 0.001, h / 2 - 0.001);
  const shape = new THREE.Shape();
  const x = -w / 2, y = -h / 2;
  shape.moveTo(x + r, y);
  shape.lineTo(x + w - r, y);
  shape.quadraticCurveTo(x + w, y, x + w, y + r);
  shape.lineTo(x + w, y + h - r);
  shape.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  shape.lineTo(x + r, y + h);
  shape.quadraticCurveTo(x, y + h, x, y + h - r);
  shape.lineTo(x, y + r);
  shape.quadraticCurveTo(x, y, x + r, y);
  const g = new THREE.ExtrudeGeometry(shape, {
    depth: d, bevelEnabled: true, bevelSegments: steps, steps: 1,
    bevelSize: Math.min(r * 0.5, 0.02), bevelThickness: Math.min(r * 0.5, 0.02), curveSegments: 3,
  });
  g.translate(0, 0, -d / 2);
  g.computeVertexNormals();
  return g;
}

export function mesh(geo, mat, x = 0, y = 0, z = 0) {
  const m = new THREE.Mesh(geo, mat);
  m.position.set(x, y, z);
  m.castShadow = true; m.receiveShadow = true;
  return m;
}

export function std(color, opts = {}) {
  return new THREE.MeshStandardMaterial({
    color, roughness: opts.roughness ?? 0.75, metalness: opts.metalness ?? 0.05,
    map: opts.map || null, emissive: opts.emissive || 0x000000,
    emissiveIntensity: opts.emissiveIntensity ?? 1, transparent: opts.transparent || false,
    opacity: opts.opacity ?? 1, side: opts.side || THREE.FrontSide,
    flatShading: opts.flat || false, depthWrite: opts.depthWrite ?? true,
  });
}

/* AABB collision list helpers */
export class Colliders {
  constructor() { this.list = []; }
  add(minX, maxX, minZ, maxZ, tag = '', ref = null) {
    const c = { minX, maxX, minZ, maxZ, tag, ref, enabled: true };
    this.list.push(c);
    return c;
  }
  addFromMesh(m, tag = '') {
    const box = new THREE.Box3().setFromObject(m);
    return this.add(box.min.x, box.max.x, box.min.z, box.max.z, tag, m);
  }
  /* circle vs AABB resolution: returns adjusted position */
  resolve(pos, radius) {
    for (const c of this.list) {
      if (!c.enabled) continue;
      const cx = clamp(pos.x, c.minX, c.maxX);
      const cz = clamp(pos.z, c.minZ, c.maxZ);
      const dx = pos.x - cx, dz = pos.z - cz;
      const d2 = dx * dx + dz * dz;
      if (d2 < radius * radius) {
        if (d2 > 1e-6) {
          const d = Math.sqrt(d2);
          pos.x = cx + (dx / d) * radius;
          pos.z = cz + (dz / d) * radius;
        } else {
          // inside: push out on shortest axis
          const l = pos.x - c.minX, r = c.maxX - pos.x, t = pos.z - c.minZ, b = c.maxZ - pos.z;
          const m = Math.min(l, r, t, b);
          if (m === l) pos.x = c.minX - radius;
          else if (m === r) pos.x = c.maxX + radius;
          else if (m === t) pos.z = c.minZ - radius;
          else pos.z = c.maxZ + radius;
        }
      }
    }
    return pos;
  }
  /* line of sight test between two XZ points, walls block */
  blocked(x1, z1, x2, z2) {
    const dx = x2 - x1, dz = z2 - z1;
    for (const c of this.list) {
      if (!c.enabled || c.tag === 'noLOS') continue;
      if (segAABB(x1, z1, dx, dz, c)) return true;
    }
    return false;
  }
}

/* segment vs AABB (slab method), 2D */
export function segAABB(x, z, dx, dz, c) {
  let tmin = 0, tmax = 1;
  if (Math.abs(dx) < 1e-8) {
    if (x < c.minX || x > c.maxX) return false;
  } else {
    let t1 = (c.minX - x) / dx, t2 = (c.maxX - x) / dx;
    if (t1 > t2) { const t = t1; t1 = t2; t2 = t; }
    tmin = Math.max(tmin, t1); tmax = Math.min(tmax, t2);
    if (tmin > tmax) return false;
  }
  if (Math.abs(dz) < 1e-8) {
    if (z < c.minZ || z > c.maxZ) return false;
  } else {
    let t1 = (c.minZ - z) / dz, t2 = (c.maxZ - z) / dz;
    if (t1 > t2) { const t = t1; t1 = t2; t2 = t; }
    tmin = Math.max(tmin, t1); tmax = Math.min(tmax, t2);
    if (tmin > tmax) return false;
  }
  return true;
}

/* floating text sprite (labels above heads / world signs) */
export function labelSprite(text, opts = {}) {
  const w = opts.w || 256, h = opts.h || 64;
  const c = makeCanvas(w, h, (ctx) => {
    ctx.clearRect(0, 0, w, h);
    ctx.font = `700 ${opts.size || 34}px system-ui, sans-serif`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillStyle = 'rgba(8,8,10,.82)';
    const pad = 14;
    const tw = ctx.measureText(text).width;
    roundRect(ctx, w / 2 - tw / 2 - pad, 6, tw + pad * 2, h - 12, 10);
    ctx.fill();
    ctx.fillStyle = opts.color || '#ffe9a8';
    ctx.fillText(text, w / 2, h / 2 + 1);
  });
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  const mat = new THREE.SpriteMaterial({ map: t, transparent: true, depthWrite: false });
  const s = new THREE.Sprite(mat);
  s.scale.set((opts.scale || 1) * (w / 100), (opts.scale || 1) * (h / 100), 1);
  return s;
}

export function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

export function disposeObj(o) {
  o.traverse?.((n) => {
    if (n.geometry) n.geometry.dispose?.();
    if (n.material) {
      const mats = Array.isArray(n.material) ? n.material : [n.material];
      mats.forEach((m) => { if (m.map) m.map.dispose?.(); m.dispose?.(); });
    }
  });
}
