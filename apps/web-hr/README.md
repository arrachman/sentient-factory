# Senti HR (`web-hr`)

Time & Attendance / Workforce Management untuk Sentient Factory — adaptasi
**jibble.io**, dan **adopter bersih pertama** `@sentient-factory/ui-kit`.

- **Port:** 3221 (`WEB_HR_PORT`) · origin `hr.fr-labs.my.id`
- **Backend:** shared api-gateway `/api/hr/*` (reuse modul HR live:
  `hr-attendance`, `hr-leave`, `hr-workforce`, `hr-reports`, `hr-kiosk`)
- **Auth:** sesi platform (cookie `sf_token`) — login lewat platform Sentient
- **Stack:** Next.js 16 · React 19 · Tailwind v4 · TanStack Query · ui-kit

## Setup

```bash
cp .env.example .env.local      # set HR_INTERNAL_API_URL bila perlu
npm install                     # dari root monorepo (workspaces) — lihat catatan
npm run dev                     # http://localhost:3221
```

> **Catatan install:** ui-kit dikonsumsi sebagai workspace package (`"*"`).
> Pakai `npm install` di root monorepo agar tertaut. Jika root install bermasalah
> (lihat web-mdp), pastikan `@sentient-factory/ui-kit` ada di `node_modules`
> root sebelum `npm run dev`/`typecheck`.

## Verifikasi

```bash
npm run typecheck
npm run build
npm run check        # lint + typecheck + check:size + test
```

## Struktur & aturan

Lihat `CLAUDE.md` (rulebook) dan `db-design/module-roadmap.md` (peta modul +
adaptasi jibble + rencana DB). Standar lintas-app: `packages/ui-kit/FRONTEND-DESIGN-SYSTEM.md`.

## Status

- **Fase 0 ✅** scaffold (configs, ui-kit wiring, shell, tokens, api foundation).
- **Fase 1 ✅** layar absensi live: dashboard, riwayat, tinjauan (approve/reject/
  clarify/reopen), lokasi & geofence, pendaftaran wajah, karyawan.
- **Fase 2 🟡** fitur live bertahap: timesheet (derived), cuti/PTO, jadwal/shift,
  proyek/aktivitas, laporan/export, dan mode kiosk + PIN. Sisa modul lanjutan
  (pengaturan overtime/break, lock period, NFC/offline, kiosk face UI, SSO/2FA)
  masih butuh approval + DB additive per modul.

## Catatan keamanan

web-hr tidak punya auth sendiri; mengandalkan cookie sesi platform. Endpoint
`/api/hr/*` diguard `JwtAuthGuard` di backend. Modul Productivity/Monitoring/
Screenshots (roadmap) bersifat sensitif privasi — wajib opt-in + transparan.
