# Sentient Factory

Intelligent manufacturing platform powered by AI.

## 🏭 Overview

Sentient Factory is an AI-powered manufacturing platform that enables:
- **Real-time production monitoring** with IoT sensors
- **Predictive maintenance** using machine learning
- **Automated quality control** with computer vision
- **Supply chain optimization** through AI algorithms

## 🏗️ Architecture

```
sentient-factory/
├── apps/                          # Runnable applications
│   ├── web-dashboard/             # Next.js/React frontend
│   ├── api-gateway/               # FastAPI/Node.js backend
│   └── ai-engine/                 # Python/LangChain AI agents
│
├── packages/                      # Shared code
│   ├── shared-types/              # TypeScript/Pydantic types
│   ├── ui-kit/                    # React components
│   └── logger/                    # Structured logging
│
├── docs/                          # Docusaurus documentation
├── infra/                         # Infrastructure configs
├── scripts/                       # Helper scripts
└── .cursorrules                   # AI development guidelines
```

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- Python 3.11+
- Docker & Docker Compose
- pnpm (`npm install -g pnpm`)

### Development Setup

1. **Clone and install**
```bash
git clone <repository-url>
cd sentient-factory
pnpm install
```

2. **Start services with Docker**
```bash
pnpm docker:up
```

3. **Run development servers**
```bash
pnpm dev
```

4. **Access applications**
- Web Dashboard: http://localhost:3000
- API Gateway: http://localhost:8000
- AI Engine: http://localhost:8001
- Grafana: http://localhost:3000 (metrics)
- MinIO Console: http://localhost:9001
- RabbitMQ Management: http://localhost:15672

## 📦 Monorepo Management

### Workspaces
This project uses pnpm workspaces with TurboRepo for build orchestration.

**Available scripts:**
```bash
# Development
pnpm dev              # Start all services
pnpm build            # Build all packages
pnpm test             # Run all tests
pnpm lint             # Lint all code
pnpm typecheck        # Type check all TypeScript

# Docker
pnpm docker:up        # Start all Docker services
pnpm docker:down      # Stop all Docker services
pnpm docker:logs      # View Docker logs

# Database
pnpm db:migrate       # Run database migrations
pnpm db:seed          # Seed development data

# Documentation
pnpm docs:dev         # Start documentation server
pnpm docs:build       # Build documentation
```

### Package Structure
- **`apps/`**: Runnable applications (services)
- **`packages/`**: Shared libraries and utilities
- **`docs/`**: Documentation website (Docusaurus)

## 🧪 Development

### Adding a New Package
```bash
# Create new package
mkdir packages/new-package
cd packages/new-package
pnpm init

# Update root package.json workspaces
# Add package to turbo.json pipeline
```

### Code Standards
- TypeScript for all JavaScript/Node.js code
- Python 3.11+ for AI services
- ESLint + Prettier for code formatting
- Conventional commits for version control
- Automated testing with Jest and pytest

## 🔧 Infrastructure

### Local Development
All services run in Docker containers for consistency:
- PostgreSQL (database)
- Redis (cache)
- InfluxDB (time-series data)
- RabbitMQ (message queue)
- MinIO (object storage)
- Prometheus + Grafana (monitoring)

### MySQL Access
The local MySQL container is defined in `infra/docker-compose.yml` and is exposed as `127.0.0.1:3307 -> container:3306`.

Use the repo helper instead of installing a separate client first:

```bash
./scripts/mysql-access.sh list-db
./scripts/mysql-access.sh shell
./scripts/mysql-access.sh query "SHOW DATABASES;"
```

If you prefer npm scripts:

```bash
npm run db:mysql:list
npm run db:mysql
```

Default credentials follow the Compose file:

```text
MYSQL_USER=root
MYSQL_PASSWORD=change_me
MYSQL_PORT=3307
MYSQL_CONTAINER_NAME=mysql
```

When present, `.env` and `.env.vault` are loaded automatically before those defaults are used.

### Production Deployment
- Kubernetes manifests in `infra/k8s/`
- Terraform configurations (coming soon)
- CI/CD with GitHub Actions

## 🤖 AI Development

### AI Engine Features
- **LangChain** for agent orchestration
- **Predictive maintenance** models
- **Quality control** with computer vision
- **Natural language** interfaces
- **Reinforcement learning** for optimization

### Shared Types
The `packages/shared-types/` package is the single source of truth for:
- TypeScript interfaces
- Python Pydantic models
- API request/response schemas
- Database models

## 📚 Documentation

- **User Guide**: Getting started and usage
- **API Reference**: Complete API documentation
- **Architecture**: System design and deployment
- **Contributing**: Development guidelines

Run documentation locally:
```bash
cd docs
pnpm start
```

## 🛡️ Security

- Environment variables for secrets
- HashiCorp Vault bootstrap script for local secret scoping
- JWT authentication
- Role-based access control
- Input validation
- Rate limiting
- Security headers

## 🔐 Vault Setup

