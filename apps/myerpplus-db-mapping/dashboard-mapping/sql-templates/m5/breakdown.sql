-- Domain: m5
-- Purpose: grouped breakdown chart
-- Suggested filter source: m5_as.asstatusbayar

SELECT
  COALESCE(CAST(`__GROUP_BY__` AS CHAR), 'UNKNOWN') AS group_key,
  COUNT(*) AS total_rows,
  SUM(COALESCE(`asid`, 0)) AS total_metric
FROM `m5_as`
WHERE 1=1
AND DATE(__DATE_EXPR__) BETWEEN :from_date AND :to_date
GROUP BY group_key
ORDER BY total_metric DESC, total_rows DESC;
