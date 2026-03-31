# Semantic Schema M2 Summary

Sumber schema: `/home/rania/apps/sentient-factory/apps/myerpplus-db-mapping/db/semantic-schema-m2.json`
Sumber function/query: `/home/rania/apps/sentient-factory/m2-queries.md`, `/home/rania/apps/sentient-factory/m0_report_rmoduleid_2.sql`, `/home/rania/apps/sentient-factory/client-backend/api-myerpplus/app_code/ws/m0/m0_query.vb`

Total tabel M2 di schema: **70**
Total tabel M2 terdeteksi di query aktif: **70**
Total function M2: **72**
Total polymorphic relationships: **0**
Total join hints: **9**

Dokumen ini merangkum alias, deskripsi, struktur tabel, relasi utama, join hints, dan function semantic utama untuk modul finance M2.
Schema JSON sudah dicocokkan dengan query service dan report aktif, sehingga tabel di schema sekarang sinkron dengan sumber operasional yang sedang dipakai.

## Join Hints

- `cash_receipt_flow`: Alur penerimaan kas dan detail jurnalnya.
  `m2_cr.crid = m2_cr_detail.idcr`
- `cash_disbursement_flow`: Alur pengeluaran kas dan detail jurnalnya.
  `m2_cd.cdid = m2_cd_detail.idcd`
- `bank_disbursement_flow`: Alur pengeluaran bank dan detail jurnalnya.
  `m2_bd.bdid = m2_bd_detail.idbd`
- `receipt_memo_payment_flow`: Relasi memo penerimaan dengan payment allocation.
  `m2_rm.rmid = m2_rm_detail.idrm`
  `m2_rm.rmid = m2_rm_pay.idrm`
- `send_memo_payment_flow`: Relasi memo pengeluaran dengan payment allocation.
  `m2_sm.smid = m2_sm_detail.idsm`
  `m2_sm.smid = m2_sm_pay.idsm`
- `cashbank_transfer_flow`: Relasi transaksi CB dengan detail dan payment allocation.
  `m2_cb.cbid = m2_cb_detail.idcb`
  `m2_cb.cbid = m2_cb_pay.idcb`
- `giro_receipt_flow`: Alur giro masuk dan pencairannya.
  `m2_rg.rgid = m2_rg_detail.idrg`
  `m2_rgc.rgcid = m2_rgc_detail.idrgc`
- `giro_send_flow`: Alur giro keluar dan pencairannya.
  `m2_sg.sgid = m2_sg_detail.idsg`
  `m2_sgc.sgcid = m2_sgc_detail.idsgc`
- `journal_posting_flow`: Relasi dokumen finance ke jurnal transaksi terposting.
  `m2_transaction_journal.tidtransaksi = finance document id`
  `m2_transaction_journal.tsumber = kode sumber dokumen finance`

## Polymorphic Relationships

- Tidak ada relasi polymorphic eksplisit yang dimodelkan pada schema/query M2 aktif.

## Ringkasan Modul

- **ACCOUNTING**: Accounting Period | tabel schema: 1 | header: 1 | detail: 0 | history: 0 | payment: 0 | relasi: 0
- **CR**: Cash Receipt | tabel schema: 4 | header: 1 | detail: 1 | history: 2 | payment: 0 | relasi: 1
- **CD**: Cash Disbursement | tabel schema: 4 | header: 1 | detail: 1 | history: 2 | payment: 0 | relasi: 1
- **RM**: Receipt Memo | tabel schema: 6 | header: 1 | detail: 1 | history: 3 | payment: 1 | relasi: 2
- **SM**: Send Memo | tabel schema: 6 | header: 1 | detail: 1 | history: 3 | payment: 1 | relasi: 2
- **GJ**: General Journal | tabel schema: 4 | header: 1 | detail: 1 | history: 2 | payment: 0 | relasi: 1
- **AJ**: Adjustment Journal | tabel schema: 4 | header: 1 | detail: 1 | history: 2 | payment: 0 | relasi: 1
- **RG**: Receipt Giro | tabel schema: 4 | header: 1 | detail: 1 | history: 2 | payment: 0 | relasi: 1
- **SG**: Send Giro | tabel schema: 4 | header: 1 | detail: 1 | history: 2 | payment: 0 | relasi: 1
- **RGC**: Receipt Giro Cair | tabel schema: 4 | header: 1 | detail: 1 | history: 2 | payment: 0 | relasi: 1
- **SGC**: Send Giro Cair | tabel schema: 4 | header: 1 | detail: 1 | history: 2 | payment: 0 | relasi: 1
- **CB**: Cash/Bank In Transfer | tabel schema: 6 | header: 1 | detail: 1 | history: 3 | payment: 1 | relasi: 2
- **BD**: Bank Disbursement | tabel schema: 4 | header: 1 | detail: 1 | history: 2 | payment: 0 | relasi: 1
- **JM**: Memorial Journal | tabel schema: 4 | header: 1 | detail: 1 | history: 2 | payment: 0 | relasi: 1
- **GIRO**: Giro List | tabel schema: 1 | header: 1 | detail: 0 | history: 0 | payment: 0 | relasi: 0
- **TRANSACTION**: Transaction Journal | tabel schema: 1 | header: 1 | detail: 0 | history: 0 | payment: 0 | relasi: 1
- **REALIZATION**: Budget Realization | tabel schema: 7 | header: 7 | detail: 0 | history: 0 | payment: 0 | relasi: 1
- **NOTES**: Catatan Finance | tabel schema: 1 | header: 0 | detail: 0 | history: 0 | payment: 0 | relasi: 0
- **FILES**: Lampiran Finance | tabel schema: 1 | header: 0 | detail: 0 | history: 0 | payment: 0 | relasi: 0

