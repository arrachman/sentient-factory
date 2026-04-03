# M1 NL2SQL Guide

Sumber utama:
- `semantic-schema-m1.json`
- `semantic-schema-m1-summary.md`
- `m1-queries.md`
- `m1-queries-by-type.md`

Tujuan:
- membantu pemilihan tabel master data M1
- membantu pemilihan join referensi yang aman
- memberi sinonim bisnis yang natural untuk retrieval
- menandai relasi master yang paling sering dipakai lintas domain

## Cakupan Tabel Utama

- `m1_contact`, `m1_contact_category`, `m1_contact_terms`, `m1_contact_price`: master kontak dan setup komersial kontak
- `m1_item`, `m1_item_category`, `m1_item_type`, `m1_item_price`, `m1_item_supplier`, `m1_item_stock_warehouse`, `m1_item_location`, `m1_item_location_warehouse`, `m1_item_permission`, `m1_item_transaction`: master item dan setup barang
- `m1_warehouse`: master gudang
- `m1_branch`, `m1_location`, `m1_division`, `m1_department`, `m1_subdepartment`, `m1_subdivision`, `m1_section`, `m1_project`, `m1_cost_center`: struktur organisasi
- `m1_coa`: master akun
- `m1_terms`, `m1_tax`, `m1_currency`, `m1_bank`, `m1_expedition`: master referensi komersial dan keuangan
- `m1_country`, `m1_province`, `m1_city`: master geografis
- `m1_class_product`, `m1_price_category`, `m1_price_category_detail`, `m1_material`, `m1_merk`, `m1_model`, `m1_size`, `m1_type_sa`, `m1_unit`, `m1_other_cost`: atribut produk dan klasifikasi
- `m1_transaction_note`, `m1_transaction_note_detail`: catatan transaksi per sumber dokumen

## Sinonim Bisnis

- `CONTACT`: kontak, customer, supplier, salesman, rekanan
- `ITEM`: barang, produk, item, SKU
- `WAREHOUSE`: gudang
- `COA`: chart of accounts, akun, rekening
- `BRANCH`: cabang
- `LOCATION`: lokasi
- `TERMS`: termin pembayaran
- `TAX`: pajak
- `PRICE CATEGORY`: kategori harga
- `TRANSACTION NOTE`: catatan transaksi, note per sumber dokumen

## Join Hints Utama

### Contact commercial hierarchy

```sql
m1_contact.kkategori = m1_contact_category.cckode
m1_contact.kkategoricustomer = m1_customer_category.cckode
m1_contact.kkategorisupplier = m1_supplier_category.sckode
m1_contact.kkategorisalesman = m1_salesman_category.sckode
m1_contact.ksalesman = m1_contact.kid
```

### Item classification and related master

```sql
m1_item.bkelasproduk = m1_class_product.cpkode
m1_item.bsubdepartemen = m1_subdepartment.sdpkode
m1_item.bkomisi = m1_selling_point.spid
```

### Warehouse and organization

```sql
m1_warehouse.wdivisi = m1_division.dkode
m1_warehouse.wlokasi = m1_location.lkode
m1_location.lcabang = m1_branch.bkode
```

### COA master reference

```sql
m1_coa.cparent = m1_coa.cnomor
m1_coa.ccabang = m1_branch.bkode
m1_coa.clokasi = m1_location.lkode
m1_coa.cdivisi = m1_division.dkode
m1_coa.ckodebank = m1_bank.bkode
m1_coa.cmatauang = m1_currency.ckode
```

### Transaction note

```sql
m1_transaction_note.tnkode = m1_transaction_note_detail.tndkode
m1_transaction_note.tnsumber = m1_transaction_note_detail.tndsumber
```

## Relasi Polymorphic

- Tidak ada relasi polymorphic eksplisit yang terdeteksi pada M1.

## Aturan Pemilihan Tabel

- Gunakan `m1_contact` untuk pertanyaan customer, supplier, salesman, atau relasi kontak bisnis.
- Gunakan `m1_item` untuk pertanyaan barang, produk, setup item, klasifikasi item, dan atribut penjualan/pembelian.
- Gunakan `m1_warehouse`, `m1_branch`, `m1_location`, `m1_division` untuk struktur organisasi dan gudang.
- Gunakan `m1_coa` untuk lookup akun, saldo awal, parent-child akun, atau referensi akun transaksi.
- Gunakan tabel detail seperti `m1_price_category_detail` atau `m1_transaction_note_detail` bila user meminta isi baris atau setup per item/per sumber.
- Gunakan tabel referensi seperti `m1_terms`, `m1_tax`, `m1_currency`, `m1_bank` bila user meminta termin, pajak, mata uang, atau bank.

## Aturan Penting

- M1 adalah domain master data, bukan domain alur dokumen bertahap.
- Sebagian besar query M1 adalah listing, lookup, setup, dan relasi referensi.
- Hindari mengasumsikan foreign key yang tidak terlihat dari query aktif.
- Jika pertanyaan menyebut customer/supplier/salesman, mulai dari `m1_contact`, lalu join ke kategori atau salesman bila perlu.
- Jika pertanyaan menyebut produk/barang, mulai dari `m1_item`, lalu join ke klasifikasi item bila perlu.
- Jika pertanyaan menyebut akun, gunakan `m1_coa` dan perhatikan parent-child serta dimensi organisasi.
- `custom*` fields adalah field tambahan; hindari kecuali benar-benar diminta.

## Pola Query Aman

### Listing master kontak

```sql
SELECT kkode, knama, kkategori, kaktif
FROM m1_contact
```

### Listing master item

```sql
SELECT bkode, bnama, bkategori, btipe
FROM m1_item
```

### Lookup akun dan parent akun

```sql
SELECT cnomor, cnama, cparent
FROM m1_coa
```

### Gudang per lokasi dan divisi

```sql
SELECT w.wkode, w.wnama, l.lnama, d.dnama
FROM m1_warehouse w
JOIN m1_location l ON w.wlokasi = l.lkode
JOIN m1_division d ON w.wdivisi = d.dkode
```

### Transaction note per sumber

```sql
SELECT tn.tnsumber, tn.tnkode, tnd.tndcatatan
FROM m1_transaction_note tn
JOIN m1_transaction_note_detail tnd
  ON tn.tnkode = tnd.tndkode
 AND tn.tnsumber = tnd.tndsumber
```

## Query yang Perlu Extra Caution

- pertanyaan yang mencampur master contact dan transaksi bisnis, karena M1 hanya domain master
- pertanyaan yang menganggap semua kategori contact ada di satu tabel saja
- pertanyaan item yang sebenarnya butuh domain transaksi inventory, purchasing, atau sales
- pertanyaan akun yang sebenarnya meminta saldo transaksi, bukan master akun
- pertanyaan yang mengandalkan `custom*`

## Checklist NL2SQL M1

- pastikan pertanyaan memang domain master data, bukan domain transaksi
- pilih tabel master inti lebih dulu: contact, item, warehouse, coa, atau organization
- cek apakah butuh tabel kategori/detail
- gunakan join referensi yang jelas dan langsung
- hindari asumsi flow dokumen karena M1 bukan domain document flow
