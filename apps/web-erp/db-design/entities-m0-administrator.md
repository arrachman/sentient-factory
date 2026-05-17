# Administrator: Entity Catalog (MVP)

> Legacy "Administrator" (m0) is **split by semantic domain** per
> [web-erp/CLAUDE.md §1](../CLAUDE.md): system config → `sys_*`,
> identity & access → `adm_*`. No `erp_` prefix, no numeric `m<n>` segment.

Field-level model. Types are Prisma/Postgres (PK/FK = **`BigInt`**, resolved
[README §8](README.md#8-resolved-decisions-2026-05-17) #2). All entities also carry the
**global audit + soft-delete columns** from [README §3](README.md#3-global-conventions)
(`createdAt`, `updatedAt`, `createdById`, `updatedById`, `deletedAt`) — omitted per-row below.
Masters with legacy lineage also carry **`legacyCode String?`** (nullable, indexed; for
CDC/ETL backfill — resolved §8 #7): here `ErpUser`, `ErpMenu`, `ErpSetting`,
`DocumentNumbering`. `ErpRole`/`ErpPermission` are new (no legacy code).

Legend: 🔑 business key · ➜ FK · ◆ enum · ○ nullable.

---

## Identity & Access (`adm_*`)

### ErpUser  → `adm_users`  (legacy `m0_user`)

| Field | Type | Notes |
| --- | --- | --- |
| id | BigInt PK | surrogate |
| code 🔑 | String unique | username (`ukode`) |
| name | String | display name (`unama`) |
| email ○ | String unique? | new; legacy had none — recommended for reset/notify |
| passwordHash | String | never store plaintext (`upassword` was plain → **hash**) |
| level ◆ | `UserLevel` | `ulevel` 0–4 → enum |
| language | String(2) | `'id'`/`'en'` (`ubahasa`) |
| defaultMenuId ○ ➜ | BigInt → ErpMenu | landing view (`udefaultview`) |
| homeBranchId ○ ➜ | BigInt → Branch | `ucabang` |
| homeWarehouseId ○ ➜ | BigInt → Warehouse | `ugudang` |
| salesmanPartnerId ○ ➜ | BigInt → Partner | `ukontak` (links user to a salesman partner) |
| expiresAt ○ | DateTime | account expiry (`utglexpired`) |
| isActive | Boolean | disable without delete (`uaktif`) |
| metadata ○ | Json | rare extras |

Relations: `roles ErpUserRole[]`, `branchAccess UserBranchAccess[]`,
`locationAccess UserLocationAccess[]`, `warehouseAccess UserWarehouseAccess[]`.
Indexes: `@@index([homeBranchId])`, unique `code`.

### ErpRole  → `adm_roles`  (modernization — legacy had **no** role table)

| Field | Type | Notes |
| --- | --- | --- |
| id | BigInt PK | |
| code 🔑 | String unique | e.g. `ADMIN`, `CASHIER` |
| name | String | |
| description ○ | String | |
| isActive | Boolean | |

Relations: `users ErpUserRole[]`, `permissions ErpRolePermission[]`, `menus ErpRoleMenu[]`.
Replaces the legacy `m0_setting (sgrup='hakakses')` + `m0_user.ugrup` kludge.

### ErpPermission  → `adm_permissions`  (modernization)

| Field | Type | Notes |
| --- | --- | --- |
| id | BigInt PK | |
| code 🔑 | String unique | dotted: `item.create`, `partner.read`, `coa.post` |
| name | String | human label |
| group ○ | String | module grouping for UI (`master`, `finance`, …) |
| description ○ | String | |

Relations: `roles ErpRolePermission[]`.

### ErpUserRole  → `adm_user_roles`  (join)

| Field | Type | Notes |
| --- | --- | --- |
| userId ➜ | BigInt → ErpUser | |
| roleId ➜ | BigInt → ErpRole | |

PK: `@@id([userId, roleId])`. `onDelete: Cascade` from both sides.

### ErpRolePermission  → `adm_role_permissions`  (join)

| Field | Type | Notes |
| --- | --- | --- |
| roleId ➜ | BigInt → ErpRole | |
| permissionId ➜ | BigInt → ErpPermission | |

PK: `@@id([roleId, permissionId])`.

### ErpRoleMenu  → `adm_role_menus`  (legacy 13 `c1..c13` perm bits → explicit)

| Field | Type | Notes |
| --- | --- | --- |
| roleId ➜ | BigInt → ErpRole | |
| menuId ➜ | BigInt → ErpMenu | cross-domain FK adm→sys (allowed) |
| canView | Boolean | |
| canCreate | Boolean | |
| canEdit | Boolean | |
| canDelete | Boolean | |
| canApprove | Boolean | |
| canPrint | Boolean | |
| canExport | Boolean | |
| canImport | Boolean | |
| isFavorite | Boolean | legacy favorite flag |

PK: `@@id([roleId, menuId])`. Maps the legacy opaque `c1..c13` bitfield to named rights.

---

## Per-user data scoping (legacy `m0_user_branch/location/warehouse`) (`adm_*`)

### UserBranchAccess  → `adm_user_branch_access`

| Field | Type | Notes |
| --- | --- | --- |
| userId ➜ | BigInt → ErpUser | |
| branchId ➜ | BigInt → Branch | cross-domain FK adm→md (allowed) |

PK `@@id([userId, branchId])`.

### UserLocationAccess  → `adm_user_location_access`

| Field | Type | Notes |
| --- | --- | --- |
| userId ➜ | BigInt → ErpUser | |
| locationId ➜ | BigInt → Location | cross-domain FK adm→md (allowed) |

PK `@@id([userId, locationId])`.

### UserWarehouseAccess  → `adm_user_warehouse_access`

| Field | Type | Notes |
| --- | --- | --- |
| userId ➜ | BigInt → ErpUser | |
| warehouseId ➜ | BigInt → Warehouse | cross-domain FK adm→md (allowed) |

PK `@@id([userId, warehouseId])`.

---

## System configuration (`sys_*`)

### ErpMenu  → `sys_menus`  (legacy `m0_menu`)

| Field | Type | Notes |
| --- | --- | --- |
| id | BigInt PK | |
| code 🔑 | String unique | stable key (`mnid`) |
| title | String | `mnname` |
| path ○ | String | route, e.g. `/master/item` (`mnurl`) |
| icon ○ | String | UI icon name |
| type ◆ | `MenuType` | `mntype` → MODULE/GROUP/ITEM |
| parentId ○ ➜ | BigInt → ErpMenu | tree (`mnparent`) |
| sortOrder | Int | `mnurutan` |
| isActive | Boolean | `mnactive` |

Relations: self `parent`/`children`, `roles ErpRoleMenu[]`, `numbering DocumentNumbering[]`.
Replaces legacy `m0_module` + `m0_menu` (module collapses into a top-level MODULE menu).
> Menu **definition** is system config (`sys`); role→menu **mapping** is access (`adm_role_menus`).

### ErpSetting  → `sys_settings`  (legacy `m0_setting`, **config only**)

| Field | Type | Notes |
| --- | --- | --- |
| id | BigInt PK | |
| module ○ | String | owning module (`smodule`) |
| group | String | `sgrup` |
| key 🔑 | String | `skode` |
| name | String | label (`snama`) |
| value ○ | String | scalar value (`snilai`) — JSON-encode complex |
| dataType ◆ | String | `string`/`number`/`bool`/`json` (`stipedata`) |
| sortOrder | Int | `surutan` |
| isActive | Boolean | |

Unique: `@@unique([module, group, key])`.
**Access-control settings removed** — that responsibility now lives in Role/Permission.

### DocumentNumbering  → `sys_document_numberings`  (legacy `m0_nomor`)

| Field | Type | Notes |
| --- | --- | --- |
| id | BigInt PK | |
| documentCode 🔑 | String unique | `kodetabel` — e.g. `SO`, `PO`, `INV` |
| name | String | `uraian` |
| prefix | String | `awalan` |
| digitCount | Int | zero-pad width (`jmldigit`) |
| resetPolicy ◆ | `NumberingReset` | NEVER/YEARLY/MONTHLY |
| nextNumber | Int | running counter (new; legacy derived) |
| menuId ○ ➜ | BigInt → ErpMenu | owning document menu (`menuid`) |
| affectsLedger | Boolean | posts to GL (`transaksifa`) |
| affectsInventory | Boolean | moves stock (`transaksibarang`) |
| affectsCost | Boolean | impacts COGS (`transaksihpp`) |
| notes ○ | String | `catatan` |

> `nextNumber` must be incremented in a transaction / row lock at issue time to avoid
> gaps/dupes — implementation note for the numbering service phase.

### FiscalPeriod  → `sys_fiscal_periods`  (modernization — legacy lived in `m0_setting`)

| Field | Type | Notes |
| --- | --- | --- |
| id | BigInt PK | |
| year | Int | |
| periodNo | Int | 1–12 (or 13 incl. adjustment) |
| name | String | e.g. `2026-05` |
| startDate | Date | |
| endDate | Date | |
| status ◆ | `FiscalPeriodStatus` | OPEN/SOFT_CLOSED/CLOSED/REOPENED (resolved §8 #20) |
| closedAt ○ | DateTime | when set to `CLOSED` |
| closedById ○ ➜ | BigInt → ErpUser | who closed |
| softClosedAt ○ | DateTime | when set to `SOFT_CLOSED` |
| reopenedAt ○ | DateTime | last `CLOSED → REOPENED` transition |
| reopenedById ○ ➜ | BigInt → ErpUser | who reopened |
| reopenReason ○ | String | mandatory justification on reopen (audit) |

Unique: `@@unique([year, periodNo])` — **global scope, no branch dimension** (resolved
§8 #6).

**Period lifecycle (resolved §8 #20):**
`OPEN` → `SOFT_CLOSED` → `CLOSED` → `REOPENED` (→ back to `SOFT_CLOSED`/`CLOSED`).

| Status | Operational docs (sales/purchase/inventory/cash) | Adjustment/memorial JV | Notes |
| --- | --- | --- | --- |
| `OPEN` | post allowed | post allowed | normal working period |
| `SOFT_CLOSED` | **DRAFT only** (no posting) | post allowed | accountant finalizing; users keep entering drafts & posting in other OPEN periods undisturbed |
| `CLOSED` | rejected | rejected | locked; corrections = reversing/recost entry in an OPEN period |
| `REOPENED` | post allowed | post allowed | controlled re-open; `reopen*` fields mandatory, written to `sys_audit_logs` |

Reopen + soft-close transitions are audited (`sys_audit_logs`). The
`JournalType × FiscalPeriodStatus` posting matrix is detailed in
[entities-m2-finance.md](entities-m2-finance.md). Period-close *process*
automation (`fin_period_closings`, `JournalType.CLOSING`) is **deferred / open**
— see [README §8.1](README.md#81-open-decision-re-opened-2026-05-17).

### ErpAuditLog  → `sys_audit_logs`  (legacy `m0_userlog` — promoted into MVP, resolved §8 #3)

| Field | Type | Notes |
| --- | --- | --- |
| id | BigInt PK | |
| action ◆ | `AuditAction` | CREATE/UPDATE/DELETE/RESTORE/LOGIN/LOGOUT |
| entityName | String | logical entity, e.g. `ErpItem`, `ErpPartner` |
| entityId ○ | BigInt | affected row PK (null for LOGIN/LOGOUT) |
| summary ○ | String | human-readable change description |
| changes ○ | Json | field-level diff `{ field: { from, to } }` |
| actorId ○ ➜ | BigInt → ErpUser | who performed it (`uloguser`) |
| actorIp ○ | String | source IP |
| occurredAt | DateTime | event time (UTC) |

`@@index([entityName, entityId])`, `@@index([actorId])`, `@@index([occurredAt])`.
Append-only: **no soft-delete / updatedAt** (overrides the global convention — a log is
immutable). `createdAt` == `occurredAt`. Written by the app on every mutating action.

---

**Count:** 14 Administrator entities — `adm_*` (6 identity, 3 join¹, 3 access) +
`sys_*` (Menu, Setting, DocumentNumbering, FiscalPeriod, **AuditLog**).
¹ joins = ErpUserRole, ErpRolePermission, ErpRoleMenu. Continue to
**[entities-m1-master-data.md](entities-m1-master-data.md)**.
