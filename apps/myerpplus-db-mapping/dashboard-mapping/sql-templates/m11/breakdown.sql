-- Domain: m11
-- Purpose: grouped breakdown chart
-- Suggested filter source: m_11_ak.akcustomer

SELECT
  COALESCE(CAST(`__GROUP_BY__` AS CHAR), 'UNKNOWN') AS group_key,
  COUNT(*) AS total_rows,
  SUM(COALESCE(`aktotaltransaksi`, 0)) AS total_metric
FROM `m_11_ak`
WHERE 1=1
AND DATE(__DATE_EXPR__) BETWEEN :from_date AND :to_date
GROUP BY group_key
ORDER BY total_metric DESC, total_rows DESC;
