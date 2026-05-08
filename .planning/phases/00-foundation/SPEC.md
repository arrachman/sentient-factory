# Slice 0: Foundation — SPEC

**Status**: 🔵 Not started
**Estimated sessions**: 1-2
**Depends on**: – (root slice)
**Blocks**: All other slices

## Goal

Establish cross-cutting prereqs yang dipakai semua slice berikutnya:
1. Base DB schema dengan prefix `clinic_*` (ClinicAuditLog, ClinicSettings, ClinicPsikologProfile) di api-gateway
2. Tambah 6 role rows ke existing `Role` table (clinic-admin/psikolog/owner/resepsionis/marketing/intern)
3. Auth extension: JWT claim include role list, RolesGuard decorator
4. Web-althea actor restructure dari 3 → 6 role (drop patient self-service)
5. Audit log interceptor (auto-track all mutations)
6. WA provider interface abstraction + MockProvider (Fonnte impl di Slice 8)
7. Test infrastructure pattern di Jest (api-gateway) + Vitest + Playwright (web-althea)
8. Seed dev DB lengkap: 6 user + 7 psikolog + 16 service + 11 room + 5 client + 18 WA template + clinic settings

## Non-goals (out of slice 0)

- ❌ Implementasi domain entity Psikolog/Service/Room (Slice 1-3)
- ❌ Real WA provider integration (Slice 8)
- ❌ Audit log UI viewer (Slice 12)
- ❌ Login UI implementation (sebagian di Slice 0, lengkap di slice tersendiri kalau perlu)

## Acceptance Criteria

### A. DB Foundation
- [ ] `apps/api-gateway/prisma/schema.prisma` ditambah models:
  - `ClinicUser` (extends concept User dengan role enum 6 nilai)
  - `ClinicAuditLog` (id, actorId, role, action, resourceType, resourceId, timestamp, ipAddress, requestId, payloadDiff)
  - `ClinicClinicSettings` (single-row config untuk clinic)
  - Enum `ClinicRole` = `admin | psikolog | owner | resepsionis | marketing | intern`
- [ ] Migration generated: `npm run db:generate && npm run db:migrate` dari direktori api-gateway
- [ ] Migration file ada di `apps/api-gateway/prisma/migrations/<timestamp>_clinic_foundation/`
- [ ] Tabel di PostgreSQL: schema `public` (mengikuti pattern existing m{N}_*), prefix `clinic_*`

### B. Auth Extension (api-gateway)
- [ ] Update `apps/api-gateway/src/auth/auth.service.ts` — JWT sign include `role` claim dengan `ClinicRole` enum
- [ ] Tambah `RolesGuard` decorator: `@Roles('admin')`, `@Roles('admin', 'psikolog')`
- [ ] Test: 6 user (1 per role) di-seed dapat login + dapet JWT yang berisi role mereka
- [ ] Cookie `sf_token` set sesuai pattern existing (compatible dengan web-dashboard SSO)

### C. Web-Clinic Actor Restructure
- [ ] Delete `apps/web-althea/app/(patient)/` directory + content
- [ ] Create route groups baru:
  - `apps/web-althea/app/(owner)/dashboard/page.tsx`
  - `apps/web-althea/app/(resepsionis)/dashboard/page.tsx`
  - `apps/web-althea/app/(marketing)/dashboard/page.tsx`
  - `apps/web-althea/app/(intern)/dashboard/page.tsx`
- [ ] Update `apps/web-althea/shared/auth/constants.ts`:
  - `Role` type extended ke 6 nilai
  - `ROLE_DEFAULT_ROUTE` ada entry untuk 6 role
  - `ROLE_ROUTE_PREFIXES` ada entry untuk 6 role dengan prefix yang sesuai
- [ ] Update `apps/web-althea/middleware.ts`:
  - Handle 6 role dengan benar
  - Admin bypass (akses semua route group)
  - Role lain hanya akses prefix mereka
- [ ] Update `apps/web-althea/CLAUDE.md` section "Role-based routing" untuk reflect 6 role

### D. Audit Log Auto-Write Interceptor
- [ ] Bikin module `apps/api-gateway/src/clinic-audit/`:
  - `audit.interceptor.ts` — NestJS GlobalInterceptor
  - `audit.service.ts` — write `ClinicAuditLog`
  - `audit.module.ts`
  - Decorators: `@AuditAction(name)`, `@AuditResource(name)`, `@SkipAudit()`
