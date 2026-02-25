#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
DASH_DIR="$ROOT_DIR/dashboard-mapping"
OUT_DIR="$DASH_DIR/output"
CONFIG_DIR="$DASH_DIR/config"

TABLES_FILE="$OUT_DIR/myerpplus_all_tables.tsv"
COLUMNS_FILE="$OUT_DIR/myerpplus_all_columns.tsv"
ALIASES_FILE="$CONFIG_DIR/heuristic_aliases.tsv"
OUT_FILE="$OUT_DIR/myerpplus_heuristic_relations_v4.tsv"
UNMATCHED_FILE="$OUT_DIR/myerpplus_unmatched_id_like_columns_v4.tsv"
TMP_CANDIDATES="$(mktemp)"
TMP_TOP="$(mktemp)"

cleanup() {
  rm -f "$TMP_CANDIDATES" "$TMP_TOP"
}
trap cleanup EXIT

require_file() {
  local f="$1"
  if [[ ! -f "$f" ]]; then
    echo "ERROR: missing file: $f" >&2
    echo "Generate inventory first (all tables + columns)." >&2
    exit 1
  fi
}

require_file "$TABLES_FILE"
require_file "$COLUMNS_FILE"
require_file "$ALIASES_FILE"

awk -F'\t' -v alias_file="$ALIASES_FILE" '
function trim_token(s,  t) {
  t = s
  gsub(/[^a-z0-9_]/, "", t)
  gsub(/^_+/, "", t)
  gsub(/_+$/, "", t)
  gsub(/__+/, "_", t)
  return t
}

function acronym(s,  n, i, a, ac) {
  n = split(s, a, "_")
  ac = ""
  for (i = 1; i <= n; i++) if (a[i] != "") ac = ac substr(a[i], 1, 1)
  return ac
}

function module_prefix(tbl,  a, n) {
  n = split(tbl, a, "_")
  if (n >= 3 && a[1] == "m" && a[2] ~ /^[0-9]+$/) return a[1] "_" a[2]
  return (index(tbl, "_") ? substr(tbl, 1, index(tbl, "_") - 1) : tbl)
}

function module_core(tbl,  a, n, i, out) {
  n = split(tbl, a, "_")
  if (n >= 3 && a[1] == "m" && a[2] ~ /^[0-9]+$/) {
    out = a[3]
    for (i = 4; i <= n; i++) out = out "_" a[i]
    return out
  }
  return (index(tbl, "_") ? substr(tbl, index(tbl, "_") + 1) : tbl)
}

function core_base(s,  x) {
  x = s
  sub(/_history$/, "", x)
  sub(/_detail$/, "", x)
  sub(/_tmp$/, "", x)
  sub(/_lang$/, "", x)
  sub(/_copy[0-9]*$/, "", x)
  sub(/_s$/, "", x)
  return x
}

function base_token(col,  c) {
  c = tolower(col)
  c = trim_token(c)
  if (c == "" || c == "id") return ""
  if (c ~ /_id$/) return trim_token(substr(c, 1, length(c) - 3))
  if (c ~ /^id_/) return trim_token(substr(c, 4))
  if (c ~ /^k[a-z0-9_]+id$/) return trim_token(substr(c, 2, length(c) - 3))
  if (c ~ /^[a-z0-9_]+id$/ && c != "id") return trim_token(substr(c, 1, length(c) - 2))
  return ""
}

function alias_token(t,  a) {
  a = trim_token(t)
  if (a in alias_map) return alias_map[a]
  if (a ~ /user$/ && a != "user") return "user"
  if (a ~ /menu$/ && a != "menu") return "menu"
  if (a ~ /module$/ && a != "module") return "module"
  if (a ~ /lang$/ && a != "lang") return "language"
  if (a ~ /contact$/ && a != "contact") return "contact"
  if (a ~ /permission$/ && a != "permission") return "permission"
  if (a ~ /preference$/ && a != "preference") return "preference"
  return ""
}

function is_self_key(src_table, tok, src_core, src_coreb, src_acr, src_acrb) {
  src_core = module_core(src_table)
  src_coreb = core_base(src_core)
  src_acr = acronym(src_core)
  src_acrb = acronym(src_coreb)
  if (tok == src_core || tok == src_coreb || tok == src_acr || tok == src_acrb) return 1
  if (tok == src_core "s" || tok == src_coreb "s") return 1
  return 0
}

