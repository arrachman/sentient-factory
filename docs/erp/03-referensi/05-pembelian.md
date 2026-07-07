---
slug: /referensi/pembelian
sidebar_position: 6
title: Purchasing
---

# Purchasing

Modul **Purchasing** (`M4`) menjalankan **procure-to-pay**: dari permintaan
pembelian hingga pembayaran vendor. Setiap tahap menghasilkan dokumen yang
mengalir ke tahap berikutnya; GRN memengaruhi **stok**, faktur memengaruhi
**utang (AP)**, dan pembayaran menutup AP. Sub-navigasi: **Transactions**,
**Data**, **Reports**.

## Alur procure-to-pay

```
PR  →  RFQ  →  Bid Comparison  →  PO  →  GRN  →  Purchase Invoice  →  Vendor Payment
                                          │
                                          └→ Purchase Return (PRT) bila barang dikembalikan
```

## Transactions

### Purchase Requisition (PR)

**Permintaan pembelian** internal — titik awal kebutuhan barang sebelum menjadi
PO.

![Purchase Requisition](/img/erp/pur-pr.png)

### Request for Quotation (RFQ)

**Permintaan penawaran** ke beberapa vendor; hasilnya dibandingkan via **Bid
Comparison (BS)** untuk memilih pemenang.

![Request for Quotation](/img/erp/pur-rfq.png)

### Purchase Order (PO)

**Pesanan pembelian** resmi ke pemasok. Kolom daftar: No Transaksi, Tanggal,
Supplier, Uraian, Total, Status. Header memuat supplier & gudang penerimaan;
baris memuat item, qty, harga; pajak & total dihitung otomatis. Lihat panduan
langkah di **[Panduan Pengguna → Membuat Purchase Order](/panduan-pengguna/membuat-purchase-order)**.

![Purchase Order](/img/erp/pur-po.png)

### Goods Receipt (GRN)

**Penerimaan barang** atas PO. Memposting GRN **menambah stok** gudang dan
menjadi dasar pencocokan dengan faktur (3-way match: PO ↔ GRN ↔ Invoice).

![Goods Receipt](/img/erp/pur-grn.png)

### Purchase Invoice (PI)

**Faktur pembelian** dari pemasok. Posting → membentuk **utang (AP)** dan jurnal
pembelian.

![Purchase Invoice](/img/erp/pur-pi.png)

### Purchase Return (PRT)

**Retur pembelian** — mengembalikan barang ke pemasok; menurunkan stok dan
mengoreksi AP.

![Purchase Return](/img/erp/pur-prt.png)

### Vendor Payment (VP)

**Pembayaran vendor** yang menutup/mengurangi AP. Grup ini juga memuat **Vendor
Advance (AP)** (uang muka), **Freight Payable (PP)**, **Payment Schedule (VPP)**,
dan **Opening AP Balance** (saldo utang awal).

![Vendor Payment](/img/erp/pur-vp.png)

## Data & Reports

- **Data** — registry tiap jenis dokumen (PR/RFQ/BS/PO/GRN/PI/PRT/VP/…) untuk
  menelusuri, memfilter, dan mengelola dokumen yang sudah dibuat.
- **Reports** — rekap per dokumen plus **Purchases** (ringkasan pembelian).

:::info Dampak ke modul lain
**GRN** → Warehouse (stok bertambah). **Purchase Invoice** → Finance (AP +
jurnal). **Vendor Payment** → Finance (kas/bank keluar, AP berkurang). Itulah
mengapa master **Partner/Vendor**, **Item**, dan **CoA** harus benar lebih dulu.
:::
