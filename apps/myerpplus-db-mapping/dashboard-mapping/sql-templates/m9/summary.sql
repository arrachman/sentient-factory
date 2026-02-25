-- Domain: m9
-- Purpose: KPI cards summary
-- Suggested metric source: m9_coa.csaldoawal

SELECT
  COUNT(*) AS total_rows,
  SUM(COALESCE(`csaldoawal`, 0)) AS total_metric,
  AVG(COALESCE(`csaldoawal`, 0)) AS avg_metric,
  MIN(COALESCE(`csaldoawal`, 0)) AS min_metric,
  MAX(COALESCE(`csaldoawal`, 0)) AS max_metric
FROM `m9_coa`
WHERE 1=1
AND DATE(__DATE_EXPR__) BETWEEN :from_date AND :to_date;
