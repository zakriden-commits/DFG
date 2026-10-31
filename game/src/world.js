import * as THREE from 'three';
import { std, mesh, roundedBoxGeom, tex, grain, blotch, makeCanvas } from './util.js';
import { buildCar, buildTree, buildLamp, buildBench, buildDumpster, buildCrate, buildMoneyPile, buildWeapon } from './models.js';

/* ===================== procedural surface textures ===================== */
const asphaltTex = () => tex('asphalt', 256, 256, (ctx, w, h) => {
  ctx.fillStyle = '#31333a'; ctx.fillRect(0, 0, w, h);
  grain(ctx, w, h, 46, 5000);
  blotch(ctx, w, h, 'rgba(18,18,22,1)', 18, 60, 0.5);
}, 14, 14);

const sidewalkTex = () => tex('sidewalk', 256, 256, (ctx, w, h) => {
  ctx.fillStyle = '#8b8b87'; ctx.fillRect(0, 0, w, h);
  grain(ctx, w, h, 40, 2600);
  ctx.strokeStyle = 'rgba(60,60,60,.55)'; ctx.lineWidth = 2;
  for (let i = 0; i <= 4; i++) {
    ctx.beginPath(); ctx.moveTo(i * w / 4, 0); ctx.lineTo(i * w / 4, h); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, i * h / 4); ctx.lineTo(w, i * h / 4); ctx.stroke();
  }
  blotch(ctx, w, h, 'rgba(50,50,50,1)', 22, 30, 0.25);
}, 10, 10);

const brickTex = () => tex('brick', 256, 256, (ctx, w, h) => {
  ctx.fillStyle = '#6b3f34'; ctx.fillRect(0, 0, w, h);
  const bh = 16, bw = 40;
  for (let y = 0; y < h; y += bh) {
    for (let x = -bw; x < w + bw; x += bw) {
      const off = (y / bh) % 2 ? bw / 2 : 0;
      const c = 90 + Math.random() * 46;
      ctx.fillStyle = `rgb(${c + 22},${c - 18},${c - 32})`;
      ctx.fillRect(x + off + 1.5, y + 1.5, bw - 3, bh - 3);
    }
  }
  grain(ctx, w, h, 40, 2200);
}, 4, 4);

const plasterTex = (name = 'plaster', base = '#9a927f') => tex(name, 256, 256, (ctx, w, h) => {
  ctx.fillStyle = base; ctx.fillRect(0, 0, w, h);
  grain(ctx, w, h, 26, 2400);
  blotch(ctx, w, h, 'rgba(60,55,45,1)', 16, 70, 0.2);
  ctx.strokeStyle = 'rgba(70,66,56,.25)'; ctx.lineWidth = 1;
  for (let i = 0; i < 8; i++) { ctx.beginPath(); ctx.moveTo(Math.random() * w, 0); ctx.lineTo(Math.random() * w, h); ctx.stroke(); }
}, 3, 3);

const facadeTex = (name, wall, lit = 0.5) => tex(name, 512, 512, (ctx, w, h) => {
  ctx.fillStyle = wall; ctx.fillRect(0, 0, w, h);
  grain(ctx, w, h, 30, 3000);
  const cols = 5, rows = 5, ww = 62, wh = 78, gx = (w - cols * ww) / (cols + 1), gy = (h - rows * wh) / (rows + 1);
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = gx + c * (ww + gx), y = gy + r * (wh + gy);
      const on = Math.random() < lit;
      ctx.fillStyle = on ? `rgba(255,214,140,${0.75 + Math.random() * 0.25})` : `rgba(24,30,38,${0.85})`;
      ctx.fillRect(x, y, ww, wh);
      ctx.strokeStyle = 'rgba(30,30,30,.8)'; ctx.lineWidth = 4; ctx.strokeRect(x, y, ww, wh);
      ctx.beginPath(); ctx.moveTo(x + ww / 2, y); ctx.lineTo(x + ww / 2, y + wh); ctx.stroke();
      if (!on) {
        ctx.fillStyle = 'rgba(120,150,180,.10)';
        ctx.beginPath(); ctx.moveTo(x, y + wh); ctx.lineTo(x + ww * 0.7, y); ctx.lineTo(x + ww, y); ctx.lineTo(x + ww * 0.3, y + wh); ctx.fill();
      }
    }
  }
}, 1, 1);

const woodTex = () => tex('woodFloor', 256, 256, (ctx, w, h) => {
  ctx.fillStyle = '#6d4a2e'; ctx.fillRect(0, 0, w, h);
  for (let y = 0; y < h; y += 32) {
    ctx.fillStyle = `rgba(${60 + Math.random() * 40},${40 + Math.random() * 26},${20 + Math.random() * 18},1)`;
    ctx.fillRect(0, y, w, 30);
    ctx.strokeStyle = 'rgba(30,20,10,.5)'; ctx.lineWidth = 2;
    for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.moveTo(0, y + 4 + i * 6); ctx.bezierCurveTo(w * 0.3, y + i * 6, w * 0.6, y + 12, w, y + 3 + i * 6); ctx.stroke(); }
  }
  grain(ctx, w, h, 34, 1800);
}, 6, 6);

const tileTex = () => tex('tile', 256, 256, (ctx, w, h) => {
  ctx.fillStyle = '#3c4046'; ctx.fillRect(0, 0, w, h);
  for (let y = 0; y < h; y += 64) for (let x = 0; x < w; x += 64) {
    ctx.fillStyle = (x + y) % 128 ? '#4a4f57' : '#42474e';
    ctx.fillRect(x + 2, y + 2, 60, 60);
  }
  grain(ctx, w, h, 30, 1500);
}, 6, 6);

/* ===================== helpers ===================== */
const WALL_MAT = () => std(0xffffff, { map: plasterTex(), roughness: 0.9 });
const BRICK_MAT = () => std(0xffffff, { map: brickTex(), roughness: 0.92 });

