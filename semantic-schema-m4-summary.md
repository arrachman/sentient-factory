# Semantic Schema M4 Summary

Sumber schema: `/home/rania/apps/sentient-factory/apps/myerpplus-db-mapping/db/semantic-schema-m4.json`
Sumber function/query: `/home/rania/apps/sentient-factory/m4-queries.md`, `/home/rania/apps/sentient-factory/client-backend/api-myerpplus/app_code/ws/m0/m0_query.vb`

Total tabel M4 di schema: **35**
Total tabel M4 terdeteksi di query aktif: **75**
Total function M4: **82**
Total polymorphic relationships: **3**
Total join hints: **7**

Dokumen ini merangkum alias, deskripsi, struktur tabel, relasi utama, relasi polymorphic, join hints, dan function semantic utama untuk modul purchasing M4.
Hitungan `history` dan `payment` pada ringkasan modul di bawah sudah diperkaya dari query M4 aktif, sehingga bisa lebih besar daripada jumlah tabel yang muncul langsung di `semantic-schema-m4.json`.

## Join Hints

- `purchase_request_to_order_flow`: Alur permintaan pembelian sampai pembentukan purchase order.
  `m4_pr.prid = m4_pr_detail.idpr`
  `m4_pr_detail.idprdetail = m4_rq_detail.idprdetail`
  `m4_rq.rqid = m4_rq_detail.idrq`
  `m4_rq_detail.idrqdetail = m4_bs_detail.idrqdetail`
  `m4_bs.bsid = m4_bs_detail.idbs`
  `m4_po.poid = m4_po_detail.idpo`
- `purchase_order_receipt_invoice_flow`: Alur PO ke penerimaan barang sampai tagihan pembelian.
  `m4_po.poid = m4_po_detail.idpo`
  `m4_po_detail.idpodetail = m4_grn_detail.idpodetail`
  `m4_grn.grnid = m4_grn_detail.idgrn`
  `m4_grn_detail.idgrndetail = m4_ri_detail.idgrndetail`
  `m4_ri.riid = m4_ri_detail.idri`
- `purchase_return_flow`: Alur retur pembelian dari invoice/receipt ke debit note dan return.
  `m4_ri.riid = m4_ri_detail.idri`
  `m4_ri_detail.idridetail = m4_dnr_detail.idridetail`
  `m4_dnr.dnrid = m4_dnr_detail.iddnr`
  `m4_dnr_detail.iddnrdetail = m4_prt_detail.iddnrdetail`
  `m4_prt.prtid = m4_prt_detail.idprt`
- `purchase_advance_payment_flow`: Relasi uang muka pembelian dan dokumen order/invoice terkait.
  `m4_po.poid = m4_ap.apidpo`
  `m4_ap.apid = m4_ap_pay.idap`
  `m4_ri.riidap = m4_ap.apid`
- `purchase_vendor_payment_flow`: Alur proposal pembayaran vendor dan realisasi pembayaran ke dokumen target.
  `m4_vpp.vppid = m4_vpp_detail.idvpp`
  `m4_vp.vpid = m4_vp_detail.idvp`
  `m4_vpp_detail.idtransaksi = m4_ap.apid when sumber = AP`
  `m4_vpp_detail.idtransaksi = m4_ri.riid when sumber = RI`
  `m4_vpp_detail.idtransaksi = m4_prt.prtid when sumber = PRT`
- `purchase_comparison_flow`: Relasi comparative sheet, request quotation, dan hasil perbandingan vendor.
  `m4_pr.prid = m4_cs.csidpr`
  `m4_cs.csid = m4_cs_detail.idcs`
  `m4_rq.rqid = m4_rq_detail.idrq`
  `m4_rq.idcs = m4_cs.csid`
  `m4_bs_detail.idrqdetail = m4_rq_detail.idrqdetail`
- `purchase_invoice_exchange_flow`: Relasi tukar faktur pembelian ke dokumen sumber pembelian.
  `m4_pie.pieid = m4_pie_detail.idpie`
  `m4_pie.idri = m4_ri.riid`
  `m4_pie_detail.idtransaksi = target purchase document by sumber`

## Polymorphic Relationships

- `m4_vpp_detail.idtransaksi` via `sumber`: Relasi polymorphic ke dokumen purchasing berdasarkan kolom sumber.
  `AP -> m4_ap.apid`
  `RI -> m4_ri.riid`
  `PRT -> m4_prt.prtid`
- `m4_vp_detail.idtransaksi` via `sumber`: Relasi polymorphic ke dokumen purchasing berdasarkan kolom sumber.
  `AP -> m4_ap.apid`
  `RI -> m4_ri.riid`
  `PRT -> m4_prt.prtid`
- `m4_pie_detail.idtransaksi` via `sumber`: Relasi polymorphic ke dokumen purchasing berdasarkan kolom sumber.
  `target dokumen pembelian mengikuti nilai sumber pada transaksi exchange`

## Ringkasan Modul

- **AP**: Advance Purchase / Uang Muka Pembelian | tabel schema: 2 | header: 1 | detail: 0 | history: 2 | payment: 1 | relasi: 2
- **BS**: Bid Selection / Perbandingan Penawaran | tabel schema: 2 | header: 1 | detail: 1 | history: 2 | payment: 0 | relasi: 2
- **CS**: Comparative Sheet / Perbandingan Supplier | tabel schema: 2 | header: 1 | detail: 1 | history: 0 | payment: 0 | relasi: 2
- **DNR**: Debit Note Return / Retur Pembelian Finansial | tabel schema: 2 | header: 1 | detail: 1 | history: 2 | payment: 0 | relasi: 3
- **FILES**: Lampiran Transaksi Purchasing | tabel schema: 0 | header: 0 | detail: 0 | history: 0 | payment: 0 | relasi: 0
- **GRN**: Goods Receipt Note / Penerimaan Barang | tabel schema: 2 | header: 1 | detail: 1 | history: 3 | payment: 0 | relasi: 3
- **IPC**: Incoming Purchase Cost / Biaya Pembelian Masuk | tabel schema: 2 | header: 1 | detail: 1 | history: 0 | payment: 0 | relasi: 2
- **NOTES**: Catatan Transaksi Purchasing | tabel schema: 0 | header: 0 | detail: 0 | history: 0 | payment: 0 | relasi: 0
- **PIE**: Purchase Invoice Exchange / Tukar Faktur Pembelian | tabel schema: 2 | header: 1 | detail: 1 | history: 2 | payment: 0 | relasi: 2
- **PO**: Purchase Order | tabel schema: 2 | header: 1 | detail: 1 | history: 3 | payment: 0 | relasi: 4
- **PP**: Purchase Payment / Pembayaran Pembelian | tabel schema: 2 | header: 1 | detail: 0 | history: 0 | payment: 1 | relasi: 2
- **PR**: Purchase Request | tabel schema: 2 | header: 1 | detail: 1 | history: 3 | payment: 0 | relasi: 1
- **PRINT**: Print Metadata Purchasing | tabel schema: 0 | header: 0 | detail: 0 | history: 0 | payment: 0 | relasi: 0
- **PRT**: Purchase Return | tabel schema: 2 | header: 1 | detail: 1 | history: 2 | payment: 0 | relasi: 3
- **RFQ**: Request For Quotation | tabel schema: 2 | header: 1 | detail: 1 | history: 2 | payment: 0 | relasi: 2
- **RI**: Receive Invoice / Tagihan Pembelian | tabel schema: 3 | header: 1 | detail: 1 | history: 4 | payment: 1 | relasi: 4
- **RQ**: Request Quotation / Permintaan Penawaran | tabel schema: 2 | header: 1 | detail: 1 | history: 2 | payment: 0 | relasi: 3
- **VP**: Vendor Payment | tabel schema: 3 | header: 1 | detail: 1 | history: 3 | payment: 1 | relasi: 2
- **VPP**: Vendor Payment Proposal | tabel schema: 3 | header: 1 | detail: 1 | history: 3 | payment: 1 | relasi: 2

