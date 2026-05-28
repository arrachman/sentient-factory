# Roadmap: Web-Althea

Status: 🔵 Not started · 🟡 In progress · 🟢 Done · 🔴 Blocked

| # | Slice | Status | Sessions est. | Depends on | Notes |
|---|-------|:------:|:-------------:|------------|-------|
| 0 | **Foundation** | 🟢 | 1 | – | ✅ Code + DB seeded + tests pass. Lihat `phases/00-foundation/VERIFICATION.md` |
| 1 | Master data: Psikolog | 🟢 | 1 | 0 | ✅ API + UI + 14 tests + audit verified. Pattern established. |
| 2 | Master data: Layanan | 🟢 | 0.5 | 0 | ✅ 16 services seeded, API + UI live |
| 3 | Master data: Rooms | 🟢 | 0.5 | 0 | ✅ 11 rooms seeded + **`facilities text[]` array** (chip editor di drawer, legacy CSV backfill, detail panel fallback chain) — migr `20260511_002` |
| 4 | Users & Roles | 🟢 | 1 | 0 | ✅ Multi-role assignment, soft-delete, 13 users seeded |
| 5 | Client management | 🟢 | 0.5 | 0 | ✅ Standalone entity (NOT login user), 5 sample clients |
| 6 | Booking core | 🟢 | 2 | 1, 2, 3, 5 | ✅ State machine + conflict detection + BookingWizard 4-step + Reschedule dialog |
| 7 | Schedule grid + conflict detection | 🟢 | 1 | 6 | ✅ Psikolog × 6 time slots, navigable date, service-type colors |
| 8 | WA templates + dispatcher | 🟢 | 2 | 0 | ✅ **FonnteProvider hardened** (phone normalize `08xxx`→`62xxx`, messageId string-cast, ID date/time WIB, webhook fallback) + 18 templates seeded + BullMQ retry queue + send-test dialog + admin UI |
| 9 | WA event triggers | 🟢 | 0.5 | 6, 8 | ✅ Hook ke booking lifecycle (confirm/complete/cancel/reschedule auto-trigger templates) |
| 10 | Psikolog workflow | 🟢 | 1.5 | 6 | ✅ Dashboard real-data agregat (`/me/dashboard-stats` TZ-aware) + sessions SOAP + patients + `/psikolog/profile` (editable + avatar upload base64) + `/psikolog/schedule` Hari/Minggu/Bulan + availability self-service (weekly + per-tanggal override) + `/psikolog/rooms` read-only |
| 11 | Receptionist check-in | 🟢 | 0.5 | 6 | ✅ Status board 4-column + walk-in via wizard + check-in transition + **SSE realtime** (`/clinic/stream/booking` + RxJS Subject pub-sub + `useBookingStream` hook) |
| 12 | Audit + Owner dashboard | 🟢 | 1 | 0 | ✅ Owner KPI dashboard + audit log viewer dengan filter |
| 13 | Payment receipt + PDF | 🟢 | 0.5 | 6 | ✅ ClinicPayment model + DP/lunas + **pdfkit receipt** (`GET /payment/:id/receipt.pdf`) + **WA send** (`POST /payment/:id/send-receipt`) + manual reminder dispatch |
| 14 | Polish: PWA + mobile + perf | 🟢 | 0.5 | semua | ✅ PWA manifest + viewport + theme color + Apple Web App + SVG icons (any + maskable) + Service Worker (cache-first static, network /api+SSE) + sw-register client; ⏳ mobile QA on real devices pending |

**Total estimate**: 17-26 sessions Claude Code (asumsi 1 session ~2 jam aktif).

## Slice grouping (suggest)

- **Foundation (Slice 0)** — must complete first, blocks everything
- **Wave 1: Master Data (Slices 1-4)** — bisa dikerjakan paralel kalau resource cukup, urut: Psikolog (jadi reference) → Layanan, Rooms (paralel dengan Psikolog kalau pattern udah dipahami) → Users & Roles (butuh User model dari Foundation)
- **Wave 2: Client + Booking (Slices 5-7)** — sekuensial: Client → Booking core → Schedule grid
- **Wave 3: WA Integration (Slices 8-9)** — Slice 8 dulu (provider + dispatcher) → Slice 9 hook events (butuh booking lifecycle dari Slice 6)
- **Wave 4: Workflows (Slices 10-11)** — paralel: Psikolog workflow + Receptionist check-in
- **Wave 5: Reporting & Payment (Slices 12-13)** — paralel
- **Wave 6: Polish (Slice 14)** — terakhir, menyentuh semua

## Done criteria (project-level)

- [ ] Semua 14 slice closed dengan VERIFICATION.md ✅
- [ ] End-to-end demo sukses (full flow di plan)
- [ ] UAT sign-off dari client Althea
- [ ] Performance: page load < 2s di prod
- [ ] PWA add-to-home-screen verified
- [ ] Mobile responsive di Chrome iPhone simulator + Android
- [ ] Audit log coverage 100% pada slice yang ada mutation
- [ ] Code review: tidak ada CRITICAL findings di final review
- [ ] Deployment ke staging/prod sukses

## Open questions (cross-slice)

