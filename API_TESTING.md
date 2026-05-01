# Team Task Manager - API Testing Guide

## Base URL
- Local: `http://localhost:5000`
- Production: `https://your-app.railway.app`

## Authentication

### 1. Sign Up
**POST** `/api/auth/signup`

Headers:
```
Content-Type: application/json
```

Body:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "Member"
}
```

Response:
```json
{
  "message": "User created successfully",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "Member"
  }
}
```

### 2. Login
**POST** `/api/auth/login`

Headers:
```
Content-Type: application/json
```

Body:
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "Member"
  }
}
```

Save the token for subsequent requests.

---

## Projects

### 3. Get All Projects
**GET** `/api/projects`

Headers:
```
Authorization: Bearer <your-token>
```

Response:
```json
[
  {
    "_id": "507f1f77bcf86cd799439012",
    "name": "Website Redesign",
    "description": "Redesign company website",
    "owner": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "members": [],
    "createdAt": "2024-05-01T10:00:00Z"
  }
]
```

### 4. Create Project
**POST** `/api/projects`

Headers:
```
Authorization: Bearer <your-token>
Content-Type: application/json
```

Body:
```json
{
  "name": "Mobile App",
  "description": "Build iOS and Android app",
  "members": ["507f1f77bcf86cd799439013"]
}
```

Response:
```json
{
  "_id": "507f1f77bcf86cd799439014",
  "name": "Mobile App",
  "description": "Build iOS and Android app",
  "owner": "507f1f77bcf86cd799439011",
  "members": ["507f1f77bcf86cd799439013"],
  "createdAt": "2024-05-01T10:00:00Z"
}
```

### 5. Update Project
**PUT** `/api/projects/:id`

Headers:
```
Authorization: Bearer <your-token>
Content-Type: application/json
```

Body (send fields to update):
```json
{
  "name": "Mobile App v2.0",
  "description": "Redesign mobile app UI"
}
```

### 6. Delete Project
**DELETE** `/api/projects/:id`

Headers:
```
Authorization: Bearer <your-token>
```

---

## Tasks

### 7. Get All Tasks
**GET** `/api/tasks`

Headers:
```
Authorization: Bearer <your-token>
```

Response:
```json
[
  {
    "_id": "507f1f77bcf86cd799439015",
    "title": "Design Homepage",
    "description": "Create homepage mockup",
    "status": "In Progress",
    "assignedTo": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "project": {
      "_id": "507f1f77bcf86cd799439012",
      "name": "Website Redesign"
    },
    "dueDate": "2024-05-15T00:00:00Z",
    "createdAt": "2024-05-01T10:00:00Z"
  }
]
```

### 8. Create Task
**POST** `/api/tasks`

Headers:
```
Authorization: Bearer <your-token>
Content-Type: application/json
```

Body:
```json
{
  "title": "Setup Database",
  "description": "Configure MongoDB connection",
  "status": "To Do",
  "assignedTo": "507f1f77bcf86cd799439011",
  "project": "507f1f77bcf86cd799439012",
  "dueDate": "2024-05-20T00:00:00Z"
}
```

### 9. Update Task
**PUT** `/api/tasks/:id`

Headers:
```
Authorization: Bearer <your-token>
Content-Type: application/json
```

Body:
```json
{
  "status": "Done"
}
```

### 10. Delete Task
**DELETE** `/api/tasks/:id`

Headers:
```
Authorization: Bearer <your-token>
```

---

## Users

### 11. Get All Users
**GET** `/api/users`

Headers:
```
Authorization: Bearer <your-token>
```

Response:
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "Member"
  },
  {
    "_id": "507f1f77bcf86cd799439013",
    "name": "Jane Smith",
    "email": "jane@example.com",
    "role": "Admin"
  }
]
```

---

## Dashboard

### 12. Get Dashboard Stats
**GET** `/api/dashboard`

Headers:
```
Authorization: Bearer <your-token>
```

Response:
```json
{
  "totalTasks": 5,
  "completedTasks": 2,
  "overdueTasks": 1,
  "projects": 3
}
```

---

## Testing with cURL

```bash
# Sign up
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "role": "Member"
  }'

# Login (save the token)
TOKEN=$(curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }' | jq -r '.token')

# Get projects
curl -X GET http://localhost:5000/api/projects \
  -H "Authorization: Bearer $TOKEN"

# Create project
curl -X POST http://localhost:5000/api/projects \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Project",
    "description": "Testing API"
  }'
```

## Testing with Postman

1. Open Postman
2. Create a new collection "Team Task Manager"
3. Set base URL in Variables: `{{base_url}}`
4. Add requests for each endpoint
5. Use Pre-request Scripts to manage token:
   ```javascript
   // Login first to get token
   // Then set: pm.environment.set("token", responseBody.token)
   ```
6. Use `Authorization` header with `Bearer {{token}}`

---

## Common Error Responses

### 400 Bad Request
```json
{
  "message": "Project name is required"
}
```

### 401 Unauthorized
```json
{
  "message": "Access denied"
}
```

### 403 Forbidden
```json
{
  "message": "Access denied"
}
```

### 404 Not Found
```json
{
  "message": "Project not found"
}
```

### 500 Server Error
```json
{
  "message": "Server error",
  "error": "Error details here"
}
```

---

## Best Practices

1. **Always include token** in Authorization header for protected routes
2. **Validate input** before sending requests
3. **Use consistent date format** (ISO 8601)
4. **Handle errors gracefully** in your client
5. **Test role-based access** (Admin vs Member permissions)
