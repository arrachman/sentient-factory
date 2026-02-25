-- Domain: m5
-- Purpose: KPI cards summary
-- Suggested metric source: m5_ic_detail_history.totaltransaksi

SELECT
  COUNT(*) AS total_rows,
  SUM(COALESCE(`totaltransaksi`, 0)) AS total_metric,
  AVG(COALESCE(`totaltransaksi`, 0)) AS avg_metric,
  MIN(COALESCE(`totaltransaksi`, 0)) AS min_metric,
  MAX(COALESCE(`totaltransaksi`, 0)) AS max_metric
FROM `m5_ic_detail_history`
WHERE 1=1
AND DATE(__DATE_EXPR__) BETWEEN :from_date AND :to_date;
