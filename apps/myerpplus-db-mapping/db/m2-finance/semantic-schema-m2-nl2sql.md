# M2 NL2SQL Guide

Primary sources:
- `semantic-schema-m2.json`
- `semantic-schema-m2-summary.md`
- `m2-queries.md`

Purpose:
- help select the correct M2 finance and accounting tables
- clarify safe joins across cash, bank, giro, memo, and journal documents
- provide natural business synonyms for retrieval
- make header, detail, allocation, and posted-journal boundaries explicit

## Main Table Coverage

- `m2_cr`, `m2_cr_detail`: cash receipt
- `m2_cd`, `m2_cd_detail`: cash disbursement
- `m2_bd`, `m2_bd_detail`: bank disbursement
- `m2_cb`, `m2_cb_detail`, `m2_cb_pay`: cash and bank transfer plus payment allocation
- `m2_rm`, `m2_rm_detail`, `m2_rm_pay`: receipt memo plus payment allocation
- `m2_sm`, `m2_sm_detail`, `m2_sm_pay`: send memo plus payment allocation
- `m2_rg`, `m2_rg_detail`: receipt giro
- `m2_rgc`, `m2_rgc_detail`: clearing of receipt giro
- `m2_sg`, `m2_sg_detail`: send giro
- `m2_sgc`, `m2_sgc_detail`: clearing of send giro
- `m2_gj`, `m2_gj_detail`: general journal
- `m2_aj`, `m2_aj_detail`: adjustment journal
- `m2_jm`, `m2_jm_detail`: memorial journal
- `m2_transaction_journal`: posted transaction journal
- `m2_accounting_period`: accounting period
- `m2_realization*`: budget realization by dimension
- `m2_files`: finance transaction attachments
- `m2_notes`: finance transaction notes

## Business Synonyms

- `CR`: cash receipt
- `CD`: cash disbursement
- `BD`: bank disbursement
- `CB`: cash bank transfer
- `RM`: receipt memo
- `SM`: send memo
- `RG`: receipt giro
- `RGC`: receipt giro clearing
- `SG`: send giro
- `SGC`: send giro clearing
- `GJ`: general journal
- `AJ`: adjustment journal
- `JM`: memorial journal
- `AP`: accounting period

## Primary Join Hints

### cash_receipt_flow

```sql
m2_cr.crid = m2_cr_detail.idcr
```

### cash_disbursement_flow

```sql
m2_cd.cdid = m2_cd_detail.idcd
```

### bank_disbursement_flow

```sql
m2_bd.bdid = m2_bd_detail.idbd
```

### receipt_memo_allocation_flow

```sql
m2_rm.rmid = m2_rm_detail.idrm
m2_rm.rmid = m2_rm_pay.idrm
```

### send_memo_allocation_flow

```sql
m2_sm.smid = m2_sm_detail.idsm
m2_sm.smid = m2_sm_pay.idsm
```

### cash_bank_transfer_flow

```sql
m2_cb.cbid = m2_cb_detail.idcb
m2_cb.cbid = m2_cb_pay.idcb
```

### receipt_giro_flow

```sql
m2_rg.rgid = m2_rg_detail.idrg
m2_rgc.rgcid = m2_rgc_detail.idrgc
```

### send_giro_flow

```sql
m2_sg.sgid = m2_sg_detail.idsg
m2_sgc.sgcid = m2_sgc_detail.idsgc
```

### posted_journal_flow

```sql
m2_transaction_journal.tidtransaksi = finance document id
m2_transaction_journal.tsumber = finance source code
```

## Important Additional Relations

### contact_reference

```sql
m2_cr.crkontak = m1_contact.kid
m2_cd.cdkontak = m1_contact.kid
m2_bd.bdkontak = m1_contact.kid
m2_rm.rmkontak = m1_contact.kid
m2_sm.smkontak = m1_contact.kid
m2_rg.rgkontak = m1_contact.kid
m2_sg.sgkontak = m1_contact.kid
```

### account_reference

```sql
m2_cr_detail.idcoa = m0_chart_of_account.raid
m2_cd_detail.idcoa = m0_chart_of_account.raid
m2_bd_detail.idcoa = m0_chart_of_account.raid
m2_gj_detail.idcoa = m0_chart_of_account.raid
m2_aj_detail.idcoa = m0_chart_of_account.raid
m2_jm_detail.idcoa = m0_chart_of_account.raid
```

## Polymorphic Relations

- No explicit polymorphic relationships were detected in active M2 schema and queries.

## Cross-Document Lineage Keys

This section is important for the AI agent because M2 questions often depend on a strict separation between header rows, accounting detail rows, allocation rows, and posted journals.

- `m2_cr_detail.idcr -> m2_cr.crid`
  Used when cash-receipt detail lines must be traced to the document header.
- `m2_cd_detail.idcd -> m2_cd.cdid`
  Used when cash-disbursement detail lines must be traced to the document header.
