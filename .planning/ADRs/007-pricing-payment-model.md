# ADR 007: Pricing & Payment Model

**Status**: Accepted
**Date**: 2026-05-08
**Deciders**: User + Claude Code

## Context

Setiap layanan klinik psikologi punya pricing. PRD reference 16 service types (5 konseling + 4 terapi + 7 tes). Pasien bayar DP saat booking, lunas saat/setelah sesi.

User decisions confirmed:
- Setiap layanan punya harga fixed (rate card)
- Multi-session package punya total price (bukan per-session)
- DP minimum 50% saat booking
- Tax/PPN 11% otomatis

## Decision

### A. Service pricing model

```prisma
model ClinicService {
  id              Int     @id @default(autoincrement())
  name            String
  category        String  // 'konseling' | 'terapi' | 'tes' (enum constants)
  sessionCount    Int     @default(1) @map("session_count")
  durationMinutes Int     @map("duration_minutes")
  basePrice       Decimal @db.Decimal(12, 2) @map("base_price")
  isActive        Boolean @default(true) @map("is_active")
  // ... audit fields
  @@map("clinic_service")
}
```

**Convention**:
- `basePrice` adalah harga **paket total** (bukan per sesi)
- Single-session: `sessionCount=1`, `basePrice` = harga sesi
- Package (e.g., Terapi Anak Lengkap 10 sesi): `sessionCount=10`, `basePrice` = harga paket 10 sesi

### B. DP & Payment rules

```prisma
model ClinicPayment {
  id            Int      @id @default(autoincrement())
  bookingId     Int      @unique @map("booking_id")
  totalAmount   Decimal  @db.Decimal(12, 2) @map("total_amount")
  taxAmount     Decimal  @db.Decimal(12, 2) @map("tax_amount")
  dpAmount      Decimal  @db.Decimal(12, 2) @map("dp_amount")
  paidAmount    Decimal  @db.Decimal(12, 2) @default(0) @map("paid_amount")
  status        String   // 'pending' | 'dp_paid' | 'lunas' | 'refunded'
  dpPaidAt      DateTime? @map("dp_paid_at")
  lunasAt       DateTime? @map("lunas_at")
  paymentMethod String?   @map("payment_method")
  receiptUrl    String?   @map("receipt_url")
  notes         String?
  // ... audit fields
  booking       ClinicBooking @relation(fields: [bookingId], references: [id])
  @@map("clinic_payment")
}
```

### C. Tax calculation

PPN 11% otomatis applied:
```typescript
const basePrice = service.basePrice;
const taxAmount = basePrice * 0.11;
const totalAmount = basePrice + taxAmount;
const dpAmount = totalAmount * 0.50;  // 50%
```

Toggle on/off via `clinic_settings.tax_enabled` (default `true`):
- Kalau `tax_enabled = false`: `taxAmount = 0`, `totalAmount = basePrice`

### D. DP enforcement

- Saat booking: DP **wajib** dibayar minimum 50% sebelum status `confirmed`
- Sebelum DP: status `awaiting_dp`
- Cancel sebelum DP: free, no penalty
- Cancel setelah DP: refund policy → out of scope MVP, manual handling oleh admin (audit-logged)

### E. Settings configurable

```prisma
model ClinicSettings {
  id            Int     @id @default(1)  // single row
  taxEnabled    Boolean @default(true) @map("tax_enabled")
  taxPercentage Decimal @db.Decimal(5, 2) @default(11.00) @map("tax_percentage")
  dpPercentage  Decimal @db.Decimal(5, 2) @default(50.00) @map("dp_percentage")
  currency      String  @default("IDR")
  // ...
  @@map("clinic_settings")
}
```

Admin bisa edit di `(admin)/pengaturan` page.

## Consequences

### Positive
- Sederhana: rate card per service, calculation deterministic
- Configurable: tax & DP percentage tweakable tanpa code change
- Audit-friendly: tax & DP amount stored per booking (immutable history)

### Negative
- Tidak ada dynamic pricing/discount/promo MVP
- IDR only
- Refund manual (admin handle case-by-case)

## Implementation timeline

- **Slice 2** (Layanan): `ClinicService` rate card UI
- **Slice 6** (Booking core): payment-status field, `awaiting_dp` state
- **Slice 13** (Payment): full payment flow + PDF + WA send

## Open questions (Slice 13)

- [ ] Payment method: cash & transfer manual, atau gateway (Midtrans/Xendit)?
- [ ] Refund: full / partial / no refund?
- [ ] Receipt template: `pdfkit`, `puppeteer`, atau `react-pdf`?

## Reference

- `apps/psychology-design/JAWABAN-PERTANYAAN-KLIEN-2026-05-07.md` — DP confirmed
- `apps/psychology-design/althea-data.jsx` — sample 16 services
