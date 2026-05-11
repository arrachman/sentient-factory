# ADR 011: Booking Wizard UX — Single-Page Form + DateStrip + Filtered Pickers

**Status**: Accepted
**Date**: 2026-05-11
**Deciders**: User + Claude Code

## Context

Booking wizard awalnya 4-step modal dengan Next/Prev buttons (klien → layanan → jadwal → psikolog+ruang). Admin perlu **7+ klik** untuk submit 1 booking (klik field, klik Next, klik field, ...).

User feedback: *"perbaiki UXnya agar bisa input lebih cepat dan mudah, tidak perlu klik berulang"* + *"tampilkan hanya slot yang available"* + *"perbaiki pemilihan tanggal buat horizontal seperti pagination"*.

Sekaligus harus terintegrasi dengan ADR 008 (slot operasional) + ADR 010 (psikolog availability + service).

## Decision

### A. Single-page form (zero step navigation)

Hapus `WizardStepper` + `WizardFooter` step nav. Semua section visible dalam satu scrollable container.

Layout:
```
┌────────────────────────────────────────┐
│ Booking Baru                       [X] │
├────────────────────────────────────────┤
│ ┌─ 1. Klien ──────────────────┐ ✓     │
│ │ [Search klien …       ]     │       │
│ └────────────────────────────────┘     │
│ ┌─ 2. Layanan ────────────────┐ ✓     │
│ │ [Chips grid by category]     │       │
│ └────────────────────────────────┘     │
│ ┌─ 3. Psikolog ───────────────┐ ✓     │
│ │ [Card grid 2col]             │       │
│ └────────────────────────────────┘     │
│ ┌─ 4. Jadwal & Ruang ─────────┐        │
│ │ [DateStrip 7 chips]          │       │
│ │ [Slot grid available-only]   │       │
│ │ [Room dropdown]              │       │
│ │ [Override toggle]            │       │
│ │ [Catatan]                    │       │
│ └────────────────────────────────┘     │
├────────────────────────────────────────┤
│             [Batal] [Buat Booking]     │
└────────────────────────────────────────┘
```

Section card properties:
- **Header**: badge nomor + judul + ✓ hijau saat filled
- **Disabled overlay** (opacity 50% + `pointer-events-none`) kalau prereq belum terpenuhi + hint *"Pilih klien dulu"*
- **Auto-scroll cascade** via `useEffect` — saat user pick → smooth-scroll ke section berikutnya

Submit button:
- Footer hanya `[Batal] [Buat Booking]`
- `Buat Booking` disabled sampai semua required filled (clientId + serviceId + psikologUserId + roomId + slotIdx)

### B. Searchable client combobox (step 1)

Replace `<select>` dengan combobox:
- Input type-ahead filter by nama / no. WA / MRN (case-insensitive contains)
- Max 12 hasil ditampilkan (klinik bisa ratusan klien)
- Auto-focus saat dialog dibuka
- Selected klien → card hijau dengan tombol ✕ untuk ganti

Implementation: `useState` untuk query + open state, `useMemo` filter. Tidak butuh library combobox (Radix overkill untuk 1 use case).

### C. Service chip grid (step 2)

Replace `<select>` dengan chip grid grouped per kategori (Konseling / Terapi / Tes Psikologi). 1 klik = pilih, no dropdown open-close.

Order: `['konseling', 'terapi', 'tes']` (hide group kalau kosong).

### D. Psikolog filtered card grid (step 3)

Filter dari ADR 010:
- Service belum dipilih → tampil semua
- `psikolog.serviceIds === []` → handle semua → tampil
- `psikolog.serviceIds.includes(serviceId)` → tampil
- Selain itu → hidden

Counter di atas: *"X dari Y psikolog menangani **Konseling Individu Anak**"*.

Card disabled kalau `weeklyAvailability` empty (badge orange "Belum ada jadwal") — admin tidak bisa book psikolog yang belum set jadwal.

Empty state (0 psikolog cocok): banner kuning + guide ke menu Psikolog → Edit → Layanan.

### E. DateStrip horizontal pagination (step 4 — first widget)

Replace native `<input type="date">` dengan strip 7 chip tanggal:

```
┌────┬────┬────┬────┬────┬────┬────┐
│SEN │SEL │RAB │KAM │JUM │SAB │MIN │
│ 11 │ 12 │ 13 │ 14 │ 15 │ 16 │ 17 │
│hari│    │Libur│   │    │    │Tutup│
└────┴────┴────┴────┴────┴────┴────┘
  ◀  11 Mei – 17 Mei 2026  ▶
```

Color status (computed dari settings + psikolog data, **no extra API call**):

