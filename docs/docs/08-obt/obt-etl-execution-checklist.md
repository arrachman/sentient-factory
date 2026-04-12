---
title: OBT ETL Execution Checklist
sidebar_position: 10
slug: /obt/obt-etl-execution-checklist
description: Concrete execution checklist for implementing OBT ETL across worker code, SQL artifacts, batch jobs, and incremental refresh.
---

# OBT ETL Execution Checklist

This page translates the OBT ETL plan into concrete work items tied to the current repository files and scripts.

Use this together with:

- [OBT ETL Work Breakdown By Component](./obt-etl-workbreakdown-by-component.md)
- [End To End OBT ETL Plan](./end-to-end-obt-etl-plan.md)

## Track 1: CDC Worker Readiness

Goal:

- ensure raw CDC for MyERPPlus transaction tables lands correctly in PostgreSQL

Relevant files:

- [README.md](/home/rania/apps/sentient-factory/apps/etl-worker/README.md)
- [db.ts](/home/rania/apps/sentient-factory/apps/etl-worker/src/db.ts)
- [topic-handlers.ts](/home/rania/apps/sentient-factory/apps/etl-worker/src/topic-handlers.ts)

Checklist:

- verify `apps/etl-worker` subscribes to the required transactional topics for `m4`, `m5`, and `m12`
- verify `cdc_events` and `cdc_current_state` are created with the required uniqueness constraints
- verify `source_table` values in `cdc_current_state` match the expected OBT naming contract
- confirm current handler behavior does not accidentally filter out needed transaction topics
- decide whether additional topic-specific handlers are required now or whether generic sink is sufficient
- add worker-level metrics for topic lag, ingest count, and failed decode count

Exit criteria:

- required source tables appear in `cdc_current_state`
- topic naming is stable enough for landing upsert SQL

## Track 2: Landing SQL Readiness

Goal:

- make source-shaped PostgreSQL landing tables execution-ready for the first OBT scope

Relevant files:

- [pg_create_myerpplus_landing_tables.sql](/home/rania/apps/sentient-factory/apps/myerpplus-db-mapping/db/obt-physical-sql/pgsql-landing/pg_create_myerpplus_landing_tables.sql)
- [pg_upsert_myerpplus_landing_tables_from_cdc.sql](/home/rania/apps/sentient-factory/apps/myerpplus-db-mapping/db/obt-physical-sql/pgsql-landing/pg_upsert_myerpplus_landing_tables_from_cdc.sql)
- [pg_check_obt_cdc_coverage.sql](/home/rania/apps/sentient-factory/apps/myerpplus-db-mapping/db/obt-physical-sql/pgsql-tables/pg_check_obt_cdc_coverage.sql)
- [render-pg-landing-from-semantic.py](/home/rania/apps/sentient-factory/apps/myerpplus-db-mapping/scripts/render-pg-landing-from-semantic.py)

Checklist:

- review generated landing table list against the first-three-OBT source contract
- verify primary key assumptions are correct for each generated landing table
- verify `_cdc_updated_at`, `_cdc_deleted`, and payload traceability columns exist consistently
- verify source label filters in upsert SQL match actual values stored by `etl-worker`
- add or adjust indexes if incremental upsert performance will depend on them
- execute CDC coverage check before applying landing DDL in a fresh environment

Exit criteria:

- landing SQL can be executed without schema ambiguity
- CDC upsert SQL matches actual `cdc_current_state` labels

## Track 3: PostgreSQL OBT Target Readiness

Goal:

- ensure physical OBT targets and active M1 dimensions exist and are validated before the first baseline load

Relevant files:

