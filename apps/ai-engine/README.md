# AI Engine

Service ini menyediakan endpoint tanya jawab untuk `apps/web-dashboard` dengan konteks `obt-agent-mapping.json` sebagai semantic OBT mapping utama, plus semantic query schema dashboard OBT. Query read-only untuk AI dashboard sekarang ditargetkan ke PostgreSQL OBT pada `127.0.0.1:3208`.

## Endpoint

- `GET /health`
- `GET /api/schema/semantic`
- `POST /api/chat/query`
- `POST /api/chat/dashboard-query`

Dokumen desain lanjutan:

- `MULTI_QUERY_DASHBOARD_PLAN.md`

## Menjalankan lokal

```bash
cd apps/ai-engine
python3 -m pip install --user --break-system-packages fastapi 'uvicorn[standard]' pydantic-settings httpx psycopg2-binary tomli
PYTHONPATH=/opt/sentient-factory/apps/ai-engine \
DATABASE_URL='postgresql://root:<password>@127.0.0.1:3208/sentient_factory' \
CODEX_CONFIG_PATH=/opt/sentient-factory/.codex-cli/config.toml \
python3 -m uvicorn sentient_factory_ai.main:app --host 0.0.0.0 --port 8001
```

## Env penting

- `DATABASE_URL`
- `AI_DASHBOARD_MAX_QUERIES`
  default sekarang `5`
- `SEMANTIC_SCHEMA_MANIFEST_PATH`
  default sekarang mengarah ke `apps/myerpplus-db-mapping/db/obt-agent-mapping.json`
- `SEMANTIC_QUERY_SCHEMA_SALES_PATH`
  default sekarang mengarah ke `apps/myerpplus-db-mapping/db/semantic-query-schema-dashboard-obt.json`
- `LLM_API_BASE_URL` opsional, default fallback ke `.codex-cli/config.toml`
- `LLM_MODEL` opsional, default fallback ke `.codex-cli/config.toml`
- `LLM_API_KEY` opsional, default fallback ke `.codex-cli/config.toml`
- `AI_AGENT_WORKFLOW_MAX_PASSES` untuk jumlah langkah agent. Rekomendasi operasional workflow: `2`
- `LLM_REQUEST_TIMEOUT_SECONDS` untuk timeout per call ke provider LLM. Rekomendasi workflow: `120` atau `180`
- `LLM_REQUEST_MAX_RETRIES` untuk retry call provider. Default aman: `3`

## Integrasi dashboard

`apps/web-dashboard` sudah punya proxy route:

- `POST /api/ai/chat`
- `GET /api/ai/schema`

Set `AI_ENGINE_URL` di env dashboard bila service tidak jalan di `http://127.0.0.1:8001`.

## Menjalankan via Docker Compose

```bash
VAULT_DEV_ROOT_TOKEN_ID=change-me-local-only \
docker compose -p sentient_factory -f infra/docker-compose.yml up -d ai-engine web-dashboard
```

Health check:

```bash
curl http://127.0.0.1:8001/health
curl -X POST http://127.0.0.1:3201/api/ai/chat \
  -H 'Content-Type: application/json' \
  -d '{"question":"Tabel apa yang relevan untuk user dan role?","include_schema":true,"include_samples":false}'
```

Contoh mode dashboard:

```bash
curl -X POST http://127.0.0.1:8001/api/chat/dashboard-query \
  -H 'Content-Type: application/json' \
  -d '{"question":"Buat dashboard piutang customer: daftar invoice belum lunas, total outstanding per customer, dan aging bucket","include_schema":true,"include_samples":false}'
```

Jika workflow sering gagal dengan `ReadTimeout`, restart `ai-engine` setelah menaikkan timeout:

```bash
docker compose -p sentient_factory -f infra/docker-compose.yml up -d --force-recreate ai-engine
```

## Catatan model provider

Secara default service ini membaca model, base URL, dan bearer token dari `.codex-cli/config.toml` yang sedang Anda pakai.
Jika `LLM_API_BASE_URL`, `LLM_MODEL`, atau `LLM_API_KEY` diisi, env tersebut akan override fallback dari config Codex.

## Regression test M5 prompt

Artefak regression M5:

- `prompts/sales_sql_readonly_generator.m5-regression-tests.md`
- `prompts/sales_sql_readonly_generator.m5-regression-tests.json`
- `prompts/validate_m5_regression.py`
- `prompts/run_m5_regression.py`

Jalankan full regression:

```bash
cd /opt/sentient-factory/apps/ai-engine
PYTHONPATH=/opt/sentient-factory/apps/ai-engine \
DATABASE_URL='postgresql://dummy:dummy@localhost:5432/dummy' \
python3 prompts/run_m5_regression.py
```

Jalankan subset test:

```bash
cd /opt/sentient-factory/apps/ai-engine
PYTHONPATH=/opt/sentient-factory/apps/ai-engine \
DATABASE_URL='postgresql://dummy:dummy@localhost:5432/dummy' \
python3 prompts/run_m5_regression.py \
  --ids m5_005_ic_poly_si m5_006_pv_poly_sr
```

Output default akan disimpan ke:

```text
apps/ai-engine/prompts/regression-results/
```

Validator manual tetap bisa dipakai jika sudah punya output query sendiri:

```bash
cd /opt/sentient-factory/apps/ai-engine
python3 prompts/validate_m5_regression.py \
  --outputs /path/to/generated-results.json
```

## Regression test dashboard multi-query

Artefak regression dashboard:

- `prompts/dashboard_multi_query_regression_seed.json`
- `prompts/validate_dashboard_multi_query.py`
- `prompts/run_dashboard_multi_query_regression.py`

Jalankan full regression dashboard:

```bash
cd /opt/sentient-factory/apps/ai-engine
python3 prompts/run_dashboard_multi_query_regression.py
```

Jalankan subset test dashboard:

```bash
cd /opt/sentient-factory/apps/ai-engine
python3 prompts/run_dashboard_multi_query_regression.py \
  --ids dashboard_001_customer_receivable dashboard_002_sales_funnel
```

Validator manual untuk output dashboard:

```bash
cd /opt/sentient-factory/apps/ai-engine
python3 prompts/validate_dashboard_multi_query.py \
  --outputs /path/to/dashboard-results.json
```

## Runbook cepat

Start service yang dibutuhkan untuk AI manager dashboard:

```bash
export VAULT_DEV_ROOT_TOKEN_ID=change-me-local-only
docker compose -p sentient_factory -f infra/docker-compose.yml up -d ai-engine web-dashboard
```

Cek health:

```bash
curl http://127.0.0.1:8001/health
curl -X POST http://127.0.0.1:3201/api/ai/chat \
  -H 'Content-Type: application/json' \
  -d '{"question":"Tabel apa yang relevan untuk user dan role?","include_schema":true,"include_samples":false}'
```

UI Senti AI:

```text
http://127.0.0.1:3201/app/senti-ai
```

## OCR attachment

OCR attachment server-side untuk `pdf` dan `image` membutuhkan binary sistem berikut di host atau container `ai-engine`:

```bash
apt-get update
apt-get install -y tesseract-ocr tesseract-ocr-ind tesseract-ocr-eng poppler-utils
```

Dependency Python OCR sudah didaftarkan di [pyproject.toml](/opt/sentient-factory/apps/ai-engine/pyproject.toml):
- `pytesseract`
- `Pillow`
- `pypdf`
- `openpyxl`
- `python-docx`

Jika binary OCR belum tersedia, upload attachment tetap diterima, tetapi file terkait akan fallback ke `metadata-only` atau `failed` dengan warning yang menjelaskan penyebabnya.
