# Semantic Schema M5 Summary

Schema source: `/opt/sentient-factory/apps/myerpplus-db-mapping/db/semantic-schema-m5.json`
Function/query source: `/opt/sentient-factory/m5-queries.md`, `/opt/sentient-factory/m0_report_rmoduleid_5.sql`, `/opt/sentient-factory/client-backend/api-myerpplus/app_code/ws/m0/m0_query.vb`

Total M5 tables in schema: **82**
Total M5 tables detected in active queries: **82**
Total function M5: **98**
Total polymorphic relationships: **3**
Total join hints: **8**

This document summarizes aliases, descriptions, table structure, main relationships, polymorphic relationships, join hints, and primary semantic functions for M5 Sales.
The schema JSON has been matched against active service queries and reports. Detected schema gaps, including sales-invoice commission views, have been added to the semantic schema.

## Join Hints

- `sales_document_flow`: Main sales-document flow from quotation to return.
  `m5_sq.sqid = m5_sq_detail.idsq`
  `m5_sq_detail.idsqdetail = m5_so_detail.idsqdetail`
  `m5_so.soid = m5_so_detail.idso`
  `m5_so_detail.idsodetail = m5_pl_detail.idsodetail`
  `m5_pl.plid = m5_pl_detail.idpl`
  `m5_so_detail.idsodetail = m5_do_detail.idsodetail`
- `sales_document_cross_refs`: Cross-document detail relationships used to trace document progress.
  `m5_pi_detail.idsqdetail = m5_sq_detail.idsqdetail`
  `m5_pi_detail.idsodetail = m5_so_detail.idsodetail`
  `m5_pi_detail.idpldetail = m5_pl_detail.idpldetail`
  `m5_pl_detail.idpidetail = m5_pi_detail.idpidetail`
  `m5_do_detail.idpidetail = m5_pi_detail.idpidetail`
  `m5_dr_detail.idpidetail = m5_pi_detail.idpidetail`
- `sales_receivable_collection`: Sales receivable collection and payment flow.
  `m5_ic.icid = m5_ic_detail.idic`
  `m5_pv.pvid = m5_pv_detail.idpv`
  `m5_pv_detail.idicdetail = m5_ic_detail.idicdetail`
- `sales_receivable_polymorphic_targets`: Target documents selected by collection/payment detail rows using the `sumber` discriminator.
  `m5_ic_detail.sumber = AS and m5_ic_detail.idtransaction = m5_as.asid`
  `m5_ic_detail.sumber = SI and m5_ic_detail.idtransaction = m5_si.siid`
  `m5_ic_detail.sumber = SR and m5_ic_detail.idtransaction = m5_sr.srid`
  `m5_pv_detail.sumber = SI and m5_pv_detail.idtransaction = m5_si.siid`
  `m5_pv_detail.sumber = SR and m5_pv_detail.idtransaction = m5_sr.srid`
- `sales_invoice_exchange`: Relationship between sales-invoice exchange and invoice or return source documents.
  `m5_sie.sieid = m5_sie_detail.idsie`
  `m5_sie_detail.sumber = m5_si.sisumber and m5_sie_detail.idtransaction = m5_si.siid`
  `m5_sie_detail.sumber = m5_sr.srsumber and m5_sie_detail.idtransaction = m5_sr.srid`
- `sales_advance_and_payment`: Relationship among sales advances, incoming payments, and related invoices.
  `m5_as.asid = m5_as_pay.idas`
  `m5_ip.ipid = m5_ip_pay.idip`
  `m5_as.asidip = m5_ip.ipid`
  `m5_si.siidas = m5_as.asid`
- `sales_shipping_receivable`: Relationship between shipping receivables, sales invoices, and payment detail.
  `m5_rp.rpid = m5_rp_pay.idrp`
  `m5_rp.rpidsi = m5_si.siid`
- `sales_point_adjustment`: Sales-point adjustment relationship by customer/contact.
  `m5_spa.spaid = m5_spa_detail.idspa`
  `m5_spa_detail.kontak = m1_contact.kid`

## Detail-Level Relation Keys

This section is important for the AI agent because M5 document tracing often has to start from lineage columns stored in detail tables.

- `m5_si_detail.idsodetail -> m5_so_detail.idsodetail -> m5_so.soid`
  Used when the agent needs to determine which sales order produced a sales invoice line.
- `m5_si_detail.iddodetail -> m5_do_detail.iddodetail -> m5_do.doid`
  Used when the agent needs to determine which delivery order produced a sales invoice line.
- `m5_si_detail.idpldetail -> m5_pl_detail.idpldetail -> m5_pl.plid`
  Used when a sales invoice line must be traced back to a packing list.
- `m5_si_detail.idpidetail -> m5_pi_detail.idpidetail -> m5_pi.piid`
  Used when a sales invoice line must be traced back to a proforma invoice.
- `m5_si_detail.iddrdetail -> m5_dr_detail.iddrdetail -> m5_dr.drid`
  Used when a sales invoice line must be traced back to a delivery result.
- `m5_do_detail.idsodetail -> m5_so_detail.idsodetail -> m5_so.soid`
  Used when a delivery-order line must be traced back to a sales order.
- `m5_dr_detail.iddodetail -> m5_do_detail.iddodetail -> m5_do.doid`
  Used when a delivery-result line must be traced back to a delivery order.
- `m5_rnr_detail.idsidetail -> m5_si_detail.idsidetail -> m5_si.siid`
  Used when a receipt-note-return line must be traced back to a sales invoice.
- `m5_sr_detail.idsidetail -> m5_si_detail.idsidetail -> m5_si.siid`
  Used when a sales-return line must be traced back to a sales invoice.
