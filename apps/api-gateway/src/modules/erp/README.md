# ERP Module Routers

Koleksi router Express untuk modul ERP dengan prefix `/erp`.

## Router yang Tersedia

| Router | Endpoint Base | Deskripsi |
|--------|---------------|-----------|
| `coa.router.ts` | `/erp/coa` | Chart of Accounts (Bagan Akun) |
| `gudang.router.ts` | `/erp/gudang` | Warehouse Management (Gudang) |
| `item.router.ts` | `/erp/item` | Item/Product Master Data |
| `partner.router.ts` | `/erp/partner` | Partners (Customers/Suppliers) |
| `penomoran-dokumen.router.ts` | `/erp/penomoran-dokumen` | Document Numbering Configuration |
| `ppdb.router.ts` | `/erp/ppdb` | Student Admission (PPDB) |
| `pengguna.router.ts` | `/erp/pengguna` | User Management |
| `tunggakan.router.ts` | `/erp/tunggakan` | Arrears/Outstanding Payments |
| `kurikulum.router.ts` | `/erp/kurikulum` | Curriculum Management |

## Struktur Endpoint

Setiap router mengikuti pola RESTful:

```
GET    /erp/{resource}       - List all
GET    /erp/{resource}/:id   - Get by ID
POST   /erp/{resource}       - Create new
PUT    /erp/{resource}/:id   - Update existing
DELETE /erp/{resource}/:id   - Delete
```

## Penggunaan

### Import Individual Router

```typescript
import { coaRouter, itemRouter } from './modules/erp';

app.use(coaRouter);
app.use(itemRouter);
```

### Import Semua Router

```typescript
import * as erpRouters from './modules/erp';

Object.values(erpRouters).forEach(router => {
  app.use(router);
});
```

## Response Format

Semua endpoint menggunakan format response konsisten:

### Success Response
```json
{
  "success": true,
  "data": {},
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error description"
  }
}
```

## Status Implementasi

⚠️ **TODO**: Semua router saat ini adalah skeleton dengan placeholder logic.

Implementasi lengkap membutuhkan:
1. Service layer untuk business logic
2. Prisma model dan query
3. Validation middleware (class-validator)
4. Authentication & authorization middleware
5. Error handling middleware
6. Request/response DTO definitions

## Integrasi dengan NestJS

Jika menggunakan NestJS, router Express ini perlu diadaptasi ke controller NestJS dengan decorator `@Controller()`, `@Get()`, `@Post()`, dll.

Alternatif: gunakan existing controller NestJS di direktori `src/erp-*` yang sudah ada.
