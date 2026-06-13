# web-althea — Agent Guide

Aplikasi internal **Althea Psychology** untuk manajemen klinik psikologi (6 role staff di 1 app, role-based routing). Berbasis Next.js App Router dengan stack mirror `web-dashboard` tapi ramping (drop TF.js, MediaPipe, ApexCharts, dnd-kit, leaflet, exceljs).

> **PENTING**: pasien TIDAK login ke app. Pasien hanya entitas data + recipient WA notification. Booking adalah **admin-driven**.

## Domain — 6 Internal Staff Roles

Prefix `clinic-` di Role table (m0_role) untuk distinguish dari ERP roles. Lihat ADR 003.

- **clinic-admin** — full scheduling, client CRUD, room allocation, WA template, settings
- **clinic-psikolog** — own schedule, mark complete, clinical notes
- **clinic-owner** — KPI dashboard (sessions/day, utilization %, revenue)
- **clinic-resepsionis** — real-time check-in (berlangsung/menunggu/antar) + walk-in booking
- **clinic-marketing** — read-only service catalog & capacity
- **clinic-intern** — minimal access (placeholder)

Service types: konseling (5), terapi dewasa & anak + paket bulanan (9), tes psikologi (13) — total 27 service catalog (per 27 Mei 2026, lihat section "Catalog seed 27 Mei 2026" di bawah).

## Stack
- **Next.js 16+ (App Router)**, React 19, TypeScript strict.
- **TanStack Query v5** untuk data fetching client-side.
- **TanStack Table v8** untuk admin tables.
- **Tailwind CSS v4** + **ShadCN-style** komponen di `components/`.
- **react-hook-form** + **zod** untuk forms.
- **radix-ui** untuk a11y primitives, **lucide-react** ikon, **sonner** toast.
- **recharts** kalau butuh chart (bukan ApexCharts).
- E2E: **Playwright**. Unit: **Vitest**.
- Font: **Lora** (serif, headlines/wordmark) + **Nunito Sans** (body/UI) — via Google Fonts.

## Port
3202 (env `WEB_ALTHEA_PORT`). Lihat `config/ports.json` di root monorepo. Jangan hardcode.

## Deployment URL Mapping

| Public URL | Routes ke (internal) |
|---|---|
| **`https://althea.fr-labs.my.id/`** | `http://192.168.1.150:3202/` (web-althea, this app) |
| **`https://althea.fr-labs.my.id/api`** | `http://192.168.1.150:3203/api` (api-gateway, NestJS) |

Reverse proxy: NPM (Nginx Proxy Manager) di server, Let's Encrypt SSL aktif. DNS A record di Cloudflare `althea` → `202.59.200.26`. Same-origin strategy → `NEXT_PUBLIC_API_URL=/api` (relative). Detail di `.planning/ADRs/009-deployment-url-mapping.md`.

LAN direct fallback (skip NPM): `http://192.168.1.150:3202/` (web), `http://192.168.1.150:3203/api/*` (api).

### Client-side vs Server-side API URLs

Two separate env vars — pick correct one per context:

| Var | Used in | Format | Example |
|---|---|---|---|
| `NEXT_PUBLIC_API_URL` (`ENV.API_URL`) | **Browser fetch** (lib/api-client, hooks) | Relative atau absolute | `/api` (same-origin via NPM) |
| `API_URL_INTERNAL` (`ENV.API_URL_INTERNAL`) | **Server-side fetch** (Route Handler `app/api/**/route.ts`, SSR) | **Wajib absolute** (Node fetch tidak punya base) | `http://localhost:3203/api` |

⚠️ **Gotcha**: Kalau Route Handler proxy ke api-gateway pakai `ENV.API_URL` (relative `/api`) → 502 Bad Gateway karena Node fetch reject relative URL. Selalu pakai `ENV.API_URL_INTERNAL` di server-side.

## Perintah
```bash
npm run dev            # next dev di port 3202
npm run build && npm start
npm run check          # lint + typecheck + vitest
npm run test:e2e       # playwright (butuh api-gateway up)
npm run build:staging  # pakai .env.staging
```

## Layout

```
app/                           # Next.js App Router (flat routes, no route groups untuk role)
├── (auth)/                    # Public routes — login only (route group, no URL prefix)
│   └── login/
├── admin/                     # Role: clinic-admin (full access)
│   ├── (admin)/jadwal/        # ← admin landing (Jadwal, route group; was schedule/)
│   ├── psikolog/              # CRUD tim psikolog
│   ├── layanan/               # CRUD service catalog
│   ├── rooms/                 # CRUD + pemakaian ruangan
│   ├── clients/               # Daftar pasien (admin-driven)
│   ├── daftar-jadwal/         # Daftar booking + state machine (was booking/)
│   ├── users-roles/           # User & role management
│   ├── notif-wa/              # WA template editor + activity log
│   ├── audit-log/             # Audit trail
│   ├── pengaturan/            # ClinicSettings (slot operasional, dll)
│   └── dashboard/             # (legacy, masih ada, tapi sidebar landing ke /admin/jadwal)
├── psikolog/                  # Role: clinic-psikolog (own-data only, BR-04)
│   ├── dashboard/             # ← psikolog landing
│   ├── schedule/              # Jadwal saya (Hari/Minggu/Bulan + filter)
│   ├── patients/              # Klien saya
│   ├── sessions/              # Catatan klinis (SOAP editor)
│   ├── rooms/                 # Pemakaian Ruangan (read-only, klinis context)
│   └── profile/               # Profil saya (editable subset: nama/title/bio/color/avatar)
├── owner/                     # Role: clinic-owner — KPI dashboard
├── resepsionis/               # Role: clinic-resepsionis — status board check-in
├── marketing/                 # Role: clinic-marketing — read-only service catalog
├── intern/                    # Role: clinic-intern — placeholder
├── api/                       # Route handlers (auth proxy — NPM bypass dipatch via client-side cookie)
├── layout.tsx                 # Root layout (providers, fonts, theme)
└── page.tsx                   # Root → redirect ke /login (atau role default route)

components/                    # ShadCN-style UI primitives + komponen presentational
├── layouts/admin-shell/       # Sidebar + topbar shell (NAV per role)
features/                      # Feature modules per domain (pattern api/, hooks/, model/, ui/, lib/)
hooks/                         # Custom hooks lintas-feature
lib/                           # Utilities, api-client, helpers
config/                        # Konstanta runtime (urls, paths, dll)
shared/                        # auth/, api/, providers/, constants/, utils/, types/
styles/                        # globals.css (Tailwind + tokens) + althea palette
public/                        # Static assets (logo, images)
proxy.ts                       # Auth guard + role-based redirect (Next.js 16 proxy convention; was middleware.ts)
types/                         # Type definitions global
```

**Note pattern**: Route groups `(auth)/`, `(admin)/`, dll **TIDAK dipakai** untuk role separation — route role pakai flat folder `admin/`, `psikolog/`, dst supaya URL match prefix. Hanya `(auth)/` yang masih route group karena login adalah unprotected public.

### Pattern feature module (sama dengan web-dashboard)
```
features/<feature-name>/
├── api/      # Fetch functions (panggil api-gateway via lib/api-client)
├── hooks/    # TanStack Query hooks (useQuery, useMutation)
├── model/    # Types, zod schemas, util domain
└── ui/       # Komponen presentational + page composition
```

## Konvensi
- **Server components** by default. `"use client"` hanya saat butuh interaktivitas (state, effect, event handler).
- **Data fetching**:
  - Server: fetch di Server Component / Route Handler (pakai `lib/api-client.ts` dengan `cache: 'no-store'` untuk data dinamis).
  - Client: TanStack Query. **Jangan campur dengan SWR.**
- **Form**: `react-hook-form` + zod schema. Jangan controlled state manual untuk form panjang.
- **Style**: Tailwind utility-first. Variant pakai `class-variance-authority`. Token dari `styles/althea-tokens.css` (sage/cream/teal palette).
- **Import alias**: `@/*` → root (lihat `tsconfig.json`).
- **Auth**: cookie `sf_token` (sama dengan web-dashboard) di-set oleh `api-gateway`. Cek `proxy.ts` untuk guard.
- **JANGAN** masukkan API key ke `NEXT_PUBLIC_*` kecuali memang public.

## Design System

### Brand
**Sage + Cream + Deep Teal** — therapeutic, calm, warm. Bukan blue/zinc seperti web-dashboard.

