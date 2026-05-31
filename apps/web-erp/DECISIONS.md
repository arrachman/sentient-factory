# Web-ERP — Decision Log (catatan build per-fitur)

Riwayat keputusan **per-fitur** Senti ERP — dibaca **on-demand** saat menyentuh
fitur terkait, **bukan** tiap sesi. Rulebook invariant yang berlaku setiap saat
ada di [`CLAUDE.md`](CLAUDE.md); file ini melengkapinya dengan konteks + rasional.

Nomor section (`§2.x`) dipertahankan sebagai **anchor stabil** — banyak commit &
dokumen lain me-rujuk `§2.x`, jadi id-nya tidak diubah walau urutannya dirapikan.
Aturan turunan yang **berlaku saat membangun apa pun yang baru** sudah diringkas
di `CLAUDE.md` (section "Aturan turunan lintas-fitur"); di sini detail lengkapnya.

---

---

### 2.4 Command palette = derived dari role-filtered nav (2026-05-20)

`CommandPalette` (`components/organisms/command-palette.tsx`) **tidak boleh**
punya hardcoded menu list. Items diturunkan dari prop `nav: NavItem[]` yang
sama dengan sidebar (state `nav` di `app-shell.tsx`, di-load via
`fetchMyMenus()`). Konsekuensi: search palette = persis semua menu aktif
yang user berhak akses (sesuai `adm_role_menus`). Group palette mengikuti
struktur nav (MODULE → ITEM, atau MODULE → GROUP → ITEM jadi "Module ·
Group"). Hanya group "Aksi" (toggle theme/lang) yang statis. Saat menambah
modul baru: cukup seed di `sys_menus` + `adm_role_menus`, palette ikut.

**Pencarian penuh (2026-05-31):** filter palette match terhadap **label
(raw + ter-translate via `tGlobal`), code/hint, dan nama group/module** —
bukan label saja. Konsekuensi: mengetik kode (`M0.CFG`, `CR`, `BRN`), nama
modul ("administrator", "data master"), atau teks yang tampil di layar (mode
ID/EN/JA) semuanya resolve. Sebelumnya hanya `it.label` raw yang dicocokkan,
jadi kode yang terlihat di kolom hint tidak bisa dicari & teks Indonesia yang
tampil tidak match. Sidebar & palette tetap satu sumber `nav` (coverage sinkron
by construction) — perubahan ini murni di field yang dicocokkan, bukan daftar item.

---

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

---

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

---

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

---

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

---

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

---

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

---

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

---

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

**Footer informasional + keyboard nav (2026-05-24).** Walau halaman ini
**tidak** punya pagination (DnD butuh seluruh tree visible), footer tetap
hadir agar konsisten visual dgn list page lain — bentuk **count-only**:
`X dari Y baris` (X = baris visible setelah filter search, Y = total flat) +
hint pintasan keyboard. Footer dirender lewat organism reusable
[`components/organisms/list-footer.tsx`](components/organisms/list-footer.tsx)
yang juga dipakai `ErpListLayout`/SimpleMasterPage — mode dipilih via prop:
`pagination` → TablePagination penuh, `summary` → count-only (tree), plus
`selectable=false` untuk drop hint "X pilih" di halaman tanpa selection.

Keyboard navigation diwirekan via hook reusable
[`lib/use-tree-keyboard-nav.ts`](lib/use-tree-keyboard-nav.ts): **J/↓** &
**K/↑** geser focus, **Enter** open focused row (edit), **N** add new, **/**
focus search. **Tidak ada `X` (select)** — konsisten dgn keputusan "drag
handle ganti checkbox" di atas. Focus state visual via `data-focused` di
`TableRow` (styling otomatis dari `components/organisms/table.tsx`).

Konsekuensi vibe coding:

- Butuh tree+DnD untuk entitas hierarkis lain (mis. CoA tree, kategori
  berjenjang)? **Pakai ulang `TreeDndMasterPage`** — jangan fork menus-page,
  jangan bikin organism tree baru.
- Butuh bulk action di menus lagi? Itu balik konflik dgn keputusan "drag
  handle ganti checkbox" — eskalasi ke user dulu (§5).

---

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
- **Deferred** (belum di form): tab Atribut multi-varian, distributor
  multi-supplier. Item Information tetap halaman 1:1 terpisah (§2.21).
  (Price tiers 1–10 sudah **implemented** — lihat §2.32.)

---

### 2.24 Format kode akun CoA = dinamis dari `sys_settings` (2026-05-27)

Format `md_accounts.code` **tidak** lagi hard-locked ke `NNNN.NN.NNN` (#43
db-design). Pakai 2 setting global di `sys_settings` group `account-code`:

- `account_code_segments` (JSON array int, mis. `[4,2,3]` / `[5]` / `[7]` / `[6,3]`) — panjang tiap segmen.
- `account_code_separator` (string: `.` / `-` / `/` / `""` tanpa pemisah).

**Backend SSOT** = `apps/api-gateway/src/erp-accounts/account-code-format.ts`:
`buildAccountCodeFormat(segments, separator)` → `{pattern, maxLength, example}`.
`ErpAccountsService.create()`/`update()` baca setting + `validateAccountCode()`
sebelum insert. DTO `CreateErpAccountDto` hanya `@MaxLength(30)` (tidak ada
`@Matches`). Endpoint: `GET /erp/accounts/code-format` (segments, separator,
patternSource, maxLength, example, accountCount, locked) + `PUT /erp/accounts/code-format`
(409 ConflictException bila `md_accounts.count > 0` — **lock-after-data**).

**Frontend:**
- `components/pages/accounts-form.tsx` cache format module-level + hook
  `useAccountCodeFormat()`; `validateAccount` baca cache; `AccountFormFields`
  pakai `maxLength`/`placeholder`/`example` dari format aktif.
- Halaman dedicated `/admin/account-code-format`
  (`account-code-format-page.tsx` + molecule `account-code-format-presets.tsx`)
  di group `M0.SYS` (Administrator → System) — segments editor (1–5 segmen
  × 1–12 digit), separator picker, preset cepat (PSAK 4-2-3, flat 5/6/7,
  4-3, 4-3-3, legacy 6-3), preview live, lock card saat ada akun. Setelah
  PUT sukses → `invalidateAccountCodeFormatCache()` supaya form refresh.

**Saat onboarding klien dengan CoA legacy berbeda**: admin Senti pilih
format di `/admin/account-code-format` **sebelum** import CoA / jalankan
`seed-erp-accounts.ts`. Default seed tetap PSAK 4-2-3 — klien yang OK
dengan PSAK tinggal pakai. Ganti format setelah ada akun → tolak 409;
harus hapus semua akun dulu (out of scope MVP: tool migrasi rename code).

---

### 2.25 Item master form redesign — quick-add + side-nav (2026-05-27)

Lanjutan §2.23. Form item kini punya **2 mode entri** dan layout berbeda
per mode. Keputusan ini berlaku **khusus form item** — masih sectioned
2-kolom kompak, namun layout level-form berubah.

**Mode entri:**
- **Cepat** — default saat tambah item baru (`data.code === ''`). Hanya
  section Identitas + Klasifikasi (~7-8 field wajib). Layout scroll.
- **Lengkap** — default saat edit. Semua section, **side-nav 200px di
  kiri** + content section aktif di kanan. Section conditional (Inventory
  & Tracking) hanya muncul saat `isStockable(itemType)`. Dot merah di
  nav item menandakan section dgn error validasi.

Toggle Cepat/Lengkap di top form (pill segmented). User bebas switch
tanpa kehilangan state form. Modal pakai `size="xl"` (1100px) supaya
side-nav + content tidak crowded.

**Section grouping (9 section):**
Identitas · Klasifikasi · Inventory & Tracking (conditional) · Harga ·
Pajak · Akuntansi · Dimensi GL · Supplier · Catatan. Restructure dari
7 section lama (§2.23) yang campur identitas dengan satuan, dan Akun
GL dengan Dimensi/Supplier.

**Conditional disclosure per itemType:**
- `INVENTORY/CONSUMABLE/ASSET` → tampilkan Inventory & Tracking
- `SERVICE/NON_INVENTORY` → sembunyikan Inventory & Tracking
- `SERVICE` → sembunyikan juga Berat (kg)
- `tracksBatch=Ya` → munculkan Kategori Umur (intra-section)

**Smart features:**
- Tombol **Auto** di samping field Kode → fetch item dgn prefix
  matching itemType (ITM-/SVC-/CNS-/AST-/NIN-), generate sequence
  berikutnya client-side. Helper di `lib/items-code-generator.ts`.
  Bukan transactional — `sys_document_numberings` endpoint
  ditangguhkan sampai BE-nya dibuat.
- **Duplikat** di row kebab menu → buka modal create dgn prefill,
  kode dikosongkan supaya user isi baru. Berlaku untuk semua master
  ERP (SimpleMasterPage), tidak hanya item.

**SimpleMasterPage enhancement (universal):**
Berlaku untuk **semua** halaman master ERP yang pakai
`SimpleMasterPage`, bukan items-only:
- **Validation summary banner** di top modal saat client-side validasi
  gagal — list 5 error pertama + count. Komponen
  `components/molecules/form-error-summary.tsx`.
- **Footer multi-save**: tombol "Simpan & Tambah Baru" muncul di create
  mode (selain "Simpan"). Save → reset form → auto-focus → modal tetap
  buka untuk batch entry.
- **Keyboard shortcuts**: Ctrl/Cmd+S = Simpan, Ctrl/Cmd+Enter = Simpan
  & Tambah Baru (create mode). Hook `lib/use-modal-shortcuts.ts`.
- **Row action Duplikat** di kebab + right-click menu (urutan: Edit →
  Duplikat → Riwayat → Hapus).
- `modalSize` prop diperluas: `'md' | 'lg' | 'xl'` (560/900/1100px).

**UX polish (item form):**
- Section header: bg `var(--panel-2)` muted + padding (bukan caps
  tipis tanpa bg). Tambah prop `hint` untuk one-liner di sebelah judul.
- Required label: semibold + foreground color (bukan muted) di atom
  `Label` — berlaku universal untuk semua form ERP, tidak hanya item.
  Optional label tetap regular muted.
- Helper text untuk field ambigu: Spesial, Tipe, Metode HPP, BKP,
  Harga berlaku s.d.
- Placeholder lookup field: "Cari xxx…" → "Pilih xxx…" (verb action
  konsisten dgn pattern dropdown).
- Field "Berlaku s.d" → "Harga berlaku s.d" + helper text agar
  konteks (masa berlaku harga, bukan masa berlaku item) jelas.

**Atomic refactor pendukung:**
- `components/molecules/form-error-summary.tsx` — molecule baru
- `components/molecules/bulk-action-bar.tsx` — extract dari organism
- `components/molecules/audit-modal.tsx` — extract dari organism
- `components/pages/items-form-parts.tsx` — helper Section/Lookup/
  Num/YesNo + visibility rules untuk items-form-fields
- `lib/use-modal-shortcuts.ts` — hook keyboard shortcuts reusable
- `lib/items-code-generator.ts` — generator client-side auto-code

**Konsekuensi vibe coding:**
- Membuat form master baru dgn banyak field (>20)? Pertimbangkan
  pattern Cepat/Lengkap + side-nav layout. Pola sudah ada di items;
  bisa di-port ke entitas lain bila kebutuhannya sama.
- Membuat row action baru di list? Reuse pola Edit → Duplikat →
  Riwayat → (sep) → Hapus di kebab menu. Tambah aksi entitas-spesifik
  di antara Duplikat dan Riwayat.

---

### 2.26 Info icon + popover untuk enum berbisnis-logic (2026-05-28)

Field enum dgn semantik bisnis non-trivial (mis. `ErpItemType` —
INVENTORY/SERVICE/CONSUMABLE/ASSET/NON_INVENTORY) **wajib** punya jalur
"cek perbandingan" tanpa keluar form. Pola standar = **info icon di label
+ Radix Popover** berisi tabel perbandingan sifat + contoh kasus, plus
**helper text dinamis** di bawah Select yang menampilkan trait kunci dari
nilai terpilih (ikut berubah saat user ganti pilihan).

Implementasi pertama = item form (§2.25):
- Molecule [`components/molecules/item-type-info.tsx`](components/molecules/item-type-info.tsx)
  — exports `ItemTypeInfoButton({ currentType })` + helper `getItemTypeTraits(type)`.
  Popover highlight kolom & contoh row yang match `currentType`.
- Section Klasifikasi di [`items-form-fields.tsx`](components/pages/items-form-fields.tsx)
  pakai grid manual (bukan `FormField`) supaya icon button bisa berdiri di
  **luar `<label>`** — klik icon tidak menyambar fokus ke Select.

Kapan pakai pola ini (kriteria):
- Enum dgn ≥ 3 nilai yang punya **konsekuensi sistem berbeda** (drive logika
  akuntansi, stok, workflow), bukan sekadar label kosmetik.
- User awam (bukan dev/admin) bakal sering bingung memilih → butuh
  comparison reference yang on-demand.

Kalau cukup dijelaskan satu kalimat helper text statik → tetap pakai
`help` prop `FormField` (jangan pasang popover sekadar dekoratif).
Kandidat untuk diberi pola ini di masa depan: `ErpCostingMethod`
(AVG/FIFO/STD), status workflow approval, role/permission picker.

---

### 2.27 Master `code` = tanpa entity-scope prefix (2026-05-28)

Kolom `code` master ERP **tidak boleh** dipayungi prefix yang sekadar
mengulang entity scope-nya (mis. `CAT-XX` untuk item category, `BRD-XX`
untuk brand, `UNT-XX` untuk unit). Scope sudah implied oleh tabel & UI
breadcrumb — prefix = noise.

Aturan:

- Master code = bare semantic code (mis. `ZN` untuk Zinc, `MM` untuk Metal
  Misc). Bila legacy punya `legacyCode` 2–4 huruf yang stabil, pakai
  langsung sebagai `code`.
- Prefix tetap **valid** kalau:
  - Multi-segment semantik (mis. `RM-FB` = Raw Material → Fabric — segmen
    pertama bermakna sub-tipe, bukan entitas).
  - Namespace isolasi dataset (mis. `DUMMY-0001` di `seed-erp-md-dummy.ts`
    untuk memisahkan dummy dari real data — segmen `DUMMY` adalah
    dataset-tag, bukan entity-scope tag).
- Saat menulis seed/migration baru: jangan re-introduce pola `<ENTITY>-XX`.
  Auto-code generator (mis. `lib/items-code-generator.ts` untuk item code
  `ITM-/SVC-/CNS-` — itu **item type marker**, beda kasus dgn category).

Migrasi pendukung: `20260528_001_erp_strip_cat_prefix_item_categories`
(strip `CAT-` dari 30 row `md_item_categories.code`; FK aman karena semua
referensi pakai `categoryId` BigInt). Seed `seed-erp-items-real.ts` juga
disinkron — 28 entry `CATEGORIES` sekarang bare code (`AB`, `AL`, ... `ZN`).

Garment vertical (`db-design/seed-data-garment.md`) **tidak** dihabisi
prefiks-nya karena belum dieksekusi & vertical-spesifik — saat slicing
garment, terapkan aturan §2.27 ini.

---

### 2.28 `SearchSelect` modal — stale-while-loading saat ganti halaman (2026-05-28)

Modal `SearchSelect` (`components/molecules/search-select-modal.tsx` +
`use-search-select.ts`) **wajib** memakai pola **stale-while-loading** saat
user menavigasi halaman dgn `←`/`→`:

- Baris hasil halaman sebelumnya **tetap di-render** selama `loading=true`,
  bukan diganti satu baris "Memuat…" yang membuat tbody kolaps & modal
  "berkedip" (collapse → expand) tiap ganti halaman.
- `<tbody>` saat loading dgn data existing → `opacity-50 pointer-events-none
  transition-opacity duration-150` + `aria-busy=true` (a11y).
- Header count `· {total}` **stabil** lintas-halaman (`tabular-nums`) —
  **dilarang** swap ke `· Memuat…` saat loading: `total` tidak berubah
  antar halaman, jadi swap text bikin width goyang & berkedip. Cukup dim
  tbody sebagai sinyal loading.
- Highlight focus baris (`isFocused`) di-suppress saat `loading` — supaya
  outline tidak nyangkut di baris stale yang sebentar lagi diganti.
- `tableActive` **tidak** di-reset di efek fetch maupun di handler
  `ArrowLeft/Right` — user yang sedang navigasi tabel tetap di mode tabel
  setelah halaman berikutnya muncul. Reset `tableActive=false` hanya di
  `openModal` (initial open) supaya search input yang fokus duluan.
- Fallback "Memuat…" full-body **hanya** dipakai saat truly empty
  (`loading && displayOptions.length === 0`, mis. saat modal baru dibuka
  belum ada data sama sekali).

Konsekuensi vibe coding: kalau menambah list modal-style baru di web-erp,
**dilarang** pola "replace tbody dgn loader row" untuk transisi halaman —
clone pola di atas. List page biasa (`SimpleMasterPage`) tetap pakai
`ErpListLayout` (§2.9) yang punya state loading khusus.

---

### 2.29 Search semantics list endpoint = `code` exact, `name` LIKE (WAJIB, 2026-05-28)

Setiap service list ERP yang menerima `query.search` **wajib** memakai
semantik: **`code` exact-match (case-insensitive)**, **`name` partial
(`contains`, case-insensitive)**. Berlaku untuk semua jalur (SearchSelect
modal & list page search `/`) — backend endpoint sama, jadi satu sumber.

Pola kanonik (Prisma):

```ts
if (query.search?.trim()) {
  const q = query.search.trim();
  where.OR = [
    { code: { equals: q, mode: 'insensitive' } },
    { name: { contains: q, mode: 'insensitive' } },
  ];
}
```

Alasan: `code` adalah identifier unik (mis. `BR-001`, `ITM-MM`, `4.1.001`)
— user yang ngetik kode biasanya tahu persis kodenya & ingin **landing
satu hit**. Partial match (`contains`) di kode → hasil keruh (`BR` match
ratusan `BR-xxx`), bikin SearchSelect tidak deterministik. Sebaliknya
`name` adalah teks bebas → partial WAJIB (user jarang ingat nama persis).

Berlaku **mass refactor 2026-05-28** ke 55 service ERP yang punya pola
`code OR name` search. **Pengecualian sah** (dipertahankan `contains` —
bukan "code"):
- `md_items.barcode` (`erp-items.service.ts`) — barcode bukan kode entitas;
  semantik scan/partial belum dirombak (eskalasi terpisah bila perlu).
- `md_accounts.alias` (`erp-accounts.service.ts`) — alias = teks bebas.

Saat membuat service ERP baru dengan search: **wajib** pakai pola di atas
sejak awal. **Dilarang** re-introduce `{ code: { contains: ... } }` di
service baru.

---

### 2.30 `SearchSelect` inline-search — exact code match auto-pilih (2026-05-28)

Pelengkap §2.29. Saat user mengetik di input `SearchSelect` lalu commit
(blur ke luar input atau tekan Enter), `useSearchSelect` melakukan fetch
satu kali (`loadOptions(text, 1, limit)`) dan memilih jalur berikutnya:

1. **0 hasil** → reset value + buka modal dgn query (user lihat "Tidak ada hasil").
2. **Ada tepat 1 row dgn `code` exact-match (case-insensitive)** → auto-pilih
   row itu, **walaupun total `results.length > 1`** (mis. response 13 row krn
   "um" juga LIKE-match `name`, tapi `code = "UM"` cuma 1 → pilih `UM`).
3. **1 hasil saja** (tanpa exact code match) → auto-pilih row itu.
4. **>1 hasil tanpa exact code match** → buka modal supaya user pilih manual.

Helper `pickExactCodeMatch(results, query)` di
[`components/molecules/use-search-select.ts`](components/molecules/use-search-select.ts)
adalah SSOT logika ini — dipakai di `handleSingleBlur` dan handler Enter
`handleSingleKeyDown`. Defensive: kalau ada >1 row dgn code exact (tidak
seharusnya — code unique), tetap buka modal (`exact.length === 1` only).

Alasan: backend `code` sudah exact-match (§2.29), tapi response tetap berisi
row tambahan dari `name LIKE`. Tanpa shortcut ini, user yang ngetik kode
yang sudah ia hafal masih harus klik modal 1× lagi padahal kandidat-nya
jelas — beat seluruh keuntungan "search-by-code = exact".

---

### 2.30b Loader picker — `label` = nama saja, kode di field `code` (2026-05-31)

Untuk semua loader `SearchSelect` (termasuk akun coded), opsi **wajib**
memisahkan `code` dan `label`:

- `code` → kolom KODE modal + di-prepend `useSearchSelect.optLabel` jadi
  display trigger `"{code} - {name}"` (konvensi akuntansi).
- `label` → kolom NAMA modal = **nama saja**, tanpa prefix kode (KODE sudah
  punya kolom sendiri; menampilkan kode lagi di NAMA = redundan).

`loadAccountOptionsCoded` & `loadCashAccountOptionsCoded`
([`components/pages/items-form-lookups.ts`](components/pages/items-form-lookups.ts))
dulu set `label = "{code} - {name}"` → kolom NAMA dobel kode **dan** trigger
jadi `"{code} - {code} - {name}"` (optLabel prepend lagi). Diperbaiki: set
`label = x.name` saja. **Jangan** embed kode ke `label` di loader baru —
`optLabel` yang urus prefix kode untuk trigger.

---

### 2.31 Format angka dinamis dari `sys_settings` (2026-05-28)

Format angka **tidak** lagi hardcode `id-ID`. Pakai 3 setting global di
`sys_settings` group `number-format`:

- `number_thousands_sep` (string: `.` / `,` / ` ` / `'` / `""` tanpa pemisah)
- `number_decimal_sep` (string: `,` / `.`)
- `number_decimals` (integer 0–6 — default digit desimal)

**Backend SSOT** = [`apps/api-gateway/src/erp-settings/number-format.ts`](../api-gateway/src/erp-settings/number-format.ts):
`buildNumberFormat(thousandsSep, decimalSep, decimals)` → `{thousandsSep,
decimalSep, decimals, example}`. Validasi: `thousandsSep` ≠ `decimalSep`,
`decimals` 0–6. Endpoint: `GET /erp/settings/number-format` +
`PUT /erp/settings/number-format` (guard `ErpJwtAuthGuard`). **Tidak ada
lock-after-data** (beda dgn account-code-format §2.24) — ini display
formatting, ubah kapan saja, semua tampilan ikut refresh.

**Frontend:**

- [`lib/format.ts`](lib/format.ts) — module-level cache + `useNumberFormat()`
  hook + helper `formatNumber(value, decimals?)` / `formatRupiah(value)` /
  `formatQty(value)`. Helper lama tetap kompatibel (delegate ke
  `formatNumber`). Default fallback `{ '.', ',', 0 }` saat API gagal.
- [`lib/format.ts`](lib/format.ts) juga export `formatRawForDisplay(raw,
  fmt, decimals?)` + `parseDisplayToRaw(display, fmt)` — pure helpers untuk
  live mask di input.
- [`components/molecules/num-input.tsx`](components/molecules/num-input.tsx)
  (`NumInput`) — input numerik dgn live thousand-separator masking +
  caret restore via digit-index. Value = raw canonical (`12345` / `12345.5`).
- `NumField` di [`items-form-parts.tsx`](components/pages/items-form-parts.tsx)
  sekarang pakai `NumInput` (semua field numerik items-form ikut format).
- Halaman dedicated `/admin/number-format` ([`number-format-page.tsx`](components/pages/number-format-page.tsx))
  di group `M0.SYS` (Administrator → System) — 3 dropdown/input + preset
  cepat (id-ID, id-ID+2 desimal, en-US, en-US+2 desimal, plain) + preview
  live. Setelah PUT sukses → `invalidateNumberFormatCache(updated)` supaya
  semua subscriber `useNumberFormat()` re-render dgn format baru.

**Saat membuat input numerik baru**: pakai `<NumInput>` (atau `NumField` di
items-form). **Dilarang** `<Input type="number">` atau `<Input
inputMode="decimal">` mentah untuk field qty/harga — tidak ikut format
global. `decimals?` prop bisa override default per field (mis. `decimals={2}`
untuk harga, biarkan undefined untuk qty integer ikut setting global).

**Saat memformat angka di tabel/summary**: pakai `formatNumber/formatRupiah/
formatQty` dari `lib/format.ts` — sudah otomatis ikut setting global (§2.9
"Format Angka" disempurnakan: tidak lagi hardcode locale id-ID).

**Migrasi seed:** key tunggal lama `sys_settings.key='number_format'` di
group `format` (value literal `'1.000,00'`, never dipakai) **dihapus
otomatis** oleh `prisma/seed-erp.ts` (`deleteMany` sebelum upsert) — clean,
non-destructive. Jalankan `npm run db:seed` setelah pull untuk hidupkan
3 key baru + menu `/admin/number-format`.

---

### 2.39 Date field = `<DateInput>` (popover day-picker) + format dinamis (2026-05-31)

**Masalah:** semua field tanggal pakai native `<input type="date">` →
placeholder `dd/mm/yyyy` abu-abu (browser-controlled, tidak bisa di-custom)
+ chrome native yang tidak konsisten dgn design system. User minta UX
placeholder tanggal diperbaiki.

**Keputusan:** ganti **semua** native `<Input type="date">` di form/filter
dengan komponen reusable [`components/ui/date-input.tsx`](components/ui/date-input.tsx)
(`DateInput`) — Radix Popover + `react-day-picker` (mode `single`, locale id)
+ `date-fns`, sejajar pola `date-range-picker.tsx`.

- **Empty state** = placeholder lembut `"Pilih tanggal"` (bukan `dd/mm/yyyy`).
- **Filled state** = tanggal diformat per setting global + tombol clear (X).
- **Kontrak:** `value` = ISO string `YYYY-MM-DD`; `onChange(v: string)` terima
  **string ISO langsung** (bukan event). Props opsional: `id`, `name`,
  `disabled`, `aria-invalid`, `placeholder`, `className`.
- **Bisa diketik manual (2026-05-31):** field = `<input type="text">` editable,
  bukan tombol read-only. User boleh **mengetik** tanggal langsung (tidak wajib
  lewat day-picker); ikon kalender hanya membuka popover sebagai alternatif.
  Draft teks di-commit saat **blur** / **Enter** (`Escape` membatalkan draft).
  Parsing toleran via `parseDisplayDate(text, fmt)` di `lib/date-format.ts`:
  coba format aktif dulu, lalu fallback umum (`5/5/2026`, `05-05-2026`,
  `2026-05-05`, `5 Mei 2026`). Input invalid → revert ke nilai valid terakhir;
  kosong → clear. Format token & day-picker tidak berubah.
- **Karakter diketik dibatasi (2026-05-31):** hanya **digit + separator format
  aktif** yang lolos (sanitizer di `onChange`); selain itu di-strip. Untuk
  `DD/MM/YYYY` → cuma angka & `/`. Separator diturunkan dari token (non-huruf),
  jadi format `DD-MM-YYYY`/`YYYY-MM-DD` otomatis izinkan `-`. Format ber-nama
  bulan (`MMM`/`MMMM`) tambahan izinkan huruf+spasi.

**Format tampilan tanggal dinamis dari `sys_settings`** (sejajar §2.31):

- Key tunggal `system/format/date_format` (sudah ada di seed, value
  `DD/MM/YYYY`). Token moment-style; preset terbatas (`DD/MM/YYYY`,
  `DD-MM-YYYY`, `MM/DD/YYYY`, `YYYY-MM-DD`, `DD MMMM YYYY`, `D MMM YYYY`).
- **Backend SSOT** = [`apps/api-gateway/src/erp-settings/date-format.ts`](../api-gateway/src/erp-settings/date-format.ts):
  `buildDateFormat(token)` → `{format, example}`, validasi token ∈ preset.
  Endpoint `GET`/`PUT /erp/settings/date-format` (guard `ErpJwtAuthGuard`),
  reuse tabel `erpSetting` (tidak ada group/migrasi baru).
- **Frontend** [`lib/date-format.ts`](lib/date-format.ts): cache module-level
  + `useDateFormat()` hook + `formatDate(iso, fmt?)` (token→date-fns pattern
  via `tokenToPattern`) + `parseIsoDate` / `toIsoDate`. Default fallback
  `DD/MM/YYYY` saat API gagal.
- Halaman dedicated `/admin/date-format`
  ([`date-format-page.tsx`](components/pages/date-format-page.tsx)) di group
  `M0.SYS` — preset clickable + preview live; setelah PUT →
  `invalidateDateFormatCache(updated)`.

**Aturan:** field tanggal baru **wajib** `<DateInput>` (atau `formatDate()`
untuk display di tabel) — **dilarang** native `<input type="date">` mentah.
**Pengecualian:** inline grid-cell editor
([`grid-cell-editor.tsx`](components/molecules/grid-cell-editor.tsx)) tetap
native `type="date"` (konteks editor sel spreadsheet autofocus/keyboard,
popover mengganggu).

**`date-range-picker.tsx` ikut aturan ini (2026-05-31):** dua native
`type="date"` di rentang sudah diganti `<input type="text">` editable
(sub-komponen internal `EditableDate`) yang **reuse pola `DateInput`** —
display via `formatDate` per `sys_settings`, ketik-manual + parse via
`parseDisplayDate`, sanitizer karakter, commit on blur/Enter. **Placeholder
`dd/mm/yyyy` browser dihapus** → `"Mulai"` / `"Selesai"`. Popover kalender
tetap mode `range`. Bukan lagi pengecualian.

**Seed:** menu `/admin/date-format` (`M0.SYS.DATE-FORMAT`) ditambah di
`prisma/seed-erp.ts`. Jalankan `npm run db:seed` (idempoten) setelah pull
agar item muncul di sidebar dinamis (route tetap reachable via URL/palette
tanpa reseed).

---

### 2.32 Item — tab Harga paritas MyERP+ (price tiers 1–10) (2026-05-30)

Section **Harga** di form item (§2.25) di-expand ke paritas tab "Harga"
MyERP+: 10 tingkat harga jual + diskon per tingkat. Mengakhiri "deferred
price tiers 2–10" dari §2.23.

**Model data = tabel anak ternormalisasi** (keputusan user 2026-05-30):
- `md_item_prices` (model `ErpItemPrice`): `itemId` FK (cascade), `level`
  (1–10), `price` Decimal(19,4), `discountPercent` Decimal(9,4), audit cols.
  `@@unique([itemId, level])`. **Bukan** kolom flat `salePrice1..10` —
  sejalan prinsip ternormalisasi + nyambung ke `md_partners.salesTier`
  (legacy `cctingkatjual`) untuk logika pricing modul Sales nanti.
- `md_items.purchaseDiscount` Decimal(9,4) — "Diskon Pembelian" (persen).
- Migrasi `20260530_001_erp_item_price_tiers` (additive, 0 DROP). **Hand-written
  SQL + `prisma migrate deploy`** (bukan `migrate dev`) — `migrate dev` gagal di
  shadow DB karena migrasi clinic lama tidak replay bersih; DB live sendiri
  `up to date`. Pola ini berlaku untuk semua migrasi ERP berikutnya.

**Pemetaan field MyERP+ → schema (jangan bikin kolom redundan):**
- "Harga Beli Terakhir" → `purchasePrice` (sudah ada).
- "Hpp rata-rata" (readonly) → `averageCost` (computed sistem; field form
  read-only, **tidak** dikirim di payload).
- "Hpp Update" → `standardCost` (manual/standard HPP, legacy `bhpp`) — **bukan**
  kolom baru.
- "Harga Jual 1..10" / "Diskon Jual 1..10" → `md_item_prices` rows.
- `md_items.salePrice` tetap ada = **cache denormalized level-1** (di-set dari
  `prices[level=1].price` saat simpan; dibaca modul lain). SSOT 10 tier =
  `md_item_prices`.

**Backend:** DTO `ItemPriceDto` (level 1–10 + price/discountPercent string),
`prices?: ItemPriceDto[]` di create DTO (`@ValidateNested`). Service
`buildPriceRows()` skip level yang price+diskon kosong; create = nested
`prices.create`; update = `prices: { deleteMany: {}, create }` (replace
penuh). `ITEM_INCLUDE.prices` + `mapItem` stringify Decimal. **Cache
`md_items.salePrice` di-derive server-side** dari tier level-1 via
`deriveSalePriceFromTiers()` (di `erp-items.mappers.ts`), di-set setelah
`buildDecimalData` sehingga **override** `salePrice` kiriman client — cache
selalu sinkron walau caller (mis. API mentah) tak mengirim `salePrice`. Blank
L1 price → cache tidak disentuh.

**Frontend:** `ItemFormData.salePrices`/`saleDiscounts` = `string[10]` (index
0 = level 1) + `purchaseDiscount` + `averageCost` (display-only). `fromItem`
expand sparse rows → 10 slot (`tierColumn`); `toItemPayload` collapse →
sparse rows (`buildPriceTiers`, skip kosong) + `salePrice = salePrices[0]`.
Layout = 2-kolom paired (Harga Jual N kiri ‖ Diskon Jual N kanan), buy-side
(Harga Beli/Diskon Pembelian/HPP) di atas. `NumField` dapat prop `readOnly`
untuk HPP Rata-rata.

---

### 2.33 Item — tab Akun paritas MyERP+ (8 akun GL) (2026-05-30)

Section **Akuntansi** di form item (§2.25) di-expand ke paritas tab "Akun"
MyERP+: dari 3 akun → **8 akun GL** (urutan legacy). Tambahan 5 akun:
Retur Penjualan, Diskon Penjualan, Retur Pembelian, Diskon Pembelian,
Konsinyasi (Persediaan/Penjualan/HPP sudah ada).

- **`md_items` kolom baru** (semua nullable BigInt → `md_accounts`):
  `salesReturnAccountId`, `salesDiscountAccountId`, `purchaseReturnAccountId`,
  `purchaseDiscountAccountId`, `consignmentAccountId`. Relasi `ItemSalesReturnAcct`
  dst di `ErpItem` + back-pointer di `ErpAccount`. Migrasi
  `20260530_002_erp_item_legacy_gl_accounts` (additive, 0 DROP, FK `ON DELETE
  SET NULL`). Hand-written SQL + `migrate deploy` (pola §2.32).
- **Wajib hanya saat `type=INVENTORY`** (keputusan user 2026-05-30). DB kolom
  tetap nullable (aman untuk 100+ item lama + tipe SERVICE/NON_INVENTORY yang
  tak butuh akun ini). Required di-enforce **FE-only** lewat `validateItem`
  (`REQUIRED_INVENTORY_ACCOUNTS` + `requiredWhenInventory`) — legacy menandai
  semua 8 wajib, tapi modern kita kondisikan ke tipe stok. Backend DTO semua
  optional.
- **UX bridge:** akun GL tidak terlihat di mode entri **Cepat** (§2.25). Kalau
  validasi akun gagal saat simpan di Cepat, `items-form-fields.tsx` auto-switch
  ke **Lengkap** + buka section Akuntansi (efek `accountError && mode==='cepat'`)
  supaya error bisa diperbaiki. Label section pakai nama legacy ringkas
  (Persediaan, Penjualan, Retur Penjualan, …) bukan "Akun Persediaan".

---

### 2.34 Item — section Lokasi multi-gudang (placements) (2026-05-30)

Section **Lokasi** baru di form item (§2.25), paritas tab "Lokasi" MyERP+
(`m1_item_location_warehouse`): per item, daftar baris **(Gudang, Lokasi)** =
penempatan item di banyak gudang/spot. Pelengkap `defaultWarehouseId`/
`defaultLocationId` yang tetap single default.

- **Data model = junction ternormalisasi `md_item_placements`** (model Prisma
  **`ErpItemPlacement`**, bukan `ErpItemLocation`): `itemId` FK (cascade),
  `warehouseId` FK → `md_warehouses` (**Gudang**), `locationId` FK →
  **`md_item_locations`** (**Lokasi** = master named-spot legacy, `code`/`name`/
  `warehouseId`), audit cols. `@@unique([itemId, warehouseId, locationId])`.
  **Penting (keputusan user 2026-05-30):** "Lokasi" = master spot
  `md_item_locations` (sudah punya modul + halaman + seed sendiri), **bukan**
  `md_locations` (itu level cabang/site). Nama tabel `md_item_locations` sudah
  dipakai master spot → junction pakai nama `md_item_placements`.
- Migrasi `20260530_003_erp_item_locations` (CREATE `md_item_placements`,
  additive 0 DROP) + koreksi `20260530_004_erp_item_placement_location_fk`
  (repoint FK `location_id` dari draft `md_locations` → `md_item_locations`;
  draft awal salah target). Hand-written SQL + `migrate deploy` (pola §2.32).
- **Backend:** DTO `ItemLocationDto` (`warehouseId`+`locationId` string),
  `locations?: ItemLocationDto[]` di create DTO. Relasi Prisma di service =
  `placements` (create / `deleteMany`+create saat update); `buildLocationRows`
  skip baris tak-lengkap + **dedupe** pasangan. `mapItem` memetakan
  `placements` → field FE `locations` (`{warehouseId, locationId, warehouse,
  location}`). Helper murni (include graph + builders + `mapItem`) di-extract
  ke **`erp-items.mappers.ts`** supaya service tetap < 400 baris (§3).
- **Frontend:** `ItemFormData.locations: ItemLocationFormRow[]` (punya `key`
  stabil client agar display `SearchSelect` tahan add/remove baris — tidak
  dikirim). Section `lokasi` di side-nav **Lengkap**, **hanya untuk tipe
  stockable** (INVENTORY/CONSUMABLE/ASSET), placement: setelah Inventory.
  Editor multi-baris = organism
  [`components/pages/items-form-locations.tsx`](components/pages/items-form-locations.tsx)
  (tabel No · Gudang · Lokasi · hapus + tombol "Tambah"). Loader Lokasi =
  `loadItemLocationOptions` (master spot), **bukan** `loadLocationOptions`.
  `toItemPayload` drop baris yang Gudang/Lokasi belum lengkap.

**⚠ Naming gotcha — `md_item_locations` ≠ `md_item_placements`** (digabung dari bekas §2.34 "Naming reservation"):

**`ErpItemLocation` / `md_item_locations` = master "Item Location" legacy**
(code/name/warehouse, modul `erp-item-locations/` + halaman + data ada).
**JANGAN** pakai nama ini untuk junction "tab Lokasi" item. Junction per-item
(Gudang + Lokasi) = **`ErpItemPlacement` / `md_item_placements`** (relasi
`ErpItem.placements`, migrasi `20260530_003`). Bug history: fitur tab Lokasi
sempat mendefinisikan ulang `model ErpItemLocation @@map("md_item_locations")`
→ skema invalid (duplicate model) + migrasi `CREATE TABLE IF NOT EXISTS`
jadi no-op (tabel master sudah ada) → **semua** operasi item gagal dengan
`PrismaClientValidationError` (filter `all-exceptions.filter.ts` menamai-nya
"Invalid query parameters" — menyesatkan, bukan soal query param). Resolusi:
rename junction ke `ErpItemPlacement` + relasi field `placements`. **Catatan
ops:** tiap rename schema item **wajib** `prisma generate` **di dalam container**
+ restart (named-volume `api_gateway_node_modules` ≠ host; `nest --watch`
recompile TS tapi **tidak** regen Prisma client → client basi = error di atas).

---

### 2.36 Item — tab Distributor (item-supplier list) (2026-05-31)

Section **Distributor** baru di form item (§2.25), paritas tab "Distributor"
item master MyERP+ (`m1_item_supplier`): per item, daftar baris **partner
distributor/supplier**. Tabel legacy hanya menampilkan **Kode + Nama** partner →
modern kita simpan referensi partner saja (tanpa kolom catatan/SKU; keputusan
user 2026-05-31). **Coexist** dengan field tunggal `primarySupplierId` di section
**Supplier**: yang single = supplier utama/default; tab Distributor = daftar
distributor/supplier tambahan.

- **Data model = junction ternormalisasi `md_item_distributors`** (model Prisma
  **`ErpItemDistributor`**): `itemId` FK (cascade), `partnerId` FK → `md_partners`,
  `sortOrder` (jaga urutan tampil legacy), audit cols. `@@unique([itemId,
  partnerId])` — satu partner tak duplikat per item. Relasi back-pointer
  `ErpPartner.itemDistributors`.
- Migrasi `20260531_002_erp_item_distributors` (CREATE `md_item_distributors`,
  additive 0 DROP; FK item cascade, partner `ON DELETE RESTRICT`). Hand-written
  SQL + `migrate deploy` (pola §2.32). **Catatan ops:** `prisma generate` **di
  dalam container** + restart wajib setelah schema berubah (lihat §2.34).
- **Backend:** DTO `ItemDistributorDto` (`partnerId` string `@IsNotEmpty`),
  `distributors?: ItemDistributorDto[]` di create DTO (inherited di update via
  `PartialType`). `buildDistributorRows` (di `erp-items.mappers.ts`) skip partner
  kosong + **dedupe by partner** + isi `sortOrder` urut index; create = nested
  `distributors.create`, update = `distributors: { deleteMany: {}, create }`
  (replace penuh, pola placements/prices). `ITEM_INCLUDE.distributors` +
  `mapItem` memetakan ke field FE `distributors` (`{partnerId, partner}`),
  `orderBy: [{ sortOrder }, { id }]`.
- **Frontend:** `ItemFormData.distributors: ItemDistributorFormRow[]` (punya `key`
  stabil client agar display `SearchSelect` tahan add/remove baris — tidak
  dikirim). Section `distributor` di side-nav **Lengkap** (`available: true`,
  **tidak** dibatasi tipe stockable — distributor relevan untuk semua tipe item),
  urutan setelah Supplier. Editor multi-baris = organism
  [`components/pages/items-form-distributors.tsx`](components/pages/items-form-distributors.tsx)
  (tabel No · Distributor · hapus + tombol "Tambah"). Loader =
  `loadSupplierOptions` — partner **difilter `isSupplier=true`** (keputusan user
  2026-05-31), bukan semua partner. `toItemPayload` drop baris yang partner belum
  dipilih.

---

### 2.37 Item — tab Branch multi-cabang (item-branch) (2026-05-31)

Section **Branch** baru di form item (§2.25), paritas tab "Branch" item master
MyERP+: per item, daftar baris **(Cabang, Cost Center)** = penempatan item di
banyak cabang dengan cost center per cabang. **Coexist** dengan field tunggal
`branchId` + `costCenterId` di section **Dimensi GL** (keputusan user
2026-05-31): yang single tetap = cabang/cost center **home/default**; tab Branch
= daftar penempatan tambahan. **Cost Center wajib** per baris (Cabang + Cost
Center sama-sama wajib agar baris tersimpan).

- **Data model = junction ternormalisasi `md_item_branches`** (model Prisma
  **`ErpItemBranch`**): `itemId` FK (cascade), `branchId` FK → `md_branches`
  (**Cabang**), `costCenterId` FK → `md_cost_centers` (**Cost Center**), audit
  cols. `@@unique([itemId, branchId])` — satu cost center per cabang per item.
  Relasi back-pointer `ErpBranch.itemBranches` + `ErpCostCenter.itemBranches`.
- Migrasi `20260531_003_erp_item_branches` (CREATE `md_item_branches`, additive
  0 DROP; FK item cascade, cabang/cost center `ON DELETE RESTRICT`). Hand-written
  SQL + `migrate deploy` (pola §2.32). **Catatan ops:** `prisma generate` **di
  dalam container** + restart wajib setelah schema berubah (lihat §2.34).
- **Backend:** DTO `ItemBranchDto` (`branchId`+`costCenterId` string, keduanya
  `@IsNotEmpty`), `branches?: ItemBranchDto[]` di create DTO (inherited di update
  via `PartialType`). `buildBranchRows` (di `erp-items.mappers.ts`) skip baris
  tak-lengkap + **dedupe by branch**; create = nested `branches.create`, update =
  `branches: { deleteMany: {}, create }` (replace penuh, pola placements/prices).
  `ITEM_INCLUDE.branches` + `mapItem` memetakan ke field FE `branches`
  (`{branchId, costCenterId, branch, costCenter}`).
- **Frontend:** `ItemFormData.branches: ItemBranchFormRow[]` (punya `key` stabil
  client agar display `SearchSelect` tahan add/remove baris — tidak dikirim).
  Section `branch` di side-nav **Lengkap** (`available: true`, **tidak**
  dibatasi tipe stockable — cabang relevan untuk semua tipe item), urutan
  setelah Distributor. Editor multi-baris = organism
  [`components/pages/items-form-branches.tsx`](components/pages/items-form-branches.tsx)
  (tabel No · Cabang · Cost Center · hapus + tombol "Tambah"). Loader =
  `loadBranchOptions` + `loadCostCenterOptions`. `toItemPayload` drop baris yang
  Cabang/Cost Center belum lengkap.

---

## § Finance (M2) menu parity — koreksi label + folder Laporan (2026-05-31)

Audit menu **Keuangan ▸ Transaksi** legacy MyERP+ vs seed kita (`prisma/seed-erp.ts`
grup `M2`). Legacy "Transaksi" = 11 item: Kas Masuk (CR), Kas Keluar (CD), Bank
Masuk (RM), Bank Keluar (SM), Jurnal Umum (GJ), Giro Masuk/Keluar (RG/SG), Giro
Masuk/Keluar Batal (RGC/SGC), Saldo Awal Coa (CB), Buku Besar (GL = laporan).

**Koreksi label seed (kontradiksi legacy + dok desain `entities-m2-finance.md`):**
- **CB** legacy = **Saldo Awal Coa / Opening Balance** (→ `JournalType.OPENING_BALANCE`),
  bukan "Cash/Bank Transfer". Seed lama salah label → diperbaiki jadi
  `M2.TX.OPENING-BALANCE` "Opening Balance (CoA)" `/finance/opening-balances`.
- **RM/SM** legacy = **Bank Masuk/Bank Keluar**; label "Receipt Memo/Send Memo"
  membingungkan → diganti **Bank Receipt** (`RM`) / **Bank Payment** (`SM`),
  path `/finance/bank-receipts` & `/finance/bank-payments`.
  > **⚠️ Koreksi model RM (2026-05-31, lihat § Bank Masuk di bawah):** rencana
  > awal memetakan RM → `fin_ar_receipts` (AR settlement). Setelah lihat layar
  > legacy "Bank Masuk (RM)" (header + baris kontra CoA + Total, identik Kas
  > Masuk), keputusan dengan user: **RM = twin Kas Masuk** di
  > `fin_cash_bank_transactions` (`kind=BANK`, `direction=RECEIPT`), **bukan**
  > `fin_ar_receipts`. `fin_ar_receipts` dicadangkan untuk settlement AR murni
  > bila dibutuhkan, bukan untuk path `/finance/bank-receipts`.
- **BD** (Bank Disbursement) & **AJ** (Adjustment Journal) = tambahan modern,
  **tak ada** di menu Transaksi legacy ini — dipertahankan (didukung skema).

**Folder Laporan (M2.RPT) ditambah.** Legacy MODULEID=2 (`Report.vb`) punya ~150
varian laporan; di seed kita di-kanonkan jadi parent report yang dipenuhi
`fin_ledger_entries`/`fin_budget_realizations`/`fin_giros`: General Ledger,
Trial Balance, Balance Sheet, Income Statement, Cash Flow, Daily Cash & Bank,
AR Card, AR Aging, AP Card, AP Aging, Giro Maturity, Budget vs Realization
(legacyCode = `2-<MENUID>`). Sebelumnya M2.RPT cuma punya General Ledger.

**Cakupan DB:** seluruh 11 item legacy ter-cover oleh 31 tabel `fin_*` (jauh di
atas legacy). Yang belum: **frontend M2 belum dibangun** (path `/finance/*`
ter-seed tapi belum ada entry di `ERP_PAGES`/`ERP_ROUTE_META`).

**Drift live DB (perlu prune).** `sys_menus` di DB akumulasi entri M2 usang dari
iterasi seed lama (seed tak punya prune): `M2.TX.CASHBANK-TRANSFER`,
`M2.TX.RECEIPT-MEMO`, `M2.TX.SEND-MEMO` (digantikan koreksi di atas) + duplikat
prefix `/keuangan/` lama: `M2.TX.AP-PAYMENT`, `M2.TX.AR-RECEIPT`, `M2.TX.GIRO`,
`M2.TX.JOURNAL`. FK `adm_role_menus.menu_id` = `ON DELETE CASCADE`, jadi prune
baris `sys_menus` aman (role-map ikut terhapus). Re-seed menambah kode baru tapi
**tidak** menghapus yang usang — prune manual diperlukan.

## §2.35 — Item master "Atribut" tab (legacy MyERP+ parity) (2026-05-31)

Menambahkan tab **Atribut** ke form item (`/app/master/items`), meniru tab
"Atribut" legacy MyERP+ dengan UI/UX dimodernkan (amati-tiru-modifikasi).

**Keputusan dengan user:**
- **Model lookup = reuse master existing + tambah minimal** (BUKAN tabel generik
  `md_item_attributes`). 6 master atribut sudah ada (Warna/Merk/Ukuran/Material/
  Section/Desainer) dengan kolom FK di `md_items` tapi belum punya relasi Prisma →
  relasi di-wire sekarang. **Vendor → reuse `md_partners`**. **Satuan Lapangan →
  reuse `md_units`** (relasi `ItemFieldUnit`; `baseUnit` dinamai `ItemBaseUnit`).
  Alasan menolak tabel generik: destruktif (drop 6 tabel+FK), langgar norma
  migrasi additive §2.32 (0 DROP), buang kerja yang sudah jalan.
- **Nozzle & Oem benar-benar baru** → master kecil baru `md_nozzles` + `md_oems`
  (mirror `md_colors`: code+name+isActive), konsisten pola master atribut lain
  (tabel + FK + halaman CRUD + SearchSelect). Bukan teks bebas.
- **Cakupan = semua field legacy** (~20). Scalar baru di `md_items`:
  `length/width/height/volume` (Decimal nullable), `conversion_kg_pcs`
  (Decimal default 1), `registration_no` (No. Ijin Edar), `is_returnable`
  (Retur, default **true** sesuai legacy), `is_mobile` (default false).
- **Layout = 1 tab "Atribut" bergrup** (best practice, bukan grid datar legacy):
  3 grup → **Dimensi & Berat** (Panjang/Lebar/Tinggi/Volume/Berat/Konversi
  Kg-Pcs) · **Klasifikasi Produk** (Warna/Merk/Ukuran/Material/Section/Desainer/
  Nozzle/OEM/Vendor) · **Penanganan & Regulasi** (Satuan Lapangan/No. Ijin Edar/
  Retur/Mobile). Section "Atribut" disisipkan di side-nav setelah "Klasifikasi".
- **Berat dipindah** dari section Klasifikasi → grup Dimensi & Berat (hapus
  `showsWeight` gate di Klasifikasi). **Serial/Batch tetap** di section Inventory
  (`tracksSerial`/`tracksBatch`) — tidak diduplikasi di Atribut.
- **itemModel** tidak di-wire (tidak ada di screenshot Atribut legacy).

**Implementasi:**
- DB: migrasi `20260531_001_erp_item_attributes` (additive, idempotent, 0 DROP) —
  13 kolom `md_items` + tabel `md_nozzles`/`md_oems` + FK constraints (termasuk
  untuk kolom brand/material/size/color/section yang dulu belum ber-constraint).
- Backend: `ErpItem` relasi + 2 model baru; `erp-items` DTO/mappers/service
  (`FK_OPTIONAL_FIELDS`+`DECIMAL_FIELDS`+`ITEM_INCLUDE` + create/update flag);
  modul `erp-nozzles`/`erp-oems` (mirror `erp-colors`, guard `ErpJwtAuthGuard`
  §2.5) terdaftar di `app.module.ts`; menu di-seed di `seed-erp.ts`
  (`M1.ITEM.NOZZLE` `/master/nozzles`, `M1.ITEM.OEM` `/master/oems`).
- Frontend: `lib/api/{nozzles,oems}.ts`; loaders di `items-form-lookups.ts`;
  `items-form.tsx` (ItemFormData/default/fromItem/toItemPayload); section UI
  reusable `items-form-atribut.tsx`; halaman master `{nozzles,oems}-page.tsx`
  (pakai organism `SimpleMasterPage`) terdaftar di `ERP_PAGES`
  (shell-route-renderer) + `NAV`/`ERP_ROUTE_META` (`lib/nav.ts`).
- Verifikasi: `tsc --noEmit` BE+FE 0 error, `check:size` clean, migrasi applied,
  endpoint `/api/erp/{nozzles,oems}` 401 (route+guard OK), menu seeded.

---

### 2.38 Item — tab Lain-lain + Custom (metadata JSON sidecar) (2026-05-31)

Menambahkan dua tab terakhir form item legacy MyERP+ (`/app/master/items`):
**Lain-lain** dan **Custom** (amati-tiru-modifikasi). Beda dari tab lain
(Atribut/Distributor/Branch yang pakai kolom/tabel riil), kedua tab ini
**disimpan di `md_items.metadata` (Json)** — **tanpa migrasi/kolom baru**
(keputusan user 2026-05-31: storage = metadata Json).

- **Lain-lain → `metadata.others`:** `aliasName1..4` (Nama Alias 1–4),
  `notesRc` (Notes RC), `catatan` (Catatan).
- **Custom → `metadata.custom`:** `productionCategory`, `productionGroup`,
  `maxQtySo`, `capacityPerHour`, `maxQtyRc`, `allowance`, `wip1..3`,
  `mouldFinish`, `moldSemi1..2`, `min1`/`max1`/`min2`/`max2`. Field kuantitas
  (Max Qty SO/RC, Kapasitas Per Jam, Allowance) = `NumField`; sisanya teks.
  Field lookup legacy (Kategori/Kelompok Produksi, WIP, Mould — punya ikon
  search) **di-modernisasi jadi teks bebas** karena belum ada master-nya;
  promosikan ke lookup saat master dibuat.

**Implementasi (tanpa Prisma/migrasi — kolom `metadata` sudah ada):**
- Backend: DTO nested `ItemOthersDto`/`ItemCustomDto`
  ([`dto/item-metadata.dto.ts`](../../api-gateway/src/erp-items/dto/item-metadata.dto.ts))
  + field `others`/`custom` di `CreateErpItemDto` (`@ValidateNested`). Helper
  `buildItemMetadata(dto, existing?)` di `erp-items.mappers.ts` merakit
  `metadata` (compact buang nilai kosong, **merge** ke metadata existing supaya
  key lain selamat, clear namespace bila semua blank, `undefined` = jangan
  sentuh kolom). Di-wire ke `create` + `update`. `mapItem` sudah meneruskan
  `metadata` apa adanya via `...rest` (tak perlu diubah).
- Frontend: tipe `ItemOthersData`/`ItemCustomData`/`ItemMetadata` +
  `ErpItem.metadata` + `CreateItemPayload.others/custom` di `lib/api/items.ts`;
  `ItemFormData.others/custom` + adapter `fromItem` (baca `item.metadata`) /
  `toItemPayload` di `items-form.tsx`; section UI reusable
  [`items-form-lainlain.tsx`](components/pages/items-form-lainlain.tsx)
  (`ItemLainLainSection` + `ItemCustomSection`), didaftarkan di side-nav
  `items-form-fields.tsx` setelah "Catatan".
- **Catatan ops:** tak ada migrasi & tak perlu `prisma generate`. BE host pakai
  `nest start --watch` (auto-reload). Bila API live disajikan dari container
  Docker, perlu rebuild/restart container agar perubahan TS ikut (pola §2.32).
- Verifikasi: `tsc --noEmit` BE+FE 0 error untuk file item.

---

## § Kas Masuk / Cash Receipt (CR) — transaksi fin pertama (2026-05-31)

Fitur transaksi master-detail penuh pertama di M2 Finance — dibangun dari UI legacy
MyERP+ "Kas Masuk (CR)" tapi pakai design system + standar Senti (§2.7/§2.9).
Keputusan dengan user: **posting GL sekarang**, **state machine Senti**, **backend
cash-bank shared (wire CR dulu)**.

**Status enum diperluas (additive).** `ErpDocumentStatus` ditambah `NEED_APPROVE`,
`APPROVED`, `REJECTED` (migrasi `20260531_004_erp_document_status_workflow`,
`ALTER TYPE ADD VALUE`) agar DB sejalan dengan `lib/status.ts` (5-status canonical)
dan mendukung state machine §2.7. Dipakai semua dokumen fin/inv/pur/sls.

**Backend = 1 modul shared `erp-fin-cash-bank-transactions`** (melayani
RECEIPT/DISBURSEMENT via enum `direction`; CD/BD nyusul gratis). Endpoint
`/erp/fin/cash-bank-transactions` (`ErpJwtAuthGuard`). Pola:
- `create`: `docNumber` auto via `sys_document_numberings` (code `CASH_RECEIPT`,
  prefix `CR`) saat `auto=true`; `fiscalPeriodId` **diturunkan dari
  transactionDate** (cari periode yang memuat tanggal — tidak dipilih manual);
  `amount` header = Σ baris (server-side, tak percaya klien).
- **Workflow** `transition` (state machine): DRAFT→NEED_APPROVE→APPROVED→POSTED
  (+REJECTED, +REOPEN). Edit hanya saat DRAFT/NEED_APPROVE/REJECTED; POSTED tak
  bisa dihapus (reopen dulu).
- **Posting GL** (`cash-bank-posting.service.ts`): saat POST → generate
  `fin_ledger_entries` balanced — RECEIPT = **Dr Akun Kas (header)** + **Cr tiap
  baris**; DISBURSEMENT kebalikannya. Periode `CLOSED` ditolak. REOPEN
  hard-delete ledger milik dokumen (re-post idempoten). Validasi Σbaris=header.
- Cross-domain FK (partner/account/branch/currency) = **scalar tanpa @relation**
  → di-enrich code+name server-side (`cash-bank-enrich.ts`) agar list bawa nama.
- **E2E terverifikasi (2026-05-31):** create→submit→approve→post menghasilkan
  3 ledger entries balanced (Dr 455.000 = Cr 300.000+155.000).

**Frontend.** Editor baris kas/bank = organism reusable
[`components/organisms/cash-bank-lines.tsx`](components/organisms/cash-bank-lines.tsx)
— **satu kolom Total per baris** (No Akun · Nama · Total · Total Valas · Catatan ·
Cost Center), bukan debit/kredit (beda dari `JournalLinesEditor` jurnal umum).
SearchSelect CoA "code - name" (`loadAccountOptionsCoded`) + cost center, `NumInput`,
total footer. Form [`fin-cash-receipts-form.tsx`](components/pages/fin-cash-receipts-form.tsx):
header SearchSelect (Terima Dari/Akun Kas/Cabang/Lokasi) + tab Detail/Info + Total;
**Status read-only (badge), transisi via aksi** (§2.7). List
[`fin-cash-receipts-page.tsx`](components/pages/fin-cash-receipts-page.tsx) §2.7:
kolom legacy (No Transaksi link, Tanggal, Terima Dari, Total, Uang, Kurs, Status),
filter status + rentang tanggal, kebab + context menu workflow actions, bulk hapus,
keyboard nav, list↔form mode (back-arrow). `lib/api/fin-cash-receipts.ts` diselaraskan
ke endpoint shared (`direction=RECEIPT`) + `transitionCashReceipt`.

**Dihapus:** prototype `kas-masuk-list.tsx` + `kas-masuk-list-parts.tsx` (mock
client-side, orphaned, langgar §2.12) + route legacy `'kas-masuk'`.

**Filter list = paritas legacy (2026-05-31).** Panel filter
[`fin-cash-receipts-filters.tsx`](components/pages/fin-cash-receipts-filters.tsx)
(`CashReceiptFilters`): No Transaksi (range), Status, Tanggal (range), Terima Dari,
Lokasi, Cabang, Uraian, Catatan, User — semua **server-driven** (debounce 350ms) +
reset filter, plus search global di header. Backend query DTO menambah
`docNumberFrom/To`, `description`, `notes`, `createdById` (partner/branch/location
sudah ada). Pola filter kaya transaksi: panel terpisah di atas tabel (bukan
`FilterConfig` dropdown ErpListLayout yang cuma cocok untuk master sederhana).

**Header form = label inline 1 baris (2026-05-31).** `Field` di
[`fin-cash-receipts-form.tsx`](components/pages/fin-cash-receipts-form.tsx) diubah dari
label-di-atas (`flex flex-col`) jadi label-kiri-input-kanan (`flex items-center`, label
`w-24 shrink-0 text-left`) atas permintaan user — tiap field header jadi satu baris.

**Akun Kas [D] = picker akun kas saja (2026-05-31).** Picker `bankAccountId`
dibatasi ke akun kas/bank (sebelumnya semua akun). Paritas filter legacy MyERP+
`cgd='D' and caktif=1 and ctipe=0` → Senti `normalBalance=DEBIT` + `isActive=true`
+ `type=ASSET` (`ctipe` legacy = `AccountType`, nilai 0 = ASSET) + tambahan
`kind=POSTABLE` (header spt "Aset Lancar" tak bisa di-posting GL). Loader baru
`loadCashAccountOptionsCoded` ([items-form-lookups.ts](components/pages/items-form-lookups.ts));
DTO query account `apps/api-gateway` ditambah filter `normalBalance` (enum
`ErpNormalBalance`, additive — tanpa migrasi). Catatan: ini ikut legacy = **semua
aset debit** (termasuk piutang/persediaan), bukan murni kas/bank; belum ada flag
`isCashAccount` di `md_accounts`.

**Detail grid = spreadsheet cell-selection (2026-05-31).** Atas permintaan user,
grid Detail bukan lagi deret input aktif (search "Pencarian CoA", tombol "+ Tambah",
dan kolom trash dibuang). Default tiap cell = **terpilih (highlighted), bukan input**;
edit muncul on-demand. Dipecah jadi 4 file (<400 baris, §3): `cash-bank-line-model.ts`
(tipe + `newCashLine` + `cellColumns`), `cash-bank-line-cell.tsx` (display↔edit per
cell), `use-cash-grid-nav.ts` (state machine keyboard), `cash-bank-lines.tsx`
(organism komposit; re-export model untuk form).
- **Masuk edit (Excel-style):** klik pilih cell; **ketik / Enter / F2 / dobel-klik**
  masuk edit. Mengetik karakter langsung menyemai nilai (num/notes di-`patch`,
  akun/cost-center lewat `initialQuery` SearchSelect).
- **Navigasi:** `↑↓←→` pindah cell (saat tidak edit). Saat edit: **Enter** =
  commit & tetap di cell (keluar edit), **Tab** = commit & pindah kanan/kiri,
  **Esc** = batal (revert snapshot). Panah saat edit = gerak caret di input.
- **Tambah baris:** **Tab** di cell terakhir baris terakhir, atau **↓** di baris
  terakhir → append baris baru. **Hapus baris:** **Ctrl/Cmd+Delete** (sisakan ≥1).
- **Fokus:** root `div` `tabIndex=0` menangkap keydown; setelah nav/exit-edit di-
  refocus via `wantRoot` ref + `useLayoutEffect` (tidak mencuri fokus saat blur).
- **SearchSelect** ditambah prop reusable: `autoFocus`, `initialQuery` (semai
  pencarian saat type-to-edit), dan `onPick(value,label)` (cell butuh label untuk
  render display — `onValueChange` hanya kasih value). Additive; caller lama aman.
Berlaku ke **semua** form yang reuse organism ini (CR/CD/BD).

**Kas Keluar / CD = adopter kedua (2026-05-31).** CD disamakan penuh dengan CR:
endpoint shared `direction=DISBURSEMENT`, URL sub-route (§2.3.1), workflow actions,
slim filter bar + drawer (§2.40), keyboard nav. Karena form & filter CR/CD beda
**hanya label + arah**, keduanya diekstrak jadi organism reusable berparameter
(keputusan user — generik & share, bukan duplikat ~380 baris):
- Form: [`cash-bank-transaction-form.tsx`](components/pages/cash-bank-transaction-form.tsx)
  (`CashBankTransactionForm`, prop `labels:{partner,account}`) + model
  [`cash-bank-form-model.ts`](components/pages/cash-bank-form-model.ts)
  (`toCashBankPayload(d, direction)`). CR/CD form = wrapper tipis.
- Filter: [`cash-bank-filters.tsx`](components/pages/cash-bank-filters.tsx)
  (`CashBankFiltersBar`, prop `entityName`+`partnerLabel`) +
  [`cash-bank-filter-fields.tsx`](components/pages/cash-bank-filter-fields.tsx).
  CR/CD filter = wrapper tipis.
- Label arah: CR = "Terima Dari" / "Akun Kas [D]"; CD = "Bayar Ke" / "Akun Kas [K]"
  (paritas legacy: disbursement = Cr Akun Kas, Dr tiap baris).
- `lib/api/fin-cash-disbursements.ts` ditulis ulang ke endpoint shared
  (`direction=DISBURSEMENT`, reuse tipe CR) + `transitionCashDisbursement`. Modal
  CRUD skeleton lama (entryDate/cashAccountId/ID-input) dibuang. Registrasi pindah
  `ERP_PAGES` → `TRX_FORM_PAGES` (shell-route-renderer). File CR filter-fields lama
  dihapus (digantikan shared).

**Belum (follow-up):** edit dokumen POSTED auto reverse+repost (sekarang diblok —
reopen dulu); kolom User Input di tabel (filter User sudah ada); FE BD/transfer
belum pakai backend baru ini (CR + CD sudah).


---

## §2.36 Layout baku form input transaksi (2026-05-31)

Standar posisi field untuk **semua form input transaksi** (CR sekarang; CD/BD/
giro/jurnal mengikuti). Lahir dari Kas Masuk (§ Kas Masuk) — paritas pola legacy
MyERP+ yang menaruh info dokumen di kanan-atas.

**Grid header 3 kolom** (`grid md:grid-cols-3`):
- **Kiri = identitas transaksi**: pihak/partner (Terima Dari / Bayar Ke), Akun
  Kas/Bank [D/K], Uraian.
- **Tengah = dimensi**: Cabang (required), Lokasi, (Cost Center/Divisi/Proyek bila ada).
- **Kanan = info dokumen, URUTAN BAKU dari atas:**
  1. **Tanggal** (required) — paling atas.
  2. **No Transaksi** — input + checkbox **Auto** satu baris (Auto on → readonly
     `(otomatis saat simpan)`, server generate via `sys_document_numberings`).
  3. **Uang/Kurs** — satu baris: **`SearchSelect` mata uang** + **Kurs read-only**
     inline (muted, `formatNumber(rate,2)`); kurs turunan, bukan input editable.
     Mata uang **bukan** `Select` biasa (2026-05-31): master mata uang lengkap
     (modul dunia, bisa puluhan/ratusan baris) → pakai `SearchSelect` agar bisa
     diketik/dicari + konsisten dgn picker lain di form (partner/akun/cabang).
     Loader = `loadCurrencyOptions` (`items-form-lookups.ts`); trigger label =
     `"<code> - <name>"` via `initialLabel` (derive dari list currencies yg
     sudah di-fetch). Adopter pertama = Kas Masuk (`fin-cash-receipts-form.tsx`).

**Konvensi field umum:**
- Label via helper `Field` (`<label>` horizontal): teks **rata kiri** (`text-left`,
  `w-24 shrink-0`), tanda **required `*` di belakang** teks (bukan depan — biar
  teks label sejajar).
- Status workflow = **badge read-only di toolbar** (kanan), transisi via aksi
  (§2.7) — bukan field editable di header.
- Toolbar atas: Simpan · Simpan & Baru (hanya saat create) · Reset · spacer · Badge status.

**Konsekuensi:** form transaksi baru **mulai dari** komposisi ini; jangan taruh
Tanggal/No Transaksi/Kurs di kiri atau acak. Field di luar daftar → masukkan ke
kolom yang paling sesuai (identitas=kiri, dimensi=tengah, dokumen=kanan).
Referensi implementasi: [`fin-cash-receipts-form.tsx`](components/pages/fin-cash-receipts-form.tsx).

## §2.40 Filter list = slim bar + drawer kanan (enterprise/minimalis) (2026-05-31)

Pola filter baku untuk halaman list transaksi (lahir dari Kas Masuk/CR, modul
fin lain mengikuti). Menggantikan grid 9-field yang selalu terbuka (noisy).
**Satu baris** (keputusan user 2026-05-31): kontrol filter digabung ke baris
summary `ErpListLayout` lewat slot `toolbar` — **tidak** ada baris filter
terpisah. Komposisi:

1. **Inline (di slot `toolbar`, kiri baris summary)**: quick filter **Status** +
   **Tanggal** (`DateRangePicker`) yang **apply live**, tombol **Filter** (ikon
   `filter`) dengan **badge angka** = jumlah filter lanjutan aktif, dan tombol
   **Reset** (tampil hanya saat ada filter aktif; clear semua). `Σ` summary tetap
   di kanan baris yang sama. **Label di kiri tiap kontrol inline (2026-05-31):**
   "Status" & "Tanggal" sebagai `<span class="text-xs text-muted-foreground">`
   di dalam `<label>` (flex, gap kecil) — supaya jelas field mana yang difilter
   (dropdown "Semua" + range `dd/mm/yyyy` ambigu tanpa label; placeholder hilang
   begitu ada nilai jadi tak cukup).
2. **Drawer kanan** (`components/organisms/drawer.tsx`, slide-over Radix Dialog):
   memuat **semua** field (No Transaksi range, Status, Tanggal, Terima Dari,
   Lokasi, Cabang, Uraian, Catatan, User). Edit **draft terstaging** — tidak
   menyentuh list sampai **"Terapkan"**; **"Atur ulang"** clear draft. Quick
   filter di bar (Status/Tanggal) tetap live karena di luar drawer.
3. **Filter lanjutan aktif** TIDAK ditampilkan sebagai chip terpisah (biar tetap
   1 baris) — hanya **badge angka** di tombol Filter; detailnya terlihat di
   dalam drawer. (Varian chip-bar removable sempat dibuat lalu di-rollback demi
   "1 baris aja".)

Aturan turunan:
- **Drawer** = organism reusable baru (`Drawer`/`DrawerContent`/`DrawerHeader`/
  `DrawerBody`/`DrawerFooter`, side `right|left`, size `sm|md|lg`). Mirror
  `Modal` tapi slide dari tepi. Pakai ini untuk panel filter & side surface
  lain; jangan rakit slide-over ad-hoc.
- **Label SearchSelect untuk chip**: `onValueChange` hanya kasih value, jadi
  label di-cache via wrapper `withLabelCache(loader)` (module-level
  `LABEL_CACHE`) lalu disimpan ke `*Label` di `CrFilters` saat dipilih —
  feed chip + `initialLabel`. Jangan ubah molecule `SearchSelect`.
- File: [`fin-cash-receipts-filters.tsx`](components/pages/fin-cash-receipts-filters.tsx)
  (bar + chip + drawer orchestrator) + [`fin-cash-receipts-filter-fields.tsx`](components/pages/fin-cash-receipts-filter-fields.tsx)
  (body form drawer + STATUS_OPTIONS + label cache). Split demi batas 400 baris.
- **`DateRangePicker` inline di bar = `fullWidth={false}` (2026-05-31).** Input
  tanggal **native** (`type="date"`) punya lebar intrinsik browser (~124px) yang
  **tidak bisa menyusut**; dulu dibungkus `<div style={{ width: 250 }}>` → flex
  dalam meluber & **menumpuk** di atas tombol Filter. Keputusan user: tetap
  native (typeable), **lebarkan**. Solusi: prop `fullWidth` di `DateRangePicker`
  — `true` (default) untuk konteks form/drawer (root `width:100%`), `false` untuk
  bar horizontal (root `width:fit-content` → sizing ke konten, anti-luber &
  ikut `--font-scale`). Tiap input pakai basis `124px` (`flex:'1 0 124px'` /
  `flexShrink:0`) agar `dd/mm/yyyy` + ikon picker tak terpotong. **Jangan**
  clamp `DateRangePicker` native ke lebar tetap < ~330px di flex row — pakai
  `fullWidth={false}`.

### 2.43 Master Mata Uang = seed full ISO 4217 (2026-05-31)

Master Mata Uang (`md_currencies` / model `ErpCurrency`) di-seed dengan daftar
**lengkap ISO 4217 aktif** (189 entri, termasuk IDR + logam mulia XAU/XAG/XPT/XPD),
bukan hanya IDR. Data array hidup di modul terpisah
[`apps/api-gateway/prisma/data/iso-4217-currencies.ts`](../../api-gateway/prisma/data/iso-4217-currencies.ts)
(interface `Iso4217Currency` = `code`/`name`/`symbol?`) dan di-import oleh
`seedCurrency()` di `prisma/seed-erp.ts`. Upsert **idempotent** keyed on `code`
(`create` baru + `update` name/symbol untuk yang sudah ada), `isActive: true`
untuk semua. `symbol` diisi bila ada simbol baku; dikosongkan untuk kode tanpa
simbol umum (mis. XDR, BOV).

Alasan: halaman master Currencies (`/master/currencies`) sebelumnya cuma punya
IDR; aplikasi butuh pilihan mata uang dunia lengkap. Data dijadikan modul
terpisah agar `seed-erp.ts` tetap ringkas (file seed exempt dari batas 400 baris).
Frontend (`components/pages/currencies-page.tsx` + `lib/api/currencies.ts`) tidak
berubah — list dibaca dari API `GET /api/erp/currencies`.

---

## § Kustomisasi Grid — layout grid transaksi (2026-05-31)

Menu **Kustomisasi Grid** (`/admin/grid-customization`, Administrator → System)
= editor layout kolom grid detail transaksi (paritas layar "Grid" legacy MyERP+).
Kiri = pohon modul→transaksi; kanan = editor kolom. Atas keputusan user:
full-stack + wire ke grid live, atribut simplified, pohon semua modul, dukung
kolom kustom.

**DB (domain `sys`):** `sys_transaction_types` (katalog penggerak pohon: code,
name, module_key/label, group_label, line_table, sort_order) + `sys_transaction_grid_columns`
(per transaksi: sort_order, header_text, data_field, width, is_visible/required/editable,
kind STANDARD|CUSTOM, data_type TEXT|NUMBER|DATE|LOOKUP, lookup_source). Kolom kustom
disimpan di **`fin_cash_bank_lines.custom_fields` (JSONB)** keyed by data_field.
Migrasi `20260531_005_erp_grid_customization` (additive, 0 DROP). Enum disimpan
sebagai TEXT + validasi app (migrasi ringan).

**Backend:** modul `erp-sys-transaction-grids` (guard `ErpJwtAuthGuard`):
`GET /erp/transaction-grids/types`, `GET/PUT /:code/columns` (PUT = replace penuh).
`CashBankLineDto`/`mapLine` + enrich pass-through `customFields`.

**Frontend:** `grid-customization-page.tsx` + `-tree.tsx` + `-columns.tsx`;
API client `lib/api/transaction-grids.ts`. Grid kas/bank (`cash-bank-lines.tsx`)
**config-driven**: prop `columns` eksplisit atau self-fetch via `transactionCode`
(mis. `"FIN.CR"`), fallback `defaultGridCols(showFx)` bila API kosong/404. Cell
render by `dataType`; label lookup non-akun di-resolve dari master kecil (cache
modul). `SearchSelect` dapat prop reusable `autoFocus`/`initialQuery`/`onPick`.

**Catatan:** wiring `transactionCode` ke form CR/CD ada di file refactor cash-bank
(`cash-bank-transaction-form.tsx` dkk). Seed katalog 29 transaksi (15 modul) +
kolom default keluarga kas/bank (CR/CD/RM/SM). **Follow-up:** label lookup dimensi
(costCenter/division/…) di dokumen lama tampil id sampai master ter-resolve;
modul transaksi non-kas/bank belum punya line_table/wiring.

### Update 2026-05-31 — tabbing (banyak grid/menu) + slot renderer + skip-fokus

Atas keputusan user: **1 menu/jenis transaksi bisa punya >1 tabel** → layer
**grid/tab** baru disisipkan, dan tiap kolom dapat slot format/render + flag skip.

- **DB:** model baru **`ErpTransactionGrid` → `@@map("sys_transaction_grids")`**
  (tab: `transaction_type_id` FK, `key`, `label`, `sort_order`, `line_table?`,
  `is_primary`, `is_active`, audit; unique `[transaction_type_id, key]`). Kolom
  **pindah parent** dari `transaction_type_id` → **`grid_id`** (unique
  `[grid_id, data_field]`). Tambahan kolom di `sys_transaction_grid_columns`:
  `is_skippable BOOLEAN` (skip fokus saat tab/arrow di grid entry) +
  `label_formatter` / `header_renderer` / `cell_renderer` / `cell_editor`
  (semua **TEXT nullable**, allowlist app-level, `null` = derive dari `data_type`).
  Migrasi `20260531_007_erp_grid_tabs_renderers` (data-preserving: tiap jenis
  transaksi existing dapat 1 grid `main` primary, semua kolom di-repoint;
  `migrate deploy`).
- **Penamaan (best-practice modern grid, bukan Flex):** `labelFormatter`,
  `headerRenderer`, `cellRenderer`, `cellEditor` (peta dari istilah legacy Flex
  Label function / Header renderer / Item renderer / Item editor).
- **Katalog enum (dropdown FE = allowlist DTO):**
  `labelFormatter`: NONE·NUMBER·DECIMAL·CURRENCY·PERCENT·DATE·DATETIME·BOOLEAN ·
  `headerRenderer`: DEFAULT·REQUIRED·CENTER·WRAP·HELP ·
  `cellRenderer`: TEXT·NUMERIC·CURRENCY·BADGE·CHECK·LINK·LOOKUP ·
  `cellEditor`: TEXT·NUMBER·DATE·LOOKUP·TEXTAREA·CHECKBOX·NONE.
- **Backend:** `GET /:code/grids` + `PUT /:code/grids` (replace penuh grids+kolom);
  `GET /:code/columns` **dipertahankan** (kompat) → balikin kolom grid `is_primary`
  (dibaca `cash-bank-lines.tsx`). `getGrids` **lazy-create** grid `main` primary
  bila jenis transaksi belum punya grid (editor selalu bisa dibuka). DTO:
  `GridInputDto`/`SaveGridsDto` + allowlist enum.
- **Frontend:** tab strip `grid-customization-tabs.tsx` (pilih/ tambah/ rename
  klik-ganda/ geser/ hapus/ set primary; min 1 tab). `-columns.tsx` tambah kolom
  **Skip** (checkbox, setelah Edit) + 4 dropdown slot (opsi `— (auto)` = null).
  `-page.tsx` jadi grids-aware. API client: `getTransactionGrids`/`saveTransactionGrids`.

---

## § Bank Masuk (RM) — twin Kas Masuk + Cara Bayar + Giro (2026-05-31)

Build halaman **Bank Masuk / Bank Receipt** (`/finance/bank-receipts`, legacyCode
`RM`), meniru layar legacy MyERP+ (amati-tiru-modifikasi).

**Keputusan dengan user:**
- **Model = twin Kas Masuk**, BUKAN `fin_ar_receipts`. Bank Masuk dibangun di
  atas modul **shared** `erp-fin-cash-bank-transactions` (sama dgn CR/CD), dengan
  diskriminator baru `kind=BANK` + `direction=RECEIPT`. Layar legacy "Bank Masuk
  (RM)" = header + baris kontra CoA + Total, identik Kas Masuk (hanya "Akun Bank
  [D]" + Cara Bayar + tab Giro) — jadi reuse pola Kas Masuk, bukan layar alokasi
  AR. Mengoreksi catatan menu-parity yang sempat memetakan RM → `fin_ar_receipts`.
- **Full parity**: sertakan **Cara Bayar** (enum `ErpPaymentMethod`, default
  `TRANSFER`) + **tab Giro** yang berfungsi.

**Skema (additive, migrasi `20260531_006_erp_cash_bank_kind_payment_method`, 0 DROP):**
- Enum baru `ErpCashBankKind { CASH, BANK }`.
- `fin_cash_bank_transactions` + kolom `kind` (`ErpCashBankKind` NOT NULL default
  `CASH` → baris CR/CD lama otomatis `CASH`) & `payment_method`
  (`ErpPaymentMethod` nullable). Index `(kind, direction, status)`.
- **Doc numbering** di-key per (kind, direction): `BANK_RECEIPT` prefix **RM**
  (seed `seed-erp.ts` + insert idempotent ke DB live). CR/CD tetap.
- **Giro tab** = baris giro disimpan sebagai rekor **`fin_giros`** (type
  `INCOMING`, `source='CASH_BANK_TXN'`, `sourceTransactionId`=id transaksi,
  status `OUTSTANDING`). Sinkron seperti baris kontra: hard delete + recreate saat
  update (dokumen masih editable/pre-post → belum ada clearing), soft-delete saat
  transaksi dihapus. Field per giro: No Giro/Cek, Bank Penerbit, Jatuh Tempo,
  Nominal, Catatan.

**Posting GL:** tidak berubah — RECEIPT tetap Dr akun bank (header) / Cr baris
kontra, apa pun Cara Bayar. **Asumsi/ditunda:** nuansa akuntansi giro-belum-cair
(Dr Giro/Notes Receivable lalu pindah saat clearing) belum dimodelkan; giro di tab
ini = pencatatan instrumen + dasar untuk modul Receipt Giro Clearing (RGC) ke
depan. Eskalasi bila perlu posting giro yang berbeda.

**Backend (shared module `erp-fin-cash-bank-transactions`):**
- DTO create + `kind`/`paymentMethod`/`giros[]` (`CashBankGiroDto`); query DTO
  + `kind`. `genDocNumber(tx, kind, direction)`. Helper `syncGiros`/`loadGiros`;
  `one()` melampirkan `giros`. Guard tetap `ErpJwtAuthGuard` (§2.5).
- Regresi Kas Masuk aman: default `kind=CASH`, jalur CR tak berubah.

**Frontend (adopter §2.3.1 — reuse, jangan fork):**
- `lib/api/fin-bank-receipts.ts` (reuse tipe shared dari `fin-cash-receipts`,
  `kind:'BANK'`, + `paymentMethod`/`giros`).
- `fin-bank-receipts-form.tsx` = **wrapper tipis** atas form shared
  `cash-bank-transaction-form.tsx` (header/Detail/Info dari sana). Dua hal khas
  bank di-inject via slot **baru** form shared: **`headerExtra`** (Cara Bayar
  Select §2.6 → 6 opsi) + **`extraTabs`** (tab Giro = organism reusable
  `components/organisms/cash-bank-giros.tsx`, dipakai bareng Bank Keluar). Slot
  additive → CR/CD tak terpengaruh. Model `fin-bank-receipts-form-model.ts`
  extend `CashBankFormData` + `paymentMethod`/`giros`, reuse mapper shared
  (`toCashBankPayload`). (Editor giro standalone yang sempat dibuat → dihapus,
  diganti organism shared agar tak duplikat.)
- `fin-bank-receipts-page.tsx` (list + router sub-route), reuse filter
  `CashReceiptFilters` + workflow `cashBankWorkflowActions`. Kolom list +
  **Cara Bayar**.
- Routing: daftar `/finance/bank-receipts` di `TRX_FORM_PAGES`
  (shell-route-renderer) + `ERP_ROUTE_META` (`lib/nav.ts`).

## § Bank Keluar (SM) — twin Kas Keluar + Cara Bayar + Giro (2026-05-31)

Build halaman **Bank Keluar / Bank Disbursement** (`/finance/bank-disbursements`,
legacyCode `SM`), meniru layar legacy MyERP+ "Bank Keluar (SM)". Sibling Bank Masuk
(RM, § atas) — arah keluar. Reuse fondasi shared yang sama (jangan fork).

**Keputusan dengan user (2026-05-31):**
- `/finance/bank-disbursements` = **Bank Keluar (SM)** di atas modul **shared**
  `erp-fin-cash-bank-transactions`, `kind=BANK` + `direction=DISBURSEMENT`. Judul
  page + sidebar = **"Bank Keluar"**, code-tag **SM** (override konvensi English
  untuk item ini, atas pilihan user eksplisit).
- **Rapikan duplikat**: entri menu lama `/finance/bank-payments` ("Bank Payment",
  SM→`fin_ap_payments`) **dihapus** dari seed + di-prune dari DB live (idempotent),
  karena duplikat konsep dengan halaman ini.

**Skema:** tak ada perubahan baru — reuse migrasi `20260531_006` (kind +
payment_method + index) dari Bank Masuk. **Doc numbering** key
`BANK_DISBURSEMENT` prefix **SM** (seed `seed-erp.ts` + insert idempotent ke DB
live). **Giro tab** = `fin_giros` type **`OUTGOING`** (derive dari direction),
`source='CASH_BANK_TXN'`, sinkron hard delete+recreate (sama pola Bank Masuk;
dasar modul Send Giro Clearing/SGC ke depan).

**Backend (shared module):** tambah filter **`paymentMethod`** di query DTO +
`where` service (melengkapi `kind` dari Bank Masuk). `genDocNumber`/`syncGiros`/
`loadGiros` sudah generik (dipakai RM & SM). Regresi CR/CD/RM aman.

**Frontend (adopter §2.3.1 — reuse, jangan fork):**
- `lib/api/fin-bank-disbursements.ts` (reuse tipe shared dari `fin-cash-receipts`,
  `direction:'DISBURSEMENT'` + `kind:'BANK'`).
- `fin-bank-disbursements-form.tsx` = **wrapper tipis** atas `cash-bank-transaction-form.tsx`,
  inject **Cara Bayar** (Select §2.6, 6 opsi, default `TRANSFER`) via `headerExtra`
  + **tab Giro** via `extraTabs` (organism shared `cash-bank-giros.tsx`). Label
  bank: "Bayar Ke" + "Akun Bank [K]". Export `paymentMethodLabel` untuk kolom list.
- **Model**: SM pakai **shared `cash-bank-form-model.ts`** langsung —
  `CashBankFormData` diperluas `kind`/`paymentMethod`/`giros`; `defaultCashBankForm('BANK')`
  set `paymentMethod='TRANSFER'`; `toCashBankPayload` kirim `giros` hanya saat
  `kind='BANK'` (cash → `undefined`, backend skip sync). Types di `fin-cash-receipts.ts`
  + `ErpCashBankGiro`/`CashBankGiroPayload`/`ErpPaymentMethod`/`ErpCashBankKind`.
- `fin-bank-disbursements-page.tsx` (list + router sub-route §2.3.1), reuse filter
  bar shared (wrapper `fin-bank-disbursements-filters.tsx`, "Bank Keluar"/"Bayar Ke")
  + `cashBankWorkflowActions`. Kolom list + **Cara Bayar**.
- Routing: `/finance/bank-disbursements` dipindah dari `ERP_PAGES` ke
  `TRX_FORM_PAGES` (shell-route-renderer) + `ERP_ROUTE_META` (`lib/nav.ts`).
- **Ditunda**: filter Cara Bayar di drawer (butuh ubah `cash-bank-filter-fields`
  shared); pass ini cukup **kolom** Cara Bayar di list. Backend filter
  `paymentMethod` sudah siap → tinggal wire field saat melanjutkan.
