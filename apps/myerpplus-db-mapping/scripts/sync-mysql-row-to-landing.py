#!/usr/bin/env python3
"""Sync a single MySQL source row into PostgreSQL landing by primary key."""

from __future__ import annotations

import argparse
import importlib.util
import re
from pathlib import Path


ROOT = Path("/opt/sentient-factory")
BOOTSTRAP_PATH = ROOT / "apps" / "myerpplus-db-mapping" / "scripts" / "bootstrap-obt-landing.py"
OBT_SQL_DIR = ROOT / "apps" / "myerpplus-db-mapping" / "db" / "obt-physical-sql" / "pgsql-tables"

DOMAIN_OBT_FILES = {
    "m0": [
        "pg_insert_obt_admin_access.sql",
        "pg_insert_obt_menu_authorization.sql",
        "pg_insert_obt_system_configuration.sql",
    ],
    "m1": [
        "pg_insert_dim_contact.sql",
        "pg_insert_dim_item.sql",
    ],
    "m2": [
        "pg_insert_obt_cash_disbursement_line_flow.sql",
        "pg_insert_obt_cash_receipt_line_flow.sql",
        "pg_insert_obt_finance_allocation.sql",
        "pg_insert_obt_finance_document.sql",
        "pg_insert_obt_receipt_money_line_flow.sql",
        "pg_insert_obt_finance_document_line.sql",
    ],
    "m3": [
        "pg_insert_obt_inventory_movement_line.sql",
    ],
    "m4": [
        "pg_insert_obt_purchase_document_line_event.sql",
        "pg_insert_obt_purchase_payment.sql",
        "pg_insert_obt_purchase_line_flow.sql",
    ],
    "m5": [
        "pg_insert_obt_sales_order_line_flow.sql",
        "pg_insert_obt_sales_receivable.sql",
        "pg_insert_obt_sales_line_flow.sql",
    ],
    "m12": [
        "pg_insert_obt_pos_to_sales.sql",
    ],
}


def load_bootstrap_module():
    spec = importlib.util.spec_from_file_location("bootstrap_obt_landing", BOOTSTRAP_PATH)
    if spec is None or spec.loader is None:
        raise RuntimeError(f"Unable to load bootstrap module from {BOOTSTRAP_PATH}")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def build_where_clause(pk_columns: list[str], pk_values: list[str], helper) -> str:
    if len(pk_columns) != len(pk_values):
        raise ValueError("Primary key column count does not match provided values.")
    return " AND ".join(
        f"`{column}` = {helper.pg_literal(value)}" for column, value in zip(pk_columns, pk_values, strict=True)
    )


def split_sql_statements(text: str) -> list[str]:
    statements: list[str] = []
    current: list[str] = []
    in_single = False
    in_double = False
    prev = ""
    for ch in text:
        if ch == "'" and not in_double and prev != "\\":
            in_single = not in_single
        elif ch == '"' and not in_single and prev != "\\":
            in_double = not in_double
        if ch == ";" and not in_single and not in_double:
            statement = "".join(current).strip()
            if statement:
                statements.append(statement)
            current = []
        else:
            current.append(ch)
        prev = ch
    tail = "".join(current).strip()
    if tail:
        statements.append(tail)
    return statements


def extract_insert_target_table(sql_text: str) -> str | None:
    match = re.search(r"INSERT\s+INTO\s+([a-zA-Z0-9_\.]+)", sql_text, re.IGNORECASE)
    if not match:
        return None
    return match.group(1).split(".")[-1]


def main() -> int:
    parser = argparse.ArgumentParser(description="Sync one MySQL row into PostgreSQL landing.")
    parser.add_argument("--table", required=True, help="Source/landing table name, e.g. m5_so")
    parser.add_argument(
        "--pk",
        nargs="+",
        required=True,
        help="Primary key values in table primary-key order, e.g. --pk 19178",
    )
    parser.add_argument(
        "--landing-schema",
        default="myerpplus_landing",
        help="Target PostgreSQL landing schema",
    )
    parser.add_argument(
        "--refresh-domain",
        choices=sorted(DOMAIN_OBT_FILES),
        help="Refresh OBT SQL files for a specific domain after landing sync",
    )
    args = parser.parse_args()

    helper = load_bootstrap_module()
    pg_runner = helper.load_pg_runner()
    mysql_url = helper.resolve_mysql_url(pg_runner)
    mysql_kwargs = helper.parse_mysql_url(mysql_url)

    pg_runner.load_env_files()
    client = pg_runner.SimplePgClient(pg_runner.resolve_database_url())
    client.connect()

    try:
        pg_columns = helper.fetch_pg_table_columns(client, args.landing_schema, args.table)
        pg_column_types = helper.fetch_pg_column_types(client, args.landing_schema, args.table)
        pk_columns = helper.fetch_pg_primary_key(client, args.landing_schema, args.table)
        if not pk_columns:
            raise RuntimeError(f"No primary key found for {args.landing_schema}.{args.table}")

        with helper.mysql_connection(mysql_kwargs) as mysql_conn:
            mysql_columns = helper.fetch_mysql_columns(mysql_conn, args.table)
            where_clause = build_where_clause(pk_columns, args.pk, helper)
            select_cols = ", ".join(f"`{column}`" for column in mysql_columns)
            sql = f"SELECT {select_cols} FROM `{args.table}` WHERE {where_clause} LIMIT 1"
            with mysql_conn.cursor() as cur:
                cur.execute(sql)
                row = cur.fetchone()

        if not row:
            raise RuntimeError(f"Source row not found in MySQL for {args.table} with PK {args.pk}")

        upsert_sql = helper.build_upsert_sql(
            schema_name=args.landing_schema,
            table_name=args.table,
            rows=[row],
            pg_columns=pg_columns,
            pg_column_types=pg_column_types,
            pk_columns=pk_columns,
        )
        if not upsert_sql:
            raise RuntimeError("Upsert SQL could not be generated.")

        client.execute(upsert_sql)
        print(f"SYNCED {args.table} PK {args.pk} -> {args.landing_schema}.{args.table}")
        print("PK columns:", pk_columns)
        for column in pk_columns:
            print(f"{column}={row.get(column)}")

        if args.refresh_domain:
            client.execute(f"SET search_path TO {args.landing_schema}, public")
            for file_name in DOMAIN_OBT_FILES[args.refresh_domain]:
                sql_path = OBT_SQL_DIR / file_name
                sql_text = sql_path.read_text()
                target_table = extract_insert_target_table(sql_text)
                if target_table:
                    client.execute(f"TRUNCATE TABLE public.{target_table}")
                for statement in split_sql_statements(sql_text):
                    client.execute(statement)
                print(f"REFRESHED {file_name}")
        return 0
    finally:
        client.close()


if __name__ == "__main__":
    raise SystemExit(main())
