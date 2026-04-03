# Semantic Schema M2 Summary

Schema source: `/home/rania/apps/sentient-factory/apps/myerpplus-db-mapping/db/semantic-schema-m2.json`
Function/query source: `/home/rania/apps/sentient-factory/m2-queries.md`, `/home/rania/apps/sentient-factory/m0_report_rmoduleid_2.sql`, `/home/rania/apps/sentient-factory/client-backend/api-myerpplus/app_code/ws/m0/m0_query.vb`

Total M2 tables in schema: **70**
Total M2 tables detected in active queries: **70**
Total function M2: **72**
Total polymorphic relationships: **0**
Total join hints: **9**

This document summarizes aliases, descriptions, table structure, main relationships, join hints, and primary semantic functions for M2 Finance.
The schema JSON has been matched against active service queries and reports, so the schema tables are aligned with the operational sources currently in use.

## Join Hints

- `cash_receipt_flow`: Cash-receipt flow and its accounting detail lines.
  `m2_cr.crid = m2_cr_detail.idcr`
- `cash_disbursement_flow`: Cash-disbursement flow and its accounting detail lines.
  `m2_cd.cdid = m2_cd_detail.idcd`
- `bank_disbursement_flow`: Bank-disbursement flow and its accounting detail lines.
  `m2_bd.bdid = m2_bd_detail.idbd`
- `receipt_memo_payment_flow`: Receipt-memo relationship with payment allocation.
  `m2_rm.rmid = m2_rm_detail.idrm`
  `m2_rm.rmid = m2_rm_pay.idrm`
- `send_memo_payment_flow`: Send-memo relationship with payment allocation.
  `m2_sm.smid = m2_sm_detail.idsm`
  `m2_sm.smid = m2_sm_pay.idsm`
- `cashbank_transfer_flow`: Cash/bank transfer relationship with detail and payment allocation.
  `m2_cb.cbid = m2_cb_detail.idcb`
  `m2_cb.cbid = m2_cb_pay.idcb`
- `giro_receipt_flow`: Receipt-giro flow and its clearing document.
  `m2_rg.rgid = m2_rg_detail.idrg`
  `m2_rgc.rgcid = m2_rgc_detail.idrgc`
- `giro_send_flow`: Send-giro flow and its clearing document.
  `m2_sg.sgid = m2_sg_detail.idsg`
  `m2_sgc.sgcid = m2_sgc_detail.idsgc`
- `journal_posting_flow`: Relationship from finance documents to posted transaction journals.
  `m2_transaction_journal.tidtransaksi = finance document id`
  `m2_transaction_journal.tsumber = finance document source code`

## Polymorphic Relationships

- No explicit polymorphic relationships are modeled in the active M2 schema/query set.

## Detail-Level Relation Keys

This section is important for the AI agent because finance queries often fail when header, detail, allocation, and posted-journal layers are not separated.

- `m2_cr_detail.idcr -> m2_cr.crid`
  Used when cash-receipt detail rows must be lifted to the cash-receipt header.
- `m2_cd_detail.idcd -> m2_cd.cdid`
  Used when cash-disbursement detail rows must be lifted to the cash-disbursement header.
- `m2_bd_detail.idbd -> m2_bd.bdid`
  Used when bank-disbursement detail rows must be lifted to the bank-disbursement header.
- `m2_rm_detail.idrm -> m2_rm.rmid`
  Used when receipt-memo accounting lines are traced from detail to header.
- `m2_rm_pay.idrm -> m2_rm.rmid`
  Used when receipt-memo allocation rows are traced to the header.
- `m2_sm_detail.idsm -> m2_sm.smid`
  Used when send-memo accounting lines are traced from detail to header.
- `m2_sm_pay.idsm -> m2_sm.smid`
  Used when send-memo allocation rows are traced to the header.
- `m2_cb_detail.idcb -> m2_cb.cbid`
  Used when cash/bank transfer detail rows are traced to the transfer header.
- `m2_cb_pay.idcb -> m2_cb.cbid`
  Used when cash/bank transfer allocation rows are traced to the transfer header.
- `m2_rg_detail.idrg -> m2_rg.rgid`
  Used when receipt-giro rows are traced from detail to the giro header.
- `m2_rgc_detail.idrgc -> m2_rgc.rgcid`
  Used when receipt-giro clearing rows are traced to the clearing header.
- `m2_sg_detail.idsg -> m2_sg.sgid`
  Used when send-giro rows are traced from detail to the giro header.
- `m2_sgc_detail.idsgc -> m2_sgc.sgcid`
  Used when send-giro clearing rows are traced to the clearing header.
