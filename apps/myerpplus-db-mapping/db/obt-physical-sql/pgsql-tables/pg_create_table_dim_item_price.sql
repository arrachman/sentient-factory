CREATE TABLE IF NOT EXISTS public.dim_item_price (
    item_id bigint NOT NULL,
    currency_code text NOT NULL,
    buy_price numeric(30,6),
    sell_price numeric(30,6),
    notes text,
    etl_batch_id text,
    etl_loaded_at timestamptz NOT NULL DEFAULT now(),
    etl_updated_at timestamptz NOT NULL DEFAULT now(),
    source_payload jsonb,
    PRIMARY KEY (item_id, currency_code)
);