function score_candidate(src_prefix, tok, tok_alias, cand_tbl, cand_prefix, cand_core, cand_core_base, cand_acr, cand_acr_base,    s, tok_plural, alias_plural) {
  s = 0
  if (length(tok) <= 1) return 0
  tok_plural = tok "s"
  alias_plural = (tok_alias == "" ? "" : tok_alias "s")

  if (cand_tbl == tok) s = 120
  else if (cand_tbl == src_prefix "_" tok) s = 118
  else if (cand_core == tok) s = 112 + (cand_prefix == src_prefix ? 4 : 0)
  else if (cand_core_base == tok) s = 108 + (cand_prefix == src_prefix ? 4 : 0)
  else if (cand_tbl == tok_plural) s = 111
  else if (cand_tbl == src_prefix "_" tok_plural) s = 109
  else if (cand_core == tok_plural) s = 104 + (cand_prefix == src_prefix ? 3 : 0)
  else if (cand_core_base == tok_plural) s = 100 + (cand_prefix == src_prefix ? 3 : 0)
  else if (tok_alias != "" && cand_tbl == tok_alias) s = 106
  else if (tok_alias != "" && cand_tbl == src_prefix "_" tok_alias) s = 104
  else if (tok_alias != "" && cand_core == tok_alias) s = 100 + (cand_prefix == src_prefix ? 3 : 0)
  else if (tok_alias != "" && cand_core_base == tok_alias) s = 98 + (cand_prefix == src_prefix ? 3 : 0)
  else if (tok_alias != "" && cand_tbl == alias_plural) s = 99
  else if (tok_alias != "" && cand_tbl == src_prefix "_" alias_plural) s = 97
  else if (tok_alias != "" && cand_core == alias_plural) s = 94 + (cand_prefix == src_prefix ? 2 : 0)
  else if (tok_alias != "" && cand_core_base == alias_plural) s = 92 + (cand_prefix == src_prefix ? 2 : 0)
  else if (length(tok) >= 3 && cand_core ~ ("(^|_)" tok "($|_)")) s = 90 + (cand_prefix == src_prefix ? 2 : 0)
  else if (tok_alias != "" && length(tok_alias) >= 3 && cand_core ~ ("(^|_)" tok_alias "($|_)")) s = 88 + (cand_prefix == src_prefix ? 2 : 0)
  else if (length(tok) >= 2 && cand_prefix == src_prefix && (cand_acr == tok || cand_acr_base == tok)) s = 93
  else if (length(tok) >= 3 && (cand_acr == tok || cand_acr_base == tok)) s = 86
  else if (tok_alias != "" && length(tok_alias) >= 2 && cand_prefix == src_prefix && (cand_acr == tok_alias || cand_acr_base == tok_alias)) s = 90

  if (length(tok) <= 2 && cand_prefix != src_prefix && s < 95) s = 0
  return s
}

