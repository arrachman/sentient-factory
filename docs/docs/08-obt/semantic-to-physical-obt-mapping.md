---
title: Semantic To Physical OBT Mapping
sidebar_position: 3
slug: /obt/semantic-to-physical-obt-mapping
description: Practical mapping from MyERPPlus semantic schema artifacts into physical OBT implementation patterns.
---

# Semantic To Physical OBT Mapping

This page turns the semantic OBT concepts into a more implementation-ready guide for building physical OBT datasets from the artifacts in:

- `apps/myerpplus-db-mapping/db/semantic-schema.json`
- `apps/myerpplus-db-mapping/db/semantic-cross-module-lineage.md`
- module summaries under `apps/myerpplus-db-mapping/db/*/semantic-schema-*-summary.md`

The goal is not to force one ERP-wide mega table.

The goal is to define which physical OBT can be built safely, from which anchor table, with which join path, and with which minimal output contract.

## Core Translation Rules

1. Keep the **canonical semantic name** stable, for example `obt_sales_line_flow`.
2. Choose the **physical anchor** from the grain that the semantic summary treats as safest.
3. Join in this order:
   1. anchor detail or allocation row
   2. upstream or downstream lineage rows
   3. parent header rows
   4. `m1` dimensions
   5. `m0` status or user metadata
4. Do not merge history tables into the default fact.
5. Do not merge payment or allocation tables into line-flow OBTs unless settlement is the actual grain.
6. Cross-module joins are only safe when the semantic artifacts show a stable path, not only a business idea.

## Recommended Physical Naming

- `dim_*` for conformed dimensions such as `dim_item` and `dim_contact`
- `fact_obt_*` for materialized OBT tables
- `vw_obt_*` for virtual or staged views
- `bridge_*` for polymorphic or many-to-many bridge datasets

Examples:

- `fact_obt_sales_line_flow`
- `vw_obt_sales_receivable`
- `bridge_sales_receivable_target`

## Minimal Shared Output Contract

Most physical OBTs should expose a predictable subset of columns, even when some values are `NULL` for a specific process.

- source identity: `source_module`, `source_doc_type`, `source_header_id`, `source_detail_id`
- business document: `doc_no`, `doc_date`, `doc_status_code`, `doc_status_name`
- organizational scope: `branch_code`, `branch_name`, `location_code`, `location_name`
- party scope: `contact_id`, `contact_code`, `contact_name`
- item scope: `item_id`, `item_code`, `item_name`, `uom_code`
- process scope: `upstream_doc_no`, `downstream_doc_no`, `lineage_path`
- measures: `qty`, `amount`, `currency_code`, `exchange_rate`
- governance: `input_user_id`, `input_user_name`, `modified_user_id`, `modified_user_name`

Each OBT may add more columns, but this contract keeps downstream dashboards and AI agents more stable.

## Primary Physical OBT Mappings

### `obt_admin_access`

- Business grain: one row per user-role-menu access combination or activity event
- Physical anchor:
  - `m0_user_role` for access matrix
  - `m0_userlog` for activity/event OBT
- Minimal join path:
  - `m0_user_role.userid -> m0_user.userid`
  - `m0_user_role.role -> m0_role.rkode`
  - `m0_role.rkode -> m0_role_menu.rmrole`
  - `m0_role_menu.rmmoduleid + rmmenuid -> m0_menu.mnmoduleid + mnid`
- Minimal columns:
  - user, role, module, menu, access status, activity date, activity source
- Keep separate:
  - system settings, backup tables, numbering, report metadata, translation tables

### `dim_item`

- Business grain: one row per item master
- Physical anchor: `m1_item`
- Minimal join path:
  - `m1_item.bkelasproduk -> m1_class_product.cpkode`
  - `m1_item.bsubdepartemen -> m1_subdepartment.sdpkode`
  - `m1_item.bkomisi -> m1_selling_point.spid`
- Minimal columns:
  - item id, code, name, class product, unit, active flag, warehouse or stock attributes, account references
- Keep separate:
  - transactional stock movement, sales realization, purchase realization

### `dim_contact`

- Business grain: one row per business contact
- Physical anchor: `m1_contact`
- Minimal join path:
  - `m1_contact.kcategory -> m1_contact_category.cckode`
  - `m1_contact.kcategorycustomer -> m1_customer_category.cckode`
  - `m1_contact.kcategorysupplier -> m1_supplier_category.sckode`
  - `m1_contact.kcategorysalesman -> m1_salesman_category.sckode`
  - `m1_contact.ksalesman -> m1_contact.kid`
