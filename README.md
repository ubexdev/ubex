# UBEX — El Mundo es el Tablero 🌍

**Plataforma de arqueología digital** impulsada por Google Gemini AI y Google Maps Platform.

Los jugadores exploran calles reales del mundo a través de Google Street View para resolver acertijos históricos y culturales. Cada saga tiene 12 niveles ambientados en una ciudad real. El primero en completar todos los niveles gana el premio.

🌐 **Demo**: [ubex.vercel.app](https://ubex.vercel.app)

## Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| **Frontend** | Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4 |
| **Maps** | Google Maps JavaScript API + Street View via `@googlemaps/js-api-loader` |
| **AI** | Google Gemini 2.5 Flash (generación de sagas + validación de respuestas) |
| **Auth** | Supabase Auth (cookies via `@supabase/ssr`) |
| **Database** | Supabase (PostgreSQL + RLS + Realtime) |
| **State** | Zustand (estado del juego en cliente) |
| **i18n** | React Context (ES/EN, 286 claves) |
| **Iconos** | Phosphor Icons |
| **Fuentes** | Outfit + JetBrains Mono |
| **Infra** | Vercel (serverless) |

## Empezar

```bash
# Clonar el repositorio
git clone https://github.com/ubexdev/ubex.git
cd ubex

# Instalar dependencias
npm install

# Copiar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus API keys

# Desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Estructura del Proyecto

```
src/
├── app/                  # Next.js App Router (páginas)
│   ├── play/             # Página principal del juego
│   ├── login/            # Inicio de sesión
│   ├── register/         # Registro
│   ├── admin/            # Panel de administración
│   ├── leaderboard/      # Tabla de clasificación
│   ├── profile/          # Perfil del jugador
│   └── api/              # API Routes
│       └── game/         # Endpoints del juego (sagas, hints, sessions)
├── components/           # Componentes React
│   ├── game/             # HUD, pistas, respuestas, temporizador
│   └── maps/             # StreetViewExplorer
├── data/                 # Datos estáticos (demo saga)
├── i18n/                 # Traducciones ES/EN
├── lib/                  # Integraciones
│   ├── supabase/         # Cliente Supabase (auth + DB)
│   ├── gemini/           # Cliente Gemini AI
│   └── store/            # Zustand game store
├── hooks/                # Custom React hooks
└── types/                # Tipos TypeScript
```

## Documentación

Toda la documentación está en la carpeta [`docs/`](./docs/):

- [Índice de documentación](./docs/README.md)
- [Diseño del juego](./docs/game-design.md)
- [Arquitectura técnica](./docs/architecture.md)
- [Referencia API](./docs/api-reference.md)
- [Guía de contribución](./docs/contributing.md)
- [Guía para creadores](./docs/guia-creadores.md)
- [Guía de carga de sagas](./docs/GUIA-CARGA-SAGAS.md)

## Regla de Oro: Accesibilidad Street View

Todas las misiones del juego deben ser resolubles desde Google Street View. Las respuestas deben ser identificables desde la calle. No se permiten interiores, playas sin acceso vial, ni ubicaciones sin cobertura Street View.

## Licencia

Propietario — Todos los derechos reservados.
