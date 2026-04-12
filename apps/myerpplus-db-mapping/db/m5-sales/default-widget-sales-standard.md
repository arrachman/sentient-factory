# Sales Standard Default Widgets

Dokumen ini berisi use case sales standar untuk `default widget` dashboard, dengan contoh prompt yang siap dipakai user berdasarkan konteks bisnis sales.

## Tabel OBT Utama

- `public.obt_sales_line_flow`
- `public.obt_sales_order_line_flow`
- `public.obt_sales_receivable`
- `public.obt_sales_forecast_event`
- `public.obt_sales_closing_snapshot`
- `public.obt_sales_invoice_exchange_event`
- `public.obt_sales_point_adjustment_event`
- `public.obt_pos_to_sales`
- `public.dim_contact`
- `public.dim_item`
- `public.dim_branch`
- `public.dim_location`
- `public.dim_salesman_category`
- `public.dim_sales_note`
- `public.dim_sales_attachment`

## Prinsip Default Widget

- Fokus ke widget yang sering dipakai user sales harian, mingguan, dan bulanan.
- Gunakan output yang mudah divisualkan: `kpi`, `bar`, `line`, `area`, `pie`, `donut`, `table`, `scatter`.
- Hindari prompt yang terlalu teknis atau terlalu detail per transaksi untuk default dashboard.
- Gunakan filter waktu sebagai standar:
  - `hari ini`
  - `minggu ini`
  - `bulan ini`
  - `tahun berjalan`

## Use Case Standard

### 1. Sales Revenue Trend

- Tujuan:
  - melihat tren penjualan per hari, minggu, atau bulan
- Widget:
  - `line`, `area`, `kpi`
- Tabel utama:
  - `public.obt_sales_line_flow`
- Metric:
  - total sales
  - total quantity sold
  - jumlah sales document
- Contoh prompt:
  - `Buat line chart tren penjualan per hari untuk bulan ini.`
  - `Tampilkan KPI total sales, total quantity, dan jumlah sales document bulan ini.`

### 2. Top Customer Summary

- Tujuan:
  - melihat customer dengan kontribusi penjualan terbesar
- Widget:
  - `horizontal_bar`, `table`, `donut`
- Tabel utama:
  - `public.obt_sales_receivable`
  - `public.dim_contact`
- Metric:
  - total sales per customer
  - jumlah invoice per customer
  - kontribusi customer terhadap total sales
- Contoh prompt:
  - `Buat horizontal bar top 10 customer berdasarkan total sales bulan ini.`
  - `Tampilkan donut chart komposisi penjualan per customer untuk bulan ini.`

### 3. Salesman Performance

- Tujuan:
  - memonitor performa salesman berdasarkan nilai penjualan dan jumlah transaksi
- Widget:
  - `bar`, `table`, `kpi`
- Tabel utama:
  - `public.obt_sales_line_flow`
  - `public.dim_contact`
  - `public.dim_salesman_category`
- Metric:
  - total sales per salesman
  - jumlah customer aktif per salesman
  - jumlah transaksi per salesman
- Contoh prompt:
  - `Buat bar chart performa salesman berdasarkan total sales bulan ini.`
  - `Tampilkan top salesman berdasarkan jumlah customer aktif dan total transaksi.`

### 4. Item Sales Composition

- Tujuan:
  - melihat item yang paling laku atau menghasilkan nilai penjualan terbesar
- Widget:
  - `bar`, `table`, `pie`
- Tabel utama:
  - `public.obt_sales_line_flow`
  - `public.dim_item`
- Metric:
  - total sales per item
  - total quantity sold per item
  - kontribusi item terhadap total sales
- Contoh prompt:
  - `Buat bar chart top 15 item berdasarkan nilai penjualan bulan ini.`
  - `Tampilkan pie chart komposisi quantity penjualan untuk item utama bulan ini.`

### 5. Branch or Warehouse Sales Distribution

