# Slice 06: booking-core — SPEC

**Status**: 🟢 Done (delivered + extended via post-MVP iterations)
**Last revised**: 2026-05-11

## Goal

Backend + frontend untuk **booking sesi psikolog** end-to-end: state machine, conflict detection, multi-session package, single-page wizard yang scalable + audit-friendly.

## Acceptance Criteria

### Backend (`apps/api-gateway/src/clinic-booking/`)

- [x] `ClinicBooking` model dengan state machine 5 status (`awaiting_dp → confirmed → checked_in → in_progress → completed`, plus `cancelled` terminal)
- [x] CRUD endpoints (`POST/GET/PATCH /clinic/booking`)
- [x] State transition endpoints (`POST /clinic/booking/:id/{confirm,check-in,start,complete,cancel,reschedule}`)
- [x] Idempotency interceptor di `POST` (booking + package + payment) — dedup via `Idempotency-Key` header (24h cache via `clinic_idempotency_key` table)
- [x] Multi-session package endpoint (`POST /clinic/booking/package`) — atomic transaction, cross-session conflict check, all-or-nothing
- [x] Validation cascade (lihat ADR 008 + ADR 010):
  - `assertEntitiesExist` — FK + active flag
  - `assertNoConflict` — psikolog/room overlap dengan buffer (default 15min)
  - `assertSlotMatch` — start/end pas dengan `slotsOfDay` (TZ klinik); cek `closedDayOfWeek` + `holidays`
  - `assertPsikologAvailable` — override > weekly cascade (ADR 010)
- [x] `bufferOverride: true` skip validasi 2-4 (untuk walk-in darurat) — audit-logged
- [x] Reschedule history di `clinic_booking.reschedule_history` JSON array
- [x] Audit log auto-track via `@AuditAction` decorator + interceptor

### Frontend (`apps/web-althea/features/admin-booking/`)

- [x] **BookingWizard** — single-page form (post-MVP refactor from 4-step modal, lihat ADR 011)
  - 4 section visible scrollable: Klien → Layanan → Psikolog → Jadwal+Ruang
  - Auto-scroll cascade saat user pick di section
  - Section di-disable kalau prereq belum terpenuhi
- [x] **PackageWizard** — dialog terpisah untuk package booking (sessionCount > 1)
  - Auto-generate N session row + interval helper
  - 409 conflict UX
- [x] **BookingDetailDialog** — 4 tab: detail / catatan / payment / history
- [x] **RescheduleDialog** — pindah slot/psikolog/room dengan WA notif auto-fire
- [x] **BookingPage** (`/admin/booking`) — list table + filter + 2 tombol "Booking Baru" / "Paket"
- [x] Filter psikolog by service (junction `ClinicPsikologService`)
- [x] Slot picker hanya tampil yang available (intersection: bookings + weekly + override)
- [x] Override checkbox dengan helper text action-oriented

## Schema

```prisma
model ClinicBooking {
  id                Int       @id @default(autoincrement())
  clientId          Int
  serviceId         Int
  psikologUserId    Int
  roomId            Int
  scheduledStart    DateTime  @db.Timestamptz(3)
  scheduledEnd      DateTime  @db.Timestamptz(3)
  sessionN          Int       @default(1)
  sessionTotal      Int       @default(1)
  packageGroupId    String?
  status            String    @default("awaiting_dp")
  bufferOverride    Boolean   @default(false)
  createdViaWalkIn  Boolean   @default(false)
  confirmedAt       DateTime? @db.Timestamptz(3)
  checkedInAt       DateTime? @db.Timestamptz(3)
  startedAt         DateTime? @db.Timestamptz(3)
  completedAt       DateTime? @db.Timestamptz(3)
  cancelledAt       DateTime? @db.Timestamptz(3)
  cancelReason      String?
  rescheduleHistory Json      @default("[]")
  notes             String?

  client   ClinicClient
  service  ClinicService
  psikolog User           @relation("BookingPsikolog")
  room     ClinicRoom
  payment  ClinicPayment?

  @@index([scheduledStart, scheduledEnd])
  @@index([psikologUserId, scheduledStart])
  @@index([roomId, scheduledStart])
  @@index([status])
  @@index([packageGroupId])
}
```

## State machine

```
[create]
   ↓
awaiting_dp ──→ confirmed ──→ checked_in ──→ in_progress ──→ completed
   ↓               ↓               ↓               ↓
cancelled       cancelled       cancelled       cancelled (rare)
                   ↓
              (reschedule = update slot + reset to confirmed)
```

Walk-in: skip `awaiting_dp` → langsung `confirmed`.

## Modules

```
apps/api-gateway/src/clinic-booking/
├── booking-validation.service.ts   # FK + conflict + slot + availability
├── booking-package.service.ts      # multi-session atomic create
├── booking-events.service.ts       # SSE pub-sub (Slice 11)
├── booking-notes.service.ts        # clinical notes CRUD
├── booking-notification.service.ts # WA dispatch hooks
├── booking-reminder.scheduler.ts   # @Cron H-1 + 30-min reminders
├── booking-stream.controller.ts    # SSE endpoint
├── clinic-booking.controller.ts    # main REST
├── clinic-booking.service.ts       # orchestrator
├── timezone.util.ts                # TZ helper (Asia/Jakarta)
└── dto/clinic-booking.dto.ts

apps/web-althea/features/admin-booking/
├── api/, hooks/, model/
└── ui/
    ├── booking-page.tsx, booking-detail-dialog.tsx
    ├── booking-wizard.tsx           # orchestrator
    ├── booking-wizard/{step1-client,step2-service,step3-psikolog,step4-schedule-room,use-wizard-state}.tsx
    ├── package-wizard.tsx
    └── reschedule-dialog.tsx
```

## Endpoints

```
POST   /api/clinic/booking                    # supports Idempotency-Key
POST   /api/clinic/booking/package
GET    /api/clinic/booking[?status=&date=&psikologUserId=&clientId=&roomId=]
GET    /api/clinic/booking/:id
PATCH  /api/clinic/booking/:id
POST   /api/clinic/booking/:id/{confirm,check-in,start,complete,cancel,reschedule}
POST   /api/clinic/booking/:id/note           # psikolog only
GET    /api/clinic/booking/:id/note
POST   /api/clinic/booking/:id/send-reminder  # manual WA
GET    /api/clinic/stream/booking             # SSE
```

## Related ADRs

- ADR 007 — pricing & DP model
- ADR 008 — booking constraints (slot, walk-in, override; buffer dihapus)
- ADR 010 — psikolog availability + service junction
- ADR 011 — booking wizard UX (single-page)

## Post-MVP iterations

- 2026-05-09 — Master slot system (replace `operatingHours`), reorder wizard (Klien→Layanan→**Psikolog**→Jadwal+Ruang), slot picker filter
- 2026-05-10 — Single-page form refactor (drop step nav), DateStrip horizontal, hide unavailable slots, override action-oriented copy
- 2026-05-11 — TZ helper validation (Asia/Jakarta), psikolog filter by service junction
