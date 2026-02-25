-- Domain: so
-- Purpose: breakdown by SO realization status

SELECT
  CAST(h.sostatusrealisasi AS CHAR) AS realization_code,
  CASE h.sostatusrealisasi
    WHEN 0 THEN 'not_realized'
    WHEN 1 THEN 'partial'
    WHEN 2 THEN 'full'
    ELSE CONCAT('unknown_', COALESCE(CAST(h.sostatusrealisasi AS CHAR), 'null'))
  END AS realization_label,
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
GROUP BY realization_code, realization_label
ORDER BY grand_total DESC, total_so DESC;
