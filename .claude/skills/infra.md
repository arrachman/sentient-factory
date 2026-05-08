---
name: infra
description: Skill untuk bekerja dengan infra/ — Docker Compose setup lengkap (Vault, MySQL, PostgreSQL, Redis, Kafka, Debezium, Nginx, Prometheus), Kubernetes configs, systemd services, dan init scripts.
---

Kamu sedang bekerja di `infra/` — infrastruktur Sentient Factory.

## Struktur Folder

```
infra/
├── docker-compose.yml         # Setup lengkap semua services
├── docker-compose-backup.md   # Catatan perubahan docker-compose
├── debezium/
│   ├── connectors/            # Debezium connector configs (JSON)
│   ├── rendered/              # Rendered connector configs
│   └── README.md
├── nginx/
│   └── sentient.fr-labs.my.id.conf   # Nginx reverse proxy
├── init-scripts/
│   └── 01-create-schema.sql   # PostgreSQL init DDL
├── prometheus.yml             # Prometheus scrape config
└── systemd/
    ├── sentient-factory.service
    ├── sentient-factory-user.service
    └── sentient-factory.user.service
```

## Services di Docker Compose

### Data & Storage
| Service | Image | Port | Fungsi |
|---------|-------|------|--------|
| `postgres` | postgres:17 | 3208 | Database utama |
| `mysql` | mysql:8 | 3307 | Source MyERPPlus |
| `redis` | redis:7 | 3214 | Cache & queue |

### Message Queue & CDC
| Service | Image | Port | Fungsi |
|---------|-------|------|--------|
| `kafka` | confluentinc/cp-kafka | 9092, 29092 | Event streaming |
| `kafka-ui` | provectuslabs/kafka-ui | — | Kafka management UI |
| `debezium-connect` | debezium/connect | — | CDC connector |

### Applications
| Service | Port | Fungsi |
|---------|------|--------|
| `api-gateway` | 3103 | NestJS backend |
| `web-dashboard` | 3201 | Next.js dashboard |
| `ai-engine` | 8001 | Python AI service |
| `etl-worker` | — | Kafka CDC consumer |
| `open-design` | 3215 | Design tool |
| `apps-mockup` | 3213 | UI mockup server |
| `docs` | 3205 | Docusaurus docs |
| `sentient-marketing` | 3209 | Marketing page |
| `hr-marketing` | 3210 | HR marketing page |
| `tarik-data-digital` | 3211 | Data extraction page |

### Monitoring & Secrets
| Service | Port | Fungsi |
|---------|-------|------|
| `vault` | 8200 | HashiCorp Vault (secrets) |
| `prometheus` | — | Metrics collection |

## Perintah Umum

```bash
# Start semua services
docker compose -f infra/docker-compose.yml up -d

# Start services tertentu saja
docker compose -f infra/docker-compose.yml up -d postgres redis kafka

# Stop semua
docker compose -f infra/docker-compose.yml down

# Stop + hapus volumes (HATI-HATI: data hilang)
docker compose -f infra/docker-compose.yml down -v

# Lihat logs service tertentu
docker compose -f infra/docker-compose.yml logs -f api-gateway

# Restart satu service
docker compose -f infra/docker-compose.yml restart web-dashboard

# Rebuild image app
docker compose -f infra/docker-compose.yml build api-gateway
docker compose -f infra/docker-compose.yml up -d api-gateway
```

## Debezium CDC Setup

### Register Connector
```bash
# Render connector config dari template
bash scripts/render-debezium-connector.sh

# Register ke Debezium REST API
curl -X POST http://localhost:8083/connectors \
  -H 'Content-Type: application/json' \
  -d @infra/debezium/rendered/myerpplus-connector.json

# Cek status connector
curl http://localhost:8083/connectors/myerpplus-connector/status
```

### Connector Config (`infra/debezium/connectors/`)
```json
{
  "name": "myerpplus-connector",
  "config": {
    "connector.class": "io.debezium.connector.mysql.MySqlConnector",
    "database.hostname": "mysql",
    "database.port": "3306",
    "database.server.name": "myerpplus",
    "table.include.list": "myerpplus.*",
    "topic.prefix": "myerpplus"
  }
}
```

## Nginx Reverse Proxy

File: `infra/nginx/sentient.fr-labs.my.id.conf`

Konfigurasi proxy untuk domain production:
- `/` → web-dashboard (port 3201)
- `/api` → api-gateway (port 3103)
- `/ai` → ai-engine (port 8001)
- `/docs` → docs (port 3205)

## Systemd Services (Production Linux)

```bash
# Install & enable service
sudo cp infra/systemd/sentient-factory.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable sentient-factory
sudo systemctl start sentient-factory

# Cek status
sudo systemctl status sentient-factory

# Logs
journalctl -u sentient-factory -f
```

## PostgreSQL Init

`infra/init-scripts/01-create-schema.sql` dijalankan otomatis saat container postgres pertama kali dibuat.
Berisi: CREATE SCHEMA, extensions, user permissions.

## Prometheus Config

`infra/prometheus.yml` — scrape config untuk mengumpulkan metrics dari:
- api-gateway
- ai-engine  
- node exporter

## Panduan Tugas Umum

### Tambah Service Baru ke Docker Compose
```yaml
# Di infra/docker-compose.yml
services:
  new-service:
    build:
      context: ../apps/new-service
      dockerfile: Dockerfile
    ports:
      - "3220:3220"
    environment:
      - DATABASE_URL=${DATABASE_URL}
    depends_on:
      - postgres
```

### Debug Database Connection
```bash
# Masuk ke PostgreSQL
docker compose exec postgres psql -U postgres -d sentient_factory

# Masuk ke MySQL
docker compose exec mysql mysql -u root -p myerpplus
```
