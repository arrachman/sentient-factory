---
name: psychology-design
description: Skill untuk bekerja dengan apps/psychology-design — prototype design "Althea Psychology App" (sistem penjadwalan klinik psikologi Malang) dari handoff Claude Design. HTML + React 18 UMD + Babel standalone, no build step, dijalankan via Docker nginx di port 3216.
---

Kamu sedang bekerja di `apps/psychology-design` — prototype design **Althea Psychology App**, sistem penjadwalan untuk klinik psikologi di Malang, Indonesia. Bahasa Indonesia, terminologi klinik psikologi.

Bundle ini adalah **handoff dari Claude Design** (claude.ai/design), bukan production code. Tujuannya untuk review desain & demo stakeholder sebelum dikonversi ke Next.js.

## Tech Stack
- **HTML statis** + **React 18.3.1** (UMD via CDN unpkg)
- **Babel standalone 7.29.0** untuk transform JSX di browser
- **CSS**: token dari `colors_and_type.css` (Sentient Factory) + `althea.css` (brand Althea: sage primary, cream surface, deep teal text, font Lora + Nunito Sans)
- **No build step**, no bundler, no node_modules. Edit file → refresh browser.

## Cara Jalankan

```bash
# Dari folder apps/psychology-design
docker compose up -d
# Buka http://localhost:3216
```

Container `nginx:alpine` mount folder ini read-only ke `/usr/share/nginx/html`. Edit file di host langsung kepakai tanpa rebuild — tinggal refresh browser.

```bash
docker compose down       # stop
docker compose logs -f    # tail logs
```

Alternatif tanpa Docker: `npm run dev` (jalankan `npx serve -l 3210 .`).

## Struktur File

```
index.html                  # entry — load semua JSX via <script type="text/babel">
althea.css                  # brand tokens Althea (sage/cream/deep teal, Lora + Nunito Sans)
colors_and_type.css         # tokens scaffolding Sentient Factory design system
docker-compose.yml          # nginx:alpine, port 3216
package.json                # script dev (npx serve)

design-canvas.jsx           # canvas pembungkus (DCSection, DCArtboard, DCPostIt)
ios-frame.jsx               # frame iPhone untuk artboard mobile (390×844)
althea-data.jsx             # mock data: klien, psikolog, layanan, ruangan, jadwal

# Desktop · Operasional (1280×880)
DesktopAdmin.jsx            # penjadwalan harian
BookingWizard.jsx           # wizard klien baru (480×880)
AdminClients.jsx            # daftar & detail klien
AdminRooms.jsx              # timeline ruangan harian
AdminShell.jsx              # shell layout admin (sidebar + topbar)

# Desktop · Manajemen (1280×880)
AdminPsikolog.jsx           # tim psikolog
AdminLayanan.jsx            # katalog layanan
AdminNotifWA.jsx            # template & log WhatsApp

# Desktop · Dialog & aksi
AdminDialogs1.jsx           # filter klien, sortir, tambah klien/psikolog/layanan
AdminDialogs2.jsx           # tambah ruangan, detail booking, template WA baru

# Desktop · Role Staff Psikolog (1280×880)
PsikologDashboard.jsx       # landing dashboard pribadi
PsikologJadwalSaya.jsx      # jadwal minggu ini
PsikologScreens.jsx         # PsikologKlienSaya, PsikologCatatan (SOAP), PsikologProfil

# Mobile · Admin Klinik (390×844)
MobileAdmin.jsx             # MobileAdminSchedule, Clients, Rooms, NotifWA

# Mobile · Staff Psikolog (390×844)
MobilePsikolog.jsx          # MobilePsikologKlien, Detail, Profil
MobileViews.jsx             # MobileToday, MobileAvailability, MobileLogin
```

## Peta Artboard

`index.html` merender artboard di 6 section:

1. **Desktop · Operasional** — penjadwalan harian, wizard klien, daftar klien, timeline ruangan
2. **Desktop · Manajemen** — psikolog, layanan, notifikasi WA
3. **Desktop · Dialog & aksi** — 8 modal/popover (filter, sortir, 4 form add, detail booking, template WA)
4. **Desktop · Role Staff Psikolog** — 5 screens (Dashboard, Jadwal saya, Klien saya, Catatan SOAP, Profil)
5. **Mobile · Admin Klinik** — 4 screens (Penjadwalan, Klien, Ruangan, Notifikasi WA)
6. **Mobile · Staff Psikolog** — 6 screens (Today, Klien saya, Detail klien, Availability, Profil, Login)

## Konvensi Editing

- **Jangan tambahkan tooling build** (webpack/vite/next). Pertahankan model "edit → refresh" agar tetap ringan untuk iterasi desain.
- **Komponen ditulis sebagai global** (`function FooBar() {}`) tanpa `import/export` — dipanggil dari HTML via tag `<script type="text/babel">`. Saat menambah file JSX baru, daftarkan di `index.html`.
- **Mock data** ada di `althea-data.jsx`. Jangan fetch API; kalau butuh data baru, tambahkan ke file ini.
- **Tokens warna/font**: ubah di `althea.css`. Jangan inline style untuk warna brand.
- **Bahasa UI**: Indonesia, sentence-case untuk deskripsi, Title Case untuk tombol/judul halaman. Tidak pakai emoji di product UI.

## Sumber Handoff

- `DESIGN-SYSTEM.md` — README handoff Claude Design (Sentient Factory design system overview)
- `PROJECT-NOTES.md` — README internal project Althea
- `README.md` — instruksi run & struktur (versi singkat)

## Langkah Konversi ke Production

Kalau prototype ini disetujui dan harus jadi app sungguhan:

1. Buat app Next.js baru di monorepo (mis. `apps/althea-web`) atau integrasikan ke `apps/web-dashboard`.
2. Konversi tiap `.jsx` → komponen Next.js / React 19 dengan `import/export`.
3. Pindahkan token `althea.css` ke `packages/ui-kit` atau `tailwind.config` (kalau Althea jadi brand line of business).
4. Ganti `althea-data.jsx` (mock) → API gateway + Prisma model.
5. Tambah auth (role: admin klinik vs staff psikolog) — design sudah membedakan dua role.
