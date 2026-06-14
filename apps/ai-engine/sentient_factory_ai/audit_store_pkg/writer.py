from __future__ import annotations

import psycopg2
from psycopg2.extras import Json

from .schema import CREATE_TABLE_SQL
from .serialization import _extract_event_response


def persist_ai_chat_audit(
    *,
    database_url: str,
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
    response_text: str | None = None,
    parsed_answer: dict[str, object] | None = None,
    query_result: dict[str, object] | None = None,
    suggested_queries: list[dict[str, object]] | None = None,
    event_history: list[dict[str, object]] | None = None,
    session_key: str | None = None,
    channel: str | None = None,
    ui_mode: str | None = None,
    provider: str | None = None,
    model: str | None = None,
    data_source: str | None = None,
) -> None:
    with psycopg2.connect(database_url) as connection:
        with connection.cursor() as cursor:
            cursor.execute(CREATE_TABLE_SQL)
            cursor.execute(
                """
                INSERT INTO ai_chat_audit_logs (
                    request_id,
                    question,
                    answer,
                    schema_key,
                    schema_source,
                    workflow_mode,
                    workflow_passes,
                    include_schema,
                    success,
                    duration_ms,
                    error_message,
                    response_text,
                    parsed_answer,
                    query_result,
                    suggested_queries,
                    event_history
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                """,
                (
                    request_id,
                    question,
                    answer,
                    schema_key,
                    schema_source,
                    workflow_mode,
                    workflow_passes,
                    include_schema,
                    success,
                    duration_ms,
                    error_message,
                    response_text,
                    Json(parsed_answer) if parsed_answer is not None else None,
                    Json(query_result) if query_result is not None else None,
                    Json(suggested_queries or []),
                    Json(event_history or []),
                ),
            )
            if not session_key:
                return

            cursor.execute(
                """
                INSERT INTO ai_chat_history_sessions (
                    session_key,
                    channel,
                    mode,
                    title,
                    status,
                    started_at,
                    last_prompt_at,
                    prompt_count,
                    updated_at
                ) VALUES (%s, %s, %s, %s, %s, NOW(), NOW(), 1, NOW())
                ON CONFLICT (session_key) DO UPDATE SET
                    channel = COALESCE(EXCLUDED.channel, ai_chat_history_sessions.channel),
                    mode = COALESCE(EXCLUDED.mode, ai_chat_history_sessions.mode),
                    title = COALESCE(ai_chat_history_sessions.title, EXCLUDED.title),
                    status = CASE
                        WHEN EXCLUDED.status = 'failed' THEN 'failed'
                        ELSE ai_chat_history_sessions.status
                    END,
                    last_prompt_at = NOW(),
                    prompt_count = ai_chat_history_sessions.prompt_count + 1,
                    updated_at = NOW()
                RETURNING id, prompt_count
                """,
                (
                    session_key,
                    channel or "manager_dashboard",
                    ui_mode or "ask",
                    question[:160],
                    "completed" if success else "failed",
                ),
            )
            session_id, prompt_count = cursor.fetchone()

            started_response = _extract_event_response(event_history, "started")
            explanation_response = _extract_event_response(event_history, "completed")
            insight_response = explanation_response if query_result is not None else None
            answer_json = parsed_answer if parsed_answer is not None else None
            query_sql = None
            if isinstance(parsed_answer, dict):
                query_candidate = parsed_answer.get("query")
                if isinstance(query_candidate, str) and query_candidate.strip():
                    query_sql = query_candidate.strip()
            debug_info = parsed_answer.get("debug_info") if isinstance(parsed_answer, dict) else None

            cursor.execute(
                """
                INSERT INTO ai_chat_history_prompts (
                    session_id,
                    request_id,
                    turn_index,
                    prompt_text,
                    normalized_prompt_text,
                    started_response,
                    explanation_response,
                    insight_response,
                    answer_text,
                    answer_json,
                    status,
                    failure_type,
                    failure_message,
                    schema_key,
                    schema_source,
                    workflow_mode,
                    workflow_passes,
                    include_schema,
                    model,
                    provider,
                    data_source,
                    query_sql,
                    query_result,
                    stream_summary,
                    debug_info,
                    parsed_answer,
                    duration_ms,
                    completed_at
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, NOW())
                ON CONFLICT (request_id) DO UPDATE SET
                    session_id = EXCLUDED.session_id,
                    turn_index = EXCLUDED.turn_index,
                    prompt_text = EXCLUDED.prompt_text,
                    normalized_prompt_text = EXCLUDED.normalized_prompt_text,
                    started_response = COALESCE(EXCLUDED.started_response, ai_chat_history_prompts.started_response),
                    explanation_response = COALESCE(EXCLUDED.explanation_response, ai_chat_history_prompts.explanation_response),
                    insight_response = COALESCE(EXCLUDED.insight_response, ai_chat_history_prompts.insight_response),
                    answer_text = COALESCE(EXCLUDED.answer_text, ai_chat_history_prompts.answer_text),
                    answer_json = COALESCE(EXCLUDED.answer_json, ai_chat_history_prompts.answer_json),
                    status = EXCLUDED.status,
                    failure_type = COALESCE(EXCLUDED.failure_type, ai_chat_history_prompts.failure_type),
                    failure_message = COALESCE(EXCLUDED.failure_message, ai_chat_history_prompts.failure_message),
                    schema_key = COALESCE(EXCLUDED.schema_key, ai_chat_history_prompts.schema_key),
                    schema_source = COALESCE(EXCLUDED.schema_source, ai_chat_history_prompts.schema_source),
                    workflow_mode = COALESCE(EXCLUDED.workflow_mode, ai_chat_history_prompts.workflow_mode),
                    workflow_passes = COALESCE(EXCLUDED.workflow_passes, ai_chat_history_prompts.workflow_passes),
                    include_schema = EXCLUDED.include_schema,
                    model = COALESCE(EXCLUDED.model, ai_chat_history_prompts.model),
                    provider = COALESCE(EXCLUDED.provider, ai_chat_history_prompts.provider),
                    data_source = COALESCE(EXCLUDED.data_source, ai_chat_history_prompts.data_source),
                    query_sql = COALESCE(EXCLUDED.query_sql, ai_chat_history_prompts.query_sql),
                    query_result = COALESCE(EXCLUDED.query_result, ai_chat_history_prompts.query_result),
                    stream_summary = EXCLUDED.stream_summary,
                    debug_info = COALESCE(EXCLUDED.debug_info, ai_chat_history_prompts.debug_info),
                    parsed_answer = COALESCE(EXCLUDED.parsed_answer, ai_chat_history_prompts.parsed_answer),
                    duration_ms = COALESCE(EXCLUDED.duration_ms, ai_chat_history_prompts.duration_ms),
                    completed_at = EXCLUDED.completed_at
                RETURNING id
                """,
                (
                    session_id,
                    request_id,
                    prompt_count,
                    question,
                    question.strip().lower(),
                    started_response,
                    explanation_response,
                    insight_response,
                    response_text,
                    Json(answer_json) if answer_json is not None else None,
                    "completed" if success else "failed",
                    "workflow_error" if not success else None,
                    error_message,
                    schema_key,
                    schema_source,
                    workflow_mode,
                    workflow_passes,
                    include_schema,
                    model,
                    provider,
                    data_source,
                    query_sql,
                    Json(query_result) if query_result is not None else None,
                    Json(event_history or []),
                    Json(debug_info) if isinstance(debug_info, dict) else None,
                    Json(parsed_answer) if parsed_answer is not None else None,
                    duration_ms,
                ),
            )
            prompt_id = cursor.fetchone()[0]

    for event in event_history or []:
                cursor.execute(
                    """
                    INSERT INTO ai_chat_history_prompt_events (
                        prompt_id,
                        request_id,
                        event_name,
                        event_type,
                        progress,
                        label,
                        response_text,
                        payload
                    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                    """,
                    (
                        prompt_id,
                        request_id,
                        str(event.get("event") or ""),
                        str(event.get("type") or "") or None,
                        event.get("progress"),
                        event.get("label"),
                        event.get("response"),
                        Json(event),
                    ),
                )


