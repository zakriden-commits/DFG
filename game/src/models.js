import * as THREE from 'three';
import { std, mesh, roundedBoxGeom, clamp, lerp, makeCanvas, tex } from './util.js';

/* ======================= shared geometry / material cache ======================= */
const G = {};
const M = {};
const geo = (k, f) => (G[k] || (G[k] = f()));
const mat = (c, o = {}) => {
  const k = c + '|' + (o.roughness ?? 0.75) + '|' + (o.metalness ?? 0.05) + '|' + (o.emissive ?? 0);
  return M[k] || (M[k] = std(c, o));
};
const capsule = (r, l) => geo('cap' + r + l, () => new THREE.CapsuleGeometry(r, l, 4, 10));

function part(ge, ma, parent, x = 0, y = 0, z = 0) {
  const m = new THREE.Mesh(ge, ma);
  m.position.set(x, y, z);
  m.castShadow = true; m.receiveShadow = true;
  parent.add(m);
  return m;
}
const sph = (r, s = 12) => geo('sph' + r + s, () => new THREE.SphereGeometry(r, s, Math.max(6, s - 4)));

/* ======================= WEAPONS ======================= */
export const WEAPONS = {
  fists: { name: 'Кулаки', icon: '👊', dmg: 26, rate: 0.42, melee: true, ammo: null, desc: 'Руки — бесплатно и сердито.' },
  knife: {
    name: 'Нож', icon: '🔪', dmg: 55, rate: 0.5, melee: true, ammo: null, price: 140,
    desc: 'Тихий, дешёвый, убедительный. Ближний бой.',
  },
  baton: {
    name: 'Дубинка', icon: '🏒', dmg: 34, rate: 0.55, melee: true, ammo: null, price: 90,
    desc: 'Резиновая. Не убивает, но объясняет.',
  },
  pistol: {
    name: 'Пистолет «Гроза»', icon: '🔫', dmg: 42, rate: 0.22, ammo: '9мм', mag: 12,
    price: 420, ammoPrice: 14, spread: 0.012, range: 60, desc: 'Надёжный 9мм. 12 патронов в магазине.',
  },
  shotgun: {
    name: 'Дробовик «Кабан»', icon: '💥', dmg: 96, rate: 0.85, ammo: '12к', mag: 6,
    price: 980, ammoPrice: 26, spread: 0.055, range: 28, desc: 'Два ствола правды. Близко — больно.',
  },
  rifle: {
    name: 'Автомат «Вихрь»', icon: '🎯', dmg: 58, rate: 0.11, ammo: '7.62', mag: 30,
    price: 2100, ammoPrice: 30, spread: 0.022, range: 110, desc: 'Полный автомат. Полиция не одобрит.',
  },
};
export const AMMO_PRICES = { '9мм': 14, '12к': 26, '7.62': 30 };

export function buildWeapon(id) {
  const g = new THREE.Group();
  const dark = mat(0x22242a, { roughness: 0.45, metalness: 0.75 });
  const steel = mat(0x8d939c, { roughness: 0.3, metalness: 0.9 });
  const wood = mat(0x6b3f22, { roughness: 0.85 });
  const poly = mat(0x14151a, { roughness: 0.7 });

  if (id === 'pistol') {
    part(roundedBoxGeom(0.045, 0.055, 0.19, 0.012), dark, g, 0, 0.02, 0.06);
    part(roundedBoxGeom(0.038, 0.115, 0.055, 0.012), poly, g, 0, -0.05, -0.02).rotation.x = 0.22;
    part(new THREE.CylinderGeometry(0.011, 0.011, 0.06, 8), steel, g, 0, 0.035, 0.15).rotation.x = Math.PI / 2;
    part(roundedBoxGeom(0.028, 0.03, 0.05, 0.008), dark, g, 0, -0.035, 0.08).rotation.x = -0.5; // trigger guard
    part(new THREE.BoxGeometry(0.01, 0.022, 0.01), steel, g, 0, 0.052, -0.02);
  } else if (id === 'shotgun') {
    part(roundedBoxGeom(0.05, 0.06, 0.34, 0.014), dark, g, 0, 0.02, 0.16);
    part(new THREE.CylinderGeometry(0.016, 0.016, 0.62, 10), steel, g, 0, 0.045, 0.3).rotation.x = Math.PI / 2;
    part(new THREE.CylinderGeometry(0.013, 0.013, 0.5, 10), steel, g, 0, 0.0, 0.26).rotation.x = Math.PI / 2;
    part(roundedBoxGeom(0.05, 0.09, 0.13, 0.02), wood, g, 0, -0.02, -0.12).rotation.x = 0.14;
    part(roundedBoxGeom(0.045, 0.05, 0.16, 0.02), wood, g, 0, -0.01, 0.11); // pump
    part(roundedBoxGeom(0.04, 0.1, 0.05, 0.01), poly, g, 0, -0.05, -0.02).rotation.x = 0.2;
  } else if (id === 'rifle') {
    part(roundedBoxGeom(0.055, 0.07, 0.4, 0.014), dark, g, 0, 0.02, 0.13);
    part(new THREE.CylinderGeometry(0.015, 0.015, 0.52, 10), steel, g, 0, 0.04, 0.42).rotation.x = Math.PI / 2;
    part(roundedBoxGeom(0.05, 0.06, 0.2, 0.015), wood, g, 0, -0.01, 0.28);
    part(roundedBoxGeom(0.045, 0.09, 0.12, 0.02), wood, g, 0, -0.01, -0.1).rotation.x = 0.16;
    part(roundedBoxGeom(0.032, 0.15, 0.075, 0.012), poly, g, 0, -0.09, 0.06).rotation.x = -0.25; // mag
    part(roundedBoxGeom(0.03, 0.075, 0.04, 0.01), poly, g, 0, -0.06, -0.03).rotation.x = 0.25;
    part(new THREE.BoxGeometry(0.014, 0.05, 0.02), steel, g, 0, 0.075, 0.02);
  } else if (id === 'knife') {
    part(roundedBoxGeom(0.022, 0.1, 0.03, 0.008), poly, g, 0, -0.02, -0.01);
    const blade = part(new THREE.BoxGeometry(0.008, 0.03, 0.19), steel, g, 0, 0.035, 0.09);
    blade.rotation.x = 0;
    part(new THREE.BoxGeometry(0.05, 0.014, 0.02), steel, g, 0, 0.02, -0.005);
  } else if (id === 'baton') {
    part(new THREE.CylinderGeometry(0.017, 0.02, 0.42, 10), poly, g, 0, 0.12, 0.02).rotation.x = -0.15;
    part(new THREE.CylinderGeometry(0.021, 0.021, 0.09, 10), mat(0x333a44), g, 0, -0.06, -0.01).rotation.x = -0.15;
  } else if (id === 'bag') {
    const bagMat = mat(0x2f3a2c, { roughness: 0.9 });
    part(roundedBoxGeom(0.3, 0.34, 0.16, 0.05), bagMat, g, 0, -0.06, 0.02);
    part(roundedBoxGeom(0.26, 0.12, 0.2, 0.04), bagMat, g, 0, 0.12, 0.02); // flap
    part(new THREE.TorusGeometry(0.09, 0.012, 6, 12, Math.PI), mat(0x6b5a3a), g, 0, 0.2, 0.02);
    part(new THREE.BoxGeometry(0.03, 0.02, 0.02), mat(0xd8b64a, { metalness: 0.8, roughness: 0.3 }), g, 0, 0.1, 0.11);
  }
  return g;
}

