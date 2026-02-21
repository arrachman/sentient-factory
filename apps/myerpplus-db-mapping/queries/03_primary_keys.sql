SELECT table_name,
       GROUP_CONCAT(column_name ORDER BY ordinal_position) AS pk_columns
FROM information_schema.key_column_usage
WHERE table_schema = 'myerpplus'
  AND constraint_name = 'PRIMARY'
GROUP BY table_name
ORDER BY table_name;
