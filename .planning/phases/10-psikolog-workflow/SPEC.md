# Slice 10: psikolog-workflow — SPEC

**Status**: 🟢 Done (extended 2026-05-11)

Workflow lengkap role `clinic-psikolog`: dashboard, schedule self-service, patients view, session notes (SOAP), profile editor, room view.

## Pages

| Route | Status | Description |
|---|---|---|
| `/psikolog/dashboard` | 🟢 | Greeting + 4 stat card + jadwal hari ini + action queue + week chart |
| `/psikolog/schedule` | 🟢 | Hari/Minggu/Bulan view, color-coded slot states, set availability per-tanggal |
| `/psikolog/patients` | 🟢 | List klien yang pernah sesi dengan psikolog ini |
| `/psikolog/sessions` | 🟢 | Catatan sesi (SOAP format) + history per booking |
| `/psikolog/rooms` | 🟢 | Read-only room usage view (untuk lihat alokasi) |
| `/psikolog/profile` | 🟢 | Edit profil + foto avatar + statistik 30 hari |

## Endpoints (backend)

Semua di `apps/api-gateway/src/clinic-psikolog/`:

| Method + Path | Roles | Description |
|---|---|---|
| `GET /clinic/psikolog/me` | psikolog | Own profile (lookup by JWT userId) |
| `GET /clinic/psikolog/me/stats` | psikolog | Profile 30d stats: `{ sesi30Hari, klienAktif, kehadiran, ratingKlien }` |
| `GET /clinic/psikolog/me/dashboard-stats` | psikolog | **Dashboard aggregate**: today + week + queue (lihat detail di bawah) |
| `PATCH /clinic/psikolog/me` | psikolog | Self-edit (fullName, title, bio, color, **avatarUrl**) |
| `PATCH /clinic/psikolog/me/availability` | psikolog | Set weekly availability per slot/day |
| `GET /clinic/psikolog/me/date-overrides?from&to` | psikolog | List override per-tanggal |
| `POST /clinic/psikolog/me/date-overrides` | psikolog | Upsert override per-tanggal (cuti / makeup) |
| `DELETE /clinic/psikolog/me/date-overrides/:date` | psikolog | Hapus override → revert ke weekly |
| `GET /clinic/psikolog/by-user/:userId/availability-for-date?date=` | semua clinic-* | Resolve effective availability (date override merge weekly) |

### Dashboard-stats payload

```ts
{
  today:  { total, completed, inProgress, upcoming, cancelled },
  week:   { data: number[7], total, startDate },   // Sen→Min, count status != cancelled
  klienAktif: number,                              // distinct client 30d non-cancelled
  catatanTertunda: number,                         // completed 7d tanpa ClinicSessionNote
  pendingNotes: { bookingId, clientName, serviceName, scheduledStart }[],
  packageEndingSoon: { bookingId, clientName, sessionN, sessionTotal, scheduledStart }[],
  anchorDate: string  // YYYY-MM-DD today di WIB (server truth)
}
```

Timezone: **Asia/Jakarta** (via `localPartsInTimezone` + `localDateAtMidnight` helper).

## ClinicSessionNote

```prisma
model ClinicSessionNote {
  id, bookingId, psikologUserId, noteText (Text), isPrivate, audit fields
}
```

CRUD via `/clinic/session-note/*` — SOAP format ditampilkan di `/psikolog/sessions`.

## Frontend feature folders

```
apps/web-althea/features/
├── psikolog-workflow/       # dashboard
│   ├── api/dashboard.api.ts
│   ├── hooks/use-psikolog-dashboard.ts
│   ├── model/format.ts
│   └── ui/{dashboard,today-schedule-card,today-session-row,
│           action-queue-card,week-mini-chart,stat-card}.tsx
├── psikolog-profile/         # /psikolog/profile
│   ├── api/profile.api.ts
│   ├── hooks/{use-profile, use-availability}.ts
│   └── ui/{profile-page,profile-card,profile-edit-dialog,
│           availability-editor,stats-card}.tsx
├── psikolog-schedule/        # /psikolog/schedule
├── psikolog-patients/        # /psikolog/patients
├── psikolog-sessions/        # /psikolog/sessions (SOAP editor)
└── psikolog-rooms/           # /psikolog/rooms (read-only)
```

## Dashboard data flow (Slice 10 extension 2026-05-11)

```
PsikologDashboard
  └ usePsikologDashboard()
      ├ useMe()                           → greeting name + psikologId
      ├ useQuery(['psikolog','me','dashboard-stats'])
      │   └ psikologDashboardApi.getDashboardStats()
      │       └ GET /api/clinic/psikolog/me/dashboard-stats
      └ useBookingList({ psikologUserId, date })
          → today bookings (detail per row untuk TodayScheduleCard)
```

Action queue items:
- **Catatan sesi belum diisi** (klik → `/psikolog/sessions`) — dari `pendingNotes`
- **Paket akan habis** (klik → `/psikolog/schedule`) — dari `packageEndingSoon`

## Avatar upload

- Field `User.avatarUrl text` (nullable) — base64 data URL (PNG/JPEG) atau URL absolut
- Client-side resize (canvas) sebelum POST: max 256×256, JPEG quality 0.85
- Validasi backend: data-URL format check + ukuran max ~1MB
- Render di `ProfileCard` + sidebar nav

## Acceptance criteria

- [x] `/psikolog/dashboard` real data dari single endpoint (no stub)
- [x] Stat cards: Sesi hari ini, Sesi minggu ini, Klien aktif (30d), Catatan tertunda
- [x] Week chart 7 hari (Sen-Min) dengan highlight hari ini
- [x] Action queue clickable → navigate ke page terkait
- [x] Profile edit: fullName, title, bio, color, avatar
- [x] Profile stats: 30d sesi + klien aktif + kehadiran %
- [x] Schedule self-service: weekly + per-tanggal override
- [x] Patients list & session notes (SOAP) functional
- [x] Semua TZ-aware (Asia/Jakarta)

## Files (backend)
- `apps/api-gateway/src/clinic-psikolog/clinic-psikolog.{controller,service,module}.ts`
- `apps/api-gateway/src/clinic-session-note/`
- `apps/api-gateway/src/clinic-booking/timezone.util.ts` (helper)

## Reference templates
- API: `apps/api-gateway/src/clinic-room/` (CRUD pattern)
- UI: `apps/web-althea/features/admin-psikolog/` (admin counterpart)
- Mockup: `apps/psychology-design/PsikologDashboard.jsx`, `RoleDashboards.jsx`
