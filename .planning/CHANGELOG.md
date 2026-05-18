# Web-Althea Changelog

Format: per-tanggal (WIB), grouped by slice/area. Setiap entry mencantumkan commit SHA pendek.

> Riwayat sebelum 2026-05-09 ada di `.planning/phases/00-foundation/VERIFICATION.md` (Slice 0) dan `.planning/phases/SLICES-2-5-SUMMARY.md` (Slices 1-5). Roadmap-level history di `.planning/ROADMAP.md`.

---

## 2026-05-18

### ERP: Prisma + migrasi + seed seluruh modul pasca-MVP dari db-design

- **`feat(web-erp/api-gateway)`** terjemahkan seluruh katalog `apps/web-erp/db-design/`
  pasca-MVP ke `apps/api-gateway/prisma/schema.prisma`
  - 8 domain: `fin` (core+enterprise), `inv`, `pur`, `sls`, `mfg`, `fa`, `pos`, `pln`
    + master GL-dim `md_cost_centers/divisions/subdivisions/projects`
  - Migrasi `20260518_003_erp_modules_fin_inv_pur_sls_mfg_fa_pos_pln` — **purely
    additive**: 156 tabel ERP + 53 enum baru; 0 DROP; clinic/`m0_*`/`m1_*` tidak tersentuh
  - Cross-domain ref = scalar `BigInt` FK + `@@index` tanpa `@relation`/FK DB
    (domain decoupled); FK intra-domain ditegakkan. `inv_stock_balances` = derived
    view (bukan tabel). `bi`/m8 dikecualikan (belum ada katalog field)
  - `prisma validate` clean, `prisma generate` OK, typecheck api-gateway 0 error,
    seed ERP idempoten (`seed-erp.ts`) jalan tanpa error. Tidak ada seed fixture
    db-design untuk modul transaksional (mulai kosong by design)
  - Shadow DB tidak dipakai (migrasi klinik lama `20260509_001` rusak di shadow);
    SQL digenerate via `migrate diff` datamodel→datamodel lalu `migrate deploy`

### ERP: Sidebar menu dari sys_menus via api-gateway (efdec28)

- **`feat(web-erp)`** sidebar nav sekarang dimuat dari tabel `sys_menus` via api-gateway
  - **Backend:** fix `ErpSysMenusController` guard (sama seperti auth: ganti `JwtAuthGuard` → `ErpJwtAuthGuard`)
  - **Backend:** tambah `GET /api/erp/sys-menus/my-menus` — tree menu yang bisa dilihat user: CENTRAL lihat semua; level lain filter lewat `adm_role_menus.canView=true`; MODULE/GROUP kosong dipangkas otomatis
  - **Frontend:** `lib/api/menus.ts` — `fetchMyMenus()` fetch + map `ApiMenuNode[]` → `NavItem[]`
  - **Frontend:** `Sidebar` terima prop `nav[]` (tidak import hardcoded `NAV`); `AppShell` fetch my-menus setelah login + saat refresh; fallback ke `NAV` hardcoded selama loading atau jika API error; reset ke `NAV` saat logout

### ERP: Login/Logout terintegrasi dengan api-gateway (55a9f55)

- **`feat(web-erp)`** integrasikan auth ERP end-to-end antara `apps/web-erp` dan `apps/api-gateway`
  - **Backend:** tambah `ErpJwtStrategy` (passport-jwt, baca cookie `erp_token`) + `ErpJwtAuthGuard` → fix `GET /erp/auth/me` yang sebelumnya salah guard (pakai `JwtAuthGuard` milik klinik/platform yang baca `sf_token`)
  - **Backend:** tambah field `name` (nama lengkap) di `ErpAuthResponseDto` + `ErpAuthService.login` response
  - **Frontend:** fix tipe `ErpAuthUser` (`username`/`erpLevel` bukan `login`/`level`), fix `toShellUser` mapping agar user chip topbar tampil nama + inisial benar
  - Menu sidebar (`lib/nav.ts`) static hardcoded — tampil otomatis setelah login berhasil; integrasi menu dinamis dari `sys_menus` ditunda ke fase berikutnya
  - Typecheck api-gateway + web-erp clean (0 error)

---



### WA Form Feedback H+1 (diaktifkan)

