# ai-engine — Agent Guide

Service AI Sentient Factory (FastAPI + LangChain).

## Stack
- **Python 3.11**, **Poetry**.
- **FastAPI** + **uvicorn**.
- **LangChain 0.0.340** + **OpenAI SDK** (LLM orchestration).
- **Pydantic v2** (+ pydantic-settings) untuk config & DTO.
- **Celery + Redis** untuk job async.
- DB: **psycopg2** (Postgres), **pymysql** (MyERP+), **influxdb-client** (time-series).
- ML/Data: pandas, numpy, scikit-learn.
- OCR/Doc: pytesseract, pdf2image, pypdf, python-docx, openpyxl.
- HTTP client: **httpx** (async).

## Port
3104 (env `AI_ENGINE_PORT`). Saat ini status `inactive` di `config/ports.json`.

## Perintah (dari folder `apps/ai-engine`)
```bash
poetry install
poetry run ai-engine             # entrypoint
poetry run uvicorn sentient_factory_ai.main:app --reload
poetry run pytest
poetry run ruff check .
poetry run black .
poetry run mypy sentient_factory_ai
```

## Layout (`sentient_factory_ai/`)
- `main.py` — FastAPI app + entrypoint `run`.
- `agent_workflow.py` — orkestrasi LangChain agent.
- `llm.py` — wrapper LLM (cache, retry, logging).
- `models.py` — Pydantic schemas (sinkron dengan `packages/shared-types`).
- `attachment_parser.py` — OCR + parser dokumen.
- `audit_store.py` — log keputusan AI (untuk traceability).
- `mysql_client.py` / `postgres_client.py` — adapter DB.
- `codex_config.py` — config terpusat (pydantic-settings).
- `prompts/` — template prompt (jangan inline string panjang di kode).

## Konvensi
- **Type hints wajib**, semua fungsi public.
- Async untuk I/O; jangan campur sync DB call dalam endpoint async.
- LLM call **selalu** lewat `llm.py` (ada cache + retry + audit).
- **Setiap keputusan AI** log ke `audit_store` (traceability untuk regulasi/manufaktur).
- Prompt → file di `prompts/`, load via util; jangan f-string panjang inline.
- Config via env (Pydantic `Settings`), bukan `os.getenv` tersebar.

## Sinkronisasi tipe
`packages/shared-types` adalah SSOT lintas-bahasa. Saat tambah/ubah tipe:
1. Update TypeScript di `packages/shared-types/src/`.
2. Update Pydantic di `sentient_factory_ai/models.py` (atau modul model).
3. Pastikan field name & nullability **identik**.

## Hal yang sering bikin masalah
- Lupa pin OpenAI/LangChain — versi lama-baru sering breaking. Jangan upgrade tanpa baca changelog.
- Pakai `requests` (sync) dalam handler async → blokir event loop. Pakai `httpx.AsyncClient`.
- Log raw LLM output ke stdout → leak data sensitif. Pakai `audit_store` (terstruktur, redacted).
- pdf2image butuh `poppler-utils` di OS; pytesseract butuh `tesseract-ocr`. Cek Dockerfile bila bekerja di container.

## Testing
- `pytest` + `pytest-asyncio` untuk handler async.
- LLM calls di test → mock via `llm.py` interface, **bukan** patch openai client langsung.

## Jangan disentuh tanpa diminta
- `audit_store.py` skema — perubahan = breaking untuk konsumen audit.
- `codex_config.py` default values produksi.

## Worktree Policy (VPS-wide)

- **Do not use Git worktrees on this VPS.** Work directly in the active workspace/checkout.
- Do not create, enter, recommend, or require a worktree for any task, including background jobs.
- Use the current branch, or create a normal Git branch in the same checkout when isolation is needed.
