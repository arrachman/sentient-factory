# Dashboard Spec - Domain m11

Generated at: 2026-02-25 04:54:35 UTC

## Scope
- Domain prefix: m11
- Candidate tables: 30

## Candidate Tables (Top 15 by Approx Rows)
1. m_11_ak (approx_rows=0)
2. m_11_ak_detail (approx_rows=0)
3. m_11_ilo (approx_rows=0)
4. m_11_isk (approx_rows=0)
5. m_11_kj (approx_rows=0)
6. m_11_kj_history (approx_rows=0)
7. m_11_km (approx_rows=0)
8. m_11_km_history (approx_rows=0)
9. m_11_kw (approx_rows=0)
10. m_11_kw_detail (approx_rows=0)
11. m_11_kw_pay (approx_rows=0)
12. m_11_lb (approx_rows=0)
13. m_11_lb_detail (approx_rows=0)
14. m_11_lb_hasil (approx_rows=0)
15. m_11_lu (approx_rows=0)

## Recommended KPI Fields (Top 20 High/Medium)
1. m_11_ak.aktotalobat (priority=high, agg=sum,avg,min,max)
2. m_11_ak.aktotaltransaksi (priority=high, agg=sum,avg,min,max)
3. m_11_ak_detail.jmltotal (priority=high, agg=sum,avg,min,max)
4. m_11_km.kmtotaltransaksi (priority=high, agg=sum,avg,min,max)
5. m_11_km_history.kmtotaltransaksi (priority=high, agg=sum,avg,min,max)
6. m_11_kw.kwtotalap (priority=high, agg=sum,avg,min,max)
7. m_11_kw.kwtotalapvalas (priority=high, agg=sum,avg,min,max)
8. m_11_kw.kwtotalar (priority=high, agg=sum,avg,min,max)
9. m_11_kw.kwtotalarvalas (priority=high, agg=sum,avg,min,max)
10. m_11_kw_detail.totaltransaksi (priority=high, agg=sum,avg,min,max)
11. m_11_lb.lbtotaltransaksi (priority=high, agg=sum,avg,min,max)
12. m_11_lb_detail.jmltotal (priority=high, agg=sum,avg,min,max)
13. m_11_lu.lutotaltransaksi (priority=high, agg=sum,avg,min,max)
14. m_11_lu_detail.jmltotal (priority=high, agg=sum,avg,min,max)
15. m_11_lu_detail_history.jmltotal (priority=high, agg=sum,avg,min,max)
16. m_11_lu_history.lutotaltransaksi (priority=high, agg=sum,avg,min,max)
17. m_11_pb.pvtotalap (priority=high, agg=sum,avg,min,max)
18. m_11_pb.pvtotalapvalas (priority=high, agg=sum,avg,min,max)
19. m_11_pb.pvtotalar (priority=high, agg=sum,avg,min,max)
20. m_11_pb.pvtotalarvalas (priority=high, agg=sum,avg,min,max)

## Recommended Filters (Top 20)
1. m_11_ak.akcustomer (group=actor)
2. m_11_ak.akcustomerkontak (group=actor)
3. m_11_ak.akstatusrealisasi (group=status)
4. m_11_ak.akstatus (group=status)
5. m_11_ak.akstatussebelumnya (group=status)
6. m_11_ak_detail.statusrealisasi (group=status)
7. m_11_ilo.ilostatusrealisasi (group=status)
8. m_11_ilo.ilostatus (group=status)
9. m_11_ilo.ilostatussebelumnya (group=status)
10. m_11_isk.iskstatusrealisasi (group=status)
11. m_11_isk.iskstatus (group=status)
12. m_11_isk.iskstatussebelumnya (group=status)
13. m_11_kj.kjstatusperkawinan (group=status)
14. m_11_kj.kjstatusrealisasi (group=status)
15. m_11_kj.kjstatus (group=status)
16. m_11_kj.kjstatussebelumnya (group=status)
17. m_11_kj.kjstatuskamar (group=status)
18. m_11_kj.kjstatuspasien (group=status)
19. m_11_kj_history.kjstatusperkawinan (group=status)
20. m_11_kj_history.kjstatusrealisasi (group=status)

## Time-Series Ready Tables (Top 10)
1. m_11_ak (approx_rows=0, date_cols=26, numeric_cols=55)
2. m_11_ak_detail (approx_rows=0, date_cols=20, numeric_cols=37)
3. m_11_ilo (approx_rows=0, date_cols=3, numeric_cols=8)
4. m_11_isk (approx_rows=0, date_cols=3, numeric_cols=9)
5. m_11_kj (approx_rows=0, date_cols=26, numeric_cols=50)
6. m_11_kj_history (approx_rows=0, date_cols=26, numeric_cols=47)
7. m_11_km (approx_rows=0, date_cols=27, numeric_cols=51)
8. m_11_km_history (approx_rows=0, date_cols=27, numeric_cols=52)
9. m_11_kw (approx_rows=0, date_cols=10, numeric_cols=27)
10. m_11_kw_detail (approx_rows=0, date_cols=3, numeric_cols=19)

## Draft Visuals
1. KPI cards: 3-5 metrik dari bagian Recommended KPI Fields (priority=high).
2. Trend chart: 1-2 metrik time-series dari tabel largest ready.
3. Breakdown chart: group by filter status/classification/actor sesuai domain.
4. Table detail: top 50 records dengan sort by tanggal terbaru.

## API Draft (Suggested)
- GET /api/dashboard/m11/summary
- GET /api/dashboard/m11/trends?from=YYYY-MM-DD&to=YYYY-MM-DD
- GET /api/dashboard/m11/breakdown?group_by=<dimension>
- GET /api/dashboard/m11/table?page=1&page_size=50

## Implementation Notes
- Validasi ulang nama kolom tanggal utama per tabel sebelum implement query final.
- Prioritaskan indeks di kolom tanggal + kolom filter dominan untuk performa.
- Jika relasi lintas tabel tidak ada FK, dokumentasikan join key di service layer.
