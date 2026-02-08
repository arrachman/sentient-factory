# B0005: User Management Module

## Description

Core CRUD operations for managing users within the system.

## Acceptance Criteria

- [ ] Implement `UsersModule`, `UsersService`, `UsersController`.
- [ ] **List Users:** `GET /api/users` with pagination, sorting, and filtering support.
- [ ] **Get User:** `GET /api/users/:id` to fetch detailed profile.
- [ ] **Create User:** `POST /api/users` (Admin only) to manually add users.
- [ ] **Update User:** `PUT /api/users/:id` to update details.
- [ ] **Soft Delete:** `DELETE /api/users/:id` to mark user as inactive (not remove from DB).
- [ ] **Profile:** `GET /api/profile` for logged-in user to see their own data.

## Technical Details

- Use Prisma for DB access.
- Ensure sensitive data (passwordHash) is excluded from responses using `ClassSerializerInterceptor` or manual DTO mapping.

## Dependencies

- `B0001` (Database Schema)
- `B0003` (Auth System - for guards)
