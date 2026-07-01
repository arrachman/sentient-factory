#!/usr/bin/env python3
"""Bootstrap MyERPPlus landing tables in PostgreSQL from MySQL source data."""

from __future__ import annotations

import argparse
import decimal
import importlib.util
import json
import sys
import tarfile
import urllib.request
from collections.abc import Iterable
from contextlib import contextmanager
from datetime import date, datetime, time
from pathlib import Path
from typing import Any
from urllib.parse import parse_qs, unquote, urlparse


ROOT = Path("/opt/sentient-factory")
PG_RUNNER_PATH = ROOT / "apps" / "myerpplus-db-mapping" / "scripts" / "run-pg-obt-table-sql.py"
LANDING_SQL_PATH = (
    ROOT
    / "apps"
    / "myerpplus-db-mapping"
    / "db"
    / "obt-physical-sql"
    / "pgsql-landing"
    / "pg_create_myerpplus_landing_tables.sql"
)
LANDING_M2_HISTORY_EMPTY_SQL_PATH = (
    ROOT
    / "apps"
    / "myerpplus-db-mapping"
    / "db"
    / "obt-physical-sql"
    / "pgsql-landing"
    / "pg_create_m2_history_empty_family_tables.sql"
)
LANDING_M3_SUPPLEMENTAL_SQL_PATH = (
    ROOT
    / "apps"
    / "myerpplus-db-mapping"
    / "db"
    / "obt-physical-sql"
    / "pgsql-landing"
    / "pg_create_m3_missing_tables.sql"
)
LANDING_M3_REMAINING_SQL_PATH = (
    ROOT
    / "apps"
    / "myerpplus-db-mapping"
    / "db"
    / "obt-physical-sql"
    / "pgsql-landing"
    / "pg_create_m3_remaining_empty_tables.sql"
)
LANDING_M6_M7_SUPPLEMENTAL_SQL_PATH = (
    ROOT
    / "apps"
    / "myerpplus-db-mapping"
    / "db"
    / "obt-physical-sql"
    / "pgsql-landing"
    / "pg_create_m6_m7_minimal_tables.sql"
)
LANDING_M4_M5_SUPPLEMENTAL_SQL_PATH = (
    ROOT
    / "apps"
    / "myerpplus-db-mapping"
    / "db"
    / "obt-physical-sql"
    / "pgsql-landing"
    / "pg_create_m4_m5_remaining_tables.sql"
)
DOCKER_COMPOSE_PATH = ROOT / "infra" / "docker-compose.yml"
DEFAULT_LANDING_SCHEMA = "myerpplus_landing"
SUPPLEMENTAL_M2_EMPTY_HISTORY_TABLES = {
    "m2_aj_history",
    "m2_aj_detail_history",
    "m2_bd_history",
    "m2_bd_detail_history",
    "m2_jm_history",
    "m2_jm_detail_history",
    "m2_rg_history",
    "m2_rg_detail_history",
    "m2_rgc_history",
    "m2_rgc_detail_history",
    "m2_sg_history",
    "m2_sg_detail_history",
    "m2_sgc_history",
    "m2_sgc_detail_history",
}

