import * as THREE from 'three';
import { Character } from './models.js';
import { labelSprite, clamp, angleDiff, distXZ } from './util.js';

const SKIN_FOR = { ped: 'normal', old: 'elderly', thug: 'thug', guard: 'guard', cashier: 'cashier', cop: 'cop', seller: 'seller', boss: 'normal' };

const LINES = {
  ped: ['Чё смотришь?', 'Добрый вечер.', 'Не задерживайся тут.', 'Слыхал, банк опять грабанули?', 'Город катится вниз…', 'Сигаретки не будет?'],
  old: ['Молодёжь совсем распустилась.', 'Ох, спина моя…', 'Раньше тут было тихо.', 'Не бегай, упадёшь.'],
  thug: ['Эй, брат, есть чё?', 'Не на районе гуляешь.', 'Ствол убери, умник.', 'Смотри мне в глаза.'],
  guard: ['Оружие уберите.', 'Спокойно, гражданин.', 'Я слежу за тобой.'],
  cop: ['Стоять! Полиция!', 'Руки за голову!', 'Не двигайся!'],
  seller: ['Бери, пока есть.', 'Патроны дешевле не будут.', 'Ствол не для красоты, да?'],
};

export class Npc {
  constructor(game, opts = {}) {
    this.game = game;
    this.role = opts.role || 'ped';
    this.kind = opts.kind || SKIN_FOR[this.role] || 'normal';
    this.char = new Character(this.kind);
    this.pos = (opts.pos || new THREE.Vector3()).clone();
    this.yaw = opts.yaw ?? 0;
    this.char.root.position.copy(this.pos);
    this.char.root.rotation.y = this.yaw;
    this.hp = opts.hp ?? (this.role === 'guard' ? 140 : this.role === 'cop' ? 160 : 100);
    this.maxHp = this.hp;
    this.speed = opts.speed ?? (this.role === 'cop' ? 3.9 : this.role === 'guard' ? 2.6 : 1.35);
    this.path = opts.path || null;
    this.pathIdx = 0;
    this.waitT = Math.random() * 2;
    this.state = 'patrol';
    this.attackCd = 0;
    this.dead = false;
    this.hostile = false;
    this.sayT = 0;
    this.sayCd = 6 + Math.random() * 12;
    this.lookT = 0;
    this.vision = this.role === 'cop' ? 26 : this.role === 'guard' ? 16 : 9;
    this.fov = this.role === 'guard' ? 1.9 : 1.5;
    this.carry = null;
    this.jobOffer = false;
    this.offerT = 0;
    this.startPos = this.pos.clone();
    this.leaving = false;
    if (this.role === 'guard') this.char.setWeapon('baton');
    if (this.role === 'cop') this.char.setWeapon('pistol');
    if (this.role === 'seller' || this.role === 'cashier') this.char.setWeapon('fists');
    game.scene.add(this.char.root);
  }

  get alive() { return !this.dead; }

  say(text, dur = 3) {
    if (this._bubble) { this._bubble.parent?.remove(this._bubble); this._bubble.material.map.dispose(); this._bubble.material.dispose(); }
    const s = labelSprite(text, { color: '#ffe9a8', size: 30, w: 320 });
    s.position.set(0, 2.15, 0);
    this.char.root.add(s);
    this._bubble = s;
    this.sayT = dur;
  }

  damage(amount, byPlayer = true) {
    if (this.dead) return;
    this.hp -= amount;
    this.char.hurt();
    this.hostile = true;
    if (this.hp <= 0) this.die(byPlayer);
    else if (this.role === 'guard') this.say('Ах ты!', 2);
  }

  die(byPlayer = true) {
    if (this.dead) return;
    this.dead = true;
    this.char.isDead = true;
    this.char.setState('dead');
    this.game.onNpcKilled(this, byPlayer);
  }

  faceTo(x, z) {
    const t = Math.atan2(x - this.pos.x, z - this.pos.z);
    this.yaw = t;
    this.char.root.rotation.y = t;
  }

