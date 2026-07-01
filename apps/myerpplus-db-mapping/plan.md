# Plan Sinkronisasi M4-M7 ke semantic-query-schema-dashboard-obt.json

Tujuan dokumen ini adalah menyusun rencana sinkronisasi semantic summary domain `M4`, `M5`, `M6`, dan `M7` ke [db/semantic-query-schema-dashboard-obt.json](/opt/sentient-factory/apps/myerpplus-db-mapping/db/semantic-query-schema-dashboard-obt.json) agar `apps/ai-engine` membaca coverage dashboard dari OBT/dim kanonik, bukan dari tabel source mentah.

Catatan path aktual di repo:
- `M4`: [db/m4-purchasing/semantic-schema-m4-summary.md](/opt/sentient-factory/apps/myerpplus-db-mapping/db/m4-purchasing/semantic-schema-m4-summary.md)
- `M5`: [db/m5-sales/semantic-schema-m5-summary.md](/opt/sentient-factory/apps/myerpplus-db-mapping/db/m5-sales/semantic-schema-m5-summary.md)
- `M6`: [db/m6-manufacturing/semantic-schema-m6-summary.md](/opt/sentient-factory/apps/myerpplus-db-mapping/db/m6-manufacturing/semantic-schema-m6-summary.md)
- `M7`: [db/m7-procurement advanced/semantic-schema-m7-summary.md](/opt/sentient-factory/apps/myerpplus-db-mapping/db/m7-procurement%20advanced/semantic-schema-m7-summary.md)

## Prinsip Sinkronisasi

1. `semantic-query-schema-dashboard-obt.json` hanya boleh mengekspos `obt_*` dan `dim_*` yang benar-benar ada atau sengaja dimodelkan sebagai `source-empty`.
2. Summary `M4-M7` dipakai sebagai sumber istilah bisnis, lineage, join hints, dan family transaksi, bukan sebagai alasan untuk query raw `m4_*`, `m5_*`, `m6_*`, atau `m7_*`.
3. Jika summary memuat family yang belum punya output kanonik, langkahnya adalah:
   - buat atau daftarkan output `obt/dim`,
   - lalu sinkronkan ke schema dashboard,
   - lalu uji intent di `apps/ai-engine`.
4. Jika source family kosong, schema dashboard tetap harus tahu output kanoniknya dan menjelaskan status `source-empty`.
5. Target akhir bukan hanya semantic sync. Semua family schema `M4-M7` harus punya representasi fisik sebagai `obt_*` atau `dim_*`, baik berstatus `bootstrapped`, `source-empty`, `blocked`, atau `queued`.

## Deliverable

Hasil akhir yang ditargetkan:
- semua family schema `M4-M7` punya target `obt/dim` yang eksplisit
- `semantic-query-schema-dashboard-obt.json` mengenali family bisnis utama `M4-M7`.
- `table_groups`, `tables`, `join_hints`, `important_rules`, dan `query_patterns` konsisten dengan summary `M4-M7`.
- `apps/ai-engine` memilih tabel kanonik `obt_*`/`dim_*` untuk intent `M4-M7`.
- Untuk family yang belum berisi data, agent menjelaskan coverage `source-empty`, bukan fallback ke raw source table.

## Phase 0: Audit Awal Coverage

1. Bandingkan tiap summary `M4-M7` dengan:
   - `obt-agent-mapping.json`
   - `semantic-query-schema-dashboard-obt.json`
2. Buat matriks per family:
   - `family_name`
   - `summary_present`
   - `canonical_output_exists`
   - `dashboard_schema_registered`
   - `status = bootstrapped/source-empty/blocked/queued`
3. Kelompokkan gap menjadi:
   - gap semantic-only
   - gap output fisik
   - gap query-pattern/intent

Definition of done:
- ada daftar eksplisit family `M4-M7` yang sudah sinkron dan yang belum.