- `m5_sr_detail.idrnrdetail -> m5_rnr_detail.idrnrdetail -> m5_rnr.rnrid`
  Used when a sales-return line must be traced back to a receipt-note-return document.

Practical rules:

- if the user asks which upstream document produced the current document, start from detail tables
- move to the header only after the detail foreign key identifies the source document
- do not assume header-to-header joins when source queries show clearer detail-to-detail lineage

## Cross-Module Relation Keys

This section is important so the AI agent does not invent unstable cross-module joins.

- `m5_*customer -> m1_contact.kid`
  Used when sales documents need customer labels from master data.
- `m5_*_detail.idbarang -> m1_item.bid`
  Used when sales transaction lines need item labels from master data.
- `m_12_pos_voucher_out.voidtransaction -> m5_si.siid`
  Used when a POS voucher must be traced to a formal sales invoice.

Practical rules:

- for customer and item enrichment, the most stable cross-module relation is to `M1`
- for POS vouchers consumed by formal invoicing, use the `M12 -> M5` relation
- for journal, cash/bank, or ledger needs, identify the sales document in `M5` first and then move to `M2`
- for stock and warehouse-movement needs, identify the business document in `M5` first and then move to `M3`
- do not assume a single stable direct foreign key from `M5 -> M2` or `M5 -> M3` unless active source queries prove it

## Polymorphic Relationships

- `m5_ic_detail.idtransaction` via `sumber`: Polymorphic relationship to the billed document inside invoice collection.
  `AS -> m5_as.asid`
  `SI -> m5_si.siid`
  `SR -> m5_sr.srid`
- `m5_pv_detail.idtransaction` via `sumber`: Polymorphic relationship to the document paid through a payment voucher.
  `SI -> m5_si.siid`
  `SR -> m5_sr.srid`
- `m5_sie_detail.idtransaction` via `sumber`: Polymorphic relationship to source documents participating in sales-invoice exchange.
  `SI -> m5_si.siid`
  `SR -> m5_sr.srid`

## Module Overview

- **AS**: Advance Sales | tables: 4 | header: 1 | detail: 0 | history: 2 | relations: 4
- **CL**: Closing Sales | tables: 2 | header: 1 | detail: 0 | history: 1 | relations: 3
- **DO**: Delivery Order | tables: 4 | header: 1 | detail: 1 | history: 2 | relations: 6
- **DR**: Delivery Report | tables: 4 | header: 1 | detail: 1 | history: 2 | relations: 5
- **FILES**: Sales Attachments | tables: 1 | header: 0 | detail: 0 | history: 0 | relations: 0
- **IC**: Invoice Collection | tables: 4 | header: 1 | detail: 1 | history: 2 | relations: 2
- **IP**: Incoming Payment | tables: 4 | header: 1 | detail: 0 | history: 2 | relations: 2
- **NOTES**: Sales Notes | tables: 1 | header: 0 | detail: 0 | history: 0 | relations: 0
- **PI**: Proforma Invoice | tables: 4 | header: 1 | detail: 1 | history: 2 | relations: 5
- **PL**: Packing List | tables: 6 | header: 1 | detail: 1 | history: 3 | relations: 6
- **PV**: Payment Voucher | tables: 4 | header: 1 | detail: 1 | history: 2 | relations: 3
- **RNR**: Receipt Note Return | tables: 4 | header: 1 | detail: 1 | history: 2 | relations: 5
- **RP**: Shipping Receivable | tables: 4 | header: 1 | detail: 0 | history: 2 | relations: 3
- **SF**: Sales Forecast | tables: 2 | header: 1 | detail: 1 | history: 0 | relations: 2
- **SI**: Sales Invoice | tables: 13 | header: 1 | detail: 2 | history: 4 | relations: 13
- **SIE**: Sales Invoice Exchange | tables: 4 | header: 1 | detail: 1 | history: 2 | relations: 1
- **SO**: Sales Order | tables: 4 | header: 1 | detail: 1 | history: 2 | relations: 4
- **SPA**: Sales Point Adjustment | tables: 4 | header: 1 | detail: 1 | history: 2 | relations: 2
- **SQ**: Sales Quotation | tables: 5 | header: 1 | detail: 1 | history: 2 | relations: 5
- **SR**: Sales Return | tables: 4 | header: 1 | detail: 1 | history: 2 | relations: 5

## AS - Advance Sales / Uang Muka Penjualan

### Tables

- `m5_as` | alias: `uang_muka_sales` | type: Header | columns: 48
  Advance-sales (AS) header. Represents customer advance-sales transactions.
- `m5_as_history` | alias: `history_uang_muka_sales` | type: History | columns: 3
  Advance-sales (AS) header history table. Stores status-change snapshots whenever the transaction is archived to history.
- `m5_as_pay` | alias: `payment_uang_muka_sales` | type: Payment/Allocation | columns: 17
  Payment-method or payment-allocation detail for advance sales (AS).
- `m5_as_pay_history` | alias: `history_payment_uang_muka_sales` | type: History | columns: 2
  History snapshot for AS payment detail rows.

### Important Header Columns

- `asid`: Unique record identity or relation to a related document/transaction.
- `asautonotransaksi`: Unique document/transaction number.
- `asnotransaksi`: Unique document/transaction number.
- `astgl`: Transaction date or reference date.
- `askodepa`: PA reference code on the transaction according to internal business settings.
- `askontak`: Contact reference or contact person.
- `askontakperson`: Contact reference or contact person.
- `astgljatuhtempo`: Due date for payment or transaction settlement.
- `asidso`: Reference to the related sales-order document.
- `asidip`: Reference to the related incoming-payment document.
- `astglnoref`: External reference document date.
- `asmorang`: Currency and exchange-rate information.

