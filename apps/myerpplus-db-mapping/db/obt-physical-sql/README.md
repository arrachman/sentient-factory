# Physical OBT SQL Skeletons

Folder ini berisi dua jalur implementasi physical OBT yang diturunkan dari semantic artifacts MyERPPlus:

- view-first candidates untuk referensi semantic lineage
- PostgreSQL table-first artifacts untuk bootstrap tabel OBT dan load ETL

Tujuannya:

- memberi starting point implementasi
- menjaga anchor table tetap konsisten dengan semantic summary
- menghindari join lintas modul yang belum cukup stabil

Status file di folder ini:

- mayoritas masih draft
- tiga file sudah dinaikkan menjadi finalized view candidates
- finalized candidates sekarang disesuaikan agar strict terhadap semantic schema JSON
- static semantic validation saat ini lulus untuk semua tabel dan kolom dasar yang direferensikan oleh tiga `vw_obt_*`
- tiga tabel OBT PostgreSQL sudah berhasil dibuat di instance lokal `127.0.0.1:3208`
- source tables MyERPPlus belum tersedia di PostgreSQL tersebut, jadi tahap create tabel berhasil tetapi tahap insert belum dijalankan
- mungkin perlu penyesuaian kecil per environment

File utama:

- `vw_obt_purchase_line_flow.sql`
- `vw_obt_sales_line_flow.sql`
- `vw_obt_pos_to_sales.sql`
- `draft_vw_obt_purchase_line_flow.sql`
- `draft_vw_obt_sales_line_flow.sql`
- `draft_vw_obt_pos_to_sales.sql`
- `pgsql-tables/pg_create_table_obt_purchase_line_flow.sql`
- `pgsql-tables/pg_create_table_obt_sales_line_flow.sql`
- `pgsql-tables/pg_create_table_obt_pos_to_sales.sql`
- `pgsql-tables/pg_insert_obt_purchase_line_flow.sql`
- `pgsql-tables/pg_insert_obt_sales_line_flow.sql`
- `pgsql-tables/pg_insert_obt_pos_to_sales.sql`

Finalized candidates:

- `vw_obt_purchase_line_flow.sql`
  - already converted into `CREATE OR REPLACE VIEW`
  - downstream `GRN`, `RI`, `DNR`, and `PRT` rows are aggregated per `idpodetail` to preserve one-row-per-po-line grain
- `vw_obt_sales_line_flow.sql`
  - already converted into `CREATE OR REPLACE VIEW`
  - downstream `RNR` and `SR` rows are aggregated per `idsidetail` to preserve one-row-per-invoice-line grain
- `vw_obt_pos_to_sales.sql`
  - already converted into `CREATE OR REPLACE VIEW`
  - keeps one-row-per-voucher-usage grain using the stable path `m_12_pos_voucher_out.voidtransaction -> m5_si.siid`

Aturan interpretasi:

- treat `draft_*` as skeleton query
- treat `vw_obt_purchase_line_flow.sql`, `vw_obt_sales_line_flow.sql`, and `vw_obt_pos_to_sales.sql` as finalized candidates, but still validate them against the live database before production use
- beberapa enrichment seperti `status_name` atau `input_user_*` sengaja dibuat `NULL` jika semantic schema belum menerbitkan kolom fisiknya
- validate status columns, branch or location columns, and any optional upstream joins in your environment
- preserve the same semantic grain when converting a skeleton into a real table or view

PostgreSQL table-first artifacts:

- `pgsql-tables/pg_create_table_*.sql` membuat struktur tabel OBT kosong beserta index dasar
- `pgsql-tables/pg_insert_*.sql` menyiapkan `INSERT ... SELECT` untuk bootstrap load setelah source tables tersedia di PostgreSQL
- `scripts/render-pg-obt-tables.py` merender artifacts PostgreSQL dari finalized view candidates
- `scripts/run-pg-obt-table-sql.py` mengeksekusi artifacts PostgreSQL langsung ke instance target tanpa bergantung pada `psql`
