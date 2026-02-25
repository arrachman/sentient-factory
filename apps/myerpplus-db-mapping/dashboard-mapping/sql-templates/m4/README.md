# SQL Templates - Domain m4

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
- primary_table: m4_po_detail
- metric_source: m4_po.pototal
- trend_source: m4_po_detail.idpodetail
- filter_source: m4_ap.apstatusbayar
- breakdown_metric_source: m4_ap.apid

Template sudah dibuat valid secara default (tanpa filter tanggal). Tambahkan kolom tanggal aktual pada baris komentar DATE(<date_column>) sebelum dipakai di production query.
