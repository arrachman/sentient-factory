-- Metric condition UI mapping.
-- Purpose:
--   1. Menjadi registry condition UI yang valid untuk alert-rule builder.
--   2. Menghubungkan semantic_ref + comparison_type + value_type ke pilihan condition yang boleh tampil.
--   3. Menyimpan contoh metric dan contoh wording condition agar UI / AI guidance konsisten.
--
-- Design choice:
--   1. Satu row = satu opsi condition UI.
--   2. Cukup satu tabel untuk MVP; belum perlu child table.
--   3. semantic_ref boleh NULL jika mapping berlaku generik untuk comparison_type + value_type.

CREATE OR REPLACE FUNCTION public.set_row_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TABLE IF NOT EXISTS public.metric_condition_ui_mapping (
  mapping_id bigserial PRIMARY KEY,
  semantic_ref varchar(160),
  comparison_type varchar(40) NOT NULL,
  value_type varchar(40) NOT NULL,
  ui_condition_key varchar(80) NOT NULL,
  ui_condition_label varchar(200) NOT NULL,
  operator_key varchar(40) NOT NULL,
  operator_label varchar(120) NOT NULL,
  example_metric_key varchar(120),
  example_condition text,
  input_config jsonb NOT NULL DEFAULT '{}'::jsonb,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  is_default boolean NOT NULL DEFAULT false,
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_by text,
  updated_by text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz,
  CONSTRAINT uq_metric_condition_ui_mapping UNIQUE (
    semantic_ref,
    comparison_type,
    value_type,
    ui_condition_key,
    operator_key
  ),
  CONSTRAINT chk_metric_condition_ui_mapping_comparison_type CHECK (
    comparison_type IN (
      'threshold',
      'day_over_day',
      'week_over_week',
      'month_over_month',
      'year_over_year',
      'target_vs_actual',
      'trend_anomaly'
    )
  ),
  CONSTRAINT chk_metric_condition_ui_mapping_value_type CHECK (
    value_type IN (
      'number', 'currency', 'percent', 'count', 'days', 'duration', 'ratio', 'boolean', 'text'
    )
  ),
  CONSTRAINT chk_metric_condition_ui_mapping_operator_key CHECK (
    operator_key IN (
      'gt', 'gte', 'lt', 'lte', 'eq', 'between', 'drop_pct', 'increase_pct',
      'drop_points', 'increase_points', 'below_target_pct', 'above_target_pct',
      'variance_abs', 'anomaly_score_gt', 'expected_range_break', 'is_true', 'is_false'
    )
  )
);

CREATE INDEX IF NOT EXISTS idx_metric_condition_ui_mapping_lookup
  ON public.metric_condition_ui_mapping (semantic_ref, comparison_type, value_type, is_active, sort_order)
  WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_metric_condition_ui_mapping_metric
  ON public.metric_condition_ui_mapping (example_metric_key, is_active)
  WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_metric_condition_ui_mapping_metadata
  ON public.metric_condition_ui_mapping USING gin (metadata);

-- Remove alias rows that would collide with canonical semantic keys before normalization.
DELETE FROM public.metric_condition_ui_mapping m
USING public.metric_semantic_registry s
WHERE m.semantic_ref = s.semantic_key
  AND s.canonical_semantic_key IS NOT NULL
  AND m.semantic_ref <> s.canonical_semantic_key
  AND EXISTS (
    SELECT 1
    FROM public.metric_condition_ui_mapping c
    WHERE c.semantic_ref = s.canonical_semantic_key
      AND c.comparison_type = m.comparison_type
      AND c.value_type = m.value_type
      AND c.ui_condition_key = m.ui_condition_key
      AND c.operator_key = m.operator_key
  );

