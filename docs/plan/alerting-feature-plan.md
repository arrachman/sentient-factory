# Alerting Feature Plan

Dokumen ini merangkum rencana pengerjaan fitur `Alerting` di Sentient Factory untuk tahap awal berbasis:

1. seeder menu
2. eksekusi query database
3. UI design
4. dummy data

Scope tahap ini sengaja dibatasi ke:

1. visualisasi UI
2. dummy flow end-to-end
3. tanpa integrasi real ke anomaly engine, cron engine, WhatsApp provider, atau email provider

## 1. Tujuan

Tujuan fase awal:

1. membuat struktur menu `Alerting` di aplikasi
2. menyiapkan halaman UI yang sudah terasa nyata untuk demo
3. memakai dummy data agar flow bisa divalidasi cepat
4. menyiapkan fondasi agar integrasi backend bisa ditambahkan bertahap

## 2. Scope Fitur

Fitur yang masuk fase ini:

1. sidebar menu untuk `Alerting`
2. halaman list `Alert Center`
3. halaman list `Alert Rules`
4. halaman `Create Alert Rule`
5. halaman `Alert Templates`
6. halaman `Notification Channels`
7. halaman `Notification Logs`
8. halaman `Alert Detail`
9. halaman `Settings`

Yang belum masuk fase ini:

1. cron job nyata
2. anomaly detection nyata
3. pengiriman WhatsApp nyata
4. pengiriman email nyata
5. retry engine nyata
6. escalation engine nyata

## 3. Struktur Menu Yang Diusulkan

Group menu baru:

- `Alerting`

Submenu:

1. `Alert Center`
2. `Alert Rules`
3. `Alert Templates`
4. `Notification Channels`
5. `Notification Logs`
6. `Settings`

Rasional:

1. fitur ini bukan bagian `Administrator`
2. group `Dashboard` khusus untuk menampilkan widget yang di-pin dari Senti AI
3. alert, channel, log, dan rule punya flow operasional sendiri

## 4. Seeder Menu

### 4.1 Menu keys yang diusulkan

Parent:

- `alerting`

Children:

1. `alerting-center`
2. `alerting-rules`
3. `alerting-templates`
4. `alerting-channels`
5. `alerting-logs`
6. `alerting-settings`

### 4.2 Path yang diusulkan

1. `/app/alerting/center`
2. `/app/alerting/rules`
3. `/app/alerting/templates`
4. `/app/alerting/channels`
5. `/app/alerting/logs`
6. `/app/alerting/settings`

### 4.3 Posisi menu

Saran urutan di sidebar:

1. `Senti AI`
2. `Dashboard`
3. `Alerting`
4. `Administrator`

Alasan:

1. `Dashboard` tetap fokus ke pinned widget
2. `Alerting` lebih dekat ke monitoring operasional aktif

### 4.4 Tugas implementasi seeder

1. tambahkan parent menu `alerting`
2. tambahkan seluruh child menu
3. tentukan icon masing-masing menu
4. masukkan parent ke role yang relevan
5. masukkan child menu ke role yang relevan
6. pastikan tidak bentrok dengan key menu lama

## 5. Eksekusi Query Database

Tahap query database untuk fase ini dibagi dua.

### 5.1 Query untuk menu

Tujuan:

1. insert menu parent dan children ke `m0_menu`
2. bind menu ke role yang dipakai untuk demo

Output:

1. SQL seed / patch menu
2. SQL verifikasi hasil insert

Checklist:

1. query insert parent menu
2. query insert child menu
3. query insert role-menu mapping
4. query select verifikasi

### 5.2 Query untuk dummy data

Karena fase ini belum pakai backend real, query database tidak perlu membuat engine alert penuh dulu.

Ada dua opsi:

1. dummy data disimpan full di frontend
2. dummy data disimpan di file/mock API internal

Rekomendasi fase awal:

1. menu pakai DB asli
2. UI data pakai mock frontend dulu

Alasan:

1. paling cepat untuk validasi visual
2. tidak menambah beban schema terlalu awal
3. struktur data bisa dimatangkan setelah UX stabil

## 6. UI Design Plan

Pendekatan UI/UX yang dipakai:

