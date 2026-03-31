# Semantic Schema M5 Summary

Sumber: `/home/rania/apps/sentient-factory/apps/myerpplus-db-mapping/db/semantic-schema-m5.json`

Total tabel M5: **81**
Total function M5: **89**
Total polymorphic relationships: **3**
Total join hints: **8**

Dokumen ini merangkum alias, deskripsi, struktur tabel, relasi utama, relasi polymorphic, join hints, dan function semantic utama untuk modul sales M5.

## Join Hints

- `sales_document_flow`: Alur utama dokumen penjualan dari quotation sampai return.
  `m5_sq.sqid = m5_sq_detail.idsq`
  `m5_sq_detail.idsqdetail = m5_so_detail.idsqdetail`
  `m5_so.soid = m5_so_detail.idso`
  `m5_so_detail.idsodetail = m5_pl_detail.idsodetail`
  `m5_pl.plid = m5_pl_detail.idpl`
  `m5_so_detail.idsodetail = m5_do_detail.idsodetail`
- `sales_document_cross_refs`: Relasi silang detail antar dokumen penjualan untuk tracing progres dokumen.
  `m5_pi_detail.idsqdetail = m5_sq_detail.idsqdetail`
  `m5_pi_detail.idsodetail = m5_so_detail.idsodetail`
  `m5_pi_detail.idpldetail = m5_pl_detail.idpldetail`
  `m5_pl_detail.idpidetail = m5_pi_detail.idpidetail`
  `m5_do_detail.idpidetail = m5_pi_detail.idpidetail`
  `m5_dr_detail.idpidetail = m5_pi_detail.idpidetail`
- `sales_receivable_collection`: Alur penagihan dan pembayaran piutang penjualan.
  `m5_ic.icid = m5_ic_detail.idic`
  `m5_pv.pvid = m5_pv_detail.idpv`
  `m5_pv_detail.idicdetail = m5_ic_detail.idicdetail`
- `sales_receivable_polymorphic_targets`: Target dokumen dari detail penagihan/pembayaran berdasarkan kolom sumber.
  `m5_ic_detail.sumber = 'AS' AND m5_ic_detail.idtransaksi = m5_as.asid`
  `m5_ic_detail.sumber = 'SI' AND m5_ic_detail.idtransaksi = m5_si.siid`
  `m5_ic_detail.sumber = 'SR' AND m5_ic_detail.idtransaksi = m5_sr.srid`
  `m5_pv_detail.sumber = 'SI' AND m5_pv_detail.idtransaksi = m5_si.siid`
  `m5_pv_detail.sumber = 'SR' AND m5_pv_detail.idtransaksi = m5_sr.srid`
- `sales_invoice_exchange`: Relasi tukar faktur penjualan terhadap dokumen sumber invoice/return.
  `m5_sie.sieid = m5_sie_detail.idsie`
  `m5_sie_detail.sumber = m5_si.sisumber AND m5_sie_detail.idtransaksi = m5_si.siid`
  `m5_sie_detail.sumber = m5_sr.srsumber AND m5_sie_detail.idtransaksi = m5_sr.srid`
- `sales_advance_and_payment`: Relasi uang muka, penerimaan pembayaran, dan invoice terkait.
  `m5_as.asid = m5_as_pay.idas`
  `m5_ip.ipid = m5_ip_pay.idip`
  `m5_as.asidip = m5_ip.ipid`
  `m5_si.siidas = m5_as.asid`
- `sales_shipping_receivable`: Relasi piutang ongkos kirim dengan invoice penjualan dan detail pembayarannya.
  `m5_rp.rpid = m5_rp_pay.idrp`
  `m5_rp.rpidsi = m5_si.siid`
- `sales_point_adjustment`: Relasi penyesuaian poin penjualan per customer/contact.
  `m5_spa.spaid = m5_spa_detail.idspa`
  `m5_spa_detail.kontak = m1_contact.kid`

## Polymorphic Relationships

- `m5_ic_detail.idtransaksi` via `sumber`: Relasi polymorphic ke dokumen yang ditagih dalam invoice collection.
  `AS` -> `m5_as.asid`
  `SI` -> `m5_si.siid`
  `SR` -> `m5_sr.srid`
- `m5_pv_detail.idtransaksi` via `sumber`: Relasi polymorphic ke dokumen yang dibayar melalui payment voucher.
  `SI` -> `m5_si.siid`
  `SR` -> `m5_sr.srid`
- `m5_sie_detail.idtransaksi` via `sumber`: Relasi polymorphic ke dokumen sumber yang ikut dalam tukar faktur penjualan.
  `SI` -> `m5_si.siid`
  `SR` -> `m5_sr.srid`

## Ringkasan Modul

- **AS**: Advance Sales / Uang Muka Penjualan | tabel: 4 | header: 1 | detail: 0 | history: 2 | relasi: 4
- **CL**: Closing Sales | tabel: 2 | header: 1 | detail: 0 | history: 1 | relasi: 3
- **DO**: Delivery Order | tabel: 4 | header: 1 | detail: 1 | history: 2 | relasi: 6
- **DR**: Delivery Report / Hasil Pengiriman | tabel: 4 | header: 1 | detail: 1 | history: 2 | relasi: 5
- **FILES**: Lampiran Transaksi | tabel: 1 | header: 1 | detail: 0 | history: 0 | relasi: 0
- **IC**: Invoice Collection / Penagihan Piutang | tabel: 4 | header: 1 | detail: 1 | history: 2 | relasi: 2
- **IP**: Incoming Payment | tabel: 4 | header: 1 | detail: 0 | history: 2 | relasi: 2
- **NOTES**: Catatan Transaksi | tabel: 1 | header: 1 | detail: 0 | history: 0 | relasi: 0
- **PI**: Proforma Invoice | tabel: 4 | header: 1 | detail: 1 | history: 2 | relasi: 5
- **PL**: Packing List | tabel: 6 | header: 1 | detail: 1 | history: 3 | relasi: 6
- **PV**: Payment Voucher | tabel: 4 | header: 1 | detail: 1 | history: 2 | relasi: 3
- **RNR**: Receipt Note Return / Penerimaan Barang Retur | tabel: 4 | header: 1 | detail: 1 | history: 2 | relasi: 5
- **RP**: Piutang Ongkos Kirim / Tagihan Tambahan | tabel: 4 | header: 1 | detail: 0 | history: 2 | relasi: 3
- **SF**: Sales Forecast | tabel: 2 | header: 1 | detail: 1 | history: 0 | relasi: 2
- **SI**: Sales Invoice | tabel: 12 | header: 1 | detail: 2 | history: 4 | relasi: 13
- **SIE**: Sales Invoice Exchange / Tukar Faktur | tabel: 4 | header: 1 | detail: 1 | history: 2 | relasi: 1
- **SO**: Sales Order | tabel: 4 | header: 1 | detail: 1 | history: 2 | relasi: 4
- **SPA**: Sales Point Adjustment | tabel: 4 | header: 1 | detail: 1 | history: 2 | relasi: 2
- **SQ**: Sales Quotation | tabel: 5 | header: 1 | detail: 1 | history: 2 | relasi: 5
- **SR**: Sales Return | tabel: 4 | header: 1 | detail: 1 | history: 2 | relasi: 5

## AS - Advance Sales / Uang Muka Penjualan

### Tabel

- `m5_as` | alias: `uang_muka_penjualan` | tipe: Header | kolom: 48 | relasi: 3
  Header uang muka penjualan (AS). Mewakili transaksi advance sales atau uang muka customer.
- `m5_as_pay` | alias: `pembayaran_uang_muka_penjualan` | tipe: Payment/Allocation | kolom: 17 | relasi: 1
  Detail pembayaran atau alat bayar pada uang muka penjualan (AS).
- `m5_as_history` | alias: `riwayat_uang_muka_penjualan` | tipe: History | kolom: 3 | relasi: 0
  Tabel histori header uang muka penjualan (AS). Menyimpan snapshot perubahan dokumen advance sales setiap kali transaksi diarsipkan ke riwayat.
- `m5_as_pay_history` | alias: `riwayat_pembayaran_uang_muka_penjualan` | tipe: History | kolom: 2 | relasi: 0
  Snapshot histori detail pembayaran dokumen AS.

### Kolom Header Penting

