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