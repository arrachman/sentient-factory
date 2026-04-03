---
title: Inventory Query Artifacts
sidebar_position: 2
description: Summary of query artifacts and reports for the MyERPPlus inventory module.
---

# Inventory Query Artifacts

This page summarizes query artifacts for `m3-inventory` from:

- `apps/myerpplus-db-mapping/db/m3-inventory`

## Main Artifacts

- `m3-queries.md`
  AI Agent function: raw inventory SQL source for material request, stock transfer, stock receiving, stock adjustment, stock opname, opening balance, daily checks, and other warehouse transactions.
- `m3-queries-by-type.md`
  AI Agent function: query audit by SQL statement type, useful for distinguishing lookup or read behavior from inventory write-path behavior.
- `m0_report_rmoduleid_3.sql`
  AI Agent function: M3 report source used to capture important columns, join patterns, and inventory analysis forms used by users.

## AI Agent POV

From the agent perspective:

- `m3-queries.md` is raw evidence of active inventory flows
- `m3-queries-by-type.md` is the initial guardrail for readonly versus write-path separation
- `m0_report_rmoduleid_3.sql` is additional evidence for report columns and progress relations often used by the business

## When To Use It

- when the agent needs to answer questions about stock movement, stock opname, opening balance, daily checks, or inventory flow tracing
- when the team needs to validate whether the M3 semantic schema follows active queries and active reports
