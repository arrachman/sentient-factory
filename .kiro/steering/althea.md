---
inclusion: fileMatch
fileMatchPattern: "apps/web-althea/**"
---

# Althea — Web App Klinik Psikologi

`apps/web-althea` — aplikasi internal **Althea Psychology**. Pasien TIDAK login; semua booking adalah admin-driven.

#[[file:apps/web-althea/CLAUDE.md]]

## Tech Stack

- Next.js App Router (React 19, TypeScript strict), port **3202**
- Tailwind CSS v4 + token di `styles/althea-tokens.css`
- ShadCN-style (`components/ui/`), Radix UI, Lucide React, Sonner toast
- TanStack Query v5 (client), fetch di Server Component (server)
- TanStack Table v8, react-hook-form + zod, recharts
- E2E: Playwright | Unit: Vitest
- Font: Lora (serif, headline) + Nunito Sans (body/UI)
- Live: `https://althea.fr-labs.my.id/` | API: `/api` → `192.168.1.150:3203`

## 6 Role Internal

| Role | Path prefix | Default landing |
|------|-------------|-----------------|
| `clinic-admin` | `/admin/*` | `/admin/jadwal` |
| `clinic-psikolog` | `/psikolog/*` | `/psikolog/dashboard` |
| `clinic-owner` | `/owner/*` | `/owner/dashboard` |
| `clinic-resepsionis` | `/resepsionis/*` | `/resepsionis/dashboard` |
| `clinic-marketing` | `/marketing/*` | `/marketing/dashboard` |
| `clinic-intern` | `/intern/*` | `/intern/dashboard` |

`clinic-admin` bypass semua route.

## Layout Folder

```
app/
├── (auth)/login/
├── admin/
│   ├── (admin)/jadwal/     # landing admin
│   ├── daftar-jadwal/      # booking state machine
│   ├── notif-wa/           # WA template + activity log
│   └── ...
├── psikolog/
├── owner/
├── resepsionis/
└── api/                    # Route handlers (auth proxy)

features/<feature>/         # api/ hooks/ model/ ui/
components/layouts/admin-shell/  # Sidebar + topbar (nav-config.ts per role)
proxy.ts                    # Auth guard + role-based redirect
```

## API Integration

- Browser: `NEXT_PUBLIC_API_URL` (`ENV.API_URL`) — relative `/api`
- **Server-side** (Route Handler / SSR): `API_URL_INTERNAL` (`ENV.API_URL_INTERNAL`) — **wajib absolute** `http://localhost:3203/api`. Relative URL di Node fetch → 502.
- Endpoint prefix: `/clinic/*`
- DB table prefix: `clinic_*`
- Auth cookie: `sf_token`

## Design System — Sage + Cream + Deep Teal

Token (`styles/althea-tokens.css`): Primary `--sage-500` (#5b8a66), BG `--cream-50` (#fbfaf6), Text `--teal-800` (#142828), Accent `--rose-500` (#c97a5d).

Service color (left border 4px): Konseling→sage | Terapi dewasa→blue-grey | Terapi anak→rose | Tes psikologi→amber

## Konvensi Coding

- Server Components default. `"use client"` hanya untuk state/effect/event.
- TanStack Query saja untuk client fetching — jangan campur SWR.
- Form: react-hook-form + zod. Import alias: `@/*` → root app.

## Gotcha

- Hook React di Server Component → error build. Tambah `"use client"`.
- `useSearchParams` tanpa `<Suspense>` → crash.
- `new Date()` di first render → SSR hydration mismatch. Defer ke `useEffect`.
- Server-side fetch pakai `ENV.API_URL` (relative) → 502. Pakai `ENV.API_URL_INTERNAL`.
- Hardcode port 3202 → pakai `process.env.WEB_ALTHEA_PORT`.

## Jangan Disentuh Tanpa Diminta

- `next.config.mjs` — sudah dituning Docker standalone.
- `proxy.ts` — auth/role guard global.
- `components/ui/*` upstream ShadCN — modifikasi via `cva` variant saja.
- `config/ports.json` di root monorepo.
