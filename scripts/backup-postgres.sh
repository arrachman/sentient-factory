#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENV_FILE="${ROOT_DIR}/.env"
BACKUP_DIR="${ROOT_DIR}/backups/postgres"
CONTAINER_NAME="${PG_CONTAINER_NAME:-sentient-postgres-core}"
RETENTION_DAYS="${PG_BACKUP_RETENTION_DAYS:-7}"

if [[ -f "${ENV_FILE}" ]]; then
  # shellcheck disable=SC1090
  source "${ENV_FILE}"
fi

POSTGRES_DB="${POSTGRES_DB:-}"
POSTGRES_USER="${POSTGRES_USER:-}"
POSTGRES_PASSWORD="${POSTGRES_PASSWORD:-}"

if [[ -z "${POSTGRES_DB}" || -z "${POSTGRES_USER}" || -z "${POSTGRES_PASSWORD}" ]]; then
  echo "Error: POSTGRES_DB, POSTGRES_USER, atau POSTGRES_PASSWORD tidak ditemukan di .env"
  exit 1
fi

if ! command -v docker >/dev/null 2>&1; then
  echo "Error: docker tidak ditemukan di sistem."
  exit 1
fi

if ! docker ps --format '{{.Names}}' | grep -Fxq "${CONTAINER_NAME}"; then
  echo "Error: container '${CONTAINER_NAME}' tidak berjalan. Jalankan docker compose terlebih dahulu."
  exit 1
fi

mkdir -p "${BACKUP_DIR}"
TIMESTAMP="$(date '+%Y%m%d_%H%M%S')"
OUTPUT_FILE="${BACKUP_DIR}/${POSTGRES_DB}_${TIMESTAMP}.sql.gz"

echo "[backup] Memulai backup PostgreSQL: ${POSTGRES_DB}"

if docker exec -e PGPASSWORD="${POSTGRES_PASSWORD}" "${CONTAINER_NAME}" \
  pg_dump -U "${POSTGRES_USER}" -d "${POSTGRES_DB}" -h localhost | gzip > "${OUTPUT_FILE}"; then
  echo "[backup] Sukses: ${OUTPUT_FILE}"
else
  rm -f "${OUTPUT_FILE}"
  echo "[backup] Gagal membuat backup"
  exit 1
fi

find "${BACKUP_DIR}" -type f -name '*.sql.gz' -mtime "+${RETENTION_DAYS}" -print -delete >/dev/null 2>&1 || true

echo "[backup] Retensi: file > ${RETENTION_DAYS} hari sudah dibersihkan"
