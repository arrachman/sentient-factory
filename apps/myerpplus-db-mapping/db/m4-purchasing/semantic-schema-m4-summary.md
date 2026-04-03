# Semantic Schema M4 Summary

Schema source: `/home/rania/apps/sentient-factory/apps/myerpplus-db-mapping/db/semantic-schema-m4.json`
Function/query source: `/home/rania/apps/sentient-factory/m4-queries.md`, `/home/rania/apps/sentient-factory/m0_report_rmoduleid_4.sql`, `/home/rania/apps/sentient-factory/client-backend/api-myerpplus/app_code/ws/m0/m0_query.vb`

Total M4 tables in schema: **77**
Total M4 tables detected in active queries: **77**
Total function M4: **82**
Total polymorphic relationships: **3**
Total join hints: **7**

This document summarizes aliases, descriptions, table structure, main relationships, polymorphic relationships, join hints, and primary semantic functions for M4 Purchasing.
The schema JSON has been synchronized with active service queries and reports, so history, cost, transaction, and auxiliary tables detected in source queries are now included in the schema.

## Join Hints

- `purchase_request_to_order_flow`: Purchasing flow from purchase request to purchase order creation.
  `m4_pr.prid = m4_pr_detail.idpr`
  `m4_pr_detail.idprdetail = m4_rq_detail.idprdetail`
  `m4_rq.rqid = m4_rq_detail.idrq`
  `m4_rq_detail.idrqdetail = m4_bs_detail.idrqdetail`
  `m4_bs.bsid = m4_bs_detail.idbs`
  `m4_po.poid = m4_po_detail.idpo`
- `purchase_order_receipt_invoice_flow`: Purchasing flow from PO to goods receipt to purchase invoice.
  `m4_po.poid = m4_po_detail.idpo`
  `m4_po_detail.idpodetail = m4_grn_detail.idpodetail`
  `m4_grn.grnid = m4_grn_detail.idgrn`
  `m4_grn_detail.idgrndetail = m4_ri_detail.idgrndetail`
  `m4_ri.riid = m4_ri_detail.idri`
- `purchase_return_flow`: Purchasing return flow from invoice or receipt into debit-note and return documents.
  `m4_ri.riid = m4_ri_detail.idri`
  `m4_ri_detail.idridetail = m4_dnr_detail.idridetail`
  `m4_dnr.dnrid = m4_dnr_detail.iddnr`
  `m4_dnr_detail.iddnrdetail = m4_prt_detail.iddnrdetail`
  `m4_prt.prtid = m4_prt_detail.idprt`
- `purchase_advance_payment_flow`: Relationship between purchase advances and related order or invoice documents.
  `m4_po.poid = m4_ap.apidpo`
  `m4_ap.apid = m4_ap_pay.idap`
  `m4_ri.riidap = m4_ap.apid`
- `purchase_vendor_payment_flow`: Flow from vendor-payment proposal to realized payment against target purchasing documents.
  `m4_vpp.vppid = m4_vpp_detail.idvpp`
  `m4_vp.vpid = m4_vp_detail.idvp`
  `m4_vpp_detail.idtransaction = m4_ap.apid when sumber = AP`
  `m4_vpp_detail.idtransaction = m4_ri.riid when sumber = RI`
  `m4_vpp_detail.idtransaction = m4_prt.prtid when sumber = PRT`
- `purchase_comparison_flow`: Relationship among comparative sheets, request quotations, and vendor-selection results.
  `m4_pr.prid = m4_cs.csidpr`
  `m4_cs.csid = m4_cs_detail.idcs`
  `m4_rq.rqid = m4_rq_detail.idrq`
  `m4_rq.idcs = m4_cs.csid`
  `m4_bs_detail.idrqdetail = m4_rq_detail.idrqdetail`
- `purchase_invoice_exchange_flow`: Relationship between purchase-invoice exchange and its upstream purchasing source document.
  `m4_pie.pieid = m4_pie_detail.idpie`
  `m4_pie.idri = m4_ri.riid`
  `m4_pie_detail.idtransaction = target purchase document by sumber`

## Detail-Level Relation Keys

This section is important for the AI agent because M4 purchasing lineage often has to start from detail-table foreign keys.

- `m4_rq_detail.idprdetail -> m4_pr_detail.idprdetail -> m4_pr.prid`
  Used when a request-quotation line must be traced back to the originating purchase request.
- `m4_bs_detail.idrqdetail -> m4_rq_detail.idrqdetail -> m4_rq.rqid`
  Used when a bid-selection line must be traced back to the originating request quotation.
- `m4_grn_detail.idpodetail -> m4_po_detail.idpodetail -> m4_po.poid`
  Used when a goods-receipt line must be traced back to the purchase-order source.
- `m4_ri_detail.idgrndetail -> m4_grn_detail.idgrndetail -> m4_grn.grnid`
  Used when a purchase-invoice line must be traced back to the goods receipt source.
