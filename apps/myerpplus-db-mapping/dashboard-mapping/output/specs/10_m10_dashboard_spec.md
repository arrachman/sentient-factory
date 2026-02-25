# Dashboard Spec - Domain m10

Generated at: 2026-02-25 04:54:35 UTC

## Scope
- Domain prefix: m10
- Candidate tables: 62

## Candidate Tables (Top 15 by Approx Rows)
1. m_10_ab (approx_rows=0)
2. m_10_ad (approx_rows=0)
3. m_10_ad_detail (approx_rows=0)
4. m_10_al (approx_rows=0)
5. m_10_al_detail (approx_rows=0)
6. m_10_at (approx_rows=0)
7. m_10_at_detail (approx_rows=0)
8. m_10_attendance_status (approx_rows=0)
9. m_10_benefit _and_deduction (approx_rows=0)
10. m_10_benefits_setting (approx_rows=0)
11. m_10_cn (approx_rows=0)
12. m_10_crn (approx_rows=0)
13. m_10_crn_detail (approx_rows=0)
14. m_10_department (approx_rows=0)
15. m_10_ea (approx_rows=0)

## Recommended KPI Fields (Top 20 High/Medium)
1. m_10_ad.adtotalpotongan (priority=high, agg=sum,avg,min,max)
2. m_10_ed_detail.saldoakhir (priority=high, agg=sum,avg,min,max)
3. m_10_ed_detail.saldoawal (priority=high, agg=sum,avg,min,max)
4. m_10_erl.erltotalreward (priority=high, agg=sum,avg,min,max)
5. m_10_ord.ordtotalreward (priority=high, agg=sum,avg,min,max)
6. m_10_pc.pctotalrealisasi (priority=high, agg=sum,avg,min,max)
7. m_10_pc_detail.total (priority=high, agg=sum,avg,min,max)
8. m_10_pp.pptotaldc (priority=high, agg=sum,avg,min,max)
9. m_10_pp.pptotaldcvalas (priority=high, agg=sum,avg,min,max)
10. m_10_pp.pptotaltj (priority=high, agg=sum,avg,min,max)
11. m_10_pp.pptotaltjvalas (priority=high, agg=sum,avg,min,max)
12. m_10_pp_detail.totaltransaksi (priority=high, agg=sum,avg,min,max)
13. m_10_ab.abid (priority=medium, agg=sum,count,avg)
14. m_10_ab.abinputuser (priority=medium, agg=sum,count,avg)
15. m_10_ab.abkaryawan (priority=medium, agg=sum,count,avg)
16. m_10_ab.abmodifikasiuser (priority=medium, agg=sum,count,avg)
17. m_10_ad.adid (priority=medium, agg=sum,count,avg)
18. m_10_ad.adinputuser (priority=medium, agg=sum,count,avg)
19. m_10_ad.adkaryawan (priority=medium, agg=sum,count,avg)
20. m_10_ad.adkurs (priority=medium, agg=sum,count,avg)

## Recommended Filters (Top 20)
1. m_10_ab.abstatus (group=status)
2. m_10_ad.adstatus (group=status)
3. m_10_ad.adstatuspencairan (group=status)
4. m_10_ad_detail.statuskehadiran (group=status)
5. m_10_al.alstatus (group=status)
6. m_10_at.atstatus (group=status)
7. m_10_cn.cnstatusperkawinan (group=status)
8. m_10_crn.crnstatus (group=status)
9. m_10_ea.eastatus (group=status)
10. m_10_ed.edstatus (group=status)
11. m_10_ed.edstatuspotong (group=status)
12. m_10_em.emstatus (group=status)
13. m_10_em.emstatusptm (group=status)
14. m_10_employee.kdepartment (group=organization)
15. m_10_employee.kstatusperkawinan (group=status)
16. m_10_emr.emrstatus (group=status)
17. m_10_emr.emrstatusem (group=status)
18. m_10_emr.emrstatusrem (group=status)
19. m_10_ep.epstatus (group=status)
20. m_10_er.erstatus (group=status)

## Time-Series Ready Tables (Top 10)
1. m_10_ab (approx_rows=0, date_cols=3, numeric_cols=4)
2. m_10_ad (approx_rows=0, date_cols=5, numeric_cols=6)
3. m_10_ad_detail (approx_rows=0, date_cols=1, numeric_cols=4)
4. m_10_al (approx_rows=0, date_cols=3, numeric_cols=4)
5. m_10_at (approx_rows=0, date_cols=3, numeric_cols=4)
6. m_10_at_detail (approx_rows=0, date_cols=2, numeric_cols=4)
7. m_10_attendance_status (approx_rows=0, date_cols=2, numeric_cols=3)
8. m_10_benefit _and_deduction (approx_rows=0, date_cols=2, numeric_cols=2)
9. m_10_cn (approx_rows=0, date_cols=3, numeric_cols=3)
10. m_10_crn (approx_rows=0, date_cols=2, numeric_cols=4)

## Draft Visuals
1. KPI cards: 3-5 metrik dari bagian Recommended KPI Fields (priority=high).
2. Trend chart: 1-2 metrik time-series dari tabel largest ready.
3. Breakdown chart: group by filter status/classification/actor sesuai domain.
4. Table detail: top 50 records dengan sort by tanggal terbaru.

## API Draft (Suggested)
- GET /api/dashboard/m10/summary
- GET /api/dashboard/m10/trends?from=YYYY-MM-DD&to=YYYY-MM-DD
- GET /api/dashboard/m10/breakdown?group_by=<dimension>
- GET /api/dashboard/m10/table?page=1&page_size=50

## Implementation Notes
- Validasi ulang nama kolom tanggal utama per tabel sebelum implement query final.
- Prioritaskan indeks di kolom tanggal + kolom filter dominan untuk performa.
- Jika relasi lintas tabel tidak ada FK, dokumentasikan join key di service layer.
