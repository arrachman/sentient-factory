#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import os
import ssl
import tomllib
import urllib.request
from datetime import UTC, datetime
from pathlib import Path
from typing import Any

from dashboard_regression_validation import (
    _parse_generator_output,
    _validate_dashboard_test,
)


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


def _load_config() -> tuple[str, str, str | None]:
    candidates = [
        Path(os.environ["CODEX_CONFIG_PATH"]) if os.environ.get("CODEX_CONFIG_PATH") else None,
        Path.cwd() / ".codex-cli" / "config.toml",
        Path(__file__).resolve().parents[3] / ".codex-cli" / "config.toml",
        Path.home() / ".codex-cli" / "config.toml",
    ]
    config_path = next((path for path in candidates if path and path.exists()), None)
    if not config_path:
        raise FileNotFoundError("missing config: checked CODEX_CONFIG_PATH, repo .codex-cli/config.toml, and home .codex-cli/config.toml")

    config = tomllib.loads(config_path.read_text(encoding="utf-8"))
    api_base_url = str(config.get("api_base_url") or "https://ai.patungin.id/v1")
    model = str(config.get("model") or "gpt-5.4")
    api_key = config.get("api_key")
    return api_base_url, model, str(api_key) if api_key else None


def _call_ai_engine(
    *,
    ai_engine_url: str,
    question: str,
    timeout_seconds: float,
) -> tuple[dict[str, Any], str]:
    payload = {
        "question": question,
        "include_schema": True,
        "include_samples": False,
        "execute_read_only_query": False,
        "model_profile": "pro",
    }
    request = urllib.request.Request(
        f"{ai_engine_url.rstrip('/')}/api/chat/dashboard-query",
        data=json.dumps(payload).encode(),
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    with urllib.request.urlopen(request, timeout=timeout_seconds) as response:
        data = json.loads(response.read().decode())

    if not isinstance(data, dict):
        raise ValueError("ai-engine response is not a JSON object")
    if not data.get("success"):
        raise ValueError(f"ai-engine request failed: {data}")
    result = data.get("data")
    if not isinstance(result, dict):
        raise ValueError("ai-engine response missing data object")
    return result, str(result.get("model") or "unknown")


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
    transport: str,
    ai_engine_url: str,
) -> dict[str, Any]:
    prompt_source = (
        f"{ai_engine_url.rstrip('/')}/api/chat/dashboard-query"
        if transport == "ai-engine"
        else str(prompt_template_path)
    )
    try:
        if transport == "ai-engine":
            ai_result, resolved_model = _call_ai_engine(
                ai_engine_url=ai_engine_url,
                question=test["question"],
                timeout_seconds=timeout_seconds,
            )
            raw_answer = str(ai_result.get("answer") or "")
            parsed = _parse_generator_output(raw_answer)
            payload = parsed if isinstance(parsed, dict) else {}
            validation_errors = (
                _validate_dashboard_test(test, payload)
                if parsed
                else ["ai-engine answer is not valid JSON object"]
            )
        else:
            prompt, prompt_source = _build_prompt(
                prompt_template_path=prompt_template_path,
                semantic_schema_path=semantic_schema_path,
                semantic_query_schema_sales_path=semantic_query_schema_sales_path,
                question=test["question"],
            )
            raw_answer, resolved_model = _call_llm(
                api_base_url=api_base_url,
                model=model,
                api_key=api_key,
                prompt=prompt,
                timeout_seconds=timeout_seconds,
            )
            parsed = _parse_generator_output(raw_answer)
            payload = parsed if isinstance(parsed, dict) else {}
            validation_errors = (
                _validate_dashboard_test(test, payload)
                if parsed
                else ["generator output is not valid JSON object"]
            )
    except Exception as exc:
        raw_answer = ""
        resolved_model = model
        parsed = None
        payload = {}
        validation_errors = [f"unexpected error: {type(exc).__name__}: {exc}"]

    return {
        "id": test["id"],
        "title": test["title"],
        "question": test["question"],
        "prompt_source": prompt_source,
        "resolved_model": resolved_model,
        "raw_answer": raw_answer,
        "output": payload,
        "status": "PASSED" if not validation_errors else "FAILED",
        "errors": validation_errors,
    }


