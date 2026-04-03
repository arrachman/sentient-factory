---
title: M3 Schema and AI SQL Artifacts
sidebar_position: 3
description: Schema, summary, and NL2SQL artifacts for the MyERPPlus inventory module.
---

# M3 Schema and AI SQL Artifacts

This page summarizes the technical artifacts for `m3-inventory` from:

- `apps/myerpplus-db-mapping/db/m3-inventory`

## Schema and Summary

- `semantic-schema-m3.json`
  AI Agent function: the main inventory schema used to identify header tables, detail tables, history, progress, daily check, and supporting inventory tables.
- `semantic-schema-inventory.json`
  AI Agent function: narrower inventory-domain schema when the agent needs to focus on warehouse use cases without cross-module noise.
- `semantic-schema-m3-summary.md`
  AI Agent function: human-readable summary for quick review of the inventory domain structure.
- `semantic-schema-m3-summary.json`
  AI Agent function: structured summary for retrieval, indexing, and automated evaluation.
- `semantic-schema-m3-summary-flat.json`
  AI Agent function: lighter flat version for search, embedding, or evaluator import.

## NL2SQL Guides

- `semantic-schema-m3-nl2sql.md`
  AI Agent function: human guide for choosing inventory tables correctly in readonly contexts.
- `semantic-schema-m3-nl2sql.json`
  AI Agent function: machine-readable rules for readonly SQL generation, join hints, and M3 caution areas.

## AI Agent POV

From the agent perspective, M3 artifacts are grouped as:

- **Raw evidence**
  - `m3-queries.md`
  - `m3-queries-by-type.md`
  - `m0_report_rmoduleid_3.sql`
- **Core schema**
  - `semantic-schema-m3.json`
  - `semantic-schema-inventory.json`
- **Audit and retrieval**
  - `semantic-schema-m3-summary.md`
  - `semantic-schema-m3-summary.json`
  - `semantic-schema-m3-summary-flat.json`
- **Reasoning rules**
  - `semantic-schema-m3-nl2sql.md`
  - `semantic-schema-m3-nl2sql.json`

## Quick Summary

- total schema tables: `43`
- total main JSON summary areas: `4`
- total join hints: `5`
- total flat summary records: `53`

## When To Use It

- when the agent needs to answer questions about item requests, transfers, receipts, stock opname, adjustments, and daily checks
- when the NL2SQL pipeline needs to start tracing from detail rows so progress across inventory stages is not lost
- when the team needs to distinguish active, history, progress, and auxiliary tables clearly
