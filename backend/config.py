"""Shared configuration & external tool discovery for НАРЕЗКА САСНОГО."""
from __future__ import annotations

import os
import shutil
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = Path(os.environ.get("NAREZKA_DATA", BASE_DIR / "data"))
MEDIA_DIR = DATA_DIR / "media"          # produced clips, served at /media
DOWNLOAD_DIR = DATA_DIR / "downloads"   # scratch for source videos
DEMO_CACHE_DIR = DATA_DIR / "demo_cache"
DB_PATH = DATA_DIR / "nareska.db"
DEMO_ASSETS = BASE_DIR / "demo" / "assets"
DEMO_SCRIPT = BASE_DIR / "demo" / "interview_habib.txt"
STATIC_DIR = BASE_DIR / "static"

for d in (DATA_DIR, MEDIA_DIR, DOWNLOAD_DIR, DEMO_CACHE_DIR):
    d.mkdir(parents=True, exist_ok=True)

FFMPEG = os.environ.get("FFMPEG_BIN") or shutil.which("ffmpeg")
if not FFMPEG:
    try:
        import imageio_ffmpeg  # static binary shipped on PyPI
        FFMPEG = imageio_ffmpeg.get_ffmpeg_exe()
    except Exception:
        FFMPEG = None

_FONT_CANDIDATES = [
    "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
    "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
    "/usr/share/fonts/dejavu/DejaVuSans-Bold.ttf",
    "/usr/share/fonts/dejavu-sans-fonts/DejaVuSans-Bold.ttf",
    "/usr/share/fonts/TTF/DejaVuSans-Bold.ttf",
    "/Library/Fonts/Arial Bold.ttf",
    "C:/Windows/Fonts/arialbd.ttf",
    "C:/Windows/Fonts/Arial Bold.ttf",
]
FONT_BOLD = next((f for f in _FONT_CANDIDATES if Path(f).exists()), None)
FONT_DIR = str(Path(FONT_BOLD).parent) if FONT_BOLD else ""

MAX_CLIP_SECONDS = 30
DEFAULT_CLIP_COUNT = 8
