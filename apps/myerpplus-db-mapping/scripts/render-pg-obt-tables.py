#!/usr/bin/env python3
"""Render PostgreSQL table-first OBT SQL from existing view-first candidates."""

from __future__ import annotations

import re
from pathlib import Path


ROOT = Path("/opt/sentient-factory/apps/myerpplus-db-mapping")
SQL_DIR = ROOT / "db" / "obt-physical-sql"
OUT_DIR = SQL_DIR / "pgsql-tables"


SOURCES = [
    {
        "source": SQL_DIR / "vw_obt_purchase_line_flow.sql",
        "table": "obt_purchase_line_flow",
    },
    {
        "source": SQL_DIR / "vw_obt_sales_line_flow.sql",
        "table": "obt_sales_line_flow",
    },
    {
        "source": SQL_DIR / "vw_obt_pos_to_sales.sql",
        "table": "obt_pos_to_sales",
    },
]


VIEW_PREFIX_RE = re.compile(
    r"CREATE\s+OR\s+REPLACE\s+VIEW\s+\w+\s+AS\s*",
    re.IGNORECASE | re.DOTALL,
)

GROUP_CONCAT_RE = re.compile(
    r"""
    GROUP_CONCAT
    \s*\(
    \s*DISTINCT\s+
    (?P<expr>.+?)
    \s+ORDER\s+BY\s+
    (?P<order>.+?)
    \s+SEPARATOR\s+
    '(?P<sep>[^']*)'
    \s*\)
    """,
    re.IGNORECASE | re.DOTALL | re.VERBOSE,
)


def _transform_body(sql_text: str) -> str:
    match = VIEW_PREFIX_RE.search(sql_text)
    if not match:
        raise ValueError("Unable to find CREATE OR REPLACE VIEW prefix in source SQL")

    body = sql_text[match.end() :].strip()
    if body.endswith(";"):
        body = body[:-1].rstrip()

    def repl(match: re.Match[str]) -> str:
        expr = " ".join(match.group("expr").split())
        order = " ".join(match.group("order").split())
        sep = match.group("sep")
        return f"STRING_AGG(DISTINCT {expr}, '{sep}' ORDER BY {order})"

    body = GROUP_CONCAT_RE.sub(repl, body)
    return body


def _render_create_sql(table_name: str, source_name: str, select_sql: str) -> str:
    unique_index = f"uq_{table_name}_source_detail"
    doc_date_index = f"ix_{table_name}_doc_date"
    columns = _extract_output_columns(select_sql)
    ddl_columns = ",\n".join(
        f"    {column} {_infer_pg_type(column)}" for column in columns
    )
    return f"""-- Auto-generated from {source_name}
-- Purpose:
--   create the OBT table structure directly in PostgreSQL
--   do not create a view on the source/client database
--   keep the table empty for the first controlled load step

CREATE TABLE IF NOT EXISTS {table_name} (
{ddl_columns},
    etl_loaded_at timestamptz
);

CREATE UNIQUE INDEX IF NOT EXISTS {unique_index}
    ON {table_name} (source_module, source_detail_id);

CREATE INDEX IF NOT EXISTS {doc_date_index}
    ON {table_name} (doc_date);
"""


def _render_insert_sql(table_name: str, source_name: str, select_sql: str) -> str:
    return f"""-- Auto-generated from {source_name}
-- Purpose:
--   bootstrap or append rows into the PostgreSQL OBT table
-- Note:
--   this is a plain INSERT for the first load
--   convert it to UPSERT or delta-based ETL for live sync

INSERT INTO {table_name}
SELECT
    q.*,
    clock_timestamp() AS etl_loaded_at
FROM (
{select_sql}
) AS q;
"""


def _extract_output_columns(select_sql: str) -> list[str]:
    upper = select_sql.upper()
    select_pos = -1
    from_pos = -1
    depth = 0
    in_single_quote = False
    i = 0

    while i < len(select_sql):
        ch = select_sql[i]
        if ch == "'" and (i == 0 or select_sql[i - 1] != "\\"):
            in_single_quote = not in_single_quote
            i += 1
            continue
        if in_single_quote:
            i += 1
            continue
        if ch == "(":
            depth += 1
        elif ch == ")":
            depth -= 1
        elif depth == 0 and upper.startswith("SELECT", i):
            select_pos = i
        elif depth == 0 and select_pos != -1 and upper.startswith("FROM", i):
            from_pos = i
            break
        i += 1

    if select_pos == -1 or from_pos == -1:
        raise ValueError("Unable to find final SELECT list in SQL")

    select_list = select_sql[select_pos + len("SELECT") : from_pos]
    expressions = []
    current = []
    depth = 0
    in_single_quote = False

    for ch in select_list:
        if ch == "'" and (not current or current[-1] != "\\"):
            in_single_quote = not in_single_quote
            current.append(ch)
            continue
        if in_single_quote:
            current.append(ch)
            continue
        if ch == "(":
            depth += 1
        elif ch == ")":
            depth -= 1
        if ch == "," and depth == 0:
            expr = "".join(current).strip()
            if expr:
                expressions.append(expr)
            current = []
        else:
            current.append(ch)

    expr = "".join(current).strip()
    if expr:
        expressions.append(expr)

    columns = []
    alias_re = re.compile(r"\s+AS\s+([A-Za-z_][A-Za-z0-9_]*)\s*$", re.IGNORECASE)
    bare_re = re.compile(r"([A-Za-z_][A-Za-z0-9_]*)\s*$")
    for expr in expressions:
        alias_match = alias_re.search(expr)
        if alias_match:
            columns.append(alias_match.group(1))
            continue
        bare_match = bare_re.search(expr)
        if not bare_match:
            raise ValueError(f"Unable to infer output column name from expression: {expr}")
        columns.append(bare_match.group(1))
    return columns


def _infer_pg_type(column: str) -> str:
    if (
        column.endswith("_id")
        or column in {"line_no", "doc_status_code", "invoice_status_code"}
        or column.endswith("_status_code")
        or column.endswith("_count")
        or column.endswith("_closed")
        or column in {"voucher_master_closed", "voucher_usage_closed"}
    ):
        return "bigint"

    if column.endswith("_date") or column == "doc_date":
        return "timestamp without time zone"

    numeric_tokens = (
        "qty",
        "amount",
        "price",
        "subtotal",
        "total",
        "rate",
        "discount",
        "exchange",
        "nominal",
        "remaining",
    )
    if any(token in column for token in numeric_tokens):
        return "numeric(20,6)"

    return "text"


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    for item in SOURCES:
        source_path = item["source"]
        table_name = item["table"]
        transformed = _transform_body(source_path.read_text())

        create_path = OUT_DIR / f"pg_create_table_{table_name}.sql"
        insert_path = OUT_DIR / f"pg_insert_{table_name}.sql"

        create_path.write_text(
            _render_create_sql(table_name, source_path.name, transformed)
        )
        insert_path.write_text(
            _render_insert_sql(table_name, source_path.name, transformed)
        )

        print(f"rendered {create_path.relative_to(ROOT)}")
        print(f"rendered {insert_path.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