function box(parent, colliders, x, y, z, w, h, d, material, tag = 'wall', collide = true) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
  m.position.set(x, y + h / 2, z);
  m.castShadow = true; m.receiveShadow = true;
  parent.add(m);
  if (collide) {
    colliders.add(x - w / 2, x + w / 2, z - d / 2, z + d / 2, tag, m);
  }
  return m;
}

function plane(parent, x, z, w, d, material, y = 0.02) {
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, d), material);
  m.rotation.x = -Math.PI / 2;
  m.position.set(x, y, z);
  m.receiveShadow = true;
  parent.add(m);
  return m;
}

/* ===================== SIGN textures ===================== */
const signTex = (txt, sub, bg = '#101418', fg = '#ffd45e', subFg = '#c9c2a8') => {
  const c = makeCanvas(512, 160, (ctx, w, h) => {
    ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);
    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, 'rgba(255,255,255,.10)'); g.addColorStop(1, 'rgba(0,0,0,.35)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = fg; ctx.lineWidth = 5; ctx.strokeRect(9, 9, w - 18, h - 18);
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillStyle = fg; ctx.font = '900 62px Impact,"Arial Black",sans-serif';
    ctx.fillText(txt, w / 2, sub ? h * 0.40 : h * 0.52);
    if (sub) { ctx.fillStyle = subFg; ctx.font = '600 30px system-ui,sans-serif'; ctx.fillText(sub, w / 2, h * 0.75); }
  });
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
};

