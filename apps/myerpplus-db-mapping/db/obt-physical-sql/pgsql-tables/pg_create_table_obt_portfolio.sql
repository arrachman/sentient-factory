-- Auto-generated bootstrap OBT portfolio tables from docs/docs/08-obt/konsep-obt-m0-m12.md
-- These are empty ETL targets with a shared output contract.
-- Table count: 41
CREATE TABLE IF NOT EXISTS public.obt_admin_access (
    obt_id bigserial PRIMARY KEY,
    obt_name text NOT NULL,
    source_module text,
    source_doc_type text,
    source_header_id text,
    source_detail_id text,
    source_allocation_id text,
    doc_no text,
    doc_date timestamptz,
    doc_status_code text,
    doc_status_name text,
    branch_code text,
    branch_name text,
    location_code text,
    location_name text,
    contact_id text,
    contact_code text,
    contact_name text,
    item_id text,
    item_code text,
    item_name text,
    uom_code text,
    upstream_doc_no text,
    downstream_doc_no text,
    lineage_path text,
    qty numeric(20,6),
    amount numeric(20,6),
    due_date timestamptz,
    invoice_amount numeric(20,6),
    paid_amount numeric(20,6),
    outstanding_amount numeric(20,6),
    payment_status_code text,
    payment_status_name text,
    currency_code text,
    exchange_rate numeric(20,6),
    input_user_id text,
    input_user_name text,
    modified_user_id text,
    modified_user_name text,
    source_payload jsonb,
    etl_batch_id text,
    etl_loaded_at timestamptz NOT NULL DEFAULT now(),
    etl_updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_obt_admin_access_doc_date
    ON public.obt_admin_access (doc_date);

CREATE INDEX IF NOT EXISTS idx_obt_admin_access_doc_no
    ON public.obt_admin_access (doc_no);

CREATE INDEX IF NOT EXISTS idx_obt_admin_access_source_header_id
    ON public.obt_admin_access (source_header_id);

CREATE INDEX IF NOT EXISTS idx_obt_admin_access_source_detail_id
    ON public.obt_admin_access (source_detail_id);

CREATE INDEX IF NOT EXISTS idx_obt_admin_access_contact_code
    ON public.obt_admin_access (contact_code);

CREATE INDEX IF NOT EXISTS idx_obt_admin_access_item_code
    ON public.obt_admin_access (item_code);

CREATE TABLE IF NOT EXISTS public.obt_asset_depreciation_event (
    obt_id bigserial PRIMARY KEY,
    obt_name text NOT NULL,
    source_module text,
    source_doc_type text,
    source_header_id text,
    source_detail_id text,
    source_allocation_id text,
    doc_no text,
    doc_date timestamptz,
    doc_status_code text,
    doc_status_name text,
    branch_code text,
    branch_name text,
    location_code text,
    location_name text,
    contact_id text,
    contact_code text,
    contact_name text,
    item_id text,
    item_code text,
    item_name text,
    uom_code text,
    upstream_doc_no text,
    downstream_doc_no text,
    lineage_path text,
    qty numeric(20,6),
    amount numeric(20,6),
    currency_code text,
    exchange_rate numeric(20,6),
    input_user_id text,
    input_user_name text,
    modified_user_id text,
    modified_user_name text,
    source_payload jsonb,
    etl_batch_id text,
    etl_loaded_at timestamptz NOT NULL DEFAULT now(),
    etl_updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_obt_asset_depreciation_event_doc_date
    ON public.obt_asset_depreciation_event (doc_date);

CREATE INDEX IF NOT EXISTS idx_obt_asset_depreciation_event_doc_no
    ON public.obt_asset_depreciation_event (doc_no);

CREATE INDEX IF NOT EXISTS idx_obt_asset_depreciation_event_source_header_id
    ON public.obt_asset_depreciation_event (source_header_id);

CREATE INDEX IF NOT EXISTS idx_obt_asset_depreciation_event_source_detail_id
    ON public.obt_asset_depreciation_event (source_detail_id);

CREATE INDEX IF NOT EXISTS idx_obt_asset_depreciation_event_contact_code
    ON public.obt_asset_depreciation_event (contact_code);

CREATE INDEX IF NOT EXISTS idx_obt_asset_depreciation_event_item_code
    ON public.obt_asset_depreciation_event (item_code);

CREATE TABLE IF NOT EXISTS public.obt_asset_lifecycle (
    obt_id bigserial PRIMARY KEY,
    obt_name text NOT NULL,
    source_module text,
    source_doc_type text,
    source_header_id text,
    source_detail_id text,
    source_allocation_id text,
    doc_no text,
    doc_date timestamptz,
    doc_status_code text,
    doc_status_name text,
    branch_code text,
    branch_name text,
    location_code text,
    location_name text,
    contact_id text,
    contact_code text,
    contact_name text,
    item_id text,
    item_code text,
    item_name text,
    uom_code text,
    upstream_doc_no text,
    downstream_doc_no text,
    lineage_path text,
    qty numeric(20,6),
    amount numeric(20,6),
    currency_code text,
    exchange_rate numeric(20,6),
    input_user_id text,
    input_user_name text,
    modified_user_id text,
    modified_user_name text,
    source_payload jsonb,
    etl_batch_id text,
    etl_loaded_at timestamptz NOT NULL DEFAULT now(),
    etl_updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_obt_asset_lifecycle_doc_date
    ON public.obt_asset_lifecycle (doc_date);

CREATE INDEX IF NOT EXISTS idx_obt_asset_lifecycle_doc_no
    ON public.obt_asset_lifecycle (doc_no);

CREATE INDEX IF NOT EXISTS idx_obt_asset_lifecycle_source_header_id
    ON public.obt_asset_lifecycle (source_header_id);

CREATE INDEX IF NOT EXISTS idx_obt_asset_lifecycle_source_detail_id
    ON public.obt_asset_lifecycle (source_detail_id);

CREATE INDEX IF NOT EXISTS idx_obt_asset_lifecycle_contact_code
    ON public.obt_asset_lifecycle (contact_code);

CREATE INDEX IF NOT EXISTS idx_obt_asset_lifecycle_item_code
    ON public.obt_asset_lifecycle (item_code);

CREATE TABLE IF NOT EXISTS public.obt_asset_mutation (
    obt_id bigserial PRIMARY KEY,
    obt_name text NOT NULL,
    source_module text,
    source_doc_type text,
    source_header_id text,
    source_detail_id text,
    source_allocation_id text,
    doc_no text,
    doc_date timestamptz,
    doc_status_code text,
    doc_status_name text,
    branch_code text,
    branch_name text,
    location_code text,
    location_name text,
    contact_id text,
    contact_code text,
    contact_name text,
    item_id text,
    item_code text,
    item_name text,
    uom_code text,
    upstream_doc_no text,
    downstream_doc_no text,
    lineage_path text,
    qty numeric(20,6),
    amount numeric(20,6),
    currency_code text,
    exchange_rate numeric(20,6),
    input_user_id text,
    input_user_name text,
    modified_user_id text,
    modified_user_name text,
    source_payload jsonb,
    etl_batch_id text,
    etl_loaded_at timestamptz NOT NULL DEFAULT now(),
    etl_updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_obt_asset_mutation_doc_date
    ON public.obt_asset_mutation (doc_date);

CREATE INDEX IF NOT EXISTS idx_obt_asset_mutation_doc_no
    ON public.obt_asset_mutation (doc_no);

CREATE INDEX IF NOT EXISTS idx_obt_asset_mutation_source_header_id
    ON public.obt_asset_mutation (source_header_id);

CREATE INDEX IF NOT EXISTS idx_obt_asset_mutation_source_detail_id
    ON public.obt_asset_mutation (source_detail_id);

CREATE INDEX IF NOT EXISTS idx_obt_asset_mutation_contact_code
    ON public.obt_asset_mutation (contact_code);

CREATE INDEX IF NOT EXISTS idx_obt_asset_mutation_item_code
    ON public.obt_asset_mutation (item_code);

CREATE TABLE IF NOT EXISTS public.obt_bom_route_snapshot (
    obt_id bigserial PRIMARY KEY,
    obt_name text NOT NULL,
    source_module text,
    source_doc_type text,
    source_header_id text,
    source_detail_id text,
    source_allocation_id text,
    doc_no text,
    doc_date timestamptz,
    doc_status_code text,
    doc_status_name text,
    branch_code text,
    branch_name text,
    location_code text,
    location_name text,
    contact_id text,
    contact_code text,
    contact_name text,
    item_id text,
    item_code text,
    item_name text,
    uom_code text,
    upstream_doc_no text,
    downstream_doc_no text,
    lineage_path text,
    qty numeric(20,6),
    amount numeric(20,6),
    currency_code text,
    exchange_rate numeric(20,6),
    input_user_id text,
    input_user_name text,
    modified_user_id text,
    modified_user_name text,
    source_payload jsonb,
    etl_batch_id text,
    etl_loaded_at timestamptz NOT NULL DEFAULT now(),
    etl_updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_obt_bom_route_snapshot_doc_date
    ON public.obt_bom_route_snapshot (doc_date);

CREATE INDEX IF NOT EXISTS idx_obt_bom_route_snapshot_doc_no
    ON public.obt_bom_route_snapshot (doc_no);

CREATE INDEX IF NOT EXISTS idx_obt_bom_route_snapshot_source_header_id
    ON public.obt_bom_route_snapshot (source_header_id);

CREATE INDEX IF NOT EXISTS idx_obt_bom_route_snapshot_source_detail_id
    ON public.obt_bom_route_snapshot (source_detail_id);

CREATE INDEX IF NOT EXISTS idx_obt_bom_route_snapshot_contact_code
    ON public.obt_bom_route_snapshot (contact_code);

CREATE INDEX IF NOT EXISTS idx_obt_bom_route_snapshot_item_code
    ON public.obt_bom_route_snapshot (item_code);

CREATE TABLE IF NOT EXISTS public.obt_cash_bank_movement (
    obt_id bigserial PRIMARY KEY,
    obt_name text NOT NULL,
    source_module text,
    source_doc_type text,
    source_header_id text,
    source_detail_id text,
    source_allocation_id text,
    doc_no text,
    doc_date timestamptz,
    doc_status_code text,
    doc_status_name text,
    branch_code text,
    branch_name text,
    location_code text,
    location_name text,
    contact_id text,
    contact_code text,
    contact_name text,
    item_id text,
    item_code text,
    item_name text,
    uom_code text,
    upstream_doc_no text,
    downstream_doc_no text,
    lineage_path text,
    qty numeric(20,6),
    amount numeric(20,6),
    currency_code text,
    exchange_rate numeric(20,6),
    input_user_id text,
    input_user_name text,
    modified_user_id text,
    modified_user_name text,
    source_payload jsonb,
    etl_batch_id text,
    etl_loaded_at timestamptz NOT NULL DEFAULT now(),
    etl_updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_obt_cash_bank_movement_doc_date
    ON public.obt_cash_bank_movement (doc_date);

CREATE INDEX IF NOT EXISTS idx_obt_cash_bank_movement_doc_no
    ON public.obt_cash_bank_movement (doc_no);

CREATE INDEX IF NOT EXISTS idx_obt_cash_bank_movement_source_header_id
    ON public.obt_cash_bank_movement (source_header_id);

CREATE INDEX IF NOT EXISTS idx_obt_cash_bank_movement_source_detail_id
    ON public.obt_cash_bank_movement (source_detail_id);

CREATE INDEX IF NOT EXISTS idx_obt_cash_bank_movement_contact_code
    ON public.obt_cash_bank_movement (contact_code);

CREATE INDEX IF NOT EXISTS idx_obt_cash_bank_movement_item_code
    ON public.obt_cash_bank_movement (item_code);

CREATE TABLE IF NOT EXISTS public.obt_clinical_service_line (
    obt_id bigserial PRIMARY KEY,
    obt_name text NOT NULL,
    source_module text,
    source_doc_type text,
    source_header_id text,
    source_detail_id text,
    source_allocation_id text,
    doc_no text,
    doc_date timestamptz,
    doc_status_code text,
    doc_status_name text,
    branch_code text,
    branch_name text,
    location_code text,
    location_name text,
    contact_id text,
    contact_code text,
    contact_name text,
    item_id text,
    item_code text,
    item_name text,
    uom_code text,
    upstream_doc_no text,
    downstream_doc_no text,
    lineage_path text,
    qty numeric(20,6),
    amount numeric(20,6),
    currency_code text,
    exchange_rate numeric(20,6),
    input_user_id text,
    input_user_name text,
    modified_user_id text,
    modified_user_name text,
    source_payload jsonb,
    etl_batch_id text,
    etl_loaded_at timestamptz NOT NULL DEFAULT now(),
    etl_updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_obt_clinical_service_line_doc_date
    ON public.obt_clinical_service_line (doc_date);

CREATE INDEX IF NOT EXISTS idx_obt_clinical_service_line_doc_no
    ON public.obt_clinical_service_line (doc_no);

CREATE INDEX IF NOT EXISTS idx_obt_clinical_service_line_source_header_id
    ON public.obt_clinical_service_line (source_header_id);

CREATE INDEX IF NOT EXISTS idx_obt_clinical_service_line_source_detail_id
    ON public.obt_clinical_service_line (source_detail_id);

CREATE INDEX IF NOT EXISTS idx_obt_clinical_service_line_contact_code
    ON public.obt_clinical_service_line (contact_code);

CREATE INDEX IF NOT EXISTS idx_obt_clinical_service_line_item_code
    ON public.obt_clinical_service_line (item_code);

CREATE TABLE IF NOT EXISTS public.obt_content_indicator_map (
    obt_id bigserial PRIMARY KEY,
    obt_name text NOT NULL,
    source_module text,
    source_doc_type text,
    source_header_id text,
    source_detail_id text,
    source_allocation_id text,
    doc_no text,
    doc_date timestamptz,
    doc_status_code text,
    doc_status_name text,
    branch_code text,
    branch_name text,
    location_code text,
    location_name text,
    contact_id text,
    contact_code text,
    contact_name text,
    item_id text,
    item_code text,
    item_name text,
    uom_code text,
    upstream_doc_no text,
    downstream_doc_no text,
    lineage_path text,
    qty numeric(20,6),
    amount numeric(20,6),
    currency_code text,
    exchange_rate numeric(20,6),
    input_user_id text,
    input_user_name text,
    modified_user_id text,
    modified_user_name text,
    source_payload jsonb,
    etl_batch_id text,
    etl_loaded_at timestamptz NOT NULL DEFAULT now(),
    etl_updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_obt_content_indicator_map_doc_date
    ON public.obt_content_indicator_map (doc_date);

CREATE INDEX IF NOT EXISTS idx_obt_content_indicator_map_doc_no
    ON public.obt_content_indicator_map (doc_no);

CREATE INDEX IF NOT EXISTS idx_obt_content_indicator_map_source_header_id
    ON public.obt_content_indicator_map (source_header_id);

CREATE INDEX IF NOT EXISTS idx_obt_content_indicator_map_source_detail_id
    ON public.obt_content_indicator_map (source_detail_id);

CREATE INDEX IF NOT EXISTS idx_obt_content_indicator_map_contact_code
    ON public.obt_content_indicator_map (contact_code);

CREATE INDEX IF NOT EXISTS idx_obt_content_indicator_map_item_code
    ON public.obt_content_indicator_map (item_code);

CREATE TABLE IF NOT EXISTS public.obt_customer_sales_profile (
    obt_id bigserial PRIMARY KEY,
    obt_name text NOT NULL,
    source_module text,
    source_doc_type text,
    source_header_id text,
    source_detail_id text,
    source_allocation_id text,
    doc_no text,
    doc_date timestamptz,
    doc_status_code text,
    doc_status_name text,
    branch_code text,
    branch_name text,
    location_code text,
    location_name text,
    contact_id text,
    contact_code text,
    contact_name text,
    item_id text,
    item_code text,
    item_name text,
    uom_code text,
    upstream_doc_no text,
    downstream_doc_no text,
    lineage_path text,
    qty numeric(20,6),
    amount numeric(20,6),
    currency_code text,
    exchange_rate numeric(20,6),
    input_user_id text,
    input_user_name text,
    modified_user_id text,
    modified_user_name text,
    source_payload jsonb,
    etl_batch_id text,
    etl_loaded_at timestamptz NOT NULL DEFAULT now(),
    etl_updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_obt_customer_sales_profile_doc_date
    ON public.obt_customer_sales_profile (doc_date);

CREATE INDEX IF NOT EXISTS idx_obt_customer_sales_profile_doc_no
    ON public.obt_customer_sales_profile (doc_no);

CREATE INDEX IF NOT EXISTS idx_obt_customer_sales_profile_source_header_id
    ON public.obt_customer_sales_profile (source_header_id);

CREATE INDEX IF NOT EXISTS idx_obt_customer_sales_profile_source_detail_id
    ON public.obt_customer_sales_profile (source_detail_id);

CREATE INDEX IF NOT EXISTS idx_obt_customer_sales_profile_contact_code
    ON public.obt_customer_sales_profile (contact_code);

CREATE INDEX IF NOT EXISTS idx_obt_customer_sales_profile_item_code
    ON public.obt_customer_sales_profile (item_code);

CREATE TABLE IF NOT EXISTS public.obt_finance_allocation (
    obt_id bigserial PRIMARY KEY,
    obt_name text NOT NULL,
    source_module text,
    source_doc_type text,
    source_header_id text,
    source_detail_id text,
    source_allocation_id text,
    doc_no text,
    doc_date timestamptz,
    doc_status_code text,
    doc_status_name text,
    branch_code text,
    branch_name text,
    location_code text,
    location_name text,
    contact_id text,
    contact_code text,
    contact_name text,
    item_id text,
    item_code text,
    item_name text,
    uom_code text,
    upstream_doc_no text,
    downstream_doc_no text,
    lineage_path text,
    qty numeric(20,6),
    amount numeric(20,6),
    currency_code text,
    exchange_rate numeric(20,6),
    input_user_id text,
    input_user_name text,
    modified_user_id text,
    modified_user_name text,
    source_payload jsonb,
    etl_batch_id text,
    etl_loaded_at timestamptz NOT NULL DEFAULT now(),
    etl_updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_obt_finance_allocation_doc_date
    ON public.obt_finance_allocation (doc_date);

CREATE INDEX IF NOT EXISTS idx_obt_finance_allocation_doc_no
    ON public.obt_finance_allocation (doc_no);

CREATE INDEX IF NOT EXISTS idx_obt_finance_allocation_source_header_id
    ON public.obt_finance_allocation (source_header_id);

CREATE INDEX IF NOT EXISTS idx_obt_finance_allocation_source_detail_id
    ON public.obt_finance_allocation (source_detail_id);

CREATE INDEX IF NOT EXISTS idx_obt_finance_allocation_contact_code
    ON public.obt_finance_allocation (contact_code);

CREATE INDEX IF NOT EXISTS idx_obt_finance_allocation_item_code
    ON public.obt_finance_allocation (item_code);

CREATE TABLE IF NOT EXISTS public.obt_finance_document (
    obt_id bigserial PRIMARY KEY,
    obt_name text NOT NULL,
    source_module text,
    source_doc_type text,
    source_header_id text,
    source_detail_id text,
    source_allocation_id text,
    doc_no text,
    doc_date timestamptz,
    doc_status_code text,
    doc_status_name text,
    branch_code text,
    branch_name text,
    location_code text,
    location_name text,
    contact_id text,
    contact_code text,
    contact_name text,
    item_id text,
    item_code text,
    item_name text,
    uom_code text,
    upstream_doc_no text,
    downstream_doc_no text,
    lineage_path text,
    qty numeric(20,6),
    amount numeric(20,6),
    currency_code text,
    exchange_rate numeric(20,6),
    input_user_id text,
    input_user_name text,
    modified_user_id text,
    modified_user_name text,
    source_payload jsonb,
    etl_batch_id text,
    etl_loaded_at timestamptz NOT NULL DEFAULT now(),
    etl_updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_obt_finance_document_doc_date
    ON public.obt_finance_document (doc_date);

CREATE INDEX IF NOT EXISTS idx_obt_finance_document_doc_no
    ON public.obt_finance_document (doc_no);

CREATE INDEX IF NOT EXISTS idx_obt_finance_document_source_header_id
    ON public.obt_finance_document (source_header_id);

CREATE INDEX IF NOT EXISTS idx_obt_finance_document_source_detail_id
    ON public.obt_finance_document (source_detail_id);

CREATE INDEX IF NOT EXISTS idx_obt_finance_document_contact_code
    ON public.obt_finance_document (contact_code);

CREATE INDEX IF NOT EXISTS idx_obt_finance_document_item_code
    ON public.obt_finance_document (item_code);

CREATE TABLE IF NOT EXISTS public.obt_finance_document_line (
    obt_id bigserial PRIMARY KEY,
    obt_name text NOT NULL,
    source_module text,
    source_doc_type text,
    source_header_id text,
    source_detail_id text,
    source_allocation_id text,
    doc_no text,
    doc_date timestamptz,
    doc_status_code text,
    doc_status_name text,
    branch_code text,
    branch_name text,
    location_code text,
    location_name text,
    contact_id text,
    contact_code text,
    contact_name text,
    item_id text,
    item_code text,
    item_name text,
    uom_code text,
    upstream_doc_no text,
    downstream_doc_no text,
    lineage_path text,
    qty numeric(20,6),
    amount numeric(20,6),
    currency_code text,
    exchange_rate numeric(20,6),
    input_user_id text,
    input_user_name text,
    modified_user_id text,
    modified_user_name text,
    source_payload jsonb,
    etl_batch_id text,
    etl_loaded_at timestamptz NOT NULL DEFAULT now(),
    etl_updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_obt_finance_document_line_doc_date
    ON public.obt_finance_document_line (doc_date);

CREATE INDEX IF NOT EXISTS idx_obt_finance_document_line_doc_no
    ON public.obt_finance_document_line (doc_no);

CREATE INDEX IF NOT EXISTS idx_obt_finance_document_line_source_header_id
    ON public.obt_finance_document_line (source_header_id);

CREATE INDEX IF NOT EXISTS idx_obt_finance_document_line_source_detail_id
    ON public.obt_finance_document_line (source_detail_id);

CREATE INDEX IF NOT EXISTS idx_obt_finance_document_line_contact_code
    ON public.obt_finance_document_line (contact_code);

CREATE INDEX IF NOT EXISTS idx_obt_finance_document_line_item_code
    ON public.obt_finance_document_line (item_code);

CREATE TABLE IF NOT EXISTS public.obt_inventory_movement_line (
    obt_id bigserial PRIMARY KEY,
    obt_name text NOT NULL,
    source_module text,
    source_doc_type text,
    source_header_id text,
    source_detail_id text,
    source_allocation_id text,
    doc_no text,
    doc_date timestamptz,
    doc_status_code text,
    doc_status_name text,
    branch_code text,
    branch_name text,
    location_code text,
    location_name text,
    contact_id text,
    contact_code text,
    contact_name text,
    item_id text,
    item_code text,
    item_name text,
    uom_code text,
    upstream_doc_no text,
    downstream_doc_no text,
    lineage_path text,
    qty numeric(20,6),
    amount numeric(20,6),
    currency_code text,
    exchange_rate numeric(20,6),
    input_user_id text,
    input_user_name text,
    modified_user_id text,
    modified_user_name text,
    source_payload jsonb,
    etl_batch_id text,
    etl_loaded_at timestamptz NOT NULL DEFAULT now(),
    etl_updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_obt_inventory_movement_line_doc_date
    ON public.obt_inventory_movement_line (doc_date);

CREATE INDEX IF NOT EXISTS idx_obt_inventory_movement_line_doc_no
    ON public.obt_inventory_movement_line (doc_no);

CREATE INDEX IF NOT EXISTS idx_obt_inventory_movement_line_source_header_id
    ON public.obt_inventory_movement_line (source_header_id);

CREATE INDEX IF NOT EXISTS idx_obt_inventory_movement_line_source_detail_id
    ON public.obt_inventory_movement_line (source_detail_id);

CREATE INDEX IF NOT EXISTS idx_obt_inventory_movement_line_contact_code
    ON public.obt_inventory_movement_line (contact_code);

CREATE INDEX IF NOT EXISTS idx_obt_inventory_movement_line_item_code
    ON public.obt_inventory_movement_line (item_code);

CREATE TABLE IF NOT EXISTS public.obt_inventory_receipt_issue_line (
    obt_id bigserial PRIMARY KEY,
    obt_name text NOT NULL,
    source_module text,
    source_doc_type text,
    source_header_id text,
    source_detail_id text,
    source_allocation_id text,
    doc_no text,
    doc_date timestamptz,
    doc_status_code text,
    doc_status_name text,
    branch_code text,
    branch_name text,
    location_code text,
    location_name text,
    contact_id text,
    contact_code text,
    contact_name text,
    item_id text,
    item_code text,
    item_name text,
    uom_code text,
    upstream_doc_no text,
    downstream_doc_no text,
    lineage_path text,
    qty numeric(20,6),
    amount numeric(20,6),
    currency_code text,
    exchange_rate numeric(20,6),
    input_user_id text,
    input_user_name text,
    modified_user_id text,
    modified_user_name text,
    source_payload jsonb,
    etl_batch_id text,
    etl_loaded_at timestamptz NOT NULL DEFAULT now(),
    etl_updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_obt_inventory_receipt_issue_line_doc_date
    ON public.obt_inventory_receipt_issue_line (doc_date);

CREATE INDEX IF NOT EXISTS idx_obt_inventory_receipt_issue_line_doc_no
    ON public.obt_inventory_receipt_issue_line (doc_no);

CREATE INDEX IF NOT EXISTS idx_obt_inventory_receipt_issue_line_source_header_id
    ON public.obt_inventory_receipt_issue_line (source_header_id);

CREATE INDEX IF NOT EXISTS idx_obt_inventory_receipt_issue_line_source_detail_id
    ON public.obt_inventory_receipt_issue_line (source_detail_id);

CREATE INDEX IF NOT EXISTS idx_obt_inventory_receipt_issue_line_contact_code
    ON public.obt_inventory_receipt_issue_line (contact_code);

CREATE INDEX IF NOT EXISTS idx_obt_inventory_receipt_issue_line_item_code
    ON public.obt_inventory_receipt_issue_line (item_code);

CREATE TABLE IF NOT EXISTS public.obt_inventory_transfer_trace (
    obt_id bigserial PRIMARY KEY,
    obt_name text NOT NULL,
    source_module text,
    source_doc_type text,
    source_header_id text,
    source_detail_id text,
    source_allocation_id text,
    doc_no text,
    doc_date timestamptz,
    doc_status_code text,
    doc_status_name text,
    branch_code text,
    branch_name text,
    location_code text,
    location_name text,
    contact_id text,
    contact_code text,
    contact_name text,
    item_id text,
    item_code text,
    item_name text,
    uom_code text,
    upstream_doc_no text,
    downstream_doc_no text,
    lineage_path text,
    qty numeric(20,6),
    amount numeric(20,6),
    currency_code text,
    exchange_rate numeric(20,6),
    input_user_id text,
    input_user_name text,
    modified_user_id text,
    modified_user_name text,
    source_payload jsonb,
    etl_batch_id text,
    etl_loaded_at timestamptz NOT NULL DEFAULT now(),
    etl_updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_obt_inventory_transfer_trace_doc_date
    ON public.obt_inventory_transfer_trace (doc_date);

CREATE INDEX IF NOT EXISTS idx_obt_inventory_transfer_trace_doc_no
    ON public.obt_inventory_transfer_trace (doc_no);

CREATE INDEX IF NOT EXISTS idx_obt_inventory_transfer_trace_source_header_id
    ON public.obt_inventory_transfer_trace (source_header_id);

CREATE INDEX IF NOT EXISTS idx_obt_inventory_transfer_trace_source_detail_id
    ON public.obt_inventory_transfer_trace (source_detail_id);

CREATE INDEX IF NOT EXISTS idx_obt_inventory_transfer_trace_contact_code
    ON public.obt_inventory_transfer_trace (contact_code);

CREATE INDEX IF NOT EXISTS idx_obt_inventory_transfer_trace_item_code
    ON public.obt_inventory_transfer_trace (item_code);

CREATE TABLE IF NOT EXISTS public.obt_manufacturing_execution (
    obt_id bigserial PRIMARY KEY,
    obt_name text NOT NULL,
    source_module text,
    source_doc_type text,
    source_header_id text,
    source_detail_id text,
    source_allocation_id text,
    doc_no text,
    doc_date timestamptz,
    doc_status_code text,
    doc_status_name text,
    branch_code text,
    branch_name text,
    location_code text,
    location_name text,
    contact_id text,
    contact_code text,
    contact_name text,
    item_id text,
    item_code text,
    item_name text,
    uom_code text,
    upstream_doc_no text,
    downstream_doc_no text,
    lineage_path text,
    qty numeric(20,6),
    amount numeric(20,6),
    currency_code text,
    exchange_rate numeric(20,6),
    input_user_id text,
    input_user_name text,
    modified_user_id text,
    modified_user_name text,
    source_payload jsonb,
    etl_batch_id text,
    etl_loaded_at timestamptz NOT NULL DEFAULT now(),
    etl_updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_obt_manufacturing_execution_doc_date
    ON public.obt_manufacturing_execution (doc_date);

CREATE INDEX IF NOT EXISTS idx_obt_manufacturing_execution_doc_no
    ON public.obt_manufacturing_execution (doc_no);

CREATE INDEX IF NOT EXISTS idx_obt_manufacturing_execution_source_header_id
    ON public.obt_manufacturing_execution (source_header_id);

CREATE INDEX IF NOT EXISTS idx_obt_manufacturing_execution_source_detail_id
    ON public.obt_manufacturing_execution (source_detail_id);

CREATE INDEX IF NOT EXISTS idx_obt_manufacturing_execution_contact_code
    ON public.obt_manufacturing_execution (contact_code);

CREATE INDEX IF NOT EXISTS idx_obt_manufacturing_execution_item_code
    ON public.obt_manufacturing_execution (item_code);

CREATE TABLE IF NOT EXISTS public.obt_material_issue_receipt_line (
    obt_id bigserial PRIMARY KEY,
    obt_name text NOT NULL,
    source_module text,
    source_doc_type text,
    source_header_id text,
    source_detail_id text,
    source_allocation_id text,
    doc_no text,
    doc_date timestamptz,
    doc_status_code text,
    doc_status_name text,
    branch_code text,
    branch_name text,
    location_code text,
    location_name text,
    contact_id text,
    contact_code text,
    contact_name text,
    item_id text,
    item_code text,
    item_name text,
    uom_code text,
    upstream_doc_no text,
    downstream_doc_no text,
    lineage_path text,
    qty numeric(20,6),
    amount numeric(20,6),
    currency_code text,
    exchange_rate numeric(20,6),
    input_user_id text,
    input_user_name text,
    modified_user_id text,
    modified_user_name text,
    source_payload jsonb,
    etl_batch_id text,
    etl_loaded_at timestamptz NOT NULL DEFAULT now(),
    etl_updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_obt_material_issue_receipt_line_doc_date
    ON public.obt_material_issue_receipt_line (doc_date);

CREATE INDEX IF NOT EXISTS idx_obt_material_issue_receipt_line_doc_no
    ON public.obt_material_issue_receipt_line (doc_no);

CREATE INDEX IF NOT EXISTS idx_obt_material_issue_receipt_line_source_header_id
    ON public.obt_material_issue_receipt_line (source_header_id);

CREATE INDEX IF NOT EXISTS idx_obt_material_issue_receipt_line_source_detail_id
    ON public.obt_material_issue_receipt_line (source_detail_id);

CREATE INDEX IF NOT EXISTS idx_obt_material_issue_receipt_line_contact_code
    ON public.obt_material_issue_receipt_line (contact_code);

CREATE INDEX IF NOT EXISTS idx_obt_material_issue_receipt_line_item_code
    ON public.obt_material_issue_receipt_line (item_code);

CREATE TABLE IF NOT EXISTS public.obt_menu_authorization (
    obt_id bigserial PRIMARY KEY,
    obt_name text NOT NULL,
    source_module text,
    source_doc_type text,
    source_header_id text,
    source_detail_id text,
    source_allocation_id text,
    doc_no text,
    doc_date timestamptz,
    doc_status_code text,
    doc_status_name text,
    branch_code text,
    branch_name text,
    location_code text,
    location_name text,
    contact_id text,
    contact_code text,
    contact_name text,
    item_id text,
    item_code text,
    item_name text,
    uom_code text,
    upstream_doc_no text,
    downstream_doc_no text,
    lineage_path text,
    qty numeric(20,6),
    amount numeric(20,6),
    currency_code text,
    exchange_rate numeric(20,6),
    input_user_id text,
    input_user_name text,
    modified_user_id text,
    modified_user_name text,
    source_payload jsonb,
    etl_batch_id text,
    etl_loaded_at timestamptz NOT NULL DEFAULT now(),
    etl_updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_obt_menu_authorization_doc_date
    ON public.obt_menu_authorization (doc_date);

CREATE INDEX IF NOT EXISTS idx_obt_menu_authorization_doc_no
    ON public.obt_menu_authorization (doc_no);

CREATE INDEX IF NOT EXISTS idx_obt_menu_authorization_source_header_id
    ON public.obt_menu_authorization (source_header_id);

CREATE INDEX IF NOT EXISTS idx_obt_menu_authorization_source_detail_id
    ON public.obt_menu_authorization (source_detail_id);

CREATE INDEX IF NOT EXISTS idx_obt_menu_authorization_contact_code
    ON public.obt_menu_authorization (contact_code);

CREATE INDEX IF NOT EXISTS idx_obt_menu_authorization_item_code
    ON public.obt_menu_authorization (item_code);

CREATE TABLE IF NOT EXISTS public.obt_metric_snapshot (
    obt_id bigserial PRIMARY KEY,
    obt_name text NOT NULL,
    source_module text,
    source_doc_type text,
    source_header_id text,
    source_detail_id text,
    source_allocation_id text,
    doc_no text,
    doc_date timestamptz,
    doc_status_code text,
    doc_status_name text,
    branch_code text,
    branch_name text,
    location_code text,
    location_name text,
    contact_id text,
    contact_code text,
    contact_name text,
    item_id text,
    item_code text,
    item_name text,
    uom_code text,
    upstream_doc_no text,
    downstream_doc_no text,
    lineage_path text,
    qty numeric(20,6),
    amount numeric(20,6),
    currency_code text,
    exchange_rate numeric(20,6),
    input_user_id text,
    input_user_name text,
    modified_user_id text,
    modified_user_name text,
    source_payload jsonb,
    etl_batch_id text,
    etl_loaded_at timestamptz NOT NULL DEFAULT now(),
    etl_updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_obt_metric_snapshot_doc_date
    ON public.obt_metric_snapshot (doc_date);

CREATE INDEX IF NOT EXISTS idx_obt_metric_snapshot_doc_no
    ON public.obt_metric_snapshot (doc_no);

CREATE INDEX IF NOT EXISTS idx_obt_metric_snapshot_source_header_id
    ON public.obt_metric_snapshot (source_header_id);

CREATE INDEX IF NOT EXISTS idx_obt_metric_snapshot_source_detail_id
    ON public.obt_metric_snapshot (source_detail_id);

CREATE INDEX IF NOT EXISTS idx_obt_metric_snapshot_contact_code
    ON public.obt_metric_snapshot (contact_code);

CREATE INDEX IF NOT EXISTS idx_obt_metric_snapshot_item_code
    ON public.obt_metric_snapshot (item_code);

CREATE TABLE IF NOT EXISTS public.obt_patient_billing_line (
    obt_id bigserial PRIMARY KEY,
    obt_name text NOT NULL,
    source_module text,
    source_doc_type text,
    source_header_id text,
    source_detail_id text,
    source_allocation_id text,
    doc_no text,
    doc_date timestamptz,
    doc_status_code text,
    doc_status_name text,
    branch_code text,
    branch_name text,
    location_code text,
    location_name text,
    contact_id text,
    contact_code text,
    contact_name text,
    item_id text,
    item_code text,
    item_name text,
    uom_code text,
    upstream_doc_no text,
    downstream_doc_no text,
    lineage_path text,
    qty numeric(20,6),
    amount numeric(20,6),
    currency_code text,
    exchange_rate numeric(20,6),
    input_user_id text,
    input_user_name text,
    modified_user_id text,
    modified_user_name text,
    source_payload jsonb,
    etl_batch_id text,
    etl_loaded_at timestamptz NOT NULL DEFAULT now(),
    etl_updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_obt_patient_billing_line_doc_date
    ON public.obt_patient_billing_line (doc_date);

CREATE INDEX IF NOT EXISTS idx_obt_patient_billing_line_doc_no
    ON public.obt_patient_billing_line (doc_no);

CREATE INDEX IF NOT EXISTS idx_obt_patient_billing_line_source_header_id
    ON public.obt_patient_billing_line (source_header_id);

CREATE INDEX IF NOT EXISTS idx_obt_patient_billing_line_source_detail_id
    ON public.obt_patient_billing_line (source_detail_id);

CREATE INDEX IF NOT EXISTS idx_obt_patient_billing_line_contact_code
    ON public.obt_patient_billing_line (contact_code);

CREATE INDEX IF NOT EXISTS idx_obt_patient_billing_line_item_code
    ON public.obt_patient_billing_line (item_code);

CREATE TABLE IF NOT EXISTS public.obt_patient_visit (
    obt_id bigserial PRIMARY KEY,
    obt_name text NOT NULL,
    source_module text,
    source_doc_type text,
    source_header_id text,
    source_detail_id text,
    source_allocation_id text,
    doc_no text,
    doc_date timestamptz,
    doc_status_code text,
    doc_status_name text,
    branch_code text,
    branch_name text,
    location_code text,
    location_name text,
    contact_id text,
    contact_code text,
    contact_name text,
    item_id text,
    item_code text,
    item_name text,
    uom_code text,
    upstream_doc_no text,
    downstream_doc_no text,
    lineage_path text,
    qty numeric(20,6),
    amount numeric(20,6),
    currency_code text,
    exchange_rate numeric(20,6),
    input_user_id text,
    input_user_name text,
    modified_user_id text,
    modified_user_name text,
    source_payload jsonb,
    etl_batch_id text,
    etl_loaded_at timestamptz NOT NULL DEFAULT now(),
    etl_updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_obt_patient_visit_doc_date
    ON public.obt_patient_visit (doc_date);

CREATE INDEX IF NOT EXISTS idx_obt_patient_visit_doc_no
    ON public.obt_patient_visit (doc_no);

CREATE INDEX IF NOT EXISTS idx_obt_patient_visit_source_header_id
    ON public.obt_patient_visit (source_header_id);

CREATE INDEX IF NOT EXISTS idx_obt_patient_visit_source_detail_id
    ON public.obt_patient_visit (source_detail_id);

CREATE INDEX IF NOT EXISTS idx_obt_patient_visit_contact_code
    ON public.obt_patient_visit (contact_code);

CREATE INDEX IF NOT EXISTS idx_obt_patient_visit_item_code
    ON public.obt_patient_visit (item_code);

CREATE TABLE IF NOT EXISTS public.obt_patient_visit_billing (
    obt_id bigserial PRIMARY KEY,
    obt_name text NOT NULL,
    source_module text,
    source_doc_type text,
    source_header_id text,
    source_detail_id text,
    source_allocation_id text,
    doc_no text,
    doc_date timestamptz,
    doc_status_code text,
    doc_status_name text,
    branch_code text,
    branch_name text,
    location_code text,
    location_name text,
    contact_id text,
    contact_code text,
    contact_name text,
    item_id text,
    item_code text,
    item_name text,
    uom_code text,
    upstream_doc_no text,
    downstream_doc_no text,
    lineage_path text,
    qty numeric(20,6),
    amount numeric(20,6),
    currency_code text,
    exchange_rate numeric(20,6),
    input_user_id text,
    input_user_name text,
    modified_user_id text,
    modified_user_name text,
    source_payload jsonb,
    etl_batch_id text,
    etl_loaded_at timestamptz NOT NULL DEFAULT now(),
    etl_updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_obt_patient_visit_billing_doc_date
    ON public.obt_patient_visit_billing (doc_date);

CREATE INDEX IF NOT EXISTS idx_obt_patient_visit_billing_doc_no
    ON public.obt_patient_visit_billing (doc_no);

CREATE INDEX IF NOT EXISTS idx_obt_patient_visit_billing_source_header_id
    ON public.obt_patient_visit_billing (source_header_id);

CREATE INDEX IF NOT EXISTS idx_obt_patient_visit_billing_source_detail_id
    ON public.obt_patient_visit_billing (source_detail_id);

CREATE INDEX IF NOT EXISTS idx_obt_patient_visit_billing_contact_code
    ON public.obt_patient_visit_billing (contact_code);

CREATE INDEX IF NOT EXISTS idx_obt_patient_visit_billing_item_code
    ON public.obt_patient_visit_billing (item_code);

CREATE TABLE IF NOT EXISTS public.obt_pos_point_activity (
    obt_id bigserial PRIMARY KEY,
    obt_name text NOT NULL,
    source_module text,
    source_doc_type text,
    source_header_id text,
    source_detail_id text,
    source_allocation_id text,
    doc_no text,
    doc_date timestamptz,
    doc_status_code text,
    doc_status_name text,
    branch_code text,
    branch_name text,
    location_code text,
    location_name text,
    contact_id text,
    contact_code text,
    contact_name text,
    item_id text,
    item_code text,
    item_name text,
    uom_code text,
    upstream_doc_no text,
    downstream_doc_no text,
    lineage_path text,
    qty numeric(20,6),
    amount numeric(20,6),
    currency_code text,
    exchange_rate numeric(20,6),
    input_user_id text,
    input_user_name text,
    modified_user_id text,
    modified_user_name text,
    source_payload jsonb,
    etl_batch_id text,
    etl_loaded_at timestamptz NOT NULL DEFAULT now(),
    etl_updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_obt_pos_point_activity_doc_date
    ON public.obt_pos_point_activity (doc_date);

CREATE INDEX IF NOT EXISTS idx_obt_pos_point_activity_doc_no
    ON public.obt_pos_point_activity (doc_no);

CREATE INDEX IF NOT EXISTS idx_obt_pos_point_activity_source_header_id
    ON public.obt_pos_point_activity (source_header_id);

CREATE INDEX IF NOT EXISTS idx_obt_pos_point_activity_source_detail_id
    ON public.obt_pos_point_activity (source_detail_id);

CREATE INDEX IF NOT EXISTS idx_obt_pos_point_activity_contact_code
    ON public.obt_pos_point_activity (contact_code);

CREATE INDEX IF NOT EXISTS idx_obt_pos_point_activity_item_code
    ON public.obt_pos_point_activity (item_code);

CREATE TABLE IF NOT EXISTS public.obt_pos_promo_application (
    obt_id bigserial PRIMARY KEY,
    obt_name text NOT NULL,
    source_module text,
    source_doc_type text,
    source_header_id text,
    source_detail_id text,
    source_allocation_id text,
    doc_no text,
    doc_date timestamptz,
    doc_status_code text,
    doc_status_name text,
    branch_code text,
    branch_name text,
    location_code text,
    location_name text,
    contact_id text,
    contact_code text,
    contact_name text,
    item_id text,
    item_code text,
    item_name text,
    uom_code text,
    upstream_doc_no text,
    downstream_doc_no text,
    lineage_path text,
    qty numeric(20,6),
    amount numeric(20,6),
    currency_code text,
    exchange_rate numeric(20,6),
    input_user_id text,
    input_user_name text,
    modified_user_id text,
    modified_user_name text,
    source_payload jsonb,
    etl_batch_id text,
    etl_loaded_at timestamptz NOT NULL DEFAULT now(),
    etl_updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_obt_pos_promo_application_doc_date
    ON public.obt_pos_promo_application (doc_date);

CREATE INDEX IF NOT EXISTS idx_obt_pos_promo_application_doc_no
    ON public.obt_pos_promo_application (doc_no);

CREATE INDEX IF NOT EXISTS idx_obt_pos_promo_application_source_header_id
    ON public.obt_pos_promo_application (source_header_id);

CREATE INDEX IF NOT EXISTS idx_obt_pos_promo_application_source_detail_id
    ON public.obt_pos_promo_application (source_detail_id);

CREATE INDEX IF NOT EXISTS idx_obt_pos_promo_application_contact_code
    ON public.obt_pos_promo_application (contact_code);

CREATE INDEX IF NOT EXISTS idx_obt_pos_promo_application_item_code
    ON public.obt_pos_promo_application (item_code);

CREATE TABLE IF NOT EXISTS public.obt_pos_to_sales (
    obt_id bigserial PRIMARY KEY,
    obt_name text NOT NULL,
    source_module text,
    source_doc_type text,
    source_header_id text,
    source_detail_id text,
    source_allocation_id text,
    doc_no text,
    doc_date timestamptz,
    doc_status_code text,
    doc_status_name text,
    branch_code text,
    branch_name text,
    location_code text,
    location_name text,
    contact_id text,
    contact_code text,
    contact_name text,
    item_id text,
    item_code text,
    item_name text,
    uom_code text,
    upstream_doc_no text,
    downstream_doc_no text,
    lineage_path text,
    qty numeric(20,6),
    amount numeric(20,6),
    currency_code text,
    exchange_rate numeric(20,6),
    input_user_id text,
    input_user_name text,
    modified_user_id text,
    modified_user_name text,
    source_payload jsonb,
    etl_batch_id text,
    etl_loaded_at timestamptz NOT NULL DEFAULT now(),
    etl_updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_obt_pos_to_sales_doc_date
    ON public.obt_pos_to_sales (doc_date);

CREATE INDEX IF NOT EXISTS idx_obt_pos_to_sales_doc_no
    ON public.obt_pos_to_sales (doc_no);

CREATE INDEX IF NOT EXISTS idx_obt_pos_to_sales_source_header_id
    ON public.obt_pos_to_sales (source_header_id);

CREATE INDEX IF NOT EXISTS idx_obt_pos_to_sales_source_detail_id
    ON public.obt_pos_to_sales (source_detail_id);

CREATE INDEX IF NOT EXISTS idx_obt_pos_to_sales_contact_code
    ON public.obt_pos_to_sales (contact_code);

CREATE INDEX IF NOT EXISTS idx_obt_pos_to_sales_item_code
    ON public.obt_pos_to_sales (item_code);

CREATE TABLE IF NOT EXISTS public.obt_pos_transaction_line (
    obt_id bigserial PRIMARY KEY,
    obt_name text NOT NULL,
    source_module text,
    source_doc_type text,
    source_header_id text,
    source_detail_id text,
    source_allocation_id text,
    doc_no text,
    doc_date timestamptz,
    doc_status_code text,
    doc_status_name text,
    branch_code text,
    branch_name text,
    location_code text,
    location_name text,
    contact_id text,
    contact_code text,
    contact_name text,
    item_id text,
    item_code text,
    item_name text,
    uom_code text,
    upstream_doc_no text,
    downstream_doc_no text,
    lineage_path text,
    qty numeric(20,6),
    amount numeric(20,6),
    currency_code text,
    exchange_rate numeric(20,6),
    input_user_id text,
    input_user_name text,
    modified_user_id text,
    modified_user_name text,
    source_payload jsonb,
    etl_batch_id text,
    etl_loaded_at timestamptz NOT NULL DEFAULT now(),
    etl_updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_obt_pos_transaction_line_doc_date
    ON public.obt_pos_transaction_line (doc_date);

CREATE INDEX IF NOT EXISTS idx_obt_pos_transaction_line_doc_no
    ON public.obt_pos_transaction_line (doc_no);

CREATE INDEX IF NOT EXISTS idx_obt_pos_transaction_line_source_header_id
    ON public.obt_pos_transaction_line (source_header_id);

CREATE INDEX IF NOT EXISTS idx_obt_pos_transaction_line_source_detail_id
    ON public.obt_pos_transaction_line (source_detail_id);

CREATE INDEX IF NOT EXISTS idx_obt_pos_transaction_line_contact_code
    ON public.obt_pos_transaction_line (contact_code);

CREATE INDEX IF NOT EXISTS idx_obt_pos_transaction_line_item_code
    ON public.obt_pos_transaction_line (item_code);

CREATE TABLE IF NOT EXISTS public.obt_pos_voucher_payment (
    obt_id bigserial PRIMARY KEY,
    obt_name text NOT NULL,
    source_module text,
    source_doc_type text,
    source_header_id text,
    source_detail_id text,
    source_allocation_id text,
    doc_no text,
    doc_date timestamptz,
    doc_status_code text,
    doc_status_name text,
    branch_code text,
    branch_name text,
    location_code text,
    location_name text,
    contact_id text,
    contact_code text,
    contact_name text,
    item_id text,
    item_code text,
    item_name text,
    uom_code text,
    upstream_doc_no text,
    downstream_doc_no text,
    lineage_path text,
    qty numeric(20,6),
    amount numeric(20,6),
    currency_code text,
    exchange_rate numeric(20,6),
    input_user_id text,
    input_user_name text,
    modified_user_id text,
    modified_user_name text,
    source_payload jsonb,
    etl_batch_id text,
    etl_loaded_at timestamptz NOT NULL DEFAULT now(),
    etl_updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_obt_pos_voucher_payment_doc_date
    ON public.obt_pos_voucher_payment (doc_date);

CREATE INDEX IF NOT EXISTS idx_obt_pos_voucher_payment_doc_no
    ON public.obt_pos_voucher_payment (doc_no);

CREATE INDEX IF NOT EXISTS idx_obt_pos_voucher_payment_source_header_id
    ON public.obt_pos_voucher_payment (source_header_id);

CREATE INDEX IF NOT EXISTS idx_obt_pos_voucher_payment_source_detail_id
    ON public.obt_pos_voucher_payment (source_detail_id);

CREATE INDEX IF NOT EXISTS idx_obt_pos_voucher_payment_contact_code
    ON public.obt_pos_voucher_payment (contact_code);

CREATE INDEX IF NOT EXISTS idx_obt_pos_voucher_payment_item_code
    ON public.obt_pos_voucher_payment (item_code);

CREATE TABLE IF NOT EXISTS public.obt_purchase_line_flow (
    obt_id bigserial PRIMARY KEY,
    obt_name text NOT NULL,
    source_module text,
    source_doc_type text,
    source_header_id text,
    source_detail_id text,
    source_allocation_id text,
    doc_no text,
    doc_date timestamptz,
    doc_status_code text,
    doc_status_name text,
    branch_code text,
    branch_name text,
    location_code text,
    location_name text,
    contact_id text,
    contact_code text,
    contact_name text,
    item_id text,
    item_code text,
    item_name text,
    uom_code text,
    upstream_doc_no text,
    downstream_doc_no text,
    lineage_path text,
    qty numeric(20,6),
    amount numeric(20,6),
    currency_code text,
    exchange_rate numeric(20,6),
    input_user_id text,
    input_user_name text,
    modified_user_id text,
    modified_user_name text,
    source_payload jsonb,
    etl_batch_id text,
    etl_loaded_at timestamptz NOT NULL DEFAULT now(),
    etl_updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_obt_purchase_line_flow_doc_date
    ON public.obt_purchase_line_flow (doc_date);

CREATE INDEX IF NOT EXISTS idx_obt_purchase_line_flow_doc_no
    ON public.obt_purchase_line_flow (doc_no);

CREATE INDEX IF NOT EXISTS idx_obt_purchase_line_flow_source_header_id
    ON public.obt_purchase_line_flow (source_header_id);

CREATE INDEX IF NOT EXISTS idx_obt_purchase_line_flow_source_detail_id
    ON public.obt_purchase_line_flow (source_detail_id);

CREATE INDEX IF NOT EXISTS idx_obt_purchase_line_flow_contact_code
    ON public.obt_purchase_line_flow (contact_code);

CREATE INDEX IF NOT EXISTS idx_obt_purchase_line_flow_item_code
    ON public.obt_purchase_line_flow (item_code);

CREATE TABLE IF NOT EXISTS public.obt_purchase_payment (
    obt_id bigserial PRIMARY KEY,
    obt_name text NOT NULL,
    source_module text,
    source_doc_type text,
    source_header_id text,
    source_detail_id text,
    source_allocation_id text,
    doc_no text,
    doc_date timestamptz,
    doc_status_code text,
    doc_status_name text,
    branch_code text,
    branch_name text,
    location_code text,
    location_name text,
    contact_id text,
    contact_code text,
    contact_name text,
    item_id text,
    item_code text,
    item_name text,
    uom_code text,
    upstream_doc_no text,
    downstream_doc_no text,
    lineage_path text,
    qty numeric(20,6),
    amount numeric(20,6),
    currency_code text,
    exchange_rate numeric(20,6),
    input_user_id text,
    input_user_name text,
    modified_user_id text,
    modified_user_name text,
    source_payload jsonb,
    etl_batch_id text,
    etl_loaded_at timestamptz NOT NULL DEFAULT now(),
    etl_updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_obt_purchase_payment_doc_date
    ON public.obt_purchase_payment (doc_date);

CREATE INDEX IF NOT EXISTS idx_obt_purchase_payment_doc_no
    ON public.obt_purchase_payment (doc_no);

CREATE INDEX IF NOT EXISTS idx_obt_purchase_payment_source_header_id
    ON public.obt_purchase_payment (source_header_id);

CREATE INDEX IF NOT EXISTS idx_obt_purchase_payment_source_detail_id
    ON public.obt_purchase_payment (source_detail_id);

CREATE INDEX IF NOT EXISTS idx_obt_purchase_payment_contact_code
    ON public.obt_purchase_payment (contact_code);

CREATE INDEX IF NOT EXISTS idx_obt_purchase_payment_item_code
    ON public.obt_purchase_payment (item_code);

CREATE TABLE IF NOT EXISTS public.obt_purchase_receipt_line (
    obt_id bigserial PRIMARY KEY,
    obt_name text NOT NULL,
    source_module text,
    source_doc_type text,
    source_header_id text,
    source_detail_id text,
    source_allocation_id text,
    doc_no text,
    doc_date timestamptz,
    doc_status_code text,
    doc_status_name text,
    branch_code text,
    branch_name text,
    location_code text,
    location_name text,
    contact_id text,
    contact_code text,
    contact_name text,
    item_id text,
    item_code text,
    item_name text,
    uom_code text,
    upstream_doc_no text,
    downstream_doc_no text,
    lineage_path text,
    qty numeric(20,6),
    amount numeric(20,6),
    currency_code text,
    exchange_rate numeric(20,6),
    input_user_id text,
    input_user_name text,
    modified_user_id text,
    modified_user_name text,
    source_payload jsonb,
    etl_batch_id text,
    etl_loaded_at timestamptz NOT NULL DEFAULT now(),
    etl_updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_obt_purchase_receipt_line_doc_date
    ON public.obt_purchase_receipt_line (doc_date);

CREATE INDEX IF NOT EXISTS idx_obt_purchase_receipt_line_doc_no
    ON public.obt_purchase_receipt_line (doc_no);

CREATE INDEX IF NOT EXISTS idx_obt_purchase_receipt_line_source_header_id
    ON public.obt_purchase_receipt_line (source_header_id);

CREATE INDEX IF NOT EXISTS idx_obt_purchase_receipt_line_source_detail_id
    ON public.obt_purchase_receipt_line (source_detail_id);

CREATE INDEX IF NOT EXISTS idx_obt_purchase_receipt_line_contact_code
    ON public.obt_purchase_receipt_line (contact_code);

CREATE INDEX IF NOT EXISTS idx_obt_purchase_receipt_line_item_code
    ON public.obt_purchase_receipt_line (item_code);

CREATE TABLE IF NOT EXISTS public.obt_purchase_to_asset_to_finance (
    obt_id bigserial PRIMARY KEY,
    obt_name text NOT NULL,
    source_module text,
    source_doc_type text,
    source_header_id text,
    source_detail_id text,
    source_allocation_id text,
    doc_no text,
    doc_date timestamptz,
    doc_status_code text,
    doc_status_name text,
    branch_code text,
    branch_name text,
    location_code text,
    location_name text,
    contact_id text,
    contact_code text,
    contact_name text,
    item_id text,
    item_code text,
    item_name text,
    uom_code text,
    upstream_doc_no text,
    downstream_doc_no text,
    lineage_path text,
    qty numeric(20,6),
    amount numeric(20,6),
    currency_code text,
    exchange_rate numeric(20,6),
    input_user_id text,
    input_user_name text,
    modified_user_id text,
    modified_user_name text,
    source_payload jsonb,
    etl_batch_id text,
    etl_loaded_at timestamptz NOT NULL DEFAULT now(),
    etl_updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_obt_purchase_to_asset_to_finance_doc_date
    ON public.obt_purchase_to_asset_to_finance (doc_date);

CREATE INDEX IF NOT EXISTS idx_obt_purchase_to_asset_to_finance_doc_no
    ON public.obt_purchase_to_asset_to_finance (doc_no);

CREATE INDEX IF NOT EXISTS idx_obt_purchase_to_asset_to_finance_source_header_id
    ON public.obt_purchase_to_asset_to_finance (source_header_id);

CREATE INDEX IF NOT EXISTS idx_obt_purchase_to_asset_to_finance_source_detail_id
    ON public.obt_purchase_to_asset_to_finance (source_detail_id);

CREATE INDEX IF NOT EXISTS idx_obt_purchase_to_asset_to_finance_contact_code
    ON public.obt_purchase_to_asset_to_finance (contact_code);

CREATE INDEX IF NOT EXISTS idx_obt_purchase_to_asset_to_finance_item_code
    ON public.obt_purchase_to_asset_to_finance (item_code);

CREATE TABLE IF NOT EXISTS public.obt_purchase_to_finance (
    obt_id bigserial PRIMARY KEY,
    obt_name text NOT NULL,
    source_module text,
    source_doc_type text,
    source_header_id text,
    source_detail_id text,
    source_allocation_id text,
    doc_no text,
    doc_date timestamptz,
    doc_status_code text,
    doc_status_name text,
    branch_code text,
    branch_name text,
    location_code text,
    location_name text,
    contact_id text,
    contact_code text,
    contact_name text,
    item_id text,
    item_code text,
    item_name text,
    uom_code text,
    upstream_doc_no text,
    downstream_doc_no text,
    lineage_path text,
    qty numeric(20,6),
    amount numeric(20,6),
    currency_code text,
    exchange_rate numeric(20,6),
    input_user_id text,
    input_user_name text,
    modified_user_id text,
    modified_user_name text,
    source_payload jsonb,
    etl_batch_id text,
    etl_loaded_at timestamptz NOT NULL DEFAULT now(),
    etl_updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_obt_purchase_to_finance_doc_date
    ON public.obt_purchase_to_finance (doc_date);

CREATE INDEX IF NOT EXISTS idx_obt_purchase_to_finance_doc_no
    ON public.obt_purchase_to_finance (doc_no);

CREATE INDEX IF NOT EXISTS idx_obt_purchase_to_finance_source_header_id
    ON public.obt_purchase_to_finance (source_header_id);

CREATE INDEX IF NOT EXISTS idx_obt_purchase_to_finance_source_detail_id
    ON public.obt_purchase_to_finance (source_detail_id);

CREATE INDEX IF NOT EXISTS idx_obt_purchase_to_finance_contact_code
    ON public.obt_purchase_to_finance (contact_code);

CREATE INDEX IF NOT EXISTS idx_obt_purchase_to_finance_item_code
    ON public.obt_purchase_to_finance (item_code);

CREATE TABLE IF NOT EXISTS public.obt_purchase_to_inventory (
    obt_id bigserial PRIMARY KEY,
    obt_name text NOT NULL,
    source_module text,
    source_doc_type text,
    source_header_id text,
    source_detail_id text,
    source_allocation_id text,
    doc_no text,
    doc_date timestamptz,
    doc_status_code text,
    doc_status_name text,
    branch_code text,
    branch_name text,
    location_code text,
    location_name text,
    contact_id text,
    contact_code text,
    contact_name text,
    item_id text,
    item_code text,
    item_name text,
    uom_code text,
    upstream_doc_no text,
    downstream_doc_no text,
    lineage_path text,
    qty numeric(20,6),
    amount numeric(20,6),
    currency_code text,
    exchange_rate numeric(20,6),
    input_user_id text,
    input_user_name text,
    modified_user_id text,
    modified_user_name text,
    source_payload jsonb,
    etl_batch_id text,
    etl_loaded_at timestamptz NOT NULL DEFAULT now(),
    etl_updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_obt_purchase_to_inventory_doc_date
    ON public.obt_purchase_to_inventory (doc_date);

CREATE INDEX IF NOT EXISTS idx_obt_purchase_to_inventory_doc_no
    ON public.obt_purchase_to_inventory (doc_no);

CREATE INDEX IF NOT EXISTS idx_obt_purchase_to_inventory_source_header_id
    ON public.obt_purchase_to_inventory (source_header_id);

CREATE INDEX IF NOT EXISTS idx_obt_purchase_to_inventory_source_detail_id
    ON public.obt_purchase_to_inventory (source_detail_id);

CREATE INDEX IF NOT EXISTS idx_obt_purchase_to_inventory_contact_code
    ON public.obt_purchase_to_inventory (contact_code);

CREATE INDEX IF NOT EXISTS idx_obt_purchase_to_inventory_item_code
    ON public.obt_purchase_to_inventory (item_code);

CREATE TABLE IF NOT EXISTS public.obt_queue_activity (
    obt_id bigserial PRIMARY KEY,
    obt_name text NOT NULL,
    source_module text,
    source_doc_type text,
    source_header_id text,
    source_detail_id text,
    source_allocation_id text,
    doc_no text,
    doc_date timestamptz,
    doc_status_code text,
    doc_status_name text,
    branch_code text,
    branch_name text,
    location_code text,
    location_name text,
    contact_id text,
    contact_code text,
    contact_name text,
    item_id text,
    item_code text,
    item_name text,
    uom_code text,
    upstream_doc_no text,
    downstream_doc_no text,
    lineage_path text,
    qty numeric(20,6),
    amount numeric(20,6),
    currency_code text,
    exchange_rate numeric(20,6),
    input_user_id text,
    input_user_name text,
    modified_user_id text,
    modified_user_name text,
    source_payload jsonb,
    etl_batch_id text,
    etl_loaded_at timestamptz NOT NULL DEFAULT now(),
    etl_updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_obt_queue_activity_doc_date
    ON public.obt_queue_activity (doc_date);

CREATE INDEX IF NOT EXISTS idx_obt_queue_activity_doc_no
    ON public.obt_queue_activity (doc_no);

CREATE INDEX IF NOT EXISTS idx_obt_queue_activity_source_header_id
    ON public.obt_queue_activity (source_header_id);

CREATE INDEX IF NOT EXISTS idx_obt_queue_activity_source_detail_id
    ON public.obt_queue_activity (source_detail_id);

CREATE INDEX IF NOT EXISTS idx_obt_queue_activity_contact_code
    ON public.obt_queue_activity (contact_code);

CREATE INDEX IF NOT EXISTS idx_obt_queue_activity_item_code
    ON public.obt_queue_activity (item_code);

CREATE TABLE IF NOT EXISTS public.obt_sales_collection_allocation (
    obt_id bigserial PRIMARY KEY,
    obt_name text NOT NULL,
    source_module text,
    source_doc_type text,
    source_header_id text,
    source_detail_id text,
    source_allocation_id text,
    doc_no text,
    doc_date timestamptz,
    doc_status_code text,
    doc_status_name text,
    branch_code text,
    branch_name text,
    location_code text,
    location_name text,
    contact_id text,
    contact_code text,
    contact_name text,
    item_id text,
    item_code text,
    item_name text,
    uom_code text,
    upstream_doc_no text,
    downstream_doc_no text,
    lineage_path text,
    qty numeric(20,6),
    amount numeric(20,6),
    currency_code text,
    exchange_rate numeric(20,6),
    input_user_id text,
    input_user_name text,
    modified_user_id text,
    modified_user_name text,
    source_payload jsonb,
    etl_batch_id text,
    etl_loaded_at timestamptz NOT NULL DEFAULT now(),
    etl_updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_obt_sales_collection_allocation_doc_date
    ON public.obt_sales_collection_allocation (doc_date);

CREATE INDEX IF NOT EXISTS idx_obt_sales_collection_allocation_doc_no
    ON public.obt_sales_collection_allocation (doc_no);

CREATE INDEX IF NOT EXISTS idx_obt_sales_collection_allocation_source_header_id
    ON public.obt_sales_collection_allocation (source_header_id);

CREATE INDEX IF NOT EXISTS idx_obt_sales_collection_allocation_source_detail_id
    ON public.obt_sales_collection_allocation (source_detail_id);

CREATE INDEX IF NOT EXISTS idx_obt_sales_collection_allocation_contact_code
    ON public.obt_sales_collection_allocation (contact_code);

CREATE INDEX IF NOT EXISTS idx_obt_sales_collection_allocation_item_code
    ON public.obt_sales_collection_allocation (item_code);

CREATE TABLE IF NOT EXISTS public.obt_sales_line_flow (
    obt_id bigserial PRIMARY KEY,
    obt_name text NOT NULL,
    source_module text,
    source_doc_type text,
    source_header_id text,
    source_detail_id text,
    source_allocation_id text,
    doc_no text,
    doc_date timestamptz,
    doc_status_code text,
    doc_status_name text,
    branch_code text,
    branch_name text,
    location_code text,
    location_name text,
    contact_id text,
    contact_code text,
    contact_name text,
    item_id text,
    item_code text,
    item_name text,
    uom_code text,
    upstream_doc_no text,
    downstream_doc_no text,
    lineage_path text,
    qty numeric(20,6),
    amount numeric(20,6),
    currency_code text,
    exchange_rate numeric(20,6),
    input_user_id text,
    input_user_name text,
    modified_user_id text,
    modified_user_name text,
    source_payload jsonb,
    etl_batch_id text,
    etl_loaded_at timestamptz NOT NULL DEFAULT now(),
    etl_updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_obt_sales_line_flow_doc_date
    ON public.obt_sales_line_flow (doc_date);

CREATE INDEX IF NOT EXISTS idx_obt_sales_line_flow_doc_no
    ON public.obt_sales_line_flow (doc_no);

CREATE INDEX IF NOT EXISTS idx_obt_sales_line_flow_source_header_id
    ON public.obt_sales_line_flow (source_header_id);

CREATE INDEX IF NOT EXISTS idx_obt_sales_line_flow_source_detail_id
    ON public.obt_sales_line_flow (source_detail_id);

CREATE INDEX IF NOT EXISTS idx_obt_sales_line_flow_contact_code
    ON public.obt_sales_line_flow (contact_code);

CREATE INDEX IF NOT EXISTS idx_obt_sales_line_flow_item_code
    ON public.obt_sales_line_flow (item_code);

CREATE TABLE IF NOT EXISTS public.obt_sales_receivable (
    obt_id bigserial PRIMARY KEY,
    obt_name text NOT NULL,
    source_module text,
    source_doc_type text,
    source_header_id text,
    source_detail_id text,
    source_allocation_id text,
    doc_no text,
    doc_date timestamptz,
    doc_status_code text,
    doc_status_name text,
    branch_code text,
    branch_name text,
    location_code text,
    location_name text,
    contact_id text,
    contact_code text,
    contact_name text,
    item_id text,
    item_code text,
    item_name text,
    uom_code text,
    upstream_doc_no text,
    downstream_doc_no text,
    lineage_path text,
    qty numeric(20,6),
    amount numeric(20,6),
    currency_code text,
    exchange_rate numeric(20,6),
    input_user_id text,
    input_user_name text,
    modified_user_id text,
    modified_user_name text,
    source_payload jsonb,
    etl_batch_id text,
    etl_loaded_at timestamptz NOT NULL DEFAULT now(),
    etl_updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_obt_sales_receivable_doc_date
    ON public.obt_sales_receivable (doc_date);

CREATE INDEX IF NOT EXISTS idx_obt_sales_receivable_doc_no
    ON public.obt_sales_receivable (doc_no);

CREATE INDEX IF NOT EXISTS idx_obt_sales_receivable_source_header_id
    ON public.obt_sales_receivable (source_header_id);

CREATE INDEX IF NOT EXISTS idx_obt_sales_receivable_source_detail_id
    ON public.obt_sales_receivable (source_detail_id);

CREATE INDEX IF NOT EXISTS idx_obt_sales_receivable_contact_code
    ON public.obt_sales_receivable (contact_code);

CREATE INDEX IF NOT EXISTS idx_obt_sales_receivable_item_code
    ON public.obt_sales_receivable (item_code);

CREATE INDEX IF NOT EXISTS idx_obt_sales_receivable_due_date
    ON public.obt_sales_receivable (due_date);

CREATE INDEX IF NOT EXISTS idx_obt_sales_receivable_payment_status_name
    ON public.obt_sales_receivable (payment_status_name);

CREATE TABLE IF NOT EXISTS public.obt_sales_to_finance (
    obt_id bigserial PRIMARY KEY,
    obt_name text NOT NULL,
    source_module text,
    source_doc_type text,
    source_header_id text,
    source_detail_id text,
    source_allocation_id text,
    doc_no text,
    doc_date timestamptz,
    doc_status_code text,
    doc_status_name text,
    branch_code text,
    branch_name text,
    location_code text,
    location_name text,
    contact_id text,
    contact_code text,
    contact_name text,
    item_id text,
    item_code text,
    item_name text,
    uom_code text,
    upstream_doc_no text,
    downstream_doc_no text,
    lineage_path text,
    qty numeric(20,6),
    amount numeric(20,6),
    currency_code text,
    exchange_rate numeric(20,6),
    input_user_id text,
    input_user_name text,
    modified_user_id text,
    modified_user_name text,
    source_payload jsonb,
    etl_batch_id text,
    etl_loaded_at timestamptz NOT NULL DEFAULT now(),
    etl_updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_obt_sales_to_finance_doc_date
    ON public.obt_sales_to_finance (doc_date);

CREATE INDEX IF NOT EXISTS idx_obt_sales_to_finance_doc_no
    ON public.obt_sales_to_finance (doc_no);

CREATE INDEX IF NOT EXISTS idx_obt_sales_to_finance_source_header_id
    ON public.obt_sales_to_finance (source_header_id);

CREATE INDEX IF NOT EXISTS idx_obt_sales_to_finance_source_detail_id
    ON public.obt_sales_to_finance (source_detail_id);

CREATE INDEX IF NOT EXISTS idx_obt_sales_to_finance_contact_code
    ON public.obt_sales_to_finance (contact_code);

CREATE INDEX IF NOT EXISTS idx_obt_sales_to_finance_item_code
    ON public.obt_sales_to_finance (item_code);

CREATE TABLE IF NOT EXISTS public.obt_sales_to_inventory (
    obt_id bigserial PRIMARY KEY,
    obt_name text NOT NULL,
    source_module text,
    source_doc_type text,
    source_header_id text,
    source_detail_id text,
    source_allocation_id text,
    doc_no text,
    doc_date timestamptz,
    doc_status_code text,
    doc_status_name text,
    branch_code text,
    branch_name text,
    location_code text,
    location_name text,
    contact_id text,
    contact_code text,
    contact_name text,
    item_id text,
    item_code text,
    item_name text,
    uom_code text,
    upstream_doc_no text,
    downstream_doc_no text,
    lineage_path text,
    qty numeric(20,6),
    amount numeric(20,6),
    currency_code text,
    exchange_rate numeric(20,6),
    input_user_id text,
    input_user_name text,
    modified_user_id text,
    modified_user_name text,
    source_payload jsonb,
    etl_batch_id text,
    etl_loaded_at timestamptz NOT NULL DEFAULT now(),
    etl_updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_obt_sales_to_inventory_doc_date
    ON public.obt_sales_to_inventory (doc_date);

CREATE INDEX IF NOT EXISTS idx_obt_sales_to_inventory_doc_no
    ON public.obt_sales_to_inventory (doc_no);

CREATE INDEX IF NOT EXISTS idx_obt_sales_to_inventory_source_header_id
    ON public.obt_sales_to_inventory (source_header_id);

CREATE INDEX IF NOT EXISTS idx_obt_sales_to_inventory_source_detail_id
    ON public.obt_sales_to_inventory (source_detail_id);

CREATE INDEX IF NOT EXISTS idx_obt_sales_to_inventory_contact_code
    ON public.obt_sales_to_inventory (contact_code);

CREATE INDEX IF NOT EXISTS idx_obt_sales_to_inventory_item_code
    ON public.obt_sales_to_inventory (item_code);

CREATE TABLE IF NOT EXISTS public.obt_sales_to_manufacturing (
    obt_id bigserial PRIMARY KEY,
    obt_name text NOT NULL,
    source_module text,
    source_doc_type text,
    source_header_id text,
    source_detail_id text,
    source_allocation_id text,
    doc_no text,
    doc_date timestamptz,
    doc_status_code text,
    doc_status_name text,
    branch_code text,
    branch_name text,
    location_code text,
    location_name text,
    contact_id text,
    contact_code text,
    contact_name text,
    item_id text,
    item_code text,
    item_name text,
    uom_code text,
    upstream_doc_no text,
    downstream_doc_no text,
    lineage_path text,
    qty numeric(20,6),
    amount numeric(20,6),
    currency_code text,
    exchange_rate numeric(20,6),
    input_user_id text,
    input_user_name text,
    modified_user_id text,
    modified_user_name text,
    source_payload jsonb,
    etl_batch_id text,
    etl_loaded_at timestamptz NOT NULL DEFAULT now(),
    etl_updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_obt_sales_to_manufacturing_doc_date
    ON public.obt_sales_to_manufacturing (doc_date);

CREATE INDEX IF NOT EXISTS idx_obt_sales_to_manufacturing_doc_no
    ON public.obt_sales_to_manufacturing (doc_no);

CREATE INDEX IF NOT EXISTS idx_obt_sales_to_manufacturing_source_header_id
    ON public.obt_sales_to_manufacturing (source_header_id);

CREATE INDEX IF NOT EXISTS idx_obt_sales_to_manufacturing_source_detail_id
    ON public.obt_sales_to_manufacturing (source_detail_id);

CREATE INDEX IF NOT EXISTS idx_obt_sales_to_manufacturing_contact_code
    ON public.obt_sales_to_manufacturing (contact_code);

CREATE INDEX IF NOT EXISTS idx_obt_sales_to_manufacturing_item_code
    ON public.obt_sales_to_manufacturing (item_code);

CREATE TABLE IF NOT EXISTS public.obt_system_configuration (
    obt_id bigserial PRIMARY KEY,
    obt_name text NOT NULL,
    source_module text,
    source_doc_type text,
    source_header_id text,
    source_detail_id text,
    source_allocation_id text,
    doc_no text,
    doc_date timestamptz,
    doc_status_code text,
    doc_status_name text,
    branch_code text,
    branch_name text,
    location_code text,
    location_name text,
    contact_id text,
    contact_code text,
    contact_name text,
    item_id text,
    item_code text,
    item_name text,
    uom_code text,
    upstream_doc_no text,
    downstream_doc_no text,
    lineage_path text,
    qty numeric(20,6),
    amount numeric(20,6),
    currency_code text,
    exchange_rate numeric(20,6),
    input_user_id text,
    input_user_name text,
    modified_user_id text,
    modified_user_name text,
    source_payload jsonb,
    etl_batch_id text,
    etl_loaded_at timestamptz NOT NULL DEFAULT now(),
    etl_updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_obt_system_configuration_doc_date
    ON public.obt_system_configuration (doc_date);

CREATE INDEX IF NOT EXISTS idx_obt_system_configuration_doc_no
    ON public.obt_system_configuration (doc_no);

CREATE INDEX IF NOT EXISTS idx_obt_system_configuration_source_header_id
    ON public.obt_system_configuration (source_header_id);

CREATE INDEX IF NOT EXISTS idx_obt_system_configuration_source_detail_id
    ON public.obt_system_configuration (source_detail_id);

CREATE INDEX IF NOT EXISTS idx_obt_system_configuration_contact_code
    ON public.obt_system_configuration (contact_code);

CREATE INDEX IF NOT EXISTS idx_obt_system_configuration_item_code
    ON public.obt_system_configuration (item_code);
