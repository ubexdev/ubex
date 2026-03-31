# 📱 Análisis de Viabilidad — App Móvil UBEX

> **Fecha:** Julio 2025
> **Autor:** Equipo técnico UBEX
> **Versión:** 1.0

---

## 📋 Resumen ejecutivo

UBEX es un juego de exploración geográfica tipo "búsqueda del tesoro" construido con **Next.js 16**, **Google Street View**, **Firebase** y **Gemini AI**. El CEO quiere saber si es viable lanzar una app móvil para iPhone y Android.

**Respuesta corta:** Sí, pero con una estrategia por fases que maximice el retorno con inversión mínima.

**Recomendación:** No construir una app nativa desde cero. En su lugar, seguir un camino progresivo:

| Fase | Estrategia | Costo | Tiempo | Impacto |
|------|-----------|-------|--------|---------|
| **Fase 1** | Optimización mobile-first + PWA | $0 | 1-2 semanas | ⭐⭐⭐⭐ |
| **Fase 2** | Wrapper con Capacitor (App Store) | ~$124 USD | 2-3 semanas | ⭐⭐⭐⭐⭐ |
| **Fase 3** | React Native (si hay tracción) | $5,000-15,000 | 2-3 meses | ⭐⭐⭐⭐⭐ |

---

## 🔍 Estado actual del proyecto

### Stack tecnológico

| Tecnología | Versión | Relevancia móvil |
|-----------|---------|-------------------|
| Next.js | 16.2.1 | ✅ Soporta PWA y SSR |
| React | 19.2.4 | ✅ Base para React Native |
| Google Maps JS API | via `@googlemaps/js-api-loader` | ⚠️ Solo web, no nativo |
| Firebase | 12.11.0 (Auth + Firestore + Realtime DB) | ✅ SDK nativo disponible |
| Gemini AI | `@google/generative-ai` 0.24.1 | ✅ API REST, funciona en cualquier plataforma |
| Three.js | 0.183.2 (con React Three Fiber) | ⚠️ WebGL, no trivial en nativo |
| Tailwind CSS | v4 | ✅ Funciona en PWA/Capacitor |
| Zustand | 5.0.12 | ✅ Funciona en React Native |
| PayPal | `@paypal/react-paypal-js` 9.1.0 | ⚠️ Necesita SDK nativo en apps |

### Análisis del código actual

**Componente clave:** `src/components/maps/StreetViewExplorer.tsx`
- Usa `google.maps.StreetViewPanorama` directamente
- Busca panoramas en radio de 200m con `StreetViewService`
- Emite posición del jugador via callback `onPositionChange(lat, lng)`
- Fuente: `StreetViewSource.OUTDOOR`, preferencia: `NEAREST`

**Página de juego:** `src/app/play/page.tsx`
- 3 estados: `intro` → `playing` → `completed`
- Sidebar colapsable de 380px (ya tiene toggle móvil en líneas 628-652)
- Cálculo de distancia al objetivo integrado
- Modo explorador requiere estar a <100m para responder

**Problemas móviles actuales:**
- ❌ No hay `manifest.json` ni service worker
- ❌ Sin meta tags de viewport optimizados para móvil
- ❌ CSS mayormente inline (no usa breakpoints de Tailwind `sm:`, `md:`, `lg:`)
- ❌ Sidebar usa ancho fijo de 380px (no responsive)
- ❌ Sin soporte para safe areas (notch / Dynamic Island)
- ⚠️ Three.js puede ser pesado en móviles de gama baja
- ✅ Ya usa `100dvh` (buena práctica móvil)
- ✅ Ya usa `clamp()` para tipografía fluida
- ✅ Ya tiene botón de toggle para sidebar en móvil

---

## 📊 Comparativa de opciones

### Tabla resumen

