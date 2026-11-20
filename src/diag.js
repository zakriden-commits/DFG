/**
 * Мини-диагностика для страниц с 3D: если что-то не так, это видно на экране,
 * а не только в консоли (в превью консоль не открыть).
 */

const CSS = `
#diag {
  position: fixed;
  left: 14px;
  bottom: 14px;
  z-index: 9999;
  font: 12px/1.45 ui-monospace, "SF Mono", Consolas, monospace;
  color: #b9c6dd;
  background: rgba(8, 11, 20, 0.82);
  border: 1px solid rgba(120, 150, 200, 0.28);
  border-radius: 10px;
  padding: 7px 11px;
  max-width: min(560px, calc(100vw - 28px));
  pointer-events: none;
  white-space: pre-wrap;
  backdrop-filter: blur(8px);
}
#diag b { color: #7dffb0; font-weight: 600; }
#diag .bad { color: #ff6b7a; }
#diag .warn { color: #ffcc66; }
#diag.fatal {
  border-color: rgba(255, 90, 110, 0.6);
  background: rgba(30, 6, 10, 0.9);
  color: #ffd9de;
  font-size: 13px;
}
#diag.fatal .big {
  display: block;
  font-size: 15px;
  font-weight: 700;
  color: #ff8f9c;
  margin-bottom: 6px;
  letter-spacing: 0.02em;
}
`;

export function installDiagnostics(title = '3D') {
  const style = document.createElement('style');
  style.textContent = CSS;
  document.head.appendChild(style);

  const box = document.createElement('div');
  box.id = 'diag';
  box.innerHTML = `<b>${title}</b> · запуск…`;
  document.body.appendChild(box);

  const errors = [];
  let fatalShown = false;

  const render = () => {
    box.innerHTML = errors
      .map((e, i) => `<span class="bad">ошибка ${i + 1}:</span> ${escapeHtml(e)}`)
      .join('\n');
  };

  const showError = (text) => {
    if (fatalShown) return;
    const short = String(text || 'неизвестная ошибка').slice(0, 400);
    if (errors.includes(short)) return;
    errors.push(short);
    box.classList.add('fatal');
    box.classList.remove('hidden');
    render();
  };

  addEventListener('error', (e) => showError(e.message || e.error));
  addEventListener('unhandledrejection', (e) => showError(e.reason?.message || e.reason));

  return {
    /** короткая строка состояния; bad=true — красным */
    status(text, bad = false) {
      if (errors.length) return;
      box.innerHTML = bad ? `<span class="bad">${escapeHtml(text)}</span>` : escapeHtml(text);
    },
    fail: showError,
    /** большая карточка с объяснением — для случаев, когда 3D не запустится вообще */
    fatal(titleText, details = '') {
      fatalShown = true;
      box.classList.add('fatal');
      box.innerHTML = `<span class="big">${escapeHtml(titleText)}</span>${escapeHtml(details)}`;
    },
    get element() {
      return box;
    },
  };
}

/** Проверка WebGL до создания рендерера: понятная причина вместо чёрного экрана */
export function webglSupport() {
  try {
    const c = document.createElement('canvas');
    const gl2 = c.getContext('webgl2');
    if (gl2) return { ok: true, version: 'WebGL2', name: rendererName(gl2) };
    const gl1 = c.getContext('webgl') || c.getContext('experimental-webgl');
    if (gl1) return { ok: true, version: 'WebGL1', name: rendererName(gl1) };
    return { ok: false, version: 'нет', name: 'браузер не выдал контекст' };
  } catch (err) {
    return { ok: false, version: 'нет', name: String(err?.message || err) };
  }
}

function rendererName(gl) {
  try {
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    return ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : 'рендерер скрыт';
  } catch {
    return 'рендерер скрыт';
  }
}

function escapeHtml(s) {
  return String(s).replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c]);
}
