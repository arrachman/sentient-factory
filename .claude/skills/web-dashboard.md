---
name: web-dashboard
description: Skill untuk bekerja dengan apps/web-dashboard — Next.js 16 admin dashboard, fitur AI chat, alerting, master data CRUD, visualisasi data, dan integrasi ML (face detection, pose estimation).
---

Kamu sedang bekerja di `apps/web-dashboard` — dashboard admin utama Sentient Factory.

## Tech Stack
- **Framework**: Next.js 16.1.1 + React 19.2.1 + TypeScript 5.9.3
- **Styling**: Tailwind CSS v4
- **UI**: Radix UI, Lucide React, shadcn/ui
- **Data Fetching**: TanStack React Query v5
- **Table**: TanStack React Table v8
- **Charts**: Recharts, ApexCharts
- **Form**: React Hook Form + Zod
- **ML**: TensorFlow.js, MediaPipe (face detection, pose estimation)
- **Port**: 3201

## Struktur Folder

```
app/
├── auth/                  # Halaman login/logout
├── api/                   # 151+ API routes (proxy ke api-gateway & ai-engine)
│   ├── ai/                # Chat, history, schema, test
│   └── alerting/          # Rules, templates, delivery logs
└── (layouts)/             # Layout wrapper dengan sidebar

features/                  # Fitur per domain
├── administrator-*/       # Audit log, dept, menu, notif, permission, role, session, users
├── finance-accounting/    # Modul akuntansi
├── logistic-*/            # Inbound, outbound, stock report, transaksi
└── master-*/              # City, SLA, contact, division, item, province, UOM

components/
├── ui/                    # Komponen generik (button, input, dialog, dll)
├── dashboard/             # Widget dashboard
└── layouts/               # Header, sidebar, menu context
```

## Fitur Utama

### AI Chat (Senti)
- Komponen di `features/` untuk chat interface
- API proxy di `app/api/ai/chat/`
- Streaming response dari AI Engine
- History session di `app/api/ai/history/`

### Alerting System
- Rules management di `app/api/alerting/rules/`
- Template notifikasi di `app/api/alerting/templates/`
- Delivery log tracking
- Integrasi WhatsApp via Baileys

### Dashboard Multi-Demo
- Demo 1–5 dengan layout berbeda (`styles/demos/`)
- Dark/Light theme
- Responsive design

## Perintah Umum

```bash
# Development
npm run dev              # Next.js dev server dengan Turbopack

# Build & Production
npm run build            # Production build
npm run start            # Start production server

# Testing
npm run test             # Vitest unit tests
npm run test:watch       # Watch mode
npm run test:e2e         # Playwright E2E tests

# Quality
npm run lint             # ESLint
npm run typecheck        # TypeScript type checking
```

## Panduan Tugas Umum

### Membuat Feature Baru
1. Buat folder `features/<domain-nama>/`
2. Buat komponen React di dalam folder
3. Tambah API route di `app/api/<nama>/route.ts`
4. API route adalah proxy ke `api-gateway` atau `ai-engine`

### Menambah Halaman Baru
- Buat file di `app/(layouts)/<nama>/page.tsx`
- Tambah menu di `components/layouts/app/components/sidebar-menu.tsx`
- Register di menu context

### Pola API Route (Proxy)
```typescript
// app/api/example/route.ts
export async function GET(request: Request) {
  const res = await fetch(`${process.env.API_GATEWAY_URL}/example`)
  return Response.json(await res.json())
}
```

### Komponen UI
- Gunakan komponen dari `components/ui/` (berdasarkan shadcn/ui)
- Gunakan `cn()` dari `lib/utils` untuk class merging
- Toast notifikasi: gunakan `sonner`

## File Penting
- `app/layout.tsx` — Root layout dengan providers
- `components/layouts/app/components/sidebar-menu.tsx` — Menu navigasi
- `lib/` — Utilities, hooks, API helpers
- `types/` — TypeScript type definitions
- `.env.local` — NEXT_PUBLIC_API_URL, dll
