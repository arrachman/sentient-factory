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

- Next.js 16 + React 19 + Tailwind v4 + TS strict. Port **3209** (`WEB_HR_PORT`).
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
  **Logout** (`UserMenu` di `app-shell` Topbar): karena `sf_token` di-set
  client-side (bukan HttpOnly), keluar = `clearSession()` di `lib/api/auth.ts`
  (hapus cookie `sf_token`) lalu `window.location.assign('/login')` (hard reload
  buang seluruh query cache). TIDAK ada endpoint logout backend.
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
  organisms/         # data-table, dynamic-sidebar, tab-bar
  templates/         # app-shell (multi-tab chrome: rail+topbar+tabstrip)
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

### Stage absensi `/app/attendance` (clock screen, redesign 2026-06-30)

Layar full-bleed kamera (`attendance-clock-view.tsx`) dengan 3 overlay glass
di atas `<video>`: top bar (status + jam live + Daftarkan Wajah), **face
scanner 3D**, dan action dock (readiness stepper + tombol clock).

- **Face scanner** (`attendance-face-scanner.tsx` + `styles/hr-attendance.css`):
  oval spotlight + dua gyro-ring berputar (kesan 3D), scan-sweep, corner
  brackets yang merapat saat lock, dan pulse. Fase via atribut `data-phase`
  (`init|scanning|locked|error`); animasi murni CSS, hormati
  `prefers-reduced-motion`.
- **Deteksi wajah** (`lib/use-face-detector.ts`): best-effort native
  `FaceDetector` (Shape Detection API). Bila ada → feedback framing real-time
  (present/centered), warning multi-wajah (anti buddy-punch), dan isi
  `faceScore`/`faceDetectionCount` (+`faceCentered`,`gpsAccuracyM` di metadata)
  ke payload clock; `faceDetectionMode='shape-detection'`. Bila tak didukung →
  `supported=false`, fallback "framing manual" (TIDAK pernah memalsukan lock).
  Backend tetap SSOT identitas.
- **Lokasi** (`lib/use-geo.ts`): status machine `idle|locating|ready|error` +
  `accuracy` (±m) + `locate()` untuk tombol **"Coba lagi"** — GPS gagal tak lagi
  membuat user mentok (perbaikan utama dari layar lama yang hanya menampilkan
  "Lokasi tidak tersedia" tanpa jalan keluar). Clock tetap di-gate `coords`.
- Kontrak `/api/hr/attendance/clock-in|clock-out` TIDAK berubah (field baru
  semuanya opsional).

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

## Setting → Tampilan (appearance, 2026-06-30)

Port 1:1 halaman **Setting → Tampilan** dari web-erp (via referensi web-mdp yang
juga 1:1 ERP). Route `/app/settings/appearance` (nav item "Tampilan", grup
Laporan & Lainnya). Komponen di `components/pages/`: `appearance-view.tsx`
(layar) + `appearance-cards.tsx` + `appearance-parts.tsx` (konstanta/helper) +
`appearance-preview.tsx` (kartu Pratinjau Langsung) + `use-appearance.ts` (hook).
Pendukung baru: `lib/i18n.ts` (`makeTranslator` ID/EN/JA, fallback ke key),
`lib/feedback.ts` (`notify` → sonner toast, `confirmAction` → native confirm),
`components/atoms/sparkline.tsx`.

Knob: Tema (next-themes light/dark), Bahasa (ID/EN/JA, hanya layar ini yang
ter-i18n), Warna Aksen (pack + swatch, default brand **teal**), Ukuran Font,
Kepadatan, Mode Sidebar (ikon/label + flyout/accordion), URL Routing. Diterapkan
ke `<html>` via `data-primary`/`data-density`/`data-fontscale`/`data-sidebar`/
`data-sidebar-menu` (token CSS sudah ada sejak scaffold ERP).

**Persistensi backend SSOT (2026-06-30):** preferensi disimpan di backend
`hr_user_preferences` (Prisma model `HrUserPreferences`, 1:1 port ERP
`adm_user_preferences`; PK = `user_id` platform = `sub` JWT `sf_token`; kolom
`theme`/`language` + sisa tweaks di `metadata` JSON). Migrasi Prisma
`20260630094036_hr_user_preferences` (schema `prisma/schema/hr-foundation.prisma`)
— tabel additive, sudah applied. Modul gateway `hr-user-preferences`
(`@Controller('hr/user-preferences')`: `GET me` + `PUT me`, guard
`JwtAuthGuard` — konsisten `hr-attendance`, baca `sf_token`). Client:
`lib/api/user-preferences.ts` (`getMyPreferences`/
`updateMyPreferences`); `use-appearance.ts` hidrasi sekali dari server saat mount
(server SSOT menimpa baseline) lalu mirror balik ke localStorage.
**localStorage** (key `hr-appearance`) tetap dipakai sebagai cermin anti-FOUC —
skrip blocking di `app/layout.tsx` membaca `data-*` (`primary`/`density`/
`fontscale`/`sidebar`/`sidebar-menu`) sebelum first paint; hook lalu re-apply dari
server SSOT setelah React mount. Knob **URL Routing** kosmetik (HR filesystem-routed
multitab; flag tersimpan tapi belum mengubah routing) — tetap disertakan demi
paritas visual. i18n hanya cover string layar appearance.

