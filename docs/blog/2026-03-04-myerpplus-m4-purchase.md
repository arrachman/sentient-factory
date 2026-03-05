---
slug: myerpplus-m4-purchase
title: Pemetaan DB myerpplus Prefix m4_ (Purchasing dan Account Payable)
description: Dokumentasi struktur tabel m4_ pada database myerpplus, termasuk domain proses, pola penamaan tabel, dan mapping kode dokumen pembelian.
authors: [slorber]
tags: [database, erp, mysql]
---

Artikel ini fokus pada dua hal inti: mapping kode dokumen `m4_` dan rekomendasi widget dashboard `PR`.

<!-- truncate -->

## Mapping Kode Dokumen m4_

Berdasarkan `m0_menu` module pembelian (`mnmoduleid = 4`) dan verifikasi tabel:

- `pr`: Permintaan Pembelian
- `rfq`: Undangan Penawaran
- `rq`: Permintaan Penawaran
- `bs`: Perbandingan Harga
- `po`: Order Pembelian
- `ap`: Uang Muka Pembelian
- `grn`: Penerimaan Barang
- `ri`: Invoice Pembelian
- `pp`: Hutang Ongkos Kirim
- `dnr`: Pengiriman Barang Retur
- `prt`: Retur Pembelian
- `vpp`: Rencana Pembayaran Hutang
- `vp`: Pembayaran Hutang
- `pie`: Tukar Faktur
- `ipc`: Kalkulasi Import
- utilitas: `m4_files`, `m4_notes`

## Widget Dashboard untuk `PR` (Permintaan Pembelian)

Jika ingin membuat dashboard khusus `PR`, sumber utama yang paling aman adalah:

- header: `m4_pr`
- detail: `m4_pr_detail`
- histori: `m4_pr_history`, `m4_pr_detail_history`
- enriched data: `m4_pr_getdata`, `m4_pr_v`, `m4_pr_detail_v`

### Widget, Sumber Data, dan Manfaat bagi Manager / Admin Purchase

