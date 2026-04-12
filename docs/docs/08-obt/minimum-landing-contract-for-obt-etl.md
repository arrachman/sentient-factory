---
title: Minimum Landing Contract For OBT ETL
sidebar_position: 5
slug: /obt/minimum-landing-contract-for-obt-etl
description: Minimum PostgreSQL landing contract required before OBT insert ETL can run safely.
---

# Minimum Landing Contract For OBT ETL

This page defines the minimum PostgreSQL landing contract required before the current OBT insert scripts can run safely against `127.0.0.1:3208`.

The target in scope is narrow:

- `obt_purchase_line_flow`
- `obt_sales_line_flow`
- `obt_pos_to_sales`

This contract assumes:

- the client MyERPPlus source database is not used for `CREATE VIEW`
- OBT physical tables already live in PostgreSQL
- load happens by `INSERT ... SELECT` into PostgreSQL OBT tables
- source data must therefore exist in PostgreSQL first

## Current State

At the time of the latest execution:

- `obt_purchase_line_flow`, `obt_sales_line_flow`, and `obt_pos_to_sales` already exist in PostgreSQL `127.0.0.1:3208`
- source transaction tables for `m4`, `m5`, and `m12` are not present yet
- only partial master data such as `m1_contact` and `m1_item` are currently present
- a raw CDC layer exists, but current payload coverage is still limited and does not yet provide the transactional source set required by the three OBTs

## Execution Gate

Do not run:

- `pg_insert_obt_purchase_line_flow.sql`
- `pg_insert_obt_sales_line_flow.sql`
- `pg_insert_obt_pos_to_sales.sql`

until the readiness check returns `present` for all required source tables.

Use:

```txt
apps/myerpplus-db-mapping/db/obt-physical-sql/pgsql-tables/pg_check_obt_source_readiness.sql
```

or:

```bash
python3 apps/myerpplus-db-mapping/scripts/run-pg-obt-table-sql.py --mode check
```

## Minimum Contract By OBT

### `obt_purchase_line_flow`

Anchor grain:

- one row per `m4_po_detail.idpodetail`

Minimum master tables:

- `m1_contact`
- `m1_item`
- `m1_branch`
- `m1_location`
- `m1_terms`

Minimum transaction tables:

- `m4_po`
- `m4_po_detail`
- `m4_grn`
- `m4_grn_detail`
- `m4_ri`
- `m4_ri_detail`
- `m4_dnr`
- `m4_dnr_detail`
- `m4_prt`
- `m4_prt_detail`

Minimum physical join contract:

- `m4_po_detail.idpo -> m4_po.poid`
- `m4_grn_detail.idpodetail -> m4_po_detail.idpodetail`
- `m4_ri_detail.idgrndetail -> m4_grn_detail.idgrndetail`
- `m4_dnr_detail.idridetail -> m4_ri_detail.idridetail`
- `m4_prt_detail.iddnrdetail -> m4_dnr_detail.iddnrdetail`

Blocking condition:

- if `m4_po_detail` is missing, the OBT cannot start
- if downstream tables are still missing, the OBT may still be loaded later with partial null downstream sections, but the current insert script expects the full minimal set above

### `obt_sales_line_flow`

Anchor grain:

- one row per `m5_si_detail.idsidetail`

Minimum master tables:

- `m0_user`
- `m1_contact`
- `m1_item`
- `m1_branch`
- `m1_location`

Minimum transaction tables:

- `m5_si`
- `m5_si_detail`
- `m5_so`
- `m5_so_detail`
- `m5_sq`
- `m5_sq_detail`
- `m5_pi`
- `m5_pi_detail`
- `m5_pl`
- `m5_pl_detail`
- `m5_do`
- `m5_do_detail`
- `m5_dr`
- `m5_dr_detail`
- `m5_rnr`
- `m5_rnr_detail`
- `m5_sr`
- `m5_sr_detail`

Minimum physical join contract:

- `m5_si_detail.idsi -> m5_si.siid`
- `m5_si_detail.idsodetail -> m5_so_detail.idsodetail`
- `m5_so_detail.idso -> m5_so.soid`
- `m5_so_detail.idsqdetail -> m5_sq_detail.idsqdetail`
- `m5_sq_detail.idsq -> m5_sq.sqid`
- `m5_si_detail.idpidetail -> m5_pi_detail.idpidetail`
- `m5_si_detail.idpldetail -> m5_pl_detail.idpldetail`
- `m5_si_detail.iddodetail -> m5_do_detail.iddodetail`
- `m5_si_detail.iddrdetail -> m5_dr_detail.iddrdetail`
- `m5_rnr_detail.idsidetail -> m5_si_detail.idsidetail`
- `m5_sr_detail.idsidetail -> m5_si_detail.idsidetail`

