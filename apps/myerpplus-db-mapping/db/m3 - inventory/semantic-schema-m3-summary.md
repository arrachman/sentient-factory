# Semantic Schema M3 Summary

Sumber schema: `/home/rania/apps/sentient-factory/apps/myerpplus-db-mapping/db/semantic-schema-m3.json`
Sumber function/query: `/home/rania/apps/sentient-factory/m3-queries.md`, `/home/rania/apps/sentient-factory/m0_report_rmoduleid_3.sql`, `/home/rania/apps/sentient-factory/client-backend/api-myerpplus/app_code/ws/m0/m0_query.vb`

Total tabel M3 di schema: **43**
Total tabel M3 terdeteksi di query aktif: **43**
Total function M3: **44**
Total polymorphic relationships: **0**
Total join hints: **5**

Dokumen ini merangkum alias, deskripsi, struktur tabel, relasi utama, join hints, dan function semantic utama untuk modul inventory M3.
Schema JSON sudah disinkronkan terhadap query aktif dan report M3, sehingga tabel history/progress/auxiliary yang muncul di source kini ikut tercatat di schema.

## Join Hints

- `inventory_request_to_transfer_flow`: Alur permintaan barang ke mutasi stok.
  `m3_mr.mrid = m3_mr_detail.idmr`
  `m3_mr_detail.idmrdetail = m3_ts_detail.idmrdetail`
  `m3_ts.tsid = m3_ts_detail.idts`
- `inventory_request_to_receipt_flow`: Alur permintaan barang ke terima mutasi.
  `m3_mr.mrid = m3_mr_detail.idmr`
  `m3_mr_detail.idmrdetail = m3_rs_detail.idmrdetail`
  `m3_rs.rsid = m3_rs_detail.idrs`
- `transfer_to_receipt_flow`: Alur mutasi stok ke penerimaan mutasi.
  `m3_ts.tsid = m3_ts_detail.idts`
  `m3_ts_detail.idtsdetail = m3_rs_detail.idtsdetail`
  `m3_rs.rsid = m3_rs_detail.idrs`
- `stock_opname_adjustment_flow`: Alur stok opname ke transaksi barang/saldo penyesuaian.
  `m3_sp.spid = m3_sp_detail.idsp`
  `m3_sp_detail.idspdetail = m3_sa_detail.idspdetail`
  `m3_sa.said = m3_sa_detail.idsa`
- `opening_balance_inventory_flow`: Relasi saldo awal barang dengan detail saldo awal.
  `m3_ib.ibid = m3_ib_detail.idib`

## Polymorphic Relationships

- Tidak ada relasi polymorphic eksplisit yang terdeteksi pada schema/query M3 aktif.

## Ringkasan Modul

- **MR**: Material Request / Permintaan Barang | tabel schema: 4 | header: 1 | detail: 1 | history/progress: 2 | relasi: 2
- **TS**: Transfer Stock / Mutasi Barang | tabel schema: 4 | header: 1 | detail: 1 | history/progress: 2 | relasi: 3
- **RS**: Receive Stock / Terima Mutasi | tabel schema: 4 | header: 1 | detail: 1 | history/progress: 2 | relasi: 3
- **SA**: Transaksi Barang | tabel schema: 4 | header: 1 | detail: 1 | history/progress: 2 | relasi: 1
- **SP**: Stock Opname | tabel schema: 6 | header: 1 | detail: 1 | history/progress: 4 | relasi: 1
- **PA**: Set Harga Jual | tabel schema: 4 | header: 1 | detail: 1 | history/progress: 2 | relasi: 1
- **IB**: Saldo Awal Barang | tabel schema: 4 | header: 1 | detail: 1 | history/progress: 2 | relasi: 1
- **RF**: Pengisian Bahan Bakar | tabel schema: 4 | header: 1 | detail: 1 | history/progress: 2 | relasi: 1
- **DC**: Daily Check / Time Sheet | tabel schema: 6 | header: 1 | detail: 2 | history/progress: 3 | relasi: 2
- **RW**: Warehouse Transaction RW | tabel schema: 1 | header: 1 | detail: 0 | history/progress: 0 | relasi: 0
- **NOTES**: Catatan Transaksi Inventory | tabel schema: 1 | header: 0 | detail: 0 | history/progress: 0 | relasi: 0
- **FILES**: Lampiran Transaksi Inventory | tabel schema: 1 | header: 0 | detail: 0 | history/progress: 0 | relasi: 0

