# Alerting Follow-up Gap Plan

Dokumen ini merangkum gap lanjutan setelah fondasi `Alerting` sudah berjalan:

1. metric registry sudah ada
2. alert rule sudah persist
3. alert event sudah persist
4. delivery log, channel, settings, dan templates sudah persist
5. scheduler dan delivery worker dasar sudah ada

Fokus dokumen ini:

1. apa yang masih kurang
2. prioritas implementasi berikutnya
3. hal yang perlu dikonfirmasi ke user sebelum implementasi lanjut

## 1. Gap Utama Saat Ini

### 1.1 Create/Edit Rule belum autofill penuh dari template

Status awal:

1. `Use Template` baru membawa `sourceType`
2. field-field lain belum otomatis terisi penuh dari template yang dipilih

Yang seharusnya terisi otomatis:

1. `module`
2. `severity`
3. `sourceType`
4. `sourceRef`
5. `scheduleValue`
6. `conditionSummary`
7. `messageTemplate`
8. `recommendedChannels`

Impact:

1. user masih harus isi ulang terlalu banyak field
2. value template belum benar-benar terasa reusable

Status implementasi terbaru:

1. `Use Template` sekarang membawa `templateId`
2. `Create Rule` sekarang load template nyata dari DB
3. create mode sekarang autofill:
   - `severity`
   - `schedule`
   - `conditionSummary`
   - `messageTemplate`
   - `recipients` dari `default_recipients`
   - `primaryChannel` dari channel pertama `recommended_channels`
4. jika create rule tidak berasal dari widget, template juga boleh mengisi:
   - `module`
   - `sourceType`
   - `sourceRef`
5. jika create rule berasal dari widget, `widget context` tetap menang untuk source
6. edit mode sekarang tidak auto-overwrite
7. edit mode memakai aksi eksplisit `Apply Template Defaults`

### 1.2 Create/Edit Rule belum punya template hydration yang konsisten

Yang perlu dibuat:

1. endpoint detail template bila diperlukan
2. mapping template ke form state
3. aturan precedence:
   - jika buka dari widget
   - jika buka dari template
   - jika buka untuk edit rule existing

Masalah yang harus dijaga:

1. jangan sampai template menimpa context widget tanpa aturan jelas
2. jangan sampai edit rule existing hilang karena hydration template terlambat

Status implementasi terbaru:

1. precedence sekarang:
   - `existing rule` tetap baseline saat edit
   - `widget context` tetap menang untuk source
   - `template defaults` hanya mengisi field konfigurasi yang disepakati
2. warning source template sekarang ditampilkan di form jika source registry tidak ditemukan
3. backend sekarang menolak template `business-metric` / `system-metric` dengan `source_ref` invalid

### 1.3 Alert Rule belum punya halaman detail/operasi lengkap di level UX

Status sekarang:

1. list rule sudah ada
2. detail rule sudah ada
3. edit/deactivate/delete sudah ada

Yang masih kurang:

1. summary run history per rule
2. related events per rule
3. recipient edit experience yang lebih nyaman
4. visual distinction antara `active`, `paused`, `archived`

### 1.4 Templates masih basic

Status sekarang:

1. template bisa create/edit/delete/deactivate
2. template sudah persist di DB

Yang masih kurang:

1. template detail/read-only page
2. preview hasil autofill yang lebih kaya di luar rule form
3. standardisasi recommended channel values lintas module

Status implementasi terbaru:

1. template sekarang punya:
   - `default_recipients`
   - `is_default`
2. `is_default` sekarang satu per module
3. template card sekarang menampilkan:
   - `Default`
   - `Default Recipients`
4. `Use Template` sekarang benar-benar hydrate rule form
5. template detail/read-only page sekarang sudah ada

### 1.5 Channels masih belum punya governance penuh

Status sekarang:

1. channel bisa create/edit/test send/deactivate/delete

Yang masih kurang:

