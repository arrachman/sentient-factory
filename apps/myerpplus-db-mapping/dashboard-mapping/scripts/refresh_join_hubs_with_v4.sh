#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
DASH_DIR="$ROOT_DIR/dashboard-mapping"
OUT_DIR="$DASH_DIR/output"

SQL_HUB_FILE="${1:-$OUT_DIR/dashboard_05_join_hubs.tsv}"
REL_SCORED_FILE="${2:-$OUT_DIR/myerpplus_heuristic_relations_v4_scored.tsv}"
OUT_FILE="${3:-$OUT_DIR/dashboard_05_join_hubs.tsv}"
FALLBACK_FILE="$OUT_DIR/dashboard_05_join_hubs_v4.tsv"
TMP_MERGED="$(mktemp)"

cleanup() {
  rm -f "$TMP_MERGED"
}
trap cleanup EXIT

if [[ ! -f "$REL_SCORED_FILE" ]]; then
  echo "ERROR: missing scored relations file: $REL_SCORED_FILE" >&2
  exit 1
fi

if [[ ! -f "$SQL_HUB_FILE" ]]; then
  : > "$SQL_HUB_FILE"
fi

# Build fallback join hubs from v4 relations (high/medium confidence).
awk -F'\t' '
  $8 == "high" || $8 == "medium" {
    hub = $5
    src = $1
    soft[hub]++
    k = hub SUBSEP src
    if (!(k in seen)) {
      seen[k] = 1
      ref_count[hub]++
      if (sample[hub] == "") sample[hub] = src
      else sample[hub] = sample[hub] ", " src
    }
  }
  END {
    for (h in soft) {
      printf "%s\t0\t%d\t%d\t%s\n", h, ref_count[h] + 0, soft[h] + 0, sample[h]
    }
  }
' "$REL_SCORED_FILE" | sort -t$'\t' -k1,1 > "$FALLBACK_FILE"

# Merge SQL hub rows with v4 fallback rows.
awk -F'\t' '
function trim(s) {
  gsub(/^[[:space:]]+|[[:space:]]+$/, "", s)
  return s
}
function add_sample(hub, sample_str,  n, i, arr, x, k) {
  n = split(sample_str, arr, /,[[:space:]]*/)
  for (i = 1; i <= n; i++) {
    x = trim(arr[i])
    if (x == "") continue
    k = hub SUBSEP x
    if (!(k in ref_seen)) {
      ref_seen[k] = 1
      ref_count[hub]++
      if (sample_out[hub] == "") sample_out[hub] = x
      else sample_out[hub] = sample_out[hub] ", " x
    }
  }
}

FNR == NR {
  if (NF < 1) next
  hub = $1
  fk[hub] += ($2 + 0)
  soft[hub] += ($4 + 0)
  if (($3 + 0) > ref_floor[hub]) ref_floor[hub] = ($3 + 0)
  add_sample(hub, $5)
  hubs[hub] = 1
  next
}

{
  if (NF < 1) next
  hub = $1
  fk[hub] += ($2 + 0)
  soft[hub] += ($4 + 0)
  if (($3 + 0) > ref_floor[hub]) ref_floor[hub] = ($3 + 0)
  add_sample(hub, $5)
  hubs[hub] = 1
}

END {
  for (hub in hubs) {
    refs = ref_count[hub] + 0
    if (ref_floor[hub] > refs) refs = ref_floor[hub]
    printf "%s\t%d\t%d\t%d\t%s\n", hub, fk[hub] + 0, refs, soft[hub] + 0, sample_out[hub]
  }
}
' "$SQL_HUB_FILE" "$FALLBACK_FILE" > "$TMP_MERGED"

sort -t$'\t' -k2,2nr -k4,4nr -k3,3nr -k1,1 "$TMP_MERGED" > "$OUT_FILE"

echo "Generated:"
echo "- $FALLBACK_FILE"
echo "- $OUT_FILE"
