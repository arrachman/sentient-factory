# Semantic Schema M6 Summary

Schema source: `semantic-schema-m6.json`
Query source: `m6-queries.md`, `m6-queries-by-type.md`, `m0_report_rmoduleid_6.sql`

Total M6 tables in schema: **43**
Total M6 tables detected in active queries: **43**
Total query SELECT: **128** | INSERT: **47** | UPDATE: **36** | DELETE: **35**
Total join hints: **5**

This document summarizes the M6 manufacturing domain detected from active queries, with a focus on BOM, MRS, MRN, PD, PDR, WO, and supporting production tables.

## Join Hints

- `bom_structure_flow`: Relationship from the BOM header to input and output components.
  `m6_bom.bomid = m6_bom_in.idbom`
  `m6_bom.bomid = m6_bom_out.idbom`
- `mrs_to_mrn_flow`: Relationship from material request slips to material receipt notes.
  `m6_mrs.mrsid = m6_mrs_out.idmrs`
  `m6_mrs_out.idmrsout = m6_mrn_out.idmrsout`
  `m6_mrn.mrnid = m6_mrn_out.idmrn`
- `mrs_to_pd_flow`: Relationship from material request slips to production documents.
  `m6_mrs.mrsid = m6_mrs_out.idmrs`
  `m6_mrs_out.idmrsout = m6_pd_out.idmrsout`
  `m6_pd.pdid = m6_pd_out.idpd`
- `bom_pdr_wo_reference_flow`: Relationship among manufacturing documents that cross-reference BOM, PDR, and WO.
  `m6_mrs.mrsidbom = m6_bom.bomid`
  `m6_mrs.mrsidpdr = m6_pdr.pdrid`
  `m6_mrs.mrsidwo = m6_wo.woid`
  `m6_mrn.mrnidbom = m6_bom.bomid`
  `m6_mrn.mrnidpdr = m6_pdr.pdrid`
  `m6_mrn.mrnidwo = m6_wo.woid`
- `workorder_material_output_flow`: Relationship from work orders to input detail, output detail, activity, and route cards.
  `m6_wo.woid = m6_wo_in.idwo`
  `m6_wo.woid = m6_wo_out.idwo`
  `m6_wo.woid = m6_wo_activity.idwo`
  `m6_wo.woid = m6_wo_route_card.idwo`

## Detail-Level Relation Keys

This section is important for the AI agent because manufacturing flow is safest when traced from material or output lines first, then lifted to the process header.

- `m6_bom_in.idbom -> m6_bom.bomid`
  Used when input components must be traced to the BOM header.
- `m6_bom_out.idbom -> m6_bom.bomid`
  Used when BOM output/result rows must be traced to the BOM header.
- `m6_mrs_out.idmrs -> m6_mrs.mrsid`
  Used when consumed material must be traced to the MRS header.
- `m6_mrn_out.idmrsout -> m6_mrs_out.idmrsout -> m6_mrs.mrsid`
  Used when material realization on an MRN must be traced back to the source MRS.
- `m6_pd_out.idmrsout -> m6_mrs_out.idmrsout -> m6_mrs.mrsid`
  Used when production-document output must be traced back to the source MRS.
- `m6_pdr_in.idpdr -> m6_pdr.pdrid`
  Used when production-result input rows must be traced to the PDR header.
- `m6_pdr_out.idpdr -> m6_pdr.pdrid`
  Used when production-result output rows must be traced to the PDR header.
- `m6_wo_in.idwo -> m6_wo.woid`
  Used when material-requirement rows must be traced to the work-order header.
- `m6_wo_out.idwo -> m6_wo.woid`
  Used when work-order output rows must be traced to the work-order header.
- `m6_wo_activity.idwo -> m6_wo.woid`
  Used when process-activity rows must be traced to the work-order header.
- `m6_wo_route_card.idwo -> m6_wo.woid`
  Used when route-card rows must be traced to the work-order header.

Practical rules:

- start from material or output lines when the user asks about process origin
- use the header only after the source line is identified
- distinguish reference-header fields such as `mrsidbom`, `mrsidpdr`, and `mrsidwo` from actual detail lineage

## Overview Area

- **DOCUMENT_HEADERS**: tables 6
- **DOCUMENT_DETAILS**: tables 15
- **SUPPORTING_TABLES**: tables 6
- **HISTORY_TABLES**: tables 16

## DOCUMENT_HEADERS

### Tables

- `m6_bom` | alias: `manufacturing_bom` | columns: 50
  Bill-of-materials header or production formula header.
- `m6_mrn` | alias: `manufacturing_mrn` | columns: 58
  Material receipt note for production material realization.
- `m6_mrs` | alias: `manufacturing_mrs` | columns: 60
  Material request slip for production requirements.
- `m6_pd` | alias: `manufacturing_pd` | columns: 58
  Production document for the main production process.
- `m6_pdr` | alias: `manufacturing_pdr` | columns: 64
  Production result or production-realization document.