- Minimal columns:
  - contact id, code, name, role category, branch, location, salesman, terms, active flag
- Keep separate:
  - AR, AP, sales, and purchasing facts

### `obt_finance_document`

- Business grain: one row per finance detail line, or one row per finance header if the use case is document status only
- Physical anchor:
  - detail-level OBT: `m2_*_detail`
  - header-level monitoring OBT: `m2_*`
- Recommended source families:
  - `m2_cr`, `m2_cr_detail`
  - `m2_cd`, `m2_cd_detail`
  - `m2_bd`, `m2_bd_detail`
  - `m2_rm`, `m2_rm_detail`
  - `m2_sm`, `m2_sm_detail`
  - `m2_cb`, `m2_cb_detail`
  - `m2_rg`, `m2_rg_detail`
  - `m2_sg`, `m2_sg_detail`
  - `m2_gj`, `m2_gj_detail`
  - `m2_aj`, `m2_aj_detail`
  - `m2_jm`, `m2_jm_detail`
- Minimal join path:
  - `m2_*_detail.id* -> m2_*.*id`
  - document header to `m1_contact`, `m1_branch`, `m1_location`, `m1_currency`
  - document detail to `m1_coa`
  - header status and users to `m0_status`, `m0_user`
- Minimal columns:
  - source doc type, document no, document date, branch, location, contact, account, amount, currency, status
- Keep separate:
  - `_pay` tables, `m2_transaction_journal`, giro clearing, history
- Implementation note:
  - if multiple finance document families must be unioned, standardize the output contract first and keep `source_doc_type`

### `obt_finance_allocation`

- Business grain: one row per allocation or payment distribution
- Physical anchor:
  - `m2_rm_pay`
  - `m2_sm_pay`
  - `m2_cb_pay`
- Minimal join path:
  - `_pay.id* -> parent header`
  - parent header to `m1_contact`, `m1_currency`, `m0_status`
- Minimal columns:
  - allocation id, source header, allocation date, contact, payment method, amount, currency, status
- Keep separate:
  - generic finance line OBT and posted-journal layer

### `obt_inventory_movement_line`

- Business grain: one row per stock movement line
- Physical anchor:
  - `m3_mr_detail`
  - `m3_ts_detail`
  - `m3_rs_detail`
  - `m3_sp_detail`
  - `m3_sa_detail`
- Minimal join path:
  - `m3_mr_detail.idmr -> m3_mr.mrid`
  - `m3_ts_detail.idts -> m3_ts.tsid`
  - `m3_rs_detail.idrs -> m3_rs.rsid`
  - `m3_sp_detail.idsp -> m3_sp.spid`
  - `m3_sa_detail.idsa -> m3_sa.said`
  - lineage:
    - `m3_ts_detail.idmrdetail -> m3_mr_detail.idmrdetail`
    - `m3_rs_detail.idmrdetail -> m3_mr_detail.idmrdetail`
    - `m3_rs_detail.idtsdetail -> m3_ts_detail.idtsdetail`
    - `m3_sa_detail.idspdetail -> m3_sp_detail.idspdetail`
  - item and warehouse enrichment from `m1_item`, `m1_warehouse`, `m1_location`
- Minimal columns:
  - movement type, document no, movement date, warehouse from, warehouse to, item, qty, uom, status
- Keep separate:
  - history tables, selling-price setup, notes or files tables

### `obt_purchase_line_flow`

- Business grain: one row per purchasing line across lifecycle documents
- Physical anchor:
  - upstream-first implementation: `m4_pr_detail`
  - operational realization implementation: `m4_po_detail` or `m4_grn_detail`
- Minimal join path:
  - `m4_rq_detail.idprdetail -> m4_pr_detail.idprdetail`
  - `m4_bs_detail.idrqdetail -> m4_rq_detail.idrqdetail`
  - `m4_grn_detail.idpodetail -> m4_po_detail.idpodetail`
  - `m4_ri_detail.idgrndetail -> m4_grn_detail.idgrndetail`
  - `m4_dnr_detail.idridetail -> m4_ri_detail.idridetail`
  - `m4_prt_detail.iddnrdetail -> m4_dnr_detail.iddnrdetail`
  - relevant headers for each detail row
  - vendor and item labels from `m1_contact`, `m1_item`, `m1_warehouse`, `m1_terms`