def main() -> int:
    parser = argparse.ArgumentParser(description="Run dashboard multi-query regression tests.")
    parser.add_argument(
        "--tests",
        default="apps/ai-engine/prompts/dashboard_multi_query_regression_seed.json",
        help="Path to dashboard regression seed JSON",
    )
    parser.add_argument(
        "--ids",
        nargs="*",
        help="Run only specific test ids",
    )
    parser.add_argument(
        "--timeout-seconds",
        type=float,
        default=180.0,
        help="LLM request timeout in seconds",
    )
    parser.add_argument(
        "--output-dir",
        default="apps/ai-engine/prompts/regression-results-live",
        help="Directory to write outputs and summary JSON",
    )
    parser.add_argument(
        "--transport",
        choices=["ai-engine", "provider"],
        default="ai-engine",
        help="Use local ai-engine endpoint or call provider directly",
    )
    parser.add_argument(
        "--ai-engine-url",
        default=os.environ.get("AI_ENGINE_URL", "http://127.0.0.1:8001"),
        help="Base URL for local ai-engine when using --transport ai-engine",
    )
    args = parser.parse_args()

    api_base_url, model, api_key = _load_config()

    repo_root = Path(__file__).resolve().parents[3]
    prompt_template_path = repo_root / "apps/ai-engine/prompts/sales_sql_readonly_generator.prompt.md"
    semantic_schema_path = repo_root / "apps/myerpplus-db-mapping/db/semantic-schema.json"
    semantic_query_schema_sales_path = (
        repo_root / "apps/myerpplus-db-mapping/db/semantic-query-schema-dashboard-obt.json"
    )

    tests_path = repo_root / args.tests
    tests = json.loads(tests_path.read_text(encoding="utf-8"))
    if args.ids:
        allowed = set(args.ids)
        tests = [test for test in tests if test.get("id") in allowed]

    timestamp = datetime.now(UTC).strftime("%Y%m%dT%H%M%SZ")
    results: list[dict[str, Any]] = []

    for test in tests:
        print(f"[dashboard-regression] running {test['id']}...", flush=True)
        results.append(
            _run_single_test(
                test=test,
                api_base_url=api_base_url,
                model=model,
                api_key=api_key,
                timeout_seconds=args.timeout_seconds,
                prompt_template_path=prompt_template_path,
                semantic_schema_path=semantic_schema_path,
                semantic_query_schema_sales_path=semantic_query_schema_sales_path,
                transport=args.transport,
                ai_engine_url=args.ai_engine_url,
            )
        )

    output_dir = repo_root / args.output_dir
    output_dir.mkdir(parents=True, exist_ok=True)

    outputs_path = output_dir / f"dashboard-multi-query-outputs-{timestamp}.json"
    summary_path = output_dir / f"dashboard-multi-query-summary-{timestamp}.json"

    outputs_payload = {"results": results}
    outputs_path.write_text(json.dumps(outputs_payload, indent=2, ensure_ascii=False), encoding="utf-8")

    failed = sum(1 for result in results if result["status"] != "PASSED")
    summary_payload = {
        "suite": "dashboard_multi_query_regression",
        "timestamp": timestamp,
        "total": len(results),
        "failed": failed,
        "passed": len(results) - failed,
        "results": [
            {
                "id": result["id"],
                "status": result["status"],
                "errors": result["errors"],
            }
            for result in results
        ],
        "outputs_path": str(outputs_path),
    }
    summary_path.write_text(json.dumps(summary_payload, indent=2, ensure_ascii=False), encoding="utf-8")

    print(json.dumps(summary_payload, indent=2, ensure_ascii=False))
    return 1 if failed else 0


if __name__ == "__main__":
    raise SystemExit(main())
