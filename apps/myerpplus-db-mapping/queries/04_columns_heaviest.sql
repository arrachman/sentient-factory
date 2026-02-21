SELECT table_name,
       COUNT(*) AS total_columns
FROM information_schema.columns
WHERE table_schema = 'myerpplus'
GROUP BY table_name
ORDER BY total_columns DESC, table_name
LIMIT 100;
