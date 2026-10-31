import * as esbuild from 'esbuild';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const here = path.dirname(fileURLToPath(import.meta.url));
const p = (...xs) => path.join(here, ...xs);

const out = p('dist');
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });

const res = await esbuild.build({
  entryPoints: [p('src/main.js')],
  bundle: true,
  outfile: path.join(out, 'bundle.js'),
  format: 'iife',
  target: ['es2019'],
  minify: true,
  legalComments: 'none',
  logLevel: 'info',
});
for (const f of ['index.html', 'styles.css', 'manifest.webmanifest', 'icon.png']) fs.copyFileSync(p(f), path.join(out, f));
const size = fs.statSync(path.join(out, 'bundle.js')).size;
console.log('bundle size', (size / 1024 / 1024).toFixed(2), 'MB');
