"""Moment analysis: finds the strongest 15–30s slices in an interview transcript.

Two engines:
  1) LLM engine   — OpenAI-compatible or Anthropic chat API, when a key is set
                     in the environment (OPENAI_API_KEY / ANTHROPIC_API_KEY).
  2) Heuristic    — built-in Russian/English emotion-lexicon engine. Always
                     available, works fully offline.

Both return the same structure and enforce the hard clip constraints:
5–10 clips (as requested), at most 30 seconds each, matched-marked moments
from the user's free-text description when present.
"""
from __future__ import annotations

import json
import os
import re
import math
import urllib.request
from typing import Dict, List, Optional, Tuple

MAX_CLIP = 30.0
MIN_CLIP = 4.0

THEMES: Dict[str, Dict] = {
    "motivation": {"emoji": "🔥", "label": "Мотивация",
                   "blurb": "Мотивационный разбор: дисциплина, работа и характер",
                   "color": "#ff9f1c"},
    "funny":      {"emoji": "😂", "label": "Смешной момент",
                   "blurb": "Смешной момент — идеален для короткой доставки",
                   "color": "#ffd60a"},
    "sad":        {"emoji": "😢", "label": "Грустный момент",
                   "blurb": "Тяжёлая, искренняя тема — трогает",
                   "color": "#4cc9f0"},
    "alpha":      {"emoji": "⚔️", "label": "Дерзкий момент",
                   "blurb": "Дерзкий момент уверенности и силы",
                   "color": "#f72585"},
    "calm":       {"emoji": "🧘", "label": "Философия",
                   "blurb": "Спокойная, философская мысль",
                   "color": "#9d8cff"},
    "love":       {"emoji": "❤️", "label": "Про близких",
                   "blurb": "Про близких и то, что важнее боя",
                   "color": "#ff5d8f"},
    "shock":      {"emoji": "😲", "label": "Неожиданный момент",
                   "blurb": "Неожиданный поворот — цепляет внимание",
                   "color": "#06d6a0"},
    "story":      {"emoji": "🎙️", "label": "Сильный момент",
                   "blurb": "Сильный момент из разговора",
                   "color": "#c0c8ff"},
}

# Weighted emotion lexicon (Russian-first, lower-cased, matched on substrings)
LEXICON: Dict[str, List[Tuple[str, float]]] = {
    "motivation": [("дисциплин", 2.0), ("трениров", 1.4), ("побед", 1.2), ("чемпио", 1.6),
                    ("характер", 1.6), ("поражение", 1.0), ("сильнее", 1.0), ("преодол", 1.8),
                    ("работу", 0.8), ("работать", 0.8), ("труд", 1.0), ("путь", 0.8),
                    ("не сда", 2.0), ("не сдал", 2.0), ("никто не спрашивал", 1.2),
                    ("так надо", 1.2), ("шест", 0.6), ("рост\u0301", 0.8)],
    "funny":      [("ха-ха", 2.2), ("хаха", 2.2), ("смех", 1.6), ("смешн", 2.2), ("прикол", 1.6),
                    ("шут", 1.4), ("забавно", 1.5), ("ржал", 2.0), ("хихи", 1.8), ("клоун", 1.2)],
    "sad":        [("умер", 2.6), ("умирал", 2.4), ("смерть", 2.6), ("ушел из жизни", 3.0),
                    ("ушёл из жизни", 3.0), ("не стало", 2.8), ("боль", 2.0), ("потер", 2.0),
                    ("утрат", 2.0), ("слез", 2.0), ("слёз", 2.0), ("тяжело", 1.2), ("тяжелую", 1.2),
                    ("тяжёлую", 1.2), ("горе", 2.2), ("скорб", 2.4), ("не могу описать", 2.2),
                    ("коронавирус", 1.6), ("57 лет", 1.2), ("5 июля", 1.0)],
    "alpha":      [("конор", 1.6), ("макгрегор", 1.6), ("нокаут", 1.6), ("удуш", 1.8),
                    ("непобедим", 2.2), ("слабак", 1.8), ("трус", 1.8), ("это был всем", 0.8),
                    ("пусть говорит", 2.0), ("шум проходит", 1.8), ("закрыли этот разговор", 2.4),
                    ("точный", 0.6), ("доказал", 1.4), ("ufc 229", 1.4), ("тибау", 1.0),
                    ("громче всех", 1.0), ("лучший", 0.8)],
    "calm":       [("аллах", 2.2), ("молитва", 2.0), ("намаз", 2.2), ("религ", 1.6), ("ислам", 2.0),
                    ("тишин", 2.2), ("покой", 2.0), ("спокой", 1.4), ("сердце", 1.2), ("вера", 1.8),
                    ("дух", 1.2), ("салам", 1.4), ("бог", 1.4), ("дом", 0.6)],
    "love":       [("отец", 1.6), ("папа", 1.6), ("мама", 1.6), ("мать", 1.4), ("семь", 1.4),
                    ("сын", 1.0), ("дочь", 1.0), ("родны", 1.4), ("близки", 1.6), ("семья", 1.6),
                    ("наследие", 2.0), ("ради которого", 2.0), ("сынок", 1.6)],
    "shock":      [("невероят", 2.0), ("шок", 2.0), ("никто не верил", 2.4), ("неожидан", 2.0),
                    ("сенсац", 2.2), ("внезап", 1.6), ("никто не ожидал", 2.2), ("в один момент", 1.2)],
    # generic high-attention signals (mapped onto story theme weight)
    "story":      [("помню", 1.2), ("это был", 0.8), ("никогда не забуду", 1.8),
                    ("правда", 0.8), ("честно", 0.8), ("скажу просто", 1.2)],
}

