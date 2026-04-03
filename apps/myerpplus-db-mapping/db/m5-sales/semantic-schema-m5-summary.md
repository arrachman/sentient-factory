# Semantic Schema M5 Summary

Sumber schema: `/home/rania/apps/sentient-factory/apps/myerpplus-db-mapping/db/semantic-schema-m5.json`
Sumber function/query: `/home/rania/apps/sentient-factory/m5-queries.md`, `/home/rania/apps/sentient-factory/m0_report_rmoduleid_5.sql`, `/home/rania/apps/sentient-factory/client-backend/api-myerpplus/app_code/ws/m0/m0_query.vb`

Total tabel M5 di schema: **82**
Total tabel M5 terdeteksi di query aktif: **82**
Total function M5: **98**
Total polymorphic relationships: **3**
Total join hints: **8**

Dokumen ini merangkum alias, deskripsi, struktur tabel, relasi utama, relasi polymorphic, join hints, dan function semantic utama untuk modul sales M5.
Schema JSON sudah dicocokkan dengan query service dan report aktif. Gap yang terdeteksi pada view komisi invoice penjualan sudah dimasukkan ke schema.

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
  `m5_ic_detail.sumber = AS and m5_ic_detail.idtransaksi = m5_as.asid`
  `m5_ic_detail.sumber = SI and m5_ic_detail.idtransaksi = m5_si.siid`
  `m5_ic_detail.sumber = SR and m5_ic_detail.idtransaksi = m5_sr.srid`
  `m5_pv_detail.sumber = SI and m5_pv_detail.idtransaksi = m5_si.siid`
  `m5_pv_detail.sumber = SR and m5_pv_detail.idtransaksi = m5_sr.srid`
- `sales_invoice_exchange`: Relasi tukar faktur penjualan terhadap dokumen sumber invoice/return.
  `m5_sie.sieid = m5_sie_detail.idsie`
  `m5_sie_detail.sumber = m5_si.sisumber and m5_sie_detail.idtransaksi = m5_si.siid`
  `m5_sie_detail.sumber = m5_sr.srsumber and m5_sie_detail.idtransaksi = m5_sr.srid`
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
  `AS -> m5_as.asid`
  `SI -> m5_si.siid`
  `SR -> m5_sr.srid`
- `m5_pv_detail.idtransaksi` via `sumber`: Relasi polymorphic ke dokumen yang dibayar melalui payment voucher.
  `SI -> m5_si.siid`
  `SR -> m5_sr.srid`
- `m5_sie_detail.idtransaksi` via `sumber`: Relasi polymorphic ke dokumen sumber yang ikut dalam tukar faktur penjualan.
  `SI -> m5_si.siid`
  `SR -> m5_sr.srid`

## Ringkasan Modul

- **AS**: Advance Sales / Uang Muka Penjualan | tabel: 4 | header: 1 | detail: 0 | history: 2 | relasi: 4
- **CL**: Closing Sales | tabel: 2 | header: 1 | detail: 0 | history: 1 | relasi: 3
- **DO**: Delivery Order | tabel: 4 | header: 1 | detail: 1 | history: 2 | relasi: 6
- **DR**: Delivery Report / Hasil Pengiriman | tabel: 4 | header: 1 | detail: 1 | history: 2 | relasi: 5
- **FILES**: Lampiran Transaksi | tabel: 1 | header: 0 | detail: 0 | history: 0 | relasi: 0
- **IC**: Invoice Collection / Penagihan Piutang | tabel: 4 | header: 1 | detail: 1 | history: 2 | relasi: 2
- **IP**: Incoming Payment | tabel: 4 | header: 1 | detail: 0 | history: 2 | relasi: 2
- **NOTES**: Catatan Transaksi | tabel: 1 | header: 0 | detail: 0 | history: 0 | relasi: 0
- **PI**: Proforma Invoice | tabel: 4 | header: 1 | detail: 1 | history: 2 | relasi: 5
- **PL**: Packing List | tabel: 6 | header: 1 | detail: 1 | history: 3 | relasi: 6
- **PV**: Payment Voucher | tabel: 4 | header: 1 | detail: 1 | history: 2 | relasi: 3
- **RNR**: Receipt Note Return / Penerimaan Barang Retur | tabel: 4 | header: 1 | detail: 1 | history: 2 | relasi: 5
- **RP**: Piutang Ongkos Kirim / Tagihan Tambahan | tabel: 4 | header: 1 | detail: 0 | history: 2 | relasi: 3
- **SF**: Sales Forecast | tabel: 2 | header: 1 | detail: 1 | history: 0 | relasi: 2
- **SI**: Sales Invoice | tabel: 13 | header: 1 | detail: 2 | history: 4 | relasi: 13
- **SIE**: Sales Invoice Exchange / Tukar Faktur | tabel: 4 | header: 1 | detail: 1 | history: 2 | relasi: 1
- **SO**: Sales Order | tabel: 4 | header: 1 | detail: 1 | history: 2 | relasi: 4
- **SPA**: Sales Point Adjustment | tabel: 4 | header: 1 | detail: 1 | history: 2 | relasi: 2
- **SQ**: Sales Quotation | tabel: 5 | header: 1 | detail: 1 | history: 2 | relasi: 5
- **SR**: Sales Return | tabel: 4 | header: 1 | detail: 1 | history: 2 | relasi: 5

## AS - Advance Sales / Uang Muka Penjualan

### Tabel

- `m5_as` | alias: `uang_muka_penjualan` | tipe: Header | kolom: 48
  Header uang muka penjualan (AS). Mewakili transaksi advance sales atau uang muka customer.
- `m5_as_history` | alias: `riwayat_uang_muka_penjualan` | tipe: History | kolom: 3
  Tabel histori header uang muka penjualan (AS). Menyimpan snapshot perubahan dokumen advance sales setiap kali transaksi diarsipkan ke riwayat.
- `m5_as_pay` | alias: `pembayaran_uang_muka_penjualan` | tipe: Payment/Allocation | kolom: 17
  Detail pembayaran atau alat bayar pada uang muka penjualan (AS).
- `m5_as_pay_history` | alias: `riwayat_pembayaran_uang_muka_penjualan` | tipe: History | kolom: 2
  Snapshot histori detail pembayaran dokumen AS.

### Kolom Header Penting