## ACCOUNTING - Accounting Period

Master periode akuntansi untuk kontrol buka/tutup periode.

### Tabel

- `m2_accounting_period` | alias: `finance_accounting_period` | tipe: Header | kolom: 5
  Transaksi atau referensi finance untuk accounting period.

### Kolom Header Penting

- `apkode`: Kolom bisnis apkode.
- `aptahun`: Kolom bisnis aptahun.
- `apbulan`: Kolom bisnis apbulan.
- `apaktif`: Kolom bisnis apaktif.
- `aptutupperiode`: Kolom bisnis aptutupperiode.

### Functions

- `m2_accounting_period_v`: Menyediakan listing atau pencarian data dokumen.

## CR - Cash Receipt

Penerimaan kas.

### Tabel

- `m2_cr` | alias: `finance_cr` | tipe: Header | kolom: 28
  Transaksi atau referensi finance untuk cr.
- `m2_cr_detail` | alias: `finance_cr_detail` | tipe: Detail | kolom: 14
  Tabel detail untuk item/baris transaksi cr detail.
- `m2_cr_detail_history` | alias: `finance_cr_detail_history` | tipe: History | kolom: 16
  Tabel histori detail finance untuk cr.
- `m2_cr_history` | alias: `finance_cr_history` | tipe: History | kolom: 29
  Tabel histori finance untuk cr.

### Kolom Header Penting

- `crid`: Kolom bisnis crid.
- `crautonotransaksi`: Nomor dokumen/transaksi unik.
- `crnotransaksi`: Nomor dokumen/transaksi unik.
- `crtgl`: Tanggal transaksi atau tanggal referensi.
- `crkodepa`: Kolom bisnis crkodepa.
- `crkontak`: Referensi kontak atau contact person.
- `crkontakperson`: Referensi kontak atau contact person.
- `crnorek`: Kolom bisnis crnorek.
- `crmatauang`: Informasi mata uang dan kurs transaksi.
- `crkurs`: Informasi mata uang dan kurs transaksi.
- `crjumlahbayar`: Nilai nominal transaksi.
- `crjumlahbayarvalas`: Nilai nominal transaksi.

### Relasi Utama

- `m2_cr_detail` -> `m2_cr`: `m2_cr_detail.idcr = m2_cr.crid`

### Functions

- `m2_cr_v`: Menyediakan listing atau pencarian data dokumen.
- `m2_cr_getdata`: Mengambil data header dan detail untuk satu dokumen transaksi.
- `m2_cr_v_history`: Menyediakan listing riwayat perubahan dokumen.
- `m2_cr_h_getdata`: Mengambil riwayat perubahan header/detail untuk satu dokumen transaksi.

## CD - Cash Disbursement

Pengeluaran kas.

### Tabel

- `m2_cd` | alias: `finance_cd` | tipe: Header | kolom: 42
  Transaksi atau referensi finance untuk cd.
- `m2_cd_detail` | alias: `finance_cd_detail` | tipe: Detail | kolom: 23
  Tabel detail untuk item/baris transaksi cd.
- `m2_cd_detail_history` | alias: `finance_cd_detail_history` | tipe: History | kolom: 25
  Tabel histori detail finance untuk cd.
- `m2_cd_history` | alias: `finance_cd_history` | tipe: History | kolom: 43
  Tabel histori finance untuk cd.

### Kolom Header Penting

- `cdid`: Kolom bisnis cdid.
- `cdautonotransaksi`: Nomor dokumen/transaksi unik.
- `cdnotransaksi`: Nomor dokumen/transaksi unik.
- `cdtgl`: Tanggal transaksi atau tanggal referensi.
- `cdkodepa`: Kolom bisnis cdkodepa.
- `cdkontak`: Referensi kontak atau contact person.
- `cdkontakperson`: Referensi kontak atau contact person.
- `cdnorek`: Kolom bisnis cdnorek.
- `cdmatauang`: Informasi mata uang dan kurs transaksi.
- `cdkurs`: Kolom bisnis cdkurs.
- `cdjumlahbayar`: Nilai nominal transaksi.
- `cdjumlahbayarvalas`: Nilai nominal transaksi.

### Relasi Utama

- `m2_cd_detail` -> `m2_cd`: `m2_cd_detail.idcd = m2_cd.cdid`

### Functions

- `m2_cd_v`: Menyediakan listing atau pencarian data dokumen.
- `m2_cd_getdata`: Mengambil data header dan detail untuk satu dokumen transaksi.
- `m2_cd_v_history`: Menyediakan listing riwayat perubahan dokumen.
- `m2_cd_h_getdata`: Mengambil riwayat perubahan header/detail untuk satu dokumen transaksi.

