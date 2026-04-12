CREATE TABLE IF NOT EXISTS public.dim_tax (
    tax_code text PRIMARY KEY,
    tax_name text,
    tax_rate numeric(30,6),
    purchase_account_code text,
    sales_account_code text,
    is_active bigint,
    notes text,
    source_payload jsonb,
    etl_batch_id text,
    etl_loaded_at timestamptz NOT NULL DEFAULT now(),
    etl_updated_at timestamptz NOT NULL DEFAULT now()
);
