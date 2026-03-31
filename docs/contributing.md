# Contributing to UBEX

> Everything you need to set up a local development environment, understand the codebase, and submit your first pull request.

---

## Table of Contents

1. [Quick Start](#quick-start)
2. [Prerequisites](#prerequisites)
3. [Local Development Setup](#local-development-setup)
4. [Environment Variables](#environment-variables)
5. [Project Structure](#project-structure)
6. [How to Add a New Page](#how-to-add-a-new-page)
7. [How to Add a New Component](#how-to-add-a-new-component)
8. [Code Style](#code-style)
9. [Git Workflow](#git-workflow)
10. [Running Tests](#running-tests)
11. [Common Tasks](#common-tasks)
12. [Troubleshooting](#troubleshooting)

---

## Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/your-org/ubex-app.git
cd ubex-app

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Edit .env.local with your API keys (see Environment Variables section)

# 4. Start the development server
npm run dev

# 5. Open http://localhost:3000
```

---

## Prerequisites

| Tool | Version | Check |
|------|---------|-------|
| **Node.js** | 18+ | `node --version` |
| **npm** | 9+ | `npm --version` |
| **Git** | 2.x+ | `git --version` |

**Required API keys** (for full functionality):

| Key | Required for | How to get |
|-----|-------------|------------|
| Google Maps API Key | Street View gameplay | [Google Cloud Console](https://console.cloud.google.com/) — enable Maps JavaScript API + Street View API |
| Gemini API Key | AI features | [Google AI Studio](https://aistudio.google.com/) |
| Supabase URL + Anon Key | Auth, database, realtime | [Supabase Dashboard](https://supabase.com/) — create a project |

> **Tip**: The landing page (`/`) works without any API keys. The game page (`/play`) requires at minimum the Google Maps API key.

---

## Local Development Setup

### Step 1: Install Dependencies

```bash
npm install
```

This installs all runtime and dev dependencies including:
- Next.js 16, React 19, TypeScript
- Tailwind CSS v4 (via `@tailwindcss/postcss`)
- `@googlemaps/js-api-loader`, `@google/generative-ai`
- `@supabase/ssr`, `@supabase/supabase-js`
- Zustand, date-fns, Phosphor Icons
- Three.js / React Three Fiber (planned globe feature)

### Step 2: Configure Environment

```bash
cp .env.example .env.local
```

Edit `.env.local` with your keys. See [Environment Variables](#environment-variables) for the complete list.

### Step 3: Run Development Server

```bash
npm run dev
```

The app starts at `http://localhost:3000`. Next.js enables hot module replacement — changes to files in `src/` reflect instantly in the browser.

### Step 4: Verify

- Visit `http://localhost:3000` — you should see the landing page
- Visit `http://localhost:3000/play` — you should see the game intro screen
- If you've set up your Google Maps key, clicking "Comenzar" should load Street View

---

## Environment Variables

Create a `.env.local` file in the project root. The `.env.example` file lists all available variables:

### Required for Core Gameplay

```bash
# Google Maps — needed for Street View in /play
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

### Required for Production Features

```bash
# Supabase — database, auth, realtime
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Gemini AI — server-side answer validation + saga generation
GEMINI_API_KEY=your_gemini_api_key
```

### Optional

```bash
# Firebase — alternative auth/realtime (legacy scaffolding)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_DATABASE_URL=

# Payments
NEXT_PUBLIC_PAYPAL_CLIENT_ID=
PAYPAL_CLIENT_SECRET=
NEXT_PUBLIC_GOOGLE_PAY_MERCHANT_ID=

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Key Naming Convention

| Prefix | Exposure | Use for |
|--------|----------|---------|
| `NEXT_PUBLIC_` | Client + server | Keys safe to expose (Maps, Supabase anon, Firebase config) |
| No prefix | Server only | Secrets that must never reach the browser (Gemini, PayPal secret) |

---

## Project Structure

```
ubex-app/
├── docs/                    # Documentation (you are here)
│   ├── README.md            # Docs index
│   ├── architecture.md      # Technical architecture
│   ├── api-reference.md     # API endpoint reference
│   ├── game-design.md       # Game design document (Spanish)
│   ├── guia-creadores.md    # Map creator guide (Spanish)
│   └── contributing.md      # This file
├── public/                  # Static assets
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── layout.tsx       # Root layout (fonts, metadata, dark theme)
│   │   ├── page.tsx         # Landing page (/)
│   │   ├── play/
│   │   │   └── page.tsx     # Game page (/play)
│   │   ├── globals.css      # Tailwind v4 imports + custom utilities
│   │   └── favicon.ico
│   ├── components/          # Reusable UI components
│   │   ├── game/            # Game-specific components
│   │   │   ├── AnswerInput.tsx
│   │   │   ├── ClueCard.tsx
│   │   │   ├── CountdownTimer.tsx
│   │   │   ├── GameHeader.tsx
│   │   │   ├── LevelProgress.tsx
│   │   │   ├── ParticipantTracker.tsx
│   │   │   └── ResultOverlay.tsx
│   │   └── maps/            # Map-related components
│   │       └── StreetViewExplorer.tsx
│   ├── data/                # Static data
│   │   └── demo-saga.ts     # Demo saga with 12 levels
│   ├── hooks/               # Custom React hooks
│   │   ├── index.ts
│   │   └── useCountdown.ts
│   ├── lib/                 # Library integrations
│   │   ├── firebase/        # Firebase client (auth, Firestore, RTDB)
│   │   ├── gemini/          # Gemini AI client (validation, generation)
│   │   ├── store/           # Zustand game store
│   │   └── supabase/        # Supabase client, server, middleware
│   ├── types/               # TypeScript type definitions
│   │   ├── index.ts         # Domain types (Saga, Level, GameSession, etc.)
│   │   └── database.ts      # Supabase DB types (scaffold)
│   └── middleware.ts         # Next.js middleware (auth, /admin protection)
├── .env.example             # Environment variable template
├── .github/
│   └── workflows/
│       └── deploy.yml       # CI/CD: build + deploy to GitHub Pages
├── next.config.ts           # Next.js config (unoptimized images)
├── tsconfig.json            # TypeScript config (strict, path aliases)
├── postcss.config.mjs       # PostCSS with @tailwindcss/postcss
├── eslint.config.mjs        # ESLint (next core-web-vitals + TS)
├── package.json             # Dependencies and scripts
└── README.md                # Project README (Spanish)
```

---

## How to Add a New Page

UBEX uses the [Next.js App Router](https://nextjs.org/docs/app). Each page is a `page.tsx` file inside the `src/app/` directory.

### Example: Adding a `/sagas` Page

1. Create the directory and file:

```
src/app/sagas/page.tsx
```

2. Write the page component:

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

3. For client-side interactivity, add `'use client'` at the top:

```typescript
'use client';

import { useState } from 'react';
// ...
```

### Key Conventions

- Pages that use React hooks, event handlers, or browser APIs must be `'use client'` components
- Use the `section-inner` CSS class for consistent max-width and centering
- Follow the dark theme: `bg-zinc-950` background, `text-zinc-100` text
- Use the `--font-sans` (Outfit) font variable for headings

---

## How to Add a New Component

### Component Location

| Type | Directory | Example |
|------|-----------|---------|
| Game-specific UI | `src/components/game/` | `ClueCard.tsx`, `LevelProgress.tsx` |
| Map/geo components | `src/components/maps/` | `StreetViewExplorer.tsx` |
| General UI (planned) | `src/components/ui/` | `Button.tsx`, `Card.tsx` |

### Component Template

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

### Component Guidelines

1. **One component per file** — named export matches filename
2. **Props interface** — always define a TypeScript interface for props
3. **Default exports** — use `export default function ComponentName`
4. **Tailwind only** — no CSS modules, no styled-components
5. **Dark theme** — use `zinc-950` / `zinc-900` backgrounds, `zinc-100` text, `amber-500` accents

---

## Code Style

### General Rules

| Rule | Details |
|------|---------|
| **Language** | TypeScript (strict mode) — no `any` types |
| **Styling** | Tailwind CSS v4 utility classes only |
| **Icons** | Phosphor Icons (`@phosphor-icons/react`) — no emoji in code |
| **Fonts** | Outfit (headings/body), JetBrains Mono (code) |
| **Theme** | Dark-first — `zinc-950` base, `amber-500` accent |
| **Path alias** | Use `@/` for imports from `src/` (e.g., `@/components/game/ClueCard`) |

### Tailwind v4 Notes

UBEX uses Tailwind CSS v4, which has some differences from v3:

- **No `tailwind.config.js`** — configuration happens in CSS via `@import "tailwindcss"` in `globals.css`
- **PostCSS plugin** — uses `@tailwindcss/postcss` (not the old `tailwindcss` plugin)
- **CSS-first config** — theme customizations go in `globals.css`, not a config file

### Import Order

Follow this import order in all files:

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

The project uses Next.js recommended ESLint rules:

```bash
npm run lint
```

Configuration in `eslint.config.mjs`:
- Extends `next/core-web-vitals` and `next/typescript`
- Ignores `.next/`, `out/`, `build/`, `next-env.d.ts`

### Naming Conventions

| Element | Convention | Example |
|---------|-----------|---------|
| Components | PascalCase | `ClueCard.tsx`, `StreetViewExplorer.tsx` |
| Hooks | camelCase with `use` prefix | `useCountdown.ts` |
| Utilities | camelCase | `haversineMeters()`, `normalize()` |
| Types/Interfaces | PascalCase | `GameSession`, `PlayerProgress` |
| Constants | UPPER_SNAKE_CASE | `PROXIMITY_RADIUS_M`, `DEMO_LEVELS` |
| Files (non-component) | kebab-case | `demo-saga.ts`, `game-store.ts` |
| CSS classes | kebab-case (Tailwind) | `section-inner`, `fade-in-d2` |

---

## Git Workflow

### Branch Naming

```
feature/description    → New features
fix/description        → Bug fixes
docs/description       → Documentation changes
refactor/description   → Code restructuring
```

Examples:
```
feature/admin-panel
fix/street-view-loading
docs/api-reference
refactor/game-state-zustand
```

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add leaderboard page with real-time updates
fix: resolve Street View panorama not loading on mobile
docs: add API reference for game endpoints
refactor: migrate play page state to Zustand store
style: apply consistent dark theme to admin panel
chore: update dependencies to latest versions
```

### Pull Request Flow

```
1. Create a feature branch from main
   git checkout -b feature/your-feature

2. Make your changes
   git add .
   git commit -m "feat: your description"

3. Push and open a PR
   git push origin feature/your-feature
   → Open PR on GitHub targeting main

4. PR requirements:
   ✅ Passes lint (npm run lint)
   ✅ Passes build (npm run build)
   ✅ Has a clear description of changes
   ✅ Screenshots for UI changes
   ✅ Docs updated if behavior changed

5. Review and merge
   → At least 1 approval required
   → Squash merge into main
```

### PR Description Template

```markdown
## What

Brief description of the change.

## Why

Link to issue or explanation of motivation.

## How

Technical approach taken.

## Screenshots

(For UI changes)

## Testing

How to test this change manually.
```

---

## Running Tests

> **Note**: The test suite is not yet configured. This section describes the planned testing approach.

### Planned Test Setup

```bash
# Unit tests (planned)
npm run test

# Watch mode (planned)
npm run test:watch

# Coverage (planned)
npm run test:coverage
```

### What to Test

| Category | What to Test | Priority |
|----------|-------------|----------|
| **Answer validation** | `normalize()`, `checkAnswer()` | High |
| **Haversine distance** | `haversineMeters()` | High |
| **Game state transitions** | Phase changes (intro → playing → completed) | High |
| **Components** | ClueCard renders clue/hint, LevelProgress shows dots | Medium |
| **API routes** | Request validation, error responses | High (when implemented) |

### Manual Testing Checklist

When testing the game locally:

- [ ] Landing page loads without errors
- [ ] Countdown timer displays correctly
- [ ] Clicking "Explorar" navigates to `/play`
- [ ] Intro screen shows both difficulty options
- [ ] Selecting a difficulty starts the game
- [ ] Street View loads at the correct spawn point
- [ ] Clue card displays the riddle
- [ ] Hint button reveals the hint
- [ ] Correct answer shows green overlay and advances
- [ ] Incorrect answer shakes the input
- [ ] Explorer mode blocks submission when too far
- [ ] All 12 levels complete in sequence
- [ ] Winner screen shows total time
- [ ] "Volver al inicio" navigates home

---

## Common Tasks

### Adding a New Demo Saga

Edit `src/data/demo-saga.ts`:

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

### Adding a New Icon

UBEX uses [Phosphor Icons](https://phosphoricons.com/). Browse the icon catalog, then import:

```typescript
import { NewIcon } from '@phosphor-icons/react';

// Usage
<NewIcon size={24} weight="bold" className="text-amber-500" />
```

Available weights: `thin`, `light`, `regular`, `bold`, `fill`, `duotone`.

### Adding a New Type

Add types to `src/types/index.ts`:

```typescript
export interface NewFeature {
  id: string;
  name: string;
  status: 'active' | 'inactive';
}
```

---

## Troubleshooting

### Street View Shows "Sin cobertura" or Errors

- Verify `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` is set in `.env.local`
- Ensure the Maps JavaScript API and Street View Static API are enabled in Google Cloud Console
- Check the browser console for API key errors
- The spawn coordinates may not have Street View coverage — try nearby coordinates

### `Module not found` Errors

- Run `npm install` to ensure all dependencies are installed
- Verify the import path uses `@/` prefix (e.g., `@/components/game/ClueCard`)
- Check `tsconfig.json` has the path alias: `"@/*": ["./src/*"]`

### Tailwind Classes Not Applying

- Tailwind v4 does not use `tailwind.config.js` — configuration is in `globals.css`
- Ensure `postcss.config.mjs` has `@tailwindcss/postcss` plugin
- Restart the dev server after changing `globals.css`

### Build Fails on GitHub Actions

- The CI uses `next build` with static export (`output: 'export'` in `next.config.ts`)
- Ensure `images.unoptimized` is `true` in `next.config.ts` (required for static export)
- Check that `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` is set as a GitHub secret

### TypeScript Errors with Google Maps

- The `@types/google.maps` package provides type definitions
- If `google.maps` types aren't resolving, restart your IDE / TypeScript server
- The `StreetViewExplorer` component handles all Google Maps API interactions — prefer extending it over creating new Maps components
