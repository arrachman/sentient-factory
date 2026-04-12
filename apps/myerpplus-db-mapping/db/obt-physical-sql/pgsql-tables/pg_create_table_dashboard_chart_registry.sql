-- Chart-first metadata tables for configurable dashboards on PostgreSQL OBT.
-- Purpose:
--   store chart definitions separately from generic widgets
--   so one dashboard page can render multiple charts directly from metadata
--   with explicit query, axis, series, and filter bindings.

CREATE OR REPLACE FUNCTION public.set_row_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TABLE IF NOT EXISTS public.dashboard_chart_definition (
  chart_id bigserial PRIMARY KEY,
  dashboard_id bigint NOT NULL REFERENCES public.dashboard(dashboard_id) ON DELETE CASCADE,
  chart_key text NOT NULL,
  title text NOT NULL,
  short_label text NOT NULL,
  description text,
  chart_type text NOT NULL DEFAULT 'bar',
  source_mode text NOT NULL DEFAULT 'sql',
  source_relation text,
  result_kind text NOT NULL DEFAULT 'categorical',
  category_column text,
  value_column text,
  series_column text,
  time_column text,
  sort_column text,
  sort_direction text NOT NULL DEFAULT 'desc',
  limit_rows integer,
  empty_state text,
  ui_config jsonb NOT NULL DEFAULT '{}'::jsonb,
  refresh_interval_seconds integer,
  sort_order integer NOT NULL DEFAULT 100,
  is_primary boolean NOT NULL DEFAULT false,
  is_active boolean NOT NULL DEFAULT true,
  created_by text,
  updated_by text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT uq_dashboard_chart_definition_key UNIQUE (dashboard_id, chart_key),
  CONSTRAINT chk_dashboard_chart_definition_type
    CHECK (chart_type IN ('bar', 'stacked_bar', 'line', 'area', 'pie', 'donut', 'radial', 'kpi')),
  CONSTRAINT chk_dashboard_chart_definition_source_mode
    CHECK (source_mode IN ('sql', 'table', 'view', 'materialized_view')),
  CONSTRAINT chk_dashboard_chart_definition_result
    CHECK (result_kind IN ('single_value', 'categorical', 'time_series', 'mixed')),
  CONSTRAINT chk_dashboard_chart_definition_sort_direction
    CHECK (sort_direction IN ('asc', 'desc'))
);

CREATE INDEX IF NOT EXISTS idx_dashboard_chart_definition_dashboard
  ON public.dashboard_chart_definition (dashboard_id, is_active, sort_order);

CREATE INDEX IF NOT EXISTS idx_dashboard_chart_definition_lookup
  ON public.dashboard_chart_definition (chart_type, result_kind, source_relation);

CREATE TABLE IF NOT EXISTS public.dashboard_chart_query (
  chart_query_id bigserial PRIMARY KEY,
  chart_id bigint NOT NULL REFERENCES public.dashboard_chart_definition(chart_id) ON DELETE CASCADE,
  query_key text NOT NULL,
  label text NOT NULL,
  purpose text,
  sql_template text NOT NULL,
  count_sql text,
  query_params jsonb NOT NULL DEFAULT '[]'::jsonb,
  output_columns jsonb NOT NULL DEFAULT '[]'::jsonb,
  execution_order integer NOT NULL DEFAULT 1,
  default_limit integer,
  cache_ttl_seconds integer,
  is_primary boolean NOT NULL DEFAULT true,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT uq_dashboard_chart_query_key UNIQUE (chart_id, query_key)
);

CREATE INDEX IF NOT EXISTS idx_dashboard_chart_query_chart
  ON public.dashboard_chart_query (chart_id, is_active, execution_order);

CREATE TABLE IF NOT EXISTS public.dashboard_chart_filter_binding (
  chart_filter_binding_id bigserial PRIMARY KEY,
  chart_id bigint NOT NULL REFERENCES public.dashboard_chart_definition(chart_id) ON DELETE CASCADE,
  filter_id bigint NOT NULL REFERENCES public.dashboard_filter(filter_id) ON DELETE CASCADE,
  query_param_name text NOT NULL,
  default_value_override jsonb,
  is_required boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 100,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT uq_dashboard_chart_filter_binding UNIQUE (chart_id, filter_id, query_param_name)
);

CREATE INDEX IF NOT EXISTS idx_dashboard_chart_filter_binding_chart
  ON public.dashboard_chart_filter_binding (chart_id, sort_order);

DROP TRIGGER IF EXISTS trg_dashboard_chart_definition_updated_at ON public.dashboard_chart_definition;
CREATE TRIGGER trg_dashboard_chart_definition_updated_at
BEFORE UPDATE ON public.dashboard_chart_definition
FOR EACH ROW
EXECUTE FUNCTION public.set_row_updated_at();