BOOTSTRAP_TABLES = [
    "m0_user",
    "m0_menu",
    "m0_nomor",
    "m0_role",
    "m0_role_menu",
    "m0_user_role",
    "m0_userlog",
    "m1_branch",
    "m1_class_product",
    "m1_coa",
    "m1_contact",
    "m1_contact_category",
    "m1_cost_center",
    "m1_currency",
    "m1_customer_category",
    "m1_division",
    "m1_expedition",
    "m1_bank",
    "m1_city",
    "m1_item",
    "m1_department",
    "m1_country",
    "m1_item_category",
    "m1_item_permission",
    "m1_item_stock_warehouse",
    "m1_item_transaction",
    "m1_item_type",
    "m1_location",
    "m1_material",
    "m1_merk",
    "m1_model",
    "m1_project",
    "m1_salesman_category",
    "m1_section",
    "m1_size",
    "m1_subdepartment",
    "m1_subdivision",
    "m1_supplier_category",
    "m1_tax",
    "m1_terms",
    "m1_transaction_note",
    "m1_transaction_note_detail",
    "m1_type_sa",
    "m1_unit",
    "m1_warehouse",
    "m1_province",
    "m1_other_cost",
    "m2_cd",
    "m2_cd_detail",
    "m2_cd_detail_history",
    "m2_cd_history",
    "m2_bd",
    "m2_bd_detail",
    "m2_bd_detail_history",
    "m2_bd_history",
    "m2_cr",
    "m2_cr_detail",
    "m2_cr_detail_history",
    "m2_cr_history",
    "m2_aj",
    "m2_aj_detail",
    "m2_aj_detail_history",
    "m2_aj_history",
    "m2_cb",
    "m2_cb_detail",
    "m2_cb_detail_history",
    "m2_cb_pay",
    "m2_cb_pay_history",
    "m2_cb_history",
    "m2_files",
    "m2_gj",
    "m2_gj_detail",
    "m2_gj_detail_history",
    "m2_gj_history",
    "m2_giro_list",
    "m2_jm",
    "m2_jm_detail",
    "m2_jm_detail_history",
    "m2_jm_history",
    "m2_notes",
    "m2_realization",
    "m2_rm",
    "m2_rm_pay",
    "m2_rm_pay_history",
    "m2_rm_detail",
    "m2_rm_detail_history",
    "m2_rm_history",
    "m2_rg",
    "m2_rg_detail",
    "m2_rg_detail_history",
    "m2_rg_history",
    "m2_rgc",
    "m2_rgc_detail",
    "m2_rgc_detail_history",
    "m2_rgc_history",
    "m2_sg",
    "m2_sg_detail",
    "m2_sg_detail_history",
    "m2_sg_history",
    "m2_sgc",
    "m2_sgc_detail",
    "m2_sgc_detail_history",
    "m2_sgc_history",
    "m2_sm",
    "m2_sm_detail",
    "m2_sm_detail_history",
    "m2_sm_pay",
    "m2_sm_pay_history",
    "m2_sm_history",
    "m2_transaction_journal",
    "m3_sa",
    "m3_sa_detail",
    "m3_mr",
    "m3_mr_detail",
    "m3_rs",
    "m3_rs_detail",
    "m3_sp",
    "m3_sp_detail",
    "m3_ts",
    "m3_ts_detail",
    "m4_po",
    "m4_po_detail",
    "m4_ap",
    "m4_ap_pay",
    "m4_cs",
    "m4_cs_detail",
    "m4_files",
    "m4_grn",
    "m4_grn_detail",
    "m4_notes",
    "m4_ri",
    "m4_ri_detail",
    "m4_dnr",
    "m4_dnr_detail",
    "m4_pie",
    "m4_pie_detail",
    "m4_prt",
    "m4_prt_detail",
    "m4_vp",
    "m4_vp_detail",
    "m4_vpp",
    "m4_vpp_detail",
    "m5_sq",
    "m5_sq_detail",
    "m5_so",
    "m5_so_detail",
    "m5_as",
    "m5_cl",
    "m5_files",
    "m5_ip",
    "m5_pi",
    "m5_pi_detail",
    "m5_pl",
    "m5_pl_detail",
    "m5_do",
    "m5_do_detail",
    "m5_dr",
    "m5_dr_detail",
    "m5_ic",
    "m5_ic_detail",
    "m5_pv",
    "m5_pv_detail",
    "m5_rp",
    "m5_sf",
    "m5_sf_detail",
    "m5_si",
    "m5_si_detail",
    "m5_sie",
    "m5_sie_detail",
    "m5_spa",
    "m5_spa_detail",
    "m5_rnr",
    "m5_rnr_detail",
    "m5_sr",
    "m5_sr_detail",
    "m5_notes",
    "m6_bom",
    "m6_bom_in",
    "m6_bom_out",
    "m6_mrs",
    "m6_mrs_out",
    "m6_mrn",
    "m6_mrn_out",
    "m6_pd",
    "m6_pd_in",
    "m6_pd_out",
    "m6_pdr",
    "m6_pdr_in",
    "m6_pdr_out",
    "m6_wo",
    "m6_wo_in",
    "m6_wo_out",
    "m6_wo_activity",
    "m6_wo_route_card",
    "m6_notes",
    "m6_files",
    "m7_asset",
    "m7_ar",
    "m7_ar_detail",
    "m7_aq",
    "m7_aq_detail",
    "m7_ao",
    "m7_ao_detail",
    "m7_ae",
    "m7_ae_detail",
    "m7_at",
    "m7_at_detail",
    "m7_at_pay",
    "m7_ag",
    "m7_ag_detail",
    "m7_da",
    "m7_da_detail",
    "m7_notes",
    "m7_files",
    "m_12_pos_category",
    "m_12_pos_voucher_in",
    "m_12_pos_voucher_out",
]