  moveToward(tx, tz, speed, dt) {
    const dx = tx - this.pos.x, dz = tz - this.pos.z;
    const d = Math.hypot(dx, dz);
    if (d < 0.001) return 0;
    const step = Math.min(d, speed * dt);
    this.pos.x += (dx / d) * step;
    this.pos.z += (dz / d) * step;
    this.game.colliders.resolve(this.pos, 0.32);
    const targetYaw = Math.atan2(dx, dz);
    this.yaw += angleDiff(this.yaw, targetYaw) * Math.min(1, dt * 9);
    this.char.root.rotation.y = this.yaw;
    this.char.root.position.set(this.pos.x, this.pos.y, this.pos.z);
    return speed;
  }

  update(dt) {
    if (this.dead) { this.char.update(dt, 0); return; }
    this.attackCd = Math.max(0, this.attackCd - dt);
    if (this.sayT > 0) {
      this.sayT -= dt;
      if (this.sayT <= 0 && this._bubble) {
        this._bubble.parent?.remove(this._bubble);
        this._bubble.material.map?.dispose();
        this._bubble.material.dispose();
        this._bubble = null;
      }
    }
    let speed = 0;
    const g = this.game;
    const pPos = g.player.pos;
    const dp = distXZ(this.pos, pPos);

    switch (this.role) {
      case 'cashier': speed = this.updateCashier(dt, dp, pPos); break;
      case 'seller': speed = this.updateSeller(dt, dp, pPos); break;
      case 'guard': speed = this.updateGuard(dt, dp, pPos); break;
      case 'cop': speed = this.updateCop(dt, dp, pPos); break;
      case 'boss': speed = this.updateBoss(dt, dp, pPos); break;
      default: speed = this.updatePed(dt, dp, pPos); break;
    }

    // look at nearby player
    if (!this.dead && dp < 9 && this.role !== 'cop') {
      const local = angleDiff(this.char.root.rotation.y, Math.atan2(pPos.x - this.pos.x, pPos.z - this.pos.z));
      this.char.lookTarget = { localYaw: clamp(local, -0.8, 0.8), localPitch: 0.1 };
    } else this.char.lookTarget = null;

    this.char.aiming = this.role === 'cop'
      ? !!this.aimingWanted && !(this.reloadT > 0)
      : this.role === 'guard' ? !!this.hostile : false;
    this.char.update(dt, speed, { aiming: this.char.aiming });
  }

  /* ---------- pedestrians / thugs ---------- */
  updatePed(dt, dp, pPos) {
    const g = this.game;
    if (this.jobOffer) {
      // walk to player and offer a job
      this.offerT -= dt;
      const d = distXZ(this.pos, pPos);
      if (d > 2.2) {
        const sp = this.moveToward(pPos.x, pPos.z, 1.7, dt);
        this.char.setState('walk');
        if (this.offerT < 0) this.jobOffer = false;
        return sp;
      }
      this.faceTo(pPos.x, pPos.z);
      this.char.setState('idle');
      if (this.offerT < 0) this.jobOffer = false;
      return 0;
    }

    if (this.hostile && this.role === 'thug') {
      const d = distXZ(this.pos, pPos);
      if (d < 1.8) {
        this.char.setState('idle');
        if (this.attackCd <= 0) {
          this.attackCd = 1.3;
          this.char.punch();
          g.hitPlayer(6 + Math.random() * 4, this);
        }
        return 0;
      }
      this.char.setState('walk');
      return this.moveToward(pPos.x, pPos.z, 2.6, dt);
    }

    // flee from drawn weapon / gunfire
    if (g.playerArmed() && dp < 7 && Math.random() < 0.02) {
      this.state = 'flee';
      this.fleeT = 3.5;
    }
    if (this.state === 'flee') {
      this.fleeT -= dt;
      if (this.fleeT <= 0) this.state = 'patrol';
      const dx = this.pos.x - pPos.x, dz = this.pos.z - pPos.z;
      const l = Math.hypot(dx, dz) || 1;
      this.char.setState('walk');
      const sp = this.moveToward(this.pos.x + (dx / l) * 3, this.pos.z + (dz / l) * 3, 3.4, dt);
      if (Math.random() < 0.01) this.say('Помогите!', 2);
      return sp;
    }

    // walk path
    if (this.path && this.path.length) {
      if (this.waitT > 0) { this.waitT -= dt; this.char.setState('idle'); return 0; }
      const wp = this.path[this.pathIdx % this.path.length];
      const d = Math.hypot(wp[0] - this.pos.x, wp[1] - this.pos.z);
      if (d < 0.9) {
        this.pathIdx = (this.pathIdx + 1) % this.path.length;
        if (Math.random() < 0.35) this.waitT = 1 + Math.random() * 3;
      } else {
        this.char.setState('walk');
        const sp = this.moveToward(wp[0], wp[1], this.speed, dt);
        this.sayCd -= dt;
        if (this.sayCd <= 0) {
          this.sayCd = 14 + Math.random() * 20;
          if (dp < 12 && Math.random() < 0.5) this.say(LINES[this.role]?.[Math.floor(Math.random() * LINES[this.role].length)] || LINES.ped[0]);
        }
        return sp;
      }
    }
    this.char.setState('idle');
    return 0;
  }

