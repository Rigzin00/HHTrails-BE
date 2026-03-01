# Tour Details & Itinerary API Documentation

## Overview

Two sub-resources hang off each tour:

| Resource | Purpose |
|----------|---------|
| **`/details`** | Rich editorial content — overview, highlights, inclusions/exclusions, accommodation, featured section, route map |
| **`/itinerary`** | Day-by-day schedule — one entry per day, ordered by `dayNumber` |

`is_description_filled` on the parent tour is automatically set to `true` by the database once a `tour_details` row is saved with `overview`, `highlights`, `inclusions`, and `exclusions` all populated.

Deleting a tour **cascades** — both `tour_details` and all `tour_itinerary` rows are removed automatically.

---

## Base URL

```
http://localhost:3000/api/v1/tours
```

All endpoints below are relative to this base.

---

## Authentication

Admin routes require the admin secret key passed as a custom header:

```
x-admin-key: <ADMIN_SECRET_KEY>
```

---

## Tour Details Endpoints

### 1. Get Tour Details (Public)

**GET** `/:id/details`

Fetch the details record for a tour.

**Example Request:**
```bash
curl http://localhost:3000/api/v1/tours/123e4567-e89b-12d3-a456-426614174000/details
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "tourDetails": {
      "id": "uuid",
      "tourId": "uuid",
      "overview": "A breathtaking journey through...",
      "highlights": ["Visit ancient monasteries", "Camp under the stars"],
      "inclusions": ["Accommodation", "All meals", "Permits"],
      "exclusions": ["Flights", "Travel insurance"],
      "accommodationDescription": "Comfortable homestays and tented camps",
      "accommodationMediaUrl": "https://example.com/accommodation.jpg",
      "featureDescription": "Drone footage of the entire trek route",
      "featureMediaUrl": "https://example.com/feature.mp4",
      "featureIsVideo": true,
      "routeDescription": "Starting from Manali, heading north towards Leh",
      "routePhotoUrl": "https://example.com/route-map.jpg",
      "createdAt": "2026-02-24T10:00:00.000Z",
      "updatedAt": "2026-02-24T10:00:00.000Z"
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
    "message": "Tour details not found"
  }
}
```

---

### 2. Create Tour Details (Admin Only)

**POST** `/:id/details`

Creates the details record for a tour. **One record per tour** — calling this twice returns a `409`. Use `PUT` to update.

**Headers:**
```
x-admin-key: your-admin-secret-key
Content-Type: application/json
```

**Request Body:**
```json
{
  "overview": "A breathtaking journey through the high-altitude deserts of Ladakh...",
  "highlights": [
    "Visit Pangong Lake",
    "Cross Khardung La — one of the world's highest motorable passes",
    "Explore Leh Palace"
  ],
  "inclusions": [
    "All accommodation",
    "All meals (breakfast, lunch, dinner)",
    "Inner line permits",
    "Experienced local guide"
  ],
  "exclusions": [
    "Flights to/from Leh",
    "Travel insurance",
    "Personal expenses",
    "Tips and gratuities"
  ],
  "accommodationDescription": "Comfortable guesthouses in Leh, tented camps at Pangong Lake",
  "accommodationMediaUrl": "https://example.com/accommodation.jpg",
  "featureDescription": "Cinematic aerial footage of the entire circuit",
  "featureMediaUrl": "https://example.com/reel.mp4",
  "featureIsVideo": true,
  "routeDescription": "Leh → Nubra Valley → Pangong Lake → Tso Moriri → Leh",
  "routePhotoUrl": "https://example.com/route-map.png"
}
```

**Field Validations:**

| Field | Required | Rules |
|-------|----------|-------|
| `overview` | ✅ | Non-empty string |
| `highlights` | ✅ | Array with at least 1 non-empty string |
| `inclusions` | ✅ | Array with at least 1 non-empty string |
| `exclusions` | ✅ | Array with at least 1 non-empty string |
| `accommodationDescription` | ❌ | String or null |
| `accommodationMediaUrl` | ❌ | Valid URL or null |
| `featureDescription` | ❌ | String or null |
| `featureMediaUrl` | ❌ | Valid URL or null |
| `featureIsVideo` | ❌ | Boolean (default: `false`) |
| `routeDescription` | ❌ | String or null |
| `routePhotoUrl` | ❌ | Valid URL or null |

