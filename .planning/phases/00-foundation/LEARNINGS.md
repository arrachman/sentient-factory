# Slice 0: Foundation — LEARNINGS

**Date**: 2026-05-08
**Captured by**: Claude Code session

## Decisions captured (di luar ADR)

### 1. Reuse existing `AuditLog` model, not create new `ClinicAuditLog`
**Insight**: PRD ADR 005 originally suggest model baru `ClinicAuditLog`. Eksplorasi menemukan `AuditLog` existing sudah generic — `entityType` field bisa filter `clinic.*`.

**Decision**: Pakai existing model. Audit log untuk ERP & Clinic share table — query filter by `entity_type LIKE 'clinic.%'` untuk admin audit-log viewer (Slice 12).

**Why this matters for next slices**: tidak perlu tambah model audit baru di slice manapun. Tinggal pakai @AuditAction / @AuditResource decorator kalau perlu override.

### 2. JWT `roles` claim sudah `string[]`, tidak perlu modifikasi auth.service
**Insight**: `auth.service.ts` line 45 sudah emit `roles: roles` (array). Existing infra cocok untuk multi-role.

**Decision**: Tidak modifikasi `login` payload structure. Tinggal seed `clinic-*` role rows di `m0_role` — semua otomatis flow.

**Why matters**: SSO antar app (web-dashboard ↔ web-althea) tidak butuh konfigurasi tambahan — cookie `sf_token` shared sudah handle multi-role.

### 3. RolesGuard existing handle `requiredRoles.some()` multi-role correctly
**Insight**: `requiredRoles.some((role) => user.roles?.includes(role))` di `roles.guard.ts` sudah behave benar untuk OR matching (user with any matching role passes).

**Decision**: Tidak modifikasi RolesGuard. Pakai apa adanya.

**Implementation pattern untuk slice berikutnya**:
```typescript
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('clinic-admin', 'clinic-resepsionis')  // OR semantic
@Post('/clinic/booking')
async createBooking(...) { ... }
```

### 4. Warehouse check di validateUser perlu role-aware bypass
**Insight**: ERP users WAJIB punya warehouse (line 27 `validateUser`). Clinic users tidak — bukan ERP. Tanpa fix, clinic user reject login.

**Decision**: Tambah role check sebelum warehouse gate. Skip kalau user punya role `clinic-*`.

**Trade-off**: 1 extra DB query (`getActiveRoleNamesByUserId`) saat login. Acceptable — login bukan hot path.

**Alternative considered**: bikin "Althea HQ" warehouse + assign clinic users. Rejected — semantic mismatch (clinic bukan warehouse).

### 5. Rename route group `(psychologist)/` → `(psikolog)/`
**Insight**: Inconsistency — role name `clinic-psikolog` (Indonesian) tapi route group `(psychologist)/` (English).

**Decision**: Rename ke `(psikolog)/` untuk consistency. Route group tidak affect URL, jadi tidak ada impact ke user.

## Patterns established (template untuk slice berikutnya)

### Module structure (NestJS)
```
src/clinic-<feature>/
├── <feature>.controller.ts        # routes
├── <feature>.service.ts           # business logic
├── <feature>.module.ts            # DI registration
├── dto/
│   ├── create-<entity>.dto.ts
│   ├── update-<entity>.dto.ts
│   └── query-<entity>.dto.ts
└── (optional providers/, helpers/)
```

Reference template: `apps/api-gateway/src/master-data-items/` (CRUD lengkap).

### Adding to schema.prisma
1. Tambah model di akhir file dengan banner comment + ADR reference
2. Add reverse relation di `User` kalau ada FK
3. Run `npx prisma format` (auto-rapikan indentation)
4. Run `npx prisma validate` (catch syntax error)
5. Run `npm run db:migrate -- --name <slice>_<feature>` (generate migration file)

### Audit decorators pattern
```typescript
@Post()
async create(...) { ... }
// Otomatis tertrack: action='post', entity_type='clinic.<resource>'

@AuditAction('reschedule')
@AuditResource('clinic.booking')
@Patch(':id/reschedule')
async reschedule(...) { ... }
// Custom: action='reschedule', entity_type='clinic.booking'

@SkipAudit()
@Get('/health')
async health(...) { ... }
// Tidak ditrack
```

