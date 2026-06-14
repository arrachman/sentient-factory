from __future__ import annotations

import re

from .llm_settings import settings
from .models import (
    ChatRequest,
    GeneratedQuery,
    SuggestedQuery,
    VisualizationSpec,
)


def _extract_generated_queries(parsed_output: dict[str, object] | None) -> list[GeneratedQuery]:
    if not parsed_output:
        return []

    raw_queries = parsed_output.get("queries")
    if not isinstance(raw_queries, list):
        return []

    generated_queries: list[GeneratedQuery] = []
    for index, item in enumerate(raw_queries, start=1):
        if not isinstance(item, dict):
            continue
        query = item.get("query")
        purpose = item.get("purpose")
        query_id = item.get("id") or f"q{index}"
        if not isinstance(query, str) or not query.strip():
            continue
        if not isinstance(purpose, str) or not purpose.strip():
            continue
        try:
            generated_queries.append(
                GeneratedQuery(
                    id=str(query_id).strip(),
                    name=str(item.get("name")).strip() if item.get("name") is not None else None,
                    purpose=purpose.strip(),
                    query=query.strip(),
                    result_kind=str(item.get("result_kind")).strip() if item.get("result_kind") is not None else None,
                )
            )
        except Exception:
            continue

    deduped: list[GeneratedQuery] = []
    seen_ids: set[str] = set()
    for item in generated_queries:
        if item.id in seen_ids:
            continue
        seen_ids.add(item.id)
        deduped.append(item)
    return deduped


def _extract_visualizations(
    parsed_output: dict[str, object] | None,
    valid_query_ids: set[str],
) -> list[VisualizationSpec]:
    if not parsed_output:
        return []

    raw_visualizations = parsed_output.get("visualizations")
    if not isinstance(raw_visualizations, list):
        return []

    visualizations: list[VisualizationSpec] = []
    for item in raw_visualizations:
        if not isinstance(item, dict):
            continue
        query_id = item.get("query_id")
        if not isinstance(query_id, str) or query_id not in valid_query_ids:
            continue
        try:
            visualizations.append(VisualizationSpec.model_validate(item))
        except Exception:
            continue
    return visualizations


def _should_use_dashboard_mode(
    parsed_output: dict[str, object] | None,
    payload: ChatRequest,
) -> bool:
    if payload.response_mode == "dashboard":
        return True
    return bool(_extract_generated_queries(parsed_output))


def _get_auto_executable_queries(
    parsed_output: dict[str, object] | None,
    payload: ChatRequest,
) -> list[GeneratedQuery]:
    if not parsed_output:
        return []

    generated_queries = _extract_generated_queries(parsed_output)
    if generated_queries:
        execution_context = parsed_output.get("execution_context")
        is_valid_prediction = execution_context.get("is_syntax_valid_prediction") if isinstance(execution_context, dict) else None
        if is_valid_prediction is not True:
            return []
        return generated_queries[: settings.dashboard_max_queries]

    single_query = _get_auto_executable_sql(parsed_output)
    if not single_query:
        return []
    return [GeneratedQuery(id="q1", name="main_query", purpose="Primary query", query=single_query)]


def _get_auto_executable_sql(parsed_output: dict[str, object] | None) -> str | None:
    if not parsed_output:
        return None

    execution_context = parsed_output.get("execution_context")
    query = parsed_output.get("query")
    if not isinstance(execution_context, dict) or not isinstance(query, str):
        return None

    is_valid_prediction = execution_context.get("is_syntax_valid_prediction")
    if is_valid_prediction is not True:
        return None

    normalized_query = query.strip()
    if not normalized_query:
        return None
    if not re.match(r"^(select|with)\b", normalized_query, flags=re.IGNORECASE):
        return None

    return normalized_query


def _has_suggested_query(existing: list[SuggestedQuery], sql: str) -> bool:
    normalized_sql = sql.strip()
    return any(item.sql.strip() == normalized_sql for item in existing)
