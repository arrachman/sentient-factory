CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS ai_chat_history_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_key VARCHAR(120) NOT NULL UNIQUE,
    user_id BIGINT,
    username VARCHAR(120),
    channel VARCHAR(50) NOT NULL DEFAULT 'manager_dashboard',
    mode VARCHAR(50) NOT NULL DEFAULT 'ask',
    title TEXT,
    status VARCHAR(30) NOT NULL DEFAULT 'active',
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ended_at TIMESTAMPTZ,
    last_prompt_at TIMESTAMPTZ,
    prompt_count INTEGER NOT NULL DEFAULT 0,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_chat_history_sessions_user_id
    ON ai_chat_history_sessions (user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_ai_chat_history_sessions_status
    ON ai_chat_history_sessions (status, last_prompt_at DESC);


CREATE TABLE IF NOT EXISTS ai_chat_history_prompts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES ai_chat_history_sessions(id) ON DELETE CASCADE,
    request_id VARCHAR(100) NOT NULL UNIQUE,
    turn_index INTEGER NOT NULL,
    prompt_role VARCHAR(20) NOT NULL DEFAULT 'user',
    prompt_text TEXT NOT NULL,
    normalized_prompt_text TEXT,
    started_response TEXT,
    explanation_response TEXT,
    insight_response TEXT,
    answer_text TEXT,
    answer_json JSONB,
    status VARCHAR(30) NOT NULL DEFAULT 'completed',
    failure_type VARCHAR(50),
    failure_message TEXT,
    schema_key VARCHAR(100),
    schema_source VARCHAR(100),
    workflow_mode VARCHAR(50),
    workflow_passes INTEGER,
    include_schema BOOLEAN NOT NULL DEFAULT TRUE,
    model VARCHAR(120),
    provider VARCHAR(255),
    data_source VARCHAR(100),
    query_sql TEXT,
    query_result JSONB,
    chart_payload JSONB,
    table_payload JSONB,
    stream_summary JSONB NOT NULL DEFAULT '[]'::jsonb,
    debug_info JSONB,
    parsed_answer JSONB,
    prompt_metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    duration_ms DOUBLE PRECISION,
    prompt_created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_ai_chat_history_prompts_session_turn
    ON ai_chat_history_prompts (session_id, turn_index);

CREATE INDEX IF NOT EXISTS idx_ai_chat_history_prompts_session_created
    ON ai_chat_history_prompts (session_id, prompt_created_at DESC);

CREATE INDEX IF NOT EXISTS idx_ai_chat_history_prompts_status
    ON ai_chat_history_prompts (status, prompt_created_at DESC);


CREATE TABLE IF NOT EXISTS ai_chat_history_prompt_events (
    id BIGSERIAL PRIMARY KEY,
    prompt_id UUID NOT NULL REFERENCES ai_chat_history_prompts(id) ON DELETE CASCADE,
    request_id VARCHAR(100) NOT NULL,
    event_name VARCHAR(80) NOT NULL,
    event_type VARCHAR(50),
    progress INTEGER,
    label TEXT,
    response_text TEXT,
    payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_chat_history_prompt_events_prompt_id
    ON ai_chat_history_prompt_events (prompt_id, created_at ASC);

CREATE INDEX IF NOT EXISTS idx_ai_chat_history_prompt_events_request_id
    ON ai_chat_history_prompt_events (request_id, created_at ASC);


COMMENT ON TABLE ai_chat_history_sessions IS
'History level 1: satu sesi percakapan/user journey pada manager dashboard atau channel AI lain.';

COMMENT ON TABLE ai_chat_history_prompts IS
'History level 2: satu row per user prompt/request, termasuk jawaban AI, SQL, hasil query, chart/table, dan metadata workflow.';

COMMENT ON TABLE ai_chat_history_prompt_events IS
'History level 3: event stream detail per prompt, cocok untuk replay SSE, audit debugging, dan timeline UI.';
