# Finance Standard Default Widgets

Dokumen ini berisi use case finance standar untuk `default widget` dashboard, dengan contoh prompt yang siap dipakai user berdasarkan konteks bisnis finance.

## Tabel OBT Utama

- `public.obt_finance_document`
- `public.obt_finance_document_line`
- `public.obt_finance_allocation`
- `public.obt_finance_budget_realization`
- `public.obt_finance_document_history_event`
- `public.obt_finance_document_history_line_event`
- `public.obt_finance_payment_history_event`
- `public.obt_receipt_money_line_flow`
- `public.obt_cash_receipt_line_flow`
- `public.obt_cash_disbursement_line_flow`
- `public.obt_profit_loss_line`
- `public.obt_portfolio`
- `public.dim_bank`
- `public.dim_coa`
- `public.dim_finance_giro_list`

## Prinsip Default Widget

- Fokus ke widget yang sering dipakai user finance harian dan mingguan.
- Gunakan output yang mudah divisualkan: `kpi`, `bar`, `line`, `area`, `pie`, `donut`, `table`.
- Hindari prompt yang terlalu operasional-per-transaksi untuk default dashboard.
- Gunakan filter waktu sebagai standar:
  - `hari ini`
  - `minggu ini`
  - `bulan ini`
  - `tahun berjalan`

## Use Case Standard

### 1. Cash In vs Cash Out Trend

- Tujuan:
  - melihat tren kas masuk dan kas keluar per hari/per bulan
- Widget:
  - `line` atau `area`
- Tabel utama:
  - `public.obt_cash_receipt_line_flow`
  - `public.obt_cash_disbursement_line_flow`
- Metric:
  - total cash receipt
  - total cash disbursement
  - net cash movement
- Contoh prompt:
  - `Buat widget line trend cash in vs cash out per hari untuk bulan ini.`
  - `Tampilkan area chart per bulan untuk cash receipt, cash disbursement, dan net movement tahun berjalan.`

### 2. Receipt Money Summary

- Tujuan:
  - memonitor penerimaan uang per sumber dokumen atau per bank
- Widget:
  - `bar`, `donut`, `table`
- Tabel utama:
  - `public.obt_receipt_money_line_flow`
  - `public.dim_bank`
- Metric:
  - total receipt
  - jumlah transaksi
  - top bank
- Contoh prompt:
  - `Buat donut chart komposisi receipt money per bank untuk bulan ini.`
  - `Tampilkan top 10 bank berdasarkan total receipt money bulan ini.`

### 3. Outstanding Finance Document

- Tujuan:
  - melihat dokumen finance yang belum selesai, belum lunas, atau masih open
- Widget:
  - `kpi`, `table`
- Tabel utama:
  - `public.obt_finance_document`
  - `public.obt_finance_document_history_event`
- Metric:
  - jumlah dokumen open
  - nilai outstanding
  - aging outstanding
- Contoh prompt:
  - `Buat KPI outstanding finance document: total open document, total nominal outstanding, dan average age hari.`
  - `Tampilkan table 20 dokumen finance outstanding terbesar beserta nomor dokumen, kontak, tanggal, dan nominal.`

### 4. Payment History Trend

- Tujuan:
  - memonitor histori pembayaran dan kecepatannya
- Widget:
  - `line`, `bar`
- Tabel utama:
  - `public.obt_finance_payment_history_event`
- Metric:
  - jumlah payment event
  - total nilai payment
  - trend per hari/per bulan
- Contoh prompt:
  - `Buat line chart trend payment history event per hari untuk 30 hari terakhir.`
  - `Tampilkan total nilai payment per bulan untuk tahun berjalan.`

### 5. Budget vs Realization

- Tujuan:
  - membandingkan anggaran dan realisasi
- Widget:
  - `bar`, `line`, `table`
- Tabel utama:
  - `public.obt_finance_budget_realization`
- Metric:
  - budget
  - realization
  - variance
  - variance percent
- Contoh prompt:
  - `Buat bar chart budget vs realization per bulan untuk tahun berjalan.`
  - `Tampilkan 10 cost center dengan variance budget terbesar bulan ini.`

### 6. Profit and Loss Overview

- Tujuan:
  - menampilkan ringkasan P&L berdasarkan line account
- Widget:
  - `kpi`, `bar`, `table`
- Tabel utama:
  - `public.obt_profit_loss_line`
  - `public.dim_coa`
- Metric:
  - revenue
  - cogs
  - gross profit
  - opex
  - net profit
- Contoh prompt:
  - `Buat KPI finance untuk revenue, cogs, gross profit, opex, dan net profit bulan ini.`
  - `Tampilkan bar chart line profit and loss terbesar berdasarkan nilai bulan ini.`

### 7. Account Composition by COA

- Tujuan:
  - melihat komposisi nilai berdasarkan account atau group COA
- Widget:
  - `horizontal_bar`, `pie`, `table`
- Tabel utama:
  - `public.obt_finance_document_line`
  - `public.dim_coa`
- Metric:
  - total nominal per COA
  - jumlah line transaksi
- Contoh prompt:
  - `Buat horizontal bar chart top 10 COA berdasarkan total nominal transaksi bulan ini.`
  - `Tampilkan pie chart komposisi nominal transaksi berdasarkan group COA bulan ini.`

### 8. Allocation Monitoring

- Tujuan:
  - memonitor alokasi biaya atau dana lintas dimensi
