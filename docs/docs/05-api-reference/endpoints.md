# API Endpoints

## Overview

Sentient Factory provides a comprehensive REST API for managing factories, production lines, sensors, and AI predictions.

## Base URL

```
https://api.sentientfactory.com/v1
```

## Authentication

All API requests require authentication using JWT tokens.

### Headers

```http
Authorization: Bearer <your_jwt_token>
Content-Type: application/json
```

## Response Format

All responses follow this format:

```json
{
  "success": true,
  "data": {},
  "message": "Operation successful",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

Error responses:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {
      "field": "email",
      "reason": "Email is required"
    }
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

## Authentication Endpoints

### Login

**POST** `/auth/login`

Authenticate a user and receive a JWT token.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "user_123",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "admin"
    }
  },
  "message": "Login successful"
}
```

### Register

**POST** `/auth/register`

Register a new user account.

**Request Body:**

```json
{
  "email": "newuser@example.com",
  "password": "securepassword123",
  "name": "Jane Smith",
  "company": "Sentient Corp"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_456",
      "email": "newuser@example.com",
      "name": "Jane Smith",
      "role": "user"
    }
  },
  "message": "Registration successful"
}
```

### Refresh Token

**POST** `/auth/refresh`

Refresh an expired JWT token.

**Request Body:**

```json
{
  "refreshToken": "refresh_token_here"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "token": "new_jwt_token_here"
  },
  "message": "Token refreshed"
}
```

## Factory Management

### List Factories

**GET** `/factories`

Get a list of all factories accessible to the user.

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)
- `status` (optional): Filter by status (active, inactive, maintenance)
- `type` (optional): Filter by factory type

**Response:**

```json
{
  "success": true,
  "data": {
    "factories": [
      {
        "id": "factory_123",
        "name": "Main Production Facility",
        "location": "123 Industrial Park, City",
        "type": "manufacturing",
        "status": "active",
        "ownerId": "user_123",
        "createdAt": "2024-01-01T00:00:00Z",
        "updatedAt": "2024-01-15T10:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 45,
      "pages": 3
    }
  }
}
```

### Get Factory

**GET** `/factories/{id}`

Get detailed information about a specific factory.

**Response:**

```json
{
  "success": true,
  "data": {
    "factory": {
      "id": "factory_123",
      "name": "Main Production Facility",
      "location": "123 Industrial Park, City",
      "type": "manufacturing",
      "status": "active",
      "ownerId": "user_123",
      "capacity": 1000,
      "description": "Primary manufacturing facility",
      "config": {
        "timezone": "America/New_York",
        "units": "metric",
        "workingHours": {
          "start": "08:00",
          "end": "20:00"
        }
      },
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    },
    "stats": {
      "productionLines": 5,
      "activeSensors": 42,
      "todayOutput": 1250,
      "efficiency": 92.5
    }
  }
}
```

### Create Factory

**POST** `/factories`

Create a new factory.

**Request Body:**

```json
{
  "name": "New Production Facility",
  "location": "456 Tech Park, City",
  "type": "assembly",
  "capacity": 500,
  "description": "New assembly line facility",
  "config": {
    "timezone": "America/Chicago",
    "units": "imperial"
  }
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "factory": {
      "id": "factory_789",
      "name": "New Production Facility",
      "location": "456 Tech Park, City",
      "type": "assembly",
      "status": "active",
      "ownerId": "user_123",
      "capacity": 500,
      "description": "New assembly line facility",
      "config": {
        "timezone": "America/Chicago",
        "units": "imperial",
        "workingHours": {
          "start": "08:00",
          "end": "20:00"
        }
      },
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  },
  "message": "Factory created successfully"
}
```

### Update Factory

**PUT** `/factories/{id}`

Update an existing factory.

**Request Body:**

```json
{
  "name": "Updated Facility Name",
  "location": "Updated Location",
  "capacity": 750,
  "config": {
    "workingHours": {
      "start": "07:00",
      "end": "19:00"
    }
  }
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "factory": {
      "id": "factory_123",
      "name": "Updated Facility Name",
      "location": "Updated Location",
      "type": "manufacturing",
      "status": "active",
      "ownerId": "user_123",
      "capacity": 750,
      "config": {
        "timezone": "America/New_York",
        "units": "metric",
        "workingHours": {
          "start": "07:00",
          "end": "19:00"
        }
      },
      "updatedAt": "2024-01-15T11:00:00Z"
    }
  },
  "message": "Factory updated successfully"
}
```

