# M5 NL2SQL Guide

Sumber utama:
- `semantic-schema-m5.json`
- `m0_report_rmoduleid_5.md`
- `m5-queries.md`

Tujuan:
- membantu pemilihan tabel M5
- membantu pemilihan join yang aman
- menandai relasi polymorphic yang harus ditangani dengan `sumber`
- memberi sinonim bisnis yang natural untuk retrieval

## Cakupan Tabel Utama

- `m5_sq`, `m5_sq_detail`: penawaran penjualan, sales quotation
- `m5_so`, `m5_so_detail`: order penjualan, sales order
- `m5_pl`, `m5_pl_detail`, `m5_pl_pack`: packing list, persiapan barang
- `m5_do`, `m5_do_detail`: delivery order, surat jalan
- `m5_dr`, `m5_dr_detail`: delivery report, hasil pengiriman
- `m5_pi`, `m5_pi_detail`: proforma invoice
- `m5_si`, `m5_si_detail`, `m5_si_pay`, `m5_si_installment`, `m5_si_material`, `m5_si_cost`: sales invoice final dan turunannya
- `m5_rnr`, `m5_rnr_detail`: penerimaan barang retur
- `m5_sr`, `m5_sr_detail`: retur penjualan
- `m5_as`, `m5_as_pay`: uang muka penjualan
- `m5_ip`, `m5_ip_pay`: penerimaan pembayaran
- `m5_ic`, `m5_ic_detail`: penagihan piutang, invoice collection
- `m5_pv`, `m5_pv_detail`: payment voucher
- `m5_rp`, `m5_rp_pay`: piutang ongkos kirim atau tagihan tambahan
- `m5_spa`, `m5_spa_detail`: penyesuaian poin penjualan
- `m5_sie`, `m5_sie_detail`: tukar faktur penjualan
- `m5_cl`: closing sales, status realisasi penjualan
- `m5_files`: lampiran transaksi
- `m5_notes`: catatan transaksi

## Sinonim Bisnis

- `SQ`: sales quotation, penawaran penjualan
- `SO`: sales order, order penjualan
- `PL`: packing list, daftar packing
- `DO`: delivery order, surat jalan, pengiriman
- `DR`: delivery report, hasil pengiriman
- `PI`: proforma invoice, invoice sementara
- `SI`: sales invoice, faktur penjualan
- `RNR`: receipt note return, penerimaan barang retur
- `SR`: sales return, retur penjualan
- `AS`: advance sales, uang muka penjualan
- `IP`: incoming payment, penerimaan pembayaran
- `IC`: invoice collection, penagihan piutang
- `PV`: payment voucher, voucher pembayaran piutang
- `RP`: piutang ongkos kirim, shipping charge receivable
- `SPA`: sales point adjustment, penyesuaian poin penjualan
- `SIE`: sales invoice exchange, tukar faktur penjualan
- `CL`: closing sales, penutupan penjualan, status realisasi penjualan

## Join Hints Utama

### Alur dokumen penjualan

```sql
m5_sq.sqid = m5_sq_detail.idsq
m5_sq_detail.idsqdetail = m5_so_detail.idsqdetail
m5_so.soid = m5_so_detail.idso
m5_so_detail.idsodetail = m5_pl_detail.idsodetail
m5_pl.plid = m5_pl_detail.idpl
m5_so_detail.idsodetail = m5_do_detail.idsodetail
m5_do.doid = m5_do_detail.iddo
m5_do_detail.iddodetail = m5_dr_detail.iddodetail
m5_pi.piid = m5_pi_detail.idpi
m5_si.siid = m5_si_detail.idsi
m5_rnr.rnrid = m5_rnr_detail.idrnr
m5_sr.srid = m5_sr_detail.idsr
```

### Relasi silang detail dokumen

```sql
m5_pi_detail.idsqdetail = m5_sq_detail.idsqdetail
m5_pi_detail.idsodetail = m5_so_detail.idsodetail
m5_pi_detail.idpldetail = m5_pl_detail.idpldetail
m5_pl_detail.idpidetail = m5_pi_detail.idpidetail
m5_do_detail.idpidetail = m5_pi_detail.idpidetail
m5_dr_detail.idpidetail = m5_pi_detail.idpidetail
m5_rnr_detail.idsidetail = m5_si_detail.idsidetail
m5_sr_detail.idsidetail = m5_si_detail.idsidetail
m5_sr_detail.idrnrdetail = m5_rnr_detail.idrnrdetail
```

### Piutang dan pembayaran

```sql
m5_ic.icid = m5_ic_detail.idic
m5_pv.pvid = m5_pv_detail.idpv
m5_pv_detail.idicdetail = m5_ic_detail.idicdetail
m5_rp.rpid = m5_rp_pay.idrp
m5_rp.rpidsi = m5_si.siid
m5_as.asid = m5_as_pay.idas
m5_ip.ipid = m5_ip_pay.idip
m5_as.asidip = m5_ip.ipid
m5_si.siidas = m5_as.asid
```

### Customer dan item master