AUDIT_SQL = """
CREATE TABLE IF NOT EXISTS etl_bootstrap_batch_runs (
    batch_id bigserial PRIMARY KEY,
    batch_name text NOT NULL,
    source_system text NOT NULL,
    source_database text NOT NULL,
    target_database text NOT NULL,
    status text NOT NULL,
    started_at timestamptz NOT NULL DEFAULT now(),
    finished_at timestamptz,
    notes text
);

CREATE TABLE IF NOT EXISTS etl_bootstrap_table_runs (
    id bigserial PRIMARY KEY,
    batch_id bigint NOT NULL REFERENCES etl_bootstrap_batch_runs(batch_id),
    table_name text NOT NULL,
    source_row_count bigint,
    loaded_row_count bigint,
    status text NOT NULL,
    started_at timestamptz NOT NULL DEFAULT now(),
    finished_at timestamptz,
    error_message text
);
"""


def load_pg_runner():
    spec = importlib.util.spec_from_file_location("pg_runner", PG_RUNNER_PATH)
    if spec is None or spec.loader is None:
        raise RuntimeError(f"Unable to load PostgreSQL runner from {PG_RUNNER_PATH}")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def load_pymysql():
    try:
        import pymysql  # type: ignore

        return pymysql
    except ModuleNotFoundError:
        pass

    base = Path("/tmp/pymysql_src_codex")
    base.mkdir(parents=True, exist_ok=True)
    archive = base / "pymysql-1.1.2.tar.gz"
    extract_dir = base / "pymysql-1.1.2"
    if not archive.exists():
        url = (
            "https://files.pythonhosted.org/packages/f5/ae/"
            "1fe3fcd9f959efa0ebe200b8de88b5a5ce3e767e38c7ac32fb179f16a388/"
            "pymysql-1.1.2.tar.gz"
        )
        archive.write_bytes(urllib.request.urlopen(url, timeout=30).read())
    if not extract_dir.exists():
        with tarfile.open(archive) as tf:
            tf.extractall(base)

    sys.path.insert(0, str(extract_dir))
    import pymysql  # type: ignore

    return pymysql


def resolve_mysql_url(pg_runner) -> str:
    pg_runner.load_env_files()
    database_url = (
        getattr(pg_runner.os, "environ").get("MYERPPLUS_DATABASE_URL")
        or getattr(pg_runner.os, "environ").get("MYSQL_DATABASE_URL")
    )
    if database_url:
        return database_url

    compose_text = DOCKER_COMPOSE_PATH.read_text()
    for raw_line in compose_text.splitlines():
        line = raw_line.strip()
        if line.startswith("MYERPPLUS_DATABASE_URL:"):
            return line.split(":", 1)[1].strip().strip("'").strip('"')

    raise KeyError("MYERPPLUS_DATABASE_URL is not available")


