# B0003: Authentication System

## Description

Implement a secure authentication system using JWT (JSON Web Tokens) and Passport.js strategy. pastikan pakai NESTJS

## Acceptance Criteria

- [ ]  Implement `AuthModule`, `AuthService`, and `AuthController`.
- [ ]  **Register:** Endpoint `POST /api/auth/register` to create new users (with password hashing using bcrypt).
- [ ]  **Login:** Endpoint `POST /api/auth/login` to validate credentials and return JWT pair (access + refresh token).
- [ ]  **Logout:** Endpoint `POST /api/auth/logout` to invalidate refresh tokens.
- [ ]  **Refresh:** Endpoint `POST /api/auth/refresh` to get new access token.
- [ ]  Implement Hashing service for passwords.

## Technical Details

- **Libraries:** `@nestjs/jwt`, `@nestjs/passport`, `passport-jwt`, `bcrypt`.
- **Security:** Access tokens should have short expiry (e.g., 15m), Refresh tokens longer (e.g., 7d).

## API Endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/refresh`