- `asid`: Identitas unik data atau relasi ke dokumen/transaksi terkait.
- `asautonotransaksi`: Nomor dokumen/transaksi unik.
- `asnotransaksi`: Nomor dokumen/transaksi unik.
- `astgl`: Tanggal transaksi atau tanggal referensi.
- `askodepa`: Kode referensi PA pada transaksi sesuai pengaturan bisnis internal.
- `askontak`: Referensi kontak atau contact person.
- `askontakperson`: Referensi kontak atau contact person.
- `astgljatuhtempo`: Tanggal jatuh tempo pembayaran atau penyelesaian transaksi.
- `asidso`: Referensi ke dokumen sales order terkait.
- `asidip`: Referensi ke dokumen incoming payment terkait.
- `astglnoref`: Tanggal dokumen referensi eksternal.
- `asmatauang`: Informasi mata uang dan kurs transaksi.

### Functions

- `m5_as_cd`: Menyediakan lookup/detail compact untuk kebutuhan picker atau dropdown.
- `m5_as_getdata`: Mengambil data header dan detail untuk satu dokumen transaksi.
- `m5_as_v`: Menyediakan listing atau pencarian data dokumen.
- `m5_as_getdata_history`: Mengambil riwayat perubahan header/detail untuk satu dokumen transaksi.
- `m5_as_v_history`: Menyediakan listing riwayat perubahan dokumen.
- `m5_as_terkait`: Mengambil keterkaitan dokumen dengan dokumen lain di alur sales.

## CL - Closing Sales

### Tabel

- `m5_cl` | alias: `penutupan_penjualan` | tipe: Header | kolom: 93
  Header closing sales atau dokumen penutupan penjualan per item/customer. Dipakai untuk memantau status lanjutan sales order ke PI, PL, DO, DR, SI, RNR, dan SR pada level transaksi yang sudah direalisasikan.
- `m5_cl_history` | alias: `riwayat_penutupan_penjualan` | tipe: History | kolom: 4
  Tabel histori header closing sales. Menyimpan snapshot perubahan dokumen penutupan penjualan untuk audit dan pelacakan status realisasi.

### Kolom Header Penting

- `clid`: Identitas unik data atau relasi ke dokumen/transaksi terkait.
- `clgudang`: Referensi gudang asal/tujuan transaksi.
- `clcarabayar`: Metode atau cara pembayaran yang digunakan pada transaksi.
- `clautonotransaksi`: Nomor dokumen/transaksi unik.
- `clnotransaksi`: Nomor dokumen/transaksi unik.
- `cltgl`: Tanggal transaksi atau tanggal referensi.
- `clkodepa`: Kode referensi PA pada transaksi sesuai pengaturan bisnis internal.
- `clcustomer`: Referensi customer.
- `clcustomerkontak`: Referensi customer.
- `cltglkirim`: Tanggal pengiriman atau rencana kirim barang.
- `cltgljatuhtempo`: Tanggal jatuh tempo pembayaran atau penyelesaian transaksi.
- `cltglnoref`: Tanggal dokumen referensi eksternal.

## DO - Delivery Order

### Tabel

- `m5_do` | alias: `pengiriman_order` | tipe: Header | kolom: 67
  Header delivery order (DO) atau surat jalan pengiriman barang ke customer.
- `m5_do_detail` | alias: `detail_pengiriman_order` | tipe: Detail | kolom: 51
  Detail barang pada delivery order (DO). Menyimpan item yang dikirim, referensi SO/PL/PI, dan progres realisasi lanjutan.
- `m5_do_detail_history` | alias: `riwayat_detail_pengiriman_order` | tipe: History | kolom: 2
  Snapshot histori baris detail dokumen DO.
- `m5_do_history` | alias: `riwayat_pengiriman_order` | tipe: History | kolom: 3
  Tabel histori header delivery order (DO). Menyimpan snapshot perubahan dokumen surat jalan atau pengiriman barang.

### Kolom Header Penting

- `doid`: Primary key baris data.
- `dogudang`: Referensi gudang asal/tujuan transaksi.
- `docarabayar`: Metode atau cara pembayaran yang digunakan pada transaksi.
- `doautonotransaksi`: Nomor dokumen/transaksi unik.
- `donotransaksi`: Nomor dokumen/transaksi unik.
- `dotgl`: Tanggal transaksi atau tanggal referensi.
- `dokodepa`: Kode referensi PA pada transaksi sesuai pengaturan bisnis internal.
- `docustomer`: Referensi customer.
- `docustomerkontak`: Referensi customer.
- `dotglkirim`: Tanggal pengiriman atau rencana kirim barang.
- `dotgljatuhtempo`: Tanggal jatuh tempo pembayaran atau penyelesaian transaksi.
- `dotglnoref`: Tanggal dokumen referensi eksternal.

### Functions

- `m5_do_getdata`: Mengambil data header dan detail untuk satu dokumen transaksi.
- `m5_do_cd`: Menyediakan lookup/detail compact untuk kebutuhan picker atau dropdown.
- `m5_do_detail_cd`: Menyediakan lookup/detail compact untuk kebutuhan picker atau dropdown.
- `m5_do_v`: Menyediakan listing atau pencarian data dokumen.
- `m5_do_detail_v`: Menyediakan listing atau pencarian data dokumen.
- `m5_do_getdata_history`: Mengambil riwayat perubahan header/detail untuk satu dokumen transaksi.
- `m5_do_v_history`: Menyediakan listing riwayat perubahan dokumen.
- `m5_do_terkait`: Mengambil keterkaitan dokumen dengan dokumen lain di alur sales.

## DR - Delivery Report / Hasil Pengiriman

### Tabel

- `m5_dr` | alias: `laporan_hasil_pengiriman` | tipe: Header | kolom: 68
  Header hasil pengiriman atau delivery report (DR). Mencatat hasil akhir pengiriman barang, termasuk jumlah terkirim, jumlah kembali, dan progres realisasi lanjutan ke invoice atau retur.
- `m5_dr_detail` | alias: `detail_hasil_pengiriman` | tipe: Detail | kolom: 53
  Detail hasil pengiriman pada delivery report. Menyimpan item, kuantitas terkirim/kembali, dan progres dokumen lanjutan seperti SI, RNR, SR, atau realisasi lain.
- `m5_dr_detail_history` | alias: `riwayat_detail_hasil_pengiriman` | tipe: History | kolom: 2
  Snapshot histori baris detail dokumen DR.
