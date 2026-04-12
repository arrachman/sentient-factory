# Purchasing Standard Default Widgets

Dokumen ini berisi use case purchasing standar untuk `default widget` dashboard, dengan contoh prompt yang siap dipakai user berdasarkan konteks bisnis purchasing.

## Tabel OBT Utama

- `public.obt_purchase_line_flow`
- `public.obt_purchase_document_line_event`
- `public.obt_purchase_comparative_event`
- `public.obt_purchase_payment`
- `public.obt_purchase_invoice_exchange_event`
- `public.dim_contact`
- `public.dim_item`
- `public.dim_branch`
- `public.dim_location`
- `public.dim_purchase_note`
- `public.dim_purchase_attachment`

## Prinsip Default Widget

- Fokus ke widget yang sering dipakai user purchasing harian dan mingguan.
- Gunakan output yang mudah divisualkan: `kpi`, `bar`, `line`, `area`, `pie`, `donut`, `table`.
- Hindari prompt yang terlalu teknis atau terlalu detail per transaksi untuk default dashboard.
- Gunakan filter waktu sebagai standar:
  - `hari ini`
  - `minggu ini`
  - `bulan ini`
  - `tahun berjalan`

## Use Case Standard

### 1. Purchase Request to Order Trend

- Tujuan:
  - melihat tren permintaan pembelian sampai pembentukan purchase order
- Widget:
  - `line`, `bar`
- Tabel utama:
  - `public.obt_purchase_document_line_event`
- Metric:
  - jumlah purchase request
  - jumlah purchase order
  - conversion rate request ke order
- Contoh prompt:
  - `Buat line chart tren purchase request dan purchase order per minggu untuk kuartal ini.`
  - `Tampilkan bar chart jumlah purchase request yang sudah menjadi purchase order per bulan tahun berjalan.`

### 2. Purchase Order Value Trend

- Tujuan:
  - memonitor nilai pembelian dan jumlah order dalam periode berjalan
- Widget:
  - `line`, `area`, `kpi`
- Tabel utama:
  - `public.obt_purchase_line_flow`
- Metric:
  - total purchase value
  - total ordered quantity
  - jumlah dokumen purchase order
- Contoh prompt:
  - `Buat area chart nilai purchase order per hari untuk bulan ini.`
  - `Tampilkan KPI total nilai purchase order, total quantity, dan jumlah order bulan ini.`

### 3. Supplier Spend Summary

- Tujuan:
  - melihat pemasok dengan nilai pembelian terbesar
- Widget:
  - `horizontal_bar`, `table`, `donut`
- Tabel utama:
  - `public.obt_purchase_line_flow`
  - `public.dim_contact`
- Metric:
  - total spend per supplier
  - jumlah dokumen per supplier
  - kontribusi supplier terhadap total pembelian
- Contoh prompt:
  - `Buat horizontal bar top 10 supplier berdasarkan total pembelian bulan ini.`
  - `Tampilkan donut chart komposisi nilai pembelian per supplier untuk bulan ini.`

### 4. Item Purchase Composition

- Tujuan:
  - melihat item yang paling sering dibeli atau bernilai paling besar
- Widget:
  - `bar`, `table`, `pie`
- Tabel utama:
  - `public.obt_purchase_line_flow`
  - `public.dim_item`
- Metric:
  - total nilai pembelian per item
  - total quantity per item
  - jumlah transaksi per item
- Contoh prompt:
  - `Buat bar chart top 15 item berdasarkan nilai pembelian bulan ini.`
  - `Tampilkan pie chart komposisi quantity pembelian per item untuk kategori utama.`

### 5. Branch or Warehouse Purchase Distribution

- Tujuan:
  - melihat distribusi pembelian per cabang atau lokasi
- Widget:
  - `bar`, `donut`, `table`
- Tabel utama:
  - `public.obt_purchase_line_flow`
  - `public.dim_branch`
  - `public.dim_location`
- Metric:
  - total nilai pembelian per branch
  - total quantity per lokasi
  - jumlah transaksi per branch atau warehouse
- Contoh prompt:
  - `Buat donut chart distribusi nilai pembelian per branch bulan ini.`
  - `Tampilkan top warehouse berdasarkan total quantity pembelian bulan ini.`

### 6. Open Purchase Documents

- Tujuan:
  - memonitor dokumen pembelian yang masih open atau belum selesai
- Widget:
  - `kpi`, `table`
- Tabel utama:
  - `public.obt_purchase_document_line_event`
- Metric:
  - jumlah dokumen open
  - jumlah line open
  - nilai outstanding pembelian
- Contoh prompt:
  - `Buat KPI open purchase document: total dokumen open, total line open, dan total outstanding value.`
  - `Tampilkan table 20 purchase document open terbesar beserta nomor dokumen, supplier, tanggal, dan nominal.`

### 7. Goods Receipt Monitoring

- Tujuan:
  - memonitor penerimaan barang dari pembelian
- Widget:
  - `line`, `bar`, `table`
- Tabel utama:
  - `public.obt_purchase_line_flow`
  - `public.obt_purchase_document_line_event`
- Metric:
  - jumlah receipt
  - quantity received
  - receipt completion rate
- Contoh prompt:
  - `Buat line chart quantity barang diterima per hari untuk bulan ini.`
  - `Tampilkan supplier dengan receipt completion rate terendah bulan ini.`

### 8. Purchase Price Comparison

- Tujuan:
  - membandingkan harga beli antar supplier atau antar periode
- Widget:
  - `bar`, `table`, `scatter`
- Tabel utama:
  - `public.obt_purchase_comparative_event`
  - `public.obt_purchase_line_flow`
- Metric:
  - average purchase price
  - lowest vs highest supplier price
  - variance harga
