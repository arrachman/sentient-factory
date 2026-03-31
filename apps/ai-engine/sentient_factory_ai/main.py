from __future__ import annotations

import asyncio
import json
import re
from time import perf_counter

from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from redis import asyncio as redis_asyncio
import uvicorn

from .audit_store import (
    delete_ai_chat_history_session,
    ensure_ai_chat_history_started,
    get_ai_chat_history_prompt_detail,
    list_ai_chat_history_prompts,
    list_ai_chat_history_sessions,
    persist_ai_chat_audit,
    rename_ai_chat_history_session,
)
from .codex_config import load_codex_config, resolve_model_settings
from .agent_workflow import build_first_step_prompt
from .llm import generate_test_answer, request_text_response
from .models import (
    ChatRequest,
    ChatResponseData,
    GeneratedQuery,
    ModelTestRequest,
    ModelTestResponseData,
    PerQueryExecutionResult,
    QueryResultSet,
    SemanticSchemaResponse,
    SuggestedQuery,
    VisualizationSpec,
)
from .mysql_client import execute_multiple_read_only_queries, execute_read_only_query
from .progress_stream import broker
from .semantic_schema import build_semantic_schema
from .settings import get_settings

settings = get_settings()
codex_config = load_codex_config(settings.codex_config_path)
codex_model, codex_base_url, codex_api_key = resolve_model_settings(codex_config)

def resolve_llm_settings(model_profile: str | None = None) -> tuple[str | None, str | None, str | None]:
    # Environment overrides should win so the container can be pointed at a
    # specific provider without inheriting the local Codex desktop config.
    if model_profile == "pro":
        model = settings.llm_pro_model or settings.llm_model or codex_model
    else:
        model = settings.llm_fast_model or settings.llm_model or codex_model
    api_base_url = settings.llm_api_base_url or codex_base_url
    api_key = settings.llm_api_key or codex_api_key
    return model, api_base_url, api_key

