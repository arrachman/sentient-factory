# AI Chat History Schema

Schema ini membagi history menjadi 3 level.

## 1. Session
Tabel: `ai_chat_history_sessions`

Satu row mewakili satu sesi interaksi user di manager dashboard atau channel AI lain.

Field utama:
- `id`
- `session_key`
- `user_id`
- `username`
- `channel`
- `mode`
- `title`
- `status`
- `started_at`
- `ended_at`
- `last_prompt_at`
- `prompt_count`
- `metadata`

## 2. Per User Prompt
Tabel: `ai_chat_history_prompts`

Satu row mewakili satu prompt user dalam satu session.

Field utama:
- `session_id`
- `request_id`
- `turn_index`
- `prompt_text`
- `started_response`
- `explanation_response`
- `insight_response`
- `answer_text`
- `answer_json`
- `status`
- `failure_type`
- `failure_message`
- `schema_key`
- `workflow_mode`
- `model`
- `provider`
- `query_sql`
- `query_result`
- `chart_payload`
- `table_payload`
- `stream_summary`
- `debug_info`
- `parsed_answer`
- `duration_ms`

## 3. Prompt Event Timeline
Tabel: `ai_chat_history_prompt_events`

Satu row mewakili satu event stream per prompt.

Field utama:
- `prompt_id`
- `request_id`
- `event_name`
- `event_type`
- `progress`
- `label`
- `response_text`
- `payload`
- `created_at`

## Relasi
- `ai_chat_history_sessions.id -> ai_chat_history_prompts.session_id`
- `ai_chat_history_prompts.id -> ai_chat_history_prompt_events.prompt_id`

## Catatan Mapping dari Implementasi Sekarang
- `ai_chat_audit_logs` yang sudah ada sekarang paling dekat dengan level `per user prompt`
- `event_history` yang sekarang tersimpan sebagai JSONB bisa dipindah ke tabel `ai_chat_history_prompt_events`
- history localStorage di manager page bisa dipetakan ke:
  - session: tab/konteks percakapan
  - prompt: satu run user
  - prompt events: timeline SSE
