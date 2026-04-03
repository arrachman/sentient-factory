---
title: Finance Query Artifacts
sidebar_position: 2
description: Summary of query artifacts and reports for the MyERPPlus finance module.
---

# Finance Query Artifacts

This page summarizes query artifacts for `m2-finance` from:

- `apps/myerpplus-db-mapping/db/m2-finance`

## Main Artifacts

- `m2-queries.md`
  AI Agent function: raw finance SQL source for cash receipt, cash disbursement, bank disbursement, memo, giro, journal, and transfer.
- `m2-queries-by-type.md`
  AI Agent function: query audit by SQL statement type, useful for distinguishing lookup or read behavior from finance transaction write-path behavior.
- `m0_report_rmoduleid_2.sql`
  AI Agent function: M2 report source used to capture important columns, join patterns, and finance analysis forms used by users.

## AI Agent POV

From the agent perspective:

- `m2-queries.md` is raw evidence of active finance transactions
- `m2-queries-by-type.md` is the initial guardrail for readonly versus write-path separation
- `m0_report_rmoduleid_2.sql` is additional evidence for report columns and operational relations frequently shown in business screens

## When To Use It

- when the agent needs to answer questions about cash, bank, receipt or disbursement memo, giro, journals, and posted journals
- when the team needs to validate whether the M2 semantic schema follows active queries and active reports
