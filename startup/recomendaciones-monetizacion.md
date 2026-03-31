# Recomendaciones de Monetización — UBEX

> Documento ejecutivo para el CEO | Última actualización: Marzo 2026

---

## 1. Resumen Ejecutivo

**Estado actual:** MVP funcional en ubex.vercel.app con 12 niveles jugables en la Zona Colonial de Santo Domingo. Auth, admin panel, game API, y leaderboard implementados. Sin ingresos.

**Oportunidad:** El turismo dominicano genera $8.5B/año con 7M+ visitantes. No existe un competidor directo que combine exploración urbana + gamificación + Street View en el Caribe. UBEX puede capturar un nicho entre GeoGuessr (entretenimiento), Pokémon GO (exploración) y tours guiados tradicionales.

**Ruta recomendada:** Freemium con Saga Pass → B2B turismo → Suscripciones → White-label.

### 3 Decisiones Inmediatas

1. **Implementar Saga Pass ($2.99)** como primer modelo de ingreso — mínimo esfuerzo técnico, valida disposición a pagar.
2. **Contactar MITUR y 3 hoteles** para pilotos B2B antes de invertir en ads.
3. **Configurar Google Maps API billing alerts** — es el costo variable más alto y puede escalar sin control.

---

## 2. Modelos de Monetización Evaluados

### Ranking por Factibilidad

| # | Modelo | Ingreso Est./Mes | Esfuerzo Dev | Tiempo a Revenue | Recomendación |
|---|--------|------------------|-------------|-------------------|---------------|
| 1 | **Saga Pass (à la carte)** | $500-$3K | Bajo (1-2 sem) | Inmediato | ✅ Implementar YA |
| 2 | **B2B Tourism Campaigns** | $5K-$20K | Medio (3-4 sem) | 2-3 meses | ✅ Prioridad alta |
| 3 | **Freemium + Ads** | $200-$1K | Bajo (1 sem) | 1 mes | ✅ Quick win |
| 4 | **Suscripción Premium** | $1K-$8K | Medio (2-3 sem) | 3-4 meses | ⏳ Fase 2 |
| 5 | **Event/Activation Packages** | $2K-$8K | Bajo | 1-2 meses | ✅ Paralelo a B2B |
| 6 | **Brand Sponsorship** | $3K-$15K | Bajo | 3-6 meses | ⏳ Necesita base de usuarios |
| 7 | **VIP Creator Program** | $500-$2K | Medio (3-4 sem) | 4-6 meses | ⏳ Fase 2 |
| 8 | **White-Label Platform** | $10K-$50K | Alto (2-3 meses) | 6-12 meses | ⏳ Fase 3 |
| 9 | **NFT/Coleccionables** | $100-$500 | Medio | 6+ meses | ❌ No prioritario |

---

### Detalle por Modelo

#### a) Saga Pass — À la Carte ($1.99-$2.99)

**Descripción:** Sagas individuales premium que se compran una vez. La saga demo (Zona Colonial) es gratuita; sagas adicionales requieren pago.

| | |
|---|---|
| **Pros** | Bajo fricción, precio accesible en RD, no requiere compromiso mensual, fácil de entender |
| **Contras** | Ingreso no recurrente, cada venta requiere contenido nuevo |
| **Revenue estimado** | 200 ventas/mes × $2.99 = $598/mes (conservador) |
| **Esfuerzo** | Integrar Stripe/PayPal (1-2 semanas), crear paywall en UI |
| **Precio recomendado** | $2.99 USD (equivale a ~RD$175, precio de un café premium) |

#### b) B2B Tourism Campaigns ($5K-$50K)

**Descripción:** Sagas personalizadas para juntas de turismo, hoteles, y municipalidades. "Explora nuestro destino jugando."

| | |
|---|---|
| **Pros** | Ticket alto, presupuestos de marketing existentes, valida producto con clientes sofisticados |
| **Contras** | Ciclo de venta largo (2-4 meses), requiere personalización, dependencia de pocos clientes |
| **Revenue estimado** | 1 cliente/mes × $8K promedio = $8K/mes |
| **Esfuerzo** | Crear deck de ventas, demo personalizable, sistema de analytics por campaña |
| **Targets inmediatos** | MITUR, Grupo Puntacana, hotels Zona Colonial, Ayuntamiento DN |

