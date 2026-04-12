CREATE TABLE IF NOT EXISTS public.dim_item_supplier (
    item_id bigint NOT NULL,
    contact_id bigint NOT NULL,
    supplier_order bigint,
    notes text,
    etl_batch_id text,
    etl_loaded_at timestamptz NOT NULL DEFAULT now(),
    etl_updated_at timestamptz NOT NULL DEFAULT now(),
    source_payload jsonb,
    PRIMARY KEY (item_id, contact_id)
);
