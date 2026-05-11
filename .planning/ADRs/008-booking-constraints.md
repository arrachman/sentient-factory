# ADR 008: Booking Constraints — Slot Operasional, Buffer, Walk-in, Override

**Status**: Accepted (revised 2026-05-11)
**Date**: 2026-05-08, revised 2026-05-11
**Deciders**: User + Claude Code

## Context

Booking system perlu constraints untuk prevent conflict + accommodate operational needs.

User decisions confirmed:
- **Slot operasional** terdefinisi (bukan window jam-buka bebas) — booking harus pas dengan slot
- Buffer 15 menit antar sesi (default)
- Back-to-back OK kalau psikolog setuju (admin override)
- Walk-in allowed (resepsionis quick-book)
- Reschedule fleksibel (no H-1 deadline)
- **Bypass** semua validasi via single `bufferOverride` flag (audit-logged)
- **Timezone-aware**: semua HH:MM/dow comparison di TZ klinik (default `Asia/Jakarta`), bukan TZ server (container UTC)

## Decision

### A. Master Slot Operasional (revised — replaces `operatingHours`)

Sebelumnya: `operatingHours` per-day window (mis. Senin 09:00-18:00). Sekarang: **list slot terdefinisi** (mis. 6 slot 90 menit). Booking harus pas dengan salah satu slot.

```prisma
model ClinicSettings {
  // ...
  slotsOfDay      Json   @default("[]") @map("slots_of_day")
  closedDayOfWeek Json   @default("[0]") @map("closed_day_of_week")  // [0]=Minggu
  holidays        Json   @default("[]")
  bufferMinutes   Int    @default(15) @map("buffer_minutes")
  timezone        String @default("Asia/Jakarta")
  // ...
}
```

Format `slotsOfDay` (default seed mockup, klien sudah approve):
```json
[
  { "start": "08:30", "end": "10:00", "label": "Pagi 1" },
  { "start": "10:00", "end": "11:30", "label": "Pagi 2" },
  { "start": "12:00", "end": "13:30", "label": "Siang 1" },
  { "start": "13:30", "end": "15:00", "label": "Siang 2" },
  { "start": "15:15", "end": "16:45", "label": "Sore 1" },
  { "start": "16:45", "end": "18:15", "label": "Sore 2" }
]
```

`closedDayOfWeek` = day-of-week numbers (0=Minggu..6=Sabtu) yang klinik tutup. Default `[0]` (Minggu).

Editable di **`/admin/pengaturan` → tab "Slot Operasional"** (admin only).

### B. Validation flow (semua TZ-aware via `localPartsInTimezone()`)

`BookingValidationService` di `apps/api-gateway/src/clinic-booking/`:

1. **`assertEntitiesExist`** — client/service/psikolog/room exist + active
2. **`assertNoConflict`** — psikolog/room overlap dengan buffer (default 15 min)
3. **`assertSlotMatch(start, end)`**:
   - Hari tidak masuk `closedDayOfWeek` (cek pakai `dow` di TZ klinik)
   - Tanggal tidak masuk `holidays`
   - `HH:MM` start + end persis cocok salah satu `slotsOfDay`
4. **`assertPsikologAvailable(userId, start, slotIdx?)`** — lihat ADR 010

**`bufferOverride: true`** skip step 2, 3, 4 (tetap step 1). Audit-logged.

### C. Timezone rule (critical)

Container biasanya UTC. `start.getHours()` / `start.getDay()` return jam/hari di TZ server → **bug** kalau dibandingkan dengan slot list yang format-nya TZ klinik (WIB).

**Helper wajib pakai** di `apps/api-gateway/src/clinic-booking/timezone.util.ts`:

```ts
localPartsInTimezone(d: Date, tz = 'Asia/Jakarta'): { dow, dateStr, hhmm }
localDateAtMidnight(dateStr: string, tz = 'Asia/Jakarta'): Date
```