## MR - Material Request / Permintaan Barang

Permintaan barang antar gudang atau kebutuhan internal.

### Tabel

- `m3_mr` | alias: `inventory_mr` | tipe: Header | kolom: 28
  Transaksi inventory atau gudang untuk mr.
- `m3_mr_detail` | alias: `inventory_mr_detail` | tipe: Detail | kolom: 32
  Tabel detail untuk item/baris transaksi mr detail.
- `m3_mr_detail_history` | alias: `inventory_mr_detail` | tipe: History | kolom: 32
  Tabel histori/arsip yang terdeteksi dari query aktif modul M3.
- `m3_mr_history` | alias: `inventory_mr` | tipe: History | kolom: 28
  Tabel histori/arsip yang terdeteksi dari query aktif modul M3.

### Kolom Header Penting

- `mrid`: Kolom bisnis mrid.
- `mrgudangasal`: Referensi gudang asal/tujuan transaksi.
- `mrgudangtujuan`: Referensi gudang asal/tujuan transaksi.
- `mrautonotransaksi`: Nomor dokumen/transaksi unik.
- `mrnotransaksi`: Nomor dokumen/transaksi unik.
- `mrtgl`: Tanggal transaksi atau tanggal referensi.
- `mrkodepa`: Kolom bisnis mrkodepa.
- `mrdimintaolehkontak`: Referensi kontak atau contact person.
- `mrtgldipakai`: Kolom bisnis mrtgldipakai.
- `mrtglnoref`: Kolom bisnis mrtglnoref.
- `mrstatusts`: Status proses atau status dokumen.
- `mrstatusrs`: Status proses atau status dokumen.

### Relasi Utama

- `m3_mr_detail` -> `m3_mr`: `m3_mr_detail.idmr = m3_mr.mrid`
- `m3_mr_detail` -> `m3_ts_detail`: `m3_mr_detail.idmrdetail = m3_ts_detail.idmrdetail`
- `m3_mr_detail` -> `m3_rs_detail`: `m3_mr_detail.idmrdetail = m3_rs_detail.idmrdetail`

### Functions

- `m3_mr_v`: Menyediakan listing atau pencarian data dokumen.
- `m3_mr_getdata`: Mengambil data header dan detail untuk satu dokumen transaksi.
- `m3_mr_v_history`: Menyediakan listing riwayat perubahan dokumen.
- `m3_mr_getdata_history`: Mengambil riwayat perubahan header/detail untuk satu dokumen transaksi.
- `m3_mr_detail_cd`: Menyediakan lookup/detail compact untuk kebutuhan picker atau dropdown.
- `m3_mr_detail_v`: Menyediakan listing atau pencarian data dokumen.
- `m3_mr_terkait1`: Mengambil keterkaitan dokumen dengan dokumen inventory lain.
- `m3_mr_terkait`: Mengambil keterkaitan dokumen dengan dokumen inventory lain.

## TS - Transfer Stock / Mutasi Barang

Mutasi stok antar gudang termasuk transit.

### Tabel

- `m3_ts` | alias: `inventory_ts` | tipe: Header | kolom: 28
  Transaksi inventory atau gudang untuk ts.
- `m3_ts_detail` | alias: `inventory_ts_detail` | tipe: Detail | kolom: 29
  Tabel detail untuk item/baris transaksi ts detail.
- `m3_ts_detail_history` | alias: `inventory_ts_detail` | tipe: History | kolom: 29
  Tabel histori/arsip yang terdeteksi dari query aktif modul M3.
- `m3_ts_history` | alias: `inventory_ts` | tipe: History | kolom: 28
  Tabel histori/arsip yang terdeteksi dari query aktif modul M3.