**Example Request:**
```bash
curl -X POST http://localhost:3000/api/v1/tours/123e4567-e89b-12d3-a456-426614174000/details \
  -H "x-admin-key: your-admin-secret-key" \
  -H "Content-Type: application/json" \
  -d '{
    "overview": "A breathtaking journey...",
    "highlights": ["Visit Pangong Lake", "Cross Khardung La"],
    "inclusions": ["All accommodation", "All meals"],
    "exclusions": ["Flights", "Travel insurance"]
  }'
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "tourDetails": {
      "id": "uuid",
      "tourId": "uuid",
      "overview": "A breathtaking journey...",
      "highlights": ["Visit Pangong Lake", "Cross Khardung La"],
      "inclusions": ["All accommodation", "All meals"],
      "exclusions": ["Flights", "Travel insurance"],
      "accommodationDescription": null,
      "accommodationMediaUrl": null,
      "featureDescription": null,
      "featureMediaUrl": null,
      "featureIsVideo": false,
      "routeDescription": null,
      "routePhotoUrl": null,
      "createdAt": "2026-03-01T10:00:00.000Z",
      "updatedAt": "2026-03-01T10:00:00.000Z"
    }
  }
}
```

**Error Response (409) — Details already exist:**
```json
{
  "success": false,
  "error": {
    "message": "Tour details already exist. Use PUT to update them."
  }
}
```

---

### 3. Update Tour Details (Admin Only)

**PUT** `/:id/details`

Partially updates the details record. Only the fields you send are changed. At least one field must be provided.

**Headers:**
```
x-admin-key: your-admin-secret-key
Content-Type: application/json
```

**Example — add route info after the initial save:**
```bash
curl -X PUT http://localhost:3000/api/v1/tours/123e4567-e89b-12d3-a456-426614174000/details \
  -H "x-admin-key: your-admin-secret-key" \
  -H "Content-Type: application/json" \
  -d '{
    "routeDescription": "Leh → Nubra Valley → Pangong Lake → Leh",
    "routePhotoUrl": "https://example.com/route-map.png"
  }'
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "tourDetails": {
      "id": "uuid",
      "tourId": "uuid",
      "overview": "A breathtaking journey...",
      "highlights": ["Visit Pangong Lake", "Cross Khardung La"],
      "inclusions": ["All accommodation", "All meals"],
      "exclusions": ["Flights", "Travel insurance"],
      "accommodationDescription": null,
      "accommodationMediaUrl": null,
      "featureDescription": null,
      "featureMediaUrl": null,
      "featureIsVideo": false,
      "routeDescription": "Leh → Nubra Valley → Pangong Lake → Leh",
      "routePhotoUrl": "https://example.com/route-map.png",
      "createdAt": "2026-03-01T10:00:00.000Z",
      "updatedAt": "2026-03-01T11:30:00.000Z"
    }
  }
}
```

**Error Response (404) — Details haven't been created yet:**
```json
{
  "success": false,
  "error": {
    "message": "Tour details not found. Create them first with POST."
  }
}
```

---

## Tour Itinerary Endpoints

The itinerary is a list of days. `dayNumber` must be a positive integer and may not exceed the parent tour's `durationDays`.

---

### 4. Get Tour Itinerary (Public)

**GET** `/:id/itinerary`

Returns all days for a tour ordered by `dayNumber` ascending.

