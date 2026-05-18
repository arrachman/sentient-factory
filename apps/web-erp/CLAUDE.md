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
> **MVP = 31 tabel** (14 `sys_*`/`adm_*` + 17 `md_*`). Masih **dokumen desain
> saja** — TIDAK ada edit `schema.prisma`/migrasi sampai user beri go-ahead
> eksplisit "tulis Prisma" (root CLAUDE.md §6).

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