| # | Widget | Sumber Data | Manfaat / Tujuan bagi Manager | Manfaat / Tujuan bagi Admin Purchase |
|---|--------|-------------|-------------------------------|--------------------------------------|
| 1 | **Total dokumen PR** | `COUNT(*)` dari `m4_pr` | Melihat volume permintaan pembelian secara keseluruhan untuk menilai beban kerja tim dan tren kebutuhan organisasi | Memantau jumlah PR yang harus diproses agar bisa mengatur prioritas kerja harian |
| 2 | **Total item request** | `COUNT(*)` dari `m4_pr_detail` | Mengetahui kompleksitas permintaan — semakin banyak item, semakin besar effort negosiasi dan pengadaan | Mengukur workload detail yang perlu diverifikasi, divalidasi spesifikasi, dan diteruskan ke PO |
| 3 | **Total quantity diminta** | `SUM(jmlbarang)` dari `m4_pr_detail` | Mengukur skala kebutuhan fisik barang untuk perencanaan anggaran dan kapasitas gudang | Memastikan quantity yang diminta masuk akal dan sesuai stok minimum sebelum diproses lebih lanjut |
| 4 | **Total jenis barang diminta** | `COUNT(DISTINCT idbarang)` dari `m4_pr_detail` | Menilai diversitas kebutuhan — jenis barang yang banyak bisa mengindikasikan perlunya konsolidasi supplier | Mengidentifikasi barang-barang baru yang mungkin belum ada kontrak atau supplier tetap |
| 5 | **PR per lokasi** | Grup berdasarkan `prlokasi` / `lokasinama` | Membandingkan kebutuhan antar cabang/lokasi untuk alokasi budget yang lebih adil dan efisien | Mengetahui lokasi mana yang paling aktif agar bisa memprioritaskan pemrosesan PR dari lokasi tersebut |
| 6 | **PR per gudang** | Grup berdasarkan `gudang` / `gudangnama` | Memahami distribusi kebutuhan per gudang untuk optimasi logistik dan pengiriman | Memvalidasi bahwa gudang tujuan sudah benar dan kapasitasnya mencukupi sebelum lanjut ke PO |
| 7 | **Top barang paling sering diminta** | `COUNT(*)` atau `SUM(jmlbarang)` per `idbarang` | Mengidentifikasi barang strategis yang perlu kontrak jangka panjang atau negosiasi harga khusus | Menyiapkan template atau fast-track process untuk barang yang rutin diminta agar pemrosesan lebih cepat |
| 8 | **Top barang berdasarkan volume request** | `SUM(jmlbarang)` tertinggi per `idbarang` | Mendeteksi barang dengan volume tinggi untuk perencanaan bulk purchasing dan penghematan biaya | Memastikan ketersediaan supplier dan lead time untuk barang bervolume tinggi |
| 9 | **Distribusi PR per tipe barang** | Grup berdasarkan `tipebarang` | Melihat komposisi belanja — apakah didominasi bahan baku, consumable, atau aset — untuk strategi pengadaan | Mengkategorikan PR agar bisa diarahkan ke tim atau approval flow yang tepat sesuai tipe barang |
| 10 | **Tren PR harian / mingguan / bulanan** | Jumlah dokumen per tanggal transaksi | Mendeteksi pola musiman atau lonjakan kebutuhan untuk perencanaan anggaran dan stok di periode mendatang | Mengantisipasi periode sibuk agar bisa mengatur jadwal kerja dan menghindari backlog pemrosesan |
| 11 | **Rata-rata item per dokumen PR** | `COUNT(detail) / COUNT(header)` | Menilai efisiensi pengajuan — PR dengan terlalu banyak item mungkin perlu dipecah untuk approval yang lebih cepat | Mengidentifikasi PR yang terlalu kompleks dan mungkin perlu dikonsultasikan ulang dengan requester |
| 12 | **Rata-rata quantity per dokumen PR** | `SUM(jmlbarang) / COUNT(header)` | Memahami skala tipikal per permintaan untuk setting threshold approval otomatis | Mendeteksi anomali — quantity yang jauh di atas rata-rata bisa mengindikasikan kesalahan input |
| 13 | **Status approval / progress PR** | Field status di `m4_pr` atau view `m4_pr_v` | Memantau bottleneck approval — berapa PR yang pending, approved, atau rejected — untuk mempercepat decision-making | Mengetahui PR mana yang sudah bisa dilanjutkan ke PO dan mana yang masih menunggu approval |
| 14 | **Aging PR yang belum diproses** | Selisih hari dari tanggal PR sampai hari ini untuk PR yang belum turun ke PO | Mengidentifikasi PR yang terlalu lama tertunda — bisa berdampak pada operasional jika kebutuhan tidak terpenuhi tepat waktu | Memprioritaskan PR yang sudah lama menunggu agar tidak melewati deadline kebutuhan user |

### Chart yang Relevan

| Chart | Widget Terkait | Manfaat |
|-------|---------------|---------|
| Bar chart: jumlah PR per lokasi | PR per lokasi | Manager bisa langsung melihat lokasi mana yang paling banyak kebutuhan untuk alokasi sumber daya |
| Bar chart: top 10 barang paling sering diminta | Top barang paling sering diminta | Identifikasi cepat barang strategis yang perlu perhatian khusus dalam negosiasi |
| Line chart: tren PR per hari / per bulan | Tren PR harian / mingguan / bulanan | Deteksi pola dan anomali permintaan secara visual untuk perencanaan proaktif |
| Pie / donut: komposisi PR per tipe barang | Distribusi PR per tipe barang | Gambaran cepat proporsi belanja untuk strategi pengadaan per kategori |
| Stacked bar: PR per lokasi dibagi per tipe barang | PR per lokasi + Distribusi per tipe | Analisis mendalam kebutuhan tiap lokasi berdasarkan jenis barang |