### Functions

- `m5_as_cd`: Provides compact lookup/detail data for picker or dropdown use cases.
- `m5_as_getdata`: Retrieves header and detail data for a single transaction document.
- `m5_as_v`: Provides document listing or search.
- `m5_as_getdata_history`: Retrieves header/detail status-change history for a single transaction document.
- `m5_as_v_history`: Provides document status-change history listing.
- `m5_as_terkait`: Retrieves linkage with other documents in the sales flow.

## CL - Closing Sales

### Tables

- `m5_cl` | alias: `penutupan_sales` | type: Header | columns: 93
  Closing-sales header by item/customer. Used to monitor downstream status from sales order into PI, PL, DO, DR, SI, RNR, and SR at realized transaction level.
- `m5_cl_history` | alias: `history_penutupan_sales` | type: History | columns: 4
  Closing-sales header history table. Stores status-change snapshots for audit and realization tracking.

### Important Header Columns

- `clid`: Unique record identity or relation to a related document/transaction.
- `clguandg`: Source/destination warehouse reference.
- `clcarabayar`: Payment method used in the transaction.
- `clautonotransaksi`: Unique document/transaction number.
- `clnotransaksi`: Unique document/transaction number.
- `cltgl`: Transaction date or reference date.
- `clkodepa`: PA reference code on the transaction according to internal business settings.
- `clcustomer`: Customer reference.
- `clcustomerkontak`: Customer reference.
- `cltglkirim`: Shipment date or planned delivery date.
- `cltgljatuhtempo`: Due date for payment or transaction settlement.
- `cltglnoref`: External reference document date.

## DO - Delivery Order

### Tables

- `m5_do` | alias: `delivery_order` | type: Header | columns: 67
  Delivery-order (DO) header for goods shipments to customers.
- `m5_do_detail` | alias: `detail_delivery_order` | type: Detail | columns: 51
  Item detail on delivery order (DO). Stores shipped items, SO/PL/PI references, and downstream realization progress.
- `m5_do_detail_history` | alias: `history_detail_delivery_order` | type: History | columns: 2
  History snapshot for DO detail rows.
- `m5_do_history` | alias: `history_delivery_order` | type: History | columns: 3
  Delivery-order (DO) header history table. Stores status-change snapshots for shipping documents.

### Important Header Columns

- `doid`: Primary key for the row.
- `doguandg`: Source/destination warehouse reference.
- `docarabayar`: Payment method used in the transaction.
- `doautonotransaksi`: Unique document/transaction number.
- `donotransaksi`: Unique document/transaction number.
- `dotgl`: Transaction date or reference date.
- `dokodepa`: PA reference code on the transaction according to internal business settings.
- `docustomer`: Customer reference.
- `docustomerkontak`: Customer reference.
- `dotglkirim`: Shipment date or planned delivery date.
- `dotgljatuhtempo`: Due date for payment or transaction settlement.
- `dotglnoref`: External reference document date.

### Functions

- `m5_do_getdata`: Retrieves header and detail data for a single transaction document.
- `m5_do_cd`: Provides compact lookup/detail data for picker or dropdown use cases.
- `m5_do_detail_cd`: Provides compact lookup/detail data for picker or dropdown use cases.
- `m5_do_v`: Provides document listing or search.
- `m5_do_detail_v`: Provides document listing or search.
- `m5_do_getdata_history`: Retrieves header/detail status-change history for a single transaction document.
- `m5_do_v_history`: Provides document status-change history listing.
- `m5_do_terkait`: Retrieves linkage with other documents in the sales flow.

## DR - Delivery Report / Hasil Pengiriman

### Tables

- `m5_dr` | alias: `laporan_hasil_delivery` | type: Header | columns: 68
  Delivery-result (DR) header. Records final delivery outcome, including delivered quantity, returned quantity, and downstream realization progress into invoices or returns.
- `m5_dr_detail` | alias: `detail_hasil_delivery` | type: Detail | columns: 53
  Delivery-result detail rows. Store items, delivered/returned quantities, and downstream progress into SI, RNR, SR, or other realization documents.
- `m5_dr_detail_history` | alias: `history_detail_hasil_delivery` | type: History | columns: 2
  History snapshot for DR detail rows.
- `m5_dr_history` | alias: `history_hasil_delivery` | type: History | columns: 2
  Delivery-report header history table. Stores status-change snapshots for delivery-result records and distribution audit.

### Important Header Columns

- `drid`: Unique record identity or relation to a related document/transaction.
- `drguandg`: Source/destination warehouse reference.
- `drcarabayar`: Payment method used in the transaction.
- `drautonotransaksi`: Unique document/transaction number.
- `drnotransaksi`: Unique document/transaction number.
- `drtgl`: Transaction date or reference date.
- `drkodepa`: PA reference code on the transaction according to internal business settings.
- `drcustomer`: Customer reference.
- `drcustomerkontak`: Customer reference.
- `drtglkirim`: Shipment date or planned delivery date.
- `drtgljatuhtempo`: Due date for payment or transaction settlement.
- `drtglnoref`: External reference document date.

### Functions

- `m5_dr_getdata`: Retrieves header and detail data for a single transaction document.
- `m5_dr_cd`: Provides compact lookup/detail data for picker or dropdown use cases.
- `m5_dr_detail_cd`: Provides compact lookup/detail data for picker or dropdown use cases.
- `m5_dr_v`: Provides document listing or search.
- `m5_dr_detail_v`: Provides document listing or search.
- `m5_dr_getdata_history`: Retrieves header/detail status-change history for a single transaction document.
- `m5_dr_v_history`: Provides document status-change history listing.
- `m5_dr_terkait`: Retrieves linkage with other documents in the sales flow.

