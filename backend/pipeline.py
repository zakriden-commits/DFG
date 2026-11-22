"""The cutting pipeline: download → transcript → analyse → cut clips.

Runs in a background thread per job; progress/log lines land in SQLite so the
frontend can poll /api/jobs/{id}.
"""
from __future__ import annotations

import json
import re
import shutil
import subprocess
import threading
from pathlib import Path
from typing import Dict, List, Optional

from . import db
from .analyzer import analyze
from .config import DOWNLOAD_DIR, FONT_BOLD, FONT_DIR, FFMPEG, MEDIA_DIR
from .vtt import clamp_segments, parse_vtt, write_srt


class PipelineError(Exception):
    pass


def _set(job_id: str, stage: str, progress: int, message: str) -> None:
    db.update_job(job_id, stage=stage, progress=max(0, min(100, progress)),
                  message=message, status="running")


def _ffmpeg_ok() -> str:
    if not FFMPEG:
        raise PipelineError("ffmpeg не найден. Установи зависимости: pip install -r backend/requirements.txt")
    return FFMPEG


def _probe_duration(path: Path) -> float:
    proc = subprocess.run([_ffmpeg_ok(), "-hide_banner", "-i", str(path)],
                          capture_output=True, text=True)
    m = re.search(r"Duration:\s*(\d+):(\d+):(\d+)\.(\d+)", proc.stderr)
    if not m:
        return 0.0
    h, mnt, s, cs = m.groups()
    return int(h) * 3600 + int(mnt) * 60 + int(s) + int(cs) / 100.0


# ---------------------------------------------------------------- download

def _download_youtube(job_id: str, url: str, workdir: Path) -> tuple[Path, List[Dict], float, str]:
    try:
        import yt_dlp
    except ImportError as exc:
        raise PipelineError("yt-dlp не установлен: pip install yt-dlp") from exc

    state = {"last_pct": 0}

    def hook(d: dict) -> None:
        if d.get("status") == "downloading":
            total = d.get("total_bytes") or d.get("total_bytes_estimate") or 0
            done = d.get("downloaded_bytes", 0)
            if total:
                frac = done / total
                pct = 4 + int(frac * 30)
                if pct > state["last_pct"]:
                    state["last_pct"] = pct
                    _set(job_id, "download", pct, f"Скачиваю видео… {int(frac * 100)}%")
        elif d.get("status") == "finished":
            _set(job_id, "download", 35, "Видео скачано, ищу субтитры…")

    outtmpl = str(workdir / "source.%(ext)s")
    ydl_opts = {
        "format": "bestvideo[height<=1080][ext=mp4]+bestaudio[ext=m4a]/best[height<=1080][ext=mp4]/best[height<=1080]/best",
        "outtmpl": outtmpl,
        "noplaylist": True,
        "merge_output_format": "mp4",
        "writesubtitles": True,
        "writeautomaticsub": True,
        "subtitleslangs": ["ru", "en"],
        "subtitlesformat": "vtt",
        "quiet": True,
        "no_warnings": True,
        "progress_hooks": [hook],
        "socket_timeout": 30,
    }
    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=True)
    except Exception as exc:
        msg = str(exc)
        hint = ""
        if any(k in msg for k in ("urlopen", "timed out", "EOF", "Connection", "resolve", "network")):
            hint = " Похоже, сервер без доступа к YouTube — запусти сервис локально (README)."
        elif "Subtitles" in msg or "subtitle" in msg.lower():
            hint = " У видео нет субтитров — попробуй другое видео с авто-субтитрами."
        raise PipelineError(f"Не удалось скачать видео: {msg[:300]}.{hint}") from exc

    title = (info or {}).get("title", "YouTube видео")
    src = next((p for p in sorted(workdir.glob("source.*")) if p.suffix.lower() != ".vtt"), None)
    if src is None:
        raise PipelineError("Видео скачалось, но файл не найден — попробуй другую ссылку.")

    segments: List[Dict] = []
    for vtt in sorted(workdir.glob("source*.vtt")):
        parsed = parse_vtt(vtt.read_text(encoding="utf-8", errors="ignore"))
        lang = vtt.stem.split(".")[-1]
        db.log_job(job_id, f"Субтитры: {vtt.name} ({len(parsed)} реплик)")
        if lang == "ru" and parsed:
            segments = parsed
            break
        if parsed and not segments:
            segments = parsed
    if not segments:
        raise PipelineError(
            "У видео нет скачиваемых субтитров/авто-субтитров (ru/en). "
            "Попробуй видео с включёнными субтитрами или задай OPENAI_API_KEY/ANTHROPIC_API_KEY — "
            "тогда можно анализировать и аудио-описание (скоро).")
    duration = _probe_duration(src) or (segments[-1]["end"] if segments else 0)
    return src, segments, duration, title


# ---------------------------------------------------------------- cutting

_SUB_STYLE = ("FontName=DejaVu Sans Bold,FontSize=24,Bold=1,BorderStyle=3,Outline=1,Shadow=0,"
              "PrimaryColour=&H00FFFFFF,BackColour=&HB4000000,OutlineColour=&H00101010,"
              "MarginV=36,Alignment=2,Spacing=0")


def _subtitle_filter(srt_path: Path) -> str:
    style = _SUB_STYLE
    fontsdir = f":fontsdir='{FONT_DIR}'" if FONT_DIR else ""
    return f"subtitles='{srt_path.as_posix()}'{fontsdir}:original_size=1280x720:force_style='{style}'"


