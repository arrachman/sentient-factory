from __future__ import annotations

import psycopg2


CREATE_TABLE_SQL = """
CREATE TABLE IF NOT EXISTS ai_chat_audit_logs (
    id BIGSERIAL PRIMARY KEY,
    request_id VARCHAR(100) NOT NULL,
    question TEXT NOT NULL,
    answer TEXT,
    schema_key VARCHAR(100),
    schema_source VARCHAR(100),
    workflow_mode VARCHAR(50),
    workflow_passes INTEGER,
    include_schema BOOLEAN NOT NULL DEFAULT TRUE,
    success BOOLEAN NOT NULL DEFAULT FALSE,
    duration_ms DOUBLE PRECISION,
    error_message TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_chat_audit_logs_request_id
    ON ai_chat_audit_logs (request_id);

CREATE INDEX IF NOT EXISTS idx_ai_chat_audit_logs_created_at
    ON ai_chat_audit_logs (created_at DESC);
"""


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
                    error_message
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
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
                ),
            )
