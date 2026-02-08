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
- JWT authentication
- Role-based access control
- Input validation
- Rate limiting
- Security headers

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