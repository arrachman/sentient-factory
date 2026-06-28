#!/usr/bin/env bash
set -euo pipefail
containers=(
  mysql
  sentient-postgres-core
  sentient-infra-redis
  sentient-infra-api-gateway
  sentient-infra-ai-engine
  sentient-infra-web-dashboard
  sentient-infra-docs
)
for container in "${containers[@]}"; do
  if docker container inspect "$container" >/dev/null 2>&1; then
    docker start "$container" >/dev/null 2>&1 || true
  fi
done
