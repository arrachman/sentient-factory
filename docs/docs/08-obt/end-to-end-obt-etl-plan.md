---
title: End To End OBT ETL Plan
sidebar_position: 8
slug: /obt/end-to-end-obt-etl-plan
description: End-to-end implementation plan from MyERPPlus MySQL source to PostgreSQL OBT baseline and ongoing CDC refresh.
---

# End To End OBT ETL Plan

This page turns the OBT theory into an executable delivery plan from source extraction to ongoing CDC refresh.

Use this together with:

- [Bootstrap Full Load And CDC For OBT](./bootstrap-full-load-and-cdc-for-obt.md)
- [Minimum Landing Contract For OBT ETL](./minimum-landing-contract-for-obt-etl.md)
- [CDC To Landing Materialization For OBT](./cdc-to-landing-materialization-for-obt.md)
- [OBT ETL Work Breakdown By Component](./obt-etl-workbreakdown-by-component.md)
- [OBT Portfolio Rollout Status](./obt-portfolio-rollout-status.md)

## Goal

Build an end-to-end pipeline with this final state:

- MyERPPlus MySQL is the transactional source of truth
- PostgreSQL `127.0.0.1:3208` contains source-shaped landing tables
- PostgreSQL `obt_*` tables contain the historical baseline
- CDC keeps landing and OBT data current after bootstrap

## Scope

The implementation target is the full concept-derived OBT portfolio, not only the first few prepared physical tables.

Execution should still happen in waves, but every canonical `obt_*` in the concept map must be assigned to one of these states:

- already bootstrapped and validated
- bootstrapped but source-empty
- blocked by missing source or CDC coverage
- not yet implemented but explicitly queued in the rollout backlog

The goal is to avoid silent gaps where an OBT is neither implemented nor tracked.

Suggested rollout waves:

- Wave 1: OBTs that already have working physical SQL or close variants
- Wave 2: finance, purchasing, sales, and POS OBTs with clear semantic anchors
- Wave 3: remaining portfolio OBTs such as allocation, manufacturing, asset, healthcare, and snapshot-oriented OBTs

## End-To-End Phases

### Phase 0: Scope, Contracts, And Governance

Objective:

- freeze the full OBT portfolio scope and remove ambiguity before data movement starts

Checklist:

- enumerate the full canonical `obt_*` portfolio from the concept page and assign rollout waves
- confirm grain, anchor key, and minimum join contract for each OBT
- define the handover watermark between full load and CDC
- define expected freshness target and acceptable CDC lag
- define ownership for source access, ETL runtime, validation, and operations
- define an explicit status for every OBT so no portfolio item is untracked

Deliverables:

- agreed full OBT portfolio scope
- agreed grain and source-key contract
- agreed watermark strategy
- agreed operational owner list
- tracked rollout status for every OBT

### Phase 1: Connectivity And Runtime Readiness

Objective:

- ensure source and target connections are reliable before schema or ETL work begins

Checklist:

