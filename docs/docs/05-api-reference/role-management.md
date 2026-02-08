# Role & Permission Management API

API endpoints for managing user roles and permissions.

## Overview

These endpoints support the features described in tickets F0009-F0012.

## Endpoints

### List Roles (F0009)

**GET** `/api/roles`

List all available roles, optionally including user counts.

**Query Parameters:**

- `includeUserCount` (optional, boolean): Whether to return the count of users assigned to each role.
- `search` (optional): Search by role name.

**Response:**

```json
{
  "success": true,
  "data": {
    "roles": [
      {
        "id": "role_1",
        "name": "Administrator",
        "description": "Full access to all resources",
        "permissions": ["all"],
        "userCount": 5,
        "isSystem": true
      },
      {
        "id": "role_2",
        "name": "Operator",
        "description": "Can operate machines and view reports",
        "permissions": ["machine:read", "machine:operate", "report:read"],
        "userCount": 12,
        "isSystem": false
      }
    ]
  }
}
```

### Get Role Details (F0010)

**GET** `/api/roles/{id}`

Get details for a specific role, including its permissions.

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "role_2",
    "name": "Operator",
    "description": "Can operate machines and view reports",
    "permissions": ["machine:read", "machine:operate", "report:read"],
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-15T00:00:00Z"
  }
}
```

### Create Role (F0010)

**POST** `/api/roles`

Create a new custom role.

**Request Body:**

```json
{
  "name": "Maintenance Manager",
  "description": "Manage maintenance schedules and technicians",
  "permissions": ["maintenance:read", "maintenance:write", "technician:read"]
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "role_3",
    "name": "Maintenance Manager",
    "permissions": ["maintenance:read", "maintenance:write", "technician:read"]
  },
  "message": "Role created successfully"
}
```

### Update Role (F0010)

**PUT** `/api/roles/{id}`

Update an existing role's name, description, or permissions.

**Request Body:**

```json
{
  "name": "Senior Maintenance Manager",
  "permissions": [
    "maintenance:read",
    "maintenance:write",
    "technician:read",
    "technician:write"
  ]
}
```

**Response:**

```json
{
  "success": true,
  "message": "Role updated successfully"
}
```

### Delete Role (F0010)

**DELETE** `/api/roles/{id}`

Delete a custom role. System roles cannot be deleted. If users are assigned to this role, the deletion might be blocked or require reassignment logic.

**Response:**

```json
{
  "success": true,
  "message": "Role deleted successfully"
}
```

### List Permissions (F0011)

**GET** `/api/permissions`

List all available system permissions, grouped by module.

**Response:**

```json
{
  "success": true,
  "data": {
    "modules": [
      {
        "name": "User Management",
        "permissions": [
          { "code": "user:read", "description": "View users" },
          { "code": "user:write", "description": "Create/Edit users" },
          { "code": "user:delete", "description": "Delete users" }
        ]
      },
      {
        "name": "Machine Management",
        "permissions": [
          { "code": "machine:read", "description": "View machines" },
          { "code": "machine:operate", "description": "Start/Stop machines" }
        ]
      }
    ]
  }
}
```

### Assign Roles to Users (F0012)

**POST** `/api/roles/assign`

Bulk assign roles to one or more users.

**Request Body:**

```json
{
  "userIds": ["user_123", "user_456"],
  "roleId": "role_2"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Roles assigned successfully to 2 users"
}
```
