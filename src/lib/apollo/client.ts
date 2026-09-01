import { ApolloClient, ApolloLink, InMemoryCache, Observable } from '@apollo/client';
import { ANIMES_DATA, ANIMES_LIGHT } from '../../data/animeData';
import { getMainDefinition } from '@apollo/client/utilities';

// Custom Mock Link that intercepts GraphQL operations
const mockLink = new ApolloLink((operation) => {
  return new Observable((observer) => {
    const { operationName, variables } = operation;
    const def = getMainDefinition(operation.query);
    const queryName = def.kind === 'OperationDefinition' ? def.name?.value || operationName : operationName;

    // Simulate realistic network latency (100-200ms) for snappy but observable loading state
    const timer = setTimeout(() => {
      try {
        if (queryName === 'GetAllAnimesLight') {
          let list = [...ANIMES_LIGHT];
          if (variables?.search) {
            const q = (variables.search as string).toLowerCase();
            list = list.filter(
              (a) =>
                a.title.toLowerCase().includes(q) ||
                a.titleJapanese.toLowerCase().includes(q) ||
                a.romaji.toLowerCase().includes(q) ||
                a.genres.some((g) => g.toLowerCase().includes(q)) ||
                a.tags.some((t) => t.toLowerCase().includes(q))
            );
          }
          if (variables?.genre && variables.genre !== 'All') {
            list = list.filter((a) => a.genres.includes(variables.genre));
          }
          if (variables?.studio && variables.studio !== 'All') {
            list = list.filter((a) => a.studio.includes(variables.studio));
          }
          if (variables?.year) {
            list = list.filter((a) => a.year === Number(variables.year));
          }

          observer.next({
            data: {
              animes: list,
            },
          });
          observer.complete();
        } else if (queryName === 'GetAnimeBySlugHeavy') {
          const slug = variables?.slug;
          const anime = ANIMES_DATA.find((a) => a.slug === slug);

          if (anime) {
            observer.next({
              data: {
                anime,
              },
            });
            observer.complete();
          } else {
            observer.error(new Error(`Anime with slug "${slug}" not found in database.`));
          }
        } else {
          // Fallback
          observer.next({ data: {} });
          observer.complete();
        }
      } catch (err) {
        observer.error(err);
      }
    }, 120);

    return () => clearTimeout(timer);
  });
});

export const apolloClient = new ApolloClient({
  link: mockLink,
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          animes: {
            merge(_existing, incoming) {
              return incoming;
            },
          },
        },
      },
      AnimeDetail: {
        keyFields: ['slug'],
      },
      AnimeLight: {
        keyFields: ['slug'],
      },
      TimelineEvent: {
        keyFields: ['id'],
      },
      Character: {
        keyFields: ['id'],
      },
    },
  }),
});
