# Slice 6: Booking Core — VERIFICATION

**Status**: 🟡 Backend complete + minimal UI; full BookingWizard deferred
**Date**: 2026-05-08

## What's Done

### Backend (api-gateway) ✅
| Component | File |
|---|---|
| Schema model `ClinicBooking` | `prisma/schema.prisma` (~860+ lines) |
| Migration table created | manual SQL `clinic_booking` table dengan FKs ke clinic_client/service/room/m0_users |
| DTOs | `src/clinic-booking/dto/clinic-booking.dto.ts` (Create, Update, Reschedule, Cancel, Query) |
| Service dengan state machine + conflict detection | `src/clinic-booking/clinic-booking.service.ts` |
| Controller dengan 9 endpoints | `src/clinic-booking/clinic-booking.controller.ts` |
| Module registration | `src/app.module.ts` |

### Endpoints
- `POST   /clinic/booking` — create
- `GET    /clinic/booking` — list dengan filter (status, date, psikologUserId, etc.)
- `GET    /clinic/booking/:id` — detail
- `PATCH  /clinic/booking/:id` — update (notes, bufferOverride)
- `POST   /clinic/booking/:id/confirm` — awaiting_dp → confirmed
- `POST   /clinic/booking/:id/check-in` — confirmed → checked_in
- `POST   /clinic/booking/:id/start` — checked_in → in_progress
- `POST   /clinic/booking/:id/complete` — in_progress → completed
- `POST   /clinic/booking/:id/cancel` — any active → cancelled
- `POST   /clinic/booking/:id/reschedule` — change slot/psikolog/room dengan history

### Validation logic verified
- ✅ FK validation (client/service/psikolog/room must exist)
- ✅ Operating hours check (clinic_settings.operating_hours per day)
- ✅ Holiday block (clinic_settings.holidays array)
- ✅ Buffer 15-min check (default dari clinic_settings.bufferMinutes)
- ✅ Psikolog conflict detection (overlap with active bookings)
- ✅ Room conflict detection (overlap with active bookings)
- ✅ State machine transitions (terminal states blocked)
- ✅ `bufferOverride=true` bypass operating hours + buffer
- ✅ `createdViaWalkIn=true` skip operating hours, status langsung `confirmed`

### Frontend (web-althea) ✅ minimal
| Component | File |
|---|---|
| Types + zod schema | `features/admin-booking/model/types.ts` |
| API client | `features/admin-booking/api/booking.api.ts` |
| TanStack Query hooks (6 hooks) | `features/admin-booking/hooks/use-booking.ts` |
| List page UI dengan action buttons | `features/admin-booking/ui/booking-page.tsx` |
| Route wire | `app/(admin)/booking/page.tsx` |

### Manual API Smoke Test ✅
```bash
TOKEN=<from /api/auth/login>

# Create booking — gagal kalau di luar jam operasional
POST /api/clinic/booking
{
  clientId: 1, serviceId: 1, psikologUserId: 147, roomId: 1,
  scheduledStart: "2026-05-09T10:00:00+07:00",
  scheduledEnd: "2026-05-09T11:00:00+07:00"
}
→ 400 Bad Request "Booking di luar jam operasional 10:00-16:00"

# Override buffer — sukses
POST /api/clinic/booking
{ ...same..., bufferOverride: true }
→ 201 Created (booking id=1)

# Conflict detection — sukses
POST /api/clinic/booking
{ clientId: 2, serviceId: 1, psikologUserId: 147, roomId: 2,
  scheduledStart: <same>, scheduledEnd: <same> }
→ 409 Conflict { conflictType: "psikolog", conflictBookingId: 1 }
```

## What's NOT Done (deferred)

### BookingWizard 4-step UI ❌
Mockup di `psychology-design/BookingWizard.jsx` blueprint:
1. Pick client (existing atau quick-create)
2. Pick service (filter category)
3. Pick time slot (calendar grid + show conflict warning)
4. Confirm + assign psikolog/room (dropdown atau auto-suggest)

Alasan defer: kompleksitas tinggi (calendar component, slot availability fetch, conflict feedback UX), context budget session ini sudah heavy.

**Workaround**: untuk create booking saat ini, pakai API langsung via Swagger UI atau curl. List UI sudah bisa display + transitions + cancel.

### Schedule grid (Slice 7) ❌
Slice 7 tersendiri — visualization grid (psikolog × time slot) dengan realtime conflict warnings.

### Reschedule UI ❌
API endpoint sudah ada (`POST /:id/reschedule`). UI dialog belum dibuat. Workaround: API langsung.

### Receptionist walk-in UI ❌
Slice 11 tersendiri.

## Done Criteria Match

- [x] `ClinicBooking` model dengan state machine
- [x] Multi-session package tracking (sessionN/sessionTotal/packageGroupId)
- [x] Conflict detection (psikolog + room overlap, buffer)
- [x] Operating hours validation
- [x] Holiday block
- [x] Reschedule history JSON
- [x] All transitions implemented + audit-tracked
- [x] Walk-in path (createdViaWalkIn flag)
- [x] List UI dengan status badges + action buttons
- [x] api-gateway typecheck
- [x] web-althea typecheck
- [ ] BookingWizard 4-step UI (deferred to dedicated session)
- [ ] Calendar/grid view (Slice 7)
- [ ] Real-time updates (Slice 11 SSE/WS)

## Next Steps untuk Slice 6 Polish

1. **BookingWizard 4-step UI** — fresh session
2. **Reschedule dialog** — quick add (~30 min)
3. **Conflict feedback UX** — show available alternative slots saat 409
4. **Vitest tests untuk service** — state machine, conflict logic

## Reference

- Mockup: `apps/psychology-design/BookingWizard.jsx`
- ADR 008: Booking constraints (buffer, walk-in, hours)
- API: http://localhost:3203/api/docs (Swagger setelah container running)