def parse_mysql_url(database_url: str) -> dict[str, Any]:
    parsed = urlparse(database_url)
    if parsed.scheme not in {"mysql", "mysql+pymysql"}:
        raise ValueError("MYERPPLUS_DATABASE_URL must use mysql:// or mysql+pymysql://")

    query = parse_qs(parsed.query)
    return {
        "host": parsed.hostname or "127.0.0.1",
        "port": parsed.port or 3306,
        "user": unquote(parsed.username or ""),
        "password": unquote(parsed.password or ""),
        "database": parsed.path.lstrip("/"),
        "charset": query.get("charset", ["utf8mb4"])[0],
        "autocommit": True,
        "read_timeout": int(query.get("read_timeout", ["60"])[0]),
        "write_timeout": int(query.get("write_timeout", ["60"])[0]),
        "cursorclass": load_pymysql().cursors.DictCursor,
    }


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


def pg_literal(value: Any) -> str:
    if value is None:
        return "NULL"
    if isinstance(value, bool):
        return "TRUE" if value else "FALSE"
    if isinstance(value, (int, float)):
        return str(value)
    if isinstance(value, (datetime, date, time)):
        return "'" + value.isoformat().replace("'", "''") + "'"
    if isinstance(value, bytes):
        return "'" + value.decode(errors="replace").replace("'", "''") + "'"
    if isinstance(value, (dict, list, tuple)):
        return "'" + json.dumps(value, ensure_ascii=False, default=str).replace("'", "''") + "'"

    text = str(value)
    return "'" + text.replace("\\", "\\\\").replace("'", "''") + "'"


def fetch_pg_table_columns(client, schema_name: str, table_name: str) -> list[str]:
    sql = f"""
    SELECT column_name
    FROM information_schema.columns
    WHERE table_schema = {pg_literal(schema_name)}
      AND table_name = {pg_literal(table_name)}
    ORDER BY ordinal_position
    """
    _, rows = client.query(sql)
    return [row[0] for row in rows]


def fetch_pg_column_types(client, schema_name: str, table_name: str) -> dict[str, str]:
    sql = f"""
    SELECT column_name, data_type
    FROM information_schema.columns
    WHERE table_schema = {pg_literal(schema_name)}
      AND table_name = {pg_literal(table_name)}
    ORDER BY ordinal_position
    """
    _, rows = client.query(sql)
    return {row[0]: row[1] for row in rows}


def fetch_pg_primary_key(client, schema_name: str, table_name: str) -> list[str]:
    sql = f"""
    SELECT kcu.column_name
    FROM information_schema.table_constraints tc
    JOIN information_schema.key_column_usage kcu
      ON tc.constraint_name = kcu.constraint_name
     AND tc.table_schema = kcu.table_schema
    WHERE tc.table_schema = {pg_literal(schema_name)}
      AND tc.table_name = {pg_literal(table_name)}
      AND tc.constraint_type = 'PRIMARY KEY'
    ORDER BY kcu.ordinal_position
    """
    _, rows = client.query(sql)
    return [row[0] for row in rows]


def fetch_table_count_mysql(mysql_conn, table_name: str) -> int:
    with mysql_conn.cursor() as cur:
        cur.execute(f"SELECT COUNT(*) AS total FROM `{table_name}`")
        row = cur.fetchone()
    return int(row["total"])


def fetch_mysql_columns(mysql_conn, table_name: str) -> list[str]:
    with mysql_conn.cursor() as cur:
        cur.execute(f"SHOW COLUMNS FROM `{table_name}`")
        return [row["Field"] for row in cur.fetchall()]


def execute_pg_statements(client, statements: Iterable[str]) -> None:
    for statement in statements:
        client.execute(statement)


def insert_batch_run(client, batch_name: str, source_db: str, target_db: str) -> int:
    sql = f"""
    INSERT INTO etl_bootstrap_batch_runs (
        batch_name, source_system, source_database, target_database, status
    ) VALUES (
        {pg_literal(batch_name)},
        'myerpplus',
        {pg_literal(source_db)},
        {pg_literal(target_db)},
        'running'
    )
    RETURNING batch_id
    """
    _, rows = client.query(sql)
    return int(rows[0][0])


