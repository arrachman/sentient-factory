# DRAFT SURAT PENAWARAN (SQ)

**Nomor**: SQ/____/____/2026
**Tanggal**: ____________
**Kepada Yth.**: Bapak Anil — Jl. Terusan Dieng, Malang, Jawa Timur (0816 665 500)
**Perihal**: Penawaran Pengembangan Sistem ERP Sepatu, E-Katalog, POS & Absensi

---

Dengan hormat,

Menindaklanjuti diskusi kebutuhan sistem, berikut kami sampaikan penawaran
pengembangan **Sistem Terintegrasi ERP Produksi Sepatu, E-Katalog, POS Toko, dan
Finance & Accounting, Warehouse & Inventory, Purchasing, Sales, dan Perpajakan, Penggajian, Kemitraan, dan Integrasi Pihak Ketiga**. Seluruh butir
pada Catatan Klarifikasi Lingkup ADD-SPT-2026-0001 sudah masuk lingkup. Sistem dirancang mengikuti proses bisnis aktual: produksi in-house,
subkontrak tukang, distribusi ke toko/sekolah, penjualan online, serta pengawasan
tim lapangan (sales & SPG).

## 1. Lingkup Pekerjaan

### A. Master Data & Fondasi
Master artikel (nomor & warna sebagai varian), **master warna**, **master tukang**,
**master sales**, master bahan, toko/sekolah, gudang, SPG, pengguna & hak akses.

### B. E-Katalog & Order
Katalog online per warna & nomor, order oleh sales (mobile-friendly), order online
oleh toko, keranjang berbasis *size run*, approval, dan pelacakan status pesanan.

### C. Produksi
BOM per artikel × nomor, perintah produksi, tahapan produksi & QC, pemotongan stok
bahan otomatis, pencatatan reject, perhitungan HPP.

### D. Produksi Subkontrak (Tukang)
SPK ke tukang, **setor BOM** & pengeluaran bahan ke tukang dengan pemotongan stok,
pencatatan saldo bahan di tukang, penerimaan barang jadi, rekonsiliasi pemakaian
bahan, serta perhitungan ongkos/hutang tukang. Mendukung dua mode: bahan disediakan
perusahaan, atau bahan milik tukang sendiri.

### E. Purchasing
Master supplier & harga beli, Permintaan Pembelian (PR), Purchase Order dengan
approval, penerimaan barang (goods receipt) dengan pencocokan PO, retur pembelian,
invoice pembelian → hutang supplier. Laporan outstanding PO & riwayat harga beli.

### F. Warehouse & Inventory
Multi-gudang (bahan, barang jadi, gudang tukang, titipan toko), penerimaan &
pengeluaran, transfer antar gudang, mutasi & kartu stok, stok opname beserta
penyesuaian selisih, penilaian persediaan terhubung jurnal, peringatan stok minimum.

### G. Sales — Distribusi & Penjualan
SO → Surat Jalan → Invoice → Piutang. Pencatatan sales penanggung jawab dan tujuan
kirim, mode jual putus & konsinyasi, retur, komisi sales, laporan penjualan.

### H. POS Toko
Aplikasi kasir untuk toko yang tersambung ke sistem pusat, mode offline dengan
sinkronisasi, monitoring stok titipan milik perusahaan secara real-time, shift &
tutup kasir, cetak struk, modul SPG (stok opname & laporan).

### J. Absensi
Absensi admin, SPG, dan sales dengan selfie + GPS/geofence, jadwal & shift,
izin/cuti/lembur, check-in kunjungan sales, dan rekap jam kerja untuk payroll.

### I. Finance & Accounting
Chart of Account & saldo awal; transaksi Cash/Bank Receipt & Disbursement, General
Journal, Adjustment Journal, Memorial Journal, Receipt/Send Giro & kliring,
Receipt/Send Memo, Cash/Bank Transfer, FX Revaluation. Laporan: Buku Besar, Neraca
Saldo, Neraca, Laba Rugi, Arus Kas, kartu hutang & piutang. Terintegrasi dengan
invoice penjualan, hutang tukang, pembelian bahan, dan HPP.

