# Granthalay Publisher Dashboard — Project Guide

`granth-pub` is the publisher portal for [Granthalay](https://github.com/SamsterZero/Granthalay). It provides publishers and independent authors with tools to publish EPUB books, manage catalog metadata, set pricing, track distribution, and review performance analytics.

## Ecosystem & Architecture

```
                                  ┌────────────────────────┐
                                  │   Granthalay Reader    │
                                  │  (Privacy-first PWA)   │
                                  └───────────┬────────────┘
                                              │ Optional Store API
                                              ▼
┌────────────────────────┐         ┌────────────────────────┐
│  Publisher Dashboard   │────────>│     Granthalay API     │
│      (granth-pub)      │  REST   │ (Spring Boot Modulith) │
└────────────────────────┘         └────────────────────────┘
```

- **Frontend Tech Stack**: Built with SvelteKit and Svelte 5 runes (`$state`, `$derived`, `$props`), TypeScript, Tailwind CSS v4, Better Auth, and Drizzle ORM.
- **Backend Interoperability**: Integrates with [granthalayapi](https://github.com/SamsterZero/granthalayapi) — a Spring Boot Modulith — via `/api/v1` HTTP APIs for catalog sync, entitlements, and analytics.
- **Publisher Autonomy**: Publishers own their catalog metadata, pricing models, book assets, and release schedules.
- **Privacy Boundaries**: Reader activity remains anonymous on local reader devices; publisher analytics represent privacy-preserving aggregates provided by the backend.

## Development Setup & Commands

### Prerequisites

- [Bun](https://bun.sh/) (v1.1+)
- [Docker](https://www.docker.com/) (for PostgreSQL database)

### Commands

```sh
bun install      # Install dependencies
bun run db:start # Start local database container
bun run db:push  # Push Drizzle schema to local database
bun run dev      # Start SvelteKit development server
bun run check    # Type-check Svelte components & TypeScript
bun run lint     # Run Prettier formatting check and ESLint
bun run format   # Format code automatically with Prettier
bun run test     # Execute unit and end-to-end tests
```
