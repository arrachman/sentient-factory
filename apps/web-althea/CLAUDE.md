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

Service types: konseling (5), terapi dewasa & anak (4), tes psikologi (7) — total 16 service catalog.

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
- Klien (`/resepsionis/clients`, detail `/resepsionis/clients/[id]`) — reuse `ClientsPage` + `ClientDetailPage` dari `features/admin-clients` dengan prop `basePath="/resepsionis/clients"` dan `schedulePath="/resepsionis/daftar-jadwal"`. Akses full (sama dengan admin: lihat / tambah / edit / hapus). `basePath` & `schedulePath` di-thread ke `DetailHeader` supaya link "Kembali" dan "Jadwalkan" tetap di prefix `/resepsionis/*` (tidak ke-bounce role guard).

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
- **Slot range per-layanan (override)**: `ClinicService.slotOverrides` (JSON `[{index,start,end}]`) boleh **menggeser range waktu** slot tertentu untuk layanan itu. **Identitas slot (jumlah, label, urutan, index) TETAP dari `slotsOfDay` global** — override hanya start/end; slot tanpa override mewarisi waktu global. Index hasil tetap sejajar global ⇒ `slotIndices` availability psikolog tetap valid (availability psikolog tetap acuan slot global). Resolusi via `resolveServiceSlots(global, overrides)` — ada di backend `clinic-booking/slot-resolve.util.ts` & frontend `features/admin-layanan/model/slot.ts` (mirror). `assertSlotMatch` validasi terhadap slot ter-resolve bila `serviceId` dikirim (fallback global bila tidak). Editor: **Admin → Layanan → Edit → Range Waktu Slot**; ringkasan read-only di **Pengaturan → Slot Operasional → Slot Khusus per Layanan**.
- **Psikolog availability cascade**:
  1. Date override (`ClinicPsikologDateOverride`) — priority untuk tanggal exact
  2. Weekly recurring (`ClinicPsikologProfile.weeklyAvailability`) — fallback
  3. Empty `{}` → "belum set" → block booking
- **Service ↔ Psikolog**: junction `ClinicPsikologService`. Kosong = handle semua. Filter di booking wizard via `psikologListFiltered`.
- **No past booking**: wizard tambah jadwal tidak boleh pilih tanggal/jam lampau. `DateStrip` tandai tanggal < hari ini sebagai status `past` (disabled, label "Lewat"); slot dengan jam mulai ≤ sekarang di-block saat tanggal = hari ini (di-strip dari `SlotGrid`). Helper di `booking-wizard/wizard-utils.ts`: `todayDateStr`, `isPastDate`, `pastSlotIdx` — dipakai single-session (`use-wizard-state`) & multi-session (`session-row`). Default sesi 1 = H+1 jadi aman by default. Backend `assertSlotMatch`/validasi jam tetap last-line enforcement.
- **Timezone**: semua HH:MM/dow comparison di TZ klinik (`Asia/Jakarta`), bukan server TZ. Backend pakai `localPartsInTimezone()`. Frontend: tampilkan `Date.toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })` kalau butuh display.

### Booking wizard pattern (ADR 011)
- Single-page form (4 section vertical scroll, no step navigation)
- Auto-scroll cascade saat user pick (via `useEffect` + `ref.scrollIntoView`)
- Searchable combobox untuk client, chip grid untuk service, card grid untuk psikolog, DateStrip + slot button grid untuk jadwal
- `Idempotency-Key` header per submit (`apiClient` set otomatis untuk mutation)

### WA trigger — fan-out ke psikolog (per 18 Mei 2026)
- **Sumber fan-out**: kolom `ClinicWaTemplate.recipients` (array `['klien'|'psikolog']`). `BookingNotificationService.notify()` selalu dispatch ke klien, lalu dispatch kedua ke psikolog **kalau** template recipients mengandung `'psikolog'` **dan** `User.phone` psikolog tidak null. Error sisi psikolog di-catch terpisah → tidak ganggu kirim ke klien.
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
