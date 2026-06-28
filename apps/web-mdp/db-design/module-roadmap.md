# Web-MDP — Module Roadmap (Level 3 / MOM → semantic domains)

> Status: **ROADMAP (coarse mapping)** — core-entity inventory only, **no field
> catalog**. Date: 2026-06-27 · Product: Senti MDP, `apps/web-mdp`.
> Per-module field-level catalogs are produced **one module at a time, after
> review** (same method as `web-erp/db-design/module-roadmap.md`).

Extends [db-design/README.md](README.md). Maps each MOM module (from the ISA-95
screenshot) to its **semantic domain** ([CLAUDE.md §1](../CLAUDE.md)) and its
**modern core entities** (core subset, not exhaustive). All conventions inherited
from `web-erp/db-design §3`. Cross-app refs (→ ERP) = scalar `BigInt` FK.

## Build order (dependency-driven)

`mdp`/`eam` foundation ✅ → **MES** ✅ → **WMS** ✅ → **QMS** ✅ → **CMMS** →
**DMS · PRTS · IMS · LMS** → **OEE** overlay. *(Role-filtered nav live:
`/api/mdp/menus/nav` + `DynamicSidebar` consume `mdp_menus`+`mdp_role_menus`.)*

---

## 0. `mdp` — Platform config & shared master

Shared across all modules; built in Phase 1 alongside scaffold.

| Entity | Table | Notes |
| --- | --- | --- |
| Shift | `mdp_shifts` | ✅ **CRUD live** (`/api/mdp/shifts`, UI `/app/master/shifts`). Shift definitions (start/end) for MES/OEE. |
| Work calendar | `mdp_work_calendars` | ✅ **CRUD live** (`/api/mdp/work-calendars`, UI `/app/master/work-calendars`). Planned operating time (plannedMinutesPerDay × workingDaysPerWeek); basis for OEE availability. |
| Reason code | `mdp_reason_codes` | ✅ **CRUD live** (`/api/mdp/reason-codes`, UI `/app/master/reason-codes`). Typed catalog: downtime/scrap/delay/quality. |
| Menu / nav | `mdp_menus` | ✅ **CRUD live** (`/api/mdp/menus`, UI `/app/master/menus`). Nav SSOT (self-tree, mirror `sys_menus`); seeded MES + master tree. |
| Access map | `mdp_role_menus` | ✅ **Backend live** (`/api/mdp/role-menus`). Decision #1 **resolved = thin mapping**: scalar `roleId` → ERP `adm_roles` (no DB-FK) + `menuId` → `mdp_menus`; `canView`/`canEdit`. Identity stays `adm_users`. *(No dedicated admin UI yet.)* |

> **Foundation CRUD shipped (2026-06-28):** shifts + reason-codes + work-calendars
> + menus (mdp), work-centers + assets (eam), and role-menus (backend) have backend
> CRUD modules; all but role-menus have web-mdp master pages (reusable
> `MasterCrudPage` organism) + seed (`npm run db:seed:mdp` → 2 calendars, 14 menus).
> Migration `20260628144144_mdp_foundation` (additive: mdp_work_calendars +
> mdp_menus + mdp_role_menus).

---

## 1. `eam` — Equipment / Asset registry (L3–L4 backbone)

Built early; MES/CMMS/OEE all depend on it.

| Entity | Table | Notes |
| --- | --- | --- |
| Asset | `eam_assets` | ✅ **CRUD live** (`/api/mdp/assets`, UI `/app/master/assets`). Maintained equipment master. Scalar `erpFixedAssetId?` → ERP `fa_assets`. |
| Asset hierarchy | `eam_asset_hierarchies` | *(not yet)* Plant → area → line → machine → component tree. |
| Work center | `eam_work_centers` | ✅ **CRUD live** (`/api/mdp/work-centers`, UI `/app/master/work-centers`). Production resource grouping (used by MES routing). |
| Meter / counter | `eam_meters` | *(not yet)* Runtime/cycle counters (basis for usage-based PM & OEE). |

---

## 2. `mes` — Manufacturing Execution (ANCHOR) ✅ catalogued + ✅ migrated

> **Field catalog + Prisma done:** [entities-mes.md](entities-mes.md) (6 `mes_*`
> entities + minimal `mdp`/`eam` foundation + 5 enums). Schema at
> `apps/api-gateway/prisma/schema/mdp-mes.prisma`; migration `20260628_001_mdp_mes`
> live on DB. The table below is the original coarse plan, kept for context.