def finish_batch_run(client, batch_id: int, status: str, notes: str | None = None) -> None:
    sql = f"""
    UPDATE etl_bootstrap_batch_runs
    SET status = {pg_literal(status)},
        finished_at = now(),
        notes = {pg_literal(notes)}
    WHERE batch_id = {batch_id}
    """
    client.execute(sql)


def insert_table_run(client, batch_id: int, table_name: str) -> int:
    sql = f"""
    INSERT INTO etl_bootstrap_table_runs (
        batch_id, table_name, status
    ) VALUES (
        {batch_id},
        {pg_literal(table_name)},
        'running'
    )
    RETURNING id
    """
    _, rows = client.query(sql)
    if not rows:
        return 0
    return int(rows[0][0])


def finish_table_run(
    client,
    run_id: int,
    source_row_count: int | None,
    loaded_row_count: int | None,
    status: str,
    error_message: str | None = None,
) -> None:
    if run_id == 0:
        return
    sql = f"""
    UPDATE etl_bootstrap_table_runs
    SET source_row_count = {pg_literal(source_row_count)},
        loaded_row_count = {pg_literal(loaded_row_count)},
        status = {pg_literal(status)},
        finished_at = now(),
        error_message = {pg_literal(error_message)}
    WHERE id = {run_id}
    """
    client.execute(sql)


@contextmanager
def mysql_connection(mysql_kwargs: dict[str, Any]):
    pymysql = load_pymysql()
    conn = pymysql.connect(**mysql_kwargs)
    try:
        yield conn
    finally:
        conn.close()


def build_upsert_sql(
    schema_name: str,
    table_name: str,
    rows: list[dict[str, Any]],
    pg_columns: list[str],
    pg_column_types: dict[str, str],
    pk_columns: list[str],
) -> str:
    if not rows:
        return ""

    data_columns = [col for col in pg_columns if not col.startswith("_cdc_")]
    insert_columns = data_columns + [
        "_cdc_record_key",
        "_cdc_source_table",
        "_cdc_updated_at",
        "_cdc_deleted",
        "_cdc_payload",
    ]

    values_sql: list[str] = []
    for row in rows:
        record_key = "|".join(str(row.get(pk)) for pk in pk_columns)
        payload = {key: row.get(key) for key in data_columns if key in row}
        values = [normalize_pg_value(row.get(col), pg_column_types.get(col, "text")) for col in data_columns]
        values.extend(
            [
                record_key,
                f"bootstrap.myerpplus.{table_name}",
                None,
                False,
                payload,
            ]
        )
        values_sql.append("(" + ", ".join(pg_literal(value) for value in values) + ")")

    update_columns = [col for col in insert_columns if col not in pk_columns]
    update_sql = ", ".join(f"{col} = EXCLUDED.{col}" for col in update_columns)

    return (
        f"INSERT INTO {schema_name}.{table_name} ({', '.join(insert_columns)})\n"
        f"VALUES\n  " + ",\n  ".join(values_sql) + "\n"
        f"ON CONFLICT ({', '.join(pk_columns)}) DO UPDATE SET {update_sql}"
    )


def normalize_pg_value(value: Any, data_type: str) -> Any:
    if value is None:
        return None
    if data_type in {"timestamp with time zone", "timestamp without time zone", "date"}:
        if isinstance(value, (int, float)):
            return None
    if isinstance(value, str):
        stripped = value.strip()
        if stripped == "":
            if data_type not in {"text", "character varying"}:
                return None
            return value
        if data_type in {"timestamp with time zone", "timestamp without time zone", "date"}:
            if stripped in {"0000-00-00", "0000-00-00 00:00:00"}:
                return None
        if data_type == "bigint":
            try:
                parsed = int(decimal.Decimal(stripped))
            except Exception:
                return None
            limit = 9223372036854775807
            if abs(parsed) > limit:
                return None
            return parsed
        if data_type in {"numeric", "double precision", "real"}:
            try:
                parsed = decimal.Decimal(stripped)
            except Exception:
                return None
            if abs(parsed) >= decimal.Decimal("1e14"):
                return None
            if data_type == "numeric":
                return format(parsed, "f")
            return float(parsed)
    return value


