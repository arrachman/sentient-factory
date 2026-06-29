# Web-MDP — Database Design (Level 3 / MOM)

> Status: Fase 0 ✅ · Fase 1 scaffold ✅ (app boots, port 3220) · **Fase 2: MES
> catalogued + Prisma migrated** ([entities-mes.md](entities-mes.md); schema
> `apps/api-gateway/prisma/schema/mdp-mes.prisma`, migration `20260628_001_mdp_mes`
> live) · **Foundation masters CRUD live (2026-06-28)**: shifts + reason-codes
> (mdp), work-centers + assets (eam) — backend `/api/mdp/{shifts,reason-codes,
> assets,work-centers}` + web-mdp `/app/master/*` + seed `npm run db:seed:mdp`.
> · **ALL 8 MOM MODULES COMPLETE (2026-06-28)**: full-stack CRUD + UI for MES
> `/app/mes/*`, WMS `/app/wms/*`, QMS `/app/quality/*`, CMMS `/app/maintenance/*`,
> PRTS `/app/problems/*`, DMS `/app/documents/*`, IMS `/app/qhse/*`, LMS
> `/app/training/*` (catalogs entities-{mes,wms,qms,cmms,prts,dms,ims,lms}.md).
> Only OEE overlay remains.
> Date: 2026-06-27 · Author: agent (Claude) · Product: **Senti MDP**,
> `apps/web-mdp` (ISA-95 Level 3).
>
> **Single source of truth.** This `db-design/` set (this README +
> `module-roadmap.md` + `entities-mes.md` + per-module field catalogs to come) is
> the authoritative DB design for web-mdp. Per-module field catalogs follow
> **one at a time after review** — same discipline as `apps/web-erp/db-design/`.

This is the data-model design for **Senti MDP**, the Manufacturing Operations
Management (MOM) layer that sits between **Senti ERP** (Level 4, `apps/web-erp`)
and the shop floor (Level 2-0). It is a **fresh** product; it consumes ERP
masters/transactions across a defined boundary (§4), it does **not** absorb or
fork ERP tables.

---

## 1. Decisions locked with the user (2026-06-27)

| Topic | Decision |
| --- | --- |
| Layer | ISA-95 **Level 3 / MOM** — distinct bounded-context from ERP (Level 4). |
| Project shape | **New app `apps/web-mdp`** in the monorepo. Not a module inside web-erp; not a separate repo. |
| DB placement | **Shared Postgres** via Prisma (`apps/api-gateway/prisma/schema.prisma`). Isolation by **domain namespace** (§2), not by separate database. |
| Identity | **Reuse ERP auth** (`adm_users`, `ErpJwtAuthGuard`). No new user table. MDP-specific access mapping (if needed) → `mdp_*`. *(open — §6)* |
| Design system | **Port from web-erp** (tokens → atoms → … → pages). No ad-hoc UI. |
| MES data source | **Manual entry first (greenfield).** Machine connectivity (SCADA/PLC/OPC-UA, time-series) = future phase, not MVP. |
| This phase output | **Design docs only.** No `schema.prisma` edits / migration until explicit go-ahead, per module. |

---

## 2. Domain namespace (isolation)

MDP owns these prefixes; they do **not** intersect ERP (`sys/adm/md/fin/inv/pur/
sls/mfg/fa/bi/pos/pln`) or platform (`m0/m1/clinic`):

`mdp` (platform config/master) · `eam` (equipment/asset registry) · `mes`
(production execution) · `qms` (quality) · `mnt` (maintenance/CMMS) · `wms`
(warehouse execution) · `prt` (problem tracking) · `dms` (documents) · `ehs`
(QHSE/IMS) · `lms` (learning).

Full conventions inherited from `web-erp/db-design §3` (BigInt PK, soft-delete,
audit, `Decimal(19,4)`, UTC, Postgres enums). Cross-domain & cross-app refs =
scalar `BigInt` FK + `@@index`, **no** DB-level FK (decoupled). Prisma models
prefixed `Mdp` + `@@map(...)`.

---

## 3. Module → domain map (coarse — detail in `module-roadmap.md`)

| Screenshot module | Role | Domain(s) | Depends on (L4 ERP) |
| --- | --- | --- | --- |
| **MES** — produksi | Execute & record production against ERP work orders | `mes`, `eam` | `mfg_work_orders`, `mfg_boms`, `md_items` |
| **QMS** — kualitas | Inspection, NCR, CAPA | `qms` | `md_items`, `inv_*`, `pur_goods_receipts` |
| **CMMS** — pemeliharaan | Maintenance WO, PM schedules, spares | `mnt`, `eam` | `fa_assets`, `md_items` (spares) |
| **WMS** — inventori (eksekusi) | Putaway/pick/move on the floor → feeds ERP stock | `wms`, `eam` | `inv_stock_movements`, `md_storage_bins`, `md_items` |
| **PRTS** — problem & tracking | Andon, issue capture, escalation | `prt` | — (links to `mes`/`mnt`/`qms`) |
| **DMS** — dokumen | Controlled docs, revisions, acknowledgements | `dms` | — |
| **IMS** — QHSE terpadu | Incidents, audits, work permits | `ehs` | `adm_users`, `eam_assets` |
| **LMS** — pelatihan | Courses, enrollment, competency matrix | `lms` | `adm_users` |
| **OEE** *(metric, not module)* | Availability × Performance × Quality | derived | `mes` + `mnt` + `qms` (view/rollup) |
| **EAM** *(cross L3–L4 backbone)* | Equipment registry shared by MES/CMMS/OEE | `eam` | `fa_assets` (financial twin) |