### Web-althea feature pattern
```
features/<feature>/
├── api/
│   └── <feature>.api.ts       # fetch via lib/api-client
├── hooks/
│   └── use-<feature>.ts       # TanStack Query hook
├── model/
│   └── types.ts               # zod schema + TS types
└── ui/
    ├── <feature>-page.tsx     # main page composition
    ├── <feature>-list.tsx     # table component
    └── <feature>-form.tsx     # form dialog
```

Reference: `apps/web-dashboard/features/master-item/`.

## Gotchas yang ditemukan

### 1. Worktree vs main repo path
Harness setup worktree di `/.claude/worktrees/nice-saha-0fda55` (branch `claude/nice-saha-0fda55`), tapi user bekerja di main repo `/home/rania/apps/sentient-factory/` (branch `work/superpowers-trial`).

**Implication**: kalau write file via absolute path ke main repo, file masuk ke `work/superpowers-trial`, bukan worktree branch.

**Resolution**: Continue work di main repo path untuk consistency dengan user state. Worktree branch unused tapi tidak harm.

### 2. Default branch commit hook block
`git commit` di `work/superpowers-trial` (default branch) di-block oleh harness hook. User perlu authorize manual.

**Resolution**: Stage files, kasih commit message ke user untuk eksekusi manual.

### 3. Model write tool intermittent unavailability
Saat session ada momen tool `Write` returned error "claude-opus-4-7 is temporarily unavailable". Solusi: retry. Kalau persistent: pakai `Edit` tool sebagai workaround untuk file yang sudah exist.

### 4. Existing seed.ts sudah pakai pbkdf2 — copy method
Password hash di api-gateway pakai pbkdf2 dengan parameter spesifik (iterations 210000, sha512, base64 output). Fungsi `hashPassword` saya copy persis ke `seed-clinic.ts` agar consistent.

## What worked well

- ADR-first approach: ADR 001-008 memberi context kuat sebelum implementasi
- Eksplorasi existing code (RolesGuard, AuditLog, seed pattern) **sebelum** bikin baru — banyak yang sudah ada
- Wave-based PLAN: jelas mana yang sequential vs parallel
- TodoWrite real-time tracking — gampang resume saat context restart

## What to do differently next slice

- Run `npm install` di web-althea **sebelum** start coding biar typecheck bisa run inline (catch error lebih cepat)
- Test DB connection di awal (`docker compose ps postgres`) sebelum write Prisma migrations
- Bikin sample Jest spec di slice 0 also (was deferred), establish pattern untuk slice 1+
- Consider commit per-wave untuk granularity (Slice 0 jadi 1 big commit; Slice 1+ pecah per wave)

## Context for next slice (Slice 1)

- Foundation infrastructure ready dipakai
- Reference template proven: `master-data-items` (api) + `master-item` (web)
- Audit log auto-track for `/clinic/*` mutations — tinggal write controller, audit auto
- 7 sample psikolog sudah ada di seed → Slice 1 tinggal show di UI list
- `clinic_psikolog_profile` table sudah ada — Slice 1 query/mutate di sana

## Cross-cutting helpers yang muncul belakangan (post-MVP)

Ditambahkan setelah Slice 0 closed — dipakai oleh banyak slice:

- **`apps/api-gateway/src/clinic-booking/timezone.util.ts`**
  - `localPartsInTimezone(date, tz='Asia/Jakarta')` → `{ dow, dateStr, hhmm }`
  - `localDateAtMidnight(dateStr, tz)` → Date object (00:00 di TZ klinik sebagai UTC instant)
  - **Lesson**: container backend run di UTC, tapi semua slot/availability/booking diukur di WIB. Selalu pakai helper ini untuk konversi — jangan `date.getHours()` langsung (return UTC).
  - Dipakai: booking-validator, psikolog dashboard-stats, scheduler-reminder

- **`apps/api-gateway/src/common/utils/phone.util.ts`**
  - `normalizePhoneId(raw)` — universal format `08xxx/+62xxx/8xxx/62xxx` → `62xxx`
  - `formatPhoneDisplay(id)` — `'+62 856-0755-0989'`
  - Dipakai: Fonnte provider, send-test dialog, WA log lookup, webhook callback matcher

- **Pattern: aggregate endpoint untuk dashboard**
  - Bukan compose 4-5 useQuery di frontend, satu endpoint `/me/dashboard-stats` return semua bucket (today + week + queue) — cuts roundtrip, simpler caching, TZ logic centralized server-side
  - Dipakai: psikolog dashboard (Slice 10). Owner dashboard (Slice 12) bisa adopt pattern sama kalau perlu rewrite.
