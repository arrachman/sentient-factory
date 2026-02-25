-- Domain: so
-- Purpose: breakdown by customer key
-- Note: `socustomer` is numeric key. Join to customer master if display name is needed.

SELECT
  CAST(h.socustomer AS CHAR) AS customer_key,
  CONCAT('customer_', COALESCE(CAST(h.socustomer AS CHAR), 'null')) AS customer_label,
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
GROUP BY customer_key, customer_label
ORDER BY grand_total DESC, total_so DESC;
