CREATE TABLE IF NOT EXISTS public.dim_terms (
    terms_code text PRIMARY KEY,
    terms_name text,
    due_days bigint,
    discount_days_1 bigint,
    discount_percent_1 numeric(30,6),
    discount_days_2 bigint,
    discount_percent_2 numeric(30,6),
    penalty_percent numeric(30,6),
    is_active bigint,
    notes text,
    source_payload jsonb,
    etl_batch_id text,
    etl_loaded_at timestamptz NOT NULL DEFAULT now(),
    etl_updated_at timestamptz NOT NULL DEFAULT now()
);

