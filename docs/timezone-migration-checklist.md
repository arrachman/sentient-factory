# Timezone Migration Checklist (UTC -> GMT+7 / Asia/Bangkok)

Tujuan: mengubah default timezone PostgreSQL ke `Asia/Bangkok` (UTC+7) tanpa mengubah makna data timestamp yang sudah ada dan tanpa “geser jam” di report.

Catatan penting: risiko terbesar biasanya muncul jika kamu menyimpan waktu di kolom `timestamp without time zone` dan ada asumsi “ini UTC” atau “ini lokal” yang tidak terdokumentasi.

## 1) Putuskan “Source of Truth”

Sebelum cutover, pastikan 2 keputusan ini eksplisit:

1. Canonical storage untuk waktu:
   - Opsi A (paling aman jangka panjang): simpan canonical di `timestamptz` (umumnya UTC), konversi ke GMT+7 saat tampil/report.
   - Opsi B: simpan canonical di `timestamp without time zone` sebagai “waktu lokal GMT+7”.
2. Definisi tiap kolom waktu:
   - Event time (waktu kejadian bisnis).
   - Audit time (created_at/updated_at).
   - Expiry/schedule (expires_at, due_at).
   - Integrasi eksternal (waktu dari device/sensor/API lain).

Output yang diharapkan: tabel ringkas “kolom -> semantics -> tipe ideal”.

## 2) Inventory: Temukan Semua Kolom Timestamp

Jalankan di DB production/staging (psql):

```sql
-- Semua kolom timestamp tanpa timezone
SELECT table_schema, table_name, column_name, data_type
FROM information_schema.columns
WHERE data_type IN ('timestamp without time zone', 'timestamp with time zone')
ORDER BY table_schema, table_name, column_name;
```

Tambahkan cek default yang berpotensi berubah makna setelah timezone berganti:

```sql
SELECT table_schema, table_name, column_name, column_default
FROM information_schema.columns
WHERE data_type LIKE 'timestamp%'
  AND column_default IS NOT NULL
ORDER BY table_schema, table_name, column_name;
```

## 3) Tentukan Semantics Existing Data (Ini yang Bikin “Zero-Surprise”)

Pertanyaan yang wajib dijawab untuk tiap kolom `timestamp without time zone`:

1. Nilai yang tersimpan selama ini merepresentasikan UTC atau waktu lokal?
2. Nilai dibuat oleh DB (`CURRENT_TIMESTAMP`/trigger) atau oleh aplikasi?
3. Nilai berasal dari client/device yang sudah menyertakan offset/`Z` (ISO 8601) atau tidak?

Cara cepat “spot-check”:

```sql
-- Ambil sampel baris terbaru untuk melihat pola jam
SELECT now() AS db_now,
       current_setting('TimeZone') AS db_tz;
```

Lalu per-table:

```sql
-- Contoh: cek 20 data terbaru dan lihat jamnya (apakah masuk akal untuk jam operasional lokal)
SELECT created_at
FROM m0_users
ORDER BY created_at DESC
LIMIT 20;
```

Kalau hasilnya selama ini terlihat “UTC” (misalnya selalu 7 jam lebih lambat dari jam lokal), berarti ada asumsi UTC yang harus dipertahankan.

## 4) Strategi Migrasi (Pilih Salah Satu, Konsisten)

### Strategi A: Tetap simpan canonical UTC (direkomendasikan), tampilkan/report GMT+7

1. Ubah kolom penting menjadi `timestamptz` (untuk kolom yang definisinya “moment-in-time”).
2. Pastikan aplikasi mengirim ISO8601 yang jelas offset-nya (mis. `2026-02-16T12:34:56.789Z` atau `+07:00`).
3. Pada query report, konversi ke GMT+7 saat SELECT:

```sql
-- from timestamptz -> jam Asia/Bangkok untuk display
SELECT (created_at AT TIME ZONE 'Asia/Bangkok') AS created_at_local
FROM some_table;
```

Kelebihan: paling minim kejutan jangka panjang, aman lintas timezone.

### Strategi B: Simpan “waktu lokal” di `timestamp without time zone`

1. Semua input aplikasi harus dianggap local-time GMT+7 (tanpa offset).
2. Semua output report juga dianggap local-time.
3. Hindari menggabungkan data dari sistem eksternal yang pakai UTC tanpa konversi eksplisit.

Kelebihan: sederhana untuk tim yang selalu beroperasi di satu timezone.
Risiko: integrasi lintas zona waktu rawan salah.

## 5) Cutover Plan (Staging Dulu)

1. Buat staging environment yang mirip production (schema + sample data representatif).
2. Ambil snapshot report “sebelum” untuk pembanding:
   - 3-5 report paling penting, simpan output (CSV/angka agregat) untuk periode yang sama.
   - Metrik agregat: count per hari, sum per hari, “top N” per hari.
