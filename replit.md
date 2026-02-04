# Arshdeep Singh — Cybersecurity Portfolio

## Overview

A modern, SOC-themed cybersecurity portfolio website for Arshdeep Singh, a B.Tech CSE (Cybersecurity specialization) student and Cybersecurity Trainer. The application presents portfolio data through a dark, neon-accented dashboard aesthetic with animated effects, featuring sections for security alerts, projects, experience, certifications, labs, and achievements.

The stack is a full-stack TypeScript monorepo with React frontend (Vite), Express backend, PostgreSQL database with Drizzle ORM, and shadcn/ui components styled with Tailwind CSS.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript, bundled by Vite
- **Routing**: Wouter (lightweight client-side router)
- **State Management**: TanStack Query for server state; local React state for UI
- **Styling**: Tailwind CSS with CSS variables for theming; dark cybersecurity theme with neon accents (cyan, purple)
- **UI Components**: shadcn/ui (Radix primitives) with custom glass/neon styling utilities
- **Animations**: Framer Motion for page transitions and hover effects
- **Path Aliases**: `@/` maps to `client/src/`, `@shared/` maps to `shared/`

### Backend Architecture
- **Framework**: Express 5 on Node.js with TypeScript
- **API Pattern**: RESTful JSON API under `/api/` prefix
- **Validation**: Zod schemas defined in `shared/routes.ts`; shared between client and server
- **Build**: esbuild bundles server for production; Vite builds client to `dist/public`

### Data Layer
- **Database**: PostgreSQL (connection via `DATABASE_URL` environment variable)
- **ORM**: Drizzle ORM with schema in `shared/schema.ts`
- **Migrations**: Drizzle Kit (`drizzle-kit push` via `npm run db:push`)
- **Tables**: users, portfolio_alerts, portfolio_projects, portfolio_certifications, portfolio_experience, portfolio_achievements, portfolio_labs

### API Structure
All routes defined in `shared/routes.ts` with Zod input/output schemas:
- `GET /api/portfolio/overview` — aggregated dashboard data
- `/api/alerts` — CRUD for security alerts with filtering (severity, status, suppressed, search)
- `/api/projects` — CRUD for portfolio projects
- `/api/certifications`, `/api/experience`, `/api/achievements`, `/api/labs` — CRUD for respective entities

### Key Design Patterns
- **Shared Types**: Schema and route definitions live in `shared/` folder, consumed by both client and server
- **Type-safe API Calls**: Client hooks validate responses against Zod schemas
- **Component Composition**: Reusable primitives (KpiCard, SectionHeader, SeverityBadge) compose into pages
- **Drawer/Dialog Pattern**: Detail views open in drawers; create/edit forms in dialogs

## External Dependencies

### Database
- PostgreSQL database required; connection string via `DATABASE_URL` environment variable

### Third-Party Services
- None currently integrated (no auth providers, payment, or external APIs)

### Key NPM Packages
- **UI**: @radix-ui/* primitives, framer-motion, lucide-react icons
- **Data**: @tanstack/react-query, drizzle-orm, drizzle-zod, zod
- **Server**: express, pg, connect-pg-simple
- **Build**: vite, esbuild, tsx

### Fonts (External CDN)
- Google Fonts: Rajdhani, IBM Plex Sans, IBM Plex Mono, Fira Code