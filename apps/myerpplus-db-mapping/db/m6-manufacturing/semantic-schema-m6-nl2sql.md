# M6 NL2SQL Guide

Primary sources:
- `semantic-schema-m6.json`
- `semantic-schema-m6-summary.md`
- `m6-queries.md`
- `m0_report_rmoduleid_6.sql`

Purpose:
- help select the correct manufacturing tables
- trace BOM, material, production, and work-order flows
- provide read-only guardrails for the production domain

## Main Table Coverage

- document_headers: `m6_bom`, `m6_mrn`, `m6_mrs`, `m6_pd`, `m6_pdr`, `m6_wo`
- document_details: `m6_bom_in`, `m6_bom_out`, `m6_mrn_in`, `m6_mrn_out`, `m6_mrs_in`, `m6_mrs_out`, `m6_pd_bom`, `m6_pd_in`, `m6_pd_out`, `m6_pdr_in`, `m6_pdr_out`, `m6_wo_activity`, ...
- supporting_tables: `m6_files`, `m6_itembom_in`, `m6_itembom_out`, `m6_machine_plotting`, `m6_notes`, `m6_production_planning`
- history_tables: `m6_bom_history`, `m6_bom_in_history`, `m6_bom_out_history`, `m6_mrn_history`, `m6_mrn_out_history`, `m6_mrs_history`, `m6_mrs_out_history`, `m6_pd_history`, `m6_pd_in_history`, `m6_pd_out_history`, `m6_pdr_history`, `m6_pdr_in_history`, ...

## Business Synonyms

- `BOM`: bill of materials, production formula
- `MRS`: material request slip, production material request
- `MRN`: material receipt note, material realization
- `PD`: production document
- `PDR`: production result
- `WO`: work order

## Primary Join Hints

### bom_structure_flow

```sql
m6_bom.bomid = m6_bom_in.idbom
m6_bom.bomid = m6_bom_out.idbom
```

### mrs_to_mrn_flow

```sql
m6_mrs.mrsid = m6_mrs_out.idmrs
m6_mrs_out.idmrsout = m6_mrn_out.idmrsout
m6_mrn.mrnid = m6_mrn_out.idmrn
```

### mrs_to_pd_flow

```sql
m6_mrs.mrsid = m6_mrs_out.idmrs
m6_mrs_out.idmrsout = m6_pd_out.idmrsout
m6_pd.pdid = m6_pd_out.idpd
```

### bom_pdr_wo_reference_flow

```sql
m6_mrs.mrsidbom = m6_bom.bomid
m6_mrs.mrsidpdr = m6_pdr.pdrid
m6_mrs.mrsidwo = m6_wo.woid
m6_mrn.mrnidbom = m6_bom.bomid
m6_mrn.mrnidpdr = m6_pdr.pdrid
m6_mrn.mrnidwo = m6_wo.woid
```

### workorder_material_output_flow

```sql
m6_wo.woid = m6_wo_in.idwo
m6_wo.woid = m6_wo_out.idwo
m6_wo.woid = m6_wo_activity.idwo
m6_wo.woid = m6_wo_route_card.idwo
```

## Cross-Document Lineage Keys

This section is important for the AI agent because M6 manufacturing flow is usually traced from material or output detail rows first, and only then lifted to the process header.

- `m6_bom_in.idbom -> m6_bom.bomid`
  Used when an input component must be traced to the BOM header.
- `m6_bom_out.idbom -> m6_bom.bomid`
  Used when a BOM output line must be traced to the BOM header.
- `m6_mrs_out.idmrs -> m6_mrs.mrsid`
  Used when material consumption must be traced to the MRS header.
- `m6_mrn_out.idmrsout -> m6_mrs_out.idmrsout -> m6_mrs.mrsid`
  Used when material realization in MRN must be traced back to the originating MRS.
- `m6_pd_out.idmrsout -> m6_mrs_out.idmrsout -> m6_mrs.mrsid`
  Used when production output must be traced back to the originating MRS.
- `m6_pdr_in.idpdr -> m6_pdr.pdrid`
  Used when a production-result input line must be traced to the PDR header.
- `m6_pdr_out.idpdr -> m6_pdr.pdrid`
  Used when a production-result output line must be traced to the PDR header.
- `m6_wo_in.idwo -> m6_wo.woid`
  Used when work-order material requirement lines must be traced to the WO header.
- `m6_wo_out.idwo -> m6_wo.woid`
  Used when work-order output lines must be traced to the WO header.
- `m6_wo_activity.idwo -> m6_wo.woid`
  Used when production activity steps must be traced to the WO header.
- `m6_wo_route_card.idwo -> m6_wo.woid`
  Used when route-card rows must be traced to the WO header.

Practical rules:

- for material-origin tracing, start from `m6_mrs_out`, `m6_mrn_out`, or `m6_pd_out`
- for finished-output tracing, start from `m6_pd_out`, `m6_pdr_out`, or `m6_wo_out`
- move to the header only after the source process line is identified
- distinguish header reference fields (`mrsidbom`, `mrsidpdr`, `mrsidwo`) from actual detail lineage

## Table Selection Rules

- Use header tables for document number, date, warehouse, status, and production-process references.
- Use `_in` and `_out` detail tables for material input, finished output, and realized quantities.
- Use history tables only when the user explicitly asks for document history or audit state changes.
- For production-flow tracing, start from detail rows whenever the question is about material realization or output.
- Many M6 documents reference BOM, PDR, and WO. Keep the source-process context explicit.

## Safe Query Patterns

### bom_structure

Use `m6_bom` with `m6_bom_in` and `m6_bom_out`.

### material_realization_trace

Start from `m6_mrs_out` and connect to `m6_mrn_out` or `m6_pd_out`.

### work_order_trace

Use `m6_wo`, `m6_wo_in`, `m6_wo_out`, `m6_wo_activity`, and `m6_wo_route_card`.

## Queries That Need Extra Caution

- Questions that mix BOM, WO, PDR, and PD without a clear document relationship.
- Questions that combine history tables with active tables without an audit purpose.
- Questions that rely on `custom*` fields or snapshot tables such as `m6_itembom_in/out` without context.
