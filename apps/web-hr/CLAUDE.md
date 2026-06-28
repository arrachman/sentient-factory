# web-hr — Senti HR (rulebook)

Produk **Senti HR** — Time & Attendance / Workforce Management, adaptasi
**jibble.io**. **Adopter bersih pertama** `@sentient-factory/ui-kit`.

Rulebook ini berlaku **di atas** root `CLAUDE.md` + `packages/ui-kit/FRONTEND-DESIGN-SYSTEM.md`
(otoritatif). Skill: `.claude/skills/hr/SKILL.md`. Desain DB/roadmap:
`db-design/module-roadmap.md`.

## Non-negosiabel

1. **Ikuti FRONTEND-DESIGN-SYSTEM.md.** Stack, folder, kontrak API-client, token
   identik lintas app. Primitif UI di `components/ui/` (re-export ui-kit Tier 2).
2. **HR bukan greenfield.** Backend `/api/hr/*` (api-gateway `hr-attendance`,
   raw-SQL atas `hr_*` live) sudah ada — reuse, jangan rewrite.
3. **DB additive only.** `hr_` juga prefix tabel warehouse → JANGAN
   `prisma migrate dev/diff` mentah. Lihat `db-design/module-roadmap.md §5`.
4. **Design system dulu.** Tidak ada style/warna/spacing hardcode; token via CSS
   variables (`styles/hr-tokens.css` override brand, nama token dari ui-kit).
5. **File ≤ 400 baris** (`npm run check:size`).
6. **Ragu → tanya user.** Aksi berisiko (schema/migrasi, hapus, lintas-app) =
   konfirmasi.

## Arsitektur

- Next.js 16 + React 19 + Tailwind v4 + TS strict. Port **3221** (`WEB_HR_PORT`).
- ui-kit langsung: `createApiClient`/`AppQueryProvider`/`cn` (Tier 1) + `ui/*`
  (Tier 2). `transpilePackages: ['@sentient-factory/ui-kit']`.
- **Base URL** = same-origin `/api` → `next.config.mjs` rewrite ke
  `HR_INTERNAL_API_URL` (api-gateway). Browser panggil `/api/hr/*` + `/api/auth/*`.
- **Auth** = sesi platform (cookie `sf_token`); web-hr TIDAK punya login. 401 →
  `QueryState` menampilkan hint "login lewat platform".
- Error class `HrApiError`, query-key namespace `['hr', …]`, storageKey `hr-theme`.

## Struktur

```
app/                 # routing tipis; app/app/* = shell + screens
  layout.tsx         # providers + appearance init (themeColor teal)
  app/layout.tsx     # AppShell wrapper
  app/<route>/page.tsx
components/
  ui/                # re-export ui-kit/ui/* (satu-satunya yang sentuh primitif)
  molecules/         # page-header, query-state
  organisms/         # data-table, app-shell di templates/
  templates/         # app-shell (sidebar+topbar lean, data-driven lib/nav.ts)
  pages/             # satu file per layar (identitas app)
lib/
  api/               # client.ts + types.ts + hooks.ts + index.ts + <resource>.ts
  nav.ts             # HR_NAV (live + soon)
  utils.ts           # cn re-export
shared/providers/    # query-provider re-export
styles/              # globals.css + hr-tokens.css
db-design/           # module-roadmap.md (DB plan + jibble mapping)
```

## Layar live (Fase 1, consume `/api/hr/*`)

Dashboard, Riwayat Absensi, Tinjauan Absensi (approve/reject/clarify/reopen),
Lokasi & Geofence, Pendaftaran Wajah, Karyawan.

## Roadmap (Fase 2+, stub coming-soon)

Timesheet → Jadwal/Shift → Cuti → Proyek/Aktivitas → Laporan/Export → Kiosk →
Pengaturan. Tiap modul = approval terpisah + desain DB additive. Detail +
gap jibble lengkap di `db-design/module-roadmap.md`.

## Perintah

```bash
npm run dev          # port 3221
npm run build && npm start
npm run check        # lint + typecheck + check:size + test
```

## Status verifikasi (2026-06-28)

- ✅ `tsc --noEmit` bersih · ✅ `check:size` bersih · ✅ Turbopack **compile sukses**
- ✅ `next dev` menyajikan halaman nyata (HTTP 200, shell + dashboard render)
- ⚠️ `next build` gagal HANYA saat prerender halaman internal Next `/_global-error`
  (`useContext` null) — sharp-edge Next 16.1.1 + Turbopack + workspace symlink,
  **bukan** kode app. Semua route app sudah `force-dynamic` (cookie-auth runtime),
  jadi prerender statis memang tidak dipakai. Jalankan dengan `next dev`/`next start`.

## Catatan build/deps (monorepo)

- Dep di-hoist ke root `node_modules`; Turbopack di-set `root: <monorepo-root>`
  agar resolve (lihat `next.config.mjs`). `__dirname` TIDAK cukup untuk deps ter-hoist.
- web-hr punya `node_modules` lokal (pin `next@16.1.1`) hasil workspace install.
  Jangan hapus — root punya `next` versi beda (drift). Reinstal via `npm install`
  di root (jangan `-w web-hr` sendiri — itu mem-prune workspace lain).

## Catatan deviasi (sadar)

Shell HR sengaja **lean** (sidebar+topbar), bukan port multi-tab shell web-erp
yang terkopel ke 200+ halaman ERP. Mengikuti token/folder/kontrak yang sama;
shell kaya bisa di-port bila HR butuh multi-tab.

## Disiplin dokumen

Setiap keputusan/perubahan → update file ini atau `db-design/`. Jangan declare
selesai sebelum dokumen sinkron.
