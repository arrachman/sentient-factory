---
sidebar_position: 1
---

# API Endpoints

Documentation for Sentient Factory API endpoints.

## Authentication Endpoints

### POST /api/auth/login

Login to get authentication token.

### POST /api/auth/register

Register new user account.

## Factory Management

### GET /api/factories

List all factories.

### GET /api/factories/\{id\}

Get factory details.

### POST /api/factories

Create new factory.

## Production Data

### GET /api/production

Get production data.

### POST /api/production/start

Start production batch.

## AI Agents

### GET /api/agents

List AI agents.

### POST /api/agents/\{id\}/command

Send command to agent.

## Analytics

### GET /api/analytics/dashboard

Get dashboard data.

### GET /api/analytics/predictions

Get production predictions.