## Phase 0A: Kewajiban Coverage Fisik Semua Schema

Target fase ini:
- semua family yang muncul di summary `M4-M7` harus dipetakan ke output fisik `obt_*` atau `dim_*`
- tidak boleh ada family yang hanya dikenal di summary tetapi tidak punya representasi kanonik

Aturan implementasi:
1. Untuk family dengan data nyata:
   - buat output `obt/dim`
   - bootstrap ke PostgreSQL
   - catat di `obt-agent-mapping.json` sebagai `bootstrapped`
2. Untuk family dengan source kosong:
   - tetap buat output `obt/dim`
   - create table + loader aman
   - catat status `source-empty`
3. Untuk family yang secara desain belum bisa dimodelkan penuh:
   - buat placeholder canonical target
   - catat `blocked` atau `queued`
   - jangan biarkan family hilang dari artifact

Deliverable fase ini:
- matriks family `M4-M7 -> canonical obt/dim target`
- daftar output fisik yang sudah ada
- daftar output fisik yang masih harus dibuat

Definition of done:
- tidak ada family `M4-M7` yang hanya hidup di summary tanpa target `obt/dim`.

## Phase 1: Materialisasi dan Sinkronisasi M4 Purchasing

Sumber utama:
- `purchase_request_to_order_flow`
- `purchase_order_receipt_invoice_flow`
- `purchase_return_flow`
- `purchase_advance_payment_flow`
- `purchase_vendor_payment_flow`
- `purchase_comparison_flow`
- `purchase_invoice_exchange_flow`

Target semantic dashboard:
1. Pastikan `table_groups.purchasing` mencakup output aktif:
   - `obt_purchase_line_flow`
   - `obt_purchase_document_line_event`
   - `obt_purchase_payment`
2. Tambahkan `business_terms` untuk family utama:
   - `PR`, `RQ`, `BS`, `PO`, `GRN`, `RI`, `DNR`, `PRT`, `AP`, `VP`, `VPP`, `PIE`, `CS`
3. Tambahkan `join_hints` dashboard-level:
   - `purchase_request_to_order_flow`
   - `purchase_order_receipt_invoice_flow`
   - `purchase_return_flow`
   - `purchase_vendor_payment_flow`
4. Tambahkan `important_rules`:
   - untuk lineage purchasing, mulai dari detail-lineage lalu naik ke header
   - gunakan `obt_purchase_line_flow` untuk flow item/qty/amount
   - gunakan `obt_purchase_payment` untuk AP, VP, VPP, dan payment-side analysis
5. Tambahkan `query_patterns`:
   - `purchase_funnel_dashboard`
   - `purchase_receipt_invoice_dashboard`
   - `purchase_return_dashboard`
   - `purchase_vendor_payment_dashboard`

Gap yang harus dibereskan bila belum ada output:
- `CS`, `PIE`, `FILES`, `NOTES`, `PF`, `PP`, dan family request/comparison yang belum punya `obt/dim` khusus

Definition of done:
- semua family penting `M4` punya target `obt/dim`
- intent purchasing tidak lagi fallback ke raw `m4_*`.

## Phase 2: Materialisasi dan Sinkronisasi M5 Sales

Sumber utama:
- `sales_document_flow`
- `sales_document_cross_refs`
- `sales_receivable_collection`
- `sales_receivable_polymorphic_targets`
- `sales_invoice_exchange`
- `sales_advance_and_payment`
- `sales_shipping_receivable`
- `sales_point_adjustment`

Target semantic dashboard:
1. Pastikan `table_groups.sales` mencakup output aktif:
   - `obt_sales_order_line_flow`
   - `obt_sales_line_flow`
   - `obt_sales_receivable`
2. Tambahkan `business_terms` untuk family:
   - `SQ`, `SO`, `PI`, `PL`, `DO`, `DR`, `SI`, `RNR`, `SR`, `AS`, `IP`, `IC`, `PV`, `RP`, `SIE`, `SPA`, `CL`, `SF`
