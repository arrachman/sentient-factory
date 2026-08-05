#!/usr/bin/env bash
#
# proxy-provision.sh — provisioning satu host publik end-to-end:
#   1. DNS record A/CNAME di Cloudflare
#   2. Sertifikat Let's Encrypt (DNS-01 via Cloudflare) di Nginx Proxy Manager
#   3. Proxy host NPM yang meneruskan ke upstream lokal
#
# Kredensial dibaca dari env hasil `npm run vault:render:proxy`.
# JANGAN hardcode token di file ini.
#
# Usage:
#   scripts/proxy-provision.sh --domain hr.fr-labs.my.id --port 3209
#   scripts/proxy-provision.sh --domain app.senti.id --host 192.168.1.150 --port 3404
#   scripts/proxy-provision.sh --domain x.fr-labs.my.id --port 3101 --no-dns
#
set -euo pipefail

# ---------- defaults ----------
FORWARD_HOST="${PROXY_DEFAULT_FORWARD_HOST:-192.168.1.150}"
FORWARD_SCHEME="http"
DOMAIN=""
PORT=""
SKIP_DNS=0
DNS_TYPE="A"
DNS_CONTENT=""
PROXIED="false"     # Cloudflare orange-cloud; false = DNS only (LE + NPM langsung)
PROPAGATION=30

usage() {
  sed -n '2,20p' "$0" | sed 's/^# \{0,1\}//'
  exit "${1:-0}"
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --domain)      DOMAIN="$2"; shift 2 ;;
    --port)        PORT="$2"; shift 2 ;;
    --host)        FORWARD_HOST="$2"; shift 2 ;;
    --scheme)      FORWARD_SCHEME="$2"; shift 2 ;;
    --dns-type)    DNS_TYPE="$2"; shift 2 ;;
    --dns-content) DNS_CONTENT="$2"; shift 2 ;;
    --proxied)     PROXIED="true"; shift ;;
    --no-dns)      SKIP_DNS=1; shift ;;
    --propagation) PROPAGATION="$2"; shift 2 ;;
    -h|--help)     usage 0 ;;
    *) echo "Argumen tidak dikenal: $1" >&2; usage 1 ;;
  esac
done

[[ -n "$DOMAIN" ]] || { echo "ERROR: --domain wajib diisi" >&2; usage 1; }
[[ -n "$PORT"   ]] || { echo "ERROR: --port wajib diisi" >&2; usage 1; }

# ---------- kredensial ----------
require_env() {
  local name="$1"
  if [[ -z "${!name:-}" ]]; then
    echo "ERROR: env $name kosong. Jalankan: npm run vault:render:proxy && set -a && . .env.proxy && set +a" >&2
    exit 1
  fi
}
require_env NPM_BASE_URL
require_env NPM_IDENTITY
require_env NPM_SECRET
require_env LETSENCRYPT_EMAIL
[[ "$SKIP_DNS" -eq 1 ]] || require_env CLOUDFLARE_API_TOKEN
require_env CLOUDFLARE_API_TOKEN   # tetap dibutuhkan untuk DNS-01 challenge

api() { # api <method> <path> [json-body]
  local method="$1" path="$2" body="${3:-}"
  local args=(-sS -X "$method" "${NPM_BASE_URL%/}${path}"
              -H "Authorization: Bearer ${NPM_TOKEN:-}"
              -H "Content-Type: application/json")
  [[ -n "$body" ]] && args+=(-d "$body")
  curl "${args[@]}"
}

cf() { # cf <method> <path> [json-body]
  local method="$1" path="$2" body="${3:-}"
  local args=(-sS -X "$method" "https://api.cloudflare.com/client/v4${path}"
              -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}"
              -H "Content-Type: application/json")
  [[ -n "$body" ]] && args+=(-d "$body")
  curl "${args[@]}"
}

die() { echo "ERROR: $*" >&2; exit 1; }

# ---------- 1. login NPM ----------
echo "==> Login ke Nginx Proxy Manager (${NPM_BASE_URL})"
NPM_TOKEN=$(curl -sS -X POST "${NPM_BASE_URL%/}/api/tokens" \
  -H 'Content-Type: application/json' \
  -d "$(jq -n --arg i "$NPM_IDENTITY" --arg s "$NPM_SECRET" \
        '{identity:$i, secret:$s}')" | jq -r '.token // empty')
[[ -n "$NPM_TOKEN" ]] || die "login NPM gagal — cek NPM_IDENTITY/NPM_SECRET"
export NPM_TOKEN