/* ======================= CHARACTER ======================= */
const SKINS = {
  gentleman: {
    skin: 0xe6b48c, jacket: 0x2b2f3a, pants: 0x24272f, shirt: 0xf1efe6, accent: 0x8a1220,
    hat: 'fedora', hatColor: 0x1c1f26, tall: 1.03, build: 1.0,
  },
  gopnik: {
    skin: 0xdcae86, jacket: 0x9c1a24, pants: 0x1b1e24, shirt: 0x9c1a24, accent: 0xf2f2f2,
    hat: 'flat', hatColor: 0x14161a, tall: 0.99, build: 1.06,
  },
  elderly: {
    skin: 0xd9b9a1, jacket: 0x5a4a3c, pants: 0x3c3830, shirt: 0xcfc7b4, accent: 0x8b8578,
    hat: 'newsboy', hatColor: 0x4a4238, tall: 0.96, build: 0.96, hunch: 0.22,
  },
  normal: {
    skin: 0xcaa079, jacket: 0x2f6f8f, pants: 0x27303c, shirt: 0xd8d3c6, accent: 0xffffff,
    hat: null, tall: 1.0, build: 1.0,
  },
  thug: {
    skin: 0xb98a63, jacket: 0x2b2f39, pants: 0x22252c, shirt: 0x353a45, accent: 0x8c1c1c,
    hat: 'beanie', hatColor: 0x16181e, tall: 1.0, build: 1.08,
  },
  cashier: {
    skin: 0xe4c0a0, jacket: 0x2a3b57, pants: 0x232a36, shirt: 0xf4f2ea, accent: 0xb02020,
    hat: null, tall: 0.98, build: 0.95,
  },
  guard: {
    skin: 0xd2a982, jacket: 0x1d2b46, pants: 0x161f33, shirt: 0x2c4a7a, accent: 0xd8b64a,
    hat: 'cap', hatColor: 0x16223a, tall: 1.02, build: 1.05,
  },
  cop: {
    skin: 0xd6ab84, jacket: 0x22304d, pants: 0x1a2338, shirt: 0x33528a, accent: 0xe0c46a,
    hat: 'police', hatColor: 0x1b2740, tall: 1.02, build: 1.03,
  },
  seller: {
    skin: 0xc79a72, jacket: 0x4a3a28, pants: 0x33302a, shirt: 0x9fa6a2, accent: 0x6b5a3a,
    hat: 'none', hatColor: 0x2a2620, tall: 1.0, build: 1.0, beard: true,
  },
};