- [ ] **WA provider**: Meta Business API direct, atau pakai gateway pihak ketiga (Wablas, WhatsApp.id, Twilio)? — keputusan di Slice 8.
- [ ] **Realtime mechanism**: SSE atau WebSocket untuk receptionist check-in? — keputusan di Slice 11.
- [ ] **PDF library**: pdfkit, puppeteer, atau react-pdf untuk receipt? — keputusan di Slice 13.
- [ ] **Deployment target**: Vercel, self-host Docker, atau lainnya? — keputusan terpisah di luar slice scope.

## History

- 2026-05-08 — Roadmap dibuat, Slice 0 belum mulai
- 2026-05-08 — Slices 0-5 done (Foundation + Master Data CRUD)
- 2026-05-08 — Slices 6-9 done (Booking core, Schedule, WA dispatcher + event triggers)
- 2026-05-08 — Slices 10-14 done/partial (Psikolog/Receptionist workflows, Owner+Audit, Payment, PWA)
- **All 14 slices delivered** — 11 GREEN, 3 YELLOW (functional with documented deferred items)
- 2026-05-09 — Login redirect bug fix (NPM bypass Route Handler → set cookie client-side), logout confirmation modal, password required di Tambah Psikolog, advanced filter `/admin/schedule` (client search, time-of-day, sesi, layanan), master slot system replace `operatingHours`
- 2026-05-10 — **Fonnte integration hardened**: phone normalization util (`08xxx/+62xxx/8xxx`→`62xxx`), messageId number→string cast, Indonesian date/time formatting (`Asia/Jakarta`), webhook status fallback, BullMQ retry queue, send-test dialog
- 2026-05-10 — `/psikolog/profile` page: own profile + availability editor (weekly + per-tanggal override calendar) + functional Edit dialog (color picker, bio, title) + live stats 30d
- 2026-05-10 — `/psikolog/schedule` Hari/Minggu/Bulan view, 5-state cell coloring kontras tinggi, slot picker hide unavailable, "Kosong" copy
- 2026-05-11 — **Slice 03 extended**: `clinic_room.facilities text[]` migration `20260511_002` + chip editor di drawer + legacy CSV backfill + RoomDetailPanel fallback chain (array → CSV → DEFAULT_FACILITIES per type)
- 2026-05-11 — **Slice 10 extended**: `/psikolog/dashboard` real-data — endpoint baru `GET /clinic/psikolog/me/dashboard-stats` (today + week + queue, TZ Asia/Jakarta). Frontend stat cards + week chart + clickable action queue
- 2026-05-11 — Avatar upload psikolog (base64 data URL, client-side canvas resize, validasi backend ~1MB)
- 2026-05-11 — Booking validator fix: pakai TZ klinik (Asia/Jakarta) bukan server UTC saat compute `dow + hhmm` untuk slot lookup
- 2026-05-11 — **Slice 07 UX iterations**: schedule grid Minggu 6→7 hari penuh (Sen-Min), slot-cell 5-state contrast tuning (Booked saturated vs Tersedia almost-white), libur cell amber zebra → flat gray disabled, emoji eksperimen → revert text-only minimal, copy "Libur"→"Kosong", Bulan view cell color sesuai state (sage gradient by count)
- 2026-05-11 — Planning docs sync: ADR 010+011 added, ADR 008 revised slot/TZ/validation cascade, slice 6+7 SPEC filled (post-MVP iterations documented), CHANGELOG.md daily entries
- 2026-05-18 — **Slot range per-layanan**: `ClinicService.slotOverrides` (geser start/end per layanan; identitas/label/index slot tetap dari `slotsOfDay` global), `resolveServiceSlots()` backend+frontend mirror, `assertSlotMatch` service-aware, editor di form Layanan + ringkasan read-only di Pengaturan; migrasi `20260518_002` (aditif)
- 2026-05-27 — **WA device pairing in-app**: admin tambah/ganti nomor pengirim WA via UI (form → QR → activate, auto-cleanup device lama). Kolom `ClinicSettings.waActiveDeviceToken` (migration `20260527_001`), env baru `FONNTE_ACCOUNT_TOKEN`, 5 endpoint admin di `/clinic/settings/wa-devices`, `FonnteProvider` baca token dari DB (fallback env)

## Outstanding for Production-Ready

Items yang masih perlu dikerjakan untuk production-grade (di luar 14 slice):
- Real-time SSE/WS untuk receptionist — **DONE** (SSE `/clinic/stream/booking` + RxJS Subject + `useBookingStream`)
- PDF library proper — **DONE** (pdfkit via `GET /payment/:id/receipt.pdf`)
- ClinicSessionNote endpoint — **DONE** (CRUD + isPrivate flag)
- /auth/me endpoint — **DONE** (filter sesi by current psikolog)
- Bull queue untuk WA retry — **DONE** (BullMQ + Redis)
- Fonnte integration end-to-end — **DONE** (hardened 2026-05-10)
- Avatar upload psikolog — **DONE** (2026-05-11)
- PWA icons (butuh design asset) — masih SVG placeholder
- Service worker untuk offline support — done (cache-first static)
- Mobile responsive QA pass — pending real-device QA
- Prisma migration drift full reconcile — pending (butuh TTY)
- HTTPS deployment + NPM live di althea.fr-labs.my.id — **DONE** (Let's Encrypt aktif)
