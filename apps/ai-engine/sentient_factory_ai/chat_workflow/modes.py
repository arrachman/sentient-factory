from __future__ import annotations

import json

from ..insight_prompts import (
    _build_multi_query_result_insight_fallback,
    _build_multi_query_result_insight_prompt,
    _build_query_result_insight_fallback,
    _build_query_result_insight_prompt,
)
from ..llm import request_text_response
from ..llm_settings import settings
from ..models import (
    GeneratedQuery,
    PerQueryExecutionResult,
)
from ..postgres_client import execute_multiple_read_only_queries, execute_read_only_query
from ..query_extraction import (
    _extract_generated_queries,
    _extract_visualizations,
    _get_auto_executable_sql,
)
from ..sql_output_parser import (
    _format_user_friendly_failure_message,
    _is_failed_sql_generator_output,
    _looks_like_general_non_data_question,
)
from fastapi import HTTPException

from .sql_generator import _request_sql_generator_output


async def _run_attachment_mode(ctx) -> None:
    payload = ctx.payload
    attachment_warnings = [
        attachment.warning
        for attachment in payload.attachments
        if attachment.warning
    ]
    ctx.response_text, ctx.resolved_model = await request_text_response(
        api_base_url=ctx.api_base_url,
        model=ctx.model,
        api_key=ctx.api_key,
        messages=payload.messages,
        question=ctx.effective_question,
        semantic_schema_text="",
        system_prompt=(
            "Anda adalah asisten AI yang membaca attachment user dalam Bahasa Indonesia. "
            "Fokus utama Anda adalah konten lampiran yang sudah diekstrak atau di-OCR oleh sistem. "
            "Jawab pertanyaan user berdasarkan isi attachment terlebih dahulu. "
            "Jika teks attachment parsial, OCR tidak sempurna, atau ada warning, sebutkan keterbatasannya secara singkat. "
            "Jangan memaksa SQL, schema ERP, atau semantic schema jika pertanyaan utamanya tentang isi dokumen/gambar attachment."
        ),
        additional_system_messages=[
            (
                "Warning attachment yang terdeteksi:\n- "
                + "\n- ".join(attachment_warnings)
            )
            if attachment_warnings
            else "Tidak ada warning tambahan pada attachment."
        ],
        request_timeout_seconds=settings.llm_request_timeout_seconds,
        max_retries=settings.llm_request_max_retries,
    )
    ctx.answer = ctx.response_text
    ctx.execution_status = "SUCCESS"
    ctx.data_source = "attachment_context"


async def _run_agent_mode(ctx) -> None:
    from ..agent_workflow import run_agent_workflow

    payload = ctx.payload
    ctx.answer, ctx.suggested_queries, ctx.resolved_model, ctx.workflow_passes = await run_agent_workflow(
        api_base_url=ctx.api_base_url,
        model=ctx.model,
        api_key=ctx.api_key,
        request_id=ctx.request_id,
        question=ctx.effective_question,
        messages=payload.messages,
        semantic_schema_text="",
        analysis_prompt=ctx.analysis_prompt,
        analysis_prompt_source=ctx.analysis_prompt_source,
    )
    ctx.response_text = ctx.answer
    ctx.execution_status = "SUCCESS"