export class Character {
  constructor(kind = 'normal', opts = {}) {
    const S = { hatColor: 0x2a2620, ...(SKINS[kind] || SKINS.normal), ...opts.skinOverride };
    this.kind = kind;
    this.S = S;
    this.root = new THREE.Group();
    this.body = new THREE.Group();
    this.root.add(this.body);
    this.phase = Math.random() * 6;
    this.state = 'idle';
    this.hurtT = 0;
    this.punchT = 0;
    this.lying = false;
    this.lieT = 0;
    this.lookTarget = null;
    this.isDead = false;

    const skinM = mat(S.skin, { roughness: 0.72 });
    const jacketM = mat(S.jacket, { roughness: 0.82 });
    const pantsM = mat(S.pants, { roughness: 0.85 });
    const shirtM = mat(S.shirt, { roughness: 0.7 });
    const accentM = mat(S.accent, { roughness: 0.6 });
    const shoeM = mat(0x15161a, { roughness: 0.55 });
    const hairM = mat(S.hatColor, { roughness: 0.85 });
    const b = S.build || 1;

    /* hips */
    this.hips = new THREE.Group();
    this.hips.position.y = 0.92 * S.tall;
    this.body.add(this.hips);
    const pelvis = part(capsule(0.115 * b, 0.08), pantsM, this.hips, 0, -0.02, 0);
    pelvis.scale.set(1.15, 1, 0.9);

    /* torso */
    this.torso = new THREE.Group();
    this.torso.position.y = 0.155;
    this.torso.rotation.x = S.hunch || 0;
    this.hips.add(this.torso);
    const chest = part(capsule(0.16 * b, 0.24), jacketM, this.torso, 0, 0.16, 0);
    chest.scale.set(1.18, 1, 0.82);
    // shirt V + tie / chain
    if (kind === 'gentleman') {
      const v = part(new THREE.BoxGeometry(0.12, 0.25, 0.02), shirtM, this.torso, 0, 0.2, 0.118);
      v.rotation.x = -0.04;
      const tie = part(new THREE.BoxGeometry(0.033, 0.22, 0.02), accentM, this.torso, 0, 0.185, 0.133);
      tie.rotation.x = -0.03;
      part(new THREE.BoxGeometry(0.06, 0.045, 0.028), accentM, this.torso, 0, 0.31, 0.13);
      // lapels
      const l1 = part(new THREE.BoxGeometry(0.07, 0.3, 0.03), mat(0x22262f), this.torso, -0.07, 0.19, 0.105);
      l1.rotation.z = 0.16; l1.rotation.x = -0.05;
      const l2 = part(new THREE.BoxGeometry(0.07, 0.3, 0.03), mat(0x22262f), this.torso, 0.07, 0.19, 0.105);
      l2.rotation.z = -0.16; l2.rotation.x = -0.05;
    } else if (kind === 'gopnik') {
      // three white stripes on the chest
      for (let i = 0; i < 3; i++) {
        const s = part(new THREE.BoxGeometry(0.012, 0.22, 0.012), accentM, this.torso, -0.06 + i * 0.03, 0.2, 0.13);
        s.rotation.x = -0.05;
      }
      const chain = part(new THREE.TorusGeometry(0.085, 0.008, 5, 14, Math.PI * 1.2), mat(0xd8b64a, { metalness: 0.9, roughness: 0.25 }), this.torso, 0, 0.3, 0.1);
      chain.rotation.set(1.2, 0, 0.2);
      // tracksuit zip
      part(new THREE.BoxGeometry(0.014, 0.3, 0.014), mat(0xe8e8e8, { metalness: 0.5 }), this.torso, 0, 0.18, 0.128);
    } else if (kind === 'guard' || kind === 'cop') {
      const badge = part(new THREE.BoxGeometry(0.05, 0.045, 0.012), mat(0xe0c46a, { metalness: 0.9, roughness: 0.25 }), this.torso, -0.09, 0.24, 0.12);
      badge.rotation.z = 0.1;
      part(new THREE.BoxGeometry(0.2, 0.03, 0.02), mat(0x0c0f16), this.torso, 0, 0.03, 0.12); // belt line
      part(new THREE.BoxGeometry(0.05, 0.09, 0.02), mat(0xd8b64a, { metalness: 0.8 }), this.torso, 0.09, 0.02, 0.12);
      if (kind === 'cop') {
        part(new THREE.BoxGeometry(0.045, 0.055, 0.012), accentM, this.torso, 0.0, 0.33, 0.125);
      }
    } else if (kind === 'cashier') {
      part(new THREE.BoxGeometry(0.13, 0.26, 0.02), shirtM, this.torso, 0, 0.14, 0.117);
      for (let i = 0; i < 3; i++) {
        part(new THREE.CylinderGeometry(0.008, 0.008, 0.012, 6), mat(0x222222), this.torso, -0.03 + i * 0.03, 0.16 - i * 0.075, 0.132).rotation.x = Math.PI / 2;
      }
    } else if (kind === 'thug') {
      // hood
      const hood = part(new THREE.SphereGeometry(0.175, 12, 10, 0, Math.PI * 2, 0, Math.PI * 0.55), mat(0x3c414d), this.torso, 0, 0.34, -0.075);
      hood.scale.set(1.18, 1.2, 1.1);
      const zip = part(new THREE.BoxGeometry(0.014, 0.26, 0.012), mat(0x404450), this.torso, 0, 0.16, 0.127);
    } else if (kind === 'elderly') {
      // coat buttons
      for (let i = 0; i < 3; i++) part(new THREE.CylinderGeometry(0.012, 0.012, 0.014, 6), mat(0x2e2820), this.torso, 0.03, 0.24 - i * 0.09, 0.128).rotation.x = Math.PI / 2;
      part(new THREE.BoxGeometry(0.2, 0.03, 0.26), shirtM, this.torso, 0, 0.34, -0.02); // scarf
    } else {
      part(new THREE.BoxGeometry(0.12, 0.18, 0.02), shirtM, this.torso, 0, 0.22, 0.12);
    }

    /* neck + head */
    const neck = part(capsule(0.045, 0.05), skinM, this.torso, 0, 0.35, 0);
    this.head = new THREE.Group();
    this.head.position.y = 0.42;
    this.torso.add(this.head);
    const skull = part(sph(0.135, 16), skinM, this.head, 0, 0.06, 0);
    skull.scale.set(0.95, 1.05, 0.98);
    const jaw = part(sph(0.1, 12), skinM, this.head, 0, -0.01, 0.02);
    jaw.scale.set(0.92, 0.85, 0.95);
    // nose
    const nose = part(new THREE.ConeGeometry(0.028, 0.075, 6), skinM, this.head, 0, 0.045, 0.128);
    nose.rotation.x = Math.PI * 0.52;
    // eyes
    const eyeW = mat(0xf5f2ea, { roughness: 0.4 });
    const eyeB = mat(0x14161c, { roughness: 0.25 });
    [-0.052, 0.052].forEach((x) => {
      const e = part(sph(0.026, 10), eyeW, this.head, x, 0.075, 0.108);
      e.scale.set(1, 0.85, 0.6);
      part(sph(0.012, 8), eyeB, this.head, x, 0.075, 0.128);
    });
    // brows
    [-0.052, 0.052].forEach((x) => {
      const br = part(new THREE.BoxGeometry(0.048, 0.012, 0.018), hairM, this.head, x, 0.105, 0.118);
      br.rotation.z = x > 0 ? -0.12 : 0.12;
    });
    // mouth
    const mouth = part(new THREE.BoxGeometry(0.062, 0.012, 0.014), mat(0x7a3a34, { roughness: 0.6 }), this.head, 0, -0.02, 0.118);
    // ears
    [-0.128, 0.128].forEach((x) => {
      const ear = part(sph(0.03, 8), skinM, this.head, x, 0.055, 0);
      ear.scale.set(0.5, 1, 0.8);
    });

    /* hair / hats */
    const hair = part(new THREE.SphereGeometry(0.14, 14, 10, 0, Math.PI * 2, 0, Math.PI * 0.44), kind === 'elderly' ? mat(0xcfccc4) : hairM, this.head, 0, 0.082, -0.004);
    hair.scale.set(1.0, 0.95, 1.02);

    if (S.hat === 'fedora') {
      const brim = part(new THREE.CylinderGeometry(0.26, 0.28, 0.022, 20), mat(S.hatColor), this.head, 0, 0.14, 0.008);
      brim.scale.set(1, 1, 1.05);
      brim.rotation.x = 0.04;
      const crown = part(new THREE.CylinderGeometry(0.15, 0.165, 0.15, 18), mat(S.hatColor), this.head, 0, 0.22, 0);
      const band = part(new THREE.CylinderGeometry(0.168, 0.17, 0.035, 18), mat(0x6b1220), this.head, 0, 0.16, 0);
    } else if (S.hat === 'flat') {
      const cap = part(new THREE.CylinderGeometry(0.145, 0.152, 0.05, 16), mat(S.hatColor), this.head, 0, 0.15, 0);
      cap.scale.set(1.04, 1, 1.02);
      const brim = part(new THREE.BoxGeometry(0.2, 0.014, 0.1), mat(S.hatColor), this.head, 0, 0.137, 0.1);
      brim.rotation.x = -0.1;
    } else if (S.hat === 'beanie') {
      const cap = part(new THREE.SphereGeometry(0.15, 14, 10, 0, Math.PI * 2, 0, Math.PI * 0.6), mat(S.hatColor), this.head, 0, 0.085, 0);
      cap.scale.set(1.04, 1.15, 1.04);
      part(new THREE.TorusGeometry(0.14, 0.022, 6, 14), mat(0x2a2d36), this.head, 0, 0.12, 0).rotation.x = Math.PI / 2;
    } else if (S.hat === 'cap' || S.hat === 'police') {
      const crown = part(new THREE.CylinderGeometry(0.15, 0.165, 0.09, 16), mat(S.hatColor), this.head, 0, 0.175, 0);
      const brim = part(new THREE.CircleGeometry(0.16, 16, 0, Math.PI), mat(0x0d141f), this.head, 0, 0.135, 0.075);
      brim.rotation.x = -Math.PI / 2 + 0.25;
      if (S.hat === 'police') {
        part(new THREE.BoxGeometry(0.06, 0.06, 0.016), mat(0xe0c46a, { metalness: 0.9, roughness: 0.2 }), this.head, 0, 0.19, 0.15);
      } else {
        part(new THREE.BoxGeometry(0.16, 0.02, 0.02), mat(0x0c0f16), this.head, 0, 0.14, 0.16);
      }
    } else if (S.hat === 'newsboy') {
      const cap = part(new THREE.SphereGeometry(0.148, 12, 8, 0, Math.PI * 2, 0, Math.PI * 0.5), mat(S.hatColor), this.head, 0, 0.1, 0);
      cap.scale.set(1.05, 1.0, 1.05);
    }

    if (kind === 'gentleman') {
      // mustache + sunglasses
      part(new THREE.BoxGeometry(0.09, 0.022, 0.02), mat(0x1a1414), this.head, 0, 0.006, 0.122);
      const gl = part(new THREE.BoxGeometry(0.115, 0.045, 0.014), mat(0x0a0b10, { metalness: 0.6, roughness: 0.2 }), this.head, 0, 0.075, 0.125);
      gl.rotation.x = -0.04;
    }
    if (kind === 'elderly') {
      // glasses + cane
      part(new THREE.TorusGeometry(0.032, 0.005, 5, 10), mat(0x2a2a2a), this.head, -0.052, 0.075, 0.122);
      part(new THREE.TorusGeometry(0.032, 0.005, 5, 10), mat(0x2a2a2a), this.head, 0.052, 0.075, 0.122);
      part(new THREE.BoxGeometry(0.028, 0.006, 0.01), mat(0x2a2a2a), this.head, 0, 0.075, 0.125);
      this.cane = new THREE.Group();
      const stick = part(new THREE.CylinderGeometry(0.012, 0.014, 0.95, 8), mat(0x4a3020, { roughness: 0.7 }), this.cane, 0, -0.47, 0);
      part(new THREE.TorusGeometry(0.035, 0.013, 6, 10, Math.PI), mat(0x4a3020), this.cane, 0, 0.0, 0);
      this.cane.position.set(0.02, 0.02, 0.06);
    }
    if (S.beard) {
      const beard = part(new THREE.SphereGeometry(0.1, 10, 8, 0, Math.PI * 2, 0, Math.PI * 0.62), mat(0x4a3a2a), this.head, 0, -0.045, 0.03);
      beard.scale.set(1.02, 1.05, 0.95);
    }

    /* arms */
    const mkArm = (sx) => {
      const shoulder = new THREE.Group();
      shoulder.position.set(sx * 0.235 * b, 0.31, 0);
      this.torso.add(shoulder);
      const upper = part(capsule(0.062 * b, 0.2), jacketM, shoulder, 0, -0.13, 0);
      if (kind === 'gopnik') {
        for (let i = 0; i < 3; i++) part(new THREE.BoxGeometry(0.01, 0.16, 0.012), accentM, shoulder, sx * (0.03 + i * 0.025), -0.13, 0.055);
      }
      const elbow = new THREE.Group();
      elbow.position.y = -0.27;
      shoulder.add(elbow);
      part(capsule(0.055 * b, 0.18), kind === 'gentleman' || kind === 'guard' || kind === 'cop' || kind === 'cashier' ? jacketM : skinM, elbow, 0, -0.12, 0);
      if (kind === 'elderly') part(capsule(0.06, 0.12), jacketM, elbow, 0, -0.09, 0);
      const hand = new THREE.Group();
      hand.position.y = -0.25;
      elbow.add(hand);
      const palm = part(sph(0.058, 10), skinM, hand, 0, 0, 0);
      palm.scale.set(1, 1.1, 0.72);
      return { shoulder, elbow, hand };
    };
    this.armL = mkArm(-1);
    this.armR = mkArm(1);
    if (kind === 'gentleman') {
      // gold watch on the wrist
      const watch = part(new THREE.TorusGeometry(0.03, 0.007, 5, 10), mat(0xd8b64a, { metalness: 0.95, roughness: 0.2 }), this.armL.elbow, 0, -0.2, 0);
      watch.rotation.x = Math.PI / 2;
    }
    if (this.cane) this.armL.hand.add(this.cane);

    /* legs */
    const mkLeg = (sx) => {
      const hip = new THREE.Group();
      hip.position.set(sx * 0.105 * b, -0.02, 0);
      this.hips.add(hip);
      part(capsule(0.075 * b, 0.22), pantsM, hip, 0, -0.14, 0);
      const knee = new THREE.Group();
      knee.position.y = -0.3;
      hip.add(knee);
      part(capsule(0.066 * b, 0.22), pantsM, knee, 0, -0.13, 0);
      const foot = new THREE.Group();
      foot.position.y = -0.29;
      knee.add(foot);
      const shoe = part(roundedBoxGeom(0.11, 0.075, 0.24, 0.03), shoeM, foot, 0, 0.02, 0.045);
      return { hip, knee, foot };
    };
    this.legL = mkLeg(-1);
    this.legR = mkLeg(1);

    this.root.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });

    /* weapon mount */
    this.weaponHolder = new THREE.Group();
    this.weaponHolder.position.set(0, -0.02, 0.02);
    this.armR.hand.add(this.weaponHolder);
    this.weaponModel = null;
    this.weaponId = 'fists';

    this.setWeapon('fists');
    this.baseY = 0;
  }

  setWeapon(id) {
    this.weaponId = id || 'fists';
    if (this.weaponModel) {
      this.weaponHolder.remove(this.weaponModel);
      this.weaponModel = null;
    }
    if (this.weaponHolder && this.weaponId !== 'fists') {
      const m = buildWeapon(this.weaponId);
      m.rotation.set(-0.15, 0, 0);
      this.weaponHolder.add(m);
      this.weaponModel = m;
    }
  }

  setState(s) { if (this.state !== s) { this.state = s; } }

  hurt() { this.hurtT = 0.35; }

  punch() { this.punchT = 0.42; }

  shoot() { this.recoilT = 0.18; }

  lieDown(t = 0) { this.lying = true; this.lieT = t; }

  wakeUp() { this.lying = false; this.wakeAnim = 1; }

  update(dt, speed = 0, opts = {}) {
    const S = this.S;
    if (this.hurtT > 0) this.hurtT -= dt;
    if (this.punchT > 0) this.punchT -= dt;
    if (this.recoilT > 0) this.recoilT -= dt;
    this.phase += dt * (1.6 + speed * 1.7);

    const p = this.phase;
    const walkAmt = clamp(speed / 3.2, 0, 1.35);

    /* lying on bed */
    const lieRot = Math.PI / 2;
    if (this.lying) {
      this.lieT += dt;
      const t = clamp(this.lieT / 0.8, 0, 1);
      this.body.rotation.x = lerp(this.body.rotation.x, lieRot, 0.12);
      this.body.position.y = lerp(this.body.position.y, 0.05, 0.12);
      this.legL.hip.rotation.x = lerp(this.legL.hip.rotation.x, 0.05, 0.1);
      this.legR.hip.rotation.x = lerp(this.legR.hip.rotation.x, 0.12, 0.1);
      this.legL.knee.rotation.x = lerp(this.legL.knee.rotation.x, 0.1, 0.1);
      this.legR.knee.rotation.x = lerp(this.legR.knee.rotation.x, 0.05, 0.1);
      this.armL.shoulder.rotation.set(lerp(this.armL.shoulder.rotation.x, 0.4, 0.1), 0, 0.35);
      this.armR.shoulder.rotation.set(lerp(this.armR.shoulder.rotation.x, 0.25, 0.1), 0, -0.3);
      this.armL.elbow.rotation.x = lerp(this.armL.elbow.rotation.x, -0.5, 0.1);
      this.armR.elbow.rotation.x = lerp(this.armR.elbow.rotation.x, -0.3, 0.1);
      this.head.rotation.x = lerp(this.head.rotation.x, -0.15, 0.1);
      return;
    }

    /* stand-up blend */
    this.body.rotation.x = lerp(this.body.rotation.x, 0, 0.14);
    this.body.position.y = lerp(this.body.position.y, 0, 0.14);

    if (this.isDead) {
      this.body.rotation.x = lerp(this.body.rotation.x, -Math.PI / 2.1, 0.09);
      this.body.position.y = lerp(this.body.position.y, 0.16, 0.09);
      this.armL.shoulder.rotation.z = lerp(this.armL.shoulder.rotation.z, 1.1, 0.1);
      this.armR.shoulder.rotation.z = lerp(this.armR.shoulder.rotation.z, -1.2, 0.1);
      return;
    }

    /* legs */
    const stride = 0.62 * walkAmt;
    const sL = Math.sin(p), sR = Math.sin(p + Math.PI);
    this.legL.hip.rotation.x = sL * stride;
    this.legR.hip.rotation.x = sR * stride;
    this.legL.knee.rotation.x = Math.max(0, -Math.cos(p)) * 0.85 * walkAmt;
    this.legR.knee.rotation.x = Math.max(0, -Math.cos(p + Math.PI)) * 0.85 * walkAmt;
    this.legL.foot.rotation.x = -sL * 0.18 * walkAmt;
    this.legR.foot.rotation.x = -sR * 0.18 * walkAmt;

    /* hips bob */
    this.hips.position.y = 0.92 * S.tall + Math.abs(Math.sin(p)) * 0.035 * walkAmt - (S.hunch || 0) * 0.02;
    this.hips.rotation.z = Math.sin(p) * 0.035 * walkAmt;
    this.torso.rotation.y = -Math.sin(p) * 0.09 * walkAmt;

    /* arms */
    const aiming = this.aiming && !WEAPONS[this.weaponId]?.melee && this.weaponId !== 'fists';
    this.aimBlend = lerp(this.aimBlend || 0, aiming ? 1 : 0, Math.min(1, dt * 9));
    let armRx = -sL * 0.55 * walkAmt, armLx = -sR * 0.55 * walkAmt;
    let armRz = -0.06, armLz = 0.06;
    let elbR = -0.25 - 0.25 * walkAmt, elbL = -0.25 - 0.25 * walkAmt;

    if (this.punchT > 0) {
      const t = 1 - this.punchT / 0.42;
      const k = Math.sin(clamp(t, 0, 1) * Math.PI);
      armRx = lerp(armRx, -1.9, k);
      elbR = lerp(elbR, -0.25, k);
    }
    if (this.aimBlend > 0.01) {
      const k = this.aimBlend;
      armRx = lerp(armRx, -1.5, k);
      elbR = lerp(elbR, -0.32, k);
      armRz = lerp(armRz, 0.12, k);
      armLx = lerp(armLx, -1.28, k);
      elbL = lerp(elbL, -0.95, k);
      armLz = lerp(armLz, -0.34, k);
    }
    if (this.weaponId === 'bag') armRx = 0.1;

    if (this.recoilT > 0) {
      const k = this.recoilT / 0.18;
      armRx -= k * 0.42;
      elbR += k * 0.3;
    }
    this.armR.shoulder.rotation.x = armRx;
    this.armL.shoulder.rotation.x = armLx;
    this.armR.shoulder.rotation.z = armRz;
    this.armL.shoulder.rotation.z = armLz;
    this.armR.elbow.rotation.x = elbR;
    this.armL.elbow.rotation.x = elbL;

    /* idle breathing */
    if (walkAmt < 0.05) {
      this.torso.rotation.x = (S.hunch || 0) + Math.sin(p * 0.7) * 0.012;
      this.armR.shoulder.rotation.x += Math.sin(p * 0.7) * 0.02;
      this.head.rotation.z = Math.sin(p * 0.35) * 0.03;
    } else {
      this.torso.rotation.x = (S.hunch || 0) + Math.sin(p * 2) * 0.02;
      this.head.rotation.z = 0;
    }

    /* hurt flinch */
    if (this.hurtT > 0) {
      this.torso.rotation.x += Math.sin(this.hurtT * 30) * 0.1;
      this.head.rotation.x = -0.2;
    }

    /* head look at target */
    if (this.lookTarget) {
      this.head.rotation.y = clamp(this.lookTarget.localYaw ?? 0, -0.9, 0.9);
      this.head.rotation.x = clamp(this.lookTarget.localPitch ?? 0, -0.5, 0.4);
    } else {
      this.head.rotation.y = lerp(this.head.rotation.y, 0, 0.08);
      this.head.rotation.x = lerp(this.head.rotation.x, 0, 0.08);
    }
    this.aiming = opts.aiming ?? this.aiming;
  }
}