- [ ] Register interceptor sebagai global di `apps/api-gateway/src/main.ts` atau `app.module.ts`
- [ ] Behavior: tangkap POST/PUT/PATCH/DELETE → after success response → fire-and-forget write
- [ ] Test: Jest spec yang verify write audit log saat call POST endpoint

### E. WA Provider Interface
- [ ] Bikin module `apps/api-gateway/src/clinic-wa/`:
  - `wa.interface.ts` — `WAProvider`, `SendMessageParams`, `SendResult`, `DeliveryStatus`
  - `mock-wa.provider.ts` — `MockWAProvider` (returns success, no-op)
  - `wa.module.ts` — register `MockWAProvider` sebagai default
- [ ] Tidak implement provider riil — defer ke Slice 8

### F. Test Infrastructure
- [ ] api-gateway: bikin 1 sample Jest spec di `src/auth/auth.service.spec.ts` atau serupa
- [ ] api-gateway: setup `jest.config.js` kalau belum ada, atau pastikan existing `package.json` config jalan
- [ ] web-althea: 1 sample Vitest spec di `apps/web-althea/middleware.test.ts` (test extractRoleFromToken atau similar)
- [ ] web-althea: 1 sample Playwright e2e di `apps/web-althea/e2e/login.spec.ts` (login flow happy path, atau placeholder yang skip kalau api-gateway belum siap)

### G. Seed Dev DB (full bundle)

Seed script di `apps/api-gateway/prisma/seed-clinic.ts` (atau tambah ke existing seed file). Run via `npm run db:seed:clinic` atau auto-run setelah migrate.

#### G1. Users (6 role × 1 user) — password fixed `Test1234!`
- [ ] `admin@althea.local` — role: `clinic-admin`
- [ ] `psikolog@althea.local` — role: `clinic-psikolog`
- [ ] `owner@althea.local` — role: `clinic-owner`
- [ ] `resepsionis@althea.local` — role: `clinic-resepsionis`
- [ ] `marketing@althea.local` — role: `clinic-marketing`
- [ ] `intern@althea.local` — role: `clinic-intern`

#### G2. Psikolog (7 entries) — sumber `apps/psychology-design/althea-data.jsx`
- [ ] 7 user dengan role `clinic-psikolog` + `clinic_psikolog_profile` lengkap (title, specialty, color, license placeholder)
- [ ] Map ke nama-nama dari mockup (akan di-detail di /gsd-plan-phase)

#### G3. Services (16 entries) — sumber `althea-data.jsx`
- [ ] 5 konseling (Individu Dewasa, Anak, Remaja, Pasangan, Keluarga)
- [ ] 4 terapi (Dewasa 4, Pasangan 3, Anak Singkat 4, Anak Lengkap 10)
- [ ] 7 tes (Kesiapan Sekolah, Tumbuh Kembang, Lengkap Anak, MHCU, Bakat Minat, Lainnya, Konsultasi Hasil)
- [ ] Pricing placeholder (e.g., Rp 500k konseling, Rp 1.5jt tes) — bisa edit admin

#### G4. Rooms (11 entries) — per PRD
- [ ] Konseling (5): Sky, Sage, Forest, Sunset, Mint
- [ ] Anak (4): Terapi 1, Terapi 2, Terapi 3, Playground
- [ ] Tes (1): Tes
- [ ] Seminar (1): Seminar

#### G5. Clients (5 entries) — sample untuk testing BookingWizard
- [ ] 5 dummy clients (variasi gender, umur, service-type)
- [ ] Phone WA pakai nomor dev/sandbox (jangan kirim ke nomor real saat seed)

#### G6. WA Templates (18 entries) — per PRD 4 kategori
- [ ] **Pengingat** (5): H-1 booking, 30-min sebelum, follow-up post-session, follow-up form feedback, payment due
- [ ] **Jadwal** (5): confirmation, reschedule, cancel, walk-in confirmation, slot dipindah
- [ ] **Onboarding** (4): welcome new client, OTP login (kalau ada), info klinik, info psikolog
- [ ] **Bayar** (4): DP confirmation, lunas confirmation, payment receipt, refund notice
- [ ] Body pakai Mustache placeholder (e.g., `Hai {{nama_klien}}, sesi kamu hari {{tanggal}} jam {{waktu}}...`)

