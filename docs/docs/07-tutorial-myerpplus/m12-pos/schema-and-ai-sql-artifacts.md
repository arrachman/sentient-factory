---
title: M12 Schema and AI SQL Artifacts
sidebar_position: 3
description: Schema, summary, and NL2SQL artifacts for the POS module.
---

# M12 Schema and AI SQL Artifacts

This page summarizes the technical artifacts for `m12-pos` from:

- `apps/myerpplus-db-mapping/db/m12-pos`

## Schema and Summary

- `semantic-schema-m12.json`
  AI Agent function: the main POS schema used to identify cashier transaction tables, POS setup, voucher, promo, loyalty, and history structures.
- `semantic-schema-m12-summary.md`
  AI Agent function: human-readable summary for quick review of the POS domain structure.
- `semantic-schema-m12-summary.json`
  AI Agent function: structured summary for retrieval, indexing, and automated evaluation.
- `semantic-schema-m12-summary-flat.json`
  AI Agent function: lighter flat version for search, embedding, or evaluator import.

## NL2SQL Guides

- `semantic-schema-m12-nl2sql.md`
  AI Agent function: human guide for choosing POS tables correctly in readonly contexts.
- `semantic-schema-m12-nl2sql.json`
  AI Agent function: machine-readable rules for readonly SQL generation, join hints, and M12 caution areas.

## AI Agent POV

From the agent perspective, M12 artifacts are grouped as:

- **Raw evidence**
  - `m12-queries.md`
  - `m12-queries-by-type.md`
  - `m0_report_rmoduleid_12.sql`
- **Core schema**
  - `semantic-schema-m12.json`
- **Audit and retrieval**
  - `semantic-schema-m12-summary.md`
  - `semantic-schema-m12-summary.json`
  - `semantic-schema-m12-summary-flat.json`
- **Reasoning rules**
  - `semantic-schema-m12-nl2sql.md`
  - `semantic-schema-m12-nl2sql.json`

## Quick Summary

- total schema tables: `60`
- total main JSON summary areas: `5`
- total join hints: `6`
- total flat summary records: `126`

## When To Use It

- when the agent needs to answer questions about POS transactions, promo, vouchers, and loyalty
- when the NL2SQL pipeline needs to distinguish POS setup masters from live cashier sales transactions
- when the team needs to ensure readonly queries do not misuse history tables or promo-rule tables to calculate actual sales