- `m4_dnr_detail.idridetail -> m4_ri_detail.idridetail -> m4_ri.riid`
  Used when a debit-note-return line must be traced back to the receive-invoice source.
- `m4_prt_detail.iddnrdetail -> m4_dnr_detail.iddnrdetail -> m4_dnr.dnrid`
  Used when a purchase-return line must be traced back to the debit-note-return source.

Practical rules:

- if the user asks which upstream document produced the current document, start from detail tables
- move to the header only after the detail foreign key identifies the source document
- do not assume header-to-header joins when source queries show a more explicit detail-to-detail relationship

## Polymorphic Relationships

- `m4_vpp_detail.idtransaction` via `sumber`: Polymorphic relationship to purchasing documents based on the `sumber` discriminator.
  `AP -> m4_ap.apid`
  `RI -> m4_ri.riid`
  `PRT -> m4_prt.prtid`
- `m4_vp_detail.idtransaction` via `sumber`: Polymorphic relationship to purchasing documents based on the `sumber` discriminator.
  `AP -> m4_ap.apid`
  `RI -> m4_ri.riid`
  `PRT -> m4_prt.prtid`
- `m4_pie_detail.idtransaction` via `sumber`: Polymorphic relationship to purchasing documents based on the `sumber` discriminator.
  `target purchasing document follows the source value used in the exchange transaction`

## Module Overview

- **AP**: Advance Purchase | schema tables: 4 | header: 1 | detail: 0 | history: 2 | payment: 1 | relations: 2
- **BS**: Bid Selection | schema tables: 4 | header: 1 | detail: 1 | history: 2 | payment: 0 | relations: 2
- **CS**: Comparative Sheet | schema tables: 2 | header: 1 | detail: 1 | history: 0 | payment: 0 | relations: 2
- **DNR**: Debit Note Return | schema tables: 4 | header: 1 | detail: 1 | history: 2 | payment: 0 | relations: 3
- **FILES**: Purchasing Attachments | schema tables: 1 | header: 0 | detail: 0 | history: 0 | payment: 0 | relations: 0
- **GRN**: Goods Receipt Note | schema tables: 6 | header: 1 | detail: 1 | history: 3 | payment: 0 | relations: 3
- **IPC**: Incoming Purchase Cost | schema tables: 2 | header: 1 | detail: 1 | history: 0 | payment: 0 | relations: 2
- **NOTES**: Purchasing Notes | schema tables: 1 | header: 0 | detail: 0 | history: 0 | payment: 0 | relations: 0
- **PF**: Purchase Finance | schema tables: 2 | header: 1 | detail: 1 | history: 0 | payment: 0 | relations: 0
- **PIE**: Purchase Invoice Exchange | schema tables: 4 | header: 1 | detail: 1 | history: 2 | payment: 0 | relations: 2
- **PO**: Purchase Order | schema tables: 7 | header: 1 | detail: 1 | history: 3 | payment: 0 | relations: 4
- **PP**: Purchase Payment | schema tables: 2 | header: 1 | detail: 0 | history: 0 | payment: 1 | relations: 2
- **PR**: Purchase Request | schema tables: 6 | header: 1 | detail: 1 | history: 3 | payment: 0 | relations: 1
- **PRINT**: Purchasing Print Metadata | schema tables: 0 | header: 0 | detail: 0 | history: 0 | payment: 0 | relations: 0
- **PRT**: Purchase Return | schema tables: 4 | header: 1 | detail: 1 | history: 2 | payment: 0 | relations: 3
- **RFQ**: Request For Quotation | schema tables: 4 | header: 1 | detail: 1 | history: 2 | payment: 0 | relations: 2
- **RI**: Receive Invoice | schema tables: 8 | header: 1 | detail: 1 | history: 4 | payment: 1 | relations: 4
- **RQ**: Request Quotation | schema tables: 4 | header: 1 | detail: 1 | history: 2 | payment: 0 | relations: 3
- **VP**: Vendor Payment | schema tables: 6 | header: 1 | detail: 1 | history: 3 | payment: 1 | relations: 2
- **VPP**: Vendor Payment Proposal | schema tables: 6 | header: 1 | detail: 1 | history: 3 | payment: 1 | relations: 2

## AP - Advance Purchase / Uang Muka Pembelian

### Tables

- `m4_ap` | alias: `purchase_ap` | type: Header | columns: 46
  Purchasing or payable transaction for ap.
- `m4_ap_history` | alias: `purchase_ap` | type: History | columns: 46
  History/archive table detected from active M4 query sources.
- `m4_ap_pay` | alias: `purchase_ap_pay` | type: Payment/Allocation | columns: 16
  Payment/allocation data related to ap pay.
- `m4_ap_pay_history` | alias: `purchase_ap_pay` | type: History | columns: 16
  Payment/allocation history table detected from active M4 query sources.

### Important Header Columns