- [pg_create_table_obt_purchase_line_flow.sql](/home/rania/apps/sentient-factory/apps/myerpplus-db-mapping/db/obt-physical-sql/pgsql-tables/pg_create_table_obt_purchase_line_flow.sql)
- [pg_create_table_obt_sales_line_flow.sql](/home/rania/apps/sentient-factory/apps/myerpplus-db-mapping/db/obt-physical-sql/pgsql-tables/pg_create_table_obt_sales_line_flow.sql)
- [pg_create_table_obt_pos_to_sales.sql](/home/rania/apps/sentient-factory/apps/myerpplus-db-mapping/db/obt-physical-sql/pgsql-tables/pg_create_table_obt_pos_to_sales.sql)
- [pg_check_obt_portfolio_tables.sql](/home/rania/apps/sentient-factory/apps/myerpplus-db-mapping/db/obt-physical-sql/pgsql-tables/pg_check_obt_portfolio_tables.sql)
- [pg_check_cdc_last_batches.sql](/home/rania/apps/sentient-factory/apps/myerpplus-db-mapping/db/obt-physical-sql/pgsql-tables/pg_check_cdc_last_batches.sql)
- [pg_check_cdc_last_failures.sql](/home/rania/apps/sentient-factory/apps/myerpplus-db-mapping/db/obt-physical-sql/pgsql-tables/pg_check_cdc_last_failures.sql)
- [run-pg-obt-table-sql.py](/home/rania/apps/sentient-factory/apps/myerpplus-db-mapping/scripts/run-pg-obt-table-sql.py)

Checklist:

- verify target tables exist in PostgreSQL `127.0.0.1:3208`
- verify active `dim_contact` and `dim_item` tables exist alongside the tracked `obt_*` outputs
- verify required indexes and uniqueness constraints exist on anchor keys
- verify ETL metadata columns are sufficient for baseline and incremental runs
- decide whether target tables need audit companion tables or shared audit table only
- standardize execution command for create, check, and insert operations

Exit criteria:

- target `obt_*` tables and active `dim_*` outputs are confirmed ready for baseline load

## Track 4: Full-Load Extract And Landing Batch

Goal:

- implement a repeatable historical batch load from MySQL to PostgreSQL landing

Relevant files:

- [bootstrap-full-load-and-cdc-for-obt.md](/home/rania/apps/sentient-factory/docs/docs/08-obt/bootstrap-full-load-and-cdc-for-obt.md)
- [minimum-landing-contract-for-obt-etl.md](/home/rania/apps/sentient-factory/docs/docs/08-obt/minimum-landing-contract-for-obt-etl.md)

Checklist:

- choose the runtime for the full-load job
- implement extraction order exactly following source dependency rules
- store per-table source row count and loaded row count
- store batch id, cutoff watermark, started at, finished at, and status
- make the batch rerunnable without manual cleanup when possible
- define how partial failure resumes from the last safe table boundary

Exit criteria:

- one full historical load can fill landing tables for the first OBT scope
- batch metadata is queryable

## Track 5: Landing Validation

Goal:

- prove the landed baseline is structurally correct before OBT insert begins

Relevant files:

- [pg_check_obt_source_readiness.sql](/home/rania/apps/sentient-factory/apps/myerpplus-db-mapping/db/obt-physical-sql/pgsql-tables/pg_check_obt_source_readiness.sql)
- [minimum-landing-contract-for-obt-etl.md](/home/rania/apps/sentient-factory/docs/docs/08-obt/minimum-landing-contract-for-obt-etl.md)

Checklist:

- run readiness check for all in-scope OBTs
- compare source and landing row counts
- validate required header-detail paths
- validate sample keys across `m4`, `m5`, and `m12`
- record validation outcome before baseline OBT load starts

Exit criteria:

- landing passes readiness check and business spot checks

## Track 6: Baseline OBT Load

Goal:

- populate the first three OBT targets from landed PostgreSQL data

Relevant files:

- [pg_insert_obt_purchase_line_flow.sql](/home/rania/apps/sentient-factory/apps/myerpplus-db-mapping/db/obt-physical-sql/pgsql-tables/pg_insert_obt_purchase_line_flow.sql)
- [pg_insert_obt_sales_line_flow.sql](/home/rania/apps/sentient-factory/apps/myerpplus-db-mapping/db/obt-physical-sql/pgsql-tables/pg_insert_obt_sales_line_flow.sql)
- [pg_insert_obt_pos_to_sales.sql](/home/rania/apps/sentient-factory/apps/myerpplus-db-mapping/db/obt-physical-sql/pgsql-tables/pg_insert_obt_pos_to_sales.sql)
- [run-pg-obt-table-sql.py](/home/rania/apps/sentient-factory/apps/myerpplus-db-mapping/scripts/run-pg-obt-table-sql.py)

Checklist:

