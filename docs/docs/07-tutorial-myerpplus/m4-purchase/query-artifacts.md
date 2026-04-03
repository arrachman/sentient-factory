---
title: Purchase Query Artifacts
sidebar_position: 2
description: Summary of query artifacts and reports for the MyERPPlus purchase module.
---

# Purchase Query Artifacts

This page summarizes query artifacts for `m4-purchase` from:

- `apps/myerpplus-db-mapping/db/m4-purchasing`

## Main Artifacts

- `m4-queries.md`
  AI Agent function: raw purchasing SQL source for PR, RQ, RFQ, CS, BS, PO, GRN, RI, returns, advance payments, and vendor payments.
- `m4-queries-by-type.md`
  AI Agent function: query audit by SQL statement type, useful for distinguishing lookup or read behavior from purchasing write-path behavior.
- `m0_report_rmoduleid_4.sql`
  AI Agent function: M4 report source used to capture important columns, join patterns, and purchasing analysis forms used by users.

## AI Agent POV

From the agent perspective:

- `m4-queries.md` is raw evidence of active purchasing flows
- `m4-queries-by-type.md` is the initial guardrail for readonly versus write-path separation
- `m0_report_rmoduleid_4.sql` is additional evidence for report columns, document flow, and operational relations across purchasing stages

## When To Use It

- when the agent needs to answer questions about the purchasing flow from request to invoice and vendor payment
- when the team needs to validate whether the M4 semantic schema follows active queries and active reports
