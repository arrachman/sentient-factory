from __future__ import annotations

from ..llm import request_text_response
from ..sql_output_parser import (
    _build_deterministic_query_fallback,
    _parse_sql_generator_output,
)


async def _request_sql_generator_output(
    *,
    api_base_url: str,
    model: str,
    api_key: str | None,
    messages: list,
    question: str,
    schema_key: str | None,
    analysis_prompt: str,
    request_timeout_seconds: float,
    max_retries: int,
) -> tuple[str, str, dict[str, object] | None]:
    raw_answer, resolved_model = await request_text_response(
        api_base_url=api_base_url,
        model=model,
        api_key=api_key,
        messages=messages,
        question=question,
        semantic_schema_text="",
        system_prompt=analysis_prompt,
        request_timeout_seconds=request_timeout_seconds,
        max_retries=max_retries,
    )
    parsed_answer = _parse_sql_generator_output(raw_answer)
    if parsed_answer is not None:
        return raw_answer, resolved_model, parsed_answer

    repair_instruction = (
        "Respons sebelumnya tidak valid untuk parser. "
        "Balas ulang HANYA dengan SATU objek JSON valid tanpa markdown, tanpa penjelasan tambahan, "
        "tanpa code fence, dan tanpa teks sebelum/sesudah JSON. "
        "Gunakan tepat format output yang sudah diminta prompt utama. "
        "Jika tidak bisa membuat query, tetap balas dengan objek JSON valid status FAILED.\n\n"
        f"Respons sebelumnya:\n{raw_answer or '[EMPTY RESPONSE]'}"
    )
    repaired_answer, repaired_model = await request_text_response(
        api_base_url=api_base_url,
        model=model,
        api_key=api_key,
        messages=messages,
        question=question,
        semantic_schema_text="",
        system_prompt=analysis_prompt,
        additional_system_messages=[repair_instruction],
        request_timeout_seconds=request_timeout_seconds,
        max_retries=0,
    )
    repaired_parsed = _parse_sql_generator_output(repaired_answer)
    if repaired_parsed is not None:
        return repaired_answer, repaired_model, repaired_parsed

    fallback = _build_deterministic_query_fallback(question, schema_key)
    return repaired_answer, repaired_model, fallback
