# Referencia de API — UBEX

> Endpoints REST API planificados para UBEX. Estos endpoints se implementarán como rutas de API de Next.js en `src/app/api/`.

**URL base**: `https://ubex.app/api` (producción) o `http://localhost:3000/api` (desarrollo)

**Autenticación**: Todos los endpoints autenticados requieren un Bearer token de Supabase Auth en el Authorization header.

**Estado**: 📝 Estos endpoints están planificados. La demo actual funciona completamente del lado del cliente.

---

## Tabla de Contenidos

- [Autenticación](#autenticación)
- [Endpoints de Juego](#endpoints-de-juego)
  - [Iniciar Sesión de Juego](#iniciar-sesión-de-juego)
  - [Validar Respuesta](#validar-respuesta)
  - [Obtener Estado de Sesión](#obtener-estado-de-sesión)
- [Endpoints de Saga](#endpoints-de-saga)
  - [Listar Sagas](#listar-sagas)
  - [Obtener Detalles de Saga](#obtener-detalles-de-saga)
- [Tabla de Clasificación](#tabla-de-clasificación)
  - [Obtener Tabla de Clasificación](#obtener-tabla-de-clasificación)
- [Endpoints de Administración](#endpoints-de-administración)
  - [Crear Saga](#crear-saga)
  - [Actualizar Niveles](#actualizar-niveles)
- [Endpoints de IA](#endpoints-de-ia)
  - [Generar Saga con IA](#generar-saga-con-ia)
- [Patrones Comunes](#patrones-comunes)
  - [Formato de Errores](#formato-de-errores)
  - [Pagination](#pagination)
  - [Rate Limiting](#rate-limiting)

---

## Autenticación

Todas las solicitudes autenticadas deben incluir un token de acceso de Supabase:

```
Authorization: Bearer <supabase_access_token>
```

Puedes obtener un token iniciando sesión a través de Supabase Auth:

```typescript
const { data } = await supabase.auth.signInWithPassword({
  email: 'player@example.com',
  password: 'your-password',
});

const token = data.session?.access_token;
```

### Niveles de Autenticación

| Nivel | Descripción | Endpoints |
|-------|-------------|-----------|
| **Público** | No requiere autenticación | `GET /api/sagas`, `GET /api/leaderboard` |
| **Jugador** | Usuario autenticado | `POST /api/game/*`, `GET /api/game/*` |
| **Admin** | Usuario con rol `admin` | `POST /api/admin/*`, `PUT /api/admin/*`, `POST /api/ai/*` |

---

## Endpoints de Juego

### Iniciar Sesión de Juego

Crea una nueva sesión de juego para el jugador autenticado.

```
POST /api/game/start-session
```

**Autenticación**: Requerida (Jugador)

**Request Body**:

```json
{
  "sagaId": "saga-colon-2026",
  "difficulty": "explorador"
}
```

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `sagaId` | `string` | Sí | UUID de la saga a jugar |
| `difficulty` | `string` | Sí | `"libre"` o `"explorador"` |

**Response** `201 Creado`:

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

> **Nota de seguridad**: La respuesta incluye coordenadas de inicio y texto de pista pero **nunca** incluye `correctAnswers`, `targetLat` o `targetLng`. Las coordenadas objetivo y las respuestas permanecen solo del lado del servidor.

**Respuestas de Error**:

| Estado | Código | Descripción |
|--------|--------|-------------|
| `400` | `SAGA_NOT_ACTIVE` | La saga no está activa actualmente |
| `400` | `INVALID_DIFFICULTY` | La dificultad debe ser `"libre"` o `"explorador"` |
| `401` | `UNAUTHORIZED` | Token de autenticación faltante o inválido |
| `403` | `MAX_PARTICIPANTS` | La saga alcanzó el límite máximo de participantes |
| `409` | `SESSION_EXISTS` | El jugador ya tiene una sesión activa para esta saga |

---

### Validar Respuesta

Envía una respuesta para el nivel actual. La validación ocurre completamente del lado del servidor.

```
POST /api/game/validate-answer
```

**Autenticación**: Requerida (Jugador)

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

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `sessionId` | `string` | Sí | ID de sesión de juego activa |
| `levelNumber` | `number` | Sí | Nivel que se está respondiendo (1–12) |
| `answer` | `string` | Sí | Texto de respuesta del jugador |
| `playerPosition` | `object` | Condicional | Requerido para el modo `explorador`. Posición actual del jugador en Street View `{ lat, lng }` |

**Response** `200 OK` — Respuesta Correcta:

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

**Response** `200 OK` — Respuesta Incorrecta:

```json
{
  "result": "incorrect",
  "message": "Respuesta incorrecta. Sigue explorando."
}
```

**Response** `200 OK` — Demasiado Lejos (Modo Explorador):

```json
{
  "result": "too_far",
  "message": "Acércate más al objetivo para enviar tu respuesta.",
  "distanceMeters": 342.7
}
```

**Response** `200 OK` — Nivel Final Completado (Ganador):

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

**Respuestas de Error**:

| Estado | Código | Descripción |
|--------|--------|-------------|
| `400` | `INVALID_LEVEL` | El número de nivel no coincide con el nivel actual de la sesión |
| `400` | `EMPTY_ANSWER` | El texto de respuesta está vacío |
| `400` | `MISSING_POSITION` | La posición del jugador es requerida para el modo explorador pero no fue proporcionada |
| `401` | `UNAUTHORIZED` | Token de autenticación faltante o inválido |
| `403` | `SESSION_NOT_OWNED` | La sesión no pertenece al usuario autenticado |
| `404` | `SESSION_NOT_FOUND` | ID de sesión no encontrado |
| `409` | `SESSION_COMPLETED` | La sesión de juego ya fue completada |

### Pipeline de Validación de Respuestas

El servidor valida las respuestas a través de un pipeline de múltiples pasos:

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

### Obtener Estado de Sesión

Obtiene el estado actual de una sesión de juego.

```
GET /api/game/session/{sessionId}
```

**Autenticación**: Requerida (Jugador — debe ser dueño de la sesión)

**Parámetros de Ruta**:

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `sessionId` | `string` | ID de sesión de juego |

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

**Respuestas de Error**:

| Estado | Código | Descripción |
|--------|--------|-------------|
| `401` | `UNAUTHORIZED` | Token de autenticación faltante o inválido |
| `403` | `SESSION_NOT_OWNED` | La sesión no pertenece al usuario autenticado |
| `404` | `SESSION_NOT_FOUND` | ID de sesión no encontrado |

---

## Endpoints de Saga

### Listar Sagas

Obtiene todas las sagas disponibles. Endpoint público.

```
GET /api/sagas
```

**Autenticación**: No requerida

**Parámetros de Consulta**:

| Parámetro | Tipo | Por defecto | Descripción |
|-----------|------|-------------|-------------|
| `status` | `string` | `"active"` | Filtrar por estado: `scheduled`, `active`, `completed`, `all` |
| `limit` | `number` | `20` | Resultados por página (máx. 50) |
| `offset` | `number` | `0` | Desplazamiento de pagination |

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

### Obtener Detalles de Saga

Obtiene los detalles de una saga específica, incluyendo metadatos de niveles (sin respuestas).

```
GET /api/sagas/{sagaId}
```

**Autenticación**: No requerida

**Parámetros de Ruta**:

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `sagaId` | `string` | UUID de la saga |

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

> **Nota de seguridad**: El arreglo `levels` contiene solo `levelNumber`, `title` y `difficulty`. El texto de las pistas, coordenadas de inicio, coordenadas objetivo y respuestas correctas **nunca** se incluyen en esta respuesta. Se entregan una a la vez durante el juego a través de los endpoints de sesión.

**Respuestas de Error**:

| Estado | Código | Descripción |
|--------|--------|-------------|
| `404` | `SAGA_NOT_FOUND` | El ID de saga no existe |

---

## Tabla de Clasificación

### Obtener Tabla de Clasificación

Obtiene las clasificaciones de una saga. Endpoint público.

```
GET /api/leaderboard
```

**Autenticación**: No requerida

**Parámetros de Consulta**:

| Parámetro | Tipo | Por defecto | Descripción |
|-----------|------|-------------|-------------|
| `sagaId` | `string` | — | Requerido. Filtrar por saga |
| `limit` | `number` | `50` | Resultados por página (máx. 100) |
| `offset` | `number` | `0` | Desplazamiento de pagination |

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

**Criterios de clasificación** (en orden de prioridad):
1. Jugadores que completaron los 12 niveles primero (por `completedAt`)
2. Mayor `totalScore`
3. Menos pistas utilizadas

---

## Endpoints de Administración

### Crear Saga

Crea una nueva saga. Solo administradores.

```
POST /api/admin/sagas
```

**Autenticación**: Requerida (Admin)

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

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `title` | `string` | Sí | Nombre de la saga |
| `subtitle` | `string` | Sí | Subtítulo de ubicación |
| `description` | `string` | Sí | Descripción de la saga |
| `city` | `string` | Sí | Nombre de la ciudad |
| `prizeAmount` | `number` | Sí | Premio en USD |
| `maxParticipants` | `number` | Sí | Máximo de jugadores permitidos |
| `startsAt` | `string` | Sí | Fecha y hora de inicio ISO 8601 |

**Response** `201 Creado`:

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

**Respuestas de Error**:

| Estado | Código | Descripción |
|--------|--------|-------------|
| `400` | `VALIDATION_ERROR` | Campos faltantes o inválidos |
| `401` | `UNAUTHORIZED` | Token de autenticación faltante o inválido |
| `403` | `FORBIDDEN` | El usuario no tiene rol de administrador |

---

### Actualizar Niveles

Crea o actualiza los 12 niveles de una saga. Solo administradores.

```
PUT /api/admin/sagas/{sagaId}/levels
```

**Autenticación**: Requerida (Admin)

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

**Objeto de Nivel**:

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `levelNumber` | `number` | Sí | Orden del nivel (1–12) |
| `title` | `string` | Sí | Nombre del nivel |
| `clue.text` | `string` | Sí | Texto del acertijo/pista mostrado al jugador |
| `clue.hint` | `string` | No | Pista opcional (penalización del 25% en puntuación) |
| `clue.difficulty` | `string` | Sí | `easy`, `medium`, `hard` o `extreme` |
| `spawn.lat` | `number` | Sí | Latitud de inicio en Street View |
| `spawn.lng` | `number` | Sí | Longitud de inicio en Street View |
| `spawn.heading` | `number` | No | Dirección inicial de la cámara (0–360°) |
| `spawn.pitch` | `number` | No | Inclinación inicial de la cámara (-90 a 90°) |
| `target.lat` | `number` | Sí | Latitud objetivo (para verificación de proximidad) |
| `target.lng` | `number` | Sí | Longitud objetivo (para verificación de proximidad) |
| `correctAnswers` | `string[]` | Sí | Respuestas aceptadas (incluir alias y variantes comunes) |
| `explanation` | `string` | Sí | Contexto educativo mostrado después de respuesta correcta |

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

**Respuestas de Error**:

| Estado | Código | Descripción |
|--------|--------|-------------|
| `400` | `INVALID_LEVEL_COUNT` | Se deben proporcionar exactamente 12 niveles |
| `400` | `DUPLICATE_LEVEL_NUMBERS` | Los números de nivel deben ser únicos y secuenciales (1–12) |
| `400` | `MISSING_CORRECT_ANSWERS` | Cada nivel debe tener al menos una respuesta correcta |
| `400` | `NO_STREET_VIEW_COVERAGE` | Las coordenadas de inicio no tienen cobertura de Street View (validado del lado del servidor) |
| `401` | `UNAUTHORIZED` | Token de autenticación faltante o inválido |
| `403` | `FORBIDDEN` | El usuario no tiene rol de administrador |
| `404` | `SAGA_NOT_FOUND` | El ID de saga no existe |

---

## Endpoints de IA

### Generar Saga con IA

Usa Google Gemini para generar una saga completa (12 niveles con acertijos, coordenadas y respuestas) a partir de una descripción de tema. Solo administradores.

```
POST /api/ai/generate-saga
```

**Autenticación**: Requerida (Admin)

**Request Body**:

```json
{
  "topic": "Revolutionary War sites in Boston",
  "city": "Boston",
  "language": "en",
  "difficultyProgression": true
}
```

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `topic` | `string` | Sí | Tema o tópico para la saga |
| `city` | `string` | Sí | Ciudad donde se ubican los niveles |
| `language` | `string` | No | Idioma para las pistas (`es` por defecto, `en` disponible) |
| `difficultyProgression` | `boolean` | No | Si es `true` (por defecto), los niveles progresan de easy → extreme |

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

> **Importante**: Las sagas generadas por IA se crean como **borradores** y requieren revisión manual antes de su activación. Verifica la cobertura de Street View en todas las coordenadas de inicio y objetivo.

**Respuestas de Error**:

| Estado | Código | Descripción |
|--------|--------|-------------|
| `400` | `INVALID_TOPIC` | El tema es demasiado vago o está vacío |
| `401` | `UNAUTHORIZED` | Token de autenticación faltante o inválido |
| `403` | `FORBIDDEN` | El usuario no tiene rol de administrador |
| `500` | `AI_GENERATION_FAILED` | Error de la API de Gemini o respuesta inválida |
| `503` | `AI_SERVICE_UNAVAILABLE` | La API de Gemini no está disponible temporalmente |

---

## Patrones Comunes

### Formato de Errores

Todas las respuestas de error siguen un formato consistente:

```json
{
  "error": {
    "code": "SAGA_NOT_FOUND",
    "message": "No saga found with ID 'saga-xyz-123'",
    "status": 404
  }
}
```

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `error.code` | `string` | Código de error legible por máquina (UPPER_SNAKE_CASE) |
| `error.message` | `string` | Descripción del error legible por humanos |
| `error.status` | `number` | Código de estado HTTP |

### Pagination

Los endpoints de listado usan pagination basada en offset:

```
GET /api/sagas?limit=20&offset=40
```

La respuesta incluye:

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

| Categoría de Endpoint | Límite | Ventana |
|-----------------------|--------|---------|
| Lectura pública (`GET /api/sagas`, `GET /api/leaderboard`) | 100 solicitudes | por minuto |
| Acciones de juego (`POST /api/game/*`) | 30 solicitudes | por minuto |
| Acciones de administración (`POST /api/admin/*`) | 20 solicitudes | por minuto |
| Generación con IA (`POST /api/ai/*`) | 5 solicitudes | por minuto |

Headers de rate limiting incluidos en cada respuesta:

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
