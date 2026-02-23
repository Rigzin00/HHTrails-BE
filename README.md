# HHTrails Backend API

Backend server for HHTrails tour planning website with authentication built with Node.js, Express, TypeScript, and Supabase.

## Features

- 🔐 **Complete Authentication System**
  - Email/Password signup & signin
  - Google OAuth integration
  - JWT-based session management
  - Password reset functionality
  - Protected routes with middleware
  - Automatic user profile creation

- 🛡️ **Security**
  - Helmet.js for security headers
  - CORS protection
  - Rate limiting
  - Input validation with Zod
  - Environment variable validation

- 🏗️ **Architecture**
  - TypeScript for type safety
  - Clean code structure
  - Centralized error handling
  - Standardized API responses
  - Middleware-based authentication

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Validation**: Zod
- **Security**: Helmet, CORS, Express Rate Limit

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Supabase account

### Installation

1. Clone the repository and install dependencies:
```bash
npm install
```

2. Create a `.env` file from the example:
```bash
copy .env.example .env
```

3. Configure your environment variables in `.env`:
```env
PORT=3000
NODE_ENV=development

# Get these from your Supabase project settings
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
```

### Supabase Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. **Set up the database schema**:
   - Open SQL Editor in Supabase Dashboard
   - Run `supabase/migrations/001_initial_schema.sql`
   - This creates the `user_profiles` table and automatic triggers
3. Enable Email authentication in Authentication → Providers
4. Enable Google OAuth:
   - Go to Authentication → Providers → Google
   - Follow the setup instructions
   - Add your OAuth credentials
5. Copy your project URL and keys to `.env`

See [supabase/SCHEMA_SETUP.md](supabase/SCHEMA_SETUP.md) for detailed instructions.

### Running the Application

Development mode with hot reload:
```bash
npm run dev
```

Build for production:
```bash
npm run build
npm start
```

## API Versioning

The API uses URL versioning. Current version: **v1**

- Base URL: `http://localhost:3000/api/v1`
- Health Check: `http://localhost:3000/api/health`
- Interactive Docs: `http://localhost:3000/api/v1/docs`

## Documentation

� **[Documentation Index](docs/README.md)** - Complete guide to all documentation

📖 **[Complete API Documentation](docs/API_DOCUMENTATION.md)** - Comprehensive guide with all endpoints, examples, and integration code

⚡ **[Quick Reference](docs/QUICK_REFERENCE.md)** - Fast lookup for endpoints and common operations

🔧 **Interactive API Docs**: Start the server and visit `http://localhost:3000/api/v1/docs` for JSON format documentation

📮 **[Postman Collection](docs/HHTrails_API_v1.postman_collection.json)** - Import into Postman for instant testing

📝 **[Changelog](CHANGELOG.md)** - Version history and updates

## API Endpoints

### Authentication

#### Sign Up
```http
POST /api/v1/auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123",
  "fullName": "John Doe" // optional
}
```

#### Sign In
```http
POST /api/v1/auth/signin
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

#### Google OAuth
```http
# Get Google OAuth URL
GET /api/v1/auth/google/url

# Sign in with Google ID token
POST /api/v1/auth/google
Content-Type: application/json

{
  "idToken": "google_id_token_here"
}
```

#### Sign Out
```http
POST /api/v1/auth/signout
Authorization: Bearer <access_token>
```

#### Get Current User
```http
GET /api/v1/auth/me
Authorization: Bearer <access_token>
```

#### Refresh Token
```http
POST /api/v1/auth/refresh
Content-Type: application/json

{
  "refreshToken": "refresh_token_here"
}
```

#### Password Reset
```http
# Request password reset
POST /api/v1/auth/password/reset-request
Content-Type: application/json

{
  "email": "user@example.com"
}

# Reset password with token
POST /api/v1/auth/password/reset
Content-Type: application/json

{
  "token": "reset_token_from_email",
  "password": "NewSecurePass123"
}
```

### Health Check
```http
GET /api/health
```

## Project Structure

```
src/
├── config/           # Configuration files
│   ├── env.ts       # Environment validation
│   └── supabase.ts  # Supabase client setup
├── controllers/      # Request handlers
│   └── auth.controller.ts
├── middleware/       # Express middleware
│   ├── auth.ts      # Authentication middleware
│   ├── errorHandler.ts
│   └── validator.ts
├── routes/          # API routes
│   ├── index.ts    # Main router
│   └── v1/         # API v1 routes
│       ├── index.ts
│       ├── auth.routes.ts
│       └── docs.routes.ts
├── utils/           # Utility functions
│   ├── errors.ts
│   └── response.ts
├── validators/      # Input validation schemas
│   └── auth.validator.ts
├── app.ts          # Express app setup
└── index.ts        # Server entry point
```

## Response Format

All API responses follow a consistent format:

### Success Response
```json
{
  "success": true,
  "data": {
    // Response data
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
    "code": "ERROR_CODE"
  },
  "meta": {
    "timestamp": "2026-02-11T10:00:00.000Z"
  }
}
```

## Error Handling

The API uses custom error classes for different scenarios:
- `ValidationError` (400) - Invalid input
- `AuthenticationError` (401) - Authentication failed
- `AuthorizationError` (403) - Access denied
- `NotFoundError` (404) - Resource not found
- `ConflictError` (409) - Resource conflict
- `InternalError` (500) - Server error

## Security Features

- Password requirements: 8+ characters, uppercase, lowercase, number
- Rate limiting: Configurable per endpoint
- CORS protection with whitelist
- Helmet.js security headers
- Input validation on all endpoints
- Environment variable validation
- Secure token-based authentication

## Development

### Testing the API

#### Using Postman
1. Import the collection: `docs/HHTrails_API_v1.postman_collection.json`
2. Create environment with variables:
   - `base_url`: `http://localhost:3000/api/v1`
   - `access_token`: (auto-populated after signin)
3. Run the requests in order

#### Using cURL
```bash
# Sign up
curl -X POST http://localhost:3000/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123456","fullName":"Test User"}'

# Sign in
curl -X POST http://localhost:3000/api/v1/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123456"}'

# Get current user (use token from signin response)
curl -X GET http://localhost:3000/api/v1/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Code Quality

Run linter:
```bash
npm run lint
```

Format code:
```bash
npm run format
```

### Adding Protected Routes

Use the `authenticate` middleware:
```typescript
import { authenticate } from './middleware/auth';

router.get('/protected', authenticate, yourController);
```

## License

ISC

## Support

For issues and questions, please create an issue in the repository.