1. test send history per channel
2. binding yang lebih kuat ke recipient policy
3. validasi format target berdasarkan channel type

Status implementasi terbaru:

1. inactive channel sekarang tidak tampil di list default
2. ada toggle `Show Inactive Channels` untuk reactivation flow
3. backend sekarang validasi target channel untuk:
   - `email`
   - `wa-personal`
   - `wa-group`

### 1.6 Notification delivery masih generic

Status sekarang:

1. worker delivery sudah jalan
2. SMTP sudah siap
3. WhatsApp masih generic webhook / dry-run jika env belum ada

Yang masih kurang:

1. retry/backoff policy yang formal
2. failure classification
3. observability/log yang lebih operasional

Status implementasi terbaru:

1. email provider sudah pakai `SMTP`
2. adapter WhatsApp final `Baileys` sudah masuk ke backend
3. Baileys sekarang aktif jika env berikut diisi:
   - `ALERTING_WA_BAILEYS_ENABLED=true`
   - `ALERTING_WA_BAILEYS_AUTH_DIR=/path/to/auth`
4. jika env/session Baileys belum siap, runtime tetap fallback ke webhook/dry-run
5. delivery log sekarang punya:
   - `retry_count`
   - `max_retries`
   - `next_retry_at`
   - `last_attempt_at`
6. worker delivery sekarang menerapkan retry/backoff dasar sebelum status akhir `dead-lettered`
7. manual `requeue` untuk `failed/dead-lettered` delivery sekarang sudah ada
8. observability ops sekarang punya endpoint aggregate:
   - `GET /api/dashboard/alerting/ops`
9. halaman `Alert Ops` sekarang sudah ada untuk:
   - provider readiness
   - pending retries
   - dead letters
   - rule effectiveness operasional
10. provider health runtime sekarang punya endpoint detail:
    - `GET /api/dashboard/alerting/provider-health`
11. `Alert Ops` sekarang menampilkan:
    - Baileys session health
    - SMTP health
12. pairing flow Baileys dasar sekarang punya endpoint:
    - `POST /api/dashboard/alerting/provider-health/baileys/pairing`
13. `Alert Ops` sekarang bisa memulai pairing dengan:
    - phone number untuk pairing code
    - kosongkan phone number untuk QR token
14. `Alert Ops` sekarang bisa render QR visual langsung dari token pairing backend
15. pairing code dan QR token sekarang bisa di-copy dari UI
16. pairing/session sekarang punya audit persistence di DB
17. `Alert Ops` sekarang menampilkan recent pairing attempts dari audit storage
18. provider session sekarang punya state formal di DB
19. `Alert Ops` sekarang menampilkan current provider session state
20. dead-letter sekarang punya workflow triage khusus
21. page `/app/alerting/triage` sekarang tersedia untuk:
    - assign owner
    - update triage status
    - add investigation note
    - requeue delivery
22. triage sekarang punya SLA policy runtime:
    - `triage_sla_minutes`
    - `triage_escalation_policy`
23. backend triage sekarang menghitung:
    - `age_minutes`
    - `sla_due_at`
    - `sla_status`
    - `escalation_level`
24. `Alert Ops` dan `/app/alerting/triage` sekarang menampilkan overdue/critical triage state
25. triage auto-escalation worker sekarang sudah ada
26. triage escalation sekarang punya:
    - configurable channel
    - configurable cooldown
    - manual run endpoint
    - auto-created escalation event + delivery log
27. triage row sekarang menyimpan escalation history ringan:
    - `escalation_count`
    - `last_escalated_at`
    - `last_escalation_level`
28. triage escalation sekarang bisa route ke owner channel jika `assigned_to` cocok dengan `internal_user` channel aktif
29. fallback tetap ke ops escalation channel jika owner tidak punya channel yang valid
30. triage sekarang bisa auto-close on recovery saat delivery yang di-requeue berhasil terkirim lagi
31. runtime setting `triage_auto_close_on_recovery` sekarang tersedia di backend dan UI settings
32. role/team escalation matrix dasar sekarang ada lewat registry policy
33. triage escalation sekarang resolve target dari:
    - ops fallback channel
    - module + escalation level policy
    - owner-bound channel jika assigned owner punya channel aktif
