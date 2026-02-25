# Dashboard Spec - Domain m1

Generated at: 2026-02-25 04:54:34 UTC

## Scope
- Domain prefix: m1
- Candidate tables: 201

## Candidate Tables (Top 15 by Approx Rows)
1. m1_cogs_fifo_in (approx_rows=2622)
2. m1_item (approx_rows=2279)
3. m1_no_serial_transaction (approx_rows=825)
4. m1_item_transaction (approx_rows=730)
5. m1_no_batch_transaction (approx_rows=713)
6. m1_no_serial_in (approx_rows=613)
7. m1_no_serial_transaction_history (approx_rows=458)
8. m1_coa (approx_rows=409)
9. m1_coa_copy1 (approx_rows=246)
10. m1_cogs_fifo_out (approx_rows=208)
11. m1_item_transaction_history (approx_rows=207)
12. m1_item_stock_warehouse (approx_rows=194)
13. m1_no_batch_in (approx_rows=153)
14. m1_item_history (approx_rows=150)
15. m1_no_batch_out (approx_rows=120)

## Recommended KPI Fields (Top 20 High/Medium)
1. m1_coa.csaldoawal (priority=high, agg=sum,avg,min,max)
2. m1_coa.csaldoberjalan (priority=high, agg=sum,avg,min,max)
3. m1_coa_copy1.csaldoawal (priority=high, agg=sum,avg,min,max)
4. m1_coa_copy1.csaldoberjalan (priority=high, agg=sum,avg,min,max)
5. m1_coa_history.csaldoawal (priority=high, agg=sum,avg,min,max)
6. m1_coa_history.csaldoberjalan (priority=high, agg=sum,avg,min,max)
7. m1_contact.ktotalhutang (priority=high, agg=sum,avg,min,max)
8. m1_contact.ktotalpiutang (priority=high, agg=sum,avg,min,max)
9. m1_contact_copy.ktotalhutang (priority=high, agg=sum,avg,min,max)
10. m1_contact_copy.ktotalpiutang (priority=high, agg=sum,avg,min,max)
11. m1_contact_history.ktotalhutang (priority=high, agg=sum,avg,min,max)
12. m1_contact_history.ktotalpiutang (priority=high, agg=sum,avg,min,max)
13. m1_item_transaction.saldohpp (priority=high, agg=sum,avg,min,max)
14. m1_item_transaction.saldojml (priority=high, agg=sum,avg,min,max)
15. m1_item_transaction.saldonilai (priority=high, agg=sum,avg,min,max)
16. m1_item_transaction_history.saldohpp (priority=high, agg=sum,avg,min,max)
17. m1_item_transaction_history.saldojml (priority=high, agg=sum,avg,min,max)
18. m1_item_transaction_history.saldonilai (priority=high, agg=sum,avg,min,max)
19. m1_accident.ainputuser (priority=medium, agg=sum,count,avg)
20. m1_accident.amodifikasiuser (priority=medium, agg=sum,count,avg)

## Recommended Filters (Top 20)
1. m1_contact.kkategorisalesman (group=actor)
2. m1_contact.kkategorisalesmannama (group=actor)
3. m1_contact.kkategoricustomer (group=actor)
4. m1_contact.kkategoricustomernama (group=actor)
5. m1_contact.kkategorisupplier (group=actor)
6. m1_contact.kkategorisuppliernama (group=actor)
7. m1_contact.ksalesman (group=actor)
8. m1_contact.ksalesmannama (group=actor)
9. m1_contact.karea (group=location)
10. m1_contact.kareanama (group=location)
11. m1_contact_copy.kkategorisalesman (group=actor)
12. m1_contact_copy.kkategorisalesmannama (group=actor)
13. m1_contact_copy.kkategoricustomer (group=actor)
14. m1_contact_copy.kkategoricustomernama (group=actor)
15. m1_contact_copy.kkategorisupplier (group=actor)
16. m1_contact_copy.kkategorisuppliernama (group=actor)
17. m1_contact_copy.ksalesman (group=actor)
18. m1_contact_copy.ksalesmannama (group=actor)
19. m1_contact_copy.karea (group=location)
20. m1_contact_copy.kareanama (group=location)

## Time-Series Ready Tables (Top 10)
1. m1_cogs_fifo_in (approx_rows=2622, date_cols=1, numeric_cols=7)
2. m1_item (approx_rows=2279, date_cols=4, numeric_cols=44)
3. m1_no_serial_transaction (approx_rows=825, date_cols=3, numeric_cols=8)
4. m1_item_transaction (approx_rows=730, date_cols=13, numeric_cols=38)
5. m1_no_batch_transaction (approx_rows=713, date_cols=3, numeric_cols=8)
6. m1_no_serial_in (approx_rows=613, date_cols=4, numeric_cols=9)
7. m1_no_serial_transaction_history (approx_rows=458, date_cols=3, numeric_cols=10)
8. m1_coa (approx_rows=409, date_cols=12, numeric_cols=29)
9. m1_coa_copy1 (approx_rows=246, date_cols=12, numeric_cols=29)
10. m1_cogs_fifo_out (approx_rows=208, date_cols=1, numeric_cols=6)

## Draft Visuals
1. KPI cards: 3-5 metrik dari bagian Recommended KPI Fields (priority=high).
2. Trend chart: 1-2 metrik time-series dari tabel largest ready.
3. Breakdown chart: group by filter status/classification/actor sesuai domain.
4. Table detail: top 50 records dengan sort by tanggal terbaru.

## API Draft (Suggested)
- GET /api/dashboard/m1/summary
- GET /api/dashboard/m1/trends?from=YYYY-MM-DD&to=YYYY-MM-DD
- GET /api/dashboard/m1/breakdown?group_by=<dimension>
- GET /api/dashboard/m1/table?page=1&page_size=50

## Implementation Notes
- Validasi ulang nama kolom tanggal utama per tabel sebelum implement query final.
- Prioritaskan indeks di kolom tanggal + kolom filter dominan untuk performa.
- Jika relasi lintas tabel tidak ada FK, dokumentasikan join key di service layer.
