# Semantic Schema M11 Summary

Schema source: `semantic-schema-m11.json`
Query source: `m11-queries.md`, `m11-queries-by-type.md`, `m0_report_rmoduleid_11.sql`

Total M11 tables in schema: **28**
Total M11 tables detected in active queries: **28**
Total query SELECT: **189** | INSERT: **27** | UPDATE: **107** | DELETE: **29**
Total join hints: **5**

This document summarizes the M11 healthcare domain active in query sources, with a focus on patient visits, service billing, prescriptions/services, laboratory processes, payments, and medical records.

## Join Hints

- `kunjungan_to_tagihan_flow`: Relationship from patient visits to billing documents and billing detail.
  `m_11_kj.kjid = m_11_kj_detail.idkj`
  `m_11_ak.akidkj = m_11_kj.kjid`
  `m_11_ak.akid = m_11_ak_detail.idak`
- `kunjungan_to_layanan_flow`: Relationship from patient visits to general-service, laboratory, and prescription documents.
  `m_11_kj.kjid = m_11_lu.luidkj`
  `m_11_kj.kjid = m_11_lb.lbidkj`
  `m_11_kj.kjid = m_11_ro.roidkj`
- `kunjungan_to_pembayaran_flow`: Relationship from patient visits to payment/receipt documents.
  `m_11_kj.kjid = m_11_kw_detail.idtransaction when sumber = KJ`
  `m_11_kj.kjid = m_11_rk.rkidkj`
  `m_11_kj.kjid = m_11_rm.rmidkj`
- `layanan_history_flow`: Relationship from active general-service documents to status-change history.
  `m_11_lu.luid = m_11_lu_history.luid`
  `m_11_lu_detail.idludetail = m_11_lu_detail_history.idludetail`
- `tagihan_item_flow`: Relationship from billing documents to service/item detail.
  `m_11_ak.akid = m_11_ak_detail.idak`
  `m_11_ak_detail.idlayanan = m1_item.bid`

## Detail-Level Relation Keys

This section is important for the AI agent because M11 healthcare documents often branch from a single patient-visit episode.

- `m_11_ak.akidkj -> m_11_kj.kjid`
  Used when visit billing must be traced to the patient-visit episode.
- `m_11_lu.luidkj -> m_11_kj.kjid`
  Used when general-service documents must be traced to the visit episode.
- `m_11_lb.lbidkj -> m_11_kj.kjid`
  Used when laboratory documents must be traced to the visit episode.
- `m_11_ro.roidkj -> m_11_kj.kjid`
  Used when prescriptions or medicine orders must be traced to the visit episode.
- `m_11_rk.rkidkj -> m_11_kj.kjid`
  Used when healthcare care/summary records must be traced to the visit episode.
- `m_11_rm.rmidkj -> m_11_kj.kjid`
  Used when medical records must be traced to the visit episode.
- `m_11_ak_detail.idak -> m_11_ak.akid`
  Used when billing detail rows must be traced to the billing header.
- `m_11_kw_detail.idkw -> m_11_kw.kwid`
  Used when payment-allocation rows must be traced to the receipt header.
- `m_11_lb_detail.idlb -> m_11_lb.lbid`
  Used when lab-examination detail rows must be traced to the laboratory header.
- `m_11_lb_hasil.idlb -> m_11_lb.lbid`
  Used when lab-result rows must be traced to the laboratory document header.
- `m_11_lu_detail.idlu -> m_11_lu.luid`
  Used when medical-procedure detail rows must be traced to the general-service header.
- `m_11_pb_detail.idpv -> m_11_pb.pvid`
  Used when healthcare billing/payment detail rows must be traced to the PB header.
- `m_11_rk_pay.idrk -> m_11_rk.rkid`
  Used when care/summary payment-allocation rows must be traced to the RK header.
- `m_11_ro_detail.idro -> m_11_ro.roid`
  Used when prescription detail rows must be traced to the medicine-order header.
