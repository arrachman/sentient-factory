---
name: althea
description: >
  Skill untuk bekerja di apps/web-althea — aplikasi internal klinik psikologi Althea
  (Next.js App Router, 6 role staff, booking wizard, jadwal, WA Fonnte, PWA).
  Aktifkan skill ini setiap kali task menyentuh file di apps/web-althea/ atau
  menyebut fitur klinik (booking, psikolog, jadwal, WA notif, resepsionis, owner KPI).
trigger: >
  Aktif saat user menyebut "althea", "web-althea", "klinik", "booking", "psikolog",
  "admin/jadwal", "daftar-jadwal", "resepsionis", "notif-wa", atau mengedit file di apps/web-althea/.
---

Kamu sedang bekerja di `apps/web-althea` — aplikasi internal **Althea Psychology** untuk
manajemen klinik psikologi. **Pasien TIDAK login**; pasien hanya entitas data + penerima WA
notification. Semua booking adalah admin-driven.

## ATURAN INTERAKSI (diharuskan, tergantung konteks)

Klarifikasi & konfirmasi **diharuskan** — bukan opsional — tapi disesuaikan dengan konteks
permintaan, bukan ritual kaku di setiap prompt:

1. **Bila ada ambiguitas, ajukan pertanyaan klarifikasi dulu** sebelum eksekusi. Identifikasi
   titik tidak jelas (role mana, slice mana, perilaku UI, edge case, dampak ke
   booking/WA/jadwal) dan tanyakan ke user — gunakan `AskUserQuestion` bila ada pilihan
   terstruktur.
2. **Konfirmasi pemahaman & rencana** sebelum perubahan yang tidak trivial: ringkas apa yang
   dikerjakan, file tersentuh, dan asumsi yang dipakai. Tunggu user mengiyakan.
3. **Konfirmasi ulang untuk aksi berisiko** (ubah `proxy.ts`, schema/migrasi, hapus/rename,
   perubahan lintas-role, kirim WA). Lebih baik tanya 10 detik daripada rollback 1 jam.
4. **Kalau konteks sudah jelas total** — permintaan eksplisit, tidak ada ambiguitas, dampak
   kecil/lokal — **tidak perlu bertanya atau konfirmasi**; langsung kerjakan. Jangan bertanya
   hanya demi formalitas.
5. **Setiap kali ada tanya-jawab, konfirmasi keputusan, atau perubahan flow** (alur booking,
   role/route, WA trigger, state machine, konvensi, atau asumsi baru) — **WAJIB update file
   `.md` dokumentasi di `apps/web-althea`** supaya dokumen tetap sinkron dengan realita.
   Jangan declare task selesai sebelum dokumen di-update.
   - Sasaran default: `apps/web-althea/CLAUDE.md` (agent guide). Update juga
     `apps/web-althea/README.md` bila menyangkut setup/quick start, dan
     `apps/web-althea/features/README.md` bila menyangkut pola slice.
   - Catat sebagai **fakta ringkas**, bukan log percakapan: keputusan + alasan singkat, flow
     baru/berubah, dan asumsi yang disepakati — berguna untuk sesi berikutnya.
   - Bila perubahan menyentuh status fitur, selaraskan juga `.planning/CHANGELOG.md` &
     `.planning/ROADMAP.md` di root monorepo.

## Tech Stack

- **Framework**: Next.js App Router (React 19, TypeScript strict)
- **Styling**: Tailwind CSS v4 + token di `styles/althea-tokens.css`
- **UI**: ShadCN-style (`components/ui/`), Radix UI, Lucide React, Sonner toast
- **Data fetching**: TanStack Query v5 (client), fetch di Server Component (server)
- **Table**: TanStack Table v8
- **Form**: react-hook-form + zod
- **Charts**: recharts (bukan ApexCharts)
- **E2E**: Playwright | Unit: Vitest
- **Font**: Lora (serif, headline) + Nunito Sans (body/UI)
- **Port**: **3202** (`WEB_ALTHEA_PORT`). Jangan hardcode.
- **Live domain**: https://althea.fr-labs.my.id/ (production, NPM reverse proxy + Let's Encrypt → `192.168.1.150:3202`). API: https://althea.fr-labs.my.id/api → `192.168.1.150:3203`. LAN fallback: `http://192.168.1.150:3202/`.

## Perintah

```bash
cd apps/web-althea
npm run dev          # next dev port 3202
npm run check        # lint + typecheck + vitest
npm run test:e2e     # playwright (butuh api-gateway + Docker up)
npm run build && npm start
npm run build:staging
```

## Layout Folder

```
app/
├── (auth)/login/          # Public, tidak di-prefix URL
├── admin/                 # clinic-admin — landing: /admin/jadwal
│   ├── (admin)/jadwal/    # Jadwal sesi (route group, sidebar landing admin)
│   ├── psikolog/          # CRUD tim psikolog
│   ├── layanan/           # CRUD service catalog
│   ├── rooms/             # CRUD + pemakaian ruangan
│   ├── clients/           # Daftar klien (pasien)
│   ├── daftar-jadwal/     # Daftar booking + state machine (was /admin/booking)
│   ├── users-roles/       # User & role management
│   ├── notif-wa/          # WA template editor + activity log
│   ├── audit-log/         # Audit trail
│   └── pengaturan/        # ClinicSettings (slot operasional)
├── psikolog/              # clinic-psikolog — landing: /psikolog/dashboard
│   ├── schedule/          # Jadwal saya
│   ├── patients/          # Klien saya
│   ├── sessions/          # Catatan klinis (SOAP)
│   ├── rooms/             # Ruangan (read-only)
│   └── profile/           # Profil (editable + avatar upload)
├── owner/                 # clinic-owner — KPI dashboard
├── resepsionis/           # clinic-resepsionis — check-in realtime (SSE)
├── marketing/             # clinic-marketing — read-only service catalog
├── intern/                # clinic-intern — placeholder
└── api/                   # Route handlers (auth proxy)

components/layouts/admin-shell/  # Sidebar + topbar (nav-config.ts per role)
features/<feature>/              # api/ hooks/ model/ ui/ — pattern slice MVP
shared/                          # auth/, api/, providers/, constants/, utils/, types/
styles/                          # globals.css, althea-tokens.css (palette sage/cream/teal)
proxy.ts                         # Auth guard + role-based redirect (was middleware.ts)
```

