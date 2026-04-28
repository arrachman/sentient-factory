CREATE TABLE IF NOT EXISTS public.alert_template (
  template_id BIGSERIAL PRIMARY KEY,
  template_key VARCHAR(120) NOT NULL UNIQUE,
  name VARCHAR(200) NOT NULL,
  description TEXT NULL,
  module_key VARCHAR(60) NOT NULL,
  severity VARCHAR(30) NOT NULL DEFAULT 'medium',
  recommended_channels JSONB NOT NULL DEFAULT '[]'::jsonb,
  default_recipients JSONB NOT NULL DEFAULT '[]'::jsonb,
  source_type VARCHAR(60) NULL,
  source_ref VARCHAR(160) NULL,
  schedule_value VARCHAR(60) NULL,
  condition_summary TEXT NULL,
  message_template TEXT NULL,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  is_default BOOLEAN NOT NULL DEFAULT FALSE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order INT NOT NULL DEFAULT 0,
  created_by TEXT NULL,
  updated_by TEXT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ NULL,
  CONSTRAINT chk_alert_template_severity CHECK (
    severity IN ('low', 'medium', 'high', 'critical')
  )
);

ALTER TABLE public.alert_template
  ADD COLUMN IF NOT EXISTS default_recipients JSONB NOT NULL DEFAULT '[]'::jsonb;

ALTER TABLE public.alert_template
  ADD COLUMN IF NOT EXISTS is_default BOOLEAN NOT NULL DEFAULT FALSE;

CREATE INDEX IF NOT EXISTS idx_alert_template_active
  ON public.alert_template (is_active, module_key, sort_order)
  WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_alert_template_channels
  ON public.alert_template USING gin (recommended_channels);

CREATE INDEX IF NOT EXISTS idx_alert_template_default_recipients
  ON public.alert_template USING gin (default_recipients);

CREATE UNIQUE INDEX IF NOT EXISTS idx_alert_template_default_per_module
  ON public.alert_template (module_key)
  WHERE is_default IS TRUE AND deleted_at IS NULL;

DROP TRIGGER IF EXISTS trg_alert_template_updated_at ON public.alert_template;
CREATE TRIGGER trg_alert_template_updated_at
BEFORE UPDATE ON public.alert_template
FOR EACH ROW EXECUTE FUNCTION public.set_row_updated_at();

INSERT INTO public.alert_template (
  template_key,
  name,
  description,
  module_key,
  severity,
  recommended_channels,
  default_recipients,
  source_type,
  source_ref,
  schedule_value,
  condition_summary,
  message_template,
  metadata,
  is_default,
  is_active,
  sort_order,
  created_by,
  updated_by
)
VALUES
  (
    'sales-drop-alert',
    'Sales Drop Alert',
    'Detects revenue drop compared to previous period and notifies sales leadership.',
    'sales',
    'critical',
    '["wa-group","email"]'::jsonb,
    '["Ops Alert Group","Sales Manager"]'::jsonb,
    'business-metric',
    'daily_sales_revenue',
    '15m',
    'Drop more than 20% vs yesterday',
    '[Critical] Daily sales dropped more than 20% versus yesterday. Please review branch performance and top customer contribution.',
    '{"comparison_type":"day_over_day"}'::jsonb,
    TRUE,
    TRUE,
    10,
    'system',
    'system'
  ),
  (
    'negative-stock-alert',
    'Negative Stock Alert',
    'Flags negative stock balances on selected warehouse or SKU groups.',
    'warehouse',
    'critical',
    '["wa-group"]'::jsonb,
    '["Ops Alert Group","Warehouse Supervisor"]'::jsonb,
    'business-metric',
    'negative_stock_count',
    '15m',
    'Count greater than 0',
    '[Critical] Negative stock detected. Please review item, warehouse, and latest stock movement immediately.',
    '{"comparison_type":"threshold"}'::jsonb,
    TRUE,
    TRUE,
    20,
    'system',
    'system'
  ),
  (
    'overdue-receivable-alert',
    'Overdue Receivable Alert',
    'Monitors overdue receivables and sends escalation to finance recipients.',
    'finance',
    'high',
    '["wa-personal","email"]'::jsonb,
    '["Finance Manager","Management Distribution"]'::jsonb,
    'business-metric',
    'overdue_receivable_total',
    'hourly',
    'Value above IDR 200,000,000',
    '[High] Overdue receivable exceeded the configured threshold. Prioritize collection follow-up and exposure review.',
    '{"comparison_type":"threshold"}'::jsonb,
    TRUE,
    TRUE,
    30,
    'system',
    'system'
  ),
  (
    'cashflow-anomaly',
    'Cashflow Anomaly',
    'Monitors unusual cash-in or cash-out changes across the selected period.',
    'finance',
    'high',
    '["email"]'::jsonb,
    '["Finance Manager"]'::jsonb,
    'business-metric',
    'cash_in_vs_cash_out',
    'daily',
    'Variance above expected range',
    '[High] Cashflow anomaly detected. Review unusual cash movement and bank balance impact.',
    '{"comparison_type":"month_over_month"}'::jsonb,
    FALSE,
    TRUE,
    40,
    'system',
    'system'
  )
ON CONFLICT (template_key) DO UPDATE
SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  module_key = EXCLUDED.module_key,
  severity = EXCLUDED.severity,
  recommended_channels = EXCLUDED.recommended_channels,
  default_recipients = EXCLUDED.default_recipients,
  source_type = EXCLUDED.source_type,
  source_ref = EXCLUDED.source_ref,
  schedule_value = EXCLUDED.schedule_value,
  condition_summary = EXCLUDED.condition_summary,
  message_template = EXCLUDED.message_template,
  metadata = EXCLUDED.metadata,
  is_default = EXCLUDED.is_default,
  is_active = EXCLUDED.is_active,
  sort_order = EXCLUDED.sort_order,
  updated_by = EXCLUDED.updated_by;