| Criterio | PWA | Capacitor | React Native | Flutter |
|----------|-----|-----------|-------------|---------|
| **Costo desarrollo** | $0 | ~$124 | $5,000-15,000 | $10,000-20,000 |
| **Tiempo** | 1-2 semanas | 2-3 semanas | 2-3 meses | 3-4 meses |
| **Esfuerzo** | ⭐⭐ (2/5) | ⭐⭐⭐ (3/5) | ⭐⭐⭐⭐ (4/5) | ⭐⭐⭐⭐⭐ (5/5) |
| **Riesgo** | ⭐ (1/5) | ⭐⭐ (2/5) | ⭐⭐⭐ (3/5) | ⭐⭐⭐⭐ (4/5) |
| **UX calidad** | ⭐⭐⭐ (3/5) | ⭐⭐⭐⭐ (4/5) | ⭐⭐⭐⭐⭐ (5/5) | ⭐⭐⭐⭐⭐ (5/5) |
| **App Store** | ❌ No | ✅ Sí | ✅ Sí | ✅ Sí |
| **Código compartido** | 100% | 95%+ | 30-50% lógica | 0% |
| **Street View** | ✅ Nativo web | ✅ Via WebView | ⚠️ Limitado | ⚠️ Limitado |
| **Notificaciones push** | ⚠️ Limitado iOS | ✅ Completo | ✅ Completo | ✅ Completo |
| **GPS nativo** | ✅ Web API | ✅ Nativo | ✅ Nativo | ✅ Nativo |
| **Acceso cámara** | ✅ Web API | ✅ Nativo | ✅ Nativo | ✅ Nativo |
| **Haptics** | ❌ Limitado | ✅ Nativo | ✅ Nativo | ✅ Nativo |

---

## 1️⃣ PWA (Progressive Web App) — PASO INMEDIATO RECOMENDADO

### ¿Qué es?

Una PWA convierte tu web app actual en una experiencia "instalable" en el teléfono. El usuario la agrega a su pantalla de inicio y se abre sin barra de navegador, como una app nativa.

### ¿Qué te da?

| Capacidad | iOS (Safari) | Android (Chrome) |
|-----------|-------------|-----------------|
| Instalar en home screen | ✅ | ✅ |
| Pantalla completa (sin barra URL) | ✅ | ✅ |
| Cache offline | ✅ | ✅ |
| Push notifications | ✅ (desde iOS 16.4) | ✅ |
| GPS / Geolocalización | ✅ | ✅ |
| Cámara | ✅ | ✅ |
| Vibración / Haptics | ❌ Limitado | ✅ |
| Bluetooth / NFC | ❌ | ⚠️ Parcial |
| App Store | ❌ | ❌ (sí en tiendas alternativas) |

### Implementación técnica con Next.js

**Opción A: `@serwist/next`** (recomendado, sucesor moderno de `next-pwa`)

```bash
npm install @serwist/next @serwist/precaching @serwist/sw
```

**Paso 1 — Crear `src/app/manifest.ts`:**

```typescript
import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'UBEX — Explora. Descifra. Gana.',
    short_name: 'UBEX',
    description: 'Juego de exploración geográfica con tesoros reales',
    start_url: '/',
    display: 'standalone',
    background_color: '#09090b',   // zinc-950
    theme_color: '#f59e0b',        // amber-500 (color de marca)
    orientation: 'portrait',
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  }
}
```

**Paso 2 — Configurar `next.config.ts`:**

```typescript
import withSerwist from '@serwist/next'

const nextConfig = {
  images: { unoptimized: true },
}

export default withSerwist({
  swSrc: 'src/sw.ts',
  swDest: 'public/sw.js',
})(nextConfig)
```

**Paso 3 — Crear Service Worker `src/sw.ts`:**

```typescript
import { defaultCache } from '@serwist/next/worker'
import { installSerwist } from '@serwist/sw'

installSerwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  runtimeCaching: defaultCache,
})
```

**Paso 4 — Meta tags en `layout.tsx`:**

```tsx
export const metadata: Metadata = {
  title: 'UBEX — Explora. Descifra. Gana.',
  description: '...',
  manifest: '/manifest.webmanifest',
  themeColor: '#f59e0b',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'UBEX',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: 'cover',  // para safe areas
  },
}
```

