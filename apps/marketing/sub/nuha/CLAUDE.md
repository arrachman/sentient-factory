# nuha — SIMTERPADU (prototype)

Prototype web app **SIMTERPADU** (Sistem Informasi Manajemen Terpadu Yayasan
Pendidikan Islam) untuk Pesantren Nuha Mergosono. Dibuat lewat
**claude.ai/design**, di-export sebagai satu bundel HTML statis. Ini **prototype
demo**, bukan aplikasi produksi — tidak ada backend, semua data hardcoded di
markup.

## Layout

```
nuha/
├── dist/                 # yang di-serve nginx (document root)
│   ├── index.html        # seluruh app: markup <x-dc> + <style> inline (~590 KB)
│   ├── support.js        # runtime claude.ai/design, meng-compile <x-dc> di browser
│   ├── assets/           # gambar halaman (logo, foto kiai, banner PPDB, dll)
│   ├── vendor/           # React 18.3.1 + Babel 7.29.0 UMD hasil vendoring
│   └── _ds/engenlearn-ui-kit-<uuid>/   # design-system bundle (CSS + JS + manifest)
├── nginx.conf            # config server (CSP, cache, SPA fallback)
├── CLAUDE.md             # berkas ini
└── _source/              # artefak sumber, TIDAK di-serve
    ├── Prototype Sistem Manajemen Pesantren (5).zip   # export asli
    ├── prompt-claude-design-yayasan.md                # prompt yang dipakai
    └── pasted-*.png, *.webp                           # referensi visual
```

## `dist/` tidak masuk Git

`.gitignore` root mengabaikan `dist/` repo-wide (sama seperti
`apps/marketing/tarikdata/dist`), jadi isi `dist/` **tidak tracked**. Sumber
kebenarannya adalah zip di `_source/`. Rebuild pada checkout baru:

```bash
cd apps/marketing/sub/nuha
unzip -q "_source/Prototype Sistem Manajemen Pesantren (5).zip" -d dist
mv dist/SIMTERPADU.dc.html dist/index.html
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

## Menjalankan

Container nginx statis di **port 3223**:

```bash
docker start sentient-infra-nuha-marketing        # sudah ada, restart=unless-stopped
curl -s http://127.0.0.1:3223/health              # -> ok
```

Membuat ulang dari nol:

```bash
docker run -d --name sentient-infra-nuha-marketing --restart unless-stopped -p 3223:80 \
  -v /opt/sentient-factory/apps/marketing/sub/nuha/dist:/usr/share/nginx/html:ro \
  -v /opt/sentient-factory/apps/marketing/sub/nuha/nginx.conf:/etc/nginx/conf.d/default.conf:ro \
  nginx:alpine
```

Kedua volume `:ro` — edit `dist/` langsung terlihat setelah refresh browser.
Ubah `nginx.conf` → perlu `docker restart sentient-infra-nuha-marketing`.

### Aturan kerja non-negosiabel di folder ini

1. **JANGAN edit `dist/index.html` dengan tangan** untuk perubahan desain besar.
   Berkas itu hasil export mesin (satu file ~590 KB, class dan style ter-generate).
   Untuk perubahan besar: iterasi di claude.ai/design pakai
   `_source/prompt-claude-design-yayasan.md`, export ulang, ganti isi `dist/`.
   Tambal kecil (typo, angka, tautan) langsung di `dist/index.html` masih boleh.
2. **JANGAN pindahkan apa pun dari `_source/` ke `dist/`** — `_source/` sengaja di
   luar document root supaya prompt dan screenshot internal tidak ikut publik.
3. **JANGAN rename folder `_ds/engenlearn-ui-kit-<uuid>/`** — path-nya di-hardcode
   di `<link>` dalam `index.html`.
4. **Konvensi "maks 400 baris per file" di CLAUDE.md root TIDAK berlaku** untuk
   `dist/index.html` dan `dist/support.js`. Keduanya artefak build; jangan
   di-split saat audit.
5. Kalau `dist/` diganti dari export baru, **cek ulang**: `assets/` masih lengkap,
   path `_ds/` di `index.html` cocok dengan nama folder yang ada, dan
   `curl http://127.0.0.1:3223/` masih 200.

## Vendoring React & Babel (jangan dihapus)

`support.js` **tidak** mem-bundle React. Saat boot ia menarik tiga berkas UMD
dari `unpkg.com` — React 18.3.1, ReactDOM 18.3.1, dan `@babel/standalone`
7.29.0 (URL-nya hardcoded di `src/cdn.ts` dalam bundel). Kalau ketiganya gagal
dimuat, runtime `<x-dc>` tidak pernah boot dan **halaman tampil kosong berwarna
krem** (`#FAF8F3` dari `<style>` body) — bukan error, jadi gejalanya mudah
disalahartikan sebagai firewall atau nginx.

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
unpkg.com), dan prototype jalan tanpa akses internet. **Setelah export ulang
dari claude.ai/design, patch ini hilang** — ulangi vendoring + injeksi, dan
cek apakah versi URL di `support.js` berubah:
`grep -oE 'https://unpkg.com/[^"]+' dist/support.js`.

## Catatan CSP

`support.js` meng-compile markup `<x-dc>` saat runtime lewat `new Function()`,
jadi CSP di `nginx.conf` **wajib** mengizinkan `'unsafe-eval'` dan
`'unsafe-inline'` pada `script-src`. Tanpa itu halaman render kosong. Skrip dari
origin lain tetap ditolak. `font-src`/`style-src` mengizinkan Google Fonts karena
halaman memuat Lora, Plus Jakarta Sans, dan Amiri dari sana.

## Isi prototype

Satu halaman berisi semua layar, dinavigasi client-side:

- **Publik** — landing yayasan, profil unit Pondok, PPDB multi-step, cek status.
- **Dashboard internal** — dashboard yayasan (KPI 4 unit), Akademik SMP/MA,
  Kepesantrenan (asrama, absensi jamaah, hafalan, ta'zir, perizinan), Poskestren,
  Keuangan (SPP/syahriyah/tunggakan), Data Induk santri (tab lintas-unit), PPDB
  admin, Pengaturan.
- **Portal Wali Santri** — mobile-first, lebar maks 420px.

Konsep data intinya: **satu identitas, banyak peran** — santri pondok yang juga
siswa SMP/MA adalah satu orang dengan beberapa peran, bukan beberapa record.
Layar Data Induk adalah demonstrasi utama konsep ini; jangan pecah datanya per
unit saat mengubah prototype.

## Langkah manual yang belum dilakukan

Dua berkas berikut dilindungi permission agent, jadi harus dijalankan manual:

1. **Registrasi port** di `config/ports.json`, di bawah `services`:
   ```json
   "nuha-marketing": {
     "name": "Nuha Marketing",
     "port": 3223,
     "type": "static",
     "description": "SIMTERPADU prototype Pesantren Nuha Mergosono (sub/nuha)",
     "isActive": true
   }
   ```
2. **Buka UFW** untuk akses dari klien LAN (host ini default-policy DROP):
   ```bash
   sudo ufw allow from 192.168.1.0/24 to any port 3223 proto tcp comment 'nuha-marketing'
   sudo ufw reload
   ```
   Tanpa ini, 3223 hanya bisa diakses dari host itu sendiri.

Opsional: pindahkan service ini ke `infra/docker-compose.yml` (pola sama dengan
`tarik-data-digital`) agar ikut `npm run docker:up`.