For local development, the repo now includes a Vault dev service plus a bootstrap flow that uses the root token once, then creates a read-only AppRole for the shared dev paths.

```bash
# 0. Provide the dev root token locally, never in git
export VAULT_DEV_ROOT_TOKEN_ID='<your-local-root-token>'

# 1. Start Vault locally
docker compose -p sentient_factory -f infra/docker-compose.yml up -d vault

# 2. Bootstrap KV + policy + AppRole using the temporary root token
export VAULT_ADDR=http://127.0.0.1:8200
export VAULT_TOKEN="$VAULT_DEV_ROOT_TOKEN_ID"
npm run vault:bootstrap:dev

# 3. Exchange AppRole credentials for a short-lived token
export ROLE_ID=<printed-role-id>
export SECRET_ID=<printed-secret-id>
export VAULT_TOKEN="$(./scripts/vault-approle-login.sh)"

# Or mint a fresh AppRole token automatically from the local dev root token
export VAULT_TOKEN="$(npm run --silent vault:login:dev)"

# 4a. Render env files for apps that still consume env files directly
npm run vault:render:root
npm run vault:render:api
npm run vault:render:web
npm run vault:render:myerp

# Or render + start Docker services in one command
npm run docker:up:vault

# 4b. Start api-gateway with direct Vault loading
cd apps/api-gateway
VAULT_ENABLED=true \
VAULT_ADDR=http://127.0.0.1:8200 \
VAULT_KV_MOUNT=secret \
VAULT_SECRETS_PATH=sentient-factory/dev/api-gateway \
npm run start:dev
```

Vault paths used by default:

- `secret/sentient-factory/dev/shared`

## AI Manager Dashboard

Untuk menyalakan AI engine yang dipakai halaman manager dashboard:

```bash
export VAULT_DEV_ROOT_TOKEN_ID=change-me-local-only
docker compose -p sentient_factory -f infra/docker-compose.yml up -d ai-engine web-dashboard
```

Health check:

```bash
curl http://127.0.0.1:8001/health
```

Smoke test route dashboard:

```bash
curl -X POST http://127.0.0.1:3201/api/ai/chat \
  -H 'Content-Type: application/json' \
  -d '{"question":"Tabel apa yang relevan untuk user dan role?","include_schema":true,"include_samples":false}'
```

Halaman yang mengonsumsi AI engine:

```text
http://127.0.0.1:3201/app/dashboard/manager
```

## AI Manager Runbook

Manager dashboard AI memakai dua service:

- `sentient-infra-ai-engine`
- `sentient-infra-web-dashboard`

Start cepat:

```bash
VAULT_DEV_ROOT_TOKEN_ID=change-me-local-only \
docker compose -p sentient_factory -f infra/docker-compose.yml up -d ai-engine web-dashboard
```

Health check:

```bash
curl http://127.0.0.1:8001/health
curl -X POST http://127.0.0.1:3201/api/ai/chat \
  -H 'Content-Type: application/json' \
  -d '{"question":"Tabel apa yang relevan untuk user dan role?","include_schema":true,"include_samples":false}'
```

URL utama:

- Manager dashboard: `http://127.0.0.1:3201/app/dashboard/manager`
- `secret/sentient-factory/dev/api-gateway`
- `secret/sentient-factory/dev/web-dashboard`
- `secret/sentient-factory/dev/myerpplus-db-mapping`

The `api-gateway` loads secrets from Vault before Nest boots. Other apps can render `.env.vault` from Vault with the helper scripts, while `.env.example` files stay committed as safe templates.

`infra/docker-compose.yml` now reads `.env.vault` overlays when present, so Vault-rendered values override the plain `.env` fallback without committing secrets.

`infra/docker-compose.yml` no longer contains a fallback root token. Set `VAULT_DEV_ROOT_TOKEN_ID` only in your local shell or an ignored local env file before starting Vault.

Recommended local-only pattern:

```bash
cp infra/.env.vault.local.example infra/.env.vault.local
# edit infra/.env.vault.local with your own root token
set -a
. infra/.env.vault.local
set +a
docker compose -p sentient_factory -f infra/docker-compose.yml up -d vault
```

If you want to remove plaintext secrets from local env files after migrating them to Vault:

```bash
npm run env:cleanup:plain
```

That command creates timestamped backups first, then replaces `.env` files with the corresponding safe `.env.example` templates.

To export all login variables in one shot for your current shell:

```bash
eval "$(./scripts/vault-login-dev.sh --export)"
```

## 📈 Monitoring & Observability

- Structured logging with correlation IDs
- Distributed tracing with Jaeger
- Metrics collection with Prometheus
- Dashboards with Grafana
- Alerting with AlertManager

## 🤝 Contributing

See [CONTRIBUTING.md](docs/docs/contributing.md) for detailed guidelines.

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [docs.sentientfactory.com](https://docs.sentientfactory.com)
- **Issues**: [GitHub Issues](https://github.com/sentient-factory/sentient-factory/issues)
- **Discord**: [Join our community](https://discord.gg/sentient-factory)
- **Email**: support@sentientfactory.com
