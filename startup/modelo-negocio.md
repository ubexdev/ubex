# UBEX — Análisis de Modelo de Negocio

**Plataforma de Geo-Exploración y Búsqueda del Tesoro**
**Fecha:** Julio 2025
**Preparado para:** CEO, UBEX — República Dominicana

---

## Índice

1. [Resumen Ejecutivo](#1-resumen-ejecutivo)
2. [Análisis FODA (SWOT)](#2-análisis-foda-swot)
3. [Modelo de Monetización](#3-modelo-de-monetización)
4. [Análisis de Costos vs Beneficios](#4-análisis-de-costos-vs-beneficios)
5. [Programa VIP para Creadores de Mapas](#5-programa-vip-para-creadores-de-mapas)
6. [Proyecciones Financieras (12 meses)](#6-proyecciones-financieras-12-meses)
7. [Recomendaciones al CEO](#7-recomendaciones-al-ceo)

---

## 1. Resumen Ejecutivo

UBEX es una plataforma de juegos de exploración geográfica donde los jugadores recorren calles reales mediante Google Street View para resolver acertijos a lo largo de 12 niveles por "saga". Actualmente existe como un **prototipo funcional** con una saga demo ambientada en la Zona Colonial de Santo Domingo.

### Estado actual del producto

| Componente | Estado |
|---|---|
| Landing page | ✅ Funcional |
| Demo jugable (12 niveles) | ✅ Funcional |
| Street View integración | ✅ Funcional |
| Validación por proximidad (100m) | ✅ Funcional |
| UI de progreso y resultado | ✅ Funcional |
| Firebase auth/database | ⚠️ SDK instalado, sin implementar |
| PayPal/Google Pay | ⚠️ Tipos definidos, sin checkout real |
| Gemini AI (validación de respuestas) | ⚠️ Código scaffolding, no integrado al flujo |
| Backend Supabase | ❌ No implementado |
| Panel admin | ❌ No implementado |
| Sistema de suscripciones | ❌ Solo tipos TypeScript |

**Conclusión:** El producto tiene un demo convincente pero necesita 3-4 meses de desarrollo antes de poder monetizar.

---

## 2. Análisis FODA (SWOT)

### 🟢 Fortalezas

| # | Fortaleza | Detalle |
|---|---|---|
| F1 | **Concepto único y diferenciado** | No existe un competidor directo que combine Street View + acertijos + gamificación competitiva con premios reales. Pokémon GO requiere movimiento físico; GeoGuessr no tiene narrativa ni premios. UBEX ocupa un nicho vacío. |
| F2 | **Mobile-first sin instalación** | Al ser una Progressive Web App con Next.js, los usuarios juegan directamente desde el navegador. Cero fricción de descarga = mejor conversión vs apps nativas. |
| F3 | **Escalabilidad geográfica infinita** | Cualquier ciudad del mundo con cobertura de Street View puede convertirse en una saga. No hay límite físico de inventario. Google Street View cubre 220+ países. |
| F4 | **Modelo de contenido generado por usuarios (UGC)** | El sistema de tipos ya contempla creadores de sagas. Si la comunidad crea mapas, el inventario de contenido crece sin costo directo para UBEX. |
| F5 | **Stack tecnológico moderno y económico** | Next.js 16 + Firebase + Vercel permite escalar de 0 a 100K usuarios con costos incrementales predecibles. No se necesita infraestructura propia de servidores. |
| F6 | **Atractivo turístico inherente** | Las sagas basadas en ciudades reales tienen valor intrínseco para oficinas de turismo, hoteles y operadores turísticos. El producto se vende solo como herramienta promocional. |
| F7 | **Gancho psicológico poderoso** | El premio de $1,000 USD + competencia en tiempo real + eliminación progresiva crea urgencia y viralidad orgánica (los jugadores comparten para reclutar competidores). |

### 🔵 Oportunidades

| # | Oportunidad | Detalle |
|---|---|---|
| O1 | **Mercado de turismo digital post-COVID** | La industria del turismo virtual creció 46% entre 2020-2024. Los "tours virtuales" son ahora un canal de marketing establecido para destinos turísticos. UBEX convierte eso en entretenimiento. |
| O2 | **B2B con juntas de turismo del Caribe** | República Dominicana, Puerto Rico, Cuba, Jamaica — todos invierten millones en marketing turístico. Una saga UBEX personalizada es más barata y más viral que un comercial de TV. Presupuestos típicos: $5K-$50K por campaña digital. |
| O3 | **Gamificación educativa (EdTech)** | Sagas de historia, geografía y cultura pueden venderse a escuelas y universidades. El mercado EdTech de LATAM crece 20% anual y alcanzará $3B USD en 2025. |
| O4 | **Expansión a eventos corporativos** | Team building virtual es un mercado de $300B USD global. UBEX puede ofrecer sagas privadas para empresas a $500-$2,000 por evento. |
| O5 | **Creator economy en gaming** | Plataformas como Roblox demuestran que los creadores generan contenido si reciben compensación. UBEX puede construir un marketplace de sagas con revenue sharing. |
| O6 | **LATAM como mercado desatendido** | La mayoría de juegos de exploración (GeoGuessr, Geotastic) están enfocados en mercados anglosajones. UBEX, al nacer en RD, tiene ventaja cultural y de idioma para todo LATAM (650M+ personas). |
| O7 | **Integración con IA generativa** | Gemini ya está parcialmente integrado. La IA puede generar acertijos dinámicos, personalizar dificultad, y crear sagas automáticamente a partir de datos de Wikipedia/OpenStreetMap. |

### 🟡 Debilidades

| # | Debilidad | Detalle |
|---|---|---|
| D1 | **Producto aún en fase de prototipo** | El checkout (PayPal/Google Pay), la autenticación, el backend, y el panel admin no están implementados. No se puede cobrar ni retener usuarios hoy. |
| D2 | **Dependencia crítica de Google Maps API** | Street View cuesta $7 USD por cada 1,000 cargas. A 100K usuarios activos jugando 5 niveles/día, eso son $3,500/día solo en API de mapas. Este costo puede destruir la unidad económica. |
| D3 | **Sin backend implementado** | No hay Supabase ni ningún backend real. Sin esto, no hay: persistencia de progreso, leaderboards reales, autenticación, ni multi-jugador. |
| D4 | **Equipo presumiblemente pequeño** | Al ser una startup en RD en fase de prototipo, el equipo probablemente es de 1-3 personas. Esto limita la velocidad de desarrollo y la capacidad de atender múltiples frentes. |
| D5 | **Sin tracción medible** | No hay usuarios reales, no hay métricas de retención, no hay datos de conversión. Todo el modelo financiero se basa en supuestos, no en datos. |
| D6 | **Contenido limitado** | Solo existe 1 saga demo (Zona Colonial, 12 niveles). Un jugador termina todo el contenido en 30-60 minutos. Sin más contenido, la retención será cercana a cero. |
| D7 | **Three.js/3D instalado pero sin uso** | React Three Fiber y Drei están en las dependencias pero no se usan. Esto agrega peso al bundle sin beneficio. Limpieza técnica necesaria. |

### 🔴 Amenazas

| # | Amenaza | Detalle |
|---|---|---|
| A1 | **GeoGuessr como competidor indirecto** | GeoGuessr tiene 50M+ de jugadores, una marca establecida, y un modelo freemium probado. Si deciden agregar narrativas/premios, pueden capturar el nicho de UBEX rápidamente. |
| A2 | **Cambios en precios de Google Maps API** | Google ha aumentado precios de Maps API múltiples veces. Un aumento de 2x en el costo de Street View podría hacer inviable el modelo de negocio completo. |
| A3 | **Regulación de juegos con premios en efectivo** | En muchas jurisdicciones, juegos con premios monetarios se consideran "juegos de azar" y requieren licencias especiales. RD, EEUU y la UE tienen regulaciones diferentes y cambiantes. |
| A4 | **Fraude y trampas** | Sin un sistema anti-cheating robusto, los jugadores pueden usar herramientas de geolocalización, inspeccionar el código fuente, o compartir respuestas. Esto destruye la legitimidad del premio. |
| A5 | **Fatiga de Street View** | La experiencia de Street View en móvil puede ser frustrante (carga lenta, controles táctiles imprecisos, imágenes desactualizadas). Esto podría generar abandono alto. |
| A6 | **Cobertura limitada de Street View** | Muchas ciudades de LATAM tienen cobertura parcial o desactualizada de Street View. Esto limita qué sagas se pueden crear para mercados clave. |
| A7 | **Costo de adquisición de usuarios (CAC) en gaming** | El CAC promedio en gaming móvil es $2-5 USD por instalación. Sin viralidad orgánica probada, adquirir 100K usuarios podría costar $200K-$500K USD. |

### Matriz FODA Cruzada — Estrategias

| | **Oportunidades** | **Amenazas** |
|---|---|---|
| **Fortalezas** | **FO (Ofensiva):** Usar el concepto único (F1) + turismo digital (O2) para lanzar sagas B2B con juntas de turismo del Caribe como primer revenue stream. No requiere miles de usuarios. | **FA (Defensiva):** El gancho del premio (F7) diferencia de GeoGuessr (A1). Implementar sistema anti-cheating desde día 1 (A4). Negociar volumen con Google Maps (A2). |
| **Debilidades** | **DO (Adaptativa):** El prototipo funcional (D1) es suficiente para demos B2B (O2). Priorizar backend mínimo (D3) para lanzar sagas de turismo antes de escalar B2C. | **DA (Supervivencia):** Reducir dependencia de Google Maps (D2/A2) investigando alternativas como Mapillary. Validar regulación de premios (A3) antes de invertir en ese modelo. |

---

## 3. Modelo de Monetización

### 3.1 Resumen de tiers y precios

| Tier | Precio | Incluye | Target |
|---|---|---|---|
| **Free** | $0 (con ads) | 1 saga gratuita, ads interstitiales entre niveles, banner en sidebar | Usuarios casuales, top-of-funnel |
| **Saga Pass** | $2.99/saga | Acceso completo a 1 saga sin ads | Jugadores que prueban antes de suscribirse |
| **Premium** | $4.99/mes | Sin ads, todas las sagas, acceso prioritario, sagas exclusivas, 2 hints gratis/mes | Jugadores recurrentes |
| **Premium Anual** | $39.99/año ($3.33/mes) | Todo Premium + 1 saga exclusiva de bienvenida | Retención a largo plazo |
| **Enterprise/B2B** | $2,000-$15,000/saga | Saga white-label personalizada para marca/destino | Juntas de turismo, hoteles, corporativos |

### 3.2 Modelo Free Tier + Publicidad

#### Estructura de ads

| Tipo de ad | Ubicación | Frecuencia | CPM estimado |
|---|---|---|---|
| **Banner** | Sidebar/footer durante exploración | Permanente | $1.50 - $3.00 |
| **Interstitial** | Entre niveles (cada 3 niveles) | 4 por saga completa | $4.00 - $8.00 |
| **Rewarded video** | "Ver video para obtener hint gratis" | Opcional, ilimitado | $10.00 - $20.00 |
| **Native ad** | En pantalla de resultados/leaderboard | 1 por sesión | $2.00 - $5.00 |

#### Estimación de ingresos por ads

**Supuestos:**
- Sesión promedio: 20 minutos
- Impresiones de banner: 8 por sesión (1 cada 2.5 min)
- Interstitials vistos: 2 por sesión
- Rewarded videos vistos: 1 por sesión (30% de usuarios)
- CPM efectivo ponderado: $5.00

| Métrica | Cálculo |
|---|---|
| Impresiones por sesión | 8 banners + 2 interstitials + 0.3 rewarded = 10.3 |
| Sesiones por usuario/mes | 8 (2x/semana) |
| Impresiones por usuario/mes | 82.4 |
| Revenue por usuario/mes (CPM $5) | $0.41 |

#### Revenue por ads según escala de usuarios free

| Usuarios Free activos/mes | Revenue mensual por ads | Revenue anual |
|---|---|---|
| 100 | $41 | $494 |
| 1,000 | $412 | $4,944 |
| 10,000 | $4,120 | $49,440 |
| 100,000 | $41,200 | $494,400 |

**Conclusión:** Los ads solo son significativos a partir de 10K+ usuarios free. Antes de eso, son un complemento menor.

### 3.3 Modelo Premium ($4.99/mes)

#### Tasa de conversión esperada

| Fase | Tasa de conversión Free→Premium | Benchmark industria |
|---|---|---|
| Lanzamiento (mes 4-6) | 2% | Gaming freemium: 1-5% |
| Madurez (mes 7-12) | 5% | Apps top: 5-10% |
| Optimizado (año 2+) | 8% | Con contenido abundante |

#### Revenue por Premium según escala

| Total usuarios | % Free | % Premium | Suscriptores | Revenue mensual |
|---|---|---|---|---|
| 100 | 95% | 5% | 5 | $25 |
| 1,000 | 93% | 7% | 70 | $350 |
| 10,000 | 92% | 8% | 800 | $3,996 |
| 100,000 | 90% | 10% | 10,000 | $49,950 |

### 3.4 Saga Pass ($2.99/saga)

| Total usuarios | % que compra 1+ saga pass/mes | Compradores | Revenue mensual |
|---|---|---|---|
| 100 | 10% | 10 | $30 |
| 1,000 | 8% | 80 | $239 |
| 10,000 | 6% | 600 | $1,794 |
| 100,000 | 5% | 5,000 | $14,950 |

### 3.5 Compras In-Game (Microtransacciones)

| Item | Precio | Uso estimado/mes por usuario activo |
|---|---|---|
| Hint (pista extra) | $0.49 | 15% de usuarios compran 2/mes |
| Extra time (+5 min) | $0.99 | 8% de usuarios compran 1/mes |
| Second chance (reintento) | $0.99 | 5% de usuarios compran 1/mes |
| Cosmético (avatar/badge) | $1.99 | 3% de usuarios compran 1/mes |

#### Revenue por microtransacciones

| Total usuarios | ARPU microtx/mes | Revenue mensual |
|---|---|---|
| 100 | $0.32 | $32 |
| 1,000 | $0.32 | $318 |
| 10,000 | $0.32 | $3,180 |
| 100,000 | $0.32 | $31,800 |

*Cálculo ARPU: (15%×$0.98) + (8%×$0.99) + (5%×$0.99) + (3%×$1.99) = $0.147 + $0.079 + $0.050 + $0.060 = $0.336*

### 3.6 Enterprise / B2B

| Tipo de cliente | Precio por saga | Volumen esperado año 1 | Revenue anual |
|---|---|---|---|
| Junta de turismo nacional | $10,000 - $15,000 | 2-3 contratos | $20,000 - $45,000 |
| Hotel/resort de lujo | $3,000 - $5,000 | 5-8 contratos | $15,000 - $40,000 |
| Operador turístico | $2,000 - $3,000 | 3-5 contratos | $6,000 - $15,000 |
| Evento corporativo (team building) | $500 - $2,000 | 10-15 eventos | $5,000 - $30,000 |
| Escuela/universidad | $500 - $1,500 | 5-10 contratos | $2,500 - $15,000 |
| **Total B2B estimado año 1** | | | **$48,500 - $145,000** |

### 3.7 Comparación de Revenue Streams por Escala

| Revenue stream | 100 usuarios | 1K usuarios | 10K usuarios | 100K usuarios |
|---|---|---|---|---|
| Ads (free tier) | $41/mes | $412/mes | $4,120/mes | $41,200/mes |
| Premium ($4.99) | $25/mes | $350/mes | $3,996/mes | $49,950/mes |
| Saga Pass ($2.99) | $30/mes | $239/mes | $1,794/mes | $14,950/mes |
| Microtransacciones | $32/mes | $318/mes | $3,180/mes | $31,800/mes |
| B2B/Enterprise | $4,000/mes* | $4,000/mes* | $6,000/mes* | $10,000/mes* |
| **TOTAL** | **$4,128/mes** | **$5,319/mes** | **$19,090/mes** | **$147,900/mes** |

*\*B2B es independiente de la base de usuarios consumer, pero crece con la marca.*

#### 🏆 Revenue stream dominante por fase

| Fase | Usuarios | Revenue stream #1 | % del total |
|---|---|---|---|
| **Pre-lanzamiento** (0-1K) | < 1,000 | **B2B/Enterprise** | ~75% |
| **Crecimiento** (1K-10K) | 1,000-10,000 | **B2B + Premium** | ~55% |
| **Escala** (10K-100K) | 10,000-100,000 | **Premium + Ads** | ~62% |
| **Madurez** (100K+) | 100,000+ | **Premium** | ~34% |

**Insight crítico:** B2B debe ser la prioridad de monetización inmediata. No depende de escala de usuarios y genera revenue desde el día 1.

---

## 4. Análisis de Costos vs Beneficios

### 4.1 Costos de Infraestructura por Escala

#### Google Maps / Street View API

Este es el **costo más crítico** del modelo. Street View Static API cuesta $7 USD por cada 1,000 cargas (panoramas).

| Escala | Cargas SV/mes* | Costo Maps/mes | Costo Maps/año |
|---|---|---|---|
| 100 usuarios | 6,000 | $42 | $504 |
| 1,000 usuarios | 60,000 | $420 | $5,040 |
| 10,000 usuarios | 600,000 | $4,200 | $50,400 |
| 100,000 usuarios | 6,000,000 | $42,000 | $504,000 |

*\*Supuesto: 8 sesiones/mes × ~7.5 cargas de Street View por sesión (movimientos entre panoramas en cada nivel)*

**⚠️ ALERTA:** A 100K usuarios, Google Maps consume $42,000/mes — el 28% del revenue total proyectado. Estrategias de mitigación:

1. **Caché agresivo** de panoramas visitados frecuentemente
2. **Lazy loading** — cargar Street View solo cuando el jugador lo necesita
3. **Negociar descuento por volumen** con Google (programa para startups)
4. **Google for Startups Cloud Credits** — hasta $100K en créditos
5. **Limitar movimientos** por nivel para reducir cargas de panoramas

#### Firebase (Auth + Firestore + Hosting)

| Escala | Plan | Costo estimado/mes |
|---|---|---|
| 100 usuarios | Spark (gratis) | $0 |
| 1,000 usuarios | Blaze (pay-as-go) | $25 |
| 10,000 usuarios | Blaze | $80 |
| 100,000 usuarios | Blaze | $350 |

*Firebase es muy económico para auth + datos básicos. El costo principal es Firestore reads/writes.*

#### Gemini API

| Escala | Llamadas API/mes* | Costo/mes (Gemini Pro) |
|---|---|---|
| 100 usuarios | 2,400 | $0.60 |
| 1,000 usuarios | 24,000 | $6.00 |
| 10,000 usuarios | 240,000 | $60.00 |
| 100,000 usuarios | 2,400,000 | $600.00 |

*\*Supuesto: 3 llamadas por nivel (validación + hints) × 12 niveles × sesiones/mes. Precio: $0.00025/llamada promedio con Gemini 1.5 Flash.*

**Nota:** Gemini 1.5 Flash es extremadamente barato. Incluso a 100K usuarios, el costo es manejable. Se recomienda migrar de `gemini-pro` a `gemini-1.5-flash` para reducir costos 80%.

#### Vercel (Hosting + Edge Functions)

| Escala | Plan | Costo/mes |
|---|---|---|
| 100 usuarios | Hobby (gratis) | $0 |
| 1,000 usuarios | Pro | $20 |
| 10,000 usuarios | Pro | $20 + $40 usage |
| 100,000 usuarios | Enterprise | $150 - $400 |

#### Otros costos operativos

| Concepto | Costo/mes |
|---|---|
| Dominio (.com) | $1 |
| Email (Google Workspace) | $6/usuario admin |
| Analytics (Mixpanel free → Growth) | $0 - $89 |
| Error tracking (Sentry free tier) | $0 - $26 |
| CDN/Media (Cloudflare) | $0 - $20 |
| Legal/Contabilidad | $200 - $500 |

### 4.2 Tabla Consolidada de Costos vs Revenue

| | 100 usuarios | 1K usuarios | 10K usuarios | 100K usuarios |
|---|---|---|---|---|
| **COSTOS** | | | | |
| Google Maps API | $42 | $420 | $4,200 | $42,000 |
| Firebase | $0 | $25 | $80 | $350 |
| Gemini API | $1 | $6 | $60 | $600 |
| Vercel | $0 | $20 | $60 | $300 |
| Otros operativos | $210 | $230 | $340 | $640 |
| Pago ads/afiliados | $0 | $0 | $200 | $2,000 |
| **Total costos/mes** | **$253** | **$701** | **$4,940** | **$45,890** |
| | | | | |
| **REVENUE** | | | | |
| Total revenue/mes | $4,128 | $5,319 | $19,090 | $147,900 |
| | | | | |
| **PROFIT/LOSS** | **+$3,875** | **+$4,618** | **+$14,150** | **+$102,010** |
| **Margen** | **94%** | **87%** | **74%** | **69%** |

*Nota: Los márgenes altos a baja escala dependen enteramente de B2B. Sin B2B, a 100-1K usuarios la operación es negativa.*

### 4.3 Break-Even por Revenue Stream (sin B2B)

| Revenue stream | Costo fijo base/mes | Revenue por usuario/mes | Break-even (usuarios) |
|---|---|---|---|
| Solo Ads | $253 | $0.41 | **617 usuarios** |
| Solo Premium (5%) | $253 | $0.25 | **1,012 usuarios** |
| Solo Saga Pass (6%) | $253 | $0.18 | **1,406 usuarios** |
| Freemium mix (ads+premium+micro) | $253 | $0.88 | **288 usuarios** |
| Freemium mix + B2B ($4K/mes) | $253 | $0.88 | **Rentable desde día 1** |

### 4.4 Unit Economics por Usuario

| Métrica | Estimación | Notas |
|---|---|---|
| **CAC (Costo de Adquisición)** | | |
| — Orgánico/viral | $0.50 | Referidos, redes sociales, PR |
| — Paid (Meta/TikTok Ads) | $2.50 - $5.00 | Gaming casual LATAM |
| — B2B (por usuario derivado) | $0.10 | El cliente B2B trae sus usuarios |
| **ARPU mensual** | $0.88 | Mezcla freemium |
| **Churn mensual estimado** | 15% | Gaming casual típico |
| **Vida promedio del usuario** | 6.7 meses | 1/churn rate |
| **LTV (Lifetime Value)** | $5.87 | ARPU × vida promedio |
| **LTV:CAC ratio** | | |
| — Orgánico | 11.7x | ✅ Excelente |
| — Paid LATAM | 1.6x | ⚠️ Marginal |
| — Paid EEUU/EU | 0.9x | ❌ No rentable sin optimizar |

**Conclusión:** El paid marketing solo es viable en LATAM donde el CAC es bajo. La estrategia debe priorizar crecimiento orgánico y B2B hasta que el LTV mejore con más contenido.

---

## 5. Programa VIP para Creadores de Mapas

### 5.1 Visión

Convertir a los usuarios más comprometidos en **creadores de contenido** que generen sagas para la plataforma, multiplicando el inventario sin costo directo. Inspirado en el modelo de Roblox (creadores ganan revenue share) y Wikipedia (contribución voluntaria con reconocimiento).

### 5.2 Sistema de Tiers

| Tier | Nombre | Requisitos | Beneficios |
|---|---|---|---|
| 🟫 **Tier 1** | **Cartógrafo** | Crear 1 saga publicada con 3.5+ ⭐ promedio | Premium gratis por 1 mes, badge "Cartógrafo" en perfil |
| 🥈 **Tier 2** | **Explorador** | 3+ sagas publicadas con 4.0+ ⭐ promedio, 100+ jugadores totales | Premium gratis permanente, 20% revenue share en Saga Pass, nombre en créditos |
| 🥇 **Tier 3** | **Embajador** | 5+ sagas publicadas con 4.3+ ⭐ promedio, 500+ jugadores totales, 1+ saga "Destacada" | Premium gratis permanente, **30% revenue share**, acceso beta a herramientas, invitación a eventos, saga destacada en homepage |

### 5.3 Modelo de Revenue Sharing

Cuando un usuario compra un **Saga Pass ($2.99)** para una saga creada por un creador VIP:

| Componente | % | Monto |
|---|---|---|
| Plataforma UBEX | 55% | $1.64 |
| Creador | 30% | $0.90 |
| Impuestos/procesamiento de pago | 15% | $0.45 |

**Ejemplo práctico:** Un creador Embajador con 5 sagas populares que generan 200 compras de Saga Pass por mes:
- Revenue del creador: 200 × $0.90 = **$180 USD/mes**
- En República Dominicana, $180/mes es significativo (~25% del salario mínimo)

### 5.4 Herramienta de Creación de Sagas

| Feature | Prioridad | Descripción |
|---|---|---|
| **Editor de waypoints** | P0 | Seleccionar puntos en Google Maps, definir lat/lng del objetivo |
| **Editor de acertijos** | P0 | Texto del acertijo, respuesta correcta, respuestas alternativas aceptables |
| **Generador AI de acertijos** | P1 | Usar Gemini para sugerir acertijos basados en la ubicación y datos de Wikipedia |
| **Preview mode** | P1 | Jugar tu propia saga antes de publicar |
| **Dificultad auto-calculada** | P2 | Basada en distancia entre puntos, oscuridad del acertijo, y datos de completación |
| **Plantillas** | P2 | "Tour histórico", "Ruta gastronómica", "Desafío extremo" |
| **Colaboración** | P3 | Crear sagas entre múltiples creadores |

### 5.5 Control de Calidad

| Etapa | Mecanismo | Criterio |
|---|---|---|
| **Pre-publicación** | Revisión automática | Todos los waypoints tienen cobertura de Street View, acertijos tienen ≥10 caracteres, no contenido ofensivo (AI filter) |
| **Soft launch** | Publicación limitada (50 jugadores) | Saga debe mantener 3.5+ ⭐ y tasa de completación >20% |
| **Publicación completa** | Aprobación manual + datos | Si pasa soft launch, se publica en catálogo completo |
| **Mantenimiento** | Monitoreo continuo | Si cae a <3.0 ⭐ o recibe 3+ reportes, se pausa para revisión |

#### Métricas de calidad de una saga

| Métrica | Peso | Umbral mínimo |
|---|---|---|
| Rating promedio (1-5 ⭐) | 40% | 3.5 |
| Tasa de completación | 25% | 20% |
| Tasa de reporte/queja | 20% | < 5% |
| Originalidad (no duplicado) | 15% | Pasa check automático |

### 5.6 Gamificación para Creadores

| Elemento | Descripción |
|---|---|
| **Leaderboard de creadores** | Ranking mensual por: revenue generado, jugadores atraídos, rating promedio |
| **Badges** | "Primera saga publicada", "100 jugadores", "Rating 4.5+", "Saga del mes", "5 ciudades diferentes" |
| **Reto mensual** | "Crea una saga en [ciudad] este mes" — el ganador recibe $100 + Saga Destacada |
| **Stats dashboard** | Revenue, jugadores, ratings, completación — todo en tiempo real |
| **Newsletter de creadores** | Tips, mejores prácticas, spotlights de creadores exitosos |

### 5.7 Proyección del Programa VIP

| Mes | Creadores activos | Sagas nuevas/mes | Total sagas | Revenue compartido |
|---|---|---|---|---|
| 4 (lanzamiento) | 5 | 5 | 5 | $0 (soft launch) |
| 6 | 15 | 10 | 25 | $200 |
| 9 | 40 | 20 | 80 | $800 |
| 12 | 80 | 30 | 200 | $2,400 |

---

## 6. Proyecciones Financieras (12 Meses)

### 6.1 Supuestos Base

| Parámetro | Valor | Notas |
|---|---|---|
| Usuarios mes 1 | 50 | Beta cerrada, invitación |
| Crecimiento orgánico mensual | 40% | Meses 1-6; 25% meses 7-12 |
| Tasa de conversión free→premium | 0% (M1-3), 3% (M4-6), 7% (M7-12) | Crece con contenido |
| ARPU free (ads) | $0 (M1-3), $0.41 (M4+) | Ads activados mes 4 |
| ARPU premium | $4.99/mes | Sin descuento anual en año 1 |
| Churn mensual premium | 12% | |
| B2B contratos | 0 (M1-3), 1/mes (M4-6), 2/mes (M7-12) | Precio promedio $3,500 |
| Saga Pass adopción | 5% de free users/mes | |
| Microtx ARPU | $0.32/mes | Todos los usuarios |

### 6.2 Proyección Mes a Mes

#### Fase 1: Beta (Meses 1-3) — Validación sin monetización

| | Mes 1 | Mes 2 | Mes 3 |
|---|---|---|---|
| **USUARIOS** | | | |
| Nuevos | 50 | 70 | 98 |
| Total acumulado | 50 | 108 | 185 |
| Activos (MAU) | 50 | 85 | 140 |
| Premium | 0 | 0 | 0 |
| | | | |
| **REVENUE** | | | |
| Ads | $0 | $0 | $0 |
| Premium | $0 | $0 | $0 |
| Saga Pass | $0 | $0 | $0 |
| Microtx | $0 | $0 | $0 |
| B2B | $0 | $0 | $0 |
| **Total Revenue** | **$0** | **$0** | **$0** |
| | | | |
| **COSTOS** | | | |
| Google Maps API | $15 | $26 | $42 |
| Firebase | $0 | $0 | $0 |
| Gemini API | $0 | $1 | $1 |
| Vercel | $0 | $0 | $0 |
| Operativos | $210 | $210 | $210 |
| Marketing | $100 | $100 | $150 |
| Desarrollo (freelance) | $2,000 | $2,000 | $2,000 |
| **Total Costos** | **$2,325** | **$2,337** | **$2,403** |
| | | | |
| **P&L** | **-$2,325** | **-$2,337** | **-$2,403** |
| **P&L Acumulado** | **-$2,325** | **-$4,662** | **-$7,065** |

#### Fase 2: Lanzamiento Freemium (Meses 4-6) — Primeros ingresos

| | Mes 4 | Mes 5 | Mes 6 |
|---|---|---|---|
| **USUARIOS** | | | |
| Nuevos | 137 | 192 | 269 |
| Total acumulado | 322 | 514 | 783 |
| MAU | 230 | 350 | 520 |
| Free activos | 223 | 340 | 504 |
| Premium | 7 | 11 | 16 |
| | | | |
| **REVENUE** | | | |
| Ads | $91 | $139 | $207 |
| Premium ($4.99) | $35 | $53 | $80 |
| Saga Pass | $33 | $51 | $75 |
| Microtx | $74 | $112 | $166 |
| B2B | $3,500 | $3,500 | $3,500 |
| **Total Revenue** | **$3,733** | **$3,855** | **$4,028** |
| | | | |
| **COSTOS** | | | |
| Google Maps API | $69 | $105 | $156 |
| Firebase | $10 | $15 | $20 |
| Gemini API | $2 | $3 | $4 |
| Vercel | $20 | $20 | $20 |
| Operativos | $230 | $230 | $250 |
| Marketing | $300 | $400 | $500 |
| Desarrollo | $2,000 | $2,000 | $1,500 |
| Ads payout (plataforma) | $0 | $0 | $0 |
| Prize pool (1 saga/mes) | $0 | $500 | $500 |
| **Total Costos** | **$2,631** | **$3,273** | **$2,950** |
| | | | |
| **P&L** | **+$1,102** | **+$582** | **+$1,078** |
| **P&L Acumulado** | **-$5,963** | **-$5,381** | **-$4,303** |

#### Fase 3: Crecimiento (Meses 7-12) — Escala y rentabilidad

| | Mes 7 | Mes 8 | Mes 9 | Mes 10 | Mes 11 | Mes 12 |
|---|---|---|---|---|---|---|
| **USUARIOS** | | | | | | |
| Nuevos | 336 | 420 | 525 | 656 | 820 | 1,025 |
| Total acumulado | 1,119 | 1,539 | 2,064 | 2,720 | 3,540 | 4,565 |
| MAU | 700 | 920 | 1,200 | 1,550 | 2,000 | 2,600 |
| Free activos | 651 | 855 | 1,116 | 1,442 | 1,860 | 2,418 |
| Premium | 49 | 64 | 84 | 109 | 140 | 182 |
| | | | | | | |
| **REVENUE** | | | | | | |
| Ads | $267 | $351 | $458 | $591 | $763 | $992 |
| Premium | $245 | $322 | $419 | $542 | $699 | $908 |
| Saga Pass | $97 | $128 | $167 | $216 | $278 | $362 |
| Microtx | $224 | $294 | $384 | $496 | $640 | $832 |
| B2B | $7,000 | $7,000 | $7,000 | $7,000 | $7,000 | $7,000 |
| Creator rev share | -$40 | -$60 | -$90 | -$120 | -$160 | -$200 |
| **Total Revenue** | **$7,793** | **$8,035** | **$8,338** | **$8,725** | **$9,220** | **$9,894** |
| | | | | | | |
| **COSTOS** | | | | | | |
| Google Maps API | $210 | $276 | $360 | $465 | $600 | $780 |
| Firebase | $25 | $30 | $35 | $40 | $45 | $50 |
| Gemini API | $5 | $7 | $9 | $12 | $15 | $20 |
| Vercel | $20 | $20 | $20 | $20 | $20 | $20 |
| Operativos | $300 | $300 | $350 | $350 | $400 | $400 |
| Marketing | $800 | $1,000 | $1,200 | $1,500 | $1,800 | $2,000 |
| Desarrollo | $1,500 | $1,500 | $1,500 | $1,500 | $1,500 | $1,500 |
| Prize pool | $500 | $500 | $1,000 | $1,000 | $1,000 | $1,000 |
| **Total Costos** | **$3,360** | **$3,633** | **$4,474** | **$4,887** | **$5,380** | **$5,770** |
| | | | | | | |
| **P&L** | **+$4,433** | **+$4,402** | **+$3,864** | **+$3,838** | **+$3,840** | **+$4,124** |
| **P&L Acumulado** | **+$130** | **+$4,532** | **+$8,396** | **+$12,234** | **+$16,074** | **+$20,198** |

### 6.3 Resumen Anual

| Métrica | Valor |
|---|---|
| **Revenue total año 1** | **$63,621** |
| **Costos totales año 1** | **$43,423** |
| **Profit neto año 1** | **+$20,198** |
| **Margen neto** | **31.7%** |
| **Break-even** | **Mes 7** |
| **Usuarios totales al cierre** | **4,565** |
| **MAU al cierre** | **2,600** |
| **Premium suscriptores al cierre** | **182** |
| **MRR al cierre (mes 12)** | **$9,894** |
| **ARR proyectado** | **$118,728** |

### 6.4 Distribución de Revenue Año 1

| Revenue stream | Total año 1 | % del total |
|---|---|---|
| B2B/Enterprise | $52,500 | 82.5% |
| Ads | $3,859 | 6.1% |
| Premium | $3,303 | 5.2% |
| Microtx | $3,222 | 5.1% |
| Saga Pass | $1,407 | 2.2% |
| Creator payouts | -$670 | -1.1% |
| **Total** | **$63,621** | **100%** |

**Conclusión clara:** B2B domina el revenue del año 1. El modelo B2C (ads + premium + micro) se vuelve significativo solo cuando la base supera los 5,000+ MAU. La estrategia debe ser **B2B-first**.

---

## 7. Recomendaciones al CEO

### 🏆 Top 3 Prioridades para hacer UBEX rentable

#### Prioridad #1: Cerrar 2-3 contratos B2B antes del mes 4

**Por qué:** B2B representa el 82.5% del revenue proyectado del año 1. Un solo contrato con una junta de turismo ($3,500-$10,000) cubre meses de costos operativos.

**Acción inmediata:**
1. Preparar un **pitch deck de 10 slides** enfocado en turismo digital
2. Contactar a **MITUR** (Ministerio de Turismo de RD) y **OPETUR** (Operadores Turísticos de RD)
3. Ofrecer la **primera saga gratis** como caso de estudio (Zona Colonial ya existe)
4. Contactar 5 hoteles all-inclusive de Punta Cana con propuesta de saga personalizada
5. Meta: **2 contratos firmados para el mes 4** = $7,000/mes garantizados

**Métrica de éxito:** ≥$7,000 MRR de B2B para mes 4.

---

#### Prioridad #2: Completar el MVP técnico (meses 1-3)

**Por qué:** Sin backend, autenticación, y checkout, no se puede cobrar a nadie. El prototipo actual es una demo, no un producto.

**Roadmap técnico mínimo:**

| Semana | Entregable | Esfuerzo |
|---|---|---|
| 1-2 | Firebase Auth (email + Google) | 20 hrs |
| 3-4 | Firestore: persistencia de progreso, perfiles, leaderboards | 30 hrs |
| 5-6 | PayPal checkout funcional (Premium + Saga Pass) | 25 hrs |
| 7-8 | Sistema de ads (Google AdSense/AdMob web) | 15 hrs |
| 9-10 | 3 sagas adicionales (contenido) | 20 hrs |
| 11-12 | Testing, bug fixes, soft launch | 20 hrs |

**Costo estimado:** $6,000 (freelance) o $0 si el CEO desarrolla (but tiempo = 130 hrs).

**Métrica de éxito:** Checkout funcional + 4 sagas jugables para mes 3.

---

#### Prioridad #3: Construir el motor de contenido (meses 4-6)

**Por qué:** 1 saga = 30 minutos de juego. Sin contenido nuevo, los usuarios se van en la primera sesión. El programa VIP de creadores es la solución escalable.

**Plan:**
1. Mes 4: Lanzar editor de sagas básico (waypoints + acertijos)
2. Mes 5: Reclutar 5 beta creators (amigos, micro-influencers de viajes en RD)
3. Mes 6: Lanzar programa VIP público con revenue sharing

**Métrica de éxito:** ≥20 sagas disponibles para mes 6.

---

### 📋 Orden de ejecución completo

| Orden | Acción | Mes | Costo | Impacto esperado |
|---|---|---|---|---|
| 1 | Pitch deck B2B para turismo | 1 | $0 | Pipeline de ventas |
| 2 | Firebase Auth + Firestore | 1-2 | $2,000 | Backend funcional |
| 3 | Contactar MITUR + 5 hoteles | 2 | $0 | 2+ leads B2B |
| 4 | PayPal checkout | 2-3 | $1,500 | Puede cobrar |
| 5 | 3 sagas nuevas (manual) | 2-3 | $500 | Más contenido |
| 6 | Activar ads (AdSense) | 4 | $0 | Revenue pasivo |
| 7 | Cerrar primer contrato B2B | 4 | $0 | $3,500+ MRR |
| 8 | Editor de sagas v1 | 4-5 | $2,000 | UGC pipeline |
| 9 | Programa VIP creators | 6 | $0 | Contenido escalable |
| 10 | Lanzamiento Premium tier | 6 | $0 | Monetización B2C |
| 11 | Campaña marketing LATAM | 7 | $800 | Crecimiento usuarios |
| 12 | Second contract cycle B2B | 7-8 | $0 | $7,000+ MRR |

---

### ⚠️ Riesgos a Mitigar

| Riesgo | Probabilidad | Impacto | Mitigación |
|---|---|---|---|
| **Google Maps API demasiado caro a escala** | Alta | Crítico | Caché, lazy loading, negociar con Google, investigar Mapillary como backup |
| **Regulación de premios en efectivo** | Media | Alto | Consultar abogado en RD + EEUU antes del mes 4. Considerar "premios en créditos" como alternativa |
| **Baja retención (falta de contenido)** | Alta | Alto | Priorizar editor de sagas y programa VIP. Meta: 5+ sagas nuevas/mes para mes 6 |
| **B2B tarda más de lo esperado** | Media | Alto | Tener runway de 6 meses sin B2B ($15K). Ofrecer piloto gratuito para acelerar |
| **Trampas/fraude en competencias** | Media | Medio | Implementar verificación server-side de respuestas + rate limiting + detección de anomalías |
| **Burnout del equipo (equipo pequeño)** | Alta | Medio | Automatizar lo posible, usar AI para generación de contenido, no intentar todo a la vez |

---

### 🎯 Quick Wins vs Apuestas a Largo Plazo

#### Quick Wins (0-3 meses, bajo costo, impacto inmediato)

| Quick Win | Esfuerzo | Impacto |
|---|---|---|
| Usar la saga Zona Colonial como demo B2B para vender a turismo | 1 día (pitch deck) | Primer revenue |
| Agregar Google AdSense al sitio actual (aunque sea solo la landing) | 2 horas | Revenue mínimo pero prueba el modelo de ads |
| Publicar gameplay en TikTok/Reels (screen recording de la demo) | 1 día | Viralidad potencial, 0 costo |
| Aplicar a Google for Startups Cloud Credits ($100K) | 3 horas | Elimina costo de Maps API por 1-2 años |
| Migrar Gemini de `gemini-pro` a `gemini-1.5-flash` | 30 minutos | Reduce costo de AI 80% |
| Eliminar dependencias no usadas (Three.js, React Three Fiber) | 1 hora | Reduce bundle size ~40% |

#### Apuestas a Largo Plazo (6-12 meses, inversión significativa)

| Apuesta | Inversión | Payoff potencial |
|---|---|---|
| Marketplace de sagas con revenue sharing | $5,000-$10,000 dev | Contenido infinito sin costo, comunidad de creadores |
| Modo multiplayer en tiempo real | $10,000-$20,000 dev | Diferenciación masiva, retención 3x |
| API pública para integración en apps de turismo | $5,000 dev | Canal B2B escalable |
| Expansión a 10 ciudades de LATAM | $2,000 contenido | Mercado addressable 10x |
| Torneos patrocinados por marcas | $0 (patrocinador paga) | Revenue de alto margen + PR |

---

### 💡 Recomendación Final

> **UBEX tiene un concepto fuerte y un prototipo convincente, pero debe resistir la tentación de construir para 100K usuarios cuando tiene 0.**
>
> **La estrategia óptima es:**
> 1. **Vender B2B primero** — generar revenue con lo que ya existe
> 2. **Construir lo mínimo** — auth, checkout, 3 sagas más
> 3. **Escalar contenido** — el editor de sagas y programa VIP son el motor de crecimiento
>
> **El error más peligroso sería gastar 6 meses perfeccionando features antes de tener un solo cliente pagando.**
>
> Con 2 contratos B2B cerrados y un MVP funcional, UBEX puede ser rentable desde el mes 4 y alcanzar $10K MRR para el mes 12 — sin necesidad de inversión externa.

---

*Documento preparado como análisis estratégico para UBEX. Las proyecciones se basan en benchmarks de la industria gaming/turismo y supuestos conservadores. Se recomienda actualizar con datos reales tras los primeros 90 días de operación.*
