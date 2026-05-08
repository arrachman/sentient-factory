# ADR 002: Extend `api-gateway` dengan Namespace `/althea/*`

**Status**: Accepted (MVP); reconsider at scale
**Date**: 2026-05-08
**Deciders**: User + Claude Code

## Context

Backend untuk web-althea bisa:
- A. Extend `api-gateway` (NestJS existing) dengan namespace
- B. Buat service baru `api-althea` (microservice penuh)
- C. Hybrid: api-gateway sebagai edge proxy, api-althea sebagai domain service

## Decision

Pakai **Opsi A** untuk MVP: extend `api-gateway` dengan:
- Namespace endpoint `/althea/*` (e.g., `/althea/psikolog`, `/althea/bookings`)
- Schema PostgreSQL terpisah `althea_*` (model prefix `Althea*` di Prisma)
- Module folder `src/althea-<feature>/` (separate dari `src/master-data-items/` etc.)

Future migration path: extract jadi `api-althea` service (port 3204 reserved) saat traffic/team membesar atau scope compliance perlu isolated.

## Consequences

### Positive
- Faster MVP (no infra setup baru)
- Shared auth: 1 source of truth untuk JWT/cookie/user table
- Shared infra: logger, redis, queue dari api-gateway
- Frontend tidak perlu berubah saat migrate (api-gateway tetap edge)
- Compliance scope tetap bisa di-isolate via DB schema separation

### Negative
- DB pasien (sensitif) sharing instance dengan ERP — mitigasi: schema-level separation + RLS
- Deploy api-gateway = deploy semua module — mitigasi: feature flag kalau perlu
- Risk coupling code (mitigasi: strict folder boundary `src/althea-*/`)

## Alternatives Considered

- **Opsi B (full microservice)**: rejected untuk MVP — overhead infra terlalu tinggi tanpa traffic justification.
- **Opsi C (hybrid edge)**: ideal end-state, tapi premature untuk MVP. Plan future migration kalau scale demand.

## Migration trigger (kapan extract jadi api-althea)

- Traffic web-althea > 30% dari total api-gateway throughput
- Team althea ≥ 3 developer dengan cadence deploy beda
- Compliance audit demand isolated infra
- DB althea_* > 50% storage api-gateway DB

## Reference

`config/ports.json` — port 3204 reserved untuk `api-althea` future service.
