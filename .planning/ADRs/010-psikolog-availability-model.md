# ADR 010: Psikolog Availability Model — Weekly + Date Override + Service Junction

**Status**: Accepted
**Date**: 2026-05-10 (revised 2026-05-11)
**Deciders**: User + Claude Code

## Context

ADR 008 set master slot klinik (6 slot/hari WIB). Tapi belum ada model untuk:

1. **Kapan psikolog praktik** — psikolog Vina mungkin Sen-Jum saja, Diah cuma Sabtu pagi
2. **Override per-tanggal** — cuti, makeup session, jadwal khusus 1 hari
3. **Layanan apa yang dia handle** — specialist anak hanya konseling/terapi anak

Kalau semua psikolog dianggap available di semua slot setiap hari, admin bisa salah booking psikolog yang sebenernya libur → klien datang → psikolog tidak ada → reputasi rusak.

User explicit request: *"psikolog harus menentukan jam availablenya dulu"* + *"1 psikolog bisa memiliki lebih dari 1 layanan"*.

## Decision

### A. Weekly availability (recurring pattern)

JSON field di `ClinicPsikologProfile`:

```prisma
model ClinicPsikologProfile {
  // ...
  weeklyAvailability Json @default("{}") @map("weekly_availability")
}
```

Format:
```json
{
  "monday":    { "isOpen": true,  "slotIndices": [0, 1, 2, 3] },
  "tuesday":   { "isOpen": true },
  "wednesday": { "isOpen": true },
  "thursday":  { "isOpen": true },
  "friday":    { "isOpen": true },
  "saturday":  { "isOpen": false },
  "sunday":    { "isOpen": false }
}
```

Rules:
- **Empty `{}`** → psikolog belum set jadwal → **admin tidak bisa booking** (block dengan banner di booking wizard step 3)
- `isOpen: false` di suatu day → hari itu libur recurring
- `slotIndices` opsional — kalau ada, hanya slot index tsb yang available di hari itu (subset filter). Kalau tidak ada → semua slot di `slotsOfDay` available
- Migration backfill 7 psikolog existing: Sen-Jum `isOpen: true`, Sab+Min `isOpen: false`

### B. Date override (per-tanggal khusus)

Junction table untuk override 1-off (cuti, makeup, jadwal khusus):

```prisma
model ClinicPsikologDateOverride {
  id             Int      @id @default(autoincrement())
  psikologUserId Int      @map("psikolog_user_id")
  date           DateTime @db.Date   // midnight di TZ klinik
  isOpen         Boolean
  slotIndices    Json?    // null = semua slot, [] = none (kalau isOpen)
  reason         String?
  createdAt      DateTime @default(now())
  createdBy      Int?
  updatedAt      DateTime @updatedAt
  updatedBy      Int?

  @@unique([psikologUserId, date])
}
```

Use cases:
- Cuti tahunan 2026-12-25: `{ isOpen: false, reason: "cuti tahunan" }`
- Sabtu khusus 2026-05-23 (biasanya libur): `{ isOpen: true, slotIndices: [0,1], reason: "makeup session" }`
- Slot subset hari Rabu: `{ isOpen: true, slotIndices: [0, 3] }`

### C. Resolution priority

Helper backend `ClinicPsikologService.resolveAvailabilityForDate(userId, date)`:

```
1. Cek ClinicPsikologDateOverride untuk tanggal exact → kalau ada, pakai itu (priority)
2. Fallback: weeklyAvailability[dayName] dari profile
3. Empty {} → source: 'unset', isOpen: false
```

Returns `{ isOpen, slotIndices, source: 'override'|'weekly'|'unset', reason, psikologName }`.

Endpoint: `GET /clinic/psikolog/by-user/:userId/availability-for-date?date=YYYY-MM-DD` (admin/resepsionis/psikolog/owner).

### D. Service junction (psikolog ↔ service)

Junction table untuk filter psikolog by layanan yang dia handle:

```prisma
model ClinicPsikologService {
  id             Int      @id @default(autoincrement())
  psikologUserId Int
  serviceId      Int
  createdAt      DateTime @default(now())
  createdBy      Int?

  @@unique([psikologUserId, serviceId])
  @@index([serviceId])
  @@index([psikologUserId])
}
```

