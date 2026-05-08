---
name: open-design
description: Skill untuk bekerja dengan apps/open-design — local-first AI design tool dengan Electron desktop shell, Next.js web runtime, daemon process, dan integrasi Anthropic/OpenAI SDK untuk design skills.
---

Kamu sedang bekerja di `apps/open-design` — AI-powered design tool Sentient Factory.

## Tech Stack
- **Runtime**: Node.js ~24 + TypeScript 5.6.3
- **Web**: Next.js 16 (App Router)
- **Desktop**: Electron (shell aplikasi)
- **Daemon**: Express (privileged local server)
- **Storage**: Better SQLite3 (`.od/app.sqlite`)
- **AI**: @anthropic-ai/sdk (Claude), OpenAI SDK
- **Package Manager**: pnpm 10.33.2+
- **Port**: 3215

## Arsitektur Multi-Process

```
┌─────────────────────────────────────┐
│  Electron Shell (apps/desktop/)     │
│  ┌───────────────────────────────┐  │
│  │  Web Runtime (apps/web/)      │  │
│  │  Next.js 16 + React           │  │
│  └──────────────┬────────────────┘  │
│                 │ IPC               │
│  ┌──────────────▼────────────────┐  │
│  │  Daemon (apps/daemon/)        │  │
│  │  Express + privileged access  │  │
│  │  Agent spawning               │  │
│  │  SQLite persistence           │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
```

## Workspace Structure (internal monorepo)

```
apps/
├── daemon/          # Privileged daemon & CLI
│   └── src/
│       ├── agents/          # Agent spawning & management
│       ├── artifact-manifest/  # Artifact tracking
│       ├── media/           # Media handling
│       └── design-systems/  # Brand design systems
├── web/             # Next.js web runtime
│   └── src/
│       ├── artifacts/       # Artifact components
│       └── i18n/            # Internationalization
├── desktop/         # Electron shell
├── packaged/        # Electron runtime entry
└── e2e/             # Playwright E2E tests

packages/
├── contracts/          # Web/daemon DTO contracts
├── sidecar-proto/      # Sidecar business protocol
├── sidecar/            # Generic sidecar bootstrap
└── platform/           # OS process primitives

skills/                 # Artifact-shape design skills
design-systems/         # Brand DESIGN.md files
craft/                  # Universal brand rules
```

## Perintah Umum

```bash
# Development
pnpm tools-dev           # Local development (full stack)

# Build
pnpm build               # Build web app

# Type checking
pnpm typecheck

# Testing
pnpm test                # Unit tests
pnpm test:ui             # Test UI
pnpm test:e2e:live       # Playwright E2E tests
```

## Konsep Utama

### Skills
Design skills adalah instruksi untuk AI dalam membuat artefak desain.
- Disimpan di `skills/` folder
- Format markdown dengan instruksi desain
- Dieksekusi oleh daemon agent

### Design Systems
Brand-specific design rules:
- Disimpan di `design-systems/` folder
- File `DESIGN.md` per brand/project
- Berisi warna, tipografi, komponen

### Artifacts
Output dari design agent:
- Distream ke sandboxed preview di web
- Tracked di `artifact-manifest/`
- Persistent di SQLite (`.od/app.sqlite`)

### Agent Workflow
1. User input design request di web UI
2. Web mengirim ke daemon via IPC
3. Daemon spawn agent (Claude/OpenAI)
4. Agent baca skills + design systems
5. Agent generate artifact (HTML/CSS/JSX)
6. Hasil distream kembali ke web preview

## File Penting
- `AGENTS.md` — Directory guide untuk agents
- `docs/architecture.md` — Arsitektur detail
- `docs/skills-protocol.md` — Protokol skills
- `packages/contracts/` — DTO antar web dan daemon
