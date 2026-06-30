---
sidebar_position: 2
title: Mencatat Penjualan (SO → Faktur)
---

# Mencatat Penjualan (SO → Faktur)

Alur dasar menjual barang ke pelanggan, dari pesanan hingga penagihan.

## Langkah

1. **(Opsional) Penawaran** — buka **Sales → Sales Quotation**, buat penawaran
   harga ke calon pelanggan.
2. **Sales Order (SO)** — buka **Sales → Sales Order**, **+ New**, pilih
   pelanggan dan tambahkan item + qty + harga. Simpan/Posting.
3. **Delivery Order (DO)** — buat pengiriman dari SO. Posting DO **mengurangi
   stok** gudang.
4. **Sales Invoice (SI)** — terbitkan faktur. Posting SI membentuk **piutang
   (AR)** dan jurnal penjualan.
5. **AR Collection** — saat pelanggan membayar, catat penerimaan untuk menutup
   piutang.

![Daftar Sales Order](/img/erp/sal-so.png)

## Diagram alur

```
Quotation → Sales Order → Delivery Order → Sales Invoice → AR Collection
```

:::tip
Pastikan master **Partner/Customer**, **Item** (beserta harga), dan **CoA** sudah
benar sebelum mencatat penjualan. Detail tiap dokumen ada di
**[Referensi → Sales](/referensi/penjualan)**.
:::