## FILES - Attachments Transaksi

### Tables

- `m5_files` | alias: `attachments_transaction_sales` | type: Auxiliary | columns: 8
  Attachments file per transaction M5, seperti document pendukung or attachment report/transaction.

### Functions

- `m5_files_v`: Provides document listing or search.

## IC - Invoice Collection / Penagihan Piutang

### Tables

- `m5_ic` | alias: `penagihan_receivable_sales` | type: Header | columns: 50
  Invoice-collection (IC) header. Used to manage customer collection workflows for transactions that will be billed and later allocated to payment vouchers.
- `m5_ic_detail` | alias: `detail_penagihan_receivable_sales` | type: Detail | columns: 27
  Invoice-collection detail rows. Store billed source transactions, collection plans, paid values, payment amounts, and remaining balances that can be allocated to payment vouchers.
- `m5_ic_detail_history` | alias: `history_detail_penagihan_receivable_sales` | type: History | columns: 2
  History snapshot for IC detail rows.
- `m5_ic_history` | alias: `history_penagihan_receivable_sales` | type: History | columns: 2
  Invoice-collection header history table. Stores status-change snapshots for receivable/customer collection documents.

### Important Header Columns

- `icid`: Unique record identity or relation to a related document/transaction.
- `icguandg`: Source/destination warehouse reference.
- `icautonotransaksi`: Unique document/transaction number.
- `icnotransaksi`: Unique document/transaction number.
- `ictgl`: Transaction date or reference date.
- `ickodepa`: PA reference code on the transaction according to internal business settings.
- `iccustomer`: Customer reference.
- `iccustomerkontak`: Customer reference.
- `ictglnoref`: External reference document date.
- `iccarabayar`: Payment method used in the transaction.
- `ictglbayar`: Transaction amount.
- `icmorang`: Currency and exchange-rate information.

### Functions

- `m5_ic_v`: Provides document listing or search.
- `m5_ic_cd`: Provides compact lookup/detail data for picker or dropdown use cases.
- `m5_ic_getdata`: Retrieves header and detail data for a single transaction document.
- `m5_ic_v_history`: Provides document status-change history listing.
- `m5_ic_getdata_history`: Retrieves header/detail status-change history for a single transaction document.
- `m5_ic_takedatax`: Retrieves candidate document/source data for downstream processing.
- `m5_ic_takedata`: Retrieves candidate document/source data for downstream processing.
- `m5_ic_terkait`: Retrieves linkage with other documents in the sales flow.

## IP - Incoming Payment

### Tables

- `m5_ip` | alias: `receipt_payment_sales` | type: Header | columns: 47
  Incoming-payment (IP) header. Used to receive customer payments against receivables or related transactions.
- `m5_ip_history` | alias: `history_receipt_payment_sales` | type: History | columns: 2
  Incoming-payment (IP) header history table. Stores status-change snapshots for customer payment-receipt documents.
- `m5_ip_pay` | alias: `alokasi_receipt_payment_sales` | type: Payment/Allocation | columns: 16
  Payment-method detail for incoming payment (IP), such as giro, bank, and payment amount.
- `m5_ip_pay_history` | alias: `history_alokasi_receipt_payment_sales` | type: History | columns: 2
  History snapshot for IP payment detail rows.

### Important Header Columns

- `ipid`: Unique record identity or relation to a related document/transaction.
- `ipautonotransaksi`: Unique document/transaction number.
- `ipnotransaksi`: Unique document/transaction number.
- `iptgl`: Transaction date or reference date.
- `ipkodepa`: PA reference code on the transaction according to internal business settings.
- `ipkontak`: Contact reference or contact person.
- `ipkontakperson`: Contact reference or contact person.
- `iptgljatuhtempo`: Due date for payment or transaction settlement.
- `ipidso`: Reference to the related sales-order document.
- `iptglnoref`: External reference document date.
- `ipmorang`: Currency and exchange-rate information.
- `ipkurs`: Currency and exchange-rate information.

### Functions

- `m5_ip_cd`: Provides compact lookup/detail data for picker or dropdown use cases.
- `m5_ip_getdata`: Retrieves header and detail data for a single transaction document.
- `m5_ip_v`: Provides document listing or search.
- `m5_ip_getdata_history`: Retrieves header/detail status-change history for a single transaction document.
- `m5_ip_v_history`: Provides document status-change history listing.
- `m5_ip_terkait`: Retrieves linkage with other documents in the sales flow.

## NOTES - Notes Transaksi

### Tables

- `m5_notes` | alias: `notes_transaction_sales` | type: Auxiliary | columns: 8
  Notes transaction M5 that melekat on document sales or receivable specific.

### Functions

- `m5_notes_v`: Provides document listing or search.

## PI - Proforma Invoice

### Tables

- `m5_pi` | alias: `invoice_proforma_sales` | type: Header | columns: 68
  Proforma-invoice (PI) header before it becomes a final sales invoice.
- `m5_pi_detail` | alias: `detail_invoice_proforma_sales` | type: Detail | columns: 45
  Proforma-invoice detail rows, including linkage to SO/PL and realization progress into final invoices.
- `m5_pi_detail_history` | alias: `history_detail_invoice_proforma_sales` | type: History | columns: 2
  History snapshot for PI detail rows.
- `m5_pi_history` | alias: `history_invoice_proforma_sales` | type: History | columns: 2
  Proforma-invoice header history table. Stores status-change snapshots for sales proforma invoices.

### Important Header Columns

