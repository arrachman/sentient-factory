---
title: CDC To Landing Materialization For OBT
sidebar_position: 6
slug: /obt/cdc-to-landing-materialization-for-obt
description: How to materialize MyERPPlus CDC current-state data into relational PostgreSQL landing tables required by OBT ETL.
---

# CDC To Landing Materialization For OBT

This page defines the bridge between raw CDC state in PostgreSQL and the relational source tables required by the current OBT insert scripts.

For the higher-level ETL theory and execution order, see:

- [Bootstrap Full Load And CDC For OBT](./bootstrap-full-load-and-cdc-for-obt.md)

The important boundary is this:

- raw CDC currently lands in `cdc_events` and `cdc_current_state`
- current OBT insert scripts do not read raw CDC directly
- current OBT insert scripts expect relational tables named like the original MyERPPlus sources such as `m4_po`, `m5_si`, or `m_12_pos_voucher_out`

## Why This Layer Exists

The repository already uses a safe pattern in `apps/etl-worker`:

- generic raw sink to `cdc_events`
- current-state sink to `cdc_current_state`
- domain-specific materialization to mirror tables such as `cdc_myerpplus_users`

The OBT path needs the same idea, but for transactional MyERPPlus source tables.

Important clarification:

- the current ETL worker already stores all matching CDC topics generically into `cdc_events` and `cdc_current_state`
- so the immediate blocker for OBT is not a missing topic handler for `m4`, `m5`, or `m12`
- the immediate blocker is that those transactional topics are not appearing yet in the PostgreSQL CDC sink

## Generated Artifacts

The repository now includes a generator and SQL artifacts for this landing step:

```txt
apps/myerpplus-db-mapping/scripts/render-pg-landing-from-semantic.py
apps/myerpplus-db-mapping/db/obt-physical-sql/pgsql-landing/pg_create_myerpplus_landing_tables.sql
apps/myerpplus-db-mapping/db/obt-physical-sql/pgsql-landing/pg_upsert_myerpplus_landing_tables_from_cdc.sql
apps/myerpplus-db-mapping/db/obt-physical-sql/pgsql-tables/pg_check_obt_cdc_coverage.sql
```

What they do:

- `pg_create_myerpplus_landing_tables.sql`
  - creates relational landing tables with original MyERPPlus names such as `m4_po`, `m5_si`, and `m_12_pos_voucher_out`
  - includes `_cdc_*` metadata fields so lineage from CDC remains visible
- `pg_upsert_myerpplus_landing_tables_from_cdc.sql`
  - reads `cdc_current_state`
  - normalizes either plain JSON payload or Debezium-style `{ schema, payload }`
  - upserts rows into relational landing tables using the inferred primary key per source table
- `pg_check_obt_cdc_coverage.sql`
  - audits whether `cdc_events` and `cdc_current_state` already contain the source tables needed by the current OBT scope
  - separates the question `CDC topic sudah masuk atau belum` from `landing table relasional sudah dibuat atau belum`

## Current Execution Policy

These landing SQL files are prepared but intentionally not executed yet.

Reason:

- if empty relational source tables are created too early, the readiness check may start showing `present`
- that would blur the difference between `schema exists` and `data is actually landed`

For now, these files should be treated as execution-ready templates, not already-applied DDL.

## Coverage Audit Before Landing

Before creating any relational landing table, run the CDC coverage audit first.

Use:

```txt
python3 apps/myerpplus-db-mapping/scripts/run-pg-obt-table-sql.py --mode check-cdc
```

Read the output like this:

- `covered_in_current_state`
  - the source table is already present in `cdc_current_state`
- `events_only`
  - raw topic events exist but current-state consolidation is not visible yet
- `missing_in_cdc`
  - the topic has not landed at all for the expected source label

This keeps the troubleshooting order clear:

1. CDC topic coverage
2. relational landing materialization
3. OBT source-table readiness
4. OBT insert

