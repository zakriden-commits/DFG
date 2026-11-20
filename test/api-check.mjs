import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';

/**
 * Статическая проверка на API, которых в three r169 больше нет.
 * Ровно такие вызовы убивают страницу молча: кадр падает, экран остаётся пустым.
 */

const FORBIDDEN = [
  { re: /\.skeleton\s*\.\s*update\s*\(/g, why: 'SkeletonHelper.update() удалён в r151+, хелпер обновляется сам' },
  { re: /\.outputEncoding\b/g, why: 'заменено на renderer.outputColorSpace' },
  { re: /sRGBEncoding|LinearEncoding/g, why: 'константы кодировок удалены, используй SRGBColorSpace / LinearSRGBColorSpace' },
  { re: /useLegacyLights|physicallyCorrectLights/g, why: 'освещение физическое с r165, флаги удалены' },
  { re: /new\s+THREE\.Geometry\b|new\s+Geometry\b/g, why: 'THREE.Geometry удалён, только BufferGeometry' },
  { re: /new\s+THREE\.Face3\b/g, why: 'Face3 удалён' },
  { re: /\.addAttribute\s*\(/g, why: 'переименовано в setAttribute' },
  { re: /\.getInverse\s*\(/g, why: 'переименовано в .invert()' },
  { re: /\.applyMatrix\s*\(/g, why: 'переименовано в applyMatrix4' },
  { re: /\.slerp\s*\(/g, why: 'для кватернионов — slerpQuaternions(a, b, t)' },
  { re: /\.multiplyVector3\s*\(/g, why: 'удалено, используй applyQuaternion' },
];

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) walk(p, out);
    else if (['.js', '.mjs', '.html'].includes(extname(p))) out.push(p);
  }
  return out;
}

const files = [...walk('src'), ...readdirSync('.').filter((f) => f.endsWith('.html'))];
const problems = [];

for (const file of files) {
  const text = readFileSync(file, 'utf8');
  const lines = text.split('\n');
  for (const { re, why } of FORBIDDEN) {
    re.lastIndex = 0;
    let m;
    while ((m = re.exec(text))) {
      const line = text.slice(0, m.index).split('\n').length;
      problems.push(`${file}:${line} → ${m[0].trim()} — ${why}`);
    }
    void lines;
  }
}

if (problems.length) {
  console.error('Найдены вызовы удалённого API three r169:\n' + problems.map((p) => '  · ' + p).join('\n'));
  process.exitCode = 1;
} else {
  console.log(`API three r169: чисто (проверено файлов: ${files.length})`);
}
