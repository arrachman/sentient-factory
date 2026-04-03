# M4 NL2SQL Guide

Primary sources:
- `semantic-schema-m4.json`
- `semantic-schema-m4-summary.md`
- `m4-queries.md`

Purpose:
- help select the correct M4 purchasing tables
- clarify safe joins across purchasing document stages
- make polymorphic payment relations explicit
- provide natural business synonyms for retrieval

## Main Table Coverage

- `m4_pr`, `m4_pr_detail`: purchase request
- `m4_rq`, `m4_rq_detail`: request quotation
- `m4_rfq`, `m4_rfq_detail`: request for quotation
- `m4_cs`, `m4_cs_detail`: comparative sheet
- `m4_bs`, `m4_bs_detail`: bid selection
- `m4_po`, `m4_po_detail`: purchase order
- `m4_grn`, `m4_grn_detail`: goods receipt note
- `m4_ri`, `m4_ri_detail`, `m4_ri_pay`: receive invoice
- `m4_dnr`, `m4_dnr_detail`: debit note return
- `m4_prt`, `m4_prt_detail`: purchase return
- `m4_ap`, `m4_ap_pay`: advance purchase
- `m4_pp`, `m4_pp_pay`: purchase payment
- `m4_vpp`, `m4_vpp_detail`, `m4_vpp_pay`: vendor payment proposal
- `m4_vp`, `m4_vp_detail`, `m4_vp_pay`: vendor payment
- `m4_ipc`, `m4_ipc_detail`: incoming purchase cost
- `m4_pie`, `m4_pie_detail`: purchase invoice exchange

## Business Synonyms

- `PR`: purchase request
- `RQ`: request quotation
- `RFQ`: request for quotation, supplier RFQ
- `CS`: comparative sheet
- `BS`: bid selection
- `PO`: purchase order
- `GRN`: goods receipt note
- `RI`: receive invoice, purchase invoice
- `DNR`: debit note return
- `PRT`: purchase return
- `AP`: advance purchase, purchase advance
- `PP`: purchase payment
- `VPP`: vendor payment proposal
- `VP`: vendor payment
- `IPC`: incoming purchase cost, landed cost
- `PIE`: purchase invoice exchange

## Primary Join Hints

### request_to_purchase_order_flow

```sql
m4_pr.prid = m4_pr_detail.idpr
m4_pr_detail.idprdetail = m4_rq_detail.idprdetail
m4_rq.rqid = m4_rq_detail.idrq
m4_rq_detail.idrqdetail = m4_bs_detail.idrqdetail
m4_bs.bsid = m4_bs_detail.idbs
m4_po.poid = m4_po_detail.idpo
```

### order_to_receipt_to_invoice_flow

```sql
m4_po.poid = m4_po_detail.idpo
m4_po_detail.idpodetail = m4_grn_detail.idpodetail
m4_grn.grnid = m4_grn_detail.idgrn
m4_grn_detail.idgrndetail = m4_ri_detail.idgrndetail
m4_ri.riid = m4_ri_detail.idri
```

### return_flow

```sql
m4_ri.riid = m4_ri_detail.idri
m4_ri_detail.idridetail = m4_dnr_detail.idridetail
m4_dnr.dnrid = m4_dnr_detail.iddnr
m4_dnr_detail.iddnrdetail = m4_prt_detail.iddnrdetail
m4_prt.prtid = m4_prt_detail.idprt
```

### advance_and_purchase_payment_flow

```sql
m4_po.poid = m4_ap.apidpo
m4_ap.apid = m4_ap_pay.idap
m4_ri.riidap = m4_ap.apid
m4_pp.ppid = m4_pp_pay.idpp
```

### proposal_and_vendor_payment_flow

```sql
m4_vpp.vppid = m4_vpp_detail.idvpp
m4_vp.vpid = m4_vp_detail.idvp
m4_vpp_pay.idvpp = m4_vpp.vppid
m4_vp_pay.idvp = m4_vp.vpid
```

### comparative_sheet_and_vendor_selection_flow

```sql
m4_pr.prid = m4_cs.csidpr
m4_cs.csid = m4_cs_detail.idcs
m4_rq.rqid = m4_rq_detail.idrq
m4_rq.idcs = m4_cs.csid
m4_bs_detail.idrqdetail = m4_rq_detail.idrqdetail
```

### purchase_invoice_exchange_flow

```sql
m4_pie.pieid = m4_pie_detail.idpie
m4_pie.idri = m4_ri.riid
```

## Cross-Document Lineage Keys

In M4, purchasing flow should usually be traced from detail tables. The AI agent should not jump straight from header to header when a more explicit detail foreign key exists.

### Purchase Request to Request Quotation

```sql
m4_rq_detail.idprdetail -> m4_pr_detail.idprdetail
m4_pr_detail.idpr -> m4_pr.prid
```

### Request Quotation to Bid Selection

