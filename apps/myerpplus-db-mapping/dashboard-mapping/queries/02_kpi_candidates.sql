SELECT
  c.table_name,
  c.column_name,
  c.data_type,
  c.column_type,
  t.table_rows AS approx_rows,
  CASE
    WHEN c.column_name REGEXP 'qty|quantity|amount|total|price|cost|value|balance|stock|saldo|nominal|grand_total' THEN 'high'
    WHEN c.data_type IN ('int','bigint','decimal','numeric','float','double') THEN 'medium'
    ELSE 'low'
  END AS kpi_priority,
  CASE
    WHEN c.column_name REGEXP 'qty|quantity' THEN 'sum,avg'
    WHEN c.column_name REGEXP 'amount|total|price|cost|value|nominal|saldo|balance' THEN 'sum,avg,min,max'
    WHEN c.data_type IN ('int','bigint') THEN 'sum,count,avg'
    ELSE 'avg'
  END AS recommended_aggregations
FROM information_schema.columns c
JOIN information_schema.tables t
  ON t.table_schema = c.table_schema
 AND t.table_name = c.table_name
WHERE c.table_schema = '__DB_SCHEMA__'
  AND t.table_type = 'BASE TABLE'
  AND c.data_type IN ('int','bigint','decimal','numeric','float','double')
ORDER BY kpi_priority DESC, approx_rows DESC, c.table_name, c.ordinal_position;
