# Dashboard Spec - Domain m6

Generated at: 2026-02-25 04:54:34 UTC

## Scope
- Domain prefix: m6
- Candidate tables: 43

## Candidate Tables (Top 15 by Approx Rows)
1. m6_bom_out_history (approx_rows=123)
2. m6_pdr_out_history (approx_rows=69)
3. m6_pd_out_history (approx_rows=58)
4. m6_pdr_history (approx_rows=45)
5. m6_pdr_in_history (approx_rows=45)
6. m6_bom_history (approx_rows=43)
7. m6_bom_in_history (approx_rows=43)
8. m6_pd_out (approx_rows=43)
9. m6_pd_history (approx_rows=34)
10. m6_pd_in_history (approx_rows=34)
11. m6_pd_bom (approx_rows=31)
12. m6_mrs_out_history (approx_rows=30)
13. m6_wo_out_history (approx_rows=30)
14. m6_wo_history (approx_rows=28)
15. m6_wo_in_history (approx_rows=28)

## Recommended KPI Fields (Top 20 High/Medium)
1. m6_bom.bomtotalhargain (priority=high, agg=sum,avg,min,max)
2. m6_bom.bomtotalhargaout (priority=high, agg=sum,avg,min,max)
3. m6_bom.bomtotalhppin (priority=high, agg=sum,avg,min,max)
4. m6_bom.bomtotalhppout (priority=high, agg=sum,avg,min,max)
5. m6_bom_history.bomtotalhargain (priority=high, agg=sum,avg,min,max)
6. m6_bom_history.bomtotalhargaout (priority=high, agg=sum,avg,min,max)
7. m6_bom_history.bomtotalhppin (priority=high, agg=sum,avg,min,max)
8. m6_bom_history.bomtotalhppout (priority=high, agg=sum,avg,min,max)
9. m6_mrn.mrntotalhargain (priority=high, agg=sum,avg,min,max)
10. m6_mrn.mrntotalhargaout (priority=high, agg=sum,avg,min,max)
11. m6_mrn.mrntotalhppin (priority=high, agg=sum,avg,min,max)
12. m6_mrn.mrntotalhppout (priority=high, agg=sum,avg,min,max)
13. m6_mrn_history.mrntotalhargain (priority=high, agg=sum,avg,min,max)
14. m6_mrn_history.mrntotalhargaout (priority=high, agg=sum,avg,min,max)
15. m6_mrn_history.mrntotalhppin (priority=high, agg=sum,avg,min,max)
16. m6_mrn_history.mrntotalhppout (priority=high, agg=sum,avg,min,max)
17. m6_mrs.mrstotalhargain (priority=high, agg=sum,avg,min,max)
18. m6_mrs.mrstotalhargaout (priority=high, agg=sum,avg,min,max)
19. m6_mrs.mrstotalhppin (priority=high, agg=sum,avg,min,max)
20. m6_mrs.mrstotalhppout (priority=high, agg=sum,avg,min,max)

## Recommended Filters (Top 20)
1. m6_bom.bomstatus (group=status)
2. m6_bom.bomstatussebelumnya (group=status)
3. m6_bom_history.bomstatus (group=status)
4. m6_bom_history.bomstatussebelumnya (group=status)
5. m6_mrn.mrnstatuspdin (group=status)
6. m6_mrn.mrnstatuspdout (group=status)
7. m6_mrn.mrnstatusrealisasiin (group=status)
8. m6_mrn.mrnstatusrealisasiout (group=status)
9. m6_mrn.mrnstatus (group=status)
10. m6_mrn.mrnstatussebelumnya (group=status)
11. m6_mrn_history.mrnstatuspdin (group=status)
12. m6_mrn_history.mrnstatuspdout (group=status)
13. m6_mrn_history.mrnstatusrealisasiin (group=status)
14. m6_mrn_history.mrnstatusrealisasiout (group=status)
15. m6_mrn_history.mrnstatus (group=status)
16. m6_mrn_history.mrnstatussebelumnya (group=status)
17. m6_mrn_in.statuspd (group=status)
18. m6_mrn_in.statusrealisasi (group=status)
19. m6_mrn_in_history.statuspd (group=status)
20. m6_mrn_in_history.statusrealisasi (group=status)

## Time-Series Ready Tables (Top 10)
1. m6_bom_out_history (approx_rows=123, date_cols=3, numeric_cols=17)
2. m6_pdr_out_history (approx_rows=69, date_cols=3, numeric_cols=23)
3. m6_pd_out_history (approx_rows=58, date_cols=3, numeric_cols=22)
4. m6_pdr_history (approx_rows=45, date_cols=9, numeric_cols=21)
5. m6_pdr_in_history (approx_rows=45, date_cols=3, numeric_cols=22)
6. m6_bom_history (approx_rows=43, date_cols=8, numeric_cols=19)
7. m6_bom_in_history (approx_rows=43, date_cols=3, numeric_cols=16)
8. m6_pd_out (approx_rows=43, date_cols=3, numeric_cols=20)
9. m6_pd_history (approx_rows=34, date_cols=9, numeric_cols=24)
10. m6_pd_in_history (approx_rows=34, date_cols=3, numeric_cols=21)

## Draft Visuals
1. KPI cards: 3-5 metrik dari bagian Recommended KPI Fields (priority=high).
2. Trend chart: 1-2 metrik time-series dari tabel largest ready.
3. Breakdown chart: group by filter status/classification/actor sesuai domain.
4. Table detail: top 50 records dengan sort by tanggal terbaru.

## API Draft (Suggested)
- GET /api/dashboard/m6/summary
- GET /api/dashboard/m6/trends?from=YYYY-MM-DD&to=YYYY-MM-DD
- GET /api/dashboard/m6/breakdown?group_by=<dimension>
- GET /api/dashboard/m6/table?page=1&page_size=50

## Implementation Notes
- Validasi ulang nama kolom tanggal utama per tabel sebelum implement query final.
- Prioritaskan indeks di kolom tanggal + kolom filter dominan untuk performa.
- Jika relasi lintas tabel tidak ada FK, dokumentasikan join key di service layer.
