# Accounting Metric Alert Condition Recommendation

Dokumen ini memetakan `metric_key` accounting ke rekomendasi condition alert yang paling masuk akal.

Tujuannya:

1. menyamakan ekspektasi bisnis dan teknis saat membuat `Alert Rule`
2. memberi panduan UI `Set Condition`
3. mencegah operator memilih condition yang tidak cocok dengan jenis metric

Referensi metric source:

- [accounting-business-metric-registry-mapping.md](/home/rania/apps/sentient-factory/docs/plan/accounting-business-metric-registry-mapping.md)

## Prinsip Umum

Urutan pembentukan condition alert:

1. lihat `metric_key`
2. lihat `value_type`
3. lihat `comparison_type`
4. lihat konteks bisnis metric
5. pilih condition preset yang paling mudah dipahami user

Aturan umum:

- `currency`
  - cocok untuk `above threshold`, `below threshold`, `drop %`, `increase %`
- `count`
  - cocok untuk `greater than`, `below threshold`, `equals zero`
- `month_over_month`
  - cocok untuk `drop more than % vs last month`, `increase more than % vs last month`
- `threshold`
  - cocok untuk `above threshold`, `below threshold`, atau `equals zero`

## Mapping Per Metric

| metric_key | label | value_type | comparison_type | alert condition yang direkomendasikan | contoh condition |
|---|---|---|---|---|---|
| `accounting_journal_line_amount_total` | Accounting Journal Line Amount Total | `currency` | `month_over_month` | `Value above threshold`, `Increase more than % vs last month` | `Journal line amount total > IDR 1,000,000,000` |
| `accounting_journal_line_count` | Accounting Journal Line Count | `count` | `threshold` | `Count above threshold`, `Count equals zero` | `Journal line count = 0` |
| `accounting_distinct_account_count` | Accounting Distinct Account Count | `count` | `threshold` | `Count below threshold` | `Distinct account count < 5` |
| `accounting_document_lifecycle_event_count` | Accounting Document Lifecycle Event Count | `count` | `threshold` | `Count above threshold` | `Lifecycle event count > 500` |
| `accounting_document_revision_total` | Accounting Document Revision Total | `count` | `threshold` | `Count above threshold` | `Document revision total > 20` |
| `accounting_active_coa_count` | Accounting Active COA Count | `count` | `threshold` | `Count below threshold` | `Active COA count < 50` |
| `accounting_revenue_total` | Accounting Revenue Total | `currency` | `month_over_month` | `Value below threshold`, `Drop more than % vs last month` | `Revenue total drop > 15% vs last month` |
| `accounting_cogs_total` | Accounting COGS Total | `currency` | `month_over_month` | `Increase more than % vs last month` | `COGS increase > 20% vs last month` |
| `accounting_operating_expense_total` | Accounting Operating Expense Total | `currency` | `month_over_month` | `Increase more than % vs last month` | `Operating expense increase > 20% vs last month` |
| `accounting_net_profit_total` | Accounting Net Profit Total | `currency` | `month_over_month` | `Value below zero`, `Drop more than % vs last month` | `Net profit total < 0` |

## Recommended UI Presets

Untuk accounting, preset yang paling berguna untuk `Create Alert Rule`:

1. `Value above threshold`
2. `Value below threshold`
3. `Count above threshold`
4. `Count below threshold`
5. `Count equals zero`
6. `Drop more than % vs last month`
7. `Increase more than % vs last month`
8. `Value below zero`

## Notes Per Metric Family

### Journal Metrics

- fokus ke volume dan nilai posting
- cocok untuk mendeteksi spike atau tidak adanya aktivitas jurnal

### Document Workflow Metrics

- fokus ke churn workflow, revision, dan proses approval
- cocok untuk operational alert

### COA Metrics

- fokus ke governance master data
- lebih cocok untuk threshold alert daripada trend alert

### Profit and Loss Metrics

- fokus ke kesehatan finansial periodik
- paling cocok untuk comparison `month_over_month`

## Follow-up Recommended

Langkah berikut yang paling tepat:

1. pakai seed `metric_condition_ui_mapping` accounting ini di alert builder
2. tambahkan starter threshold dan severity recommendation untuk accounting
