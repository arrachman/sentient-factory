---
inclusion: fileMatch
fileMatchPattern: "apps/api-gateway/**"
---

# API Gateway — NestJS Backend

`apps/api-gateway` — backend REST API utama Sentient Factory. Port **3103**.

## Tech Stack

- NestJS v10 + TypeScript 5
- Prisma v5 + PostgreSQL 17
- JWT + Passport.js (local & jwt strategies)
- Swagger OpenAPI di `/api/docs`
- Nodemailer (email) + @whiskeysockets/baileys (WhatsApp)

## Struktur Module (`src/`)

| Module | Fungsi |
|--------|--------|
| `auth/` | JWT strategies, guards, decorators |
| `users/` | User management |
| `menus/` | Navigasi & menu |
| `master-data-*/` | Contacts, Divisions, Items, Provinces, Cities, Warehouses, Permissions, Roles, UOMs |
| `inbounds/` | Proses penerimaan barang |
| `outbound/` | Proses pengiriman barang |
| `dashboard/` | Agregasi data dashboard |
| `hr-attendance/` | Absensi karyawan |
| `sessions/` | Session tracking |
| `audit-logs/` | Audit trail sistem |
| `common/` | Utils, interceptors, BigIntInterceptor, error handling |
| `config/` | Vault integration |
| `prisma/` | Database client, migrations, seeds |

## Perintah

```bash
npm run dev              # Start dengan hot reload
npm run db:migrate       # Prisma migration
npm run db:generate      # Generate Prisma client
npm run db:seed          # Seed data
npm run build && npm start
npm run test             # Jest unit tests
```

## Panduan Membuat Module Baru

1. Buat folder `src/<nama-module>/`
2. Buat `<nama>.module.ts`, `<nama>.controller.ts`, `<nama>.service.ts`
3. Buat DTO di `dto/` dengan `class-validator`
4. Register di `app.module.ts`
5. Tambah Prisma schema di `prisma/schema.prisma`
6. `npm run db:migrate`

## Konvensi

- Guard JWT: `@UseGuards(JwtAuthGuard)`
- Validasi: DTO + `@UsePipes(ValidationPipe)`
- Docs: `@ApiTags()`, `@ApiOperation()` dari `@nestjs/swagger`
- BigInt otomatis diserialisasi ke string via `BigIntInterceptor`
- Table prefix ERP: `sys_*` / `adm_*` / `md_*` (jangan bentrok dengan `clinic_*`)

## File Konfigurasi Penting

- `prisma/schema.prisma` — Schema database
- `src/main.ts` — Entry point, CORS, global pipes
- `src/app.module.ts` — Root module