## RM - Receipt Memo

Penerimaan memorial / receivable memo dengan payment allocation.

### Tabel

- `m2_rm` | alias: `finance_rm` | tipe: Header | kolom: 29
  Transaksi atau referensi finance untuk rm.
- `m2_rm_detail` | alias: `finance_rm_detail` | tipe: Detail | kolom: 14
  Tabel detail untuk item/baris transaksi rm detail.
- `m2_rm_detail_history` | alias: `finance_rm_detail_history` | tipe: History | kolom: 16
  Tabel histori detail finance untuk rm.
- `m2_rm_history` | alias: `finance_rm_history` | tipe: History | kolom: 30
  Tabel histori finance untuk rm.
- `m2_rm_pay` | alias: `finance_rm_pay` | tipe: Payment/Allocation | kolom: 15
  Data pembayaran terkait rm pay.
- `m2_rm_pay_history` | alias: `finance_rm_pay_history` | tipe: History | kolom: 17
  Tabel histori pembayaran/alokasi finance untuk rm_pay.

### Kolom Header Penting

- `rmid`: Kolom bisnis rmid.
- `rmautonotransaksi`: Nomor dokumen/transaksi unik.
- `rmnotransaksi`: Nomor dokumen/transaksi unik.
- `rmtgl`: Tanggal transaksi atau tanggal referensi.
- `rmkodepa`: Kolom bisnis rmkodepa.
- `rmcarabayar`: Nilai nominal transaksi.
- `rmkontak`: Referensi kontak atau contact person.
- `rmkontakperson`: Referensi kontak atau contact person.
- `rmnorek`: Kolom bisnis rmnorek.
- `rmmatauang`: Informasi mata uang dan kurs transaksi.
- `rmkurs`: Informasi mata uang dan kurs transaksi.
- `rmjumlahbayar`: Nilai nominal transaksi.

### Relasi Utama

- `m2_rm_detail` -> `m2_rm`: `m2_rm_detail.idrm = m2_rm.rmid`
- `m2_rm_pay` -> `m2_rm`: `m2_rm_pay.idrm = m2_rm.rmid`

### Functions

- `m2_rm_v`: Menyediakan listing atau pencarian data dokumen.
- `m2_rm_getdata`: Mengambil data header dan detail untuk satu dokumen transaksi.
- `m2_rm_v_history`: Menyediakan listing riwayat perubahan dokumen.
- `m2_rm_getdata_history`: Mengambil riwayat perubahan header/detail untuk satu dokumen transaksi.
- `m2_rm_pay_v`: Menyediakan listing atau pencarian data dokumen.
- `m2_rm_pay_history`: Menyediakan data payment/allocation untuk dokumen finance.
- `m2_rm_terkait`: Mengambil keterkaitan dokumen dengan transaksi finance lain.

## SM - Send Memo

Pengeluaran memorial / payable memo dengan payment allocation.

### Tabel

- `m2_sm` | alias: `finance_sm` | tipe: Header | kolom: 29
  Transaksi atau referensi finance untuk sm.
- `m2_sm_detail` | alias: `finance_sm_detail` | tipe: Detail | kolom: 14
  Tabel detail untuk item/baris transaksi sm detail.
- `m2_sm_detail_history` | alias: `finance_sm_detail_history` | tipe: History | kolom: 16
  Tabel histori detail finance untuk sm.
- `m2_sm_history` | alias: `finance_sm_history` | tipe: History | kolom: 30
  Tabel histori finance untuk sm.
- `m2_sm_pay` | alias: `finance_sm_pay` | tipe: Payment/Allocation | kolom: 15
  Data pembayaran terkait sm pay.
- `m2_sm_pay_history` | alias: `finance_sm_pay_history` | tipe: History | kolom: 17
  Tabel histori pembayaran/alokasi finance untuk sm_pay.

### Kolom Header Penting

- `smid`: Kolom bisnis smid.
- `smautonotransaksi`: Nomor dokumen/transaksi unik.
- `smnotransaksi`: Nomor dokumen/transaksi unik.
- `smtgl`: Tanggal transaksi atau tanggal referensi.
- `smkodepa`: Kolom bisnis smkodepa.
- `smcarabayar`: Nilai nominal transaksi.
- `smkontak`: Referensi kontak atau contact person.
- `smkontakperson`: Referensi kontak atau contact person.
- `smnorek`: Kolom bisnis smnorek.
- `smmatauang`: Informasi mata uang dan kurs transaksi.
- `smkurs`: Informasi mata uang dan kurs transaksi.
- `smjumlahbayar`: Nilai nominal transaksi.

### Relasi Utama

- `m2_sm_detail` -> `m2_sm`: `m2_sm_detail.idsm = m2_sm.smid`
- `m2_sm_pay` -> `m2_sm`: `m2_sm_pay.idsm = m2_sm.smid`

### Functions

