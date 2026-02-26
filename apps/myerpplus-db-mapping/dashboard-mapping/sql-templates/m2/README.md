# SQL Templates - Domain m2 (Finance & Accounting)

Template SQL ini adalah versi final untuk 1-page dashboard Finance & Accounting (m2).

## Files
- summary.sql
- trends.sql
- breakdown.sql
- breakdown_cashflow.sql
- breakdown_branch.sql
- breakdown_status.sql
- table.sql

## Placeholder Params
- :from_date (DATE)
- :to_date (DATE)
- :limit (INT)
- :offset (INT)

## Widget Mapping (1 Page)
- `summary.sql`: KPI Cards
  - total_journal_rows, total_debit, total_kredit, net_cashflow, total_cabang, total_sumber
- `trends.sql`: Trend bulanan debit vs kredit vs net cashflow
- `breakdown.sql`: Komposisi transaksi per sumber (`tsumber`)
- `breakdown_cashflow.sql`: Cash In vs Cash Out per bulan (`m2_cr/m2_rm` vs `m2_cd/m2_sm`)
- `breakdown_branch.sql`: Top cabang by movement nominal
- `breakdown_status.sql`: Distribusi status (`tstatus`, `tstatuslunas`)
- `table.sql`: Detail transaksi jurnal untuk data grid

## Dummy Fallback Policy
- Semua query sudah memiliki fallback dummy saat data kosong pada rentang `:from_date` - `:to_date`.
- Tujuan fallback: widget tetap ter-render dan bisa dipakai demo/UAT meski data belum tersedia.
- Saat data real ada, hasil dummy tidak akan muncul.

## Main Sources
- `m2_transaction_journal` (utama untuk KPI/trend/status/branch)
- `m2_cr`, `m2_rm` (cash in)
- `m2_cd`, `m2_sm` (cash out)

## Reference Menu Mapping
- Prefix `m2_*` = Finance & Accounting.
- Mapping tabel menu ada di:
  - `apps/myerpplus-db-mapping/dashboard-mapping/output/m2_menu_table_mapping_simple.tsv`
