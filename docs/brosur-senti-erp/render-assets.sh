#!/usr/bin/env bash
# Render carousel HTML → per-slide PNG (1080×1080) + combined PDF.
# Uses headless Chromium (cached from puppeteer/playwright).
set -euo pipefail

DIR="/opt/sentient-factory/docs/brosur-senti-erp"
CHROME="/home/rania/.cache/puppeteer/chrome/linux-131.0.6778.204/chrome-linux64/chrome"

# Pick first available chrome
for c in \
  "/home/rania/.cache/puppeteer/chrome/linux-131.0.6778.204/chrome-linux64/chrome" \
  "$(ls -1 /home/rania/.cache/puppeteer/chrome/linux-*/*/chrome 2>/dev/null | head -1)" \
  "$(ls -1 /home/rania/.cache/ms-playwright/chromium-*/chrome-linux64/chrome 2>/dev/null | head -1)"; do
  if [ -x "$c" ]; then CHROME="$c"; break; fi
done

echo "Using chrome: $CHROME"
HTML="$DIR/04-carousel-sosmed.html"
URL="file://$HTML"

# Render carousel: each .slide is full viewport. We render at device scale 1
# for exact 1080px. Window size 1080 wide; we screenshot each #sN node.
# Chromium --headless screenshot captures whole page; to get per-slide we use
# a CSS trick: we render each slide id by setting window height = 1080 and
# using --screenshot per element is not supported in old headless. Instead we
# use --hide-scrollbars and a 1080x(1080*N) capture then split with python.

mkdir -p "$DIR/carousel-png"

# Approach: render 9 separate HTMLs is overkill. Use python + selenium-free
# approach: chromium can screenshot a SELECTION? No. Simplest robust path:
# generate one temp HTML per slide via CSS that shows only that slide.

python3 - "$DIR" "$HTML" "$CHROME" <<'PY'
import sys, os, re, subprocess, shutil
d, html, chrome = sys.argv[1], sys.argv[2], sys.argv[3]
src = open(html).read()
slides = re.findall(r'id="(s\d+)"', src)
print(f"Found slides: {slides}")

# For each slide, build a temp HTML showing ONLY that slide (others display:none)
tmpdir = os.path.join(d, "_render_tmp")
os.makedirs(tmpdir, exist_ok=True)
pngs = []
for sid in slides:
    # inject style to hide all .slide except current
    styled = src.replace(
        '<style>',
        f'<style>#{{all}}nope\n', 1)  # noop guard
    # simpler: wrap hide rule
    hide_rule = f'<style>.slide{{display:none!important}}#{sid}{{display:flex!important}}</style>'
    styled = src.replace('</head>', hide_rule + '</head>')
    # force light bg on body so PNG is clean
    styled = styled.replace('body{', 'body{background:#fff!important;')
    tmp_html = os.path.join(tmpdir, f"{sid}.html")
    open(tmp_html, 'w').write(styled)
    out_png = os.path.join(d, "carousel-png", f"{sid}.png")
    pngs.append(out_png)
    url = "file://" + tmp_html
    cmd = [chrome, "--headless", "--no-sandbox", "--disable-gpu",
           "--hide-scrollbars", "--force-device-scale-factor=1",
           "--window-size=1080,1080",
           "--default-background-color=00000000",
           f"--screenshot={out_png}", url]
    r = subprocess.run(cmd, capture_output=True, text=True)
    if not os.path.exists(out_png):
        print("FAIL", sid, r.stderr[-500:])
    else:
        sz = os.path.getsize(out_png)
        print(f"  {sid}.png  {sz} bytes")

# cleanup tmp
shutil.rmtree(tmpdir, ignore_errors=True)
print("PNG render done:", len(pngs), "files")
PY

echo ""
echo "=== Combine PNGs into single PDF ==="
python3 - "$DIR" <<'PY'
import sys, os
from PIL import Image
d = sys.argv[1]
pdir = os.path.join(d, "carousel-png")
slides = sorted(f for f in os.listdir(pdir) if f.endswith('.png'))
imgs = [Image.open(os.path.join(pdir, s)).convert("RGB") for s in slides]
out_pdf = os.path.join(d, "04-carousel-sosmed.pdf")
imgs[0].save(out_pdf, save_all=True, append_images=imgs[1:], resolution=144.0)
print("PDF:", out_pdf, os.path.getsize(out_pdf), "bytes,", len(slides), "pages")
PY

echo ""
echo "=== DONE ==="
ls -la "$DIR/carousel-png/"
ls -la "$DIR/04-carousel-sosmed.pdf"