## AP - Advance Purchase / Uang Muka Pembelian

### Tabel

- `m4_ap` | alias: `purchase_ap` | tipe: Header | kolom: 46
  Transaksi purchasing atau hutang untuk ap.
- `m4_ap_history` | alias: `inferred_from_query` | tipe: History | kolom: tidak tersedia di schema
  Tabel histori/arsip yang terdeteksi dari query aktif modul ini.
- `m4_ap_pay` | alias: `purchase_ap_pay` | tipe: Payment/Allocation | kolom: 16
  Data pembayaran terkait ap pay.
- `m4_ap_pay_history` | alias: `inferred_from_query` | tipe: History | kolom: tidak tersedia di schema
  Tabel histori/arsip yang terdeteksi dari query aktif modul ini.

### Tabel Operasional Terdeteksi

- `m4_ap`
- `m4_ap_history`
- `m4_ap_pay`
- `m4_ap_pay_history`
- `m4_po`
- `m4_ri`
- `m4_vp`
- `m4_vpp`

### Kolom Header Penting

- `apid`: Kolom bisnis apid.
- `apcabang`: Kolom bisnis apcabang.
- `aplokasi`: Kolom bisnis aplokasi.
- `apsumber`: Kolom bisnis apsumber.
- `apautonotransaksi`: Nomor dokumen/transaksi unik.
- `apnotransaksi`: Nomor dokumen/transaksi unik.
- `aptgl`: Tanggal transaksi atau tanggal referensi.
- `apkontak`: Referensi kontak atau contact person.
- `apkontakperson`: Referensi kontak atau contact person.
- `aptgljatuhtempo`: Kolom bisnis aptgljatuhtempo.
- `aptglnoref`: Kolom bisnis aptglnoref.
- `apmatauang`: Informasi mata uang dan kurs transaksi.

### Relasi Utama

- `m4_ap_pay` -> `m4_ap`: `m4_ap_pay.idap = m4_ap.apid`
- `m4_ap` -> `m4_po`: `m4_ap.apidpo = m4_po.poid`

### Functions

- `m4_ap_getdata`: Mengambil data header dan detail untuk satu dokumen transaksi.
- `m4_ap_getdata_history`: Mengambil riwayat perubahan header/detail untuk satu dokumen transaksi.
- `m4_ap_terkait`: Mengambil keterkaitan dokumen dengan dokumen lain di alur purchasing.
- `m4_ap_v`: Menyediakan listing atau pencarian data dokumen.
- `m4_ap_v_history`: Menyediakan listing riwayat perubahan dokumen.

## BS - Bid Selection / Perbandingan Penawaran

### Tabel

- `m4_bs` | alias: `purchase_bs` | tipe: Header | kolom: 38
  Transaksi purchasing atau hutang untuk bs.
- `m4_bs_detail` | alias: `purchase_bs_detail` | tipe: Detail | kolom: 7
  Tabel detail untuk item/baris transaksi bs detail.
- `m4_bs_detail_history` | alias: `inferred_from_query` | tipe: History | kolom: tidak tersedia di schema
  Tabel histori/arsip yang terdeteksi dari query aktif modul ini.
- `m4_bs_history` | alias: `inferred_from_query` | tipe: History | kolom: tidak tersedia di schema
  Tabel histori/arsip yang terdeteksi dari query aktif modul ini.

### Tabel Operasional Terdeteksi

- `m4_bs`
- `m4_bs_detail`
- `m4_bs_detail_history`
- `m4_bs_history`
- `m4_po`
- `m4_rq`
- `m4_rq_detail`

### Kolom Header Penting

- `bsid`: Kolom bisnis bsid.
- `bscabang`: Kolom bisnis bscabang.
- `bslokasi`: Kolom bisnis bslokasi.
- `bsgudang`: Referensi gudang asal/tujuan transaksi.
- `bssumber`: Kolom bisnis bssumber.
- `bsautonotransaksi`: Nomor dokumen/transaksi unik.
- `bsnotransaksi`: Nomor dokumen/transaksi unik.
- `bstgl`: Tanggal transaksi atau tanggal referensi.
- `bsbagianperbandingankontak`: Referensi kontak atau contact person.
- `bstglnoref`: Kolom bisnis bstglnoref.
- `bstglpenutupan`: Kolom bisnis bstglpenutupan.
- `bsmatauang`: Informasi mata uang dan kurs transaksi.

### Relasi Utama

- `m4_bs_detail` -> `m4_bs`: `m4_bs_detail.idbs = m4_bs.bsid`
- `m4_bs_detail` -> `m4_rq_detail`: `m4_bs_detail.idrqdetail = m4_rq_detail.idrqdetail`

### Functions

- `m4_bs_getdata`: Mengambil data header dan detail untuk satu dokumen transaksi.
- `m4_bs_getdata_history`: Mengambil riwayat perubahan header/detail untuk satu dokumen transaksi.
- `m4_bs_terkait`: Mengambil keterkaitan dokumen dengan dokumen lain di alur purchasing.
- `m4_bs_v`: Menyediakan listing atau pencarian data dokumen.
- `m4_bs_v_history`: Menyediakan listing riwayat perubahan dokumen.

## CS - Comparative Sheet / Perbandingan Supplier

### Tabel

- `m4_cs` | alias: `purchase_cs` | tipe: Header | kolom: 60
  Transaksi purchasing atau hutang untuk cs.
- `m4_cs_detail` | alias: `purchase_cs_detail` | tipe: Detail | kolom: 44
  Tabel detail untuk item/baris transaksi cs detail.

