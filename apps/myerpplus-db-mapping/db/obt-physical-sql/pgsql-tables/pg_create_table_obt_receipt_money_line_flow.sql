-- Physical OBT table for receipt-money line-level analytics.
-- Grain:
--   one row per m2_rm_detail.idrmdetail

CREATE TABLE IF NOT EXISTS obt_receipt_money_line_flow (
    source_module text,
    obt_name text,
    source_doc_type text,
    source_header_id bigint,
    source_detail_id bigint,
    doc_no text,
    doc_date timestamp without time zone,
    doc_source text,
    payment_method_code text,
    doc_status_code bigint,
    branch_code text,
    branch_name text,
    location_code text,
    location_name text,
    contact_id bigint,
    contact_code text,
    contact_name text,
    contact_person text,
    cash_account_code text,
    cash_account_name text,
    line_account_code text,
    line_account_name text,
    currency_code text,
    exchange_rate numeric(20,6),
    line_no bigint,
    amount numeric(20,6),
    amount_foreign numeric(20,6),
    total_amount numeric(20,6),
    total_amount_foreign numeric(20,6),
    division_code text,
    division_name text,
    subdivision_code text,
    subdivision_name text,
    cost_center_code text,
    cost_center_name text,
    project_code text,
    project_name text,
    notes text,
    header_notes text,
    etl_loaded_at timestamptz
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_obt_receipt_money_line_flow_detail
    ON obt_receipt_money_line_flow (source_detail_id);

CREATE INDEX IF NOT EXISTS ix_obt_receipt_money_line_flow_doc_date
    ON obt_receipt_money_line_flow (doc_date);
