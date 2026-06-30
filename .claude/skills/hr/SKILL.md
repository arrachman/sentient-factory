---
name: hr
description: >
  Skill untuk bekerja di apps/web-hr — produk Senti HR, platform Time &
  Attendance / Workforce Management yang mengadaptasi jibble.io (absensi,
  pengenalan wajah, GPS/geofence, timesheet, jadwal/shift, cuti, project &
  activity tracking, approval, laporan payroll-hours). web-hr adalah ADOPTER
  BERSIH PERTAMA dari packages/ui-kit. Aktifkan setiap kali task menyentuh
  apps/web-hr/**, modul HR/absensi, atau endpoint /api/hr/*.
trigger: >
  Aktif saat user menyebut "web-hr", "hr", "Senti HR", "absensi", "attendance",
  "kehadiran", "time tracking", "timesheet", "clock in/out", "face enrollment",
  "pengenalan wajah", "worksite/geofence", "shift/jadwal", "cuti/leave/PTO",
  "lembur/overtime", "project/activity tracking", "attendance review/approval",
  "payroll hours", "kiosk", "jibble", atau mengedit file di apps/web-hr/ atau
  apps/api-gateway/src/hr-attendance/. JUGA aktif saat user menyebut
  domain/URL deployment "hr.fr-labs.my.id".
---

Kamu bekerja di `apps/web-hr` — **produk Senti HR**, platform *Time & Attendance /
Workforce Management* yang mengadaptasi **jibble.io** ke dalam ekosistem Sentient
Factory. web-hr adalah **adopter bersih pertama** `@sentient-factory/ui-kit`:
ia mengonsumsi paket itu langsung (tanpa adapter), bukan lewat re-export tipis
seperti web-erp.

Skill ini berlaku **di atas** root `CLAUDE.md` repo dan
`packages/ui-kit/FRONTEND-DESIGN-SYSTEM.md` (keduanya non-negosiabel). **Baca
`FRONTEND-DESIGN-SYSTEM.md` sebelum kerja** — itu rulebook frontend otoritatif
lintas-app (ERP/MDP/HR). Saat dokumen itu dan skill ini berbeda, dokumen itu yang
menang; perbarui skill ini agar sinkron.

## Fakta penting: HR BUKAN greenfield

Backend HR **sudah hidup** dan tidak boleh dibangun ulang:

- **Modul**: `apps/api-gateway/src/hr-attendance/` → `@Controller('hr')` →
  path `/api/hr/*` (global prefix `api`). Implementasi = **raw SQL** (bukan
  Prisma model) lewat service-service: clock, dashboard, query/history, review,
  settings, face-enrollment, face-identification, worksite, user-worksite.
- **Tabel live** (Postgres `sentient_factory`, **TIDAK Prisma-schema-managed**):
  `hr_users`, `hr_worksites`, `hr_user_worksites`, `hr_attendance_sessions`,
  `hr_attendance_events`, `hr_face_enrollments`, plus tabel settings/review.
- ⚠️ Prefix `hr_` **juga dipakai tabel warehouse live** (`dim_/obt_/etl_/hr_`).
  **JANGAN `prisma migrate dev`/`diff` mentah** (akan drop warehouse). Tambahan
  schema HR (kalau perlu) = **DDL additive terskop** ala MDP (lihat skill `mdp`
  §Migrasi) — 0 DROP, review per-statement.
- **UI HR lama** masih tertanam di `apps/web-dashboard`:
  `app/(layouts)/app/hr/*` (attendance dashboard, history, reviews, face
  enrollment, worksites, personal portal) + proxy `app/api/hr/*`.

**Misi web-hr** = mengangkat pengalaman HR dari web-dashboard ke app berdiri
sendiri yang bersih (adopter ui-kit pertama) **lalu** memperluasnya menuju
paritas fitur jibble.io. Bukan rewrite backend.

## Aturan non-negosiabel

1. **Ikuti FRONTEND-DESIGN-SYSTEM.md persis.** Skeleton disalin dari **web-erp**
   (BUKAN web-mdp yang sudah drift — lihat §9 dokumen itu). Stack, versi, folder,
   kontrak API-client, token = identik. Folder primitif = `components/ui/`
   (bukan `atoms/`); API layer = `lib/api/*` per-resource (bukan satu file).
2. **Adopter ui-kit langsung.** Tambah `"@sentient-factory/ui-kit": "*"` ke deps,
   `transpilePackages: ['@sentient-factory/ui-kit']` di `next.config.mjs`, lalu
   `createApiClient({ baseUrl })` di `lib/api/client.ts`. Tidak perlu adapter
   re-export. Error class = `HrApiError`, query-key namespace = `['hr', ...]`,
   storageKey = `hr-theme`.
3. **Design system dulu, baru slicing.** Token → primitif → layout → halaman.
   Tidak ada style/warna/spacing hardcode. Butuh UI baru → bikin reusable dulu.
   Token values HR boleh beda; nama/grup token tidak.
4. **Reuse backend `/api/hr/*` yang ada.** Fitur baru jibble → endpoint baru di
   modul `hr-attendance` (atau modul `hr-*` baru di api-gateway), reuse
   `ErpJwtAuthGuard` (cookie auth ERP) sesuai preseden MDP.
5. **Saat ragu → tanya user.** Aksi berisiko (schema/migrasi, hapus/rename,
   ubah `hr_*` live, ubah `infra/docker-compose.yml`, `config/ports.json`) =
   konfirmasi dulu.

## Adaptasi fitur jibble.io (peta produk — taksonomi penuh)

Sumber posisi pasar: `apps/marketing/hr-marketing.html`. Taksonomi penuh diambil
dari `jibble.io/features` (diverifikasi 2026-06-28). Legenda status backend:
✅ ada · 🟡 sebagian · ⬜ belum ada.

### A. Time Tracking
| Fitur jibble | Modul Senti HR | Status |
| --- | --- | --- |
| Timer (clock in/out real-time, any device) | Absensi | ✅ ada (`/api/hr` clock+sessions) |
| Timesheets (review/approve per pay-period) | Timesheet | ⬜ baru |
| Offline Mode (clock offline, sync saat online) | Absensi Offline | ⬜ baru (butuh queue klien + sync) |
| Kiosk (perangkat bersama on-site) | Kiosk | ⬜ baru (mode UI khusus) |
| Integrations (Slack, Teams) | Integrasi Chat | ⬜ baru |
| Desktop app / Chrome ext / Mobile iOS-Android | Klien Multi-platform | ⬜ di luar scope web-hr (catat) |

### B. Verification
| Fitur jibble | Modul Senti HR | Status |
| --- | --- | --- |
| Face Recognition (anti buddy-punch) | Pengenalan Wajah | ✅ ada (face-enroll/identify) |
| Selfie Capture (foto tiap entry) | Selfie per-Entry | 🟡 (face ada; selfie-per-entry belum eksplisit) |
| Geofencing (batasi clock-in by lokasi) | Worksites & Geofence | ✅ ada (`hr_worksites`) |
| GPS Tracking (stamp lokasi tiap clock) | GPS Stamp | 🟡 (worksite ada; live GPS map belum) |
| NFC & PIN | Verifikasi NFC/PIN | ⬜ baru |

### C. Management
| Fitur jibble | Modul Senti HR | Status |
| --- | --- | --- |
| Time Off (kebijakan cuti, accrual, request) | Cuti / PTO | ⬜ baru |
| Approvals (approve timesheet/kehadiran) | Attendance Reviews | ✅ ada (approve/reject/reopen/clarify) |
| Invoicing (waktu → invoice klien) | Invoicing | ⬜ baru (opsional, overlap ERP `sls`/`fin`) |
| People & Groups (RBAC) | Karyawan & Tim | 🟡 (`hr_users` ada; group+RBAC eksplisit belum) |
| Work Schedules (jadwal/shift) | Jadwal & Shift | ⬜ baru |

### D. Reporting
| Fitur jibble | Modul Senti HR | Status |
| --- | --- | --- |
| Reports (analisis waktu + payroll) | Laporan | 🟡 |
| Dashboard (overview real-time) | Attendance Dashboard | ✅ ada |
| Activity (siapa clock-in & sedang apa) | Live Activity | ⬜ baru |
| Projects (waktu per proyek) | Project & Activity | ⬜ baru |
| Exports (XLS/CSV) | Export | 🟡 (perlu pastikan XLS+CSV) |

### E. Productivity (jibble Premium — sensitif privasi)
| Fitur jibble | Modul Senti HR | Status |
| --- | --- | --- |
| Employee Monitoring | Monitoring | ⬜ baru — ⚠️ butuh consent & kebijakan privasi |
| Screenshots Time Tracker | Screenshot | ⬜ baru — ⚠️ sangat sensitif, opt-in + transparan |
| Productivity Tracker | Produktivitas | ⬜ baru |

### F. Lain-lain & Enterprise
| Fitur jibble | Modul Senti HR | Status |
| --- | --- | --- |
| Overtime Tracker (lembur, break, hari libur) | Lembur & Break | ⬜ baru (+ kalender libur regional) |
| Time Billing (jam billable) | Billing | ⬜ baru (opsional) |
| Payroll integrations (Xero, QuickBooks, Deel) | Integrasi Payroll | ⬜ baru (opsional; lokal: integrasi payroll ERP) |
| SSO & 2FA | Keamanan | ⬜ baru (selaras auth ERP) |
| Audit trail / tamper-proof pay periods | Audit & Lock | ⬜ baru (lock period) |
| Multi-language (i18n) | i18n ID/EN | ⬜ baru |

**Catatan gap utama** (TIDAK ada di rencana awal, hasil verifikasi jibble):
Selfie-per-entry, NFC & PIN, Offline mode, Kiosk eksplisit, Integrasi Chat,
Invoicing/Billing, Live Activity, Productivity/Monitoring/Screenshots (sensitif),
SSO/2FA, Audit/lock period, kalender hari libur, RBAC eksplisit, i18n.

Modul ⬜/🟡 = perlu desain DB (additive) + endpoint + halaman, approval per modul.
Modul ✅ = migrasi UI dari web-dashboard ke web-hr dulu, lalu poles.

> **Prinsip jibble yang diadopsi**: fokus melakukan time-tracking dengan SANGAT
> baik (bukan suite HR penuh). Modul payroll/invoicing penuh = integrasi ke ERP,
> bukan reimplementasi.

## Arsitektur & tech

- **App**: Next.js 16 (App Router, Turbopack), React 19, Tailwind v4 (token via
  `@theme`), TS strict — versi disalin verbatim dari `apps/web-erp/package.json`.
- **Port**: **3221** (usulan), envVar `WEB_HR_PORT`, daftarkan via
  `npm run ports:*` (jangan edit `config/ports.json` manual) + **buka UFW 3221**
  (lihat root CLAUDE.md §4.1) supaya klien LAN tidak timeout.
- **Origin produksi (usulan)**: `hr.fr-labs.my.id` (nginx → web-hr).
- **Backend**: extend `apps/api-gateway` (`/api/hr/*`), guard `ErpJwtAuthGuard`.
- **DB**: Postgres bersama `sentient_factory` (host `localhost:3208`). Tabel
  `hr_*` live raw-SQL; tambahan additive only.
- **Base URL strategy** (`lib/api/client.ts`): pilih salah satu dari
  FRONTEND-DESIGN-SYSTEM §4.2 — same-origin rewrite `/api/hr/*` (di balik
  gateway) **atau** `NEXT_PUBLIC_HR_API_URL` absolut. Dokumentasikan di atas
  `client.ts`.

## Konvensi (warisan FRONTEND-DESIGN-SYSTEM)

- IDs = **string** (BigInt diserialisasi backend). Timestamp = ISO string UTC.
- Envelope `{ data, error }`; client unwrap `.data`; resource fn balik tipe dalam.
- Satu `QueryClient`; query-key factory `hrQueryKeys` namespace `['hr', ...]`.
- File ≤ 400 baris (`npm run check:size`); split `*-form.tsx`/`*-filters.tsx`.
- Named export (kecuali `page.tsx`/`layout.tsx`). `'use client'` seperlunya.
- Dependency direction satu arah: `pages → organisms → molecules → ui`.

## Checklist bootstrap (sekali, saat scaffold)

1. Salin skeleton dari **web-erp** (layout, `components/ui/*`, `templates/*`,
   `shared/providers/*`, `lib/api/{client,types,hooks,index}.ts`, `lib/utils.ts`,
   `styles/globals.css`, `scripts/check-file-size.mjs`, semua config). Strip
   resource/pages khas ERP.
2. Rename `Erp*` → `Hr*` (error class, query keys, storageKey, metadata, env).
3. `styles/hr-tokens.css` dari `erp-tokens.css`; ubah hanya brand values.
4. Wire ui-kit langsung (deps `*` + `transpilePackages` + `createApiClient`).
5. Set base-URL strategy + rewrite/env.
6. Daftarkan port 3221 via port-manager + buka UFW.
7. `lib/api/<resource>.ts` per entitas HR (`employees`, `worksites`,
   `attendance-sessions`, `attendance-reviews`, `face-enrollments`, ...).
8. `components/pages/*` per layar; register di route registry shell.
9. `npm run check` (lint+typecheck+size+test) hijau sebelum commit.

## Disiplin dokumen

Setiap keputusan/perubahan flow/konvensi/status → **WAJIB update `.md`**:
rulebook app ke `apps/web-hr/CLAUDE.md` (buat saat scaffold), desain DB ke
`apps/web-hr/db-design/`, setup ke `README.md`. Catat sebagai fakta ringkas
(keputusan + alasan), bukan log percakapan. Selaraskan `.planning/CHANGELOG.md`
& `ROADMAP.md` bila status fitur berubah. Jangan declare selesai sebelum dokumen
sinkron.

## Workflow vibe coding — commit ke `dev` + build production

**WAJIB tiap sesi vibe coding selesai**: commit ke branch `dev` lalu build &
deploy ke production. Production web-hr = `npm run start` (`next start`) detached
di **port 3221** (bukan PM2). Detail + urutan baku = `apps/web-hr/CLAUDE.md`
§Workflow vibe coding (otoritatif). Ringkas: `npm run check` hijau → commit `dev`
→ `npm run build` → restart serve di :3221. Check/build gagal = STOP. Commit ke
branch non-`dev` atau `--force` = tanya user.

## Saat ragu

Tanya user. `FRONTEND-DESIGN-SYSTEM.md` + `apps/web-hr/CLAUDE.md` (setelah ada)
adalah otoritas — kalau skill ini berbeda, file itu yang menang; perbarui skill
ini agar sinkron.
