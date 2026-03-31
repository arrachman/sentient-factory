# M3 NL2SQL Guide

Sumber utama:
- `semantic-schema-m3.json`
- `semantic-schema-m3-summary.md`
- `m3-queries.md`

Tujuan:
- membantu pemilihan tabel M3 inventory
- membantu pemilihan join yang aman
- memberi sinonim bisnis yang natural untuk retrieval
- menandai alur dokumen inventory yang paling sering dipakai

## Cakupan Tabel Utama

- `m3_mr`, `m3_mr_detail`: material request, permintaan barang
- `m3_ts`, `m3_ts_detail`: transfer stock, mutasi barang
- `m3_rs`, `m3_rs_detail`: receive stock, terima mutasi
- `m3_sa`, `m3_sa_detail`: stock adjustment, transaksi barang
- `m3_sp`, `m3_sp_detail`: stock opname
- `m3_ib`, `m3_ib_detail`: opening balance inventory, saldo awal barang
- `m3_pa`, `m3_pa_detail`: set harga jual
- `m3_rf`, `m3_rf_detail`: pengisian bahan bakar
- `m3_dc`, `m3_dc_detail`, `m3_dc_check`: daily check, time sheet, pengecekan harian
- `m3_rw`: warehouse transaction rw
- `m3_files`: lampiran transaksi inventory
- `m3_notes`: catatan transaksi inventory

## Sinonim Bisnis

- `MR`: material request, permintaan barang
- `TS`: transfer stock, mutasi barang, transfer antar gudang
- `RS`: receive stock, terima mutasi, penerimaan transfer
- `SA`: stock adjustment, transaksi barang, penyesuaian stok
- `SP`: stock opname, opname stok, stok fisik
- `IB`: opening balance inventory, saldo awal barang
- `PA`: set harga jual, pricing barang
- `RF`: pengisian bahan bakar, fuel refill
- `DC`: daily check, time sheet, pemeriksaan harian
- `RW`: warehouse transaction rw, transaksi gudang rw

## Join Hints Utama

### Alur permintaan barang ke mutasi stok

```sql
m3_mr.mrid = m3_mr_detail.idmr
m3_mr_detail.idmrdetail = m3_ts_detail.idmrdetail
m3_ts.tsid = m3_ts_detail.idts
```

### Alur permintaan barang ke terima mutasi

```sql
m3_mr.mrid = m3_mr_detail.idmr
m3_mr_detail.idmrdetail = m3_rs_detail.idmrdetail
m3_rs.rsid = m3_rs_detail.idrs
```

### Alur mutasi stok ke penerimaan mutasi

```sql
m3_ts.tsid = m3_ts_detail.idts
m3_ts_detail.idtsdetail = m3_rs_detail.idtsdetail
m3_rs.rsid = m3_rs_detail.idrs
```

### Alur stock opname ke transaksi penyesuaian

```sql
m3_sp.spid = m3_sp_detail.idsp
m3_sp_detail.idspdetail = m3_sa_detail.idspdetail
m3_sa.said = m3_sa_detail.idsa
```

### Relasi saldo awal barang

```sql
m3_ib.ibid = m3_ib_detail.idib
```

## Relasi Penting Tambahan

### Gudang dan item master

```sql
m3_ib_detail.idbarang = m1_item.bid
m3_mr_detail.idbarang = m1_item.bid
m3_ts_detail.idbarang = m1_item.bid
m3_rs_detail.idbarang = m1_item.bid
m3_sa_detail.idbarang = m1_item.bid
m3_sp_detail.idbarang = m1_item.bid
m3_dc.dcidbarang = m1_item_hauling.bid
```

```sql
m3_ib.ibgudang = m1_warehouse.wkode
m3_mr.mrgudangasal = m1_warehouse.wkode
m3_mr.mrgudangtujuan = m1_warehouse.wkode
m3_ts.tsgudangasal = m1_warehouse.wkode
m3_ts.tsgudangtujuan = m1_warehouse.wkode
m3_rs.rsgudangasal = m1_warehouse.wkode
m3_rs.rsgudangtujuan = m1_warehouse.wkode
m3_sa.sagudang = m1_warehouse.wkode
m3_sp.spgudang = m1_warehouse.wkode
```

