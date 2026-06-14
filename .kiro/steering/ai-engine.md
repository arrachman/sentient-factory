---
inclusion: fileMatch
fileMatchPattern: "apps/ai-engine/**"
---

# AI Engine — Python FastAPI Service

`apps/ai-engine` — AI/ML processing service Sentient Factory. Port **8001**.

## Tech Stack

- FastAPI + Uvicorn (ASGI), Python 3.11+
- LangChain 0.0.340, OpenAI SDK 1.0.0
- Pydantic v2, Redis 5.0 + Celery 5.3
- psycopg2 (PostgreSQL read-only), PyMySQL
- PyTesseract + Pillow + pypdf + pdf2image (OCR)
- openpyxl, python-docx

## Struktur File (`sentient_factory_ai/`)

| File | Fungsi |
|------|--------|
| `main.py` | FastAPI app, semua endpoint |
| `models.py` | Pydantic request/response models |
| `settings.py` | Konfigurasi dari env vars |
| `semantic_schema.py` | Schema semantik untuk LLM |
| `postgres_client.py` | PostgreSQL read-only executor |
| `llm.py` | LLM request handler (multi-provider) |
| `agent_workflow.py` | Multi-step agent orchestration |
| `audit_store.py` | Persistensi chat history |
| `attachment_parser.py` | OCR & document extraction |
| `progress_stream.py` | SSE broker untuk streaming |

## Alur AI Agent

```
User Query → semantic_schema.py (OBT schema)
           → llm.py (generate SQL)
           → agent_workflow.py (multi-pass validation, max 2 pass)
           → postgres_client.py (eksekusi read-only)
           → progress_stream.py (SSE/WebSocket ke client)
```

## API Endpoints

| Method | Path | Fungsi |
|--------|------|--------|
| GET | `/health` | Health check |
| POST | `/api/chat/query` | Chat query |
| POST | `/api/chat/dashboard-query` | Dashboard multi-query (max 5) |
| GET | `/api/chat/progress/{id}` | SSE progress stream |
| WS | `/api/chat/progress/ws/{id}` | WebSocket progress |
| GET | `/api/chat/history/sessions` | Daftar chat sessions |

## Perintah

```bash
# Development
uv sync
uv run uvicorn sentient_factory_ai.main:app --reload --port 8001

# Test
pytest tests/ -v
python prompts/run_m5_regression.py
```

## Environment Variables Penting

```bash
DATABASE_URL=postgresql://...
LLM_API_BASE_URL=https://api.openai.com/v1
LLM_MODEL=gpt-4o
LLM_API_KEY=sk-...
AI_AGENT_WORKFLOW_MAX_PASSES=2
SEMANTIC_SCHEMA_MANIFEST_PATH=...   # path ke obt-agent-mapping.json
```

## Sinkronisasi dengan shared-types

Setelah ubah TypeScript types → jalankan `npm run generate:python` di `packages/shared-types` untuk auto-generate Pydantic models di `apps/ai-engine/sentient_factory_ai/models.py`.

## Debugging

- Set `AI_AGENT_WORKFLOW_MAX_PASSES=1` untuk single-pass debug
- Gunakan `/api/chat/test` untuk test LLM langsung tanpa agent
- Cek `audit_store.py` untuk melihat history query tersimpan
