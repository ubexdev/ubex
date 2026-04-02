# Contribuir a UBEX

> Todo lo que necesitas para configurar un entorno de desarrollo local, entender el código fuente y enviar tu primer pull request.

---

## Tabla de Contenidos

1. [Inicio Rápido](#inicio-rápido)
2. [Requisitos Previos](#requisitos-previos)
3. [Configuración del Entorno Local](#configuración-del-entorno-local)
4. [Variables de Entorno](#variables-de-entorno)
5. [Estructura del Proyecto](#estructura-del-proyecto)
6. [Cómo Agregar una Nueva Página](#cómo-agregar-una-nueva-página)
7. [Cómo Agregar un Nuevo Componente](#cómo-agregar-un-nuevo-componente)
8. [Estilo de Código](#estilo-de-código)
9. [Flujo de Trabajo con Git](#flujo-de-trabajo-con-git)
10. [Ejecución de Pruebas](#ejecución-de-pruebas)
11. [Tareas Comunes](#tareas-comunes)
12. [Solución de Problemas](#solución-de-problemas)

---

## Inicio Rápido

```bash
# 1. Clonar el repositorio
git clone https://github.com/your-org/ubex-app.git
cd ubex-app

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus API keys (ver sección Variables de Entorno)

# 4. Iniciar el servidor de desarrollo
npm run dev

# 5. Abrir http://localhost:3000
```

---

## Requisitos Previos

| Herramienta | Versión | Verificar |
|-------------|---------|-----------|
| **Node.js** | 18+ | `node --version` |
| **npm** | 9+ | `npm --version` |
| **Git** | 2.x+ | `git --version` |

**API keys requeridas** (para funcionalidad completa):

| Clave | Necesaria para | Cómo obtenerla |
|-------|---------------|----------------|
| Google Maps API Key | Jugabilidad con Street View | [Google Cloud Console](https://console.cloud.google.com/) — habilitar Maps JavaScript API + Street View API |
| Gemini API Key | Funciones de IA | [Google AI Studio](https://aistudio.google.com/) |
| Supabase URL + Anon Key | Auth, base de datos, realtime | [Supabase Dashboard](https://supabase.com/) — crear un proyecto |

> **Tip**: La página de inicio (`/`) funciona sin API keys. La página del juego (`/play`) requiere como mínimo la API key de Google Maps.

---

## Configuración del Entorno Local

### Paso 1: Instalar Dependencias

```bash
npm install
```

Esto instala todas las dependencias de ejecución y desarrollo, incluyendo:
- Next.js 16, React 19, TypeScript
- Tailwind CSS v4 (vía `@tailwindcss/postcss`)
- `@googlemaps/js-api-loader`, `@google/generative-ai`
- `@supabase/ssr`, `@supabase/supabase-js`
- Zustand, date-fns, Phosphor Icons
- Three.js / React Three Fiber (función del globo planificada)

### Paso 2: Configurar Entorno

```bash
cp .env.example .env.local
```

Edita `.env.local` con tus claves. Consulta [Variables de Entorno](#variables-de-entorno) para la lista completa.

### Paso 3: Iniciar el Servidor de Desarrollo

```bash
npm run dev
```

La aplicación inicia en `http://localhost:3000`. Next.js habilita Hot Module Replacement — los cambios en archivos dentro de `src/` se reflejan instantáneamente en el navegador.

### Paso 4: Verificar

- Visita `http://localhost:3000` — deberías ver la página de inicio
- Visita `http://localhost:3000/play` — deberías ver la pantalla de introducción del juego
- Si configuraste tu clave de Google Maps, al hacer clic en "Comenzar" debería cargar Street View

---

## Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto. El archivo `.env.example` lista todas las variables disponibles:

### Requeridas para la Jugabilidad Principal

```bash
# Google Maps — necesaria para Street View en /play
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

### Requeridas para Funciones de Producción

```bash
# Supabase — base de datos, auth, realtime
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Gemini AI — validación de respuestas del lado del servidor + generación de sagas
GEMINI_API_KEY=your_gemini_api_key
```

### Opcionales

```bash
# Firebase — auth/realtime alternativo (scaffolding legacy)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_DATABASE_URL=

# Pagos
NEXT_PUBLIC_PAYPAL_CLIENT_ID=
PAYPAL_CLIENT_SECRET=
NEXT_PUBLIC_GOOGLE_PAY_MERCHANT_ID=

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Convención de Nombres de Variables

| Prefijo | Exposición | Usar para |
|---------|-----------|-----------|
| `NEXT_PUBLIC_` | Cliente + servidor | Claves seguras para exponer (Maps, Supabase anon, Firebase config) |
| Sin prefijo | Solo servidor | Secretos que nunca deben llegar al navegador (Gemini, PayPal secret) |

---

## Estructura del Proyecto

```
ubex-app/
├── docs/                    # Documentación (estás aquí)
│   ├── README.md            # Índice de docs
│   ├── architecture.md      # Arquitectura técnica
│   ├── api-reference.md     # Referencia de endpoints de API
│   ├── game-design.md       # Documento de diseño del juego (español)
│   ├── guia-creadores.md    # Guía de creadores de mapas (español)
│   └── contributing.md      # Este archivo
├── public/                  # Recursos estáticos
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
├── src/
│   ├── app/                 # Páginas del App Router de Next.js
│   │   ├── layout.tsx       # Layout raíz (fuentes, metadata, tema oscuro)
│   │   ├── page.tsx         # Página de inicio (/)
│   │   ├── play/
│   │   │   └── page.tsx     # Página del juego (/play)
│   │   ├── globals.css      # Imports de Tailwind v4 + utilidades custom
│   │   └── favicon.ico
│   ├── components/          # Componentes de UI reutilizables
│   │   ├── game/            # Componentes específicos del juego
│   │   │   ├── AnswerInput.tsx
│   │   │   ├── ClueCard.tsx
│   │   │   ├── CountdownTimer.tsx
│   │   │   ├── GameHeader.tsx
│   │   │   ├── LevelProgress.tsx
│   │   │   ├── ParticipantTracker.tsx
│   │   │   └── ResultOverlay.tsx
│   │   └── maps/            # Componentes relacionados con mapas
│   │       └── StreetViewExplorer.tsx
│   ├── data/                # Datos estáticos
│   │   └── demo-saga.ts     # Saga demo con 12 niveles
│   ├── hooks/               # React hooks personalizados
│   │   ├── index.ts
│   │   └── useCountdown.ts
│   ├── lib/                 # Integraciones de bibliotecas
│   │   ├── firebase/        # Cliente Firebase (auth, Firestore, RTDB)
│   │   ├── gemini/          # Cliente Gemini AI (validación, generación)
│   │   ├── store/           # Zustand game store
│   │   └── supabase/        # Cliente Supabase, servidor, middleware
│   ├── types/               # Definiciones de tipos TypeScript
│   │   ├── index.ts         # Tipos del dominio (Saga, Level, GameSession, etc.)
│   │   └── database.ts      # Tipos de la BD de Supabase (scaffold)
│   └── middleware.ts         # Middleware de Next.js (auth, protección de /admin)
├── .env.example             # Plantilla de variables de entorno
├── .github/
│   └── workflows/
│       └── deploy.yml       # CI/CD: build + deploy a GitHub Pages
├── next.config.ts           # Configuración de Next.js (imágenes sin optimizar)
├── tsconfig.json            # Configuración de TypeScript (strict, path aliases)
├── postcss.config.mjs       # PostCSS con @tailwindcss/postcss
├── eslint.config.mjs        # ESLint (next core-web-vitals + TS)
├── package.json             # Dependencias y scripts
└── README.md                # README del proyecto (español)
```

---

## Cómo Agregar una Nueva Página

UBEX usa el [App Router de Next.js](https://nextjs.org/docs/app). Cada página es un archivo `page.tsx` dentro del directorio `src/app/`.

### Ejemplo: Agregar una Página `/sagas`

1. Crear el directorio y el archivo:

```
src/app/sagas/page.tsx
```

2. Escribir el componente de la página:

```typescript
// src/app/sagas/page.tsx
export default function SagasPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="section-inner py-20">
        <h1 className="text-4xl font-bold tracking-tight font-[family-name:var(--font-sans)]">
          Sagas Disponibles
        </h1>
        {/* Your content here */}
      </div>
    </main>
  );
}
```

3. Para interactividad del lado del cliente, agregar `'use client'` al inicio:

```typescript
'use client';

import { useState } from 'react';
// ...
```

### Convenciones Clave

- Las páginas que usen React hooks, manejadores de eventos o APIs del navegador deben ser componentes `'use client'`
- Usar la clase CSS `section-inner` para ancho máximo y centrado consistente
- Seguir el tema oscuro: fondo `bg-zinc-950`, texto `text-zinc-100`
- Usar la variable de fuente `--font-sans` (Outfit) para los encabezados

---

## Cómo Agregar un Nuevo Componente

### Ubicación de Componentes

| Tipo | Directorio | Ejemplo |
|------|-----------|---------|
| UI específica del juego | `src/components/game/` | `ClueCard.tsx`, `LevelProgress.tsx` |
| Componentes de mapa/geo | `src/components/maps/` | `StreetViewExplorer.tsx` |
| UI general (planificado) | `src/components/ui/` | `Button.tsx`, `Card.tsx` |

### Plantilla de Componente

```typescript
// src/components/game/NewComponent.tsx
'use client';

interface NewComponentProps {
  title: string;
  isActive?: boolean;
  onAction?: () => void;
}

export default function NewComponent({
  title,
  isActive = false,
  onAction,
}: NewComponentProps) {
  return (
    <div className={`
      rounded-2xl border p-6
      ${isActive
        ? 'border-amber-500/30 bg-amber-500/5'
        : 'border-zinc-800 bg-zinc-900/50'
      }
    `}>
      <h3 className="text-lg font-semibold text-zinc-100">
        {title}
      </h3>
      {onAction && (
        <button
          onClick={onAction}
          className="mt-4 rounded-xl bg-amber-500 px-4 py-2 text-sm font-semibold text-zinc-950 transition-smooth hover:bg-amber-400"
        >
          Acción
        </button>
      )}
    </div>
  );
}
```

### Guías para Componentes

1. **Un componente por archivo** — el export nombrado coincide con el nombre del archivo
2. **Interfaz de props** — siempre definir una interfaz TypeScript para los props
3. **Exports por defecto** — usar `export default function ComponentName`
4. **Solo Tailwind** — sin CSS modules, sin styled-components
5. **Tema oscuro** — usar fondos `zinc-950` / `zinc-900`, texto `zinc-100`, acentos `amber-500`

---

## Estilo de Código

### Reglas Generales

| Regla | Detalles |
|-------|---------|
| **Lenguaje** | TypeScript (modo strict) — sin tipos `any` |
| **Estilos** | Solo clases utilitarias de Tailwind CSS v4 |
| **Iconos** | Phosphor Icons (`@phosphor-icons/react`) — sin emoji en el código |
| **Fuentes** | Outfit (encabezados/cuerpo), JetBrains Mono (código) |
| **Tema** | Oscuro primero — base `zinc-950`, acento `amber-500` |
| **Path alias** | Usar `@/` para imports desde `src/` (ej., `@/components/game/ClueCard`) |

### Notas sobre Tailwind v4

UBEX usa Tailwind CSS v4, que tiene algunas diferencias respecto a v3:

- **Sin `tailwind.config.js`** — la configuración se hace en CSS vía `@import "tailwindcss"` en `globals.css`
- **Plugin de PostCSS** — usa `@tailwindcss/postcss` (no el antiguo plugin `tailwindcss`)
- **Configuración CSS-first** — las personalizaciones del tema van en `globals.css`, no en un archivo de configuración

### Orden de Imports

Seguir este orden de imports en todos los archivos:

```typescript
// 1. React/Next.js
'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

// 2. External libraries
import { differenceInSeconds } from 'date-fns';
import { Compass, MapTrifold } from '@phosphor-icons/react';

// 3. Internal - lib/utils
import { useGameStore } from '@/lib/store';
import { getSupabaseBrowser } from '@/lib/supabase';

// 4. Internal - components
import ClueCard from '@/components/game/ClueCard';
import StreetViewExplorer from '@/components/maps/StreetViewExplorer';

// 5. Internal - types
import type { Saga, Level } from '@/types';

// 6. Internal - data
import { DEMO_SAGA, DEMO_LEVELS } from '@/data/demo-saga';
```

### ESLint

El proyecto usa las reglas recomendadas de ESLint de Next.js:

```bash
npm run lint
```

Configuración en `eslint.config.mjs`:
- Extiende `next/core-web-vitals` y `next/typescript`
- Ignora `.next/`, `out/`, `build/`, `next-env.d.ts`

### Convenciones de Nombres

| Elemento | Convención | Ejemplo |
|----------|-----------|---------|
| Componentes | PascalCase | `ClueCard.tsx`, `StreetViewExplorer.tsx` |
| Hooks | camelCase con prefijo `use` | `useCountdown.ts` |
| Utilidades | camelCase | `haversineMeters()`, `normalize()` |
| Tipos/Interfaces | PascalCase | `GameSession`, `PlayerProgress` |
| Constantes | UPPER_SNAKE_CASE | `PROXIMITY_RADIUS_M`, `DEMO_LEVELS` |
| Archivos (no-componente) | kebab-case | `demo-saga.ts`, `game-store.ts` |
| Clases CSS | kebab-case (Tailwind) | `section-inner`, `fade-in-d2` |

---

## Flujo de Trabajo con Git

### Nombres de Ramas

```
feature/descripcion    → Nuevas funcionalidades
fix/descripcion        → Corrección de errores
docs/descripcion       → Cambios en documentación
refactor/descripcion   → Reestructuración de código
```

Ejemplos:
```
feature/admin-panel
fix/street-view-loading
docs/api-reference
refactor/game-state-zustand
```

### Mensajes de Commit

Seguir [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add leaderboard page with real-time updates
fix: resolve Street View panorama not loading on mobile
docs: add API reference for game endpoints
refactor: migrate play page state to Zustand store
style: apply consistent dark theme to admin panel
chore: update dependencies to latest versions
```

### Flujo de Pull Request

```
1. Crear una rama feature desde main
   git checkout -b feature/tu-feature

2. Realizar tus cambios
   git add .
   git commit -m "feat: tu descripción"

3. Subir y abrir un PR
   git push origin feature/tu-feature
   → Abrir PR en GitHub apuntando a main

4. Requisitos del PR:
   ✅ Pasa lint (npm run lint)
   ✅ Pasa build (npm run build)
   ✅ Tiene una descripción clara de los cambios
   ✅ Capturas de pantalla para cambios de UI
   ✅ Documentación actualizada si el comportamiento cambió

5. Revisión y merge
   → Al menos 1 aprobación requerida
   → Squash merge a main
```

### Plantilla de Descripción del PR

```markdown
## Qué

Descripción breve del cambio.

## Por qué

Enlace al issue o explicación de la motivación.

## Cómo

Enfoque técnico utilizado.

## Capturas de Pantalla

(Para cambios de UI)

## Pruebas

Cómo probar este cambio manualmente.
```

---

## Ejecución de Pruebas

> **Nota**: El conjunto de pruebas aún no está configurado. Esta sección describe el enfoque de pruebas planificado.

### Configuración de Pruebas Planificada

```bash
# Pruebas unitarias (planificado)
npm run test

# Modo watch (planificado)
npm run test:watch

# Cobertura (planificado)
npm run test:coverage
```

### Qué Probar

| Categoría | Qué Probar | Prioridad |
|-----------|-----------|-----------|
| **Validación de respuestas** | `normalize()`, `checkAnswer()` | Alta |
| **Distancia Haversine** | `haversineMeters()` | Alta |
| **Transiciones de estado del juego** | Cambios de fase (intro → playing → completed) | Alta |
| **Componentes** | ClueCard renderiza pista/hint, LevelProgress muestra puntos | Media |
| **Rutas de API** | Validación de solicitudes, respuestas de error | Alta (cuando se implemente) |

### Lista de Verificación de Pruebas Manuales

Al probar el juego localmente:

- [ ] La página de inicio carga sin errores
- [ ] El temporizador de cuenta regresiva se muestra correctamente
- [ ] Hacer clic en "Explorar" navega a `/play`
- [ ] La pantalla de introducción muestra ambas opciones de dificultad
- [ ] Seleccionar una dificultad inicia el juego
- [ ] Street View carga en el punto de inicio correcto
- [ ] La tarjeta de pista muestra el acertijo
- [ ] El botón de pista revela la ayuda
- [ ] Una respuesta correcta muestra la superposición verde y avanza
- [ ] Una respuesta incorrecta sacude el campo de entrada
- [ ] El modo Explorador bloquea el envío cuando estás muy lejos
- [ ] Los 12 niveles se completan en secuencia
- [ ] La pantalla de ganador muestra el tiempo total
- [ ] "Volver al inicio" navega al inicio

---

## Tareas Comunes

### Agregar una Nueva Saga Demo

Editar `src/data/demo-saga.ts`:

```typescript
export const NEW_SAGA: DemoSaga = {
  id: 'saga-new-2025',
  title: 'New Saga Title',
  subtitle: 'City · Country',
  description: 'Description of the saga theme...',
  prize: '$500',
  maxParticipants: 3000,
};

export const NEW_LEVELS: DemoLevel[] = [
  {
    id: 'new-1',
    number: 1,
    title: 'Level Title',
    clue: { text: '...', hint: '...', difficulty: 'easy' },
    spawnLat: 0.0,
    spawnLng: 0.0,
    spawnHeading: 0,
    spawnPitch: 0,
    targetLat: 0.0,
    targetLng: 0.0,
    correctAnswers: ['answer1', 'answer2'],
    explanation: 'Educational context...',
  },
  // ... 11 more levels
];
```

### Agregar un Nuevo Icono

UBEX usa [Phosphor Icons](https://phosphoricons.com/). Explora el catálogo de iconos, luego importa:

```typescript
import { NewIcon } from '@phosphor-icons/react';

// Usage
<NewIcon size={24} weight="bold" className="text-amber-500" />
```

Pesos disponibles: `thin`, `light`, `regular`, `bold`, `fill`, `duotone`.

### Agregar un Nuevo Tipo

Agregar tipos en `src/types/index.ts`:

```typescript
export interface NewFeature {
  id: string;
  name: string;
  status: 'active' | 'inactive';
}
```

---

## Solución de Problemas

### Street View Muestra "Sin cobertura" o Errores

- Verificar que `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` esté configurada en `.env.local`
- Asegurarse de que Maps JavaScript API y Street View Static API estén habilitadas en Google Cloud Console
- Revisar la consola del navegador en busca de errores de API key
- Las coordenadas de inicio pueden no tener cobertura de Street View — intentar con coordenadas cercanas

### Errores de `Module not found`

- Ejecutar `npm install` para asegurar que todas las dependencias estén instaladas
- Verificar que la ruta de importación use el prefijo `@/` (ej., `@/components/game/ClueCard`)
- Comprobar que `tsconfig.json` tenga el path alias: `"@/*": ["./src/*"]`

### Las Clases de Tailwind No Se Aplican

- Tailwind v4 no usa `tailwind.config.js` — la configuración está en `globals.css`
- Asegurar que `postcss.config.mjs` tenga el plugin `@tailwindcss/postcss`
- Reiniciar el servidor de desarrollo después de cambiar `globals.css`

### El Build Falla en GitHub Actions

- El CI usa `next build` con export estático (`output: 'export'` en `next.config.ts`)
- Asegurar que `images.unoptimized` sea `true` en `next.config.ts` (requerido para export estático)
- Verificar que `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` esté configurada como secreto en GitHub

### Errores de TypeScript con Google Maps

- El paquete `@types/google.maps` proporciona las definiciones de tipos
- Si los tipos de `google.maps` no se resuelven, reiniciar tu IDE / servidor de TypeScript
- El componente `StreetViewExplorer` maneja todas las interacciones con la API de Google Maps — es preferible extenderlo en lugar de crear nuevos componentes de Maps
