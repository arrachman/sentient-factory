# Sentient Factory — Agent Operating Guide

Konteks untuk Claude Code (Superpowers, GSD, Skills) saat bekerja di repo ini.
Singkat, deklaratif, dan dipertahankan up-to-date.

## 1. Apa ini

Monorepo platform manufaktur berbasis AI. Stack utama:
- **Frontend**: Next.js (React 18+, TypeScript) di `apps/web-dashboard`, `apps/landing-page`, `apps/marketing`.
- **Backend**: NestJS + Prisma (TypeScript) di `apps/api-gateway`.
- **AI**: Node + Python (LangChain) di `apps/ai-engine`.
- **DB mapping**: `apps/myerpplus-db-mapping` (jembatan ke MyERP+).
- **Shared**: `packages/shared-types`, `packages/ui-kit`, `packages/logger`.
- **Infra**: Docker Compose (`infra/docker-compose.yml`), Vault, Postgres, Redis, MySQL (MyERP+).

Manajer paket: **npm workspaces + Turborepo** (ada `pnpm-workspace.yaml` legacy — `package.json` deklarasinya `npm@10`; **gunakan `npm`**, bukan pnpm, kecuali instruksi sebaliknya).

## 2. Aturan kerja non-negosiabel

1. **JANGAN** commit file `.env*` plain. Rahasia hidup di **Vault**; render lewat `npm run vault:render:*`.
2. **JANGAN** ubah `config/ports.json` tanpa diminta — itu single source of truth port. Pakai `npm run ports:*` untuk inspeksi/perubahan.
3. **JANGAN** hapus/rename file di `packages/shared-types` tanpa update konsumen TS & Python (Pydantic) sekaligus — paket ini SSOT lintas-bahasa.
4. **JANGAN** jalankan migrasi DB destruktif (`drop`, `truncate`) tanpa konfirmasi user.
5. **JANGAN** pakai `--no-verify`, atau amend commit yang sudah dipush. **JANGAN** suggest `git push --force` ke branch manapun kecuali user minta secara eksplisit — jika perlu sinkronisasi, prefer rebase atau fast-forward.
6. **Setelah ubah Prisma schema atau generate client** → WAJIB jalankan `prisma migrate deploy` (atau `prisma migrate dev`) sebelum declare task selesai. Jangan anggap schema change cukup tanpa migrasi.
7. Commit ber-prefix conventional: `feat:`, `fix:`, `chore:`, `refactor:`, `docs:`. Lihat `git log --oneline` untuk gaya.

## 3. Perintah yang sering dipakai

```bash
# Dev
npm run dev                 # turbo run dev (semua app)
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

Cek port yang sudah dibuka: `sudo ufw status numbered`. Port yang sudah di-allow saat ini termasuk: 22 (ssh), 3203 (api-gateway), 3218 (web-erp prototype), 3307 (mysql), 9395.

## 5. Konvensi kode

**Ukuran file**
- **Maks 400 baris per file**. Saat audit atau refactor, flag semua file > 400 baris dan split ke modul lebih kecil. Jalankan `npm run typecheck` setelah setiap refactor. Untuk refactor besar, spawn sub-agent terpisah per file agar context utama tidak meledak.

**TypeScript/JS**
- Strict mode TS. Named exports > default exports.
- Async/await; hindari callback. Functional style untuk transform data.
- ESLint Airbnb-ish (lihat config tiap app).

**Python (ai-engine)**
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
- **Worktree ≠ live dev server**: edit di feature worktree tidak langsung terlihat di browser sampai di-cherry-pick/merge ke branch yang ditonton server. Sebelum fix UI, konfirmasi dulu branch mana yang sedang dijalankan dev server, lalu tawarkan cherry-pick jika fix perlu langsung tampil.

## 9. Jangan disentuh tanpa diminta

- `infra/docker-compose.yml` (struktur service).
- `config/ports.json`.
- `scripts/bootstrap-vault-dev.sh` dan turunan Vault.
- `myerpplus_serenity.sql` di parent dir (di luar repo).

## 10. Saat ragu

Tanya user. Lebih baik konfirmasi 10 detik daripada rollback 1 jam.

## 11. Tips produktivitas vibe coding

**Refactor besar — jangan mati di context limit**
- Gunakan `Task` agent per file: satu agent = satu file oversized, context parent tetap kecil.
- Sebelum mulai refactor besar, `/clear` dulu lalu buat checklist file-per-file.
- Prompt template: `"Audit direktori ini untuk file > 400 baris. Buat checklist, lalu spawn Task agent terpisah per file untuk split + typecheck. Report summary saja ke parent context."`

**Hooks — typecheck otomatis setelah edit**
Tambahkan ke `.claude/settings.json` untuk catch typo/error lebih awal:
```json
{
  "hooks": {
    "PostToolUse": [{
      "matcher": "Edit|Write",
      "hooks": [{"type": "command", "command": "npm run typecheck 2>&1 | tail -20"}]
    }]
  }
}
```

**Custom skills yang worth dibuat**
- `/audit` → cari file > 400 baris, buat split plan, jalankan typecheck
- `/merge-dev` → commit semua staged, push ke dev, report status
- Buat di `.claude/skills/<nama>/SKILL.md`

**Sebelum fix UI — selalu verifikasi checkout**
Tanya dulu: *"Branch mana yang ditonton dev server sekarang, dan kita sedang edit di branch mana?"* — jika beda, propose cherry-pick terlebih dahulu.
