---
name: myerpplus-db-mapping
description: Skill untuk bekerja dengan apps/myerpplus-db-mapping — definisi OBT (Operational Business Transformation) layer, semantic schema untuk AI Engine, dan scripts sinkronisasi MySQL ke PostgreSQL.
---

Kamu sedang bekerja di `apps/myerpplus-db-mapping` — lapisan semantic schema dan OBT untuk integrasi MyERPPlus.

## Tujuan
Repository ini adalah **sumber kebenaran tunggal** untuk:
1. Mapping schema MyERPPlus (MySQL) → PostgreSQL OBT tables
2. Semantic schema yang digunakan AI Engine untuk NL-to-SQL
3. Scripts ETL/sync dari MySQL ke PostgreSQL
4. Dokumentasi query patterns per modul bisnis

## Struktur Folder

```
db/
├── m0-administrator/          # User, role, permission
├── m1-master-data/            # Contact, item, UOM, warehouse, dll
├── m2-finance/                # GL, AP, AR, bank reconciliation
├── m3-inventory/              # Stock, mutasi, GRN, stock report
├── m4-purchasing/             # PO, PR, GRN, PI, payment
├── m5-sales/                  # SO, SI, DO, sales return, pricing
├── m6-manufacturing/          # BOM, produksi, WIP
├── m7-procurement-advanced/
├── m8-analytics-content/
├── obt-agent-mapping.json     # Master registry semua OBT tables
├── semantic-query-schema-dashboard-obt.json  # Schema untuk dashboard AI
└── semantic-english-status.md  # Mapping status multi-bahasa

scripts/
├── bootstrap-obt-landing.py       # Materialisasi OBT pertama kali
├── render-obt-agent-mapping.py    # Generate schema dari mapping
├── sync-obt-from-cdc.py           # Sync OBT dari CDC events
├── sync-mysql-row-to-landing.py   # Direct MySQL → PostgreSQL sync
├── run-pg-obt-table-sql.py        # Eksekusi DDL OBT
└── read-custom-dashboard-catalog.py
```

## File Kritis

### `obt-agent-mapping.json`
Master registry semua OBT tables. Setiap entry berisi:
```json
{
  "table_name": "obt_sales_order",
  "canonical_grain": "satu baris per sales order",
  "source_systems": ["myerpplus.t_sales_order"],
  "join_hints": [...],
  "business_terms": {...},
  "query_patterns": [...],
  "status": "bootstrapped"
}
```

Status values: `bootstrapped`, `source-empty`, `blocked`, `queued`

### `semantic-query-schema-dashboard-obt.json`
Schema yang di-load AI Engine untuk generate SQL. Berisi:
- `table_groups` — kelompok tabel per domain
- `tables` — daftar tabel dengan kolom, tipe, dan importance
- `join_hints` — relasi antar tabel
- `business_terms` — glossary istilah bisnis
- `query_patterns` — contoh query umum
- `important_rules` — constraints dan aturan khusus

## Modul Bisnis (per folder `m#`)

| Modul | Kode | Konten |
|-------|------|--------|
| Administrator | m0 | User, role, permission, session |
| Master Data | m1 | Contact, item, UOM, division, warehouse, city, SLA |
| Finance | m2 | GL entry, AP, AR, bank reconciliation |
| Inventory | m3 | Stock mutasi, GRN, stock report |
| Purchasing | m4 | PO, PR, GRN, PI, pembayaran |
| Sales | m5 | SO, SI, DO, return, pricing |
| Manufacturing | m6 | BOM, production order, WIP |

## Perintah Umum

```bash
# Bootstrap OBT tables pertama kali
python scripts/bootstrap-obt-landing.py

# Sync data dari CDC ke OBT
python scripts/sync-obt-from-cdc.py

# Sync langsung dari MySQL (bypass CDC)
python scripts/sync-mysql-row-to-landing.py --table m_item

# Generate ulang OBT DDL
python scripts/run-pg-obt-table-sql.py

# Generate semantic schema dari mapping
python scripts/render-obt-agent-mapping.py
```

## Environment Variables

```bash
DATABASE_URL=postgresql://...          # PostgreSQL target
MYERPPLUS_DATABASE_URL=mysql://...     # MySQL source (MyERPPlus)
OBT_MANIFEST_PATH=db/obt-agent-mapping.json
```

## Panduan Tugas Umum

### Menambah OBT Table Baru
1. Tambah entry di `db/obt-agent-mapping.json`
2. Buat file SQL DDL di folder modul yang sesuai
3. Jalankan `python scripts/run-pg-obt-table-sql.py`
4. Update `semantic-query-schema-dashboard-obt.json` dengan kolom & query patterns
5. Jalankan `python scripts/bootstrap-obt-landing.py` untuk initial data load

### Update Semantic Schema
Saat ada perubahan struktur tabel atau business term baru:
1. Edit `obt-agent-mapping.json` — tambah/ubah `business_terms` atau `query_patterns`
2. Jalankan `python scripts/render-obt-agent-mapping.py`
3. Copy output ke `semantic-query-schema-dashboard-obt.json`
4. Restart AI Engine untuk load schema terbaru

### Konvensi Naming OBT Tables
- `obt_<domain>_<entity>` — contoh: `obt_sales_order`, `obt_inventory_stock`
- `dim_<entity>` — contoh: `dim_item`, `dim_contact`, `dim_warehouse`
- `fact_<metric>` — contoh: `fact_sales_daily`