### Delete Factory

**DELETE** `/factories/{id}`

Delete a factory.

**Response:**

```json
{
  "success": true,
  "message": "Factory deleted successfully"
}
```

## Production Line Management

### List Production Lines

**GET** `/factories/{factoryId}/production-lines`

Get all production lines for a factory.

**Query Parameters:**

- `status` (optional): Filter by status
- `type` (optional): Filter by line type

**Response:**

```json
{
  "success": true,
  "data": {
    "productionLines": [
      {
        "id": "line_123",
        "factoryId": "factory_123",
        "name": "Assembly Line A",
        "type": "assembly",
        "status": "active",
        "capacity": 100,
        "currentOutput": 85,
        "efficiency": 92.3,
        "createdAt": "2024-01-01T00:00:00Z",
        "updatedAt": "2024-01-15T10:30:00Z"
      }
    ]
  }
}
```

### Get Production Line

**GET** `/production-lines/{id}`

Get detailed information about a production line.

**Response:**

```json
{
  "success": true,
  "data": {
    "productionLine": {
      "id": "line_123",
      "factoryId": "factory_123",
      "name": "Assembly Line A",
      "type": "assembly",
      "status": "active",
      "capacity": 100,
      "config": {
        "speed": "medium",
        "automationLevel": "high",
        "qualityThreshold": 95
      },
      "metrics": {
        "currentOutput": 85,
        "efficiency": 92.3,
        "qualityScore": 96.7,
        "downtime": 45,
        "maintenanceDue": "2024-01-20"
      },
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  }
}
```

### Create Production Line

**POST** `/factories/{factoryId}/production-lines`

Create a new production line.

**Request Body:**

```json
{
  "name": "New Assembly Line",
  "type": "assembly",
  "capacity": 150,
  "config": {
    "speed": "high",
    "automationLevel": "medium",
    "qualityThreshold": 97
  }
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "productionLine": {
      "id": "line_456",
      "factoryId": "factory_123",
      "name": "New Assembly Line",
      "type": "assembly",
      "status": "active",
      "capacity": 150,
      "config": {
        "speed": "high",
        "automationLevel": "medium",
        "qualityThreshold": 97
      },
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  },
  "message": "Production line created successfully"
}
```

## Sensor Management

### List Sensors

**GET** `/production-lines/{lineId}/sensors`

Get all sensors for a production line.

**Query Parameters:**

- `type` (optional): Filter by sensor type
- `status` (optional): Filter by status

**Response:**

```json
{
  "success": true,
  "data": {
    "sensors": [
      {
        "id": "sensor_123",
        "productionLineId": "line_123",
        "name": "Temperature Sensor 1",
        "type": "temperature",
        "sensorId": "TEMP-001",
        "location": "Zone A",
        "status": "active",
        "lastReading": {
          "value": 25.5,
          "unit": "°C",
          "timestamp": "2024-01-15T10:29:30Z"
        },
        "calibrationDate": "2024-01-01",
        "createdAt": "2024-01-01T00:00:00Z"
      }
    ]
  }
}
```

### Get Sensor Data

**GET** `/sensors/{id}/data`

Get historical data for a sensor.

**Query Parameters:**

- `start` (required): Start timestamp (ISO 8601)
- `end` (required): End timestamp (ISO 8601)
- `interval` (optional): Data aggregation interval (1m, 5m, 1h, 1d)
- `limit` (optional): Maximum data points (default: 1000)

**Response:**

```json
{
  "success": true,
  "data": {
    "sensor": {
      "id": "sensor_123",
      "name": "Temperature Sensor 1",
      "type": "temperature",
      "unit": "°C"
    },
    "readings": [
      {
        "timestamp": "2024-01-15T10:00:00Z",
        "value": 24.8,
        "quality": 0.95
      },
      {
        "timestamp": "2024-01-15T10:05:00Z",
        "value": 25.1,
        "quality": 0.96
      }
    ],
    "summary": {
      "count": 120,
      "average": 25.3,
      "min": 24.5,
      "max": 26.1,
      "stdDev": 0.4
    }
  }
}
```

