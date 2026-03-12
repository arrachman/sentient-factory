# ETL Worker

Worker ini mengonsumsi topic CDC Debezium dengan prefix `myerpplus`, lalu melakukan sink generik ke Postgres `sentient_factory`.

## Scope scaffold saat ini

- subscribe topic regex `^myerpplus\\..*`
- simpan event mentah ke `cdc_events`
- upsert current state per record ke `cdc_current_state`
- sink domain-specific aman ke tabel mirror `cdc_myerpplus_users`, `cdc_myerpplus_roles`, `cdc_myerpplus_contacts`, `cdc_myerpplus_currencies`
- sediakan hook transform per-topic untuk sink lanjutan ke tabel aplikasi inti bila sudah siap

## Menjalankan lokal

1. Render secret worker: `npm run vault:render:etl-worker`
2. Jalankan infra: `npm run docker:up`
3. Jalankan worker: `cd apps/etl-worker && npm install && npm run dev`
4. Merge aman ke tabel inti: `cd apps/etl-worker && npm run merge:core`

## Catatan

Scaffold ini sengaja memakai tabel mirror dulu agar tidak menimpa data aplikasi inti. Mapping lanjut bisa ditambahkan lewat `src/topic-handlers.ts` setelah aturan merge domain disepakati.

## Merge ke tabel inti

- command: `npm run merge:core`
- user merge: cocokkan via mapping lama, lalu `username`, lalu `email`
- role merge: cocokkan via mapping lama, lalu `name`
- contact merge: cocokkan via mapping lama, lalu `code`, lalu `name + type`
- hasil pencocokan disimpan di tabel map `cdc_myerpplus_*_core_map` agar idempotent
