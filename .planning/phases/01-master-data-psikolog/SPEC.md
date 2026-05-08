# Slice 1: Master Data — Psikolog — SPEC

**Status**: 🟡 In progress
**Estimated sessions**: 1
**Depends on**: Slice 0 (Foundation)
**Blocks**: Slice 6 (Booking core)

## Goal

`clinic-admin` bisa CRUD data psikolog (User + ClinicPsikologProfile) dari `(admin)/psikolog` page. Establish reference template pattern (NestJS module + web feature) untuk slice CRUD lain.

## Non-goals

- ❌ Psikolog schedule UI calendar grid (Slice 7)
- ❌ Psikolog mark complete + notes (Slice 10)
- ❌ Public-facing psikolog browse (out of scope MVP)

## Acceptance Criteria

### A. API Endpoints (api-gateway)
- [ ] `POST   /clinic/psikolog` — create user dengan role clinic-psikolog + create ClinicPsikologProfile
- [ ] `GET    /clinic/psikolog` — paginated list dengan filter (search, isActive)
- [ ] `GET    /clinic/psikolog/:id` — detail single psikolog
- [ ] `PATCH  /clinic/psikolog/:id` — partial update profile fields + User.isActive
- [ ] `DELETE /clinic/psikolog/:id` — soft delete (User.deletedAt + ClinicPsikologProfile.deletedAt)

Auth: protected via `JwtAuthGuard`. Role guard `@Roles('clinic-admin')` (admin only untuk write; admin + psikolog untuk read).

### B. UI Pages (web-althea)
- [ ] `app/(admin)/psikolog/page.tsx` — list table + tombol Tambah + filter search + isActive
- [ ] Form dialog untuk Create (semua field) + Edit (subset field)
- [ ] Konfirmasi delete dialog
- [ ] Loading state + error state via toast

### C. Feature module (web-althea)
- [ ] `features/admin-psikolog/api/psikolog.api.ts` — fetch wrapper
- [ ] `features/admin-psikolog/hooks/use-psikolog.ts` — TanStack Query hooks
- [ ] `features/admin-psikolog/model/types.ts` — TS types + zod schemas
- [ ] `features/admin-psikolog/ui/psikolog-list.tsx` — table component
- [ ] `features/admin-psikolog/ui/psikolog-form.tsx` — form dialog
- [ ] `features/admin-psikolog/ui/psikolog-page.tsx` — composition

### D. Tests
- [ ] Vitest unit untuk zod schema + util domain (1 file)
- [ ] Playwright e2e: admin login → buka `/psikolog` → list rendered (1 spec)

## Domain Reference

- Mockup: `apps/psychology-design/AdminPsikolog.jsx`
- Sample data: `apps/psychology-design/althea-data.jsx` — 7 psikolog dengan field
- DB: `clinic_psikolog_profile` (sudah dibuat di Slice 0) + `m0_users` + `m0_user_role`

## Technical Notes

### Create flow
1. Generate username (e.g., from email or full name slug)
2. Generate temporary password (admin set explicit, atau auto + send via WA/email — Slice 1 pakai admin-input)
3. Hash password (pbkdf2 method same as seed)
4. Create User row (m0_users)
5. Find clinic-psikolog role.id (m0_role)
6. Create UserRole junction (m0_user_role)
7. Create ClinicPsikologProfile (clinic_psikolog_profile)
8. Wrap di Prisma transaction (semua atau tidak sama sekali)

### Update flow
- Profile fields (title, specialty, color, license, defaultSlots, bio): update di clinic_psikolog_profile
- User fields (fullName, isActive): update di m0_users
- Email/username: tidak boleh ganti (immutable identifier)
- Password: separate endpoint atau out of scope di Slice 1

### Delete flow
- Soft delete: User.deletedAt + ClinicPsikologProfile.deletedAt
- Cascade ke UserRole (junction tetap, tapi tidak active karena User soft-deleted)

### Audit
Otomatis tertrack via ClinicAuditInterceptor (Slice 0):
- `entity_type=clinic.psikolog`
- `action=post|patch|delete` (atau override via `@AuditAction`)

## Verification

```bash
# Backend
cd apps/api-gateway && npm run typecheck
npm run start:dev   # lihat ClinicPsikologModule loaded

# Manual API test
curl -X POST http://localhost:3203/clinic/psikolog \
  -H "Content-Type: application/json" \
  -H "Cookie: sf_token=..." \
  -d '{"email":"test@althea.local","fullName":"Test","title":"M.Psi","specialty":["klinis_dewasa"]}'

# DB verify
psql -c "SELECT u.email, p.title, p.color FROM m0_users u JOIN clinic_psikolog_profile p ON p.user_id = u.id;"

# Frontend
cd apps/web-althea && npm run dev
# Browser: login admin@althea.local → http://localhost:3202/psikolog
# - List 7 sample psikolog dari Slice 0 seed harus render
# - Klik Tambah → form muncul → submit → muncul di list
# - Klik Edit row → field terisi → ubah title → save → update di list
# - Klik Delete → konfirmasi → row hilang
```

## Files Touched

### api-gateway (NEW)
- `src/clinic-psikolog/{clinic-psikolog.module,clinic-psikolog.controller,clinic-psikolog.service}.ts`
- `src/clinic-psikolog/dto/{create-psikolog,update-psikolog,query-psikolog}.dto.ts`

### api-gateway (UPDATE)
- `src/app.module.ts` — register ClinicPsikologModule

### web-althea (NEW)
- `features/admin-psikolog/api/psikolog.api.ts`
- `features/admin-psikolog/hooks/use-psikolog.ts`
- `features/admin-psikolog/model/types.ts`
- `features/admin-psikolog/ui/{psikolog-list,psikolog-form,psikolog-page}.tsx`
- `features/admin-psikolog/model/types.test.ts` (Vitest)
- `e2e/admin-psikolog.spec.ts` (Playwright)

### web-althea (UPDATE)
- `app/(admin)/psikolog/page.tsx` — implementasi (saat ini placeholder)

## Definition of Done

1. ✅ All API endpoints work + Jest spec atau manual curl pass
2. ✅ UI page render + CRUD flow work via browser
3. ✅ TypeScript pass (api-gateway + web-althea)
4. ✅ Vitest 1+ test pass
5. ✅ Audit log entry tertulis untuk POST/PATCH/DELETE
6. ✅ VERIFICATION.md updated
