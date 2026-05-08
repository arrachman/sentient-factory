# ADR 006: Table Prefix `clinic_*` (Domain-focused, Not Brand)

**Status**: Accepted
**Date**: 2026-05-08
**Deciders**: User + Claude Code

## Context

Existing api-gateway pakai layered prefix `m{N}_*` untuk ERP tables:
- `m0_*` = master/auth (m0_users, m0_role, m0_user_role, m0_permission)
- `m1_*` = master data (m1_item, m1_warehouse, m1_uom)
- `m2_*` = transactional (m2_outbound, m2_inbound)

Untuk Althea Psychology tables butuh prefix yang:
- Distinct dari ERP namespace
- Clear scope (clinic management/scheduling)
- Reusable kalau Sentient Factory expand ke klinik lain (dentist, hospital, dll)
- Konsisten dengan existing English naming convention

User mengarahkan: "fokus ke kata klinik atau penjadwalan klinik" — bukan brand-specific (Althea).

## Decision

Pakai prefix **`clinic_*`** untuk semua tables yang melayani clinic management/scheduling system.

### Naming convention

**Prisma model**: `Clinic*` PascalCase
**Table name** via `@@map`: `clinic_<entity>` snake_case

| Prisma model | Table name |
|---|---|
| `ClinicPsikologProfile` | `clinic_psikolog_profile` |
| `ClinicService` | `clinic_service` |
| `ClinicRoom` | `clinic_room` |
| `ClinicClient` | `clinic_client` |
| `ClinicBooking` | `clinic_booking` |
| `ClinicSessionNote` | `clinic_session_note` |
| `ClinicWaTemplate` | `clinic_wa_template` |
| `ClinicWaLog` | `clinic_wa_log` |
| `ClinicAuditLog` | `clinic_audit_log` |
| `ClinicPayment` | `clinic_payment` |
| `ClinicSettings` | `clinic_settings` |

Code usage: `prisma.clinicPsikologProfile.findMany()`, `prisma.clinicBooking.create(...)`.

### Storage
- Tetap di PostgreSQL schema `public` (mengikuti pattern existing m{N}_*)
- Tidak pakai `@@schema("clinic")` — overhead multi-schema tidak diperlukan untuk MVP
- Future kalau perlu compliance scope, bisa migrate ke schema terpisah

## Consequences

### Positive
- **Domain-focused, bukan brand**: kalau Sentient Factory bikin sistem klinik lain, pattern reusable tanpa rename
- **Distinct dari ERP**: tidak collision dengan `m0/m1/m2` namespace
- **Konsisten**: English snake_case existing convention
- **Pronounce-able**: "clinic" jelas, code readable

### Negative
- Prefix 6 char (sedikit lebih panjang dari `m0` 2 char) — clarity > brevity
- Generic "clinic" — kalau later butuh multiple clinic systems berbeda di 1 monorepo, refactor saat actually needed

## Alternatives Considered

| Pilihan | Pro | Con | Verdict |
|---|---|---|---|
| `apsy_*` (Althea Psychology) | Specific brand | Brand-coupled, sulit reuse | ❌ Rejected |
| `psy_*` | Pendek | Ambigu (psychology vs psikolog) | ❌ Rejected |
| `althea_*` | Eksplisit | Brand-coupled | ❌ Rejected |
| `clinic_m{N}_*` | Konsisten m{N} | Prefix terlalu panjang | ❌ Rejected |
| `sched_*` | Highlight scheduling | Tidak cover non-scheduling tables | ❌ Rejected |
| **`clinic_*`** flat | Domain-focused, reusable, distinct | Sedikit lebih panjang | ✅ **Accepted** |

## Implementation

Slice 0 (Foundation): migration `clinic_foundation` tambah:
- `ClinicSettings`
- `ClinicAuditLog`
- `ClinicPsikologProfile` (FK ke User.id)

Slice 1+: tambah tables sesuai feature, semua dengan prefix `clinic_*`.

## Reference

- `apps/api-gateway/prisma/schema.prisma` — existing m{N}_* convention
