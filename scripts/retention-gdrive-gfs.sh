#!/usr/bin/env bash
#
# Retensi GFS (Grandfather-Father-Son) untuk backup PostgreSQL di Google Drive.
#
# Kebijakan:
#   1. Hapus file backup berusia > 30 hari (H-30) ... KECUALI:
#   2. Simpan 1 backup per bulan (file tanggal 1) -> arsip bulanan.
#   3. Simpan 1 backup per tahun (file 1 Januari)  -> arsip tahunan (sudah termasuk aturan #2).
#
# Tanggal diambil dari NAMA file (format *_YYYYMMDD_HHMMSS.sql.{gz,zst}) supaya deterministik
# terlepas dari mtime yang diset GDrive saat upload.
#
# Aman: hanya menghapus file `.sql.gz` / `.sql.zst` di folder tujuan. Tidak menyentuh path lain.

set -euo pipefail

REMOTE="${PG_GDRIVE_REMOTE:-gdrive-backup}"
REMOTE_PATH="${PG_GDRIVE_PATH:-postgres-backup/sentient-core}"
RETENTION_DAYS="${PG_GFS_RETENTION_DAYS:-30}"

if ! command -v rclone >/dev/null 2>&1; then
  echo "[gfs] Error: rclone tidak ditemukan." >&2
  exit 1
fi

NOW_EPOCH="$(date +%s)"
REMOTE_TARGET="${REMOTE}:${REMOTE_PATH}"

echo "[gfs] Mengevaluasi retensi di ${REMOTE_TARGET} (retensi harian = ${RETENTION_DAYS} hari)"

# Ambil daftar file backup (gzip & zstd). Abaikan jika remote/folder belum ada.
mapfile -t FILES < <(rclone lsf "${REMOTE_TARGET}" --include '*.sql.gz' --include '*.sql.zst' 2>/dev/null || true)

if [[ "${#FILES[@]}" -eq 0 ]]; then
  echo "[gfs] Tidak ada file backup di remote. Selesai."
  exit 0
fi

DEL_TMP="$(mktemp)"
trap 'rm -f "${DEL_TMP}"' EXIT

kept=0
monthly=0
deleted=0

for fname in "${FILES[@]}"; do
  # Ekstrak YYYYMMDD dari pola *_YYYYMMDD_HHMMSS.sql.gz
  datesig="$(printf '%s' "${fname}" | grep -oE '[0-9]{8}_[0-9]{6}' | head -n1 | cut -d_ -f1)"
  if [[ -z "${datesig}" || "${#datesig}" -ne 8 ]]; then
    echo "[gfs] Lewati (format tanggal tidak dikenali): ${fname}"
    continue
  fi

  YYYY="${datesig:0:4}"
  MM="${datesig:4:2}"
  DD="${datesig:6:2}"

  if ! file_epoch="$(date -d "${YYYY}-${MM}-${DD}" +%s 2>/dev/null)"; then
    echo "[gfs] Lewati (tanggal invalid): ${fname}"
    continue
  fi

  age_days=$(( (NOW_EPOCH - file_epoch) / 86400 ))

  # Aturan simpan:
  #   - masih dalam retensi harian (<= 30 hari), atau
  #   - arsip bulanan (tanggal 1) -> otomatis mencakup arsip tahunan (1 Jan).
  if (( age_days <= RETENTION_DAYS )); then
    kept=$((kept + 1))
    continue
  fi
  if [[ "${DD}" == "01" ]]; then
    if [[ "${MM}" == "01" ]]; then
      echo "[gfs] Simpan (arsip TAHUNAN ${YYYY}-01-01): ${fname}"
    else
      echo "[gfs] Simpan (arsip bulanan ${YYYY}-${MM}-01): ${fname}"
    fi
    monthly=$((monthly + 1))
    continue
  fi

  # Lebih dari 30 hari dan bukan tanggal 1 -> hapus
  echo "[gfs] Hapus (berusia ${age_days} hari): ${fname}"
  printf '%s\n' "${fname}" >> "${DEL_TMP}"
  deleted=$((deleted + 1))
done

if [[ "${deleted}" -gt 0 ]]; then
  echo "[gfs] Menghapus ${deleted} file via rclone --files-from ..."
  if ! rclone delete "${REMOTE_TARGET}" --files-from "${DEL_TMP}"; then
    echo "[gfs] ERROR: rclone delete gagal. Cek token: rclone config reconnect ${REMOTE}:" >&2
    exit 1
  fi
fi

echo "[gfs] Selesai. Harian disimpan: ${kept} | Arsip bulanan/tahunan: ${monthly} | Dihapus: ${deleted}"
