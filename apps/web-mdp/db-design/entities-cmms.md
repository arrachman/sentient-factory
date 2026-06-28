# Web-MDP — CMMS field catalog (`mnt` domain)

> Status: **CATALOGUED + MIGRATED (2026-06-28).** Module: Maintenance / CMMS
> (ISA-95 L3). Extends [README.md](README.md) + [module-roadmap.md](module-roadmap.md).
> Conventions inherited from `web-erp/db-design §3` (see [CLAUDE.md](../CLAUDE.md)).

## Scope & integration contract (authoritative)

CMMS maintains **`eam_assets`** (the equipment registry). It schedules and
executes maintenance work orders; spare parts consumed on a WO **emit** an ERP
`inv_` issue (decision #3 outbox, **stubbed** — `postingStatus` stays `PENDING`).
CMMS does not own stock; spares are ERP `md_items`.

Cross-domain refs (`eam_assets`, `eam_work_centers` — `eam` is a separate domain
from `mnt`) and cross-app refs (`md_items`, `adm_users`, ERP `inv_`) = **scalar
BigInt + @@index, NO @relation**. Intra-`mnt` FKs (WO→spare_parts,
pm_schedule→WO, failure_code→WO) are **enforced** with `@relation`.

> Meter-based PM references a runtime counter; `eam_meters` is **not yet** built
> (roadmap §1). For now meter triggers are captured by `meterType`/`meterInterval`
> scalars (clean extension point) — no hard meter FK.

## Enums

- `MdpMntWorkOrderType`: `CORRECTIVE` · `PREVENTIVE` · `PREDICTIVE` · `INSPECTION`
- `MdpMntWorkOrderStatus`: `OPEN` · `SCHEDULED` · `IN_PROGRESS` · `ON_HOLD` · `COMPLETED` · `CANCELLED`
- `MdpMntPriority`: `LOW` · `MEDIUM` · `HIGH` · `URGENT`
- `MdpMntPmTriggerType`: `TIME_BASED` · `METER_BASED`
- `MdpMntFailureCodeType`: `FAILURE` · `CAUSE` · `REMEDY`
- `MdpMntPostingStatus`: `PENDING` · `POSTED` · `FAILED` (spare issue → ERP `inv_`)

## Entities

### `mnt_failure_codes` — failure/cause/remedy taxonomy (master)
`code` (unique) · `name` · `type` (MdpMntFailureCodeType) · `description?` ·
isActive · audit · soft-delete · metadata. Has `workOrders[]`.

### `mnt_pm_schedules` — preventive trigger (master)
`code` (unique) · `name` · `assetId?`→eam_assets (cross-domain scalar) ·
`workCenterId?`→eam_work_centers (cross-domain scalar) · `triggerType`
(MdpMntPmTriggerType, default TIME_BASED) · `intervalDays?` (Int, time-based) ·
`meterType?` / `meterInterval?` Decimal(19,4) (meter-based) · `lastServiceAt?` /
`nextDueAt?` (timestamptz) · `taskDescription?` · isActive · audit · soft-delete ·
metadata. Has `workOrders[]`.

### `mnt_work_orders` — maintenance work order (header)
`code` (unique) · `name` (short title) · `type` (MdpMntWorkOrderType, default
CORRECTIVE) · `status` (default OPEN) · `priority` (default MEDIUM) ·
`assetId?`→eam_assets (cross-domain scalar) · `workCenterId?`→eam_work_centers
(cross-domain scalar) · `pmScheduleId?`→mnt_pm_schedules (@relation, intra) ·
`failureCodeId?`→mnt_failure_codes (@relation, intra) · `description?` ·
`scheduledStartAt?` / `scheduledEndAt?` / `actualStartAt?` / `actualEndAt?`
(timestamptz) · `downtimeMinutes?` Decimal(19,4) · `reportedById?` /
`assignedToId?`→adm_users (cross-app scalar) · `notes?` · isActive · audit ·
soft-delete · metadata. Has `spareParts[]`.

### `mnt_spare_parts` — part consumed on a WO (child)
`workOrderId`→mnt_work_orders (@relation) · `itemId`→md_items (cross-app scalar) ·
`qty` Decimal(19,4) · `uomCode?` · `postingStatus` (default PENDING) ·
`erpStockMovementId?`→ERP inv_stock_movements (set on post) · `postedAt?`
(timestamptz) · `notes?` · audit · soft-delete. (No `code` — child line.)

## Status

✅ Prisma `apps/api-gateway/prisma/schema/mdp-cmms.prisma` (4 models + 6 enums).
✅ Migration `mdp_cmms` (additive, 0 DROP). ✅ Backend CRUD `/api/mdp/mnt/{work-orders,
pm-schedules,spare-parts,failure-codes}` (guarded). ✅ web-mdp UI `/app/maintenance/*`
(MasterCrudPage + MntNav). Spare issue→ERP `inv_` deferred (decision #3 outbox).
FK fields = raw ID (functional slice).