#### c) Freemium + Ads (Google AdMob)

**Descripción:** Anuncios interstitiales entre niveles para usuarios free. Sin ads para usuarios premium/de pago.

| | |
|---|---|
| **Pros** | Monetiza desde el día 1, cero fricción de pago, incentiva upgrade a premium |
| **Contras** | CPM bajo en RD ($1-3 vs $8-15 en USA), puede degradar UX, requiere volumen |
| **Revenue estimado** | 1,000 DAU × 3 ads/sesión × $2 eCPM = $180/mes |
| **Esfuerzo** | Integrar AdMob/AdSense (1 semana) |
| **Nota** | Solo vale la pena con >500 DAU. Antes de eso, degrada la experiencia sin generar ingreso significativo. |

#### d) Suscripción UBEX Premium ($4.99/mes)

**Descripción:** Sin ads, pistas ilimitadas, sagas exclusivas, acceso anticipado, badges premium.

| | |
|---|---|
| **Pros** | Ingreso recurrente (MRR), predecible, alto LTV |
| **Contras** | Requiere suficiente contenido premium para justificar precio mensual, competir con Netflix/Spotify por presupuesto del usuario |
| **Revenue estimado** | 500 suscriptores × $4.99 × 70% (después de churn) = $1,747/mes |
| **Esfuerzo** | Sistema de suscripción, gestión de entitlements, cancelación, billing |
| **Precio** | $4.99 USD (entre Spotify RD $5.99 y YouTube Premium $6.99) |

#### e) Event/Activation Packages ($500-$2K)

**Descripción:** Team building corporativo, excursiones escolares, activaciones de marca, bodas/despedidas.

| | |
|---|---|
| **Pros** | Ticket decente, cero CAC (venta directa), diversifica fuera de digital |
| **Contras** | No escala fácilmente, requiere operaciones presenciales |
| **Revenue estimado** | 4 eventos/mes × $1K = $4K/mes |
| **Esfuerzo** | Landing page, formulario de contacto, paquetes predefinidos |

#### f) Brand Sponsorship

**Descripción:** Niveles o sagas patrocinadas. Ej: "Saga Brugal — Descubre la Ruta del Ron" o "Saga Claro — Conecta con la Ciudad."

| | |
|---|---|
| **Pros** | Ticket alto ($5K-$20K), el sponsor paga por el contenido |
| **Contras** | Requiere base de usuarios demostrable (>5K MAU mínimo), ciclo de venta largo |
| **Revenue estimado** | 1-2 sponsors/trimestre × $10K = $3.3K/mes |

#### g) VIP Creator Program

**Descripción:** Map creators certificados ganan % de ventas de sus sagas. Fomenta oferta de contenido.

| | |
|---|---|
| **Pros** | Escala contenido sin equipo interno, crea comunidad, moat competitivo |
| **Contras** | Requiere herramientas de creación robustas, QA de contenido, sistema de pagos |
| **Revenue estimado** | Indirecto — genera contenido que produce ingresos via Saga Pass |
| **Rev share recomendado** | 70% creador / 30% UBEX |

#### h) White-Label Platform ($10K-$50K por ciudad)

**Descripción:** Licenciar el motor UBEX a otras ciudades, tourism boards internacionales, o empresas de entretenimiento.

| | |
|---|---|
| **Pros** | Ticket muy alto, escala internacionalmente, valida como plataforma |
| **Contras** | Requiere producto maduro, soporte multi-tenant, documentación |
| **Revenue estimado** | 1 licencia/trimestre × $25K = $8.3K/mes |

---

## 3. Estrategia de Monetización por Fases

### Fase 1: Validación (Meses 1-3)
- ✅ Saga demo gratuita (ya existe)
- 🔨 Implementar **Saga Pass** ($2.99) con Stripe
- 🔨 Crear 3 sagas premium adicionales (Punta Cana, Santiago, Puerto Plata)
- 🔨 Landing de **eventos/activaciones** con formulario
- 📊 Métricas: tasa de conversión free→paid, willingness to pay