- `apid`: Business column apid.
- `apautonotransaksi`: Unique document/transaction number.
- `apnotransaksi`: Unique document/transaction number.
- `aptgl`: Transaction date or reference date.
- `apkodepa`: Business column apkodepa.
- `apkontak`: Contact reference or contact person.
- `apkontakperson`: Contact reference or contact person.
- `apbagianpayment`: Transaction amount.
- `aptgljatuhtempo`: Business column aptgljatuhtempo.
- `apidpo`: Business column apidpo.
- `aptglnoref`: Business column aptglnoref.
- `apmorang`: Currency and exchange-rate information.

### Functions

- `m4_ap_getdata`: Retrieves header and detail data for a single transaction document.
- `m4_ap_v`: Provides document listing or search.
- `m4_ap_terkait`: Retrieves document linkage with other documents in the purchasing flow.
- `m4_ap_getdata_history`: Retrieves header/detail status-change history for a single transaction document.
- `m4_ap_v_history`: Provides document status-change history listing.

## BS - Bid Selection / Perbandingan Penawaran

### Tables

- `m4_bs` | alias: `purchase_bs` | type: Header | columns: 38
  Purchasing or payable transaction for bs.
- `m4_bs_detail` | alias: `purchase_bs_detail` | type: Detail | columns: 7
  Detail table for transaction item/row bs detail.
- `m4_bs_detail_history` | alias: `purchase_bs_detail` | type: History | columns: 7
  Detail history table detected from active M4 query sources.
- `m4_bs_history` | alias: `purchase_bs` | type: History | columns: 38
  History/archive table detected from active M4 query sources.

### Important Header Columns

- `bsid`: Business column bsid.
- `bsguandg`: Source/destination warehouse reference.
- `bscarabayar`: Transaction amount.
- `bsautonotransaksi`: Unique document/transaction number.
- `bsnotransaksi`: Unique document/transaction number.
- `bstgl`: Transaction date or reference date.
- `bskodepa`: Business column bskodepa.
- `bsbagiancomparisonkontak`: Contact reference or contact person.
- `bstglnoref`: Business column bstglnoref.
- `bstglpenutupan`: Business column bstglpenutupan.
- `bsmorang`: Currency and exchange-rate information.
- `bsidrq1`: Business column bsidrq1.

### Functions

- `m4_bs_getdata`: Retrieves header and detail data for a single transaction document.
- `m4_bs_v`: Provides document listing or search.
- `m4_bs_getdata_history`: Retrieves header/detail status-change history for a single transaction document.
- `m4_bs_v_history`: Provides document status-change history listing.
- `m4_bs_terkait`: Retrieves document linkage with other documents in the purchasing flow.

## CS - Comparative Sheet / Perbandingan Supplier

### Tables

- `m4_cs` | alias: `purchase_cs` | type: Header | columns: 60
  Purchasing or payable transaction for cs.
- `m4_cs_detail` | alias: `purchase_cs_detail` | type: Detail | columns: 44
  Detail table for transaction item/row cs detail.

### Important Header Columns

- `csid`: Business column csid.
- `csguandg`: Source/destination warehouse reference.
- `cscarabayar`: Transaction amount.
- `csautonotransaksi`: Unique document/transaction number.
- `csnotransaksi`: Unique document/transaction number.
- `cstgl`: Transaction date or reference date.
- `cskodepa`: Business column cskodepa.
- `cssupplier`: Supplier reference.
- `cssupplierkontak`: Supplier reference.
- `cstgldipenuhi`: Business column cstgldipenuhi.
- `cstgljatuhtempo`: Business column cstgljatuhtempo.
- `cstglnoref`: Business column cstglnoref.

## DNR - Debit Note Return / Retur Pembelian Finansial

### Tables

- `m4_dnr` | alias: `purchase_dnr` | type: Header | columns: 70
  Purchasing or payable transaction for dnr.
- `m4_dnr_detail` | alias: `purchase_dnr_detail` | type: Detail | columns: 51
  Detail table for transaction item/row dnr detail.
- `m4_dnr_detail_history` | alias: `purchase_dnr_detail` | type: History | columns: 51
  Detail history table detected from active M4 query sources.
- `m4_dnr_history` | alias: `purchase_dnr` | type: History | columns: 70
  History/archive table detected from active M4 query sources.

### Important Header Columns

- `dnrid`: Business column dnrid.
- `dnrguandg`: Source/destination warehouse reference.
- `dnrcarabayar`: Transaction amount.
- `dnrautonotransaksi`: Unique document/transaction number.
- `dnrnotransaksi`: Unique document/transaction number.
- `dnrtgl`: Transaction date or reference date.
- `dnrkodepa`: Business column dnrkodepa.
- `dnrsupplier`: Supplier reference.
- `dnrsupplierkontak`: Supplier reference.
- `dnrtgljatuhtempo`: Business column dnrtgljatuhtempo.
- `dnrtglnoref`: Business column dnrtglnoref.
- `dnrtglpenutupan`: Business column dnrtglpenutupan.

### Functions

