from __future__ import annotations

import json
import asyncio

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


async def generate_answer(
    *,
    api_base_url: str,
    model: str,
    api_key: str | None,
    question: str,
    messages: list[ChatMessage],
    semantic_schema_text: str,
) -> tuple[str, list[SuggestedQuery], str]:
    payload = {
        "model": model,
        "input": [
            {"role": "system", "content": [{"type": "input_text", "text": SYSTEM_PROMPT}]},
            {
                "role": "system",
                "content": [{"type": "input_text", "text": f"Semantic schema:\n{semantic_schema_text}"}],
            },
            *[
                {"role": item.role, "content": [{"type": "input_text", "text": item.content}]}
                for item in messages
            ],
            {"role": "user", "content": [{"type": "input_text", "text": question}]},
        ],
    }

    headers = {"Content-Type": "application/json"}
    if api_key:
        headers["Authorization"] = f"Bearer {api_key}"

    last_error: Exception | None = None
    for attempt in range(3):
        try:
            async with httpx.AsyncClient(timeout=60.0) as client:
                response = await client.post(f"{api_base_url.rstrip('/')}/responses", headers=headers, json=payload)
                response.raise_for_status()
                data = response.json()
                break
        except httpx.HTTPStatusError as error:
            details = error.response.text.strip()
            last_error = RuntimeError(f"LLM provider returned {error.response.status_code}: {details}")
        except httpx.HTTPError as error:
            last_error = RuntimeError(f"LLM provider request failed: {repr(error)}")

        if attempt < 2:
            await asyncio.sleep(1.25 * (attempt + 1))
    else:
        assert last_error is not None
        raise last_error

    answer = _extract_output_text(data)
    suggested_queries = _extract_suggested_queries(answer)
    return answer, suggested_queries, model


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
    return str(data.get("output_text") or "Maaf, model tidak mengembalikan jawaban.")


def _extract_suggested_queries(answer: str) -> list[SuggestedQuery]:
    marker = "```sql"
    if marker not in answer:
        return []

    suggestions: list[SuggestedQuery] = []
    parts = answer.split(marker)
    for part in parts[1:]:
        sql, _, _ = part.partition("```")
        cleaned = sql.strip()
        if cleaned:
            suggestions.append(SuggestedQuery(sql=cleaned, rationale="Derived from model answer."))
    return suggestions


def schema_to_prompt_text(schema_payload: dict) -> str:
    tables = schema_payload.get("tables", [])
    compact_tables = []

    for table in tables[:8]:
        compact_tables.append(
            {
                "schema": table.get("schema"),
                "name": table.get("name"),
                "primary_key": table.get("primary_key", []),
                "row_count_estimate": table.get("row_count_estimate"),
                "columns": [
                    {
                        "name": column.get("name"),
                        "data_type": column.get("data_type"),
                        "nullable": column.get("nullable"),
                    }
                    for column in table.get("columns", [])[:8]
                ],
            }
        )

    compact_payload = {
        "generated_at": schema_payload.get("generated_at"),
        "source": schema_payload.get("source"),
        "tables": compact_tables,
    }

    return json.dumps(compact_payload, ensure_ascii=True, indent=2, default=str)
