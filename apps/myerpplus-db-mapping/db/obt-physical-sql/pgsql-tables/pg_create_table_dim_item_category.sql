CREATE TABLE IF NOT EXISTS public.dim_item_category (
    category_code text PRIMARY KEY,
    category_name text,
    division_code text,
    subdivision_code text,
    inventory_account_code text,
    cogs_account_code text,
    sales_account_code text,
    is_active bigint,
    notes text,
    source_payload jsonb,
    etl_batch_id text,
    etl_loaded_at timestamptz NOT NULL DEFAULT now(),
    etl_updated_at timestamptz NOT NULL DEFAULT now()
);
