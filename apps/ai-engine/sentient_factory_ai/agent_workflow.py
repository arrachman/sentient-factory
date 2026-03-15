from __future__ import annotations

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
) -> tuple[str, list[SuggestedQuery], str, int]:
    max_passes = max(1, settings.agent_workflow_max_passes)

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
        semantic_schema_text=semantic_schema_text,
        system_prompt=ANALYSIS_PROMPT,
        request_timeout_seconds=settings.llm_request_timeout_seconds,
        max_retries=settings.llm_request_max_retries,
    )
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