- Minimal columns:
  - source detail id, PR no, RQ no, BS no, PO no, GRN no, RI no, supplier, item, qty request, qty order, qty receipt, qty invoice
- Keep separate:
  - `m4_vpp_detail`, `m4_vp_detail`, `m4_ap_pay`, `m4_pie_detail`, history
- Implementation note:
  - the safest wide purchasing OBT is detail-based and uses left joins along the lifecycle, not one unioned header table

### `obt_purchase_payment`

- Business grain: one row per payable target or vendor-payment allocation
- Physical anchor:
  - `m4_vpp_detail`
  - `m4_vp_detail`
  - `m4_ap_pay`
- Minimal join path:
  - `m4_vpp_detail.idvpp -> m4_vpp.vppid`
  - `m4_vp_detail.idvp -> m4_vp.vpid`
  - `m4_ap_pay.idap -> m4_ap.apid`
  - polymorphic target:
    - `sumber = AP -> m4_ap.apid`
    - `sumber = RI -> m4_ri.riid`
    - `sumber = PRT -> m4_prt.prtid`
- Minimal columns:
  - proposal no, payment no, target source type, target document no, vendor, due date, payment amount, status
- Keep separate:
  - procurement line-flow OBT

### `obt_sales_line_flow`

- Business grain: one row per sales line across quotation, order, delivery, invoice, and return
- Physical anchor:
  - upstream-first implementation: `m5_so_detail`
  - invoice-first implementation: `m5_si_detail`
- Minimal join path:
  - `m5_sq_detail.idsqdetail -> m5_so_detail.idsqdetail`
  - `m5_pi_detail.idsodetail -> m5_so_detail.idsodetail`
  - `m5_pl_detail.idpidetail -> m5_pi_detail.idpidetail`
  - `m5_do_detail.idsodetail -> m5_so_detail.idsodetail`
  - `m5_dr_detail.iddodetail -> m5_do_detail.iddodetail`
  - `m5_si_detail.idsodetail -> m5_so_detail.idsodetail`
  - `m5_si_detail.iddodetail -> m5_do_detail.iddodetail`
  - `m5_si_detail.idpldetail -> m5_pl_detail.idpldetail`
  - `m5_si_detail.idpidetail -> m5_pi_detail.idpidetail`
  - `m5_si_detail.iddrdetail -> m5_dr_detail.iddrdetail`
  - `m5_rnr_detail.idsidetail -> m5_si_detail.idsidetail`
  - `m5_sr_detail.idsidetail -> m5_si_detail.idsidetail`
  - `m5_sr_detail.idrnrdetail -> m5_rnr_detail.idrnrdetail`
  - customer and item labels from `m1_contact`, `m1_item`, `m1_warehouse`, `m1_terms`
- Minimal columns:
  - SQ no, SO no, PI no, PL no, DO no, DR no, SI no, RNR no, SR no, customer, item, qty ordered, qty shipped, qty invoiced, qty returned
- Keep separate:
  - `m5_ic_detail`, `m5_pv_detail`, `m5_as_pay`, `m5_rp_pay`, history
- Implementation note:
  - if only one primary physical OBT is built for sales, anchor it on `m5_si_detail` or `m5_so_detail`, not on mixed headers

### `obt_sales_receivable`

- Business grain: one row per receivable target or collection/payment allocation
- Physical anchor:
  - `m5_ic_detail`
  - `m5_pv_detail`
  - optionally `m5_si` for invoice-level aging
- Minimal join path:
  - `m5_ic_detail.idic -> m5_ic.icid`
  - `m5_pv_detail.idpv -> m5_pv.pvid`
  - `m5_pv_detail.idicdetail -> m5_ic_detail.idicdetail`
  - polymorphic target:
    - `m5_ic_detail.sumber = AS -> m5_as.asid`
    - `m5_ic_detail.sumber = SI -> m5_si.siid`
    - `m5_ic_detail.sumber = SR -> m5_sr.srid`
    - `m5_pv_detail.sumber = SI -> m5_si.siid`
    - `m5_pv_detail.sumber = SR -> m5_sr.srid`
- Minimal columns:
  - collection no, payment voucher no, target source type, target document no, customer, due date, outstanding amount, settled amount
- Keep separate:
  - order-to-ship line flow
- Implementation note:
  - use a bridge table if downstream users need one normalized target-document key across `AS`, `SI`, and `SR`

### `obt_manufacturing_execution`

