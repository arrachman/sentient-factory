---
title: M7 Query Artifacts
sidebar_position: 2
description: Summary of query artifacts and reports for the M7 module.
---

# M7 Query Artifacts

This page summarizes query artifacts for `m7-procurement advanced` from:

- `apps/myerpplus-db-mapping/db/m7-procurement advanced`

## Main Artifacts

- `m7-queries.md`
  AI Agent function: raw M7 SQL source for asset request, quotation, order, entry, disposal, transfer, depreciation, and asset master data.
- `m7-queries-by-type.md`
  AI Agent function: query audit by SQL statement type, useful for distinguishing lookup or read behavior from asset-domain write-path behavior.
- `m0_report_rmoduleid_7.sql`
  AI Agent function: M7 report source used to capture important columns, join patterns, and analysis forms used by users.

## AI Agent POV

From the agent perspective:

- `m7-queries.md` is raw evidence of the active M7 domain
- `m7-queries-by-type.md` is the initial guardrail for readonly versus write-path separation
- `m0_report_rmoduleid_7.sql` is additional evidence for report columns and asset lifecycle operational relations

## When To Use It

- when the agent needs to answer questions about fixed assets, asset procurement, depreciation, transfer, and disposal
- when the team needs to validate whether the M7 semantic schema follows active queries and active reports