- `m2_transaction_journal.tidtransaksi + m2_transaction_journal.tsumber -> finance document header`
  Used when a posted journal must be traced back to its source document.

Practical rules:

- start from detail tables or `_pay` tables when the question is about amount distribution or allocation
- move to the header only after the document foreign key is identified
- for posted journals, always read `tidtransaksi` together with `tsumber`
- do not mix `_detail` and `_pay` unless the analytical goal is explicit

## Module Overview

- **ACCOUNTING**: Accounting Period | schema tables: 1 | header: 1 | detail: 0 | history: 0 | payment: 0 | relations: 0
- **CR**: Cash Receipt | schema tables: 4 | header: 1 | detail: 1 | history: 2 | payment: 0 | relations: 1
- **CD**: Cash Disbursement | schema tables: 4 | header: 1 | detail: 1 | history: 2 | payment: 0 | relations: 1
- **RM**: Receipt Memo | schema tables: 6 | header: 1 | detail: 1 | history: 3 | payment: 1 | relations: 2
- **SM**: Send Memo | schema tables: 6 | header: 1 | detail: 1 | history: 3 | payment: 1 | relations: 2
- **GJ**: General Journal | schema tables: 4 | header: 1 | detail: 1 | history: 2 | payment: 0 | relations: 1
- **AJ**: Adjustment Journal | schema tables: 4 | header: 1 | detail: 1 | history: 2 | payment: 0 | relations: 1
- **RG**: Receipt Giro | schema tables: 4 | header: 1 | detail: 1 | history: 2 | payment: 0 | relations: 1
- **SG**: Send Giro | schema tables: 4 | header: 1 | detail: 1 | history: 2 | payment: 0 | relations: 1
- **RGC**: Receipt Giro Clearing | schema tables: 4 | header: 1 | detail: 1 | history: 2 | payment: 0 | relations: 1
- **SGC**: Send Giro Clearing | schema tables: 4 | header: 1 | detail: 1 | history: 2 | payment: 0 | relations: 1
- **CB**: Cash/Bank Transfer | schema tables: 6 | header: 1 | detail: 1 | history: 3 | payment: 1 | relations: 2
- **BD**: Bank Disbursement | schema tables: 4 | header: 1 | detail: 1 | history: 2 | payment: 0 | relations: 1
- **JM**: Memorial Journal | schema tables: 4 | header: 1 | detail: 1 | history: 2 | payment: 0 | relations: 1
- **GIRO**: Giro List | schema tables: 1 | header: 1 | detail: 0 | history: 0 | payment: 0 | relations: 0
- **TRANSACTION**: Transaction Journal | schema tables: 1 | header: 1 | detail: 0 | history: 0 | payment: 0 | relations: 1
- **REALIZATION**: Budget Realization | schema tables: 7 | header: 7 | detail: 0 | history: 0 | payment: 0 | relations: 1
- **NOTES**: Finance Notes | schema tables: 1 | header: 0 | detail: 0 | history: 0 | payment: 0 | relations: 0
- **FILES**: Finance Attachments | schema tables: 1 | header: 0 | detail: 0 | history: 0 | payment: 0 | relations: 0

## ACCOUNTING - Accounting Period

Accounting-period master used to control open and closed periods.

### Tables

- `m2_accounting_period` | alias: `finance_accounting_period` | type: Header | columns: 5
  Finance transaction or reference row for accounting period.

### Important Header Columns

- `apkode`: Business column apkode.
- `aptahun`: Business column aptahun.
- `apbulan`: Business column apbulan.
- `apaktif`: Business column apaktif.
- `aptutupperiod`: Business column aptutupperiod.

### Functions

- `m2_accounting_period_v`: Provides document listing or search.

## CR - Cash Receipt

Cash receipt.

### Tables

- `m2_cr` | alias: `finance_cr` | type: Header | columns: 28
  Finance transaction or reference row for cr.
- `m2_cr_detail` | alias: `finance_cr_detail` | type: Detail | columns: 14
  Detail table for transaction item/row cr detail.
- `m2_cr_detail_history` | alias: `finance_cr_detail_history` | type: History | columns: 16
  Finance detail history table for cr.
- `m2_cr_history` | alias: `finance_cr_history` | type: History | columns: 29
  Finance history table for cr.

### Important Header Columns

- `crid`: Business column crid.
- `crautonotransaksi`: Unique document/transaction number.
- `crnotransaksi`: Unique document/transaction number.
- `crtgl`: Transaction date or reference date.
- `crkodepa`: Business column crkodepa.
- `crkontak`: Contact reference or contact person.
- `crkontakperson`: Contact reference or contact person.
- `crnorek`: Business column crnorek.
- `crmorang`: Currency and exchange-rate information.
- `crkurs`: Currency and exchange-rate information.
- `crjumlahbayar`: Transaction amount.
- `crjumlahbayarvalas`: Transaction amount.

