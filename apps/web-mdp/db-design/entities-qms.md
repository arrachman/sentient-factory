# Web-MDP — QMS field catalog (`qms` domain)

> Status: **CATALOGUED + MIGRATED (2026-06-28).** Module: Quality Management
> (ISA-95 L3). Extends [README.md](README.md) + [module-roadmap.md](module-roadmap.md).
> Conventions inherited from `web-erp/db-design §3` (see [CLAUDE.md](../CLAUDE.md)).

## Scope & integration contract (authoritative)

QMS records **quality results** against MES output and ERP goods receipts. It
owns no business stock or document of record — it **references** them. Defect
dispositions (scrap/rework/return) that move stock are realized by ERP `inv_`
/ MES later; QMS only **flags** them (`disposition`), it does not post.

Model depth = **6 tables** (decision 2026-06-28, with user): inspection plans
carry **characteristics** (spec limits) as child lines, and a recorded
inspection carries **results** (measured value per characteristic) as child
lines — the only way to query per-characteristic measurements. NCR + CAPA are
flat headers.

Cross-app refs (`md_items`, `adm_users`, ERP doc refs like GRN/PO) and
cross-domain MDP refs (`mes_operations`, `mes_production_orders`) = **scalar
BigInt + @@index, NO @relation**. Intra-`qms` FKs (plan→characteristics,
inspection→results, inspection→NCR, NCR→CAPA, characteristic→results) are
**enforced** with `@relation`.

## Enums

- `MdpQmsInspectionType`: `INCOMING` · `IN_PROCESS` · `FINAL` (stage of inspection)
- `MdpQmsInspectionVerdict`: `PENDING` · `PASS` · `FAIL` (overall verdict, header)
  — enum name distinct from the `qms_inspection_results` child-line model.
- `MdpQmsCharacteristicType`: `VARIABLE` (numeric/measured) · `ATTRIBUTE` (pass/fail/visual)
- `MdpQmsResultStatus`: `PASS` · `FAIL` · `NA` (per result line)
- `MdpQmsNcrSeverity`: `MINOR` · `MAJOR` · `CRITICAL`
- `MdpQmsNcrStatus`: `OPEN` · `UNDER_REVIEW` · `CONTAINED` · `CLOSED` · `CANCELLED`
- `MdpQmsDisposition`: `PENDING` · `USE_AS_IS` · `REWORK` · `REPAIR` · `SCRAP` · `RETURN_TO_SUPPLIER`
- `MdpQmsCapaType`: `CORRECTIVE` · `PREVENTIVE`
- `MdpQmsCapaStatus`: `OPEN` · `IN_PROGRESS` · `IMPLEMENTED` · `VERIFIED` · `CLOSED` · `CANCELLED`

## Entities

### `qms_inspection_plans` — spec template (header)
`code` (unique) · `name` · `type` (MdpQmsInspectionType) · `itemId?`→md_items
(cross-app) · `operationId?`→mes_operations (cross-domain scalar) ·
`description?` · isActive · audit · soft-delete · metadata.
Has `characteristics[]`, `inspections[]`.

### `qms_inspection_characteristics` — spec line (child of plan)
`planId`→qms_inspection_plans (@relation) · `sequence` (Int) · `name` ·
`characteristicType` (default VARIABLE) · `uomCode?` · `nominal?` Decimal(19,4) ·
`lowerLimit?` / `upperLimit?` Decimal(19,4) · `notes?` · audit · soft-delete.
(No `code` — child line.) Has `results[]`.

### `qms_inspections` — recorded inspection (header)
`code` (unique) · `planId?`→qms_inspection_plans (@relation, intra-domain) ·
`type` (MdpQmsInspectionType) · `itemId?`→md_items (cross-app) ·
`productionOrderId?`→mes_production_orders (cross-domain scalar) · `lotCode?` ·
`lotSize?` / `sampleSize?` Decimal(19,4) · `result` (default PENDING) ·
`inspectedAt` (timestamptz) · `inspectedById?`→adm_users (cross-app) · `notes?` ·
isActive · audit · soft-delete · metadata. Has `results[]`, `nonconformances[]`.

### `qms_inspection_results` — measured value (child of inspection)
`inspectionId`→qms_inspections (@relation) ·
`characteristicId?`→qms_inspection_characteristics (@relation, intra-domain) ·
`measuredValue?` Decimal(19,4) · `status` (MdpQmsResultStatus, default PASS) ·
`notes?` · audit · soft-delete. (No `code` — child line.)

### `qms_nonconformances` — NCR (header)
`code` (unique) · `name` (short title) · `description?` · `severity`
(MdpQmsNcrSeverity, default MINOR) · `status` (default OPEN) · `disposition`
(default PENDING) · `sourceType?` (INSPECTION/PRODUCTION/CUSTOMER/SUPPLIER) ·
`itemId?`→md_items (cross-app) · `productionOrderId?`→mes_production_orders
(cross-domain scalar) · `inspectionId?`→qms_inspections (@relation, intra-domain) ·
`qtyAffected?` Decimal(19,4) · `erpReferenceType?` / `erpReferenceId?` (ERP doc,
e.g. GRN/PO) · `detectedAt` (timestamptz) · `detectedById?`→adm_users · `closedAt?` ·
`notes?` · isActive · audit · soft-delete · metadata. Has `capaActions[]`.

### `qms_capa_actions` — corrective/preventive action (header)
`code` (unique) · `name` (short title) · `nonconformanceId?`→qms_nonconformances
(@relation, intra-domain; CAPA may be standalone) · `type` (MdpQmsCapaType,
default CORRECTIVE) · `status` (default OPEN) · `description?` · `rootCause?` ·
`actionPlan?` · `assignedToId?`→adm_users (cross-app) · `dueDate?` /
`completedAt?` / `verifiedAt?` (timestamptz) · `verifiedById?`→adm_users ·
`effectiveness?` · `notes?` · isActive · audit · soft-delete · metadata.

## Status

✅ Prisma `apps/api-gateway/prisma/schema/mdp-qms.prisma` (6 models + 9 enums).
✅ Migration `mdp_qms` (additive, 0 DROP). ✅ Backend CRUD `/api/mdp/qms/{plans,
characteristics,inspections,results,nonconformances,capa-actions}` (guarded).
✅ web-mdp UI `/app/quality/*` (MasterCrudPage + QmsNav). Disposition→ERP
stock/MES not auto-posted (QMS flags only). FK fields = raw ID (functional slice).
