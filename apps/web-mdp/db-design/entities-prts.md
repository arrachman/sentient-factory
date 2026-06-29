# Web-MDP — PRTS field catalog (`prt` domain)

> Status: **CATALOGUED + MIGRATED (2026-06-28).** Module: Problem & Issue
> Tracking (Andon). Extends [README.md](README.md) + [module-roadmap.md](module-roadmap.md).

## Scope
Andon-style problem capture + escalation; links to any execution record. All
cross-domain (`eam_assets`, `eam_work_centers`, `mes_production_orders`) and
cross-app (`adm_users`) refs = scalar BigInt. Intra-`prt` FK (issue→escalations)
enforced.

## Enums
- `MdpPrtIssueType`: QUALITY · MACHINE · SAFETY · MATERIAL · PROCESS · OTHER
- `MdpPrtSeverity`: LOW · MEDIUM · HIGH · CRITICAL
- `MdpPrtIssueStatus`: OPEN · ACKNOWLEDGED · IN_PROGRESS · RESOLVED · CLOSED · CANCELLED
- `MdpPrtEscalationStatus`: PENDING · ACKNOWLEDGED · RESOLVED

## Entities
- **`prt_issues`** (header) — `code`·`name`·`type`·`severity`·`status`·`source?`·
  scalar refs `assetId?`/`workCenterId?`/`productionOrderId?`·`description?`·
  `reportedById?`/`assignedToId?`·`raisedAt`·`resolvedAt?`·`resolution?`·notes·audit·
  soft-delete·metadata. Has `escalations[]`.
- **`prt_escalations`** (child) — `issueId`(@relation)·`level`·`escalatedToId?`·
  `escalatedAt`·`dueAt?`·`status`·`reason?`·notes·audit·soft-delete.

## Status
✅ Prisma `mdp-prts.prisma` (2 models + 4 enums) · migration `mdp_prts` (0 DROP) ·
backend `/api/mdp/prt/{issues,escalations}` (401) · UI `/app/problems/*`
(MasterCrudPage + PrtNav). FK fields = raw ID (functional slice).