- `m4_dnr_getdata`: Retrieves header and detail data for a single transaction document.
- `m4_dnr_v`: Provides document listing or search.
- `m4_dnr_getdata_history`: Retrieves header/detail status-change history for a single transaction document.
- `m4_dnr_v_history`: Provides document status-change history listing.
- `m4_dnr_detail_cd`: Provides compact lookup/detail data for picker or dropdown use cases.
- `m4_dnr_detail_v`: Provides document listing or search.
- `m4_dnr_terkait`: Retrieves document linkage with other documents in the purchasing flow.

## FILES - Attachments Transaksi Purchasing

### Tables

- `m4_files` | alias: `purchase_files` | type: Auxiliary | columns: 0
  Auxiliary table detected from active M4 query sources.

### Functions

- `m4_files_v`: Provides document listing or search.

## GRN - Goods Receipt Note / Penerimaan Barang

### Tables

- `m4_grn` | alias: `receipt_goods` | type: Header | columns: 66
  Goods-receipt header from supplier or purchase order. Serves as the basis for stock updates and incoming-goods verification.
- `m4_grn_cost` | alias: `inferred_from_query` | type: Cost | columns: 0
  Cost/landed-cost table detected from active M4 query sources.
- `m4_grn_cost_history` | alias: `inferred_from_query` | type: History | columns: 0
  History/archive table detected from active M4 query sources.
- `m4_grn_detail` | alias: `purchase_grn_detail` | type: Detail | columns: 49
  Detail table for transaction item/row grn detail.
- `m4_grn_detail_history` | alias: `purchase_grn_detail` | type: History | columns: 49
  Detail history table detected from active M4 query sources.
- `m4_grn_history` | alias: `receipt_goods` | type: History | columns: 66
  History/archive table detected from active M4 query sources.

### Important Header Columns

- `grnid`: Primary key for the row.
- `grnguandg`: Source/destination warehouse reference.
- `grncarabayar`: Transaction amount.
- `grnautonotransaksi`: Unique document/transaction number.
- `grnnotransaksi`: Unique document/transaction number.
- `grntgl`: Transaction date or reference date.
- `grnkodepa`: Business column grnkodepa.
- `grnsupplier`: Supplier reference.
- `grnsupplierkontak`: Supplier reference.
- `grntgljatuhtempo`: Business column grntgljatuhtempo.
- `grntglnoref`: Business column grntglnoref.
- `grntglpenutupan`: Business column grntglpenutupan.

### Functions

- `m4_grn_getdata`: Retrieves header and detail data for a single transaction document.
- `m4_grn_v`: Provides document listing or search.
- `m4_grn_getdata_history`: Retrieves header/detail status-change history for a single transaction document.
- `m4_grn_v_history`: Provides document status-change history listing.
- `m4_grn_detail_cd`: Provides compact lookup/detail data for picker or dropdown use cases.
- `m4_grn_detail_v`: Provides document listing or search.
- `m4_grn_terkait`: Retrieves document linkage with other documents in the purchasing flow.

## IPC - Incoming Purchase Cost / Biaya Pembelian Masuk

### Tables

- `m4_ipc` | alias: `purchase_ipc` | type: Header | columns: 65
  Purchasing or payable transaction for ipc.
- `m4_ipc_detail` | alias: `purchase_ipc_detail` | type: Detail | columns: 46
  Detail table for transaction item/row ipc detail.

### Important Header Columns

- `ipcid`: Business column ipcid.
- `ipcguandg`: Source/destination warehouse reference.
- `ipccarabayar`: Transaction amount.
- `ipcautonotransaksi`: Unique document/transaction number.
- `ipcnotransaksi`: Unique document/transaction number.
- `ipctgl`: Transaction date or reference date.
- `ipckodepa`: Business column ipckodepa.
- `ipcsupplier`: Supplier reference.
- `ipcsupplierkontak`: Supplier reference.
- `ipctgldipenuhi`: Business column ipctgldipenuhi.
- `ipctgljatuhtempo`: Business column ipctgljatuhtempo.
- `ipctglnoref`: Business column ipctglnoref.

## NOTES - Notes Transaksi Purchasing

### Tables

- `m4_notes` | alias: `purchase_notes` | type: Auxiliary | columns: 0
  Auxiliary table detected from active M4 query sources.

### Functions

- `m4_notes_v`: Provides document listing or search.

## PF - Purchase Finance / Dokumen Purchasing Tambahan

### Tables

- `m4_pf` | alias: `purchase_pf` | type: Header | columns: 0
  Additional purchasing/finance table detected from active M4 query sources.
- `m4_pf_detail` | alias: `purchase_pf_detail` | type: Detail | columns: 0
  Additional purchasing/finance table detected from active M4 query sources.

## PIE - Purchase Invoice Exchange / Tukar Faktur Pembelian

### Tables

- `m4_pie` | alias: `purchase_pie` | type: Header | columns: 27
  Purchasing or payable transaction for pie.
- `m4_pie_detail` | alias: `purchase_pie_detail` | type: Detail | columns: 7
  Detail table for transaction item/row pie detail.
