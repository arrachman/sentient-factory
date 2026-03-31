# M4 NL2SQL Guide

Sumber utama:
- `semantic-schema-m4.json`
- `semantic-schema-m4-summary.md`
- `m4-queries.md`

Tujuan:
- membantu pemilihan tabel M4 purchasing
- membantu pemilihan join yang aman
- menandai relasi polymorphic yang harus ditangani dengan `sumber`
- memberi sinonim bisnis yang natural untuk retrieval

## Cakupan Tabel Utama

- `m4_pr`, `m4_pr_detail`: purchase request, permintaan pembelian
- `m4_rq`, `m4_rq_detail`: request quotation, permintaan penawaran
- `m4_rfq`, `m4_rfq_detail`: request for quotation, RFQ supplier
- `m4_cs`, `m4_cs_detail`: comparative sheet, perbandingan supplier
- `m4_bs`, `m4_bs_detail`: bid selection, seleksi penawaran vendor
- `m4_po`, `m4_po_detail`: purchase order
- `m4_grn`, `m4_grn_detail`: goods receipt note, penerimaan barang
- `m4_ri`, `m4_ri_detail`, `m4_ri_pay`: receive invoice, tagihan pembelian
- `m4_dnr`, `m4_dnr_detail`: debit note return, retur pembelian finansial
- `m4_prt`, `m4_prt_detail`: purchase return, retur pembelian barang
- `m4_ap`, `m4_ap_pay`: advance purchase, uang muka pembelian
- `m4_pp`, `m4_pp_pay`: purchase payment, pembayaran pembelian
- `m4_vpp`, `m4_vpp_detail`, `m4_vpp_pay`: vendor payment proposal
- `m4_vp`, `m4_vp_detail`, `m4_vp_pay`: vendor payment
- `m4_ipc`, `m4_ipc_detail`: incoming purchase cost, biaya pembelian masuk
- `m4_pie`, `m4_pie_detail`: purchase invoice exchange, tukar faktur pembelian

## Sinonim Bisnis

- `PR`: purchase request, permintaan pembelian
- `RQ`: request quotation, permintaan penawaran
- `RFQ`: request for quotation, RFQ, permintaan penawaran supplier
- `CS`: comparative sheet, perbandingan supplier
- `BS`: bid selection, seleksi penawaran vendor
- `PO`: purchase order, order pembelian
- `GRN`: goods receipt note, penerimaan barang
- `RI`: receive invoice, invoice pembelian, tagihan pembelian
- `DNR`: debit note return, nota debit retur pembelian
- `PRT`: purchase return, retur pembelian
- `AP`: advance purchase, uang muka pembelian
- `PP`: purchase payment, pembayaran pembelian
- `VPP`: vendor payment proposal, proposal pembayaran vendor
- `VP`: vendor payment, pembayaran vendor
- `IPC`: incoming purchase cost, biaya pembelian masuk
- `PIE`: purchase invoice exchange, tukar faktur pembelian

## Join Hints Utama

### Alur permintaan sampai order pembelian

```sql
m4_pr.prid = m4_pr_detail.idpr
m4_pr_detail.idprdetail = m4_rq_detail.idprdetail
m4_rq.rqid = m4_rq_detail.idrq
m4_rq_detail.idrqdetail = m4_bs_detail.idrqdetail
m4_bs.bsid = m4_bs_detail.idbs
m4_po.poid = m4_po_detail.idpo
```

### Alur order ke penerimaan dan tagihan

```sql
m4_po.poid = m4_po_detail.idpo
m4_po_detail.idpodetail = m4_grn_detail.idpodetail
m4_grn.grnid = m4_grn_detail.idgrn
m4_grn_detail.idgrndetail = m4_ri_detail.idgrndetail
m4_ri.riid = m4_ri_detail.idri
```

### Alur retur pembelian

```sql
m4_ri.riid = m4_ri_detail.idri
m4_ri_detail.idridetail = m4_dnr_detail.idridetail
m4_dnr.dnrid = m4_dnr_detail.iddnr
m4_dnr_detail.iddnrdetail = m4_prt_detail.iddnrdetail
m4_prt.prtid = m4_prt_detail.idprt
```

### Uang muka dan pembayaran pembelian

```sql
m4_po.poid = m4_ap.apidpo
m4_ap.apid = m4_ap_pay.idap
m4_ri.riidap = m4_ap.apid
m4_pp.ppid = m4_pp_pay.idpp
```

### Proposal dan realisasi pembayaran vendor

```sql
m4_vpp.vppid = m4_vpp_detail.idvpp
m4_vp.vpid = m4_vp_detail.idvp
m4_vpp_pay.idvpp = m4_vpp.vppid
m4_vp_pay.idvp = m4_vp.vpid
```

### Comparative sheet dan seleksi vendor

