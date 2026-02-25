# SQL Templates - Domain m6

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
- primary_table: m6_bom_out_history
- metric_source: m6_pdr_history.pdrtotalhargain
- trend_source: m6_bom_out_history.idhistoryout
- filter_source: m6_bom.bomstatus
- breakdown_metric_source: m6_bom.bomtotalhargain

Template sudah dibuat valid secara default (tanpa filter tanggal). Tambahkan kolom tanggal aktual pada baris komentar DATE(<date_column>) sebelum dipakai di production query.
