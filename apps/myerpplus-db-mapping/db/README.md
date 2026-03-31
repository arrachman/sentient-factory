# DB Artefact Prompting Guide

Dokumen ini berisi prompting dan aturan kerja untuk membuat artefak semantic per domain di folder `apps/myerpplus-db-mapping/db/`.

Target akhirnya adalah satu folder domain yang rapi, seperti:

- `m5 - sales`

yang berisi artefak berikut:

- `m0_report_rmoduleid_<id>.sql`
- `<prefix>-queries.md`
- `<prefix>-queries-by-type.md`
- `semantic-schema-<prefix>.json`
- `semantic-schema-<domain>.json` bila ada schema gabungan
- `semantic-schema-<prefix>-summary.md`
- `semantic-schema-<prefix>-nl2sql.md`
- `semantic-schema-<prefix>-nl2sql.json`
- `README.md`

## Tujuan

Setiap folder domain harus menjadi tempat kumpul artefak yang:

1. punya jejak ke query mentah
2. punya source of truth schema
3. punya ringkasan audit untuk manusia
4. punya guide operasional untuk AI/NL2SQL

## Contoh Referensi

Gunakan folder ini sebagai contoh struktur final:

- `apps/myerpplus-db-mapping/db/m5 - sales`

Isi final yang menjadi acuan:

- `m0_report_rmoduleid_5.sql`
- `m5-queries.md`
- `m5-queries-by-type.md`
- `semantic-schema-m5.json`
- `semantic-schema-sales.json`
- `semantic-schema-m5-summary.md`
- `semantic-schema-m5-nl2sql.md`
- `semantic-schema-m5-nl2sql.json`
- `README.md`

## Prompt Utama

Gunakan prompt ini saat ingin membangun domain baru:

```txt
Kumpulkan dan rapikan artefak semantic untuk domain <PREFIX> di folder:

apps/myerpplus-db-mapping/db/<PREFIX> - <NAMA DOMAIN>

Gunakan struktur artefak seperti folder contoh:
- apps/myerpplus-db-mapping/db/m5 - sales

Tugas yang harus dilakukan:

1. Cari dan kumpulkan sumber query report:
- m0_report_rmoduleid_<ID>.sql

2. Cari dan kumpulkan sumber query backend/service:
- <prefix>-queries.md

3. Buat pengelompokan query:
- <prefix>-queries-by-type.md

4. Buat atau rapikan source of truth schema domain:
- semantic-schema-<prefix>.json

5. Jika ada schema gabungan yang relevan, kumpulkan juga:
- semantic-schema-<domain>.json

6. Buat summary manusia-readable:
- semantic-schema-<prefix>-summary.md

7. Buat guide NL2SQL:
- semantic-schema-<prefix>-nl2sql.md
- semantic-schema-<prefix>-nl2sql.json

8. Buat README.md di folder domain yang menjelaskan:
- artefak yang tersedia
- source of truth domain
- schema gabungan jika ada
- artefak yang belum tersedia jika masih ada gap

Aturan kerja:
- jangan mengarang tabel atau kolom
- jangan membuat semantic schema dari tebakan nama tabel saja
- gunakan query report dan query service sebagai bukti domain
- jika ada relasi polymorphic, tulis eksplisit
- jika schema penuh belum tersedia, buat README yang menandai gap itu secara jelas
- jika file sudah dipindahkan ke folder domain, update referensi path yang penting

Output akhir:
- semua artefak domain terkumpul di satu folder
- file lama di lokasi asal dipindahkan, bukan disalin
- manifest dan referensi penting diperbarui bila perlu
```

## Prompt Untuk Masing-Masing File

### 1. Prompt untuk `m0_report_rmoduleid_<id>.sql`

```txt
Ambil query report legacy dari tabel m0_report untuk rmoduleid = <ID>, rapikan hasil concat menjadi file:

m0_report_rmoduleid_<ID>.sql

Aturan:
- fokus pada query SQL final per report
- buang row yang jelas rusak bila diminta versi bersih
- pertahankan struktur yang masih relevan sebagai bukti report legacy
```

### 2. Prompt untuk `<prefix>-queries.md`

```txt
Kumpulkan query dari source app_code/ws/<prefix>/ dan tulis ke:

<prefix>-queries.md

Aturan:
- ambil query nyata dari function, bukan dispatch switch
- bersihkan noise
- tampilkan query SQL sejelas mungkin
- placeholder dinamis boleh dinormalisasi, tapi jangan ubah makna bisnis
```

