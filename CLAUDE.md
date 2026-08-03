# Sentient Factory — Agent Operating Guide

Konteks untuk Claude Code (Superpowers, GSD, Skills) saat bekerja di repo ini.
Singkat, deklaratif, dan dipertahankan up-to-date.

## 1. Apa ini

Monorepo platform manufaktur berbasis AI. Stack utama:
- **Frontend**: Next.js (React 18+, TypeScript) di `apps/web-dashboard`, `apps/marketing`.
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

### 2.1 Trigger skill ERP

Jika user menyebut domain/URL deployment **`erp.fr-labs.my.id`** dalam bentuk apa pun
(mis. `https://erp.fr-labs.my.id/` atau path di bawahnya), agent **WAJIB membaca
`.claude/skills/erp/SKILL.md` terlebih dahulu** sebelum menjawab, menginspeksi,
atau mengubah kode terkait. URL itu diperlakukan sebagai konteks
`apps/web-erp`.

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

Cek port yang sudah dibuka: `sudo ufw status numbered`. Port yang sudah di-allow saat ini termasuk: 22 (ssh), 3203 (api-gateway), 3219 (web-erp), 3307 (mysql), 9395.

### 4.2 Menjalankan app Next.js — pakai standalone, BUKAN `next start`

App Next.js di repo ini (`web-erp`, `web-hr`, `web-mdp`, dst.) semuanya pakai `output: 'standalone'` di `next.config`. Artinya untuk production, **WAJIB** jalankan via `node <standalone>/server.js`, bukan `npm run start` (`next start`).

**Kenapa bukan `next start`?** Dengan `output: 'standalone'`, `next build` sudah men-trace dependency dan menghasilkan server ramping self-contained di `.next/standalone/`. Menjalankan `next start` di atasnya = boros (load runtime Next penuh) + Next sendiri kasih warning: *"next start does not work with output: standalone — use node .next/standalone/server.js instead"*. Selain itu `next start` butuh source tree + `node_modules` utuh, sedangkan standalone bisa di-copy mentah ke mesin lain tanpa `npm install`.

| | `next start` | `node standalone/server.js` |
|---|---|---|
| Runtime | Full Next framework (~besar) | Server ramping hasil trace (kecil) |
| Butuh `node_modules` penuh? | Ya | Tidak (sudah disertakan minimal) |
| Baca `next.config` runtime? | Ya | Sebagian (rewrites/redirects **dibake saat build**) |
| Cocok untuk | cek cepat hasil build | **production / deploy** |

**Caveat WAJIB — standalone TIDAK menyertakan static & public:**
- `.next/static` (CSS/JS chunk) → tidak ikut, harus disalin manual, kalau tidak chunk 404.
- Folder `public/` → tidak ikut, salin manual bila ada.

**Layout standalone bisa beda** tergantung cara build (turbo root vs langsung di app dir):
- `web-erp`, `web-hr` → `apps/<app>/.next/standalone/apps/<app>/server.js` (nested).
- `web-mdp` → `apps/<app>/.next/standalone/server.js` (flat).
Selalu cek dengan `find <app>/.next/standalone -name server.js -not -path '*/node_modules/*'`.

**Resep menjalankan (contoh web-erp port 3219):**
```bash
cd apps/web-erp
# 1. sync static & public (jalankan SETIAP setelah next build)
cp -rT .next/static .next/standalone/apps/web-erp/.next/static
[ -d public ] && cp -rT public .next/standalone/apps/web-erp/public

# 2. start standalone server (cwd = folder server.js)
cd .next/standalone/apps/web-erp
PORT=3219 ERP_INTERNAL_API_URL=http://localhost:3203 nohup node server.js > /tmp/web-erp.log 2>&1 &
```

Env internal-API per app (rewrite `/api/*` → api-gateway 3203, dibake saat build):
- web-erp → `ERP_INTERNAL_API_URL` (rewrite `/api/erp/*`)
- web-hr  → `HR_INTERNAL_API_URL`  (rewrite `/api/*`)
- web-mdp → `MDP_INTERNAL_API_URL` (fallback `ERP_INTERNAL_API_URL`; rewrite `/api/erp/*` + `/api/mdp/*`)

**Untuk dev** tetap `npm run dev` (Next dev server + hot reload) — standalone hanya untuk production.

> Catatan: ini baru background shell sesi ini, bukan systemd. Kalau perlu auto-start + survive reboot, buat unit systemd atau service Docker. Lihat juga §8 (kesalahan umum).

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
- **Branch baru** sebelum eksekusi besar: `git checkout -b feat/<nama>` di checkout aktif. Jangan gunakan worktree.
- **Commit per langkah** kecil, pesan jelas. Jangan tumpuk 500 baris dalam satu commit.
- **PR template**: ringkasan + test plan; pakai `gh pr create`.

## 8. Hal yang sering bikin kepleset

- Membuka dua dev server di port 3101 → konflik. Selalu `npm run ports:check` dulu.
- Edit `apps/myerpplus-db-mapping` tanpa render ulang Vault env (`vault:render:myerp`) → koneksi MySQL gagal.
- Update `packages/shared-types` di TS saja → runtime ai-engine error karena Pydantic tertinggal.
- **Jangan gunakan worktree**: lakukan edit di checkout aktif yang ditonton dev server. Sebelum fix UI, konfirmasi branch yang sedang dijalankan.

## 9. Jangan disentuh tanpa diminta

- `infra/docker-compose.yml` (struktur service).
- `config/ports.json`.
- `scripts/bootstrap-vault-dev.sh` dan turunan Vault.
- `myerpplus_serenity.sql` di parent dir (di luar repo).

## 10. Saat ragu

Tanya user. Lebih baik konfirmasi 10 detik daripada rollback 1 jam.

## 11. Tips produktivitas vibe coding

**Checklist wajib setelah vibe coding**
- Setelah sesi vibe coding selesai, **WAJIB commit** perubahan dengan pesan conventional commit yang jelas.
- Setelah commit, **WAJIB push ke `origin`** pada branch kerja yang sesuai.
- Setelah push, **WAJIB deploy** ke environment target sesuai instruksi task/deployment yang berlaku.
- Setelah deploy, **WAJIB test/verifikasi** flow yang terdampak dan laporkan hasilnya secara eksplisit.

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

## Worktree Policy (VPS-wide)

- **Do not use Git worktrees on this VPS.** Work directly in the active workspace/checkout.
- Do not create, enter, recommend, or require a worktree for any task, including background jobs.
- Use the current branch, or create a normal Git branch in the same checkout when isolation is needed.
