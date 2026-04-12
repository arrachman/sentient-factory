CREATE TABLE IF NOT EXISTS public.dim_contact_price (
    contact_id bigint NOT NULL,
    item_id bigint NOT NULL,
    uom_code text NOT NULL,
    buy_price numeric(30,6),
    sell_price numeric(30,6),
    effective_from timestamptz,
    effective_to timestamptz,
    notes text,
    etl_batch_id text,
    etl_loaded_at timestamptz NOT NULL DEFAULT now(),
    etl_updated_at timestamptz NOT NULL DEFAULT now(),
    source_payload jsonb,
    PRIMARY KEY (contact_id, item_id, uom_code)
);
