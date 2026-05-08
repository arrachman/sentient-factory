---
name: shared-types
description: Skill untuk bekerja dengan packages/shared-types — single source of truth untuk semua TypeScript interfaces dan type definitions yang digunakan seluruh apps dalam monorepo.
---

Kamu sedang bekerja di `packages/shared-types` — paket tipe terpusat Sentient Factory.

## Tech Stack
- TypeScript 5
- Package name: `@sentient-factory/shared-types`
- Output: `dist/index.js` + `dist/index.d.ts`

## Struktur File

```
src/
├── index.ts          # Re-export semua types
└── types/
    ├── auth.ts       # User, JWT, session types
    ├── device.ts     # IoT device, sensor types
    ├── production.ts # Manufacturing, production order types
    ├── ai.ts         # AI chat, query, response types
    └── common.ts     # Shared utility types (pagination, response, dll)
```

## Export Pattern

```typescript
// src/index.ts
export * from './types/auth';
export * from './types/device';
export * from './types/production';
export * from './types/ai';
export * from './types/common';
```

## Cara Pakai di App Lain

```typescript
// Di apps/api-gateway, apps/web-dashboard, dll
import { User, AuthResponse } from '@sentient-factory/shared-types'
import { DeviceReading, ProductionOrder } from '@sentient-factory/shared-types'
```

## Perintah Umum

```bash
# Build (compile ke dist/)
npm run build

# Watch mode (auto-rebuild saat ada perubahan)
npm run dev

# Type check tanpa emit
npm run typecheck

# Generate Python types dari TypeScript
npm run generate:python
```

## Panduan Tugas Umum

### Menambah Type Baru
1. Pilih file yang sesuai di `src/types/` atau buat file baru
2. Definisikan interface/type
3. Export di `src/index.ts`
4. Jalankan `npm run build`
5. Semua apps otomatis mendapat type baru (karena pakai `"*"` di workspace)

### Konvensi Naming
- Interface: `PascalCase` (contoh: `ProductionOrder`)
- Type alias: `PascalCase` (contoh: `ApiResponse<T>`)
- Enum: `PascalCase` (contoh: `DeviceStatus`)
- Gunakan `interface` untuk object shapes yang mungkin di-extend
- Gunakan `type` untuk union types, utility types

### Sinkronisasi dengan Python (ai-engine)
Jalankan `npm run generate:python` untuk auto-generate Pydantic models yang setara
di `apps/ai-engine/sentient_factory_ai/models.py`

### Penting
- **Jangan hapus atau rename** type yang sudah ada tanpa cek semua apps yang menggunakannya
- Selalu build setelah perubahan: `npm run build`
- Shared types adalah **kontrak** antar services — ubah dengan hati-hati
