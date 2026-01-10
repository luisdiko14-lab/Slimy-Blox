# Replit.md

## Overview

This is a retro-themed multiplayer arcade game built as a full-stack TypeScript application. The project features a 2D game world with player movement, rank-based permissions, and real-time multiplayer via WebSockets. The game has a cyberpunk/terminal aesthetic with custom fonts and neon color schemes.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: React Query for server state, React useState/useRef for local game state
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **UI Components**: shadcn/ui component library (Radix UI primitives)
- **Animations**: Framer Motion for smooth UI transitions
- **Build Tool**: Vite with HMR support

The frontend is located in `client/src/` with the main entry point at `client/src/main.tsx`. The game world component at `client/src/components/GameWorld.tsx` uses requestAnimationFrame for the game loop.

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript (compiled with tsx for development, esbuild for production)
- **API Design**: REST endpoints defined in `shared/routes.ts` with Zod validation
- **Real-time**: WebSocket server (ws library) for multiplayer synchronization

The server is located in `server/` with the entry point at `server/index.ts`. Routes are registered in `server/routes.ts`.

### Data Storage
- **Database**: PostgreSQL via Drizzle ORM
- **Schema Location**: `shared/schema.ts` (shared between client and server)
- **Migrations**: Drizzle Kit with output to `./migrations`
- **Session Storage**: connect-pg-simple for PostgreSQL-backed sessions

The database stores command logs with timestamps, tracking user commands and their rank levels.

### Shared Code Pattern
The `shared/` directory contains code used by both frontend and backend:
- `schema.ts`: Database table definitions and Zod schemas
- `routes.ts`: API route definitions with type-safe request/response schemas

### Build Configuration
- Development: `npm run dev` runs tsx for hot-reloading
- Production: `npm run build` uses Vite for client, esbuild for server bundling
- Database: `npm run db:push` applies schema changes via Drizzle Kit

## External Dependencies

### Database
- **PostgreSQL**: Primary database accessed via `DATABASE_URL` environment variable
- **Drizzle ORM**: Type-safe database queries and schema management

### Real-time Communication
- **WebSocket (ws)**: Native WebSocket server for multiplayer game state synchronization
- Players broadcast their position, rank, and effects to other connected clients

### UI Framework Dependencies
- **Radix UI**: Headless UI primitives for accessible components
- **shadcn/ui**: Pre-styled component library built on Radix
- **Tailwind CSS**: Utility-first CSS framework with custom theme

### Key NPM Packages
- `@tanstack/react-query`: Data fetching and caching
- `framer-motion`: Animation library
- `zod`: Runtime type validation
- `drizzle-zod`: Automatic Zod schema generation from Drizzle tables
- `wouter`: Lightweight React router