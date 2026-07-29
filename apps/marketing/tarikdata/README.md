# Situs PT Tarik Data Digital

Situs statis `https://tarikdata.digital/`, disusun oleh generator tanpa dependensi
di `tools/site_builder.py`. Tidak ada Node, bundler, atau paket pihak ketiga.

## Build

`dist/` **tidak** disimpan di git (`.gitignore`), sedangkan
`infra/docker-compose.yml` me-mount direktori itu ke container nginx. Pada clone
baru direktori tersebut kosong, jadi build wajib dijalankan sebelum menyalakan
container — kalau tidak, seluruh route menghasilkan 404.

```bash
# dari root repo
npm run marketing:build:tarikdata    # src/ -> dist/
npm run marketing:test:tarikdata     # 8 test builder
npm run marketing:up:tarikdata       # build + docker compose up service ini saja
```

Jalankan ulang build setiap kali `src/`, `assets/`, atau `src/data/routes.py`
berubah. Build bersifat deterministik: sumber yang sama menghasilkan `dist/` yang
sama, sehingga aman dijalankan berulang.

Setelah mengubah `nginx.conf`, container perlu dimuat ulang secara eksplisit —
`docker compose up -d` tidak mendeteksi perubahan isi file yang di-mount:

```bash
docker exec sentient-infra-tarik-data-digital nginx -t
docker restart sentient-infra-tarik-data-digital
```

## Struktur

| Path | Isi |
|---|---|
| `src/data/routes.py` | Registry route — sumber tunggal URL, judul, deskripsi, canonical, dan status indexable |
| `src/pages/` | Body tiap halaman (hanya `<main>`, tanpa `<head>`) |
| `src/fragments/` | Shell dokumen, header, footer |
| `src/components/` | Fragment yang disisipkan lewat penanda `[[NAMA]]` |
| `src/assets/` | CSS sumber (digabung jadi `base.css`) dan `site.js` |
| `assets/` | Berkas statis yang disalin apa adanya (favicon, og-image, logo) |
| `dist/` | Keluaran build — dihasilkan ulang, jangan diedit langsung |

Menambah halaman: buat body di `src/pages/`, daftarkan entri `route(...)` di
`src/data/routes.py`, lalu build. Builder memblokir rilis bila ada slot template
yang belum terisi, tautan lokal mati, aset hilang, `id` ganda, `<h1>`/`<main>`
yang tidak tepat satu, referensi ARIA menggantung, atau judul/deskripsi/canonical
yang terduplikasi antar-route.

Route yang diakhiri `.html` (mis. `/404.html`) ditulis sebagai berkas datar;
route lain ditulis sebagai `<route>/index.html`.

## Halaman 404

`src/pages/404.html` dibangun ke `dist/404.html` dan disajikan nginx lewat
`error_page 404`. Halaman ini `internal`, jadi permintaan langsung ke
`/404.html` tetap menghasilkan status 404 — itu perilaku yang diinginkan.
Route yang tidak dikenal harus tetap 404, bukan fallback SPA ke beranda; lihat
`MIGRASI.md`.

## Catatan operasional

- Port `3211`, service compose `tarik-data-digital`, container
  `sentient-infra-tarik-data-digital`. Health check di `/health`.
- TLS dan HSTS diterminasi di edge (Nginx Proxy Manager), bukan di `nginx.conf`
  ini yang hanya melayani port 80 di jaringan internal.
- CSP mengizinkan `'unsafe-inline'` untuk style (halaman memakai `<style>`
  per-halaman dan atribut `style`) dan untuk script (blok JSON-LD). Skrip dari
  origin lain tetap ditolak dan markup tidak memakai handler `on*`.
- Dokumen pendamping: `DESIGN-PLAN.md` (keputusan desain), `CLAIM-POLICY.md`
  (aturan klaim publik), `TODO-DATA.md` (data yang menunggu verifikasi),
  `MIGRASI.md` (pemetaan URL lama).
