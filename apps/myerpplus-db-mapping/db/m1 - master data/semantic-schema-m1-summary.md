# Semantic Schema M1 Summary

Sumber schema: `/home/rania/apps/sentient-factory/apps/myerpplus-db-mapping/db/semantic-schema-m1.json`
Sumber function/query: `/home/rania/apps/sentient-factory/m1-queries.md`, `/home/rania/apps/sentient-factory/m1-queries-by-type.md`, `/home/rania/apps/sentient-factory/m0_report_rmoduleid_1.sql`

Total tabel M1 di schema: **49**
Total join hints eksplisit di schema: **0**
Total polymorphic relationships: **0**

Dokumen ini merangkum struktur domain master data `M1`. Fokus utamanya adalah contact, item, warehouse, branch, location, pricing, tax, COA, dan tabel referensi lintas domain lain.

## Ringkasan Domain

- **MASTER CONTACT**: `m1_contact`, `m1_contact_category`, `m1_contact_terms`, `m1_contact_price`
- **MASTER ITEM**: `m1_item`, `m1_item_category`, `m1_item_type`, `m1_item_price`, `m1_item_supplier`, `m1_item_stock_warehouse`, `m1_item_location`, `m1_item_location_warehouse`, `m1_item_permission`, `m1_item_transaction`
- **MASTER ORGANIZATION**: `m1_branch`, `m1_location`, `m1_division`, `m1_department`, `m1_subdepartment`, `m1_subdivision`, `m1_section`, `m1_project`, `m1_cost_center`
- **MASTER GEO**: `m1_country`, `m1_province`, `m1_city`
- **MASTER COMMERCIAL**: `m1_terms`, `m1_tax`, `m1_currency`, `m1_bank`, `m1_expedition`, `m1_salesman_category`, `m1_customer_category`, `m1_supplier_category`
- **MASTER PRODUCT ATTRIBUTE**: `m1_class_product`, `m1_price_category`, `m1_price_category_detail`, `m1_material`, `m1_merk`, `m1_model`, `m1_size`, `m1_type_sa`, `m1_unit`, `m1_other_cost`
- **MASTER FINANCE REFERENCE**: `m1_coa`
- **MASTER WAREHOUSE**: `m1_warehouse`
- **MASTER NOTE**: `m1_transaction_note`, `m1_transaction_note_detail`

## Tabel Inti

### `m1_contact`

Master kontak bisnis untuk customer, supplier, salesman, dan rekanan lain.

Kolom penting yang terlihat dari query aktif:
- `kid`, `kkode`, `knama`
- `kkategori`
- `kcabang`, `klokasi`, `kgudang`
- `kkategoricustomer`, `kkategorisupplier`, `kkategorisalesman`
- `ksalesman`
- `kterminbeli`, `kterminjual`
- `ktingkatjual`
- `kaktif`

Join yang sering terlihat:
- `m1_contact.kkategori -> m1_contact_category.cckode`
- `m1_contact.kkategoricustomer -> m1_customer_category.cckode`
- `m1_contact.kkategorisupplier -> m1_supplier_category.sckode`
- `m1_contact.kkategorisalesman -> m1_salesman_category.sckode`
- `m1_contact.ksalesman -> m1_contact.kid`
- `m1_contact.karea -> m1_area.akode`

### `m1_item`

Master barang/jasa lintas inventory, purchasing, dan sales.

Kolom penting yang terlihat dari schema dan query:
- `bid`, `bkode`, `bnama`
- `bkategori`, `btipe`
- `bsatuan`
- `bkelasproduk`
- `bsubdepartemen`
- `bkomisi`
- akun-akun referensi pembelian, penjualan, dan persediaan

Join yang sering terlihat:
- `m1_item.bkelasproduk -> m1_class_product.cpkode`
- `m1_item.bsubdepartemen -> m1_subdepartment.sdpkode`
- `m1_item.bkomisi -> m1_selling_point.spid`

### `m1_warehouse`

Master gudang yang dipakai oleh domain inventory, purchasing, dan sales.

Kolom penting:
- `wkode`, `wnama`
- `wdivisi`, `wlokasi`
- `waktif`
- `wbookingstok`

Join yang sering terlihat:
- `m1_warehouse.wdivisi -> m1_division.dkode`
- `m1_warehouse.wlokasi -> m1_location.lkode`

### `m1_coa`

Chart of accounts untuk semua transaksi keuangan.

Kolom penting:
- `cid`, `cnomor`, `cnama`
- `ctipe`, `cdc`
- `cparent`
- `ccabang`, `clokasi`, `cdivisi`
- `cmatauang`, `ckodebank`
- `csaldoawal`, `csaldoberjalan`

Join yang sering terlihat:
- `m1_coa.cparent -> m1_coa.cnomor`
- `m1_coa.ccabang -> m1_branch.bkode`
- `m1_coa.clokasi -> m1_location.lkode`
- `m1_coa.cdivisi -> m1_division.dkode`
- `m1_coa.ckodebank -> m1_bank.bkode`
- `m1_coa.cmatauang -> m1_currency.ckode`

## Relasi Penting

### Contact hierarchy and commercial setup

```sql
m1_contact.kkategori = m1_contact_category.cckode
m1_contact.kkategoricustomer = m1_customer_category.cckode
m1_contact.kkategorisupplier = m1_supplier_category.sckode
m1_contact.kkategorisalesman = m1_salesman_category.sckode
m1_contact.ksalesman = m1_contact.kid
```

### Item classification and pricing

```sql
m1_item.bkelasproduk = m1_class_product.cpkode
m1_item.bsubdepartemen = m1_subdepartment.sdpkode
m1_item.bkomisi = m1_selling_point.spid
m1_price_category.pckode = m1_price_category_detail.idpricecategory
```

### Warehouse and organization

```sql
m1_warehouse.wdivisi = m1_division.dkode
m1_warehouse.wlokasi = m1_location.lkode
m1_location.lcabang = m1_branch.bkode
```

### COA reference

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

## Catatan Domain

- M1 adalah domain master data. Banyak tabelnya dipakai lintas domain lain.
- M1 umumnya tidak punya alur dokumen bertahap seperti M4 atau M5.
- Fokus utama NL2SQL di M1 adalah lookup, listing, relasi referensi, klasifikasi, dan master setup.
- Risiko utama M1 bukan polymorphic relationship, tetapi salah memilih tabel master yang terlalu mirip atau salah menangkap hierarki organisasi dan item.
