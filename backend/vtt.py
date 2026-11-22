"""Parsing and writing of WebVTT / SRT subtitles, plain-text formatting."""
from __future__ import annotations

import re
from typing import List, Dict, Tuple

_TS_RE = re.compile(r"(\d{1,2}):(\d{2}):(\d{2})[.,](\d{1,3})")


def parse_ts(ts: str) -> float:
    m = _TS_RE.search(ts.strip())
    if not m:
        raise ValueError(f"bad timestamp: {ts!r}")
    h, mnt, s, ms = m.groups()
    ms = (ms + "000")[:3]
    return int(h) * 3600 + int(mnt) * 60 + int(s) + int(ms) / 1000.0


def fmt_ts_srt(t: float) -> str:
    t = max(0.0, t)
    h = int(t // 3600); t -= h * 3600
    m = int(t // 60); t -= m * 60
    s = int(t); ms = int(round((t - s) * 1000))
    if ms == 1000:
        ms = 0; s += 1
    if s == 60:
        s = 0; m += 1
    if m == 60:
        m = 0; h += 1
    return f"{h:02d}:{m:02d}:{s:02d},{ms:03d}"


_TAG_RE = re.compile(r"<[^>]+>")


def parse_vtt(text: str) -> List[Dict]:
    """Parse a WebVTT (or SRT-ish) subtitle file into merged segments.

    Returns a list of {start, end, text} with overlapping/duplicate rolling
    captions de-duplicated, sorted by start time.
    """
    text = text.replace("\ufeff", "")
    blocks = re.split(r"\n\s*\n", text.strip())
    raw: List[Dict] = []
    for block in blocks:
        lines = [ln.rstrip() for ln in block.strip().splitlines() if ln.strip()]
        if not lines:
            continue
        # find the timing line
        t_line_idx = -1
        for i, ln in enumerate(lines):
            if "-->" in ln:
                t_line_idx = i
                break
        if t_line_idx == -1:
            continue
        m = re.match(r"^([\d:.,]+)\s*-->\s*([\d:.,]+)", lines[t_line_idx].strip())
        if not m:
            continue
        try:
            start, end = parse_ts(m.group(1)), parse_ts(m.group(2))
        except ValueError:
            continue
        body = lines[t_line_idx + 1:]
        txt = " ".join(_TAG_RE.sub("", ln).strip() for ln in body).strip()
        txt = re.sub(r"\s+", " ", txt)
        if not txt:
            continue
        raw.append({"start": start, "end": max(end, start + 0.4), "text": txt})

    raw.sort(key=lambda s: (s["start"], s["end"]))
    # De-duplicate rolling auto-captions (same text repeated while line scrolls)
    merged: List[Dict] = []
    for seg in raw:
        if merged:
            prev = merged[-1]
            if seg["text"] == prev["text"] and seg["start"] < prev["end"] + 0.5:
                prev["end"] = max(prev["end"], seg["end"])
                continue
            # auto-subs often grow one word at a time: "я" -> "я не" -> ...
            if seg["text"].startswith(prev["text"] + " ") and seg["start"] < prev["end"] + 0.8:
                prev["text"] = seg["text"]
                prev["end"] = max(prev["end"], seg["end"])
                continue
        merged.append(dict(seg))

    # Drop tiny stutter segments fully contained in previous line
    out: List[Dict] = []
    for seg in merged:
        if out and seg["start"] >= out[-1]["start"] and seg["end"] <= out[-1]["end"] + 0.05 and seg["text"] in out[-1]["text"]:
            continue
        out.append(seg)
    return out


def _chunk_words(words: List[str], width: int, max_lines: int = 2) -> List[str]:
    """Group words into chunks of at most max_lines * width chars."""
    chunks: List[str] = []
    cur = ""
    budget = width * max_lines
    for w in words:
        cand = (cur + " " + w).strip()
        if len(cand) > budget and cur:
            chunks.append(cur)
            cur = w
        else:
            cur = cand
    if cur:
        chunks.append(cur)
    return chunks


def write_srt(segments: List[Dict], offset: float = 0.0) -> str:
    """Write SRT cue list; `offset` is subtracted from absolute times.

    Segments longer than two wrapped lines are split into consecutive cues
    (time divided proportionally to text length) so no words are ever lost.
    """
    cues: List[Tuple[float, float, str]] = []
    for seg in segments:
        start = max(0.0, seg["start"] - offset)
        end = max(start + 0.4, seg["end"] - offset)
        text = re.sub(r"\s+", " ", seg["text"]).strip()
        if not text:
            continue
        chunks = _chunk_words(text.split(), 42, 2)
        total = sum(len(c) for c in chunks) or 1
        t = start
        for j, chunk in enumerate(chunks):
            share = (end - start) * (len(chunk) / total)
            c_end = end if j == len(chunks) - 1 else t + share
            cues.append((t, c_end, wrap_cue(chunk, 42)))
            t = c_end

    lines: List[str] = []
    for i, (a, b, body) in enumerate(cues, 1):
        lines.append(f"{i}\n{fmt_ts_srt(a)} --> {fmt_ts_srt(b)}\n{body}\n")
    return "\n".join(lines)


def wrap_cue(text: str, width: int = 42) -> str:
    words = text.split()
    lines: List[str] = []
    cur = ""
    for w in words:
        cand = (cur + " " + w).strip()
        if len(cand) > width and cur:
            lines.append(cur)
            cur = w
        else:
            cur = cand
    if cur:
        lines.append(cur)
    return "\n".join(lines)


def clamp_segments(segments: List[Dict], start: float, end: float) -> List[Dict]:
    out = []
    for seg in segments:
        if seg["end"] <= start or seg["start"] >= end:
            continue
        out.append({
            "start": max(seg["start"], start) - start,
            "end": min(seg["end"], end) - start,
            "text": seg["text"],
        })
    return out


def segments_to_plain(segments: List[Dict], max_chars: int = 24000) -> str:
    parts = []
    total = 0
    for seg in segments:
        line = f"[{seg['start']:.1f}-{seg['end']:.1f}] {seg['text']}"
        total += len(line) + 1
        if total > max_chars:
            parts.append("... (транскрипт обрезан)")
            break
        parts.append(line)
    return "\n".join(parts)
