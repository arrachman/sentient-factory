# Senti HR — Module Roadmap & DB Design Hub

> Dokumen desain otoritatif untuk `apps/web-hr`. Status per **2026-06-28**.
> Skill: `.claude/skills/hr/SKILL.md`. Standar FE: `packages/ui-kit/FRONTEND-DESIGN-SYSTEM.md`.

## 1. Posisi produk

Senti HR = platform **Time & Attendance / Workforce Management** yang mengadaptasi
**jibble.io**. web-hr adalah **adopter bersih pertama** `@sentient-factory/ui-kit`.

HR **bukan greenfield**: backend absensi sudah hidup di
`apps/api-gateway/src/hr-attendance` (`@Controller('hr')` → `/api/hr/*`, raw-SQL
atas tabel live `hr_*`). web-hr mengangkat UI dari `web-dashboard` ke app sendiri
lalu memperluas ke paritas jibble.

## 2. Status backend (live, raw-SQL — TIDAK Prisma-managed)

Tabel live: `hr_users`, `hr_worksites`, `hr_user_worksites`,
`hr_attendance_sessions`, `hr_attendance_events`, `hr_face_enrollments`
(+ settings/review). ⚠️ Prefix `hr_` **juga dipakai tabel warehouse**
(`dim_/obt_/etl_/hr_`) → **migrasi WAJIB additive** (lihat §5).

## 3. Peta modul (adaptasi jibble — status)

✅ live (UI di web-hr, endpoint ada) · 🟡 sebagian · ⬜ roadmap (stub coming-soon)

| Modul | jibble | Status | Endpoint |
| --- | --- | --- | --- |
| Dashboard Kehadiran | Dashboard | ✅ | `GET /hr/attendance/dashboard` |
| Absensi Saya (clock in/out + kamera/GPS) | Timer + Verification | ✅ | `POST /hr/attendance/clock-in\|clock-out` |
| Riwayat Absensi (+ paginasi) | Timesheets (dasar) | ✅ | `GET /hr/attendance/history` |
| Tinjauan Absensi (+ detail + snapshot) | Approvals | ✅ | `GET /hr/attendance-reviews(/:eventId)` (+approve/reject/clarify/reopen) |
| Lokasi & Geofence (CRUD) | Geofencing | ✅ | `GET/POST/PATCH/DELETE /hr/worksites` |
| Pendaftaran Wajah (+ capture kamera) | Face Recognition | ✅ | `GET /hr/face-enrollments`, `POST /hr/face-enrollment` |
| Karyawan (+ assign worksite) | People & Groups | ✅ | `GET /hr/users`, `PUT /hr/users/:id/worksites` |
| Pengaturan | Overtime/verifikasi/dll | ✅ | `GET /hr/settings`, `PATCH /hr/settings/:key` |
| Timesheet (rekap jam/lembur, agregasi) | Timesheets | ✅ | `GET /hr/timesheets` (derived, tanpa tabel baru) |
| Jadwal & Shift | Work Schedules | ✅ | `GET/POST/PATCH/DELETE /hr/shifts`, `GET/POST/DELETE /hr/shift-assignments` — tabel `hr_shifts`, `hr_shift_assignments` |
| Cuti / PTO (tipe + pengajuan + approval) | Time Off | ✅ | `GET/POST /hr/leave/types`, `GET/POST /hr/leave/requests` (+approve/reject/cancel) — tabel `hr_leave_types`, `hr_leave_requests` |
| Proyek & Aktivitas | Projects/Activity | ✅ | `GET/POST/PATCH/DELETE /hr/projects`, `GET/POST/DELETE /hr/project-time` — tabel `hr_projects`, `hr_project_time_entries` |
| Laporan & Export | Reports/Exports | ✅ | `GET /hr/reports` (katalog), `GET /hr/reports/:key`, `GET /hr/reports/:key/export?format=csv\|xlsx` — modul `hr-reports`, derived (tanpa tabel baru), privileged-only. Laporan: rekap kehadiran, jam proyek, rekap cuti |
| Mode Kiosk | Kiosk + NFC/PIN | ✅ | `GET /hr/kiosk/roster`, `POST /hr/kiosk/clock`, `PUT/DELETE /hr/kiosk/pin/:appUserId` — modul `hr-kiosk`, privileged (device dibuka admin). PIN per-karyawan (`hr_users.kiosk_pin_hash`, scrypt) + jalur wajah backend-ready (clock by appUserId). NFC belum |

