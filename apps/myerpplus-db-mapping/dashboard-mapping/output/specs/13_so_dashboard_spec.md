# Dashboard Spec - Domain so

Generated at: 2026-02-25 05:00:00 UTC

## Scope
- Domain key: so
- Candidate tables: 7
- Included tables: 0_so, 0_so_1, 0_so_update, m5_so, m5_so_detail, m5_so_history, m5_so_detail_history

## Candidate Tables (Top by Approx Rows)
1. 0_so_1 (approx_rows=415)
2. 0_so_update (approx_rows=415)
3. m5_so_detail (approx_rows=94)
4. 0_so (approx_rows=93)
5. m5_so_detail_history (approx_rows=63)
6. m5_so (approx_rows=54)
7. m5_so_history (approx_rows=45)

## Recommended KPI Fields (SO)
1. m5_so.sototaltransaksi (grand total header; recommended amount utama)
2. m5_so.sototal (subtotal header)
3. m5_so.sojmldiskon (diskon header)
4. m5_so.sototalpajak1detail + m5_so.sototalpajak2detail (pajak header)
5. m5_so.sojmlbayar (nilai bayar)
6. m5_so_detail.jml (qty line; recommended qty utama)
7. m5_so_detail.jmlrealisasi (qty realisasi line)
8. m5_so_detail.jmldiskon (diskon line, untuk analisa item)
9. 0_so.jml (legacy qty)
10. 0_so.harga (legacy amount/price reference)

## Recommended Filters (SO)
1. 0_so.kodecustomer
2. 0_so.namacustomer
3. 0_so.kodesalesman
4. 0_so.status
5. m5_so.sostatus
6. m5_so.sostatusrealisasi
7. m5_so_detail.statusrealisasi

## Time-Series Ready Tables
1. m5_so (ready, date_cols=11, numeric_cols=22)
2. m5_so_detail (ready, date_cols=3, numeric_cols=24)
3. m5_so_history (ready, date_cols=11, numeric_cols=23)
4. m5_so_detail_history (ready, date_cols=3, numeric_cols=26)
5. 0_so (ready, date_cols=2, numeric_cols=7)
6. 0_so_1 (ready, date_cols=2, numeric_cols=7)

## Draft Visuals
1. KPI cards: Total SO, Grand Total (`sototaltransaksi`), Total Qty, Total Discount, Total Tax.
2. Trend chart: daily SO grand total + SO count (base date: `m5_so.sotgl`).
3. Breakdown chart: status SO (with label), customer, salesman/bagian penjualan.
4. Table detail: latest SO with status and amount.

## API Draft (Suggested)
- GET /api/dashboard/so/summary
- GET /api/dashboard/so/trends?from=YYYY-MM-DD&to=YYYY-MM-DD
- GET /api/dashboard/so/breakdown?group_by=<dimension>
- GET /api/dashboard/so/table?page=1&page_size=50

## Implementation Notes
- Gunakan m5_so.sotgl sebagai tanggal utama.
- Join utama: m5_so.soid = m5_so_detail.idso.
- Gunakan metrik finansial dari header `m5_so` agar tidak double-count saat join ke detail.
- Jika perlu analisa item, agregasikan `m5_so_detail` per `idso` dulu sebelum join.
- Mapping label `sostatus`/`sostatusrealisasi` masih asumsi awal, wajib validasi user bisnis.
- Untuk legacy, 0_so/0_so_1 dipakai sebagai pembanding/validasi.
