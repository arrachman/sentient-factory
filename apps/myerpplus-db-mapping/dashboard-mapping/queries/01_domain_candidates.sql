SELECT
  t.table_name,
  COALESCE(NULLIF(SUBSTRING_INDEX(t.table_name, '_', 1), ''), t.table_name) AS guessed_domain,
  t.table_rows AS approx_rows,
  SUM(c.column_name IN ('created_at','createdon','tanggal','date','trx_date','transaction_date')) AS time_column_hits,
  SUM(c.data_type IN ('int','bigint','decimal','numeric','float','double')) AS numeric_column_count,
  SUM(c.column_name REGEXP 'status|state|type|category|dept|warehouse|branch|region|customer|vendor') AS dimension_hint_count
FROM information_schema.tables t
JOIN information_schema.columns c
  ON c.table_schema = t.table_schema
 AND c.table_name = t.table_name
WHERE t.table_schema = '__DB_SCHEMA__'
  AND t.table_type = 'BASE TABLE'
GROUP BY t.table_name, guessed_domain, t.table_rows
ORDER BY guessed_domain, numeric_column_count DESC, approx_rows DESC;
