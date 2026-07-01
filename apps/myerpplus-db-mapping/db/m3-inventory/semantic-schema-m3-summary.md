# Semantic Schema M3 Summary

Schema source: `/opt/sentient-factory/apps/myerpplus-db-mapping/db/semantic-schema-m3.json`
Function/query source: `/opt/sentient-factory/m3-queries.md`, `/opt/sentient-factory/m0_report_rmoduleid_3.sql`, `/opt/sentient-factory/client-backend/api-myerpplus/app_code/ws/m0/m0_query.vb`

Total M3 tables in schema: **43**
Total M3 tables detected in active queries: **43**
Total function M3: **44**
Total polymorphic relationships: **0**
Total join hints: **5**

This document summarizes aliases, descriptions, table structure, main relationships, join hints, and primary semantic functions for M3 Inventory.
The schema JSON has been synchronized with active M3 queries and reports, so history, progress, and auxiliary tables detected in source queries are now included in the schema.

## Join Hints

- `inventory_request_to_transfer_flow`: Material-request flow into stock transfer.
  `m3_mr.mrid = m3_mr_detail.idmr`
  `m3_mr_detail.idmrdetail = m3_ts_detail.idmrdetail`
  `m3_ts.tsid = m3_ts_detail.idts`
- `inventory_request_to_receipt_flow`: Material-request flow into stock receipt.
  `m3_mr.mrid = m3_mr_detail.idmr`
  `m3_mr_detail.idmrdetail = m3_rs_detail.idmrdetail`
  `m3_rs.rsid = m3_rs_detail.idrs`
- `transfer_to_receipt_flow`: Transfer-stock flow into receipt processing.
  `m3_ts.tsid = m3_ts_detail.idts`
  `m3_ts_detail.idtsdetail = m3_rs_detail.idtsdetail`
  `m3_rs.rsid = m3_rs_detail.idrs`
- `stock_opname_adjustment_flow`: Stock-opname flow into stock-adjustment transactions.
  `m3_sp.spid = m3_sp_detail.idsp`
  `m3_sp_detail.idspdetail = m3_sa_detail.idspdetail`
  `m3_sa.said = m3_sa_detail.idsa`
- `opening_balance_inventory_flow`: Opening inventory balance relationship with opening-balance detail rows.
  `m3_ib.ibid = m3_ib_detail.idib`

## Detail-Level Relation Keys

This section is important for the AI agent because M3 inventory tracing often has to start from lineage keys stored in detail tables.

- `m3_ts_detail.idmrdetail -> m3_mr_detail.idmrdetail -> m3_mr.mrid`
  Used when a transfer-stock line must be traced back to its originating material request.
- `m3_rs_detail.idmrdetail -> m3_mr_detail.idmrdetail -> m3_mr.mrid`
  Used when a receive-stock line must be traced back to its originating material request.
- `m3_rs_detail.idtsdetail -> m3_ts_detail.idtsdetail -> m3_ts.tsid`
  Used when a receive-stock line must be traced back to its originating transfer stock.
- `m3_sa_detail.idspdetail -> m3_sp_detail.idspdetail -> m3_sp.spid`
  Used when a stock-adjustment line must be traced back to the stock opname source.

Practical rules:

- for inventory lineage questions, starting from detail is safer than starting from headers
- move to the header only after the source line is identified
- the most stable lineage paths are `MR -> TS -> RS` and `SP -> SA`, both read from detail-level keys

## Polymorphic Relationships

- No explicit polymorphic relationships were detected in the active M3 schema/query set.

## Module Overview

