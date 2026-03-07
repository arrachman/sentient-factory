#!/usr/bin/env bash

set -euo pipefail

VAULT_ADDR="${VAULT_ADDR:-http://127.0.0.1:8200}"
VAULT_ROOT_TOKEN="${VAULT_ROOT_TOKEN:-${VAULT_TOKEN:-root-dev-token-change-me}}"
VAULT_APPROLE_NAME="${VAULT_APPROLE_NAME:-sentient-factory-dev}"

vault_cmd() {
  if command -v vault >/dev/null 2>&1; then
    VAULT_ADDR="$VAULT_ADDR" VAULT_TOKEN="$VAULT_ROOT_TOKEN" vault "$@"
    return
  fi

  docker exec \
    -e VAULT_ADDR="$VAULT_ADDR" \
    -e VAULT_TOKEN="$VAULT_ROOT_TOKEN" \
    sentient-infra-vault vault "$@"
}

ROLE_ID="${ROLE_ID:-$(vault_cmd read -field=role_id auth/approle/role/"$VAULT_APPROLE_NAME"/role-id)}"

if [[ -z "${SECRET_ID:-}" ]]; then
  SECRET_ID="$(vault_cmd write -f -field=secret_id auth/approle/role/"$VAULT_APPROLE_NAME"/secret-id)"
fi

APP_TOKEN="$({
  curl -fsS \
    --request POST \
    --header 'Content-Type: application/json' \
    --data "{\"role_id\":\"$ROLE_ID\",\"secret_id\":\"$SECRET_ID\"}" \
    "$VAULT_ADDR/v1/auth/approle/login"
} | jq -r '.auth.client_token')"

if [[ "${1:-}" == "--export" ]]; then
  printf 'export VAULT_ADDR=%q\n' "$VAULT_ADDR"
  printf 'export ROLE_ID=%q\n' "$ROLE_ID"
  printf 'export SECRET_ID=%q\n' "$SECRET_ID"
  printf 'export VAULT_TOKEN=%q\n' "$APP_TOKEN"
  exit 0
fi

printf '%s\n' "$APP_TOKEN"
