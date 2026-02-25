# Dashboard Spec - Domain m12

Generated at: 2026-02-25 04:54:35 UTC

## Scope
- Domain prefix: m12
- Candidate tables: 70

## Candidate Tables (Top 15 by Approx Rows)
1. m_12_pos_item (approx_rows=1094)
2. m_12_pos_category_setting (approx_rows=26)
3. m_12_pos_setting (approx_rows=26)
4. m_12_pos_category (approx_rows=2)
5. m_12_pos_type (approx_rows=2)
6. m_12_ai (approx_rows=0)
7. m_12_ai_additional (approx_rows=0)
8. m_12_ai_detail (approx_rows=0)
9. m_12_area (approx_rows=0)
10. m_12_area_category (approx_rows=0)
11. m_12_area_category_history (approx_rows=0)
12. m_12_area_history (approx_rows=0)
13. m_12_bi (approx_rows=0)
14. m_12_bi_bonus (approx_rows=0)
15. m_12_bi_bonus_history (approx_rows=0)

## Recommended KPI Fields (Top 20 High/Medium)
1. m_12_ppv.ppvtotalap (priority=high, agg=sum,avg,min,max)
2. m_12_ppv.ppvtotalapvalas (priority=high, agg=sum,avg,min,max)
3. m_12_ppv.ppvtotalar (priority=high, agg=sum,avg,min,max)
4. m_12_ppv.ppvtotalarvalas (priority=high, agg=sum,avg,min,max)
5. m_12_ppv_detail.totaltransaksi (priority=high, agg=sum,avg,min,max)
6. m_12_ai.aicustomdbl1 (priority=medium, agg=avg)
7. m_12_ai.aicustomdbl2 (priority=medium, agg=avg)
8. m_12_ai.aicustomdbl3 (priority=medium, agg=avg)
9. m_12_ai.aicustomint1 (priority=medium, agg=sum,count,avg)
10. m_12_ai.aicustomint2 (priority=medium, agg=sum,count,avg)
11. m_12_ai.aicustomint3 (priority=medium, agg=sum,count,avg)
12. m_12_ai.aiid (priority=medium, agg=sum,count,avg)
13. m_12_ai.aiinputuser (priority=medium, agg=sum,count,avg)
14. m_12_ai.aiisclose (priority=medium, agg=sum,count,avg)
15. m_12_ai.aijmlrevisi (priority=medium, agg=sum,count,avg)
16. m_12_ai.aikodepa (priority=medium, agg=sum,count,avg)
17. m_12_ai.aikontak (priority=medium, agg=sum,count,avg)
18. m_12_ai.aimodifikasiuser (priority=medium, agg=sum,count,avg)
19. m_12_ai_additional.customdbl1 (priority=medium, agg=avg)
20. m_12_ai_additional.customdbl2 (priority=medium, agg=avg)

## Recommended Filters (Top 20)
1. m_12_ai.aistatus (group=status)
2. m_12_ai.aistatussebelumnya (group=status)
3. m_12_bi.bistatus (group=status)
4. m_12_bi.bistatussebelumnya (group=status)
5. m_12_bi_history.bistatus (group=status)
6. m_12_bi_history.bistatussebelumnya (group=status)
7. m_12_cpa.cpastatus (group=status)
8. m_12_cpa.cpastatussebelumnya (group=status)
9. m_12_cpa_history.cpastatus (group=status)
10. m_12_cpa_history.cpastatussebelumnya (group=status)
11. m_12_di.distatus (group=status)
12. m_12_di.distatussebelumnya (group=status)
13. m_12_di_history.distatus (group=status)
14. m_12_di_history.distatussebelumnya (group=status)
15. m_12_lp.lpstatus (group=status)
16. m_12_lp.lpstatussebelumnya (group=status)
17. m_12_lp_detail.statusberlaku (group=status)
18. m_12_lp_detail_history.statusberlaku (group=status)
19. m_12_lp_history.pastatus (group=status)
20. m_12_lp_history.pastatussebelumnya (group=status)

## Time-Series Ready Tables (Top 10)
1. m_12_pos_item (approx_rows=1094, date_cols=3, numeric_cols=18)
2. m_12_pos_category (approx_rows=2, date_cols=5, numeric_cols=8)
3. m_12_pos_type (approx_rows=2, date_cols=5, numeric_cols=8)
4. m_12_ai (approx_rows=0, date_cols=7, numeric_cols=13)
5. m_12_ai_additional (approx_rows=0, date_cols=3, numeric_cols=12)
6. m_12_ai_detail (approx_rows=0, date_cols=5, numeric_cols=12)
7. m_12_area (approx_rows=0, date_cols=5, numeric_cols=8)
8. m_12_area_category (approx_rows=0, date_cols=5, numeric_cols=8)
9. m_12_area_category_history (approx_rows=0, date_cols=5, numeric_cols=9)
10. m_12_area_history (approx_rows=0, date_cols=5, numeric_cols=9)

## Draft Visuals
1. KPI cards: 3-5 metrik dari bagian Recommended KPI Fields (priority=high).
2. Trend chart: 1-2 metrik time-series dari tabel largest ready.
3. Breakdown chart: group by filter status/classification/actor sesuai domain.
4. Table detail: top 50 records dengan sort by tanggal terbaru.

## API Draft (Suggested)
- GET /api/dashboard/m12/summary
- GET /api/dashboard/m12/trends?from=YYYY-MM-DD&to=YYYY-MM-DD
- GET /api/dashboard/m12/breakdown?group_by=<dimension>
- GET /api/dashboard/m12/table?page=1&page_size=50

## Implementation Notes
- Validasi ulang nama kolom tanggal utama per tabel sebelum implement query final.
- Prioritaskan indeks di kolom tanggal + kolom filter dominan untuk performa.
- Jika relasi lintas tabel tidak ada FK, dokumentasikan join key di service layer.
