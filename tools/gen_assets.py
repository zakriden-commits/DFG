#!/usr/bin/env python3
"""
Генератор ассетов: настоящие (не процедурные) текстуры и звуки для игры.

  .venv-assets/bin/python tools/gen_assets.py

Пишет:
  game/assets/tex/*.png     — бесшовные текстуры 1024x1024
  game/assets/audio/*.wav   — эмбиент города и сирена (PCM 22050, mono)
"""
import os
import wave
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TEXDIR = os.path.join(ROOT, 'game', 'assets', 'tex')
AUDIR = os.path.join(ROOT, 'game', 'assets', 'audio')
os.makedirs(TEXDIR, exist_ok=True)
os.makedirs(AUDIR, exist_ok=True)

rng = np.random.default_rng(20240815)
S = 2048


# ------------------------------------------------------------------ helpers
def value_noise(size, octaves=5, base=4, persistence=0.55):
    acc = np.zeros((size, size), np.float32)
    amp, total = 1.0, 0.0
    for o in range(octaves):
        n = base * (2 ** o)
        small = rng.random((n, n)).astype(np.float32)
        img = Image.fromarray((small * 255).astype(np.uint8)).resize((size, size), Image.BICUBIC)
        acc += np.asarray(img, np.float32) / 255.0 * amp
        total += amp
        amp *= persistence
    acc /= total
    # нормализация
    acc = (acc - acc.min()) / (acc.max() - acc.min() + 1e-6)
    return acc


def tile_wrap(draw, x, y, w, h, paint):
    """Рисует прямоугольник с заворотом по краям (бесшовность)."""
    for ox in (-S, 0, S):
        for oy in (-S, 0, S):
            x0, y0 = x + ox, y + oy
            if x0 > S or y0 > S or x0 + w < 0 or y0 + h < 0:
                continue
            paint(x0, y0)


def overlay(base_rgb, noise, amount=0.25, tint=None):
    """Добавляет к RGB-массиву шум и (опционально) оттенок."""
    n = (noise[..., None] - 0.5) * 2 * amount * 255
    out = base_rgb + n
    if tint is not None:
        out = out * np.array(tint, np.float32)
    return np.clip(out, 0, 255).astype(np.uint8)


def save(path, arr):
    Image.fromarray(arr).save(path, optimize=True)
    print('  %-28s %6.1f KB' % (os.path.basename(path), os.path.getsize(path) / 1024))


# ------------------------------------------------------------------ textures
def tex_asphalt():
    coarse = value_noise(S, 6)
    fine = rng.random((S, S)).astype(np.float32)
    base = np.zeros((S, S, 3), np.float32)
    base[..., 0] = 44 + coarse * 26 + fine * 14
    base[..., 1] = 45 + coarse * 26 + fine * 14
    base[..., 2] = 50 + coarse * 28 + fine * 16
    img = Image.fromarray(np.clip(base, 0, 255).astype(np.uint8))
    d = ImageDraw.Draw(img)
    # гравий
    for _ in range(9000):
        x, y = rng.integers(0, S, 2)
        r = rng.integers(1, 3)
        g = rng.integers(70, 150)
        tile_wrap(d, x, y, r, r, lambda px, py: d.ellipse([px, py, px + r, py + r], fill=(g, g, g + 4)))
    # трещины
    for _ in range(14):
        x, y = rng.integers(0, S, 2)
        pts = [(x, y)]
        for _ in range(rng.integers(6, 16)):
            x += rng.integers(-40, 40)
            y += rng.integers(-40, 40)
            pts.append((x, y))
        d.line(pts, fill=(30, 30, 33), width=int(rng.integers(1, 3)))
    arr = np.asarray(img, np.float32)
    arr = overlay(arr, value_noise(S, 5), 0.16)
    # мелкая крошка поверх
    speck = rng.random((S, S)).astype(np.float32)
    arr = np.clip(arr + (speck[..., None] - 0.5) * 46, 0, 255)
    img = Image.fromarray(arr.astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.4))
    return np.asarray(img, np.uint8)


