CREATE TABLE IF NOT EXISTS public.alert_rule (
  rule_id BIGSERIAL PRIMARY KEY,
  rule_key VARCHAR(160) NOT NULL UNIQUE,
  rule_name VARCHAR(200) NOT NULL,
  description TEXT NULL,
  module_key VARCHAR(60) NOT NULL,
  source_type VARCHAR(40) NOT NULL,
  source_ref VARCHAR(160) NULL,
  metric_id BIGINT NULL REFERENCES public.metric_business_registry(metric_id),
  system_metric_ref VARCHAR(120) NULL REFERENCES public.metric_system_registry(metric_key),
  semantic_ref VARCHAR(120) NULL REFERENCES public.metric_semantic_registry(semantic_key),
  condition_mapping_id BIGINT NULL REFERENCES public.metric_condition_ui_mapping(mapping_id),
  condition_mapping_key VARCHAR(120) NULL,
  condition_operator_key VARCHAR(120) NULL,
  comparison_type VARCHAR(40) NULL,
  value_type VARCHAR(40) NULL,
  schedule_type VARCHAR(30) NOT NULL DEFAULT 'preset',
  schedule_value VARCHAR(80) NOT NULL DEFAULT '15m',
  severity VARCHAR(30) NOT NULL DEFAULT 'critical',
  primary_channel VARCHAR(40) NOT NULL DEFAULT 'wa-group',
  condition_summary TEXT NULL,
  condition_config JSONB NOT NULL DEFAULT '{}'::jsonb,
  source_context JSONB NOT NULL DEFAULT '{}'::jsonb,
  message_template TEXT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'draft',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  last_run_at TIMESTAMPTZ NULL,
  created_by TEXT NULL,
  updated_by TEXT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ NULL,
  CONSTRAINT chk_alert_rule_source_type CHECK (
    source_type = ANY (
      ARRAY[
        'dashboard-widget'::varchar,
        'manual-rule-source'::varchar,
        'business-metric'::varchar,
        'saved-query'::varchar,
        'ai-query'::varchar,
        'system-metric'::varchar
      ]::text[]
    )
  ),
  CONSTRAINT chk_alert_rule_schedule_type CHECK (
    schedule_type = ANY (ARRAY['preset'::varchar, 'cron'::varchar]::text[])
  ),
  CONSTRAINT chk_alert_rule_severity CHECK (
    severity = ANY (ARRAY['low'::varchar, 'medium'::varchar, 'high'::varchar, 'critical'::varchar]::text[])
  ),
  CONSTRAINT chk_alert_rule_status CHECK (
    status = ANY (ARRAY['draft'::varchar, 'active'::varchar, 'paused'::varchar, 'archived'::varchar]::text[])
  )
);

CREATE INDEX IF NOT EXISTS idx_alert_rule_module ON public.alert_rule (module_key, is_active, created_at DESC) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_alert_rule_metric ON public.alert_rule (metric_id, is_active) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_alert_rule_source ON public.alert_rule (source_type, source_ref) WHERE deleted_at IS NULL;

CREATE TABLE IF NOT EXISTS public.alert_rule_recipient (
  recipient_id BIGSERIAL PRIMARY KEY,
  rule_id BIGINT NOT NULL REFERENCES public.alert_rule(rule_id) ON DELETE CASCADE,
  recipient_type VARCHAR(30) NOT NULL DEFAULT 'channel',
  channel_type VARCHAR(40) NOT NULL,
  target_label VARCHAR(200) NOT NULL,
  target_value VARCHAR(200) NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_by TEXT NULL,
  updated_by TEXT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ NULL,
  CONSTRAINT chk_alert_rule_recipient_type CHECK (
    recipient_type = ANY (ARRAY['channel'::varchar, 'user'::varchar, 'role'::varchar]::text[])
  ),
  CONSTRAINT chk_alert_rule_recipient_channel_type CHECK (
    channel_type = ANY (ARRAY['wa-group'::varchar, 'wa-personal'::varchar, 'email'::varchar]::text[])
  )
);

CREATE INDEX IF NOT EXISTS idx_alert_rule_recipient_rule ON public.alert_rule_recipient (rule_id, is_active, sort_order) WHERE deleted_at IS NULL;