### Kolom Header Penting

- `tsid`: Kolom bisnis tsid.
- `tsgudangasal`: Referensi gudang asal/tujuan transaksi.
- `tsgudangtransit`: Referensi gudang asal/tujuan transaksi.
- `tsgudangtujuan`: Referensi gudang asal/tujuan transaksi.
- `tsautonotransaksi`: Nomor dokumen/transaksi unik.
- `tsnotransaksi`: Nomor dokumen/transaksi unik.
- `tstgl`: Tanggal transaksi atau tanggal referensi.
- `tskodepa`: Kolom bisnis tskodepa.
- `tsbagianmutasikontak`: Referensi kontak atau contact person.
- `tstglnoref`: Kolom bisnis tstglnoref.
- `tsidmr`: Kolom bisnis tsidmr.
- `tsstatusrs`: Status proses atau status dokumen.

### Relasi Utama

- `m3_ts_detail` -> `m3_ts`: `m3_ts_detail.idts = m3_ts.tsid`
- `m3_ts_detail` -> `m3_mr_detail`: `m3_ts_detail.idmrdetail = m3_mr_detail.idmrdetail`
- `m3_ts_detail` -> `m3_rs_detail`: `m3_ts_detail.idtsdetail = m3_rs_detail.idtsdetail`

### Functions

- `m3_ts_v`: Menyediakan listing atau pencarian data dokumen.
- `m3_ts_getdata`: Mengambil data header dan detail untuk satu dokumen transaksi.
- `m3_ts_v_history`: Menyediakan listing riwayat perubahan dokumen.
- `m3_ts_getdata_history`: Mengambil riwayat perubahan header/detail untuk satu dokumen transaksi.
- `m3_ts_detail_cd`: Menyediakan lookup/detail compact untuk kebutuhan picker atau dropdown.
- `m3_ts_detail_v`: Menyediakan listing atau pencarian data dokumen.
- `m3_ts_terkait`: Mengambil keterkaitan dokumen dengan dokumen inventory lain.

## RS - Receive Stock / Terima Mutasi

Penerimaan barang hasil mutasi atau proses transfer.

### Tabel

- `m3_rs` | alias: `inventory_rs` | tipe: Header | kolom: 26
  Transaksi inventory atau gudang untuk rs.
- `m3_rs_detail` | alias: `inventory_rs_detail` | tipe: Detail | kolom: 24
  Tabel detail untuk item/baris transaksi rs detail.
- `m3_rs_detail_history` | alias: `inventory_rs_detail` | tipe: History | kolom: 24
  Tabel histori/arsip yang terdeteksi dari query aktif modul M3.
- `m3_rs_history` | alias: `inventory_rs` | tipe: History | kolom: 26
  Tabel histori/arsip yang terdeteksi dari query aktif modul M3.

### Kolom Header Penting

- `rsid`: Kolom bisnis rsid.
- `rsgudangasal`: Referensi gudang asal/tujuan transaksi.
- `rsgudangtransit`: Referensi gudang asal/tujuan transaksi.
- `rsgudangtujuan`: Referensi gudang asal/tujuan transaksi.
- `rsautonotransaksi`: Nomor dokumen/transaksi unik.
- `rsnotransaksi`: Nomor dokumen/transaksi unik.
- `rstgl`: Tanggal transaksi atau tanggal referensi.
- `rskodepa`: Kolom bisnis rskodepa.
- `rsbagianterimakontak`: Referensi kontak atau contact person.
- `rstglnoref`: Kolom bisnis rstglnoref.
- `rsidmr`: Kolom bisnis rsidmr.
- `rsidts`: Kolom bisnis rsidts.

### Relasi Utama

- `m3_rs_detail` -> `m3_rs`: `m3_rs_detail.idrs = m3_rs.rsid`
- `m3_rs_detail` -> `m3_ts_detail`: `m3_rs_detail.idtsdetail = m3_ts_detail.idtsdetail`
- `m3_rs_detail` -> `m3_mr_detail`: `m3_rs_detail.idmrdetail = m3_mr_detail.idmrdetail`

### Functions

