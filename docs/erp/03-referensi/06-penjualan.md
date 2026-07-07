---
slug: /referensi/penjualan
sidebar_position: 7
title: Sales
---

# Sales

Modul **Sales** (`M5`) menjalankan **order-to-cash**: dari penawaran hingga
penagihan piutang. Pengiriman memengaruhi **stok**, faktur memengaruhi
**piutang (AR)**, dan penagihan menutup AR. Sub-navigasi: **Transactions**,
**Data**, **Reports**.

## Alur order-to-cash

```
Sales Quotation  →  Sales Order  →  Delivery Order  →  Sales Invoice  →  AR Collection
                                          │
                                          └→ Sales Return (SR) bila barang dikembalikan
```

## Transactions

### Sales Quotation (SQ)

**Penawaran penjualan** ke calon pelanggan — harga & syarat sebelum menjadi
pesanan.

![Sales Quotation](/img/erp/sal-sq.png)

### Sales Order (SO)

**Pesanan penjualan** yang dikonfirmasi pelanggan; menjadi acuan pengiriman &
penagihan.

![Sales Order](/img/erp/sal-so.png)

### Delivery Order (DO)

**Surat jalan / pengiriman** barang ke pelanggan. Posting → **mengurangi stok**
gudang. Grup ini juga memuat **Packing List (PL)** dan **Delivery Report (DR)**.

![Delivery Order](/img/erp/sal-do.png)

### Sales Invoice (SI)

**Faktur penjualan**. Posting → membentuk **piutang (AR)** dan jurnal penjualan
(serta COGS atas barang terjual).

![Sales Invoice](/img/erp/sal-si.png)

### Sales Return (SR)

**Retur penjualan** — barang kembali dari pelanggan; menambah stok dan
mengoreksi AR. Didahului **Return Receipt (RNR)**.

![Sales Return](/img/erp/sal-sr.png)

### AR Collection (IC)

**Penagihan/penerimaan piutang** yang menutup/mengurangi AR. Grup ini juga
memuat **Customer Advance (AS)** (uang muka), **Payment Receipt (IP)**, **AR
Payment (PV)**, **Freight Receivable (RP)**, **Invoice Swap (SIE)**, dan
**Opening AR Balance**.

![AR Collection](/img/erp/sal-ic.png)

## Reports

Laporan penjualan kaya akan irisan analitis. **Sales Summary** adalah ringkasan
utama; tersedia pula **Sales by Customer / Salesman / Item / Project / Division /
Cost Center / Item Category / Group**, serta **Revenue & Collection**.

![Sales Summary](/img/erp/sal-summary.png)

## Data

**Data** menyediakan registry tiap dokumen (SQ/SO/DO/SI/SR/IC/…) untuk
penelusuran dan pengelolaan.

:::info Dampak ke modul lain
**Delivery Order** → Warehouse (stok berkurang). **Sales Invoice** → Finance (AR
+ jurnal penjualan + COGS). **AR Collection** → Finance (kas/bank masuk, AR
berkurang). Pastikan master **Partner/Customer**, **Item** (+ harga), dan **CoA**
sudah benar.
:::