> ⚠️ Catatan deploy: `hr-user-preferences` adalah Prisma model, jadi setelah
> `prisma migrate` WAJIB `prisma generate` **di dalam container api-gateway**
> (node_modules = Docker volume, tak ikut bind-mount) + restart container —
> kalau tidak, `this.prisma.hrUserPreferences` undefined / route 404.

**Sidebar live menghormati config (2026-06-30):** `dynamic-sidebar.tsx` membaca
atribut `<html>` yang di-set hook appearance — `data-sidebar='label'` →
render `.nav-label` (Ikon + Label), `data-sidebar-menu='accordion'` → submenu
expand inline di bawah modul (`.accordion-submenu`/`.accordion-item`, modul aktif
auto-expand), default `flyout` (hover). Mode dibaca reaktif via `MutationObserver`
pada atribut sehingga ganti knob langsung berlaku tanpa reload. CSS sudah ada
sejak scaffold (`hr-panels.css [data-sidebar='label']`, `hr-shell.css .accordion-*`).

## Roadmap (Fase 2+ sisa, stub coming-soon)

SSO/2FA (lintas-app, terkopel auth ERP — butuh koordinasi backend platform) +
lock periode/audit laporan + NFC/offline-sync & jalur wajah kiosk di frontend +
(enforcement RBAC sudah seragam di semua modul HR). Tiap modul =
approval terpisah + desain DB additive. Detail + gap jibble lengkap di
`db-design/module-roadmap.md`.

## Perintah

