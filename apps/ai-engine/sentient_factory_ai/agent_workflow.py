from __future__ import annotations

import json
from pathlib import Path

from .llm import extract_valid_suggested_queries, request_text_response
from .models import ChatMessage, SuggestedQuery
from .progress_stream import broker
from .settings import get_settings


ANALYSIS_PROMPT = """
You are in analysis mode.
Analyze the user's intent, identify the likely business domain, relevant tables, likely joins, required filters, and possible ambiguities.
Do not answer the user yet.
Return concise structured analysis in Bahasa Indonesia.
""".strip()

REVIEW_PROMPT = """
You are in review mode.
Review the draft answer for correctness, overclaiming, schema misuse, and hallucination risk.
If the draft is weak, rewrite it into a safer and more precise final answer.
Answer in Bahasa Indonesia.
""".strip()

settings = get_settings()


async def run_agent_workflow(
    *,
    api_base_url: str,
    model: str,
    api_key: str | None,
    request_id: str,
    question: str,
    messages: list[ChatMessage],
    semantic_schema_text: str,
    analysis_prompt: str,
    analysis_prompt_source: str,
) -> tuple[str, list[SuggestedQuery], str, int]:
    max_passes = max(1, settings.agent_workflow_max_passes)

    # 3. Kirim event bahwa prompt analisis sudah dimuat dan sumber prompt tercatat.
    await broker.publish(
        request_id,
        "analysis_prompt_loaded",
        {
            "step": "analysis",
            "label": "Analysis prompt loaded",
            "progress": 8,
            "summary": f"Step pertama memakai prompt dari {analysis_prompt_source}.",
            "prompt_source": analysis_prompt_source,
            "prompt_preview": _truncate_text(analysis_prompt, 1200),
        },
    )
    # 4. Kirim event bahwa step analisis mulai dijalankan oleh model.
    await broker.publish(
        request_id,
        "analysis_started",
        {
            "step": "analysis",
            "label": "Analysis started",
            "progress": 10,
            "summary": "Workflow mulai menganalisis intent, domain bisnis, tabel, join, dan ambiguitas.",
        },
    )
    analysis, resolved_model = await request_text_response(
        api_base_url=api_base_url,
        model=model,
        api_key=api_key,
        messages=messages,
        question=question,
        semantic_schema_text="",
        system_prompt=analysis_prompt,
        request_timeout_seconds=settings.llm_request_timeout_seconds,
        max_retries=settings.llm_request_max_retries,
    )
    _raise_if_first_step_failed(analysis)
    # 5. Kirim event bahwa hasil analisis sudah tersedia untuk step berikutnya.
    await broker.publish(
        request_id,
        "analysis_done",
        {
            "step": "analysis",
            "label": "Analysis complete",
            "progress": 35,
            "summary": _to_progress_summary(analysis),
        },
    )

    if max_passes == 1:
        return analysis, _extract_queries_from_answer(analysis), resolved_model, 1

    draft_instruction = (
        "Gunakan analisis berikut untuk menyusun jawaban yang matang, hati-hati, dan praktis. "
        "Jangan mengklaim hasil query sudah dieksekusi. Jika relevan, usulkan SQL read-only.\n\n"
        f"Analisis internal:\n{analysis}"
    )

    # 6. Kirim event bahwa workflow masuk ke step penyusunan draft jawaban.
    await broker.publish(
        request_id,
        "draft_started",
        {
            "step": "draft",
            "label": "Draft started",
            "progress": 45,
            "summary": "Workflow mulai menyusun jawaban draft berdasarkan hasil analisis.",
        },
    )
    draft, _ = await request_text_response(
        api_base_url=api_base_url,
        model=model,
        api_key=api_key,
        messages=messages,
        question=question,
        semantic_schema_text=semantic_schema_text,
        additional_system_messages=[draft_instruction],
        request_timeout_seconds=settings.llm_request_timeout_seconds,
        max_retries=settings.llm_request_max_retries,
    )
    # 7. Kirim event bahwa draft jawaban sudah selesai dibuat.
    await broker.publish(
        request_id,
        "draft_done",
        {
            "step": "draft",
            "label": "Draft complete",
            "progress": 70,
            "summary": _to_progress_summary(draft),
        },
    )

    if max_passes == 2:
        return draft, _extract_queries_from_answer(draft), resolved_model, 2

    review_instruction = (
        "Periksa draft berikut. Pastikan tidak berhalusinasi, sesuai semantic schema, dan memberi jawaban final yang matang.\n\n"
        f"Draft:\n{draft}"
    )

    # 8. Kirim event bahwa draft sedang direview sebelum dijadikan jawaban final.
    await broker.publish(
        request_id,
        "review_started",
        {
            "step": "review",
            "label": "Review started",
            "progress": 80,
            "summary": "Workflow sedang mereview draft untuk mengurangi halusinasi dan memperbaiki presisi.",
        },
    )
    final_answer, _ = await request_text_response(
        api_base_url=api_base_url,
        model=model,
        api_key=api_key,
        messages=messages,
        question=question,
        semantic_schema_text=semantic_schema_text,
        system_prompt=REVIEW_PROMPT,
        additional_system_messages=[review_instruction],
        request_timeout_seconds=settings.llm_request_timeout_seconds,
        max_retries=settings.llm_request_max_retries,
    )
    # 9. Kirim event bahwa review selesai dan final answer sudah siap dikembalikan.
    await broker.publish(
        request_id,
        "review_done",
        {
            "step": "review",
            "label": "Review complete",
            "progress": 95,
            "summary": _to_progress_summary(final_answer),
        },
    )

    return final_answer, _extract_queries_from_answer(final_answer), resolved_model, 3


