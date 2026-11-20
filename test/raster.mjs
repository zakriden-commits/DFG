import { writeFileSync } from 'node:fs';
import { execSync } from 'node:child_process';

export class Raster {
  constructor(w, h, bg = [10, 14, 28]) {
    this.w = w; this.h = h;
    this.buf = new Float32Array(w * h * 3);
    for (let i = 0; i < w * h; i++) {
      this.buf[i * 3] = bg[0]; this.buf[i * 3 + 1] = bg[1]; this.buf[i * 3 + 2] = bg[2];
    }
  }
  blend(x, y, c, a) {
    if (x < 0 || y < 0 || x >= this.w || y >= this.h || a <= 0) return;
    const i = (y * this.w + x) * 3;
    this.buf[i] += (c[0] - this.buf[i]) * a;
    this.buf[i + 1] += (c[1] - this.buf[i + 1]) * a;
    this.buf[i + 2] += (c[2] - this.buf[i + 2]) * a;
  }
  segment(x0, y0, x1, y1, color, radius = 3, glow = 0.0) {
    const minX = Math.max(0, Math.floor(Math.min(x0, x1) - radius - 6));
    const maxX = Math.min(this.w - 1, Math.ceil(Math.max(x0, x1) + radius + 6));
    const minY = Math.max(0, Math.floor(Math.min(y0, y1) - radius - 6));
    const maxY = Math.min(this.h - 1, Math.ceil(Math.max(y0, y1) + radius + 6));
    const dx = x1 - x0, dy = y1 - y0;
    const len2 = dx * dx + dy * dy || 1e-6;
    for (let y = minY; y <= maxY; y++) {
      for (let x = minX; x <= maxX; x++) {
        let t = ((x - x0) * dx + (y - y0) * dy) / len2;
        t = t < 0 ? 0 : t > 1 ? 1 : t;
        const px = x0 + dx * t, py = y0 + dy * t;
        const d = Math.hypot(x - px, y - py);
        const a = Math.max(0, Math.min(1, radius - d + 0.5));
        if (a > 0) this.blend(x, y, color, a * 0.95);
        if (glow > 0) {
          const ga = Math.max(0, 1 - d / (radius * 4)) * glow * 0.12;
          if (ga > 0) this.blend(x, y, color, ga);
        }
      }
    }
  }
  disc(cx, cy, r, color) {
    const minX = Math.max(0, Math.floor(cx - r - 2));
    const maxX = Math.min(this.w - 1, Math.ceil(cx + r + 2));
    const minY = Math.max(0, Math.floor(cy - r - 2));
    const maxY = Math.min(this.h - 1, Math.ceil(cy + r + 2));
    for (let y = minY; y <= maxY; y++) {
      for (let x = minX; x <= maxX; x++) {
        const d = Math.hypot(x - cx, y - cy);
        const a = Math.max(0, Math.min(1, r - d + 0.5));
        if (a > 0) this.blend(x, y, color, a);
      }
    }
  }
  rect(x, y, w, h, color, alpha = 1) {
    for (let j = Math.max(0, y); j < Math.min(this.h, y + h); j++) {
      for (let i = Math.max(0, x); i < Math.min(this.w, x + w); i++) {
        this.blend(i, j, color, alpha);
      }
    }
  }
  save(path) {
    const header = Buffer.from(`P6\n${this.w} ${this.h}\n255\n`);
    const px = Buffer.alloc(this.w * this.h * 3);
    for (let i = 0; i < this.w * this.h * 3; i++) {
      px[i] = Math.max(0, Math.min(255, Math.round(this.buf[i])));
    }
    const ppm = path.replace(/\.png$/, '.ppm');
    writeFileSync(ppm, Buffer.concat([header, px]));
    execSync(`convert ${ppm} ${path}`);
    return path;
  }
}
