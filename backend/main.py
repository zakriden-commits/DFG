"""NAREZKA SASNOGO — API + static frontend."""
from __future__ import annotations

import re
import uuid
from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field

from . import db
from .config import MEDIA_DIR, STATIC_DIR
from .pipeline import start_job_thread

app = FastAPI(title="NAREZKA SASNOGO", docs_url="/api/docs")

YOUTUBE_RE = re.compile(
    r"^(https?://)?(www\.|m\.)?(youtube\.com/(watch\?[^#]*v=|shorts/|live/|embed/|v/)|youtu\.be/)[A-Za-z0-9_\-]{6,}",
    re.IGNORECASE)


class JobRequest(BaseModel):
    url: str = Field(..., min_length=3, max_length=500)
    description: str = Field("", max_length=300)
    clip_count: int = Field(8, ge=5, le=10)


@app.get("/api/health")
def health() -> dict:
    return {"status": "ok", "service": "NAREZKA SASNOGO", "version": "1.0.0"}


@app.post("/api/jobs", status_code=201)
def create_job(req: JobRequest) -> dict:
    url = req.url.strip()
    is_demo = url.lower() == "demo"
    if not is_demo and not YOUTUBE_RE.match(url):
        raise HTTPException(status_code=422,
                            detail="Нужна ссылка на YouTube (youtube.com/watch…, youtu.be/… или /shorts/…).")
    job_id = uuid.uuid4().hex[:12]
    db.create_job(job_id, url, req.description.strip(), req.clip_count)
    start_job_thread(job_id, url, req.description.strip(), req.clip_count)
    return {"job_id": job_id}


@app.get("/api/jobs/{job_id}")
def get_job(job_id: str) -> dict:
    job = db.get_job(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Задание не найдено")
    job.pop("log", None)
    return job


@app.get("/api/jobs")
def recent_jobs() -> dict:
    return {"jobs": db.list_jobs(12)}


# static media (produced clips) and frontend assets
MEDIA_DIR.mkdir(parents=True, exist_ok=True)
app.mount("/media", StaticFiles(directory=str(MEDIA_DIR)), name="media")
app.mount("/assets", StaticFiles(directory=str(STATIC_DIR / "assets")), name="assets")


@app.get("/")
def index() -> FileResponse:
    return FileResponse(STATIC_DIR / "index.html", media_type="text/html; charset=utf-8")


@app.get("/{path:path}")
def static_fallback(path: str) -> FileResponse:
    candidate = (STATIC_DIR / path).resolve()
    if not str(candidate).startswith(str(STATIC_DIR.resolve())) or not candidate.is_file():
        raise HTTPException(status_code=404, detail="Not found")
    media = "text/css; charset=utf-8" if candidate.suffix == ".css" else (
        "application/javascript; charset=utf-8" if candidate.suffix == ".js" else None)
    return FileResponse(candidate, media_type=media) if media else FileResponse(candidate)
