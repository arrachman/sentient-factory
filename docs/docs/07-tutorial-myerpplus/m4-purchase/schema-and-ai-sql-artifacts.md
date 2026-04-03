---
title: M4 Schema and AI SQL Artifacts
sidebar_position: 3
description: Schema, summary, and NL2SQL artifacts for the MyERPPlus purchase module.
---

# M4 Schema and AI SQL Artifacts

This page summarizes the technical artifacts for `m4-purchase` from:

- `apps/myerpplus-db-mapping/db/m4-purchasing`

## Schema and Summary

- `semantic-schema-m4.json`
  AI Agent function: the main purchasing schema used to identify header, detail, payment, history, auxiliary tables, and polymorphic relations inside the purchase flow.
- `semantic-schema-m4-summary.md`
  AI Agent function: human-readable summary for quick review of the purchasing domain structure.
- `semantic-schema-m4-summary.json`
  AI Agent function: structured summary for retrieval, indexing, and automated evaluation.
- `semantic-schema-m4-summary-flat.json`
  AI Agent function: lighter flat version for search, embedding, or evaluator import.

## NL2SQL Guides

- `semantic-schema-m4-nl2sql.md`
  AI Agent function: human guide for choosing purchasing tables correctly in readonly contexts.
- `semantic-schema-m4-nl2sql.json`
  AI Agent function: machine-readable rules for readonly SQL generation, join hints, polymorphic relationships, and M4 caution areas.

## AI Agent POV

From the agent perspective, M4 artifacts are grouped as:

- **Raw evidence**
  - `m4-queries.md`
  - `m4-queries-by-type.md`
  - `m0_report_rmoduleid_4.sql`
- **Core schema**
  - `semantic-schema-m4.json`
- **Audit and retrieval**
  - `semantic-schema-m4-summary.md`
  - `semantic-schema-m4-summary.json`
  - `semantic-schema-m4-summary-flat.json`
- **Reasoning rules**
  - `semantic-schema-m4-nl2sql.md`
  - `semantic-schema-m4-nl2sql.json`

## Quick Summary

- total schema tables: `77`
- total main JSON summary areas: `5`
- total join hints: `7`
- total polymorphic relationships: `3`
- total flat summary records: `87`

## When To Use It

- when the agent needs to answer cross-document purchasing flow questions from request through vendor payment
- when the NL2SQL pipeline needs to understand join flow across purchasing stages and polymorphic relations based on `sumber`
- when the team needs to separate header, detail, payment, history, and auxiliary documents clearly
