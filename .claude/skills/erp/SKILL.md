---
name: erp
description: >
  Skill untuk bekerja di apps/web-erp — produk Senti ERP yang dibangun
  dari referensi legacy MyERP+ (apps/web-erp/preferensi/). Aktifkan setiap kali
  task menyentuh apps/web-erp/** atau menyebut modul ERP (m0 Administrator,
  m1 Master Data, item, partner/kontak, CoA, gudang, penomoran dokumen),
  desain DB ERP, atau prototype web-erp.
trigger: >
  Aktif saat user menyebut "web-erp", "erp", "myerpplus", "preferensi",
  "m0/administrator", "m1/master data", "item/barang", "partner/kontak",
  "coa/akun", "desain DB / db-design", "prototype erp", atau mengedit file di apps/web-erp/.
  JUGA aktif saat user menyebut domain/URL deployment "erp.fr-labs.my.id"
  (mis. https://erp.fr-labs.my.id/app/... ) — itu deployment apps/web-erp.
---

Kamu bekerja di `apps/web-erp` — **produk Senti ERP**. Legacy MyERP+ di
`apps/web-erp/preferensi/` (1.1 GB) adalah **referensi fitur/business-logic/flow
SAJA** — bukan sumber struktur kode/DB. Skill ini berlaku di atas root
`CLAUDE.md` repo dan `apps/web-erp/CLAUDE.md` (keduanya non-negosiabel; baca
`apps/web-erp/CLAUDE.md` sebelum kerja — itu sumber aturan otoritatif).

## Aturan non-negosiabel (dari apps/web-erp/CLAUDE.md)

1. **Penamaan tabel WAJIB:** `<domain>_<nama-tabel-plural-snake>`.
   Segmen domain **semantik per-fungsi** (bukan numerik legacy `m0`/`m1`):

   | Domain | Cakupan | Contoh tabel |
   | --- | --- | --- |
   | `sys` | Konfigurasi sistem/global — ubah → perilaku sistem berubah untuk semua | `sys_settings`, `sys_fiscal_periods`, `sys_document_numberings`, `sys_menus` |
   | `adm` | Identity & access — ubah → siapa bisa login/lihat/lakukan berubah | `adm_users`, `adm_roles`, `adm_permissions`, `adm_user_roles`, `adm_role_permissions`, `adm_role_menus`, `adm_user_branch_access` |
   | `md` | Master Data | `md_items`, `md_partners`, `md_partner_addresses`, `md_accounts` |

   - **Batas `sys` vs `adm`:** definisi menu = `sys` (`sys_menus`);
     pemetaan role→menu = `adm` (`adm_role_menus`). FK lintas-domain OK.
   - "Administrator" legacy (m0) **dipecah** jadi `sys` + `adm`. Master Data
     (m1) → `md`. Modul fungsi baru → tambah domain semantik baru.
   - Pivot = gabung dua entitas: `adm_user_roles`.
   - Prisma: model `PascalCase` tetap ber-prefix `Erp` (hindari bentrok
     model `User`/`Menu` platform di schema yang sama) + `@@map("<domain>_...")`,
     mis. `model ErpItem { ... @@map("md_items") }`.
   - **Dilarang bentrok** dengan `m0_*` / `m1_*` / `clinic_*` milik
     api-gateway/Althea. Isolasi dijaga oleh **namespace domain** (`sys_`,
     `adm_`, `md_`) yang tidak beririsan dengan prefix platform — ERP tidak
     menumpang/reuse tabel platform.
2. **Design system dulu, baru slicing frontend.** Tokens → komponen primitif →
   pola layout → baru halaman modul. Butuh elemen UI baru saat slicing → stop,
   bikin komponen reusable dulu. Tidak ada style/warna/spacing hardcode.
3. **Saat ragu → tanya user.** Tidak ada pengecualian diam-diam; menyimpang =
   eskalasi dulu.

## Konteks produk (hasil studi legacy MyERP+)

Legacy = Flex/ActionScript UI + ASP.NET/VB backend + Node api-bridge + .NET
tools. Modul dikonfirmasi: **m0 = Administrator**, **m1 = Master Data**
(`erp_mod0`/`erp_mod1` di Frontned, `[PCI] mod0/1`).

**Sumber semantik otoritatif (pakai ini, jangan parse dump mentah):**
- `apps/myerpplus-db-mapping/db/semantic-schema.json` (419 KB) — tiap tabel
  m0/m1: alias English, deskripsi field, PK, aturan soft-delete (`*aktif=1`).
- Raw seed: `/home/rania/apps/myerpplus_serenity.sql` (27 MB, gitignored,
  latin1) — untuk ETL/backfill masa depan; **read-only**, jangan dimodifikasi.
- Legacy bersifat denormalized, kolom Indonesia kriptik (`bkode`,`knama`),
  FK tidak ditegakkan, soft-delete via flag `*aktif`, history via tabel bayangan.

## Keputusan terkunci (2026-05-17, dengan user)

- Reference saja → produk Senti ERP; **bukan port 1:1**.
- Frontend = lanjutkan `apps/web-erp/prototype` (standalone CDN-React 18 SPA,
  tanpa bundler, port **3218**, belum anggota workspace npm).
- MVP = **m0 + m1 core subset** (~25 entitas), bukan paritas penuh ~70 tabel.
- Skema = **modern English, ternormalisasi** (alamat partner dipisah,
  role/permission eksplisit, fiscal period eksplisit, FK ditegakkan,
  soft-delete+audit seragam, semua `timestamptz` UTC, money `Decimal(19,4)`).
- DB hidup di Postgres bersama via Prisma — schema di
  `apps/api-gateway/prisma/schema.prisma`. **Tapi** tabel ERP tetap
  ber-namespace domain semantik `sys_*`/`adm_*`/`md_*` & berdiri sendiri
  (lihat konflik di bawah).

## Artefak & status

- `apps/web-erp/db-design/` — **dokumen desain DB otoritatif (sumber tunggal)**:
  `README.md` (hub: decisions, conventions, ERD, open decisions) +
  `entities-m0-administrator.md` + `entities-m1-master-data.md` +
  `legacy-mapping.md`. **Dokumen desain saja**; Prisma model + migration
  ditunda sampai approval. ERP punya auth sendiri — patuh
  `apps/web-erp/CLAUDE.md §1` (tidak reuse `User`/`Menu` platform).
  Branch/Warehouse/Location di `md`, Fiscal/Numbering/Setting/Menu di `sys`,
  User/Role/Permission/RoleMenu/Access di `adm`.
  **✅ (2026-05-17):** top-level `DB-DESIGN.md` lama **dihapus** (redundan
  dengan db-design/); keputusan desain yang dulu beda di sana (Int vs BigInt,
  partner model, audit-log, dll) di-flag di `db-design/README.md §8.1`
  sebagai open decision — resolve dulu sebelum Prisma, jangan selaraskan
  diam-diam. db-design/ sudah memakai domain `sys_*`/`adm_*`/`md_*`.

## Arsitektur & tech

- Monorepo: npm workspaces + Turbo. Backend convention = NestJS + Prisma 5 +
  Postgres (`apps/api-gateway`). Setelah ubah schema → `npm run db:generate`
  lalu `npm run db:migrate -- --name <slug>` (root CLAUDE.md rule #6).
- shared-types: tipe DTO ERP nanti dicerminkan ke
  `packages/shared-types/src/types/erp.ts` (+ Pydantic bila dikonsumsi
  ai-engine) — root CLAUDE.md rule #3.
- Prototype: multi-tab shell (sidebar/topbar/tabs), route-driven, mock
  `src/data.jsx`, i18n ID/EN, state via React useState + localStorage.

## Disiplin interaksi & sinkronisasi dokumen

1. Ambiguitas → `AskUserQuestion` dulu (scope modul, naming, flow, dampak DB).
2. Perubahan non-trivial → ringkas rencana + asumsi, tunggu user oke.
3. Aksi berisiko (schema/migrasi, hapus/rename, lintas-modul) → konfirmasi ulang.
4. Konteks sudah jelas total & dampak lokal → langsung kerjakan, jangan tanya
   demi formalitas.
5. **Setiap tanya-jawab / keputusan / perubahan flow/konvensi → WAJIB update
   `.md` di `apps/web-erp/`** (default `apps/web-erp/CLAUDE.md`;
   `db-design/` bila menyangkut skema; `README.md` bila setup). Catat sebagai fakta ringkas
   (keputusan + alasan), bukan log percakapan. Jangan declare selesai sebelum
   dokumen sinkron. Selaraskan `.planning/CHANGELOG.md` & `ROADMAP.md` bila
   status fitur berubah.

## Saat ragu

Tanya user. `apps/web-erp/CLAUDE.md` adalah otoritas — kalau skill ini dan
file itu beda, file itu yang menang; perbarui skill ini agar sinkron.
