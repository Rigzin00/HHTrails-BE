# Supabase Schema Setup Guide

This guide will help you set up the database schema for HHTrails authentication in Supabase.

## Prerequisites

1. A Supabase account and project
2. Access to the Supabase SQL Editor

## Schema Overview

### Core Table

**user_profiles** - Extended user information beyond basic auth

### Security

- Row Level Security (RLS) enabled
- Users can only access their own profile data
- Automatic triggers handle profile creation and timestamps

## Setup Instructions

### Method 1: Using Supabase Dashboard (Recommended)

1. **Open Supabase Dashboard**
   - Go to [https://app.supabase.com](https://app.supabase.com)
   - Select your project

2. **Navigate to SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Run Migration File**
   - Copy the contents of `migrations/001_initial_schema.sql`
   - Paste into the SQL Editor
   - Click "Run" or press `Ctrl+Enter`
   - Wait for success confirmation

4. **Verify Table Created**
   - Go to "Table Editor" in the sidebar
   - You should see all tables listed

### Method 2: Using Supabase CLI
   - You should see the `user_profiles` table
```bash
# Install Supabase CLI if not already installed
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref your-project-ref

# Run migrations
supabase db push
```

## Enable Authentication Providers

### Email Authentication (Already Enabled by Default)

Email auth is enabled by default in Supabase.

### Google OAuth Setup

1. **Create Google OAuth Credentials**
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create a new project or select existing
   - Enable Google+ API
   - Go to "Credentials" → "Create Credentials" → "OAuth client ID"
   - Select "Web application"
   - Add authorized redirect URIs:
     ```
     https://your-project-ref.supabase.co/auth/v1/callback
     ```
   - Copy the Client ID and Client Secret

2. **Configure in Supabase**
   - In Supabase Dashboard, go to "Authentication" → "Providers"
   - Find "Google" and enable it
   - Paste your Client ID and Client Secret
   - Save changes

3. **Update Email Templates (Optional)**
   - Go to "Authentication" → "Email Templates"
   - Customize confirmation and password reset emails

## Update Environment Variables

After setting up Supabase, update your `.env` file:

```env
# Get these from Supabase Dashboard → Settings → API
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

## Database Schema Details

### user_profiles

Automatically created when a user signs up via trigger.

```sql
- id (UUID) - References auth.users (Primary Key)
- email (TEXT) - User email (Unique)
- full_name (TEXT) - User's full name
- avatar_url (TEXT) - Profile picture URL
- phone_number (TEXT) - Contact number
- date_of_birth (DATE) - Birthday
- bio (TEXT) - User bio
- preferences (JSONB) - User preferences (default: {})
- created_at (TIMESTAMPTZ) - Account creation timestamp
- updated_at (TIMESTAMPTZ) - Last update timestamp
```

## Testing the Schema

### Test User Profile Creation

1. Sign up a test user through your API
2. Check in Supabase Dashboard → Table Editor → user_profiles
3. The profile should be automatically created

### Test Tour Creation

```sql
-- Insert a test tour (run in SQL Editor)
INSERT INTO public.tours (created_by, title, destination, start_date, end_date)
VALUES (
    'your-user-id-here',
    'Test Trip to Paris',
    'Paris, France',
    '2026-06-01',
    '2026-06-07'
);
```

### Verify RLS Policies

1. Go to "Authentication" → "Policies" in Supabase Dashboard
2. You should see all policies listed for each table
3. Test by trying to query data with different users

## Common Issues & Solutions

### Issue: Profile not created automatically
**Solution**: Make sure the trigger `on_auth_user_created` exists and is enabled.

### Issue: RLS policy errors
**Solution**: Verify that auth.uid() returns a valid user ID. Check if user is authenticated.

### Issue: Google OAuth not working
**Solution**: 
- Verify redirect URI matches exactly
- Check that Google+ API is enabled
- Ensure client ID and secret are correct

## Next Steps

1. ✅ Schema is now set up
2. ✅ Test authentication endpoints
3. Build additional features as needed

## Useful Supabase SQL Queries

```sql
-- View all authenticated users
SELECT * FROM auth.users;

-- View all user profiles
SELECT * FROM public.user_profiles;

-- View user with profile details
SELECT 
    u.id,
    u.email,
    u.created_at as auth_created_at,
    p.full_name,
    p.avatar_url,
    p.phone_number,
    p.preferences
FROM auth.users u
LEFT JOIN public.user_profiles p ON u.id = p.id;

-- Count total users
SELECT COUNT(*) as total_users FROM auth.userssql.org/docs/)