- `asid`: Identitas unik data atau relasi ke dokumen/transaksi terkait.
- `ascabang`: Kode atau referensi cabang transaksi.
- `aslokasi`: Kode atau referensi lokasi operasional transaksi.
- `asjenis`: Jenis atau klasifikasi transaksi/dokumen.
- `assumber`: Sumber atau asal pembentukan transaksi.
- `asautonotransaksi`: Nomor dokumen/transaksi unik.
- `asnotransaksi`: Nomor dokumen/transaksi unik.
- `astgl`: Tanggal transaksi atau tanggal referensi.
- `askodepa`: Kode referensi PA pada transaksi sesuai pengaturan bisnis internal.
- `askontak`: Referensi kontak atau contact person.
- `askontakperson`: Referensi kontak atau contact person.
- `as1alamat1`: Baris alamat 1 untuk alamat utama pada dokumen transaksi.

### Relasi Utama

- `m5_as` -> `m5_so`: `m5_as.asidso = m5_so.soid`
- `m5_as` -> `m5_ip`: `m5_as.asidip = m5_ip.ipid`
- `m5_as` -> `m1_contact`: `m5_as.askontak = m1_contact.kid`
- `m5_as_pay` -> `m5_as`: `m5_as_pay.idas = m5_as.asid`

### Functions

- `m5_as_getdata`: Mengambil data header dan detail uang muka penjualan untuk satu dokumen transaksi.
  related_tables: m5_as, m5_as_pay
- `m5_as_getdata_history`: Mengambil riwayat perubahan header dan detail uang muka penjualan.
  related_tables: m5_as, m5_as_history, m5_as_pay_history
- `m5_as_terkait`: Mengambil keterkaitan dokumen uang muka penjualan dengan dokumen transaksi lain di alur proses.
  related_tables: m5_as, m5_as_pay
- `m5_as_v`: Menyediakan listing atau pencarian data uang muka penjualan.
  related_tables: m5_as, m5_as_pay
- `m5_as_v_history`: Menyediakan listing riwayat perubahan untuk uang muka penjualan.
  related_tables: m5_as, m5_as_history, m5_as_pay_history

## CL - Closing Sales

### Tabel

- `m5_cl` | alias: `penutupan_penjualan` | tipe: Header | kolom: 93 | relasi: 3
  Header closing sales atau dokumen penutupan penjualan per item/customer. Dipakai untuk memantau status lanjutan sales order ke PI, PL, DO, DR, SI, RNR, dan SR pada level transaksi yang sudah direalisasikan.
- `m5_cl_history` | alias: `riwayat_penutupan_penjualan` | tipe: History | kolom: 4 | relasi: 0
  Tabel histori header closing sales. Menyimpan snapshot perubahan dokumen penutupan penjualan untuk audit dan pelacakan status realisasi.

### Kolom Header Penting

- `clid`: Identitas unik data atau relasi ke dokumen/transaksi terkait.
- `clcabang`: Kode atau referensi cabang transaksi.
- `cllokasi`: Kode atau referensi lokasi operasional transaksi.
- `clgudang`: Referensi gudang asal/tujuan transaksi.
- `clasalbarang`: Asal barang atau sumber asal item pada transaksi.
- `clasalbarangkategori`: Kategori asal barang atau sumber asal item pada transaksi.
- `cljenispenjualan`: Jenis penjualan pada transaksi.
- `cljenispenjualankategori`: Kategori dari jenis transaksi atau asal barang.
- `clcarabayar`: Metode atau cara pembayaran yang digunakan pada transaksi.
- `clsumber`: Sumber atau asal pembentukan transaksi.
- `clautonotransaksi`: Nomor dokumen/transaksi unik.
- `clnotransaksi`: Nomor dokumen/transaksi unik.

### Relasi Utama

- `m5_cl` -> `m5_so`: `m5_cl.clidso = m5_so.soid`
- `m5_cl` -> `m1_contact`: `m5_cl.clcustomer = m1_contact.kid`
- `m5_cl` -> `m1_item`: `m5_cl.clidbarang = m1_item.bid`

### Functions

- `m5_cl_terkait`: Mengambil keterkaitan dokumen penutupan penjualan dengan dokumen transaksi lain di alur proses.
  related_tables: m5_cl

## DO - Delivery Order

### Tabel

- `m5_do` | alias: `pengiriman_order` | tipe: Header | kolom: 67 | relasi: 1
  Header delivery order (DO) atau surat jalan pengiriman barang ke customer.
- `m5_do_detail` | alias: `detail_pengiriman_order` | tipe: Detail | kolom: 51 | relasi: 5
  Detail barang pada delivery order (DO). Menyimpan item yang dikirim, referensi SO/PL/PI, dan progres realisasi lanjutan.
- `m5_do_detail_history` | alias: `riwayat_detail_pengiriman_order` | tipe: History | kolom: 2 | relasi: 0
  Snapshot histori baris detail dokumen DO.
- `m5_do_history` | alias: `riwayat_pengiriman_order` | tipe: History | kolom: 3 | relasi: 0
  Tabel histori header delivery order (DO). Menyimpan snapshot perubahan dokumen surat jalan atau pengiriman barang.

### Kolom Header Penting

- `doid`: Primary key baris data.
- `docabang`: Kode atau referensi cabang transaksi.
- `dolokasi`: Kode atau referensi lokasi operasional transaksi.
- `dogudang`: Referensi gudang asal/tujuan transaksi.
- `doasalbarang`: Asal barang atau sumber asal item pada transaksi.
- `doasalbarangkategori`: Kategori asal barang atau sumber asal item pada transaksi.
- `dojenispenjualan`: Jenis penjualan pada transaksi.
- `dojenispenjualankategori`: Kategori dari jenis transaksi atau asal barang.
- `docarabayar`: Metode atau cara pembayaran yang digunakan pada transaksi.
- `dosumber`: Sumber atau asal pembentukan transaksi.
- `doautonotransaksi`: Nomor dokumen/transaksi unik.
- `donotransaksi`: Nomor dokumen/transaksi unik.

### Relasi Utama

- `m5_do` -> `m1_contact`: `m5_do.docustomer = m1_contact.kid`
- `m5_do_detail` -> `m5_do`: `m5_do_detail.iddo = m5_do.doid`
- `m5_do_detail` -> `m5_so_detail`: `m5_do_detail.idsodetail = m5_so_detail.idsodetail`
- `m5_do_detail` -> `m5_pl_detail`: `m5_do_detail.idpldetail = m5_pl_detail.idpldetail`
- `m5_do_detail` -> `m5_pi_detail`: `m5_do_detail.idpidetail = m5_pi_detail.idpidetail`
- `m5_do_detail` -> `m1_item`: `m5_do_detail.idbarang = m1_item.bid`

### Functions

- `m5_do_detail_v`: Menyediakan listing detail baris untuk dokumen surat jalan.
  related_tables: m5_do, m5_do_detail
- `m5_do_getdata`: Mengambil data header dan detail surat jalan untuk satu dokumen transaksi.
  related_tables: m5_do, m5_do_detail
- `m5_do_getdata_history`: Mengambil riwayat perubahan header dan detail surat jalan.
  related_tables: m5_do, m5_do_history, m5_do_detail_history
- `m5_do_terkait`: Mengambil keterkaitan dokumen surat jalan dengan dokumen transaksi lain di alur proses.
  related_tables: m5_do, m5_do_detail
- `m5_do_v`: Menyediakan listing atau pencarian data surat jalan.
  related_tables: m5_do, m5_do_detail
- `m5_do_v_history`: Menyediakan listing riwayat perubahan untuk surat jalan.
  related_tables: m5_do, m5_do_history, m5_do_detail_history

## DR - Delivery Report / Hasil Pengiriman

### Tabel

- `m5_dr` | alias: `laporan_hasil_pengiriman` | tipe: Header | kolom: 68 | relasi: 1
  Header hasil pengiriman atau delivery report (DR). Mencatat hasil akhir pengiriman barang, termasuk jumlah terkirim, jumlah kembali, dan progres realisasi lanjutan ke invoice atau retur.
- `m5_dr_detail` | alias: `detail_hasil_pengiriman` | tipe: Detail | kolom: 53 | relasi: 4
  Detail hasil pengiriman pada delivery report. Menyimpan item, kuantitas terkirim/kembali, dan progres dokumen lanjutan seperti SI, RNR, SR, atau realisasi lain.
- `m5_dr_detail_history` | alias: `riwayat_detail_hasil_pengiriman` | tipe: History | kolom: 2 | relasi: 0
  Snapshot histori baris detail dokumen DR.
- `m5_dr_history` | alias: `riwayat_hasil_pengiriman` | tipe: History | kolom: 2 | relasi: 0
  Tabel histori header delivery report. Menyimpan snapshot perubahan hasil pengiriman barang untuk audit proses distribusi.

### Kolom Header Penting