### Google Maps / Street View en PWA

**Funciona perfectamente.** No hay ningún cambio necesario. `StreetViewExplorer.tsx` usa la API JavaScript de Google Maps que corre en el navegador — mismo motor que usa la PWA.

Beneficio adicional: Google Maps ya optimiza Street View para dispositivos móviles automáticamente (controles táctiles, giroscopio, etc.).

### Costos

| Concepto | Costo |
|----------|-------|
| Desarrollo | $0 (configuración sobre código existente) |
| Hosting | Ya incluido (Vercel/Firebase) |
| Certificado SSL | Ya incluido |
| App Store | N/A |
| **Total** | **$0** |

### Métricas

| Métrica | Valor |
|---------|-------|
| Costo | $0 |
| Tiempo | 1-2 semanas |
| Esfuerzo | ⭐⭐ (2/5) |
| Riesgo | ⭐ (1/5) |
| Calidad UX | ⭐⭐⭐ (3/5) |

### Limitaciones

- **No aparece en App Store ni Google Play** — los usuarios deben descubrirla por web
- **iOS limita las PWAs:** sin push notifications en modo background, almacenamiento limitado a 50MB
- **Sin acceso a haptics avanzados** en iOS
- **Sin deep linking** robusto como una app nativa
- **No se puede cobrar via App Store** (puede ser ventaja: sin comisión del 30%)

---

## 2️⃣ Capacitor (Ionic) — WRAPPER HÍBRIDO

### ¿Qué es?

Capacitor envuelve tu app web existente en un contenedor nativo (WebView). Tu código Next.js corre exactamente igual, pero dentro de una app que se distribuye por App Store y Google Play.

### ¿Por qué Capacitor y no Cordova?

| Aspecto | Capacitor | Cordova |
|---------|-----------|---------|
| Mantenimiento | Activo (Ionic) | Casi abandonado |
| Plugins nativos | Modernos, TypeScript | Legacy, callbacks |
| Next.js compatible | ✅ (export estático) | ⚠️ Complicado |
| Acceso código nativo | ✅ Directo (Swift/Kotlin) | ❌ Solo plugins |
| Migración web → app | Trivial | Compleja |

### Implementación técnica

**Paso 1 — Configurar Next.js para export estático:**

```typescript
// next.config.ts
const nextConfig = {
  output: 'export',           // genera HTML estático en /out
  images: { unoptimized: true }, // ya lo tienes
}
```

> ⚠️ **Importante:** `output: 'export'` significa que NO puedes usar Server Components, API Routes ni middleware de Next.js. Todo debe ser client-side. Verificar que tu app funcione con esta restricción.

**Paso 2 — Instalar Capacitor:**

```bash
npm install @capacitor/core @capacitor/cli
npx cap init "UBEX" "com.ubex.app" --web-dir=out

npm install @capacitor/ios @capacitor/android
npx cap add ios
npx cap add android
```

**Paso 3 — Plugins nativos útiles para UBEX:**

```bash
# Geolocalización de alta precisión
npm install @capacitor/geolocation

# Notificaciones push (Firebase Cloud Messaging)
npm install @capacitor/push-notifications

# Haptics (vibración al encontrar tesoro)
npm install @capacitor/haptics

# Compartir logros
npm install @capacitor/share

# Splash screen
npm install @capacitor/splash-screen

# Barra de estado
npm install @capacitor/status-bar

# Cámara (futura feature: foto del tesoro)
npm install @capacitor/camera

# Deep links (compartir misiones)
npm install @capacitor/app
```

**Paso 4 — Flujo de build:**

```bash
# 1. Build de Next.js (export estático)
npm run build

# 2. Sincronizar con proyectos nativos
npx cap sync

# 3. Abrir en Xcode / Android Studio
npx cap open ios
npx cap open android
```