- **`feat(clinic)`** trigger otomatis "Form Feedback" H+1 post-session
  - Cron `0 8 * * *` TZ `Asia/Jakarta` baru di `booking-reminder.scheduler.ts` (`dispatchFeedbackH1`): scan booking `status=completed` dengan `completedAt` hari kemarin (00:00–23:59:59 WIB), dedup via `metadata.reminderFlag='feedback_h1'`
  - Template seed `Form Feedback` di-rewrite: hapus `{{link_form}}` → klien diminta **balas pesan WA langsung** (kesan/masukan/saran), tanpa link/formulir. Variabel `{{nama_klien}}`, `{{nama_psikolog}}`
  - Frontend `TRIGGER_META.feedback_request`: status `belum-aktif` → `cron` + copy diperbarui
  - Keputusan: penangkapan balasan inbound ke DB **di luar scope** (balasan dibaca tim manual di WhatsApp; webhook Fonnte hanya track delivery outbound). Effort terpisah bila perlu.

### Admin mobile web (sesuai prototype)

- **`feat(althea)`** mobile responsive 4 halaman admin sesuai prototype "Mobile · Admin Klinik"
  - Bottom tab bar `lg:hidden` (Jadwal · Klien · Ruangan · WA · Lainnya), role admin only; `<main>` `pb-16`
  - Mobile topbar baru: avatar+nama+role (tap→menu) · judul halaman · bell
  - Pattern dedicated `*-mobile.tsx` per feature (`lg:hidden`), desktop lama `hidden lg:*`, reuse state dari page (no refetch)
  - Jadwal: date pills + 3 stat tile + list sesi (badge "now") + FAB; Klien: search + filter chips bercount + card list + FAB; Ruangan: 2 stat tile + card status per ruangan; Notif WA: 3 stat tile + template toggle + log hari ini
  - Lint/typecheck clean (derive "now" via useEffect untuk lolos `react-hooks/purity`)

### Psikolog mobile web (sesuai prototype)

- **`feat(althea)`** mobile responsive 6 layar psikolog sesuai prototype "Mobile · Staff Psikolog"
  - Bottom tab bar `lg:hidden` 4 tab (Hari ini · Jadwal · Klien · Saya), role psikolog only; `<main>` `pb-16`
  - Pattern sama dengan admin: dedicated `*-mobile.tsx`, desktop `hidden lg:*`, reuse state via props
  - Hari ini: tanggal serif + hero "sesi berikutnya" + list + prompt availability; Jadwal: toggle Hari/Minggu + day pills bercount + 3 stat tile + list + footnote info; Klien: search + banner privasi + filter chips + card (risk dot, progress, next); Profil: avatar+specialty chips + 4 stat 30-hari + menu list + Keluar
  - `availability-dialog.tsx` full-screen di mobile + editor day-pills/checklist slot (tabel hari×slot tetap di `lg`)
  - Login: aside brand `hidden lg:flex`, form full-width + wordmark mobile
  - Typecheck clean; lint 0 error (warning set-state-in-effect = pola SSR-safe yang sudah diterima)

### Hapus kode BR-0x dari UI + detail ruangan mobile

- **`refactor(althea)`** hapus semua token business-rule code (`BR-01`, `BR-04`, dst) dari teks UI & comment di `apps/web-althea` — kalimat penjelas tetap, hanya kode dibuang (grep `BR-[0-9]` = 0). Scope: mobile + desktop, semua role.
- **`feat(althea)`** detail ruangan mobile admin: `room-detail-sheet-mobile.tsx` (bottom-sheet) — info + status sekarang + sesi hari ini + fasilitas + aksi (Edit master/Nonaktif/Hapus). `RoomsMobile` props ganti `onPick` → `onEditMaster/onDelete/onDeactivate`. Reassign-booking khusus desktop.

### Slot range per-layanan (override)

- **`feat(clinic)`** slot range override per-layanan (backend)
  - `ClinicService.slotOverrides` JSON `[{index,start,end}]` + migrasi `20260518_002` (aditif, default `[]`)
  - Identitas slot (jumlah/label/urutan/index) tetap dari `ClinicSettings.slotsOfDay` global; override hanya geser start/end
  - `resolveServiceSlots()` util (`clinic-booking/slot-resolve.util.ts`) + `assertSlotMatch(start,end,serviceId?)` service-aware (fallback global)
  - Normalisasi slotOverrides (start<end, dedupe per index, sorted) di create/update; caller booking single + package kirim `dto.serviceId`