Pakai ini untuk:
- `dow` (closedDayOfWeek check, weeklyAvailability[dayName])
- `dateStr` (holidays check, ClinicPsikologDateOverride.date lookup)
- `hhmm` (slot match)

Pernah-ada bug `2026-05-12T01:30:00Z` (= 08:30 WIB) di-format `01:30` di server UTC → fixed di commit `14f9c49`.

### D. Buffer time

Default `bufferMinutes: 15`. Implementation:
- Schedule grid: visual gap 15-min antar booking
- Conflict detection: `assertNoConflict` cek overlap dengan window `[start - buffer, end + buffer]`
- Override per-booking via `bufferOverride` flag

```prisma
model ClinicBooking {
  // ...
  bufferOverride Boolean @default(false) @map("buffer_override")
}
```

### E. Walk-in support

Resepsionis bisa quick-book on-the-spot:
- Required: client (existing/quick-create), service, psikolog, room
- Status: `confirmed` langsung (bypass `awaiting_dp` kalau bayar cash)
- Audit: `created_via_walk_in: true`
- Skip slot match + operating hours (combined dengan `bufferOverride`)

### F. Reschedule rules

- **Fleksibel**: tidak ada deadline H-1
- Bisa reschedule kapan saja sebelum sesi mulai
- History di `clinic_booking.reschedule_history` (JSON array)
- Setiap reschedule trigger WA template ke client + psikolog
- Setelah `in_progress`: cannot reschedule, hanya cancel

### G. Conflict detection rules

Validate saat create/update booking:
1. **Slot match** — start/end pas dengan `slotsOfDay` (kecuali `bufferOverride`)
2. **Closed day / holiday** — block (kecuali `bufferOverride`)
3. **Psikolog conflict** — tidak ada booking lain overlap psikolog ±buffer
4. **Room conflict** — tidak ada booking lain overlap room ±buffer
5. **Psikolog availability** — sesuai jadwal mingguan + override (ADR 010)

Conflict response: `409` dengan body `{ conflictType, conflictBookingId }`.

### H. Booking status lifecycle

```
[no booking]
    ↓ (create)
awaiting_dp ──→ confirmed ──→ checked_in ──→ in_progress ──→ completed
    ↓                ↓               ↓               ↓
cancelled       cancelled      cancelled      cancelled (rare)
                    ↓
              rescheduled (back to confirmed dengan slot baru)
```

States:
- `awaiting_dp` — DP belum dibayar
- `confirmed` — DP masuk
- `checked_in` — resepsionis check-in
- `in_progress` — sesi mulai
- `completed` — psikolog mark complete
- `cancelled` — explicit cancel

## Consequences

### Positive
- Slot terdefinisi → admin & klien tahu pilihan jam yang valid (gak perlu tebak)
- Audit-friendly (override flagged, reschedule history, per-state log)
- TZ-aware → konsisten antar container & klinik location
- Single override flag → simple UX, clear mental model

### Negative
- Slot tidak fleksibel (kalau klinik mau slot custom 1-off, harus override)
- TZ helper wajib di semua validator — boilerplate (mitigated via util)
- Buffer override mechanism perlu discipline (training admin)

## Migration history

- `20260509_002_clinic_slots_of_day` — drop `operating_hours`, add `slots_of_day` + `closed_day_of_week`
- `20260510_001_psikolog_weekly_availability` — lihat ADR 010
- `20260511_001_psikolog_service_junction` — lihat ADR 010

## Reference

- `apps/api-gateway/src/clinic-booking/booking-validation.service.ts`
- `apps/api-gateway/src/clinic-booking/timezone.util.ts`
- `apps/web-althea/features/admin-pengaturan/ui/tabs/tab-slot.tsx`
- `apps/web-althea/features/admin-booking/ui/booking-wizard/` — lihat ADR 011
- `apps/psychology-design/JAWABAN-PERTANYAAN-KLIEN-2026-05-07.md`