```sql
m4_bs_detail.idrqdetail -> m4_rq_detail.idrqdetail
m4_rq_detail.idrq -> m4_rq.rqid
```

### Purchase Order to Goods Receipt

```sql
m4_grn_detail.idpodetail -> m4_po_detail.idpodetail
m4_po_detail.idpo -> m4_po.poid
```

### Goods Receipt to Receive Invoice

```sql
m4_ri_detail.idgrndetail -> m4_grn_detail.idgrndetail
m4_grn_detail.idgrn -> m4_grn.grnid
```

### Receive Invoice to Debit Note Return

```sql
m4_dnr_detail.idridetail -> m4_ri_detail.idridetail
m4_ri_detail.idri -> m4_ri.riid
```

### Debit Note Return to Purchase Return

```sql
m4_prt_detail.iddnrdetail -> m4_dnr_detail.iddnrdetail
m4_dnr_detail.iddnr -> m4_dnr.dnrid
```

Practical rules:

- if the user asks which GRN produced a purchase invoice, start from `m4_ri_detail`
- if the user asks which invoice produced a purchase return, start from `m4_prt_detail` or `m4_dnr_detail`
- use the header only after the source detail foreign key identifies the upstream document

## Polymorphic Relations

### `m4_vpp_detail`

Use `sumber` to decide the target of `idtransaksi`:

```sql
sumber = 'AP' -> m4_ap.apid
sumber = 'RI' -> m4_ri.riid
sumber = 'PRT' -> m4_prt.prtid
```

### `m4_vp_detail`

Use `sumber` to decide the target of `idtransaksi`:

```sql
sumber = 'AP' -> m4_ap.apid
sumber = 'RI' -> m4_ri.riid
sumber = 'PRT' -> m4_prt.prtid
```

### `m4_pie_detail`

Use `sumber` to decide the target of `idtransaksi`:

```sql
sumber follows the purchasing source document used in the exchange transaction
```

## Table Selection Rules

- Use header tables when the question is about document number, date, supplier, status, total amount, or document-level summary.
- Use detail tables when the question is about item, quantity, price, vendor comparison, or goods realization progress.
- Use `_history` tables only when the user explicitly asks for document history, audit changes, or old versions.
- Use `m4_cs` and `m4_bs` when the question is about vendor evaluation, quotation comparison, or selected vendors.
- Use `m4_vpp` or `m4_vp` when the question is about payment proposals and realized vendor payments.
- Use `m4_ipc` when the question is about additional purchasing cost or landed cost.
- Use `m4_pie` when the question is about purchase invoice exchange or regrouping.

## Important Rules

- `idtransaksi` in `m4_vpp_detail`, `m4_vp_detail`, and `m4_pie_detail` must never be joined without checking `sumber`.
- For vendor-payment flow, distinguish proposals (`m4_vpp`) from realized payments (`m4_vp`).
- For supplier analysis, prefer joins to `m1_contact`.
- For item analysis, prefer joins to `m1_item`.
- `customtext*`, `customint*`, `customdbl*`, and `customdate*` are extension fields. Avoid them unless explicitly requested.
- Many legacy M4 queries use history tables and close or posting states. Apply status filters only when the user explicitly needs them or the semantic schema documents them.

## Safe Query Patterns

### purchasing_document_overview

Use only the header table:

```sql
SELECT ponotransaksi, potgl, posupplier, postatus, pototaltransaksi
FROM m4_po
```

### item_per_document

Join header to detail:

```sql
SELECT po.ponotransaksi, pod.idbarang, pod.namabarang, pod.jmlbarang
FROM m4_po po
JOIN m4_po_detail pod ON pod.idpo = po.poid
```

### purchasing_flow_trace

Use:

```sql
PR_DETAIL -> RQ_DETAIL -> BS_DETAIL -> PO_DETAIL -> GRN_DETAIL -> RI_DETAIL -> DNR_DETAIL -> PRT_DETAIL
```

### purchase_return_trace

Use:

```sql
RI -> RI_DETAIL -> DNR_DETAIL -> PRT_DETAIL
```

### vendor_payment_trace

Use:

```sql
VPP -> VPP_DETAIL -> VP_DETAIL -> VP
```

## Queries That Need Extra Caution

- questions that traverse `AP`, `RI`, and `PRT` through `m4_vpp_detail`
- questions about vendor payment that rely on `m4_vp_detail.idtransaksi`
- questions about purchase invoice exchange that rely on `m4_pie_detail.idtransaksi`
- questions that mix active tables and `_history`
- questions that rely on `custom*`

## NL2SQL Checklist for M4

- decide header vs detail first
- check whether the relation also requires `sumber`
- use the known purchasing flow joins
- use `m1_contact`, `m1_item`, `m1_branch`, and `m1_location` when master labels are needed
- distinguish payment proposals from realized payments
- avoid assumptions based on `custom*`
