-- Domain: m5
-- Purpose: table detail for dashboard
-- Suggested source table: m5_ic_detail_history

SELECT
  *
FROM `m5_ic_detail_history`
WHERE 1=1
AND DATE(__DATE_EXPR__) BETWEEN :from_date AND :to_date
ORDER BY `__ORDER_BY__` __ORDER_DIR__
LIMIT :limit OFFSET :offset;
