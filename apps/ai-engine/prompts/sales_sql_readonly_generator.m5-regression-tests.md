# Sales SQL Readonly Generator M5 Regression Tests

Tujuan:
- mengecek pemilihan tabel header vs detail
- mengecek join flow M5
- mengecek relasi polymorphic berbasis `sumber`
- mengecek area piutang, pembayaran, tukar faktur, dan status realisasi

Cara pakai:
- jalankan pertanyaan user ke prompt generator
- bandingkan hasil query dengan `expected_sql_shape`
- validasi bahwa tabel wajib dan join wajib benar-benar dipakai

## Test 1

**question**
Daftar 20 penawaran penjualan terbaru beserta customer dan total transaksinya

**intent**
listing header SQ

**must_use_tables**
- `m5_sq`

**should_use_tables**
- `m1_contact`

**must_not_use_tables**
- `m5_sq_detail`

**expected_sql_shape**
```sql
SELECT
  sq.sqnotransaksi,
  sq.sqtgl,
  sq.sqcustomer,
  sq.sqtotaltransaksi
FROM m5_sq sq
LEFT JOIN m1_contact c ON sq.sqcustomer = c.kid
ORDER BY sq.sqtgl DESC
LIMIT 20
```

## Test 2

**question**
Tampilkan item barang pada sales order tertentu beserta qty dan harga

**intent**
detail item SO

**must_use_tables**
- `m5_so`
- `m5_so_detail`

**should_use_tables**
- `m1_item`

**must_have_joins**
- `m5_so.soid = m5_so_detail.idso`

**expected_sql_shape**
```sql
SELECT
  so.sonotransaksi,
  sod.idbarang,
  sod.namabarang,
  sod.jmlbarang,
  sod.harga
FROM m5_so so
JOIN m5_so_detail sod ON sod.idso = so.soid
WHERE so.sonotransaksi = ?
```

## Test 3

**question**
Tampilkan progres dokumen dari quotation ke sales order dan delivery order untuk setiap item quotation

**intent**
document tracing SQ -> SO -> DO

**must_use_tables**
- `m5_sq_detail`
- `m5_so_detail`
- `m5_do_detail`

**must_have_joins**
- `m5_sq_detail.idsqdetail = m5_so_detail.idsqdetail`
- `m5_so_detail.idsodetail = m5_do_detail.idsodetail`

**expected_sql_shape**
```sql
SELECT
  sqd.idsqdetail,
  sod.idsodetail,
  dod.iddodetail
FROM m5_sq_detail sqd
LEFT JOIN m5_so_detail sod ON sod.idsqdetail = sqd.idsqdetail
LEFT JOIN m5_do_detail dod ON dod.idsodetail = sod.idsodetail
```

## Test 4

**question**
Daftar invoice penjualan yang belum lunas beserta nilai total dan jumlah pembayarannya

**intent**
open sales invoice

**must_use_tables**
- `m5_si`

**should_use_columns**
- `sitotaltransaksi`
- `sijmlbayar`

**must_not_use_tables**
- `m5_si_detail`

**expected_sql_shape**
```sql
SELECT
  si.sinotransaksi,
  si.sitgl,
  si.sitotaltransaksi,
  si.sijmlbayar
FROM m5_si si
WHERE si.sijmlbayar < si.sitotaltransaksi
```

## Test 5

**question**
Daftar tagihan invoice collection yang berasal dari sales invoice

**intent**
IC detail polymorphic to SI

**must_use_tables**
- `m5_ic_detail`
- `m5_si`

**must_have_conditions**
- `m5_ic_detail.sumber = 'SI'`

**must_have_joins**
- `m5_ic_detail.idtransaksi = m5_si.siid`

**expected_sql_shape**
```sql
SELECT
  icd.idicdetail,
  si.sinotransaksi,
  icd.jmlbayar
FROM m5_ic_detail icd
JOIN m5_si si
  ON icd.sumber = 'SI'
 AND icd.idtransaksi = si.siid
```

## Test 6

**question**
Daftar payment voucher yang membayar sales return

**intent**
PV detail polymorphic to SR

**must_use_tables**
- `m5_pv`
- `m5_pv_detail`
- `m5_sr`

