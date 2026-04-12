CREATE TABLE IF NOT EXISTS public.dim_salesman_category (
    category_code text PRIMARY KEY,
    category_name text,
    area_code text,
    is_active bigint,
    notes text,
    source_payload jsonb,
    etl_batch_id text,
    etl_loaded_at timestamptz NOT NULL DEFAULT now(),
    etl_updated_at timestamptz NOT NULL DEFAULT now()
);
