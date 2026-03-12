# Debezium + Kafka Configuration

Folder ini dipakai untuk menyimpan konfigurasi CDC yang terkait dengan Kafka dan Debezium.

## Rekomendasi penempatan file

- [`infra/docker-compose.yml`](infra/docker-compose.yml) → service Kafka, Kafka UI, dan Debezium Connect
- [`infra/debezium/README.md`](infra/debezium/README.md) → dokumentasi alur config
- `infra/debezium/connectors/` → file connector Debezium per source database
- `infra/kafka/` → file tambahan Kafka bila nanti butuh override config
- [`.env.vault`](.env.vault) → hasil render secret shared dari Vault
- `apps/etl-worker/.env.vault` → secret khusus consumer/worker bila nanti dibuat

## Alur dengan Vault

1. Secret disimpan di Vault.
2. Secret dirender menjadi file env lokal menggunakan [`scripts/render-vault-env.sh`](scripts/render-vault-env.sh).
3. [`infra/docker-compose.yml`](infra/docker-compose.yml) membaca file env hasil render.
4. File connector Debezium memakai placeholder environment variable, lalu di-render sebelum di-submit ke Kafka Connect.

## Rekomendasi path secret Vault

- `sentient-factory/dev/shared`
  - secret umum: Kafka bootstrap servers, Debezium Connect URL, dan secret bersama lain
- `sentient-factory/dev/cdc`
  - secret CDC source MySQL `myerpplus`
  - source client aktif untuk ETL saat ini:
    - host: `103.125.36.54`
    - port: `20406`
    - database: `myerpplus_dashboard`
    - user: `dashboard`
- `sentient-factory/dev/etl-worker`
  - secret khusus consumer/worker bila service worker sudah dibuat

## File yang disarankan

- `infra/debezium/connectors/mysql-myerpplus.json.tpl`
  - template connector Debezium MySQL
- `infra/debezium/rendered/mysql-myerpplus.json`
  - hasil render lokal, jangan di-commit

## Catatan penting

- File hasil render sebaiknya masuk `.gitignore`.
- Secret sensitif seperti password MySQL jangan ditulis hardcoded di file JSON final yang di-commit.
- Connector Debezium dikirim ke Kafka Connect via REST API, bukan dibaca langsung oleh Docker Compose.

## Env lokal CDC yang dipakai repo ini

Service `debezium-connect` di [`infra/docker-compose.yml`](/home/rania/apps/sentient-factory/infra/docker-compose.yml) membaca `../.env.vault.cdc` bila file itu ada.

Variable minimum untuk source `myerpplus_dashboard`:

```env
CDC_MYSQL_HOST=103.125.36.54
CDC_MYSQL_PORT=20406
CDC_MYSQL_USER=dashboard
CDC_MYSQL_PASSWORD=<isi-password-client>
CDC_MYSQL_DATABASE=myerpplus_dashboard
CDC_MYSQL_SERVER_ID=54061
CDC_MYSQL_TABLE_INCLUDE_LIST=myerpplus_dashboard.m0_users,myerpplus_dashboard.m0_role,myerpplus_dashboard.m0_menu,myerpplus_dashboard.m1_currency
KAFKA_BOOTSTRAP_SERVERS=kafka:9092
```

`CDC_MYSQL_PASSWORD` sebaiknya diisi lewat Vault atau file `.env.vault.cdc` lokal yang tidak di-commit.

## Menjalankan connector `myerpplus`

1. Render connector dari template:

```bash
npm run cdc:connector:render:myerp
```

2. Pastikan Kafka dan Debezium Connect hidup:

```bash
npm run docker:up
```

3. Apply connector ke Kafka Connect:

```bash
export DEBEZIUM_CONNECT_URL=http://127.0.0.1:8083
npm run cdc:connector:apply:myerp
```

4. Verifikasi status connector:

```bash
curl -fsS http://127.0.0.1:8083/connectors/myerpplus-mysql-cdc/status | jq
```

Catatan: script render sudah mendukung password dengan karakter shell khusus karena file env dibaca sebagai pasangan `KEY=VALUE`, bukan di-`source` langsung.

Untuk menyalakan CDC tabel `m1_currency`, pastikan `CDC_MYSQL_TABLE_INCLUDE_LIST` memuat entri penuh nama tabel source, misalnya `myerpplus.m1_currency` atau `myerpplus_dashboard.m1_currency` sesuai nilai `CDC_MYSQL_DATABASE` aktif.

Repo ini tidak membutuhkan handler khusus agar event `m1_currency` masuk ke pipeline generik. Setelah connector di-apply ulang, event akan otomatis masuk ke topik Debezium dan disimpan worker ke `cdc_events` serta `cdc_current_state`.
