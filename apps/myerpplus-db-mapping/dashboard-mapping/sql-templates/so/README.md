# SQL Templates - Domain so

Template SQL untuk dashboard Sales Order.

## Files
- summary.sql
- trends.sql
- breakdown.sql
- breakdown_status.sql
- breakdown_realisasi.sql
- breakdown_salesman.sql
- breakdown_customer.sql
- table.sql

## Placeholder Params
- :from_date (DATE)
- :to_date (DATE)
- :limit (INT)
- :offset (INT)

## Current Picks
- main_header_table: m5_so
- main_detail_table: m5_so_detail
- date_column: m5_so.sotgl
- join_key: m5_so.soid = m5_so_detail.idso

## Metric Policy (Recommended)
- Gunakan nilai finansial header (`m5_so.sototal`, `m5_so.sototaltransaksi`, `m5_so.sojmldiskon`, `m5_so.sototalpajak1detail`, `m5_so.sototalpajak2detail`) sebagai metrik utama.
- Gunakan detail (`m5_so_detail`) untuk kuantitas/item-level (`jml`, line count, item breakdown).
- Saat join header-detail, agregasikan detail per `idso` terlebih dahulu agar total header tidak terduplikasi.

## Status Label Mapping (Assumption)
- `sostatus`: `0=draft`, `1=open`, `2=posted`, `3=closed`, lainnya `unknown_<code>`
- `sostatusrealisasi`: `0=not_realized`, `1=partial`, `2=full`, lainnya `unknown_<code>`

Validasi mapping status dengan business user sebelum dipakai untuk laporan resmi.

## Ready-to-Use Breakdown Queries
- `breakdown_status.sql`: breakdown amount/qty berdasarkan `m5_so.sostatus`.
- `breakdown_realisasi.sql`: breakdown amount/qty berdasarkan `m5_so.sostatusrealisasi`.
- `breakdown_salesman.sql`: breakdown amount/qty berdasarkan `m5_so.sobagianpenjualan`.
- `breakdown_customer.sql`: breakdown amount/qty berdasarkan `m5_so.socustomer`.