- **MR**: Material Request | schema tables: 4 | header: 1 | detail: 1 | history/progress: 2 | relations: 2
- **TS**: Transfer Stock | schema tables: 4 | header: 1 | detail: 1 | history/progress: 2 | relations: 3
- **RS**: Receive Stock | schema tables: 4 | header: 1 | detail: 1 | history/progress: 2 | relations: 3
- **SA**: Stock Adjustment Transaction | schema tables: 4 | header: 1 | detail: 1 | history/progress: 2 | relations: 1
- **SP**: Stock Opname | schema tables: 6 | header: 1 | detail: 1 | history/progress: 4 | relations: 1
- **PA**: Selling Price Setup | schema tables: 4 | header: 1 | detail: 1 | history/progress: 2 | relations: 1
- **IB**: Opening Inventory Balance | schema tables: 4 | header: 1 | detail: 1 | history/progress: 2 | relations: 1
- **RF**: Fuel Refill | schema tables: 4 | header: 1 | detail: 1 | history/progress: 2 | relations: 1
- **DC**: Daily Check / Timesheet | schema tables: 6 | header: 1 | detail: 2 | history/progress: 3 | relations: 2
- **RW**: Warehouse Transaction RW | schema tables: 1 | header: 1 | detail: 0 | history/progress: 0 | relations: 0
- **NOTES**: Inventory Notes | schema tables: 1 | header: 0 | detail: 0 | history/progress: 0 | relations: 0
- **FILES**: Inventory Attachments | schema tables: 1 | header: 0 | detail: 0 | history/progress: 0 | relations: 0

## MR - Material Request / Permintaan Barang

Material request across warehouses or for internal needs.

### Tables

- `m3_mr` | alias: `inventory_mr` | type: Header | columns: 28
  Inventory or warehouse transaction for mr.
- `m3_mr_detail` | alias: `inventory_mr_detail` | type: Detail | columns: 32
  Detail table for transaction item/row mr detail.
- `m3_mr_detail_history` | alias: `inventory_mr_detail` | type: History | columns: 32
  History/archive table detected from active M3 query sources.
- `m3_mr_history` | alias: `inventory_mr` | type: History | columns: 28
  History/archive table detected from active M3 query sources.

### Important Header Columns

- `mrid`: Business column mrid.
- `mrguandgasal`: Source/destination warehouse reference.
- `mrguandgtujuan`: Source/destination warehouse reference.
- `mrautonotransaksi`: Unique document/transaction number.
- `mrnotransaksi`: Unique document/transaction number.
- `mrtgl`: Transaction date or reference date.
- `mrkodepa`: Business column mrkodepa.
- `mrdimintaolehkontak`: Contact reference or contact person.
- `mrtgldipakai`: Business column mrtgldipakai.
- `mrtglnoref`: Business column mrtglnoref.
- `mrstatusts`: Process status or document status.
- `mrstatusrs`: Process status or document status.

### Main Relationships

- `m3_mr_detail` -> `m3_mr`: `m3_mr_detail.idmr = m3_mr.mrid`
- `m3_mr_detail` -> `m3_ts_detail`: `m3_mr_detail.idmrdetail = m3_ts_detail.idmrdetail`
- `m3_mr_detail` -> `m3_rs_detail`: `m3_mr_detail.idmrdetail = m3_rs_detail.idmrdetail`

### Functions

- `m3_mr_v`: Provides document listing or search.
- `m3_mr_getdata`: Retrieves header and detail data for a single transaction document.
- `m3_mr_v_history`: Provides document status-change history listing.
- `m3_mr_getdata_history`: Retrieves header/detail status-change history for a single transaction document.
- `m3_mr_detail_cd`: Provides compact lookup/detail data for picker or dropdown use cases.
- `m3_mr_detail_v`: Provides document listing or search.
- `m3_mr_terkait1`: Retrieves document linkage with other inventory documents.
- `m3_mr_terkait`: Retrieves document linkage with other inventory documents.

## TS - Transfer Stock / Mutasi Barang

Stock transfer across warehouses, including transit movement.

### Tables

- `m3_ts` | alias: `inventory_ts` | type: Header | columns: 28
  Inventory or warehouse transaction for ts.
- `m3_ts_detail` | alias: `inventory_ts_detail` | type: Detail | columns: 29
  Detail table for transaction item/row ts detail.
- `m3_ts_detail_history` | alias: `inventory_ts_detail` | type: History | columns: 29
  History/archive table detected from active M3 query sources.
- `m3_ts_history` | alias: `inventory_ts` | type: History | columns: 28
  History/archive table detected from active M3 query sources.

### Important Header Columns