STOPWORDS = set("""и в во не что он на я с со как а то все она так его но да ты к у же вы за бы по только ее мне было вот от меня еще нет о из ему теперь когда даже ну вдруг ли если уже или ни быть был него до вас нибудь опять уж вам ведь там потом себя ничего ей мочь про обо без
the a an and or of to in on for with at by from as is are was were be this that it
""".split())


def normalize(text: str) -> str:
    t = text.lower().replace("ё", "е")
    t = re.sub(r"[^a-zа-я0-9\s-]+", " ", t)
    return re.sub(r"\s+", " ", t).strip()


def tokenize(text: str) -> List[str]:
    return [w for w in normalize(text).split() if len(w) > 2 and w not in STOPWORDS]


def _lev1(a: str, b: str) -> bool:
    """True when levenshtein(a,b) <= 1 (fast path for short words)."""
    if abs(len(a) - len(b)) > 1:
        return False
    if a == b:
        return True
    if len(a) == len(b):
        diff = sum(1 for x, y in zip(a, b) if x != y)
        return diff <= 1
    if len(a) > len(b):
        a, b = b, a
    i = j = edits = 0
    while i < len(a) and j < len(b):
        if a[i] == b[j]:
            i += 1; j += 1
        else:
            edits += 1; j += 1
            if edits > 1:
                return False
    return True


def _stem(word: str) -> str:
    w = word
    for _ in range(2):
        if len(w) > 4 and w and w[-1] in "аыияеёюуьо":
            w = w[:-1]
        else:
            break
    return w


def _token_grade(qt: str, wtokens: List[str], wnorm: str = "") -> float:
    if qt in wtokens:
        return 1.0
    qstem = _stem(qt)
    if qstem != qt and any(_stem(w) == qstem for w in wtokens):
        return 1.0
    best = 0.0
    for w in wtokens:
        if len(qt) >= 4 and len(w) >= 4 and _lev1(qt, w):
            best = max(best, 0.9)
        elif (len(qt) >= 5 and qt in w) or (len(w) >= 5 and w in qt):
            best = max(best, 0.85)
        elif qstem != qt and abs(len(_stem(w)) - len(qstem)) <= 1 and _lev1(qstem, _stem(w)):
            best = max(best, 0.9)
    return best


MATCH_MIN = 0.34
MAX_MATCHED = 3   # most marked clips per request: 1–3 strongest

# Semantic bridges for human-style asks (normalized lower-case, ё→е).
SYNONYM_GROUPS = [
    ["смерть", "умер", "умерла", "умерло", "умирал", "скончал", "кончина",
     "не стало", "ушел из жизни", "ушел из жизни", "похорон", "коронавирус",
     "утрат", "боль", "пропал"],
    ["отец", "отца", "папа", "батька", "родитель"],
    ["конор", "conor", "макгрегор", "mcgregor", "макрегор", "макгригор", "макгрэгор"],
    ["хабиб", "habib", "нурмагомедов"],
    ["тибау", "tibau", "глеасон", "gleason", "тибо"],
    ["борьба", "бороться", "борцов", "борца", "борьбе", "борьбы", "поролись"],
    ["удушающий", "удушил", "удушение", "треугольник"],
    ["ставка", "пари", "спор", "дерзал"],
    ["семья", "семьи", "семейный"],
]


