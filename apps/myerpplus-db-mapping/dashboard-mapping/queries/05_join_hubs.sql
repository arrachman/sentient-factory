SELECT
  hub_table,
  SUM(inbound_fk_count) AS inbound_fk_count,
  COUNT(DISTINCT referring_table) AS referring_tables,
  SUM(inbound_soft_count) AS inbound_soft_link_count,
  GROUP_CONCAT(DISTINCT referring_table ORDER BY referring_table SEPARATOR ', ') AS sample_referring_tables
FROM (
  SELECT
    kcu.referenced_table_name AS hub_table,
    kcu.table_name AS referring_table,
    1 AS inbound_fk_count,
    0 AS inbound_soft_count
  FROM information_schema.key_column_usage kcu
  WHERE kcu.table_schema = '__DB_SCHEMA__'
    AND kcu.referenced_table_name IS NOT NULL

  UNION ALL

  SELECT
    rt.table_name AS hub_table,
    c.table_name AS referring_table,
    0 AS inbound_fk_count,
    1 AS inbound_soft_count
  FROM information_schema.columns c
  JOIN information_schema.tables t
    ON t.table_schema = c.table_schema
   AND t.table_name = c.table_name
   AND t.table_type = 'BASE TABLE'
  JOIN information_schema.tables rt
    ON rt.table_schema = c.table_schema
   AND rt.table_type = 'BASE TABLE'
   AND rt.table_name IN (
     LEFT(c.column_name, CHAR_LENGTH(c.column_name) - 3),
     CONCAT(LEFT(c.column_name, CHAR_LENGTH(c.column_name) - 3), 's')
   )
  WHERE c.table_schema = '__DB_SCHEMA__'
    AND c.column_name <> 'id'
    AND c.column_name LIKE '%\_id'
    AND c.table_name <> rt.table_name
    AND EXISTS (
      SELECT 1
      FROM information_schema.columns rc
      WHERE rc.table_schema = rt.table_schema
        AND rc.table_name = rt.table_name
        AND rc.column_name = 'id'
    )
    AND NOT EXISTS (
      SELECT 1
      FROM information_schema.key_column_usage kcu2
      WHERE kcu2.table_schema = c.table_schema
        AND kcu2.table_name = c.table_name
        AND kcu2.column_name = c.column_name
        AND kcu2.referenced_table_name IS NOT NULL
    )
) rel
GROUP BY hub_table
ORDER BY (SUM(inbound_fk_count) + SUM(inbound_soft_count)) DESC, referring_tables DESC, hub_table;