Blocking condition:

- if `m5_si` or `m5_si_detail` is missing, the OBT cannot start
- if `RNR` and `SR` are missing, the current insert script should not run yet because downstream rollups are part of the current contract

### `obt_pos_to_sales`

Anchor grain:

- one row per `m_12_pos_voucher_out.void`

Minimum master tables:

- `m0_user`
- `m1_contact`
- `m1_branch`
- `m1_location`
- `m1_terms`

Minimum transaction tables:

- `m_12_pos_voucher_out`
- `m_12_pos_voucher_in`
- `m_12_pos_category`
- `m5_si`
- `m5_si_detail`

Minimum physical join contract:

- `m_12_pos_voucher_out.voidvi -> m_12_pos_voucher_in.viid`
- `m_12_pos_voucher_out.voidtransaction -> m5_si.siid`
- `m_12_pos_voucher_in.vikategori -> m_12_pos_category.pckode`
- `m5_si_detail.idsi -> m5_si.siid`

Blocking condition:

- if `m_12_pos_voucher_out` or `m5_si` is missing, the OBT cannot start

## Landing Order

The safest landing order for PostgreSQL is:

1. conformed masters used by all three OBTs
2. purchasing transactions for `m4`
3. sales transactions for `m5`
4. POS voucher transactions for `m12`
5. only then the OBT insert stage

Recommended concrete order:

1. `m1_contact`
2. `m1_item`
3. `m1_branch`
4. `m1_location`
5. `m1_terms`
6. `m0_user`
7. `m4_po`, `m4_po_detail`
8. `m4_grn`, `m4_grn_detail`
9. `m4_ri`, `m4_ri_detail`
10. `m4_dnr`, `m4_dnr_detail`
11. `m4_prt`, `m4_prt_detail`
12. `m5_sq`, `m5_sq_detail`
13. `m5_so`, `m5_so_detail`
14. `m5_pi`, `m5_pi_detail`
15. `m5_pl`, `m5_pl_detail`
16. `m5_do`, `m5_do_detail`
17. `m5_dr`, `m5_dr_detail`
18. `m5_si`, `m5_si_detail`
19. `m5_rnr`, `m5_rnr_detail`
20. `m5_sr`, `m5_sr_detail`
21. `m_12_pos_category`
22. `m_12_pos_voucher_in`
23. `m_12_pos_voucher_out`

## Row-Level Gate Before Insert

Table presence alone is not enough. Before first insert, each landed table should satisfy:

- primary business key is populated on every active row
- lineage FK columns used by the current OBT scripts are not systematically zero or null
- transaction date columns are parseable in PostgreSQL
- status and currency columns keep original operational values
- deleted or tombstone rows are either filtered or normalized consistently

Practical examples:

- `m4_po_detail.idpodetail` must be unique or at least stable
- `m5_si_detail.idsidetail` must be unique or at least stable
- `m_12_pos_voucher_out.void` must be stable and `voidtransaction` must point to a real `m5_si.siid`

## CDC To Landing Expectation

If the source arrives through CDC, the landing layer should normalize at least:

- one PostgreSQL table per MyERPPlus source table name
- source table names preserved as-is where possible
- JSON payload flattened before OBT insert stage
- source delete semantics resolved before OBT insert stage
- type casting handled in landing, not deferred to the OBT script

Do not point `pg_insert_obt_*` directly to raw `cdc_events`.

The current OBT insert scripts assume already-materialized relational source tables.

## First Safe ETL Sequence

Once the minimum contract is met, the first safe load sequence is:

1. run `pg_check_obt_source_readiness.sql`
2. confirm every required table shows `present`
3. load `obt_purchase_line_flow`
4. load `obt_sales_line_flow`
5. load `obt_pos_to_sales`
6. compare row counts and sample joins against the landed source tables

## Summary

For the current PostgreSQL path, the real blocker is no longer OBT DDL.

The blocker is source landing completeness.

Until the transactional source tables for `m4`, `m5`, and `m12` exist in PostgreSQL, the correct next move is to finish the landing contract, not to force the OBT insert stage.
