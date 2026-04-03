# M3 NL2SQL Guide

Primary sources:
- `semantic-schema-m3.json`
- `semantic-schema-m3-summary.md`
- `m3-queries.md`

Purpose:
- help select the correct M3 inventory tables
- clarify safe joins across inventory document stages
- provide natural business synonyms for retrieval
- highlight the most common inventory document flow

## Main Table Coverage

- `m3_mr`, `m3_mr_detail`: material request
- `m3_ts`, `m3_ts_detail`: transfer stock
- `m3_rs`, `m3_rs_detail`: receive stock
- `m3_sa`, `m3_sa_detail`: stock adjustment
- `m3_sp`, `m3_sp_detail`: stock opname
- `m3_ib`, `m3_ib_detail`: opening inventory balance
- `m3_pa`, `m3_pa_detail`: selling-price setup
- `m3_rf`, `m3_rf_detail`: fuel refill
- `m3_dc`, `m3_dc_detail`, `m3_dc_check`: daily check and timesheet
- `m3_rw`: warehouse transaction RW
- `m3_files`: inventory attachments
- `m3_notes`: inventory notes

## Business Synonyms

- `MR`: material request
- `TS`: transfer stock, warehouse transfer
- `RS`: receive stock, transfer receipt
- `SA`: stock adjustment
- `SP`: stock opname, physical stock count
- `IB`: opening inventory balance
- `PA`: selling-price setup
- `RF`: fuel refill
- `DC`: daily check, timesheet
- `RW`: warehouse transaction RW

## Primary Join Hints

### material_request_to_transfer_stock

```sql
m3_mr.mrid = m3_mr_detail.idmr
m3_mr_detail.idmrdetail = m3_ts_detail.idmrdetail
m3_ts.tsid = m3_ts_detail.idts
```

### material_request_to_receive_stock

```sql
m3_mr.mrid = m3_mr_detail.idmr
m3_mr_detail.idmrdetail = m3_rs_detail.idmrdetail
m3_rs.rsid = m3_rs_detail.idrs
```

### transfer_stock_to_receive_stock

```sql
m3_ts.tsid = m3_ts_detail.idts
m3_ts_detail.idtsdetail = m3_rs_detail.idtsdetail
m3_rs.rsid = m3_rs_detail.idrs
```

### stock_opname_to_adjustment

```sql
m3_sp.spid = m3_sp_detail.idsp
m3_sp_detail.idspdetail = m3_sa_detail.idspdetail
m3_sa.said = m3_sa_detail.idsa
```

### opening_balance_flow

```sql
m3_ib.ibid = m3_ib_detail.idib
```

## Cross-Document Lineage Keys

In M3, the safest way to read inter-document inventory flow is from detail rows.

### Material Request to Transfer Stock

```sql
m3_ts_detail.idmrdetail -> m3_mr_detail.idmrdetail
m3_mr_detail.idmr -> m3_mr.mrid
```

### Material Request to Receive Stock

```sql
m3_rs_detail.idmrdetail -> m3_mr_detail.idmrdetail
m3_mr_detail.idmr -> m3_mr.mrid
```

### Transfer Stock to Receive Stock

```sql
m3_rs_detail.idtsdetail -> m3_ts_detail.idtsdetail
m3_ts_detail.idts -> m3_ts.tsid
```

### Stock Opname to Stock Adjustment

```sql
m3_sa_detail.idspdetail -> m3_sp_detail.idspdetail
m3_sp_detail.idsp -> m3_sp.spid
```

Practical rules:

- if the user asks which transfer stock document produced a receive stock record, start from `m3_rs_detail`
- if the user asks which stock opname produced an adjustment, start from `m3_sa_detail`
- move to the header only after the source detail row is identified

## Important Additional Relations

### warehouse_and_item_master

