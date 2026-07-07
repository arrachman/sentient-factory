---
name: client-backend
description: Skill untuk bekerja dengan client-backend/api-myerpplus — legacy ASP.NET MyERPPlus application yang menjadi sumber data utama (read-only reference, jangan dimodifikasi sembarangan).
---

Kamu sedang bekerja di `client-backend/api-myerpplus` — legacy backend MyERPPlus.

## Penting: Status Folder Ini
> **READ-ONLY REFERENCE** — Ini adalah aplikasi legacy ASP.NET milik klien (MyERPPlus).
> Jangan modifikasi file di sini kecuali ada instruksi eksplisit.
> Sentient Factory membaca data dari MySQL database MyERPPlus, bukan dari source code ini.

## Tech Stack
- **Platform**: ASP.NET (legacy, kemungkinan .NET Framework)
- **Solution file**: `App_IndukDemoV1.sln`
- **Web server**: IIS (ada `web.config`)
- **Frontend legacy**: jQuery 3.1.1

## Struktur Folder

```
client-backend/api-myerpplus/
├── App_IndukDemoV1.sln    # Visual Studio solution
├── web.config             # IIS/ASP.NET config
├── Global.asax            # App lifecycle handlers
├── app/                   # App code
├── app_code/              # Code-behind files
├── Bin/                   # Compiled binaries
├── aspnet_client/         # ASP.NET client scripts
├── backup/                # Backup files
├── files/                 # Uploaded files
├── image/                 # App images
├── importdata/            # Import templates
├── js/                    # JavaScript files
├── msmq/                  # MSMQ message queue config
├── report/                # Crystal Reports / report files
├── template/              # Document templates
├── Template Import/       # Import templates
├── Template SA Hutang.xlsx  # AP template
├── ws/                    # Web Services (SOAP/ASMX)
└── Ws.xml                 # Web service definitions
```

## Cara Integrasi dengan Sentient Factory

Sentient Factory **tidak** memanggil API MyERPPlus secara langsung. Integrasi dilakukan via:

```
MyERPPlus (MySQL database)
    ↓ (transport ETL/CDC lama [Debezium → Kafka → etl-worker] sudah dihapus)
PostgreSQL sentient_factory
    ↓ OBT Transformation (apps/myerpplus-db-mapping)
obt_* tables
    ↓ AI Engine queries
```

## Informasi Database MySQL MyERPPlus

Untuk cek struktur tabel, lihat di:
- `apps/myerpplus-db-mapping/db/` — semantic schema per modul
- `apps/myerpplus-db-mapping/db/obt-agent-mapping.json` — mapping lengkap

## Web Services (SOAP) di `ws/`

MyERPPlus menyediakan beberapa SOAP web services (file `.asmx`).
Jika ada kebutuhan integrasi langsung (bukan via CDC), referensi ke `Ws.xml`.

## Troubleshooting Koneksi MySQL

```bash
# Akses MySQL MyERPPlus
bash scripts/mysql-access.sh

# Atau manual
docker compose exec mysql mysql -u root -p myerpplus

# Cek tabel yang tersedia
SHOW TABLES;

# Cek apakah CDC sudah berjalan
SELECT COUNT(*) FROM sentient_factory.cdc_events
WHERE source_table LIKE 'm_%';
```
