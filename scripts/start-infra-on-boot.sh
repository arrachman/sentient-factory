#!/usr/bin/env bash
set -euo pipefail
containers=(
  mysql
  sentient-postgres-core
  sentient-infra-redis
  kafka
  sentient-infra-kafka-ui
  debezium-connect
  sentient-infra-api-gateway
  sentient-infra-ai-engine
  sentient-infra-web-dashboard
  sentient-infra-docs
  sentient-infra-llm-router
  sentient-infra-etl-worker
)
for container in "${containers[@]}"; do
  if docker container inspect "$container" >/dev/null 2>&1; then
    docker start "$container" >/dev/null 2>&1 || true
  fi
done