- `m5_dr_history` | alias: `riwayat_hasil_pengiriman` | tipe: History | kolom: 2
  Tabel histori header delivery report. Menyimpan snapshot perubahan hasil pengiriman barang untuk audit proses distribusi.

### Kolom Header Penting

- `drid`: Identitas unik data atau relasi ke dokumen/transaksi terkait.
- `drgudang`: Referensi gudang asal/tujuan transaksi.
- `drcarabayar`: Metode atau cara pembayaran yang digunakan pada transaksi.
- `drautonotransaksi`: Nomor dokumen/transaksi unik.
- `drnotransaksi`: Nomor dokumen/transaksi unik.
- `drtgl`: Tanggal transaksi atau tanggal referensi.
- `drkodepa`: Kode referensi PA pada transaksi sesuai pengaturan bisnis internal.
- `drcustomer`: Referensi customer.
- `drcustomerkontak`: Referensi customer.
- `drtglkirim`: Tanggal pengiriman atau rencana kirim barang.
- `drtgljatuhtempo`: Tanggal jatuh tempo pembayaran atau penyelesaian transaksi.
- `drtglnoref`: Tanggal dokumen referensi eksternal.

### Functions

- `m5_dr_getdata`: Mengambil data header dan detail untuk satu dokumen transaksi.
- `m5_dr_cd`: Menyediakan lookup/detail compact untuk kebutuhan picker atau dropdown.
- `m5_dr_detail_cd`: Menyediakan lookup/detail compact untuk kebutuhan picker atau dropdown.
- `m5_dr_v`: Menyediakan listing atau pencarian data dokumen.
- `m5_dr_detail_v`: Menyediakan listing atau pencarian data dokumen.
- `m5_dr_getdata_history`: Mengambil riwayat perubahan header/detail untuk satu dokumen transaksi.
- `m5_dr_v_history`: Menyediakan listing riwayat perubahan dokumen.
- `m5_dr_terkait`: Mengambil keterkaitan dokumen dengan dokumen lain di alur sales.

## FILES - Lampiran Transaksi

### Tabel

- `m5_files` | alias: `lampiran_transaksi_penjualan` | tipe: Auxiliary | kolom: 8
  Lampiran file per transaksi M5, seperti dokumen pendukung atau attachment report/transaksi.

### Functions

- `m5_files_v`: Menyediakan listing atau pencarian data dokumen.

## IC - Invoice Collection / Penagihan Piutang

### Tabel

- `m5_ic` | alias: `penagihan_piutang_penjualan` | tipe: Header | kolom: 50
  Header penagihan piutang atau invoice collection (IC). Dipakai untuk proses koleksi/tagihan ke customer atas transaksi yang akan ditagih dan kemudian dapat dialokasikan ke payment voucher.
- `m5_ic_detail` | alias: `detail_penagihan_piutang_penjualan` | tipe: Detail | kolom: 27
  Detail item tagihan pada invoice collection. Berisi transaksi sumber yang ditagih, rencana tagih, nilai terbayar, jumlah bayar, dan saldo yang bisa dialokasikan ke payment voucher.
- `m5_ic_detail_history` | alias: `riwayat_detail_penagihan_piutang_penjualan` | tipe: History | kolom: 2
  Snapshot histori baris detail dokumen IC.
- `m5_ic_history` | alias: `riwayat_penagihan_piutang_penjualan` | tipe: History | kolom: 2
  Tabel histori header invoice collection. Menyimpan snapshot perubahan dokumen penagihan piutang/customer collection.

### Kolom Header Penting

- `icid`: Identitas unik data atau relasi ke dokumen/transaksi terkait.
- `icgudang`: Referensi gudang asal/tujuan transaksi.
- `icautonotransaksi`: Nomor dokumen/transaksi unik.
- `icnotransaksi`: Nomor dokumen/transaksi unik.
- `ictgl`: Tanggal transaksi atau tanggal referensi.
- `ickodepa`: Kode referensi PA pada transaksi sesuai pengaturan bisnis internal.
- `iccustomer`: Referensi customer.
- `iccustomerkontak`: Referensi customer.
- `ictglnoref`: Tanggal dokumen referensi eksternal.
- `iccarabayar`: Metode atau cara pembayaran yang digunakan pada transaksi.
- `ictglbayar`: Nilai nominal transaksi.
- `icmatauang`: Informasi mata uang dan kurs transaksi.

### Functions

- `m5_ic_v`: Menyediakan listing atau pencarian data dokumen.
- `m5_ic_cd`: Menyediakan lookup/detail compact untuk kebutuhan picker atau dropdown.
- `m5_ic_getdata`: Mengambil data header dan detail untuk satu dokumen transaksi.
- `m5_ic_v_history`: Menyediakan listing riwayat perubahan dokumen.
- `m5_ic_getdata_history`: Mengambil riwayat perubahan header/detail untuk satu dokumen transaksi.
- `m5_ic_takedatax`: Mengambil data kandidat dokumen/sumber untuk proses lanjutan.
- `m5_ic_takedata`: Mengambil data kandidat dokumen/sumber untuk proses lanjutan.
- `m5_ic_terkait`: Mengambil keterkaitan dokumen dengan dokumen lain di alur sales.

## IP - Incoming Payment

### Tabel

- `m5_ip` | alias: `penerimaan_pembayaran_penjualan` | tipe: Header | kolom: 47
  Header penerimaan pembayaran penjualan (IP). Digunakan untuk menerima pembayaran dari customer terhadap piutang/transaksi terkait.
- `m5_ip_history` | alias: `riwayat_penerimaan_pembayaran_penjualan` | tipe: History | kolom: 2
  Tabel histori header penerimaan pembayaran (IP). Menyimpan snapshot perubahan dokumen terima pembayaran customer.
- `m5_ip_pay` | alias: `alokasi_penerimaan_pembayaran_penjualan` | tipe: Payment/Allocation | kolom: 16
  Detail alat bayar pada penerimaan pembayaran (IP), seperti giro, bank, dan nominal pembayaran.
- `m5_ip_pay_history` | alias: `riwayat_alokasi_penerimaan_pembayaran_penjualan` | tipe: History | kolom: 2
  Snapshot histori detail pembayaran dokumen IP.

### Kolom Header Penting

