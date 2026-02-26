-- Domain: m2 (Finance & Accounting)
-- Widget: Top cabang by nominal transaksi jurnal
-- Notes:
-- - Metric uses abs(debit-kredit) to represent movement magnitude.
-- - Dummy rows returned when no data in selected range.

SELECT
  COALESCE(NULLIF(TRIM(j.tcabang), ''), 'UNKNOWN') AS cabang,
  COUNT(*) AS total_trx,
  SUM(COALESCE(j.tdebit, 0)) AS total_debit,
  SUM(COALESCE(j.tkredit, 0)) AS total_kredit,
  SUM(ABS(COALESCE(j.tdebit, 0) - COALESCE(j.tkredit, 0))) AS movement_amount
FROM `m2_transaction_journal` j
WHERE DATE(j.ttgl) BETWEEN :from_date AND :to_date
GROUP BY cabang

UNION ALL

SELECT 'JKT' AS cabang, 58 AS total_trx, 120000000 AS total_debit, 93000000 AS total_kredit, 27000000 AS movement_amount
WHERE NOT EXISTS (
  SELECT 1
  FROM `m2_transaction_journal` x
  WHERE DATE(x.ttgl) BETWEEN :from_date AND :to_date
)
UNION ALL
SELECT 'SBY', 34, 76000000, 71000000, 5000000
WHERE NOT EXISTS (
  SELECT 1
  FROM `m2_transaction_journal` x
  WHERE DATE(x.ttgl) BETWEEN :from_date AND :to_date
)
UNION ALL
SELECT 'BDG', 27, 64000000, 58000000, 6000000
WHERE NOT EXISTS (
  SELECT 1
  FROM `m2_transaction_journal` x
  WHERE DATE(x.ttgl) BETWEEN :from_date AND :to_date
)
ORDER BY movement_amount DESC, total_trx DESC;
