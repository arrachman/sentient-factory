#!/usr/bin/env bash
# End-to-end check for the kr-to-cc gateway.
#
# Exercises the surfaces a client actually depends on: health, the model
# catalog, and both the Anthropic and OpenAI chat routes in non-streaming and
# streaming form. Requires a connected Kiro account — without one the gateway
# answers 503/500 and every inference step below fails.
#
# Usage: scripts/e2e.sh [base-url]

set -uo pipefail

BASE="${1:-http://127.0.0.1:3230}"
ENV_FILE="$(dirname "$0")/../.env"
KEY="$(grep -s '^PROXY_API_KEY=' "$ENV_FILE" | cut -d= -f2-)"

pass=0
fail=0

# Report one check, keeping a running tally so the exit code reflects the whole run.
check() {
    local name="$1" ok="$2" detail="$3"
    if [ "$ok" = "yes" ]; then
        printf 'PASS  %-42s %s\n' "$name" "$detail"
        pass=$((pass + 1))
    else
        printf 'FAIL  %-42s %s\n' "$name" "$detail"
        fail=$((fail + 1))
    fi
}

auth=(-H "x-api-key: ${KEY:-dummy}")

# --- health -----------------------------------------------------------------
body=$(curl -sS --max-time 10 "${auth[@]}" "$BASE/health" 2>&1)
code=$(curl -sS -o /dev/null -w '%{http_code}' --max-time 10 "${auth[@]}" "$BASE/health" 2>/dev/null)
[ "$code" = "200" ] && ok=yes || ok=no
check "health returns 200" "$ok" "HTTP $code ${body:0:120}"

# --- auth gate --------------------------------------------------------------
if [ -n "$KEY" ]; then
    code=$(curl -sS -o /dev/null -w '%{http_code}' --max-time 10 "$BASE/v1/models" 2>/dev/null)
    [ "$code" = "401" ] && ok=yes || ok=no
    check "unauthenticated /v1 is rejected" "$ok" "HTTP $code (expected 401)"
fi

# --- model catalog ----------------------------------------------------------
body=$(curl -sS --max-time 20 "${auth[@]}" "$BASE/v1/models" 2>&1)
count=$(printf '%s' "$body" | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{try{const j=JSON.parse(s);console.log((j.data||[]).length)}catch{console.log(0)}})' 2>/dev/null)
[ "${count:-0}" -gt 0 ] && ok=yes || ok=no
check "/v1/models lists models" "$ok" "${count:-0} models"

# --- Anthropic Messages, non-streaming -------------------------------------
body=$(curl -sS --max-time 120 "${auth[@]}" -H 'content-type: application/json' \
    -d '{"model":"auto","max_tokens":64,"messages":[{"role":"user","content":"Reply with exactly: E2E_OK"}]}' \
    "$BASE/v1/messages" 2>&1)
printf '%s' "$body" | grep -q 'E2E_OK' && ok=yes || ok=no
check "POST /v1/messages returns content" "$ok" "$(printf '%s' "$body" | tr -d '\n' | cut -c1-160)"

# --- Anthropic Messages, streaming -----------------------------------------
body=$(curl -sS --max-time 120 -N "${auth[@]}" -H 'content-type: application/json' \
    -d '{"model":"auto","max_tokens":64,"stream":true,"messages":[{"role":"user","content":"Count: 1 2 3"}]}' \
    "$BASE/v1/messages" 2>&1)
printf '%s' "$body" | grep -q 'content_block_delta' && ok=yes || ok=no
check "streaming /v1/messages emits deltas" "$ok" "$(printf '%s' "$body" | grep -c 'data:') SSE lines"

# --- OpenAI chat completions ----------------------------------------------
body=$(curl -sS --max-time 120 "${auth[@]}" -H 'content-type: application/json' \
    -d '{"model":"auto","max_tokens":64,"messages":[{"role":"user","content":"Reply with exactly: OAI_OK"}]}' \
    "$BASE/v1/chat/completions" 2>&1)
printf '%s' "$body" | grep -q 'OAI_OK' && ok=yes || ok=no
check "POST /v1/chat/completions returns content" "$ok" "$(printf '%s' "$body" | tr -d '\n' | cut -c1-160)"

# --- token counting --------------------------------------------------------
body=$(curl -sS --max-time 30 "${auth[@]}" -H 'content-type: application/json' \
    -d '{"model":"auto","messages":[{"role":"user","content":"hello"}]}' \
    "$BASE/v1/messages/count_tokens" 2>&1)
printf '%s' "$body" | grep -q 'input_tokens' && ok=yes || ok=no
check "count_tokens responds" "$ok" "$(printf '%s' "$body" | tr -d '\n' | cut -c1-120)"

# --- web UIs ---------------------------------------------------------------
for path in /dashboard /oauth/kiro /config/claude; do
    code=$(curl -sS -o /dev/null -w '%{http_code}' --max-time 10 "$BASE$path" 2>/dev/null)
    [ "$code" = "200" ] && ok=yes || ok=no
    check "UI $path serves 200" "$ok" "HTTP $code"
done

printf '\n%d passed, %d failed\n' "$pass" "$fail"
[ "$fail" -eq 0 ]
