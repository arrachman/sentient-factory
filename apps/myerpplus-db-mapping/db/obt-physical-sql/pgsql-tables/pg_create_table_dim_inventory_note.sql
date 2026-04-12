CREATE TABLE IF NOT EXISTS public.dim_inventory_note (
    note_id text PRIMARY KEY,
    source_code text,
    source_transaction_id text,
    note_code text,
    note_text text,
    source_payload jsonb,
    etl_batch_id text,
    etl_loaded_at timestamptz NOT NULL DEFAULT now(),
    etl_updated_at timestamptz NOT NULL DEFAULT now()
);