- Business grain: one row per work-order material line, output line, or execution activity line
- Physical anchor:
  - `m6_wo_in`
  - `m6_wo_out`
  - `m6_wo_activity`
  - `m6_wo_route_card`
- Optional production-execution anchors:
  - `m6_mrs_out`
  - `m6_mrn_out`
  - `m6_pd_out`
  - `m6_pdr_out`
- Minimal join path:
  - `m6_wo_in.idwo -> m6_wo.woid`
  - `m6_wo_out.idwo -> m6_wo.woid`
  - `m6_wo_activity.idwo -> m6_wo.woid`
  - `m6_wo_route_card.idwo -> m6_wo.woid`
  - production support lineage:
    - `m6_mrn_out.idmrsout -> m6_mrs_out.idmrsout`
    - `m6_pd_out.idmrsout -> m6_mrs_out.idmrsout`
    - `m6_pdr_in.idpdr -> m6_pdr.pdrid`
    - `m6_pdr_out.idpdr -> m6_pdr.pdrid`
  - enrichment from `m1_item`, `m1_warehouse`, `m1_location`
- Minimal columns:
  - work order no, route card, activity, item in, item out, qty planned, qty actual, warehouse, status
- Keep separate:
  - BOM history, header-only reference tables, empty history tables

### `obt_asset_lifecycle`

- Business grain: one row per asset event
- Physical anchor:
  - procurement-origin implementation: `m7_ar_detail`, `m7_aq_detail`, `m7_ao_detail`, `m7_ae_detail`
  - active-lifecycle implementation: `m7_asset`, `m7_at_detail`, `m7_ag_detail`, `m7_da_detail`
- Minimal join path:
  - `m7_aq_detail.idardetail -> m7_ar_detail.idardetail`
  - `m7_ao_detail.idaqdetail -> m7_aq_detail.idaqdetail`
  - `m7_ae_detail.idaodetail -> m7_ao_detail.idaodetail`
  - `m7_at_detail.idat -> m7_at.atid`
  - `m7_ag_detail.idag -> m7_ag.agid`
  - `m7_da_detail.idda -> m7_da.daid`
  - asset master enrichment:
    - `m7_asset.ametode -> m7_depreciation_category.kode`
    - `m7_asset.arekasset -> m1_coa.cnomor`
    - `m7_asset.arekakumdepresiasi -> m1_coa.cnomor`
    - `m7_asset.arekdepresiasi -> m1_coa.cnomor`
- Minimal columns:
  - asset id, asset code, lifecycle stage, acquisition doc, transfer doc, disposal doc, depreciation doc, location, account mapping, status
- Keep separate:
  - history tables and payment rows unless allocation is the target grain

### `obt_metric_snapshot`

- Business grain: one row per metric, chart, indicator, or content snapshot
- Physical anchor: active `m8` content and metric tables
- Minimal join path:
  - metric or chart fact table to any owning content or grouping table
  - optional ownership metadata to `m0_user` or `m0_module`
- Minimal columns:
  - metric key, metric label, content group, snapshot date, value, status
- Keep separate:
  - operational transaction tables from `m2` to `m7`

### `obt_patient_visit_billing`

- Business grain: one row per visit-billing line, or one row per visit-service line when billing is secondary
- Physical anchor:
  - `m_11_ak_detail` for billing-line OBT
  - `m_11_kj` for visit-header monitoring
  - `m_11_lu_detail`, `m_11_lb_detail`, `m_11_ro_detail`, `m_11_kw_detail` for specialized slices
- Minimal join path:
  - `m_11_ak.akidkj -> m_11_kj.kjid`
  - `m_11_ak_detail.idak -> m_11_ak.akid`
  - `m_11_lu.luidkj -> m_11_kj.kjid`
  - `m_11_lb.lbidkj -> m_11_kj.kjid`
  - `m_11_ro.roidkj -> m_11_kj.kjid`
  - `m_11_kw_detail.idkw -> m_11_kw.kwid`
  - visit-linked dimensions from `m1_contact` and service labels from `m1_item`
- Minimal columns:
  - visit no, patient, visit date, billing no, service item, prescription item, lab item, amount, payment amount, status
- Keep separate:
  - full clinical episode, medical record, lab result, and payment into one single row unless the visit anchor is preserved

### `obt_pos_transaction_line`

