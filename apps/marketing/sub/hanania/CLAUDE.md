# hanania — Hanania Kidz Clinic (prototype)

Prototype landing page + portal penjadwalan untuk **Hanania Kidz Clinic**, klinik
tumbuh kembang anak di Malang. Dibuat lewat **claude.ai/design**, di-export
sebagai satu bundel HTML statis. Ini **prototype demo**, bukan aplikasi produksi
— tidak ada backend, semua data (slot, harga, terapis) hardcoded di markup.

## Layout

```
hanania/
├── dist/                 # yang di-serve nginx (document root)
│   ├── index.html        # seluruh app: markup <x-dc> + <style> inline (~206 KB)
│   ├── support.js        # runtime claude.ai/design, meng-compile <x-dc> di browser
│   ├── assets/           # 4 foto klinik (.webp): hero, playroom, afterschool, pelatihan
│   └── vendor/           # React 18.3.1 + Babel 7.29.0 UMD hasil vendoring
├── nginx.conf            # config server (CSP, cache, SPA fallback)
├── CLAUDE.md             # berkas ini
└── _source/              # artefak sumber, TIDAK di-serve
    ├── Prototype Penjadwalan Klinik Anak (2).zip   # export AKTIF (dist/ dari sini)
    ├── Prototype Penjadwalan Klinik Anak (1).zip   # export sebelumnya, arsip
    ├── uploads-v2/       # referensi visual dari export v2 (foto WhatsApp, screenshot)
    └── uploads-v1/       # idem, dari export v1 (palet warna Color Hunt)
```

Zip di `_source/` bernomor sesuai urutan export dari claude.ai/design. **Yang
tertinggi = yang aktif**; simpan versi lama sebagai arsip, jangan dihapus.
`uploads-*/` di-gitignore (lihat `../.gitignore`) karena isinya hasil extract
dari zip yang sudah tracked.

Sejak v2 foto asli klinik sudah masuk ke `dist/assets/` — sebelumnya semua
visual masih placeholder inline ("[ foto ruang terapi + anak ] 1200 × 900").

## `dist/` tidak masuk Git

`.gitignore` root mengabaikan `dist/` repo-wide, jadi isi `dist/` **tidak
tracked**. Sumber kebenarannya adalah zip di `_source/`. Rebuild pada checkout
baru:

```bash
cd apps/marketing/sub/hanania
unzip -q "_source/Prototype Penjadwalan Klinik Anak (2).zip" -d dist
mv "dist/Hanania Kidz Clinic.dc.html" dist/index.html
rm -rf dist/uploads dist/.thumbnail      # artefak sumber, bukan aset halaman

# WAJIB: vendor React + Babel UMD, lihat "Vendoring React & Babel" di bawah
mkdir -p dist/vendor
for u in https://unpkg.com/@babel/standalone@7.29.0/babel.min.js \
         https://unpkg.com/react@18.3.1/umd/react.production.min.js \
         https://unpkg.com/react-dom@18.3.1/umd/react-dom.production.min.js; do
  curl -sSL -o "dist/vendor/$(basename "$u")" "$u"
done

# WAJIB: inject window.__resources SEBELUM <script src="./support.js">
```

## Prosedur update dari export baru

Saat datang zip versi berikutnya (mis. `... (3).zip`), lakukan urut:

```bash
cd apps/marketing/sub/hanania
mv dist dist.old                                  # jangan rm — untuk diff & rollback
unzip -q "_source/Prototype Penjadwalan Klinik Anak (3).zip" -d dist
mv "dist/Hanania Kidz Clinic.dc.html" dist/index.html
mv dist/uploads _source/uploads-v3 && rm -f dist/.thumbnail

# 1. versi CDN berubah? kalau sama, vendor lama bisa dipakai ulang
grep -oE 'https://unpkg.com/[^"]+' dist/support.js | sort -u
cp -a dist.old/vendor dist/vendor

# 2. re-inject window.__resources (patch ini SELALU hilang di export baru)

# 3. cek semua rujukan aset lokal resolve (abaikan '{{ ... }}' = binding runtime)
python3 - <<'PY'
import re, os
os.chdir('dist')
s = open('index.html', encoding='utf8', errors='replace').read()
refs = set(re.findall(r'(?:src|href)="(?!https?:|#|/)([^"]+)"', s))
print('MISSING:', [r for r in sorted(refs) if '{{' not in r and not os.path.exists(r)] or 'none')
PY

# 4. restart + verifikasi RENDER, bukan cuma status code
docker restart sentient-infra-hanania-marketing
```