1. sederhana untuk user bisnis
2. tetap punya advanced power untuk user analyst/admin
3. jangan expose complexity teknis di layar awal

### 6.1 Alert Center

Tujuan:

1. jadi halaman landing fitur alerting
2. menampilkan active alert, severity, status, dan quick action

Komponen:

1. summary cards
2. filter bar
3. alert list/table
4. severity badge
5. quick actions:
   - acknowledge
   - mute
   - resolve

### 6.2 Alert Rules

Tujuan:

1. menampilkan seluruh rule
2. jadi entry point untuk create/edit rule

Komponen:

1. search
2. filter severity
3. filter schedule
4. table/card list
5. toggle active/inactive
6. button `Create Rule`

### 6.3 Create Alert Rule

Format:

wizard 5 step

Step:

1. `What to Monitor`
2. `Condition`
3. `Schedule`
4. `Notify Who`
5. `Preview & Save`

Prinsip:

1. gunakan preset dulu
2. advanced mode disembunyikan di bagian terpisah

### 6.4 Alert Templates

Tujuan:

1. mempercepat setup rule
2. mengurangi friction untuk user non-teknis

Contoh template:

1. Sales Drop Alert
2. Negative Stock Alert
3. Overdue Receivable Alert
4. Cashflow Anomaly
5. Purchase Price Spike

### 6.5 Notification Channels

Tabs:

1. WhatsApp Personal
2. WhatsApp Group
3. Email

Komponen:

1. connection status
2. recipient list
3. test send dummy
4. default sender label

### 6.6 Notification Logs

Tujuan:

1. audit pengiriman
2. validasi UX delivery status

Status dummy:

1. queued
2. sent
3. delivered
4. failed

### 6.7 Alert Detail

Komponen:

1. alert summary
2. source info
3. anomaly explanation
4. recipients
5. delivery history
6. timeline actions

### 6.8 Settings

Isi dummy:

1. default schedule preset
2. quiet hours
3. retry policy
4. severity color mapping
5. default notification template

## 7. Dummy Data Strategy

Untuk fase ini, dummy data harus cukup realistis agar desain tidak terasa kosong.

### 7.1 Dummy data yang perlu disiapkan

1. `alertSummary`
2. `alertEvents`
3. `alertRules`
4. `alertTemplates`
5. `notificationChannels`
6. `notificationLogs`
7. `alertDetail`

### 7.2 Contoh domain dummy

Gunakan campuran domain:

1. sales
2. finance
3. warehouse
4. purchasing

Supaya UI terlihat benar-benar lintas modul.

### 7.3 Dummy severity

1. `low`
2. `medium`
3. `high`
4. `critical`

### 7.4 Dummy channel

1. WhatsApp personal
2. WhatsApp group
3. email

### 7.5 Prinsip dummy data

1. gunakan nama alert yang realistis
2. gunakan timestamp yang bervariasi
3. tampilkan status sukses dan gagal
4. tampilkan beberapa alert yang sudah acknowledged dan resolved

## 8. Rencana Implementasi Bertahap

### Phase 1: Menu dan routing dasar

Deliverable:

1. seeder menu `Alerting`
2. route page dasar
3. sidebar tampil benar

### Phase 2: Dummy UI utama

Deliverable:

1. Alert Center
2. Alert Rules
3. Alert Detail
4. Notification Channels

### Phase 3: Wizard dan halaman pendukung

Deliverable:

1. Create Alert Rule wizard
2. Alert Templates
3. Notification Logs
4. Settings

### Phase 4: Polishing

Deliverable:

1. empty states
2. loading states
3. dummy filter interactions
4. responsive layout
5. visual consistency

## 9. Urutan Kerja Yang Disarankan

Urutan eksekusi:

1. tentukan menu key, path, icon, dan urutan
2. patch seeder menu
3. jalankan query / reseed menu
4. verifikasi menu di sidebar
5. buat routing frontend kosong
6. buat dummy data source
7. bangun `Alert Center`
8. bangun `Alert Rules`
9. bangun `Alert Detail`
10. bangun wizard `Create Alert Rule`
11. bangun halaman pendukung
12. polish layout dan interaction

