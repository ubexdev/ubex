# Estrategia de Crecimiento — UBEX 🌍🎯

> **"El Mundo es el Tablero"** — Plataforma de geo-exploración donde los jugadores recorren calles reales vía Google Street View resolviendo acertijos históricos en sagas de 12 niveles.
>
> **MVP en vivo:** ubex.vercel.app (Zona Colonial, Santo Domingo)
> **Mercado inicial:** República Dominicana → Caribe → LATAM
> **Target:** 18–35 años · turistas · gamers · entusiastas de la cultura

---

## Tabla de Contenidos

1. [Estrategia de Lanzamiento](#1-estrategia-de-lanzamiento)
2. [Canales de Adquisición](#2-canales-de-adquisición)
3. [Mecánicas Virales](#3-mecánicas-virales)
4. [Estrategia de Retención](#4-estrategia-de-retención)
5. [Playbook B2B](#5-playbook-b2b)
6. [Métricas Clave](#6-métricas-clave)
7. [Presupuesto de Crecimiento](#7-presupuesto-de-crecimiento)
8. [Riesgos y Mitigación](#8-riesgos-y-mitigación)

---

## 1. Estrategia de Lanzamiento

### 1.1 Pre-lanzamiento (Semanas -4 a 0)

#### Waitlist con incentivo viral

- Landing page con countdown: **"Sé de los primeros 500 exploradores"**
- Formulario simple: nombre + WhatsApp + email
- Incentivo por referidos: **"Invita a 3 amigos → desbloquea la Saga Beta antes que nadie"**
- Ranking público del waitlist: los top 50 referidores reciben acceso VIP permanente
- Implementar con formulario existente + lista en Firestore (ya tenemos Firebase)

#### Beta testers (50–100 personas)

- **Reclutamiento:**
  - 20 gamers dominicanos activos en Discord/Telegram de gaming RD
  - 15 guías turísticos de Zona Colonial (conocen las calles, validarán la experiencia)
  - 15 estudiantes universitarios (INTEC, PUCMM, UASD, UNIBE)
  - 10 micro-influencers de turismo/cultura RD (1K–10K seguidores)
- **Programa beta:**
  - Grupo privado de WhatsApp (canal natural en RD)
  - Formulario de feedback después de cada saga (Google Forms)
  - Sesiones de testing en vivo: jugar juntos por videollamada los viernes
  - Badge exclusivo "Explorador Fundador" permanente en perfil

#### Influencer seeding (Semanas -2 a 0)

- Identificar 10–15 creadores dominicanos en nichos clave:

| Nicho | Ejemplo de perfil | Seguidores | Costo estimado |
|-------|-------------------|------------|----------------|
| Turismo RD | Cuentas de "RD es bella" | 10K–50K | $0–$100 (canje) |
| Gaming móvil | Streamers de Free Fire / Mobile Legends | 5K–30K | $50–$200 |
| Cultura/historia | Profesores, historiadores en redes | 2K–15K | $0 (invitación VIP) |
| Lifestyle Santo Domingo | Foodies, viajeros locales | 10K–100K | $100–$500 |

- **Formato de colaboración:**
  - Enviar acceso anticipado + brief creativo (no guión rígido)
  - Pedirles que graben su reacción jugando la Saga Zona Colonial
  - Contenido ideal: Instagram Reel / TikTok de 30–60 seg reaccionando a las pistas

### 1.2 Día de lanzamiento

#### Playbook hora por hora

| Hora | Acción |
|------|--------|
| 7:00 AM | Post en Instagram/TikTok: video cinemático de la Zona Colonial + CTA |
| 7:00 AM | Activar notificaciones a waitlist vía WhatsApp broadcast |
| 8:00 AM | Influencers publican contenido coordinado (efecto "¿por qué todos hablan de esto?") |
| 9:00 AM | Publicar en grupos de WhatsApp universitarios (con permiso de admins) |
| 10:00 AM | Historia de Instagram con countdown: "Ya hay X personas jugando" |
| 12:00 PM | Post en Reddit r/DominicanRepublic y grupos de Facebook de turismo RD |
| 2:00 PM | Segundo push de contenido: primeros ganadores, screenshots de gameplay |
| 5:00 PM | Instagram Live / TikTok Live: fundador jugando en vivo desde Zona Colonial |
| 8:00 PM | Resumen del día: "X exploradores, X sagas completadas" — crear FOMO |

#### Activación física (si hay presupuesto)

- QR codes pegados en puntos icónicos de Zona Colonial: Catedral Primada, Alcázar de Colón, Calle El Conde
- Mensaje: **"¿Puedes encontrar el tesoro escondido aquí? Escanea y juega 🔍"**
- Costo: ~$30 en impresiones + cinta adhesiva removible

### 1.3 Plan 30/60/90 días

#### Días 1–30: Tracción inicial

- **Objetivo:** 1,000 usuarios registrados, 500 sagas iniciadas
- Publicar 4–5 veces/semana en Instagram y TikTok (Reels cortos de gameplay)
- Responder TODOS los comentarios y DMs (construir comunidad)
- Grupo de WhatsApp de "Exploradores UBEX" (máx 256 personas → lista de difusión después)
- A/B test de mensajes: "Explora tu ciudad" vs "Encuentra el tesoro" vs "¿Conoces realmente tu ciudad?"
- Encuesta post-juego: NPS + "¿Cómo nos encontraste?"
- Lanzar segunda saga: **"Los Secretos del Malecón"** o **"El Faro de Colón"**

#### Días 31–60: Optimización y expansión local

- **Objetivo:** 3,000 usuarios, 30% retención D7
- Analizar datos del primer mes: ¿dónde abandonan? ¿qué nivel frustra?
- Implementar onboarding interactivo (prioridad del análisis UX existente)
- Primer evento presencial: **"Noche de Exploración"** en un bar de Zona Colonial
- Activar canal de WhatsApp Business con catálogo de sagas
- Contactar MITUR y 3 hoteles para piloto B2B
- Lanzar saga temática: evento de temporada (ej: saga de Navidad si aplica)

#### Días 61–90: Escalar lo que funciona

- **Objetivo:** 5,000+ usuarios, modelo de monetización validado
- Duplicar inversión en los 2 canales de mejor CAC
- Lanzar programa de referidos con recompensas in-game
- Primera saga fuera de Santo Domingo: **Santiago, Punta Cana, o Puerto Plata**
- Pitch deck listo para inversores ángeles locales (empezar conversaciones)
- Evaluar expansión a Puerto Rico (mercado bilingüe, puente a LATAM/US)

---

## 2. Canales de Adquisición

### Ranking por costo/ROI para República Dominicana

| # | Canal | CAC est. | ROI | Prioridad | Notas |
|---|-------|----------|-----|-----------|-------|
| 1 | **WhatsApp viral loops** | $0 | ⭐⭐⭐⭐⭐ | 🔴 Crítico | 95%+ de penetración en RD. Canal #1. |
| 2 | **TikTok orgánico** | $0 | ⭐⭐⭐⭐⭐ | 🔴 Crítico | Algoritmo favorece contenido nuevo. Boom en RD 18–25. |
| 3 | **Instagram Reels** | $0–$0.50 | ⭐⭐⭐⭐ | 🔴 Crítico | Red dominante en RD. Reels tienen alcance masivo. |
| 4 | **Alianzas universitarias** | $0 | ⭐⭐⭐⭐ | 🟡 Alto | INTEC, PUCMM, UASD, UNIBE = concentración de target. |
| 5 | **Eventos Zona Colonial** | $50–$200/evento | ⭐⭐⭐⭐ | 🟡 Alto | Tours walking + juego = sinergia natural. |
| 6 | **Tourism partnerships** | $0 | ⭐⭐⭐⭐ | 🟡 Alto | Hoteles, Airbnb hosts, tour operators. Win-win. |
| 7 | **Instagram Ads** | $0.30–$0.80 CPI | ⭐⭐⭐ | 🟢 Medio | Escalar después de validar orgánico. |
| 8 | **TikTok Ads** | $0.20–$0.60 CPI | ⭐⭐⭐ | 🟢 Medio | Más barato que IG pero menos maduro en RD. |
| 9 | **Facebook Groups** | $0 | ⭐⭐⭐ | 🟢 Medio | Grupos de turismo, expats, cultura RD. Audiencia 25+. |
| 10 | **Google Ads (search)** | $1.00–$2.50 CPC | ⭐⭐ | 🔵 Bajo | Solo para keywords de turismo con alta intención. |
| 11 | **Prensa local** | $0 | ⭐⭐ | 🔵 Bajo | Listín Diario, Diario Libre = PR gratuito si hay ángulo. |

### Detalle por canal

#### 🟢 WhatsApp Viral Loops (Prioridad #1)

WhatsApp es la app más usada en RD. No es solo mensajería — es la infraestructura social del país.

**Tácticas:**
- **Share-to-unlock:** Al completar un nivel, pantalla de "Comparte con un amigo para desbloquear pista bonus"
- **Challenge links:** `ubex.vercel.app/challenge/[código]` → "Tu amigo te retó a superar su puntaje en Zona Colonial"
- **Stickers de WhatsApp:** Pack descargable de stickers UBEX (personajes, "¡Lo encontré!", "Explorador Pro")
- **Broadcast list:** Convertir waitlist en lista de difusión para anuncios de nuevas sagas
- **Grupos temáticos:** Grupo por saga activa donde jugadores comparten pistas (sin spoilers)

**Métricas a trackear:** K-factor (invitaciones enviadas / nuevos usuarios), tasa de apertura de links compartidos

#### 🟢 TikTok Orgánico

**Formato de contenido ganador:**
1. **"¿Conoces este lugar?"** — Mostrar Street View de un lugar icónico de RD → pregunta → respuesta
2. **Reacción jugando** — Cara del jugador + pantalla, reacciones genuinas al descubrir pistas
3. **Speedrun** — "Completé los 12 niveles en X minutos" (aspiracional)
4. **Behind the scenes** — Cómo se crean las pistas, el equipo, la historia detrás
5. **Duetos/respuestas** — Retar a otros creadores a jugar una saga

**Frecuencia:** 1 video/día mínimo. Probar 3–4 formatos por semana. Duplicar lo que funciona.

**Hashtags RD:** #RepúblicaDominicana #ZonaColonial #SantoDomingo #TurismoRD #JuegosMovil #UBEX

#### 🟢 Instagram Reels + Stories

- Contenido similar a TikTok pero adaptado (texto más limpio, hashtags diferentes)
- Stories interactivas: encuestas ("¿Sabes dónde está esto?"), quizzes, countdowns
- Highlights organizados: "Cómo jugar", "Sagas", "Ganadores", "Beta"
- Colaboraciones con cuentas de turismo RD (@godominicanrepublic, @colonialzone)

#### 🟡 Alianzas Universitarias

- **INTEC, PUCMM, UASD, UNIBE** = +200,000 estudiantes en Santo Domingo
- Contactar asociaciones estudiantiles y clubs de gaming
- Propuesta: **"Torneo inter-universitario UBEX"** — equipos de 5, saga exclusiva, premio al ganador
- Pegar QR codes en cafeterías y áreas comunes (con permiso)
- Presentación de 15 min en clases de turismo, historia, o marketing digital

#### 🟡 Eventos y Tours en Zona Colonial

- Alianza con tour operators: **Colonial Tour, Zona Bici, Free Walking Tour SD**
- Al final del tour físico: "Ahora explora lo que no viste → escanea el QR"
- Evento mensual: **"UBEX Night"** en bar/café de Zona Colonial
  - Jugar en equipos, proyectar en pantalla, premios
  - Costo: ~$100–$200 (consumo mínimo del venue)
- Presencia en eventos existentes: **Noche Larga de los Museos, Festival de Merengue**

#### 🟡 Tourism Partnerships

- **Hoteles boutique Zona Colonial:** QR en habitación → saga gratis como "actividad del hotel"
- **Airbnb hosts:** Guía digital UBEX como parte del "welcome package"
- **Rent-a-car / transfers:** Tarjeta con QR para jugar mientras esperan
- **Aeropuerto (AILA):** Pantalla en zona de espera: "Tu aventura empieza antes de salir del aeropuerto"

---

## 3. Mecánicas Virales

### 3.1 Share-to-Unlock (Compartir para desbloquear)

**Mecánica:** Al completar los niveles 3 y 9 de una saga, el jugador ve:

> 🔓 "Nivel bonus desbloqueado — compártelo con un amigo para acceder"

- Genera un link único: `ubex.vercel.app/invite/[código]`
- El amigo recibe: "María te invitó a explorar la Zona Colonial — juega gratis"
- Ambos reciben una pista bonus
- **No bloquear progreso obligatorio** — solo contenido extra

### 3.2 Challenge-a-Friend (Reta a un amigo)

**Mecánica:** Botón "Retar" visible al completar cualquier nivel:

> ⚔️ "Completaste el Nivel 7 en 4:32 — ¿tu amigo puede superarte?"

- Genera link de WhatsApp pre-formateado:
  ```
  🏆 Completé el Nivel 7 de UBEX en 4:32 ¡Intenta superarme!
  👉 ubex.vercel.app/challenge/abc123
  ```
- El retado ve el tiempo a superar antes de empezar (competencia directa)
- Tabla de "Mis duelos" en el perfil

### 3.3 Social Proof en tiempo real

**Implementación (ya tenemos Firebase Realtime Database):**

- Banner sutil en el lobby: **"🔴 847 exploradores jugando ahora"**
- En la saga: **"23 personas están explorando esta saga en este momento"**
- Notificación toast: **"@carlos_rd acaba de completar Zona Colonial en 18 min"**
- Mapa de calor: mostrar en el globo 3D (React Three Fiber) dónde están jugando en tiempo real

### 3.4 Saga Completion Cards (Tarjetas de logro compartibles)

**Mecánica:** Al completar una saga, generar imagen dinámica:

```
┌──────────────────────────────────────┐
│  🏆 SAGA COMPLETADA                 │
│                                      │
│  Zona Colonial — Santo Domingo       │
│  12/12 niveles ✅                    │
│  Tiempo: 47:23                       │
│  Ranking: #156 de 2,341 jugadores    │
│                                      │
│  [Avatar]  @maría_ubex               │
│                                      │
│  🌍 ubex.vercel.app                  │
└──────────────────────────────────────┘
```

- Botón directo: "Compartir en Instagram Story" / "Enviar por WhatsApp"
- Diseño atractivo con foto del lugar explorado de fondo
- Variantes estacionales (Navidad, Carnaval, etc.)

### 3.5 Competencias por equipos

**Mecánica:**

- Crear equipo de 2–5 personas (invitar por WhatsApp)
- Cada miembro juega la saga individualmente
- Puntaje del equipo = suma de tiempos individuales
- Leaderboard de equipos separado
- Torneos semanales con premios: saga gratis, badge exclusivo, merchandise

**Casos de uso:**
- Amigos retándose entre sí
- Torneos universitarios (INTEC vs PUCMM)
- Team building corporativo (oferta B2B)
- Familias en vacaciones

### 3.6 Coeficiente viral objetivo

| Métrica | Target Mes 1 | Target Mes 3 | Target Mes 6 |
|---------|--------------|--------------|--------------|
| K-factor | 0.3 | 0.7 | 1.0+ |
| Invitaciones/usuario | 2 | 4 | 5+ |
| Conversión de invitación | 15% | 18% | 20%+ |
| Shares por saga completada | 0.5 | 1.2 | 2.0 |

> **Meta:** K-factor ≥ 1.0 para mes 6 = crecimiento orgánico autosostenible

---

## 4. Estrategia de Retención

### 4.1 Cadencia de contenido

#### Drops de sagas

| Frecuencia | Tipo | Ejemplo |
|------------|------|---------|
| Semanal | Mini-saga (5 niveles) | "El Misterio del Faro" |
| Quincenal | Saga completa (12 niveles) | "Secretos del Malecón" |
| Mensual | Saga premium/evento | "Carnaval de La Vega" |
| Trimestral | Saga épica (20+ niveles) | "La Ruta de Colón" |

- Anunciar próxima saga con 48h de anticipación (countdown en app + WhatsApp)
- "Saga sorpresa" ocasional sin previo aviso (genera hábito de revisar la app)

#### Pipeline de ciudades

| Trimestre | Ciudad/Zona | Justificación |
|-----------|-------------|---------------|
| Q1 | Zona Colonial, Santo Domingo | MVP — alta densidad de StreetView y turismo |
| Q1 | Malecón + Gazcue | Expansión natural, misma ciudad |
| Q2 | Puerto Plata / Cabarete | Turismo norte, comunidad expat |
| Q2 | Punta Cana / Bávaro | Mayor zona turística de RD |
| Q3 | Santiago de los Caballeros | Segunda ciudad, mercado local |
| Q3 | La Romana / Casa de Campo | Turismo de lujo |
| Q4 | San Juan, Puerto Rico | Mercado bilingüe, puente a US Hispano |
| Q4 | La Habana, Cuba | Caribe hispano, altísimo interés cultural |

### 4.2 Sistema de streaks (rachas)

- **Racha diaria:** Jugar al menos 1 nivel por día
  - 3 días → pista gratis
  - 7 días → badge "Explorador Dedicado"
  - 30 días → acceso anticipado a próxima saga
- **Racha semanal:** Completar al menos 1 saga por semana
  - 4 semanas → badge "Explorador Élite" + descuento en Premium
- Mostrar racha prominentemente en perfil (presión social positiva)
- Notificación a las 7 PM: **"¡No pierdas tu racha de 5 días! Te falta 1 nivel"**

### 4.3 Eventos estacionales (calendario RD)

| Fecha | Evento | Saga/Actividad |
|-------|--------|----------------|
| **Enero** | Día de Reyes / Año Nuevo | "Los Tres Reyes de la Colonial" — saga temática |
| **Febrero** | Carnaval de La Vega | "La Ruta del Diablo Cojuelo" — saga especial con máscaras AR |
| **Febrero** | San Valentín | Modo "Exploración en Pareja" — saga para dos |
| **Marzo–Abril** | Semana Santa | "El Camino de la Fe" — iglesias y tradiciones coloniales |
| **Mayo** | Día de las Madres (27 mayo en RD) | "Regala una aventura" — saga gifteable |
| **Junio** | Vacaciones de verano | Torneo de verano inter-islas |
| **Agosto** | Restauración (16 ago) | Saga histórica patriótica |
| **Octubre** | Halloween | "Fantasmas de la Colonial" — saga de terror/misterio |
| **Noviembre** | Black Friday | Descuentos en Premium + sagas bundle |
| **Diciembre** | Navidad / Año Nuevo | "12 Días de Exploración" — 1 nivel especial por día |

### 4.4 Community content pipeline

- **User-Generated Content (UGC):**
  - Feature semanal: "Explorador de la Semana" en Stories
  - Repostear mejores capturas de pantalla de jugadores
  - Concurso mensual: mejor foto real del lugar que exploraron en UBEX

- **Contenido educativo:**
  - "¿Sabías que...?" — dato histórico por cada saga (post-nivel)
  - Serie "La Historia Detrás del Nivel" en Instagram/TikTok
  - Colaboración con historiadores dominicanos para validar contenido

- **Creadores de contenido:**
  - Programa "Explorador Creador" (alineado con VIP Creator Program del modelo de negocio)
  - Los creadores proponen sagas de su ciudad → revenue share
  - Los mejores creadores reciben badge verificado y acceso a herramientas de admin

### 4.5 Push notifications (estrategia anti-spam)

**Reglas:**
- Máximo 1 push/día
- Nunca antes de 9 AM ni después de 9 PM
- Personalizar según comportamiento del usuario

| Trigger | Mensaje | Timing |
|---------|---------|--------|
| No juega en 24h | "Tu racha de X días está en peligro 🔥" | 7 PM |
| Nueva saga disponible | "Nueva saga: [Nombre] — sé de los primeros en explorarla" | 10 AM día de drop |
| Amigo completó saga | "@carlos terminó la saga antes que tú 👀" | En el momento |
| Saga a medio completar | "Te faltan solo 4 niveles para completar [Saga]" | 6 PM sábado |
| Inactivo 7+ días | "Los exploradores te extrañan — nueva saga te espera" | 11 AM domingo |
| Evento estacional | "🎄 Saga de Navidad disponible — solo por 2 semanas" | 9 AM inicio del evento |

### 4.6 Benchmarks de retención (juegos móviles LATAM)

| Métrica | Benchmark LATAM | Target UBEX Mes 3 | Target UBEX Mes 6 |
|---------|----------------|--------------------|--------------------|
| D1 (retención día 1) | 25–35% | 30% | 40% |
| D7 (retención día 7) | 10–15% | 15% | 20% |
| D30 (retención día 30) | 3–6% | 8% | 12% |
| WAU/MAU ratio | 15–25% | 20% | 30% |
| Sesiones/semana | 2–3 | 3 | 4+ |
| Duración sesión | 5–8 min | 10 min | 12+ min |

> UBEX tiene ventaja natural vs juegos casuales: las sagas de 12 niveles crean arcos narrativos que incentivan completar.

---

## 5. Playbook B2B

### 5.1 MITUR (Ministerio de Turismo)

#### Por qué les interesa
- RD recibe **7M+ turistas/año** generando **$8.5B USD**
- MITUR invierte millones en marketing digital de destinos
- UBEX = herramienta innovadora de **marketing experiencial** para destinos
- Alineado con su estrategia de diversificar más allá de sol y playa

#### Cómo abordarlos

1. **Preparación (Semana 1–2):**
   - Crear demo exclusiva: "Saga MITUR" con 5 destinos prioritarios del ministerio
   - Preparar one-pager con datos: usuarios, tiempo en app, NPS, mapas de calor
   - Identificar contacto: Dirección de Promoción Turística o Innovation Hub

2. **Primer contacto (Semana 3):**
   - Email frío con video de 60 seg mostrando la experiencia
   - Asunto: "Herramienta gratuita para que turistas exploren RD antes de llegar"
   - No pedir dinero — ofrecer piloto gratuito

3. **Propuesta de piloto (Semana 4–6):**
   - 3 sagas gratuitas de destinos prioritarios de MITUR
   - Co-branding: "Experiencia presentada por MITUR x UBEX"
   - UBEX provee datos de engagement → MITUR los usa en reportes
   - Duración: 3 meses. Métrica de éxito: 10,000 sagas jugadas

4. **Escalamiento post-piloto:**
   - Propuesta B2B: $5,000–$15,000/saga customizada por destino
   - Sagas interactivas para ferias: FITUR (Madrid), ITB (Berlín), WTM (Londres)
   - Integración con Go Dominican Republic (web oficial de MITUR)

#### Propuesta de valor para MITUR

| Para MITUR | UBEX provee |
|------------|-------------|
| Promoción de destinos | Sagas interactivas de cada provincia |
| Engagement pre-viaje | Turistas "visitan" antes de comprar boleto |
| Datos de comportamiento | Mapas de calor de interés por zona |
| Innovación tecnológica | Case study de turismo + gamificación |
| ROI medible | Métricas exactas vs campaña de banner |

### 5.2 Hoteles y resorts

#### Modelo: QR en habitación → saga gratuita del destino

**Pitch para el hotel:**
> "Dale a tus huéspedes una experiencia interactiva de la ciudad — gratis. Ellos se divierten, tú obtienes datos de preferencias y una actividad que no te cuesta nada."

**Implementación:**
- QR code en tarjeta del room + TV del lobby
- Saga customizada con el logo del hotel como co-brand
- Último nivel: CTA al restaurante/spa/tour del hotel (monetización B2B)

**Pricing B2B hotelero:**

| Tier | Incluye | Precio mensual |
|------|---------|----------------|
| Básico | 1 saga estándar + QR codes | $200/mes |
| Pro | 1 saga custom + analytics dashboard | $500/mes |
| Enterprise | Sagas ilimitadas + white label + API | $2,000+/mes |

**Hoteles target en RD (empezar aquí):**
- Zona Colonial: Hotel Billini, Casas del XVI, Hodelpa Nicolas de Ovando
- Punta Cana: Palladium, Hard Rock, Secrets
- Puerto Plata: Casa Colonial, Iberostar
- Samaná: Sublime Samaná, Bahía Príncipe

**Secuencia de outreach:**
1. Empezar con boutique hotels de Zona Colonial (decisión rápida, manager accesible)
2. Validar con 3–5 hoteles → caso de éxito
3. Escalar a cadenas con caso de éxito + datos

### 5.3 Municipalidades (Ayuntamientos)

#### Propuesta: Saga como herramienta de turismo cultural municipal

- **Ayuntamiento del Distrito Nacional (ADN):** Saga de cada barrio histórico
- **Ayuntamiento de Santiago:** Saga del Monumento, Centro Histórico
- **Ayuntamiento de Puerto Plata:** Saga del Teleférico + Fortaleza San Felipe

**Modelo:**
- Piloto gratuito: 1 saga del municipio a cambio de promoción en canales oficiales
- Post-piloto: $3,000–$8,000 por saga customizada
- Evento de lanzamiento co-organizado: "La saga de [Ciudad] está aquí"

**Contacto:** Dirección de Cultura o Dirección de Turismo municipal

### 5.4 Marcas patrocinadoras

#### Marcas alineadas con el target UBEX en RD

| Marca | Por qué | Tipo de alianza |
|-------|---------|-----------------|
| **Brugal** | Ron premium RD, target 21–35, lifestyle | Saga "La Ruta del Ron" patrocinada |
| **Presidente** | Cerveza #1 de RD, masiva en 18–35 | Sponsor de torneos, in-game branding |
| **Claro** | Telecom dominante, quiere engagement digital | Data sponsor, WiFi spots para jugar |
| **Banreservas** | Banco más grande, programas culturales | Sponsor de sagas históricas/educativas |
| **La Sirena** | Retail masivo, target popular | Promociones cruzadas, premios físicos |
| **Cervecería Nacional** | Portfolio de bebidas, eventos | Sponsor de UBEX Nights |

#### Modelo de patrocinio

**Saga patrocinada ($3,000–$10,000):**
- Saga temática alineada con la marca
- Logo del sponsor en pantalla de inicio y completación
- Product placement sutil en pistas (ej: "Busca la esquina donde se fundó Brugal...")
- Datos de engagement compartidos con el sponsor

**Torneo patrocinado ($2,000–$5,000):**
- Nombre: "Copa [Marca] UBEX"
- Premios del sponsor (ej: canasta Brugal, caja de Presidente)
- Content rights para el sponsor (fotos, videos del evento)

**In-game branding ($500–$2,000/mes):**
- Banner en lobby
- Power-up branded: "Pista Presidente" (pista extra cortesía del sponsor)
- Splash screen al iniciar saga

### 5.5 Proceso de ventas B2B

```
Semana 1–2: Investigación + lista de 20 prospects
    ↓
Semana 3: Outreach frío (email + LinkedIn + WhatsApp)
    ↓
Semana 4: Demo personalizada (15 min, con saga del cliente)
    ↓
Semana 5: Propuesta formal + pricing
    ↓
Semana 6–8: Negociación + cierre piloto
    ↓
Mes 3: Entrega + resultados del piloto
    ↓
Mes 4+: Upsell (más sagas, más destinos, contrato anual)
```

---

## 6. Métricas Clave

### 6.1 North Star Metric

> **Sagas completadas por semana**

¿Por qué esta métrica?
- Captura **adquisición** (necesitas usuarios para completar)
- Captura **activación** (jugaron lo suficiente para terminar)
- Captura **retención** (vuelven a completar más sagas)
- Captura **engagement** (12 niveles = compromiso real)
- Correlaciona con **monetización** (usuarios que completan pagan más)

### 6.2 Funnel de activación

```
Visita al sitio (100%)
    ↓ [Tasa de registro: target 15%]
Registro completado (15%)
    ↓ [Tasa de inicio: target 70%]
Juega Nivel 1 (10.5%)
    ↓ [Tasa de progresión: target 60%]
Completa Nivel 3 (6.3%)
    ↓ [Tasa de enganche: target 50%]
Completa Nivel 6 — "hooked" (3.2%)
    ↓ [Tasa de completación: target 40%]
Completa Saga (12/12) (1.3%)
    ↓ [Tasa de monetización: target 5%]
Primera compra (0.06%)
```

#### Métricas por etapa del funnel

| Etapa | Métrica | Herramienta | Target |
|-------|---------|-------------|--------|
| **Awareness** | Visitas únicas/semana | Analytics | 5,000 (Mes 3) |
| **Adquisición** | Registros/semana | Firebase Auth | 750 |
| **Activación** | % que juega L1 en <24h | Firestore events | 70% |
| **Enganche** | % que llega a L6 | Firestore events | 50% de los que empiezan |
| **Completación** | Sagas completadas/semana | Firestore events | 300 |
| **Retención** | D7 retention | Cohorte analysis | 20% |
| **Referencia** | K-factor | Custom tracking | 0.7 |
| **Revenue** | MRR | PayPal/Stripe | $500 (Mes 3) |

### 6.3 Benchmarks de juegos móviles LATAM

| Métrica | Casual Games LATAM | Target UBEX |
|---------|-------------------|-------------|
| CPI (costo por instalación) | $0.50–$2.00 | $0.30–$0.80 |
| D1 retention | 25–35% | 35%+ |
| D7 retention | 10–15% | 18%+ |
| D30 retention | 3–6% | 10%+ |
| ARPU (revenue/user/mes) | $0.05–$0.30 | $0.15 |
| ARPPU (revenue/paying user/mes) | $5–$15 | $8 |
| Conversion to paying | 2–5% | 3% |
| Session length | 5–8 min | 12+ min |
| Sessions/day | 1.5–2.5 | 2+ |
| Viral K-factor | 0.1–0.3 | 0.7+ |

### 6.4 Milestones de revenue

| Milestone | MRR | Fuente principal | Timeline |
|-----------|-----|-------------------|----------|
| **Ramen profitable** | $500 | Saga Pass ($2.99) x ~170 ventas | Mes 3–4 |
| **Primer B2B** | $2,000 | 1 hotel + 1 sponsor | Mes 4–6 |
| **Validación** | $5,000 | Mix B2C + B2B | Mes 6–9 |
| **Tracción** | $10,000 | B2B escalado + Premium subs | Mes 9–12 |
| **Serie pre-seed** | $15,000+ | Portafolio diversificado | Mes 12+ |

### 6.5 Dashboard recomendado (build with Firebase + simple frontend)

**Métricas diarias:**
- Usuarios activos (DAU)
- Nuevos registros
- Sagas iniciadas / completadas
- Revenue del día

**Métricas semanales:**
- WAU/MAU ratio
- Retención por cohorte (D1, D7)
- K-factor
- Top sagas por completación
- Fuente de adquisición (UTM tracking)

**Métricas mensuales:**
- MRR y crecimiento
- CAC por canal
- LTV estimado
- NPS
- Funnel completo con drop-offs

---

## 7. Presupuesto de Crecimiento

### 7.1 Estrategia $0/mes — Bootstrapped puro

> **Para los primeros 30–60 días. Máximo hustle, cero gasto.**

| Actividad | Costo | Tiempo/semana | Impacto esperado |
|-----------|-------|---------------|------------------|
| Contenido TikTok (1 video/día) | $0 | 5h | 50–200 nuevos usuarios/semana |
| Contenido Instagram Reels (4/semana) | $0 | 4h | 30–100 nuevos usuarios/semana |
| WhatsApp viral loops (share-to-unlock) | $0 | 2h setup | K-factor 0.2–0.4 |
| Grupos de Facebook de turismo RD | $0 | 2h | 20–50 nuevos usuarios/semana |
| Outreach a influencers (canje por acceso) | $0 | 3h | 100–500 por colaboración |
| Alianza con 1 tour operator (Zona Colonial) | $0 | 2h | 10–30 nuevos usuarios/semana |
| QR codes impresos en Zona Colonial | $30 una vez | 1h | 5–15 nuevos usuarios/semana |
| Reddit + foros de turismo | $0 | 1h | 10–20 nuevos usuarios/semana |
| **TOTAL** | **~$0** | **~20h/semana** | **225–915 usuarios/semana** |

**Prioridades $0:**
1. WhatsApp loops (mayor ROI posible en RD)
2. TikTok orgánico (alcance algorítmico gratuito)
3. Instagram Reels (consolidar presencia)
4. 1 alianza con tour operator

### 7.2 Estrategia $500/mes — Aceleración inteligente

> **Cuando hay tracción orgánica validada. Amplificar lo que funciona.**

| Actividad | Presupuesto | Impacto esperado |
|-----------|-------------|------------------|
| Instagram Ads (Reels promocionados) | $200/mes | 250–650 installs (CPI ~$0.30–$0.80) |
| TikTok Ads (Spark Ads) | $150/mes | 250–750 installs (CPI ~$0.20–$0.60) |
| Micro-influencers (2–3/mes) | $100/mes | 200–600 nuevos usuarios |
| Eventos UBEX Night (1/mes) | $50/mes | 30–50 usuarios + contenido para redes |
| **TOTAL** | **$500/mes** | **730–2,050 usuarios/mes (pagados)** |

**Reglas de $500/mes:**
- 70% en los 2 canales de menor CAC (probablemente TikTok + Instagram)
- 20% en influencers (amplificación de contenido)
- 10% en eventos (community building)
- Revisar CAC semanalmente. Si un canal > $1.00 CPI, reasignar presupuesto
- A/B test de creativos: 3 variantes por semana mínimo

### 7.3 Estrategia $2,000/mes — Escalar canales validados

> **Cuando CAC y retención están claros. Escalar + iniciar B2B.**

| Actividad | Presupuesto | Impacto esperado |
|-----------|-------------|------------------|
| Instagram Ads (escalado) | $600/mes | 750–2,000 installs |
| TikTok Ads (escalado) | $400/mes | 650–2,000 installs |
| Influencer marketing (5–8/mes) | $400/mes | 500–1,500 nuevos usuarios |
| Eventos (2/mes + 1 universitario) | $200/mes | 80–150 usuarios + brand awareness |
| Google Ads (keywords turismo RD) | $200/mes | 80–200 installs de alta intención |
| Herramientas (analytics, email, design) | $100/mes | Infraestructura de growth |
| Content creator (freelance part-time) | $100/mes | 2x output de contenido |
| **TOTAL** | **$2,000/mes** | **2,060–5,850 usuarios/mes (pagados)** |

**Distribución ideal a $2,000/mes:**

```
Paid Ads (50%)     ████████████████████  $1,000
Influencers (20%)  ████████              $400
Events (10%)       ████                  $200
Google Ads (10%)   ████                  $200
Tools (5%)         ██                    $100
Content (5%)       ██                    $100
```

### 7.4 Orden de testeo de canales

```
Fase 1 (Semana 1–4): $0
  1. WhatsApp viral loops ← PRIMERO, siempre
  2. TikTok orgánico
  3. Instagram orgánico

Fase 2 (Semana 5–8): $0–$200
  4. 2–3 micro-influencers
  5. 1 alianza tour operator
  6. 1 evento presencial

Fase 3 (Semana 9–12): $200–$500
  7. Instagram Ads ($100 test)
  8. TikTok Ads ($100 test)
  → Medir CAC, matar lo que no funciona

Fase 4 (Mes 4+): $500–$2,000
  9. Escalar ganadores de Fase 3
  10. Google Ads (keywords turismo)
  11. B2B outreach (hoteles, MITUR)
  → Re-evaluar mensualmente
```

---

## 8. Riesgos y Mitigación

### 8.1 Riesgos de producto

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|-------------|---------|------------|
| **Cobertura de Street View limitada fuera de Santo Domingo** | Alta | Alto | Validar cobertura ANTES de anunciar nueva ciudad. Tener plan B con fotos 360° propias. Alianza con Google Local Guides RD. |
| **Latencia/carga lenta en móvil (conexión RD)** | Alta | Alto | Optimización mobile-first (ya priorizada en análisis existente). Lazy loading de Street View. Modo offline parcial para pistas de texto. |
| **Frustración en niveles difíciles → abandono** | Media | Alto | Sistema de pistas progresivas (1 gratis, más por compartir/pagar). Dificultad adaptativa. Feedback del análisis UX: implementar indicadores de progreso claros. |
| **Pistas se filtran en redes/WhatsApp (spoilers)** | Alta | Medio | Generar variantes de pistas por usuario con Gemini AI. Pistas dependientes de ubicación exacta del jugador. Sistema de reportes de spoilers. |

### 8.2 Riesgos de mercado

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|-------------|---------|------------|
| **Competidor copia el concepto para RD** | Media | Alto | Velocidad de ejecución es la defensa #1. Construir comunidad y marca antes de que copien. Acuerdos exclusivos con MITUR/hoteles. |
| **Saturación de atención en redes (muchas apps nuevas)** | Alta | Medio | Diferenciarse con lo LOCAL — nadie más hace geo-exploration de RD. Contenido auténtico > pulido. |
| **Turistas no descubren UBEX antes/durante viaje** | Media | Alto | SEO en "things to do in Santo Domingo". Partnerships con plataformas de viaje (TripAdvisor, GetYourGuide). Presencia en aeropuerto y hoteles. |
| **Dependencia del turismo (ciclicidad estacional)** | Media | Medio | Balancear con mercado local (dominicanos explorando su país). Sagas educativas para escuelas. Diversificar a ciudades no turísticas. |

### 8.3 Riesgos técnicos

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|-------------|---------|------------|
| **Costos de Google Maps API escalan rápido** | Alta | Alto | $200/mes crédito gratuito de Google Maps. Cachear tiles donde sea posible. Monitorear uso diario con alertas. Tener cap de usuarios si es necesario. |
| **Firebase costs con escala** | Media | Medio | Optimizar queries Firestore. Migración planificada a Supabase (ya en dependencias). Implementar rate limiting. |
| **Gemini AI da respuestas incorrectas/inconsistentes** | Media | Medio | Validación humana de respuestas para cada saga antes de publicar. Fallback a respuestas pre-definidas. Logging de todas las validaciones de Gemini. |
| **PayPal/pagos fallan en RD** | Baja | Alto | Integrar múltiples métodos: PayPal + tarjeta directa. Explorar pagos locales (tPago, Banreservas). Google Pay como alternativa. |

### 8.4 Riesgos de crecimiento

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|-------------|---------|------------|
| **K-factor no llega a 1.0 (crecimiento no es viral)** | Media | Alto | Iterar mecánicas virales agresivamente. Testear 3+ formatos de share. Si orgánico no funciona, pivotar a B2B como canal principal. |
| **CAC demasiado alto para monetización actual** | Media | Alto | Mantener CAC < 50% del LTV estimado. Si CAC > $2, pausar paid y volver a orgánico. Priorizar B2B que subsidie B2C. |
| **Retención cae después de completar sagas disponibles** | Alta | Alto | Pipeline de contenido constante. Sistema de creadores para escalar producción. Modos de rejugabilidad (speedrun, hard mode, multiplayer). |
| **Equipo de 1–2 personas no da abasto** | Alta | Alto | Automatizar todo lo posible (CI/CD, analytics, deploys). Priorizar brutalmente — 1 saga nueva > 3 features pequeñas. Buscar co-founder de contenido/growth. |

### 8.5 Riesgos regulatorios y legales

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|-------------|---------|------------|
| **Problemas con premio de $1,000 (ley de juegos de azar RD)** | Media | Alto | Consultar abogado local. Estructurar como "concurso de habilidad" (no azar). Términos y condiciones claros. Si hay riesgo legal, cambiar a premios en especie o crédito in-app. |
| **Uso de imágenes de Street View (ToS de Google)** | Baja | Alto | Cumplir estrictamente con Google Maps Platform ToS. No capturar/redistribuir imágenes. Usar la API embedida, no screenshots. |
| **Privacidad de datos (GDPR si expande a EU)** | Baja | Medio | Implementar consent management desde ahora. Firebase Auth ya maneja datos mínimos. Preparar privacy policy para LATAM y EU. |
| **Contenido cultural sensible en sagas** | Baja | Medio | Revisión por experto local de cada saga antes de publicar. Mecanismo de reporte de usuarios. Evitar trivializar eventos históricos traumáticos. |

### 8.6 Matriz de prioridad de mitigación

```
           ALTO IMPACTO                    BAJO IMPACTO
         ┌─────────────────────────┬─────────────────────────┐
  ALTA   │ 🔴 MITIGAR AHORA       │ 🟡 MONITOREAR           │
  PROB.  │ • Street View coverage  │ • Saturación de redes   │
         │ • Latencia móvil        │ • Filtración de pistas  │
         │ • Google Maps costs     │                         │
         │ • Retención post-saga   │                         │
         │ • Equipo pequeño        │                         │
         ├─────────────────────────┼─────────────────────────┤
  BAJA   │ 🟡 PLAN DE CONTINGENCIA │ 🟢 ACEPTAR              │
  PROB.  │ • Competidor copia      │ • GDPR (futuro)         │
         │ • K-factor < 1.0        │ • Contenido sensible    │
         │ • CAC muy alto          │ • Google ToS            │
         │ • Ley de juegos         │                         │
         └─────────────────────────┴─────────────────────────┘
```

---

## Apéndice: Calendario de ejecución — Primeros 90 días

```
SEMANA 1–2: PREPARACIÓN
├── ✅ Implementar share-to-unlock (WhatsApp)
├── ✅ Crear perfiles TikTok + Instagram
├── ✅ Configurar UTM tracking + analytics básico
├── ✅ Reclutar 50 beta testers
└── ✅ Grabar primeros 10 TikToks/Reels

SEMANA 3–4: BETA + CONTENIDO
├── ✅ Beta cerrada con 50–100 testers
├── ✅ Publicar contenido diario (TikTok + IG)
├── ✅ Iterar producto con feedback de beta
├── ✅ Contactar 5 micro-influencers
└── ✅ Preparar landing de waitlist

SEMANA 5–6: LANZAMIENTO PÚBLICO
├── 🚀 Launch day (ver playbook arriba)
├── 🚀 Activar waitlist
├── 🚀 Influencers publican contenido coordinado
├── 🚀 Primera semana: responder TODO, ser ultra-activo
└── 🚀 Meta: 500 registros primera semana

SEMANA 7–8: OPTIMIZACIÓN
├── 📊 Analizar funnel completo
├── 📊 Identificar punto de mayor abandono
├── 📊 A/B test de mensajes de adquisición
├── 📊 Primera encuesta NPS
└── 📊 Contactar 1 tour operator de Zona Colonial

SEMANA 9–10: SEGUNDA SAGA + PAID TEST
├── 🆕 Lanzar segunda saga
├── 💰 Test de $100 en Instagram Ads
├── 💰 Test de $100 en TikTok Ads
├── 🤝 Primer contacto MITUR / hotel
└── 🎯 Meta: 2,000 registros acumulados

SEMANA 11–12: ESCALAR LO QUE FUNCIONA
├── 📈 Duplicar presupuesto en canal ganador
├── 📈 Primer evento UBEX Night
├── 📈 Programa de referidos activo
├── 📈 Evaluar monetización (primera venta)
└── 🎯 Meta: 3,000+ registros, primeros $100 en revenue
```

---

> **Documento vivo** — Actualizar mensualmente con datos reales. Lo que no se mide, no se mejora. Lo que no se ejecuta, no existe.
>
> *Última actualización: Julio 2025*
