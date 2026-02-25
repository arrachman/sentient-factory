-- Domain: m11
-- Purpose: KPI cards summary
-- Suggested metric source: m_11_ak.aktotaltransaksi

SELECT
  COUNT(*) AS total_rows,
  SUM(COALESCE(`aktotaltransaksi`, 0)) AS total_metric,
  AVG(COALESCE(`aktotaltransaksi`, 0)) AS avg_metric,
  MIN(COALESCE(`aktotaltransaksi`, 0)) AS min_metric,
  MAX(COALESCE(`aktotaltransaksi`, 0)) AS max_metric
FROM `m_11_ak`
WHERE 1=1
AND DATE(__DATE_EXPR__) BETWEEN :from_date AND :to_date;
