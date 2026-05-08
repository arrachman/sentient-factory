# Features

Feature modules per domain. Setiap feature punya struktur:

```
<feature-name>/
├── api/      # Fetch functions yang call api-gateway via lib/api-client
├── hooks/    # TanStack Query hooks (useQuery, useMutation)
├── model/    # Types, zod schemas, util domain
└── ui/       # Komponen presentational + page composition
```

## Daftar feature

### Patient & Psychologist domain
- `auth/` — login pasien, login psikolog, register pasien
- `booking/` — wizard booking sesi (pilih layanan → psikolog → jadwal → konfirmasi)
- `session/` — sesi aktif, history, action (cancel, reschedule)
- `patient-profile/` — profil pasien (data diri, asuransi, history)
- `psikolog-profile/` — profil psikolog + jadwal availability

### Admin domain
- `admin-psikolog/` — CRUD psikolog (data, jadwal default, layanan)
- `admin-layanan/` — CRUD layanan (konseling, terapi, terapi anak, tes psikologi)
- `admin-rooms/` — CRUD ruang fisik / virtual (online room URL)
- `admin-clients/` — daftar pasien terdaftar
- `admin-users-roles/` — user management & RBAC
- `admin-notif-wa/` — template notifikasi WA + dispatch + log
- `admin-audit-log/` — log aksi penting (CRUD admin, perubahan data sensitif)
- `admin-pengaturan/` — global settings (jam operasional, payment, branding)

## Konvensi

- File naming: `kebab-case.ts` (e.g. `booking.api.ts`, `use-booking-page.ts`).
- Export dari `index.ts` per subfolder kalau dipakai cross-module.
- Hindari import lintas-feature; kalau perlu shared, pindah ke `shared/` atau `components/`.
- API call selalu via `lib/api-client` — jangan fetch raw.
