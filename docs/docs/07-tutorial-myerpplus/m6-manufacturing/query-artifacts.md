---
title: Manufacturing Query Artifacts
sidebar_position: 2
description: Summary of query artifacts and reports for the MyERPPlus manufacturing module.
---

# Manufacturing Query Artifacts

This page summarizes query artifacts for `m6-manufacturing` from:

- `apps/myerpplus-db-mapping/db/m6-manufacturing`

## Main Artifacts

- `m6-queries.md`
  AI Agent function: raw manufacturing SQL source for BOM, MRS, MRN, PD, PDR, WO, production activity, and route cards.
- `m6-queries-by-type.md`
  AI Agent function: query audit by SQL statement type, useful for distinguishing lookup or read behavior from manufacturing write-path behavior.
- `m0_report_rmoduleid_6.sql`
  AI Agent function: M6 report source used to capture important columns, join patterns, and manufacturing analysis forms used by users.

## AI Agent POV

From the agent perspective:

- `m6-queries.md` is raw evidence of active manufacturing flows
- `m6-queries-by-type.md` is the initial guardrail for readonly versus write-path separation
- `m0_report_rmoduleid_6.sql` is additional evidence for report columns, material flow, and production-process relations

## When To Use It

- when the agent needs to answer questions about BOM, production material flow, work orders, production results, or route cards
- when the team needs to validate whether the M6 semantic schema follows active queries and active reports
