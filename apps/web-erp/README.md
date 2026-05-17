# Sentient ERP — `web-erp`

Senti ERP. **Next.js 16 App Router + React 19**, stack mirror
`apps/web-althea` (Tailwind v4, shadcn/radix primitives, TanStack
Query/Table, react-hook-form + zod, Vitest). Anggota npm workspace
(`name: web-erp`).

## Keputusan (2026-05-17, dengan user)

> **Reversal keputusan terkunci sebelumnya.** Frontend TIDAK lagi
> "lanjutkan prototype standalone CDN-React". Sekarang: **app Next.js
> penuh di `apps/web-erp/`**, stack disamakan dengan web-althea.
> `prototype/` turun status jadi **referensi desain saja** (sumber port
> design system + shell). `preferensi/` tetap referensi legacy MyERP+.
> `db-design/` & `DB-DESIGN.md` tetap dokumen desain DB.

## Menjalankan (mode dev)

Port **3219** (`config/ports.json → apps.web-erp`, env `WEB_ERP_PORT`).
Dev server bind `0.0.0.0` (LAN) — butuh UFW dibuka (lihat root `CLAUDE.md §4.1`).

```bash
cd apps/web-erp
npm run dev          # next dev (Turbopack) :3219
npm run typecheck    # tsc --noEmit
npm run lint
npm run test
```

Akses: `http://localhost:3219/` atau `http://<host-ip>:3219/` dari LAN.

## Struktur

**Atomic design (hybrid — keputusan 2026-05-17, dengan user):**
`components/ui/` dipertahankan sebagai layer **atoms + molecules**
(konvensi shadcn/web-althea flat, tetap), ditambah `organisms/` &
`templates/`. Import langsung (tanpa barrel/index). `app/` (route Next.js)
= layer **pages**.

```
app/                  # App Router = layer "pages" (layout.tsx, page.tsx → AppShell)
components/ui/         # atoms + molecules (button/input/card/select/tabs/charts/…)
components/organisms/  # sidebar topbar tab-bar command-palette table modal filter-chips
components/templates/  # app-shell (shell layout + renderRoute dispatcher)
components/pages/       # halaman ter-port: dashboard, statistik, settings, appearance,
                       #   kas-masuk-list, generic-list, financial-report, data-list,
                       #   buku-besar, coming-soon, quick-action (+ *-parts split <400)
shared/providers/     # TanStack Query provider
styles/               # globals.css + erp-tokens.css + erp-components.css (port dari prototype/styles.css)
lib/                  # utils (cn), mock (port data.jsx), nav (model menu shell),
                       #   registry (REGISTRY/REPORTS/MODULES + generator data-driven),
                       #   feedback (notify/bulkAction → sonner), tab-context (useTabKey)
prototype/            # REFERENSI desain (CDN-React SPA) — bukan runtime
preferensi/           # REFERENSI legacy MyERP+ — read-only
db-design/, DB-DESIGN.md  # desain DB (dokumen)
```

`prototype/`, `preferensi/`, `db-design/` di-exclude dari tsconfig,
eslint, dan Tailwind v4 `@source` (globals.css pakai `source(none)` +
daftar source eksplisit — auto-crawl `preferensi/` 1.1 GB membekukan
compile).

## Status

Skeleton + design system ter-port (tokens, dark + 9 palette switcher,
primitif, app shell, dashboard).

**Batch data-driven core ter-port (2026-05-17, dengan user):** seluruh
item sidebar fungsional via `renderRoute` di `app-shell` —
`DataList` (REGISTRY: master data + dokumen inv/pur/sls/prd/fa, ~26 modul),
`GenericList` (MODULES: transaksi keuangan), `FinancialReport` (REPORTS),
`Statistik`, `SettingsPage`, `AppearancePage` (theme via next-themes +
data-* attr, tanpa global tweak store), `KasMasukList`, `BukuBesar`.
Data layer = `lib/registry.ts` (generator deterministik, mock).
Login di-skip (shell React-local, tanpa auth — keputusan scaffold).

**Ditunda batch berikutnya:** form input (`*-new` → `TrxForm`/`RecordForm`,
saat ini fallback `ComingSoon`), panel notifikasi/aktivitas, lookup
modal, contact picker, confirm host.

## Catatan setup

- SWC native (`@next/swc-linux-x64-gnu`) di-install isolated ke
  `apps/web-erp/node_modules` — Turbopack tak jalan di WASM fallback.
- `npm install -w web-erp` gagal (`workspace:` protocol di paket lain
  monorepo); pakai install isolated di dir app bila perlu re-install.
- `config/ports.json` di-deny harness untuk Edit; port di-set via
  `node scripts/port-manager.js update web-erp 3219`. Field `name`/
  `type` entri masih "Web ERP (Prototype)"/"static" (stale, port benar).
