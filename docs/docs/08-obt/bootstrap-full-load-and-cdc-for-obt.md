---
title: Bootstrap Full Load And CDC For OBT
sidebar_position: 7
slug: /obt/bootstrap-full-load-and-cdc-for-obt
description: Recommended ETL pattern for loading MyERPPlus source data into PostgreSQL OBT targets using initial full load followed by CDC.
---

# Bootstrap Full Load And CDC For OBT

This page names the ETL pattern used for OBT in this repository and explains the intended execution order.

For the implementation checklist and delivery phases, see:

- [End To End OBT ETL Plan](./end-to-end-obt-etl-plan.md)

For the MyERPPlus OBT path, the correct pattern is:

- **initial full load followed by CDC**
- also acceptable: **bootstrap + incremental CDC**
- also acceptable: **historical backfill + ongoing change capture**

In practical terms, this means:

1. load historical source data first from the MyERPPlus source database
2. build the initial PostgreSQL landing and OBT baseline
3. only after that, continue with incremental updates from CDC

## Source And Target

Source database:

- MyERPPlus MySQL from [infra/docker-compose.yml](/home/rania/apps/sentient-factory/infra/docker-compose.yml#L117)
- `mysql+pymysql://dashboard:PwdDash)(*@103.125.36.54:20406/myerpplus_dashboard`

Target database:

- PostgreSQL `127.0.0.1:3208`
- database `sentient_factory`

Target shape:

- relational landing tables shaped like MyERPPlus sources such as `m4_po`, `m5_si`, or `m_12_pos_voucher_out`
- physical `obt_*` tables in PostgreSQL

## Why Full Load Comes First

The OBT tables are currently treated as ETL targets, not as direct live views on MySQL.

That means:

- an empty `obt_*` table should not wait for CDC alone to slowly become complete
- the first safe state is a **complete historical baseline**
- CDC is then used to keep that baseline current

If CDC is used alone from an empty starting point, the target may remain incomplete for an unknown period because only new changes are captured after the stream begins.

## Canonical Sequence

The intended sequence is:

1. **Bootstrap connection and schema**
   Create PostgreSQL target tables, indexes, and required landing tables.
2. **Initial full extract from MySQL**
   Read historical data from the MyERPPlus source database.
3. **Load into PostgreSQL landing**
   Materialize source-shaped relational tables in PostgreSQL.
4. **Build OBT baseline**
   Run `INSERT ... SELECT`, merge, or equivalent materialization into `obt_*` targets.
5. **Validate baseline**
   Check row counts, key coverage, document lineage, and sample rows.
6. **Start CDC continuation**
   Consume new inserts, updates, and deletes after the full-load cutoff.
7. **Apply incremental ETL**
   Upsert landing tables, then refresh or merge the affected `obt_*` rows.

## Recommended Mental Model

The safest mental model is:

- **full load initializes state**
- **CDC maintains state**

Or in shorter form:

- **backfill first**
- **stream second**

This is not a pure streaming-first architecture.

This is a **bootstrap-then-stream** architecture.

## Execution Phases

### Phase 1: Bootstrap / Historical Backfill

Purpose:

- fill PostgreSQL from empty to complete
- establish one trustworthy baseline for analytics and semantic OBT

Typical actions:

- extract tables from MySQL source
- load source-shaped landing tables in PostgreSQL
- populate all required `obt_*` targets from that landed data

Success condition:

- OBT tables are complete up to a known cutoff timestamp or source transaction boundary

### Phase 2: Incremental CDC Continuation

Purpose:

- keep PostgreSQL synchronized after the baseline exists

Typical actions:

- read CDC events after the bootstrap cutoff
- update landing tables
- propagate changed rows into affected `obt_*` tables

Success condition:

- new source changes appear in PostgreSQL and OBT with acceptable latency

## Cutoff And Handover Rule

The handover between full load and CDC must use a clear cutoff.

Examples:

- source commit timestamp
- source update timestamp
- binlog or log position
- Debezium offset or equivalent connector watermark

Without a clear cutoff, two failure modes appear:

- duplicate processing across full load and CDC
- missing changes that occur during the handover window

So the sequence is not only:

- full load
- then CDC

It is more precisely:

- full load **up to a defined watermark**
- then CDC **starting after that watermark**

## OBT-Specific Interpretation

For this repository, the OBT flow should be read as:

1. MySQL MyERPPlus is the transactional source of truth
2. PostgreSQL receives a complete relational landing baseline
3. PostgreSQL `obt_*` tables are filled from that baseline
4. CDC keeps the landing layer and the OBT layer current

This aligns with the existing repository split:

- concept page defines semantic OBT targets
- landing page defines relational source-shaped tables in PostgreSQL
- CDC page defines ongoing change materialization

## Naming Guidance For Team Communication

Use one of these phrases consistently:

- `initial full load followed by CDC`
- `historical backfill + incremental CDC`
- `bootstrap baseline then stream deltas`

Avoid saying only:

- `stream CDC ke OBT dari nol`

That phrase is misleading because it sounds like the initial historical baseline is unnecessary.

## Short Summary

The correct theory for this OBT pipeline is:

- **initial full load + CDC**

The operational meaning is:

- empty PostgreSQL OBT targets are filled first with complete historical data from MySQL
- once the baseline is complete, CDC processes only the newest changes
- from that point on, ETL becomes incremental instead of full reload