**Example Request:**
```bash
curl http://localhost:3000/api/v1/tours/123e4567-e89b-12d3-a456-426614174000/itinerary
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "itinerary": [
      {
        "id": "uuid",
        "tourId": "uuid",
        "dayNumber": 1,
        "description": "Arrive in Leh (3500m). Rest and acclimatise. Evening walk around Leh market.",
        "imageUrl": "https://example.com/day1.jpg",
        "createdAt": "2026-03-01T10:00:00.000Z",
        "updatedAt": "2026-03-01T10:00:00.000Z"
      },
      {
        "id": "uuid",
        "tourId": "uuid",
        "dayNumber": 2,
        "description": "Visit Leh Palace, Shanti Stupa, and local monasteries.",
        "imageUrl": "https://example.com/day2.jpg",
        "createdAt": "2026-03-01T10:00:00.000Z",
        "updatedAt": "2026-03-01T10:00:00.000Z"
      }
    ]
  },
  "meta": {
    "timestamp": "2026-03-01T10:00:00.000Z"
  }
}
```

> Returns an empty `itinerary: []` array if no days have been added yet.

---

### 5. Add Itinerary Day (Admin Only)

**POST** `/:id/itinerary`

Adds a single day. Each `dayNumber` must be unique per tour.

**Headers:**
```
x-admin-key: your-admin-secret-key
Content-Type: application/json
```

**Request Body:**
```json
{
  "dayNumber": 1,
  "description": "Arrive in Leh (3500m). Rest and acclimatise. Evening walk around Leh market.",
  "imageUrl": "https://example.com/day1.jpg"
}
```

**Field Validations:**

| Field | Required | Rules |
|-------|----------|-------|
| `dayNumber` | ✅ | Positive integer, ≤ parent tour's `durationDays` |
| `description` | ✅ | Non-empty string |
| `imageUrl` | ✅ | Valid URL |

**Example Request:**
```bash
curl -X POST http://localhost:3000/api/v1/tours/123e4567-e89b-12d3-a456-426614174000/itinerary \
  -H "x-admin-key: your-admin-secret-key" \
  -H "Content-Type: application/json" \
  -d '{
    "dayNumber": 1,
    "description": "Arrive in Leh. Rest and acclimatise.",
    "imageUrl": "https://example.com/day1.jpg"
  }'
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "day": {
      "id": "uuid",
      "tourId": "uuid",
      "dayNumber": 1,
      "description": "Arrive in Leh. Rest and acclimatise.",
      "imageUrl": "https://example.com/day1.jpg",
      "createdAt": "2026-03-01T10:00:00.000Z",
      "updatedAt": "2026-03-01T10:00:00.000Z"
    }
  }
}
```

**Error Response (400) — Day number exceeds tour duration:**
```json
{
  "success": false,
  "error": {
    "message": "Day number 8 exceeds the tour duration of 7 days"
  }
}
```

**Error Response (409) — Day already added:**
```json
{
  "success": false,
  "error": {
    "message": "Day 1 already exists. Use PUT to update it."
  }
}
```

---

### 6. Update Itinerary Day (Admin Only)

**PUT** `/:id/itinerary/:dayNumber`

Update the `description` or `imageUrl` of a specific day. At least one field must be sent.

**Headers:**
```
x-admin-key: your-admin-secret-key
Content-Type: application/json
```

**Example Request:**
```bash
curl -X PUT http://localhost:3000/api/v1/tours/123e4567-e89b-12d3-a456-426614174000/itinerary/1 \
  -H "x-admin-key: your-admin-secret-key" \
  -H "Content-Type: application/json" \
  -d '{"description": "Arrive in Leh. Rest, acclimatise, and explore the old town."}'
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "day": {
      "id": "uuid",
      "tourId": "uuid",
      "dayNumber": 1,
      "description": "Arrive in Leh. Rest, acclimatise, and explore the old town.",
      "imageUrl": "https://example.com/day1.jpg",
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
    "message": "Itinerary day 1 not found"
  }
}
```

---

### 7. Delete Itinerary Day (Admin Only)

**DELETE** `/:id/itinerary/:dayNumber`

Remove a specific day from the itinerary.

**Headers:**
```
x-admin-key: your-admin-secret-key
```

**Example Request:**
```bash
curl -X DELETE http://localhost:3000/api/v1/tours/123e4567-e89b-12d3-a456-426614174000/itinerary/3 \
  -H "x-admin-key: your-admin-secret-key"
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "message": "Day 3 deleted successfully"
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "error": {
    "message": "Itinerary day 3 not found"
  }
}
```

---