### Kolom Header Penting

- `csid`: Kolom bisnis csid.
- `cscabang`: Kolom bisnis cscabang.
- `cslokasi`: Kolom bisnis cslokasi.
- `csgudang`: Referensi gudang asal/tujuan transaksi.
- `cssumber`: Kolom bisnis cssumber.
- `csautonotransaksi`: Nomor dokumen/transaksi unik.
- `csnotransaksi`: Nomor dokumen/transaksi unik.
- `cstgl`: Tanggal transaksi atau tanggal referensi.
- `cssupplier`: Referensi supplier.
- `cssupplierkontak`: Referensi supplier.
- `cstgldipenuhi`: Kolom bisnis cstgldipenuhi.
- `cstgljatuhtempo`: Kolom bisnis cstgljatuhtempo.

### Relasi Utama

- `m4_cs_detail` -> `m4_cs`: `m4_cs_detail.idcs = m4_cs.csid`
- `m4_cs` -> `m4_pr`: `m4_cs.csidpr = m4_pr.prid`

## DNR - Debit Note Return / Retur Pembelian Finansial

### Tabel

- `m4_dnr` | alias: `purchase_dnr` | tipe: Header | kolom: 70
  Transaksi purchasing atau hutang untuk dnr.
- `m4_dnr_detail` | alias: `purchase_dnr_detail` | tipe: Detail | kolom: 51
  Tabel detail untuk item/baris transaksi dnr detail.
- `m4_dnr_detail_history` | alias: `inferred_from_query` | tipe: History | kolom: tidak tersedia di schema
  Tabel histori/arsip yang terdeteksi dari query aktif modul ini.
- `m4_dnr_history` | alias: `inferred_from_query` | tipe: History | kolom: tidak tersedia di schema
  Tabel histori/arsip yang terdeteksi dari query aktif modul ini.

### Tabel Operasional Terdeteksi

- `m4_dnr`
- `m4_dnr_detail`
- `m4_dnr_detail_history`
- `m4_dnr_history`
- `m4_grn`
- `m4_grn_detail`
- `m4_po`
- `m4_pr`
- `m4_prt`
- `m4_ri`
- `m4_ri_detail`
- `m4_rq`

### Kolom Header Penting

- `dnrid`: Kolom bisnis dnrid.
- `dnrcabang`: Kolom bisnis dnrcabang.
- `dnrlokasi`: Kolom bisnis dnrlokasi.
- `dnrgudang`: Referensi gudang asal/tujuan transaksi.
- `dnrsumber`: Kolom bisnis dnrsumber.
- `dnrautonotransaksi`: Nomor dokumen/transaksi unik.
- `dnrnotransaksi`: Nomor dokumen/transaksi unik.
- `dnrtgl`: Tanggal transaksi atau tanggal referensi.
- `dnrsupplier`: Referensi supplier.
- `dnrsupplierkontak`: Referensi supplier.
- `dnrtgljatuhtempo`: Kolom bisnis dnrtgljatuhtempo.
- `dnrtglnoref`: Kolom bisnis dnrtglnoref.

### Relasi Utama

- `m4_dnr_detail` -> `m4_dnr`: `m4_dnr_detail.iddnr = m4_dnr.dnrid`
- `m4_dnr` -> `m4_ri`: `m4_dnr.idridri = m4_ri.riid`
- `m4_dnr_detail` -> `m4_ri_detail`: `m4_dnr_detail.idridetail = m4_ri_detail.idridetail`

### Functions

- `m4_dnr_detail_cd`: Menyediakan daftar referensi / lookup untuk kebutuhan caridata.
- `m4_dnr_detail_v`: Menyediakan listing detail baris transaksi.
- `m4_dnr_getdata`: Mengambil data header dan detail untuk satu dokumen transaksi.
- `m4_dnr_getdata_history`: Mengambil riwayat perubahan header/detail untuk satu dokumen transaksi.
- `m4_dnr_terkait`: Mengambil keterkaitan dokumen dengan dokumen lain di alur purchasing.
- `m4_dnr_v`: Menyediakan listing atau pencarian data dokumen.
- `m4_dnr_v_history`: Menyediakan listing riwayat perubahan dokumen.

## FILES - Lampiran Transaksi Purchasing

### Tabel

- `m4_files` | alias: `inferred_from_query` | tipe: Header | kolom: tidak tersedia di schema
  Tabel operasional modul yang terdeteksi dari query aktif modul ini.

### Tabel Operasional Terdeteksi

- `m4_files`

### Functions

- `m4_files_v`: Menyediakan listing atau pencarian data dokumen.

## GRN - Goods Receipt Note / Penerimaan Barang

### Tabel

- `m4_grn` | alias: `penerimaan_barang` | tipe: Header | kolom: 66
  Header penerimaan barang dari supplier atau dari order pembelian. Menjadi dasar update stok dan verifikasi barang datang.
- `m4_grn_cost` | alias: `inferred_from_query` | tipe: Cost | kolom: tidak tersedia di schema
  Tabel komponen biaya yang terdeteksi dari query aktif modul ini.
- `m4_grn_cost_history` | alias: `inferred_from_query` | tipe: History | kolom: tidak tersedia di schema
  Tabel histori/arsip yang terdeteksi dari query aktif modul ini.
- `m4_grn_detail` | alias: `purchase_grn_detail` | tipe: Detail | kolom: 49
  Tabel detail untuk item/baris transaksi grn detail.
- `m4_grn_detail_history` | alias: `inferred_from_query` | tipe: History | kolom: tidak tersedia di schema
  Tabel histori/arsip yang terdeteksi dari query aktif modul ini.
- `m4_grn_history` | alias: `inferred_from_query` | tipe: History | kolom: tidak tersedia di schema
  Tabel histori/arsip yang terdeteksi dari query aktif modul ini.

### Tabel Operasional Terdeteksi

- `m4_bs`
- `m4_cs`
- `m4_grn`
- `m4_grn_cost`
- `m4_grn_cost_history`
- `m4_grn_detail`
- `m4_grn_detail_history`
- `m4_grn_history`
- `m4_ipc`
- `m4_ipc_detail`
- `m4_po`
- `m4_po_detail`
- `m4_pr`
- `m4_ri`
- `m4_rq`

### Kolom Header Penting

- `grnid`: Primary key baris data.
- `grncabang`: Kolom bisnis grncabang.
- `grnlokasi`: Kolom bisnis grnlokasi.
- `grngudang`: Referensi gudang asal/tujuan transaksi.
- `grnsumber`: Kolom bisnis grnsumber.
- `grnautonotransaksi`: Nomor dokumen/transaksi unik.
- `grnnotransaksi`: Nomor dokumen/transaksi unik.
- `grntgl`: Tanggal transaksi atau tanggal referensi.
- `grnsupplier`: Referensi supplier.
- `grnsupplierkontak`: Referensi supplier.
- `grntgljatuhtempo`: Kolom bisnis grntgljatuhtempo.
- `grntglnoref`: Kolom bisnis grntglnoref.

