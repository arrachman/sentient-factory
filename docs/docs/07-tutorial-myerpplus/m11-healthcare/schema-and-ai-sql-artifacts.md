---
title: M11 Schema and AI SQL Artifacts
sidebar_position: 3
description: Schema, summary, and NL2SQL artifacts for the healthcare module.
---

# M11 Schema and AI SQL Artifacts

This page summarizes the technical artifacts for `m11-healthcare` from:

- `apps/myerpplus-db-mapping/db/m11-healthcare`

## Schema and Summary

- `semantic-schema-m11.json`
  AI Agent function: the main healthcare schema inferred from active queries to identify patient visits, billing, services, lab, prescriptions, and medical record tables.
- `semantic-schema-m11-summary.md`
  AI Agent function: human-readable summary for quick review of the healthcare domain structure.
- `semantic-schema-m11-summary.json`
  AI Agent function: structured summary for retrieval, indexing, and automated evaluation.
- `semantic-schema-m11-summary-flat.json`
  AI Agent function: lighter flat version for search, embedding, or evaluator import.

## NL2SQL Guides

- `semantic-schema-m11-nl2sql.md`
  AI Agent function: human guide for choosing healthcare tables correctly in readonly contexts.
- `semantic-schema-m11-nl2sql.json`
  AI Agent function: machine-readable rules for readonly SQL generation, join hints, and M11 caution areas.

## AI Agent POV

From the agent perspective, M11 artifacts are grouped as:

- **Raw evidence**
  - `m11-queries.md`
  - `m11-queries-by-type.md`
  - `m0_report_rmoduleid_11.sql`
- **Core schema**
  - `semantic-schema-m11.json`
- **Audit and retrieval**
  - `semantic-schema-m11-summary.md`
  - `semantic-schema-m11-summary.json`
  - `semantic-schema-m11-summary-flat.json`
- **Reasoning rules**
  - `semantic-schema-m11-nl2sql.md`
  - `semantic-schema-m11-nl2sql.json`

## Quick Summary

- total schema tables: `28`
- total main JSON summary areas: `3`
- total join hints: `5`
- total flat summary records: `37`

## When To Use It

- when the agent needs to answer questions about patient visit episodes and their downstream documents
- when the NL2SQL pipeline needs to distinguish visit, billing, clinical service, and medical record documents clearly
- when the team needs readonly results to remain sensitive to healthcare context and not over-interpret clinical meaning beyond the source data
