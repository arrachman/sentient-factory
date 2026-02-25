# SQL Templates - Domain m5

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
- primary_table: m5_ic_detail_history
- metric_source: m5_ic_detail_history.totaltransaksi
- trend_source: m5_ic_detail_history.totaltransaksi
- filter_source: m5_as.asstatusbayar
- breakdown_metric_source: m5_as.asid

Template sudah dibuat valid secara default (tanpa filter tanggal). Tambahkan kolom tanggal aktual pada baris komentar DATE(<date_column>) sebelum dipakai di production query.