### Relasi Utama

- `m4_grn_detail` -> `m4_grn`: `m4_grn_detail.idgrn = m4_grn.grnid`
- `m4_grn` -> `m4_po`: `m4_grn.idpo = m4_po.poid`
- `m4_grn_detail` -> `m4_po_detail`: `m4_grn_detail.idpodetail = m4_po_detail.idpodetail`

### Functions

- `m4_grn_detail_cd`: Menyediakan daftar referensi / lookup untuk kebutuhan caridata.
- `m4_grn_detail_v`: Menyediakan listing detail baris transaksi.
- `m4_grn_getdata`: Mengambil data header dan detail untuk satu dokumen transaksi.
- `m4_grn_getdata_history`: Mengambil riwayat perubahan header/detail untuk satu dokumen transaksi.
- `m4_grn_terkait`: Mengambil keterkaitan dokumen dengan dokumen lain di alur purchasing.
- `m4_grn_v`: Menyediakan listing atau pencarian data dokumen.
- `m4_grn_v_history`: Menyediakan listing riwayat perubahan dokumen.

## IPC - Incoming Purchase Cost / Biaya Pembelian Masuk

### Tabel

- `m4_ipc` | alias: `purchase_ipc` | tipe: Header | kolom: 65
  Transaksi purchasing atau hutang untuk ipc.
- `m4_ipc_detail` | alias: `purchase_ipc_detail` | tipe: Detail | kolom: 46
  Tabel detail untuk item/baris transaksi ipc detail.

### Kolom Header Penting

- `ipcid`: Kolom bisnis ipcid.
- `ipccabang`: Kolom bisnis ipccabang.
- `ipclokasi`: Kolom bisnis ipclokasi.
- `ipcgudang`: Referensi gudang asal/tujuan transaksi.
- `ipcsumber`: Kolom bisnis ipcsumber.
- `ipcautonotransaksi`: Nomor dokumen/transaksi unik.
- `ipcnotransaksi`: Nomor dokumen/transaksi unik.
- `ipctgl`: Tanggal transaksi atau tanggal referensi.
- `ipcsupplier`: Referensi supplier.
- `ipcsupplierkontak`: Referensi supplier.
- `ipctgldipenuhi`: Kolom bisnis ipctgldipenuhi.
- `ipctgljatuhtempo`: Kolom bisnis ipctgljatuhtempo.

### Relasi Utama

- `m4_ipc_detail` -> `m4_ipc`: `m4_ipc_detail.idipc = m4_ipc.ipcid`
- `m4_ipc` -> `m4_po`: `m4_ipc.idpo = m4_po.poid`

## NOTES - Catatan Transaksi Purchasing

### Tabel

- `m4_notes` | alias: `inferred_from_query` | tipe: Header | kolom: tidak tersedia di schema
  Tabel operasional modul yang terdeteksi dari query aktif modul ini.

### Tabel Operasional Terdeteksi

- `m4_notes`

### Functions

- `m4_notes_v`: Menyediakan listing atau pencarian data dokumen.

## PIE - Purchase Invoice Exchange / Tukar Faktur Pembelian

### Tabel

- `m4_pie` | alias: `purchase_pie` | tipe: Header | kolom: 27
  Transaksi purchasing atau hutang untuk pie.
- `m4_pie_detail` | alias: `purchase_pie_detail` | tipe: Detail | kolom: 7
  Tabel detail untuk item/baris transaksi pie detail.
- `m4_pie_detail_history` | alias: `inferred_from_query` | tipe: History | kolom: tidak tersedia di schema
  Tabel histori/arsip yang terdeteksi dari query aktif modul ini.
- `m4_pie_history` | alias: `inferred_from_query` | tipe: History | kolom: tidak tersedia di schema
  Tabel histori/arsip yang terdeteksi dari query aktif modul ini.

### Tabel Operasional Terdeteksi

- `m4_pie`
- `m4_pie_detail`
- `m4_pie_detail_history`
- `m4_pie_history`
- `m4_prt`
- `m4_ri`

### Kolom Header Penting

- `pieid`: Kolom bisnis pieid.
- `piecabang`: Kolom bisnis piecabang.
- `pielokasi`: Kolom bisnis pielokasi.
- `piesumber`: Kolom bisnis piesumber.
- `pieautonotransaksi`: Nomor dokumen/transaksi unik.
- `pienotransaksi`: Nomor dokumen/transaksi unik.
- `pietgl`: Tanggal transaksi atau tanggal referensi.
- `piekontak`: Referensi kontak atau contact person.
- `piekontakperson`: Referensi kontak atau contact person.
- `pietglnoref`: Kolom bisnis pietglnoref.
- `piestatus`: Status proses atau status dokumen.
- `piestatussebelumnya`: Status proses atau status dokumen.

### Relasi Utama

- `m4_pie_detail` -> `m4_pie`: `m4_pie_detail.idpie = m4_pie.pieid`
- `m4_pie` -> `m4_ri`: `m4_pie.idri = m4_ri.riid`

## PO - Purchase Order

### Tabel

- `m4_po` | alias: `order_pembelian` | tipe: Header | kolom: 65
  Header order pembelian ke supplier. Menjadi dasar proses penerimaan barang, invoice pembelian, dan kontrol outstanding pembelian.
- `m4_po_cost` | alias: `inferred_from_query` | tipe: Cost | kolom: tidak tersedia di schema
  Tabel komponen biaya yang terdeteksi dari query aktif modul ini.
- `m4_po_cost_history` | alias: `inferred_from_query` | tipe: History | kolom: tidak tersedia di schema
  Tabel histori/arsip yang terdeteksi dari query aktif modul ini.
- `m4_po_detail` | alias: `order_pembelian_detail` | tipe: Detail | kolom: 46
  Detail item untuk order pembelian. Menyimpan barang, qty, harga, diskon, pajak, dan referensi proses lanjut pembelian.
- `m4_po_detail_history` | alias: `inferred_from_query` | tipe: History | kolom: tidak tersedia di schema
  Tabel histori/arsip yang terdeteksi dari query aktif modul ini.
- `m4_po_history` | alias: `inferred_from_query` | tipe: History | kolom: tidak tersedia di schema
  Tabel histori/arsip yang terdeteksi dari query aktif modul ini.
- `m4_po_trans` | alias: `inferred_from_query` | tipe: Transaction Link | kolom: tidak tersedia di schema
  Tabel relasi/transaksi tambahan yang terdeteksi dari query aktif modul ini.

