#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
DASH_DIR="$ROOT_DIR/dashboard-mapping"
OUT_DIR="$DASH_DIR/output"
SUMMARY_FILE="$OUT_DIR/dashboard_summary.md"

DOMAIN_FILE="$OUT_DIR/dashboard_01_domain_candidates.tsv"
KPI_FILE="$OUT_DIR/dashboard_02_kpi_candidates.tsv"
FILTER_FILE="$OUT_DIR/dashboard_03_filter_dimensions.tsv"
TS_FILE="$OUT_DIR/dashboard_04_timeseries_readiness.tsv"
HUB_FILE="$OUT_DIR/dashboard_05_join_hubs.tsv"

domain_label() {
  local domain="$1"
  case "$domain" in
    m2) echo "Finance & Accounting" ;;
    *) echo "$domain" ;;
  esac
}

require_file() {
  local f="$1"
  if [[ ! -f "$f" ]]; then
    echo "ERROR: missing file: $f" >&2
    echo "Run export first: ./dashboard-mapping/scripts/export_dashboard_mapping.sh" >&2
    exit 1
  fi
}

count_lines() {
  local f="$1"
  if [[ -s "$f" ]]; then
    wc -l < "$f" | tr -d ' '
  else
    echo 0
  fi
}

require_file "$DOMAIN_FILE"
require_file "$KPI_FILE"
require_file "$FILTER_FILE"
require_file "$TS_FILE"
require_file "$HUB_FILE"

mkdir -p "$OUT_DIR"

{
  echo "# Dashboard Mapping Summary"
  echo
  echo "Generated at: $(date -u +"%Y-%m-%d %H:%M:%S UTC")"
  echo
  echo "## Snapshot"
  echo "- Domain candidates: $(count_lines "$DOMAIN_FILE") rows"
  echo "- KPI candidates: $(count_lines "$KPI_FILE") rows"
  echo "- Filter dimension candidates: $(count_lines "$FILTER_FILE") rows"
  echo "- Time-series readiness rows: $(count_lines "$TS_FILE") rows"
  echo "- Join hubs (FK + heuristic): $(count_lines "$HUB_FILE") rows"
  echo

  echo "## Top Domain Prefixes"
  top_domain_lines=$(awk -F'\t' '
    NF >= 2 {
      d = $2
      if (d == "" || d == "NULL") d = "unknown"
      c[d]++
      approx[d] += ($3 + 0)
      numeric[d] += ($5 + 0)
      dimhint[d] += ($6 + 0)
    }
    END {
      for (d in c) {
        printf "%d\t%s\t%d\t%d\t%d\n", c[d], d, approx[d], numeric[d], dimhint[d]
      }
    }
  ' "$DOMAIN_FILE" | sort -t$'\t' -k1,1nr -k2,2 | awk 'NR <= 10 { print }')
  if [[ -n "$top_domain_lines" ]]; then
    rank=0
    while IFS=$'\t' read -r table_count domain approx_rows numeric_cols dimhint_count; do
      [[ -z "${domain:-}" ]] && continue
      rank=$((rank + 1))
      domain_name="$(domain_label "$domain")"
      printf "%d. \`%s\` (%s, %d tables, approx_rows=%d, numeric_cols=%d, dimension_hints=%d)\n" \
        "$rank" "$domain" "$domain_name" "$table_count" "$approx_rows" "$numeric_cols" "$dimhint_count"
    done <<< "$top_domain_lines"
  fi
  echo

  echo "## KPI Priority"
  awk -F'\t' '
    NF >= 6 { p[$6]++ }
    END {
      printf "- high: %d\n", p["high"] + 0
      printf "- medium: %d\n", p["medium"] + 0
      printf "- low: %d\n", p["low"] + 0
    }
  ' "$KPI_FILE"
  echo

  echo "### Tables With Most High-Priority KPI Columns"
  high_table_lines=$(awk -F'\t' 'NF >= 6 && $6 == "high" { c[$1]++ } END { for (t in c) printf "%d\t%s\n", c[t], t }' "$KPI_FILE" | sort -t$'\t' -k1,1nr -k2,2 | awk 'NR <= 10 { print }')
  if [[ -n "$high_table_lines" ]]; then
    printf "%s\n" "$high_table_lines" | awk -F'\t' '{ printf "%d. `%s` (%d high KPI columns)\n", NR, $2, $1 }'
  else
    echo "- Tidak ada kolom KPI priority=high yang terdeteksi."
  fi
  echo

  echo "## Filter Dimensions"
  awk -F'\t' '
    NF >= 6 { c[$6]++ }
    END {
      for (k in c) printf "%d\t%s\n", c[k], k
    }
  ' "$FILTER_FILE" | sort -t$'\t' -k1,1nr -k2,2 | awk -F'\t' '{ printf "- %s: %d columns\n", $2, $1 }'
  echo

  echo "## Time-Series Readiness"
  awk -F'\t' '
    NF >= 6 { c[$6]++ }
    END {
      printf "- ready: %d\n", c["ready"] + 0
      printf "- partial: %d\n", c["partial"] + 0
      printf "- not_ready: %d\n", c["not_ready"] + 0
    }
  ' "$TS_FILE"
  echo

  echo "### Largest Ready Tables"
  ready_lines=$(awk -F'\t' 'NF >= 6 && $6 == "ready" { printf "%d\t%s\n", $2 + 0, $1 }' "$TS_FILE" | sort -t$'\t' -k1,1nr -k2,2 | awk 'NR <= 10 { print }')
  if [[ -n "$ready_lines" ]]; then
    printf "%s\n" "$ready_lines" | awk -F'\t' '{ printf "%d. `%s` (approx_rows=%d)\n", NR, $2, $1 }'
  else
    echo "- Tidak ada tabel dengan status ready."
  fi
  echo

  echo "## Join Hubs"
  hub_lines=$(awk -F'\t' '
    NF >= 3 {
      hub = $1
      fk = $2 + 0
      ref = $3 + 0
      soft = (NF >= 4 ? $4 + 0 : 0)
      total = fk + soft
      printf "%d\t%s\t%d\t%d\t%d\n", total, hub, fk, soft, ref
    }
  ' "$HUB_FILE" | sort -t$'\t' -k1,1nr -k2,2 | awk 'NR <= 10 { print }')
  if [[ -n "$hub_lines" ]]; then
    printf "%s\n" "$hub_lines" | awk -F'\t' '{ printf "%d. `%s` (total_links=%d, inbound_fk=%d, soft_links=%d, referring_tables=%d)\n", NR, $2, $1, $3, $4, $5 }'
  else
    echo "- Tidak ada hub yang terdeteksi dari FK maupun heuristic _id."
  fi
  echo

  echo "## Next Actions"
  echo "1. Prioritaskan 3 domain teratas pada bagian Top Domain Prefixes sebagai kandidat dashboard v1."
  echo "2. Pilih 5-10 tabel dari bagian Largest Ready Tables untuk metric time-series awal."
  echo "3. Jika Join Hubs kosong, dokumentasikan relasi aplikasi-level (soft relation) di luar FK database."
} > "$SUMMARY_FILE"

echo "Summary generated: $SUMMARY_FILE"