- `piid`: Unique record identity or relation to a related document/transaction.
- `piguandg`: Source/destination warehouse reference.
- `picarabayar`: Payment method used in the transaction.
- `piautonotransaksi`: Unique document/transaction number.
- `pinotransaksi`: Unique document/transaction number.
- `pitgl`: Transaction date or reference date.
- `pikodepa`: PA reference code on the transaction according to internal business settings.
- `picustomer`: Customer reference.
- `picustomerkontak`: Customer reference.
- `pitglkirim`: Shipment date or planned delivery date.
- `pitgljatuhtempo`: Due date for payment or transaction settlement.
- `pitglnoref`: External reference document date.

### Functions

- `m5_pi_getdata`: Retrieves header and detail data for a single transaction document.
- `m5_pi_cd`: Provides compact lookup/detail data for picker or dropdown use cases.
- `m5_pi_detail_cd`: Provides compact lookup/detail data for picker or dropdown use cases.
- `m5_pi_v`: Provides document listing or search.
- `m5_pi_detail_v`: Provides document listing or search.
- `m5_pi_getdata_history`: Retrieves header/detail status-change history for a single transaction document.
- `m5_pi_v_history`: Provides document status-change history listing.
- `m5_pi_terkait`: Retrieves linkage with other documents in the sales flow.

## PL - Packing List

### Tables

- `m5_pl` | alias: `daftar_packing_sales` | type: Header | columns: 66
  Packing-list (PL) header. Represents goods preparation before the delivery process.
- `m5_pl_detail` | alias: `detail_daftar_packing_sales` | type: Detail | columns: 45
  Packing-list detail rows, including linkage to sales orders and delivery realization progress.
- `m5_pl_detail_history` | alias: `history_detail_daftar_packing_sales` | type: History | columns: 2
  History snapshot for PL detail rows.
- `m5_pl_history` | alias: `history_daftar_packing_sales` | type: History | columns: 2
  Packing-list header history table. Stores status-change snapshots for goods-preparation documents before delivery.
- `m5_pl_pack` | alias: `paket_daftar_packing_sales` | type: Supporting | columns: 1
  Pack-level detail related to the PL document.
- `m5_pl_pack_history` | alias: `history_paket_daftar_packing_sales` | type: History | columns: 2
  History snapshot for PL pack data.

### Important Header Columns

- `plid`: Unique record identity or relation to a related document/transaction.
- `plguandg`: Source/destination warehouse reference.
- `plcarabayar`: Payment method used in the transaction.
- `plautonotransaksi`: Unique document/transaction number.
- `plnotransaksi`: Unique document/transaction number.
- `pltgl`: Transaction date or reference date.
- `plkodepa`: PA reference code on the transaction according to internal business settings.
- `plcustomer`: Customer reference.
- `plcustomerkontak`: Customer reference.
- `pltglkirim`: Shipment date or planned delivery date.
- `pltgljatuhtempo`: Due date for payment or transaction settlement.
- `pltglnoref`: External reference document date.

### Functions

- `m5_pl_getdata`: Retrieves header and detail data for a single transaction document.
- `m5_pl_v`: Provides document listing or search.
- `m5_pl_getdata_history`: Retrieves header/detail status-change history for a single transaction document.
- `m5_pl_v_history`: Provides document status-change history listing.
- `m5_pl_detail_cd`: Provides compact lookup/detail data for picker or dropdown use cases.
- `m5_pl_detail_v`: Provides document listing or search.
- `m5_pl_terkait`: Retrieves linkage with other documents in the sales flow.

## PV - Payment Voucher

### Tables

- `m5_pv` | alias: `voucher_payment_sales` | type: Header | columns: 48
  Payment-voucher (PV) header. Records settlement or receipt against customer receivables.
- `m5_pv_detail` | alias: `detail_voucher_payment_sales` | type: Detail | columns: 25
  Payment-voucher detail rows, including paid transactions and settlement amounts.
- `m5_pv_detail_history` | alias: `history_detail_voucher_payment_sales` | type: History | columns: 2
  History snapshot for PV detail rows.
- `m5_pv_history` | alias: `history_voucher_payment_sales` | type: History | columns: 2
  Payment-voucher header history table. Stores status-change snapshots for receivable settlement or receipt documents.

### Important Header Columns

- `pvid`: Unique record identity or relation to a related document/transaction.
- `pvguandg`: Source/destination warehouse reference.
- `pvautonotransaksi`: Unique document/transaction number.
- `pvnotransaksi`: Unique document/transaction number.
- `pvtgl`: Transaction date or reference date.
- `pvkodepa`: PA reference code on the transaction according to internal business settings.
- `pvcustomer`: Customer reference.
- `pvcustomerkontak`: Customer reference.
- `pvtglnoref`: External reference document date.
- `pvcarabayar`: Payment method used in the transaction.
- `pvtglbayar`: Transaction amount.
- `pvmorang`: Currency and exchange-rate information.

### Functions

- `m5_pv_v`: Provides document listing or search.
- `m5_pv_getdata`: Retrieves header and detail data for a single transaction document.
- `m5_pv_v_history`: Provides document status-change history listing.
- `m5_pv_getdata_history`: Retrieves header/detail status-change history for a single transaction document.
- `m5_pv_terkait`: Retrieves linkage with other documents in the sales flow.

## RNR - Receipt Note Return / Penerimaan Barang Retur

### Tables

- `m5_rnr` | alias: `receipt_goods_return` | type: Header | columns: 74
  Returned-goods-receipt (RNR) header from the customer. Used to record returns received before they are processed further into sales return documents or downstream realization.
