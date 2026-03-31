---
slug: seri-dokumentasi-semantic-schema-dan-ai-sql
title: Semantic Schema dan AI SQL Dari Query Mentah Sampai Domain Siap Pakai
description: Panduan terpadu untuk membangun semantic schema, summary, guide NL2SQL, prompt, dan regression test dari query legacy mentah sampai siap dipakai AI.
authors: [slorber]
tags: [database, ai, engineering]
---

Artikel ini menyatukan tiga hal sekaligus:

1. guideline umum dari query mentah sampai artefak AI-ready
2. studi kasus konkret domain `M5`
3. checklist implementasi domain baru dari `m0` sampai `m12`

<!-- truncate -->

Tujuannya sederhana: kalau tim ingin menyiapkan satu domain baru agar bisa dipakai AI SQL generation, semua aturan, urutan kerja, dan contoh konkretnya ada di satu tempat.

## Kenapa Pipeline Ini Dibutuhkan

Di project ini, AI tidak boleh langsung bekerja dari nama tabel atau tebakan schema.

Alasannya:
- query legacy punya logika bisnis yang tidak selalu terlihat dari nama tabel
- report dan service sering memakai pola join yang spesifik
- beberapa domain punya alur dokumen bertahap
- beberapa domain punya relasi polymorphic atau relasi lintas dokumen yang rawan salah

Jadi, yang dibangun bukan hanya schema database, tapi satu pipeline artefak:
- query mentah
- inventori query
- schema semantik
- summary audit
- guide NL2SQL
- prompt
- regression test

## Prinsip Dasar

Aturan utamanya:

1. mulai dari query yang benar-benar dipakai sistem
2. pisahkan sumber mentah, schema, summary, dan guide AI
3. jangan langsung membuat schema dari nama tabel saja
4. pakai report legacy dan service legacy sebagai bukti domain
5. artefak untuk AI harus lebih ketat daripada artefak dokumentasi manusia

## Urutan Artefak

Urutan yang disarankan:

1. query mentah report
2. query mentah service/backend
3. inventori query bersih
4. pengelompokan query berdasarkan tipe
5. semantic schema domain
6. semantic schema gabungan
7. summary markdown
8. summary flat JSON bila perlu
9. guide NL2SQL markdown
10. guide NL2SQL JSON
11. integrasi ke prompt
12. regression seed, validator, dan runner

## Struktur Lapisan dan Manfaatnya

### Query mentah report

Contoh:
- `m0_report_rmoduleid_<id>.sql`

Fungsi:
- menangkap query report legacy yang benar-benar dipakai
- memperlihatkan tabel, filter, dan join yang terlihat oleh user lama
- menjadi sumber validasi saat schema masih ambigu

Aturan:
- simpan apa adanya
- jangan campur dengan interpretasi
- query rusak boleh dipisahkan atau dibuang dari versi bersih

### Query mentah service/backend

Contoh:
- `<prefix>-queries.md`

Fungsi:
- mengumpulkan query dari file service legacy
- menangkap alur operasional yang tidak selalu muncul di report
- membantu menemukan pola `getdata`, `history`, `detail`, `payment`, `related document`

Aturan:
- fokus pada query yang benar-benar dipakai code
- placeholder dinamis boleh dirapikan
- router/switch jangan dianggap query bisnis

### Query by type

Contoh:
- `<prefix>-queries-by-type.md`

Fungsi:
- merangkum pola query berdasarkan intent
- memudahkan identifikasi struktur header/detail/history/payment
- memudahkan penulisan `functions`, `join_hints`, dan `caution_areas`

Aturan:
- kelompokkan berdasarkan kegunaan bisnis
- jangan hanya menyalin query secara acak

### Semantic schema domain

Contoh:
- `semantic-schema-<prefix>.json`

Fungsi:
- source of truth terstruktur untuk satu domain
- menyimpan tabel, kolom, description, synonyms, alias, functions, relationships, join hints, dan polymorphic relationships

Aturan:
- gunakan tabel dan kolom nyata
- description harus natural
- relasi harus bisa dipertanggungjawabkan dari query/report