- `drid`: Identitas unik data atau relasi ke dokumen/transaksi terkait.
- `drcabang`: Kode atau referensi cabang transaksi.
- `drlokasi`: Kode atau referensi lokasi operasional transaksi.
- `drgudang`: Referensi gudang asal/tujuan transaksi.
- `drasalbarang`: Asal barang atau sumber asal item pada transaksi.
- `drasalbarangkategori`: Kategori asal barang atau sumber asal item pada transaksi.
- `drjenispenjualan`: Jenis penjualan pada transaksi.
- `drjenispenjualankategori`: Kategori dari jenis transaksi atau asal barang.
- `drcarabayar`: Metode atau cara pembayaran yang digunakan pada transaksi.
- `drsumber`: Sumber atau asal pembentukan transaksi.
- `drautonotransaksi`: Nomor dokumen/transaksi unik.
- `drnotransaksi`: Nomor dokumen/transaksi unik.

### Relasi Utama

- `m5_dr` -> `m1_contact`: `m5_dr.drcustomer = m1_contact.kid`
- `m5_dr_detail` -> `m5_dr`: `m5_dr_detail.iddr = m5_dr.drid`
- `m5_dr_detail` -> `m5_do_detail`: `m5_dr_detail.iddodetail = m5_do_detail.iddodetail`
- `m5_dr_detail` -> `m5_pi_detail`: `m5_dr_detail.idpidetail = m5_pi_detail.idpidetail`
- `m5_dr_detail` -> `m1_item`: `m5_dr_detail.idbarang = m1_item.bid`

### Functions

- `m5_dr_detail_v`: Menyediakan listing detail baris untuk dokumen hasil pengiriman.
  related_tables: m5_dr, m5_dr_detail
- `m5_dr_getdata`: Mengambil data header dan detail hasil pengiriman untuk satu dokumen transaksi.
  related_tables: m5_dr, m5_dr_detail
- `m5_dr_getdata_history`: Mengambil riwayat perubahan header dan detail hasil pengiriman.
  related_tables: m5_dr, m5_dr_history, m5_dr_detail_history
- `m5_dr_terkait`: Mengambil keterkaitan dokumen hasil pengiriman dengan dokumen transaksi lain di alur proses.
  related_tables: m5_dr, m5_dr_detail
- `m5_dr_v`: Menyediakan listing atau pencarian data hasil pengiriman.
  related_tables: m5_dr, m5_dr_detail
- `m5_dr_v_history`: Menyediakan listing riwayat perubahan untuk hasil pengiriman.
  related_tables: m5_dr, m5_dr_history, m5_dr_detail_history

## FILES - Lampiran Transaksi

### Tabel

- `m5_files` | alias: `lampiran_transaksi_penjualan` | tipe: Header | kolom: 8 | relasi: 0
  Lampiran file per transaksi M5, seperti dokumen pendukung atau attachment report/transaksi.

### Kolom Header Penting

- `fsumber`: Kode sumber dokumen transaksi yang dilampiri file.
- `fidtransaksi`: ID transaksi utama yang memiliki lampiran.
- `fnamafile`: Nama file lampiran.
- `fcatatan`: Catatan atau keterangan file lampiran.
- `fukuranfile`: Ukuran file lampiran.
- `ftanggal`: Tanggal file atau tanggal referensi lampiran.
- `finputuser`: User yang mengunggah atau menambahkan file.
- `finputtgl`: Tanggal dan waktu input file.

### Functions

- `m5_files_v`: Menyediakan listing atau pencarian data dokumen lampiran.
  related_tables: m5_files

## IC - Invoice Collection / Penagihan Piutang

### Tabel

- `m5_ic` | alias: `penagihan_piutang_penjualan` | tipe: Header | kolom: 50 | relasi: 1
  Header penagihan piutang atau invoice collection (IC). Dipakai untuk proses koleksi/tagihan ke customer atas transaksi yang akan ditagih dan kemudian dapat dialokasikan ke payment voucher.
- `m5_ic_detail` | alias: `detail_penagihan_piutang_penjualan` | tipe: Detail | kolom: 27 | relasi: 1
  Detail item tagihan pada invoice collection. Berisi transaksi sumber yang ditagih, rencana tagih, nilai terbayar, jumlah bayar, dan saldo yang bisa dialokasikan ke payment voucher.
- `m5_ic_detail_history` | alias: `riwayat_detail_penagihan_piutang_penjualan` | tipe: History | kolom: 2 | relasi: 0
  Snapshot histori baris detail dokumen IC.
- `m5_ic_history` | alias: `riwayat_penagihan_piutang_penjualan` | tipe: History | kolom: 2 | relasi: 0
  Tabel histori header invoice collection. Menyimpan snapshot perubahan dokumen penagihan piutang/customer collection.

### Kolom Header Penting

- `icid`: Identitas unik data atau relasi ke dokumen/transaksi terkait.
- `iccabang`: Kode atau referensi cabang transaksi.
- `iclokasi`: Kode atau referensi lokasi operasional transaksi.
- `icgudang`: Referensi gudang asal/tujuan transaksi.
- `icsumber`: Sumber atau asal pembentukan transaksi.
- `icautonotransaksi`: Nomor dokumen/transaksi unik.
- `icnotransaksi`: Nomor dokumen/transaksi unik.
- `ictgl`: Tanggal transaksi atau tanggal referensi.
- `ickodepa`: Kode referensi PA pada transaksi sesuai pengaturan bisnis internal.
- `iccustomer`: Referensi customer.
- `iccustomerkontak`: Referensi customer.
- `ic1alamat1`: Baris alamat 1 untuk alamat utama pada dokumen transaksi.

### Relasi Utama

- `m5_ic` -> `m1_contact`: `m5_ic.iccustomer = m1_contact.kid`
- `m5_ic_detail` -> `m5_ic`: `m5_ic_detail.idic = m5_ic.icid`

### Functions

- `m5_ic_getdata`: Mengambil data header dan detail penagihan piutang untuk satu dokumen transaksi.
  related_tables: m5_ic, m5_ic_detail
- `m5_ic_getdata_history`: Mengambil riwayat perubahan header dan detail penagihan piutang.
  related_tables: m5_ic, m5_ic_history, m5_ic_detail_history
- `m5_ic_takedata`: Mengambil dataset operasional penagihan piutang untuk kebutuhan pemrosesan lanjutan.
  related_tables: m5_ic, m5_ic_detail
- `m5_ic_terkait`: Mengambil keterkaitan dokumen penagihan piutang dengan dokumen transaksi lain di alur proses.
  related_tables: m5_ic, m5_ic_detail
- `m5_ic_v`: Menyediakan listing atau pencarian data penagihan piutang.
  related_tables: m5_ic, m5_ic_detail
- `m5_ic_v_history`: Menyediakan listing riwayat perubahan untuk penagihan piutang.
  related_tables: m5_ic, m5_ic_history, m5_ic_detail_history

## IP - Incoming Payment

### Tabel

- `m5_ip` | alias: `penerimaan_pembayaran_penjualan` | tipe: Header | kolom: 47 | relasi: 1
  Header penerimaan pembayaran penjualan (IP). Digunakan untuk menerima pembayaran dari customer terhadap piutang/transaksi terkait.
- `m5_ip_pay` | alias: `alokasi_penerimaan_pembayaran_penjualan` | tipe: Payment/Allocation | kolom: 16 | relasi: 1
  Detail alat bayar pada penerimaan pembayaran (IP), seperti giro, bank, dan nominal pembayaran.
- `m5_ip_history` | alias: `riwayat_penerimaan_pembayaran_penjualan` | tipe: History | kolom: 2 | relasi: 0
  Tabel histori header penerimaan pembayaran (IP). Menyimpan snapshot perubahan dokumen terima pembayaran customer.
- `m5_ip_pay_history` | alias: `riwayat_alokasi_penerimaan_pembayaran_penjualan` | tipe: History | kolom: 2 | relasi: 0
  Snapshot histori detail pembayaran dokumen IP.

### Kolom Header Penting

- `ipid`: Identitas unik data atau relasi ke dokumen/transaksi terkait.
- `ipcabang`: Kode atau referensi cabang transaksi.
- `iplokasi`: Kode atau referensi lokasi operasional transaksi.
- `ipjenis`: Jenis atau klasifikasi transaksi/dokumen.
- `ipsumber`: Sumber atau asal pembentukan transaksi.
- `ipautonotransaksi`: Nomor dokumen/transaksi unik.
- `ipnotransaksi`: Nomor dokumen/transaksi unik.
- `iptgl`: Tanggal transaksi atau tanggal referensi.
- `ipkodepa`: Kode referensi PA pada transaksi sesuai pengaturan bisnis internal.
- `ipkontak`: Referensi kontak atau contact person.
- `ipkontakperson`: Referensi kontak atau contact person.
- `ip1alamat1`: Baris alamat 1 untuk alamat utama pada dokumen transaksi.

