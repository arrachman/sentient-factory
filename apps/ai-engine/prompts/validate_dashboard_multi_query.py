#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path
from typing import Any


def normalize_sql(sql: str) -> str:
    return " ".join(sql.lower().split())


def _load_tests(path: Path) -> list[dict[str, Any]]:
    data = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(data, list):
        raise ValueError("tests file must be a JSON array")
    return data


def _load_outputs(path: Path) -> list[dict[str, Any]]:
    data = json.loads(path.read_text(encoding="utf-8"))
    if isinstance(data, dict) and isinstance(data.get("results"), list):
        return data["results"]
    if isinstance(data, list):
        return data
    raise ValueError("outputs file must be a JSON array or an object with a results array")


def _extract_dashboard_payload(result: dict[str, Any]) -> dict[str, Any]:
    if isinstance(result.get("output"), dict):
        return result["output"]
    if isinstance(result.get("response"), dict):
        return result["response"]
    if isinstance(result.get("data"), dict):
        return result["data"]
    return result


def _keyword_variants(keyword: str) -> list[str]:
    normalized = keyword.lower()
    variants = {normalized}
    if normalized == "trend":
        variants.update({"tren", "bulanan", "monthly"})
    if normalized == "tren":
        variants.update({"trend", "bulanan", "monthly"})
    if normalized == "return":
        variants.add("retur")
    if normalized == "retur":
        variants.add("return")
    if normalized == "invoice":
        variants.update({"faktur", "si"})
    if normalized == "collection":
        variants.update({"penagihan", "tertagih", "collect", "collection ratio", "dibayar", "tagih"})
    if normalized == "payment":
        variants.update({"pembayaran", "dibayar", "bayar", "terbayar"})
    if normalized == "backlog":
        variants.update({"pending", "belum", "tertahan"})
    if normalized == "bottleneck":
        variants.update({"macet", "tertahan", "stalled", "belum menjadi"})
    if normalized == "summary":
        variants.update({"ringkasan", "status", "jumlah", "distribution", "distribusi", "per tahap", "belum menjadi"})
    if normalized == "ranking":
        variants.update({"top", "tertinggi", "terendah"})
    if normalized == "alerts":
        variants.update({"alert", "peringatan", "negatif", "negative", "risiko", "anomali", "terendah"})
    if normalized == "risk":
        variants.update({"risiko", "berisiko"})
    if normalized == "aging":
        variants.update({"umur", "jatuh tempo", "outstanding", "aging invoice", "overdue"})
    if normalized == "outstanding":
        variants.update({"piutang", "belum lunas", "jatuh tempo", "keterlambatan"})
    if normalized == "fulfillment":
        variants.update({"realisasi", "delivery", "pengiriman", "belum menjadi", "progress"})
    if normalized == "ratio":
        variants.update({"rasio", "ratio", "perbandingan"})
    if normalized == "retur":
        variants.update({"return", "sales return", "pengembalian", "sr"})
    if normalized == "return":
        variants.update({"retur", "sales return", "pengembalian", "sr"})
    return list(variants)


def validate_test(test: dict[str, Any], payload: dict[str, Any]) -> list[str]:
    errors: list[str] = []

    expected_mode = test.get("expected_mode")
    actual_mode = payload.get("mode")
    if expected_mode and actual_mode != expected_mode:
        errors.append(f"expected mode {expected_mode}, got {actual_mode}")

    generated_queries = payload.get("queries") or payload.get("generated_queries") or []
    if not isinstance(generated_queries, list):
        generated_queries = []
    expected_query_count = test.get("expected_query_count")
    if isinstance(expected_query_count, int) and len(generated_queries) != expected_query_count:
        errors.append(
            f"expected {expected_query_count} queries, got {len(generated_queries)}"
        )

    visualizations = payload.get("visualizations") or []
    if not isinstance(visualizations, list):
        visualizations = []
    expected_visualization_count = test.get("expected_visualization_count")
    if (
        isinstance(expected_visualization_count, int)
        and len(visualizations) != expected_visualization_count
    ):
        errors.append(
            f"expected {expected_visualization_count} visualizations, got {len(visualizations)}"
        )

    sql_blob = "\n".join(
        normalize_sql(str(item.get("query") or item.get("sql") or ""))
        for item in generated_queries
        if isinstance(item, dict)
    )
    for table in test.get("required_tables", []):
        if table.lower() not in sql_blob:
            errors.append(f"missing required table in generated queries: {table}")

    visualization_titles = " ".join(
        str(item.get("title") or item.get("name") or "").lower()
        for item in visualizations
        if isinstance(item, dict)
    )
    for keyword in test.get("required_widget_keywords", []):
        if not any(variant in visualization_titles for variant in _keyword_variants(keyword)):
            errors.append(f"missing widget keyword in visualization titles: {keyword}")

    return errors


def main() -> int:
    parser = argparse.ArgumentParser(description="Validate multi-query dashboard outputs.")
    parser.add_argument(
        "--tests",
        default="apps/ai-engine/prompts/dashboard_multi_query_regression_seed.json",
        help="Path to dashboard regression seed JSON",
    )
    parser.add_argument(
        "--outputs",
        required=True,
        help="Path to generated outputs JSON",
    )
    args = parser.parse_args()

    tests = _load_tests(Path(args.tests))
    outputs = _load_outputs(Path(args.outputs))

    tests_by_id = {test["id"]: test for test in tests}
    total = 0
    failed = 0
    report: list[dict[str, Any]] = []

    for result in outputs:
        test_id = result.get("id")
        if not isinstance(test_id, str):
            failed += 1
            report.append({"id": None, "status": "FAILED", "errors": ["missing test id"]})
            continue

        total += 1
        test = tests_by_id.get(test_id)
        if not test:
            failed += 1
            report.append({"id": test_id, "status": "FAILED", "errors": ["unknown test id"]})
            continue

        payload = _extract_dashboard_payload(result)
        errors = validate_test(test, payload)
        report.append(
            {
                "id": test_id,
                "status": "FAILED" if errors else "PASSED",
                "errors": errors,
            }
        )
        if errors:
            failed += 1

    print(
        json.dumps(
            {
                "suite": "dashboard_multi_query_regression",
                "total": total,
                "failed": failed,
                "passed": total - failed,
                "results": report,
            },
            indent=2,
            ensure_ascii=False,
        )
    )
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())
