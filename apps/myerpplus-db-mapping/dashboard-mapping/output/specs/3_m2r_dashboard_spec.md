# Dashboard Spec - Domain m2r

Generated at: 2026-02-25 03:14:54 UTC

## Scope
- Domain prefix: m2r
- Candidate tables: 96

## Candidate Tables (Top 15 by Approx Rows)
1. m2r_hppglobalsk (approx_rows=1077)
2. m2r_hppglobalsa (approx_rows=1063)
3. m2r_hppgudangsk_jml (approx_rows=594)
4. m2r_hppgudangsa_jml (approx_rows=586)
5. m2r_hppgudangsk (approx_rows=288)
6. m2r_hppgudangsa (approx_rows=285)
7. m2r_hppglobalms (approx_rows=86)
8. m2r_hppglobalkl (approx_rows=36)
9. m2r_mutasi_stok_custom (approx_rows=17)
10. m2r_stok_gagal_upload (approx_rows=6)
11. m2r_analisa_penyusutan (approx_rows=0)
12. m2r_anggaran (approx_rows=0)
13. m2r_ap_card (approx_rows=0)
14. m2r_ap_card_detail (approx_rows=0)
15. m2r_ap_voucher (approx_rows=0)

## Recommended KPI Fields (Top 20 High/Medium)
1. m2r_anggaran.nmsaldo (priority=high, agg=sum,avg,min,max)
2. m2r_ap_card.apissaldoakhir (priority=high, agg=sum,avg,min,max)
3. m2r_ap_card.apsaldoakhir (priority=high, agg=sum,avg,min,max)
4. m2r_ap_card.apsaldoawal (priority=high, agg=sum,avg,min,max)
5. m2r_ap_card_detail.apissaldoakhir (priority=high, agg=sum,avg,min,max)
6. m2r_ap_card_detail.apsaldoakhir (priority=high, agg=sum,avg,min,max)
7. m2r_ap_card_detail.apsaldoawal (priority=high, agg=sum,avg,min,max)
8. m2r_ap_voucher.apissaldoakhir (priority=high, agg=sum,avg,min,max)
9. m2r_ap_voucher.aptotal (priority=high, agg=sum,avg,min,max)
10. m2r_ap_voucher_aging.apissaldoakhir (priority=high, agg=sum,avg,min,max)
11. m2r_ap_voucher_aging.aptotal (priority=high, agg=sum,avg,min,max)
12. m2r_ap_voucher_aging_detail.apissaldoakhir (priority=high, agg=sum,avg,min,max)
13. m2r_ap_voucher_aging_detail.aptotal (priority=high, agg=sum,avg,min,max)
14. m2r_ap_voucher_detail.apissaldoakhir (priority=high, agg=sum,avg,min,max)
15. m2r_ap_voucher_detail.aptotal (priority=high, agg=sum,avg,min,max)
16. m2r_appostage_card.apissaldoakhir (priority=high, agg=sum,avg,min,max)
17. m2r_appostage_card.apsaldoakhir (priority=high, agg=sum,avg,min,max)
18. m2r_appostage_card.apsaldoawal (priority=high, agg=sum,avg,min,max)
19. m2r_appostage_voucher.apissaldoakhir (priority=high, agg=sum,avg,min,max)
20. m2r_appostage_voucher.aptotal (priority=high, agg=sum,avg,min,max)

## Recommended Filters (Top 20)
1. m2r_ap_card.apstatuslunas (group=status)
2. m2r_ap_card_detail.apstatuslunas (group=status)
3. m2r_ap_voucher.apstatuslunas (group=status)
4. m2r_ap_voucher_aging.apstatuslunas (group=status)
5. m2r_ap_voucher_aging_detail.apstatuslunas (group=status)
6. m2r_ap_voucher_detail.apstatuslunas (group=status)
7. m2r_appostage_card.apstatuslunas (group=status)
8. m2r_appostage_voucher.apstatuslunas (group=status)
9. m2r_ar_card.arstatuslunas (group=status)
10. m2r_ar_card_detail.arstatuslunas (group=status)
11. m2r_ar_voucher.arstatuslunas (group=status)
12. m2r_ar_voucher_aging.arstatuslunas (group=status)
13. m2r_ar_voucher_aging_detail.arstatuslunas (group=status)
14. m2r_ar_voucher_detail.arstatuslunas (group=status)
15. m2r_arpostage_card.arstatuslunas (group=status)
16. m2r_arpostage_voucher.arstatuslunas (group=status)
17. m2r_bp_card.bpstatuslunas (group=status)
18. m2r_general_ledger_detail.bpstatuslunas (group=status)
19. m2r_giro_voucher.glstatus (group=status)
20. m2r_giro_voucher.glstatussebelumnya (group=status)

## Time-Series Ready Tables (Top 10)
1. m2r_mutasi_stok_custom (approx_rows=17, date_cols=6, numeric_cols=10)
2. m2r_analisa_penyusutan (approx_rows=0, date_cols=6, numeric_cols=22)
3. m2r_anggaran (approx_rows=0, date_cols=5, numeric_cols=20)
4. m2r_ap_card (approx_rows=0, date_cols=9, numeric_cols=19)
5. m2r_ap_card_detail (approx_rows=0, date_cols=9, numeric_cols=19)
6. m2r_ap_voucher (approx_rows=0, date_cols=9, numeric_cols=18)
7. m2r_ap_voucher_aging (approx_rows=0, date_cols=9, numeric_cols=30)
8. m2r_ap_voucher_aging_detail (approx_rows=0, date_cols=9, numeric_cols=30)
9. m2r_ap_voucher_detail (approx_rows=0, date_cols=9, numeric_cols=18)
10. m2r_appostage_card (approx_rows=0, date_cols=9, numeric_cols=19)

## Draft Visuals
1. KPI cards: 3-5 metrik dari bagian Recommended KPI Fields (priority=high).
2. Trend chart: 1-2 metrik time-series dari tabel largest ready.
3. Breakdown chart: group by filter status/classification/actor sesuai domain.
4. Table detail: top 50 records dengan sort by tanggal terbaru.

## API Draft (Suggested)
- GET /api/dashboard/m2r/summary
- GET /api/dashboard/m2r/trends?from=YYYY-MM-DD&to=YYYY-MM-DD
- GET /api/dashboard/m2r/breakdown?group_by=<dimension>
- GET /api/dashboard/m2r/table?page=1&page_size=50

## Implementation Notes
- Validasi ulang nama kolom tanggal utama per tabel sebelum implement query final.
- Prioritaskan indeks di kolom tanggal + kolom filter dominan untuk performa.
- Jika relasi lintas tabel tidak ada FK, dokumentasikan join key di service layer.
