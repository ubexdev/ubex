# Documentación de UBEX

> Documentación completa de UBEX — la plataforma de búsqueda del tesoro con geo-exploración donde los jugadores resuelven acertijos navegando calles reales a través de Google Street View.

## Índice de Documentación

| Documento | Idioma | Audiencia | Descripción |
|-----------|--------|-----------|-------------|
| [Diseño de Juego](./game-design.md) | Español | Diseñadores, PMs, Stakeholders | Documento completo de diseño de juego — mecánicas, puntuación, flujo del jugador, progresión de dificultad |
| [Arquitectura](./architecture.md) | Inglés | Ingenieros | Arquitectura técnica — visión general del sistema, frontend/backend, esquema de base de datos, integraciones |
| [Referencia de API](./api-reference.md) | Inglés | Ingenieros | Endpoints REST planificados — esquemas de request/response, autenticación, códigos de error |
| [Guía para Creadores](./guia-creadores.md) | Español | Creadores de Mapas | Guía para creadores de sagas de la comunidad — cómo diseñar buenos acertijos y niveles |
| [Contribuir](./contributing.md) | Inglés | Colaboradores | Configuración del entorno de desarrollo, estructura del proyecto, estilo de código, flujo de trabajo con Git |

## ¿Qué es UBEX?

UBEX es una plataforma web donde los jugadores exploran calles reales a través de Google Street View para resolver acertijos. Cada **saga** contiene 12 niveles ambientados en una ciudad real. Los jugadores navegan por Street View, encuentran puntos de referencia y responden preguntas. El primer jugador en completar los 12 niveles gana un premio.

### Cómo Funciona

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Elegir una  │────▶│  Leer el    │────▶│  Explorar   │────▶│  Enviar     │
│  saga        │     │  Acertijo   │     │  Street View│     │  Respuesta  │
└─────────────┘     └─────────────┘     └─────────────┘     └──────┬──────┘
                                                                    │
                                                          ┌────────┴────────┐
                                                          │                 │
                                                     ✅ Correcto     ❌ Incorrecto
                                                          │                 │
                                                  Siguiente Nivel    Intentar de Nuevo
                                                          │
                                                   (repetir ×12)
                                                          │
                                                    🏆 ¡Ganador!
```

### Stack Tecnológico

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4
- **Backend**: Vercel (serverless), Supabase (PostgreSQL + Auth + Realtime)
- **Mapas**: Google Maps JavaScript API, Street View API vía `@googlemaps/js-api-loader` v2
- **IA**: Google Gemini API para generación de sagas y validación de respuestas
- **Estado**: Zustand para estado del juego en el cliente
- **Diseño**: Fuentes Outfit + JetBrains Mono, íconos Phosphor, tema oscuro zinc-950

## Enlaces Rápidos

- **Repositorio**: [GitHub](https://github.com/your-org/ubex-app)
- **Demo en Vivo**: Próximamente
- **Versión Actual**: `0.1.0` (Demo)

## Estado de la Documentación

| Documento | Estado | Última Actualización |
|-----------|--------|----------------------|
| Diseño de Juego | ✅ Completo | 2025 |
| Arquitectura | ✅ Completo | 2025 |
| Referencia de API | 📝 Endpoints planificados | 2025 |
| Guía para Creadores | ✅ Completo | 2025 |
| Contribuir | ✅ Completo | 2025 |
