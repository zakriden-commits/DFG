/* NAREZKA SASNOGO — front-end logic */
"use strict";

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

const STAGES = [
  { key: "download", icon: "⬇️", label: "Скачиваем" },
  { key: "transcript", icon: "📝", label: "Субтитры" },
  { key: "analyze", icon: "🧠", label: "Анализ" },
  { key: "cut", icon: "✂️", label: "Нарезка" },
  { key: "done", icon: "✨", label: "Готово" },
];
const STAGE_INDEX = { queued: 0, download: 0, transcript: 1, analyze: 2, cut: 3, done: 4, error: -1 };
const THEME_COLORS = {
  motivation: "#ff9f1c", funny: "#ffd60a", sad: "#4cc9f0", alpha: "#f72585",
  calm: "#9d8cff", love: "#ff5d8f", shock: "#06d6a0", story: "#c0c8ff",
};

const els = {
  form: $("#jobForm"),
  url: $("#urlInput"),
  clearUrl: $("#clearUrl"),
  desc: $("#descriptionInput"),
  goBtn: $("#goBtn"),
  demoBtn: $("#demoBtn"),
  chips: $("#exampleChips"),
  countPicker: $("#countPicker"),
  progressPanel: $("#progressPanel"),
  stageList: $("#stageList"),
  progressFill: $("#progressFill"),
  progressMessage: $("#progressMessage"),
  progressPct: $("#progressPct"),
  console: $("#logConsole"),
  cancelHintBtn: $("#cancelHintBtn"),
  errorBox: $("#errorBox"),
  errorText: $("#errorText"),
  retryBtn: $("#retryBtn"),
  resultsSection: $("#resultsSection"),
  resultsTitle: $("#resultsTitle"),
  resultsMeta: $("#resultsMeta"),
  matchBanner: $("#matchBanner"),
  filterRow: $("#filterRow"),
  clipsGrid: $("#clipsGrid"),
  emptyFilter: $("#emptyFilter"),
  newRequestBtn: $("#newRequestBtn"),
  recentBlock: $("#recentBlock"),
  recentList: $("#recentList"),
};

const state = {
  clipCount: 8,
  pollTimer: null,
  currentClips: [],
  currentFilter: "all",
  lastJobId: null,
};

const escapeHtml = (s) => String(s ?? "").replace(/[&<>"']/g, (ch) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
}[ch]));

const fmtDuration = (sec) => {
  const s = Math.max(0, Math.round(sec || 0));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
};

/* ───────── form controls ───────── */
$$("button", els.countPicker).forEach((btn) => {
  btn.addEventListener("click", () => {
    state.clipCount = Number(btn.dataset.count);
    $$("button", els.countPicker).forEach((b) => b.classList.toggle("is-active", b === btn));
  });
});

$$(".chip", els.chips).forEach((chip) => {
  chip.addEventListener("click", () => {
    els.desc.value = chip.dataset.q || chip.textContent.trim();
    els.desc.focus();
  });
});

els.clearUrl.addEventListener("click", () => { els.url.value = ""; els.url.focus(); });

/* ───────── stages UI ───────── */
function renderStageList(activeIdx) {
  els.stageList.innerHTML = STAGES.map((s, i) => {
    let cls = "stage";
    if (activeIdx >= 0) {
      if (i < activeIdx) cls += " is-done";
      else if (i === activeIdx) cls += " is-active";
    }
    const icon = activeIdx >= 0 && i < activeIdx ? "✅" : s.icon;
    return `<div class="${cls}"><div class="stage__icon">${icon}</div><div>${escapeHtml(s.label)}</div></div>`;
  }).join("");
}

function resetPanels() {
  els.errorBox.hidden = true;
  els.resultsSection.hidden = true;
  clearInterval(state.pollTimer);
}

function setBusy(busy) {
  els.goBtn.disabled = busy;
  els.demoBtn.disabled = busy;
  els.goBtn.querySelector(".btn--go__label").textContent = busy ? "РЕЖЕМ…" : "СОЗДАТЬ НАРЕЗКИ";
}

