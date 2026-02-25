SELECT
  c.table_name,
  c.column_name,
  c.data_type,
  c.column_type,
  c.is_nullable,
  CASE
    WHEN c.column_name REGEXP 'status|state|active|enabled' THEN 'status'
    WHEN c.column_name REGEXP 'type|category|group|class' THEN 'classification'
    WHEN c.column_name REGEXP 'branch|warehouse|store|location|city|region|area' THEN 'location'
    WHEN c.column_name REGEXP 'customer|vendor|supplier|employee|sales' THEN 'actor'
    WHEN c.column_name REGEXP 'department|dept|division|unit' THEN 'organization'
    ELSE 'other'
  END AS dimension_group
FROM information_schema.columns c
JOIN information_schema.tables t
  ON t.table_schema = c.table_schema
 AND t.table_name = c.table_name
WHERE c.table_schema = '__DB_SCHEMA__'
  AND t.table_type = 'BASE TABLE'
  AND (
    c.column_name REGEXP 'status|state|active|enabled|type|category|group|class|branch|warehouse|store|location|city|region|area|customer|vendor|supplier|employee|sales|department|dept|division|unit'
  )
ORDER BY c.table_name, dimension_group, c.ordinal_position;
