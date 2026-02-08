# B0002: Database Setup & Migration

## Description

Configure the connection to the PostgreSQL database and establish the initial migration workflow.

## Acceptance Criteria

- [ ]  Install and configure `@prisma/client`.
- [ ]  Configure `DATABASE_URL` in environment variables.
- [ ]  Implement connection pooling for performance.
- [ ]  Create initial migration (`prisma migrate dev`).
- [ ]  Create seed script (`prisma/seed.ts`) to populate default roles (Admin, User) and initial permissions.

## Technical Details

- **Env Var:** `DATABASE_URL=postgresql://root:PasswordSuperRahasia123!@localhost:3308/sentient_factory`
- **Commands:**
  - `npx prisma migrate dev --name init`
  - `npx prisma generate`
  - `npx prisma db seed`
