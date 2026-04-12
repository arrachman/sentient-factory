-- Sync active sql_template rows for dashboard_key = warehouse-operations.
-- Source tables are limited to PostgreSQL OBT dimensions/facts:
--   public.dim_warehouse
--   public.dim_item_warehouse_stock
--   public.obt_inventory_movement_line
--   public.obt_inventory_document_event

UPDATE public.dashboard_widget_query q
SET sql_template = v.sql_template
FROM (
  VALUES
    (
      'warehouse-kpi-main',
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
          SELECT 'Inbound Today', COUNT(*)::text, 'movement'
          FROM movement_scope
          WHERE COALESCE(qty, 0) > 0
            OR source_doc_type IN ('RS_LINE')
          UNION ALL
          SELECT 'Outbound Today', COUNT(*)::text, 'movement'
          FROM movement_scope
          WHERE COALESCE(qty, 0) < 0
            OR source_doc_type IN ('MR_LINE', 'TS_LINE', 'SP_LINE')
          UNION ALL
          SELECT 'Zero Stock Items', COUNT(*)::text, 'item'
          FROM stock_scope
          WHERE COALESCE(current_stock, 0) <= 0
        ) kpi
      $sql$
    ),
    (
      'warehouse-health-status-main',
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
      $sql$
    ),
    (
      'warehouse-flow-stock-trend-main',
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
            OR COALESCE(location_name, branch_name, '') = {{warehouse}}
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
      $sql$
    ),
    (
      'warehouse-top-utilization-main',
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
      $sql$
    ),
    (
      'warehouse-inventory-coverage-main',
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
      $sql$
    ),
    (
      'warehouse-dock-queue-main',
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
      $sql$
    )
) AS v(query_key, sql_template)
WHERE q.query_key = v.query_key;