### Semantic schema gabungan

Contoh:
- `apps/myerpplus-db-mapping/db/m5 - sales/semantic-schema-sales.json`

Fungsi:
- menggabungkan beberapa schema domain dalam satu area bisnis
- dipakai jika AI perlu cakupan yang lebih luas dari satu prefix

Aturan:
- source of truth tetap di schema domain
- schema gabungan harus sinkron, bukan divergen

### Summary markdown

Contoh:
- `semantic-schema-<prefix>-summary.md`

Fungsi:
- audit manusia-readable
- ringkasan tabel, alias, function, relasi, dan istilah bisnis

Aturan:
- optimalkan untuk review manusia
- jangan menggantikan schema JSON

### Summary flat JSON

Contoh:
- `semantic-schema-<prefix>-summary-flat.json`

Fungsi:
- ringkasan terstruktur yang lebih ringan
- cocok untuk indexing, diff, atau tooling ringan

Aturan:
- opsional
- bukan pengganti schema utama atau guide NL2SQL

### Guide NL2SQL markdown dan JSON

Contoh:
- `semantic-schema-<prefix>-nl2sql.md`
- `semantic-schema-<prefix>-nl2sql.json`

Fungsi:
- mengubah schema teknis menjadi panduan operasional untuk AI
- menjelaskan istilah bisnis
- memberi join aman
- menandai caution area

Struktur JSON yang disarankan:
- `domain`
- `description`
- `source_files`
- `business_terms`
- `table_groups`
- `join_hints`
- `polymorphic_relationships`
- `important_rules`
- `query_patterns`
- `caution_areas`

## Aturan Transformasi Antar Lapisan

### Dari query mentah ke inventori query

Boleh:
- membersihkan placeholder
- menghapus router
- membuang query yang jelas rusak

Jangan:
- mengubah makna bisnis
- menambah join yang tidak ada jejaknya

### Dari inventori query ke semantic schema

Boleh:
- menyimpulkan tabel utama dan tabel detail
- menambahkan description dan synonyms
- menyusun functions dan related tables
- menyusun join hints dari pola yang konsisten

Jangan:
- membuat tabel fiktif
- menambahkan kolom yang tidak ada
- mengarang relationship

### Dari schema ke NL2SQL guide

Boleh:
- menyederhanakan istilah
- menulis alur dokumen
- membuat caution area

Jangan:
- menyalin seluruh schema penuh tanpa seleksi
- menghilangkan warning penting seperti relasi polymorphic

## Studi Kasus M5

Domain `M5` dipakai sebagai contoh konkret karena:
- memiliki banyak dokumen transaksi
- punya report legacy yang aktif
- punya service query yang kaya
- punya relasi lintas dokumen dan polymorphic yang sensitif

### Langkah M5

#### 1. Sumber query report

File:
- [m0_report_rmoduleid_5.sql](/home/rania/apps/sentient-factory/apps/myerpplus-db-mapping/db/m5%20-%20sales/m0_report_rmoduleid_5.sql)

Peran:
- menangkap query report `rmoduleid = 5`
- menjadi bukti query visual/reporting M5

#### 2. Sumber query service

File:
- [m5-queries.md](/home/rania/apps/sentient-factory/apps/myerpplus-db-mapping/db/m5%20-%20sales/m5-queries.md)

Peran:
- menangkap query aktif dari `m5_*.vb`
- menjadi dasar memahami struktur operasional M5

#### 3. Pengelompokan query

File:
- [m5-queries-by-type.md](/home/rania/apps/sentient-factory/apps/myerpplus-db-mapping/db/m5%20-%20sales/m5-queries-by-type.md)

Peran:
- membantu melihat pola listing, getdata, history, payment, dan relasi dokumen

#### 4. Schema domain

File:
- [semantic-schema-m5.json](/home/rania/apps/sentient-factory/apps/myerpplus-db-mapping/db/m5%20-%20sales/semantic-schema-m5.json)

Peran:
- source of truth khusus domain sales M5

#### 5. Schema gabungan

