CREATE TABLE IF NOT EXISTS public.dim_expedition (
    expedition_code text PRIMARY KEY,
    expedition_name text,
    city text,
    contact_person text,
    email text,
    is_active bigint,
    notes text,
    source_payload jsonb,
    etl_batch_id text,
    etl_loaded_at timestamptz NOT NULL DEFAULT now(),
    etl_updated_at timestamptz NOT NULL DEFAULT now()
);
