# Slice N: <Name> — SPEC

**Status**: 🔵 Not started
**Estimated sessions**: <X>
**Depends on**: <list>
**Blocks**: <list>

## Goal

<1-2 sentences: what this slice delivers, why it matters now>

## Non-goals (out of slice N)

- ❌ <thing intentionally NOT in this slice>

## Acceptance Criteria

### A. DB
- [ ] <Prisma model name + fields>
- [ ] Migration: `apps/api-gateway/prisma/migrations/<timestamp>_<slice-name>/`

### B. API
- [ ] Endpoint `<METHOD> /althea/<resource>`
- [ ] DTO + zod validation
- [ ] Jest spec coverage minimum: GET, POST, PATCH, DELETE happy path

### C. UI
- [ ] Page `apps/web-althea/app/<role>/<feature>/page.tsx`
- [ ] Feature folder `apps/web-althea/features/<feature>/{api,hooks,model,ui}/`
- [ ] Sesuai mockup `apps/psychology-design/<MockupFile>.jsx` pixel-perfect

### D. Tests
- [ ] Vitest unit untuk hook + model
- [ ] Playwright e2e happy path

## Verification

```bash
cd apps/api-gateway && npm run test         # Jest pass
cd apps/web-althea && npm run check         # lint + typecheck + vitest
cd apps/web-althea && npm run test:e2e      # playwright
```

Manual smoke:
1. Login sebagai <role>
2. Navigate ke <route>
3. Expected: <behavior>

## Files touched

### api-gateway
- `prisma/schema.prisma` — add model
- `src/althea-<feature>/{controller,service,module}.ts` — NEW
- `src/althea-<feature>/dto/*.dto.ts` — NEW

### web-althea
- `app/<role>/<feature>/page.tsx` — implement
- `features/<feature>/api/*.api.ts` — fetch
- `features/<feature>/hooks/*.ts` — TanStack Query
- `features/<feature>/model/types.ts` — types
- `features/<feature>/ui/*.tsx` — components

## Open questions

- [ ] <ambiguity to resolve>

## Definition of Done

1. ✅ Acceptance criteria all checked
2. ✅ Tests pass
3. ✅ PR merged
4. ✅ `LEARNINGS.md` ditulis kalau ada decision worth capturing
5. ✅ `VERIFICATION.md` updated
