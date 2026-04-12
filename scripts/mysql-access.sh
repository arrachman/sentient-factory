apa#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
COMPOSE_FILE="${ROOT_DIR}/infra/docker-compose.yml"

load_env_file() {
  local env_file="$1"
  [[ -f "${env_file}" ]] || return 0

  while IFS='=' read -r key value; do
    key="${key%%[[:space:]]*}"

    if [[ -z "${key}" || "${key}" == \#* ]]; then
      continue
    fi

    if [[ ! "${key}" =~ ^[A-Za-z_][A-Za-z0-9_]*$ ]]; then
      continue
    fi

    if [[ -z "${!key+x}" ]]; then
      export "${key}=${value}"
    fi
  done < "${env_file}"
}

load_env_file "${ROOT_DIR}/.env"
load_env_file "${ROOT_DIR}/.env.vault"

CONTAINER_NAME="${MYSQL_CONTAINER_NAME:-mysql}"
MYSQL_HOST="${MYSQL_HOST:-127.0.0.1}"
MYSQL_PORT="${MYSQL_PORT:-3307}"
MYSQL_USER="${MYSQL_USER:-${MYSQL_ROOT_USER:-root}}"
MYSQL_PASSWORD="${MYSQL_PASSWORD:-${MYSQL_ROOT_PASSWORD:-change_me}}"
DEFAULT_DATABASE="${MYSQL_DATABASE:-${MYSQL_DEFAULT_DATABASE:-}}"

usage() {
  cat <<'EOF'
Usage:
  ./scripts/mysql-access.sh list-db
  ./scripts/mysql-access.sh shell
  ./scripts/mysql-access.sh query "SHOW DATABASES;"

Environment overrides:
  .env and .env.vault are loaded automatically when present
  MYSQL_CONTAINER_NAME   Default: mysql
  MYSQL_HOST             Default: 127.0.0.1
  MYSQL_PORT             Default: 3307
  MYSQL_USER             Default: root
  MYSQL_PASSWORD         Default: change_me
  MYSQL_DATABASE         Optional default database
EOF
}

mysql_args=(
  "-u${MYSQL_USER}"
  "-p${MYSQL_PASSWORD}"
)

if [[ -n "${DEFAULT_DATABASE}" ]]; then
  mysql_args+=("${DEFAULT_DATABASE}")
fi

run_in_container() {
  exec docker exec -it "${CONTAINER_NAME}" mysql "${mysql_args[@]}" "$@"
}

run_via_tcp() {
  exec mysql -h "${MYSQL_HOST}" -P "${MYSQL_PORT}" "${mysql_args[@]}" "$@"
}

run_query() {
  local sql="$1"
  if command -v docker >/dev/null 2>&1 && docker container inspect "${CONTAINER_NAME}" >/dev/null 2>&1; then
    exec docker exec "${CONTAINER_NAME}" mysql "${mysql_args[@]}" -e "${sql}"
  fi

  if command -v mysql >/dev/null 2>&1; then
    exec mysql -h "${MYSQL_HOST}" -P "${MYSQL_PORT}" "${mysql_args[@]}" -e "${sql}"
  fi

  echo "No MySQL access path available." >&2
  echo "Install docker or mysql client, then rerun this script." >&2
  exit 1
}

command_name="${1:-shell}"

case "${command_name}" in
  list-db)
    run_query "SHOW DATABASES;"
    ;;
  query)
    if [[ $# -lt 2 ]]; then
      echo "SQL query is required." >&2
      usage >&2
      exit 1
    fi
    run_query "$2"
    ;;
  shell)
    if command -v docker >/dev/null 2>&1 && docker container inspect "${CONTAINER_NAME}" >/dev/null 2>&1; then
      run_in_container
    fi

    if command -v mysql >/dev/null 2>&1; then
      run_via_tcp
    fi

    echo "No MySQL access path available." >&2
    echo "Install docker or mysql client, then rerun this script." >&2
    exit 1
    ;;
  help|-h|--help)
    usage
    ;;
  *)
    echo "Unknown command: ${command_name}" >&2
    usage >&2
    exit 1
    ;;
esac