- Tujuan:
  - melihat distribusi penjualan per branch, lokasi, atau warehouse
- Widget:
  - `bar`, `donut`, `table`
- Tabel utama:
  - `public.obt_sales_line_flow`
  - `public.dim_branch`
  - `public.dim_location`
- Metric:
  - total sales per branch
  - total quantity per warehouse
  - jumlah transaksi per lokasi
- Contoh prompt:
  - `Buat donut chart distribusi nilai penjualan per branch bulan ini.`
  - `Tampilkan top warehouse berdasarkan total quantity penjualan bulan ini.`

### 6. Sales Order Pipeline

- Tujuan:
  - memonitor order yang sudah masuk tetapi belum selesai seluruh prosesnya
- Widget:
  - `kpi`, `table`, `bar`
- Tabel utama:
  - `public.obt_sales_order_line_flow`
- Metric:
  - jumlah sales order open
  - outstanding quantity
  - outstanding sales value
- Contoh prompt:
  - `Buat KPI sales order pipeline: total order open, outstanding quantity, dan outstanding sales value.`
  - `Tampilkan table 20 sales order open terbesar beserta customer, tanggal, dan nominal.`

### 7. Receivable Monitoring

- Tujuan:
  - memonitor piutang penjualan dan aging receivable
- Widget:
  - `kpi`, `table`, `bar`
- Tabel utama:
  - `public.obt_sales_receivable`
- Metric:
  - total outstanding receivable
  - jumlah invoice belum lunas
  - aging bucket receivable
- Contoh prompt:
  - `Buat KPI receivable monitoring: total outstanding, jumlah invoice open, dan rata-rata umur piutang.`
  - `Tampilkan bar chart aging receivable per bucket untuk bulan ini.`

### 8. Forecast vs Actual Sales

- Tujuan:
  - membandingkan forecast penjualan dengan realisasi aktual
- Widget:
  - `bar`, `line`, `table`
- Tabel utama:
  - `public.obt_sales_forecast_event`
  - `public.obt_sales_line_flow`
- Metric:
  - forecast value
  - actual sales value
  - variance
  - achievement percent
- Contoh prompt:
  - `Buat bar chart forecast vs actual sales per bulan untuk tahun berjalan.`
  - `Tampilkan top branch dengan variance sales terbesar antara forecast dan actual.`

### 9. POS to Sales Conversion

- Tujuan:
  - melihat kontribusi penjualan dari POS ke sales document
- Widget:
  - `line`, `bar`, `kpi`
- Tabel utama:
  - `public.obt_pos_to_sales`
- Metric:
  - total POS sales
  - jumlah POS transaction
  - conversion ke sales invoice
- Contoh prompt:
  - `Buat line chart tren POS sales per hari untuk bulan ini.`
  - `Tampilkan KPI total POS sales, jumlah transaksi POS, dan nilai konversi ke sales document.`

### 10. Sales Closing Snapshot

- Tujuan:
  - melihat snapshot closing sales per periode
- Widget:
  - `kpi`, `bar`, `table`
- Tabel utama:
  - `public.obt_sales_closing_snapshot`
- Metric:
  - closing revenue
  - closing margin
  - closing quantity
- Contoh prompt:
  - `Buat KPI closing sales untuk periode terakhir: revenue, margin, dan quantity.`
  - `Tampilkan perbandingan closing sales antar bulan dalam tahun berjalan.`

### 11. Invoice Exchange and Point Adjustment

- Tujuan:
  - memonitor penukaran invoice dan penyesuaian poin penjualan
- Widget:
  - `bar`, `table`
- Tabel utama:
  - `public.obt_sales_invoice_exchange_event`
  - `public.obt_sales_point_adjustment_event`
- Metric:
  - jumlah adjustment
  - nilai adjustment
  - customer dengan adjustment terbesar