```bash
npm run dev          # port 3209
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

## Shell multi-tab (Fase 2 — port dari web-erp, 2026-06-30)

Shell HR = **port multi-tab** dari web-erp (membatalkan keputusan "lean" awal,
atas permintaan user). Chrome di CSS Fase 1 (`hr-shell.css` + `hr-multitab.css`,
class identik ERP: `.app`/`.sidebar`/`.topbar`/`.tabstrip`/`.tabview`).

Komponen:
- `components/templates/app-shell.tsx` — chrome host (`.app` grid). Hidup di
  `app/app/layout.tsx` yang **persisten** lintas-navigasi, jadi tab strip awet.
- `components/organisms/dynamic-sidebar.tsx` — icon-rail + flyout, modul dari
  `useHrMyMenus()` (`GET /api/hr/sys-menus/my-menus`, role-filtered) dengan
  fallback `HR_NAV` statis bila API kosong/error. Ikon lucide via `resolveIcon`.
- `components/organisms/tab-bar.tsx` — tab strip gaya browser (close/close-lain/
  close-kanan/reload via context-menu, reorder via **@dnd-kit** SortableContext
  persis ERP). Ikon lucide langsung.
- `lib/use-hr-tabs.ts` — state tab **URL-driven** (tab = pathname `/app/...`).
- `lib/nav.ts` — `toAppPath`/`stripApp`/`resolveIcon`/`pageMetaFor` + `HR_NAV`
  (tetap `/app`-prefixed; SSOT fallback + uji `nav.test.ts`).

**Deviasi sadar dari shell ERP** (lebih lean — boleh diperkaya nanti):
- Tab di-key oleh pathname `/app/...` → view berbasis `<Link>` yang ada navigasi
  natif; **routing filesystem tetap SSOT** route→view (`app/app/<route>/page.tsx`
  render `<View/>`; AppShell render `{children}` di area tab, BUKAN registry).
- Hanya view route aktif yang mounted (tanpa hidden keep-alive divs); `reload`
  remount via nonce per-route. 1 route = 1 tab (tanpa duplikat).
- Belum ada: command palette (K), notification/activity drawer, i18n, mode
  accordion/url-routing toggle, persistensi workspace localStorage.

## List engine generik (Fase 3 — port §2.7 ERP, 2026-06-30)

`components/organisms/list-layout.tsx` (`HrListLayout`) = chrome list standar
ERP §2.7 di-port ke HR (tanpa i18n; reuse `Icon`/`Kbd`/`Select` + CSS Fase-1
`.page`/`.page-header`/`.search-input`/`.filter-bar`/`.filter-summary`/
`.page-body`). Menyediakan: action bar (search `/` + export + refresh + tambah
`N`), filter + summary bar (+ reset), state loading/error inline, keyboard-first
(`/ n ← → j k x Enter`), footer paginasi + hint. **Tabel = `children`** (HR
`DataTable` atau grid lebih kaya) — layout hanya pegang chrome sekeliling.

Props opsional: `search`/`onSearch` (sembunyikan box bila tak dipakai),
`toolbar` (kontrol filter custom mis. date-range), `filters` (Select generik),
`pagination` (server-side), `keyboardRows`. Pola adopsi: `<HrListLayout title
code loading error [search onSearch] onRefresh [onAdd] [filters|toolbar] summary
[pagination]>{table}</HrListLayout>`.

**7 view list sudah migrasi** ke `HrListLayout`: worksites (`GEO`), employees
(`EMP`), holidays (`HOL`, year filter), attendance-history (`ATT`, date-range
toolbar + server-pagination), timesheets (`TMS`, idem), leave (`LVE`, status
toolbar + pagination + ajukan), attendance-reviews (`REV`, status toolbar +
pagination). Search client-side untuk list kecil; server-side (debounce) untuk
yang ber-pagination.

**4 view sengaja bespoke** (multi-section, BUKAN single §2.7 list — mirip split
SimpleMaster-vs-bespoke ERP): roles (peran + penugasan), schedules (shift +
assignment), projects (proyek + time-entry), reports (katalog + filter + hasil).
Jangan paksa ke `HrListLayout` — mereka punya >1 tabel/seksi.

**List kaya (§2.9/§2.11) — DONE, pilot Worksites:** `DataTable` di-enhance
(opsional, backward-compatible) dengan: selection (checkbox kolom + select-all,
`selectedKeys`/`onToggleKey`/`onToggleAll`), kebab `rowActions(row)` + paritas
klik-kanan (`molecules/row-actions.tsx` = `RowActionsMenu`+`RowContextMenu`,
ui-kit dropdown/context, item `danger`), highlight `focusedIndex` (keyboard
`j/k/x/Enter` via `HrListLayout.keyboardRows`), dan `onRowOpen`. Bulk bar =
`organisms/bulk-action-bar.tsx` (`BulkActionBar` generik: `count`+`actions[]`+
`onCancel`, CSS Fase-1 `.bulk-bar`/`.ba-btn`) tampil saat ≥1 terpilih. **Adopter
= worksites-view** (Edit/Hapus di kebab, bulk Hapus, select-all, keyboard focus).
Replikasi ke view list lain: oper props selection/`rowActions`/`keyboardRows`
yang sama; pindahkan aksi inline lama ke `rowActions`.

## Disiplin dokumen

Setiap keputusan/perubahan → update file ini atau `db-design/`. Jangan declare
selesai sebelum dokumen sinkron.

## Workflow vibe coding — commit + build + restart + push (WAJIB, 2026-06-30)

**WAJIB tiap sesi vibe coding selesai** (satuan kerja yang bisa diserahkan),
jalankan **4 langkah berurutan tanpa kecuali**: **commit → build → restart serve
→ push**. Production web-hr = proses `npm run start` (`next start`) detached di
**port 3209** (bukan PM2). Push ke `origin dev` **sudah diizinkan user secara
standing** (2026-06-30) — lakukan otomatis, tak perlu tanya tiap kali.

Urutan baku (jalankan dari `apps/web-hr/`):

```bash
npm run check                       # 1a. lint+typecheck+size+test WAJIB hijau dulu
git add -A
git commit -m "feat(hr): <ringkas>" # 1b. branch dev; conventional, JANGAN --no-verify

npm run build                       # 2. build production (gagal → STOP, jangan lanjut)

fuser -k 3209/tcp 2>/dev/null || true   # 3. restart serve detached → production ter-update
nohup npm run start > /tmp/web-hr.out 2>&1 &
sleep 5 && curl -sf --max-time 5 http://localhost:3209 >/dev/null && echo "HR up :3209"

git push origin dev                 # 4. push (standing-authorized; bukan --force)
```

Aturan: (1) `npm run check` gagal → STOP, jangan commit/build/push. (2) Build
gagal → jangan restart serve (production lama tetap hidup) & jangan push; perbaiki
dulu. (3) `git push --force` atau push ke branch selain `dev` = tetap tanya user.
(4) Catatan: `next.config.mjs` set `output: 'standalone'` → `next start` memberi
warning "use node .next/standalone/server.js"; tetap serve normal — lihat
follow-up bila ingin selaras penuh.