### Ingest Sensor Data

**POST** `/sensors/data`

Ingest real-time sensor data.

**Request Body:**

```json
{
  "sensorId": "TEMP-001",
  "readings": [
    {
      "timestamp": "2024-01-15T10:30:00Z",
      "value": 25.5,
      "quality": 0.97
    }
  ]
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "ingested": 1,
    "failed": 0,
    "timestamp": "2024-01-15T10:30:05Z"
  },
  "message": "Data ingested successfully"
}
```

## AI Predictions

### Get Predictions

**GET** `/predictions`

Get AI predictions for factories or production lines.

**Query Parameters:**

- `factoryId` (optional): Filter by factory
- `lineId` (optional): Filter by production line
- `type` (optional): Prediction type (maintenance, quality, optimization)
- `start` (optional): Start timestamp
- `end` (optional): End timestamp

**Response:**

```json
{
  "success": true,
  "data": {
    "predictions": [
      {
        "id": "pred_123",
        "productionLineId": "line_123",
        "type": "maintenance",
        "predictedEvent": "motor_failure",
        "probability": 0.85,
        "expectedTime": "2024-01-20T14:30:00Z",
        "confidence": 0.92,
        "recommendations": [
          "Schedule maintenance before 2024-01-18",
          "Check motor bearings",
          "Monitor vibration levels"
        ],
        "createdAt": "2024-01-15T10:30:00Z"
      }
    ]
  }
}
```

### Request Prediction

**POST** `/predictions/request`

Request a new prediction analysis.

**Request Body:**

```json
{
  "productionLineId": "line_123",
  "type": "quality",
  "parameters": {
    "timeHorizon": "24h",
    "confidenceThreshold": 0.8
  }
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "predictionId": "pred_456",
    "status": "processing",
    "estimatedCompletion": "2024-01-15T10:35:00Z"
  },
  "message": "Prediction request accepted"
}
```

### Get Prediction Result

**GET** `/predictions/{id}/result`

Get the result of a prediction request.

**Response:**

```json
{
  "success": true,
  "data": {
    "prediction": {
      "id": "pred_456",
      "status": "completed",
      "result": {
        "predictedDefectRate": 2.3,
        "confidence": 0.88,
        "keyFactors": [
          {
            "factor": "temperature_variation",
            "impact": 0.45
          },
          {
            "factor": "vibration_level",
            "impact": 0.32
          }
        ],
        "recommendations": [
          "Adjust temperature setpoint to 25°C",
          "Check conveyor belt tension"
        ]
      },
      "createdAt": "2024-01-15T10:30:00Z",
      "completedAt": "2024-01-15T10:32:15Z"
    }
  }
}
```

## Analytics

### Get Factory Analytics

**GET** `/factories/{id}/analytics`

Get comprehensive analytics for a factory.

**Query Parameters:**

- `period` (optional): Time period (day, week, month, quarter, year)
- `start` (optional): Custom start date
- `end` (optional): Custom end date

**Response:**

```json
{
  "success": true,
  "data": {
    "factoryId": "factory_123",
    "period": {
      "start": "2024-01-01T00:00:00Z",
      "end": "2024-01-15T23:59:59Z"
    },
    "metrics": {
      "production": {
        "totalOutput": 12500,
        "averageDaily": 833,
        "growth": 12.5
      },
      "efficiency": {
        "average": 92.3,
        "best": 96.7,
        "worst": 85.2
      },
      "quality": {
        "defectRate": 1.2,
        "reworkRate": 0.8,
        "customerSatisfaction": 94.5
      },
      "downtime": {
        "total": 125,
        "planned": 80,
        "unplanned": 45
      }
    },
    "trends": {
      "output": [
        { "date": "2024-01-01", "value": 800 },
        { "date": "2024-01-02", "value": 820 }
      ],
      "efficiency": [
        { "date": "2024-01-01", "value": 91.5 },
        { "date": "2024-01-02", "value": 92.1 }
      ]
    },
    "insights": [
      {
        "type": "improvement",
        "message": "Production efficiency increased by 5% after maintenance",
        "impact": "high",
        "timestamp": "2024-01-10T00:00:00Z"
      }
    ]
  }
}
```

