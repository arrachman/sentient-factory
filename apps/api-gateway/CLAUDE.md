# api-gateway — Agent Guide

Backend utama Sentient Factory.

## Stack
- **NestJS 10** (Express platform), TypeScript strict.
- **Prisma 5** (PostgreSQL).
- Auth: `@nestjs/jwt` + Passport.
- Swagger: `@nestjs/swagger` (auto-generated).
- WhatsApp: `@whiskeysockets/baileys`.
- Mail: `nodemailer`.

## Port
3103 (lihat `config/ports.json` di root). Jangan hardcode — baca dari env `API_GATEWAY_PORT`.

## Perintah
```bash
npm run dev               # nest start --watch
npm run build && npm start
npm run lint && npm run typecheck && npm test
npm run db:migrate        # prisma migrate dev
npm run db:generate       # regen Prisma client (WAJIB setelah edit schema.prisma)
npm run db:seed
npm run db:studio
```

## Konvensi
- Struktur **module-based** NestJS: `src/<feature>/{controller,service,dto,module}.ts`.
- DTO pakai `class-validator` + `class-transformer`. Validasi global aktif.
- Setiap endpoint **versi** di path: `/api/v1/...`.
- Error: lempar `HttpException` turunan; jangan return `{error}` manual.
- Logger: gunakan `@sentient-factory/logger` (package), bukan `console.log`.

## Database (Prisma)
- Schema: `prisma/schema.prisma` — **SSOT**. Edit di sini, lalu `npm run db:generate`.
- Migrasi dev: `npm run db:migrate -- --name <slug>`. **Jangan** edit migrasi yang sudah dipush.
- Seed dev: `prisma/seed.ts`. Idempoten.
- Backfill scripts (`backfill-*.ts`) hanya jalan manual; jangan masukkan ke startup.

## Hal yang sering bikin masalah
- Lupa `db:generate` setelah ubah `schema.prisma` → TS error di service.
- Push migration tanpa nama → `prisma migrate dev` interaktif, gagal di CI.
- Folder `dist/`, `dist_root_*`, `node_modules.root_owned_backup_*` — **artefak**, jangan dimodif/commit.
- `temp/` dan `sql-templates/` — scratchpad; jangan import dari `src/`.

## Testing
- Jest (`*.spec.ts`). Pakai `Test.createTestingModule` dari `@nestjs/testing`.
- Integrasi DB → pakai schema test terpisah, bukan mock Prisma client.

## Jangan disentuh tanpa diminta
- `prisma/migrations/` (yang sudah ada).
- File backup `*_backup_*`, `*_locked_*`.
- `reset-db.ts` — destruktif.

## Clinic domain (Althea Psychology)

Module `src/clinic-*/` adalah backend untuk app `apps/web-althea/`. ADR refs:
- ADR 003 — 6-actor role model (`clinic-admin/psikolog/owner/resepsionis/marketing/intern`)
- ADR 004 — WhatsApp via Fonnte + BullMQ retry queue
- ADR 005 — Audit log via NestJS interceptor (auto)
- ADR 007 — Pricing model (DP 50%, PPN 11%, package total)
- ADR 008 — Booking constraints (slot operasional + TZ rule)
- ADR 010 — Psikolog availability (weekly + override + service junction)
- ADR 011 — Booking wizard UX (frontend, referensi flow)

### Timezone rule (critical — ADR 008)

Container Docker biasanya `TZ=UTC`. **JANGAN pakai `start.getHours()` / `start.getDay()`** untuk validasi clinical data — clinic slot dan availability di-define di TZ klinik (default `Asia/Jakarta`).

Pakai helper di `src/clinic-booking/timezone.util.ts`:

```ts
import { localPartsInTimezone, localDateAtMidnight } from './timezone.util';

const settings = await this.prisma.clinicSettings.findFirst({ where: { id: 1 } });
const tz = settings?.timezone || 'Asia/Jakarta';

// Get dow / dateStr / hhmm di TZ klinik
const { dow, dateStr, hhmm } = localPartsInTimezone(start, tz);

// Convert YYYY-MM-DD → Date midnight di TZ klinik (untuk lookup .date column)
const dateObj = localDateAtMidnight('2026-05-12', tz);
```

Bug history: commit `14f9c49` fix booking slot 08:30 WIB salah parse jadi 01:30 UTC.

### Booking validation order

`BookingValidationService` di `src/clinic-booking/booking-validation.service.ts`:

1. `assertEntitiesExist(clientId, serviceId, psikologUserId, roomId)` — FK + active
2. `assertNoConflict({...})` — psikolog/room overlap (exact window, tanpa buffer; fitur bufferMinutes dihapus)
3. `assertSlotMatch(start, end)` — slot HH:MM exact match (TZ klinik)
4. `assertPsikologAvailable(psikologUserId, start, slotIdx?)` — weekly + override
   (skip kalau `bufferOverride: true` — flag ini skip step 2, 3, 4)

Caller: `ClinicBookingService.create` + `BookingPackageService.create`.

### WA fan-out (klien + psikolog)

`BookingNotificationService.notify(booking, templateName)` di `src/clinic-booking/booking-notification.service.ts` selalu dispatch ke `booking.client.phoneWa`, lalu dispatch kedua ke `booking.psikolog.phone` **kalau** `ClinicWaTemplate.recipients` mengandung `'psikolog'` dan psikolog punya `User.phone`. Dua jalur — error sisi psikolog di-catch terpisah (log warn), tidak block kirim ke klien. Sumber nomor psikolog: kolom `User.phone` (bukan field baru di `ClinicPsikologProfile`).

Konsekuensi untuk caller: setiap Prisma include yang nanti dipakai sebagai argumen `notify()` **wajib** select `psikolog.phone`. Sudah ada di `ClinicBookingService.includeRelations` + `BookingPackageService.includeRelations`.

**Konvensi nama variabel template:** nama psikolog selalu dikirim dengan key **`nama_psikolog`** (match placeholder `{{nama_psikolog}}` di seed `seed-clinic-wa.ts`), bukan `psikolog`. Bug history: `BookingReminderScheduler.dispatchAndMark` sempat kirim key `psikolog` → reminder H-1 & 30m menampilkan `{{nama_psikolog}}` literal. Saat menambah/ubah variabel WA, samakan key dengan placeholder di seed template.

Template baru — `Welcome Psikolog Baru` (`recipients: ['psikolog']`) — di-fire dari `ClinicPsikologService.create` saat akun psikolog dibuat dan `User.phone` ada. Setelah update seed: `npm run db:seed` di `apps/api-gateway` untuk upsert template.

### Junction tables (Althea)

| Table | Purpose | Default behavior |
|---|---|---|
| `clinic_psikolog_service` | psikolog handle service apa | Kosong = handle semua |
| `clinic_psikolog_date_override` | override jadwal per-tanggal | Lookup priority sebelum weekly |
| `clinic_idempotency_key` | dedup POST mutation | TTL 24h, cleanup via cron future |

### Self-service endpoints (psikolog only)

Prefix `/clinic/psikolog/me/*`:
- `GET /me` — own profile
- `PATCH /me` — edit subset (fullName/title/bio/color)
- `PATCH /me/availability` — set weeklyAvailability
- `GET /me/date-overrides?from=&to=`
- `POST /me/date-overrides` — upsert
- `DELETE /me/date-overrides/:date`
- `GET /me/stats` — sesi 30 hari + klien aktif

Resolve untuk booking wizard (admin-accessible):
- `GET /clinic/psikolog/by-user/:userId/availability-for-date?date=` — merge override + weekly
