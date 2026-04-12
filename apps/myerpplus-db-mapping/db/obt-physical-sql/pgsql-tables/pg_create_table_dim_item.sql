-- Physical dimension table for item master.

CREATE TABLE IF NOT EXISTS public.dim_item (
    item_id bigint PRIMARY KEY,
    item_code text,
    item_name text,
    item_type text,
    item_category_code text,
    class_product_code text,
    default_uom_code text,
    sales_uom_code text,
    branch_code text,
    location_code text,
    warehouse_code text,
    supplier_id text,
    inventory_account_code text,
    sales_account_code text,
    is_active bigint,
    active_at timestamptz,
    current_stock numeric(30,6),
    average_cost numeric(30,6),
    notes text,
    source_payload jsonb,
    etl_batch_id text,
    etl_loaded_at timestamptz NOT NULL DEFAULT now(),
    etl_updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_dim_item_code
    ON public.dim_item (item_code);

CREATE INDEX IF NOT EXISTS idx_dim_item_branch
    ON public.dim_item (branch_code);
