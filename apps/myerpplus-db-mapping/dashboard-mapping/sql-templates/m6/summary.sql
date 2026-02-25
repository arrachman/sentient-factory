-- Domain: m6
-- Purpose: KPI cards summary
-- Suggested metric source: m6_pdr_history.pdrtotalhargain

SELECT
  COUNT(*) AS total_rows,
  SUM(COALESCE(`pdrtotalhargain`, 0)) AS total_metric,
  AVG(COALESCE(`pdrtotalhargain`, 0)) AS avg_metric,
  MIN(COALESCE(`pdrtotalhargain`, 0)) AS min_metric,
  MAX(COALESCE(`pdrtotalhargain`, 0)) AS max_metric
FROM `m6_pdr_history`
WHERE 1=1
AND DATE(__DATE_EXPR__) BETWEEN :from_date AND :to_date;
