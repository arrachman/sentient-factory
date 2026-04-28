-- Metric insight snapshot.
-- Purpose:
--   1. Menyimpan hasil insight runtime / snapshot per metric.
--   2. Menjadi layer trend dan anomaly yang bisa dibaca Alert Center atau AI summary.
--   3. Memisahkan metric master dari hasil observasi periodik.
--
-- Design choice:
--   1. Snapshot bersifat historis dan append-oriented.
--   2. Bisa dihasilkan dari cron, AI insight engine, atau manual analysis run.
--   3. Tetap fleksibel dengan JSONB untuk dimensions, evidence, dan recommendation preview.

CREATE OR REPLACE FUNCTION public.set_row_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TABLE IF NOT EXISTS public.metric_insight_snapshot (
  snapshot_id bigserial PRIMARY KEY,
  metric_id bigint NOT NULL,
  snapshot_key varchar(160) NOT NULL,
  period_key varchar(60) NOT NULL,
  snapshot_at timestamptz NOT NULL DEFAULT now(),
  granularity varchar(30) NOT NULL DEFAULT 'daily',
  source_type varchar(40) NOT NULL DEFAULT 'system',
  source_ref varchar(160),
  dimensions jsonb NOT NULL DEFAULT '{}'::jsonb,
  filter_context jsonb NOT NULL DEFAULT '{}'::jsonb,
  current_value numeric(24,6),
  comparison_value numeric(24,6),
  delta_value numeric(24,6),
  change_pct numeric(12,4),
  trend_label varchar(40),
  anomaly_score numeric(8,4),
  anomaly_level varchar(30),
  insight_text text,
  evidence_payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  recommendation_preview text,
  is_alert_candidate boolean NOT NULL DEFAULT false,
  status varchar(30) NOT NULL DEFAULT 'captured',
  created_by text,
  updated_by text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz,
  CONSTRAINT fk_metric_insight_snapshot_metric_id
    FOREIGN KEY (metric_id) REFERENCES public.metric_business_registry(metric_id),
  CONSTRAINT uq_metric_insight_snapshot_key UNIQUE (snapshot_key),
  CONSTRAINT chk_metric_insight_snapshot_granularity CHECK (
    granularity IN ('hourly', 'daily', 'weekly', 'monthly', 'quarterly', 'yearly', 'ad_hoc')
  ),
  CONSTRAINT chk_metric_insight_snapshot_source_type CHECK (
    source_type IN ('system', 'ai', 'manual', 'alert_engine', 'dashboard')
  ),
  CONSTRAINT chk_metric_insight_snapshot_trend_label CHECK (
    trend_label IS NULL OR trend_label IN (
      'up',
      'down',
      'flat',
      'spike',
      'drop',
      'volatile',
      'recovering'
    )
  ),
  CONSTRAINT chk_metric_insight_snapshot_anomaly_level CHECK (
    anomaly_level IS NULL OR anomaly_level IN ('none', 'low', 'medium', 'high', 'critical')
  ),
  CONSTRAINT chk_metric_insight_snapshot_status CHECK (
    status IN ('captured', 'reviewed', 'promoted', 'archived')
  )
);

CREATE INDEX IF NOT EXISTS idx_metric_insight_snapshot_metric
  ON public.metric_insight_snapshot (metric_id, snapshot_at DESC)
  WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_metric_insight_snapshot_alert_candidate
  ON public.metric_insight_snapshot (is_alert_candidate, anomaly_level, snapshot_at DESC)
  WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_metric_insight_snapshot_period
  ON public.metric_insight_snapshot (period_key, granularity)
  WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_metric_insight_snapshot_dimensions
  ON public.metric_insight_snapshot
  USING gin (dimensions);

CREATE INDEX IF NOT EXISTS idx_metric_insight_snapshot_evidence
  ON public.metric_insight_snapshot
  USING gin (evidence_payload);

