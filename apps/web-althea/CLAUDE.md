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
app/                           # Next.js App Router
├── (auth)/                    # Public routes — login (no register, admin-only seeding)
├── (admin)/                   # Role: clinic-admin
├── (psikolog)/                # Role: clinic-psikolog
├── (owner)/                   # Role: clinic-owner
├── (resepsionis)/             # Role: clinic-resepsionis
├── (marketing)/               # Role: clinic-marketing
├── (intern)/                  # Role: clinic-intern
├── api/                       # Route handlers (proxy ke api-gateway bila perlu)
├── layout.tsx                 # Root layout (providers, fonts, theme)
└── page.tsx                   # Root → redirect ke /login or /dashboard

components/                    # ShadCN-style UI primitives + komponen presentational
features/                      # Feature modules per domain (pattern api/, hooks/, model/, ui/)
hooks/                         # Custom hooks lintas-feature
lib/                           # Utilities, api-client, helpers
config/                        # Konstanta runtime (urls, paths, dll)
shared/                        # auth/, api/, providers/, constants/, utils/, types/
styles/                        # globals.css (Tailwind + tokens) + althea palette
public/                        # Static assets (logo, images)
proxy.ts                       # Auth guard + role-based redirect (Next.js 16 proxy convention; was middleware.ts)
types/                         # Type definitions global
```

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
- Endpoint psychology: prefix `/althea/*` (e.g. `/althea/psikolog`, `/althea/booking`, `/althea/sessions`).
- DB: `api-gateway` pakai schema PostgreSQL terpisah `althea_*` (jangan bocor ke schema ERP).
- Auth: cookie/JWT yang di-set api-gateway. Middleware Next baca `sf_token` cookie.

### Strategi backend (ADR ringkas)
Saat ini: **Opsi A (extend `api-gateway`)** dengan namespace `/althea/*` dan schema `althea_*`. Alasan: cepat go-MVP, share auth & user table.

Future migration: **extract ke `api-althea` service** (port 3204, slot reserved) saat traffic/team membesar atau scope compliance perlu isolated. Frontend tidak perlu berubah — `api-gateway` tetap edge proxy.

## Role-based routing

`proxy.ts` cek cookie + role claim dari JWT (`roles: string[]`), pick first `clinic-*` role, redirect ke route group sesuai:

| Role                   | Route group prefix    | Default landing |
|------------------------|----------------------|-----------------|
| `clinic-admin`         | `/(admin)/*`         | `/dashboard`    |
| `clinic-psikolog`      | `/(psikolog)/*`      | `/dashboard`    |
| `clinic-owner`         | `/(owner)/*`         | `/dashboard`    |
| `clinic-resepsionis`   | `/(resepsionis)/*`   | `/dashboard`    |
| `clinic-marketing`     | `/(marketing)/*`     | `/dashboard`    |
| `clinic-intern`        | `/(intern)/*`        | `/dashboard`    |
| (no token)             | `/(auth)/login`      | `/login`        |

Admin bypass: `clinic-admin` boleh akses semua route. Role lain hanya prefix mereka (per `ROLE_ROUTE_PREFIXES` di `shared/auth/constants.ts`).

Route group syntax `(name)` di Next.js tidak mempengaruhi URL — semua role landing di `/dashboard`, route group menentukan layout & components.

Token cookie name: `sf_token` (shared dengan web-dashboard untuk SSO).

## Mobile responsive
**Desktop-first** — primary target laptop/desktop. Tapi **wajib accessible di mobile** (responsive breakpoints Tailwind):
- `sm` 640px, `md` 768px, `lg` 1024px, `xl` 1280px
- Patient routes: lebih agresif mobile-friendly (target mahasiswa/karyawan akses dari HP)
- Admin routes: optimized desktop, tetap usable di tablet

## Hal yang sering bikin masalah
- Pakai hook React di Server Component → error build. Mark `"use client"` saat butuh state/effect.
- Lupa wrap `<Suspense>` saat pakai `useSearchParams` di client component.
- Import dari `apps/psychology-design/*.jsx` langsung — itu **mockup**, bukan source-of-truth. Re-implement di `features/`/`components/`.
- Hardcode port 3202 — pakai env `WEB_ALTHEA_PORT` atau `process.env.PORT`.
- Lupa role check di middleware → patient bisa akses route admin.

## Testing
- **Vitest** untuk util pure + hook deterministik.
- **Playwright** e2e: jalankan dengan `api-gateway` & DB hidup (Docker stack up).
- Mock API di unit test pakai MSW kalau perlu (belum di-setup, tambah saat butuh).

## Jangan disentuh tanpa diminta
- `next.config.mjs` — sudah dituning untuk Docker standalone & dev origins.
- `proxy.ts` — logic auth/role global. Ubah hati-hati.
- Tema ShadCN core di `components/ui/*` yang upstream — modifikasi via `cva` variant, bukan edit langsung.
- Port di `config/ports.json` — koordinasi dengan tim dulu sebelum ubah.

## Roadmap fitur (urut prioritas)
1. Auth (login pasien, login psikolog, register pasien) — hook ke api-gateway
2. Booking wizard pasien (pilih layanan → pilih psikolog → pilih jadwal → konfirmasi)
3. Patient dashboard (sesi mendatang, riwayat)
4. Psikolog dashboard (jadwal hari ini, sesi mendatang)
5. Admin: psikolog CRUD, layanan CRUD, rooms CRUD
6. Admin: clients (pasien), users-roles
7. Admin: notif-wa template + dispatch
8. Admin: audit log, pengaturan global
9. Polish: notifikasi realtime, payment integration, room joining
