"""Tiny SQLite job store (threads share it; writes serialised with a lock)."""
from __future__ import annotations

import json
import sqlite3
import threading
import time
from typing import Any, Dict, List, Optional

from .config import DB_PATH

_lock = threading.Lock()
_conn = sqlite3.connect(DB_PATH, check_same_thread=False)
_conn.row_factory = sqlite3.Row

_conn.execute("""
CREATE TABLE IF NOT EXISTS jobs (
    id TEXT PRIMARY KEY,
    url TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    clip_count INTEGER NOT NULL DEFAULT 8,
    status TEXT NOT NULL DEFAULT 'queued',
    stage TEXT NOT NULL DEFAULT 'queued',
    progress INTEGER NOT NULL DEFAULT 0,
    message TEXT NOT NULL DEFAULT '',
    log TEXT NOT NULL DEFAULT '',
    result_json TEXT,
    error TEXT,
    created_at REAL NOT NULL,
    updated_at REAL NOT NULL
)""")
_conn.commit()


def create_job(job_id: str, url: str, description: str, clip_count: int) -> None:
    now = time.time()
    with _lock:
        _conn.execute(
            "INSERT INTO jobs (id, url, description, clip_count, status, stage, progress,"
            " message, log, created_at, updated_at) VALUES (?,?,?,?,'queued','queued',0,?,?,?,?)",
            (job_id, url, description, clip_count, "В очереди…", "Задание принято\n", now, now),
        )
        _conn.commit()


def update_job(job_id: str, **fields: Any) -> None:
    if not fields:
        return
    fields["updated_at"] = time.time()
    cols = ", ".join(f"{k} = ?" for k in fields)
    with _lock:
        _conn.execute(f"UPDATE jobs SET {cols} WHERE id = ?", (*fields.values(), job_id))
        _conn.commit()


def log_job(job_id: str, line: str) -> None:
    with _lock:
        row = _conn.execute("SELECT log FROM jobs WHERE id = ?", (job_id,)).fetchone()
        log = (row["log"] if row else "") + f"[{time.strftime('%H:%M:%S')}] {line}\n"
        # keep the log bounded
        if len(log) > 12000:
            log = "…\n" + log[-11000:]
        _conn.execute("UPDATE jobs SET log = ?, updated_at = ? WHERE id = ?",
                      (log, time.time(), job_id))
        _conn.commit()


def get_job(job_id: str) -> Optional[Dict]:
    with _lock:
        row = _conn.execute("SELECT * FROM jobs WHERE id = ?", (job_id,)).fetchone()
    if not row:
        return None
    job = dict(row)
    job["result"] = json.loads(job.pop("result_json")) if job.get("result_json") else None
    job.pop("result_json", None)
    job["log_lines"] = [l for l in (job.get("log") or "").splitlines() if l.strip()]
    return job


def list_jobs(limit: int = 12) -> List[Dict]:
    with _lock:
        rows = _conn.execute(
            "SELECT id, url, description, status, stage, progress, message, created_at,"
            " result_json FROM jobs ORDER BY created_at DESC LIMIT ?", (limit,)).fetchall()
    out = []
    for r in rows:
        d = dict(r)
        res = json.loads(d.pop("result_json")) if d.get("result_json") else None
        d["clip_count"] = len(res["clips"]) if res else 0
        d["matches_found"] = bool(res.get("matches_found")) if res else False
        out.append(d)
    return out
