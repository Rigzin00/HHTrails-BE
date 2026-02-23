# HHTrails API Documentation v1

Complete API documentation for the HHTrails authentication system.

## Base URL

```
Development: http://localhost:3000/api/v1
Production: https://your-domain.com/api/v1
```

## Authentication

Most endpoints require JWT authentication. Include the access token in the Authorization header:

```
Authorization: Bearer <access_token>
```

## Response Format

### Success Response

```json
{
  "success": true,
  "data": {
    // Response data here
  },
  "meta": {
    "timestamp": "2026-02-11T10:00:00.000Z"
  }
}
```

### Error Response

```json
{
  "success": false,
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE",
    "details": {}
  },
  "meta": {
    "timestamp": "2026-02-11T10:00:00.000Z"
  }
}
```

## Status Codes

| Code | Description |
|------|-------------|
| 200 | OK - Request succeeded |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid input or validation error |
| 401 | Unauthorized - Authentication failed or missing |
| 403 | Forbidden - Authenticated but not authorized |
| 404 | Not Found - Resource not found |
| 409 | Conflict - Resource already exists |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error - Unexpected server error |

## Rate Limiting

- **Window**: 15 minutes (900,000 ms)
- **Max Requests**: 100 requests per IP address
- **Headers**: Rate limit info included in response headers

## API Endpoints

### Health Check

Check if the API is running.

**Endpoint:** `GET /api/health`  
**Authentication:** Not required

**Response:**
```json
{
  "success": true,
  "message": "Server is running",
  "version": "1.0.0",
  "timestamp": "2026-02-11T10:00:00.000Z"
}
```

---

## Authentication Endpoints

### 1. Sign Up

Register a new user with email and password.

**Endpoint:** `POST /api/v1/auth/signup`  
**Authentication:** Not required

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123",
  "fullName": "John Doe"  // Optional
}
```

**Validation:**
- `email`: Valid email format (required)
- `password`: Minimum 8 characters, at least one uppercase, one lowercase, and one number (required)
- `fullName`: Minimum 2 characters (optional)

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "user@example.com",
      "fullName": "John Doe"
    },
    "session": {
      "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refresh_token": "v1.MjAyMS0xMi0zMVQyMzo1OTo1OS4wMDBa...",
      "expires_in": 3600,
      "expires_at": 1234567890,
      "token_type": "bearer",
      "user": {...}
    },
    "message": "Please check your email to verify your account"
  }
}
```

**Error Responses:**
- `400` - Validation error (invalid email/password format)
- `409` - Email already registered

**cURL Example:**
```bash
curl -X POST http://localhost:3000/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123",
    "fullName": "John Doe"
  }'
```

---

### 2. Sign In

Authenticate with email and password.

**Endpoint:** `POST /api/v1/auth/signin`  
**Authentication:** Not required

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "user@example.com",
      "fullName": "John Doe"
    },
    "session": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "v1.MjAyMS0xMi0zMVQyMzo1OTo1OS4wMDBa...",
      "expiresIn": 3600,
      "expiresAt": 1234567890
    }
  }
}
```

**Error Responses:**
- `400` - Validation error
- `401` - Invalid email or password

**cURL Example:**
```bash
curl -X POST http://localhost:3000/api/v1/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123"
  }'
```

---

### 3. Google OAuth - Get Authorization URL

Get the Google OAuth authorization URL to redirect users.

**Endpoint:** `GET /api/v1/auth/google/url`  
**Authentication:** Not required

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "url": "https://accounts.google.com/o/oauth2/v2/auth?client_id=..."
  }
}
```

**cURL Example:**
```bash
curl -X GET http://localhost:3000/api/v1/auth/google/url
```

---

### 4. Google OAuth - Sign In

Authenticate with Google ID token.

**Endpoint:** `POST /api/v1/auth/google`  
**Authentication:** Not required

**Request Body:**
```json
{
  "idToken": "eyJhbGciOiJSUzI1NiIsImtpZCI6IjdkNz..."
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "user@gmail.com",
      "fullName": "John Doe",
      "avatar": "https://lh3.googleusercontent.com/..."
    },
    "session": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "v1.MjAyMS0xMi0zMVQyMzo1OTo1OS4wMDBa...",
      "expiresIn": 3600,
      "expiresAt": 1234567890
    }
  }
}
```

**Error Responses:**
- `400` - Validation error
- `401` - Invalid Google token

**cURL Example:**
```bash
curl -X POST http://localhost:3000/api/v1/auth/google \
  -H "Content-Type: application/json" \
  -d '{
    "idToken": "eyJhbGciOiJSUzI1NiIsImtpZCI6IjdkNz..."
  }'
```

---

### 5. Get Current User

Get the authenticated user's profile information.

**Endpoint:** `GET /api/v1/auth/me`  
**Authentication:** Required

**Headers:**
```
Authorization: Bearer <access_token>
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "user@example.com",
      "fullName": "John Doe",
      "avatar": "https://example.com/avatar.jpg",
      "emailVerified": true,
      "createdAt": "2026-01-15T10:30:00.000Z"
    }
  }
}
```

**Error Responses:**
- `401` - Not authenticated or invalid token

**cURL Example:**
```bash
curl -X GET http://localhost:3000/api/v1/auth/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

### 6. Sign Out

Sign out the current user and invalidate their session.

**Endpoint:** `POST /api/v1/auth/signout`  
**Authentication:** Required

**Headers:**
```
Authorization: Bearer <access_token>
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "message": "Successfully signed out"
  }
}
```

**Error Responses:**
- `401` - Not authenticated

**cURL Example:**
```bash
curl -X POST http://localhost:3000/api/v1/auth/signout \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