- **`feat(althea)`** editor & resolusi slot range per-layanan (frontend)
  - `slotOverrideSchema` + `slotOverrides` di serviceSchema; `resolveServiceSlots()` mirror (`features/admin-layanan/model/slot.ts`)
  - Booking wizard resolve `slots` dari layanan terpilih (index sejajar global → `slotIndices` psikolog & `unavailableSlotIdx` tetap valid)
  - `SlotOverrideEditor` di form Layanan (label/jumlah read-only dari global, hanya geser start/end, Reset = ikut global)
  - Ringkasan read-only "Slot Khusus per Layanan" di Pengaturan → Slot Operasional
  - E2E verified: PATCH dedupe last-wins, GET persist, validasi start≥end ditolak

## 2026-05-11

### Slice 10 · Psikolog Workflow (extended)

- **`6c44618`** `feat(althea): fungsikan /psikolog/dashboard end-to-end`
  - Backend: endpoint baru `GET /api/clinic/psikolog/me/dashboard-stats` di `ClinicPsikologController` + service method `getDashboardStats(userId)`
  - Compute di Asia/Jakarta via `localPartsInTimezone` + `localDateAtMidnight`
  - Payload: `today` (5 status bucket) + `week` (7-day Sen→Min) + `klienAktif` (30d distinct) + `catatanTertunda` + `pendingNotes[]` + `packageEndingSoon[]` + `anchorDate`
  - Frontend: `psikolog-workflow/api/dashboard.api.ts` typed wrapper, hook rewrite ke single endpoint
  - UI: 4 stat card real-data, `WeekMiniChart` highlight hari ini + tooltip, `ActionQueueCard` clickable per item (chevron + href)
- **`4c254f6`** `feat(althea): foto profil psikolog (avatar upload)`
  - Field `User.avatarUrl text` (nullable)
  - Client-side canvas resize ke 256×256, JPEG q=0.85, base64 data URL
  - Backend validasi data-URL + max ~1MB
  - Render di sidebar nav + profile card
- **`14f9c49`** `fix(althea): booking validator pakai TZ klinik (bukan server TZ)`
  - Cabang bug: `start.getHours()` return jam UTC server, jadi slot lookup mismatch
  - Fix: pakai `localPartsInTimezone(scheduledStart, tz)` untuk `dow` + `hhmm`
- **`d248651`** `feat(althea): /psikolog/schedule view Bulan — color cell sesuai state`

### Slice 07 · Schedule grid (UX iterations Mei 11)

Serangkaian polish iteratif berdasarkan feedback user real-time saat sesi review.

- **`6ba1573`** `fix(althea): /psikolog/schedule cell colors lebih kontras antar state`
  - Tersedia: transparent + 1.5px dashed sage-400 → sage tint + 2px dashed sage-500
  - Libur: stripe tipis abu-abu → amber stripe + amber-300 border + amber-700 text
  - Booked: sage-100 pucat → sage-200 `#cfdfd1` + sage-400 border
  - Selesai/Batal/Past: contrast + icon prefix (●◷✓+—) untuk a11y
- **`31a76b3`** `fix(althea): libur cell pakai gray disabled, bukan corak zebra amber`
  - User feedback: corak zebra terlalu noisy untuk libur (semantik: passive bg, bukan attention)
  - Background: amber stripe → flat `#eeece6` gray + 1px border `#d8d4c8`
- **`8e73dd4`** `fix(althea): /psikolog/schedule grid Minggu tampil 7 hari penuh (Sen-Min)`
  - `DAY_LABELS` 6 → 7 entry. `gridTemplateColumns` `repeat(6, 1fr)` → `repeat(7, 1fr)`
  - Loop `i<6` → `i<7` di hook untuk days array
  - Hari Minggu kalau ada override BUKA → render Tersedia/Booked normal
- **`a52a19e`** `feat(althea): horizontal DateStrip + slot picker selalu hide unavailable`
  - Booking wizard step 4: date picker → horizontal chip strip 7 hari (color-coded libur/tutup/available)
  - Slot picker: hapus disabled slot dengan line-through, tampilkan **hanya yang available**
- **`47bd35b`** `feat(althea): /psikolog/schedule pakai emoji di cell + legend`
  - Eksperimen emoji: 🟢 Berlangsung, 📌 Booked, ✅ Selesai, ✨ Tersedia, 💤 Libur
- **`48894f5`** `fix(althea): /psikolog/schedule cell — hapus emoji + dashed border`
  - User feedback: emoji + dashed terlalu noisy. Revert emoji, dashed → solid 1px
  - Tetap pakai 5-state color contrast saja