### Tabel Operasional Terdeteksi

- `m4_ap`
- `m4_bs`
- `m4_bs_detail`
- `m4_cs`
- `m4_cs_detail`
- `m4_dnr`
- `m4_grn`
- `m4_po`
- `m4_po_cost`
- `m4_po_cost_history`
- `m4_po_detail`
- `m4_po_detail_history`
- `m4_po_history`
- `m4_po_trans`
- `m4_pr`
- `m4_pr_detail`
- `m4_prt`
- `m4_ri`
- `m4_rq`
- `m4_rq_detail`

### Kolom Header Penting

- `poid`: Primary key baris data.
- `pocabang`: Kolom bisnis pocabang.
- `polokasi`: Kolom bisnis polokasi.
- `pogudang`: Referensi gudang asal/tujuan transaksi.
- `posumber`: Kolom bisnis posumber.
- `poautonotransaksi`: Nomor dokumen/transaksi unik.
- `ponotransaksi`: Nomor dokumen/transaksi unik.
- `potgl`: Tanggal transaksi atau tanggal referensi.
- `posupplier`: Referensi supplier.
- `posupplierkontak`: Referensi supplier.
- `potgldipenuhi`: Kolom bisnis potgldipenuhi.
- `potgljatuhtempo`: Kolom bisnis potgljatuhtempo.

### Relasi Utama

- `m4_po_detail` -> `m4_po`: `m4_po_detail.idpo = m4_po.poid`
- `m4_po` -> `m4_pr`: `m4_po.idpr = m4_pr.prid`
- `m4_po` -> `m4_rq`: `m4_po.idrq = m4_rq.rqid`
- `m4_po` -> `m4_bs`: `m4_po.idbs = m4_bs.bsid`

### Functions

- `m4_po_cd`: Menyediakan daftar referensi / lookup untuk kebutuhan caridata.
- `m4_po_detail_cd`: Menyediakan daftar referensi / lookup untuk kebutuhan caridata.
- `m4_po_detail_v`: Menyediakan listing detail baris transaksi.
- `m4_po_getdata`: Mengambil data header dan detail untuk satu dokumen transaksi.
- `m4_po_getdata_history`: Mengambil riwayat perubahan header/detail untuk satu dokumen transaksi.
- `m4_po_terkait`: Mengambil keterkaitan dokumen dengan dokumen lain di alur purchasing.
- `m4_po_v`: Menyediakan listing atau pencarian data dokumen.
- `m4_po_v_history`: Menyediakan listing riwayat perubahan dokumen.

## PP - Purchase Payment / Pembayaran Pembelian

### Tabel

- `m4_pp` | alias: `purchase_pp` | tipe: Header | kolom: 45
  Transaksi purchasing atau hutang untuk pp.
- `m4_pp_pay` | alias: `purchase_pp_pay` | tipe: Payment/Allocation | kolom: 16
  Data pembayaran terkait pp pay.

### Tabel Operasional Terdeteksi

- `m4_pp`
- `m4_pp_pay`
- `m4_ri`
- `m4_vp`
- `m4_vpp`

### Kolom Header Penting

- `ppid`: Kolom bisnis ppid.
- `ppcabang`: Kolom bisnis ppcabang.
- `pplokasi`: Kolom bisnis pplokasi.
- `ppsumber`: Kolom bisnis ppsumber.
- `ppautonotransaksi`: Nomor dokumen/transaksi unik.
- `ppnotransaksi`: Nomor dokumen/transaksi unik.
- `pptgl`: Tanggal transaksi atau tanggal referensi.
- `ppkontak`: Referensi kontak atau contact person.
- `ppkontakperson`: Referensi kontak atau contact person.
- `pptgljatuhtempo`: Kolom bisnis pptgljatuhtempo.
- `pptglnoref`: Kolom bisnis pptglnoref.
- `ppmatauang`: Informasi mata uang dan kurs transaksi.

### Relasi Utama

- `m4_pp_pay` -> `m4_pp`: `m4_pp_pay.idpp = m4_pp.ppid`
- `m4_pp` -> `m4_ri`: `m4_pp.idri = m4_ri.riid`

### Functions

- `m4_pp_getdata`: Mengambil data header dan detail untuk satu dokumen transaksi.
- `m4_pp_terkait`: Mengambil keterkaitan dokumen dengan dokumen lain di alur purchasing.
- `m4_pp_v`: Menyediakan listing atau pencarian data dokumen.

## PR - Purchase Request

### Tabel

- `m4_pr` | alias: `purchase_pr` | tipe: Header | kolom: 56
  Transaksi purchasing atau hutang untuk pr.
- `m4_pr_detail` | alias: `purchase_pr_detail` | tipe: Detail | kolom: 53
  Tabel detail untuk item/baris transaksi pr detail.
- `m4_pr_detail_history` | alias: `inferred_from_query` | tipe: History | kolom: tidak tersedia di schema
  Tabel histori/arsip yang terdeteksi dari query aktif modul ini.
- `m4_pr_history` | alias: `inferred_from_query` | tipe: History | kolom: tidak tersedia di schema
  Tabel histori/arsip yang terdeteksi dari query aktif modul ini.
- `m4_pr_trans` | alias: `inferred_from_query` | tipe: Transaction Link | kolom: tidak tersedia di schema
  Tabel relasi/transaksi tambahan yang terdeteksi dari query aktif modul ini.
- `m4_pr_trans_history` | alias: `inferred_from_query` | tipe: History | kolom: tidak tersedia di schema
  Tabel histori/arsip yang terdeteksi dari query aktif modul ini.

### Tabel Operasional Terdeteksi

- `m4_dnr`
- `m4_grn`
- `m4_po`
- `m4_pr`
- `m4_pr_detail`
- `m4_pr_detail_history`
- `m4_pr_history`
- `m4_pr_trans`
- `m4_pr_trans_history`
- `m4_prt`
- `m4_ri`
- `m4_rq`

### Kolom Header Penting

- `prid`: Kolom bisnis prid.
- `prcabang`: Kolom bisnis prcabang.
- `prlokasi`: Kolom bisnis prlokasi.
- `prgudang`: Referensi gudang asal/tujuan transaksi.
- `prsumber`: Kolom bisnis prsumber.
- `prautonotransaksi`: Nomor dokumen/transaksi unik.
- `prnotransaksi`: Nomor dokumen/transaksi unik.
- `prtgl`: Tanggal transaksi atau tanggal referensi.
- `prdimintaolehkontak`: Referensi kontak atau contact person.
- `prtgldipakai`: Kolom bisnis prtgldipakai.
- `prtgljatuhtempo`: Kolom bisnis prtgljatuhtempo.
- `prtglnoref`: Kolom bisnis prtglnoref.

### Relasi Utama

