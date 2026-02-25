# Dashboard Spec - Domain m4

Generated at: 2026-02-25 04:54:34 UTC

## Scope
- Domain prefix: m4
- Candidate tables: 76

## Candidate Tables (Top 15 by Approx Rows)
1. m4_po_detail (approx_rows=243)
2. m4_grn_detail (approx_rows=169)
3. m4_grn_detail_history (approx_rows=163)
4. m4_po_detail_history (approx_rows=159)
5. m4_po (approx_rows=146)
6. m4_pr_detail (approx_rows=132)
7. m4_ri_detail_history (approx_rows=125)
8. m4_grn_history (approx_rows=118)
9. m4_vp_detail_history (approx_rows=115)
10. m4_po_history (approx_rows=114)
11. m4_ri_detail (approx_rows=113)
12. m4_pr_detail_history (approx_rows=100)
13. m4_vp_detail (approx_rows=97)
14. m4_grn (approx_rows=96)
15. m4_pr (approx_rows=80)

## Recommended KPI Fields (Top 20 High/Medium)
1. m4_cs.cstotal (priority=high, agg=sum,avg,min,max)
2. m4_cs.cstotalpajak1detail (priority=high, agg=sum,avg,min,max)
3. m4_cs.cstotalpajak2detail (priority=high, agg=sum,avg,min,max)
4. m4_cs.cstotaltransaksi (priority=high, agg=sum,avg,min,max)
5. m4_dnr.dnrtotal (priority=high, agg=sum,avg,min,max)
6. m4_dnr.dnrtotalpajak1detail (priority=high, agg=sum,avg,min,max)
7. m4_dnr.dnrtotalpajak2detail (priority=high, agg=sum,avg,min,max)
8. m4_dnr.dnrtotaltransaksi (priority=high, agg=sum,avg,min,max)
9. m4_dnr_history.dnrtotal (priority=high, agg=sum,avg,min,max)
10. m4_dnr_history.dnrtotalpajak1detail (priority=high, agg=sum,avg,min,max)
11. m4_dnr_history.dnrtotalpajak2detail (priority=high, agg=sum,avg,min,max)
12. m4_dnr_history.dnrtotaltransaksi (priority=high, agg=sum,avg,min,max)
13. m4_grn.grntotal (priority=high, agg=sum,avg,min,max)
14. m4_grn.grntotalpajak1detail (priority=high, agg=sum,avg,min,max)
15. m4_grn.grntotalpajak2detail (priority=high, agg=sum,avg,min,max)
16. m4_grn.grntotaltransaksi (priority=high, agg=sum,avg,min,max)
17. m4_grn_cost.idbscost (priority=high, agg=sum,avg,min,max)
18. m4_grn_cost.idcscost (priority=high, agg=sum,avg,min,max)
19. m4_grn_cost.idgrncost (priority=high, agg=sum,avg,min,max)
20. m4_grn_cost.idipccost (priority=high, agg=sum,avg,min,max)

## Recommended Filters (Top 20)
1. m4_ap.apstatusbayar (group=status)
2. m4_ap.apstatusvpp (group=status)
3. m4_ap.apstatus (group=status)
4. m4_ap.apstatussebelumnya (group=status)
5. m4_ap_history.apstatusbayar (group=status)
6. m4_ap_history.apstatusvpp (group=status)
7. m4_ap_history.apstatus (group=status)
8. m4_ap_history.apstatussebelumnya (group=status)
9. m4_bs.bsidrq1statuspo (group=status)
10. m4_bs.bsidrq2statuspo (group=status)
11. m4_bs.bsidrq3statuspo (group=status)
12. m4_bs.bsidrq4statuspo (group=status)
13. m4_bs.bsidrq5statuspo (group=status)
14. m4_bs.bsstatus (group=status)
15. m4_bs.bsstatussebelumnya (group=status)
16. m4_bs_history.bsidrq1statuspo (group=status)
17. m4_bs_history.bsidrq2statuspo (group=status)
18. m4_bs_history.bsidrq3statuspo (group=status)
19. m4_bs_history.bsidrq4statuspo (group=status)
20. m4_bs_history.bsidrq5statuspo (group=status)

## Time-Series Ready Tables (Top 10)
1. m4_po_detail (approx_rows=243, date_cols=3, numeric_cols=25)
2. m4_grn_detail (approx_rows=169, date_cols=3, numeric_cols=26)
3. m4_grn_detail_history (approx_rows=163, date_cols=3, numeric_cols=28)
4. m4_po_detail_history (approx_rows=159, date_cols=3, numeric_cols=27)
5. m4_po (approx_rows=146, date_cols=11, numeric_cols=25)
6. m4_pr_detail (approx_rows=132, date_cols=3, numeric_cols=29)
7. m4_ri_detail_history (approx_rows=125, date_cols=3, numeric_cols=27)
8. m4_grn_history (approx_rows=118, date_cols=10, numeric_cols=28)
9. m4_vp_detail_history (approx_rows=115, date_cols=3, numeric_cols=19)
10. m4_po_history (approx_rows=114, date_cols=11, numeric_cols=26)

## Draft Visuals
1. KPI cards: 3-5 metrik dari bagian Recommended KPI Fields (priority=high).
2. Trend chart: 1-2 metrik time-series dari tabel largest ready.
3. Breakdown chart: group by filter status/classification/actor sesuai domain.
4. Table detail: top 50 records dengan sort by tanggal terbaru.

## API Draft (Suggested)
- GET /api/dashboard/m4/summary
- GET /api/dashboard/m4/trends?from=YYYY-MM-DD&to=YYYY-MM-DD
- GET /api/dashboard/m4/breakdown?group_by=<dimension>
- GET /api/dashboard/m4/table?page=1&page_size=50

## Implementation Notes
- Validasi ulang nama kolom tanggal utama per tabel sebelum implement query final.
- Prioritaskan indeks di kolom tanggal + kolom filter dominan untuk performa.
- Jika relasi lintas tabel tidak ada FK, dokumentasikan join key di service layer.
