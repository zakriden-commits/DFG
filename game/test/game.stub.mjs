/* richer DOM stub for running the whole Game class headless */
const listeners = {};
const ctx2d = new Proxy({}, {
  get(t, k) {
    if (k === 'measureText') return () => ({ width: 20 });
    if (k === 'createRadialGradient' || k === 'createLinearGradient' || k === 'createPattern') return () => ({ addColorStop() {} });
    if (k === 'getImageData') return () => ({ data: new Uint8ClampedArray(4) });
    if (k === 'canvas') return { width: 2, height: 2 };
    if (!(k in t)) return () => {};
    return t[k];
  },
  set(t, k, v) { t[k] = v; return true; },
});

class FakeEl {
  constructor(tag = 'div') {
    this.tagName = tag.toUpperCase();
    this.children = [];
    this.style = new Proxy({}, { get: (t, k) => k === 'width' ? '0px' : '', set: (t, k, v) => { t[k] = v; return true; } });
    this.dataset = {};
    this.classList = { add() {}, remove() {}, contains: () => false, toggle() {} };
    this._html = ''; this.textContent = ''; this.value = 0;
    this.clientWidth = 200; this.clientHeight = 100;
    this.width = 560; this.height = 240;
    this.innerText = '';
    this.isConnected = true;
  }
  set innerHTML(v) { this._html = v; }
  get innerHTML() { return this._html; }
  appendChild(c) { this.children.push(c); return c; }
  removeChild(c) { this.children = this.children.filter((x) => x !== c); }
  remove() { this.isConnected = false; }
  addEventListener() {}
  removeEventListener() {}
  querySelector() { return new FakeEl(); }
  querySelectorAll() { return []; }
  getBoundingClientRect() { return { left: 0, top: 0, width: 120, height: 120 }; }
  getContext() { return ctx2d; }
  requestPointerLock() {}
  click() {}
  focus() {}
  setAttribute() {}
  getAttribute() { return null; }
  insertBefore(c) { this.children.unshift(c); return c; }
  get firstChild() { return this.children[0] || null; }
  get lastChild() { return this.children[this.children.length - 1] || null; }
  append(...n) { n.forEach((c) => this.appendChild(c)); }
}

const elements = new Map();
globalThis.document = {
  createElement: (tag) => (tag === 'canvas' ? Object.assign(new FakeEl('canvas'), { getContext: () => ctx2d }) : new FakeEl(tag)),
  getElementById: (id) => {
    if (!elements.has(id)) elements.set(id, new FakeEl());
    return elements.get(id);
  },
  querySelector: () => new FakeEl(),
  querySelectorAll: () => [],
  addEventListener: (e, f) => { (listeners[e] ||= []).push(f); },
  removeEventListener() {},
  body: new FakeEl('body'),
  hidden: false,
  pointerLockElement: null,
  exitPointerLock() {},
};
globalThis.window = globalThis;
globalThis.innerWidth = 1280;
globalThis.innerHeight = 720;
globalThis.devicePixelRatio = 1;
globalThis.addEventListener = (e, f) => { (listeners[e] ||= []).push(f); };
globalThis.removeEventListener = () => {};
globalThis.requestAnimationFrame = () => 0;
globalThis.setInterval = () => 0;
globalThis.matchMedia = () => ({ matches: false, addEventListener() {}, addListener() {} });
globalThis.localStorage = { _d: {}, getItem(k) { return this._d[k] ?? null; }, setItem(k, v) { this._d[k] = String(v); }, removeItem(k) { delete this._d[k]; } };
if (!globalThis.navigator) globalThis.navigator = {};
try { if (!globalThis.navigator.mediaDevices) globalThis.navigator.mediaDevices = { getUserMedia: async () => ({ getTracks: () => [] }) }; } catch (e) {}
try { globalThis.navigator.userAgent = 'headless-test'; } catch (e) {}
globalThis.performance = globalThis.performance || { now: () => Date.now() };
globalThis.AudioContext = class { constructor() { this.currentTime = 0; this.sampleRate = 44100; this.destination = {}; } createGain() { return { gain: { value: 0, setValueAtTime() {}, exponentialRampToValueAtTime() {} }, connect() {} }; } createBuffer() { return { getChannelData: () => new Float32Array(10) }; } createBufferSource() { return { connect() {}, start() {}, stop() {}, buffer: null }; } createBiquadFilter() { return { connect() {}, frequency: { value: 0 }, Q: { value: 0 } }; } createOscillator() { return { connect() {}, start() {}, stop() {}, frequency: { value: 0, setValueAtTime() {}, exponentialRampToValueAtTime() {} } }; } };
