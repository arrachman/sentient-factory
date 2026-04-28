---
slug: konsep-auto-learning-senti-ai
title: Konsep Auto Learning Senti AI Dari Report Client Sampai Perbaikan Query dan OBT
description: Konsep kerja auto learning Senti AI untuk belajar dari report client, mengontrak API laporan, membaca hasil report, lalu memperbaiki query, semantic schema, dan struktur OBT saat ditemukan gap data.
authors: [slorber]
tags: [ai, engineering, erp, myerpplus]
---

Artikel ini menjelaskan satu konsep penting untuk evolusi **Senti AI**: bukan hanya menjawab pertanyaan dari data yang sudah ada, tetapi **belajar dari report nyata yang dipakai user** lalu memakai hasil itu untuk memperbaiki pipeline data dan knowledge layer.

<!-- truncate -->

Konsep ini relevan untuk lingkungan seperti `myerpplus`, karena masalah utama biasanya bukan “AI tidak bisa membuat SQL”, tetapi:

1. definisi bisnis tersembunyi di report lama
2. filter penting hanya ada di setting laporan
3. struktur data OBT belum selalu mencerminkan kebutuhan report
4. semantic schema belum selalu cukup kaya untuk meniru hasil report operasional

Dengan kata lain, report client adalah **bukti perilaku bisnis nyata**. Itu sebabnya report perlu dipakai sebagai bahan belajar.

## Inti Konsep

Tujuan auto learning Senti AI adalah:

1. mengambil report yang benar-benar dipakai user
2. memahami kontrak input dan output report tersebut
3. membaca hasil report final
4. membandingkannya dengan hasil query Senti AI
5. mendeteksi gap
6. memperbaiki lapisan yang salah:
   - query
   - semantic schema
   - struktur OBT

Jadi pendekatannya bukan training model generik, tetapi **closed-loop learning dari artefak bisnis yang valid**.

## Flow Yang Diusulkan

Alur dasarnya sesuai langkah berikut.

### 1. Generate report dari API client `myerpplus`

Sistem memanggil API report dari client untuk menghasilkan output laporan aktual.

Fungsi langkah ini:

1. mengambil hasil report yang benar-benar dipakai user
2. memastikan sumber belajar berasal dari implementasi bisnis aktif
3. menghindari asumsi AI yang tidak sesuai dengan realita sistem

Output langkah ini:

1. metadata report
2. parameter yang dipakai
3. hasil data report

### 2. Akses ke setting laporan

Setelah report berhasil diambil, sistem perlu membaca konfigurasi report.

Yang penting di sini bukan hanya nama report, tetapi juga:

1. endpoint yang dipakai
2. filter wajib dan opsional
3. parameter waktu
4. segmentasi
5. kemungkinan sorting, grouping, atau mode tampilan

Tanpa langkah ini, Senti AI hanya melihat hasil akhir, tetapi tidak tahu **kontrak input** yang membentuk hasil tersebut.

### 3. Pilih salah satu report lalu terapkan API kontrak

Pada tahap ini, satu report dipilih sebagai objek belajar.  
Lalu sistem menyimpan kontrak report tersebut, misalnya:

1. endpoint report
2. daftar filter
3. tipe parameter
4. default value
5. bentuk output yang diharapkan

Ini penting karena satu report bukan hanya query, tetapi kombinasi:

1. intent bisnis
2. input contract
3. aturan filter
4. bentuk output

Kalau kontraknya tidak jelas, Senti AI sulit mengulang hasil yang serupa secara konsisten.

### 4. Simpan hasil menjadi artefak report

Hasil belajar dari satu report perlu disimpan sebagai artefak yang stabil.

Minimal artefaknya:

1. identitas report
2. endpoint dan parameter
3. contoh payload request
4. contoh output response
5. snapshot hasil report
6. metadata waktu generate

Artefak ini penting untuk audit dan regression.  
Tanpa penyimpanan ini, proses belajar akan bersifat sementara dan tidak bisa diulang.

### 5. Upload file hasil jadi ke Senti AI

Artefak report atau file hasil report lalu diunggah ke Senti AI.

Di tahap ini, file bisa berfungsi sebagai:

1. contoh ground truth
2. bukti struktur kolom
3. referensi agregasi
4. referensi format bisnis

Artinya, Senti AI tidak hanya melihat “prompt”, tetapi juga melihat **contoh jawaban yang benar**.

### 6. File dibaca dan dianalisis

Senti AI lalu membaca file tersebut untuk mengekstrak:

1. nama kolom yang tampil
2. urutan kolom
3. tipe nilai
4. agregasi yang dipakai
5. pola filter
6. definisi bisnis implisit

Langkah ini penting karena sering kali logika bisnis tidak tertulis eksplisit.  
Ia justru terlihat dari bentuk report, misalnya:

1. kolom tertentu selalu tampil bersama
2. nilai tertentu selalu dijumlahkan dengan aturan khusus
3. filter tanggal memakai logika periode bisnis, bukan sekadar tanggal transaksi

## Ekspektasi Sistem

Setelah artefak report dibaca, target utamanya adalah:

1. Senti AI bisa menghasilkan data yang serupa
2. hasil Senti AI bisa dibandingkan dengan report referensi
3. gap bisa diidentifikasi secara sistematis

Kata “serupa” di sini berarti:

1. kolom yang dihasilkan relevan
2. metrik utama konsisten
3. agregasi sesuai
4. filter bekerja benar
5. hasil akhir cukup dekat untuk dipakai user

Tujuannya bukan menyalin report lama secara buta, tetapi membangun kemampuan Senti AI untuk **mereproduksi intent bisnis yang sama**.

