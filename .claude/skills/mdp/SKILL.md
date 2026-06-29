---
name: mdp
description: >
  Skill untuk bekerja di apps/web-mdp — produk Senti MDP (Manufacturing
  Digitalization Platform), ISA-95 Level 3 / MOM yang duduk di antara Senti ERP
  (Level 4) dan lapangan (Level 2-0). Aktifkan setiap kali task menyentuh
  apps/web-mdp/** atau menyebut modul MOM (MES/produksi, QMS/kualitas,
  CMMS/pemeliharaan, WMS, PRTS, DMS, IMS/QHSE, LMS, OEE, EAM/aset), desain DB
  MDP, atau endpoint /api/mdp/*.
trigger: >
  Aktif saat user menyebut "web-mdp", "mdp", "Senti MDP", "layer 3", "level 3",
  "MOM", "ISA-95", "MES", "QMS", "CMMS", "WMS", "PRTS", "DMS", "IMS/QHSE", "LMS",
  "OEE", "EAM", "work center", "production order", "downtime/reason code", "shift",
  "shop floor", atau mengedit file di apps/web-mdp/ atau apps/api-gateway/src/erp-mdp-*.
  JUGA aktif saat user menyebut domain/URL deployment "mdp.fr-labs.my.id".
---

Kamu bekerja di `apps/web-mdp` — **produk Senti MDP** (*Manufacturing
Digitalization Platform*), implementasi **ISA-95 Level 3 / MOM**. MDP duduk **di
antara** Senti ERP (`apps/web-erp`, Level 4 — bisnis) dan lapangan (Level 2-0 —
SCADA/PLC/sensor). MDP **bukan** modul ERP; ia bounded-context terpisah dengan
persona, data velocity, dan UX berbeda.

Skill ini berlaku di atas root `CLAUDE.md` repo dan `apps/web-mdp/CLAUDE.md`
(keduanya non-negosiabel). **Baca `apps/web-mdp/CLAUDE.md` sebelum kerja** — itu
rulebook otoritatif tiap sesi. Desain DB otoritatif = `apps/web-mdp/db-design/`.

## Aturan non-negosiabel (dari apps/web-mdp/CLAUDE.md)

1. **Penamaan tabel WAJIB:** `<domain>_<plural-snake>`, lowercase, tanpa prefix
   produk. MDP memakai prefix domain **baru** yang tidak beririsan dengan ERP
   (`sys/adm/md/fin/inv/pur/sls/mfg/fa/bi/pos/pln`) maupun platform
   (`m0/m1/clinic`):

   | Domain | Cakupan | Modul | Contoh |
   | --- | --- | --- | --- |
   | `mdp` | Config & master lintas-modul (shift, kalender, reason/downtime code, menu SSOT) | semua | `mdp_shifts`, `mdp_reason_codes` |
   | `eam` | Registry aset/equipment (backbone L3–L4; jembatan ke ERP `fa_assets`) | EAM, MES, CMMS, OEE | `eam_assets`, `eam_work_centers` |
   | `mes` | Eksekusi produksi & data collection | MES | `mes_production_orders`, `mes_operations`, `mes_production_logs` |
   | `qms` | Kualitas (inspeksi, NCR, CAPA) | QMS | `qms_inspections`, `qms_nonconformances` |
   | `mnt` | Pemeliharaan / CMMS | CMMS | `mnt_work_orders`, `mnt_pm_schedules` |
   | `wms` | Eksekusi gudang fisik | WMS | `wms_tasks`, `wms_movements` |
   | `prt` | Problem & issue tracking (Andon) | PRTS | `prt_issues`, `prt_escalations` |
   | `dms` | Dokumen terkontrol | DMS | `dms_documents`, `dms_revisions` |
   | `ehs` | QHSE terpadu | IMS | `ehs_incidents`, `ehs_audits` |
   | `lms` | Pelatihan & kompetensi | LMS | `lms_courses`, `lms_certifications` |

   - Prisma: model `PascalCase` ber-prefix **`Mdp`** (hindari bentrok model
     ERP/platform di schema yang sama) + `@@map("<domain>_...")`, mis.
     `model MdpProductionOrder { ... @@map("mes_production_orders") }`.
   - **FK lintas-app/lintas-domain = scalar `BigInt` + `@@index`, TANPA
     `@relation`/DB-FK** (decoupled dari ERP). FK intra-domain ditegakkan
     dengan `@relation`. Cross-ref ke ERP (itemId, erpWorkOrderId, branchId,
     fa_assets) selalu scalar BigInt — jangan bikin DB-FK ke tabel ERP.

2. **MES = manual entry dulu** (operator via UI tablet/kiosk). Integrasi mesin
   (SCADA/PLC/OPC-UA, time-series ingestion) = fase masa depan, **bukan MVP**.
   Desain sekarang tak boleh mengasumsikan koneksi mesin — sediakan titik
   ekstensi bersih saja.

3. **Design system dulu, baru slicing frontend.** Port tokens/komponen dari
   web-erp. Tidak ada style/warna/spacing hardcode. Butuh elemen UI baru → bikin
   reusable dulu. (Catatan: UI MES saat ini masih *functional slice* ad-hoc,
   belum port penuh stack list-organism §2.7 web-erp.)

4. **Saat ragu → tanya user.** Aksi berisiko (schema/migrasi, hapus/rename,
   lintas-modul) = konfirmasi dulu.

## Konvensi field (warisan dari web-erp)

PK `BigInt @id @default(autoincrement())` · `code`/`name` · soft-delete
`deletedAt` (timestamptz) · `isActive` · audit quartet
(`createdAt`/`updatedAt`/`createdById`/`updatedById`) · money/qty `Decimal(19,4)`
· rate `Decimal(9,4)` · semua waktu UTC timestamptz · enum Postgres ber-prefix
`Mdp` · `metadata Json?` opsional.

## Kontrak integrasi L4↔L3 (otoritatif — db-design/README §Integrasi)

- **WMS** mengeluarkan pergerakan → **ERP `inv_` yang posting** stok. WMS tidak
  memiliki saldo stok.
- **MES** mengeksekusi `mfg_work_orders` milik ERP → mengemit
  `mes_production_entries`/log balik ke ERP.
- **`eam_assets`** = master equipment yang dipelihara; link opsional (scalar) ke
  ERP `fa_assets`.
- **OEE** = metrik turunan (dihitung dari mes downtime/log), **bukan** modul/tabel
  sumber.
- Kontrak **ERP-emit (outbox)** = **decision #3, masih di-stub/ditunda**. Jangan
  diam-diam bikin DB-FK lintas app; emit lewat outbox saat kontрак final.

## Arsitektur & tech

- **App**: Next.js 16 (Turbopack), React 19, Tailwind v4 (`@theme inline`), TS
  strict. Port **3220** (envVar `WEB_MDP_PORT`, di `config/ports.json`). Origin
  `mdp.fr-labs.my.id`. **Install standalone**: `cd apps/web-mdp && npm install
  --workspaces=false --no-audit --no-fund` (root `npm install` gagal karena
  `apps/open-design` pakai protocol pnpm `workspace:`).
- **Backend = extend `apps/api-gateway`** (decision #2, BUKAN service baru).
  Modul NestJS ber-prefix `erp-mdp-*`, controller `@Controller('mdp/...')` →
  path `/api/mdp/...` (global prefix `api`). Guard = **`ErpJwtAuthGuard`**
  (cookie `erp_token`, reuse auth ERP). Daftarkan modul di
  `apps/api-gateway/src/app.module.ts`.
- **DB = Postgres bersama** (`sentient-postgres-core` / db `sentient_factory`,
  host `localhost:3208`). Schema multi-file Prisma di
  `apps/api-gateway/prisma/schema/` (file `mdp-*.prisma`).
- **DB hidup tidak schema-managed sepenuhnya** ([[prisma-live-db-not-schema-managed]]):
  ~230 tabel live (dim_/obt_/etl_/hr_) TIDAK ada di Prisma. **JANGAN
  `prisma migrate dev`/`diff` raw** (drop seluruh warehouse). Migrasi MDP =
  **additive DDL** hasil extract dari `migrate diff` dengan semua DROP/drift
  md_* dibuang, lalu apply terkontrol (lihat alur di §Migrasi).

## Migrasi (alur aman yang dipakai)

1. Tulis/ubah `apps/api-gateway/prisma/schema/mdp-*.prisma`.
2. `prisma migrate diff --from-schema-datasource prisma/schema
   --to-schema-datamodel prisma/schema --script` → review.
3. **Extract hanya statement yang menyasar tabel MDP** (`eam_/mdp_/mes_/qms_/...`
   + `CREATE TYPE "Mdp...`). Buang SEMUA `DROP`/drift md_* (diff penuh =
   destruktif, jangan apply mentah). Pastikan 0 DROP & semua FK REFERENCES hanya
   ke tabel MDP.
4. Simpan ke `apps/api-gateway/prisma/migrations/<ts>_mdp_<slug>/migration.sql`.
5. Apply terskop: `prisma db execute --file <sql> --schema prisma/schema` lalu
   `prisma migrate resolve --applied <migration-name>`. **JANGAN `migrate
   deploy`** (akan ikut apply migrasi team yang pending & tak terkait).
6. **Regen Prisma client DI DALAM container** (container punya node_modules
   volume sendiri): `docker exec sentient-infra-api-gateway sh -lc 'npx prisma
   generate'` lalu restart container. Smoke test endpoint (401 = wired+guarded).

## Status (per 2026-06-28)

- **Fase 0** ✅ design docs foundation (CLAUDE.md + db-design hub +
  module-roadmap).
- **Fase 1** ✅ scaffold `apps/web-mdp` (Next 16, boots/builds, port 3220,
  terdaftar di config/ports.json). **UFW 3220 ✅ DONE** (rule LAN sudah ada).
- **Fase 2 MES** ✅ catalogued (`db-design/entities-mes.md`) + **Prisma
  migrated** (`mdp-mes.prisma`, 10 model + 5 enum, migrasi `20260628_001_mdp_mes`
  live).
- **MES vertical slice LIVE**: backend `erp-mdp-work-centers` +
  `erp-mdp-production-orders` (`/api/mdp/work-centers`, `/api/mdp/production-orders`,
  verified 401). UI `web-mdp`: `lib/api.ts` + production-orders-page (list+create)
  di route `/app/mes`.
- **Foundation masters LIVE** (2026-06-28): backend CRUD `erp-mdp-shifts`,
  `erp-mdp-reason-codes`, `erp-mdp-assets` (`/api/mdp/{shifts,reason-codes,assets}`,
  verified 401, terdaftar di app.module). UI `web-mdp`: organism reusable
  `MasterCrudPage` (list+search+create/edit+soft-delete) + atom `StatusBadge`;
  4 page config (work-centers, assets, shifts, reason-codes) di
  `/app/master/*` + landing `/app/master` (registry `lib/masters.ts` +
  `MasterGrid`) + nav Database di app-shell. API client `lib/api.ts` punya
  factory `crudResource()` (shifts/reasonCodes/assets/workCenters).
- **Seed foundation LIVE**: `prisma/seed-mdp-foundation.ts` (`npm run db:seed:mdp`,
  idempotent upsert by code) → 4 assets, 5 work centers, 3 shifts, 8 reason codes,
  3 sample production orders (link ke `md_items` nyata via scalar FK).
- **MES backend COMPLETE** (2026-06-28): keenam entitas `mes_*` punya CRUD
  terguard di `/api/mdp/{production-orders,operations,production-logs,
  material-consumptions,downtime-events,labor-logs}` (semua verified 401). Sorotan:
  production-logs **recompute rollup order** di `$transaction` (MES-4); downtime &
  labor derive `durationSeconds` on close; operations goodQty/scrapQty manual-entry;
  material-consumptions itemId/sourceBinId cross-app scalar (tak di-assert),
  postingStatus PENDING s/d emit. Tabel sudah ter-migrasi (`20260628_001_mdp_mes`)
  → **tanpa migrasi baru**; terdaftar di app.module, container restart, typecheck
  bersih. api.ts: crudResource + tipe utk semua. ⚠️ **UI MES eksekusi belum ada**
  (baru backend+api-client; hanya production-orders punya page list+create).

- **MES UI execution COMPLETE** (2026-06-28): keenam entitas punya page list+create/edit
  di `/app/mes/*` (orders, operations, logs, consumptions, downtime, labor) via organism
  `MasterCrudPage` + molecule `MesNav`. Ditambah tipe field reusable `datetime`
  (datetime-local ↔ ISO) di MasterCrudPage. FK = input ID mentah (functional slice).
- **Foundation bolong CLOSED** (2026-06-28): migrasi additive `20260628144144_mdp_foundation`
  (mdp_work_calendars + mdp_menus + mdp_role_menus, 0 DROP, applied+resolved). Backend CRUD
  `/api/mdp/{work-calendars,menus,role-menus}` (verified 401, di app.module). UI master
  `work-calendars` + `menus`. Seed +2 calendars, +14 menus. **Decision #1 RESOLVED = thin
  mapping** (mdp_role_menus: scalar roleId→adm_roles, menuId→mdp_menus). api.ts diperluas.

- **Role-filtered nav LIVE** (2026-06-28): `GET /api/mdp/menus/nav` (service `nav()` di
  erp-mdp-menus) resolve user→`adm_user_roles`→`mdp_role_menus`→pohon menu (+ancestor;
  fallback full tree bila tak ada mapping). Dikonsumsi organism `DynamicSidebar`
  (fetch + fallback ke `MDP_MODULES` statis) gantikan sidebar statis di `app-shell`.
- **WMS COMPLETE** (2026-06-28): katalog `db-design/entities-wms.md`; schema `mdp-wms.prisma`
  (4 model wms_tasks/picks/movements/handling_units + 4 enum MdpWms*); migrasi additive
  `20260628161907_mdp_wms` (0 DROP, applied+resolved). Backend CRUD `/api/mdp/wms/{tasks,
  picks,movements,handling-units}` (verified 401, di app.module). UI `/app/wms/*` (MasterCrudPage
  + molecule `WmsNav`). api.ts + seed (2 HU, 2 task, 1 movement) + menu tree wms. Movement→ERP
  `inv_` posting = decision #3 (postingStatus PENDING, stub).
- **QMS COMPLETE** (2026-06-28): katalog `db-design/entities-qms.md`; schema `mdp-qms.prisma`
  (6 model qms_inspection_plans/characteristics/inspections/results/nonconformances/capa_actions
  + 9 enum MdpQms*; enum verdict = `MdpQmsInspectionVerdict` agar tak bentrok model
  `MdpQmsInspectionResult`); migrasi additive `20260628164110_mdp_qms` (0 DROP, applied+resolved).
  Backend CRUD `/api/mdp/qms/{plans,characteristics,inspections,results,nonconformances,
  capa-actions}` (verified 401, di app.module). UI `/app/quality/*` (MasterCrudPage + molecule
  `QmsNav`). api.ts + 7 menu rows qms (via SQL upsert — ts-node absen di container/host).
  Disposisi NCR **tidak** auto-posting ke stok/MES (QMS hanya flag). Plan/inspection 6-tabel
  (keputusan user) agar hasil ukur per-karakteristik queryable. Backend di-generate via
  data-driven script (mirror pola wms; typecheck container bersih).
- **CMMS COMPLETE** (2026-06-28): katalog `db-design/entities-cmms.md`; schema `mdp-cmms.prisma`
  (4 model mnt_work_orders/pm_schedules/spare_parts/failure_codes + 6 enum MdpMnt*); migrasi
  additive `20260628173639_mdp_cmms` (0 DROP, applied+resolved). Backend CRUD
  `/api/mdp/mnt/{work-orders,pm-schedules,spare-parts,failure-codes}` (verified 401, di
  app.module). UI `/app/maintenance/*` (MasterCrudPage + molecule `MntNav`). api.ts + 5 menu
  rows mnt (seed file + SQL upsert). mnt→eam refs (assetId/workCenterId) = cross-domain scalar;
  spare-parts itemId/qty required → generator di-patch (required bigint pakai `BigInt()` bukan
  `toBig()` di create+update). Spare issue→ERP `inv_` = decision #3 (postingStatus PENDING, stub).
  ⚠️ **Container kini production-mode** (`build && start:prod` dari docker-compose yg diubah sesi
  lain) → restart = full `nest build` (~2-3 mnt), bukan watch; build error = server tak naik.

- **DMS/PRTS/IMS/LMS COMPLETE** (2026-06-28): 4 modul terakhir di-generate sekaligus via
  `gen-rest.js` (extend gen: backend + page + route + nav + api.ts splice dari satu config).
  Schemas `mdp-{prts,dms,ims,lms}.prisma` (11 model total: prt_issues/escalations,
  dms_documents/revisions/acknowledgements, ehs_incidents/audits/permits,
  lms_courses/enrollments/competencies). 4 migrasi additive (`mdp_prts/dms/ims/lms`, 0 DROP).
  Backend CRUD `/api/mdp/{prt,dms,ehs,lms}/*` (semua 401, di app.module). UI `/app/{problems,
  documents,qhse,training}/*` (MasterCrudPage + 4 nav molecule Prt/Dms/Ehs/LmsNav). 15 menu
  rows (SQL). **Generator bug ke-3 fixed:** child update REQUIRED datetime pakai `new Date()`
  bukan nullable expr (selain bigint required yg sudah). Generator dpt `bool` support
  (lms isMandatory). Semua 8 modul MOM full-stack DONE; sisa = OEE overlay.

### Pending / next
- `mdp_role_menus` belum ada admin UI khusus (backend siap; role mappings belum di-seed →
  nav saat ini pakai fallback full-tree untuk semua user).
- Port stack UI penuh web-erp §2.7 (keyboard-nav/kebab/bulk); FK lookup-select di form.
- ERP-emit outbox (decision #3, masih stub) — MES consumptions + WMS movements menunggu emit.
- **Build order modul**: mdp/eam foundation ✅ → MES ✅ → WMS ✅ → QMS ✅ → CMMS ✅ →
  DMS ✅ PRTS ✅ IMS ✅ LMS ✅ → **OEE overlay** (berikutnya, satu-satunya yang tersisa).

## Bootstrap sesi baru (resume checklist)

Saat melanjutkan di sesi lain:
1. Baca `apps/web-mdp/CLAUDE.md` + `apps/web-mdp/db-design/README.md` +
   `module-roadmap.md` (status & build order terbaru).
2. Untuk modul yang sedang dikerjakan, baca katalog `db-design/entities-<mod>.md`.
3. Cek schema Prisma `apps/api-gateway/prisma/schema/mdp-*.prisma` & modul
   backend `apps/api-gateway/src/erp-mdp-*`.
4. Recall memory [[mdp-layer3-architecture]] untuk keputusan & progress.
5. Verifikasi container backend hidup: `docker ps | grep api-gateway`; endpoint
   `/api/mdp/*` harus balas 401 (bukan 404) bila wired.

## Disiplin dokumen (sama seperti erp)

Setiap keputusan/perubahan flow/konvensi/status → **WAJIB update `.md` di
`apps/web-mdp/`**: rulebook ke `CLAUDE.md`, skema ke `db-design/`. Catat sebagai
fakta ringkas (keputusan + alasan), bukan log percakapan. Update memory
[[mdp-layer3-architecture]] saat progress berubah. Jangan declare selesai
sebelum dokumen sinkron.

## Saat ragu

Tanya user. `apps/web-mdp/CLAUDE.md` adalah otoritas — kalau skill ini berbeda
dengan file itu, file itu yang menang; perbarui skill ini agar sinkron.
