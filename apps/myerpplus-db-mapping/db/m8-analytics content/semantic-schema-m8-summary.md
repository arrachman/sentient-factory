# Semantic Schema M8 Summary

Schema source: `semantic-schema-m8.json`
Query source: `m8-queries.md`, `m8-queries-by-type.md`, `m0_report_rmoduleid_8.sql`

Total M8 tables in schema: **20**
Total M8 tables detected in active queries: **20**
Total query SELECT: **7** | INSERT: **1** | UPDATE: **1** | DELETE: **0**
Total join hints: **3**

This document summarizes the M8 analytics-content domain active in query sources, with a focus on dashboard content master data, chart configuration, indicator thresholds, and metric-analytics tables.

## Join Hints

- `content_indicator_flow`: Relationship from analytics content to indicator thresholds.
  `m8_content.ckode = m8_indicator.ikode`
- `content_chart_flow`: Relationship from analytics content to chart configuration.
  `m8_content.ckode = m8_content_chart.chkode`
- `content_module_flow`: Relationship from analytics content to module master data.
  `m8_content.cmodule = m0_module.mid`

## Overview Area

- **CONTENT_TABLES**: tables 3
- **METRIC_TABLES**: tables 17

## CONTENT_TABLES

### Tables

- `m8_content` | alias: `analytics_content` | columns: 0
  Analytics/dashboard content master that defines formulas, formats, periods, and display-indicator metadata.
- `m8_content_chart` | alias: `analytics_content_chart` | columns: 0
  Chart/visualization configuration for specific analytics content.
- `m8_indicator` | alias: `analytics_indicator` | columns: 10
  Threshold, comparator, and value indicator for analytics content.

## METRIC_TABLES

### Tables

- `m8_f_capex` | alias: `analytics_f_capex` | columns: 0
  Fact/metric analytics for CAPEX.
- `m8_f_dpo` | alias: `analytics_f_dpo` | columns: 0
  Fact/metric analytics for days payable outstanding.
- `m8_f_dsi` | alias: `analytics_f_dsi` | columns: 0
  Fact/metric analytics for days sales of inventory.
- `m8_f_dso` | alias: `analytics_f_dso` | columns: 0
  Fact/metric analytics for days sales outstanding.
- `m8_f_dte` | alias: `analytics_f_dte` | columns: 0
  Fact/metric analytics for debt to equity.
- `m8_f_ebtida` | alias: `analytics_f_ebtida` | columns: 0
  Fact/metric analytics for EBITDA.
- `m8_f_eva` | alias: `analytics_f_eva` | columns: 0
  Fact/metric analytics for EVA.
- `m8_f_gpm` | alias: `analytics_f_gpm` | columns: 0
  Fact/metric analytics for gross profit margin.
- `m8_f_np` | alias: `analytics_f_np` | columns: 0
  Fact/metric analytics for net profit.
- `m8_f_npm` | alias: `analytics_f_npm` | columns: 0
  Fact/metric analytics for net profit margin.
- `m8_f_opm` | alias: `analytics_f_opm` | columns: 0
  Fact/metric analytics for operating profit margin.
- `m8_f_rgr` | alias: `analytics_f_rgr` | columns: 0
  Fact/metric analytics for revenue growth rate.
- `m8_f_roa` | alias: `analytics_f_roa` | columns: 0
  Fact/metric analytics for return on assets.
- `m8_f_roce` | alias: `analytics_f_roce` | columns: 0
  Fact/metric analytics for return on capital employed.
- `m8_f_roe` | alias: `analytics_f_roe` | columns: 0
  Fact/metric analytics for return on equity.
- `m8_f_roi` | alias: `analytics_f_roi` | columns: 0
  Fact/metric analytics for return on investment.
- `m8_f_wctr` | alias: `analytics_f_wctr` | columns: 0
  Fact/metric analytics for working capital turnover.
