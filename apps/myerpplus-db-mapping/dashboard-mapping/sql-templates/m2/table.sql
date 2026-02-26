-- Domain: m2 (Finance & Accounting)
-- Widget: detail transaksi jurnal
-- Safe default order: ttgl DESC, tid DESC
-- Notes:
-- - If no data in selected range, returns 1 dummy row for UI rendering.

SELECT
  j.tid,
  DATE(j.ttgl) AS trx_date,
  j.tcabang AS cabang,
  j.tsumber AS sumber,
  j.tnotransaksi AS no_transaksi,
  j.tkontak AS kontak_id,
  j.tmatauang AS mata_uang,
  COALESCE(j.tdebit, 0) AS debit,
  COALESCE(j.tkredit, 0) AS kredit,
  (COALESCE(j.tdebit, 0) - COALESCE(j.tkredit, 0)) AS net_amount,
  j.tstatus,
  j.tstatuslunas,
  j.turaian
FROM `m2_transaction_journal` j
WHERE DATE(j.ttgl) BETWEEN :from_date AND :to_date

UNION ALL

SELECT
  0 AS tid,
  DATE('2025-12-31') AS trx_date,
  'DUMMY' AS cabang,
  'CR' AS sumber,
  'DUMMY-TRX-001' AS no_transaksi,
  0 AS kontak_id,
  'IDR' AS mata_uang,
  12500000 AS debit,
  0 AS kredit,
  12500000 AS net_amount,
  2 AS tstatus,
  0 AS tstatuslunas,
  'Dummy row (no data in selected period)' AS turaian
WHERE NOT EXISTS (
  SELECT 1
  FROM `m2_transaction_journal` x
  WHERE DATE(x.ttgl) BETWEEN :from_date AND :to_date
)
ORDER BY trx_date DESC, tid DESC
LIMIT :limit OFFSET :offset;
