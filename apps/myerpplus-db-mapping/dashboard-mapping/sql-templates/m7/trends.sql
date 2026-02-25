-- Domain: m7
-- Purpose: time-series trend
-- Suggested source table: m7_asset_category_tax

SELECT
  DATE(__DATE_EXPR__) AS period_date,
  COUNT(*) AS total_rows,
  SUM(COALESCE(`actmetode`, 0)) AS total_metric
FROM `m7_asset_category_tax`
WHERE 1=1
AND DATE(__DATE_EXPR__) BETWEEN :from_date AND :to_date
GROUP BY period_date
ORDER BY period_date ASC;
