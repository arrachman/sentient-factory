#!/usr/bin/env python3
import argparse
import json
import sys
from pathlib import Path


def normalize_sql(sql: str) -> str:
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
    expected = normalize_sql(expression)
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


def validate_test(test: dict, sql: str) -> list[str]:
    errors: list[str] = []
    sql_norm = normalize_sql(sql)

    if " over (" in sql_norm or " over(" in sql_norm:
        errors.append("unsupported syntax for target MySQL/MariaDB: window function OVER(...)")

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
            continue
        if not _contains_expression(sql_norm, cond):
            errors.append(f"missing required condition: {cond}")

    return errors


def main() -> int:
    parser = argparse.ArgumentParser(description="Validate M5 NL2SQL regression output.")
    parser.add_argument(
        "--tests",
        default="apps/ai-engine/prompts/sales_sql_readonly_generator.m5-regression-tests.json",
        help="Path to regression tests JSON",
    )
    parser.add_argument(
        "--outputs",
        required=True,
        help="Path to generated outputs JSON. Format: {\"results\": [{\"id\": ..., \"query\": ...}]}",
    )
    args = parser.parse_args()

    tests_path = Path(args.tests)
    outputs_path = Path(args.outputs)

    tests_data = json.loads(tests_path.read_text())
    outputs_data = json.loads(outputs_path.read_text())

    tests_by_id = {test["id"]: test for test in tests_data["tests"]}
    results = outputs_data.get("results", [])

    total = 0
    failed = 0
    report = []

    for result in results:
        test_id = result["id"]
        query = result.get("query") or ""
        total += 1

        if test_id not in tests_by_id:
            failed += 1
            report.append({"id": test_id, "status": "FAILED", "errors": ["unknown test id"]})
            continue

        errors = validate_test(tests_by_id[test_id], query)
        if errors:
            failed += 1
            report.append({"id": test_id, "status": "FAILED", "errors": errors})
        else:
            report.append({"id": test_id, "status": "PASSED", "errors": []})

    print(json.dumps({
        "suite": tests_data["suite_name"],
        "total": total,
        "failed": failed,
        "passed": total - failed,
        "results": report,
    }, indent=2, ensure_ascii=False))

    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())