**Paso 5 — Ejemplo: Haptics al encontrar tesoro:**

```typescript
import { Haptics, ImpactStyle } from '@capacitor/haptics'

async function onTreasureFound() {
  // Vibración satisfactoria al encontrar el tesoro
  await Haptics.impact({ style: ImpactStyle.Heavy })
}

async function onClueRevealed() {
  // Vibración sutil al revelar pista
  await Haptics.impact({ style: ImpactStyle.Light })
}
```

### Google Maps / Street View en Capacitor

**Funciona sin cambios.** Capacitor usa un WebView (WKWebView en iOS, Chrome WebView en Android) que ejecuta tu web app tal cual. `StreetViewExplorer.tsx` funciona idéntico.

Para mejor rendimiento, puedes usar `@capacitor/google-maps` que renderiza el mapa de forma nativa debajo del WebView (plugin oficial de Ionic). Sin embargo, para Street View esto **no aplica** — Street View solo está disponible via la API JavaScript, así que el enfoque actual de WebView es el correcto.

### Consideraciones especiales

**Geolocalización:** Capacitor permite solicitar permisos de ubicación nativos, lo que es más confiable que la Web Geolocation API:

```typescript
import { Geolocation } from '@capacitor/geolocation'

// Solicitar permisos (popup nativo del sistema)
const permission = await Geolocation.requestPermissions()

// Obtener posición precisa
const position = await Geolocation.getCurrentPosition({
  enableHighAccuracy: true,
})
```

**Push Notifications:** Firebase Cloud Messaging funciona nativamente:

```typescript
import { PushNotifications } from '@capacitor/push-notifications'

// Registrar para push
await PushNotifications.requestPermissions()
await PushNotifications.register()

// Escuchar token
PushNotifications.addListener('registration', (token) => {
  // Guardar token en Firebase/Firestore
})
```

### Costos

| Concepto | Costo |
|----------|-------|
| Apple Developer Program | $99/año |
| Google Play Console | $25 (único) |
| Desarrollo | $0 (mismo codebase) |
| Tiempo del developer | ~2-3 semanas |
| **Total año 1** | **~$124 USD** |
| **Total años siguientes** | **$99/año** |

### Métricas

| Métrica | Valor |
|---------|-------|
| Costo | ~$124 USD (año 1) |
| Tiempo | 2-3 semanas |
| Esfuerzo | ⭐⭐⭐ (3/5) |
| Riesgo | ⭐⭐ (2/5) |
| Calidad UX | ⭐⭐⭐⭐ (4/5) |

### Pros

- ✅ **Reutiliza el 95%+ del código existente**
- ✅ **Presencia en App Store y Google Play** (descubrimiento, credibilidad)
- ✅ **Acceso a APIs nativas** (haptics, push, GPS preciso, cámara)
- ✅ **Un solo codebase** para web + iOS + Android
- ✅ **Deploy rápido:** cambios web se reflejan con `cap sync`
- ✅ **Deep links** para compartir misiones
- ✅ **Monetización via In-App Purchases** si se necesita

### Contras

- ⚠️ **Rendimiento WebView:** no es tan fluido como nativo puro (pero para Street View, que ya es web, no se nota)
- ⚠️ **Review de App Store:** Apple puede rechazar apps que son "solo un wrapper de web" — hay que agregar funcionalidad nativa real (push notifications, haptics) para justificar
- ⚠️ **`output: 'export'` elimina SSR:** hay que verificar que la app funcione con export estático
- ⚠️ **Debugging:** más complejo que web puro (Safari Web Inspector para iOS, Chrome DevTools para Android)
- ⚠️ **Actualizaciones:** cada cambio requiere `cap sync` + rebuild + submit a stores (salvo que uses Capgo/Appflow para updates OTA)

### Capacitor vs React Native (comparación directa)

