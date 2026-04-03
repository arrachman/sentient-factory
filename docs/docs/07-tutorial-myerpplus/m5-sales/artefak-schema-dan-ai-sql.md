---
title: Artefak Schema dan AI SQL M5
sidebar_position: 3
description: Daftar artefak teknis yang dipakai untuk semantic schema, query collection, dan regression test M5.
---

# Artefak Schema dan AI SQL M5

Halaman ini merangkum artefak teknis yang dipakai untuk tutorial dan analisis modul `m5-sales`.

## Schema dan Summary

- `semantic-schema-m5.json`
  Fungsi AI Agent: schema utama khusus modul `m5`, dipakai sebagai context inti untuk mengenali tabel, relasi, dan istilah sales.
- `semantic-schema-sales.json`
  Fungsi AI Agent: schema domain sales yang lebih sempit, berguna saat agent hanya perlu fokus ke use case penjualan tanpa noise modul lain.
- `semantic-schema.json`
  Fungsi AI Agent: schema global lintas modul, dipakai saat pertanyaan sales menyentuh area lain seperti finance, inventory, atau master data.
- `semantic-schema-m5-summary.md`
  Fungsi AI Agent: ringkasan manusia yang membantu prompt engineering, review cepat, dan validasi apakah coverage schema sales sudah masuk akal.
- `semantic-schema-m5-summary-flat.json`
  Fungsi AI Agent: versi flat untuk indexing, retrieval, filtering cepat, atau ingestion ke pipeline embedding dan evaluasi otomatis.

## Query dan Report Source

- `m5-queries.md`
- `m5-queries-by-type.md`
- `m0_report_rmoduleid_5.sql`

## Guide NL2SQL

- `semantic-schema-m5-nl2sql.md`
- `semantic-schema-m5-nl2sql.json`
  Fungsi AI Agent: aturan machine-readable untuk menerjemahkan pertanyaan user menjadi SQL readonly berbasis domain `m5`, termasuk guardrail dan pola query yang diharapkan.

## Prompt dan Regression Suite

- `sales_sql_readonly_generator.prompt.md`
- `sales_sql_readonly_generator.m5-regression-tests.md`
- `sales_sql_readonly_generator.m5-regression-tests.json`
  Fungsi AI Agent: kumpulan test case terstruktur untuk mengukur apakah agent menghasilkan SQL sales yang benar, relevan, dan tetap sesuai batas readonly.
- `validate_m5_regression.py`
- `run_m5_regression.py`

## POV AI Agent

Jika dilihat dari sudut pandang AI Agent, peran file JSON umumnya terbagi seperti ini:

- **Core business schema**
  - `semantic-schema-m5.json`
  - `semantic-schema-sales.json`
  - `semantic-schema.json`
  Dipakai untuk memahami dunia data, nama tabel, hubungan antar dokumen, dan istilah bisnis.

- **Reasoning and generation rules**
  - `semantic-schema-m5-nl2sql.json`
  Dipakai untuk mengarahkan cara agent memilih tabel, membuat join, dan membatasi query agar tetap aman.

- **Evaluation and regression**
  - `semantic-schema-m5-summary-flat.json`
  - `sales_sql_readonly_generator.m5-regression-tests.json`
  Dipakai untuk retrieval cepat, evaluasi output, dan regression testing saat prompt atau schema berubah.

## Contoh Pengujian API

```bash
curl -X POST http://127.0.0.1:8001/api/chat/dashboard-query \
  -H 'Content-Type: application/json' \
  -d '{"question":"Buat dashboard piutang customer: daftar invoice belum lunas, total outstanding per customer, dan aging bucket","include_schema":true,"include_samples":false,"execute_read_only_query":false,"model_profile":"pro"}'
```

## Contoh Menyalakan AI Engine

```bash
docker compose -p sentient_factory -f /home/rania/apps/sentient-factory/infra/docker-compose.yml up -d --force-recreate ai-engine
```

```bash
VAULT_DEV_ROOT_TOKEN_ID=change-me-local-only docker compose -p sentient_factory -f /home/rania/apps/sentient-factory/infra/docker-compose.yml up -d --force-recreate ai-engine
```

```bash
docker rm -f sentient-infra-ai-engine
env VAULT_DEV_ROOT_TOKEN_ID=change-me-local-only docker compose -p sentient_factory -f /home/rania/apps/sentient-factory/infra/docker-compose.yml up -d ai-engine
```

## Checklist Analisis M5

Area kerja yang umum dipakai saat memperkaya semantic schema sales:

- cek tabel M5 mana yang deskripsinya masih generik
- cek kolom penting dari report yang belum masuk ke schema
- generate semantic-query-schema khusus M5 dari hasil schema, query, dan report
