CREATE TABLE IF NOT EXISTS public.dim_project (
    project_code text PRIMARY KEY,
    project_name text,
    category_code text,
    contact_id text,
    project_manager_id text,
    division_code text,
    contract_no text,
    contract_value numeric(30,6),
    is_active bigint,
    is_finished bigint,
    notes text,
    source_payload jsonb,
    etl_batch_id text,
    etl_loaded_at timestamptz NOT NULL DEFAULT now(),
    etl_updated_at timestamptz NOT NULL DEFAULT now()
);

