-- Domain: m2 (Finance & Accounting)
-- Widget: Cash In vs Cash Out per bulan
-- Notes:
-- - Cash In  = m2_cr + m2_rm (header amount field: *jumlah)
-- - Cash Out = m2_cd + m2_sm (header amount field: *jumlah)
-- - Dummy rows returned when data is empty in selected range.

SELECT
  y.period_ym,
  SUM(y.cash_in) AS cash_in,
  SUM(y.cash_out) AS cash_out,
  SUM(y.cash_in) - SUM(y.cash_out) AS net_cashflow
FROM (
  SELECT DATE_FORMAT(cr.crtgl, '%Y-%m') AS period_ym, SUM(COALESCE(cr.crjumlah, 0)) AS cash_in, 0 AS cash_out
  FROM `m2_cr` cr
  WHERE DATE(cr.crtgl) BETWEEN :from_date AND :to_date
  GROUP BY DATE_FORMAT(cr.crtgl, '%Y-%m')

  UNION ALL

  SELECT DATE_FORMAT(rm.rmtgl, '%Y-%m') AS period_ym, SUM(COALESCE(rm.rmjumlah, 0)) AS cash_in, 0 AS cash_out
  FROM `m2_rm` rm
  WHERE DATE(rm.rmtgl) BETWEEN :from_date AND :to_date
  GROUP BY DATE_FORMAT(rm.rmtgl, '%Y-%m')

  UNION ALL

  SELECT DATE_FORMAT(cd.cdtgl, '%Y-%m') AS period_ym, 0 AS cash_in, SUM(COALESCE(cd.cdjumlah, 0)) AS cash_out
  FROM `m2_cd` cd
  WHERE DATE(cd.cdtgl) BETWEEN :from_date AND :to_date
  GROUP BY DATE_FORMAT(cd.cdtgl, '%Y-%m')

  UNION ALL

  SELECT DATE_FORMAT(sm.smtgl, '%Y-%m') AS period_ym, 0 AS cash_in, SUM(COALESCE(sm.smjumlah, 0)) AS cash_out
  FROM `m2_sm` sm
  WHERE DATE(sm.smtgl) BETWEEN :from_date AND :to_date
  GROUP BY DATE_FORMAT(sm.smtgl, '%Y-%m')
) y
GROUP BY y.period_ym

UNION ALL

SELECT '2025-10' AS period_ym, 65000000 AS cash_in, 47000000 AS cash_out, 18000000 AS net_cashflow
WHERE NOT EXISTS (
  SELECT 1 FROM `m2_cr` x WHERE DATE(x.crtgl) BETWEEN :from_date AND :to_date
  UNION ALL
  SELECT 1 FROM `m2_rm` x WHERE DATE(x.rmtgl) BETWEEN :from_date AND :to_date
  UNION ALL
  SELECT 1 FROM `m2_cd` x WHERE DATE(x.cdtgl) BETWEEN :from_date AND :to_date
  UNION ALL
  SELECT 1 FROM `m2_sm` x WHERE DATE(x.smtgl) BETWEEN :from_date AND :to_date
)
UNION ALL
SELECT '2025-11', 69000000, 52000000, 17000000
WHERE NOT EXISTS (
  SELECT 1 FROM `m2_cr` x WHERE DATE(x.crtgl) BETWEEN :from_date AND :to_date
  UNION ALL
  SELECT 1 FROM `m2_rm` x WHERE DATE(x.rmtgl) BETWEEN :from_date AND :to_date
  UNION ALL
  SELECT 1 FROM `m2_cd` x WHERE DATE(x.cdtgl) BETWEEN :from_date AND :to_date
  UNION ALL
  SELECT 1 FROM `m2_sm` x WHERE DATE(x.smtgl) BETWEEN :from_date AND :to_date
)
UNION ALL
SELECT '2025-12', 72000000, 58000000, 14000000
WHERE NOT EXISTS (
  SELECT 1 FROM `m2_cr` x WHERE DATE(x.crtgl) BETWEEN :from_date AND :to_date
  UNION ALL
  SELECT 1 FROM `m2_rm` x WHERE DATE(x.rmtgl) BETWEEN :from_date AND :to_date
  UNION ALL
  SELECT 1 FROM `m2_cd` x WHERE DATE(x.cdtgl) BETWEEN :from_date AND :to_date
  UNION ALL
  SELECT 1 FROM `m2_sm` x WHERE DATE(x.smtgl) BETWEEN :from_date AND :to_date
)
ORDER BY period_ym ASC;
