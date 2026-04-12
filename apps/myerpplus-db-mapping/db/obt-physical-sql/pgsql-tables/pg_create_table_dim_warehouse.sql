CREATE TABLE IF NOT EXISTS public.dim_warehouse (
    warehouse_code text PRIMARY KEY,
    warehouse_name text,
    division_code text,
    division_name text,
    location_code text,
    location_name text,
    branch_code text,
    branch_name text,
    is_active bigint,
    booking_stock_enabled bigint,
    notes text,
    source_payload jsonb,
    etl_batch_id text,
    etl_loaded_at timestamptz NOT NULL DEFAULT now(),
    etl_updated_at timestamptz NOT NULL DEFAULT now()
);

