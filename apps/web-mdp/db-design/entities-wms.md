# Web-MDP — WMS field catalog (`wms` domain)

> Status: **CATALOGUED + MIGRATED (2026-06-28).** Module: Warehouse Execution
> (ISA-95 L3). Extends [README.md](README.md) + [module-roadmap.md](module-roadmap.md).
> Conventions inherited from `web-erp/db-design §3` (see [CLAUDE.md](../CLAUDE.md)).

## Scope & integration contract (authoritative)

WMS is **physical execution only**. It does **not** own stock balances — it
**emits movements** that ERP `inv_` posts to `inv_stock_movements` (L4↔L3
contract, README §Integrasi). Bins reference ERP `md_storage_bins` (scalar
BigInt, no DB-FK). The ERP-emit (outbox) contract is **decision #3 — still
stubbed**: `wms_movements.postingStatus` stays `PENDING` until emit is wired.

Cross-app refs (`md_items`, `md_storage_bins`, `adm_users`, ERP doc refs) and
cross-domain MDP refs (`mes_production_orders`) = **scalar BigInt + @@index, NO
@relation**. Intra-`wms` FKs (task→picks, task→movements, HU links) **enforced**.

## Enums

- `MdpWmsTaskType`: `PUTAWAY` · `PICK` · `MOVE` · `COUNT` · `REPLENISH`
- `MdpWmsTaskStatus`: `OPEN` · `IN_PROGRESS` · `COMPLETED` · `CANCELLED`
- `MdpWmsPostingStatus`: `PENDING` · `POSTED` · `FAILED` (movement → ERP `inv_`)
- `MdpWmsHandlingUnitStatus`: `OPEN` · `CLOSED` · `SHIPPED`

## Entities

### `wms_tasks` — work unit (typed, assignable)
`code` (unique) · `type` (MdpWmsTaskType) · `status` (default OPEN) ·
`itemId?`→md_items · `qty?`/`uomCode?` · `sourceBinId?`/`destBinId?`→md_storage_bins ·
`productionOrderId?`→mes_production_orders (scalar) · `erpReferenceType?`/`erpReferenceId?`
(ERP doc, e.g. GRN/DO) · `assignedToId?`→adm_users · `priority` (Int, default 0) ·
`notes?` · isActive · audit · soft-delete · metadata. Has `picks[]`, `movements[]`.

### `wms_handling_units` — pallet / container / license plate
`code` (unique) · `status` (default OPEN) · `currentBinId?`→md_storage_bins ·
`notes?` · isActive · audit · soft-delete · metadata. Has `picks[]`, `movements[]`.

### `wms_picks` — pick line against a task
`taskId`→wms_tasks (@relation) · `itemId`→md_items · `qtyRequested` ·
`qtyPicked` (default 0) · `sourceBinId?`→md_storage_bins ·
`handlingUnitId?`→wms_handling_units (@relation) · `status` (MdpWmsTaskStatus,
default OPEN) · `notes?` · audit · soft-delete. (No `code` — child line.)

### `wms_movements` — completed physical move (emitted to ERP `inv_`)
`code` (unique) · `taskId?`→wms_tasks (@relation) · `itemId`→md_items · `qty` ·
`uomCode?` · `fromBinId?`/`toBinId?`→md_storage_bins ·
`handlingUnitId?`→wms_handling_units (@relation) · `movedAt` (timestamptz) ·
`movedById?`→adm_users · `postingStatus` (default PENDING) ·
`erpStockMovementId?`→ERP inv_stock_movements (set on post) · `postedAt?` ·
`notes?` · audit · soft-delete · metadata.

## Status

✅ Prisma `apps/api-gateway/prisma/schema/mdp-wms.prisma` (4 models + 4 enums).
✅ Migration `mdp_wms` (additive). ✅ Backend CRUD `/api/mdp/wms/{tasks,picks,
movements,handling-units}` (guarded). ✅ web-mdp UI `/app/wms/*` (MasterCrudPage).
Movement→ERP posting deferred (decision #3 outbox).
