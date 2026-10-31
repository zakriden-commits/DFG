/* minimal DOM stubs for headless run */
const ctx2d = new Proxy({}, {
  get(t, k) {
    if (k === 'measureText') return () => ({ width: 20 });
    if (k === 'createRadialGradient' || k === 'createLinearGradient') return () => ({ addColorStop() {} });
    if (k === 'getImageData') return () => ({ data: new Uint8ClampedArray(4) });
    if (k === 'canvas') return { width: 2, height: 2 };
    if (typeof k === 'string' && !(k in t)) return () => {};
    return t[k];
  },
  set(t, k, v) { t[k] = v; return true; },
});

function makeCanvas() {
  return {
    width: 256, height: 256, style: {},
    getContext: () => ctx2d,
    addEventListener() {}, removeEventListener() {},
    getBoundingClientRect: () => ({ left: 0, top: 0, width: 100, height: 100 }),
    appendChild() {}, removeChild() {}, remove() {},
    toDataURL: () => 'data:,',
  };
}

const listeners = {};
globalThis.document = {
  createElement: (tag) => (tag === 'canvas' ? makeCanvas() : { style: {}, appendChild() {}, addEventListener() {}, classList: { add() {}, remove() {}, contains: () => false }, dataset: {} }),
  getElementById: () => makeCanvas(),
  querySelector: () => null,
  querySelectorAll: () => [],
  addEventListener: (e, f) => { (listeners[e] ||= []).push(f); },
  removeEventListener() {},
  body: { appendChild() {}, style: {} },
  hidden: false,
};
globalThis.window = globalThis;
globalThis.innerWidth = 1280;
globalThis.innerHeight = 720;
globalThis.devicePixelRatio = 1;
globalThis.addEventListener = (e, f) => { (listeners[e] ||= []).push(f); };
globalThis.requestAnimationFrame = () => 0;
globalThis.matchMedia = () => ({ matches: false, addEventListener() {}, addListener() {} });
globalThis.localStorage = {
  _d: {}, getItem(k) { return this._d[k] ?? null; }, setItem(k, v) { this._d[k] = String(v); }, removeItem(k) { delete this._d[k]; },
};
if (!globalThis.navigator) globalThis.navigator = {};
try { if (!globalThis.navigator.mediaDevices) globalThis.navigator.mediaDevices = { getUserMedia: async () => ({ getTracks: () => [] }) }; } catch(e) {}
globalThis.performance = globalThis.performance || { now: () => Date.now() };
globalThis.AudioContext = class { constructor() { this.currentTime = 0; this.sampleRate = 44100; this.destination = {}; } createGain() { return { gain: { value: 0, setValueAtTime() {}, exponentialRampToValueAtTime() {} }, connect() {} }; } createBuffer() { return { getChannelData: () => new Float32Array(10) }; } createBufferSource() { return { connect() {}, start() {}, stop() {}, buffer: null }; } createBiquadFilter() { return { connect() {}, frequency: { value: 0 }, Q: { value: 0 } }; } createOscillator() { return { connect() {}, start() {}, stop() {}, frequency: { value: 0, setValueAtTime() {}, exponentialRampToValueAtTime() {} } }; } };
