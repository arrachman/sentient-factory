# Backend API Development Tasks

This document outlines the API endpoints required to support the Frontend Admin Module tickets (F0001-F0025).

## **Phase 1: Authentication & Security** (F0001-F0003)

- [ ] **POST /api/auth/login** (F0001)
  - [ ] Accept email/password.
  - [ ] Return user info.
  - [ ] Set `HttpOnly` cookie for JWT.
- [ ] **POST /api/auth/logout** (F0002)
  - [ ] Clear auth cookie.
- [ ] **POST /api/auth/refresh** (F0003)
  - [ ] Refresh access token using refresh token (cookie).
- [ ] **GET /api/auth/me** (F0003)
  - [ ] Return current authenticated user details and permissions.

## **Phase 2: User Management** (F0004-F0008)

- [ ] **GET /api/users** (F0004)
  - [ ] Support pagination, search (name/email), sorting, and status filtering.
- [ ] **POST /api/users** (F0005)
  - [ ] Create new user with role assignment.
  - [ ] Trigger welcome email (optional/async).
- [ ] **`GET /api/users/{id}`** (F0006)
  - [ ] Get user details.
- [ ] **`PUT /api/users/{id}`** (F0006)
  - [ ] Update user profile, roles.
- [ ] **`DELETE /api/users/{id}`** (F0007)
  - [ ] Soft delete user.
- [ ] **`PUT /api/users/{id}/restore`** (F0007)
  - [ ] Restore soft-deleted user.
- [ ] **GET /api/profile** (F0008)
  - [ ] Get current user profile (alias for `users/{my-id}`).
- [ ] **PUT /api/profile/password** (F0008)
  - [ ] Change current user password.
- [ ] **PUT /api/profile/avatar** (F0008)
  - [ ] Upload/update profile picture.

## **Phase 3: Role & Permission Management** (F0009-F0012)

- [ ] **GET /api/roles** (F0009)
  - [ ] List all roles with user counts.
- [ ] **`GET /api/roles/{id}`** (F0010)
  - [ ] Get role details and permissions.
- [ ] **POST /api/roles** (F0010)
  - [ ] Create new role.
- [ ] **`PUT /api/roles/{id}`** (F0010)
  - [ ] Update role details and permissions.
- [ ] **`DELETE /api/roles/{id}`** (F0010)
  - [ ] Delete role (validate not in use).
- [ ] **GET /api/permissions** (F0011)
  - [ ] List all available system permissions (grouped by module).
- [ ] **POST /api/roles/assign** (F0012)
  - [ ] Bulk assign roles to users.

## **Phase 4: Admin Dashboard** (F0015)

- [ ] **GET /api/dashboard/stats** (F0015)
  - [ ] Return summary counts (users, active sessions, etc.).
- [ ] **GET /api/dashboard/activity** (F0015)
  - [ ] Return recent system activity feed.
- [ ] **GET /api/dashboard/chart/users** (F0015)
  - [ ] Return user growth data for charts.

## **Phase 5 & 6: Advanced Features** (F0019-F0020)

- [ ] **GET /api/audit-logs** (F0019)
  - [ ] List audit logs with filtering (user, action, date).
- [ ] **POST /api/users/import** (F0020)
  - [ ] Bulk import users from CSV/Excel.
- [ ] **GET /api/users/export** (F0020)
  - [ ] Export users to CSV/Excel.
