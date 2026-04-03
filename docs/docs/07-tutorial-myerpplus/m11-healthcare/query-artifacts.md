---
title: M11 Query Artifacts
sidebar_position: 2
description: Summary of query artifacts and reports for the healthcare module.
---

# M11 Query Artifacts

This page summarizes query artifacts for `m11-healthcare` from:

- `apps/myerpplus-db-mapping/db/m11-healthcare`

## Main Artifacts

- `m11-queries.md`
  AI Agent function: raw SQL source for patient visits, service billing, laboratory, general clinical services, prescriptions, payments, and medical records.
- `m11-queries-by-type.md`
  AI Agent function: query audit by SQL statement type, useful for distinguishing lookup or read behavior from healthcare service write-path behavior.
- `m0_report_rmoduleid_11.sql`
  AI Agent function: M11 report source used to capture important columns, join patterns, and healthcare analysis forms used by users.

## AI Agent POV

From the agent perspective:

- `m11-queries.md` is raw evidence of the active healthcare domain
- `m11-queries-by-type.md` is the initial guardrail for readonly versus write-path separation
- `m0_report_rmoduleid_11.sql` is additional evidence for billing patterns, service patterns, and patient-visit relations

## When To Use It

- when the agent needs to answer questions about patient visits, billing, clinical services, laboratory, prescriptions, and medical records
- when the team needs to validate whether the M11 semantic schema follows active queries and active reports
