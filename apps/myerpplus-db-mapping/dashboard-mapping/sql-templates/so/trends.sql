-- Domain: so
-- Purpose: daily sales order trend

-- Financial trend uses header totals. Qty trend uses detail aggregate per SO.

SELECT
  DATE(h.sotgl) AS period_date,
  COUNT(*) AS total_so,
  SUM(COALESCE(h.sototaltransaksi, 0)) AS grand_total,
  SUM(COALESCE(h.sojmldiskon, 0)) AS total_discount,
  SUM(COALESCE(h.sototalpajak1detail, 0) + COALESCE(h.sototalpajak2detail, 0)) AS total_tax,
  SUM(COALESCE(d.total_qty, 0)) AS total_qty
FROM `m5_so` h
LEFT JOIN (
  SELECT idso, SUM(COALESCE(jml, 0)) AS total_qty
  FROM `m5_so_detail`
  GROUP BY idso
) d ON d.idso = h.soid
WHERE DATE(h.sotgl) BETWEEN :from_date AND :to_date
GROUP BY period_date
ORDER BY period_date ASC;
