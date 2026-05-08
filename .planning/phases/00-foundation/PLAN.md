# Slice 0: Foundation — PLAN

**Status**: 🟡 In progress
**Estimated effort**: 1-2 sessions
**Reference SPEC**: `./SPEC.md`

## Penemuan dari eksplorasi existing

Banyak infra Slice 0 ternyata **sudah ada** di api-gateway:
- ✅ `RolesGuard` di `src/auth/guards/roles.guard.ts` — multi-role support sudah benar
- ✅ `@Roles(...)` decorator di `src/auth/decorators/roles.decorator.ts`
- ✅ `JwtAuthGuard`, `LocalAuthGuard`, `PermissionsGuard` semua sudah ada
- ✅ `AuditLog` model generic di `prisma/schema.prisma` (`entityType` field — bisa filter `clinic.*`)
- ✅ `audit-logs/` module dengan controller + service
- ✅ JWT payload sudah include `roles: string[]` (auth.service.ts line 45)
- ✅ Seed pattern di `prisma/seed.ts` (pbkdf2 password)

Yang **belum ada**, baru di-tambah Slice 0:
- ❌ `ClinicSettings`, `ClinicPsikologProfile` Prisma models
- ❌ `clinic-*` 6 role rows di `m0_role`
- ❌ Generic audit interceptor (NestJS) — opsional, bisa pakai existing audit-logs.service manual call
- ❌ `clinic-wa/` module dengan WAProvider interface + MockProvider
- ❌ Web-althea actor restructure (3 → 6 role)
- ❌ Test infrastructure samples

⚠️ **Issue**: `auth.service.ts` line 27 `validateUser` reject login kalau user tidak punya warehouse (`hasWarehouse(user.id)`). Clinic user mungkin tidak punya warehouse. Solusi pilihan:
- A. Skip check kalau user punya role `clinic-*` (modify auth.service)
- B. Bikin "Althea HQ" warehouse, assign clinic users ke sana
- C. Bikin warehouse opsional per role config

**Pilih (A)** — minimal invasive, eksplisit per role policy.

## Wave-based Task Breakdown

Tasks bisa di-paralelisasi per wave. Sequential antar wave.

### Wave A — Prisma Schema (sequential, foundational)

| ID | Task | File | Verification |
|----|------|------|---|
| A1 | Tambah model `ClinicSettings` | `apps/api-gateway/prisma/schema.prisma` | Prisma format valid |
| A2 | Tambah model `ClinicPsikologProfile` (FK ke User) | `apps/api-gateway/prisma/schema.prisma` | Prisma format valid |
| A3 | Generate migration | shell: `cd apps/api-gateway && npm run db:generate && npm run db:migrate -- --name clinic_foundation` | Migration file generated, DB tables created |

### Wave B — Auth & RBAC (depends on A)

| ID | Task | File | Verification |
|----|------|------|---|
| B1 | Skip warehouse check untuk clinic-* roles di `validateUser` | `src/auth/auth.service.ts` | Clinic user tanpa warehouse bisa login |
| B2 | Confirm RolesGuard handle 6 clinic-* roles (test only, no code change) | (existing files) | Unit test pass |

### Wave C — Audit Interceptor + WA Module (paralel dengan B)

| ID | Task | File | Verification |
|----|------|------|---|
| C1 | Bikin `ClinicAuditInterceptor` global yang catat ke existing AuditLog | `src/clinic-audit/clinic-audit.interceptor.ts` (NEW) | POST/PATCH/DELETE auto-tracked di AuditLog |
| C2 | Decorators `@AuditAction(name)`, `@AuditResource(type)`, `@SkipAudit()` | `src/clinic-audit/decorators/*.ts` (NEW) | Override default behavior bekerja |
| C3 | `ClinicAuditModule` module file + register di `app.module.ts` | `src/clinic-audit/clinic-audit.module.ts` (NEW) | Module loaded |
| C4 | `WAProvider` interface | `src/clinic-wa/wa.interface.ts` (NEW) | TypeScript valid |
| C5 | `MockWAProvider` no-op implementation | `src/clinic-wa/providers/mock.provider.ts` (NEW) | Returns success placeholder |
| C6 | `ClinicWaModule` register MockProvider sebagai default | `src/clinic-wa/clinic-wa.module.ts` (NEW) | Module loaded |
| C7 | Register di `app.module.ts` | `src/app.module.ts` | App start tanpa error |

