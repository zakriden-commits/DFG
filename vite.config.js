import { defineConfig } from 'vite';
import { cpSync, existsSync } from 'node:fs';

/** GLB лежат в assets/ (их же читают Node-скрипты), в сборку копируем руками */
function copyModels() {
  return {
    name: 'copy-models',
    apply: 'build',
    closeBundle() {
      if (existsSync('assets')) cpSync('assets', 'dist/assets', { recursive: true });
    },
  };
}

export default defineConfig({
  // относительные пути: работает и на localhost, и на GitHub Pages в подпапке
  base: './',
  plugins: [copyModels()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    // доступ через прокси превью (e2b.app) и любые внешние host-заголовки
    allowedHosts: true,
    hmr: false,
  },
  preview: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    allowedHosts: true,
  },
  build: {
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      input: {
        rig: 'index.html',
        fps: 'first-person.html',
      },
    },
  },
});