- Contoh prompt:
  - `Buat bar chart jumlah invoice exchange dan point adjustment per bulan.`
  - `Tampilkan customer dengan nilai adjustment terbesar dalam periode ini.`

### 12. Notes and Attachments Monitoring

- Tujuan:
  - memonitor kelengkapan note dan attachment pada dokumen sales
- Widget:
  - `kpi`, `table`
- Tabel utama:
  - `public.dim_sales_note`
  - `public.dim_sales_attachment`
- Metric:
  - jumlah dokumen dengan note
  - jumlah dokumen dengan attachment
  - dokumen tanpa attachment
- Contoh prompt:
  - `Buat KPI jumlah dokumen sales yang memiliki note dan attachment bulan ini.`
  - `Tampilkan table sales document yang belum memiliki attachment pendukung.`

## Paket Default Widget yang Disarankan

Untuk halaman sales standar, paket awal yang aman:

1. `Sales Revenue Trend`
2. `Top Customer Summary`
3. `Salesman Performance`
4. `Sales Order Pipeline`
5. `Receivable Monitoring`
6. `Forecast vs Actual Sales`

## Contoh Prompt Paket Dashboard

### Prompt 1

```text
Buat default widget dashboard sales standar.
Gunakan widget:
1. KPI total sales, total quantity, dan jumlah transaksi
2. line chart tren penjualan bulan ini
3. horizontal bar top customer berdasarkan total sales
4. bar chart performa salesman
5. table sales order open terbesar
6. bar chart aging receivable
```

### Prompt 2

```text
Buat sales dashboard default untuk user manager.
Fokus ke penjualan, customer terbesar, performa salesman, pipeline order, dan piutang.
Gunakan konteks data sales yang tersedia dan prioritaskan widget yang relevan untuk monitoring manajerial.
```

### Prompt 3

```text
Buat widget default page sales untuk monitoring bulanan.
Prioritaskan chart yang mudah dibaca: KPI, line, bar, donut, scatter, dan table.
Gunakan konteks data sales yang tersedia untuk menampilkan revenue, customer, salesman, order pipeline, receivable, dan forecast.
```

## Contoh Prompt Per Widget

### Sales KPI

```text
Buat widget KPI sales untuk bulan ini:
total sales, total quantity sold, dan jumlah transaksi.
```

### Sales Trend

```text
Buat widget line chart penjualan per hari untuk 30 hari terakhir.
```

### Top Customers

```text
Buat widget horizontal bar top 10 customer berdasarkan total sales bulan ini.
```

### Order Pipeline

```text
Buat widget table sales order open terbesar, tampilkan nomor dokumen, tanggal, customer, status, dan nominal.
```

### Receivable Aging

```text
Buat widget bar chart aging receivable per bucket untuk periode berjalan.
```

### Forecast Comparison

```text
Buat widget line chart forecast vs actual sales per bulan untuk tahun berjalan.
```

## Catatan Implementasi

- Jika dataset kategori terlalu banyak:
  - `pie/donut` batasi 5-6 kategori
  - `line/area` batasi 12 titik
  - `bar` batasi 10-20 item sesuai kebutuhan
  - `scatter` gunakan customer, item, atau salesman yang paling signifikan
- Untuk widget default, gunakan label yang sederhana:
  - `Sales Trend`
  - `Top Customers`
  - `Salesman Performance`
  - `Order Pipeline`
  - `Receivable Aging`
  - `Forecast vs Actual`
- Jika source perlu join dimensi:
  - customer -> `dim_contact`
  - item -> `dim_item`
  - branch -> `dim_branch`
  - location -> `dim_location`
  - salesman category -> `dim_salesman_category`

## Saran Naming Widget

- `sales-revenue-trend`
- `sales-top-customers`
- `sales-salesman-performance`
- `sales-order-pipeline`
- `sales-receivable-aging`
- `sales-forecast-vs-actual`
- `sales-item-composition`
- `sales-pos-conversion`