- `m5_rnr_detail` | alias: `detail_receipt_goods_return` | type: Detail | columns: 50
  Returned-goods-receipt detail rows. Store returned goods, quantities, values, and downstream progress into sales-return documents.
- `m5_rnr_detail_history` | alias: `history_detail_receipt_goods_return` | type: History | columns: 2
  History snapshot for RNR detail rows.
- `m5_rnr_history` | alias: `history_receipt_goods_return` | type: History | columns: 2
  Returned-goods-receipt header history table. Stores status-change snapshots for RNR documents and customer-return audit.

### Important Header Columns

- `rnrid`: Unique record identity or relation to a related document/transaction.
- `rnrguandg`: Source/destination warehouse reference.
- `rnrcarabayar`: Payment method used in the transaction.
- `rnrautonotransaksi`: Unique document/transaction number.
- `rnrnotransaksi`: Unique document/transaction number.
- `rnrtgl`: Transaction date or reference date.
- `rnrkodepa`: PA reference code on the transaction according to internal business settings.
- `rnrcustomer`: Customer reference.
- `rnrcustomerkontak`: Customer reference.
- `rnrtglkirim`: Shipment date or planned delivery date.
- `rnrtgljatuhtempo`: Due date for payment or transaction settlement.
- `rnrtglnoref`: External reference document date.

### Functions

- `m5_rnr_getdata`: Retrieves header and detail data for a single transaction document.
- `m5_rnr_cd`: Provides compact lookup/detail data for picker or dropdown use cases.
- `m5_rnr_detail_cd`: Provides compact lookup/detail data for picker or dropdown use cases.
- `m5_rnr_v`: Provides document listing or search.
- `m5_rnr_detail_v`: Provides document listing or search.
- `m5_rnr_terkait`: Retrieves linkage with other documents in the sales flow.

## RP - Piutang Ongkos Kirim / Tagihan Tambahan

### Tables

- `m5_rp` | alias: `receivable_ongkos_kirim` | type: Header | columns: 47
  Shipping-receivable (RP) header for additional invoicing related to sales invoices or deliveries. Stores receivable amount, payment status, and source-invoice references.
- `m5_rp_history` | alias: `history_receivable_ongkos_kirim` | type: History | columns: 2
  RP header history table. Stores status-change snapshots for shipping receivables or additional invoice records related to invoices/deliveries.
- `m5_rp_pay` | alias: `payment_receivable_ongkos_kirim` | type: Payment/Allocation | columns: 16
  Payment-method or allocation detail for shipping receivables/additional invoices in RP.
- `m5_rp_pay_history` | alias: `history_payment_receivable_ongkos_kirim` | type: History | columns: 2
  History snapshot for RP payment detail rows.

### Important Header Columns

- `rpid`: Unique record identity or relation to a related document/transaction.
- `rpautonotransaksi`: Unique document/transaction number.
- `rpnotransaksi`: Unique document/transaction number.
- `rptgl`: Transaction date or reference date.
- `rpkodepa`: PA reference code on the transaction according to internal business settings.
- `rpkontak`: Contact reference or contact person.
- `rpkontakperson`: Contact reference or contact person.
- `rptgljatuhtempo`: Due date for payment or transaction settlement.
- `rpidsi`: Reference to the related sales-invoice document.
- `rptglnoref`: External reference document date.
- `rpmorang`: Currency and exchange-rate information.
- `rpkurs`: Currency and exchange-rate information.

### Functions

- `m5_rp_getdata`: Retrieves header and detail data for a single transaction document.
- `m5_rp_v`: Provides document listing or search.
- `m5_rp_getdata_history`: Retrieves header/detail status-change history for a single transaction document.
- `m5_rp_v_history`: Provides document status-change history listing.
- `m5_rp_terkait`: Retrieves linkage with other documents in the sales flow.

## SF - Sales Forecast

### Tables

- `m5_sf` | alias: `forecast_sales` | type: Header | columns: 8
  Sales-contract or sales-booking header used in contract, booking, and back-sales-order reporting.
- `m5_sf_detail` | alias: `detail_forecast_sales` | type: Detail | columns: 8
  Item detail rows for sales contracts or sales bookings.

### Important Header Columns

- `sfid`: Unique primary key for the sales-contract document.
- `sfnotransaksi`: Sales-contract document number.
- `sftgl`: Sales-contract date.
- `sfcustomer`: Customer reference on the sales contract.
- `sfmorang`: Sales-contract transaction currency.
- `sfstatus`: Sales-contract document status.
- `sfbagiansales`: Referensi salesman or bagian sales.
- `sfuraian`: Notes or description for the sales contract.

## SI - Sales Invoice

### Tables

- `m5_si` | alias: `invoice_sales` | type: Header | columns: 95
  Final sales-invoice (SI) header. Represents the main sales and customer-receivable document.
- `m5_si_cost` | alias: `biaya_invoice_sales` | type: Supporting | columns: 6
  Additional cost components on the sales invoice (SI), used in salesman-cost and commission reporting.
- `m5_si_detail` | alias: `detail_invoice_sales` | type: Detail | columns: 53
  Sales-invoice detail rows, including sales value, tax, cost of goods sold, and analytical dimensions such as cost center/division/project.
- `m5_si_detail_failed` | alias: `detail_invoice_sales_gagal` | type: Supporting | columns: 1
  Failed-save or failed-process records for SI detail rows.
- `m5_si_detail_history` | alias: `history_detail_invoice_sales` | type: History | columns: 2
  History snapshot for SI detail rows.
- `m5_si_detail_komisi_v` | alias: `inferred_from_query` | type: Detail | columns: 53
  Commission view/detail derived from active M5 query sources.