CREATE TABLE IF NOT EXISTS public.alert_event (
  event_id BIGSERIAL PRIMARY KEY,
  event_key VARCHAR(180) NOT NULL UNIQUE,
  rule_id BIGINT NOT NULL REFERENCES public.alert_rule(rule_id),
  metric_id BIGINT NULL REFERENCES public.metric_business_registry(metric_id),
  snapshot_id BIGINT NULL REFERENCES public.metric_insight_snapshot(snapshot_id),
  title VARCHAR(220) NOT NULL,
  description TEXT NULL,
  severity VARCHAR(30) NOT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'open',
  source_ref VARCHAR(160) NULL,
  event_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  acknowledged_at TIMESTAMPTZ NULL,
  resolved_at TIMESTAMPTZ NULL,
  detected_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by TEXT NULL,
  updated_by TEXT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ NULL,
  CONSTRAINT chk_alert_event_severity CHECK (
    severity = ANY (ARRAY['low'::varchar, 'medium'::varchar, 'high'::varchar, 'critical'::varchar]::text[])
  ),
  CONSTRAINT chk_alert_event_status CHECK (
    status = ANY (ARRAY['open'::varchar, 'acknowledged'::varchar, 'resolved'::varchar, 'muted'::varchar]::text[])
  )
);

CREATE INDEX IF NOT EXISTS idx_alert_event_rule ON public.alert_event (rule_id, detected_at DESC) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_alert_event_status ON public.alert_event (status, severity, detected_at DESC) WHERE deleted_at IS NULL;

CREATE TABLE IF NOT EXISTS public.alert_delivery_log (
  delivery_id BIGSERIAL PRIMARY KEY,
  event_id BIGINT NOT NULL REFERENCES public.alert_event(event_id) ON DELETE CASCADE,
  rule_id BIGINT NOT NULL REFERENCES public.alert_rule(rule_id) ON DELETE CASCADE,
  recipient_id BIGINT NULL REFERENCES public.alert_rule_recipient(recipient_id) ON DELETE SET NULL,
  channel_type VARCHAR(40) NOT NULL,
  target_value VARCHAR(200) NOT NULL,
  provider_name VARCHAR(80) NULL,
  provider_message_id VARCHAR(160) NULL,
  delivery_status VARCHAR(30) NOT NULL DEFAULT 'queued',
  response_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  error_message TEXT NULL,
  retry_count INT NOT NULL DEFAULT 0,
  max_retries INT NOT NULL DEFAULT 3,
  next_retry_at TIMESTAMPTZ NULL,
  last_attempt_at TIMESTAMPTZ NULL,
  dead_lettered_at TIMESTAMPTZ NULL,
  dead_letter_reason TEXT NULL,
  requested_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  delivered_at TIMESTAMPTZ NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_alert_delivery_log_channel_type CHECK (
    channel_type = ANY (ARRAY['wa-group'::varchar, 'wa-personal'::varchar, 'email'::varchar]::text[])
  ),
  CONSTRAINT chk_alert_delivery_log_status CHECK (
    delivery_status = ANY (ARRAY['queued'::varchar, 'sent'::varchar, 'delivered'::varchar, 'failed'::varchar, 'dead-lettered'::varchar]::text[])
  )
);

ALTER TABLE public.alert_delivery_log
  ADD COLUMN IF NOT EXISTS retry_count INT NOT NULL DEFAULT 0;

ALTER TABLE public.alert_delivery_log
  ADD COLUMN IF NOT EXISTS max_retries INT NOT NULL DEFAULT 3;

ALTER TABLE public.alert_delivery_log
  ADD COLUMN IF NOT EXISTS next_retry_at TIMESTAMPTZ NULL;

ALTER TABLE public.alert_delivery_log
  ADD COLUMN IF NOT EXISTS last_attempt_at TIMESTAMPTZ NULL;

ALTER TABLE public.alert_delivery_log
  ADD COLUMN IF NOT EXISTS dead_lettered_at TIMESTAMPTZ NULL;

ALTER TABLE public.alert_delivery_log
  ADD COLUMN IF NOT EXISTS dead_letter_reason TEXT NULL;

ALTER TABLE public.alert_delivery_log
  DROP CONSTRAINT IF EXISTS chk_alert_delivery_log_status;

ALTER TABLE public.alert_delivery_log
  ADD CONSTRAINT chk_alert_delivery_log_status CHECK (
    delivery_status = ANY (ARRAY['queued'::varchar, 'sent'::varchar, 'delivered'::varchar, 'failed'::varchar, 'dead-lettered'::varchar]::text[])
  );

