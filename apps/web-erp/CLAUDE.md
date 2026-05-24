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
- `J` / `K` atau `↓` / `↑` → navigasi baris bawah/atas.
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

### 2.8 `cursor: pointer` wajib pada semua elemen interaktif (WAJIB)

Setiap elemen yang bisa diklik atau difokus **harus** menampilkan `cursor:
pointer`. Tidak ada pengecualian — elemen tanpa cursor pointer membingungkan
user karena tidak terbaca sebagai interaktif.

Elemen yang wajib:

| Elemen | Cara set |
| --- | --- |
| `<button>` (semua varian: primary, secondary, ghost, icon, dll) | Token/class global di design system |
| `<a>` / `<Link>` (Next.js) | Token/class global |
| `<input type="checkbox">` | Token/class global |
| `<input type="radio">` | Token/class global |
| Wrapper custom checkbox/radio (div/span klik) | `cursor-pointer` via Tailwind atau token |
| Label yang `htmlFor` ke input interaktif | `cursor-pointer` |
| Clickable table row / cell | `cursor-pointer` pada `<tr>` / `<td>` |
| Chip, badge, tag yang bisa diklik | `cursor-pointer` |

Cara implementasi:

- **Global CSS** (paling direkomendasikan): tambahkan satu rule di
  `styles/erp-components.css` (atau `globals.css`) agar semua elemen standar
  sudah di-cover tanpa perlu `className` per komponen:

  ```css
  button,
  a,
  [role="button"],
  input[type="checkbox"],
  input[type="radio"],
  label[for] {
    cursor: pointer;
  }
  ```

- **Wrapper custom**: tetap tambahkan `cursor-pointer` (Tailwind) atau
  `style={{ cursor: 'pointer' }}` bila elemen bukan tag HTML standar di atas.
- **Disabled state**: elemen `disabled` → `cursor: not-allowed` (override;
  jangan biarkan pointer di elemen tidak aktif).

Saat membuat komponen Atom baru (Button, Checkbox, RadioGroup, dll): **cek
dulu** apakah global CSS sudah di-cover — jika belum, tambahkan ke komponen
level atom (bukan ad-hoc di page). Jangan deklarasikan komponen selesai
sebelum cursor state-nya benar.

### 2.9 Spesifikasi detail behaviour halaman list (WAJIB, 2026-05-20)

Detail implementasi yang melengkapi checklist §2.7. Semua poin ini **wajib
konsisten** di setiap halaman list — bukan opsional.

#### Row visual states (3 state, tidak boleh campur)

| State | Trigger | Visual |
| --- | --- | --- |
| **Normal** | Default | Latar default |
| **Hovered** | Cursor di atas row | Latar `--bg-hover` (subtle) |
| **Focused** (keyboard) | J/K navigation aktif | Border kiri 2px `--accent`, latar `--bg-focus` |
| **Selected** (checkbox) | Checkbox ✓ atau X keyboard | Latar `--bg-selected`, checkbox terisi |
| **Focused + Selected** | Keduanya aktif bersamaan | Gabung: border kiri + latar selected |

Row focused ≠ row selected. Navigasi J/K **tidak otomatis** men-select baris
— hanya memindahkan fokus visual. X / Space yang men-toggle selection. Ini
penting agar user bisa navigate tanpa sengaja memilih banyak baris.

#### Column alignment & format angka (standard)

| Tipe data | Alignment | Format |
| --- | --- | --- |
| Teks (kode, nama, kota, NPWP) | Kiri | — |
| Numerik (uang, qty, %) | **Kanan** + `tabular-nums` | `46.666.000,00` |
| Badge / status | Kiri (dalam cell) | `● Approved` |
| Tombol aksi inline | Kanan | `Edit Hapus` |
| Checkbox | Tengah | ☐ |

Format angka Rupiah: `Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 })`
— ribuan titik, desimal koma, 2 digit desimal. **Tidak ada simbol Rp di kolom
tabel** (hanya di label header atau tooltip bila perlu). Implementasi sekali di
helper `lib/format.ts`, dipakai oleh semua halaman — tidak boleh inline per
halaman.

#### Tinggi baris/tabel = density token (WAJIB, 2026-05-20)

Tabel list **wajib** mengikuti knob `density` di Setting → Tampilan
(`compact` / `comfortable`). Implementasi sudah ada di
[`components/organisms/table.tsx`](components/organisms/table.tsx):

- `TableHead` pakai `h-[var(--header-h)]` → 28px compact / 34px comfortable.
- `TableCell` pakai `h-[var(--row-h)]` → 28px compact / 36px comfortable.
- Token didefinisikan di [`styles/erp-tokens.css`](styles/erp-tokens.css)
  pada selector `[data-density='compact']` / `[data-density='comfortable']`
  (data-attribute di-set di `<html>`).

App-shell (`components/templates/app-shell.tsx`) hydrate `data-density`
(juga `data-fontscale`/`data-sidebar`/`data-primary`) saat mount: pertama
dari localStorage `erp-appearance`, lalu di-override server SSOT lewat
`getMyPreferences()` (metadata Json). **DILARANG** hardcode `data-density`
ke literal di mount effect — dulu force-set `compact` membuat preferensi
user tidak persist saat reload. Pengubahan density di AppearancePage
otomatis apply ke semua tabel tanpa remount karena listener CSS variable.

Saat membuat halaman list baru: cukup pakai organism `Table*` dari
`components/organisms/table.tsx` — density mengikuti otomatis.

#### Approval status — token color mapping (WAJIB, jangan hardcode)

| Status value | Badge variant | Label tampil |
| --- | --- | --- |
| `DRAFT` | `default` (abu-abu) | Draft |
| `NEED_APPROVE` | `warning` (oranye) | Need Approve |
| `APPROVED` | `success` (hijau) | Approved |
| `REJECTED` | `danger` (merah) | Rejected |
| `POSTED` | `info` (biru) | Posted |

Mapping dipetakan **sekali** di `lib/status.ts` (fungsi `statusBadgeVariant` /
`statusLabel`). Setiap halaman import fungsi ini — **tidak boleh** ada
switch/if per halaman yang mendefinisikan warna sendiri.

#### H. Bulk action toolbar (WAJIB bila entitas punya operasi batch)

