-- Domain: so
-- Purpose: breakdown by SO status

SELECT
  CAST(h.sostatus AS CHAR) AS status_code,
  CASE h.sostatus
    WHEN 0 THEN 'draft'
    WHEN 1 THEN 'open'
    WHEN 2 THEN 'posted'
    WHEN 3 THEN 'closed'
    ELSE CONCAT('unknown_', COALESCE(CAST(h.sostatus AS CHAR), 'null'))
  END AS status_label,
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
GROUP BY status_code, status_label
ORDER BY grand_total DESC, total_so DESC;