DROP TRIGGER IF EXISTS trg_dashboard_chart_query_updated_at ON public.dashboard_chart_query;
CREATE TRIGGER trg_dashboard_chart_query_updated_at
BEFORE UPDATE ON public.dashboard_chart_query
FOR EACH ROW
EXECUTE FUNCTION public.set_row_updated_at();

DROP TRIGGER IF EXISTS trg_dashboard_chart_filter_binding_updated_at ON public.dashboard_chart_filter_binding;
CREATE TRIGGER trg_dashboard_chart_filter_binding_updated_at
BEFORE UPDATE ON public.dashboard_chart_filter_binding
FOR EACH ROW
EXECUTE FUNCTION public.set_row_updated_at();

COMMENT ON TABLE public.dashboard_chart_definition IS
  'Metadata utama untuk chart yang dirender pada satu dashboard.';

COMMENT ON TABLE public.dashboard_chart_query IS
  'Query SQL per chart untuk menghasilkan dataset chart.';

COMMENT ON TABLE public.dashboard_chart_filter_binding IS
  'Binding antara filter dashboard dan chart tertentu.';

COMMENT ON COLUMN public.dashboard_chart_definition.category_column IS
  'Kolom label utama untuk sumbu X atau kategori pie.';

COMMENT ON COLUMN public.dashboard_chart_definition.value_column IS
  'Kolom numerik utama untuk nilai chart.';

COMMENT ON COLUMN public.dashboard_chart_definition.series_column IS
  'Kolom opsional untuk multi-series seperti stacked bar atau line multi-series.';

COMMENT ON COLUMN public.dashboard_chart_definition.time_column IS
  'Kolom waktu untuk line atau area chart time-series.';

-- Example seed for chart-only dashboard page such as /app/dashboard/custom-db-1
WITH target_dashboard AS (
  SELECT dashboard_id
  FROM public.dashboard
  WHERE dashboard_key = 'custom-db-1'
)
INSERT INTO public.dashboard_chart_definition (
  dashboard_id,
  chart_key,
  title,
  short_label,
  description,
  chart_type,
  source_mode,
  source_relation,
  result_kind,
  category_column,
  value_column,
  sort_column,
  sort_direction,
  limit_rows,
  empty_state,
  ui_config,
  sort_order,
  is_primary,
  is_active,
  created_by,
  updated_by
)
SELECT
  dashboard_id,
  chart_key,
  title,
  short_label,
  description,
  chart_type,
  source_mode,
  source_relation,
  result_kind,
  category_column,
  value_column,
  sort_column,
  sort_direction,
  limit_rows,
  empty_state,
  ui_config,
  sort_order,
  is_primary,
  is_active,
  'codex',
  'codex'
FROM target_dashboard
CROSS JOIN (
  VALUES
    (
      'warehouse-pressure-ranking',
      'Warehouse Pressure Ranking',
      'Pressure Ranking',
      'Ranking warehouse berdasarkan total movement inventory.',
      'bar',
      'sql',
      'public.obt_inventory_movement_line',
      'categorical',
      'warehouse_name',
      'movement_count',
      'movement_count',
      'desc',
      20,
      'Belum ada ranking warehouse.',
      '{"defaultW":12,"defaultH":6}'::jsonb,
      10,
      true,
      true
    ),
    (
      'warehouse-total-amount-share',
      'Warehouse Amount Share',
      'Amount Share',
      'Distribusi nilai movement per warehouse.',
      'pie',
      'sql',
      'public.obt_inventory_movement_line',
      'categorical',
      'warehouse_name',
      'total_amount',
      'total_amount',
      'desc',
      10,
      'Belum ada distribusi warehouse.',
      '{"defaultW":12,"defaultH":6,"legend":"right"}'::jsonb,
      20,
      false,
      true
    )
) AS charts(
  chart_key,
  title,
  short_label,
  description,
  chart_type,
  source_mode,
  source_relation,
  result_kind,
  category_column,
  value_column,
  sort_column,
  sort_direction,
  limit_rows,
  empty_state,
  ui_config,
  sort_order,
  is_primary,
  is_active
)
ON CONFLICT (dashboard_id, chart_key) DO UPDATE
SET title = EXCLUDED.title,
    short_label = EXCLUDED.short_label,
    description = EXCLUDED.description,
    chart_type = EXCLUDED.chart_type,
    source_mode = EXCLUDED.source_mode,
    source_relation = EXCLUDED.source_relation,
    result_kind = EXCLUDED.result_kind,
    category_column = EXCLUDED.category_column,
    value_column = EXCLUDED.value_column,
    sort_column = EXCLUDED.sort_column,
    sort_direction = EXCLUDED.sort_direction,
    limit_rows = EXCLUDED.limit_rows,
    empty_state = EXCLUDED.empty_state,
    ui_config = EXCLUDED.ui_config,
    sort_order = EXCLUDED.sort_order,
    is_primary = EXCLUDED.is_primary,
    is_active = EXCLUDED.is_active,
    updated_by = EXCLUDED.updated_by;

