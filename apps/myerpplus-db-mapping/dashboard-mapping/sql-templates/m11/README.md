# SQL Templates - Domain m11

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
- primary_table: m_11_ak
- metric_source: m_11_ak.aktotaltransaksi
- trend_source: m_11_ak.aktotaltransaksi
- filter_source: m_11_ak.akcustomer
- breakdown_metric_source: m_11_ak.aktotaltransaksi

Template sudah dibuat valid secara default (tanpa filter tanggal). Tambahkan kolom tanggal aktual pada baris komentar DATE(<date_column>) sebelum dipakai di production query.
