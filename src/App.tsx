import * as React from 'react';
import { ApolloProvider } from '@apollo/client/react';
import { apolloClient } from './lib/apollo/client';
import { HomePage } from './components/home/HomePage';
import { AnimeDetailPage } from './components/detail/AnimeDetailPage';
import { AnimatePresence, motion } from 'motion/react';

export default function App() {
  // Navigation state: slug is null on home page, string on anime detail page
  const [selectedSlug, setSelectedSlug] = React.useState<string | null>(() => {
    // Check initial URL hash or path
    const hash = window.location.hash.replace('#/', '').replace('#', '');
    if (hash.startsWith('anime/')) {
      return hash.replace('anime/', '');
    }
    const path = window.location.pathname;
    if (path.startsWith('/anime/')) {
      return path.replace('/anime/', '');
    }
    return null;
  });

  // Sync state with browser URL / hash
  React.useEffect(() => {
    const handlePopState = () => {
      const hash = window.location.hash.replace('#/', '').replace('#', '');
      if (hash.startsWith('anime/')) {
        setSelectedSlug(hash.replace('anime/', ''));
      } else {
        setSelectedSlug(null);
      }
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  const handleSelectAnime = (slug: string) => {
    setSelectedSlug(slug);
    window.location.hash = `/anime/${slug}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToHome = () => {
    setSelectedSlug(null);
    window.location.hash = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <ApolloProvider client={apolloClient}>
      <div className="min-h-screen bg-zinc-950 font-sans text-zinc-100 selection:bg-indigo-500/30 selection:text-indigo-200">
        <AnimatePresence mode="wait">
          {selectedSlug ? (
            <motion.div
              key={selectedSlug}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <AnimeDetailPage
                slug={selectedSlug}
                onBack={handleBackToHome}
                onNavigateToAnime={handleSelectAnime}
              />
            </motion.div>
          ) : (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.2 }}
            >
              <HomePage onSelectAnime={handleSelectAnime} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ApolloProvider>
  );
}


