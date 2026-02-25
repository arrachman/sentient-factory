#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
DASH_DIR="$ROOT_DIR/dashboard-mapping"
OUT_DIR="$DASH_DIR/output"

IN_FILE="${1:-$OUT_DIR/myerpplus_heuristic_relations_v4.tsv}"
OUT_FILE="${2:-$OUT_DIR/myerpplus_heuristic_relations_v4_scored.tsv}"
SUMMARY_FILE="${3:-$OUT_DIR/myerpplus_heuristic_relations_v4_confidence_summary.md}"

if [[ ! -f "$IN_FILE" ]]; then
  echo "ERROR: missing input file: $IN_FILE" >&2
  exit 1
fi

awk -F'\t' '
function tier(score, rule) {
  if (rule == "direct_exact" || rule == "alias_exact") return "high"
  if (score >= 112) return "high"
  if (rule == "core_match" || rule == "alias_core") return "medium"
  if (score >= 98) return "medium"
  if (rule == "acronym_match" && score >= 93) return "medium"
  return "low"
}
{
  c = tier($6 + 0, $7)
  print $0 "\t" c
}
' "$IN_FILE" > "$OUT_FILE"

{
  echo "# Heuristic Confidence Summary"
  echo
  echo "Generated at: $(date -u +"%Y-%m-%d %H:%M:%S UTC")"
  echo
  echo "Input: $(basename "$IN_FILE")"
  echo "Output: $(basename "$OUT_FILE")"
  echo
  awk -F'\t' '
    { tier[$8]++; rule[$7]++; key[$1 "." $2] = 1; tier_key[$8 FS $1 "." $2] = 1 }
    END {
      for (k in key) total_keys++
      printf "## Totals\n"
      printf "- rows: %d\n", NR
      printf "- unique source keys (table.column): %d\n", total_keys + 0
      printf "- high rows: %d\n", tier["high"] + 0
      printf "- medium rows: %d\n", tier["medium"] + 0
      printf "- low rows: %d\n", tier["low"] + 0
      printf "\n## Rules\n"
      for (r in rule) printf "- %s: %d\n", r, rule[r]
    }
  ' "$OUT_FILE"
} > "$SUMMARY_FILE"

echo "Generated:"
echo "- $OUT_FILE"
echo "- $SUMMARY_FILE"