### Relasi Utama

- `m5_ip` -> `m1_contact`: `m5_ip.ipkontak = m1_contact.kid`
- `m5_ip_pay` -> `m5_ip`: `m5_ip_pay.idip = m5_ip.ipid`

### Functions

- `m5_ip_getdata`: Mengambil data header dan detail penerimaan pembayaran untuk satu dokumen transaksi.
  related_tables: m5_ip, m5_ip_pay
- `m5_ip_getdata_history`: Mengambil riwayat perubahan header dan detail penerimaan pembayaran.
  related_tables: m5_ip, m5_ip_history, m5_ip_pay_history
- `m5_ip_terkait`: Mengambil keterkaitan dokumen penerimaan pembayaran dengan dokumen transaksi lain di alur proses.
  related_tables: m5_ip, m5_ip_pay
- `m5_ip_v`: Menyediakan listing atau pencarian data penerimaan pembayaran.
  related_tables: m5_ip, m5_ip_pay
- `m5_ip_v_history`: Menyediakan listing riwayat perubahan untuk penerimaan pembayaran.
  related_tables: m5_ip, m5_ip_history, m5_ip_pay_history

## NOTES - Catatan Transaksi

### Tabel

- `m5_notes` | alias: `catatan_transaksi_penjualan` | tipe: Header | kolom: 8 | relasi: 0
  Catatan transaksi M5 yang melekat pada dokumen penjualan atau piutang tertentu.

### Kolom Header Penting

- `nid`: Primary key unik catatan.
- `nsumber`: Kode sumber dokumen transaksi yang diberi catatan.
- `nidtransaksi`: ID transaksi utama yang terkait catatan.
- `ncatatan`: Isi catatan transaksi.
- `ninputuser`: User yang membuat catatan.
- `ninputtgl`: Tanggal dan waktu input catatan.
- `nmodifikasiuser`: User yang terakhir memodifikasi catatan.
- `nmodifikasitgl`: Tanggal dan waktu modifikasi catatan.

### Functions

- `m5_notes_v`: Menyediakan listing atau pencarian data notes transaksi.
  related_tables: m5_notes

## PI - Proforma Invoice

### Tabel

- `m5_pi` | alias: `invoice_proforma_penjualan` | tipe: Header | kolom: 68 | relasi: 1
  Header proforma invoice (PI) atau invoice sementara penjualan sebelum menjadi invoice final.
- `m5_pi_detail` | alias: `detail_invoice_proforma_penjualan` | tipe: Detail | kolom: 45 | relasi: 4
  Detail item pada proforma invoice (PI), termasuk keterkaitan ke SO/PL dan progres realisasi ke invoice final.
- `m5_pi_detail_history` | alias: `riwayat_detail_invoice_proforma_penjualan` | tipe: History | kolom: 2 | relasi: 0
  Snapshot histori baris detail dokumen PI.
- `m5_pi_history` | alias: `riwayat_invoice_proforma_penjualan` | tipe: History | kolom: 2 | relasi: 0
  Tabel histori header proforma invoice (PI). Menyimpan snapshot perubahan invoice sementara penjualan.

### Kolom Header Penting

- `piid`: Identitas unik data atau relasi ke dokumen/transaksi terkait.
- `picabang`: Kode atau referensi cabang transaksi.
- `pilokasi`: Kode atau referensi lokasi operasional transaksi.
- `pigudang`: Referensi gudang asal/tujuan transaksi.
- `piasalbarang`: Asal barang atau sumber asal item pada transaksi.
- `piasalbarangkategori`: Kategori asal barang atau sumber asal item pada transaksi.
- `pijenispenjualan`: Jenis penjualan pada transaksi.
- `pijenispenjualankategori`: Kategori dari jenis transaksi atau asal barang.
- `picarabayar`: Metode atau cara pembayaran yang digunakan pada transaksi.
- `pisumber`: Sumber atau asal pembentukan transaksi.
- `piautonotransaksi`: Nomor dokumen/transaksi unik.
- `pinotransaksi`: Nomor dokumen/transaksi unik.

### Relasi Utama

- `m5_pi` -> `m1_contact`: `m5_pi.picustomer = m1_contact.kid`
- `m5_pi_detail` -> `m5_pi`: `m5_pi_detail.idpi = m5_pi.piid`
- `m5_pi_detail` -> `m5_sq_detail`: `m5_pi_detail.idsqdetail = m5_sq_detail.idsqdetail`
- `m5_pi_detail` -> `m5_so_detail`: `m5_pi_detail.idsodetail = m5_so_detail.idsodetail`
- `m5_pi_detail` -> `m1_item`: `m5_pi_detail.idbarang = m1_item.bid`

### Functions

- `m5_pi_detail_v`: Menyediakan listing detail baris untuk dokumen invoice proforma.
  related_tables: m5_pi, m5_pi_detail
- `m5_pi_getdata`: Mengambil data header dan detail invoice proforma untuk satu dokumen transaksi.
  related_tables: m5_pi, m5_pi_detail
- `m5_pi_getdata_history`: Mengambil riwayat perubahan header dan detail invoice proforma.
  related_tables: m5_pi, m5_pi_history, m5_pi_detail_history
- `m5_pi_terkait`: Mengambil keterkaitan dokumen invoice proforma dengan dokumen transaksi lain di alur proses.
  related_tables: m5_pi, m5_pi_detail
- `m5_pi_v`: Menyediakan listing atau pencarian data invoice proforma.
  related_tables: m5_pi, m5_pi_detail
- `m5_pi_v_history`: Menyediakan listing riwayat perubahan untuk invoice proforma.
  related_tables: m5_pi, m5_pi_history, m5_pi_detail_history

## PL - Packing List

### Tabel

- `m5_pl` | alias: `daftar_packing_penjualan` | tipe: Header | kolom: 66 | relasi: 1
  Header packing list (PL). Mewakili dokumen penyiapan barang sebelum proses pengiriman.
- `m5_pl_detail` | alias: `detail_daftar_packing_penjualan` | tipe: Detail | kolom: 45 | relasi: 4
  Detail barang pada packing list (PL), termasuk keterkaitan ke sales order dan progres realisasi pengiriman.
- `m5_pl_pack` | alias: `paket_daftar_packing_penjualan` | tipe: Pack | kolom: 1 | relasi: 1
  Detail paket/pack yang terkait dokumen PL.
- `m5_pl_detail_history` | alias: `riwayat_detail_daftar_packing_penjualan` | tipe: History | kolom: 2 | relasi: 0
  Snapshot histori baris detail dokumen PL.
- `m5_pl_history` | alias: `riwayat_daftar_packing_penjualan` | tipe: History | kolom: 2 | relasi: 0
  Tabel histori header packing list (PL). Menyimpan snapshot perubahan dokumen persiapan barang sebelum pengiriman.
- `m5_pl_pack_history` | alias: `riwayat_paket_daftar_packing_penjualan` | tipe: History | kolom: 2 | relasi: 0
  Snapshot histori data pack dokumen PL.

### Kolom Header Penting

- `plid`: Identitas unik data atau relasi ke dokumen/transaksi terkait.
- `plcabang`: Kode atau referensi cabang transaksi.
- `pllokasi`: Kode atau referensi lokasi operasional transaksi.
- `plgudang`: Referensi gudang asal/tujuan transaksi.
- `plasalbarang`: Asal barang atau sumber asal item pada transaksi.
- `plasalbarangkategori`: Kategori asal barang atau sumber asal item pada transaksi.
- `pljenispenjualan`: Jenis penjualan pada transaksi.
- `pljenispenjualankategori`: Kategori dari jenis transaksi atau asal barang.
- `plcarabayar`: Metode atau cara pembayaran yang digunakan pada transaksi.
- `plsumber`: Sumber atau asal pembentukan transaksi.
- `plautonotransaksi`: Nomor dokumen/transaksi unik.
- `plnotransaksi`: Nomor dokumen/transaksi unik.

### Relasi Utama

- `m5_pl` -> `m1_contact`: `m5_pl.plcustomer = m1_contact.kid`
- `m5_pl_detail` -> `m5_pl`: `m5_pl_detail.idpl = m5_pl.plid`
- `m5_pl_detail` -> `m5_so_detail`: `m5_pl_detail.idsodetail = m5_so_detail.idsodetail`
- `m5_pl_detail` -> `m5_pi_detail`: `m5_pl_detail.idpidetail = m5_pi_detail.idpidetail`
- `m5_pl_detail` -> `m1_item`: `m5_pl_detail.idbarang = m1_item.bid`
- `m5_pl_pack` -> `m5_pl`: `m5_pl_pack.idpl = m5_pl.plid`

### Functions

