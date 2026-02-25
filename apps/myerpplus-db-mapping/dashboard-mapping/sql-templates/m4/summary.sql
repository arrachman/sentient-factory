-- Domain: m4
-- Purpose: KPI cards summary
-- Suggested metric source: m4_po.pototal

SELECT
  COUNT(*) AS total_rows,
  SUM(COALESCE(`pototal`, 0)) AS total_metric,
  AVG(COALESCE(`pototal`, 0)) AS avg_metric,
  MIN(COALESCE(`pototal`, 0)) AS min_metric,
  MAX(COALESCE(`pototal`, 0)) AS max_metric
FROM `m4_po`
WHERE 1=1
AND DATE(__DATE_EXPR__) BETWEEN :from_date AND :to_date;
