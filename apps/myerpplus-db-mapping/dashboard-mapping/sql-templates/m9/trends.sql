-- Domain: m9
-- Purpose: time-series trend
-- Suggested source table: m9_coa

SELECT
  DATE(__DATE_EXPR__) AS period_date,
  COUNT(*) AS total_rows,
  SUM(COALESCE(`csaldoawal`, 0)) AS total_metric
FROM `m9_coa`
WHERE 1=1
AND DATE(__DATE_EXPR__) BETWEEN :from_date AND :to_date
GROUP BY period_date
ORDER BY period_date ASC;
