---
inclusion: fileMatch
fileMatchPattern: "apps/web-dashboard/**"
---

# Web Dashboard — Next.js Admin Dashboard

`apps/web-dashboard` — dashboard admin utama Sentient Factory. Port **3201**.

## Tech Stack

- Next.js 16.1.1 + React 19.2.1 + TypeScript 5.9.3
- Tailwind CSS v4, Radix UI, shadcn/ui, Lucide React
- TanStack React Query v5, TanStack React Table v8
- Recharts, ApexCharts, React Hook Form + Zod
- TensorFlow.js, MediaPipe (face detection, pose estimation)

## Struktur Folder

```
app/
├── auth/                  # Login/logout
├── api/                   # 151+ API routes (proxy ke api-gateway & ai-engine)
│   ├── ai/                # Chat, history, schema, test
│   └── alerting/          # Rules, templates, delivery logs
└── (layouts)/             # Layout wrapper dengan sidebar

features/
├── administrator-*/       # Audit log, dept, menu, notif, permission, role, session, users
├── finance-accounting/
├── logistic-*/            # Inbound, outbound, stock report, transaksi
└── master-*/              # City, SLA, contact, division, item, province, UOM

components/
├── ui/                    # Komponen generik (shadcn/ui based)
├── dashboard/             # Widget dashboard
└── layouts/               # Header, sidebar, menu context
```

## Panduan Feature Baru

1. Buat folder `features/<domain-nama>/`
2. Tambah API route di `app/api/<nama>/route.ts` (proxy pattern ke api-gateway/ai-engine)
3. Tambah halaman di `app/(layouts)/<nama>/page.tsx`
4. Register menu di `components/layouts/app/components/sidebar-menu.tsx`

## Pola API Route (Proxy)

```typescript
export async function GET(request: Request) {
  const res = await fetch(`${process.env.API_GATEWAY_URL}/example`)
  return Response.json(await res.json())
}
```

## Komponen UI

- Gunakan `components/ui/` (shadcn/ui based)
- Gunakan `cn()` dari `lib/utils` untuk class merging
- Toast: `sonner`

## Perintah

```bash
npm run dev              # Turbopack
npm run build && npm start
npm run test             # Vitest
npm run test:e2e         # Playwright
npm run lint && npm run typecheck
```
