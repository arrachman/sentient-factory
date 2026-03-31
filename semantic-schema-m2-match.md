# Semantic Schema M2 Match Report

Sumber schema: `/home/rania/apps/sentient-factory/apps/myerpplus-db-mapping/db/m2 - finance/semantic-schema-m2.json`
Sumber query: `/home/rania/apps/sentient-factory/apps/myerpplus-db-mapping/db/m2 - finance/m2-queries.md`
Sumber report: `/home/rania/apps/sentient-factory/apps/myerpplus-db-mapping/db/m2 - finance/m0_report_rmoduleid_2.sql`

Total tabel di schema: **71**
Total tabel M2 terdeteksi dari query/report: **70**
Tabel query/report yang sudah ada di schema: **70**
Tabel query/report yang belum ada di schema: **0**
Tabel schema yang tidak muncul di dua sumber ini: **1**

## Kesimpulan

- Seluruh tabel M2 yang terdeteksi dari `m2-queries.md` dan `m0_report_rmoduleid_2.sql` sudah ada di `apps/myerpplus-db-mapping/db/m2 - finance/semantic-schema-m2.json`.
- Masih ada tabel schema yang tidak muncul di dua sumber tersebut; ini tidak otomatis salah, tetapi berarti schema lebih luas dari cakupan query/report yang dicek.

## Tabel Schema Yang Tidak Muncul Di Query/Report

- `m2_transaction_journal_voucher`

## Tabel Query/Report Yang Sudah Match Ke Schema

- `m2_accounting_period`
- `m2_aj`
- `m2_aj_detail`
- `m2_aj_detail_history`
- `m2_aj_history`
- `m2_bd`
- `m2_bd_detail`
- `m2_bd_detail_history`
- `m2_bd_history`
- `m2_cb`
- `m2_cb_detail`
- `m2_cb_detail_history`
- `m2_cb_history`
- `m2_cb_pay`
- `m2_cb_pay_history`
- `m2_cd`
- `m2_cd_detail`
- `m2_cd_detail_history`
- `m2_cd_history`
- `m2_cr`
- `m2_cr_detail`
- `m2_cr_detail_history`
- `m2_cr_history`
- `m2_files`
- `m2_giro_list`
- `m2_gj`
- `m2_gj_detail`
- `m2_gj_detail_history`
- `m2_gj_history`
- `m2_jm`
- `m2_jm_detail`
- `m2_jm_detail_history`
- `m2_jm_history`
- `m2_notes`
- `m2_realization`
- `m2_realization_branch`
- `m2_realization_cost_center`
- `m2_realization_division`
- `m2_realization_location`
- `m2_realization_project`
- `m2_realization_subdivision`
- `m2_rg`
- `m2_rg_detail`
- `m2_rg_detail_history`
- `m2_rg_history`
- `m2_rgc`
- `m2_rgc_detail`
- `m2_rgc_detail_history`
- `m2_rgc_history`
- `m2_rm`
- `m2_rm_detail`
- `m2_rm_detail_history`
- `m2_rm_history`
- `m2_rm_pay`
- `m2_rm_pay_history`
- `m2_sg`
- `m2_sg_detail`
- `m2_sg_detail_history`
- `m2_sg_history`
- `m2_sgc`
- `m2_sgc_detail`
- `m2_sgc_detail_history`
- `m2_sgc_history`
- `m2_sm`
- `m2_sm_detail`
- `m2_sm_detail_history`
- `m2_sm_history`
- `m2_sm_pay`
- `m2_sm_pay_history`
- `m2_transaction_journal`