- `ipid`: Identitas unik data atau relasi ke dokumen/transaksi terkait.
- `ipautonotransaksi`: Nomor dokumen/transaksi unik.
- `ipnotransaksi`: Nomor dokumen/transaksi unik.
- `iptgl`: Tanggal transaksi atau tanggal referensi.
- `ipkodepa`: Kode referensi PA pada transaksi sesuai pengaturan bisnis internal.
- `ipkontak`: Referensi kontak atau contact person.
- `ipkontakperson`: Referensi kontak atau contact person.
- `iptgljatuhtempo`: Tanggal jatuh tempo pembayaran atau penyelesaian transaksi.
- `ipidso`: Referensi ke dokumen sales order terkait.
- `iptglnoref`: Tanggal dokumen referensi eksternal.
- `ipmatauang`: Informasi mata uang dan kurs transaksi.
- `ipkurs`: Informasi mata uang dan kurs transaksi.

### Functions

- `m5_ip_cd`: Menyediakan lookup/detail compact untuk kebutuhan picker atau dropdown.
- `m5_ip_getdata`: Mengambil data header dan detail untuk satu dokumen transaksi.
- `m5_ip_v`: Menyediakan listing atau pencarian data dokumen.
- `m5_ip_getdata_history`: Mengambil riwayat perubahan header/detail untuk satu dokumen transaksi.
- `m5_ip_v_history`: Menyediakan listing riwayat perubahan dokumen.
- `m5_ip_terkait`: Mengambil keterkaitan dokumen dengan dokumen lain di alur sales.

## NOTES - Catatan Transaksi

### Tabel

- `m5_notes` | alias: `catatan_transaksi_penjualan` | tipe: Auxiliary | kolom: 8
  Catatan transaksi M5 yang melekat pada dokumen penjualan atau piutang tertentu.

### Functions

- `m5_notes_v`: Menyediakan listing atau pencarian data dokumen.

## PI - Proforma Invoice

### Tabel

- `m5_pi` | alias: `invoice_proforma_penjualan` | tipe: Header | kolom: 68
  Header proforma invoice (PI) atau invoice sementara penjualan sebelum menjadi invoice final.
- `m5_pi_detail` | alias: `detail_invoice_proforma_penjualan` | tipe: Detail | kolom: 45
  Detail item pada proforma invoice (PI), termasuk keterkaitan ke SO/PL dan progres realisasi ke invoice final.
- `m5_pi_detail_history` | alias: `riwayat_detail_invoice_proforma_penjualan` | tipe: History | kolom: 2
  Snapshot histori baris detail dokumen PI.
- `m5_pi_history` | alias: `riwayat_invoice_proforma_penjualan` | tipe: History | kolom: 2
  Tabel histori header proforma invoice (PI). Menyimpan snapshot perubahan invoice sementara penjualan.

### Kolom Header Penting

- `piid`: Identitas unik data atau relasi ke dokumen/transaksi terkait.
- `pigudang`: Referensi gudang asal/tujuan transaksi.
- `picarabayar`: Metode atau cara pembayaran yang digunakan pada transaksi.
- `piautonotransaksi`: Nomor dokumen/transaksi unik.
- `pinotransaksi`: Nomor dokumen/transaksi unik.
- `pitgl`: Tanggal transaksi atau tanggal referensi.
- `pikodepa`: Kode referensi PA pada transaksi sesuai pengaturan bisnis internal.
- `picustomer`: Referensi customer.
- `picustomerkontak`: Referensi customer.
- `pitglkirim`: Tanggal pengiriman atau rencana kirim barang.
- `pitgljatuhtempo`: Tanggal jatuh tempo pembayaran atau penyelesaian transaksi.
- `pitglnoref`: Tanggal dokumen referensi eksternal.

### Functions

- `m5_pi_getdata`: Mengambil data header dan detail untuk satu dokumen transaksi.
- `m5_pi_cd`: Menyediakan lookup/detail compact untuk kebutuhan picker atau dropdown.
- `m5_pi_detail_cd`: Menyediakan lookup/detail compact untuk kebutuhan picker atau dropdown.
- `m5_pi_v`: Menyediakan listing atau pencarian data dokumen.
- `m5_pi_detail_v`: Menyediakan listing atau pencarian data dokumen.
- `m5_pi_getdata_history`: Mengambil riwayat perubahan header/detail untuk satu dokumen transaksi.
- `m5_pi_v_history`: Menyediakan listing riwayat perubahan dokumen.
- `m5_pi_terkait`: Mengambil keterkaitan dokumen dengan dokumen lain di alur sales.

## PL - Packing List

### Tabel

- `m5_pl` | alias: `daftar_packing_penjualan` | tipe: Header | kolom: 66
  Header packing list (PL). Mewakili dokumen penyiapan barang sebelum proses pengiriman.
- `m5_pl_detail` | alias: `detail_daftar_packing_penjualan` | tipe: Detail | kolom: 45
  Detail barang pada packing list (PL), termasuk keterkaitan ke sales order dan progres realisasi pengiriman.
- `m5_pl_detail_history` | alias: `riwayat_detail_daftar_packing_penjualan` | tipe: History | kolom: 2
  Snapshot histori baris detail dokumen PL.
- `m5_pl_history` | alias: `riwayat_daftar_packing_penjualan` | tipe: History | kolom: 2
  Tabel histori header packing list (PL). Menyimpan snapshot perubahan dokumen persiapan barang sebelum pengiriman.
- `m5_pl_pack` | alias: `paket_daftar_packing_penjualan` | tipe: Supporting | kolom: 1
  Detail paket/pack yang terkait dokumen PL.
- `m5_pl_pack_history` | alias: `riwayat_paket_daftar_packing_penjualan` | tipe: History | kolom: 2
  Snapshot histori data pack dokumen PL.

### Kolom Header Penting

- `plid`: Identitas unik data atau relasi ke dokumen/transaksi terkait.
- `plgudang`: Referensi gudang asal/tujuan transaksi.
- `plcarabayar`: Metode atau cara pembayaran yang digunakan pada transaksi.
- `plautonotransaksi`: Nomor dokumen/transaksi unik.
- `plnotransaksi`: Nomor dokumen/transaksi unik.
- `pltgl`: Tanggal transaksi atau tanggal referensi.
- `plkodepa`: Kode referensi PA pada transaksi sesuai pengaturan bisnis internal.
- `plcustomer`: Referensi customer.
- `plcustomerkontak`: Referensi customer.
- `pltglkirim`: Tanggal pengiriman atau rencana kirim barang.
- `pltgljatuhtempo`: Tanggal jatuh tempo pembayaran atau penyelesaian transaksi.
- `pltglnoref`: Tanggal dokumen referensi eksternal.