CREATE INDEX IF NOT EXISTS idx_alert_delivery_log_event ON public.alert_delivery_log (event_id, requested_at DESC);
CREATE INDEX IF NOT EXISTS idx_alert_delivery_log_status ON public.alert_delivery_log (delivery_status, requested_at DESC);
CREATE INDEX IF NOT EXISTS idx_alert_delivery_log_retry_due ON public.alert_delivery_log (delivery_status, next_retry_at, requested_at DESC);

CREATE TABLE IF NOT EXISTS public.alert_dead_letter_triage (
  triage_id BIGSERIAL PRIMARY KEY,
  delivery_id BIGINT NOT NULL REFERENCES public.alert_delivery_log(delivery_id) ON DELETE CASCADE,
  triage_status VARCHAR(30) NOT NULL DEFAULT 'open',
  acknowledged_at TIMESTAMPTZ NULL,
  acknowledged_by TEXT NULL,
  assigned_to TEXT NULL,
  note TEXT NULL,
  escalation_count INT NOT NULL DEFAULT 0,
  last_escalated_at TIMESTAMPTZ NULL,
  last_escalation_level VARCHAR(30) NULL,
  last_action_at TIMESTAMPTZ NULL,
  created_by TEXT NULL,
  updated_by TEXT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_alert_dead_letter_triage_delivery UNIQUE (delivery_id),
  CONSTRAINT chk_alert_dead_letter_triage_status CHECK (
    triage_status = ANY (ARRAY['open'::varchar, 'investigating'::varchar, 'requeued'::varchar, 'resolved'::varchar]::text[])
  ),
  CONSTRAINT chk_alert_dead_letter_triage_escalation_level CHECK (
    last_escalation_level IS NULL
    OR last_escalation_level = ANY (ARRAY['warning'::varchar, 'critical'::varchar]::text[])
  )
);

ALTER TABLE public.alert_dead_letter_triage
  ADD COLUMN IF NOT EXISTS acknowledged_at TIMESTAMPTZ NULL;

ALTER TABLE public.alert_dead_letter_triage
  ADD COLUMN IF NOT EXISTS acknowledged_by TEXT NULL;

ALTER TABLE public.alert_dead_letter_triage
  ADD COLUMN IF NOT EXISTS escalation_count INT NOT NULL DEFAULT 0;

ALTER TABLE public.alert_dead_letter_triage
  ADD COLUMN IF NOT EXISTS last_escalated_at TIMESTAMPTZ NULL;

ALTER TABLE public.alert_dead_letter_triage
  ADD COLUMN IF NOT EXISTS last_escalation_level VARCHAR(30) NULL;

ALTER TABLE public.alert_dead_letter_triage
  DROP CONSTRAINT IF EXISTS chk_alert_dead_letter_triage_escalation_level;

ALTER TABLE public.alert_dead_letter_triage
  ADD CONSTRAINT chk_alert_dead_letter_triage_escalation_level CHECK (
    last_escalation_level IS NULL
    OR last_escalation_level = ANY (ARRAY['warning'::varchar, 'critical'::varchar]::text[])
  );

CREATE INDEX IF NOT EXISTS idx_alert_dead_letter_triage_status
  ON public.alert_dead_letter_triage (triage_status, updated_at DESC);

CREATE TABLE IF NOT EXISTS public.alert_dead_letter_triage_audit (
  audit_id BIGSERIAL PRIMARY KEY,
  delivery_id BIGINT NOT NULL REFERENCES public.alert_delivery_log(delivery_id) ON DELETE CASCADE,
  action_type VARCHAR(40) NOT NULL,
  previous_triage_status VARCHAR(30) NULL,
  next_triage_status VARCHAR(30) NULL,
  previous_acknowledged_at TIMESTAMPTZ NULL,
  next_acknowledged_at TIMESTAMPTZ NULL,
  previous_assigned_to TEXT NULL,
  next_assigned_to TEXT NULL,
  note_snapshot TEXT NULL,
  detail_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_by TEXT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_alert_dead_letter_triage_audit_action CHECK (
    action_type = ANY (
      ARRAY[
        'acknowledge'::varchar,
        'unacknowledge'::varchar,
        'status-change'::varchar,
        'assign'::varchar,
        'note-change'::varchar,
        'requeue'::varchar,
        'auto-resolve'::varchar,
        'update'::varchar
      ]::text[]
    )
  )
);

CREATE INDEX IF NOT EXISTS idx_alert_dead_letter_triage_audit_delivery
  ON public.alert_dead_letter_triage_audit (delivery_id, created_at DESC);