- `tsid`: Business column tsid.
- `tsguandgasal`: Source/destination warehouse reference.
- `tsguandgtransit`: Source/destination warehouse reference.
- `tsguandgtujuan`: Source/destination warehouse reference.
- `tsautonotransaksi`: Unique document/transaction number.
- `tsnotransaksi`: Unique document/transaction number.
- `tstgl`: Transaction date or reference date.
- `tskodepa`: Business column tskodepa.
- `tsbagiantransferkontak`: Contact reference or contact person.
- `tstglnoref`: Business column tstglnoref.
- `tsidmr`: Business column tsidmr.
- `tsstatusrs`: Process status or document status.

### Main Relationships

- `m3_ts_detail` -> `m3_ts`: `m3_ts_detail.idts = m3_ts.tsid`
- `m3_ts_detail` -> `m3_mr_detail`: `m3_ts_detail.idmrdetail = m3_mr_detail.idmrdetail`
- `m3_ts_detail` -> `m3_rs_detail`: `m3_ts_detail.idtsdetail = m3_rs_detail.idtsdetail`

### Functions

- `m3_ts_v`: Provides document listing or search.
- `m3_ts_getdata`: Retrieves header and detail data for a single transaction document.
- `m3_ts_v_history`: Provides document status-change history listing.
- `m3_ts_getdata_history`: Retrieves header/detail status-change history for a single transaction document.
- `m3_ts_detail_cd`: Provides compact lookup/detail data for picker or dropdown use cases.
- `m3_ts_detail_v`: Provides document listing or search.
- `m3_ts_terkait`: Retrieves document linkage with other inventory documents.

## RS - Receive Stock / Terima Mutasi

Receipt of goods produced by transfer or stock-move processing.

### Tables

- `m3_rs` | alias: `inventory_rs` | type: Header | columns: 26
  Inventory or warehouse transaction for rs.
- `m3_rs_detail` | alias: `inventory_rs_detail` | type: Detail | columns: 24
  Detail table for transaction item/row rs detail.
- `m3_rs_detail_history` | alias: `inventory_rs_detail` | type: History | columns: 24
  History/archive table detected from active M3 query sources.
- `m3_rs_history` | alias: `inventory_rs` | type: History | columns: 26
  History/archive table detected from active M3 query sources.

### Important Header Columns

- `rsid`: Business column rsid.
- `rsguandgasal`: Source/destination warehouse reference.
- `rsguandgtransit`: Source/destination warehouse reference.
- `rsguandgtujuan`: Source/destination warehouse reference.
- `rsautonotransaksi`: Unique document/transaction number.
- `rsnotransaksi`: Unique document/transaction number.
- `rstgl`: Transaction date or reference date.
- `rskodepa`: Business column rskodepa.
- `rsbagianterimakontak`: Contact reference or contact person.
- `rstglnoref`: Business column rstglnoref.
- `rsidmr`: Business column rsidmr.
- `rsidts`: Business column rsidts.

### Main Relationships

- `m3_rs_detail` -> `m3_rs`: `m3_rs_detail.idrs = m3_rs.rsid`
- `m3_rs_detail` -> `m3_ts_detail`: `m3_rs_detail.idtsdetail = m3_ts_detail.idtsdetail`
- `m3_rs_detail` -> `m3_mr_detail`: `m3_rs_detail.idmrdetail = m3_mr_detail.idmrdetail`

### Functions

- `m3_rs_v`: Provides document listing or search.
- `m3_rs_getdata`: Retrieves header and detail data for a single transaction document.
- `m3_rs_v_history`: Provides document status-change history listing.
- `m3_rs_getdata_history`: Retrieves header/detail status-change history for a single transaction document.
- `m3_rs_terkait`: Retrieves document linkage with other inventory documents.

## SA - Transaksi Barang

General stock movement / stock adjustment.

### Tables

- `m3_sa` | alias: `inventory_sa` | type: Header | columns: 26
  Inventory or warehouse transaction for sa.
- `m3_sa_detail` | alias: `inventory_sa_detail` | type: Detail | columns: 28
  Detail table for transaction item/row sa detail.
- `m3_sa_detail_history` | alias: `inventory_sa_detail` | type: History | columns: 28
  History/archive table detected from active M3 query sources.