# ---------- 2. DNS record Cloudflare ----------
if [[ "$SKIP_DNS" -eq 0 ]]; then
  # zone = dua label terakhir dari domain (mis. hr.fr-labs.my.id -> fr-labs.my.id
  # tidak selalu benar untuk ccTLD bertingkat, jadi cari zone yang cocok sebagai suffix)
  echo "==> Mencari zone Cloudflare untuk ${DOMAIN}"
  ZONE_ID=$(cf GET "/zones?per_page=50" | jq -r --arg d "$DOMAIN" '
    [.result[] | select($d == .name or ($d | endswith("." + .name)))]
    | sort_by(.name | length) | last | .id // empty')
  [[ -n "$ZONE_ID" ]] || die "zone Cloudflare untuk ${DOMAIN} tidak ditemukan (cek scope token)"

  [[ -n "$DNS_CONTENT" ]] || DNS_CONTENT=$(curl -sS https://api.ipify.org)
  [[ -n "$DNS_CONTENT" ]] || die "gagal menentukan IP publik; pakai --dns-content"

  EXISTING=$(cf GET "/zones/${ZONE_ID}/dns_records?name=${DOMAIN}" | jq -r '.result[0].id // empty')
  RECORD_BODY=$(jq -n --arg t "$DNS_TYPE" --arg n "$DOMAIN" --arg c "$DNS_CONTENT" \
                      --argjson p "$PROXIED" \
                      '{type:$t, name:$n, content:$c, ttl:1, proxied:$p}')

  if [[ -n "$EXISTING" ]]; then
    echo "==> Update DNS record ${DNS_TYPE} ${DOMAIN} -> ${DNS_CONTENT}"
    cf PUT "/zones/${ZONE_ID}/dns_records/${EXISTING}" "$RECORD_BODY" \
      | jq -e '.success' >/dev/null || die "update DNS record gagal"
  else
    echo "==> Buat DNS record ${DNS_TYPE} ${DOMAIN} -> ${DNS_CONTENT}"
    cf POST "/zones/${ZONE_ID}/dns_records" "$RECORD_BODY" \
      | jq -e '.success' >/dev/null || die "pembuatan DNS record gagal"
  fi
else
  echo "==> Lewati langkah DNS (--no-dns)"
fi

# ---------- 3. sertifikat Let's Encrypt (DNS-01 via Cloudflare) ----------
echo "==> Cek sertifikat existing untuk ${DOMAIN}"
CERT_ID=$(api GET /api/nginx/certificates | jq -r --arg d "$DOMAIN" \
  '[.[] | select(.domain_names | index($d))] | first | .id // empty')

if [[ -z "$CERT_ID" ]]; then
  echo "==> Request sertifikat Let's Encrypt (DNS-01 / Cloudflare)"
  CERT_BODY=$(jq -n \
    --arg d "$DOMAIN" --arg e "$LETSENCRYPT_EMAIL" \
    --arg cred "dns_cloudflare_api_token = ${CLOUDFLARE_API_TOKEN}" \
    --argjson prop "$PROPAGATION" \
    '{provider:"letsencrypt", domain_names:[$d], meta:{
        letsencrypt_email:$e, letsencrypt_agree:true,
        dns_challenge:true, dns_provider:"cloudflare",
        dns_provider_credentials:$cred, propagation_seconds:$prop}}')
  CERT_ID=$(api POST /api/nginx/certificates "$CERT_BODY" | jq -r '.id // empty')
  [[ -n "$CERT_ID" ]] || die "penerbitan sertifikat gagal — cek Audit Log di NPM"
  echo "    sertifikat dibuat (id=${CERT_ID})"
else
  echo "    pakai sertifikat existing (id=${CERT_ID})"
fi

# ---------- 4. proxy host ----------
echo "==> Cek proxy host existing untuk ${DOMAIN}"
HOST_ID=$(api GET /api/nginx/proxy-hosts | jq -r --arg d "$DOMAIN" \
  '[.[] | select(.domain_names | index($d))] | first | .id // empty')

HOST_BODY=$(jq -n \
  --arg d "$DOMAIN" --arg fh "$FORWARD_HOST" --arg fs "$FORWARD_SCHEME" \
  --argjson fp "$PORT" --argjson cert "$CERT_ID" \
  '{domain_names:[$d], forward_scheme:$fs, forward_host:$fh, forward_port:$fp,
    certificate_id:$cert, ssl_forced:true, http2_support:true,
    hsts_enabled:false, block_exploits:true, caching_enabled:false,
    allow_websocket_upgrade:true, access_list_id:0, advanced_config:"",
    locations:[], meta:{letsencrypt_agree:false, dns_challenge:true}}')

if [[ -n "$HOST_ID" ]]; then
  echo "==> Update proxy host ${DOMAIN} -> ${FORWARD_SCHEME}://${FORWARD_HOST}:${PORT}"
  api PUT "/api/nginx/proxy-hosts/${HOST_ID}" "$HOST_BODY" \
    | jq -e '.id' >/dev/null || die "update proxy host gagal"
else
  echo "==> Buat proxy host ${DOMAIN} -> ${FORWARD_SCHEME}://${FORWARD_HOST}:${PORT}"
  HOST_ID=$(api POST /api/nginx/proxy-hosts "$HOST_BODY" | jq -r '.id // empty')
  [[ -n "$HOST_ID" ]] || die "pembuatan proxy host gagal"
fi

# ---------- 5. verifikasi ----------
echo "==> Verifikasi https://${DOMAIN}"
sleep 3
CODE=$(curl -sS -o /dev/null -w '%{http_code}' --max-time 15 "https://${DOMAIN}/" || echo "000")
echo
echo "Selesai."
echo "  domain      : https://${DOMAIN}"
echo "  upstream    : ${FORWARD_SCHEME}://${FORWARD_HOST}:${PORT}"
echo "  cert id     : ${CERT_ID}"
echo "  proxy host  : ${HOST_ID}"
echo "  HTTP status : ${CODE}"
[[ "$CODE" == "000" ]] && echo "  (status 000 = belum reachable; cek UFW port ${PORT} dan propagasi DNS)"
exit 0
