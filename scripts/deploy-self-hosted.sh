#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BRANCH="${DEPLOY_BRANCH:-dev}"
LOCK_FILE="/tmp/sentient-factory-deploy.lock"

export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
if [[ -s "$NVM_DIR/nvm.sh" ]]; then
  # The GitHub runner user service does not inherit the interactive shell PATH.
  # Load nvm here so npm/node are available during deploy.
  # shellcheck disable=SC1091
  . "$NVM_DIR/nvm.sh"
  nvm use --silent default >/dev/null 2>&1 || true
fi

services=("$@")
if [[ ${#services[@]} -eq 0 ]]; then
  services=("web-dashboard")
fi

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