- `m3_sa_history` | alias: `inventory_sa` | type: History | columns: 26
  History/archive table detected from active M3 query sources.

### Important Header Columns

- `said`: Business column said.
- `saguandg`: Source/destination warehouse reference.
- `saautonotransaksi`: Unique document/transaction number.
- `sanotransaksi`: Unique document/transaction number.
- `satgl`: Transaction date or reference date.
- `sakodepa`: Business column sakodepa.
- `sabagiansakontak`: Contact reference or contact person.
- `satglnoref`: Business column satglnoref.
- `saidsp`: Business column saidsp.
- `sastatus`: Process status or document status.
- `sastatussebelumnya`: Process status or document status.
- `sapostingtgl`: Transaction date or reference date.

### Main Relationships

- `m3_sa_detail` -> `m3_sa`: `m3_sa_detail.idsa = m3_sa.said`
- `m3_sa_detail` -> `m3_sp_detail`: `m3_sa_detail.idspdetail = m3_sp_detail.idspdetail` when the adjustment is sourced from stock counting

### Functions

- `m3_sa_v`: Provides document listing or search.
- `m3_sa_getdata`: Retrieves header and detail data for a single transaction document.
- `m3_sa_v_history`: Provides document status-change history listing.
- `m3_sa_getdata_history`: Retrieves header/detail status-change history for a single transaction document.
- `m3_sa_terkait`: Retrieves document linkage with other inventory documents.

## SP - Stock Opname

Physical stock counting notes, variance tracking, and counting progress.

### Tables

- `m3_sp` | alias: `inventory_sp` | type: Header | columns: 26
  Inventory or warehouse transaction for sp.
- `m3_sp_detail` | alias: `inventory_sp_detail` | type: Detail | columns: 31
  Detail table for transaction item/row sp detail.
- `m3_sp_detail_history` | alias: `inventory_sp_detail` | type: History | columns: 31
  History/archive table detected from active M3 query sources.
- `m3_sp_detail_progress` | alias: `inferred_from_query` | type: Progress | columns: 0
  Progress/process table detected from active M3 query sources.
- `m3_sp_history` | alias: `inventory_sp` | type: History | columns: 26
  History/archive table detected from active M3 query sources.
- `m3_sp_progress` | alias: `inferred_from_query` | type: Progress | columns: 0
  Progress/process table detected from active M3 query sources.

### Important Header Columns

- `spid`: Business column spid.
- `spguandg`: Source/destination warehouse reference.
- `spautonotransaksi`: Unique document/transaction number.
- `spnotransaksi`: Unique document/transaction number.
- `sptgl`: Transaction date or reference date.
- `spkodepa`: Business column spkodepa.
- `spbagianspkontak`: Contact reference or contact person.
- `sptglnoref`: Business column sptglnoref.
- `spstatussa`: Process status or document status.
- `spstatus`: Process status or document status.
- `spstatussebelumnya`: Process status or document status.
- `sppostingtgl`: Transaction date or reference date.

### Main Relationships

- `m3_sp_detail` -> `m3_sp`: `m3_sp_detail.idsp = m3_sp.spid`
- `m3_sp_detail_progress` -> `m3_sp_detail`: `m3_sp_detail_progress.idspdetail = m3_sp_detail.idspdetail` (inferred)
- `m3_sp_progress` -> `m3_sp`: `m3_sp_progress.idsp = m3_sp.spid` (inferred)

### Functions

- `m3_sp_v`: Provides document listing or search.
- `m3_sp_getdata`: Retrieves header and detail data for a single transaction document.
- `m3_sp_v_history`: Provides document status-change history listing.
- `m3_sp_getdata_history`: Retrieves header/detail status-change history for a single transaction document.
- `m3_sp_detail_cd`: Provides compact lookup/detail data for picker or dropdown use cases.
- `m3_sp_detail_v`: Provides document listing or search.
- `m3_sp_terkait`: Retrieves document linkage with other inventory documents.

## PA - Sales Price Setup

Sales-price setup or update for goods.

### Tables

- `m3_pa` | alias: `inventory_pa` | type: Header | columns: 28
  Inventory or warehouse transaction for pa.
