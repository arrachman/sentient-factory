# ADR 005: Audit Log via NestJS Interceptor (Auto-Track Mutations)

**Status**: Accepted
**Date**: 2026-05-08
**Deciders**: User + Claude Code

## Context

PRD BR-04 demand audit log untuk akuntabilitas multi-role:
- Tiap aksi penting (create/update/delete/reschedule/cancel) harus tercatat
- Field: actor user_id, role, action, resource_type, resource_id, timestamp, ip_address
- Visible di `(admin)/audit-log` page

Pilihan implementasi:
- A. Manual: tiap controller method panggil `auditLog.write(...)` — verbose, gampang lupa
- B. Interceptor: NestJS interceptor tangkap semua mutation request, auto-write — DRY
- C. Database trigger: PostgreSQL trigger di table level — paling reliable tapi kurang context (siapa user, request id)

## Decision

Pakai **Opsi B**: NestJS interceptor di `apps/api-gateway/src/althea-audit/`.

Interceptor:
1. Match request method (POST/PUT/PATCH/DELETE) atau path pattern
2. Extract user dari JWT (req.user)
3. Extract resource_type dari controller name + resource_id dari params/body
4. After response success: write `AuditLog` record async
5. Tidak block response (fire-and-forget dengan error logging)

Decorator helper untuk override:
```typescript
@AuditAction('reschedule')  // override default action
@AuditResource('Booking')   // override default resource type
@Patch(':id/reschedule')
async reschedule(...) {...}
```

Skip annotation:
```typescript
@SkipAudit()  // jangan log endpoint ini (e.g., /health)
```

## Consequences

### Positive
- DRY: tidak ada logic audit di tiap controller
- Coverage 100% by default (opt-out, bukan opt-in)
- Single change point untuk tweak format/storage
- Testable di unit level (mock interceptor)

### Negative
- Implicit behavior — developer baru harus tau ada interceptor
- Mitigasi: documentasi di `apps/api-gateway/CLAUDE.md` + comment di interceptor file
- Async write berarti audit log bisa lag dari actual mutation
- Mitigasi: untuk audit critical (payment, role change), sync write dengan flag override

## Implementation timeline

- **Slice 0**: bikin `AuditLog` Prisma model + interceptor skeleton + register globally
- **Slice 1-13**: tiap slice inherit auto-audit dari interceptor (no extra work per slice)
- **Slice 12**: bikin UI untuk view & filter audit log

## Reference

PRD compliance: BR-04 multi-role accountability.