Consumes ERP `mfg_work_orders` / `mfg_boms` / `md_items`. **Manual entry first.**

| Entity | Table | Notes |
| --- | --- | --- |
| Production order | `mes_production_orders` | ✅ **CRUD live** (`/api/mdp/production-orders`). Executable order; `erpWorkOrderId` → ERP `mfg_work_orders`. |
| Operation / step | `mes_operations` | ✅ **CRUD live** (`/api/mdp/operations`). Routing steps per order, at a work center; sequenced. |
| Production log | `mes_production_logs` | ✅ **CRUD live** (`/api/mdp/production-logs`). Good/scrap qty, start/stop, operator — the result ERP ingests. Mutations recompute parent-order `producedGoodQty`/`producedScrapQty` rollup (MES-4). |
| Material consumption | `mes_material_consumptions` | ✅ **CRUD live** (`/api/mdp/material-consumptions`). Components consumed (→ ERP `inv_` issue); `postingStatus` PENDING until emit. |
| Downtime event | `mes_downtime_events` | ✅ **CRUD live** (`/api/mdp/downtime-events`). Stoppages tagged with `mdp_reason_codes`; `durationSeconds` derived on close (OEE availability). |
| Labor log | `mes_labor_logs` | ✅ **CRUD live** (`/api/mdp/labor-logs`). Operator time per operation; `durationSeconds` derived on close. |

> **MES backend COMPLETE (2026-06-28):** all 6 `mes_*` entities have guarded CRUD
> at `/api/mdp/{production-orders,operations,production-logs,material-consumptions,downtime-events,labor-logs}`
> (verified 401). No new migration — all tables existed since `20260628_001_mdp_mes`.
>
> **MES UI COMPLETE (2026-06-28):** all 6 entities now have list+create/edit pages
> under `/app/mes/*` (orders, operations, logs, consumptions, downtime, labor) via
> the reusable `MasterCrudPage` organism + `MesNav` sub-nav molecule. Added a
> reusable `datetime` field type to `MasterCrudPage` (datetime-local ↔ ISO). FK
> inputs are raw ID text (functional slice; lookup-select port is a later pass).

---

## 3. `wms` — Warehouse Execution ✅ catalogued + ✅ migrated + ✅ backend + UI

> **Field catalog + Prisma done:** [entities-wms.md](entities-wms.md) (4 `wms_*`
> entities + 4 enums). Schema `apps/api-gateway/prisma/schema/mdp-wms.prisma`;
> migration `20260628161907_mdp_wms` (additive) live.

Physical execution that **emits** movements ERP posts to `inv_stock_movements`.
References `md_storage_bins` (scalar). Does **not** own stock balances.

