# B0009: Audit Logging System

## Description

Track critical actions performed by administrators for security and accountability.

## Acceptance Criteria

- [ ] Create `AuditLogService`.
- [ ] Automatically log mutations (POST, PUT, DELETE) on critical resources (Users, Roles).
- [ ] Store: `userId`, `action`, `entityType`, `entityId`, `oldData`, `newData`, `ipAddress`.
- [ ] **View Logs:** `GET /api/admin/audit-logs` with filtering by user or entity.

## Technical Details

- Can be implemented via Interceptor or manually in Services.
- `oldData`/`newData` stored as JSONB.
