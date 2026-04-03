---
title: M8 Schema and AI SQL Artifacts
sidebar_position: 3
description: Schema, summary, and NL2SQL artifacts for the analytics content module.
---

# M8 Schema and AI SQL Artifacts

This page summarizes the technical artifacts for `m8-analytics content` from:

- `apps/myerpplus-db-mapping/db/m8-analytics content`

## Schema and Summary

- `semantic-schema-m8.json`
  AI Agent function: the main analytics-content schema inferred from active queries to identify content masters, chart configuration, indicator thresholds, and metric tables.
- `semantic-schema-m8-summary.md`
  AI Agent function: human-readable summary for quick review of the analytics-content domain.
- `semantic-schema-m8-summary.json`
  AI Agent function: structured summary for retrieval, indexing, and automated evaluation.
- `semantic-schema-m8-summary-flat.json`
  AI Agent function: lighter flat version for search, embedding, or evaluator import.

## NL2SQL Guides

- `semantic-schema-m8-nl2sql.md`
  AI Agent function: human guide for choosing analytics-content tables correctly in readonly contexts.
- `semantic-schema-m8-nl2sql.json`
  AI Agent function: machine-readable rules for readonly SQL generation, join hints, and M8 caution areas.

## AI Agent POV

From the agent perspective, M8 artifacts are grouped as:

- **Raw evidence**
  - `m8-queries.md`
  - `m8-queries-by-type.md`
  - `m0_report_rmoduleid_8.sql`
- **Core schema**
  - `semantic-schema-m8.json`
- **Audit and retrieval**
  - `semantic-schema-m8-summary.md`
  - `semantic-schema-m8-summary.json`
  - `semantic-schema-m8-summary-flat.json`
- **Reasoning rules**
  - `semantic-schema-m8-nl2sql.md`
  - `semantic-schema-m8-nl2sql.json`

## Quick Summary

- total schema tables: `20`
- total main JSON summary areas: `2`
- total join hints: `3`
- total flat summary records: `23`

## When To Use It

- when the agent needs to answer questions about dashboard setup and KPI analytics
- when the NL2SQL pipeline needs to distinguish content masters, indicator thresholds, chart configuration, and specific metric tables
- when the team needs to ensure dashboard interpretation does not mix content configuration with fact-like metric tables
