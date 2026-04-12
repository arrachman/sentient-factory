CREATE TABLE IF NOT EXISTS public.dim_size (
    size_code text PRIMARY KEY,
    size_name text,
    is_active bigint,
    notes text,
    source_payload jsonb,
    etl_batch_id text,
    etl_loaded_at timestamptz NOT NULL DEFAULT now(),
    etl_updated_at timestamptz NOT NULL DEFAULT now()
);