File:
- [semantic-schema-sales.json](/home/rania/apps/sentient-factory/apps/myerpplus-db-mapping/db/m5%20-%20sales/semantic-schema-sales.json)

Peran:
- membawa M5 ke area sales yang lebih luas

#### 6. Summary audit

File:
- [semantic-schema-m5-summary.md](/home/rania/apps/sentient-factory/apps/myerpplus-db-mapping/db/m5%20-%20sales/semantic-schema-m5-summary.md)

Peran:
- memudahkan audit manusia atas tabel, function, alias, dan relasi M5

Catatan:
- `semantic-schema-m5-summary-flat.json` bisa menjadi artefak tambahan bila ingin ringkasan JSON ringan, tetapi tidak wajib

#### 7. Guide NL2SQL

File:
- [semantic-schema-m5-nl2sql.md](/home/rania/apps/sentient-factory/apps/myerpplus-db-mapping/db/m5%20-%20sales/semantic-schema-m5-nl2sql.md)
- [semantic-schema-m5-nl2sql.json](/home/rania/apps/sentient-factory/apps/myerpplus-db-mapping/db/m5%20-%20sales/semantic-schema-m5-nl2sql.json)

Peran:
- memberi istilah bisnis seperti `SQ`, `SO`, `DO`, `SI`, `IC`, `PV`, `SPA`
- menandai join aman dan area polymorphic

#### 8. Integrasi ke prompt

File:
- [sales_sql_readonly_generator.prompt.md](/home/rania/apps/sentient-factory/apps/ai-engine/prompts/sales_sql_readonly_generator.prompt.md)

Peran:
- mengubah schema dan guide menjadi instruksi final untuk model

#### 9. Regression test

File:
- [sales_sql_readonly_generator.m5-regression-tests.md](/home/rania/apps/sentient-factory/apps/ai-engine/prompts/sales_sql_readonly_generator.m5-regression-tests.md)
- [sales_sql_readonly_generator.m5-regression-tests.json](/home/rania/apps/sentient-factory/apps/ai-engine/prompts/sales_sql_readonly_generator.m5-regression-tests.json)

Peran:
- menjaga agar kualitas query M5 tetap stabil setelah perubahan prompt atau schema

### Peta alur M5

```text
m0_report_rmoduleid_5.sql
+ m5-queries.md
+ m5-queries-by-type.md
-> semantic-schema-m5.json
-> semantic-schema-sales.json
-> semantic-schema-m5-summary.md
-> semantic-schema-m5-nl2sql.md
-> semantic-schema-m5-nl2sql.json
-> sales_sql_readonly_generator.prompt.md
-> m5 regression tests
```

## Checklist Implementasi Domain Baru m0 Sampai m12

Checklist ini bisa dipakai untuk domain baru apa pun.

### Level 0: definisikan scope

Jawab dulu:
- prefix domain apa
- area bisnis apa
- tabel utama apa
- report terkait apa
- service/query terkait apa
- domain ini standalone atau lintas domain

Output minimum:
- nama domain
- daftar prefix tabel
- daftar modul utama
- daftar sumber file

### Level 1: kumpulkan query mentah

Target artefak:
- `m0_report_rmoduleid_<id>.sql`
- `<prefix>-queries.md`

Acceptance:
- query report terkumpul
- query service terkumpul
- inventori query bisa dibaca manusia

### Level 2: kelompokkan query

Target artefak:
- `<prefix>-queries-by-type.md`

Acceptance:
- pola query domain terlihat jelas
- header/detail/history/payment bisa dibedakan

### Level 3: bangun schema domain

Target artefak:
- `semantic-schema-<prefix>.json`

Acceptance:
- JSON valid
- tabel penting domain masuk
- kolom penting punya description
- relasi utama masuk akal

### Level 4: sinkronkan ke schema gabungan

Target artefak:
- schema gabungan sesuai area bisnis

Acceptance:
- schema domain tetap jadi source of truth
- schema gabungan sinkron

### Level 5: buat summary audit

Target artefak:
- `semantic-schema-<prefix>-summary.md`
- opsional `semantic-schema-<prefix>-summary-flat.json`

