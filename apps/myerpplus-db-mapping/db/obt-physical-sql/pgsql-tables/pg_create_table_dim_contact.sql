-- Physical dimension table for business contact master.

CREATE TABLE IF NOT EXISTS public.dim_contact (
    contact_id bigint PRIMARY KEY,
    contact_code text,
    contact_name text,
    contact_category_code text,
    customer_category_code text,
    supplier_category_code text,
    salesman_category_code text,
    branch_code text,
    branch_name text,
    location_code text,
    location_name text,
    warehouse_code text,
    division_code text,
    subdivision_code text,
    salesman_id text,
    global_terms_code text,
    purchase_terms_code text,
    sales_terms_code text,
    currency_code text,
    is_active bigint,
    active_at timestamptz,
    total_receivable numeric(30,6),
    total_payable numeric(30,6),
    notes text,
    source_payload jsonb,
    etl_batch_id text,
    etl_loaded_at timestamptz NOT NULL DEFAULT now(),
    etl_updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_dim_contact_code
    ON public.dim_contact (contact_code);

CREATE INDEX IF NOT EXISTS idx_dim_contact_branch
    ON public.dim_contact (branch_code);
