---
inclusion: fileMatch
fileMatchPattern: "infra/**"
---

# Infra — Docker Compose & Infrastructure

`infra/` — infrastruktur Sentient Factory.

## Services Docker Compose (`infra/docker-compose.yml`)

### Data & Storage
| Service | Image | Port | Fungsi |
|---------|-------|------|--------|
| `postgres` | postgres:17 | 3208 | Database utama |
| `mysql` | mysql:8 | 3307 | Source MyERPPlus |
| `redis` | redis:7 | 3214 | Cache & queue |

### Applications
| Service | Port |
|---------|------|
| `api-gateway` | 3103 |
| `web-dashboard` | 3201 |
| `ai-engine` | 8001 |

### Monitoring & Secrets
| Service | Port |
|---------|------|
| `vault` | 8200 |
| `prometheus` | — |

## Perintah Umum

```bash
# Start semua
docker compose -f infra/docker-compose.yml up -d

# Start specific services
docker compose -f infra/docker-compose.yml up -d postgres redis

# Logs
docker compose -f infra/docker-compose.yml logs -f api-gateway

# Restart satu service
docker compose -f infra/docker-compose.yml restart web-dashboard

# Stop + hapus volumes (HATI-HATI: data hilang)
docker compose -f infra/docker-compose.yml down -v
```

## PostgreSQL Access

```bash
# Via psql langsung
psql -h localhost -p 3208 -U root -d sentient_factory

# Via Docker exec
docker exec -it sentient-postgres-core psql -U root -d sentient_factory
```

## Nginx

`infra/nginx/sentient.fr-labs.my.id.conf` — reverse proxy production:
- `/` → web-dashboard (3201)
- `/api` → api-gateway (3103)
- `/ai` → ai-engine (8001)

## Aturan Penting

- `config/ports.json` adalah SSOT port assignments — single-writer, jangan diubah paralel.
- `infra/docker-compose.yml` — high-risk, konfirmasi sebelum mengubah.
- Secrets di Vault, bukan hardcode di compose file.
