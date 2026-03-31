# UBEX — El Mundo es el Tablero 🌍

**Plataforma de arqueología digital de próxima generación** impulsada por Google Gemini AI y Maps Platform.

Los usuarios exploran calles reales del mundo a través de Google Street View para resolver acertijos históricos. 12 niveles por saga, 5,000+ exploradores concurrentes, el primero en encontrar el tesoro gana **$1,000 USD**.

## Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| **Frontend** | Next.js 14+ (App Router), TypeScript, Tailwind CSS |
| **3D Globe** | Three.js / React Three Fiber (efecto Radio Garden) |
| **Maps** | Google Maps JavaScript API + Street View |
| **AI** | Google Gemini Pro (validación de respuestas) |
| **Auth** | Firebase Authentication |
| **Database** | Firebase Firestore (escalable, real-time) |
| **Real-time** | Firebase Realtime Database |
| **Payments** | PayPal SDK + Google Pay |
| **State** | Zustand |
| **Infra** | Google Cloud Platform |

## Empezar

```bash
# Instalar dependencias
npm install

# Copiar variables de entorno
cp .env.example .env.local
# Llenar con tus API keys

# Desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Estructura del Proyecto

```
src/
├── app/              # Next.js App Router (páginas)
│   ├── (auth)/       # Login, registro
│   ├── (game)/       # Lobby, niveles, resultados
│   ├── (admin)/      # Panel admin (cargar pistas)
│   └── api/          # API Routes
├── components/       # Componentes React
│   ├── globe/        # Globo 3D interactivo
│   ├── maps/         # Google Maps / Street View
│   ├── game/         # Temporizador, respuestas, tracker
│   └── ui/           # Componentes base
├── lib/              # Lógica de negocio
│   ├── firebase/     # Firebase client & admin
│   ├── gemini/       # Gemini AI client
│   └── store/        # Zustand stores
├── hooks/            # Custom React hooks
└── types/            # TypeScript types
```

## Licencia

Propietario — Todos los derechos reservados.