### Functions

- `m5_pl_getdata`: Mengambil data header dan detail untuk satu dokumen transaksi.
- `m5_pl_v`: Menyediakan listing atau pencarian data dokumen.
- `m5_pl_getdata_history`: Mengambil riwayat perubahan header/detail untuk satu dokumen transaksi.
- `m5_pl_v_history`: Menyediakan listing riwayat perubahan dokumen.
- `m5_pl_detail_cd`: Menyediakan lookup/detail compact untuk kebutuhan picker atau dropdown.
- `m5_pl_detail_v`: Menyediakan listing atau pencarian data dokumen.
- `m5_pl_terkait`: Mengambil keterkaitan dokumen dengan dokumen lain di alur sales.

## PV - Payment Voucher

### Tabel

- `m5_pv` | alias: `voucher_pembayaran_penjualan` | tipe: Header | kolom: 48
  Header pembayaran piutang (PV). Mencatat pelunasan atau penerimaan atas piutang customer.
- `m5_pv_detail` | alias: `detail_voucher_pembayaran_penjualan` | tipe: Detail | kolom: 25
  Detail pembayaran piutang (PV), termasuk transaksi yang dibayar dan nominal pelunasannya.
- `m5_pv_detail_history` | alias: `riwayat_detail_voucher_pembayaran_penjualan` | tipe: History | kolom: 2
  Snapshot histori baris detail dokumen PV.
- `m5_pv_history` | alias: `riwayat_voucher_pembayaran_penjualan` | tipe: History | kolom: 2
  Tabel histori header pembayaran piutang (PV). Menyimpan snapshot perubahan dokumen pelunasan atau penerimaan piutang customer.

### Kolom Header Penting

- `pvid`: Identitas unik data atau relasi ke dokumen/transaksi terkait.
- `pvgudang`: Referensi gudang asal/tujuan transaksi.
- `pvautonotransaksi`: Nomor dokumen/transaksi unik.
- `pvnotransaksi`: Nomor dokumen/transaksi unik.
- `pvtgl`: Tanggal transaksi atau tanggal referensi.
- `pvkodepa`: Kode referensi PA pada transaksi sesuai pengaturan bisnis internal.
- `pvcustomer`: Referensi customer.
- `pvcustomerkontak`: Referensi customer.
- `pvtglnoref`: Tanggal dokumen referensi eksternal.
- `pvcarabayar`: Metode atau cara pembayaran yang digunakan pada transaksi.
- `pvtglbayar`: Nilai nominal transaksi.
- `pvmatauang`: Informasi mata uang dan kurs transaksi.

### Functions

- `m5_pv_v`: Menyediakan listing atau pencarian data dokumen.
- `m5_pv_getdata`: Mengambil data header dan detail untuk satu dokumen transaksi.
- `m5_pv_v_history`: Menyediakan listing riwayat perubahan dokumen.
- `m5_pv_getdata_history`: Mengambil riwayat perubahan header/detail untuk satu dokumen transaksi.
- `m5_pv_terkait`: Mengambil keterkaitan dokumen dengan dokumen lain di alur sales.

## RNR - Receipt Note Return / Penerimaan Barang Retur

### Tabel

- `m5_rnr` | alias: `penerimaan_barang_retur` | tipe: Header | kolom: 74
  Header penerimaan barang retur (RNR) dari customer. Dipakai untuk mencatat retur yang diterima sebelum diproses lebih lanjut ke retur penjualan atau realisasi lanjutan.
- `m5_rnr_detail` | alias: `detail_penerimaan_barang_retur` | tipe: Detail | kolom: 50
  Detail item pada penerimaan barang retur. Menyimpan barang yang diterima kembali, kuantitas, nilai, dan progres lanjut ke dokumen retur penjualan.
- `m5_rnr_detail_history` | alias: `riwayat_detail_penerimaan_barang_retur` | tipe: History | kolom: 2
  Snapshot histori baris detail dokumen RNR.
- `m5_rnr_history` | alias: `riwayat_penerimaan_barang_retur` | tipe: History | kolom: 2
  Tabel histori header penerimaan barang retur. Menyimpan snapshot perubahan dokumen RNR untuk audit proses retur dari customer.

### Kolom Header Penting

- `rnrid`: Identitas unik data atau relasi ke dokumen/transaksi terkait.
- `rnrgudang`: Referensi gudang asal/tujuan transaksi.
- `rnrcarabayar`: Metode atau cara pembayaran yang digunakan pada transaksi.
- `rnrautonotransaksi`: Nomor dokumen/transaksi unik.
- `rnrnotransaksi`: Nomor dokumen/transaksi unik.
- `rnrtgl`: Tanggal transaksi atau tanggal referensi.
- `rnrkodepa`: Kode referensi PA pada transaksi sesuai pengaturan bisnis internal.
- `rnrcustomer`: Referensi customer.
- `rnrcustomerkontak`: Referensi customer.
- `rnrtglkirim`: Tanggal pengiriman atau rencana kirim barang.
- `rnrtgljatuhtempo`: Tanggal jatuh tempo pembayaran atau penyelesaian transaksi.
- `rnrtglnoref`: Tanggal dokumen referensi eksternal.

### Functions

- `m5_rnr_getdata`: Mengambil data header dan detail untuk satu dokumen transaksi.
- `m5_rnr_cd`: Menyediakan lookup/detail compact untuk kebutuhan picker atau dropdown.
- `m5_rnr_detail_cd`: Menyediakan lookup/detail compact untuk kebutuhan picker atau dropdown.
- `m5_rnr_v`: Menyediakan listing atau pencarian data dokumen.
- `m5_rnr_detail_v`: Menyediakan listing atau pencarian data dokumen.
- `m5_rnr_terkait`: Mengambil keterkaitan dokumen dengan dokumen lain di alur sales.

## RP - Piutang Ongkos Kirim / Tagihan Tambahan

### Tabel

- `m5_rp` | alias: `piutang_ongkos_kirim` | tipe: Header | kolom: 47
  Header piutang ongkos kirim atau tagihan tambahan yang terkait sales invoice/pengiriman. Menyimpan nilai piutang, status bayar, dan referensi invoice yang menjadi sumber tagihan.