def _cut_clip(src: Path, start: float, end: float, out: Path, srt_path: Path) -> None:
    dur = max(0.1, end - start)
    vf = ("scale='min(iw,1920)':-2:force_original_aspect_ratio=decrease,"
          "scale=trunc(iw/2)*2:trunc(ih/2)*2," + _subtitle_filter(srt_path))
    proc = subprocess.run(
        [_ffmpeg_ok(), "-hide_banner", "-y", "-ss", f"{start:.2f}", "-i", str(src), "-t", f"{dur:.2f}",
         "-vf", vf,
         "-c:v", "libx264", "-crf", "20", "-preset", "veryfast", "-pix_fmt", "yuv420p",
         "-af", "loudnorm=I=-16:TP=-1.5:LRA=11",
         "-c:a", "aac", "-b:a", "160k", "-movflags", "+faststart", str(out)],
        capture_output=True, text=True)
    if proc.returncode != 0:
        raise PipelineError(f"ffmpeg не смог собрать клип: {proc.stderr[-350:]}")


def _thumbnail(src: Path, at: float, out: Path) -> None:
    subprocess.run([_ffmpeg_ok(), "-hide_banner", "-y", "-ss", f"{at:.2f}", "-i", str(src),
                    "-frames:v", "1", "-q:v", "4", "-vf", "scale=480:-2", str(out)],
                   capture_output=True, text=True)


# ---------------------------------------------------------------- main entry

def run_job(job_id: str, url: str, description: str, clip_count: int) -> None:
    job_dir = MEDIA_DIR / job_id
    job_dir.mkdir(parents=True, exist_ok=True)
    workdir = DOWNLOAD_DIR / job_id
    workdir.mkdir(parents=True, exist_ok=True)
    try:
        _set(job_id, "download", 2, "Готовлю видео…")

        if url.strip().lower() == "demo":
            from .demo import ensure_demo
            db.log_job(job_id, "Демо-режим: собираю синтетическое интервью…")
            src, segments, duration = ensure_demo()
            title = "Демо: синтетическое интервью (AI-голос)"
        else:
            src, segments, duration, title = _download_youtube(job_id, url.strip(), workdir)

        db.log_job(job_id, f"Источник: {title}")
        _set(job_id, "transcript", 38, f"Транскрипт готов: {len(segments)} строк")

        _set(job_id, "analyze", 44, "Ищу сильные моменты (логика монтажёра)…")
        result = analyze(segments, description or "", clip_count)
        clips = result["clips"]
        if not clips:
            raise PipelineError("Не удалось выбрать ни одного момента — видео слишком короткое?")
        analyzer = result.get("analyzer", "heuristic")
        db.log_job(job_id, f"Анализатор: {analyzer}. Выбрано моментов: {len(clips)}")
        if description.strip():
            db.log_job(job_id, ("Совпадение по запросу найдено 🎯" if result["matches_found"]
                                else "По запросу точных совпадений не нашёл — взял самые сильные моменты"))

        _set(job_id, "cut", 56, f"Нарезаю {len(clips)} клипов ≤30 сек…")
        total = len(clips)
        for i, clip in enumerate(clips, 1):
            start, end = clip["start"], clip["end"]
            clip_file = job_dir / f"clip_{i:02d}.mp4"
            thumb_file = job_dir / f"thumb_{i:02d}.jpg"
            srt_file = job_dir / f"clip_{i:02d}.srt"
            segs = clamp_segments(segments, start, end)
            srt_file.write_text(write_srt(segs, offset=0.0), encoding="utf-8")
            db.log_job(job_id, f"Клип {i}/{total}: {start:.1f}s–{end:.1f}s · {clip['theme_label']}")
            _cut_clip(src, start, end, clip_file, srt_file)
            _thumbnail(src, (start + end) / 2, thumb_file)
            clip["file"] = f"/media/{job_id}/{clip_file.name}"
            clip["thumb"] = f"/media/{job_id}/{thumb_file.name}"
            clip["srt"] = f"/media/{job_id}/{srt_file.name}"
            _set(job_id, "cut", 56 + int((i / total) * 38), f"Клип {i} из {total} готов")

        manifest = {
            "job_id": job_id,
            "url": url,
            "title": title,
            "description": description,
            "duration": round(duration, 1),
            "analyzer": analyzer,
            "matches_found": result["matches_found"],
            "clip_count": len(clips),
            "clips": clips,
        }
        (job_dir / "clips.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=1),
                                            encoding="utf-8")
        db.update_job(job_id, status="done", stage="done", progress=100,
                      message=f"Готово! Нарезок: {len(clips)} ✂️",
                      result_json=json.dumps(manifest, ensure_ascii=False))
        db.log_job(job_id, "Все нарезки собраны ✅")
    except PipelineError as exc:
        db.update_job(job_id, status="error", stage="error", message=str(exc), error=str(exc))
        db.log_job(job_id, f"Ошибка: {exc}")
    except Exception as exc:  # noqa: BLE001 — never leave a job hanging
        db.update_job(job_id, status="error", stage="error",
                      message=f"Неожиданная ошибка: {exc}", error=str(exc))
        db.log_job(job_id, f"Неожиданная ошибка: {exc!r}")
    finally:
        shutil.rmtree(workdir, ignore_errors=True)


def start_job_thread(job_id: str, url: str, description: str, clip_count: int) -> None:
    t = threading.Thread(target=run_job, args=(job_id, url, description, clip_count),
                         name=f"job-{job_id}", daemon=True)
    t.start()
