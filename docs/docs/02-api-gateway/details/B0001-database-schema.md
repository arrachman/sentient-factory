# B0001: Database Schema Design

## Description

Design and implement the initial database schema using Prisma ORM. This schema serves as the backbone for the user management, authentication, and role-based access control systems.

## Acceptance Criteria

- [ ] Define `User` model with fields: `id`, `email`, `username`, `passwordHash`, `fullName`, `avatarUrl`, `isActive`, timestamps.
- [ ] Define `Role` model for RBAC.
- [ ] Define `Permission` model for granular access control.
- [ ] Define `Department` model with support for hierarchical structure (self-relation).
- [ ] Define join tables/relations: `UserRole`, `RolePermission`, `UserDepartment`.
- [ ] Define `Session` model for managing active user sessions.
- [ ] Define `AuditLog` model for tracking changes.

## Technical Details

**File:** `prisma/schema.prisma`

```prisma
model User {
  id           String   @id @default(cuid())
  email        String   @unique
  // ... other fields
  roles        UserRole[]
}
// ... define other models
```

## Dependencies

- Prisma Client
- PostgreSQL