-- Normalize semantic_ref to canonical semantic key before enforcing FK.
UPDATE public.metric_condition_ui_mapping m
SET semantic_ref = s.canonical_semantic_key
FROM public.metric_semantic_registry s
WHERE m.semantic_ref = s.semantic_key
  AND s.canonical_semantic_key IS NOT NULL
  AND m.semantic_ref IS DISTINCT FROM s.canonical_semantic_key;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'fk_metric_condition_ui_mapping_semantic_ref'
      AND conrelid = 'public.metric_condition_ui_mapping'::regclass
  ) THEN
    ALTER TABLE public.metric_condition_ui_mapping
      ADD CONSTRAINT fk_metric_condition_ui_mapping_semantic_ref
      FOREIGN KEY (semantic_ref)
      REFERENCES public.metric_semantic_registry(semantic_key);
  END IF;
END;
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'fk_metric_condition_ui_mapping_example_metric_key'
      AND conrelid = 'public.metric_condition_ui_mapping'::regclass
  ) THEN
    ALTER TABLE public.metric_condition_ui_mapping
      ADD CONSTRAINT fk_metric_condition_ui_mapping_example_metric_key
      FOREIGN KEY (example_metric_key)
      REFERENCES public.metric_business_registry(metric_key);
  END IF;
END;
$$;

DROP TRIGGER IF EXISTS trg_metric_condition_ui_mapping_updated_at ON public.metric_condition_ui_mapping;
CREATE TRIGGER trg_metric_condition_ui_mapping_updated_at
BEFORE UPDATE ON public.metric_condition_ui_mapping
FOR EACH ROW
EXECUTE FUNCTION public.set_row_updated_at();

