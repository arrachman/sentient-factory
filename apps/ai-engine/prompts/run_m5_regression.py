#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import ssl
import tomllib
import urllib.request
from urllib.error import HTTPError, URLError
from datetime import UTC, datetime
from pathlib import Path
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


def _build_prompt(
    *,
    prompt_template_path: Path,
    semantic_schema_path: Path,
    semantic_query_schema_sales_path: Path,
    question: str,
) -> tuple[str, str]:
    prompt_template = prompt_template_path.read_text(encoding="utf-8").strip()
    semantic_schema_json = semantic_schema_path.read_text(encoding="utf-8").strip()
    semantic_query_schema_sales_json = semantic_query_schema_sales_path.read_text(
        encoding="utf-8"
    ).strip()

    prompt = (
        prompt_template.replace("{{SEMANTIC_SCHEMA_JSON}}", semantic_schema_json)
        .replace("{{SEMANTIC_QUERY_SCHEMA_SALES_JSON}}", semantic_query_schema_sales_json)
        .replace("{{USER_QUESTION}}", question)
    )
    return prompt, str(prompt_template_path)


def _call_llm(
    *,
    api_base_url: str,
    model: str,
    api_key: str | None,
    prompt: str,
    timeout_seconds: float,
) -> tuple[str, str]:
    payload = {
        "model": model,
        "input": [{"role": "user", "content": [{"type": "input_text", "text": prompt}]}],
    }
    request = urllib.request.Request(
        f"{api_base_url.rstrip('/')}/responses",
        data=json.dumps(payload).encode(),
        headers={
            "Content-Type": "application/json",
            **({"Authorization": f"Bearer {api_key}"} if api_key else {}),
        },
        method="POST",
    )
    context = ssl.create_default_context()
    context.check_hostname = False
    context.verify_mode = ssl.CERT_NONE
    with urllib.request.urlopen(request, timeout=timeout_seconds, context=context) as response:
        data = json.loads(response.read().decode())

    output = data.get("output", [])
    texts: list[str] = []
    for item in output:
        for content in item.get("content", []):
            text = content.get("text")
            if text:
                texts.append(str(text))
    answer = "\n".join(texts).strip() or str(data.get("output_text") or "")
    return answer, model


def _run_single_test(
    *,
    test: dict[str, Any],
    api_base_url: str,
    model: str,
    api_key: str | None,
    timeout_seconds: float,
    prompt_template_path: Path,
    semantic_schema_path: Path,
    semantic_query_schema_sales_path: Path,
) -> dict[str, Any]:
    prompt, prompt_source = _build_prompt(
        prompt_template_path=prompt_template_path,
        semantic_schema_path=semantic_schema_path,
        semantic_query_schema_sales_path=semantic_query_schema_sales_path,
        question=test["question"],
    )
    try:
        raw_answer, resolved_model = _call_llm(
            api_base_url=api_base_url,
            model=model,
            api_key=api_key,
            prompt=prompt,
            timeout_seconds=timeout_seconds,
        )
        parsed = _parse_sql_generator_output(raw_answer)
        query = parsed.get("query") if isinstance(parsed, dict) else None
        status = parsed.get("status") if isinstance(parsed, dict) else None
        validation_errors = _validate_test(test, query) if isinstance(query, str) else [
            "query missing or generator output is not valid JSON"
        ]
    except TimeoutError as exc:
        raw_answer = ""
        resolved_model = model
        parsed = None
        query = None
        status = "error"
        validation_errors = [f"request timeout: {exc}"]
    except HTTPError as exc:
        raw_answer = exc.read().decode(errors="replace") if exc.fp else ""
        resolved_model = model
        parsed = None
        query = None
        status = "error"
        validation_errors = [f"http error {exc.code}: {exc.reason}"]
    except URLError as exc:
        raw_answer = ""
        resolved_model = model
        parsed = None
        query = None
        status = "error"
        validation_errors = [f"url error: {exc.reason}"]
    except Exception as exc:
        raw_answer = ""
        resolved_model = model
        parsed = None
        query = None
        status = "error"
        validation_errors = [f"unexpected error: {type(exc).__name__}: {exc}"]

    return {
        "id": test["id"],
        "question": test["question"],
        "intent": test.get("intent"),
        "prompt_source": prompt_source,
        "resolved_model": resolved_model,
        "status": status,
        "query": query,
        "raw_answer": raw_answer,
        "parsed_answer": parsed,
        "validation_errors": validation_errors,
    }


def _run_suite(
    *,
    tests: list[dict[str, Any]],
    api_base_url: str,
    model: str,
    api_key: str | None,
    timeout_seconds: float,
    prompt_template_path: Path,
    semantic_schema_path: Path,
    semantic_query_schema_sales_path: Path,
) -> list[dict[str, Any]]:
    results: list[dict[str, Any]] = []
    for index, test in enumerate(tests, start=1):
        print(f"[{index}/{len(tests)}] running {test['id']}", flush=True)
        result = _run_single_test(
            test=test,
            api_base_url=api_base_url,
            model=model,
            api_key=api_key,
            timeout_seconds=timeout_seconds,
            prompt_template_path=prompt_template_path,
            semantic_schema_path=semantic_schema_path,
            semantic_query_schema_sales_path=semantic_query_schema_sales_path,
        )
        outcome = "PASSED" if not result["validation_errors"] else "FAILED"
        print(f"  -> {outcome}", flush=True)
        results.append(result)
    return results


