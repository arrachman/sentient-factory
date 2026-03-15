from __future__ import annotations

import re
from urllib.parse import parse_qs, unquote, urlparse

import pymysql
from pymysql.cursors import DictCursor

from .models import QueryResultColumn, QueryResultSet


READ_ONLY_PREFIXES = ("select", "with", "show", "describe", "desc", "explain")
BLOCKED_TOKENS = (
    "insert",
    "update",
    "delete",
    "drop",
    "truncate",
    "alter",
    "create",
    "replace",
    "rename",
    "grant",
    "revoke",
)


def execute_read_only_query(database_url: str, sql: str, row_limit: int = 200) -> QueryResultSet:
    normalized_sql = _normalize_single_statement(sql)
    lowered = normalized_sql.lower()

    if not lowered.startswith(READ_ONLY_PREFIXES):
        raise ValueError("Only read-only SQL statements are allowed.")
    if any(token in lowered for token in BLOCKED_TOKENS):
        raise ValueError("Blocked SQL token detected in read-only query.")

    limited_sql = _ensure_limit(normalized_sql, row_limit)
    connection_kwargs = _parse_mysql_url(database_url)

    with pymysql.connect(**connection_kwargs) as connection:
        with connection.cursor(DictCursor) as cursor:
            cursor.execute(limited_sql)
            rows = list(cursor.fetchall())
            description = cursor.description or []

    return QueryResultSet(
        sql=limited_sql,
        row_count=len(rows),
        columns=[QueryResultColumn(name=str(column[0])) for column in description],
        rows=[dict(row) for row in rows],
    )


def _ensure_limit(sql: str, row_limit: int) -> str:
    if re.search(r"\blimit\b", sql, flags=re.IGNORECASE):
        return sql
    return f"{sql}\nLIMIT {row_limit}"


def _normalize_single_statement(sql: str) -> str:
    statements = [part.strip() for part in sql.strip().split(";") if part.strip()]
    if not statements:
        raise ValueError("SQL statement is empty.")
    if len(statements) > 1:
        raise ValueError("Only a single read-only SQL statement is allowed.")
    return statements[0]


def _parse_mysql_url(database_url: str) -> dict[str, object]:
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
        "read_timeout": int(query.get("read_timeout", ["30"])[0]),
        "write_timeout": int(query.get("write_timeout", ["30"])[0]),
    }
