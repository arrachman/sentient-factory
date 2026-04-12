CREATE TABLE IF NOT EXISTS public.dim_location (
    location_code text PRIMARY KEY,
    location_name text,
    branch_code text,
    branch_name text,
    pos_category_code text,
    is_active bigint,
    notes text,
    source_payload jsonb,
    etl_batch_id text,
    etl_loaded_at timestamptz NOT NULL DEFAULT now(),
    etl_updated_at timestamptz NOT NULL DEFAULT now()
);