CREATE TABLE IF NOT EXISTS public.alert_rule_run_log (
  run_log_id BIGSERIAL PRIMARY KEY,
  rule_id BIGINT NOT NULL REFERENCES public.alert_rule(rule_id) ON DELETE CASCADE,
  run_status VARCHAR(30) NOT NULL DEFAULT 'captured',
  matched_count INT NOT NULL DEFAULT 0,
  triggered_event_count INT NOT NULL DEFAULT 0,
  execution_context JSONB NOT NULL DEFAULT '{}'::jsonb,
  result_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  error_message TEXT NULL,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  finished_at TIMESTAMPTZ NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_alert_rule_run_log_status CHECK (
    run_status = ANY (ARRAY['captured'::varchar, 'success'::varchar, 'failed'::varchar]::text[])
  )
);

CREATE INDEX IF NOT EXISTS idx_alert_rule_run_log_rule ON public.alert_rule_run_log (rule_id, started_at DESC);

DROP TRIGGER IF EXISTS trg_alert_rule_updated_at ON public.alert_rule;
CREATE TRIGGER trg_alert_rule_updated_at
BEFORE UPDATE ON public.alert_rule
FOR EACH ROW
EXECUTE FUNCTION public.set_row_updated_at();

DROP TRIGGER IF EXISTS trg_alert_rule_recipient_updated_at ON public.alert_rule_recipient;
CREATE TRIGGER trg_alert_rule_recipient_updated_at
BEFORE UPDATE ON public.alert_rule_recipient
FOR EACH ROW
EXECUTE FUNCTION public.set_row_updated_at();

DROP TRIGGER IF EXISTS trg_alert_event_updated_at ON public.alert_event;
CREATE TRIGGER trg_alert_event_updated_at
BEFORE UPDATE ON public.alert_event
FOR EACH ROW
EXECUTE FUNCTION public.set_row_updated_at();

DROP TRIGGER IF EXISTS trg_alert_dead_letter_triage_updated_at ON public.alert_dead_letter_triage;
CREATE TRIGGER trg_alert_dead_letter_triage_updated_at
BEFORE UPDATE ON public.alert_dead_letter_triage
FOR EACH ROW
EXECUTE FUNCTION public.set_row_updated_at();

INSERT INTO public.alert_rule (
  rule_key,
  rule_name,
  description,
  module_key,
  source_type,
  source_ref,
  metric_id,
  semantic_ref,
  condition_mapping_id,
  condition_mapping_key,
  condition_operator_key,
  comparison_type,
  value_type,
  schedule_type,
  schedule_value,
  severity,
  primary_channel,
  condition_summary,
  condition_config,
  source_context,
  message_template,
  status,
  is_active,
  created_by,
  updated_by
)
SELECT
  'rule-daily-sales-revenue-drop',
  'Sales Drop Alert',
  'Detect daily sales drop faster than yesterday and notify the ops channel.',
  'sales',
  'business-metric',
  'daily_sales_revenue',
  b.metric_id,
  b.semantic_ref,
  m.mapping_id,
  m.ui_condition_key,
  m.operator_key,
  b.comparison_type,
  b.value_type,
  'preset',
  '15m',
  'critical',
  'wa-group',
  'Drop more than 20% vs yesterday',
  '{"threshold":20,"threshold_unit":"percent","comparison_base":"yesterday"}'::jsonb,
  '{"dashboardKey":"custom-db-1","widgetId":"top-sales-by-customerr-66773800"}'::jsonb,
  '[Critical] Daily sales dropped more than 20% versus yesterday. Please review branch performance and top customer contribution.',
  'active',
  true,
  'system',
  'system'
FROM public.metric_business_registry b
LEFT JOIN public.metric_condition_ui_mapping m
  ON m.example_metric_key = b.metric_key
 AND m.ui_condition_key = 'drop_vs_yesterday_pct'
