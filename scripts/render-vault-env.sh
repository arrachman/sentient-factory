#!/usr/bin/env bash

set -euo pipefail

VAULT_ADDR="${VAULT_ADDR:-http://127.0.0.1:8200}"
VAULT_KV_MOUNT="${VAULT_KV_MOUNT:-secret}"
VAULT_SECRETS_PATH="${1:-${VAULT_SECRETS_PATH:-}}"
OUTPUT_FILE="${2:-.env.vault}"

if [[ -z "${VAULT_TOKEN:-}" ]]; then
  echo "VAULT_TOKEN is required" >&2
  exit 1
fi

if [[ -z "$VAULT_SECRETS_PATH" ]]; then
  echo "Usage: $0 <vault-path> [output-file]" >&2
  exit 1
fi

mkdir -p "$(dirname "$OUTPUT_FILE")"

curl -fsS \
  --header "X-Vault-Token: ${VAULT_TOKEN}" \
  "${VAULT_ADDR%/}/v1/${VAULT_KV_MOUNT}/data/${VAULT_SECRETS_PATH}" \
  | jq -r '.data.data | to_entries[] | "\(.key)=\(.value|tostring)"' > "$OUTPUT_FILE"

echo "Rendered $OUTPUT_FILE from ${VAULT_KV_MOUNT}/${VAULT_SECRETS_PATH}"