Tampil di atas tabel **hanya saat ≥ 1 baris dipilih**; hilang bila selection
kembali ke 0. Animasi slide-in (jangan langsung muncul tanpa transisi).

- Teks: `X baris dipilih` (X = jumlah selection)
- Tombol aksi batch sesuai entitas (contoh: Aktifkan, Nonaktifkan, Hapus)
- Tombol **Batal pilihan** di kanan — clear semua selection
- Aksi destruktif batch → **wajib** confirmation dialog sebelum eksekusi
- Setelah batch selesai → reload list + clear selection + toast notifikasi

Implementasi lewat slot `toolbar` di `ErpListLayout` atau organism
`bulk-action-bar.tsx`. **Dilarang** inline ad-hoc per halaman.

#### Post-action feedback (toast/notifikasi)

Setiap operasi CRUD dan batch **wajib** memberikan feedback via `notify()`:

| Operasi | Variant | Contoh pesan |
| --- | --- | --- |
| Create sukses | `success` | `"Customer dibuat"` |
| Update sukses | `success` | `"Customer diperbarui"` |
| Delete sukses | `success` | `"Customer dihapus"` |
| Batch sukses | `success` | `"3 customer diaktifkan"` |
| Error API | `danger` | Pesan dari `error.message` |
| Fitur belum tersedia | `warn` | `"Export belum tersedia"` |

Tidak ada operasi **silent** (tanpa feedback) — user harus selalu tahu apakah
aksi berhasil atau gagal. Toast error harus meneruskan pesan asli dari API,
bukan pesan generik "Terjadi kesalahan".

#### Confirmation dialog untuk aksi destruktif

Setiap aksi yang **tidak bisa di-undo** (hapus, batch-hapus, reject) **wajib**
menampilkan dialog konfirmasi via `confirmAction()` sebelum eksekusi:

- **Title**: `Hapus <Entitas>?`
- **Pesan single**: `<kode> — <nama> akan dihapus permanen.`
- **Pesan batch**: `X <entitas> akan dihapus permanen.`
- **Tombol confirm**: variant `danger`, label eksplisit (`Hapus`, bukan `OK`)
- **Tombol batal**: ghost/secondary

#### Empty / loading / error state

| State | Tampilan |
| --- | --- |
| **Loading** | Teks `Memuat...` di tengah area tabel |
| **Error** | Teks merah `Gagal memuat data: <pesan>` di atas tabel |
| **Empty (no data)** | `TableEmpty` colspan penuh: `Tidak ada data` |
| **Empty (filtered)** | `TableEmpty`: `Tidak ada hasil untuk filter ini` |

`TableEmpty` (`components/organisms/table.tsx`) adalah komponen standar untuk
semua empty state tabel — **jangan** biarkan `<tbody>` kosong tanpa keterangan.
Empty saat filter aktif harus dibedakan dari empty tanpa filter (pesan beda).

**Error state = molecule `ErrorState` (2026-05-20).** Pesan error mentah dari
backend (mis. HTTP `Not Found`, `Failed to fetch`, `Unauthorized`) **dilarang**
ditampilkan apa adanya. `ErpListLayout` me-render
[`components/molecules/error-state.tsx`](components/molecules/error-state.tsx)
yang mengkategorikan pesan jadi: tidak terhubung / data tidak ditemukan /
akses ditolak / server bermasalah / fallback — masing-masing dengan ikon,
judul, deskripsi user-friendly, dan tombol **Coba lagi** (memanggil
`onRefresh`). Saat membuat halaman list baru: cukup oper `error` dari
`useErpList` ke `ErpListLayout` — jangan rakit teks error ad-hoc.

### 2.10 Status boolean = kolom badge `Aktif/Nonaktif` (2026-05-20)

Untuk entitas dengan status biner (`isActive`) di list page: tetap kolom
sendiri `STATUS` berisi `<Badge variant="success|default" dot>` —
`Aktif` (hijau) / `Nonaktif` (abu). Eksperimen "dot di depan Nama + mute
baris nonaktif" dicoba lalu **di-rollback** atas keputusan user
(2026-05-20): kolom badge lebih konsisten dengan workflow status multi-state
dan lebih mudah dipindai saat semua baris perlu kelihatan "setara".

Workflow multi-state (`Draft/Need Approve/Approved/Rejected/Posted`) tetap
pakai `StatusBadge` (§2.9).

### 2.14 Tab navigator = drag-and-drop reorder via @dnd-kit (2026-05-20)

Tab strip di app shell (`components/organisms/tab-bar.tsx`) **wajib**
mendukung reorder manual via drag-and-drop. Library = `@dnd-kit/core` +
`@dnd-kit/sortable` (sudah di `package.json`); **dilarang** native HTML5 DnD
atau `react-beautiful-dnd`.

- Setiap `tab-chip` di-wrap `useSortable({ id: tab.id })`; container pakai
  `DndContext` + `SortableContext` strategi `horizontalListSortingStrategy`.
- Sensor: `PointerSensor` dengan `activationConstraint.distance = 5px`
  supaya klik tab (activate) tidak ke-trigger sebagai drag accidentally.
  `KeyboardSensor` + `sortableKeyboardCoordinates` untuk a11y.
- `onPointerDown` di tombol `tab-x` (close) **wajib** `stopPropagation()`
  supaya tarik dari tombol-X tidak ikut memulai drag.
- State machine reorder di [`lib/use-app-shell-tabs.ts`](lib/use-app-shell-tabs.ts)
  via `reorderTabs(fromId, toId)` (functional setter + `splice`). Persistence
  ke workspace localStorage **otomatis** lewat `useEffect` existing yang
  watch `tabs` di `app-shell.tsx` — jangan tambah jalur simpan baru.
- "+" (new tab), duplicate, dan tab counter tetap **di luar**
  `SortableContext` agar tidak ikut sortable.

### 2.13 Setting → Tampilan = `/settings/appearance` (2026-05-20)

Halaman preferensi tampilan per-user. Canonical path = `/settings/appearance`
(seeded di `sys_menus` di bawah group `M0.SYS` "System" — Administrator module —
dgn code `M0.SYS.APPEARANCE`; 2026-05-22 dipindah dari `SET` module). Komponen = `AppearancePage` (`components/pages/appearance.tsx`),
ter-register di `ERP_PAGES` + `ERP_ROUTE_META`. Short-id legacy `set-appearance`
tetap jalan sebagai alias fallback NAV statis.

