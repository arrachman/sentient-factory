-- Domain: m4
-- Purpose: table detail for dashboard
-- Suggested source table: m4_po

SELECT
  *
FROM `m4_po`
WHERE 1=1
AND DATE(__DATE_EXPR__) BETWEEN :from_date AND :to_date
ORDER BY `__ORDER_BY__` __ORDER_DIR__
LIMIT :limit OFFSET :offset;
