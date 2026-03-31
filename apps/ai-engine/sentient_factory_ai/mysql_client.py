from __future__ import annotations

from datetime import date, datetime, time
import re
from urllib.parse import parse_qs, unquote, urlparse

import pymysql
from pymysql.cursors import DictCursor

from .models import PerQueryExecutionResult, QueryResultColumn, QueryResultSet


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
UNSUPPORTED_SQL_PATTERNS: tuple[tuple[str, str], ...] = (
    (r"\bdate_trunc\s*\(", "Unsupported PostgreSQL function DATE_TRUNC. Use MySQL date functions such as DATE(), DATE_FORMAT(), YEARWEEK(), WEEK(), MONTH(), or YEAR()."),
    (r"\bilike\b", "Unsupported PostgreSQL operator ILIKE. Use MySQL LIKE instead."),
    (r"::[a-zA-Z_][a-zA-Z0-9_]*", "Unsupported PostgreSQL cast syntax ::type. Use MySQL CAST(... AS ...) instead."),
    (r"\bover\s*\(", "Unsupported window function OVER(...). Use subquery or CROSS JOIN aggregate that is compatible with the target MySQL/MariaDB version."),
)


def execute_read_only_query(database_url: str, sql: str, row_limit: int = 200) -> QueryResultSet:
    normalized_sql = _normalize_single_statement(sql)
    lowered = normalized_sql.lower()

    if not lowered.startswith(READ_ONLY_PREFIXES):
        raise ValueError("Only read-only SQL statements are allowed.")
    if any(token in lowered for token in BLOCKED_TOKENS):
        raise ValueError("Blocked SQL token detected in read-only query.")
    _raise_if_unsupported_mysql_syntax(normalized_sql)

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
        rows=[_json_safe_value(dict(row)) for row in rows],
    )


def execute_multiple_read_only_queries(
    database_url: str,
    queries: list[tuple[str, str]],
    row_limit: int = 200,
    max_queries: int = 3,
) -> list[PerQueryExecutionResult]:
    if len(queries) > max_queries:
        raise ValueError(f"At most {max_queries} read-only queries are allowed in dashboard mode.")

    results: list[PerQueryExecutionResult] = []
    for query_id, sql in queries:
        try:
            result = execute_read_only_query(database_url, sql, row_limit=row_limit)
            results.append(
                PerQueryExecutionResult(
                    query_id=query_id,
                    sql=result.sql,
                    success=True,
                    row_count=result.row_count,
                    columns=result.columns,
                    rows=result.rows,
                )
            )
        except Exception as error:
            try:
                normalized_sql = _normalize_single_statement(sql)
                rendered_sql = _ensure_limit(normalized_sql, row_limit)
            except Exception:
                rendered_sql = sql.strip()
            results.append(
                PerQueryExecutionResult(
                    query_id=query_id,
                    sql=rendered_sql,
                    success=False,
                    error_message=str(error),
                )
            )

    return results


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


def _raise_if_unsupported_mysql_syntax(sql: str) -> None:
    for pattern, message in UNSUPPORTED_SQL_PATTERNS:
        if re.search(pattern, sql, flags=re.IGNORECASE):
            raise ValueError(message)


def _json_safe_value(value):
    if isinstance(value, dict):
        return {str(key): _json_safe_value(item) for key, item in value.items()}
    if isinstance(value, list):
        return [_json_safe_value(item) for item in value]
    if isinstance(value, tuple):
        return [_json_safe_value(item) for item in value]
    if isinstance(value, (datetime, date, time)):
        return value.isoformat()
    if isinstance(value, bytes):
        return value.decode(errors="replace")
    return value


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
