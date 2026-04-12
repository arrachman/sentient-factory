CREATE TABLE IF NOT EXISTS public.dim_asset_note (
    note_key text PRIMARY KEY,
    source_doc_type text,
    source_header_id text,
    note_text text,
    note_date timestamptz,
    input_user_id text,
    source_payload jsonb,
    etl_batch_id text,
    etl_loaded_at timestamptz NOT NULL DEFAULT now(),
    etl_updated_at timestamptz NOT NULL DEFAULT now()
);