- `m5_rp_history` | alias: `riwayat_piutang_ongkos_kirim` | tipe: History | kolom: 2
  Tabel histori header RP. Menyimpan snapshot perubahan piutang ongkos kirim atau tagihan tambahan terkait invoice/pengiriman.
- `m5_rp_pay` | alias: `pembayaran_piutang_ongkos_kirim` | tipe: Payment/Allocation | kolom: 16
  Detail alat bayar atau alokasi pembayaran untuk piutang ongkos kirim/tagihan tambahan pada RP.
- `m5_rp_pay_history` | alias: `riwayat_pembayaran_piutang_ongkos_kirim` | tipe: History | kolom: 2
  Snapshot histori detail pembayaran dokumen RP.

### Kolom Header Penting

- `rpid`: Identitas unik data atau relasi ke dokumen/transaksi terkait.
- `rpautonotransaksi`: Nomor dokumen/transaksi unik.
- `rpnotransaksi`: Nomor dokumen/transaksi unik.
- `rptgl`: Tanggal transaksi atau tanggal referensi.
- `rpkodepa`: Kode referensi PA pada transaksi sesuai pengaturan bisnis internal.
- `rpkontak`: Referensi kontak atau contact person.
- `rpkontakperson`: Referensi kontak atau contact person.
- `rptgljatuhtempo`: Tanggal jatuh tempo pembayaran atau penyelesaian transaksi.
- `rpidsi`: Referensi ke dokumen sales invoice terkait.
- `rptglnoref`: Tanggal dokumen referensi eksternal.
- `rpmatauang`: Informasi mata uang dan kurs transaksi.
- `rpkurs`: Informasi mata uang dan kurs transaksi.

### Functions

- `m5_rp_getdata`: Mengambil data header dan detail untuk satu dokumen transaksi.
- `m5_rp_v`: Menyediakan listing atau pencarian data dokumen.
- `m5_rp_getdata_history`: Mengambil riwayat perubahan header/detail untuk satu dokumen transaksi.
- `m5_rp_v_history`: Menyediakan listing riwayat perubahan dokumen.
- `m5_rp_terkait`: Mengambil keterkaitan dokumen dengan dokumen lain di alur sales.

## SF - Sales Forecast

### Tabel

- `m5_sf` | alias: `forecast_penjualan` | tipe: Header | kolom: 8
  Header sales contract atau sales booking yang muncul pada report kontrak, booking, dan backorder penjualan.
- `m5_sf_detail` | alias: `detail_forecast_penjualan` | tipe: Detail | kolom: 8
  Detail item pada sales contract atau sales booking.

### Kolom Header Penting

- `sfid`: Primary key unik dokumen sales contract.
- `sfnotransaksi`: Nomor dokumen sales contract.
- `sftgl`: Tanggal sales contract.
- `sfcustomer`: Referensi customer pada sales contract.
- `sfmatauang`: Mata uang transaksi sales contract.
- `sfstatus`: Status dokumen sales contract.
- `sfbagianpenjualan`: Referensi salesman atau bagian penjualan.
- `sfuraian`: Uraian atau keterangan sales contract.

## SI - Sales Invoice

### Tabel

- `m5_si` | alias: `invoice_penjualan` | tipe: Header | kolom: 95
  Header invoice penjualan final (sales invoice/SI). Menjadi dokumen utama penjualan dan piutang customer.
- `m5_si_cost` | alias: `biaya_invoice_penjualan` | tipe: Supporting | kolom: 6
  Komponen biaya tambahan pada invoice penjualan (SI), dipakai pada report biaya salesman dan komisi.
- `m5_si_detail` | alias: `detail_invoice_penjualan` | tipe: Detail | kolom: 53
  Detail barang pada invoice penjualan (SI), termasuk nilai jual, pajak, HPP, dan dimensi analitik seperti cost center/divisi/proyek.
- `m5_si_detail_failed` | alias: `detail_invoice_penjualan_gagal` | tipe: Supporting | kolom: 1
  Penyimpanan data gagal/proses gagal pada detail SI.
- `m5_si_detail_history` | alias: `riwayat_detail_invoice_penjualan` | tipe: History | kolom: 2
  Snapshot histori baris detail dokumen SI.
- `m5_si_detail_komisi_v` | alias: `inferred_from_query` | tipe: Detail | kolom: 53
  View/detail komisi invoice penjualan yang terdeteksi dari query aktif modul M5.
- `m5_si_failed` | alias: `invoice_penjualan_gagal` | tipe: Supporting | kolom: 2
  Penyimpanan data gagal/proses gagal terkait dokumen SI.
- `m5_si_history` | alias: `riwayat_invoice_penjualan` | tipe: History | kolom: 2
  Tabel histori header sales invoice (SI). Menyimpan snapshot perubahan faktur atau invoice penjualan final.
- `m5_si_installment` | alias: `angsuran_invoice_penjualan` | tipe: Supporting | kolom: 16
  Tabel installment atau cicilan yang terkait invoice penjualan (SI). Dipakai untuk memecah jadwal atau komponen pembayaran bertahap atas sales invoice.
- `m5_si_material` | alias: `material_invoice_penjualan` | tipe: Supporting | kolom: 16
  Detail material/komponen yang dipakai pada dokumen SI.
- `m5_si_material_history` | alias: `riwayat_material_invoice_penjualan` | tipe: History | kolom: 2
  Snapshot histori detail material dokumen SI.
- `m5_si_pay` | alias: `pembayaran_invoice_penjualan` | tipe: Payment/Allocation | kolom: 16
  Detail pembayaran atau alat bayar yang terkait invoice penjualan (SI). Menyimpan nominal pembayaran, metode bayar, dan referensi alat bayar per invoice.
- `m5_si_pay_history` | alias: `riwayat_pembayaran_invoice_penjualan` | tipe: History | kolom: 2
  Snapshot histori detail pembayaran dokumen SI.

### Kolom Header Penting

- `siid`: Primary key baris data.
- `sigudang`: Referensi gudang asal/tujuan transaksi.
- `sicarabayar`: Metode atau cara pembayaran yang digunakan pada transaksi.
- `siautonotransaksi`: Nomor dokumen/transaksi unik.
- `sinotransaksi`: Nomor dokumen/transaksi unik.
- `sitgl`: Tanggal transaksi atau tanggal referensi.
- `sikodepa`: Kode referensi PA pada transaksi sesuai pengaturan bisnis internal.
- `sicustomer`: Referensi customer.
- `sicustomerkontak`: Referensi customer.
- `sitglkirim`: Tanggal pengiriman atau rencana kirim barang.
- `sitgljatuhtempo`: Tanggal jatuh tempo pembayaran atau penyelesaian transaksi.
- `sitglnoref`: Tanggal dokumen referensi eksternal.