34. API `dead-letter-triage` sekarang support filter/sort server-side:
    - `deliveryId`
    - `triageStatus`
    - `acknowledged`
    - `slaStatus`
    - `moduleKey`
    - `stage`
    - `search`
    - `sortBy`
    - `sortOrder`
35. halaman `/app/alerting/triage` sekarang punya filter operasional untuk ack state, SLA state, module, stage, search, dan sort
36. response triage sekarang punya `audit_summary` untuk pattern operasional:
    - acknowledge / unacknowledge
    - assignment
    - requeue
    - auto-resolve
37. detail page `/app/alerting/triage/[deliveryId]` sekarang sudah ada
38. queue triage sekarang punya tombol `View Detail` per delivery
39. triage audit analytics sekarang menampilkan:
    - action breakdown
    - top actors
    - activity last 7 days
40. `Alert Ops` sekarang juga menampilkan triage audit activity, bukan hanya SLA/stage state
41. triage sekarang punya persistence `saved view / preset filter`
42. operator sekarang bisa:
    - save current filter set
    - apply saved view
    - edit saved view
    - deactivate/reactivate saved view
    - delete saved view
43. shared system presets sekarang sudah diseed:
    - `Critical Unacknowledged`
    - `Finance Overdue Queue`
    - `Final Stage Reminders`
44. registry formal `role/team` sekarang sudah ada di database:
    - `alert_routing_role`
    - `alert_routing_team`
    - `alert_routing_role_channel`
    - `alert_routing_team_channel`
45. resolver escalation sekarang memakai registry formal `role/team` lebih dulu, lalu fallback ke legacy `owner_label` / `metadata.team`
46. validasi policy `target_type = role/team` sekarang mengecek registry formal, bukan lagi menerima referensi bebas

### 1.7 Alert Center masih bisa diperdalam

Status sekarang:

1. event lifecycle dasar sudah jalan
2. acknowledge / resolve sudah persist

Yang masih kurang:

1. strict state transition guard
2. filter by rule
3. filter by channel delivery state
4. open related rule / related metric dari event detail

## 2. Prioritas Pengerjaan Berikutnya

### Priority 1

#### Autofill template ke Create/Edit Rule

Target:

1. saat user klik `Use Template`, form rule langsung terisi penuh
2. saat user memilih template di dalam form, field juga langsung hydrate

Implementasi:

1. support `templateId` di query string
2. fetch template dari registry template nyata
3. hydrate field-field form yang relevan
4. tambahkan aturan merge context
5. support `Apply Template Defaults` untuk edit rule

Rule merge yang disarankan:

1. `edit rule existing` paling tinggi prioritasnya
2. `widget context` berikutnya
3. `template autofill` berikutnya
4. default form paling bawah

#### Validasi source template

Target:

1. template yang dipakai tidak menunjuk ke source yang invalid

Implementasi:

1. validasi `source_type`
2. validasi `source_ref`
3. tampilkan warning jika source tidak ditemukan

Status implementasi terbaru:

1. backend sudah validasi `business-metric` dan `system-metric`
2. form rule sudah menampilkan warning jika source template tidak cocok dengan registry yang termuat

### Priority 2

#### Rule detail enrichment

Tambahan:

1. run history
2. related events
3. recipient summary
4. quick actions dari detail page

Status implementasi terbaru:

1. recipient summary sudah ada
2. run history terakhir sekarang tampil di detail rule
3. recent related events sekarang tampil di detail rule
4. quick action `Open Event` dari detail rule sekarang ada

#### Channel governance

Tambahan:

1. active/inactive filter
2. target format validation
3. recent test-send history

### Priority 3