**Persistence:** reuse tabel `adm_user_preferences` (model Prisma
`ErpUserPreferences`) — **tidak** bikin tabel `adm_user_settings` baru.
Pemetaan field:

- `theme` (light/dark) → kolom eksplisit `theme`.
- `language` (id/en/ja) → kolom eksplisit `language`. **3 bahasa** didukung di
  UI sejak 2026-05-20: Indonesia, English, Japanese (日本語). Tipe `Lang` di
  `lib/shell-constants.ts`, `lib/mock.ts`, dan `appearance-parts.tsx` semua
  pakai union `'id' | 'en' | 'ja'`. `AppearancePage` men-derive translator
  lokal dari `tw.lang` via `makeTranslator` agar perubahan bahasa langsung
  refleks di halaman ini (tidak menunggu round-trip ke app-shell).
- **Sinkronisasi shell:** saat user pindah bahasa di AppearancePage, halaman
  dispatch `CustomEvent('erp-set-lang', { detail: { lang } })`. App-shell
  punya listener yang memanggil `setLang(next)` — efeknya
  topbar/sidebar/tab-bar/breadcrumb ikut translate instan tanpa remount.
  App-shell juga memuat `language` awal dari `getMyPreferences()` setelah
  user login (server SSOT), dan shortcut keyboard `L` mencycle id → en →
  ja → id. Sumber kunci i18n untuk modul sidebar = title English seeded
  di `apps/api-gateway/prisma/seed-erp.ts` (mis. "Master Data", "Finance &
  Accounting"); pastikan setiap modul baru ditambah seed-nya juga dimasukkan
  ke `I18N` di `lib/mock.ts` untuk ketiga bahasa.
- Tweaks UI lain (`primary`, `density`, `fontScale`, `sidebar`) → `metadata`
  Json (default dari `DEFAULTS` di `appearance-parts.tsx`).

**API**: module `erp-user-preferences`
(`apps/api-gateway/src/erp-user-preferences/**`) — `GET /erp/user-preferences/me`
+ `PUT /erp/user-preferences/me` (guard `ErpJwtAuthGuard`). FE pakai client
`getMyPreferences()` / `updateMyPreferences()` di `lib/api/user-preferences.ts`.

**Font scale → global (2026-05-20).** Knob "Ukuran Font" (`sm/base/lg/xl`)
men-drive CSS variable `--font-scale` (0.9/1/1.12/1.25) di `html[data-fontscale]`
(lihat [`styles/erp-tokens.css`](styles/erp-tokens.css)). Rules di
[`styles/erp-components.css`](styles/erp-components.css) (`body`, `input/select/
textarea/button`, `.tbl`, `.btn`, `.muted/.sub/.hint`, `.mono`) memakai
`calc(<base>px * var(--font-scale))` supaya knob menjangkau form controls &
tabel (yang biasa break font inheritance). **Shell juga ikut terskala
(2026-05-20):** selector `.topbar .brand`, `.breadcrumb`, `.cmd-trigger`,
`.kbd`, `.avatar`, `.flyout/.flyout-item`, `.tab-chip/.tab-code/.tab-count/
.tab-ctx-item`, `.user-menu-hd/.user-menu-item/.user-menu-item .mk`,
`.sidebar .nav-label` semua pakai `calc(NNpx * var(--font-scale, 1))` di
[`styles/erp-components.css`](styles/erp-components.css). **Inline px sudah diaudit:** 32
file komponen yang dulu hardcode `style={{ fontSize: NN }}` sudah di-refactor
jadi `fontSize: 'calc(NNpx * var(--font-scale, 1))'` (80 occurrence) supaya
ikut terskala. **Aturan baku:** saat menulis inline `fontSize`, **wajib**
pakai pola `calc(NNpx * var(--font-scale, 1))` — jangan re-introduce literal
numeric. Pengecualian sah: `FONT_PX[fontScale]` di `appearance-parts.tsx`
(intentional bucket preview).

**Load order saat mount AppearancePage**: API (server SSOT) > localStorage
(`erp-appearance` key) > DOM data-attr > `DEFAULTS`. **Auto-save**: setiap
perubahan kontrol langsung apply ke DOM data-attr (live preview) + tulis ke
localStorage; PUT ke API otomatis ter-debounce 500ms (tanpa tombol Simpan).
Hanya error API yang dinotifikasi (toast `danger`); sukses silent supaya tidak
spam saat user geser kontrol berurutan. Tombol Reset tetap ada untuk
mengembalikan ke `DEFAULTS`.

**Cross-device hydration (2026-05-22):** setelah API prefs berhasil di-load,
`AppearancePage` langsung tulis `merged` ke localStorage (`erp-appearance`)
sehingga `readUrlRoutingEnabled()` pada reload berikutnya sudah benar tanpa
menunggu user mengubah setting. `app-shell.tsx` juga melakukan hal yang sama +
dispatch `CustomEvent('erp-hydrate-url-routing')` agar `useUrlRouting` update
state `urlRoutingEnabled` **tanpa** mereset workspace tabs (berbeda dari
`erp-set-url-routing` yang memang reset tabs untuk manual toggle). Ini
mengatasi skenario cross-device / localStorage cleared.

### 2.11 Inline row actions = semua di kebab menu (WAJIB, 2026-05-20)

Pola wajib kolom action di list page: **semua aksi (Edit, Riwayat, Hapus, …)
masuk kebab menu** (icon `more-vertical`). Tidak ada tombol aksi yang visible
inline — kolom action hanya berisi satu icon `⋮` per baris.

Alasan: deretan tombol per-baris × 10–20 baris bikin tabel sangat "ribut",
dan tombol Hapus merah yang visible selalu rawan salah klik. Dengan semua
aksi di kebab, tabel jauh lebih tenang dan setiap aksi butuh klik sengaja
(termasuk Edit) — trade-off: Edit jadi 2 klik, tapi user tetap bisa klik
kode di kolom KODE (`CodeLinkCell`) sebagai jalur cepat ke detail/edit
(satu klik).

Konvensi item kebab:
- Urutan: aksi navigasi/baca dulu (Edit, Riwayat, Duplikat, …), aksi
  destruktif terakhir.
- **Hapus selalu paling bawah** + `separatorBefore: true` + `danger: true`.
- Workflow approval (Approve/Reject/Post) ikut masuk kebab — bukan bikin
  tombol baru.

Implementasi wajib lewat molecule reusable
[`components/molecules/row-actions-menu.tsx`](components/molecules/row-actions-menu.tsx)
(`RowActionsMenu`) — **dilarang** rakit ad-hoc per halaman. Primitif Radix di
[`components/ui/dropdown-menu.tsx`](components/ui/dropdown-menu.tsx).

**Paritas right-click (WAJIB, 2026-05-20):** setiap baris list **wajib** juga
membuka menu yang sama via klik-kanan (context menu). Bungkus `<TableRow>`
dengan `<RowContextMenu items={rowActions}>` dari molecule yang sama; primitif
Radix di [`components/ui/context-menu.tsx`](components/ui/context-menu.tsx).
Items **harus** array yang sama (referensi sama) dengan `<RowActionsMenu>`
agar opsi & urutannya garanteed sinkron — jangan duplikasi literal. Contoh:

```tsx
const rowActions: RowActionItem[] = [
  { label: 'Edit', onSelect: () => openEdit(row) },
  { label: 'Riwayat', onSelect: () => setAuditTarget(row) },
  { label: 'Hapus', onSelect: () => handleDelete(row), danger: true, separatorBefore: true },
];
return (
  <RowContextMenu items={rowActions}>
    <TableRow ...>
      ...
      <TableCell><RowActionsMenu items={rowActions} /></TableCell>
    </TableRow>
  </RowContextMenu>
);
```

### 2.12 Server-driven pagination + search + filter + sort (WAJIB, 2026-05-20)

**Setiap** list page **wajib** mengirim `page`, `limit`, `search`, `sortBy`,
`sortDir`, (+`isActive` bila ada filter status) ke API. **DILARANG** filter
atau slice di klien atas data hasil API — backend default `limit=10`, kalau
FE pakai client-side filter → user cuma lihat 10 baris pertama walau footer
bilang "Tampilkan 25".

Bug history (2026-05-20): branches page hanya menampilkan 10 baris walau
seed 500 dummy ada — penyebab: `listBranches({ sortBy, sortDir })` tidak
kirim `limit`, backend default 10, FE lalu `rows.filter(...).slice(page-1,
page)`. Quick fix-nya menaikkan limit hanya menunda masalah; refactor
proper diterapkan ke semua list page.

Bug history (2026-05-20, lanjutan): FE pakai server-driven pagination tapi
DTO `warehouses`/`partners`/`locations` belum punya `sortBy`/`sortDir` →
`ValidationPipe({ forbidNonWhitelisted: true })` lempar 400
`"property sortBy should not exist"`. Fix: tambah `sortBy`/`sortDir`
(whitelist `IsIn(SORTABLE_FIELDS)`) ke ketiga DTO + wire `orderBy: [{
[sortBy]: sortDir }]` di service. Setiap kali nambah list page baru, sync
DTO query dulu sebelum FE diarahkan ke server-side sort.

**Pola kanonik** (lihat [components/pages/branches-page.tsx](components/pages/branches-page.tsx)):

```tsx
const [sortBy, setSortBy] = useState('createdAt');
const [sortDir, setSortDir] = useState<'asc'|'desc'>('desc');
const [search, setSearch] = useState('');
const [statusFilter, setStatusFilter] = useState('active'); // default: tampilkan aktif saja
const { page, pageSize, setPage, setPageSize } = useListPagination('branches');

// Debounce search 300ms
const [debouncedSearch, setDebouncedSearch] = useState(search);
useEffect(() => {
  const t = setTimeout(() => setDebouncedSearch(search), 300);
  return () => clearTimeout(t);
}, [search]);

const isActiveParam = statusFilter === 'active' ? true
  : statusFilter === 'inactive' ? false : undefined;

const { rows, meta, loading, error, reload } = useErpList(
  () => listBranches({
    page, limit: pageSize, search: debouncedSearch || undefined,
    sortBy, sortDir, isActive: isActiveParam,
  }),
  [page, pageSize, debouncedSearch, sortBy, sortDir, isActiveParam],
);

// Reset page 1 saat filter/search/sort/pageSize berubah
useEffect(() => { setPage(1); }, [debouncedSearch, statusFilter, sortBy, sortDir, pageSize]);

const paged = rows;  // server sudah paginasi
const totalRows = meta?.total ?? 0;
const pageCount = meta?.totalPages ?? 1;
```

Aturan turunan:

- `useErpList` (`lib/use-erp-list.ts`) **harus** dipanggil dengan
  **deps array** kedua — fetcher closure di-cache via ref, hanya deps yang
  trigger refetch.
- `meta.total`/`meta.totalPages` dari backend = SSOT untuk pagination footer.
- **Dilarang** memo `filtered = rows.filter(...)` di list page lagi —
  filter ke backend.
- Backend DTO **wajib** support minimal `page`, `limit`, `sortBy`, `sortDir`
  + `search` (bila ada kolom teks). Filter status (`isActive`) bila entitas
  punya. Kalau DTO belum lengkap → tambahkan dulu di
  `apps/api-gateway/src/erp-<feature>/dto/query-*.dto.ts` sebelum FE
  menggantungkan diri ke server-side.
- Pengecualian sah saat ini (DTO memang tidak paginasi, list selalu kecil):
  `settings`, `fiscal-periods`, `menus`, `permissions` (enum-like). Kalau
  list-nya tumbuh, tambahkan paginasi backend dulu.

### 2.20 Hierarki geografis & kode pos (WAJIB, 2026-05-22)

Setiap tabel referensi geografis **wajib** terhubung ke level di atasnya via
FK yang ditegakkan — tidak boleh ada tabel wilayah yang berdiri sendiri tanpa
relasi ke induknya.

**Hierarki kanonik ERP (sudah diimplementasi):**

```
md_countries ← md_provinces ← md_cities ← md_areas (kecamatan) ← md_sub_areas (kelurahan)
```

Aturan turunan:

- `md_provinces.countryId` → FK ke `md_countries`.
- `md_cities.provinceId` → FK ke `md_provinces`.
- `md_areas.cityId` → FK ke `md_cities`. Field `postalCode` ada di sini (per kecamatan).
- `md_sub_areas.areaId` → FK ke `md_areas`. Field `postalCode` ada di sini juga (per kelurahan, lebih granular).
- `postalCode` di `md_partner_addresses`, `md_branches`, `md_locations` adalah
  **freetext** (isian manual) — terpisah dari referensi `md_areas`/`md_sub_areas`.
  User mengisi manual atau autofill dari `md_sub_areas` saat memilih kelurahan di form alamat.

**Seed data (2026-05-22):** `prisma/seed-md-geo.ts` (jalankan via `npm run db:seed:geo`).
Sumber: `kode-wilayah-id` (MIT). Data lengkap Indonesia:
38 provinsi, 514 kab/kota, 7.286 kecamatan (+ `postalCode`), 84.270 kelurahan/desa (+ `postalCode`).
Kode = BPS code (2/4/7/10 digit sesuai level). Idempotent — aman dijalankan ulang.

**Model Prisma:**
- `ErpArea` → `@@map("md_areas")`, relasi `subAreas ErpSubArea[]`
- `ErpSubArea` → `@@map("md_sub_areas")`, FK `areaId → ErpArea`, index `postalCode`

Migration: `20260522_004_erp_md_geo_kelurahan` (additive, 0 DROP).

### 2.21 Item Information page = `/master/item-info` (canonical, 2026-05-23)

Halaman Item Information (1:1 extension dari `md_items`: produsen, negara
asal, garansi, deskripsi panjang, spesifikasi, tags, catatan). Canonical
path **= `/master/item-info`** (seed `sys_menus` code `M1.ITEM.INFO`).
Long-form `/master/item-informations` dipertahankan **sebagai alias** di
[`shell-route-renderer.tsx`](components/templates/shell-route-renderer.tsx)
dan `ERP_ROUTE_META` (`lib/nav.ts`) untuk URL yang sudah ter-bookmark —
jangan dihapus, tapi jangan dipakai sebagai entry baru.

**Aturan implementasi:**

- Form pakai **`SearchSelect`** untuk `itemId` (load dari `listItems`), **disabled saat edit** karena `itemId @unique` (1:1 ke `ErpItem`) — ganti item = ganti rekor.
- Field form lengkap: `itemId`, `manufacturer`, `countryOfOrigin`, `warrantyPeriodMonths`, `longDescription` (textarea), `specifications` (textarea), `tags`, `notes` (textarea). **Dilarang** drop field DTO dari form tanpa alasan.
- Service `ErpItemInformationsService` **wajib** include `item: { select: { id, code, name } }` di semua query (list/get/create/update) supaya halaman bisa pakai `item.code`/`item.name` sebagai kolom KODE/NAMA tanpa N+1 fetch.
- `SimpleMasterPage` adapter: `code = item.code` (fallback `INF-${id}`), `name = item.name` (fallback `Item #${itemId}`), `isActive = true` (entity tak punya status sendiri). Extra columns: Produsen, Negara Asal, Garansi.

**Seed dummy:** `prisma/seed-erp-item-informations-dummy.ts` (100 rows, idempotent — `findMany({ information: { is: null } }) + createMany skipDuplicates`). Butuh `md_items` ter-seed lebih dulu (lihat `seed-erp-md-dummy.ts`).

### 2.23 Item master = form lengkap sectioned (2026-05-24)

Master Item (`/master/items`, `ErpItemsPage`) di-expand dari 7 field → paritas
header MyERP+ "Barang". Field katalog otoritatif = `db-design/entities-m1-master-data.md`.

- **`md_items` kolom baru** (migrasi `20260524_001_erp_item_dimensions_classification`):
  `costMethod` (enum `ErpCostingMethod` AVG/FIFO/STD), `minOrderQty`, `ageCategory`,
  `validUntil`, `isVatable` (BKP), `isSpecial`, + 9 dimensi GL FK (`divisionId`,
  `subdivisionId`, `departmentId`, `subDepartmentId`, `branchId`, `defaultLocationId`,
  `defaultWarehouseId`, `projectId`, `costCenterId`). Klasifikasi (`kindId`,
  `productClassId`, `brandId`, `materialId`, `itemModelId`, `sizeId`, `colorId`,
  `sectionId`) sebagian sudah dari `20260523_001` — schema.prisma kini meng-expose
  semuanya. **FK intra-domain `md` ditegakkan** (named `@relation` + back-pointer parent).
- **`ErpItemType` enum di-reshape** (migrasi `20260524_002_erp_item_type_enum_reshape`):
  `INVENTORY/SERVICE/CONSUMABLE/ASSET/NON_INVENTORY` (hapus `VOUCHER/ASSEMBLY`).
  FE & DB konsisten. Saat menyentuh `type`, pakai set ini.
- **Form FE**: dipecah `items-form.tsx` (types/adapters/validation) +
  `items-form-fields.tsx` (UI organism) + `items-form-lookups.ts` (loader SearchSelect).
  Layout = **modal `lg` (900px), section 2-kolom** (Identitas · Satuan & Penilaian ·
  Stok & Tracking · Harga & Pajak · Akun GL · Dimensi & Supplier · Deskripsi).
  Bukan tab legacy — keputusan user: "UX nyaman & compact". Sub-komponen
  `LookupField`/`NumField`/`YesNoField` **di module-level** (jangan inline di render —
  remount + hilang focus).
- **`SimpleMasterPage` dapat prop `modalSize?: 'md' | 'lg'`** (default `md`). Form
  kaya (banyak field) → pakai `modalSize="lg"`. Diteruskan ke `<ModalContent size>`.
- **Deferred** (belum di form): price tiers 2–10, tab Atribut multi-varian,
  distributor multi-supplier. Item Information tetap halaman 1:1 terpisah (§2.21).

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

### 2.15 Sidebar group `Organization` (2026-05-20)

Group nav baru di NAV `Organization` (id `org`, icon `database`) menampung
**9 master org-level**: Branch, Location, Warehouse, Division, Sub Division,
Project, Cost Center, Department, Sub Department.

- Path kanonik = `/org/<entity>` (di-seed di `sys_menus` di bawah module
  `M1` group `M1.ORG`). Path lama `/master/branches`/`/master/locations`/
  `/master/warehouses`/`/master/divisions`/`/master/subdivisions` tetap
  ter-register di `ERP_PAGES` sebagai alias (jangan break link existing).
- Tabel: `md_branches`, `md_locations`, `md_warehouses`, `md_divisions`,
  `md_subdivisions`, `md_projects`, `md_cost_centers`, `md_departments`,
  `md_sub_departments`. Model Prisma: `ErpBranch`, `ErpLocation`,
  `ErpWarehouse`, `ErpDivision`, `ErpSubdivision`, `ErpProject`,
  `ErpCostCenter`, `ErpDepartment`, `ErpSubDepartment`.
- API module per-entitas di `apps/api-gateway/src/erp-*` (controller +
  service + DTO create/update/query/bulk), guard `ErpJwtAuthGuard` (§2.5).
- FE: tiap halaman = ~60-90 baris pakai organism reusable
  `components/organisms/simple-master-page.tsx` (generik CRUD: pagination
  server-driven, kebab+context menu, bulk action, audit panel). Wajib
  pakai organism ini untuk halaman master "code+name+isActive" gaya baru —
  **dilarang** fork branches-page lagi.

### 2.16 `SimpleMasterPage<T, F>` organism (2026-05-20)

[`components/organisms/simple-master-page.tsx`](components/organisms/simple-master-page.tsx)
adalah organism reusable untuk halaman list master entitas "simple" (code +
name + isActive + optional kolom/field tambahan). Pattern wajib §2.7–§2.12
sudah built-in di sini.

API page-side (per entitas):
- `defaultForm()` / `fromRecord(row)` / `toPayload(form)` — adapter form.
- `FormFields` — komponen form kustom (atom `FormField` + `Input` +
  `BooleanRadio` + `Select` bila perlu).
- `extraColumns: ExtraColumn<T>[]` — kolom ekstra di antara Nama dan Status
  (untuk relasi parent: Sub Division→Division, Sub Department→Department,
  Project→date range).

Endpoint API client wajib expose `list/create/update/remove/bulkStatus/
bulkDelete` untuk dipasangkan ke organism (lihat
`lib/api/divisions.ts` sebagai template).

#### Standar validasi form `SimpleMasterPage` (WAJIB, 2026-05-23)

Setiap halaman yang pakai `SimpleMasterPage` **wajib** menerapkan pola
validasi berikut — tanpa pengecualian:

1. **`validate` prop wajib ada** di `<SimpleMasterPage ... validate={validateXxx} />`.
   Minimal validasi: `code` required + `name` required (+ FK required bila ada
   field `SearchSelect` yang mandatory).

2. **`FormFields` wajib terima `errors`**:
   ```tsx
   function FormFields({
     data, onChange, errors = {}
   }: { data: F; onChange: (d: F) => void; errors?: FormErrors<F> }) {
   ```

3. **`aria-invalid` wajib pada setiap `<Input>` yang required**:
   ```tsx
   <FormField label="Kode" htmlFor="ef-code" required error={errors.code}>
     <Input ... aria-invalid={!!errors.code} />
   </FormField>
   ```

4. **`error` prop wajib pada `<SearchSelect>` required**:
   ```tsx
   <SearchSelect ... error={!!errors.fieldId} />
   ```
   (Pasangkan `aria-invalid` + border merah sudah built-in di `SearchSelect`.)

5. **Auto-focus ke field error pertama** — sudah built-in di `handleSave`
   organism (query `[role="dialog"] [aria-invalid="true"]`, no-op bila tidak ada).

Konsekuensi: halaman yang skip `validate=` → submit tanpa validasi client-side.
Halaman yang skip `aria-invalid=` → auto-focus gagal menemukan field error.
Kedua ini harus selesai sebelum halaman dideklarasikan done.

### 2.22 Menu Manager = TreeDndMasterPage (tree + cross-parent DnD) (2026-05-24, revisi)

`/admin/menus` (komponen `ErpMenusPage` di
[`components/pages/menus-page.tsx`](components/pages/menus-page.tsx))
**memakai organism `TreeDndMasterPage`** — hierarki MODULE→GROUP→ITEM dengan
drag-and-drop reorder (sibling **dan** cross-parent). **Revisi keputusan
2026-05-24** (atas permintaan user): versi flat-list `SimpleMasterPage` yang
sempat dipakai pagi itu **di-rollback**. Trade-off yang diterima ulang dengan
user:

- **Checkbox column diganti drag handle** (icon `grip-vertical`) di kolom
  paling kiri → **tidak ada bulk action** di halaman ini (pengecualian sah
  atas §2.9.H, dikonfirmasi user). Aksi destruktif per-baris tetap ada di
  kebab + right-click menu.
- **Tidak ada pagination/sort/filter server-driven** (pengecualian sah atas
  §2.7/§2.12) — tampilan hierarkis butuh seluruh subtree terlihat agar DnD
  bermakna. Search client-side menyaring baris yang cocok **+ ancestor-nya**
  supaya konteks tree tetap terbaca.

Organism reusable (atomic level organisms), bukan fork SimpleMasterPage:

- [`components/organisms/tree-dnd-master-page.tsx`](components/organisms/tree-dnd-master-page.tsx)
  — shell: state, search, modal create/edit, audit panel, DnD orchestration.
- [`components/organisms/tree-dnd-row.tsx`](components/organisms/tree-dnd-row.tsx)
  — molecule baris (drag handle + indent depth + cells + kebab/context menu).
- [`components/organisms/tree-dnd-helpers.ts`](components/organisms/tree-dnd-helpers.ts)
  — pure helpers (`flattenTree`, `inferNewParent`, `computeReorderChanges`,
  `validateDrop`); dipisah agar shell < 400 baris (§3).
- [`components/organisms/tree-dnd-master-page.types.ts`](components/organisms/tree-dnd-master-page.types.ts)
  — tipe bersama (`TreeRow`, props) untuk hindari import sirkular.

DnD = `@dnd-kit/core` + `@dnd-kit/sortable` (sama lib dgn tab-bar §2.14),
`PointerSensor` `distance: 5`, `verticalListSortingStrategy`.

**Cross-parent drop rule** (`inferNewParent`): setelah `arrayMove` di flat
list, parent baru item diturunkan dari baris tepat di atasnya:
MODULE → selalu root (null); GROUP → nesting di MODULE terdekat ke atas;
ITEM → anak dari MODULE/GROUP container terdekat, atau sibling dari ITEM
terdekat (mewarisi parent ITEM itu). Hanya item yang berubah `parentId`/
`sortOrder` yang dikirim ke backend (optimistic update lokal dulu, rollback
via `reload()` bila API gagal).

Detail kolom & form:

- **Kolom ekstra:** Tipe (badge MODULE=success/GROUP=info/ITEM=default),
  Path (mono muted). Kolom Urutan dihilangkan (urutan kini dari posisi DnD).
- **Parent menu** masih bisa diedit per-row via `SearchSelect` di form
  (filter `MODULE` + `GROUP` only) sebagai jalur alternatif memindah node
  ke container kosong. Validasi cycle/hierarki **server-side**.

Backend (`apps/api-gateway/src/erp-sys-menus/`):

- Endpoint baru: `POST /erp/sys-menus/reorder` (DTO `ReorderErpSysMenuDto`
  = `{ items: { id, parentId, sortOrder }[] }`). Diregister **sebelum**
  route `:id`. Service `reorder()` memvalidasi aturan hierarki tipe
  (MODULE root-only; GROUP di bawah MODULE; ITEM di bawah MODULE/GROUP) +
  **no-cycle** (tak boleh pindah node ke diri sendiri / descendant-nya),
  lalu apply semua update dalam **satu `$transaction`**.
- Endpoint bulk lama (`PATCH bulk/status`, `DELETE bulk`) **tetap ada** di
  service/controller (dipakai API lain / future), tapi **tidak dipasang**
  di halaman menus karena tak ada checkbox.
- `GET /erp/sys-menus` tetap flat tanpa pagination — §2.12 exception. Client
  `loadAll()` di menus-page request `limit:10000` lalu pakai seluruh data
  untuk membangun tree di FE.

Konsekuensi vibe coding:

- Butuh tree+DnD untuk entitas hierarkis lain (mis. CoA tree, kategori
  berjenjang)? **Pakai ulang `TreeDndMasterPage`** — jangan fork menus-page,
  jangan bikin organism tree baru.
- Butuh bulk action di menus lagi? Itu balik konflik dgn keputusan "drag
  handle ganti checkbox" — eskalasi ke user dulu (§5).

### 2.17 Modul sidebar Senti ERP — scope final (2026-05-20)

Modul valid di `sys_menus` (sortOrder, sumber `seed-erp.ts`):

| sortOrder | code | title | catatan |
| --- | --- | --- | --- |
| 0 | M8 | Dashboard | pinned paling atas |
| 1 | M0 | Administrator | sys + adm |
| 2 | M1 | Master Data | md (incl. group Organization) |
| 3 | M2 | Finance & Accounting | fin |
| 4 | M3 | Warehouse & Inventory | inv |
| 5 | M4 | Purchasing | pur |
| 6 | M5 | Sales | sls |
| 7 | M6 | Production | mfg |
| 8 | M7 | Fixed Assets | fa |
| 9 | M12 | Point of Sale | pos (singular!) |
| 99 | SET | Settings | preferensi user |

**Dihapus permanen dari ERP scope:** M10 (HR & Payroll), M11 (Hospital —
milik `apps/web-althea`), M13 (Academic), M14 (Cooperative). Tidak ada di
`module-roadmap.md`, bukan scope manufaktur. Kalau perlu dihidupkan lagi:
katalog field-level dulu di `db-design/`, lalu seed.

**Single source of truth seed = `apps/api-gateway/prisma/seed-erp.ts`**.
`prisma/seed.ts` (clinic seed) dulu punya blok `ERP_MENU_SEEDS` paralel
dengan short-id legacy (`master-data`, `administrator`, `md-items`, ...)
yang menabrak/duplicate setiap `npm run db:seed`. **Blok itu dihapus
2026-05-20.** Jangan pernah re-introduce ERP menu seeding di `seed.ts`.

**M2 Finance — paritas legacy m2-finance (2026-05-20).** Sebelumnya seed M2
cuma 4 transaksi + 1 report (`Journal Entries`, `AR Receipts`, `AP Payments`,
`Giros`, `General Ledger`) — terlalu ringkas, tidak match legacy. Sekarang
13 transaction items + 1 report, title **English**, ditahan `legacyCode`
sebagai 2–3 huruf legacy:

| code | title | legacyCode | path |
| --- | --- | --- | --- |
| M2.TX.CASH-RECEIPT | Cash Receipt | CR | /finance/cash-receipts |
| M2.TX.CASH-DISBURSEMENT | Cash Disbursement | CD | /finance/cash-disbursements |
| M2.TX.BANK-DISBURSEMENT | Bank Disbursement | BD | /finance/bank-disbursements |
| M2.TX.CASHBANK-TRANSFER | Cash/Bank Transfer | CB | /finance/cashbank-transfers |
| M2.TX.RECEIPT-GIRO | Receipt Giro | RG | /finance/receipt-giros |
| M2.TX.SEND-GIRO | Send Giro | SG | /finance/send-giros |
| M2.TX.RECEIPT-GIRO-CLR | Receipt Giro Clearing | RGC | /finance/receipt-giro-clearings |
| M2.TX.SEND-GIRO-CLR | Send Giro Clearing | SGC | /finance/send-giro-clearings |
| M2.TX.RECEIPT-MEMO | Receipt Memo | RM | /finance/receipt-memos |
| M2.TX.SEND-MEMO | Send Memo | SM | /finance/send-memos |
| M2.TX.GENERAL-JOURNAL | General Journal | GJ | /finance/general-journals |
| M2.TX.ADJUSTMENT-JOURNAL | Adjustment Journal | AJ | /finance/adjustment-journals |
| M2.RPT.LEDGER | General Ledger | — | /finance/ledger |

Padanan ID untuk konteks user: CR=Kas Masuk, CD=Kas Keluar, BD=Bank
Keluar, RG=Giro Masuk, SG=Giro Keluar. Path FE belum dibangun — menu
muncul di sidebar, route placeholder akan ditambah saat slicing modul M2.

### 2.18 MD legacy batch (2026-05-20) — 20 master baru dari MyERP+ m1_*

Wave besar menambah 20 entitas master legacy yang belum di-implement.
Branch `feat/erp-md-legacy-batch`, 3 commit.

**Tercakup:** Brand, Material, ItemModel, Size, Section, ItemKind
(table `md_item_types`), ProductClass, ItemLocation, Commission (+amount),
Bank, Expedition, PartnerSubCategory (enum CUSTOMER/SUPPLIER/SALESMAN),
OtherCost, Country, Province (FK Country), City (FK Province), Area
(FK City), ItemTransactionType (+direction), TransactionNote, PriceCategory.

**Keputusan terkunci batch ini:**

1. **`ErpItemKind` ≠ `ErpItemType`.** Enum `ErpItemType` (hardcoded
   `INVENTORY/SERVICE/VOUCHER/ASSEMBLY` di kolom `ErpItem.type`) sudah ada
   sejak m1 init dan tidak boleh bentrok. Master user-configurable dari
   legacy `m1_item_type` → model **`ErpItemKind`** dengan
   `@@map("md_item_types")`. Saat menambah master baru: cek dulu apakah
   nama model bentrok dengan enum/model existing.
2. **Partner sub-category = 1 tabel + enum (`ErpPartnerSubCategoryType`).**
   3 menu sidebar (Customer/Supplier/Salesman Categories) share 1 page +
   1 table + 1 endpoint. Path `/master/{customer,supplier,salesman}-categories`
   semua resolve ke `ErpPartnerSubCategoriesPage` di `ERP_PAGES`. Filter
   type via query string ditambahkan saat dibutuhkan (saat ini belum).
3. **Reference Country→Province→City→Area = FK ditegakkan (intra-domain `md`).**
   Seed di `prisma/seed-md-legacy.ts` (idempotent): **197 Country (seluruh dunia, ISO 3166-1 alpha-2, 2026-05-22)**, 38 Province ID, **514 Kab/Kota lengkap per BPS** (kode BPS 4-digit), Bank, Expedition.
   City upsert pakai `findFirst(bpsCode OR code) + update-by-id` (bukan `upsert`) karena DB bisa mixed-state.
   **`postalCode` hidup di `md_areas` (level kecamatan), bukan di `md_cities`** —
   karena satu kota punya banyak kode pos, masing-masing per kecamatan. Lihat §2.20.
4. **ItemPermission ditunda.** Bukan master "code+name+isActive" — pivot
   `itemId × roleId × {canView,canSell,canBuy}`. `SimpleMasterPage` tidak
   cocok; perlu page custom. Tabel sudah ada (`md_item_permissions`) tapi
   modul API/FE belum.
5. **PriceCategoryDetail & TransactionNoteDetail = child-managed.** Tabel
   ada (cascade delete dari parent), tapi diakses lewat parent form bukan
   menu sidebar. Menu "Txn Note Detail" di sidebar untuk sekarang fallback
   ke ComingSoon.

**Generator script:** `apps/api-gateway/scripts/scaffold-md-batch.mjs` —
one-shot scaffolder. Pattern di-mirror dari `erp-divisions`. Pluralization
manual (Class→Classes, City→Cities, Country→Countries, Category→Categories;
generator default plural = `+ 's'` di-override via sed post-process). Re-run
aman: skip file yang sudah ada. **Untuk master sederhana berikutnya
(code+name+isActive ± extra fields), tambah entry di array `ENTITIES`
lalu re-run** — jangan tulis ulang DTO/service per tangan.

**Migration:** `20260520_002_erp_md_legacy_batch` — additive, applied via
`prisma db execute` lalu `prisma migrate resolve --applied` karena shadow
DB drift di migrasi clinic lama. 23 tabel + 1 enum
(`ErpPartnerSubCategoryType`), 0 DROP. Saat shadow DB rusak, route ini
(execute + resolve) lebih aman daripada `migrate dev`.

### 2.19 Mode "Per-halaman URL" = true single-page (2026-05-22)

**Penamaan resmi untuk vibe coding:**

| Istilah | UI label | Kode | Arti |
| --- | --- | --- | --- |
| **URL routing off** | Internal | `urlRoutingEnabled = false` | navigasi tidak ubah URL, multi-tab aktif |
| **URL routing on** | Per-halaman URL | `urlRoutingEnabled = true` | URL ikut halaman aktif, tab navigator disembunyikan |

Gunakan "URL routing off/on" saat diskusi atau vibe coding — langsung korespondensi ke nama variabel `urlRoutingEnabled`.

Knob URL Routing di Setting → Tampilan punya 2 mode: **Internal** (default,
navigasi tidak mengubah URL, multi-tab) dan **Per-halaman URL**.

- Memilih **Per-halaman URL** **menyembunyikan seluruh tab navigator** —
  `TabBar` tidak dirender. Konsekuensi: user hanya bisa membuka satu halaman
  dalam satu waktu. Navigasi via sidebar/topbar/command-palette/notifikasi
  **mengganti** halaman aktif di tempat (replace), bukan membuka tab baru.
- Ganti mode (dua arah) **wajib** lewat `confirmAction` dengan pesan eksplisit
  per arah: ke Per-halaman URL → "tab navigator dihapus, hanya satu halaman";
  ke Internal → "tab navigator ditampilkan kembali". Saat dikonfirmasi semua
  tab lain ditutup — **halaman yang sedang aktif dipertahankan** (bukan reset
  ke `home`).
- Logika URL-routing diekstrak dari `app-shell.tsx` ke hook
  [`lib/use-url-routing.ts`](lib/use-url-routing.ts) (`useUrlRouting` +
  `readUrlRoutingEnabled`) — mengelola state mode, listener event
  `erp-set-url-routing`/`storage`, sync `window.history.replaceState`, dan
  `navigate()` (replace vs openTab). `app-shell.tsx` memanggil hook ini; saat
  mode aktif, render `TabBar` di-gate dengan `!urlRoutingEnabled`.

---

## 5. Saat ragu

Tanya user. Aturan-aturan di atas tidak punya pengecualian diam-diam —
kalau ada kebutuhan menyimpang, eskalasi dulu.
