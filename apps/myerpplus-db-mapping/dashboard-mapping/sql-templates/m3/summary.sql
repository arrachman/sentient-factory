-- Domain: m3
-- Purpose: KPI cards summary
-- Suggested metric source: m3_dc.dchmtotal

SELECT
  COUNT(*) AS total_rows,
  SUM(COALESCE(`dchmtotal`, 0)) AS total_metric,
  AVG(COALESCE(`dchmtotal`, 0)) AS avg_metric,
  MIN(COALESCE(`dchmtotal`, 0)) AS min_metric,
  MAX(COALESCE(`dchmtotal`, 0)) AS max_metric
FROM `m3_dc`
WHERE 1=1
AND DATE(__DATE_EXPR__) BETWEEN :from_date AND :to_date;
