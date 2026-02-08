# User Management API

API endpoints for managing users within the Admin Dashboard.

## Overview

These endpoints support the features described in tickets F0004-F0008.

## Endpoints

### List Users (F0004)

**GET** `/api/users`

List all users with pagination, sorting, and filtering.

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `search` (optional): Search by name or email
- `role` (optional): Filter by role
- `status` (optional): Filter by status (`active`, `inactive`, `suspended`)
- `sortBy` (optional): Field to sort by (`name`, `email`, `createdAt`, `status`)
- `sortOrder` (optional): `asc` or `desc`

**Response:**

```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": "user_123",
        "email": "user@example.com",
        "firstName": "John",
        "lastName": "Doe",
        "role": "admin",
        "status": "active",
        "avatarUrl": "https://...",
        "createdAt": "2024-01-01T00:00:00Z"
      }
    ],
    "meta": {
      "page": 1,
      "limit": 10,
      "total": 50,
      "totalPages": 5
    }
  }
}
```

### Create User (F0005)

**POST** `/api/users`

Create a new user account.

**Request Body:**

```json
{
  "email": "newuser@example.com",
  "firstName": "Jane",
  "lastName": "Smith",
  "password": "InitialPassword123!",
  "role": "manager",
  "sendWelcomeEmail": true
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "user_456",
    "email": "newuser@example.com",
    "firstName": "Jane",
    "lastName": "Smith",
    "role": "manager",
    "status": "active",
    "createdAt": "2024-02-01T10:00:00Z"
  },
  "message": "User created successfully"
}
```

### Get User Details (F0006)

**GET** `/api/users/{id}`

Get detailed profile information for a specific user.

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "user_123",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "admin",
    "status": "active",
    "phone": "+1234567890",
    "department": "IT",
    "position": "Lead Developer",
    "avatarUrl": "https://...",
    "twoFactorEnabled": true,
    "lastLogin": "2024-02-07T09:00:00Z"
  }
}
```

### Update User (F0006)

**PUT** `/api/users/{id}`

Update user profile information.

**Request Body:**

```json
{
  "firstName": "Jonathan",
  "lastName": "Doe",
  "role": "super_admin",
  "department": "Engineering",
  "position": "CTO"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "user_123",
    "firstName": "Jonathan",
    "lastName": "Doe",
    "role": "super_admin",
    "updatedAt": "2024-02-07T12:00:00Z"
  },
  "message": "User updated successfully"
}
```

### Delete User (F0007)

**DELETE** `/api/users/{id}`

Soft delete a user account.

**Request Body (Optional for audit):**

```json
{
  "reason": "Employee left the company"
}
```

**Response:**

```json
{
  "success": true,
  "message": "User deactivated successfully"
}
```

### Restore User (F0007)

**PUT** `/api/users/{id}/restore`

Restore a soft-deleted user account.

**Response:**

```json
{
  "success": true,
  "message": "User restored successfully"
}
```

### Get Current User Profile (F0008)

**GET** `/api/profile`

Get the profile of the currently authenticated user.

**Response:**

Similar to `GET /api/users/{id}` but for the current user.

### Change Password (F0008)

**PUT** `/api/profile/password`

Change the current user's password.

**Request Body:**

```json
{
  "currentPassword": "oldPassword123",
  "newPassword": "newSecurePassword456!",
  "confirmNewPassword": "newSecurePassword456!"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

### Update Avatar (F0008)

**POST** `/api/profile/avatar`

Upload and update the user's profile picture.

**Content-Type:** `multipart/form-data`

**Form Data:**

- `file`: (Binary file data)

**Response:**

```json
{
  "success": true,
  "data": {
    "avatarUrl": "https://storage.sentientfactory.com/avatars/user_123.jpg"
  },
  "message": "Avatar updated successfully"
}
```