## Coverage In Scope

The landing generator covers the source set currently needed by:

- `obt_purchase_line_flow`
- `obt_sales_line_flow`
- `obt_pos_to_sales`

That means:

- master tables: `m0_user`, `m1_branch`, `m1_contact`, `m1_item`, `m1_location`, `m1_terms`
- purchasing tables: `m4_po`, `m4_po_detail`, `m4_grn`, `m4_grn_detail`, `m4_ri`, `m4_ri_detail`, `m4_dnr`, `m4_dnr_detail`, `m4_prt`, `m4_prt_detail`
- sales tables: `m5_sq`, `m5_sq_detail`, `m5_so`, `m5_so_detail`, `m5_pi`, `m5_pi_detail`, `m5_pl`, `m5_pl_detail`, `m5_do`, `m5_do_detail`, `m5_dr`, `m5_dr_detail`, `m5_si`, `m5_si_detail`, `m5_rnr`, `m5_rnr_detail`, `m5_sr`, `m5_sr_detail`
- POS voucher tables: `m_12_pos_category`, `m_12_pos_voucher_in`, `m_12_pos_voucher_out`

## Materialization Contract

Each relational landing table is expected to preserve:

- original source column names
- one row per source primary key
- raw CDC payload traceability through `_cdc_payload`
- last current-state watermark through `_cdc_updated_at`
- delete state through `_cdc_deleted`

This is important because the next layer, `pg_insert_obt_*`, assumes stable source identifiers and stable lineage columns.

## Expected Source Key Pattern

The landing generator currently uses the following primary key assumptions:

- code-key masters:
  - `m1_branch.bkode`
  - `m1_location.lkode`
  - `m1_terms.trkode`
  - `m_12_pos_category.pckode`
- id-key masters or transactions:
  - `m0_user.userid`
  - `m1_contact.kid`
  - `m1_item.bid`
  - `m4_*` header/detail ids
  - `m5_*` header/detail ids
  - `m_12_pos_voucher_in.viid`
  - `m_12_pos_voucher_out.void`

If the real CDC topic for a table deviates from this assumption, update the generator before execution.

## Source Table Name Assumption

The generated upsert SQL currently filters `cdc_current_state.source_table` with this pattern:

- `myerpplus.<table_name>`

For example:

- `myerpplus.m4_po`
- `myerpplus.m5_si`
- `myerpplus.m_12_pos_voucher_out`

This matches the pattern already observed in PostgreSQL for currently landed tables such as:

- `myerpplus.users`
- `myerpplus.roles`
- `myerpplus.contacts`
- `myerpplus.m1_currency`

If a connector uses a different source-table label, update the generated SQL or the generator rule.

## Safe Execution Sequence

When the required transaction topics begin appearing in `cdc_current_state`, the safe sequence is:

1. inspect `cdc_current_state` and confirm source-table names match the expected `myerpplus.<table_name>` pattern
2. apply `pg_create_myerpplus_landing_tables.sql`
3. run `pg_upsert_myerpplus_landing_tables_from_cdc.sql`
4. validate row counts and sample keys in relational landing tables
5. run `pg_check_obt_source_readiness.sql`
6. only after that, run `pg_insert_obt_*`

## Practical Warning

Do not merge these landing tables conceptually with the already existing mirror tables such as:

- `cdc_myerpplus_users`
- `cdc_myerpplus_roles`
- `cdc_myerpplus_contacts`
- `cdc_myerpplus_currencies`

Those mirrors are application-facing normalized sinks.

The new relational landing tables are source-shaped sinks meant for OBT ETL compatibility.

## Summary

The repository now has a prepared CDC-to-relational landing path for OBT.

The remaining blocker is no longer design.

The remaining blocker is topic coverage: transactional MyERPPlus tables for `m4`, `m5`, and `m12` must first appear in `cdc_current_state` before this landing materialization and the OBT insert stage can proceed.