- `m3_rs_v`: Menyediakan listing atau pencarian data dokumen.
- `m3_rs_getdata`: Mengambil data header dan detail untuk satu dokumen transaksi.
- `m3_rs_v_history`: Menyediakan listing riwayat perubahan dokumen.
- `m3_rs_getdata_history`: Mengambil riwayat perubahan header/detail untuk satu dokumen transaksi.
- `m3_rs_terkait`: Mengambil keterkaitan dokumen dengan dokumen inventory lain.

## SA - Transaksi Barang

Pergerakan stok umum / stock adjustment.

### Tabel

- `m3_sa` | alias: `inventory_sa` | tipe: Header | kolom: 26
  Transaksi inventory atau gudang untuk sa.
- `m3_sa_detail` | alias: `inventory_sa_detail` | tipe: Detail | kolom: 28
  Tabel detail untuk item/baris transaksi sa detail.
- `m3_sa_detail_history` | alias: `inventory_sa_detail` | tipe: History | kolom: 28
  Tabel histori/arsip yang terdeteksi dari query aktif modul M3.
- `m3_sa_history` | alias: `inventory_sa` | tipe: History | kolom: 26
  Tabel histori/arsip yang terdeteksi dari query aktif modul M3.

### Kolom Header Penting

- `said`: Kolom bisnis said.
- `sagudang`: Referensi gudang asal/tujuan transaksi.
- `saautonotransaksi`: Nomor dokumen/transaksi unik.
- `sanotransaksi`: Nomor dokumen/transaksi unik.
- `satgl`: Tanggal transaksi atau tanggal referensi.
- `sakodepa`: Kolom bisnis sakodepa.
- `sabagiansakontak`: Referensi kontak atau contact person.
- `satglnoref`: Kolom bisnis satglnoref.
- `saidsp`: Kolom bisnis saidsp.
- `sastatus`: Status proses atau status dokumen.
- `sastatussebelumnya`: Status proses atau status dokumen.
- `sapostingtgl`: Tanggal transaksi atau tanggal referensi.

### Relasi Utama

- `m3_sa_detail` -> `m3_sa`: `m3_sa_detail.idsa = m3_sa.said`
- `m3_sa_detail` -> `m3_sp_detail`: `m3_sa_detail.idspdetail = m3_sp_detail.idspdetail` when adjustment berasal dari stock opname

### Functions

- `m3_sa_v`: Menyediakan listing atau pencarian data dokumen.
- `m3_sa_getdata`: Mengambil data header dan detail untuk satu dokumen transaksi.
- `m3_sa_v_history`: Menyediakan listing riwayat perubahan dokumen.
- `m3_sa_getdata_history`: Mengambil riwayat perubahan header/detail untuk satu dokumen transaksi.
- `m3_sa_terkait`: Mengambil keterkaitan dokumen dengan dokumen inventory lain.

## SP - Stock Opname

Pencatatan fisik stok, selisih, dan progres opname.

### Tabel

- `m3_sp` | alias: `inventory_sp` | tipe: Header | kolom: 26
  Transaksi inventory atau gudang untuk sp.
- `m3_sp_detail` | alias: `inventory_sp_detail` | tipe: Detail | kolom: 31
  Tabel detail untuk item/baris transaksi sp detail.
- `m3_sp_detail_history` | alias: `inventory_sp_detail` | tipe: History | kolom: 31
  Tabel histori/arsip yang terdeteksi dari query aktif modul M3.
- `m3_sp_detail_progress` | alias: `inferred_from_query` | tipe: Progress | kolom: 0
  Tabel progress/proses yang terdeteksi dari query aktif modul M3.
- `m3_sp_history` | alias: `inventory_sp` | tipe: History | kolom: 26
  Tabel histori/arsip yang terdeteksi dari query aktif modul M3.
- `m3_sp_progress` | alias: `inferred_from_query` | tipe: Progress | kolom: 0
  Tabel progress/proses yang terdeteksi dari query aktif modul M3.

### Kolom Header Penting