- `m5_pl_detail_v`: Menyediakan listing detail baris untuk dokumen daftar packing.
  related_tables: m5_pl, m5_pl_detail, m5_pl_pack
- `m5_pl_getdata`: Mengambil data header dan detail daftar packing untuk satu dokumen transaksi.
  related_tables: m5_pl, m5_pl_detail, m5_pl_pack
- `m5_pl_getdata_history`: Mengambil riwayat perubahan header dan detail daftar packing.
  related_tables: m5_pl, m5_pl_history, m5_pl_detail_history, m5_pl_pack_history
- `m5_pl_terkait`: Mengambil keterkaitan dokumen daftar packing dengan dokumen transaksi lain di alur proses.
  related_tables: m5_pl, m5_pl_detail, m5_pl_pack
- `m5_pl_v`: Menyediakan listing atau pencarian data daftar packing.
  related_tables: m5_pl, m5_pl_detail, m5_pl_pack
- `m5_pl_v_history`: Menyediakan listing riwayat perubahan untuk daftar packing.
  related_tables: m5_pl, m5_pl_history, m5_pl_detail_history, m5_pl_pack_history

## PV - Payment Voucher

### Tabel

- `m5_pv` | alias: `voucher_pembayaran_penjualan` | tipe: Header | kolom: 48 | relasi: 1
  Header pembayaran piutang (PV). Mencatat pelunasan atau penerimaan atas piutang customer.
- `m5_pv_detail` | alias: `detail_voucher_pembayaran_penjualan` | tipe: Detail | kolom: 25 | relasi: 2
  Detail pembayaran piutang (PV), termasuk transaksi yang dibayar dan nominal pelunasannya.
- `m5_pv_detail_history` | alias: `riwayat_detail_voucher_pembayaran_penjualan` | tipe: History | kolom: 2 | relasi: 0
  Snapshot histori baris detail dokumen PV.
- `m5_pv_history` | alias: `riwayat_voucher_pembayaran_penjualan` | tipe: History | kolom: 2 | relasi: 0
  Tabel histori header pembayaran piutang (PV). Menyimpan snapshot perubahan dokumen pelunasan atau penerimaan piutang customer.

### Kolom Header Penting

- `pvid`: Identitas unik data atau relasi ke dokumen/transaksi terkait.
- `pvcabang`: Kode atau referensi cabang transaksi.
- `pvlokasi`: Kode atau referensi lokasi operasional transaksi.
- `pvgudang`: Referensi gudang asal/tujuan transaksi.
- `pvsumber`: Sumber atau asal pembentukan transaksi.
- `pvautonotransaksi`: Nomor dokumen/transaksi unik.
- `pvnotransaksi`: Nomor dokumen/transaksi unik.
- `pvtgl`: Tanggal transaksi atau tanggal referensi.
- `pvkodepa`: Kode referensi PA pada transaksi sesuai pengaturan bisnis internal.
- `pvcustomer`: Referensi customer.
- `pvcustomerkontak`: Referensi customer.
- `pv1alamat1`: Baris alamat 1 untuk alamat utama pada dokumen transaksi.

### Relasi Utama

- `m5_pv` -> `m1_contact`: `m5_pv.pvcustomer = m1_contact.kid`
- `m5_pv_detail` -> `m5_pv`: `m5_pv_detail.idpv = m5_pv.pvid`
- `m5_pv_detail` -> `m5_ic_detail`: `m5_pv_detail.idicdetail = m5_ic_detail.idicdetail`

### Functions

- `m5_pv_getdata`: Mengambil data header dan detail voucher pembayaran untuk satu dokumen transaksi.
  related_tables: m5_pv, m5_pv_detail
- `m5_pv_getdata_history`: Mengambil riwayat perubahan header dan detail voucher pembayaran.
  related_tables: m5_pv, m5_pv_history, m5_pv_detail_history
- `m5_pv_terkait`: Mengambil keterkaitan dokumen voucher pembayaran dengan dokumen transaksi lain di alur proses.
  related_tables: m5_pv, m5_pv_detail
- `m5_pv_v`: Menyediakan listing atau pencarian data voucher pembayaran.
  related_tables: m5_pv, m5_pv_detail
- `m5_pv_v_history`: Menyediakan listing riwayat perubahan untuk voucher pembayaran.
  related_tables: m5_pv, m5_pv_history, m5_pv_detail_history

## RNR - Receipt Note Return / Penerimaan Barang Retur

### Tabel

- `m5_rnr` | alias: `penerimaan_barang_retur` | tipe: Header | kolom: 74 | relasi: 1
  Header penerimaan barang retur (RNR) dari customer. Dipakai untuk mencatat retur yang diterima sebelum diproses lebih lanjut ke retur penjualan atau realisasi lanjutan.
- `m5_rnr_detail` | alias: `detail_penerimaan_barang_retur` | tipe: Detail | kolom: 50 | relasi: 4
  Detail item pada penerimaan barang retur. Menyimpan barang yang diterima kembali, kuantitas, nilai, dan progres lanjut ke dokumen retur penjualan.
- `m5_rnr_detail_history` | alias: `riwayat_detail_penerimaan_barang_retur` | tipe: History | kolom: 2 | relasi: 0
  Snapshot histori baris detail dokumen RNR.
- `m5_rnr_history` | alias: `riwayat_penerimaan_barang_retur` | tipe: History | kolom: 2 | relasi: 0
  Tabel histori header penerimaan barang retur. Menyimpan snapshot perubahan dokumen RNR untuk audit proses retur dari customer.

### Kolom Header Penting

- `rnrid`: Identitas unik data atau relasi ke dokumen/transaksi terkait.
- `rnrcabang`: Kode atau referensi cabang transaksi.
- `rnrlokasi`: Kode atau referensi lokasi operasional transaksi.
- `rnrgudang`: Referensi gudang asal/tujuan transaksi.
- `rnrasalbarang`: Asal barang atau sumber asal item pada transaksi.
- `rnrasalbarangkategori`: Kategori asal barang atau sumber asal item pada transaksi.
- `rnrjenispenjualan`: Jenis penjualan pada transaksi.
- `rnrjenispenjualankategori`: Kategori dari jenis transaksi atau asal barang.
- `rnrcarabayar`: Metode atau cara pembayaran yang digunakan pada transaksi.
- `rnrsumber`: Sumber atau asal pembentukan transaksi.
- `rnrautonotransaksi`: Nomor dokumen/transaksi unik.
- `rnrnotransaksi`: Nomor dokumen/transaksi unik.

### Relasi Utama

- `m5_rnr` -> `m1_contact`: `m5_rnr.rnrcustomer = m1_contact.kid`
- `m5_rnr_detail` -> `m5_rnr`: `m5_rnr_detail.idrnr = m5_rnr.rnrid`
- `m5_rnr_detail` -> `m5_si_detail`: `m5_rnr_detail.idsidetail = m5_si_detail.idsidetail`
- `m5_rnr_detail` -> `m5_sq_detail`: `m5_rnr_detail.idsqdetail = m5_sq_detail.idsqdetail`
- `m5_rnr_detail` -> `m1_item`: `m5_rnr_detail.idbarang = m1_item.bid`

### Functions

- `m5_rnr_detail_v`: Menyediakan listing detail baris untuk dokumen penerimaan barang retur.
  related_tables: m5_rnr, m5_rnr_detail
- `m5_rnr_getdata`: Mengambil data header dan detail penerimaan barang retur untuk satu dokumen transaksi.
  related_tables: m5_rnr, m5_rnr_detail
- `m5_rnr_terkait`: Mengambil keterkaitan dokumen penerimaan barang retur dengan dokumen transaksi lain di alur proses.
  related_tables: m5_rnr, m5_rnr_detail
- `m5_rnr_v`: Menyediakan listing atau pencarian data penerimaan barang retur.
  related_tables: m5_rnr, m5_rnr_detail

## RP - Piutang Ongkos Kirim / Tagihan Tambahan

### Tabel

- `m5_rp` | alias: `piutang_ongkos_kirim` | tipe: Header | kolom: 47 | relasi: 2
  Header piutang ongkos kirim atau tagihan tambahan yang terkait sales invoice/pengiriman. Menyimpan nilai piutang, status bayar, dan referensi invoice yang menjadi sumber tagihan.
- `m5_rp_pay` | alias: `pembayaran_piutang_ongkos_kirim` | tipe: Payment/Allocation | kolom: 16 | relasi: 1
  Detail alat bayar atau alokasi pembayaran untuk piutang ongkos kirim/tagihan tambahan pada RP.
- `m5_rp_history` | alias: `riwayat_piutang_ongkos_kirim` | tipe: History | kolom: 2 | relasi: 0
  Tabel histori header RP. Menyimpan snapshot perubahan piutang ongkos kirim atau tagihan tambahan terkait invoice/pengiriman.
