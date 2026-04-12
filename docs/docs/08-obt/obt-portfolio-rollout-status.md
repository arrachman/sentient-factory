---
title: OBT Portfolio Rollout Status
sidebar_position: 9
slug: /obt/obt-portfolio-rollout-status
description: Current rollout status for the canonical OBT portfolio, including bootstrapped, source-empty, blocked, and queued states.
---

# OBT Portfolio Rollout Status

This page tracks the real rollout state of the canonical `obt_*` portfolio.

Status labels:

- `bootstrapped`: baseline data has been loaded into the physical OBT table
- `source-empty`: loader exists or baseline run has been attempted, but source data is currently empty
- `blocked`: the OBT is not materialized because required source tables or CDC coverage are missing
- `queued`: the OBT is conceptually defined but not yet implemented in the current rollout

## Current Verified Status

### Administrator Domain (`m0`)

| Canonical OBT | Status | Current result | Notes |
| --- | --- | --- | --- |
| `obt_admin_access` | `bootstrapped` | `457901` rows | rebuilt from `myerpplus_landing` `m0_user`, `m0_user_role`, `m0_role`, `m0_role_menu`, `m0_menu`, and `m0_userlog` baseline |
| `obt_menu_authorization` | `bootstrapped` | `3649` rows | built from role-menu authorization matrix |
| `obt_system_configuration` | `bootstrapped` | `141` rows | built from `m0_nomor` numbering configuration |
| `obt_queue_activity` | `blocked` | `0` rows | source queue tables such as `m0_queue`, `m0_queue_log`, and `m0_queue_activity` were not found in the source MySQL database |

### Master Dimension Domain (`m1`)

| Canonical output | Status | Current result | Notes |
| --- | --- | --- | --- |
| `dim_item` | `bootstrapped` | `16223` rows | built from landed `m1_item` baseline |
| `dim_contact` | `bootstrapped` | `2714` rows | built from landed `m1_contact` baseline |

### Finance Domain (`m2`)

| Canonical OBT | Status | Current result | Notes |
| --- | --- | --- | --- |
| `obt_finance_document` | `bootstrapped` | `1034` rows | current baseline covers `CR`, `CD`, `RM`, `SM`, `CB`, and `GJ` document families |
| `obt_finance_document_line` | `bootstrapped` | `2327` rows | current baseline covers `CR_LINE`, `CD_LINE`, `RM_LINE`, `SM_LINE`, `CB_LINE`, and `GJ_LINE` |
| `obt_finance_allocation` | `source-empty` | `0` rows | allocation source families such as `m2_rm_pay`, `m2_sm_pay`, and `m2_cb_pay` are currently empty in the source database |

### Inventory Domain (`m3`)

| Canonical OBT | Status | Current result | Notes |
| --- | --- | --- | --- |
| `obt_inventory_movement_line` | `bootstrapped` | `4152` rows | current baseline covers `TS_LINE`, `SP_LINE`, and `SA_LINE`; `MR_LINE` and `RS_LINE` loader paths are wired, but source MySQL tables `m3_mr`, `m3_mr_detail`, `m3_rs`, and `m3_rs_detail` are currently empty |

### Purchasing Domain (`m4`)

| Canonical OBT | Status | Current result | Notes |
| --- | --- | --- | --- |
| `obt_purchase_line_flow` | `bootstrapped` | `1639` rows | current anchor is purchase line flow baseline |
| `obt_purchase_payment` | `bootstrapped` | `1266` rows | current baseline covers `AP_PAY` and `VP_DETAIL`; `VPP_DETAIL` source is currently empty |

### Sales Domain (`m5`)

| Canonical OBT | Status | Current result | Notes |
| --- | --- | --- | --- |
| `obt_sales_line_flow` | `bootstrapped` | `23197` rows | current anchor is sales invoice line flow baseline |
| `obt_sales_receivable` | `bootstrapped` | `26919` rows | current baseline covers `IC_DETAIL` and `PV_DETAIL`; current `PV_DETAIL` source mix includes `SI`, `SR`, `AS`, `IP`, and `CA` |

### POS Domain (`m12`)

| Canonical OBT | Status | Current result | Notes |
| --- | --- | --- | --- |
| `obt_pos_transaction_line` | `source-empty` | `0` rows | source `m_12_st` and `m_12_st_detail` are currently empty |
| `obt_pos_promo_application` | `queued` | `0` rows | voucher and promo application families are not yet materialized |

## Additional Physical OBTs Already Active

The current implementation also contains several useful physical OBTs that support the canonical portfolio but are more specific than the canonical names:

| Physical OBT | Current result | Notes |
| --- | --- | --- |
| `obt_cash_disbursement_line_flow` | `402` rows | source family `m2_cd_detail` |
| `obt_cash_receipt_line_flow` | `8` rows | source family `m2_cr_detail` |
| `obt_receipt_money_line_flow` | `205` rows | source family `m2_rm_detail` |
| `obt_sales_order_line_flow` | `18255` rows | source family `m5_so_detail` |
| `obt_sales_receivable` | `26919` rows | source families `m5_ic_detail` and `m5_pv_detail` |
| `obt_purchase_document_line_event` | `30266` rows | source families `PO`, `RI`, and related purchase document lines |
| `obt_purchase_payment` | `1266` rows | source families `m4_ap_pay` and `m4_vp_detail`; `m4_vpp_detail` is currently empty |

## Current Gaps

- `CDC` for transactional domains is still not active in `cdc_events` and `cdc_current_state`, so all populated OBTs are still baseline batch results
- canonical domains `m6`, `m7`, and `m11` are still `queued`
- some canonical tables already exist physically in PostgreSQL but still remain empty because their loaders have not been implemented yet

## Rollout Rule

No canonical `obt_*` should remain untracked.

Every canonical OBT must always be assigned to one of these states:

- `bootstrapped`
- `source-empty`
- `blocked`
- `queued`