#### Delivery provider hardening

Tambahan:

1. provider WhatsApp final
2. retry/backoff formal
3. failure taxonomy
4. dead-letter / requeue strategy

#### Alert analytics

Tambahan:

1. rule effectiveness
2. noisy rule detection
3. delivery failure ratio
4. top unresolved alerts

Status implementasi terbaru:

1. noisy rule detection sekarang sudah ada
2. unresolved alerts by module sekarang sudah ada
3. delivery observability summary sekarang sudah ada
4. pending retries sekarang sudah terlihat di UI log observability
5. dead-letter dan manual requeue sekarang sudah jadi bagian dari delivery operations
6. rule effectiveness analytics sekarang sudah ada
7. dead-letter dashboard sekarang sudah ada di Notification Logs
8. rule effectiveness sekarang juga punya:
   - `successful_runs`
   - `acknowledgement_rate`
   - `resolution_rate`
   - `delivery_success_rate`
   - `failed_deliveries`
   - `dead_lettered_deliveries`
9. dashboard operasional khusus sekarang sudah ada di:
   - `/app/alerting/ops`

## 3. Detail Plan Untuk Autofill Template ke Create/Edit Rule

### 3.1 Scope field yang harus hydrate

Minimal:

1. `module`
2. `severity`
3. `sourceType`
4. `sourceRef`
5. `scheduleValue`
6. `conditionSummary`
7. `messageTemplate`
8. `primaryChannel` dari channel pertama yang direkomendasikan

Opsional fase berikut:

1. condition preset detail
2. default source context

Status implementasi terbaru:

1. `recipients bawaan` sudah masuk lewat `default_recipients`

### 3.2 Alur UI yang diinginkan

#### Flow A - dari halaman Templates

1. user buka `Alert Templates`
2. klik `Use Template`
3. route ke `Create Rule`
4. form langsung terisi penuh dari template

#### Flow B - pilih template di dalam form

1. user buka `Create Rule`
2. pilih template dari dropdown/picker
3. form hydrate otomatis

#### Flow C - edit existing rule lalu ganti template

1. user buka `Edit Rule`
2. rule lama ter-load dulu
3. jika user memilih template baru, harus ada explicit confirmation:
   - apply template fields
   - keep existing fields

Status implementasi terbaru:

1. flow `Use Template` dari halaman template sudah aktif
2. flow pilih template di dalam form sudah aktif
3. flow edit existing rule sekarang memakai tombol eksplisit `Apply Template Defaults`

### 3.3 Risiko implementasi

1. field edit rule ter-overwrite tanpa disengaja
2. template lama menunjuk source yang sudah tidak ada
3. race condition antara fetch rule detail dan fetch template detail

Mitigasi:

1. hydration precedence jelas
2. apply template hanya ketika user explicit memilih template
3. source validation sebelum submit

## 4. Keputusan Final Dari User

1. `recipients` ikut otomatis terisi sebagai default dari template
2. `primaryChannel` diambil dari channel pertama `recommended_channels`
3. jika rule berasal dari widget:
   - source tetap dari widget
   - template hanya mengisi konfigurasi default
4. jika edit existing rule:
   - existing rule tetap baseline
   - template diterapkan lewat `Apply Template Defaults`
   - field identitas utama tidak ditimpa otomatis
5. template perlu `is_default` per module
6. UI memakai status `inactive`, tidak dibedakan dari `paused`
7. inactive channel tidak perlu tampil di list default
8. provider final:
   - WhatsApp: `@whiskeysockets/baileys`
   - Email: `SMTP`

## 5. Gap Yang Masih Tersisa Setelah Implementasi Ini

1. pairing dan operasional session Baileys masih perlu disiapkan di environment runtime
2. state formal session sudah ada, tapi belum ada multi-step state machine/workflow approval
3. analytics rule effectiveness masih bisa diperdalam ke threshold tuning otomatis
4. dead-letter triage sekarang sudah kuat di operasional harian, tetapi saved view masih belum punya sharing policy yang lebih kaya dari `private/shared`
5. triage audit analytics sudah ada, tetapi trend/report historis lintas periode masih belum dipisah ke dashboard analitik khusus