- `m_11_kw_detail.idtransaction -> m_11_kj.kjid when sumber = KJ`
  Used when a receipt must be traced back to the patient-visit episode.

Practical rules:

- find the `m_11_kj` anchor first when questions are centered on a single patient episode
- use detail-to-header joins for service detail, prescriptions, labs, and payments
- read `idtransaction` together with `sumber` on payment documents
- do not mix billing and clinical documents without a visit anchor

## Overview Area

- **DOCUMENT_HEADERS**: tables 14
- **DOCUMENT_DETAILS**: tables 9
- **HISTORY_TABLES**: tables 4

## DOCUMENT_HEADERS

### Tables

- `m_11_ak` | alias: `healthcare_ak` | columns: 122
  Billing or account document for a patient visit.
- `m_11_ilo` | alias: `healthcare_ilo` | columns: 26
  Inpatient log/order related to inpatient care.
- `m_11_isk` | alias: `healthcare_isk` | columns: 29
  Inpatient-specific clinical procedure or clinical document.
- `m_11_kj` | alias: `healthcare_kj` | columns: 140
  Patient-visit or medical-visit header for the healthcare service episode.
- `m_11_km` | alias: `healthcare_km` | columns: 122
  Chemotherapy or medical-module document related to a patient visit.
- `m_11_kw` | alias: `healthcare_kw` | columns: 70
  Receipt or payment document for healthcare visits/services.
- `m_11_lb` | alias: `healthcare_lb` | columns: 119
  Laboratory or lab-examination-result header.
- `m_11_lu` | alias: `healthcare_lu` | columns: 115
  General-service or medical-procedure header.
- `m_11_pb` | alias: `healthcare_pb` | columns: 65
  Healthcare payment/billing header.
- `m_11_pt` | alias: `healthcare_pt` | columns: 32
  Patient registration/care record or treatment-parameter document.
- `m_11_rk` | alias: `healthcare_rk` | columns: 62
  Visit-history or care-summary header.
- `m_11_rm` | alias: `healthcare_rm` | columns: 83
  Medical record or patient medical summary.
- `m_11_ro` | alias: `healthcare_ro` | columns: 116
  Prescription or medicine-order header.
- `m_11_ud` | alias: `healthcare_ud` | columns: 28
  Healthcare unit or department master.

## DOCUMENT_DETAILS

### Tables

- `m_11_ak_detail` | alias: `healthcare_ak_detail` | columns: 103
  Service/item detail rows on patient-visit billing.
- `m_11_kw_detail` | alias: `healthcare_kw_detail` | columns: 37
  Payment-allocation detail on healthcare receipts.
- `m_11_lb_detail` | alias: `healthcare_lb_detail` | columns: 98
  Laboratory examination item detail.
- `m_11_lb_hasil` | alias: `healthcare_lb_hasil` | columns: 11
  Laboratory examination results.
- `m_11_lu_detail` | alias: `healthcare_lu_detail` | columns: 98
  General-service or medical-procedure detail.
- `m_11_pb_detail` | alias: `healthcare_pb_detail` | columns: 34
  Billing detail or healthcare payment item detail.
- `m_11_pb_pay` | alias: `healthcare_pb_pay` | columns: 0
  Payment allocation on healthcare billing documents.
- `m_11_rk_pay` | alias: `healthcare_rk_pay` | columns: 16
  Payment allocation on healthcare care/treatment records.
- `m_11_ro_detail` | alias: `healthcare_ro_detail` | columns: 103
  Medicine/service detail on prescriptions or medicine orders.

## HISTORY_TABLES

### Tables

- `m_11_kj_history` | alias: `healthcare_kj_history` | columns: 0
  Status-change history for patient visits.
- `m_11_km_history` | alias: `healthcare_km_history` | columns: 0
  Status-change history for KM module documents.
- `m_11_lu_detail_history` | alias: `healthcare_lu_detail_history` | columns: 0
  History of general-service detail rows.
- `m_11_lu_history` | alias: `healthcare_lu_history` | columns: 0
  Status-change history for general-service headers.
