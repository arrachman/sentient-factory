SELECT table_name,
       engine,
       table_rows,
       ROUND((data_length + index_length) / 1024 / 1024, 2) AS size_mb,
       create_time,
       update_time
FROM information_schema.tables
WHERE table_schema = 'myerpplus'
ORDER BY table_name;