## 6 Role Internal

| Role                 | Path prefix       | Default landing          |
|----------------------|-------------------|--------------------------|
| `clinic-admin`       | `/admin/*`        | `/admin/jadwal`          |
| `clinic-psikolog`    | `/psikolog/*`     | `/psikolog/dashboard`    |
| `clinic-owner`       | `/owner/*`        | `/owner/dashboard`       |
| `clinic-resepsionis` | `/resepsionis/*`  | `/resepsionis/dashboard` |
| `clinic-marketing`   | `/marketing/*`    | `/marketing/dashboard`   |
| `clinic-intern`      | `/intern/*`       | `/intern/dashboard`      |

Admin bypass: `clinic-admin` boleh akses semua route.

## API Integration

- Browser fetch: `NEXT_PUBLIC_API_URL` (`ENV.API_URL`) — relative `/api` via NPM reverse proxy.
- **Server-side fetch** (Route Handler / SSR): `API_URL_INTERNAL` (`ENV.API_URL_INTERNAL`) — **wajib absolute** (`http://localhost:3203/api`). Relative URL di Node fetch → 502.
- Endpoint prefix: `/clinic/*` (e.g. `/clinic/booking`, `/clinic/psikolog`).
- DB table prefix: `clinic_*` (e.g. `clinic_booking`, `clinic_psikolog_profile`).
- Auth cookie: `sf_token` (shared dengan web-dashboard). Di-set client-side via `document.cookie` (NPM bypass Route Handler di prod — see CLAUDE.md).

## Design System

**Sage + Cream + Deep Teal** — therapeutic, calm, warm.

Token utama (`styles/althea-tokens.css`):
- Primary: `--sage-500` (#5b8a66)
- Background: `--cream-50` (#fbfaf6)
- Text: `--teal-800` (#142828)
- Accent anak: `--rose-500` (#c97a5d)

Service color coding (left border 4px + soft fill):
- Konseling → sage | Terapi dewasa → blue-grey | Terapi anak → rose | Tes psikologi → amber

Reference mockup di `apps/psychology-design/` — **JANGAN copy-paste langsung**; re-implement di `features/` + Tailwind.

## Konvensi Coding

- **Server Components** default. `"use client"` hanya untuk state/effect/event.
- Client data fetching: **TanStack Query saja** — jangan campur SWR.
- Form: react-hook-form + zod schema. Jangan controlled state manual untuk form panjang.
- Import alias: `@/*` → root app.
- Style: Tailwind utility-first, variant via `class-variance-authority`.
- Jangan masukkan API key ke `NEXT_PUBLIC_*`.

## Panduan Tugas Umum

### Tambah fitur baru
1. Buat slice `features/<nama>/` dengan sub-folder: `api/`, `hooks/`, `model/`, `ui/`
2. Buat page di `app/<role>/<path>/page.tsx`
3. Tambah item di nav-config (`components/layouts/admin-shell/nav-config.ts`) sesuai role

### Tambah halaman dalam role yang ada
1. Buat `app/<role>/<path>/page.tsx`
2. Kalau butuh data → buat hook di `features/<domain>/hooks/`
3. Kalau butuh navigasi sidebar → update `nav-config.ts`

### Edit booking wizard
- File utama: `features/booking/` (single-page form, auto-scroll cascade)
- Psikolog filter: pakai `psikologListFiltered` dari `use-wizard-state` (ADR 010)
- Slot validation: mirror `ClinicSettings.slotsOfDay` — backend enforce `assertSlotMatch`

### Edit WA template / trigger
- Template UI: `app/admin/notif-wa/`
- Trigger logika: `features/admin-notif-wa/`
- 18 template aktif; phone normalize + BullMQ retry sudah hardened

## Gotcha yang Sering Terjadi

- Hook React di Server Component → error build. Tambah `"use client"`.
- `useSearchParams` tanpa `<Suspense>` wrapper → crash.
- `new Date()` / `Date.now()` di first render → SSR hydration mismatch. Defer ke `useEffect` + `useState('')`.
- Server-side fetch pakai `ENV.API_URL` (relative) → 502. Pakai `ENV.API_URL_INTERNAL`.
- Import langsung dari `apps/psychology-design/*.jsx` → itu mockup, bukan source.
- Lupa `psikologListFiltered` filter by `serviceIds` di booking flow baru.
- Hardcode port 3202 → pakai `process.env.WEB_ALTHEA_PORT` atau `process.env.PORT`.

## Jangan Disentuh Tanpa Diminta

- `next.config.mjs` — sudah dituning Docker standalone.
- `proxy.ts` — auth/role guard global, ubah sangat hati-hati.
- `components/ui/*` upstream ShadCN — modifikasi via `cva` variant saja.
- `config/ports.json` di root monorepo.

## Status Fitur (per 13 Mei 2026)

14 slice MVP **delivered** (8 Mei 2026). Outstanding:
- ⏳ PWA proper icons (placeholder SVG)
- ⏳ Mobile QA real-device
- ⏳ Prisma migration drift reconcile

Tracking: `.planning/ROADMAP.md` (status per slice) + `.planning/CHANGELOG.md` (daily commits).
