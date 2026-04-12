CREATE TABLE IF NOT EXISTS public.obt_inventory_request_event (
    request_event_key text PRIMARY KEY,
    obt_name text NOT NULL DEFAULT 'obt_inventory_request_event',
    source_doc_type text NOT NULL,
    source_header_id text,
    doc_no text,
    doc_date timestamptz,
    branch_code text,
    location_code text,
    warehouse_from_code text,
    warehouse_to_code text,
    description text,
    notes text,
    source_payload jsonb,
    etl_batch_id text,
    etl_loaded_at timestamptz NOT NULL DEFAULT now(),
    etl_updated_at timestamptz NOT NULL DEFAULT now()
);
