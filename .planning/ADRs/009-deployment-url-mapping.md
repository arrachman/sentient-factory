# ADR 009: Deployment URL Mapping (althea.fr-labs.my.id)

**Status**: Accepted
**Date**: 2026-05-08
**Deciders**: User

## Context

Self-host VPS deployment (per ADR 002 + earlier decision). Butuh public URL untuk web-althea + api-gateway production. User memilih subdomain `althea.fr-labs.my.id` untuk Althea Psychology system.

## Decision

### URL mapping

| Service | Internal port | Public URL |
|---|---|---|
| `web-althea` (Next.js) | `3202` | `http://althea.fr-labs.my.id/` |
| `api-gateway` `/clinic/*` | `3203` | `http://althea.fr-labs.my.id/api/clinic/*` |
| `api-gateway` `/auth/*` (shared) | `3203` | `http://althea.fr-labs.my.id/api/auth/*` |

Single subdomain, path-based split:
- `/` → web-althea (Next.js SSR)
- `/api/*` → api-gateway

### Reverse proxy implementation

Belum diset di slice ini — implementation sebagai opsi:
- **Caddy** (recommended untuk simplicity + auto-HTTPS Let's Encrypt)
- Nginx
- Traefik (kalau Docker-native flow)

Sample Caddy config:
```caddyfile
althea.fr-labs.my.id {
    handle /api/* {
        uri strip_prefix /api
        reverse_proxy localhost:3203
    }
    handle {
        reverse_proxy localhost:3202
    }
}
```

### CORS implication
Same-origin: web-althea + api-gateway via 1 domain → tidak butuh CORS. Cookie `sf_token` set dengan `Domain=althea.fr-labs.my.id; Path=/; Secure (kalau HTTPS); HttpOnly`.

### Auth cookie sharing dengan web-dashboard
ERP web-dashboard kemungkinan punya domain berbeda (e.g., `dashboard.fr-labs.my.id`). Cookie `sf_token` di subdomain berbeda → **tidak otomatis share**. Kalau perlu SSO cross-app:
- Set cookie `Domain=.fr-labs.my.id` (parent domain) — semua subdomain bisa baca
- Atau pakai SSO redirect flow

Dipertimbangkan saat web-dashboard diintegrasi (out of scope Slice 0-14 web-althea).

## Consequences

### Positive
- 1 subdomain = simple DNS + SSL setup
- Path-based routing flexible (bisa tambah path lain di masa depan)
- Cookie same-origin → no CORS hassle
- HTTPS upgrade gampang (tinggal Caddy auto-HTTPS atau Cloudflare proxy)

### Negative
- Coupling web + api di 1 domain — kalau later butuh pisah, refactor URL & CORS
- HTTP saat ini = bisa kena MITM. Migrate ke HTTPS sebelum production launch.

## Implementation impact

### web-althea (.env.production atau .env.staging)
```bash
NEXT_PUBLIC_APP_URL=http://althea.fr-labs.my.id
NEXT_PUBLIC_API_URL=http://althea.fr-labs.my.id/api
```

### api-gateway (.env.production)
```bash
# Sudah handle existing, tinggal:
ALLOWED_ORIGINS=http://althea.fr-labs.my.id
COOKIE_DOMAIN=althea.fr-labs.my.id
```

### web-althea/next.config.mjs (allowedDevOrigins)
Tambah ke env:
```bash
NEXT_ALLOWED_DEV_ORIGINS=althea.fr-labs.my.id
```

### config/ports.json
Tambah field `productionUrl` per app untuk dokumentasi.

## Action items (untuk slice deployment)

- [ ] Setup Caddy/Nginx config di VPS
- [ ] Setup DNS record `althea.fr-labs.my.id` → VPS IP
- [ ] Configure SSL (Let's Encrypt or Cloudflare)
- [ ] Update env files dengan production URLs
- [ ] Test reverse proxy `/api/clinic/health` returns 200
- [ ] Test cookie flow login → set cookie → middleware read

## Reference

- `config/ports.json` — port allocations
- ADR 002 — backend extension strategy
- Earlier conversation — user confirmed self-host VPS deployment