### Main Relationships

- `m2_cr_detail` -> `m2_cr`: `m2_cr_detail.idcr = m2_cr.crid`

### Functions

- `m2_cr_v`: Provides document listing or search.
- `m2_cr_getdata`: Retrieves header and detail data for a single transaction document.
- `m2_cr_v_history`: Provides document status-change history listing.
- `m2_cr_h_getdata`: Retrieves header/detail status-change history for a single transaction document.

## CD - Cash Disbursement

Cash disbursement.

### Tables

- `m2_cd` | alias: `finance_cd` | type: Header | columns: 42
  Finance transaction or reference row for cd.
- `m2_cd_detail` | alias: `finance_cd_detail` | type: Detail | columns: 23
  Detail table for transaction item/row cd.
- `m2_cd_detail_history` | alias: `finance_cd_detail_history` | type: History | columns: 25
  Finance detail history table for cd.
- `m2_cd_history` | alias: `finance_cd_history` | type: History | columns: 43
  Finance history table for cd.

### Important Header Columns

- `cdid`: Business column cdid.
- `cdautonotransaksi`: Unique document/transaction number.
- `cdnotransaksi`: Unique document/transaction number.
- `cdtgl`: Transaction date or reference date.
- `cdkodepa`: Business column cdkodepa.
- `cdkontak`: Contact reference or contact person.
- `cdkontakperson`: Contact reference or contact person.
- `cdnorek`: Business column cdnorek.
- `cdmorang`: Currency and exchange-rate information.
- `cdkurs`: Business column cdkurs.
- `cdjumlahbayar`: Transaction amount.
- `cdjumlahbayarvalas`: Transaction amount.

### Main Relationships

- `m2_cd_detail` -> `m2_cd`: `m2_cd_detail.idcd = m2_cd.cdid`

### Functions

- `m2_cd_v`: Provides document listing or search.
- `m2_cd_getdata`: Retrieves header and detail data for a single transaction document.
- `m2_cd_v_history`: Provides document status-change history listing.
- `m2_cd_h_getdata`: Retrieves header/detail status-change history for a single transaction document.

## RM - Receipt Memo

Receipt memo / receivable memo with payment allocation.

### Tables

- `m2_rm` | alias: `finance_rm` | type: Header | columns: 29
  Finance transaction or reference row for rm.
- `m2_rm_detail` | alias: `finance_rm_detail` | type: Detail | columns: 14
  Detail table for transaction item/row rm detail.
- `m2_rm_detail_history` | alias: `finance_rm_detail_history` | type: History | columns: 16
  Finance detail history table for rm.
- `m2_rm_history` | alias: `finance_rm_history` | type: History | columns: 30
  Finance history table for rm.
- `m2_rm_pay` | alias: `finance_rm_pay` | type: Payment/Allocation | columns: 15
  Payment/allocation data related to rm pay.
- `m2_rm_pay_history` | alias: `finance_rm_pay_history` | type: History | columns: 17
  Finance payment/allocation history table for `rm_pay`.

### Important Header Columns

- `rmid`: Business column rmid.
- `rmautonotransaksi`: Unique document/transaction number.
- `rmnotransaksi`: Unique document/transaction number.
- `rmtgl`: Transaction date or reference date.
- `rmkodepa`: Business column rmkodepa.
- `rmcarabayar`: Transaction amount.
- `rmkontak`: Contact reference or contact person.
- `rmkontakperson`: Contact reference or contact person.
- `rmnorek`: Business column rmnorek.
- `rmmorang`: Currency and exchange-rate information.
- `rmkurs`: Currency and exchange-rate information.
- `rmjumlahbayar`: Transaction amount.

### Main Relationships

- `m2_rm_detail` -> `m2_rm`: `m2_rm_detail.idrm = m2_rm.rmid`
- `m2_rm_pay` -> `m2_rm`: `m2_rm_pay.idrm = m2_rm.rmid`

### Functions

- `m2_rm_v`: Provides document listing or search.
- `m2_rm_getdata`: Retrieves header and detail data for a single transaction document.
- `m2_rm_v_history`: Provides document status-change history listing.
- `m2_rm_getdata_history`: Retrieves header/detail status-change history for a single transaction document.
- `m2_rm_pay_v`: Provides document listing or search.
- `m2_rm_pay_history`: Menyediakan data payment/allocation for document finance.
- `m2_rm_terkait`: Retrieves linkage with other finance documents.

## SM - Send Memo

Send memo / payable memo with payment allocation.

