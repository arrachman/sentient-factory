# Dashboard Mapping Summary

Generated at: 2026-02-25 03:14:54 UTC

## Snapshot
- Domain candidates: 1048 rows
- KPI candidates: 14772 rows
- Filter dimension candidates: 1570 rows
- Time-series readiness rows: 1048 rows
- Join hubs (FK + heuristic): 74 rows

## Top Domain Prefixes
1. `m1` (201 tables, approx_rows=10754, numeric_cols=1795, dimension_hints=28)
2. `m` (163 tables, approx_rows=1150, numeric_cols=1942, dimension_hints=170)
3. `m2r` (96 tables, approx_rows=4038, numeric_cols=1800, dimension_hints=51)
4. `m0` (95 tables, approx_rows=55405, numeric_cols=370, dimension_hints=23)
5. `m5` (82 tables, approx_rows=1939, numeric_cols=1797, dimension_hints=371)
6. `m4` (76 tables, approx_rows=2934, numeric_cols=1454, dimension_hints=265)
7. `m2` (Finance & Accounting, 75 tables, approx_rows=3121, numeric_cols=947, dimension_hints=96)
8. `m7` (61 tables, approx_rows=52, numeric_cols=822, dimension_hints=124)
9. `m3` (44 tables, approx_rows=2131, numeric_cols=661, dimension_hints=92)
10. `m6` (43 tables, approx_rows=991, numeric_cols=811, dimension_hints=136)

## KPI Priority
- high: 627
- medium: 14145
- low: 0

### Tables With Most High-Priority KPI Columns
1. `m2r_laba_pertahun` (15 high KPI columns)
2. `m2r_posisi_keuangan_pertahun` (15 high KPI columns)
3. `m2r_posisi_keuangan_tahun` (13 high KPI columns)
4. `m4_ri_cost_history` (9 high KPI columns)
5. `m2r_penjualan_per4bulan` (8 high KPI columns)
6. `m4_grn_cost_history` (8 high KPI columns)
7. `m4_ri_cost` (8 high KPI columns)
8. `m2r_bb_divisi` (7 high KPI columns)
9. `m4_grn_cost` (7 high KPI columns)
10. `m2r_perincian_biaya` (6 high KPI columns)

## Filter Dimensions
- status: 1299 columns
- actor: 218 columns
- classification: 21 columns
- location: 19 columns
- organization: 13 columns

## Time-Series Readiness
- ready: 868
- partial: 1
- not_ready: 179

### Largest Ready Tables
1. `m0_hitungulang_log` (approx_rows=7655)
2. `m0_userlog` (approx_rows=2972)
3. `m1_cogs_fifo_in` (approx_rows=2622)
4. `m1_item` (approx_rows=2279)
5. `m2_transaction_journal` (approx_rows=1214)
6. `m0_report` (approx_rows=1192)
7. `m_12_pos_item` (approx_rows=1094)
8. `m0_report_copy` (approx_rows=1069)
9. `m0_msmq` (approx_rows=1009)
10. `m1_no_serial_transaction` (approx_rows=825)

## Join Hubs
1. `m0_user` (total_links=103, inbound_fk=0, soft_links=103, referring_tables=97)
2. `users` (total_links=100, inbound_fk=0, soft_links=100, referring_tables=96)
3. `m0_module` (total_links=18, inbound_fk=0, soft_links=18, referring_tables=18)
4. `m0_menu` (total_links=16, inbound_fk=0, soft_links=16, referring_tables=16)
5. `m0_menu_lang` (total_links=16, inbound_fk=0, soft_links=16, referring_tables=16)
6. `m0_menu_s` (total_links=16, inbound_fk=0, soft_links=16, referring_tables=16)
7. `0_ar` (total_links=12, inbound_fk=0, soft_links=12, referring_tables=12)
8. `m7_ar` (total_links=12, inbound_fk=0, soft_links=12, referring_tables=12)
9. `m7_ar_detail` (total_links=12, inbound_fk=0, soft_links=12, referring_tables=12)
10. `0_ap` (total_links=10, inbound_fk=0, soft_links=10, referring_tables=10)

## Next Actions
1. Prioritaskan 3 domain teratas pada bagian Top Domain Prefixes sebagai kandidat dashboard v1.
2. Pilih 5-10 tabel dari bagian Largest Ready Tables untuk metric time-series awal.
3. Jika Join Hubs kosong, dokumentasikan relasi aplikasi-level (soft relation) di luar FK database.
