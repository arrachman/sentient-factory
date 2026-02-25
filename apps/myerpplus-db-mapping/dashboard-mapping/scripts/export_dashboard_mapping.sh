#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
DASH_DIR="$ROOT_DIR/dashboard-mapping"
QUERY_DIR="$DASH_DIR/queries"
OUT_DIR="$DASH_DIR/output"

MYSQL_CONTAINER="${MYSQL_CONTAINER:-mysql}"
MYSQL_USER="${MYSQL_USER:-root}"
MYSQL_PASSWORD="${MYSQL_PASSWORD:-}"
MYSQL_DATABASE="${MYSQL_DATABASE:-myerpplus}"

if [[ -z "$MYSQL_PASSWORD" ]]; then
  echo "ERROR: set MYSQL_PASSWORD env var first." >&2
  echo "Example: MYSQL_PASSWORD='your_pass' $0" >&2
  exit 1
fi

mkdir -p "$OUT_DIR"

run_query() {
  local out_name="$1"
  local sql_file="$2"
  local schema_escaped

  schema_escaped="$(printf '%s' "$MYSQL_DATABASE" | sed 's/[\/&]/\\&/g')"

  sed "s/__DB_SCHEMA__/$schema_escaped/g" "$sql_file" | \
    docker exec -i "$MYSQL_CONTAINER" \
      mysql -N -B -u"$MYSQL_USER" -p"$MYSQL_PASSWORD" "$MYSQL_DATABASE" \
      > "$OUT_DIR/$out_name.tsv"
}

run_query "dashboard_01_domain_candidates" "$QUERY_DIR/01_domain_candidates.sql"
run_query "dashboard_02_kpi_candidates" "$QUERY_DIR/02_kpi_candidates.sql"
run_query "dashboard_03_filter_dimensions" "$QUERY_DIR/03_filter_dimensions.sql"
run_query "dashboard_04_timeseries_readiness" "$QUERY_DIR/04_timeseries_readiness.sql"
run_query "dashboard_05_join_hubs" "$QUERY_DIR/05_join_hubs.sql"

if [[ -f "$OUT_DIR/myerpplus_all_tables.tsv" && -f "$OUT_DIR/myerpplus_all_columns.tsv" ]]; then
  if [[ -x "$DASH_DIR/scripts/generate_heuristic_relations_v4.sh" && -x "$DASH_DIR/scripts/generate_heuristic_confidence.sh" && -x "$DASH_DIR/scripts/refresh_join_hubs_with_v4.sh" ]]; then
    "$DASH_DIR/scripts/generate_heuristic_relations_v4.sh" >/dev/null
    "$DASH_DIR/scripts/generate_heuristic_confidence.sh" \
      "$OUT_DIR/myerpplus_heuristic_relations_v4.tsv" \
      "$OUT_DIR/myerpplus_heuristic_relations_v4_scored.tsv" \
      "$OUT_DIR/myerpplus_heuristic_relations_v4_confidence_summary.md" >/dev/null
    "$DASH_DIR/scripts/refresh_join_hubs_with_v4.sh" \
      "$OUT_DIR/dashboard_05_join_hubs.tsv" \
      "$OUT_DIR/myerpplus_heuristic_relations_v4_scored.tsv" \
      "$OUT_DIR/dashboard_05_join_hubs.tsv" >/dev/null
    echo "Join hubs enriched with v4 heuristic fallback."
  fi
fi

echo "Dashboard mapping exported to: $OUT_DIR"