### Tables

- `m2_sm` | alias: `finance_sm` | type: Header | columns: 29
  Finance transaction or reference row for sm.
- `m2_sm_detail` | alias: `finance_sm_detail` | type: Detail | columns: 14
  Detail table for transaction item/row sm detail.
- `m2_sm_detail_history` | alias: `finance_sm_detail_history` | type: History | columns: 16
  Finance detail history table for sm.
- `m2_sm_history` | alias: `finance_sm_history` | type: History | columns: 30
  Finance history table for sm.
- `m2_sm_pay` | alias: `finance_sm_pay` | type: Payment/Allocation | columns: 15
  Payment/allocation data related to sm pay.
- `m2_sm_pay_history` | alias: `finance_sm_pay_history` | type: History | columns: 17
  Finance payment/allocation history table for `sm_pay`.

### Important Header Columns

- `smid`: Business column smid.
- `smautonotransaksi`: Unique document/transaction number.
- `smnotransaksi`: Unique document/transaction number.
- `smtgl`: Transaction date or reference date.
- `smkodepa`: Business column smkodepa.
- `smcarabayar`: Transaction amount.
- `smkontak`: Contact reference or contact person.
- `smkontakperson`: Contact reference or contact person.
- `smnorek`: Business column smnorek.
- `smmorang`: Currency and exchange-rate information.
- `smkurs`: Currency and exchange-rate information.
- `smjumlahbayar`: Transaction amount.

### Main Relationships

- `m2_sm_detail` -> `m2_sm`: `m2_sm_detail.idsm = m2_sm.smid`
- `m2_sm_pay` -> `m2_sm`: `m2_sm_pay.idsm = m2_sm.smid`

### Functions

- `m2_sm_v`: Provides document listing or search.
- `m2_sm_getdata`: Retrieves header and detail data for a single transaction document.
- `m2_sm_v_history`: Provides document status-change history listing.
- `m2_sm_getdata_history`: Retrieves header/detail status-change history for a single transaction document.
- `m2_sm_pay_v`: Provides document listing or search.
- `m2_sm_pay_v_history`: Provides document status-change history listing.
- `m2_sm_terkait`: Retrieves linkage with other finance documents.

## GJ - General Journal

General journal.

### Tables

- `m2_gj` | alias: `finance_gj` | type: Header | columns: 29
  Finance transaction or reference row for gj.
- `m2_gj_detail` | alias: `finance_gj_detail` | type: Detail | columns: 16
  Detail table for transaction item/row gj detail.
- `m2_gj_detail_history` | alias: `finance_gj_detail_history` | type: History | columns: 18
  Finance detail history table for gj.
- `m2_gj_history` | alias: `finance_gj_history` | type: History | columns: 30
  Finance history table for gj.

### Important Header Columns

- `gjid`: Business column gjid.
- `gjautonotransaksi`: Unique document/transaction number.
- `gjnotransaksi`: Unique document/transaction number.
- `gjtgl`: Transaction date or reference date.
- `gjkodepa`: Business column gjkodepa.
- `gjkontak`: Contact reference or contact person.
- `gjkontakperson`: Contact reference or contact person.
- `gjmorang`: Currency and exchange-rate information.
- `gjkurs`: Currency and exchange-rate information.
- `gjjumlahbayar`: Transaction amount.
- `gjjumlahbayarvalas`: Transaction amount.
- `gjstatusbayar`: Transaction amount.

### Main Relationships

- `m2_gj_detail` -> `m2_gj`: `m2_gj_detail.idgj = m2_gj.gjid`

### Functions

- `m2_gj_v`: Provides document listing or search.
- `m2_gj_getdata`: Retrieves header and detail data for a single transaction document.
- `m2_gj_v_history`: Provides document status-change history listing.
- `m2_gj_getdata_history`: Retrieves header/detail status-change history for a single transaction document.

## AJ - Adjustment Journal

Adjustment journal manual for koreksi akuntansi.

### Tables

- `m2_aj` | alias: `finance_aj` | type: Header | columns: 29
  Finance transaction or reference row for aj.
- `m2_aj_detail` | alias: `finance_aj_detail` | type: Detail | columns: 16
  Detail table for transaction item/row aj detail.
- `m2_aj_detail_history` | alias: `finance_aj_detail_history` | type: History | columns: 18
  Finance detail history table for aj.
- `m2_aj_history` | alias: `finance_aj_history` | type: History | columns: 30
  Finance history table for aj.

### Important Header Columns