## 10. Output yang Diharapkan Dari Fase Ini

Pada akhir fase ini, hasil minimal yang harus terlihat:

1. menu `Alerting` sudah muncul di sidebar
2. seluruh page utama bisa dibuka
3. UI terlihat seperti sistem yang hampir siap dipakai
4. flow user bisa didemokan tanpa integrasi backend nyata

## 11. Langkah Setelah Fase Dummy

Setelah UI dummy selesai dan disetujui, baru masuk ke fase integrasi:

1. schema database alert engine
2. API backend rules
3. cron job execution
4. anomaly evaluation
5. WhatsApp provider integration
6. email provider integration
7. delivery retry dan escalation

## 13. Rencana Eksekusi Setelah Dummy UI

Bagian ini menutup gap antara fase demo dan real project implementation, supaya pekerjaan lanjutan tidak terlewat.

Prinsipnya:

1. jangan lompat langsung ke provider integration
2. bangun fondasi domain alert dulu
3. pastikan audit trail dan idempotency siap sebelum delivery fan-out

### Phase 5: Database Schema Real

Tujuan:

1. mengubah konsep UI menjadi entitas backend nyata
2. menyiapkan persistence untuk rule, event, dan delivery

Tabel inti yang disarankan:

1. `alert_rule`
2. `alert_rule_condition`
3. `alert_rule_schedule`
4. `alert_rule_recipient`
5. `alert_event`
6. `alert_event_metric_snapshot`
7. `alert_delivery`
8. `alert_action_log`
9. `alert_template`
10. `notification_channel`

Output:

1. rancangan tabel final
2. SQL create table / Prisma schema
3. seed minimal untuk template dan channel dummy awal

### Phase 6: Backend API Real

Tujuan:

1. mengganti dummy data frontend dengan API nyata
2. menyiapkan CRUD rule dan event audit

Endpoint minimum:

1. `GET /api/alerting/summary`
2. `GET /api/alerting/events`
3. `GET /api/alerting/events/:id`
4. `POST /api/alerting/rules`
5. `GET /api/alerting/rules`
6. `PATCH /api/alerting/rules/:id`
7. `POST /api/alerting/rules/:id/test`
8. `GET /api/alerting/templates`
9. `GET /api/alerting/channels`
10. `PATCH /api/alerting/events/:id/acknowledge`
11. `PATCH /api/alerting/events/:id/resolve`

Output:

1. API contract
2. NestJS module/controller/service
3. validation DTO
4. auth dan permission guard

### Phase 7: Scheduler dan Cron Engine

Tujuan:

1. mengeksekusi rule secara periodik
2. menghasilkan alert event nyata

Komponen:

1. scheduler registry
2. cron executor
3. rule evaluator
4. cooldown / dedup checker

Kemampuan minimum:

1. preset interval
2. cron expression support
3. timezone awareness
4. run log per schedule

Output:

1. worker / scheduled runner
2. rule run log
3. retry-safe execution

### Phase 8: Anomaly / Rule Evaluation Engine

Tujuan:

1. mengevaluasi kondisi rule dari data real
2. membedakan antara threshold alert dan anomaly alert

Mode yang disarankan:

1. `threshold-based`
2. `comparison-based`
3. `missing-data`
4. `anomaly-template-based`

Fase awal real sebaiknya mulai dari:

1. threshold-based
2. percentage change
3. data missing

AI anomaly detection bisa masuk wave berikutnya setelah deterministic mode stabil.

Output:

1. evaluator service
2. condition parser
3. metric snapshot persistence
4. event trigger decision log

### Phase 9: WhatsApp dan Email Integration

Tujuan:

1. mengirim event ke channel nyata
2. memastikan delivery bisa diaudit

Channel prioritas:

1. WhatsApp personal
2. WhatsApp group
3. email

Yang perlu disiapkan:

1. provider adapter abstraction
2. payload formatter
3. delivery status callback handling bila ada
4. retry policy
5. failure classification

Output:

1. channel adapter interface
2. provider implementation
3. delivery log update flow

### Phase 10: Dedup, Cooldown, Escalation

Tujuan:

1. mencegah spam
2. membuat alert tetap operasional

Fitur minimum:

