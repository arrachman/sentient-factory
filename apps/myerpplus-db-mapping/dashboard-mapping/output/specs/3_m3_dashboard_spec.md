# Dashboard Spec - Domain m3

Generated at: 2026-02-25 04:54:34 UTC

## Scope
- Domain prefix: m3
- Candidate tables: 44

## Candidate Tables (Top 15 by Approx Rows)
1. m3_ib_detail (approx_rows=513)
2. m3_sp_detail_progress (approx_rows=426)
3. m3_sp_detail (approx_rows=424)
4. m3_sp_detail_history (approx_rows=394)
5. m3_ts_detail (approx_rows=38)
6. m3_sa_detail (approx_rows=29)
7. m3_sp_progress (approx_rows=28)
8. m3_sp (approx_rows=26)
9. m3_ts_detail_history (approx_rows=26)
10. m3_ts (approx_rows=24)
11. m3_sp_history (approx_rows=22)
12. m3_rs_detail (approx_rows=18)
13. m3_sa (approx_rows=18)
14. m3_mr_detail (approx_rows=16)
15. m3_ts_history (approx_rows=16)

## Recommended KPI Fields (Top 20 High/Medium)
1. m3_dc.dchmtotal (priority=high, agg=sum,avg,min,max)
2. m3_dc_history.dchmtotal (priority=high, agg=sum,avg,min,max)
3. m3_dc.dccustomdbl1 (priority=medium, agg=avg)
4. m3_dc.dccustomdbl2 (priority=medium, agg=avg)
5. m3_dc.dccustomdbl3 (priority=medium, agg=avg)
6. m3_dc.dccustomint1 (priority=medium, agg=sum,count,avg)
7. m3_dc.dccustomint2 (priority=medium, agg=sum,count,avg)
8. m3_dc.dccustomint3 (priority=medium, agg=sum,count,avg)
9. m3_dc.dcdimintaoleh (priority=medium, agg=sum,count,avg)
10. m3_dc.dchmstart (priority=medium, agg=avg)
11. m3_dc.dchmstop (priority=medium, agg=avg)
12. m3_dc.dcid (priority=medium, agg=sum,count,avg)
13. m3_dc.dcidbarang (priority=medium, agg=sum,count,avg)
14. m3_dc.dcinputuser (priority=medium, agg=sum,count,avg)
15. m3_dc.dcjmlrevisi (priority=medium, agg=sum,count,avg)
16. m3_dc.dckodepa (priority=medium, agg=sum,count,avg)
17. m3_dc.dcmintake (priority=medium, agg=sum,count,avg)
18. m3_dc.dcmodifikasiuser (priority=medium, agg=sum,count,avg)
19. m3_dc.dcshift (priority=medium, agg=sum,count,avg)
20. m3_dc_check.customdbl1 (priority=medium, agg=avg)

## Recommended Filters (Top 20)
1. m3_dc.dcstatusts (group=status)
2. m3_dc.dcstatusrs (group=status)
3. m3_dc.dcstatusrealisasi (group=status)
4. m3_dc.dcstatus (group=status)
5. m3_dc.dcstatussebelumnya (group=status)
6. m3_dc_check.status (group=status)
7. m3_dc_check_history.status (group=status)
8. m3_dc_detail.statusrealisasi (group=status)
9. m3_dc_detail_history.statusrealisasi (group=status)
10. m3_dc_history.dcstatusts (group=status)
11. m3_dc_history.dcstatusrs (group=status)
12. m3_dc_history.dcstatusrealisasi (group=status)
13. m3_dc_history.dcstatus (group=status)
14. m3_dc_history.dcstatussebelumnya (group=status)
15. m3_ib.ibstatus (group=status)
16. m3_ib.ibstatussebelumnya (group=status)
17. m3_ib_history.ibstatus (group=status)
18. m3_ib_history.ibstatussebelumnya (group=status)
19. m3_mr.mrstatusts (group=status)
20. m3_mr.mrstatusrs (group=status)

## Time-Series Ready Tables (Top 10)
1. m3_ib_detail (approx_rows=513, date_cols=3, numeric_cols=13)
2. m3_sp_detail_progress (approx_rows=426, date_cols=3, numeric_cols=21)
3. m3_sp_detail (approx_rows=424, date_cols=3, numeric_cols=19)
4. m3_sp_detail_history (approx_rows=394, date_cols=3, numeric_cols=21)
5. m3_ts_detail (approx_rows=38, date_cols=3, numeric_cols=15)
6. m3_sa_detail (approx_rows=29, date_cols=3, numeric_cols=16)
7. m3_sp_progress (approx_rows=28, date_cols=8, numeric_cols=14)
8. m3_sp (approx_rows=26, date_cols=8, numeric_cols=13)
9. m3_ts_detail_history (approx_rows=26, date_cols=3, numeric_cols=17)
10. m3_ts (approx_rows=24, date_cols=8, numeric_cols=13)

## Draft Visuals
1. KPI cards: 3-5 metrik dari bagian Recommended KPI Fields (priority=high).
2. Trend chart: 1-2 metrik time-series dari tabel largest ready.
3. Breakdown chart: group by filter status/classification/actor sesuai domain.
4. Table detail: top 50 records dengan sort by tanggal terbaru.

## API Draft (Suggested)
- GET /api/dashboard/m3/summary
- GET /api/dashboard/m3/trends?from=YYYY-MM-DD&to=YYYY-MM-DD
- GET /api/dashboard/m3/breakdown?group_by=<dimension>
- GET /api/dashboard/m3/table?page=1&page_size=50

## Implementation Notes
- Validasi ulang nama kolom tanggal utama per tabel sebelum implement query final.
- Prioritaskan indeks di kolom tanggal + kolom filter dominan untuk performa.
- Jika relasi lintas tabel tidak ada FK, dokumentasikan join key di service layer.