Status implementasi terbaru:

1. basic event transition guard sekarang sudah aktif
2. transisi tidak valid seperti `resolved -> acknowledged` sekarang ditolak di API

## 4. Hal Yang Perlu Dikonfirmasi Ke User

Ini hal-hal yang memang perlu keputusan dari Anda sebelum implementasi lanjut.

### 4.1 Template autofill behavior

Keputusan:

1. saat klik `Use Template`, `recipients` ikut otomatis terisi sebagai default
2. `primaryChannel` diambil dari channel pertama di `recommended_channels`
3. `scheduleValue` dari template boleh mengisi form saat initial hydrate template

Catatan implementasi:

1. recipients hasil template tetap boleh diedit user sebelum save
2. primaryChannel otomatis mengikuti urutan channel pertama template, kecuali user mengubah manual
3. hydrate template hanya berlaku saat user explicit memilih template, bukan setiap rerender

### 4.2 Priority merge behavior

Keputusan dan rekomendasi:

1. jika rule dibuka dari widget lalu user memilih template:
   - `widget context` tetap menang untuk source
   - `template` hanya mengisi konfigurasi default:
     - severity
     - schedule
     - condition summary
     - message template
     - recipients
     - primary channel
2. jika edit rule existing lalu user memilih template:
   - `existing rule` tetap menjadi baseline
   - harus ada explicit action `Apply Template Defaults`
   - field yang diisi template:
     - severity
     - schedule
     - condition summary
     - message template
     - recipients default
     - primary channel
   - field identitas utama tidak boleh ditimpa otomatis:
     - source type
     - source ref
     - widget context
     - metric identity

Rule merge final:

1. `existing rule` menang untuk identity data yang sudah tersimpan
2. `widget context` menang untuk source widget bila rule berasal dari widget
3. `template` hanya mengisi default konfigurasi operasional
4. user edit manual selalu menjadi prioritas tertinggi setelah hydrate selesai

### 4.3 Template data model

Keputusan:

1. template perlu punya default recipients
2. tidak perlu field `primaryChannel` eksplisit terpisah
3. perlu field `is_default` per module

Penjelasan:

1. `primaryChannel` eksplisit berarti kolom khusus yang menyimpan 1 channel utama di template
2. karena sudah disepakati primary channel diambil dari channel pertama `recommended_channels`, kolom khusus belum dibutuhkan
3. `is_default` per module berarti satu template ditandai sebagai template default resmi untuk misalnya `sales`, `finance`, atau `warehouse`
4. field ini sekarang diperlukan agar module bisa punya rekomendasi template utama yang konsisten

### 4.4 Rule lifecycle

Keputusan:

1. `paused` dan `inactive` dianggap sama di UI, gunakan label `inactive`
2. delete rule tetap soft delete seperti sekarang
3. archived rule tidak perlu tampil di list default

### 4.5 Channel UX

Keputusan:

1. inactive channel tidak perlu tampil di list default
2. validasi dependency ke rule aktif belum diputuskan, masih open item
3. test send history khusus per channel masih open item

### 4.6 Provider strategy

Keputusan:

1. WhatsApp final menggunakan `Baileys` (`@whiskeysockets/baileys`)
2. email final tetap `SMTP`

## 5. Rekomendasi Langkah Berikutnya

Urutan yang saya sarankan:

1. siapkan pairing/session runtime `Baileys` di environment nyata
2. jika pairing ingin lebih terkontrol, tambahkan persistence/state audit untuk pairing attempts
3. perdalam analytics ke auto-threshold/noise recommendation jika rule volume mulai besar
4. pertimbangkan workflow triage khusus untuk dead-letter jika delivery failure mulai sering
5. sediakan CRUD UI untuk `alert_triage_escalation_policy` agar routing matrix tidak lagi dikelola dari seed SQL

