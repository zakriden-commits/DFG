import { WEAPONS } from './models.js';

export const SLOTS = 6;
export const LOCKER_SLOTS = 15;

export function newHotbar() {
  return [null, null, null, null, null, null]; // slot 0 = fists (virtual)
}

export function newAmmo() {
  return { '9мм': 0, '12к': 0, '7.62': 0 };
}

export function makeWeapon(id) {
  const w = WEAPONS[id];
  return { t: w.melee ? 'melee' : 'weapon', id, mag: w.mag || 0, ammoType: w.ammo || null };
}

export function makeItem(kind, extra = {}) {
  switch (kind) {
    case 'money': return { t: 'money', qty: extra.qty || 1 };
    case 'bag': return { t: 'bag', cash: extra.cash || 0 };
    case 'armor': return { t: 'armor', qty: extra.qty || 100 };
    default: return { t: kind, ...extra };
  }
}

export function itemName(it) {
  if (!it) return 'Кулаки';
  if (it.t === 'money') return `Пачка денег${it.qty > 1 ? ' ×' + it.qty : ''}`;
  if (it.t === 'bag') return 'Сумка';
  if (it.t === 'armor') return 'Бронежилет';
  if (it.t === 'weapon' || it.t === 'melee') return WEAPONS[it.id]?.name || it.id;
  return 'Предмет';
}

export function itemIcon(it) {
  if (!it) return '👊';
  if (it.t === 'money') return '💵';
  if (it.t === 'bag') return '🎒';
  if (it.t === 'armor') return '🦺';
  if (it.t === 'weapon' || it.t === 'melee') return WEAPONS[it.id]?.icon || '🔫';
  return '📦';
}

export function itemDesc(it) {
  if (!it) return 'Без оружия. Кулаки всегда с тобой.';
  if (it.t === 'money') return 'Украденные пачки. В инвентаре можно перевести в баланс — сумма случайная.';
  if (it.t === 'bag') return 'Сумка для крупных дел. Вмещает много денег. Открывай и выводи сколько нужно.';
  if (it.t === 'armor') return 'Бронежилет: поглощает часть урона.';
  if (it.t === 'weapon' || it.t === 'melee') return WEAPONS[it.id]?.desc || '';
  return '';
}

/* add item into hotbar, returns true on success */
export function addToHotbar(hot, it) {
  // slot 0 is reserved for fists, items live in 1..5
  if (it.t === 'money') {
    for (let i = 1; i < hot.length; i++) {
      const s = hot[i];
      if (s && s.t === 'money') { s.qty += it.qty; return true; }
    }
  }
  if (it.t === 'bag') {
    for (let i = 1; i < hot.length; i++) if (hot[i] && hot[i].t === 'bag') return false;
  }
  for (let i = 1; i < hot.length; i++) {
    if (!hot[i]) { hot[i] = it; return true; }
  }
  return false;
}

export function removeFromHotbar(hot, index) {
  if (index < 0 || index >= hot.length) return null;
  const it = hot[index];
  hot[index] = null;
  return it;
}

export function findWeaponSlot(hot, id) {
  return hot.findIndex((s) => s && (s.t === 'weapon' || s.t === 'melee') && s.id === id);
}

export function findWeaponSlotOfType(hot, t) {
  return hot.findIndex((s) => s && s.t === t);
}

/* amount of money a single pack gives (random) */
export function packValue() {
  const r = Math.random();
  if (r > 0.9) return 2600 + Math.floor(Math.random() * 1800);
  if (r > 0.55) return 1200 + Math.floor(Math.random() * 1200);
  return 450 + Math.floor(Math.random() * 700);
}

export function bagFill() {
  return 9000 + Math.floor(Math.random() * 21000);
}

export const SAVE_KEY = 'deni_islam_save_v1';

export function defaultSave() {
  return {
    v: 1,
    money: 500,
    hotbar: newHotbar(),
    ammo: newAmmo(),
    lockers: { lockerA: new Array(LOCKER_SLOTS).fill(null), lockerB: new Array(LOCKER_SLOTS).fill(null) },
    hp: 100,
    pos: null,
    stars: 0,
    bag: null,
    stats: { jobs: 0, kills: 0, robberies: 0 },
  };
}

/* storage: use the Android bridge when the APK provides it, else localStorage */
function rawRead() {
  try {
    if (window.AndroidStore && typeof window.AndroidStore.load === 'function') {
      const v = window.AndroidStore.load();
      if (v) return v;
    }
  } catch (e) {}
  try { return localStorage.getItem(SAVE_KEY); } catch (e) { return null; }
}
function rawWrite(v) {
  try {
    if (window.AndroidStore && typeof window.AndroidStore.save === 'function') window.AndroidStore.save(v);
  } catch (e) {}
  try { localStorage.setItem(SAVE_KEY, v); } catch (e) {}
}
export function rawClear() {
  try { window.AndroidStore?.clear?.(); } catch (e) {}
  try { localStorage.removeItem(SAVE_KEY); } catch (e) {}
}

export function loadSave() {
  try {
    const raw = rawRead();
    if (!raw) return defaultSave();
    const s = JSON.parse(raw);
    const d = defaultSave();
    return {
      ...d, ...s,
      ammo: { ...d.ammo, ...(s.ammo || {}) },
      lockers: {
        lockerA: (s.lockers?.lockerA || d.lockers.lockerA).slice(0, LOCKER_SLOTS),
        lockerB: (s.lockers?.lockerB || d.lockers.lockerB).slice(0, LOCKER_SLOTS),
      },
      stats: { ...d.stats, ...(s.stats || {}) },
    };
  } catch (e) {
    console.warn('save load failed', e);
    return defaultSave();
  }
}

export function writeSave(s) {
  try { rawWrite(JSON.stringify(s)); } catch (e) { /* private mode */ }
}