def _groups_of(token: str) -> List[List[str]]:
    return [g for g in SYNONYM_GROUPS if token in g]


def _grade_token(qt: str, wtokens: List[str], wnorm: str) -> float:  # noqa: E501
    best = _token_grade(qt, wtokens, wnorm)
    for group in _groups_of(qt):
        for member in group:
            if member == qt:
                continue
            if " " in member:  # multi-word phrase member: search full text
                if member in wnorm:
                    best = max(best, 1.0)
                continue
            best = max(best, _token_grade(member, wtokens, wnorm) * 0.95)
        if best >= 0.95:
            break
    return best




class QueryMatcher:
    """IDF-weighted, synonym-aware matcher between the ask and a transcript."""

    def __init__(self, description: str, segments: List[Dict]):
        self.qtokens = tokenize(description or "")
        self.qnorm = normalize(description or "")
        self.df: Dict[str, int] = {}
        for seg in segments:
            for t in set(tokenize(seg["text"])):
                self.df[t] = self.df.get(t, 0) + 1
        n = max(1, len(segments))
        self.idf: Dict[str, float] = {}
        for qt in self.qtokens:
            members = [qt] + [m for g in _groups_of(qt) for m in g if m != qt and " " not in m]
            df_t = sum(self.df.get(m, 0) for m in set(members))
            # phrase members count a bit less deterministically
            self.idf[qt] = math.log((n + 1) / (df_t + 1)) + 1.0
        self.weight_sum = sum(self.idf.values()) or 1.0

    @property
    def active(self) -> bool:
        return bool(self.qtokens)

    def score(self, window_text: str) -> Tuple[float, int]:
        if not self.qtokens:
            return 0.0, 0
        wnorm = normalize(window_text)
        wtokens = wnorm.split()
        graded = 0.0
        hits = 0
        for qt in self.qtokens:
            g = _grade_token(qt, wtokens, wnorm)
            if g >= 0.8:
                hits += 1
            qstem = _stem(qt)
            occ = wnorm.count(qstem) if len(qstem) >= 3 else 1
            mult = 1.0 + 0.6 * min(max(occ, 1) - 1, 2)
            graded += g * self.idf.get(qt, 1.0) * mult
        score = graded / self.weight_sum
        if self.qnorm and self.qnorm in wnorm:
            score = min(1.0, score + 0.45)
        return score, hits

    def is_match(self, window_text: str) -> bool:
        score, hits = self.score(window_text)
        return hits >= 1 and score >= MATCH_MIN

def _line_scores(text: str) -> Tuple[Dict[str, float], float]:
    low = text.lower().replace("ё", "е")
    theme_scores: Dict[str, float] = {}
    total = 0.0
    for theme, words in LEXICON.items():
        s = 0.0
        for w, weight in words:
            cnt = low.count(w)
            if cnt:
                s += weight * cnt
        if s:
            theme_scores[theme] = s
            total += s * (0.9 if theme == "story" else 1.0)
    total += min(2.0, text.count("!") * 0.5)
    total += min(0.8, text.count("?") * 0.25)
    caps = sum(1 for w in text.split() if len(w) > 4 and w.isupper())
    total += min(1.5, caps * 0.75)
    return theme_scores, total


def _dominant_theme(texts: List[str]) -> str:
    agg: Dict[str, float] = {}
    for t in texts:
        ts, _ = _line_scores(t)
        for k, v in ts.items():
            agg[k] = agg.get(k, 0.0) + v
    if not agg:
        return "story"
    return max(agg.items(), key=lambda kv: kv[1])[0]


def _excerpt(text: str, limit: int = 96) -> str:
    t = re.sub(r"\s+", " ", text).strip()
    if len(t) <= limit:
        return t
    cut = t[:limit].rsplit(" ", 1)[0]
    return cut + "…"


def _overlap(a_start: float, a_end: float, b_start: float, b_end: float) -> float:
    inter = max(0.0, min(a_end, b_end) - max(a_start, b_start))
    union = max(a_end, b_end) - min(a_start, b_start)
    return inter / union if union > 0 else 0.0


