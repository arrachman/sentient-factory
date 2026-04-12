-- Dashboard metadata catalog layout.
-- Final simplified model:
--   1. 1 row public.m0_menu = 1 dashboard page
--   2. dashboard page directly owns widgets
--   3. widget owns one or more queries
--   4. filters stay attached at dashboard level

CREATE OR REPLACE FUNCTION public.set_row_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TABLE IF NOT EXISTS public.dashboard (
  dashboard_id bigserial PRIMARY KEY,
  menu_id integer,
  dashboard_key text NOT NULL UNIQUE,
  title text NOT NULL,
  short_label text NOT NULL,
  description text,
  icon_name text,
  status text NOT NULL DEFAULT 'draft',
  layout_config jsonb NOT NULL DEFAULT '{}'::jsonb,
  default_filter_values jsonb NOT NULL DEFAULT '{}'::jsonb,
  is_active boolean NOT NULL DEFAULT true,
  created_by text,
  updated_by text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT chk_dashboard_status
    CHECK (status IN ('draft', 'active', 'archived'))
);

CREATE TABLE IF NOT EXISTS public.dashboard_widget (
  widget_id bigserial PRIMARY KEY,
  dashboard_id bigint NOT NULL REFERENCES public.dashboard(dashboard_id) ON DELETE CASCADE,
  widget_key text NOT NULL,
  title text NOT NULL,
  short_label text NOT NULL,
  description text,
  widget_kind text NOT NULL DEFAULT 'table',
  chart_type text,
  source_table text,
  result_kind text NOT NULL DEFAULT 'table',
  ui_config jsonb NOT NULL DEFAULT '{}'::jsonb,
  filter_binding jsonb NOT NULL DEFAULT '[]'::jsonb,
  empty_state text,
  span_class_name text,
  widget_order integer NOT NULL DEFAULT 100,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT uq_dashboard_widget_key UNIQUE (dashboard_id, widget_key),
  CONSTRAINT chk_dashboard_widget_kind
    CHECK (widget_kind IN ('kpi', 'summary', 'chart', 'table', 'list', 'text', 'metric')),
  CONSTRAINT chk_dashboard_widget_result
    CHECK (result_kind IN ('table', 'single_value', 'time_series', 'categorical', 'mixed'))
);

CREATE TABLE IF NOT EXISTS public.dashboard_widget_query (
  widget_query_id bigserial PRIMARY KEY,
  widget_id bigint NOT NULL REFERENCES public.dashboard_widget(widget_id) ON DELETE CASCADE,
  query_key text NOT NULL,
  label text NOT NULL,
  purpose text,
  sql_template text NOT NULL,
  count_sql text,
  query_params jsonb NOT NULL DEFAULT '[]'::jsonb,
  output_columns jsonb NOT NULL DEFAULT '[]'::jsonb,
  default_limit integer,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT uq_dashboard_widget_query_key UNIQUE (widget_id, query_key)
);

CREATE TABLE IF NOT EXISTS public.dashboard_filter (
  filter_id bigserial PRIMARY KEY,
  dashboard_id bigint NOT NULL REFERENCES public.dashboard(dashboard_id) ON DELETE CASCADE,
  filter_key text NOT NULL,
  label text NOT NULL,
  filter_type text NOT NULL DEFAULT 'select',
  data_type text NOT NULL DEFAULT 'text',
  source_type text NOT NULL DEFAULT 'static',
  source_table text,
  source_query text,
  static_options jsonb NOT NULL DEFAULT '[]'::jsonb,
  placeholder text,
  query_param_name text NOT NULL,
  default_value jsonb,
  depends_on_filter_key text,
  allows_multiple boolean NOT NULL DEFAULT false,
  is_required boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 100,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT uq_dashboard_filter_key UNIQUE (dashboard_id, filter_key),
  CONSTRAINT chk_dashboard_filter_type
    CHECK (filter_type IN ('select', 'multi_select', 'date', 'date_range', 'number_range', 'search', 'toggle')),
  CONSTRAINT chk_dashboard_filter_data_type
    CHECK (data_type IN ('text', 'integer', 'numeric', 'date', 'timestamp', 'boolean')),
  CONSTRAINT chk_dashboard_filter_source
    CHECK (source_type IN ('static', 'query'))
);

