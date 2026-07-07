// Copies the MediaPipe tasks-vision WASM runtime out of node_modules into
// public/mediapipe/wasm so it can be served same-origin (no CDN dependency on a
// LAN/offline host). The .wasm binaries are large and fully reproducible from the
// installed package, so they are gitignored and re-synced here before dev/build.
// The face-detector model (.tflite) is NOT in node_modules — it is committed
// under public/mediapipe/models and left untouched by this script.
import { createRequire } from 'node:module';
import { cpSync, existsSync, mkdirSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const here = dirname(fileURLToPath(import.meta.url));
const destDir = join(here, '..', 'public', 'mediapipe', 'wasm');

function srcWasmDir() {
  // Resolve via the package main entry (the package blocks ./package.json in its
  // "exports"), then derive the package root from it. Works whether the dep is
  // hoisted to the monorepo root or installed locally in apps/web-hr.
  const entry = require.resolve('@mediapipe/tasks-vision');
  const marker = `${'@mediapipe'}/tasks-vision`;
  const idx = entry.lastIndexOf(marker);
  const pkgRoot = idx >= 0 ? entry.slice(0, idx + marker.length) : dirname(entry);
  return join(pkgRoot, 'wasm');
}

try {
  const src = srcWasmDir();
  mkdirSync(destDir, { recursive: true });
  if (existsSync(destDir) && readdirSync(destDir).length && process.argv.includes('--if-missing')) {
    process.exit(0);
  }
  cpSync(src, destDir, { recursive: true });
  console.log(`[sync-mediapipe] WASM synced → ${destDir}`);
} catch (err) {
  console.error('[sync-mediapipe] failed to sync MediaPipe WASM:', err.message);
  process.exit(1);
}
