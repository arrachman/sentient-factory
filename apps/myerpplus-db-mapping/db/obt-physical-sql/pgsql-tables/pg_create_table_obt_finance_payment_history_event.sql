CREATE TABLE IF NOT EXISTS public.obt_finance_payment_history_event (
    payment_history_event_key text PRIMARY KEY,
    obt_name text NOT NULL DEFAULT 'obt_finance_payment_history_event',
    source_module text NOT NULL,
    source_doc_type text NOT NULL,
    source_history_id text NOT NULL,
    source_header_id text,
    source_payment_id text,
    doc_no text,
    doc_date timestamptz,
    doc_status_code text,
    previous_status_code text,
    payment_method_code text,
    payment_method_name text,
    branch_code text,
    branch_name text,
    location_code text,
    location_name text,
    contact_id text,
    contact_code text,
    contact_name text,
    giro_type_code text,
    giro_no text,
    giro_due_date timestamptz,
    bank_code text,
    bank_name text,
    bank_account_no text,
    bank_account_name text,
    giro_account_no text,
    notes text,
    currency_code text,
    exchange_rate numeric(20,6),
    amount numeric(20,6),
    amount_foreign numeric(20,6),
    line_order bigint,
    source_payload jsonb,
    etl_batch_id text,
    etl_loaded_at timestamptz NOT NULL DEFAULT now(),
    etl_updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_obt_fin_pay_hist_doc
    ON public.obt_finance_payment_history_event (source_doc_type, doc_no, doc_date);

CREATE INDEX IF NOT EXISTS idx_obt_fin_pay_hist_keys
    ON public.obt_finance_payment_history_event (source_doc_type, source_header_id, source_payment_id, source_history_id);
