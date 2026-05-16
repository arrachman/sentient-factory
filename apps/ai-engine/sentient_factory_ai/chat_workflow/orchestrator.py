from __future__ import annotations

from time import perf_counter
from types import SimpleNamespace

from fastapi import HTTPException

from ..agent_workflow import build_first_step_prompt
from ..audit_logging import _log_chat_request, _persist_audit_log
from ..chat_request_parsing import _build_effective_question, resolve_workflow_mode
from ..insight_prompts import _normalize_question_for_response_mode
from ..llm import request_text_response
from ..llm_settings import resolve_llm_settings, settings
from ..models import (
    ChatRequest,
    ChatResponseData,
    SemanticSchemaResponse,
)
from ..progress_stream import broker
from .modes import _run_agent_mode, _run_attachment_mode, _run_sql_generator_mode


async def _execute_chat_query(payload: ChatRequest) -> dict[str, object]:
    # 1. Siapkan metadata request dan state awal workflow untuk satu eksekusi chat.
    #
    # NOTE: The original _execute_chat_query kept all of this as plain locals.
    # The body was sub-split into chat_workflow/modes.py; to relocate the
    # per-mode blocks verbatim (they mutate this shared state, sometimes
    # partially before raising) the state now lives on `ctx`. Every read site
    # below — success path, both except blocks, and the final payload — reads
    # from `ctx`, so partial mutations made before an exception are still
    # visible to the except handlers exactly like the original locals were.
    started_at = perf_counter()
    request_id = payload.request_id or f"req-{int(started_at * 1000000)}"
    selected_schema_key = payload.schema_key or settings.semantic_schema_key
    workflow_mode = resolve_workflow_mode(payload)
    audit_event_history: list[dict[str, object]] = []

    async def publish_progress(event: str, body: dict[str, object]) -> None:
        audit_event_history.append(
            {
                "event": event,
                **body,
            }
        )
        await broker.publish(request_id, event, body)

    ctx = SimpleNamespace(
        payload=payload,
        request_id=request_id,
        selected_schema_key=selected_schema_key,
        publish_progress=publish_progress,
        # Pre-try locals from the original.
        workflow_passes=1,
        query_result=None,
        query_results=[],
        generated_queries=[],
        visualizations=[],
        execution_status=None,
        data_source="myerpplus" if settings.myerpplus_database_url else "semantic_schema_only",
        response_text=None,
        parsed_answer=None,
        # Top-of-try locals from the original (constant initial values).
        schema=None,
        answer="",
        suggested_queries=[],
        resolved_model="prompt-builder",
        analysis_prompt="",
        analysis_prompt_source="",
        effective_question="",
        model=None,
        api_base_url=None,
        api_key=None,
    )

    try:
        schema: SemanticSchemaResponse | None = None
        ctx.schema = schema
        ctx.answer = ""
        ctx.effective_question = _build_effective_question(payload)
        ctx.suggested_queries = []
        ctx.resolved_model = "prompt-builder"
        # 3. Muat prompt sales SQL generator dari file dan isi placeholder schema utama, schema sales, dan pertanyaan user.
        ctx.analysis_prompt, ctx.analysis_prompt_source = build_first_step_prompt(
            _normalize_question_for_response_mode(ctx.effective_question, payload.response_mode)
        )

        ctx.model, ctx.api_base_url, ctx.api_key = resolve_llm_settings(payload.model_profile)
        if not ctx.model or not ctx.api_base_url:
            raise HTTPException(status_code=500, detail="LLM configuration is incomplete.")

        started_response = "Request diterima dan workflow dimasukkan ke antrian proses."
        try:
            started_response, _ = await request_text_response(
                api_base_url=ctx.api_base_url,
                model=ctx.model,
                api_key=ctx.api_key,
                messages=[],
                question=ctx.effective_question,
                semantic_schema_text="",
                system_prompt=(
                    "Anda adalah AI assistant untuk status awal workflow. "
                    "Tuliskan satu kalimat singkat dalam Bahasa Indonesia yang menjelaskan ulang maksud pertanyaan user "
                    "dan menjelaskan langkah berikutnya yang paling relevan. "
                    "Jika pertanyaan user memang membutuhkan data bisnis, sebutkan bahwa kami sedang mengecek database "
                    "dan hasilnya akan dilaporkan dalam bentuk visual serta insight. "
                    "Jika pertanyaan user bersifat umum, perkenalan, atau tidak membutuhkan data database, jangan menyebut database "
                    "dan cukup jelaskan bahwa kami sedang menyiapkan jawaban yang sesuai. "
                    "Jangan jawab dengan data akhir, jangan buat bullet, dan jangan lebih dari 60 kata."
                ),
                request_timeout_seconds=settings.llm_request_timeout_seconds,
                max_retries=0,
            )
        except Exception:
            pass

        # 2. Kirim event awal bahwa request diterima dan workflow resmi dimulai.
        await publish_progress(
            "started",
            {
                "label": "Workflow accepted",
                "progress": 0,
                "type": "chain_of_thought",
                "response": started_response,
            },
        )

        if workflow_mode == "attachment":
            await _run_attachment_mode(ctx)
        elif workflow_mode == "agent" and settings.agent_workflow_enabled:
            await _run_agent_mode(ctx)
        else:
            await _run_sql_generator_mode(ctx)
    except HTTPException:
        await publish_progress(
            "failed",
            {
                "workflow_mode": workflow_mode,
                "workflow_passes": ctx.workflow_passes,
                "error": "http_exception",
                "label": "Workflow failed",
                "progress": 100,
                "type": "failed",
                "response": "Workflow gagal karena HTTP exception.",
            },
        )
        # 98. Simpan audit setelah event final gagal masuk ke history.
        _persist_audit_log(
            request_id=request_id,
            question=payload.question,
            answer=None,
            session_key=payload.session_key,
            channel=payload.channel,
            ui_mode=payload.ui_mode,
            schema_key=selected_schema_key,
            schema_source=settings.semantic_schema_source,
            workflow_mode=workflow_mode,
            workflow_passes=ctx.workflow_passes,
            include_schema=payload.include_schema,
            success=False,
            duration_ms=(perf_counter() - started_at) * 1000,
            response_text=ctx.response_text,
            parsed_answer=ctx.parsed_answer,
            query_result=ctx.query_result.model_dump(mode="json") if ctx.query_result else None,
            suggested_queries=[item.model_dump(mode="json") for item in ctx.suggested_queries],
            event_history=audit_event_history,
            provider=ctx.api_base_url,
            model=ctx.resolved_model,
            data_source=ctx.data_source,
        )
        _log_chat_request(
            request_id=request_id,
            question=payload.question,
            schema_key=selected_schema_key,
            schema_source=settings.semantic_schema_source,
            workflow_mode=workflow_mode,
            workflow_passes=ctx.workflow_passes,
            include_schema=payload.include_schema,
            success=False,
            duration_ms=(perf_counter() - started_at) * 1000,
        )
        raise
    except Exception as error:  # pragma: no cover
        print(f"[ai-engine] chat_query failed: {error!r}")
        await publish_progress(
            "failed",
            {
                "workflow_mode": workflow_mode,
                "workflow_passes": ctx.workflow_passes,
                "error": str(error),
                "label": "Workflow failed",
                "progress": 100,
                "type": "failed",
                "response": f"Workflow gagal: {str(error)[:240]}",
            },
        )
        # 99. Simpan audit setelah event final gagal masuk ke history.
        _persist_audit_log(
            request_id=request_id,
            question=payload.question,
            answer=None,
            session_key=payload.session_key,
            channel=payload.channel,
            ui_mode=payload.ui_mode,
            schema_key=selected_schema_key,
            schema_source=settings.semantic_schema_source,
            workflow_mode=workflow_mode,
            workflow_passes=ctx.workflow_passes,
            include_schema=payload.include_schema,
            success=False,
            duration_ms=(perf_counter() - started_at) * 1000,
            error_message=str(error),
            response_text=ctx.response_text,
            parsed_answer=ctx.parsed_answer,
            query_result=ctx.query_result.model_dump(mode="json") if ctx.query_result else None,
            suggested_queries=[item.model_dump(mode="json") for item in ctx.suggested_queries],
            event_history=audit_event_history,
            provider=ctx.api_base_url,
            model=ctx.resolved_model,
            data_source=ctx.data_source,
        )
        _log_chat_request(
            request_id=request_id,
            question=payload.question,
            schema_key=selected_schema_key,
            schema_source=settings.semantic_schema_source,
            workflow_mode=workflow_mode,
            workflow_passes=ctx.workflow_passes,
            include_schema=payload.include_schema,
            success=False,
            duration_ms=(perf_counter() - started_at) * 1000,
            error=str(error),
        )
        raise HTTPException(status_code=502, detail=f"AI engine failed: {error}") from error

    # 11. Bentuk payload final yang akan dikirim balik ke caller dan subscriber SSE.
    final_answer = ctx.response_text or ctx.answer or ""
    data = ChatResponseData(
        request_id=request_id,
        answer=final_answer,
        model=ctx.resolved_model,
        provider=ctx.api_base_url,
        data_source=ctx.data_source,
        semantic_schema=ctx.schema,
        execution_status=ctx.execution_status,
        generated_queries=ctx.generated_queries,
        query_results=ctx.query_results,
        visualizations=ctx.visualizations,
        query_result=ctx.query_result,
        suggested_queries=ctx.suggested_queries,
        workflow_mode=workflow_mode,
        workflow_passes=ctx.workflow_passes,
        schema_key=selected_schema_key,
        schema_source=settings.semantic_schema_source,
    )
    # 12. Kirim event final lengkap agar SSE/WebSocket menerima hasil akhir dan berhenti.
    await publish_progress(
        "completed",
        {
            "workflow_mode": workflow_mode,
            "workflow_passes": ctx.workflow_passes,
            "schema_key": selected_schema_key,
            "label": "Workflow completed",
            "progress": 100,
            "type": "explanation",
            "response": ctx.response_text or (
                ctx.query_result.model_dump(mode="json").get("rows")
                if ctx.query_result
                else [item.model_dump(mode="json") for item in ctx.query_results] if ctx.query_results else None
            ),
            "data": data.model_dump(mode="json"),
        },
    )
    # 13. Simpan audit sukses dan log observability setelah event final masuk ke history.
    _log_chat_request(
        request_id=request_id,
        question=payload.question,
        schema_key=selected_schema_key,
        schema_source=settings.semantic_schema_source,
        workflow_mode=workflow_mode,
        workflow_passes=ctx.workflow_passes,
        include_schema=payload.include_schema,
        success=True,
        duration_ms=(perf_counter() - started_at) * 1000,
    )
    _persist_audit_log(
        request_id=request_id,
        question=payload.question,
        answer=final_answer,
        session_key=payload.session_key,
        channel=payload.channel,
        ui_mode=payload.ui_mode,
        schema_key=selected_schema_key,
        schema_source=settings.semantic_schema_source,
        workflow_mode=workflow_mode,
        workflow_passes=ctx.workflow_passes,
        include_schema=payload.include_schema,
        success=True,
        duration_ms=(perf_counter() - started_at) * 1000,
        response_text=ctx.response_text,
        parsed_answer=ctx.parsed_answer,
        query_result=ctx.query_result.model_dump(mode="json") if ctx.query_result else None,
        suggested_queries=[item.model_dump(mode="json") for item in ctx.suggested_queries],
        event_history=audit_event_history,
        provider=ctx.api_base_url,
        model=ctx.resolved_model,
        data_source=ctx.data_source,
    )
    return {"success": True, "data": data.model_dump(mode="json")}


execute_chat_query = _execute_chat_query