| Aspecto | Capacitor | React Native |
|---------|-----------|-------------|
| Migración desde Next.js | Trivial (mismo código) | Rewrite completa de UI |
| Rendimiento | Bueno (WebView) | Excelente (nativo) |
| Street View | ✅ Funciona igual | ⚠️ Hay que usar wrapper |
| Three.js / 3D | ✅ Funciona (WebGL) | ❌ Necesita react-native-webgl |
| Plugins nativos | ~200 disponibles | ~3,000+ disponibles |
| Equipo necesario | 1 dev web | 1 dev con experiencia RN |
| Mantenimiento | Bajo (un codebase) | Medio-alto (dos codebases) |
| **Recomendado para UBEX** | **✅ Sí** | Solo si hay tracción |

---

## 3️⃣ React Native + Expo

### ¿Qué es?

React Native permite construir apps verdaderamente nativas usando React. Expo es un framework sobre React Native que simplifica el desarrollo, build y deploy.

### ¿Qué implica para UBEX?

**Reescritura completa de la interfaz.** La lógica de negocio (cálculo de distancias, validación de respuestas, estado del juego) se puede reutilizar, pero todos los componentes visuales deben reescribirse con componentes nativos.

### Componentes que habría que reescribir

| Componente web actual | Equivalente React Native |
|----------------------|--------------------------|
| `StreetViewExplorer.tsx` (Google Maps JS API) | `react-native-maps` + StreetView (limitado) o WebView |
| CSS inline + Tailwind | `StyleSheet.create()` o NativeWind |
| `<aside>` sidebar | Bottom Sheet (`@gorhom/bottom-sheet`) |
| Three.js (3D) | `expo-three` o `react-native-webgl` |
| HTML `<form>` | React Native `<TextInput>` + gestión manual |
| PayPal web SDK | `react-native-paypal` o In-App Purchases |
| Zustand (state) | ✅ Funciona sin cambios |
| Firebase web SDK | `@react-native-firebase/*` (SDK nativo) |

### El problema de Street View en React Native

**Este es el mayor riesgo técnico.** Google no ofrece un SDK oficial de Street View para React Native.

Opciones:

1. **`react-native-maps` con Street View:** Soporte básico en Android, pero **no en iOS**. La funcionalidad es limitada (no permite la exploración libre que necesita UBEX).

2. **WebView embebido:** Cargar la interfaz de Street View actual dentro de un `<WebView>`. Esto funciona, pero:
   - Comunicación WebView ↔ nativo es via `postMessage` (lento, complejo)
   - El 70% de la pantalla sería un WebView (entonces, ¿para qué React Native?)
   - Doble capa de rendering = peor rendimiento

3. **Google Maps SDK nativo + panoramas:** Existe `GMSPanoramaView` en iOS y `StreetViewPanorama` en Android, pero no hay binding React Native mantenido.

**Conclusión:** Para un juego basado en Street View, React Native añade complejidad sin beneficio claro sobre Capacitor.

### Estructura propuesta (si se decide hacer)

```
ubex-mobile/
├── apps/
│   ├── web/          → Next.js actual
│   └── mobile/       → Expo app
├── packages/
│   ├── shared/       → Lógica compartida
│   │   ├── game-logic/   → Cálculos de distancia, validación
│   │   ├── types/        → TypeScript interfaces
│   │   └── api/          → Firebase/Gemini clients
│   └── ui/           → Componentes compartidos (si aplica)
├── package.json      → Workspace root
└── turbo.json        → Turborepo config
```

### Costos

| Concepto | Costo |
|----------|-------|
| Apple Developer Program | $99/año |
| Google Play Console | $25 (único) |
| Tiempo de desarrollo | 2-3 meses (1 dev full-time) |
| Costo oportunidad | Alto (no se mejora la web) |
| Librerías premium (si aplica) | $0-200 |
| **Total estimado** | **$5,000-15,000** (incluyendo tiempo del developer) |

### Métricas

| Métrica | Valor |
|---------|-------|
| Costo | $5,000-15,000 |
| Tiempo | 2-3 meses |
| Esfuerzo | ⭐⭐⭐⭐ (4/5) |
| Riesgo | ⭐⭐⭐ (3/5) — principalmente por Street View |
| Calidad UX | ⭐⭐⭐⭐⭐ (5/5) — si se resuelve Street View |