WHERE b.metric_key = 'daily_sales_revenue'
ON CONFLICT (rule_key) DO UPDATE SET
  rule_name = EXCLUDED.rule_name,
  description = EXCLUDED.description,
  module_key = EXCLUDED.module_key,
  source_type = EXCLUDED.source_type,
  source_ref = EXCLUDED.source_ref,
  metric_id = EXCLUDED.metric_id,
  semantic_ref = EXCLUDED.semantic_ref,
  condition_mapping_id = EXCLUDED.condition_mapping_id,
  condition_mapping_key = EXCLUDED.condition_mapping_key,
  condition_operator_key = EXCLUDED.condition_operator_key,
  comparison_type = EXCLUDED.comparison_type,
  value_type = EXCLUDED.value_type,
  schedule_type = EXCLUDED.schedule_type,
  schedule_value = EXCLUDED.schedule_value,
  severity = EXCLUDED.severity,
  primary_channel = EXCLUDED.primary_channel,
  condition_summary = EXCLUDED.condition_summary,
  condition_config = EXCLUDED.condition_config,
  source_context = EXCLUDED.source_context,
  message_template = EXCLUDED.message_template,
  status = EXCLUDED.status,
  is_active = EXCLUDED.is_active,
  updated_by = EXCLUDED.updated_by;

INSERT INTO public.alert_rule_recipient (
  rule_id,
  recipient_type,
  channel_type,
  target_label,
  target_value,
  sort_order,
  metadata,
  is_active,
  created_by,
  updated_by
)
SELECT
  r.rule_id,
  'channel',
  'wa-group',
  'Ops Alert Group',
  'ops-alert-group',
  10,
  '{"seed":true}'::jsonb,
  true,
  'system',
  'system'
FROM public.alert_rule r
WHERE r.rule_key = 'rule-daily-sales-revenue-drop'
  AND NOT EXISTS (
    SELECT 1
    FROM public.alert_rule_recipient rr
    WHERE rr.rule_id = r.rule_id
      AND rr.target_value = 'ops-alert-group'
      AND rr.deleted_at IS NULL
  );

INSERT INTO public.alert_event (
  event_key,
  rule_id,
  metric_id,
  snapshot_id,
  title,
  description,
  severity,
  status,
  source_ref,
  event_payload,
  detected_at,
  created_by,
  updated_by
)
SELECT
  'evt-daily-sales-revenue-drop-surabaya',
  r.rule_id,
  r.metric_id,
  1,
  'Daily sales dropped below threshold',
  'Daily sales revenue dropped sharply versus yesterday for Surabaya branch.',
  'critical',
  'open',
  'daily_sales_revenue',
  '{"branch":"Surabaya","change_pct":-31.92,"comparison_base":"yesterday"}'::jsonb,
  NOW(),
  'system',
  'system'
FROM public.alert_rule r
WHERE r.rule_key = 'rule-daily-sales-revenue-drop'
ON CONFLICT (event_key) DO UPDATE SET
  description = EXCLUDED.description,
  severity = EXCLUDED.severity,
  status = EXCLUDED.status,
  source_ref = EXCLUDED.source_ref,
  event_payload = EXCLUDED.event_payload,
  updated_by = EXCLUDED.updated_by;

INSERT INTO public.alert_rule_run_log (
  rule_id,
  run_status,
  matched_count,
  triggered_event_count,
  execution_context,
  result_payload,
  started_at,
  finished_at
)
SELECT
  r.rule_id,
  'success',
  1,
  1,
  '{"schedule":"15m"}'::jsonb,
  '{"event_key":"evt-daily-sales-revenue-drop-surabaya"}'::jsonb,
  NOW(),
  NOW()
FROM public.alert_rule r
WHERE r.rule_key = 'rule-daily-sales-revenue-drop'
  AND NOT EXISTS (
    SELECT 1
    FROM public.alert_rule_run_log rl
    WHERE rl.rule_id = r.rule_id
  );

INSERT INTO public.alert_delivery_log (
  event_id,
  rule_id,
  recipient_id,
  channel_type,
  target_value,
  provider_name,
  delivery_status,
  response_payload,
  requested_at,
  delivered_at
)
SELECT
  e.event_id,
  r.rule_id,
  rr.recipient_id,
  rr.channel_type,
  rr.target_value,
  'dummy-seed',
  'delivered',
  '{"seed":true}'::jsonb,
  NOW(),
  NOW()
FROM public.alert_event e
JOIN public.alert_rule r ON r.rule_id = e.rule_id
LEFT JOIN public.alert_rule_recipient rr
  ON rr.rule_id = r.rule_id
 AND rr.deleted_at IS NULL
 AND rr.is_active = TRUE
WHERE e.event_key = 'evt-daily-sales-revenue-drop-surabaya'
  AND NOT EXISTS (
    SELECT 1
    FROM public.alert_delivery_log dl
    WHERE dl.event_id = e.event_id
  );
