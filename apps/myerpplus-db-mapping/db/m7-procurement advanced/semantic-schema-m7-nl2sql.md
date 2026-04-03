# M7 NL2SQL Guide

Primary sources:
- `semantic-schema-m7.json`
- `semantic-schema-m7-summary.md`
- `m7-queries.md`
- `m0_report_rmoduleid_7.sql`

Purpose:
- help select the correct asset and advanced procurement tables
- trace asset procurement flow and fixed-asset lifecycle
- provide read-only guardrails for the M7 domain

## Main Table Coverage

- document_headers: `m7_ab`, `m7_ae`, `m7_ag`, `m7_ao`, `m7_aq`, `m7_ar`, `m7_asset`, `m7_at`, `m7_da`
- document_details: `m7_ab_detail`, `m7_ae_detail`, `m7_ag_detail`, `m7_ao_detail`, `m7_aq_detail`, `m7_ar_detail`, `m7_at_detail`, `m7_at_pay`, `m7_da_detail`
- master_tables: `m7_asset_category`, `m7_asset_category_tax`, `m7_depreciation_category`
- supporting_tables: `m7_files`, `m7_notes`
- history_tables: `m7_asset_category_history`, `m7_asset_category_tax_history`, `m7_asset_history`

## Business Synonyms

- `AR`: asset request
- `AQ`: asset quotation request
- `AO`: asset order
- `AE`: asset entry, asset acquisition
- `AG`: asset disposal
- `AT`: asset transfer
- `DA`: asset depreciation
- `ASSET`: fixed asset

## Primary Join Hints

### asset_category_tax_flow

```sql
m7_asset.akategori = m7_asset_category.ackode
m7_asset_category.ackode = m7_asset_category_tax.actkode
```

### asset_request_to_quotation_flow

```sql
m7_ar.arid = m7_ar_detail.idar
m7_ar_detail.idardetail = m7_aq_detail.idardetail
m7_aq.aqid = m7_aq_detail.idaq
```

### asset_quotation_to_order_flow

```sql
m7_aq.aqid = m7_aq_detail.idaq
m7_aq_detail.idaqdetail = m7_ao_detail.idaqdetail
m7_ao.aoid = m7_ao_detail.idao
```

### asset_order_to_entry_flow

```sql
m7_ao.aoid = m7_ao_detail.idao
m7_ao_detail.idaodetail = m7_ae_detail.idaodetail
m7_ae.aeid = m7_ae_detail.idae
```

### asset_lifecycle_finance_flow

```sql
m7_asset.ametode = m7_depreciation_category.kode
m7_asset.arekasset = m1_coa.cnomor
m7_asset.arekakumdepresiasi = m1_coa.cnomor
m7_asset.arekdepresiasi = m1_coa.cnomor
```

## Cross-Document Lineage Keys

This section is important for the AI agent because M7 flow is more accurate when read from asset-procurement detail rows first, and only then lifted to the document header.

- `m7_ab_detail.idab -> m7_ab.abid`
  Used when an asset booking or approval line must be traced to the AB header.
- `m7_ar_detail.idar -> m7_ar.arid`
  Used when an asset request line must be traced to the AR header.
- `m7_aq_detail.idardetail -> m7_ar_detail.idardetail -> m7_ar.arid`
  Used when a quotation request must be traced back to the originating asset request.
- `m7_ao_detail.idaqdetail -> m7_aq_detail.idaqdetail -> m7_aq.aqid`
  Used when an asset order must be traced back to the originating quotation request.
- `m7_ae_detail.idaodetail -> m7_ao_detail.idaodetail -> m7_ao.aoid`
  Used when an asset acquisition must be traced back to the originating asset order.
- `m7_ag_detail.idag -> m7_ag.agid`
  Used when an asset disposal line must be traced to the AG header.
- `m7_at_detail.idat -> m7_at.atid`
  Used when an asset transfer line must be traced to the AT header.
- `m7_at_pay.idat -> m7_at.atid`
  Used when transfer payment or allocation rows must be traced to the AT header.
- `m7_da_detail.idda -> m7_da.daid`
  Used when a depreciation line must be traced to the DA header.

Practical rules:

- for origin-of-procurement questions, start from `AR_DETAIL -> AQ_DETAIL -> AO_DETAIL -> AE_DETAIL`
- for lifecycle transactions after the asset exists, use `m7_asset` as the master and join to documents such as `AT`, `AG`, or `DA`
- do not jump header-to-header when a more explicit detail foreign key exists
- distinguish the fixed-asset master from asset-procurement flow documents

## Table Selection Rules

- Use header tables for document number, date, status, and asset-lifecycle references.
- Use detail tables for asset or item lines inside procurement or disposal documents.
- Use asset, category, and depreciation master tables when the question is about fixed-asset setup rather than document flow.
- Use history tables only when the user explicitly asks for asset history or audit changes.
- This domain is asset-heavy. Do not assume every M7 table is ordinary procurement.

## Safe Query Patterns

### asset_master_lookup

Use `m7_asset`, `m7_asset_category`, and `m7_depreciation_category`.

### asset_procurement_flow

`AR -> AR_DETAIL -> AQ_DETAIL -> AO_DETAIL -> AE_DETAIL`

### asset_depreciation_trace

Use `m7_asset`, `m7_depreciation_category`, `m7_da`, and `m7_da_detail`.

## Queries That Need Extra Caution

- Questions that mix asset procurement with fixed-asset master data without separating documents from master tables.
- Questions that rely on the folder name and ignore that the active source is mostly asset lifecycle.
- Questions that combine history tables with active tables without a clear audit purpose.