### ¿Cuándo tiene sentido?

- ✅ Cuando haya **+10,000 usuarios activos** y la PWA/Capacitor se quede corta
- ✅ Cuando haya **presupuesto para un dev mobile dedicado**
- ✅ Cuando se necesiten features nativos avanzados (AR, Bluetooth, widgets)
- ❌ **No tiene sentido ahora** para un startup con 1 developer

---

## 4️⃣ Flutter — NO RECOMENDADO

### ¿Por qué no para UBEX?

| Razón | Detalle |
|-------|---------|
| **Reescritura total** | 0% de código reutilizable. Dart ≠ TypeScript/React |
| **Street View** | El plugin `google_maps_flutter` tiene soporte limitado de Street View |
| **Three.js** | No existe equivalente directo. Habría que usar `flutter_unity_widget` o Flame |
| **Ecosistema** | El equipo ya domina React/TypeScript. Aprender Dart + Flutter = 1-2 meses |
| **Firebase** | Funciona bien con `FlutterFire`, pero hay que reescribir toda la integración |
| **Comunidad UBEX** | Si hay contributors futuros, React/TS es más fácil de reclutar |

### Métricas

| Métrica | Valor |
|---------|-------|
| Costo | $10,000-20,000 |
| Tiempo | 3-4 meses |
| Esfuerzo | ⭐⭐⭐⭐⭐ (5/5) |
| Riesgo | ⭐⭐⭐⭐ (4/5) |
| Calidad UX | ⭐⭐⭐⭐⭐ (5/5) |

### ¿Cuándo tendría sentido?

Solo si UBEX fuera una empresa establecida con un equipo de 3+ developers y la decisión de abandonar la web por completo. **No es el caso.**

---

## 5️⃣ Optimización Mobile-First — HACER YA

### Acciones inmediatas (antes de cualquier otra estrategia)

Estas mejoras benefician TODAS las opciones futuras (PWA, Capacitor, etc.) porque mejoran la experiencia web en móviles.

### 5.1 Viewport y Safe Areas

**Archivo:** `src/app/layout.tsx`

```tsx
// Agregar meta viewport para safe areas (notch / Dynamic Island)
export const metadata: Metadata = {
  // ...existing metadata
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,          // evita zoom accidental durante el juego
    userScalable: false,
    viewportFit: 'cover',     // extiende contenido detrás del notch
  },
}
```

**CSS para safe areas** (agregar en `globals.css`):

```css
/* Safe areas para notch, Dynamic Island, home indicator */
:root {
  --sat: env(safe-area-inset-top);
  --sar: env(safe-area-inset-right);
  --sab: env(safe-area-inset-bottom);
  --sal: env(safe-area-inset-left);
}

/* Aplicar padding safe en contenedores principales */
.safe-top    { padding-top:    max(1rem, var(--sat)); }
.safe-bottom { padding-bottom: max(1rem, var(--sab)); }
.safe-x      { padding-left:   max(1rem, var(--sal));
               padding-right:  max(1rem, var(--sar)); }
```

### 5.2 Sidebar → Bottom Sheet en móvil

**Problema actual:** La sidebar de 380px es un `<aside>` con ancho fijo que se colapsa a 0px en móvil. Esto no es una buena UX móvil.

**Solución:** Convertir la sidebar en un **bottom sheet** arrastreable en pantallas pequeñas.

```tsx
// Concepto para src/app/play/page.tsx
// En móvil: bottom sheet con 3 estados (collapsed, peek, full)
// En desktop: sidebar lateral como está ahora

const isMobile = useMediaQuery('(max-width: 768px)')

{isMobile ? (
  <BottomSheet
    snapPoints={['10%', '40%', '85%']}
    defaultSnap="40%"
  >
    <ClueCard ... />
    <AnswerInput ... />
    <LevelProgress ... />
  </BottomSheet>
) : (
  <aside style={{ width: sidebarOpen ? 380 : 0 }}>
    {/* sidebar actual */}
  </aside>
)}
```

