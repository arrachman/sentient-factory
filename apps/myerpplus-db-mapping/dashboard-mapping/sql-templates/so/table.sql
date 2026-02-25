-- Domain: so
-- Purpose: table detail

SELECT
  h.soid,
  h.sotgl,
  h.socustomer,
  h.sobagianpenjualan,
  h.sostatus,
  CASE h.sostatus
    WHEN 0 THEN 'draft'
    WHEN 1 THEN 'open'
    WHEN 2 THEN 'posted'
    WHEN 3 THEN 'closed'
    ELSE CONCAT('unknown_', COALESCE(CAST(h.sostatus AS CHAR), 'null'))
  END AS sostatus_label,
  h.sostatusrealisasi,
  CASE h.sostatusrealisasi
    WHEN 0 THEN 'not_realized'
    WHEN 1 THEN 'partial'
    WHEN 2 THEN 'full'
    ELSE CONCAT('unknown_', COALESCE(CAST(h.sostatusrealisasi AS CHAR), 'null'))
  END AS sostatusrealisasi_label,
  COALESCE(d.total_lines, 0) AS total_lines,
  COALESCE(d.total_qty, 0) AS total_qty,
  COALESCE(h.sototal, 0) AS subtotal_before_discount_tax,
  COALESCE(h.sojmldiskon, 0) AS total_discount,
  (COALESCE(h.sototalpajak1detail, 0) + COALESCE(h.sototalpajak2detail, 0)) AS total_tax,
  COALESCE(h.sobiayalain, 0) AS total_other_cost,
  COALESCE(h.sototaltransaksi, 0) AS grand_total,
  COALESCE(h.sojmlbayar, 0) AS total_paid
FROM `m5_so` h
LEFT JOIN (
  SELECT
    idso,
    COUNT(*) AS total_lines,
    SUM(COALESCE(jml, 0)) AS total_qty
  FROM `m5_so_detail`
  GROUP BY idso
) d ON d.idso = h.soid
WHERE DATE(h.sotgl) BETWEEN :from_date AND :to_date
ORDER BY __ORDER_BY__ __ORDER_DIR__
LIMIT :limit OFFSET :offset;
