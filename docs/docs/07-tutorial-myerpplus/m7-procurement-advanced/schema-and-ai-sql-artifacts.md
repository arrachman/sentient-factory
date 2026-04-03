---
title: M7 Schema and AI SQL Artifacts
sidebar_position: 3
description: Schema, summary, and NL2SQL artifacts for the M7 module.
---

# M7 Schema and AI SQL Artifacts

This page summarizes the technical artifacts for `m7-procurement advanced` from:

- `apps/myerpplus-db-mapping/db/m7-procurement advanced`

## Schema and Summary

- `semantic-schema-m7.json`
  AI Agent function: the main M7 schema inferred from active queries to identify asset tables, asset categories, asset procurement workflows, and depreciation structures.
- `semantic-schema-m7-summary.md`
  AI Agent function: human-readable summary for quick review of the M7 domain.
- `semantic-schema-m7-summary.json`
  AI Agent function: structured summary for retrieval, indexing, and automated evaluation.
- `semantic-schema-m7-summary-flat.json`
  AI Agent function: lighter flat version for search, embedding, or evaluator import.

## NL2SQL Guides

- `semantic-schema-m7-nl2sql.md`
  AI Agent function: human guide for choosing M7 tables correctly in readonly contexts.
- `semantic-schema-m7-nl2sql.json`
  AI Agent function: machine-readable rules for readonly SQL generation, join hints, and M7 caution areas.

## AI Agent POV

From the agent perspective, M7 artifacts are grouped as:

- **Raw evidence**
  - `m7-queries.md`
  - `m7-queries-by-type.md`
  - `m0_report_rmoduleid_7.sql`
- **Core schema**
  - `semantic-schema-m7.json`
- **Audit and retrieval**
  - `semantic-schema-m7-summary.md`
  - `semantic-schema-m7-summary.json`
  - `semantic-schema-m7-summary-flat.json`
- **Reasoning rules**
  - `semantic-schema-m7-nl2sql.md`
  - `semantic-schema-m7-nl2sql.json`

## Quick Summary

- total schema tables: `27`
- total main JSON summary areas: `5`
- total join hints: `5`
- total flat summary records: `36`

## When To Use It

- when the agent needs to answer questions about asset procurement and fixed asset lifecycle
- when the NL2SQL pipeline needs to distinguish asset masters, procurement documents, and depreciation or disposal documents
- when the team needs to prevent the label `procurement advanced` from misleading the interpretation of the domain that is actually active in the queries