- `m5_rp_pay_history` | alias: `riwayat_pembayaran_piutang_ongkos_kirim` | tipe: History | kolom: 2 | relasi: 0
  Snapshot histori detail pembayaran dokumen RP.

### Kolom Header Penting

- `rpid`: Identitas unik data atau relasi ke dokumen/transaksi terkait.
- `rpcabang`: Kode atau referensi cabang transaksi.
- `rplokasi`: Kode atau referensi lokasi operasional transaksi.
- `rpjenis`: Jenis atau klasifikasi transaksi/dokumen.
- `rpsumber`: Sumber atau asal pembentukan transaksi.
- `rpautonotransaksi`: Nomor dokumen/transaksi unik.
- `rpnotransaksi`: Nomor dokumen/transaksi unik.
- `rptgl`: Tanggal transaksi atau tanggal referensi.
- `rpkodepa`: Kode referensi PA pada transaksi sesuai pengaturan bisnis internal.
- `rpkontak`: Referensi kontak atau contact person.
- `rpkontakperson`: Referensi kontak atau contact person.
- `rp1alamat1`: Baris alamat 1 untuk alamat utama pada dokumen transaksi.

### Relasi Utama

- `m5_rp` -> `m5_si`: `m5_rp.rpidsi = m5_si.siid`
- `m5_rp` -> `m1_contact`: `m5_rp.rpkontak = m1_contact.kid`
- `m5_rp_pay` -> `m5_rp`: `m5_rp_pay.idrp = m5_rp.rpid`

### Functions

- `m5_rp_getdata`: Mengambil data header dan detail piutang ongkos kirim untuk satu dokumen transaksi.
  related_tables: m5_rp, m5_rp_pay
- `m5_rp_getdata_history`: Mengambil riwayat perubahan header dan detail piutang ongkos kirim.
  related_tables: m5_rp, m5_rp_history, m5_rp_pay_history
- `m5_rp_terkait`: Mengambil keterkaitan dokumen piutang ongkos kirim dengan dokumen transaksi lain di alur proses.
  related_tables: m5_rp, m5_rp_pay
- `m5_rp_v`: Menyediakan listing atau pencarian data piutang ongkos kirim.
  related_tables: m5_rp, m5_rp_pay
- `m5_rp_v_history`: Menyediakan listing riwayat perubahan untuk piutang ongkos kirim.
  related_tables: m5_rp, m5_rp_history, m5_rp_pay_history

## SF - Sales Forecast

### Tabel

- `m5_sf` | alias: `forecast_penjualan` | tipe: Header | kolom: 8 | relasi: 1
  Header sales contract atau sales booking yang muncul pada report kontrak, booking, dan backorder penjualan.
- `m5_sf_detail` | alias: `detail_forecast_penjualan` | tipe: Detail | kolom: 8 | relasi: 1
  Detail item pada sales contract atau sales booking.

### Kolom Header Penting

- `sfid`: Primary key unik dokumen sales contract.
- `sfnotransaksi`: Nomor dokumen sales contract.
- `sftgl`: Tanggal sales contract.
- `sfcustomer`: Referensi customer pada sales contract.
- `sfbagianpenjualan`: Referensi salesman atau bagian penjualan.
- `sfmatauang`: Mata uang transaksi sales contract.
- `sfuraian`: Uraian atau keterangan sales contract.
- `sfstatus`: Status dokumen sales contract.

### Relasi Utama

- `m5_sf` -> `m1_contact`: `m5_sf.sfcustomer = m1_contact.kid`
- `m5_sf_detail` -> `m5_sf`: `m5_sf_detail.idsf = m5_sf.sfid`

## SI - Sales Invoice

### Tabel

- `m5_si` | alias: `invoice_penjualan` | tipe: Header | kolom: 95 | relasi: 2
  Header invoice penjualan final (sales invoice/SI). Menjadi dokumen utama penjualan dan piutang customer.
- `m5_si_detail` | alias: `detail_invoice_penjualan` | tipe: Detail | kolom: 53 | relasi: 2
  Detail barang pada invoice penjualan (SI), termasuk nilai jual, pajak, HPP, dan dimensi analitik seperti cost center/divisi/proyek.
- `m5_si_detail_failed` | alias: `detail_invoice_penjualan_gagal` | tipe: Detail | kolom: 1 | relasi: 0
  Penyimpanan data gagal/proses gagal pada detail SI.
- `m5_si_pay` | alias: `pembayaran_invoice_penjualan` | tipe: Payment/Allocation | kolom: 16 | relasi: 2
  Detail pembayaran atau alat bayar yang terkait invoice penjualan (SI). Menyimpan nominal pembayaran, metode bayar, dan referensi alat bayar per invoice.
- `m5_si_installment` | alias: `angsuran_invoice_penjualan` | tipe: Installment | kolom: 16 | relasi: 2
  Tabel installment atau cicilan yang terkait invoice penjualan (SI). Dipakai untuk memecah jadwal atau komponen pembayaran bertahap atas sales invoice.
- `m5_si_cost` | alias: `biaya_invoice_penjualan` | tipe: Cost | kolom: 6 | relasi: 2
  Komponen biaya tambahan pada invoice penjualan (SI), dipakai pada report biaya salesman dan komisi.
- `m5_si_material` | alias: `material_invoice_penjualan` | tipe: Material | kolom: 16 | relasi: 3
  Detail material/komponen yang dipakai pada dokumen SI.
- `m5_si_failed` | alias: `invoice_penjualan_gagal` | tipe: Failed/Staging | kolom: 2 | relasi: 0
  Penyimpanan data gagal/proses gagal terkait dokumen SI.
- `m5_si_detail_history` | alias: `riwayat_detail_invoice_penjualan` | tipe: History | kolom: 2 | relasi: 0
  Snapshot histori baris detail dokumen SI.
- `m5_si_history` | alias: `riwayat_invoice_penjualan` | tipe: History | kolom: 2 | relasi: 0
  Tabel histori header sales invoice (SI). Menyimpan snapshot perubahan faktur atau invoice penjualan final.
- `m5_si_material_history` | alias: `riwayat_material_invoice_penjualan` | tipe: History | kolom: 2 | relasi: 0
  Snapshot histori detail material dokumen SI.
- `m5_si_pay_history` | alias: `riwayat_pembayaran_invoice_penjualan` | tipe: History | kolom: 2 | relasi: 0
  Snapshot histori detail pembayaran dokumen SI.

### Kolom Header Penting

- `siid`: Primary key baris data.
- `sicabang`: Kode atau referensi cabang transaksi.
- `silokasi`: Kode atau referensi lokasi operasional transaksi.
- `sigudang`: Referensi gudang asal/tujuan transaksi.
- `siasalbarang`: Asal barang atau sumber asal item pada transaksi.
- `siasalbarangkategori`: Kategori asal barang atau sumber asal item pada transaksi.
- `sijenispenjualan`: Jenis penjualan pada transaksi.
- `sijenispenjualankategori`: Kategori dari jenis transaksi atau asal barang.
- `sisaldoawal`: Saldo awal piutang/tagihan pada saat dokumen dibentuk.
- `sicarabayar`: Metode atau cara pembayaran yang digunakan pada transaksi.
- `sisumber`: Sumber atau asal pembentukan transaksi.
- `siautonotransaksi`: Nomor dokumen/transaksi unik.

### Relasi Utama

- `m5_si` -> `m1_contact`: `m5_si.sicustomer = m1_contact.kid`
- `m5_si` -> `m5_as`: `m5_si.siidas = m5_as.asid`
- `m5_si_detail` -> `m5_si`: `m5_si_detail.idsi = m5_si.siid`
- `m5_si_detail` -> `m1_item`: `m5_si_detail.idbarang = m1_item.bid`
- `m5_si_pay` -> `m5_si`: `m5_si_pay.idsi = m5_si.siid`
- `m5_si_pay` -> `m0_payment_method`: `m5_si_pay.carabayar = m0_payment_method.kode`
- `m5_si_installment` -> `m5_si`: `m5_si_installment.idsi = m5_si.siid`
- `m5_si_installment` -> `m1_coa`: `m5_si_installment.rekpiutang = m1_coa.cnomor`
- `m5_si_cost` -> `m5_si`: `m5_si_cost.idsi = m5_si.siid`
- `m5_si_cost` -> `m1_contact`: `m5_si_cost.kontak = m1_contact.kid`
- `m5_si_material` -> `m5_si`: `m5_si_material.idsi = m5_si.siid`
- `m5_si_material` -> `m5_si_detail`: `m5_si_material.idsidetail = m5_si_detail.idsidetail`
- `m5_si_material` -> `m1_item`: `m5_si_material.idbarang = m1_item.bid`