CREATE INDEX IF NOT EXISTS idx_dashboard_active
  ON public.dashboard (is_active, title);

CREATE INDEX IF NOT EXISTS idx_dashboard_widget_dashboard
  ON public.dashboard_widget (dashboard_id, is_active, widget_order);

CREATE INDEX IF NOT EXISTS idx_dashboard_widget_query_widget
  ON public.dashboard_widget_query (widget_id, is_active);

CREATE INDEX IF NOT EXISTS idx_dashboard_filter_dashboard
  ON public.dashboard_filter (dashboard_id, is_active, sort_order);

DROP TRIGGER IF EXISTS trg_dashboard_updated_at ON public.dashboard;
CREATE TRIGGER trg_dashboard_updated_at
BEFORE UPDATE ON public.dashboard
FOR EACH ROW
EXECUTE FUNCTION public.set_row_updated_at();

DROP TRIGGER IF EXISTS trg_dashboard_widget_updated_at ON public.dashboard_widget;
CREATE TRIGGER trg_dashboard_widget_updated_at
BEFORE UPDATE ON public.dashboard_widget
FOR EACH ROW
EXECUTE FUNCTION public.set_row_updated_at();

DROP TRIGGER IF EXISTS trg_dashboard_widget_query_updated_at ON public.dashboard_widget_query;
CREATE TRIGGER trg_dashboard_widget_query_updated_at
BEFORE UPDATE ON public.dashboard_widget_query
FOR EACH ROW
EXECUTE FUNCTION public.set_row_updated_at();

DROP TRIGGER IF EXISTS trg_dashboard_filter_updated_at ON public.dashboard_filter;
CREATE TRIGGER trg_dashboard_filter_updated_at
BEFORE UPDATE ON public.dashboard_filter
FOR EACH ROW
EXECUTE FUNCTION public.set_row_updated_at();

ALTER TABLE public.dashboard
  ADD COLUMN IF NOT EXISTS menu_id integer;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'fk_dashboard_menu_id'
  ) THEN
    ALTER TABLE public.dashboard
      ADD CONSTRAINT fk_dashboard_menu_id
      FOREIGN KEY (menu_id) REFERENCES public.m0_menu(id);
  END IF;
END;
$$;

CREATE UNIQUE INDEX IF NOT EXISTS uq_dashboard_menu_id
  ON public.dashboard (menu_id)
  WHERE menu_id IS NOT NULL;

ALTER TABLE public.dashboard_widget
  ADD COLUMN IF NOT EXISTS span_class_name text,
  ADD COLUMN IF NOT EXISTS widget_order integer NOT NULL DEFAULT 100;

ALTER TABLE public.dashboard_widget
  DROP COLUMN IF EXISTS sort_order;

CREATE INDEX IF NOT EXISTS idx_dashboard_widget_layout
  ON public.dashboard_widget (dashboard_id, is_active, widget_order);

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'dashboard_widget_query_widget_id_fkey'
  ) THEN
    ALTER TABLE public.dashboard_widget_query
      DROP CONSTRAINT dashboard_widget_query_widget_id_fkey;
  END IF;

  ALTER TABLE public.dashboard_widget_query
    ADD CONSTRAINT dashboard_widget_query_widget_id_fkey
    FOREIGN KEY (widget_id) REFERENCES public.dashboard_widget(widget_id) ON DELETE CASCADE;
END;
$$;

