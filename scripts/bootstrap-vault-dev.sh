#!/usr/bin/env bash

set -euo pipefail

VAULT_ADDR="${VAULT_ADDR:-http://127.0.0.1:8200}"
VAULT_TOKEN="${VAULT_TOKEN:-root-dev-token-change-me}"
VAULT_KV_MOUNT="${VAULT_KV_MOUNT:-secret}"
VAULT_POLICY_NAME="${VAULT_POLICY_NAME:-sentient-factory-dev-read}"
VAULT_APPROLE_NAME="${VAULT_APPROLE_NAME:-sentient-factory-dev}"
VAULT_SHARED_PATH="${VAULT_SHARED_PATH:-sentient-factory/dev/shared}"
VAULT_API_PATH="${VAULT_API_PATH:-sentient-factory/dev/api-gateway}"
VAULT_WEB_PATH="${VAULT_WEB_PATH:-sentient-factory/dev/web-dashboard}"
VAULT_MYERP_PATH="${VAULT_MYERP_PATH:-sentient-factory/dev/myerpplus-db-mapping}"
VAULT_CDC_PATH="${VAULT_CDC_PATH:-sentient-factory/dev/cdc}"
VAULT_ETL_WORKER_PATH="${VAULT_ETL_WORKER_PATH:-sentient-factory/dev/etl-worker}"

export VAULT_ADDR
export VAULT_TOKEN

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

write_policy() {
  if command -v vault >/dev/null 2>&1; then
    vault policy write "$VAULT_POLICY_NAME" "$tmp_policy_file"
    return
  fi

  docker exec -i \
    -e VAULT_ADDR="$VAULT_ADDR" \
    -e VAULT_TOKEN="$VAULT_TOKEN" \
    sentient-infra-vault sh -lc "cat > /tmp/policy.hcl && vault policy write '$VAULT_POLICY_NAME' /tmp/policy.hcl >/dev/null"
}

tmp_policy_file="$(mktemp)"
trap 'rm -f "$tmp_policy_file"' EXIT

cat > "$tmp_policy_file" <<EOF
path "${VAULT_KV_MOUNT}/data/${VAULT_SHARED_PATH}" {
  capabilities = ["read"]
}

path "${VAULT_KV_MOUNT}/metadata/${VAULT_SHARED_PATH}" {
  capabilities = ["read"]
}

path "${VAULT_KV_MOUNT}/data/${VAULT_API_PATH}" {
  capabilities = ["read"]
}

path "${VAULT_KV_MOUNT}/metadata/${VAULT_API_PATH}" {
  capabilities = ["read"]
}

path "${VAULT_KV_MOUNT}/data/${VAULT_WEB_PATH}" {
  capabilities = ["read"]
}

path "${VAULT_KV_MOUNT}/metadata/${VAULT_WEB_PATH}" {
  capabilities = ["read"]
}

path "${VAULT_KV_MOUNT}/data/${VAULT_MYERP_PATH}" {
  capabilities = ["read"]
}

path "${VAULT_KV_MOUNT}/metadata/${VAULT_MYERP_PATH}" {
  capabilities = ["read"]
}

path "${VAULT_KV_MOUNT}/data/${VAULT_CDC_PATH}" {
  capabilities = ["read"]
}

path "${VAULT_KV_MOUNT}/metadata/${VAULT_CDC_PATH}" {
  capabilities = ["read"]
}

path "${VAULT_KV_MOUNT}/data/${VAULT_ETL_WORKER_PATH}" {
  capabilities = ["read"]
}

path "${VAULT_KV_MOUNT}/metadata/${VAULT_ETL_WORKER_PATH}" {
  capabilities = ["read"]
}
EOF

vault_cmd secrets list -format=json >/tmp/vault-secrets.json
if ! grep -q '"'"${VAULT_KV_MOUNT}/"'"' /tmp/vault-secrets.json; then
  vault_cmd secrets enable -path="$VAULT_KV_MOUNT" kv-v2
fi

vault_cmd kv put "$VAULT_KV_MOUNT/$VAULT_SHARED_PATH" \
  POSTGRES_DB="sentient_factory" \
  POSTGRES_USER="root" \
  POSTGRES_PASSWORD="replace-me" \
  DATABASE_URL="postgresql://root:replace-me@postgres:5432/sentient_factory" \
  REDIS_URL="redis://redis:6379" \
  JWT_SECRET="replace-me" \
  JWT_EXPIRES_IN="7d" \
  NEXT_PUBLIC_API_URL="http://127.0.0.1:3203" \
  NEXT_PUBLIC_WS_URL="ws://127.0.0.1:3203" \
  OPENAI_API_KEY="" \
  ANTHROPIC_API_KEY="" \
  GEMINI_API_KEY="" \
  NODE_ENV="development"