### K. Perpajakan
Peran Admin Pajak: PPN keluaran & masukan, pajak pengeluaran, retur pajak,
pengeluaran keliling sales, cetak faktur dari sistem, arsip laporan pajak bulanan,
serta pembedaan harga pajak vs non-pajak.

### L. Penggajian (Payroll)
Gaji pokok & tunjangan, bonus & insentif, potongan, lembur, proses penggajian
periodik, cetak slip gaji, terhubung jurnal biaya gaji.

### M. Kemitraan & Harga Berjenjang
Jenis pelanggan berjenjang (Konsumen, Affiliate, Dropship, Reseller, Agen), komisi
mitra 10/14/19/24% dengan minimum order, empat tingkat harga jual (Grosir, Pajak,
Non-pajak, Konsumen), target order harian sales & pemantauannya.

### N. Integrasi Pihak Ketiga
Payment gateway (VA, QRIS, e-wallet, kartu; webhook, rekonsiliasi, refund),
ekspedisi semi-otomatis via agregator (ongkir, resi, label, pelacakan), QRIS dinamis
pada POS, notifikasi WhatsApp Business Platform, dan pembelian impor.

### O. Laporan & Dashboard
Stok per artikel × nomor × warna, kartu stok bahan, outstanding SPK & saldo bahan
tukang, penjualan per sales/toko/area, rekap POS & konsinyasi, umur piutang, HPP &
margin, rekap absensi. Export Excel/PDF.

## 2. Rincian Biaya

| No | Uraian Pekerjaan | Biaya (Rp) |
| --- | --- | ---: |
| 1 | Modul Master Data & Manajemen Pengguna | 11.000.000 |
| 2 | Modul E-Katalog & Order (sales + online, checkout) | 24.000.000 |
| 3 | Modul Produksi (BOM, WO, HPP) | 24.000.000 |
| 4 | Modul Subkontrak Tukang (SPK, setor BOM, rekonsiliasi) | 21.000.000 |
| 5 | Modul Purchasing (supplier, PR, PO, goods receipt, hutang) | 17.000.000 |
| 6 | Modul Warehouse & Inventory (multi-gudang, kartu stok, opname) | 20.000.000 |
| 7 | Modul Sales — Distribusi & Penjualan | 21.000.000 |
| 8 | Modul POS Toko (offline-sync, monitoring, SPG) | 20.000.000 |
| 9 | Modul Finance & Accounting | 28.000.000 |
| 10 | Modul Absensi (GPS/geofence, shift, rekap) | 12.000.000 |
| 11 | Modul Perpajakan (PPN, retur pajak, faktur, arsip bulanan) | 14.000.000 |
| 12 | Modul Penggajian (gaji, bonus, potongan, lembur, slip) | 26.000.000 |
| 13 | Modul Kemitraan & Harga Berjenjang (komisi mitra, 4 tingkat harga) | 33.000.000 |
| 14 | Integrasi Payment Gateway | 22.000.000 |
| 15 | Integrasi Ekspedisi (semi-otomatis via agregator) | 14.000.000 |
| 16 | Integrasi QRIS Dinamis pada POS | 9.000.000 |
| 17 | Integrasi Notifikasi WhatsApp | 12.000.000 |
| 18 | Pembelian Impor (perluasan Purchasing) | 10.000.000 |
| 19 | Laporan & Dashboard Manajemen | 7.000.000 |
| 20 | Deployment, migrasi data awal, pelatihan & dokumentasi | 7.000.000 |
| 21 | Support & maintenance bulanan (3 bulan, sudah termasuk) | 8.000.000 |
| | **Subtotal (sebelum pajak)** | **360.000.000** |
| | **PPN 11%** | **39.600.000** |
| | **Total setelah PPN** | **399.600.000** |

