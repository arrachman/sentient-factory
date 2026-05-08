# Roadmap: Web-Althea

Status: 🔵 Not started · 🟡 In progress · 🟢 Done · 🔴 Blocked

| # | Slice | Status | Sessions est. | Depends on | Notes |
|---|-------|:------:|:-------------:|------------|-------|
| 0 | **Foundation** | 🟢 | 1 | – | ✅ Code + DB seeded + tests pass. Lihat `phases/00-foundation/VERIFICATION.md` |
| 1 | Master data: Psikolog | 🟢 | 1 | 0 | ✅ API + UI + 14 tests + audit verified. Pattern established. |
| 2 | Master data: Layanan | 🟢 | 0.5 | 0 | ✅ 16 services seeded, API + UI live |
| 3 | Master data: Rooms | 🟢 | 0.5 | 0 | ✅ 11 rooms seeded (Sky/Sage/Forest/Sunset/Mint/Anak1-3/Playground/Tes/Seminar) |
| 4 | Users & Roles | 🟢 | 1 | 0 | ✅ Multi-role assignment, soft-delete, 13 users seeded |
| 5 | Client management | 🟢 | 0.5 | 0 | ✅ Standalone entity (NOT login user), 5 sample clients |
| 6 | Booking core | 🟢 | 2 | 1, 2, 3, 5 | ✅ State machine + conflict detection + BookingWizard 4-step + Reschedule dialog |
| 7 | Schedule grid + conflict detection | 🟢 | 1 | 6 | ✅ Psikolog × 6 time slots, navigable date, service-type colors |
| 8 | WA templates + dispatcher | 🟢 | 2 | 0 | ✅ FonnteProvider + 18 templates seeded + WA service + webhook + send-test + admin UI (CRUD + log viewer) |
| 9 | WA event triggers | 🟢 | 0.5 | 6, 8 | ✅ Hook ke booking lifecycle (confirm/complete/cancel/reschedule auto-trigger templates) |
| 10 | Psikolog workflow | 🟡 | 1 | 6 | ✅ Dashboard + sessions + start/complete + patients view; ❌ user-filtered queries (butuh /auth/me) + clinical notes persistence |
| 11 | Receptionist check-in | 🟡 | 0.5 | 6 | ✅ Status board 4-column + walk-in via wizard + check-in transition (polling 10s); ❌ true real-time SSE/WS |
| 12 | Audit + Owner dashboard | 🟢 | 1 | 0 | ✅ Owner KPI dashboard + audit log viewer dengan filter |
| 13 | Payment receipt + PDF | 🟡 | 0.5 | 6 | ✅ ClinicPayment model + DP/lunas + simple HTML receipt; ❌ proper PDF library + WA send integration |
| 14 | Polish: PWA + mobile + perf | 🟡 | 0.5 | semua | ✅ PWA manifest + viewport + theme color + Apple Web App; ❌ icons (need design assets) + service worker + mobile QA |

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

## Outstanding for Production-Ready

Items yang masih perlu dikerjakan untuk production-grade (di luar 14 slice):
- Real-time SSE/WS untuk receptionist (saat ini polling)
- PDF library proper (saat ini HTML print) — pdfkit / puppeteer / react-pdf
- PWA icons (butuh design asset)
- Service worker untuk offline support
- Mobile responsive QA pass
- /auth/me endpoint untuk filter sesi by current psikolog
- ClinicSessionNote endpoint untuk clinical notes persistence
- Bull queue untuk WA retry (saat ini sync, no retry)
- Prisma migration drift full reconcile (butuh TTY)
- HTTPS deployment + Caddy live di althea.fr-labs.my.id
