# B0004: Security Middleware

## Description

Implement security guards and interceptors to protect API endpoints.

## Acceptance Criteria

- [ ] **JwtAuthGuard:** Verify valid access tokens for protected routes.
- [ ] **RolesGuard:** Check if user has required role (RBAC).
- [ ] **PermissionsGuard:** Check if user has specific granular permissions.
- [ ] **ThrottlerGuard:** Implement rate limiting to prevent abuse.
- [ ] **LoggingInterceptor:** Log incoming requests and outgoing responses (exclude sensitive body data).

## Technical Details

- Extend NestJS `CanActivate` interface.
- Use `Reflector` to read metadata from `@Roles()` or `@Permissions()` decorators.

## Dependencies

- `B0003` (Auth System)
