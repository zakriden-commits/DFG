import * as THREE from 'three';
import { HALF_WIDTH } from './trackMath.js';

/** Граница «стены» (рельса) */
export const WALL_LIMIT = HALF_WIDTH - 0.95;

const HOVER_HEIGHT = 1.9;
const GRAVITY = 34;
const MAX_SPEED = 52;
const BOOST_SPEED = 79;
const BOOST_DRAIN = 28;
const BOOST_REGEN = 7.5;
const TURN_RATE = 2.15;

/**
 * Аркадная физика антиграва.
 * Скорость, снос (дрифт), ховер-сервопривод по высоте над полотном,
 * стены-рельсы и энергия турбо.
 */
export class Hovercraft {
  constructor() {
    this.pos = new THREE.Vector3();
    this.vel = new THREE.Vector3();
    this.yaw = 0;
    this.steer = 0;
    this.energy = 100;
    this.boosting = false;
    this.grounded = true;
    this.airTime = 0;
    this.hint = 0;
    this.sampleIndex = 0;
    this.trackHeight = 0;
    this.wallHit = 0;
    this.landImpact = 0;
    this.fellOut = false;
    this.speed = 0;
    this.forwardSpeed = 0;
    this.lateralSpeed = 0;
    this.bobPhase = Math.random() * 10;

    this._fwd = new THREE.Vector3(0, 0, 1);
    this._right = new THREE.Vector3(1, 0, 0);
    this._hit = {};
    this._prevGrounded = true;
  }

  forward(out = this._fwd) {
    return out.set(Math.sin(this.yaw), 0, Math.cos(this.yaw));
  }

  /** Сброс на трассу: позиция, угол, подсказка для поиска */
  reset(position, yaw, index = 0) {
    this.pos.copy(position);
    this.yaw = yaw;
    this.vel.set(0, 0, 0);
    this.steer = 0;
    this.energy = 100;
    this.boosting = false;
    this.grounded = true;
    this.airTime = 0;
    this.hint = index;
    this.sampleIndex = index;
    this.wallHit = 0;
    this.landImpact = 0;
    this.fellOut = false;
    this.speed = 0;
    this.forwardSpeed = 0;
    this.lateralSpeed = 0;
    this._prevGrounded = true;
  }

  addEnergy(v) {
    this.energy = THREE.MathUtils.clamp(this.energy + v, 0, 100);
  }

