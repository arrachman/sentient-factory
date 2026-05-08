# ADR 003: 6-Actor Role Model + Extend Existing User/Role/Permission

**Status**: Accepted
**Date**: 2026-05-08
**Deciders**: User + Claude Code (after exploration of PRD + existing schema)

## Context

Initial scaffold web-althea punya 3 role: patient, psychologist, admin — assumed patient self-booking. Eksplorasi `apps/psychology-design/` (mockup + PRD + JAWABAN-PERTANYAAN-KLIEN.md) menunjukkan model aktual:

- Booking adalah **admin-driven** (admin yang input client + buat booking)
- Patient TIDAK login ke app, hanya recipient WA notification
- 6 internal staff role yang login ke app

Eksplorasi `apps/api-gateway/prisma/schema.prisma` reveal **RBAC mature already exists**:
- `User` (m0_users) — full user data
- `Role` (m0_role) — role definition (name, isSystem)
- `UserRole` (m0_user_role) — many-to-many junction
- `Permission` (m0_permission) — granular permission
- `RolePermission` (m0_role_permission) — role-to-permission mapping
- `Menu` (m0_menu), `RoleMenu` — menu-based access control

## Decision

### A. Drop patient self-service
Adopt **6-actor model** sesuai PRD:

| Role name | Responsibility | Default landing |
|-----------|----------------|-----------------|
| `clinic-admin` | Full scheduling, client CRUD, room allocation, WA template, settings | `/dashboard` |
| `clinic-psikolog` | Own schedule, mark complete, clinical notes | `/dashboard` |
| `clinic-owner` | KPI dashboard (sessions/day, utilization %, revenue) | `/dashboard` |
| `clinic-resepsionis` | Real-time check-in status (berlangsung/menunggu/antar) | `/dashboard` |
| `clinic-marketing` | Read-only service catalog & capacity | `/dashboard` |
| `clinic-intern` | Minimal access (placeholder) | `/dashboard` |

Patient hanya entitas data + recipient WA, **tidak ada login flow**.

### B. Extend existing User+Role+Permission (NO separate User table)

**Rationale**: existing RBAC sudah mature. Tidak perlu duplicate auth logic.

Implementation:
1. **Tambah 6 row di `Role` table** (m0_role) dengan prefix `clinic-`
2. **Tambah row di `Permission`** untuk clinic-specific permissions (`clinic.booking.create`, `clinic.psikolog.read`, dll)
3. **Map permissions ke roles** via `RolePermission`
4. **Bikin extension table `clinic_psikolog_profile`** untuk psikolog-specific fields:
   ```prisma
   model ClinicPsikologProfile {
     id           Int      @id @default(autoincrement())
     userId       Int      @unique @map("user_id")
     title        String?  // e.g., "M.Psi"
     specialty    String[] // ["klinis_dewasa", "anak_remaja"]
     color        String?  // hex code untuk avatar
     license      String?  // SIPP nomor
     defaultSlots Int      @default(4) @map("default_slots")
     bio          String?  @db.Text
     createdAt    DateTime @default(now()) @map("created_at")
     updatedAt    DateTime @updatedAt @map("updated_at")
     user         User     @relation(fields: [userId], references: [id])
     @@map("clinic_psikolog_profile")
   }
   ```

### C. Web-althea actor restructure
- Delete `apps/web-althea/app/(patient)/`
- Tambah route groups: `(owner)/`, `(resepsionis)/`, `(marketing)/`, `(intern)/`
- Update `shared/auth/constants.ts` dan `middleware.ts` untuk handle 6 actor

## Consequences

### Positive
- Reuse RBAC mature → tidak duplicate auth logic
- SSO automatic dengan web-dashboard via cookie `sf_token` shared
- Match PRD aktual (admin-driven booking, patient passive)
- Permission granular (per resource per action)

### Negative
- Harus restructure scaffold yang sudah dibuat (Slice 0 task)
- Coupling dengan ERP user table → kalau later perlu multi-tenant per-app, harus refactor

## Reference

- `apps/psychology-design/JAWABAN-PERTANYAAN-KLIEN-2026-05-07.md`
- `apps/psychology-design/AdminShell.jsx` — role-aware nav
- `apps/api-gateway/prisma/schema.prisma` — existing User/Role/Permission models
