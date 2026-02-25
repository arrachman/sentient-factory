-- Domain: m12
-- Purpose: table detail for dashboard
-- Suggested source table: m_12_ppv

SELECT
  *
FROM `m_12_ppv`
WHERE 1=1
AND DATE(__DATE_EXPR__) BETWEEN :from_date AND :to_date
ORDER BY `__ORDER_BY__` __ORDER_DIR__
LIMIT :limit OFFSET :offset;
