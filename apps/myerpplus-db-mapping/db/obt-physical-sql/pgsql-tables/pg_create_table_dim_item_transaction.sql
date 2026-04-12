CREATE TABLE IF NOT EXISTS public.dim_item_transaction (
    transaction_id bigint PRIMARY KEY,
    branch_code text,
    location_code text,
    warehouse_code text,
    mutation_type text,
    source_code text,
    source_header_id text,
    source_detail_id text,
    doc_no text,
    doc_date timestamptz,
    contact_id text,
    item_id bigint,
    item_name text,
    item_type text,
    qty numeric(30,6),
    uom_code text,
    qty_item numeric(30,6),
    amount numeric(30,6),
    currency_code text,
    exchange_rate numeric(30,6),
    notes text,
    source_payload jsonb,
    etl_batch_id text,
    etl_loaded_at timestamptz NOT NULL DEFAULT now(),
    etl_updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_dim_item_transaction_item_id
    ON public.dim_item_transaction (item_id);

CREATE INDEX IF NOT EXISTS idx_dim_item_transaction_doc_date
    ON public.dim_item_transaction (doc_date);