def _pick_windows(segments: List[Dict], description: str, clip_count: int) -> List[Dict]:
    matcher = QueryMatcher(description, segments)
    qtokens = matcher.qtokens
    n = len(segments)
    if n == 0:
        return []

    line_info = []
    for seg in segments:
        ts, score = _line_scores(seg["text"])
        line_info.append({"seg": seg, "theme_scores": ts, "score": score})

    # candidate windows anchored on signal lines
    candidates: List[Dict] = []
    total_dur = segments[-1]["end"] - segments[0]["start"]

    def add_window(i0: int, i1: int, anchor_boost: float = 0.0):
        i0 = max(0, i0); i1 = min(n - 1, i1)
        if i1 < i0:
            return
        start = segments[i0]["start"]
        end = segments[i1]["end"]
        dur = end - start
        if dur > MAX_CLIP:
            # trim to MAX_CLIP around the densest part (anchor line)
            anchor_idx = max(range(i0, i1 + 1), key=lambda k: line_info[k]["score"])
            a_start, a_end = segments[anchor_idx]["start"], segments[anchor_idx]["end"]
            start = max(segments[i0]["start"], a_start - 4.0)
            end = min(start + MAX_CLIP, segments[-1]["end"])
            start = max(segments[0]["start"], end - MAX_CLIP)
            dur = end - start
        if dur < MIN_CLIP:
            end = min(segments[-1]["end"], start + MIN_CLIP)
            dur = end - start
        texts = [segments[k]["text"] for k in range(i0, i1 + 1) if segments[k]["end"] > start and segments[k]["start"] < end]
        if not texts:
            texts = [segments[k]["text"] for k in range(i0, i1 + 1)]
        window_text = " ".join(texts)
        mscore, match_hits = matcher.score(window_text)
        signal = sum(line_info[k]["score"] for k in range(i0, i1 + 1))
        if matcher.active and matcher.is_match(window_text):
            signal += 6.0 + mscore * 4.0
        elif matcher.active:
            signal += mscore * 2.0
        theme = _dominant_theme(texts)
        candidates.append({
            "start": round(start, 2), "end": round(end, 2),
            "signal": signal + anchor_boost, "match": mscore, "match_hits": match_hits,
            "theme": theme, "texts": texts,
        })

    anchor_idxs = [i for i, li in enumerate(line_info) if li["score"] >= 1.1]
    if matcher.active:
        for i, seg in enumerate(segments):
            if i not in anchor_idxs and matcher.is_match(seg["text"]):
                anchor_idxs.append(i)
    if not anchor_idxs:  # monotone speech: fall back to evenly spaced anchors
        step = max(1, math.floor(n / max(1, clip_count * 2)))
        anchor_idxs = list(range(0, n, step))

    seen_keys = set()
    for ai in anchor_idxs:
        # grow a window around the anchor up to ~26s
        i0, i1 = ai, ai
        dur = segments[ai]["end"] - segments[ai]["start"]
        while dur < 14.0:
            grew = False
            if i1 + 1 < n and segments[i1 + 1]["end"] - segments[i0]["start"] <= MAX_CLIP:
                i1 += 1; grew = True
            elif i0 - 1 >= 0 and segments[i1]["end"] - segments[i0 - 1]["start"] <= MAX_CLIP:
                i0 -= 1; grew = True
            elif i1 + 1 < n and segments[i1 + 1]["end"] - segments[i0]["start"] <= 26.0:
                i1 += 1; grew = True
            else:
                break
            if not grew:
                break
            dur = segments[i1]["end"] - segments[i0]["start"]
        key = (round(segments[i0]["start"], 1), round(segments[i1]["end"], 1))
        if key in seen_keys:
            continue
        seen_keys.add(key)
        add_window(i0, i1)

    # even coverage candidates as safety net
    if total_dur > 60:
        step = total_dur / (clip_count * 3)
        t = segments[0]["start"]
        while t < segments[-1]["end"]:
            i0 = next((i for i, s in enumerate(segments) if s["end"] > t), 0)
            j = i0
            while j + 1 < n and segments[j + 1]["end"] - segments[i0]["start"] <= 22.0:
                j += 1
            add_window(i0, j, anchor_boost=0.0)
            t += step

    candidates.sort(key=lambda c: c["signal"], reverse=True)

    picked: List[Dict] = []
    for cand in candidates:
        if len(picked) >= clip_count:
            break
        if any(_overlap(cand["start"], cand["end"], p["start"], p["end"]) > 0.30 for p in picked):
            continue
        picked.append(cand)

    # if nothing matched the request yet, give the best-matching window a hard slot
    if qtokens and picked:
        best = max(candidates, key=lambda c: c["match"], default=None)
        if best and best["match"] >= 0.5 and max(p["match"] for p in picked) < 0.5:
            replaced = min(picked, key=lambda p: p["signal"])
            if all(_overlap(best["start"], best["end"], p["start"], p["end"]) <= 0.30
                   for p in picked if p is not replaced):
                picked[picked.index(replaced)] = best

    picked.sort(key=lambda p: p["start"])
    return picked


