# Quick Setup Checklist

## ✅ Step-by-Step Setup Guide

### 1. Create Supabase Project
- [ ] Go to [https://app.supabase.com](https://app.supabase.com)
- [ ] Click "New Project"
- [ ] Fill in project details:
  - Project name: `hh-trails`
  - Database password: (save this securely)
  - Region: (choose closest to you)
- [ ] Wait for project to be created (~2 minutes)

### 2. Get Your API Keys
- [ ] Go to Project Settings → API
- [ ] Copy the following to your `.env` file:
  - **Project URL** → `SUPABASE_URL`
  - **anon public** key → `SUPABASE_ANON_KEY`
  - **service_role secret** key → `SUPABASE_SERVICE_ROLE_KEY`

### 3. Set Up Database Schema
- [ ] Open SQL Editor in Supabase Dashboard
- [ ] Run `migrations/001_initial_schema.sql`
  - Copy entire file content
  - Paste into SQL Editor
  - Click "Run" (or Ctrl+Enter)
  - ✅ Should see "Success. No rows returned"

### 4. Verify Table Created
- [ ] Go to Table Editor in Supabase
- [ ] Should see this table:
  - ✅ user_profiles

### 5. Configure Authentication
- [ ] Go to Authentication → Providers
- [ ] Email provider should already be enabled ✅
- [ ] For Google OAuth:
  - [ ] Go to [Google Cloud Console](https://console.cloud.google.com)
  - [ ] Create OAuth 2.0 credentials
  - [ ] Add redirect URI: `https://[your-project-ref].supabase.co/auth/v1/callback`
  - [ ] Copy Client ID and Secret
  - [ ] Enable Google provider in Supabase
  - [ ] Paste credentials

### 6. Configure Email Templates (Optional but Recommended)
- [ ] Go to Authentication → Email Templates
- [ ] Customize "Confirm signup" email
- [ ] Customize "Reset password" email
- [ ] Update redirect URLs to your frontend

### 7. Update Backend Configuration
- [ ] Create `.env` file from `.env.example`
- [ ] Fill in all Supabase values
- [ ] Update `ALLOWED_ORIGINS` with your frontend URL

### 8. Install Dependencies
```bash
npm install
```

### 9. Start Development Server
```bash
npm run dev
```

### 10. Test Authentication
- [ ] Test signup: `POST http://localhost:3000/api/auth/signup`
- [ ] Check user created in Supabase → Table Editor → user_profiles
- [ ] Test signin: `POST http://localhost:3000/api/auth/signin`
- [ ] Test protected route: `GET http://localhost:3000/api/auth/me` (with token)

## Sample .env File

```env
# Server
PORT=3000
NODE_ENV=development

# Supabase (Get from Supabase Dashboard → Settings → API)
SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# CORS
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## Testing with cURL

### Sign Up
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123456",
    "fullName": "Test User"
  }'
```

### Sign In
```bash
curl -X POST http://localhost:3000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123456"
  }'
```

### Get Current User (Protected)
```bash
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE"
```

## Testing with Postman

1. **Import Collection**
   - Create new request
   - Set up base URL: `http://localhost:3000/api`

2. **Test Signup**
   - Method: POST
   - URL: `/auth/signup`
   - Body (JSON):
     ```json
     {
       "email": "test@example.com",
       "password": "Test123456",
       "fullName": "Test User"
     }
     ```

3. **Test Signin**
   - Method: POST
   - URL: `/auth/signin`
   - Body: same as signup
   - Save `accessToken` from response

4. **Test Protected Route**
   - Method: GET
   - URL: `/auth/me`
   - Headers: `Authorization: Bearer {accessToken}`

## Common Issues

### ❌ PowerShell execution policy error
```powershell
# Solution: Use cmd terminal instead
cmd /c "npm install"
```

### ❌ "Invalid environment variables" error
- Check `.env` file exists
- Verify all required variables are filled in
- No spaces around `=` sign
- Values should not have quotes

### ❌ "Failed to create user" error
- Check Supabase credentials are correct
- Verify email provider is enabled
- Check internet connection

### ❌ RLS policy errors
- Make sure migrations ran successfully
- Check user is authenticated (has valid token)
- Verify `auth.uid()` returns user ID

### ❌ User profile not created automatically
- Check if trigger `on_auth_user_created` exists
- Go to SQL Editor and run:
  ```sql
  SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';
  ```

## Next Steps After Setup

1. ✅ Authentication is working
2. Build additional features as needed
3. Add user profile management endpoints
4. Implement password change functionality
5. Add email verification checks

## Resources

- 📚 [Supabase Documentation](https://supabase.com/docs)
- 🔐 [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- 🛡️ [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- 📘 [TypeScript SDK](https://supabase.com/docs/reference/javascript/introduction)
