# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is "Heuristics" - an interactive UX/UI education platform that teaches users about fundamental UX laws and principles through gamified interactive simulations and playgrounds.

## Common Commands

```bash
# Start development server (port 8080)
npm run dev

# Build for production
npm run build

# Run linter
npm run lint

# Run tests once
npm run test

# Run tests in watch mode
npm run test:watch

# Preview production build
npm run preview
```

## Architecture

### Technology Stack
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite 5 with React SWC plugin
- **Styling**: Tailwind CSS 3.4 with custom CSS variables
- **UI Components**: shadcn/ui (50+ Radix UI-based components in `src/components/ui/`)
- **Animations**: Framer Motion
- **Routing**: React Router DOM v6
- **State**: React Context for local state, TanStack Query for server state
- **Backend**: Supabase (auth, database, edge functions for AI chat)

### Project Structure

```
src/
├── components/
│   ├── ui/              # shadcn/ui components (Button, Card, Dialog, etc.)
│   ├── Layout.tsx       # Main layout with navigation
│   ├── AIChatbot.tsx    # Context-aware AI assistant
│   ├── InsightCursor.tsx # Custom cursor effects
│   ├── XPTracker.tsx    # Gamification display
│   └── QuizModal.tsx    # Quiz interface
├── pages/               # One page per UX law
│   ├── Index.tsx        # Homepage listing all laws
│   ├── FittsLaw.tsx     # Interactive demos...
│   ├── HicksLaw.tsx
│   └── ... (13 total law pages)
├── context/
│   ├── GameContext.tsx  # XP, levels, progress (persisted to localStorage)
│   └── ThemeContext.tsx # Dark/light mode
├── hooks/               # Custom React hooks
├── lib/utils.ts         # Utility functions (cn helper for Tailwind)
└── integrations/supabase/ # Supabase client and types
```

### Routing

Routes are defined in `App.tsx`. Each UX law has its own route:
- `/` - Homepage
- `/fitts`, `/hicks`, `/millers`, `/von-restorff`, `/zeigarnik`, `/aesthetic-usability`, `/doherty`, `/proximity`, `/teslers`, `/peak-end`, `/dark-patterns`, `/accessibility`, `/typography` - Individual law pages

### Gamification System

The `GameContext` manages:
- **XP Points**: Earned by completing interactions and quizzes
- **Levels**: Novice (0 XP) → Apprentice (200 XP) → UX Architect (500 XP)
- **Progress Tracking**: Completed laws and quiz results persisted to localStorage

### Key Patterns

1. **Page Structure**: Each law page follows a similar pattern:
   - Hero section with law explanation
   - Interactive playground/demo
   - Quiz section with `QuizModal`
   - Call to action to explore other laws

2. **Styling**: Uses Tailwind with CSS variables for theming. The `cn()` utility in `lib/utils.ts` merges Tailwind classes.

3. **Components**: shadcn/ui components are in `src/components/ui/` and can be imported via `@/components/ui/{component}`.

4. **Path Aliases**: `@/` maps to `./src/` (configured in `vite.config.ts` and `tsconfig.json`).

### External Integrations

- **Supabase**: Used for AI chatbot (edge function at `supabase/functions/chat/`)
- **Lovable**: Project was created with Lovable platform (tagger plugin in vite config)
