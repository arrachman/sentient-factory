# User Acceptance Test (UAT) — Althea Psychology

**URL Production**: `https://althea.fr-labs.my.id/`
**Date**: 2026-05-08

## Pre-flight

- [ ] DNS resolve dari multiple resolvers (8.8.8.8, 1.1.1.1)
- [ ] HTTPS valid (Let's Encrypt cert)
- [ ] `/api/health` returns 200 dengan `{status: "ok", uptime, timestamp}`
- [ ] `/manifest.webmanifest` returns 200
- [ ] `/sw.js` returns 200 (service worker)

## Login Flow

| ID | Test | Expected |
|---|---|---|
| L01 | Buka `https://althea.fr-labs.my.id/` | Redirect ke `/login` |
| L02 | Login `admin@althea.local` / `Test1234!` | Redirect ke `/admin/dashboard`, sidebar tampil "Admin" |
| L03 | Login `psikolog@althea.local` / `Test1234!` | Redirect ke `/psikolog/dashboard`, sidebar "Psikolog" |
| L04 | Login `owner@althea.local` / `Test1234!` | Redirect ke `/owner/dashboard`, sidebar minimal |
| L05 | Login `resepsionis@althea.local` / `Test1234!` | Redirect ke `/resepsionis/dashboard` |
| L06 | Login `marketing@althea.local` / `Test1234!` | Redirect ke `/marketing/dashboard` |
| L07 | Wrong password | Toast error "Login gagal" |
| L08 | Logout button | **Modal konfirmasi muncul dulu** ("Yakin ingin keluar?") → klik "Ya, keluar" → cookie cleared + redirect ke `/login` |
| L09 | Akses `/admin/dashboard` tanpa login | Redirect ke `/login?returnTo=/admin/dashboard` |
| L10 | Akses cross-role (psikolog → `/admin/booking`) | Redirect ke `/psikolog/dashboard` |
| L11 | **Login via NPM proxy (prod URL)** | Cookie `sf_token` ter-set di document.cookie (client-side fallback karena NPM bypass HttpOnly Route Handler) → hard nav via `window.location.assign(returnTo)` |
| L12 | Login dengan `returnTo=/admin/schedule` | Setelah berhasil → langsung ke `/admin/schedule` (bukan ke default role page) |

## Admin: Master Data CRUD

### Psikolog (`/admin/psikolog`)

| ID | Test | Expected |
|---|---|---|
| P01 | Buka page | List 7 psikolog, foto avatar dengan warna unique |
| P02 | Klik "Tambah" | Dialog form muncul |
| P03 | Submit form valid | Toast "Psikolog dibuat", row muncul di list |
| P04 | Submit duplicate email | Toast error "Email sudah terdaftar" |
| P05 | Klik Edit row | Form pre-filled, email field disabled |
| P06 | Update title + save | Toast "Diupdate", row update |
| P07 | Klik Delete + konfirmasi | Row hilang dari list (soft delete) |
| P08 | Toggle "Tampilkan nonaktif" | Soft-deleted rows muncul |
| P09 | Search "farah" | Filter ke 1 row |
| P10 | Specialty multi-select | Bisa toggle multiple |

### Layanan (`/admin/layanan`)

| ID | Test | Expected |
|---|---|---|
| S01 | Buka page | 16 services grouped by category (Konseling/Terapi/Tes) |
| S02 | Harga format Rp | "Rp 500.000" (titik thousand separator) |
| S03 | Tambah layanan baru | Dialog → save → muncul di group |
| S04 | Edit description | Update saved |
| S05 | Delete + konfirmasi | Row hilang |

### Rooms (`/admin/rooms`)

| ID | Test | Expected |
|---|---|---|
| R01 | Buka page | 11 rooms grouped by type (konseling/anak/tes/seminar), stat tile row, grid pemakaian harian |
| R02 | Tambah room dengan facilities chips | Pilih dari suggestions per type + custom input → Save → facilities tersimpan sebagai array |
| R03 | Edit capacity | Update saved |
| R04 | Klik cell di grid → detail panel | Tampil badges fasilitas (fallback chain: array → CSV legacy → DEFAULT_FACILITIES) |
| R05 | Edit room lama yang punya CSV description | Drawer pre-fill chips dari parsed CSV, description field jadi kosong (auto-migrate UX) |
| R06 | Validasi max 30 chips | Tombol Tambah disabled saat ≥30 |
| R07 | Duplicate chip case-insensitive | Tidak ditambahkan (dedupe) |

### Clients (`/admin/clients`)

| ID | Test | Expected |
|---|---|---|
| C01 | Buka page | 5 sample clients dengan name + phone + MRN |
| C02 | Search by phone | Filter works |
| C03 | Tambah klien (gender, age, MRN, WA) | Save → muncul |
| C04 | Duplicate MRN | Toast error |
| C05 | Toggle WA opt-out | Save → flag persist |

### Users & Roles (`/admin/users-roles`)

| ID | Test | Expected |
|---|---|---|
| U01 | Buka page | 13 clinic users dengan role badges |
| U02 | Filter by role "clinic-psikolog" | 7 + 1 = 8 rows |
| U03 | Tambah user dengan multi-role | Save → roles persist |
| U04 | Update roles (remove psikolog, add admin) | Roles update di m0_user_role |

## Admin Schedule (`/admin/schedule`)

| ID | Test | Expected |
|---|---|---|
| AS01 | View toggle Hari / Minggu / Bulan | Grid render sesuai mode; Hari=1 day, Minggu=7, Bulan=~31 (Rules of Hooks safe via `useQueries`) |
| AS02 | Date picker → tanggal lain | Grid update, header sync |
| AS03 | Advanced filter — search client name | Hanya booking dengan client match terlihat |
| AS04 | Advanced filter — time of day (pagi/siang/sore/malam) | Grid filter sesuai slot range |
| AS05 | Advanced filter — sesi type (single / package) | Filter booking single vs multi-session |
| AS06 | Advanced filter — layanan specific | Hanya booking dengan service.id match terlihat |
| AS07 | Reset filter | Semua chip hilang, grid kembali penuh |
| AS08 | SSR hydration | Tanggal aktif konsisten antara server render & client (todayKey defer ke useEffect) |

## Booking Flow

### Booking Wizard (`/admin/booking` — klik "Booking Baru")

| ID | Test | Expected |
|---|---|---|
| B01 | Step 1: pick client | Search atau pick existing, "Next" enabled saat selected |
| B02 | Step 2: pick service | Filter category, harga + durasi visible |
| B03 | Step 3: pick date+time | Date picker, time slots muncul |
| B04 | Step 4: pick psikolog + room | Dropdown filter by availability |
| B05 | Submit valid | Toast "Booking dibuat", muncul di list dengan status `awaiting_dp` |
| B06 | Submit dengan conflict (psikolog overlap) | Toast error "Psikolog conflict at booking #X" |
| B07 | Submit di luar jam operasional (18:00+) | Error "Booking di luar jam operasional" |
| B08 | Toggle "Buffer override" | Bypass conflict + jam check |

### Booking List + Transitions (`/admin/booking`)

| ID | Test | Expected |
|---|---|---|
| B09 | Filter status "awaiting_dp" | Filter applied |
| B10 | Filter date hari ini | Filter applied |
| B11 | Klik "Confirm" pada row awaiting_dp | Status → confirmed, badge berubah |
| B12 | Klik "Check-in" pada row confirmed | Status → checked_in |
| B13 | Klik "Reschedule" → ubah jadwal | Save → reschedule history bertambah |
| B14 | Klik "Cancel" + reason | Status → cancelled, reason tersimpan |

## Psikolog Workflow (`/psikolog/*`)

### Login as `psikolog@althea.local` (atau psikolog yang punya booking, mis. `rania@althea.local`)

| ID | Test | Expected |
|---|---|---|
| W01 | Dashboard load | 4 stat cards real-data: Sesi hari ini · Sesi minggu ini · Klien aktif (30d) · Catatan tertunda |
| W01b | Week chart 7-bar | Sen→Min, highlight hari ini (sage-500), tooltip "X sesi" |
| W01c | Action queue klik baris | Navigate ke `/psikolog/sessions` (catatan tertunda) atau `/psikolog/schedule` (paket akan habis), chevron muncul |
| W01d | Dashboard endpoint TZ | Anchor date = today di Asia/Jakarta (cek via `/api/clinic/psikolog/me/dashboard-stats`) |
| W02 | Buka `/psikolog/schedule` view Hari | Grid 6 slots × tanggal aktif, color cell sesuai state (Booked / Tersedia / Kosong / Libur / Conflict) |
| W02b | View Minggu | 7 hari Sen-Min (date strip horizontal), legend hari aktif |
| W02c | View Bulan | Calendar grid, cell color sesuai aggregate state harian |
| W02d | Klik cell Kosong + set ke Tersedia | POST date-override, slot toggle ke available |
| W02e | Set Cuti via menu Edit availability | POST date-override `isOpen=false`, cell jadi gray Libur |
| W03 | Buka `/psikolog/sessions` | Tab filter (active/today/completed/all), SOAP editor per booking |
| W04 | Klik "Mulai Sesi" pada checked_in | Status → in_progress, button berubah ke "Selesai" |
| W05 | Klik "Selesai" | Dialog clinical notes (SOAP) muncul |
| W06 | Submit tanpa note | Booking → completed, no note saved |
| W07 | Submit dengan note text | Note tersimpan di ClinicSessionNote, booking → completed |
| W08 | Buka `/psikolog/patients` | Aggregate unique clients dari history booking |
| W09 | Buka `/psikolog/rooms` | Read-only room usage view (psikolog tidak bisa CRUD room) |
| W10 | Buka `/psikolog/profile` | Profile card + availability editor + stats card (30d) |
| W11 | Klik Edit profile | Dialog: fullName, title, bio, color picker, upload avatar |
| W12 | Upload foto avatar > 1MB | Toast error "Foto terlalu besar — maksimal ~1MB setelah resize" |
| W13 | Upload foto avatar PNG 500KB | Client-side resize ke 256×256 JPEG q=0.85 → POST data URL → tampil di sidebar nav + profile card |
| W14 | Toggle availability per slot/day | PATCH `/me/availability`, weekly grid update |

## Receptionist Realtime (`/resepsionis/dashboard`)

### Login as `resepsionis@althea.local`

| ID | Test | Expected |
|---|---|---|
| RC01 | Dashboard load | 4-column board: awaiting_dp / confirmed / checked_in / in_progress |
| RC02 | Klik "Booking Baru" walk-in | Wizard muncul, status confirmed langsung saat submit |
| RC03 | SSE realtime | **Open 2 tabs**: di tab 1 confirm booking → tab 2 update otomatis dalam 1-2 detik tanpa refresh |
| RC04 | Klik "Check-in" client | Status berpindah ke kolom checked_in |

## Owner Dashboard (`/owner/dashboard`)

### Login as `owner@althea.local`

| ID | Test | Expected |
|---|---|---|
| O01 | Dashboard load | KPI cards: total bookings, completion rate, revenue, utilization% |
| O02 | Filter rentang tanggal | Stats update |
| O03 | Chart visualization (kalau ada) | Render correct |

## Audit Log (`/admin/audit-log`)

| ID | Test | Expected |
|---|---|---|
| A01 | Buka page | List entry audit log dari semua mutation |
| A02 | Filter by entity type "clinic.psikolog" | Filtered |
| A03 | Verify entries muncul setelah create/update/delete (real-time) | Real entries with actor + timestamp |

## WhatsApp Notifications (`/admin/notif-wa`) — Fonnte provider

Prereq: env `FONNTE_API_TOKEN` ter-set, container api-gateway up dengan token.

| ID | Test | Expected |
|---|---|---|
| WA01 | List 18 templates per category (pengingat, jadwal, onboarding, bayar) | All visible, tabs functional |
| WA02 | Edit template body dengan Mustache var `{{nama}}` `{{tanggal}}` `{{waktu}}` | Save successful, preview render dengan sample data |
| WA03 | Send test dialog → input nomor `08xxx` + pick template + kirim | Phone auto-normalize ke `62xxx`, toast "Berhasil dikirim", entry log muncul |
| WA03b | Send test dengan format `+62xxx` atau `62xxx` | Sama-sama normalize ke `62xxx` (lihat `phone.util.ts`) |
| WA03c | Tanggal/waktu di template render | Format Indonesian: "Senin, 11 Mei 2026" + "08:00 WIB" (`toLocaleString id-ID` + `timeZone: Asia/Jakarta`) |
| WA04 | Trigger via booking confirm (Slice 9) | WA log entry muncul `status=terkirim`, BullMQ job di Redis queue |
| WA05 | View log filter status | gagal/terkirim/sampai/dibaca filter works |
| WA06 | Webhook callback dari Fonnte | Status update real-time di WA log (sampai/dibaca/gagal), fallback ke `terkirim` kalau payload tidak ada status |
| WA07 | Retry queue saat gagal | BullMQ retry 3× dengan backoff, max attempts → `status=gagal` permanen |
| WA08 | messageId dari Fonnte response | String (bukan number) — guard `String(rawId)` di FonnteProvider |

## Payment + PDF Receipt (Slice 13)

| ID | Test | Expected |
|---|---|---|
| PM01 | Booking confirmed → otomatis create payment dengan DP 50% | clinic_payment row created |
| PM02 | Record DP via API/UI | Status → dp_paid |
| PM03 | Record sisa pelunasan | Status → lunas |
| PM04 | Download `/payment/:id/receipt.pdf` | PDF file valid, contains invoice details |
| PM05 | Send receipt via WA (`/payment/:id/send-receipt`) | WA log + delivery |

## PWA (Slice 14)

| ID | Test | Expected |
|---|---|---|
| PWA01 | Chrome Mobile → "Add to Home Screen" | Install prompt muncul |
| PWA02 | Installed app launch | Splash screen sage color, fullscreen mode |
| PWA03 | Offline mode (airplane) | App shell tetap load (cached pages), API calls show offline message |
| PWA04 | Service worker registered | DevTools → Application → Service Workers → activated |

## Mobile Responsive (Slice 14)

| ID | Test | Expected |
|---|---|---|
| MO01 | iPhone Safari portrait | Sidebar collapse, hamburger menu functional |
| MO02 | Android Chrome landscape | Layout responsive, no horizontal scroll |
| MO03 | Tablet | Sidebar persistent, content full width |
| MO04 | Form dialog mobile | Full-screen modal, scrollable |

## Performance

| ID | Test | Expected |
|---|---|---|
| PERF01 | First page load (cold) | < 3s (TTI) |
| PERF02 | Repeat page load (warm) | < 500ms (cached SW) |
| PERF03 | API response time | < 200ms p95 |
| PERF04 | Lighthouse score (Chrome DevTools) | Performance ≥ 80, PWA ≥ 90, Accessibility ≥ 90 |

## Security

| ID | Test | Expected |
|---|---|---|
| SEC01 | HttpOnly cookie sf_token | Cookie tidak readable via `document.cookie` di console |
| SEC02 | Logout invalidates session | Re-call API dengan old cookie → 401 |
| SEC03 | CSRF: POST tanpa cookie | 401 Unauthorized |
| SEC04 | Rate limit (60/min) | Setelah 60 req: 429 Too Many Requests |
| SEC05 | SQL injection di search field | Sanitized, no error |
| SEC06 | XSS di nama client | Escaped, render as text |

## Bug Reporting Template

Untuk setiap bug yang ditemukan:

```markdown
### Bug #N: [Short Title]
- **URL**: https://althea.fr-labs.my.id/path
- **Role**: clinic-admin / clinic-psikolog / etc.
- **Steps**:
  1. Login sebagai X
  2. Buka /path
  3. Klik Y
- **Expected**: ...
- **Actual**: ... (screenshot, error message)
- **Browser**: Chrome 130 / Safari 18 / etc.
- **Priority**: 🔴 Critical / 🟡 High / 🟢 Low
```

## Sign-off

UAT pass kalau:
- [ ] Semua test L01-L10 (login) ✅
- [ ] Master data CRUD (P/S/R/C/U) functional
- [ ] Booking flow end-to-end (wizard → state machine → cancel/reschedule)
- [ ] Psikolog workflow (mark complete + notes)
- [ ] Receptionist SSE realtime (2 tabs sync)
- [ ] WA notification kirim & log update
- [ ] Payment + PDF receipt
- [ ] Mobile responsive (3 device size minimum)
- [ ] Audit log catat semua mutation
- [ ] Tidak ada CRITICAL bugs

UAT date: ___________________
Sign-off by: ___________________

---

## Appendix: Dev Login Credentials

```
Username                    Password    Role
─────────────────────────────────────────────────────────
admin@althea.local          Test1234!   clinic-admin
psikolog@althea.local       Test1234!   clinic-psikolog
owner@althea.local          Test1234!   clinic-owner
resepsionis@althea.local    Test1234!   clinic-resepsionis
marketing@althea.local      Test1234!   clinic-marketing
intern@althea.local         Test1234!   clinic-intern

# Sample 7 psikolog dengan profile (bisa login sebagai mereka):
farah@althea.local          Test1234!   clinic-psikolog
budi@althea.local           Test1234!   clinic-psikolog
rina@althea.local           Test1234!   clinic-psikolog
dimas@althea.local          Test1234!   clinic-psikolog
sari@althea.local           Test1234!   clinic-psikolog
aditya@althea.local         Test1234!   clinic-psikolog
mira@althea.local           Test1234!   clinic-psikolog
```
