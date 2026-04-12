CREATE TABLE IF NOT EXISTS public.dim_transaction_note_detail (
    source_code text NOT NULL,
    note_code text NOT NULL,
    note_detail text,
    is_active bigint,
    source_payload jsonb,
    etl_batch_id text,
    etl_loaded_at timestamptz NOT NULL DEFAULT now(),
    etl_updated_at timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (source_code, note_code)
);
