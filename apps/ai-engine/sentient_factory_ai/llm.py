from __future__ import annotations

import json
import asyncio
import re

import httpx

from .models import ChatMessage, SuggestedQuery


SYSTEM_PROMPT = """
You are the Sentient Factory AI analyst.
Answer in Bahasa Indonesia.
Use the provided semantic schema as the source of truth.
Never claim a query result was executed when it was not executed.
If data is insufficient, say so clearly.
If relevant, propose read-only SQL for the dashboard team.
""".strip()

MODEL_TEST_SYSTEM_PROMPT = """
You are a helpful AI assistant.
Answer the user's prompt directly and clearly.
""".strip()


async def generate_answer(
    *,
    api_base_url: str,
    model: str,
    api_key: str | None,
    question: str,
    messages: list[ChatMessage],
    semantic_schema_text: str,
    request_timeout_seconds: float = 60.0,
    max_retries: int = 2,
) -> tuple[str, list[SuggestedQuery], str]:
    answer, resolved_model = await request_text_response(
        api_base_url=api_base_url,
        model=model,
        api_key=api_key,
        messages=messages,
        question=question,
        semantic_schema_text=semantic_schema_text,
        request_timeout_seconds=request_timeout_seconds,
        max_retries=max_retries,
    )

    suggested_queries = _extract_suggested_queries(answer)
    return answer, suggested_queries, resolved_model


async def generate_test_answer(
    *,
    api_base_url: str,
    model: str,
    api_key: str | None,
    prompt: str,
    request_timeout_seconds: float = 60.0,
    max_retries: int = 2,
) -> tuple[str, str]:
    return await request_text_response(
        api_base_url=api_base_url,
        model=model,
        api_key=api_key,
        messages=[],
        question=prompt,
        semantic_schema_text="",
        system_prompt=MODEL_TEST_SYSTEM_PROMPT,
        additional_system_messages=[],
        request_timeout_seconds=request_timeout_seconds,
        max_retries=max_retries,
    )


async def request_text_response(
    *,
    api_base_url: str,
    model: str,
    api_key: str | None,
    messages: list[ChatMessage],
    question: str,
    semantic_schema_text: str,
    system_prompt: str = SYSTEM_PROMPT,
    additional_system_messages: list[str] | None = None,
    request_timeout_seconds: float = 20.0,
    max_retries: int = 1,
) -> tuple[str, str]:
    payload = {
        "model": model,
        "input": _build_input_messages(
            messages=messages,
            question=question,
            semantic_schema_text=semantic_schema_text,
            system_prompt=system_prompt,
            additional_system_messages=additional_system_messages or [],
        ),
    }

    headers = {"Content-Type": "application/json"}
    if api_key:
        headers["Authorization"] = f"Bearer {api_key}"

    last_error: Exception | None = None
    retry_count = max(0, max_retries)
    for attempt in range(retry_count + 1):
        try:
            async with httpx.AsyncClient(timeout=request_timeout_seconds) as client:
                response = await client.post(f"{api_base_url.rstrip('/')}/responses", headers=headers, json=payload)
                response.raise_for_status()
                data = response.json()
                break
        except httpx.HTTPStatusError as error:
            details = error.response.text.strip()
            last_error = RuntimeError(f"LLM provider returned {error.response.status_code}: {details}")
        except httpx.ReadTimeout:
            last_error = RuntimeError(
                f"LLM provider timed out after {request_timeout_seconds:g}s while waiting for a response."
            )
        except httpx.HTTPError as error:
            last_error = RuntimeError(f"LLM provider request failed: {repr(error)}")

        if attempt < retry_count:
            await asyncio.sleep(2.5 * (attempt + 1))
    else:
        assert last_error is not None
        raise last_error

    answer = _extract_output_text(data)
    return answer, model


def _build_input_messages(
    *,
    messages: list[ChatMessage],
    question: str,
    semantic_schema_text: str,
    system_prompt: str,
    additional_system_messages: list[str],
) -> list[dict]:
    def build_message(role: str, text: str) -> dict:
        return {"role": role, "content": [{"type": "input_text", "text": text}]}

    inputs: list[dict] = [build_message("system", system_prompt)]

    if semantic_schema_text.strip():
        inputs.append(build_message("system", f"Semantic schema:\n{semantic_schema_text}"))

    inputs.extend(build_message("system", extra) for extra in additional_system_messages)

    inputs.extend(build_message(item.role, item.content) for item in messages)
    inputs.append(build_message("user", question))
    return inputs


def _extract_output_text(data: dict) -> str:
    output = data.get("output", [])
    texts: list[str] = []
    for item in output:
        for content in item.get("content", []):
            text = content.get("text")
            if text:
                texts.append(str(text))
    if texts:
        return "\n".join(texts).strip()
    return str(data.get("output_text") or "").strip()


def _extract_suggested_queries(answer: str) -> list[SuggestedQuery]:
    marker = "```sql"
    if marker not in answer:
        return []

    suggestions: list[SuggestedQuery] = []
    parts = answer.split(marker)
    for part in parts[1:]:
        sql, _, _ = part.partition("```")
        cleaned = sql.strip()
        if _looks_like_sql_statement(cleaned):
            suggestions.append(SuggestedQuery(sql=cleaned, rationale="Derived from model answer."))
    return suggestions


def extract_valid_suggested_queries(answer: str, rationale: str) -> list[SuggestedQuery]:
    marker = "```sql"
    if marker not in answer:
        return []

    suggestions: list[SuggestedQuery] = []
    parts = answer.split(marker)
    for part in parts[1:]:
        sql, _, _ = part.partition("```")
        cleaned = sql.strip()
        if _looks_like_sql_statement(cleaned):
            suggestions.append(SuggestedQuery(sql=cleaned, rationale=rationale))
    return suggestions


def _looks_like_sql_statement(candidate: str) -> bool:
    normalized = candidate.strip()
    if not normalized:
        return False

    if len(normalized) < 20:
        return False

    first_line = normalized.splitlines()[0].strip().lower()
    if not re.match(r"^(select|with|insert|update|delete)\b", first_line):
        return False

    normalized_lower = normalized.lower()
    if not re.search(r"\bfrom\b", normalized_lower) and not first_line.startswith("with"):
        return False

    return True


def schema_to_prompt_text(schema_payload: dict) -> str:
    tables = schema_payload.get("tables", [])
    compact_tables = []

    for table in tables[:12]:
        compact_tables.append(
            {
                "schema": table.get("schema"),
                "name": table.get("name"),
                "alias": table.get("alias"),
                "description": table.get("table_description") or table.get("description"),
                "synonyms": table.get("synonyms", []),
                "always_apply_filters": table.get("always_apply_filters"),
                "primary_key": table.get("primary_key", []),
                "row_count_estimate": table.get("row_count_estimate"),
                "metrics": table.get("metrics", {}),
                "relationships": table.get("relationships", []),
                "columns": [
                    {
                        "name": column.get("name"),
                        "data_type": column.get("data_type"),
                        "nullable": column.get("nullable"),
                        "description": column.get("description"),
                    }
                    for column in table.get("columns", [])[:12]
                ],
            }
        )

    compact_payload = {
        "generated_at": schema_payload.get("generated_at"),
        "source": schema_payload.get("source"),
        "tables": compact_tables,
    }

    return json.dumps(compact_payload, ensure_ascii=True, indent=2, default=str)