Acceptance:
- domain bisa dipahami tanpa buka JSON penuh

### Level 6: buat guide NL2SQL

Target artefak:
- `semantic-schema-<prefix>-nl2sql.md`
- `semantic-schema-<prefix>-nl2sql.json`

Acceptance:
- istilah bisnis domain jelas
- join aman tertulis
- caution area tertulis

### Level 7: integrasi ke prompt

Target artefak:
- prompt generator utama

Acceptance:
- prompt mengenali domain
- istilah bisnis domain tidak ditebak model

### Level 8: buat regression test

Target artefak:
- seed test
- validator
- runner

Acceptance:
- ada pertanyaan standar untuk retest
- dampak perubahan prompt bisa diukur

### Level 9: integrasi ke AI engine atau dashboard

Perlu bila domain dipakai di workflow runtime nyata.

Acceptance:
- response contract mendukung domain
- visualisasi atau consumer paham bentuk hasilnya

## Kriteria Selesai

### Selesai minimum

Domain dianggap minimal siap dipakai AI jika:

1. query mentah sudah ada
2. schema domain sudah ada
3. summary markdown sudah ada
4. NL2SQL md/json sudah ada
5. prompt sudah mengenal domain itu

### Selesai penuh

Domain dianggap matang jika:

1. semua kriteria minimum selesai
2. schema gabungan sudah sinkron
3. regression seed sudah ada
4. validator dan runner sudah ada
5. smoke test atau live test sudah dilakukan

## Risiko Khas Per Prefix

### m0

Fokus:
- menu
- report
- user
- payment method
- konfigurasi

Risiko:
- banyak dipakai lintas domain
- mudah menjadi sumber lookup yang tidak tercatat

### m1

Fokus:
- master data
- contact
- item
- warehouse
- location
- branch
- COA

Risiko:
- sangat luas
- dipakai lintas domain

### m2

Fokus:
- finance/accounting
- kas/bank
- giro
- memo
- jurnal

Risiko:
- salah pilih header/detail/payment
- salah membedakan jurnal manual dan jurnal posting

### m3

Fokus:
- inventory
- transfer
- receipt
- stock opname
- adjustment

Risiko:
- salah alur `MR -> TS -> RS`
- salah membedakan item biasa dan hauling

### m4

Fokus:
- purchasing
- AP
- vendor payment

Risiko:
- salah urutan dokumen purchasing
- salah join pembayaran vendor

### m5

Fokus:
- sales
- AR
- collection
- return
- payment

Risiko:
- relasi polymorphic
- alur dokumen panjang
- dashboard multi-query

### m6 sampai m12

Aturan umumnya tetap sama:
- kumpulkan query mentah
- bangun schema domain
- buat summary
- buat guide NL2SQL
- integrasi prompt
- tambahkan regression test bila domain kritikal

## Anti-Pattern yang Harus Dihindari

Jangan lakukan ini:

1. langsung membuat prompt tanpa schema domain
2. membuat schema dari tebakan nama tabel
3. mencampur summary dan source of truth
4. membuat guide NL2SQL tanpa join hints
5. melewatkan regression test pada domain kritikal
6. menambahkan relationship yang tidak pernah muncul di query aktif atau report

## Template Hasil Akhir Per Domain

Minimal:

```text
<prefix>-queries.md
<prefix>-queries-by-type.md
semantic-schema-<prefix>.json
semantic-schema-<prefix>-summary.md
semantic-schema-<prefix>-nl2sql.md
semantic-schema-<prefix>-nl2sql.json
```

Untuk domain yang dipakai intensif oleh AI:

```text
<domain>-regression-tests.md
<domain>-regression-tests.json
validator_<domain>.py
run_<domain>_regression.py
```

## Penutup

Kalau pipeline ini dijaga disiplin, domain `m0` sampai `m12` bisa dibangun dengan pola yang konsisten:
- ada bukti query
- ada source of truth schema
- ada ringkasan audit
- ada guide AI
- ada test

Itu inti manfaatnya: AI tidak bekerja dari tebakan, tapi dari artefak yang punya jejak ke query nyata dan bisa diaudit manusia.