### Wave D — Web-Althea Actor Restructure (paralel dengan B & C)

| ID | Task | File | Verification |
|----|------|------|---|
| D1 | Update `Role` type ke 6 nilai dengan prefix `clinic-` | `apps/web-althea/shared/auth/constants.ts` | Type compile |
| D2 | Update `ROLE_DEFAULT_ROUTE` dan `ROLE_ROUTE_PREFIXES` | `apps/web-althea/shared/auth/constants.ts` | All 6 keys present |
| D3 | Update `extractRoleFromToken` untuk handle 6 role | `apps/web-althea/shared/auth/jwt.ts` | Test extracts correctly |
| D4 | Update middleware untuk 6 actor + admin bypass | `apps/web-althea/middleware.ts` | Routes work per role |
| D5 | DELETE `(patient)/` route group | `apps/web-althea/app/(patient)/` | Folder gone |
| D6 | CREATE `(owner)/dashboard/page.tsx` + layout | NEW | Page renders |
| D7 | CREATE `(resepsionis)/dashboard/page.tsx` + layout | NEW | Page renders |
| D8 | CREATE `(marketing)/dashboard/page.tsx` + layout | NEW | Page renders |
| D9 | CREATE `(intern)/dashboard/page.tsx` + layout | NEW | Page renders |
| D10 | Update `apps/web-althea/CLAUDE.md` section "Role-based routing" | UPDATE | Reflect 6 actor |

### Wave E — Seed Dev DB (depends on A done)

| ID | Task | File | Verification |
|----|------|------|---|
| E1 | Bikin file seed terpisah `prisma/seed-clinic.ts` | `apps/api-gateway/prisma/seed-clinic.ts` (NEW) | Script executable |
| E2 | Tambah script `db:seed:clinic` di package.json | `apps/api-gateway/package.json` | npm command works |
| E3 | Seed 6 clinic-* roles (insert ke m0_role) | seed-clinic.ts | DB rows inserted |
| E4 | Seed clinic-* permissions + RolePermission mapping | seed-clinic.ts | Permission rows present |
| E5 | Seed 6 dev users (1 per role) password Test1234! | seed-clinic.ts | 6 users dapat login |
| E6 | Seed 7 psikolog dengan ClinicPsikologProfile | seed-clinic.ts | 7 rows di clinic_psikolog_profile |
| E7 | (Defer to Slice 1-3) Seed services + rooms + clients + WA templates | (Slice 1-3) | Defer until tables exist |
| E8 | Seed ClinicSettings 1 row (default config) | seed-clinic.ts | 1 row dengan default values |

> **Note**: E7 di-defer karena `ClinicService`, `ClinicRoom`, `ClinicClient`, `ClinicWaTemplate` tables baru ada di Slice 1-3, 5, 8. Slice 0 cuma seed user/role/permission/psikolog-profile/settings.

### Wave F — Test Infrastructure (paralel dengan E)

| ID | Task | File | Verification |
|----|------|------|---|
| F1 | Sample Jest spec di api-gateway | `src/auth/auth.service.spec.ts` (NEW) | `npm run test` di api-gateway pass |
| F2 | Verify Vitest config web-althea jalan | `apps/web-althea/vitest.config.ts` (existing) | `npm run test` lulus tanpa spec |
| F3 | Sample Vitest spec untuk middleware role extraction | `apps/web-althea/shared/auth/jwt.test.ts` (NEW) | Test pass |
| F4 | Sample Playwright e2e login placeholder | `apps/web-althea/e2e/login.spec.ts` (NEW) | Test compiled (skip kalau api down) |