- `m4_pie_detail_history` | alias: `purchase_pie_detail` | type: History | columns: 7
  Detail history table detected from active M4 query sources.
- `m4_pie_history` | alias: `purchase_pie` | type: History | columns: 27
  History/archive table detected from active M4 query sources.

### Important Header Columns

- `pieid`: Business column pieid.
- `pieautonotransaksi`: Unique document/transaction number.
- `pienotransaksi`: Unique document/transaction number.
- `pietgl`: Transaction date or reference date.
- `piekodepa`: Business column piekodepa.
- `piekontak`: Contact reference or contact person.
- `piekontakperson`: Contact reference or contact person.
- `pietglnoref`: Business column pietglnoref.
- `piestatus`: Process status or document status.
- `piestatussebelumnya`: Process status or document status.
- `piepostingtgl`: Transaction date or reference date.

## PO - Purchase Order

### Tables

- `m4_po` | alias: `order_purchase` | type: Header | columns: 65
  Purchase-order header to supplier. Serves as the basis for goods receipt, purchase invoicing, and outstanding-purchase control.
- `m4_po_cost` | alias: `inferred_from_query` | type: Cost | columns: 0
  Cost/landed-cost table detected from active M4 query sources.
- `m4_po_cost_history` | alias: `inferred_from_query` | type: History | columns: 0
  History/archive table detected from active M4 query sources.
- `m4_po_detail` | alias: `order_purchase_detail` | type: Detail | columns: 46
  Purchase-order detail rows. Store goods, quantity, price, discount, tax, and references to downstream purchasing processes.
- `m4_po_detail_history` | alias: `order_purchase_detail` | type: History | columns: 46
  Detail history table detected from active M4 query sources.
- `m4_po_history` | alias: `order_purchase` | type: History | columns: 65
  History/archive table detected from active M4 query sources.
- `m4_po_trans` | alias: `inferred_from_query` | type: Intermediate | columns: 0
  Intermediate transaction table detected from active M4 query sources.

### Important Header Columns

- `poid`: Primary key for the row.
- `poguandg`: Source/destination warehouse reference.
- `pocarabayar`: Transaction amount.
- `poautonotransaksi`: Unique document/transaction number.
- `ponotransaksi`: Unique document/transaction number.
- `potgl`: Transaction date or reference date.
- `pokodepa`: Business column pokodepa.
- `posupplier`: Supplier reference.
- `posupplierkontak`: Supplier reference.
- `potgldipenuhi`: Business column potgldipenuhi.
- `potgljatuhtempo`: Business column potgljatuhtempo.
- `potglnoref`: Business column potglnoref.

### Functions

- `m4_po_getdata`: Retrieves header and detail data for a single transaction document.
- `m4_po_v`: Provides document listing or search.
- `m4_po_getdata_history`: Retrieves header/detail status-change history for a single transaction document.
- `m4_po_v_history`: Provides document status-change history listing.
- `m4_po_detail_cd`: Provides compact lookup/detail data for picker or dropdown use cases.
- `m4_po_detail_v`: Provides document listing or search.
- `m4_po_cd`: Provides compact lookup/detail data for picker or dropdown use cases.
- `m4_po_terkait`: Retrieves document linkage with other documents in the purchasing flow.

## PP - Purchase Payment / Pembayaran Pembelian

### Tables

- `m4_pp` | alias: `purchase_pp` | type: Header | columns: 45
  Purchasing or payable transaction for pp.
- `m4_pp_pay` | alias: `purchase_pp_pay` | type: Payment/Allocation | columns: 16
  Payment/allocation data related to pp pay.

### Important Header Columns

- `ppid`: Business column ppid.
- `ppautonotransaksi`: Unique document/transaction number.
- `ppnotransaksi`: Unique document/transaction number.
- `pptgl`: Transaction date or reference date.
- `ppkodepa`: Business column ppkodepa.
- `ppkontak`: Contact reference or contact person.
- `ppkontakperson`: Contact reference or contact person.
- `ppbagianpayment`: Transaction amount.
- `pptgljatuhtempo`: Business column pptgljatuhtempo.
- `ppidri`: Business column ppidri.
- `pptglnoref`: Business column pptglnoref.
- `ppmorang`: Currency and exchange-rate information.

### Functions

- `m4_pp_getdata`: Retrieves header and detail data for a single transaction document.
- `m4_pp_v`: Provides document listing or search.
- `m4_pp_terkait`: Retrieves document linkage with other documents in the purchasing flow.

## PR - Purchase Request

### Tables

- `m4_pr` | alias: `purchase_pr` | type: Header | columns: 56
  Purchasing or payable transaction for pr.
- `m4_pr_detail` | alias: `purchase_pr_detail` | type: Detail | columns: 53
  Detail table for transaction item/row pr detail.
- `m4_pr_detail_history` | alias: `purchase_pr_detail` | type: History | columns: 53
  Detail history table detected from active M4 query sources.
