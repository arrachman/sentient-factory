-- Domain: m8
-- Purpose: KPI cards summary
-- Suggested metric source: m8_indicator.ivalue1

SELECT
  COUNT(*) AS total_rows,
  SUM(COALESCE(`ivalue1`, 0)) AS total_metric,
  AVG(COALESCE(`ivalue1`, 0)) AS avg_metric,
  MIN(COALESCE(`ivalue1`, 0)) AS min_metric,
  MAX(COALESCE(`ivalue1`, 0)) AS max_metric
FROM `m8_indicator`
WHERE 1=1
AND DATE(__DATE_EXPR__) BETWEEN :from_date AND :to_date;
