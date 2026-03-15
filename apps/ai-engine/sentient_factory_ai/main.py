from __future__ import annotations

import asyncio
import json
from time import perf_counter

from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from redis import asyncio as redis_asyncio
import uvicorn

from .audit_store import persist_ai_chat_audit
from .codex_config import load_codex_config, resolve_model_settings
from .agent_workflow import run_agent_workflow
from .llm import generate_answer, generate_test_answer, schema_to_prompt_text
from .models import (
    ChatRequest,
    ChatResponseData,
    ModelTestRequest,
    ModelTestResponseData,
    QueryResultSet,
    SemanticSchemaResponse,
)
from .mysql_client import execute_read_only_query
from .progress_stream import broker
from .semantic_schema import build_semantic_schema
from .settings import get_settings

settings = get_settings()
codex_config = load_codex_config(settings.codex_config_path)
codex_model, codex_base_url, codex_api_key = resolve_model_settings(codex_config)

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
    return {
        "status": "ok",
        "service": settings.app_name,
        "provider": codex_base_url or settings.llm_api_base_url,
        "model": settings.llm_model if settings.llm_model else codex_model,
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
    started_at = perf_counter()
    request_id = payload.request_id or f"req-{int(started_at * 1000000)}"
    selected_schema_key = payload.schema_key or settings.semantic_schema_key
    workflow_mode = settings.ai_chat_workflow_mode
    workflow_passes = 1
    query_result: QueryResultSet | None = None
    data_source = "myerpplus" if settings.myerpplus_database_url else "semantic_schema_only"
    await broker.publish(
        request_id,
        "started",
        {
            "workflow_mode": workflow_mode,
            "schema_key": selected_schema_key,
            "schema_source": settings.semantic_schema_source,
            "label": "Workflow accepted",
            "progress": 0,
            "summary": "Request diterima dan workflow dimasukkan ke antrian proses.",
        },
    )
    try:
        schema: SemanticSchemaResponse | None = None
        schema_prompt = "{}"
        if payload.include_schema:
            schema = build_semantic_schema(
                database_url=settings.database_url,
                table_limit=settings.semantic_schema_table_limit,
                sample_limit=settings.semantic_schema_sample_limit,
                include_samples=payload.include_samples,
                source=settings.semantic_schema_source,
                schema_key=payload.schema_key or settings.semantic_schema_key,
                manifest_path=settings.semantic_schema_manifest_path,
                query_text=payload.question,
            )
            schema_prompt = schema_to_prompt_text(schema.model_dump(mode="json"))
            await broker.publish(
                request_id,
                "schema_selected",
                {
                    "schema_key": selected_schema_key,
                    "schema_source": settings.semantic_schema_source,
                    "table_count": len(schema.tables),
                    "label": "Schema selected",
                    "progress": 20,
                    "summary": f"Semantic schema dipilih dari sumber {settings.semantic_schema_source} dengan {len(schema.tables)} tabel.",
                },
            )

        model = codex_model or settings.llm_model
        api_base_url = codex_base_url or settings.llm_api_base_url
        api_key = settings.llm_api_key or codex_api_key

        if not model or not api_base_url:
            raise HTTPException(status_code=500, detail="LLM configuration is incomplete.")

        if settings.ai_chat_workflow_mode == "agent":
            answer, suggested_queries, resolved_model, workflow_passes = await run_agent_workflow(
                api_base_url=api_base_url,
                model=model,
                api_key=api_key,
                question=payload.question,
                messages=payload.messages,
                semantic_schema_text=schema_prompt,
                request_id=request_id,
            )
        else:
            answer, suggested_queries, resolved_model = await generate_answer(
                api_base_url=api_base_url,
                model=model,
                api_key=api_key,
                question=payload.question,
                messages=payload.messages,
                semantic_schema_text=schema_prompt,
                request_timeout_seconds=settings.llm_request_timeout_seconds,
                max_retries=settings.llm_request_max_retries,
            )

        if payload.execute_read_only_query and suggested_queries:
            if not settings.myerpplus_database_url:
                raise HTTPException(status_code=500, detail="MYERPPLUS_DATABASE_URL is not configured.")
            query_result = execute_read_only_query(
                settings.myerpplus_database_url,
                suggested_queries[0].sql,
            )
            data_source = "myerpplus"
    except HTTPException:
        _persist_audit_log(
            request_id=request_id,
            question=payload.question,
            answer=None,
            schema_key=selected_schema_key,
            schema_source=settings.semantic_schema_source,
            workflow_mode=workflow_mode,
            workflow_passes=workflow_passes,
            include_schema=payload.include_schema,
            success=False,
            duration_ms=(perf_counter() - started_at) * 1000,
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
        await broker.publish(
            request_id,
            "failed",
            {
                "workflow_mode": workflow_mode,
                "workflow_passes": workflow_passes,
                "error": "http_exception",
                "label": "Workflow failed",
                "progress": 100,
                "summary": "Workflow gagal karena HTTP exception.",
            },
        )
        raise
    except Exception as error:  # pragma: no cover
        print(f"[ai-engine] chat_query failed: {error!r}")
        _persist_audit_log(
            request_id=request_id,
            question=payload.question,
            answer=None,
            schema_key=selected_schema_key,
            schema_source=settings.semantic_schema_source,
            workflow_mode=workflow_mode,
            workflow_passes=workflow_passes,
            include_schema=payload.include_schema,
            success=False,
            duration_ms=(perf_counter() - started_at) * 1000,
            error_message=str(error),
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
        await broker.publish(
            request_id,
            "failed",
            {
                "workflow_mode": workflow_mode,
                "workflow_passes": workflow_passes,
                "error": str(error),
                "label": "Workflow failed",
                "progress": 100,
                "summary": f"Workflow gagal: {str(error)[:240]}",
            },
        )
        raise HTTPException(status_code=502, detail=f"AI engine failed: {error}") from error

    data = ChatResponseData(
        request_id=request_id,
        answer=answer,
        model=resolved_model,
        provider=api_base_url,
        data_source=data_source,
        semantic_schema=schema,
        query_result=query_result,
        suggested_queries=suggested_queries,
        workflow_mode=workflow_mode,
        workflow_passes=workflow_passes,
        schema_key=selected_schema_key,
        schema_source=settings.semantic_schema_source,
    )
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
        schema_key=selected_schema_key,
        schema_source=settings.semantic_schema_source,
        workflow_mode=workflow_mode,
        workflow_passes=workflow_passes,
        include_schema=payload.include_schema,
        success=True,
        duration_ms=(perf_counter() - started_at) * 1000,
    )
    await broker.publish(
        request_id,
        "completed",
        {
            "workflow_mode": workflow_mode,
            "workflow_passes": workflow_passes,
            "schema_key": selected_schema_key,
            "label": "Workflow completed",
            "progress": 100,
            "summary": "Workflow selesai dan hasil final siap ditampilkan.",
            "data": data.model_dump(mode="json"),
        },
    )
    return {"success": True, "data": data.model_dump(mode="json")}


@app.post("/api/chat/query")
async def chat_query(payload: ChatRequest) -> dict[str, object]:
    return await _execute_chat_query(payload)


@app.post("/api/chat/query/trigger")
async def chat_query_trigger(payload: ChatRequest) -> dict[str, object]:
    request_id = payload.request_id or f"workflow-{int(perf_counter() * 1000000)}"
    background_payload = payload.model_copy(update={"request_id": request_id})
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
    model = codex_model or settings.llm_model
    api_base_url = codex_base_url or settings.llm_api_base_url
    api_key = settings.llm_api_key or codex_api_key

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
    schema_key: str,
    schema_source: str,
    workflow_mode: str,
    workflow_passes: int,
    include_schema: bool,
    success: bool,
    duration_ms: float,
    error_message: str | None = None,
) -> None:
    try:
        persist_ai_chat_audit(
            database_url=settings.audit_database_url or settings.database_url,
            request_id=request_id,
            question=question,
            answer=answer,
            schema_key=schema_key,
            schema_source=schema_source,
            workflow_mode=workflow_mode,
            workflow_passes=workflow_passes,
            include_schema=include_schema,
            success=success,
            duration_ms=duration_ms,
            error_message=error_message,
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
