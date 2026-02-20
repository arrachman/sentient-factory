# Web Dashboard Architecture

## Principles

- Keep route files thin: page files compose feature modules, not business logic.
- Keep one responsibility per module: API, model, hooks, UI, and tests are separated.
- Keep transport concerns centralized: API proxy logic lives in `shared/api/server-proxy.ts`.
- Keep auth/token handling centralized in `shared/auth`.

## Layout

- `app/`: routing and composition only.
- `features/*`: feature-first modules (`api`, `model`, `hooks`, `ui`, `__tests__`).
- `shared/*`: reusable cross-feature primitives.

## Quality Gate

Run this before merge:

```bash
npm run check
```

Optional e2e smoke:

```bash
npm run test:e2e
```
