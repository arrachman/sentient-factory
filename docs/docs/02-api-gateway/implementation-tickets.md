---
sidebar_position: 5
---

# Implementation Tickets - API Gateway

## **Project Overview**

Implementasi API Gateway dengan modul Authentication & User Management untuk Sentient Factory.

**Tech Stack:** NestJS, Prisma, PostgreSQL, JWT, TypeScript  
**Timeline:** 6-9 minggu  
**Team Size:** 2-3 developers

## **Ticket Structure**

Setiap ticket memiliki format:

- **ID:** Ticket identifier (TKT-XXX)
- **Title:** Nama task singkat
- **User Story:** Deskripsi kebutuhan dari perspektif user
- **Acceptance Criteria:** Kondisi yang harus dipenuhi untuk dianggap selesai
- **Implementation Details:** Detail teknis implementasi
- **Files to Create/Modify:** Daftar file yang akan dibuat/dimodifikasi
- **Estimated Time:** Estimasi waktu pengerjaan
- **Priority:** High/Medium/Low
- **Dependencies:** Ticket yang harus diselesaikan sebelumnya
- **Test Requirements:** Testing yang diperlukan

---

## **Phase 1: Database Schema & Setup**

### **TKT-001: Setup Project Structure & Dependencies**

**Title:** Initialize API Gateway Project Structure  
**User Story:** Sebagai developer, saya ingin memiliki struktur project yang terorganisir dengan dependencies yang lengkap agar bisa mulai develop dengan cepat.  
**Acceptance Criteria:**

1. Folder structure sesuai standar NestJS + Prisma
2. package.json dengan semua dependencies yang diperlukan
3. TypeScript configuration yang benar
4. ESLint & Prettier setup
5. Environment variables template (.env.example)

**Implementation Details:**

1. Buat struktur folder:

   ```
   apps/api-gateway/
   ├── src/
   │   ├── auth/
   │   │   ├── controllers/
   │   │   ├── services/
   │   │   ├── dto/
   │   │   ├── entities/
   │   │   └── guards/
   │   ├── users/
   │   │   ├── controllers/
   │   │   ├── services/
   │   │   ├── dto/
   │   │   └── entities/
   │   ├── roles/
   │   │   ├── controllers/
   │   │   ├── services/
   │   │   ├── dto/
   │   │   └── entities/
   │   ├── common/
   │   │   ├── filters/
   │   │   ├── interceptors/
   │   │   ├── middleware/
   │   │   └── pipes/
   │   ├── database/
   │   │   └── prisma/
   │   └── app.module.ts
   ├── prisma/
   │   ├── migrations/
   │   ├── seeds/
   │   └── schema.prisma
   ├── test/
   ├── scripts/
   └── config/
   ```

2. Install dependencies:

   ```bash
   npm install fastify @fastify/cors @fastify/helmet @fastify/jwt @fastify/websocket
   npm install prisma @prisma/client
   npm install bcrypt jsonwebtoken dotenv
   npm install -D typescript @types/node ts-node nodemon eslint prettier
   ```

3. Setup tsconfig.json dengan konfigurasi yang sesuai

**Files to Create/Modify:**

- `apps/api-gateway/package.json` (modify)
- `apps/api-gateway/tsconfig.json` (create)
- `apps/api-gateway/.eslintrc.json` (create)
- `apps/api-gateway/.prettierrc` (create)
- `apps/api-gateway/.env.example` (create)
- `apps/api-gateway/.gitignore` (create)

**Estimated Time:** 2 hours  
**Priority:** High  
**Dependencies:** None  
**Test Requirements:** None

---

### **TKT-002: Design Prisma Schema for User Management**

**Title:** Create Database Schema for Authentication System  
**User Story:** Sebagai system architect, saya ingin memiliki schema database yang komprehensif untuk user management dengan semua relations yang diperlukan.  
**Acceptance Criteria:**

1. Schema.prisma dengan semua models: User, Role, Permission, Department
2. Proper relations antara models
3. Enums untuk status dan types
4. Indexes untuk performance
5. Soft delete support

**Implementation Details:**