- Contoh prompt:
  - `Buat bar chart perbandingan harga beli rata-rata per supplier untuk item yang sama.`
  - `Tampilkan item dengan selisih harga beli terbesar antar supplier.`

### 9. Purchase Payment Monitoring

- Tujuan:
  - memonitor pembayaran ke vendor dan tren nilainya
- Widget:
  - `line`, `bar`, `table`
- Tabel utama:
  - `public.obt_purchase_payment`
- Metric:
  - total payment
  - jumlah payment transaction
  - payment per supplier
- Contoh prompt:
  - `Buat line chart total pembayaran vendor per minggu untuk kuartal ini.`
  - `Tampilkan top supplier berdasarkan nilai pembayaran tahun berjalan.`

### 10. Invoice Exchange and Adjustment

- Tujuan:
  - memonitor penukaran invoice atau penyesuaian dokumen pembelian
- Widget:
  - `bar`, `table`
- Tabel utama:
  - `public.obt_purchase_invoice_exchange_event`
- Metric:
  - jumlah invoice exchange
  - nilai adjustment
  - supplier dengan penyesuaian terbesar
- Contoh prompt:
  - `Buat bar chart jumlah invoice exchange per bulan untuk tahun berjalan.`
  - `Tampilkan table invoice exchange terbesar beserta supplier, tanggal, dan nilai penyesuaian.`

### 11. Purchase Cycle Time

- Tujuan:
  - melihat kecepatan proses pembelian dari request sampai receipt atau invoice
- Widget:
  - `bar`, `table`, `line`
- Tabel utama:
  - `public.obt_purchase_document_line_event`
  - `public.obt_purchase_line_flow`
- Metric:
  - average cycle time
  - median cycle time
  - dokumen dengan cycle time terlama
- Contoh prompt:
  - `Buat bar chart rata-rata cycle time pembelian per supplier bulan ini.`
  - `Tampilkan 20 dokumen pembelian dengan cycle time terlama.`

### 12. Notes and Attachments Monitoring

- Tujuan:
  - memonitor catatan dan attachment pada dokumen pembelian
- Widget:
  - `kpi`, `table`
- Tabel utama:
  - `public.dim_purchase_note`
  - `public.dim_purchase_attachment`
- Metric:
  - jumlah dokumen dengan note
  - jumlah dokumen dengan attachment
  - dokumen tanpa attachment
- Contoh prompt:
  - `Buat KPI jumlah dokumen pembelian yang memiliki note dan attachment bulan ini.`
  - `Tampilkan table purchase document yang belum memiliki attachment pendukung.`

## Paket Default Widget yang Disarankan

Untuk halaman purchasing standar, paket awal yang aman:

1. `Purchase Order Value Trend`
2. `Supplier Spend Summary`
3. `Open Purchase Documents`
4. `Goods Receipt Monitoring`
5. `Purchase Price Comparison`
6. `Purchase Payment Monitoring`

## Contoh Prompt Paket Dashboard

### Prompt 1

```text
Buat default widget dashboard purchasing standar.
Gunakan widget:
1. KPI total nilai purchase order, total quantity, dan jumlah order
2. line chart tren purchase order bulan ini
3. horizontal bar top supplier berdasarkan total pembelian
4. table purchase document open terbesar
5. chart distribusi pembelian per branch
6. chart pembayaran vendor per periode
```

### Prompt 2

```text
Buat purchasing dashboard default untuk user manager.
Fokus ke nilai pembelian, supplier spend, open document, receipt monitoring, dan payment monitoring.
Gunakan konteks data purchasing yang tersedia dan prioritaskan widget yang relevan untuk monitoring manajerial.
```

### Prompt 3

```text
Buat widget default page purchasing untuk monitoring bulanan.
Prioritaskan chart yang mudah dibaca: KPI, line, bar, donut, scatter, dan table.
Gunakan konteks data purchasing yang tersedia untuk menampilkan pembelian, supplier, receipt, price comparison, dan payment.
```

## Contoh Prompt Per Widget

### Purchase Value KPI

```text
Buat widget KPI purchasing untuk bulan ini:
total purchase value, total quantity, dan jumlah purchase order.
```

### Purchase Trend

```text
Buat widget line chart nilai purchase order per hari untuk 30 hari terakhir.
```

### Top Suppliers

```text
Buat widget horizontal bar top 10 supplier berdasarkan total pembelian bulan ini.
```

### Open Purchase Documents

```text
Buat widget table purchase document open terbesar, tampilkan nomor dokumen, tanggal, supplier, status, dan nominal.
```

### Goods Receipt

```text
Buat widget bar chart quantity barang diterima per branch untuk bulan ini.
```

### Price Comparison

```text
Buat widget scatter chart perbandingan harga beli antar supplier untuk item yang sama.
```

## Catatan Implementasi

- Jika dataset kategori terlalu banyak:
  - `pie/donut` batasi 5-6 kategori
  - `line/area` batasi 12 titik
  - `bar` batasi 10-20 item sesuai kebutuhan
  - `scatter` gunakan item atau supplier yang paling signifikan
- Untuk widget default, gunakan label yang sederhana:
  - `Purchase Order Trend`
  - `Top Suppliers`
  - `Open Purchase Documents`
  - `Goods Receipt`
  - `Price Comparison`
  - `Vendor Payments`
- Jika source perlu join dimensi:
  - supplier -> `dim_contact`
  - item -> `dim_item`
  - branch -> `dim_branch`
  - location -> `dim_location`

## Saran Naming Widget

- `purchasing-order-value-trend`
- `purchasing-top-suppliers`
- `purchasing-open-documents`
- `purchasing-goods-receipt`
- `purchasing-price-comparison`
- `purchasing-vendor-payment-trend`
- `purchasing-branch-distribution`
- `purchasing-item-composition`