- run baseline insert scripts in the agreed order
- capture row counts written per OBT
- validate anchor-grain uniqueness after insert
- record baseline cutoff watermark on the OBT load batch
- document any known null-safe enrichments that are intentionally incomplete

Exit criteria:

- all first-scope OBT tables are populated and row counts are recorded

## Track 7: OBT Baseline Validation

Goal:

- confirm the baseline OBT is semantically valid before switching to incremental mode

Relevant files:

- [konsep-obt-m0-m12.md](/home/rania/apps/sentient-factory/docs/docs/08-obt/konsep-obt-m0-m12.md)
- [semantic-to-physical-obt-mapping.md](/home/rania/apps/sentient-factory/docs/docs/08-obt/semantic-to-physical-obt-mapping.md)

Checklist:

- compare OBT counts to anchor source counts
- verify critical business columns for sample rows
- verify downstream lineage sections for purchase, sales, and POS examples
- sign off baseline as trusted through the cutoff watermark

Exit criteria:

- baseline OBT is approved for CDC continuation

## Track 8: CDC Handover

Goal:

- move safely from historical full load to streaming incremental updates

Checklist:

- freeze the full-load cutoff watermark
- start CDC processing from the first event after the cutoff
- define overlap handling for safety replay
- define delete propagation rules from CDC to landing and OBT
- write the handover procedure into the runbook

Exit criteria:

- no gaps and no uncontrolled duplicates across batch-to-CDC transition

## Track 9: Incremental Landing Upsert

Goal:

- keep landing synchronized from `cdc_current_state` after the initial baseline

Relevant files:

- [pg_upsert_myerpplus_landing_tables_from_cdc.sql](/home/rania/apps/sentient-factory/apps/myerpplus-db-mapping/db/obt-physical-sql/pgsql-landing/pg_upsert_myerpplus_landing_tables_from_cdc.sql)
- [cdc-to-landing-materialization-for-obt.md](/home/rania/apps/sentient-factory/docs/docs/08-obt/cdc-to-landing-materialization-for-obt.md)

Checklist:

- define schedule or trigger model for landing upsert
- upsert only rows changed after the last successful watermark
- make the process idempotent
- store lag and changed-row counts per cycle
- validate deletes and updates for sample records

Exit criteria:

- landing updates continuously and safely from CDC

## Track 10: Incremental OBT Refresh

Goal:

- update only the affected OBT rows after landing changes

Checklist:

- define changed-key extraction for each anchor grain
- implement partial rebuild logic per OBT
- include conformed dimension refresh such as `dim_contact` and `dim_item` in the operational refresh path when their source domains change
- verify deletes and reverse-document scenarios
- measure OBT freshness after each incremental cycle
- add retry-safe logic for reruns

Exit criteria:

- OBT can refresh incrementally without full reload

## Track 11: Ops And Recovery

Goal:

- make the whole pipeline supportable in routine operation

Checklist:

- create batch and CDC audit tables if not already present
- record each `sync-obt-from-cdc.py` cycle into `public.etl_cdc_sync_batch_runs` and `public.etl_cdc_sync_table_runs`
- expose operator-facing checks for latest batch status and latest failed table refresh
- define alert thresholds for lag, failure, and row-count anomalies
- define how to rebuild landing only
- define how to rebuild one OBT only
- define when full rebootstrap is required

Exit criteria:

- on-call or operator can recover the pipeline without reverse engineering the flow

## Suggested Ticket Split

The cleanest near-term ticket split is:

1. `etl-worker`: verify and extend CDC topic coverage for `m4`, `m5`, `m12`
2. `db-mapping`: finalize landing SQL assumptions and CDC label filters
3. `batch-runtime`: implement MySQL full-load to PostgreSQL landing
4. `db-mapping`: execute and validate baseline OBT inserts
5. `etl-worker` plus `db-mapping`: implement CDC-to-landing incremental upsert loop
6. `db-mapping` or ETL runtime: implement incremental OBT refresh
7. `platform`: add audit, alerting, and runbook support

## Short Summary

The next executable work is no longer at the theory level.

It is at the file-and-job level:

- verify `etl-worker`
- finalize landing SQL
- run full-load batch
- validate landing
- load OBT baseline
- hand over to CDC
- upsert landing incrementally
- refresh OBT incrementally