- `ajid`: Business column ajid.
- `ajautonotransaksi`: Unique document/transaction number.
- `ajnotransaksi`: Unique document/transaction number.
- `ajtgl`: Transaction date or reference date.
- `ajkodepa`: Business column ajkodepa.
- `ajkontak`: Contact reference or contact person.
- `ajkontakperson`: Contact reference or contact person.
- `ajmorang`: Currency and exchange-rate information.
- `ajkurs`: Currency and exchange-rate information.
- `ajjumlahbayar`: Transaction amount.
- `ajjumlahbayarvalas`: Transaction amount.
- `ajstatusbayar`: Transaction amount.

### Main Relationships

- `m2_aj_detail` -> `m2_aj`: `m2_aj_detail.idaj = m2_aj.ajid`

### Functions

- `m2_aj_v`: Provides document listing or search.
- `m2_aj_getdata`: Retrieves header and detail data for a single transaction document.
- `m2_aj_v_history`: Provides document status-change history listing.
- `m2_aj_getdata_history`: Retrieves header/detail status-change history for a single transaction document.

## RG - Receipt Giro

Incoming giro receipt.

### Tables

- `m2_rg` | alias: `finance_rg` | type: Header | columns: 24
  Finance transaction or reference row for rg.
- `m2_rg_detail` | alias: `finance_rg_detail` | type: Detail | columns: 18
  Detail table for transaction item/row rg detail.
- `m2_rg_detail_history` | alias: `finance_rg_detail_history` | type: History | columns: 20
  Finance detail history table for rg.
- `m2_rg_history` | alias: `finance_rg_history` | type: History | columns: 25
  Finance history table for rg.

### Important Header Columns

- `rgid`: Business column rgid.
- `rgautonotransaksi`: Unique document/transaction number.
- `rgnotransaksi`: Unique document/transaction number.
- `rgtgl`: Transaction date or reference date.
- `rgkodepa`: Business column rgkodepa.
- `rgkontak`: Contact reference or contact person.
- `rgkontakperson`: Contact reference or contact person.
- `rgmorang`: Currency and exchange-rate information.
- `rgkurs`: Currency and exchange-rate information.
- `rgstatusrgc`: Process status or document status.
- `rgstatus`: Process status or document status.
- `rgstatussebelumnya`: Process status or document status.

### Main Relationships

- `m2_rg_detail` -> `m2_rg`: `m2_rg_detail.idrg = m2_rg.rgid`

### Functions

- `m2_rg_v`: Provides document listing or search.
- `m2_rg_getdata`: Retrieves header and detail data for a single transaction document.
- `m2_rg_v_history`: Provides document status-change history listing.
- `m2_rg_getdata_history`: Retrieves header/detail status-change history for a single transaction document.
- `m2_rg_detail_v`: Provides document listing or search.
- `m2_rg_terkait`: Retrieves linkage with other finance documents.
- `m2_rgc_v`: Provides document listing or search.
- `m2_rgc_getdata`: Retrieves header and detail data for a single transaction document.
- `m2_rgc_v_history`: Provides document status-change history listing.
- `m2_rgc_getdata_history`: Retrieves header/detail status-change history for a single transaction document.
- `m2_rgc_terkait`: Retrieves linkage with other finance documents.

## SG - Send Giro

Giro issue / giro handover.

### Tables

- `m2_sg` | alias: `finance_sg` | type: Header | columns: 24
  Finance transaction or reference row for sg.
- `m2_sg_detail` | alias: `finance_sg_detail` | type: Detail | columns: 18
  Detail table for transaction item/row sg detail.
- `m2_sg_detail_history` | alias: `finance_sg_detail_history` | type: History | columns: 20
  Finance detail history table for sg.
- `m2_sg_history` | alias: `finance_sg_history` | type: History | columns: 25
  Finance history table for sg.

### Important Header Columns

- `sgid`: Business column sgid.
- `sgautonotransaksi`: Unique document/transaction number.
- `sgnotransaksi`: Unique document/transaction number.
- `sgtgl`: Transaction date or reference date.
- `sgkodepa`: Business column sgkodepa.
- `sgkontak`: Contact reference or contact person.
- `sgkontakperson`: Contact reference or contact person.
- `sgmorang`: Currency and exchange-rate information.
- `sgkurs`: Currency and exchange-rate information.
- `sgstatussgc`: Process status or document status.
- `sgstatus`: Process status or document status.
- `sgstatussebelumnya`: Process status or document status.

### Main Relationships

- `m2_sg_detail` -> `m2_sg`: `m2_sg_detail.idsg = m2_sg.sgid`

### Functions