- `m5_si_failed` | alias: `invoice_sales_gagal` | type: Supporting | columns: 2
  Failed-save or failed-process records related to SI documents.
- `m5_si_history` | alias: `history_invoice_sales` | type: History | columns: 2
  Sales-invoice header history table. Stores status-change snapshots for final sales invoices.
- `m5_si_installment` | alias: `angsuran_invoice_sales` | type: Supporting | columns: 16
  Installment table related to sales invoices (SI). Used to split staged payment schedules or components.
- `m5_si_material` | alias: `material_invoice_sales` | type: Supporting | columns: 16
  Material/component detail used in the SI document.
- `m5_si_material_history` | alias: `history_material_invoice_sales` | type: History | columns: 2
  History snapshot for SI material detail rows.
- `m5_si_pay` | alias: `payment_invoice_sales` | type: Payment/Allocation | columns: 16
  Payment-method detail related to sales invoices (SI). Stores payment amount, payment method, and payment references per invoice.
- `m5_si_pay_history` | alias: `history_payment_invoice_sales` | type: History | columns: 2
  History snapshot for SI payment detail rows.

### Important Header Columns

- `siid`: Primary key for the row.
- `siguandg`: Source/destination warehouse reference.
- `sicarabayar`: Payment method used in the transaction.
- `siautonotransaksi`: Unique document/transaction number.
- `sinotransaksi`: Unique document/transaction number.
- `sitgl`: Transaction date or reference date.
- `sikodepa`: PA reference code on the transaction according to internal business settings.
- `sicustomer`: Customer reference.
- `sicustomerkontak`: Customer reference.
- `sitglkirim`: Shipment date or planned delivery date.
- `sitgljatuhtempo`: Due date for payment or transaction settlement.
- `sitglnoref`: External reference document date.

### Functions

- `m5_si_getdata`: Retrieves header and detail data for a single transaction document.
- `m5_si_cd`: Provides compact lookup/detail data for picker or dropdown use cases.
- `m5_si_detail_cd`: Provides compact lookup/detail data for picker or dropdown use cases.
- `m5_si_v`: Provides document listing or search.
- `m5_si_detail_v`: Provides document listing or search.
- `m5_si_getdata_history`: Retrieves header/detail status-change history for a single transaction document.
- `m5_si_v_history`: Provides document status-change history listing.
- `m5_si_terkait`: Retrieves linkage with other documents in the sales flow.

## SIE - Sales Invoice Exchange / Tukar Faktur

### Tables

- `m5_sie` | alias: `tukar_faktur_sales` | type: Header | columns: 29
  Sales-invoice-exchange (SIE) header. Used for exchange, regrouping, or relinking of invoices/sales returns in invoice administration.
- `m5_sie_detail` | alias: `detail_tukar_faktur_sales` | type: Detail | columns: 7
  Source-transaction detail for sales-invoice exchange. Stores the list of source documents participating in invoice exchange or regrouping.
- `m5_sie_detail_history` | alias: `history_detail_tukar_faktur_sales` | type: History | columns: 2
  History snapshot for SIE detail rows.
- `m5_sie_history` | alias: `history_tukar_faktur_sales` | type: History | columns: 2
  Sales-invoice-exchange header history table. Stores status-change snapshots for SIE administrative audit.

### Important Header Columns

- `sieid`: Unique record identity or relation to a related document/transaction.
- `sieautonotransaksi`: Unique document/transaction number.
- `sienotransaksi`: Unique document/transaction number.
- `sietgl`: Transaction date or reference date.
- `siekodepa`: PA reference code on the transaction according to internal business settings.
- `siekontak`: Contact reference or contact person.
- `siekontakperson`: Contact reference or contact person.
- `sietglnoref`: External reference document date.
- `siestatus`: Process status or document status.
- `siestatussebelumnya`: Process status or document status.
- `siepostingtgl`: Transaction date or reference date.
- `siemodifikasitgl`: Last document modification date and time.

## SO - Sales Order

### Tables

- `m5_so` | alias: `order_sales` | type: Header | columns: 68
  Sales-order (SO) header. Represents the customer order commitment after quotation approval.
- `m5_so_detail` | alias: `detail_order_sales` | type: Detail | columns: 48
  Sales-order detail rows. Store ordered items, quantities, prices, and realization into PL/DO/PI/SI.
- `m5_so_detail_history` | alias: `history_detail_order_sales` | type: History | columns: 2
  History snapshot for SO detail rows.
- `m5_so_history` | alias: `history_order_sales` | type: History | columns: 2
  Sales-order header history table. Stores status-change snapshots for customer sales orders.

### Important Header Columns

- `soid`: Primary key for the row.
- `soguandg`: Source/destination warehouse reference.
- `socarabayar`: Payment method used in the transaction.
- `soautonotransaksi`: Unique document/transaction number.
- `sonotransaksi`: Unique document/transaction number.
- `sotgl`: Transaction date or reference date.
- `sokodepa`: PA reference code on the transaction according to internal business settings.
- `socustomer`: Customer reference.
- `socustomerkontak`: Customer reference.
- `sotglkirim`: Shipment date or planned delivery date.
- `sotgljatuhtempo`: Due date for payment or transaction settlement.
- `sotglnoref`: External reference document date.

### Functions

- `m5_so_getdata`: Retrieves header and detail data for a single transaction document.
- `m5_so_cd`: Provides compact lookup/detail data for picker or dropdown use cases.
- `m5_so_detail_cd`: Provides compact lookup/detail data for picker or dropdown use cases.
- `m5_so_v`: Provides document listing or search.
- `m5_so_getdata_history`: Retrieves header/detail status-change history for a single transaction document.
- `m5_so_v_history`: Provides document status-change history listing.
- `m5_so_detail_v`: Provides document listing or search.
- `m5_so_terkait`: Retrieves linkage with other documents in the sales flow.

