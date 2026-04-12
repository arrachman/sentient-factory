CREATE TABLE IF NOT EXISTS public.dim_type_sa (
    type_sa_code text PRIMARY KEY,
    type_sa_name text,
    account_code text,
    is_active bigint,
    notes text,
    source_payload jsonb,
    etl_batch_id text,
    etl_loaded_at timestamptz NOT NULL DEFAULT now(),
    etl_updated_at timestamptz NOT NULL DEFAULT now()
);
