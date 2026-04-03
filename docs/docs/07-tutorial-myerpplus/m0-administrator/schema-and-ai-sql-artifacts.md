---
title: M0 Schema and AI SQL Artifacts
sidebar_position: 3
description: Schema, summary, and NL2SQL artifacts for the MyERPPlus administrator module.
---

# M0 Schema and AI SQL Artifacts

This page summarizes the technical artifacts for `m0-administrator` from:

- `apps/myerpplus-db-mapping/db/m0 - administrator`

## Schema and Summary

- `semantic-schema-m0.json`
  AI Agent function: the main administrator schema used to identify tables, business terms, access areas, settings, reports, numbering, and audit structures.
- `semantic-schema-m0-summary.md`
  AI Agent function: human-readable summary for quick administrator schema coverage review.
- `semantic-schema-m0-summary.json`
  AI Agent function: structured summary for retrieval, indexing, and automated evaluation pipelines.
- `semantic-schema-m0-summary-flat.json`
  AI Agent function: lighter flat version for search, embedding, or evaluator import.

## Query Sources

- `m0-queries.md`
  AI Agent function: raw administrator query evidence from legacy sources.
- `m0-queries.json`
  AI Agent function: lightweight manifest of total query count and source coverage.
- `m0-queries-by-type.md`
  AI Agent function: audit view separating readonly and write-path queries.
- `m0-queries-by-type.json`
  AI Agent function: machine-readable guardrail view for the agent.

## NL2SQL Guides

- `semantic-schema-m0-nl2sql.md`
  AI Agent function: human guide for choosing administrator tables correctly in readonly contexts.
- `semantic-schema-m0-nl2sql.json`
  AI Agent function: machine-readable rules for readonly SQL generation, join hints, and M0 caution areas.

## AI Agent POV

From the agent perspective, M0 artifacts are grouped as:

- **Raw evidence**
  - `m0-queries.md`
  - `m0-queries-by-type.md`
- **Core schema**
  - `semantic-schema-m0.json`
- **Audit and retrieval**
  - `semantic-schema-m0-summary.md`
  - `semantic-schema-m0-summary.json`
  - `semantic-schema-m0-summary-flat.json`
- **Reasoning rules**
  - `semantic-schema-m0-nl2sql.md`
  - `semantic-schema-m0-nl2sql.json`

## Quick Summary

- total schema tables: `79`
- total main summary areas: `13`
- total join hints: `9`
- total flat summary records: `96`

## When To Use It

- when the agent needs to answer questions about users, roles, menus, reports, settings, numbering, queues, and audit logs
- when the team needs to separate readonly queries from administrator write-path queries
- when the NL2SQL pipeline needs stricter guardrails because M0 contains many write operations