```sql
m5_sq.sqcustomer = m1_contact.kid
m5_so.socustomer = m1_contact.kid
m5_do.docustomer = m1_contact.kid
m5_dr.drcustomer = m1_contact.kid
m5_pi.picustomer = m1_contact.kid
m5_si.sicustomer = m1_contact.kid
m5_rnr.rnrcustomer = m1_contact.kid
m5_sr.srcustomer = m1_contact.kid
m5_ic.iccustomer = m1_contact.kid
m5_pv.pvcustomer = m1_contact.kid
m5_rp.rpkontak = m1_contact.kid
m5_spa_detail.kontak = m1_contact.kid
```

```sql
m5_sq_detail.idbarang = m1_item.bid
m5_so_detail.idbarang = m1_item.bid
m5_pl_detail.idbarang = m1_item.bid
m5_do_detail.idbarang = m1_item.bid
m5_dr_detail.idbarang = m1_item.bid
m5_pi_detail.idbarang = m1_item.bid
m5_si_detail.idbarang = m1_item.bid
m5_si_material.idbarang = m1_item.bid
m5_rnr_detail.idbarang = m1_item.bid
m5_sr_detail.idbarang = m1_item.bid
```

## Relasi Polymorphic

### `m5_ic_detail`

Gunakan `sumber` untuk menentukan target `idtransaksi`:

```sql
sumber = 'AS' -> m5_as.asid
sumber = 'SI' -> m5_si.siid
sumber = 'SR' -> m5_sr.srid
```

Contoh aman:

```sql
LEFT JOIN m5_as a
  ON icd.sumber = 'AS' AND icd.idtransaksi = a.asid
LEFT JOIN m5_si si
  ON icd.sumber = 'SI' AND icd.idtransaksi = si.siid
LEFT JOIN m5_sr sr
  ON icd.sumber = 'SR' AND icd.idtransaksi = sr.srid
```

### `m5_pv_detail`

Gunakan `sumber` untuk menentukan target `idtransaksi`:

```sql
sumber = 'SI' -> m5_si.siid
sumber = 'SR' -> m5_sr.srid
```

### `m5_sie_detail`

Gunakan `sumber` untuk menentukan target `idtransaksi`:

```sql
sumber = 'SI' -> m5_si.siid
sumber = 'SR' -> m5_sr.srid
```

## Aturan Pemilihan Tabel

- Gunakan tabel header bila pertanyaan fokus pada nomor dokumen, tanggal, customer, status, total, atau ringkasan transaksi.
- Gunakan tabel detail bila pertanyaan fokus pada item, kuantitas, harga, diskon, progres realisasi, atau gudang.
- Gunakan tabel `_history` hanya bila user eksplisit meminta histori, perubahan, audit trail, atau versi lama dokumen.
- Gunakan `m5_cl` bila pertanyaan fokus pada status lintas dokumen atau progres realisasi per item/customer.
- Gunakan `m5_spa` bila pertanyaan fokus pada poin customer.
- Gunakan `m5_sie` bila pertanyaan fokus pada tukar faktur, regrouping invoice, atau pengaitan ulang invoice/retur.

## Aturan Penting

- Kolom `idtransaksi` pada `m5_ic_detail`, `m5_pv_detail`, dan `m5_sie_detail` tidak boleh di-join langsung tanpa memeriksa `sumber`.
- Kolom `carabayar` berarti metode pembayaran, bukan nilai nominal.
- Kolom `asalbarang` berarti asal atau sumber barang, bukan identitas barang utama.
- Kolom `kodepa` adalah kode referensi PA internal; jangan diasumsikan sebagai foreign key pasti tanpa bukti query tambahan.
- Kolom `customtext*`, `customint*`, `customdbl*`, `customdate*` adalah field tambahan. Hindari memakainya kecuali user atau report memang merujuk field tersebut.

## Pola Query Aman

### Ringkasan dokumen

Gunakan header saja:

```sql
SELECT sqnotransaksi, sqtgl, sqcustomer, sqstatus, sqtotaltransaksi
FROM m5_sq
```

### Item per dokumen

Join header ke detail:

```sql
SELECT so.sonotransaksi, sod.idbarang, sod.namabarang, sod.jmlbarang
FROM m5_so so
JOIN m5_so_detail sod ON sod.idso = so.soid
```

### Tracing alur dokumen

Mulai dari detail:

```sql
SQ -> SQ_DETAIL -> SO_DETAIL -> PL_DETAIL / DO_DETAIL -> DR_DETAIL
```

### Penagihan dan pembayaran

```sql
IC -> IC_DETAIL -> PV_DETAIL -> PV
```

### Invoice dan retur

```sql
SI -> SI_DETAIL -> RNR_DETAIL -> SR_DETAIL
```

## Query yang Perlu Extra Caution

- pertanyaan lintas `SI`, `SR`, `AS` melalui `m5_ic_detail`
- pertanyaan pembayaran yang memakai `m5_pv_detail.idtransaksi`
- pertanyaan tukar faktur yang memakai `m5_sie_detail.idtransaksi`
- pertanyaan histori yang mencampur tabel aktif dan `_history`
- pertanyaan yang mengandalkan `custom*`

## Checklist NL2SQL M5

- pilih header vs detail lebih dulu
- cek apakah relasi perlu `sumber`
- gunakan join dari `join_hints` bila tersedia
- pakai master `m1_contact`, `m1_item`, `m0_payment_method` hanya saat butuh label/nama
- hindari asumsi foreign key untuk `kodepa` dan `custom*`