- `m2_sm_v`: Menyediakan listing atau pencarian data dokumen.
- `m2_sm_getdata`: Mengambil data header dan detail untuk satu dokumen transaksi.
- `m2_sm_v_history`: Menyediakan listing riwayat perubahan dokumen.
- `m2_sm_getdata_history`: Mengambil riwayat perubahan header/detail untuk satu dokumen transaksi.
- `m2_sm_pay_v`: Menyediakan listing atau pencarian data dokumen.
- `m2_sm_pay_v_history`: Menyediakan listing riwayat perubahan dokumen.
- `m2_sm_terkait`: Mengambil keterkaitan dokumen dengan transaksi finance lain.

## GJ - General Journal

Jurnal umum.

### Tabel

- `m2_gj` | alias: `finance_gj` | tipe: Header | kolom: 29
  Transaksi atau referensi finance untuk gj.
- `m2_gj_detail` | alias: `finance_gj_detail` | tipe: Detail | kolom: 16
  Tabel detail untuk item/baris transaksi gj detail.
- `m2_gj_detail_history` | alias: `finance_gj_detail_history` | tipe: History | kolom: 18
  Tabel histori detail finance untuk gj.
- `m2_gj_history` | alias: `finance_gj_history` | tipe: History | kolom: 30
  Tabel histori finance untuk gj.

### Kolom Header Penting

- `gjid`: Kolom bisnis gjid.
- `gjautonotransaksi`: Nomor dokumen/transaksi unik.
- `gjnotransaksi`: Nomor dokumen/transaksi unik.
- `gjtgl`: Tanggal transaksi atau tanggal referensi.
- `gjkodepa`: Kolom bisnis gjkodepa.
- `gjkontak`: Referensi kontak atau contact person.
- `gjkontakperson`: Referensi kontak atau contact person.
- `gjmatauang`: Informasi mata uang dan kurs transaksi.
- `gjkurs`: Informasi mata uang dan kurs transaksi.
- `gjjumlahbayar`: Nilai nominal transaksi.
- `gjjumlahbayarvalas`: Nilai nominal transaksi.
- `gjstatusbayar`: Nilai nominal transaksi.

### Relasi Utama

- `m2_gj_detail` -> `m2_gj`: `m2_gj_detail.idgj = m2_gj.gjid`

### Functions

- `m2_gj_v`: Menyediakan listing atau pencarian data dokumen.
- `m2_gj_getdata`: Mengambil data header dan detail untuk satu dokumen transaksi.
- `m2_gj_v_history`: Menyediakan listing riwayat perubahan dokumen.
- `m2_gj_getdata_history`: Mengambil riwayat perubahan header/detail untuk satu dokumen transaksi.

## AJ - Adjustment Journal

Jurnal penyesuaian manual untuk koreksi akuntansi.

### Tabel

- `m2_aj` | alias: `finance_aj` | tipe: Header | kolom: 29
  Transaksi atau referensi finance untuk aj.
- `m2_aj_detail` | alias: `finance_aj_detail` | tipe: Detail | kolom: 16
  Tabel detail untuk item/baris transaksi aj detail.
- `m2_aj_detail_history` | alias: `finance_aj_detail_history` | tipe: History | kolom: 18
  Tabel histori detail finance untuk aj.
- `m2_aj_history` | alias: `finance_aj_history` | tipe: History | kolom: 30
  Tabel histori finance untuk aj.

### Kolom Header Penting

- `ajid`: Kolom bisnis ajid.
- `ajautonotransaksi`: Nomor dokumen/transaksi unik.
- `ajnotransaksi`: Nomor dokumen/transaksi unik.
- `ajtgl`: Tanggal transaksi atau tanggal referensi.
- `ajkodepa`: Kolom bisnis ajkodepa.
- `ajkontak`: Referensi kontak atau contact person.
- `ajkontakperson`: Referensi kontak atau contact person.
- `ajmatauang`: Informasi mata uang dan kurs transaksi.
- `ajkurs`: Informasi mata uang dan kurs transaksi.
- `ajjumlahbayar`: Nilai nominal transaksi.
- `ajjumlahbayarvalas`: Nilai nominal transaksi.
- `ajstatusbayar`: Nilai nominal transaksi.

### Relasi Utama

- `m2_aj_detail` -> `m2_aj`: `m2_aj_detail.idaj = m2_aj.ajid`

### Functions

- `m2_aj_v`: Menyediakan listing atau pencarian data dokumen.
- `m2_aj_getdata`: Mengambil data header dan detail untuk satu dokumen transaksi.
- `m2_aj_v_history`: Menyediakan listing riwayat perubahan dokumen.
- `m2_aj_getdata_history`: Mengambil riwayat perubahan header/detail untuk satu dokumen transaksi.

## RG - Receipt Giro

Penerimaan giro.

### Tabel

- `m2_rg` | alias: `finance_rg` | tipe: Header | kolom: 24
  Transaksi atau referensi finance untuk rg.
- `m2_rg_detail` | alias: `finance_rg_detail` | tipe: Detail | kolom: 18
  Tabel detail untuk item/baris transaksi rg detail.
- `m2_rg_detail_history` | alias: `finance_rg_detail_history` | tipe: History | kolom: 20
  Tabel histori detail finance untuk rg.
- `m2_rg_history` | alias: `finance_rg_history` | tipe: History | kolom: 25
  Tabel histori finance untuk rg.

### Kolom Header Penting

