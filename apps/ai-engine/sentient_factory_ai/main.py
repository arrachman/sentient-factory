from __future__ import annotations

import asyncio
import json
from time import perf_counter

from fastapi import FastAPI, HTTPException, Request, WebSocket, WebSocketDisconnect
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
    rename_ai_chat_history_session,
)
from .chat_request_parsing import _parse_chat_request_from_http, resolve_workflow_mode
from .chat_workflow import _execute_chat_query
from .llm import generate_test_answer
from .llm_settings import resolve_llm_settings, settings
from .models import (
    ChatRequest,
    ModelTestRequest,
    ModelTestResponseData,
)
from .progress_stream import broker
from .semantic_schema import build_semantic_schema

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
            # Send an immediate SSE comment so clients and curl can see the stream is alive
            # before the first workflow event is published.
            yield ": stream-open\n\n"
            while True:
                try:
                    message = await asyncio.wait_for(queue.get(), timeout=15)
                except asyncio.TimeoutError:
                    # Keep the connection warm while no progress event has been published yet.
                    yield ": heartbeat\n\n"
                    continue
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


@app.post("/api/chat/query")
async def chat_query(request: Request) -> dict[str, object]:
    payload = await _parse_chat_request_from_http(request)
    return await _execute_chat_query(payload)


@app.post("/api/chat/dashboard-query")
async def chat_dashboard_query(request: Request) -> dict[str, object]:
    payload = await _parse_chat_request_from_http(request, default_response_mode="dashboard")
    dashboard_payload = payload.model_copy(update={"response_mode": "dashboard"})
    return await _execute_chat_query(dashboard_payload)


@app.post("/api/chat/query/trigger")
async def chat_query_trigger(request: Request) -> dict[str, object]:
    payload = await _parse_chat_request_from_http(request)
    request_id = payload.request_id or f"workflow-{int(perf_counter() * 1000000)}"
    background_payload = payload.model_copy(update={"request_id": request_id})
    workflow_mode = resolve_workflow_mode(payload)
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
            workflow_mode=workflow_mode,
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
