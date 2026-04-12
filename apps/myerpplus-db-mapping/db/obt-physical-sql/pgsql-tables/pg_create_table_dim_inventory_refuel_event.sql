CREATE TABLE IF NOT EXISTS public.dim_inventory_refuel_event (
    refuel_event_key text PRIMARY KEY,
    doc_no text,
    doc_date timestamptz,
    branch_code text,
    location_code text,
    warehouse_from_code text,
    warehouse_to_code text,
    item_id text,
    item_name text,
    qty numeric(20,6),
    amount numeric(20,6),
    notes text,
    source_payload jsonb,
    etl_batch_id text,
    etl_loaded_at timestamptz NOT NULL DEFAULT now(),
    etl_updated_at timestamptz NOT NULL DEFAULT now()
);
