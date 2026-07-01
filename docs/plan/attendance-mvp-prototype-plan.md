# Sentient HR Attendance MVP Prototype Plan

Dokumen ini merangkum rencana pengerjaan MVP prototype `Sentient HR Attendance` di Sentient Factory dengan referensi utama dari pola produk seperti Jibble, tetapi disederhanakan untuk kebutuhan validasi cepat.

Scope tahap ini sengaja dibatasi ke:

1. prototype absensi end-to-end
2. fokus pada clock in, clock out, scan wajah dengan liveness, GPS, dan geofence
3. responsive mobile-first experience
4. dashboard dan riwayat dasar
5. tanpa payroll, tanpa shift engine kompleks, tanpa face recognition production-grade

## 0. Keputusan Produk Yang Sudah Fix

Keputusan yang sudah disepakati untuk fase ini:

1. fitur attendance masuk ke group menu `HR`
2. posisi menu `HR` ada di bawah `Dashboard`
3. parent menu final memakai nama `HR`
4. `Face Enrollment` bukan menu terpisah, tetapi tombol dari halaman `Attendance`
5. `Attendance Dashboard` memakai route yang sama untuk employee dan admin, dengan tampilan berbeda berdasarkan role
6. `Attendance History` menjadi satu halaman universal
7. `Worksites & Geofences` dikelola dari UI
8. `Attendance Exceptions` cukup masuk dashboard internal manager/admin, bukan menu terpisah
9. role mapping menu belum perlu dibatasi pada tahap awal
10. database target adalah PostgreSQL `127.0.0.1:3208`
11. login pegawai memakai tabel user existing app
12. route tetap mengikuti pola existing app
13. prefix tabel attendance memakai `hr_*`
14. halaman attendance harus mobile-first
15. snapshot wajah audit disimpan di database sebagai ref/path, bukan blob langsung
16. menu `Settings` disiapkan di plan tetapi disembunyikan dulu sampai benar-benar dipakai
17. scope domain `HR` pada fase ini hanya attendance
18. user setelah login tetap masuk ke dashboard umum lebih dulu
19. face detection untuk MVP memakai MediaPipe Tasks Vision di frontend, dengan fallback blok aman bila detector gagal tersedia, serta embedding ringan di frontend
20. snapshot audit disimpan ke local storage path
21. setiap user hanya punya 1 worksite default pada MVP
22. clock in/out di luar geofence tetap dicatat sebagai exception/manual review
23. GPS atau kamera gagal boleh disimpan sebagai failed attempt untuk audit
24. fase awal hanya menargetkan responsive mobile UI, bukan PWA installable penuh
25. menu `HR` akan langsung ditulis ke tabel menu existing
26. source role existing berasal dari tabel `public.m0_role`
27. mapping user-role existing berasal dari tabel `public.m0_user_role`
28. menu existing disimpan di tabel `public.m0_menu`
29. mapping role-menu existing disimpan di tabel `public.m0_role_menu`

## 1. Tujuan

Tujuan fase MVP:

1. membuktikan flow absensi mobile/web berjalan dari awal sampai akhir
2. memvalidasi UX absensi berbasis wajah dan lokasi
3. menyiapkan fondasi data untuk attendance record, audit, dan report dasar
4. mengurangi risiko salah arah sebelum masuk implementasi production
5. menegaskan positioning fitur ini sebagai bagian dari domain `Sentient HR`

## 2. Prinsip Produk

Prinsip prototype ini:

1. flow absensi harus sesingkat mungkin
2. verifikasi wajah harus memakai liveness, bukan upload foto statis
3. lokasi harus tercatat di setiap event clock in/out
4. jika lokasi tidak valid, sistem tidak diam; sistem harus menandai exception dengan alasan yang jelas
5. manager harus bisa melihat siapa yang sedang bekerja dan di mana
6. semua keputusan sensitif harus punya audit trail
7. user pegawai harus bisa memakai attendance dengan nyaman dari layar mobile

## 3. Struktur Menu HR

Parent menu:

1. `HR`

Submenu fase awal:

1. `Attendance`
2. `Attendance History`
3. `Attendance Dashboard`
4. `Worksites & Geofences`

Submenu yang disiapkan tetapi disembunyikan dulu:

1. `Settings`

Path yang diusulkan:

1. `/app/hr/attendance`
2. `/app/hr/attendance-history`
3. `/app/hr/attendance-dashboard`
4. `/app/hr/worksites`
5. `/app/hr/settings`

Catatan:

1. `Face Enrollment` tidak muncul di sidebar
2. `Attendance Exceptions` masuk sebagai panel internal di dashboard admin
3. menu `HR` akan langsung ditulis ke tabel menu existing
4. pembatasan role final dilakukan belakangan setelah role existing diverifikasi
5. icon parent dan submenu disesuaikan dengan konteks HR, attendance, history, dashboard, dan worksite

## 3.1 Temuan Struktur Existing

Temuan dari database PostgreSQL `127.0.0.1:3208`:

1. tabel role existing adalah `public.m0_role`
2. tabel user-role existing adalah `public.m0_user_role`
3. tabel menu existing adalah `public.m0_menu`
4. tabel role-menu existing adalah `public.m0_role_menu`

Kolom penting `m0_menu`:

1. `id`
2. `key`
3. `title`
4. `path`
5. `icon`
6. `type`
7. `parent_id`
8. `sort_order`
9. `is_visible`
10. `is_active`
11. `permission_name`

Kolom penting `m0_role`:

1. `id`
2. `name`
3. `description`
4. `is_system`

Role aktif utama yang ditemukan:

1. `admin`
2. `manager`
3. `user`

Catatan:

1. ada beberapa role lama lain, tetapi sebagian sudah soft-deleted
2. untuk fase awal, source role yang paling relevan adalah `admin`, `manager`, dan `user`

Pola menu existing yang relevan:

1. parent menu `Dashboard` ada dengan `id=1` dan `sort_order=2`
2. parent menu `Administrator` ada dengan `id=3` dan `sort_order=3`
3. parent menu `Alerting` ada dengan `sort_order=2`
4. karena `HR` diminta berada di bawah `Alerting`, `sort_order` parent `HR` perlu ditempatkan setelah group `Alerting`

Keputusan tambahan:

1. group `HR` diletakkan di bawah group `Alerting`
2. icon menu mengikuti konteks fitur, bukan icon generik acak
3. title submenu final tetap:
   - `Attendance`
   - `Attendance History`
   - `Attendance Dashboard`
   - `Worksites & Geofences`

## 4. Scope MVP

Fitur yang masuk MVP:

1. employee login memakai user existing app
2. group menu `HR` di sidebar
3. employee clock in
4. employee clock out
5. face scan enrollment awal
6. liveness check saat absensi
7. GPS capture saat clock in/out
8. geofence validation untuk lokasi kerja
9. attendance history milik user
10. manager/admin dashboard attendance dasar
11. employee self dashboard ringkas
12. exception status dasar:
   - outside geofence
   - face mismatch
   - gps unavailable
   - missing clock out
13. selfie / face snapshot audit
14. CRUD `Worksites & Geofences`
15. responsive mobile attendance page
16. failed attempt logging untuk kasus GPS/kamera/face validation gagal

Yang belum masuk MVP:

1. payroll integration
2. timesheet approval kompleks
3. shift planning lengkap
4. overtime rules detail
5. live tracking terus-menerus sepanjang hari
6. route playback
7. spoof detection production-grade dengan model biometrik sendiri
8. kiosk mode multi-user
9. face recognition 1:N skala besar
10. offline sync penuh
11. role-menu restriction final
12. settings page penuh di sidebar
13. PWA installable manifest dan standalone mode penuh

## 5. Outcome Yang Harus Terlihat di Demo

Dalam demo MVP, user harus bisa:

1. login memakai akun existing app
2. masuk ke dashboard umum
3. masuk ke menu `HR`
4. melakukan enrollment wajah dari halaman `Attendance`
5. melihat status hari ini: belum clock in / sedang bekerja / sudah clock out
6. melakukan clock in dengan:
   - izin kamera
   - liveness check
   - ambil GPS
   - validasi geofence
7. melakukan clock out dengan flow yang sama
8. melihat riwayat attendance pribadi
9. employee melihat dashboard ringkas miliknya
10. admin melihat daftar attendance tim hari ini
11. admin mengelola worksite dan geofence dari UI
12. admin melihat exception dan failed attempts

## 6. Persona Utama

### 6.1 Employee

Tujuan:

1. absen cepat
2. tidak bingung apakah clock in berhasil
3. tahu kalau absensi ditolak atau diberi exception dan alasannya
4. nyaman dipakai dari layar ponsel

### 6.2 Supervisor / Manager

Tujuan:

1. melihat siapa yang sudah clock in
2. melihat siapa yang telat atau bermasalah
3. melihat lokasi dan status validasi absensi

### 6.3 Admin

Tujuan:

1. mengatur lokasi kerja / geofence
2. melihat audit log absensi
3. membantu jika user gagal enrollment atau face mismatch

## 7. User Flow MVP

### 7.1 Login Pegawai

Flow:

1. user login memakai auth existing app
2. sistem membaca user login dari tabel user existing
3. jika user terkait profil `hr_users`, sistem mengaktifkan flow attendance
4. user masuk ke dashboard umum existing app
5. employee membuka menu `HR` untuk masuk ke flow attendance
6. admin tetap bisa masuk ke dashboard attendance lengkap

### 7.2 Enrollment Wajah

Flow:

1. user buka halaman `Sentient HR Attendance`
2. jika belum enroll, user klik tombol `Face Enrollment`
3. sistem minta izin kamera
4. frontend menjalankan face detection memakai MediaPipe Tasks Vision, lalu fallback hanya untuk memblok submit secara aman bila detector tidak tersedia
5. user mengikuti instruksi pose ringan:
   - lihat depan
   - putar sedikit kiri
   - putar sedikit kanan
   - kedip atau gerakkan kepala
6. sistem menyimpan:
   - face embedding/template
   - enrollment snapshots
   - quality score
7. status user menjadi `face_enrolled`
8. snapshot audit disimpan sebagai ref/path ke local storage

### 7.3 Clock In

Flow:

1. user buka halaman `Sentient HR Attendance`
2. sistem cek status attendance hari ini
3. user klik `Clock In`
4. sistem jalankan:
   - camera capture
   - liveness challenge singkat
   - face verification 1:1 terhadap template user
   - GPS capture
   - geofence validation
5. jika lolos, sistem membuat record clock in
6. jika di luar geofence, sistem tetap simpan event/session dengan status exception/manual review
7. jika kamera atau GPS gagal, sistem tetap simpan failed attempt untuk audit
8. jika gagal, sistem tampilkan alasan yang jelas

### 7.4 Clock Out

Flow:

1. user klik `Clock Out`
2. sistem jalankan face verification lagi
3. sistem ambil GPS lagi
4. sistem update attendance session aktif
5. sistem hitung durasi kerja dasar
6. jika di luar geofence, status disimpan sebagai exception/manual review

### 7.5 Manager Monitoring

Flow:

1. manager atau admin buka `Sentient HR Attendance Dashboard`
2. sistem menampilkan tampilan sesuai role
3. admin melihat:
   - siapa yang sedang clocked in
   - siapa yang belum masuk
   - siapa yang punya exception
4. employee hanya melihat status attendance miliknya sendiri
5. admin bisa buka detail per user
6. panel exception menampilkan failed attempts dan outside geofence cases

## 8. Modul UI Yang Diusulkan

### 8.1 Sentient HR Employee Attendance Page

Komponen:

1. card status hari ini
2. tombol `Clock In`
3. tombol `Clock Out`
4. status lokasi valid / invalid
5. status face verification
6. riwayat hari ini
7. tombol `Face Enrollment` jika belum enroll
8. layout mobile-first
9. action area besar dan nyaman untuk layar ponsel
10. responsive mobile UI tanpa ketergantungan ke app native

### 8.2 Sentient HR Face Enrollment Flow

Komponen:

1. live camera preview
2. instruction steps
3. progress indicator
4. capture quality feedback
5. enrollment success state
6. implementasi deteksi wajah awal memakai MediaPipe via TensorFlow.js