3. Tambahkan `join_hints` dashboard-level:
   - `sales_document_flow`
   - `sales_receivable_collection`
   - `sales_invoice_exchange`
   - `sales_shipping_receivable`
4. Tambahkan `important_rules`:
   - flow dokumen sales dimulai dari detail-lineage
   - use `obt_sales_order_line_flow` untuk SO-centered questions
   - use `obt_sales_line_flow` untuk invoice-centered line flow
   - use `obt_sales_receivable` untuk invoice, collection, voucher, dan outstanding analysis
5. Tambahkan `query_patterns`:
   - `sales_document_lineage_dashboard`
   - `sales_collection_dashboard`
   - `sales_return_dashboard`
   - `sales_advance_payment_dashboard`
   - `sales_shipping_receivable_dashboard`

Gap yang harus dibereskan bila belum ada output:
- `SIE`, `SPA`, `FILES`, `NOTES`, `CL`, `SF`, dan family payment/support lain yang belum punya `obt/dim` eksplisit

Definition of done:
- semua family penting `M5` punya target `obt/dim`
- intent sales lanjutan menggunakan output kanonik `M5`, bukan tabel source.

## Phase 3: Materialisasi dan Sinkronisasi M6 Manufacturing

Sumber utama:
- `bom_structure_flow`
- `mrs_to_mrn_flow`
- `mrs_to_pd_flow`
- `bom_pdr_wo_reference_flow`
- `workorder_material_output_flow`

Target semantic dashboard:
1. Tentukan output kanonik minimum untuk `M6`:
   - `obt_manufacturing_execution`
   - `obt_bom_route_snapshot`
   - dim/file/note manufacturing bila dibutuhkan
2. Tambahkan `business_terms`:
   - `BOM`, `MRS`, `MRN`, `PD`, `PDR`, `WO`
3. Tambahkan `join_hints`:
   - `bom_structure_flow`
   - `mrs_to_mrn_flow`
   - `mrs_to_pd_flow`
   - `bom_pdr_wo_reference_flow`
   - `workorder_material_output_flow`
4. Tambahkan `important_rules`:
   - manufacturing tracing dimulai dari material/output lines
   - bedakan BOM reference dari actual execution flow
   - jika output kanonik belum hidup, agent harus menyebut `queued` atau `source-empty`
5. Tambahkan `query_patterns`:
   - `manufacturing_execution_dashboard`
   - `bom_structure_dashboard`
   - `workorder_material_output_dashboard`
   - `production_realization_dashboard`

Prasyarat:
- cek apakah output fisik `M6` sudah ada; bila belum, plan ini harus memicu wave materialisasi dulu sebelum semantic sync dianggap valid.

Definition of done:
- semua family penting `M6` punya target `obt/dim`
- schema dashboard sudah mengenali intent manufacturing dan memilih output kanonik `M6`.

## Phase 4: Materialisasi dan Sinkronisasi M7 Asset / Procurement Advanced

Sumber utama:
- `asset_category_tax_flow`
- `asset_request_to_quotation_flow`
- `asset_quotation_to_order_flow`
- `asset_order_to_entry_flow`
- `asset_lifecycle_finance_flow`

Target semantic dashboard:
1. Tentukan output kanonik minimum untuk `M7`:
   - `obt_asset_lifecycle`
   - `obt_asset_depreciation_event`
   - `obt_asset_mutation`
   - dim master asset/support bila dibutuhkan
2. Tambahkan `business_terms`:
   - `ASSET`, `AR`, `AQ`, `AO`, `AE`, `AT`, `AG`, `DA`, `AB`
3. Tambahkan `join_hints`:
   - `asset_request_to_quotation_flow`
   - `asset_quotation_to_order_flow`
   - `asset_order_to_entry_flow`
   - `asset_lifecycle_finance_flow`
   - `asset_category_tax_flow`
