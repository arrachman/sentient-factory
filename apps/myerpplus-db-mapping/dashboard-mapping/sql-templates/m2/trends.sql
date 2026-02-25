-- Domain: m2
-- Purpose: time-series trend
-- Suggested source table: m2_transaction_journal

SELECT
  DATE(__DATE_EXPR__) AS period_date,
  COUNT(*) AS total_rows,
  SUM(COALESCE(`tid`, 0)) AS total_metric
FROM `m2_transaction_journal`
WHERE 1=1
AND DATE(__DATE_EXPR__) BETWEEN :from_date AND :to_date
GROUP BY period_date
ORDER BY period_date ASC;