## Complete Endpoint Reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/:id/details` | Public | Get tour details |
| `POST` | `/:id/details` | Admin | Create tour details |
| `PUT` | `/:id/details` | Admin | Update tour details (partial) |
| `GET` | `/:id/itinerary` | Public | Get all itinerary days |
| `POST` | `/:id/itinerary` | Admin | Add an itinerary day |
| `PUT` | `/:id/itinerary/:dayNumber` | Admin | Update a specific day |
| `DELETE` | `/:id/itinerary/:dayNumber` | Admin | Delete a specific day |

---

## Recommended Content Workflow

```
1. POST /api/v1/tours              → create the tour card (title, photo, region…)
                                      tours.is_description_filled = false

2. POST /api/v1/tours/:id/details  → add overview, highlights, inclusions, exclusions
                                      (optional fields can be added later via PUT)
                                      tours.is_description_filled = true  ✅ (auto-set by DB)

3. POST /api/v1/tours/:id/itinerary  (×N, one call per day)
   → Add Day 1, Day 2 … Day N

4. PUT  /api/v1/tours/:id/details   → fill in accommodation, feature, route sections later
4. PUT  /api/v1/tours/:id/itinerary/:dayNumber  → edit any day
5. DELETE /api/v1/tours/:id         → removes tour + details + all itinerary days (cascade)
```

---

## Frontend Integration Example

```javascript
const BASE = 'http://localhost:3000/api/v1/tours';
const ADMIN_KEY = process.env.NEXT_PUBLIC_ADMIN_KEY; // store securely

const adminHeaders = {
  'x-admin-key': ADMIN_KEY,
  'Content-Type': 'application/json',
};

// ── Fetch details for a tour page ──────────────────────────────
const detailsRes = await fetch(`${BASE}/${tourId}/details`);
const { data: { tourDetails } } = await detailsRes.json();

// ── Fetch itinerary for a tour page ───────────────────────────
const itinRes = await fetch(`${BASE}/${tourId}/itinerary`);
const { data: { itinerary } } = await itinRes.json();

// ── Create details (admin panel) ──────────────────────────────
await fetch(`${BASE}/${tourId}/details`, {
  method: 'POST',
  headers: adminHeaders,
  body: JSON.stringify({
    overview: 'A breathtaking journey...',
    highlights: ['Pangong Lake', 'Khardung La'],
    inclusions: ['All accommodation', 'All meals'],
    exclusions: ['Flights', 'Insurance'],
  }),
});

// ── Add itinerary day (admin panel) ───────────────────────────
await fetch(`${BASE}/${tourId}/itinerary`, {
  method: 'POST',
  headers: adminHeaders,
  body: JSON.stringify({
    dayNumber: 1,
    description: 'Arrive in Leh. Rest and acclimatise.',
    imageUrl: 'https://example.com/day1.jpg',
  }),
});

// ── Update a single day ────────────────────────────────────────
await fetch(`${BASE}/${tourId}/itinerary/1`, {
  method: 'PUT',
  headers: adminHeaders,
  body: JSON.stringify({ description: 'Updated description for day 1' }),
});

// ── Delete a day ───────────────────────────────────────────────
await fetch(`${BASE}/${tourId}/itinerary/3`, {
  method: 'DELETE',
  headers: { 'x-admin-key': ADMIN_KEY },
});
```

---

## Error Codes

| Code | Meaning |
|------|---------|
| `400` | Validation error (missing required field, bad URL, day number out of range) |
| `403` | Invalid or missing admin key |
| `404` | Tour, tour details, or itinerary day not found |
| `409` | Conflict — tour details already exist / day number already taken |
| `500` | Internal server error |
| `503` | Service unavailable (database connectivity issue) |

---

## Notes

- `is_description_filled` is **read-only from the API** — it is managed entirely by a database trigger. Do not attempt to set it manually.
- Itinerary days can be added in any order; they are always returned sorted by `dayNumber` ascending.
- Optional fields (`accommodationDescription`, `featureMediaUrl`, etc.) accept `null` to explicitly clear a previously set value.
- All timestamps are ISO 8601 UTC.