def fetch_mysql_rows(
    mysql_conn,
    table_name: str,
    columns: list[str],
    pk_columns: list[str],
    offset: int,
    limit: int,
) -> list[dict[str, Any]]:
    select_cols = ", ".join(f"`{column}`" for column in columns)
    order_by = ", ".join(f"`{column}`" for column in pk_columns)
    sql = f"SELECT {select_cols} FROM `{table_name}` ORDER BY {order_by} LIMIT {limit} OFFSET {offset}"
    with mysql_conn.cursor() as cur:
        cur.execute(sql)
        return list(cur.fetchall())


def qualify_landing_sql(text: str, schema_name: str) -> str:
    prefix = "CREATE TABLE IF NOT EXISTS "
    statements = split_sql_statements(text)
    qualified: list[str] = [f"CREATE SCHEMA IF NOT EXISTS {schema_name}"]
    for statement in statements:
        if prefix in statement:
            qualified.append(statement.replace(prefix, f"{prefix}{schema_name}.", 1))
        else:
            qualified.append(statement)
    return ";\n".join(qualified) + ";"


def run_create_landing(client, schema_name: str) -> None:
    statements = split_sql_statements(qualify_landing_sql(LANDING_SQL_PATH.read_text(), schema_name))
    filtered: list[str] = []
    for statement in statements:
        lowered = statement.lower()
        if any(f"{schema_name}.{table}".lower() in lowered for table in SUPPLEMENTAL_M2_EMPTY_HISTORY_TABLES):
            continue
        filtered.append(statement)
    execute_pg_statements(client, filtered)
    if LANDING_M2_HISTORY_EMPTY_SQL_PATH.exists():
        execute_pg_statements(client, split_sql_statements(LANDING_M2_HISTORY_EMPTY_SQL_PATH.read_text()))
    if LANDING_M3_SUPPLEMENTAL_SQL_PATH.exists():
        execute_pg_statements(client, split_sql_statements(LANDING_M3_SUPPLEMENTAL_SQL_PATH.read_text()))
    if LANDING_M3_REMAINING_SQL_PATH.exists():
        execute_pg_statements(client, split_sql_statements(LANDING_M3_REMAINING_SQL_PATH.read_text()))
    if LANDING_M6_M7_SUPPLEMENTAL_SQL_PATH.exists():
        execute_pg_statements(client, split_sql_statements(LANDING_M6_M7_SUPPLEMENTAL_SQL_PATH.read_text()))
    if LANDING_M4_M5_SUPPLEMENTAL_SQL_PATH.exists():
        execute_pg_statements(client, split_sql_statements(LANDING_M4_M5_SUPPLEMENTAL_SQL_PATH.read_text()))
    execute_pg_statements(client, split_sql_statements(AUDIT_SQL))


