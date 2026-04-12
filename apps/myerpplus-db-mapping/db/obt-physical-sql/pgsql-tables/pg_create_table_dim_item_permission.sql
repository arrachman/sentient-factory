CREATE TABLE IF NOT EXISTS public.dim_item_permission (
    permission_code text PRIMARY KEY,
    permission_name text,
    can_sell bigint,
    can_transfer_hq bigint,
    can_transfer_request bigint,
    can_branch_transfer bigint,
    can_supplier_return bigint,
    can_purchase_request bigint,
    notes text,
    source_payload jsonb,
    etl_batch_id text,
    etl_loaded_at timestamptz NOT NULL DEFAULT now(),
    etl_updated_at timestamptz NOT NULL DEFAULT now()
);