**must_have_conditions**
- `m5_pv_detail.sumber = 'SR'`

**must_have_joins**
- `m5_pv.pvid = m5_pv_detail.idpv`
- `m5_pv_detail.idtransaksi = m5_sr.srid`

**expected_sql_shape**
```sql
SELECT
  pv.pvnotransaksi,
  sr.srnotransaksi,
  pvd.jmlbayar
FROM m5_pv pv
JOIN m5_pv_detail pvd ON pvd.idpv = pv.pvid
JOIN m5_sr sr
  ON pvd.sumber = 'SR'
 AND pvd.idtransaksi = sr.srid
```

## Test 7

**question**
Tampilkan dokumen tukar faktur penjualan beserta invoice dan retur sumbernya

**intent**
SIE polymorphic source

**must_use_tables**
- `m5_sie`
- `m5_sie_detail`

**should_use_tables**
- `m5_si`
- `m5_sr`

**must_have_joins**
- `m5_sie.sieid = m5_sie_detail.idsie`

**must_have_conditions**
- `m5_sie_detail.sumber` checked before joining to target document

**expected_sql_shape**
```sql
SELECT
  sie.sienotransaksi,
  sied.sumber,
  sied.idtransaksi
FROM m5_sie sie
JOIN m5_sie_detail sied ON sied.idsie = sie.sieid
LEFT JOIN m5_si si
  ON sied.sumber = 'SI'
 AND sied.idtransaksi = si.siid
LEFT JOIN m5_sr sr
  ON sied.sumber = 'SR'
 AND sied.idtransaksi = sr.srid
```

## Test 8

**question**
Daftar customer dengan penyesuaian poin penjualan terbesar

**intent**
SPA with contact join

**must_use_tables**
- `m5_spa`
- `m5_spa_detail`

**should_use_tables**
- `m1_contact`

**must_have_joins**
- `m5_spa.spaid = m5_spa_detail.idspa`
- `m5_spa_detail.kontak = m1_contact.kid`

**expected_sql_shape**
```sql
SELECT
  spad.kontak,
  spad.poinmasuk,
  spad.poinkeluar,
  spad.poinbaru
FROM m5_spa spa
JOIN m5_spa_detail spad ON spad.idspa = spa.spaid
LEFT JOIN m1_contact c ON spad.kontak = c.kid
ORDER BY spad.poinbaru DESC
LIMIT 100
```

## Test 9

**question**
Daftar piutang ongkos kirim per invoice penjualan

**intent**
RP to SI join

**must_use_tables**
- `m5_rp`
- `m5_si`

**must_have_joins**
- `m5_rp.rpidsi = m5_si.siid`

**expected_sql_shape**
```sql
SELECT
  rp.rpnotransaksi,
  si.sinotransaksi,
  rp.rpjumlah,
  rp.rpjumlahbayar
FROM m5_rp rp
JOIN m5_si si ON rp.rpidsi = si.siid
```

## Test 10

**question**
Tampilkan status realisasi per item customer dari sales order sampai invoice

**intent**
status realization via CL

**must_use_tables**
- `m5_cl`

**should_use_tables**
- `m5_so`
- `m1_contact`
- `m1_item`

**must_not_use_tables**
- `m5_cl_history`

**expected_sql_shape**
```sql
SELECT
  cl.clcustomer,
  cl.clidbarang,
  cl.clstatuspi,
  cl.clstatuspl,
  cl.clstatusdo,
  cl.clstatusdr,
  cl.clstatussi,
  cl.clstatusrealisasi
FROM m5_cl cl
LEFT JOIN m5_so so ON cl.clidso = so.soid
LEFT JOIN m1_contact c ON cl.clcustomer = c.kid
LEFT JOIN m1_item i ON cl.clidbarang = i.bid
```

## Quick Checklist

- bila pertanyaan dokumen ringkas, hindari tabel detail
- bila pertanyaan item, pakai tabel detail
- bila ada `idtransaksi` + `sumber`, wajib pakai join polymorphic
- bila pertanyaan progres lintas dokumen, ikuti join flow M5
- bila pertanyaan histori, baru pakai tabel `_history`
