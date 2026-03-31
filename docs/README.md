# UBEX Documentation

> Comprehensive documentation for UBEX — the geo-exploration treasure hunt platform where players solve riddles by navigating real-world streets via Google Street View.

## Documentation Index

| Document | Language | Audience | Description |
|----------|----------|----------|-------------|
| [Game Design](./game-design.md) | Español | Designers, PMs, Stakeholders | Complete game design document — mechanics, scoring, player flow, difficulty progression |
| [Architecture](./architecture.md) | English | Engineers | Technical architecture — system overview, frontend/backend, database schema, integrations |
| [API Reference](./api-reference.md) | English | Engineers | Planned REST API endpoints — request/response schemas, auth, error codes |
| [Guía para Creadores](./guia-creadores.md) | Español | Map Creators | Guide for community saga creators — how to design great riddles and levels |
| [Contributing](./contributing.md) | English | Contributors | Developer setup, project structure, code style, Git workflow |

## What is UBEX?

UBEX is a web platform where players explore real-world streets via Google Street View to solve riddles. Each **saga** contains 12 levels set in a real city. Players navigate Street View, find landmarks, and answer questions. The first player to complete all 12 levels wins a prize.

### How It Works

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Choose a    │────▶│  Read the   │────▶│  Explore    │────▶│  Submit     │
│  Saga        │     │  Riddle     │     │  Street View│     │  Answer     │
└─────────────┘     └─────────────┘     └─────────────┘     └──────┬──────┘
                                                                    │
                                                          ┌────────┴────────┐
                                                          │                 │
                                                     ✅ Correct       ❌ Wrong
                                                          │                 │
                                                    Next Level        Try Again
                                                          │
                                                   (repeat ×12)
                                                          │
                                                    🏆 Winner!
```

### Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4
- **Backend**: Vercel (serverless), Supabase (PostgreSQL + Auth + Realtime)
- **Maps**: Google Maps JavaScript API, Street View API via `@googlemaps/js-api-loader` v2
- **AI**: Google Gemini API for saga generation and answer validation
- **State**: Zustand for client-side game state
- **Design**: Outfit + JetBrains Mono fonts, Phosphor icons, zinc-950 dark theme

## Quick Links

- **Repository**: [GitHub](https://github.com/your-org/ubex-app)
- **Live Demo**: Coming soon
- **Current Version**: `0.1.0` (Demo)

## Documentation Status

| Document | Status | Last Updated |
|----------|--------|--------------|
| Game Design | ✅ Complete | 2025 |
| Architecture | ✅ Complete | 2025 |
| API Reference | 📝 Planned endpoints | 2025 |
| Guía para Creadores | ✅ Complete | 2025 |
| Contributing | ✅ Complete | 2025 |