- `m4_pr_detail` -> `m4_pr`: `m4_pr_detail.idpr = m4_pr.prid`

### Functions

- `m4_pr_detail_cd`: Menyediakan daftar referensi / lookup untuk kebutuhan caridata.
- `m4_pr_detail_v`: Menyediakan listing detail baris transaksi.
- `m4_pr_getdata`: Mengambil data header dan detail untuk satu dokumen transaksi.
- `m4_pr_getdata_history`: Mengambil riwayat perubahan header/detail untuk satu dokumen transaksi.
- `m4_pr_terkait`: Mengambil keterkaitan dokumen dengan dokumen lain di alur purchasing.
- `m4_pr_v`: Menyediakan listing atau pencarian data dokumen.
- `m4_pr_v_history`: Menyediakan listing riwayat perubahan dokumen.

## PRINT - Print Metadata Purchasing

### Tabel


### Tabel Operasional Terdeteksi

- `m4_ap`
- `m4_bs`
- `m4_cs`
- `m4_dnr`
- `m4_grn`
- `m4_ipc`
- `m4_po`
- `m4_pr`
- `m4_prt`
- `m4_ri`
- `m4_rq`
- `m4_vp`
- `m4_vpp`

## PRT - Purchase Return

### Tabel

- `m4_prt` | alias: `purchase_prt` | tipe: Header | kolom: 76
  Transaksi purchasing atau hutang untuk prt.
- `m4_prt_detail` | alias: `purchase_prt_detail` | tipe: Detail | kolom: 48
  Tabel detail untuk item/baris transaksi prt detail.
- `m4_prt_detail_history` | alias: `inferred_from_query` | tipe: History | kolom: tidak tersedia di schema
  Tabel histori/arsip yang terdeteksi dari query aktif modul ini.
- `m4_prt_history` | alias: `inferred_from_query` | tipe: History | kolom: tidak tersedia di schema
  Tabel histori/arsip yang terdeteksi dari query aktif modul ini.

### Tabel Operasional Terdeteksi

- `m4_dnr`
- `m4_dnr_detail`
- `m4_grn`
- `m4_po`
- `m4_pr`
- `m4_prt`
- `m4_prt_detail`
- `m4_prt_detail_history`
- `m4_prt_history`
- `m4_ri`
- `m4_ri_detail`
- `m4_rq`
- `m4_vp`
- `m4_vpp`

### Kolom Header Penting

- `prtid`: Kolom bisnis prtid.
- `prtcabang`: Kolom bisnis prtcabang.
- `prtlokasi`: Kolom bisnis prtlokasi.
- `prtgudang`: Referensi gudang asal/tujuan transaksi.
- `prtsumber`: Kolom bisnis prtsumber.
- `prtautonotransaksi`: Nomor dokumen/transaksi unik.
- `prtnotransaksi`: Nomor dokumen/transaksi unik.
- `prttgl`: Tanggal transaksi atau tanggal referensi.
- `prtsupplier`: Referensi supplier.
- `prtsupplierkontak`: Referensi supplier.
- `prttgljatuhtempo`: Kolom bisnis prttgljatuhtempo.
- `prttglnoref`: Kolom bisnis prttglnoref.

### Relasi Utama

- `m4_prt_detail` -> `m4_prt`: `m4_prt_detail.idprt = m4_prt.prtid`
- `m4_prt` -> `m4_dnr`: `m4_prt.iddnr = m4_dnr.dnrid`
- `m4_prt` -> `m4_ri`: `m4_prt.idri = m4_ri.riid`

### Functions

- `m4_prt_getdata`: Mengambil data header dan detail untuk satu dokumen transaksi.
- `m4_prt_getdata_history`: Mengambil riwayat perubahan header/detail untuk satu dokumen transaksi.
- `m4_prt_terkait`: Mengambil keterkaitan dokumen dengan dokumen lain di alur purchasing.
- `m4_prt_v`: Menyediakan listing atau pencarian data dokumen.
- `m4_prt_v_history`: Menyediakan listing riwayat perubahan dokumen.

## RFQ - Request For Quotation

### Tabel

- `m4_rfq` | alias: `purchase_rfq` | tipe: Header | kolom: 29
  Transaksi purchasing atau hutang untuk rfq.
- `m4_rfq_detail` | alias: `purchase_rfq_detail` | tipe: Detail | kolom: 7
  Tabel detail untuk item/baris transaksi rfq detail.
- `m4_rfq_detail_history` | alias: `inferred_from_query` | tipe: History | kolom: tidak tersedia di schema
  Tabel histori/arsip yang terdeteksi dari query aktif modul ini.
- `m4_rfq_history` | alias: `inferred_from_query` | tipe: History | kolom: tidak tersedia di schema
  Tabel histori/arsip yang terdeteksi dari query aktif modul ini.

### Tabel Operasional Terdeteksi

- `m4_cs`
- `m4_cs_detail`
- `m4_pr`
- `m4_pr_detail`
- `m4_rfq`
- `m4_rfq_detail`
- `m4_rfq_detail_history`
- `m4_rfq_history`

### Kolom Header Penting

- `rfqid`: Kolom bisnis rfqid.
- `rfqcabang`: Kolom bisnis rfqcabang.
- `rfqlokasi`: Kolom bisnis rfqlokasi.
- `rfqsumber`: Kolom bisnis rfqsumber.
- `rfqautonotransaksi`: Nomor dokumen/transaksi unik.
- `rfqnotransaksi`: Nomor dokumen/transaksi unik.
- `rfqtgl`: Tanggal transaksi atau tanggal referensi.
- `rfqkontakperson`: Referensi kontak atau contact person.
- `rfqtglnoref`: Kolom bisnis rfqtglnoref.
- `rfqstatus`: Status proses atau status dokumen.
- `rfqstatussebelumnya`: Status proses atau status dokumen.
- `rfqpostingtgl`: Tanggal transaksi atau tanggal referensi.

### Relasi Utama

- `m4_rfq_detail` -> `m4_rfq`: `m4_rfq_detail.idrfq = m4_rfq.rfqid`
- `m4_rfq` -> `m4_pr`: `m4_rfq.idpr = m4_pr.prid`

## RI - Receive Invoice / Tagihan Pembelian

### Tabel

- `m4_ri` | alias: `invoice_pembelian` | tipe: Header | kolom: 77
  Header invoice pembelian dari supplier. Dipakai untuk pencatatan hutang usaha dan dasar pembayaran hutang.
- `m4_ri_cost` | alias: `inferred_from_query` | tipe: Cost | kolom: tidak tersedia di schema
  Tabel komponen biaya yang terdeteksi dari query aktif modul ini.
- `m4_ri_cost_history` | alias: `inferred_from_query` | tipe: History | kolom: tidak tersedia di schema
  Tabel histori/arsip yang terdeteksi dari query aktif modul ini.