- `rgid`: Kolom bisnis rgid.
- `rgautonotransaksi`: Nomor dokumen/transaksi unik.
- `rgnotransaksi`: Nomor dokumen/transaksi unik.
- `rgtgl`: Tanggal transaksi atau tanggal referensi.
- `rgkodepa`: Kolom bisnis rgkodepa.
- `rgkontak`: Referensi kontak atau contact person.
- `rgkontakperson`: Referensi kontak atau contact person.
- `rgmatauang`: Informasi mata uang dan kurs transaksi.
- `rgkurs`: Informasi mata uang dan kurs transaksi.
- `rgstatusrgc`: Status proses atau status dokumen.
- `rgstatus`: Status proses atau status dokumen.
- `rgstatussebelumnya`: Status proses atau status dokumen.

### Relasi Utama

- `m2_rg_detail` -> `m2_rg`: `m2_rg_detail.idrg = m2_rg.rgid`

### Functions

- `m2_rg_v`: Menyediakan listing atau pencarian data dokumen.
- `m2_rg_getdata`: Mengambil data header dan detail untuk satu dokumen transaksi.
- `m2_rg_v_history`: Menyediakan listing riwayat perubahan dokumen.
- `m2_rg_getdata_history`: Mengambil riwayat perubahan header/detail untuk satu dokumen transaksi.
- `m2_rg_detail_v`: Menyediakan listing atau pencarian data dokumen.
- `m2_rg_terkait`: Mengambil keterkaitan dokumen dengan transaksi finance lain.
- `m2_rgc_v`: Menyediakan listing atau pencarian data dokumen.
- `m2_rgc_getdata`: Mengambil data header dan detail untuk satu dokumen transaksi.
- `m2_rgc_v_history`: Menyediakan listing riwayat perubahan dokumen.
- `m2_rgc_getdata_history`: Mengambil riwayat perubahan header/detail untuk satu dokumen transaksi.
- `m2_rgc_terkait`: Mengambil keterkaitan dokumen dengan transaksi finance lain.

## SG - Send Giro

Pengeluaran / penyerahan giro.

### Tabel

- `m2_sg` | alias: `finance_sg` | tipe: Header | kolom: 24
  Transaksi atau referensi finance untuk sg.
- `m2_sg_detail` | alias: `finance_sg_detail` | tipe: Detail | kolom: 18
  Tabel detail untuk item/baris transaksi sg detail.
- `m2_sg_detail_history` | alias: `finance_sg_detail_history` | tipe: History | kolom: 20
  Tabel histori detail finance untuk sg.
- `m2_sg_history` | alias: `finance_sg_history` | tipe: History | kolom: 25
  Tabel histori finance untuk sg.

### Kolom Header Penting

- `sgid`: Kolom bisnis sgid.
- `sgautonotransaksi`: Nomor dokumen/transaksi unik.
- `sgnotransaksi`: Nomor dokumen/transaksi unik.
- `sgtgl`: Tanggal transaksi atau tanggal referensi.
- `sgkodepa`: Kolom bisnis sgkodepa.
- `sgkontak`: Referensi kontak atau contact person.
- `sgkontakperson`: Referensi kontak atau contact person.
- `sgmatauang`: Informasi mata uang dan kurs transaksi.
- `sgkurs`: Informasi mata uang dan kurs transaksi.
- `sgstatussgc`: Status proses atau status dokumen.
- `sgstatus`: Status proses atau status dokumen.
- `sgstatussebelumnya`: Status proses atau status dokumen.

### Relasi Utama

- `m2_sg_detail` -> `m2_sg`: `m2_sg_detail.idsg = m2_sg.sgid`

### Functions

- `m2_sg_v`: Menyediakan listing atau pencarian data dokumen.
- `m2_sg_getdata`: Mengambil data header dan detail untuk satu dokumen transaksi.
- `m2_sg_v_history`: Menyediakan listing riwayat perubahan dokumen.
- `m2_sg_getdata_history`: Mengambil riwayat perubahan header/detail untuk satu dokumen transaksi.
- `m2_sg_detail_v`: Menyediakan listing atau pencarian data dokumen.
- `m2_sg_terkait`: Mengambil keterkaitan dokumen dengan transaksi finance lain.
- `m2_sgc_v`: Menyediakan listing atau pencarian data dokumen.
- `m2_sgc_getdata`: Mengambil data header dan detail untuk satu dokumen transaksi.
- `m2_sgc_v_history`: Menyediakan listing riwayat perubahan dokumen.
- `m2_sgc_getdata_history`: Mengambil riwayat perubahan header/detail untuk satu dokumen transaksi.
- `m2_sgc_terkait`: Mengambil keterkaitan dokumen dengan transaksi finance lain.

## RGC - Receipt Giro Cair

Pencairan giro masuk.

### Tabel

- `m2_rgc` | alias: `finance_rgc` | tipe: Header | kolom: 25
  Transaksi atau referensi finance untuk rgc.
- `m2_rgc_detail` | alias: `finance_rgc_detail` | tipe: Detail | kolom: 18
  Tabel detail untuk item/baris transaksi rgc detail.
- `m2_rgc_detail_history` | alias: `finance_rgc_detail_history` | tipe: History | kolom: 20
  Tabel histori detail finance untuk rgc.
