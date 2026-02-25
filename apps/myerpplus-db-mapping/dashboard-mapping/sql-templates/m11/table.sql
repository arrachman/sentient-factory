-- Domain: m11
-- Purpose: table detail for dashboard
-- Suggested source table: m_11_ak

SELECT
  *
FROM `m_11_ak`
WHERE 1=1
AND DATE(__DATE_EXPR__) BETWEEN :from_date AND :to_date
ORDER BY `__ORDER_BY__` __ORDER_DIR__
LIMIT :limit OFFSET :offset;
