import * as THREE from 'three';

/**
 * Чистая математика трассы: без DOM и без материалов.
 * Отдельный модуль — чтобы физику и геометрию можно было проверять в Node.
 */

export const TRACK_WIDTH = 17;
export const HALF_WIDTH = TRACK_WIDTH / 2;
export const SAMPLE_COUNT = 1200;
/** Общий масштаб мира (длина трассы ~1540 м) */
export const WORLD_SCALE = 1.6;

const WORLD_UP = new THREE.Vector3(0, 1, 0);

/**
 * Аналитическая замкнутая трасса: C∞-гладкая петля, поэтому нет изломов
 * и «заломов» виражей. Параметры подобраны численно:
 * длина ~970 м, минимальный радиус поворота ~40 м, макс. уклон ~0.31.
 */
export class CircuitCurve extends THREE.Curve {
  getPoint(t, target = new THREE.Vector3()) {
    const a = t * Math.PI * 2;
    const r =
      (135 + 30 * Math.sin(3 * a + 1.0) + 12 * Math.sin(4 * a + 2.4)) * WORLD_SCALE;
    const y =
      (12 * Math.sin(2 * a + 0.5) + 8 * Math.sin(3 * a + 1.9)) * WORLD_SCALE * 0.8;
    return target.set(Math.cos(a) * r, y, Math.sin(a) * r);
  }
}

export class TrackPath {
  constructor() {
    this.curve = new CircuitCurve();
    this.curve.arcLengthDivisions = 3000;
    this.length = this.curve.getLength();
    this.n = SAMPLE_COUNT;

    /** @type {THREE.Vector3[]} */
    this.pos = [];
    /** @type {THREE.Vector3[]} */
    this.tan = [];
    /** @type {THREE.Vector3[]} */
    this.right = [];
    /** @type {THREE.Vector3[]} */
    this.up = [];
    /** @type {number[]} */
    this.bank = [];
    /** @type {number[]} */
    this.dist = [];
    this._hit = {};
    this._t = new THREE.Vector3();
    this._r = new THREE.Vector3();
    this._u = new THREE.Vector3();
    this._q = new THREE.Quaternion();

    this.build();
  }

  build() {
    const n = this.n;
    const du = 1 / n;

    for (let i = 0; i < n; i++) {
      const u = i / n;
      const p = this.curve.getPointAt(u);
      const t = this.curve.getTangentAt(u).normalize();

      // Правая ось и «верх» трассы
      const right = new THREE.Vector3().crossVectors(t, WORLD_UP).normalize();
      const up = new THREE.Vector3().crossVectors(right, t).normalize();

      // Знаковая кривизна по соседним касательным -> вираж (banking)
      const tPrev = this.curve.getTangentAt((u - du + 1) % 1);
      const tNext = this.curve.getTangentAt((u + du) % 1);
      const dT = new THREE.Vector3().subVectors(tNext, tPrev);
      const ds = 2 * du * this.length;
      const lateralCurv = dT.dot(right) / Math.max(ds, 1e-6);
      const bank = THREE.MathUtils.clamp(-lateralCurv * 15, -0.5, 0.5);

      this._q.setFromAxisAngle(t, bank);
      right.applyQuaternion(this._q).normalize();
      up.applyQuaternion(this._q).normalize();

      this.pos.push(p);
      this.tan.push(t);
      this.right.push(right);
      this.up.push(up);
      this.bank.push(bank);
      this.dist.push(u * this.length);
    }
  }

  wrap(i) {
    const n = this.n;
    return ((i % n) + n) % n;
  }

  /** Ближайшая точка трассы к произвольной позиции (поиск в окне вокруг подсказки) */
  nearest(point, hint = -1, out = this._hit) {
    const n = this.n;
    const pos = this.pos;
    let best = hint >= 0 ? this.wrap(hint) : 0;
    let bestD = Infinity;

    const scan = (i) => {
      const p = pos[i];
      const dx = point.x - p.x;
      const dy = point.y - p.y;
      const dz = point.z - p.z;
      const d = dx * dx + dy * dy + dz * dz;
      if (d < bestD) {
        bestD = d;
        best = i;
      }
    };

    if (hint >= 0) {
      for (let k = -70; k <= 70; k++) scan(this.wrap(hint + k));
      if (bestD > 2500) {
        // потерялись (респавн/телепорт) — полный проход
        for (let i = 0; i < n; i++) scan(i);
      }
    } else {
      for (let i = 0; i < n; i++) scan(i);
    }

    const p = pos[best];
    const right = this.right[best];
    const up = this.up[best];
    const dx = point.x - p.x;
    const dy = point.y - p.y;
    const dz = point.z - p.z;

    out.index = best;
    out.p = p;
    out.up = up;
    out.right = right;
    out.tan = this.tan[best];
    out.lateral = dx * right.x + dy * right.y + dz * right.z;
    out.height = dx * up.x + dy * up.y + dz * up.z;
    out.dist2 = bestD;
    return out;
  }

  /** Позиция и угол поворота на стартовой линии */
  startTransform() {
    const p = this.pos[0];
    const t = this.tan[0];
    const u = this.up[0];
    return {
      position: p.clone().addScaledVector(u, 1.9),
      yaw: Math.atan2(t.x, t.z),
    };
  }

  /** Короткая разница индексов с учётом замыкания петли */
  deltaIndex(a, b) {
    const n = this.n;
    let d = a - b;
    if (d > n / 2) d -= n;
    if (d < -n / 2) d += n;
    return d;
  }
}
