CREATE TABLE IF NOT EXISTS public.dim_finance_note (
    note_id text PRIMARY KEY,
    source_code text,
    source_header_id text,
    notes text,
    input_user_id text,
    input_user_name text,
    input_at timestamptz,
    modified_user_id text,
    modified_user_name text,
    modified_at timestamptz,
    source_payload jsonb,
    etl_batch_id text,
    etl_loaded_at timestamptz NOT NULL DEFAULT now(),
    etl_updated_at timestamptz NOT NULL DEFAULT now()
);