1. Buat file `prisma/schema.prisma` dengan content lengkap:

   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }

   generator client {
     provider = "prisma-client-js"
   }

   enum UserStatus { ACTIVE INACTIVE SUSPENDED PENDING }
   enum RoleType { SYSTEM CUSTOM }
   enum PermissionAction { CREATE READ UPDATE DELETE MANAGE EXECUTE }
   enum PermissionResource { ALL OWN DEPARTMENT TEAM }

   model User {
     id           String   @id @default(cuid())
     email        String   @unique
     username     String   @unique
     passwordHash String
     fullName     String?
     avatarUrl    String?
     status       UserStatus @default(PENDING)
     // ... semua fields lainnya
   }

   // ... semua models lainnya
   ```

2. Include semua models dari design sebelumnya (User, Role, Permission, Department, Session, etc.)

**Files to Create/Modify:**

- `apps/api-gateway/prisma/schema.prisma` (create)

**Estimated Time:** 4 hours  
**Priority:** High  
**Dependencies:** TKT-001  
**Test Requirements:** Schema validation dengan `npx prisma validate`

---

### **TKT-003: Database Migration & Prisma Client Setup**

**Title:** Initialize Database and Setup Prisma Client  
**User Story:** Sebagai developer, saya ingin bisa menjalankan migration database dan memiliki Prisma client yang siap digunakan.  
**Acceptance Criteria:**

1. Migration berhasil dijalankan
2. Prisma client ter-generate dengan benar
3. Database connection berfungsi
4. Seed data untuk development tersedia

**Implementation Details:**

1. Jalankan initial migration:

   ```bash
   npx prisma migrate dev --name init_user_management
   npx prisma generate
   ```

2. Buat Prisma client utility:

   ```typescript
   // src/lib/prisma.ts
   import { PrismaClient } from "@prisma/client";

   const globalForPrisma = globalThis as unknown as {
     prisma: PrismaClient | undefined;
   };

   export const prisma =
     globalForPrisma.prisma ??
     new PrismaClient({
       log:
         process.env.NODE_ENV === "development"
           ? ["query", "error", "warn"]
           : ["error"],
     });

   if (process.env.NODE_ENV !== "production") {
     globalForPrisma.prisma = prisma;
   }
   ```

3. Buat seed script untuk development data

**Files to Create/Modify:**

- `apps/api-gateway/src/lib/prisma.ts` (create)
- `apps/api-gateway/prisma/migrations/` (auto-generated)
- `apps/api-gateway/prisma/seeds/init.ts` (create)

**Estimated Time:** 3 hours  
**Priority:** High  
**Dependencies:** TKT-002  
**Test Requirements:** Test connection dengan script test-db

---

## **Phase 2: Authentication System**

### **TKT-004: User Registration Endpoint**

**Title:** Implement User Registration API  
**User Story:** Sebagai user baru, saya ingin bisa register akun dengan email dan password agar bisa mengakses sistem.  
**Acceptance Criteria:**

1. POST `/api/auth/register` endpoint bekerja
2. Validasi input: email format, password strength
3. Hash password dengan bcrypt sebelum simpan
4. Generate verification token untuk email
5. Return JWT token setelah registrasi sukses

**Implementation Details:**

1. Buat route handler di `src/modules/auth/routes/register.ts`:

   ```typescript
   import { FastifyRequest, FastifyReply } from "fastify";
   import { z } from "zod";
   import bcrypt from "bcrypt";
   import { prisma } from "../../../lib/prisma";

   const registerSchema = z.object({
     email: z.string().email(),
     username: z.string().min(3).max(30),
     password: z.string().min(8),
     fullName: z.string().optional(),
   });

   export async function registerHandler(
     request: FastifyRequest,
     reply: FastifyReply,
   ) {
     const { email, username, password, fullName } = registerSchema.parse(
       request.body,
     );

     // Check if user exists
     const existingUser = await prisma.user.findFirst({
       where: { OR: [{ email }, { username }] },
     });

     if (existingUser) {
       return reply.status(400).send({ error: "User already exists" });
     }

     // Hash password
     const passwordHash = await bcrypt.hash(password, 10);

     // Create user
     const user = await prisma.user.create({
       data: {
         email,
         username,
         passwordHash,
         fullName,
         status: "PENDING",
       },
     });

     // Generate JWT token
     const token = request.jwt.sign({ userId: user.id, email: user.email });

     return reply.status(201).send({
       user: {
         id: user.id,
         email: user.email,
         username: user.username,
         fullName: user.fullName,
       },
       token,
     });
   }
   ```

2. Register route di Fastify server

**Files to Create/Modify:**

- `apps/api-gateway/src/modules/auth/routes/register.ts` (create)
- `apps/api-gateway/src/modules/auth/routes/index.ts` (create)
- `apps/api-gateway/src/server.ts` (modify)

**Estimated Time:** 4 hours  
**Priority:** High  
**Dependencies:** TKT-003  
**Test Requirements:** Unit tests untuk validation, integration test untuk endpoint

---

### **TKT-005: User Login & JWT Authentication**

**Title:** Implement Login with JWT Token Generation  
**User Story:** Sebagai registered user, saya ingin bisa login dengan email/password dan mendapatkan JWT token untuk mengakses API.  
**Acceptance Criteria:**

1. POST `/api/auth/login` endpoint bekerja
2. Validasi credentials
3. Generate access token dan refresh token
4. Update lastLogin timestamp
5. Rate limiting untuk failed attempts

**Implementation Details:**

1. Buat login handler dengan bcrypt password verification
2. Implement JWT token generation dengan configurable expiration
3. Buat refresh token mechanism
4. Add rate limiting dengan `@fastify/rate-limit`

**Files to Create/Modify:**

- `apps/api-gateway/src/modules/auth/routes/login.ts` (create)
- `apps/api-gateway/src/modules/auth/services/jwt.service.ts` (create)
- `apps/api-gateway/src/modules/auth/middleware/rate-limit.ts` (create)

**Estimated Time:** 5 hours  
**Priority:** High  
**Dependencies:** TKT-004  
**Test Requirements:** Authentication tests, token validation tests

---

### **TKT-006: Logout & Token Management**

**Title:** Implement Logout and Token Invalidation  
**User Story:** Sebagai logged in user, saya ingin bisa logout dan token saya di-invalidate agar tidak bisa digunakan lagi.  
**Acceptance Criteria:**

1. POST `/api/auth/logout` endpoint bekerja
2. Token di-blacklist atau di-invalidate
3. Session dihapus dari database
4. Refresh token juga di-invalidate

**Implementation Details:**

1. Implement token blacklist dengan Redis atau database table
2. Buat session management system
3. Add logout handler yang membersihkan semua sessions user

**Files to Create/Modify:**

- `apps/api-gateway/src/modules/auth/routes/logout.ts` (create)
- `apps/api-gateway/src/modules/auth/services/session.service.ts` (create)
- `apps/api-gateway/src/modules/auth/middleware/token-blacklist.ts` (create)

**Estimated Time:** 3 hours  
**Priority:** High  
**Dependencies:** TKT-005  
**Test Requirements:** Session management tests, token invalidation tests

---

## **Phase 3: User Management (CRUD)**

### **TKT-007: User CRUD Operations - List & Get**

**Title:** Implement User Listing and Detail Endpoints  
**User Story:** Sebagai admin, saya ingin bisa melihat list semua users dan detail user tertentu untuk management purposes.  
**Acceptance Criteria:**

1. GET `/api/users` dengan pagination, filtering, sorting
2. GET `/api/users/:id` untuk user detail
3. Authorization: hanya admin yang bisa akses semua users
4. Response format konsisten dengan pagination metadata

**Implementation Details:**

1. Buat user service dengan methods: `findAll`, `findById`, `count`
2. Implement pagination dengan Prisma `skip` dan `take`
3. Add filtering by status, role, department
4. Add sorting by createdAt, email, etc.

**Files to Create/Modify:**

- `apps/api-gateway/src/modules/users/routes/list.ts` (create)
- `apps/api-gateway/src/modules/users/routes/detail.ts` (create)
- `apps/api-gateway/src/modules/users/services/user.service.ts` (create)
- `apps/api-gateway/src/modules/users/validators/user.validator.ts` (create)

**Estimated Time:** 6 hours  
**Priority:** Medium  
**Dependencies:** TKT-006, TKT-010 (auth middleware)  
**Test Requirements:** Pagination tests, filtering tests, authorization tests

---

### **TKT-008: User CRUD Operations - Create & Update**

**Title:** Implement User Creation and Update Endpoints  
**User Story:** Sebagai admin, saya ingin bisa create user baru dan update existing user data.  
**Acceptance Criteria:**

1. POST `/api/users` untuk create new user
2. PUT `/api/users/:id` untuk update user
3. PATCH `/api/users/:id/status` untuk toggle active/inactive
4. Validation untuk semua input fields
5. Audit log untuk semua changes

**Implementation Details:**

1. Buat create handler dengan role assignment
2. Buat update handler dengan partial updates
3. Implement soft delete untuk user deletion
4. Add audit logging untuk semua modifications

**Files to Create/Modify:**

- `apps/api-gateway/src/modules/users/routes/create.ts` (create)
- `apps/api-gateway/src/modules/users/routes/update.ts` (create)
- `apps/api-gateway/src/modules/users/routes/delete.ts` (create)
- `apps/api-gateway/src/modules/audit/services/audit.service.ts` (create)

**Estimated Time:** 5 hours  
**Priority:** Medium  
**Dependencies:** TKT-007  
**Test Requirements:** Create/update validation tests, audit log tests

---

### **TKT-009: Profile Management Endpoints**

**Title:** Implement User Profile Management  
**User Story:** Sebagai user, saya ingin bisa melihat dan update profile saya sendiri, termasuk change password.  
**Acceptance Criteria:**

1. GET `/api/profile` untuk get current user profile
2. PUT `/api/profile` untuk update own profile
3. PUT `/api/profile/password` untuk change password
4. POST `/api/profile/avatar` untuk upload profile picture
5. User hanya bisa akses profile sendiri (kecuali admin)

**Implementation Details:**

1. Buat profile route dengan authentication middleware
2. Implement password change dengan old password verification
3. Add avatar upload dengan file validation
4. Profile response tidak include sensitive data

**Files to Create/Modify:**

- `apps/api-gateway/src/modules/profile/routes/profile.ts` (create)
- `apps/api-gateway/src/modules/profile/routes/password.ts` (create)
- `apps/api-gateway/src/modules/profile/routes/avatar.ts` (create)
- `apps/api-gateway/src/modules/uploads/services/upload.service.ts` (create)

**Estimated Time:** 4 hours  
**Priority:** Medium  
**Dependencies:** TKT-008  
**Test Requirements:** Profile tests, password change tests, avatar upload tests

---

## **Phase 4: Role & Permission Management**

### **TKT-010: Authentication & Authorization Middleware**

**Title:** Implement JWT Authentication and Role-based Authorization Middleware  
**User Story:** Sebagai developer, saya ingin memiliki middleware yang bisa menangani authentication dan authorization untuk semua protected routes.  
**Acceptance Criteria:**

1. JWT authentication middleware yang validate token
2. Role-based authorization middleware
3. Permission checking middleware
4. Error handling untuk unauthorized access
5. Support untuk public routes

**Implementation Details:**

1. Buat authentication middleware:

   ```typescript
   // src/middleware/auth.middleware.ts
   export async function authenticate(
     request: FastifyRequest,
     reply: FastifyReply,
   ) {
     try {
       const token = request.headers.authorization?.replace("Bearer ", "");
       if (!token) throw new Error("No token provided");

       const decoded = request.jwt.verify<JwtPayload>(token);
       request.user = decoded;
     } catch (error) {
       return reply.status(401).send({ error: "Unauthorized" });
     }
   }
   ```

2. Buat authorization middleware dengan role checking
3. Buat permission middleware dengan granular permission checks

**Files to Create/Modify:**

- `apps/api-gateway/src/middleware/auth.middleware.ts` (create)
- `apps/api-gateway/src/middleware/roles.middleware.ts` (create)
- `apps/api-gateway/src/middleware/permissions.middleware.ts` (create)
- `apps/api-gateway/src/types/fastify.d.ts` (create) - untuk type augmentation

**Estimated Time:** 5 hours  
**Priority:** High  
**Dependencies:** TKT-005  
**Test Requirements:** Middleware tests, authorization tests

---

### **TKT-011: Role CRUD Operations**

**Title:** Implement Role Management Endpoints  
**User Story:** Sebagai admin, saya ingin bisa manage roles: create, read, update, delete.  
**Acceptance Criteria:**

1. GET `/api/roles` - list semua roles
2. GET `/api/roles/:id` - role detail dengan permissions
3. POST `/api/roles` - create new role
4. PUT `/api/roles/:id` - update role
5. DELETE `/api/roles/:id` - delete role (dengan validation)
6. System roles tidak bisa dihapus/diubah

**Implementation Details:**

1. Buat role service dengan permission assignment
2. Implement role hierarchy validation
3. Add validation untuk role creation/update
4. Prevent deletion jika role sedang digunakan

**Files to Create/Modify:**

- `apps/api-gateway/src/modules/roles/routes/` (create semua route files)
- `apps/api-gateway/src/modules/roles/services/role.service.ts` (create)
- `apps/api-gateway/src/modules/roles/validators/role.validator.ts` (create)

**Estimated Time:** 6 hours  
**Priority:** Medium  
**Dependencies:** TKT-010  
**Test Requirements:** Role CRUD tests, hierarchy validation tests

---

### **TKT-012: Permission Management System**

**Title:** Implement Permission Management and Assignment  
**User Story:** Sebagai admin, saya ingin bisa manage permissions dan assign ke roles.  
**Acceptance Criteria:**

1. GET `/api/permissions` - list semua permissions
2. GET `/api/permissions/groups` - group by module
3. POST `/api/roles/:id/permissions` - assign permissions to role
4. DELETE `/api/roles/:id/permissions/:permissionId` - remove permission
5. Permission inheritance dari parent role

**Implementation Details:**

1. Buat permission service dengan module grouping
2. Implement permission assignment dengan conditions
3. Add permission inheritance logic
4. Buat permission checking utility

**Files to Create/Modify:**

- `apps/api-gateway/src/modules/permissions/` (create semua structure)
- `apps/api-gateway/src/modules/permissions/services/permission.service.ts` (create)
- `apps/api-gateway/src/modules/permissions/utils/permission-checker.ts` (create)

**Estimated Time:** 5 hours  
**Priority:** Medium  
**Dependencies:** TKT-011  
**Test Requirements:** Permission assignment tests, inheritance tests

---

### **TKT-013: User-Role Assignment**

**Title:** Implement User to Role Assignment Endpoints  
**User Story:** Sebagai admin, saya ingin bisa assign roles ke users dan manage user roles.  
**Acceptance Criteria:**

1. POST `/api/users/:userId/roles` - assign role to user
2. DELETE `/api/users/:userId/roles/:roleId` - remove role from user
3. GET `/api/users/:userId/roles` - get user's roles
4. PATCH `/api/users/:userId/roles/primary` - set primary role
5. Validation: user exists, role exists, no duplicate assignment

**Implementation Details:**

1. Buat user-role assignment service
2. Implement primary role functionality
3. Add validation untuk role assignment constraints
4. Buat endpoint untuk bulk role assignment

**Files to Create/Modify:**

- `apps/api-gateway/src/modules/user-roles/` (create semua structure)
- `apps/api-gateway/src/modules/user-roles/services/user-role.service.ts` (create)
- `apps/api-gateway/src/modules/user-roles/routes/` (create route files)

**Estimated Time:** 4 hours  
**Priority:** Medium  
**Dependencies:** TKT-011, TKT-012  
**Test Requirements:** User-role assignment tests, primary role tests

---

## **Phase 5: Department Management**

### **TKT-014: Department CRUD Operations**

**Title:** Implement Department Management Endpoints  
**User Story:** Sebagai admin, saya ingin bisa manage departments: create, read, update, delete dengan hierarchical structure.  
**Acceptance Criteria:**

1. GET `/api/departments` - list departments dengan tree structure
2. GET `/api/departments/:id` - department detail dengan hierarchy
3. POST `/api/departments` - create new department
4. PUT `/api/departments/:id` - update department
5. DELETE `/api/departments/:id` - delete department (hanya jika empty)
6. Support untuk department hierarchy (parent-child)

**Implementation Details:**

1. Buat department service dengan tree structure management
2. Implement recursive queries untuk department hierarchy
3. Add validation untuk department operations
4. Buat utility untuk flattening tree structure

**Files to Create/Modify:**

- `apps/api-gateway/src/modules/departments/` (create semua structure)
- `apps/api-gateway/src/modules/departments/services/department.service.ts` (create)
- `apps/api-gateway/src/modules/departments/utils/tree.utils.ts` (create)

**Estimated Time:** 6 hours  
**Priority:** Medium  
**Dependencies:** TKT-013  
**Test Requirements:** Department CRUD tests, tree structure tests

---

### **TKT-015: Department-User Assignment**

**Title:** Implement User to Department Assignment  
**User Story:** Sebagai admin, saya ingin bisa assign users ke departments dan manage department membership.  
**Acceptance Criteria:**

1. POST `/api/users/:userId/departments` - assign user to department
2. DELETE `/api/users/:userId/departments/:deptId` - remove from department
3. GET `/api/departments/:id/users` - get users in department
4. GET `/api/users/:userId/departments` - get user's departments
5. Support untuk multiple departments per user

**Implementation Details:**

1. Buat department-user assignment service
2. Implement many-to-many relationship management
3. Add validation untuk department assignment
4. Buat endpoint untuk department hierarchy dengan users

**Files to Create/Modify:**

- `apps/api-gateway/src/modules/department-users/` (create structure)
- `apps/api-gateway/src/modules/department-users/services/department-user.service.ts` (create)
- `apps/api-gateway/src/modules/departments/routes/users.ts` (create)

**Estimated Time:** 4 hours  
**Priority:** Medium  
**Dependencies:** TKT-014  
**Test Requirements:** Department-user assignment tests, membership tests

---

## **Phase 6: Admin Dashboard & Analytics**

### **TKT-016: Admin Dashboard Statistics**

**Title:** Implement Admin Dashboard Statistics Endpoints  
**User Story:** Sebagai admin, saya ingin melihat dashboard statistics untuk monitoring system.  
**Acceptance Criteria:**

1. GET `/api/admin/stats` - overall system statistics
2. GET `/api/admin/stats/users` - user growth analytics
3. GET `/api/admin/stats/roles` - role distribution
4. GET `/api/admin/stats/departments` - department statistics
5. Support untuk date range filtering

**Implementation Details:**

1. Buat admin stats service dengan Prisma aggregates
2. Implement date range queries untuk analytics
3. Add caching untuk statistics data
4. Buat response format yang konsisten

**Files to Create/Modify:**

- `apps/api-gateway/src/modules/admin/routes/stats.ts` (create)
- `apps/api-gateway/src/modules/admin/services/stats.service.ts` (create)
- `apps/api-gateway/src/modules/admin/services/cache.service.ts` (create)

**Estimated Time:** 5 hours  
**Priority:** Low  
**Dependencies:** TKT-015  
**Test Requirements:** Statistics calculation tests, cache tests

---

### **TKT-017: Audit Logging System**

**Title:** Implement Comprehensive Audit Logging  
**User Story:** Sebagai admin, saya ingin melihat audit logs untuk semua admin actions untuk security monitoring.  
**Acceptance Criteria:**

1. GET `/api/admin/audit-logs` - filterable audit logs
2. Automatic logging untuk semua admin actions
3. Search by user, action type, date range
4. Export to CSV functionality
5. Real-time audit log streaming (WebSocket)

**Implementation Details:**

1. Buat audit log service dengan automatic logging decorator
2. Implement audit log repository dengan filtering
3. Add CSV export functionality
4. Buat WebSocket server untuk real-time updates

**Files to Create/Modify:**

- `apps/api-gateway/src/modules/audit/` (create semua structure)
- `apps/api-gateway/src/modules/audit/decorators/audit.decorator.ts` (create)
- `apps/api-gateway/src/modules/audit/services/export.service.ts` (create)
- `apps/api-gateway/src/modules/audit/websocket/audit.ws.ts` (create)

**Estimated Time:** 6 hours  
**Priority:** Low  
**Dependencies:** TKT-016  
**Test Requirements:** Audit log tests, export tests, WebSocket tests

---

## **Phase 7: Advanced Features**

### **TKT-018: Bulk Operations**

**Title:** Implement Bulk Operations for User Management  
**User Story:** Sebagai admin, saya ingin bisa melakukan bulk operations untuk efficient user management.  
**Acceptance Criteria:**

1. POST `/api/users/bulk-import` - import users from CSV
2. POST `/api/users/bulk-assign-roles` - bulk role assignment
3. POST `/api/users/bulk-deactivate` - bulk deactivate users
4. POST `/api/users/bulk-delete` - bulk delete users
5. Async processing dengan job queue

**Implementation Details:**

1. Buat bulk operations service dengan job queue
2. Implement CSV parsing and validation
3. Add async processing dengan progress tracking
4. Buat job status monitoring endpoints

**Files to Create/Modify:**

- `apps/api-gateway/src/modules/bulk/` (create structure)
- `apps/api-gateway/src/modules/bulk/services/bulk.service.ts` (create)
- `apps/api-gateway/src/modules/bulk/services/csv.service.ts` (create)
- `apps/api-gateway/src/modules/bulk/queues/bulk.queue.ts` (create)

**Estimated Time:** 8 hours  
**Priority:** Low  
**Dependencies:** TKT-017  
**Test Requirements:** Bulk operation tests, CSV parsing tests

---

### **TKT-019: Advanced Search & Filtering**

**Title:** Implement Advanced Search for Users and Entities  
**User Story:** Sebagai admin, saya ingin bisa search users dengan advanced filtering criteria.  
**Acceptance Criteria:**

1. Advanced search untuk users dengan multiple criteria
2. Full-text search untuk name, email, username
3. Filter by role, department, status, date ranges
4. Sorting dengan multiple columns
5. Export search results to CSV/PDF

**Implementation Details:**

1. Buat search service dengan Prisma query builder
2. Implement full-text search dengan PostgreSQL features
3. Add dynamic filtering berdasarkan query parameters
4. Buat export functionality untuk search results

**Files to Create/Modify:**

- `apps/api-gateway/src/modules/search/` (create structure)
- `apps/api-gateway/src/modules/search/services/search.service.ts` (create)
- `apps/api-gateway/src/modules/search/builders/query.builder.ts` (create)
- `apps/api-gateway/src/modules/search/routes/users.search.ts` (create)

**Estimated Time:** 7 hours  
**Priority:** Low  
**Dependencies:** TKT-018  
**Test Requirements:** Search functionality tests, filter tests

---

## **Phase 8: Testing & Documentation**

### **TKT-020: Comprehensive Test Suite**

**Title:** Implement Complete Test Suite for All Modules  
**User Story:** Sebagai developer, saya ingin memiliki comprehensive test suite untuk memastikan code quality dan prevent regressions.  
**Acceptance Criteria:**

1. Unit tests untuk semua services (>80% coverage)
2. Integration tests untuk semua endpoints
3. E2E tests untuk critical user flows
4. Load testing untuk performance critical endpoints
5. Security testing untuk authentication/authorization

**Implementation Details:**

1. Setup Jest dengan Prisma mock
2. Buat test factories untuk test data
3. Implement test suites untuk setiap module
4. Add performance testing dengan k6 atau artillery

**Files to Create/Modify:**

- `apps/api-gateway/jest.config.js` (create)
- `apps/api-gateway/tests/` (create semua test structure)
- `apps/api-gateway/tests/factories/` (create test factories)
- `apps/api-gateway/tests/setup.ts` (create)
- `apps/api-gateway/load-tests/` (create load tests)

**Estimated Time:** 10 hours  
**Priority:** Medium  
**Dependencies:** Semua tickets sebelumnya  
**Test Requirements:** Test coverage reports, performance benchmarks

---

### **TKT-021: API Documentation**

**Title:** Create Comprehensive API Documentation  
**User Story:** Sebagai developer/consumer, saya ingin memiliki API documentation yang lengkap untuk memahami semua endpoints.  
**Acceptance Criteria:**

1. OpenAPI/Swagger documentation untuk semua endpoints
2. API versioning documentation
3. Authentication/authorization documentation
4. Error codes and responses documentation
5. Rate limit documentation

**Implementation Details:**

1. Setup @fastify/swagger untuk OpenAPI documentation
2. Annotate semua routes dengan JSDoc comments
3. Generate OpenAPI spec secara otomatis
4. Buat API documentation website

**Files to Create/Modify:**

- `apps/api-gateway/src/plugins/swagger.ts` (create)
- `apps/api-gateway/src/docs/` (create documentation)
- `apps/api-gateway/scripts/generate-docs.ts` (create)
- `apps/api-gateway/public/docs/` (create static docs)

**Estimated Time:** 6 hours  
**Priority:** Medium  
**Dependencies:** TKT-020  
**Test Requirements:** Documentation generation tests

---

## **Phase 9: Deployment & Monitoring**

### **TKT-022: Production Deployment Setup**

**Title:** Setup Production Deployment Configuration  
**User Story:** Sebagai DevOps engineer, saya ingin memiliki deployment configuration yang siap untuk production.  
**Acceptance Criteria:**

1. Docker configuration untuk production
2. Kubernetes manifests (optional)
3. Environment configuration management
4. Database migration automation
5. Health check endpoints

**Implementation Details:**

1. Buat Dockerfile untuk production
2. Setup docker-compose untuk local development
3. Buat Kubernetes deployment manifests
4. Implement health check endpoints
5. Setup database migration scripts

**Files to Create/Modify:**

- `apps/api-gateway/Dockerfile` (create)
- `apps/api-gateway/docker-compose.yml` (create)
- `apps/api-gateway/k8s/` (create manifests)
- `apps/api-gateway/src/routes/health.ts` (create)
- `apps/api-gateway/scripts/migrate.ts` (create)

**Estimated Time:** 5 hours  
**Priority:** Low  
**Dependencies:** TKT-021  
**Test Requirements:** Docker build tests, health check tests

---

## **Summary**

**Total Tickets:** 22 tickets  
**Total Estimated Time:** ~100-120 hours  
**Team Capacity:** 2-3 developers working in parallel

### **Parallel Work Streams:**

1. **Stream A (Backend Core):** TKT-001 → TKT-003 → TKT-004 → TKT-005 → TKT-006 → TKT-010
2. **Stream B (User Management):** TKT-007 → TKT-008 → TKT-009 → TKT-013 → TKT-014 → TKT-015
3. **Stream C (Role/Permissions):** TKT-011 → TKT-012 → TKT-016 → TKT-017
4. **Stream D (Advanced Features):** TKT-018 → TKT-019 → TKT-020 → TKT-021 → TKT-022

### **Critical Path:**

TKT-001 → TKT-002 → TKT-003 → TKT-004 → TKT-005 → TKT-010 → TKT-007 → TKT-011

### **Success Criteria:**

1. ✅ All 22 tickets completed
2. ✅ Test coverage > 80%
3. ✅ API documentation complete
4. ✅ Production deployment ready
5. ✅ Performance benchmarks met
6. ✅ Security audit passed

---

## **Progress Tracking Template**

| Ticket ID | Title                   | Status | Assigned To | Start Date | End Date | Notes |
| --------- | ----------------------- | ------ | ----------- | ---------- | -------- | ----- |
| TKT-001   | Setup Project Structure | TODO   |             |            |          |       |
| TKT-002   | Design Prisma Schema    | TODO   |             |            |          |       |
| TKT-003   | Database Migration      | TODO   |             |            |          |       |
| ...       | ...                     | ...    | ...         | ...        | ...      | ...   |
| TKT-022   | Production Deployment   | TODO   |             |            |          |       |

**Status Codes:** TODO → IN_PROGRESS → CODE_REVIEW → TESTING → DONE → BLOCKED