### 8.3 Sentient HR Attendance History Page

Komponen:

1. filter tanggal
2. daftar attendance
3. jam masuk
4. jam keluar
5. durasi
6. lokasi
7. status validasi
8. mode employee: data pribadi
9. mode admin: filter semua user

### 8.4 Sentient HR Attendance Dashboard

Mode employee:

1. status hari ini
2. jam masuk
3. jam keluar
4. durasi kerja
5. exception pribadi jika ada

Mode admin:

1. summary cards
2. daftar user hari ini
3. status clock in/out
4. badge exception
5. lokasi terakhir
6. detail drawer per user
7. panel exception internal
8. panel failed attempts

### 8.5 Sentient HR Worksites & Geofences

Komponen:

1. daftar lokasi kerja
2. nama lokasi
3. radius geofence
4. latitude / longitude
5. active toggle
6. create / edit form

## 9. Data Model MVP

### 9.1 hr_users

Field inti:

1. `id`
2. `user_id`
3. `employee_code`
4. `face_enrollment_status`
5. `face_template_version`
6. `default_worksite_id`
7. `is_active`
8. `employee_role_type`

Catatan:

1. `user_id` mengarah ke user login existing app
2. `hr_users` menjadi extension profile attendance, bukan sistem auth baru
3. `default_worksite_id` tetap menjadi lokasi utama, tetapi pegawai bisa punya banyak worksite tambahan lewat relasi `hr_user_worksites`

### 9.2 hr_worksites

Field inti:

1. `id`
2. `name`
3. `code`
4. `latitude`
5. `longitude`
6. `radius_meters`
7. `is_active`

### 9.3 hr_attendance_sessions

Field inti:

1. `id`
2. `user_id`
3. `work_date`
4. `clock_in_at`
5. `clock_out_at`
6. `clock_in_latitude`
7. `clock_in_longitude`
8. `clock_out_latitude`
9. `clock_out_longitude`
10. `clock_in_worksite_id`
11. `clock_out_worksite_id`
12. `clock_in_status`
13. `clock_out_status`
14. `clock_in_face_score`
15. `clock_out_face_score`
16. `clock_in_liveness_score`
17. `clock_out_liveness_score`
18. `total_work_minutes`

### 9.4 hr_user_worksites

Tujuan:

1. mendukung lebih dari satu tempat kerja per pegawai
2. menjaga lokasi utama tetap tersimpan di `hr_users.default_worksite_id`

Field inti:

1. `id`
2. `user_id`
3. `worksite_id`
4. `assigned_at`

### 9.5 hr_attendance_events

Tujuan:

1. audit log event granular
2. simpan semua percobaan, termasuk yang gagal

Field inti:

1. `id`
2. `user_id`
3. `session_id`
4. `event_type`
5. `event_at`
6. `result`
7. `reason_code`
8. `latitude`
9. `longitude`
10. `face_score`
11. `liveness_score`
12. `device_info`
13. `snapshot_url`
14. `metadata_json`

### 9.5 hr_face_enrollments

Field inti:

1. `id`
2. `user_id`
3. `template_ref`
4. `quality_score`
5. `enrolled_at`
6. `is_active`

### 9.6 hr_settings

Field inti:

1. `id`
2. `setting_key`
3. `setting_value`
4. `setting_group`
5. `is_active`

Catatan:

1. tabel ini disiapkan dari awal
2. halaman `Settings` belum perlu ditampilkan di sidebar

## 10. Status dan Reason Code

Status utama:

1. `success`
2. `warning`
3. `rejected`
4. `manual_review`

Reason code awal:

1. `face_not_enrolled`
2. `face_mismatch`
3. `liveness_failed`
4. `gps_denied`
5. `gps_unavailable`
6. `outside_geofence`
7. `already_clocked_in`
8. `no_active_session`
9. `camera_denied`
10. `low_image_quality`

## 11. Validasi Inti

Validasi saat clock in:

1. user aktif
2. belum punya session aktif hari ini
3. face enrollment tersedia
4. liveness score di atas threshold
5. face match score di atas threshold
6. GPS tersedia
7. lokasi berada dalam geofence yang diizinkan
8. jika di luar geofence, status dialihkan ke exception/manual review, bukan hard reject mutlak

Validasi saat clock out:

1. ada session aktif
2. liveness score valid
3. face match score valid
4. GPS tersedia
5. simpan lokasi akhir
6. jika di luar geofence, tandai exception/manual review

## 12. Arsitektur Teknis MVP

Pendekatan pragmatis:

1. frontend menangani camera preview dan GPS capture
2. backend menangani validasi bisnis dan persistence
3. face detection frontend untuk MVP memakai MediaPipe Tasks Vision, dengan fallback blok aman bila detector tidak tersedia
4. audit snapshot disimpan terpisah dari data inti
5. auth tetap memakai sistem existing app
6. halaman employee dirancang mobile-first dengan responsive web UI
7. snapshot audit disimpan sebagai local storage path

Komponen:

1. web/mobile attendance UI
2. attendance API
3. MediaPipe Tasks Vision face detection + embedding layer di frontend
4. geofence validator
5. attendance storage
6. local file storage untuk snapshot audit
7. existing auth/session layer

## 13. Batasan MVP

Batasan yang sengaja diterima:

1. liveness pada MVP cukup challenge-based, belum anti-spoofing kelas enterprise
2. akurasi GPS mengikuti device user
3. belum ada background live location tracking
4. belum ada offline queue penuh
5. belum ada multi-geofence rules yang rumit
6. belum ada app mobile native terpisah
7. belum ada PWA installable penuh

## 14. Risiko Utama

### 14.1 Risiko Produk

1. user merasa flow absensi terlalu panjang
2. GPS indoor bisa tidak stabil
3. wajah user bisa gagal terdeteksi pada device kamera rendah

### 14.2 Risiko Teknis

1. false reject pada face verification
2. liveness challenge terlalu lemah
3. performa simpan snapshot lokal dan akses file bisa bervariasi
4. kualitas deteksi MediaPipe bisa berbeda antar device

### 14.3 Mitigasi

1. jaga flow maksimal 3 langkah utama
2. simpan reason code yang jelas
3. siapkan fallback `manual review`
4. pakai threshold yang konservatif di prototype
5. simpan failed attempt agar debugging operasional lebih mudah

## 15. Rekomendasi Scope Demo Pertama

Untuk demo pertama, cukup fokus ke:

1. login
2. menu `HR`
3. face enrollment dari halaman attendance
4. clock in
5. clock out
6. riwayat attendance user
7. employee self dashboard
8. admin dashboard hari ini
9. worksite dan geofence management dasar

Yang sebaiknya belum dibawa ke demo pertama:

1. schedule engine
2. leave management
3. payroll
4. kiosk mode
5. live route tracking
6. settings page penuh

## 16. Deliverable MVP

Deliverable yang diharapkan:

1. halaman `Sentient HR Attendance`
2. flow `Sentient HR Face Enrollment` dari halaman `Attendance`
3. halaman `Sentient HR Attendance History`
4. halaman `Sentient HR Attendance Dashboard`
5. halaman `Sentient HR Worksites & Geofences`
6. dummy atau semi-real API untuk attendance event
7. schema database dasar `hr_*`
8. prototype flow yang bisa didemokan end-to-end
9. mobile-first responsive attendance experience

## 17. Next Step Setelah Dokumen Ini

Urutan kerja yang masuk akal:

1. finalkan scope MVP
2. finalkan struktur menu `HR`
3. finalkan data model `hr_*`
4. tentukan angka `sort_order` parent dan child menu `HR` di `m0_menu`
5. siapkan draft insert menu ke `m0_menu`
6. buat wireframe halaman utama mobile-first
7. rancang integrasi MediaPipe face detection di frontend
8. implement halaman employee lebih dulu
9. sambungkan employee flow ke user existing app
10. implement dashboard manager sesudah flow employee stabil

## 18. Implementasi Runnable Sekali Run

Tujuan section ini:

1. menjadikan dokumen ini cukup konkret untuk dijadikan basis implementasi langsung
2. menyediakan draft SQL yang bisa dieksekusi bertahap di PostgreSQL `127.0.0.1:3208`
3. memastikan menu `HR` dan schema `hr_*` bisa selesai dalam satu batch kerja

Temuan existing yang dipakai sebagai dasar:

1. tabel user existing app adalah `public.m0_users`
2. primary key user existing adalah `m0_users.id integer`
3. tabel menu existing adalah `public.m0_menu`
4. tabel role-menu existing adalah `public.m0_role_menu`
5. tabel role existing adalah `public.m0_role`
6. tabel user-role existing adalah `public.m0_user_role`

## 19. Draft SQL Schema `hr_*`

Catatan:

1. draft ini ditujukan untuk PostgreSQL
2. relasi user mengarah ke `public.m0_users(id)`
3. snapshot disimpan sebagai `text` path/ref
4. pada MVP, satu user hanya punya satu `default_worksite_id`