### Fase 2: Crecimiento (Meses 4-6)
- 🔨 Activar **ads** para usuarios free (solo si >500 DAU)
- 🔨 Lanzar **suscripción Premium** ($4.99/mo)
- 🔨 Cerrar primer cliente **B2B** (MITUR o hotel)
- 🔨 Iniciar **VIP Creator** beta (5-10 creadores invitados)
- 📊 Métricas: MRR, ARPU, retention por cohorte

### Fase 3: Escalar (Meses 7-12)
- 🔨 Expandir **B2B** (3-5 clientes activos)
- 🔨 Lanzar **sponsorships** con marcas dominicanas
- 🔨 Abrir Creator Program al público
- 🔨 Primera saga internacional (San Juan PR, Cartagena, La Habana)
- 📊 Métricas: revenue por canal, CAC/LTV ratio, NRR

### Fase 4: Diversificar (Año 2)
- 🔨 **White-label** para tourism boards internacionales
- 🔨 Marketplace de sagas (creadores venden directamente)
- 🔨 Expansión a 10+ ciudades
- 🔨 App nativa (si >10K MAU justifica la inversión)

---

## 4. Análisis de Precios para República Dominicana

### Contexto del Mercado

| Indicador | Valor |
|-----------|-------|
| PIB per cápita | ~$10,700 USD (2025) |
| Penetración smartphone | 78% |
| Usuarios internet | 8.5M (~77%) |
| Gasto digital promedio/mes | $15-30 USD en suscripciones |
| Moneda local | 1 USD ≈ RD$58 |

### Apps Comparables (Precios en RD)

| App | Precio/Mes | Contexto |
|-----|-----------|----------|
| Spotify | $5.99 USD | Audio streaming, uso diario |
| Netflix (básico) | $6.99 USD | Video streaming, uso diario |
| YouTube Premium | $6.99 USD | Video + music, uso diario |
| Disney+ | $7.99 USD | Video streaming |
| Duolingo Plus | $6.99 USD | Educación gamificada |

### Precios Recomendados UBEX

| Producto | Precio | Justificación |
|----------|--------|---------------|
| **Saga Pass** | $2.99 USD | Precio de impulso. Equivale a RD$175 (un café premium). Bajo compromiso. |
| **Premium mensual** | $4.99 USD | Debajo de Spotify/Netflix. Justificable si hay 2+ sagas nuevas/mes. |
| **Premium anual** | $39.99 USD | ~$3.33/mes. 33% descuento incentiva compromiso anual. |
| **Bundle 3 sagas** | $6.99 USD | Ahorro vs. comprar individualmente ($8.97). Aumenta ticket promedio. |

### Sensibilidad al Precio
- **$0.99-$1.99**: Compra impulsiva, pero margen bajo. Reservar para promociones.
- **$2.99**: Sweet spot — accesible para clase media dominicana, suficiente margen.
- **$4.99**: Requiere percepción de valor continuo. Solo para suscripción.
- **>$6.99**: Demasiado para el mercado local. Solo viable para turistas o B2B.

---

## 5. Proyección Financiera — 12 Meses

### Escenario Conservador

| Mes | MAU | Saga Pass | Premium | B2B | Ads | Total Revenue | Costos | Net |
|-----|-----|-----------|---------|-----|-----|--------------|--------|-----|
| 1 | 200 | $150 | — | — | — | $150 | $80 | $70 |
| 2 | 400 | $300 | — | — | — | $300 | $120 | $180 |
| 3 | 700 | $450 | $100 | — | — | $550 | $180 | $370 |
| 4 | 1,000 | $600 | $250 | — | $50 | $900 | $250 | $650 |
| 5 | 1,500 | $750 | $500 | — | $90 | $1,340 | $350 | $990 |
| 6 | 2,000 | $900 | $750 | $5,000 | $120 | $6,770 | $450 | $6,320 |
| 7 | 2,800 | $1,100 | $1,000 | $5,000 | $170 | $7,270 | $550 | $6,720 |
| 8 | 3,500 | $1,300 | $1,250 | $8,000 | $210 | $10,760 | $650 | $10,110 |
| 9 | 4,500 | $1,500 | $1,500 | $8,000 | $270 | $11,270 | $780 | $10,490 |
| 10 | 5,500 | $1,800 | $2,000 | $10,000 | $330 | $14,130 | $900 | $13,230 |
| 11 | 6,500 | $2,000 | $2,500 | $10,000 | $390 | $14,890 | $1,050 | $13,840 |
| 12 | 8,000 | $2,400 | $3,000 | $12,000 | $480 | $17,880 | $1,200 | $16,680 |

