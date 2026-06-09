---
inclusion: fileMatch
fileMatchPattern: "apps/web-erp/**"
---

# Senti ERP — Web App

`apps/web-erp` — **produk Senti ERP**. Legacy MyERP+ di `apps/web-erp/preferensi/` (1.1 GB) adalah **referensi fitur/business-logic SAJA** — bukan sumber struktur kode/DB.

#[[file:apps/web-erp/CLAUDE.md]]

## Aturan Non-Negosiabel

### 1. Penamaan Tabel WAJIB: `<domain>_<nama-tabel-plural-snake>`

| Domain | Cakupan | Contoh |
|--------|---------|--------|
| `sys` | Konfigurasi sistem global | `sys_settings`, `sys_fiscal_periods`, `sys_menus` |
| `adm` | Identity & access | `adm_users`, `adm_roles`, `adm_permissions`, `adm_role_menus` |
| `md` | Master Data | `md_items`, `md_partners`, `md_accounts` |

- Batas `sys` vs `adm`: definisi menu = `sys_menus`; pemetaan role→menu = `adm_role_menus`.
- Prisma model: `PascalCase` ber-prefix `Erp` + `@@map("<domain>_...")` (mis. `model ErpItem { @@map("md_items") }`).
- **Dilarang** bentrok dengan `m0_*` / `m1_*` / `clinic_*`.

### 2. Design system dulu, baru slicing frontend

Tokens → komponen primitif → pola layout → baru halaman modul. Butuh UI baru saat slicing → stop, buat komponen reusable dulu. Tidak ada style hardcode.

### 3. Saat ragu → tanya user. Tidak ada pengecualian diam-diam.

## Arsitektur & Tech

- **Prototype**: standalone CDN-React 18 SPA, tanpa bundler, port **3218**
- Multi-tab shell (sidebar/topbar/tabs), route-driven, mock `src/data.jsx`, i18n ID/EN
- Backend nanti: NestJS + Prisma 5 + Postgres (`apps/api-gateway`)
- DB schema: `apps/api-gateway/prisma/schema.prisma`

## Sumber Semantik Otoritatif (Legacy Mapping)

- `apps/myerpplus-db-mapping/db/semantic-schema.json` — alias English, deskripsi field, PK, soft-delete rules
- Raw seed: `/home/rania/apps/myerpplus_serenity.sql` (27 MB, gitignored) — **read-only**

## Artefak & Status

- `apps/web-erp/db-design/` — dokumen desain DB otoritatif:
  - `README.md` (hub: decisions, conventions, ERD, open decisions)
  - `entities-m0-administrator.md`
  - `entities-m1-master-data.md`
  - `legacy-mapping.md`
- Prisma model + migration **ditunda** sampai open decisions di `db-design/README.md §8.1` di-resolve.

## Keputusan Terkunci (2026-05-17)

- Reference legacy → produk Senti ERP; **bukan port 1:1**.
- MVP = m0 + m1 core subset (~25 entitas).
- Skema = modern English, ternormalisasi, FK ditegakkan, `timestamptz` UTC, money `Decimal(19,4)`.

## Disiplin Dokumentasi

Setiap keputusan/perubahan → update `apps/web-erp/CLAUDE.md` (atau `db-design/` bila schema, `README.md` bila setup). Catat sebagai fakta ringkas. Jangan declare selesai sebelum dokumen sinkron.