```sql
BEGIN;

CREATE TABLE IF NOT EXISTS public.hr_worksites (
  id              serial PRIMARY KEY,
  name            text NOT NULL,
  code            text NOT NULL UNIQUE,
  latitude        numeric(10,7) NOT NULL,
  longitude       numeric(10,7) NOT NULL,
  radius_meters   integer NOT NULL CHECK (radius_meters > 0),
  is_active       boolean NOT NULL DEFAULT true,
  created_at      timestamp without time zone NOT NULL DEFAULT now(),
  created_by      integer,
  updated_at      timestamp without time zone,
  updated_by      integer,
  deleted_at      timestamp without time zone,
  deleted_by      integer
);

CREATE INDEX IF NOT EXISTS hr_worksites_is_active_idx
  ON public.hr_worksites (is_active);

CREATE TABLE IF NOT EXISTS public.hr_users (
  id                      serial PRIMARY KEY,
  user_id                 integer NOT NULL UNIQUE,
  employee_code           text,
  face_enrollment_status  text NOT NULL DEFAULT 'not_enrolled',
  face_template_version   integer NOT NULL DEFAULT 1,
  default_worksite_id     integer,
  is_active               boolean NOT NULL DEFAULT true,
  employee_role_type      text NOT NULL DEFAULT 'employee',
  created_at              timestamp without time zone NOT NULL DEFAULT now(),
  created_by              integer,
  updated_at              timestamp without time zone,
  updated_by              integer,
  deleted_at              timestamp without time zone,
  deleted_by              integer,
  CONSTRAINT hr_users_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES public.m0_users(id) ON DELETE CASCADE,
  CONSTRAINT hr_users_default_worksite_id_fkey
    FOREIGN KEY (default_worksite_id) REFERENCES public.hr_worksites(id) ON DELETE SET NULL,
  CONSTRAINT hr_users_face_enrollment_status_chk
    CHECK (face_enrollment_status IN ('not_enrolled', 'enrolled', 'disabled'))
);

CREATE INDEX IF NOT EXISTS hr_users_default_worksite_id_idx
  ON public.hr_users (default_worksite_id);

CREATE INDEX IF NOT EXISTS hr_users_employee_role_type_idx
  ON public.hr_users (employee_role_type);

CREATE TABLE IF NOT EXISTS public.hr_face_enrollments (
  id              serial PRIMARY KEY,
  user_id         integer NOT NULL,
  template_ref    text NOT NULL,
  quality_score   numeric(5,2),
  snapshot_url    text,
  enrolled_at     timestamp without time zone NOT NULL DEFAULT now(),
  is_active       boolean NOT NULL DEFAULT true,
  created_at      timestamp without time zone NOT NULL DEFAULT now(),
  created_by      integer,
  updated_at      timestamp without time zone,
  updated_by      integer,
  deleted_at      timestamp without time zone,
  deleted_by      integer,
  CONSTRAINT hr_face_enrollments_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES public.hr_users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS hr_face_enrollments_user_id_idx
  ON public.hr_face_enrollments (user_id);

CREATE INDEX IF NOT EXISTS hr_face_enrollments_is_active_idx
  ON public.hr_face_enrollments (is_active);

CREATE TABLE IF NOT EXISTS public.hr_attendance_sessions (
  id                        serial PRIMARY KEY,
  user_id                   integer NOT NULL,
  work_date                 date NOT NULL,
  clock_in_at               timestamp without time zone,
  clock_out_at              timestamp without time zone,
  clock_in_latitude         numeric(10,7),
  clock_in_longitude        numeric(10,7),
  clock_out_latitude        numeric(10,7),
  clock_out_longitude       numeric(10,7),
  clock_in_worksite_id      integer,
  clock_out_worksite_id     integer,
  clock_in_status           text,
  clock_out_status          text,
  clock_in_face_score       numeric(5,2),
  clock_out_face_score      numeric(5,2),
  clock_in_liveness_score   numeric(5,2),
  clock_out_liveness_score  numeric(5,2),
  total_work_minutes        integer,
  created_at                timestamp without time zone NOT NULL DEFAULT now(),
  created_by                integer,
  updated_at                timestamp without time zone,
  updated_by                integer,
  deleted_at                timestamp without time zone,
  deleted_by                integer,
  CONSTRAINT hr_attendance_sessions_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES public.hr_users(id) ON DELETE CASCADE,
  CONSTRAINT hr_attendance_sessions_clock_in_worksite_id_fkey
    FOREIGN KEY (clock_in_worksite_id) REFERENCES public.hr_worksites(id) ON DELETE SET NULL,
  CONSTRAINT hr_attendance_sessions_clock_out_worksite_id_fkey
    FOREIGN KEY (clock_out_worksite_id) REFERENCES public.hr_worksites(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS hr_attendance_sessions_user_id_work_date_idx
  ON public.hr_attendance_sessions (user_id, work_date);

CREATE INDEX IF NOT EXISTS hr_attendance_sessions_work_date_idx
  ON public.hr_attendance_sessions (work_date);

CREATE TABLE IF NOT EXISTS public.hr_attendance_events (
  id              serial PRIMARY KEY,
  user_id         integer NOT NULL,
  session_id      integer,
  event_type      text NOT NULL,
  event_at        timestamp without time zone NOT NULL DEFAULT now(),
  result          text NOT NULL,
  reason_code     text,
  latitude        numeric(10,7),
  longitude       numeric(10,7),
  face_score      numeric(5,2),
  liveness_score  numeric(5,2),
  device_info     jsonb,
  snapshot_url    text,
  metadata_json   jsonb,
  created_at      timestamp without time zone NOT NULL DEFAULT now(),
  created_by      integer,
  updated_at      timestamp without time zone,
  updated_by      integer,
  deleted_at      timestamp without time zone,
  deleted_by      integer,
  CONSTRAINT hr_attendance_events_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES public.hr_users(id) ON DELETE CASCADE,
  CONSTRAINT hr_attendance_events_session_id_fkey
    FOREIGN KEY (session_id) REFERENCES public.hr_attendance_sessions(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS hr_attendance_events_user_id_event_at_idx
  ON public.hr_attendance_events (user_id, event_at);

CREATE INDEX IF NOT EXISTS hr_attendance_events_event_type_idx
  ON public.hr_attendance_events (event_type);

CREATE INDEX IF NOT EXISTS hr_attendance_events_result_idx
  ON public.hr_attendance_events (result);

CREATE TABLE IF NOT EXISTS public.hr_settings (
  id            serial PRIMARY KEY,
  setting_key   text NOT NULL UNIQUE,
  setting_value text,
  setting_group text NOT NULL DEFAULT 'attendance',
  is_active     boolean NOT NULL DEFAULT true,
  created_at    timestamp without time zone NOT NULL DEFAULT now(),
  created_by    integer,
  updated_at    timestamp without time zone,
  updated_by    integer,
  deleted_at    timestamp without time zone,
  deleted_by    integer
);

CREATE INDEX IF NOT EXISTS hr_settings_setting_group_idx
  ON public.hr_settings (setting_group);

COMMIT;
```

## 20. Draft SQL Insert Menu `HR`

Catatan:

1. posisi parent `HR` harus berada di bawah group `Alerting`
2. karena `Alerting` saat ini memakai `sort_order = 2`, draft ini memakai pendekatan aman:
   - parent `HR` diberi `sort_order = 3`
   - child menu diurutkan mulai `1`
3. bila nanti ada benturan `sort_order` dengan parent lain, penyesuaian urutan bisa dilakukan tanpa mengubah `key`
4. icon disesuaikan dengan konteks fitur:
   - `HR` = `users`
   - `Attendance` = `clock`
   - `Attendance History` = `history`
   - `Attendance Dashboard` = `layout-dashboard`
   - `Worksites & Geofences` = `map-pinned`

```sql
BEGIN;

WITH parent_upsert AS (
  INSERT INTO public.m0_menu (
    key,
    title,
    path,
    icon,
    type,
    parent_id,
    sort_order,
    is_visible,
    is_active,
    permission_name,
    created_at
  )
  VALUES (
    'hr',
    'HR',
    '',
    'users',
    'group',
    NULL,
    3,
    true,
    true,
    'menu.hr',
    now()
  )
  ON CONFLICT (key) DO UPDATE
    SET title = EXCLUDED.title,
        icon = EXCLUDED.icon,
        type = EXCLUDED.type,
        sort_order = EXCLUDED.sort_order,
        is_visible = EXCLUDED.is_visible,
        is_active = EXCLUDED.is_active,
        permission_name = EXCLUDED.permission_name,
        updated_at = now()
  RETURNING id
),
parent_id_source AS (
  SELECT id FROM parent_upsert
  UNION ALL
  SELECT id FROM public.m0_menu WHERE key = 'hr'
  LIMIT 1
)
INSERT INTO public.m0_menu (
  key,
  title,
  path,
  icon,
  type,
  parent_id,
  sort_order,
  is_visible,
  is_active,
  permission_name,
  created_at
)
SELECT *
FROM (
  SELECT
    'hr-attendance'::text,
    'Attendance'::text,
    '/app/hr/attendance'::text,
    'clock'::text,
    'item'::text,
    (SELECT id FROM parent_id_source),
    1,
    true,
    true,
    'menu.hr.attendance'::text,
    now()
  UNION ALL
  SELECT
    'hr-attendance-history',
    'Attendance History',
    '/app/hr/attendance-history',
    'history',
    'item',
    (SELECT id FROM parent_id_source),
    2,
    true,
    true,
    'menu.hr.attendance_history',
    now()
  UNION ALL
  SELECT
    'hr-attendance-dashboard',
    'Attendance Dashboard',
    '/app/hr/attendance-dashboard',
    'layout-dashboard',
    'item',
    (SELECT id FROM parent_id_source),
    3,
    true,
    true,
    'menu.hr.attendance_dashboard',
    now()
  UNION ALL
  SELECT
    'hr-worksites',
    'Worksites & Geofences',
    '/app/hr/worksites',
    'map-pinned',
    'item',
    (SELECT id FROM parent_id_source),
    4,
    true,
    true,
    'menu.hr.worksites',
    now()
  UNION ALL
  SELECT
    'hr-settings',
    'Settings',
    '/app/hr/settings',
    'settings',
    'item',
    (SELECT id FROM parent_id_source),
    5,
    false,
    true,
    'menu.hr.settings',
    now()
) AS seed_data (
  key,
  title,
  path,
  icon,
  type,
  parent_id,
  sort_order,
  is_visible,
  is_active,
  permission_name,
  created_at
)
ON CONFLICT (key) DO UPDATE
  SET title = EXCLUDED.title,
      path = EXCLUDED.path,
      icon = EXCLUDED.icon,
      type = EXCLUDED.type,
      parent_id = EXCLUDED.parent_id,
      sort_order = EXCLUDED.sort_order,
      is_visible = EXCLUDED.is_visible,
      is_active = EXCLUDED.is_active,
      permission_name = EXCLUDED.permission_name,
      updated_at = now();

COMMIT;
```

## 21. Optional Draft Role-Menu Seed

Karena Anda sudah memutuskan role restriction belum perlu dipaksa dari awal, section ini opsional.

Kalau tetap ingin menu langsung terlihat untuk role utama existing, gunakan draft berikut:

```sql
BEGIN;

INSERT INTO public.m0_role_menu (
  role_id,
  menu_id,
  can_view,
  assigned_at,
  created_at
)
SELECT
  r.id,
  m.id,
  true,
  now(),
  now()
FROM public.m0_role r
CROSS JOIN public.m0_menu m
WHERE r.deleted_at IS NULL
  AND r.name IN ('admin', 'manager', 'user')
  AND m.deleted_at IS NULL
  AND m.key IN (
    'hr',
    'hr-attendance',
    'hr-attendance-history',
    'hr-attendance-dashboard',
    'hr-worksites',
    'hr-settings'
  )
  AND NOT EXISTS (
    SELECT 1
    FROM public.m0_role_menu rm
    WHERE rm.role_id = r.id
      AND rm.menu_id = m.id
      AND rm.deleted_at IS NULL
  );

COMMIT;
```

## 22. Execution Order

Urutan run yang disarankan:

1. jalankan schema `hr_*`
2. jalankan seeder menu `HR`
3. jika diperlukan, jalankan optional role-menu seed
4. buat seed minimal `hr_worksites`
5. buat seed minimal `hr_users` untuk user existing yang akan dites

## 23. Seed Minimal Untuk Testing

Contoh seed minimal worksite:

```sql
INSERT INTO public.hr_worksites (
  name,
  code,
  latitude,
  longitude,
  radius_meters,
  is_active,
  created_at
)
VALUES (
  'Head Office',
  'HQ',
  -6.2000000,
  106.8166000,
  100,
  true,
  now()
)
ON CONFLICT (code) DO UPDATE
  SET name = EXCLUDED.name,
      latitude = EXCLUDED.latitude,
      longitude = EXCLUDED.longitude,
      radius_meters = EXCLUDED.radius_meters,
      is_active = EXCLUDED.is_active,
      updated_at = now();
```

Contoh seed minimal `hr_users` dari user existing:

```sql
INSERT INTO public.hr_users (
  user_id,
  employee_code,
  face_enrollment_status,
  face_template_version,
  default_worksite_id,
  is_active,
  employee_role_type,
  created_at
)
SELECT
  u.id,
  'EMP-' || u.id::text,
  'not_enrolled',
  1,
  w.id,
  true,
  'employee',
  now()
FROM public.m0_users u
CROSS JOIN LATERAL (
  SELECT id
  FROM public.hr_worksites
  WHERE code = 'HQ'
  LIMIT 1
) w
WHERE u.deleted_at IS NULL
  AND u.username = 'admin'
ON CONFLICT (user_id) DO UPDATE
  SET default_worksite_id = EXCLUDED.default_worksite_id,
      is_active = EXCLUDED.is_active,
      employee_role_type = EXCLUDED.employee_role_type,
      updated_at = now();
```

## 24. Verification SQL

Verifikasi schema:

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN (
    'hr_worksites',
    'hr_users',
    'hr_face_enrollments',
    'hr_attendance_sessions',
    'hr_attendance_events',
    'hr_settings'
  )
ORDER BY table_name;
```

Verifikasi menu:

```sql
SELECT id, key, title, path, parent_id, sort_order, is_visible, is_active
FROM public.m0_menu
WHERE deleted_at IS NULL
  AND key IN (
    'hr',
    'hr-attendance',
    'hr-attendance-history',
    'hr-attendance-dashboard',
    'hr-worksites',
    'hr-settings'
  )
ORDER BY parent_id NULLS FIRST, sort_order, id;
```

Verifikasi role-menu:

```sql
SELECT r.name AS role_name, m.key AS menu_key, rm.can_view
FROM public.m0_role_menu rm
JOIN public.m0_role r ON r.id = rm.role_id
JOIN public.m0_menu m ON m.id = rm.menu_id
WHERE rm.deleted_at IS NULL
  AND r.deleted_at IS NULL
  AND m.deleted_at IS NULL
  AND m.key LIKE 'hr%'
ORDER BY r.name, m.key;
```

Verifikasi seed `hr_users`:

```sql
SELECT
  hu.id,
  hu.user_id,
  u.username,
  hu.employee_code,
  hu.face_enrollment_status,
  hu.employee_role_type,
  hw.code AS worksite_code
