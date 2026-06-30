---
slug: /referensi/master-data
sidebar_position: 3
title: Master Data
---

# Master Data

Modul **Master Data** (`M1`) menampung seluruh data acuan yang dipakai berulang
oleh transaksi. Data yang rapi di sini membuat seluruh modul lain akurat.
Sub-navigasi terbagi enam grup:

| Grup | Isi |
| --- | --- |
| **Organization** | Branch, Location, Warehouse, Division, Sub Division, Project, Cost Center, Department, Sub Department |
| **Items** | Items, kategori/tipe/unit, lokasi gudang (bin), price index, class/model/size/color, brand, material, dll |
| **Partners** | Partners, kategori partner/customer/supplier/salesman, bank, ekspedisi, vendor |
| **Finance Masters** | Chart of Accounts, Taxes, Currencies, Payment Terms, Other Costs |
| **Reference** | Country/Province/City/Area, catatan transaksi, tipe transaksi item, kategori produksi, dll |
| **Production** | Labor, Machine, Designer, Production Activity/Route, Sub Class |

## Organization

Struktur organisasi & lokasi fisik perusahaan. Ini adalah dimensi yang dipakai
hampir semua transaksi (cabang penerbit, gudang, divisi, cost center).

### Branch

Daftar **cabang** perusahaan — entitas penerbit dokumen dan basis pemisahan
akses.

![Branch](/img/erp/md-org-branches.png)

### Warehouse

**Gudang** tempat stok disimpan. Dipakai pada PO (gudang penerimaan), transfer,
stok opname, dan laporan stok.

![Warehouse](/img/erp/md-org-warehouses.png)

### Department & Cost Center

**Department** dan **Cost Center** adalah dimensi organisasi untuk alokasi biaya
dan pelaporan.

![Department](/img/erp/md-org-departments.png)

![Cost Center](/img/erp/md-org-cost-centers.png)

## Items

Inti master data manufaktur/distribusi.

### Items

Daftar **item/barang** dengan data lengkap. Kolom: Kode, Nama, Tipe (mis.
INVENTORY), Satuan, Kategori, Status. Mendukung **filter Status/Tipe**, pencarian,
**Export**, dan ribuan baris dengan pagination.

![Master Item](/img/erp/md-items.png)

Setiap item bisa memiliki atribut lanjutan (lihat sub-menu grup *Items*):
kategori, tipe, satuan, **lokasi gudang (bin)**, price index, kelas/model/ukuran/
warna, brand, dan material — berguna untuk manufaktur logam, fastener, dan
sejenisnya.

### Item Categories & Units

**Kategori item** mengelompokkan item untuk laporan & analisis; **Satuan (UoM)**
mendefinisikan unit ukur (KG, PCS, dll).

![Item Categories](/img/erp/md-item-categories.png)

![Units](/img/erp/md-units.png)

## Partners

**Partner** adalah entitas lawan transaksi (customer, supplier, salesman,
ekspedisi). Satu master partner dipakai lintas modul Sales & Purchasing.

![Partners](/img/erp/md-partners.png)

Grup Partners juga memuat kategori partner/customer/supplier/salesman, master
**Bank**, **Expedition**, dan **Vendor**.

## Finance Masters

### Chart of Accounts (CoA)

**Bagan akun** — fondasi akuntansi. Struktur kode akun berjenjang (mis.
`1101.01.001`) mengklasifikasi Aset/Kewajiban/Ekuitas/Pendapatan/Beban dan
menjadi basis seluruh jurnal & laporan keuangan.

![Chart of Accounts](/img/erp/md-accounts.png)

### Taxes, Currencies, Payment Terms

- **Taxes** — master pajak (tarif & akun) untuk perhitungan dokumen.
- **Currencies** — mata uang & kurs untuk transaksi multi-currency.
- **Payment Terms** — termin pembayaran (mis. NET 30) untuk AR/AP.

![Taxes](/img/erp/md-taxes.png)

![Currencies](/img/erp/md-currencies.png)

![Payment Terms](/img/erp/md-payment-terms.png)

## Reference

Data referensi pendukung: wilayah (Country/Province/City/Area), catatan
transaksi, tipe transaksi item, kategori produksi, dll.

![Country](/img/erp/md-countries.png)

## Production masters

Master khusus produksi: **Labor**, **Machine**, **Designer**, **Production
Activity/Route**, dan **Sub Class**. Dipakai oleh modul Production (BOM & Work
Order).

![Machine](/img/erp/md-machines.png)

:::note Konsistensi lintas-bahasa
Master data adalah sumber kebenaran yang dirujuk oleh banyak transaksi. Hindari
menghapus master yang sudah dipakai dokumen — gunakan **nonaktifkan**
(soft-delete) agar histori dokumen tetap utuh.
:::
