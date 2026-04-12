CREATE TABLE IF NOT EXISTS public.dim_coa (
    account_code text PRIMARY KEY,
    account_name text,
    account_type text,
    debit_credit_flag text,
    parent_account_code text,
    branch_code text,
    location_code text,
    division_code text,
    is_active bigint,
    source_payload jsonb,
    etl_batch_id text,
    etl_loaded_at timestamptz NOT NULL DEFAULT now(),
    etl_updated_at timestamptz NOT NULL DEFAULT now()
);