## Dependency Graph

```
A (DB schema)
├── B (Auth fix)
│   └── E (Seed)
│       └── F (test seed-related)
└── C (Audit + WA)

D (Web-althea, independent)
F (Test infra, mostly independent — F1 needs B)
```

Eksekusi order:
1. **A** dulu (foundation)
2. **B + C + D paralel** (B & C di api-gateway, D di web-althea)
3. **E** setelah A done
4. **F** setelah B done

## Atomic Commit Plan

Per task = 1 commit. Total ~30 commits untuk Slice 0.

Conventional commit format:
- `feat(api): add ClinicSettings + ClinicPsikologProfile models`
- `feat(api): generate clinic_foundation migration`
- `fix(api): skip warehouse check for clinic-* roles`
- `feat(api): add ClinicAuditInterceptor global`
- `feat(api): add ClinicWa module with MockProvider`
- `feat(web-althea): restructure to 6 actor roles`
- `feat(web-althea): create owner/resepsionis/marketing/intern route groups`
- `chore(api): seed 6 clinic-* roles + permissions`
- `chore(api): seed 6 dev users for clinic`
- `chore(api): seed 7 psikolog with profile`
- `test(api): add auth.service.spec`
- `test(web-althea): add jwt.test`
- `test(web-althea): add login e2e placeholder`
- `docs(planning): mark Slice 0 verified`

## Risks & Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Warehouse check breaks ERP login | High | Test ERP login setelah B1 — pastikan tidak break existing |
| Migration conflict dengan ERP migrations existing | Medium | Run `prisma migrate dev --name clinic_foundation` di clean DB; review SQL |
| Audit interceptor performance impact | Medium | Async fire-and-forget write; benchmark di Slice 0 verify |
| Web-althea CLAUDE.md drift | Low | Update bareng D10 |
| Test infra lambat di CI | Low | Defer optimize ke Slice 14 |

## Verification (Slice 0 done criteria)

```bash
# Backend
cd apps/api-gateway
npm run db:migrate              # migration applied
npm run db:seed                 # ERP seed (existing)
npm run db:seed:clinic          # NEW clinic seed
npm run typecheck               # passes
npm run test                    # at least F1 spec passes
npm run start:dev               # starts without error

# Frontend
cd apps/web-althea
npm install                     # if first time
npm run check                   # lint + typecheck + vitest pass
npm run dev                     # starts at port 3202

# Manual smoke
# Browser http://localhost:3202/login
# Login as admin@althea.local / Test1234!
# Should redirect to /dashboard, see "Admin" page
# Try login as psikolog@althea.local / Test1234!
# Should redirect to /dashboard, see "Psikolog" page
# Verify can't access (admin) routes from psikolog session

# DB verification
psql -h localhost -p 3208 -U <user> sentient_factory
# \dt clinic_*
# SELECT * FROM clinic_settings LIMIT 1;
# SELECT * FROM m0_role WHERE name LIKE 'clinic-%';
```

## After Slice 0

Lanjut ke Slice 1 (Master Data Psikolog) — see `.planning/phases/01-master-data-psikolog/SPEC.md`. Pattern dari Slice 0 jadi reference.

## Open Questions (resolve mid-execute)

- [ ] Naming: `entity_type` di AuditLog pakai `clinic.psikolog_profile` atau `clinic-psikolog-profile`? — **Pakai `clinic.psikolog_profile`** (dot-namespaced)
- [ ] Audit interceptor: log POST/PATCH/DELETE all routes, atau hanya `/clinic/*`? — **Hanya `/clinic/*`** (filter di interceptor)
- [ ] Sample Playwright e2e: skip kalau api-gateway down, atau fail? — **Skip dengan `test.skip(condition)`**
