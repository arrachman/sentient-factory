---
title: Draft Physical OBT SQL Skeletons
sidebar_position: 4
slug: /obt/draft-physical-obt-sql-skeletons
description: Draft SQL skeletons for priority physical OBT implementations in MyERPPlus.
---

# Draft Physical OBT SQL Skeletons

This page summarizes the first draft SQL skeletons and the current finalized view candidates created from the semantic OBT artifacts.

These skeletons are intended to be:

- implementation starting points
- conservative with joins
- consistent with the current semantic summaries

Most files here are not final production SQL yet.

## Source Files

The SQL skeleton files live under:

```txt
apps/myerpplus-db-mapping/db/obt-physical-sql/
```

Main files:

```txt
apps/myerpplus-db-mapping/db/obt-physical-sql/vw_obt_purchase_line_flow.sql
apps/myerpplus-db-mapping/db/obt-physical-sql/vw_obt_sales_line_flow.sql
apps/myerpplus-db-mapping/db/obt-physical-sql/vw_obt_pos_to_sales.sql
apps/myerpplus-db-mapping/db/obt-physical-sql/draft_vw_obt_purchase_line_flow.sql
apps/myerpplus-db-mapping/db/obt-physical-sql/draft_vw_obt_sales_line_flow.sql
apps/myerpplus-db-mapping/db/obt-physical-sql/draft_vw_obt_pos_to_sales.sql
apps/myerpplus-db-mapping/db/obt-physical-sql/pgsql-tables/pg_create_table_obt_purchase_line_flow.sql
apps/myerpplus-db-mapping/db/obt-physical-sql/pgsql-tables/pg_create_table_obt_sales_line_flow.sql
apps/myerpplus-db-mapping/db/obt-physical-sql/pgsql-tables/pg_create_table_obt_pos_to_sales.sql
apps/myerpplus-db-mapping/db/obt-physical-sql/pgsql-tables/pg_insert_obt_purchase_line_flow.sql
apps/myerpplus-db-mapping/db/obt-physical-sql/pgsql-tables/pg_insert_obt_sales_line_flow.sql
apps/myerpplus-db-mapping/db/obt-physical-sql/pgsql-tables/pg_insert_obt_pos_to_sales.sql
```

## Skeleton Strategy

### `obt_purchase_line_flow`

- Current skeleton anchor: `m4_po_detail`
- Reason:
  - `PO -> GRN -> RI` has clear detail lineage in the semantic artifacts
  - upstream `BS/RQ/PR` is real semantically, but the line-level physical contract is not yet standardized enough to make it the default join path
- Current default lineage:
  - `PO -> GRN -> RI -> DNR -> PRT`

### `obt_sales_line_flow`

- Current skeleton anchor: `m5_si_detail`
- Reason:
  - sales-invoice detail has the richest stable detail lineage across `SO`, `PI`, `PL`, `DO`, `DR`, `RNR`, and `SR`
  - this makes one wide sales-flow OBT much easier to build safely
- Current default lineage:
  - `SQ -> SO -> PI/PL/DO -> DR -> SI -> RNR -> SR`

### Finalized Candidates

- `apps/myerpplus-db-mapping/db/obt-physical-sql/vw_obt_purchase_line_flow.sql`
  - keep `m4_po_detail` as the anchor
  - keep `PR/RQ/BS` as optional extension, not the default join path
  - aggregate `GRN`, `RI`, `DNR`, and `PRT` per `idpodetail` so one PO line does not fan out into multiple rows
- `apps/myerpplus-db-mapping/db/obt-physical-sql/vw_obt_sales_line_flow.sql`
  - keep `m5_si_detail` as the anchor
  - treat zero lineage IDs as `NULL`
  - aggregate `RNR` and `SR` per `idsidetail` so one invoice line does not fan out into multiple rows
- `apps/myerpplus-db-mapping/db/obt-physical-sql/vw_obt_pos_to_sales.sql`
  - keep `m_12_pos_voucher_out` as the anchor
  - use the stable semantic relation `m_12_pos_voucher_out.voidtransaction -> m5_si.siid`
  - preserve one-row-per-voucher-usage grain

### `obt_pos_to_sales`

- Current skeleton anchor: `m_12_pos_voucher_out`
- Reason:
  - the path `m_12_pos_voucher_out.voidtransaction -> m5_si.siid` is the clearest stable cross-module relation published by the semantic artifacts
- Current default lineage:
  - `POS_VOUCHER_OUT -> SALES_INVOICE`

## Practical Notes

- treat `draft_*` files as `draft view skeletons`, not final ETL
- treat `vw_obt_purchase_line_flow.sql`, `vw_obt_sales_line_flow.sql`, and `vw_obt_pos_to_sales.sql` as finalized candidates, but still validate them against the live database
- current static validation passes for all base tables and columns referenced by the three `vw_obt_*` candidates against the published semantic schema JSON
- several enrichment fields are intentionally left `NULL` when the current semantic schema does not publish the physical source columns yet
- `pg_create_table_*.sql` is the PostgreSQL table-first path when you are not allowed to create views on the source/client database
- `pg_insert_*.sql` should only be executed after the required MyERPPlus source tables are already available in PostgreSQL
- validate status columns and any optional branch or location joins in your environment
- if you materialize them as tables, preserve the same semantic grain
- do not widen the cross-module joins beyond what `semantic-cross-module-lineage.md` currently supports

## PostgreSQL Execution Note

- the three OBT tables were successfully created in PostgreSQL at `127.0.0.1:3208`
- at the time of execution, the expected source tables such as `m4_po_detail`, `m5_si_detail`, and `m_12_pos_voucher_out` were not present in that PostgreSQL instance yet
- because of that, only the `pg_create_table_*` step was executed; the `pg_insert_*` step is intentionally deferred until source replication or staging is ready

## Recommended Next Step

After reviewing these files, the next safe implementation step is:

1. land or replicate the required source tables into PostgreSQL `:3208`
2. execute `pg_insert_obt_purchase_line_flow.sql`, `pg_insert_obt_sales_line_flow.sql`, and `pg_insert_obt_pos_to_sales.sql`
3. after the first load is stable, replace bootstrap inserts with delta or upsert-based live ETL
