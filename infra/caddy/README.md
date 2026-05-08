# Caddy Setup untuk Althea Psychology

Reverse proxy + auto-HTTPS (Let's Encrypt) untuk domain `althea.fr-labs.my.id`.

## Architecture

```
Internet
   │
   ↓ http(s)://althea.fr-labs.my.id
   │
   ↓ port 80/443 → Caddy
   │
   ├── /api/*        → localhost:3203  (api-gateway, NestJS)
   ├── /webhook/wa   → localhost:3203  (Fonnte webhook receiver, Slice 8)
   └── /             → localhost:3202  (web-althea, Next.js)
```

## Prerequisites

1. **VPS dengan Caddy installed**
   ```bash
   # Ubuntu/Debian
   sudo apt update
   sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https
   curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
   curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
   sudo apt update
   sudo apt install caddy
   ```

2. **DNS A record** `althea.fr-labs.my.id` → VPS public IP
   - Setup di provider DNS (Cloudflare, Namecheap, dll.)
   - Untuk auto-HTTPS Caddy, **domain harus resolve ke VPS** dulu

3. **Firewall buka port 80 + 443**
   ```bash
   sudo ufw allow 80
   sudo ufw allow 443
   sudo ufw reload
   ```

4. **Backend services running**:
   - api-gateway di port 3203 (Docker container)
   - web-althea di port 3202 (npm run start atau Docker)

## Deploy

### Step 1: Copy Caddyfile
```bash
sudo cp Caddyfile.althea /etc/caddy/sites/althea.conf
# atau langsung edit /etc/caddy/Caddyfile dan include
```

Update `/etc/caddy/Caddyfile`:
```caddyfile
import sites/*.conf
```

### Step 2: Validate config
```bash
sudo caddy validate --config /etc/caddy/Caddyfile
```

### Step 3: Reload Caddy
```bash
sudo systemctl reload caddy
# atau
sudo caddy reload --config /etc/caddy/Caddyfile
```

### Step 4: Verify
```bash
# HTTP test
curl -I http://althea.fr-labs.my.id/health
# expected: HTTP/1.1 200 OK + body "OK"

# Test web reachable
curl -I http://althea.fr-labs.my.id/
# expected: response dari web-althea (Next.js)

# Test API
curl -I http://althea.fr-labs.my.id/api/auth/login -X POST
# expected: response dari api-gateway (likely 400 bad request, but reachable)
```

## Enable HTTPS (recommended untuk production)

1. Edit `Caddyfile.althea`:
   - Comment out `:80` block
   - Uncomment HTTPS block
   - Update email `admin@fr-labs.my.id` ke email valid
2. Reload Caddy
3. Caddy otomatis request Let's Encrypt cert
4. Verify: `curl -I https://althea.fr-labs.my.id/health`

## Troubleshooting

### DNS belum resolve
```bash
dig althea.fr-labs.my.id +short
# Should return VPS IP. Kalau kosong/wrong, fix DNS dulu.
```

### Caddy logs
```bash
sudo journalctl -u caddy -f
# atau
tail -f /var/log/caddy/althea.log
```

### Cert provisioning fail
- Pastikan port 80 dan 443 buka di firewall
- Pastikan DNS resolve correct
- Check Let's Encrypt rate limit (max 50 cert/week per domain)

### Backend services down
```bash
# api-gateway
docker ps | grep api-gateway
docker logs sentient-infra-api-gateway -f

# web-althea
ps aux | grep next
# atau cek systemd service kalau pakai
```

## Future: Multiple Apps di 1 Caddy

Pattern `import sites/*.conf` memungkinkan tambah app lain (e.g., dashboard.fr-labs.my.id) tanpa edit main Caddyfile. Tinggal drop config baru di `/etc/caddy/sites/`.

## Cookie Domain Notes

Untuk SSO antar app di subdomain `*.fr-labs.my.id`:
- Set cookie `Domain=.fr-labs.my.id` (parent domain)
- Atau pakai SSO redirect flow

Saat ini cookie `sf_token` set di domain spesifik (`althea.fr-labs.my.id`). Kalau later integrate dengan `dashboard.fr-labs.my.id`, perlu update cookie domain.

## Reference

- `.planning/ADRs/009-deployment-url-mapping.md` — full deployment plan
- `config/ports.json` — port allocations
