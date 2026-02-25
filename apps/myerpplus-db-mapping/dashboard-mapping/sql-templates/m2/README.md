# SQL Templates - Domain m2

Template SQL ini adalah draft awal dari hasil dashboard mapping otomatis.

## Files
- summary.sql
- trends.sql
- breakdown.sql
- table.sql

## Placeholder Params
- :from_date (DATE)
- :to_date (DATE)
- :group_by (dimension column)
- :limit (INT)
- :offset (INT)

## Current Auto Picks
- primary_table: m2_transaction_journal
- metric_source: m2_transaction_journal.tid
- trend_source: m2_transaction_journal.tid
- filter_source: m2_aj.ajstatusbayar
- breakdown_metric_source: m2_aj.ajid

Template sudah dibuat valid secara default (tanpa filter tanggal). Tambahkan kolom tanggal aktual pada baris komentar DATE(<date_column>) sebelum dipakai di production query.