- `spid`: Kolom bisnis spid.
- `spgudang`: Referensi gudang asal/tujuan transaksi.
- `spautonotransaksi`: Nomor dokumen/transaksi unik.
- `spnotransaksi`: Nomor dokumen/transaksi unik.
- `sptgl`: Tanggal transaksi atau tanggal referensi.
- `spkodepa`: Kolom bisnis spkodepa.
- `spbagianspkontak`: Referensi kontak atau contact person.
- `sptglnoref`: Kolom bisnis sptglnoref.
- `spstatussa`: Status proses atau status dokumen.
- `spstatus`: Status proses atau status dokumen.
- `spstatussebelumnya`: Status proses atau status dokumen.
- `sppostingtgl`: Tanggal transaksi atau tanggal referensi.

### Relasi Utama

- `m3_sp_detail` -> `m3_sp`: `m3_sp_detail.idsp = m3_sp.spid`
- `m3_sp_detail_progress` -> `m3_sp_detail`: `m3_sp_detail_progress.idspdetail = m3_sp_detail.idspdetail` (inferred)
- `m3_sp_progress` -> `m3_sp`: `m3_sp_progress.idsp = m3_sp.spid` (inferred)

### Functions

- `m3_sp_v`: Menyediakan listing atau pencarian data dokumen.
- `m3_sp_getdata`: Mengambil data header dan detail untuk satu dokumen transaksi.
- `m3_sp_v_history`: Menyediakan listing riwayat perubahan dokumen.
- `m3_sp_getdata_history`: Mengambil riwayat perubahan header/detail untuk satu dokumen transaksi.
- `m3_sp_detail_cd`: Menyediakan lookup/detail compact untuk kebutuhan picker atau dropdown.
- `m3_sp_detail_v`: Menyediakan listing atau pencarian data dokumen.
- `m3_sp_terkait`: Mengambil keterkaitan dokumen dengan dokumen inventory lain.

## PA - Set Harga Jual

Penetapan atau update harga jual barang.

### Tabel

- `m3_pa` | alias: `inventory_pa` | tipe: Header | kolom: 28
  Transaksi inventory atau gudang untuk pa.
- `m3_pa_detail` | alias: `inventory_pa_detail` | tipe: Detail | kolom: 60
  Tabel detail untuk item/baris transaksi pa detail.
- `m3_pa_detail_history` | alias: `inventory_pa_detail` | tipe: History | kolom: 60
  Tabel histori/arsip yang terdeteksi dari query aktif modul M3.
- `m3_pa_history` | alias: `inventory_pa` | tipe: History | kolom: 28
  Tabel histori/arsip yang terdeteksi dari query aktif modul M3.

### Kolom Header Penting

- `paid`: Kolom bisnis paid.
- `pagudang`: Referensi gudang asal/tujuan transaksi.
- `paautonotransaksi`: Nomor dokumen/transaksi unik.
- `panotransaksi`: Nomor dokumen/transaksi unik.
- `patgl`: Tanggal transaksi atau tanggal referensi.
- `patglberlakusampai`: Kolom bisnis patglberlakusampai.
- `pakodepa`: Kolom bisnis pakodepa.
- `pabagianpakontak`: Referensi kontak atau contact person.
- `pamatauang`: Informasi mata uang dan kurs transaksi.
- `pakurs`: Informasi mata uang dan kurs transaksi.
- `patglnoref`: Kolom bisnis patglnoref.
- `pastatus`: Status proses atau status dokumen.

### Relasi Utama

- `m3_pa_detail` -> `m3_pa`: `m3_pa_detail.idpa = m3_pa.paid`

### Functions

- `m3_pa_v`: Menyediakan listing atau pencarian data dokumen.
- `m3_pa_getdata`: Mengambil data header dan detail untuk satu dokumen transaksi.
- `m3_pa_v_history`: Menyediakan listing riwayat perubahan dokumen.
- `m3_pa_getdata_history`: Mengambil riwayat perubahan header/detail untuk satu dokumen transaksi.

## IB - Saldo Awal Barang

Inisialisasi saldo awal stok barang.

### Tabel