def _finalize_clips(picked: List[Dict], description: str) -> Dict:
    has_query = bool(tokenize(description or ""))
    clips = []
    matches_found = False
    order = sorted(range(len(picked)),
                   key=lambda i: (picked[i].get("match", 0), -(picked[i]["end"] - picked[i]["start"])),
                   reverse=True)
    allowed = set()
    if has_query:
        for i in order:
            if len(allowed) >= MAX_MATCHED:
                break
            c = picked[i]
            if c.get("match_hits", 0) >= 1 and c["match"] >= MATCH_MIN:
                allowed.add(i)

    for idx, cand in enumerate(picked, 1):
        theme_key = cand["theme"] if cand["theme"] in THEMES else "story"
        meta = THEMES[theme_key]
        matched = (idx - 1) in allowed
        matches_found = matches_found or matched
        first = cand["texts"][0] if cand["texts"] else ""
        last = cand["texts"][-1] if cand["texts"] else ""
        body = _excerpt(" ".join(cand["texts"]), 150)
        title = _excerpt(first, 58)
        desc_parts = [meta["blurb"] + "."]
        if matched:
            desc_parts.append(f"Попадает под твой запрос «{description.strip()}».")
        desc_parts.append(f"О чём речь: {body}")
        clips.append({
            "index": idx,
            "start": round(cand["start"], 2),
            "end": round(cand["end"], 2),
            "duration": round(cand["end"] - cand["start"], 2),
            "theme": theme_key,
            "emoji": meta["emoji"],
            "theme_label": meta["label"],
            "theme_color": meta["color"],
            "title": title,
            "description": " ".join(desc_parts),
            "matches_request": matched,
            "score": round(cand.get("signal", 0.0), 2),
        })
    return {"clips": clips, "matches_found": matches_found}


def analyze_heuristic(segments: List[Dict], description: str, clip_count: int) -> Dict:
    picked = _pick_windows(segments, description or "", clip_count)
    result = _finalize_clips(picked, description or "")
    result["analyzer"] = "heuristic"
    return result


# ---------------------------------------------------------------- LLM engine

_LLM_SYSTEM = (
    "Ты — профессиональный видеомонтажёр коротких вертикальных и квадратных нарезок "
    "из интервью (бойцы, спортсмены, публичные люди). Твоя задача — выбрать самые "
    "сильные моменты речи и вернуть СТРОГО JSON без пояснений."
)

_LLM_USER_TMPL = """Вот транскрипт видео с таймкодами (формат [start-end] секунды):

{transcript}

Задача пользователя по описанию: {description}

Выбери ровно {clip_count} лучших моментов. Требования:
- каждый клип НЕ ДЛИННЕЕ 30 секунд, не короче 5 секунд;
- начало и конец клипа совпадают с естественными границами фраз;
- приоритет — эмоционально сильные, запоминающиеся куски: исповедь, шутка, "дерзкая" фраза, боль, гордость, спор, поворот истории;
- если описание пользователя непустое — обязательно найди момент, который ему соответствует или максимально близок, и пометь его matches_request=true. Если такого момента в видео нет — НЕ выдумывай: верни matches_request=false у всех и выбирай то, что считаешь сильным;
- тематика (theme) строго из списка: motivation, funny, sad, alpha, calm, love, shock, story;
- title — до 58 символов, description — 1-2 коротких предложения на русском, что происходит и почему это цепляет;
- ответ — ТОЛЬКО JSON: {{"clips":[{{"start":0.0,"end":12.0,"theme":"sad","title":"...","description":"...","matches_request":false}}]}}
"""


def _http_json(url: str, payload: dict, headers: dict, timeout: int = 75) -> dict:
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(url, data=data, method="POST",
                                 headers={"Content-Type": "application/json", **headers})
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        return json.loads(resp.read().decode("utf-8"))


def _extract_json(text: str) -> Optional[dict]:
    try:
        return json.loads(text)
    except Exception:
        pass
    start = text.find("{")
    end = text.rfind("}")
    if start != -1 and end > start:
        try:
            return json.loads(text[start:end + 1])
        except Exception:
            return None
    return None


