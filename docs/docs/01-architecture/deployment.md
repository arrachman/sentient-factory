---
sidebar_position: 2
---
# Deployment Guide

Panduan ini mencakup opsi deployment untuk Sentient Factory, dari development hingga production.

## Development Environment

### Prerequisites

- Node.js 20+ (direkomendasikan menggunakan nvm)
- pnpm 8+ (`npm install -g pnpm`)
- Docker & Docker Compose
- PostgreSQL 14+ (atau gunakan Docker)

### Environment Variables Setup

Buat file `.env` di root project berdasarkan `.env.example`:

```bash
# Database Configuration
DB_HOST=127.0.0.1
DB_PORT=3307
DB_USER=app_user
DB_PASSWORD=change_me
DB_NAME=myerpplus
DATABASE_URL=postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}

# Redis
REDIS_URL=redis://localhost:6379

# InfluxDB
INFLUXDB_URL=http://localhost:8086
INFLUXDB_TOKEN=my-super-secret-token
INFLUXDB_ORG=sentient-factory
INFLUXDB_BUCKET=telemetry

# Message Queue
RABBITMQ_URL=amqp://admin:changeme@localhost:5672

# Object Storage
MINIO_ENDPOINT=localhost:9000
MINIO_ACCESS_KEY=admin
MINIO_SECRET_KEY=changeme

# Authentication
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d

# Frontend URLs
NEXT_PUBLIC_API_URL=http://localhost:3103
NEXT_PUBLIC_WS_URL=ws://localhost:3103

# Port Configuration (sesuai config/ports.json)
WEB_DASHBOARD_PORT=3101
LANDING_PAGE_PORT=3102
API_GATEWAY_PORT=3103
AI_ENGINE_PORT=3104
DOCS_PORT=3105
```

### Local Setup with Docker Compose

Gunakan `docker-compose.yml` berikut untuk menjalankan service dependencies:

```yaml
# docker-compose.yml
version: "3.8"

services:
  postgres:
    image: postgres:14-alpine
    environment:
      POSTGRES_DB: myerpplus
      POSTGRES_USER: app_user
      POSTGRES_PASSWORD: change_me
    ports:
      - "3307:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U root -d myerpplus"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    command: redis-server --requirepass changeme
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  influxdb:
    image: influxdb:2.7-alpine
    environment:
      DOCKER_INFLUXDB_INIT_MODE: setup
      DOCKER_INFLUXDB_INIT_USERNAME: admin
      DOCKER_INFLUXDB_INIT_PASSWORD: changeme
      DOCKER_INFLUXDB_INIT_ORG: sentient-factory
      DOCKER_INFLUXDB_INIT_BUCKET: telemetry
      DOCKER_INFLUXDB_INIT_ADMIN_TOKEN: my-super-secret-token
    ports:
      - "8086:8086"
    volumes:
      - influxdb_data:/var/lib/influxdb2

  minio:
    image: minio/minio:latest
    command: server /data --console-address ":9001"
    environment:
      MINIO_ROOT_USER: admin
      MINIO_ROOT_PASSWORD: changeme
    ports:
      - "9000:9000"
      - "9001:9001"
    volumes:
      - minio_data:/data

  rabbitmq:
    image: rabbitmq:3-management-alpine
    environment:
      RABBITMQ_DEFAULT_USER: admin
      RABBITMQ_DEFAULT_PASS: changeme
    ports:
      - "5672:5672"
      - "15672:15672"

volumes:
  postgres_data:
  influxdb_data:
  minio_data:
```

Jalankan services dengan:

```bash
# Start semua service dependencies
pnpm docker:up

# atau
docker-compose up -d

# Stop services
pnpm docker:down
```

### Starting Applications

Setelah service dependencies berjalan, jalankan aplikasi dengan:

**Option 1: Start semua aplikasi sekaligus**

```bash
# Generate environment variables dari config/ports.json
pnpm ports:env

# Copy output dan paste di terminal, atau:
eval $(pnpm ports:env)

# Start semua aplikasi yang aktif
pnpm dev

# atau
pnpm dev:all
```

**Option 2: Start aplikasi individually**

```bash
# Web Dashboard (Port: 3101)
cd apps/web-dashboard
WEB_DASHBOARD_PORT=3101 pnpm dev

# Landing Page (Port: 3102)
cd apps/landing-page
LANDING_PAGE_PORT=3102 pnpm dev

# API Gateway (Port: 3103)
cd apps/api-gateway
API_GATEWAY_PORT=3103 pnpm dev

# AI Engine (Port: 3104)
cd apps/ai-engine
AI_ENGINE_PORT=3104 pnpm dev

# Documentation (Port: 3105)
cd docs
DOCS_PORT=3105 pnpm start
```

**Option 3: Menggunakan script start-all**

```bash
./scripts/start-all.sh
```

### Database Migration & Seeding

```bash
# Run database migrations
pnpm db:migrate

# Seed development data
pnpm db:seed

# Reset database (hati-hati!)
pnpm db:reset
```

## Port Management

Sistem menggunakan `config/ports.json` sebagai single source of truth untuk port configuration:

