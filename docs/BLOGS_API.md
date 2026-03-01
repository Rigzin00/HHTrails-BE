# Blogs API Documentation

## Overview

The Blogs API allows you to manage blog posts for HHTrails. Public users can view blogs, while admin users can create, update, and delete them.

## Base URL

```
http://localhost:3000/api/v1/blogs
```

## Authentication

### Admin Routes
Admin routes require the admin secret key passed as a custom header:

```
x-admin-key: your-super-secret-admin-key-change-this-in-production
```

---

## Endpoints

### 1. Get All Blogs (Public)

**GET** `/api/v1/blogs`

Returns a paginated list of blogs, ordered by `publishedDate` descending (newest first).

**Query Parameters:**
- `category` (optional): Filter by category
- `page` (optional): Page number (default: `1`)
- `limit` (optional): Items per page (default: `10`)

**Example Request:**
```bash
curl "http://localhost:3000/api/v1/blogs?category=Travel&page=1&limit=10"
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "blogs": [
      {
        "id": "uuid",
        "category": "Travel",
        "coverImageUrl": "https://example.com/cover.jpg",
        "title": "A Week in Ladakh",
        "shortDescription": "Everything you need to know before your first trip to Ladakh.",
        "content": "Ladakh sits at an average altitude of...",
        "authorName": "Priya Sharma",
        "publishedDate": "2026-03-01",
        "readingTimeMinutes": 6,
        "createdAt": "2026-03-01T10:00:00.000Z",
        "updatedAt": "2026-03-01T10:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 24,
      "totalPages": 3
    }
  },
  "meta": {
    "timestamp": "2026-03-01T10:00:00.000Z"
  }
}
```

---

### 2. Get Single Blog (Public)

**GET** `/api/v1/blogs/:id`

Fetch a single blog post by its UUID.

**Example Request:**
```bash
curl http://localhost:3000/api/v1/blogs/123e4567-e89b-12d3-a456-426614174000
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "blog": {
      "id": "uuid",
      "category": "Travel",
      "coverImageUrl": "https://example.com/cover.jpg",
      "title": "A Week in Ladakh",
      "shortDescription": "Everything you need to know before your first trip to Ladakh.",
      "content": "Ladakh sits at an average altitude of...",
      "authorName": "Priya Sharma",
      "publishedDate": "2026-03-01",
      "readingTimeMinutes": 6,
      "createdAt": "2026-03-01T10:00:00.000Z",
      "updatedAt": "2026-03-01T10:00:00.000Z"
    }
  },
  "meta": {
    "timestamp": "2026-03-01T10:00:00.000Z"
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "error": {
    "message": "Blog not found"
  }
}
```

---

### 3. Create Blog (Admin Only)

**POST** `/api/v1/blogs`

Create a new blog post.

**Headers:**
```
x-admin-key: your-admin-secret-key
Content-Type: application/json
```

**Request Body:**
```json
{
  "category": "Travel",
  "coverImageUrl": "https://example.com/cover.jpg",
  "title": "A Week in Ladakh",
  "shortDescription": "Everything you need to know before your first trip to Ladakh.",
  "content": "Ladakh sits at an average altitude of 3000m above sea level...",
  "authorName": "Priya Sharma",
  "publishedDate": "2026-03-01",
  "readingTimeMinutes": 6
}
```

**Field Validations:**

| Field | Required | Rules |
|-------|----------|-------|
| `category` | ✅ | Non-empty string |
| `coverImageUrl` | ✅ | Valid URL |
| `title` | ✅ | Non-empty string, max 300 characters |
| `shortDescription` | ✅ | Non-empty string |
| `content` | ✅ | Non-empty string |
| `authorName` | ✅ | Non-empty string |
| `publishedDate` | ❌ | `YYYY-MM-DD` format (defaults to today) |
| `readingTimeMinutes` | ✅ | Positive integer |

**Example Request:**
```bash
curl -X POST http://localhost:3000/api/v1/blogs \
  -H "x-admin-key: your-admin-secret-key" \
  -H "Content-Type: application/json" \
  -d '{
    "category": "Travel",
    "coverImageUrl": "https://example.com/cover.jpg",
    "title": "A Week in Ladakh",
    "shortDescription": "Everything you need to know before your first trip to Ladakh.",
    "content": "Ladakh sits at an average altitude of 3000m...",
    "authorName": "Priya Sharma",
    "readingTimeMinutes": 6
  }'
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "blog": {
      "id": "uuid",
      "category": "Travel",
      "coverImageUrl": "https://example.com/cover.jpg",
      "title": "A Week in Ladakh",
      "shortDescription": "Everything you need to know before your first trip to Ladakh.",
      "content": "Ladakh sits at an average altitude of 3000m...",
      "authorName": "Priya Sharma",
      "publishedDate": "2026-03-01",
      "readingTimeMinutes": 6,
      "createdAt": "2026-03-01T10:00:00.000Z",
      "updatedAt": "2026-03-01T10:00:00.000Z"
    }
  }
}
```

**Error Response (403):**
```json
{
  "success": false,
  "error": {
    "message": "Invalid admin credentials"
  }
}
```

---

