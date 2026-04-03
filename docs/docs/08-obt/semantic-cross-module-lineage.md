---
title: Semantic Cross-Module Lineage
sidebar_position: 3
slug: /obt/semantic-cross-module-lineage
description: Safe cross-module relationship map for readonly AI agents in MyERPPlus.
---

# Semantic Cross-Module Lineage

This page summarizes the **cross-module** artifacts used to help an AI agent understand when it should stay within one domain, when it should move to another module, and which joins are safe enough to use.

## Purpose

This artifact is used to:

- reduce speculative cross-module joins
- clarify the boundary between sales, POS, finance, and inventory
- provide stable tracing patterns for readonly agents

## Source Artifacts

Main source files:

```text
apps/myerpplus-db-mapping/db/semantic-cross-module-lineage.md
apps/myerpplus-db-mapping/db/semantic-cross-module-lineage.json
```

This document is designed as a companion to the module-level semantic schemas for:

- `m3-inventory`
- `m4-purchasing`
- `m5-sales`
- `m12-pos`

## Module Backbone

### `M1` as the shared dimension layer

Use `M1` for stable master labels:

- contact / customer / supplier
- item / product
- branch / location / project / division

### `M2` as the finance boundary

Move into `M2` when the question clearly enters:

- cash / bank
- payment allocation
- posted journal
- accounting impact

### `M3` as the inventory boundary

Move into `M3` when the question clearly enters:

- stock
- warehouse movement
- transfer / stock receiving
- adjustment / stock opname

## High-Confidence Relations

### `M5 -> M1`

Stable pattern:

```sql
m5_*customer -> m1_contact.kid
m5_*_detail.idbarang -> m1_item.bid
```

### `M12 -> M1`

Stable pattern:

```sql
m_12_st.stkontak -> m1_contact.kid
m_12_ppv.ppvcustomer -> m1_contact.kid
m_12_st_detail.idbarang -> m1_item.bid
m_12_pos_item.piidbarang -> m1_item.bid
```

### `M12 -> M5`

Stable pattern:

```sql
m_12_pos_voucher_out.voidtransaksi -> m5_si.siid
```

Business meaning:

- a POS voucher that is truly consumed on a formal sales invoice points to `m5_si`

## Boundary Rules

### From `M5` or `M12` to `M2`

Do not move to finance only because the user mentions invoice and journal in the same question. First anchor the document in `M5` or `M12`, then move to `M2` only if the intent is truly accounting-related.

### From `M5` or `M12` to `M3`

Do not move to inventory only because the user mentions items. Move to `M3` only if the user intent is explicitly about stock, warehouse movement, or inventory movement.

## Safe Tracing Patterns

### POS voucher to formal invoice

```sql
m_12_pos_voucher_out.voidtransaksi -> m5_si.siid
m5_si.sicustomer -> m1_contact.kid
m5_si_detail.idbarang -> m1_item.bid
```

### Sales invoice to master labels

```sql
m5_si.sicustomer -> m1_contact.kid
m5_si_detail.idbarang -> m1_item.bid
```

### POS transaction to master labels

```sql
m_12_st.stkontak -> m1_contact.kid
m_12_st_detail.idbarang -> m1_item.bid
```

## What Not To Do

- do not join `M5 -> M2` without strong evidence of a stable finance relation
- do not join `M12 -> M3` without validating that the intent is inventory-related
- do not use `M12` as the main item master
- do not use `M5` or `M12` to guess posted journals when `M2` is the actual target domain
- do not create cross-module header-to-header joins when the stable relation exists at detail level or only exists as a semantic boundary

## When The Agent Should Use This

Use this artifact when the user question:

- touches more than one module
- needs a boundary check across domains
- is prone to over-joining into finance or inventory
- needs tracing from POS to formal sales

For single-domain questions, always prioritize the module-level semantic schema first.
