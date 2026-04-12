CREATE TABLE IF NOT EXISTS public.dim_unit (
    unit_code text PRIMARY KEY,
    unit_name text,
    conversion_value numeric(30,6),
    is_active bigint,
    notes text,
    source_payload jsonb,
    etl_batch_id text,
    etl_loaded_at timestamptz NOT NULL DEFAULT now(),
    etl_updated_at timestamptz NOT NULL DEFAULT now()
);
