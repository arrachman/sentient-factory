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
- **Auth** = sesi platform (cookie `sf_token`). web-hr punya halaman login
  sendiri (`app/login/page.tsx`, UI split-screen meniru web-erp, brand HR/teal):
  POST `/api/auth/login` **by EMAIL** `{ email, password }` (rewrite ke gateway,
  modul `src/auth` — BUKAN `/erp/auth/login` yang set `erp_token` HttpOnly & tak
  dibaca guard HR) → simpan JWT `data.token` sebagai cookie `sf_token` (Path=/,
  SameSite=Lax; Max-Age 7h bila "Ingat saya", else session) → redirect
  `returnTo`. **Mode demo**: akun seed DEV `admin@example.com` / `Password123!`
  (semua user `prisma.user` dari `prisma/seed.ts` pakai password ini; admin =
  privileged agar layar review tampil) — email ter-prefill, tombol "isi otomatis"
  mengisi password. Demo creds = kredensial seed dev (bukan rahasia produksi),
  pola sama seperti web-erp. ⚠️ Catatan tabel: login email = tabel `prisma.user`
  (`@example.com`), BEDA dari `erpUser` (`rania@senti-erp.local/sentient` di
  `/erp/auth/login`). Tidak mengelola user/registrasi — hanya menukar kredensial
  platform jadi cookie pada origin ini (origin LAN tak mewarisi cookie app lain).
  401 → `QueryState` tampil tombol **Masuk** menuju `/login?returnTo=<path>`.
- **Auth gate** = `proxy.ts` (konvensi Next 16, ex-`middleware`): route `/app/*`
  tanpa cookie `sf_token` → redirect 307 ke `/login?returnTo=<path>` sebelum
  shell render. Backstop client di `AppShell` (`useSessionGuard` via `useHrMe`):
  cookie ada tapi token kedaluwarsa (401 `/api/auth/me`) → redirect `/login`
  juga. `/login` + `/api/*` + aset statis tetap publik.
- Error class `HrApiError`, query-key namespace `['hr', …]`, storageKey `hr-theme`.

## Struktur

```
proxy.ts             # auth gate Next 16: /app/* tanpa sf_token → redirect /login
app/                 # routing tipis; app/app/* = shell + screens
  layout.tsx         # providers + appearance init (themeColor teal)
  login/page.tsx     # login tipis (tukar kredensial platform → cookie sf_token)
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

## Live Fase 2 (consume `/api/hr/*`)

Timesheet (derived), Cuti/PTO (`hr-leave`), Jadwal/Shift + Proyek/Aktivitas
(`hr-workforce` — `hr_shifts`/`hr_shift_assignments`/`hr_projects`/
`hr_project_time_entries`), Laporan/Export (`hr-reports` — derived, tanpa tabel
baru; rekap kehadiran/jam proyek/cuti + export CSV/XLSX via exceljs,
privileged-only), Mode Kiosk (`hr-kiosk` — perangkat bersama dibuka admin; clock
via PIN per-karyawan `hr_users.kiosk_pin_hash` di-hash scrypt; jalur wajah
backend-ready via clock-by-appUserId; privileged-only).

## Live "Pengaturan lanjutan" (Fase 2 lanjutan)

Kalender Libur (`hr-holidays` — tabel `hr_holidays` additive; list publik, CRUD
privileged), Aturan Lembur & Istirahat (`hr-policy` — `GET/PUT /hr/policy/overtime`,
disimpan di `hr_settings` group `overtime` dengan key snake_case fully-qualified,
TANPA tabel baru; GET publik, PUT privileged), Akses & Peran/RBAC (`hr-roles` —
tabel `hr_roles` + `hr_user_roles` additive; seed 3 peran sistem
HR_ADMIN/MANAGER/EMPLOYEE; manajemen peran + penugasan per-karyawan).

**Enforcement RBAC (additive):** helper `resolveHrPrivilege(prisma, authUser)` di
`hr-attendance-helpers` — privileged jika **JWT platform roles** (`admin`/`manager`)
**ATAU** punya peran `HR_ADMIN`/`HR_MANAGER` di `hr_user_roles`. Hanya MENAMBAH
akses (tak pernah mengunci). **Diwire ke SELURUH modul HR** — holidays/policy/roles,
`hr-attendance` (review/query/timesheet/face-enroll/face-identify/user-worksite/
settings), `hr-leave`, `hr-workforce` (shift/project), `hr-reports` (cek pindah ke
service `ensurePrivileged` karena controller tak punya prisma), `hr-kiosk`. Tak ada
lagi `isPrivileged(JWT)` langsung sebagai gate; `isPrivileged` hanya dipakai internal
oleh `resolveHrPrivilege`.

**Timesheet konsumsi kebijakan:** `GET /hr/timesheets` membaca policy `overtime`
(`daily_regular_hours`, `enabled`, `count_holiday_as_overtime`) + `hr_holidays`.
Kolom baru `holidayDays`/`holidayMinutes`; `overtimeMinutes` = seluruh jam di hari
libur (bila `count_holiday_as_overtime`) atau jam di atas `daily_regular_hours`.

## Roadmap (Fase 2+ sisa, stub coming-soon)

SSO/2FA (lintas-app, terkopel auth ERP — butuh koordinasi backend platform) +
lock periode/audit laporan + NFC/offline-sync & jalur wajah kiosk di frontend +
(enforcement RBAC sudah seragam di semua modul HR). Tiap modul =
approval terpisah + desain DB additive. Detail + gap jibble lengkap di
`db-design/module-roadmap.md`.

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
