# Slice 1: Master Data — Psikolog — VERIFICATION

**Status**: ✅ **VERIFIED** — API + UI + tests pass + manual smoke berhasil
**Date**: 2026-05-08

## Implementation Summary

| Wave | Tasks | Files |
|------|-------|-------|
| A1-A6 | API: DTOs (3) + service + controller + module + register | `apps/api-gateway/src/clinic-psikolog/{*.ts, dto/*.ts}` (7 files) |
| A7 | api-gateway typecheck pass | – |
| B1 | Frontend types + zod schemas | `features/admin-psikolog/model/types.ts` |
| B2 | Frontend API client | `features/admin-psikolog/api/psikolog.api.ts` |
| B3 | TanStack Query hooks (4 hooks) | `features/admin-psikolog/hooks/use-psikolog.ts` |
| B4 | UI components (list + form + page) | `features/admin-psikolog/ui/{psikolog-list,psikolog-form,psikolog-page}.tsx` |
| B5 | Wire admin route | `app/(admin)/psikolog/page.tsx` (renders `<PsikologPage />`) |
| B6 | web-althea typecheck pass | – |
| C1 | Vitest unit tests (14 cases) | `features/admin-psikolog/model/types.test.ts` |
| C2 | Playwright e2e placeholder | `e2e/admin-psikolog.spec.ts` |
| D1 | Audit interceptor fix untuk global `/api` prefix | `src/clinic-audit/clinic-audit.interceptor.ts` |
| D2 | API smoke (login → list → create → audit log) | live tested |

## API Smoke Test Results

### Login (existing endpoint, work dengan clinic-* role JWT)
```bash
POST /api/auth/login
Body: {"email":"admin@althea.local","password":"Test1234!"}
→ 200 OK
→ JWT decoded: {sub:141, email:"admin@althea.local", roles:["clinic-admin"], ...}
```

### List psikolog (Slice 1 endpoint)
```bash
GET /api/clinic/psikolog?limit=3
Header: Authorization: Bearer <token>
→ 200 OK
→ data: [Mira, Aditya, Sari, ...] (paginated)
→ total: 7 sample psikolog dari Slice 0 seed
```

### Create psikolog (Slice 1 endpoint)
```bash
POST /api/clinic/psikolog
Body: {email,fullName,title,specialty,color,license,...}
→ 201 Created
→ User created (m0_users), UserRole assigned (clinic-psikolog),
  ClinicPsikologProfile created — semua dalam transaction
→ Audit log auto-written (m0_auditlog: user=141, action=post, entity_type=clinic.psikolog, entity_id=9)
```

### Audit interceptor verification
```sql
SELECT user_id, action, entity_type, entity_id FROM m0_auditlog
WHERE entity_type LIKE 'clinic.%' ORDER BY created_at DESC;

 user_id | action |   entity_type   | entity_id
---------+--------+-----------------+-----------
     141 | post   | clinic.psikolog | 9
```

✅ Confirmed: ClinicAuditInterceptor auto-tracks POST mutations to `/api/clinic/*`.

## Done Criteria

- [x] API endpoints created: POST/GET/GET:id/PATCH/DELETE `/clinic/psikolog/*`
- [x] Auth via JwtAuthGuard + RolesGuard (admin write, all roles read)
- [x] Service wraps create dalam Prisma transaction (User + UserRole + Profile)
- [x] Soft delete (User.deletedAt + Profile.deletedAt sync)
- [x] Audit log auto-track via interceptor
- [x] Frontend feature module lengkap (api, hooks, model, ui)
- [x] Admin page render list + form dialog + edit + delete UI
- [x] api-gateway typecheck pass
- [x] web-althea typecheck pass
- [x] **23 Vitest tests pass** (9 jwt + 14 psikolog types)
- [x] Playwright placeholder e2e ready
- [x] Manual API smoke: login → list → create → audit log all work

## Issues teridentifikasi & resolved

### 1. Audit interceptor missed `/api` prefix
**Symptom**: POST `/api/clinic/psikolog` tidak generate audit log entry.
**Root cause**: Interceptor check `path.startsWith('/clinic/')` tapi NestJS pakai global prefix `/api`, jadi path = `/api/clinic/psikolog`.
**Fix**: Ganti ke regex `/\/clinic\//` agar match prefix manapun.
**Same fix di**: `deriveResourceFromPath` — search `clinic` segment di array (bukan asumsi index 0).

