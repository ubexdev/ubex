# API Reference — UBEX

> Planned REST API endpoints for UBEX. These endpoints will be implemented as Next.js API routes under `src/app/api/`.

**Base URL**: `https://ubex.app/api` (production) or `http://localhost:3000/api` (development)

**Authentication**: All authenticated endpoints require a Bearer token from Supabase Auth in the `Authorization` header.

**Status**: 📝 These endpoints are planned. The current demo runs entirely client-side.

---

## Table of Contents

- [Authentication](#authentication)
- [Game Endpoints](#game-endpoints)
  - [Start Game Session](#start-game-session)
  - [Validate Answer](#validate-answer)
  - [Get Session Status](#get-session-status)
- [Saga Endpoints](#saga-endpoints)
  - [List Sagas](#list-sagas)
  - [Get Saga Details](#get-saga-details)
- [Leaderboard](#leaderboard)
  - [Get Leaderboard](#get-leaderboard)
- [Admin Endpoints](#admin-endpoints)
  - [Create Saga](#create-saga)
  - [Update Levels](#update-levels)
- [AI Endpoints](#ai-endpoints)
  - [Generate Saga with AI](#generate-saga-with-ai)
- [Common Patterns](#common-patterns)
  - [Error Format](#error-format)
  - [Pagination](#pagination)
  - [Rate Limiting](#rate-limiting)

---

## Authentication

All authenticated requests must include a Supabase access token:

```
Authorization: Bearer <supabase_access_token>
```

You can obtain a token by signing in through Supabase Auth:

```typescript
const { data } = await supabase.auth.signInWithPassword({
  email: 'player@example.com',
  password: 'your-password',
});

const token = data.session?.access_token;
```

### Auth Levels

| Level | Description | Endpoints |
|-------|-------------|-----------|
| **Public** | No authentication required | `GET /api/sagas`, `GET /api/leaderboard` |
| **Player** | Authenticated user | `POST /api/game/*`, `GET /api/game/*` |
| **Admin** | User with `admin` role | `POST /api/admin/*`, `PUT /api/admin/*`, `POST /api/ai/*` |

---

## Game Endpoints

### Start Game Session

Creates a new game session for the authenticated player.

```
POST /api/game/start-session
```

**Auth**: Required (Player)

**Request Body**:

```json
{
  "sagaId": "saga-colon-2026",
  "difficulty": "explorador"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `sagaId` | `string` | Yes | UUID of the saga to play |
| `difficulty` | `string` | Yes | `"libre"` or `"explorador"` |

**Response** `201 Created`:

```json
{
  "session": {
    "id": "sess_abc123",
    "sagaId": "saga-colon-2026",
    "playerId": "user_xyz789",
    "difficulty": "explorador",
    "status": "playing",
    "currentLevel": 1,
    "score": 0,
    "startedAt": "2025-07-15T18:00:00Z",
    "completedAt": null
  },
  "firstLevel": {
    "levelNumber": 1,
    "title": "El Descubridor",
    "clue": {
      "text": "En la plaza principal de la Zona Colonial, un hombre señala hacia el horizonte...",
      "hint": "Busca la estatua más prominente de la plaza.",
      "difficulty": "easy"
    },
    "spawn": {
      "lat": 18.4736,
      "lng": -69.8827,
      "heading": 200,
      "pitch": 5
    }
  }
}
```

> **Security note**: The response includes spawn coordinates and clue text but **never** includes `correctAnswers`, `targetLat`, or `targetLng`. Target coordinates and answers remain server-side only.

**Error Responses**:

| Status | Code | Description |
|--------|------|-------------|
| `400` | `SAGA_NOT_ACTIVE` | Saga is not currently active |
| `400` | `INVALID_DIFFICULTY` | Difficulty must be `"libre"` or `"explorador"` |
| `401` | `UNAUTHORIZED` | Missing or invalid auth token |
| `403` | `MAX_PARTICIPANTS` | Saga has reached maximum participant limit |
| `409` | `SESSION_EXISTS` | Player already has an active session for this saga |

---

### Validate Answer

Submit an answer for the current level. Validation happens entirely server-side.

```
POST /api/game/validate-answer
```

**Auth**: Required (Player)

**Request Body**:

```json
{
  "sessionId": "sess_abc123",
  "levelNumber": 1,
  "answer": "Cristóbal Colón",
  "playerPosition": {
    "lat": 18.4735,
    "lng": -69.8828
  }
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `sessionId` | `string` | Yes | Active game session ID |
| `levelNumber` | `number` | Yes | Level being answered (1–12) |
| `answer` | `string` | Yes | Player's answer text |
| `playerPosition` | `object` | Conditional | Required for `explorador` mode. Player's current Street View `{ lat, lng }` |

**Response** `200 OK` — Correct Answer:

```json
{
  "result": "correct",
  "pointsEarned": 285,
  "explanation": "La estatua de Cristóbal Colón fue erigida en 1887 en el Parque Colón...",
  "nextLevel": {
    "levelNumber": 2,
    "title": "La Primera Calle",
    "clue": {
      "text": "En la primera calle europea del Nuevo Mundo...",
      "hint": "Es conocida como la calle de las Damas...",
      "difficulty": "easy"
    },
    "spawn": {
      "lat": 18.4741,
      "lng": -69.8816,
      "heading": 0,
      "pitch": 5
    }
  },
  "session": {
    "currentLevel": 2,
    "score": 285,
    "status": "playing"
  }
}
```

**Response** `200 OK` — Incorrect Answer:

```json
{
  "result": "incorrect",
  "message": "Respuesta incorrecta. Sigue explorando."
}
```

**Response** `200 OK` — Too Far (Explorer Mode):

```json
{
  "result": "too_far",
  "message": "Acércate más al objetivo para enviar tu respuesta.",
  "distanceMeters": 342.7
}
```

**Response** `200 OK` — Final Level Completed (Winner):

```json
{
  "result": "winner",
  "totalScore": 3420,
  "totalTimeSeconds": 1847,
  "explanation": "Bartolomé Colón fundó la ciudad de Santo Domingo en 1498...",
  "session": {
    "currentLevel": 12,
    "score": 3420,
    "status": "completed",
    "completedAt": "2025-07-15T18:30:47Z"
  }
}
```

**Error Responses**:

| Status | Code | Description |
|--------|------|-------------|
| `400` | `INVALID_LEVEL` | Level number doesn't match session's current level |
| `400` | `EMPTY_ANSWER` | Answer text is empty |
| `400` | `MISSING_POSITION` | Player position required for explorer mode but not provided |
| `401` | `UNAUTHORIZED` | Missing or invalid auth token |
| `403` | `SESSION_NOT_OWNED` | Session does not belong to authenticated user |
| `404` | `SESSION_NOT_FOUND` | Session ID not found |
| `409` | `SESSION_COMPLETED` | Game session is already completed |

### Answer Validation Pipeline

The server validates answers through a multi-step pipeline:

```
1. Proximity check (explorer mode only)
   └── Haversine distance ≤ 100m from target coordinates
   └── Fail → return "too_far"

2. Exact/fuzzy match
   └── Normalize: lowercase, strip accents, remove punctuation
   └── Check substring match against correctAnswers[]
   └── Match → return "correct"

3. AI validation (optional, if enabled)
   └── Send to Gemini: player answer + correct answer + clue context
   └── Gemini returns { isCorrect, confidence, reasoning }
   └── confidence ≥ 0.8 → return "correct"

4. No match → return "incorrect"
```

---

### Get Session Status

Retrieve the current state of a game session.

```
GET /api/game/session/{sessionId}
```

**Auth**: Required (Player — must own the session)

**Path Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| `sessionId` | `string` | Game session ID |

**Response** `200 OK`:

```json
{
  "session": {
    "id": "sess_abc123",
    "sagaId": "saga-colon-2026",
    "difficulty": "explorador",
    "status": "playing",
    "currentLevel": 5,
    "score": 1420,
    "startedAt": "2025-07-15T18:00:00Z",
    "completedAt": null
  },
  "completedLevels": [
    { "levelNumber": 1, "pointsEarned": 285, "hintUsed": false, "timeSeconds": 45 },
    { "levelNumber": 2, "pointsEarned": 310, "hintUsed": false, "timeSeconds": 32 },
    { "levelNumber": 3, "pointsEarned": 275, "hintUsed": true, "timeSeconds": 67 },
    { "levelNumber": 4, "pointsEarned": 350, "hintUsed": false, "timeSeconds": 89 }
  ],
  "currentLevelData": {
    "levelNumber": 5,
    "title": "La Fortaleza",
    "clue": {
      "text": "Desde las murallas de la primera fortaleza militar...",
      "hint": "Busca la torre más alta dentro del complejo.",
      "difficulty": "medium"
    },
    "spawn": {
      "lat": 18.4733,
      "lng": -69.8841,
      "heading": 120,
      "pitch": 10
    }
  }
}
```

**Error Responses**:

| Status | Code | Description |
|--------|------|-------------|
| `401` | `UNAUTHORIZED` | Missing or invalid auth token |
| `403` | `SESSION_NOT_OWNED` | Session does not belong to authenticated user |
| `404` | `SESSION_NOT_FOUND` | Session ID not found |

---

## Saga Endpoints

### List Sagas

Retrieve all available sagas. Public endpoint.

```
GET /api/sagas
```

**Auth**: Not required

**Query Parameters**:

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `status` | `string` | `"active"` | Filter by status: `scheduled`, `active`, `completed`, `all` |
| `limit` | `number` | `20` | Results per page (max 50) |
| `offset` | `number` | `0` | Pagination offset |

**Response** `200 OK`:

```json
{
  "sagas": [
    {
      "id": "saga-colon-2026",
      "title": "Saga de Colón",
      "subtitle": "Zona Colonial · Santo Domingo",
      "description": "Explora la primera ciudad europea del Nuevo Mundo...",
      "city": "Santo Domingo",
      "prizeAmount": 1000,
      "totalLevels": 12,
      "maxParticipants": 5000,
      "currentParticipants": 3842,
      "status": "active",
      "startsAt": "2025-07-15T18:00:00Z",
      "difficulty": {
        "easy": 3,
        "medium": 3,
        "hard": 3,
        "extreme": 3
      }
    }
  ],
  "pagination": {
    "total": 1,
    "limit": 20,
    "offset": 0,
    "hasMore": false
  }
}
```

---

### Get Saga Details

Retrieve details for a specific saga, including level metadata (without answers).

```
GET /api/sagas/{sagaId}
```

**Auth**: Not required

**Path Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| `sagaId` | `string` | Saga UUID |

**Response** `200 OK`:

```json
{
  "saga": {
    "id": "saga-colon-2026",
    "title": "Saga de Colón",
    "subtitle": "Zona Colonial · Santo Domingo",
    "description": "Explora la primera ciudad europea del Nuevo Mundo...",
    "prizeAmount": 1000,
    "totalLevels": 12,
    "maxParticipants": 5000,
    "currentParticipants": 3842,
    "status": "active",
    "startsAt": "2025-07-15T18:00:00Z"
  },
  "levels": [
    {
      "levelNumber": 1,
      "title": "El Descubridor",
      "difficulty": "easy"
    },
    {
      "levelNumber": 2,
      "title": "La Primera Calle",
      "difficulty": "easy"
    }
  ]
}
```

> **Security note**: The `levels` array contains only `levelNumber`, `title`, and `difficulty`. Clue text, spawn coordinates, target coordinates, and correct answers are **never** included in this response. They are delivered one-at-a-time during gameplay via the session endpoints.

**Error Responses**:

| Status | Code | Description |
|--------|------|-------------|
| `404` | `SAGA_NOT_FOUND` | Saga ID does not exist |

---

## Leaderboard

### Get Leaderboard

Retrieve rankings for a saga. Public endpoint.

```
GET /api/leaderboard
```

**Auth**: Not required

**Query Parameters**:

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `sagaId` | `string` | — | Required. Filter by saga |
| `limit` | `number` | `50` | Results per page (max 100) |
| `offset` | `number` | `0` | Pagination offset |

**Response** `200 OK`:

```json
{
  "leaderboard": [
    {
      "rank": 1,
      "playerId": "user_xyz789",
      "displayName": "ExplorerPro",
      "levelsCompleted": 12,
      "totalScore": 3420,
      "totalTimeSeconds": 1847,
      "completedAt": "2025-07-15T18:30:47Z",
      "difficulty": "explorador"
    },
    {
      "rank": 2,
      "playerId": "user_abc456",
      "displayName": "StreetHunter",
      "levelsCompleted": 12,
      "totalScore": 3180,
      "totalTimeSeconds": 2103,
      "completedAt": "2025-07-15T18:35:23Z",
      "difficulty": "explorador"
    },
    {
      "rank": 3,
      "playerId": "user_def012",
      "displayName": "CasualExplorer",
      "levelsCompleted": 10,
      "totalScore": 1850,
      "totalTimeSeconds": null,
      "completedAt": null,
      "difficulty": "libre"
    }
  ],
  "pagination": {
    "total": 342,
    "limit": 50,
    "offset": 0,
    "hasMore": true
  }
}
```

**Ranking criteria** (in order of priority):
1. Players who completed all 12 levels first (by `completedAt`)
2. Highest `totalScore`
3. Fewest hints used

---

## Admin Endpoints

### Create Saga

Create a new saga. Admin only.

```
POST /api/admin/sagas
```

**Auth**: Required (Admin)

**Request Body**:

```json
{
  "title": "Saga del Malecón",
  "subtitle": "Malecón · Santo Domingo",
  "description": "Recorre el emblemático malecón de Santo Domingo...",
  "city": "Santo Domingo",
  "prizeAmount": 500,
  "maxParticipants": 3000,
  "startsAt": "2025-08-01T20:00:00Z"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | `string` | Yes | Saga name |
| `subtitle` | `string` | Yes | Location subtitle |
| `description` | `string` | Yes | Saga description |
| `city` | `string` | Yes | City name |
| `prizeAmount` | `number` | Yes | Prize in USD |
| `maxParticipants` | `number` | Yes | Maximum players allowed |
| `startsAt` | `string` | Yes | ISO 8601 start datetime |

**Response** `201 Created`:

```json
{
  "saga": {
    "id": "saga-malecon-2025",
    "title": "Saga del Malecón",
    "status": "draft",
    "totalLevels": 12,
    "createdBy": "admin_user_id"
  }
}
```

**Error Responses**:

| Status | Code | Description |
|--------|------|-------------|
| `400` | `VALIDATION_ERROR` | Missing or invalid fields |
| `401` | `UNAUTHORIZED` | Missing or invalid auth token |
| `403` | `FORBIDDEN` | User does not have admin role |

---

### Update Levels

Create or update all 12 levels for a saga. Admin only.

```
PUT /api/admin/sagas/{sagaId}/levels
```

**Auth**: Required (Admin)

**Request Body**:

```json
{
  "levels": [
    {
      "levelNumber": 1,
      "title": "El Obelisco",
      "clue": {
        "text": "Un monumento se alza donde el malecón comienza su recorrido...",
        "hint": "Es una estructura vertical de concreto muy conocida.",
        "difficulty": "easy"
      },
      "spawn": {
        "lat": 18.4589,
        "lng": -69.9192,
        "heading": 90,
        "pitch": 5
      },
      "target": {
        "lat": 18.4591,
        "lng": -69.9189
      },
      "correctAnswers": ["obelisco", "obelisco macho", "el obelisco"],
      "explanation": "El Obelisco Macho fue construido en 1936..."
    }
  ]
}
```

**Level Object**:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `levelNumber` | `number` | Yes | Level order (1–12) |
| `title` | `string` | Yes | Level name |
| `clue.text` | `string` | Yes | Riddle/clue text shown to player |
| `clue.hint` | `string` | No | Optional hint (25% score penalty) |
| `clue.difficulty` | `string` | Yes | `easy`, `medium`, `hard`, or `extreme` |
| `spawn.lat` | `number` | Yes | Street View starting latitude |
| `spawn.lng` | `number` | Yes | Street View starting longitude |
| `spawn.heading` | `number` | No | Initial camera heading (0–360°) |
| `spawn.pitch` | `number` | No | Initial camera pitch (-90 to 90°) |
| `target.lat` | `number` | Yes | Target latitude (for proximity check) |
| `target.lng` | `number` | Yes | Target longitude (for proximity check) |
| `correctAnswers` | `string[]` | Yes | Accepted answers (include aliases and common variants) |
| `explanation` | `string` | Yes | Educational context shown after correct answer |

**Response** `200 OK`:

```json
{
  "saga": {
    "id": "saga-malecon-2025",
    "totalLevels": 12
  },
  "levels": [
    { "levelNumber": 1, "title": "El Obelisco", "status": "created" }
  ]
}
```

**Error Responses**:

| Status | Code | Description |
|--------|------|-------------|
| `400` | `INVALID_LEVEL_COUNT` | Must provide exactly 12 levels |
| `400` | `DUPLICATE_LEVEL_NUMBERS` | Level numbers must be unique and sequential (1–12) |
| `400` | `MISSING_CORRECT_ANSWERS` | Each level must have at least one correct answer |
| `400` | `NO_STREET_VIEW_COVERAGE` | Spawn coordinates have no Street View coverage (validated server-side) |
| `401` | `UNAUTHORIZED` | Missing or invalid auth token |
| `403` | `FORBIDDEN` | User does not have admin role |
| `404` | `SAGA_NOT_FOUND` | Saga ID does not exist |

---

## AI Endpoints

### Generate Saga with AI

Use Google Gemini to generate a complete saga (12 levels with riddles, coordinates, and answers) from a topic description. Admin only.

```
POST /api/ai/generate-saga
```

**Auth**: Required (Admin)

**Request Body**:

```json
{
  "topic": "Revolutionary War sites in Boston",
  "city": "Boston",
  "language": "en",
  "difficultyProgression": true
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `topic` | `string` | Yes | Theme or topic for the saga |
| `city` | `string` | Yes | City where levels are set |
| `language` | `string` | No | Language for clues (`es` default, `en` available) |
| `difficultyProgression` | `boolean` | No | If `true` (default), levels progress from easy → extreme |

**Response** `200 OK`:

```json
{
  "generatedSaga": {
    "title": "Boston Freedom Trail",
    "subtitle": "Freedom Trail · Boston",
    "description": "Walk the path of American independence through Boston's historic streets...",
    "levels": [
      {
        "levelNumber": 1,
        "title": "The Common Ground",
        "clue": {
          "text": "Where the oldest public park in America lies...",
          "hint": "It's the green heart of downtown Boston.",
          "difficulty": "easy"
        },
        "spawn": { "lat": 42.3551, "lng": -71.0657, "heading": 180, "pitch": 0 },
        "target": { "lat": 42.3554, "lng": -71.0655 },
        "correctAnswers": ["boston common", "the common"],
        "explanation": "Boston Common was established in 1634..."
      }
    ]
  },
  "warnings": [
    "Level 7: Street View coverage unverified at target coordinates",
    "Level 11: Generated answers may need manual review"
  ]
}
```

> **Important**: AI-generated sagas are created as **drafts** and require manual review before activation. Verify Street View coverage at all spawn and target coordinates.

**Error Responses**:

| Status | Code | Description |
|--------|------|-------------|
| `400` | `INVALID_TOPIC` | Topic is too vague or empty |
| `401` | `UNAUTHORIZED` | Missing or invalid auth token |
| `403` | `FORBIDDEN` | User does not have admin role |
| `500` | `AI_GENERATION_FAILED` | Gemini API error or invalid response |
| `503` | `AI_SERVICE_UNAVAILABLE` | Gemini API is temporarily unavailable |

---

## Common Patterns

### Error Format

All error responses follow a consistent format:

```json
{
  "error": {
    "code": "SAGA_NOT_FOUND",
    "message": "No saga found with ID 'saga-xyz-123'",
    "status": 404
  }
}
```

| Field | Type | Description |
|-------|------|-------------|
| `error.code` | `string` | Machine-readable error code (UPPER_SNAKE_CASE) |
| `error.message` | `string` | Human-readable error description |
| `error.status` | `number` | HTTP status code |

### Pagination

List endpoints use offset-based pagination:

```
GET /api/sagas?limit=20&offset=40
```

Response includes:

```json
{
  "pagination": {
    "total": 85,
    "limit": 20,
    "offset": 40,
    "hasMore": true
  }
}
```

### Rate Limiting

| Endpoint Category | Rate Limit | Window |
|-------------------|-----------|--------|
| Public read (`GET /api/sagas`, `GET /api/leaderboard`) | 100 requests | per minute |
| Game actions (`POST /api/game/*`) | 30 requests | per minute |
| Admin actions (`POST /api/admin/*`) | 20 requests | per minute |
| AI generation (`POST /api/ai/*`) | 5 requests | per minute |

Rate limit headers included in every response:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 87
X-RateLimit-Reset: 1689445260
```

When rate limited, the API returns:

```json
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests. Try again in 23 seconds.",
    "status": 429
  }
}
```

```
Retry-After: 23
```
