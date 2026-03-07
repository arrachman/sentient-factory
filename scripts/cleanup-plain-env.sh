#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
STAMP="$(date +%Y%m%d-%H%M%S)"

backup_and_replace() {
  local target="$1"
  local template="$2"

  if [[ ! -f "$target" ]]; then
    return
  fi

  cp "$target" "${target}.bak-${STAMP}"
  cp "$template" "$target"
  echo "Sanitized $target (backup: ${target}.bak-${STAMP})"
}

backup_and_replace "$ROOT_DIR/.env" "$ROOT_DIR/.env.example"
backup_and_replace "$ROOT_DIR/apps/api-gateway/.env" "$ROOT_DIR/apps/api-gateway/.env.example"
backup_and_replace "$ROOT_DIR/apps/myerpplus-db-mapping/.env" "$ROOT_DIR/apps/myerpplus-db-mapping/.env.example"

cat <<'EOF'

Plain env files replaced with safe templates.
Use one of these next:
  eval "$(./scripts/vault-login-dev.sh --export)"
  npm run vault:render:all
  npm run docker:up:vault
EOF
