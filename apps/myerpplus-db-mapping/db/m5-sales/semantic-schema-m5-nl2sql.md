# M5 NL2SQL Guide

Primary sources:

- `semantic-schema-m5.json`
- `m0_report_rmoduleid_5.md`
- `m5-queries.md`

Purpose:

- help choose the correct M5 tables
- help choose safe joins
- mark polymorphic relations that must be interpreted together with `sumber`
- provide natural business synonyms for retrieval and prompting

## Main Table Coverage

- `m5_sq`, `m5_sq_detail`: sales quotation
- `m5_so`, `m5_so_detail`: sales order
- `m5_pl`, `m5_pl_detail`, `m5_pl_pack`: packing list and packing preparation
- `m5_do`, `m5_do_detail`: delivery order
- `m5_dr`, `m5_dr_detail`: delivery receipt / delivery result
- `m5_pi`, `m5_pi_detail`: proforma invoice
- `m5_si`, `m5_si_detail`, `m5_si_pay`, `m5_si_installment`, `m5_si_material`, `m5_si_cost`: final sales invoice and related tables
- `m5_rnr`, `m5_rnr_detail`: returned goods receipt
- `m5_sr`, `m5_sr_detail`: sales return
- `m5_as`, `m5_as_pay`: advance sales
- `m5_ip`, `m5_ip_pay`: incoming payment
- `m5_ic`, `m5_ic_detail`: invoice collection / receivable collection
- `m5_pv`, `m5_pv_detail`: payment voucher
- `m5_rp`, `m5_rp_pay`: shipping-charge receivable or additional receivable
- `m5_spa`, `m5_spa_detail`: sales point adjustment
- `m5_sie`, `m5_sie_detail`: sales invoice exchange
- `m5_cl`: sales closing / sales realization status
- `m5_files`: attachment tables
- `m5_notes`: transaction notes

## Business Synonyms

- `SQ`: sales quotation
- `SO`: sales order
- `PL`: packing list
- `DO`: delivery order
- `DR`: delivery receipt / delivery result
- `PI`: proforma invoice
- `SI`: sales invoice
- `RNR`: receipt note return
- `SR`: sales return
- `AS`: advance sales
- `IP`: incoming payment
- `IC`: invoice collection
- `PV`: payment voucher
- `RP`: shipping charge receivable
- `SPA`: sales point adjustment
- `SIE`: sales invoice exchange
- `CL`: sales closing / sales realization status

## Primary Join Hints

### Sales document flow

```sql
m5_sq.sqid = m5_sq_detail.idsq
m5_sq_detail.idsqdetail = m5_so_detail.idsqdetail
m5_so.soid = m5_so_detail.idso
m5_so_detail.idsodetail = m5_pl_detail.idsodetail
m5_pl.plid = m5_pl_detail.idpl
m5_so_detail.idsodetail = m5_do_detail.idsodetail
m5_do.doid = m5_do_detail.iddo
m5_do_detail.iddodetail = m5_dr_detail.iddodetail
m5_pi.piid = m5_pi_detail.idpi
m5_si.siid = m5_si_detail.idsi
m5_rnr.rnrid = m5_rnr_detail.idrnr
m5_sr.srid = m5_sr_detail.idsr
```

## Cross-Document Lineage Keys

This section is important for the AI agent. In M5, document relations are often not safe enough when read only from headers. Many traces should start from **foreign keys stored in detail tables**.

### General rules

- if the question says "which SO did this invoice come from", start from `m5_si_detail`, not `m5_si`
- if the question says "which PI or SO did this delivery come from", start from `m5_do_detail`
- if the question says "which invoice or receipt did this return come from", start from `m5_sr_detail` or `m5_rnr_detail`
- if one detail row has multiple lineage columns, prioritize the column closest to the document explicitly asked by the user

### Sales invoice to sales order

```sql
m5_si_detail.idsodetail -> m5_so_detail.idsodetail
m5_so_detail.idso -> m5_so.soid
```

Business meaning:

- one sales invoice row can be traced back to its source sales-order row
- to get the SO number, do not join `m5_si` directly to `m5_so`
- the safe route is `m5_si_detail -> m5_so_detail -> m5_so`

### Sales invoice to delivery order

```sql
m5_si_detail.iddodetail -> m5_do_detail.iddodetail
m5_do_detail.iddo -> m5_do.doid
```

Business meaning:

- if the invoice is formed from shipment, the DO number is usually traced from invoice detail
- use this for questions such as "which delivery order was used by this invoice"

### Sales invoice to packing list

```sql
m5_si_detail.idpldetail -> m5_pl_detail.idpldetail
m5_pl_detail.idpl -> m5_pl.plid
```

### Sales invoice to proforma invoice

```sql
m5_si_detail.idpidetail -> m5_pi_detail.idpidetail
m5_pi_detail.idpi -> m5_pi.piid
```

### Sales invoice to delivery receipt

```sql
m5_si_detail.iddrdetail -> m5_dr_detail.iddrdetail
m5_dr_detail.iddr -> m5_dr.drid
```

### Delivery order to sales order

```sql
m5_do_detail.idsodetail -> m5_so_detail.idsodetail
m5_so_detail.idso -> m5_so.soid
```

### Delivery order to proforma invoice

```sql
m5_do_detail.idpidetail -> m5_pi_detail.idpidetail
m5_pi_detail.idpi -> m5_pi.piid
```

### Delivery receipt to delivery order

