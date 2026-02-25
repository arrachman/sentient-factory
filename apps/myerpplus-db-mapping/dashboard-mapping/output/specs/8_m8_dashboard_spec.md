# Dashboard Spec - Domain m8

Generated at: 2026-02-25 04:54:35 UTC

## Scope
- Domain prefix: m8
- Candidate tables: 5

## Candidate Tables (Top 15 by Approx Rows)
1. m8_content_role (approx_rows=108)
2. m8_content (approx_rows=72)
3. m8_content_copy1 (approx_rows=42)
4. m8_indicator (approx_rows=22)
5. m8_content_chart (approx_rows=18)

## Recommended KPI Fields (Top 20 High/Medium)
1. m8_indicator.ivalue1 (priority=high, agg=sum,avg,min,max)
2. m8_indicator.ivalue2 (priority=high, agg=sum,avg,min,max)
3. m8_indicator.ivalue3 (priority=high, agg=sum,avg,min,max)
4. m8_content.caktif (priority=medium, agg=sum,count,avg)
5. m8_content.cinputuser (priority=medium, agg=sum,count,avg)
6. m8_content.cmodifikasiuser (priority=medium, agg=sum,count,avg)
7. m8_content.cmodule (priority=medium, agg=sum,count,avg)
8. m8_content.curutan (priority=medium, agg=sum,count,avg)
9. m8_content_copy1.caktif (priority=medium, agg=sum,count,avg)
10. m8_content_copy1.cinputuser (priority=medium, agg=sum,count,avg)
11. m8_content_copy1.cmodifikasiuser (priority=medium, agg=sum,count,avg)
12. m8_content_copy1.cmodule (priority=medium, agg=sum,count,avg)
13. m8_content_copy1.curutan (priority=medium, agg=sum,count,avg)
14. m8_content_role.rakses (priority=medium, agg=sum,count,avg)
15. m8_content_role.ruserid (priority=medium, agg=sum,count,avg)
16. m8_indicator.igreater (priority=medium, agg=sum,count,avg)
17. m8_indicator.iinputuser (priority=medium, agg=sum,count,avg)
18. m8_indicator.imodifikasiuser (priority=medium, agg=sum,count,avg)

## Recommended Filters (Top 20)

## Time-Series Ready Tables (Top 10)
1. m8_content (approx_rows=72, date_cols=2, numeric_cols=5)
2. m8_content_copy1 (approx_rows=42, date_cols=2, numeric_cols=5)
3. m8_indicator (approx_rows=22, date_cols=2, numeric_cols=6)

## Draft Visuals
1. KPI cards: 3-5 metrik dari bagian Recommended KPI Fields (priority=high).
2. Trend chart: 1-2 metrik time-series dari tabel largest ready.
3. Breakdown chart: group by filter status/classification/actor sesuai domain.
4. Table detail: top 50 records dengan sort by tanggal terbaru.

## API Draft (Suggested)
- GET /api/dashboard/m8/summary
- GET /api/dashboard/m8/trends?from=YYYY-MM-DD&to=YYYY-MM-DD
- GET /api/dashboard/m8/breakdown?group_by=<dimension>
- GET /api/dashboard/m8/table?page=1&page_size=50

## Implementation Notes
- Validasi ulang nama kolom tanggal utama per tabel sebelum implement query final.
- Prioritaskan indeks di kolom tanggal + kolom filter dominan untuk performa.
- Jika relasi lintas tabel tidak ada FK, dokumentasikan join key di service layer.
