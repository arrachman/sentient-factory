SELECT SUBSTRING_INDEX(table_name, '_', 1) AS module_prefix,
       COUNT(*) AS total_tables
FROM information_schema.tables
WHERE table_schema = 'myerpplus'
GROUP BY module_prefix
ORDER BY total_tables DESC, module_prefix;
