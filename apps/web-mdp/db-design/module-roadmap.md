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

`mdp`/`eam` foundation → **MES** (anchor) → **WMS** → **QMS** → **CMMS** →
**DMS · PRTS · IMS · LMS** → **OEE** overlay.

---

## 0. `mdp` — Platform config & shared master

Shared across all modules; built in Phase 1 alongside scaffold.

| Entity | Table | Notes |
| --- | --- | --- |
| Shift | `mdp_shifts` | Shift definitions (start/end, breaks) for MES/OEE. |
| Work calendar | `mdp_work_calendars` | Planned operating time; basis for OEE availability. |
| Reason code | `mdp_reason_codes` | Catalog: downtime/scrap/delay reasons (typed). |
| Menu / nav | `mdp_menus` | Nav SSOT for MDP shell (mirror `sys_menus` pattern). |
| Access map | `mdp_role_menus` *(open #1)* | MDP role→menu; identity stays `adm_users`. |

---

## 1. `eam` — Equipment / Asset registry (L3–L4 backbone)

Built early; MES/CMMS/OEE all depend on it.

| Entity | Table | Notes |
| --- | --- | --- |
| Asset | `eam_assets` | Maintained equipment master. Scalar `erpFixedAssetId?` → ERP `fa_assets`. |
| Asset hierarchy | `eam_asset_hierarchies` | Plant → area → line → machine → component tree. |
| Work center | `eam_work_centers` | Production resource grouping (used by MES routing). |
| Meter / counter | `eam_meters` | Runtime/cycle counters (basis for usage-based PM & OEE). |

---

## 2. `mes` — Manufacturing Execution (ANCHOR)

Consumes ERP `mfg_work_orders` / `mfg_boms` / `md_items`. **Manual entry first.**

| Entity | Table | Notes |
| --- | --- | --- |
| Production order | `mes_production_orders` | Executable order; `erpWorkOrderId` → ERP `mfg_work_orders`. |
| Operation / step | `mes_operations` | Routing steps per order, at a work center. |
| Production log | `mes_production_logs` | Good/scrap qty, start/stop, operator — the result ERP ingests. |
| Material consumption | `mes_material_consumptions` | Components consumed (→ ERP `inv_` issue). |
| Downtime event | `mes_downtime_events` | Stoppages tagged with `mdp_reason_codes` (OEE availability). |
| Labor log | `mes_labor_logs` | Operator time per operation (reuse `adm_users`). |

---

## 3. `wms` — Warehouse Execution

Physical execution that **emits** movements ERP posts to `inv_stock_movements`.
References `md_storage_bins`. Does **not** own stock balances.

| Entity | Table | Notes |
| --- | --- | --- |
| Task | `wms_tasks` | Putaway / pick / move / count task (typed, assignable). |
| Pick | `wms_picks` | Pick lines against a task/order. |
| Movement | `wms_movements` | Completed physical move; emitted to ERP `inv_`. |
| License plate / handling unit | `wms_handling_units` | Pallet/container grouping (optional). |

---

## 4. `qms` — Quality Management

Inspection hooks into MES output & ERP goods receipts.

| Entity | Table | Notes |
| --- | --- | --- |
| Inspection plan | `qms_inspection_plans` | Characteristics + spec limits per item/operation. |
| Inspection | `qms_inspections` | Recorded results (incoming/in-process/final). |
| Nonconformance (NCR) | `qms_nonconformances` | Defect record; links to `mes`/`inv`/`pur`. |
| CAPA action | `qms_capa_actions` | Corrective/preventive actions + follow-up. |

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
