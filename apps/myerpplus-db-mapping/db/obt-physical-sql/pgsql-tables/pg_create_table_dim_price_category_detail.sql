CREATE TABLE IF NOT EXISTS public.dim_price_category_detail (
    price_category_code text NOT NULL,
    item_id bigint NOT NULL,
    min_stock numeric(30,6),
    max_stock numeric(30,6),
    reorder_stock numeric(30,6),
    min_order_stock numeric(30,6),
    sell_price_1 numeric(30,6),
    sell_price_2 numeric(30,6),
    sell_price_3 numeric(30,6),
    sell_price_4 numeric(30,6),
    sell_price_5 numeric(30,6),
    etl_batch_id text,
    etl_loaded_at timestamptz NOT NULL DEFAULT now(),
    etl_updated_at timestamptz NOT NULL DEFAULT now(),
    source_payload jsonb,
    PRIMARY KEY (price_category_code, item_id)
);