### 4. Update Blog (Admin Only)

**PUT** `/api/v1/blogs/:id`

Partially update a blog post. All fields are optional, but at least one must be provided.

**Headers:**
```
x-admin-key: your-admin-secret-key
Content-Type: application/json
```

**Request Body (partial update):**
```json
{
  "title": "A Week in Ladakh — Updated Edition",
  "readingTimeMinutes": 8
}
```

**Example Request:**
```bash
curl -X PUT http://localhost:3000/api/v1/blogs/123e4567-e89b-12d3-a456-426614174000 \
  -H "x-admin-key: your-admin-secret-key" \
  -H "Content-Type: application/json" \
  -d '{"title": "A Week in Ladakh — Updated Edition", "readingTimeMinutes": 8}'
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "blog": {
      "id": "uuid",
      "category": "Travel",
      "coverImageUrl": "https://example.com/cover.jpg",
      "title": "A Week in Ladakh — Updated Edition",
      "shortDescription": "Everything you need to know before your first trip to Ladakh.",
      "content": "Ladakh sits at an average altitude of 3000m...",
      "authorName": "Priya Sharma",
      "publishedDate": "2026-03-01",
      "readingTimeMinutes": 8,
      "createdAt": "2026-03-01T10:00:00.000Z",
      "updatedAt": "2026-03-01T12:00:00.000Z"
    }
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "error": {
    "message": "Blog not found"
  }
}
```

---

### 5. Delete Blog (Admin Only)

**DELETE** `/api/v1/blogs/:id`

Permanently delete a blog post.

**Headers:**
```
x-admin-key: your-admin-secret-key
```

**Example Request:**
```bash
curl -X DELETE http://localhost:3000/api/v1/blogs/123e4567-e89b-12d3-a456-426614174000 \
  -H "x-admin-key: your-admin-secret-key"
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "message": "Blog deleted successfully"
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "error": {
    "message": "Blog not found"
  }
}
```

---

## Complete Endpoint Reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/v1/blogs` | Public | List all blogs (paginated, filterable) |
| `GET` | `/api/v1/blogs/:id` | Public | Get a single blog |
| `POST` | `/api/v1/blogs` | Admin | Create a blog |
| `PUT` | `/api/v1/blogs/:id` | Admin | Update a blog (partial) |
| `DELETE` | `/api/v1/blogs/:id` | Admin | Delete a blog |

---

## Error Codes

| Code | Meaning |
|------|---------|
| `400` | Validation error (missing required field, bad URL, invalid date format) |
| `403` | Invalid or missing admin key |
| `404` | Blog not found |
| `500` | Internal server error |
| `503` | Service unavailable (database connectivity issue) |

---

## Database Migration

Run the following file in your Supabase SQL Editor:

```
supabase/migrations/004_blogs_schema.sql
```

The migration creates:
- `blogs` table matching the schema above
- Index on `category` for fast filtering
- Index on `published_date DESC` for fast ordering
- RLS policy (public read, service role for write)
- `updated_at` trigger

---

## Frontend Integration Example

```javascript
const BASE = 'http://localhost:3000/api/v1/blogs';
const ADMIN_KEY = process.env.NEXT_PUBLIC_ADMIN_KEY; // store securely

// ── Fetch all blogs (blog listing page) ──────────────────────
const res = await fetch(`${BASE}?page=1&limit=10`);
const { data: { blogs, pagination } } = await res.json();

// ── Fetch by category ─────────────────────────────────────────
const res = await fetch(`${BASE}?category=Travel`);
const { data: { blogs } } = await res.json();

// ── Fetch single blog (blog detail page) ─────────────────────
const res = await fetch(`${BASE}/${blogId}`);
const { data: { blog } } = await res.json();

// ── Create blog (admin panel) ─────────────────────────────────
await fetch(BASE, {
  method: 'POST',
  headers: {
    'x-admin-key': ADMIN_KEY,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    category: 'Travel',
    coverImageUrl: 'https://example.com/cover.jpg',
    title: 'A Week in Ladakh',
    shortDescription: 'Everything you need to know.',
    content: 'Full blog content here...',
    authorName: 'Priya Sharma',
    readingTimeMinutes: 6,
  }),
});

// ── Update blog (admin panel) ─────────────────────────────────
await fetch(`${BASE}/${blogId}`, {
  method: 'PUT',
  headers: {
    'x-admin-key': ADMIN_KEY,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ readingTimeMinutes: 8 }),
});

// ── Delete blog (admin panel) ─────────────────────────────────
await fetch(`${BASE}/${blogId}`, {
  method: 'DELETE',
  headers: { 'x-admin-key': ADMIN_KEY },
});
```

---

## Notes

- `publishedDate` is a `date` (not datetime) — format must be `YYYY-MM-DD`. If omitted on create, it defaults to today's date.
- Blogs are always returned ordered by `publishedDate` descending (newest first).
- `content` can be plain text or any markup string (HTML, Markdown) — the backend stores it as-is.
- All timestamps (`createdAt`, `updatedAt`) are ISO 8601 UTC; `publishedDate` is a plain date string.
- The admin secret key should be stored securely in environment variables and never committed to version control.