#### G7. Clinic Settings (1 row)
- [ ] Single-tenant config: clinic name "Althea Psychology", address, operating hours (Senin-Jumat 09-18, Sabtu 10-16, Minggu tutup), tax_enabled=true, dp_percentage=50, buffer_minutes=15

## Verification

### Manual smoke test
```bash
# Backend
cd apps/api-gateway
npm run db:migrate
npm run start:dev

# Frontend
cd apps/web-althea
npm install   # kalau belum
npm run dev

# Browser: http://localhost:3202/login
# - login dengan user 6 role yang di-seed
# - verify redirect ke /dashboard sesuai role
# - admin bisa akses semua route, role lain dibatasi
```

### Test commands
```bash
# api-gateway
cd apps/api-gateway
npm run test                  # Jest, harus ada >= 1 spec lulus
npm run test:e2e 2>/dev/null  # kalau ada e2e

# web-althea
cd apps/web-althea
npm run check                 # lint + typecheck + vitest
npm run test:e2e              # playwright (butuh api up)
```

### DB verification
```sql
-- connect ke PostgreSQL (port 3208)
\dt althea.*               -- list table di schema althea
SELECT * FROM althea."ClinicAuditLog" LIMIT 10;
```

## Files yang akan diubah/dibuat

### api-gateway
- `prisma/schema.prisma` — tambah models + enum
- `prisma/migrations/<timestamp>_clinic_foundation/` — NEW
- `src/auth/auth.service.ts` — JWT sign extend
- `src/auth/roles.guard.ts` — NEW
- `src/auth/roles.decorator.ts` — NEW
- `src/clinic-audit/{audit.interceptor,audit.service,audit.module}.ts` — NEW
- `src/clinic-audit/decorators/{audit-action,audit-resource,skip-audit}.decorator.ts` — NEW
- `src/clinic-wa/{wa.interface,mock-wa.provider,wa.module}.ts` — NEW
- `src/app.module.ts` — register ClinicAudit + ClinicWA module
- `src/main.ts` — register AuditInterceptor global
- `prisma/seed.ts` (kalau ada) atau script — seed 6 user per role

### web-althea
- `app/(patient)/` — DELETE
- `app/(owner)/dashboard/page.tsx` — NEW
- `app/(owner)/layout.tsx` — NEW
- `app/(resepsionis)/dashboard/page.tsx` — NEW
- `app/(resepsionis)/layout.tsx` — NEW
- `app/(marketing)/dashboard/page.tsx` — NEW
- `app/(marketing)/layout.tsx` — NEW
- `app/(intern)/dashboard/page.tsx` — NEW
- `app/(intern)/layout.tsx` — NEW
- `shared/auth/constants.ts` — UPDATE
- `shared/auth/jwt.ts` — UPDATE (extractRoleFromToken handle 6 role)
- `middleware.ts` — UPDATE
- `CLAUDE.md` — UPDATE section roles
- `e2e/login.spec.ts` — NEW
- `vitest.config.ts` — verify jalan
- `middleware.test.ts` atau `shared/auth/jwt.test.ts` — NEW

## Open questions (resolve before/during execute)

- [ ] Naming Prisma model: `ClinicUser` atau `User` (di schema `althea`)? — Pakai `ClinicUser` untuk avoid collision dengan model existing.
- [ ] Apakah api-gateway sudah punya User model existing? Kalau ya, harus disambiguate. Cek `prisma/schema.prisma` saat slice 0 plan phase.
- [ ] Audit log payload diff — pakai `JSON` field dengan before/after, atau separate table? — Default: JSON field di `AuditLog.payloadDiff`.
- [ ] Seed strategy untuk 6 user: hardcoded password (dev only) atau prompt setup? — Dev hardcoded OK, mark di env file.

## Definition of Done

Slice 0 closed kalau:
1. ✅ Semua acceptance criteria checked
2. ✅ Manual smoke test pass (login 6 role, audit log tertulis di DB)
3. ✅ `npm run check` di web-althea lulus
4. ✅ `npm run test` di api-gateway minimal 1 spec lulus
5. ✅ PR merged ke main branch (atau active dev branch)
6. ✅ `LEARNINGS.md` ditulis kalau ada decision/gotcha worth capturing
7. ✅ `VERIFICATION.md` updated dengan UAT pass status