vault_cmd kv put "$VAULT_KV_MOUNT/$VAULT_API_PATH" \
  DATABASE_URL="postgresql://root:replace-me@localhost:3308/sentient_factory" \
  JWT_SECRET="replace-me" \
  JWT_EXPIRES_IN="7d" \
  PORT="3103" \
  NODE_ENV="development" \
  DASHBOARD_MYSQL_HOST="127.0.0.1" \
  DASHBOARD_MYSQL_PORT="3307" \
  DASHBOARD_MYSQL_USER="root" \
  DASHBOARD_MYSQL_PASSWORD="replace-me" \
  DASHBOARD_MYSQL_DATABASE="myerpplus"

vault_cmd kv put "$VAULT_KV_MOUNT/$VAULT_WEB_PATH" \
  API_GATEWAY_URL="http://127.0.0.1:3103" \
  NEXT_PUBLIC_API_URL="http://127.0.0.1:3103" \
  NEXT_PUBLIC_WS_URL="ws://127.0.0.1:3103" \
  NEXT_ALLOWED_DEV_ORIGINS="localhost,localhost:3201,127.0.0.1,127.0.0.1:3201" \
  NEXT_PUBLIC_BASE_PATH="" \
  NEXT_PUBLIC_BACKEND_STATUS_CHECK_INTERVAL_MS="30000" \
  E2E_BASE_URL="http://127.0.0.1:3201"

vault_cmd kv put "$VAULT_KV_MOUNT/$VAULT_MYERP_PATH" \
  MYSQL_CONTAINER="mysql" \
  MYSQL_HOST="127.0.0.1" \
  MYSQL_PORT="3307" \
  MYSQL_USER="root" \
  MYSQL_PASSWORD="replace-me" \
  MYSQL_DATABASE="myerpplus"

vault_cmd kv put "$VAULT_KV_MOUNT/$VAULT_CDC_PATH" \
  CDC_MYSQL_HOST="mysql" \
  CDC_MYSQL_PORT="3306" \
  CDC_MYSQL_USER="root" \
  CDC_MYSQL_PASSWORD="replace-me" \
  CDC_MYSQL_DATABASE="myerpplus" \
  CDC_MYSQL_SERVER_ID="184054" \
  CDC_MYSQL_TABLE_INCLUDE_LIST="myerpplus.orders,myerpplus.order_items,myerpplus.customers" \
  KAFKA_BOOTSTRAP_SERVERS="kafka:9092" \
  DEBEZIUM_CONNECT_URL="http://debezium-connect:8083"

vault_cmd kv put "$VAULT_KV_MOUNT/$VAULT_ETL_WORKER_PATH" \
  DATABASE_URL="postgresql://root:replace-me@postgres:5432/sentient_factory" \
  KAFKA_BROKERS="kafka:9092" \
  KAFKA_GROUP_ID="sentient-factory-etl-worker" \
  CDC_TOPIC_PREFIX="myerpplus" \
  NODE_ENV="development"

write_policy < "$tmp_policy_file"
vault_cmd auth enable approle >/dev/null 2>&1 || true
vault_cmd write auth/approle/role/"$VAULT_APPROLE_NAME" \
  token_policies="$VAULT_POLICY_NAME" \
  secret_id_ttl=24h \
  token_ttl=1h \
  token_max_ttl=4h

role_id="$(vault_cmd read -field=role_id auth/approle/role/"$VAULT_APPROLE_NAME"/role-id)"
secret_id="$(vault_cmd write -f -field=secret_id auth/approle/role/"$VAULT_APPROLE_NAME"/secret-id)"

cat <<EOF
Vault bootstrap complete.

Role name : $VAULT_APPROLE_NAME
Policy    : $VAULT_POLICY_NAME
KV paths  :
  - $VAULT_KV_MOUNT/$VAULT_SHARED_PATH
  - $VAULT_KV_MOUNT/$VAULT_API_PATH
  - $VAULT_KV_MOUNT/$VAULT_WEB_PATH
  - $VAULT_KV_MOUNT/$VAULT_MYERP_PATH
  - $VAULT_KV_MOUNT/$VAULT_CDC_PATH
  - $VAULT_KV_MOUNT/$VAULT_ETL_WORKER_PATH
Role ID   : $role_id
Secret ID : $secret_id

Next:
  1. Replace placeholder secrets in Vault.
  2. Login using AppRole to mint a short-lived token for the app.
  3. Put that token in the runtime env, not in git.
EOF
