-- Domain: m2 (Finance & Accounting)
-- Widget: KPI cards (single row)
-- Notes:
-- - Dummy values are returned when no rows exist in selected range.
-- - Main source: m2_transaction_journal

SELECT
  CASE WHEN COUNT(*) = 0 THEN 120 ELSE COUNT(*) END AS total_journal_rows,
  CASE WHEN COUNT(*) = 0 THEN 250000000 ELSE SUM(COALESCE(tdebit, 0)) END AS total_debit,
  CASE WHEN COUNT(*) = 0 THEN 210000000 ELSE SUM(COALESCE(tkredit, 0)) END AS total_kredit,
  CASE WHEN COUNT(*) = 0 THEN 40000000 ELSE (SUM(COALESCE(tdebit, 0)) - SUM(COALESCE(tkredit, 0))) END AS net_cashflow,
  CASE WHEN COUNT(*) = 0 THEN 6 ELSE COUNT(DISTINCT tcabang) END AS total_cabang,
  CASE WHEN COUNT(*) = 0 THEN 4 ELSE COUNT(DISTINCT COALESCE(tsumber, 'UNKNOWN')) END AS total_sumber
FROM `m2_transaction_journal`
WHERE DATE(ttgl) BETWEEN :from_date AND :to_date;