### Functions

- `m5_si_detail_v`: Menyediakan listing detail baris untuk dokumen faktur penjualan.
  related_tables: m5_si, m5_si_detail
- `m5_si_getdata`: Mengambil data header dan detail faktur penjualan untuk satu dokumen transaksi.
  related_tables: m5_si, m5_si_detail, m5_si_pay, m5_si_installment, m5_si_cost, m5_si_material, m5_si_failed, m5_si_detail_failed
- `m5_si_getdata_history`: Mengambil riwayat perubahan header dan detail faktur penjualan.
  related_tables: m5_si, m5_si_history, m5_si_detail_history, m5_si_pay_history, m5_si_material_history
- `m5_si_terkait`: Mengambil keterkaitan dokumen faktur penjualan dengan dokumen transaksi lain di alur proses.
  related_tables: m5_si, m5_si_detail, m5_si_pay, m5_si_installment, m5_si_cost, m5_si_material, m5_si_failed, m5_si_detail_failed
- `m5_si_v`: Menyediakan listing atau pencarian data faktur penjualan.
  related_tables: m5_si, m5_si_detail, m5_si_pay, m5_si_installment, m5_si_cost, m5_si_material, m5_si_failed, m5_si_detail_failed
- `m5_si_v_history`: Menyediakan listing riwayat perubahan untuk faktur penjualan.
  related_tables: m5_si, m5_si_history, m5_si_detail_history, m5_si_pay_history, m5_si_material_history

## SIE - Sales Invoice Exchange / Tukar Faktur

### Tabel

- `m5_sie` | alias: `tukar_faktur_penjualan` | tipe: Header | kolom: 29 | relasi: 0
  Header tukar faktur penjualan (SIE). Dipakai untuk pertukaran, regrouping, atau pengaitan ulang invoice/retur penjualan dalam proses administrasi faktur.
- `m5_sie_detail` | alias: `detail_tukar_faktur_penjualan` | tipe: Detail | kolom: 7 | relasi: 1
  Detail transaksi sumber pada tukar faktur penjualan. Berisi daftar dokumen sumber yang ikut dalam proses tukar atau regrouping faktur.
- `m5_sie_detail_history` | alias: `riwayat_detail_tukar_faktur_penjualan` | tipe: History | kolom: 2 | relasi: 0
  Snapshot histori baris detail dokumen SIE.
- `m5_sie_history` | alias: `riwayat_tukar_faktur_penjualan` | tipe: History | kolom: 2 | relasi: 0
  Tabel histori header tukar faktur penjualan. Menyimpan snapshot perubahan dokumen SIE untuk audit administrasi pertukaran faktur.

### Kolom Header Penting

- `sieid`: Identitas unik data atau relasi ke dokumen/transaksi terkait.
- `siecabang`: Kode atau referensi cabang transaksi.
- `sielokasi`: Kode atau referensi lokasi operasional transaksi.
- `siesumber`: Sumber atau asal pembentukan transaksi.
- `sieautonotransaksi`: Nomor dokumen/transaksi unik.
- `sienotransaksi`: Nomor dokumen/transaksi unik.
- `sietgl`: Tanggal transaksi atau tanggal referensi.
- `siekodepa`: Kode referensi PA pada transaksi sesuai pengaturan bisnis internal.
- `siekontak`: Referensi kontak atau contact person.
- `siekontakperson`: Referensi kontak atau contact person.
- `sie1alamat1`: Baris alamat 1 untuk alamat utama pada dokumen transaksi.
- `sie1alamat2`: Baris alamat 2 untuk alamat utama pada dokumen transaksi.

### Relasi Utama

- `m5_sie_detail` -> `m5_sie`: `m5_sie_detail.idsie = m5_sie.sieid`

### Functions

- `M5_sie_terkait`: Mengambil keterkaitan dokumen tukar faktur penjualan dengan dokumen transaksi lain di alur proses.
  related_tables: m5_sie, m5_sie_detail

## SO - Sales Order

### Tabel

- `m5_so` | alias: `order_penjualan` | tipe: Header | kolom: 68 | relasi: 1
  Header order penjualan (sales order/SO). Menjadi komitmen pesanan customer setelah quotation disetujui.
- `m5_so_detail` | alias: `detail_order_penjualan` | tipe: Detail | kolom: 48 | relasi: 3
  Detail barang pada sales order (SO). Menyimpan item pesanan, kuantitas, harga, dan realisasi ke PL/DO/PI/SI.
- `m5_so_detail_history` | alias: `riwayat_detail_order_penjualan` | tipe: History | kolom: 2 | relasi: 0
  Snapshot histori baris detail dokumen SO.
- `m5_so_history` | alias: `riwayat_order_penjualan` | tipe: History | kolom: 2 | relasi: 0
  Tabel histori header sales order (SO). Menyimpan snapshot perubahan order penjualan customer.

### Kolom Header Penting

- `soid`: Primary key baris data.
- `socabang`: Kode atau referensi cabang transaksi.
- `solokasi`: Kode atau referensi lokasi operasional transaksi.
- `sogudang`: Referensi gudang asal/tujuan transaksi.
- `soasalbarang`: Asal barang atau sumber asal item pada transaksi.
- `soasalbarangkategori`: Kategori asal barang atau sumber asal item pada transaksi.
- `sojenispenjualan`: Jenis penjualan pada transaksi.
- `sojenispenjualankategori`: Kategori dari jenis transaksi atau asal barang.
- `socarabayar`: Metode atau cara pembayaran yang digunakan pada transaksi.
- `sosumber`: Sumber atau asal pembentukan transaksi.
- `soautonotransaksi`: Nomor dokumen/transaksi unik.
- `sonotransaksi`: Nomor dokumen/transaksi unik.

### Relasi Utama

- `m5_so` -> `m1_contact`: `m5_so.socustomer = m1_contact.kid`
- `m5_so_detail` -> `m5_so`: `m5_so_detail.idso = m5_so.soid`
- `m5_so_detail` -> `m1_item`: `m5_so_detail.idbarang = m1_item.bid`
- `m5_so_detail` -> `m5_sq_detail`: `m5_so_detail.idsqdetail = m5_sq_detail.idsqdetail`

### Functions

- `m5_so_detail_v`: Menyediakan listing detail baris untuk dokumen order penjualan.
  related_tables: m5_so, m5_so_detail
- `m5_so_getdata`: Mengambil data header dan detail order penjualan untuk satu dokumen transaksi.
  related_tables: m5_so, m5_so_detail
- `m5_so_getdata_history`: Mengambil riwayat perubahan header dan detail order penjualan.
  related_tables: m5_so, m5_so_history, m5_so_detail_history
- `m5_so_terkait`: Mengambil keterkaitan dokumen order penjualan dengan dokumen transaksi lain di alur proses.
  related_tables: m5_so, m5_so_detail
- `m5_so_v`: Menyediakan listing atau pencarian data order penjualan.
  related_tables: m5_so, m5_so_detail
- `m5_so_v_history`: Menyediakan listing riwayat perubahan untuk order penjualan.
  related_tables: m5_so, m5_so_history, m5_so_detail_history

## SPA - Sales Point Adjustment

### Tabel

- `m5_spa` | alias: `penyesuaian_poin_penjualan` | tipe: Header | kolom: 21 | relasi: 0
  Header penyesuaian poin penjualan (SPA). Digunakan untuk koreksi, penambahan, atau pengurangan poin customer di luar transaksi penjualan utama.
- `m5_spa_detail` | alias: `detail_penyesuaian_poin_penjualan` | tipe: Detail | kolom: 10 | relasi: 2
  Detail penyesuaian poin per kontak/customer. Menyimpan saldo poin lama, poin masuk, poin keluar, dan saldo poin baru setelah penyesuaian.
- `m5_spa_detail_history` | alias: `riwayat_detail_penyesuaian_poin_penjualan` | tipe: History | kolom: 3 | relasi: 0
  Snapshot histori baris detail dokumen SPA.
- `m5_spa_history` | alias: `riwayat_penyesuaian_poin_penjualan` | tipe: History | kolom: 3 | relasi: 0
  Tabel histori header sales point adjustment. Menyimpan snapshot perubahan dokumen penyesuaian poin customer.

### Kolom Header Penting