**Terbilang**: *Tiga ratus sembilan puluh sembilan juta enam ratus ribu rupiah* (termasuk PPN 11%)

> Nilai pekerjaan Rp 360.000.000 bersifat tetap (*fixed price*).
> Belum termasuk biaya server/hosting, domain, dan perangkat keras POS
> (tablet/PC kasir, printer thermal, barcode scanner).

## 3. Termin Pembayaran

| Termin | Tahap | Porsi | Nilai (Rp) | PPN 11% | Ditagihkan |
| --- | --- | ---: | ---: | ---: | ---: |
| I | Kontrak / DP | 30% | 108.000.000 | 11.880.000 | 119.880.000 |
| II | Serah terima Master Data, Purchasing & Inventory | 25% | 90.000.000 | 9.900.000 | 99.900.000 |
| III | Serah terima Produksi, Subkontrak, E-Katalog, Sales & Kemitraan | 25% | 90.000.000 | 9.900.000 | 99.900.000 |
| IV | Serah terima POS, Integrasi, Finance, Pajak, Absensi, Payroll & Go-Live | 20% | 72.000.000 | 7.920.000 | 79.920.000 |
| | **Total** | **100%** | **360.000.000** | **39.600.000** | **399.600.000** |

## 4. Jangka Waktu

Estimasi **7 (tujuh) bulan** kalender sejak kontrak ditandatangani dan data awal
diterima, dengan penyerahan bertahap per modul sesuai termin di atas.

| Bulan | Fokus |
| --- | --- |
| 1 | Analisis, desain, master data, harga berjenjang |
| 2 | Purchasing (termasuk impor) & Warehouse/Inventory |
| 3 | Produksi in-house & subkontrak tukang |
| 4 | E-Katalog, Sales, distribusi & kemitraan |
| 5 | POS & integrasi pihak ketiga (payment gateway, ekspedisi, QRIS, WhatsApp) |
| 6 | Finance & Accounting, Perpajakan, Absensi, Penggajian |
| 7 | Laporan, migrasi, pelatihan, UAT, go-live |

> Jadwal go-live untuk pembayaran online dan notifikasi WhatsApp bergantung pada
> verifikasi merchant (1–3 minggu) dan persetujuan templat pesan oleh penyedia,
> yang berada di luar kendali kami.

## 5. Yang Kami Serahkan

- Aplikasi web ERP siap pakai (source code menjadi milik klien setelah lunas).
- Aplikasi POS toko.
- Dokumentasi teknis & manual pengguna.
- Pelatihan untuk admin, produksi, gudang, sales, dan kasir (2 sesi).
- **Support & maintenance bulanan 3 bulan** pasca go-live (sudah termasuk): perbaikan
  bug, pendampingan pengguna, monitoring sistem, backup terjadwal.

## 6. Ketentuan

1. Penawaran berlaku **30 hari** sejak tanggal surat.
2. Perubahan lingkup di luar dokumen requirement dikenakan biaya tambahan
   berdasarkan kesepakatan tertulis (*change request*).
3. Klien menyediakan narasumber proses bisnis dan data master awal.
4. Server/hosting produksi disediakan klien, atau kami sediakan dengan biaya
   berlangganan terpisah.
5. Integrasi ke sistem ekspedisi/kurir (cek ongkir otomatis, generate resi,
   pelacakan pengiriman) tidak termasuk; sistem hanya mencatat ekspedisi, nomor
   resi, dan ongkir secara manual.
6. Perpanjangan support & maintenance setelah 3 bulan pertama ditawarkan terpisah.

Demikian penawaran ini kami sampaikan. Kami siap mendiskusikan penyesuaian lingkup
maupun tahapan implementasi sesuai prioritas Bapak/Ibu.

Hormat kami,

<br><br>

**____________________**
____________________
