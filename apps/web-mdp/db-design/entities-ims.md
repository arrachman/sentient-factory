# Web-MDP — IMS / QHSE field catalog (`ehs` domain)

> Status: **CATALOGUED + MIGRATED (2026-06-28).** Module: Integrated QHSE (IMS).
> Extends [README.md](README.md) + [module-roadmap.md](module-roadmap.md).

## Scope
Integrated QHSE: incidents, audits, permits-to-work. Three **independent**
headers (no intra-domain FKs). Cross-domain (`eam_assets`/`eam_work_centers`) +
cross-app (`adm_users`) refs = scalar BigInt.

## Enums
- `MdpEhsIncidentType`: INJURY · NEAR_MISS · PROPERTY_DAMAGE · ENVIRONMENTAL · SECURITY · OTHER
- `MdpEhsSeverity`: MINOR · MODERATE · MAJOR · FATAL
- `MdpEhsIncidentStatus`: REPORTED · UNDER_INVESTIGATION · ACTION_PENDING · CLOSED · CANCELLED
- `MdpEhsAuditType`: SAFETY · ENVIRONMENTAL · QUALITY · FIVE_S · INTERNAL · EXTERNAL
- `MdpEhsAuditStatus`: PLANNED · IN_PROGRESS · COMPLETED · CANCELLED
- `MdpEhsPermitType`: HOT_WORK · CONFINED_SPACE · WORKING_AT_HEIGHT · ELECTRICAL · EXCAVATION · CHEMICAL · OTHER
- `MdpEhsPermitStatus`: REQUESTED · APPROVED · ACTIVE · CLOSED · EXPIRED · REJECTED · CANCELLED

## Entities
- **`ehs_incidents`** — `code`·`name`·`type`·`severity`·`status`·`assetId?`·
  `workCenterId?`·`location?`·`description?`·`occurredAt`·`reportedById?`·
  `investigatedById?`·`rootCause?`·`correctiveAction?`·`closedAt?`·notes·audit·soft-delete.
- **`ehs_audits`** — `code`·`name`·`type`·`status`·`scope?`·`workCenterId?`·
  `auditorId?`·`scheduledAt?`·`conductedAt?`·`score?`·`findings?`·notes·audit·soft-delete.
- **`ehs_permits`** — `code`·`name`·`type`·`status`·`assetId?`·`workCenterId?`·
  `location?`·`requestedById?`·`approvedById?`·`validFrom?`·`validTo?`·`description?`·
  notes·audit·soft-delete.

## Status
✅ Prisma `mdp-ims.prisma` (3 models + 7 enums) · migration `mdp_ims` (0 DROP) ·
backend `/api/mdp/ehs/{incidents,audits,permits}` (401) · UI `/app/qhse/*`
(MasterCrudPage + EhsNav). FK fields = raw ID (functional slice).
