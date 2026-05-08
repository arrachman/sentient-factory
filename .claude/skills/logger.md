---
name: logger
description: Skill untuk bekerja dengan packages/logger — shared structured logging utility berbasis Pino dengan UUID correlation ID, dipakai semua Node.js apps di monorepo.
---

Kamu sedang bekerja di `packages/logger` — shared logging library Sentient Factory.

## Tech Stack
- **Package name**: `@sentient-factory/logger`
- **Core**: Pino v9 (structured JSON logging)
- **Pretty print**: pino-pretty v10 (development)
- **Correlation**: uuid v9 (request tracing)

## Cara Pakai di App Lain

```typescript
import { createLogger, logger } from '@sentient-factory/logger'

// Logger default (singleton)
logger.info('Server started')
logger.error({ err }, 'Database connection failed')

// Logger dengan context (per module/service)
const log = createLogger({ service: 'auth', module: 'jwt' })
log.info({ userId }, 'User logged in')
log.warn({ attempt }, 'Login attempt failed')
```

## Log Levels

| Level | Kapan Dipakai |
|-------|--------------|
| `trace` | Detail debug sangat granular |
| `debug` | Informasi debug development |
| `info` | Event normal (server start, request masuk) |
| `warn` | Situasi tidak normal tapi tidak error |
| `error` | Error yang perlu investigasi |
| `fatal` | Error yang menyebabkan app crash |

## Perintah Umum

```bash
# Build
npm run build

# Watch mode
npm run dev

# Quality
npm run lint
npm run typecheck
```

## Panduan Tugas Umum

### Menambah Logger ke App Baru
```typescript
// Di app entry point (main.ts / index.ts)
import { logger } from '@sentient-factory/logger'

logger.info({ port: 3103 }, 'API Gateway started')
```

### Request Correlation di NestJS (api-gateway)
```typescript
import { createLogger } from '@sentient-factory/logger'
import { v4 as uuidv4 } from 'uuid'

// Di interceptor
const requestId = uuidv4()
const log = createLogger({ requestId })
log.info({ method, url }, 'Incoming request')
```

### Environment
- **Development**: output pretty-printed dengan warna (via pino-pretty)
- **Production**: output JSON satu baris per log entry (mudah di-parse Loki/CloudWatch)

### Konfigurasi Level via Environment
```bash
LOG_LEVEL=debug   # trace | debug | info | warn | error | fatal
NODE_ENV=development  # aktifkan pino-pretty
```
