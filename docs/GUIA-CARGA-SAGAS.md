# 📡 Guía de Carga de Sagas — UBEX

## ¿Qué es una Saga?

Una **Saga** es una aventura de exploración compuesta por **12 misiones** consecutivas ambientadas en una ciudad real. Cada saga tiene un tema narrativo (ej: "Saga de Colón", "Tesoros del Paraíso") y los exploradores compiten para completar todas las misiones primero.

## ¿Qué es una Misión?

Una **Misión** es un nivel individual dentro de una saga. Cada misión tiene:

| Campo | Descripción | Ejemplo |
|-------|-------------|---------|
| **Número** | Orden de la misión (1-12) | `1` |
| **Título** | Nombre corto de la misión | `Arena de Cristal` |
| **Descripción** | Contexto narrativo (opcional) | `La playa más famosa del Caribe...` |
| **Señal principal** | El enigma/pista que el explorador debe resolver | `"En esta playa de arena blanca, los turistas llegan por miles. ¿Cómo se llama?"` |
| **Respuesta** | Lo que el explorador debe escribir para avanzar | `Playa Bávaro` |
| **Señales de radar** | Pistas adicionales si el explorador se traba (opcional) | `["Está en Punta Cana", "Empieza con B"]` |
| **Coordenadas de inicio** | Donde aparece el explorador en Street View | `18.6862, -68.4100` |
| **Coordenadas objetivo** | La ubicación real de la respuesta | `18.6895, -68.4050` |
| **Radio de proximidad** | Metros de cercanía requeridos (0 = sin restricción) | `200` |
| **XP** | Puntos que gana el explorador al completar | `100` |
| **Tiempo límite** | Segundos máximos (opcional, 0 = sin límite) | `300` |

---

## ⚠️ REGLA DE ORO: Accesibilidad desde Street View

**TODAS las misiones deben poder resolverse DESDE Google Street View.** El explorador SOLO puede navegar por calles y aceras — no puede entrar a edificios, caminar por playas ni volar.

### ✅ Válido (visible desde la calle)
- Fachadas de edificios, iglesias, museos (exterior)
- Estatuas y monumentos en plazas o calles
- Nombres de calles y plazas (señalización visible)
- Arcos, columnas, torres y elementos arquitectónicos exteriores
- Letreros, carteles y señalización urbana
- Puentes, fuentes, murallas y estructuras al aire libre
- Número de arcos/ventanas en una fachada (visible desde afuera)

### ❌ Prohibido (NO accesible desde Street View)
- Interiores de edificios, iglesias, museos
- Objetos dentro de edificios (lámparas, cuadros, reliquias, altares)
- Playas, senderos o zonas naturales sin cobertura vial
- Patios interiores o jardines cerrados
- Zonas marítimas o coordenadas en el agua
- Cualquier detalle que requiera "entrar" a un lugar

### 📍 Coordenadas GPS
- Tanto el punto de inicio (spawn) como el objetivo (target) DEBEN estar **sobre una calle o acera** con cobertura de Google Street View
- NUNCA usar coordenadas en el agua, arena, o terreno sin carretera
- Verificar siempre en Google Maps que el punto tiene cobertura Street View (las líneas azules en el mapa indican cobertura)

---

## Paso a Paso: Crear una Saga

### Paso 1: Elegir Ciudad y Tema

Decidir:
- **País y Ciudad** (ej: República Dominicana → Santo Domingo)
- **Tema narrativo** (ej: "Ruta Colonial", "Misterios del Malecón")
- **Dificultad**: fácil, media, o difícil
- **12 ubicaciones** interesantes de esa ciudad

### Paso 2: Obtener Coordenadas GPS

Para cada misión necesitas **dos pares de coordenadas**:

#### Coordenadas de inicio (spawn) — Donde aparece el explorador
Es el punto en Google Street View donde el explorador "aterriza" al iniciar la misión.

#### Coordenadas objetivo (target) — La ubicación de la respuesta
Es el lugar real al que se refiere la pista. El explorador debe estar cerca de este punto para poder responder (según el radio de proximidad).

#### ¿Cómo obtener las coordenadas?

