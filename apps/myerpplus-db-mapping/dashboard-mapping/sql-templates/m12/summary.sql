-- Domain: m12
-- Purpose: KPI cards summary
-- Suggested metric source: m_12_ppv.ppvtotalap

SELECT
  COUNT(*) AS total_rows,
  SUM(COALESCE(`ppvtotalap`, 0)) AS total_metric,
  AVG(COALESCE(`ppvtotalap`, 0)) AS avg_metric,
  MIN(COALESCE(`ppvtotalap`, 0)) AS min_metric,
  MAX(COALESCE(`ppvtotalap`, 0)) AS max_metric
FROM `m_12_ppv`
WHERE 1=1
AND DATE(__DATE_EXPR__) BETWEEN :from_date AND :to_date;