## 6. Output Yang Diharapkan Setelah Fase Berikut

Jika fase ini selesai, hasil minimal yang diharapkan:

1. template benar-benar reusable
2. create/edit rule jauh lebih cepat
3. konflik field antara template dan existing rule terkontrol
4. UI alerting lebih konsisten dan siap masuk hardening operasional

## 7. Update Implementasi Terbaru

Yang sudah dikerjakan setelah triage routing matrix dasar:

1. CRUD backend untuk `alert_triage_escalation_policy` sudah ditambahkan di `apps/api-gateway`
2. proxy route untuk escalation policy sudah ditambahkan di `apps/web-dashboard`
3. halaman baru `/app/alerting/escalation` sekarang menjadi tempat kelola:
   - module
   - escalation level
   - target type
   - target reference
   - priority
   - active/inactive
4. UI `Settings`, `Triage`, dan `Alert Ops` sekarang sudah punya link langsung ke `Escalation Policy`
5. fase UI saat ini memprioritaskan `target_type = channel`, tetapi backend tetap menerima `role` dan `team` untuk ekspansi berikutnya
6. ekspansi dasar `role/team` sekarang sudah aktif:
   - `role` akan resolve ke channel aktif `internal_user` dengan `owner_label` yang cocok
   - `team` akan resolve ke channel aktif dengan `metadata.team` yang cocok
7. `Notification Channels` sekarang mendukung input `team key` agar routing team bisa dikelola dari UI tanpa migrasi schema baru
8. multi-step escalation stage sekarang memakai `priority` sebagai stage order:
   - stage pertama tetap bisa menyertakan fallback ops channel
   - stage berikutnya dipilih bertahap berdasarkan priority policy berikutnya
   - perubahan severity (`warning -> critical`) memulai progression stage untuk severity baru
9. visibility stage sekarang ditampilkan di:
   - `Dead-Letter Triage` per item
   - `Alert Ops` summary
10. operator sekarang bisa melihat:
   - stage saat ini
   - next stage
   - next stage priority
   - next stage target summary
11. final stage sekarang tidak berhenti diam:
   - setelah item mencapai stage terakhir, escalation worker akan mengirim reminder ke final stage lagi setelah cooldown
   - UI menandai kondisi ini sebagai `Reminder mode`
12. triage sekarang menampilkan `Escalation Timeline` berbasis log delivery escalation yang sudah ada:
   - stage
   - priority
   - target
   - delivery status
   - routing source
   - timestamp request
13. triage sekarang punya explicit acknowledgement:
   - `acknowledged_at`
   - `acknowledged_by`
14. escalation reminder sekarang berhenti berdasarkan explicit acknowledgement, bukan lagi bergantung pada `investigating`
15. manual `requeue` akan clear acknowledgement agar escalation bisa aktif lagi jika delivery kembali gagal
16. operator sekarang bisa `Unacknowledge` item triage tanpa perlu mengubah status workflow
17. triage sekarang punya audit trail operasional:
   - acknowledge
   - unacknowledge
   - status change
   - assignee change
   - requeue
   - auto-resolve
18. queue triage sekarang support filter/sort server-side untuk:
   - ack state
   - SLA state
   - module
   - stage progression
   - text search
   - sort order
19. triage sekarang mengembalikan `audit_summary` agar operator bisa lihat pattern aksi tanpa membuka tiap item
20. detail page `/app/alerting/triage/[deliveryId]` sekarang tersedia untuk fokus investigasi satu delivery
21. triage audit analytics sekarang tersedia di queue dan `Alert Ops`:
   - action breakdown
   - top actors
   - activity last 7 days
22. triage sekarang punya saved view/preset filter persistence dengan CRUD dasar
23. registry formal `role/team` sekarang sudah ada dan dipakai oleh escalation resolver
