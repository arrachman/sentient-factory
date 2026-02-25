# SQL Templates - Domain m7

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
- primary_table: m7_asset_category_tax
- metric_source: m7_ae.aetotal
- trend_source: m7_asset_category_tax.actmetode
- filter_source: m7_ab.abidaq1statusao
- breakdown_metric_source: m7_ab.abid

Template sudah dibuat valid secara default (tanpa filter tanggal). Tambahkan kolom tanggal aktual pada baris komentar DATE(<date_column>) sebelum dipakai di production query.