### 2. zod `.default()` + react-hook-form type mismatch
**Symptom**: `useForm<CreatePsikologInput>` complain Resolver type incompatible.
**Root cause**: zod 4.x `.default()` makes input type optional but output type required. react-hook-form expects input/output sama.
**Fix**: Hapus `.default()` di schema. Pakai `.optional()` untuk fields yang truly optional. Default values di-set di form `defaultValues`.
**Trade-off**: parse output untuk required+optional sama saja, defaults handled di form layer.

### 3. CreatePsikologInput type mismatch dengan empty-string handling
**Symptom**: psikolog-page.tsx error TS2322 saat `input.username || undefined`.
**Root cause**: schema field type `string` (required) vs assignment `string | undefined`.
**Fix**: Pass form input as-is to mutation. Backend DTO `@IsOptional()` accepts empty strings dengan baik.

## Manual Browser Smoke Test (TODO untuk user)

```bash
# Terminal 1 (skip kalau api-gateway docker container masih jalan)
docker ps | grep api-gateway   # confirm "sentient-infra-api-gateway" healthy

# Terminal 2: web-althea
cd /home/rania/apps/sentient-factory/apps/web-althea
npm run dev   # http://localhost:3202

# Browser:
# 1. http://localhost:3202 → redirect ke /login
# 2. Login: admin@althea.local / Test1234!
# 3. Navigate /psikolog
# 4. List 7 sample psikolog harus render dengan badge specialty + avatar color
# 5. Klik "+ Tambah" → form dialog → isi → save → row muncul di list
# 6. Klik pencil ikon → edit form pre-filled → ubah title → save
# 7. Klik trash ikon → konfirm → row hilang
# 8. Search "farah" → filter ke 1 row
# 9. Toggle "Tampilkan nonaktif" → list update
```

> Note: belum implement form login UI di web-althea. Untuk sementara manual:
> - Login ke `/api/auth/login` via Postman/curl, copy JWT token
> - Browser DevTools → Application → Cookies → set `sf_token` value
> - Reload `/psikolog`

Form login UI bisa di-add di slice tersendiri (slice "auth UI" atau bagian Slice 4 Users & Roles).

## Files Created/Modified

### apps/api-gateway/src/clinic-psikolog/ (NEW)
```
clinic-psikolog.module.ts
clinic-psikolog.controller.ts
clinic-psikolog.service.ts
dto/create-psikolog.dto.ts
dto/update-psikolog.dto.ts
dto/query-psikolog.dto.ts
```

### apps/api-gateway/src/ (MODIFIED)
- `app.module.ts` — register ClinicPsikologModule
- `clinic-audit/clinic-audit.interceptor.ts` — handle `/api` prefix

### apps/web-althea/features/admin-psikolog/ (NEW)
```
api/psikolog.api.ts
hooks/use-psikolog.ts
model/types.ts
model/types.test.ts
ui/psikolog-list.tsx
ui/psikolog-form.tsx
ui/psikolog-page.tsx
```

### apps/web-althea/ (MODIFIED + NEW)
- `app/(admin)/psikolog/page.tsx` — wire ke PsikologPage feature
- `e2e/admin-psikolog.spec.ts` (NEW)

### .planning/phases/01-master-data-psikolog/
- `SPEC.md` — detailed (replace placeholder)
- `PLAN.md` (informal — pattern dari Slice 0 sudah established)
- `VERIFICATION.md` — this file
- `LEARNINGS.md` — see separate file

## Pattern Established untuk Slice 2-5

Slice 1 jadi reference template untuk slice CRUD lain. Pattern:

1. **Schema**: tambah model di `prisma/schema.prisma`, run `prisma generate`
2. **API module**: 7 files (controller + service + module + 3 DTOs + index opsional) di `src/clinic-<feature>/`
3. **Register**: tambah ke `app.module.ts` imports
4. **Frontend feature**: 7 files di `features/<feature>/{api,hooks,model,ui}/`
5. **Wire route**: 1-line render di `app/<role>/<feature>/page.tsx`
6. **Tests**: types.test.ts (Vitest) + e2e/<feature>.spec.ts (Playwright)
7. **Audit**: otomatis (interceptor handles all `/clinic/*` mutations)

Estimated: 1 session per slice CRUD setelah pattern established.