WITH upsert_dashboard AS (
  INSERT INTO public.dashboard (
    menu_id,
    dashboard_key,
    title,
    short_label,
    description,
    icon_name,
    status,
    layout_config,
    default_filter_values,
    is_active,
    created_by,
    updated_by
  )
  VALUES (
    (SELECT id FROM public.m0_menu WHERE key = 'logistic-dashboard-warehouse' LIMIT 1),
    'warehouse-operations',
    'Dashboard Warehouse',
    'Warehouse',
    'Dashboard operasional warehouse untuk monitoring health, stock flow, coverage, rack utilization, dock queue, dan activity watchlist.',
    'Warehouse',
    'active',
    '{"columns":12,"defaultView":"dashboard"}'::jsonb,
    '{"period":"Maret 2026","region":"Semua Region","warehouse":"Semua Warehouse"}'::jsonb,
    true,
    'codex',
    'codex'
  )
  ON CONFLICT (dashboard_key) DO UPDATE
  SET menu_id = EXCLUDED.menu_id,
      title = EXCLUDED.title,
      short_label = EXCLUDED.short_label,
      description = EXCLUDED.description,
      icon_name = EXCLUDED.icon_name,
      status = EXCLUDED.status,
      layout_config = EXCLUDED.layout_config,
      default_filter_values = EXCLUDED.default_filter_values,
      is_active = EXCLUDED.is_active
  RETURNING dashboard_id
)
INSERT INTO public.dashboard_filter (
  dashboard_id,
  filter_key,
  label,
  filter_type,
  data_type,
  source_type,
  source_query,
  static_options,
  placeholder,
  query_param_name,
  default_value,
  sort_order,
  is_active
)
SELECT
  dashboard_id,
  filter_key,
  label,
  filter_type,
  data_type,
  source_type,
  source_query,
  static_options,
  placeholder,
  query_param_name,
  default_value,
  sort_order,
  true
FROM upsert_dashboard
CROSS JOIN (
  VALUES
    ('period', 'Period', 'select', 'text', 'static', NULL, '["Maret 2026","Februari 2026","Januari 2026"]'::jsonb, 'Pilih period', 'period', '"Maret 2026"'::jsonb, 10),
    ('region', 'Region', 'select', 'text', 'static', NULL, '["Semua Region","Jabodetabek","Jawa Timur","Sumatera"]'::jsonb, 'Pilih region', 'region', '"Semua Region"'::jsonb, 20),
    (
      'warehouse',
      'Warehouse',
      'select',
      'text',
      'query',
      $sql$
        SELECT warehouse_name
        FROM (
          SELECT DISTINCT warehouse_name
          FROM public.dim_item_warehouse_stock
          WHERE warehouse_name IS NOT NULL
          UNION ALL
          SELECT 'Semua Warehouse'
        ) src
        ORDER BY CASE WHEN warehouse_name = 'Semua Warehouse' THEN 0 ELSE 1 END, warehouse_name
      $sql$,
      '[]'::jsonb,
      'Pilih warehouse',
      'warehouse',
      '"Semua Warehouse"'::jsonb,
      30
    )
) AS filters(
  filter_key,
  label,
  filter_type,
  data_type,
  source_type,
  source_query,
  static_options,
  placeholder,
  query_param_name,
  default_value,
  sort_order
)
ON CONFLICT (dashboard_id, filter_key) DO UPDATE
SET label = EXCLUDED.label,
    filter_type = EXCLUDED.filter_type,
    data_type = EXCLUDED.data_type,
    source_type = EXCLUDED.source_type,
    source_query = EXCLUDED.source_query,
    static_options = EXCLUDED.static_options,
    placeholder = EXCLUDED.placeholder,
    query_param_name = EXCLUDED.query_param_name,
    default_value = EXCLUDED.default_value,
    sort_order = EXCLUDED.sort_order,
    is_active = EXCLUDED.is_active;

WITH target_dashboard AS (
  SELECT dashboard_id
  FROM public.dashboard
  WHERE dashboard_key = 'warehouse-operations'
)
INSERT INTO public.dashboard_widget (
  dashboard_id,
  widget_key,
  title,
  short_label,
  description,
  widget_kind,
  chart_type,
  source_table,
  result_kind,
  ui_config,
  filter_binding,
  empty_state,
  span_class_name,
  widget_order,
  is_active
)
SELECT
  dashboard_id,
  widget_key,
  title,
  short_label,
  description,
  widget_kind,
  chart_type,
  source_table,
  result_kind,
  ui_config,
  filter_binding,
  empty_state,
  span_class_name,
  widget_order,
  true
