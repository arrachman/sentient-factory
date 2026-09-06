#!/usr/bin/env bash
set -euo pipefail

APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SOURCE_DIR="$APP_DIR/_source"
DIST_DIR="$APP_DIR/dist"
OVERLAY_FILE="$APP_DIR/overlay/density.css"

if [[ ! -f "$OVERLAY_FILE" ]]; then
  printf 'Overlay tidak ditemukan: %s\n' "$OVERLAY_FILE" >&2
  exit 1
fi

mapfile -t exports < <(
  find "$SOURCE_DIR" -maxdepth 1 -type f -name 'Prototype Sistem Manajemen Pesantren (*.zip' -printf '%f\n' |
    sort -V
)

if (( ${#exports[@]} == 0 )); then
  printf 'Tidak ada export prototype di %s\n' "$SOURCE_DIR" >&2
  exit 1
fi

active_export="${exports[-1]}"
staging_dir="$APP_DIR/.dist-staging"
backup_dir="$APP_DIR/dist.old"

rm -rf "$staging_dir"
mkdir -p "$staging_dir"
unzip -q "$SOURCE_DIR/$active_export" -d "$staging_dir"

html_source="$staging_dir/SIMTERPADU.dc.html"
if [[ ! -f "$html_source" ]]; then
  printf 'Berkas SIMTERPADU.dc.html tidak ada dalam %s\n' "$active_export" >&2
  rm -rf "$staging_dir"
  exit 1
fi

mv "$html_source" "$staging_dir/index.html"
rm -rf "$staging_dir/uploads" "$staging_dir/.thumbnail"
mkdir -p "$staging_dir/vendor" "$staging_dir/overlay"
cp "$OVERLAY_FILE" "$staging_dir/overlay/density.css"

resources=(
  'https://unpkg.com/@babel/standalone@7.29.0/babel.min.js|babel.min.js'
  'https://unpkg.com/react@18.3.1/umd/react.production.min.js|react.production.min.js'
  'https://unpkg.com/react-dom@18.3.1/umd/react-dom.production.min.js|react-dom.production.min.js'
)

for resource in "${resources[@]}"; do
  url="${resource%%|*}"
  name="${resource##*|}"
  if [[ -f "$DIST_DIR/vendor/$name" ]]; then
    cp "$DIST_DIR/vendor/$name" "$staging_dir/vendor/$name"
  else
    curl --fail --silent --show-error --location "$url" -o "$staging_dir/vendor/$name"
  fi
done

python3 - "$staging_dir/index.html" <<'PY'
from pathlib import Path
import sys

path = Path(sys.argv[1])
html = path.read_text(encoding="utf-8")
support_tag = '<script src="./support.js"></script>'
replacement = '''<link rel="stylesheet" href="./overlay/density.css">
<script>
// Arahkan runtime support.js ke React/Babel UMD lokal di vendor/ agar tidak
// menarik unpkg.com. Hook resmi: cdnScriptFor() di support.js membaca
// window.__resources[url] dan memakai nilainya sebagai src bila ada.
window.__resources = {
  "https://unpkg.com/react@18.3.1/umd/react.production.min.js": "vendor/react.production.min.js",
  "https://unpkg.com/react-dom@18.3.1/umd/react-dom.production.min.js": "vendor/react-dom.production.min.js",
  "https://unpkg.com/@babel/standalone@7.29.0/babel.min.js": "vendor/babel.min.js"
};
</script>
<script src="./support.js"></script>'''

if html.count(support_tag) != 1:
    raise SystemExit("Tag support.js tidak unik; export perlu diaudit sebelum rebuild")

# Pertahankan koreksi copy kecil yang sudah disetujui pada versi deploy.
html = html.replace(
    "الْمَعْهَدُ الْإِسْلَامِيُّ نُوْرُ الْهُدَى",
    "مَعْهَدُ نُوْرُ الْهُدَى",
)
path.write_text(html.replace(support_tag, replacement), encoding="utf-8")
PY

python3 - "$staging_dir" <<'PY'
from pathlib import Path
import re
import sys

root = Path(sys.argv[1])
html = (root / "index.html").read_text(encoding="utf-8", errors="replace")
refs = {
    value
    for value in re.findall(r'(?:src|href)="(?!https?:|#|/)([^"]+)"', html)
    if "{{" not in value
}
missing = sorted(value for value in refs if not (root / value).exists())
if missing:
    raise SystemExit("Aset lokal hilang:\n- " + "\n- ".join(missing))
PY

rm -rf "$backup_dir"
if [[ -d "$DIST_DIR" ]]; then
  mv "$DIST_DIR" "$backup_dir"
fi
mv "$staging_dir" "$DIST_DIR"

printf 'Rebuild selesai dari %s\n' "$active_export"
printf 'Backup sebelumnya: %s\n' "$backup_dir"