Setelah yakin, baru buang `dist.old`. Simpan zip lama di `_source/` sebagai arsip.

## Menjalankan

Container nginx statis di **port 3224**:

```bash
docker start sentient-infra-hanania-marketing     # sudah ada, restart=unless-stopped
curl -s http://127.0.0.1:3224/health              # -> ok
```

Membuat ulang dari nol:

```bash
docker run -d --name sentient-infra-hanania-marketing --restart unless-stopped -p 3224:80 \
  -v /opt/sentient-factory/apps/marketing/sub/hanania/dist:/usr/share/nginx/html:ro \
  -v /opt/sentient-factory/apps/marketing/sub/hanania/nginx.conf:/etc/nginx/conf.d/default.conf:ro \
  nginx:alpine
```

Kedua volume `:ro` — edit `dist/` langsung terlihat setelah refresh browser.
Ubah `nginx.conf` → perlu `docker restart sentient-infra-hanania-marketing`.

### Aturan kerja non-negosiabel di folder ini

1. **JANGAN edit `dist/index.html` dengan tangan** untuk perubahan desain besar.
   Berkas itu hasil export mesin (satu file ~206 KB, class dan style ter-generate).
   Untuk perubahan besar: iterasi di claude.ai/design, export ulang, ganti isi
   `dist/`. Tambal kecil (typo, harga, nomor telepon) langsung masih boleh.
2. **JANGAN pindahkan apa pun dari `_source/` ke `dist/`** — `_source/` sengaja
   di luar document root supaya artefak internal tidak ikut publik.
3. **Konvensi "maks 400 baris per file" di CLAUDE.md root TIDAK berlaku** untuk
   `dist/index.html` dan `dist/support.js`. Keduanya artefak build; jangan
   di-split saat audit.
4. Kalau `dist/` diganti dari export baru, **wajib** ulangi vendoring +
   injeksi `window.__resources`, lalu cek `curl http://127.0.0.1:3224/` = 200
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
  --dump-dom http://127.0.0.1:3224/ | grep -c 'Hanania'
```

## Catatan CSP

`support.js` meng-compile markup `<x-dc>` saat runtime lewat `new Function()`,
jadi CSP di `nginx.conf` **wajib** mengizinkan `'unsafe-eval'` dan
`'unsafe-inline'` pada `script-src`. `font-src`/`style-src` mengizinkan Google
Fonts karena halaman memuat **Baloo 2** dan **Nunito Sans** dari sana.

## Isi prototype

Satu halaman, navigasi client-side lewat anchor (`#layanan`, `#jadwal`, `#tim`,
`#afterschool`, `#biaya`):

- **Hero + alur layanan** 4 langkah: Daftar → Pilih slot → Terapi → Laporan.
- **9 layanan** dengan durasi, harga, dan sisa slot: terapi okupasi, wicara,
  fisioterapi anak, konsultasi tumbuh kembang, asesmen psikologi, kelas
  Afterschool, konsultasi nutrisi, konsultasi dewasa & keluarga, home visit/online.
- **Booking mandiri 24 jam** — grid slot kosong real-time (mock).
- **Progres anak**, tagihan & paket (QRIS/VA/transfer/tunai/klaim asuransi),
  profil tim terapis, biaya, dan portal orang tua.

Klinik buka Selasa–Minggu 08.00–20.00 WIB. Angka-angka di halaman (112+ keluarga,
slot per minggu) adalah data demo — perbarui bareng-bareng kalau dipakai pitch.
