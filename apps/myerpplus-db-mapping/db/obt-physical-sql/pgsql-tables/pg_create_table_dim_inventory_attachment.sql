CREATE TABLE IF NOT EXISTS public.dim_inventory_attachment (
    attachment_key text PRIMARY KEY,
    source_code text,
    source_transaction_id text,
    file_name text,
    input_at timestamptz,
    source_payload jsonb,
    etl_batch_id text,
    etl_loaded_at timestamptz NOT NULL DEFAULT now(),
    etl_updated_at timestamptz NOT NULL DEFAULT now()
);
