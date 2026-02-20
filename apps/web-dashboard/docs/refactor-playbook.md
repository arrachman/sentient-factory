# Refactor Playbook

## Migration Steps for a New Feature

1. Move route logic from `app/.../page.tsx` into `features/<name>/ui/*`.
2. Move data fetch calls into `features/<name>/api/*` and use `shared/api/http.ts`.
3. Move pure functions into `features/<name>/model/*` and write unit tests.
4. Add query/mutation hooks in `features/<name>/hooks/*`.
5. Keep route page as a small composition wrapper.

## API Route Rules

- Use `createCollectionProxy` for collection endpoints.
- Use `createEntityProxy` for detail endpoints.
- Use `proxyToApi` for custom method or custom path endpoints.

## Definition of Done

- `page.tsx` is orchestration-only.
- New model logic has unit tests.
- No direct token parsing in feature modules.
- `npm run check` passes.
