-- Domain: m7
-- Purpose: KPI cards summary
-- Suggested metric source: m7_ae.aetotal

SELECT
  COUNT(*) AS total_rows,
  SUM(COALESCE(`aetotal`, 0)) AS total_metric,
  AVG(COALESCE(`aetotal`, 0)) AS avg_metric,
  MIN(COALESCE(`aetotal`, 0)) AS min_metric,
  MAX(COALESCE(`aetotal`, 0)) AS max_metric
FROM `m7_ae`
WHERE 1=1
AND DATE(__DATE_EXPR__) BETWEEN :from_date AND :to_date;