DROP TRIGGER IF EXISTS trg_metric_insight_snapshot_updated_at ON public.metric_insight_snapshot;
CREATE TRIGGER trg_metric_insight_snapshot_updated_at
BEFORE UPDATE ON public.metric_insight_snapshot
FOR EACH ROW
EXECUTE FUNCTION public.set_row_updated_at();

INSERT INTO public.metric_insight_snapshot (
  metric_id,
  snapshot_key,
  period_key,
  snapshot_at,
  granularity,
  source_type,
  source_ref,
  dimensions,
  filter_context,
  current_value,
  comparison_value,
  delta_value,
  change_pct,
  trend_label,
  anomaly_score,
  anomaly_level,
  insight_text,
  evidence_payload,
  recommendation_preview,
  is_alert_candidate,
  status,
  created_by,
  updated_by
)
SELECT
  metric_id,
  snapshot_key,
  period_key,
  snapshot_at,
  granularity,
  source_type,
  source_ref,
  dimensions,
  filter_context,
  current_value,
  comparison_value,
  delta_value,
  change_pct,
  trend_label,
  anomaly_score,
  anomaly_level,
  insight_text,
  evidence_payload,
  recommendation_preview,
  is_alert_candidate,
  status,
  'seed',
  'seed'
FROM (
  SELECT
    b.metric_id,
    'daily_sales_revenue-2026-04-18-branch-surabaya'::varchar(160) AS snapshot_key,
    '2026-04-18'::varchar(60) AS period_key,
    now() AS snapshot_at,
    'daily'::varchar(30) AS granularity,
    'alert_engine'::varchar(40) AS source_type,
    'daily_sales_revenue'::varchar(160) AS source_ref,
    '{"branch":"Surabaya"}'::jsonb AS dimensions,
    '{"period":"today"}'::jsonb AS filter_context,
    145000000.000000::numeric(24,6) AS current_value,
    213000000.000000::numeric(24,6) AS comparison_value,
    -68000000.000000::numeric(24,6) AS delta_value,
    -31.9200::numeric(12,4) AS change_pct,
    'drop'::varchar(40) AS trend_label,
    0.9100::numeric(8,4) AS anomaly_score,
    'critical'::varchar(30) AS anomaly_level,
    'Daily sales revenue dropped sharply versus yesterday for Surabaya branch.'::text AS insight_text,
    '{"top_customer_impact":"high","affected_branch":"Surabaya"}'::jsonb AS evidence_payload,
    'Review branch sales mix and top customer contribution before next business hour.'::text AS recommendation_preview,
    true AS is_alert_candidate,
    'captured'::varchar(30) AS status
  FROM public.metric_business_registry b
  WHERE b.metric_key = 'daily_sales_revenue'

  UNION ALL

  SELECT
    b.metric_id,
    'overdue_receivable_total-2026-04-18-branch-jakarta',
    '2026-04-18',
    now(),
    'daily',
    'ai',
    'overdue_receivable_total',
    '{"branch":"Jakarta"}'::jsonb,
    '{"aging_bucket":"30_plus"}'::jsonb,
    245000000.000000::numeric(24,6),
    198000000.000000::numeric(24,6),
    47000000.000000::numeric(24,6),
    23.7400::numeric(12,4),
    'up',
    0.7200::numeric(8,4),
    'high',
    'Overdue receivable increased materially in Jakarta and is concentrated in a small set of customers.',
    '{"customer_count":6,"largest_customer_share_pct":41.5}'::jsonb,
    'Prioritize collection outreach for the highest overdue customers this afternoon.',
    true,
    'reviewed'
  FROM public.metric_business_registry b
  WHERE b.metric_key = 'overdue_receivable_total'
) seeded
WHERE NOT EXISTS (
  SELECT 1
  FROM public.metric_insight_snapshot existing
  WHERE existing.snapshot_key = seeded.snapshot_key
);
