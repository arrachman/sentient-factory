# Web-MDP — DMS field catalog (`dms` domain)

> Status: **CATALOGUED + MIGRATED (2026-06-28).** Module: Controlled Documents.
> Extends [README.md](README.md) + [module-roadmap.md](module-roadmap.md).

## Scope
Controlled documents (SOP, work instructions, drawings) with revision history +
read/understood acknowledgement. Cross-app refs (`adm_users`) = scalar BigInt.
Intra-`dms` FKs (document→revisions, document→acks, revision→acks) enforced.

## Enums
- `MdpDmsCategory`: SOP · WORK_INSTRUCTION · DRAWING · POLICY · FORM · RECORD · OTHER
- `MdpDmsDocStatus`: DRAFT · IN_REVIEW · APPROVED · RELEASED · OBSOLETE
- `MdpDmsRevisionStatus`: DRAFT · IN_REVIEW · APPROVED · SUPERSEDED

## Entities
- **`dms_documents`** (header) — `code`·`name`·`category?`·`status`·
  `currentRevision?`·`ownerId?`·`description?`·`effectiveAt?`·audit·soft-delete·
  metadata. Has `revisions[]`, `acknowledgements[]`.
- **`dms_revisions`** (child) — `documentId`(@relation)·`revisionCode`·`status`·
  `filePath?`·`changeSummary?`·`approvedById?`·`approvedAt?`·notes·audit·soft-delete.
- **`dms_acknowledgements`** (child) — `documentId`(@relation)·`revisionId?`(@relation)·
  `userId`·`acknowledgedAt`·notes·audit·soft-delete.

## Status
✅ Prisma `mdp-dms.prisma` (3 models + 3 enums) · migration `mdp_dms` (0 DROP) ·
backend `/api/mdp/dms/{documents,revisions,acknowledgements}` (401) · UI
`/app/documents/*` (MasterCrudPage + DmsNav). FK fields = raw ID (functional slice).