3. Terapkan perubahan timezone:
   - Server: `ALTER SYSTEM SET timezone TO 'Asia/Bangkok';` lalu restart atau `SELECT pg_reload_conf();` (tergantung).
   - DB: `ALTER DATABASE ... SET timezone ...;`
   - Roles: `ALTER ROLE ... SET timezone ...;`
4. Pastikan koneksi aplikasi membuat session baru (restart app) supaya setting session ikut.
5. Jalankan smoke test:
   - Create record baru, pastikan waktu yang tersimpan sesuai ekspektasi.
   - Bandingkan report “sesudah” vs “sebelum” untuk periode yang sama.

## 6) Jika Data Existing Berpotensi “Geser Jam”: Rencana Backfill

Kasus umum: kolom `timestamp without time zone` sebenarnya berisi UTC, lalu setelah DB timezone jadi GMT+7, query/report yang “menganggap local” jadi tampak bergeser.

Pola solusi yang aman:

1. Jangan ubah data dulu.
2. Ubahlah query/report layer untuk melakukan konversi yang benar berdasarkan semantics kolom.
3. Jika harus migrasi tipe:
   - Buat kolom baru `..._timestamptz`.
   - Backfill dengan konversi eksplisit.
   - Switch aplikasi ke kolom baru.
   - Drop kolom lama setelah stabil.

Contoh backfill (jika `created_at` saat ini adalah UTC tapi disimpan di `timestamp without time zone`):

```sql
-- Interpretasikan created_at sebagai UTC, konversi jadi timestamptz moment yang benar
ALTER TABLE some_table ADD COLUMN created_at_tz timestamptz;

UPDATE some_table
SET created_at_tz = (created_at AT TIME ZONE 'UTC');
```

Contoh backfill (jika `created_at` saat ini adalah waktu lokal GMT+7 di `timestamp without time zone` dan kamu mau jadikan canonical moment):

```sql
ALTER TABLE some_table ADD COLUMN created_at_tz timestamptz;

UPDATE some_table
SET created_at_tz = (created_at AT TIME ZONE 'Asia/Bangkok');
```

## 7) Aplikasi: Checklist “Tidak Kejutan”

1. Pastikan aplikasi selalu jelas tentang timezone saat parsing/serialisasi:
   - Semua API response timestamp: gunakan ISO 8601 dengan `Z` atau offset.
2. Pastikan ORM/driver tidak melakukan konversi diam-diam:
   - Cek bagaimana DateTime dipetakan (mis. Prisma) dan apakah kolom di DB `timestamp` vs `timestamptz`.
3. Pastikan query yang group-by per hari memakai timezone yang benar:

```sql
-- Group by tanggal lokal Asia/Bangkok dari timestamptz
SELECT date_trunc('day', created_at AT TIME ZONE 'Asia/Bangkok') AS day_local,
       count(*)
FROM some_table
GROUP BY 1
ORDER BY 1;
```

## 8) Verification Checklist (Wajib)

1. DB config:

```sql
SHOW timezone;
SELECT current_setting('TimeZone');
```

2. Insert baru:
   - Insert 1 record melalui aplikasi.
   - Cek timestamp yang tersimpan sesuai ekspektasi jam lokal/canonical.
3. Report parity:
   - Untuk rentang waktu yang sama, bandingkan agregat sebelum/sesudah.
   - Fokus ke boundary hari (00:00 - 02:00) karena paling sering berubah bucket.
4. Integrasi eksternal:
   - Minimal 1 alur end-to-end yang melibatkan input timestamp dari luar.

## 9) Rollback Plan

1. Siapkan backup sebelum cutover.
2. Rollback konfigurasi timezone:
   - Kembalikan `timezone` ke setting semula.
3. Restart DB + aplikasi untuk refresh session.
4. Jika kamu sempat melakukan backfill/migrasi tipe, rollback harus mengikuti strategi schema-migration (drop kolom baru, restore backup, atau deploy versi sebelumnya).

## 10) Project-Specific Mapping (Berdasarkan Schema Saat Ini)

Status saat ini dari migration SQL: mayoritas kolom waktu memakai `TIMESTAMP(3)` (tanpa timezone), dan banyak default `CURRENT_TIMESTAMP`.

### Prioritas P0 (harus diamankan dulu)

1. `m0_session.expires_at`:
   - Semantics: absolute expiry moment (wajib konsisten lintas timezone).
   - Tipe ideal: `timestamptz`.
   - Risiko jika dibiarkan `timestamp`: token bisa dianggap expired lebih cepat/lambat saat asumsi zona berubah.
2. `m2_inventory_ledger.transaction_date`:
   - Semantics: event moment transaksi stok.
   - Tipe ideal: `timestamptz`.
   - Risiko: report inventory per-hari bisa loncat bucket.
3. `m0_users.last_login`:
   - Semantics: audit login moment.
   - Tipe ideal: `timestamptz`.

### Prioritas P1 (audit trail, strongly recommended)

Semua `created_at`, `updated_at`, `deleted_at`, `assigned_at`, `joined_at` pada tabel:

1. `m0_users`, `m0_role`, `m0_menu`, `m0_role_menu`, `m0_permission`, `m0_role_permission`
2. `m0_department`, `m0_user_role`, `m0_user_department`, `m0_auditlog`
3. `m1_contact`, `m1_uom`, `m1_division`, `m1_province`, `m1_city`, `m1_city_sla`, `m1_warehouse`, `m1_item`
4. `m2_inbound`, `m2_inbound_detail`, `m2_inbound_detail_batch`
5. `m2_outbound`, `m2_outbound_detail`, `m2_outbound_detail_batch`
6. `m2_inventory_batch`, `m2_inventory_ledger`

Semantics: audit/event moment.
Tipe ideal: `timestamptz`.

### Prioritas P2 (date-only, umumnya tidak perlu diubah)

Kolom `DATE` di schema (mis. `do_date`, `shipping_date`, `transaction_date` yang bertipe `@db.Date`, `expired_date`, `expiry_date`) adalah date-only dan biasanya aman tetap `DATE`.

## 11) SQL Migration Template (Bertahap, Zero-Surprise)

Gunakan pola 4 fase per kolom: add new column -> backfill -> dual-write/read switch -> rename/drop.

### Fase A: Tambah kolom baru (contoh P0)

```sql
ALTER TABLE m0_session ADD COLUMN expires_at_tz timestamptz;
ALTER TABLE m2_inventory_ledger ADD COLUMN transaction_date_tz timestamptz;
ALTER TABLE m0_users ADD COLUMN last_login_tz timestamptz;
```

### Fase B: Backfill dengan asumsi explicit

Pilih salah satu asumsi berikut, jangan campur:

1. Jika data lama sebenarnya UTC:

```sql
UPDATE m0_session SET expires_at_tz = expires_at AT TIME ZONE 'UTC' WHERE expires_at IS NOT NULL;
UPDATE m2_inventory_ledger
SET transaction_date_tz = transaction_date AT TIME ZONE 'UTC'
WHERE transaction_date IS NOT NULL;
UPDATE m0_users SET last_login_tz = last_login AT TIME ZONE 'UTC' WHERE last_login IS NOT NULL;
```

2. Jika data lama sebenarnya lokal GMT+7:

```sql
UPDATE m0_session SET expires_at_tz = expires_at AT TIME ZONE 'Asia/Bangkok' WHERE expires_at IS NOT NULL;
UPDATE m2_inventory_ledger
SET transaction_date_tz = transaction_date AT TIME ZONE 'Asia/Bangkok'
WHERE transaction_date IS NOT NULL;
UPDATE m0_users SET last_login_tz = last_login AT TIME ZONE 'Asia/Bangkok' WHERE last_login IS NOT NULL;
```

### Fase C: Default + indeks + constraint

```sql
ALTER TABLE m2_inventory_ledger
  ALTER COLUMN transaction_date_tz SET DEFAULT CURRENT_TIMESTAMP;

-- contoh index pengganti query/report
CREATE INDEX IF NOT EXISTS m2_inventory_ledger_transaction_date_tz_idx
  ON m2_inventory_ledger (transaction_date_tz);
```

### Fase D: Cutover nama kolom (setelah app sudah pakai *_tz)

```sql
-- Contoh satu tabel
ALTER TABLE m0_session DROP COLUMN expires_at;
ALTER TABLE m0_session RENAME COLUMN expires_at_tz TO expires_at;
```

Ulangi untuk kolom lain setelah observasi stabil.

## 12) Query Validasi Parity (Sebelum vs Sesudah)

Jalankan query ini di staging sebelum dan sesudah cutover, lalu bandingkan hasil:

```sql
-- 1) Bucket harian local time (untuk kolom timestamptz)
SELECT date_trunc('day', transaction_date_tz AT TIME ZONE 'Asia/Bangkok') AS day_local,
       COUNT(*) AS trx_count
FROM m2_inventory_ledger
GROUP BY 1
ORDER BY 1 DESC
LIMIT 30;
```

```sql
-- 2) Boundary rawan (jam 00:00-02:00 local)
SELECT COUNT(*)
FROM m2_inventory_ledger
WHERE (transaction_date_tz AT TIME ZONE 'Asia/Bangkok')::time >= TIME '00:00'
  AND (transaction_date_tz AT TIME ZONE 'Asia/Bangkok')::time < TIME '02:00';
```

```sql
-- 3) Cek timezone aktif
SHOW timezone;
SELECT now(), current_timestamp, localtimestamp;
```

## 13) Implementasi Aplikasi (Prisma) Saat Cutover

1. Ubah field prioritas di `apps/api-gateway/prisma/schema.prisma` ke `@db.Timestamptz(3)` setelah kolom DB siap.
2. Generate migration Prisma untuk penyesuaian final naming/constraint.
3. Deploy aplikasi yang:
   - Menulis ke kolom baru (`*_tz`) lebih dulu.
   - Membaca dari kolom baru untuk endpoint/report kritikal.
4. Setelah observasi stabil, hapus kolom lama.