def _load_codex_provider(config_path: Path) -> tuple[str, str, str | None]:
    config = tomllib.loads(config_path.read_text(encoding="utf-8"))
    model = config.get("model") or "model-default"
    provider_key = config.get("model_provider")
    providers = config.get("model_providers", {})
    provider = providers.get(provider_key or "", {}) if isinstance(providers, dict) else {}
    base_url = provider.get("base_url") or "https://ai.patungin.id/v1"
    api_key = provider.get("experimental_bearer_token")
    return model, base_url, api_key


def main() -> int:
    root = Path(__file__).resolve().parents[3]
    parser = argparse.ArgumentParser(description="Run M5 SQL generator regression tests end-to-end.")
    parser.add_argument(
        "--tests",
        default="apps/ai-engine/prompts/sales_sql_readonly_generator.m5-regression-tests.json",
        help="Path to regression tests JSON",
    )
    parser.add_argument(
        "--output-dir",
        default="apps/ai-engine/prompts/regression-results",
        help="Directory to store outputs and reports",
    )
    parser.add_argument(
        "--ids",
        nargs="*",
        help="Optional list of test ids to run",
    )
    parser.add_argument(
        "--api-base-url",
        default=None,
        help="LLM API base URL",
    )
    parser.add_argument(
        "--model",
        default=None,
        help="Model name",
    )
    parser.add_argument(
        "--api-key",
        default=None,
        help="LLM API key",
    )
    parser.add_argument(
        "--timeout-seconds",
        type=float,
        default=120.0,
        help="Timeout per request",
    )
    parser.add_argument(
        "--prompt-template",
        default="apps/ai-engine/prompts/sales_sql_readonly_generator.prompt.md",
        help="Path to prompt template",
    )
    parser.add_argument(
        "--semantic-schema",
        default="apps/myerpplus-db-mapping/db/semantic-schema.json",
        help="Path to semantic schema JSON",
    )
    parser.add_argument(
        "--semantic-sales-schema",
        default="apps/myerpplus-db-mapping/db/m5 - sales/semantic-schema-sales.json",
        help="Path to semantic sales schema JSON",
    )
    parser.add_argument(
        "--codex-config",
        default=str(root / ".codex-cli" / "config.toml"),
        help="Path to Codex config TOML for model/base_url/token fallback",
    )
    args = parser.parse_args()

    tests_path = (root / args.tests).resolve() if not Path(args.tests).is_absolute() else Path(args.tests)
    output_dir = (root / args.output_dir).resolve() if not Path(args.output_dir).is_absolute() else Path(args.output_dir)
    prompt_template_path = (root / args.prompt_template).resolve() if not Path(args.prompt_template).is_absolute() else Path(args.prompt_template)
    semantic_schema_path = (root / args.semantic_schema).resolve() if not Path(args.semantic_schema).is_absolute() else Path(args.semantic_schema)
    semantic_sales_schema_path = (root / args.semantic_sales_schema).resolve() if not Path(args.semantic_sales_schema).is_absolute() else Path(args.semantic_sales_schema)
    codex_config_path = Path(args.codex_config).resolve()

    fallback_model, fallback_api_base, fallback_api_key = _load_codex_provider(codex_config_path)
    api_base_url = args.api_base_url or fallback_api_base
    model = args.model or fallback_model
    api_key = args.api_key if args.api_key is not None else fallback_api_key
    timeout_seconds = args.timeout_seconds
    output_dir.mkdir(parents=True, exist_ok=True)

    suite = json.loads(tests_path.read_text())
    tests = suite["tests"]
    if args.ids:
        wanted = set(args.ids)
        tests = [test for test in tests if test["id"] in wanted]

    if not tests:
        raise SystemExit("No tests selected.")

    results = _run_suite(
        tests=tests,
        api_base_url=api_base_url,
        model=model,
        api_key=api_key,
        timeout_seconds=timeout_seconds,
        prompt_template_path=prompt_template_path,
        semantic_schema_path=semantic_schema_path,
        semantic_query_schema_sales_path=semantic_sales_schema_path,
    )

    timestamp = datetime.now(UTC).strftime("%Y%m%dT%H%M%SZ")
    outputs_path = output_dir / f"m5-regression-outputs-{timestamp}.json"
    summary_path = output_dir / f"m5-regression-summary-{timestamp}.json"

    outputs_payload = {
        "suite": suite["suite_name"],
        "generated_at": timestamp,
        "results": [
            {
                "id": item["id"],
                "query": item["query"],
                "status": item["status"],
                "raw_answer": item["raw_answer"],
                "parsed_answer": item["parsed_answer"],
                "validation_errors": item["validation_errors"],
                "resolved_model": item["resolved_model"],
            }
            for item in results
        ],
    }
    outputs_path.write_text(json.dumps(outputs_payload, indent=2, ensure_ascii=False) + "\n")

    summary_results = []
    failed = 0
    for item in results:
        passed = not item["validation_errors"]
        if not passed:
            failed += 1
        summary_results.append(
            {
                "id": item["id"],
                "status": "PASSED" if passed else "FAILED",
                "validation_errors": item["validation_errors"],
            }
        )

    summary_payload = {
        "suite": suite["suite_name"],
        "generated_at": timestamp,
        "total": len(results),
        "failed": failed,
        "passed": len(results) - failed,
        "outputs_path": str(outputs_path),
        "results": summary_results,
    }
    summary_path.write_text(json.dumps(summary_payload, indent=2, ensure_ascii=False) + "\n")

    print(json.dumps(summary_payload, indent=2, ensure_ascii=False))
    return 1 if failed else 0


if __name__ == "__main__":
    raise SystemExit(main())