/* ===================== WORLD ===================== */
export function buildWorld(scene, colliders) {
  const root = new THREE.Group();
  scene.add(root);
  const W = {};

  const ground = new THREE.Mesh(new THREE.PlaneGeometry(400, 400), std(0x2c3a26, { roughness: 1 }));
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  ground.position.y = -0.02;
  root.add(ground);

  /* ---- roads & sidewalks ---- */
  const road = plane(root, 0, 0, 200, 12, std(0xffffff, { map: asphaltTex(), roughness: 0.95 }), 0.01);
  const sideMat = std(0xffffff, { map: sidewalkTex(), roughness: 0.95 });
  plane(root, 0, -8.2, 200, 6.4, sideMat, 0.12);
  plane(root, 0, 8.2, 200, 6.4, sideMat, 0.12);
  // curbs
  const curbM = std(0x9a9a94, { roughness: 0.9 });
  [-5.0, 5.0].forEach((z) => {
    const c = box(root, colliders, 0, 0, z, 200, 0.22, 0.35, curbM, 'noLOS', false);
    c.castShadow = false;
  });
  // road markings
  const lineM = std(0xd9d2a8, { roughness: 0.8 });
  for (let x = -92; x < 96; x += 8) {
    plane(root, x, 0, 3.4, 0.22, lineM, 0.03).castShadow = false;
  }
  // crosswalk
  for (let i = 0; i < 7; i++) {
    plane(root, 2.6, -4.4 + i * 1.45, 5.5, 0.6, lineM, 0.035);
  }

  /* ================= HOUSE (south side, x -16..-2, z 10..22) ================= */
  const H = { x1: -16, x2: -2, z1: 10, z2: 22, h: 3.3 };
  const house = new THREE.Group();
  root.add(house);
  const houseMat = std(0xffffff, { map: plasterTex('plasterHouse', '#8d7c62'), roughness: 0.92 });
  const floorMat = std(0xffffff, { map: woodTex(), roughness: 0.85 });

  plane(house, (H.x1 + H.x2) / 2, (H.z1 + H.z2) / 2, H.x2 - H.x1, H.z2 - H.z1, floorMat, 0.06);
  const t = 0.3;
  // north wall with doorway x -9.4..-7.6
  box(house, colliders, (H.x1 + -9.4) / 2, 0, H.z1 + t / 2, -9.4 - H.x1, H.h, t, houseMat);
  box(house, colliders, (-7.6 + H.x2) / 2, 0, H.z1 + t / 2, H.x2 + 7.6, H.h, t, houseMat);
  box(house, colliders, -8.5, 2.4, H.z1 + t / 2, 1.8, H.h - 2.4, t, houseMat); // lintel
  // south, east, west walls
  box(house, colliders, (H.x1 + H.x2) / 2, 0, H.z2 - t / 2, H.x2 - H.x1, H.h, t, houseMat);
  box(house, colliders, H.x1 + t / 2, 0, (H.z1 + H.z2) / 2, t, H.h, H.z2 - H.z1, houseMat);
  box(house, colliders, H.x2 - t / 2, 0, (H.z1 + H.z2) / 2, t, H.h, H.z2 - H.z1, houseMat);
  // ceiling + roof
  const ceiling = new THREE.Mesh(new THREE.BoxGeometry(H.x2 - H.x1, 0.2, H.z2 - H.z1), std(0x6b6355, { roughness: 0.95 }));
  ceiling.position.set((H.x1 + H.x2) / 2, H.h + 0.1, (H.z1 + H.z2) / 2);
  ceiling.castShadow = true; ceiling.receiveShadow = true;
  house.add(ceiling);
  const roof = mesh(roundedBoxGeom(H.x2 - H.x1 + 0.8, 0.35, H.z2 - H.z1 + 0.8, 0.1), std(0x3d3428, { roughness: 0.95 }), (H.x1 + H.x2) / 2, H.h + 0.35, (H.z1 + H.z2) / 2);
  house.add(roof);

  /* house door (hinged) */
  const doorPivot = new THREE.Group();
  doorPivot.position.set(-7.6, 0, H.z1 + t / 2);
  house.add(doorPivot);
  const doorMesh = mesh(roundedBoxGeom(1.8, 2.35, 0.12, 0.03), std(0x5a3a22, { roughness: 0.8 }), -0.9, 1.18, 0);
  doorPivot.add(doorMesh);
  doorMesh.add(mesh(new THREE.SphereGeometry(0.06, 8, 6), std(0xd8b64a, { metalness: 0.9, roughness: 0.25 }), 0.62, 0, 0.1));
  const doorCollider = colliders.add(-8.6, -7.5, H.z1 + 0.02, H.z1 + 0.3, 'door');
  W.houseDoor = {
    pivot: doorPivot, open: false, angle: 0, collider: doorCollider,
    pos: new THREE.Vector3(-8.5, 0, H.z1 + 0.4),
  };

  /* beds */
  const bedMat = std(0x2a3550, { roughness: 0.92 });
  const sheetMat = std(0xc9c2ad, { roughness: 0.95 });
  const woodM = std(0x4a3220, { roughness: 0.9 });
  W.bedSpots = [];
  [-14.0, -11.5].forEach((bx, i) => {
    const bed = new THREE.Group();
    bed.position.set(bx, 0, 12.05);
    house.add(bed);
    bed.add(mesh(roundedBoxGeom(1.5, 0.35, 2.3, 0.06), woodM, 0, 0.22, 0));
    bed.add(mesh(roundedBoxGeom(1.35, 0.24, 2.1, 0.09), bedMat, 0, 0.48, 0));
    bed.add(mesh(roundedBoxGeom(1.3, 0.1, 1.5, 0.06), sheetMat, 0, 0.58, 0.28));
    bed.add(mesh(roundedBoxGeom(0.8, 0.16, 0.42, 0.1), std(0xe8e2ce), 0, 0.62, -0.78)); // pillow
    bed.add(mesh(roundedBoxGeom(1.5, 0.75, 0.12, 0.05), woodM, 0, 0.55, -1.16)); // headboard
    colliders.add(bx - 0.75, bx + 0.75, 10.9, 13.2, 'furniture');
    W.bedSpots.push({
      pos: new THREE.Vector3(bx, 0.56, 13.0),
      yaw: Math.PI,
      idx: i,
      wakePos: new THREE.Vector3(bx + (i === 0 ? -0.5 : 0.5), 0, 14.1),
    });
  });

  /* lockers */
  const lockerMat = std(0x3d4a52, { roughness: 0.55, metalness: 0.5 });
  W.lockers = [];
  [15.6, 17.9].forEach((lz, i) => {
    const g = new THREE.Group();
    g.position.set(-15.1, 0, lz);
    house.add(g);
    g.add(mesh(roundedBoxGeom(0.75, 2.0, 0.85, 0.04), lockerMat, 0, 1.0, 0));
    const door = mesh(roundedBoxGeom(0.05, 1.85, 0.78, 0.02), std(0x4b5a63, { roughness: 0.5, metalness: 0.6 }), 0.39, 1.0, 0);
    g.add(door);
    g.add(mesh(new THREE.BoxGeometry(0.06, 0.22, 0.05), std(0xd8b64a, { metalness: 0.9, roughness: 0.2 }), 0.43, 1.05, 0.3));
    for (let v = 0; v < 3; v++) g.add(mesh(new THREE.BoxGeometry(0.02, 0.02, 0.55), std(0x2a343a), 0.42, 1.7, 0));
    colliders.add(-15.6, -14.7, lz - 0.5, lz + 0.5, 'furniture');
    W.lockers.push({ id: i === 0 ? 'lockerA' : 'lockerB', pos: new THREE.Vector3(-14.4, 0, lz), lockers3d: g, label: i === 0 ? 'Шкаф 1' : 'Шкаф 2' });
  });

  /* table, tv, rug, kitchen */
  const table = new THREE.Group();
  table.position.set(-6.4, 0, 18.4);
  house.add(table);
  table.add(mesh(roundedBoxGeom(1.9, 0.1, 1.1, 0.04), woodM, 0, 0.78, 0));
  [[-0.8, -0.4], [0.8, -0.4], [-0.8, 0.4], [0.8, 0.4]].forEach(([x, z]) => table.add(mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.78, 6), woodM, x, 0.39, z)));
  colliders.add(-7.4, -5.4, 17.8, 19.0, 'furniture');

  const rug = plane(house, -9.5, 17.5, 5, 3.4, std(0x6b2f2f, { roughness: 1 }), 0.08);
  rug.castShadow = false;

  const tv = mesh(roundedBoxGeom(1.5, 0.9, 0.09, 0.03), std(0x11141a, { roughness: 0.4 }), -6.4, 1.6, 21.6);
  house.add(tv);
  tv.add(mesh(new THREE.PlaneGeometry(1.4, 0.8), std(0x223344, { emissive: 0x2a4a66, emissiveIntensity: 0.6 }), 0, 0, 0.06));

  // kitchen counter (south wall)
  house.add(mesh(roundedBoxGeom(4.2, 0.95, 0.75, 0.05), std(0x6f6a5c, { roughness: 0.8 }), -13.0, 0.5, 21.4));
  house.add(mesh(roundedBoxGeom(4.3, 0.09, 0.85, 0.03), std(0x2c3238, { roughness: 0.5 }), -13.0, 1.0, 21.4));
  colliders.add(-15.1, -10.9, 21.0, 21.8, 'furniture');

  // house lights
  const houseLight = new THREE.PointLight(0xffd9a0, 22, 14, 2);
  houseLight.position.set(-9, 2.7, 16);
  house.add(houseLight);
  const lamp2 = new THREE.PointLight(0xffc98a, 10, 9, 2);
  lamp2.position.set(-13.5, 2.4, 12.5);
  house.add(lamp2);
  // hanging bulb
  house.add(mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.5, 4), std(0x222222), -9, 3.05, 16));
  house.add(mesh(new THREE.SphereGeometry(0.12, 10, 8), std(0xfff2c0, { emissive: 0xffdf9a, emissiveIntensity: 1.4 }), -9, 2.78, 16));

  /* ================= BANK (north side, x -2..26, z -34..-9) ================= */
  const B = { x1: -2, x2: 26, z1: -34, z2: -9, h: 7.2 };
  const bank = new THREE.Group();
  root.add(bank);
  const bankMat = std(0xffffff, { map: facadeTex('bankFacade', '#7d7466', 0.45), roughness: 0.85 });
  const bankIn = std(0xd8d2c0, { roughness: 0.9 });
  const bankFloor = std(0xffffff, { map: tileTex(), roughness: 0.55 });
  plane(bank, (B.x1 + B.x2) / 2, (B.z1 + B.z2) / 2, B.x2 - B.x1, B.z2 - B.z1, bankFloor, 0.05);

  const bt = 0.4;
  // south wall with wide entrance x 9..14
  box(bank, colliders, (B.x1 + 9) / 2, 0, B.z2 - bt / 2, 9 - B.x1, B.h, bt, bankMat);
  box(bank, colliders, (14 + B.x2) / 2, 0, B.z2 - bt / 2, B.x2 - 14, B.h, bt, bankMat);
  box(bank, colliders, 11.5, 4.2, B.z2 - bt / 2, 5, B.h - 4.2, bt, bankMat);
  // other walls
  box(bank, colliders, (B.x1 + B.x2) / 2, 0, B.z1 + bt / 2, B.x2 - B.x1, B.h, bt, bankMat);
  box(bank, colliders, B.x1 + bt / 2, 0, (B.z1 + B.z2) / 2, bt, B.h, B.z2 - B.z1, bankMat);
  box(bank, colliders, B.x2 - bt / 2, 0, (B.z1 + B.z2) / 2, bt, B.h, B.z2 - B.z1, bankMat);
  // roof
  const broof = mesh(roundedBoxGeom(B.x2 - B.x1 + 1, 0.5, B.z2 - B.z1 + 1, 0.1), std(0x3a3a40, { roughness: 0.9 }), (B.x1 + B.x2) / 2, B.h + 0.25, (B.z1 + B.z2) / 2);
  bank.add(broof);
  const bceil = new THREE.Mesh(new THREE.BoxGeometry(B.x2 - B.x1, 0.2, B.z2 - B.z1), std(0x8d8677, { roughness: 0.9 }));
  bceil.position.set((B.x1 + B.x2) / 2, B.h, (B.z1 + B.z2) / 2);
  bank.add(bceil);

  for (let i = 0; i < 4; i++) {
    const cx = 2 + i * 6.6;
    bank.add(mesh(new THREE.CylinderGeometry(0.35, 0.4, B.h - 0.4, 12), std(0xcfc7b4, { roughness: 0.8 }), cx, (B.h - 0.4) / 2 + 0.2, B.z2 + 0.7));
    colliders.add(cx - 0.42, cx + 0.42, B.z2 + 0.3, B.z2 + 1.1, 'wall');
  }
  // steps
  for (let i = 0; i < 3; i++) {
    bank.add(mesh(new THREE.BoxGeometry(10, 0.18, 0.55), std(0xb0a893, { roughness: 0.9 }), 11.5, 0.09 + i * 0.02, B.z2 + 1.4 + i * 0.5));
  }

  // bank sign
  const signGeo = new THREE.PlaneGeometry(11, 3.4);
  const bankSign = new THREE.Mesh(signGeo, new THREE.MeshBasicMaterial({ map: signTex('БАНК «DENI»', 'МЕЖДУНАРОДНЫЙ БАНК · 24 ЧАСА'), transparent: false }));
  bankSign.position.set(11.5, B.h - 2.1, B.z2 + 0.26);
  bank.add(bankSign);

  // glass entrance doors (auto)
  W.bankDoors = [];
  [9.6, 11.9].forEach((dx) => {
    const pivot = new THREE.Group();
    pivot.position.set(dx, 0, B.z2 - 0.3);
    bank.add(pivot);
    const glass = mesh(roundedBoxGeom(2.0, 3.0, 0.08, 0.03), std(0x9fd0e0, { transparent: true, opacity: 0.28, roughness: 0.1, metalness: 0.2 }), 1.0, 1.5, 0);
    pivot.add(glass);
    pivot.add(mesh(new THREE.BoxGeometry(2.0, 0.08, 0.12), std(0xb9b3a2, { metalness: 0.7, roughness: 0.3 }), 1.0, 0.05, 0));
    const col = colliders.add(dx, dx + 2.0, B.z2 - 0.4, B.z2 - 0.2, 'door');
    W.bankDoors.push({ pivot, collider: col, baseX: dx, open: false });
  });

  // interior counters (north wall side)
  const counterMat = std(0x5a4230, { roughness: 0.75 });
  const glassM = std(0x9fd0e0, { transparent: true, opacity: 0.22, roughness: 0.08, metalness: 0.3 });
  for (let i = 0; i < 3; i++) {
    const cx = 4.6 + i * 6.0;
    box(bank, colliders, cx, 0, -22.6, 4.4, 1.15, 1.1, counterMat, 'furniture');
    // glass screen
    bank.add(mesh(new THREE.BoxGeometry(4.4, 1.1, 0.05), glassM, cx, 1.75, -23.1));
    bank.add(mesh(new THREE.BoxGeometry(4.6, 0.1, 0.12), std(0xc9a227, { metalness: 0.85, roughness: 0.3 }), cx, 2.32, -23.1));
    // monitors
    bank.add(mesh(new THREE.BoxGeometry(0.55, 0.38, 0.05), std(0x11151c, { roughness: 0.4 }), cx - 0.9, 1.45, -22.5));
    bank.add(mesh(new THREE.BoxGeometry(0.5, 0.3, 0.03), std(0x2a4a66, { emissive: 0x3b6d8f, emissiveIntensity: 0.8 }), cx - 0.9, 1.45, -22.46));
    bank.add(mesh(new THREE.BoxGeometry(0.6, 0.08, 0.3), std(0x22262c), cx + 1.2, 1.22, -22.4));
  }
  // money piles on the counter
  W.bankMoney = [];
  [4.6, 8.6, 10.6, 12.6, 16.6].forEach((mx, i) => {
    const pile = buildMoneyPile(1000);
    pile.scale.setScalar(1.6);
    pile.position.set(mx + (i % 2 ? 0.2 : -0.2), 1.17, -22.2);
    bank.add(pile);
    W.bankMoney.push({ mesh: pile, pos: new THREE.Vector3(mx, 1.2, -22.2), taken: false, id: i });
  });

  // vault (decor on the east wall)
  const vault = new THREE.Group();
  vault.position.set(24.0, 0, -20);
  bank.add(vault);
  vault.add(mesh(new THREE.CylinderGeometry(1.9, 1.9, 0.5, 24), std(0x6d6a63, { metalness: 0.85, roughness: 0.35 }), 0, 1.9, 0));
  vault.add(mesh(new THREE.TorusGeometry(0.55, 0.09, 6, 16), std(0xc9a227, { metalness: 0.9, roughness: 0.25 }), 0, 1.9, 0.28));
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2;
    const bolt = mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.22, 6), std(0xb9b3a2, { metalness: 0.9, roughness: 0.2 }), Math.cos(a) * 1.45, 1.9 + Math.sin(a) * 1.45, 0.26);
    bolt.rotation.x = Math.PI / 2;
    vault.add(bolt);
  }
  colliders.add(22.2, 25.9, -21.9, -18.1, 'furniture');
  // vault frame
  bank.add(mesh(roundedBoxGeom(1.0, 4.0, 5.0, 0.05), std(0x4a4f56, { roughness: 0.6, metalness: 0.4 }), 25.6, 2.0, -20));
  // safe deposit boxes on east wall
  for (let i = 0; i < 18; i++) {
    const sx = 25.2, sy = 1.4 + Math.floor(i / 6) * 0.62, sz = -14 + (i % 6) * 0.9;
    bank.add(mesh(new THREE.BoxGeometry(0.12, 0.5, 0.8), std(0x5a6068, { metalness: 0.7, roughness: 0.4 }), sx, sy, sz));
  }

  // chairs / waiting area / plants
  const plantMat = std(0x2e5a2a, { roughness: 0.95, flat: true });
  [[1.5, -12.5], [23.5, -11], [1.5, -28]].forEach(([px, pz]) => {
    const pot = mesh(new THREE.CylinderGeometry(0.42, 0.32, 0.7, 10), std(0x7a5a44, { roughness: 0.9 }), px, 0.35, pz);
    bank.add(pot);
    bank.add(mesh(new THREE.IcosahedronGeometry(0.85, 1), plantMat, px, 1.35, pz));
    bank.add(mesh(new THREE.IcosahedronGeometry(0.55, 1), plantMat, px + 0.3, 1.9, pz + 0.2));
  });
  for (let i = 0; i < 4; i++) {
    const cx = 6 + i * 2.2;
    bank.add(mesh(roundedBoxGeom(1.7, 0.16, 0.6, 0.05), std(0x353a42, { roughness: 0.7 }), cx, 0.5, -15.5));
    bank.add(mesh(roundedBoxGeom(1.7, 0.7, 0.14, 0.05), std(0x353a42, { roughness: 0.7 }), cx, 0.85, -15.8));
    [[-0.7], [0.7]].forEach(([o]) => bank.add(mesh(new THREE.BoxGeometry(0.1, 0.5, 0.5), std(0x22262c), cx + o, 0.25, -15.5)));
  }
  // bank lighting
  [[8, 4.4, -14], [16, 4.4, -24]].forEach(([x, y, z]) => {
    const l = new THREE.PointLight(0xfff0d0, 16, 16, 2);
    l.position.set(x, y, z); bank.add(l);
    bank.add(mesh(new THREE.CylinderGeometry(0.5, 0.6, 0.12, 12), std(0xfff4d8, { emissive: 0xfff0c0, emissiveIntensity: 1.2 }), x, y + 0.25, z));
  });
  // alarm lamp
  const alarmLamp = new THREE.Mesh(new THREE.SphereGeometry(0.28, 14, 10), std(0x551111, { emissive: 0x330000, emissiveIntensity: 0.6 }));
  alarmLamp.position.set(11.5, 4.0, -9.4);
  bank.add(alarmLamp);
  W.alarmLamp = alarmLamp;

  /* ================= GUN SHOP (north side, x -32..-18, z -26..-9) ================= */
  const S = { x1: -32, x2: -18, z1: -26, z2: -9, h: 4.4 };
  const shop = new THREE.Group();
  root.add(shop);
  const shopMat = std(0xffffff, { map: facadeTex('shopFacade', '#5c5148', 0.6), roughness: 0.9 });
  plane(shop, (S.x1 + S.x2) / 2, (S.z1 + S.z2) / 2, S.x2 - S.x1, S.z2 - S.z1, std(0xffffff, { map: tileTex(), roughness: 0.7 }), 0.05);
  const st = 0.35;
  box(shop, colliders, (S.x1 - 25.6) / 2, 0, S.z2 - st / 2, -25.6 - S.x1, S.h, st, shopMat);
  box(shop, colliders, (-22.4 + S.x2) / 2, 0, S.z2 - st / 2, S.x2 + 22.4, S.h, st, shopMat);
  box(shop, colliders, -24, 2.9, S.z2 - st / 2, 3.2, S.h - 2.9, st, shopMat);
  box(shop, colliders, (S.x1 + S.x2) / 2, 0, S.z1 + st / 2, S.x2 - S.x1, S.h, st, shopMat);
  box(shop, colliders, S.x1 + st / 2, 0, (S.z1 + S.z2) / 2, st, S.h, S.z2 - S.z1, shopMat);
  box(shop, colliders, S.x2 - st / 2, 0, (S.z1 + S.z2) / 2, st, S.h, S.z2 - S.z1, shopMat);
  shop.add(mesh(roundedBoxGeom(S.x2 - S.x1 + 0.6, 0.4, S.z2 - S.z1 + 0.6, 0.1), std(0x2f3238, { roughness: 0.9 }), (S.x1 + S.x2) / 2, S.h + 0.2, (S.z1 + S.z2) / 2));
  shop.add(mesh(new THREE.BoxGeometry(S.x2 - S.x1, 0.16, S.z2 - S.z1), std(0x54504a), (S.x1 + S.x2) / 2, S.h, (S.z1 + S.z2) / 2));

  const shopSign = new THREE.Mesh(new THREE.PlaneGeometry(9.5, 2.6), new THREE.MeshBasicMaterial({ map: signTex('ОРУЖИЕ', 'ВСЁ ДЛЯ СЕРЬЁЗНЫХ ЛЮДЕЙ', '#1a0e0c', '#ff8f3f', '#e8c9a0') }));
  shopSign.position.set(-24, S.h - 1.0, S.z2 + 0.22);
  shop.add(shopSign);

  // neon
  const neonM = std(0xff6a2a, { emissive: 0xff5a1a, emissiveIntensity: 2.2, roughness: 0.4 });
  const neon = new THREE.Mesh(new THREE.BoxGeometry(9.6, 0.12, 0.06), neonM);
  neon.position.set(-24, S.h - 2.4, S.z2 + 0.24);
  shop.add(neon);
  const shopLight = new THREE.PointLight(0xff8a4a, 10, 10, 2);
  shopLight.position.set(-24, 3.0, -9.6);
  shop.add(shopLight);

  // weapon racks (north wall)
  const rackWood = std(0x4a3524, { roughness: 0.9 });
  for (let i = 0; i < 2; i++) shop.add(mesh(new THREE.BoxGeometry(6.5, 0.14, 0.5), rackWood, -27.5 + i * 0.05, 1.5 + i * 1.0, -25.2));
  const wallGuns = ['rifle', 'shotgun', 'rifle', 'shotgun'];
  wallGuns.forEach((gid, i) => {
    const gm = buildWeapon(gid);
    gm.position.set(-29 + i * 1.9, 1.75, -25.1);
    gm.rotation.set(0, Math.PI / 2, 0.1);
    gm.scale.set(1.6, 1.6, 1.6);
    shop.add(gm);
  });
  const wallPistols = ['pistol', 'pistol', 'pistol'];
  wallPistols.forEach((gid, i) => {
    const gm = buildWeapon(gid);
    gm.position.set(-30 + i * 1.3, 2.6, -25.1);
    gm.rotation.set(0, Math.PI / 2, 0);
    gm.scale.set(1.7, 1.7, 1.7);
    shop.add(gm);
  });
  // counter
  box(shop, colliders, -24.5, 0, -21.0, 8.4, 1.1, 1.0, std(0x3a2c1e, { roughness: 0.8 }), 'furniture');
  shop.add(mesh(new THREE.BoxGeometry(8.6, 0.09, 1.15), std(0x8a6a3a, { roughness: 0.6, metalness: 0.2 }), -24.5, 1.14, -21.0));
  // ammo boxes on counter and shelves
  const ammoM = std(0x3f5a2c, { roughness: 0.85 });
  for (let i = 0; i < 8; i++) {
    shop.add(mesh(new THREE.BoxGeometry(0.3, 0.16, 0.22), ammoM, -27.8 + i * 0.62, 1.28, -20.8));
  }
  for (let i = 0; i < 3; i++) shop.add(mesh(new THREE.BoxGeometry(2.6, 0.12, 0.5), rackWood, -29, 2.9 + i * 0.02, -18 + i * 1.6));
  for (let i = 0; i < 9; i++) {
    shop.add(mesh(new THREE.BoxGeometry(0.3, 0.2, 0.26), ammoM, -30 + (i % 3) * 0.9, 1.0 + Math.floor(i / 3) * 0.5, -19.6));
  }
  // safe / crates
  shop.add(mesh(roundedBoxGeom(1.1, 1.3, 0.9, 0.04), std(0x2f3a44, { metalness: 0.6, roughness: 0.4 }), -30.5, 0.65, -23.5));
  shop.add(mesh(new THREE.TorusGeometry(0.16, 0.04, 6, 12), std(0xb9c2c9, { metalness: 0.9, roughness: 0.2 }), -30.5, 0.95, -23.0));
  const shopLight2 = new THREE.PointLight(0xfff0d0, 16, 16, 2);
  shopLight2.position.set(-24, 3.6, -17);
  shop.add(shopLight2);
  shop.add(mesh(new THREE.CylinderGeometry(0.45, 0.55, 0.1, 10), std(0xfff4d8, { emissive: 0xfff0c0, emissiveIntensity: 1.1 }), -24, 4.1, -18));

  W.shopPoint = new THREE.Vector3(-24.5, 0, -19.2);
  W.sellerPos = new THREE.Vector3(-24.5, 0, -22.2);
  W.sellerYaw = 0;

  /* ================= OTHER BUILDINGS (facades) ================= */
  const cityBuild = (x1, x2, z1, z2, h, texName, wallColor, lit) => {
    const g = new THREE.Group();
    root.add(g);
    const m = std(0xffffff, { map: facadeTex(texName, wallColor, lit), roughness: 0.88 });
    const b = new THREE.Mesh(new THREE.BoxGeometry(x2 - x1, h, z2 - z1), m);
    b.position.set((x1 + x2) / 2, h / 2, (z1 + z2) / 2);
    b.castShadow = true; b.receiveShadow = true;
    g.add(b);
    colliders.add(x1, x2, z1, z2, 'building');
    // roof trim
    g.add(mesh(new THREE.BoxGeometry(x2 - x1 + 0.5, 0.35, z2 - z1 + 0.5), std(0x2f3238, { roughness: 0.9 }), (x1 + x2) / 2, h + 0.15, (z1 + z2) / 2));
    return g;
  };
  cityBuild(30, 58, -32, -9, 11, 'facadeA', '#7a7060', 0.5);
  cityBuild(-64, -36, -30, -9, 9.5, 'facadeB', '#6a6a72', 0.45);
  cityBuild(4, 30, 10, 26, 12, 'facadeC', '#786a58', 0.4);
  cityBuild(-36, -22, 11, 26, 7.5, 'facadeD', '#6d6455', 0.5);
  cityBuild(-64, -40, 12, 28, 8, 'facadeE', '#5f5a52', 0.45);
  cityBuild(46, 62, -32, -10, 8, 'facadeF', '#6b6055', 0.4);
  // shopfront awnings
  for (let i = 0; i < 4; i++) {
    const ax = 34 + i * 6.2;
    root.add(mesh(roundedBoxGeom(5.4, 0.16, 2.0, 0.05), std(i % 2 ? 0x8c2a22 : 0x2c5a6a, { roughness: 0.9 }), ax, 3.0, -8.2));
    root.add(mesh(new THREE.BoxGeometry(5.4, 0.1, 0.1), std(0x2a2a2a, { metalness: 0.7 }), ax, 3.05, -9.2));
    root.add(mesh(new THREE.PlaneGeometry(5.0, 2.4), std(0x203040, { emissive: 0x2b4a63, emissiveIntensity: 0.5, roughness: 0.3 }), ax, 1.7, -8.98));
  }

  /* ================= LOADING DOCK / JOB AREA ================= */
  const dock = new THREE.Group();
  dock.position.set(40, 0, 15);
  root.add(dock);
  // warehouse wall
  dock.add(mesh(new THREE.BoxGeometry(16, 6, 0.4), std(0xffffff, { map: brickTex(), roughness: 0.95 }), 0, 3, -3.6));
  colliders.add(32, 48, 10.6, 11.4, 'building');
  // truck
  const truck = new THREE.Group();
  truck.position.set(2.5, 0, 1.5);
  truck.rotation.y = -0.45;
  dock.add(truck);
  const cabM = std(0x2f4a63, { roughness: 0.4, metalness: 0.5 });
  truck.add(mesh(roundedBoxGeom(2.3, 2.0, 2.4, 0.2), cabM, 0, 1.55, 2.9));
  truck.add(mesh(roundedBoxGeom(2.2, 0.9, 1.6, 0.16), std(0x1b2733, { roughness: 0.15, metalness: 0.4 }), 0, 2.3, 3.1));
  truck.add(mesh(roundedBoxGeom(2.4, 2.4, 5.4, 0.12), std(0x8a8f96, { roughness: 0.7, metalness: 0.3 }), 0, 1.9, -1.2));
  truck.add(mesh(roundedBoxGeom(2.3, 2.2, 0.08, 0.05), std(0x6d7178, { roughness: 0.8 }), 0, 1.85, -3.9));
  [[-1.15, 2.9], [1.15, 2.9], [-1.15, -2.2], [1.15, -2.2], [-1.15, -0.6], [1.15, -0.6]].forEach(([x, z]) => {
    const w = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.3, 12), std(0x17181c, { roughness: 0.8 }));
    w.rotation.z = Math.PI / 2; w.position.set(x, 0.5, z); w.castShadow = true;
    truck.add(w);
  });
  colliders.add(38.2, 43.6, 12.6, 20.4, 'building');

  // crates scattered
  W.boxSpawns = [];
  [[-3.4, 2.2], [-4.4, 4.6], [-2.2, 5.6], [-5.2, 1.0]].forEach(([x, z], i) => {
    const c = buildCrate(0.62);
    c.position.set(40 + x, 0, 15 + z);
    c.rotation.y = Math.random() * 3;
    root.add(c);
    W.boxSpawns.push({ mesh: c, pos: c.position.clone(), id: i });
    colliders.add(c.position.x - 0.35, c.position.x + 0.35, c.position.z - 0.35, c.position.z + 0.35, 'furniture');
  });
  W.truckPoint = new THREE.Vector3(42.5, 0, 16.0);
  W.dockBossPoint = new THREE.Vector3(36.5, 0, 13.0);

  /* ================= STREET PROPS ================= */
  const lampPositions = [];
  for (let x = -56; x <= 56; x += 16) {
    lampPositions.push([x, -8.8, 0], [x + 8, 8.8, Math.PI]);
  }
  lampPositions.forEach(([x, z, r]) => {
    const l = buildLamp();
    l.position.set(x, 0, z);
    l.rotation.y = r;
    root.add(l);
    colliders.add(x - 0.2, x + 0.2, z - 0.2, z + 0.2, 'noLOS');
  });
  // trees
  [[-48, 10], [-52, 16], [-44, 21], [-58, 24], [20, 8.9], [-40, -8.6], [52, -8.6], [56, 10]].forEach(([x, z]) => {
    const tr = buildTree(6 + Math.random() * 3);
    tr.position.set(x, 0, z);
    tr.rotation.y = Math.random() * 6;
    root.add(tr);
    colliders.add(x - 0.35, x + 0.35, z - 0.35, z + 0.35, 'noLOS');
  });
  // benches & bins
  [[-46, 12, 0.4], [-50, 18, 1.5], [8, 8.8, 0], [-20, 8.8, 0]].forEach(([x, z, r]) => {
    const b = buildBench();
    b.position.set(x, 0, z);
    b.rotation.y = r;
    root.add(b);
    colliders.add(x - 1.0, x + 1.0, z - 0.4, z + 0.4, 'noLOS');
  });
  [[-42, 9.4], [30, 8.8], [-14, -8.7], [46, 8.8]].forEach(([x, z]) => {
    const d = buildDumpster();
    d.position.set(x, 0, z);
    d.rotation.y = Math.random();
    root.add(d);
    colliders.add(x - 0.7, x + 0.7, z - 0.5, z + 0.5, 'furniture');
  });
  // hydrants, traffic lights
  [[-3, 8.6], [22, -8.6], [-30, -8.6]].forEach(([x, z]) => {
    root.add(mesh(new THREE.CylinderGeometry(0.14, 0.16, 0.8, 8), std(0xb43a2a, { roughness: 0.6 }), x, 0.4, z));
    root.add(mesh(new THREE.SphereGeometry(0.16, 8, 6), std(0xb43a2a, { roughness: 0.6 }), x, 0.82, z));
  });
  [[3.5, -8.6], [1.2, 8.6]].forEach(([x, z]) => {
    const pole = mesh(new THREE.CylinderGeometry(0.1, 0.12, 5.0, 8), std(0x2a2d33, { metalness: 0.6, roughness: 0.5 }), x, 2.5, z);
    root.add(pole);
    const head = mesh(roundedBoxGeom(0.45, 1.15, 0.3, 0.06), std(0x1a1d22), x, 4.7, z);
    root.add(head);
    [0.36, 0, -0.36].forEach((o, i) => {
      root.add(mesh(new THREE.SphereGeometry(0.11, 8, 6), std(0xff3322, { emissive: i === 0 ? 0xff2200 : 0x220000, emissiveIntensity: i === 0 ? 1.6 : 0.2 }), x, 5.1 + o, z + 0.16));
    });
    colliders.add(x - 0.16, x + 0.16, z - 0.16, z + 0.16, 'noLOS');
  });
  // cars
  const carColors = [0x8c2b2b, 0x2b4a6b, 0x3a3f4a, 0x6b6b3a, 0x8a7a2b, 0x24340f];
  const carSpots = [[-30, -6.6, 0], [-16, -6.6, 0], [3.5, -6.6, 0], [24, -6.6, 0], [-46, -6.6, 0],
    [30, 6.6, Math.PI], [-8, 6.6, Math.PI], [-24, 6.6, Math.PI], [52, 6.6, Math.PI], [-52, 6.6, Math.PI]];
  carSpots.forEach(([x, z, r], i) => {
    const car = buildCar(carColors[i % carColors.length]);
    car.position.set(x, 0, z);
    car.rotation.y = r;
    root.add(car);
    colliders.add(x - 1.0, x + 1.0, z - 2.2, z + 2.2, 'furniture');
  });
  // bus stop
  root.add(mesh(roundedBoxGeom(4.5, 0.15, 2.2, 0.05), std(0x2c3e50, { roughness: 0.6 }), 16, 2.8, 8.4));
  [[14.2, 9.2], [17.8, 9.2], [14.2, 7.6], [17.8, 7.6]].forEach(([x, z]) => root.add(mesh(new THREE.CylinderGeometry(0.06, 0.06, 2.8, 6), std(0x2a2d33, { metalness: 0.6 }), x, 1.4, z)));
  root.add(mesh(new THREE.PlaneGeometry(4.3, 2.0), std(0x2a4a6b, { transparent: true, opacity: 0.25, roughness: 0.1 }), 16, 1.6, 9.15));

  /* ================= NPC / AI POINTS ================= */
  W.npcPaths = [
    [[-52, -7.2], [-20, -7.2], [2, -7.2], [30, -7.2], [54, -7.2]],
    [[54, 7.2], [24, 7.2], [-4, 7.2], [-34, 7.2], [-56, 7.2]],
    [[-30, -7.6], [-24, -8.0], [-18, -7.6]],
    [[6, 7.6], [26, 7.6]],
  ];
  W.policeSpawns = [new THREE.Vector3(-62, 0, -2.5), new THREE.Vector3(62, 0, 2.5), new THREE.Vector3(-62, 0, 2.5)];
  W.cashierPos = new THREE.Vector3(8.6, 0, -24.2);
  W.guardPaths = [
    [new THREE.Vector3(3.5, 0, -13), new THREE.Vector3(20, 0, -13), new THREE.Vector3(20, 0, -20), new THREE.Vector3(4, 0, -20)],
    [new THREE.Vector3(22, 0, -26), new THREE.Vector3(22, 0, -14), new THREE.Vector3(9, 0, -17), new THREE.Vector3(9, 0, -27)],
  ];
  W.bankInterior = { x1: B.x1, x2: B.x2, z1: B.z1, z2: B.z2 };

  /* ================= WORLD UPDATE ================= */
  W.update = (dt, playerPos, showAlarm, doorsOpen) => {
    // house door animation
    const hd = W.houseDoor;
    const target = hd.open ? -Math.PI / 2.1 : 0;
    hd.angle += (target - hd.angle) * Math.min(1, dt * 9);
    hd.pivot.rotation.y = hd.angle;
    hd.collider.enabled = !hd.open;
    // bank doors: open when player within 3.5m of entrance
    const near = playerPos && Math.hypot(playerPos.x - 11.5, playerPos.z - (-9)) < 4.5;
    W.bankDoors.forEach((d) => {
      const target = near ? 1.85 : 0;
      d.anim = (d.anim ?? 0) + (target - (d.anim ?? 0)) * Math.min(1, dt * 6);
      d.pivot.rotation.y = -d.anim;
      d.collider.enabled = !near;
    });
    // alarm flash
    if (W.alarmOn) {
      const k = (Math.sin(performance.now() * 0.008) + 1) / 2;
      W.alarmLamp.material.emissive.setRGB(k, 0.05, 0.05);
      W.alarmLamp.material.emissiveIntensity = 0.5 + k * 3;
    } else {
      W.alarmLamp.material.emissive.setRGB(0.2, 0, 0);
      W.alarmLamp.material.emissiveIntensity = 0.4;
    }
  };

  W.resetBankMoney = () => {
    W.bankMoney.forEach((m) => { m.taken = false; m.mesh.visible = true; });
  };

  return W;
}
