#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
COMPOSE_FILE="$ROOT_DIR/infra/docker-compose.yml"
PROJECT_NAME="sentient_factory"

usage() {
  cat <<'USAGE'
Usage:
  scripts/activate-build.sh [service ...]

Examples:
  scripts/activate-build.sh web-dashboard
  scripts/activate-build.sh api-gateway web-dashboard
  scripts/activate-build.sh erp-marketing

If no service is supplied, web-dashboard is restarted.
USAGE
}

if [[ "${1:-}" == "-h" || "${1:-}" == "--help" ]]; then
  usage
  exit 0
fi

services=("$@")
if [[ ${#services[@]} -eq 0 ]]; then
  services=("web-dashboard")
fi

cd "$ROOT_DIR"

docker compose -p "$PROJECT_NAME" -f "$COMPOSE_FILE" config --services >/tmp/sentient-factory-services.$$
trap 'rm -f /tmp/sentient-factory-services.$$' EXIT

for service in "${services[@]}"; do
  if ! grep -Fxq "$service" /tmp/sentient-factory-services.$$; then
    echo "Unknown service: $service" >&2
    echo >&2
    usage >&2
    exit 2
  fi
done

for service in "${services[@]}"; do
  if [[ "$service" == "web-dashboard" && -f "$ROOT_DIR/apps/web-dashboard/.next/BUILD_ID" ]]; then
    echo "Syncing apps/web-dashboard/.next into Docker volume..."
    docker run --rm \
      -v "$ROOT_DIR/apps/web-dashboard/.next:/src:ro" \
      -v sentient_factory_web_dashboard_next_cache:/dest \
      node:20-alpine \
      sh -c 'rm -rf /dest/* /dest/.[!.]* /dest/..?* 2>/dev/null || true; cp -a /src/. /dest/'
  fi
done

echo "Activating: ${services[*]}"
docker compose -p "$PROJECT_NAME" -f "$COMPOSE_FILE" up -d --no-deps --force-recreate "${services[@]}"
docker compose -p "$PROJECT_NAME" -f "$COMPOSE_FILE" ps "${services[@]}"
