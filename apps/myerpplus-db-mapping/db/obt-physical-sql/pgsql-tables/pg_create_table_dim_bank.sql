CREATE TABLE IF NOT EXISTS public.dim_bank (
    bank_code text PRIMARY KEY,
    bank_name text,
    city text,
    is_active bigint,
    notes text,
    source_payload jsonb,
    etl_batch_id text,
    etl_loaded_at timestamptz NOT NULL DEFAULT now(),
    etl_updated_at timestamptz NOT NULL DEFAULT now()
);