/* ======================= PROPS ======================= */
export function buildCar(color = 0x8a2b2b, kind = 'sedan') {
  const g = new THREE.Group();
  const bodyM = std(color, { roughness: 0.35, metalness: 0.55 });
  const glassM = std(0x1a2733, { roughness: 0.12, metalness: 0.4 });
  const trimM = std(0x22242a, { roughness: 0.6, metalness: 0.4 });
  const lightM = std(0xfff0c0, { emissive: 0xffe08a, emissiveIntensity: 0.7, roughness: 0.3 });

  const body = mesh(roundedBoxGeom(1.85, 0.62, 4.2, 0.22), bodyM, 0, 0.62, 0);
  g.add(body);
  const cabin = mesh(roundedBoxGeom(1.62, 0.55, 2.1, 0.2), bodyM, 0, 1.13, -0.1);
  g.add(cabin);
  const glass = mesh(roundedBoxGeom(1.52, 0.42, 2.0, 0.16), glassM, 0, 1.17, -0.1);
  g.add(glass);
  // hood / trunk shapes
  g.add(mesh(roundedBoxGeom(1.7, 0.16, 1.1, 0.08), bodyM, 0, 0.9, 1.5));
  g.add(mesh(roundedBoxGeom(1.7, 0.14, 0.9, 0.08), bodyM, 0, 0.9, -1.55));
  // bumpers
  g.add(mesh(roundedBoxGeom(1.78, 0.2, 0.18, 0.06), trimM, 0, 0.55, 2.1));
  g.add(mesh(roundedBoxGeom(1.78, 0.2, 0.18, 0.06), trimM, 0, 0.55, -2.1));
  // lights
  [-0.62, 0.62].forEach((x) => {
    g.add(mesh(roundedBoxGeom(0.36, 0.16, 0.08, 0.04), lightM, x, 0.72, 2.14));
    g.add(mesh(roundedBoxGeom(0.32, 0.14, 0.08, 0.04), std(0x8c1a1a, { emissive: 0x550000, roughness: 0.4 }), x, 0.72, -2.14));
  });
  // wheels
  const wheelG = new THREE.CylinderGeometry(0.36, 0.36, 0.24, 14);
  const rimG = new THREE.CylinderGeometry(0.2, 0.2, 0.26, 10);
  const wheels = [];
  [[-0.92, 1.35], [0.92, 1.35], [-0.92, -1.35], [0.92, -1.35]].forEach(([x, z]) => {
    const holder = new THREE.Group();
    holder.position.set(x, 0.36, z);
    holder.rotation.z = Math.PI / 2;
    g.add(holder);
    const w = new THREE.Mesh(wheelG, trimM);
    w.castShadow = true;
    holder.add(w);
    const r = new THREE.Mesh(rimG, std(0x9aa0a8, { metalness: 0.9, roughness: 0.3 }));
    holder.add(r);
    wheels.push(w, r);
  });
  g.userData.wheels = wheels;
  g.userData.spin = (a) => { for (const w of wheels) w.rotation.y += a; };
  // mirrors
  [-1, 1].forEach((s) => g.add(mesh(roundedBoxGeom(0.18, 0.09, 0.1, 0.03), bodyM, s * 0.92, 1.16, 0.75)));
  return g;
}