## Ketika Ada Data Yang Miss

Bagian terpenting dari konsep ini adalah saat hasil Senti AI **tidak sama** dengan report referensi.

Kalau ada mismatch, sistem tidak boleh berhenti di pesan “hasil berbeda”.  
Sistem harus bisa mengklasifikasikan sumber masalahnya.

### 1. Query salah

Kasus ini terjadi jika:

1. filter belum lengkap
2. join tidak sesuai
3. agregasi salah
4. grain data tidak tepat

Perbaikannya:

1. revisi query template
2. tambah filter contract
3. tambah validasi output

### 2. Semantic schema kurang lengkap

Kasus ini terjadi jika:

1. alias bisnis tidak dikenali
2. relasi tabel tidak cukup jelas
3. kolom penting belum punya deskripsi yang benar
4. join hint belum ada

Perbaikannya:

1. revisi semantic schema
2. tambah synonym bisnis
3. tambah relationship dan join hints
4. tambah caution area

### 3. Struktur data OBT belum cukup

Kasus ini lebih serius.  
Terjadi jika report client memakai definisi bisnis yang memang belum tercermin di OBT.

Contohnya:

1. kolom turunan penting belum ada
2. grain OBT terlalu kasar
3. event penting belum ditangkap
4. relasi lintas dokumen belum tersedia

Perbaikannya:

1. revisi struktur OBT
2. tambah tabel OBT baru
3. tambah kolom derivatif
4. perbaiki ETL atau transformasi

Ini inti nilai strategisnya: auto learning tidak hanya memperbaiki jawaban AI, tetapi juga **mendorong evolusi data model**.

## Kenapa Pendekatan Ini Kuat

Ada beberapa alasan teknis kenapa pendekatan ini lebih realistis daripada sekadar “fine-tune AI”.

### Report nyata adalah ground truth operasional

Report client sudah dipakai user untuk keputusan harian.  
Itu berarti report tersebut lebih dekat ke kebutuhan bisnis dibanding schema mentah.

### Gap lebih mudah di-trace

Kalau hasil referensi dan hasil AI sama-sama disimpan sebagai artefak, maka perbedaan bisa diurai dengan jelas:

1. beda filter
2. beda kolom
3. beda agregasi
4. beda grain
5. beda definisi status

### Mendorong perbaikan sistem, bukan hanya prompt

Kalau setiap mismatch selalu diterjemahkan menjadi tugas teknis yang jelas, maka kualitas sistem akan naik di tiga lapisan sekaligus:

1. prompt dan query
2. semantic layer
3. OBT dan ETL

## Artefak Yang Sebaiknya Dibentuk

Agar konsep ini tidak berhenti jadi ide, perlu ada artefak yang konsisten.

### 1. Report contract

Berisi:

1. nama report
2. endpoint
3. filter schema
4. contoh payload
5. contoh response

### 2. Report snapshot

Berisi:

1. hasil report aktual
2. waktu generate
3. versi konfigurasi
4. identitas client atau environment

### 3. AI reproduction result

Berisi:

1. query yang dihasilkan
2. hasil query
3. metadata model
4. confidence

### 4. Gap analysis

Berisi:

1. kolom yang mismatch
2. nilai yang mismatch
3. kemungkinan akar masalah
4. rekomendasi perbaikan

### 5. Improvement backlog

Berisi:

1. fix query
2. fix semantic schema
3. fix OBT
4. prioritas
5. status implementasi

## Bentuk MVP Yang Realistis

Versi awal tidak perlu mencoba semua report sekaligus.  
Mulailah dari beberapa report yang paling sering dipakai dan paling stabil.

Urutan MVP yang masuk akal:

1. pilih 3-5 report prioritas
2. simpan kontrak report
3. simpan snapshot output
4. upload snapshot ke Senti AI
5. minta Senti AI menghasilkan hasil yang setara
6. bandingkan hasil
7. klasifikasikan gap ke query, semantic, atau OBT

Dengan alur ini, tim bisa membangun loop belajar yang nyata tanpa menunggu sistem sempurna dulu.

## Risiko Yang Harus Dijaga

Konsep ini kuat, tapi tetap ada batasannya.

### 1. Report legacy belum tentu selalu benar

Jangan menganggap semua report lama otomatis benar.  
Beberapa report bisa saja membawa warisan bug atau definisi lama.

### 2. Filter implisit sering tersembunyi

Banyak report terlihat sederhana, tapi sebenarnya mengandung logika default tersembunyi.  
Kalau ini tidak ditangkap, hasil reproduksi akan meleset.

### 3. Output serupa tidak selalu berarti definisi sudah benar

Dua query bisa menghasilkan angka mirip, tetapi dari logika yang berbeda.  
Karena itu validasi tidak boleh hanya numerik, tapi juga struktural.

## Penutup

Auto learning Senti AI sebaiknya dipahami sebagai **mekanisme belajar dari report operasional yang nyata**, bukan sekadar fitur upload file.

Flow yang diinginkan adalah:

1. ambil report dari client
2. baca setting dan kontraknya
3. simpan artefaknya
4. upload ke Senti AI
5. analisis hasil report
6. reproduksi output yang serupa
7. deteksi gap
8. perbaiki query, semantic schema, atau struktur OBT

Kalau loop ini dibangun dengan benar, maka setiap report baru tidak hanya menambah dokumentasi, tetapi juga menambah **kemampuan sistem untuk memahami bisnis**.

Jika perlu, artikel lanjutan yang paling masuk akal adalah:

1. desain format `report contract` untuk Senti AI
2. desain format `gap analysis`
3. alur implementasi backlog otomatis untuk fix `query`, `semantic`, dan `OBT`