**Totales Año 1 (Conservador):** Revenue ~$86K, Costos ~$6.5K, Net ~$79.5K

### Escenario Base

Multiplica MAU ×1.5, conversiones ×1.3, B2B inicia en mes 4.
**Revenue Año 1:** ~$130K

### Escenario Optimista

Multiplica MAU ×2.5, conversiones ×1.5, B2B inicia en mes 3 con 2 clientes.
**Revenue Año 1:** ~$220K

---

## 6. Costos Operativos Detallados

### Infraestructura

| Servicio | Free Tier | Trigger para Pagar | Costo Pro |
|----------|-----------|---------------------|-----------|
| **Vercel** | 100GB bandwidth, serverless | >100K pageviews/mes | $20/mes |
| **Supabase** | 500MB DB, 50K MAU, 2GB storage | >50K auth users o >500MB | $25/mes |
| **Dominio** | ubex.vercel.app (gratis) | Custom domain | $12/año |
| **Email (Resend)** | 100 emails/día gratis | >3K emails/mes | $20/mes |

### Google Maps API — EL COSTO CRÍTICO

| API | Precio | Uso por Saga (12 niveles) | Costo/Usuario/Saga |
|-----|--------|--------------------------|---------------------|
| **Maps JavaScript** | $7.00/1,000 loads | 1 load | $0.007 |
| **Street View Static** | $7.00/1,000 panoramas | ~24 panoramas (2 por nivel) | $0.168 |
| **Street View Dynamic** | $14.00/1,000 sessions | ~12 sessions | $0.168 |
| **Geocoding** | $5.00/1,000 requests | ~2 requests | $0.010 |

**Costo estimado por usuario por saga: ~$0.35**

| MAU | Sagas/User/Mes | Maps Cost/Mes | % de Revenue |
|-----|---------------|---------------|-------------|
| 500 | 1.5 | $263 | Alto (>50%) |
| 2,000 | 1.5 | $1,050 | Moderado (~15%) |
| 5,000 | 1.5 | $2,625 | Aceptable (~18%) |
| 10,000 | 1.5 | $5,250 | Necesita optimización |

**Mitigación de costos Maps:**
- Google ofrece $200/mes de crédito gratis = ~570 usuarios gratis
- Cachear panoramas en el cliente (reduce re-fetches)
- Limitar intentos por nivel (evita usuarios que recorren todo el mapa)
- Street View Static Image API es 50% más barato que Dynamic
- Negociar con Google para programas de startups

### Proyección de Costos Totales

| Mes | Vercel | Supabase | Maps API | Email | Otros | Total |
|-----|--------|----------|----------|-------|-------|-------|
| 1-3 | $0 | $0 | $50 | $0 | $30 | $80 |
| 4-6 | $0 | $0 | $200 | $0 | $50 | $250-$450 |
| 7-9 | $20 | $25 | $500 | $20 | $85 | $650-$780 |
| 10-12 | $20 | $25 | $800 | $20 | $85 | $950-$1,200 |

---

## 7. Decisiones Inmediatas para el CEO

### Decisión 1: Primer modelo de ingreso

| Opción | Descripción |
|--------|-------------|
| **A) Saga Pass** | Cobra $2.99 por saga premium. Rápido de implementar (Stripe checkout). |
| **B) Suscripción** | $4.99/mes todo incluido. Más complejo, requiere más contenido. |
| **C) Solo B2B** | Enfócate en vender a tourism boards. Mayor ticket, ciclo más largo. |

