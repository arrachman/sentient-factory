CREATE TABLE IF NOT EXISTS public.dim_department (
    department_code text PRIMARY KEY,
    department_name text,
    division_code text,
    subdivision_code text,
    is_active bigint,
    notes text,
    source_payload jsonb,
    etl_batch_id text,
    etl_loaded_at timestamptz NOT NULL DEFAULT now(),
    etl_updated_at timestamptz NOT NULL DEFAULT now()
);
