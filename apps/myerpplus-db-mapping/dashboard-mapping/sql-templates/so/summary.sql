-- Domain: so
-- Purpose: KPI cards summary

-- Note:
-- - Financial totals use header table (m5_so) to avoid line-level duplication.
-- - Quantity/line metrics use pre-aggregated detail table.

SELECT
  COUNT(*) AS total_so,
  SUM(COALESCE(d.total_lines, 0)) AS total_detail_rows,
  SUM(COALESCE(d.total_qty, 0)) AS total_qty,
  SUM(COALESCE(h.sototal, 0)) AS subtotal_before_discount_tax,
  SUM(COALESCE(h.sojmldiskon, 0)) AS total_discount,
  SUM(COALESCE(h.sototalpajak1detail, 0) + COALESCE(h.sototalpajak2detail, 0)) AS total_tax,
  SUM(COALESCE(h.sobiayalain, 0)) AS total_other_cost,
  SUM(COALESCE(h.sototaltransaksi, 0)) AS grand_total,
  SUM(COALESCE(h.sojmlbayar, 0)) AS total_paid
FROM `m5_so` h
LEFT JOIN (
  SELECT
    idso,
    COUNT(*) AS total_lines,
    SUM(COALESCE(jml, 0)) AS total_qty
  FROM `m5_so_detail`
  GROUP BY idso
) d ON d.idso = h.soid
WHERE DATE(h.sotgl) BETWEEN :from_date AND :to_date;
