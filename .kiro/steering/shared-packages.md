---
inclusion: fileMatch
fileMatchPattern: "packages/**"
---

# Shared Packages

## packages/shared-types

`@sentient-factory/shared-types` — single source of truth untuk semua TypeScript interfaces & type definitions.

```
src/
├── index.ts          # Re-export semua types
└── types/
    ├── auth.ts       # User, JWT, session types
    ├── device.ts     # IoT device, sensor types
    ├── production.ts # Manufacturing, production order types
    ├── ai.ts         # AI chat, query, response types
    └── common.ts     # Pagination, response, dll
```

### Aturan Kritis

- **Jangan hapus/rename** type yang sudah ada tanpa cek semua apps yang menggunakannya.
- Perubahan tipe HARUS update sisi TS *dan* Pydantic (jalankan `npm run generate:python`).
- Selalu `npm run build` setelah perubahan.

### Perintah

```bash
npm run build           # Compile ke dist/
npm run dev             # Watch mode
npm run typecheck
npm run generate:python # Sync Pydantic models ke apps/ai-engine
```

### Cara Pakai

```typescript
import { User, AuthResponse } from '@sentient-factory/shared-types'
import { DeviceReading, ProductionOrder } from '@sentient-factory/shared-types'
```

---

## packages/ui-kit

`@sentient-factory/ui-kit` — shared React component library.

- React 19 + TypeScript, Tailwind CSS v3
- class-variance-authority (CVA), Lucide React, Storybook 7

### Pola Komponen (CVA)

```tsx
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../utils/cn'

const buttonVariants = cva('inline-flex items-center rounded-md', {
  variants: {
    variant: {
      default: 'bg-primary text-white hover:bg-primary/90',
      outline: 'border border-input bg-transparent',
    },
    size: {
      default: 'h-10 px-4',
      sm: 'h-9 px-3',
    },
  },
  defaultVariants: { variant: 'default', size: 'default' },
})
```

### Perintah

```bash
npm run dev             # Watch mode
npm run storybook       # Port 6006
npm run build
```

---

## packages/logger

`@sentient-factory/logger` — Pino v9 structured logging dengan correlation ID.

```typescript
import { createLogger, logger } from '@sentient-factory/logger'

logger.info('Server started')
logger.error({ err }, 'Database connection failed')

const log = createLogger({ service: 'auth', module: 'jwt' })
log.info({ userId }, 'User logged in')
```

Level: `trace` | `debug` | `info` | `warn` | `error` | `fatal`

Env: `LOG_LEVEL=debug`, `NODE_ENV=development` (aktifkan pino-pretty)