- `m3_ib` | alias: `saldo_awal_barang` | tipe: Header | kolom: 26
  Header transaksi saldo awal barang per gudang pada awal periode. Dipakai untuk membentuk posisi stok awal sebelum transaksi gudang berjalan.
- `m3_ib_detail` | alias: `saldo_awal_barang_detail` | tipe: Detail | kolom: 25
  Detail item untuk transaksi saldo awal barang. Setiap baris menyimpan qty awal, satuan, HPP, dan akun persediaan item.
- `m3_ib_detail_history` | alias: `saldo_awal_barang_detail` | tipe: History | kolom: 25
  Tabel histori/arsip yang terdeteksi dari query aktif modul M3.
- `m3_ib_history` | alias: `saldo_awal_barang` | tipe: History | kolom: 26
  Tabel histori/arsip yang terdeteksi dari query aktif modul M3.

### Kolom Header Penting

- `ibid`: Primary key baris data.
- `ibgudang`: Referensi gudang asal/tujuan transaksi.
- `ibautonotransaksi`: Nomor dokumen/transaksi unik.
- `ibnotransaksi`: Nomor dokumen/transaksi unik.
- `ibtgl`: Tanggal transaksi atau tanggal referensi.
- `ibkodepa`: Kolom bisnis ibkodepa.
- `ibbagianibkontak`: Referensi kontak atau contact person.
- `ibmatauang`: Informasi mata uang dan kurs transaksi.
- `ibkurs`: Informasi mata uang dan kurs transaksi.
- `ibtglnoref`: Kolom bisnis ibtglnoref.
- `ibstatus`: Status proses atau status dokumen.
- `ibstatussebelumnya`: Status proses atau status dokumen.

### Relasi Utama

- `m3_ib_detail` -> `m3_ib`: `m3_ib_detail.idib = m3_ib.ibid`

### Functions

- `m3_ib_v`: Menyediakan listing atau pencarian data dokumen.
- `m3_ib_getdata`: Mengambil data header dan detail untuk satu dokumen transaksi.
- `m3_ib_v_history`: Menyediakan listing riwayat perubahan dokumen.
- `m3_ib_getdata_history`: Mengambil riwayat perubahan header/detail untuk satu dokumen transaksi.
- `m3_ib_terkait`: Mengambil keterkaitan dokumen dengan dokumen inventory lain.

## RF - Pengisian Bahan Bakar

Transaksi fuel/refuel untuk unit atau alat.

### Tabel

- `m3_rf` | alias: `inventory_rf` | tipe: Header | kolom: 28
  Transaksi inventory atau gudang untuk rf.
- `m3_rf_detail` | alias: `inventory_rf_detail` | tipe: Detail | kolom: 32
  Tabel detail untuk item/baris transaksi rf detail.
- `m3_rf_detail_history` | alias: `inventory_rf_detail` | tipe: History | kolom: 32
  Tabel histori/arsip yang terdeteksi dari query aktif modul M3.
- `m3_rf_history` | alias: `inventory_rf` | tipe: History | kolom: 28
  Tabel histori/arsip yang terdeteksi dari query aktif modul M3.

### Kolom Header Penting

- `rfid`: Kolom bisnis rfid.
- `rfgudangasal`: Referensi gudang asal/tujuan transaksi.
- `rfgudangtujuan`: Referensi gudang asal/tujuan transaksi.
- `rfautonotransaksi`: Nomor dokumen/transaksi unik.
- `rfnotransaksi`: Nomor dokumen/transaksi unik.
- `rftgl`: Tanggal transaksi atau tanggal referensi.
- `rfkodepa`: Kolom bisnis rfkodepa.
- `rfdimintaolehkontak`: Referensi kontak atau contact person.
- `rftgldipakai`: Kolom bisnis rftgldipakai.
- `rftglnoref`: Kolom bisnis rftglnoref.
- `rfstatusts`: Status proses atau status dokumen.
- `rfstatusrs`: Status proses atau status dokumen.

### Relasi Utama

- `m3_rf_detail` -> `m3_rf`: `m3_rf_detail.idrf = m3_rf.rfid`

