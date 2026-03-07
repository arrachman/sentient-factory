#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

cd "$ROOT_DIR"

if [[ -z "${VAULT_ADDR:-}" ]]; then
  echo "VAULT_ADDR is required" >&2
  exit 1
fi

if [[ -z "${VAULT_TOKEN:-}" ]]; then
  echo "VAULT_TOKEN is required" >&2
  exit 1
fi

./scripts/render-vault-env.sh sentient-factory/dev/shared .env.vault
./scripts/render-vault-env.sh sentient-factory/dev/api-gateway apps/api-gateway/.env.vault
./scripts/render-vault-env.sh sentient-factory/dev/web-dashboard apps/web-dashboard/.env.vault
./scripts/render-vault-env.sh sentient-factory/dev/myerpplus-db-mapping apps/myerpplus-db-mapping/.env.vault

docker compose -p sentient_factory -f infra/docker-compose.yml up -d "$@"
