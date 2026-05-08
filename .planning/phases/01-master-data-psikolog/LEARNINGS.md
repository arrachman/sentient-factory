# Slice 1: Master Data Psikolog — LEARNINGS

**Date**: 2026-05-08

## Patterns Validated (jadi template untuk Slice 2-5)

### NestJS module structure (CRUD reference)
```
src/clinic-<feature>/
├── <feature>.module.ts        # @Module imports/controllers/providers
├── <feature>.controller.ts    # @Controller('clinic/<feature>') + JwtAuthGuard + RolesGuard
├── <feature>.service.ts       # Prisma calls + transaction wrapping
└── dto/
    ├── create-<feature>.dto.ts   # class-validator + Swagger decorators
    ├── update-<feature>.dto.ts   # PartialType(OmitType(Create...))
    └── query-<feature>.dto.ts    # pagination + search + filter params
```

### Web feature structure
```
features/<feature>/
├── api/<feature>.api.ts       # apiClient.get/post/patch/delete wrappers
├── hooks/use-<feature>.ts     # 4 hooks: useList, useDetail, useCreate, useUpdate, useDelete
├── model/
│   ├── types.ts               # zod schemas + TS types + constants
│   └── types.test.ts          # Vitest schema validation tests
└── ui/
    ├── <feature>-list.tsx     # Table component, props: data + handlers
    ├── <feature>-form.tsx     # Dialog with react-hook-form + zodResolver
    └── <feature>-page.tsx     # Composition with useQuery + dialog state
```

### Service layer transaction pattern
Untuk entitas dengan FK ke User (psikolog, future: client, etc.):
```typescript
const created = await this.prisma.$transaction(async (tx) => {
  const user = await tx.user.create({...});
  await tx.userRole.create({ userId: user.id, roleId, ... });
  const profile = await tx.clinic<X>.create({ userId: user.id, ... });
  return { user, profile };
});
```

Soft delete pattern:
```typescript
await this.prisma.$transaction([
  this.prisma.clinicProfile.update({ where: { id }, data: { deletedAt, isActive: false } }),
  this.prisma.user.update({ where: { id: userId }, data: { deletedAt, isActive: false } }),
]);
```

## Decisions Captured

### 1. Audit interceptor regex match (bukan startsWith)
**Initial**: `path.startsWith('/clinic/')`
**Issue**: NestJS pakai `app.setGlobalPrefix('api')`, jadi path actual `/api/clinic/...`.
**Fix**: pakai regex `/\/clinic\//`.
**Generalization**: untuk middleware/interceptor yang depend on path, **pertimbangkan global prefix**.

### 2. zod schema design: hindari `.default()` saat dipakai dengan react-hook-form
**Lesson**: zod `.default()` membuat input optional + output required → resolver type mismatch.
**Pattern**:
- Gunakan `.optional()` untuk truly optional fields
- Field yang harus selalu ada: tanpa optional/default, just `z.string()`
- Default values di-set di form `useForm({ defaultValues: {...} })`

### 3. JWT roles claim sudah array
Existing `auth.service.ts` emit `roles: string[]`. Tinggal:
- Frontend `pickClinicRole()` ambil first `clinic-*` role
- Backend `RolesGuard` pakai `requiredRoles.some()` — match any role
- `@Roles('clinic-admin', 'clinic-psikolog')` = OR semantics (any match passes)

### 4. Backend extension table pattern (1-to-1 dengan User)
`ClinicPsikologProfile` extend User via FK. Pattern reusable untuk role lain yang butuh extra fields:
- `ClinicResepsionisProfile`? — kemungkinan tidak butuh (just User + role)
- `ClinicOwnerProfile`? — kemungkinan tidak butuh
- Future: `ClinicClient` — different (bukan extend User, standalone entity karena pasien tidak login)

## Gotchas

### 1. Container watch reload bisa lambat
NestJS `--watch` di Docker dengan `CHOKIDAR_USEPOLLING` kadang miss file changes. Workaround: `docker restart sentient-infra-api-gateway` untuk force reload.

### 2. UI tanpa ShadCN — pakai legacy CSS classes
Slice 0 tidak install ShadCN components karena focus pada infra. Slice 1 pakai class legacy dari `styles/althea-components.css` (`.btn`, `.card-althea`, `.badge`, `.input-althea`). Acceptable untuk MVP, refactor ke ShadCN bisa di Slice 14 polish.

### 3. Form dialog custom (bukan Radix)
Tidak pakai Radix Dialog. Pakai native modal `<div role="dialog">` + click-outside close. Cukup untuk MVP. Future: ganti dengan `@radix-ui/react-dialog` untuk a11y proper (focus trap, ESC handler, dll).

### 4. Username derivation
User auto-create username dari fullName slug. Edge case: kalau 2 user punya nama mirip, conflict. Solution future: append timestamp suffix kalau collision detected.

## What worked well

- **Reference template approach**: pattern `master-data-items` clear → 30 menit bikin clinic-psikolog API.
- **Type-safe end-to-end**: zod schema di frontend mirror class-validator di backend → catch errors compile-time.
- **TanStack Query convenience**: `useMutation` + `invalidateQueries` cukup untuk most CRUD UX.
- **Audit interceptor reuse**: tidak perlu manual write audit log di setiap controller — auto.

## What could be improved

- **Form validation feedback**: zod errors render plain `<p className="text-danger">`, tidak rich. Future: pakai ShadCN Form + FormField untuk consistent error UI.
- **Pagination UI**: page size 50 fixed. Future: tambah page selector + numbered nav.
- **Search debounce**: search input fire query tiap keystroke. Future: debounce 300ms untuk reduce calls.
- **Optimistic update**: invalidate after success = brief refetch. Future: optimistic update untuk perceived speed.
- **Test e2e real**: Playwright placeholder skip kalau no token. Real e2e butuh login flow + cookie injection.

## Estimated next slice

Slice 2 (Master Data Layanan): **~30-45 menit** dengan template ini.
- DB: tambah `ClinicService` model
- API: copy clinic-psikolog → adjust field
- UI: copy admin-psikolog → adjust display
- Tests: zod schema + e2e placeholder

Slice 3 (Rooms) dan Slice 5 (Clients) similar pattern. Slice 4 (Users & Roles) sedikit beda — manage existing User+Role table.

## Pattern reuse summary

Untuk slice CRUD selanjutnya, copy:
1. `apps/api-gateway/src/clinic-psikolog/` → rename ke `clinic-<feature>` (sed find-replace)
2. `apps/web-althea/features/admin-psikolog/` → rename ke `admin-<feature>`
3. Adjust field-spesifik di DTO + zod + UI table columns
4. Run typecheck + tests

Estimated effort per CRUD: 30-60 menit by following template.
