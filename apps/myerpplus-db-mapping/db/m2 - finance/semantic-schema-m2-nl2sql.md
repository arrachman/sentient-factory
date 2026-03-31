# M2 NL2SQL Guide

Sumber utama:
- `semantic-schema-m2.json`
- `semantic-schema-m2-summary.md`
- `m2-queries.md`

Tujuan:
- membantu pemilihan tabel M2 finance/accounting
- membantu pemilihan join yang aman
- memberi sinonim bisnis yang natural untuk retrieval
- menandai alur transaksi kas, bank, giro, memo, dan jurnal yang paling sering dipakai

## Cakupan Tabel Utama

- `m2_cr`, `m2_cr_detail`: cash receipt, penerimaan kas
- `m2_cd`, `m2_cd_detail`: cash disbursement, pengeluaran kas
- `m2_bd`, `m2_bd_detail`: bank disbursement, pengeluaran bank
- `m2_cb`, `m2_cb_detail`, `m2_cb_pay`: cash bank transfer, transfer kas bank dan alokasi pembayaran
- `m2_rm`, `m2_rm_detail`, `m2_rm_pay`: receipt memo, memorial penerimaan dan payment allocation
- `m2_sm`, `m2_sm_detail`, `m2_sm_pay`: send memo, memorial pengeluaran dan payment allocation
- `m2_rg`, `m2_rg_detail`: receipt giro, giro masuk
- `m2_rgc`, `m2_rgc_detail`: receipt giro cair, pencairan giro masuk
- `m2_sg`, `m2_sg_detail`: send giro, giro keluar
- `m2_sgc`, `m2_sgc_detail`: send giro cair, pencairan giro keluar
- `m2_gj`, `m2_gj_detail`: general journal, jurnal umum
- `m2_aj`, `m2_aj_detail`: adjustment journal, jurnal penyesuaian
- `m2_jm`, `m2_jm_detail`: memorial journal, jurnal memorial
- `m2_transaction_journal`: jurnal transaksi terposting
- `m2_accounting_period`: periode akuntansi
- `m2_realization*`: realisasi budget per dimensi
- `m2_files`: lampiran transaksi finance
- `m2_notes`: catatan transaksi finance

## Sinonim Bisnis

- `CR`: cash receipt, penerimaan kas
- `CD`: cash disbursement, pengeluaran kas
- `BD`: bank disbursement, pengeluaran bank
- `CB`: cash bank transfer, transfer kas bank
- `RM`: receipt memo, memo penerimaan, memorial penerimaan
- `SM`: send memo, memo pengeluaran, memorial pengeluaran
- `RG`: receipt giro, giro masuk
- `RGC`: receipt giro cair, pencairan giro masuk
- `SG`: send giro, giro keluar
- `SGC`: send giro cair, pencairan giro keluar
- `GJ`: general journal, jurnal umum
- `AJ`: adjustment journal, jurnal penyesuaian
- `JM`: memorial journal, jurnal memorial
- `AP`: accounting period, periode akuntansi

## Join Hints Utama

### Alur penerimaan kas

```sql
m2_cr.crid = m2_cr_detail.idcr
```

### Alur pengeluaran kas

```sql
m2_cd.cdid = m2_cd_detail.idcd
```

### Alur pengeluaran bank

```sql
m2_bd.bdid = m2_bd_detail.idbd
```

### Relasi receipt memo dan alokasi pembayaran

```sql
m2_rm.rmid = m2_rm_detail.idrm
m2_rm.rmid = m2_rm_pay.idrm
```

### Relasi send memo dan alokasi pembayaran

```sql
m2_sm.smid = m2_sm_detail.idsm
m2_sm.smid = m2_sm_pay.idsm
```

### Relasi cash bank transfer

```sql
m2_cb.cbid = m2_cb_detail.idcb
m2_cb.cbid = m2_cb_pay.idcb
```

### Alur giro masuk dan pencairannya

```sql
m2_rg.rgid = m2_rg_detail.idrg
m2_rgc.rgcid = m2_rgc_detail.idrgc
```

### Alur giro keluar dan pencairannya

```sql
m2_sg.sgid = m2_sg_detail.idsg
m2_sgc.sgcid = m2_sgc_detail.idsgc
```

### Relasi jurnal transaksi terposting

```sql
m2_transaction_journal.tidtransaksi = finance document id
m2_transaction_journal.tsumber = kode sumber dokumen finance
```

## Relasi Penting Tambahan

### Kontak, rekening, dan akun

