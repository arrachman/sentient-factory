# umkm — Juragan (prototype)

Prototype **Juragan**, aplikasi POS + backoffice untuk UMKM Indonesia (minimarket
24 jam, toko kelontong, cafe & resto). Dibuat lewat **claude.ai/design**,
di-export sebagai satu bundel HTML statis. Ini **prototype demo**, bukan aplikasi
produksi — tidak ada backend, semua data hardcoded di markup.

## Layout

```
umkm/
├── dist/                 # yang di-serve nginx (document root)
│   ├── index.html        # seluruh app: markup <x-dc> + <style> inline (~159 KB)
│   ├── support.js        # runtime claude.ai/design, meng-compile <x-dc> di browser
│   └── vendor/           # React 18.3.1 + Babel 7.29.0 UMD hasil vendoring
├── nginx.conf            # config server (CSP, cache, SPA fallback)
├── CLAUDE.md             # berkas ini
└── _source/
    └── Prototype UMKM lengkap dengan backoffice (1).zip   # export asli
```

Tidak ada folder `assets/` — prototype ini murni CSS + ikon font, tanpa berkas
gambar.

## `dist/` tidak masuk Git

`.gitignore` root mengabaikan `dist/` repo-wide, jadi isi `dist/` **tidak
tracked**. Sumber kebenarannya adalah zip di `_source/`. Rebuild pada checkout
baru:

```bash
cd apps/marketing/sub/umkm
unzip -q "_source/Prototype UMKM lengkap dengan backoffice (1).zip" -d dist
mv dist/Juragan.dc.html dist/index.html
rm -rf dist/.thumbnail

# WAJIB: vendor React + Babel UMD, lihat "Vendoring React & Babel" di bawah
mkdir -p dist/vendor
for u in https://unpkg.com/@babel/standalone@7.29.0/babel.min.js \
         https://unpkg.com/react@18.3.1/umd/react.production.min.js \
         https://unpkg.com/react-dom@18.3.1/umd/react-dom.production.min.js; do
  curl -sSL -o "dist/vendor/$(basename "$u")" "$u"
done

# WAJIB: inject window.__resources SEBELUM <script src="./support.js">
```

## Menjalankan

Container nginx statis di **port 3225**:

```bash
docker start sentient-infra-umkm-marketing        # sudah ada, restart=unless-stopped
curl -s http://127.0.0.1:3225/health              # -> ok
```

Membuat ulang dari nol:

```bash
docker run -d --name sentient-infra-umkm-marketing --restart unless-stopped -p 3225:80 \
  -v /opt/sentient-factory/apps/marketing/sub/umkm/dist:/usr/share/nginx/html:ro \
  -v /opt/sentient-factory/apps/marketing/sub/umkm/nginx.conf:/etc/nginx/conf.d/default.conf:ro \
  nginx:alpine
```

Kedua volume `:ro` — edit `dist/` langsung terlihat setelah refresh browser.
Ubah `nginx.conf` → perlu `docker restart sentient-infra-umkm-marketing`.

### Aturan kerja non-negosiabel di folder ini

1. **JANGAN edit `dist/index.html` dengan tangan** untuk perubahan desain besar.
   Berkas itu hasil export mesin (satu file ~159 KB, class dan style ter-generate).
   Untuk perubahan besar: iterasi di claude.ai/design, export ulang, ganti isi
   `dist/`. Tambal kecil (typo, harga paket) langsung masih boleh.
2. **JANGAN pindahkan apa pun dari `_source/` ke `dist/`** — `_source/` sengaja
   di luar document root supaya artefak internal tidak ikut publik.
3. **Konvensi "maks 400 baris per file" di CLAUDE.md root TIDAK berlaku** untuk
   `dist/index.html` dan `dist/support.js`. Keduanya artefak build; jangan
   di-split saat audit.
4. Kalau `dist/` diganti dari export baru, **wajib** ulangi vendoring +
   injeksi `window.__resources`, lalu cek `curl http://127.0.0.1:3225/` = 200
   **dan** halaman benar-benar render (lihat catatan di bawah).

