# Tours API Documentation

## Overview

The Tours API allows you to manage tour packages for HHTrails. Public users can view tours, while admin users can create, update, and delete tours.

## Base URL

```
http://localhost:3000/api/v1/tours
```

## Authentication

### Admin Routes
Admin routes require an admin secret key passed as a custom header:

```
x-admin-key: your-super-secret-admin-key-change-this-in-production
```

## Endpoints

### 1. Get All Tours (Public)

**GET** `/api/v1/tours`

Get a list of all tours with optional filtering and pagination.

**Query Parameters:**
- `region` (optional): Filter by region
- `season` (optional): Filter by season
- `types` (optional): Comma-separated tour types (e.g., "adventure,cultural")
- `isCustom` (optional): "true" or "false"
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Example Request:**
```bash
curl http://localhost:3000/api/v1/tours?region=Himachal&season=Summer&page=1&limit=10
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "tours": [
      {
        "id": "uuid",
        "title": "Himalayan Adventure",
        "description": "Explore the majestic Himalayas",
        "region": "Himachal",
        "types": ["adventure", "trekking"],
        "season": "Summer",
        "durationDays": 7,
        "durationNights": 6,
        "photoUrl": "https://example.com/photo.jpg",
        "isCustom": false,
        "createdAt": "2026-02-24T...",
        "updatedAt": "2026-02-24T..."
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "totalPages": 3
    }
  },
  "meta": {
    "timestamp": "2026-02-24T..."
  }
}
```

---

### 2. Get Single Tour (Public)

**GET** `/api/v1/tours/:id`

Get details of a specific tour.

**Example Request:**
```bash
curl http://localhost:3000/api/v1/tours/123e4567-e89b-12d3-a456-426614174000
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "tour": {
      "id": "uuid",
      "title": "Himalayan Adventure",
      "description": "Explore the majestic Himalayas",
      "region": "Himachal",
      "types": ["adventure", "trekking"],
      "season": "Summer",
      "durationDays": 7,
      "durationNights": 6,
      "photoUrl": "https://example.com/photo.jpg",
      "isCustom": false,
      "createdAt": "2026-02-24T...",
      "updatedAt": "2026-02-24T..."
    }
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "error": {
    "message": "Tour not found"
  }
}
```

---

### 3. Create Tour (Admin Only)

**POST** `/api/v1/tours`

Create a new tour package.

**Headers:**
```
x-admin-key: your-admin-secret-key
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "Himalayan Adventure",
  "description": "Explore the majestic Himalayas",
  "region": "Himachal",
  "types": ["adventure", "trekking"],
  "season": "Summer",
  "durationDays": 7,
  "durationNights": 6,
  "photoUrl": "https://example.com/photo.jpg",
  "isCustom": false
}
```

**Field Validations:**
- `title`: Required, 1-200 characters
- `description`: Optional
- `region`: Required
- `types`: Required, array with at least one type
- `season`: Required
- `durationDays`: Required, positive integer
- `durationNights`: Required, non-negative integer
- `photoUrl`: Required, valid URL
- `isCustom`: Optional, boolean (default: false)

**Example Request:**
```bash
curl -X POST http://localhost:3000/api/v1/tours \
  -H "x-admin-key: your-admin-secret-key" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Himalayan Adventure",
    "description": "Explore the majestic Himalayas",
    "region": "Himachal",
    "types": ["adventure", "trekking"],
    "season": "Summer",
    "durationDays": 7,
    "durationNights": 6,
    "photoUrl": "https://example.com/photo.jpg",
    "isCustom": false
  }'
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "tour": {
      "id": "uuid",
      "title": "Himalayan Adventure",
      "description": "Explore the majestic Himalayas",
      "region": "Himachal",
      "types": ["adventure", "trekking"],
      "season": "Summer",
      "durationDays": 7,
      "durationNights": 6,
      "photoUrl": "https://example.com/photo.jpg",
      "isCustom": false,
      "createdAt": "2026-02-24T...",
      "updatedAt": "2026-02-24T..."
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

### 4. Update Tour (Admin Only)

**PUT** `/api/v1/tours/:id`

Update an existing tour. All fields are optional, but at least one must be provided.

**Headers:**
```
x-admin-key: your-admin-secret-key
Content-Type: application/json
```

**Request Body (partial update):**
```json
{
  "title": "Updated Himalayan Adventure",
  "durationDays": 8
}
```

**Example Request:**
```bash
curl -X PUT http://localhost:3000/api/v1/tours/123e4567-e89b-12d3-a456-426614174000 \
  -H "x-admin-key: your-admin-secret-key" \
  -H "Content-Type: application/json" \
  -d '{"title": "Updated Himalayan Adventure", "durationDays": 8}'
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "tour": {
      "id": "uuid",
      "title": "Updated Himalayan Adventure",
      "description": "Explore the majestic Himalayas",
      "region": "Himachal",
      "types": ["adventure", "trekking"],
      "season": "Summer",
      "durationDays": 8,
      "durationNights": 6,
      "photoUrl": "https://example.com/photo.jpg",
      "isCustom": false,
      "createdAt": "2026-02-24T...",
      "updatedAt": "2026-02-24T..."
    }
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "error": {
    "message": "Tour not found"
  }
}
```

---

### 5. Delete Tour (Admin Only)

**DELETE** `/api/v1/tours/:id`

Delete a tour.

**Headers:**
```
x-admin-key: your-admin-secret-key
```

**Example Request:**
```bash
curl -X DELETE http://localhost:3000/api/v1/tours/123e4567-e89b-12d3-a456-426614174000 \
  -H "x-admin-key: your-admin-secret-key"
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "message": "Tour deleted successfully"
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "error": {
    "message": "Tour not found"
  }
}
```

---

## Error Codes

- `400` - Bad Request (validation error)
- `401` - Unauthorized (missing authentication)
- `403` - Forbidden (invalid admin credentials)
- `404` - Not Found (tour doesn't exist)
- `500` - Internal Server Error
- `503` - Service Unavailable (network/database issues)

## Database Migration

Run this SQL in your Supabase SQL Editor:

```sql
-- Located at: supabase/migrations/002_tours_schema.sql
```

The migration creates:
- `tours` table with all required fields
- Indexes on `region`, `types`, and `season` for fast filtering
- RLS policies (public read, service role for write)
- `updated_at` trigger

## Frontend Integration Example

```javascript
// Get all tours
const response = await fetch('http://localhost:3000/api/v1/tours?region=Himachal');
const { data } = await response.json();
console.log(data.tours);

// Create tour (admin)
const adminKey = process.env.NEXT_PUBLIC_ADMIN_KEY;
const response = await fetch('http://localhost:3000/api/v1/tours', {
  method: 'POST',
  headers: {
    'x-admin-key': adminKey,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    title: 'New Tour',
    region: 'Himachal',
    types: ['adventure'],
    season: 'Summer',
    durationDays: 5,
    durationNights: 4,
    photoUrl: 'https://example.com/photo.jpg'
  })
});
```

## Notes

- The admin secret key should be stored securely in your frontend environment variables
- Never commit the actual admin key to version control
- In production, change the default admin key in `.env` file
- All timestamps are in ISO 8601 format (UTC)