Librerías recomendadas para bottom sheet web:
- `react-spring-bottom-sheet` — liviana, buena UX táctil
- Implementación custom con CSS `touch-action` + `IntersectionObserver`

### 5.3 Controles de Street View táctiles

Google Street View ya soporta gestos táctiles (arrastrar para mirar, pinch-to-zoom). Pero podemos mejorar:

```typescript
// En StreetViewExplorer.tsx — opciones optimizadas para móvil
const mobileOptions = {
  motionTracking: true,          // giroscopio del teléfono para mirar
  motionTrackingControl: true,   // botón para activar/desactivar giroscopio
  fullscreenControl: false,      // no necesario (ya es fullscreen en móvil)
  linksControl: true,            // flechas de navegación más grandes en móvil
  panControl: false,             // el pan es por touch, no necesita botón
  zoomControl: false,            // zoom es por pinch
  addressControl: false,         // ocultar dirección (no relevante para el juego)
  showRoadLabels: false,         // ocultar nombres de calles (pueden ser spoilers)
}

panorama.setOptions(
  window.innerWidth < 768 ? mobileOptions : desktopOptions
)
```

### 5.4 Navegación inferior en móvil

Reemplazar la navegación superior por una barra inferior en móvil (pulgar alcanza fácilmente):

```tsx
// Componente de navegación adaptable
function GameNav() {
  const isMobile = useMediaQuery('(max-width: 768px)')

  if (isMobile) {
    return (
      <nav className="fixed bottom-0 inset-x-0 safe-bottom bg-zinc-900/95 backdrop-blur-md
                       border-t border-white/10 flex justify-around items-center h-16 z-50">
        <NavButton icon={<Compass />} label="Explorar" />
        <NavButton icon={<Scroll />} label="Pista" />
        <NavButton icon={<Target />} label="Responder" />
        <NavButton icon={<Trophy />} label="Ranking" />
      </nav>
    )
  }

  return <DesktopHeader />  // header actual
}
```

### 5.5 Rendimiento móvil

```typescript
// Lazy loading de Three.js (pesado, solo cargar si se necesita)
const ThreeScene = dynamic(() => import('@/components/3d/Scene'), {
  ssr: false,
  loading: () => <div className="animate-pulse bg-zinc-800 rounded-lg h-64" />,
})

// Reducir calidad de Street View en conexiones lentas
if (navigator.connection?.effectiveType === '3g') {
  panorama.setOptions({
    // Cargar imágenes en menor resolución
  })
}
```

### 5.6 Checklist de optimización mobile-first

| Tarea | Prioridad | Tiempo est. |
|-------|-----------|-------------|
| ✅ Viewport meta + safe areas | Alta | 30 min |
| ✅ Bottom sheet para sidebar en móvil | Alta | 1-2 días |
| ✅ Navegación inferior en móvil | Alta | 1 día |
| ✅ Street View opciones táctiles + giroscopio | Alta | 2 horas |
| ✅ Lazy loading de Three.js | Media | 1 hora |
| ✅ Tipografía responsive (ya usa `clamp()`) | ✅ Hecho | — |
| ✅ `100dvh` para viewport | ✅ Hecho | — |
| ⬜ Touch targets ≥ 44px (accesibilidad Apple) | Media | 2 horas |
| ⬜ Reducir bundle size para 3G | Baja | 1 día |
| ⬜ Skeleton loading states | Baja | 3 horas |

---

## 🗺️ Hoja de ruta recomendada

### Fase 1 — AHORA (Semanas 1-2): Mobile-First + PWA

