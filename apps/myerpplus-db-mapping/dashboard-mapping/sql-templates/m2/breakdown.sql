-- Domain: m2 (Finance & Accounting)
-- Widget: Breakdown komposisi sumber transaksi
-- Notes:
-- - Breakdown default by tsumber.
-- - Jika data kosong, query mengembalikan dummy categories.

SELECT
  COALESCE(NULLIF(TRIM(j.tsumber), ''), 'UNKNOWN') AS group_key,
  COUNT(*) AS total_trx,
  SUM(COALESCE(j.tdebit, 0)) AS total_debit,
  SUM(COALESCE(j.tkredit, 0)) AS total_kredit
FROM `m2_transaction_journal` j
WHERE DATE(j.ttgl) BETWEEN :from_date AND :to_date
GROUP BY group_key

UNION ALL

SELECT 'CR' AS group_key, 28 AS total_trx, 120000000 AS total_debit, 20000000 AS total_kredit
WHERE NOT EXISTS (
  SELECT 1
  FROM `m2_transaction_journal` x
  WHERE DATE(x.ttgl) BETWEEN :from_date AND :to_date
)
UNION ALL
SELECT 'CD', 18, 20000000, 97000000
WHERE NOT EXISTS (
  SELECT 1
  FROM `m2_transaction_journal` x
  WHERE DATE(x.ttgl) BETWEEN :from_date AND :to_date
)
UNION ALL
SELECT 'GJ', 36, 50000000, 43000000
WHERE NOT EXISTS (
  SELECT 1
  FROM `m2_transaction_journal` x
  WHERE DATE(x.ttgl) BETWEEN :from_date AND :to_date
)
ORDER BY total_debit DESC, total_trx DESC;