- Widget:
  - `bar`, `table`
- Tabel utama:
  - `public.obt_finance_allocation`
- Metric:
  - total allocation
  - jumlah dokumen allocation
  - allocation per cost center / divisi / proyek
- Contoh prompt:
  - `Buat bar chart alokasi biaya per cost center bulan ini.`
  - `Tampilkan top 15 allocation terbesar beserta cost center dan proyeknya.`

### 9. Bank Position Summary

- Tujuan:
  - melihat posisi transaksi per bank
- Widget:
  - `bar`, `donut`, `table`
- Tabel utama:
  - `public.obt_finance_document`
  - `public.dim_bank`
- Metric:
  - total transaksi per bank
  - jumlah dokumen per bank
- Contoh prompt:
  - `Buat donut chart komposisi nominal transaksi finance per bank bulan ini.`
  - `Tampilkan top bank berdasarkan total nominal dokumen finance bulan ini.`

### 10. Giro Status Monitoring

- Tujuan:
  - memonitor status giro masuk/keluar
- Widget:
  - `donut`, `table`
- Tabel utama:
  - `public.dim_finance_giro_list`
- Metric:
  - jumlah giro per status
  - nominal giro per status
- Contoh prompt:
  - `Buat donut chart status giro berdasarkan jumlah dokumen aktif.`
  - `Tampilkan table giro yang jatuh tempo dalam 14 hari ke depan.`

### 11. Finance Document Lifecycle

- Tujuan:
  - melihat perjalanan status dokumen finance
- Widget:
  - `bar`, `line`, `table`
- Tabel utama:
  - `public.obt_finance_document_history_event`
  - `public.obt_finance_document_history_line_event`
- Metric:
  - jumlah event per status
  - lama perpindahan status
  - dokumen yang paling sering direvisi
- Contoh prompt:
  - `Buat bar chart jumlah event perubahan status dokumen finance per status untuk bulan ini.`
  - `Tampilkan 20 dokumen finance dengan jumlah revisi terbanyak.`

### 12. Portfolio Snapshot

- Tujuan:
  - menampilkan posisi portofolio finance secara ringkas
- Widget:
  - `kpi`, `table`
- Tabel utama:
  - `public.obt_portfolio`
- Metric:
  - total portfolio value
  - active portfolio count
  - top exposure
- Contoh prompt:
  - `Buat KPI portfolio value total, jumlah portfolio aktif, dan rata-rata exposure.`
  - `Tampilkan top 10 portfolio dengan exposure terbesar.`

## Paket Default Widget yang Disarankan

Untuk halaman finance standar, paket awal yang aman:

1. `Cash In vs Cash Out Trend`
2. `Budget vs Realization`
3. `Profit and Loss Overview`
4. `Outstanding Finance Document`
5. `Receipt Money Summary`
6. `Bank Position Summary`

## Contoh Prompt Paket Dashboard

### Prompt 1

```text
Buat default widget dashboard finance standar.
Gunakan widget:
1. KPI revenue, gross profit, net profit
2. line chart cash in vs cash out bulan ini
3. bar chart budget vs realization per bulan
4. table outstanding finance document terbesar
5. donut chart receipt money per bank
6. horizontal bar top COA transaksi
```

### Prompt 2

```text
Buat finance dashboard default untuk user manager.
Fokus ke cashflow, budget control, profitability, dan outstanding document.
Gunakan konteks data finance yang tersedia dan prioritaskan widget yang relevan untuk monitoring manajerial.
```

### Prompt 3

```text
Buat widget default page finance untuk monitoring bulanan.
Prioritaskan chart yang mudah dibaca: KPI, line, bar, donut, dan table.
Gunakan konteks data finance yang tersedia untuk menampilkan profitability, cashflow, budget control, dan outstanding document.
```

## Contoh Prompt Per Widget

### KPI Profitability

```text
Buat widget KPI profitability finance untuk bulan ini:
revenue, gross profit, operating expense, net profit.
```

### Cashflow Trend

```text
Buat widget line chart cash in dan cash out per hari untuk 30 hari terakhir.
```

### Budget Control

```text
Buat widget bar chart budget vs realization per cost center untuk bulan ini.
```

### Outstanding Document

```text
Buat widget table finance document open terbesar, tampilkan nomor dokumen, tanggal, kontak, status, dan nominal outstanding.
```

### Receipt by Bank

```text
Buat widget donut chart receipt money per bank untuk bulan ini.
```

## Catatan Implementasi

- Jika dataset kategori terlalu banyak:
  - `pie/donut` batasi 5-6 kategori
  - `line/area` batasi 12 titik
  - `bar` batasi 10-20 item sesuai kebutuhan
- Untuk widget default, gunakan label yang sederhana:
  - `Cash In vs Cash Out`
  - `Budget vs Realization`
  - `Profitability`
  - `Outstanding Documents`
  - `Receipt by Bank`
- Jika source perlu join dimensi:
  - bank -> `dim_bank`
  - coa -> `dim_coa`
  - giro -> `dim_finance_giro_list`

## Saran Naming Widget

- `finance-cashflow-trend`
- `finance-budget-vs-realization`
- `finance-profitability-kpi`
- `finance-outstanding-document-table`
- `finance-receipt-by-bank`
- `finance-top-coa-bar`
- `finance-giro-status`
- `finance-portfolio-kpi`