BEGIN {
  while ((getline line < alias_file) > 0) {
    if (line ~ /^#/ || line ~ /^[[:space:]]*$/) continue
    split(line, arr, "\t")
    token = trim_token(tolower(arr[1]))
    value = trim_token(tolower(arr[2]))
    if (token != "" && value != "") alias_map[token] = value
  }
  close(alias_file)
}

FNR == NR {
  tbl = tolower($1)
  tables[++n] = tbl
  tbl_prefix[n] = module_prefix(tbl)
  tbl_core[n] = module_core(tbl)
  coreb = tbl_core[n]
  sub(/_history$/, "", coreb)
  sub(/_detail$/, "", coreb)
  sub(/_tmp$/, "", coreb)
  sub(/_lang$/, "", coreb)
  sub(/_copy[0-9]*$/, "", coreb)
  sub(/_s$/, "", coreb)
  tbl_core_base[n] = coreb
  tbl_acr[n] = acronym(tbl_core[n])
  tbl_acr_base[n] = acronym(coreb)
  next
}

{
  src_table = tolower($1)
  src_col = $3
  tok = base_token(src_col)
  if (tok == "") next
  if (is_self_key(src_table, tok)) next

  src_prefix = module_prefix(src_table)
  tok_alias = alias_token(tok)

  for (i = 1; i <= n; i++) {
    cand_tbl = tables[i]
    if (cand_tbl == src_table) continue
    sc = score_candidate(src_prefix, tok, tok_alias, cand_tbl, tbl_prefix[i], tbl_core[i], tbl_core_base[i], tbl_acr[i], tbl_acr_base[i])
    if (sc > 0) {
      rule = "token_match"
      if (cand_tbl == tok || cand_tbl == src_prefix "_" tok) rule = "direct_exact"
      else if (tok_alias != "" && (cand_tbl == tok_alias || cand_tbl == src_prefix "_" tok_alias)) rule = "alias_exact"
      else if (tok_alias != "" && (tbl_core[i] == tok_alias || tbl_core_base[i] == tok_alias)) rule = "alias_core"
      else if (tbl_core[i] == tok || tbl_core_base[i] == tok) rule = "core_match"
      else if ((tbl_acr[i] == tok || tbl_acr_base[i] == tok) || (tok_alias != "" && (tbl_acr[i] == tok_alias || tbl_acr_base[i] == tok_alias))) rule = "acronym_match"
      printf "%s\t%s\t%s\t%s\t%s\t%d\t%s\n", src_table, src_col, tok, tok_alias, cand_tbl, sc, rule
    }
  }
}
' "$TABLES_FILE" "$COLUMNS_FILE" > "$TMP_CANDIDATES"

sort -t$'\t' -k1,1 -k2,2 -k6,6nr -k5,5 "$TMP_CANDIDATES" | \
awk -F'\t' '
{
  k = $1 "." $2
  if (++c[k] <= 3) print $0
}
' > "$TMP_TOP"

cp "$TMP_TOP" "$OUT_FILE"

awk -F'\t' '
NR == FNR { matched[$1 "." $2] = 1; next }
function trim_token(s,  t) {
  t = tolower(s)
  gsub(/[^a-z0-9_]/, "", t)
  gsub(/^_+/, "", t)
  gsub(/_+$/, "", t)
  gsub(/__+/, "_", t)
  return t
}
function base_token(col,  c) {
  c = trim_token(col)
  if (c == "" || c == "id") return ""
  if (c ~ /_id$/) return trim_token(substr(c, 1, length(c) - 3))
  if (c ~ /^id_/) return trim_token(substr(c, 4))
  if (c ~ /^k[a-z0-9_]+id$/) return trim_token(substr(c, 2, length(c) - 3))
  if (c ~ /^[a-z0-9_]+id$/ && c != "id") return trim_token(substr(c, 1, length(c) - 2))
  return ""
}
function module_core(tbl,  a, n, i, out) {
  n = split(tbl, a, "_")
  if (n >= 3 && a[1] == "m" && a[2] ~ /^[0-9]+$/) {
    out = a[3]
    for (i = 4; i <= n; i++) out = out "_" a[i]
    return out
  }
  return (index(tbl, "_") ? substr(tbl, index(tbl, "_") + 1) : tbl)
}
function core_base(s,  x) {
  x = s
  sub(/_history$/, "", x)
  sub(/_detail$/, "", x)
  sub(/_tmp$/, "", x)
  sub(/_lang$/, "", x)
  sub(/_copy[0-9]*$/, "", x)
  sub(/_s$/, "", x)
  return x
}
function acronym(s,  n, i, a, ac) {
  n = split(s, a, "_")
  ac = ""
  for (i = 1; i <= n; i++) if (a[i] != "") ac = ac substr(a[i], 1, 1)
  return ac
}
function is_self_key(src_table, tok, src_core, src_coreb, src_acr, src_acrb) {
  src_core = module_core(src_table)
  src_coreb = core_base(src_core)
  src_acr = acronym(src_core)
  src_acrb = acronym(src_coreb)
  if (tok == src_core || tok == src_coreb || tok == src_acr || tok == src_acrb) return 1
  if (tok == src_core "s" || tok == src_coreb "s") return 1
  return 0
}
{
  k = tolower($1) "." $3
  tok = base_token($3)
  if (tok == "") next
  if (is_self_key(tolower($1), tok)) next
  if (!(k in matched)) print tolower($1) "\t" $3
}
' "$OUT_FILE" "$COLUMNS_FILE" > "$UNMATCHED_FILE"

echo "Generated:"
echo "- $OUT_FILE"
echo "- $UNMATCHED_FILE"
