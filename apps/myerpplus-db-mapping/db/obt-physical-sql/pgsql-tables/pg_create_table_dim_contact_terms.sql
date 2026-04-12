CREATE TABLE IF NOT EXISTS public.dim_contact_terms (
    contact_id bigint NOT NULL,
    invoice_type text NOT NULL,
    terms_code text,
    etl_batch_id text,
    etl_loaded_at timestamptz NOT NULL DEFAULT now(),
    etl_updated_at timestamptz NOT NULL DEFAULT now(),
    source_payload jsonb,
    PRIMARY KEY (contact_id, invoice_type)
);
