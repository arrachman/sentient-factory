#!/usr/bin/env python3
from __future__ import annotations

import json
from typing import Any


def _parse_sql_generator_output(answer: str) -> dict[str, object] | None:
    candidate = answer.strip()
    if not candidate.startswith("{"):
        return None

    try:
        payload = json.loads(candidate)
    except json.JSONDecodeError:
        return None

    if isinstance(payload, dict):
        return payload
    return None


def _normalize_sql(sql: str) -> str:
    return " ".join(sql.lower().split())


def _extract_tokens(expression: str) -> tuple[list[str], list[str]]:
    tables: list[str] = []
    columns: list[str] = []
    for part in expression.replace("(", " ").replace(")", " ").replace(",", " ").split():
        cleaned = part.strip().lower()
        if "." in cleaned:
            left, right = cleaned.split(".", 1)
            if left.startswith("m"):
                tables.append(left)
            columns.append(right)
        elif cleaned.startswith("m") and "_" in cleaned:
            tables.append(cleaned)
    return list(dict.fromkeys(tables)), list(dict.fromkeys(columns))


def _contains_expression(sql_norm: str, expression: str) -> bool:
    expected = _normalize_sql(expression)
    if expected in sql_norm:
        return True

    tables, columns = _extract_tokens(expression)
    for table in tables:
        if table not in sql_norm:
            return False
    for column in columns:
        if column not in sql_norm:
            return False

    literals = [token for token in expected.replace("=", " ").split() if token.startswith("'") and token.endswith("'")]
    for literal in literals:
        if literal not in sql_norm:
            return False

    return True


def _validate_test(test: dict[str, Any], sql: str) -> list[str]:
    errors: list[str] = []
    sql_norm = _normalize_sql(sql)

    for table in test.get("must_use_tables", []):
        if table.lower() not in sql_norm:
            errors.append(f"missing required table: {table}")

    for table in test.get("must_not_use_tables", []):
        if table.lower() in sql_norm:
            errors.append(f"forbidden table used: {table}")

    for join_expr in test.get("must_have_joins", []):
        if not _contains_expression(sql_norm, join_expr):
            errors.append(f"missing required join/condition: {join_expr}")

    for cond in test.get("must_have_conditions", []):
        if " checked before joining " in cond:
            # Soft rule for manual review only.
            continue
        if not _contains_expression(sql_norm, cond):
            errors.append(f"missing required condition: {cond}")

    return errors
