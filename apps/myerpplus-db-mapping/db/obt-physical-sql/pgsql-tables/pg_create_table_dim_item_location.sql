CREATE TABLE IF NOT EXISTS public.dim_item_location (
    item_location_id bigint PRIMARY KEY,
    location_code text,
    location_name text,
    warehouse_code text,
    etl_batch_id text,
    etl_loaded_at timestamptz NOT NULL DEFAULT now(),
    etl_updated_at timestamptz NOT NULL DEFAULT now(),
    source_payload jsonb
);
