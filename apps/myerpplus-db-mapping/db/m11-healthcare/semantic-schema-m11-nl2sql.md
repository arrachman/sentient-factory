# M11 NL2SQL Guide

Primary sources:
- `semantic-schema-m11.json`
- `semantic-schema-m11-summary.md`
- `m11-queries.md`
- `m0_report_rmoduleid_11.sql`

Purpose:
- help select the correct healthcare tables
- trace patient visits, billing, services, laboratory flow, and medical records
- provide read-only guardrails for the healthcare domain

## Main Table Coverage

- document_headers: `m_11_ak`, `m_11_ilo`, `m_11_isk`, `m_11_kj`, `m_11_km`, `m_11_kw`, `m_11_lb`, `m_11_lu`, `m_11_pb`, `m_11_pt`, `m_11_rk`, `m_11_rm`, `m_11_ro`, `m_11_ud`
- document_details: `m_11_ak_detail`, `m_11_kw_detail`, `m_11_lb_detail`, `m_11_lb_hasil`, `m_11_lu_detail`, `m_11_pb_detail`, `m_11_pb_pay`, `m_11_rk_pay`, `m_11_ro_detail`
- history_tables: `m_11_kj_history`, `m_11_km_history`, `m_11_lu_detail_history`, `m_11_lu_history`

## Business Synonyms

- `KJ`: patient visit, medical visit
- `AK`: visit billing
- `LB`: laboratory, lab result
- `LU`: general service, medical procedure
- `RO`: prescription order
- `KW`: receipt, payment
- `RM`: medical record
- `RK`: visit recap, care recap

## Primary Join Hints

### kunjungan_to_tagihan_flow

```sql
m_11_kj.kjid = m_11_kj_detail.idkj
m_11_ak.akidkj = m_11_kj.kjid
m_11_ak.akid = m_11_ak_detail.idak
```

### kunjungan_to_layanan_flow

```sql
m_11_kj.kjid = m_11_lu.luidkj
m_11_kj.kjid = m_11_lb.lbidkj
m_11_kj.kjid = m_11_ro.roidkj
```

### kunjungan_to_pembayaran_flow

```sql
m_11_kj.kjid = m_11_kw_detail.idtransaksi when sumber = KJ
m_11_kj.kjid = m_11_rk.rkidkj
m_11_kj.kjid = m_11_rm.rmidkj
```

### layanan_history_flow

```sql
m_11_lu.luid = m_11_lu_history.luid
m_11_lu_detail.idludetail = m_11_lu_detail_history.idludetail
```

### tagihan_item_flow

```sql
m_11_ak.akid = m_11_ak_detail.idak
m_11_ak_detail.idlayanan = m1_item.bid
```

## Cross-Document Lineage Keys

This section is important for the AI agent because many M11 questions must be traced through the patient visit episode first, and only then into billing, services, lab work, prescriptions, or payment.

### Service episode centered on KJ

```sql
m_11_ak.akidkj -> m_11_kj.kjid
m_11_lu.luidkj -> m_11_kj.kjid
m_11_lb.lbidkj -> m_11_kj.kjid
m_11_ro.roidkj -> m_11_kj.kjid
m_11_rk.rkidkj -> m_11_kj.kjid
m_11_rm.rmidkj -> m_11_kj.kjid
```

Business meaning:

- `m_11_kj` is the root visit and service episode.
- If the user asks for services, lab work, prescriptions, billing, or payments for patient visit X, anchor the trace on `m_11_kj`.

### Detail to header for billing and services

```sql
m_11_ak_detail.idak -> m_11_ak.akid
m_11_kw_detail.idkw -> m_11_kw.kwid
m_11_lb_detail.idlb -> m_11_lb.lbid
m_11_lb_hasil.idlb -> m_11_lb.lbid
m_11_lu_detail.idlu -> m_11_lu.luid
m_11_pb_detail.idpv -> m_11_pb.pvid
m_11_rk_pay.idrk -> m_11_rk.rkid
m_11_ro_detail.idro -> m_11_ro.roid
```

### Payment to service episode

```sql
m_11_kw_detail.idtransaksi -> m_11_kj.kjid when sumber = KJ
```

Practical rules:

- start from `m_11_kj` when the question is about a single patient episode
- start from detail tables if the user asks for service items, prescription items, lab results, or payment details
- for receipt payments, always read `idtransaksi` together with `sumber`
- do not mix billing (`AK`, `KW`, `PB`) with clinical documents (`LU`, `LB`, `RO`, `RM`) without a `KJ` anchor

## Table Selection Rules

- Use header tables for document number, date, patient, service status, and care context.
- Use detail tables for service items, drugs, or medical procedures within each document.
- Use history tables only when the user explicitly asks for history or audit status changes.
- Many M11 documents are centered on the patient visit. Check the relationship to `KJ` first when the context is a care episode.
- Because healthcare is sensitive, read-only queries must avoid unsupported clinical assumptions.

## Safe Query Patterns

### kunjungan_lookup

Use `m_11_kj` and add `m_11_kj_detail` when needed.

### billing_trace

Use `m_11_kj -> m_11_ak -> m_11_ak_detail`.

### clinical_service_trace

Use `m_11_kj` and then move to `m_11_lu`, `m_11_lb`, or `m_11_ro` depending on the need.

## Queries That Need Extra Caution

- Questions that mix billing, medical records, and clinical services without separating the source documents.
- Questions that combine history tables with active tables without a clear audit purpose.
- Sensitive healthcare questions that risk inferring clinical meaning beyond what the structured data supports.
