-- Physical OBT table for direct purchase document-line events.
-- Grain:
--   one row per document detail row across PO, GRN, RI, DNR, and PRT

CREATE TABLE IF NOT EXISTS obt_purchase_document_line_event (
    source_module text,
    obt_name text,
    source_doc_type text,
    source_header_id bigint,
    source_detail_id bigint,
    doc_no text,
    doc_date timestamp without time zone,
    doc_status_code bigint,
    doc_status_name text,
    branch_code text,
    branch_name text,
    location_code text,
    location_name text,
    contact_id bigint,
    contact_code text,
    contact_name text,
    buyer_contact_id bigint,
    buyer_contact_code text,
    buyer_contact_name text,
    item_id bigint,
    item_code text,
    item_name text,
    line_no bigint,
    uom_code text,
    qty numeric(20,6),
    qty_base numeric(20,6),
    qty_realized numeric(20,6),
    unit_price numeric(20,6),
    discount_percent numeric(20,6),
    discount_amount numeric(20,6),
    amount numeric(20,6),
    currency_code text,
    exchange_rate numeric(20,6),
    input_user_id bigint,
    input_user_name text,
    modified_user_id bigint,
    modified_user_name text,
    upstream_header_id bigint,
    upstream_detail_id bigint,
    upstream_doc_no text,
    upstream_doc_type text,
    downstream_doc_no text,
    lineage_path text,
    etl_loaded_at timestamptz
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_obt_purchase_document_line_event_source_detail
    ON obt_purchase_document_line_event (source_doc_type, source_detail_id);

CREATE INDEX IF NOT EXISTS ix_obt_purchase_document_line_event_doc_date
    ON obt_purchase_document_line_event (doc_date);