def _llm_complete(prompt: str) -> Optional[str]:
    openai_key = os.environ.get("OPENAI_API_KEY")
    anthropic_key = os.environ.get("ANTHROPIC_API_KEY")
    if openai_key:
        base = os.environ.get("OPENAI_BASE_URL", "https://api.openai.com/v1").rstrip("/")
        model = os.environ.get("OPENAI_MODEL", "gpt-4o-mini")
        out = _http_json(f"{base}/chat/completions",
                         {"model": model,
                          "messages": [{"role": "system", "content": _LLM_SYSTEM},
                                       {"role": "user", "content": prompt}],
                          "temperature": 0.4, "max_tokens": 3000},
                         {"Authorization": f"Bearer {openai_key}"})
        return out["choices"][0]["message"]["content"]
    if anthropic_key:
        model = os.environ.get("ANTHROPIC_MODEL", "claude-3-5-haiku-latest")
        out = _http_json("https://api.anthropic.com/v1/messages",
                         {"model": model, "max_tokens": 3000, "system": _LLM_SYSTEM,
                          "messages": [{"role": "user", "content": prompt}]},
                         {"x-api-key": anthropic_key, "anthropic-version": "2023-06-01"})
        return "".join(block.get("text", "") for block in out.get("content", []))
    return None


def analyze_llm(segments: List[Dict], description: str, clip_count: int) -> Optional[Dict]:
    from .vtt import segments_to_plain
    transcript = segments_to_plain(segments, max_chars=28000)
    prompt = _LLM_USER_TMPL.format(transcript=transcript,
                                   description=description.strip() or "не задано",
                                   clip_count=clip_count)
    try:
        raw = _llm_complete(prompt)
    except Exception:
        return None
    if not raw:
        return None
    data = _extract_json(raw)
    if not data or not isinstance(data.get("clips"), list):
        return None

    matcher = QueryMatcher(description or "", segments)
    dur_total = segments[-1]["end"] if segments else 0.0
    picked = []
    for item in data["clips"][: clip_count * 2]:
        try:
            start, end = float(item["start"]), float(item["end"])
        except (KeyError, TypeError, ValueError):
            continue
        start = max(0.0, start)
        end = min(end, dur_total if dur_total else end)
        if end - start > MAX_CLIP:
            end = start + MAX_CLIP
        if end - start < MIN_CLIP:
            continue
        texts = [s["text"] for s in segments
                 if s["end"] > start and s["start"] < end]
        window_text = " ".join(texts)
        theme = item.get("theme") if item.get("theme") in THEMES else _dominant_theme(texts)
        mscore, mhits = matcher.score(window_text)
        match = 1.0 if (matcher.active and item.get("matches_request")) else mscore
        picked.append({"start": start, "end": end, "signal": match * 10 + 5,
                       "match": match, "match_hits": mhits, "theme": theme,
                       "texts": texts or [str(item.get("description", ""))],
                       "title": item.get("title"), "description": item.get("description")})

    # de-overlap, keep strongest first
    picked.sort(key=lambda c: c["signal"], reverse=True)
    kept: List[Dict] = []
    for cand in picked:
        if len(kept) >= clip_count:
            break
        if any(_overlap(cand["start"], cand["end"], p["start"], p["end"]) > 0.30 for p in kept):
            continue
        kept.append(cand)
    kept.sort(key=lambda p: p["start"])
    if len(kept) < 3:
        return None

    result = _finalize_clips(kept, description or "")
    # prefer the LLM's own title/description when present
    for clip, cand in zip(result["clips"], kept):
        if cand.get("title"):
            clip["title"] = _excerpt(str(cand["title"]), 58)
        if cand.get("description"):
            extra = f" Попадает под твой запрос «{(description or '').strip()}»." if clip["matches_request"] else ""
            clip["description"] = str(cand["description"]).strip() + extra
    result["analyzer"] = "llm"
    return result


def analyze(segments: List[Dict], description: str, clip_count: int) -> Dict:
    clip_count = max(1, min(10, int(clip_count or 8)))
    if os.environ.get("OPENAI_API_KEY") or os.environ.get("ANTHROPIC_API_KEY"):
        llm = analyze_llm(segments, description or "", clip_count)
        if llm:
            llm["matches_found"] = llm.get("matches_found", False)
            return llm
    return analyze_heuristic(segments, description or "", clip_count)
