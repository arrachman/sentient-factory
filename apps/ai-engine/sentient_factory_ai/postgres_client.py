from __future__ import annotations

from datetime import date, datetime, time
from decimal import Decimal
import re

from .models import PerQueryExecutionResult, QueryResultColumn, QueryResultSet


READ_ONLY_PREFIXES = ("select", "with", "show", "explain")
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
    (r"\buse\s+[a-zA-Z_][a-zA-Z0-9_]*", "Unsupported SQL command USE in PostgreSQL mode."),
)


def execute_read_only_query(database_url: str, sql: str, row_limit: int = 200) -> QueryResultSet:
    normalized_sql = _normalize_single_statement(sql)
    lowered = normalized_sql.lower()

    if not lowered.startswith(READ_ONLY_PREFIXES):
        raise ValueError("Only read-only SQL statements are allowed.")
    if any(token in lowered for token in BLOCKED_TOKENS):
        raise ValueError("Blocked SQL token detected in read-only query.")
    _raise_if_unsupported_postgres_syntax(normalized_sql)

    limited_sql = _ensure_limit(normalized_sql, row_limit)

    try:
        import psycopg2
        from psycopg2.extras import RealDictCursor
    except ModuleNotFoundError as error:
        raise RuntimeError(
            "psycopg2 is required for PostgreSQL query execution in ai-engine."
        ) from error

    with psycopg2.connect(database_url) as connection:
        with connection.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute(limited_sql)
            rows = list(cursor.fetchall())
            description = cursor.description or []

    return QueryResultSet(
        sql=limited_sql,
        row_count=len(rows),
        columns=[QueryResultColumn(name=str(column.name)) for column in description],
        rows=[_json_safe_value(dict(row)) for row in rows],
    )


def execute_multiple_read_only_queries(
    database_url: str,
    queries: list[tuple[str, str]],
    row_limit: int = 200,
    max_queries: int = 5,
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


def _raise_if_unsupported_postgres_syntax(sql: str) -> None:
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
    if isinstance(value, Decimal):
        return float(value)
    if isinstance(value, bytes):
        return value.decode(errors="replace")
    return value