Gap jibble lain (catatan): Selfie-per-entry, Offline mode, Integrasi Chat
(Slack/Teams), Invoicing/Billing, Live Activity, Productivity/Monitoring/
Screenshots (⚠️ sensitif privasi — opt-in + transparan), Integrasi payroll
(Xero/QuickBooks/Deel → lokal: integrasi payroll ERP), i18n.

## 4. Build order (roadmap Fase 2+)

1. ✅ **Timesheet** (turunan dari `hr_attendance_sessions` — paling cepat bernilai).
2. ✅ **Jadwal & Shift** (master shift + assignment — modul `hr-workforce`).
3. ✅ **Cuti / PTO** (kebijakan, saldo, akrual, approval).
4. ✅ **Proyek & Aktivitas** (alokasi waktu — modul `hr-workforce`).
5. ✅ **Laporan & Export** (rekap + XLS/CSV — modul `hr-reports`, derived; lock periode/audit ditunda).
6. ✅ **Kiosk** (mode UI + PIN — modul `hr-kiosk`; wajah backend-ready, NFC + offline sync ditunda).
7. **Pengaturan lanjutan** (overtime/break rules, kalender libur, SSO/2FA, RBAC). ← berikutnya

Tiap modul ⬜ = **approval terpisah** sebelum desain DB + endpoint + halaman.

## 5. Aturan DB (WAJIB — additive only)

- Penamaan tabel baru: `hr_<plural_snake>` (mis. `hr_shifts`, `hr_timesheets`,
  `hr_leave_requests`, `hr_projects`). Hindari bentrok dengan tabel warehouse
  `hr_*` yang sudah ada — cek dulu `\dt hr_*` di Postgres sebelum bikin nama.
- DB live **tidak schema-managed penuh** → **JANGAN `prisma migrate dev/diff`
  mentah**. Migrasi = **DDL additive terskop** (0 DROP, review per-statement),
  pola identik dengan skill `mdp` §Migrasi.
- Konvensi field warisan: PK `BigInt`, `code`/`name`, soft-delete `deleted_at`,
  `is_active`, audit quartet, waktu `timestamptz` UTC, money `Decimal(19,4)`.
- IDs → string di FE (BigInt diserialisasi). Envelope: endpoint HR saat ini
  mengembalikan payload mentah (bukan `{data}`); FE menormalkan via `asArray`.

## 6. Keputusan terkunci

- web-hr = adopter ui-kit langsung (Tier 1 `createApiClient`/`AppQueryProvider`/
  `cn` + Tier 2 `ui/*`), tanpa adapter re-export ERP.
- Base URL = same-origin `/api` → rewrite ke api-gateway (`HR_INTERNAL_API_URL`).
- Auth = sesi platform (cookie `sf_token`); web-hr tidak punya login sendiri.
- Shell HR = **lean** (sidebar+topbar data-driven dari `lib/nav.ts`), bukan port
  multi-tab shell web-erp (terlalu terkopel ke 200+ halaman ERP). Bisa di-port
  nanti bila HR butuh multi-tab.
- Port **3221** (`WEB_HR_PORT`), origin `hr.fr-labs.my.id`.

## 7. Disiplin dokumen

Setiap keputusan/perubahan → update file ini (DB/roadmap) atau
`apps/web-hr/CLAUDE.md` (rulebook app). Jangan declare selesai sebelum dokumen
sinkron.