- `m3_pa_detail` | alias: `inventory_pa_detail` | type: Detail | columns: 60
  Detail table for transaction item/row pa detail.
- `m3_pa_detail_history` | alias: `inventory_pa_detail` | type: History | columns: 60
  History/archive table detected from active M3 query sources.
- `m3_pa_history` | alias: `inventory_pa` | type: History | columns: 28
  History/archive table detected from active M3 query sources.

### Important Header Columns

- `paid`: Business column paid.
- `paguandg`: Source/destination warehouse reference.
- `paautonotransaksi`: Unique document/transaction number.
- `panotransaksi`: Unique document/transaction number.
- `patgl`: Transaction date or reference date.
- `patglberlakusampai`: Business column patglberlakusampai.
- `pakodepa`: Business column pakodepa.
- `pabagianpakontak`: Contact reference or contact person.
- `pamorang`: Currency and exchange-rate information.
- `pakurs`: Currency and exchange-rate information.
- `patglnoref`: Business column patglnoref.
- `pastatus`: Process status or document status.

### Main Relationships

- `m3_pa_detail` -> `m3_pa`: `m3_pa_detail.idpa = m3_pa.paid`

### Functions

- `m3_pa_v`: Provides document listing or search.
- `m3_pa_getdata`: Retrieves header and detail data for a single transaction document.
- `m3_pa_v_history`: Provides document status-change history listing.
- `m3_pa_getdata_history`: Retrieves header/detail status-change history for a single transaction document.

## IB - Saldo Awal Barang

Initial opening balance for inventory goods.

### Tables

- `m3_ib` | alias: `saldo_awal_goods` | type: Header | columns: 26
  Opening item-balance header per warehouse at the start of the period. Used to establish opening stock position before warehouse transactions begin.
- `m3_ib_detail` | alias: `saldo_awal_goods_detail` | type: Detail | columns: 25
  Opening item-balance detail rows. Each row stores opening quantity, unit, cost, and inventory account mapping.
- `m3_ib_detail_history` | alias: `saldo_awal_goods_detail` | type: History | columns: 25
  History/archive table detected from active M3 query sources.
- `m3_ib_history` | alias: `saldo_awal_goods` | type: History | columns: 26
  History/archive table detected from active M3 query sources.

### Important Header Columns

- `ibid`: Primary key for the row.
- `ibguandg`: Source/destination warehouse reference.
- `ibautonotransaksi`: Unique document/transaction number.
- `ibnotransaksi`: Unique document/transaction number.
- `ibtgl`: Transaction date or reference date.
- `ibkodepa`: Business column ibkodepa.
- `ibbagianibkontak`: Contact reference or contact person.
- `ibmorang`: Currency and exchange-rate information.
- `ibkurs`: Currency and exchange-rate information.
- `ibtglnoref`: Business column ibtglnoref.
- `ibstatus`: Process status or document status.
- `ibstatussebelumnya`: Process status or document status.

### Main Relationships

- `m3_ib_detail` -> `m3_ib`: `m3_ib_detail.idib = m3_ib.ibid`

### Functions

- `m3_ib_v`: Provides document listing or search.
- `m3_ib_getdata`: Retrieves header and detail data for a single transaction document.
- `m3_ib_v_history`: Provides document status-change history listing.
- `m3_ib_getdata_history`: Retrieves header/detail status-change history for a single transaction document.
- `m3_ib_terkait`: Retrieves document linkage with other inventory documents.

## RF - Pengisian Bahan Bakar

Transaksi fuel/refuel for unit or alat.

### Tables

- `m3_rf` | alias: `inventory_rf` | type: Header | columns: 28
  Inventory or warehouse transaction for rf.
- `m3_rf_detail` | alias: `inventory_rf_detail` | type: Detail | columns: 32
  Detail table for transaction item/row rf detail.
- `m3_rf_detail_history` | alias: `inventory_rf_detail` | type: History | columns: 32
  History/archive table detected from active M3 query sources.
- `m3_rf_history` | alias: `inventory_rf` | type: History | columns: 28
  History/archive table detected from active M3 query sources.

### Important Header Columns

