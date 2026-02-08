# Services Architecture

## Overview

Sentient Factory follows a microservices architecture with the following core services:

## Core Services

### 1. Authentication Service

**Purpose**: Handles user authentication and authorization
**Tech Stack**: Node.js, JWT, Redis
**Endpoints**:

- `/api/auth/login` - User login
- `/api/auth/register` - User registration
- `/api/auth/refresh` - Token refresh
- `/api/auth/logout` - User logout

### 2. Factory Management Service

**Purpose**: Manages factory data and configurations
**Tech Stack**: Node.js, PostgreSQL, TypeORM
**Endpoints**:

- `/api/factories` - CRUD operations for factories
- `/api/factories/:id/production-lines` - Manage production lines
- `/api/factories/:id/analytics` - Factory analytics

### 3. Sensor Data Service

**Purpose**: Handles real-time sensor data ingestion and processing
**Tech Stack**: Node.js, MQTT, PostgreSQL, TimescaleDB
**Endpoints**:

- `/api/sensors/data` - Ingest sensor data
- `/api/sensors/:id/history` - Get sensor history
- `/api/sensors/alerts` - Manage sensor alerts

### 4. AI Prediction Service

**Purpose**: Runs ML models for predictive maintenance and quality control
**Tech Stack**: Python, TensorFlow, FastAPI, Redis
**Endpoints**:

- `/api/predictions/maintenance` - Predictive maintenance
- `/api/predictions/quality` - Quality control predictions
- `/api/predictions/optimization` - Production optimization

### 5. Notification Service

**Purpose**: Sends notifications and alerts
**Tech Stack**: Node.js, WebSocket, Email/SMS providers
**Endpoints**:

- `/api/notifications` - Send notifications
- `/api/notifications/subscriptions` - Manage subscriptions
- `/api/notifications/history` - Notification history

## Data Flow

### Real-time Processing

```
Sensors → MQTT Broker → Sensor Data Service → Database
                                    ↓
                            AI Prediction Service
                                    ↓
                          Notification Service → Users
```

### Batch Processing

```
Database → ETL Pipeline → Data Warehouse → Analytics Dashboard
```

## Communication Patterns

### 1. Synchronous (HTTP/REST)

- User authentication
- CRUD operations
- Configuration management

### 2. Asynchronous (Message Queue)

- Sensor data ingestion
- AI model predictions
- Notification delivery

### 3. Real-time (WebSocket)

- Live dashboard updates
- Alert notifications
- Monitoring data streams

## Database Strategy

### Primary Database (PostgreSQL)

- User data
- Factory configurations
- Reference data

### Time-series Database (TimescaleDB)

- Sensor readings
- Historical data
- Performance metrics

### Cache (Redis)

- Session management
- API rate limiting
- Frequently accessed data

## Deployment

### Docker Containers

Each service runs in its own Docker container with:

- Health checks
- Resource limits
- Environment-specific configurations

### Kubernetes Orchestration

- Automatic scaling
- Service discovery
- Load balancing
- Rolling deployments

## Monitoring & Observability

### Metrics

- Request latency
- Error rates
- Resource utilization
- Business metrics

### Logging

- Structured logging (JSON)
- Centralized log aggregation
- Log retention policies

### Tracing

- Distributed tracing
- Performance analysis
- Dependency mapping
