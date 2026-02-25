# Dashboard Spec - Domain m5

Generated at: 2026-02-25 04:54:34 UTC

## Scope
- Domain prefix: m5
- Candidate tables: 82

## Candidate Tables (Top 15 by Approx Rows)
1. m5_ic_detail_history (approx_rows=139)
2. m5_si_detail (approx_rows=109)
3. m5_so_detail (approx_rows=94)
4. m5_si_history (approx_rows=83)
5. m5_si (approx_rows=81)
6. m5_pv_detail (approx_rows=76)
7. m5_si_detail_history (approx_rows=73)
8. m5_sq_detail (approx_rows=68)
9. m5_ic_detail (approx_rows=67)
10. m5_do_detail (approx_rows=63)
11. m5_so_detail_history (approx_rows=63)
12. m5_so (approx_rows=54)
13. m5_ic_history (approx_rows=52)
14. m5_do_detail_history (approx_rows=51)
15. m5_pv_detail_history (approx_rows=51)

## Recommended KPI Fields (Top 20 High/Medium)
1. m5_cl.cltotal (priority=high, agg=sum,avg,min,max)
2. m5_cl.cltotalpajak1detail (priority=high, agg=sum,avg,min,max)
3. m5_cl.cltotalpajak2detail (priority=high, agg=sum,avg,min,max)
4. m5_cl.cltotaltransaksi (priority=high, agg=sum,avg,min,max)
5. m5_cl_history.cltotal (priority=high, agg=sum,avg,min,max)
6. m5_cl_history.cltotalpajak1detail (priority=high, agg=sum,avg,min,max)
7. m5_cl_history.cltotalpajak2detail (priority=high, agg=sum,avg,min,max)
8. m5_cl_history.cltotaltransaksi (priority=high, agg=sum,avg,min,max)
9. m5_do.dototal (priority=high, agg=sum,avg,min,max)
10. m5_do.dototalpajak1detail (priority=high, agg=sum,avg,min,max)
11. m5_do.dototalpajak2detail (priority=high, agg=sum,avg,min,max)
12. m5_do.dototaltransaksi (priority=high, agg=sum,avg,min,max)
13. m5_do_history.dototal (priority=high, agg=sum,avg,min,max)
14. m5_do_history.dototalpajak1detail (priority=high, agg=sum,avg,min,max)
15. m5_do_history.dototalpajak2detail (priority=high, agg=sum,avg,min,max)
16. m5_do_history.dototaltransaksi (priority=high, agg=sum,avg,min,max)
17. m5_dr.drtotal (priority=high, agg=sum,avg,min,max)
18. m5_dr.drtotalpajak1detail (priority=high, agg=sum,avg,min,max)
19. m5_dr.drtotalpajak2detail (priority=high, agg=sum,avg,min,max)
20. m5_dr.drtotaltransaksi (priority=high, agg=sum,avg,min,max)

## Recommended Filters (Top 20)
1. m5_as.asstatusbayar (group=status)
2. m5_as.asstatus (group=status)
3. m5_as.asstatussebelumnya (group=status)
4. m5_as_history.asstatusbayar (group=status)
5. m5_as_history.asstatus (group=status)
6. m5_as_history.asstatussebelumnya (group=status)
7. m5_cl.clcustomer (group=actor)
8. m5_cl.clcustomerkontak (group=actor)
9. m5_cl.clstatuspi (group=status)
10. m5_cl.clstatuspl (group=status)
11. m5_cl.clstatusdo (group=status)
12. m5_cl.clstatusdr (group=status)
13. m5_cl.clstatussi (group=status)
14. m5_cl.clstatusrnr (group=status)
15. m5_cl.clstatussr (group=status)
16. m5_cl.clstatusrealisasi (group=status)
17. m5_cl.clstatus (group=status)
18. m5_cl.clstatussebelumnya (group=status)
19. m5_cl_history.clcustomer (group=actor)
20. m5_cl_history.clcustomerkontak (group=actor)

## Time-Series Ready Tables (Top 10)
1. m5_ic_detail_history (approx_rows=139, date_cols=3, numeric_cols=21)
2. m5_si_detail (approx_rows=109, date_cols=3, numeric_cols=29)
3. m5_so_detail (approx_rows=94, date_cols=3, numeric_cols=24)
4. m5_si_history (approx_rows=83, date_cols=21, numeric_cols=54)
5. m5_si (approx_rows=81, date_cols=21, numeric_cols=53)
6. m5_pv_detail (approx_rows=76, date_cols=3, numeric_cols=17)
7. m5_si_detail_history (approx_rows=73, date_cols=3, numeric_cols=31)
8. m5_sq_detail (approx_rows=68, date_cols=3, numeric_cols=26)
9. m5_ic_detail (approx_rows=67, date_cols=3, numeric_cols=19)
10. m5_do_detail (approx_rows=63, date_cols=3, numeric_cols=27)

## Draft Visuals
1. KPI cards: 3-5 metrik dari bagian Recommended KPI Fields (priority=high).
2. Trend chart: 1-2 metrik time-series dari tabel largest ready.
3. Breakdown chart: group by filter status/classification/actor sesuai domain.
4. Table detail: top 50 records dengan sort by tanggal terbaru.

## API Draft (Suggested)
- GET /api/dashboard/m5/summary
- GET /api/dashboard/m5/trends?from=YYYY-MM-DD&to=YYYY-MM-DD
- GET /api/dashboard/m5/breakdown?group_by=<dimension>
- GET /api/dashboard/m5/table?page=1&page_size=50

## Implementation Notes
- Validasi ulang nama kolom tanggal utama per tabel sebelum implement query final.
- Prioritaskan indeks di kolom tanggal + kolom filter dominan untuk performa.
- Jika relasi lintas tabel tidak ada FK, dokumentasikan join key di service layer.
