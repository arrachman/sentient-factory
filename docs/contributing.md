---
sidebar_position: 4
---

# Contributing Guide

Thank you for your interest in contributing to Sentient Factory! This document provides guidelines and instructions for contributing to the project.

## Code of Conduct

Please read and follow our [Code of Conduct](CODE_OF_CONDUCT.md). We are committed to providing a welcoming and inclusive environment for all contributors.

## Getting Started

### Prerequisites
- Git
- Node.js 20+
- Docker and Docker Compose
- PostgreSQL 14+
- Python 3.11+ (for AI services)

### Development Setup

1. **Fork the Repository**
   ```bash
   # Fork on GitHub, then clone your fork
   git clone https://github.com/YOUR_USERNAME/sentient-factory.git
   cd sentient-factory
   ```

2. **Set Up Development Environment**
   ```bash
   # Install dependencies
   npm install
   
   # Set up environment variables
   cp .env.example .env
   # Edit .env with your configuration
   
   # Start development services
   docker-compose up -d
   
   # Run database migrations
   npm run migrate:up
   
   # Seed development data
   npm run seed:dev
   ```

3. **Start Development Servers**
   ```bash
   # Start API gateway
   npm run dev:api
   
   # Start frontend
   npm run dev:frontend
   
   # Start AI services
   npm run dev:ai
   ```

## Development Workflow

### Branch Strategy
- `main`: Production-ready code
- `develop`: Integration branch for features
- `feature/*`: New features
- `bugfix/*`: Bug fixes
- `hotfix/*`: Critical production fixes

### Creating a New Feature
```bash
# Create and switch to feature branch
git checkout -b feature/your-feature-name develop

# Make your changes
# Add tests
# Update documentation

# Commit changes
git add .
git commit -m "feat: add your feature description"

# Push to your fork
git push origin feature/your-feature-name
```

### Commit Message Convention
We follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

Example:
```
feat(api): add user authentication endpoint

- Add POST /auth/login endpoint
- Implement JWT token generation
- Add input validation
- Add unit tests

Closes #123
```

## Testing

### Running Tests
```bash
# Run all tests
npm test

# Run specific test suite
npm run test:unit
npm run test:integration
npm run test:e2e

# Run tests with coverage
npm run test:coverage

# Run linting
npm run lint

# Run type checking
npm run typecheck
```

### Writing Tests
- Unit tests: Test individual functions/components
- Integration tests: Test service interactions
- E2E tests: Test complete user flows

Example unit test:
```javascript
// tests/unit/auth.service.test.js
describe('AuthService', () => {
  it('should authenticate valid user', async () => {
    const result = await authService.login('user@example.com', 'password');
    expect(result.success).toBe(true);
    expect(result.token).toBeDefined();
  });
  
  it('should reject invalid credentials', async () => {
    await expect(
      authService.login('user@example.com', 'wrong')
    ).rejects.toThrow('Invalid credentials');
  });
});
```

## Code Style

### JavaScript/TypeScript
- Use ESLint and Prettier
- Follow Airbnb JavaScript Style Guide
- Use TypeScript for type safety

### Python
- Use Black for formatting
- Follow PEP 8 guidelines
- Use type hints

### Database
- Use migrations for schema changes
- Follow naming conventions:
  - Tables: snake_case, plural
  - Columns: snake_case
  - Foreign keys: table_name_id

### API Design
- RESTful principles
- JSON:API specification for responses
- Consistent error handling
- Versioned endpoints (/v1/, /v2/)

## Documentation

### Updating Documentation
1. **Code Documentation**: Use JSDoc for JavaScript/TypeScript
2. **API Documentation**: Update OpenAPI/Swagger specs
3. **User Documentation**: Update Markdown files in `/docs`
4. **README Updates**: Keep README current

### Adding New Documentation
```bash
# Create new documentation page
touch docs/feature-name.md

# Add to sidebar in sidebars.ts
{
  "type": "doc",
  "id": "feature-name",
  "label": "Feature Name"
}
```

## Pull Request Process

1. **Create Pull Request**
   - Target the `develop` branch
   - Fill out the PR template completely
   - Link related issues

2. **PR Checklist**
   - [ ] Tests pass
   - [ ] Code follows style guidelines
   - [ ] Documentation updated
   - [ ] No breaking changes
   - [ ] Commit messages follow convention

3. **Code Review**
   - Address review comments
   - Update PR as needed
   - Request re-review when ready

4. **Merge Approval**
   - Requires 2 approvals
   - All checks must pass
   - No unresolved discussions

## Project Structure

```
sentient-factory/
├── api-gateway/          # API Gateway service
├── auth-service/         # Authentication service
├── device-management/    # IoT device management
├── data-ingestion/       # Data collection service
├── analytics-engine/     # Analytics processing
├── ai-services/          # AI/ML services
├── frontend/            # Web dashboard
├── shared/              # Shared utilities
├── docs/                # Documentation
├── tests/               # Test suites
├── docker/              # Docker configurations
└── k8s/                 # Kubernetes manifests
```

## Development Tools

### Docker Compose Services
```yaml
services:
  postgres:      # Database
  redis:         # Cache
  influxdb:      # Time series data
  minio:         # Object storage
  rabbitmq:      # Message queue
  jaeger:        # Distributed tracing
  prometheus:    # Metrics
  grafana:       # Dashboards
```

### Useful Scripts
```bash
# Development
npm run dev              # Start all services
npm run dev:api          # Start API services
npm run dev:frontend     # Start frontend

# Database
npm run migrate:create   # Create new migration
npm run migrate:up       # Run migrations
npm run migrate:down     # Rollback migration
npm run seed:dev         # Seed development data

# Testing
npm run test:watch       # Run tests in watch mode
npm run test:debug       # Debug tests

# Quality
npm run lint:fix         # Fix linting issues
npm run format           # Format code
npm run audit            # Security audit
```

## Troubleshooting

### Common Issues

1. **Database Connection Issues**
   ```bash
   # Check if PostgreSQL is running
   docker ps | grep postgres
   
   # Reset database
   npm run db:reset
   ```

2. **Port Conflicts**
   ```bash
   # Check used ports
   lsof -i :3000
   
   # Kill process on port
   kill $(lsof -t -i :3000)
   ```

3. **Docker Issues**
   ```bash
   # Rebuild containers
   docker-compose down
   docker-compose build --no-cache
   docker-compose up -d
   ```

### Getting Help
- Check existing issues on GitHub
- Join our [Discord community](https://discord.gg/sentient-factory)
- Ask in GitHub Discussions
- Contact maintainers

## Release Process

### Versioning
We follow [Semantic Versioning](https://semver.org/):
- MAJOR: Breaking changes
- MINOR: New features (backward compatible)
- PATCH: Bug fixes (backward compatible)

### Release Steps
1. Create release branch from `develop`
2. Update version in package.json
3. Update CHANGELOG.md
4. Run full test suite
5. Create PR to `main`
6. Merge and tag release
7. Deploy to production
8. Merge back to `develop`

## Recognition

Contributors are recognized in:
- GitHub contributors list
- Project README
- Release notes
- Community announcements

## License

By contributing, you agree that your contributions will be licensed under the project's [MIT License](LICENSE).