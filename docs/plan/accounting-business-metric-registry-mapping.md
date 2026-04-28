# Accounting Business Metric Registry Mapping

Dokumen ini merangkum metric `module_key = accounting` yang sudah disiapkan di:

- `public.metric_business_registry`
- `public.metric_semantic_registry`
- `public.metric_system_registry`

Tujuannya:

1. memberi referensi tunggal untuk tim accounting dan backend
2. menjelaskan metric mana berasal dari OBT yang mana
3. memudahkan pemilihan metric untuk dashboard, alerting, dan AI retrieval

## Registry Coverage

- `metric_business_registry`: 10 metric accounting
- `metric_semantic_registry`: 10 semantic entry accounting
- `metric_system_registry`: 10 system metric accounting

## Accounting Metric Mapping

| metric_key | label | semantic_ref | system_metric_ref | base_obt | aggregation / logic | value_type | default_filters | supported_dimensions |
|---|---|---|---|---|---|---|---|---|
| `accounting_journal_line_amount_total` | Accounting Journal Line Amount Total | `accounting_journal_line_amount_total` | `accounting_journal_line_amount_total` | `public.obt_finance_document_line` | `sum(amount)` line jurnal accounting | `currency` | `{"period":"current_month"}` | `branch`, `location`, `contact`, `source_doc_type`, `line_account_code` |
| `accounting_journal_line_count` | Accounting Journal Line Count | `accounting_journal_line_count` | `accounting_journal_line_count` | `public.obt_finance_document_line` | `count(line)` jurnal accounting | `count` | `{"period":"current_month"}` | `branch`, `location`, `contact`, `source_doc_type`, `line_account_code` |
| `accounting_distinct_account_count` | Accounting Distinct Account Count | `accounting_distinct_account_count` | `accounting_distinct_account_count` | `public.obt_finance_document_line` | `count(distinct line_account_code)` | `count` | `{"period":"current_month"}` | `branch`, `location`, `source_doc_type`, `line_account_code` |
| `accounting_document_lifecycle_event_count` | Accounting Document Lifecycle Event Count | `accounting_document_lifecycle_event_count` | `accounting_document_lifecycle_event_count` | `public.obt_finance_document_history_event` | `count(history_event)` | `count` | `{"period":"current_month"}` | `branch`, `location`, `contact`, `source_doc_type`, `doc_status_code` |
| `accounting_document_revision_total` | Accounting Document Revision Total | `accounting_document_revision_total` | `accounting_document_revision_total` | `public.obt_finance_document_history_event` | `sum(revision_count)` atau count revisi dokumen | `count` | `{"period":"current_month"}` | `branch`, `location`, `contact`, `source_doc_type` |
| `accounting_active_coa_count` | Accounting Active COA Count | `accounting_active_coa_count` | `accounting_active_coa_count` | `public.dim_coa` | `count(active coa)` | `count` | `{"is_active":1}` | `branch`, `location`, `account_type`, `parent_account_code` |
| `accounting_revenue_total` | Accounting Revenue Total | `accounting_revenue_total` | `accounting_revenue_total` | `public.obt_profit_loss_line` | `sum(amount)` untuk kategori `REVENUE` | `currency` | `{"pnl_category":"REVENUE"}` | `branch`, `location`, `contact`, `account_code`, `fiscal_year`, `fiscal_month` |
| `accounting_cogs_total` | Accounting COGS Total | `accounting_cogs_total` | `accounting_cogs_total` | `public.obt_profit_loss_line` | `sum(amount)` untuk kategori `COGS` | `currency` | `{"pnl_category":"COGS"}` | `branch`, `location`, `contact`, `account_code`, `fiscal_year`, `fiscal_month` |
| `accounting_operating_expense_total` | Accounting Operating Expense Total | `accounting_operating_expense_total` | `accounting_operating_expense_total` | `public.obt_profit_loss_line` | `sum(amount)` untuk kategori `OPERATING_EXPENSE` | `currency` | `{"pnl_category":"OPERATING_EXPENSE"}` | `branch`, `location`, `contact`, `account_code`, `fiscal_year`, `fiscal_month` |
| `accounting_net_profit_total` | Accounting Net Profit Total | `accounting_net_profit_total` | `accounting_net_profit_total` | `public.obt_profit_loss_line` | metric derived net profit dari revenue, cogs, dan expense | `currency` | `{"pnl_scope":"net_profit"}` | `branch`, `location`, `contact`, `fiscal_year`, `fiscal_month` |

## OBT Notes

### `public.obt_finance_document_line`

Dipakai untuk:

- `accounting_journal_line_amount_total`
- `accounting_journal_line_count`
- `accounting_distinct_account_count`

Catatan:

- ini basis paling dekat untuk volume dan nilai posting jurnal
- cocok untuk monitoring aktivitas jurnal dan variasi akun

### `public.obt_finance_document_history_event`

Dipakai untuk:

- `accounting_document_lifecycle_event_count`
- `accounting_document_revision_total`

Catatan:

- ini kuat untuk monitoring kualitas proses document accounting
- cocok untuk operational alert seperti revision spike atau workflow churn

### `public.dim_coa`

Dipakai untuk:

- `accounting_active_coa_count`

Catatan:

- ini metric master-data, bukan transactional metric
- lebih cocok untuk governance dan data-quality alert

### `public.obt_profit_loss_line`

Dipakai untuk:

- `accounting_revenue_total`
- `accounting_cogs_total`
- `accounting_operating_expense_total`
- `accounting_net_profit_total`

Catatan:

- metric ini paling cocok untuk dashboard manajerial dan alerting periodik
- `accounting_net_profit_total` adalah metric derived, jadi logikanya harus dijaga tetap konsisten lintas service

## Recommended First-Class Accounting Metrics

Kalau perlu subset paling aman untuk user-facing awal, prioritaskan:

1. `accounting_journal_line_amount_total`
2. `accounting_journal_line_count`
3. `accounting_document_revision_total`
4. `accounting_active_coa_count`
5. `accounting_revenue_total`
6. `accounting_cogs_total`
7. `accounting_operating_expense_total`
8. `accounting_net_profit_total`

## Metrics That Are Derived

Metric berikut bukan agregasi mentah satu kolom saja, jadi perlu dijaga konsistensi logikanya di service layer:

1. `accounting_distinct_account_count`
2. `accounting_document_revision_total`
3. `accounting_net_profit_total`

## Follow-up Recommended

Langkah berikut yang paling tepat:

1. expose accounting metric picker dari `metric_business_registry`
2. sambungkan `metric_condition_ui_mapping` khusus accounting ke `Create Alert Rule`
3. kalau perlu, buat dokumen lanjutan:
   - `metric_key -> SQL aggregation draft`
   - `metric_key -> alert condition recommendation`

