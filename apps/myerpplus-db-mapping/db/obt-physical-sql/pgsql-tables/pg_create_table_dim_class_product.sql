CREATE TABLE IF NOT EXISTS public.dim_class_product (
    class_product_code text PRIMARY KEY,
    class_product_name text,
    is_active bigint,
    notes text,
    source_payload jsonb,
    etl_batch_id text,
    etl_loaded_at timestamptz NOT NULL DEFAULT now(),
    etl_updated_at timestamptz NOT NULL DEFAULT now()
);
