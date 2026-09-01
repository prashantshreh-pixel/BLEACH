# Anime Universe — Interactive Anime Database & Timeline Explorer

An interactive anime knowledge graph, event simulator, and timeline explorer built with React 19, TypeScript, Tailwind CSS, ShadCN UI, Apollo Client (GraphQL), React Flow, and Cytoscape.js.

## Architecture & Visualizations

- **React Flow**: Powers chronological and branching **event timelines** within a single anime (story arcs, pivotal battles, character deaths, power-up milestones, time-skips, and alternate OVA/what-if continuities). Includes a step-by-step chronology simulation player.
- **Cytoscape.js**: Powers **character relationship and faction network graphs** with force-directed (`cose`, `concentric`) and hierarchical (`breadthfirst`) layouts, interactive neighborhood focus, and cross-universe multiverse nexus maps.
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
  cache: new InMemoryCache({ ... }),
});
```

2. GraphQL Schema types and queries are already pre-defined in `src/lib/graphql/queries.ts` and `src/types/index.ts`.