FROM public.hr_users hu
JOIN public.m0_users u ON u.id = hu.user_id
LEFT JOIN public.hr_worksites hw ON hw.id = hu.default_worksite_id
WHERE hu.deleted_at IS NULL
ORDER BY hu.id;
```

## 25. File SQL Yang Sudah Disiapkan

File runnable yang sudah diturunkan dari plan ini:

1. [sentient_hr_attendance_00_run_all.sql](/opt/sentient-factory/docs/sql/sentient_hr_attendance_00_run_all.sql)
2. [sentient_hr_attendance_01_schema.sql](/opt/sentient-factory/docs/sql/sentient_hr_attendance_01_schema.sql)
3. [sentient_hr_attendance_02_menu_seed.sql](/opt/sentient-factory/docs/sql/sentient_hr_attendance_02_menu_seed.sql)
4. [sentient_hr_attendance_03_seed_minimal.sql](/opt/sentient-factory/docs/sql/sentient_hr_attendance_03_seed_minimal.sql)
5. [sentient_hr_attendance_09_user_worksites.sql](/opt/sentient-factory/docs/sql/sentient_hr_attendance_09_user_worksites.sql)

Contoh eksekusi:

```bash
psql 'postgresql://root:PasswordSuperRahasia123!@127.0.0.1:3208/sentient_factory' \
  -f /opt/sentient-factory/docs/sql/sentient_hr_attendance_00_run_all.sql
