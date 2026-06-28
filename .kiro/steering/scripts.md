---
inclusion: fileMatch
fileMatchPattern: "scripts/**"
---

# Scripts — Automation & Tooling

`scripts/` — automation scripts Sentient Factory.

## Daftar Scripts

| Script | Fungsi |
|--------|--------|
| `bootstrap-vault-dev.sh` | Inisialisasi HashiCorp Vault (pertama kali) |
| `vault-login-dev.sh` | Login Vault & ambil auth token |
| `vault-approle-login.sh` | Login Vault via AppRole (CI/production) |
| `render-vault-env.sh` | Render `.env` dari secrets Vault |
| `sync-env-file-to-vault.sh` | Upload `.env` ke Vault |
| `cleanup-plain-env.sh` | Hapus `.env` plaintext setelah sync ke Vault |
| `docker-up-with-vault.sh` | Start Docker Compose dengan Vault secrets |
| `port-manager.js` | CLI manajemen port `config/ports.json` |
| `backup-postgres.sh` | Backup PostgreSQL manual |
| `install-pg-backup-cron.sh` | Install cron job backup otomatis |

## Alur Setup Development (Pertama Kali)

```bash
bash scripts/bootstrap-vault-dev.sh   # 1. Bootstrap Vault
bash scripts/vault-login-dev.sh       # 2. Login Vault
bash scripts/render-vault-env.sh      # 3. Render .env
bash scripts/docker-up-with-vault.sh  # 4. Start semua service (infra + apps) via Docker Compose
```

## Port Manager

```bash
node scripts/port-manager.js list     # Lihat semua port
node scripts/port-manager.js add --name new-service --port 3220
node scripts/port-manager.js check    # Cek konflik
```

`config/ports.json` adalah SSOT — jangan edit manual, selalu pakai port-manager.
