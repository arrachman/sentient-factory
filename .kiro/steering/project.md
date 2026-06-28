---
inclusion: always
---

# Sentient Factory — Monorepo Context

Monorepo dengan npm workspaces + Turbo. Semua apps di `apps/`, packages di `packages/`.

## Apps

| App | Path | Port | Tech |
|-----|------|------|------|
| api-gateway | `apps/api-gateway` | 3103 | NestJS + Prisma + PostgreSQL |
| web-dashboard | `apps/web-dashboard` | 3201 | Next.js 16 + React 19 |
| web-erp (prototype) | `apps/web-erp/prototype` | 3218 | CDN React 18 SPA, no bundler |
| ai-engine | `apps/ai-engine` | 8001 | Python FastAPI + LangChain |
| docs | `apps/docs` | 3205 | Docusaurus |

## Packages

| Package | Path | Fungsi |
|---------|------|--------|
| shared-types | `packages/shared-types` | TypeScript types (SSOT) |
| ui-kit | `packages/ui-kit` | React component library |
| logger | `packages/logger` | Pino structured logging |

## Aturan Monorepo (non-negosiabel)

1. **shared-types** adalah kontrak antar services — ubah dengan hati-hati, selalu update sisi TS *dan* Pydantic sekaligus.
2. Port assignments ada di `config/ports.json` — jangan hardcode port di code.
3. Setelah ubah `prisma/schema.prisma` → `npm run db:generate` lalu `npm run db:migrate -- --name <slug>`.
4. Satu file maksimal 400 baris — jika lebih, split dulu sebelum edit.
5. Saat ada ambiguitas scope, naming, atau dampak DB → **tanya user dulu**.
6. Setiap keputusan penting → update `.md` dokumentasi relevan supaya sinkron.
7. Selaraskan `.planning/CHANGELOG.md` & `.planning/ROADMAP.md` bila status fitur berubah.

## Infra

- PostgreSQL 17: port `3208` (Docker), container `sentient-postgres-core`, DB `sentient_factory`
- Redis 7: port `3214`
- Vault: port `8200`
- Docker Compose: `infra/docker-compose.yml`
- Secrets: dikelola via HashiCorp Vault, scripts di `scripts/`

## Deployment

- Domain production: `*.fr-labs.my.id` (lihat ADR 009)
- ERP: `erp.fr-labs.my.id` → apps/web-erp
