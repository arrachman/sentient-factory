# M8 NL2SQL Guide

Primary sources:
- `semantic-schema-m8.json`
- `semantic-schema-m8-summary.md`
- `m8-queries.md`
- `m0_report_rmoduleid_8.sql`

Purpose:
- help select the correct analytics-content tables
- distinguish content master data, indicator thresholds, chart configuration, and metric tables
- provide read-only guardrails for the analytics domain

## Main Table Coverage

- content_tables: `m8_content`, `m8_content_chart`, `m8_indicator`
- metric_tables: `m8_f_capex`, `m8_f_dpo`, `m8_f_dsi`, `m8_f_dso`, `m8_f_dte`, `m8_f_ebtida`, `m8_f_eva`, `m8_f_gpm`, `m8_f_np`, `m8_f_npm`, `m8_f_opm`, `m8_f_rgr`, `m8_f_roa`, `m8_f_roce`, `m8_f_roe`, `m8_f_roi`, `m8_f_wctr`

## Business Synonyms

- `CONTENT`: dashboard content, analytic content, content metric
- `INDICATOR`: indicator, threshold, KPI threshold
- `CHART`: chart, visualization
- `METRIC`: financial metric, financial ratio, dashboard metric

## Primary Join Hints

### content_indicator_flow

```sql
m8_content.ckode = m8_indicator.ikode
```

### content_chart_flow

```sql
m8_content.ckode = m8_content_chart.chkode
```

### content_module_flow

```sql
m8_content.cmodule = m0_module.mid
```

## Table Selection Rules

- Use `m8_content` for dashboard content definitions and indicator formulas.
- Use `m8_indicator` for thresholds and comparators, not for the main content formula.
- Use `m8_content_chart` when the user asks for visualization or chart configuration.
- Treat `m8_f_*` tables as metric-specific analytics facts, not as general content master tables.
- M8 is primarily a read-only analytics setup domain. Avoid write-path assumptions unless the user explicitly asks about maintenance.

## Safe Query Patterns

### content_catalog

Use `m8_content` and join to `m8_indicator` when thresholds are needed.

### chart_configuration_lookup

Use `m8_content_chart` and then join back to `m8_content`.

### metric_specific_lookup

Use the `m8_f_*` table that matches the requested metric.

## Queries That Need Extra Caution

- Questions that mix content master data with metric-specific fact tables without a clear goal.
- Questions that assume `m8_indicator` stores the main content formula.
- Questions that try to modify thresholds or indicators when the user only wants read-only analysis.