```sql
m3_ib_detail.idbarang = m1_item.bid
m3_mr_detail.idbarang = m1_item.bid
m3_ts_detail.idbarang = m1_item.bid
m3_rs_detail.idbarang = m1_item.bid
m3_sa_detail.idbarang = m1_item.bid
m3_sp_detail.idbarang = m1_item.bid
m3_dc.dcidbarang = m1_item_hauling.bid
```

```sql
m3_ib.ibguandg = m1_warehouse.wkode
m3_mr.mrguandgasal = m1_warehouse.wkode
m3_mr.mrguandgtujuan = m1_warehouse.wkode
m3_ts.tsguandgasal = m1_warehouse.wkode
m3_ts.tsguandgtujuan = m1_warehouse.wkode
m3_rs.rsguandgasal = m1_warehouse.wkode
m3_rs.rsguandgtujuan = m1_warehouse.wkode
m3_sa.saguandg = m1_warehouse.wkode
m3_sp.spguandg = m1_warehouse.wkode
```

## Polymorphic Relations

- No explicit polymorphic relationships were detected in active M3 schema and queries.

## Table Selection Rules

- Use header tables when the question is about document number, date, source or destination warehouse, status, or transaction summary.
- Use detail tables when the question is about item, quantity, unit, price, last stock, or line-level realization progress.
- Use `_history` tables only when the user explicitly asks for history, audit changes, or old document versions.
- Use `m3_sp` and `m3_sp_detail` when the question is about physical count variance, opname progress, or stock-opname results.
- Use `m3_sa` when the question is about stock adjustment or transactions generated from opname.
- Use `m3_dc` when the question is about daily checks, timesheets, hauling units, engine hours, or operational checklists.
- Use `m3_pa` when the question is about item selling prices.

## Important Rules

- M3 does not have explicit polymorphic relationships. Prefer direct foreign keys visible in active joins.
- For inventory-flow analysis, start from detail rows so stage-to-stage tracing stays accurate.
- For warehouse analysis, use the warehouse columns that match the source, transit, or destination context.
- For item analysis, prefer joins to `m1_item`; for hauling daily checks, use `m1_item_hauling`.
- `customtext*`, `customint*`, `customdbl*`, and `customdate*` are extension fields. Avoid them unless explicitly requested.
- Daily check (`m3_dc`) has `m3_dc_check`; use it when the user asks for checklist results or check categories.

## Safe Query Patterns

### inventory_document_overview

Use only the header table:

```sql
SELECT mrnotransaksi, mrtgl, mrguandgasal, mrguandgtujuan, mrstatus
FROM m3_mr
```

### item_per_document

Join header to detail:

```sql
SELECT ts.tsnotransaksi, tsd.idbarang, tsd.namabarang, tsd.jmlbarang
FROM m3_ts ts
JOIN m3_ts_detail tsd ON tsd.idts = ts.tsid
```

### request_to_transfer_to_receive_trace

Use:

```sql
MR_DETAIL -> TS_DETAIL -> RS_DETAIL
```

### stock_opname_to_adjustment_trace

Use:

```sql
SP_DETAIL -> SA_DETAIL
```

### opening_inventory_balance

Use:

```sql
IB -> IB_DETAIL
```

## Queries That Need Extra Caution

- questions that mix `MR`, `TS`, and `RS` only at the header level without detail lineage
- questions about stock opname that actually need `m3_sp_detail_progress` or `m3_sp_progress`
- questions about daily check that need a distinction between `m3_dc_detail` and `m3_dc_check`
- questions that mix active tables and `_history`
- questions that rely on `custom*`

## NL2SQL Checklist for M3

- decide header vs detail first
- use the inventory-flow join that matches the document stage
- use `m1_item`, `m1_warehouse`, `m1_contact`, `m1_branch`, and `m1_location` when master labels are needed
- for realization progress, prefer detail rows and line status
- for daily checks, confirm whether the user wants checklist data or hauling-unit data
- avoid assumptions based on `custom*`