def run_full_load(
    client,
    mysql_kwargs: dict[str, Any],
    tables: list[str],
    batch_size: int,
    schema_name: str,
) -> None:
    source_db = mysql_kwargs["database"]
    _, rows = client.query("SELECT current_database()")
    target_db = rows[0][0] if rows else "unknown"
    batch_id = insert_batch_run(client, "obt-bootstrap-full-load", source_db, target_db)
    try:
        with mysql_connection(mysql_kwargs) as mysql_conn:
            for table_name in tables:
                client.close()
                client.connect()
                try:
                    run_id = insert_table_run(client, batch_id, table_name)
                except Exception as exc:
                    print(f"audit insert skipped for {table_name}: {exc}", file=sys.stderr)
                    run_id = 0
                source_count: int | None = None
                loaded_count = 0
                skipped_count = 0
                skipped_log_count = 0
                try:
                    pg_columns = fetch_pg_table_columns(client, schema_name, table_name)
                    if not pg_columns:
                        raise RuntimeError(
                            f"Landing table {schema_name}.{table_name} does not exist in PostgreSQL"
                        )
                    pg_column_types = fetch_pg_column_types(client, schema_name, table_name)
                    pk_columns = fetch_pg_primary_key(client, schema_name, table_name)
                    if not pk_columns:
                        raise RuntimeError(
                            f"Landing table {schema_name}.{table_name} does not expose a primary key"
                        )
                    mysql_columns = fetch_mysql_columns(mysql_conn, table_name)
                    common_columns = [col for col in pg_columns if not col.startswith("_cdc_") and col in mysql_columns]
                    if not common_columns:
                        raise RuntimeError(
                            f"No shared columns between MySQL {table_name} and PostgreSQL {schema_name}.{table_name}"
                        )
                    source_count = fetch_table_count_mysql(mysql_conn, table_name)

                    offset = 0
                    while offset < source_count:
                        batch_rows = fetch_mysql_rows(
                            mysql_conn,
                            table_name,
                            common_columns,
                            pk_columns,
                            offset,
                            batch_size,
                        )
                        if not batch_rows:
                            break
                        try:
                            sql = build_upsert_sql(
                                schema_name,
                                table_name,
                                batch_rows,
                                pg_columns,
                                pg_column_types,
                                pk_columns,
                            )
                            client.execute(sql)
                            loaded_count += len(batch_rows)
                        except Exception as batch_exc:
                            print(
                                f"batch fallback for {table_name} at offset {offset}: {batch_exc}",
                                file=sys.stderr,
                            )
                            for row in batch_rows:
                                try:
                                    sql = build_upsert_sql(
                                        schema_name,
                                        table_name,
                                        [row],
                                        pg_columns,
                                        pg_column_types,
                                        pk_columns,
                                    )
                                    client.execute(sql)
                                    loaded_count += 1
                                except Exception as row_exc:
                                    skipped_count += 1
                                    if skipped_log_count < 20:
                                        row_key = "|".join(str(row.get(pk)) for pk in pk_columns)
                                        print(
                                            f"skipped {table_name} row {row_key}: {row_exc}",
                                            file=sys.stderr,
                                        )
                                        skipped_log_count += 1
                        offset += len(batch_rows)

                    status = "completed_with_skips" if skipped_count else "completed"
                    message = None
                    if skipped_count:
                        message = f"skipped_rows={skipped_count}"
                    try:
                        finish_table_run(client, run_id, source_count, loaded_count, status, message)
                    except Exception as exc:
                        print(f"audit update skipped for {table_name}: {exc}", file=sys.stderr)
                    print(f"loaded {table_name}: {loaded_count}/{source_count} skipped={skipped_count}")
                except Exception as exc:
                    try:
                        finish_table_run(client, run_id, source_count, loaded_count, "failed", str(exc))
                    except Exception as audit_exc:
                        print(f"audit failure update skipped for {table_name}: {audit_exc}", file=sys.stderr)
                    raise
        finish_batch_run(client, batch_id, "completed", "full load completed")
    except Exception as exc:
        finish_batch_run(client, batch_id, "failed", str(exc))
        raise


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--create-landing", action="store_true", help="create landing and audit tables")
    parser.add_argument("--full-load", action="store_true", help="load MySQL tables into PostgreSQL landing")
    parser.add_argument("--batch-size", type=int, default=200, help="row batch size for MySQL extraction")
    parser.add_argument("--schema", default=DEFAULT_LANDING_SCHEMA, help="target PostgreSQL landing schema")
    parser.add_argument("--tables", nargs="*", default=BOOTSTRAP_TABLES, help="optional subset of tables")
    args = parser.parse_args()

    if not args.create_landing and not args.full_load:
        parser.error("Specify at least one of --create-landing or --full-load")

    pg_runner = load_pg_runner()
    pg_runner.load_env_files()
    client = pg_runner.SimplePgClient(pg_runner.resolve_database_url())
    client.connect()
    try:
        if args.create_landing:
            run_create_landing(client, args.schema)
            print(f"landing and audit tables are ready in schema {args.schema}")

        if args.full_load:
            mysql_kwargs = parse_mysql_url(resolve_mysql_url(pg_runner))
            run_full_load(
                client,
                mysql_kwargs,
                args.tables,
                args.batch_size,
                args.schema,
            )
    finally:
        client.close()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