```sql
m4_pr.prid = m4_cs.csidpr
m4_cs.csid = m4_cs_detail.idcs
m4_rq.rqid = m4_rq_detail.idrq
m4_rq.idcs = m4_cs.csid
m4_bs_detail.idrqdetail = m4_rq_detail.idrqdetail
```

### Tukar faktur pembelian

```sql
m4_pie.pieid = m4_pie_detail.idpie
m4_pie.idri = m4_ri.riid
```

## Relasi Polymorphic

### `m4_vpp_detail`

Gunakan `sumber` untuk menentukan target `idtransaksi`:

```sql
sumber = 'AP' -> m4_ap.apid
sumber = 'RI' -> m4_ri.riid
sumber = 'PRT' -> m4_prt.prtid
```

### `m4_vp_detail`

Gunakan `sumber` untuk menentukan target `idtransaksi`:

```sql
sumber = 'AP' -> m4_ap.apid
sumber = 'RI' -> m4_ri.riid
sumber = 'PRT' -> m4_prt.prtid
```

### `m4_pie_detail`

Gunakan `sumber` untuk menentukan target `idtransaksi`:

```sql
sumber mengikuti dokumen purchasing sumber pada transaksi exchange
```

## Aturan Pemilihan Tabel

- Gunakan tabel header bila pertanyaan fokus pada nomor dokumen, tanggal, supplier, status, total, atau ringkasan transaksi.
- Gunakan tabel detail bila pertanyaan fokus pada item, kuantitas, harga, perbandingan vendor, atau progres realisasi barang.
- Gunakan tabel `_history` hanya bila user eksplisit meminta histori, perubahan, audit trail, atau versi lama dokumen.
- Gunakan `m4_cs` dan `m4_bs` bila pertanyaan fokus pada evaluasi vendor, perbandingan penawaran, atau vendor terpilih.
- Gunakan `m4_vpp` atau `m4_vp` bila pertanyaan fokus pada proposal pembayaran dan realisasi pembayaran vendor.
- Gunakan `m4_ipc` bila pertanyaan fokus pada biaya tambahan pembelian atau landed cost.
- Gunakan `m4_pie` bila pertanyaan fokus pada tukar faktur pembelian atau regrouping invoice pembelian.

## Aturan Penting

- Kolom `idtransaksi` pada `m4_vpp_detail`, `m4_vp_detail`, dan `m4_pie_detail` tidak boleh di-join langsung tanpa memeriksa `sumber`.
- Untuk alur pembayaran vendor, bedakan `proposal` (`m4_vpp`) dan `realisasi` (`m4_vp`).
- Untuk analitik pembelian per supplier, prioritaskan relasi ke `m1_contact`.
- Untuk analitik item/barang, prioritaskan relasi ke `m1_item`.
- Field `customtext*`, `customint*`, `customdbl*`, `customdate*` adalah field tambahan. Hindari memakainya kecuali user atau report memang merujuk field tersebut.
- Banyak query legacy M4 memakai tabel history dan status posting/close. Gunakan filter status hanya bila benar-benar diminta atau tersedia di semantic schema.

## Pola Query Aman

### Ringkasan dokumen pembelian

Gunakan header saja:

```sql
SELECT ponotransaksi, potgl, posupplier, postatus, pototaltransaksi
FROM m4_po
```

### Item per dokumen

Join header ke detail:

```sql
SELECT po.ponotransaksi, pod.idbarang, pod.namabarang, pod.jmlbarang
FROM m4_po po
JOIN m4_po_detail pod ON pod.idpo = po.poid
```

### Tracing alur pembelian

Mulai dari detail:

```sql
PR -> PR_DETAIL -> RQ_DETAIL -> BS_DETAIL -> PO_DETAIL -> GRN_DETAIL -> RI_DETAIL
```

### Retur pembelian

```sql
RI -> RI_DETAIL -> DNR_DETAIL -> PRT_DETAIL
```

### Proposal dan pembayaran vendor

```sql
VPP -> VPP_DETAIL -> VP_DETAIL -> VP
```

## Query yang Perlu Extra Caution

- pertanyaan lintas `AP`, `RI`, `PRT` melalui `m4_vpp_detail`
- pertanyaan pembayaran vendor yang memakai `m4_vp_detail.idtransaksi`
- pertanyaan tukar faktur yang memakai `m4_pie_detail.idtransaksi`
- pertanyaan histori yang mencampur tabel aktif dan `_history`
- pertanyaan yang mengandalkan `custom*`

## Checklist NL2SQL M4

- pilih header vs detail lebih dulu
- cek apakah relasi perlu `sumber`
- gunakan join dari alur purchasing yang sudah diketahui
- pakai master `m1_contact`, `m1_item`, `m1_branch`, `m1_location` saat butuh label/nama
- bedakan proposal pembayaran vs realisasi pembayaran
- hindari asumsi foreign key untuk `custom*`
