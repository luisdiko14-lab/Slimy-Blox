# Replit.md

## Overview
**ADMIN WORLD** is a retro-themed, multiplayer arcade game where every player is automatically granted **Owner** status. Built with a terminal-style cyberpunk aesthetic, it features real-time interaction, admin commands, and a Nintendo-inspired "boot sequence" loading screen.

## Project Vision
- **Multiplayer Admin Fun**: A world where everyone has the power to /kick, /kill, and /announce.
- **Retro Aesthetic**: CRT scanlines, pixel fonts, and glitch effects for a nostalgic 80s/90s terminal feel.
- **Low Friction**: Instant guest access or Replit Auth for permanent identities.

## User Preferences
- **Communication**: Simple, everyday language.
- **Style**: Cyberpunk/Terminal aesthetic with high contrast (Neon on Black).
- **Features**: Mobile-friendly D-pad controls visible on all devices.

## Technical Architecture

### Frontend (client/src/)
- **Framework**: React 18 with TypeScript.
- **Game Engine**: Custom `requestAnimationFrame` loop in `GameWorld.tsx`.
- **UI & Components**: 
  - `shadcn/ui` primitives for interface elements.
  - `framer-motion` for smooth UI transitions and glitch effects.
  - `Tailwind CSS` for utility-based styling.
- **State Management**:
  - `React Query` for backend logs.
  - `useState/useRef` for high-frequency game state (positioning, entities).

### Backend (server/)
- **Runtime**: Node.js with Express and TypeScript.
- **Real-time**: WebSocket (`ws`) server for player synchronization, chat broadcasting, and command execution.
- **Persistence**: 
  - PostgreSQL via Drizzle ORM.
  - Command logs stored for auditing and leaderboard purposes.

### Key Game Systems
- **Command System**: Supports `/kick`, `/kill`, `/tp`, `/speed`, `/size`, `/fly`, `/god`, and `/announce`.
- **Targeting**: Commands like `/kick` support specific player names or `@everyone`.
- **Redirection**: Terminated/Kicked sessions redirect to custom static pages (`kicked.html`, `killed.html`) in the `public/` directory.

## Recent Architectural Changes
- **2026-01-11**: Implemented multi-target kick/kill logic with reason-based redirection.
- **2026-01-11**: Upgraded loading screen to `ADMIN_OS` boot sequence with terminal logs.
- **2026-01-11**: Enabled global chat broadcasting via WebSocket.
- **2026-01-11**: Integrated Replit Auth with automatic Owner rank assignment.

## Navigation & Development
- **Dev Command**: `npm run dev` (Starts Vite and Express).
- **Schema**: Shared types in `shared/schema.ts`.
- **Public Assets**: Static redirect pages in `./public/`.
