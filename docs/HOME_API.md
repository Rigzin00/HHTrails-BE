# Home API Documentation

## Overview

The Home API provides public discovery endpoints for the HHTrails app. No authentication is required for any of these routes.

## Base URL

```
http://localhost:3000/api/v1/home
```

---

## Endpoints

### 1. Search Tours by Destination & Date Range (Public)

**GET** `/api/v1/home/search`

Accepts a travel date range and a destination region. Calculates the number of available travel days and returns all tours in that region whose `durationDays` fits within that window, sorted longest-first.

**Query Parameters:**

| Parameter | Required | Description |
|-----------|----------|-------------|
| `from` | ✅ | Trip start date in `YYYY-MM-DD` format |
| `to` | ✅ | Trip end date in `YYYY-MM-DD` format |
| `destination` | ✅ | One of: `Ladakh`, `Spiti`, `Kashmir`, `Himachal` |

**How day count is calculated:**

```
dayCount = floor((toDate - fromDate) / milliseconds_per_day)
```

Tours whose `durationDays <= dayCount` are returned.

**Example Request:**
```bash
curl "http://localhost:3000/api/v1/home/search?from=2026-06-01&to=2026-06-11&destination=Ladakh"
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "dayCount": 10,
    "destination": "Ladakh",
    "tours": [
      {
        "id": "uuid",
        "title": "Leh Ladakh Explorer",
        "description": "An unforgettable journey through the land of high passes.",
        "region": "Ladakh",
        "types": ["Adventure", "Cultural"],
        "season": "Summer",
        "durationDays": 10,
        "durationNights": 9,
        "photoUrl": "https://example.com/leh.jpg",
        "isCustom": false,
        "isDescriptionFilled": true,
        "createdAt": "2026-01-10T08:00:00.000Z",
        "updatedAt": "2026-01-10T08:00:00.000Z"
      },
      {
        "id": "uuid",
        "title": "Nubra Valley Short Trip",
        "description": null,
        "region": "Ladakh",
        "types": ["Leisure"],
        "season": "Summer",
        "durationDays": 7,
        "durationNights": 6,
        "photoUrl": "https://example.com/nubra.jpg",
        "isCustom": false,
        "isDescriptionFilled": false,
        "createdAt": "2026-01-12T08:00:00.000Z",
        "updatedAt": "2026-01-12T08:00:00.000Z"
      }
    ]
  },
  "meta": {
    "timestamp": "2026-03-02T10:00:00.000Z"
  }
}
```

**Error Response — invalid destination (400):**
```json
{
  "success": false,
  "error": {
    "message": "Destination must be one of: Ladakh, Spiti, Kashmir, Himachal"
  }
}
```

**Error Response — `to` is not after `from` (400):**
```json
{
  "success": false,
  "error": {
    "message": "\"to\" date must be after \"from\" date."
  }
}
```

**Error Response — invalid date format (400):**
```json
{
  "success": false,
  "error": {
    "message": "from must be a valid date in YYYY-MM-DD format"
  }
}
```

---

### 2. Get Recommended Tours (Public)

**GET** `/api/v1/home/recommended`

Returns 3 randomly selected tours from all available tours. The selection is re-randomised on every request (Fisher-Yates shuffle), making it suitable for a "You might also like" or homepage spotlight section.

**No parameters required.**

