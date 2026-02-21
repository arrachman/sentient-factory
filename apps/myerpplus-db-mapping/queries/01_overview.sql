SELECT NOW() AS generated_at, 'myerpplus' AS schema_name;

SELECT COUNT(*) AS total_tables
FROM information_schema.tables
WHERE table_schema = 'myerpplus';

SELECT COUNT(*) AS total_columns
FROM information_schema.columns
WHERE table_schema = 'myerpplus';

SELECT COUNT(DISTINCT table_name) AS tables_with_primary_key
FROM information_schema.table_constraints
WHERE table_schema = 'myerpplus'
  AND constraint_type = 'PRIMARY KEY';

SELECT COUNT(*) AS foreign_key_relations
FROM information_schema.key_column_usage
WHERE table_schema = 'myerpplus'
  AND referenced_table_name IS NOT NULL;