- `m2_rgc_history` | alias: `finance_rgc_history` | tipe: History | kolom: 26
  Tabel histori finance untuk rgc.

### Kolom Header Penting

- `rgcid`: Kolom bisnis rgcid.
- `rgcautonotransaksi`: Nomor dokumen/transaksi unik.
- `rgcnotransaksi`: Nomor dokumen/transaksi unik.
- `rgctgl`: Tanggal transaksi atau tanggal referensi.
- `rgckodepa`: Kolom bisnis rgckodepa.
- `rgckontak`: Referensi kontak atau contact person.
- `rgckontakperson`: Referensi kontak atau contact person.
- `rgcmatauang`: Informasi mata uang dan kurs transaksi.
- `rgckurs`: Informasi mata uang dan kurs transaksi.
- `rgcidrg`: Kolom bisnis rgcidrg.
- `rgcstatus`: Status proses atau status dokumen.
- `rgcstatussebelumnya`: Status proses atau status dokumen.

### Relasi Utama

- `m2_rgc_detail` -> `m2_rgc`: `m2_rgc_detail.idrgc = m2_rgc.rgcid`

### Functions

- `m2_rgc_v`: Menyediakan listing atau pencarian data dokumen.
- `m2_rgc_getdata`: Mengambil data header dan detail untuk satu dokumen transaksi.
- `m2_rgc_v_history`: Menyediakan listing riwayat perubahan dokumen.
- `m2_rgc_getdata_history`: Mengambil riwayat perubahan header/detail untuk satu dokumen transaksi.
- `m2_rgc_terkait`: Mengambil keterkaitan dokumen dengan transaksi finance lain.

## SGC - Send Giro Cair

Pencairan giro keluar.

### Tabel

- `m2_sgc` | alias: `finance_sgc` | tipe: Header | kolom: 25
  Transaksi atau referensi finance untuk sgc.
- `m2_sgc_detail` | alias: `finance_sgc_detail` | tipe: Detail | kolom: 18
  Tabel detail untuk item/baris transaksi sgc detail.
- `m2_sgc_detail_history` | alias: `finance_sgc_detail_history` | tipe: History | kolom: 20
  Tabel histori detail finance untuk sgc.
- `m2_sgc_history` | alias: `finance_sgc_history` | tipe: History | kolom: 26
  Tabel histori finance untuk sgc.

### Kolom Header Penting

- `sgcid`: Kolom bisnis sgcid.
- `sgcautonotransaksi`: Nomor dokumen/transaksi unik.
- `sgcnotransaksi`: Nomor dokumen/transaksi unik.
- `sgctgl`: Tanggal transaksi atau tanggal referensi.
- `sgckodepa`: Kolom bisnis sgckodepa.
- `sgckontak`: Referensi kontak atau contact person.
- `sgckontakperson`: Referensi kontak atau contact person.
- `sgcmatauang`: Informasi mata uang dan kurs transaksi.
- `sgckurs`: Informasi mata uang dan kurs transaksi.
- `sgcidsg`: Kolom bisnis sgcidsg.
- `sgcstatus`: Status proses atau status dokumen.
- `sgcstatussebelumnya`: Status proses atau status dokumen.

### Relasi Utama

- `m2_sgc_detail` -> `m2_sgc`: `m2_sgc_detail.idsgc = m2_sgc.sgcid`

### Functions

- `m2_sgc_v`: Menyediakan listing atau pencarian data dokumen.
- `m2_sgc_getdata`: Mengambil data header dan detail untuk satu dokumen transaksi.
- `m2_sgc_v_history`: Menyediakan listing riwayat perubahan dokumen.
- `m2_sgc_getdata_history`: Mengambil riwayat perubahan header/detail untuk satu dokumen transaksi.
- `m2_sgc_terkait`: Mengambil keterkaitan dokumen dengan transaksi finance lain.

## CB - Cash/Bank In Transfer

Transaksi penerimaan atau perpindahan kas/bank dengan allocation payment.

### Tabel

- `m2_cb` | alias: `saldo_awal_coa` | tipe: Header | kolom: 29
  Header transaksi saldo awal akun/COA pada awal periode. Dipakai untuk membentuk opening balance sebelum transaksi jurnal berjalan.
- `m2_cb_detail` | alias: `saldo_awal_coa_detail` | tipe: Detail | kolom: 16
  Detail akun debit dan kredit untuk transaksi saldo awal COA. Setiap baris mewakili akun yang dibuka pada awal periode.
- `m2_cb_detail_history` | alias: `finance_cb_detail_history` | tipe: History | kolom: 18
  Tabel histori detail finance untuk cb.
- `m2_cb_history` | alias: `finance_cb_history` | tipe: History | kolom: 30
  Tabel histori finance untuk cb.
- `m2_cb_pay` | alias: `finance_cb_pay` | tipe: Payment/Allocation | kolom: 15
  Data pembayaran terkait cb pay.
- `m2_cb_pay_history` | alias: `finance_cb_pay_history` | tipe: History | kolom: 17
  Tabel histori pembayaran/alokasi finance untuk cb_pay.

### Kolom Header Penting