- **`1c6dbab`** `fix(althea): kontras tinggi Booked vs Tersedia di /psikolog/schedule`
  - User feedback: Booked `#cfdfd1` pale vs Tersedia `#e8f0e8` pale → mirip
  - Booked → `#a9c8b0` SATURATED + sage-500 border + sage-900 text (terbaca solid card)
  - Tersedia → `#fafdf7` ALMOST WHITE + sage-200 border tipis (terbaca empty placeholder)
- **`3e75290`** `chore(althea): copy "Libur / di luar jadwal" → "Kosong"`
  - Lebih netral & singkat — "Libur" mengasumsikan ada alasan personal, "Kosong" lebih akurat untuk default closed/off-window

### Slice 10 · Psikolog rooms (read-only)

- **`80b08d3`** `feat(althea): /psikolog/rooms — read-only room usage view untuk psikolog`
  - New feature module `features/psikolog-rooms/` mirror admin-rooms tanpa CRUD
  - Hooks: `usePsikologRooms` (date + typeFilter + stats + cell pick) reuse `useRoomList` + `useBookingList(date)`
  - UI: toolbar tanpa tombol Add/Edit/Delete, type filter chips, read-only `RoomDetailPanel` (no Edit/Hapus button)
  - Route entry `app/psikolog/rooms/page.tsx`, sidebar nav group "Klinis"
  - Reuses `RoomStatTilesRow`, `RoomUsageGrid`, `RoomUsageLegend` dari admin-rooms (DRY)

### Slice 01 · Admin Psikolog form UX (extended)

Polish iteratif form Edit Psikolog di `/admin/psikolog` berdasar user feedback real-time.

- **`1457b08`** `refactor(althea): hapus UI Jadwal Mingguan dari form Edit Psikolog admin`
  - Section "Jadwal Mingguan" (~60 lines) dihapus dari `psikolog-form.tsx`
  - Rationale: jadwal availability dikelola self-service di `/psikolog/profile` & `/psikolog/schedule`
  - Comment block ditinggal di code untuk pointer migration path
- **`fec54ac`** `refactor(althea): hapus tombol 'Kosongkan (handle semua)' di Edit Psikolog`
  - User feedback: tombol kontras dengan default behavior (empty = handle semua) — redundant
  - Caption "Kosong = handle semua layanan" + footer hint juga dihapus
- **`ad30fc3`** `fix(althea): Simpan button di Edit Psikolog modal tidak bisa diklik`
  - Root cause: `zodResolver(createPsikologSchema)` enforce `password.min(8)`, tapi di edit mode field password disembunyikan (`{!isEdit}`) → form state `password: ''` → silent validation fail
  - Fix: `editPsikologSchema = createPsikologSchema.extend({ password: z.string().optional().or(z.literal('')) })`, resolver dipilih dinamis: `zodResolver(isEdit ? editPsikologSchema : createPsikologSchema) as Resolver<CreatePsikologInput>`
- **`efdf772`** `fix(althea): UX form Edit Psikolog — pisahkan toggle 'Aktif' dari Slot per hari`
  - User feedback: "Aktif" di sebelah "Slot per hari" bikin bingung — apakah aktif slot atau aktif psikolog?
  - Fix: section terpisah "Status Psikolog" dengan toggle switch (sage/cream) + label dinamis "Aktif — menerima booking" / "Nonaktif — tidak menerima booking" + helper text
- **`e2e0cb3`** `fix(althea): hapus 'slot harian default' dari banner Edit profil saya`
  - Profile dialog `/psikolog/profile` banner sebelumnya tulis "Email, lisensi SIPP, slot harian default, dan spesialisasi"
  - Sekarang: "Email, lisensi SIPP, dan spesialisasi" — slot dikelola di tab Availability terpisah, tidak di Edit profil

### Slice 03 · Master Data Rooms (extended)

- **`b97f84a`** `feat(althea): fasilitas ruangan terstruktur (array) + chip editor`
  - Schema: `clinic_room.facilities text[] @default([])`
  - Migration `20260511_002_clinic_room_facilities` dengan SQL backfill (parse legacy CSV description → array)
  - Backend DTO: `@IsArray() @ArrayMaxSize(30) @IsString({each:true}) @MaxLength(60, {each:true})`
  - Frontend: `FacilitiesEditor` chip selector (suggestions per type, custom input, dedupe case-insensitive, max 30)
  - `RoomDetailPanel` fallback chain: array → CSV legacy → `DEFAULT_FACILITIES` per type
  - `description` jadi field "Catatan internal" terpisah (notes only)
  - `startEdit` pre-fill cerdas: auto-migrate room lama ke chips saat dibuka untuk edit

