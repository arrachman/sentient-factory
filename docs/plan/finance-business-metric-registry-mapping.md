# Finance Business Metric Registry Mapping

Dokumen ini merangkum metric `module_key = finance` yang sudah disiapkan di:

- `public.metric_business_registry`
- `public.metric_semantic_registry`
- `public.metric_system_registry`

Tujuannya:

1. memberi referensi tunggal untuk tim bisnis
2. menjelaskan metric mana berasal dari OBT yang mana
3. memudahkan pemilihan metric untuk dashboard, alerting, dan AI retrieval

## Registry Coverage

- `metric_business_registry`: 16 metric finance
- `metric_semantic_registry`: 17 semantic entry finance
- `metric_system_registry`: 15 system metric finance

## Finance Metric Mapping

| metric_key | label | semantic_ref | system_metric_ref | base_obt | aggregation / logic | value_type | default_filters | supported_dimensions |
|---|---|---|---|---|---|---|---|---|
| `overdue_receivable_total` | Overdue Receivable Total | `overdue_receivable_total` | `receivable_overdue_amount_30_plus` | `public.obt_sales_receivable` | `sum(amount)` overdue | `currency` | `{"aging_bucket":"30_plus"}` | `branch`, `customer`, `salesman`, `aging_bucket` |
| `overdue_receivable_customer_count` | Overdue Receivable Customer Count | `overdue_receivable_customer_count` | `receivable_overdue_customer_count` | `public.obt_sales_receivable` | `count(distinct contact/customer)` overdue | `count` | `{"aging_bucket":"30_plus"}` | `branch`, `customer`, `salesman`, `aging_bucket` |
| `overdue_receivable_invoice_count` | Overdue Receivable Invoice Count | `overdue_receivable_invoice_count` | `receivable_overdue_invoice_count` | `public.obt_sales_receivable` | `count(invoice)` overdue | `count` | `{"aging_bucket":"30_plus"}` | `branch`, `customer`, `salesman`, `aging_bucket` |
| `cash_in_total` | Cash In Total | `cash_in_total` | `cash_receipt_total_amount` | `public.obt_cash_receipt_line_flow` | `sum(amount)` cash receipt | `currency` | `{"period":"current_month"}` | `branch`, `location`, `contact`, `bank_account`, `cost_center`, `project` |
| `cash_out_total` | Cash Out Total | `cash_out_total` | `cash_disbursement_total_amount` | `public.obt_cash_disbursement_line_flow` | `sum(amount)` cash disbursement | `currency` | `{"period":"current_month"}` | `branch`, `location`, `contact`, `bank_account`, `cost_center`, `project` |
| `net_cash_movement` | Net Cash Movement | `net_cash_movement` | `cash_in_vs_cash_out_total` | `public.obt_cash_receipt_line_flow` + `public.obt_cash_disbursement_line_flow` | `cash_in - cash_out` | `currency` | `{"period":"current_month"}` | `branch`, `location`, `bank_account` |
| `cash_in_vs_cash_out` | Cash In vs Cash Out | `cash_in_vs_cash_out` | `cash_in_vs_cash_out_total` | `public.obt_cash_receipt_line_flow` + `public.obt_cash_disbursement_line_flow` | compare inflow vs outflow | `currency` | `{"period":"current_month"}` | `branch`, `bank_account` |
| `receipt_money_total` | Receipt Money Total | `receipt_money_total` | `receipt_money_total_amount` | `public.obt_receipt_money_line_flow` | `sum(amount)` receipt money | `currency` | `{"period":"current_month"}` | `branch`, `location`, `contact`, `payment_method`, `bank_account` |
| `receipt_money_transaction_count` | Receipt Money Transaction Count | `receipt_money_transaction_count` | `receipt_money_transaction_count` | `public.obt_receipt_money_line_flow` | `count(source_detail_id)` | `count` | `{"period":"current_month"}` | `branch`, `location`, `contact`, `payment_method` |
| `payment_history_total` | Payment History Total | `payment_history_total` | `finance_payment_history_total_amount` | `public.obt_finance_payment_history_event` | `sum(amount)` payment events | `currency` | `{"period":"current_month"}` | `branch`, `location`, `contact`, `payment_method`, `bank` |
| `payment_history_event_count` | Payment History Event Count | `payment_history_event_count` | `finance_payment_history_event_count` | `public.obt_finance_payment_history_event` | `count(payment_history_event)` | `count` | `{"period":"current_month"}` | `branch`, `location`, `contact`, `payment_method`, `bank` |
| `budget_realization_total` | Budget Realization Total | `budget_realization_total` | `finance_budget_realization_total_amount` | `public.obt_finance_budget_realization` | `sum(amount)` realization | `currency` | `{"period":"current_month"}` | `branch`, `location`, `contact`, `item_code` |
| `budget_vs_realization_variance` | Budget vs Realization Variance | `budget_vs_realization_variance` | `finance_budget_variance_amount` | `public.obt_finance_budget_realization` | `budget - realization` derived variance | `currency` | `{"period":"current_month"}` | `branch`, `location`, `contact`, `item_code` |
| `finance_open_document_count` | Finance Open Document Count | `finance_open_document_count` | `finance_open_document_count` | `public.obt_finance_document` | `count(document)` with open status | `count` | `{"doc_status_name":"open"}` | `branch`, `location`, `contact`, `source_doc_type`, `doc_status_name` |
| `bank_position_total` | Bank Position Total | `bank_position_total` | `bank_position_total_amount` | `public.obt_finance_document` | `sum(amount)` by bank/cash position | `currency` | `{"period":"current_month"}` | `branch`, `location`, `bank_account`, `source_doc_type` |
| `allocation_total` | Allocation Total | `allocation_total` | `finance_allocation_total_amount` | `public.obt_finance_allocation` | `sum(amount)` allocation | `currency` | `{"period":"current_month"}` | `branch`, `location`, `contact`, `cost_center`, `project` |

