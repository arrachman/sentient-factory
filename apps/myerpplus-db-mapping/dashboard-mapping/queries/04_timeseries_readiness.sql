SELECT
  t.table_name,
  t.table_rows AS approx_rows,
  SUM(c.data_type IN ('date','datetime','timestamp')) AS date_columns,
  SUM(c.data_type IN ('int','bigint','decimal','numeric','float','double')) AS numeric_columns,
  MAX(c.column_name REGEXP 'created_at|createdon|transaction_date|trx_date|tanggal|date') AS has_primary_time_hint,
  CASE
    WHEN SUM(c.data_type IN ('date','datetime','timestamp')) > 0
     AND SUM(c.data_type IN ('int','bigint','decimal','numeric','float','double')) > 0
      THEN 'ready'
    WHEN SUM(c.data_type IN ('date','datetime','timestamp')) > 0
      THEN 'partial'
    ELSE 'not_ready'
  END AS timeseries_readiness
FROM information_schema.tables t
JOIN information_schema.columns c
  ON c.table_schema = t.table_schema
 AND c.table_name = t.table_name
WHERE t.table_schema = '__DB_SCHEMA__'
  AND t.table_type = 'BASE TABLE'
GROUP BY t.table_name, t.table_rows
ORDER BY FIELD(timeseries_readiness, 'ready', 'partial', 'not_ready'), approx_rows DESC;