- `m2_bd_detail.idbd -> m2_bd.bdid`
  Used when bank-disbursement detail lines must be traced to the document header.
- `m2_rm_detail.idrm -> m2_rm.rmid`
  Used when receipt-memo accounting lines must be traced to the memo header.
- `m2_rm_pay.idrm -> m2_rm.rmid`
  Used when receipt-memo payment allocations must be traced to the memo header.
- `m2_sm_detail.idsm -> m2_sm.smid`
  Used when send-memo accounting lines must be traced to the memo header.
- `m2_sm_pay.idsm -> m2_sm.smid`
  Used when send-memo payment allocations must be traced to the memo header.
- `m2_cb_detail.idcb -> m2_cb.cbid`
  Used when cash-bank transfer detail lines must be traced to the transfer header.
- `m2_cb_pay.idcb -> m2_cb.cbid`
  Used when transfer allocation rows must be traced to the transfer header.
- `m2_rg_detail.idrg -> m2_rg.rgid`
  Used when receipt-giro lines must be traced to the giro header.
- `m2_rgc_detail.idrgc -> m2_rgc.rgcid`
  Used when receipt-giro clearing lines must be traced to the clearing header.
- `m2_sg_detail.idsg -> m2_sg.sgid`
  Used when send-giro lines must be traced to the giro header.
- `m2_sgc_detail.idsgc -> m2_sgc.sgcid`
  Used when send-giro clearing lines must be traced to the clearing header.
- `m2_transaction_journal.tidtransaksi + m2_transaction_journal.tsumber -> finance document header`
  Used when a posted journal must be traced back to its source document.

Practical rules:

- start from detail tables or `_pay` tables when the question is about distribution, allocation, or line-level amounts
- move to the header only after the source document foreign key is known
- for posted journals, do not rely on `tidtransaksi` alone; always read `tsumber`
- do not mix memo detail and payment allocation without separating `_detail` from `_pay`

## Table Selection Rules

- Use header tables when the question is about document number, date, contact, bank or cash account, currency, total amount, or posting status.
- Use detail tables when the question is about accounts, per-line amounts, journal distribution, or memo detail.
- Use `_pay` tables when the question is about payment allocation, settlement, or memo transfer allocation.
- Use `_history` tables only when the user explicitly asks for document history, audit changes, or older versions.
- Use `m2_transaction_journal` when the question is about posted journals produced by finance documents.
- Use `m2_realization*` tables when the question is about budget realization by branch, location, division, project, or cost center.

## Important Rules

- M2 does not have explicit polymorphic relationships. Prefer direct foreign keys visible in active joins.
- For cash and bank analysis, start from headers and join details only when the user needs account or distribution breakdown.
- For memo or transfer allocation analysis, use `_pay` tables so allocation values are not mistaken for header totals.
- For giro analysis, distinguish the giro document (`RG`, `SG`) from its clearing document (`RGC`, `SGC`).
- For journals, distinguish manual journal input (`GJ`, `AJ`, `JM`) from posted transaction journals (`m2_transaction_journal`).
- `customtext*`, `customint*`, `customdbl*`, and `customdate*` are extension fields. Avoid them unless explicitly requested.

## Safe Query Patterns

### finance_document_overview

Use only the header table:

```sql
SELECT crnotransaksi, crtgl, crkontak, crjumlahbayar
FROM m2_cr
```

### account_distribution_per_document

Join header to detail:

```sql
SELECT gj.gjnotransaksi, gjd.idcoa, gjd.jmldebet, gjd.jmlkredit
FROM m2_gj gj
JOIN m2_gj_detail gjd ON gjd.idgj = gj.gjid
```

### memo_with_allocation

Use:

```sql
RM -> RM_DETAIL -> RM_PAY
SM -> SM_DETAIL -> SM_PAY
CB -> CB_DETAIL -> CB_PAY
```

### giro_and_clearing

Use:

```sql
RG -> RG_DETAIL
RGC -> RGC_DETAIL
SG -> SG_DETAIL
SGC -> SGC_DETAIL
```

### posted_journal_trace

Use:

```sql
DOCUMENT -> m2_transaction_journal
```

## Queries That Need Extra Caution

- questions that mix memo headers with payment allocation but do not use `_pay`
- questions that mix giro documents with clearing documents without separating `RG/RGC` or `SG/SGC`
- questions that mix `GJ`, `AJ`, `JM`, and `m2_transaction_journal`
- questions that mix active tables and `_history`
- questions that rely on `custom*`

## NL2SQL Checklist for M2

- decide header vs detail first
- check whether `_pay` tables are required
- distinguish cash, bank, giro, memo, and journal documents
- use `m1_contact`, `m0_chart_of_account`, `m1_branch`, `m1_location`, `m1_division`, and `m1_project` when master labels are needed
- for giro clearing, use the dedicated clearing tables instead of the original giro document alone
- for audit history, move to `_history` tables