FROM target_dashboard
CROSS JOIN (
  VALUES
    ('warehouse-kpi-grid', 'Warehouse KPIs', 'KPIs', 'Ringkasan KPI warehouse.', 'summary', NULL, 'public.dim_warehouse', 'mixed', '{"component":"KpiGrid"}'::jsonb, '["period","region","warehouse"]'::jsonb, 'Belum ada KPI warehouse.', 'lg:col-span-12', 10),
    ('warehouse-health-status', 'Warehouse Health Status', 'Health', 'Distribusi status warehouse.', 'chart', 'pie', 'public.dim_warehouse', 'categorical', '{"component":"OrderStatusCard"}'::jsonb, '["period","region","warehouse"]'::jsonb, 'Belum ada health status.', 'lg:col-span-4', 20),
    ('warehouse-inbound-outbound', 'Inbound vs Outbound', 'Inbound/Outbound', 'Perbandingan inbound dan outbound harian.', 'chart', 'stacked_bar', 'public.obt_inventory_document_event', 'time_series', '{"component":"OpenCloseBarCard"}'::jsonb, '["period","region","warehouse"]'::jsonb, 'Belum ada inbound/outbound.', 'lg:col-span-4', 30),
    ('warehouse-occupancy-distribution', 'Occupancy Distribution', 'Occupancy', 'Distribusi occupancy per bucket.', 'chart', 'bar', 'public.dim_item_warehouse_stock', 'categorical', '{"component":"TopAgingCard","axisMax":8,"ticks":[0,1,2,3,4,5,6,7,8]}'::jsonb, '["period","region","warehouse"]'::jsonb, 'Belum ada occupancy.', 'lg:col-span-4', 40),
    ('warehouse-flow-stock-trend', 'Warehouse Flow & Stock Trend', 'Flow Trend', 'Trend inbound, outbound, dan stock.', 'chart', 'line', 'public.obt_inventory_movement_line', 'time_series', '{"component":"TimeseriesCard","chartHeightClass":"h-[320px]","legendAlign":"center"}'::jsonb, '["period","region","warehouse"]'::jsonb, 'Belum ada trend warehouse.', 'lg:col-span-8', 50),
    ('warehouse-top-utilization', 'Top Warehouse Utilization', 'Utilization', 'Top warehouse by utilization.', 'list', NULL, 'public.dim_item_warehouse_stock', 'categorical', '{"component":"TopAmountCard"}'::jsonb, '["period","region","warehouse"]'::jsonb, 'Belum ada utilization ranking.', 'lg:col-span-4', 60),
    ('warehouse-inventory-coverage', 'Inventory Coverage', 'Coverage', 'Coverage barang utama warehouse.', 'list', NULL, 'public.dim_item_warehouse_stock', 'categorical', '{"component":"InventoryCoverageCard","maxDays":30}'::jsonb, '["period","region","warehouse"]'::jsonb, 'Belum ada coverage.', 'lg:col-span-5', 70),
    ('warehouse-alerts-actions', 'Warehouse Alerts & Actions', 'Alerts', 'Alert operasional warehouse.', 'list', NULL, 'public.obt_inventory_movement_line', 'table', '{"component":"WarehouseAlertCard"}'::jsonb, '["period","region","warehouse"]'::jsonb, 'Belum ada alert warehouse.', 'lg:col-span-7', 80),
    ('warehouse-rack-utilization-heatmap', 'Rack Utilization Heatmap', 'Rack Utilization', 'Utilisasi rack/zone warehouse.', 'chart', 'heatmap', 'public.dim_item_warehouse_stock', 'categorical', '{"component":"RackUtilizationCard"}'::jsonb, '["period","region","warehouse"]'::jsonb, 'Belum ada rack utilization.', 'lg:col-span-5', 90),
    ('warehouse-inventory-movement-summary', 'Inventory Movement Summary', 'Movement Summary', 'Ringkasan inventory movement.', 'metric', NULL, 'public.obt_inventory_movement_line', 'mixed', '{"component":"InventoryMovementCard"}'::jsonb, '["period","region","warehouse"]'::jsonb, 'Belum ada movement summary.', 'lg:col-span-7', 100),
    ('warehouse-dock-queue-widget', 'Inbound / Outbound Dock Queue', 'Dock Queue', 'Queue inbound/outbound untuk warehouse.', 'table', NULL, 'public.obt_inventory_document_event', 'table', '{"component":"DockQueueCard"}'::jsonb, '["period","region","warehouse"]'::jsonb, 'Belum ada dock queue.', 'lg:col-span-12', 110),
    ('warehouse-batch-aging-risk', 'Batch Aging Risk', 'Aging Risk', 'Distribusi batch aging risk.', 'chart', 'bar', 'public.obt_inventory_movement_line', 'categorical', '{"component":"TopAgingCard","axisMax":20,"ticks":[0,5,10,15,20]}'::jsonb, '["period","region","warehouse"]'::jsonb, 'Belum ada aging risk.', 'lg:col-span-4', 120),
    ('warehouse-activity-watchlist', 'Warehouse Activity Watchlist', 'Watchlist', 'Aktivitas warehouse yang perlu diawasi.', 'table', NULL, 'public.obt_inventory_document_event', 'table', '{"component":"OutstandingOverdueTableCard","actionLabel":"Lihat Detail","overdueLabel":"aktivitas"}'::jsonb, '["period","region","warehouse"]'::jsonb, 'Belum ada activity watchlist.', 'lg:col-span-8', 130)
) AS widgets(
  widget_key,
  title,
  short_label,
  description,
  widget_kind,
  chart_type,
  source_table,
  result_kind,
  ui_config,
  filter_binding,
  empty_state,
  span_class_name,
  widget_order
)
ON CONFLICT (dashboard_id, widget_key) DO UPDATE
SET title = EXCLUDED.title,
    short_label = EXCLUDED.short_label,
    description = EXCLUDED.description,
    widget_kind = EXCLUDED.widget_kind,
    chart_type = EXCLUDED.chart_type,
    source_table = EXCLUDED.source_table,
    result_kind = EXCLUDED.result_kind,
    ui_config = EXCLUDED.ui_config,
    filter_binding = EXCLUDED.filter_binding,
    empty_state = EXCLUDED.empty_state,
    span_class_name = EXCLUDED.span_class_name,
    widget_order = EXCLUDED.widget_order,
    is_active = EXCLUDED.is_active;