### 7. Refresh Access Token

Get a new access token using a refresh token.

**Endpoint:** `POST /api/v1/auth/refresh`  
**Authentication:** Not required

**Request Body:**
```json
{
  "refreshToken": "v1.MjAyMS0xMi0zMVQyMzo1OTo1OS4wMDBa..."
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "session": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "v1.MjAyMS0xMi0zMVQyMzo1OTo1OS4wMDBa...",
      "expiresIn": 3600,
      "expiresAt": 1234567890
    }
  }
}
```

**Error Responses:**
- `400` - Validation error
- `401` - Invalid or expired refresh token

**cURL Example:**
```bash
curl -X POST http://localhost:3000/api/v1/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "v1.MjAyMS0xMi0zMVQyMzo1OTo1OS4wMDBa..."
  }'
```

---

### 8. Request Password Reset

Request a password reset email.

**Endpoint:** `POST /api/v1/auth/password/reset-request`  
**Authentication:** Not required

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "message": "If the email exists, a password reset link has been sent"
  }
}
```

**Note:** For security reasons, this endpoint always returns success, even if the email doesn't exist in the system.

**Error Responses:**
- `400` - Validation error (invalid email format)

**cURL Example:**
```bash
curl -X POST http://localhost:3000/api/v1/auth/password/reset-request \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com"
  }'
```

---

### 9. Reset Password

Reset password using the token from the reset email.

**Endpoint:** `POST /api/v1/auth/password/reset`  
**Authentication:** Not required

**Request Body:**
```json
{
  "token": "reset_token_from_email",
  "password": "NewSecurePass123"
}
```

**Validation:**
- `token`: Required
- `password`: Minimum 8 characters, at least one uppercase, one lowercase, and one number (required)

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "message": "Password successfully reset"
  }
}
```

**Error Responses:**
- `400` - Validation error
- `401` - Invalid or expired reset token

**cURL Example:**
```bash
curl -X POST http://localhost:3000/api/v1/auth/password/reset \
  -H "Content-Type: application/json" \
  -d '{
    "token": "reset_token_from_email",
    "password": "NewSecurePass123"
  }'
```

---

## Error Codes

| Code | Description |
|------|-------------|
| `VALIDATION_ERROR` | Input validation failed |
| `AUTHENTICATION_ERROR` | Authentication failed |
| `AUTHORIZATION_ERROR` | User not authorized for this action |
| `NOT_FOUND` | Resource not found |
| `CONFLICT` | Resource already exists |
| `INTERNAL_ERROR` | Internal server error |

---

## Password Requirements

Passwords must meet the following criteria:
- Minimum 8 characters
- At least one uppercase letter (A-Z)
- At least one lowercase letter (a-z)
- At least one number (0-9)

Example valid passwords:
- `SecurePass123`
- `MyP@ssw0rd`
- `Test1234Pass`

---

## Testing with Postman

### 1. Import Environment

Create a new environment with these variables:
- `base_url`: `http://localhost:3000/api/v1`
- `access_token`: (will be set automatically)

### 2. Test Authentication Flow

1. **Sign Up**
   - POST `{{base_url}}/auth/signup`
   - Save `session.accessToken` to `{{access_token}}`

2. **Sign In**
   - POST `{{base_url}}/auth/signin`
   - Update `{{access_token}}`

3. **Get Current User**
   - GET `{{base_url}}/auth/me`
   - Headers: `Authorization: Bearer {{access_token}}`

4. **Sign Out**
   - POST `{{base_url}}/auth/signout`
   - Headers: `Authorization: Bearer {{access_token}}`

---

## Integration Examples

### JavaScript/TypeScript (Axios)

```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Sign up
const signup = async (email: string, password: string, fullName?: string) => {
  const response = await api.post('/auth/signup', {
    email,
    password,
    fullName,
  });
  return response.data;
};

// Sign in
const signin = async (email: string, password: string) => {
  const response = await api.post('/auth/signin', { email, password });
  const { accessToken } = response.data.data.session;
  
  // Store token
  localStorage.setItem('access_token', accessToken);
  
  return response.data;
};

// Set auth token for subsequent requests
const setAuthToken = (token: string) => {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

// Get current user
const getCurrentUser = async () => {
  const token = localStorage.getItem('access_token');
  setAuthToken(token);
  
  const response = await api.get('/auth/me');
  return response.data;
};
```

### Python (Requests)

```python
import requests

BASE_URL = "http://localhost:3000/api/v1"

# Sign up
def signup(email, password, full_name=None):
    response = requests.post(
        f"{BASE_URL}/auth/signup",
        json={
            "email": email,
            "password": password,
            "fullName": full_name
        }
    )
    return response.json()

# Sign in
def signin(email, password):
    response = requests.post(
        f"{BASE_URL}/auth/signin",
        json={"email": email, "password": password}
    )
    return response.json()

# Get current user
def get_current_user(access_token):
    headers = {"Authorization": f"Bearer {access_token}"}
    response = requests.get(f"{BASE_URL}/auth/me", headers=headers)
    return response.json()
```

---

## WebSocket Support

WebSocket support is not currently implemented but is planned for future versions to enable real-time features.

---

## Changelog

### Version 1.0.0 (Current)
- Initial release
- Email/Password authentication
- Google OAuth integration
- JWT-based sessions
- Password reset functionality
- User profile management
- Rate limiting
- Input validation
- Comprehensive error handling

---

## Support

For issues and questions:
- GitHub Issues: [Create an issue](#)
- Email: support@hhtrails.com
- Documentation: This file

---

## License

ISC
