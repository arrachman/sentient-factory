# Dashboard Mapping - MyERPPlus

Folder ini berisi mapping kandidat dashboard dari struktur dan data pada schema `myerpplus`.

## Tujuan

- Mengidentifikasi tabel kandidat untuk visualisasi dashboard.
- Menemukan kandidat KPI (kolom numerik yang bisa di-aggregate).
- Menemukan kolom filter/dimensi (status, kategori, tipe, dll).
- Menilai kesiapan time-series (kolom tanggal + metrik numerik).
- Menemukan tabel hub untuk join antar modul.

## Struktur Folder

- `queries/` - Query SQL untuk membangun metadata dashboard mapping.
- `config/` - Konfigurasi mapping heuristic (alias dictionary).
- `output/` - Hasil export query dalam format TSV.
- `scripts/export_dashboard_mapping.sh` - Script export metadata dashboard.
- `scripts/generate_dashboard_summary.sh` - Script pembuat ringkasan Markdown.
- `scripts/generate_dashboard_specs.sh` - Script pembuat draft spesifikasi dashboard.
- `scripts/generate_dashboard_sql_templates.sh` - Script pembuat template SQL final per domain.
- `scripts/generate_heuristic_relations_v4.sh` - Generator relasi heuristic v4 (token + acronym + alias dictionary).
- `scripts/generate_heuristic_confidence.sh` - Penilaian confidence (`high|medium|low`) untuk hasil heuristic v4.
- `scripts/refresh_join_hubs_with_v4.sh` - Merge join hubs SQL + fallback heuristic v4.

## Quick Start

Jalankan dari root module:

```bash
cd /home/rania/apps/sentient-factory/apps/myerpplus-db-mapping
```

### 1) Export Metadata Dashboard

```bash
MYSQL_PASSWORD='your_mysql_password' ./dashboard-mapping/scripts/export_dashboard_mapping.sh
```

### 2) Generate Summary

```bash
./dashboard-mapping/scripts/generate_dashboard_summary.sh
```

### 3) Generate Draft Specs (Top 3 Domains)

```bash
./dashboard-mapping/scripts/generate_dashboard_specs.sh
```

### 4) Generate SQL Templates (Top 3 Domains)

```bash
./dashboard-mapping/scripts/generate_dashboard_sql_templates.sh
```

## Output Files

Script akan menghasilkan file berikut di folder output:

- `dashboard_01_domain_candidates.tsv`
- `dashboard_02_kpi_candidates.tsv`
- `dashboard_03_filter_dimensions.tsv`
- `dashboard_04_timeseries_readiness.tsv`
- `dashboard_05_join_hubs.tsv`
- `dashboard_summary.md` (ringkasan otomatis)
- `myerpplus_heuristic_relations_v4.tsv` (kandidat relasi)
- `myerpplus_heuristic_relations_v4_scored.tsv` (kandidat relasi + confidence)
- `myerpplus_heuristic_relations_v4_confidence_summary.md`

## Catatan

- Query fokus pada metadata (`information_schema`) agar aman dan cepat.
- Schema target mengikuti `MYSQL_DATABASE` pada saat menjalankan script export (tidak hardcoded).
- Deteksi join hubs memakai FK metadata dan fallback heuristic v4 berbasis token/acronym/alias dictionary (`config/heuristic_aliases.tsv`).
- Untuk profiling data nyata (mis. distribusi status), tambahkan query per tabel prioritas setelah kandidat tabel dipilih.