## Vendoring React & Babel (jangan dihapus)

`support.js` **tidak** mem-bundle React. Saat boot ia menarik tiga berkas UMD
dari `unpkg.com` — React 18.3.1, ReactDOM 18.3.1, dan `@babel/standalone`
7.29.0. Kalau ketiganya gagal dimuat, runtime `<x-dc>` tidak pernah boot dan
**halaman tampil kosong** — bukan error, jadi gejalanya mudah disalahartikan
sebagai firewall atau nginx. HTTP 200 **tidak** membuktikan halaman render;
verifikasi isinya, bukan status code.

Ketiga berkas itu di-vendor ke `dist/vendor/`, dan `index.html` mengarahkan
runtime ke sana lewat hook resmi `window.__resources` (dibaca oleh
`cdnScriptFor()` di `support.js`) — di-inject **sebelum** tag `support.js`:

```html
<script>
window.__resources = {
  "https://unpkg.com/react@18.3.1/umd/react.production.min.js": "vendor/react.production.min.js",
  "https://unpkg.com/react-dom@18.3.1/umd/react-dom.production.min.js": "vendor/react-dom.production.min.js",
  "https://unpkg.com/@babel/standalone@7.29.0/babel.min.js": "vendor/babel.min.js"
};
</script>
```

Konsekuensi: CSP boleh tetap `script-src 'self'` (tidak perlu whitelist
unpkg.com), dan prototype jalan tanpa akses internet. **Setelah export ulang,
patch ini hilang** — ulangi, dan cek versi URL-nya:
`grep -oE 'https://unpkg.com/[^"]+' dist/support.js`.

Cek render cepat (headless Chrome tersedia di host):

```bash
CH=/home/rania/.cache/puppeteer/chrome/linux-148.0.7778.97/chrome-linux64/chrome
"$CH" --headless --no-sandbox --virtual-time-budget=15000 \
  --dump-dom http://127.0.0.1:3225/ | grep -c 'Juragan'
```

## Catatan CSP

`support.js` meng-compile markup `<x-dc>` saat runtime lewat `new Function()`,
jadi CSP di `nginx.conf` **wajib** mengizinkan `'unsafe-eval'` dan
`'unsafe-inline'` pada `script-src`. `font-src`/`style-src` mengizinkan Google
Fonts karena halaman memuat **Plus Jakarta Sans**, **IBM Plex Mono**, dan
**Material Symbols Rounded**. Yang terakhir dipakai sebagai ikon ligature —
kalau `font-src` diperketat, semua ikon berubah jadi teks mentah
(`point_of_sale`, `qr_code_2`, dst).

## Isi prototype

Satu halaman dengan **switcher demo** di atas: pilih surface (Website, POS
Tablet, POS HP, Backoffice, Dapur/KDS, App Pelanggan, Onboarding, Offline Mode),
jenis usaha (Madura Mart / Kelontong / Cafe & Resto), dan peran (Owner, Manajer
cabang, Kasir, Staf gudang, Barista/dapur, Akuntan, Pelanggan). Menu dan tampilan
ikut menyesuaikan pilihan.

Tiga mode usaha yang tercermin di sistem:

| Mode | Ciri |
|---|---|
| **Minimarket 24 jam** | Ribuan SKU, scan barcode, shift kasir + tutup buku, PPOB pulsa/token |
| **Toko Kelontong** | Jual eceran/renteng/kiloan, satuan pecah otomatis, buku kasbon digital |
| **Cafe & Resto** | QR order di meja, kitchen display (KDS), PB1 10% otomatis, integrasi ojol |

Fitur yang ditonjolkan: **offline-first** (transaksi tersimpan lokal, sinkron
saat internet kembali), QRIS satu kode, buku kasbon + pengingat WhatsApp,
stok & satuan pecah, multi-harga (eceran/grosir/member), multi-cabang.

Angka di halaman (12.400+ warung, 84 kota, rating 4,9) adalah data demo —
jangan dipakai sebagai klaim nyata tanpa verifikasi.
