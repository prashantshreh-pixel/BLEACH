# Anime Universe — Interactive Anime Database & Timeline Explorer

An interactive anime knowledge graph, event simulator, and timeline explorer built with React 19, TypeScript, Tailwind CSS, ShadCN UI, Apollo Client (GraphQL), React Flow, and Cytoscape.js.

## Architecture & Visualizations

- **React Flow**: Powers chronological and branching **event timelines** within a single anime (story arcs, pivotal battles, character deaths, power‑up milestones, time‑skips, and alternate OVA/what‑if continuities). Includes a step‑by‑step chronology simulation player.
- **Cytoscape.js**: Powers **character relationship and faction network graphs** with force‑directed (`cose`, `concentric`) and hierarchical (`breadthfirst`) layouts, interactive neighborhood focus, and cross‑universe multiverse nexus maps.
- **Apollo Client**: Normalized cache layer with separated lightweight home queries (`GetAllAnimesLight`) and heavy rich detail queries (`GetAnimeBySlugHeavy`).

## Running the Application

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Production build
npm run build
```

## UI Refactor & Code Cleanup (June 2026)

- Implemented **Espada‑style full‑screen snap scrolling** for the Royal Realm page (`SoulKingRealmPage`).
- Added smooth scroll‑snap navigation with Prev/Next arrows, progress dots, and a counter.
- **Removed the page footer** entirely – the UI now occupies the full viewport.
- Replaced the old continuous‑track scrolling logic with discrete snap sections, eliminating dead code such as `scrollProgress`, `targetProgressRef`, and related state variables.
- Simplified the Squad Zero block to a single active officer card, removing the now‑unused vertical card track.
- Updated animation variants (`titleVariants`, `cardVariants`, `narrativeVariants`) to work with the new layout.
- Cleaned up imports and removed unused hook calls.

These changes improve performance, simplify the code‑base, and bring the scrolling experience in line with the reference site (https://nickho-motorsports.nl/).

## Connecting a Real GraphQL Backend

To replace the mock Apollo Link with a live GraphQL endpoint:

1. Update `src/lib/apollo/client.ts`:

```typescript
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';

const httpLink = createHttpLink({
  uri: process.env.VITE_GRAPHQL_ENDPOINT || 'https://your-api.com/graphql',
  headers: {
    authorization: `Bearer ${process.env.VITE_GRAPHQL_AUTH_TOKEN || ''}`,
  },
});

export const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache({ /* custom config */ }),
});
```

2. GraphQL schema types and queries are already defined in `src/lib/graphql/queries.ts` and `src/types/index.ts`.