- `cbid`: Primary key baris data.
- `cbautonotransaksi`: Nomor dokumen/transaksi unik.
- `cbnotransaksi`: Nomor dokumen/transaksi unik.
- `cbtgl`: Tanggal transaksi atau tanggal referensi.
- `cbkodepa`: Kolom bisnis cbkodepa.
- `cbkontak`: Referensi kontak atau contact person.
- `cbkontakperson`: Referensi kontak atau contact person.
- `cbmatauang`: Informasi mata uang dan kurs transaksi.
- `cbkurs`: Informasi mata uang dan kurs transaksi.
- `cbjumlahbayar`: Nilai nominal transaksi.
- `cbjumlahbayarvalas`: Nilai nominal transaksi.
- `cbstatusbayar`: Nilai nominal transaksi.

### Relasi Utama

- `m2_cb_detail` -> `m2_cb`: `m2_cb_detail.idcb = m2_cb.cbid`
- `m2_cb_pay` -> `m2_cb`: `m2_cb_pay.idcb = m2_cb.cbid`

### Functions

- `m2_cb_v`: Menyediakan listing atau pencarian data dokumen.
- `m2_cb_getdata`: Mengambil data header dan detail untuk satu dokumen transaksi.
- `m2_cb_pay_v`: Menyediakan listing atau pencarian data dokumen.
- `m2_cb_v_history`: Menyediakan listing riwayat perubahan dokumen.
- `m2_cb_getdata_history`: Mengambil riwayat perubahan header/detail untuk satu dokumen transaksi.
- `m2_cb_pay_v_history`: Menyediakan listing riwayat perubahan dokumen.
- `m2_cb_terkait`: Mengambil keterkaitan dokumen dengan transaksi finance lain.

## BD - Bank Disbursement

Pengeluaran bank / pembayaran melalui bank.

### Tabel

- `m2_bd` | alias: `finance_bd` | tipe: Header | kolom: 29
  Transaksi atau referensi finance untuk bd.
- `m2_bd_detail` | alias: `finance_bd_detail` | tipe: Detail | kolom: 14
  Tabel detail untuk item/baris transaksi bd detail.
- `m2_bd_detail_history` | alias: `finance_bd_detail_history` | tipe: History | kolom: 16
  Tabel histori detail finance untuk bd.
- `m2_bd_history` | alias: `finance_bd_history` | tipe: History | kolom: 30
  Tabel histori finance untuk bd.

### Kolom Header Penting

- `bdid`: Kolom bisnis bdid.
- `bdautonotransaksi`: Nomor dokumen/transaksi unik.
- `bdnotransaksi`: Nomor dokumen/transaksi unik.
- `bdtgl`: Tanggal transaksi atau tanggal referensi.
- `bdtglanggaran`: Kolom bisnis bdtglanggaran.
- `bdkodepa`: Kolom bisnis bdkodepa.
- `bdkontak`: Referensi kontak atau contact person.
- `bdkontakperson`: Referensi kontak atau contact person.
- `bdmatauang`: Informasi mata uang dan kurs transaksi.
- `bdkurs`: Informasi mata uang dan kurs transaksi.
- `bdstatus`: Status proses atau status dokumen.
- `bdstatussebelumnya`: Status proses atau status dokumen.

### Relasi Utama

- `m2_bd_detail` -> `m2_bd`: `m2_bd_detail.idbd = m2_bd.bdid`

## JM - Memorial Journal

Jurnal memorial.

### Tabel

- `m2_jm` | alias: `finance_jm` | tipe: Header | kolom: 28
  Transaksi atau referensi finance untuk jm.
- `m2_jm_detail` | alias: `finance_jm_detail` | tipe: Detail | kolom: 17
  Tabel detail untuk item/baris transaksi jm detail.
- `m2_jm_detail_history` | alias: `finance_jm_detail_history` | tipe: History | kolom: 19
  Tabel histori detail finance untuk jm.
- `m2_jm_history` | alias: `finance_jm_history` | tipe: History | kolom: 29
  Tabel histori finance untuk jm.

### Kolom Header Penting

- `jmid`: Kolom bisnis jmid.
- `jmautonotransaksi`: Nomor dokumen/transaksi unik.
- `jmnotransaksi`: Nomor dokumen/transaksi unik.
- `jmtgl`: Tanggal transaksi atau tanggal referensi.
- `jmkodepa`: Kolom bisnis jmkodepa.
- `jmkontakperson`: Referensi kontak atau contact person.
- `jmmatauang`: Informasi mata uang dan kurs transaksi.
- `jmkurs`: Informasi mata uang dan kurs transaksi.
- `jmjumlahbayar`: Nilai nominal transaksi.
- `jmjumlahbayarvalas`: Nilai nominal transaksi.
- `jmstatusbayar`: Nilai nominal transaksi.
- `jmtgllunas`: Tanggal transaksi atau tanggal referensi.

### Relasi Utama

- `m2_jm_detail` -> `m2_jm`: `m2_jm_detail.idjm = m2_jm.jmid`

### Functions

