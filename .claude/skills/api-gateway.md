---
name: api-gateway
description: Skill untuk bekerja dengan apps/api-gateway — NestJS backend REST API, autentikasi JWT, master data, logistik inbound/outbound, HR attendance, audit log, dan integrasi WhatsApp.
---

Kamu sedang bekerja di `apps/api-gateway` — backend REST API utama Sentient Factory.

## Tech Stack
- **Framework**: NestJS v10 + TypeScript 5
- **ORM**: Prisma v5 + PostgreSQL 17
- **Auth**: JWT + Passport.js (local & jwt strategies)
- **Docs**: Swagger OpenAPI di `/api/docs`
- **Notifikasi**: Nodemailer (email) + @whiskeysockets/baileys (WhatsApp)
- **Port**: 3103

## Struktur Module (`src/`)

| Module | Path | Fungsi |
|--------|------|--------|
| Auth | `src/auth/` | JWT strategies, guards, decorators |
| Users | `src/users/` | User management |
| Menus | `src/menus/` | Navigasi & menu |
| Master Data | `src/master-data-*/` | Contacts, Divisions, Items, Provinces, Cities, City-SLAs, Warehouses, Permissions, Roles, UOMs |
| Inbounds | `src/inbounds/` | Proses penerimaan barang |
| Outbound | `src/outbound/` | Proses pengiriman barang |
| Dashboard | `src/dashboard/` | Agregasi data dashboard |
| Departments | `src/departments/` | Manajemen organisasi |
| HR Attendance | `src/hr-attendance/` | Absensi karyawan |
| Sessions | `src/sessions/` | Session tracking |
| Audit Logs | `src/audit-logs/` | Audit trail sistem |
| Common | `src/common/` | Utils, interceptors, error handling |
| Config | `src/config/` | Vault integration |
| Prisma | `src/prisma/` | Database client, migrations, seeds |

## Perintah Umum

```bash
# Development
npm run dev              # Start dengan hot reload

# Database
npm run db:migrate       # Jalankan Prisma migration
npm run db:generate      # Generate Prisma client
npm run db:seed          # Seed data development

# Build & Production
npm run build            # Compile TypeScript
npm run start            # Jalankan production build

# Test
npm run test             # Jest unit tests
npm run test:e2e         # End-to-end tests
```

## Panduan Tugas Umum

### Membuat Module Baru
1. Buat folder di `src/<nama-module>/`
2. Buat `<nama>.module.ts`, `<nama>.controller.ts`, `<nama>.service.ts`
3. Buat DTO di `dto/` dengan `class-validator`
4. Register module di `app.module.ts`
5. Tambah Prisma schema di `prisma/schema.prisma`
6. Jalankan `npm run db:migrate`

### Menambah Endpoint Baru
- Controller menggunakan decorator NestJS: `@Get()`, `@Post()`, `@Put()`, `@Delete()`
- Guard JWT: gunakan `@UseGuards(JwtAuthGuard)`
- Validasi: gunakan DTO + `@UsePipes(ValidationPipe)`
- Dokumentasi: tambah `@ApiTags()`, `@ApiOperation()` dari `@nestjs/swagger`

### BigInt Handling
- Ada `BigIntInterceptor` di `src/common/` — otomatis serialisasi BigInt ke string

## File Konfigurasi Penting
- `prisma/schema.prisma` — Schema database
- `src/main.ts` — Entry point, CORS, global pipes
- `src/app.module.ts` — Root module
- `.env` — DATABASE_URL, JWT_SECRET, dll
