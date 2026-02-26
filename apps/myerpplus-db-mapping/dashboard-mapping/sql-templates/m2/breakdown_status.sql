-- Domain: m2 (Finance & Accounting)
-- Widget: Breakdown status jurnal
-- Notes:
-- - status_label based on tstatus.
-- - lunas_label based on tstatuslunas.
-- - Dummy rows returned when no data in selected range.

SELECT
  CAST(j.tstatus AS CHAR) AS status_key,
  CASE j.tstatus
    WHEN 0 THEN 'draft'
    WHEN 1 THEN 'open'
    WHEN 2 THEN 'posted'
    WHEN 3 THEN 'closed'
    WHEN 4 THEN 'void'
    ELSE CONCAT('unknown_', COALESCE(CAST(j.tstatus AS CHAR), 'null'))
  END AS status_label,
  CAST(j.tstatuslunas AS CHAR) AS lunas_key,
  CASE j.tstatuslunas
    WHEN 0 THEN 'unpaid'
    WHEN 1 THEN 'paid'
    ELSE CONCAT('unknown_', COALESCE(CAST(j.tstatuslunas AS CHAR), 'null'))
  END AS lunas_label,
  COUNT(*) AS total_trx,
  SUM(COALESCE(j.tdebit, 0)) AS total_debit,
  SUM(COALESCE(j.tkredit, 0)) AS total_kredit
FROM `m2_transaction_journal` j
WHERE DATE(j.ttgl) BETWEEN :from_date AND :to_date
GROUP BY status_key, status_label, lunas_key, lunas_label

UNION ALL

SELECT '2' AS status_key, 'posted' AS status_label, '0' AS lunas_key, 'unpaid' AS lunas_label, 70 AS total_trx, 130000000 AS total_debit, 99000000 AS total_kredit
WHERE NOT EXISTS (
  SELECT 1
  FROM `m2_transaction_journal` x
  WHERE DATE(x.ttgl) BETWEEN :from_date AND :to_date
)
UNION ALL
SELECT '4', 'void', '0', 'unpaid', 8, 5000000, 7000000
WHERE NOT EXISTS (
  SELECT 1
  FROM `m2_transaction_journal` x
  WHERE DATE(x.ttgl) BETWEEN :from_date AND :to_date
)
ORDER BY total_trx DESC;