  /* ---------- bank cashier ---------- */
  updateCashier(dt, dp, pPos) {
    const g = this.game;
    const seen = g.visionCheck(this.pos, this.yaw, pPos, 2.4, 20);
    const armed = g.playerArmed();
    if (seen && armed && !g.alarmOn) {
      if (!this._panic) { this._panic = 1.8; this.say('Оружие! Помогите!', 2.4); }
    }
    if (seen && g.grabbing) {
      if (!this._panic) { this._panic = 1.2; this.say('Он забирает деньги!', 2); }
    }
    if (this._panic) {
      this._panic -= dt;
      this.char.setState('idle');
      this.char.lookTarget = { localYaw: 0, localPitch: 0 };
      // arms up
      this.char.armR.shoulder.rotation.x = -2.3;
      this.char.armL.shoulder.rotation.x = -2.1;
      if (this._panic <= 0) {
        this._panic = null;
        g.triggerAlarm('cashier');
      }
      return 0;
    }
    if (seen) this.faceTo(pPos.x, pPos.z);
    this.char.setState('idle');
    return 0;
  }

  updateSeller(dt, dp, pPos) {
    if (dp < 3.2) {
      this.faceTo(pPos.x, pPos.z);
      this.sayCd -= dt;
      if (this.sayCd <= 0) { this.sayCd = 20; this.say(LINES.seller[Math.floor(Math.random() * 3)]); }
    }
    this.char.setState('idle');
    return 0;
  }

  updateBoss(dt, dp, pPos) {
    this.char.setState('idle');
    if (dp < 3.2) this.faceTo(pPos.x, pPos.z);
    return 0;
  }

  /* ---------- guards ---------- */
  updateGuard(dt, dp, pPos) {
    const g = this.game;
    const sees = g.visionCheck(this.pos, this.yaw, pPos, this.fov, this.vision);
    const armed = g.playerArmed();
    if (sees && armed && !g.alarmOn) {
      this.hostile = true;
      if (!this._warned) { this._warned = 1; this.say('Оружие в банке!', 2.5); }
    }
    if (sees && g.grabbing) { this.hostile = true; }

    if (this.hostile) {
      const d = distXZ(this.pos, pPos);
      if (d < 1.9) {
        this.char.setState('idle');
        this.faceTo(pPos.x, pPos.z);
        if (this.attackCd <= 0) {
          this.attackCd = 1.35;
          this.char.punch();
          g.hitPlayer(7 + Math.random() * 3.5, this);
          g.ui.hitFlash();
        }
        return 0;
      }
      this.char.setState('walk');
      if (d < 26) return this.moveToward(pPos.x, pPos.z, this.speed, dt);
    }

    // patrol
    if (this.path && this.path.length) {
      const wp = this.path[this.pathIdx % this.path.length];
      const d = Math.hypot(wp[0] - this.pos.x, wp[1] - this.pos.z);
      if (d < 1.0) {
        this.pathIdx = (this.pathIdx + 1) % this.path.length;
        if (Math.random() < 0.3) this.waitT = 1 + Math.random() * 2;
      } else if (this.waitT > 0) {
        this.waitT -= dt;
        this.char.setState('idle');
        this.yaw += dt * 0.7;
        this.char.root.rotation.y = this.yaw;
      } else {
        this.char.setState('walk');
        return this.moveToward(wp[0], wp[1], this.speed, dt);
      }
    }
    this.char.setState('idle');
    return 0;
  }

