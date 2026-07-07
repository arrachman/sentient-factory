#!/usr/bin/env python3
"""Read custom dashboard metadata from PostgreSQL and emit JSON."""

from __future__ import annotations

import importlib.util
import json
import os
import sys
from pathlib import Path


ROOT = Path("/opt/sentient-factory")
PG_RUNNER_PATH = ROOT / "apps" / "myerpplus-db-mapping" / "scripts" / "run-pg-obt-table-sql.py"


def load_pg_runner():
    spec = importlib.util.spec_from_file_location("pg_runner", PG_RUNNER_PATH)
    module = importlib.util.module_from_spec(spec)
    assert spec.loader is not None
    spec.loader.exec_module(module)
    return module


def main() -> int:
    dashboard_key = sys.argv[1] if len(sys.argv) > 1 else "custom-db-1"
    dashboard_key_sql = dashboard_key.replace("'", "''")
    pg_runner = load_pg_runner()
    pg_runner.load_env_files()

    if "POSTGRES_HOST" not in os.environ:
        os.environ["POSTGRES_HOST"] = "127.0.0.1"
    if "POSTGRES_PORT" not in os.environ:
        os.environ["POSTGRES_PORT"] = "3208"

    client = pg_runner.SimplePgClient(pg_runner.resolve_database_url())
    client.connect()
    try:
        cols, rows = client.query(
            f"""
            SELECT
              d.dashboard_id::text,
              d.menu_id::text,
              COALESCE(m.key, '') AS menu_key,
              COALESCE(m.path, '') AS route_path,
              d.dashboard_key,
              d.title,
              d.short_label,
              COALESCE(d.description, '') AS description,
              COALESCE(d.icon_name, '') AS icon_name,
              d.status,
              d.layout_config::text,
              d.default_filter_values::text
            FROM public.dashboard d
            LEFT JOIN public.m0_menu m ON m.id = d.menu_id
            WHERE d.dashboard_key = '{dashboard_key_sql}'
              AND d.is_active = true
            LIMIT 1
            """
        )
        if not rows:
            print(json.dumps({"success": False, "message": f"Dashboard {dashboard_key} not found."}))
            return 0

        dashboard = dict(zip(cols, rows[0]))

        widget_cols, widget_rows = client.query(
            f"""
            SELECT
              w.widget_id::text,
              w.widget_key,
              w.title,
              w.short_label,
              COALESCE(w.description, '') AS description,
              w.widget_kind,
              COALESCE(w.chart_type, '') AS chart_type,
              COALESCE(w.source_table, '') AS source_table,
              w.result_kind,
              w.ui_config::text,
              w.filter_binding::text,
              COALESCE(w.empty_state, '') AS empty_state,
              COALESCE(w.span_class_name, '') AS span_class_name,
              w.widget_order::text
            FROM public.dashboard_widget w
            JOIN public.dashboard d ON d.dashboard_id = w.dashboard_id
            WHERE d.dashboard_key = '{dashboard_key_sql}'
              AND w.is_active = true
            ORDER BY w.widget_order, w.widget_key
            """
        )

        query_cols, query_rows = client.query(
            f"""
            SELECT
              q.widget_id::text,
              q.query_key,
              q.label,
              COALESCE(q.purpose, '') AS purpose,
              q.sql_template,
              COALESCE(q.count_sql, '') AS count_sql,
              q.query_params::text,
              q.output_columns::text,
              COALESCE(q.default_limit::text, '') AS default_limit
            FROM public.dashboard_widget_query q
            JOIN public.dashboard_widget w ON w.widget_id = q.widget_id
            JOIN public.dashboard d ON d.dashboard_id = w.dashboard_id
            WHERE d.dashboard_key = '{dashboard_key_sql}'
              AND q.is_active = true
            ORDER BY q.query_key
            """
        )

        filter_cols, filter_rows = client.query(
            f"""
            SELECT
              f.filter_key,
              f.label,
              f.filter_type,
              f.data_type,
              f.source_type,
              COALESCE(f.source_table, '') AS source_table,
              COALESCE(f.source_query, '') AS source_query,
              f.static_options::text,
              COALESCE(f.placeholder, '') AS placeholder,
              f.query_param_name,
              COALESCE(f.default_value::text, 'null') AS default_value,
              COALESCE(f.depends_on_filter_key, '') AS depends_on_filter_key,
              CASE WHEN f.allows_multiple THEN 'true' ELSE 'false' END AS allows_multiple,
              CASE WHEN f.is_required THEN 'true' ELSE 'false' END AS is_required,
              f.sort_order::text
            FROM public.dashboard_filter f
            JOIN public.dashboard d ON d.dashboard_id = f.dashboard_id
            WHERE d.dashboard_key = '{dashboard_key_sql}'
              AND f.is_active = true
            ORDER BY f.sort_order, f.filter_key
            """
        )

        widgets = []
        for row in widget_rows:
            item = dict(zip(widget_cols, row))
            widget_id = item["widget_id"]
            item["ui_config"] = json.loads(item["ui_config"] or "{}")
            item["filter_binding"] = json.loads(item["filter_binding"] or "[]")
            item["sort_order"] = int(item["sort_order"] or "0")
            item["widget_order"] = int(item["widget_order"] or "0")
            item["queries"] = []
            for query_row in query_rows:
                query_item = dict(zip(query_cols, query_row))
                if query_item["widget_id"] != widget_id:
                    continue
                query_item["query_params"] = json.loads(query_item["query_params"] or "[]")
                query_item["output_columns"] = json.loads(query_item["output_columns"] or "[]")
                query_item["default_limit"] = (
                    int(query_item["default_limit"]) if query_item["default_limit"] else None
                )
                item["queries"].append(query_item)
            widgets.append(item)

        filters = []
        for row in filter_rows:
            item = dict(zip(filter_cols, row))
            item["static_options"] = json.loads(item["static_options"] or "[]")
            item["default_value"] = json.loads(item["default_value"] or "null")
            item["allows_multiple"] = item["allows_multiple"] == "true"
            item["is_required"] = item["is_required"] == "true"
            item["sort_order"] = int(item["sort_order"] or "0")
            filters.append(item)

        payload = {
            "success": True,
            "data": {
                **dashboard,
                "layout_config": json.loads(dashboard["layout_config"] or "{}"),
                "default_filter_values": json.loads(dashboard["default_filter_values"] or "{}"),
                "widgets": widgets,
                "filters": filters,
            },
        }
        print(json.dumps(payload, ensure_ascii=True))
        return 0
    finally:
        client.close()


if __name__ == "__main__":
    raise SystemExit(main())
