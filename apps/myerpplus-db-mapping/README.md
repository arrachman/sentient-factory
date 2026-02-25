# PT MyERPPlus - MySQL DB Mapping

Folder ini berisi mapping database client `PT MyERPPlus` dari MySQL schema `myerpplus`.

## Struktur
- `queries/`: kumpulan query SQL untuk mapping metadata schema.
- `scripts/export_mapping.sh`: script export hasil mapping ke file TSV.
- `scripts/render_erd.sh`: script render Mermaid (`.mmd`) ke SVG/PNG.
- `dashboard-mapping/`: mapping kandidat dashboard (KPI, dimensi filter, time-series, join hub).
- `output/summary.md`: ringkasan hasil mapping terbaru.
- `output/erd-pt-myerpplus.md`: dokumentasi ERD awal.
- `output/erd-pt-myerpplus.mmd`: source Mermaid ERD gabungan.
- `output/domains/*.mmd`: ERD per domain.
- `output/relationship-confidence.csv`: confidence score relasi heuristik.
- `.env.example`: contoh environment variable koneksi.

## Cara pakai
1. Pastikan container MySQL aktif (default: `mysql`).
2. Jalankan export:

```bash
cd /home/rania/apps/sentient-factory/apps/myerpplus-db-mapping
MYSQL_PASSWORD='your_mysql_password' ./scripts/export_mapping.sh
```

## Output
Hasil export akan dibuat di folder `output/`:
- `01_overview.tsv`
- `02_table_catalog.tsv`
- `03_primary_keys.tsv`
- `04_columns_heaviest.tsv`
- `05_module_distribution.tsv`
- `06_foreign_keys.tsv`

## Render ERD
```bash
cd /home/rania/apps/sentient-factory/apps/myerpplus-db-mapping
./scripts/render_erd.sh
```

## Mapping Dashboard
```bash
cd /home/rania/apps/sentient-factory/apps/myerpplus-db-mapping
MYSQL_PASSWORD='your_mysql_password' ./dashboard-mapping/scripts/export_dashboard_mapping.sh
./dashboard-mapping/scripts/generate_dashboard_summary.sh
./dashboard-mapping/scripts/generate_dashboard_specs.sh
./dashboard-mapping/scripts/generate_dashboard_sql_templates.sh
```
