# SQL Templates - Domain m8

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
- primary_table: m8_content_role
- metric_source: m8_indicator.ivalue1
- trend_source: m8_content.cmodule
- filter_source: m8_indicator.status
- breakdown_metric_source: m8_indicator.ivalue1

Template sudah dibuat valid secara default (tanpa filter tanggal). Tambahkan kolom tanggal aktual pada baris komentar DATE(<date_column>) sebelum dipakai di production query.
