-- Domain: m2
-- Purpose: KPI cards summary
-- Suggested metric source: m2_transaction_journal.tid

SELECT
  COUNT(*) AS total_rows,
  SUM(COALESCE(`tid`, 0)) AS total_metric,
  AVG(COALESCE(`tid`, 0)) AS avg_metric,
  MIN(COALESCE(`tid`, 0)) AS min_metric,
  MAX(COALESCE(`tid`, 0)) AS max_metric
FROM `m2_transaction_journal`
WHERE 1=1
AND DATE(__DATE_EXPR__) BETWEEN :from_date AND :to_date;