Behavior:
- **Empty (no row)** → psikolog handle SEMUA service (default; backward compat existing 7 psikolog)
- **Filled** → hanya handle service yang di-list

Filter logic di `booking-wizard/use-wizard-state.ts`:
```ts
const psikologListFiltered = psikologList.filter((p) => {
  const ids = p.serviceIds ?? [];
  return ids.length === 0 || ids.includes(selectedServiceId);
});
```

DTO support: `CreatePsikologDto.serviceIds?: number[]` + sync via `tx.clinicPsikologService.createMany` (create) atau `deleteMany + createMany` (update).

### E. Self-service endpoints (psikolog only)

Psikolog edit jadwal sendiri tanpa admin intervention:

| Endpoint | Purpose |
|---|---|
| `PATCH /clinic/psikolog/me/availability` | Set weeklyAvailability |
| `GET /clinic/psikolog/me/date-overrides?from=&to=` | List override |
| `POST /clinic/psikolog/me/date-overrides` | Upsert override |
| `DELETE /clinic/psikolog/me/date-overrides/:date` | Hapus override (revert ke weekly) |

UI: `/psikolog/schedule` → tombol "Set Jadwal" (dialog weekly grid) + override popover per-cell.

### F. Booking validation hook

`BookingValidationService.assertPsikologAvailable(userId, start, slotIdx?)`:

```
1. Cek override → kalau ada:
   - isOpen=false → reject (cuti)
   - slotIndices.includes(slotIdx) wajib
2. Cek weekly:
   - Empty {} → reject "belum set jadwal"
   - dayCfg.isOpen=false → reject "tidak praktik di hari X"
   - slotIndices subset check
```

Call dari `clinic-booking.service.create` + `booking-package.service` kalau `!bufferOverride`.

### G. UI gating

**Booking wizard step 3 (Psikolog)**:
- Filter `psikologList` by `serviceId` (subsection D)
- Card disabled + opacity 60% kalau `weeklyAvailability` empty (badge orange "Belum ada jadwal")
- Counter: "X dari Y psikolog menangani Konseling Anak"

**Booking wizard step 4 (Jadwal & Ruang)**:
- DateStrip 7-day horizontal (ADR 011): chip disabled kalau status ≠ `available` (klinik tutup / holiday / psikolog-off / psikolog-unset)
- Slot picker: hanya tampil slot yang lolos `unavailableSlotIdx` (intersection booking + weeklyAvailability slotIndices + override slotIndices)

## Consequences

### Positive
- Admin tidak bisa book psikolog yang libur (compile-time invariant via UI + run-time via backend)
- Override per-tanggal cover use case real klinik (cuti, makeup)
- Service filter cegah salah-match (specialist anak di-book untuk dewasa)
- Backward compatible — psikolog tanpa `serviceIds` tetap handle semua

### Negative
- 2 model availability (weekly + override) → admin perlu paham priority
- Junction sync di create/update — tambah complexity service code
- Frontend filter logic ada di hook + backend duplicate (mirror) — risk drift kalau salah satu di-edit

## Migration history

- `20260510_001_psikolog_weekly_availability` — add `weekly_availability` + backfill Sen-Jum buka
- `20260510_002_clinic_psikolog_date_override` — new junction table
- `20260511_001_psikolog_service_junction` — new junction table

## Reference

- `apps/api-gateway/src/clinic-psikolog/clinic-psikolog.service.ts` — `resolveAvailabilityForDate`, `findServiceIds`, override CRUD
- `apps/api-gateway/src/clinic-booking/booking-validation.service.ts` — `assertPsikologAvailable`
- `apps/web-althea/features/psikolog-schedule/` — set jadwal dialog + override popover
- `apps/web-althea/features/admin-psikolog/ui/psikolog-form.tsx` — section "Layanan yang ditangani"
- `apps/web-althea/features/admin-booking/ui/booking-wizard/step3-psikolog.tsx` — filter + gating
- `apps/web-althea/features/admin-booking/ui/booking-wizard/use-wizard-state.ts` — `psikologListFiltered`, `unavailableSlotIdx`
