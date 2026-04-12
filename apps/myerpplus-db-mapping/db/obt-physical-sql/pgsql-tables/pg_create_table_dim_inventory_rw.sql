CREATE TABLE IF NOT EXISTS public.dim_inventory_rw (
    rw_key text PRIMARY KEY,
    doc_no text,
    doc_date timestamptz,
    branch_code text,
    location_code text,
    vehicle_no text,
    driver_name text,
    gross_weight numeric(20,6),
    tare_weight numeric(20,6),
    net_weight numeric(20,6),
    price numeric(20,6),
    notes text,
    source_payload jsonb,
    etl_batch_id text,
    etl_loaded_at timestamptz NOT NULL DEFAULT now(),
    etl_updated_at timestamptz NOT NULL DEFAULT now()
);
