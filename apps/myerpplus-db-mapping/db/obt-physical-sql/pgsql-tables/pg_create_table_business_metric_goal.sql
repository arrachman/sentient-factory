-- Business metric goal.
-- Purpose:
--   1. Menyimpan konteks kenapa metric ini penting.
--   2. Menjembatani metric dengan stakeholder, goal statement, dan decision context.
--   3. Mendukung AI retrieval agar metric tidak hanya punya definisi, tetapi juga tujuan bisnis.
--
-- Design choice:
--   1. 1 metric bisa punya banyak goal / stakeholder.
--   2. Tetap ringan untuk MVP, tanpa versioning terpisah dulu.
--   3. Gunakan FK ke business_metric_registry sebagai source of truth metric.

CREATE OR REPLACE FUNCTION public.set_row_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TABLE IF NOT EXISTS public.metric_business_goal (
  metric_goal_id bigserial PRIMARY KEY,
  metric_id bigint NOT NULL,
  stakeholder_role varchar(120) NOT NULL,
  stakeholder_name varchar(200),
  goal_statement text NOT NULL,
  decision_context text,
  business_question text,
  priority varchar(30) NOT NULL DEFAULT 'medium',
  owner_name varchar(120),
  is_primary boolean NOT NULL DEFAULT false,
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_by text,
  updated_by text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz,
  CONSTRAINT fk_metric_business_goal_metric_id
    FOREIGN KEY (metric_id) REFERENCES public.metric_business_registry(metric_id),
  CONSTRAINT chk_metric_business_goal_priority CHECK (
    priority IN ('low', 'medium', 'high', 'critical')
  )
);

CREATE INDEX IF NOT EXISTS idx_metric_business_goal_metric
  ON public.metric_business_goal (metric_id, is_active, sort_order)
  WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_metric_business_goal_stakeholder
  ON public.metric_business_goal (stakeholder_role, is_active)
  WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_metric_business_goal_metadata
  ON public.metric_business_goal
  USING gin (metadata);

DROP TRIGGER IF EXISTS trg_metric_business_goal_updated_at ON public.metric_business_goal;
CREATE TRIGGER trg_metric_business_goal_updated_at
BEFORE UPDATE ON public.metric_business_goal
FOR EACH ROW
EXECUTE FUNCTION public.set_row_updated_at();

INSERT INTO public.metric_business_goal (
  metric_id,
  stakeholder_role,
  stakeholder_name,
  goal_statement,
  decision_context,
  business_question,
  priority,
  owner_name,
  is_primary,
  is_active,
  sort_order,
  metadata,
  created_by,
  updated_by
)
SELECT
  metric_id,
  stakeholder_role,
  stakeholder_name,
  goal_statement,
  decision_context,
  business_question,
  priority,
  owner_name,
  is_primary,
  true,
  sort_order,
  metadata,
  'seed',
  'seed'
FROM (
  SELECT
    b.metric_id,
    'Sales Manager'::varchar(120) AS stakeholder_role,
    'Sales Leadership'::varchar(200) AS stakeholder_name,
    'Pastikan revenue harian tetap stabil dan penurunan terdeteksi lebih cepat.'::text AS goal_statement,
    'Digunakan untuk keputusan review penjualan cabang, follow-up customer, dan eskalasi penurunan revenue.'::text AS decision_context,
    'Cabang mana yang perlu tindakan cepat ketika revenue harian turun signifikan?'::text AS business_question,
    'critical'::varchar(30) AS priority,
    'Sales Manager'::varchar(120) AS owner_name,
    true AS is_primary,
    10 AS sort_order,
    '{"module":"sales","use_case":"alerting"}'::jsonb AS metadata
  FROM public.metric_business_registry b
  WHERE b.metric_key = 'daily_sales_revenue'

  UNION ALL

  SELECT
    b.metric_id,
    'Finance Lead',
    'Receivable Team',
    'Kendalikan total overdue receivable agar cash collection tetap sehat.',
    'Dipakai untuk prioritas collection, eskalasi customer overdue, dan monitoring aging piutang.',
    'Customer, branch, atau aging bucket mana yang paling berkontribusi ke overdue receivable?',
    'critical',
    'Finance Lead',
    true,
    20,
    '{"module":"finance","use_case":"collection"}'::jsonb
  FROM public.metric_business_registry b
  WHERE b.metric_key = 'overdue_receivable_total'

  UNION ALL

  SELECT
    b.metric_id,
    'Warehouse Supervisor',
    'Warehouse Operations',
    'Minimalkan kasus stock negatif agar operasional gudang dan replenishment tidak terganggu.',
    'Dipakai untuk review transaksi stok, prioritas koreksi data, dan penjadwalan stock opname.',
    'Gudang atau item mana yang paling sering menyebabkan stock negatif?',
    'high',
    'Warehouse Supervisor',
    true,
    30,
    '{"module":"warehouse","use_case":"stock_control"}'::jsonb
  FROM public.metric_business_registry b
  WHERE b.metric_key = 'negative_stock_count'
) seeded
WHERE NOT EXISTS (
  SELECT 1
  FROM public.metric_business_goal existing
  WHERE existing.metric_id = seeded.metric_id
    AND existing.stakeholder_role = seeded.stakeholder_role
    AND existing.goal_statement = seeded.goal_statement
    AND existing.deleted_at IS NULL
);
