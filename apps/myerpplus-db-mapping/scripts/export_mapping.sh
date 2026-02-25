#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUT_DIR="$ROOT_DIR/output"
QUERY_DIR="$ROOT_DIR/queries"

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
  local name="$1"
  local sql_file="$2"

  docker exec -i "$MYSQL_CONTAINER" \
    mysql -N -B -u"$MYSQL_USER" -p"$MYSQL_PASSWORD" "$MYSQL_DATABASE" \
    < "$sql_file" > "$OUT_DIR/$name.tsv"
}

run_query "01_overview" "$QUERY_DIR/01_overview.sql"
run_query "02_table_catalog" "$QUERY_DIR/02_table_catalog.sql"
run_query "03_primary_keys" "$QUERY_DIR/03_primary_keys.sql"
run_query "04_columns_heaviest" "$QUERY_DIR/04_columns_heaviest.sql"
run_query "05_module_distribution" "$QUERY_DIR/05_module_distribution.sql"
run_query "06_foreign_keys" "$QUERY_DIR/06_foreign_keys.sql"

echo "Mapping exported to: $OUT_DIR"