```sql
m5_dr_detail.iddodetail -> m5_do_detail.iddodetail
m5_do_detail.iddo -> m5_do.doid
```

### Delivery receipt to sales invoice

```sql
m5_dr_detail.idsidetail -> m5_si_detail.idsidetail
m5_si_detail.idsi -> m5_si.siid
```

### Receipt note return to sales invoice

```sql
m5_rnr_detail.idsidetail -> m5_si_detail.idsidetail
m5_si_detail.idsi -> m5_si.siid
```

### Sales return to sales invoice

```sql
m5_sr_detail.idsidetail -> m5_si_detail.idsidetail
m5_si_detail.idsi -> m5_si.siid
```

### Sales return to receipt note return

```sql
m5_sr_detail.idrnrdetail -> m5_rnr_detail.idrnrdetail
m5_rnr_detail.idrnr -> m5_rnr.rnrid
```

## Detail-Level Cross References

```sql
m5_pi_detail.idsqdetail = m5_sq_detail.idsqdetail
m5_pi_detail.idsodetail = m5_so_detail.idsodetail
m5_pi_detail.idpldetail = m5_pl_detail.idpldetail
m5_pl_detail.idpidetail = m5_pi_detail.idpidetail
m5_do_detail.idpidetail = m5_pi_detail.idpidetail
m5_dr_detail.idpidetail = m5_pi_detail.idpidetail
m5_rnr_detail.idsidetail = m5_si_detail.idsidetail
m5_sr_detail.idsidetail = m5_si_detail.idsidetail
m5_sr_detail.idrnrdetail = m5_rnr_detail.idrnrdetail
```

## Receivable And Payment Flow

```sql
m5_ic.icid = m5_ic_detail.idic
m5_pv.pvid = m5_pv_detail.idpv
m5_pv_detail.idicdetail = m5_ic_detail.idicdetail
m5_rp.rpid = m5_rp_pay.idrp
m5_rp.rpidsi = m5_si.siid
m5_as.asid = m5_as_pay.idas
m5_ip.ipid = m5_ip_pay.idip
m5_as.asidip = m5_ip.ipid
m5_si.siidas = m5_as.asid
```

## Master Data Cross-Module Relations

```sql
m5_sq.sqcustomer = m1_contact.kid
m5_so.socustomer = m1_contact.kid
m5_do.docustomer = m1_contact.kid
m5_dr.drcustomer = m1_contact.kid
m5_pi.picustomer = m1_contact.kid
m5_si.sicustomer = m1_contact.kid
m5_rnr.rnrcustomer = m1_contact.kid
m5_sr.srcustomer = m1_contact.kid
m5_ic.iccustomer = m1_contact.kid
m5_pv.pvcustomer = m1_contact.kid
m5_rp.rpkontak = m1_contact.kid
m5_spa_detail.kontak = m1_contact.kid
```

```sql
m5_sq_detail.idbarang = m1_item.bid
m5_so_detail.idbarang = m1_item.bid
m5_pl_detail.idbarang = m1_item.bid
m5_do_detail.idbarang = m1_item.bid
m5_dr_detail.idbarang = m1_item.bid
m5_pi_detail.idbarang = m1_item.bid
m5_si_detail.idbarang = m1_item.bid
m5_si_material.idbarang = m1_item.bid
m5_rnr_detail.idbarang = m1_item.bid
m5_sr_detail.idbarang = m1_item.bid
```

## POS To Formal Sales Invoice

```sql
m_12_pos_voucher_out.voidtransaksi = m5_si.siid
```

Business meaning:

- a POS voucher that is truly consumed by a formal sales invoice points to `m5_si`
- use this relation when the user asks which sales invoice consumed a POS voucher

## Sales Boundary To Finance

- M5 is the domain of commercial sales documents and operational receivables
- if the user asks about posting journals, cash/bank, or ledger impact, identify the relevant M5 document first and then move to M2
- do not invent one direct global join `M5 -> M2` when the active source does not provide an explicit FK

## Sales Boundary To Inventory

- DO, DR, RNR, and SR are operational document sources for outbound goods, customer receipt, returned goods, and goods coming back
- if the user asks about stock movement, warehouse balance, or inventory impact, identify the relevant sales document first and then move to M3
- do not use M5 alone to answer formal inventory-balance questions

## Table Selection Rules

- use header tables for document number, date, customer, warehouse, status, and commercial context
- use detail tables for item rows, quantity, price, lineage tracing, and document conversion analysis
- use `_pay` and collection tables for receivable settlement or payment allocation
- use `_history` tables only when the user explicitly asks for audit trail or document history
- always prefer detail-to-detail lineage over guessed header-to-header joins

## Safe Query Patterns

### Sales document flow lookup

Start from the detail table closest to the requested document, then climb to the needed header.

### Receivable aging

Start from `m5_si`, optionally join settlement tables such as `m5_ic_detail`, `m5_pv_detail`, `m5_as_pay`, or `m5_ip_pay` only when the question truly needs collection or payment context.

### Return tracing

Start from `m5_sr_detail` or `m5_rnr_detail`, then trace back to `m5_si_detail`, and only then move to the invoice header.

## Extra Caution

- questions that mix sales document flow with finance posting impact in one jump
- questions that ask for source-document lineage but only mention header numbers
- questions that assume one invoice always comes from one SO header without checking detail lineage
- questions that combine POS vouchers with sales invoices without using `m_12_pos_voucher_out`
