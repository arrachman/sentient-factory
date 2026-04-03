---
title: M6 Schema and AI SQL Artifacts
sidebar_position: 3
description: Schema, summary, and NL2SQL artifacts for the MyERPPlus manufacturing module.
---

# M6 Schema and AI SQL Artifacts

This page summarizes the technical artifacts for `m6-manufacturing` from:

- `apps/myerpplus-db-mapping/db/m6-manufacturing`

## Schema and Summary

- `semantic-schema-m6.json`
  AI Agent function: the main manufacturing schema inferred from active queries to identify header, detail, history, and production supporting tables.
- `semantic-schema-m6-summary.md`
  AI Agent function: human-readable summary for quick review of the manufacturing domain.
- `semantic-schema-m6-summary.json`
  AI Agent function: structured summary for retrieval, indexing, and automated evaluation.
- `semantic-schema-m6-summary-flat.json`
  AI Agent function: lighter flat version for search, embedding, or evaluator import.

## NL2SQL Guides

- `semantic-schema-m6-nl2sql.md`
  AI Agent function: human guide for choosing manufacturing tables correctly in readonly contexts.
- `semantic-schema-m6-nl2sql.json`
  AI Agent function: machine-readable rules for readonly SQL generation, join hints, and M6 caution areas.

## AI Agent POV

From the agent perspective, M6 artifacts are grouped as:

- **Raw evidence**
  - `m6-queries.md`
  - `m6-queries-by-type.md`
  - `m0_report_rmoduleid_6.sql`
- **Core schema**
  - `semantic-schema-m6.json`
- **Audit and retrieval**
  - `semantic-schema-m6-summary.md`
  - `semantic-schema-m6-summary.json`
  - `semantic-schema-m6-summary-flat.json`
- **Reasoning rules**
  - `semantic-schema-m6-nl2sql.md`
  - `semantic-schema-m6-nl2sql.json`

## Quick Summary

- total schema tables: `43`
- total main JSON summary areas: `4`
- total join hints: `5`
- total flat summary records: `52`

## When To Use It

- when the agent needs to answer questions about production material flow from BOM through work order and realization
- when the NL2SQL pipeline needs to understand relations between BOM, MRS, MRN, PD, PDR, and WO
- when the team needs to start using the M6 domain even though a derived schema was previously unavailable
