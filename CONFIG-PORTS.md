# Port Configuration for Sentient Factory Monorepo

Single source of truth: `config/ports.json`

## Overview

The monorepo contains multiple applications that need to run on different ports to avoid conflicts. This configuration system provides:

1. **Single source of truth** - Only one config file (`config/ports.json`)
2. **No redundant files** - No `.env.ports`, dynamic env var generation
3. **Port conflict detection** - Automatic port availability checks
4. **Easy management via CLI** - Comprehensive port manager

## Configuration File

### `config/ports.json` (Single Source of Truth)

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
  },
  "services": {
    "docs": {
      "name": "Documentation",
      "port": 3105,
      "type": "docs",
      "envVar": "DOCS_PORT",
      "description": "Project documentation"
    }
  }
}
```

## Current Port Assignments

| Application   | Port | Status      | Type    | Env Variable         | Description              |
| ------------- | ---- | ----------- | ------- | -------------------- | ------------------------ |
| Web Dashboard | 3101 | ✅ Active   | Next.js | `WEB_DASHBOARD_PORT` | Administration dashboard |
| Landing Page  | 3102 | ✅ Active   | Next.js | `LANDING_PAGE_PORT`  | Marketing website        |
| API Gateway   | 3103 | ✅ Active   | Fastify | `API_GATEWAY_PORT`   | Backend API server       |
| AI Engine     | 3104 | ⏸️ Inactive | Node.js | `AI_ENGINE_PORT`     | AI processing service    |
| Documentation | 3105 | ⏸️ Inactive | Docs    | `DOCS_PORT`          | Project documentation    |

## Usage

### Starting All Applications

```bash
# Start all services (infra + apps) via Docker Compose
docker compose -p sentient_factory -f infra/docker-compose.yml up -d
```

### Port Management Commands

```bash
# List all port configurations with active status
npm run ports:list

# Check if a port is available
npm run ports:check web-dashboard

# Find available port starting from 3000
npm run ports:find 3000

# Update port for an application
npm run ports:update web-dashboard 3101

# Toggle active status of application
npm run ports:toggle api-gateway

# Set active status explicitly
npm run ports:active ai-engine true

# Generate environment variables
npm run ports:env

# Generate start commands (active apps only)
npm run ports:commands
```

### Starting Individual Applications

```bash
# Method 1: Generate and use env vars
npm run ports:env
# Copy output to shell, then:
cd apps/web-dashboard
npm run dev

# Method 2: Set env var directly
WEB_DASHBOARD_PORT=3101 npm run dev

# Method 3: Use port manager to start
cd apps/web-dashboard
$(npm run ports:commands | grep -A2 "Web Dashboard" | tail -1)
```

## How It Works

### 1. Single Config File

- All port configurations in `config/ports.json`
- No redundant `.env.ports` file
- JSON structure for easy editing and validation

### 2. Dynamic Environment Variables

- Generate env vars on-demand: `npm run ports:env`
- Scripts read directly from config
- No manual env file maintenance

### 3. Port Conflict Detection

- Automatic port availability checks
- Find alternative ports when conflicts occur
- Real-time status in `ports:list`

### 4. Active Status Management

- Toggle active status: `ports:toggle <app>`
- Set active status: `ports:active <app> <true|false>`
- Only active apps are tracked as active in `config/ports.json`
- Inactive apps are skipped automatically

### 5. CLI Management

- Update ports: `ports:update <app> <port>`
- Check availability: `ports:check <app>`
- Find available ports: `ports:find <start>`

## Examples

### Update a Port

```bash
# Update landing page to port 3202
npm run ports:update landing-page 3202

# Verify the change
npm run ports:list
```

### Generate Environment Variables

```bash
npm run ports:env
# Output:
# export WEB_DASHBOARD_PORT=3101
# export NEXT_PUBLIC_WEB_DASHBOARD_PORT=3101
# export LANDING_PAGE_PORT=3102
# ...
```

### Generate Start Commands

```bash
npm run ports:commands
# Output:
# # Web Dashboard
# cd apps/web-dashboard
# WEB_DASHBOARD_PORT=3101 npm run dev
# ...
```

## Troubleshooting

### Port Already in Use

```bash
# Check what's using the port
npm run ports:check web-dashboard

# Find alternative port
npm run ports:find 3101

# Update to available port
npm run ports:update web-dashboard 3107
```

### Application Not Starting

1. Check port configuration: `npm run ports:list`
2. Verify port availability: `npm run ports:check <app>`
3. Check application logs for errors

### Script Errors

Ensure `config/ports.json` exists and is valid JSON:

```bash
# Validate config
node -c config/ports.json
```

## Best Practices

1. **Use sequential ports**: 3101, 3102, 3103, etc.
2. **Check before updating**: Always run `ports:check` before changing ports
3. **Use CLI tools**: Prefer `ports:update` over manual config editing
4. **Document changes**: Update this document when changing port assignments
5. **Test port availability**: Run `ports:list` to see current status

## Development Notes

- Ports 3100-3199 are reserved for applications
- Ports 5432, 6379, 8086, etc. are for services
- The system reads directly from `config/ports.json`
- No environment files to maintain or sync
- All scripts use the same single source of truth
