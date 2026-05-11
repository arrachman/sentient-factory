# Slice 07: schedule-grid — SPEC

**Status**: 🟢 Done (delivered + extended via post-MVP UX iterations)
**Last revised**: 2026-05-11

## Goal

Visualisasi jadwal kerja **per psikolog** dalam grid Hari/Minggu/Bulan dengan **slot-based** rendering (bukan jam-based). Setiap cell punya state visual yang jelas (Berlangsung / Booked / Selesai / Tersedia / Kosong) supaya psikolog langsung tangkap distribusi sesi mereka.

## Acceptance Criteria

### Page `/psikolog/schedule`

- [x] Toolbar: tanggal navigation (← Mei 2026 →) + tombol "Hari ini" + view toggle (Hari/Minggu/Bulan) + Filter popover + tombol "Set Jadwal"
- [x] Stats badge: "X sesi terbooking" + "Y% kapasitas" (derived dari real available slots, bukan hardcoded)
- [x] Legend 5 state visual cell (sage solid → sage saturated → cream → almost-white → gray)
- [x] Footer info: "Anda hanya dapat mengubah jadwal sendiri. Untuk reschedule lintas-psikolog atau menambah klien baru, hubungi admin klinik."

### View Hari (1 day timeline)

- [x] Header dengan tanggal long format + jumlah sesi
- [x] Header badge "Cuti override" / "Jadwal khusus" kalau availability source = override
- [x] Slot rows (dari `ClinicSettings.slotsOfDay`) — biasanya 6 slot
- [x] Per cell render `SlotCell` sesuai state

### View Minggu (7 hari × N slot)

- [x] Grid statis Sen-Min (7 kolom, **bukan 6**)
- [x] Day header dengan tanggal — today highlighted ring sage-500
- [x] Slot rows dari `slotsOfDay`
- [x] Per cell render `SlotCell`
- [x] Today column subtle bg highlight

### View Bulan (calendar grid 6×7)

- [x] Day-of-week header (Sen-Min)
- [x] 42 cells (6 minggu × 7 hari)
- [x] Per cell color sesuai state (post-MVP iteration):
  - Booked (≥1 sesi) → sage saturated, intensity scale by `count / totalSlotsPerDay`
  - Tersedia (open + 0 sesi) → almost-white sage tint, label "Tersedia"
  - Kosong (closed/cuti) → gray disabled, label "Kosong"
  - Today → outline ring sage-500
  - Past empty → opacity 55%
  - Out-of-month → opacity 40%
- [x] Per cell badge bulat sage berisi sesi count + dots kategori (konseling/terapi/anak/tes)
- [x] Click cell → switch view ke Hari + scroll ke tanggal tsb

### "Set Jadwal" dialog

- [x] Tab "Jadwal Mingguan" — 7 baris (Sen-Min) × N slot grid checkbox (centang slot mana available di hari mana)
- [x] Tab "Override per Tanggal" — calendar bulanan dengan 3 mode klik (Lihat / Cuti cepat / Buka khusus)
- [x] Override popover detail: Tipe Buka/Tutup + slot picker selalu visible (default semua tercentang) + reason
- [x] List override tersimpan compact dengan delete inline

## Visual states (`SlotCell`)

| State | Background | Border | Text | Trigger |
|---|---|---|---|---|
| **Berlangsung** | `#5b8a66` sage solid | sage-700 | white badge "Berlangsung" | `status = in_progress` |
| **Booked** | `#a9c8b0` sage saturated | sage-500 | sage-900 badge "BOOKED" | `confirmed/checked_in/awaiting_dp` (future) |
| **Selesai** | `#ece6d3` cream warm | cream-400 | brown muted "SELESAI" | `completed` atau end-time < now |
| **Batal** | `#f5f2e9` cream pale | border default | fg-muted "BATAL" | `cancelled` |
| **Tersedia** | `#fafdf7` almost-white | `#7aa382` | bold sage-800 "Tersedia" | Tidak ada booking + psikolog open di slot tsb |
| **Kosong** | `#eeece6` gray disabled | `#d8d4c8` | gray "Kosong" | Psikolog libur/tutup di hari/slot itu |
| **Past empty** | tipis bg + dashed | tipis | invisible | Slot kosong di tanggal lewat |

## Data sources

- `ClinicSettings.slotsOfDay` — array slot definitions (default 6)
- `ClinicBooking` — per-day fetch via `useBookingList({ psikologUserId, date })`
- `ClinicPsikologProfile.weeklyAvailability` — recurring schedule
- `ClinicPsikologDateOverride` — per-date overrides (priority > weekly)

## Helper

`features/psikolog-schedule/model/availability.ts`:
- `resolveDayAvailability(date, weeklyAvailability, overrides) → DayAvailability` — port backend logic
- `bookingForSlot(bookings, date, slotStart, slotEnd) → Booking | null`
- `bookedTone(booking, now)` → `now | next | done | cancelled`
- `emptySlotTone({ date, slotIdx, slotEnd, availability })` → `available | libur | past`

## Modules

```
apps/web-althea/features/psikolog-schedule/
├── api/, hooks/use-psikolog-schedule.ts
├── model/
│   ├── availability.ts
│   ├── constants.ts (DAY_LABELS 7-day, SLOT_HEIGHT, ScheduleFilters)
│   └── format.ts
└── ui/
    ├── psikolog-schedule-page.tsx     # orchestrator
    ├── schedule-toolbar.tsx
    ├── schedule-legend.tsx            # 5 state legend
    ├── filter-popover.tsx
    ├── hari-view.tsx                  # 1-day timeline
    ├── week-grid.tsx                  # 7-day × N slot grid
    ├── bulan-view.tsx                 # 42-cell month with color states
    ├── slot-cell.tsx                  # universal cell (4 sub-variants)
    ├── availability-dialog.tsx        # tab orchestrator
    ├── availability-overrides-section.tsx
    └── availability-calendar.tsx      # date override calendar
```

## Related ADRs

- ADR 008 — slot operasional klinik (slotsOfDay)
- ADR 010 — psikolog availability model (weekly + override)

## Post-MVP iterations (this slice continued evolving)

- 2026-05-09 — Helper `resolveDayAvailability` + `SlotCell` 4-state component
- 2026-05-10 — Replace jam-based grid (08:00-17:00 hourly) → slot-based grid (dari `slotsOfDay`)
- 2026-05-10 — Owner dashboard derive `SLOTS_PER_DAY` from settings (no longer hardcoded 6)
- 2026-05-11 — Grid Minggu 6 hari → **7 hari penuh Sen-Min**
- 2026-05-11 — Color iterations:
  - Tersedia: dashed sage 2px → solid 1px sage
  - Libur: amber zebra stripe → flat gray disabled
  - Booked: pale sage `#cfdfd1` → saturated `#a9c8b0` (kontras tinggi vs Tersedia almost-white)
  - Emoji eksperiment (✨💤🟢📌✅) → revert ke text-only minimal
  - Copy "Libur / di luar jadwal" → "Kosong"
- 2026-05-11 — Bulan view: cell polos putih → color cell sesuai state (sage gradient by count, almost-white tersedia, gray kosong)

## Verification

Lihat `phases/07-schedule-grid/VERIFICATION.md` (kalau ada).