**Example Request:**
```bash
curl "http://localhost:3000/api/v1/home/recommended"
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "tours": [
      {
        "id": "uuid",
        "title": "Spiti Circuit",
        "description": "A raw, off-the-beaten-path adventure through Spiti Valley.",
        "region": "Spiti",
        "types": ["Adventure"],
        "season": "Summer",
        "durationDays": 12,
        "durationNights": 11,
        "photoUrl": "https://example.com/spiti.jpg",
        "isCustom": false,
        "isDescriptionFilled": true,
        "createdAt": "2026-01-05T08:00:00.000Z",
        "updatedAt": "2026-01-05T08:00:00.000Z"
      },
      {
        "id": "uuid",
        "title": "Kashmir Great Lakes Trek",
        "description": "Trek through alpine meadows and pristine glacial lakes.",
        "region": "Kashmir",
        "types": ["Trekking"],
        "season": "Summer",
        "durationDays": 8,
        "durationNights": 7,
        "photoUrl": "https://example.com/kashmir.jpg",
        "isCustom": false,
        "isDescriptionFilled": true,
        "createdAt": "2026-01-08T08:00:00.000Z",
        "updatedAt": "2026-01-08T08:00:00.000Z"
      },
      {
        "id": "uuid",
        "title": "Himachal Heritage Trail",
        "description": null,
        "region": "Himachal",
        "types": ["Cultural", "Leisure"],
        "season": "Autumn",
        "durationDays": 6,
        "durationNights": 5,
        "photoUrl": "https://example.com/himachal.jpg",
        "isCustom": false,
        "isDescriptionFilled": false,
        "createdAt": "2026-01-15T08:00:00.000Z",
        "updatedAt": "2026-01-15T08:00:00.000Z"
      }
    ]
  },
  "meta": {
    "timestamp": "2026-03-02T10:00:00.000Z"
  }
}
```

> If fewer than 3 tours exist in the database, all available tours are returned.

---

## Tour Object Reference

Both endpoints return tour objects in the same shape:

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` (UUID) | Unique tour identifier |
| `title` | `string` | Tour name |
| `description` | `string \| null` | Short tour description (may be `null` if not yet filled) |
| `region` | `string` | One of: `Ladakh`, `Spiti`, `Kashmir`, `Himachal` |
| `types` | `string[]` | Activity types (e.g. `["Adventure", "Cultural"]`) |
| `season` | `string` | Best travel season |
| `durationDays` | `number` | Total duration in days |
| `durationNights` | `number` | Total duration in nights |
| `photoUrl` | `string \| null` | Cover image URL |
| `isCustom` | `boolean` | Whether the tour is a custom/private tour |
| `isDescriptionFilled` | `boolean` | Whether full tour details have been added |
| `createdAt` | `string` (ISO 8601) | Creation timestamp |
| `updatedAt` | `string` (ISO 8601) | Last update timestamp |

> These endpoints return **basic tour fields only** — no itinerary or tour details are included. Use `/api/v1/tours/:id/details` and `/api/v1/tours/:id/itinerary` for the full breakdown.

---

## Complete Endpoint Reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/v1/home/search` | Public | Search tours by destination and date range |
| `GET` | `/api/v1/home/recommended` | Public | Get 3 randomly recommended tours |

---

## Error Codes

| Code | Meaning |
|------|---------|
| `400` | Validation error (missing required param, invalid date format, invalid destination) |
| `500` | Internal server error |
| `503` | Service unavailable (database connectivity issue) |

---

## Frontend Integration Example

```javascript
const BASE = 'http://localhost:3000/api/v1/home';

// ── Search page: find tours that fit a travel window ──────────
const params = new URLSearchParams({
  from: '2026-06-01',
  to: '2026-06-11',
  destination: 'Ladakh',
});
const res = await fetch(`${BASE}/search?${params}`);
const { data: { dayCount, destination, tours } } = await res.json();
// dayCount: 10, destination: 'Ladakh', tours: [...]

// ── Home page: spotlight / recommended section ────────────────
const res = await fetch(`${BASE}/recommended`);
const { data: { tours } } = await res.json();
// 3 randomly picked tours on every call
```

---

## Notes

- Both endpoints are fully public — no API key or JWT is needed.
- `description` may be `null` for tours that have not yet had their details filled in; check `isDescriptionFilled` to decide whether to show a "details coming soon" state.
- The search endpoint returns an **empty `tours` array** (not an error) when no tours match the criteria.
- `dayCount` is the floor of the difference between `to` and `from` in whole days. For example, `from=2026-06-01` and `to=2026-06-11` yields `dayCount = 10`.
- Results from `/search` are ordered by `durationDays` descending (longest tours first).
- Results from `/recommended` are in random order and change on every request.
