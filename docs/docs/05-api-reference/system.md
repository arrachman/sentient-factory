# System & Dashboard API

API endpoints for system-wide features, dashboard statistics, and data operations.

## Overview

These endpoints support the Admin Dashboard widgets (F0015) and system utilities like import/export (F0020).

## Dashboard Endpoints (F0015)

### Get Dashboard Statistics

**GET** `/api/dashboard/stats`

Get summary statistics for the admin dashboard.

**Response:**

```json
{
  "success": true,
  "data": {
    "totalUsers": 1250,
    "activeUsers": 850,
    "totalRoles": 12,
    "pendingInvites": 5,
    "systemHealth": "healthy",
    "activeSessions": 45
  }
}
```

### Get Recent Activity

**GET** `/api/dashboard/activity`

Get a feed of recent system activities for the dashboard widget.

**Response:**

```json
{
  "success": true,
  "data": {
    "activities": [
      {
        "id": "act_1",
        "type": "user_login",
        "user": "John Doe",
        "timestamp": "2024-02-07T10:00:00Z"
      },
      {
        "id": "act_2",
        "type": "alert_triggered",
        "details": "High CPU Usage",
        "timestamp": "2024-02-07T09:45:00Z"
      }
    ]
  }
}
```

### Get User Growth Chart Data

**GET** `/api/dashboard/chart/users`

Get data for the user growth chart.

**Query Parameters:**

- `period`: `7d`, `30d`, `90d`, `1y`

**Response:**

```json
{
  "success": true,
  "data": {
    "labels": ["Jan", "Feb", "Mar", "Apr"],
    "datasets": [
      {
        "label": "Total Users",
        "data": [1000, 1100, 1150, 1250]
      },
      {
        "label": "Active Users",
        "data": [800, 900, 950, 850]
      }
    ]
  }
}
```

## Data Operations (F0020)

### Import Users

**POST** `/api/users/import`

Bulk import users from a file (CSV/Excel).

**Content-Type:** `multipart/form-data`

**Form Data:**

- `file`: The file to upload.

**Response:**

```json
{
  "success": true,
  "data": {
    "processed": 100,
    "success": 98,
    "failed": 2,
    "errors": [
      { "row": 15, "error": "Invalid email format" },
      { "row": 42, "error": "Duplicate username" }
    ]
  },
  "message": "Import completed with warnings"
}
```

### Export Users

**GET** `/api/users/export`

Export user data to a file.

**Query Parameters:**

- `format`: `csv` or `excel` (default: `csv`)
- `role`: Filter export by role (optional)

**Response:**

- Returns a downloadable file stream with appropriate `Content-Disposition` headers.