- `rfid`: Business column rfid.
- `rfguandgasal`: Source/destination warehouse reference.
- `rfguandgtujuan`: Source/destination warehouse reference.
- `rfautonotransaksi`: Unique document/transaction number.
- `rfnotransaksi`: Unique document/transaction number.
- `rftgl`: Transaction date or reference date.
- `rfkodepa`: Business column rfkodepa.
- `rfdimintaolehkontak`: Contact reference or contact person.
- `rftgldipakai`: Business column rftgldipakai.
- `rftglnoref`: Business column rftglnoref.
- `rfstatusts`: Process status or document status.
- `rfstatusrs`: Process status or document status.

### Main Relationships

- `m3_rf_detail` -> `m3_rf`: `m3_rf_detail.idrf = m3_rf.rfid`

## DC - Daily Check / Time Sheet

Operasional checklist harian, jam kerja alat, and pemeriksaan unit.

### Tables

- `m3_dc` | alias: `inventory_dc` | type: Header | columns: 35
  Inventory or warehouse transaction for dc.
- `m3_dc_check` | alias: `inventory_dc_check` | type: Detail | columns: 7
  Inventory or warehouse transaction for dc check.
- `m3_dc_check_history` | alias: `inventory_dc_check` | type: History | columns: 7
  History/archive table detected from active M3 query sources.
- `m3_dc_detail` | alias: `inventory_dc_detail` | type: Detail | columns: 25
  Detail table for transaction item/row dc detail.
- `m3_dc_detail_history` | alias: `inventory_dc_detail` | type: History | columns: 25
  History/archive table detected from active M3 query sources.
- `m3_dc_history` | alias: `inventory_dc` | type: History | columns: 35
  History/archive table detected from active M3 query sources.

### Important Header Columns

- `dcid`: Business column dcid.
- `dcguandgasal`: Source/destination warehouse reference.
- `dcguandgtujuan`: Source/destination warehouse reference.
- `dcautonotransaksi`: Unique document/transaction number.
- `dcnotransaksi`: Unique document/transaction number.
- `dctgl`: Transaction date or reference date.
- `dckodepa`: Business column dckodepa.
- `dcdimintaolehkontak`: Contact reference or contact person.
- `dctgldipakai`: Business column dctgldipakai.
- `dcidbarang`: Goods reference or transaction goods name.
- `dctglnoref`: Business column dctglnoref.
- `dcstatusts`: Process status or document status.

### Main Relationships

- `m3_dc_detail` -> `m3_dc`: `m3_dc_detail.iddc = m3_dc.dcid`
- `m3_dc_check` -> `m3_dc`: `m3_dc_check.iddc = m3_dc.dcid`

## RW - Warehouse Transaction RW

Transaksi inventory internal that muncul di service layer namun minim jejak query aktif.

### Tables

- `m3_rw` | alias: `inventory_rw` | type: Header | columns: 29
  Inventory or warehouse transaction for rw.

### Important Header Columns

- `rwid`: Business column rwid.
- `rwautonotransaksi`: Unique document/transaction number.
- `rwnotransaksi`: Unique document/transaction number.
- `rwtgl`: Transaction date or reference date.
- `rwkodepa`: Business column rwkodepa.
- `rwbid`: Business column rwbid.
- `rwkid`: Business column rwkid.
- `rwtglbruto`: Business column rwtglbruto.
- `rwtgltara`: Business column rwtgltara.
- `rwtglnoref`: Business column rwtglnoref.
- `rwstatus`: Process status or document status.
- `rwstatussebelumnya`: Process status or document status.

## NOTES - Notes Transaksi Inventory

Notes teks for document inventory.

### Tables

- `m3_notes` | alias: `inventory_notes` | type: Auxiliary | columns: 0
  Auxiliary table detected from active M3 query sources.

### Functions

- `m3_notes_v`: Provides document listing or search.

## FILES - Attachments Transaksi Inventory

Attachments file for document inventory.

### Tables

- `m3_files` | alias: `inventory_files` | type: Auxiliary | columns: 0
  Auxiliary table detected from active M3 query sources.

### Functions

- `m3_files_v`: Provides document listing or search.
