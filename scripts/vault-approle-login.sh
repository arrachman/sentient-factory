#!/usr/bin/env bash

set -euo pipefail

VAULT_ADDR="${VAULT_ADDR:-http://127.0.0.1:8200}"
ROLE_ID="${ROLE_ID:-${VAULT_ROLE_ID:-}}"
SECRET_ID="${SECRET_ID:-${VAULT_SECRET_ID:-}}"

if [[ -z "$ROLE_ID" || -z "$SECRET_ID" ]]; then
  echo "ROLE_ID and SECRET_ID are required" >&2
  exit 1
fi

response="$({
  curl -fsS \
    --request POST \
    --header 'Content-Type: application/json' \
    --data "{\"role_id\":\"$ROLE_ID\",\"secret_id\":\"$SECRET_ID\"}" \
    "$VAULT_ADDR/v1/auth/approle/login"
})"

printf '%s\n' "$response" | jq -r '.auth.client_token'