### Get Comparative Analytics

**GET** `/analytics/comparative`

Compare metrics across multiple factories or time periods.

**Query Parameters:**

- `factoryIds` (required): Comma-separated factory IDs
- `metric` (required): Metric to compare (output, efficiency, quality, downtime)
- `period` (optional): Time period

**Response:**

```json
{
  "success": true,
  "data": {
    "comparison": [
      {
        "factoryId": "factory_123",
        "factoryName": "Main Facility",
        "metric": "efficiency",
        "value": 92.3,
        "rank": 1,
        "trend": "up"
      },
      {
        "factoryId": "factory_456",
        "factoryName": "Secondary Facility",
        "metric": "efficiency",
        "value": 88.7,
        "rank": 2,
        "trend": "stable"
      }
    ],
    "summary": {
      "average": 90.5,
      "best": 92.3,
      "worst": 88.7,
      "range": 3.6
    }
  }
}
```

## Alerts and Notifications

### List Alerts

**GET** `/alerts`

Get all active alerts.

**Query Parameters:**

- `factoryId` (optional): Filter by factory
- `lineId` (optional): Filter by production line
- `severity` (optional): Filter by severity (info, warning, critical)
- `status` (optional): Filter by status (active, acknowledged, resolved)

**Response:**

```json
{
  "success": true,
  "data": {
    "alerts": [
      {
        "id": "alert_123",
        "factoryId": "factory_123",
        "productionLineId": "line_123",
        "title": "High Temperature Alert",
        "description": "Temperature exceeded threshold of 30°C",
        "severity": "warning",
        "status": "active",
        "metric": "temperature",
        "value": 32.5,
        "threshold": 30.0,
        "timestamp": "2024-01-15T10:25:00Z",
        "acknowledgedAt": null,
        "resolvedAt": null
      }
    ]
  }
}
```

### Acknowledge Alert

**POST** `/alerts/{id}/acknowledge`

Acknowledge an alert.

**Response:**

```json
{
  "success": true,
  "data": {
    "alert": {
      "id": "alert_123",
      "status": "acknowledged",
      "acknowledgedAt": "2024-01-15T10:30:00Z",
      "acknowledgedBy": "user_123"
    }
  },
  "message": "Alert acknowledged"
}
```

### Resolve Alert

**POST** `/alerts/{id}/resolve`

Mark an alert as resolved.

**Request Body:**

```json
{
  "resolutionNotes": "Temperature returned to normal range after adjusting cooling system"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "alert": {
      "id": "alert_123",
      "status": "resolved",
      "resolvedAt": "2024-01-15T10:35:00Z",
      "resolvedBy": "user_123",
      "resolutionNotes": "Temperature returned to normal range after adjusting cooling system"
    }
  },
  "message": "Alert resolved"
}
```

## WebSocket API

### Connection

```
wss://api.sentientfactory.com/v1/ws
```

### Authentication

Send authentication message after connection:

```json
{
  "type": "auth",
  "token": "your_jwt_token"
}
```

### Subscribe to Updates

```json
{
  "type": "subscribe",
  "channel": "factory_updates",
  "factoryId": "factory_123"
}
```

### Real-time Updates

```json
{
  "type": "factory_update",
  "factoryId": "factory_123",
  "data": {
    "metric": "output",
    "value": 125,
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

### Alert Notifications

```json
{
  "type": "alert",
  "alert": {
    "id": "alert_456",
    "title": "New Alert",
    "severity": "critical",
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

## Rate Limiting

- **Standard**: 100 requests per minute per user
- **Burst**: 150 requests per minute (short periods)
- **WebSocket**: 50 messages per second

## Error Codes

- `AUTH_ERROR`: Authentication failed
- `VALIDATION_ERROR`: Invalid input data
- `NOT_FOUND`: Resource not found
- `PERMISSION_DENIED`: Insufficient permissions
- `RATE_LIMITED`: Rate limit exceeded
- `SERVER_ERROR`: Internal server error
- `MAINTENANCE`: Service under maintenance
