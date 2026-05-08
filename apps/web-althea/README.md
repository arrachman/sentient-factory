# web-althea

Aplikasi booking psikologi **Althea Psychology** — pasien, psikolog, dan admin di 1 app dengan role-based routing.

> Untuk panduan agent (Claude Code, Cursor, dll) buka [`CLAUDE.md`](./CLAUDE.md).

## Stack

- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS v4 + ShadCN-style components
- TanStack Query v5 + react-hook-form + zod
- Auth via cookie JWT (shared dengan `web-dashboard`)

## Quick start

```bash
# Pertama kali
cp .env.example .env.local
npm install

# Dev server
npm run dev
# → http://localhost:3202

# Build production
npm run build
npm start

# Quality gate sebelum push
npm run check          # lint + typecheck + vitest
npm run test:e2e       # playwright (butuh api-gateway up)
```

## Port

`3202` — lihat `config/ports.json` di root monorepo (authoritative).

## Backend

Saat ini extend `api-gateway` (port 3203) dengan namespace `/althea/*` & schema PostgreSQL `althea_*`. Future: extract ke `api-althea` (3204, slot reserved).

## Struktur

```
app/                Next.js App Router (route groups per role)
features/           Feature modules (api/, hooks/, model/, ui/)
components/         UI primitives (ShadCN-style)
lib/                Utilities, api-client
shared/             Auth, providers, types, utils, constants
styles/             globals.css, althea-tokens.css, althea-components.css
middleware.ts       Auth guard + role-based routing
```

## Design System

- Brand: **sage + cream + deep teal** palette
- Type: **Lora** (serif, headlines) + **Nunito Sans** (body, UI)
- Reference mockup: `apps/psychology-design/` (HTML/JSX prototypes — bukan production code, tugas implement pixel-perfect)
- Tokens: `styles/althea-tokens.css` (CSS variables) → bind ke Tailwind v4 via `styles/globals.css` `@theme inline`

Lihat [`CLAUDE.md`](./CLAUDE.md) section "Design System" untuk detail.

## Konvensi

- **Server components** by default; `"use client"` hanya saat butuh interaktivitas
- Data fetching: TanStack Query di client, server fetch di Server Component
- Forms: react-hook-form + zod (jangan controlled state manual)
- Style: Tailwind utility-first; `class-variance-authority` untuk variants
- Import alias: `@/*` → root

## Roles & routes

| Role         | Route group           | Default landing |
|--------------|-----------------------|-----------------|
| patient      | `/(patient)/*`        | `/dashboard`    |
| psychologist | `/(psychologist)/*`   | `/dashboard`    |
| admin        | `/(admin)/*`          | `/dashboard`    |
| (anonymous)  | `/(auth)/*`           | `/login`        |

Route group syntax `(name)` di Next.js tidak mempengaruhi URL — middleware yang resolve ke route group sesuai role.
