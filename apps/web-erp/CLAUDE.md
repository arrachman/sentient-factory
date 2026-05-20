# Web-ERP — Aturan Baku untuk AI Agent (Claude)

Scope: **hanya** `apps/web-erp/**`. Berlaku di atas root `CLAUDE.md` repo
(tidak menggantikannya). Singkat, deklaratif, non-negosiabel.

Produk: **Senti ERP**. Legacy `apps/web-erp/preferensi/` = **referensi
fitur/business-logic/flow saja**, bukan sumber struktur kode/DB.

---

## 1. Penamaan tabel (WAJIB)

Format baku **setiap** tabel fisik:

```
DOMAIN_NAMA-TABEL
```

- **DOMAIN** — segmen semantik **per-fungsi** (bukan numerik legacy
  `m0`/`m1`). **Tanpa** prefix produk `erp_`.
- **NAMA-TABEL** — nama entitas, `snake_case`, **plural**.

Pemisah antar segmen = underscore `_`. Semua lowercase.

Domain yang berlaku:

| Domain | Cakupan | Contoh tabel |
| --- | --- | --- |
| `sys` | Konfigurasi sistem/global — ubah → perilaku sistem berubah untuk semua | `sys_settings`, `sys_fiscal_periods`, `sys_document_numberings`, `sys_menus`, `sys_audit_logs` |
| `adm` | Identity & access — ubah → siapa bisa login/lihat/lakukan berubah | `adm_users`, `adm_roles`, `adm_permissions`, `adm_user_roles`, `adm_role_permissions`, `adm_role_menus`, `adm_user_branch_access` |
| `md` | Master Data | `md_items`, `md_partners`, `md_partner_addresses`, `md_accounts`, `md_cost_centers` |
| `fin` | Finance / GL (m2) | `fin_journal_entries`, `fin_journal_lines`, `fin_ledger_entries`, `fin_ar_receipts`, `fin_ap_payments`, `fin_giros` |
| `inv` | Inventory / stock movement (m3) | `inv_stock_movements`, `inv_stock_movement_lines`, `inv_opening_stocks`, `inv_stock_counts` |
| `pur` | Purchasing (m4) | `pur_orders`, `pur_goods_receipts`, `pur_invoices`, `pur_returns`, `pur_payments` |
| `sls` | Sales / AR (m5) | `sls_orders`, `sls_deliveries`, `sls_invoices`, `sls_returns`, `sls_receipts` |
| `mfg` | Manufacturing / production (m6) | `mfg_boms`, `mfg_work_orders`, `mfg_production_results` |
| `fa` | Fixed assets (m7) | `fa_assets`, `fa_asset_categories`, `fa_depreciations`, `fa_disposals` |
| `bi` | BI / dashboards (m8) | `bi_charts`, `bi_indicators`, `bi_chart_roles` |
| `pos` | POS / retail & promotions (m12) | `pos_areas`, `pos_contact_prices`, `pos_category_discounts` |
| `pln` | Planning / MRP-lite (new — no legacy equivalent) | `pln_reorder_policies`, `pln_demand_forecasts`, `pln_mrp_runs`, `pln_replenishment_suggestions` |

> Domain map legacy→modern + entitas inti per modul = `db-design/module-roadmap.md`
> (otoritatif). Legacy **m11 = vertical klinik** → milik `apps/web-althea`, **bukan**
> ERP (jangan diserap). m9 tidak ada; m10 perlu studi sebelum dipetakan.

Contoh benar:

| Entitas | Domain | Nama tabel |
| --- | --- | --- |
| User | adm | `adm_users` |
| Role | adm | `adm_roles` |
| Document Numbering | sys | `sys_document_numberings` |
| Item | md | `md_items` |
| Partner Address | md | `md_partner_addresses` |
| Account (CoA) | md | `md_accounts` |

Aturan turunan:

- **Batas `sys` vs `adm`:** definisi menu = `sys` (`sys_menus`); pemetaan
  role→menu = `adm` (`adm_role_menus`). FK lintas-domain diperbolehkan.
- "Administrator" legacy (m0) **dipecah** jadi `sys` (config sistem:
  setting, fiscal period, numbering, menu, audit log) + `adm` (identity &
  access: user, role, permission, pivot akses). Master Data (m1) → `md`.
  Modul fungsi baru → tambah domain semantik baru, **bukan** `m<n>`.
- Di Prisma: model `PascalCase` tetap ber-prefix `Erp` (hindari bentrok
  model `User`/`Menu` platform di schema yang sama) + `@@map("<domain>_...")`.
  Contoh: `model ErpItem { ... @@map("md_items") }`.