/* police cruiser: dark body, white doors, light bar + real light */
export function buildPoliceCar() {
  const g = buildCar(0x1a1e27);
  const white = std(0xe9ecef, { roughness: 0.42, metalness: 0.2 });
  const dark = std(0x14161c, { roughness: 0.5, metalness: 0.3 });
  [-1, 1].forEach((s) => {
    g.add(mesh(roundedBoxGeom(0.05, 0.46, 1.95, 0.02), white, s * 0.935, 0.72, 0.05));
    g.add(mesh(roundedBoxGeom(0.06, 0.17, 0.9, 0.02), std(0x2a63c8, { roughness: 0.5, metalness: 0.2 }), s * 0.94, 0.95, 0.55));
  });
  // push bar
  g.add(mesh(roundedBoxGeom(1.7, 0.34, 0.12, 0.05), dark, 0, 0.6, 2.18));
  // roof light bar
  const bar = new THREE.Group();
  bar.position.set(0, 1.42, -0.1);
  g.add(bar);
  bar.add(mesh(new THREE.BoxGeometry(1.42, 0.08, 0.34), dark, 0, 0.02, 0));
  const redM = std(0x8c1010, { emissive: 0xff1414, emissiveIntensity: 0.35, roughness: 0.3 });
  const blueM = std(0x101a8c, { emissive: 0x1a3cff, emissiveIntensity: 0.35, roughness: 0.3 });
  const red = mesh(new THREE.BoxGeometry(0.56, 0.18, 0.3), redM, -0.36, 0.13, 0);
  const blue = mesh(new THREE.BoxGeometry(0.56, 0.18, 0.3), blueM, 0.36, 0.13, 0);
  bar.add(red); bar.add(blue);
  const light = new THREE.PointLight(0xff2020, 0, 16, 2);
  light.position.set(0, 1.75, 0);
  g.add(light);
  g.userData.lights = { red, blue, light };
  g.userData.isPolice = true;
  return g;
}