- `m2_jm_v`: Menyediakan listing atau pencarian data dokumen.
- `m2_jm_getdata`: Mengambil data header dan detail untuk satu dokumen transaksi.
- `m2_jm_v_history`: Menyediakan listing riwayat perubahan dokumen.
- `m2_jm_getdata_history`: Mengambil riwayat perubahan header/detail untuk satu dokumen transaksi.

## GIRO - Giro List

Daftar giro masuk/keluar dan statusnya.

### Tabel

- `m2_giro_list` | alias: `finance_giro_list` | tipe: Header | kolom: 19
  Transaksi atau referensi finance untuk giro list.

### Kolom Header Penting

- `glidtransaksi`: Kolom bisnis glidtransaksi.
- `glnotransaksi`: Nomor dokumen/transaksi unik.
- `glkontak`: Referensi kontak atau contact person.
- `glmatauang`: Informasi mata uang dan kurs transaksi.
- `glkurs`: Informasi mata uang dan kurs transaksi.
- `gltgljthtempo`: Kolom bisnis gltgljthtempo.
- `gltglcair`: Kolom bisnis gltglcair.
- `glstatus`: Status proses atau status dokumen.
- `glstatussebelumnya`: Status proses atau status dokumen.
- `glnogiro`: Kolom bisnis glnogiro.

### Functions

- `m2_giro_list_v`: Menyediakan listing atau pencarian data dokumen.
- `m2_giro_list_app`: Function semantic finance dari layer query.
- `m2_giro_list_cd`: Function semantic finance dari layer query.

## TRANSACTION - Transaction Journal

Ledger/jurnal transaksi terposting untuk finance.

### Tabel

- `m2_transaction_journal` | alias: `finance_transaction_journal` | tipe: Header | kolom: 45
  Transaksi atau referensi finance untuk transaction journal.

### Kolom Header Penting

- `tid`: Kolom bisnis tid.
- `tkodetabelangka`: Kolom bisnis tkodetabelangka.
- `tidtransaksi`: Kolom bisnis tidtransaksi.
- `tnotransaksi`: Nomor dokumen/transaksi unik.
- `ttgl`: Tanggal transaksi atau tanggal referensi.
- `tkodepa`: Kolom bisnis tkodepa.
- `tkontak`: Referensi kontak atau contact person.
- `tnorek`: Kolom bisnis tnorek.
- `tmatauang`: Informasi mata uang dan kurs transaksi.
- `tkurs`: Informasi mata uang dan kurs transaksi.
- `tcarabayar`: Nilai nominal transaksi.
- `ttgljatuhtempo`: Kolom bisnis ttgljatuhtempo.

### Relasi Utama

- `m2_transaction_journal` menyimpan jurnal posting lintas sumber dokumen finance melalui `tsumber`, `tidtransaksi`, dan `tnotransaksi`.

### Functions

- `m2_transaction_journal_voucher`: Function semantic finance dari layer query.

## REALIZATION - Budget Realization

Tabel agregat realisasi untuk branch/cost center/division/project/subdivision.

### Tabel

- `m2_realization` | alias: `finance_realization` | tipe: Header | kolom: 7
  Transaksi atau referensi finance untuk realization.
- `m2_realization_branch` | alias: `finance_realization_branch` | tipe: Header | kolom: 8
  Transaksi atau referensi finance untuk realization branch.
- `m2_realization_cost_center` | alias: `finance_realization_cost_center` | tipe: Header | kolom: 8
  Transaksi atau referensi finance untuk realization cost center.
- `m2_realization_division` | alias: `finance_realization_division` | tipe: Header | kolom: 8
  Transaksi atau referensi finance untuk realization division.
- `m2_realization_location` | alias: `finance_realization_location` | tipe: Header | kolom: 8
  Transaksi atau referensi finance untuk realization location.
- `m2_realization_project` | alias: `finance_realization_project` | tipe: Header | kolom: 8
  Transaksi atau referensi finance untuk realization project.
- `m2_realization_subdivision` | alias: `finance_realization_subdivision` | tipe: Header | kolom: 8
  Transaksi atau referensi finance untuk realization subdivision.

### Kolom Header Penting

- `rnorek`: Kolom bisnis rnorek.
- `rkodepa`: Kolom bisnis rkodepa.
- `rtahun`: Kolom bisnis rtahun.
- `rbulan`: Kolom bisnis rbulan.
- `rjmldebit`: Nilai nominal transaksi.
- `rjmlkredit`: Nilai nominal transaksi.
- `ranggaran`: Kolom bisnis ranggaran.

### Relasi Utama

- `m2_realization_*` menyimpan agregasi realisasi per dimensi organisasi seperti branch, cost center, division, location, project, dan subdivision.

## NOTES - Catatan Finance

Catatan teks untuk transaksi finance.

### Tabel

- `m2_notes` | alias: `finance_notes` | tipe: Auxiliary | kolom: 8
  Tabel utilitas/catatan finance untuk notes.

### Functions

- `m2_notes_v`: Menyediakan listing atau pencarian data dokumen.

## FILES - Lampiran Finance

Lampiran file transaksi finance.

### Tabel

- `m2_files` | alias: `finance_files` | tipe: Auxiliary | kolom: 8
  Tabel utilitas/lampiran finance untuk files.

### Functions

- `m2_files_v`: Menyediakan listing atau pencarian data dokumen.