```json
{
  "apps": {
    "web-dashboard": {
      "name": "Web Dashboard",
      "port": 3101,
      "type": "nextjs",
      "envVar": "WEB_DASHBOARD_PORT",
      "description": "Main administration dashboard",
      "isActive": true
    },
    "landing-page": {
      "name": "Landing Page",
      "port": 3102,
      "type": "nextjs",
      "envVar": "LANDING_PAGE_PORT",
      "description": "Marketing landing page"
    },
    "api-gateway": {
      "name": "API Gateway",
      "port": 3103,
      "type": "fastify",
      "envVar": "API_GATEWAY_PORT",
      "description": "Backend API server"
    },
    "ai-engine": {
      "name": "AI Engine",
      "port": 3104,
      "type": "node",
      "envVar": "AI_ENGINE_PORT",
      "description": "AI processing service"
    }
  }
}
```

**Port Management Commands:**

```bash
# List semua konfigurasi port
pnpm ports:list

# Check ketersediaan port
pnpm ports:check web-dashboard

# Update port untuk aplikasi
pnpm ports:update web-dashboard 3101

# Generate environment variables
pnpm ports:env

# Generate start commands
pnpm ports:commands
```

## Access URLs Setelah Development Setup

Setelah semua service berjalan, akses aplikasi melalui:


| Application         | URL                                                                 | Port  | Credentials (jika ada)          |
| ------------------- | ------------------------------------------------------------------- | ----- | ------------------------------- |
| Web Dashboard       | http://localhost:3101                                               | 3101  | -                               |
| Landing Page        | http://localhost:3102                                               | 3102  | -                               |
| API Gateway         | http://localhost:3103                                               | 3103  | -                               |
| API Documentation   | http://localhost:3103/docs                                          | 3103  | -                               |
| AI Engine           | http://localhost:3104                                               | 3104  | -                               |
| Documentation       | http://localhost:3105                                               | 3105  | -                               |
| PostgreSQL          | postgresql://app_user:change_me@localhost:3307/myerpplus | 3307  | app_user / change_me |
| Redis CLI           | redis-cli -h localhost -p 6379                                      | 6379  | -                               |
| InfluxDB UI         | http://localhost:8086                                               | 8086  | admin / changeme                |
| MinIO Console       | http://localhost:9001                                               | 9001  | admin / changeme                |
| RabbitMQ Management | http://localhost:15672                                              | 15672 | admin / changeme                |
| Grafana             | http://localhost:3000                                               | 3000  | admin / admin                   |

## Production Deployment (Coming Soon)

### Prerequisites

- Kubernetes cluster 1.24+
- 8+ CPU cores, 32GB+ RAM
- PostgreSQL production instance
- Object storage (S3 atau MinIO)
- Load balancer (nginx-ingress atau AWS ALB)

### Deployment Steps

1. **Setup Kubernetes cluster** dengan node groups yang sesuai
2. **Configure PostgreSQL** dengan replication dan backup
3. **Deploy applications** menggunakan Helm charts atau Kustomize
4. **Configure monitoring** dengan Prometheus Operator
5. **Setup CI/CD pipeline** dengan GitHub Actions

### Production Environment Variables

```bash
# Database - gunakan managed service
DATABASE_URL=postgresql://user:password@production-host:5432/myerpplus

# Redis - gunakan managed service
REDIS_URL=redis://production-host:6379

# Object Storage - gunakan S3 atau MinIO production
MINIO_ENDPOINT=s3.amazonaws.com
MINIO_ACCESS_KEY=AKIA...
MINIO_SECRET_KEY=...

# JWT Secret - generate strong secret
JWT_SECRET=strong-random-secret-min-32-chars

# AI Services API Keys
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
```

## Monitoring & Observability

### Development Monitoring

```bash
# View Docker logs
pnpm docker:logs

# View application logs
tail -f apps/api-gateway/logs/*.log

# Monitor resources
docker stats
```

### Production Monitoring (Recommended)

- **Prometheus** + **Grafana** untuk metrics visualization
- **Loki** + **Grafana** untuk log aggregation
- **Jaeger** untuk distributed tracing
- **AlertManager** untuk alert notifications

## Backup & Disaster Recovery

### Database Backups

```bash
# Backup PostgreSQL
pg_dump -h 127.0.0.1 -p 3307 -U root myerpplus > backup_$(date +%Y%m%d).sql

# Restore dari backup
psql -h 127.0.0.1 -p 3307 -U root myerpplus < backup_20250101.sql
```

### Volume Backups

- Gunakan volume snapshots untuk data persistent
- Backup MinIO data ke cloud storage
- Ekspor Redis data secara periodic

### Recovery Procedures

1. **Database Recovery**: Restore dari latest backup
2. **Application Recovery**: Redeploy dari container registry
3. **Data Recovery**: Restore dari object storage backup

## Security Best Practices

### Development Security

- Jangan commit `.env` file ke repository
- Gunakan `.env.example` sebagai template
- Rotate JWT secret secara berkala
- Gunakan strong passwords untuk semua service

### Network Security

- Gunakan VPN untuk akses production environment
- Batasi akses database dengan firewall rules
- Gunakan security groups dengan prinsip least privilege

### Secret Management

- Gunakan environment variables untuk development
- Untuk production, gunakan secret manager (AWS Secrets Manager, HashiCorp Vault)
- Implement secret rotation secara berkala

### Compliance

- Lakukan regular security audit
- Scan untuk vulnerabilities menggunakan tools seperti Trivy, Snyk
- Patuhi standar industri yang relevan
