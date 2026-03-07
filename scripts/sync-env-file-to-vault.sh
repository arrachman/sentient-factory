#!/usr/bin/env bash

set -euo pipefail

ENV_FILE="${1:-}"
VAULT_SECRETS_PATH="${2:-${VAULT_SECRETS_PATH:-}}"
VAULT_KV_MOUNT="${VAULT_KV_MOUNT:-secret}"

if [[ -z "$ENV_FILE" || -z "$VAULT_SECRETS_PATH" ]]; then
  echo "Usage: $0 <env-file> <vault-path>" >&2
  exit 1
fi

if [[ -z "${VAULT_ADDR:-}" || -z "${VAULT_TOKEN:-}" ]]; then
  echo "VAULT_ADDR and VAULT_TOKEN are required" >&2
  exit 1
fi

if [[ ! -f "$ENV_FILE" ]]; then
  echo "Env file not found: $ENV_FILE" >&2
  exit 1
fi

vault_cmd() {
  if command -v vault >/dev/null 2>&1; then
    vault "$@"
    return
  fi

  docker exec \
    -e VAULT_ADDR="$VAULT_ADDR" \
    -e VAULT_TOKEN="$VAULT_TOKEN" \
    sentient-infra-vault vault "$@"
}

export -f vault_cmd

python3 - "$ENV_FILE" "$VAULT_KV_MOUNT" "$VAULT_SECRETS_PATH" <<'PY'
import json, os, subprocess, sys

env_file, mount, path = sys.argv[1:4]
data = {}
with open(env_file, 'r', encoding='utf-8') as handle:
    for raw_line in handle:
        line = raw_line.strip()
        if not line or line.startswith('#') or '=' not in line:
            continue
        key, value = line.split('=', 1)
        data[key.strip()] = value.strip()

args = ['bash', '-lc', 'vault_cmd "$@"', 'vault_cmd', 'kv', 'put', f'{mount}/{path}'] + [f'{key}={value}' for key, value in data.items()]
subprocess.run(args, check=True)
print(json.dumps({'path': f'{mount}/{path}', 'keys': sorted(data.keys())}, indent=2))
PY
