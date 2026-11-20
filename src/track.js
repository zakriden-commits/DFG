import * as THREE from 'three';
import { TrackPath, HALF_WIDTH, WORLD_SCALE } from './trackMath.js';

const UP = new THREE.Vector3(0, 1, 0);

function makeCanvas(w, h) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  return c;
}

/** Текстура полотна: тёмный «асфальт» с неоновыми кромками и разметкой */
function makeRoadTexture() {
  const W = 512;
  const H = 512;
  const c = makeCanvas(W, H);
  const g = c.getContext('2d');

  g.fillStyle = '#080b18';
  g.fillRect(0, 0, W, H);

  // лёгкая зернистость
  for (let i = 0; i < 2600; i++) {
    const x = Math.random() * W;
    const y = Math.random() * H;
    const a = Math.random() * 0.05;
    g.fillStyle = `rgba(120,150,255,${a})`;
    g.fillRect(x, y, 2, 2);
  }

  // мягкие полосы движения
  g.globalAlpha = 0.16;
  g.strokeStyle = '#2a3c78';
  g.lineWidth = 1.5;
  for (let i = 1; i < 6; i++) {
    g.beginPath();
    g.moveTo((W / 6) * i, 0);
    g.lineTo((W / 6) * i, H);
    g.stroke();
  }
  g.globalAlpha = 1;

  // центральная прерывистая линия (магента)
  g.shadowColor = '#ff2bd6';
  g.shadowBlur = 16;
  g.fillStyle = '#ff5ce1';
  for (let y = 0; y < H; y += 96) {
    g.fillRect(W / 2 - 4, y + 16, 8, 52);
  }

  // кромки (циан)
  g.shadowColor = '#00e5ff';
  g.shadowBlur = 22;
  const edge = g.createLinearGradient(0, 0, 46, 0);
  edge.addColorStop(0, 'rgba(0,229,255,1)');
  edge.addColorStop(0.35, 'rgba(0,229,255,0.35)');
  edge.addColorStop(1, 'rgba(0,229,255,0)');
  g.fillStyle = edge;
  g.fillRect(0, 0, 46, H);

  const edge2 = g.createLinearGradient(W, 0, W - 46, 0);
  edge2.addColorStop(0, 'rgba(0,229,255,1)');
  edge2.addColorStop(0.35, 'rgba(0,229,255,0.35)');
  edge2.addColorStop(1, 'rgba(0,229,255,0)');
  g.fillStyle = edge2;
  g.fillRect(W - 46, 0, 46, H);

  // поперечные «шевроны» для ощущения скорости
  g.shadowBlur = 0;
  g.globalAlpha = 0.08;
  g.strokeStyle = '#7fd8ff';
  g.lineWidth = 6;
  for (let y = 0; y < H; y += 128) {
    g.beginPath();
    g.moveTo(W * 0.16, y + 40);
    g.lineTo(W * 0.5, y - 10);
    g.lineTo(W * 0.84, y + 40);
    g.stroke();
  }

  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = THREE.ClampToEdgeWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

/** Стрелки ускорителя */
function makeArrowTexture() {
  const S = 256;
  const c = makeCanvas(S, S);
  const g = c.getContext('2d');
  g.clearRect(0, 0, S, S);
  g.fillStyle = 'rgba(120,0,255,0.22)';
  g.fillRect(0, 0, S, S);
  g.strokeStyle = 'rgba(220,120,255,0.85)';
  g.lineWidth = 6;
  g.strokeRect(6, 6, S - 12, S - 12);
  g.shadowColor = '#ff2bd6';
  g.shadowBlur = 26;
  g.fillStyle = '#ff8cf0';
  for (let k = 0; k < 3; k++) {
    const y = 66 + k * 62;
    g.beginPath();
    g.moveTo(S / 2, y - 34);
    g.lineTo(S / 2 + 66, y + 26);
    g.lineTo(S / 2 + 30, y + 26);
    g.lineTo(S / 2, y - 2);
    g.lineTo(S / 2 - 30, y + 26);
    g.lineTo(S / 2 - 66, y + 26);
    g.closePath();
    g.fill();
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/** Клетчатая стартовая линия */
function makeCheckerTexture() {
  const S = 256;
  const c = makeCanvas(S, S);
  const g = c.getContext('2d');
  const cells = 8;
  const cs = S / cells;
  for (let y = 0; y < cells; y++) {
    for (let x = 0; x < cells; x++) {
      g.fillStyle = (x + y) % 2 === 0 ? '#e9f6ff' : '#0c1226';
      g.fillRect(x * cs, y * cs, cs, cs);
    }
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function makeBannerTexture(text) {
  const W = 1024;
  const H = 256;
  const c = makeCanvas(W, H);
  const g = c.getContext('2d');
  g.clearRect(0, 0, W, H);
  g.fillStyle = 'rgba(6,10,26,0.85)';
  g.fillRect(0, 0, W, H);
  g.strokeStyle = '#00e5ff';
  g.lineWidth = 6;
  g.strokeRect(3, 3, W - 6, H - 6);
  g.font = 'bold 120px "Segoe UI", system-ui, sans-serif';
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  g.shadowColor = '#ff2bd6';
  g.shadowBlur = 30;
  g.fillStyle = '#eaf6ff';
  g.fillText(text, W / 2, H / 2 + 6);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

const basisQuat = (right, up, tan) =>
  new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(right, up, tan));

export class Track extends TrackPath {
  constructor(scene) {
    super();
    this.group = new THREE.Group();
    this.group.name = 'track';
    scene.add(this.group);

    this.pads = [];
    this.rings = [];
    this.gates = [];
    this.roadTexture = makeRoadTexture();
    this.arrowTexture = makeArrowTexture();

    this.buildRoad();
    this.buildRails();
    this.buildMarkers();
    this.buildStruts();
    this.buildStartLine();
    this.buildPads();
    this.buildRings();
    this.buildGates();
    this.buildCheckpoints();

    // границы для миникарты
    let minX = Infinity;
    let maxX = -Infinity;
    let minZ = Infinity;
    let maxZ = -Infinity;
    for (const p of this.pos) {
      minX = Math.min(minX, p.x);
      maxX = Math.max(maxX, p.x);
      minZ = Math.min(minZ, p.z);
      maxZ = Math.max(maxZ, p.z);
    }
    this.bounds = { minX, maxX, minZ, maxZ };
  }

  buildRoad() {
    const n = this.n;
    const positions = new Float32Array((n + 1) * 2 * 3);
    const normals = new Float32Array((n + 1) * 2 * 3);
    const uvs = new Float32Array((n + 1) * 2 * 2);
    const indices = [];

    for (let i = 0; i <= n; i++) {
      const k = i % n;
      const p = this.pos[k];
      const r = this.right[k];
      const u = this.up[k];
      const d = this.dist[k] + (i === n ? this.length : 0);
      const o = i * 6;
      // левая кромка
      positions[o] = p.x - r.x * HALF_WIDTH;
      positions[o + 1] = p.y - r.y * HALF_WIDTH;
      positions[o + 2] = p.z - r.z * HALF_WIDTH;
      // правая кромка
      positions[o + 3] = p.x + r.x * HALF_WIDTH;
      positions[o + 4] = p.y + r.y * HALF_WIDTH;
      positions[o + 5] = p.z + r.z * HALF_WIDTH;
      for (let s = 0; s < 2; s++) {
        normals[o + s * 3] = u.x;
        normals[o + s * 3 + 1] = u.y;
        normals[o + s * 3 + 2] = u.z;
      }
      const uo = i * 4;
      uvs[uo] = 0;
      uvs[uo + 1] = d / 14;
      uvs[uo + 2] = 1;
      uvs[uo + 3] = d / 14;

      if (i < n) {
        const a = i * 2;
        const b = i * 2 + 1;
        const c = (i + 1) * 2;
        const dd = (i + 1) * 2 + 1;
        indices.push(a, b, c, b, dd, c);
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('normal', new THREE.BufferAttribute(normals, 3));
    geo.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
    geo.setIndex(indices);
    geo.computeBoundingSphere();

    const mat = new THREE.MeshStandardMaterial({
      map: this.roadTexture,
      emissive: 0xffffff,
      emissiveMap: this.roadTexture,
      emissiveIntensity: 0.85,
      metalness: 0.45,
      roughness: 0.62,
    });

    this.road = new THREE.Mesh(geo, mat);
    this.road.receiveShadow = false;
    this.group.add(this.road);
  }

  offsetPoints(lateral, height, step = 4) {
    const pts = [];
    for (let i = 0; i < this.n; i += step) {
      const p = this.pos[i];
      const r = this.right[i];
      const u = this.up[i];
      pts.push(
        new THREE.Vector3(
          p.x + r.x * lateral + u.x * height,
          p.y + r.y * lateral + u.y * height,
          p.z + r.z * lateral + u.z * height,
        ),
      );
    }
    return pts;
  }

  buildRails() {
    const mat = new THREE.MeshStandardMaterial({
      color: 0x0a2436,
      emissive: 0x00d9ff,
      emissiveIntensity: 1.9,
      metalness: 0.9,
      roughness: 0.25,
    });

    for (const side of [-1, 1]) {
      const pts = this.offsetPoints(side * (HALF_WIDTH - 0.18), 0.75);
      const curve = new THREE.CatmullRomCurve3(pts, true, 'catmullrom', 0.5);
      const geo = new THREE.TubeGeometry(curve, Math.floor(this.n / 3), 0.22, 6, true);
      const mesh = new THREE.Mesh(geo, mat);
      this.group.add(mesh);
    }
  }

  buildMarkers() {
    const step = 26;
    const indices = [];
    for (let i = 0; i < this.n; i += step) indices.push(i);

    const postGeo = new THREE.BoxGeometry(0.14, 2.6, 0.14);
    const postMat = new THREE.MeshStandardMaterial({
      color: 0x141a2e,
      metalness: 0.9,
      roughness: 0.35,
    });
    const capGeo = new THREE.SphereGeometry(0.26, 8, 8);

    const posts = new THREE.InstancedMesh(postGeo, postMat, indices.length * 2);
    const capsCyan = [];
    const capsMagenta = [];
    const dummy = new THREE.Object3D();

    let ci = 0;
    let mi = 0;
    indices.forEach((idx, k) => {
      for (const side of [-1, 1]) {
        const p = this.pos[idx];
        const r = this.right[idx];
        const u = this.up[idx];
        const lat = side * (HALF_WIDTH + 1.35);
        const base = new THREE.Vector3(
          p.x + r.x * lat + u.x * 0.4,
          p.y + r.y * lat + u.y * 0.4,
          p.z + r.z * lat + u.z * 0.4,
        );
        dummy.position.copy(base);
        dummy.position.addScaledVector(u, 1.3);
        dummy.quaternion.setFromUnitVectors(
          UP,
          new THREE.Vector3(u.x, u.y, u.z).normalize(),
        );
        dummy.updateMatrix();
        posts.setMatrixAt(k * 2 + (side > 0 ? 1 : 0), dummy.matrix);

        const isCyan = (k + (side > 0 ? 1 : 0)) % 2 === 0;
        if (isCyan) capsCyan.push(base.clone().addScaledVector(u, 2.65));
        else capsMagenta.push(base.clone().addScaledVector(u, 2.65));
      }
      ci += 1;
      mi += 1;
    });
    posts.instanceMatrix.needsUpdate = true;
    this.group.add(posts);
    this.ci = ci;
    this.mi = mi;

    const makeCaps = (positions, color) => {
      const mat = new THREE.MeshStandardMaterial({
        color: 0x061018,
        emissive: color,
        emissiveIntensity: 2.6,
        metalness: 0.6,
        roughness: 0.3,
      });
      const mesh = new THREE.InstancedMesh(capGeo, mat, positions.length);
      positions.forEach((pos, i) => {
        dummy.position.copy(pos);
        dummy.quaternion.identity();
        dummy.scale.setScalar(1);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
      });
      mesh.instanceMatrix.needsUpdate = true;
      this.group.add(mesh);
      return mesh;
    };
    this.capCyan = makeCaps(capsCyan, 0x00e5ff);
    this.capMagenta = makeCaps(capsMagenta, 0xff2bd6);
  }

  buildStruts() {
    const step = 90;
    const indices = [];
    for (let i = 0; i < this.n; i += step) indices.push(i);

    const geo = new THREE.CylinderGeometry(0.7, 2.4, 1, 6, 1, true);
    const mat = new THREE.MeshStandardMaterial({
      color: 0x0b1022,
      metalness: 0.85,
      roughness: 0.45,
      emissive: 0x0a1830,
      emissiveIntensity: 0.7,
      side: THREE.DoubleSide,
    });
    const mesh = new THREE.InstancedMesh(geo, mat, indices.length);
    const dummy = new THREE.Object3D();
    indices.forEach((idx, i) => {
      const p = this.pos[idx];
      const u = this.up[idx];
      const height = 80;
      dummy.position.set(p.x, p.y - height / 2, p.z);
      dummy.quaternion.identity();
      dummy.scale.set(1, height, 1);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
    this.group.add(mesh);
  }

  buildStartLine() {
    const p = this.pos[0];
    const r = this.right[0];
    const u = this.up[0];
    const t = this.tan[0];
    const geo = new THREE.PlaneGeometry(HALF_WIDTH * 2, 3.4);
    const checker = makeCheckerTexture();
    const mat = new THREE.MeshStandardMaterial({
      map: checker,
      emissive: 0xffffff,
      emissiveMap: checker,
      emissiveIntensity: 0.55,
      metalness: 0.3,
      roughness: 0.7,
      transparent: false,
      side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.copy(p).addScaledVector(u, 0.05);
    mesh.quaternion.copy(basisQuat(r, t, u));
    this.group.add(mesh);
    this.startLine = mesh;
  }

  addGate(index, { width, height, color, banner }) {
    const p = this.pos[index];
    const r = this.right[index];
    const u = this.up[index];
    const t = this.tan[index];
    const g = new THREE.Group();
    g.position.copy(p);
    g.quaternion.copy(basisQuat(r, u, t));

    const mat = new THREE.MeshStandardMaterial({
      color: 0x101a33,
      metalness: 0.9,
      roughness: 0.3,
      emissive: color,
      emissiveIntensity: 0.55,
    });
    const postGeo = new THREE.BoxGeometry(0.5, height, 0.5);
    for (const side of [-1, 1]) {
      const post = new THREE.Mesh(postGeo, mat);
      post.position.set(side * width, height / 2, 0);
      g.add(post);
    }
    const beam = new THREE.Mesh(new THREE.BoxGeometry(width * 2 + 0.5, 0.5, 0.5), mat);
    beam.position.y = height;
    g.add(beam);

    const stripMat = new THREE.MeshBasicMaterial({ color });
    const strip1 = new THREE.Mesh(new THREE.BoxGeometry(width * 2, 0.12, 0.14), stripMat);
    strip1.position.set(0, height - 0.45, 0.28);
    g.add(strip1);

    if (banner) {
      const tex = makeBannerTexture(banner);
      const bannerMat = new THREE.MeshBasicMaterial({
        map: tex,
        transparent: true,
        side: THREE.DoubleSide,
      });
      const plane = new THREE.Mesh(new THREE.PlaneGeometry(width * 1.7, width * 0.42), bannerMat);
      plane.position.set(0, height + width * 0.25, 0);
      g.add(plane);
      this.banner = plane;
    }

    this.group.add(g);
    this.gates.push({ index, group: g });
    return g;
  }

  buildGates() {
    this.addGate(0, { width: HALF_WIDTH - 1.2, height: 7.5, color: 0x00e5ff, banner: 'NEON DRIFT' });
    this.addGate(Math.floor(this.n * 0.5), {
      width: HALF_WIDTH - 1.2,
      height: 7,
      color: 0xff2bd6,
    });
  }

  buildCheckpoints() {
    this.checkpoints = [0, Math.floor(this.n * 0.25), Math.floor(this.n * 0.5), Math.floor(this.n * 0.75)];
  }

  buildPads() {
    const count = 14;
    const geo = new THREE.PlaneGeometry(6.4, 10);
    const mat = new THREE.MeshBasicMaterial({
      map: this.arrowTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: 0.95,
      side: THREE.DoubleSide,
    });

    for (let k = 1; k < count; k++) {
      const index = Math.floor((this.n * k) / count) + 7;
      const lateral = Math.sin(k * 2.399) * (HALF_WIDTH - 5.2);
      const i = index % this.n;
      const p = this.pos[i];
      const r = this.right[i];
      const u = this.up[i];
      const t = this.tan[i];
      const mesh = new THREE.Mesh(geo, mat.clone());
      mesh.position
        .copy(p)
        .addScaledVector(r, lateral)
        .addScaledVector(u, 0.08);
      mesh.quaternion.copy(basisQuat(r, t, u));
      this.group.add(mesh);
      this.pads.push({
        index: i,
        lateral,
        center: mesh.position.clone(),
        mesh,
        cooldown: 0,
        phase: Math.random() * 6,
      });
    }
  }

  buildRings() {
    const count = 9;
    const geo = new THREE.TorusGeometry(3.1, 0.19, 8, 40);
    for (let k = 1; k <= count; k++) {
      const i = Math.floor((this.n * (k - 0.5)) / count) % this.n;
      const p = this.pos[i];
      const r = this.right[i];
      const u = this.up[i];
      const t = this.tan[i];
      const mat = new THREE.MeshStandardMaterial({
        color: 0x0b3a33,
        emissive: 0x33ffcc,
        emissiveIntensity: 2.4,
        metalness: 0.7,
        roughness: 0.3,
      });
      const mesh = new THREE.Mesh(geo, mat);
      const center = p.clone().addScaledVector(u, 3.35);
      mesh.position.copy(center);
      mesh.quaternion.copy(basisQuat(r, u, t));
      this.group.add(mesh);
      this.rings.push({
        center,
        radius: 3.2,
        mesh,
        collected: false,
        respawn: 0,
        phase: Math.random() * 6,
      });
    }
  }

  update(time) {
    for (const pad of this.pads) {
      const pulse = 0.65 + 0.35 * Math.sin(time * 4 + pad.phase);
      pad.mesh.material.opacity = 0.55 + pulse * 0.45;
    }
    for (const ring of this.rings) {
      ring.mesh.rotation.z += 0.006;
      const pulse = 2.0 + Math.sin(time * 3 + ring.phase) * 0.7;
      ring.mesh.material.emissiveIntensity = ring.collected ? 0.18 : pulse;
    }
    if (this.banner) {
      this.banner.material.opacity = 0.85 + Math.sin(time * 2) * 0.15;
    }
  }
}