def ensure_ai_chat_history_started(
    *,
    database_url: str,
    request_id: str,
    session_key: str,
    question: str,
    channel: str | None = None,
    ui_mode: str | None = None,
    schema_key: str | None = None,
    schema_source: str | None = None,
    workflow_mode: str | None = None,
    include_schema: bool = True,
) -> None:
    with psycopg2.connect(database_url) as connection:
        with connection.cursor() as cursor:
            cursor.execute(CREATE_TABLE_SQL)
            cursor.execute(
                """
                INSERT INTO ai_chat_history_sessions (
                    session_key,
                    channel,
                    mode,
                    title,
                    status,
                    started_at,
                    last_prompt_at,
                    prompt_count,
                    updated_at
                ) VALUES (%s, %s, %s, %s, 'running', NOW(), NOW(), 1, NOW())
                ON CONFLICT (session_key) DO UPDATE SET
                    channel = COALESCE(EXCLUDED.channel, ai_chat_history_sessions.channel),
                    mode = COALESCE(EXCLUDED.mode, ai_chat_history_sessions.mode),
                    title = COALESCE(ai_chat_history_sessions.title, EXCLUDED.title),
                    status = 'running',
                    last_prompt_at = NOW(),
                    prompt_count = ai_chat_history_sessions.prompt_count + 1,
                    updated_at = NOW()
                RETURNING id, prompt_count
                """,
                (
                    session_key,
                    channel or "manager_dashboard",
                    ui_mode or "ask",
                    question[:160],
                ),
            )
            session_id, prompt_count = cursor.fetchone()
            cursor.execute(
                """
                INSERT INTO ai_chat_history_prompts (
                    session_id,
                    request_id,
                    turn_index,
                    prompt_text,
                    normalized_prompt_text,
                    status,
                    schema_key,
                    schema_source,
                    workflow_mode,
                    include_schema,
                    prompt_created_at
                ) VALUES (%s, %s, %s, %s, %s, 'running', %s, %s, %s, %s, NOW())
                ON CONFLICT (request_id) DO NOTHING
                """,
                (
                    session_id,
                    request_id,
                    prompt_count,
                    question,
                    question.strip().lower(),
                    schema_key,
                    schema_source,
                    workflow_mode,
                    include_schema,
                ),
            )
