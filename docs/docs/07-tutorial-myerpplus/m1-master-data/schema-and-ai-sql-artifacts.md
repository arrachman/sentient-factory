---
title: M1 Schema and AI SQL Artifacts
sidebar_position: 3
description: Schema, summary, and NL2SQL artifacts for the MyERPPlus master data module.
---

# M1 Schema and AI SQL Artifacts

This page summarizes the technical artifacts for `m1-master data` from:

- `apps/myerpplus-db-mapping/db/m1-master data`

## Schema and Summary

- `semantic-schema-m1.json`
  AI Agent function: the main master data schema used to identify core tables such as contact, item, warehouse, branch, location, COA, pricing, tax, and other references.
- `semantic-schema-m1-summary.md`
  AI Agent function: human-readable summary for quick review of the master data domain and its main relations.
- `semantic-schema-m1-summary.json`
  AI Agent function: structured summary for retrieval, indexing, and automated evaluation.
- `semantic-schema-m1-summary-flat.json`
  AI Agent function: lighter flat version for search, embedding, or evaluator import.

## NL2SQL Guides

- `semantic-schema-m1-nl2sql.md`
  AI Agent function: human guide for choosing master data tables correctly in readonly queries.
- `semantic-schema-m1-nl2sql.json`
  AI Agent function: machine-readable rules for readonly SQL generation, join hints, and M1 caution areas.

## AI Agent POV

From the agent perspective, M1 artifacts are grouped as:

- **Raw evidence**
  - `m1-queries.md`
  - `m1-queries-by-type.md`
  - `m0_report_rmoduleid_1.sql`
- **Core schema**
  - `semantic-schema-m1.json`
- **Audit and retrieval**
  - `semantic-schema-m1-summary.md`
  - `semantic-schema-m1-summary.json`
  - `semantic-schema-m1-summary-flat.json`
- **Reasoning rules**
  - `semantic-schema-m1-nl2sql.md`
  - `semantic-schema-m1-nl2sql.json`

## Quick Summary

- total schema tables: `49`
- total main JSON summary areas: `4`
- total join hints: `5`
- total flat summary records: `56`

## When To Use It

- when the agent needs to answer lookup questions and cross-module reference relations
- when the team needs to distinguish pure master-data questions from inventory, purchasing, sales, or finance transactions
- when the NL2SQL pipeline needs a stable schema foundation before entering transaction modules
