CREATE TABLE IF NOT EXISTS public.dim_inventory_daily_check (
    daily_check_key text PRIMARY KEY,
    doc_no text,
    doc_date timestamptz,
    branch_code text,
    location_code text,
    shift_code text,
    item_id text,
    item_name text,
    check_category_id text,
    check_status text,
    notes text,
    source_payload jsonb,
    etl_batch_id text,
    etl_loaded_at timestamptz NOT NULL DEFAULT now(),
    etl_updated_at timestamptz NOT NULL DEFAULT now()
);
