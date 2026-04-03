---
title: Administrator Query Artifacts
sidebar_position: 2
description: Summary of query artifacts and JSON indexes for the MyERPPlus administrator module.
---

# Administrator Query Artifacts

This page summarizes the technical artifacts for `m0-administrator` from:

- `apps/myerpplus-db-mapping/db/m0 - administrator`

## Main Artifacts

- `m0-queries.md`
  AI Agent function: the most complete raw administrator SQL source, used when the agent needs to inspect query patterns, table names, and legacy placeholders.
- `m0-queries.json`
  AI Agent function: lightweight JSON manifest for fast indexing, coverage validation, and recognition that this domain has `832` collected active queries.
- `m0-queries-by-type.md`
  AI Agent function: query split by SQL statement type, useful for distinguishing readonly queries from write-path queries.
- `m0-queries-by-type.json`
  AI Agent function: machine-readable version of the query type split, suitable for agent guardrails and evaluation pipelines.

## AI Agent POV

From the agent perspective:

- `m0-queries.md` is the raw evidence
- `m0-queries.json` is the quick index
- `m0-queries-by-type.md` is the audit view
- `m0-queries-by-type.json` is the guardrail view

## Quick Summary

- total queries: `832`
- `SELECT`: `626`
- `INSERT`: `79`
- `UPDATE`: `52`
- `DELETE`: `75`

## When To Use It

- when the agent needs to understand administrator areas such as user, role, menu, setting, report, approval, and logging
- when the agent needs to determine whether a user question is safe to answer with readonly SQL
- when the team wants to build the `m0` semantic schema further