- `m4_pr_history` | alias: `purchase_pr` | type: History | columns: 56
  History/archive table detected from active M4 query sources.
- `m4_pr_trans` | alias: `inferred_from_query` | type: Intermediate | columns: 0
  Intermediate transaction table detected from active M4 query sources.
- `m4_pr_trans_history` | alias: `inferred_from_query` | type: History | columns: 0
  History/archive table detected from active M4 query sources.

### Important Header Columns

- `prid`: Business column prid.
- `prguandg`: Source/destination warehouse reference.
- `prcarabayar`: Transaction amount.
- `prautonotransaksi`: Unique document/transaction number.
- `prnotransaksi`: Unique document/transaction number.
- `prtgl`: Transaction date or reference date.
- `prkodepa`: Business column prkodepa.
- `prdimintaolehkontak`: Contact reference or contact person.
- `prtgldipakai`: Business column prtgldipakai.
- `prtgljatuhtempo`: Business column prtgljatuhtempo.
- `prtglnoref`: Business column prtglnoref.
- `prtglpenutupan`: Business column prtglpenutupan.

### Functions

- `m4_pr_getdata`: Retrieves header and detail data for a single transaction document.
- `m4_pr_v`: Provides document listing or search.
- `m4_pr_getdata_history`: Retrieves header/detail status-change history for a single transaction document.
- `m4_pr_v_history`: Provides document status-change history listing.
- `m4_pr_detail_cd`: Provides compact lookup/detail data for picker or dropdown use cases.
- `m4_pr_detail_v`: Provides document listing or search.
- `m4_pr_terkait`: Retrieves document linkage with other documents in the purchasing flow.
- `m4_prt_getdata`: Retrieves header and detail data for a single transaction document.
- `m4_prt_v`: Provides document listing or search.
- `m4_prt_getdata_history`: Retrieves header/detail status-change history for a single transaction document.
- `m4_prt_v_history`: Provides document status-change history listing.
- `m4_prt_terkait`: Retrieves document linkage with other documents in the purchasing flow.

## PRINT - Print Metadata Purchasing

### Tables


## PRT - Purchase Return

### Tables

- `m4_prt` | alias: `purchase_prt` | type: Header | columns: 76
  Purchasing or payable transaction for prt.
- `m4_prt_detail` | alias: `purchase_prt_detail` | type: Detail | columns: 48
  Detail table for transaction item/row prt detail.
- `m4_prt_detail_history` | alias: `purchase_prt_detail` | type: History | columns: 48
  Detail history table detected from active M4 query sources.
- `m4_prt_history` | alias: `purchase_prt` | type: History | columns: 76
  History/archive table detected from active M4 query sources.

### Important Header Columns

- `prtid`: Business column prtid.
- `prtguandg`: Source/destination warehouse reference.
- `prtcarabayar`: Transaction amount.
- `prtautonotransaksi`: Unique document/transaction number.
- `prtnotransaksi`: Unique document/transaction number.
- `prttgl`: Transaction date or reference date.
- `prtkodepa`: Business column prtkodepa.
- `prtsupplier`: Supplier reference.
- `prtsupplierkontak`: Supplier reference.
- `prttgljatuhtempo`: Business column prttgljatuhtempo.
- `prttglnoref`: Business column prttglnoref.
- `prttglpenutupan`: Business column prttglpenutupan.

### Functions

- `m4_prt_getdata`: Retrieves header and detail data for a single transaction document.
- `m4_prt_v`: Provides document listing or search.
- `m4_prt_getdata_history`: Retrieves header/detail status-change history for a single transaction document.
- `m4_prt_v_history`: Provides document status-change history listing.
- `m4_prt_terkait`: Retrieves document linkage with other documents in the purchasing flow.

## RFQ - Request For Quotation

### Tables

- `m4_rfq` | alias: `purchase_rfq` | type: Header | columns: 29
  Purchasing or payable transaction for rfq.
- `m4_rfq_detail` | alias: `purchase_rfq_detail` | type: Detail | columns: 7
  Detail table for transaction item/row rfq detail.
- `m4_rfq_detail_history` | alias: `purchase_rfq_detail` | type: History | columns: 7
  Detail history table detected from active M4 query sources.
- `m4_rfq_history` | alias: `purchase_rfq` | type: History | columns: 29
  History/archive table detected from active M4 query sources.

### Important Header Columns

- `rfqid`: Business column rfqid.
- `rfqautonotransaksi`: Unique document/transaction number.
- `rfqnotransaksi`: Unique document/transaction number.
- `rfqtgl`: Transaction date or reference date.
- `rfqkodepa`: Business column rfqkodepa.
- `rfqidpr`: Business column rfqidpr.
- `rfqkontakperson`: Contact reference or contact person.
- `rfqtglnoref`: Business column rfqtglnoref.
- `rfqstatus`: Process status or document status.
- `rfqstatussebelumnya`: Process status or document status.
- `rfqpostingtgl`: Transaction date or reference date.
- `rfqtglawal`: Business column rfqtglawal.