---

## 4. Integration contract L4 (ERP) ↔ L3 (MDP) — AUTHORITATIVE

ISA-95 prescribes a clean boundary. MDP **reads** plans from ERP and **returns**
execution results; it never writes into ERP transaction tables directly — it
emits records ERP can consume. Direction and ownership:

| Data | Owner (writes) | Consumer (reads) | Mechanism |
| --- | --- | --- | --- |
| Item master, UoM, BOM | **ERP** (`md_items`, `mfg_boms`) | MDP (all modules) | scalar FK / read API |
| Work order / production order | **ERP** plans (`mfg_work_orders`) → MDP executes (`mes_production_orders`) | both | MDP `mes_production_orders.erpWorkOrderId` (scalar FK) |
| Production result (good/scrap qty, consumption) | **MDP** (`mes_production_logs`) | ERP (posts `mfg_production_results`, `inv_*`) | MDP emits → ERP ingests *(contract TBD per module)* |
| Stock movement (physical) | **MDP** WMS executes (`wms_movements`) | ERP (`inv_stock_movements`) | MDP emits → ERP posts |
| Asset / equipment | **EAM** (`eam_assets`) = maintained-equipment master; **ERP** `fa_assets` = financial twin | both | `eam_assets.erpFixedAssetId` (scalar FK, nullable) |
| Spare parts | **ERP** `md_items` + `inv_*` | MDP `mnt` | scalar FK |
| Users / roles | **ERP** `adm_users` | MDP | reuse `ErpJwtAuthGuard` |

**Overlap resolutions (proposed — ratify before any Prisma):**

1. **WMS vs ERP `inv_`** — WMS = *physical execution* (putaway/pick/move via
   scan); ERP `inv_` = *system-of-record stock ledger*. WMS tasks reference
   `md_storage_bins` and **emit** completed movements that ERP posts to
   `inv_stock_movements`. WMS does **not** own stock balances.
2. **MES vs ERP `mfg_`** — `mfg_` = planning (BOM, routing, work order). MES =
   execution & data collection. MES consumes `mfg_work_orders`, returns results
   ERP posts to `mfg_production_results`.
3. **EAM vs ERP `fa_` + CMMS** — `eam_assets` = the *maintained* equipment
   master (owned by MDP, used by MES/CMMS/OEE). Optional scalar link to
   `fa_assets` (financial/depreciation twin in ERP). CMMS (`mnt_*`) maintains
   `eam_assets`.
4. **OEE** — derived metric only; no module tables. Rollup/view over
   `mes`/`mnt`/`qms`.

---

## 5. Phasing

- **Phase 0 (now)** — Foundation docs: this README + `module-roadmap.md`
  (coarse, all 8 modules) + `CLAUDE.md`. **Review gate.**
- **Phase 1** — Scaffold `apps/web-mdp` (workspace member, port + UFW), port
  design system, auth wiring, app shell + nav SSOT (`mdp_menus`).
- **Phase 2+** — Per-module, in dependency order. **Anchor = MES.** Suggested:
  **MES → WMS → QMS → CMMS → DMS / PRTS / IMS / LMS → OEE overlay.** Each module:
  field-catalog doc → review → Prisma + migration → API → UI.

---

## 6. Open decisions (resolve before the relevant Prisma)

| # | Decision | Default lean |
| --- | --- | --- |
| 1 | ~~MDP access control: reuse ERP roles wholesale, or add `mdp_role_*` mapping?~~ → **RESOLVED 2026-06-28 (with user) = thin mapping.** `mdp_menus` (nav SSOT, self-tree) + `mdp_role_menus` (scalar `roleId` → ERP `adm_roles`, NO DB-FK; `menuId` → `mdp_menus`; `canView`/`canEdit`). Identity stays `adm_users`. **Role-filtered nav live (2026-06-28):** `GET /api/mdp/menus/nav` resolves the user's ERP roles (`adm_user_roles`) → `mdp_role_menus` → visible menu tree (+ ancestors), fallback = full active tree when no mapping; consumed by `DynamicSidebar` in `app-shell`. | — (resolved) |
| 2 | Backend placement: extend `apps/api-gateway` (module `mdp-*`) vs new NestJS service. | Extend api-gateway first (cheap); split later if scale demands. |
| 3 | Production-result → ERP posting contract (sync API vs event/outbox). | Define per module at MES catalog time. |
| 4 | EAM asset master: build fresh, or seed/mirror from ERP `fa_assets`. | Fresh master; optional scalar link to `fa_assets`. |
| 5 | OEE: materialized rollup table vs on-the-fly view. | View first; materialize if slow. |
| 6 | ~~Port number for `apps/web-mdp`~~ → **resolved: 3220** (next to web-erp 3219). App boots via `WEB_MDP_PORT` default. **Pending (user OK):** register in `config/ports.json` (permission-protected) + `sudo ufw allow from 192.168.1.0/24 to any port 3220 proto tcp comment 'web-mdp'`. | — |

---

## 7. Deferred (intentionally NOT in scope yet)

- Machine/SCADA/PLC/OPC-UA ingestion + time-series store (separate future phase;
  MES is manual-entry first).
- B2MML / ISA-95 transaction XML interchange (only if integrating external MES).
- Mobile/offline-first PWA hardening (after core modules land).
