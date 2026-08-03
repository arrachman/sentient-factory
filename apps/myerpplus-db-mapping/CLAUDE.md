# myerpplus-db-mapping — Agent Guide

Pemetaan skema MyERP+ (MySQL) → model internal Sentient Factory (Postgres).

## Tujuan
- Dokumentasikan tabel/kolom MyERP+ yang dipakai.
- Sediakan SQL/script transformasi untuk seed/backfill awal.
- Sumber kebenaran *mapping* sebelum implementasi di `etl-worker` & `api-gateway`.

## Layout
- `db/` — dump skema, contoh data, query referensi.
- `scripts/` — script ad-hoc (migration helper, sanity check).
- `plan.md` — rencana mapping (status: draft/locked).

## Konvensi
- **Read-only ke MyERP+**. Jangan pernah bikin script yang `UPDATE/DELETE` di MySQL produksi.
- Setiap mapping baru → entri di `plan.md` dengan: source table/col → target table/col → catatan transform.
- Dump SQL besar **jangan di-commit** ke repo (sudah ada `myerpplus_serenity.sql` 27MB di parent — itu di-gitignore).

## Konfigurasi koneksi
Env via Vault: `npm run vault:render:myerp` (di root). Output → `.env.vault`.
Variabel kunci: `MYERPPLUS_MYSQL_HOST`, `MYERPPLUS_MYSQL_USER`, `MYERPPLUS_MYSQL_PASSWORD`, `MYERPPLUS_MYSQL_DB`.

Akses cepat: `npm run db:mysql` (dari root) → shell. `npm run db:mysql:query` → query satu-shot.

## Workflow tambah mapping
1. Eksplorasi: `npm run db:mysql:list` → pilih tabel.
2. Sample query: `db:mysql:query "SELECT ... LIMIT 50"`.
3. Tulis hipotesa mapping di `plan.md` (lock dengan user sebelum implement).
4. Implementasi transform di `etl-worker` (CDC) atau import script (`scripts/`).
5. Verifikasi count + checksum kolom kunci.

## Hal yang sering bikin masalah
- Karakter encoding MyERP+ kadang `latin1` → harus konversi ke UTF-8 saat insert ke Postgres.
- Timestamp tanpa timezone di MyERP+ → asumsikan `Asia/Jakarta` kecuali ada bukti lain.
- Soft-delete di MyERP+ pakai kolom `deleted_at`/`status` — ETL **wajib** filter.
- Foreign key di MyERP+ tidak selalu ditegakkan → validasi referensial saat import.

## Jangan disentuh tanpa diminta
- Kredensial MySQL di Vault path `sentient-factory/dev/myerpplus-db-mapping`.
- `plan.md` bagian yang sudah ditandai `LOCKED`.

## Worktree Policy (VPS-wide)

- **Do not use Git worktrees on this VPS.** Work directly in the active workspace/checkout.
- Do not create, enter, recommend, or require a worktree for any task, including background jobs.
- Use the current branch, or create a normal Git branch in the same checkout when isolation is needed.