  /** Один подшаг физики */
  update(dt, input, track) {
    const fwd = this.forward(this._fwd);
    const right = this._right.set(Math.cos(this.yaw), 0, -Math.sin(this.yaw));

    const vf = this.vel.x * fwd.x + this.vel.z * fwd.z;
    this.forwardSpeed = this.vel.dot(fwd);
    this.lateralSpeed = this.vel.dot(right);
    this.speed = this.vel.length();

    // Сглаженный руль — на резких нажатиях не дёргается
    this.steer = THREE.MathUtils.damp(this.steer, input.steer, 14, dt);

    // --- турбо ---
    const wantBoost = input.boost && this.energy > 0.5 && vf > -0.5;
    this.boosting = wantBoost;
    if (wantBoost) this.energy = Math.max(0, this.energy - BOOST_DRAIN * dt);
    else this.energy = Math.min(100, this.energy + BOOST_REGEN * dt);

    const maxSpeed = wantBoost ? BOOST_SPEED : MAX_SPEED;

    // --- тяга и торможение ---
    let force = 0;
    if (input.throttle > 0) force += 54 * input.throttle;
    if (input.brake > 0) {
      // на скорости тормозим сильнее, чем реверсим
      force -= (vf > 1 ? 78 : 30) * input.brake;
    }
    if (wantBoost) force += 88;
    if (!this.grounded) force *= 0.45;
    this.vel.addScaledVector(fwd, force * dt);

    // Ограничение продольной скорости
    let vfNew = this.vel.x * fwd.x + this.vel.z * fwd.z;
    if (vfNew > maxSpeed) {
      const excess = vfNew - maxSpeed;
      this.vel.x -= fwd.x * excess * Math.min(1, 5 * dt);
      this.vel.z -= fwd.z * excess * Math.min(1, 5 * dt);
    }
    if (vfNew < -24) {
      const excess = -24 - vfNew;
      this.vel.x += fwd.x * excess * Math.min(1, 5 * dt);
      this.vel.z += fwd.z * excess * Math.min(1, 5 * dt);
    }

    // --- снос / сцепление ---
    const grip = this.grounded ? (wantBoost ? 2.6 : 3.7) : 0.35;
    const lateralDamped = this.lateralSpeed * Math.exp(-grip * dt);
    const latDelta = lateralDamped - this.lateralSpeed;
    this.vel.x += right.x * latDelta;
    this.vel.z += right.z * latDelta;

    // Продольное сопротивление
    const dragFactor = Math.exp(-(this.grounded ? 0.16 : 0.05) * dt);
    this.vel.x *= dragFactor;
    this.vel.z *= dragFactor;

    // --- поворот ---
    const speedAbs = Math.abs(this.forwardSpeed);
    const authority =
      THREE.MathUtils.clamp(speedAbs / 14, 0.18, 1) *
      (1 - 0.25 * THREE.MathUtils.clamp(speedAbs / 95, 0, 1));
    const direction = this.forwardSpeed >= -0.5 ? 1 : -1;
    this.yaw += this.steer * TURN_RATE * authority * direction * dt;

    // --- гравитация только в полёте ---
    const hitBefore = track.nearest(this.pos, this.hint, this._hit);
    const onRoad = Math.abs(hitBefore.lateral) <= HALF_WIDTH + 1.5;
    const hovering = onRoad && hitBefore.height < HOVER_HEIGHT + 0.35;
    if (!hovering) {
      this.vel.y -= GRAVITY * dt;
      this.airTime += dt;
    }

    // --- интеграция ---
    this.pos.addScaledVector(this.vel, dt);

    // --- ховер и стены по новой позиции ---
    const hit = track.nearest(this.pos, this.hint, this._hit);
    this.hint = hit.index;
    this.sampleIndex = hit.index;
    this.trackHeight = hit.height;

    const roadHere = Math.abs(hit.lateral) <= HALF_WIDTH + 1.5;
    const upVel = this.vel.dot(hit.up);

    if (roadHere && hit.height < HOVER_HEIGHT + 0.45) {
      const err = HOVER_HEIGHT - hit.height;
      const desiredUpVel = THREE.MathUtils.clamp(err * 8, -22, 34);
      const dv = (desiredUpVel - upVel) * Math.min(1, 18 * dt);
      this.vel.addScaledVector(hit.up, dv);
      this.grounded = true;
      this.bobPhase += dt * 9;
      if (!this._prevGrounded && upVel < -6) this.landImpact = Math.min(1, -upVel / 26);
      this.airTime = 0;
    } else {
      this.grounded = false;
    }

    // Стены: не даём улететь с полотна, гасим скорость при ударе
    const over = Math.abs(hit.lateral) - WALL_LIMIT;
    if (over > 0) {
      const sign = Math.sign(hit.lateral) || 1;
      this.pos.addScaledVector(hit.right, -sign * over);
      const vLat = this.vel.dot(hit.right);
      if (vLat * sign > 0) {
        const impact = Math.abs(vLat);
        this.vel.addScaledVector(hit.right, -1.4 * vLat);
        this.vel.multiplyScalar(0.975);
        this.wallHit = Math.max(this.wallHit, THREE.MathUtils.clamp(impact / 24, 0, 1));
      }
    }

    // Провал под трассу — сигнал игре на респавн
    if (hit.height < -14) this.fellOut = true;

    this._prevGrounded = this.grounded;
    this.speed = this.vel.length();
    this.forwardSpeed = this.vel.dot(fwd);
    this.lateralSpeed = this.vel.dot(right);
  }

  /** Визуальный крен и тангаж (не влияют на физику) */
  visualTilt(dt) {
    const speedFactor = THREE.MathUtils.clamp(this.speed / 55, 0, 1.2);
    const targetRoll = THREE.MathUtils.clamp(
      -this.steer * 0.42 * speedFactor - this.lateralSpeed * 0.012,
      -0.65,
      0.65,
    );
    const targetPitch = this.grounded
      ? THREE.MathUtils.clamp(-this.forwardSpeed * 0.0022, -0.12, 0.06)
      : THREE.MathUtils.clamp(this.vel.y * 0.012, -0.3, 0.3);
    return {
      roll: THREE.MathUtils.damp(this.roll || 0, targetRoll, 6, dt),
      pitch: THREE.MathUtils.damp(this.pitch || 0, targetPitch, 6, dt),
    };
  }
}