INSERT INTO public.metric_condition_ui_mapping (
  semantic_ref,
  comparison_type,
  value_type,
  ui_condition_key,
  ui_condition_label,
  operator_key,
  operator_label,
  example_metric_key,
  example_condition,
  input_config,
  metadata,
  is_default,
  is_active,
  sort_order,
  created_by,
  updated_by
)
VALUES
  (
    'daily_sales_revenue',
    'day_over_day',
    'currency',
    'drop_vs_yesterday_pct',
    'Drop more than % vs yesterday',
    'drop_pct',
    'drop by percent',
    'daily_sales_revenue',
    'Drop more than 20% vs yesterday',
    '{"input_kind":"percent","min":1,"max":100,"comparison_base":"yesterday"}'::jsonb,
    '{"module":"sales","scope_hint":"overall_or_dimension"}'::jsonb,
    true,
    true,
    10,
    'seed',
    'seed'
  ),
  (
    'daily_sales_revenue',
    'day_over_day',
    'currency',
    'increase_vs_yesterday_pct',
    'Increase more than % vs yesterday',
    'increase_pct',
    'increase by percent',
    'daily_sales_revenue',
    'Increase more than 15% vs yesterday',
    '{"input_kind":"percent","min":1,"max":100,"comparison_base":"yesterday"}'::jsonb,
    '{"module":"sales"}'::jsonb,
    false,
    true,
    20,
    'seed',
    'seed'
  ),
  (
    'daily_sales_revenue',
    'day_over_day',
    'currency',
    'value_below_threshold',
    'Value below threshold',
    'lt',
    'less than',
    'daily_sales_revenue',
    'Value below IDR 150,000,000',
    '{"input_kind":"currency","unit":"idr","comparison_base":"absolute"}'::jsonb,
    '{"module":"sales"}'::jsonb,
    false,
    true,
    30,
    'seed',
    'seed'
  ),
  (
    'monthly_sales_achievement',
    'target_vs_actual',
    'percent',
    'below_target_pct',
    'Below target by %',
    'below_target_pct',
    'below target by percent',
    'monthly_sales_achievement',
    'Achievement below target by 15%',
    '{"input_kind":"percent","min":1,"max":100,"comparison_base":"target"}'::jsonb,
    '{"module":"sales"}'::jsonb,
    true,
    true,
    40,
    'seed',
    'seed'
  ),
  (
    'monthly_sales_achievement',
    'target_vs_actual',
    'percent',
    'below_minimum_achievement',
    'Achievement below minimum %',
    'lt',
    'less than',
    'monthly_sales_achievement',
    'Achievement below 85%',
    '{"input_kind":"percent","min":0,"max":100,"comparison_base":"absolute"}'::jsonb,
    '{"module":"sales"}'::jsonb,
    false,
    true,
    50,
    'seed',
    'seed'
  ),
  (
    'overdue_receivable_total',
    'threshold',
    'currency',
    'value_above_threshold',
    'Value above threshold',
    'gt',
    'greater than',
    'overdue_receivable_total',
    'Value above IDR 200,000,000',
    '{"input_kind":"currency","unit":"idr","comparison_base":"absolute"}'::jsonb,
    '{"module":"finance","dimension_hint":"branch_customer"}'::jsonb,
    true,
    true,
    60,
    'seed',
    'seed'
  ),
  (
    'overdue_receivable_total',
    'threshold',
    'currency',
    'value_between_range',
    'Value between range',
    'between',
    'between range',
    'overdue_receivable_total',
    'Value between IDR 100,000,000 and IDR 250,000,000',
    '{"input_kind":"currency_range","unit":"idr","comparison_base":"absolute"}'::jsonb,
    '{"module":"finance"}'::jsonb,
    false,
    true,
    70,
    'seed',
    'seed'
  ),
  (
    'cash_in_vs_cash_out',
    'month_over_month',
    'currency',
    'variance_above_amount',
    'Variance above amount',
    'variance_abs',
    'variance above absolute amount',
    'cash_in_vs_cash_out',
    'Cash out exceeds cash in by IDR 50,000,000',
    '{"input_kind":"currency","unit":"idr","comparison_base":"previous_period_or_net"}'::jsonb,
    '{"module":"finance"}'::jsonb,
    true,
    true,
    80,
    'seed',
    'seed'
  ),
  (
    'overdue_receivable_customer_count',
    'threshold',
    'count',
    'count_above_threshold',
    'Count above threshold',
    'gt',
    'greater than',
    'overdue_receivable_customer_count',
    'Overdue customers > 15',
    '{"input_kind":"integer","min":0,"comparison_base":"absolute"}'::jsonb,
    '{"module":"finance","metric_family":"receivable"}'::jsonb,
    true,
    true,
    81,
    'seed',
    'seed'
  ),
  (
    'overdue_receivable_invoice_count',
    'threshold',
    'count',
    'count_above_threshold',
    'Count above threshold',
    'gt',
    'greater than',
    'overdue_receivable_invoice_count',
    'Overdue invoices > 40',
    '{"input_kind":"integer","min":0,"comparison_base":"absolute"}'::jsonb,
    '{"module":"finance","metric_family":"receivable"}'::jsonb,
    true,
    true,
    82,
    'seed',
    'seed'
  ),
  (
    'cash_in_total',
    'month_over_month',
    'currency',
    'value_below_threshold',
    'Value below threshold',
    'lt',
    'less than',
    'cash_in_total',
    'Cash in below IDR 150,000,000',
    '{"input_kind":"currency","unit":"idr","comparison_base":"absolute"}'::jsonb,
    '{"module":"finance","metric_family":"cashflow"}'::jsonb,
    true,
    true,
    83,
    'seed',
    'seed'
  ),
  (
    'cash_in_total',
    'month_over_month',
    'currency',
    'drop_vs_last_month_pct',
    'Drop more than % vs last month',
    'drop_pct',
    'drop by percent',
    'cash_in_total',
    'Cash in drop > 20% vs last month',
    '{"input_kind":"percent","min":1,"max":100,"comparison_base":"last_month"}'::jsonb,
    '{"module":"finance","metric_family":"cashflow"}'::jsonb,
    false,
    true,
    84,
    'seed',
    'seed'
  ),
  (
    'cash_out_total',
    'month_over_month',
    'currency',
    'value_above_threshold',
    'Value above threshold',
    'gt',
    'greater than',
    'cash_out_total',
    'Cash out above IDR 200,000,000',
    '{"input_kind":"currency","unit":"idr","comparison_base":"absolute"}'::jsonb,
    '{"module":"finance","metric_family":"cashflow"}'::jsonb,
    true,
    true,
    85,
    'seed',
    'seed'
  ),
  (
    'cash_out_total',
    'month_over_month',
    'currency',
    'increase_vs_last_month_pct',
    'Increase more than % vs last month',
    'increase_pct',
    'increase by percent',
    'cash_out_total',
    'Cash out increase > 25% vs last month',
    '{"input_kind":"percent","min":1,"max":100,"comparison_base":"last_month"}'::jsonb,
    '{"module":"finance","metric_family":"cashflow"}'::jsonb,
    false,
    true,
    86,
    'seed',
    'seed'
  ),
  (
    'net_cash_movement',
    'month_over_month',
    'currency',
    'value_below_zero',
    'Value below zero',
    'lt',
    'less than',
    'net_cash_movement',
    'Net cash movement < 0',
    '{"input_kind":"currency","unit":"idr","fixed_value":0,"comparison_base":"absolute"}'::jsonb,
    '{"module":"finance","metric_family":"cashflow","specialized":true}'::jsonb,
    true,
    true,
    87,
    'seed',
    'seed'
  ),
  (
    'net_cash_movement',
    'month_over_month',
    'currency',
    'drop_vs_last_month_pct',
    'Drop more than % vs last month',
    'drop_pct',
    'drop by percent',
    'net_cash_movement',
    'Net cash movement drop > 30% vs last month',
    '{"input_kind":"percent","min":1,"max":100,"comparison_base":"last_month"}'::jsonb,
    '{"module":"finance","metric_family":"cashflow"}'::jsonb,
    false,
    true,
    88,
    'seed',
    'seed'
  ),
  (
    'receipt_money_total',
    'month_over_month',
    'currency',
    'value_below_threshold',
    'Value below threshold',
    'lt',
    'less than',
    'receipt_money_total',
    'Receipt money below IDR 120,000,000',
    '{"input_kind":"currency","unit":"idr","comparison_base":"absolute"}'::jsonb,
    '{"module":"finance","metric_family":"collection"}'::jsonb,
    true,
    true,
    89,
    'seed',
    'seed'
  ),
  (
    'receipt_money_total',
    'month_over_month',
    'currency',
    'drop_vs_last_month_pct',
    'Drop more than % vs last month',
    'drop_pct',
    'drop by percent',
    'receipt_money_total',
    'Receipt money drop > 15% vs last month',
    '{"input_kind":"percent","min":1,"max":100,"comparison_base":"last_month"}'::jsonb,
    '{"module":"finance","metric_family":"collection"}'::jsonb,
    false,
    true,
    90,
    'seed',
    'seed'
  ),
  (
    'receipt_money_transaction_count',
    'threshold',
    'count',
    'count_equals_zero',
    'Count equals zero',
    'eq',
    'equals',
    'receipt_money_transaction_count',
    'Receipt money transaction count = 0',
    '{"input_kind":"integer","fixed_value":0,"comparison_base":"absolute"}'::jsonb,
    '{"module":"finance","metric_family":"collection"}'::jsonb,
    true,
    true,
    91,
    'seed',
    'seed'
  ),
  (
    'receipt_money_transaction_count',
    'threshold',
    'count',
    'count_below_threshold',
    'Count below threshold',
    'lt',
    'less than',
    'receipt_money_transaction_count',
    'Receipt money transactions < 5',
    '{"input_kind":"integer","min":0,"comparison_base":"absolute"}'::jsonb,
    '{"module":"finance","metric_family":"collection"}'::jsonb,
    false,
    true,
    92,
    'seed',
    'seed'
  ),
  (
    'payment_history_total',
    'month_over_month',
    'currency',
    'value_above_threshold',
    'Value above threshold',
    'gt',
    'greater than',
    'payment_history_total',
    'Payment history total > IDR 500,000,000',
    '{"input_kind":"currency","unit":"idr","comparison_base":"absolute"}'::jsonb,
    '{"module":"finance","metric_family":"payment"}'::jsonb,
    true,
    true,
    93,
    'seed',
    'seed'
  ),
  (
    'payment_history_total',
    'month_over_month',
    'currency',
    'increase_vs_last_month_pct',
    'Increase more than % vs last month',
    'increase_pct',
    'increase by percent',
    'payment_history_total',
    'Payment history total increase > 20% vs last month',
    '{"input_kind":"percent","min":1,"max":100,"comparison_base":"last_month"}'::jsonb,
    '{"module":"finance","metric_family":"payment"}'::jsonb,
    false,
    true,
    94,
    'seed',
    'seed'
  ),
  (
    'payment_history_event_count',
    'threshold',
    'count',
    'count_above_threshold',
    'Count above threshold',
    'gt',
    'greater than',
    'payment_history_event_count',
    'Payment event count > 100',
    '{"input_kind":"integer","min":0,"comparison_base":"absolute"}'::jsonb,
    '{"module":"finance","metric_family":"payment"}'::jsonb,
    true,
    true,
    95,
    'seed',
    'seed'
  ),
  (
    'budget_realization_total',
    'target_vs_actual',
    'currency',
    'below_target_pct',
    'Below target by %',
    'below_target_pct',
    'below target by percent',
    'budget_realization_total',
    'Budget realization below target by 20%',
    '{"input_kind":"percent","min":1,"max":100,"comparison_base":"target"}'::jsonb,
    '{"module":"finance","metric_family":"budget"}'::jsonb,
    true,
    true,
    96,
    'seed',
    'seed'
  ),
  (
    'budget_realization_total',
    'target_vs_actual',
    'currency',
    'value_below_threshold',
    'Value below threshold',
    'lt',
    'less than',
    'budget_realization_total',
    'Budget realization below IDR 300,000,000',
    '{"input_kind":"currency","unit":"idr","comparison_base":"absolute"}'::jsonb,
    '{"module":"finance","metric_family":"budget"}'::jsonb,
    false,
    true,
    97,
    'seed',
    'seed'
  ),
  (
    'budget_vs_realization_variance',
    'target_vs_actual',
    'currency',
    'variance_above_amount',
    'Variance above amount',
    'variance_abs',
    'variance above absolute amount',
    'budget_vs_realization_variance',
    'Budget variance > IDR 100,000,000',
    '{"input_kind":"currency","unit":"idr","comparison_base":"variance"}'::jsonb,
    '{"module":"finance","metric_family":"budget","specialized":true}'::jsonb,
    true,
    true,
    98,
    'seed',
    'seed'
  ),
  (
    'finance_open_document_count',
    'threshold',
    'count',
    'count_above_threshold',
    'Count above threshold',
    'gt',
    'greater than',
    'finance_open_document_count',
    'Open finance documents > 50',
    '{"input_kind":"integer","min":0,"comparison_base":"absolute"}'::jsonb,
    '{"module":"finance","metric_family":"document"}'::jsonb,
    true,
    true,
    99,
    'seed',
    'seed'
  ),
  (
    'bank_position_total',
    'month_over_month',
    'currency',
    'value_below_threshold',
    'Value below threshold',
    'lt',
    'less than',
    'bank_position_total',
    'Bank position below IDR 100,000,000',
    '{"input_kind":"currency","unit":"idr","comparison_base":"absolute"}'::jsonb,
    '{"module":"finance","metric_family":"bank"}'::jsonb,
    true,
    true,
    100,
    'seed',
    'seed'
  ),
  (
    'bank_position_total',
    'month_over_month',
    'currency',
    'drop_vs_last_month_pct',
    'Drop more than % vs last month',
    'drop_pct',
    'drop by percent',
    'bank_position_total',
    'Bank position drop > 20% vs last month',
    '{"input_kind":"percent","min":1,"max":100,"comparison_base":"last_month"}'::jsonb,
    '{"module":"finance","metric_family":"bank"}'::jsonb,
    false,
    true,
    101,
    'seed',
    'seed'
  ),
  (
    'allocation_total',
    'threshold',
    'currency',
    'value_above_threshold',
    'Value above threshold',
    'gt',
    'greater than',
    'allocation_total',
    'Allocation total > IDR 250,000,000',
    '{"input_kind":"currency","unit":"idr","comparison_base":"absolute"}'::jsonb,
    '{"module":"finance","metric_family":"allocation"}'::jsonb,
    true,
    true,
    102,
    'seed',
    'seed'
  ),
  (
    'negative_stock_count',
    'threshold',
    'count',
    'count_greater_than_zero',
    'Count greater than zero',
    'gt',
    'greater than',
    'negative_stock_count',
    'Count greater than 0',
    '{"input_kind":"integer","min":0,"comparison_base":"absolute"}'::jsonb,
    '{"module":"warehouse","dimension_hint":"warehouse_item"}'::jsonb,
    true,
    true,
    90,
    'seed',
    'seed'
  ),
  (
    'negative_stock_count',
    'threshold',
    'count',
    'count_above_threshold',
    'Count above threshold',
    'gt',
    'greater than',
    'negative_stock_count',
    'Count above 10',
    '{"input_kind":"integer","min":0,"comparison_base":"absolute"}'::jsonb,
    '{"module":"warehouse"}'::jsonb,
    false,
    true,
    100,
    'seed',
    'seed'
  ),
  (
    'inventory_coverage_days',
    'threshold',
    'days',
    'coverage_below_days',
    'Coverage below days',
    'lt',
    'less than',
    'inventory_coverage_days',
    'Coverage below 7 days',
    '{"input_kind":"integer","unit":"day","min":0,"comparison_base":"absolute"}'::jsonb,
    '{"module":"warehouse"}'::jsonb,
    true,
    true,
    110,
    'seed',
    'seed'
  ),
  (
    'inventory_coverage_days',
    'threshold',
    'days',
    'coverage_above_days',
    'Coverage above days',
    'gt',
    'greater than',
    'inventory_coverage_days',
    'Coverage above 90 days',
    '{"input_kind":"integer","unit":"day","min":0,"comparison_base":"absolute"}'::jsonb,
    '{"module":"warehouse"}'::jsonb,
    false,
    true,
    120,
    'seed',
    'seed'
  ),
  (
    'purchase_price_variance',
    'trend_anomaly',
    'percent',
    'variance_above_percent',
    'Variance above %',
    'gt',
    'greater than',
    'purchase_price_variance',
    'Variance above 12%',
    '{"input_kind":"percent","min":0,"max":100,"comparison_base":"baseline"}'::jsonb,
    '{"module":"purchasing"}'::jsonb,
    true,
    true,
    130,
    'seed',
    'seed'
  ),
  (
    'purchase_price_variance',
    'trend_anomaly',
    'percent',
    'anomaly_score_above_threshold',
    'Anomaly score above threshold',
    'anomaly_score_gt',
    'anomaly score greater than',
    'purchase_price_variance',
    'Anomaly score above 0.80',
    '{"input_kind":"decimal","min":0,"max":1,"comparison_base":"anomaly_score"}'::jsonb,
    '{"module":"purchasing"}'::jsonb,
    false,
    true,
    140,
    'seed',
    'seed'
  ),
  (
    'open_purchase_order_total',
    'threshold',
    'currency',
    'open_po_above_threshold',
    'Open PO above threshold',
    'gt',
    'greater than',
    'open_purchase_order_total',
    'Open PO above IDR 500,000,000',
    '{"input_kind":"currency","unit":"idr","comparison_base":"absolute"}'::jsonb,
    '{"module":"purchasing"}'::jsonb,
    true,
    true,
    150,
    'seed',
    'seed'
  ),
  (
    'accounting_journal_line_amount_total',
    'month_over_month',
    'currency',
    'value_above_threshold',
    'Value above threshold',
    'gt',
    'greater than',
    'accounting_journal_line_amount_total',
    'Journal line amount total > IDR 1,000,000,000',
    '{"input_kind":"currency","unit":"idr","comparison_base":"absolute"}'::jsonb,
    '{"module":"accounting","metric_family":"journal"}'::jsonb,
    true,
    true,
    160,
    'seed',
    'seed'
  ),
  (
    'accounting_journal_line_amount_total',
    'month_over_month',
    'currency',
    'increase_vs_last_month_pct',
    'Increase more than % vs last month',
    'increase_pct',
    'increase by percent',
    'accounting_journal_line_amount_total',
    'Journal line amount total increase > 25% vs last month',
    '{"input_kind":"percent","min":1,"max":100,"comparison_base":"last_month"}'::jsonb,
    '{"module":"accounting","metric_family":"journal"}'::jsonb,
    false,
    true,
    161,
    'seed',
    'seed'
  ),
  (
    'accounting_journal_line_count',
    'threshold',
    'count',
    'count_above_threshold',
    'Count above threshold',
    'gt',
    'greater than',
    'accounting_journal_line_count',
    'Journal line count > 10000',
    '{"input_kind":"integer","min":0,"comparison_base":"absolute"}'::jsonb,
    '{"module":"accounting","metric_family":"journal"}'::jsonb,
    true,
    true,
    162,
    'seed',
    'seed'
  ),
  (
    'accounting_journal_line_count',
    'threshold',
    'count',
    'count_equals_zero',
    'Count equals zero',
    'eq',
    'equals',
    'accounting_journal_line_count',
    'Journal line count = 0',
    '{"input_kind":"integer","min":0,"comparison_base":"absolute"}'::jsonb,
    '{"module":"accounting","metric_family":"journal"}'::jsonb,
    false,
    true,
    163,
    'seed',
    'seed'
  ),
  (
    'accounting_distinct_account_count',
    'threshold',
    'count',
    'count_below_threshold',
    'Count below threshold',
    'lt',
    'less than',
    'accounting_distinct_account_count',
    'Distinct account count < 5',
    '{"input_kind":"integer","min":0,"comparison_base":"absolute"}'::jsonb,
    '{"module":"accounting","metric_family":"coa"}'::jsonb,
    true,
    true,
    164,
    'seed',
    'seed'
  ),
  (
    'accounting_document_lifecycle_event_count',
    'threshold',
    'count',
    'count_above_threshold',
    'Count above threshold',
    'gt',
    'greater than',
    'accounting_document_lifecycle_event_count',
    'Lifecycle event count > 500',
    '{"input_kind":"integer","min":0,"comparison_base":"absolute"}'::jsonb,
    '{"module":"accounting","metric_family":"document"}'::jsonb,
    true,
    true,
    165,
    'seed',
    'seed'
  ),
  (
    'accounting_document_revision_total',
    'threshold',
    'count',
    'count_above_threshold',
    'Count above threshold',
    'gt',
    'greater than',
    'accounting_document_revision_total',
    'Document revision total > 20',
    '{"input_kind":"integer","min":0,"comparison_base":"absolute"}'::jsonb,
    '{"module":"accounting","metric_family":"document"}'::jsonb,
    true,
    true,
    166,
    'seed',
    'seed'
  ),
  (
    'accounting_active_coa_count',
    'threshold',
    'count',
    'count_below_threshold',
    'Count below threshold',
    'lt',
    'less than',
    'accounting_active_coa_count',
    'Active COA count < 50',
    '{"input_kind":"integer","min":0,"comparison_base":"absolute"}'::jsonb,
    '{"module":"accounting","metric_family":"coa"}'::jsonb,
    true,
    true,
    167,
    'seed',
    'seed'
  ),
  (
    'accounting_revenue_total',
    'month_over_month',
    'currency',
    'value_below_threshold',
    'Value below threshold',
    'lt',
    'less than',
    'accounting_revenue_total',
    'Revenue total below IDR 500,000,000',
    '{"input_kind":"currency","unit":"idr","comparison_base":"absolute"}'::jsonb,
    '{"module":"accounting","metric_family":"profit_loss"}'::jsonb,
    true,
    true,
    168,
    'seed',
    'seed'
  ),
  (
    'accounting_revenue_total',
    'month_over_month',
    'currency',
    'drop_vs_last_month_pct',
    'Drop more than % vs last month',
    'drop_pct',
    'drop by percent',
    'accounting_revenue_total',
    'Revenue total drop > 15% vs last month',
    '{"input_kind":"percent","min":1,"max":100,"comparison_base":"last_month"}'::jsonb,
    '{"module":"accounting","metric_family":"profit_loss"}'::jsonb,
    false,
    true,
    169,
    'seed',
    'seed'
  ),
  (
    'accounting_cogs_total',
    'month_over_month',
    'currency',
    'increase_vs_last_month_pct',
    'Increase more than % vs last month',
    'increase_pct',
    'increase by percent',
    'accounting_cogs_total',
    'COGS increase > 20% vs last month',
    '{"input_kind":"percent","min":1,"max":100,"comparison_base":"last_month"}'::jsonb,
    '{"module":"accounting","metric_family":"profit_loss"}'::jsonb,
    true,
    true,
    170,
    'seed',
    'seed'
  ),
  (
    'accounting_operating_expense_total',
    'month_over_month',
    'currency',
    'increase_vs_last_month_pct',
    'Increase more than % vs last month',
    'increase_pct',
    'increase by percent',
    'accounting_operating_expense_total',
    'Operating expense increase > 20% vs last month',
    '{"input_kind":"percent","min":1,"max":100,"comparison_base":"last_month"}'::jsonb,
    '{"module":"accounting","metric_family":"profit_loss"}'::jsonb,
    true,
    true,
    171,
    'seed',
    'seed'
  ),
  (
    'accounting_net_profit_total',
    'month_over_month',
    'currency',
    'value_below_zero',
    'Value below zero',
    'lt',
    'less than',
    'accounting_net_profit_total',
    'Net profit total < 0',
    '{"input_kind":"currency","unit":"idr","comparison_base":"absolute","suggested_value":0}'::jsonb,
    '{"module":"accounting","metric_family":"profit_loss","specialized":true}'::jsonb,
    true,
    true,
    172,
    'seed',
    'seed'
  ),
  (
    'accounting_net_profit_total',
    'month_over_month',
    'currency',
    'drop_vs_last_month_pct',
    'Drop more than % vs last month',
    'drop_pct',
    'drop by percent',
    'accounting_net_profit_total',
    'Net profit total drop > 20% vs last month',
    '{"input_kind":"percent","min":1,"max":100,"comparison_base":"last_month"}'::jsonb,
    '{"module":"accounting","metric_family":"profit_loss"}'::jsonb,
    false,
    true,
    173,
    'seed',
    'seed'
  )
ON CONFLICT (semantic_ref, comparison_type, value_type, ui_condition_key, operator_key)
DO UPDATE SET
  ui_condition_label = EXCLUDED.ui_condition_label,
  operator_label = EXCLUDED.operator_label,
  example_metric_key = EXCLUDED.example_metric_key,
  example_condition = EXCLUDED.example_condition,
  input_config = EXCLUDED.input_config,
  metadata = EXCLUDED.metadata,
  is_default = EXCLUDED.is_default,
  is_active = EXCLUDED.is_active,
  sort_order = EXCLUDED.sort_order,
  updated_by = EXCLUDED.updated_by,
  deleted_at = NULL;