- `m6_wo` | alias: `manufacturing_wo` | columns: 63
  Production work order.

## DOCUMENT_DETAILS

### Tables

- `m6_bom_in` | alias: `manufacturing_bom_in` | columns: 36
  Input material/component detail for the BOM.
- `m6_bom_out` | alias: `manufacturing_bom_out` | columns: 37
  Output/finished-good detail on the BOM.
- `m6_mrn_in` | alias: `manufacturing_mrn_in` | columns: 0
  Incoming material detail on the MRN.
- `m6_mrn_out` | alias: `manufacturing_mrn_out` | columns: 44
  Outgoing material detail on the MRN.
- `m6_mrs_in` | alias: `manufacturing_mrs_in` | columns: 0
  Incoming material detail on the MRS.
- `m6_mrs_out` | alias: `manufacturing_mrs_out` | columns: 46
  Outgoing material or consumption detail on the MRS.
- `m6_pd_bom` | alias: `manufacturing_pd_bom` | columns: 1
  Relationship from the production document to the BOM used.
- `m6_pd_in` | alias: `manufacturing_pd_in` | columns: 42
  Input material detail on the production document.
- `m6_pd_out` | alias: `manufacturing_pd_out` | columns: 43
  Production output detail on the production document.
- `m6_pdr_in` | alias: `manufacturing_pdr_in` | columns: 47
  Input detail on the production result.
- `m6_pdr_out` | alias: `manufacturing_pdr_out` | columns: 48
  Output detail on the production result.
- `m6_wo_activity` | alias: `manufacturing_wo_activity` | columns: 20
  Activity or process step on the work order.
- `m6_wo_in` | alias: `manufacturing_wo_in` | columns: 46
  Material-requirement detail on the work order.
- `m6_wo_out` | alias: `manufacturing_wo_out` | columns: 47
  Output-result detail on the work order.
- `m6_wo_route_card` | alias: `manufacturing_wo_route_card` | columns: 20
  Route card or work-order process sequence.

## SUPPORTING_TABLES

### Tables

- `m6_files` | alias: `manufacturing_files` | columns: 8
  Attachment table for manufacturing documents.
- `m6_itembom_in` | alias: `manufacturing_itembom_in` | columns: 1
  Snapshot of BOM input components per finished item.
- `m6_itembom_out` | alias: `manufacturing_itembom_out` | columns: 1
  Snapshot of BOM output components per finished item.
- `m6_machine_plotting` | alias: `manufacturing_machine_plotting` | columns: 0
  Machine-mapping or plotting configuration for manufacturing processes.
- `m6_notes` | alias: `manufacturing_notes` | columns: 8
  Notes table for manufacturing documents.
- `m6_production_planning` | alias: `manufacturing_production_planning` | columns: 0
  Production-planning data.

## HISTORY_TABLES

### Tables

- `m6_bom_history` | alias: `manufacturing_bom_history` | columns: 0
  Status-change history for BOM headers.
- `m6_bom_in_history` | alias: `manufacturing_bom_in_history` | columns: 0
  Status-change history for BOM input detail rows.
- `m6_bom_out_history` | alias: `manufacturing_bom_out_history` | columns: 0
  Status-change history for BOM output detail rows.
- `m6_mrn_history` | alias: `manufacturing_mrn_history` | columns: 0
  Status-change history for MRN headers.
- `m6_mrn_out_history` | alias: `manufacturing_mrn_out_history` | columns: 0
  Status-change history for MRN output detail rows.
- `m6_mrs_history` | alias: `manufacturing_mrs_history` | columns: 0
  Status-change history for MRS headers.
- `m6_mrs_out_history` | alias: `manufacturing_mrs_out_history` | columns: 0
  Status-change history for MRS output detail rows.
- `m6_pd_history` | alias: `manufacturing_pd_history` | columns: 0
  Status-change history for PD headers.
- `m6_pd_in_history` | alias: `manufacturing_pd_in_history` | columns: 0
  Status-change history for PD input detail rows.
- `m6_pd_out_history` | alias: `manufacturing_pd_out_history` | columns: 0
  Status-change history for PD output detail rows.
- `m6_pdr_history` | alias: `manufacturing_pdr_history` | columns: 0
  Status-change history for PDR headers.
- `m6_pdr_in_history` | alias: `manufacturing_pdr_in_history` | columns: 0
  Status-change history for PDR input detail rows.
- `m6_pdr_out_history` | alias: `manufacturing_pdr_out_history` | columns: 0
  Status-change history for PDR output detail rows.
- `m6_wo_history` | alias: `manufacturing_wo_history` | columns: 0
  Status-change history for work-order headers.
- `m6_wo_in_history` | alias: `manufacturing_wo_in_history` | columns: 0
  Status-change history for work-order input detail rows.
- `m6_wo_out_history` | alias: `manufacturing_wo_out_history` | columns: 0
  Status-change history for work-order output detail rows.
