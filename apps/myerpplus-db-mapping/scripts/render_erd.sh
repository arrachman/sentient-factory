#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUT_DIR="$ROOT_DIR/output"
RENDER_DIR="$OUT_DIR/rendered"

mkdir -p "$RENDER_DIR"

if ! command -v npx >/dev/null 2>&1; then
  echo "ERROR: npx not found. Install Node.js first." >&2
  exit 1
fi

render_one() {
  local src="$1"
  local base
  base="$(basename "$src" .mmd)"

  npx --yes @mermaid-js/mermaid-cli -i "$src" -o "$RENDER_DIR/${base}.svg"
  npx --yes @mermaid-js/mermaid-cli -i "$src" -o "$RENDER_DIR/${base}.png"
}

render_one "$OUT_DIR/erd-pt-myerpplus.mmd"
for f in "$OUT_DIR"/domains/*.mmd; do
  render_one "$f"
done

echo "Rendered ERD files to: $RENDER_DIR"