- `m2_sg_v`: Provides document listing or search.
- `m2_sg_getdata`: Retrieves header and detail data for a single transaction document.
- `m2_sg_v_history`: Provides document status-change history listing.
- `m2_sg_getdata_history`: Retrieves header/detail status-change history for a single transaction document.
- `m2_sg_detail_v`: Provides document listing or search.
- `m2_sg_terkait`: Retrieves linkage with other finance documents.
- `m2_sgc_v`: Provides document listing or search.
- `m2_sgc_getdata`: Retrieves header and detail data for a single transaction document.
- `m2_sgc_v_history`: Provides document status-change history listing.
- `m2_sgc_getdata_history`: Retrieves header/detail status-change history for a single transaction document.
- `m2_sgc_terkait`: Retrieves linkage with other finance documents.

## RGC - Receipt Giro Cair

Incoming giro clearing.

### Tables

- `m2_rgc` | alias: `finance_rgc` | type: Header | columns: 25
  Finance transaction or reference row for rgc.
- `m2_rgc_detail` | alias: `finance_rgc_detail` | type: Detail | columns: 18
  Detail table for transaction item/row rgc detail.
- `m2_rgc_detail_history` | alias: `finance_rgc_detail_history` | type: History | columns: 20
  Finance detail history table for rgc.
- `m2_rgc_history` | alias: `finance_rgc_history` | type: History | columns: 26
  Finance history table for rgc.

### Important Header Columns

- `rgcid`: Business column rgcid.
- `rgcautonotransaksi`: Unique document/transaction number.
- `rgcnotransaksi`: Unique document/transaction number.
- `rgctgl`: Transaction date or reference date.
- `rgckodepa`: Business column rgckodepa.
- `rgckontak`: Contact reference or contact person.
- `rgckontakperson`: Contact reference or contact person.
- `rgcmorang`: Currency and exchange-rate information.
- `rgckurs`: Currency and exchange-rate information.
- `rgcidrg`: Business column rgcidrg.
- `rgcstatus`: Process status or document status.
- `rgcstatussebelumnya`: Process status or document status.

### Main Relationships

- `m2_rgc_detail` -> `m2_rgc`: `m2_rgc_detail.idrgc = m2_rgc.rgcid`

### Functions

- `m2_rgc_v`: Provides document listing or search.
- `m2_rgc_getdata`: Retrieves header and detail data for a single transaction document.
- `m2_rgc_v_history`: Provides document status-change history listing.
- `m2_rgc_getdata_history`: Retrieves header/detail status-change history for a single transaction document.
- `m2_rgc_terkait`: Retrieves linkage with other finance documents.

## SGC - Send Giro Cair

Outgoing giro clearing.

### Tables

- `m2_sgc` | alias: `finance_sgc` | type: Header | columns: 25
  Finance transaction or reference row for sgc.
- `m2_sgc_detail` | alias: `finance_sgc_detail` | type: Detail | columns: 18
  Detail table for transaction item/row sgc detail.
- `m2_sgc_detail_history` | alias: `finance_sgc_detail_history` | type: History | columns: 20
  Finance detail history table for sgc.
- `m2_sgc_history` | alias: `finance_sgc_history` | type: History | columns: 26
  Finance history table for sgc.

### Important Header Columns

- `sgcid`: Business column sgcid.
- `sgcautonotransaksi`: Unique document/transaction number.
- `sgcnotransaksi`: Unique document/transaction number.
- `sgctgl`: Transaction date or reference date.
- `sgckodepa`: Business column sgckodepa.
- `sgckontak`: Contact reference or contact person.
- `sgckontakperson`: Contact reference or contact person.
- `sgcmorang`: Currency and exchange-rate information.
- `sgckurs`: Currency and exchange-rate information.
- `sgcidsg`: Business column sgcidsg.
- `sgcstatus`: Process status or document status.
- `sgcstatussebelumnya`: Process status or document status.

### Main Relationships

- `m2_sgc_detail` -> `m2_sgc`: `m2_sgc_detail.idsgc = m2_sgc.sgcid`

### Functions

- `m2_sgc_v`: Provides document listing or search.
- `m2_sgc_getdata`: Retrieves header and detail data for a single transaction document.
- `m2_sgc_v_history`: Provides document status-change history listing.
- `m2_sgc_getdata_history`: Retrieves header/detail status-change history for a single transaction document.
- `m2_sgc_terkait`: Retrieves linkage with other finance documents.

## CB - Cash/Bank In Transfer

Cash/bank receipt or transfer transaction with payment allocation.

### Tables

- `m2_cb` | alias: `saldo_awal_coa` | type: Header | columns: 29
  Opening-balance header for accounts/COA at the start of the period. Used to establish balances before journal transactions begin.
- `m2_cb_detail` | alias: `saldo_awal_coa_detail` | type: Detail | columns: 16
  Debit/credit account detail for COA opening-balance transactions. Each row represents an account opened at the start of the period.
