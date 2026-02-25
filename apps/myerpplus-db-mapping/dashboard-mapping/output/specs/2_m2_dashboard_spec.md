# Dashboard Spec - Domain m2

Generated at: 2026-02-25 04:54:34 UTC

## Scope
- Domain prefix: m2
- Candidate tables: 75

## Candidate Tables (Top 15 by Approx Rows)
1. m2_transaction_journal (approx_rows=1214)
2. m2_realization (approx_rows=1094)
3. m2_realization_project (approx_rows=75)
4. m2_gj_detail (approx_rows=52)
5. m2_realization_branch (approx_rows=39)
6. m2_realization_location (approx_rows=39)
7. m2_cr_detail_history (approx_rows=36)
8. m2_cr_history (approx_rows=36)
9. m2_rgc_detail_history (approx_rows=32)
10. m2_rgc_history (approx_rows=29)
11. m2_gj_detail_history (approx_rows=28)
12. m2_accounting_period (approx_rows=27)
13. m2_cr_detail (approx_rows=27)
14. m2_giro_list (approx_rows=25)
15. m2_cr (approx_rows=24)

## Recommended KPI Fields (Top 20 High/Medium)
1. m2_accounting_period.apkode (priority=medium, agg=sum,count,avg)
2. m2_aj.ajcustomdbl1 (priority=medium, agg=avg)
3. m2_aj.ajcustomdbl2 (priority=medium, agg=avg)
4. m2_aj.ajcustomdbl3 (priority=medium, agg=avg)
5. m2_aj.ajcustomint1 (priority=medium, agg=sum,count,avg)
6. m2_aj.ajcustomint2 (priority=medium, agg=sum,count,avg)
7. m2_aj.ajcustomint3 (priority=medium, agg=sum,count,avg)
8. m2_aj.ajdebit (priority=medium, agg=avg)
9. m2_aj.ajdebitvalas (priority=medium, agg=avg)
10. m2_aj.ajid (priority=medium, agg=sum,count,avg)
11. m2_aj.ajinputuser (priority=medium, agg=sum,count,avg)
12. m2_aj.ajisclose (priority=medium, agg=sum,count,avg)
13. m2_aj.ajjmlrevisi (priority=medium, agg=sum,count,avg)
14. m2_aj.ajjumlahbayar (priority=medium, agg=avg)
15. m2_aj.ajjumlahbayarvalas (priority=medium, agg=avg)
16. m2_aj.ajkodepa (priority=medium, agg=sum,count,avg)
17. m2_aj.ajkontak (priority=medium, agg=sum,count,avg)
18. m2_aj.ajkredit (priority=medium, agg=avg)
19. m2_aj.ajkreditvalas (priority=medium, agg=avg)
20. m2_aj.ajkurs (priority=medium, agg=avg)

## Recommended Filters (Top 20)
1. m2_aj.ajstatusbayar (group=status)
2. m2_aj.ajstatus (group=status)
3. m2_aj.ajstatussebelumnya (group=status)
4. m2_aj_history.ajstatusbayar (group=status)
5. m2_aj_history.ajstatus (group=status)
6. m2_aj_history.ajstatussebelumnya (group=status)
7. m2_bd.bdstatus (group=status)
8. m2_bd.bdstatussebelumnya (group=status)
9. m2_bd_history.bdstatus (group=status)
10. m2_bd_history.bdstatussebelumnya (group=status)
11. m2_cb.cbstatusbayar (group=status)
12. m2_cb.cbstatus (group=status)
13. m2_cb.cbstatussebelumnya (group=status)
14. m2_cb_history.cbstatusbayar (group=status)
15. m2_cb_history.cbstatus (group=status)
16. m2_cb_history.cbstatussebelumnya (group=status)
17. m2_cd.cdstatusbayar (group=status)
18. m2_cd.cdstatus (group=status)
19. m2_cd.cdstatussebelumnya (group=status)
20. m2_cd_history.cdstatusbayar (group=status)

## Time-Series Ready Tables (Top 10)
1. m2_transaction_journal (approx_rows=1214, date_cols=7, numeric_cols=15)
2. m2_gj_detail (approx_rows=52, date_cols=3, numeric_cols=12)
3. m2_cr_detail_history (approx_rows=36, date_cols=3, numeric_cols=12)
4. m2_cr_history (approx_rows=36, date_cols=8, numeric_cols=19)
5. m2_rgc_detail_history (approx_rows=32, date_cols=4, numeric_cols=14)
6. m2_rgc_history (approx_rows=29, date_cols=7, numeric_cols=18)
7. m2_gj_detail_history (approx_rows=28, date_cols=3, numeric_cols=14)
8. m2_cr_detail (approx_rows=27, date_cols=3, numeric_cols=10)
9. m2_giro_list (approx_rows=25, date_cols=2, numeric_cols=6)
10. m2_cr (approx_rows=24, date_cols=8, numeric_cols=18)

## Draft Visuals
1. KPI cards: 3-5 metrik dari bagian Recommended KPI Fields (priority=high).
2. Trend chart: 1-2 metrik time-series dari tabel largest ready.
3. Breakdown chart: group by filter status/classification/actor sesuai domain.
4. Table detail: top 50 records dengan sort by tanggal terbaru.

## API Draft (Suggested)
- GET /api/dashboard/m2/summary
- GET /api/dashboard/m2/trends?from=YYYY-MM-DD&to=YYYY-MM-DD
- GET /api/dashboard/m2/breakdown?group_by=<dimension>
- GET /api/dashboard/m2/table?page=1&page_size=50

## Implementation Notes
- Validasi ulang nama kolom tanggal utama per tabel sebelum implement query final.
- Prioritaskan indeks di kolom tanggal + kolom filter dominan untuk performa.
- Jika relasi lintas tabel tidak ada FK, dokumentasikan join key di service layer.
