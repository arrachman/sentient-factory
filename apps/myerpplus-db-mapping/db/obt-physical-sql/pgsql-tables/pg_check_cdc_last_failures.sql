-- Show the latest failed CDC sync table refresh per output table.

WITH ranked_failures AS (
    SELECT
        tr.batch_id,
        br.domains,
        tr.table_name,
        tr.sql_file,
        tr.loaded_row_count,
        tr.status,
        tr.started_at,
        tr.finished_at,
        tr.error_message,
        row_number() OVER (
            PARTITION BY tr.table_name
            ORDER BY tr.id DESC
        ) AS rn
    FROM public.etl_cdc_sync_table_runs tr
    JOIN public.etl_cdc_sync_batch_runs br
      ON br.batch_id = tr.batch_id
    WHERE tr.status = 'failed'
)
SELECT
    batch_id,
    domains,
    table_name,
    sql_file,
    loaded_row_count,
    status,
    started_at,
    finished_at,
    error_message
FROM ranked_failures
WHERE rn = 1
ORDER BY table_name;
