# Finance Metric Alert Condition Recommendation

Dokumen ini memetakan `metric_key` finance ke rekomendasi condition alert yang paling masuk akal.

Tujuannya:

1. menyamakan ekspektasi bisnis dan teknis saat membuat `Alert Rule`
2. memberi panduan UI `Set Condition`
3. mencegah operator memilih condition yang tidak cocok dengan jenis metric

Referensi metric source:

- [finance-business-metric-registry-mapping.md](/home/rania/apps/sentient-factory/docs/plan/finance-business-metric-registry-mapping.md)

## Prinsip Umum

Urutan pembentukan condition alert:

1. lihat `metric_key`
2. lihat `value_type`
3. lihat `comparison_type`
4. lihat konteks bisnis metric
5. pilih condition preset yang paling mudah dipahami user

Aturan umum:

- `currency`
  - cocok untuk `above threshold`, `below threshold`, `drop %`, `increase %`, `variance above`
- `count`
  - cocok untuk `greater than`, `equals zero`, `above threshold`
- `target_vs_actual`
  - cocok untuk `below target`, `variance above`, `below plan by %`
- `month_over_month`
  - cocok untuk `drop more than % vs last month`, `increase more than % vs last month`
- `threshold`
  - cocok untuk `above threshold` atau `below threshold`

## Mapping Per Metric

| metric_key | label | value_type | comparison_type | alert condition yang direkomendasikan | contoh condition |
|---|---|---|---|---|---|
| `overdue_receivable_total` | Overdue Receivable Total | `currency` | `threshold` | `Value above threshold` | `Overdue receivable > IDR 200,000,000` |
| `overdue_receivable_customer_count` | Overdue Receivable Customer Count | `count` | `threshold` | `Count above threshold` | `Overdue customers > 15` |
| `overdue_receivable_invoice_count` | Overdue Receivable Invoice Count | `count` | `threshold` | `Count above threshold` | `Overdue invoices > 40` |
| `cash_in_total` | Cash In Total | `currency` | `month_over_month` | `Value below threshold`, `Drop more than % vs last month` | `Cash in drop > 20% vs last month` |
| `cash_out_total` | Cash Out Total | `currency` | `month_over_month` | `Value above threshold`, `Increase more than % vs last month` | `Cash out increase > 25% vs last month` |
| `net_cash_movement` | Net Cash Movement | `currency` | `month_over_month` | `Value below zero`, `Drop more than % vs last month` | `Net cash movement < 0` |
| `cash_in_vs_cash_out` | Cash In vs Cash Out | `currency` | `month_over_month` | `Cash out exceeds cash in`, `Variance above threshold` | `Cash out > cash in by IDR 50,000,000` |
| `receipt_money_total` | Receipt Money Total | `currency` | `month_over_month` | `Value below threshold`, `Drop more than % vs last month` | `Receipt money drop > 15% vs last month` |
| `receipt_money_transaction_count` | Receipt Money Transaction Count | `count` | `threshold` | `Count below threshold`, `Count equals zero` | `Receipt money transaction count = 0` |
| `payment_history_total` | Payment History Total | `currency` | `month_over_month` | `Increase more than %`, `Above threshold` | `Payment history total > IDR 500,000,000` |
| `payment_history_event_count` | Payment History Event Count | `count` | `threshold` | `Count above threshold`, `Count spike vs baseline` | `Payment event count > 100` |
| `budget_realization_total` | Budget Realization Total | `currency` | `target_vs_actual` | `Below target`, `Below target by %` | `Budget realization < 80% of target` |
| `budget_vs_realization_variance` | Budget vs Realization Variance | `currency` | `target_vs_actual` | `Variance above threshold`, `Variance below negative threshold` | `Budget variance > IDR 100,000,000` |
| `finance_open_document_count` | Finance Open Document Count | `count` | `threshold` | `Count above threshold` | `Open finance documents > 50` |
| `bank_position_total` | Bank Position Total | `currency` | `month_over_month` | `Value below threshold`, `Drop more than % vs last month` | `Bank position < IDR 100,000,000` |
| `allocation_total` | Allocation Total | `currency` | `threshold` | `Value above threshold`, `Variance above threshold` | `Allocation total > IDR 250,000,000` |

## Detail Rekomendasi Per Metric

### 1. `overdue_receivable_total`

Tujuan alert:

- mendeteksi eksposur piutang overdue terlalu besar

Condition yang cocok:

1. `Value above threshold`
2. `Increase more than % vs last period` jika nanti comparison ditambah

Rekomendasi UI:

- default: `above threshold`
- input: nominal rupiah

### 2. `overdue_receivable_customer_count`

Tujuan alert:

- mendeteksi meluasnya jumlah customer bermasalah

Condition yang cocok:

1. `Count above threshold`

Rekomendasi UI:

- default: `greater than`
- input: integer

### 3. `overdue_receivable_invoice_count`

Tujuan alert:

- mendeteksi akumulasi invoice overdue

Condition yang cocok:

1. `Count above threshold`
2. `Count spike vs baseline` jika nanti baseline comparison tersedia

### 4. `cash_in_total`

Tujuan alert:

- mendeteksi penurunan penerimaan kas

