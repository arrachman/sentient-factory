# Althea Psychology — Design Prototype

Sistem penjadwalan untuk klinik psikologi (Malang, Indonesia). Bahasa Indonesia, terminologi klinik psikologi.

Diimplementasikan dari handoff bundle Claude Design (lihat `DESIGN-SYSTEM.md` dan `PROJECT-NOTES.md`).

## Cara menjalankan

```bash
# dari folder ini
npm run dev
# buka http://localhost:3210
```

Prototype ini self-contained — React 18 + Babel standalone via CDN. Tidak ada build step.

## Struktur

```
index.html              # entry — memuat semua JSX via <script type="text/babel">
althea.css              # brand tokens Althea (sage / cream / deep teal, Lora + Nunito Sans)
colors_and_type.css     # tokens scaffolding dari Sentient Factory design system

design-canvas.jsx       # canvas pembungkus (DCSection, DCArtboard, DCPostIt)
ios-frame.jsx           # frame iPhone untuk artboard mobile
althea-data.jsx         # mock data (klien, psikolog, layanan, ruangan, jadwal)

# Desktop · Operasional
DesktopAdmin.jsx        # penjadwalan harian
BookingWizard.jsx       # wizard klien baru
AdminClients.jsx        # daftar & detail klien
AdminRooms.jsx          # timeline ruangan

# Desktop · Manajemen
AdminPsikolog.jsx       # tim psikolog
AdminLayanan.jsx        # katalog layanan
AdminNotifWA.jsx        # template & log WhatsApp
AdminShell.jsx          # shell layout admin (sidebar + topbar)

# Desktop · Dialog
AdminDialogs1.jsx       # filter klien, sortir, tambah klien/psikolog/layanan
AdminDialogs2.jsx       # tambah ruangan, detail booking, template WA baru

# Mobile · Psikolog
MobileViews.jsx         # MobileToday, MobileAvailability, MobileLogin
```

## Artboards yang dirender

Lihat `index.html` untuk daftar lengkap. Singkatnya:

- **Operasional** (1280×880): Penjadwalan harian, Wizard klien baru (480×880), Daftar klien, Timeline ruangan
- **Manajemen** (1280×880): Psikolog, Layanan, Notifikasi WA
- **Dialog & aksi**: 8 modal/popover (filter, sortir, form add, detail booking, template WA)
- **Mobile · Psikolog** (390×844): Hari ini, Availability mingguan, Login

## Catatan implementasi

Bundle ini adalah **prototype**, bukan production code. Untuk integrasi ke `sentient-factory` proper:

1. Konversi tiap `.jsx` ke komponen Next.js / React 19 di `apps/web-dashboard` atau app baru.
2. Ganti CDN React + Babel standalone dengan tooling monorepo (turbo + pnpm).
3. Pindahkan tokens `althea.css` ke `packages/ui-kit` atau Tailwind config kalau jadi line of business utama.
4. Mock data (`althea-data.jsx`) → ganti ke API gateway / Prisma model.

Sampai konversi itu dilakukan, prototype ini bisa dipakai untuk review desain & demo stakeholder.
