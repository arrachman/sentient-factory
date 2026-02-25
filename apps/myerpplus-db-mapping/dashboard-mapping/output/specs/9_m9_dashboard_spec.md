# Dashboard Spec - Domain m9

Generated at: 2026-02-25 04:54:35 UTC

## Scope
- Domain prefix: m9
- Candidate tables: 6

## Candidate Tables (Top 15 by Approx Rows)
1. m9_coa (approx_rows=0)
2. m9_coa_konsolidasi (approx_rows=0)
3. m9_jenis_eliminasi (approx_rows=0)
4. m9_konsolidasi_barang (approx_rows=0)
5. m9_konsolidasi_history (approx_rows=0)
6. m9_setting_db (approx_rows=0)

## Recommended KPI Fields (Top 20 High/Medium)
1. m9_coa.csaldoakhir (priority=high, agg=sum,avg,min,max)
2. m9_coa.csaldoawal (priority=high, agg=sum,avg,min,max)
3. m9_coa.csaldoberjalan (priority=high, agg=sum,avg,min,max)
4. m9_coa.csaldotglx (priority=high, agg=sum,avg,min,max)
5. m9_coa_konsolidasi.csaldoakhir (priority=high, agg=sum,avg,min,max)
6. m9_coa_konsolidasi.csaldoakhireliminasi (priority=high, agg=sum,avg,min,max)
7. m9_coa_konsolidasi.csaldoawal (priority=high, agg=sum,avg,min,max)
8. m9_coa_konsolidasi.csaldoberjalan (priority=high, agg=sum,avg,min,max)
9. m9_coa.cbulan (priority=medium, agg=sum,count,avg)
10. m9_coa.cinputuser (priority=medium, agg=sum,count,avg)
11. m9_coa.cjmlly (priority=medium, agg=avg)
12. m9_coa.cjmlrml (priority=medium, agg=avg)
13. m9_coa.cjmlybl (priority=medium, agg=avg)
14. m9_coa.cjmlytd (priority=medium, agg=avg)
15. m9_coa.ckategori (priority=medium, agg=sum,count,avg)
16. m9_coa.clevel (priority=medium, agg=sum,count,avg)
17. m9_coa.cmodifikasiuser (priority=medium, agg=sum,count,avg)
18. m9_coa.ctahun (priority=medium, agg=sum,count,avg)
19. m9_coa.ctipe (priority=medium, agg=sum,count,avg)
20. m9_coa.curutan (priority=medium, agg=sum,count,avg)

## Recommended Filters (Top 20)
1. m9_coa.ccustomer (group=actor)
2. m9_coa.csupplier (group=actor)
3. m9_coa.csalesman (group=actor)
4. m9_setting_db.dbstatus (group=status)

## Time-Series Ready Tables (Top 10)
1. m9_coa (approx_rows=0, date_cols=2, numeric_cols=16)
2. m9_konsolidasi_barang (approx_rows=0, date_cols=1, numeric_cols=4)

## Draft Visuals
1. KPI cards: 3-5 metrik dari bagian Recommended KPI Fields (priority=high).
2. Trend chart: 1-2 metrik time-series dari tabel largest ready.
3. Breakdown chart: group by filter status/classification/actor sesuai domain.
4. Table detail: top 50 records dengan sort by tanggal terbaru.

## API Draft (Suggested)
- GET /api/dashboard/m9/summary
- GET /api/dashboard/m9/trends?from=YYYY-MM-DD&to=YYYY-MM-DD
- GET /api/dashboard/m9/breakdown?group_by=<dimension>
- GET /api/dashboard/m9/table?page=1&page_size=50

## Implementation Notes
- Validasi ulang nama kolom tanggal utama per tabel sebelum implement query final.
- Prioritaskan indeks di kolom tanggal + kolom filter dominan untuk performa.
- Jika relasi lintas tabel tidak ada FK, dokumentasikan join key di service layer.
