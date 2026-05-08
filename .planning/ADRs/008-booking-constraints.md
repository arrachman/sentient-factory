# ADR 008: Booking Constraints — Buffer, Walk-in, Operating Hours

**Status**: Accepted
**Date**: 2026-05-08
**Deciders**: User + Claude Code

## Context

Booking system perlu constraints untuk prevent conflict + accommodate operational needs.

User decisions confirmed:
- Working hours uniform (jam buka klinik berlaku semua psikolog)
- Buffer 15 menit antar sesi (default)
- Back-to-back OK kalau psikolog setuju (admin override)
- Walk-in allowed (resepsionis quick-book)
- Reschedule fleksibel (no H-1 deadline)

## Decision

### A. Working Hours (Clinic-wide)

Stored di `clinic_settings`:
```prisma
model ClinicSettings {
  // ...
  operatingHours Json   @default("{...}") @map("operating_hours")
  timezone       String @default("Asia/Jakarta")
  holidays       Json   @default("[]")
  bufferMinutes  Int    @default(15) @map("buffer_minutes")
  // ...
}
```

Format `operatingHours`:
```json
{
  "monday":    { "open": "09:00", "close": "18:00", "isOpen": true },
  "tuesday":   { "open": "09:00", "close": "18:00", "isOpen": true },
  "wednesday": { "open": "09:00", "close": "18:00", "isOpen": true },
  "thursday":  { "open": "09:00", "close": "18:00", "isOpen": true },
  "friday":    { "open": "09:00", "close": "18:00", "isOpen": true },
  "saturday":  { "open": "10:00", "close": "16:00", "isOpen": true },
  "sunday":    { "open": null, "close": null, "isOpen": false }
}
```

Booking di luar jam: blocked kecuali admin override (audit-logged).

### B. Buffer time

Default `bufferMinutes: 15`. Implementation:
- Schedule grid: visual gap 15-min antar booking
- Conflict detection: 2 booking berturut harus min 15 min jeda
- Override per-booking via `bufferOverride` flag (admin enable saat psikolog approve)

```prisma
model ClinicBooking {
  // ...
  bufferOverride Boolean @default(false) @map("buffer_override")
  // kalau true: skip buffer check di conflict detection
}
```

### C. Walk-in support

Resepsionis bisa quick-book on-the-spot:
- Required: client (existing/quick-create), service, psikolog available, room available
- Skip: long-form wizard (langsung create dengan defaults)
- Status: `confirmed` langsung (bypass `awaiting_dp` kalau bayar cash)
- Audit: `created_via_walk_in: true`

UI: tombol "Walk-in Booking" di `(resepsionis)/dashboard` (Slice 11).

### D. Reschedule rules

- **Fleksibel**: tidak ada deadline H-1
- Bisa reschedule kapan saja (sebelum sesi mulai)
- History disimpan di `clinic_booking.reschedule_history` (JSON array)
- Setiap reschedule trigger WA template `reschedule` ke client + psikolog
- Setelah `in_progress`: cannot reschedule, hanya cancel

### E. Conflict detection rules

Validate saat create/update booking:
1. **Psikolog conflict**: tidak ada booking lain di slot waktu sama (kecuali `bufferOverride=true`)
2. **Room conflict**: tidak ada booking lain di room sama
3. **Operating hours**: dalam jam operasional (kecuali admin override)
4. **Holiday block**: kalau di `holidays`, blocked (kecuali admin override)
5. **Past time**: tidak boleh book di waktu lewat (kecuali walk-in untuk current time)

Conflict response: 422 dengan detail di body.

### F. Booking status lifecycle

```
[no booking]
    ↓ (create)
awaiting_dp ──→ confirmed ──→ checked_in ──→ in_progress ──→ completed
    ↓                ↓               ↓               ↓
cancelled       cancelled      cancelled      cancelled (rare)
                    ↓
              rescheduled (back to confirmed)
```

States:
- `awaiting_dp` — DP belum dibayar
- `confirmed` — DP masuk
- `checked_in` — resepsionis check-in (Slice 11)
- `in_progress` — sesi mulai
- `completed` — psikolog mark complete (Slice 10)
- `cancelled` — explicit cancel
- `rescheduled` — temporary state (immediately back ke confirmed)

## Consequences

### Positive
- Realistic operational fit
- Safe defaults dengan explicit override
- Clear lifecycle state machine
- Audit-friendly (reschedule history + per-state log)

### Negative
- Walk-in flow complexity (quick-create client + skip wizard)
- No reschedule deadline → bisa abuse, mitigated via audit monitoring
- Override mechanism perlu discipline

## Implementation timeline

- **Slice 6** (Booking core): state machine + conflict detection + buffer
- **Slice 7** (Schedule grid): visualize buffer + conflict warnings
- **Slice 11** (Receptionist): walk-in flow + check-in transition

## Reference

- `apps/psychology-design/JAWABAN-PERTANYAAN-KLIEN-2026-05-07.md`
- `apps/psychology-design/BookingWizard.jsx`
- `apps/psychology-design/AdminDialogs3.jsx` — reschedule dialog
