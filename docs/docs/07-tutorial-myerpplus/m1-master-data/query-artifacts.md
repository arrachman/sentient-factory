---
title: Master Data Query Artifacts
sidebar_position: 2
description: Summary of query artifacts and report sources for the MyERPPlus master data module.
---

# Master Data Query Artifacts

This page summarizes query artifacts for `m1-master data` from:

- `apps/myerpplus-db-mapping/db/m1-master data`

## Main Artifacts

- `m1-queries.md`
  AI Agent function: raw master data SQL source for contact, item, warehouse, COA, pricing, category, and other reference entities.
- `m1-queries-by-type.md`
  AI Agent function: query audit by SQL statement type, useful for distinguishing lookup or read behavior from master setup write-path behavior.
- `m0_report_rmoduleid_1.sql`
  AI Agent function: report source for M1 that helps capture important columns and join patterns commonly used by users.

## AI Agent POV

From the agent perspective:

- `m1-queries.md` is raw evidence from legacy service or query logic
- `m1-queries-by-type.md` is the initial guardrail for readonly versus write-path understanding
- `m0_report_rmoduleid_1.sql` is additional evidence for important columns, operational joins, and report forms used by the business

## When To Use It

- when the agent needs to answer questions about contact, item, warehouse, branch, location, tax, currency, price category, and COA master data
- when the team needs to verify whether the M1 semantic schema truly covers tables actively used by queries and reports
