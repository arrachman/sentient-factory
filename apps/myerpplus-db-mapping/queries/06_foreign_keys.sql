SELECT table_name,
       column_name,
       referenced_table_name,
       referenced_column_name,
       constraint_name
FROM information_schema.key_column_usage
WHERE table_schema = 'myerpplus'
  AND referenced_table_name IS NOT NULL
ORDER BY table_name, constraint_name, column_name;