- `m2_cb_detail_history` | alias: `finance_cb_detail_history` | type: History | columns: 18
  Finance detail history table for cb.
- `m2_cb_history` | alias: `finance_cb_history` | type: History | columns: 30
  Finance history table for cb.
- `m2_cb_pay` | alias: `finance_cb_pay` | type: Payment/Allocation | columns: 15
  Payment/allocation data related to cb pay.
- `m2_cb_pay_history` | alias: `finance_cb_pay_history` | type: History | columns: 17
  Finance payment/allocation history table for `cb_pay`.

### Important Header Columns

- `cbid`: Primary key for the row.
- `cbautonotransaksi`: Unique document/transaction number.
- `cbnotransaksi`: Unique document/transaction number.
- `cbtgl`: Transaction date or reference date.
- `cbkodepa`: Business column cbkodepa.
- `cbkontak`: Contact reference or contact person.
- `cbkontakperson`: Contact reference or contact person.
- `cbmorang`: Currency and exchange-rate information.
- `cbkurs`: Currency and exchange-rate information.
- `cbjumlahbayar`: Transaction amount.
- `cbjumlahbayarvalas`: Transaction amount.
- `cbstatusbayar`: Transaction amount.

### Main Relationships

- `m2_cb_detail` -> `m2_cb`: `m2_cb_detail.idcb = m2_cb.cbid`
- `m2_cb_pay` -> `m2_cb`: `m2_cb_pay.idcb = m2_cb.cbid`

### Functions

- `m2_cb_v`: Provides document listing or search.
- `m2_cb_getdata`: Retrieves header and detail data for a single transaction document.
- `m2_cb_pay_v`: Provides document listing or search.
- `m2_cb_v_history`: Provides document status-change history listing.
- `m2_cb_getdata_history`: Retrieves header/detail status-change history for a single transaction document.
- `m2_cb_pay_v_history`: Provides document status-change history listing.
- `m2_cb_terkait`: Retrieves linkage with other finance documents.

## BD - Bank Disbursement

Bank disbursement / payment through bank.

### Tables

- `m2_bd` | alias: `finance_bd` | type: Header | columns: 29
  Finance transaction or reference row for bd.
- `m2_bd_detail` | alias: `finance_bd_detail` | type: Detail | columns: 14
  Detail table for transaction item/row bd detail.
- `m2_bd_detail_history` | alias: `finance_bd_detail_history` | type: History | columns: 16
  Finance detail history table for bd.
- `m2_bd_history` | alias: `finance_bd_history` | type: History | columns: 30
  Finance history table for bd.

### Important Header Columns

- `bdid`: Business column bdid.
- `bdautonotransaksi`: Unique document/transaction number.
- `bdnotransaksi`: Unique document/transaction number.
- `bdtgl`: Transaction date or reference date.
- `bdtglanggaran`: Business column bdtglanggaran.
- `bdkodepa`: Business column bdkodepa.
- `bdkontak`: Contact reference or contact person.
- `bdkontakperson`: Contact reference or contact person.
- `bdmorang`: Currency and exchange-rate information.
- `bdkurs`: Currency and exchange-rate information.
- `bdstatus`: Process status or document status.
- `bdstatussebelumnya`: Process status or document status.

### Main Relationships

- `m2_bd_detail` -> `m2_bd`: `m2_bd_detail.idbd = m2_bd.bdid`

## JM - Memorial Journal

Memorial journal.

### Tables

- `m2_jm` | alias: `finance_jm` | type: Header | columns: 28
  Finance transaction or reference row for jm.
- `m2_jm_detail` | alias: `finance_jm_detail` | type: Detail | columns: 17
  Detail table for transaction item/row jm detail.
- `m2_jm_detail_history` | alias: `finance_jm_detail_history` | type: History | columns: 19
  Finance detail history table for jm.
- `m2_jm_history` | alias: `finance_jm_history` | type: History | columns: 29
  Finance history table for jm.

### Important Header Columns

- `jmid`: Business column jmid.
- `jmautonotransaksi`: Unique document/transaction number.
- `jmnotransaksi`: Unique document/transaction number.
- `jmtgl`: Transaction date or reference date.
- `jmkodepa`: Business column jmkodepa.
- `jmkontakperson`: Contact reference or contact person.
- `jmmorang`: Currency and exchange-rate information.
- `jmkurs`: Currency and exchange-rate information.
- `jmjumlahbayar`: Transaction amount.
- `jmjumlahbayarvalas`: Transaction amount.
- `jmstatusbayar`: Transaction amount.
- `jmtgllunas`: Transaction date or reference date.