- `m4_ri_detail` | alias: `purchase_ri_detail` | tipe: Detail | kolom: 46
  Tabel detail untuk item/baris transaksi ri detail.
- `m4_ri_detail_history` | alias: `inferred_from_query` | tipe: History | kolom: tidak tersedia di schema
  Tabel histori/arsip yang terdeteksi dari query aktif modul ini.
- `m4_ri_history` | alias: `inferred_from_query` | tipe: History | kolom: tidak tersedia di schema
  Tabel histori/arsip yang terdeteksi dari query aktif modul ini.
- `m4_ri_pay` | alias: `purchase_ri_pay` | tipe: Payment/Allocation | kolom: 20
  Data pembayaran terkait ri pay.
- `m4_ri_pay_history` | alias: `inferred_from_query` | tipe: History | kolom: tidak tersedia di schema
  Tabel histori/arsip yang terdeteksi dari query aktif modul ini.

### Tabel Operasional Terdeteksi

- `m4_ap`
- `m4_dnr`
- `m4_grn`
- `m4_grn_detail`
- `m4_ipc`
- `m4_ipc_detail`
- `m4_po`
- `m4_po_detail`
- `m4_pr`
- `m4_prt`
- `m4_ri`
- `m4_ri_cost`
- `m4_ri_cost_history`
- `m4_ri_detail`
- `m4_ri_detail_history`
- `m4_ri_history`
- `m4_ri_pay`
- `m4_ri_pay_history`
- `m4_rq`
- `m4_vp`
- `m4_vpp`

### Kolom Header Penting

- `riid`: Primary key baris data.
- `ricabang`: Kolom bisnis ricabang.
- `rilokasi`: Kolom bisnis rilokasi.
- `rigudang`: Referensi gudang asal/tujuan transaksi.
- `risumber`: Kolom bisnis risumber.
- `riautonotransaksi`: Nomor dokumen/transaksi unik.
- `rinotransaksi`: Nomor dokumen/transaksi unik.
- `ritgl`: Tanggal transaksi atau tanggal referensi.
- `risupplier`: Referensi supplier.
- `risupplierkontak`: Referensi supplier.
- `ritgljatuhtempo`: Kolom bisnis ritgljatuhtempo.
- `ritglnoref`: Kolom bisnis ritglnoref.

### Relasi Utama

- `m4_ri_detail` -> `m4_ri`: `m4_ri_detail.idri = m4_ri.riid`
- `m4_ri` -> `m4_po`: `m4_ri.idpo = m4_po.poid`
- `m4_ri` -> `m4_grn`: `m4_ri.idgrn = m4_grn.grnid`
- `m4_ri` -> `m4_ap`: `m4_ri.idap = m4_ap.apid`

### Functions

- `m4_ri_cd`: Menyediakan daftar referensi / lookup untuk kebutuhan caridata.
- `m4_ri_detail_cd`: Menyediakan daftar referensi / lookup untuk kebutuhan caridata.
- `m4_ri_detail_v`: Menyediakan listing detail baris transaksi.
- `m4_ri_getdata`: Mengambil data header dan detail untuk satu dokumen transaksi.
- `m4_ri_getdata_history`: Mengambil riwayat perubahan header/detail untuk satu dokumen transaksi.
- `m4_ri_terkait`: Mengambil keterkaitan dokumen dengan dokumen lain di alur purchasing.
- `m4_ri_v`: Menyediakan listing atau pencarian data dokumen.
- `m4_ri_v_history`: Menyediakan listing riwayat perubahan dokumen.

## RQ - Request Quotation / Permintaan Penawaran

### Tabel

- `m4_rq` | alias: `purchase_rq` | tipe: Header | kolom: 60
  Transaksi purchasing atau hutang untuk rq.
- `m4_rq_detail` | alias: `purchase_rq_detail` | tipe: Detail | kolom: 45
  Tabel detail untuk item/baris transaksi rq detail.
- `m4_rq_detail_history` | alias: `inferred_from_query` | tipe: History | kolom: tidak tersedia di schema
  Tabel histori/arsip yang terdeteksi dari query aktif modul ini.
- `m4_rq_history` | alias: `inferred_from_query` | tipe: History | kolom: tidak tersedia di schema
  Tabel histori/arsip yang terdeteksi dari query aktif modul ini.

### Tabel Operasional Terdeteksi

- `m4_cs`
- `m4_cs_detail`
- `m4_dnr`
- `m4_grn`
- `m4_po`
- `m4_pr`
- `m4_pr_detail`
- `m4_prt`
- `m4_ri`
- `m4_rq`
- `m4_rq_detail`
- `m4_rq_detail_history`
- `m4_rq_history`

### Kolom Header Penting

- `rqid`: Kolom bisnis rqid.
- `rqcabang`: Kolom bisnis rqcabang.
- `rqlokasi`: Kolom bisnis rqlokasi.
- `rqgudang`: Referensi gudang asal/tujuan transaksi.
- `rqsumber`: Kolom bisnis rqsumber.
- `rqautonotransaksi`: Nomor dokumen/transaksi unik.
- `rqnotransaksi`: Nomor dokumen/transaksi unik.
- `rqtgl`: Tanggal transaksi atau tanggal referensi.
- `rqsupplier`: Referensi supplier.
- `rqsupplierkontak`: Referensi supplier.
- `rqtgldipenuhi`: Kolom bisnis rqtgldipenuhi.
- `rqtgljatuhtempo`: Kolom bisnis rqtgljatuhtempo.

### Relasi Utama

- `m4_rq_detail` -> `m4_rq`: `m4_rq_detail.idrq = m4_rq.rqid`
- `m4_rq` -> `m4_pr`: `m4_rq.idpr = m4_pr.prid`
- `m4_rq` -> `m4_cs`: `m4_rq.idcs = m4_cs.csid`

### Functions

- `m4_rq_cd`: Menyediakan daftar referensi / lookup untuk kebutuhan caridata.
- `m4_rq_detail_cd`: Menyediakan daftar referensi / lookup untuk kebutuhan caridata.
- `m4_rq_detail_v`: Menyediakan listing detail baris transaksi.
- `m4_rq_getdata`: Mengambil data header dan detail untuk satu dokumen transaksi.
- `m4_rq_getdata_history`: Mengambil riwayat perubahan header/detail untuk satu dokumen transaksi.
- `m4_rq_terkait`: Mengambil keterkaitan dokumen dengan dokumen lain di alur purchasing.
- `m4_rq_v`: Menyediakan listing atau pencarian data dokumen.
- `m4_rq_v_history`: Menyediakan listing riwayat perubahan dokumen.

## VP - Vendor Payment

### Tabel

