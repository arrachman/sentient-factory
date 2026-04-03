---
title: Semantic OBT Blueprint
sidebar_position: 2
slug: /obt/semantic-obt-blueprint
description: Blueprint of candidate semantic OBT datasets across MyERPPlus modules.
---

# Semantic OBT Blueprint

This page summarizes the most realistic **semantic OBT** candidates for MyERPPlus based on the active module relationships that have been identified.

## Blueprint Goals

This blueprint is intended to:

- define stable derived datasets for dashboards and AI agents
- distinguish module-level OBTs from cross-module OBTs
- avoid the "one giant table for everything" approach

## Naming Convention

Use a **canonical semantic name** that follows the business domain and data grain, not the source module name.

- Prefer names like `obt_sales_line_flow`, not `obt_m5_sales_document_line_flow`
- Keep the source module in metadata or description, for example `Source module: m5`
- Module prefixes are only appropriate for internal implementation artifacts, not for the main semantic name consumed by users or AI agents

With this convention, OBT names stay stable even when the source later expands into other modules such as `m2`, `m3`, or `m12`.

## Core Blueprint

### `obt_admin_access`

- Source module: `m0`
- Grain: one row per user, menu, role, or activity event combination
- Suitable for access audit, activity log monitoring, queue monitoring, and system workflow tracing

### `dim_master_reference`

- Source module: `m1`
- Grain: one row per master entity
- Main entities:
  - item
  - contact
  - branch
  - location
  - warehouse
  - COA
- Suitable as a shared dimension layer across all transaction OBTs

### `obt_finance_document`

- Source module: `m2`
- Grain: one row per finance document header
- Suitable for cash or bank monitoring, receivable or payable state, approval status, and posting status

### `obt_finance_allocation`

- Source module: `m2`
- Grain: one row per allocation, payment, or detail-level relation
- Suitable for settlement tracing, payment tracing, and aging reconciliation

### `obt_inventory_movement_line`

- Source module: `m3`
- Grain: one row per item movement per document
- Suitable for stock movement, receipt or issue analysis, transfers, and quantity movement analytics

### `obt_purchase_line_flow`

- Source module: `m4`
- Grain: one row per procurement detail traced across documents
- Main flow:
  - `PR -> RQ -> BS -> PO -> GRN -> RI`
- Suitable for procurement outstanding, vendor lead time, and purchase realization tracing

### `obt_purchase_payment`

- Source module: `m4 + m2`
- Grain: one row per vendor payment target
- Suitable for AP aging, payment proposals, and invoice-versus-payment realization

### `obt_sales_line_flow`

- Source module: `m5`
- Grain: one row per sales detail traced across documents
- Main flow:
  - `SQ -> SO -> PL/DO -> DR -> SI -> SR`
- Suitable for order fulfillment, line conversion, and shipment or invoicing outstanding analysis
- This is the recommended canonical name for the semantic layer

### `obt_sales_receivable`

- Source module: `m5 + m2`
- Grain: one row per invoice or receivable target
- Suitable for AR aging, collection monitoring, and payment allocation analysis

### `obt_sales_to_inventory`

- Source module: `m5 + m3`
- Grain: one row per sales line that impacts stock
- Suitable for sales stock impact, sold quantity versus stock opname delta, and warehouse or item tracing

### `obt_sales_to_manufacturing`

- Source module: `m5 + m6`
- Grain: one row per demand line propagated into planning or production
- Suitable for make-to-order tracing and production commitment versus sales demand

### `obt_manufacturing_execution`

- Source module: `m6`
- Grain: one row per work order line or material consumption line
- Suitable for work order progress, material issue versus output, and route execution analysis

### `obt_asset_lifecycle`

- Source module: `m7`
- Grain: one row per main asset event
- Suitable for asset registration, mutation, depreciation, and disposal

### `obt_asset_to_finance`

- Source module: `m7 + m2`
- Grain: one row per asset event that has journal or settlement consequences
- Suitable for capitalization, depreciation journal tracing, and finance impact analysis of assets

### `obt_metric_snapshot`

- Source module: `m8`
- Grain: one row per metric, chart, indicator, or content snapshot
- Suitable for dashboard datasets, semantic retrieval, and content-driven analytics

### `obt_patient_visit_billing`

- Source module: `m11`
- Grain: one row per patient visit line or billing line
- Suitable for visit monitoring, service billing, and lab or prescription analysis per episode

### `obt_pos_transaction_line`

- Source module: `m12`
- Grain: one row per POS transaction item
- Suitable for cashier sales analysis, promo effectiveness, and voucher or loyalty impact

### `obt_pos_to_sales`

- Source module: `m12 + m5`
- Grain: one row per POS transaction linked to a formal sales invoice
- Suitable for voucher tracing and POS-to-invoice reconciliation

## Implementation Priority

If this must be implemented incrementally, the most practical order is:

1. `dim_master_reference`
2. `obt_inventory_movement_line`
3. `obt_purchase_line_flow`
4. `obt_sales_line_flow`
5. `obt_sales_receivable`
6. `obt_manufacturing_execution`
7. `obt_asset_lifecycle`
8. `obt_pos_transaction_line`

## Guardrails

- do not mix history tables into the main fact unless the use case is audit
- do not mix setup master data with live transactional data
- do not combine procurement, sales, finance, and manufacturing into one physical OBT without a very clear grain
- for AI agents, always start from the OBT closest to the user's business question

For anchor-table and join-path guidance, see:

- [Semantic To Physical OBT Mapping](./semantic-to-physical-obt-mapping.md)
