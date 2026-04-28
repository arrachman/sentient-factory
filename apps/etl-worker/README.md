# ETL Worker

Worker ini mengonsumsi topic CDC Debezium dengan prefix `myerpplus`, lalu melakukan sink generik ke Postgres `sentient_factory`.

## Scope scaffold saat ini

- subscribe topic regex `^myerpplus\\..*`
- simpan event mentah ke `cdc_events`
- upsert current state per record ke `cdc_current_state`
- tidak lagi melakukan sink domain-specific ke tabel mirror `cdc_myerpplus_*`
- hook transform per-topic saat ini dinonaktifkan sampai ada target sink baru yang disepakati

## Menjalankan lokal

1. Render secret worker: `npm run vault:render:etl-worker`
2. Jalankan infra: `npm run docker:up`
3. Jalankan worker: `cd apps/etl-worker && npm install && npm run dev`

## Catatan

Worker ini sekarang hanya menjaga raw CDC sink (`cdc_events`) dan current-state sink (`cdc_current_state`). Jika nanti dibutuhkan sink turunan baru, implementasinya bisa ditambahkan lagi lewat `src/topic-handlers.ts` dengan target tabel yang baru.