## Relasi Polymorphic

- Tidak ada relasi polymorphic eksplisit yang terdeteksi dari schema dan query aktif M3.

## Aturan Pemilihan Tabel

- Gunakan tabel header bila pertanyaan fokus pada nomor dokumen, tanggal, gudang asal/tujuan, status, atau ringkasan transaksi.
- Gunakan tabel detail bila pertanyaan fokus pada item, kuantitas, satuan, harga, stok terakhir, atau progres realisasi.
- Gunakan tabel `_history` hanya bila user eksplisit meminta histori, perubahan, audit trail, atau versi lama dokumen.
- Gunakan `m3_sp` dan `m3_sp_detail` bila pertanyaan fokus pada selisih stok fisik, progres opname, atau hasil stock opname.
- Gunakan `m3_sa` bila pertanyaan fokus pada penyesuaian stok atau transaksi hasil opname.
- Gunakan `m3_dc` bila pertanyaan fokus pada daily check, time sheet, unit hauling, HM, atau checklist operasional.
- Gunakan `m3_pa` bila pertanyaan fokus pada harga jual barang.

## Aturan Penting

- M3 tidak punya relasi polymorphic eksplisit; prioritaskan foreign key langsung yang terlihat di join aktif.
- Untuk analitik alur inventory, mulai dari detail agar progres dokumen antar tahap lebih akurat.
- Untuk analitik per gudang, gunakan kolom gudang di header dan detail sesuai konteks asal, transit, atau tujuan.
- Untuk analitik item/barang, prioritaskan relasi ke `m1_item`; khusus daily check hauling gunakan `m1_item_hauling`.
- Field `customtext*`, `customint*`, `customdbl*`, `customdate*` adalah field tambahan. Hindari memakainya kecuali user atau report memang merujuk field tersebut.
- Daily check (`m3_dc`) memiliki tabel `m3_dc_check`; gunakan bila user meminta hasil checklist atau kategori checking.

## Pola Query Aman

### Ringkasan dokumen inventory

Gunakan header saja:

```sql
SELECT mrnotransaksi, mrtgl, mrgudangasal, mrgudangtujuan, mrstatus
FROM m3_mr
```

### Item per dokumen

Join header ke detail:

```sql
SELECT ts.tsnotransaksi, tsd.idbarang, tsd.namabarang, tsd.jmlbarang
FROM m3_ts ts
JOIN m3_ts_detail tsd ON tsd.idts = ts.tsid
```

### Tracing alur permintaan ke mutasi dan penerimaan

Mulai dari detail:

```sql
MR -> MR_DETAIL -> TS_DETAIL -> RS_DETAIL
```

### Stok opname ke penyesuaian

```sql
SP -> SP_DETAIL -> SA_DETAIL
```

### Saldo awal inventory

```sql
IB -> IB_DETAIL
```

## Query yang Perlu Extra Caution

- pertanyaan yang mencampur `MR`, `TS`, dan `RS` pada level header saja tanpa detail
- pertanyaan stock opname yang sebenarnya perlu `m3_sp_detail_progress` atau `m3_sp_progress`
- pertanyaan daily check yang perlu membedakan `m3_dc_detail` dan `m3_dc_check`
- pertanyaan histori yang mencampur tabel aktif dan `_history`
- pertanyaan yang mengandalkan `custom*`

## Checklist NL2SQL M3

- pilih header vs detail lebih dulu
- gunakan join flow inventory yang sesuai tahap dokumen
- pakai master `m1_item`, `m1_warehouse`, `m1_contact`, `m1_branch`, `m1_location` saat butuh label/nama
- untuk progres realisasi, prioritaskan detail dan status per baris
- untuk daily check, cek apakah user meminta checklist atau data unit/hauling
- hindari asumsi foreign key untuk `custom*`
