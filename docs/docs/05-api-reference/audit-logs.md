# Audit Logs API

API endpoints for accessing system audit logs.

## Overview

These endpoints support the features described in ticket F0019.

## Endpoints

### List Audit Logs (F0019)

**GET** `/api/audit-logs`

List system audit logs with filtering and pagination.

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)
- `userId` (optional): Filter by user who performed the action
- `action` (optional): Filter by action type (e.g., `user:create`, `role:update`)
- `startDate` (optional): ISO 8601 start date
- `endDate` (optional): ISO 8601 end date
- `resourceId` (optional): Filter by target resource ID (e.g., a specific user ID being modified)

**Response:**

```json
{
  "success": true,
  "data": {
    "logs": [
      {
        "id": "log_123",
        "action": "user:create",
        "actor": {
          "id": "user_1",
          "name": "Admin User",
          "email": "admin@example.com"
        },
        "target": {
          "id": "user_456",
          "type": "user",
          "details": "Jane Smith"
        },
        "metadata": {
          "ipAddress": "192.168.1.1",
          "userAgent": "Mozilla/5.0..."
        },
        "changes": {
          "before": null,
          "after": { "role": "manager", "status": "active" }
        },
        "timestamp": "2024-02-07T14:30:00Z"
      }
    ],
    "meta": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "totalPages": 8
    }
  }
}
```

### Get Audit Log Details (F0019)

**GET** `/api/audit-logs/{id}`

Get detailed information about a specific audit log entry.

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "log_123",
    "action": "user:create",
    "actor": {
      "id": "user_1",
      "name": "Admin User"
    },
    "details": "Full detailed JSON of the change if available"
  }
}
```