### Functions

- `m5_si_getdata`: Mengambil data header dan detail untuk satu dokumen transaksi.
- `m5_si_cd`: Menyediakan lookup/detail compact untuk kebutuhan picker atau dropdown.
- `m5_si_detail_cd`: Menyediakan lookup/detail compact untuk kebutuhan picker atau dropdown.
- `m5_si_v`: Menyediakan listing atau pencarian data dokumen.
- `m5_si_detail_v`: Menyediakan listing atau pencarian data dokumen.
- `m5_si_getdata_history`: Mengambil riwayat perubahan header/detail untuk satu dokumen transaksi.
- `m5_si_v_history`: Menyediakan listing riwayat perubahan dokumen.
- `m5_si_terkait`: Mengambil keterkaitan dokumen dengan dokumen lain di alur sales.

## SIE - Sales Invoice Exchange / Tukar Faktur

### Tabel

- `m5_sie` | alias: `tukar_faktur_penjualan` | tipe: Header | kolom: 29
  Header tukar faktur penjualan (SIE). Dipakai untuk pertukaran, regrouping, atau pengaitan ulang invoice/retur penjualan dalam proses administrasi faktur.
- `m5_sie_detail` | alias: `detail_tukar_faktur_penjualan` | tipe: Detail | kolom: 7
  Detail transaksi sumber pada tukar faktur penjualan. Berisi daftar dokumen sumber yang ikut dalam proses tukar atau regrouping faktur.
- `m5_sie_detail_history` | alias: `riwayat_detail_tukar_faktur_penjualan` | tipe: History | kolom: 2
  Snapshot histori baris detail dokumen SIE.
- `m5_sie_history` | alias: `riwayat_tukar_faktur_penjualan` | tipe: History | kolom: 2
  Tabel histori header tukar faktur penjualan. Menyimpan snapshot perubahan dokumen SIE untuk audit administrasi pertukaran faktur.

### Kolom Header Penting

- `sieid`: Identitas unik data atau relasi ke dokumen/transaksi terkait.
- `sieautonotransaksi`: Nomor dokumen/transaksi unik.
- `sienotransaksi`: Nomor dokumen/transaksi unik.
- `sietgl`: Tanggal transaksi atau tanggal referensi.
- `siekodepa`: Kode referensi PA pada transaksi sesuai pengaturan bisnis internal.
- `siekontak`: Referensi kontak atau contact person.
- `siekontakperson`: Referensi kontak atau contact person.
- `sietglnoref`: Tanggal dokumen referensi eksternal.
- `siestatus`: Status proses atau status dokumen.
- `siestatussebelumnya`: Status proses atau status dokumen.
- `siepostingtgl`: Tanggal transaksi atau tanggal referensi.
- `siemodifikasitgl`: Tanggal dan waktu modifikasi terakhir dokumen.

## SO - Sales Order

### Tabel

- `m5_so` | alias: `order_penjualan` | tipe: Header | kolom: 68
  Header order penjualan (sales order/SO). Menjadi komitmen pesanan customer setelah quotation disetujui.
- `m5_so_detail` | alias: `detail_order_penjualan` | tipe: Detail | kolom: 48
  Detail barang pada sales order (SO). Menyimpan item pesanan, kuantitas, harga, dan realisasi ke PL/DO/PI/SI.
- `m5_so_detail_history` | alias: `riwayat_detail_order_penjualan` | tipe: History | kolom: 2
  Snapshot histori baris detail dokumen SO.
- `m5_so_history` | alias: `riwayat_order_penjualan` | tipe: History | kolom: 2
  Tabel histori header sales order (SO). Menyimpan snapshot perubahan order penjualan customer.

### Kolom Header Penting

- `soid`: Primary key baris data.
- `sogudang`: Referensi gudang asal/tujuan transaksi.
- `socarabayar`: Metode atau cara pembayaran yang digunakan pada transaksi.
- `soautonotransaksi`: Nomor dokumen/transaksi unik.
- `sonotransaksi`: Nomor dokumen/transaksi unik.
- `sotgl`: Tanggal transaksi atau tanggal referensi.
- `sokodepa`: Kode referensi PA pada transaksi sesuai pengaturan bisnis internal.
- `socustomer`: Referensi customer.
- `socustomerkontak`: Referensi customer.
- `sotglkirim`: Tanggal pengiriman atau rencana kirim barang.
- `sotgljatuhtempo`: Tanggal jatuh tempo pembayaran atau penyelesaian transaksi.
- `sotglnoref`: Tanggal dokumen referensi eksternal.

### Functions

- `m5_so_getdata`: Mengambil data header dan detail untuk satu dokumen transaksi.
- `m5_so_cd`: Menyediakan lookup/detail compact untuk kebutuhan picker atau dropdown.
- `m5_so_detail_cd`: Menyediakan lookup/detail compact untuk kebutuhan picker atau dropdown.
- `m5_so_v`: Menyediakan listing atau pencarian data dokumen.
- `m5_so_getdata_history`: Mengambil riwayat perubahan header/detail untuk satu dokumen transaksi.
- `m5_so_v_history`: Menyediakan listing riwayat perubahan dokumen.
- `m5_so_detail_v`: Menyediakan listing atau pencarian data dokumen.
- `m5_so_terkait`: Mengambil keterkaitan dokumen dengan dokumen lain di alur sales.

## SPA - Sales Point Adjustment

### Tabel

- `m5_spa` | alias: `penyesuaian_poin_penjualan` | tipe: Header | kolom: 21
  Header penyesuaian poin penjualan (SPA). Digunakan untuk koreksi, penambahan, atau pengurangan poin customer di luar transaksi penjualan utama.
- `m5_spa_detail` | alias: `detail_penyesuaian_poin_penjualan` | tipe: Detail | kolom: 10
  Detail penyesuaian poin per kontak/customer. Menyimpan saldo poin lama, poin masuk, poin keluar, dan saldo poin baru setelah penyesuaian.
- `m5_spa_detail_history` | alias: `riwayat_detail_penyesuaian_poin_penjualan` | tipe: History | kolom: 3
  Snapshot histori baris detail dokumen SPA.
