---
name: scripts
description: Skill untuk bekerja dengan scripts/ — kumpulan shell scripts untuk manajemen Vault, PostgreSQL backup, port manager, start/stop services, dan sinkronisasi env.
---

Kamu sedang bekerja di `scripts/` — automation scripts Sentient Factory.

## Daftar Scripts

| Script | Fungsi |
|--------|--------|
| `bootstrap-vault-dev.sh` | Inisialisasi HashiCorp Vault untuk development |
| `vault-login-dev.sh` | Login ke Vault & ambil auth token |
| `vault-approle-login.sh` | Login Vault via AppRole (untuk CI/production) |
| `render-vault-env.sh` | Render file `.env` dari secrets di Vault |
| `sync-env-file-to-vault.sh` | Upload `.env` file ke Vault |
| `cleanup-plain-env.sh` | Hapus `.env` plaintext setelah sync ke Vault |
| `docker-up-with-vault.sh` | Start Docker Compose dengan Vault secrets |
| `port-manager.js` | CLI untuk manajemen port assignments |
| `backup-postgres.sh` | Backup otomatis PostgreSQL |
| `install-pg-backup-cron.sh` | Install cron job untuk backup PostgreSQL |
| `mysql-access.sh` | Helper akses MySQL |
| `start-infra-on-boot.sh` | Start infra services saat boot |
| `stop-infra-on-boot.sh` | Stop infra services |

---

## Detail Per Script

### Vault Scripts

```bash
# 1. Bootstrap Vault (pertama kali setup)
bash scripts/bootstrap-vault-dev.sh

# 2. Login ke Vault
bash scripts/vault-login-dev.sh
# Output: VAULT_TOKEN tersimpan di ~/.vault-token

# 3. Render .env dari Vault
bash scripts/render-vault-env.sh
# Output: .env file di root project

# 4. Start Docker dengan Vault secrets
bash scripts/docker-up-with-vault.sh

# Sync .env yang sudah ada ke Vault
bash scripts/sync-env-file-to-vault.sh

# Hapus .env plaintext (setelah sync ke Vault)
bash scripts/cleanup-plain-env.sh
```

### `port-manager.js`
CLI untuk manajemen port di `config/ports.json`:
```bash
# Lihat semua port yang terdaftar
node scripts/port-manager.js list

# Tambah port baru
node scripts/port-manager.js add --name new-service --port 3220

# Cek konflik port
node scripts/port-manager.js check
```

### PostgreSQL Backup

```bash
# Manual backup
bash scripts/backup-postgres.sh

# Install cron job (backup otomatis harian)
bash scripts/install-pg-backup-cron.sh
# Backup tersimpan di backups/ folder
```

### MySQL Access
```bash
bash scripts/mysql-access.sh
# Shortcut untuk masuk ke MySQL dengan credentials dari .env
```

### Boot Scripts (systemd/production)
```bash
# Pasang sebagai startup service
bash scripts/start-infra-on-boot.sh

# Lepas dari startup
bash scripts/stop-infra-on-boot.sh
```

---

## Alur Setup Development (Pertama Kali)

```bash
# 1. Bootstrap Vault
bash scripts/bootstrap-vault-dev.sh

# 2. Login Vault
bash scripts/vault-login-dev.sh

# 3. Render .env
bash scripts/render-vault-env.sh

# 4. Start semua service (infra + apps) via Docker Compose
bash scripts/docker-up-with-vault.sh
```

## Alur Vault di Production

```bash
# Login via AppRole (tidak perlu password interaktif)
bash scripts/vault-approle-login.sh

# Render env
bash scripts/render-vault-env.sh

# Start services
bash scripts/docker-up-with-vault.sh
```