async def _run_sql_generator_mode(ctx) -> None:
    payload = ctx.payload
    raw_answer, ctx.resolved_model, ctx.parsed_answer = await _request_sql_generator_output(
        api_base_url=ctx.api_base_url,
        model=ctx.model,
        api_key=ctx.api_key,
        messages=payload.messages,
        question=ctx.effective_question,
        schema_key=ctx.selected_schema_key,
        request_timeout_seconds=settings.llm_request_timeout_seconds,
        max_retries=settings.llm_request_max_retries,
        analysis_prompt=ctx.analysis_prompt,
    )
    parsed_answer = ctx.parsed_answer
    if not parsed_answer:
        raise RuntimeError("LLM tidak mengembalikan JSON object yang valid.")
    if _is_failed_sql_generator_output(parsed_answer):
        debug_info = parsed_answer.get("debug_info")
        if not isinstance(debug_info, dict):
            debug_info = {}
            parsed_answer["debug_info"] = debug_info

        failure_reason = parsed_answer.get("error_message")
        if not isinstance(failure_reason, str) or not failure_reason.strip():
            failure_reason = "SQL generator menandai response sebagai gagal."
        else:
            failure_reason = _format_user_friendly_failure_message(failure_reason)
            parsed_answer["error_message"] = failure_reason

        debug_info["reasoning"] = failure_reason.strip()
    else:
        ctx.generated_queries = _extract_generated_queries(parsed_answer)
        if not ctx.generated_queries:
            single_query = _get_auto_executable_sql(parsed_answer)
            if single_query:
                ctx.generated_queries = [
                    GeneratedQuery(
                        id="q1",
                        name="main_query",
                        purpose="Primary query",
                        query=single_query,
                    )
                ]
        ctx.visualizations = _extract_visualizations(
            parsed_answer,
            {item.id for item in ctx.generated_queries},
        )
        if payload.execute_read_only_query and ctx.generated_queries:
            if not settings.database_url:
                raise HTTPException(status_code=500, detail="DATABASE_URL is not configured.")
            await ctx.publish_progress(
                "query_execution_started",
                {
                    "label": "Query execution started",
                    "progress": 40,
                    "type": "chain_of_thought",
                    "response": (
                        f"{len(ctx.generated_queries)} query read-only sedang dijalankan."
                        if len(ctx.generated_queries) > 1
                        else "Query read-only dari parsed_answer.query sedang dijalankan."
                    ),
                },
            )
            if len(ctx.generated_queries) == 1:
                ctx.query_result = execute_read_only_query(
                    settings.database_url,
                    ctx.generated_queries[0].query,
                )
                ctx.query_results = [
                    PerQueryExecutionResult(
                        query_id=ctx.generated_queries[0].id,
                        sql=ctx.query_result.sql,
                        success=True,
                        row_count=ctx.query_result.row_count,
                        columns=ctx.query_result.columns,
                        rows=ctx.query_result.rows,
                    )
                ]
                ctx.execution_status = "SUCCESS"
            else:
                ctx.query_results = execute_multiple_read_only_queries(
                    settings.database_url,
                    [(item.id, item.query) for item in ctx.generated_queries],
                    max_queries=settings.dashboard_max_queries,
                )
                success_count = sum(1 for item in ctx.query_results if item.success)
                if success_count == len(ctx.query_results):
                    ctx.execution_status = "SUCCESS"
                elif success_count > 0:
                    ctx.execution_status = "PARTIAL_SUCCESS"
                else:
                    ctx.execution_status = "FAILED"
            ctx.data_source = "postgres_obt"
            await ctx.publish_progress(
                "query_execution_completed",
                {
                    "label": "Query execution completed",
                    "progress": 60,
                    "type": "data",
                    "response": (
                        ctx.query_result.model_dump(mode="json").get("rows")
                        if ctx.query_result
                        else [item.model_dump(mode="json") for item in ctx.query_results]
                    ),
                },
            )
        elif ctx.generated_queries:
            ctx.execution_status = "SUCCESS"
    ctx.answer = json.dumps(parsed_answer, ensure_ascii=True)
    if _is_failed_sql_generator_output(parsed_answer):
        ctx.response_text = _format_user_friendly_failure_message(
            str(parsed_answer.get("error_message") or "")
        )
        if _looks_like_general_non_data_question(ctx.effective_question):
            try:
                ctx.response_text, _ = await request_text_response(
                    api_base_url=ctx.api_base_url,
                    model=ctx.model,
                    api_key=ctx.api_key,
                    messages=payload.messages,
                    question=ctx.effective_question,
                    semantic_schema_text="",
                    system_prompt=(
                        "Anda adalah asisten AI yang menjawab pertanyaan umum user dalam Bahasa Indonesia. "
                        "Jawab langsung pertanyaan user dengan ringkas, natural, dan relevan. "
                        "Jangan membahas schema, database, SQL, atau keterbatasan data jika pertanyaannya memang tidak membutuhkan data bisnis."
                    ),
                    request_timeout_seconds=settings.llm_request_timeout_seconds,
                    max_retries=0,
                )
            except Exception:
                pass
    else:
        if len(ctx.query_results) > 1:
            await ctx.publish_progress(
                "ai_insight_started",
                {
                    "label": "AI insight started",
                    "progress": 75,
                    "type": "chain_of_thought",
                    "response": "AI sedang merangkum insight dari beberapa hasil query.",
                },
            )
            ctx.response_text, _ = await request_text_response(
                api_base_url=ctx.api_base_url,
                model=ctx.model,
                api_key=ctx.api_key,
                messages=[],
                question=_build_multi_query_result_insight_prompt(
                    user_question=ctx.effective_question,
                    query_results=ctx.query_results,
                    visualizations=ctx.visualizations,
                ),
                semantic_schema_text="",
                system_prompt=(
                    "Anda adalah AI analyst untuk hasil dashboard bisnis. "
                    "Baca hasil beberapa query, jelaskan insight utama secara ringkas dalam Bahasa Indonesia, "
                    "dan sebutkan jika ada blok yang gagal atau hanya partial success."
                ),
                request_timeout_seconds=settings.llm_request_timeout_seconds,
                max_retries=settings.llm_request_max_retries,
            )
            if not ctx.response_text or not ctx.response_text.strip():
                ctx.response_text = _build_multi_query_result_insight_fallback(
                    user_question=ctx.effective_question,
                    query_results=ctx.query_results,
                )
            await ctx.publish_progress(
                "ai_insight_completed",
                {
                    "label": "AI insight completed",
                    "progress": 90,
                    "type": "insight",
                    "response": ctx.response_text,
                },
            )
        elif ctx.query_result:
            await ctx.publish_progress(
                "ai_insight_started",
                {
                    "label": "AI insight started",
                    "progress": 75,
                    "type": "chain_of_thought",
                    "response": "AI sedang merangkum insight dari hasil query.",
                },
            )
            ctx.response_text, _ = await request_text_response(
                api_base_url=ctx.api_base_url,
                model=ctx.model,
                api_key=ctx.api_key,
                messages=[],
                question=_build_query_result_insight_prompt(
                    user_question=ctx.effective_question,
                    # NOTE: Verbatim behavior preserved. The original code was
                    # `auto_execute_sql if 'auto_execute_sql' in locals() else None`
                    # but `auto_execute_sql` was never defined in `_execute_chat_query`,
                    # so this expression always evaluated to None. Kept as None.
                    sql=auto_execute_sql if 'auto_execute_sql' in locals() else None,
                    query_result=ctx.query_result,
                ),
                semantic_schema_text="",
                system_prompt=(
                    "Anda adalah AI analyst untuk hasil query bisnis. "
                    "Baca hasil query, jelaskan insight utama secara ringkas dalam Bahasa Indonesia, "
                    "fokus pada temuan yang benar-benar terlihat di data, dan jangan berhalusinasi."
                ),
                request_timeout_seconds=settings.llm_request_timeout_seconds,
                max_retries=settings.llm_request_max_retries,
            )
            if not ctx.response_text or not ctx.response_text.strip():
                ctx.response_text = _build_query_result_insight_fallback(
                    user_question=ctx.effective_question,
                    query_result=ctx.query_result,
                )
            await ctx.publish_progress(
                "ai_insight_completed",
                {
                    "label": "AI insight completed",
                    "progress": 90,
                    "type": "insight",
                    "response": ctx.response_text,
                },
            )
        elif ctx.generated_queries:
            ctx.response_text = (
                f"Rencana dashboard berhasil dibuat dengan {len(ctx.generated_queries)} query "
                "dan metadata visualisasi, tetapi query belum dijalankan karena "
                "`execute_read_only_query=false`."
            )
    ctx.workflow_passes = 1