- `spaid`: Identitas unik data atau relasi ke dokumen/transaksi terkait.
- `spacabang`: Kode atau referensi cabang transaksi.
- `spalokasi`: Kode atau referensi lokasi operasional transaksi.
- `spasumber`: Sumber atau asal pembentukan transaksi.
- `spaautonotransaksi`: Nomor dokumen/transaksi unik.
- `spanotransaksi`: Nomor dokumen/transaksi unik.
- `spatgl`: Tanggal transaksi atau tanggal referensi.
- `spakodepa`: Kode referensi PA pada transaksi sesuai pengaturan bisnis internal.
- `spakontak`: Referensi kontak atau contact person.
- `spakontakperson`: Referensi kontak atau contact person.
- `spauraian`: Keterangan bisnis transaksi.
- `spacatatan`: Keterangan bisnis transaksi.

### Relasi Utama

- `m5_spa_detail` -> `m5_spa`: `m5_spa_detail.idspa = m5_spa.spaid`
- `m5_spa_detail` -> `m1_contact`: `m5_spa_detail.kontak = m1_contact.kid`

### Functions

- `M5_Spa_terkait`: Mengambil keterkaitan dokumen penyesuaian poin penjualan dengan dokumen transaksi lain di alur proses.
  related_tables: m5_spa, m5_spa_detail

## SQ - Sales Quotation

### Tabel

- `m5_sq` | alias: `penawaran_penjualan` | tipe: Header | kolom: 63 | relasi: 1
  Header penawaran penjualan (sales quotation/SQ). Menyimpan dokumen penawaran ke customer sebelum menjadi sales order atau dokumen realisasi lain.
- `m5_sq_detail` | alias: `detail_penawaran_penjualan` | tipe: Detail | kolom: 50 | relasi: 2
  Detail barang pada penawaran penjualan (SQ). Menyimpan item, kuantitas, harga, dan progres realisasi ke dokumen lanjutan.
- `m5_sq_out_bahan` | alias: `material_keluar_penawaran_penjualan` | tipe: Material Out | kolom: 19 | relasi: 2
  Detail bahan/komponen keluaran pada dokumen SQ.
- `m5_sq_detail_history` | alias: `riwayat_detail_penawaran_penjualan` | tipe: History | kolom: 2 | relasi: 0
  Snapshot histori baris detail dokumen SQ.
- `m5_sq_history` | alias: `riwayat_penawaran_penjualan` | tipe: History | kolom: 2 | relasi: 0
  Tabel histori header sales quotation (SQ). Menyimpan snapshot perubahan dokumen penawaran penjualan.

### Kolom Header Penting

- `sqid`: Identitas unik data atau relasi ke dokumen/transaksi terkait.
- `sqcabang`: Kode atau referensi cabang transaksi.
- `sqlokasi`: Kode atau referensi lokasi operasional transaksi.
- `sqgudang`: Referensi gudang asal/tujuan transaksi.
- `sqasalbarang`: Asal barang atau sumber asal item pada transaksi.
- `sqasalbarangkategori`: Kategori asal barang atau sumber asal item pada transaksi.
- `sqjenispenjualan`: Jenis penjualan pada transaksi.
- `sqjenispenjualankategori`: Kategori dari jenis transaksi atau asal barang.
- `sqcarabayar`: Metode atau cara pembayaran yang digunakan pada transaksi.
- `sqsumber`: Sumber atau asal pembentukan transaksi.
- `sqautonotransaksi`: Nomor dokumen/transaksi unik.
- `sqnotransaksi`: Nomor dokumen/transaksi unik.

### Relasi Utama

- `m5_sq` -> `m1_contact`: `m5_sq.sqcustomer = m1_contact.kid`
- `m5_sq_detail` -> `m5_sq`: `m5_sq_detail.idsq = m5_sq.sqid`
- `m5_sq_detail` -> `m1_item`: `m5_sq_detail.idbarang = m1_item.bid`
- `m5_sq_out_bahan` -> `m5_sq`: `m5_sq_out_bahan.idsq = m5_sq.sqid`
- `m5_sq_out_bahan` -> `m1_item`: `m5_sq_out_bahan.idbarang = m1_item.bid`

### Functions

- `m5_sq_detail_v`: Menyediakan listing detail baris untuk dokumen penawaran penjualan.
  related_tables: m5_sq, m5_sq_detail
- `m5_sq_getdata`: Mengambil data header dan detail penawaran penjualan untuk satu dokumen transaksi.
  related_tables: m5_sq, m5_sq_detail, m5_sq_out_bahan
- `m5_sq_getdata_history`: Mengambil riwayat perubahan header dan detail penawaran penjualan.
  related_tables: m5_sq, m5_sq_history, m5_sq_detail_history
- `m5_sq_terkait`: Mengambil keterkaitan dokumen penawaran penjualan dengan dokumen transaksi lain di alur proses.
  related_tables: m5_sq, m5_sq_detail, m5_sq_out_bahan
- `m5_sq_v`: Menyediakan listing atau pencarian data penawaran penjualan.
  related_tables: m5_sq, m5_sq_detail, m5_sq_out_bahan
- `m5_sq_v_history`: Menyediakan listing riwayat perubahan untuk penawaran penjualan.
  related_tables: m5_sq, m5_sq_history, m5_sq_detail_history

## SR - Sales Return

### Tabel

- `m5_sr` | alias: `retur_penjualan` | tipe: Header | kolom: 79 | relasi: 1
  Header retur penjualan (sales return/SR). Mencatat pengembalian transaksi penjualan oleh customer.
- `m5_sr_detail` | alias: `detail_retur_penjualan` | tipe: Detail | kolom: 47 | relasi: 4
  Detail item pada retur penjualan (SR), termasuk harga, diskon, HPP, dan referensi ke invoice/retur terkait.
- `m5_sr_detail_history` | alias: `riwayat_detail_retur_penjualan` | tipe: History | kolom: 2 | relasi: 0
  Snapshot histori baris detail dokumen SR.
- `m5_sr_history` | alias: `riwayat_retur_penjualan` | tipe: History | kolom: 2 | relasi: 0
  Tabel histori header sales return (SR). Menyimpan snapshot perubahan dokumen retur penjualan customer.

### Kolom Header Penting

- `srid`: Identitas unik data atau relasi ke dokumen/transaksi terkait.
- `srcabang`: Kode atau referensi cabang transaksi.
- `srlokasi`: Kode atau referensi lokasi operasional transaksi.
- `srjenis`: Jenis atau klasifikasi transaksi/dokumen.
- `srgudang`: Referensi gudang asal/tujuan transaksi.
- `srasalbarang`: Asal barang atau sumber asal item pada transaksi.
- `srasalbarangkategori`: Kategori asal barang atau sumber asal item pada transaksi.
- `srjenispenjulan`: Jenis penjualan pada transaksi sales return.
- `srjenispenjualankategori`: Kategori dari jenis transaksi atau asal barang.
- `srsaldoawal`: Saldo awal nilai transaksi sebelum retur diproses.
- `srcarabayar`: Metode atau cara pembayaran yang digunakan pada transaksi.
- `srsumber`: Sumber atau asal pembentukan transaksi.

### Relasi Utama

- `m5_sr` -> `m1_contact`: `m5_sr.srcustomer = m1_contact.kid`
- `m5_sr_detail` -> `m5_sr`: `m5_sr_detail.idsr = m5_sr.srid`
- `m5_sr_detail` -> `m5_si_detail`: `m5_sr_detail.idsidetail = m5_si_detail.idsidetail`
- `m5_sr_detail` -> `m5_rnr_detail`: `m5_sr_detail.idrnrdetail = m5_rnr_detail.idrnrdetail`
- `m5_sr_detail` -> `m1_item`: `m5_sr_detail.idbarang = m1_item.bid`

### Functions

- `m5_sr_getdata`: Mengambil data header dan detail retur penjualan untuk satu dokumen transaksi.
  related_tables: m5_sr, m5_sr_detail
- `m5_sr_getdata_history`: Mengambil riwayat perubahan header dan detail retur penjualan.
  related_tables: m5_sr, m5_sr_history, m5_sr_detail_history
- `m5_sr_terkait`: Mengambil keterkaitan dokumen retur penjualan dengan dokumen transaksi lain di alur proses.
  related_tables: m5_sr, m5_sr_detail
- `m5_sr_v`: Menyediakan listing atau pencarian data retur penjualan.
  related_tables: m5_sr, m5_sr_detail
- `m5_sr_v_history`: Menyediakan listing riwayat perubahan untuk retur penjualan.
  related_tables: m5_sr, m5_sr_history, m5_sr_detail_history

## Function Lintas Modul

- `M5_Print`: Memproses pencetakan dokumen M5 dan memperbarui counter cetak berdasarkan paket transaksi.
  related_tables: m5_sq, m5_so, m5_as, m5_pl, m5_do, m5_dr, m5_pi, m5_si, m5_rnr, m5_sr, m5_ic, m5_pv, m5_ip, m5_rp

