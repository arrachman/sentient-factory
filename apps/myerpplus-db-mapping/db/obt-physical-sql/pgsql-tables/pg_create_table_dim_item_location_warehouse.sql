CREATE TABLE IF NOT EXISTS public.dim_item_location_warehouse (
    item_id bigint NOT NULL,
    warehouse_code text NOT NULL,
    item_location_id bigint NOT NULL,
    item_code text,
    location_code text,
    location_name text,
    etl_batch_id text,
    etl_loaded_at timestamptz NOT NULL DEFAULT now(),
    etl_updated_at timestamptz NOT NULL DEFAULT now(),
    source_payload jsonb,
    PRIMARY KEY (item_id, warehouse_code, item_location_id)
);