export function buildTree(h = 6) {
  const g = new THREE.Group();
  const trunkM = std(0x4a3524, { roughness: 0.95 });
  const leafM = std(0x2e5a2a, { roughness: 0.9, flat: true });
  const t = mesh(new THREE.CylinderGeometry(0.16, 0.26, h * 0.55, 8), trunkM, 0, h * 0.28, 0);
  g.add(t);
  for (let i = 0; i < 3; i++) {
    const s = 1 - i * 0.22;
    const blob = mesh(new THREE.IcosahedronGeometry(1.5 * s, 1), leafM, (Math.random() - 0.5) * 0.7, h * 0.55 + i * h * 0.13, (Math.random() - 0.5) * 0.7);
    blob.scale.set(1, 0.85, 1);
    g.add(blob);
  }
  return g;
}

export function buildLamp() {
  const g = new THREE.Group();
  const m = std(0x2b2f36, { roughness: 0.5, metalness: 0.6 });
  g.add(mesh(new THREE.CylinderGeometry(0.08, 0.11, 5.6, 8), m, 0, 2.8, 0));
  const arm = mesh(new THREE.CylinderGeometry(0.055, 0.055, 1.2, 6), m, 0.55, 5.55, 0);
  arm.rotation.z = Math.PI / 2;
  g.add(arm);
  const head = mesh(new THREE.BoxGeometry(0.5, 0.14, 0.3), std(0x1a1d22, { emissive: 0xffd479, emissiveIntensity: 0.55, roughness: 0.5 }), 1.1, 5.5, 0);
  g.add(head);
  return g;
}

