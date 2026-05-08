# web-dashboard — Agent Guide

Dashboard administrasi utama. Berbasis **Metronic React Starter Kit v9** (Next.js App Router).

## Stack
- **Next.js 14+ (App Router)**, React 18, TypeScript strict.
- **TanStack Query v5** untuk data fetching.
- **TanStack Table v8** untuk tabel data.
- **Tailwind CSS** + ShadCN-style komponen di `components/`.
- **react-hook-form** + `@hookform/resolvers` (zod biasanya).
- **ApexCharts** untuk chart.
- **TensorFlow.js** + `@tensorflow-models/face-detection` untuk fitur deteksi wajah (login/attendance).
- **MediaPipe Tasks Vision** untuk computer vision realtime.
- E2E: **Playwright**. Unit: **Vitest**.

## Port
3101 (env `WEB_DASHBOARD_PORT`).

## Perintah
```bash
npm run dev
npm run build && npm start
npm run check          # lint + typecheck + vitest
npm run test:e2e       # playwright
npm run build:staging  # pakai .env.staging
```

## Layout
```
app/                # Next.js routes (App Router)
components/         # UI components (presentational + ShadCN-ish)
features/           # Feature modules (logic + UI gabungan per domain)
hooks/              # Custom hooks
lib/                # Utilities, API clients
config/             # Konstanta runtime
middleware.ts       # Next middleware (auth, redirect)
e2e/                # Playwright tests
```

## Konvensi
- **Server components** by default. `"use client"` hanya saat butuh interaktivitas.
- Data fetching:
  - Server: fetch di Server Component / Route Handler.
  - Client: TanStack Query (jangan campur dengan SWR).
- Form: `react-hook-form` + zod schema; jangan controlled state manual untuk form panjang.
- Style: Tailwind utility-first. Variant pakai `class-variance-authority`.
- Import alias: cek `tsconfig.json` (`@/*` biasanya → root).
- **JANGAN** masukkan API key ke `NEXT_PUBLIC_*` kecuali memang public.

## API integration
- Base URL dari `NEXT_PUBLIC_API_URL` → titik ke `api-gateway` (3103).
- Auth pakai cookie/JWT yang di-set oleh api-gateway. Cek `middleware.ts` untuk guard.

## Hal yang sering bikin masalah
- Pakai hook React di Server Component → error build.
- Lupa `"use client"` di komponen pakai `useState`/`useEffect`.
- Import dari `node_modules` Metronic langsung — pakai re-export di `components/` agar konsisten.
- TF.js bundle besar — lazy-load model (`dynamic import`) di route yang butuh saja.

## Testing
- Vitest untuk util + hook murni.
- Playwright e2e: jalankan dengan `api-gateway` & DB hidup (Docker stack up).

## Jangan disentuh tanpa diminta
- `next.config.mjs` (sudah dituning untuk TF.js + workspaces).
- `middleware.ts` (logic auth global).
- Tema Metronic core di `components/` yang nggak ada eksten kita.