**→ Recomendación: A** — Saga Pass primero. Valida disposición a pagar con mínimo esfuerzo. Agrega suscripción cuando haya 5+ sagas.

### Decisión 2: Ads — ¿cuándo activar?

| Opción | Descripción |
|--------|-------------|
| **A) Ahora** | Monetiza desde el día 1, aunque genere poco. |
| **B) Con >500 DAU** | Espera a tener volumen para que valga la pena. |
| **C) Nunca** | UX premium, sin ads. Cobra solo por contenido. |

**→ Recomendación: B** — Los ads con <500 DAU generan <$50/mes y degradan la experiencia. No vale la pena arruinar la primera impresión.

### Decisión 3: Contenido — ¿quién crea sagas?

| Opción | Descripción |
|--------|-------------|
| **A) Solo equipo interno** | Control de calidad, pero no escala. |
| **B) Creators invitados** | 5-10 creadores selectos con QA manual. |
| **C) Abierto a todos** | Marketplace. Escala pero requiere moderación robusta. |

**→ Recomendación: A → B** — Empieza interno (3-5 sagas). Luego invita creadores selectos con rev share 70/30.

### Decisión 4: B2B — ¿cuándo empezar?

| Opción | Descripción |
|--------|-------------|
| **A) Inmediatamente** | Usa el MVP como demo. "Imagina esto para tu hotel/destino." |
| **B) Con más producto** | Espera a tener analytics, customización, y multi-saga. |
| **C) Contratar vendedor** | Dedica a alguien 100% a ventas B2B. |

**→ Recomendación: A** — El MVP actual ES el demo. Contacta 5 hoteles de Zona Colonial y MITUR esta semana. No necesitas producto perfecto para validar demanda B2B.

### Decisión 5: Google Maps costs — ¿cómo controlar?

| Opción | Descripción |
|--------|-------------|
| **A) Límite de uso** | Max 3 sagas/día gratis, luego requiere pago. |
| **B) Optimización técnica** | Cacheo agresivo, Street View Static en vez de Dynamic. |
| **C) Ambas** | Límite + optimización. |

**→ Recomendación: C** — Implementa billing alerts ($50, $100, $200). Cambia a Static Street View donde sea posible. Limita free tier a 2 sagas/día.

### Decisión 6: ¿Cuándo contratar?

| Opción | Descripción |
|--------|-------------|
| **A) Ahora** | Content creator para sagas ($500-$1K/mes freelance). |
| **B) Con $5K MRR** | Primer hire full-time (dev o content). |
| **C) Con primer B2B** | Usa revenue B2B para fondear equipo. |

**→ Recomendación: C** — Primer ingreso B2B ($5K-$10K) fondea un content creator freelance para sagas y un dev part-time para features.

### Decisión 7: ¿Buscar inversión?

| Opción | Descripción |
|--------|-------------|
| **A) Bootstrapped** | Crece orgánicamente con revenue propio. |
| **B) Pre-seed ($50K-$100K)** | Acelera desarrollo y contenido. |
| **C) Esperar tracción** | Consigue 5K MAU y $10K MRR antes de levantar. |

**→ Recomendación: A → C** — Bootstrap hasta tener métricas reales. Con 5K+ MAU y $10K+ MRR tienes una historia convincente para levantar pre-seed a mejor valuación.

---

## Apéndice: Métricas a Monitorear

| Métrica | Fórmula | Target Mes 6 |
|---------|---------|-------------|
| **MAU** | Usuarios únicos activos/mes | 2,000 |
| **Tasa de activación** | Usuarios que completan nivel 1 / registros | >60% |
| **Tasa de completación** | Usuarios que completan saga / que empiezan | >25% |
| **Conversión free→paid** | Compradores / MAU | >3% |
| **ARPU** | Revenue total / MAU | $1.50 |
| **CAC** | Gasto marketing / nuevos usuarios | <$2.00 |
| **LTV** | ARPU × meses retención promedio | >$12 |
| **LTV/CAC** | LTV / CAC | >3x |
| **Maps cost ratio** | Maps API cost / Revenue | <25% |
| **D7 Retention** | Usuarios que vuelven día 7 / nuevos | >20% |