def tex_sidewalk():
    coarse = value_noise(S, 5)
    base = np.zeros((S, S, 3), np.float32)
    for c, k in enumerate((150, 148, 140)):
        base[..., c] = k + coarse * 34
    img = Image.fromarray(np.clip(base, 0, 255).astype(np.uint8))
    d = ImageDraw.Draw(img)
    cell = S // 4
    for i in range(4):
        for j in range(4):
            shade = int(rng.integers(-8, 9))
            d.rectangle([i * cell + 3, j * cell + 3, (i + 1) * cell - 3, (j + 1) * cell - 3],
                        fill=(150 + shade, 148 + shade, 141 + shade))
    for i in range(4):
        d.line([(i * cell, 0), (i * cell, S)], fill=(96, 94, 90), width=5)
        d.line([(0, i * cell), (S, i * cell)], fill=(96, 94, 90), width=5)
    for _ in range(60):  # грязь
        x, y = rng.integers(0, S, 2)
        r = rng.integers(10, 60)
        d.ellipse([x - r, y - r, x + r, y + r], fill=(120, 118, 110))
    img = img.filter(ImageFilter.GaussianBlur(1.2))
    arr = np.asarray(img, np.float32)
    return overlay(arr, value_noise(S, 6), 0.14)


def tex_brick():
    mortar = 152
    arr = np.zeros((S, S, 3), np.float32)
    n = value_noise(S, 5)
    for c in range(3):
        arr[..., c] = mortar + n * 22
    img = Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8))
    d = ImageDraw.Draw(img)
    bw, bh, gap = S // 4, S // 10, 7
    clay = np.array([150.0, 82.0, 62.0])
    for row in range(10):
        off = (bw // 2) if row % 2 else 0
        for col in range(-1, 5):
            x = col * bw + off
            y = row * bh
            lum = rng.uniform(0.78, 1.14)
            col_rgb = np.clip(clay * lum + rng.normal(0, 5, 3), 40, 230).astype(int)
            rr, gg, bb = int(col_rgb[0]), int(col_rgb[1]), int(col_rgb[2])
            tile_wrap(d, x, y, bw - gap, bh - gap,
                      lambda px, py, rr=rr, gg=gg, bb=bb: d.rectangle(
                          [px, py, px + bw - gap, py + bh - gap], fill=(rr, gg, bb)))
            # блик сверху и тень снизу у каждого кирпича
            d.line([(x, y), (x + bw - gap, y)], fill=tuple(min(255, v + 26) for v in (rr, gg, bb)), width=2)
            d.line([(x, y + bh - gap - 2), (x + bw - gap, y + bh - gap - 2)],
                   fill=tuple(max(0, v - 22) for v in (rr, gg, bb)), width=2)
    arr = np.asarray(img, np.float32)
    arr = overlay(arr, value_noise(S, 7), 0.13)
    # подтёки
    img = Image.fromarray(arr)
    d = ImageDraw.Draw(img, 'RGBA')
    for _ in range(26):
        x = int(rng.integers(0, S))
        y0 = int(rng.integers(0, S))
        h = int(rng.integers(60, 320))
        w = int(rng.integers(3, 12))
        d.rectangle([x, y0, x + w, y0 + h], fill=(40, 34, 30, 40))
    return np.asarray(img, np.uint8)


def tex_plaster():
    coarse = value_noise(S, 6)
    base = np.zeros((S, S, 3), np.float32)
    for c, k in enumerate((158, 140, 112)):
        base[..., c] = k + coarse * 26
    img = Image.fromarray(np.clip(base, 0, 255).astype(np.uint8))
    d = ImageDraw.Draw(img, 'RGBA')
    for _ in range(70):  # пятна и потёртости
        x, y = rng.integers(0, S, 2)
        r = rng.integers(20, 130)
        d.ellipse([x - r, y - r, x + r, y + r],
                  fill=(96, 82, 62, int(rng.integers(10, 34))))
    for _ in range(40):  # трещинки
        x, y = rng.integers(0, S, 2)
        d.line([(x, y), (x + rng.integers(-50, 50), y + rng.integers(30, 160))],
               fill=(78, 66, 50, 90), width=1)
    img = img.filter(ImageFilter.GaussianBlur(1.6))
    arr = np.asarray(img, np.float32)
    return overlay(arr, value_noise(S, 7), 0.13)


def tex_wood():
    grain = np.zeros((S, S), np.float32)
    y = np.linspace(0, 12 * np.pi, S, dtype=np.float32)[:, None]
    x = np.linspace(0, 3 * np.pi, S, dtype=np.float32)[None, :]
    grain = (np.sin(y + np.sin(x * 1.7) * 2.4) * 0.5 + 0.5)
    grain = grain * 0.6 + value_noise(S, 6) * 0.4
    base = np.zeros((S, S, 3), np.float32)
    for c, k in enumerate((104, 70, 42)):
        base[..., c] = k + grain * 44
    img = Image.fromarray(np.clip(base, 0, 255).astype(np.uint8))
    d = ImageDraw.Draw(img)
    plank = S // 5
    for i in range(5):  # доски со швами
        d.line([(0, i * plank), (S, i * plank)], fill=(46, 30, 18), width=4)
        d.line([(0, i * plank + 2), (S, i * plank + 2)], fill=(150, 110, 70), width=1)
        off = rng.integers(0, S)
        d.line([(off, i * plank), (off, (i + 1) * plank)], fill=(46, 30, 18), width=3)
    arr = np.asarray(img, np.float32)
    arr = overlay(arr, value_noise(S, 7), 0.12)
    # сучки
    img = Image.fromarray(arr)
    d = ImageDraw.Draw(img)
    for _ in range(9):
        x, y = rng.integers(0, S, 2)
        r = rng.integers(6, 16)
        d.ellipse([x - r, y - r, x + r, y + r], outline=(58, 36, 20), width=3)
    return np.asarray(img, np.uint8)


def tex_tile():
    base = np.zeros((S, S, 3), np.float32)
    base[..., :] = 64
    img = Image.fromarray(base.astype(np.uint8))
    d = ImageDraw.Draw(img)
    n = 4
    cell = S // n
    for i in range(n):
        for j in range(n):
            v = int(rng.integers(66, 84))
            d.rectangle([i * cell + 2, j * cell + 2, (i + 1) * cell - 2, (j + 1) * cell - 2],
                        fill=(v, v + 3, v + 8))
    for i in range(n + 1):
        d.line([(i * cell, 0), (i * cell, S)], fill=(34, 36, 40), width=6)
        d.line([(0, i * cell), (S, i * cell)], fill=(34, 36, 40), width=6)
    img = img.filter(ImageFilter.GaussianBlur(0.8))
    arr = np.asarray(img, np.float32)
    return overlay(arr, value_noise(S, 6), 0.09)


def tex_marble():
    base = np.full((S, S, 3), 214, np.float32)
    base[..., 1] -= 4
    base[..., 2] -= 12
    img = Image.fromarray(np.clip(base, 0, 255).astype(np.uint8))
    d = ImageDraw.Draw(img, 'RGBA')
    for _ in range(26):  # прожилки
        x, y = rng.integers(0, S, 2)
        pts = [(x, y)]
        for _ in range(rng.integers(10, 28)):
            x += rng.integers(-70, 70)
            y += rng.integers(-70, 70)
            pts.append((x, y))
        d.line(pts, fill=(150, 146, 132, 120), width=int(rng.integers(1, 4)))
    img = img.filter(ImageFilter.GaussianBlur(1.0))
    arr = np.asarray(img, np.float32)
    arr = overlay(arr, value_noise(S, 6), 0.07)
    img = Image.fromarray(arr)
    d = ImageDraw.Draw(img)
    cell = S // 2
    for i in range(3):
        d.line([(i * cell, 0), (i * cell, S)], fill=(188, 184, 172), width=3)
        d.line([(0, i * cell), (S, i * cell)], fill=(188, 184, 172), width=3)
    return np.asarray(img, np.uint8)


def tex_concrete():
    base = np.zeros((S, S, 3), np.float32)
    n = value_noise(S, 6)
    for c, k in enumerate((126, 124, 118)):
        base[..., c] = k + n * 30
    img = Image.fromarray(np.clip(base, 0, 255).astype(np.uint8))
    d = ImageDraw.Draw(img, 'RGBA')
    for _ in range(50):
        x, y = rng.integers(0, S, 2)
        r = rng.integers(20, 90)
        d.ellipse([x - r, y - r, x + r, y + r], fill=(70, 68, 64, int(rng.integers(8, 26))))
    for _ in range(10):  # стыки опалубки
        x = int(rng.integers(0, S))
        d.line([(x, 0), (x, S)], fill=(96, 94, 90, 90), width=2)
    img = img.filter(ImageFilter.GaussianBlur(0.9))
    return np.asarray(img, np.uint8)


def tex_facade(wall=(122, 112, 96), lit=0.5, brick=False, shopfront=False):
    """Фасад с окнами, рамами, подоконниками, кондиционерами и подтёками."""
    if brick:
        arr = tex_brick().astype(np.float32)
        arr *= np.array(wall, np.float32) / np.array([140, 84, 62], np.float32)
        arr = np.clip(arr, 0, 255)
        img = Image.fromarray(arr.astype(np.uint8))
    else:
        base = np.zeros((S, S, 3), np.float32)
        n = value_noise(S, 6)
        for c, k in enumerate(wall):
            base[..., c] = k + n * 26
        img = Image.fromarray(np.clip(base, 0, 255).astype(np.uint8))
    d = ImageDraw.Draw(img, 'RGBA')
    cols, rows = 5, 5
    ww, wh = int(S * 0.115), int(S * 0.145)
    gx = (S - cols * ww) // (cols + 1)
    gy = (S - rows * wh) // (rows + 1)
    for r in range(rows):
        for c in range(cols):
            x = gx + c * (ww + gx)
            y = gy + r * (wh + gy)
            if shopfront and r >= rows - 1:
                continue
            on = rng.random() < lit
            # рама
            d.rectangle([x - 7, y - 7, x + ww + 7, y + wh + 7], fill=(196, 192, 182, 255))
            if on:
                glow = int(rng.integers(215, 255))
                d.rectangle([x, y, x + ww, y + wh], fill=(glow, int(glow * 0.86), int(glow * 0.58), 255))
            else:
                d.rectangle([x, y, x + ww, y + wh], fill=(24, 30, 38, 255))
                # отражение неба
                d.polygon([(x, y + wh), (x + ww * 0.62, y), (x + ww, y), (x + ww * 0.34, y + wh)],
                          fill=(90, 120, 150, 60))
            d.line([(x + ww // 2, y), (x + ww // 2, y + wh)], fill=(198, 194, 184, 255), width=5)
            d.line([(x, y + wh // 2), (x + ww, y + wh // 2)], fill=(198, 194, 184, 255), width=4)
            # подоконник + кондёр
            d.rectangle([x - 12, y + wh + 7, x + ww + 12, y + wh + 16], fill=(176, 172, 162, 255))
            if rng.random() < 0.35:
                ax = x + int(rng.integers(0, max(1, ww - 40)))
                ay = y + wh + 22
                d.rectangle([ax, ay, ax + 44, ay + 34], fill=(150, 152, 150, 255))
                for i in range(5):
                    d.line([(ax + 4, ay + 6 + i * 6), (ax + 40, ay + 6 + i * 6)], fill=(110, 112, 112, 255), width=2)
    if shopfront:
        sy = int(S * 0.70)
        d.rectangle([0, sy, S, S], fill=(40, 42, 48, 255))
        for c in range(4):
            x = int(S * 0.06 + c * S * 0.235)
            d.rectangle([x, sy + 26, x + int(S * 0.19), S - 40], fill=(58, 96, 128, 210))
            d.rectangle([x, sy + 26, x + int(S * 0.19), sy + 60], fill=(196, 40, 36, 235))
    # грязь у земли
    grad = Image.new('L', (1, S), 0)
    gd = ImageDraw.Draw(grad)
    for y in range(S):
        gd.point((0, y), fill=int(max(0, (y / S) ** 6) * 120))
    dark = Image.new('RGBA', (S, S), (34, 30, 26, 255))
    img = Image.composite(dark, img, grad.resize((S, S)))
    img = img.filter(ImageFilter.GaussianBlur(0.8))
    arr = np.asarray(img, np.float32)
    arr = overlay(arr[:, :, :3], value_noise(S, 7), 0.10)
    return arr


# ------------------------------------------------------------------ audio
def write_wav(path, samples, rate=22050):
    data = np.clip(samples, -1, 1)
    pcm = (data * 32767).astype('<i2')
    with wave.open(path, 'wb') as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(rate)
        w.writeframes(pcm.tobytes())
    print('  %-28s %6.1f KB' % (os.path.basename(path), os.path.getsize(path) / 1024))


def lowpass(x, alpha):
    y = np.empty_like(x)
    acc = 0.0
    for i in range(len(x)):
        acc += alpha * (x[i] - acc)
        y[i] = acc
    return y


def audio_city(seconds=42, rate=22050):
    n = int(seconds * rate)
    t = np.linspace(0, seconds, n, dtype=np.float32)
    # низкий гул города
    rumble = lowpass(rng.standard_normal(n).astype(np.float32), 0.02) * 6.0
    rumble = np.tanh(rumble * 1.4)
    # проезжающие машины: всплески шума с частотным сдвигом
    traffic = np.zeros(n, np.float32)
    for _ in range(16):
        start = int(rng.integers(0, n - rate))
        length = int(rng.integers(rate * 1.2, rate * 3.5))
        length = min(length, n - start)
        seg = rng.standard_normal(length).astype(np.float32)
        seg = lowpass(seg, 0.06)
        env = np.hanning(length).astype(np.float32)
        traffic[start:start + length] += seg * env * rng.uniform(0.25, 0.7)
    # ветер
    wind = lowpass(rng.standard_normal(n).astype(np.float32), 0.004) * 2.2
    # редкие гудки
    horns = np.zeros(n, np.float32)
    for _ in range(7):
        start = int(rng.integers(0, n - rate))
        dur = int(rate * rng.uniform(0.18, 0.5))
        dur = min(dur, n - start)
        tt = np.arange(dur) / rate
        f = rng.uniform(320, 480)
        h = (np.sin(2 * np.pi * f * tt) * 0.5 + np.sin(2 * np.pi * f * 1.5 * tt) * 0.25)
        h *= np.hanning(dur)
        horns[start:start + dur] += h * 0.22
    # птицы (высокие короткие чирики)
    birds = np.zeros(n, np.float32)
    for _ in range(26):
        start = int(rng.integers(0, n - rate // 2))
        dur = int(rate * rng.uniform(0.04, 0.11))
        dur = min(dur, n - start)
        tt = np.arange(dur) / rate
        f0 = rng.uniform(1800, 3200)
        b = np.sin(2 * np.pi * (f0 + 2200 * tt / max(tt[-1], 1e-3)) * tt)
        birds[start:start + dur] += b * np.hanning(dur) * 0.05
    mix = rumble * 0.32 + traffic * 0.55 + wind * 0.30 + horns + birds
    mix = np.tanh(mix * 1.1)
    # плавная закольцовка
    fade = int(rate * 1.5)
    mix[:fade] *= np.linspace(0, 1, fade)
    mix[-fade:] *= np.linspace(1, 0, fade)
    return mix / (np.max(np.abs(mix)) + 1e-6) * 0.9


def audio_siren(seconds=7.0, rate=22050):
    n = int(seconds * rate)
    t = np.arange(n) / rate
    # европейская сирена: пила 600→1300 Гц, 1.2 с на цикл
    phase = (t % 1.2) / 1.2
    freq = 600 + 700 * (0.5 - 0.5 * np.cos(phase * 2 * np.pi))
    phase_acc = np.cumsum(freq) / rate
    tone = np.sin(2 * np.pi * phase_acc) + 0.35 * np.sin(4 * np.pi * phase_acc)
    tone *= 0.8
    # лёгкое дрожание, как у реальной сирены
    tone *= 1 + 0.08 * np.sin(2 * np.pi * 7.5 * t)
    tone = np.tanh(tone * 1.2)
    fade = int(rate * 0.25)
    tone[:fade] *= np.linspace(0, 1, fade)
    tone[-fade:] *= np.linspace(1, 0, fade)
    return tone / (np.max(np.abs(tone)) + 1e-6) * 0.85


def audio_police_radio(seconds=2.6, rate=22050):
    """Короткая помеха рации с неразборчивой речью — для антуража."""
    n = int(seconds * rate)
    noise = rng.standard_normal(n).astype(np.float32)
    band = lowpass(noise, 0.25) - lowpass(noise, 0.05)
    band /= (np.max(np.abs(band)) + 1e-6)
    gate = (np.sin(2 * np.pi * 3.1 * np.arange(n) / rate) > -0.2).astype(np.float32)
    gate = lowpass(gate, 0.02)
    click = np.zeros(n, np.float32)
    click[0] = 0.9
    click = lowpass(click, 0.4)
    out = band * gate * 0.55 + click
    return out / (np.max(np.abs(out)) + 1e-6) * 0.8


def main():
    print('textures:')
    save(os.path.join(TEXDIR, 'asphalt.png'), tex_asphalt())
    save(os.path.join(TEXDIR, 'sidewalk.png'), tex_sidewalk())
    save(os.path.join(TEXDIR, 'brick.png'), tex_brick())
    save(os.path.join(TEXDIR, 'plasterHouse.png'), tex_plaster())
    save(os.path.join(TEXDIR, 'woodFloor.png'), tex_wood())
    save(os.path.join(TEXDIR, 'tile.png'), tex_tile())
    save(os.path.join(TEXDIR, 'marble.png'), tex_marble())
    save(os.path.join(TEXDIR, 'concrete.png'), tex_concrete())
    save(os.path.join(TEXDIR, 'bankFacade.png'), tex_facade((138, 130, 112), 0.42, brick=False))
    save(os.path.join(TEXDIR, 'shopFacade.png'), tex_facade((104, 92, 82), 0.55, brick=True, shopfront=True))
    save(os.path.join(TEXDIR, 'facadeA.png'), tex_facade((126, 118, 100), 0.5, brick=False))
    save(os.path.join(TEXDIR, 'facadeB.png'), tex_facade((104, 106, 116), 0.45, brick=True))
    save(os.path.join(TEXDIR, 'facadeC.png'), tex_facade((122, 108, 90), 0.4, brick=False))
    save(os.path.join(TEXDIR, 'facadeD.png'), tex_facade((112, 102, 86), 0.55, brick=True))
    save(os.path.join(TEXDIR, 'facadeE.png'), tex_facade((98, 94, 86), 0.45, brick=False))
    save(os.path.join(TEXDIR, 'facadeF.png'), tex_facade((110, 98, 88), 0.4, brick=True))
    print('audio:')
    write_wav(os.path.join(AUDIR, 'city.wav'), audio_city())
    write_wav(os.path.join(AUDIR, 'siren.wav'), audio_siren())
    write_wav(os.path.join(AUDIR, 'radio.wav'), audio_police_radio())
    total = 0
    for base, _, files in os.walk(os.path.join(ROOT, 'game', 'assets')):
        for f in files:
            total += os.path.getsize(os.path.join(base, f))
    print('assets total: %.1f MB' % (total / 1024 / 1024))


if __name__ == '__main__':
    main()
