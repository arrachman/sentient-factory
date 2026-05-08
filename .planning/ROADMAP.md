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
| 6 | Booking core | 🔵 | 2-3 | 1, 2, 3, 5 | BookingWizard, state machine, multi-session tracking |
| 7 | Schedule grid + conflict detection | 🔵 | 1-2 | 6 | Admin grid (psikolog × slot), realtime conflict warning |
| 8 | WA templates + dispatcher | 🔵 | 2 | 0 | 18 templates, dispatcher with retry queue, provider impl |
| 9 | WA event triggers | 🔵 | 1 | 6, 8 | Hook ke booking lifecycle (confirmation, H-1, 30-min, follow-up) |
| 10 | Psikolog workflow | 🔵 | 1-2 | 6 | Mark complete, clinical notes, own schedule view |
| 11 | Receptionist check-in | 🔵 | 1 | 6 | Realtime via SSE/WS, status berlangsung/menunggu/antar |
| 12 | Audit + Owner dashboard | 🔵 | 1-2 | 0 | Aggregate stats, KPI cards, audit log viewer |
| 13 | Payment receipt + PDF | 🔵 | 1-2 | 6 | DP + lunas, PDF generation, WA send |
| 14 | Polish: PWA + mobile + perf | 🔵 | 1-2 | semua | Manifest, viewport, lazy-load, mobile responsive QA |

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