/* ───────── submit & polling ───────── */
async function submitJob(url, description) {
  resetPanels();
  els.progressPanel.hidden = false;
  els.console.textContent = "";
  els.progressFill.style.width = "2%";
  els.progressPct.textContent = "0%";
  els.progressMessage.textContent = "Отправляю задание…";
  els.cancelHintBtn.hidden = false;
  renderStageList(0);
  setBusy(true);

  let jobId = null;
  try {
    const resp = await fetch("/api/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url, description, clip_count: state.clipCount }),
    });
    const data = await resp.json().catch(() => ({}));
    if (!resp.ok) throw new Error(data.detail || `Ошибка сервера (${resp.status})`);
    jobId = data.job_id;
    state.lastJobId = jobId;
  } catch (err) {
    showError(err.message || String(err));
    return;
  }
  pollJob(jobId);
}

function pollJob(jobId) {
  clearInterval(state.pollTimer);
  const tick = async () => {
    let job;
    try {
      const resp = await fetch(`/api/jobs/${encodeURIComponent(jobId)}`);
      job = await resp.json();
      if (!resp.ok) throw new Error(job.detail || "Задание потерялось");
    } catch (err) {
      showError(err.message || String(err));
      return;
    }
    const idx = STAGE_INDEX[job.stage] ?? 0;
    renderStageList(job.status === "done" ? 5 : idx);
    els.progressFill.style.width = `${job.progress || 0}%`;
    els.progressPct.textContent = `${job.progress || 0}%`;
    els.progressMessage.textContent = job.message || "…";
    if (Array.isArray(job.log_lines)) {
      els.console.textContent = job.log_lines.join("\n");
      els.console.scrollTop = els.console.scrollHeight;
    }

    if (job.status === "done" && job.result) {
      clearInterval(state.pollTimer);
      setBusy(false);
      els.progressPanel.hidden = true;
      renderResults(job.result);
      refreshRecent();
    } else if (job.status === "error") {
      clearInterval(state.pollTimer);
      setBusy(false);
      showError(job.message || job.error || "Неизвестная ошибка");
    }
  };
  state.pollTimer = setInterval(tick, 800);
  tick();
}

function showError(message) {
  clearInterval(state.pollTimer);
  setBusy(false);
  els.progressPanel.hidden = true;
  els.errorBox.hidden = false;
  els.errorText.textContent = message;
}

els.form.addEventListener("submit", (e) => {
  e.preventDefault();
  const url = els.url.value.trim();
  if (!url) { els.url.focus(); return; }
  submitJob(url, els.desc.value.trim());
});

els.demoBtn.addEventListener("click", () => {
  submitJob("demo", els.desc.value.trim());
});

els.retryBtn.addEventListener("click", () => {
  els.errorBox.hidden = true;
  els.url.focus();
});

els.newRequestBtn.addEventListener("click", () => {
  els.resultsSection.hidden = true;
  window.scrollTo({ top: $("#tool").offsetTop - 20, behavior: "smooth" });
  els.url.focus();
});

/* ───────── results rendering ───────── */
function clipCardHtml(clip, i) {
  const themeColor = THEME_COLORS[clip.theme] || THEME_COLORS.story;
  const target = clip.matches_request;
  return `
    <article class="clip-card ${target ? "clip-card--target" : ""}" data-theme="${escapeHtml(clip.theme)}" data-match="${target ? "1" : "0"}">
      <div class="clip-card__media">
        <video controls preload="none" poster="${escapeHtml(clip.thumb)}" src="${escapeHtml(clip.file)}"></video>
        ${target ? '<span class="clip-card__target">🎯 ПО ЗАПРОСУ</span>' : ""}
        <span class="clip-card__dur">${fmtDuration(clip.duration)}</span>
      </div>
      <div class="clip-card__body">
        <div class="clip-card__top">
          <span class="theme-badge" style="background:${themeColor}">${escapeHtml(clip.emoji)} ${escapeHtml(clip.theme_label)}</span>
          <span class="clip-num">#${i + 1}</span>
        </div>
        <h4 class="clip-card__title">${escapeHtml(clip.title)}</h4>
        <p class="clip-card__desc">${escapeHtml(clip.description)}</p>
        <div class="clip-card__actions">
          <a class="clip-btn clip-btn--primary" href="${escapeHtml(clip.file)}" download="nareska-${i + 1}.mp4">⬇️ Скачать</a>
          ${clip.srt ? `<a class="clip-btn" href="${escapeHtml(clip.srt)}" download="nareska-${i + 1}.srt">💬 .srt</a>` : ""}
        </div>
      </div>
    </article>`;
}

