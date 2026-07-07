#!/usr/bin/env bash
set -euo pipefail

OWNER="${GITHUB_OWNER:-arrachman}"
REPO="${GITHUB_REPO:-sentient-factory}"
RUNNER_DIR="${RUNNER_DIR:-$HOME/actions-runner-sentient-factory}"
RUNNER_NAME="${RUNNER_NAME:-$(hostname)-sentient-factory}"
RUNNER_LABELS="${RUNNER_LABELS:-sentient-factory}"
SERVICE_NAME="github-actions-runner-sentient-factory.service"

mkdir -p "$RUNNER_DIR"
cd "$RUNNER_DIR"

if [[ ! -x ./run.sh ]]; then
  download_url="$(gh api "repos/$OWNER/$REPO/actions/runners/downloads" \
    --jq '.[] | select(.os=="linux" and .architecture=="x64") | .download_url' | head -n 1)"
  curl -fsSL "$download_url" -o actions-runner-linux-x64.tar.gz
  tar xzf actions-runner-linux-x64.tar.gz
  rm actions-runner-linux-x64.tar.gz
fi

if [[ ! -f .runner ]]; then
  token="$(gh api --method POST "repos/$OWNER/$REPO/actions/runners/registration-token" --jq .token)"
  ./config.sh \
    --url "https://github.com/$OWNER/$REPO" \
    --token "$token" \
    --name "$RUNNER_NAME" \
    --labels "$RUNNER_LABELS" \
    --unattended \
    --replace
fi

mkdir -p "$HOME/.config/systemd/user"
cat >"$HOME/.config/systemd/user/$SERVICE_NAME" <<SERVICE
[Unit]
Description=GitHub Actions runner for $OWNER/$REPO
After=network-online.target
Wants=network-online.target

[Service]
WorkingDirectory=$RUNNER_DIR
ExecStart=$RUNNER_DIR/run.sh
Restart=always
RestartSec=10

[Install]
WantedBy=default.target
SERVICE

systemctl --user daemon-reload
systemctl --user enable --now "$SERVICE_NAME"
systemctl --user status "$SERVICE_NAME" --no-pager
