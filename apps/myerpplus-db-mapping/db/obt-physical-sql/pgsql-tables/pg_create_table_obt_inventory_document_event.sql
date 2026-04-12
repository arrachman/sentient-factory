CREATE TABLE IF NOT EXISTS public.obt_inventory_document_event (
    inventory_event_key text PRIMARY KEY,
    obt_name text NOT NULL DEFAULT 'obt_inventory_document_event',
    source_module text NOT NULL,
    source_doc_type text NOT NULL,
    source_header_id text NOT NULL,
    doc_no text,
    doc_date timestamptz,
    doc_status_code text,
    previous_status_code text,
    branch_code text,
    branch_name text,
    location_code text,
    location_name text,
    warehouse_from_code text,
    warehouse_from_name text,
    warehouse_transit_code text,
    warehouse_transit_name text,
    warehouse_to_code text,
    warehouse_to_name text,
    description text,
    notes text,
    reference_doc_no text,
    reference_doc_date timestamptz,
    source_payload jsonb,
    etl_batch_id text,
    etl_loaded_at timestamptz NOT NULL DEFAULT now(),
    etl_updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_obt_inventory_document_event_doc
    ON public.obt_inventory_document_event (source_doc_type, doc_no, doc_date);
