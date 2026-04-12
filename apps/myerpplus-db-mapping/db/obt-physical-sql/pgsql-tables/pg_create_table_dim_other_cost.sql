CREATE TABLE IF NOT EXISTS public.dim_other_cost (
    other_cost_code text PRIMARY KEY,
    other_cost_name text,
    debit_account_code text,
    credit_account_code text,
    contact_id text,
    include_in_cogs bigint,
    notes text,
    source_payload jsonb,
    etl_batch_id text,
    etl_loaded_at timestamptz NOT NULL DEFAULT now(),
    etl_updated_at timestamptz NOT NULL DEFAULT now()
);