- Business grain: one row per POS cashier transaction item
- Physical anchor: `m_12_st_detail`
- Minimal join path:
  - `m_12_st_detail.idst -> m_12_st.stid`
  - `m_12_st.stkontak -> m1_contact.kid`
  - `m_12_st_detail.idbarang -> m1_item.bid`
  - optional POS grouping:
    - area and category tables
    - POS item setup tables only when needed for POS-specific classification
- Minimal columns:
  - POS transaction no, cashier date, contact, item, qty, selling amount, POS area, POS category, status
- Keep separate:
  - promo-rule masters, voucher-rule masters, points, history

### `obt_pos_promo_application`

- Business grain: one row per promo or voucher application event
- Physical anchor:
  - `m_12_ai_detail`
  - `m_12_ai_additional`
  - `m_12_bi_detail`
  - `m_12_bi_bonus`
  - `m_12_ppv_detail`
  - `m_12_ppv_pay`
  - `m_12_pos_voucher_out`
- Minimal join path:
  - `m_12_ai_detail.idai -> m_12_ai.aiid`
  - `m_12_ai_additional.idai -> m_12_ai.aiid`
  - `m_12_bi_detail.idbi -> m_12_bi.biid`
  - `m_12_bi_bonus.idbi -> m_12_bi.biid`
  - `m_12_ppv_detail.idppv -> m_12_ppv.ppvid`
  - `m_12_ppv_pay.idppv -> m_12_ppv.ppvid`
  - customer or item labels from `m1_contact`, `m1_item`
- Minimal columns:
  - promo type, promo header no, trigger item, reward item, voucher no, payment usage, customer, item, discount or benefit amount
- Keep separate:
  - cashier sales line OBT unless the explicit goal is promotion attribution

## Explicit Cross-Module Physical OBT Safe Today

### `obt_pos_to_sales`

- Business grain: one row per POS voucher usage traced to a formal sales invoice
- Physical anchor: `m_12_pos_voucher_out`
- Minimal join path:
  - `m_12_pos_voucher_out.voidtransaction -> m5_si.siid`
  - `m5_si.sicustomer -> m1_contact.kid`
  - if item detail is needed:
    - `m5_si_detail.idsidetail -> m5_si.siid`
    - `m5_si_detail.idbarang -> m1_item.bid`
- Minimal columns:
  - voucher no, voucher source, formal invoice no, invoice date, customer, voucher amount, invoice amount
- Keep separate:
  - generic POS setup master and generic sales line-flow OBT unless the question is voucher tracing

## Cross-Module Candidates That Still Need Extra Validation

These can exist as semantic concepts, but the current artifacts do not yet justify a default physical OBT with one universal join rule.

### `obt_sales_to_finance`

- Reason for caution:
  - semantic artifacts treat `M5 -> M2` as a boundary transition, not one stable direct FK
  - finance posting should be traced by identifying the source sales document first, then the finance representation

### `obt_sales_to_inventory`

- Reason for caution:
  - semantic artifacts warn not to invent a universal stable `M5 -> M3` join
  - inventory effect should be modeled from the stock domain once the question becomes warehouse-oriented

### `obt_purchase_to_finance`

- Reason for caution:
  - purchasing payment flow is clear inside `m4`, but a generalized `m4 -> m2` physical OBT still needs explicit implementation-specific keys

### `obt_purchase_to_inventory`

- Reason for caution:
  - business relation is strong, but the current high-confidence cross-module artifact does not yet publish one standardized physical join contract

### `obt_sales_to_manufacturing`

- Reason for caution:
  - active report evidence exists in `m6` query artifacts, but some paths rely on implementation-specific fields such as planning references or custom-text lineage
  - materialize only after the exact path is fixed for your environment

## Practical Build Order

If the target is progressive implementation, the safest order remains:

1. `dim_item`
2. `dim_contact`
3. `obt_inventory_movement_line`
4. `obt_purchase_line_flow`
5. `obt_sales_line_flow`
6. `obt_sales_receivable`
7. `obt_manufacturing_execution`
8. `obt_asset_lifecycle`
9. `obt_pos_transaction_line`
10. `obt_pos_to_sales`

## Summary

The semantic artifacts already support a practical physical OBT strategy, but only if the build respects:

- one semantic process at a time
- one clear anchor grain
- detail-first lineage where the summaries say detail lineage is the safest
- `m1` as dimension backbone
- `m0` as governance enrichment
- cross-module joins only where the current artifacts explicitly support them

For draft SQL implementations, see:

- [Draft Physical OBT SQL Skeletons](./draft-physical-obt-sql-skeletons.md)