export function buildBench() {
  const g = new THREE.Group();
  const woodM = std(0x6b4a2c, { roughness: 0.9 });
  const ironM = std(0x25282e, { roughness: 0.6, metalness: 0.6 });
  for (let i = 0; i < 3; i++) g.add(mesh(new THREE.BoxGeometry(1.9, 0.06, 0.16), woodM, 0, 0.45, -0.18 + i * 0.19));
  for (let i = 0; i < 2; i++) g.add(mesh(new THREE.BoxGeometry(1.9, 0.16, 0.06), woodM, 0, 0.68 + i * 0.2, -0.32));
  [-0.8, 0.8].forEach((x) => {
    g.add(mesh(new THREE.BoxGeometry(0.08, 0.45, 0.5), ironM, x, 0.22, 0));
    g.add(mesh(new THREE.BoxGeometry(0.07, 0.5, 0.07), ironM, x, 0.72, -0.32));
  });
  return g;
}

export function buildDumpster() {
  const g = new THREE.Group();
  const m = std(0x24402e, { roughness: 0.8, metalness: 0.3 });
  g.add(mesh(roundedBoxGeom(1.2, 1.0, 0.9, 0.06), m, 0, 0.55, 0));
  const lid = mesh(roundedBoxGeom(1.24, 0.1, 0.95, 0.04), std(0x1a2c20), 0, 1.06, 0);
  lid.rotation.x = -0.08; g.add(lid);
  [[-0.45, 0.35], [0.45, 0.35], [-0.45, -0.35], [0.45, -0.35]].forEach(([x, z]) => g.add(mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.1, 6), std(0x14161a), x, 0.07, z)));
  return g;
}

