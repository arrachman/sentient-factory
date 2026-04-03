# Semantic Schema M7 Summary

Schema source: `semantic-schema-m7.json`
Query source: `m7-queries.md`, `m7-queries-by-type.md`, `m0_report_rmoduleid_7.sql`

Total M7 tables in schema: **27**
Total M7 tables detected in active queries: **27**
Total query SELECT: **70** | INSERT: **28** | UPDATE: **30** | DELETE: **25**
Total join hints: **5**

This document summarizes the M7 domain active in query sources. Although the folder is named procurement advanced, the active sources are more heavily oriented toward asset/fixed-asset workflows, asset procurement, and depreciation.

## Join Hints

- `asset_category_tax_flow`: Relationship from assets to asset categories and asset tax categories.
  `m7_asset.acategory = m7_asset_category.ackode`
  `m7_asset_category.ackode = m7_asset_category_tax.actkode`
- `asset_request_to_quotation_flow`: Flow from asset requests to asset quotation requests.
  `m7_ar.arid = m7_ar_detail.idar`
  `m7_ar_detail.idardetail = m7_aq_detail.idardetail`
  `m7_aq.aqid = m7_aq_detail.idaq`
- `asset_quotation_to_order_flow`: Flow from asset quotation requests to asset-procurement orders.
  `m7_aq.aqid = m7_aq_detail.idaq`
  `m7_aq_detail.idaqdetail = m7_ao_detail.idaqdetail`
  `m7_ao.aoid = m7_ao_detail.idao`
- `asset_order_to_entry_flow`: Flow from asset orders to asset-acquisition recording.
  `m7_ao.aoid = m7_ao_detail.idao`
  `m7_ao_detail.idaodetail = m7_ae_detail.idaodetail`
  `m7_ae.aeid = m7_ae_detail.idae`
- `asset_lifecycle_finance_flow`: Relationship from assets to depreciation methods, asset accounts, and progress statuses.
  `m7_asset.ametode = m7_depreciation_category.kode`
  `m7_asset.arekasset = m1_coa.cnomor`
  `m7_asset.arekakumdepresiasi = m1_coa.cnomor`
  `m7_asset.arekdepresiasi = m1_coa.cnomor`

## Detail-Level Relation Keys

This section is important for the AI agent because asset-procurement flow is clearest when read from detail documents, not just from headers.

- `m7_ab_detail.idab -> m7_ab.abid`
  Used when asset booking/approval lines must be traced to the AB header.
- `m7_ar_detail.idar -> m7_ar.arid`
  Used when asset-request lines must be traced to the AR header.
- `m7_aq_detail.idardetail -> m7_ar_detail.idardetail -> m7_ar.arid`
  Used when quotation requests must be traced back to the source asset request.
- `m7_ao_detail.idaqdetail -> m7_aq_detail.idaqdetail -> m7_aq.aqid`
  Used when asset orders must be traced back to the source quotation request.
- `m7_ae_detail.idaodetail -> m7_ao_detail.idaodetail -> m7_ao.aoid`
  Used when asset entry/acquisition must be traced back to the source asset order.
- `m7_ag_detail.idag -> m7_ag.agid`
  Used when asset-disposal rows must be traced to the AG header.
- `m7_at_detail.idat -> m7_at.atid`
  Used when asset-transfer rows must be traced to the AT header.
- `m7_at_pay.idat -> m7_at.atid`
  Used when asset-transfer allocation/payment rows must be traced to the AT header.
- `m7_da_detail.idda -> m7_da.daid`
  Used when depreciation rows must be traced to the DA header.

Practical rules:

- for procurement-origin questions, start from `AR_DETAIL -> AQ_DETAIL -> AO_DETAIL -> AE_DETAIL`
- for lifecycle stages after the asset is active, start from `m7_asset` and then choose document `AT`, `AG`, or `DA`
- do not jump header-to-header if a more explicit detail-level foreign key exists

## Overview Area

- **DOCUMENT_HEADERS**: tables 9
- **DOCUMENT_DETAILS**: tables 9
- **MASTER_TABLES**: tables 3
- **SUPPORTING_TABLES**: tables 2
- **HISTORY_TABLES**: tables 3

## DOCUMENT_HEADERS

### Tables

- `m7_ab` | alias: `asset_ab` | columns: 56
  Asset booking or budget/approval document.
- `m7_ae` | alias: `asset_ae` | columns: 77
  Asset entry or asset-acquisition recording document.
- `m7_ag` | alias: `asset_ag` | columns: 42
  Asset disposal or asset-release document.
- `m7_ao` | alias: `asset_ao` | columns: 72
  Asset order or asset-procurement order.
- `m7_aq` | alias: `asset_aq` | columns: 67
  Asset quotation-request document.
- `m7_ar` | alias: `asset_ar` | columns: 59
  Asset request document.
- `m7_asset` | alias: `asset_asset` | columns: 69
  Fixed-asset master with depreciation attributes, account mapping, and lifecycle status.
- `m7_at` | alias: `asset_at` | columns: 58
  Asset transfer document.
- `m7_da` | alias: `asset_da` | columns: 43
  Asset-depreciation journal or depreciation document.

## DOCUMENT_DETAILS

### Tables

- `m7_ab_detail` | alias: `asset_ab_detail` | columns: 7
  Asset detail on booking/approval documents.
- `m7_ae_detail` | alias: `asset_ae_detail` | columns: 39
  Asset detail from acquisition-recording results.
- `m7_ag_detail` | alias: `asset_ag_detail` | columns: 28
  Asset detail on disposal/write-off documents.
- `m7_ao_detail` | alias: `asset_ao_detail` | columns: 39
  Asset detail on asset-procurement orders.
- `m7_aq_detail` | alias: `asset_aq_detail` | columns: 39
  Asset detail on asset request-quotation documents.
- `m7_ar_detail` | alias: `asset_ar_detail` | columns: 40
  Item/asset detail on asset requests.
- `m7_at_detail` | alias: `asset_at_detail` | columns: 32
  Asset detail on transfer documents.
- `m7_at_pay` | alias: `asset_at_pay` | columns: 16
  Payment/allocation detail related to asset-transfer or acquisition transactions.
- `m7_da_detail` | alias: `asset_da_detail` | columns: 24
  Calculation detail or row-level asset-depreciation detail.

## MASTER_TABLES

### Tables

- `m7_asset_category` | alias: `asset_asset_category` | columns: 24
  Asset/fixed-asset category master.
- `m7_asset_category_tax` | alias: `asset_asset_category_tax` | columns: 23
  Mapping from asset categories to related tax configuration.
- `m7_depreciation_category` | alias: `asset_depreciation_category` | columns: 0
  Depreciation-method or depreciation-category master.

## SUPPORTING_TABLES

### Tables

- `m7_files` | alias: `asset_files` | columns: 8
  Attachment table for asset documents.
- `m7_notes` | alias: `asset_notes` | columns: 8
  Notes table for asset documents.

## HISTORY_TABLES

### Tables

- `m7_asset_category_history` | alias: `asset_asset_category_history` | columns: 0
  Status-change history for asset categories.
- `m7_asset_category_tax_history` | alias: `asset_asset_category_tax_history` | columns: 0
  Status-change history for asset-category tax mappings.
- `m7_asset_history` | alias: `asset_asset_history` | columns: 0
  Status-change history for the asset/fixed-asset master.
