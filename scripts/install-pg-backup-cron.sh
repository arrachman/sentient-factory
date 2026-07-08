#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BACKUP_SCRIPT="${ROOT_DIR}/scripts/backup-postgres.sh"
RETENTION_SCRIPT="${ROOT_DIR}/scripts/retention-gdrive-gfs.sh"

# Schedule
BACKUP_CRON="${PG_BACKUP_CRON_SCHEDULE:-0 1 * * *}"     # harian 01:00
RETENTION_CRON="${PG_GFS_CRON_SCHEDULE:-30 1 * * *}"    # harian 01:30 (setelah backup + upload)

LOG_DIR="${ROOT_DIR}/backups/postgres"
BACKUP_LOG="${LOG_DIR}/backup.log"
RETENTION_LOG="${LOG_DIR}/retention-gfs.log"

BACKUP_MARKER="# sentient-factory:postgres-daily-backup"
RETENTION_MARKER="# sentient-factory:postgres-gfs-retention"

BACKUP_LINE="${BACKUP_CRON} ${BACKUP_SCRIPT} >> ${BACKUP_LOG} 2>&1 ${BACKUP_MARKER}"
RETENTION_LINE="${RETENTION_CRON} ${RETENTION_SCRIPT} >> ${RETENTION_LOG} 2>&1 ${RETENTION_MARKER}"

for s in "${BACKUP_SCRIPT}" "${RETENTION_SCRIPT}"; do
  if [[ ! -x "${s}" ]]; then
    echo "Error: script tidak ditemukan/tidak executable: ${s}"
    exit 1
  fi
done

mkdir -p "${LOG_DIR}"

EXISTING_CRON="$(crontab -l 2>/dev/null || true)"

# Hapus baris lama (idempotent) lalu tambahkan yang baru
FILTERED_CRON="$(printf '%s\n' "${EXISTING_CRON}" | sed '/sentient-factory:postgres-daily-backup/d;/sentient-factory:postgres-gfs-retention/d')"
NEW_CRON="$(printf '%s\n%s\n%s\n' "${FILTERED_CRON}" "${BACKUP_LINE}" "${RETENTION_LINE}" | sed '/^$/N;/^\n$/D')"

printf '%s\n' "${NEW_CRON}" | crontab -

# --- Pasang logrotate (butuh sudo) ---
LOGROTATE_SRC="${ROOT_DIR}/scripts/logrotate-pg-backup.conf"
LOGROTATE_DST="/etc/logrotate.d/sentient-factory-pg-backup"
if [[ -f "${LOGROTATE_SRC}" ]]; then
  if sudo install -m 644 "${LOGROTATE_SRC}" "${LOGROTATE_DST}" 2>/dev/null; then
    echo "Logrotate terpasang: ${LOGROTATE_DST}"
    sudo logrotate "${LOGROTATE_DST}" -d >/dev/null 2>&1 && true
  else
    echo "WARNING: gagal pasang logrotate (butuh sudo). Pasang manual:" >&2
    echo "  sudo install -m 644 ${LOGROTATE_SRC} ${LOGROTATE_DST}" >&2
  fi
fi

echo "Cron backup + retensi GFS PostgreSQL berhasil dipasang."
echo "  Backup    : ${BACKUP_CRON}  -> ${BACKUP_LOG}"
echo "  Retensi   : ${RETENTION_CRON} -> ${RETENTION_LOG}"
