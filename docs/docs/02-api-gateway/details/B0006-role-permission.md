# B0006: Role & Permission Module

## Description

Manage roles and permissions to control user access levels.

## Acceptance Criteria

- [ ] Implement `RolesController` with CRUD endpoints.
- [ ] **Assign Permissions:** `POST /api/roles/:id/permissions` to map permissions to a role.
- [ ] **Assign Role to User:** `POST /api/users/:id/roles` to assign roles to users.
- [ ] Seed initial roles: `SuperAdmin`, `Admin`, `Manager`, `Operator`, `User`.

## Technical Details

- Many-to-many relationship handling in Prisma (`UserRole`, `RolePermission`).
- Permissions should be predefined constants in code but stored in DB for dynamic assignment.