| Status | Kondisi | Warna |
|---|---|---|
| `available` | Klinik buka + psikolog praktik | Cream + hover sage |
| `klinik-closed` | `closedDayOfWeek` includes dow | Cream-100 muted, "Tutup" |
| `holiday` | `holidays` includes date | Amber-50, "Libur" |
| `psikolog-off` | `weeklyAvailability[day].isOpen = false` | Rose-50, "Libur" |
| `psikolog-unset` | `weeklyAvailability = {}` | Cream-100 muted, "Belum set" |

Selected → sage-500 putih, today → sage-300 ring.

**Disabled** untuk semua status ≠ `available` (button `disabled` + `cursor-not-allowed` + tooltip *"— tidak bisa dipilih"*). Admin tidak bisa klik tanggal libur.

Prev/Next button untuk geser minggu (state `weekOffset`).

### F. Slot picker — always hide unavailable (step 4)

Sebelumnya: 6 slot tampil semua, yang penuh strikethrough. Sekarang **filter di view layer** — hanya tampil slot yang lolos `unavailableSlotIdx`.

`unavailableSlotIdx` (di `use-wizard-state.ts`) intersection 3 sumber:
1. `psikologClosedToday` (full-day off via `resolvedAvailability.isOpen=false`) → semua slot disabled
2. `resolvedAvailability.slotIndices` subset filter (kalau set, slot di luar → disabled)
3. Booking overlap (psikolog sudah ada booking di slot tsb)

Empty state: banner kuning *"Tidak ada slot tersedia di tanggal ini. Pilih tanggal lain atau ganti psikolog. (Override hanya bypass validasi jam buka — slot yang sudah dibooking tetap tidak tampil.)"*

Override mode **tidak** lagi show semua slot — clean UX. Override tetap bypass validasi backend tapi slot picker konsisten dengan "yang clickable = yang bisa book".

### G. Room picker (step 4)

Full dropdown (`<select>`), tidak di-filter. Konflik room dicek backend (`assertNoConflict`).

Future: filter room by serviceCategory (anak → terapi anak rooms, dst).

### H. Override checkbox (step 4)

```
☐ Lewati validasi jeda & jam buka klinik
  Sistem biasanya menolak booking yang berhimpit kurang dari 15 menit
  dari sesi lain, atau di hari tutup. Centang HANYA untuk kasus khusus:
  walk-in darurat, sesi beruntun yang disengaja, atau sesi di hari libur.
  Semua override tercatat di audit log.
```

Wrap dalam card cream + border supaya stand out. Audit log auto-track via interceptor (ADR 005).

### I. Idempotency

Submit kirim `Idempotency-Key: <uuid>` header. Backend `IdempotencyInterceptor` cache response 24h supaya retry safe (network blip tidak duplicate booking). Lihat `apps/api-gateway/src/common/interceptors/idempotency.interceptor.ts`.

## File structure

```
features/admin-booking/ui/
├── booking-wizard.tsx                       # orchestrator (single-page)
└── booking-wizard/
    ├── use-wizard-state.ts                  # state hook (data fetch + memos)
    ├── step1-client.tsx                     # searchable combobox
    ├── step2-service.tsx                    # chip grid by category
    ├── step3-psikolog.tsx                   # card grid (filtered)
    └── step4-schedule-room.tsx              # DateStrip + slot + room + override
```

## Hitungan klik untuk booking biasa

- **Sebelum** (4-step wizard): 7+ klik
- **Sesudah** (single-page):  4-5 klik (klien combobox, layanan chip, psikolog card, slot button, submit)

## Consequences

### Positive
- Faster admin throughput (klinik high-volume)
- Auto-scroll → admin tidak perlu cari section berikutnya
- DateStrip + slot filter → admin lihat opsi valid saja (no trial & error)
- Backend constraint mirrored di UI → server reject jarang terjadi

### Negative
- Bigger dialog → less scannable di mobile (mitigated via overflow scroll)
- Filter logic di frontend duplicate dengan backend → risk drift kalau diubah salah satu (mitigated: backend tetap source of truth, UI hint cuma preview)
- DateStrip terbatas 7 hari/page → admin yang mau book bulan depan harus next 3-4 kali (acceptable)

## Future

- DatePicker calendar mode untuk booking jauh ke depan (toggle dari strip)
- Room filter berdasarkan service category
- Pre-fill via "Booking Ulang dari Klien X" shortcut

## Reference

- `apps/web-althea/features/admin-booking/ui/booking-wizard.tsx` — orchestrator
- `apps/web-althea/features/admin-booking/ui/booking-wizard/` — step components
- ADR 008 (slot operasional + validation)
- ADR 010 (psikolog availability + service junction)
- ADR 005 (audit log interceptor)