  /* ---------- police ---------- */
  updateCop(dt, dp, pPos) {
    const g = this.game;

    // 1) вылезает из машины
    if (this.exiting > 0) {
      this.exiting -= dt;
      const k = clamp(1 - this.exiting / (this.exitDur || 0.55), 0, 1);
      if (this.exitFrom && this.exitTo) {
        this.pos.x = this.exitFrom.x + (this.exitTo.x - this.exitFrom.x) * k;
        this.pos.z = this.exitFrom.z + (this.exitTo.z - this.exitFrom.z) * k;
        this.pos.y = Math.sin(k * Math.PI) * 0.13;
      }
      this.faceTo(this.exitTo?.x ?? this.pos.x, this.exitTo?.z ?? this.pos.z + 1);
      this.char.setState('walk');
      this.char.root.position.copy(this.pos);
      if (this.exiting <= 0) {
        this.pos.y = 0;
        this.exiting = 0;
        if (!this.saidHi) { this.saidHi = true; this.say('Полиция! Стоять!', 2.2); }
      }
      return 2.1;
    }

    // 2) розыск снят — возвращается в машину и уезжает
    if (this.car && !this.inCar && g.player.stars === 0 && (g.remoteStars || 0) === 0) {
      const to = this.car.exitTo || this.car.pos;
      if (distXZ(this.pos, to) > 1.25) {
        this.char.setState('walk');
        return this.moveToward(to.x, to.z, 2.9, dt);
      }
      this.inCar = true;
      this.inactive = true;
      this.char.root.visible = false;
      return 0;
    }

    const target = g.nearestWantedPlayer(this.pos);
    if (!target) {
      this.leaving = true;
      this.char.setState('walk');
      return this.moveToward(this.pos.x + (this.startPos.x - this.pos.x) * 0.02, this.pos.z + (this.startPos.z - this.pos.z) * 0.02, 2.6, dt);
    }
    const tp = target.pos;
    const d = distXZ(this.pos, tp);
    const sees = g.visionCheck(this.pos, this.yaw, tp, 2.6, 40);
    if (sees) g.markSeen(target, this);

    this.reloadT = Math.max(0, (this.reloadT || 0) - dt);
    const stars = target.isRemote ? (g.remoteStars || 0) : g.player.stars;
    const useGun = stars >= 3 && d < 30 && sees;
    this.aimingWanted = useGun;

    if (useGun && this.reloadT <= 0) {
      // стреляет с дистанции: подходит до ~12 м, с 4 м отходит, но ствол держит на цели
      this.aimingWanted = true;
      let sp = 0;
      if (d > 12) {
        this.char.setState('walk');
        sp = this.moveToward(tp.x, tp.z, 3.1, dt);
      } else if (d < 4.6) {
        this.char.setState('walk');
        sp = this.moveToward(this.pos.x * 2 - tp.x, this.pos.z * 2 - tp.z, 1.7, dt);
      } else {
        this.char.setState('idle');
        this.faceTo(tp.x, tp.z);
      }
      if (!this.saidHi) { this.saidHi = true; this.say('Стоять! Полиция!', 2.2); }
      if (this.attackCd <= 0 && d < 26) {
        this.attackCd = 1.1 + Math.random() * 0.5;
        this.char.shoot();
        g.copShootAt(this, tp, target);
        this.shots = (this.shots || 0) + 1;
        if (this.shots >= 7) {
          this.shots = 0;
          this.reloadT = 1.8;
          g.sound.reload();
          this.say('Перезаряжаюсь…', 1.6);
        }
      }
      return sp;
    }
    if (useGun) {
      // перезарядка: опускает ствол, пятится
      this.char.setState('walk');
      this.faceTo(tp.x, tp.z);
      return this.moveToward(this.pos.x * 2 - tp.x, this.pos.z * 2 - tp.z, 1.4, dt);
    }
    if (d < 2.0) {
      this.char.setState('idle');
      this.faceTo(tp.x, tp.z);
      if (!this.saidHi) { this.saidHi = true; this.say('Руки за голову!', 2); }
      if (this.attackCd <= 0) {
        this.attackCd = 1.2;
        this.char.punch();
        g.sound.punch();
        g.hitPlayer(8 + Math.random() * 4, this, target);
        g.ui.hitFlash();
      }
      return 0;
    }
    this.char.setState('walk');
    this.char.speed = 3.6;
    return this.moveToward(tp.x, tp.z, 3.7, dt);
  }
}
