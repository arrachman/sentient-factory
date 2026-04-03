---
title: M12 Query Artifacts
sidebar_position: 2
description: Primary query sources for the M12 POS module.
---

# M12 Query Artifacts

The main source files for `m12-pos` are located in:

- `apps/myerpplus-db-mapping/db/m12-pos`

## Main Files

- `m12-queries.md`
  AI Agent function: active query evidence used to infer tables, columns, and join patterns.
- `m12-queries-by-type.md`
  AI Agent function: query summary by statement type for auditing read versus write behavior in the module.
- `m0_report_rmoduleid_12.sql`
  AI Agent function: report source that expands active table coverage and POS relation patterns.

## Quick Summary

- total queries: `530`
- `SELECT`: `269`
- `INSERT`: `93`
- `UPDATE`: `41`
- `DELETE`: `127`

## When To Use It

- when the agent needs to understand source evidence before forming the POS schema
- when the team wants to audit the difference between read queries and data-changing queries in the POS module