**Método 1: Google Maps (más fácil)**
1. Abre [Google Maps](https://maps.google.com)
2. Busca el lugar deseado
3. Haz clic derecho sobre el punto exacto en el mapa
4. La primera opción muestra las coordenadas (ej: `18.4719, -69.8923`)
5. Haz clic para copiarlas al portapapeles
6. El primer número es **Latitud**, el segundo es **Longitud**

**Método 2: Google Street View**
1. Abre Google Maps y arrastra el "muñeco naranja" (Pegman) a la calle
2. En la barra de dirección verás algo como: `@18.4719,-69.8923,3a,75y...`
3. Los primeros dos números después de `@` son lat,lng

**Consejo**: Las coordenadas de inicio deben estar **cerca pero NO exactamente** en el objetivo. El explorador debe navegar por Street View para encontrar el lugar.

| | Latitud | Longitud |
|---|---------|----------|
| **Inicio (spawn)** | Punto de partida, a 100-500m del objetivo | Ej: `18.4700` / `-69.8900` |
| **Objetivo (target)** | El lugar exacto de la respuesta | Ej: `18.4719` / `-69.8923` |

### Paso 3: Diseñar las Pistas y Respuestas

#### La Señal Principal (pista/enigma)
Es el texto que el explorador lee para descubrir la respuesta. Debe ser:
- ✅ Interesante y con contexto histórico/cultural
- ✅ Suficiente información para deducir la respuesta
- ✅ Redactada como un enigma, no como una pregunta directa
- ❌ NO demasiado obvia ("¿Cómo se llama esta calle?" → aburrido)
- ❌ NO imposible de resolver sin conocimiento previo extremo

**Ejemplo bueno:**
> "Construida en 1510 por orden del virrey Diego Colón, esta fortaleza vigilaba la desembocadura del río Ozama. Hoy es patrimonio de la humanidad."

**Respuesta:** `Alcázar de Colón`

#### La Respuesta
Es lo que el explorador escribe para avanzar. Puntos importantes:

- **No distingue mayúsculas/minúsculas** — "playa bavaro" = "Playa Bávaro"
- **No distingue acentos** — "colon" = "Colón"
- **Puedes definir múltiples respuestas válidas** en el CSV separadas por `|`
- Ejemplo: `Playa Bávaro|bavaro|playa bavaro`

#### Señales de Radar (pistas adicionales, opcional)
Son ayudas extra que el explorador puede activar si se traba. Sepáralas con `|` en el CSV.

**Ejemplo:** `Está en la costa este|Empieza con la letra B|Es famosa por su arena blanca`

### Paso 4: Cargar al Sistema

Hay **dos formas** de cargar una saga:

#### Opción A: Desde el Panel de Administración (manual)
1. Ir a `ubex.vercel.app/admin/sagas`
2. Clic en "Nueva Saga"
3. Llenar: título, descripción, país, ciudad, dificultad
4. Se crea la saga vacía → se abre el editor
5. Clic en "Agregar Misión" para cada una de las 12 misiones
6. Llenar los campos de cada misión uno por uno
7. Guardar cada misión

#### Opción B: Archivo de Importación (CSV)
Preparar un archivo CSV con todas las misiones y enviárnoslo para carga masiva.

**Ver archivo de ejemplo:** `docs/saga-ejemplo-importacion.csv`

---

## Formato del Archivo de Importación

### Campos de la Saga (fila 1 del CSV o pestaña separada)

| Campo | Requerido | Descripción |
|-------|-----------|-------------|
| saga_titulo | ✅ | Nombre de la saga |
| saga_descripcion | ❌ | Descripción narrativa |
| saga_pais | ✅ | País (ej: República Dominicana) |
| saga_ciudad | ✅ | Ciudad (ej: Santo Domingo) |
| saga_dificultad | ❌ | easy / medium / hard (default: medium) |
| saga_duracion_min | ❌ | Duración estimada en minutos (default: 60) |

### Campos por Misión (una fila por misión)

| Campo | Requerido | Tipo | Descripción |
|-------|-----------|------|-------------|
| numero | ✅ | Número | Orden de la misión (1-12) |
| titulo | ✅ | Texto | Nombre de la misión |
| descripcion | ❌ | Texto | Contexto narrativo |
| senal_principal | ✅ | Texto | El enigma/pista |
| respuesta | ✅ | Texto | Respuesta(s) válidas separadas por `\|` |
| senales_radar | ❌ | Texto | Pistas adicionales separadas por `\|` |
| spawn_lat | ✅ | Decimal | Latitud donde aparece el explorador |
| spawn_lng | ✅ | Decimal | Longitud donde aparece el explorador |
| target_lat | ✅ | Decimal | Latitud del objetivo (respuesta) |
| target_lng | ✅ | Decimal | Longitud del objetivo (respuesta) |
| radio_proximidad | ❌ | Número | Metros de cercanía (default: 200) |
| xp | ❌ | Número | Puntos XP (default: 100) |
| tiempo_limite_seg | ❌ | Número | Segundos máximos (0 = sin límite) |

---

## Ejemplo Completo: Saga "Ruta Colonial"

| # | Título | Señal Principal | Respuesta | Spawn | Target |
|---|--------|----------------|-----------|-------|--------|
| 1 | La Fortaleza Olvidada | "Construida en 1510 por Diego Colón, vigilaba el río Ozama..." | Alcázar de Colón | 18.4730, -69.8830 | 18.4719, -69.8823 |
| 2 | Calles de Piedra | "La primera calle pavimentada del Nuevo Mundo..." | Calle Las Damas | 18.4740, -69.8840 | 18.4735, -69.8833 |
| 3 | El Faro del Almirante | "Un monumento en forma de cruz que alberga los restos del descubridor..." | Faro a Colón | 18.4890, -69.8680 | 18.4882, -69.8672 |
| ... | ... | ... | ... | ... | ... |

---

## Preguntas Frecuentes

### ¿La respuesta que debe dar el explorador se carga en la saga?
**Sí.** Cada misión tiene un campo `respuesta` que es lo que el explorador debe escribir. El sistema compara automáticamente lo que escribe el explorador con las respuestas válidas (sin importar mayúsculas ni acentos). Puedes definir múltiples respuestas válidas por misión.

### ¿Qué pasa si el explorador no está cerca del objetivo?
Si configuraste un `radio_proximidad` > 0, el explorador debe navegar en Street View hasta estar dentro de ese radio para poder enviar su respuesta. Si no está suficientemente cerca, el sistema le avisa: *"Acércate a las coordenadas objetivo para validar datos."*

### ¿Puedo tener misiones sin restricción de proximidad?
Sí. Pon `radio_proximidad = 0` y el explorador podrá responder desde cualquier punto del mapa.

### ¿Cuántas misiones debe tener una saga?
El estándar es **12 misiones** por saga, pero el sistema soporta cualquier cantidad.

### ¿Puedo editar una saga después de cargarla?
Sí. Desde el panel de administración (`/admin/sagas`) puedes editar todos los campos de la saga y sus misiones en cualquier momento.

### ¿Puedo tener varias respuestas correctas para una misión?
Sí. Sepáralas con `|` en el CSV. Ejemplo: `Playa Bávaro|bavaro|playa bavaro`. Cualquiera de esas será aceptada.