- Tabel pivot/junction: gabung kedua entitas —
  `adm_user_roles`, `adm_role_permissions`.
- Satu tabel = satu domain semantik tempat ia didefinisikan.
- **Tidak boleh** bentrok dengan tabel platform di Postgres bersama
  (`m0_*`, `m1_*`, `clinic_*` milik Althea/api-gateway). Namespace domain
  `sys_`/`adm_`/`md_` tidak beririsan dengan prefix platform — ERP tidak
  menumpang/reuse tabel platform.

> Dokumen desain DB otoritatif = `apps/web-erp/db-design/` (`README.md` hub +
> `entities-m0-administrator.md` + `entities-m1-master-data.md` +
> `entities-m2-finance.md` + `entities-m2-finance-enterprise.md` +
> `entities-m3-inventory.md` + `entities-m4-purchasing.md`
> + `entities-m5-sales.md` + `entities-m6-manufacturing.md` + `entities-m7-fixed-assets.md`
> + `entities-m12-pos.md` + `entities-pln-planning.md` + `legacy-mapping.md` + `module-roadmap.md`). MVP pakai
> `sys_`/`adm_`/`md_`; modul pasca-MVP (m2–m12) dipetakan di `module-roadmap.md`
> (decision §8 #14–17). **m2 `fin` + m3 `inv` + m4 `pur` + m5 `sls` + m6 `mfg`
> + m7 `fa` + m12 `pos` + `pln` (baru) sudah katalog field-level** (periode reuse
> `sys_fiscal_periods`; dimensi pakai master `md_*`; pembayaran AP/AR reuse
> `fin_ap_payments`/`fin_ar_receipts`; sale POS reuse `sls_invoices`).
> Sisa terakhir: m8 `bi`. Top-level
> `DB-DESIGN.md` lama sudah **dihapus** (redundan). **Semua open decision sudah
> RESOLVED dengan user (2026-05-17)** — log keputusan otoritatif di
> `db-design/README.md §8` (13 keputusan). Yang berubah dari draft: PK = **BigInt**,
> **audit-log (`sys_audit_logs`) masuk MVP**, **`CurrencyRate` bertanggal**,
> **`legacyCode` di tiap master**; `ErpUser` tetap terpisah dari User klinik.
> **MVP = 31 tabel** (14 `sys_*`/`adm_*` + 17 `md_*`). **PRISMA SUDAH DITULIS &
> DIMIGRASI (2026-05-18):** atas go-ahead user, seluruh katalog pasca-MVP
> diterjemahkan ke `apps/api-gateway/prisma/schema.prisma` + migrasi
> `20260518_003_erp_modules_fin_inv_pur_sls_mfg_fa_pos_pln` (additive: 156 tabel
> ERP `fin`/`inv`/`pur`/`sls`/`mfg`/`fa`/`pos`/`pln` + master GL-dim `md_*`, 53
> enum baru; 0 DROP, clinic/`m0_*`/`m1_*` aman). **Catatan desain:** referensi
> lintas-domain = scalar `BigInt` FK + `@@index` **tanpa** `@relation`/FK DB
> (domain decoupled); FK intra-domain ditegakkan. `inv_stock_balances` = derived
> view. `bi`/m8 **dikecualikan** — belum ada katalog field.

---

## 2. Design system dulu, baru slicing frontend (WAJIB)

**DILARANG** mulai slicing/implementasi halaman atau fitur frontend sebelum
design system + komponen dasarnya siap.

Urutan wajib sebelum halaman pertama dibangun:

1. **Design tokens** — warna, tipografi, spacing, radius, shadow, breakpoint
   (sumber tunggal; bukan nilai hardcode tersebar).
2. **Komponen primitif** — Button, Input, Select, Checkbox/Radio, Modal,
   Table, Form field, Card, Badge, Toast/Alert, Tabs, Sidebar/Nav, Pagination.
3. **Pola layout** — shell aplikasi (sidebar + topbar), layout list/detail,
   layout form, state kosong/loading/error.
4. Baru setelah itu: slicing halaman modul (m0, m1, …) **memakai** komponen
   tersebut — tidak menulis ulang elemen UI ad-hoc per halaman.

### 2.1 Atomic Design (WAJIB saat membuat komponen frontend)

Setiap komponen frontend **wajib** dibangun mengikuti **atomic design**
(Brad Frost) — bukan komponen ad-hoc per halaman. Hierarki & pemetaan ke
urutan wajib di atas:

| Tingkat | Definisi | Contoh di ERP | Selaras langkah |
| --- | --- | --- | --- |
| **Atoms** | Elemen UI terkecil tak-terpecah | Button, Input, Label, Icon, Badge | §2 langkah 2 |
| **Molecules** | Gabungan beberapa atom = satu fungsi | Form field (label+input+error), search box, pagination | §2 langkah 2 |
| **Organisms** | Bagian UI kompleks gabungan molecule/atom | Tabel data + toolbar, sidebar nav, form section | §2 langkah 2–3 |
| **Templates** | Kerangka layout tanpa data nyata | Layout list/detail, layout form, app shell | §2 langkah 3 |
| **Pages** | Template + data nyata modul | Halaman m0/m1 (Item, Partner, User, …) | §2 langkah 4 |

Aturan:

- Komponen baru → tentukan tingkatnya dulu; taruh di folder per tingkat
  (`atoms/`, `molecules/`, `organisms/`, `templates/`, `pages/` atau setara
  struktur prototype).
- **Dilarang** membangun tingkat lebih tinggi sebelum tingkat di bawahnya
  ada sebagai komponen reusable (page tidak menulis ulang atom/molecule
  ad-hoc).
- Atom/molecule **tanpa** business logic & **tanpa** style hardcode — hanya
  token + props. Logic naik ke organism/page.
- Konsisten dengan batas 400 baris (§3): komponen besar dipecah per tingkat,
  bukan jadi satu file gendut.

Konsekuensi:

- Kalau saat slicing butuh elemen UI yang belum ada di design system →
  **stop**, tambahkan dulu sebagai komponen reusable di tingkat atomic yang
  tepat, baru lanjut.
- Tidak ada style/warna/spacing hardcode di halaman; selalu lewat token.
- Konfirmasi ke user kalau scope design system belum jelas — jangan asal
  mulai halaman.

### 2.2 Penamaan file frontend (WAJIB)

- **Dilarang** prefix `erp-` pada nama file di `apps/web-erp/**` (mis.
  `components/pages/erp-items-page.tsx`). Path sudah berada di bawah
  `web-erp`, jadi prefix produk pada filename = redundant noise.
- `kebab-case` + akhiran semantik per tingkat atomic: `-page.tsx`,
  `-form.tsx`, `-list.tsx`, dst. Contoh benar:
  `components/pages/items-page.tsx`, `components/pages/items-form.tsx`.
- Pengecualian: model Prisma tetap ber-prefix `Erp` (lihat §1) — itu untuk
  hindari bentrok kelas/identifier lintas-app dalam satu schema, **bukan**
  konvensi filename frontend.

---

### 2.3 Canonical route id = seeded `sys_menus.path` (2026-05-19)

Sidebar di-render dinamis dari `GET /api/erp/sys-menus/my-menus` (role-
filtered). Route id kanonik **= `sys_menus.path`** (mis. `/master/locations`,
`/admin/fiscal-periods`). `renderRoute` memetakan path→komponen via registry
`ERP_PAGES` (`shell-route-renderer.tsx`); short-id legacy (`adm-users`,
`md-items`) hanya **alias** untuk fallback `NAV` statis saat API down. Halaman
ERP baru: tambahkan entry di `ERP_PAGES` (key = path seeded di
`prisma/seed-erp.ts`) + `ERP_ROUTE_META` (`lib/nav.ts`) untuk breadcrumb.
Jangan bikin skema id baru — `sys_menus` adalah SSOT navigasi.

### 2.5 ERP controllers WAJIB pakai `ErpJwtAuthGuard` (2026-05-20)

Semua controller di `apps/api-gateway/src/erp-*/**` **harus** guard dengan
`ErpJwtAuthGuard` dari `../erp-auth/guards/erp-jwt-auth.guard`, **bukan**
`JwtAuthGuard` clinic dari `../auth/guards/jwt-auth.guard`. Cookie
`erp_token` ditandatangani oleh ErpAuthService dan hanya dikenali strategy
`erp-jwt`. Salah guard → semua endpoint ERP 401 padahal `/erp/auth/me` &
`/erp/sys-menus/my-menus` jalan. Sudah dibetulkan untuk 18 controller
(branches, warehouses, locations, items, units, item-categories, users,
roles, permissions, settings, currencies, taxes, payment-terms,
partner-categories, partners, fiscal-periods, document-numberings,
accounts).

### 2.4 Command palette = derived dari role-filtered nav (2026-05-20)

`CommandPalette` (`components/organisms/command-palette.tsx`) **tidak boleh**
punya hardcoded menu list. Items diturunkan dari prop `nav: NavItem[]` yang
sama dengan sidebar (state `nav` di `app-shell.tsx`, di-load via
`fetchMyMenus()`). Konsekuensi: search palette = persis semua menu aktif
yang user berhak akses (sesuai `adm_role_menus`). Group palette mengikuti
struktur nav (MODULE → ITEM, atau MODULE → GROUP → ITEM jadi "Module ·
Group"). Hanya group "Aksi" (toggle theme/lang) yang statis. Saat menambah
modul baru: cukup seed di `sys_menus` + `adm_role_menus`, palette ikut.

### 2.6 Pilihan biner = radio button, bukan Select (2026-05-20)

Saat field form hanya punya **2 opsi** (mis. Aktif/Nonaktif, Ya/Tidak, Pria/
Wanita, Debit/Kredit) → **WAJIB** pakai radio button (atau segmented control),
**bukan** `Select`/dropdown. Alasan: dropdown untuk 2 opsi = 2 klik untuk
melihat & 2 klik untuk pilih, padahal radio = 1 klik dan kedua opsi terlihat
langsung tanpa harus dibuka. Juga lebih aksesibel (tab langsung, tanpa popover).

Berlaku untuk semua form ERP (filter list, dialog create/edit, settings).
`Select` tetap dipakai untuk ≥ 3 opsi atau saat opsi-nya dinamis dari API.
Saat vibe coding sebuah halaman: **baca dulu role/konteks field**, hitung
jumlah opsi, pilih kontrol yang sesuai sebelum nulis JSX.

Primitive tersedia di [`components/ui/radio-group.tsx`](components/ui/radio-group.tsx):

- `BooleanRadio` — helper untuk boolean field (Aktif/Nonaktif default,
  bisa override `trueLabel`/`falseLabel` untuk Ya/Tidak dll).
- `RadioGroup<T>` — generik untuk non-boolean (≥ 2 opsi terbatas yang
  bisa di-segmented). Pilih ini bila value bukan boolean.

Refactor awal (2026-05-20): 15 binary `Select` di 12 form (items, partners,
users, branches, warehouses, locations, taxes, units, currencies, payment-
terms, partner-categories, accounts, document-numberings) sudah diganti
`BooleanRadio` — jangan re-introduce pattern lama.

### 2.7 Standar baku setiap halaman list ERP (WAJIB, 2026-05-20)

**Setiap** halaman list master/transaksi di `apps/web-erp/**` **wajib**
menyediakan fitur-fitur berikut. Tidak ada list page yang boleh ship tanpa
ini — kalau salah satu hilang, halaman itu **belum** selesai. Implementasi
**harus** lewat organism reusable (`erp-list-layout.tsx` + turunannya),
bukan ditulis ulang ad-hoc per halaman.

**A. Header / Topbar (app shell, sudah disediakan `app-shell.tsx`)**
- Breadcrumb hierarkis: `Sentient / ERP → <Modul> → <Entitas>` — sumber
  label dari `ERP_ROUTE_META` (§2.3).
- Multi-tab workspace dengan tombol `+` buka tab baru + indikator jumlah tab.
- Global search "Cari semua…" shortcut **K** → buka `CommandPalette` (§2.4).
- Notifikasi, activity monitor, shortcut helper, user menu.

**B. Action bar (per halaman list)**
- Search lokal "Cari …" shortcut **`/`** (fokus ke input search list).
- Tombol **Export** data (CSV/XLSX, sesuai izin role).
- Tombol **Refresh** (re-fetch list).
- Tombol **`+ Tambah <entitas>`** shortcut **N**.

**C. Filter & summary bar**
- Filter **Status** approval (default "Semua") — chip/select.
- Tombol ikon filter lanjutan (kolom dinamis bila ada).
- **Summary agregat** kontekstual (mis. Σ piutang, Σ qty stok, jumlah baris
  difilter vs total) — diletakkan di kanan/atas tabel.
- Tombol **Reset filter** (visible begitu ada filter aktif).

**D. Tabel data**
- Checkbox select per-row + select-all di header.
- Kolom kanonik per entitas (kode, nama, atribut kunci, nilai numerik, status).
- **Kode** = link clickable → buka detail/edit, format kanonik per entitas
  (mis. `CUS-YYMM-NNNN`).
- Kolom numerik (uang/qty) **right-aligned** + format ribuan Indonesia.
- Badge status workflow **berwarna konsisten** mengikuti token design system:
  `Draft`, `Need Approve`, `Approved`, `Rejected`, `Posted` (warna dipetakan
  sekali di token, jangan hardcode per halaman).

**E. Footer / pagination**
- Indikator: `Halaman X dari Y · M dari N baris`.
- Pagination kontrol prev/next.

**F. Keyboard-first navigation (WAJIB, listener di organism list)**
- `J` / `K` → navigasi baris bawah/atas.
- `X` → toggle pilih baris aktif.
- `N` → tambah baru (sama dengan tombol di action bar).
- `←` / `→` → halaman prev / next.
- `/` → fokus search lokal · `K` → global palette · `?` → shortcut helper.

**G. Sidebar kiri (app shell)**
- Modul ikonik dinamis dari `GET /api/erp/sys-menus/my-menus` (§2.3).
- Toggle tema (matahari/bulan) di paling bawah; toggle bahasa ID/EN.

**Workflow approval**: setiap master/transaksi yang punya status workflow
**wajib** mengikuti state machine `Draft → Need Approve → Approved/Rejected
→ Posted`. State machine + transition rules hidup di backend; frontend list
hanya menampilkan badge + filter, tidak memutuskan transisi.

**Konsekuensi vibe coding:**
- Bikin list page baru → mulai dari organism `erp-list-layout.tsx` + turunan
  `generic-list*` / `data-list*`. **Dilarang** start dari blank `<table>`.
- Butuh fitur list yang belum di organism (mis. grouping, pinned columns)
  → **stop**, tambahkan ke organism reusable dulu (§2.1 atomic design),
  baru pakai di halaman.
- Checklist di atas adalah **definition of done** untuk list page;
  declare selesai = semua poin A–G terpenuhi atau eskalasi alasan
  pengecualian ke user.

---

## 3. Clean code & batas 400 baris (WAJIB)

Saat vibe coding di `apps/web-erp/**`, kode **harus clean code** — dan
**tidak boleh > 400 baris per file**. Ini menguatkan root `CLAUDE.md §5`,
khusus web-erp tanpa pengecualian.

- **Maks 400 baris/file source.** Sebelum sebuah file tembus batas → stop,
  pecah jadi modul lebih kecil dengan tanggung jawab tunggal.
- **Clean code:** named exports, satu tanggung jawab per modul/komponen/fungsi,
  nama deskriptif, tanpa duplikasi, tanpa dead code, tanpa magic value
  (lewat token/konstanta). Komponen UI besar dipecah per bagian.
- Berlaku untuk source aplikasi/bisnis (`.tsx/.jsx/.ts/.js`). **Bukan**
  target: Prisma (schema/migrations/generated), log, dan data
  seed/feed/mock/fixture — sejalan skill `ref-audit`.
- Setelah split/refactor → `npm run typecheck` (atau verifikasi prototype
  tetap jalan) sebelum declare selesai.
- **Enforcement otomatis** (sejak 2026-05-19):
  - ESLint `max-lines` (error, 400) di-scope ke `app/**`, `components/**`,
    `lib/**`, `shared/**` (exclude test/spec/seed/mock/fixture). Jalan via
    `npm run lint` & `npm run check`.
  - Script `npm run check:size` (`scripts/check-file-size.mjs`) sebagai gate
    independen — `npm run check` chain: lint → typecheck → check:size → test.
- Refactor besar → spawn sub-agent per file (root `CLAUDE.md §11`) agar
  context utama tidak meledak.

---

## 4. Setelah vibe coding: commit + merge ke `dev` (WAJIB)

Setiap selesai satu unit kerja vibe coding di `apps/web-erp/**`, **wajib**
commit lalu merge ke branch `dev` — jangan tinggalkan kerja menggantung di
working tree atau feature branch.

- **Commit** conventional & atomik (`feat:`/`fix:`/`refactor:`/`docs:`/
  `chore:`), pesan jelas, scope `web-erp` bila relevan. Jangan tumpuk
  ratusan baris dalam satu commit (root `CLAUDE.md §7`).
- **Merge ke `dev`:** kalau kerja di feature branch/worktree → merge atau
  fast-forward/rebase ke `dev`. Kalau memang sedang di `dev` → cukup commit
  (sudah "di dev"); jangan biarkan perubahan uncommitted.
- **DILARANG** `--no-verify`, amend commit yang sudah dipush, atau
  `git push --force` (root `CLAUDE.md §5`). Sinkronisasi pakai rebase/
  fast-forward.
- Dokumen `.md` web-erp harus sudah sinkron **sebelum** commit penutup
  (lihat aturan sinkronisasi dokumen di skill `erp`).
- Belum commit + (jika perlu) merge ke `dev` → task **belum** boleh
  dideklarasikan selesai.

---

## 5. Saat ragu

Tanya user. Aturan-aturan di atas tidak punya pengecualian diam-diam —
kalau ada kebutuhan menyimpang, eskalasi dulu.