Condition yang cocok:

1. `Value below threshold`
2. `Drop more than % vs last month`

Rekomendasi UI:

- tampilkan dua preset:
  - `Cash in below amount`
  - `Cash in drop more than %`

### 5. `cash_out_total`

Tujuan alert:

- mendeteksi lonjakan pengeluaran kas

Condition yang cocok:

1. `Value above threshold`
2. `Increase more than % vs last month`

### 6. `net_cash_movement`

Tujuan alert:

- mendeteksi arus kas bersih negatif

Condition yang cocok:

1. `Value below zero`
2. `Value below threshold`
3. `Drop more than % vs last month`

Rekomendasi UI:

- preset khusus:
  - `Net cash turns negative`

### 7. `cash_in_vs_cash_out`

Tujuan alert:

- mendeteksi kondisi outflow lebih besar dari inflow

Condition yang cocok:

1. `Cash out exceeds cash in`
2. `Variance above threshold`

Rekomendasi UI:

- ini metric comparison/derived, jadi lebih baik UI pakai wording bisnis, bukan operator mentah

### 8. `receipt_money_total`

Tujuan alert:

- mendeteksi turunnya collection receipt

Condition yang cocok:

1. `Value below threshold`
2. `Drop more than % vs last month`

### 9. `receipt_money_transaction_count`

Tujuan alert:

- mendeteksi receipt flow macet atau turun tajam

Condition yang cocok:

1. `Count equals zero`
2. `Count below threshold`

### 10. `payment_history_total`

Tujuan alert:

- mendeteksi total pembayaran terlalu tinggi atau melonjak

Condition yang cocok:

1. `Above threshold`
2. `Increase more than % vs last month`

### 11. `payment_history_event_count`

Tujuan alert:

- mendeteksi lonjakan frekuensi payment event

Condition yang cocok:

1. `Count above threshold`
2. `Count spike vs baseline`

### 12. `budget_realization_total`

Tujuan alert:

- mendeteksi realisasi terlalu rendah terhadap target

Condition yang cocok:

1. `Below target`
2. `Below target by %`

Rekomendasi UI:

- wording yang lebih tepat:
  - `Realization below target by %`

### 13. `budget_vs_realization_variance`

Tujuan alert:

- mendeteksi gap budget vs actual terlalu besar

Condition yang cocok:

1. `Variance above threshold`
2. `Variance below negative threshold`

Catatan:

- ini lebih cocok sebagai preset specialized, bukan operator umum

### 14. `finance_open_document_count`

Tujuan alert:

- mendeteksi penumpukan dokumen finance yang belum closed

Condition yang cocok:

1. `Count above threshold`

### 15. `bank_position_total`

Tujuan alert:

- mendeteksi saldo/posisi bank terlalu rendah atau turun tajam

Condition yang cocok:

1. `Value below threshold`
2. `Drop more than % vs last month`

### 16. `allocation_total`

Tujuan alert:

- mendeteksi nominal allocation terlalu besar

Condition yang cocok:

1. `Value above threshold`
2. `Variance above threshold`

## Rekomendasi UI Preset

Untuk finance, preset UI paling berguna adalah:

### Currency Threshold

- `Value above threshold`
- `Value below threshold`

Pakai untuk:

- `overdue_receivable_total`
- `cash_in_total`
- `cash_out_total`
- `receipt_money_total`
- `payment_history_total`
- `bank_position_total`
- `allocation_total`

### Count Threshold

- `Count above threshold`
- `Count below threshold`
- `Count equals zero`

Pakai untuk:

- `overdue_receivable_customer_count`
- `overdue_receivable_invoice_count`
- `receipt_money_transaction_count`
- `payment_history_event_count`
- `finance_open_document_count`

### Month-over-Month Change

- `Drop more than % vs last month`
- `Increase more than % vs last month`

Pakai untuk:

- `cash_in_total`
- `cash_out_total`
- `net_cash_movement`
- `receipt_money_total`
- `payment_history_total`
- `bank_position_total`

### Target vs Actual

- `Below target`
- `Below target by %`
- `Variance above threshold`

Pakai untuk:

- `budget_realization_total`
- `budget_vs_realization_variance`

### Specialized Finance Preset

- `Cash out exceeds cash in`
- `Net cash turns negative`

Pakai untuk:

- `cash_in_vs_cash_out`
- `net_cash_movement`

## Recommendation for Alert Builder

Urutan yang disarankan saat user pilih finance metric:

1. tampilkan `metric label`
2. tampilkan helper text singkat
3. tampilkan hanya preset condition yang relevan
4. default-kan preset paling umum

Contoh:

- `overdue_receivable_total`
  - default preset: `Value above threshold`
- `net_cash_movement`
  - default preset: `Net cash turns negative`
- `budget_realization_total`
  - default preset: `Below target by %`

## Recommended Next Follow-up

Langkah berikut yang paling tepat:

1. buat `metric_condition_ui_mapping` khusus finance metrics ini
2. sambungkan preset ini ke `Create Alert Rule`
3. kalau perlu, tambah dokumen lanjutan:
   - `metric_key -> recommended threshold starter`
   - `metric_key -> severity recommendation`