| Entity | Table | Notes |
| --- | --- | --- |
| Task | `wms_tasks` | ✅ **CRUD live** (`/api/mdp/wms/tasks`, UI `/app/wms`). Putaway/pick/move/count/replenish (typed, assignable; scalar refs to md_items/md_storage_bins/mes_production_orders/adm_users). |
| Pick | `wms_picks` | ✅ **CRUD live** (`/api/mdp/wms/picks`, UI `/app/wms/picks`). Pick lines against a task; qtyRequested/qtyPicked; optional handling unit. |
| Movement | `wms_movements` | ✅ **CRUD live** (`/api/mdp/wms/movements`, UI `/app/wms/movements`). Completed physical move; `postingStatus` PENDING until emit to ERP `inv_` (decision #3 outbox, stubbed). |
| License plate / handling unit | `wms_handling_units` | ✅ **CRUD live** (`/api/mdp/wms/handling-units`, UI `/app/wms/handling-units`). Pallet/container grouping. |

> **WMS COMPLETE (2026-06-28):** all 4 entities have guarded CRUD + web-mdp UI
> (`MasterCrudPage` + `WmsNav` sub-nav). Movement→ERP posting deferred (decision #3).

---

## 4. `qms` — Quality Management ✅ catalogued + ✅ migrated + ✅ backend + UI

> **Field catalog + Prisma done:** [entities-qms.md](entities-qms.md) (6 `qms_*`
> entities + 9 enums). Schema `apps/api-gateway/prisma/schema/mdp-qms.prisma`;
> migration `20260628164110_mdp_qms` (additive, 0 DROP) live.

Records quality results against MES output & ERP goods receipts. **Flags**
dispositions (scrap/rework/return) but does **not** post stock — ERP/MES realize
the move. Model depth = 6 tables (plan+characteristics, inspection+results child
lines) so per-characteristic measurements are queryable.

| Entity | Table | Notes |
| --- | --- | --- |
| Inspection plan | `qms_inspection_plans` | ✅ **CRUD live** (`/api/mdp/qms/plans`, UI `/app/quality`). Spec template per item/operation (scalar refs). |
| Characteristic | `qms_inspection_characteristics` | ✅ **CRUD live** (`/api/mdp/qms/characteristics`). Child of plan: spec limits (nominal/LSL/USL), variable/attribute. |
| Inspection | `qms_inspections` | ✅ **CRUD live** (`/api/mdp/qms/inspections`). Recorded inspection (incoming/in-process/final), verdict PENDING/PASS/FAIL. |
| Inspection result | `qms_inspection_results` | ✅ **CRUD live** (`/api/mdp/qms/results`). Child: measured value per characteristic + pass/fail. |
| Nonconformance (NCR) | `qms_nonconformances` | ✅ **CRUD live** (`/api/mdp/qms/nonconformances`). Defect record + disposition; scalar links to item/PO/ERP doc; intra-FK to inspection. |
| CAPA action | `qms_capa_actions` | ✅ **CRUD live** (`/api/mdp/qms/capa-actions`). Corrective/preventive + verification; intra-FK to NCR (may be standalone). |

> **QMS COMPLETE (2026-06-28):** all 6 entities have guarded CRUD + web-mdp UI
> (`MasterCrudPage` + `QmsNav` sub-nav at `/app/quality/*`). Disposition→ERP
> stock/MES not auto-posted (QMS flags only). FK fields = raw ID (functional slice).

---

## 5. `mnt` — Maintenance (CMMS)

Maintains `eam_assets`; spares are ERP `md_items` + `inv_`.

| Entity | Table | Notes |
| --- | --- | --- |
| Maintenance WO | `mnt_work_orders` | Corrective/preventive WO against an `eam_asset`. |
| PM schedule | `mnt_pm_schedules` | Time- or meter-based preventive triggers. |
| Spare usage | `mnt_spare_parts` | Parts consumed on a WO (→ ERP `inv_` issue). |
| Failure code | `mnt_failure_codes` | Failure/cause/remedy taxonomy. |

---

## 6. `prt` — Problem & Issue Tracking (PRTS)

Andon-style capture & escalation; links to any execution record.

| Entity | Table | Notes |
| --- | --- | --- |
| Issue | `prt_issues` | Problem ticket (source: line/machine/quality). |
| Escalation | `prt_escalations` | Escalation steps + SLA timers. |

---

## 7. `dms` — Document Management

Controlled documents (SOP, work instructions, drawings).

| Entity | Table | Notes |
| --- | --- | --- |
| Document | `dms_documents` | Controlled doc header + classification. |
| Revision | `dms_revisions` | Version history with approval state. |
| Acknowledgement | `dms_acknowledgements` | Read/understood sign-off per user. |

---

## 8. `ehs` — QHSE / IMS (integrated)

| Entity | Table | Notes |
| --- | --- | --- |
| Incident | `ehs_incidents` | Safety/environment incident + investigation. |
| Audit | `ehs_audits` | Inspection/audit checklists + findings. |
| Work permit | `ehs_permits` | Permit-to-work (hot work, confined space, …). |

---

## 9. `lms` — Learning Management

| Entity | Table | Notes |
| --- | --- | --- |
| Course | `lms_courses` | Training course/material catalog. |
| Enrollment | `lms_enrollments` | User progress + completion. |
| Competency | `lms_competencies` | Skill matrix; gates who may run an operation. |

---

## 10. OEE — derived overlay (NOT a module)

No own tables. **OEE = Availability × Performance × Quality**, computed from:

- **Availability** ← `mdp_work_calendars` planned time − `mes_downtime_events`.
- **Performance** ← `mes_production_logs` actual vs ideal cycle on `eam_work_centers`.
- **Quality** ← good vs scrap (`mes_production_logs`) + `qms_nonconformances`.

Implementation: a view (default) or materialized rollup if slow (open #5).
