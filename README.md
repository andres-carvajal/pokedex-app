# Pokédex App

A responsive Pokédex application built with React, TypeScript, and Material UI. Browse, search, and catch Pokémon using data from the [PokéAPI](https://pokeapi.co/).

## Features

- **Browse Pokémon** -- Paginated list with "Load More" for all 1300+ Pokémon
- **Search** -- Real-time client-side filtering by name
- **Detail View** -- Official artwork, types, stats, height, weight, and abilities
- **Catch & Release** -- Build your personal collection, persisted in localStorage
- **Responsive** -- Works on mobile, tablet, and desktop
- **Caching** -- TanStack Query caches all API responses to avoid redundant fetches

## Tech Stack

| Category | Choice | Rationale |
|---|---|---|
| Framework | React 19 + TypeScript | Type safety and modern React features |
| Runtime | Bun | Fast package manager, runtime, and bundler |
| Build tool | Vite | Fast dev server and optimized builds |
| UI library | Material UI (MUI) v7 | Polished component library, bonus requirement |
| Data fetching | TanStack Query v5 | Built-in caching, loading/error states, infinite queries |
| Routing | React Router v7 | Client-side navigation between views |
| State management | React Context | Lightweight, no external deps needed for this scope |
| Persistence | localStorage | Survives tab close and browser restart (see justification below) |
| Testing | Vitest + React Testing Library | Fast, Vite-native test runner |

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) 1.0+

### Installation

```bash
git clone <repo-url>
cd pokedex-app
bun install
```

### Development

```bash
bun run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build

```bash
bun run build
bun run preview
```

### Tests

```bash
bun run test        # watch mode
bun run test:run    # single run
```

## Project Structure

```
src/
  api/              API client functions and TanStack Query hooks
    hooks.ts        usePokemonList, usePokemonDetail, useAllPokemonNames
    pokemonApi.ts   Raw fetch functions for PokeAPI
  components/       Reusable UI components
    Navbar.tsx       App bar with navigation and collection badge
    PokemonCard.tsx  Card component used in list and collection views
    PokemonCardSkeleton.tsx  Loading placeholder
    SearchBar.tsx    Search input with MUI TextField
    ScrollToTop.tsx  Scrolls to top on route change
    TypeChip.tsx     Colored chip for Pokemon types
  context/          React Context for global state
    CaughtPokemonContext.tsx  Caught Pokemon state + localStorage sync
  pages/            Route-level page components
    PokemonListPage.tsx   Main list with search and pagination
    PokemonDetailPage.tsx Detail view with stats and catch button
    CollectionPage.tsx    User's caught Pokemon collection
  theme/            MUI theme configuration
  types/            TypeScript type definitions
  utils/            Utility functions (type colors)
```

## Architecture Decisions

### localStorage vs sessionStorage

**Choice: localStorage**

The caught Pokémon collection should persist across browser sessions. When a user catches Pokémon and closes the browser, they expect their collection to still be there when they return. `localStorage` persists data until explicitly cleared, while `sessionStorage` is cleared when the tab or browser closes. For a collection feature, `localStorage` is the correct choice.

### Data Fetching Strategy

The PokeAPI list endpoint (`/api/v2/pokemon`) only returns names and URLs -- not sprites or types. Instead of making N individual requests just for the list view, we derive the sprite URL directly from the Pokémon ID:

```
https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/{id}.png
```

This means:
- **List view**: 1 API call (paginated, 24 items per page)
- **Search**: 1 API call to fetch all names, then client-side filtering
- **Detail view**: 1 API call per Pokémon (cached by TanStack Query)

TanStack Query provides automatic caching with a 10-minute stale time, so revisiting a previously viewed Pokémon doesn't trigger a new API request.

### State Management

React Context + `useReducer`-style hooks are sufficient for this app's scope. The only global state is the caught Pokémon collection. API data is managed entirely by TanStack Query (not duplicated in global state).

## AI Usage

This project was built with assistance from **Cursor IDE** with **Claude** (Anthropic's AI assistant). AI was used for:

- **Architecture planning**: Defining the folder structure, tech stack decisions, and API strategy
- **Code generation**: Generating component implementations, API hooks, type definitions, and tests
- **Code review**: Identifying potential issues and suggesting improvements

All AI-generated code was reviewed and understood before inclusion. The development process involved iterative refinement through conversation with the AI assistant.

## Scripts

| Command | Description |
|---|---|
| `bun run dev` | Start development server |
| `bun run build` | Type-check and build for production |
| `bun run preview` | Preview production build locally |
| `bun run test` | Run tests in watch mode |
| `bun run test:run` | Run tests once |
| `bun run lint` | Run ESLint |

## Live Version
Visit the following [link](https://pokedex-app-gules-six.vercel.app).