### Main Relationships

- `m2_jm_detail` -> `m2_jm`: `m2_jm_detail.idjm = m2_jm.jmid`

### Functions

- `m2_jm_v`: Provides document listing or search.
- `m2_jm_getdata`: Retrieves header and detail data for a single transaction document.
- `m2_jm_v_history`: Provides document status-change history listing.
- `m2_jm_getdata_history`: Retrieves header/detail status-change history for a single transaction document.

## GIRO - Giro List

List of incoming/outgoing giro documents and their statuses.

### Tables

- `m2_giro_list` | alias: `finance_giro_list` | type: Header | columns: 19
  Finance transaction or reference row for giro list.

### Important Header Columns

- `glidtransaction`: Business column glidtransaction.
- `glnotransaksi`: Unique document/transaction number.
- `glkontak`: Contact reference or contact person.
- `glmorang`: Currency and exchange-rate information.
- `glkurs`: Currency and exchange-rate information.
- `gltgljthtempo`: Business column gltgljthtempo.
- `gltglcair`: Business column gltglcair.
- `glstatus`: Process status or document status.
- `glstatussebelumnya`: Process status or document status.
- `glnogiro`: Business column glnogiro.

### Functions

- `m2_giro_list_v`: Provides document listing or search.
- `m2_giro_list_app`: Finance semantic function from the query layer.
- `m2_giro_list_cd`: Finance semantic function from the query layer.

## TRANSACTION - Transaction Journal

Posted ledger/journal transaction table for finance.

### Tables

- `m2_transaction_journal` | alias: `finance_transaction_journal` | type: Header | columns: 45
  Finance transaction or reference row for transaction journal.

### Important Header Columns

- `tid`: Business column tid.
- `tkodetabelangka`: Business column tkodetabelangka.
- `tidtransaksi`: Business column tidtransaksi.
- `tnotransaksi`: Unique document/transaction number.
- `ttgl`: Transaction date or reference date.
- `tkodepa`: Business column tkodepa.
- `tkontak`: Contact reference or contact person.
- `tnorek`: Business column tnorek.
- `tmorang`: Currency and exchange-rate information.
- `tkurs`: Currency and exchange-rate information.
- `tcarabayar`: Transaction amount.
- `ttgljatuhtempo`: Business column ttgljatuhtempo.

### Main Relationships

- `m2_transaction_journal` stores posted journals across finance document sources using `tsumber`, `tidtransaksi`, and `tnotransaksi`.

### Functions

- `m2_transaction_journal_voucher`: Finance semantic function from the query layer.

## REALIZATION - Budget Realization

Aggregate realization tables for branch, cost center, division, project, and subdivision reporting.

### Tables

- `m2_realization` | alias: `finance_realization` | type: Header | columns: 7
  Finance transaction or reference row for realization.
- `m2_realization_branch` | alias: `finance_realization_branch` | type: Header | columns: 8
  Finance transaction or reference row for realization branch.
- `m2_realization_cost_center` | alias: `finance_realization_cost_center` | type: Header | columns: 8
  Finance transaction or reference row for realization cost center.
- `m2_realization_division` | alias: `finance_realization_division` | type: Header | columns: 8
  Finance transaction or reference row for realization division.
- `m2_realization_location` | alias: `finance_realization_location` | type: Header | columns: 8
  Finance transaction or reference row for realization location.
- `m2_realization_project` | alias: `finance_realization_project` | type: Header | columns: 8
  Finance transaction or reference row for realization project.
- `m2_realization_subdivision` | alias: `finance_realization_subdivision` | type: Header | columns: 8
  Finance transaction or reference row for realization subdivision.

### Important Header Columns

- `rnorek`: Business column rnorek.
- `rkodepa`: Business column rkodepa.
- `rtahun`: Business column rtahun.
- `rbulan`: Business column rbulan.
- `rjmldebit`: Transaction amount.
- `rjmlkredit`: Transaction amount.
- `ranggaran`: Business column ranggaran.

### Main Relationships

- `m2_realization_*` menyimpan agregasi realization per dimensi organisasi seperti branch, cost center, division, location, project, and subdivision.

## NOTES - Notes Finance

Notes teks for transaction finance.

### Tables

- `m2_notes` | alias: `finance_notes` | type: Auxiliary | columns: 8
  Tables utilitas/notes finance for notes.

### Functions

- `m2_notes_v`: Provides document listing or search.

## FILES - Attachments Finance

Attachments file transaction finance.

### Tables

- `m2_files` | alias: `finance_files` | type: Auxiliary | columns: 8
  Tables utilitas/attachments finance for files.

### Functions

- `m2_files_v`: Provides document listing or search.
