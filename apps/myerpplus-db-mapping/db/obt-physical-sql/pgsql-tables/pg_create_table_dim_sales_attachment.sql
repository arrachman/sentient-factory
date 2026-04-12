CREATE TABLE IF NOT EXISTS public.dim_sales_attachment (
    source_code text NOT NULL,
    source_header_id text NOT NULL,
    file_name text NOT NULL,
    file_date timestamptz,
    notes text,
    file_size_bytes bigint,
    input_user_id text,
    input_user_name text,
    input_at timestamptz,
    source_payload jsonb,
    etl_batch_id text,
    etl_loaded_at timestamptz NOT NULL DEFAULT now(),
    etl_updated_at timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (source_code, source_header_id, file_name, file_date)
);
