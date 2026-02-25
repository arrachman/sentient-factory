-- Domain: m12
-- Purpose: time-series trend
-- Suggested source table: m_12_pos_item

SELECT
  DATE(__DATE_EXPR__) AS period_date,
  COUNT(*) AS total_rows,
  SUM(COALESCE(`piidbarang`, 0)) AS total_metric
FROM `m_12_pos_item`
WHERE 1=1
AND DATE(__DATE_EXPR__) BETWEEN :from_date AND :to_date
GROUP BY period_date
ORDER BY period_date ASC;
