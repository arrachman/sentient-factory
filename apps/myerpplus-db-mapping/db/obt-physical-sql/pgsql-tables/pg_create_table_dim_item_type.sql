CREATE TABLE IF NOT EXISTS public.dim_item_type (
    item_type_code text PRIMARY KEY,
    item_type_name text,
    is_active bigint,
    notes text,
    source_payload jsonb,
    etl_batch_id text,
    etl_loaded_at timestamptz NOT NULL DEFAULT now(),
    etl_updated_at timestamptz NOT NULL DEFAULT now()
);
