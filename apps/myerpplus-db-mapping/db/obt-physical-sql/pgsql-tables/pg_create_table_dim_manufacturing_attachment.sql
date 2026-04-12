CREATE TABLE IF NOT EXISTS public.dim_manufacturing_attachment (
    attachment_key text PRIMARY KEY,
    source_doc_type text,
    source_header_id text,
    file_name text,
    file_date timestamptz,
    note_text text,
    input_user_id text,
    source_payload jsonb,
    etl_batch_id text,
    etl_loaded_at timestamptz NOT NULL DEFAULT now(),
    etl_updated_at timestamptz NOT NULL DEFAULT now()
);