WITH target_dashboard AS (
  SELECT dashboard_id
  FROM public.dashboard
  WHERE dashboard_key = 'warehouse-operations'
),
target_widgets AS (
  SELECT widget_id, widget_key
  FROM public.dashboard_widget
  WHERE dashboard_id = (SELECT dashboard_id FROM target_dashboard)
)
INSERT INTO public.dashboard_widget_query (
  widget_id,
  query_key,
  label,
  purpose,
  sql_template,
  count_sql,
  query_params,
  output_columns,
  default_limit,
  is_active
)
SELECT
  widget_id,
  query_key,
  label,
  purpose,
  sql_template,
  count_sql,
  query_params,
  output_columns,
  default_limit,
  true
FROM target_widgets
JOIN (
  VALUES
    (
      'warehouse-kpi-grid',
      'warehouse-kpi-main',
      'Warehouse KPI Query',
      'Menghasilkan 6 KPI utama warehouse.',
      $sql$
        WITH warehouse_scope AS (
          SELECT *
          FROM public.dim_warehouse w
          WHERE (
            COALESCE({{warehouse}}, '') = ''
            OR {{warehouse}} = 'Semua Warehouse'
            OR w.warehouse_name = {{warehouse}}
          )
        ),
        stock_scope AS (
          SELECT *
          FROM public.dim_item_warehouse_stock s
          WHERE (
            COALESCE({{warehouse}}, '') = ''
            OR {{warehouse}} = 'Semua Warehouse'
            OR s.warehouse_name = {{warehouse}}
          )
        ),
        movement_scope AS (
          SELECT *
          FROM public.obt_inventory_movement_line m
          WHERE (
            COALESCE({{warehouse}}, '') = ''
            OR {{warehouse}} = 'Semua Warehouse'
            OR COALESCE(m.location_name, m.branch_name, '') = {{warehouse}}
          )
        )
        SELECT *
        FROM (
          SELECT 'Total Warehouse Active' AS title, COUNT(*)::text AS value, 'warehouse' AS unit FROM warehouse_scope
          UNION ALL
          SELECT 'Stock On Hand', COALESCE(ROUND(SUM(COALESCE(current_stock, 0)), 2), 0)::text, 'qty' FROM stock_scope
          UNION ALL
          SELECT
            'Warehouse Utilization',
            COALESCE(
              ROUND(
                100.0 * COUNT(DISTINCT CASE WHEN COALESCE(current_stock, 0) > 0 THEN warehouse_code END)
                / NULLIF(COUNT(DISTINCT warehouse_code), 0),
                2
              ),
              0
            )::text,
            'percent'
          FROM stock_scope
          UNION ALL
          SELECT
            'Inbound Today',
            COUNT(*)::text,
            'movement'
          FROM movement_scope
          WHERE COALESCE(qty, 0) > 0
            OR source_doc_type IN ('RS_LINE')
          UNION ALL
          SELECT
            'Outbound Today',
            COUNT(*)::text,
            'movement'
          FROM movement_scope
          WHERE COALESCE(qty, 0) < 0
            OR source_doc_type IN ('MR_LINE', 'TS_LINE', 'SP_LINE')
          UNION ALL
          SELECT 'Zero Stock Items', COUNT(*)::text, 'item' FROM stock_scope WHERE COALESCE(current_stock, 0) <= 0
        ) kpi
      $sql$,
      NULL,
      '[{"key":"warehouse","type":"text"}]'::jsonb,
      '["title","value","unit"]'::jsonb,
      10
    ),
    (
      'warehouse-health-status',
      'warehouse-health-status-main',
      'Warehouse Health Status Query',
      'Distribusi warehouse per health status.',
      $sql$
        SELECT
          CASE
            WHEN COALESCE(is_active, 0) = 1 AND COALESCE(booking_stock_enabled, 0) = 1 THEN 'active-booking'
            WHEN COALESCE(is_active, 0) = 1 THEN 'active'
            ELSE 'inactive'
          END AS status_key,
          CASE
            WHEN COALESCE(is_active, 0) = 1 AND COALESCE(booking_stock_enabled, 0) = 1 THEN 'Active Booking'
            WHEN COALESCE(is_active, 0) = 1 THEN 'Active'
            ELSE 'Inactive'
          END AS label,
          COUNT(*) AS value
        FROM public.dim_warehouse
        WHERE (
          COALESCE({{warehouse}}, '') = ''
          OR {{warehouse}} = 'Semua Warehouse'
          OR warehouse_name = {{warehouse}}
        )
        GROUP BY 1, 2
        ORDER BY value DESC, label ASC
      $sql$,
      NULL,
      '[{"key":"warehouse","type":"text"}]'::jsonb,
      '["status_key","label","value"]'::jsonb,
      20
    ),
    (
      'warehouse-flow-stock-trend',
      'warehouse-flow-stock-trend-main',
      'Warehouse Flow Trend Query',
      'Trend harian inbound, outbound, dan stock.',
      $sql$
        WITH movement_daily AS (
          SELECT
            doc_date::date AS metric_date,
            SUM(
              CASE
                WHEN COALESCE(qty, 0) > 0 OR source_doc_type IN ('RS_LINE') THEN ABS(COALESCE(qty, 0))
                ELSE 0
              END
            ) AS inbound,
            SUM(
              CASE
                WHEN COALESCE(qty, 0) < 0 OR source_doc_type IN ('MR_LINE', 'TS_LINE', 'SP_LINE') THEN ABS(COALESCE(qty, 0))
                ELSE 0
              END
            ) AS outbound
          FROM public.obt_inventory_movement_line
          WHERE (
            COALESCE({{warehouse}}, '') = ''
            OR {{warehouse}} = 'Semua Warehouse'
            OR COALESCE(location_name, branch_name) = {{warehouse}}
          )
          GROUP BY 1
        ),
        stock_daily AS (
          SELECT
            CURRENT_DATE AS metric_date,
            SUM(COALESCE(current_stock, 0)) AS stock
          FROM public.dim_item_warehouse_stock
          WHERE (
            COALESCE({{warehouse}}, '') = ''
            OR {{warehouse}} = 'Semua Warehouse'
            OR warehouse_name = {{warehouse}}
          )
        )
        SELECT
          movement_daily.metric_date,
          ROUND(COALESCE(movement_daily.inbound, 0), 2) AS inbound,
          ROUND(COALESCE(movement_daily.outbound, 0), 2) AS outbound,
          ROUND(COALESCE(stock_daily.stock, 0), 2) AS stock
        FROM movement_daily
        LEFT JOIN stock_daily ON stock_daily.metric_date = movement_daily.metric_date
        ORDER BY movement_daily.metric_date ASC
        LIMIT COALESCE({{limit}}, 31)
      $sql$,
      NULL,
      '[{"key":"warehouse","type":"text"},{"key":"limit","type":"integer"}]'::jsonb,
      '["metric_date","inbound","outbound","stock"]'::jsonb,
      31
    ),
    (
      'warehouse-top-utilization',
      'warehouse-top-utilization-main',
      'Top Utilization Query',
      'Top warehouse berdasarkan utilization.',
      $sql$
        WITH warehouse_stock AS (
          SELECT
            warehouse_code,
            warehouse_name,
            SUM(COALESCE(current_stock, 0)) AS stock_qty
          FROM public.dim_item_warehouse_stock
          WHERE warehouse_name IS NOT NULL
          GROUP BY 1, 2
        ),
        total_stock AS (
          SELECT SUM(stock_qty) AS total_qty
          FROM warehouse_stock
        )
        SELECT
          ws.warehouse_code,
          ws.warehouse_name,
          ROUND(100.0 * ws.stock_qty / NULLIF(ts.total_qty, 0), 2) AS utilization_pct
        FROM warehouse_stock ws
        CROSS JOIN total_stock ts
        ORDER BY utilization_pct DESC, warehouse_name ASC
        LIMIT COALESCE({{limit}}, 10)
      $sql$,
      NULL,
      '[{"key":"limit","type":"integer"}]'::jsonb,
      '["warehouse_code","warehouse_name","utilization_pct"]'::jsonb,
      10
    ),
    (
      'warehouse-inventory-coverage',
      'warehouse-inventory-coverage-main',
      'Inventory Coverage Query',
      'Coverage item per warehouse.',
      $sql$
        WITH stock_scope AS (
          SELECT
            s.item_id,
            s.item_code,
            s.item_name,
            s.warehouse_name,
            COALESCE(s.current_stock, 0) AS qty_on_hand
          FROM public.dim_item_warehouse_stock s
          WHERE (
            COALESCE({{warehouse}}, '') = ''
            OR {{warehouse}} = 'Semua Warehouse'
            OR s.warehouse_name = {{warehouse}}
          )
        ),
        outbound_30d AS (
          SELECT
            NULLIF(m.item_id, '')::bigint AS item_id,
            SUM(ABS(COALESCE(m.qty, 0))) AS outbound_qty_30d
          FROM public.obt_inventory_movement_line m
          WHERE m.doc_date >= CURRENT_DATE - INTERVAL '30 days'
            AND COALESCE(m.qty, 0) < 0
            AND NULLIF(m.item_id, '') IS NOT NULL
          GROUP BY 1
        )
        SELECT
          s.item_code,
          s.item_name,
          s.warehouse_name,
          ROUND(
            CASE
              WHEN COALESCE(o.outbound_qty_30d, 0) <= 0 THEN 999
              ELSE s.qty_on_hand / (o.outbound_qty_30d / 30.0)
            END,
            2
          ) AS coverage_days,
          ROUND(s.qty_on_hand, 2) AS qty_on_hand
        FROM stock_scope s
        LEFT JOIN outbound_30d o
          ON o.item_id = s.item_id
        ORDER BY coverage_days ASC, qty_on_hand ASC
        LIMIT COALESCE({{limit}}, 20)
      $sql$,
      NULL,
      '[{"key":"warehouse","type":"text"},{"key":"limit","type":"integer"}]'::jsonb,
      '["item_code","item_name","warehouse_name","coverage_days","qty_on_hand"]'::jsonb,
      20
    ),
    (
      'warehouse-dock-queue-widget',
      'warehouse-dock-queue-main',
      'Dock Queue Query',
      'Antrian dokumen inbound/outbound terbaru.',
      $sql$
        SELECT
          doc_no,
          doc_date::date AS doc_date,
          source_doc_type,
          COALESCE(warehouse_to_name, warehouse_from_name, location_name, branch_name) AS warehouse_name,
          CASE
            WHEN source_doc_type IN ('RS', 'IB') THEN 'IN'
            WHEN source_doc_type IN ('MR', 'TS', 'SP') THEN 'OUT'
            ELSE 'MIXED'
          END AS movement_direction,
          NULL::numeric(20,2) AS qty
        FROM public.obt_inventory_document_event
        WHERE (
          COALESCE({{warehouse}}, '') = ''
          OR {{warehouse}} = 'Semua Warehouse'
          OR COALESCE(warehouse_to_name, warehouse_from_name, location_name, branch_name) = {{warehouse}}
        )
        ORDER BY doc_date DESC, doc_no DESC
        LIMIT COALESCE({{limit}}, 20)
      $sql$,
      NULL,
      '[{"key":"warehouse","type":"text"},{"key":"limit","type":"integer"}]'::jsonb,
      '["doc_no","doc_date","source_doc_type","warehouse_name","movement_direction","qty"]'::jsonb,
      20
    )
) AS queries(
  widget_key,
  query_key,
  label,
  purpose,
  sql_template,
  count_sql,
  query_params,
  output_columns,
  default_limit
)
ON target_widgets.widget_key = queries.widget_key
ON CONFLICT (widget_id, query_key) DO UPDATE
SET label = EXCLUDED.label,
    purpose = EXCLUDED.purpose,
    sql_template = EXCLUDED.sql_template,
    count_sql = EXCLUDED.count_sql,
    query_params = EXCLUDED.query_params,
    output_columns = EXCLUDED.output_columns,
    default_limit = EXCLUDED.default_limit,
    is_active = EXCLUDED.is_active;

