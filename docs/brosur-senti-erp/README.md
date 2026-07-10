# Paket Brosur Senti ERP — Index

> Paket lengkap materi sales/marketing Senti ERP untuk client.
> Semua angka & fitur diselaraskan dengan `apps/marketing/erp-marketing.html`
> (single source of truth copy). Jangan ubah angka harga/modul tanpa update
> marketing page juga.

Strategi induk ada di `docs/strategi-brosur-senti-erp.md` (satu folder ke atas).

## Daftar deliverable

| # | File | Format | Isi |
|---|------|--------|-----|
| 1 | `01-wireframe-trifold-ascii.md` | Markdown | Mockup ASCII layout tri-fold (6 panel) + leaflet 1-halaman + catatan cetak |
| 2 | `02-cover-variant-per-segmen.md` | Markdown | 4 cover variant (Manufaktur / Distribusi / Retail-F&B / Jasa-Proyek) dengan copy lengkap |
| 3 | `03-brosur-trifold-print.html` + `.pdf` | HTML + PDF | Brosur tri-fold print-ready A4, 2 sisi (6 panel) |
| 4 | `04-carousel-sosmed.html` + `.pdf` + `carousel-png/` | HTML + PDF + 9 PNG | Carousel sosmed 1080×1080, 9 slide (IG/LinkedIn) |
| 5 | `05-deck-pitch-senti-erp.pptx` + `.pdf` + `-viewer.html` | PPTX + PDF + HTML | Deck pitch meeting 12 slide 16:9 (editable + preview) |

## Cara pakai per format

### Brosur cetak (tri-fold)
1. Buka `03-brosur-trifold-print.pdf` → langsung cetak, ATAU
2. Edit copy di `03-brosur-trifold-print.html` lalu re-render PDF:
   ```bash
   CHROME=/home/rania/.cache/puppeteer/chrome/linux-*/chrome-linux64/chrome
   "$CHROME" --headless --no-sandbox --disable-gpu --no-pdf-header-footer \
     --print-to-pdf=03-brosur-trifold-print.pdf \
     "file://$(pwd)/03-brosur-trifold-print.html"
   ```
3. Cetak: A4 landscape, margin none, scale 100%, bolak-balik. Lipat letter-fold.

### Carousel sosmed
- `carousel-png/s1.png` … `s9.png` → upload langsung ke IG/LinkedIn sebagai carousel.
- Atau pakai `04-carousel-sosmed.pdf` untuk preview/email.
- Edit copy di `04-carousel-sosmed.html`, re-render: `bash render-assets.sh`.

### Deck pitch
- `05-deck-pitch-senti-erp.pptx` → buka di PowerPoint/Keynote/Google Slides, edit bebas.
- Edit copy di `05-build-deck-pitch.py` (DATA di dalam file), regenerate:
  ```bash
  python3 05-build-deck-pitch.py
  ```
- Preview cepat tanpa PowerPoint: buka `05-deck-pitch-viewer.html` di browser (panah ←/→), atau lihat `.pdf`.

## Tooling yang dipakai

- `python-pptx` — generate PPTX (sudah ter-install `--user`).
- `Pillow (PIL)` — combine PNG → PDF.
- Chromium headless (cached `puppeteer`) — render HTML → PDF/PNG.
- Semua **tidak butuh sudo** atau system libs baru.

## Checklist sebelum distribusi

- [ ] Ganti placeholder kontak/telepon jika berubah (sekarang: 021-5051-5105).
- [ ] Dapatkan testimoni real untuk **Variant D (Jasa & Proyek)** sebelum cetak.
- [ ] QR code di brosur → arahkan ke URL demo final (sekarang placeholder).
- [ ] Logo Senti ERP final (sekarang pakai badge "S" sementara).
- [ ] Screenshot asli produk untuk ganti mockup dashboard bila perlu.
- [ ] Proofread angka harga vs `erp-marketing.html`.
- [ ] Print test 1 lembar brosur sebelum produksi massal.