### 3. Prompt untuk `<prefix>-queries-by-type.md`

```txt
Kelompokkan isi <prefix>-queries.md berdasarkan tipe query dan intent bisnis, lalu simpan ke:

<prefix>-queries-by-type.md

Minimal kelompok:
- listing
- getdata/header-detail
- history
- payment/allocation
- related document
- lookup/master

Tujuan:
- memudahkan audit pola query domain
- menjadi bahan penyusunan functions dan join hints
```

### 4. Prompt untuk `semantic-schema-<prefix>.json`

```txt
Buat atau perbarui semantic schema domain:

semantic-schema-<prefix>.json

Isi minimal:
- tables
- alias
- description
- synonyms
- columns

Isi lanjutan bila tersedia:
- functions
- related_tables
- relationships
- join_hints
- polymorphic_relationships

Aturan:
- tabel dan kolom harus nyata
- deskripsi harus natural
- relasi harus punya jejak di query/report
```

### 5. Prompt untuk `semantic-schema-<domain>.json`

```txt
Jika domain ini perlu schema gabungan, sinkronkan schema domain ke file gabungan:

semantic-schema-<domain>.json

Aturan:
- schema domain tetap source of truth
- schema gabungan hanya membawa konteks lintas domain yang relevan
```

### 6. Prompt untuk `semantic-schema-<prefix>-summary.md`

```txt
Buat ringkasan manusia-readable dari semantic schema domain ke file:

semantic-schema-<prefix>-summary.md

Isi minimal:
- sumber schema
- sumber query
- total tabel
- ringkasan modul/domain
- tabel inti
- relasi penting
- catatan domain

Tujuan:
- audit cepat tanpa buka JSON penuh
```

### 7. Prompt untuk `semantic-schema-<prefix>-nl2sql.md`

```txt
Buat guide NL2SQL markdown untuk domain ini:

semantic-schema-<prefix>-nl2sql.md

Isi minimal:
- tujuan
- cakupan tabel utama
- sinonim bisnis
- join hints utama
- relasi polymorphic bila ada
- aturan pemilihan tabel
- aturan penting
- pola query aman
- caution areas
- checklist NL2SQL domain
```

### 8. Prompt untuk `semantic-schema-<prefix>-nl2sql.json`

```txt
Buat versi machine-friendly dari guide NL2SQL ke file:

semantic-schema-<prefix>-nl2sql.json

Struktur minimal:
- domain
- description
- source_files
- business_terms
- table_groups
- join_hints
- polymorphic_relationships
- important_rules
- query_patterns
- caution_areas
```

### 9. Prompt untuk `README.md` di folder domain

```txt
Buat README.md untuk folder domain yang menjelaskan:

1. nama domain
2. artefak yang tersedia
3. source of truth schema domain
4. schema gabungan bila ada
5. artefak yang belum tersedia
6. status kesiapan domain

Jangan menulis klaim palsu. Jika schema atau nl2sql belum ada, tulis jelas bahwa itu belum tersedia.
```

## Aturan Struktur Folder

Setiap folder domain disarankan memakai format:

- `m1 - master data`
- `m2 - finance`
- `m3 - inventory`
- `m4 - purchasing`
- `m5 - sales`
- `m6 - manufacturing`
- `m7 - procurement advanced`
- `m8 - analytics content`
- `m9 - pending`
- `m10 - pending`
- `m11 - healthcare`
- `m12 - pos`

## Checklist Selesai

Sebuah folder domain dianggap selesai minimum jika:

1. query report sudah ada
2. query service sudah ada
3. query by type sudah ada
4. schema domain sudah ada
5. summary sudah ada
6. NL2SQL md/json sudah ada
7. README folder sudah ada

Jika belum lengkap, README harus menjelaskan gap-nya dengan jujur.

## Catatan Penting

- Jangan pindahkan file tanpa memperbarui referensi penting di runtime atau dokumentasi.
- Jangan membuat semantic schema placeholder kecuali memang diminta untuk menjaga manifest tetap valid.
- Untuk domain yang belum siap penuh seperti `m6-m12`, lebih baik kumpulkan query dan beri status jelas daripada mengarang schema.