- `m4_vp` | alias: `purchase_vp` | tipe: Header | kolom: 45
  Transaksi purchasing atau hutang untuk vp.
- `m4_vp_detail` | alias: `purchase_vp_detail` | tipe: Detail | kolom: 24
  Tabel detail untuk item/baris transaksi vp detail.
- `m4_vp_detail_history` | alias: `inferred_from_query` | tipe: History | kolom: tidak tersedia di schema
  Tabel histori/arsip yang terdeteksi dari query aktif modul ini.
- `m4_vp_history` | alias: `inferred_from_query` | tipe: History | kolom: tidak tersedia di schema
  Tabel histori/arsip yang terdeteksi dari query aktif modul ini.
- `m4_vp_pay` | alias: `purchase_vp_pay` | tipe: Payment/Allocation | kolom: 17
  Data pembayaran terkait vp pay.
- `m4_vp_pay_history` | alias: `inferred_from_query` | tipe: History | kolom: tidak tersedia di schema
  Tabel histori/arsip yang terdeteksi dari query aktif modul ini.

### Tabel Operasional Terdeteksi

- `m4_ap`
- `m4_prt`
- `m4_ri`
- `m4_vp`
- `m4_vp_detail`
- `m4_vp_detail_history`
- `m4_vp_history`
- `m4_vp_pay`
- `m4_vp_pay_history`
- `m4_vpp`
- `m4_vpp_detail`

### Kolom Header Penting

- `vpid`: Kolom bisnis vpid.
- `vpcabang`: Kolom bisnis vpcabang.
- `vplokasi`: Kolom bisnis vplokasi.
- `vpgudang`: Referensi gudang asal/tujuan transaksi.
- `vpsumber`: Kolom bisnis vpsumber.
- `vpautonotransaksi`: Nomor dokumen/transaksi unik.
- `vpnotransaksi`: Nomor dokumen/transaksi unik.
- `vptgl`: Tanggal transaksi atau tanggal referensi.
- `vpsupplier`: Referensi supplier.
- `vpsupplierkontak`: Referensi supplier.
- `vptglnoref`: Kolom bisnis vptglnoref.
- `vptglbayar`: Nilai nominal transaksi.

### Relasi Utama

- `m4_vp_detail` -> `m4_vp`: `m4_vp_detail.idvp = m4_vp.vpid`
- `m4_vp_pay` -> `m4_vp`: `m4_vp_pay.idvp = m4_vp.vpid`

### Functions

- `m4_vp_getdata`: Mengambil data header dan detail untuk satu dokumen transaksi.
- `m4_vp_getdata_history`: Mengambil riwayat perubahan header/detail untuk satu dokumen transaksi.
- `m4_vp_getdata_pay`: Mengambil detail pembayaran/alokasi pada dokumen vendor payment.
- `m4_vp_getdata_pay_history`: Mengambil riwayat detail pembayaran/alokasi pada dokumen vendor payment.
- `m4_vp_terkait`: Mengambil keterkaitan dokumen dengan dokumen lain di alur purchasing.
- `m4_vp_v`: Menyediakan listing atau pencarian data dokumen.
- `m4_vp_v_history`: Menyediakan listing riwayat perubahan dokumen.

## VPP - Vendor Payment Proposal

### Tabel

- `m4_vpp` | alias: `purchase_vpp` | tipe: Header | kolom: 45
  Transaksi purchasing atau hutang untuk vpp.
- `m4_vpp_detail` | alias: `purchase_vpp_detail` | tipe: Detail | kolom: 26
  Tabel detail untuk item/baris transaksi vpp detail.
- `m4_vpp_detail_history` | alias: `inferred_from_query` | tipe: History | kolom: tidak tersedia di schema
  Tabel histori/arsip yang terdeteksi dari query aktif modul ini.
- `m4_vpp_history` | alias: `inferred_from_query` | tipe: History | kolom: tidak tersedia di schema
  Tabel histori/arsip yang terdeteksi dari query aktif modul ini.
- `m4_vpp_pay` | alias: `purchase_vpp_pay` | tipe: Payment/Allocation | kolom: 19
  Data pembayaran terkait vpp pay.
- `m4_vpp_pay_history` | alias: `inferred_from_query` | tipe: History | kolom: tidak tersedia di schema
  Tabel histori/arsip yang terdeteksi dari query aktif modul ini.

### Tabel Operasional Terdeteksi

- `m4_ap`
- `m4_prt`
- `m4_ri`
- `m4_vp`
- `m4_vpp`
- `m4_vpp_detail`
- `m4_vpp_detail_history`
- `m4_vpp_history`
- `m4_vpp_pay`
- `m4_vpp_pay_history`

### Kolom Header Penting

- `vppid`: Kolom bisnis vppid.
- `vppcabang`: Kolom bisnis vppcabang.
- `vpplokasi`: Kolom bisnis vpplokasi.
- `vppgudang`: Referensi gudang asal/tujuan transaksi.
- `vppsumber`: Kolom bisnis vppsumber.
- `vppautonotransaksi`: Nomor dokumen/transaksi unik.
- `vppnotransaksi`: Nomor dokumen/transaksi unik.
- `vpptgl`: Tanggal transaksi atau tanggal referensi.
- `vppsupplier`: Referensi supplier.
- `vppsupplierkontak`: Referensi supplier.
- `vpptglnoref`: Kolom bisnis vpptglnoref.
- `vpptglbayar`: Nilai nominal transaksi.

### Relasi Utama

- `m4_vpp_detail` -> `m4_vpp`: `m4_vpp_detail.idvpp = m4_vpp.vppid`
- `m4_vpp_pay` -> `m4_vpp`: `m4_vpp_pay.idvpp = m4_vpp.vppid`

### Functions

- `m4_vpp_cd`: Menyediakan daftar referensi / lookup untuk kebutuhan caridata.
- `m4_vpp_getdata`: Mengambil data header dan detail untuk satu dokumen transaksi.
- `m4_vpp_getdata_history`: Mengambil riwayat perubahan header/detail untuk satu dokumen transaksi.
- `m4_vpp_getdata_pay`: Mengambil detail pembayaran/alokasi pada dokumen vendor payment.
- `m4_vpp_getdata_pay_history`: Mengambil riwayat detail pembayaran/alokasi pada dokumen vendor payment.
- `m4_vpp_takedata`: Mengambil kandidat dokumen target secara polymorphic berdasarkan filter bisnis.
- `m4_vpp_takedataOld`: Mengambil kandidat dokumen target secara polymorphic berdasarkan filter bisnis.
- `m4_vpp_terkait`: Mengambil keterkaitan dokumen dengan dokumen lain di alur purchasing.
- `m4_vpp_v`: Menyediakan listing atau pencarian data dokumen.
- `m4_vpp_v_history`: Menyediakan listing riwayat perubahan dokumen.