```sql
m2_cr.crkontak = m1_contact.kid
m2_cd.cdkontak = m1_contact.kid
m2_bd.bdkontak = m1_contact.kid
m2_rm.rmkontak = m1_contact.kid
m2_sm.smkontak = m1_contact.kid
m2_rg.rgkontak = m1_contact.kid
m2_sg.sgkontak = m1_contact.kid
```

```sql
m2_cr_detail.idcoa = m0_chart_of_account.raid
m2_cd_detail.idcoa = m0_chart_of_account.raid
m2_bd_detail.idcoa = m0_chart_of_account.raid
m2_gj_detail.idcoa = m0_chart_of_account.raid
m2_aj_detail.idcoa = m0_chart_of_account.raid
m2_jm_detail.idcoa = m0_chart_of_account.raid
```

## Relasi Polymorphic

- Tidak ada relasi polymorphic eksplisit yang terdeteksi dari schema dan query aktif M2.

## Aturan Pemilihan Tabel

- Gunakan tabel header bila pertanyaan fokus pada nomor dokumen, tanggal, kontak, rekening, mata uang, nilai total, atau status posting.
- Gunakan tabel detail bila pertanyaan fokus pada akun, nominal per baris, memo detail, distribusi jurnal, atau rincian alokasi.
- Gunakan tabel `_pay` bila pertanyaan fokus pada payment allocation, pelunasan, atau alokasi pembayaran memo dan transfer.
- Gunakan tabel `_history` hanya bila user eksplisit meminta histori, perubahan, audit trail, atau versi lama dokumen.
- Gunakan `m2_transaction_journal` bila pertanyaan fokus pada jurnal hasil posting dari dokumen finance.
- Gunakan `m2_realization*` bila pertanyaan fokus pada realisasi budget per cabang, lokasi, divisi, project, atau cost center.

## Aturan Penting

- M2 tidak punya relasi polymorphic eksplisit; prioritaskan foreign key langsung yang terlihat di join aktif.
- Untuk analitik kas dan bank, mulai dari header lalu join ke detail bila user meminta akun atau distribusi nominal.
- Untuk analitik pembayaran memo atau transfer, gunakan tabel `_pay` agar nilai alokasi tidak salah diambil dari header.
- Untuk giro, bedakan dokumen giro (`RG`, `SG`) dengan dokumen pencairan (`RGC`, `SGC`).
- Untuk jurnal, bedakan jurnal input manual (`GJ`, `AJ`, `JM`) dengan jurnal transaksi terposting (`m2_transaction_journal`).
- Field `customtext*`, `customint*`, `customdbl*`, `customdate*` adalah field tambahan. Hindari memakainya kecuali user atau report memang merujuk field tersebut.

## Pola Query Aman

### Ringkasan dokumen finance

Gunakan header saja:

```sql
SELECT crnotransaksi, crtgl, crkontak, crjumlahbayar
FROM m2_cr
```

### Distribusi akun per dokumen

Join header ke detail:

```sql
SELECT gj.gjnotransaksi, gjd.idcoa, gjd.jmldebet, gjd.jmlkredit
FROM m2_gj gj
JOIN m2_gj_detail gjd ON gjd.idgj = gj.gjid
```

### Memo dengan alokasi pembayaran

Mulai dari header dan tambahkan tabel pay:

```sql
RM -> RM_DETAIL -> RM_PAY
SM -> SM_DETAIL -> SM_PAY
CB -> CB_DETAIL -> CB_PAY
```

### Giro dan pencairannya

```sql
RG -> RG_DETAIL
RGC -> RGC_DETAIL
SG -> SG_DETAIL
SGC -> SGC_DETAIL
```

### Jurnal transaksi terposting

```sql
DOCUMENT -> m2_transaction_journal
```

## Query yang Perlu Extra Caution

- pertanyaan yang mencampur header memo dengan allocation pay tetapi tidak memakai tabel `_pay`
- pertanyaan giro yang mencampur dokumen giro dan pencairannya tanpa membedakan `RG/RGC` atau `SG/SGC`
- pertanyaan jurnal yang mencampur `GJ`, `AJ`, `JM`, dan `m2_transaction_journal`
- pertanyaan histori yang mencampur tabel aktif dan `_history`
- pertanyaan yang mengandalkan `custom*`

## Checklist NL2SQL M2

- pilih header vs detail lebih dulu
- cek apakah butuh tabel `_pay` atau cukup header/detail
- bedakan dokumen kas, bank, giro, memo, dan jurnal
- pakai `m1_contact`, `m0_chart_of_account`, `m1_branch`, `m1_location`, `m1_division`, `m1_project` saat butuh label master
- untuk pencairan giro, gunakan tabel pencairan khusus, bukan hanya dokumen giro asal
- untuk audit trail, pindah ke tabel `_history`