-- Query: list dashboard page per menu.
--
-- SELECT
--   m.id AS menu_id,
--   m.key AS menu_key,
--   m.title AS menu_title,
--   d.dashboard_id,
--   d.dashboard_key,
--   d.title AS dashboard_title,
--   m.path AS route_path,
--   d.status,
--   d.is_active
-- FROM public.dashboard d
-- JOIN public.m0_menu m
--   ON m.id = d.menu_id
-- WHERE d.is_active = true
-- ORDER BY m.sort_order, m.id;

-- Query: list widgets inside one dashboard page.
--
-- SELECT
--   d.dashboard_key,
--   w.widget_id,
--   w.widget_key,
--   w.title AS widget_title,
--   w.widget_kind,
--   w.chart_type,
--   w.span_class_name,
--   w.widget_order,
--   w.source_table,
--   w.ui_config
-- FROM public.dashboard d
-- JOIN public.dashboard_widget w
--   ON w.dashboard_id = d.dashboard_id
--  AND w.is_active = true
-- WHERE d.dashboard_key = 'warehouse-operations'
--   AND d.is_active = true
-- ORDER BY w.widget_order, w.widget_key;

-- Query: list filter dashboard page.
--
-- SELECT
--   filter_key,
--   label,
--   filter_type,
--   source_type,
--   static_options,
--   source_query,
--   default_value,
--   sort_order
-- FROM public.dashboard_filter f
-- JOIN public.dashboard d
--   ON d.dashboard_id = f.dashboard_id
-- WHERE d.dashboard_key = 'warehouse-operations'
--   AND f.is_active = true
-- ORDER BY f.sort_order, f.filter_key;
