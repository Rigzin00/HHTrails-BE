# API Quick Reference

Quick reference guide for HHTrails API v1.

## Base URLs

```
Development: http://localhost:3000/api/v1
Production:  https://api.hhtrails.com/api/v1
```

## Authentication Header

```
Authorization: Bearer <access_token>
```

## Quick Endpoints Reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/health` | No | Health check |
| GET | `/v1/docs` | No | API documentation |
| POST | `/v1/auth/signup` | No | Register new user |
| POST | `/v1/auth/signin` | No | Sign in with email/password |
| GET | `/v1/auth/google/url` | No | Get Google OAuth URL |
| POST | `/v1/auth/google` | No | Sign in with Google |
| GET | `/v1/auth/me` | Yes | Get current user |
| POST | `/v1/auth/signout` | Yes | Sign out |
| POST | `/v1/auth/refresh` | No | Refresh access token |
| POST | `/v1/auth/password/reset-request` | No | Request password reset |
| POST | `/v1/auth/password/reset` | No | Reset password |

## Common Status Codes

- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `429` - Too Many Requests
- `500` - Internal Server Error

## Password Requirements

- ✅ Minimum 8 characters
- ✅ At least one uppercase letter
- ✅ At least one lowercase letter
- ✅ At least one number

Valid: `SecurePass123`, `Test1234Pass`

## Rate Limiting

- **100 requests** per **15 minutes** per IP
- Headers: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`

## Quick Start Examples

### cURL - Sign Up

```bash
curl -X POST http://localhost:3000/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123456","fullName":"Test User"}'
```

### cURL - Sign In

```bash
curl -X POST http://localhost:3000/api/v1/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123456"}'
```

### cURL - Get User (Protected)

```bash
curl -X GET http://localhost:3000/api/v1/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### JavaScript - Sign In

```javascript
const response = await fetch('http://localhost:3000/api/v1/auth/signin', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'test@example.com',
    password: 'Test123456'
  })
});

const data = await response.json();
const accessToken = data.data.session.accessToken;

// Store token
localStorage.setItem('access_token', accessToken);
```

### JavaScript - Authenticated Request

```javascript
const token = localStorage.getItem('access_token');

const response = await fetch('http://localhost:3000/api/v1/auth/me', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const data = await response.json();
console.log(data.data.user);
```

## Response Format

### Success

```json
{
  "success": true,
  "data": { /* ... */ },
  "meta": {
    "timestamp": "2026-02-11T10:00:00.000Z"
  }
}
```

### Error

```json
{
  "success": false,
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE"
  },
  "meta": {
    "timestamp": "2026-02-11T10:00:00.000Z"
  }
}
```

## Testing Tools

### Postman
Import: `docs/HHTrails_API_v1.postman_collection.json`

### VS Code REST Client

Create `test.http`:

```http
### Sign Up
POST http://localhost:3000/api/v1/auth/signup
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "Test123456",
  "fullName": "Test User"
}

### Sign In
POST http://localhost:3000/api/v1/auth/signin
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "Test123456"
}

### Get Current User
GET http://localhost:3000/api/v1/auth/me
Authorization: Bearer YOUR_TOKEN_HERE
```

## Environment Variables

```env
# Required
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key

# Optional
PORT=3000
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:3000
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## Common Errors

### 401 Unauthorized
- Token missing or invalid
- Token expired - use refresh token

### 400 Bad Request
- Invalid email format
- Password doesn't meet requirements
- Missing required fields

### 409 Conflict
- Email already registered

### 429 Too Many Requests
- Rate limit exceeded
- Wait before retrying

## Support

📚 [Full Documentation](API_DOCUMENTATION.md)  