- `m5_spa_history` | alias: `riwayat_penyesuaian_poin_penjualan` | tipe: History | kolom: 3
  Tabel histori header sales point adjustment. Menyimpan snapshot perubahan dokumen penyesuaian poin customer.

### Kolom Header Penting

- `spaid`: Identitas unik data atau relasi ke dokumen/transaksi terkait.
- `spaautonotransaksi`: Nomor dokumen/transaksi unik.
- `spanotransaksi`: Nomor dokumen/transaksi unik.
- `spatgl`: Tanggal transaksi atau tanggal referensi.
- `spakodepa`: Kode referensi PA pada transaksi sesuai pengaturan bisnis internal.
- `spakontak`: Referensi kontak atau contact person.
- `spakontakperson`: Referensi kontak atau contact person.
- `spastatus`: Status proses atau status dokumen.
- `spastatussebelumnya`: Status proses atau status dokumen.
- `spapostingtgl`: Tanggal transaksi atau tanggal referensi.
- `spamodifikasitgl`: Tanggal dan waktu modifikasi terakhir dokumen.

## SQ - Sales Quotation

### Tabel

- `m5_sq` | alias: `penawaran_penjualan` | tipe: Header | kolom: 63
  Header penawaran penjualan (sales quotation/SQ). Menyimpan dokumen penawaran ke customer sebelum menjadi sales order atau dokumen realisasi lain.
- `m5_sq_detail` | alias: `detail_penawaran_penjualan` | tipe: Detail | kolom: 50
  Detail barang pada penawaran penjualan (SQ). Menyimpan item, kuantitas, harga, dan progres realisasi ke dokumen lanjutan.
- `m5_sq_detail_history` | alias: `riwayat_detail_penawaran_penjualan` | tipe: History | kolom: 2
  Snapshot histori baris detail dokumen SQ.
- `m5_sq_history` | alias: `riwayat_penawaran_penjualan` | tipe: History | kolom: 2
  Tabel histori header sales quotation (SQ). Menyimpan snapshot perubahan dokumen penawaran penjualan.
- `m5_sq_out_bahan` | alias: `material_keluar_penawaran_penjualan` | tipe: Supporting | kolom: 19
  Detail bahan/komponen keluaran pada dokumen SQ.

### Kolom Header Penting

- `sqid`: Identitas unik data atau relasi ke dokumen/transaksi terkait.
- `sqgudang`: Referensi gudang asal/tujuan transaksi.
- `sqcarabayar`: Metode atau cara pembayaran yang digunakan pada transaksi.
- `sqautonotransaksi`: Nomor dokumen/transaksi unik.
- `sqnotransaksi`: Nomor dokumen/transaksi unik.
- `sqtgl`: Tanggal transaksi atau tanggal referensi.
- `sqkodepa`: Kode referensi PA pada transaksi sesuai pengaturan bisnis internal.
- `sqcustomer`: Referensi customer.
- `sqcustomerkontak`: Referensi customer.
- `sqtglkirim`: Tanggal pengiriman atau rencana kirim barang.
- `sqtgljatuhtempo`: Tanggal jatuh tempo pembayaran atau penyelesaian transaksi.
- `sqtglnoref`: Tanggal dokumen referensi eksternal.

### Functions

- `m5_sq_cd`: Menyediakan lookup/detail compact untuk kebutuhan picker atau dropdown.
- `m5_sq_v`: Menyediakan listing atau pencarian data dokumen.
- `m5_sq_getdata`: Mengambil data header dan detail untuk satu dokumen transaksi.
- `m5_sq_v_history`: Menyediakan listing riwayat perubahan dokumen.
- `m5_sq_getdata_history`: Mengambil riwayat perubahan header/detail untuk satu dokumen transaksi.
- `m5_sq_terkait`: Mengambil keterkaitan dokumen dengan dokumen lain di alur sales.
- `m5_sq_detail_v`: Menyediakan listing atau pencarian data dokumen.
- `m5_sq_detail_cd`: Menyediakan lookup/detail compact untuk kebutuhan picker atau dropdown.

## SR - Sales Return

### Tabel

- `m5_sr` | alias: `retur_penjualan` | tipe: Header | kolom: 79
  Header retur penjualan (sales return/SR). Mencatat pengembalian transaksi penjualan oleh customer.
- `m5_sr_detail` | alias: `detail_retur_penjualan` | tipe: Detail | kolom: 47
  Detail item pada retur penjualan (SR), termasuk harga, diskon, HPP, dan referensi ke invoice/retur terkait.
- `m5_sr_detail_history` | alias: `riwayat_detail_retur_penjualan` | tipe: History | kolom: 2
  Snapshot histori baris detail dokumen SR.
- `m5_sr_history` | alias: `riwayat_retur_penjualan` | tipe: History | kolom: 2
  Tabel histori header sales return (SR). Menyimpan snapshot perubahan dokumen retur penjualan customer.

### Kolom Header Penting

- `srid`: Identitas unik data atau relasi ke dokumen/transaksi terkait.
- `srgudang`: Referensi gudang asal/tujuan transaksi.
- `srcarabayar`: Metode atau cara pembayaran yang digunakan pada transaksi.
- `srautonotransaksi`: Nomor dokumen/transaksi unik.
- `srnotransaksi`: Nomor dokumen/transaksi unik.
- `srtgl`: Tanggal transaksi atau tanggal referensi.
- `srkodepa`: Kode referensi PA pada transaksi sesuai pengaturan bisnis internal.
- `srcustomer`: Referensi customer.
- `srcustomerkontak`: Referensi customer.
- `srtglkirim`: Tanggal pengiriman atau rencana kirim barang.
- `srtgljatuhtempo`: Tanggal jatuh tempo pembayaran atau penyelesaian transaksi.
- `srtglnoref`: Tanggal dokumen referensi eksternal.

### Functions

- `m5_sr_getdata`: Mengambil data header dan detail untuk satu dokumen transaksi.
- `m5_sr_v`: Menyediakan listing atau pencarian data dokumen.
- `m5_sr_getdata_history`: Mengambil riwayat perubahan header/detail untuk satu dokumen transaksi.
- `m5_sr_v_history`: Menyediakan listing riwayat perubahan dokumen.
- `m5_sr_terkait`: Mengambil keterkaitan dokumen dengan dokumen lain di alur sales.