## DC - Daily Check / Time Sheet

Operasional checklist harian, jam kerja alat, dan pemeriksaan unit.

### Tabel

- `m3_dc` | alias: `inventory_dc` | tipe: Header | kolom: 35
  Transaksi inventory atau gudang untuk dc.
- `m3_dc_check` | alias: `inventory_dc_check` | tipe: Detail | kolom: 7
  Transaksi inventory atau gudang untuk dc check.
- `m3_dc_check_history` | alias: `inventory_dc_check` | tipe: History | kolom: 7
  Tabel histori/arsip yang terdeteksi dari query aktif modul M3.
- `m3_dc_detail` | alias: `inventory_dc_detail` | tipe: Detail | kolom: 25
  Tabel detail untuk item/baris transaksi dc detail.
- `m3_dc_detail_history` | alias: `inventory_dc_detail` | tipe: History | kolom: 25
  Tabel histori/arsip yang terdeteksi dari query aktif modul M3.
- `m3_dc_history` | alias: `inventory_dc` | tipe: History | kolom: 35
  Tabel histori/arsip yang terdeteksi dari query aktif modul M3.

### Kolom Header Penting

- `dcid`: Kolom bisnis dcid.
- `dcgudangasal`: Referensi gudang asal/tujuan transaksi.
- `dcgudangtujuan`: Referensi gudang asal/tujuan transaksi.
- `dcautonotransaksi`: Nomor dokumen/transaksi unik.
- `dcnotransaksi`: Nomor dokumen/transaksi unik.
- `dctgl`: Tanggal transaksi atau tanggal referensi.
- `dckodepa`: Kolom bisnis dckodepa.
- `dcdimintaolehkontak`: Referensi kontak atau contact person.
- `dctgldipakai`: Kolom bisnis dctgldipakai.
- `dcidbarang`: Referensi barang atau nama barang transaksi.
- `dctglnoref`: Kolom bisnis dctglnoref.
- `dcstatusts`: Status proses atau status dokumen.

### Relasi Utama

- `m3_dc_detail` -> `m3_dc`: `m3_dc_detail.iddc = m3_dc.dcid`
- `m3_dc_check` -> `m3_dc`: `m3_dc_check.iddc = m3_dc.dcid`

## RW - Warehouse Transaction RW

Transaksi inventory internal yang muncul di service layer namun minim jejak query aktif.

### Tabel

- `m3_rw` | alias: `inventory_rw` | tipe: Header | kolom: 29
  Transaksi inventory atau gudang untuk rw.

### Kolom Header Penting

- `rwid`: Kolom bisnis rwid.
- `rwautonotransaksi`: Nomor dokumen/transaksi unik.
- `rwnotransaksi`: Nomor dokumen/transaksi unik.
- `rwtgl`: Tanggal transaksi atau tanggal referensi.
- `rwkodepa`: Kolom bisnis rwkodepa.
- `rwbid`: Kolom bisnis rwbid.
- `rwkid`: Kolom bisnis rwkid.
- `rwtglbruto`: Kolom bisnis rwtglbruto.
- `rwtgltara`: Kolom bisnis rwtgltara.
- `rwtglnoref`: Kolom bisnis rwtglnoref.
- `rwstatus`: Status proses atau status dokumen.
- `rwstatussebelumnya`: Status proses atau status dokumen.

## NOTES - Catatan Transaksi Inventory

Catatan teks untuk dokumen inventory.

### Tabel

- `m3_notes` | alias: `inventory_notes` | tipe: Auxiliary | kolom: 0
  Tabel auxiliary yang terdeteksi dari query aktif modul M3.

### Functions

- `m3_notes_v`: Menyediakan listing atau pencarian data dokumen.

## FILES - Lampiran Transaksi Inventory

Lampiran file untuk dokumen inventory.

### Tabel

- `m3_files` | alias: `inventory_files` | tipe: Auxiliary | kolom: 0
  Tabel auxiliary yang terdeteksi dari query aktif modul M3.

### Functions

- `m3_files_v`: Menyediakan listing atau pencarian data dokumen.
