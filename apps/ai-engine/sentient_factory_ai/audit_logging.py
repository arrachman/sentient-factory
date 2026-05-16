from __future__ import annotations

import json

from .audit_store import persist_ai_chat_audit
from .llm_settings import settings


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
