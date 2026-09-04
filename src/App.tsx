import * as React from 'react';
import { ApolloProvider } from '@apollo/client/react';
import { apolloClient } from './lib/apollo/client';
import { HomePage } from './components/home/HomePage';
import { AnimeDetailPage } from './components/detail/AnimeDetailPage';
import { HellRealmPage } from './components/hell/HellRealmPage';
import { HuecoMundoRealmPage } from './components/huecomundo/HuecoMundoRealmPage';
import { AnimatePresence, motion } from 'motion/react';

export default function App() {
  // Navigation state: 'home' | 'hell' | 'hueco-mundo' | anime slug string
  const [currentView, setCurrentView] = React.useState<string>(() => {
    const hash = window.location.hash.replace('#/', '').replace('#', '');
    if (hash === 'hell') {
      return 'hell';
    }
    if (hash === 'hueco-mundo' || hash === 'huecomundo') {
      return 'hueco-mundo';
    }
    if (hash.startsWith('anime/')) {
      return hash.replace('anime/', '');
    }
    return 'home';
  });

  // Sync state with browser URL / hash
  React.useEffect(() => {
    const handlePopState = () => {
      const hash = window.location.hash.replace('#/', '').replace('#', '');
      if (hash === 'hell') {
        setCurrentView('hell');
      } else if (hash === 'hueco-mundo' || hash === 'huecomundo') {
        setCurrentView('hueco-mundo');
      } else if (hash.startsWith('anime/')) {
        setCurrentView(hash.replace('anime/', ''));
      } else {
        setCurrentView('home');
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
    setCurrentView(slug);
    window.location.hash = `/anime/${slug}`;
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    window.scrollTo(0, 0);
  };

  const handleOpenHellRealm = () => {
    setCurrentView('hell');
    window.location.hash = '#hell';
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    window.scrollTo(0, 0);
  };

  const handleBackToHome = () => {
    setCurrentView('home');
    window.location.hash = '';
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    window.scrollTo(0, 0);
  };

  // Direct render for Hell Realm
  if (currentView === 'hell') {
    return (
      <ApolloProvider client={apolloClient}>
        <div className="min-h-screen bg-zinc-950 font-sans text-zinc-100 selection:bg-indigo-500/30 selection:text-indigo-200">
          <HellRealmPage onBack={handleBackToHome} />
        </div>
      </ApolloProvider>
    );
  }

  // Direct render for Hueco Mundo Realm
  if (currentView === 'hueco-mundo' || currentView === 'huecomundo') {
    return (
      <ApolloProvider client={apolloClient}>
        <div className="h-screen w-full overflow-hidden bg-zinc-950 font-sans text-zinc-100 selection:bg-purple-500/30 selection:text-purple-200">
          <HuecoMundoRealmPage onBack={handleBackToHome} />
        </div>
      </ApolloProvider>
    );
  }

  return (
    <ApolloProvider client={apolloClient}>
      <div className="min-h-screen bg-zinc-950 font-sans text-zinc-100 selection:bg-indigo-500/30 selection:text-indigo-200">
        <AnimatePresence mode="wait">
          {currentView !== 'home' ? (
            <motion.div
              key={currentView}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <AnimeDetailPage
                slug={currentView}
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
              <HomePage
                onSelectAnime={handleSelectAnime}
                onOpenHell={handleOpenHellRealm}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ApolloProvider>
  );
}
