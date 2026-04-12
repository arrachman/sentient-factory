CREATE TABLE IF NOT EXISTS public.dim_cost_center (
    cost_center_code text PRIMARY KEY,
    cost_center_name text,
    division_code text,
    account_code text,
    is_active bigint,
    notes text,
    source_payload jsonb,
    etl_batch_id text,
    etl_loaded_at timestamptz NOT NULL DEFAULT now(),
    etl_updated_at timestamptz NOT NULL DEFAULT now()
);