---

## 2026-05-10

### Slice 08 · WA Templates + Dispatcher (hardened)

- **`feb3855`** `feat(wa): harden Fonnte integration — phone normalize, queue, webhook fallback`
  - Util `apps/api-gateway/src/common/utils/phone.util.ts`:
    - `normalizePhoneId('08xxx' | '+62xxx' | '62xxx' | '8xxx') → '62xxx'`
    - `formatPhoneDisplay(id) → '+62 856-0755-0989'`
  - BullMQ retry queue (max 3 attempts, backoff)
  - Webhook fallback: kalau payload tidak ada `status`, default ke `terkirim`
  - Indonesian date/time format di template render (`toLocaleString id-ID` + `timeZone: Asia/Jakarta`)
- **`e1ab066`** `fix(api): Fonnte messageId number → string normalization`
  - `String(rawId)` cast karena Fonnte kadang return number
- **`d2364e1`** `chore(api): replace @Request() req: any → AuthRequest typed (10 clinic controllers)`

### Slice 10 · Psikolog Profile

- **`2cf0941`** `feat(psikolog-profile): functional edit dialog + live statistik counting`
  - Endpoint: `GET /me`, `GET /me/stats`, `PATCH /me`
  - Service: `findByUserId`, `updateMe`, `getMyStats` (30d completed, 90d distinct clients, kehadiran %)
  - Frontend dialog: fullName, title, bio, color picker
- **`b08b28f`** `feat(psikolog): /psikolog/profile page — own profile + availability editor`
- **`b56827a`** `feat(althea): calendar UX untuk override availability — input cepat tanpa form`
- **`e3c136b`** `feat(althea): psikolog self-service set jadwal availability per slot/day`
- **`173f2a4`** `feat(althea): psikolog set jadwal per-tanggal (override) + booking wizard merge`

### Slice 06 · Booking Wizard

- **`d28415b`** `feat(althea): psikolog weekly availability — block booking kalau jadwal belum di-set`
- **`3f0570b`** `feat(althea): booking wizard pilih psikolog dulu, slot di-filter availability`
- **`e869852`** `feat(althea): wizard slot picker hanya tampilkan slot available`
- **`8b981c8`** `fix(althea): wizard DateStrip — tanggal libur/tutup tidak bisa dipilih`

### Slice 07 · Admin Schedule

- **`aeae6b5`** `feat(althea): advanced filter di /admin/schedule — client search, time-of-day, sesi, layanan`
- **`33e63bd`** `feat(althea): functional filter + view toggle (Hari/Minggu/Bulan) + date picker`
- **`f31a8ce`** `feat(althea): /psikolog/schedule full filter + view toggle (Hari/Minggu/Bulan)`
- **`5021528`** `fix(althea): SSR hydration mismatch — defer todayKey() ke useEffect`
- **`645968b`** `feat(althea): master slot system — replace operatingHours dengan slotsOfDay`

---

## 2026-05-09

### Auth flow fixes

- **`8682443`** `fix(althea): set sf_token cookie client-side — NPM bypass Route Handler`
  - Root cause: NPM (Nginx Proxy Manager) proxy bypass `/api/auth/login` Route Handler, jadi HttpOnly cookie tidak ter-set
  - Fix: client-side `document.cookie = 'sf_token=...; path=/; max-age=...'` setelah login response
- **`a4777d2`** `fix(althea): login redirect — hard navigation via window.location.assign`
  - `router.push()` kadang preserve old session state → fix dengan hard nav

### UX & validation

- **`9569fd5`** `feat(althea): logout confirmation modal sebelum sign out`
- **`d895144`** `feat(althea): wajibkan password saat tambah psikolog`
- **`be3c91a`** `fix(althea): empty optional fields → undefined sebelum POST /clinic/client`
  - Bug: class-validator `@IsOptional()` tidak skip empty string → "must be email" error
- **`2051d9a`** `fix(althea): copy WA opt-out di form Tambah Klien lebih jelas untuk admin`
- **`3219391`** `chore(althea): rename middleware.ts → proxy.ts (Next.js 16 convention)`

---

## Earlier (pre-2026-05-09)

Lihat ROADMAP.md History section untuk fase Slice 0-14 initial delivery (semua 14 slice closed pada 2026-05-08).
