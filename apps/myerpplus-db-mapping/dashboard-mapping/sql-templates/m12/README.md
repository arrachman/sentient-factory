# SQL Templates - Domain m12

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
- primary_table: m_12_pos_item
- metric_source: m_12_ppv.ppvtotalap
- trend_source: m_12_pos_item.piidbarang
- filter_source: m_12_ai.aistatus
- breakdown_metric_source: m_12_ai.aiid

Template sudah dibuat valid secara default (tanpa filter tanggal). Tambahkan kolom tanggal aktual pada baris komentar DATE(<date_column>) sebelum dipakai di production query.
