CREATE TABLE IF NOT EXISTS public.obt_profit_loss_line (
    pl_line_id bigserial PRIMARY KEY,
    source_module text,
    source_doc_type text,
    source_header_id text,
    source_detail_id text,
    doc_no text,
    doc_date timestamptz,
    fiscal_year integer,
    fiscal_month integer,
    branch_code text,
    branch_name text,
    location_code text,
    location_name text,
    contact_id text,
    contact_code text,
    contact_name text,
    account_code text NOT NULL,
    account_name text,
    account_type text,
    normal_balance text,
    pnl_category text,
    pnl_group text,
    debit_amount numeric(20,6),
    credit_amount numeric(20,6),
    net_amount numeric(20,6),
    currency_code text,
    exchange_rate numeric(20,6),
    notes text,
    source_payload jsonb,
    etl_batch_id text,
    etl_loaded_at timestamptz NOT NULL DEFAULT now(),
    etl_updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_obt_profit_loss_line_doc_date
    ON public.obt_profit_loss_line (doc_date);

CREATE INDEX IF NOT EXISTS idx_obt_profit_loss_line_fiscal_year
    ON public.obt_profit_loss_line (fiscal_year);

CREATE INDEX IF NOT EXISTS idx_obt_profit_loss_line_account_code
    ON public.obt_profit_loss_line (account_code);

CREATE INDEX IF NOT EXISTS idx_obt_profit_loss_line_pnl_category
    ON public.obt_profit_loss_line (pnl_category);