## RI - Receive Invoice / Tagihan Pembelian

### Tables

- `m4_ri` | alias: `invoice_purchase` | type: Header | columns: 77
  Purchase-invoice header from supplier. Used to record accounts payable and drive payable settlement.
- `m4_ri_cost` | alias: `inferred_from_query` | type: Cost | columns: 0
  Cost/landed-cost table detected from active M4 query sources.
- `m4_ri_cost_history` | alias: `inferred_from_query` | type: History | columns: 0
  History/archive table detected from active M4 query sources.
- `m4_ri_detail` | alias: `purchase_ri_detail` | type: Detail | columns: 46
  Detail table for transaction item/row ri detail.
- `m4_ri_detail_history` | alias: `purchase_ri_detail` | type: History | columns: 46
  Detail history table detected from active M4 query sources.
- `m4_ri_history` | alias: `invoice_purchase` | type: History | columns: 77
  History/archive table detected from active M4 query sources.
- `m4_ri_pay` | alias: `purchase_ri_pay` | type: Payment/Allocation | columns: 20
  Payment/allocation data related to ri pay.
- `m4_ri_pay_history` | alias: `purchase_ri_pay` | type: History | columns: 20
  Payment/allocation history table detected from active M4 query sources.

### Important Header Columns

- `riid`: Primary key for the row.
- `riguandg`: Source/destination warehouse reference.
- `ricarabayar`: Transaction amount.
- `riautonotransaksi`: Unique document/transaction number.
- `rinotransaksi`: Unique document/transaction number.
- `ritgl`: Transaction date or reference date.
- `rikodepa`: Business column rikodepa.
- `risupplier`: Supplier reference.
- `risupplierkontak`: Supplier reference.
- `ritgljatuhtempo`: Business column ritgljatuhtempo.
- `ritglnoref`: Business column ritglnoref.
- `ritglpenutupan`: Business column ritglpenutupan.

### Functions

- `m4_ri_getdata`: Retrieves header and detail data for a single transaction document.
- `m4_ri_cd`: Provides compact lookup/detail data for picker or dropdown use cases.
- `m4_ri_v`: Provides document listing or search.
- `m4_ri_getdata_history`: Retrieves header/detail status-change history for a single transaction document.
- `m4_ri_v_history`: Provides document status-change history listing.
- `m4_ri_detail_cd`: Provides compact lookup/detail data for picker or dropdown use cases.
- `m4_ri_detail_v`: Provides document listing or search.
- `m4_ri_terkait`: Retrieves document linkage with other documents in the purchasing flow.

## RQ - Request Quotation / Permintaan Penawaran

### Tables

- `m4_rq` | alias: `purchase_rq` | type: Header | columns: 60
  Purchasing or payable transaction for rq.
- `m4_rq_detail` | alias: `purchase_rq_detail` | type: Detail | columns: 45
  Detail table for transaction item/row rq detail.
- `m4_rq_detail_history` | alias: `purchase_rq_detail` | type: History | columns: 45
  Detail history table detected from active M4 query sources.
- `m4_rq_history` | alias: `purchase_rq` | type: History | columns: 60
  History/archive table detected from active M4 query sources.

### Important Header Columns

- `rqid`: Business column rqid.
- `rqguandg`: Source/destination warehouse reference.
- `rqcarabayar`: Transaction amount.
- `rqautonotransaksi`: Unique document/transaction number.
- `rqnotransaksi`: Unique document/transaction number.
- `rqtgl`: Transaction date or reference date.
- `rqkodepa`: Business column rqkodepa.
- `rqsupplier`: Supplier reference.
- `rqsupplierkontak`: Supplier reference.
- `rqtgldipenuhi`: Business column rqtgldipenuhi.
- `rqtgljatuhtempo`: Business column rqtgljatuhtempo.
- `rqtglnoref`: Business column rqtglnoref.

### Functions

- `m4_rq_getdata`: Retrieves header and detail data for a single transaction document.
- `m4_rq_v`: Provides document listing or search.
- `m4_rq_v_history`: Provides document status-change history listing.
- `m4_rq_getdata_history`: Retrieves header/detail status-change history for a single transaction document.
- `m4_rq_cd`: Provides compact lookup/detail data for picker or dropdown use cases.
- `m4_rq_detail_cd`: Provides compact lookup/detail data for picker or dropdown use cases.
- `m4_rq_detail_v`: Provides document listing or search.
- `m4_rq_terkait`: Retrieves document linkage with other documents in the purchasing flow.

## VP - Vendor Payment

### Tables

- `m4_vp` | alias: `purchase_vp` | type: Header | columns: 45
  Purchasing or payable transaction for vp.
- `m4_vp_detail` | alias: `purchase_vp_detail` | type: Detail | columns: 24
  Detail table for transaction item/row vp detail.
- `m4_vp_detail_history` | alias: `purchase_vp_detail` | type: History | columns: 24
  Detail history table detected from active M4 query sources.
