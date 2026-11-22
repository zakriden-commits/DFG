"""Built-in offline demo: a synthetic Khabib-style interview.

The speech audio (TTS) ships in the repo under demo/assets/. On first use we
mash it into a real 720p mp4 — animated gradient + audio waveform + bold
typography — and derive a sentence-level transcript with proportional timing,
so the full pipeline (analyse → cut → subtitles) runs on a real video file.
"""
from __future__ import annotations

import json
import re
import subprocess
import sys
from pathlib import Path
from typing import Dict, List, Tuple

from .config import DEMO_ASSETS, DEMO_CACHE_DIR, DEMO_SCRIPT, FFMPEG, FONT_BOLD

DEMO_VIDEO = DEMO_CACHE_DIR / "interview_habib_demo.mp4"
DEMO_META = DEMO_CACHE_DIR / "interview_habib_demo.json"


def _run(args: List[str]) -> subprocess.CompletedProcess:
    return subprocess.run(args, capture_output=True, text=True, check=False)


def probe_duration(path: Path) -> float:
    proc = _run([FFMPEG, "-hide_banner", "-i", str(path)])
    m = re.search(r"Duration:\s*(\d+):(\d+):(\d+)\.(\d+)", proc.stderr)
    if not m:
        raise RuntimeError(f"Не удалось определить длительность {path.name}")
    h, mnt, s, cs = m.groups()
    return int(h) * 3600 + int(mnt) * 60 + int(s) + int(cs) / 100.0


def _probe_ok(path: Path, min_bytes: int = 10_000) -> bool:
    return path.exists() and path.stat().st_size >= min_bytes


def _concat_audio(parts: List[Path], out: Path) -> None:
    list_file = out.with_suffix(".txt")
    list_file.write_text("".join(f"file '{p.as_posix()}'\n" for p in parts), encoding="utf-8")
    proc = _run([FFMPEG, "-hide_banner", "-y", "-f", "concat", "-safe", "0",
                 "-i", str(list_file), "-c:a", "libmp3lame", "-q:a", "3", str(out)])
    list_file.unlink(missing_ok=True)
    if proc.returncode != 0:
        raise RuntimeError("Не удалось склеить демо-аудио: " + proc.stderr[-400:])


def _render_video(audio: Path, duration: float) -> None:
    if not FONT_BOLD:
        raise RuntimeError("Не найден жирный шрифт (DejaVu Sans Bold) для демо-титров")
    font = FONT_BOLD
    d = max(1.0, duration)
    wave = "showwaves=s=1280x240:mode=cline:rate=30:split_channels=1:scale=sqrt:colors=0xff4ecd|0xffb03a|0x3af0ff"
    grad = (f"gradients=size=1280x720:c0=0x160a33:c1=0x062a3a:c2=0x3a0620:c3=0x0d1a3a"
            f":nb_colors=4:speed=0.014:duration={d}:rate=30")
    vf = (
        f"[1:a]{wave}[w];"
        f"[0:v][w]overlay=0:452[v1];"
        f"[v1]drawtext=fontfile='{font}':text='И Н Т Е Р В Ь Ю':fontsize=26:fontcolor=0x9be7ff:x=88:y=96:borderw=2:bordercolor=0x000000aa,"
        f"drawtext=fontfile='{font}':text='ХАБИБ':fontsize=118:fontcolor=white:x=84:y=126:borderw=4:bordercolor=0x1a0530dd,"
        f"drawtext=fontfile='{font}':text='НУРМАГОМЕДОВ':fontsize=84:fontcolor=white:x=88:y=246:borderw=4:bordercolor=0x1a0530dd,"
        f"drawtext=fontfile='{font}':text='СИНТЕТИЧЕСКОЕ ИНТЕРВЬЮ · DEMO':fontsize=17:fontcolor=0xffffff88:x=90:y=344:borderw=1:bordercolor=0x00000099[vout]"
    )
    proc = _run([FFMPEG, "-hide_banner", "-y",
                 "-f", "lavfi", "-i", grad,
                 "-i", str(audio),
                 "-filter_complex", vf,
                 "-map", "[vout]", "-map", "1:a",
                 "-c:v", "libx264", "-crf", "23", "-preset", "veryfast", "-pix_fmt", "yuv420p",
                 "-c:a", "aac", "-b:a", "160k", "-movflags", "+faststart",
                 "-shortest", str(DEMO_VIDEO)])
    if proc.returncode != 0:
        raise RuntimeError("Не удалось собрать демо-видео: " + proc.stderr[-500:])


def _build_segments(duration: float) -> List[Dict]:
    lines = [ln.strip() for ln in DEMO_SCRIPT.read_text(encoding="utf-8").splitlines() if ln.strip()]
    weights = [max(1, len(ln)) for ln in lines]
    total_w = sum(weights)
    t = 0.0
    segments: List[Dict] = []
    # leave 0.4 s of breathing room at the very start
    usable = max(1.0, duration - 0.8)
    for ln, w in zip(lines, weights):
        seg_dur = usable * (w / total_w)
        segments.append({"start": round(t + 0.4, 2),
                         "end": round(t + 0.4 + seg_dur, 2),
                         "text": ln})
        t += seg_dur
    return segments


def ensure_demo() -> Tuple[Path, List[Dict], float]:
    """Build (once) and return (video_path, transcript_segments, duration)."""
    if DEMO_VIDEO.exists() and DEMO_META.exists() and _probe_ok(DEMO_VIDEO):
        meta = json.loads(DEMO_META.read_text(encoding="utf-8"))
        return DEMO_VIDEO, meta["segments"], meta["duration"]

    parts = sorted(DEMO_ASSETS.glob("part*.mp3"))
    if len(parts) < 4:
        raise RuntimeError("Демо-аудио не найдено (demo/assets/part*.mp3)")

    DEMO_CACHE_DIR.mkdir(parents=True, exist_ok=True)
    audio = DEMO_CACHE_DIR / "demo_full.mp3"
    _concat_audio(parts, audio)
    duration = probe_duration(audio)
    _render_video(audio, duration)
    segments = _build_segments(duration)
    DEMO_META.write_text(json.dumps({"duration": duration, "segments": segments},
                                    ensure_ascii=False, indent=1), encoding="utf-8")
    return DEMO_VIDEO, segments, duration
