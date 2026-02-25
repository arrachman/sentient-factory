#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
DASH_DIR="$ROOT_DIR/dashboard-mapping"
OUT_DIR="$DASH_DIR/output"
SPEC_DIR="$OUT_DIR/specs"

DOMAIN_FILE="$OUT_DIR/dashboard_01_domain_candidates.tsv"
KPI_FILE="$OUT_DIR/dashboard_02_kpi_candidates.tsv"
FILTER_FILE="$OUT_DIR/dashboard_03_filter_dimensions.tsv"
TS_FILE="$OUT_DIR/dashboard_04_timeseries_readiness.tsv"
INDEX_FILE="$OUT_DIR/dashboard_spec_index.md"

require_file() {
  local f="$1"
  if [[ ! -f "$f" ]]; then
    echo "ERROR: missing file: $f" >&2
    echo "Run export first: ./dashboard-mapping/scripts/export_dashboard_mapping.sh" >&2
    exit 1
  fi
}

require_file "$DOMAIN_FILE"
require_file "$KPI_FILE"
require_file "$FILTER_FILE"
require_file "$TS_FILE"

mkdir -p "$SPEC_DIR"

target_modules="${TARGET_MODULES:-}"

module_table_expr='
function is_selected_module(tbl, key,    n) {
  if (key ~ /^m[1-9]$/) return tbl ~ ("^" key "_")
  if (key ~ /^m1[0-2]$/) {
    n = substr(key, 2)
    return tbl ~ ("^m_" n "_")
  }
  return 0
}
'

if [[ -n "$target_modules" ]]; then
  IFS=',' read -r -a top_domains <<< "$target_modules"
else
  mapfile -t top_domains < <(
    awk -F'\t' '
      NF >= 2 {
        d = $2
        if (d == "" || d == "NULL") d = "unknown"
        c[d]++
      }
      END {
        for (d in c) printf "%d\t%s\n", c[d], d
      }
    ' "$DOMAIN_FILE" | sort -t$'\t' -k1,1nr -k2,2 | awk -F'\t' 'NR <= 3 { print $2 }'
  )
fi

if [[ ${#top_domains[@]} -eq 0 ]]; then
  echo "ERROR: unable to detect top domains from $DOMAIN_FILE" >&2
  exit 1
fi

{
  echo "# Dashboard Spec Index"
  echo
  echo "Generated at: $(date -u +"%Y-%m-%d %H:%M:%S UTC")"
  echo
  echo "Top domains selected:"
} > "$INDEX_FILE"

idx=0
for domain in "${top_domains[@]}"; do
  domain="$(echo "$domain" | tr -d '[:space:]')"
  [[ -z "$domain" ]] && continue
  idx=$((idx + 1))

  spec_file="$SPEC_DIR/${idx}_${domain}_dashboard_spec.md"
  table_file="$(mktemp)"
  trap 'rm -f "$table_file"' EXIT

  awk -F'\t' -v d="$domain" "$module_table_expr
    NF >= 1 {
      if (is_selected_module(\$1, d) || \$2 == d) print \$1
    }
  " "$DOMAIN_FILE" | sort -u > "$table_file"

  table_count=$(wc -l < "$table_file" | tr -d ' ')
  if [[ "$table_count" -eq 0 ]]; then
    echo "WARN: no tables found for domain/module '$domain', skip." >&2
    rm -f "$table_file"
    trap - EXIT
    continue
  fi

  {
    echo "# Dashboard Spec - Domain $domain"
    echo
    echo "Generated at: $(date -u +"%Y-%m-%d %H:%M:%S UTC")"
    echo
    echo "## Scope"
    echo "- Domain prefix: $domain"
    echo "- Candidate tables: $table_count"
    echo

    echo "## Candidate Tables (Top 15 by Approx Rows)"
    awk -F'\t' -v d="$domain" "$module_table_expr
      NF >= 3 {
        if (is_selected_module(\$1, d) || \$2 == d) printf \"%d\\t%s\\n\", \$3 + 0, \$1
      }
    " "$DOMAIN_FILE" \
      | sort -t$'\t' -k1,1nr -k2,2 | awk 'NR <= 15 { print }' \
      | awk -F'\t' '{printf "%d. %s (approx_rows=%d)\n", NR, $2, $1}'
    echo

    echo "## Recommended KPI Fields (Top 20 High/Medium)"
    awk -F'\t' 'NR == FNR {t[$1]=1; next} NF >= 7 && ($1 in t) {prio=($6=="high"?1:($6=="medium"?2:3)); printf "%d\t%s\t%s\t%s\t%s\n", prio, $1, $2, $6, $7}' "$table_file" "$KPI_FILE" \
      | sort -t$'\t' -k1,1n -k2,2 -k3,3 | awk 'NR <= 20 { print }' \
      | awk -F'\t' '{printf "%d. %s.%s (priority=%s, agg=%s)\n", NR, $2, $3, $4, $5}'
    echo

    echo "## Recommended Filters (Top 20)"
    awk -F'\t' 'NR == FNR {t[$1]=1; next} NF >= 6 && ($1 in t) {printf "%s\t%s\t%s\n", $1, $2, $6}' "$table_file" "$FILTER_FILE" \
      | awk 'NR <= 20 { print }' \
      | awk -F'\t' '{printf "%d. %s.%s (group=%s)\n", NR, $1, $2, $3}'
    echo

    echo "## Time-Series Ready Tables (Top 10)"
    awk -F'\t' 'NR == FNR {t[$1]=1; next} NF >= 6 && ($1 in t) && $6 == "ready" {printf "%d\t%s\t%s\t%s\n", $2 + 0, $1, $3, $4}' "$table_file" "$TS_FILE" \
      | sort -t$'\t' -k1,1nr -k2,2 | awk 'NR <= 10 { print }' \
      | awk -F'\t' '{printf "%d. %s (approx_rows=%d, date_cols=%s, numeric_cols=%s)\n", NR, $2, $1, $3, $4}'
    echo

    echo "## Draft Visuals"
    echo "1. KPI cards: 3-5 metrik dari bagian Recommended KPI Fields (priority=high)."
    echo "2. Trend chart: 1-2 metrik time-series dari tabel largest ready."
    echo "3. Breakdown chart: group by filter status/classification/actor sesuai domain."
    echo "4. Table detail: top 50 records dengan sort by tanggal terbaru."
    echo

    echo "## API Draft (Suggested)"
    echo "- GET /api/dashboard/$domain/summary"
    echo "- GET /api/dashboard/$domain/trends?from=YYYY-MM-DD&to=YYYY-MM-DD"
    echo "- GET /api/dashboard/$domain/breakdown?group_by=<dimension>"
    echo "- GET /api/dashboard/$domain/table?page=1&page_size=50"
    echo

    echo "## Implementation Notes"
    echo "- Validasi ulang nama kolom tanggal utama per tabel sebelum implement query final."
    echo "- Prioritaskan indeks di kolom tanggal + kolom filter dominan untuk performa."
    echo "- Jika relasi lintas tabel tidak ada FK, dokumentasikan join key di service layer."
  } > "$spec_file"

  echo "- $idx. $domain: dashboard-mapping/output/specs/$(basename "$spec_file")" >> "$INDEX_FILE"

  rm -f "$table_file"
  trap - EXIT
done

echo "Spec index generated: $INDEX_FILE"
echo "Spec files generated in: $SPEC_DIR"
