CREATE TABLE IF NOT EXISTS public.dim_city (
    city_code text PRIMARY KEY,
    city_name text,
    province_code text,
    country_code text,
    is_active bigint,
    notes text,
    source_payload jsonb,
    etl_batch_id text,
    etl_loaded_at timestamptz NOT NULL DEFAULT now(),
    etl_updated_at timestamptz NOT NULL DEFAULT now()
);
