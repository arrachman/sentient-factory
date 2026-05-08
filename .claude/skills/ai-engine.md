---
name: ai-engine
description: Skill untuk bekerja dengan apps/ai-engine — Python FastAPI AI service dengan LangChain agent, NL-to-SQL generation, SSE/WebSocket streaming, OCR dokumen, dan chat history persistence.
---

Kamu sedang bekerja di `apps/ai-engine` — AI/ML processing service Sentient Factory.

## Tech Stack
- **Framework**: FastAPI + Uvicorn (ASGI)
- **AI/LLM**: LangChain 0.0.340, OpenAI SDK 1.0.0
- **Validasi**: Pydantic v2
- **Cache/Queue**: Redis 5.0 + Celery 5.3
- **Database**: psycopg2 (PostgreSQL read-only), PyMySQL
- **OCR**: PyTesseract + Pillow + pypdf + pdf2image
- **Office Parsing**: openpyxl, python-docx
- **Port**: 8001
- **Python**: 3.11+

## Struktur File (`sentient_factory_ai/`)

| File | Fungsi |
|------|--------|
| `main.py` | FastAPI app, semua endpoint |
| `models.py` | Pydantic request/response models |
| `settings.py` | Konfigurasi dari environment variables |
| `semantic_schema.py` | Membangun schema semantik untuk LLM |
| `postgres_client.py` | PostgreSQL read-only query executor |
| `mysql_client.py` | MySQL connectivity (MyERPPlus) |
| `llm.py` | LLM request handler (multi-provider) |
| `agent_workflow.py` | Multi-step agent orchestration |
| `codex_config.py` | Codex CLI config loader |
| `audit_store.py` | Persistensi chat history |
| `attachment_parser.py` | OCR & document extraction |
| `progress_stream.py` | SSE broker untuk streaming |
| `runner.py` | Background task runner |

## API Endpoints

| Method | Path | Fungsi |
|--------|------|--------|
| GET | `/health` | Health check |
| GET | `/api/schema/semantic` | Get semantic schema |
| POST | `/api/chat/query` | Eksekusi chat query |
| POST | `/api/chat/dashboard-query` | Dashboard multi-query (max 5) |
| POST | `/api/chat/query/trigger` | Trigger async query |
| POST | `/api/chat/test` | Test LLM model |
| GET | `/api/chat/progress/{request_id}` | SSE progress stream |
| WS | `/api/chat/progress/ws/{request_id}` | WebSocket progress |
| GET | `/api/chat/history/sessions` | Daftar chat sessions |
| GET | `/api/chat/history/sessions/{id}/prompts` | Prompts per session |
| PATCH | `/api/chat/history/sessions/{id}` | Rename session |
| DELETE | `/api/chat/history/sessions/{id}` | Hapus session |

## Alur Kerja AI Agent

```
User Query
    ↓
semantic_schema.py  → Load OBT schema dari myerpplus-db-mapping
    ↓
llm.py              → Generate SQL dengan LLM (OpenAI/Claude)
    ↓
agent_workflow.py   → Multi-pass validation & refinement (max 2 pass)
    ↓
postgres_client.py  → Eksekusi SQL read-only di PostgreSQL
    ↓
progress_stream.py  → Stream hasil ke client via SSE/WebSocket
```

## Perintah Umum

```bash
# Development
uvicorn sentient_factory_ai.main:app --reload --port 8001

# Dengan Python venv
python -m venv .venv
source .venv/bin/activate
pip install -e ".[dev]"

# Atau dengan uv
uv sync
uv run uvicorn sentient_factory_ai.main:app --reload --port 8001

# Test
pytest
pytest tests/ -v

# Regression tests
python prompts/run_m5_regression.py
python prompts/run_dashboard_multi_query_regression.py
```

## Environment Variables Penting

```bash
DATABASE_URL=postgresql://...         # PostgreSQL connection (read-only)
MYERPPLUS_DATABASE_URL=mysql://...    # Optional MySQL source

LLM_API_BASE_URL=https://api.openai.com/v1
LLM_MODEL=gpt-4o
LLM_API_KEY=sk-...
LLM_REQUEST_TIMEOUT_SECONDS=120

AI_DASHBOARD_MAX_QUERIES=5
AI_AGENT_WORKFLOW_MAX_PASSES=2

SEMANTIC_SCHEMA_MANIFEST_PATH=...     # Path ke obt-agent-mapping.json
SEMANTIC_QUERY_SCHEMA_SALES_PATH=...  # Path ke dashboard schema JSON
```

## Panduan Tugas Umum

### Menambah Endpoint Baru
```python
# Di main.py
@app.post("/api/chat/new-feature")
async def new_feature(request: NewFeatureRequest):
    # Tambah model di models.py terlebih dahulu
    ...
```

### Mengubah LLM Provider
- Edit `settings.py` untuk konfigurasi provider
- Edit `llm.py` untuk logic inisialisasi client
- Mendukung OpenAI-compatible API (termasuk Claude via proxy)

### Menambah OCR/Document Type Baru
- Edit `attachment_parser.py`
- Tambah handler untuk MIME type baru

### Debugging Agent Workflow
- Set `AI_AGENT_WORKFLOW_MAX_PASSES=1` untuk single-pass
- Cek `audit_store.py` untuk melihat history query yang tersimpan
- Gunakan `/api/chat/test` untuk test LLM langsung tanpa agent