1. dedup window
2. cooldown
3. resend policy
4. escalation rule
5. quiet hours

Output:

1. dedup checker
2. cooldown registry
3. escalation processor

### Phase 11: Observability dan Audit

Tujuan:

1. memastikan alerting engine bisa dipantau
2. memudahkan debugging saat ada missed alert atau duplicate alert

Yang wajib ada:

1. rule run log
2. event audit
3. delivery audit
4. error classification
5. dashboard health metric

Output:

1. audit queries
2. internal health endpoint
3. admin troubleshooting view bila diperlukan

## 14. Rencana Migrasi Dari Dummy ke Real

Supaya transisi rapi, migrasi dummy ke real sebaiknya bertahap:

### Tahap A

1. menu tetap sama
2. route tetap sama
3. UI masih sama
4. data source diganti dari mock ke API real

### Tahap B

1. `Alert Rules` dan `Alert Center` pindah ke API nyata lebih dulu
2. `Templates`, `Channels`, `Logs`, `Settings` menyusul

### Tahap C

1. test send dummy diganti ke provider sandbox
2. cron job sandbox aktif
3. evaluasi rule mulai jalan terbatas

### Tahap D

1. rollout production bertahap per channel
2. mulai dari email
3. lanjut ke WhatsApp personal
4. terakhir ke WhatsApp group

## 15. Dependency Antar Tahap

Urutan dependency:

1. `Seeder menu`
2. `Dummy UI`
3. `Schema database`
4. `API real`
5. `Scheduler`
6. `Rule evaluator`
7. `Delivery adapters`
8. `Dedup/escalation`
9. `Observability`

Jangan membalik urutan ini, karena:

1. tanpa schema dan audit, delivery sulit dipercaya
2. tanpa evaluator stabil, cron hanya akan menghasilkan noise
3. tanpa dedup dan cooldown, channel akan cepat dianggap spam

## 16. Deliverable Final Real Project

Kalau semua phase selesai, hasil akhirnya seharusnya:

1. user bisa membuat alert rule dari UI
2. rule bisa disimpan dan dijalankan scheduler
3. anomaly / threshold dievaluasi dari data nyata
4. event alert tercatat
5. notifikasi terkirim ke WhatsApp personal, WhatsApp group, dan email
6. seluruh delivery punya audit trail
7. user bisa acknowledge, mute, resolve, dan melihat histori lengkap

## 17. Checklist Agar Tidak Terlewat

Checklist implementasi:

1. seed menu selesai
2. route dan page dummy selesai
3. dummy data realistis selesai
4. schema database final selesai
5. API CRUD rules selesai
6. API events dan summary selesai
7. scheduler selesai
8. evaluator selesai
9. email integration selesai
10. WhatsApp personal integration selesai
11. WhatsApp group integration selesai
12. dedup dan cooldown selesai
13. escalation selesai
14. audit trail selesai
15. production rollout checklist selesai

## 12. Keputusan yang Sudah Diambil

Keputusan awal untuk fase ini:

1. gunakan group menu baru: `Alerting`
2. menu disimpan di DB asli lewat seeder
3. UI data memakai dummy/mock data
4. belum membuat engine alert nyata
5. fokus ke user flow dan validasi desain## 6.7 Integrasi Dengan Senti AI Dan Pinned Dashboard

Tujuan:

1. menjaga `Dashboard` tetap fokus ke widget pin hasil Senti AI
2. memungkinkan widget dashboard menjadi source alert tanpa memindahkan menu alert ke group dashboard
3. menjaga boundary domain tetap jelas

Flow dummy yang diusulkan:

1. user generate widget dari `Senti AI`
2. user pin widget ke custom dashboard
3. di card widget tersedia aksi `Create Alert`
4. klik aksi itu membuka `Create Alert Rule` di group `Alerting`
5. wizard membawa konteks source:
   - dashboard key
   - widget id
   - widget title
6. user melengkapi condition, schedule, recipient, lalu save

Catatan desain:

1. dashboard tetap untuk visualisasi
2. alert center tetap untuk lifecycle event, delivery, acknowledge, dan resolve
3. integrasi terjadi melalui `alert_source` yang mereferensikan widget dashboard


