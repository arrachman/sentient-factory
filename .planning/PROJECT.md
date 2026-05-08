# Project: Web-Althea — Althea Psychology Booking System

## What

Aplikasi internal Althea Psychology untuk manajemen klinik psikologi: scheduling, client management, session tracking, WhatsApp notifications, audit & compliance, payment processing.

**App**: `apps/web-althea/` (Next.js 16 + TS, port 3202)
**Backend**: extend `apps/api-gateway/` dengan namespace `/clinic/*` (NestJS + Prisma + PostgreSQL, port 3203)
**Table prefix**: `clinic_*` di public schema PostgreSQL (lihat ADR 006)

## Why

Althea Psychology butuh sistem operasional menggantikan workflow manual (spreadsheet + WhatsApp). Tujuan:
- **Otomatisasi notifikasi WA** untuk klien & psikolog (confirmation, H-1, 30-min, follow-up)
- **Reduksi konflik scheduling** dengan grid view + auto-detect overlap
- **Akuntabilitas multi-role** via audit log
- **Payment tracking** + bukti pembayaran PDF auto-send
- **KPI visibility** untuk owner (utilization, revenue, sessions/day)

## Stakeholders

- **Client**: Althea Psychology (klinik di Indonesia)
- **End users (in app)**: 6 role internal staff (prefix `clinic-` di Role table)
  - `clinic-admin` (full scheduling control)
  - `clinic-psikolog` (own schedule + clinical notes)
  - `clinic-owner` (KPI dashboard)
  - `clinic-resepsionis` (real-time check-in)
  - `clinic-marketing` (read-only service catalog)
  - `clinic-intern` (placeholder, minimal access)
- **External recipients (NOT in app)**: pasien (terima WA notification, tidak login)

## Scope

### In scope (MVP)
- 14 slices: foundation → master data → client → booking → WA → workflow → check-in → dashboard → payment → polish
- 6 roles with route-based RBAC
- 18 WhatsApp templates × 4 categories with 4-status delivery + 3× retry
- 16 service types (konseling, terapi, terapi anak, tes psikologi)
- 11 specific rooms (Sky/Sage/Forest/Sunset/Mint, Terapi 1-3 + Playground, Tes, Seminar)
- PWA-ready, desktop-first responsive mobile (Chrome/Safari, iPhone/Android)
- Payment: DP + lunas, PDF receipt auto-send via WA

### Out of scope (post-MVP)
- Patient self-booking portal
- Native iOS/Android apps (separate contract)
- Video call provider integration
- Calendar sync (Google Calendar, etc.)
- Insurance integration
- SMS fallback (manual workaround)
- Email notifications (semua via WA)

### Constraints
- Uptime 99.5%/bulan target
- Training: 1× 2-jam live walkthrough only
- Max 2 revisi setelah UAT sign-off
- DB schema terpisah dari ERP untuk compliance scope tegas

## Tech Stack

### Backend (`apps/api-gateway/`)
- NestJS 10 + Prisma 5 + PostgreSQL
- Module pattern: `src/<feature>/{controller, service, module}.ts` + `dto/`
- Migrations: `prisma migrate dev`
- Auth: JWT + Passport, role-based guards
- Reference template: `src/master-data-items/`
- Testing: Jest (establish dari Slice 0 — belum ada existing pattern)

### Frontend (`apps/web-althea/`)
- Next.js 16 (App Router) + React 19 + TypeScript strict
- Tailwind CSS v4 + ShadCN-style + Radix
- TanStack Query v5 + TanStack Table v8
- react-hook-form + zod
- Reference template: `apps/web-dashboard/features/master-item/`, `logistic-stock-report/`
- Testing: Vitest (unit) + Playwright (e2e)
- Design tokens: `styles/althea-tokens.css` (sage + cream + teal palette)

### Cross-cutting
- npm workspaces + Turborepo
- Shared: `packages/{logger, shared-types, ui-kit}`
- Port: `config/ports.json` authoritative (3202 web, 3203 api)
- Docker: `infra/docker-compose.yml`
- Auth: cookie `sf_token` shared dengan `web-dashboard` (SSO)

## Architecture Decisions

ADRs di `.planning/ADRs/`:
- **001**: Vertical slicing per feature (DB → API → UI → Test)
- **002**: Extend api-gateway dengan namespace `/clinic/*` (vs. separate api-clinic service)
- **003**: 6-actor role model — extend existing User+Role+Permission, tambah `clinic-*` roles, drop patient self-service
- **004**: WhatsApp provider — **Fonnte** (Indonesian gateway), abstraction tetap pakai `WAProvider` interface
- **005**: Audit log via NestJS interceptor (auto-track all mutations)
- **006**: Table prefix `clinic_*` (domain-focused, bukan brand-coupled)
- **007**: Pricing & payment model — rate card per service, package total price, DP 50%, PPN 11% configurable
- **008**: Booking constraints — uniform working hours, buffer 15min default + override, walk-in allowed, reschedule fleksibel

## Workflow

Lihat `.planning/ROADMAP.md` untuk slice list & status.

Per slice rhythm:
```
/gsd-spec-phase    → SPEC.md (acceptance criteria)
/gsd-plan-phase    → PLAN.md (task breakdown)
/gsd-execute-phase → atomic commits
/gsd-verify-work   → VERIFICATION.md (UAT pass)
/gsd-ship          → PR + merge
```

Artifacts persist per phase di `.planning/phases/<slice>/` agar resumable cross-session.

## Quick reference

| Aspek | Value |
|---|---|
| App entry | `apps/web-althea/` |
| Backend extension | `apps/api-gateway/src/clinic-*/` |
| DB models | `apps/api-gateway/prisma/schema.prisma` (model `Clinic*`, table `clinic_*`) |
| Port (web) | 3202 (`WEB_ALTHEA_PORT`) |
| Port (api) | 3203 (`API_GATEWAY_PORT`) |
| Prod URL (web) | http://althea.fr-labs.my.id/ → reverse-proxy ke port 3202 |
| Prod URL (api) | http://althea.fr-labs.my.id/api → reverse-proxy ke port 3203 |
| Branch | `work/superpowers-trial` (kerja saat ini) |
| Design ref | `apps/psychology-design/` (read-only mockup) |
| PRD | `apps/psychology-design/JAWABAN-PERTANYAAN-KLIEN-2026-05-07.md` |
| Strategy plan | `~/.claude/plans/mau-tanya-untuk-pembuatan-toasty-riddle.md` |
| WA provider | Fonnte (https://fonnte.com) — env `FONNTE_API_TOKEN` |
| Tenant model | Single-tenant (no tenantId) |
| Deployment | Self-host VPS via `infra/docker-compose.yml` |