- validate MySQL connectivity to the MyERPPlus source in [infra/docker-compose.yml](/home/rania/apps/sentient-factory/infra/docker-compose.yml#L117)
- validate PostgreSQL connectivity to `127.0.0.1:3208/sentient_factory`
- resolve final runtime credentials so ETL does not depend on conflicting env values
- define which runtime executes ETL jobs and CDC jobs
- verify network path, timeout, and retry behavior for both databases

Deliverables:

- working source connection
- working target connection
- final credential source for ETL runtime
- runtime decision for batch and CDC jobs

### Phase 2: Target Schema Bootstrap

Objective:

- create or verify all required PostgreSQL target structures

Checklist:

- verify all required `obt_*` tables exist in PostgreSQL
- create relational landing tables shaped like the MyERPPlus source tables required by the full OBT portfolio, even if some waves are loaded later
- create indexes for primary keys, join keys, and CDC watermark columns
- decide whether landing stays in `public` or a dedicated schema
- create ETL audit tables for batch and CDC observability

Deliverables:

- `obt_*` target tables
- landing tables for the full OBT portfolio
- baseline indexing
- ETL audit schema

### Phase 3: Initial Full Load From MySQL To Landing

Objective:

- load complete historical source data into PostgreSQL landing as the baseline

Checklist:

- load conformed masters first
- load finance transaction tables in dependency order
- load purchasing transaction tables in dependency order
- load sales transaction tables in dependency order
- load POS voucher tables after dependent sales data is available
- load other module families required by the remaining OBT portfolio in rollout order
- store row counts and batch metadata for every loaded table
- capture the bootstrap cutoff watermark used for CDC handover

Suggested source order:

1. `m1_contact`
2. `m1_item`
3. `m1_branch`
4. `m1_location`
5. `m1_terms`
6. `m0_user`
7. `m1_coa`, `m1_cost_center`, `m1_division`, `m1_subdivision`, `m1_project`
8. finance headers and details such as `m2_cr`, `m2_cr_detail`, `m2_cd`, `m2_cd_detail`, `m2_rm`, `m2_rm_detail`, and other required `m2_*` families
9. `m4_po`, `m4_po_detail`
10. `m4_grn`, `m4_grn_detail`
11. `m4_ri`, `m4_ri_detail`
12. `m4_dnr`, `m4_dnr_detail`
13. `m4_prt`, `m4_prt_detail`
14. `m5_sq`, `m5_sq_detail`
15. `m5_so`, `m5_so_detail`
16. `m5_pi`, `m5_pi_detail`
17. `m5_pl`, `m5_pl_detail`
18. `m5_do`, `m5_do_detail`
19. `m5_dr`, `m5_dr_detail`
20. `m5_si`, `m5_si_detail`
21. `m5_rnr`, `m5_rnr_detail`
22. `m5_sr`, `m5_sr_detail`
23. `m_12_pos_category`
24. `m_12_pos_voucher_in`
25. `m_12_pos_voucher_out`
26. remaining module families required by `obt_admin_access`, `obt_inventory_movement_line`, `obt_manufacturing_execution`, `obt_asset_lifecycle`, `obt_patient_visit_billing`, and other concept-mapped OBTs

Deliverables:

- complete landing baseline for the implemented OBT waves, with tracked blockers for the remaining portfolio
- per-table row counts
- recorded bootstrap cutoff watermark

### Phase 4: Landing Validation

Objective:

- prove the landing layer is complete enough for OBT materialization

Checklist:

- run source readiness checks for every OBT in the active rollout wave
- compare source row counts against landing row counts
- validate header-detail integrity and required foreign-key paths
- check sample document lineage across modules
- verify no critical source tables are still missing

Deliverables:

- readiness report
- landing validation report
- approved go/no-go decision for OBT baseline build

### Phase 5: OBT Baseline Materialization

Objective:

- build the first complete OBT state from the landed PostgreSQL baseline

Checklist:

- run the materialization SQL for every OBT in the active rollout wave
- store ETL batch metadata for every OBT load
- record row counts by OBT and by anchor grain
- mark every non-materialized OBT as either source-empty, blocked, or queued

Deliverables:

- initial baseline for every OBT in the active rollout wave
- OBT load audit entries
- portfolio status report showing bootstrapped, zero, blocked, and queued OBTs

### Phase 6: OBT Baseline Validation

Objective:

- prove the baseline OBT is analytically trustworthy before CDC begins

Checklist:

- validate OBT row counts against anchor source tables for every materialized OBT
- validate required contract columns are populated where the grain allows
- validate sample document chains against source records
- validate key business measures such as quantity, amount, and lineage references
- sign off the OBT baseline as trusted up to the bootstrap cutoff

Deliverables:

- OBT validation report
- approved baseline cutoff
- trusted baseline sign-off

### Phase 7: CDC Coverage And Raw Sink Validation

Objective:

- verify that source changes arrive in PostgreSQL raw CDC structures before relying on incremental processing

Checklist:

- confirm CDC connector is publishing MyERPPlus changes
- confirm new changes appear in `cdc_events`
- confirm current state is maintained in `cdc_current_state`
- run CDC coverage audit for the required source tables of every active-wave OBT
- verify source table labels match the expected naming contract such as `myerpplus.m5_si`

Deliverables:

- CDC coverage report
- verified current-state source labels
- approved go/no-go decision for CDC landing upsert

### Phase 8: Handover From Full Load To CDC

Objective:

- switch from historical batch mode to ongoing incremental mode without duplicates or gaps

Checklist:

- freeze the bootstrap cutoff watermark
- start CDC processing strictly after the bootstrap cutoff
- define deduplication or idempotency rules for overlap safety
- define delete and tombstone handling
- document the handover procedure for reruns and disaster recovery

Deliverables:

- handover watermark
- CDC start position
- written deduplication and delete rules

### Phase 9: CDC To Landing Incremental Upsert

Objective:

- keep landing tables synchronized with source changes after bootstrap

Checklist:

- consume current-state CDC rows for the MyERPPlus tables required by the active rollout wave
- upsert them into relational landing tables
- propagate `_cdc_updated_at`, `_cdc_deleted`, and payload traceability fields
- make the process idempotent for replay safety
- store per-run row counts, lag, and error metrics

Deliverables:

- incremental landing refresh job
- landing CDC audit metrics
- replay-safe update behavior

### Phase 10: Incremental OBT Refresh

Objective:

- refresh only affected OBT rows when source changes arrive

Checklist:

- define changed-key detection per OBT anchor grain
- rebuild only impacted rows instead of full reload by default
- handle insert, update, and delete propagation explicitly
- validate changed rows after each incremental cycle
- track freshness and lag per OBT

Deliverables:

- incremental OBT refresh logic
- per-OBT freshness metrics
- changed-row validation checks

### Phase 11: Observability, Alerts, And Recovery

Objective:

- make the pipeline operable in production, not only executable once

Checklist:

- create ETL audit tables for full load and CDC runs
- expose row count, duration, lag, and failure metrics
- add alerts for stopped CDC, excessive lag, and broken readiness
- prepare a recovery runbook for replay, partial rebuild, and full rebootstrap
- define operational escalation path

Deliverables:

- monitoring dashboard or report
- alert rules
- operational runbook

### Phase 12: Portfolio Completion

Objective:

- complete the working pattern across the rest of the concept-derived portfolio until every canonical OBT has an explicit operational state

Checklist:

- add the next OBT wave only after the prior wave is stable enough to operate
- repeat the same sequence: contract, landing, full load, validation, CDC, incremental refresh
- avoid enabling many new OBTs at once without validation capacity
- track per-OBT readiness separately
- do not leave any canonical OBT outside the tracked rollout map

Deliverables:

- reusable rollout template for remaining OBTs
- prioritized completion backlog for the full portfolio

## Core Design Rules

The delivery plan should follow these rules:

- full load initializes state
- CDC maintains state
- landing is source-shaped
- OBT is derived from landing, not directly from raw CDC
- every handover uses a defined watermark
- every incremental step must be idempotent
- validation is required before moving to the next phase

## Technical Components To Build

The end-to-end implementation usually needs these concrete components:

- source extraction job from MySQL
- PostgreSQL landing DDL
- full-load batch job into landing
- OBT baseline materialization job
- CDC raw ingestion into `cdc_events`
- current-state maintenance in `cdc_current_state`
- landing upsert from current state
- incremental OBT refresh job
- audit and monitoring tables

## Definition Of Done

The plan is complete only when all of these are true:

- historical MyERPPlus data has been loaded into PostgreSQL landing
- baseline OBT tables are populated and validated for every in-scope rollout wave, with the remaining portfolio explicitly tracked as zero, blocked, or queued
- CDC continues to arrive after the bootstrap cutoff
- CDC updates landing tables correctly
- landing changes propagate into OBT incrementally
- operators can observe lag, failures, and row-count anomalies
- rerun and recovery procedures are documented

## Short Summary

The end-to-end pattern is:

1. bootstrap schema
2. full load historical data
3. validate landing
4. build OBT baseline
5. validate OBT
6. start CDC after the cutoff
7. upsert landing incrementally
8. refresh OBT incrementally
9. monitor and recover as needed

## Bootstrap Command For M1 Master Data

Use the PostgreSQL OBT runner with the `master-data` profile when the rollout step is focused on the administrator and master-data bootstrap wave:

```bash
python3 apps/myerpplus-db-mapping/scripts/run-pg-obt-table-sql.py --mode create --profile master-data
python3 apps/myerpplus-db-mapping/scripts/run-pg-obt-table-sql.py --mode insert --profile master-data --truncate-targets
```

This profile prepares the canonical OBT baseline for:

- `obt_admin_access`
- `obt_menu_authorization`
- `obt_system_configuration`

The create step uses the concept-derived portfolio DDL so the required target tables exist before the baseline insert runs.

Use `--truncate-targets` for reruns so the bootstrap reload replaces the existing baseline instead of appending duplicate rows.
The runner uses `myerpplus_landing` as the default landing schema in `search_path`, so the master-data inserts read the source-shaped landing tables before falling back to `public`.

For the conformed M1 dimension baseline, use the `m1-dimension` profile:

```bash
python3 apps/myerpplus-db-mapping/scripts/run-pg-obt-table-sql.py --mode create --profile m1-dimension
python3 apps/myerpplus-db-mapping/scripts/run-pg-obt-table-sql.py --mode insert --profile m1-dimension --truncate-targets
```

This profile materializes:

- `dim_contact`
- `dim_item`

For the current M3 inventory baseline, use the `m3-inventory` profile:

```bash
python3 apps/myerpplus-db-mapping/scripts/run-pg-obt-table-sql.py --mode create --profile m3-inventory
python3 apps/myerpplus-db-mapping/scripts/run-pg-obt-table-sql.py --mode insert --profile m3-inventory --truncate-targets
```

This profile currently materializes:

- `obt_inventory_movement_line`

For the current M4 purchasing baseline, use the `m4-purchasing` profile:

```bash
python3 apps/myerpplus-db-mapping/scripts/run-pg-obt-table-sql.py --mode create --profile m4-purchasing
python3 apps/myerpplus-db-mapping/scripts/run-pg-obt-table-sql.py --mode insert --profile m4-purchasing --truncate-targets
```

This profile currently materializes:

- `obt_purchase_document_line_event`
- `obt_purchase_line_flow`
- `obt_purchase_payment`

For the current M2 finance baseline, use the `m2-finance` profile:

```bash
python3 apps/myerpplus-db-mapping/scripts/run-pg-obt-table-sql.py --mode create --profile m2-finance
python3 apps/myerpplus-db-mapping/scripts/run-pg-obt-table-sql.py --mode insert --profile m2-finance --truncate-targets
```

This profile currently materializes:

- `obt_finance_allocation`
- `obt_finance_document`
- `obt_finance_document_line`

For incremental refresh from `cdc_current_state`, the M1 dimension baseline is also wired into:

```bash
python3 apps/myerpplus-db-mapping/scripts/sync-obt-from-cdc.py --domains m1
```

The CDC refresh runner now writes operational audit rows into:

- `public.etl_cdc_sync_batch_runs`
- `public.etl_cdc_sync_table_runs`

Operational audit checks can be queried with:

```bash
python3 apps/myerpplus-db-mapping/scripts/run-pg-obt-table-sql.py --mode check --profile ops-audit
```

The plan is not considered complete if any canonical `obt_*` from the concept portfolio is missing from the rollout map.