def _extract_queries_from_answer(answer: str) -> list[SuggestedQuery]:
    return extract_valid_suggested_queries(answer, "Derived from reviewed workflow answer.")


def _to_progress_summary(text: str, max_length: int = 280) -> str:
    compact = " ".join(text.split())
    if len(compact) <= max_length:
        return compact
    return f"{compact[: max_length - 3].rstrip()}..."


def _truncate_text(text: str, max_length: int) -> str:
    compact = text.strip()
    if len(compact) <= max_length:
        return compact
    return f"{compact[: max_length - 3].rstrip()}..."


def build_first_step_prompt(user_prompt: str) -> tuple[str, str]:
    prompt_path = settings.agent_workflow_first_prompt_path
    try:
        prompt_template = prompt_path.read_text(encoding="utf-8").strip()
    except OSError as error:
        raise RuntimeError(
            f"Gagal membaca prompt step pertama di {prompt_path}: {error}"
        ) from error

    if not prompt_template:
        raise RuntimeError(f"Prompt step pertama kosong: {prompt_path}")

    semantic_schema_json = _read_required_text(
        _resolve_existing_path(settings.semantic_schema_manifest_path),
        "semantic schema utama",
    )
    semantic_query_schema_sales_json = _read_required_text(
        _resolve_existing_path(settings.semantic_query_schema_sales_path),
        "semantic query schema OBT",
    )

    prompt_with_context = (
        prompt_template.replace("{{SEMANTIC_SCHEMA_JSON}}", semantic_schema_json)
        .replace("{{SEMANTIC_QUERY_SCHEMA_SALES_JSON}}", semantic_query_schema_sales_json)
        .replace("{{USER_QUESTION}}", user_prompt)
    )
    if "{{SEMANTIC_SCHEMA_JSON}}" in prompt_with_context:
        raise RuntimeError(f"Placeholder SEMANTIC_SCHEMA_JSON belum tergantikan di {prompt_path}")
    if "{{SEMANTIC_QUERY_SCHEMA_SALES_JSON}}" in prompt_with_context:
        raise RuntimeError(
            f"Placeholder SEMANTIC_QUERY_SCHEMA_SALES_JSON belum tergantikan di {prompt_path}"
        )
    if "{{USER_QUESTION}}" in prompt_with_context:
        raise RuntimeError(f"Placeholder USER_QUESTION belum tergantikan di {prompt_path}")

    return prompt_with_context, str(prompt_path)


def _resolve_existing_path(configured_path: Path) -> Path:
    candidates = [
        configured_path,
        Path("/app") / configured_path,
        Path(__file__).resolve().parents[2] / configured_path,
    ]

    if configured_path.name == "semantic-query-schema-sales.json":
        candidates.extend(
            [
                Path("/myerpplus-db-mapping/db/semantic-query-schema-sales.json"),
                Path("apps/myerpplus-db-mapping/db/semantic-query-schema-sales.json"),
            ]
        )
    if configured_path.name == "semantic-schema-sales.json":
        candidates.extend(
            [
                Path("/home/rania/apps/sentient-factory/apps/myerpplus-db-mapping/db/semantic-schema-sales.json"),
                Path("/myerpplus-db-mapping/db/semantic-schema-sales.json"),
                Path("apps/myerpplus-db-mapping/db/semantic-schema-sales.json"),
            ]
        )
    if configured_path.name == "semantic-schema.json":
        candidates.extend(
            [
                Path("/myerpplus-db-mapping/db/semantic-schema.json"),
                Path("apps/myerpplus-db-mapping/db/semantic-schema.json"),
            ]
        )

    for candidate in candidates:
        resolved = candidate.resolve()
        if resolved.exists():
            return resolved

    raise RuntimeError(f"File tidak ditemukan: {configured_path}")


def _read_required_text(path: Path, label: str) -> str:
    try:
        text = path.read_text(encoding="utf-8").strip()
    except OSError as error:
        raise RuntimeError(f"Gagal membaca {label} di {path}: {error}") from error

    if not text:
        raise RuntimeError(f"File {label} kosong: {path}")
    return text


def _raise_if_first_step_failed(analysis: str) -> None:
    parsed_analysis = _parse_json_object(analysis)
    if not parsed_analysis:
        return

    success_value = parsed_analysis.get("success")
    status_value = parsed_analysis.get("status")

    is_failed = success_value is False or (
        isinstance(status_value, str) and status_value.strip().upper() == "FAILED"
    )
    if not is_failed:
        return

    error_message = parsed_analysis.get("error_message")
    if not isinstance(error_message, str) or not error_message.strip():
        error_message = "Prompt step pertama mengembalikan status gagal."

    raise RuntimeError(error_message.strip())


def _parse_json_object(candidate: str) -> dict[str, object] | None:
    text = candidate.strip()
    if not text.startswith("{"):
        return None

    try:
        parsed = json.loads(text)
    except json.JSONDecodeError:
        return None

    if isinstance(parsed, dict):
        return parsed
    return None