## SPA - Sales Point Adjustment

### Tables

- `m5_spa` | alias: `penyesuaian_poin_sales` | type: Header | columns: 21
  Sales-point-adjustment (SPA) header. Used for correction, increase, or reduction of customer points outside the main sales transaction flow.
- `m5_spa_detail` | alias: `detail_penyesuaian_poin_sales` | type: Detail | columns: 10
  Point-adjustment detail per contact/customer. Stores previous points, incoming points, outgoing points, and the new point balance after adjustment.
- `m5_spa_detail_history` | alias: `history_detail_penyesuaian_poin_sales` | type: History | columns: 3
  History snapshot for SPA detail rows.
- `m5_spa_history` | alias: `history_penyesuaian_poin_sales` | type: History | columns: 3
  Sales-point-adjustment header history table. Stores status-change snapshots for customer point-adjustment documents.

### Important Header Columns

- `spaid`: Unique record identity or relation to a related document/transaction.
- `spaautonotransaksi`: Unique document/transaction number.
- `spanotransaksi`: Unique document/transaction number.
- `spatgl`: Transaction date or reference date.
- `spakodepa`: PA reference code on the transaction according to internal business settings.
- `spakontak`: Contact reference or contact person.
- `spakontakperson`: Contact reference or contact person.
- `spastatus`: Process status or document status.
- `spastatussebelumnya`: Process status or document status.
- `spapostingtgl`: Transaction date or reference date.
- `spamodifikasitgl`: Last document modification date and time.

## SQ - Sales Quotation

### Tables

- `m5_sq` | alias: `quotation_sales` | type: Header | columns: 63
  Sales-quotation (SQ) header. Stores customer quotation documents before they become sales orders or downstream realization documents.
- `m5_sq_detail` | alias: `detail_quotation_sales` | type: Detail | columns: 50
  Sales-quotation detail rows. Store items, quantities, prices, and realization progress into downstream documents.
- `m5_sq_detail_history` | alias: `history_detail_quotation_sales` | type: History | columns: 2
  History snapshot for SQ detail rows.
- `m5_sq_history` | alias: `history_quotation_sales` | type: History | columns: 2
  Sales-quotation header history table. Stores status-change snapshots for sales quotation documents.
- `m5_sq_out_bahan` | alias: `material_keluar_quotation_sales` | type: Supporting | columns: 19
  Output material/component detail on the SQ document.

### Important Header Columns

- `sqid`: Unique record identity or relation to a related document/transaction.
- `sqguandg`: Source/destination warehouse reference.
- `sqcarabayar`: Payment method used in the transaction.
- `sqautonotransaksi`: Unique document/transaction number.
- `sqnotransaksi`: Unique document/transaction number.
- `sqtgl`: Transaction date or reference date.
- `sqkodepa`: PA reference code on the transaction according to internal business settings.
- `sqcustomer`: Customer reference.
- `sqcustomerkontak`: Customer reference.
- `sqtglkirim`: Shipment date or planned delivery date.
- `sqtgljatuhtempo`: Due date for payment or transaction settlement.
- `sqtglnoref`: External reference document date.

### Functions

- `m5_sq_cd`: Provides compact lookup/detail data for picker or dropdown use cases.
- `m5_sq_v`: Provides document listing or search.
- `m5_sq_getdata`: Retrieves header and detail data for a single transaction document.
- `m5_sq_v_history`: Provides document status-change history listing.
- `m5_sq_getdata_history`: Retrieves header/detail status-change history for a single transaction document.
- `m5_sq_terkait`: Retrieves linkage with other documents in the sales flow.
- `m5_sq_detail_v`: Provides document listing or search.
- `m5_sq_detail_cd`: Provides compact lookup/detail data for picker or dropdown use cases.

## SR - Sales Return

### Tables

- `m5_sr` | alias: `return_sales` | type: Header | columns: 79
  Sales-return (SR) header. Records customer returns against sales transactions.
- `m5_sr_detail` | alias: `detail_return_sales` | type: Detail | columns: 47
  Sales-return detail rows, including price, discount, cost of goods sold, and references to related invoices/returns.
- `m5_sr_detail_history` | alias: `history_detail_return_sales` | type: History | columns: 2
  History snapshot for SR detail rows.
- `m5_sr_history` | alias: `history_return_sales` | type: History | columns: 2
  Sales-return header history table. Stores status-change snapshots for customer sales-return documents.

### Important Header Columns

- `srid`: Unique record identity or relation to a related document/transaction.
- `srguandg`: Source/destination warehouse reference.
- `srcarabayar`: Payment method used in the transaction.
- `srautonotransaksi`: Unique document/transaction number.
- `srnotransaksi`: Unique document/transaction number.
- `srtgl`: Transaction date or reference date.
- `srkodepa`: PA reference code on the transaction according to internal business settings.
- `srcustomer`: Customer reference.
- `srcustomerkontak`: Customer reference.
- `srtglkirim`: Shipment date or planned delivery date.
- `srtgljatuhtempo`: Due date for payment or transaction settlement.
- `srtglnoref`: External reference document date.

### Functions

- `m5_sr_getdata`: Retrieves header and detail data for a single transaction document.
- `m5_sr_v`: Provides document listing or search.
- `m5_sr_getdata_history`: Retrieves header/detail status-change history for a single transaction document.
- `m5_sr_v_history`: Provides document status-change history listing.
- `m5_sr_terkait`: Retrieves linkage with other documents in the sales flow.