export function buildCrate(size = 0.6) {
  const g = new THREE.Group();
  const woodM = std(0x8a6437, { roughness: 0.9, map: tex('wood', 128, 128, (ctx, w, h) => {
    ctx.fillStyle = '#8a6437'; ctx.fillRect(0, 0, w, h);
    for (let i = 0; i < 40; i++) {
      ctx.strokeStyle = `rgba(60,40,20,${Math.random() * 0.35})`;
      ctx.beginPath(); ctx.moveTo(0, Math.random() * h); ctx.bezierCurveTo(w * 0.3, Math.random() * h, w * 0.6, Math.random() * h, w, Math.random() * h); ctx.stroke();
    }
  }) });
  g.add(mesh(roundedBoxGeom(size, size, size, 0.03), woodM, 0, size / 2, 0));
  const edgeM = std(0x5a3f22, { roughness: 0.9 });
  g.add(mesh(new THREE.BoxGeometry(size * 1.01, 0.05, 0.05), edgeM, 0, size * 0.5, 0));
  g.add(mesh(new THREE.BoxGeometry(0.05, size * 1.01, 0.05), edgeM, -size * 0.5, size * 0.5, 0));
  g.add(mesh(new THREE.BoxGeometry(0.05, size * 1.01, 0.05), edgeM, size * 0.5, size * 0.5, 0));
  return g;
}

export function buildMoneyPile(value = 1000) {
  const g = new THREE.Group();
  const moneyTex = tex('moneyT', 128, 64, (ctx, w, h) => {
    ctx.fillStyle = '#5f7c4e'; ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#7d9c66';
    for (let i = 0; i < 14; i++) ctx.fillRect(Math.random() * w, Math.random() * h, 4 + Math.random() * 22, 2 + Math.random() * 5);
    ctx.fillStyle = 'rgba(230,225,200,.85)';
    ctx.beginPath(); ctx.arc(w / 2, h / 2, 11, 0, 7); ctx.fill();
    ctx.fillStyle = '#3d5233'; ctx.font = 'bold 16px serif'; ctx.textAlign = 'center';
    ctx.fillText('$', w / 2, h / 2 + 6);
  });
  const moneyM = std(0xffffff, { map: moneyTex, roughness: 0.85 });
  const stack = mesh(new THREE.BoxGeometry(0.24, 0.09, 0.13), moneyM, 0, 0.05, 0);
  g.add(stack);
  const band = mesh(new THREE.BoxGeometry(0.05, 0.095, 0.135), std(0xd9cfae, { roughness: 0.7 }), 0, 0.05, 0);
  g.add(band);
  g.userData.value = value;
  return g;
}
