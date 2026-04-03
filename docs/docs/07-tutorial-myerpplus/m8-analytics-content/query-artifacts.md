---
title: M8 Query Artifacts
sidebar_position: 2
description: Summary of query artifacts and reports for the analytics content module.
---

# M8 Query Artifacts

This page summarizes query artifacts for `m8-analytics content` from:

- `apps/myerpplus-db-mapping/db/m8-analytics content`

## Main Artifacts

- `m8-queries.md`
  AI Agent function: raw SQL source for dashboard content, chart configuration, indicator thresholds, and metric analytics.
- `m8-queries-by-type.md`
  AI Agent function: query audit by SQL statement type, useful for distinguishing readonly setup logic from write-path indicator maintenance.
- `m0_report_rmoduleid_8.sql`
  AI Agent function: M8 report source used to capture the analytics views consumed by users.

## AI Agent POV

From the agent perspective:

- `m8-queries.md` is raw evidence of active analytics setup
- `m8-queries-by-type.md` is the initial guardrail for readonly versus write-path separation
- `m0_report_rmoduleid_8.sql` is additional evidence for analytics view patterns and drill-down structure

## When To Use It

- when the agent needs to answer questions about dashboard content configuration, KPI thresholds, charts, or specific metric analytics
- when the team needs to validate whether the M8 semantic schema follows active queries and active reports
