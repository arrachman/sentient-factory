#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BRANCH="${DEPLOY_BRANCH:-main}"
LOCK_FILE="/tmp/sentient-factory-deploy.lock"

export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
if [[ -s "$NVM_DIR/nvm.sh" ]]; then
  # The GitHub runner user service does not inherit the interactive shell PATH.
  # Load nvm here so npm/node are available during deploy.
  # shellcheck disable=SC1091
  . "$NVM_DIR/nvm.sh"
  nvm use --silent default >/dev/null 2>&1 || true
fi

add_service() {
  local service="$1"
  local existing
  for existing in "${services[@]:-}"; do
    [[ "$existing" == "$service" ]] && return 0
  done
  services+=("$service")
}

detect_services() {
  local before="$1"
  local after="$2"
  local changed_file

  services=()

  while IFS= read -r changed_file; do
    case "$changed_file" in
      apps/web-dashboard/public/media/app/favicon.ico)
        add_service web-dashboard
        add_service hr-marketing
        add_service erp-marketing
        add_service sentient-marketing
        add_service tarik-data-digital
        ;;
      apps/web-dashboard/*)
        add_service web-dashboard
        ;;
      apps/api-gateway/*|apps/myerpplus-db-mapping/*)
        add_service api-gateway
        ;;
      apps/apps-mockup/*)
        add_service apps-mockup
        ;;
      apps/marketing/hr-*)
        add_service hr-marketing
        ;;
      apps/marketing/erp-*)
        add_service erp-marketing
        ;;
      apps/marketing/sentient-*)
        add_service sentient-marketing
        ;;
      apps/marketing/tarik-data-digital-*)
        add_service tarik-data-digital
        ;;
      docs/*)
        add_service docs
        ;;
      packages/*|package.json|package-lock.json|turbo.json|pnpm-workspace.yaml)
        add_service api-gateway
        add_service web-dashboard
        add_service docs
        ;;
      infra/docker-compose.yml|scripts/activate-build.sh|scripts/deploy-self-hosted.sh)
        add_service api-gateway
        add_service web-dashboard
        add_service docs
        add_service apps-mockup
        add_service hr-marketing
        add_service erp-marketing
        add_service sentient-marketing
        add_service tarik-data-digital
        ;;
    esac
  done < <(git diff --name-only "$before" "$after")
}

services=("$@")

exec 9>"$LOCK_FILE"
flock -n 9 || {
  echo "Another deploy is already running." >&2
  exit 1
}

cd "$ROOT_DIR"

current_branch="$(git branch --show-current)"
if [[ "$current_branch" != "$BRANCH" ]]; then
  echo "Expected branch $BRANCH, got $current_branch" >&2
  exit 2
fi

if [[ -n "$(git status --porcelain)" ]]; then
  echo "Working tree is dirty; refusing to deploy over local changes." >&2
  git status --short >&2
  exit 3
fi

git fetch origin "$BRANCH"

if [[ ${#services[@]} -eq 0 ]]; then
  before="${DEPLOY_BEFORE:-}"
  after="${DEPLOY_AFTER:-origin/$BRANCH}"

  if [[ -n "$before" && "$before" =~ ^0+$ ]]; then
    before="$(git rev-parse HEAD)"
  fi

  if [[ -n "$before" ]] && git rev-parse --verify "$before^{commit}" >/dev/null 2>&1 && git rev-parse --verify "$after^{commit}" >/dev/null 2>&1; then
    detect_services "$before" "$after"
  else
    echo "Could not determine changed files; deploying web-dashboard." >&2
    services=("web-dashboard")
  fi
fi

if [[ ${#services[@]} -eq 0 ]]; then
  echo "No deployable service changes detected."
  exit 0
fi

echo "Services selected for deploy: ${services[*]}"
git merge --ff-only "origin/$BRANCH"

if [[ " ${services[*]} " == *" web-dashboard "* ]]; then
  npm --prefix apps/web-dashboard install
  npm --prefix apps/web-dashboard run build
fi

if [[ " ${services[*]} " == *" api-gateway "* ]]; then
  npm --prefix apps/api-gateway install
  npm --prefix apps/api-gateway run db:generate
  npm --prefix apps/api-gateway run build
fi

"$ROOT_DIR/scripts/activate-build.sh" "${services[@]}"
