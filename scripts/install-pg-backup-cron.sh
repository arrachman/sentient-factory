#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BACKUP_SCRIPT="${ROOT_DIR}/scripts/backup-postgres.sh"
CRON_SCHEDULE="${PG_BACKUP_CRON_SCHEDULE:-0 2 * * *}"
LOG_FILE="${ROOT_DIR}/backups/postgres/backup.log"
CRON_MARKER="# sentient-factory:postgres-daily-backup"
CRON_LINE="${CRON_SCHEDULE} ${BACKUP_SCRIPT} >> ${LOG_FILE} 2>&1 ${CRON_MARKER}"

if [[ ! -x "${BACKUP_SCRIPT}" ]]; then
  echo "Error: script backup tidak ditemukan atau tidak executable: ${BACKUP_SCRIPT}"
  exit 1
fi

mkdir -p "${ROOT_DIR}/backups/postgres"

EXISTING_CRON="$(crontab -l 2>/dev/null || true)"

FILTERED_CRON="$(printf '%s\n' "${EXISTING_CRON}" | sed '/sentient-factory:postgres-daily-backup/d')"
NEW_CRON="$(printf '%s\n%s\n' "${FILTERED_CRON}" "${CRON_LINE}" | sed '/^$/N;/^\n$/D')"

printf '%s\n' "${NEW_CRON}" | crontab -

echo "Cron backup PostgreSQL harian berhasil dipasang."
echo "Schedule: ${CRON_SCHEDULE}"
echo "Command : ${BACKUP_SCRIPT}"
echo "Log     : ${LOG_FILE}"
