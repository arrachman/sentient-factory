# AI Engine

Service ini menyediakan endpoint tanya jawab untuk `apps/web-dashboard` dengan konteks semantic schema dari Postgres.

## Endpoint

- `GET /health`
- `GET /api/schema/semantic`
- `POST /api/chat/query`

## Menjalankan lokal

```bash
cd apps/ai-engine
python3 -m pip install --user --break-system-packages fastapi 'uvicorn[standard]' pydantic-settings httpx psycopg2-binary tomli
PYTHONPATH=/home/rania/apps/sentient-factory/apps/ai-engine \
DATABASE_URL='postgresql://root:<password>@127.0.0.1:3208/sentient_factory' \
CODEX_CONFIG_PATH=/home/rania/.codex/config.toml \
python3 -m uvicorn sentient_factory_ai.main:app --host 0.0.0.0 --port 8001
```

## Env penting

- `DATABASE_URL`
- `LLM_API_BASE_URL` opsional, default fallback ke `~/.codex/config.toml`
- `LLM_MODEL` opsional, default fallback ke `~/.codex/config.toml`
- `LLM_API_KEY` opsional, default fallback ke `~/.codex/config.toml`

## Integrasi dashboard

`apps/web-dashboard` sudah punya proxy route:

- `POST /api/ai/chat`
- `GET /api/ai/schema`

Set `AI_ENGINE_URL` di env dashboard bila service tidak jalan di `http://127.0.0.1:8001`.

## Menjalankan via Docker Compose

```bash
VAULT_DEV_ROOT_TOKEN_ID=change-me-local-only \
docker compose -p sentient_factory -f infra/docker-compose.yml up -d llm-router ai-engine web-dashboard
```

Health check:

```bash
curl http://127.0.0.1:8001/health
curl -X POST http://127.0.0.1:3201/api/ai/chat \
  -H 'Content-Type: application/json' \
  -d '{"question":"Tabel apa yang relevan untuk user dan role?","include_schema":true,"include_samples":false}'
```

## Catatan model provider

Secara default service ini membaca model, base URL, dan bearer token dari `~/.codex/config.toml` yang sedang Anda pakai.
Jika `LLM_API_BASE_URL`, `LLM_MODEL`, atau `LLM_API_KEY` diisi, env tersebut akan override fallback dari config Codex.

## Runbook cepat

Start service yang dibutuhkan untuk AI manager dashboard:

```bash
export VAULT_DEV_ROOT_TOKEN_ID=change-me-local-only
docker compose -p sentient_factory -f infra/docker-compose.yml up -d llm-router ai-engine web-dashboard
```

Cek health:

```bash
curl http://127.0.0.1:3206/health
curl http://127.0.0.1:8001/health
curl -X POST http://127.0.0.1:3201/api/ai/chat \
  -H 'Content-Type: application/json' \
  -d '{"question":"Tabel apa yang relevan untuk user dan role?","include_schema":true,"include_samples":false}'
```

UI manager dashboard:

```text
http://127.0.0.1:3201/app/dashboard/manager
```