WITH target_charts AS (
  SELECT c.chart_id, c.chart_key
  FROM public.dashboard_chart_definition c
  JOIN public.dashboard d ON d.dashboard_id = c.dashboard_id
  WHERE d.dashboard_key = 'custom-db-1'
)
INSERT INTO public.dashboard_chart_query (
  chart_id,
  query_key,
  label,
  purpose,
  sql_template,
  query_params,
  output_columns,
  execution_order,
  default_limit,
  is_primary,
  is_active
)
SELECT
  chart_id,
  query_key,
  label,
  purpose,
  sql_template,
  query_params,
  output_columns,
  execution_order,
  default_limit,
  is_primary,
  is_active
FROM target_charts
JOIN (
  VALUES
    (
      'warehouse-pressure-ranking',
      'warehouse-pressure-ranking-main',
      'Warehouse Pressure Ranking Query',
      'Merangking warehouse berdasarkan total movement.',
      $sql$
        SELECT
          COALESCE(location_name, branch_name, 'Unknown') AS warehouse_name,
          COUNT(*) AS movement_count,
          SUM(COALESCE(qty, 0)) AS total_qty,
          SUM(COALESCE(amount, 0)) AS total_amount
        FROM public.obt_inventory_movement_line
        GROUP BY 1
        ORDER BY movement_count DESC, total_qty DESC
        LIMIT COALESCE({{limit}}, 20)
      $sql$,
      '[{"key":"limit","type":"integer"}]'::jsonb,
      '["warehouse_name","movement_count","total_qty","total_amount"]'::jsonb,
      1,
      20,
      true,
      true
    ),
    (
      'warehouse-total-amount-share',
      'warehouse-total-amount-share-main',
      'Warehouse Amount Share Query',
      'Distribusi total amount movement per warehouse.',
      $sql$
        SELECT
          COALESCE(location_name, branch_name, 'Unknown') AS warehouse_name,
          SUM(COALESCE(amount, 0)) AS total_amount
        FROM public.obt_inventory_movement_line
        GROUP BY 1
        ORDER BY total_amount DESC
        LIMIT COALESCE({{limit}}, 10)
      $sql$,
      '[{"key":"limit","type":"integer"}]'::jsonb,
      '["warehouse_name","total_amount"]'::jsonb,
      1,
      10,
      true,
      true
    )
) AS queries(
  chart_key,
  query_key,
  label,
  purpose,
  sql_template,
  query_params,
  output_columns,
  execution_order,
  default_limit,
  is_primary,
  is_active
)
ON target_charts.chart_key = queries.chart_key
ON CONFLICT (chart_id, query_key) DO UPDATE
SET label = EXCLUDED.label,
    purpose = EXCLUDED.purpose,
    sql_template = EXCLUDED.sql_template,
    query_params = EXCLUDED.query_params,
    output_columns = EXCLUDED.output_columns,
    execution_order = EXCLUDED.execution_order,
    default_limit = EXCLUDED.default_limit,
    is_primary = EXCLUDED.is_primary,
    is_active = EXCLUDED.is_active;

WITH target_charts AS (
  SELECT c.chart_id, c.chart_key
  FROM public.dashboard_chart_definition c
  JOIN public.dashboard d ON d.dashboard_id = c.dashboard_id
  WHERE d.dashboard_key = 'custom-db-1'
),
target_filters AS (
  SELECT f.filter_id, f.filter_key
  FROM public.dashboard_filter f
  JOIN public.dashboard d ON d.dashboard_id = f.dashboard_id
  WHERE d.dashboard_key = 'custom-db-1'
)
INSERT INTO public.dashboard_chart_filter_binding (
  chart_id,
  filter_id,
  query_param_name,
  default_value_override,
  is_required,
  sort_order
)
SELECT
  chart_id,
  filter_id,
  query_param_name,
  default_value_override,
  is_required,
  sort_order
FROM (
  VALUES
    ('warehouse-pressure-ranking', 'limit', 'limit', NULL::jsonb, false, 10),
    ('warehouse-total-amount-share', 'limit', 'limit', NULL::jsonb, false, 10)
) AS bindings(
  chart_key,
  filter_key,
  query_param_name,
  default_value_override,
  is_required,
  sort_order
)
JOIN target_charts ON target_charts.chart_key = bindings.chart_key
JOIN target_filters ON target_filters.filter_key = bindings.filter_key
ON CONFLICT (chart_id, filter_id, query_param_name) DO UPDATE
SET default_value_override = EXCLUDED.default_value_override,
    is_required = EXCLUDED.is_required,
    sort_order = EXCLUDED.sort_order;
