#!/usr/bin/env bash
set -euo pipefail
containers=(
  sentient-infra-ai-engine
  sentient-infra-docs
  sentient-infra-web-dashboard
  sentient-infra-api-gateway
  sentient-infra-redis
  sentient-postgres-core
  mysql
)
for container in "${containers[@]}"; do
  if docker container inspect "$container" >/dev/null 2>&1; then
    docker stop "$container" >/dev/null 2>&1 || true
  fi
done