Token utama (di `styles/althea-tokens.css`):
- Primary: `--sage-500` (#5b8a66)
- Background: `--cream-50` (#fbfaf6)
- Text: `--teal-800` (#142828)
- Accent terapi anak: `--rose-500` (#c97a5d)

Service color coding (4px left border + soft fill di schedule cards):
- Konseling: sage
- Terapi (dewasa): blue-grey
- Terapi anak: rose
- Tes psikologi: amber

### Typography
- `--font-serif: 'Lora'` — wordmark, h1, headlines (warm, book-like)
- `--font-sans: 'Nunito Sans'` — body, UI (soft humanist)

### Reference designs
Mockup di `apps/psychology-design/` — JSX HTML/CSS, **bukan production code**. Tugas: implement visual pixel-perfect, tapi pakai pattern Next.js + features/ + Tailwind. Jangan copy struktur prototypenya.

File mockup penting:
- `BookingWizard.jsx` — flow booking pasien
- `AdminPsikolog.jsx` / `AdminLayanan.jsx` / `AdminRooms.jsx` — admin CRUD
- `PsikologDashboard.jsx` / `PsikologJadwalSaya.jsx` — psikolog views
- `MobilePsikolog.jsx` / `MobileAdmin.jsx` — mobile layouts
- `althea.css` + `colors_and_type.css` — design tokens (sudah di-port ke `styles/`)
- `DESIGN-SYSTEM.md` — handoff notes
- `PROJECT-NOTES.md`, `JAWABAN-PERTANYAAN-KLIEN-2026-05-07.md` — domain context

## API Integration
- Base URL dari `NEXT_PUBLIC_API_URL` → `api-gateway` (3203 di dev, prod beda).
- Endpoint psychology: prefix **`/clinic/*`** (e.g. `/clinic/psikolog`, `/clinic/booking`, `/clinic/booking/:id/note`). Lihat ADR 002.
- DB: `api-gateway` pakai table prefix **`clinic_*`** di public schema (e.g. `clinic_psikolog_profile`, `clinic_booking`). Lihat ADR 006.
- Auth: cookie `sf_token` di-set client-side via `document.cookie` setelah login (NPM bypass Next.js Route Handler — lihat ADR 009 + bug fix `8682443`).

### Strategi backend (ADR ringkas)
Saat ini: **Opsi A (extend `api-gateway`)** dengan namespace `/clinic/*` dan table prefix `clinic_*`. Alasan: cepat go-MVP, share auth & user table.

Future migration: **extract ke `api-clinic` service** (port 3204, slot reserved) saat traffic/team membesar atau scope compliance perlu isolated. Frontend tidak perlu berubah — `api-gateway` tetap edge proxy.

### Auth cookie flow (NPM bypass gotcha)
NPM (reverse proxy production) forward `/api/*` LANGSUNG ke `api-gateway:3203`, bypass Next.js. Akibatnya Route Handler `app/api/auth/login/route.ts` yang seharusnya set HttpOnly cookie **tidak pernah jalan** di prod. Workaround: `useLogin` hook set `sf_token` cookie client-side via `document.cookie` dari token response body (Secure + SameSite=Lax, JS-readable). Trade-off XSS risk acceptable untuk MVP karena tidak ada user-generated HTML. Logout sama: clear cookie client-side.

## Role-based routing

`proxy.ts` cek cookie + role claim dari JWT (`roles: string[]`), pick first `clinic-*` role, redirect ke path sesuai:

| Role                   | Path prefix           | Default landing            |
|------------------------|-----------------------|----------------------------|
| `clinic-admin`         | `/admin/*`            | **`/admin/jadwal`**        |
| `clinic-psikolog`      | `/psikolog/*`         | `/psikolog/dashboard`      |
| `clinic-owner`         | `/owner/*`            | `/owner/dashboard`         |
| `clinic-resepsionis`   | `/resepsionis/*`      | `/resepsionis/dashboard`   |
| `clinic-marketing`     | `/marketing/*`        | `/marketing/dashboard`     |
| `clinic-intern`        | `/intern/*`           | `/intern/dashboard`        |
| (no token)             | `/login`              | `/login`                   |

Admin bypass: `clinic-admin` boleh akses semua route. Role lain hanya prefix mereka (per `ROLE_ROUTE_PREFIXES` di `shared/auth/constants.ts`).

**Admin landing = `/admin/jadwal`** (Jadwal, sesuai sidebar nav pertama). Bukan `/admin/dashboard` (legacy, masih ada tapi tidak di sidebar nav).

Token cookie name: `sf_token` (shared dengan web-dashboard untuk SSO). Set client-side via `document.cookie` setelah login response (NPM bypass — lihat section "Auth cookie flow" di atas).

### Sidebar nav per role (canonical source: `components/layouts/admin-shell/nav-config.ts`)

**Admin** — 3 group (Operasional / Manajemen / Sistem):
- Operasional: Jadwal, Klien, Ruangan
- Manajemen: Psikolog, Layanan, Notifikasi WA
- Sistem: Daftar Jadwal, Audit log, User & Role, Pengaturan

**Psikolog** — 3 group (Praktik / Klinis / Akun):
- Praktik: Dashboard, Jadwal saya, Klien saya
- Klinis: Catatan klinis, Ruangan (read-only)
- Akun: Profil saya

**Owner** — single group, 4 item:
- Dashboard (`/owner/dashboard`) — KPI strip + tren periode (Harian/Mingguan/Bulanan).
- Analitik (`/owner/analitik`) — performa psikolog + utilisasi ruangan + top services (mengikuti filter periode).
- Jadwal Psikolog (`/owner/jadwal`) — grid `OwnerScheduleSection` (Hari/Minggu/Bulan, read-only mirror admin).
- Pemakaian Ruangan (`/owner/ruangan`) — grid `RoomUsageSection` Slot × Ruangan untuk hari ini (read-only, klik sel buka detail panel).

Halaman **Dashboard & Analitik** share **filter periode** (Harian / Mingguan / Bulanan) lewat `OwnerPeriodToolbar` di atas. State periode di-sync ke URL (`?period=&date=`) supaya pindah Dashboard ↔ Analitik mempertahankan pilihan user. Semua widget agregat di kedua halaman (KPI, tren, performa psikolog, utilisasi ruangan group, top services) re-compute dari satu `useBookingList({ dateFrom, dateTo })` di hook `use-owner-dashboard`. Tren bar adaptif: Harian = 6 bar per slot operasional; Mingguan = 7 bar per hari (Sen–Min); Bulanan = N bar per hari.

Halaman **Jadwal Psikolog** & **Pemakaian Ruangan** punya state tanggal sendiri (default hari ini) — tidak terpengaruh filter periode dashboard. Alasan: keduanya konsumen tampilan per-hari (grid slot vs ruangan), bukan agregat lintas periode.

`OwnerScheduleSection` di `features/owner-dashboard/ui/` adalah wrapper khusus owner yang re-use `HariView` / `MingguView` / `BulanView` + `FilterPopover` dari `features/admin-schedule` tapi build toolbar sendiri (read-only, tanpa "Jadwal Baru" & tanpa wizard). Klik booking buka `BookingDetailDialog` read-only. Component admin-schedule tidak disentuh — pattern: bila role lain mau pakai grid admin read-only, buat wrapper khusus bukan modif shared.

Marketing / Intern: single-page dashboard (1 item).

**Resepsionis** — single group (Utama), 5 item:
- Dashboard (`/resepsionis/dashboard`)
- Jadwal (`/resepsionis/jadwal`) — reuse `OwnerJadwalPage` dari `features/owner-dashboard` (grid read-only mirror admin/jadwal). Hari/Minggu/Bulan view, klik kartu buka detail. Tidak ada tombol "Jadwal Baru".
- Ruangan (`/resepsionis/ruangan`) — reuse `OwnerRuanganPage` dari `features/owner-dashboard` (grid Slot × Ruangan hari ini, read-only). Klik sel buka detail panel.
- Daftar Jadwal (`/resepsionis/daftar-jadwal`) — reuse `BookingPage` dari `features/admin-booking` dengan prop `canCreate={false}` (resepsionis boleh lihat + ubah status + reschedule + cancel, tapi tidak boleh create booking baru via menu ini). Tombol "Jadwal Baru" disembunyikan.
- Klien (`/resepsionis/clients`, detail `/resepsionis/clients/[id]`) — reuse `ClientsPage` + `ClientDetailPage` dari `features/admin-clients` dengan prop `basePath="/resepsionis/clients"`, `schedulePath="/resepsionis/daftar-jadwal"`, dan `canCreate={false}`. Resepsionis hanya bisa lihat / edit / hapus — **tombol "Klien Baru" (toolbar desktop & FAB mobile) tidak tampil**. Tambah klien baru hanya bisa dilakukan oleh admin. `basePath` & `schedulePath` di-thread ke `DetailHeader` supaya link "Kembali" dan "Jadwalkan" tetap di prefix `/resepsionis/*` (tidak ke-bounce role guard).

Pattern reuse halaman antar-role: tambahkan prop `basePath` (dan `schedulePath` bila perlu link cross-feature) di komponen feature, default ke path admin. Route mount per-role tinggal pass prop yang sesuai. Tetap di prefix masing-masing role supaya `proxy.ts` & `ROLE_ROUTE_PREFIXES` tidak perlu diubah.

## Mobile responsive
**Desktop-first** — primary target laptop/desktop. Tapi **wajib accessible di mobile** (responsive breakpoints Tailwind):
- `sm` 640px, `md` 768px, `lg` 1024px, `xl` 1280px
- Patient routes: lebih agresif mobile-friendly (target mahasiswa/karyawan akses dari HP)
- Admin routes: optimized desktop, tetap usable di tablet

### Admin mobile web (per 18 Mei 2026)
Mengikuti prototype "Mobile · Admin Klinik". Pola **dedicated mobile view per halaman**, bukan sekadar reflow:
- **Pattern**: tiap halaman admin punya komponen `*-mobile.tsx` di folder `ui/` feature-nya, render dengan `lg:hidden`; layout desktop lama dibungkus `hidden lg:flex` / `hidden lg:block`. Komponen mobile **reuse state & data dari page component** (props), tidak fetch ulang. Dialog/drawer (form create, CRUD, send-test) dipindah ke luar wrapper desktop supaya tetap kebuka dari FAB mobile.
- **Bottom tab bar**: `components/layouts/admin-shell/admin-bottom-tabs.tsx` — `lg:hidden`, hanya untuk `role === 'admin'`, 5 tab (Jadwal · Klien · Ruangan · WA · Lainnya). Tab "Lainnya" membuka sidebar drawer (`onOpenMore` → `setMobileOpen(true)`). `<main>` admin diberi `pb-16 lg:pb-0` supaya konten tidak ketutup tab bar; FAB pakai `bottom-20`.
- **Mobile topbar** (`mobile-topbar.tsx`): avatar+nama+role (tap → buka menu), judul halaman (`meta.title`), bell. Status bar device (signal/wifi/battery) di prototype = chrome OS, **tidak** diimplementasi.
- **Halaman tercakup**: Jadwal (date pills + 3 stat tile + list sesi badge "now" + FAB), Klien (search + filter chips bercount + card list + FAB), Ruangan (2 stat tile dipakai/kosong + card status per ruangan), Notif WA (full desktop view — 4 stat tiles + TemplateList + ActivityLog + TemplateEditor — stacked single-column via `grid-cols-1 lg:grid-cols-[...]`; **tidak pakai komponen mobile terpisah**, `notif-wa-mobile.tsx` sudah tidak dipakai di page). Mobile selalu tampilkan view "Hari" untuk Jadwal (tidak ada switch Minggu/Bulan).
- **Gotcha**: `Date.now()`/`new Date()` no-arg dilarang di render & `useMemo` oleh lint `react-hooks/purity` — derive "now" via `useState(0)` + `useEffect(() => setNowMs(Date.now()), [])` lalu pakai `nowMs` (lihat `rooms-mobile.tsx`).

### Psikolog mobile web (per 18 Mei 2026)
Mengikuti prototype "Mobile · Staff Psikolog" (6 layar). Pola identik dengan admin mobile (dedicated `*-mobile.tsx`, `lg:hidden`, desktop `hidden lg:*`, reuse state via props):
- **Bottom tab bar**: `components/layouts/admin-shell/psikolog-bottom-tabs.tsx` — `lg:hidden`, `role === 'psikolog'`, **4 tab** (Hari ini · Jadwal · Klien · Saya → `/psikolog/dashboard|schedule|patients|profile`). Tidak ada tab "Lainnya"; Catatan klinis & Ruangan read-only diakses via sidebar drawer (tap avatar topbar). `<main>` `pb-16` juga untuk role psikolog.
- **Hari ini** (`dashboard-mobile.tsx`): tanggal serif + hero "sesi berikutnya · N menit lagi" (derive dari `todayBookings` + `nowMs`) + list sesi + prompt availability (link ke schedule).
- **Jadwal saya** (`schedule-mobile.tsx`): toggle Hari/Minggu (`page.setView`), day pills bercount (badge jumlah sesi/hari), 3 stat tile (sesi/kapasitas%/klien unik), list sesi hari terpilih, footnote info reschedule, tombol Atur availability. Tap pill di Minggu = pilih hari (tidak ganti view); di Hari = set anchor.
- **Klien saya** (`patients-mobile.tsx`): search, banner privasi, filter chips (Semua/Aktif/Baru/Selesai) bercount, card (avatar+risk dot, status badge, progress sesi, next). Tidak ada route detail klien psikolog → `onSelect` hanya set `selectedId` (aside desktop-only).
- **Profil saya** (`profile-mobile.tsx`): avatar besar + nama + title + `specialty` chips, 4 stat 30-hari, menu list (Atur availability→schedule, Edit profil→dialog, sisanya inert placeholder), tombol Keluar (`performLogout`).
- **Availability mingguan**: `availability-dialog.tsx` dibuat full-screen di mobile (`items-stretch`, no rounded/max-w) + editor mobile baru di tab Weekly = day pills (DAY_KEYS, badge `sel/total`) + checklist slot per hari terpilih (`mDay` state). Tabel hari×slot tetap dipakai di `lg`. Override tab dibiarkan apa adanya.

### Keputusan UI copy & detail (per 18 Mei 2026)
- **Tidak ada kode `BR-0x` di UI**: semua referensi business-rule code (`BR-01`, `BR-04`, dst) dihapus dari teks yang tampil ke user — kalimat penjelas tetap, hanya token kode dibuang. Berlaku juga di comment kode (grep `BR-[0-9]` di `apps/web-althea` harus 0). Alasan: kode internal tidak relevan untuk staff. Jangan tambahkan lagi label `BR-xx` di string UI.
- **Detail Ruangan mobile**: tap kartu ruangan di `rooms-mobile.tsx` membuka `room-detail-sheet-mobile.tsx` (bottom-sheet) — info ruangan + status sekarang + sesi hari ini + fasilitas + aksi (Edit master→CRUD drawer, Nonaktif/Hapus via `page.deactivateRoom`/`deleteRoom`). Reassign-booking TIDAK ada di mobile (butuh konteks slot grid desktop). `RoomsMobile` props sekarang `onEditMaster/onDelete/onDeactivate(room)` (bukan `onPick`).
- **Kolom slot vertikal (grid jadwal & ruangan)**: tampilkan **nama label slot** (`slot.label`, mis. "Slot 1", "Slot 2", dari ClinicSettings.slotsOfDay), fallback `Slot ${idx+1}` kalau label kosong. **Tidak** tampilkan jam (`slot.start`/`slot.end`) di kolom ini. Berlaku di `admin-rooms/room-usage-grid` (dipakai /admin/rooms + /owner/ruangan + /psikolog/rooms), `admin-schedule` HariView & MingguView (/admin/jadwal + /owner/jadwal), dan `psikolog-schedule` hari-view & week-grid (/psikolog/schedule). Alasan: jam redundan di kolom sempit; staff identifikasi slot via nama label yang di-set admin di Pengaturan → Slot Operasional.
- **Login**: aside brand jadi `hidden lg:flex` (inline `display`/`flex-basis` dipindah ke class Tailwind supaya bisa di-hide); panel form full-width di mobile + wordmark Althea kecil di atas card (`lg:hidden`).

## Layout & spacing convention

**Page padding standar: `p-6` (24px semua sisi)**

- Setiap `page.tsx` yang me-render konten langsung (bukan pure wrapper ke feature component) **wajib** punya `className="... p-6"` di outer div-nya.
- Jangan pakai `p-4 lg:p-8` atau inline `style={{ padding: N }}` — selalu gunakan class `p-6`.
- Pages yang merupakan pure wrapper (`return <FeatureComponent />`) tidak perlu `p-6` di page.tsx karena feature component mengatur spacing-nya sendiri.
- Feature components yang full-height (`flex`, sidebar layout, grid 3-kolom) mengatur padding internal sendiri per section — **jangan** bungkus dengan `p-6` dari luar karena akan double-pad.

## Hal yang sering bikin masalah
- Pakai hook React di Server Component → error build. Mark `"use client"` saat butuh state/effect.
- Lupa wrap `<Suspense>` saat pakai `useSearchParams` di client component.
- Import dari `apps/psychology-design/*.jsx` langsung — itu **mockup**, bukan source-of-truth. Re-implement di `features/`/`components/`.
- Hardcode port 3202 — pakai env `WEB_ALTHEA_PORT` atau `process.env.PORT`.
- Lupa role check di middleware → patient bisa akses route admin.
- **SSR hydration mismatch** dari `new Date()` / `Date.now()` di first render → defer ke `useEffect`. Pattern: `useState('')` + `useEffect(() => setX(todayKey()))`. Lihat `app/psikolog/schedule/page.tsx`.
- **`Date.toISOString().slice(0,10)` bocor tanggal UTC, bukan WIB** — di filter "Hari ini" / "Besok" `daftar-jadwal` dulu bug: ISO UTC dipakai sebagai `date=YYYY-MM-DD` query, sementara backend bangun range pakai `setHours(0,0,0,0)` di TZ container UTC. Akibat: booking 20 Mei 06:30 WIB (= 19 Mei 23:30 UTC) muncul saat filter "Hari ini" 19 Mei. **Fix (19 Mei 2026)**: frontend pakai `toLocalDateKey` (komponen tanggal lokal, mirror `toDateKey` di `wizard-utils.ts`); backend `ClinicBookingService.findAll` bangun range pakai `localDateAtMidnight(dateStr, tz)` + `localDateAtMidnight(nextDay, tz)` dengan `lt` (bukan `lte`). Berlaku juga untuk `dateFrom`/`dateTo`. Pelajaran: jangan pakai `toISOString().slice(0,10)` untuk YYYY-MM-DD lokal — selalu derive dari komponen `getFullYear`/`getMonth`/`getDate`.
- **Lupa filter psikolog by `serviceIds`** di custom flow — kalau bikin booking flow baru, pakai `psikologListFiltered` dari `use-wizard-state` atau replicate logic (ADR 010).
- **Owner trend "Distribusi sesi per slot" pernah selalu 0**: `computeTrend` mode Harian dulu (1) bandingkan `scheduledStart.slice(11,16)` (jam UTC dari ISO) terhadap slot start WIB → mismatch; (2) pakai strict equality `hhmm === slot.start` → miss booking walk-in/override yang tidak persis di boundary. **Fix (19 Mei 2026)**: konversi ISO → komponen WIB via `Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Jakarta' })` (helper `wibParts`), lalu match dengan **range containment** `hhmm >= s.start && hhmm < s.end`. Berlaku juga untuk Mingguan/Bulanan (`dateKey === key`) supaya booking pagi WIB (= sore UTC) ter-attach ke hari yang benar. Pelajaran umum: backend simpan `scheduled_start` UTC; setiap UI yang bucketing per slot/hari **wajib** konversi ke WIB dulu.
- **`limit > 500` ke `/clinic/booking` → 400 Bad Request** (`limit must not be greater than 500`). Backend DTO cap di 500. Akibat di UI: TanStack Query error → `data` undefined → semua agregat = 0 → halaman terlihat "statis/blank". Pernah bikin Owner Dashboard & Analitik tampak kosong total (fix 19 Mei 2026: `useOwnerDashboard` dulu `limit: 1000`). Pakai `limit: 500` (cukup untuk window terbesar Owner = 1 bulan ≈ 30 hari × 6 slot × <N psikolog).
- **`502 Bad Gateway` di `/api/*` (login dll)** → api-gateway down. Penyebab umum: container `sentient-infra-api-gateway` punya `node_modules` di **named volume terpisah** (bukan bind-mount), jadi setelah ubah `prisma/schema.prisma` Prisma client di container jadi stale → `tsc --watch` gagal compile (ratusan TS `Property 'erpX' does not exist on PrismaService`) → Node tidak listen → connection reset → NPM balas 502. Fix: `docker exec sentient-infra-api-gateway sh -c 'cd /app && npx prisma generate'`, tunggu tsc recompile (`docker logs sentient-infra-api-gateway` → "Nest application successfully started"). Selalu `prisma generate` **di dalam container** setelah schema change, bukan cuma di host.

## Domain konvensi (Althea-specific)

### Booking flow (ADR 008 + 010 + 011)
- **Single source of truth slot**: `ClinicSettings.slotsOfDay` (6 slot harian, WIB). Booking harus pas dengan slot — backend enforce via `assertSlotMatch(start,end,serviceId?)`. Frontend `DateStrip` + slot picker mirror logic ini.
- **Slot range per-layanan (override)**: `ClinicService.slotOverrides` (JSON `[{index,start,end}]`) boleh **menggeser range waktu** slot tertentu untuk layanan itu. **Identitas slot (jumlah, label, urutan, index) TETAP dari `slotsOfDay` global** — override hanya start/end; slot tanpa override mewarisi waktu global. Index hasil tetap sejajar global ⇒ `slotIndices` availability psikolog tetap valid (availability psikolog tetap acuan slot global). Resolusi via `resolveServiceSlots(global, overrides, disabledIndices?)` — ada di backend `clinic-booking/slot-resolve.util.ts` & frontend `features/admin-layanan/model/slot.ts` (mirror). `assertSlotMatch` validasi terhadap slot ter-resolve yang **enabled** (filter `!s.disabled`) bila `serviceId` dikirim (fallback global bila tidak). Editor: **Admin → Layanan → Edit → Slot yang Dipakai Layanan Ini**; ringkasan read-only di **Pengaturan → Slot Operasional → Slot Khusus per Layanan**.
- **Slot nonaktif per-layanan** (per 27 Mei 2026): `ClinicService.disabledSlotIndices` (JSON `number[]`, mis. `[0,5]`) berisi index slot global yang **tidak dipakai** layanan ini (mis. layanan cuma 4 dari 6 slot). Identitas slot tetap (panjang array hasil resolusi sama dengan global) — `resolveServiceSlots` menandai slot terkait dengan flag `disabled: true`, panjang & index tidak berubah supaya mapping slot lintas-layanan (mis. `booking-transitions.editBooking` ambil slot di index yang sama di service baru) tetap konsisten. Konsumen tampilan (`SlotGrid` di booking wizard, `service-slot-summary`) tinggal filter `!slot.disabled`. Booking ke slot disabled ditolak `assertSlotMatch` (filter `!s.disabled` sebelum match). `booking-transitions.editBooking` melempar 400 kalau service baru men-disable slot di index booking saat ini (admin diminta reschedule dulu). UI editor: checkbox per slot di **Admin → Layanan → Edit** — uncheck = nonaktif (input waktu juga ikut disabled, tombol Reset disabled). Migration: `20260527_004_clinic_service_disabled_slot_indices`.
- **Psikolog availability cascade**:
  1. Date override (`ClinicPsikologDateOverride`) — priority untuk tanggal exact
  2. Weekly recurring (`ClinicPsikologProfile.weeklyAvailability`) — fallback
  3. Empty `{}` → "belum set" → block booking
- **Service ↔ Psikolog**: junction `ClinicPsikologService`. Kosong = handle semua. Filter di booking wizard via `psikologListFiltered`.
- **Kuota harian → encoding** (konvensi, per 12 Jun 2026): tidak ada kolom cap sesi per-hari terpisah. "Kuota harian N" untuk suatu hari di-encode sebagai `weeklyAvailability[day].slotIndices = N slot paling pagi [0..N-1]` (mis. kuota 2 → `[0,1]` = slot 08:30 & 10:00). Hari tanpa kuota → `{ isOpen: false, slotIndices: [] }`; Minggu selalu tutup. `defaultSlots` = kuota maksimum lintas-hari (dipakai display kapasitas Owner Dashboard, bukan enforcement). Jadi yang benar-benar membatasi jumlah booking/hari adalah panjang `slotIndices`, bukan `defaultSlots`.
- **No past booking**: wizard tambah jadwal tidak boleh pilih tanggal/jam lampau. `DateStrip` tandai tanggal < hari ini sebagai status `past` (disabled, label "Lewat"); slot dengan jam mulai ≤ sekarang di-block saat tanggal = hari ini (di-strip dari `SlotGrid`). Helper di `booking-wizard/wizard-utils.ts`: `todayDateStr`, `isPastDate`, `pastSlotIdx` — dipakai single-session (`use-wizard-state`) & multi-session (`session-row`). Default sesi 1 = H+1 jadi aman by default. Backend `assertSlotMatch`/validasi jam tetap last-line enforcement.
- **Timezone**: semua HH:MM/dow comparison di TZ klinik (`Asia/Jakarta`), bukan server TZ. Backend pakai `localPartsInTimezone()`. Frontend: tampilkan `Date.toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })` kalau butuh display.

### Availability psikolog — aturan akses & batasan (per 9 Jun 2026)

**Siapa yang atur apa:**
- **Jadwal mingguan recurring** (`ClinicPsikologProfile.weeklyAvailability`) → **hanya admin** yang bisa set, via `/admin/psikolog` → edit profil psikolog. Role `clinic-psikolog` **dilarang** mengubah jadwal mingguan mereka. UI profil psikolog (`/psikolog/profile`) hanya menampilkan weekly grid sebagai **read-only** (referensi). Jangan tambahkan editor weekly availability ke halaman psikolog.
- **Override per-tanggal** (`ClinicPsikologDateOverride`) → psikolog bisa set sendiri via `/psikolog/schedule` → Override calendar / dialog. Dua jenis: **Cuti** (`isOpen: false`) dan **Buka khusus** (`isOpen: true`, bisa subset slot).

**Batasan H+5 untuk override yang mengurangi jadwal:**
- Override yang **menutup penuh** (`isOpen: false` = cuti) **tidak boleh** dilakukan jika tanggal target berjarak ≤ 5 hari dari hari ini.
- Override yang **mengurangi slot** dari override yang sudah ada (mis. 6/6 → 5/6 saat `isOpen: true`) **juga tidak boleh** jika ≤ H+5.
- Override yang **menambah/membuka** jadwal (buka slot lebih banyak, atau buka hari libur) **bebas** kapan saja.
- Enforce di frontend (`handlePopoverSave` di `availability-calendar.tsx`) **dan** backend (`PsikologAvailabilityService.upsertOwnDateOverride` — lempar `BadRequestException` 400).
- Pesan error: *"Jadwal tidak bisa ditutup/dikurangi dalam 5 hari ke depan. Hubungi admin untuk perubahan mendadak."*

**Jangan** menambahkan kemampuan edit weekly availability ke role psikolog walau diminta — ini keputusan deliberate (admin adalah satu-satunya gatekeeper jadwal mingguan).

### Booking wizard pattern (ADR 011)
- Single-page form (4 section vertical scroll, no step navigation)
- Auto-scroll cascade saat user pick (via `useEffect` + `ref.scrollIntoView`)
- Searchable combobox untuk client, chip grid untuk service, card grid untuk psikolog, DateStrip + slot button grid untuk jadwal
- `Idempotency-Key` header per submit (`apiClient` set otomatis untuk mutation)

### Ubah Layanan via wizard mode (status check-in atau selesai, per 27 Mei 2026)
Tombol **Ubah Layanan** (icon `Replace`) di `/admin/daftar-jadwal` (kolom Aksi) + `client-detail-page` (bookings section) — muncul saat `status === 'checked_in'` **atau** `status === 'completed'`. Reuses `features/admin-booking/ui/booking-wizard.tsx` dalam **edit mode** via prop `editingBooking?: Booking`. Scope sengaja sempit: **hanya ganti layanan**, psikolog & jadwal tetap.

**Dua mode dengan perilaku berbeda:**
- **`checked_in`** (active edit): validasi penuh — psikolog handle service (junction), `assertSlotMatch` (hormati `slotOverrides`), `assertNoConflict`/`assertNoRoomConflict` (exclude self). `scheduledStart`/`scheduledEnd` auto-resolve via slot INDEX kalau client tidak kirim eksplisit (slot identity konsisten lintas-layanan; durasi bisa beda). Use case: klien baru datang & admin sadar salah pilih layanan saat booking sebelum sesi dimulai.
- **`completed`** (recategorisasi historis): sesi sudah lewat → `scheduledStart`/`scheduledEnd` **TETAP** meskipun layanan baru punya durasi berbeda. Auto-resolve di-skip, `assertSlotMatch` di-skip, `assertNoConflict`/`assertNoRoomConflict` di-skip — jadwal historis tidak diubah, slot/konflik forward-looking sudah tidak relevan. Junction psikolog↔service tetap divalidasi (admin perlu update junction kalau psikolog tidak normally handle service baru). Use case: admin koreksi laporan/pembayaran dari booking selesai yang salah kategori. UI tampilkan banner amber "Recategorisasi historis" di dalam dialog.

- **UI flow**: BookingWizard buka dengan title "Ubah Layanan Booking #N". Step 1 (Klien) jadi banner info terkunci. Step Layanan satu-satunya yang interaktif, badge step `1` (bukan 2 supaya tidak misleading). Step 3 (Psikolog) & Step 4 (Jadwal + Ruang) **tidak di-render** sama sekali di edit mode — admin tidak boleh ganti psikolog/jadwal lewat dialog ini (kalau perlu, pakai Reschedule). Auto-scroll ke Step Layanan saat dialog open. Tombol submit: "Simpan Layanan Baru".
- **Filter service**: `Step2Service` terima prop opsional `serviceIdWhitelist?: number[]`. Di edit mode, wizard lookup psikolog booking → kalau `psikolog.serviceIds.length > 0` → pass sebagai whitelist (chips terbatas ke layanan yang psikolog terassign handle). Junction kosong (`serviceIds = []`) = handle semua → no filter. Caption di bawah grid menjelaskan filter ke admin.
- **State pre-fill**: `useWizardState` baca `editingBooking` lalu seed `{clientId, serviceId, psikologUserId, roomId, sessions[0].date, notes}` dari booking. `slotIdx` tidak di-derive di edit mode (Step 4 hidden, tidak dipakai untuk submit).
- **canSubmit (edit mode)**: hanya butuh `serviceId !== editingBooking.serviceId` (admin harus ganti layanan, no-op di-block). Submit kirim **hanya `{ serviceId }`** ke backend.
- **Backend endpoint**: `POST /clinic/booking/:id/edit` → `BookingTransitionsService.editBooking` (atomic). DTO `EditBookingDto` semua optional. Saat hanya `serviceId` dikirim:
  1. Status guard: `checked_in` atau `completed` (selain itu → 400)
  2. `assertEntitiesExist` (client/service/psikolog/room existing)
  3. **Auto-resolve `scheduledStart`/`scheduledEnd`** — hanya untuk `checked_in`, di-skip untuk `completed`:
     - Identifikasi **slot INDEX** booking saat ini di `resolveServiceSlots(global, OLD.slotOverrides)` (match by `start === HH:MM(scheduledStart, TZ)` AND `end === HH:MM(scheduledEnd, TZ)`)
     - Ambil slot di **index yang sama** di `resolveServiceSlots(global, NEW.slotOverrides)`
     - `newStart = buildClinicInstant(date, newSlot.start, tz)`, `newEnd = buildClinicInstant(date, newSlot.end, tz)`
     - Slot identity (index) konsisten lintas-layanan; hanya time range yang bisa beda. Kalau booking lama tidak match slot manapun → 400 (data integrity issue, suggest reschedule dulu)
     - **JANGAN pakai `start + service.durationMinutes`** — buggy karena layanan baru bisa punya `slotOverrides` yang membuat durasi slot di index yang sama beda dari `service.durationMinutes`. Contoh bug: booking 13:30-14:30 (60 min override) → ubah ke layanan tanpa override → slot global di index sama = 13:30-15:00 (90 min). Compute `13:30 + 60 = 14:30` → mismatch dengan slot 13:30-15:00. Fix: pakai `newSlot.end` (= 15:00).
  4. Psikolog handle service baru via junction `ClinicPsikologService` (kosong = handle semua) — berlaku di kedua mode.
  5. `assertSlotMatch(start, end, serviceId=newService)` — hanya untuk `checked_in`. Untuk `completed`, jadwal historis bisa saja tidak match slot layanan baru → di-skip.
  6. `assertNoRoomConflict` + `assertNoConflict` exclude self — hanya untuk `checked_in`. Untuk `completed`, sesi sudah lewat → konflik forward-looking tidak relevan, di-skip.
- **Riwayat reschedule**: entry didorong ke `booking.rescheduleHistory` kalau `scheduleChanged` **atau** `serviceChanged` (sebelumnya hanya `scheduleChanged`, jadi service-only edit di mode `completed` tidak tercatat). Entry punya field `serviceId` (from/to) + `source: 'edit-wizard'` (atau `'edit-wizard-completed'` untuk mode completed) supaya admin bisa bedakan asal perubahan.
- **Payment recompute**: service berubah → recompute `totalAmount = base + 11% tax`, `taxAmount`, `dpAmount = total * 0.5`. **`paidAmount` tetap**. Status re-derive: `paid>=total → lunas`, `paid>=dp → dp_paid`, else `pending`. Stamp `dpPaidAt`/`lunasAt` di-reset kalau status turun, di-set baru kalau status naik dan stamp lama null.
- **WA**: TIDAK fan-out — admin action saat klien sudah hadir di klinik (silent). Audit log via `@AuditAction('edit')` interceptor.
- **Edit mode override di wizard**: `isMulti` selalu `false`; `useWizardSessions` skip auto-expand jadi N rows. Service baru dengan `sessionCount > 1` tetap diperlakukan sebagai single booking — kalau admin butuh paket, harus buat booking baru.
- **Tidak menyentuh**: WA template, RescheduleDialog, BookingDetailDialog, schema Prisma. `EditBookingDialog` lama (di `client-bookings-section`) tetap dipakai untuk edit notes pasca-completed — beda surface, beda scope. Backend endpoint `/edit` cukup fleksibel untuk dipakai dari konteks lain (mis. ekstensi UI ganti psikolog/jadwal nanti) — frontend tinggal kirim field tambahan.

### Reschedule dialog — visibilitas hari & slot terbooking (per 26 Mei 2026)
Pola UX di `features/admin-booking/ui/reschedule-dialog.tsx` berbeda dengan booking wizard:
- **Slot terbooking tampil sebagai card disabled** (line-through + `🔒 [NamaKlien] · [status]`), bukan disembunyikan — supaya admin paham slot mana yang penuh dan oleh siapa.
- **Booking yang sedang di-reschedule SENDIRI juga ditandai disabled** dengan label `🔒 [NamaKlien] · sesi saat ini` di slotnya saat tanggal terpilih = tanggal asli. Alasan: reschedule ke slot yang persis sama = no-op; admin wajib pilih waktu/tanggal berbeda secara eksplisit (no pre-select slot saat dialog open). `canSubmit` block submit kalau `selectedSlotIdx ∈ unavailableSlotIdx`.
- **Logika konflik dibedakan**: booking **lain** psikolog pakai *time-overlap* (psikolog tidak bisa di 2 slot bersamaan). Booking **sendiri** pakai *exact slot.start match* (bukan time-overlap). Alasan: kalau slot operasional klinik kebetulan **overlap waktu** (config saat ini: Slot 5 = 15:30–16:45, Slot 6 = 16:27–18:15 — overlap 18 menit), naive time-overlap akan men-disable Slot 6 ketika booking di Slot 5 di-reschedule, padahal pindah ke Slot 6 valid (Slot 5 bebas setelah pindah). Karena itu hanya slot dengan `slot.start === HH:MM(booking.scheduledStart)` yang di-mark sebagai "sesi saat ini".
- **DateStrip badge count** kecil di pojok kanan-atas tiap tanggal yang punya booking di minggu yang sedang dilihat (count **termasuk** booking yang sedang di-reschedule supaya angka cocok dengan kenyataan jumlah sesi psikolog di hari itu). Tanggal tidak di-disable karena masih bisa ada slot kosong.

Booking wizard (tambah jadwal baru) tetap pakai pola lama (filter/hide) — props baru `slotBookings` di `SlotGrid` dan `bookingCountByDate` + `onWeekChange` di `DateStrip` opsional dan hanya dikirim dari RescheduleDialog. Data: `bookingCountByDate` di-derive dari `useBookingList({ psikologUserId, dateFrom, dateTo })` per minggu yang tampil (parent menerima window via callback `onWeekChange` dari DateStrip); `slotBookings` di-derive dari `psikologDayBookings` (tanggal terpilih). Keduanya **menyertakan booking yang sedang di-reschedule** dengan label khusus, bukan exclude.

### Form klien — field wajib & layanan multi-select (per 26 Mei 2026)
- **Field wajib di form tambah / edit klien**: Nama, WhatsApp, Gender, **Umur**, **Layanan** (≥1), **MRN**. Tiga yang baru wajib (Umur/Layanan/MRN) di-enforce di tiga lapis:
  - **UI**: atribut HTML `required` di `features/admin-clients/ui/client-form-dialog.tsx`. Untuk Layanan: ada hidden input `required` yang baru bernilai non-empty kalau `serviceIds.length > 0` — browser native validation block submit + scroll ke section bila kosong. Dialog yang sama di-reuse di `clients-page` & `client-detail-page`.
  - **Backend DTO**: `CreateClientDto` di `apps/api-gateway/src/clinic-client/dto/clinic-client.dto.ts` — `serviceIds: number[]` dengan `@ArrayMinSize(1)` + `@ArrayUnique()` + `@IsInt({ each: true })`. `UpdateClientDto = PartialType(CreateClientDto)` — kalau `serviceIds` dikirim saat PATCH, backend replace seluruh junction (deleteMany + create batch).
  - **Zod schema frontend**: `createClientSchema` di `features/admin-clients/model/types.ts` — `serviceIds: z.array(...).default([])`. `age`/`medicalRecordNumber` tetap `.optional()` supaya `EMPTY_CLIENT` (draft state sebelum user mengetik) tidak melanggar tipe. Required di-enforce HTML + backend, bukan zod parse. Jangan ubah jadi non-optional tanpa juga merefactor draft state.
- **"Layanan" = multi-select dari service catalog** (sebelumnya single dropdown). UI: chips grouped per category (Konseling / Terapi / Tes Psikologi) dengan tombol "Pilih semua" + counter `X dari Y layanan dipilih` — pola sama dengan form psikolog (`features/admin-psikolog/ui/psikolog-form-services.tsx`). Disimpan ke **junction table baru `clinic_client_service`** (`clientId, serviceId`, unique compound). Frontend kirim `serviceIds: number[]`; backend `ClinicClientService.create/update` validate ids existing + non-deleted lalu replace junction.
- **Kolom legacy `clinic_client.preferred_service_type`** (`varchar(60)`) **TETAP ADA** untuk backward compat — auto-sync oleh backend ke `clinic_service.name` dari service pertama (urut by `serviceId asc`) saat create/update. Jangan dipakai untuk input baru. DTO mark `@IsOptional()` & deskripsi `DEPRECATED`. Konsumen di kode/SQL yang masih baca kolom ini → migrate baca dari relasi `client.services` (atau cek field `services[]` di response API).
- **Tampilan multi-service di detail klien**: section baru "Layanan terdaftar" di `client-detail-page/profile-sections.tsx#ServicesSection` — render chips sage dari `sel.services`. Tampil di samping `ContactSection`, hanya bila `services.length > 0`.
- **Migrasi data** (2 file):
  - `20260526_001_clinic_client_service/migration.sql` — create table + backfill pertama: untuk tiap klien dengan `preferred_service_type` non-null/empty, match by `clinic_service.name`. ON CONFLICT DO NOTHING (idempotent).
  - `20260526_002_clinic_client_service_category_backfill/migration.sql` — backfill kedua khusus dev/staging: untuk klien dengan `preferred_service_type` = enum kategori lowercase (`'konseling'`/`'terapi'`/`'tes'`, pola lama seed dev sebelum 26 Mei), link ke service pertama (urut by id asc) di kategori yang match, lalu sync `preferred_service_type` ke nama service yang ter-link. Production (yang sudah pakai nama service) di-handle oleh migration 001; dev/staging di-handle oleh 002.
  - Klien lama dengan `preferred_service_type` kosong / service yang sudah di-rename → tidak ter-backfill, admin perlu re-pilih saat edit.
- **Klien lama (pre-26-Mei) yang field-nya kosong**: edit pertama akan minta admin isi field wajib sebelum bisa simpan. Sengaja (konfirmasi user 26 Mei). DB column `age`, `medical_record_number`, `preferred_service_type` tetap nullable supaya record lama tidak crash saat di-fetch.
- **Service "stale" di edit form**: kalau klien punya `serviceIds` yang sudah dinonaktifkan setelah relasi dibuat, chip tetap dirender di kelompok "Lainnya (tidak aktif)" dengan style line-through — admin bisa uncheck. Backend `validateServiceIds` cek `deletedAt: null` saja (bukan `isActive: true`), jadi service nonaktif tetap boleh dipertahankan.

### WA dispatch routing — single source of truth = `ClinicWaTemplate.recipients` (per 27 Mei 2026)

**Keputusan**: routing per recipient (klien/psikolog/staff/user) untuk semua WA notif **hanya** ditentukan oleh `ClinicWaTemplate.recipients` array. Toggle "WA klien" / "WA psikolog" di drawer Pengaturan Notifikasi WA mutate kolom ini langsung (via `PATCH /clinic/wa/template/:id`). Master kill-switch global tetap `ClinicSettings.waSendEnabled`.

Sebelum 27 Mei 2026: ada **dua sumber** yang kadang berlawanan — `ClinicSettings.notif<Event><Recipient>` booleans (drawer Pengaturan) dan `ClinicWaTemplate.recipients` (template editor). Membingungkan + bisa diverge. Sekarang single source.

- **Aturan dispatch** (`BookingNotificationService.notify()` + `BookingReminderScheduler.shouldSendToKlien()`):
  1. `waSendEnabled = false` → skip semua
  2. Template `isActive=false` atau `recipients=[]` → skip
  3. Klien dispatch hanya bila `recipients.includes('klien')` & `client.phoneWa` ada
  4. Psikolog fan-out hanya bila `recipients.includes('psikolog')` & `psikolog.phone` (= `User.phone`) ada
  5. Error sisi psikolog di-catch terpisah, tidak ganggu dispatch ke klien
- **Field ClinicSettings yang DIHAPUS** (migration `20260527_003`): semua `notif<event><recipient>` boolean (~18 kolom: notifConfirm/H1/M30/Followup/Feedback/Reschedule/Cancel/UbahRuangan/UbahLayanan/Welcome/InviteStaff/OtpUser/Dp/BuktiPembayaran/Pelunasan/SesiLanjutan/PaketHabis/MingguKosong{Klien,Psikolog,Days,Threshold} dst). Field timing tetap (`notifH1SendTime`, `notifFollowupDelayHours`, `notifFeedbackSendTime`, `notifFailedSendEmail`).
- **Backfill `template.recipients`** (migration `20260527_002`) dijalankan SEBELUM drop kolom: nilai recipients di-set ulang berdasarkan ClinicSettings flag yang lama supaya state efektif terjaga. Idempotent.
- **Backend dispatch refactor** (`booking-notification.service.ts` + `booking-reminder.scheduler.ts`): `TEMPLATE_TOGGLE` map dihapus (juga membersihkan 4 entry dead-code yang reference template tidak ada di seed — "Ubah Ruangan", "Ubah Layanan", "Tagihan DP", "Pengingat Pelunasan"). Helper baru: `getTemplateRecipients(name)` + `shouldSendToKlien(name)`.
- **Drawer rewire** (`features/admin-pengaturan/ui/tabs/notifikasi/*`): toggle "WA klien"/"WA psikolog" pakai hook `useWaTemplateRecipients()` (PATCH template). **Baris orphan dihapus** dari drawer karena tidak punya template di seed: "Pengingat sesi lanjutan", "Paket akan habis", "Pengingat minggu kosong", "Ubah ruangan", "Ubah layanan", "Invite user baru", plus 3 baris "Pembayaran" (Tagihan DP/Bukti/Pelunasan) yang dulu `locked`.
- **UpdateTemplateDto** allow `recipients=[]` (semua toggle off di drawer = template aktif tapi tidak dispatch). Create masih wajib `@ArrayMinSize(1)`.
- **UX cue**: bila admin matikan semua recipient di drawer (klien + psikolog off), `recipients` jadi `[]` → silent (tidak dispatch ke siapapun). Master `waSendEnabled` adalah hard kill-switch global, terpisah dari ini.

### WA trigger — fan-out ke psikolog (per 18 Mei 2026)
- **Sumber fan-out**: kolom `ClinicWaTemplate.recipients` (array `['klien'|'psikolog']`). `BookingNotificationService.notify()` dispatch ke klien iff `recipients.includes('klien')`, lalu dispatch kedua ke psikolog iff `recipients.includes('psikolog')` & `User.phone` psikolog tidak null. Error sisi psikolog di-catch terpisah → tidak ganggu kirim ke klien.
- **Template yang fan-out ke psikolog**: `Konfirmasi Booking`, `Reschedule Booking`, `Cancel Booking` (seed `recipients: ['klien','psikolog']`). Reminder H-1 & 30m **tidak** fan-out (keputusan 18 Mei: psikolog cukup lihat jadwal di dashboard).
- **Pengingat H-1 Booking** scheduler (per 18 Mei 2026): cron `0 8 * * *` TZ `Asia/Jakarta` — kirim tepat jam 08:00 WIB setiap hari untuk semua booking yang dijadwalkan keesokan harinya (seluruh window 00:00–23:59:59 WIB besok). Sebelumnya: `EVERY_HOUR` dengan sliding window 23–25 jam. File: `apps/api-gateway/src/clinic-booking/booking-reminder.scheduler.ts`.
- **Reminder H-1 & 30m — nama template & status filter** (fix 19 Mei 2026): scheduler memanggil `wa.dispatch({ templateName })` dengan **exact match nama template**, jadi nama wajib persis sama dengan kolom `ClinicWaTemplate.name` di seed. Nama benar: `'Pengingat H-1 Booking'` dan `'Pengingat 30 Menit Sebelum Sesi'` (bukan `'Pengingat H-1'` / `'Pengingat 30 Menit'`) — kalau salah, log warn "Template '...' not found / inactive — skip dispatch" dan WA **tidak terkirim** tanpa error keras. Status filter di `findBookingsInWindow` = `['confirmed','checked_in']` — bukan hanya `['checked_in']`, karena 30 menit / 1 hari sebelum sesi klien belum check-in (check-in dilakukan resepsionis saat klien datang). Bug history: keduanya sempat aktif sejak slice WA scheduler dirilis sampai 19 Mei 2026.
- **Konfirmasi Booking**: sebelum 18 Mei 2026 template ada di seed tapi **tidak pernah di-dispatch** (bug). Sekarang di-fire di `ClinicBookingService.create` + `BookingPackageService.persistAndEmit`. **Paket multi-sesi (22 Mei 2026)**: `BookingPackageService` dulu kirim N notif (loop per sesi) → sekarang kirim **1 notif via `notifyPackageConfirmation()`** dengan variabel `{{jadwal_lengkap}}` = list semua sesi + `{{total_baris}}` = kosong (total tidak ditampilkan untuk paket). Single-session `create` tetap kirim 1 notif via `notify()` dengan `jadwal_lengkap` = satu baris + `total_baris` = `💰 Total: Rp {total}`. Template body sudah diupdate — tidak lagi pakai `{{tanggal}}`, `{{waktu}}`, `{{ruang}}` langsung; semua lewat `{{jadwal_lengkap}}`.
- **Welcome Psikolog Baru** (`triggerEvent: 'psikolog_welcome'`, `recipients: ['psikolog']`): fire saat `POST /clinic/psikolog` (`ClinicPsikologService.create`) kalau psikolog punya `User.phone`. Variabel: `{{nama_psikolog}}`, `{{username}}`, `{{login_url}}` (dari `WEB_ALTHEA_URL` env, fallback ke `https://althea.fr-labs.my.id`).
- **Sumber nomor psikolog**: kolom `User.phone` (bukan field baru di `ClinicPsikologProfile`).
- Caller `notify()` wajib include `psikolog: { select: { ..., phone: true, ... } }` di Prisma query — sudah ditambahkan di `ClinicBookingService.includeRelations` + `BookingPackageService.includeRelations`.
- **Body template fan-out wajib netral** — schema cuma 1 `body` per template, dan `notify()` pakai `variables` identik untuk dua-duanya. Jadi body tidak boleh menyapa salah satu role (jangan "Halo {{nama_klien}}", jangan "sesi Anda"). Pakai header notifikasi + listing data ({{nama_klien}}, {{nama_psikolog}}, {{ruang}}, dst) sebagai field, bukan sapaan. **Ketiga template fan-out (`Konfirmasi Booking`, `Reschedule Booking`, `Cancel Booking`) sudah netral peran** — body diawali header `[Althea Psychology] ...` lalu list field 🧑 Klien / 👤 Psikolog / 📋 Layanan / 📅 Tanggal / ⏰ Waktu / 📍 Ruang (per 18 Mei 2026; Konfirmasi & Cancel di-rewrite dari versi lama yang masih "Halo {{nama_klien}}"/"Anda"). Bila role butuh wording personal, pilih: (a) split jadi 2 template `<Name> — Klien` & `<Name> — Psikolog` + update caller, atau (b) schema change tambah `bodyPsikolog`.

### WA trigger — onboarding klien (per 18 Mei 2026)
- **`Welcome New Client`**: fire saat `POST /clinic/client` (`ClinicClientService.create`) bila klien punya `phoneWa` & `waOptedOut=false`. Tidak fire untuk klien lama yang dibuat sebelum trigger di-deploy (klien id ≤ 10 di DB dev) — bukan bug.
- **`Info Psikolog`**: fire **sekali saja saat booking PERTAMA klien**, baik single (`POST /clinic/booking`) maupun paket (`POST /clinic/booking/package`). Definisi "pertama" = `count(clinicBooking WHERE clientId=X AND deletedAt IS NULL) excluding current = 0`. Booking ke-2+ tidak ulang Info Psikolog walau ganti psikolog (keputusan 18 Mei: trigger berbasis "first booking", bukan "first per pair klien-psikolog").
- Caller: `booking-notification.service.ts:notifyPsikologInfo()`. Sebelum 18 Mei 2026 function ini didefinisikan tapi tidak pernah dipanggil — bug history: commit fix dispatch di `ClinicBookingService.create` + `BookingPackageService.persistAndEmit`.
- **Format jam variabel WA template (per 20 Mei 2026)**: `{{waktu}}`, `{{waktu_lama}}`, `{{waktu_baru}}`, dan komponen jam di `{{sesi_berikut_tanggal}}` selalu **24-jam dengan dot separator** — mis. 3 sore → `"15.00"`, bukan `"15:00"` / `"3:00 PM"`. Helper: `formatClinicTimeOfDay()` di `apps/api-gateway/src/clinic-booking/timezone.util.ts` (en-GB + `hour12:false`, lalu replace `:` → `.`). Semua dispatch site (`booking-notification.service.ts`, `clinic-booking.service.ts:reschedule/transition`, `booking-reminder.scheduler.ts`) wajib pakai helper ini — **jangan panggil `toLocaleTimeString('id-ID', ...)` langsung untuk variabel WA**.
- **`Follow-up Post Session`**: fire saat `ClinicBookingService.transition()` ke status `completed`. Variabel `{{sesi_berikut_tanggal}}` di-resolve dari booking lanjutan klien terdekat (`status ∈ {scheduled,confirmed,checked_in}`, `scheduledStart > now`, urut ASC ambil 1) — format `"Senin, 18 Mei 2026 pukul 15.00 WIB"`. Kalau tidak ada booking lanjutan: fallback string `"(belum dijadwalkan)"` (bukan kosong). Bug history (18 Mei 2026): sebelum fix, caller tidak pass `extraVars` sama sekali → `{{sesi_berikut_tanggal}}` selalu jadi placeholder literal di pesan.
- **`Form Feedback`** (`triggerEvent: 'feedback_request'`, `recipients: ['klien']`) — diaktifkan 18 Mei 2026. Cron `0 8 * * *` TZ `Asia/Jakarta` di `booking-reminder.scheduler.ts` (`dispatchFeedbackH1`): tiap hari jam 08:00 WIB scan booking `status=completed` dengan `completedAt` di seluruh hari **kemarin** (00:00–23:59:59 WIB), klien punya `phoneWa` & `!waOptedOut`, belum dikirimi feedback. Dedup via `ClinicWaLog.metadata.reminderFlag = 'feedback_h1'` (pola sama H-1/30m). Variabel: `{{nama_klien}}`, `{{nama_psikolog}}` (fallback `"psikolog kami"`). **Keputusan**: template **tidak pakai link form** — klien diminta **membalas pesan WA langsung**; balasan dibaca tim manual di WhatsApp. Penangkapan balasan inbound ke DB **tidak diimplementasi** (di luar scope; webhook Fonnte saat ini hanya track delivery status outbound, lagipula paket Free tidak kirim callback). Bila nanti perlu simpan feedback ke aplikasi → effort terpisah (model `ClinicWaInbound` + extend webhook + halaman admin).

### Catalog seed 27 Mei 2026 — layanan & ruangan

Bulk seed ditambah/diupdate langsung via SQL ke Postgres (bypass DTO, fast for placeholder catalog). Detail:

- **9 layanan baru** sebagai placeholder (`base_price = 0`, deskripsi flag "Placeholder seed 27 Mei 2026 — admin set harga & durasi via UI"):
  - Tes (6): Asesmen Kemampuan Belajar, Asesmen Emosi/Perilaku Anak, Paket Tes 1, Paket Tes 2, Tes Bakat Minat (2 sesi), Tes Kesehatan Mental
  - Terapi paket (3): Paket 1 Bulan (4 sesi), Paket 3 Bulan (12 sesi), Paket 6 Bulan (24 sesi)
- **Catatan**: "Tes Kesehatan Mental" (id 25) ditambah sebagai item baru terpisah dari existing "Tes MHCU (group)" (id 13) — admin perlu verifikasi apakah keduanya beda format (individu vs group) atau duplikat yang perlu di-merge.
- **"Tes Bakat Minat (1 sesi)"** dari request user **tidak di-insert** — assumed sama dengan existing "Tes Bakat Minat" (id 14, 1 sesi, 180min).
- **5 ruangan update kapasitas**: Sky/Sage/Forest/Sunset Room dari kap 1 → 2; Mint Room dari kap 1 → 4. Nama & type tetap.
- **2 ruangan rename**: `Seminar` → `Network Room` (kap tetap 20, type seminar); `Tes` → `Psychotest Room` + kap 1 → 8 (type tes). Rename hanya nama (id tetap) — booking historis tidak terpengaruh.
- **Ruangan tidak disentuh karena sudah match**: Playground (id 9, kap 4 anak), Terapi Anak 1/2/3 (id 6/7/8, kap 1 anak), Alam Hijau Room (id 12, kap 10 anak — tidak diminta user tapi dibiarkan aktif).
- **Total catalog**: 27 service aktif (5 konseling + 9 terapi + 13 tes), 12 room aktif (5 konseling + 5 anak + 1 seminar + 1 tes).
- **TODO admin**: edit harga & durasi 9 layanan placeholder via `/admin/layanan` sebelum dipakai di booking; tanpa harga base, payment compute akan menghasilkan total 0.

### WA device pairing — ganti nomor pengirim in-app (per 27 Mei 2026)

Admin bisa tambah / ganti device WhatsApp (nomor pengirim Fonnte) langsung dari UI, tanpa edit `.env` / restart container.

- **Surface UI**: `WaConnectionSection` (di drawer `Pengaturan Notifikasi WA` & tab Pengaturan → Notifikasi) — tombol "Tambah / Ganti device WA" buka `WaDevicePairingDrawer` (3 step: form nama+nomor → scan QR → aktifkan).
- **Token storage**: kolom baru `ClinicSettings.waActiveDeviceToken` (`String?`, plaintext). `FonnteProvider.send()` resolve token via `ClinicSettingsService.getActiveDeviceToken()` — priority: DB `waActiveDeviceToken` → env `FONNTE_API_TOKEN` fallback. Migration: `20260527_001_clinic_settings_wa_active_device_token`.
- **Account token**: env baru `FONNTE_ACCOUNT_TOKEN` (account-level, beda dengan per-device `FONNTE_API_TOKEN`) — wajib di-set di `.env` / Vault `api-gateway/FONNTE_ACCOUNT_TOKEN` supaya endpoint `/wa-devices/*` jalan. Tanpa token ini, endpoint balas `ServiceUnavailableException`. Dapatkan via fonnte.com → Profile → API Key Account.
- **Endpoint admin** (semua `Roles('clinic-admin')`, prefix `/clinic/settings/wa-devices`):
  - `GET /wa-devices` → list semua device di akun Fonnte (proxy `/get-devices`)
  - `POST /wa-devices` → tambah device baru (proxy `/addDevice`) → return `{ deviceToken, devicePhone }`
  - `POST /wa-devices/qr` → ambil QR base64 (proxy `/qr` pakai device token, BUKAN account token)
  - `POST /wa-devices/activate` → simpan token ke `ClinicSettings.waActiveDeviceToken` + sync `waSenderNumber`; bila `removePrevious=true` (default) → disconnect + delete device lama dari akun Fonnte
  - `DELETE /wa-devices/:devicePhone` → disconnect + delete device dari akun Fonnte; kalau device aktif yang dihapus → reset `waActiveDeviceToken`
- **Fonnte Free limit**: hanya 1 device boleh `connect` bersamaan per akun. Karena itu activate device baru default ikut hapus device lama — supaya kuota slot device akun tidak overflow. UI tampilkan warning di step 1.
- **Polling QR**: drawer poll `POST /wa-devices/qr` tiap 4 detik. Saat Fonnte balas `reason: "already connected"` → scan berhasil → drawer lanjut ke step 3 (Aktifkan).
- **Migration provider switch**: `ClinicWaModule` factory `WA_PROVIDER` sekarang pilih `FonnteProvider` bila `FONNTE_API_TOKEN` ATAU `FONNTE_ACCOUNT_TOKEN` ada (sebelumnya hanya cek `FONNTE_API_TOKEN`). Konsekuensi: setelah set `FONNTE_ACCOUNT_TOKEN` tanpa device token aktif, provider Fonnte aktif tapi `send()` return `failed` sampai admin pair device lewat UI.
- **Konsekuensi keamanan**: token Fonnte device di-simpan **plaintext** di Postgres. Risk acceptable untuk klinik internal (token bukan rahasia tinggi, bisa di-regen via dashboard Fonnte). Bila DB dump bocor, segera regenerate via Fonnte dashboard + pair ulang via UI.

### Detail Sesi (Psikolog · Jadwal Saya) — modal profil klien (per 27 Mei 2026)
**Pop-up modal centered** (bukan side drawer) di `features/psikolog-schedule/ui/booking-detail-drawer.tsx` — nama file tetap, tapi presentation sudah jadi modal terpusat. Klik kartu booking di `/psikolog/schedule` Hari/Minggu/Bulan buka modal yang menampilkan **profil klien lengkap** + riwayat + sesi mendatang.

- **Layout modal**: width 720px / `maxHeight: 90vh`, scroll internal di body. Background overlay `rgba(20,40,40,0.45)` + `backdrop-filter: blur(2px)`. Klik overlay = tutup; tekan ESC = tutup; `document.body.overflow` di-lock saat open supaya halaman di belakang tidak scroll. Animasi `scale(0.96)→scale(1)` 220ms saat open.
- **Hero header** (linear-gradient dari warna kategori klien → cream-100): avatar inisial 72px bg putih dengan ring kategori, nama klien serif 22px, baris quick-facts `gender · umur · kategori · MRN` di bawah nama, lalu deret chips status (Check-in/Berlangsung/dst + Walk-in + `Klien {derivedStatus}` + `Opt-out WA` kalau true). Tombol close di pojok kanan-atas hero.
- **Body** = stack 3 elemen utama dengan card putih (kontras vs body cream-50):
  1. **Card "Sesi ini"** — hero block tanggal serif gede + jam mulai-selesai + durasi (bg sage-50), lalu field grid 2-kolom (Layanan + chip kategori + sesi N/total; Ruangan + type), lalu NoteBlock catatan sesi.
  2. **Card "Profil klien"** — field grid 2-kolom (WhatsApp, Email), chips layanan terdaftar, NoteBlock alamat (kalau ada), NoteBlock catatan klien (tone warning kalau ada — bg orange-50).
  3. **Grid 2-kolom** (`auto-fit minmax(280px,1fr)` → stack di sempit): Card "Riwayat sesi" (subtitle = total sesi, list 5 sesi completed dari `recentSessions`) + Card "Sesi mendatang" (subtitle = jumlah upcoming, list maks 6 sesi dengan badge status).
- **Pattern presentational**: bukan lagi "icon-circle + label + value" tiap baris (terlalu kaku/noisy di iterasi sebelumnya). Sekarang pakai `Card` (header putih + body), `FieldGrid` (responsive 2-col), `Field` (label uppercase 10px + value 14px), `Pill` (rounded-full, size sm/md), `NoteBlock` (label + cream/warning panel), `SessionRow` (single 28px icon di kiri + tanggal+jam+title+subtitle + badge kanan). Helper-helper di-export di bawah `ModalContent` di file yang sama supaya 1-file enak di-edit.
- **Data sources** (tidak berubah dari iterasi sebelumnya):
  - `useClientDetail(booking.client.id)` → `GET /clinic/client/:id` → `ClientWithHistory` (`recentSessions` = 5 sesi `status=completed` desc dari backend `clinic-client.service.ts:findOne`).
  - `useBookingList({ clientId, limit: 100, includeCancelled: false })` → semua booking klien. Split client-side: **sesi mendatang** = `scheduledStart > now AND status NOT IN ('cancelled','completed') AND id !== currentBookingId`, sort ASC. Tidak ada endpoint dedicated.
- **Avatar**: inisial 2-huruf (huruf pertama + huruf pertama kata terakhir; 1-kata = 2 huruf pertama), warna dari `CATEGORY_PALETTE[client.category]` fallback sage. **Tidak ada upload foto** — kolom photo tidak ada di `ClinicClient` (klien tidak login). Bila mau tambah foto upload nanti → butuh migration + endpoint + UI di form klien (out of scope per 27 Mei).
- **Fix bug lama**: label gender sebelumnya match `'male'/'female'` (salah — backend kirim `'L'/'P'`), sekarang map via `GENDER_LABEL` dari `features/admin-clients/model/types`. Mapping juga toleran kalau backend suatu saat kirim `'male'/'female'`.
- **Scope**: modal ini hanya dipakai di `psikolog/schedule` (bukan admin/owner/resepsionis — mereka pakai `BookingDetailDialog` dari `features/admin-booking`). Pattern serupa bisa di-port ke dialog admin nanti bila perlu, **tapi belum di-port** — keputusan 27 Mei: psikolog yang paling butuh konteks klien sebelum sesi.

> **Catatan nama file**: komponen masih bernama `BookingDetailDrawer` walau sudah modal, supaya import di `psikolog-schedule-page.tsx` tidak perlu di-touch. Rename suatu saat = breaking change kecil, defer kecuali ada drawer lain yang dibutuhkan.

LEGACY-NOTE: iterasi sebelumnya berupa **side drawer 460px slide-from-right** dengan section title eyebrow + pattern Row icon-per-baris. Diganti karena terasa kaku / list-y / sulit dibaca.

### Detail Klien (Psikolog · Klien Saya) — modal profil klien (per 27 Mei 2026)
**Pop-up modal centered** di `app/psikolog/patients/_components/client-detail-modal.tsx` — pattern mirror persis `BookingDetailDrawer` di Jadwal Saya (lihat section di atas), supaya psikolog dapat detail klien yang sama lengkapnya baik datang dari kartu booking di schedule maupun dari row tabel klien.

- **Trigger**: klik baris di `PatientListTable` (desktop) atau card di `PatientsMobile` (mobile) → set `openClientId` di `page.tsx` → modal terbuka. Sebelum 27 Mei: desktop pakai aside-panel 380px (`PatientDetailAside`, dihapus), mobile `setSelectedId` no-op. Pattern aside tidak skala ke mobile dan data-nya tipis (cuma derivasi dari booking list — email/MRN/alamat/layanan terdaftar tidak pernah di-fetch).
- **Beda dengan modal Jadwal Saya**:
  - Header eyebrow `Detail Klien` (bukan `Detail Sesi`). Chips: status klien (aktif/baru/selesai) + total sesi + opt-out WA. **Tidak ada chip status booking** (tidak ada single-booking context).
  - Card pertama = **"Sesi berikutnya"** (bukan "Sesi ini") — derive dari `useBookingList({clientId})` filter `status NOT IN ('cancelled','completed') AND scheduledStart > now`, sort ASC, ambil pertama. Pill status booking dipindah ke pojok kanan baris jam (kompak). Empty state `CalendarOff` icon kalau belum ada upcoming.
  - Card "Sesi mendatang lain" = sisa upcoming setelah dikeluarkan yang sudah tampil di card pertama (`slice(1)`). Subtitle dynamic (`N terjadwal` atau empty state kontekstual).
  - Footer: `Klien #N` + `MRN ...` (tidak ada `Booking #N`).
- **Data sources** (sama persis dengan modal schedule, tidak ada endpoint baru):
  - `useClientDetail(clientId)` → profil + `recentSessions` 5 sesi `completed` desc.
  - `useBookingList({ clientId, limit: 100, includeCancelled: false })` → derive `nextBooking` + `upcoming`.
- **Cleanup yang ikut**:
  - File dihapus: `app/psikolog/patients/_components/patient-detail-aside.tsx` (aside 380px lama).
  - `PatientListTable`: prop `selectedId` dihapus (row tidak punya selected state lagi — modal hidup di luar tabel). Border kiri sage di row sekarang **hover-only** (tidak persistent), `borderRight` ke aside lama dihapus (tabel full-width).
- **Kenapa duplikat primitives (Card/Pill/FieldGrid/Field/NoteBlock/SessionRow/dst) di 2 file**: keputusan 27 Mei (lihat section sebelumnya) sengaja tidak port pattern modal ke shared primitives sampai ada surface ketiga yang butuh. Sekarang ada surface kedua (Klien Saya) — masih pertahankan duplikasi karena (a) primitives kecil, (b) modal punya quirks per-konteks (eyebrow, chips, card pertama), (c) refactor jadi shared `<DetailModal>` butuh slot-based API yang justru menambah kompleksitas. Bila ada surface ketiga (mis. admin client detail modal) → port ke `features/admin-clients/ui/client-detail-modal-shared.tsx` atau primitives-only ke `components/ui/detail-card.tsx`.
- **Scope tidak berubah**: ikon WA + edit di kolom Aksi tabel tetap stop-propagation (tidak buka modal). Tombol "Buka editor lengkap" / aksi catatan klinis dari aside lama dihilangkan — kalau psikolog mau ke catatan, masih bisa via sidebar `Catatan klinis`.

### Tombol "Selesaikan sesi" di modal detail psikolog (per 27 Mei 2026)

Psikolog bisa mark sesi `in_progress` → `completed` langsung dari kedua modal detail (Jadwal Saya & Klien Saya), tanpa harus minta admin/resepsionis. Sebelumnya `useCompleteBooking` hanya dipakai admin Daftar Jadwal & resepsionis status board.

- **Surface**:
  - `features/psikolog-schedule/ui/booking-detail-drawer.tsx` — tombol di bawah card "Sesi ini", muncul saat `booking.status === 'in_progress'`. Highlighted card berubah warna sage-50 → light-green (`#dcfce7` + border `#86efac`) sebagai visual cue sesi sedang aktif.
  - `app/psikolog/patients/_components/client-detail-modal.tsx` — pola sama di card "Sesi berikutnya". Filter sesi aktif diperluas: termasuk `in_progress` & `checked_in` (bukan hanya `scheduledStart > now` murni) — pakai `scheduledEnd > now` supaya sesi yang sedang berjalan tetap nongol di card pertama. Sort by `scheduledStart` ASC.
- **Confirm + WA cue**: `window.confirm('Tandai sesi ini selesai? Tindakan ini akan mengirim WA Follow-up ke klien.')` sebelum mutate. Pola sama dengan resepsionis dashboard. User diingatkan side-effect WA supaya tidak surprise.
- **Auto-close** (schedule drawer only): `completeMut.mutate(id, { onSuccess: onClose })` — drawer schedule menyimpan booking object stale setelah transisi, jadi close otomatis lebih bersih. Modal patients TIDAK auto-close: `useBookingList` refetch → nextBooking auto-update ke sesi berikutnya (atau empty state) — psikolog langsung lihat next session tanpa reopen.
- **Hook reuse**: import `useCompleteBooking` dari `features/admin-booking/hooks/use-booking` — tidak buat hook baru. Toast & invalidation sudah handle di hook (`toast.success('Booking → completed')`, invalidate `['clinic','booking']`).
- **Tidak ada tombol "Mulai sesi"** di kedua modal — transisi `checked_in → in_progress` masih wewenang resepsionis/admin (mereka yang verifikasi klien hadir di klinik). Psikolog hanya boleh `in_progress → completed` karena mereka yang tahu kapan sesi berakhir.
- **Scope**: tidak menambah Cancel / Reschedule ke modal psikolog — itu wewenang admin (psikolog request via WA/chat). Modal psikolog tetap minimal action: hanya 1 tombol Selesai bila relevan.

**Bug fix layout (27 Mei 2026)**: body modal awalnya dibungkus `display: flex; flex-direction: column; gap: 20` dan Card direnders sebagai `<section>` (flex item dengan `flex-shrink: 1` default). Dua Card pertama (Sesi ini + Profil klien) collapse ke ~0px tinggi karena flex-shrink mengkompres mereka demi memberi ruang ke grid 2-kolom (child terakhir) — yang muncul hanya border atas/bawah masing-masing card, jadi terlihat seperti "garis dobel" di body. Fix: (a) body diganti ke plain block layout (no flex), (b) Card render sebagai `<div>` (bukan `<section>`/`<header>`) dengan `flex-shrink: 0` defensif, (c) prop `spacing` di Card menambah `marginBottom: 20` untuk cards yang ditumpuk langsung di body block (Sesi ini + Profil klien); grid container 2-kolom (Riwayat + Mendatang) tetap pakai gap internal. Pelajaran: hindari flex column + `flex-shrink: 1` (default) untuk container yang punya child grid heavier — collapse cards akan jadi sulit di-debug karena Card titles bahkan hilang.

- **Data sources** (dua hook paralel saat drawer terbuka):
  - `useClientDetail(booking.client.id)` → `GET /clinic/client/:id` → `ClientWithHistory` (profil + `recentSessions` 5 sesi `status=completed` desc, sudah ada di backend `clinic-client.service.ts:findOne`).
  - `useBookingList({ clientId, limit: 100, includeCancelled: false })` → semua booking klien. Frontend split client-side: **sesi mendatang** = `scheduledStart > now AND status NOT IN ('cancelled','completed') AND id !== currentBookingId`, sort ASC. Tidak ada endpoint dedicated `/upcoming` — pakai filter list yang sudah ada.
  - `enabled: id !== null` — query auto-pause saat drawer ketutup. Loading state non-blocking: section "Sesi ini" tampil instan dari payload booking, section lain render setelah fetch selesai.
- **Section drawer** (urutan top-to-bottom):
  1. **Sesi ini** — layanan, jadwal, ruangan, catatan sesi (`booking.notes`).
  2. **Profil klien** — identitas (gender + umur + chip kategori dewasa/anak/remaja/dst), MRN, chips layanan terdaftar, catatan klien (`client.notes` — beda dari catatan sesi).
  3. **Riwayat sesi (selesai)** — list 5 sesi `completed` terakhir dari `recentSessions`, dengan tanggal + layanan + psikolog. Counter `{total} total` di header section; footnote bila `totalBookings > 5` menunjuk halaman Klien untuk riwayat lengkap.
  4. **Sesi mendatang** — list maks 8 sesi upcoming + counter `{N} sesi`. Tiap row punya badge status booking (Check-in / Berlangsung / dst).
  5. **Kontak** — WhatsApp (+ badge `Opt-out WA` kalau `waOptedOut=true`), email, alamat.
- **Header**: **avatar inisial bulat 52px** (warna dari `CATEGORY_PALETTE[client.category]`, fallback sage) + nama klien + chips (status booking + Walk-in + status klien `derivedStatus` baru/aktif/selesai). **Tidak ada upload foto** — kolom photo tidak ada di `ClinicClient` (klien tidak login). Inisial diambil dari huruf pertama + huruf pertama kata terakhir nama; 1-kata = 2 huruf pertama. Bila mau tambah foto upload nanti → butuh migration + endpoint + UI di form klien (out of scope per 27 Mei).
- **Width drawer** 460px (naik dari 380 → 440 → 460) supaya badge per-row di section Sesi mendatang tidak overflow. `maxWidth: 95vw` jaga mobile-friendly.
- **Fix bug lama**: label gender sebelumnya match `'male'/'female'` (salah — backend kirim `'L'/'P'`), sekarang map via `GENDER_LABEL` dari `features/admin-clients/model/types`. Mapping juga toleran kalau backend suatu saat kirim `'male'/'female'`.
- **Scope**: drawer ini hanya dipakai di `psikolog/schedule` (bukan admin/owner/resepsionis — mereka pakai `BookingDetailDialog` dari `features/admin-booking`). Pattern serupa bisa di-port ke dialog admin nanti bila perlu, **tapi belum di-port** — keputusan 27 Mei: psikolog yang paling butuh konteks klien sebelum sesi.

### Override flag
- Satu checkbox `bufferOverride` skip semua validation (slot-match, jam, hari libur, psikolog availability); fitur "conflict buffer" sudah dihapus — tidak ada buffer menit antar booking
- Pakai HANYA untuk walk-in darurat, audit-logged otomatis
- UI copy: wrap dalam card cream + helper text panjang supaya admin paham resikonya

## Testing
- **Vitest** untuk util pure + hook deterministik.
- **Playwright** e2e: jalankan dengan `api-gateway` & DB hidup (Docker stack up).
- Mock API di unit test pakai MSW kalau perlu (belum di-setup, tambah saat butuh).

## Jangan disentuh tanpa diminta
- `next.config.mjs` — sudah dituning untuk Docker standalone & dev origins.
- `proxy.ts` — logic auth/role global. Ubah hati-hati.
- Tema ShadCN core di `components/ui/*` yang upstream — modifikasi via `cva` variant, bukan edit langsung.
- Port di `config/ports.json` — koordinasi dengan tim dulu sebelum ubah.

## Status fitur

Semua 14 slice MVP sudah **delivered** (8 May 2026). Iterasi UX & hardening lanjut tracked di:
- `.planning/ROADMAP.md` — status per slice + History section
- `.planning/CHANGELOG.md` — daily commits dengan SHA (grouped per slice/area)

Highlight current state:
- ✅ Auth flow (login + cookie client-side untuk NPM bypass + logout confirmation)
- ✅ Master data: Psikolog, Layanan, Rooms (facilities text[]), Users & Roles, Clients
- ✅ Booking wizard single-page (ADR 011) + reschedule + walk-in via wizard
- ✅ Schedule grid `/admin/jadwal` + `/psikolog/schedule` (Hari/Minggu/Bulan + filter)
- ✅ WA Fonnte integration hardened (phone normalize, BullMQ retry, webhook fallback, ID date/time WIB) + 18 templates
- ✅ WA event triggers (confirm/complete/cancel/reschedule + Info Psikolog & Welcome New Client di booking/klien pertama) + **Form Feedback H+1** (cron 08:00 WIB, minta klien balas WA, bukan link)
- ✅ **WA device pairing in-app** (27 Mei 2026): admin tambah/ganti nomor pengirim via UI (form → QR → activate), token disimpan di DB (`ClinicSettings.waActiveDeviceToken`), auto-cleanup device lama. Butuh env `FONNTE_ACCOUNT_TOKEN`.

> **WA troubleshooting (diagnosa 18 Mei 2026 — "WA belum terkirim"):**
> - **Klien: berfungsi.** Fonnte device `Althea Klinik` (62857...) status `connect`, kuota OK, pesan asuk `terkirim` dengan messageId asli. Status log mentok di `terkirim` (tidak naik ke `sampai`/`dibaca`) karena paket Fonnte **Free tidak kirim webhook delivery callback** — pesan tetap sampai ke klien, hanya badge status yang tidak maju. `FONNTE_WEBHOOK_URL` di-set tapi tidak efektif di paket Free.
> - **Psikolog: dulu tidak terkirim karena `m0_users.phone` KOSONG** (fan-out `booking-notification.service.ts:112` butuh `booking.psikolog.phone`). **Sudah di-fix 18 Mei 2026**: 8 akun psikolog yang kosong (id 147–153,156) di-backfill ke `085607550989` (placeholder bersama); Adi Prasetiyo (157) tetap nomor aslinya. Sumber nomor = `m0_users.phone`, diedit via `/admin/users-roles` — bukan `clinic_psikolog_profile`. Ganti placeholder dengan nomor asli tiap psikolog bila sudah tersedia.
> - 3 log `status=queued` (11 Mei 2026) = artefak pra-queue-worker, abaikan.
- ✅ Psikolog workflow: dashboard real-data, sessions SOAP, patients, profile (editable + **avatar upload base64**), schedule self-service (weekly + per-tanggal override), rooms read-only
- ✅ Receptionist status board + SSE realtime
- ✅ Owner KPI dashboard + audit log viewer
- ✅ Payment: DP/lunas + pdfkit receipt + WA send
- ✅ PWA: manifest + service worker (cache-first static, network /api+SSE)
- ⏳ Outstanding: PWA proper icons (SVG placeholder), mobile QA real-device, prisma migration drift reconcile

Untuk tambah fitur baru: ikuti pattern slice di `.planning/phases/<n>/` — `SPEC → PLAN → execute → VERIFICATION`. Lihat `.claude/agents/gsd-*.md` untuk workflow.
