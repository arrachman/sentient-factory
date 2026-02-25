-- Domain: so
-- Purpose: breakdown by salesman / sales department key
-- Note: `sobagianpenjualan` is numeric key. Join to master table if display name is needed.

SELECT
  CAST(h.sobagianpenjualan AS CHAR) AS salesman_key,
  CONCAT('sales_', COALESCE(CAST(h.sobagianpenjualan AS CHAR), 'null')) AS salesman_label,
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
GROUP BY salesman_key, salesman_label
ORDER BY grand_total DESC, total_so DESC;