function renderResults(result) {
  state.currentClips = result.clips || [];
  state.currentFilter = "all";

  els.resultsSection.hidden = false;
  els.resultsTitle.textContent = result.title || "Нарезки готовы";
  const analyzer = result.analyzer === "llm" ? "AI-модель" : "офлайн-анализатор";
  els.resultsMeta.textContent =
    `${result.clip_count} нарезок · источник: ${result.title || result.url} · движок: ${analyzer}`;

  // banner about the user's described moment
  const desc = (result.description || "").trim();
  if (desc) {
    els.matchBanner.hidden = false;
    if (result.matches_found) {
      const n = state.currentClips.filter((c) => c.matches_request).length;
      els.matchBanner.className = "match-banner match-banner--hit";
      els.matchBanner.innerHTML = `🎯 По твоему запросу «<b>${escapeHtml(desc)}</b>» найдено моментов: <b>${n}</b> — они отмечены радужной рамкой.`;
    } else {
      els.matchBanner.className = "match-banner match-banner--miss";
      els.matchBanner.innerHTML = `🤔 Точного момента «<b>${escapeHtml(desc)}</b>» в видео не нашлось — нарезал то, что считаю сильнейшим. Попробуй другое описание или другое видео.`;
    }
  } else {
    els.matchBanner.hidden = true;
  }

  $$(".filter", els.filterRow).forEach((b) => b.classList.toggle("is-active", b.dataset.filter === "all"));
  applyFilter("all");
  els.resultsSection.scrollIntoView({ behavior: "smooth", block: "start" });
}

function applyFilter(filter) {
  state.currentFilter = filter;
  const match = (c) => filter === "all" || (filter === "match" ? c.matches_request : c.theme === filter);
  const shown = state.currentClips.filter(match);
  els.clipsGrid.innerHTML = shown.map((c, i) => clipCardHtml(c, state.currentClips.indexOf(c))).join("");
  els.emptyFilter.hidden = shown.length !== 0;
  $$(".filter", els.filterRow).forEach((b) => b.classList.toggle("is-active", b.dataset.filter === filter));
}

els.filterRow.addEventListener("click", (e) => {
  const btn = e.target.closest(".filter");
  if (btn) applyFilter(btn.dataset.filter);
});

/* ───────── recent jobs ───────── */
async function refreshRecent() {
  try {
    const resp = await fetch("/api/jobs");
    const data = await resp.json();
    const jobs = (data.jobs || []).filter((j) => j.status === "done");
    if (!jobs.length) { els.recentBlock.hidden = true; return; }
    els.recentBlock.hidden = false;
    els.recentList.innerHTML = jobs.slice(0, 8).map((j) => {
      const urlLabel = j.url === "demo" ? "Демо: синтетическое интервью" : j.url.replace(/^https?:\/\/(www\.)?/, "");
      const desc = j.description ? `«${j.description.slice(0, 60)}${j.description.length > 60 ? "…" : ""}» · ` : "";
      return `<button class="recent-chip" data-job="${escapeHtml(j.id)}">
        <span class="recent-chip__url">${escapeHtml(urlLabel)}</span>
        <span class="recent-chip__meta">${escapeHtml(desc)}${j.clip_count} нарезок${j.matches_found ? " · 🎯 есть совпадение" : ""}</span>
      </button>`;
    }).join("");
  } catch {
    els.recentBlock.hidden = true;
  }
}

els.recentList.addEventListener("click", async (e) => {
  const chip = e.target.closest(".recent-chip");
  if (!chip) return;
  try {
    const resp = await fetch(`/api/jobs/${encodeURIComponent(chip.dataset.job)}`);
    const job = await resp.json();
    if (job.result) {
      resetPanels();
      els.progressPanel.hidden = true;
      renderResults(job.result);
    }
  } catch { /* тишина */ }
});

/* boot */
renderStageList(-1);
refreshRecent();
