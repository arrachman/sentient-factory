#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
DASH_DIR="$ROOT_DIR/dashboard-mapping"
OUT_DIR="$DASH_DIR/output"
TEMPLATE_ROOT="$DASH_DIR/sql-templates"

DOMAIN_FILE="$OUT_DIR/dashboard_01_domain_candidates.tsv"
KPI_FILE="$OUT_DIR/dashboard_02_kpi_candidates.tsv"
FILTER_FILE="$OUT_DIR/dashboard_03_filter_dimensions.tsv"
TS_FILE="$OUT_DIR/dashboard_04_timeseries_readiness.tsv"

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

require_file "$DOMAIN_FILE"
require_file "$KPI_FILE"
require_file "$FILTER_FILE"
require_file "$TS_FILE"

mkdir -p "$TEMPLATE_ROOT"

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

pick_metric_col() {
  local table_name="$1"
  local metric

  metric=$(awk -F'\t' -v t="$table_name" '
    NF >= 7 && $1 == t && $6 == "high" { print $2; exit }
  ' "$KPI_FILE" || true)

  if [[ -z "$metric" ]]; then
    metric=$(awk -F'\t' -v t="$table_name" '
      NF >= 7 && $1 == t { print $2; exit }
    ' "$KPI_FILE" || true)
  fi

  printf '%s' "$metric"
}

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

for domain in "${top_domains[@]}"; do
  domain="$(echo "$domain" | tr -d '[:space:]')"
  [[ -z "$domain" ]] && continue
  domain_name="$(domain_label "$domain")"

  domain_dir="$TEMPLATE_ROOT/$domain"
  mkdir -p "$domain_dir"

  table_file="$(mktemp)"
  trap 'rm -f "$table_file"' EXIT
  awk -F'\t' -v d="$domain" "$module_table_expr
    NF >= 1 {
      if (is_selected_module(\$1, d) || \$2 == d) print \$1
    }
  " "$DOMAIN_FILE" | sort -u > "$table_file"
  if [[ ! -s "$table_file" ]]; then
    echo "WARN: no tables found for domain/module '$domain', skip." >&2
    rm -f "$table_file"
    trap - EXIT
    continue
  fi

  summary_table=$(awk -F'\t' -v d="$domain" "$module_table_expr
    NF >= 3 {
      if (is_selected_module(\$1, d) || \$2 == d) printf \"%d\\t%s\\n\", \$3 + 0, \$1
    }
  " "$DOMAIN_FILE" | sort -t$'\t' -k1,1nr -k2,2 | awk -F'\t' 'NR == 1 { first = $2 } END { print first }')
  trends_table=$(awk -F'\t' 'NR == FNR {t[$1]=1; next} NF >= 6 && ($1 in t) && $6=="ready" {printf "%d\t%s\n", $2 + 0, $1}' "$table_file" "$TS_FILE" | sort -t$'\t' -k1,1nr -k2,2 | awk -F'\t' 'NR == 1 { first = $2 } END { print first }')

  kpi_line=$(awk -F'\t' 'NR == FNR {t[$1]=1; next} NF >= 7 && ($1 in t) && $6=="high" {printf "%s\t%s\n", $1, $2; exit}' "$table_file" "$KPI_FILE" || true)
  if [[ -z "$kpi_line" ]]; then
    kpi_line=$(awk -F'\t' 'NR == FNR {t[$1]=1; next} NF >= 7 && ($1 in t) {printf "%s\t%s\n", $1, $2; exit}' "$table_file" "$KPI_FILE" || true)
  fi

  filter_line=$(awk -F'\t' 'NR == FNR {t[$1]=1; next} NF >= 6 && ($1 in t) {printf "%s\t%s\n", $1, $2; exit}' "$table_file" "$FILTER_FILE" || true)

  metric_table="${summary_table:-$domain}"
  metric_col=""
  if [[ -n "$kpi_line" ]]; then
    metric_table="${kpi_line%%$'\t'*}"
    metric_col="${kpi_line#*$'\t'}"
  else
    metric_col="$(pick_metric_col "$metric_table")"
  fi

  filter_table="$metric_table"
  filter_col="status"
  if [[ -n "$filter_line" ]]; then
    filter_table="${filter_line%%$'\t'*}"
    filter_col="${filter_line#*$'\t'}"
  fi

  trend_table="${trends_table:-$metric_table}"
  trend_metric_col="$(pick_metric_col "$trend_table")"
  breakdown_metric_col="$(pick_metric_col "$filter_table")"

  if [[ -z "$trend_metric_col" ]]; then
    trend_metric_expr="0"
  else
    trend_metric_expr="COALESCE(\`$trend_metric_col\`, 0)"
  fi

  if [[ -z "$breakdown_metric_col" ]]; then
    breakdown_metric_expr="0"
  else
    breakdown_metric_expr="COALESCE(\`$breakdown_metric_col\`, 0)"
  fi

  if [[ -z "$metric_col" ]]; then
    summary_metric_expr="0"
  else
    summary_metric_expr="COALESCE(\`$metric_col\`, 0)"
  fi

  order_col="id"
  if [[ -n "$metric_col" ]]; then
    order_col="$metric_col"
  fi

  cat > "$domain_dir/README.md" <<MD
# SQL Templates - Domain $domain ($domain_name)

Template SQL ini adalah draft awal dari hasil dashboard mapping otomatis.

## Files
- summary.sql
- trends.sql
- breakdown.sql
- table.sql

## Placeholder Params
- :from_date (DATE)
- :to_date (DATE)
- :group_by (dimension column)
- :limit (INT)
- :offset (INT)

## Current Auto Picks
- domain_name: $domain_name
- primary_table: $summary_table
- metric_source: $metric_table.${metric_col:-<count_only>}
- trend_source: $trend_table.${trend_metric_col:-<count_only>}
- filter_source: $filter_table.$filter_col
- breakdown_metric_source: $filter_table.${breakdown_metric_col:-<count_only>}

Template sudah dibuat valid secara default (tanpa filter tanggal). Tambahkan kolom tanggal aktual pada baris komentar DATE(<date_column>) sebelum dipakai di production query.
MD

  cat > "$domain_dir/summary.sql" <<SQL
-- Domain: $domain
-- Purpose: KPI cards summary
-- Suggested metric source: $metric_table.${metric_col:-<count_only>}

SELECT
  COUNT(*) AS total_rows,
  SUM($summary_metric_expr) AS total_metric,
  AVG($summary_metric_expr) AS avg_metric,
  MIN($summary_metric_expr) AS min_metric,
  MAX($summary_metric_expr) AS max_metric
FROM \`$metric_table\`
WHERE 1=1
AND DATE(__DATE_EXPR__) BETWEEN :from_date AND :to_date;
SQL

  cat > "$domain_dir/trends.sql" <<SQL
-- Domain: $domain
-- Purpose: time-series trend
-- Suggested source table: $trend_table

SELECT
  DATE(__DATE_EXPR__) AS period_date,
  COUNT(*) AS total_rows,
  SUM($trend_metric_expr) AS total_metric
FROM \`$trend_table\`
WHERE 1=1
AND DATE(__DATE_EXPR__) BETWEEN :from_date AND :to_date
GROUP BY period_date
ORDER BY period_date ASC;
SQL

  cat > "$domain_dir/breakdown.sql" <<SQL
-- Domain: $domain
-- Purpose: grouped breakdown chart
-- Suggested filter source: $filter_table.$filter_col

SELECT
  COALESCE(CAST(\`__GROUP_BY__\` AS CHAR), 'UNKNOWN') AS group_key,
  COUNT(*) AS total_rows,
  SUM($breakdown_metric_expr) AS total_metric
FROM \`$filter_table\`
WHERE 1=1
AND DATE(__DATE_EXPR__) BETWEEN :from_date AND :to_date
GROUP BY group_key
ORDER BY total_metric DESC, total_rows DESC;
SQL

  cat > "$domain_dir/table.sql" <<SQL
-- Domain: $domain
-- Purpose: table detail for dashboard
-- Suggested source table: $metric_table

SELECT
  *
FROM \`$metric_table\`
WHERE 1=1
AND DATE(__DATE_EXPR__) BETWEEN :from_date AND :to_date
ORDER BY \`__ORDER_BY__\` __ORDER_DIR__
LIMIT :limit OFFSET :offset;
SQL

  rm -f "$table_file"
  trap - EXIT

done

echo "SQL templates generated under: $TEMPLATE_ROOT"
