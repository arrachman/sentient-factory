---
title: OBT ETL Work Breakdown By Component
sidebar_position: 9
slug: /obt/obt-etl-workbreakdown-by-component
description: Component-level implementation checklist for OBT ETL across source extract, landing, CDC, and incremental OBT refresh.
---

# OBT ETL Work Breakdown By Component

This page breaks the end-to-end OBT plan into concrete workstreams by component so the implementation can be assigned and executed in parallel.

Use this together with:

- [End To End OBT ETL Plan](./end-to-end-obt-etl-plan.md)
- [CDC To Landing Materialization For OBT](./cdc-to-landing-materialization-for-obt.md)
- [OBT ETL Execution Checklist](./obt-etl-execution-checklist.md)

## Component Map

The initial implementation naturally splits into these components:

1. source extraction from MySQL
2. PostgreSQL landing schema
3. full-load batch execution
4. raw CDC ingestion
5. CDC current-state to landing upsert
6. OBT baseline materialization
7. incremental OBT refresh
8. observability and operations

## Component 1: Source Extract

Primary responsibility:

- read historical MyERPPlus data from MySQL for the in-scope OBT tables

Current repo relevance:

- source DSN is configured in [infra/docker-compose.yml](/home/rania/apps/sentient-factory/infra/docker-compose.yml#L117)
- MySQL access logic already exists in `apps/ai-engine/sentient_factory_ai/mysql_client.py`

Tasks:

- verify final MySQL credential and host accessibility from ETL runtime
- define extract order for master and transaction tables
- define extraction strategy for large tables
- define bootstrap cutoff watermark capture
- define source-side retry and timeout behavior

Definition of done:

- every in-scope source table can be extracted consistently
- batch extraction records row count and cutoff watermark

## Component 2: PostgreSQL Landing Schema

Primary responsibility:

- provide source-shaped tables in PostgreSQL as the staging contract for OBT ETL

Current repo relevance:

- landing SQL artifacts already exist under `apps/myerpplus-db-mapping/db/obt-physical-sql/pgsql-landing`

Tasks:

- finalize schema placement for landing tables
- execute landing DDL for in-scope MyERPPlus tables
- add indexes on PK, join key, and `_cdc_updated_at`
- standardize `_cdc_deleted` and payload traceability fields
- create audit tables for landing loads

Definition of done:

- all required landing tables exist
- landing tables are indexed and ready for both full load and CDC upsert

## Component 3: Full-Load Batch Pipeline

Primary responsibility:

- move historical source data into PostgreSQL landing as the first complete baseline

Tasks:

- implement batch extract from MySQL
- implement bulk insert or staged upsert into landing
- load conformed masters before transactions
- load transaction tables in dependency order
- write batch audit rows with source and target row counts

Definition of done:

- landing contains a full historical baseline for the first OBT scope
- each batch run is auditable and rerunnable

## Component 4: Raw CDC Ingestion

Primary responsibility:

- ingest source changes continuously into raw PostgreSQL CDC structures

Current repo relevance:

- `apps/etl-worker` already consumes Debezium-like topics and stores raw data into `cdc_events` and `cdc_current_state`
- see [apps/etl-worker/README.md](/home/rania/apps/sentient-factory/apps/etl-worker/README.md)

Tasks:

- confirm MyERPPlus transactional topics for `m4`, `m5`, and `m12` are published
- verify topic naming matches expected source-table labels
- verify `cdc_events` receives new changes
- verify `cdc_current_state` converges to one current record per key
- track lag between source change time and PostgreSQL arrival

Definition of done:

- required source topics are visible in `cdc_events`
- required source tables are visible in `cdc_current_state`

## Component 5: Current-State To Landing Upsert

Primary responsibility:

- convert generic current-state CDC into relational source-shaped landing tables

Current repo relevance:

- prepared SQL already exists in `pg_upsert_myerpplus_landing_tables_from_cdc.sql`

Tasks:

- validate source label mapping such as `myerpplus.m5_si`
- upsert current-state rows into landing tables
- propagate `_cdc_updated_at`, `_cdc_deleted`, and payload fields
- make reruns idempotent
- handle deletes and tombstones explicitly

Definition of done:

- landing reflects the latest current state for every in-scope CDC table
- replaying the same CDC range does not create duplicates

## Component 6: OBT Baseline Materialization

Primary responsibility:

- build the first complete `obt_*` state from the landed PostgreSQL baseline

Current repo relevance:

- create and insert SQL artifacts already exist for `obt_purchase_line_flow`, `obt_sales_line_flow`, and `obt_pos_to_sales`

Tasks:

- run readiness check before insert
- execute baseline load into in-scope `obt_*` tables
- persist OBT batch metadata
- measure anchor-grain counts after each load
- validate nullability and minimum contract columns

Definition of done:

- the first three OBT tables are populated and validated against source lineage

## Component 7: Incremental OBT Refresh

Primary responsibility:

- update only affected OBT rows after source changes land in PostgreSQL

Tasks:

- define changed-key detection for each OBT anchor grain
- implement row-level or anchor-level refresh strategy
- handle update and delete propagation
- avoid full rebuild by default
- measure freshness per OBT

Definition of done:

- source changes update affected OBT rows without full reload
- freshness and lag are observable

## Component 8: Observability And Operations

Primary responsibility:

- make the pipeline safe to run repeatedly in a production-like environment

Tasks:

- create ETL audit tables for full load and CDC runs
- add row count, duration, and lag metrics
- alert on missing CDC coverage, failed batch load, and OBT drift
- define replay and rebuild runbooks
- define escalation path and ownership

Definition of done:

- operators can detect, diagnose, and recover from pipeline failures

## Suggested Owner Split

The cleanest owner split is:

- `apps/etl-worker`
  - raw CDC ingestion
  - `cdc_events`
  - `cdc_current_state`
- `apps/myerpplus-db-mapping`
  - landing DDL
  - OBT SQL artifacts
  - readiness and validation SQL
- batch ETL runtime
  - MySQL full extract
  - PostgreSQL landing load
  - batch audit execution
- OBT materialization runtime
  - baseline OBT load
  - incremental OBT refresh
- platform or ops
  - scheduling
  - secret management
  - monitoring and recovery

## Recommended Delivery Order

To maximize progress while reducing blockers, implement in this order:

1. finalize source and target connectivity
2. finalize landing schema
3. complete full-load batch into landing
4. validate landing readiness
5. materialize baseline OBT
6. verify CDC topic coverage in `etl-worker`
7. connect CDC current-state to landing upsert
8. implement incremental OBT refresh
9. add monitoring and runbooks

## Short Summary

The implementation should not be treated as one large undifferentiated ETL task.

The practical unit of execution is:

- raw CDC worker
- landing contract
- full-load batch
- OBT baseline build
- CDC landing upsert
- incremental OBT refresh
- observability

That split is the safest way to get from empty `obt_*` tables to a stable bootstrap-plus-stream pipeline.
