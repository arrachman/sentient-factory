-- Show the latest CDC sync batch per domain set.

WITH ranked_batches AS (
    SELECT
        batch_id,
        batch_name,
        domains,
        cdc_source_row_count,
        status,
        started_at,
        finished_at,
        notes,
        row_number() OVER (
            PARTITION BY domains
            ORDER BY batch_id DESC
        ) AS rn
    FROM public.etl_cdc_sync_batch_runs
)
SELECT
    batch_id,
    batch_name,
    domains,
    cdc_source_row_count,
    status,
    started_at,
    finished_at,
    notes
FROM ranked_batches
WHERE rn = 1
ORDER BY domains;
