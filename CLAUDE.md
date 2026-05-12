# Sentient Factory — Agent Operating Guide

Konteks untuk Claude Code (Superpowers, GSD, Skills) saat bekerja di repo ini.
Singkat, deklaratif, dan dipertahankan up-to-date.

## 1. Apa ini

Monorepo platform manufaktur berbasis AI. Stack utama:
- **Frontend**: Next.js (React 18+, TypeScript) di `apps/web-dashboard`, `apps/landing-page`, `apps/marketing`.
- **Backend**: NestJS + Prisma (TypeScript) di `apps/api-gateway`.
- **AI/ETL**: Node + Python (LangChain) di `apps/ai-engine`, `apps/etl-worker`.
- **DB mapping**: `apps/myerpplus-db-mapping` (jembatan ke MyERP+).
- **Shared**: `packages/shared-types`, `packages/ui-kit`, `packages/logger`.
- **Infra**: Docker Compose (`infra/docker-compose.yml`), Vault, Debezium CDC, Postgres, Redis, MySQL (MyERP+).

Manajer paket: **npm workspaces + Turborepo** (ada `pnpm-workspace.yaml` legacy — `package.json` deklarasinya `npm@10`; **gunakan `npm`**, bukan pnpm, kecuali instruksi sebaliknya).

## 2. Aturan kerja non-negosiabel

1. **JANGAN** commit file `.env*` plain. Rahasia hidup di **Vault**; render lewat `npm run vault:render:*`.
2. **JANGAN** ubah `config/ports.json` tanpa diminta — itu single source of truth port. Pakai `npm run ports:*` untuk inspeksi/perubahan.
3. **JANGAN** hapus/rename file di `packages/shared-types` tanpa update konsumen TS & Python (Pydantic) sekaligus — paket ini SSOT lintas-bahasa.
4. **JANGAN** jalankan migrasi DB destruktif (`drop`, `truncate`) tanpa konfirmasi user.
5. **JANGAN** pakai `--no-verify`, `git push --force` ke `main`, atau amend commit yang sudah dipush.
6. Commit ber-prefix conventional: `feat:`, `fix:`, `chore:`, `refactor:`, `docs:`. Lihat `git log --oneline` untuk gaya.

## 3. Perintah yang sering dipakai

```bash
# Dev
npm run dev                 # turbo run dev (semua app)
npm run dev:all             # ./scripts/start-all.sh (port-aware)
npm run build && npm test
npm run lint && npm run typecheck

# Port management (WAJIB pakai ini, jangan hardcode)
npm run ports:list
npm run ports:check
npm run ports:active

# Docker / infra
npm run docker:up           # full stack
npm run docker:up:vault     # + Vault dev
npm run docker:logs

# Vault (rahasia)
npm run vault:bootstrap:dev
npm run vault:render:all    # render .env.vault dari Vault

# Database
npm run db:migrate
npm run db:seed
npm run db:backup
npm run db:mysql            # shell ke MySQL MyERP+

# CDC (Debezium)
npm run cdc:connector:render:myerp
npm run cdc:connector:apply:myerp
```

## 4. Layout & port

Port assignment hidup di `config/ports.json` (lihat `CONFIG-PORTS.md`):

| App           | Port | Type    |
| ------------- | ---- | ------- |
| web-dashboard | 3101 | Next.js |
| landing-page  | 3102 | Next.js |
| api-gateway   | 3103 | NestJS  |
| ai-engine     | 3104 | Node    |
| docs          | 3105 | Docusaurus |

Cek konflik: `npm run ports:check`. Cari port bebas: `npm run ports:find`.

### 4.1 UFW firewall — WAJIB buka port baru

Host ini pakai **UFW dengan default policy DROP**. Artinya: setiap kali menambah app/service baru ke `config/ports.json` yang perlu diakses dari LAN (browser di mesin lain, mobile, dll), port-nya **HARUS** di-allow di UFW. Kalau tidak, `ping` jalan tapi `curl` timeout dari klien LAN.

Checklist tiap kali menambah port:

1. Tambah entry di `config/ports.json` (via `npm run ports:*` atau edit langsung).
2. Buka port di UFW — restrict ke subnet LAN untuk service tanpa auth:
   ```bash
   # Akses LAN saja (preferred untuk prototype/dev)
   sudo ufw allow from 192.168.1.0/24 to any port <PORT> proto tcp comment '<app-name>'
   # Atau global (hanya untuk service ber-auth / public)
   sudo ufw allow <PORT>/tcp comment '<app-name>'
   sudo ufw reload
   sudo ufw status | grep <PORT>
   ```
3. Verifikasi dari klien LAN: `curl -v --max-time 5 http://<host-ip>:<PORT>/`.

Cek port yang sudah dibuka: `sudo ufw status numbered`. Port yang sudah di-allow saat ini termasuk: 22 (ssh), 3202 (web-althea), 3203 (api-gateway), 3218 (web-erp prototype), 3307 (mysql), 9395.

## 5. Konvensi kode

**TypeScript/JS**
- Strict mode TS. Named exports > default exports.
- Async/await; hindari callback. Functional style untuk transform data.
- ESLint Airbnb-ish (lihat config tiap app).

**Python (ai-engine, etl-worker)**
- Python 3.11+, PEP 8, type hints wajib, Pydantic untuk DTO.
- Async untuk I/O (httpx, asyncpg).

**API**
- REST, versi via prefix `/api/v1/...`.
- Error response konsisten: `{ error: { code, message, details? } }`.
- OpenAPI di-generate dari kode bila memungkinkan.

**Shared types**
- Tambah/ubah tipe → update sisi TS *dan* Pydantic. Tanpa pengecualian.

## 6. Testing

- TS: framework per-app (Vitest/Jest — cek `package.json` masing-masing).
- Python: pytest.
- Integrasi DB: pakai container Docker, **bukan mock** (sudah ada incident migrasi gagal akibat mock).
- Jalankan `npm test` lewat turbo sebelum minta user untuk review.

## 7. Workflow agent (Superpowers / GSD)

- **Eksplorasi besar** → pakai sub-agent `Explore` atau `general-purpose`, jangan grep manual berulang.
- **Spec/milestone/phase** → driver-nya **GSD** (`/gsd-new-milestone`, `/gsd-plan-phase`, `/gsd-execute-phase`).
- **Eksekusi mendalam (TDD, refactor, debug)** → driver-nya **Superpowers**. Jangan campur driver di satu fase.
- **Branch baru** sebelum eksekusi besar: `git checkout -b feat/<nama>` (atau pakai worktree).
- **Commit per langkah** kecil, pesan jelas. Jangan tumpuk 500 baris dalam satu commit.
- **PR template**: ringkasan + test plan; pakai `gh pr create`.

## 8. Hal yang sering bikin kepleset

- Membuka dua dev server di port 3101 → konflik. Selalu `npm run ports:check` dulu.
- Edit `apps/myerpplus-db-mapping` tanpa render ulang Vault env (`vault:render:myerp`) → koneksi MySQL gagal.
- Update `packages/shared-types` di TS saja → runtime ai-engine error karena Pydantic tertinggal.
- Connector Debezium di-apply tanpa `cdc:connector:render` ulang → kredensial expired.

## 9. Jangan disentuh tanpa diminta

- `infra/docker-compose.yml` (struktur service).
- `config/ports.json`.
- `scripts/bootstrap-vault-dev.sh` dan turunan Vault.
- `myerpplus_serenity.sql` di parent dir (di luar repo).

## 10. Saat ragu

Tanya user. Lebih baik konfirmasi 10 detik daripada rollback 1 jam.
