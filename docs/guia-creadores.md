# Guía para Creadores de Mapas — UBEX

> Aprende a crear sagas increíbles para UBEX. Esta guía te lleva paso a paso desde la idea inicial hasta una saga publicada con 12 niveles de exploración.

---

## Tabla de Contenidos

1. [Bienvenida](#bienvenida)
2. [Cómo Crear Tu Primera Saga](#cómo-crear-tu-primera-saga)
3. [Elegir una Ciudad y Tema](#elegir-una-ciudad-y-tema)
4. [Diseñar Buenos Acertijos](#diseñar-buenos-acertijos)
5. [Usar el Editor de Coordenadas](#usar-el-editor-de-coordenadas)
6. [Verificar Cobertura de Street View](#verificar-cobertura-de-street-view)
7. [Estructura de un Nivel Completo](#estructura-de-un-nivel-completo)
8. [Mejores Prácticas para Niveles Engaging](#mejores-prácticas-para-niveles-engaging)
9. [Ejemplos: Buenos vs Malos Acertijos](#ejemplos-buenos-vs-malos-acertijos)
10. [Progresión de Dificultad](#progresión-de-dificultad)
11. [Programa VIP para Creadores](#programa-vip-para-creadores)
12. [Checklist Final](#checklist-final)

---

## Bienvenida

¡Bienvenido al equipo de creadores de UBEX! Como creador de mapas, tienes el poder de diseñar experiencias de exploración que miles de jugadores van a disfrutar. Tu trabajo convierte calles reales en aventuras.

### ¿Qué es un Creador de Mapas?

Un creador de mapas diseña **sagas** — colecciones de 12 niveles ambientados en una ciudad real. Cada nivel incluye:

- Un punto de aparición (spawn) en Google Street View
- Un punto objetivo donde está la respuesta
- Un acertijo/pista que guía al jugador
- Una pista opcional (hint)
- Las respuestas correctas aceptadas
- Una explicación educativa

### Requisitos

- Conocimiento de la ciudad/zona que quieres mapear
- Acceso a Google Street View para verificar cobertura
- Creatividad para diseñar acertijos que requieran exploración
- Atención al detalle (coordenadas exactas importan)

---

## Cómo Crear Tu Primera Saga

### Paso 1: Elige tu Ciudad y Tema

Piensa en una ciudad que conozcas bien y en un tema que conecte los 12 niveles.

```
Ejemplo:
  Ciudad: Santo Domingo, República Dominicana
  Tema: "Saga de Colón" — Historia colonial de la Zona Colonial
  Conexión: Cada nivel explora un monumento o calle de la primera ciudad europea en América
```

### Paso 2: Investiga 15–20 Ubicaciones

Recopila más ubicaciones de las que necesitas. De 15–20 candidatas, seleccionarás las 12 mejores.

Para cada ubicación, anota:
- Nombre del lugar
- Por qué es interesante
- Qué puede observar el jugador en Street View
- Dato histórico/cultural relevante

### Paso 3: Verifica Cobertura de Street View

Para **cada** ubicación, verifica que:
- Existe cobertura de Street View (no todas las calles tienen)
- La vista muestra claramente el punto de interés
- El jugador puede navegar hasta el lugar desde el punto de spawn

### Paso 4: Diseña los 12 Niveles

Ordena los niveles de fácil a difícil:

| Niveles | Dificultad | Características |
|---------|-----------|-----------------|
| 1–3 | `easy` | Spawn cerca del objetivo, acertijo directo |
| 4–6 | `medium` | Algo de exploración necesaria |
| 7–9 | `hard` | Spawn lejos, acertijo complejo |
| 10–12 | `extreme` | Máxima exploración y deducción |

### Paso 5: Prueba Tu Saga

Juega tu propia saga completa:
- ¿Los acertijos se entienden?
- ¿El jugador puede encontrar la respuesta explorando?
- ¿Las respuestas correctas cubren variantes razonables?
- ¿Los puntos de spawn tienen buena vista panorámica?

### Paso 6: Envía para Revisión

Completa el formulario de tu saga y envíala al equipo UBEX para revisión y publicación.

---

## Elegir una Ciudad y Tema

### Criterios para una Buena Ciudad

| Criterio | Por qué importa |
|----------|-----------------|
| **Cobertura de Street View** | Sin cobertura, no hay juego. Verifica antes de invertir tiempo |
| **Riqueza cultural** | Ciudades con historia, monumentos y arquitectura hacen mejores sagas |
| **Variedad visual** | Calles, plazas, parques, edificios — el jugador necesita variedad |
| **Navegabilidad** | Calles conectadas donde el jugador pueda caminar libremente |
| **Interés global** | Ciudades que despierten curiosidad en jugadores de todo el mundo |

### Buenos Temas

| Tema | Ejemplo de Ciudad |
|------|-------------------|
| Historia colonial | Santo Domingo, Cartagena, La Habana |
| Arquitectura moderna | Barcelona, Dubai, Singapur |
| Gastronomía y mercados | Ciudad de México, Bangkok, Estambul |
| Arte callejero | Berlín, Melbourne, Valparaíso |
| Revolución e independencia | Boston, París, Buenos Aires |
| Naturaleza urbana | Vancouver, Medellín, Curitiba |
| Misterio y leyendas | Edimburgo, Praga, Nueva Orleans |

### Temas a Evitar

- Zonas residenciales sin puntos de interés
- Áreas industriales o autopistas (mala experiencia en Street View)
- Ciudades con cobertura limitada o desactualizada
- Temas que requieran información no observable en Street View

---

## Diseñar Buenos Acertijos

### Principio Fundamental

> **Un buen acertijo requiere que el jugador EXPLORE para encontrar la respuesta, no que la busque en Google.**

### Anatomía de un Buen Acertijo

```
┌─────────────────────────────────────────────┐
│              BUEN ACERTIJO                   │
├─────────────────────────────────────────────┤
│                                              │
│  1. CONTEXTO NARRATIVO                      │
│     Sitúa al jugador en el lugar            │
│     "En la plaza principal..."              │
│                                              │
│  2. ELEMENTO OBSERVABLE                      │
│     Algo que el jugador puede VER            │
│     "...un hombre señala hacia el horizonte" │
│                                              │
│  3. PREGUNTA ESPECÍFICA                      │
│     Con una respuesta clara y verificable    │
│     "¿Quién es este explorador?"            │
│                                              │
└─────────────────────────────────────────────┘
```

### Los 6 Tipos de Acertijos

#### 1. Observación Directa
El jugador debe encontrar y leer/observar algo visible.

```
✅ "¿Cuántos arcos tiene la fachada del edificio frente a ti?"
   Respuesta: "5"
   Por qué funciona: Requiere mirar y contar
```

#### 2. Navegación + Descubrimiento
El jugador debe caminar hacia un punto para descubrir la respuesta.

```
✅ "Camina por la calle peatonal más famosa de la zona.
    ¿Cómo se llama esta arteria comercial?"
   Respuesta: "El Conde"
   Por qué funciona: Requiere explorar y encontrar señales/carteles
```

#### 3. Historia en el Lugar
Combina observación con conocimiento del contexto.

```
✅ "Al cruzar esta puerta, un pueblo declaró su independencia.
    ¿En qué año ocurrió este evento?"
   Respuesta: "1844"
   Por qué funciona: Hay placas o señales cerca que indican la fecha
```

#### 4. Identificación Arquitectónica
Reconocer estilos, materiales o elementos.

```
✅ "La catedral mezcla el gótico tardío con un estilo renacentista
    que recuerda a la platería. ¿Qué estilo define su fachada?"
   Respuesta: "plateresco"
   Por qué funciona: Invita a observar detalles arquitectónicos
```

#### 5. Conteo y Detalle
Contar elementos específicos en la escena.

```
✅ "¿Cuántas ventanas tiene el segundo piso del palacio?"
   Respuesta: "7"
   Por qué funciona: Simple pero requiere mirar con atención
```

#### 6. Orientación Geográfica
Requiere navegar en una dirección específica.

```
✅ "Desde la plaza, camina hacia el río. ¿Qué torre vigila
    la entrada del puerto?"
   Respuesta: "Torre del Homenaje"
   Por qué funciona: Combina navegación con identificación
```

---

## Usar el Editor de Coordenadas

### Obtener Coordenadas de Spawn

Para obtener las coordenadas exactas de un punto en Google Street View:

1. Abre [Google Maps](https://maps.google.com)
2. Arrastra el "Pegman" (el muñeco amarillo) a la calle deseada
3. En la URL del navegador, encontrarás las coordenadas:

```
https://www.google.com/maps/@18.4736,-69.8827,3a,75y,200h,85t/data=...
                              ↑         ↑        ↑    ↑
                             lat       lng    heading  pitch(*)

(*) pitch en Google Maps es "tilt" — el valor se transforma:
    pitch UBEX = 90 - tilt_google
```

### Interpretar la URL de Street View

```
@{lat},{lng},3a,{zoom}y,{heading}h,{tilt}t

lat     = Latitud (decimal)
lng     = Longitud (decimal)
heading = Dirección de la cámara (0-360°, 0=norte, 90=este, 180=sur, 270=oeste)
tilt    = Inclinación (90=horizontal, <90=mirando arriba, >90=mirando abajo)
```

### Ejemplo Práctico

Para el Nivel 1 de la Saga de Colón:

```
Spawn Point:
  URL: google.com/maps/@18.4736,-69.8827,3a,75y,200h,85t
  lat: 18.4736
  lng: -69.8827
  heading: 200  (mirando hacia el suroeste)
  pitch: 5     (ligeramente hacia arriba)

Target Point (donde está la respuesta):
  lat: 18.4738
  lng: -69.8830
  Nota: el target no necesita heading/pitch
```

### Consejos para Coordenadas

| Consejo | Detalles |
|---------|----------|
| **Spawn con buena vista** | Elige un punto de spawn donde el jugador pueda orientarse |
| **Heading significativo** | Apunta la cámara hacia algo relevante (no a un muro vacío) |
| **Target accesible** | Asegúrate de que el jugador pueda caminar hasta el target desde el spawn |
| **Precision decimal** | Usa al menos 4 decimales (18.4736, no 18.47) |

---

## Verificar Cobertura de Street View

### Por Qué Es Crítico

UBEX busca panoramas de Street View dentro de un radio de **200 metros** del punto de spawn. Si no hay cobertura, el jugador verá un error en lugar del juego.

### Cómo Verificar

#### Método 1: Google Maps (Visual)
1. Abre Google Maps
2. Activa la capa de Street View (arrastra el Pegman)
3. Las calles con cobertura se resaltan en azul
4. Si la calle no está en azul → **no hay cobertura**

#### Método 2: Street View Directo
1. Abre Google Street View en la URL directa
2. Verifica que las imágenes sean recientes y claras
3. Navega alrededor del punto — ¿puedes moverte libremente?

### Cobertura Buena vs Mala

```
✅ BUENA COBERTURA:
  - Calles principales con imágenes recientes
  - El jugador puede navegar en todas las direcciones
  - Los edificios y señales son legibles
  - No hay obstrucciones (vehículos, andamios)

❌ MALA COBERTURA:
  - Solo una imagen fija sin posibilidad de navegar
  - Imágenes borrosas o muy antiguas
  - Callejones sin salida donde el jugador se atasca
  - Zonas privadas o restringidas
```

### Parámetros de Búsqueda de UBEX

```typescript
// src/components/maps/StreetViewExplorer.tsx
const response = await service.getPanorama({
  location: { lat, lng },
  radius: 200,                                    // ← 200 metros
  preference: google.maps.StreetViewPreference.NEAREST,
  source: google.maps.StreetViewSource.OUTDOOR,    // ← Solo exteriores
});
```

**Importante**: UBEX usa `source: OUTDOOR`, lo que excluye panoramas interiores (museos, centros comerciales). Verifica que tu punto de interés sea visible desde **el exterior**.

---

## Estructura de un Nivel Completo

Cada nivel que diseñes debe tener todos estos campos:

```json
{
  "number": 1,
  "title": "El Descubridor",
  "clue": {
    "text": "En la plaza principal de la Zona Colonial, un hombre de bronce señala hacia el horizonte con determinación. Este navegante genovés cambió el curso de la historia. ¿Quién es este explorador inmortalizado en piedra?",
    "hint": "Busca la estatua más prominente de la plaza. Su nombre está asociado con el descubrimiento de América.",
    "difficulty": "easy"
  },
  "spawnLat": 18.4736,
  "spawnLng": -69.8827,
  "spawnHeading": 200,
  "spawnPitch": 5,
  "targetLat": 18.4738,
  "targetLng": -69.8830,
  "correctAnswers": [
    "cristobal colon",
    "cristóbal colón",
    "colon",
    "colón",
    "christopher columbus",
    "columbus"
  ],
  "explanation": "La estatua de Cristóbal Colón fue erigida en 1887 en el Parque Colón. El navegante genovés llegó a La Española en su primer viaje en 1492."
}
```

### Desglose Campo por Campo

| Campo | Tipo | Guía |
|-------|------|------|
| `number` | 1–12 | Orden secuencial del nivel |
| `title` | texto corto | Nombre poético/temático del nivel (máx 30 caracteres) |
| `clue.text` | texto largo | El acertijo principal — debe ser narrativo y guiar la exploración |
| `clue.hint` | texto medio | Pista adicional — reduce ambigüedad sin dar la respuesta directa |
| `clue.difficulty` | enum | `easy`, `medium`, `hard`, `extreme` |
| `spawnLat/Lng` | coordenadas | Donde aparece el jugador — debe tener buena vista |
| `spawnHeading` | 0–360 | Dirección de cámara al aparecer |
| `spawnPitch` | -90 a 90 | Inclinación de cámara (0 = horizontal, positivo = arriba) |
| `targetLat/Lng` | coordenadas | Donde está la respuesta — usado para cálculo de proximidad |
| `correctAnswers` | array | **Mínimo 3 variantes**: con/sin acentos, idiomas, abreviaciones |
| `explanation` | texto largo | Contexto educativo — dato interesante que recompensa la curiosidad |

---

## Mejores Prácticas para Niveles Engaging

### 1. El Acertijo como Narrador

No escribas preguntas de trivia. Escribe **historias cortas** que inviten a explorar.

```
❌ Malo:  "¿Cómo se llama la calle más antigua?"
✅ Bueno: "Las primeras damas del Nuevo Mundo caminaban por estas piedras
           al atardecer, sus vestidos rozando los adoquines centenarios.
           ¿Cómo se llama esta calle histórica?"
```

### 2. Múltiples Respuestas Correctas

Siempre incluye variantes. Los jugadores escriben de formas diferentes:

```json
"correctAnswers": [
  "calle las damas",       // nombre completo
  "las damas",             // nombre corto
  "calle de las damas",    // variante con "de"
  "street of the ladies"   // traducción inglés
]
```

**Regla**: incluye al menos variantes con y sin acentos, nombre completo y abreviado.

### 3. Spawn con Intención

El punto de spawn debe:
- Dar una buena primera impresión (vista panorámica interesante)
- Estar orientado hacia algo relevante (no un muro)
- Permitir navegación en al menos 2 direcciones
- En niveles fáciles: cerca del objetivo
- En niveles difíciles: lejos del objetivo, requiriendo exploración

### 4. Explicaciones que Educan

La explicación post-respuesta es tu oportunidad de enseñar:

```
❌ Malo:  "Correcto, la respuesta es Calle Las Damas."
✅ Bueno: "La Calle Las Damas es la primera calle trazada por los europeos
           en el Nuevo Mundo, construida en 1502. Recibe su nombre porque
           las esposas de los colonizadores españoles solían pasear por ella
           al atardecer. Hoy alberga algunos de los edificios coloniales
           mejor preservados del continente."
```

### 5. Progresión de Distancia Spawn-Target

| Dificultad | Distancia Spawn → Target | Razón |
|-----------|--------------------------|-------|
| `easy` | 10–50 metros | El jugador casi puede ver la respuesta desde el spawn |
| `medium` | 50–200 metros | Requiere caminar un poco y explorar |
| `hard` | 200–500 metros | Varias cuadras de navegación |
| `extreme` | 500+ metros | Exploración significativa del área |

### 6. Evitar Trampas Comunes

| Trampa | Por qué es problema | Solución |
|--------|---------------------|----------|
| Respuesta ambigua | Múltiples respuestas válidas no incluidas | Agregar más aliases |
| Street View desactualizado | El edificio fue renovado/demolido | Verificar imágenes recientes |
| Spawn sin salida | El jugador no puede navegar | Elegir una intersección |
| Acertijo googleable | No requiere explorar | Pedir algo observable in-situ |
| Demasiado críptico | Frustración sin dirección | Agregar pista clara en el hint |

---

## Ejemplos: Buenos vs Malos Acertijos

### Ejemplo 1: Nivel Fácil

```
❌ MALO:
   Acertijo: "¿Quién descubrió América?"
   Respuesta: "Colón"
   Por qué falla: Se puede responder sin explorar Street View

✅ BUENO:
   Acertijo: "En la plaza principal de la Zona Colonial,
              un hombre de bronce señala hacia el horizonte
              con determinación. Este navegante genovés cambió
              el curso de la historia. ¿Quién es este explorador
              inmortalizado en piedra?"
   Respuesta: ["cristóbal colón", "colon", "columbus"]
   Por qué funciona: El jugador debe encontrar la estatua en Street View
```

### Ejemplo 2: Nivel Medio

```
❌ MALO:
   Acertijo: "¿Qué estilo tiene la catedral?"
   Respuesta: "plateresco"
   Por qué falla: No da contexto ni invita a explorar

✅ BUENO:
   Acertijo: "La primera catedral del Nuevo Mundo fue construida
              con un estilo que mezcla el gótico tardío con algo
              más ornamental, como si un platero hubiera decorado
              cada detalle de su fachada. ¿Qué estilo arquitectónico
              renacentista define su rostro?"
   Respuesta: ["plateresco", "plateresque", "estilo plateresco"]
   Por qué funciona: La pista sobre "platero" guía al jugador
                      sin dar la respuesta directa
```

### Ejemplo 3: Nivel Difícil

```
❌ MALO:
   Acertijo: "Ve a la calle peatonal y dime su nombre"
   Respuesta: "El Conde"
   Por qué falla: Instrucciones vagas, sin narrativa

✅ BUENO:
   Acertijo: "Camina por la calle peatonal más famosa de la Zona
              Colonial, donde los artistas y vendedores crean un
              mosaico de color bajo el sol caribeño. En sus adoquines
              resuenan siglos de comercio y cultura. ¿Cómo se llama
              esta arteria peatonal?"
   Respuesta: ["el conde", "calle el conde", "conde"]
   Hint: "Es la única calle completamente peatonal de la zona,
          y conecta el Parque Colón con el Parque Independencia."
   Por qué funciona: Narrativa inmersiva, requiere navegación,
                      hint reduce ambigüedad sin dar la respuesta
```

### Ejemplo 4: Nivel Extremo

```
❌ MALO:
   Acertijo: "¿En qué año se fundó Santo Domingo?"
   Respuesta: "1498"
   Por qué falla: Pregunta de trivia pura, no necesita Street View

✅ BUENO:
   Acertijo: "Dicen que todo tesoro tiene un origen. La ciudad
              que ahora recorres fue fundada por el hermano del
              descubridor, en un año que pocos recuerdan pero que
              marcó el nacimiento de todo un continente urbano.
              Busca en los muros de esta ciudad su fecha de nacimiento."
   Respuesta: ["1498", "1496"]
   Hint: "Bartolomé Colón fundó esta ciudad. Busca placas
          conmemorativas cerca de la zona más antigua."
   Por qué funciona: Narrativa envolvente, requiere buscar una placa
                      o inscripción real en Street View,
                      acepta ambas fechas históricas debatidas
```

---

## Progresión de Dificultad

### Curva Recomendada para 12 Niveles

```
Nivel:   1    2    3    4    5    6    7    8    9   10   11   12
         │    │    │    │    │    │    │    │    │    │    │    │
easy     ████ ████ ████ │    │    │    │    │    │    │    │    │
medium   │    │    │    ████ ████ ████ │    │    │    │    │    │
hard     │    │    │    │    │    │    ████ ████ ████ │    │    │
extreme  │    │    │    │    │    │    │    │    │    ████ ████ ████
```

### Guía por Bloque

| Bloque | Niveles | Objetivo | Spawn → Target | Tipo de acertijo |
|--------|---------|----------|----------------|------------------|
| **Inicio** | 1–3 | Enganchar al jugador | Cerca (10–50m) | Observación directa |
| **Desarrollo** | 4–6 | Subir el desafío | Medio (50–200m) | Navegación + historia |
| **Clímax** | 7–9 | Poner a prueba | Lejos (200–500m) | Deducción + exploración |
| **Final** | 10–12 | Desafío máximo | Muy lejos (500m+) | Todo combinado |

---

## Programa VIP para Creadores

### Niveles de Creador

| Nivel | Requisito | Beneficios |
|-------|-----------|------------|
| **Creador** | Primera saga aceptada | Badge en perfil, crédito en la saga |
| **Creador Destacado** | 3+ sagas con rating ≥ 4.0 | Acceso anticipado a nuevas herramientas |
| **Creador Élite** | 10+ sagas, invitado al programa | Revenue share del 10% en sagas premium |
| **Embajador** | Top 10 creadores globales | Revenue share del 20%, voz en roadmap |

### Beneficios del Programa

- **Crédito público**: Tu nombre aparece como creador de la saga
- **Estadísticas**: Acceso a datos de cuántos jugadores juegan tus sagas
- **Comunidad**: Acceso a canal exclusivo de creadores
- **Revenue share**: Los creadores élite reciben un porcentaje de las sagas premium
- **Herramientas**: Acceso anticipado al generador de sagas con IA (Gemini)

### Cómo Unirse

1. Crea tu primera saga siguiendo esta guía
2. Envíala para revisión
3. Una vez aceptada, recibirás tu badge de Creador
4. Sigue creando para subir de nivel

---

## Checklist Final

Antes de enviar tu saga, verifica cada punto:

### Saga General
- [ ] Tiene un título atractivo y un subtítulo con la ciudad
- [ ] La descripción explica el tema y motiva a explorar
- [ ] Contiene exactamente 12 niveles
- [ ] Los niveles siguen una progresión de dificultad (easy → extreme)

### Por Cada Nivel
- [ ] El título es evocador y corto (máx 30 caracteres)
- [ ] El acertijo requiere exploración en Street View (no es googleable)
- [ ] El acertijo tiene contexto narrativo, elemento observable, y pregunta clara
- [ ] La pista (hint) ayuda sin dar la respuesta directa
- [ ] La dificultad está correctamente asignada
- [ ] Las coordenadas de spawn tienen cobertura de Street View
- [ ] El heading y pitch del spawn apuntan a algo interesante
- [ ] Las coordenadas del target son accesibles desde el spawn
- [ ] Hay al menos 3 variantes en `correctAnswers` (con/sin acentos, sinónimos)
- [ ] La explicación es educativa e interesante
- [ ] La distancia spawn-target es apropiada para la dificultad

### Street View
- [ ] Cobertura verificada en las 12 ubicaciones de spawn
- [ ] Cobertura verificada en las 12 ubicaciones de target
- [ ] Imágenes recientes y claras (no borrosas ni antiguas)
- [ ] El jugador puede navegar libremente desde el spawn
- [ ] No hay panoramas interiores (UBEX usa `source: OUTDOOR`)

### Prueba
- [ ] Jugué los 12 niveles completos como si fuera un jugador nuevo
- [ ] Cada acertijo es resoluble solo con exploración
- [ ] Los tiempos de resolución son razonables para la dificultad
- [ ] No hay niveles frustrantemente difíciles sin pista adecuada
