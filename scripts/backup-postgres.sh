#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENV_FILE="${ROOT_DIR}/.env"
BACKUP_DIR="${ROOT_DIR}/backups/postgres"
CONTAINER_NAME="${PG_CONTAINER_NAME:-sentient-postgres-core}"
RETENTION_DAYS="${PG_BACKUP_RETENTION_DAYS:-7}"

# --- Kompresi ---
# PG_BACKUP_COMPRESSOR: zstd (default, ratio terbaik & cepat), gzip, none.
# Auto-fallback ke gzip bila compressor terpilih tidak terpasang.
COMPRESSOR="${PG_BACKUP_COMPRESSOR:-zstd}"
ZSTD_LEVEL="${PG_BACKUP_ZSTD_LEVEL:-10}"  # 10 = ~29% lebih kecil dari gzip-6, dekompresi cepat

# --- Upload ke Google Drive ---
ENABLE_GDRIVE_UPLOAD="${PG_GDRIVE_UPLOAD:-1}"
GDRIVE_REMOTE="${PG_GDRIVE_REMOTE:-gdrive-backup}"
GDRIVE_PATH="${PG_GDRIVE_PATH:-postgres-backup/sentient-core}"

# Resolusi kompresor -> (perintah kompresi, ekstensi file)
case "${COMPRESSOR}" in
  zstd)
    if command -v zstd >/dev/null 2>&1; then
      COMPRESS_CMD=(zstd "-${ZSTD_LEVEL}" -c); COMPRESS_EXT="zst"
    else
      echo "[backup] WARNING: zstd tidak ditemukan, fallback ke gzip" >&2
      COMPRESS_CMD=(gzip -9c); COMPRESS_EXT="gz"
    fi
    ;;
  gzip)
    COMPRESS_CMD=(gzip -9c); COMPRESS_EXT="gz"
    ;;
  none)
    COMPRESS_CMD=(cat); COMPRESS_EXT="sql"
    ;;
  *)
    echo "[backup] Error: PG_BACKUP_COMPRESSOR='${COMPRESSOR}' tidak dikenali (zstd|gzip|none)" >&2
    exit 1
    ;;
esac

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
OUTPUT_FILE="${BACKUP_DIR}/${POSTGRES_DB}_${TIMESTAMP}.sql.${COMPRESS_EXT}"

echo "[backup] Memulai backup PostgreSQL: ${POSTGRES_DB} (kompresi: ${COMPRESSOR})"

if docker exec -e PGPASSWORD="${POSTGRES_PASSWORD}" "${CONTAINER_NAME}" \
  pg_dump -U "${POSTGRES_USER}" -d "${POSTGRES_DB}" -h localhost | "${COMPRESS_CMD[@]}" > "${OUTPUT_FILE}"; then
  echo "[backup] Sukses: ${OUTPUT_FILE} ($(du -h "${OUTPUT_FILE}" | cut -f1))"
else
  rm -f "${OUTPUT_FILE}"
  echo "[backup] Gagal membuat backup"
  exit 1
fi

# --- Upload ke Google Drive (retensi lokal tetap, retensi GFS di gdrive dijalankan script terpisah) ---
if [[ "${ENABLE_GDRIVE_UPLOAD}" == "1" ]]; then
  if command -v rclone >/dev/null 2>&1; then
    echo "[backup] Upload ke Google Drive: ${GDRIVE_REMOTE}:${GDRIVE_PATH}/"
    if rclone copy \
        --transfers 2 --checkers 4 \
        --tpslimit 8 --tpslimit-burst 8 \
        --drive-pacer-min-sleep 100ms --drive-pacer-burst 1 \
        --retries 3 --low-level-retries 10 \
        --stats-one-line --stats-log-level NOTICE \
        "${OUTPUT_FILE}" "${GDRIVE_REMOTE}:${GDRIVE_PATH}/"; then
      echo "[backup] Upload sukses"
    else
      echo "[backup] WARNING: upload GDrive gagal (file lokal tetap ada). Cek token: rclone config reconnect ${GDRIVE_REMOTE}:" >&2
    fi
  else
    echo "[backup] WARNING: rclone tidak ditemukan, upload GDrive dilewati" >&2
  fi
fi

find "${BACKUP_DIR}" -type f \( -name '*.sql.gz' -o -name '*.sql.zst' \) -mtime "+${RETENTION_DAYS}" -print -delete >/dev/null 2>&1 || true

echo "[backup] Retensi lokal: file > ${RETENTION_DAYS} hari sudah dibersihkan"
