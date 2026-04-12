CREATE TABLE IF NOT EXISTS public.dim_price_category (
    price_category_code text PRIMARY KEY,
    price_category_name text,
    is_active bigint,
    notes text,
    etl_batch_id text,
    etl_loaded_at timestamptz NOT NULL DEFAULT now(),
    etl_updated_at timestamptz NOT NULL DEFAULT now(),
    source_payload jsonb
);