## OBT Notes

### `public.obt_sales_receivable`

Dipakai untuk metric finance yang terkait AR:

- overdue amount
- overdue customer count
- overdue invoice count

Catatan:

- walau secara domain asal dekat ke sales receivable, secara penggunaan metric ini tetap valid dimasukkan ke `finance`
- ini relevan untuk collection, aging, dan monitoring outstanding

### `public.obt_cash_receipt_line_flow`

Dipakai untuk:

- `cash_in_total`
- bagian inflow dari `net_cash_movement`
- bagian inflow dari `cash_in_vs_cash_out`

### `public.obt_cash_disbursement_line_flow`

Dipakai untuk:

- `cash_out_total`
- bagian outflow dari `net_cash_movement`
- bagian outflow dari `cash_in_vs_cash_out`

### `public.obt_receipt_money_line_flow`

Dipakai untuk:

- `receipt_money_total`
- `receipt_money_transaction_count`

### `public.obt_finance_payment_history_event`

Dipakai untuk:

- `payment_history_total`
- `payment_history_event_count`

### `public.obt_finance_budget_realization`

Dipakai untuk:

- `budget_realization_total`
- `budget_vs_realization_variance`

Catatan:

- variance saat ini diposisikan sebagai metric bisnis derived
- kalau nanti struktur budget dan actual dipisah lebih eksplisit, system metric bisa diturunkan lagi lebih granular

### `public.obt_finance_document`

Dipakai untuk:

- `finance_open_document_count`
- `bank_position_total`

Catatan:

- metric ini kuat untuk monitoring operasional dokumen finance
- cocok dipakai untuk dashboard executive dan alerting operasional

### `public.obt_finance_allocation`

Dipakai untuk:

- `allocation_total`

## Recommended First-Class Finance Metrics

Kalau perlu subset paling aman untuk user-facing awal, prioritaskan:

1. `overdue_receivable_total`
2. `cash_in_total`
3. `cash_out_total`
4. `net_cash_movement`
5. `receipt_money_total`
6. `payment_history_total`
7. `budget_realization_total`
8. `budget_vs_realization_variance`
9. `finance_open_document_count`
10. `bank_position_total`

## Metrics That Are Derived

Metric berikut bukan agregasi mentah satu kolom saja, jadi perlu dijaga konsistensi logikanya di service layer:

1. `net_cash_movement`
2. `cash_in_vs_cash_out`
3. `budget_vs_realization_variance`

## Follow-up Recommended

Langkah berikut yang paling tepat:

1. expose finance metric picker dari `metric_business_registry`
2. buat endpoint/filter khusus `module_key = finance`
3. kalau perlu, buat dokumen lanjutan:
   - `metric_key -> SQL aggregation draft`
   - `metric_key -> alert condition recommendation`