```
Semana 1:
├── Lunes-Martes: Viewport, safe areas, meta tags
├── Miércoles-Jueves: Bottom sheet para sidebar móvil
└── Viernes: Navegación inferior + controles Street View táctiles

Semana 2:
├── Lunes: PWA manifest + service worker con @serwist/next
├── Martes: Iconos (192, 512, maskable) + splash screens
├── Miércoles: Testing en dispositivos reales (iPhone + Android)
├── Jueves: Lazy loading Three.js + optimización rendimiento
└── Viernes: Deploy + testing final
```

**Resultado:** App instalable desde el navegador, UX móvil profesional.
**Costo:** $0
**Riesgo:** Mínimo

### Fase 2 — Mes 2: Capacitor (App Store Presence)

```
Semana 1:
├── Configurar output: 'export' en Next.js
├── Verificar que la app funcione sin SSR
├── Instalar Capacitor + plugins
└── Primer build iOS + Android

Semana 2:
├── Agregar haptics (encontrar tesoro, pistas)
├── Configurar push notifications con FCM
├── Configurar deep links para compartir misiones
└── Testing en dispositivos reales

Semana 3:
├── Crear assets para App Store (screenshots, descripciones)
├── Submit a App Store Connect + Google Play Console
├── Proceso de review (~1-7 días)
└── 🎉 Publicación
```

**Resultado:** UBEX disponible en App Store y Google Play.
**Costo:** $124 USD
**Riesgo:** Bajo (si el paso PWA funcionó, Capacitor es incremental)

### Fase 3 — Si hay tracción (+10K usuarios): React Native

```
Mes 1: Setup monorepo + migrar lógica compartida
Mes 2: Reescribir UI con componentes nativos
Mes 3: Testing, optimización, submit a stores
```

**Decisión trigger:** Ejecutar Fase 3 solo si:
- Más de 10,000 usuarios activos mensuales
- Reviews negativas mencionan rendimiento
- Se necesitan features nativas imposibles en WebView (AR, widgets, etc.)

---

## ⚠️ Riesgos y mitigaciones

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|-------------|---------|------------|
| Apple rechaza app Capacitor por "web wrapper" | Media | Alto | Agregar 2-3 features nativos reales (haptics, push, gyroscope) |
| Street View lento en móviles baratos | Baja | Medio | Opciones de calidad reducida, lazy loading |
| `output: 'export'` rompe funcionalidad | Media | Medio | Testear temprano; refactorizar lo que dependa de SSR |
| Three.js crash en móviles con poca RAM | Media | Bajo | Lazy loading + fallback 2D |
| Usuarios no saben instalar PWA | Alta | Medio | Banner "Agregar a pantalla de inicio" + tutorial |
| Cuota de Firebase se dispara con mobile | Baja | Medio | Rate limiting + cache agresivo |

---

## 💡 Conclusión

Para un startup con un solo developer y herramientas de IA, la estrategia más inteligente es **iterar de web a nativo progresivamente:**

1. **No reescribir nada todavía.** La web app actual ES el MVP.
2. **Hacer que funcione perfecto en móviles** (CSS, UX, rendimiento).
3. **Convertirla en PWA** para que sea instalable sin costo.
4. **Envolverla en Capacitor** cuando necesites App Store y push notifications.
5. **Reescribir en React Native** solo si los datos lo justifican.

Cada fase construye sobre la anterior. Ninguna invalida trabajo previo. Y cada una puede lanzarse en 1-3 semanas.

> **"Ship web first. Go native when the numbers demand it."**

---

## 📚 Recursos útiles

- [Capacitor + Next.js guide](https://capacitorjs.com/docs/getting-started)
- [@serwist/next (PWA para Next.js)](https://serwist.pages.dev/docs/next)
- [Google Maps Platform — Street View](https://developers.google.com/maps/documentation/javascript/streetview)
- [Apple Human Interface Guidelines — Mobile](https://developer.apple.com/design/human-interface-guidelines/)
- [Bottom Sheet pattern — Material Design](https://m3.material.io/components/bottom-sheets)
- [PWA en iOS — limitaciones actuales](https://firt.dev/notes/pwa-ios/)