- `m4_vp_history` | alias: `purchase_vp` | type: History | columns: 45
  History/archive table detected from active M4 query sources.
- `m4_vp_pay` | alias: `purchase_vp_pay` | type: Payment/Allocation | columns: 17
  Payment/allocation data related to vp pay.
- `m4_vp_pay_history` | alias: `purchase_vp_pay` | type: History | columns: 17
  Payment/allocation history table detected from active M4 query sources.

### Important Header Columns

- `vpid`: Business column vpid.
- `vpguandg`: Source/destination warehouse reference.
- `vpautonotransaksi`: Unique document/transaction number.
- `vpnotransaksi`: Unique document/transaction number.
- `vptgl`: Transaction date or reference date.
- `vpkodepa`: Business column vpkodepa.
- `vpsupplier`: Supplier reference.
- `vpsupplierkontak`: Supplier reference.
- `vpbagianpayment`: Transaction amount.
- `vptglnoref`: Business column vptglnoref.
- `vpcarabayar`: Transaction amount.
- `vptglbayar`: Transaction amount.

### Functions

- `m4_vpp_getdata`: Retrieves header and detail data for a single transaction document.
- `m4_vpp_getdata_pay`: Retrieves payment/allocation data for a single document transaction.
- `m4_vpp_v`: Provides document listing or search.
- `m4_vpp_getdata_history`: Retrieves header/detail status-change history for a single transaction document.
- `m4_vpp_getdata_pay_history`: Retrieves header/detail status-change history for a single transaction document.
- `m4_vpp_v_history`: Provides document status-change history listing.
- `m4_vpp_cd`: Provides compact lookup/detail data for picker or dropdown use cases.
- `m4_vpp_terkait`: Retrieves document linkage with other documents in the purchasing flow.
- `m4_vpp_takedata`: Retrieves candidate document/source data for downstream processing.
- `m4_vpp_takedataold`: Retrieves candidate document/source data for downstream processing.
- `m4_vp_getdata`: Retrieves header and detail data for a single transaction document.
- `m4_vp_getdata_pay`: Retrieves payment/allocation data for a single document transaction.
- `m4_vp_v`: Provides document listing or search.
- `m4_vp_getdata_history`: Retrieves header/detail status-change history for a single transaction document.
- `m4_vp_getdata_pay_history`: Retrieves header/detail status-change history for a single transaction document.
- `m4_vp_v_history`: Provides document status-change history listing.
- `m4_vp_terkait`: Retrieves document linkage with other documents in the purchasing flow.

## VPP - Vendor Payment Proposal

### Tables

- `m4_vpp` | alias: `purchase_vpp` | type: Header | columns: 45
  Purchasing or payable transaction for vpp.
- `m4_vpp_detail` | alias: `purchase_vpp_detail` | type: Detail | columns: 26
  Detail table for transaction item/row vpp detail.
- `m4_vpp_detail_history` | alias: `purchase_vpp_detail` | type: History | columns: 26
  Detail history table detected from active M4 query sources.
- `m4_vpp_history` | alias: `purchase_vpp` | type: History | columns: 45
  History/archive table detected from active M4 query sources.
- `m4_vpp_pay` | alias: `purchase_vpp_pay` | type: Payment/Allocation | columns: 19
  Payment/allocation data related to vpp pay.
- `m4_vpp_pay_history` | alias: `purchase_vpp_pay` | type: History | columns: 19
  Payment/allocation history table detected from active M4 query sources.

### Important Header Columns

- `vppid`: Business column vppid.
- `vppguandg`: Source/destination warehouse reference.
- `vppautonotransaksi`: Unique document/transaction number.
- `vppnotransaksi`: Unique document/transaction number.
- `vpptgl`: Transaction date or reference date.
- `vppkodepa`: Business column vppkodepa.
- `vppsupplier`: Supplier reference.
- `vppsupplierkontak`: Supplier reference.
- `vppbagianpayment`: Transaction amount.
- `vpptglnoref`: Business column vpptglnoref.
- `vppcarabayar`: Transaction amount.
- `vpptglbayar`: Transaction amount.

### Functions

- `m4_vpp_getdata`: Retrieves header and detail data for a single transaction document.
- `m4_vpp_getdata_pay`: Retrieves payment/allocation data for a single document transaction.
- `m4_vpp_v`: Provides document listing or search.
- `m4_vpp_getdata_history`: Retrieves header/detail status-change history for a single transaction document.
- `m4_vpp_getdata_pay_history`: Retrieves header/detail status-change history for a single transaction document.
- `m4_vpp_v_history`: Provides document status-change history listing.
- `m4_vpp_cd`: Provides compact lookup/detail data for picker or dropdown use cases.
- `m4_vpp_terkait`: Retrieves document linkage with other documents in the purchasing flow.
- `m4_vpp_takedata`: Retrieves candidate document/source data for downstream processing.
- `m4_vpp_takedataold`: Retrieves candidate document/source data for downstream processing.
