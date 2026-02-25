# Dashboard Spec - Domain m7

Generated at: 2026-02-25 04:54:35 UTC

## Scope
- Domain prefix: m7
- Candidate tables: 61

## Candidate Tables (Top 15 by Approx Rows)
1. m7_asset_category_tax (approx_rows=17)
2. m7_da_detail (approx_rows=14)
3. m7_da (approx_rows=8)
4. m7_asset_category (approx_rows=5)
5. m7_asset (approx_rows=3)
6. m7_depreciation_category (approx_rows=3)
7. m7_asset_history (approx_rows=2)
8. m7_ab (approx_rows=0)
9. m7_ab_detail (approx_rows=0)
10. m7_ac (approx_rows=0)
11. m7_ac_detail (approx_rows=0)
12. m7_ae (approx_rows=0)
13. m7_ae_detail (approx_rows=0)
14. m7_ag (approx_rows=0)
15. m7_ag_detail (approx_rows=0)

## Recommended KPI Fields (Top 20 High/Medium)
1. m7_ae.aetotal (priority=high, agg=sum,avg,min,max)
2. m7_ae.aetotalpajak1detail (priority=high, agg=sum,avg,min,max)
3. m7_ae.aetotalpajak2detail (priority=high, agg=sum,avg,min,max)
4. m7_ae.aetotaltransaksi (priority=high, agg=sum,avg,min,max)
5. m7_ao.aototal (priority=high, agg=sum,avg,min,max)
6. m7_ao.aototalpajak1detail (priority=high, agg=sum,avg,min,max)
7. m7_ao.aototalpajak2detail (priority=high, agg=sum,avg,min,max)
8. m7_ao.aototaltransaksi (priority=high, agg=sum,avg,min,max)
9. m7_aq.aqtotal (priority=high, agg=sum,avg,min,max)
10. m7_aq.aqtotalpajak1detail (priority=high, agg=sum,avg,min,max)
11. m7_aq.aqtotalpajak2detail (priority=high, agg=sum,avg,min,max)
12. m7_aq.aqtotaltransaksi (priority=high, agg=sum,avg,min,max)
13. m7_ar.artotal (priority=high, agg=sum,avg,min,max)
14. m7_ar.artotalpajak1detail (priority=high, agg=sum,avg,min,max)
15. m7_ar.artotalpajak2detail (priority=high, agg=sum,avg,min,max)
16. m7_ar.artotaltransaksi (priority=high, agg=sum,avg,min,max)
17. m7_asl.asltotal (priority=high, agg=sum,avg,min,max)
18. m7_asl.asltotalpajak1detail (priority=high, agg=sum,avg,min,max)
19. m7_asl.asltotalpajak2detail (priority=high, agg=sum,avg,min,max)
20. m7_asl.asltotaltransaksi (priority=high, agg=sum,avg,min,max)

## Recommended Filters (Top 20)
1. m7_ab.abidaq1statusao (group=status)
2. m7_ab.abidaq2statusao (group=status)
3. m7_ab.abidaq3statusao (group=status)
4. m7_ab.abidaq4statusao (group=status)
5. m7_ab.abidaq5statusao (group=status)
6. m7_ab.abstatus (group=status)
7. m7_ab.abstatussebelumnya (group=status)
8. m7_ae.aesupplier (group=actor)
9. m7_ae.aesupplierkontak (group=actor)
10. m7_ae.aestatuslunas (group=status)
11. m7_ae.aestatusai (group=status)
12. m7_ae.aestatusrealisasi (group=status)
13. m7_ae.aestatus (group=status)
14. m7_ae.aestatussebelumnya (group=status)
15. m7_ae_detail.statusrealisasi (group=status)
16. m7_ag.agstatus (group=status)
17. m7_ag.agstatussebelumnya (group=status)
18. m7_ao.aosupplier (group=actor)
19. m7_ao.aosupplierkontak (group=actor)
20. m7_ao.aostatusae (group=status)

## Time-Series Ready Tables (Top 10)
1. m7_asset_category_tax (approx_rows=17, date_cols=5, numeric_cols=11)
2. m7_da_detail (approx_rows=14, date_cols=3, numeric_cols=11)
3. m7_da (approx_rows=8, date_cols=8, numeric_cols=13)
4. m7_asset_category (approx_rows=5, date_cols=5, numeric_cols=8)
5. m7_asset (approx_rows=3, date_cols=11, numeric_cols=32)
6. m7_asset_history (approx_rows=2, date_cols=11, numeric_cols=33)
7. m7_ab (approx_rows=0, date_cols=8, numeric_cols=18)
8. m7_ac (approx_rows=0, date_cols=2, numeric_cols=4)
9. m7_ae (approx_rows=0, date_cols=12, numeric_cols=25)
10. m7_ae_detail (approx_rows=0, date_cols=3, numeric_cols=18)

## Draft Visuals
1. KPI cards: 3-5 metrik dari bagian Recommended KPI Fields (priority=high).
2. Trend chart: 1-2 metrik time-series dari tabel largest ready.
3. Breakdown chart: group by filter status/classification/actor sesuai domain.
4. Table detail: top 50 records dengan sort by tanggal terbaru.

## API Draft (Suggested)
- GET /api/dashboard/m7/summary
- GET /api/dashboard/m7/trends?from=YYYY-MM-DD&to=YYYY-MM-DD
- GET /api/dashboard/m7/breakdown?group_by=<dimension>
- GET /api/dashboard/m7/table?page=1&page_size=50

## Implementation Notes
- Validasi ulang nama kolom tanggal utama per tabel sebelum implement query final.
- Prioritaskan indeks di kolom tanggal + kolom filter dominan untuk performa.
- Jika relasi lintas tabel tidak ada FK, dokumentasikan join key di service layer.
