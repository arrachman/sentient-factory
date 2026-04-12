-- Physical dimension table for item stock by warehouse.

CREATE TABLE IF NOT EXISTS public.dim_item_warehouse_stock (
    item_id bigint NOT NULL,
    warehouse_code text NOT NULL,
    item_code text,
    item_name text,
    item_type text,
    item_category_code text,
    default_uom_code text,
    sales_uom_code text,
    branch_code text,
    branch_name text,
    location_code text,
    location_name text,
    warehouse_name text,
    supplier_id text,
    is_active bigint,
    active_at timestamptz,
    current_stock numeric(30,6),
    average_cost numeric(30,6),
    source_payload jsonb,
    etl_batch_id text,
    etl_loaded_at timestamptz NOT NULL DEFAULT now(),
    etl_updated_at timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (item_id, warehouse_code)
);

CREATE INDEX IF NOT EXISTS idx_dim_item_warehouse_stock_item_code
    ON public.dim_item_warehouse_stock (item_code);

CREATE INDEX IF NOT EXISTS idx_dim_item_warehouse_stock_warehouse
    ON public.dim_item_warehouse_stock (warehouse_code);

CREATE INDEX IF NOT EXISTS idx_dim_item_warehouse_stock_branch
    ON public.dim_item_warehouse_stock (branch_code);