app = FastAPI(title="Sentient Factory AI Engine", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup_event() -> None:
    app.state.redis = redis_asyncio.from_url(settings.redis_url, decode_responses=True)
    app.state.workflow_worker_task = asyncio.create_task(_workflow_worker_loop())


@app.on_event("shutdown")
async def shutdown_event() -> None:
    worker_task: asyncio.Task[None] | None = getattr(app.state, "workflow_worker_task", None)
    if worker_task:
        worker_task.cancel()
        try:
            await worker_task
        except asyncio.CancelledError:
            pass

    redis_client: redis_asyncio.Redis | None = getattr(app.state, "redis", None)
    if redis_client:
        await redis_client.aclose()


@app.get("/health")
def healthcheck() -> dict[str, object]:
    model, api_base_url, _ = resolve_llm_settings("fast")
    return {
        "status": "ok",
        "service": settings.app_name,
        "provider": api_base_url,
        "model": model,
    }


@app.get("/api/schema/semantic")
def get_semantic_schema(
    include_samples: bool = False,
    schema_key: str | None = None,
    query: str | None = None,
) -> dict[str, object]:
    schema = build_semantic_schema(
        database_url=settings.database_url,
        table_limit=settings.semantic_schema_table_limit,
        sample_limit=settings.semantic_schema_sample_limit,
        include_samples=include_samples,
        source=settings.semantic_schema_source,
        schema_key=schema_key or settings.semantic_schema_key,
        manifest_path=settings.semantic_schema_manifest_path,
        query_text=query,
    )
    return {"success": True, "data": schema.model_dump(mode="json")}


@app.get("/api/chat/progress/{request_id}")
async def stream_chat_progress(request_id: str) -> StreamingResponse:
    queue = broker.subscribe(request_id)

    async def event_generator():
        try:
            while True:
                message = await queue.get()
                yield f"event: {message['event']}\n"
                yield f"data: {json.dumps(message, ensure_ascii=True)}\n\n"
                if message["event"] in {"completed", "failed"}:
                    break
        finally:
            broker.unsubscribe(request_id, queue)

    return StreamingResponse(event_generator(), media_type="text/event-stream")


@app.get("/api/chat/history/sessions")
def get_chat_history_sessions(
    channel: str | None = None,
    limit: int = 20,
) -> dict[str, object]:
    sessions = list_ai_chat_history_sessions(
        database_url=settings.audit_database_url or settings.database_url,
        channel=channel,
        limit=max(1, min(limit, 100)),
    )
    return {"success": True, "data": sessions}


@app.get("/api/chat/history/sessions/{session_id}/prompts")
def get_chat_history_session_prompts(session_id: str) -> dict[str, object]:
    prompts = list_ai_chat_history_prompts(
        database_url=settings.audit_database_url or settings.database_url,
        session_id=session_id,
    )
    return {"success": True, "data": prompts}


@app.delete("/api/chat/history/sessions/{session_id}")
def delete_chat_history_session(session_id: str) -> dict[str, object]:
    deleted = delete_ai_chat_history_session(
        database_url=settings.audit_database_url or settings.database_url,
        session_id=session_id,
    )
    if not deleted:
        raise HTTPException(status_code=404, detail="History session not found.")
    return {"success": True, "data": {"session_id": session_id, "deleted": True}}


@app.patch("/api/chat/history/sessions/{session_id}")
def rename_chat_history_session(session_id: str, payload: dict[str, object]) -> dict[str, object]:
    title = str(payload.get("title") or "").strip()
    if not title:
        raise HTTPException(status_code=400, detail="Session title is required.")

    session = rename_ai_chat_history_session(
        database_url=settings.audit_database_url or settings.database_url,
        session_id=session_id,
        title=title,
    )
    if not session:
        raise HTTPException(status_code=404, detail="History session not found.")
    return {"success": True, "data": session}


@app.get("/api/chat/history/prompts/{prompt_id}")
def get_chat_history_prompt(prompt_id: str) -> dict[str, object]:
    detail = get_ai_chat_history_prompt_detail(
        database_url=settings.audit_database_url or settings.database_url,
        prompt_id=prompt_id,
    )
    if not detail:
        raise HTTPException(status_code=404, detail="Prompt history not found.")
    return {"success": True, "data": detail}


@app.websocket("/api/chat/progress/ws/{request_id}")
async def stream_chat_progress_ws(websocket: WebSocket, request_id: str) -> None:
    await websocket.accept()
    queue = broker.subscribe(request_id)

    try:
        while True:
            message = await queue.get()
            await websocket.send_text(json.dumps(message, ensure_ascii=True))
            if message["event"] in {"completed", "failed"}:
                break
    except WebSocketDisconnect:
        pass
    finally:
        broker.unsubscribe(request_id, queue)


async def _execute_chat_query(payload: ChatRequest) -> dict[str, object]:
    # 1. Siapkan metadata request dan state awal workflow untuk satu eksekusi chat.
    started_at = perf_counter()
    request_id = payload.request_id or f"req-{int(started_at * 1000000)}"
    selected_schema_key = payload.schema_key or settings.semantic_schema_key
    workflow_mode = settings.ai_chat_workflow_mode
    workflow_passes = 1
    query_result: QueryResultSet | None = None
    query_results: list[PerQueryExecutionResult] = []
    generated_queries: list[GeneratedQuery] = []
    visualizations: list[VisualizationSpec] = []
    execution_status: str | None = None
    data_source = "myerpplus" if settings.myerpplus_database_url else "semantic_schema_only"
    response_text: str | None = None
    parsed_answer: dict[str, object] | None = None
    audit_event_history: list[dict[str, object]] = []

    async def publish_progress(event: str, body: dict[str, object]) -> None:
        audit_event_history.append(
            {
                "event": event,
                **body,
            }
        )
        await broker.publish(request_id, event, body)

    try:
        schema: SemanticSchemaResponse | None = None
        schema_prompt = ""
        analysis_prompt = ""
        analysis_prompt_source = ""
        answer = ""
        suggested_queries: list[SuggestedQuery] = []
        resolved_model = "prompt-builder"
        # 3. Muat prompt sales SQL generator dari file dan isi placeholder schema utama, schema sales, dan pertanyaan user.
        analysis_prompt, analysis_prompt_source = build_first_step_prompt(
            _normalize_question_for_response_mode(payload.question, payload.response_mode)
        )

        model, api_base_url, api_key = resolve_llm_settings(payload.model_profile)
        if not model or not api_base_url:
            raise HTTPException(status_code=500, detail="LLM configuration is incomplete.")

        started_response = "Request diterima dan workflow dimasukkan ke antrian proses."
        try:
            started_response, _ = await request_text_response(
                api_base_url=api_base_url,
                model=model,
                api_key=api_key,
                messages=[],
                question=payload.question,
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

        raw_answer, resolved_model = await request_text_response(
            api_base_url=api_base_url,
            model=model,
            api_key=api_key,
            messages=payload.messages,
            question=payload.question,
            semantic_schema_text="",
            system_prompt=analysis_prompt,
            request_timeout_seconds=settings.llm_request_timeout_seconds,
            max_retries=settings.llm_request_max_retries,
        )
        parsed_answer = _parse_sql_generator_output(raw_answer)
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
            generated_queries = _extract_generated_queries(parsed_answer)
            if not generated_queries:
                single_query = _get_auto_executable_sql(parsed_answer)
                if single_query:
                    generated_queries = [
                        GeneratedQuery(
                            id="q1",
                            name="main_query",
                            purpose="Primary query",
                            query=single_query,
                        )
                    ]
            visualizations = _extract_visualizations(
                parsed_answer,
                {item.id for item in generated_queries},
            )
            if payload.execute_read_only_query and generated_queries:
                if not settings.myerpplus_database_url:
                    raise HTTPException(status_code=500, detail="MYERPPLUS_DATABASE_URL is not configured.")
                await publish_progress(
                    "query_execution_started",
                    {
                        "label": "Query execution started",
                        "progress": 40,
                        "type": "chain_of_thought",
                        "response": (
                            f"{len(generated_queries)} query read-only sedang dijalankan."
                            if len(generated_queries) > 1
                            else "Query read-only dari parsed_answer.query sedang dijalankan."
                        ),
                    },
                )
                if len(generated_queries) == 1:
                    query_result = execute_read_only_query(
                        settings.myerpplus_database_url,
                        generated_queries[0].query,
                    )
                    query_results = [
                        PerQueryExecutionResult(
                            query_id=generated_queries[0].id,
                            sql=query_result.sql,
                            success=True,
                            row_count=query_result.row_count,
                            columns=query_result.columns,
                            rows=query_result.rows,
                        )
                    ]
                    execution_status = "SUCCESS"
                else:
                    query_results = execute_multiple_read_only_queries(
                        settings.myerpplus_database_url,
                        [(item.id, item.query) for item in generated_queries],
                        max_queries=settings.dashboard_max_queries,
                    )
                    success_count = sum(1 for item in query_results if item.success)
                    if success_count == len(query_results):
                        execution_status = "SUCCESS"
                    elif success_count > 0:
                        execution_status = "PARTIAL_SUCCESS"
                    else:
                        execution_status = "FAILED"
                data_source = "myerpplus"
                await publish_progress(
                    "query_execution_completed",
                    {
                        "label": "Query execution completed",
                        "progress": 60,
                        "type": "data",
                        "response": (
                            query_result.model_dump(mode="json").get("rows")
                            if query_result
                            else [item.model_dump(mode="json") for item in query_results]
                        ),
                    },
                )
            elif generated_queries:
                execution_status = "SUCCESS"
        answer = json.dumps(parsed_answer, ensure_ascii=True)
        if _is_failed_sql_generator_output(parsed_answer):
            response_text = _format_user_friendly_failure_message(
                str(parsed_answer.get("error_message") or "")
            )
            if _looks_like_general_non_data_question(payload.question):
                try:
                    response_text, _ = await request_text_response(
                        api_base_url=api_base_url,
                        model=model,
                        api_key=api_key,
                        messages=payload.messages,
                        question=payload.question,
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
            if len(query_results) > 1:
                response_text, _ = await request_text_response(
                    api_base_url=api_base_url,
                    model=model,
                    api_key=api_key,
                    messages=[],
                    question=_build_multi_query_result_insight_prompt(
                        user_question=payload.question,
                        query_results=query_results,
                        visualizations=visualizations,
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
            elif query_result:
                response_text, _ = await request_text_response(
                    api_base_url=api_base_url,
                    model=model,
                    api_key=api_key,
                    messages=[],
                    question=_build_query_result_insight_prompt(
                        user_question=payload.question,
                        sql=auto_execute_sql if 'auto_execute_sql' in locals() else None,
                        query_result=query_result,
                    ),
                    semantic_schema_text="",
                    system_prompt=(
                        "Anda adalah AI analyst untuk hasil query bisnis. "
                        "Baca hasil query, jelaskan insight utama secara ringkas dalam Bahasa Indonesia, "
                        "fokus pada temuan yang benar-benar terlihapps/web-dashboard/app/(layouts)/app/dashboard/manager/page.tsxat di data, dan jangan berhalusinasi."
                    ),
                    request_timeout_seconds=settings.llm_request_timeout_seconds,
                    max_retries=settings.llm_request_max_retries,
                )
            elif generated_queries:
                response_text = (
                    f"Rencana dashboard berhasil dibuat dengan {len(generated_queries)} query "
                    "dan metadata visualisasi, tetapi query belum dijalankan karena "
                    "`execute_read_only_query=false`."
                )
        workflow_passes = 1
    except HTTPException:
        await publish_progress(
            "failed",
            {
                "workflow_mode": workflow_mode,
                "workflow_passes": workflow_passes,
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
            workflow_passes=workflow_passes,
            include_schema=payload.include_schema,
            success=False,
            duration_ms=(perf_counter() - started_at) * 1000,
            response_text=response_text,
            parsed_answer=parsed_answer,
            query_result=query_result.model_dump(mode="json") if query_result else None,
            suggested_queries=[item.model_dump(mode="json") for item in suggested_queries],
            event_history=audit_event_history,
            provider=api_base_url,
            model=resolved_model,
            data_source=data_source,
        )
        _log_chat_request(
            request_id=request_id,
            question=payload.question,
            schema_key=selected_schema_key,
            schema_source=settings.semantic_schema_source,
            workflow_mode=workflow_mode,
            workflow_passes=workflow_passes,
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
                "workflow_passes": workflow_passes,
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
            workflow_passes=workflow_passes,
            include_schema=payload.include_schema,
            success=False,
            duration_ms=(perf_counter() - started_at) * 1000,
            error_message=str(error),
            response_text=response_text,
            parsed_answer=parsed_answer,
            query_result=query_result.model_dump(mode="json") if query_result else None,
            suggested_queries=[item.model_dump(mode="json") for item in suggested_queries],
            event_history=audit_event_history,
            provider=api_base_url,
            model=resolved_model,
            data_source=data_source,
        )
        _log_chat_request(
            request_id=request_id,
            question=payload.question,
            schema_key=selected_schema_key,
            schema_source=settings.semantic_schema_source,
            workflow_mode=workflow_mode,
            workflow_passes=workflow_passes,
            include_schema=payload.include_schema,
            success=False,
            duration_ms=(perf_counter() - started_at) * 1000,
            error=str(error),
        )
        raise HTTPException(status_code=502, detail=f"AI engine failed: {error}") from error

    # 11. Bentuk payload final yang akan dikirim balik ke caller dan subscriber SSE.
    data = ChatResponseData(
        request_id=request_id,
        answer=answer,
        model=resolved_model,
        provider=api_base_url,
        data_source=data_source,
        semantic_schema=schema,
        execution_status=execution_status,
        generated_queries=generated_queries,
        query_results=query_results,
        visualizations=visualizations,
        query_result=query_result,
        suggested_queries=suggested_queries,
        workflow_mode=workflow_mode,
        workflow_passes=workflow_passes,
        schema_key=selected_schema_key,
        schema_source=settings.semantic_schema_source,
    )
    # 12. Kirim event final lengkap agar SSE/WebSocket menerima hasil akhir dan berhenti.
    await publish_progress(
        "completed",
        {
            "workflow_mode": workflow_mode,
            "workflow_passes": workflow_passes,
            "schema_key": selected_schema_key,
            "label": "Workflow completed",
            "progress": 100,
            "type": "explanation",
            "response": response_text or (
                query_result.model_dump(mode="json").get("rows")
                if query_result
                else [item.model_dump(mode="json") for item in query_results] if query_results else None
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
        workflow_passes=workflow_passes,
        include_schema=payload.include_schema,
        success=True,
        duration_ms=(perf_counter() - started_at) * 1000,
    )
    _persist_audit_log(
        request_id=request_id,
        question=payload.question,
        answer=answer,
        session_key=payload.session_key,
        channel=payload.channel,
        ui_mode=payload.ui_mode,
        schema_key=selected_schema_key,
        schema_source=settings.semantic_schema_source,
        workflow_mode=workflow_mode,
        workflow_passes=workflow_passes,
        include_schema=payload.include_schema,
        success=True,
        duration_ms=(perf_counter() - started_at) * 1000,
        response_text=response_text,
        parsed_answer=parsed_answer,
        query_result=query_result.model_dump(mode="json") if query_result else None,
        suggested_queries=[item.model_dump(mode="json") for item in suggested_queries],
        event_history=audit_event_history,
        provider=api_base_url,
        model=resolved_model,
        data_source=data_source,
    )
    return {"success": True, "data": data.model_dump(mode="json")}


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


def _is_failed_sql_generator_output(payload: dict[str, object]) -> bool:
    success_value = payload.get("success")
    if success_value is False:
        return True

    status_value = payload.get("status")
    return isinstance(status_value, str) and status_value.strip().upper() == "FAILED"


def _format_user_friendly_failure_message(message: str) -> str:
    normalized = message.strip()
    if not normalized:
        return "Permintaan ini belum bisa dijawab dari schema yang tersedia."

    normalized = re.sub(r"^TIDAK_BISA_DIBUAT_DARI_SCHEMA:\s*", "", normalized, flags=re.IGNORECASE)
    normalized = normalized.rstrip(". ")

    if not normalized:
        return "Permintaan ini belum bisa dijawab dari schema yang tersedia."

    return f"Permintaan ini belum bisa dijawab dari schema yang tersedia karena {normalized}."


def _looks_like_general_non_data_question(question: str) -> bool:
    normalized = question.strip().lower()
    if not normalized:
        return False

    general_patterns = (
        "kamu siapa",
        "siapa kamu",
        "apa itu kamu",
        "apa yang bisa kamu bantu",
        "bisa bantu apa",
        "siapa dirimu",
        "perkenalkan diri",
        "kenalan",
    )
    return any(pattern in normalized for pattern in general_patterns)


def _build_query_result_insight_prompt(
    *,
    user_question: str,
    sql: str | None,
    query_result: QueryResultSet,
) -> str:
    result_payload = query_result.model_dump(mode="json")
    return (
        f"Pertanyaan user:\n{user_question}\n\n"
        f"SQL read-only yang dijalankan:\n{sql or query_result.sql}\n\n"
        f"Hasil query JSON:\n{json.dumps(result_payload, ensure_ascii=True)}\n\n"
        "Berikan insight singkat yang langsung menjawab pertanyaan user berdasarkan hasil query di atas."
    )


def _build_multi_query_result_insight_prompt(
    *,
    user_question: str,
    query_results: list[PerQueryExecutionResult],
    visualizations: list[VisualizationSpec],
) -> str:
    compact_results = []
    for item in query_results:
        compact_results.append(
            {
                "query_id": item.query_id,
                "success": item.success,
                "error_message": item.error_message,
                "row_count": item.row_count,
                "columns": [column.name for column in item.columns],
                "sample_rows": item.rows[:5],
            }
        )
    return (
        f"Pertanyaan user:\n{user_question}\n\n"
        f"Visualizations:\n{json.dumps([item.model_dump(mode='json') for item in visualizations], ensure_ascii=True)}\n\n"
        f"Hasil multi-query JSON:\n{json.dumps(compact_results, ensure_ascii=True)}\n\n"
        "Berikan insight singkat dalam Bahasa Indonesia yang merangkum hasil dashboard ini. "
        "Sebutkan jika ada blok/query yang gagal."
    )


def _normalize_question_for_response_mode(question: str, response_mode: str | None) -> str:
    if response_mode != "dashboard":
        return question
    return (
        f"{question}\n\n"
        "[SYSTEM HINT] Gunakan mode dashboard. Anda boleh menghasilkan maksimal 3 query read-only "
        "dan visualizations terkait jika memang diperlukan. Jika tidak perlu, tetap boleh hanya 1 query."
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


@app.post("/api/chat/query")
async def chat_query(payload: ChatRequest) -> dict[str, object]:
    return await _execute_chat_query(payload)


@app.post("/api/chat/dashboard-query")
async def chat_dashboard_query(payload: ChatRequest) -> dict[str, object]:
    dashboard_payload = payload.model_copy(update={"response_mode": "dashboard"})
    return await _execute_chat_query(dashboard_payload)


@app.post("/api/chat/query/trigger")
async def chat_query_trigger(payload: ChatRequest) -> dict[str, object]:
    request_id = payload.request_id or f"workflow-{int(perf_counter() * 1000000)}"
    background_payload = payload.model_copy(update={"request_id": request_id})
    if payload.session_key:
        ensure_ai_chat_history_started(
            database_url=settings.audit_database_url or settings.database_url,
            request_id=request_id,
            session_key=payload.session_key,
            question=payload.question,
            channel=payload.channel,
            ui_mode=payload.ui_mode,
            schema_key=payload.schema_key or settings.semantic_schema_key,
            schema_source=settings.semantic_schema_source,
            workflow_mode=settings.ai_chat_workflow_mode,
            include_schema=payload.include_schema,
        )
    redis_client: redis_asyncio.Redis = app.state.redis
    await redis_client.lpush(settings.ai_workflow_queue_key, background_payload.model_dump_json())
    return {
        "success": True,
        "data": {
            "request_id": request_id,
            "status": "accepted",
        },
    }


@app.post("/api/chat/test")
async def chat_test(payload: ModelTestRequest) -> dict[str, object]:
    request_id = payload.request_id or f"test-{int(perf_counter() * 1000000)}"
    model, api_base_url, api_key = resolve_llm_settings("fast")

    if not model or not api_base_url:
        raise HTTPException(status_code=500, detail="LLM configuration is incomplete.")

    try:
        answer, resolved_model = await generate_test_answer(
            api_base_url=api_base_url,
            model=model,
            api_key=api_key,
            prompt=payload.prompt,
            request_timeout_seconds=settings.llm_request_timeout_seconds,
            max_retries=settings.llm_request_max_retries,
        )
    except Exception as error:  # pragma: no cover
        raise HTTPException(status_code=502, detail=f"AI engine failed: {error}") from error

    data = ModelTestResponseData(
        request_id=request_id,
        prompt=payload.prompt,
        answer=answer,
        model=resolved_model,
        provider=api_base_url,
    )
    return {"success": True, "data": data.model_dump(mode="json")}


def _log_chat_request(
    *,
    request_id: str,
    question: str,
    schema_key: str,
    schema_source: str,
    workflow_mode: str,
    workflow_passes: int,
    include_schema: bool,
    success: bool,
    duration_ms: float,
    error: str | None = None,
) -> None:
    payload = {
        "event": "ai_chat_query",
        "request_id": request_id,
        "success": success,
        "schema_key": schema_key,
        "schema_source": schema_source,
        "workflow_mode": workflow_mode,
        "workflow_passes": workflow_passes,
        "include_schema": include_schema,
        "duration_ms": round(duration_ms, 2),
        "question_preview": question[:160],
    }
    if error:
        payload["error"] = error[:300]
    print(json.dumps(payload, ensure_ascii=True))


def _persist_audit_log(
    *,
    request_id: str,
    question: str,
    answer: str | None,
    session_key: str | None,
    channel: str | None,
    ui_mode: str | None,
    schema_key: str,
    schema_source: str,
    workflow_mode: str,
    workflow_passes: int,
    include_schema: bool,
    success: bool,
    duration_ms: float,
    error_message: str | None = None,
    response_text: str | None = None,
    parsed_answer: dict[str, object] | None = None,
    query_result: dict[str, object] | None = None,
    suggested_queries: list[dict[str, object]] | None = None,
    event_history: list[dict[str, object]] | None = None,
    provider: str | None = None,
    model: str | None = None,
    data_source: str | None = None,
) -> None:
    try:
        persist_ai_chat_audit(
            database_url=settings.audit_database_url or settings.database_url,
            request_id=request_id,
            question=question,
            answer=answer,
            session_key=session_key,
            channel=channel,
            ui_mode=ui_mode,
            schema_key=schema_key,
            schema_source=schema_source,
            workflow_mode=workflow_mode,
            workflow_passes=workflow_passes,
            include_schema=include_schema,
            success=success,
            duration_ms=duration_ms,
            error_message=error_message,
            response_text=response_text,
            parsed_answer=parsed_answer,
            query_result=query_result,
            suggested_queries=suggested_queries,
            event_history=event_history,
            provider=provider,
            model=model,
            data_source=data_source,
        )
    except Exception as error:  # pragma: no cover
        print(
            json.dumps(
                {
                    "event": "ai_chat_audit_persist_failed",
                    "request_id": request_id,
                    "error": str(error)[:300],
                },
                ensure_ascii=True,
            )
        )


async def _workflow_worker_loop() -> None:
    redis_client: redis_asyncio.Redis = app.state.redis

    while True:
        try:
            item = await redis_client.brpop(settings.ai_workflow_queue_key, timeout=5)
            if not item:
                continue

            _, payload_raw = item
            payload = ChatRequest.model_validate_json(payload_raw)
            await _execute_chat_query(payload)
        except asyncio.CancelledError:
            raise
        except Exception as error:  # pragma: no cover
            print(f"[ai-engine] workflow worker failed: {error!r}")


def run() -> None:
    uvicorn.run(
        "sentient_factory_ai.main:app",
        host=settings.host,
        port=settings.port,
        reload=settings.environment == "development",
    )
