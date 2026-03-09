#!/usr/bin/env bash

set -euo pipefail

TEMPLATE_FILE="${1:-infra/debezium/connectors/mysql-myerpplus.json.tpl}"
OUTPUT_FILE="${2:-infra/debezium/rendered/mysql-myerpplus.json}"
ENV_FILE="${3:-infra/.env.vault.cdc}"

if [[ ! -f "$TEMPLATE_FILE" ]]; then
  echo "Template file not found: $TEMPLATE_FILE" >&2
  exit 1
fi

if [[ ! -f "$ENV_FILE" ]]; then
  echo "Env file not found: $ENV_FILE" >&2
  exit 1
fi

set -a
source "$ENV_FILE"
set +a

mkdir -p "$(dirname "$OUTPUT_FILE")"

envsubst < "$TEMPLATE_FILE" > "$OUTPUT_FILE"

echo "Rendered Debezium connector to $OUTPUT_FILE using $ENV_FILE"