4. Tambahkan `important_rules`:
   - procurement-origin asset flow dimulai dari detail `AR -> AQ -> AO -> AE`
   - lifecycle after activation dimulai dari `m7_asset` semantic intent ke output asset lifecycle
   - depreciation memakai canonical depreciation output, bukan raw `m7_da*`
5. Tambahkan `query_patterns`:
   - `asset_procurement_dashboard`
   - `asset_lifecycle_dashboard`
   - `asset_transfer_disposal_dashboard`
   - `asset_depreciation_dashboard`

Prasyarat:
- cek output fisik `M7`; jika belum ada, semantic sync harus menandai status `queued`/`blocked`, bukan memaksa query mentah.

Definition of done:
- semua family penting `M7` punya target `obt/dim`
- schema dashboard dapat mengenali asset procurement dan lifecycle questions tanpa raw-table fallback.

## Phase 5: Perluasan Struktur semantic-query-schema-dashboard-obt.json

Untuk setiap domain `M4-M7`, update area berikut:
1. `business_terms`
2. `table_groups`
3. `tables`
4. `join_hints`
5. `important_rules`
6. `query_patterns`
7. `caution_areas` bila ada family yang rawan atau masih belum berisi

Rule umum:
- jangan tambahkan tabel source mentah ke `tables`
- hanya tambahkan `obt_*` dan `dim_*`
- family yang belum ada output fisik harus masuk plan materialisasi dulu

Definition of done:
- semua domain `M4-M7` terlihat sebagai first-class dashboard domains, bukan domain yang “dianggap ada” tapi tidak queryable.

## Phase 6: Validasi dengan AI Engine

Untuk tiap domain, jalankan minimal 2 intent:

M4:
- dashboard lifecycle PO sampai RI
- dashboard vendor payment purchasing

M5:
- dashboard document flow SO sampai SI
- dashboard collection dan payment voucher

M6:
- dashboard work order material/output
- dashboard BOM dan production realization

M7:
- dashboard procurement asset
- dashboard depresiasi dan lifecycle asset

Kriteria validasi:
1. generator memilih `obt_*` / `dim_*` kanonik
2. tidak muncul raw `m4_*`, `m5_*`, `m6_*`, `m7_*` di query
3. jika source/output kosong, jawaban menjelaskan coverage `source-empty`

Definition of done:
- test intent per domain lolos secara semantic selection.

## Phase 7: Review dan Hardening

1. Review field names yang rawan mismatch tipe atau nama kolom.
2. Tambahkan cast/join guardrail bila output memakai `text` sementara dim memakai `bigint`.
3. Rapikan wording `important_rules` agar model tidak invent join.
4. Sinkronkan `obt-agent-mapping.json` bila ada output baru selama wave `M4-M7`.

Definition of done:
- semantic schema stabil untuk dashboard generation lintas `M4-M7`.

## Urutan Implementasi yang Disarankan

1. `M4`
2. `M5`
3. `M6`
4. `M7`
5. validasi `apps/ai-engine`

Alasannya:
- `M4` dan `M5` sudah punya output aktif paling banyak, jadi semantic sync bisa segera tervalidasi.
- `M6` dan `M7` kemungkinan masih butuh wave output fisik lebih lanjut.

## Definition of Done Global

Sinkronisasi dianggap selesai jika:
- semua family yang tercantum di summary `M4-M7` sudah punya target fisik `obt_*` atau `dim_*`,
- semua family penting di summary `M4-M7` punya representasi semantic di dashboard schema,
- representasinya menunjuk ke `obt_*`/`dim_*` yang benar,
- family tanpa data tetap tercatat sebagai `source-empty`,
- family yang belum bisa dihidupkan tetap tercatat sebagai `blocked` atau `queued`, bukan hilang dari artifact,
- `apps/ai-engine` memilih output kanonik itu saat diuji dengan intent dashboard nyata.
