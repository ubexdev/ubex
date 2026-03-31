# Análisis UX y Journey del Jugador — UBEX

> **Fecha**: Julio 2025
> **Producto**: UBEX — Juego de geoexploración y búsqueda del tesoro
> **Versión analizada**: Demo web (Saga de Colón, Santo Domingo)
> **Metodología**: Análisis heurístico + revisión de código + proto-personas + mapeo de journey

---

## Tabla de Contenidos

1. [Mapa de Viaje del Jugador](#1-mapa-de-viaje-del-jugador)
2. [Proto-Personas](#2-proto-personas)
3. [Problemas de UX Identificados](#3-problemas-de-ux-identificados)
4. [Recomendaciones de UX Prioritizadas](#4-recomendaciones-de-ux-prioritizadas)
5. [Flujo de Onboarding Propuesto](#5-flujo-de-onboarding-propuesto)

---

## 1. Mapa de Viaje del Jugador

### Visión general del journey

```
┌─────────────┐   ┌──────────┐   ┌───────────────┐   ┌──────────────┐
│ DESCUBRIR   │──▸│ REGISTRO │──▸│ PRIMERA       │──▸│ EXPLORACIÓN  │
│ (Awareness) │   │ (Signup) │   │ PARTIDA       │   │ (Core Loop)  │
└─────────────┘   └──────────┘   │ (Onboarding)  │   └──────┬───────┘
                                 └───────────────┘          │
┌─────────────┐   ┌──────────┐   ┌───────────────┐         │
│ CREACIÓN    │◂──│ RETORNO  │◂──│ COMPARTIR     │◂──┌─────┴────────┐
│ (Creator)   │   │ (Return) │   │ (Viral Loop)  │   │ LOGRO        │
└─────────────┘   └──────────┘   └───────────────┘   │ (Achievement)│
                                                      └──────────────┘
```

---

### Etapa 1: Descubrimiento

> _"¿Qué es esto? Parece GeoGuessr pero con tesoros reales"_

| Dimensión | Detalle |
|-----------|---------|
| **Acciones** | Ve un anuncio en redes sociales → Hace clic → Llega a la landing page → Lee "Explora calles reales, resuelve acertijos, gana $1,000 USD" → Ve el countdown → Hace scroll hasta "Cómo funciona" |
| **Puntos de contacto** | Instagram/TikTok ad, link compartido por amigo, landing page (`/`), boca a boca |
| **Emociones** | 😮 Curiosidad ("¿premios reales?") → 🤔 Escepticismo ("¿será legítimo?") → 😊 Interés ("quiero probar") |
| **Dolor** | No hay testimonios ni prueba social en la landing actual. El countdown crea urgencia pero no explica qué pasa cuando llega a cero. No hay sección de FAQ. El modelo de suscripción ($4.99/mes) se menciona vagamente sin detallar qué incluye |
| **Oportunidades** | Agregar video corto de gameplay real (15s). Incluir testimonios de beta testers. Explicar el flujo de premios y pago con PayPal de forma transparente. Mostrar un mini-clip del juego en acción antes del CTA |

**Estado emocional**: ⬆️ Curiosidad alta / Confianza baja

---

### Etapa 2: Registro

> _"Quiero jugar pero no quiero perder tiempo registrándome"_

| Dimensión | Detalle |
|-----------|---------|
| **Acciones** | Hace clic en "Jugar demo" → Accede directamente al juego sin registro → (Flujo futuro: email + contraseña, o Google/Apple login, o guest play) |
| **Puntos de contacto** | Botón CTA en landing, pantalla de intro del juego (`/play`) |
| **Emociones** | 😌 Alivio ("puedo probar sin registrarme") → 🎯 Motivación ("vamos a ver de qué se trata") |
| **Dolor** | Actualmente **no hay registro implementado**. Esto significa: no hay persistencia de progreso, no hay identidad de jugador, no hay leaderboard real. Cuando se implemente, el riesgo es crear fricción excesiva antes de demostrar valor |
| **Oportunidades** | Implementar "jugar como invitado" → solicitar registro solo después de completar el primer nivel (delayed registration). Ofrecer login con Google/Apple (un toque). Guardar progreso del invitado en localStorage y migrar al crear cuenta |

**Estado emocional**: ⬆️ Motivación creciente / Paciencia baja

---

### Etapa 3: Primera Partida (Onboarding)

> _"¿Cómo funciona esto? ¿Qué tengo que hacer?"_

| Dimensión | Detalle |
|-----------|---------|
| **Acciones** | Ve pantalla de intro con descripción de la saga → Lee estadísticas (12 niveles, $1000, 5000 exploradores) → Lee reglas de "Cómo jugar" → Selecciona dificultad (Libre/Explorador) → Presiona "Comenzar Saga" → Se carga Street View → Lee la primera pista |
| **Puntos de contacto** | Pantalla intro saga, selector de dificultad, carga de Street View, sidebar con pista |
| **Emociones** | 🧐 Confusión ("¿qué es modo Libre vs Explorador?") → 😰 Ansiedad ("¿y si no sé usar Street View?") → 😲 Asombro ("¡estoy en las calles de Santo Domingo!") → 🤓 Concentración ("a ver, ¿qué dice la pista?") |
| **Dolor** | **No hay tutorial interactivo**. La explicación de reglas es un bloque de texto estático. La diferencia entre Libre y Explorador no queda clara sin probarla. El primer nivel arranca sin guía de controles de Street View. En móvil, el sidebar aparece encima de Street View y confunde. No hay indicación visual de "hacia dónde ir" en los primeros segundos |
| **Oportunidades** | Tutorial guiado de 3 pasos máximo (ver sección 5). Coach marks sobre los controles de Street View. Primer nivel diseñado como tutorial (respuesta obvia, target visible). Tooltip animado señalando la pista en el sidebar |

**Estado emocional**: ⬇️ Bajón de confianza / ⬆️ Potencial de asombro si se maneja bien

---

### Etapa 4: Exploración (Core Loop)

> _"Estoy en las calles, buscando pistas, y esto es adictivo"_

| Dimensión | Detalle |
|-----------|---------|
| **Acciones** | Navega por Street View → Lee pista del nivel → Explora calles buscando el lugar → (Explorador) se acerca al target → Opcionalmente revela hint → Escribe respuesta → Recibe feedback → Avanza o reintenta |
| **Puntos de contacto** | Street View, ClueCard (pista + hint), formulario de respuesta, indicador de proximidad, feedback de respuesta |
| **Emociones** | 🗺️ Inmersión ("esto es como estar ahí") → 😫 Frustración ("no encuentro el lugar") → 💡 Eureka ("¡eso es!") → 😤 Enojo ("me dijo incorrecto pero estoy seguro de que era eso") → 🎉 Celebración ("¡correcto!") |
| **Dolor** | **Navegación en móvil**: los controles táctiles de Street View son difíciles; sidebar de 380px fijo roba espacio. **Sin indicador visual de proximidad gradual**: solo verde/rojo, no hay "caliente/frío". **Respuestas**: la validación fuzzy a veces rechaza respuestas correctas con variantes no contempladas. **Carga**: cuando Street View no encuentra panorama, el overlay de "sin cobertura" no ofrece retry. **Progreso**: si cierras el navegador, pierdes todo. **Sin timer visible** durante el juego pese a que el tiempo total se muestra al final |
| **Oportunidades** | Indicador gradual de proximidad (gradiente de color o barra de distancia). Bottom sheet en móvil en lugar de sidebar. Validación de respuestas con IA (Gemini ya está scaffoldeado en `src/lib/gemini/client.ts`). Auto-save en localStorage nivel por nivel. Mini-mapa mostrando área explorada. Feedback háptico al acercarse al target |

**Estado emocional**: 🎢 Montaña rusa — frustración y euforia alternando (esto es bueno si está bien equilibrado)

---

### Etapa 5: Logro

> _"¡Lo logré! ¿Cómo me fue comparado con otros?"_

| Dimensión | Detalle |
|-----------|---------|
| **Acciones** | Completa el nivel 12 → Ve pantalla de victoria con trofeo → Ve tiempo total → Ve monto del premio → Decide "Volver al inicio" o "Jugar otra vez" |
| **Puntos de contacto** | Pantalla de victoria (`ResultOverlay`), estadísticas finales, botones de acción |
| **Emociones** | 🏆 Orgullo ("¡terminé los 12 niveles!") → 🤷 Vacío ("¿y ahora qué?") → 😕 Decepción ("¿no hay ranking? ¿cómo sé si fui rápido?") |
| **Dolor** | **No hay leaderboard** implementado. No hay comparación con otros jugadores. No hay desglose por nivel (¿cuál me costó más?). No hay badges o logros desbloqueados. La pantalla de victoria es estática — no hay animación de celebración elaborada. No queda claro cómo se cobra el premio |
| **Oportunidades** | Leaderboard en tiempo real con ranking por tiempo. Desglose nivel por nivel (tiempo, intentos, hints usados). Sistema de badges: "Primer intento perfecto", "Explorador veloz", "Sin pistas". Animación de confetti/celebración. Explicación clara del proceso de premio. Comparación social ("Fuiste más rápido que el 73% de jugadores") |

**Estado emocional**: ⬆️ Pico de satisfacción → ⬇️ Caída rápida si no hay siguiente paso claro

---

### Etapa 6: Compartir

> _"Tengo que contarle a mis amigos sobre esto"_

| Dimensión | Detalle |
|-----------|---------|
| **Acciones** | (Ideal) Hace clic en "Compartir resultado" → Se genera imagen/card con su score → Comparte en WhatsApp/Instagram/Twitter → Amigos hacen clic y llegan a la landing |
| **Puntos de contacto** | Botón de compartir (NO existe actualmente), tarjeta visual generada, redes sociales, link de referido |
| **Emociones** | 😎 Presumir ("miren lo que hice") → 🤝 Conexión ("juguemos juntos") → 📱 Impaciencia ("debería ser un clic") |
| **Dolor** | **No existe funcionalidad de compartir**. No hay generación de tarjeta visual con resultado. No hay sistema de referidos. No hay integración con redes sociales. La URL `/play` no tiene metadata para preview (Open Graph) |
| **Oportunidades** | Generar imagen OG dinámica con score + tiempo + saga. Botón de compartir nativo (`navigator.share` API). Sistema de referidos: "Invita a un amigo, ambos reciben beneficio". Deep links que lleven directamente a una saga específica. Integración con stories de Instagram/WhatsApp |

**Estado emocional**: ⬆️ Entusiasmo social → ⬇️ Frustración si compartir es difícil

---

### Etapa 7: Retorno

> _"¿Hay nuevas sagas? Quiero seguir jugando"_

| Dimensión | Detalle |
|-----------|---------|
| **Acciones** | Recibe notificación de nueva saga → Abre UBEX → Ve countdown activo → Se suscribe ($4.99/mes) → Espera la señal → Juega la nueva saga → Compite por el premio |
| **Puntos de contacto** | Email/push notification, countdown en landing, paywall de suscripción, nueva saga |
| **Emociones** | 🔔 Anticipación ("nueva saga, nueva ciudad") → 💰 Duda ("¿vale $4.99/mes?") → ⏰ Urgencia ("el countdown ya empezó") → 🏃 Emoción ("vamos") |
| **Dolor** | Actualmente **solo existe una saga** (Saga de Colón). No hay sistema de notificaciones. No hay sistema de suscripción implementado. No hay catálogo de sagas pasadas o futuras. El jugador no tiene razón para volver después de completar el demo |
| **Oportunidades** | Calendario de sagas con ciudades rotativas. Notificaciones push (PWA). Sagas gratuitas mensuales + premium. Sagas temáticas (historia, gastronomía, arte). Replays con nuevo desafío (speedrun, sin hints) |

**Estado emocional**: ⬆️ Alta si hay contenido nuevo / ⬇️ Abandono si no hay novedad

---

### Etapa 8: Creación

> _"Yo conozco mi ciudad mejor que nadie. Quiero crear una saga"_

| Dimensión | Detalle |
|-----------|---------|
| **Acciones** | Descubre la opción de "Crear saga" → Accede al editor → Selecciona ciudad → Marca puntos en el mapa → Escribe acertijos → Configura dificultad → Publica → Otros juegan su saga → Recibe feedback |
| **Puntos de contacto** | Editor de sagas (NO existe), panel de creador, analytics de su saga, feedback de jugadores |
| **Emociones** | 🎨 Creatividad ("voy a hacer la mejor saga de mi ciudad") → 😩 Complejidad ("esto es más difícil de lo que pensé") → 🥳 Orgullo ("¡gente está jugando mi saga!") |
| **Dolor** | **No existe herramienta de creación**. El README menciona una "Guía para Creadores" en docs pero no está escrita. Los niveles actuales están hardcodeados en `src/data/demo-saga.ts`. No hay forma para la comunidad de contribuir contenido |
| **Oportunidades** | Editor visual de sagas con mapa interactivo. Templates de acertijos por categoría. Revenue share con creadores. Comunidad de creadores con ranking. IA asistente para generar pistas (Gemini ya integrado). Validación automática de que los puntos tengan cobertura Street View |

**Estado emocional**: ⬆️ Empoderamiento máximo → Loop de retención a largo plazo

---

### Resumen emocional del journey completo

```
Emoción
  ▲
5 │            ●                    ●LOGRO          ●CREAR
  │           ╱ ╲                  ╱ ╲              ╱
4 │     ●    ╱   ╲          ●    ╱   ╲     ●      ╱
  │    ╱ ╲  ╱     ╲        ╱ ╲  ╱     ╲   ╱ ╲    ╱
3 │   ╱   ╲╱       ╲      ╱   ╲╱       ╲ ╱   ╲  ╱
  │  ╱     ●        ╲    ╱    ●         ╲╱     ╲╱
2 │ ╱  1ra pista     ╲  ╱  frustración         ●sin contenido
  │╱                   ╲╱
1 │                    ●confusión
  │                   onboarding
  └──────────────────────────────────────────────────▸ Tiempo
   DESCUBRIR REGISTRO  1ra PARTIDA  EXPLORAR  LOGRO  COMPARTIR  RETORNO  CREAR
```

**Momentos críticos de riesgo de abandono**:
1. 🔴 **Onboarding confuso** — si no entiende qué hacer en los primeros 30 segundos
2. 🔴 **Street View roto** — si no carga o no hay cobertura
3. 🔴 **Respuesta rechazada injustamente** — si escribe algo correcto y el sistema dice "incorrecto"
4. 🔴 **Sin razón para volver** — después de completar la única saga disponible

---

## 2. Proto-Personas

### Persona 1: "Sofía" — La Jugadora Casual

```
┌──────────────────────────────────────────────────────┐
│  👤 SOFÍA MÉNDEZ                                     │
│  📍 Ciudad de México, México                         │
│  🎂 26 años                                          │
│  💼 Diseñadora gráfica freelance                     │
│  📱 iPhone 14, siempre en el celular                 │
│  🌐 Instagram, TikTok, WhatsApp                     │
└──────────────────────────────────────────────────────┘
```

| Dimensión | Detalle |
|-----------|---------|
| **Bio** | Sofía trabaja desde casa y en cafés. Busca micro-entretenimiento durante pausas de trabajo y en el transporte público. Le gustan los juegos casuales que puede jugar en sesiones de 5-15 minutos. Descubrió GeoGuessr en TikTok pero lo dejó porque se volvió repetitivo. |
| **Comportamiento digital** | Revisa el celular 80+ veces al día. Juega en el metro (20 min) y antes de dormir (15 min). Descarga apps por recomendación de amigos o TikTok. Abandona si algo tarda más de 5 segundos en cargar. Nunca lee instrucciones — prefiere aprender haciendo. |
| **Metas con UBEX** | Entretenerse en tiempos muertos. Sentir que "descubre" algo nuevo (no solo mata tiempo). Compartir resultados divertidos en stories. Jugar algo que no requiera compromiso de largo plazo. |
| **Frustraciones** | "Si tengo que registrarme antes de probar, me voy." "En el celular todo es chiquito y no puedo hacer zoom bien." "No entiendo la diferencia entre Libre y Explorador, ¿cuál elijo?" "Se me cerró la app y perdí todo mi progreso." |
| **Caso de uso UBEX** | Juega en el metro camino al trabajo. Abre la app, retoma donde dejó, resuelve 2-3 niveles. Comparte en Instagram stories: "Acabo de explorar Santo Domingo desde el metro 🗺️". |
| **Dispositivo principal** | Celular (95% del tiempo). Pantalla de 6.1". Datos móviles (a veces conexión lenta). |
| **Disposición a pagar** | Probaría gratis, pagaría $4.99/mes solo si hay contenido nuevo frecuente y sus amigas también juegan. |

**Cita representativa**:
> _"Si en 10 segundos no entiendo qué hacer, cierro la app. Pero si me engancha, no la suelto."_

**Métricas clave para Sofía**:
- Tiempo hasta primera interacción significativa: < 15 segundos
- Duración de sesión esperada: 5-15 minutos
- Tasa de retorno semanal esperada: 3-4 veces si hay contenido

---

### Persona 2: "Roberto" — El Explorador Cultural

```
┌──────────────────────────────────────────────────────┐
│  👤 ROBERTO CASTILLO                                 │
│  📍 Buenos Aires, Argentina                          │
│  🎂 42 años                                          │
│  💼 Profesor de historia en secundaria               │
│  💻 MacBook Air + Samsung Galaxy S23                 │
│  🌐 YouTube, Wikipedia, Google Maps                  │
└──────────────────────────────────────────────────────┘
```

| Dimensión | Detalle |
|-----------|---------|
| **Bio** | Roberto es apasionado por la historia y la geografía. Usa Google Maps Street View recreativamente para "visitar" ciudades que no puede costear. Ha jugado GeoGuessr, Seterra y quiz de geografía. Le encanta que sus alumnos se interesen en historia y busca herramientas educativas atractivas. |
| **Comportamiento digital** | Sesiones largas y deliberadas (30-60 min). Investiga antes de actuar. Lee todas las instrucciones. Prefiere pantalla grande (laptop) pero usa el celular para cosas rápidas. Valora la precisión y la calidad del contenido. |
| **Metas con UBEX** | Aprender sobre lugares históricos de forma inmersiva. Explorar ciudades que no puede visitar físicamente. Potencialmente usar UBEX como herramienta educativa con sus alumnos. Crear sagas de Buenos Aires con contenido histórico preciso. |
| **Frustraciones** | "Los acertijos deberían tener más profundidad histórica." "Quiero saber más sobre cada lugar después de resolver la pista." "¿Por qué no hay un modo sin presión de tiempo?" "Me gustaría poder crear mis propias sagas para mis estudiantes." |
| **Caso de uso UBEX** | Juega los sábados por la tarde desde su laptop con un café. Se toma su tiempo explorando cada calle. Lee las explicaciones después de cada nivel. Sueña con crear una saga educativa del Buenos Aires colonial para usar en clase. |
| **Dispositivo principal** | Laptop (70%), celular (30%). Conexión WiFi estable. Pantalla de 13". |
| **Disposición a pagar** | Pagaría $4.99/mes sin dudarlo si el contenido es históricamente preciso y hay nuevas sagas mensuales. Pagaría más por herramientas de creación de sagas. |

**Cita representativa**:
> _"No me importa el premio. Me importa que cada pista me enseñe algo que no sabía sobre un lugar real."_

**Métricas clave para Roberto**:
- Profundidad de engagement por nivel: lee explicaciones, explora más allá del target
- Duración de sesión esperada: 30-60 minutos
- Interés en creación de contenido: alto
- Net Promoter Score esperado: 9-10 si el contenido es bueno

---

### Persona 3: "Diego" — El Competidor

```
┌──────────────────────────────────────────────────────┐
│  👤 DIEGO RAMÍREZ                                    │
│  📍 Bogotá, Colombia                                 │
│  🎂 19 años                                          │
│  💼 Estudiante de ingeniería + streamer casual       │
│  🖥️ PC gamer + iPhone 15 Pro                        │
│  🌐 Twitch, Discord, Twitter/X                      │
└──────────────────────────────────────────────────────┘
```

| Dimensión | Detalle |
|-----------|---------|
| **Bio** | Diego es competitivo en todo. Juega GeoGuessr ranked, tiene rating alto en chess.com, y le gustan los juegos donde puede demostrar habilidad. Streamea ocasionalmente. La posibilidad de ganar $1,000 USD reales fue lo que lo atrajo a UBEX. Quiere optimizar su velocidad y estrategia. |
| **Comportamiento digital** | Sesiones intensas y enfocadas (completar saga entera de una vez). Busca exploits y atajos. Compara su rendimiento obsesivamente. Participa en comunidades competitivas. Comparte clips de sus mejores momentos. |
| **Metas con UBEX** | Ganar el premio de $1,000 USD. Ser #1 en el leaderboard. Optimizar tiempo por nivel. Descubrir patrones en los acertijos para resolver más rápido. Streamear su gameplay y crear contenido. |
| **Frustraciones** | "¿Dónde está el leaderboard? ¿Cómo sé si voy primero?" "Necesito ver mi tiempo por nivel, no solo el total." "Si la respuesta es correcta pero me la marca mal, es inaceptable." "El modo Explorador debería tener un indicador de distancia exacto, no solo cerca/lejos." "¿Por qué no hay replay para optimizar mi ruta?" |
| **Caso de uso UBEX** | Espera que abra la saga nueva, la juega inmediatamente, compite por el primer puesto. Repite niveles para optimizar tiempo. Analiza los acertijos buscando patrones. Comparte su ranking en Discord y Twitter. |
| **Dispositivo principal** | PC con monitor grande (90% para competir). Celular solo para revisar rankings. |
| **Disposición a pagar** | $4.99/mes es trivial si hay posibilidad real de ganar $1,000. Lo ve como una inversión, no un gasto. |

**Cita representativa**:
> _"Muéstrame el leaderboard en tiempo real y dime exactamente qué tan lejos estoy del target. Necesito datos, no vibes."_

**Métricas clave para Diego**:
- Tiempo total de completion como métrica principal
- Frecuencia de revisión de leaderboard: constante
- Disposición a streamear: alta (marketing orgánico gratuito)
- Sensibilidad a bugs de validación: extrema

---

### Comparativa de personas

| Dimensión | Sofía (Casual) | Roberto (Cultural) | Diego (Competidor) |
|-----------|:---:|:---:|:---:|
| **Dispositivo** | 📱 Celular | 💻 Laptop | 🖥️ PC |
| **Sesión típica** | 5-15 min | 30-60 min | Saga completa |
| **Motivación principal** | Entretenimiento | Aprendizaje | Ganar/competir |
| **Tolerancia a fricción** | ❌ Muy baja | ✅ Alta | ⚠️ Media (si afecta score) |
| **Feature más importante** | Mobile UX + guardado | Contenido + creación | Leaderboard + precision |
| **Trigger de pago** | Amigas juegan | Contenido frecuente | Premio real |
| **Riesgo de abandono** | Onboarding confuso | Contenido repetitivo | Bugs de validación |
| **Valor para UBEX** | Volumen + viralidad | Contenido UGC | Engagement + streaming |

---

## 3. Problemas de UX Identificados (Demo Actual)

### Metodología de evaluación

Se realizó un análisis heurístico del código fuente y la experiencia actual del demo basado en:
- **Heurísticas de Nielsen** (10 principios de usabilidad)
- **Revisión de código** de componentes clave (`play/page.tsx`, `StreetViewExplorer.tsx`, `ClueCard.tsx`)
- **Simulación de flujos** en dispositivos móviles y desktop
- **Análisis de la arquitectura** de datos y estado

### Severidad

| Nivel | Significado |
|-------|-------------|
| 🔴 **Crítico** | Bloquea la experiencia o causa abandono inmediato |
| 🟠 **Alto** | Degrada significativamente la experiencia |
| 🟡 **Medio** | Causa molestia pero no bloquea |
| 🟢 **Bajo** | Oportunidad de mejora, no urgente |

---

### P1 🔴 Navegación Street View en móvil

**Heurística violada**: Compatibilidad entre el sistema y el mundo real, Flexibilidad y eficiencia

**Descripción**: El componente `StreetViewExplorer.tsx` carga Street View con controles estándar de Google Maps que no están optimizados para pantallas táctiles pequeñas. Los botones de zoom y pan son diminutos. La navegación por arrastre compite con el scroll de la página.

**Evidencia en código**:
```typescript
// StreetViewExplorer.tsx — controles sin ajuste móvil
panControl: true,
zoomControl: true,
fullscreenControl: false,
motionTracking: false,  // ← desaprovecha giroscopio en móvil
```

**Impacto**: Sofía (casual, 95% móvil) no puede navegar cómodamente. Abandono en primeros 60 segundos.

**Recomendación**: Activar `motionTracking: true` en móvil. Aumentar área de controles táctiles. Considerar gestos personalizados (doble tap para avanzar).

---

### P2 🔴 Sidebar ocupa demasiado espacio en pantallas pequeñas

**Heurística violada**: Diseño estético y minimalista, Flexibilidad

**Descripción**: El sidebar del juego tiene ancho fijo de 380px. En pantallas móviles, al abrirlo cubre casi toda la vista de Street View. El toggle existe pero la experiencia es "todo o nada" — no hay estado intermedio.

**Evidencia en código**:
```typescript
// play/page.tsx — sidebar con ancho fijo
<div className="w-[380px] bg-stone-900/95 border-l border-amber-900/30 
     flex flex-col overflow-hidden">
```

**Impacto**: En una pantalla de 390px (iPhone 14), el sidebar cubre el 97% del viewport. El jugador no puede ver Street View y la pista al mismo tiempo.

**Recomendación**: Implementar bottom sheet con tres estados: colapsado (solo pista visible), medio (pista + respuesta), expandido (todo). Ver sección 4, Recomendación R2.

---

### P3 🔴 Sin onboarding ni tutorial para primera vez

**Heurística violada**: Ayuda y documentación, Reconocimiento antes que recuerdo

**Descripción**: No existe flujo de tutorial interactivo. La pantalla de intro muestra reglas como texto estático. El jugador llega a Street View sin saber: cómo moverse, dónde está la pista, qué significa el indicador de proximidad, cómo escribir respuestas.

**Evidencia**: La sección "Cómo jugar" en la pantalla de intro lista 4 reglas en texto. No hay coach marks, tooltips animados, ni nivel tutorial.

**Impacto**: Confusión en los primeros 30 segundos. Alto riesgo de abandono para Sofía (casual) y Roberto (primera vez en este tipo de juego).

**Recomendación**: Onboarding interactivo de 3 pasos. Ver sección 5 completa.

---

### P4 🟠 Sin feedback visual de proximidad gradual en modo Explorador

**Heurística violada**: Visibilidad del estado del sistema, Retroalimentación

**Descripción**: En modo Explorador, el jugador debe estar a menos de 100m del target para poder responder. El feedback actual es binario: verde (cerca) o rojo (lejos). No hay gradiente que indique si se está acercando o alejando.

**Evidencia en código**:
```typescript
// play/page.tsx — solo dos estados
const isCloseEnough = distance !== null && distance <= 100;
// UI: solo verde o rojo, sin gradiente
```

**Impacto**: Frustración alta. El jugador no sabe si va en la dirección correcta. Es como jugar "caliente/frío" donde solo te dicen "frío" hasta que de repente estás caliente.

**Recomendación**: Implementar indicador gradual con 5 niveles (ver R3 en sección 4).

---

### P5 🟠 Estados de carga cuando Street View falla

**Heurística violada**: Prevención de errores, Ayuda al usuario a reconocer y recuperarse de errores

**Descripción**: `StreetViewExplorer.tsx` muestra overlays para tres estados de error: cargando, error de API, sin cobertura. Pero ninguno ofrece acción de recuperación. No hay botón de "reintentar" ni fallback alternativo.

**Evidencia en código**:
```typescript
// StreetViewExplorer.tsx — estados de error sin acción
if (error) return <div className="...">❌ Error al cargar...</div>;
if (noCoverage) return <div className="...">📍 Sin cobertura...</div>;
// ← ninguno tiene botón de retry o acción alternativa
```

**Impacto**: Si Street View falla (frecuente con mala conexión), el jugador queda atrapado. Debe recargar la página entera y pierde todo su progreso.

**Recomendación**: Agregar botón "Reintentar" en cada estado de error. Para "sin cobertura", ofrecer "Saltar nivel" o mostrar imagen estática del lugar.

---

### P6 🟠 No se puede guardar ni retomar el progreso

**Heurística violada**: Control y libertad del usuario, Prevención de errores

**Descripción**: Todo el estado del juego vive en React state local. Si el usuario cierra el navegador, cambia de pestaña en móvil, o la conexión falla, pierde todo su progreso.

**Evidencia en código**:
```typescript
// play/page.tsx — todo en state local, sin persistencia
const [levelIndex, setLevelIndex] = useState(0);
const [completedLevels, setCompletedLevels] = useState<Set<number>>(new Set());
// No hay localStorage, sessionStorage, ni llamada a backend
```

**Impacto**: Crítico para Sofía (sesiones cortas en transporte). Diego pierde competitivamente si su conexión falla. Roberto pierde 30 minutos de exploración.

**Recomendación**: Guardar progreso en `localStorage` inmediatamente al completar cada nivel. Mostrar pantalla de "Retomar partida" al volver. Sincronizar con backend cuando haya cuenta.

---

### P7 🟡 Validación de respuestas se siente desconectada

**Heurística violada**: Visibilidad del estado del sistema, Retroalimentación

**Descripción**: Al enviar una respuesta correcta, hay un delay simulado de red, luego el texto cambia a "¡Correcto!" con auto-avance a 2.5 segundos. No hay animación de celebración, sonido, ni transición visual satisfactoria. La respuesta incorrecta solo agita el input y muestra texto rojo.

**Evidencia en código**:
```typescript
// play/page.tsx — feedback mínimo
await new Promise(r => setTimeout(r, 800)); // simula network delay
setFeedback({ type: "success", message: "✅ ¡Correcto! ..." });
// 2.5s después: avanza al siguiente nivel
// No hay: confetti, sonido, animación, haptic feedback
```

**Impacto**: El momento de "¡Eureka!" — el pico emocional del juego — se siente plano. Es como resolver un puzzle y que alguien diga "sí" sin emoción.

**Recomendación**: Animación de celebración (confetti, pulso dorado). Sonido de éxito. Vibración háptica en móvil. Transición animada al siguiente nivel. Ver R4 en sección 4.

---

### P8 🟡 Sin timer visible durante el juego

**Heurística violada**: Visibilidad del estado del sistema

**Descripción**: El `GameHeader` muestra nivel actual, participantes activos y premio, pero no muestra el tiempo transcurrido. Sin embargo, el tiempo total aparece en la pantalla de victoria. El jugador no puede gestionar su ritmo.

**Evidencia**: `GameHeader.tsx` no incluye componente de timer. `CountdownTimer.tsx` existe pero se usa solo en la landing page para el countdown de inicio de saga, no durante el gameplay.

**Impacto**: Diego (competidor) necesita ver su tiempo para optimizar. Roberto quiere saber cuánto lleva jugando. Sofía necesita saber si le da tiempo de resolver un nivel más antes de que llegue su parada de metro.

**Recomendación**: Timer visible en el header con opción de ocultar. Timer por nivel + timer total. Toggleable para quienes prefieran jugar sin presión.

---

### P9 🟡 Conteo de participantes simulado genera desconfianza

**Heurística violada**: Consistencia y estándares, Match entre sistema y realidad

**Descripción**: El `GameHeader` muestra un contador con punto verde parpadeante: "X activos". Este número es simulado con `Math.random()` en el estado local. No hay conexión real con otros jugadores.

**Evidencia en código**:
```typescript
// play/page.tsx — participantes falsos
const [fakeParticipants] = useState(() => Math.floor(Math.random() * 50) + 15);
```

**Impacto**: Si un jugador descubre que es falso (Diego lo hará), destruye la confianza en el producto completo. "Si esto es falso, ¿el premio también?"

**Recomendación**: Eliminar el conteo simulado. Cuando haya backend real con Realtime Database (ya scaffoldeado en Firebase), mostrar número real. Mientras tanto, mostrar "Demo" o no mostrar el conteo.

---

### P10 🟡 Hint sin costo ni consecuencia

**Heurística violada**: Flexibilidad y eficiencia de uso

**Descripción**: En `ClueCard.tsx`, el jugador puede revelar una pista sin ningún costo: no resta puntos, no afecta el ranking, no hay penalización. Una vez revelada, no se puede ocultar.

**Evidencia**: `ClueCard` tiene `showHint` toggle pero no emite evento de "hint usado" ni hay sistema de scoring que lo penalice.

**Impacto**: Para Diego (competidor), las hints sin costo anulan la diferenciación de habilidad. Para el sistema de ranking, todos los jugadores parecen iguales independientemente de si usaron ayuda.

**Recomendación**: Penalización de tiempo (+30 segundos) al usar hint. Badge "Sin pistas" para quienes no las usan. Mostrar en leaderboard cuántas pistas usó cada jugador.

---

### P11 🟢 Sin consideraciones de accesibilidad

**Heurística violada**: Accesibilidad (WCAG 2.1)

**Descripción**: No hay aria-labels en botones interactivos. El contraste de color en algunos elementos (texto amber sobre fondo oscuro) puede ser insuficiente. No hay navegación por teclado del juego. No hay modo de alto contraste. Street View es inherentemente visual sin alternativa.

**Impacto**: Jugadores con baja visión, daltonismo, o que usan lectores de pantalla no pueden jugar.

**Recomendación**: Audit WCAG 2.1 AA completo. Aria-labels en todos los botones. Modo de alto contraste. Indicadores de proximidad no solo por color (agregar texto/sonido). Descripción textual alternativa de la vista.

---

### P12 🟢 Sin modo oscuro/claro

**Heurística violada**: Control y libertad del usuario, Flexibilidad

**Descripción**: El tema es fijo (oscuro). No hay toggle. En ambientes con mucha luz (Sofía en la calle), la interfaz oscura puede ser difícil de leer. En ambientes oscuros (Roberto de noche), el tema oscuro está bien pero las imágenes de Street View son claras y crean contraste.

**Recomendación**: Toggle oscuro/claro. Detección automática de preferencia del sistema (`prefers-color-scheme`). Tema claro como default en móvil.

---

### Resumen de problemas por severidad

| Severidad | ID | Problema | Persona más afectada |
|:---------:|:--:|----------|:--------------------:|
| 🔴 | P1 | Street View en móvil | Sofía |
| 🔴 | P2 | Sidebar 380px fijo | Sofía |
| 🔴 | P3 | Sin onboarding | Sofía, Roberto |
| 🟠 | P4 | Sin indicador gradual de proximidad | Diego, Roberto |
| 🟠 | P5 | Sin recovery en errores de Street View | Todos |
| 🟠 | P6 | Sin guardar progreso | Sofía, Diego |
| 🟡 | P7 | Feedback plano en respuestas | Todos |
| 🟡 | P8 | Sin timer visible | Diego, Sofía |
| 🟡 | P9 | Participantes simulados | Diego |
| 🟡 | P10 | Hints sin costo | Diego |
| 🟢 | P11 | Sin accesibilidad | Todos |
| 🟢 | P12 | Sin modo claro/oscuro | Sofía |

---

## 4. Recomendaciones de UX Prioritizadas

### Matriz de priorización

Evaluación basada en:
- **Impacto en retención**: ¿cuántos jugadores retenemos si lo hacemos?
- **Esfuerzo de implementación**: ¿cuánto tiempo/complejidad requiere?
- **Personas afectadas**: ¿a cuántas personas beneficia?

```
                         IMPACTO ALTO
                              ▲
                              │
              R1 Onboarding   │   R3 Proximidad
              R2 Bottom sheet │   R4 Celebraciones
                              │   R5 Guardar progreso
         ─────────────────────┼─────────────────────▸
          ESFUERZO BAJO       │            ESFUERZO ALTO
                              │
              R7 Haptic       │   R6 Mini-mapa
              R10 Dark mode   │   R9 Accesibilidad
              R8 Sonido       │
                              │
                         IMPACTO BAJO
```

---

### R1 🥇 Onboarding tutorial interactivo (3 pasos máximo)

| Aspecto | Detalle |
|---------|---------|
| **Prioridad** | #1 — Crítica |
| **Problema que resuelve** | P3: jugadores abandonan por no entender qué hacer |
| **Impacto esperado** | +40% retención de primera sesión |
| **Esfuerzo** | Medio (2-3 días de desarrollo) |
| **Personas beneficiadas** | Sofía ★★★, Roberto ★★★, Diego ★☆☆ |

**Implementación propuesta**:
1. Primer nivel como tutorial con respuesta obvia y target visible desde el spawn
2. 3 coach marks en secuencia: "Aquí está tu pista" → "Explora la calle arrastrando" → "Escribe tu respuesta aquí"
3. Almacenar `onboarding_complete` en localStorage
4. No repetir en siguientes sesiones

**Flujo completo**: ver sección 5.

---

### R2 🥈 Bottom sheet en móvil (reemplazar sidebar)

| Aspecto | Detalle |
|---------|---------|
| **Prioridad** | #2 — Crítica |
| **Problema que resuelve** | P1 + P2: sidebar inutilizable en móvil |
| **Impacto esperado** | +60% usabilidad móvil, desbloquea a Sofía como usuario viable |
| **Esfuerzo** | Medio-alto (3-4 días) |
| **Personas beneficiadas** | Sofía ★★★, Roberto ★★☆, Diego ★☆☆ |

**Implementación propuesta**:
```
┌─────────────────────────┐     ┌─────────────────────────┐     ┌─────────────────────────┐
│                         │     │                         │     │   HEADER + TIMER        │
│                         │     │                         │     ├─────────────────────────┤
│      STREET VIEW        │     │      STREET VIEW        │     │   PISTA COMPLETA        │
│      (100% viewport)    │     │      (75% viewport)     │     │   + HINT                │
│                         │     │                         │     │   + INPUT RESPUESTA     │
│                         │     ├───────────▲─────────────┤     │   + PROGRESO NIVELES    │
├───────────▲─────────────┤     │   ═══════ ● ═══════     │     │   + TIPS                │
│   ═══════ ● ═══════     │     │   📍 Pista actual       │     │                         │
│   📍 "Busca la catedral │     │   ____________          │     │                         │
│       más antigua..."   │     │   [  Respuesta  ] [OK]  │     │                         │
└─────────────────────────┘     └─────────────────────────┘     └─────────────────────────┘
     COLAPSADO (peek)              MEDIO (pista + input)              EXPANDIDO (todo)
     Arrastrar ▲ arriba           Arrastrar ▲ arriba/abajo           Arrastrar ▼ abajo
```

**Tres estados**:
- **Colapsado**: Solo muestra una línea con la pista resumida. Street View ocupa ~90%.
- **Medio**: Muestra pista completa + campo de respuesta. Street View ~60%.
- **Expandido**: Muestra todo (progreso, tips, hints). Street View ~15%.

**Comportamiento**: Drag handle para cambiar entre estados. Al enviar respuesta, colapsa automáticamente. Al iniciar nuevo nivel, sube a estado medio.

---

### R3 🥉 Indicador visual de proximidad "caliente/frío"

| Aspecto | Detalle |
|---------|---------|
| **Prioridad** | #3 — Alta |
| **Problema que resuelve** | P4: jugador no sabe si se acerca o aleja del target |
| **Impacto esperado** | -50% frustración en modo Explorador, +30% completions |
| **Esfuerzo** | Bajo (1 día) |
| **Personas beneficiadas** | Diego ★★★, Roberto ★★★, Sofía ★★☆ |

**Implementación propuesta**:
```
Distancia al target → Color del borde de pantalla + texto

> 500m    →  🔵 Azul hielo    "Muy lejos — sigue explorando"
200-500m  →  🟢 Verde          "Te estás acercando..."  
100-200m  →  🟡 Amarillo       "¡Cerca! Sigue así"
50-100m   →  🟠 Naranja        "¡Muy cerca! Casi llegas"
< 50m     →  🔴 Rojo pulsante  "🔥 ¡ESTÁS AHÍ! Envía tu respuesta"
```

**Implementación técnica**:
- Ya existe `haversineDistance()` en `play/page.tsx`
- Agregar barra de progreso o borde de viewport con gradiente de color
- Pulso/glow CSS cuando `distance < 50m`
- Vibración háptica al pasar de un rango a otro en móvil

---

### R4 Animaciones de celebración en respuesta correcta

| Aspecto | Detalle |
|---------|---------|
| **Prioridad** | #4 — Alta |
| **Problema que resuelve** | P7: el momento eureka se siente plano |
| **Impacto esperado** | +25% satisfacción emocional, más screenshots para compartir |
| **Esfuerzo** | Bajo (1-2 días) |
| **Personas beneficiadas** | Sofía ★★★, Roberto ★★☆, Diego ★★☆ |

**Implementación propuesta**:
1. **Respuesta correcta**: Confetti animation (canvas-confetti, ~3KB). Flash dorado en el borde. Texto "¡CORRECTO!" con scale-up animation. Dato histórico del lugar aparece con fade-in.
2. **Respuesta incorrecta**: Shake más pronunciado. Pulso rojo sutil en el borde. Mensaje de ánimo variado: "Casi...", "Sigue intentando", "Explora un poco más".
3. **Nivel completado (último)**: Animación de trofeo con partículas. Sonido de fanfarria. Estadísticas aparecen una a una con delays.

---

### R5 Guardar y retomar progreso

| Aspecto | Detalle |
|---------|---------|
| **Prioridad** | #5 — Alta |
| **Problema que resuelve** | P6: perder todo al cerrar la app |
| **Impacto esperado** | +35% completion rate de sagas |
| **Esfuerzo** | Bajo-medio (1-2 días para localStorage, más para backend) |
| **Personas beneficiadas** | Sofía ★★★, Diego ★★★, Roberto ★★☆ |

**Implementación propuesta**:
```typescript
// Estructura de save en localStorage
interface GameSave {
  sagaId: string;
  difficulty: "libre" | "explorador";
  levelIndex: number;
  completedLevels: number[];
  hintsUsed: number[];
  timeElapsed: number;  // segundos
  savedAt: string;      // ISO timestamp
}

// Guardar automáticamente al completar cada nivel
localStorage.setItem(`ubex_save_${sagaId}`, JSON.stringify(save));

// Al abrir /play, verificar si hay save:
// → Mostrar modal "¿Retomar partida?" con resumen
```

**Flujo de retorno**:
```
┌───────────────────────────────────────────┐
│                                           │
│  🗺️  Tienes una partida en progreso      │
│                                           │
│  Saga de Colón — Nivel 7/12              │
│  Modo: Explorador                         │
│  Tiempo: 18:32                            │
│  Guardado: hace 2 horas                   │
│                                           │
│  ┌─────────────┐  ┌───────────────────┐   │
│  │  Continuar  │  │  Nueva partida    │   │
│  └─────────────┘  └───────────────────┘   │
│                                           │
└───────────────────────────────────────────┘
```

---

### R6 Mini-mapa mostrando área explorada

| Aspecto | Detalle |
|---------|---------|
| **Prioridad** | #6 — Media |
| **Problema que resuelve** | Desorientación espacial, volver a lugares ya visitados |
| **Impacto esperado** | +20% eficiencia de exploración, menos frustración |
| **Esfuerzo** | Alto (3-5 días) |
| **Personas beneficiadas** | Diego ★★★, Roberto ★★☆, Sofía ★☆☆ |

**Implementación propuesta**:
- Mapa pequeño en esquina inferior derecha (150x150px)
- Muestra la posición actual del jugador como punto
- Traza la ruta recorrida (línea punteada)
- NO muestra el target (sería hacer trampa)
- Toggle para mostrar/ocultar
- En móvil: tap para expandir temporalmente

---

### R7 Feedback háptico en móvil

| Aspecto | Detalle |
|---------|---------|
| **Prioridad** | #7 — Media |
| **Problema que resuelve** | Feedback insuficiente en interacciones táctiles |
| **Impacto esperado** | +15% inmersión en móvil |
| **Esfuerzo** | Muy bajo (medio día) |
| **Personas beneficiadas** | Sofía ★★★, Diego ★☆☆ |

**Implementación propuesta**:
```typescript
// Utilizar Vibration API (soportada en Android, parcial en iOS)
function haptic(pattern: "light" | "success" | "error" | "proximity") {
  if (!navigator.vibrate) return;
  switch (pattern) {
    case "light":     navigator.vibrate(10); break;
    case "success":   navigator.vibrate([50, 30, 100]); break;
    case "error":     navigator.vibrate([100, 50, 100]); break;
    case "proximity": navigator.vibrate(20); break;
  }
}
```

**Cuándo vibrar**:
- Al cruzar un umbral de proximidad (cambio de zona caliente/fría)
- Al enviar respuesta correcta (patrón de éxito)
- Al enviar respuesta incorrecta (pulso de error)
- Al revelar hint (confirmación suave)

---

### R8 Diseño sonoro (ambiente + éxito/fallo)

| Aspecto | Detalle |
|---------|---------|
| **Prioridad** | #8 — Media |
| **Problema que resuelve** | Experiencia plana sin audio, pierde inmersión |
| **Impacto esperado** | +20% inmersión percibida, mayor engagement emocional |
| **Esfuerzo** | Medio (2-3 días incluyendo diseño de audio) |
| **Personas beneficiadas** | Todos |

**Paleta de sonidos propuesta**:
| Evento | Sonido | Duración |
|--------|--------|----------|
| Inicio de saga | Cuerno de aventura + mapa desplegándose | 2s |
| Nuevo nivel | Transición suave, compás de brújula | 1s |
| Proximidad (acercándose) | Latido creciente, sutil | Loop |
| Revelar hint | Campanita curiosa | 0.5s |
| Respuesta correcta | Fanfarria corta + monedas | 1.5s |
| Respuesta incorrecta | Tono grave suave (no punitivo) | 0.5s |
| Saga completada | Música épica de victoria | 4s |
| Ambiente de fondo | Loop ambiental sutil por ciudad | Loop |

**Importante**: Muted por defecto en móvil (respetar contexto del usuario). Toggle visible de audio. Precarga de audio para evitar latencia.

---

### R9 Consideraciones de accesibilidad

| Aspecto | Detalle |
|---------|---------|
| **Prioridad** | #9 — Media-baja (pero legalmente importante) |
| **Problema que resuelve** | P11: exclusión de usuarios con discapacidades |
| **Impacto esperado** | Cobertura WCAG 2.1 AA, +5-10% de mercado accesible |
| **Esfuerzo** | Alto (esfuerzo continuo) |
| **Personas beneficiadas** | Todos, especialmente usuarios con baja visión o daltonismo |

**Acciones inmediatas (bajo esfuerzo)**:
- `aria-label` en todos los botones iconográficos
- Contraste de color mínimo 4.5:1 (verificar amber sobre stone-900)
- `role="alert"` en mensajes de feedback
- `lang="es"` en el HTML root
- Focus visible en todos los elementos interactivos

**Acciones a mediano plazo**:
- Indicadores de proximidad no dependientes solo de color (agregar texto + icono)
- Navegación por teclado completa del juego
- Descripciones alternativas para Street View (text-to-speech de la ubicación)
- Reducir movimiento para usuarios con `prefers-reduced-motion`

---

### R10 Toggle de modo oscuro/claro

| Aspecto | Detalle |
|---------|---------|
| **Prioridad** | #10 — Baja |
| **Problema que resuelve** | P12: legibilidad en diferentes entornos de luz |
| **Impacto esperado** | +10% confort visual, percepción de producto pulido |
| **Esfuerzo** | Medio (2 días con CSS variables) |
| **Personas beneficiadas** | Sofía ★★☆, Roberto ★★☆ |

**Implementación propuesta**:
- CSS variables para colores del tema
- Detección automática con `prefers-color-scheme`
- Toggle manual en header o settings
- Persistir preferencia en localStorage
- Tema oscuro por defecto (actual) para gaming; claro disponible para uso diurno

---

### Resumen de priorización

| # | Recomendación | Impacto | Esfuerzo | ROI |
|:-:|---------------|:-------:|:--------:|:---:|
| R1 | Onboarding tutorial | ★★★★★ | ★★★☆☆ | 🏆 |
| R2 | Bottom sheet móvil | ★★★★★ | ★★★★☆ | 🏆 |
| R3 | Indicador caliente/frío | ★★★★☆ | ★★☆☆☆ | 🏆 |
| R4 | Animaciones de celebración | ★★★★☆ | ★★☆☆☆ | 🏆 |
| R5 | Guardar/retomar progreso | ★★★★☆ | ★★★☆☆ | ⭐ |
| R6 | Mini-mapa | ★★★☆☆ | ★★★★☆ | ⭐ |
| R7 | Feedback háptico | ★★★☆☆ | ★☆☆☆☆ | ⭐ |
| R8 | Diseño sonoro | ★★★☆☆ | ★★★☆☆ | ⭐ |
| R9 | Accesibilidad | ★★☆☆☆ | ★★★★★ | 📋 |
| R10 | Modo oscuro/claro | ★★☆☆☆ | ★★★☆☆ | 📋 |

**Leyenda**: 🏆 Quick win, implementar ya | ⭐ Siguiente sprint | 📋 Backlog priorizado

---

## 5. Flujo de Onboarding Propuesto

### Principios de diseño del onboarding

1. **Valor antes de fricción**: dejar jugar antes de pedir registro
2. **Aprender haciendo**: no bloques de texto, sino acciones guiadas
3. **3 pasos máximo**: la atención del jugador nuevo dura ~30 segundos
4. **El primer nivel ES el tutorial**: diseñado para éxito garantizado
5. **Registro diferido**: pedir cuenta solo cuando el jugador ya está enganchado

---

### Flujo completo paso a paso

```
USUARIO LLEGA A /play
         │
         ▼
┌─────────────────────────────┐
│  ¿Tiene partida guardada?   │
│  (localStorage check)       │
└──────┬──────────┬───────────┘
       │ SÍ       │ NO
       ▼          ▼
┌──────────┐  ┌──────────────────────────┐
│ Modal:   │  │ ¿Es primera vez?          │
│ Retomar  │  │ (onboarding_complete?)    │
│ partida? │  └─────┬──────────┬──────────┘
└──────────┘        │ SÍ       │ NO (veterano)
                    ▼          ▼
             ┌──────────┐  ┌──────────────┐
             │ TUTORIAL  │  │ Intro normal │
             │ (3 pasos) │  │ + selección  │
             └──────────┘  │ de dificultad│
                    │       └──────────────┘
                    ▼
             ┌──────────┐
             │ Nivel 1   │
             │ (tutorial) │
             └──────────┘
                    │
                    ▼ completa nivel 1
             ┌──────────────────┐
             │ "¡Excelente!      │
             │  ¿Listo para el   │
             │  resto?"          │
             │                   │
             │  [Seguir jugando] │
             │  [Elegir dificul.]│
             └──────────────────┘
                    │
                    ▼ completa nivel 3-4
             ┌──────────────────────────┐
             │ "¡Vas genial! Crea una   │
             │  cuenta para guardar tu  │
             │  progreso y competir"    │
             │                          │
             │  [Google] [Apple] [Email] │
             │  [Seguir como invitado]  │
             └──────────────────────────┘
```

---

### Paso 1: La bienvenida (5 segundos)

**Qué ve el jugador**:
```
┌──────────────────────────────────────────┐
│                                          │
│         🧭                               │
│                                          │
│    Bienvenido a UBEX                     │
│                                          │
│    Vas a explorar calles reales          │
│    y resolver acertijos sobre            │
│    lugares históricos.                   │
│                                          │
│    ¿Listo?                               │
│                                          │
│         [ ¡Vamos! ]                      │
│                                          │
└──────────────────────────────────────────┘
```

**Duración**: Máximo 5 segundos de lectura. Un solo botón. Sin opciones, sin decisiones.

**Regla**: NO pedir nombre, email, dificultad ni nada todavía. Solo "¡Vamos!".

---

### Paso 2: El tutorial en vivo (3 coach marks)

Al presionar "¡Vamos!", se carga Street View con el **Nivel 1 Tutorial** — un nivel diseñado para que la respuesta sea obvia visualmente desde el spawn point.

**Coach mark 1 — Street View** (aparece cuando carga el panorama):
```
┌──────────────────────────────────────────┐
│  ┌─────────────────────────────────┐     │
│  │                                 │     │
│  │      STREET VIEW               │     │
│  │      (Plaza histórica)         │     │
│  │          ↕                     │     │
│  │     ┌──────────────────┐       │     │
│  │     │ 👆 Arrastra para │       │     │
│  │     │    explorar las  │       │     │
│  │     │    calles        │       │     │
│  │     │                  │       │     │
│  │     │  Haz clic en las │       │     │
│  │     │  flechas del     │       │     │
│  │     │  suelo para      │       │     │
│  │     │  avanzar         │       │     │
│  │     └──────────────────┘       │     │
│  │         [Entendido →]          │     │
│  └─────────────────────────────────┘     │
│                                          │
│  ═══════════════════════════════════     │
│  📍 Pista: ...                           │
└──────────────────────────────────────────┘
```

**Coach mark 2 — La pista** (después de presionar "Entendido"):
```
┌──────────────────────────────────────────┐
│                                          │
│      STREET VIEW                         │
│                                          │
│                                          │
│                                          │
│  ═══════════════════════════════════     │
│  ┌──────────────────────────────┐        │
│  │  📍 Aquí aparece tu pista    │ ◀──┐   │
│  │                              │    │   │
│  │  Lee la pista y busca la     │    │   │
│  │  respuesta explorando la     │   💡   │
│  │  calle                       │    │   │
│  │                              │    │   │
│  │       [Entendido →]          │    │   │
│  └──────────────────────────────┘    │   │
│                                      │   │
│  "¿Qué nombre tiene la calle        │   │
│   que ves frente a ti?"         ◀────┘   │
│                                          │
│  _______________  [Enviar]               │
└──────────────────────────────────────────┘
```

**Coach mark 3 — La respuesta** (después de presionar "Entendido"):
```
┌──────────────────────────────────────────┐
│                                          │
│      STREET VIEW                         │
│                                          │
│                                          │
│                                          │
│  ═══════════════════════════════════     │
│  📍 "¿Qué nombre tiene la calle         │
│      que ves frente a ti?"               │
│                                          │
│  ┌──────────────────────────────────┐    │
│  │                                  │    │
│  │  ✏️ Escribe tu respuesta aquí    │    │
│  │     y presiona Enviar            │    │
│  │                                  │    │
│  │  _______________  [Enviar] ◀─────│    │
│  │                                  │    │
│  │        [¡Intentar!]              │    │
│  └──────────────────────────────────┘    │
└──────────────────────────────────────────┘
```

**Total de coach marks**: 3. Tiempo estimado: 15-20 segundos.

---

### Paso 3: El primer éxito

El Nivel 1 tutorial está diseñado para que:
- La respuesta sea **visible desde el punto de spawn** (nombre de calle, letrero, monumento obvio)
- Las respuestas aceptadas sean **muy permisivas** (variantes, con/sin artículos, abreviaciones)
- No requiera caminar (modo Libre para tutorial)
- El hint sea prácticamente la respuesta

**Cuando el jugador responde correctamente**:
```
┌──────────────────────────────────────────┐
│                                          │
│      🎉🎊✨                              │
│                                          │
│      ¡CORRECTO!                          │
│                                          │
│      🏆 Nivel 1 completado              │
│                                          │
│  ┌──────────────────────────────────┐    │
│  │  📖 ¿Sabías que...?              │    │
│  │                                  │    │
│  │  [Explicación histórica breve    │    │
│  │   sobre el lugar que acaba       │    │
│  │   de descubrir]                  │    │
│  └──────────────────────────────────┘    │
│                                          │
│  ¡Ya sabes cómo funciona! Quedan 11     │
│  niveles por descubrir.                  │
│                                          │
│  ┌───────────────────┐                   │
│  │ Siguiente nivel → │                   │
│  └───────────────────┘                   │
│                                          │
│  ¿Quieres más desafío?                  │
│  [Cambiar a modo Explorador]             │
│                                          │
└──────────────────────────────────────────┘
```

**Elementos clave del primer éxito**:
- Animación de confetti (3 segundos)
- Sonido de victoria (si audio está habilitado)
- Dato histórico = recompensa intelectual inmediata
- Opción de cambiar a Explorador = empoderar al jugador
- "¡Ya sabes cómo funciona!" = validación

---

### Paso 4: El momento del registro (diferido)

**NO pedir registro antes del nivel 1**. Esperar a que el jugador haya completado 3-4 niveles y esté enganchado.

**Trigger de registro** (después del nivel 3 o 4):
```
┌──────────────────────────────────────────┐
│                                          │
│  🗺️  ¡Vas genial, explorador!           │
│                                          │
│  Llevas 4 niveles completados            │
│  en 8:32 minutos.                        │
│                                          │
│  Crea una cuenta para:                   │
│  ✅ Guardar tu progreso                  │
│  ✅ Competir en el ranking               │
│  ✅ Ganar el premio de $1,000            │
│                                          │
│  ┌─────────────────────────────────┐     │
│  │  🔵 Continuar con Google       │     │
│  └─────────────────────────────────┘     │
│  ┌─────────────────────────────────┐     │
│  │  ⚫ Continuar con Apple        │     │
│  └─────────────────────────────────┘     │
│  ┌─────────────────────────────────┐     │
│  │  📧 Continuar con email        │     │
│  └─────────────────────────────────┘     │
│                                          │
│  [Seguir como invitado →]                │
│  (tu progreso se guardará localmente)    │
│                                          │
└──────────────────────────────────────────┘
```

**Reglas del registro diferido**:
1. **Siempre** ofrecer "Seguir como invitado"
2. **Nunca** bloquear el juego por no registrarse
3. Volver a preguntar (más sutil) al completar la saga
4. Si elige invitado: guardar progreso en localStorage, migrar a cuenta cuando se registre
5. El registro debe tomar < 10 segundos (social login)

---

### Paso 5: El gancho de retención

**Después de completar la saga** (o si abandona a medio camino), crear razones para volver:

```
┌──────────────────────────────────────────┐
│                                          │
│  🏆 ¡Saga de Colón completada!          │
│                                          │
│  Tu tiempo: 24:17                        │
│  Ranking: #47 de 312 exploradores        │
│  Pistas usadas: 3/12                     │
│                                          │
│  ── ¿QUÉ SIGUE? ──                      │
│                                          │
│  🔜 Próxima saga: Lisboa, Portugal       │
│     Comienza en 5 días, 12:30:45         │
│     [Activar recordatorio]               │
│                                          │
│  🔄 Mejora tu score                      │
│     [Jugar de nuevo en modo Explorador]  │
│                                          │
│  👥 Desafía a un amigo                   │
│     [Compartir resultado]                │
│                                          │
│  ⭐ Crea tu propia saga                  │
│     [Aprender cómo →]                    │
│                                          │
└──────────────────────────────────────────┘
```

**4 ganchos de retención**:
1. **Anticipación**: countdown a próxima saga con ciudad revelada
2. **Maestría**: replay con dificultad mayor
3. **Social**: compartir y desafiar amigos
4. **Creación**: invitar a crear contenido

---

### Diagrama de flujo completo del onboarding

```
                    USUARIO NUEVO LLEGA
                          │
                          ▼
                 ┌─────────────────┐
                 │  Bienvenida     │
                 │  (5 segundos)   │
                 │  [¡Vamos!]      │
                 └────────┬────────┘
                          │
                          ▼
                 ┌─────────────────┐
                 │  Carga Street   │
                 │  View + Nivel 1 │
                 │  (tutorial)     │
                 └────────┬────────┘
                          │
                          ▼
            ┌──────────────────────────┐
            │  Coach Mark 1:           │
            │  "Arrastra para explorar"│
            │  [Entendido →]           │
            └────────────┬─────────────┘
                         │
                         ▼
            ┌──────────────────────────┐
            │  Coach Mark 2:           │
            │  "Aquí está tu pista"    │
            │  [Entendido →]           │
            └────────────┬─────────────┘
                         │
                         ▼
            ┌──────────────────────────┐
            │  Coach Mark 3:           │
            │  "Escribe tu respuesta"  │
            │  [¡Intentar!]            │
            └────────────┬─────────────┘
                         │
                         ▼
            ┌──────────────────────────┐
            │  Jugador resuelve        │
            │  Nivel 1 Tutorial        │◀─── respuesta
            │                          │     incorrecta
            │  (respuesta obvia,       │     (feedback
            │   muy permisiva)         │──── amigable)
            └────────────┬─────────────┘
                         │ ✅ correcto
                         ▼
            ┌──────────────────────────┐
            │  🎉 ¡PRIMER ÉXITO!      │
            │  Confetti + dato hist.   │
            │  "¡Ya sabes cómo         │
            │   funciona!"             │
            │                          │
            │  [Siguiente nivel →]     │
            │  [Cambiar a Explorador]  │
            └────────────┬─────────────┘
                         │
                         ▼
            ┌──────────────────────────┐
            │  Niveles 2, 3, 4...      │
            │  (gameplay normal,       │
            │   sin interrupciones)    │
            └────────────┬─────────────┘
                         │ después de nivel 3-4
                         ▼
            ┌──────────────────────────┐
            │  💡 Sugerencia de        │
            │     registro             │
            │                          │
            │  [Google] [Apple] [Email] │
            │  [Seguir como invitado]  │
            └────────────┬─────────────┘
                         │
                    ┌────┴────┐
                    │         │
                 registra   invitado
                    │         │
                    ▼         ▼
            ┌──────────────────────────┐
            │  Continúa la saga        │
            │  (niveles 5-12)          │
            │                          │
            │  localStorage save       │
            │  automático por nivel    │
            └────────────┬─────────────┘
                         │
                         ▼
            ┌──────────────────────────┐
            │  🏆 SAGA COMPLETADA      │
            │                          │
            │  Ranking + stats +       │
            │  ganchos de retención    │
            │                          │
            │  Próxima saga: Lisboa    │
            │  [Recordatorio]          │
            │  [Compartir]             │
            │  [Crear saga]            │
            └──────────────────────────┘
```

---

## Apéndice: Métricas de éxito del UX

### KPIs para medir el impacto de las mejoras

| Métrica | Línea base estimada | Target post-mejoras | Cómo medir |
|---------|:-------------------:|:-------------------:|------------|
| Tasa de completar nivel 1 | ~40% | >80% | Analytics: `level_1_completed` / `play_page_loaded` |
| Tiempo hasta primera interacción | ~45 seg | <15 seg | Analytics: `first_streetview_interaction` - `page_load` |
| Tasa de completar saga completa | ~15% | >35% | Analytics: `saga_completed` / `saga_started` |
| Retorno a 7 días | ~5% | >20% | Analytics: usuarios únicos que vuelven en 7 días |
| Tasa de registro (de invitados) | 0% (no existe) | >25% | Analytics: `registration_completed` / `registration_prompt_shown` |
| NPS del juego | No medido | >50 | Encuesta post-saga |
| Tiempo de sesión móvil | ~3 min (estimado) | >8 min | Analytics: duración de sesión en dispositivos móviles |
| Tasa de compartir | 0% (no existe) | >10% | Analytics: `share_button_clicked` / `saga_completed` |

---

### Próximos pasos de investigación

1. **Pruebas de usabilidad con 5 usuarios reales** (3 móvil, 2 desktop) para validar los problemas identificados
2. **Encuesta de intención** a jugadores del demo actual para validar las proto-personas
3. **A/B test del onboarding** (tutorial vs. sin tutorial) midiendo completion rate del nivel 1
4. **Card sorting** para validar la arquitectura de información del bottom sheet
5. **Test de estrés de validación** con 50 variantes de respuesta por nivel para mejorar el fuzzy matching
6. **Entrevistas de descubrimiento** con potenciales creadores de sagas para validar la etapa de Creación

---

> **Nota del investigador**: Este análisis se basa en revisión heurística y de código. Las recomendaciones deben validarse con investigación primaria (usuarios reales) antes de invertir en implementación a gran escala. Las proto-personas son hipotéticas y necesitan validación con datos reales de comportamiento.
