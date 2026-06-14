from __future__ import annotations

import psycopg2
from psycopg2.extras import RealDictCursor

from .schema import CREATE_TABLE_SQL
from .serialization import _serialize_rows


def list_ai_chat_history_sessions(
    *,
    database_url: str,
    channel: str | None = None,
    limit: int = 20,
) -> list[dict[str, object]]:
    with psycopg2.connect(database_url) as connection:
        with connection.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute(CREATE_TABLE_SQL)
            if channel:
                cursor.execute(
                    """
                    SELECT
                        id,
                        session_key,
                        user_id,
                        username,
                        channel,
                        mode,
                        title,
                        status,
                        started_at,
                        ended_at,
                        last_prompt_at,
                        prompt_count,
                        metadata,
                        created_at,
                        updated_at
                    FROM ai_chat_history_sessions
                    WHERE channel = %s
                    ORDER BY last_prompt_at DESC NULLS LAST, created_at DESC
                    LIMIT %s
                    """,
                    (channel, limit),
                )
            else:
                cursor.execute(
                    """
                    SELECT
                        id,
                        session_key,
                        user_id,
                        username,
                        channel,
                        mode,
                        title,
                        status,
                        started_at,
                        ended_at,
                        last_prompt_at,
                        prompt_count,
                        metadata,
                        created_at,
                        updated_at
                    FROM ai_chat_history_sessions
                    ORDER BY last_prompt_at DESC NULLS LAST, created_at DESC
                    LIMIT %s
                    """,
                    (limit,),
                )
            return _serialize_rows(cursor.fetchall())


def list_ai_chat_history_prompts(
    *,
    database_url: str,
    session_id: str,
) -> list[dict[str, object]]:
    with psycopg2.connect(database_url) as connection:
        with connection.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute(CREATE_TABLE_SQL)
            cursor.execute(
                """
                SELECT
                    id,
                    session_id,
                    request_id,
                    turn_index,
                    prompt_role,
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
                    chart_payload,
                    table_payload,
                    stream_summary,
                    debug_info,
                    parsed_answer,
                    prompt_metadata,
                    duration_ms,
                    prompt_created_at,
                    completed_at
                FROM ai_chat_history_prompts
                WHERE session_id = %s
                ORDER BY turn_index ASC, prompt_created_at ASC
                """,
                (session_id,),
            )
            return _serialize_rows(cursor.fetchall())


def get_ai_chat_history_prompt_detail(
    *,
    database_url: str,
    prompt_id: str,
) -> dict[str, object] | None:
    with psycopg2.connect(database_url) as connection:
        with connection.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute(CREATE_TABLE_SQL)
            cursor.execute(
                """
                SELECT
                    id,
                    session_id,
                    request_id,
                    turn_index,
                    prompt_role,
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
                    chart_payload,
                    table_payload,
                    stream_summary,
                    debug_info,
                    parsed_answer,
                    prompt_metadata,
                    duration_ms,
                    prompt_created_at,
                    completed_at
                FROM ai_chat_history_prompts
                WHERE id = %s
                LIMIT 1
                """,
                (prompt_id,),
            )
            prompt_row = cursor.fetchone()
            if not prompt_row:
                return None

            cursor.execute(
                """
                SELECT
                    id,
                    prompt_id,
                    request_id,
                    event_name,
                    event_type,
                    progress,
                    label,
                    response_text,
                    payload,
                    created_at
                FROM ai_chat_history_prompt_events
                WHERE prompt_id = %s
                ORDER BY id ASC
                """,
                (prompt_id,),
            )
            return {
                "prompt": _serialize_rows([prompt_row])[0],
                "events": _serialize_rows(cursor.fetchall()),
            }


def delete_ai_chat_history_session(
    *,
    database_url: str,
    session_id: str,
) -> bool:
    with psycopg2.connect(database_url) as connection:
        with connection.cursor() as cursor:
            cursor.execute(CREATE_TABLE_SQL)
            cursor.execute(
                """
                DELETE FROM ai_chat_history_sessions
                WHERE id = %s
                """,
                (session_id,),
            )
            return cursor.rowcount > 0


def rename_ai_chat_history_session(
    *,
    database_url: str,
    session_id: str,
    title: str,
) -> dict[str, object] | None:
    with psycopg2.connect(database_url) as connection:
        with connection.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute(CREATE_TABLE_SQL)
            cursor.execute(
                """
                UPDATE ai_chat_history_sessions
                SET title = %s,
                    updated_at = NOW()
                WHERE id = %s
                RETURNING
                    id,
                    session_key,
                    user_id,
                    username,
                    channel,
                    mode,
                    title,
                    status,
                    started_at,
                    ended_at,
                    last_prompt_at,
                    prompt_count,
                    metadata,
                    created_at,
                    updated_at
                """,
                (title, session_id),
            )
            row = cursor.fetchone()
            return _serialize_rows([row])[0] if row else None
