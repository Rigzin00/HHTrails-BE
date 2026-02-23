# Documentation Index

Welcome to the HHTrails API documentation! This index will help you find the right documentation for your needs.

## 📚 Available Documentation

### 1. [Complete API Documentation](API_DOCUMENTATION.md)
**Best for:** Developers integrating with the API

**Contents:**
- Detailed endpoint descriptions
- Request/response examples
- Authentication flows
- Error handling
- Integration code examples (JavaScript, Python)
- Full parameter specifications

### 2. [Quick Reference Guide](QUICK_REFERENCE.md)
**Best for:** Quick lookups and common operations

**Contents:**
- Endpoint summary table
- Quick code snippets
- Common status codes
- Testing examples
- Environment setup

### 3. [Postman Collection](HHTrails_API_v1.postman_collection.json)
**Best for:** Testing and exploring the API

**How to use:**
1. Open Postman
2. Import this collection file
3. Set up environment variables
4. Start testing!

**Features:**
- Pre-configured requests
- Auto-saves tokens
- Test scripts included

### 4. Interactive API Documentation
**Access:** `GET http://localhost:3000/api/v1/docs` (when server is running)

**Best for:** Runtime API exploration

**Features:**
- JSON-formatted documentation
- Current endpoint information
- Request/response schemas

## 🚀 Getting Started

### First Time Setup

1. **Read:** [Setup Checklist](../SETUP_CHECKLIST.md)
2. **Configure:** Follow Supabase setup in [SCHEMA_SETUP.md](../supabase/SCHEMA_SETUP.md)
3. **Test:** Import Postman collection and try authentication flow
4. **Reference:** Bookmark [Quick Reference](QUICK_REFERENCE.md) for daily use

### For Frontend Developers

1. Start with [Complete API Documentation](API_DOCUMENTATION.md)
2. Review authentication endpoints
3. Check integration examples (JavaScript/TypeScript)
4. Use Postman collection to test before coding

### For Backend Developers

1. Review [README.md](../README.md) for project structure
2. Understand middleware in `src/middleware/`
3. Check validation schemas in `src/validators/`
4. Review error handling patterns

## 📖 Documentation by Topic

### Authentication
- [Email/Password Auth](API_DOCUMENTATION.md#1-sign-up)
- [Google OAuth](API_DOCUMENTATION.md#3-google-oauth---get-authorization-url)
- [Token Management](API_DOCUMENTATION.md#7-refresh-access-token)
- [Password Reset](API_DOCUMENTATION.md#8-request-password-reset)

### API Standards
- [Response Format](API_DOCUMENTATION.md#response-format)
- [Status Codes](API_DOCUMENTATION.md#status-codes)
- [Rate Limiting](API_DOCUMENTATION.md#rate-limiting)
- [Error Codes](API_DOCUMENTATION.md#error-codes)

### Testing
- [Postman Setup](QUICK_REFERENCE.md#testing-tools)
- [cURL Examples](QUICK_REFERENCE.md#quick-start-examples)
- [VS Code REST Client](QUICK_REFERENCE.md#vs-code-rest-client)

## 🔧 Common Tasks

### How do I...

**...authenticate a user?**
1. Call `POST /api/v1/auth/signin`
2. Save the `accessToken` from response
3. Include in subsequent requests: `Authorization: Bearer {token}`

See: [Sign In Documentation](API_DOCUMENTATION.md#2-sign-in)

**...handle token expiration?**
1. Detect 401 Unauthorized response
2. Call `POST /api/v1/auth/refresh` with `refreshToken`
3. Update stored `accessToken`
4. Retry original request

See: [Refresh Token Documentation](API_DOCUMENTATION.md#7-refresh-access-token)

**...implement Google OAuth?**
1. Get OAuth URL: `GET /api/v1/auth/google/url`
2. Redirect user to Google
3. Receive ID token from Google callback
4. Send to `POST /api/v1/auth/google`

See: [Google OAuth Documentation](API_DOCUMENTATION.md#3-google-oauth---get-authorization-url)

**...test protected endpoints?**
1. Sign in and get access token
2. Add `Authorization: Bearer {token}` header
3. Make request to protected endpoint

See: [Testing Guide](QUICK_REFERENCE.md#javascript---authenticated-request)

**...handle validation errors?**
- Check error response `error.message` field
- Contains specific validation failures
- Fix request and retry

See: [Error Codes](API_DOCUMENTATION.md#error-codes)

## 📊 API Versioning

Current version: **v1**

Base URL format: `/api/v1/{resource}`

All endpoints are versioned. When v2 is released:
- v1 endpoints remain available
- New features in v2
- Breaking changes only in new versions

## 🆘 Need Help?

### Troubleshooting

**Server won't start?**
- Check [SETUP_CHECKLIST.md](../SETUP_CHECKLIST.md)
- Verify environment variables in `.env`
- Ensure Supabase credentials are correct

**Authentication not working?**
- Verify Supabase is configured
- Check email/password requirements
- Review [Common Errors](QUICK_REFERENCE.md#common-errors)

**Getting rate limited?**
- Default: 100 requests per 15 minutes
- Wait for rate limit to reset
- Check `X-RateLimit-Reset` header

### Support Channels

- 📖 Documentation (you are here!)
- 🐛 [GitHub Issues](#)
- 💬 [Discord Community](#)
- 📧 Email: support@hhtrails.com

## 🔄 Documentation Updates

Last updated: February 11, 2026

### Recent Changes
- Added API versioning (v1)
- Created comprehensive endpoint documentation
- Added Postman collection
- Included code integration examples

### Contributing

Found an issue or have a suggestion?
1. Check existing documentation
2. Open an issue on GitHub
3. Submit a pull request

## 📦 Additional Resources

- [Main README](../README.md) - Project overview
- [Setup Checklist](../SETUP_CHECKLIST.md) - Step-by-step setup
- [Supabase Schema](../supabase/SCHEMA_SETUP.md) - Database setup
- [Environment Config](../.env.example) - Configuration template

---

**Quick Links:**
- [API Documentation](API_DOCUMENTATION.md)
- [Quick Reference](QUICK_REFERENCE.md)
- [Postman Collection](HHTrails_API_v1.postman_collection.json)
- [Back to Main README](../README.md)
