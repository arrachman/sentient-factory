---
title: M2 Schema and AI SQL Artifacts
sidebar_position: 3
description: Schema, summary, and NL2SQL artifacts for the MyERPPlus finance module.
---

# M2 Schema and AI SQL Artifacts

This page summarizes the technical artifacts for `m2-finance` from:

- `apps/myerpplus-db-mapping/db/m2-finance`

## Schema and Summary

- `semantic-schema-m2.json`
  AI Agent function: the main finance schema used to identify header tables, detail tables, payment allocation, history, giro, and transaction journals.
- `semantic-schema-finance.json`
  AI Agent function: narrower finance-domain schema when the agent needs to focus on accounting use cases without noise from other modules.
- `semantic-schema-m2-summary.md`
  AI Agent function: human-readable summary for quick review of the finance domain structure.
- `semantic-schema-m2-summary.json`
  AI Agent function: structured summary for retrieval, indexing, and automated evaluation.
- `semantic-schema-m2-summary-flat.json`
  AI Agent function: lighter flat version for search, embedding, or evaluator import.

## NL2SQL Guides

- `semantic-schema-m2-nl2sql.md`
  AI Agent function: human guide for choosing finance tables correctly in readonly contexts.
- `semantic-schema-m2-nl2sql.json`
  AI Agent function: machine-readable rules for readonly SQL generation, join hints, and M2 caution areas.

## AI Agent POV

From the agent perspective, M2 artifacts are grouped as:

- **Raw evidence**
  - `m2-queries.md`
  - `m2-queries-by-type.md`
  - `m0_report_rmoduleid_2.sql`
- **Core schema**
  - `semantic-schema-m2.json`
  - `semantic-schema-finance.json`
- **Audit and retrieval**
  - `semantic-schema-m2-summary.md`
  - `semantic-schema-m2-summary.json`
  - `semantic-schema-m2-summary-flat.json`
- **Reasoning rules**
  - `semantic-schema-m2-nl2sql.md`
  - `semantic-schema-m2-nl2sql.json`

## Quick Summary

- total schema tables: `70`
- total main JSON summary areas: `5`
- total join hints: `9`
- total flat summary records: `90`

## When To Use It

- when the agent needs to answer questions about aging, payment memos, allocations, giro, cash or bank transfers, or journals
- when the NL2SQL pipeline must distinguish header, detail, allocation, history, and posted journal clearly
- when the team needs to keep finance queries readonly even though the source domain is full of sensitive transactions