```

## 26. Status Implementasi Saat Ini

Status yang sudah selesai:

1. schema `hr_*` sudah dibuat di PostgreSQL `127.0.0.1:3208`
2. menu `HR` dan submenu awal sudah masuk ke `m0_menu`
3. seed minimal `hr_worksites`, `hr_users`, dan `hr_settings` sudah dijalankan
4. icon menu `HR` sudah disesuaikan ke nama icon `lucide-react` yang valid
5. backend module dasar `HR Attendance` sudah ditambahkan di `api-gateway`
6. endpoint dasar yang sudah tersedia:
   - `/api/hr/attendance/me`
   - `/api/hr/attendance/history`
   - `/api/hr/attendance/dashboard`
   - `/api/hr/face-enrollment`
    - `/api/hr/attendance/clock-in`
    - `/api/hr/attendance/clock-out`
    - `/api/hr/worksites`
   - `/api/hr/users/:appUserId/worksites`
7. proxy route Next.js untuk `/api/hr/*` sudah ditambahkan di `web-dashboard`
8. halaman route frontend yang sudah discaffold:
   - `/app/hr/attendance`
   - `/app/hr/attendance-history`
   - `/app/hr/attendance-dashboard`
   - `/app/hr/worksites`
9. route `/app/hr/attendance` sudah terdaftar dan me-redirect ke login saat belum authenticated
10. smoke-test `/api/hr/attendance/me` dan `/api/hr/worksites` mengembalikan `401 Unauthorized` saat tanpa token, yang berarti route proxy hidup
11. flow frontend `Attendance` sekarang sudah memakai kamera browser secara live untuk:
   - face enrollment
   - clock in
   - clock out
12. halaman `Attendance` sudah memakai:
   - `navigator.mediaDevices.getUserMedia`
   - MediaPipe Tasks Vision
   - fallback blok aman bila detector gagal inisialisasi
   - capture snapshot `data:image/jpeg;base64,...`
   - `navigator.geolocation.getCurrentPosition` untuk clock in dan clock out
13. snapshot sekarang sudah dikirim ke backend write endpoint dan disimpan sebagai path/ref lokal oleh `api-gateway`
14. smoke-check route write:
   - `POST /api/hr/face-enrollment` tanpa token mengembalikan `405/401` sesuai proxy/method constraint
   - `GET /app/hr/attendance` tetap redirect ke login
15. verifikasi login seed berhasil dengan kredensial default dari `apps/api-gateway/prisma/seed.ts`:
   - `admin@example.com / Password123!`
   - `manager.eng@example.com / Password123!`
   - `staff.hr@example.com / Password123!`
16. verifikasi end-to-end API dengan user `manager.eng@example.com` berhasil:
   - `POST /api/hr/face-enrollment`
   - `POST /api/hr/attendance/clock-in`
   - `POST /api/hr/attendance/clock-out`
   - `GET /api/hr/attendance/me`
   - `GET /api/hr/attendance/history`
17. hasil write terverifikasi di PostgreSQL:
   - `hr_attendance_sessions`: 1 row untuk `user_id = 35`
   - `hr_attendance_events`: `face_enrollment`, `clock_in`, `clock_out`
18. role-aware dashboard terverifikasi:
   - `admin@example.com` menerima `mode = 'admin'`
   - `staff.hr@example.com` menerima `mode = 'self'`
19. snapshot file berhasil ditulis oleh backend ke path host-visible setelah bind mount:
   - [`temp/hr-attendance/enrollments`](/opt/sentient-factory/temp/hr-attendance/enrollments)
   - [`temp/hr-attendance/clock-in`](/opt/sentient-factory/temp/hr-attendance/clock-in)
   - [`temp/hr-attendance/clock-out`](/opt/sentient-factory/temp/hr-attendance/clock-out)
20. `api-gateway` sekarang memakai:
   - `HR_ATTENDANCE_STORAGE_PATH=/app/temp/hr-attendance`
   - bind mount `../temp/hr-attendance:/app/temp/hr-attendance`
21. storage snapshot tidak lagi murni `container-local`; file audit sekarang terlihat langsung dari workspace host
22. endpoint snapshot terotorisasi sudah tersedia:
   - `GET /api/hr/events/:eventId/snapshot`
   - akses dibatasi ke owner event atau role privileged
23. web-dashboard sudah punya proxy binary untuk snapshot:
   - [`app/api/hr/events/[eventId]/snapshot/route.ts`](/opt/sentient-factory/apps/web-dashboard/app/api/hr/events/[eventId]/snapshot/route.ts)
24. halaman `Attendance` sudah menampilkan thumbnail snapshot pada recent events dan membuka gambar lewat route proxy terotorisasi
25. endpoint audit client-side failure sudah tersedia:
   - `POST /api/hr/attendance/report-failure`
   - dipakai untuk kasus seperti `camera_denied`, `gps_denied`, `gps_timeout`, `face_not_detected`
26. frontend `Attendance` sekarang melaporkan failed attempt dari sisi browser ke audit log
27. verifikasi manual berhasil:
   - `clock_in_attempt / rejected / gps_denied` masuk ke `hr_attendance_events`
28. UX mobile `Attendance` sudah dipoles:
   - tombol `clock in/out` menunggu `face enrollment = enrolled`
   - status `manual_review` muncul sebagai banner eksplisit di halaman utama
   - hint aksi attendance tampil langsung di bawah tombol
29. progress tracker mobile sudah tersedia untuk urutan:
   - `Face Enrollment`
   - `Clock In`
   - `Clock Out`
30. build blocker dari `@tensorflow-models/face-detection` terhadap Turbopack sudah dihapus dari route `HR Attendance`
31. implementasi deteksi wajah frontend yang aktif sekarang memakai MediaPipe Tasks Vision dengan fallback blok aman agar submit tidak bisa lolos palsu saat detector gagal tersedia
32. layout halaman `Attendance` sudah direfaktor ke single-column mobile-first dengan container terpusat
33. ringkasan profil pegawai dipindahkan ke summary banner ringkas di bagian atas halaman
34. area CTA utama `Attendance` sudah dirapikan menjadi status header + primary action block yang lebih dominan
35. `Face Enrollment` dipindahkan menjadi secondary action, bukan CTA utama harian
36. komponen `Recent Attendance Events` sudah diubah dari kartu vertikal besar menjadi timeline/list padat dengan fallback avatar jika snapshot gagal dimuat
37. progress box harian yang besar sudah dihapus agar tidak duplikatif dengan status header
38. blok `Aksi Utama` sekarang memakai tema terang dan render kondisional:
   - jika absensi selesai, tombol aksi harian disembunyikan
   - jika user baru bisa `jam masuk`, hanya tombol `Jam Masuk` yang tampil
   - jika user hanya bisa `jam pulang`, hanya tombol `Jam Pulang` yang tampil
39. `Jam Masuk`, `Jam Pulang`, dan `Lokasi Kerja` sekarang ditampilkan sebagai stats grid 3 kolom dengan ikon
40. header status attendance sudah dipadatkan untuk mobile:
   - subtitle halaman di bawah judul utama dihapus
   - badge status dan `Total Jam` ditempatkan inline di area header
41. tombol `Pendaftaran Wajah` dipindahkan menjadi secondary full-width button di area profil atas
42. stats attendance sekarang dikonsolidasikan ke dalam satu container ringkas dengan divider halus
43. list `Riwayat Event Absensi` sudah dipadatkan lagi agar lebih banyak item terlihat di viewport mobile
44. halaman HR lain (`Riwayat Absensi`, `Dashboard Absensi`, `Lokasi Kerja & Geofence`) juga sudah dirapikan ke pola mobile-first yang lebih ringkas
45. tabel lebar pada `Riwayat Absensi` diganti menjadi daftar kartu padat yang lebih cocok untuk layar kecil
46. `Dashboard Absensi` diringkas menjadi metric cards dan list operasional yang lebih ringan untuk mobile
47. `Lokasi Kerja & Geofence` dirapikan menjadi form atas + daftar lokasi kerja padat di bawah
48. daftar lokasi kerja sekarang punya fitur edit langsung untuk nama, kode, koordinat, radius, dan status aktif
49. layer presentasi dashboard sekarang mulai menghumanisasi data mentah:
   - timestamp tidak lagi ditampilkan sebagai ISO string mentah
   - enum teknis seperti `clock_in`, `clock_out`, `outside_geofence`, `gps_denied` dipetakan ke bahasa operasional HR
   - status badge seperti `manual_review`, `success`, `rejected` ditampilkan sebagai label manusiawi
50. kartu exception di dashboard dibedakan secara visual dari log normal agar HR lebih cepat mengenali item kritikal
51. flow lanjutan `Perlu Review` sudah didefinisikan sebagai next implementation target untuk HR attendance exception handling
52. validasi wajah attendance sekarang tidak lagi hanya mengandalkan snapshot; flow enrollment dan absensi sudah memakai kombinasi:
53. `Lokasi Kerja & Geofence` kini memakai split view: daftar lokasi di kiri, penugasan pegawai di kanan, dan modal `Tambah Lokasi` memakai peta interaktif + slider radius agar geofence tidak lagi diinput manual
   - face detection di frontend
   - face embedding numerik yang dikirim ke backend
   - face verification 1:1 terhadap embedding enrollment aktif
52. schema `hr_face_enrollments` sudah diperluas dengan field:
   - `embedding_json`
   - `detector_metadata`
   melalui migration:
   - [`sentient_hr_attendance_06_face_embedding_schema.sql`](/opt/sentient-factory/docs/sql/sentient_hr_attendance_06_face_embedding_schema.sql)
53. `run_all` SQL sudah diperbarui agar migration face embedding ikut dijalankan:
   - [`sentient_hr_attendance_00_run_all.sql`](/opt/sentient-factory/docs/sql/sentient_hr_attendance_00_run_all.sql)
54. payload frontend/backend untuk:
   - `POST /api/hr/face-enrollment`
   - `POST /api/hr/attendance/clock-in`
   - `POST /api/hr/attendance/clock-out`
   sekarang sudah membawa:
   - `faceEmbedding`
   - `faceDetectionCount`
   - `faceDetectionMode`
55. backend `HR Attendance` sekarang memaksa adanya embedding valid pada enrollment dan attendance write
56. backend membandingkan embedding input dengan enrollment aktif memakai cosine similarity
57. threshold minimum similarity saat ini diset `0.82`
58. bila similarity di bawah threshold, backend menolak write attendance dengan:
   - `reason_code = face_mismatch`
   - event audit `rejected`
59. metadata detector sekarang ikut tersimpan untuk audit, termasuk:
   - jumlah wajah terdeteksi
   - mode deteksi wajah
   - dimensi embedding
60. frontend `Attendance` sekarang membangun embedding ringan dari frame kamera dengan crop wajah aktif:
   - memakai bounding box hasil MediaPipe Tasks Vision saat detector aktif
   - memblok submit bila detector tidak tersedia, alih-alih memakai center crop palsu
61. frontend HR lokal sudah bersih dari error typecheck setelah penambahan flow face embedding
62. `api-gateway` typecheck untuk perubahan face embedding lolos
63. smoke test enrollment dengan embedding berhasil:
   - row `hr_face_enrollments` terbaru memiliki `embedding_json` dan `detector_metadata`
64. smoke test clock in dengan embedding yang sama berhasil:
   - session tersimpan
   - `clock_in_face_score` terisi dari similarity backend
65. jalur reject `face_mismatch` juga sudah terverifikasi dari data audit:
   - event terbaru dengan `reason_code = face_mismatch` tercatat di `hr_attendance_events`
66. saat pengecekan terakhir, service API host `127.0.0.1:3001` sedang tidak listen dari shell host, sehingga smoke test HTTP langsung dari host perlu dijalankan lagi setelah service aktif
67. fitur identifikasi wajah 1:N sekarang sudah ditambahkan untuk pre-check identitas sebelum submit attendance
68. endpoint backend baru tersedia:
   - `POST /api/hr/attendance/face-identify`
69. route proxy Next.js baru tersedia:
   - `/api/hr/attendance/face-identify`
70. backend `face-identify` membandingkan embedding input terhadap seluruh enrollment aktif yang tersimpan di database
71. hasil identifikasi mengembalikan kandidat terbaik berikut:
   - nama / username
   - employee code
   - similarity
   - flag apakah kandidat itu sama dengan akun login saat ini
72. backend `face-identify` sekarang juga mengembalikan `topMatches` berisi maksimal 3 kandidat teratas
73. UI `Attendance` menampilkan daftar kandidat teratas ini sebagai chips ringkas di panel kamera
74. submit attendance sekarang diblok di frontend bila hasil identifikasi kuat tetapi wajah lebih cocok ke akun lain yang sedang tidak login
75. flow `Pendaftaran Wajah` sekarang dibedakan dari flow verifikasi absensi:
   - enrollment awal tetap boleh disimpan walau belum ada match ke database
   - enrollment hanya diblok jika hasil identifikasi kuat justru cocok ke akun user lain
   - state `wajah belum cocok dengan database` tidak lagi dianggap gagal untuk user yang memang belum punya enrollment
76. jika detector wajah gagal tersedia di browser/runtime, frontend sekarang memblok submit enrollment/absensi dan menampilkan pesan yang eksplisit; fallback tidak lagi boleh mengklaim `wajah terdeteksi` secara otomatis
77. konflik identifikasi 1:N saat submit diblok sekarang juga dicatat ke audit log melalui failed attempt dengan reason:
   - `face_identified_as_other_user`
   - metadata kandidat teratas ikut disimpan untuk investigasi HR
78. UI `Attendance` sekarang menampilkan alert real-time saat panel kamera aktif:
   - `OK, wajah dikenali` jika match ditemukan
   - warning jika wajah dikenali tetapi berbeda dengan akun login
   - warning jika wajah belum cocok dengan anggota terdaftar
79. overlay kamera sekarang selalu menampilkan guide box default di tengah frame walau bounding box deteksi belum muncul, supaya user tetap melihat area target pencarian wajah
80. `detectionHits` sekarang di-reset saat wajah hilang atau detector melempar error, sehingga status sukses lama tidak tertinggal ketika wajah keluar dari frame
81. posisi bounding box aktif sekarang disimpan di state React, bukan ref pasif, sehingga kotak hijau tetap bergerak mengikuti wajah walau `detectionHits` sudah stabil di nilai maksimum
82. panel kamera sekarang memonitor stream interruption (`mute`, `ended`, `emptied`, `stalled`) dan mencoba memulihkan preview kamera otomatis agar user tidak terjebak di layar hitam
83. bounding box detector sekarang dinormalisasi ulang menjadi portrait face frame yang lebih manusiawi: sedikit lebih lebar, lebih tinggi, dan sedikit bergeser ke atas agar framing dahi, mata, hidung, dan rahang lebih konsisten
84. validasi submit attendance tetap memakai verifikasi 1:1 yang lebih ketat; fitur 1:N hanya menjadi pre-check identitas dan alert operasional
85. UX scan wajah sekarang punya state visual yang lebih eksplisit di panel kamera:
   - bounding box netral saat idle
   - bounding box cyan + scanning line saat scanning
   - bounding box hijau + success glitch saat match kuat
   - bounding box merah pulsasi saat wajah tidak dikenal
   - bounding box amber saat confidence rendah
86. nama kandidat yang dikenali sekarang tampil floating di atas area wajah saat match berhasil
87. dialog `Wajah Belum Terdaftar` sekarang muncul saat sistem stabil mendeteksi wajah yang tidak ada di database, dengan aksi:
   - `Daftarkan Wajah Baru`
   - `Coba Lagi`
88. UI sekarang memberi instruksi otomatis saat confidence rendah, misalnya:
   - dekatkan wajah ke kamera
   - cari tempat yang lebih terang
   - hadapkan wajah lurus ke kamera
89. shell panel kamera sekarang memakai state machine visual sederhana:
   - `idle`
   - `scanning`
   - `success`
   - `failure`
   - `low-confidence`
83. video preview saat scanning sekarang sedikit de-saturated dan diberi reticle overlay agar terasa aktif memindai
84. saat success, tombol submit bermorph menjadi state konfirmasi dengan ikon centang dan shell kartu memberi pulse hijau singkat
85. saat failure, status box berubah merah, tombol submit dinonaktifkan, tombol `Coba Lagi` diberi animasi pulse, dan peta diberi shake singkat
86. saat GPS sudah terkonfirmasi, panel map sekarang menampilkan efek `data stream` dari area kamera ke area peta selama proses validasi aktif
87. saat `Jam Masuk` atau `Jam Pulang` mencapai match sangat kuat (`> 90%`), UI sekarang melakukan auto-submit singkat setelah jeda sekitar `480ms`
88. UI sekarang memberi cue perangkat saat validasi berubah:
   - vibrate/audio success pendek saat match kuat
   - vibrate/audio failure pendek saat identity conflict atau wajah tidak dikenal
89. frontend sekarang mengirim metadata kualitas scan ke backend, termasuk:
   - `validationUiState`
   - `identifyConfidence`
   - `brightness`
   - `faceCoverage`
   - `lowConfidenceHint`
90. backend `clock_in` dan `clock_out` sekarang menerima dan menyimpan metadata kualitas scan tersebut ke audit event agar HR bisa menganalisis kualitas validasi, bukan hanya hasil akhirnya
91. backend sekarang membaca setting `attendance.auto_submit_enabled` dari `hr_settings` dengan fallback `true`
92. payload `attendance/me` dan `attendance/dashboard` sekarang mengembalikan setting `autoSubmitEnabled`
93. halaman `Attendance` sekarang menampilkan badge status untuk auto-submit aktif/nonaktif
94. halaman detail `Review Absensi` sekarang menampilkan ringkasan kualitas scan yang lebih operasional:
   - `validationUiState`
   - `identifyConfidence`
   - `brightness`
   - `faceCoverage`
   - `lowConfidenceHint`
95. JSON metadata mentah tetap dipertahankan di detail review untuk debugging lanjutan, tetapi HR sekarang tidak perlu membaca JSON mentah untuk memahami kualitas scan
96. endpoint settings admin sekarang tersedia:
   - `GET /api/hr/settings`
   - `PATCH /api/hr/settings/:settingKey`
97. dashboard admin `HR Attendance` sekarang memiliki control toggle untuk `attendance.auto_submit_enabled` tanpa perlu edit database manual
98. backend sekarang juga membaca dan mengekspos setting `attendance.auto_submit_confidence_threshold` dari `hr_settings` dengan fallback `0.90`
99. payload `attendance/me`, `attendance/dashboard`, dan `hr/settings` sekarang mengembalikan `autoSubmitConfidenceThreshold` agar frontend tidak memakai threshold hardcoded
100. auto-submit di halaman `Attendance` sekarang mengikuti nilai `autoSubmitConfidenceThreshold` dari backend, bukan lagi angka tetap `0.90`
101. dashboard admin `HR Attendance` sekarang menyediakan input threshold confidence untuk auto-submit, termasuk aksi simpan langsung ke `hr_settings`
102. queue `Review Absensi` sekarang mendukung filter berbasis `validationUiState` agar HR bisa memisahkan kasus:
   - `failure`
   - `low-confidence`
   - `success`
   - `scanning`
103. backend `GET /api/hr/attendance-reviews` sekarang menerima query `validationUiState` dan memfilter data dari `metadata_json.validationUiState`
104. daftar queue review sekarang juga menampilkan ringkasan state validasi wajah agar HR tidak harus membuka detail satu per satu untuk membedakan kasus teknis kualitas scan
105. threshold wajah tidak lagi hardcoded penuh di backend:
   - `face_identify_confidence_threshold` sekarang dipakai untuk identifikasi 1:N
   - `face_verify_confidence_threshold` sekarang dipakai untuk verifikasi 1:1 saat `clock in/out`
106. payload `attendance/me`, `attendance/dashboard`, dan `hr/settings` sekarang juga mengembalikan:
   - `faceIdentifyConfidenceThreshold`
   - `faceVerifyConfidenceThreshold`
107. dashboard admin `HR Attendance` sekarang menyediakan input terpisah untuk:
   - threshold auto-submit
   - threshold identifikasi 1:N
   - threshold verifikasi 1:1
108. dashboard admin sekarang menampilkan metrik kualitas scan harian agar HR bisa menilai mutu validasi, meliputi:
   - `validation_success_today`
   - `validation_low_confidence_today`
   - `validation_failure_today`
109. detail review dan queue review sekarang menampilkan label `validationUiState` yang sudah dihumanisasi, sehingga enum teknis tidak lagi bocor mentah ke UI HR
110. manager dan admin sekarang bisa mendaftarkan wajah untuk pegawai lain dari halaman `Attendance` melalui selector target pegawai
111. daftar pegawai target untuk enrollment sekarang tersedia lewat endpoint:
   - `GET /api/hr/users`
112. pendaftaran wajah sekarang tidak lagi bersifat replace:
   - jika pegawai sudah memiliki wajah terdaftar aktif, enrollment baru ditolak
   - UI juga langsung menonaktifkan tombol pendaftaran untuk target yang sudah `enrolled`
113. aturan `1 pegawai = 1 wajah aktif` sekarang dijaga di dua lapisan:
   - backend guard pada service enrollment
   - unique partial index PostgreSQL `hr_face_enrollments_one_active_user_idx`
114. sistem sekarang juga mencegah satu wajah dipakai oleh dua akun berbeda dengan duplicate-check berbasis similarity terhadap enrollment aktif pegawai lain
115. keberhasilan enrollment oleh manager/admin tetap dicatat ke event audit `face_enrollment`, termasuk metadata:
   - pegawai target
   - actor yang melakukan pendaftaran
116. file schema tambahan untuk aturan uniqueness sudah ditambahkan dan dijalankan:
   - [sentient_hr_attendance_08_face_enrollment_uniqueness.sql](/opt/sentient-factory/docs/sql/sentient_hr_attendance_08_face_enrollment_uniqueness.sql)
117. halaman admin baru untuk operasional pendaftaran wajah sekarang tersedia:
   - `/app/hr/face-enrollments`
   - title menu: `Face Enrollment Management`
118. halaman `Face Enrollment Management` sekarang menampilkan:
   - daftar pegawai aktif
   - status enrollment wajah
   - snapshot aktif jika ada
   - quality score
   - siapa yang mendaftarkan
   - shortcut untuk mendaftarkan wajah pegawai yang belum enrolled
119. endpoint backend baru untuk halaman management tersedia:
   - `GET /api/hr/face-enrollments`
120. endpoint tersebut hanya tersedia untuk manager/admin dan mengembalikan daftar pegawai dengan enrollment aktif terakhir untuk kebutuhan operasional
121. halaman `Attendance` sekarang mendukung deep link `targetUserId` agar manager/admin bisa langsung membuka pendaftaran wajah untuk pegawai tertentu dari halaman management
122. menu seed HR sudah diperbarui dan diterapkan ke database untuk menambahkan item `Face Enrollment Management`
123. UX halaman `Attendance Dashboard` admin sudah direfactor agar fokus pada monitoring harian:
   - background canvas memakai `slate-50`
   - layout utama menjadi dua kolom: KPI di kiri, activity feed di kanan
124. blok `Pengaturan Validasi` tidak lagi tampil di tengah dashboard utama; sekarang dipindahkan ke dialog `Validation Settings` yang dibuka dari tombol di header
125. penyimpanan threshold di dialog sekarang memakai satu aksi global `Simpan Perubahan`, bukan tiga tombol simpan terpisah
126. `Sesi Terbaru` dan `Event Exception` sekarang digabung menjadi satu `Attendance Log` terpadu dengan filter chip:
   - `All`
   - `Needs Review`
   - `Success`
   - `Rejected`
127. KPI yang butuh aksi sekarang diberi bobot visual lebih jelas:
   - `Exception`
   - `Low Confidence`
   - `Validation Failure`
128. item log exception tidak lagi memakai border kiri tebal yang keras; status ditandai dengan badge pastel dan tint kartu yang lebih halus
129. `Attendance Log` sekarang dibuat lebih padat dan setiap item menyediakan aksi `Quick Detail` tanpa harus langsung pindah halaman
130. `Quick Detail` membuka dialog ringkas berisi:
   - kategori log
   - status
   - alasan / jenis event
   - waktu
   - durasi atau konteks sesi
131. item log tetap menyediakan jalur lanjut `Open Page` untuk masuk ke halaman detail penuh jika HR perlu investigasi lanjutan
132. `Quick Detail` sekarang juga menampilkan thumbnail snapshot bila log berasal dari event yang memiliki snapshot audit
133. dari `Quick Detail`, HR sekarang punya shortcut action yang lebih langsung:
   - `Buka Review` untuk item exception/review
   - `Riwayat Pegawai`
   - `Buka Halaman Detail`

Flow `Perlu Review` yang disarankan:

1. sumber kasus review:
   - `clock_in_status = manual_review`
   - `clock_out_status = manual_review`
   - `hr_attendance_events.result = manual_review`
   - failed attempt tertentu yang memang perlu keputusan HR

2. entry point UI:
   - dari card/list `Event Exception` di `Dashboard Absensi`
   - dari `Riwayat Absensi` jika session berstatus `Perlu Review`
   - dari future queue khusus `Review Absensi`

3. informasi minimum yang harus terlihat saat HR membuka item review:
   - nama pegawai
   - tanggal kerja
   - jenis event: `Absen Masuk`, `Absen Pulang`, atau `Percobaan Absen`
   - status saat ini: `Perlu Review`
   - alasan manusiawi:
     - `Di luar radius lokasi`
     - `Akses GPS ditolak`
     - `GPS timeout`
     - `Wajah tidak terdeteksi`
   - timestamp manusiawi
   - lokasi GPS yang dikirim user
   - nama worksite dan radius yang berlaku
   - jarak hasil evaluasi geofence
   - snapshot wajah terkait event
   - metadata device dasar

4. aksi yang tersedia untuk HR/manager:
   - `Setujui`
   - `Tolak`
   - `Minta Klarifikasi`
   - `Tambahkan Catatan`

5. hasil aksi:
   - `Setujui`
     - session/event tetap tersimpan
     - status review menjadi `approved`
     - attendance dianggap valid secara operasional
   - `Tolak`
     - status review menjadi `rejected`
     - attendance tetap tersimpan sebagai audit, tetapi tidak dihitung valid
   - `Minta Klarifikasi`
     - status review menjadi `needs_clarification`
     - HR bisa menunggu penjelasan lanjutan

6. status model yang disarankan:
   - review status terpisah dari raw attendance status
   - usulan field baru pada level session/event:
     - `review_status`: `pending`, `approved`, `rejected`, `needs_clarification`
     - `reviewed_by`
     - `reviewed_at`
     - `review_note`

7. aturan presentasi:
   - badge `Perlu Review` hanya menunjukkan kondisi awal hasil rule engine
   - setelah HR bertindak, UI harus menampilkan status baru:
     - `Disetujui`
     - `Ditolak`
     - `Perlu Klarifikasi`

8. endpoint backend yang disarankan:
   - `GET /api/hr/reviews/attendance`
     - daftar queue review
   - `GET /api/hr/reviews/attendance/:eventId`
     - detail item review
   - `POST /api/hr/reviews/attendance/:eventId/approve`
   - `POST /api/hr/reviews/attendance/:eventId/reject`
   - `POST /api/hr/reviews/attendance/:eventId/request-clarification`

9. route frontend yang disarankan:
   - `/app/hr/attendance-reviews`
   - `/app/hr/attendance-reviews/[eventId]`

10. layout detail review yang disarankan:
   - header:
     - nama pegawai
     - tanggal
     - badge status
   - section `Kronologi`
   - section `Snapshot & Lokasi`
   - section `Rule Evaluation`
   - section `Catatan HR`
   - sticky action bar:
     - `Setujui`
     - `Tolak`
     - `Minta Klarifikasi`

11. aturan audit:
   - setiap aksi review wajib menyimpan:
     - actor
     - timestamp
     - previous status
     - next status
     - note
   - perubahan review tidak boleh menghapus raw event original

12. implementasi bertahap yang disarankan:
   - tahap 1:
     - queue review sederhana
     - detail snapshot + lokasi
     - approve/reject + note
   - tahap 2:
     - request clarification
     - filter by reviewer / worksite / reason
     - SLA / aging review

Catatan teknis:

1. `api-gateway` typecheck lolos untuk perubahan `HR`
2. `web-dashboard` typecheck global masih gagal, tetapi error yang muncul berasal dari file lama di:
   - `app/(layouts)/app/dashboard/custom-db-1/page.tsx`
   - `app/(layouts)/app/dashboard/warehouse/page.tsx`
   - `app/(layouts)/app/senti-ai/*`
   - `app/api/alerting/*`
3. file `HR` yang baru diubah sudah tidak muncul lagi di daftar error `tsc`
4. browser-only flow `getUserMedia` + `geolocation` belum diuji dari browser terautentikasi di sesi CLI ini; yang sudah tervalidasi adalah kontrak HTTP dan persistensi backend
5. restart `api-gateway` sempat membuka inkonsistensi lama pada stack compose, tetapi service sudah dipulihkan dan kembali boot normal
6. event lama yang tersimpan sebelum bind mount host aktif mungkin menunjuk ke file snapshot yang sudah hilang dari container lama; event baru setelah perubahan mount dapat diakses normal
7. failed attempt dari browser sekarang sudah tercatat, tetapi browser live test untuk benar-benar memicu `camera_denied` atau `gps_denied` dari UI masih belum dijalankan di sesi CLI ini

Status implementasi review absensi:

1. schema review sudah diterapkan ke database melalui file:
   - `docs/sql/sentient_hr_attendance_04_review_schema.sql`
2. `hr_attendance_events` sekarang memiliki field:
   - `review_status`
   - `reviewed_at`
   - `reviewed_by`
   - `review_note`
3. endpoint backend yang aktif saat ini:
   - `GET /api/hr/attendance-reviews`
   - `GET /api/hr/attendance-reviews/:eventId`
   - `POST /api/hr/attendance-reviews/:eventId/approve`
   - `POST /api/hr/attendance-reviews/:eventId/reject`
   - `POST /api/hr/attendance-reviews/:eventId/request-clarification`
4. route frontend yang aktif saat ini:
   - `/app/hr/attendance-reviews`
   - `/app/hr/attendance-reviews/[eventId]`
5. smoke test API review sudah tervalidasi:
   - login admin ke `/api/auth/login` berhasil
   - queue review mengembalikan item `pending`
   - detail review per event berhasil dibaca
   - aksi `request-clarification` berhasil mengubah status review
6. frontend review sudah dinormalisasi untuk nilai numerik dari PostgreSQL Decimal agar tidak membocorkan object `{s,e,d}` ke UI

Pembaruan UX attendance:

1. saat tombol `Pendaftaran Wajah` ditekan, halaman `Attendance` sekarang masuk ke mode fokus
2. pada mode fokus ini, hanya area kamera, peta, status perangkat, dan tombol aksi yang ditampilkan
3. ringkasan status harian, stats, dan riwayat event disembunyikan sementara sampai user menekan `Batal` atau proses selesai
4. flow kamera attendance sekarang memakai pendekatan `zero-click auto-submit`
5. area scan hanya menampilkan feed kamera dan peta mini sebagai indikator lokasi aktif
6. kartu debug seperti status kamera, hit deteksi, dan koordinat mentah dihapus dari panel scan utama
7. ketika match wajah cukup kuat, submit attendance dipicu otomatis tanpa tombol manual
8. selama submit berlangsung, feed kamera dikunci dengan overlay `Mencatat Kehadiran...`
9. setelah submit sukses, kamera dan peta di-unmount lalu diganti `success review card` berisi snapshot, nama pegawai, waktu, dan CTA `Tutup`
10. jika wajah tidak dikenali atau confidence terlalu rendah selama beberapa detik, UI memicu toast peringatan dan reset scan otomatis tanpa tombol retry manual

Demo attendance users:

1. ditambahkan 5 user pegawai demo untuk modul `Sentient HR Attendance`
2. file seed:
   - `docs/sql/sentient_hr_attendance_07_demo_users.sql`
3. seluruh user demo:
   - role app: `user`
   - department: `Human Resources`
   - HR role type: `employee`
   - default worksite: `Head Office (HQ)`
   - face enrollment status awal: `not_enrolled`
4. kredensial login demo:
   - `pegawai.demo1@example.com / Password123!`
   - `pegawai.demo2@example.com / Password123!`
   - `pegawai.demo3@example.com / Password123!`
   - `pegawai.demo4@example.com / Password123!`
   - `pegawai.demo5@example.com / Password123!`
5. login tervalidasi melalui endpoint `/api/auth/login`
7. UX review sudah dirapikan untuk operasional HR:
   - queue review memiliki filter status
   - queue review memiliki pencarian cepat
   - item queue memiliki visual emphasis untuk kasus lokasi/GPS
   - detail review menampilkan ringkasan sesi, skor wajah/liveness, dan payload rule engine
8. proxy route Next.js untuk action review sekarang sudah benar-benar mendukung `POST` pada entity route
9. audit history review sudah aktif:
   - schema `docs/sql/sentient_hr_attendance_05_review_logs.sql` sudah diterapkan
   - setiap aksi approve/reject/request clarification menulis row ke `hr_attendance_review_logs`
   - detail review sekarang mengembalikan dan menampilkan `reviewHistory`
10. flow `Perlu Klarifikasi` tidak lagi buntu:
    - endpoint `POST /api/hr/attendance-reviews/:eventId/reopen` sudah aktif
    - UI detail review memiliki aksi `Kembalikan ke Queue`
    - smoke test `needs_clarification -> pending` sudah tervalidasi
11. presentasi tanggal/jam di UI HR sekarang dipatok ke `Asia/Jakarta` (`WIB` / GMT+7), tidak lagi bergantung pada timezone browser/runtime
12. formatter HR sudah diperbaiki untuk membaca timestamp API sebagai wall-clock `WIB`, sehingga jam absensi baru tidak lagi bergeser +7 jam di UI
13. backend HR juga sudah dinormalisasi agar payload timestamp tidak lagi keluar sebagai ISO `...Z`; respons sekarang mengirim wall-clock string yang konsisten untuk data absensi HR
14. sweep timezone non-HR awal sudah diterapkan ke `Senti AI` pada layer frontend agar formatter waktunya juga konsisten ke `Asia/Jakarta` / `WIB`

History role scope update:
- admin/manager without query.userId now see all attendance sessions
- user remains scoped to self
- attendance history UI shows employee name when multiple employees are present
- attendance history now exposes a user filter dropdown for admin/manager via /api/hr/users; regular users remain self-scoped because the user list endpoint is unavailable to them
- attendance history supports employee search, work-date range filters, and server-side pagination; admin/manager can combine these with employee filtering while user remains self-scoped
- attendance history now has quick date filters: Hari Ini, Minggu Ini, Bulan Ini, built on top of Jakarta-time work-date filtering
- face enrollment/attendance capture now requires the face to be fully framed before auto-submit or manual submit can pass; partial-side-face captures are rejected with face_not_centered
- enrollment scan screen now shows explicit status messaging when target face is already enrolled, recognized, or mismatched; detector box was enlarged to better wrap the whole face
- sisa label Inggris di area HR operasional juga sudah disapu ke Bahasa Indonesia:
  - dashboard absensi
  - review absensi
  - manajemen pendaftaran wajah
  - state validasi seperti `success`, `failure`, `low-confidence`, dan `scanning`
- enrollment framing thresholds were relaxed slightly and the enrollment status message now says the face position is already good when framing is acceptable but detection stabilization is still in progress
- enrollment scan messaging now distinguishes between no face, face detected but needs slight adjustment, and face already aligned with stabilization progress x/4; enrollment stabilization threshold lowered from 4 to 3 hits
- dashboard absensi admin dirapikan ulang untuk proporsi dan whitespace:
  - layout utama memakai kolom KPI tetap dan kolom log yang fleksibel
  - blok `Kualitas Validasi Hari Ini` diubah dari kartu kecil vertikal menjadi daftar baris horizontal yang lebih terbaca
  - kartu KPI diberi padding lebih longgar
  - item `Log Absensi` distandarkan dengan pemisahan kiri/kanan yang lebih rapi untuk badge, deskripsi, waktu, dan aksi
- dashboard absensi kini memakai wrapper lebar khusus (`max-w-[1400px]`) agar tidak lagi terasa seperti mobile view di desktop
- kolom KPI dashboard diperlebar ke `350px`, sedangkan kolom `Log Absensi` mengambil sisa ruang
- item `Log Absensi` kini memakai layout horizontal desktop yang lebih stabil dengan deskripsi `line-clamp-2` dan area aksi yang dipin ke kanan
- detail review absensi juga disapu ke Bahasa Indonesia penuh untuk label operasional dan teknis:
  - antrian review
  - status UI
  - tingkat keyakinan
  - pencahayaan
  - cakupan wajah
  - data mesin aturan
- detector state no longer resets instantly on a single missed frame; enrollment scan now tolerates brief misses and decays hit count instead of hard reset, reducing stuck/flapping UX
- enrollment framing no longer depends on an invisible guide overlap metric; it now follows the detected face box position within the visible frame, so UX messaging should better match what the user sees
- dashboard absensi admin diberi micro-spacing tambahan:
  - blok `Kualitas Validasi Hari Ini` diberi jarak atas yang lebih longgar dari KPI utama
  - header `Log Absensi` diberi jarak bawah yang lebih jelas dari daftar item
  - item log memakai padding lebih lega dan grouping kanan yang lebih rapih untuk waktu + aksi
- duplicate face enrollment prevention now uses a dedicated lower threshold (face_duplicate_confidence_threshold, default 0.24) instead of the much higher face-identify threshold, because the current lightweight embedding produced only ~0.27 similarity for the same real face across two accounts
- enrollment duplicate errors from backend now override the scan success banner, stop auto-submit retries, and explicitly tell the operator that the face is already registered to another account
- reason code `camera_denied` di layer UI HR sekarang diterjemahkan menjadi `Akses kamera ditolak`
- frame overlay di layar scan sekarang benar-benar hilang saat tidak ada objek wajah yang terdeteksi; kotak hanya tampil jika detector memang mengembalikan bounding box wajah
- detector wajah sekarang memakai MediaPipe Face Landmarker, bukan sekadar box detector, sehingga scan bisa membaca blink score untuk challenge liveness
- enrollment, clock-in, dan clock-out sekarang mewajibkan liveness aktif berupa `kedip mata sekali`; frontend memblok submit jika belum lolos, dan backend juga menolak request dengan `liveness_not_verified` jika `livenessScore` di bawah threshold
- tampilan `Pendaftaran Wajah` sekarang dioptimalkan untuk mobile portrait:
  - feed kamera jadi portrait di mobile
  - label panduan dipindah ke bawah tengah frame agar tidak terpotong
  - oval guide diposisikan ulang ke upper-middle agar lebih natural saat memegang ponsel
  - spacing header, kartu lokasi, dan kartu aksi dipadatkan supaya kamera tetap dominan
- UI `Pendaftaran Wajah` juga sudah diadaptasi ulang ke pola referensi mobile:
  - mode enrollment jadi layar fokus tunggal dengan background state besar (putih / kuning / hijau)
  - kamera dipotong bulat besar di tengah
  - guide siluet wajah tampil di dalam lingkaran
  - instruksi utama dipindah ke bawah lingkaran
  - mode enrollment tidak lagi menampilkan kartu lokasi/aksi yang memecah fokus
- fase `Tahan posisi` di pendaftaran wajah sekarang menampilkan progress stabilisasi eksplisit:
  - status sukses baru aktif setelah `4/4` hit stabil
  - ada progress bar dan dot indicator `Stabilisasi x/4`
  - teks tidak lagi terlihat diam saat sistem menunggu auto-submit
  - progress stabilisasi sekarang berjalan berbasis waktu hold supaya UI tetap bergerak walau box wajah tidak banyak berubah di frame
- halaman `Attendance` sekarang menyembunyikan blok pendaftaran wajah jika wajah user/target aktif sudah `enrolled`, sehingga fokus UI berpindah langsung ke status dan aksi absensi
- mode scan di halaman `Attendance` sekarang diringkas jadi layout dua kolom desktop:
  - kamera utama di kiri
  - panel status, peta GPS, kandidat, dan aksi di kanan
  - tujuan utamanya agar kamera + maps tetap terlihat dalam satu halaman tanpa terpotong vertikal
- seluruh mode scan wajah (`Pendaftaran Wajah`, `Jam Masuk`, `Jam Pulang`) sekarang memakai pola konfigurasi UI yang sama:
  - banner panduan scan di bagian atas
  - panel status scan di kanan
  - peta GPS di kanan
  - kandidat teratas di kanan
  - logika pesan validasi diseragamkan dengan pola pendaftaran wajah
- panel scan `Attendance` dipoles lagi agar lebih utuh dalam satu halaman:
  - target dan instruksi liveness dipisah menjadi baris terpisah
  - tinggi peta dipadatkan agar tidak mendorong tombol ke bawah
  - tombol aksi dipindah ke card `Aksi` sendiri di panel kanan agar lebih rapi dan konsisten
- panel `Pendaftaran Wajah` sekarang disederhanakan untuk menurunkan beban visual:
  - kartu debug `Status Scan` dihapus
  - peta interaktif diganti menjadi kartu konfirmasi lokasi yang ringkas
  - feedback kesiapan scan dipindah ke overlay bawah video
  - tombol `Simpan Pendaftaran Wajah` kini punya state aktif/nonaktif yang lebih tegas, termasuk helper `Menunggu kedipan mata...`
- konflik duplikasi enrollment tidak lagi membuat layar scan `stuck`:
  - alert `wajah sudah terdaftar untuk pegawai lain` sekarang otomatis dibersihkan saat wajah hilang, target pegawai diganti, atau kandidat wajah live sudah berubah
- dashboard `Attendance` untuk admin/manager dipoles agar lebih efisien untuk bulk enrollment:
  - pemilih pegawai target diubah menjadi searchable combobox dengan pencarian nama/EMP-ID dan badge status `Terdaftar` / `Belum Terdaftar`
  - CTA `Daftarkan Wajah Pegawai` dinaikkan menjadi tombol primer
  - banner `pendaftaran wajah belum selesai` diberi styling warning yang lebih kontekstual
- arahan operator saat `Pendaftaran Wajah` sekarang dipindah ke kartu panduan biru di bagian atas scan, bukan lagi tersembunyi di area tombol submit
- feedback `Pendaftaran Wajah` kini dipindah lagi langsung ke bounding box wajah:
  - banner instruksi statis dihapus
  - label status real-time menempel pada frame wajah dengan state `Posisikan wajah ke tengah`, `Menunggu kedipan mata...`, dan `Verifikasi Berhasil`
- layar `Pendaftaran Wajah` kini memiliki target guide statis di tengah video:
  - guide oval putus-putus menjadi acuan visual lokasi wajah
  - label scan di frame diganti ke `Arahkan wajah ke dalam area panduan`
  - guide memberi pulse dan berubah warna saat wajah sudah align / berhasil lock-on
- liveness `kedip mata` pada enrollment dilonggarkan dan dibuat lebih eksplisit:
  - threshold blink diturunkan agar lebih responsif di kamera nyata
  - label frame kini punya state antara `Menunggu kedipan mata...` dan `Selesaikan kedipan...`
  - tombol simpan baru aktif setelah liveness benar-benar lolos
- area `Aksi` pada mode `Pendaftaran Wajah` disederhanakan:
  - tombol submit manual dihilangkan
  - UI sekarang menjelaskan bahwa penyimpanan akan terpicu otomatis saat verifikasi sukses
- halaman `Manajemen Pendaftaran Wajah` kini memakai endpoint snapshot enrollment yang benar:
  - thumbnail tidak lagi salah memukul endpoint event absensi
  - gambar wajah terdaftar seharusnya tampil di kartu management bila file snapshot memang ada
- dari `Manajemen Pendaftaran Wajah`, tombol `Daftarkan Wajah` kini langsung membuka mode `Pendaftaran Wajah` di halaman `Attendance` lewat query `action=enroll`
- copy instruksi pada layout `Pendaftaran Wajah` fullscreen kini mengikuti state scan yang sebenarnya:
  - tidak lagi hardcoded `jangan bergerak saat layar berkedip`
  - konflik wajah, arahan ke guide, progres kedipan, dan sukses sekarang punya teks yang sesuai konteks
- header layar `Pendaftaran Wajah` juga dipadatkan:
  - label `Absensi` dan `Arahkan wajah ke dalam frame` dihapus agar fokus langsung ke target pegawai dan area scan
- target guide `Pendaftaran Wajah` kini dibuat lebih proaktif:
  - video memiliki guide oval statis putus-putus di tengah sebagai target posisi wajah
  - bounding box wajah tidak lagi selalu biru; warnanya kini real-time:
    - merah saat wajah masih jauh dari target
    - kuning saat hampir pas
    - hijau saat lock-on
  - saat lock-on tercapai, guide memberi micro-animation pulse
  - kedip mata hanya mulai diproses setelah wajah lock-on ke guide
  - label instruksi dipasang aman di dalam frame wajah agar tidak terpotong
- visual `Pendaftaran Wajah` kemudian disederhanakan lagi:
  - frame kotak deteksi yang bergerak di atas video dihapus
  - fokus operator kini hanya pada guide oval statis di tengah dan instruksi status di luar frame
  - setelah wajah lock-on dan liveness lolos, preview kamera dibekukan menjadi snapshot statis supaya operator bisa cek hasil capture tanpa melihat live feed
  - ukuran guide oval diperbesar lagi agar wajah benar-benar terasa masuk ke area panduan, terutama di mobile portrait
  - kondisi wajah yang sudah dipakai pegawai lain kini ditampilkan sebagai warning/info:
  - jika liveness/verifikasi wajah berhasil tetapi backend atau identifikasi 1:N mendeteksi wajah milik pegawai lain, UI tidak lagi memakai pesan sukses
  - pesan berubah menjadi `Wajah Sudah Terdaftar`
  - saat conflict ini muncul, preview enrollment dibekukan ke snapshot terakhir supaya operator tetap bisa meninjau capture tanpa live feed
  - subtitle conflict menjelaskan bahwa wajah sudah terdaftar atas nama pegawai lain dan pendaftaran dibatalkan
  - state non-conflict pada enrollment memakai copy yang lebih spesifik, misalnya `Pertahankan posisi wajah` dan `Pertahankan wajah di dalam oval`, bukan copy generik `Tahan posisi ini`
  - saat wajah belum benar-benar terkunci, instruksi kembali ke `Masukkan wajah ke dalam oval` atau `Arahkan wajah ke kamera`; copy `Pertahankan posisi` hanya dipakai ketika locking sudah terjadi
  - ketika wajah sudah masuk panduan tetapi belum lulus liveness, UI langsung beralih ke instruksi kedip/verifikasi agar operator tidak merasa disuruh mengatur posisi terus
  - state `near` sekarang dilokalkan sebagai `Wajah Hampir Masuk Panduan`, bukan `Wajah Masuk Panduan`, supaya UI tidak misleading saat wajah masih jelas di luar oval
  - layout kartu kuning `Pendaftaran Wajah` dipoles:
  - target pegawai tidak lagi tampil sebagai teks mentah; sekarang menjadi chip `Mendaftarkan: Nama (EMP-ID)` dengan ikon user
  - copy `Verifikasi Wajah... Menunggu berkedip` diganti menjadi `Posisi Wajah Sesuai`
  - instruksi kedip dibuat lebih natural: `Kedipkan mata Anda satu kali untuk menyelesaikan verifikasi.`
  - padding dan gap vertikal kartu dibuat lebih lega agar kamera, teks, dan tombol tidak terasa menempel
- case duplicate enrollment setelah verifikasi sukses diperbaiki:
  - jika wajah sudah dipakai pegawai lain, flow tidak lagi stuck di status berhasil
  - UI menampilkan warning dan tombol `Scan Ulang`
  - tombol itu mereset conflict, liveness, identifikasi, dan kamera agar operator bisa lanjut tanpa keluar halaman
  - validasi pre-submit untuk admin/manager kini membandingkan wajah terhadap target pegawai yang dipilih, bukan akun operator yang sedang login
  - duplicate conflict dari backend tidak lagi langsung terhapus oleh effect identifikasi ketika `identifyMatched` belum tersedia, sehingga warning tetap terlihat setelah auto-submit ditolak
  - hold/stabilisasi enrollment sekarang lebih toleran: progress tetap berjalan ketika wajah sudah cukup pas di area panduan, tidak harus menunggu lock keras agar tidak terasa stuck
  - environment demo sekarang memakai threshold face-match 0.25 untuk `Jam Masuk`/`Jam Pulang`, karena model embedding ringan belum stabil di threshold 0.82
  - warning UI `Wajah tidak dikenali` mengikuti threshold verifikasi yang sama, supaya UI tidak lebih ketat dari backend
  - liveness untuk `Jam Masuk`/`Jam Pulang` di environment demo dibuat auto-verified setelah wajah stabil beberapa frame, agar demo absensi tidak macet di kedipan yang terlalu rapuh
  - gate submit absensi demo sekarang bergantung pada wajah stabil + liveness aktif, bukan lagi menunggu status `identifyMatched` yang terlalu rapuh untuk demo
  - liveness attendance demo sekarang benar-benar auto-verified setelah deteksi wajah stabil beberapa frame, tanpa mensyaratkan wajah sudah `wellFramed` sempurna
  - threshold demo attendance kemudian diturunkan lagi ke `0.05` untuk `face_identify_confidence_threshold` dan `face_verify_confidence_threshold`, karena similarity embedding demo real masih sekitar `8.4%`
  - auto-submit absensi kini tidak lagi ter-reset setiap frame deteksi; timer hanya dijadwalkan sekali saat state sukses stabil
  - tombol sukses absensi tetap menampilkan aksi nyata `Kirim Jam Masuk` / `Kirim Jam Pulang`, bukan label ambigu `Tervalidasi`
  - auto-submit attendance kini mengikuti `canSubmitCurrentAction`; jadi saat tombol `Kirim Jam Masuk` sudah aktif, request akan dikirim otomatis tanpa menunggu state sukses visual tambahan
  - state non-lock pada pendaftaran wajah dibuat lebih lunak: bukan merah, tetapi amber/info dengan copy `Tahan posisi ini`
- halaman `Manajemen Pendaftaran Wajah` dirombak menjadi tabel/list padat:
  - kolom `Pegawai`, `Status`, `Kualitas Data`, `Didaftarkan Oleh`, dan `Aksi`
  - status `Belum Terdaftar` tidak lagi menampilkan metadata teknis yang kosong
  - tombol aksi dibuat lebih soft dengan warna biru muda / outline agar tidak terlalu dominan
  - filter chip `Semua`, `Sudah Terdaftar`, dan `Belum Terdaftar` ditambahkan di bawah search bar
  - UI halaman `Manajemen Pendaftaran Wajah` kemudian disesuaikan dengan referensi:
  - kartu ringkasan `Sudah Terdaftar` dan `Belum Terdaftar` dibuat horizontal dengan ikon status
  - search dan filter status digabung dalam satu panel tabel
  - kolom `Pegawai / Status` menggabungkan identitas pegawai, avatar/snapshot, dan badge status
  - tabel memakai pagination ringkas 3 baris per halaman seperti referensi
  - pagination `Manajemen Pendaftaran Wajah` dibuat fleksibel dengan pilihan limit 10, 50, dan 100; default 10 baris
- halaman `Lokasi Kerja & Geofence` tetap memakai Leaflet/OpenStreetMap:
  - picker peta geofence kini memiliki pencarian lokasi berbasis Nominatim OpenStreetMap
  - hasil pencarian menampilkan daftar lokasi, dan memilih hasil akan memindahkan marker serta pusat radius geofence
  - pencarian ini tidak membutuhkan Google Maps API key atau billing
  - form `Tambah Lokasi Kerja` dibuat mengikuti referensi UI:
  - kolom form ringkas di kiri, peta geofence besar di kanan
  - field memakai label Bahasa Indonesia (`Nama Lokasi`, `Kode`, `Koordinat Dipilih`, `Radius Geofence`)
  - koordinat latitude/longitude bisa diedit langsung selain lewat klik/drag marker peta
  - pencarian lokasi tetap tersedia sebagai overlay kecil di atas peta agar area map tetap dominan
  - picker Leaflet memiliki tombol `Lokasi Anda` untuk mengambil GPS browser, memindahkan pusat geofence ke posisi user, dan menampilkan marker lokasi user
  - form `Edit Lokasi Kerja` memakai UI yang sama dengan `Tambah Lokasi Kerja`, termasuk peta Leaflet, search lokasi, slider radius, tombol `Lokasi Anda`, dan status aktif
  - halaman utama `Lokasi Kerja & Geofence` dibuat mengikuti referensi UI:
  - header putih ringkas dengan CTA `Tambah Lokasi`
  - daftar lokasi kiri memakai kartu, bukan tabel
  - editor penugasan pegawai kanan memakai search dan list ringkas dengan avatar inisial serta badge lokasi kerja
- sidebar menu HR tetap menampilkan submenu lengkap, tetapi `Attendance Dashboard` juga menjadi hub akses cepat:
  - kartu shortcut ke `Absensi`, `Riwayat Absensi`, `Review Absensi`, `Pendaftaran Wajah`, dan `Lokasi Kerja`
  - shortcut menampilkan konteks ringkas seperti jumlah pending review, pegawai belum terdaftar, dan lokasi aktif
- akses `Attendance Dashboard` dibatasi untuk role `admin` dan `manager`:
  - backend endpoint `/api/hr/attendance/dashboard` menolak non-privileged role dengan `403`
  - role-menu database untuk role `user` pada menu `Attendance Dashboard` diset `can_view=false`
  - frontend dashboard menampilkan state akses ditolak dan CTA kembali ke halaman `Absensi`
- role `user` pada modul HR kini hanya melihat menu `Attendance`:
  - `Attendance History`, `Attendance Dashboard`, `Worksites & Geofences`, `Settings`, dan `Face Enrollment Management` diset `can_view=false` di `m0_role_menu`
  - parent menu `HR` tetap tampil karena masih memiliki child aktif `Attendance`
- reset operasional database HR attendance sudah dijalankan:
  - seluruh `hr_face_enrollments`, `hr_attendance_sessions`, `hr_attendance_events`, dan `hr_attendance_review_logs` dikosongkan
  - seluruh `hr_users.face_enrollment_status` dikembalikan ke `not_enrolled`
- runtime detector wajah di frontend diperkeras untuk mencegah crash `detectForVideo`:
  - detector sekarang hanya memproses video jika frame sudah valid (`readyState`, `videoWidth`, `videoHeight`, `currentTime`)
  - pemrosesan dilewati jika timestamp frame belum bergerak agar tidak memanggil `detectForVideo` berulang pada frame yang sama
  - error runtime dari MediaPipe saat deteksi kini ditahan dan diperlakukan sebagai `no face` sementara, bukan meledak ke console/UI
  - log internal TFLite/MediaPipe seperti `Created TensorFlow Lite XNNPACK delegate for CPU` disaring dari `console.error` agar tidak salah muncul sebagai error overlay di Next dev
- alur sukses absensi dipermudah agar tidak membuat user tertahan di layar scan:
  - setelah `Jam Masuk` atau `Jam Pulang` sukses, UI langsung menutup mode kamera dan kembali ke halaman utama `Attendance`
  - banner sukses hijau ditampilkan singkat selama 5 detik untuk memberi konfirmasi hasil clock in/clock out
  - layar review sukses tetap dipakai untuk pendaftaran wajah, tetapi tidak lagi dipakai untuk clock in/clock out harian
- layar scan absensi kini menampilkan petunjuk langsung di dalam frame kamera:
  - judul dan pesan arahan dirender sebagai overlay bawah pada video, bukan hanya di panel samping
  - copy arahan berubah dinamis sesuai kondisi: wajah belum masuk frame, wajah sudah terdeteksi, wajah sudah cocok, atau wajah tidak sesuai akun
  - tujuan perubahan ini agar user tidak bingung saat proses validasi berjalan lama atau masih menunggu posisi wajah yang benar
- flow validasi `clock in / clock out` dipermudah agar tidak terasa stuck saat wajah sudah terlihat:
  - threshold stabilisasi absensi diturunkan dari 3 hit menjadi 2 hit untuk mempercepat transisi ke validasi akhir
  - state sebelum submit kini membedakan `menstabilkan wajah`, `mencocokkan wajah`, dan `siap diproses otomatis`
  - panel `Aksi` sekarang menampilkan blocker yang tersisa secara eksplisit, bukan hanya tombol disable tanpa alasan
- aturan framing untuk `clock in / clock out` dilonggarkan lagi agar absensi lebih praktis:
  - absensi harian tidak lagi menunggu framing seketat enrollment; wajah cukup jelas, relatif di tengah, dan terbaca 1 hit
  - validasi submit sekarang menunggu hasil pencocokan wajah selesai (`identifyLoading=false`) agar auto-submit tidak terlalu cepat
  - copy instruksi atas diubah agar tidak lagi memaksa kedipan untuk alur absensi harian
- flow `clock in / clock out` sekarang zero-click:
  - tombol `Kirim Jam Masuk` / `Kirim Jam Pulang` dihapus dari UI absensi harian
  - panel kanan hanya menampilkan `Status Proses` dan petunjuk blocker yang tersisa
  - setelah wajah, lokasi, dan identitas valid, sistem langsung kirim absensi otomatis tanpa interaksi manual tambahan
- setelah `clock in` berhasil, route dibersihkan kembali ke `/app/hr/attendance`:
  - ini memastikan user kembali ke home `Attendance` standar, bukan tertahan di mode scan/action
  - pesan sukses tetap ditampilkan setelah kembali ke halaman utama
- guard submit absensi harian diselaraskan dengan flow auto-submit yang sudah dilonggarkan:
  - validasi pra-submit tidak lagi menolak `clock in / clock out` hanya karena `detectionHits < 2` jika wajah masih aktif terdeteksi
  - fallback `face-identify` juga diturunkan agar tetap bisa berjalan saat absensi baru punya 1 hit deteksi
  - liveness keras tetap dipakai untuk enrollment, tetapi tidak lagi menjadi blocker eksplisit untuk absensi harian zero-click
