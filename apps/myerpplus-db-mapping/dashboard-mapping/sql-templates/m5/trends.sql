-- Domain: m5
-- Purpose: time-series trend
-- Suggested source table: m5_ic_detail_history

SELECT
  DATE(__DATE_EXPR__) AS period_date,
  COUNT(*) AS total_rows,
  SUM(COALESCE(`totaltransaksi`, 0)) AS total_metric
FROM `m5_ic_detail_history`
WHERE 1=1
AND DATE(__DATE_EXPR__) BETWEEN :from_date AND :to_date
GROUP BY period_date
ORDER BY period_date ASC;
