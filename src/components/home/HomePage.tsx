import * as React from 'react';
import { useQuery } from '@apollo/client/react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
// @ts-ignore
import simpleParallax from 'simple-parallax-js';
import soulKingPalaceImg from '../../Soul King Palace.jpg';
import { GET_ALL_ANIMES_LIGHT } from '../../lib/graphql/queries';
import { AnimeLight } from '../../types';
import { AnimeCard } from './AnimeCard';
import { Skeleton } from '../ui/skeleton';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  Search, 
  SlidersHorizontal, 
  Sparkles, 
  Compass, 
  X, 
  RefreshCw,
  Film,
  Zap,
  BookOpen,
  LayoutGrid,
  Table as TableIcon,
  GitBranch,
  Users,
  Shield,
  Clock,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Database,
  Library,
  Flame,
  Radio,
  Star,
  Tv,
  CheckCircle2,
  ArrowUpRight,
  Award,
  Crown
} from 'lucide-react';

interface HomePageProps {
  onSelectAnime: (slug: string) => void;
}

const NAV_LINKS = ['Projects', 'Studio', 'Offerings', 'Inquire'];

const POWER_SYSTEM_FILTERS = [
  { label: 'All Systems', value: 'All' },
  { label: 'Zanpakutō (Shikai & Bankai)', value: 'Zanpakutō' },
  { label: 'Quincy Schrift & Reishi', value: 'Quincy' },
  { label: 'Hollow & Resurrección', value: 'Hollow' },
  { label: 'Royal Realm (Squad 0)', value: 'Squad 0' },
  { label: 'Muken & Kido Seals', value: 'Kido' },
];

const HISTORICAL_LORE_EVENTS = [
  {
    slug: 'bleach-tybw',
    universe: 'Bleach: TYBW',
    date: 'TYBW Day 1',
    title: 'Wandenreich Declaration of War & Sasakibe Slain',
    badge: 'War Declared',
    color: 'border-red-500/50 text-red-400 bg-red-950/40'
  },
  {
    slug: 'bleach-tybw',
    universe: 'Bleach: TYBW',
    date: 'Seireitei Inferno',
    title: 'Yamamoto Bankai: Zanka no Tachi Incineration',
    badge: 'Bankai Unleashed',
    color: 'border-amber-500/50 text-amber-400 bg-amber-950/40'
  },
  {
    slug: 'bleach-tybw',
    universe: 'Bleach: TYBW',
    date: 'Karakura Flashback',
    title: 'Everything But the Rain: Masaki & Isshin Lineage',
    badge: 'Origin Lore',
    color: 'border-purple-500/50 text-purple-400 bg-purple-950/40'
  },
  {
    slug: 'bleach-tybw',
    universe: 'Bleach: TYBW',
    date: 'Squad 0 Realm',
    title: 'Reforging Zangetsu: The Blade is Me Dual Blades',
    badge: 'True Power',
    color: 'border-cyan-500/50 text-cyan-400 bg-cyan-950/40'
  },
  {
    slug: 'bleach-tybw',
    universe: 'Bleach: TYBW',
    date: 'Second Invasion',
    title: 'Rukia Bankai: Hakka no Togame Absolute Zero',
    badge: 'Absolute Zero',
    color: 'border-emerald-500/50 text-emerald-400 bg-emerald-950/40'
  },
  {
    slug: 'bleach-tybw',
    universe: 'Bleach: TYBW',
    date: 'Wahrwelt Siege',
    title: 'Yhwach Absorbs Soul King & Unlocks The Almighty',
    badge: 'Cataclysm',
    color: 'border-rose-500/50 text-rose-400 bg-rose-950/40'
  }
];

export function HomePage({ onSelectAnime }: HomePageProps) {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedPowerSystem, setSelectedPowerSystem] = React.useState('All');
  const [selectedStudio, setSelectedStudio] = React.useState('All');
  const [selectedSort, setSelectedSort] = React.useState<'rank' | 'score' | 'events' | 'episodes'>('rank');
  const [viewMode, setViewMode] = React.useState<'grid' | 'table'>('grid');

  // simpleParallax.js Image Ref
  const simpleParallaxRef = React.useRef<HTMLImageElement>(null);

  React.useEffect(() => {
    let instance: any = null;
    if (simpleParallaxRef.current) {
      try {
        instance = new simpleParallax(simpleParallaxRef.current, {
          scale: 1.5,
          delay: 0.6,
          transition: 'cubic-bezier(0,0,0.1,1)',
          orientation: 'up',
          overflow: false,
        });
      } catch (err) {
        console.warn('simpleParallax init:', err);
      }
    }

    return () => {
      if (instance && typeof instance.destroy === 'function') {
        instance.destroy();
      }
    };
  }, []);

  // Parallax Scroll Animations
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 800], [0, 220]);
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0.05]);
  const bgScale = useTransform(scrollY, [0, 1000], [1, 1.25]);

  // Apollo Lightweight Query
  const { data, loading, error, refetch } = useQuery<{ animes: AnimeLight[] }>(GET_ALL_ANIMES_LIGHT, {
    fetchPolicy: 'cache-first',
  });

  const rawAnimes = data?.animes || [];

  // Filter and sort animes
  const filteredAnimes = React.useMemo(() => {
    return rawAnimes
      .filter((anime) => {
        // Query search
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = anime.title.toLowerCase().includes(q);
          const matchJp = anime.titleJapanese?.toLowerCase().includes(q);
          const matchRomaji = anime.romaji?.toLowerCase().includes(q);
          const matchStudio = anime.studio.toLowerCase().includes(q);
          const matchTags = anime.tags?.some((t) => t.toLowerCase().includes(q));
          const matchGenres = anime.genres.some((g) => g.toLowerCase().includes(q));
          if (!matchTitle && !matchJp && !matchRomaji && !matchStudio && !matchTags && !matchGenres) {
            return false;
          }
        }

        // Power System filter
        if (selectedPowerSystem !== 'All') {
          const matchTag = anime.tags?.some((t) => t.toLowerCase().includes(selectedPowerSystem.toLowerCase()));
          const matchGenre = anime.genres.some((g) => g.toLowerCase().includes(selectedPowerSystem.toLowerCase()));
          if (!matchTag && !matchGenre) return false;
        }

        // Studio filter
        if (selectedStudio !== 'All' && !anime.studio.toLowerCase().includes(selectedStudio.toLowerCase())) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (selectedSort === 'score') return b.score - a.score;
        if (selectedSort === 'events') return b.timelineEventCount - a.timelineEventCount;
        if (selectedSort === 'episodes') return b.episodes - a.episodes;
        return a.rank - b.rank;
      });
  }, [rawAnimes, searchQuery, selectedPowerSystem, selectedStudio, selectedSort]);

  const scrollToCodex = () => {
    const element = document.getElementById('anime-codex-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100 flex flex-col justify-between selection:bg-white selection:text-black">
      {/* VANGUARD FULLSCREEN HERO SECTION WITH PARALLAX */}
      <section className="relative w-full h-screen min-h-screen overflow-hidden bg-black text-white flex flex-col justify-between select-none">
        {/* Ultra-Premium Parallax Ambient Dark Mesh Gradient Background */}
        <motion.div style={{ scale: bgScale }} className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black via-zinc-950 to-black z-0" />
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] bg-gradient-to-tr from-indigo-900/35 via-purple-900/25 to-amber-600/20 rounded-full blur-[160px] pointer-events-none z-0" />
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none z-0" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-600/15 rounded-full blur-[140px] pointer-events-none z-0" />
        </motion.div>

        {/* Minimal Hero Header Brand Tag */}
        <div className="relative z-20 w-full px-6 sm:px-10 lg:px-16 pt-8 pb-4 flex items-center justify-between">
          <a href="#" className="font-podium text-2xl sm:text-3xl font-bold tracking-wider text-white uppercase opacity-90 hover:opacity-100 transition-opacity">
            BLEACH × VANGUARD
          </a>
          <span className="font-inter text-xs tracking-widest uppercase text-white/50 border border-white/20 px-3 py-1 hidden sm:inline-block">
            THOUSAND-YEAR BLOOD WAR CODEX
          </span>
        </div>

        {/* Parallax Hero Content */}
        <motion.main
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative z-10 px-6 sm:px-10 lg:px-16 flex-1 flex flex-col justify-center max-w-7xl w-full mx-auto my-auto py-6 sm:py-10"
        >
          {/* 1. Tagline */}
          <div className="animate-fade-up flex items-center gap-2 text-white/70 text-xs sm:text-sm font-inter tracking-[0.3em] uppercase mb-6 lg:mb-8">
            <Crown className="w-4 h-4 text-white/70 shrink-0" />
            <span>SOUL SOCIETY • GOTEI 13 • WANDENREICH • HUECO MUNDO</span>
          </div>

          {/* 2. Main Heading */}
          <h1 className="animate-fade-up-delay-1 font-podium text-white uppercase leading-[0.92] tracking-tight text-[clamp(2.8rem,8vw,7rem)] flex flex-col">
            <span>BANKAI.</span>
            <span>SEIREITEI.</span>
            <span>CONQUER.</span>
          </h1>

          {/* 3. Subtext */}
          <p className="animate-fade-up-delay-2 text-white/70 text-sm sm:text-base font-inter leading-relaxed max-w-md mt-6 lg:mt-8">
            The definitive architectural codex for Bleach lore,
            <br />
            Gotei 13 captain hierarchies, Zanpakutō powers, and <strong className="font-bold text-white">the Thousand-Year Blood War.</strong>
          </p>

          {/* 4. Soul Society Badge */}
          <div className="animate-fade-up-delay-3 mt-8 lg:mt-10 flex items-center gap-3">
            <Award className="w-8 h-8 text-amber-400/80 shrink-0" />
            <div className="text-white/60 text-xs tracking-wider uppercase font-inter leading-snug">
              <div className="text-amber-400 font-bold">Grade 1 Canon</div>
              <div>Soul Society Archive</div>
            </div>
          </div>

          <div className="animate-fade-up-delay-4 mt-8 sm:mt-10 lg:mt-14 flex flex-wrap gap-6 sm:gap-12 lg:gap-16 pb-4 sm:pb-8 lg:pb-12">
            <div>
              <div className="font-inter text-white text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
                13
              </div>
              <div className="text-white/50 text-[9px] sm:text-xs tracking-widest uppercase mt-1 font-inter">
                Squads Mapped
              </div>
            </div>
            <div>
              <div className="font-inter text-white text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
                1,000+ Yrs
              </div>
              <div className="text-white/50 text-[9px] sm:text-xs tracking-widest uppercase mt-1 font-inter">
                Quincy War Epoch
              </div>
            </div>
            <div>
              <div className="font-inter text-white text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
                100%
              </div>
              <div className="text-white/50 text-[9px] sm:text-xs tracking-widest uppercase mt-1 font-inter">
                Canon Verified
              </div>
            </div>
          </div>
        </motion.main>

        {/* Seamless Blending Gradient Edge Overlay */}
        <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-black via-black/90 to-transparent z-10 pointer-events-none" />
      </section>

      {/* ANIME UNIVERSE WIKI & CODEX SECTION WITH SEAMLESS BLENDED TRANSITION */}
      <div id="anime-codex-section" className="relative z-20 bg-black text-white -mt-16 pt-12">
        <main className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-8 space-y-16">
          <section className="relative border-b border-white/10 pb-12">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
              <div className="space-y-4 max-w-3xl">
                <div className="font-inter text-xs tracking-[0.3em] uppercase text-white/50 flex items-center gap-2">
                  <span>01</span>
                  <span className="w-8 h-px bg-white/30" />
                  <span>Curated Lore Repository</span>
                </div>
                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-podium uppercase tracking-tight text-white leading-none">
                  INDEXED UNIVERSES.
                </h2>
                <p className="text-sm sm:text-base font-inter text-white/70 leading-relaxed max-w-2xl">
                  The definitive architectural encyclopedia for anime timelines, character faction hierarchies, and branching multiverse causality.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 lg:gap-8 pt-4 lg:pt-0">
                <div className="border-l border-white/20 pl-4">
                  <span className="text-[10px] font-inter uppercase tracking-widest text-white/40 block">Canon Accuracy</span>
                  <span className="text-2xl font-inter font-bold text-white tracking-tight">94.2%</span>
                </div>
                <div className="border-l border-white/20 pl-4">
                  <span className="text-[10px] font-inter uppercase tracking-widest text-white/40 block">Timeline Span</span>
                  <span className="text-2xl font-inter font-bold text-white tracking-tight">2,000+ YRS</span>
                </div>
                <div className="border-l border-white/20 pl-4">
                  <span className="text-[10px] font-inter uppercase tracking-widest text-white/40 block">Factions</span>
                  <span className="text-2xl font-inter font-bold text-white tracking-tight">28 GROUPS</span>
                </div>
                <div className="border-l border-white/20 pl-4">
                  <span className="text-[10px] font-inter uppercase tracking-widest text-white/40 block">Cache Status</span>
                  <span className="text-2xl font-inter font-bold text-white tracking-tight">VERIFIED</span>
                </div>
              </div>
            </div>

            {/* Historical Turning Points Bar */}
            <div className="mt-10 pt-8 border-t border-white/10">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                <span className="text-xs font-inter font-semibold uppercase tracking-widest text-white/80">
                  CAUSAL ANCHORS // QUICK TIMELINE JUMP:
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {HISTORICAL_LORE_EVENTS.map((evt) => (
                  <button
                    key={evt.title}
                    onClick={() => onSelectAnime(evt.slug)}
                    className="flex items-center justify-between p-3 bg-zinc-950 border border-white/10 hover:border-white/40 transition-all duration-300 text-left group cursor-pointer"
                  >
                    <div className="overflow-hidden pr-2">
                      <div className="flex items-center gap-2 text-[10px] font-inter uppercase text-white/50 tracking-wider">
                        <span className="text-white font-semibold">{evt.universe}</span>
                        <span>•</span>
                        <span>{evt.date}</span>
                      </div>
                      <p className="text-xs font-inter font-bold text-white group-hover:text-zinc-300 truncate mt-1">
                        {evt.title}
                      </p>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-white/40 group-hover:text-white shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* ROYAL REALM // SOUL KING PALACE PARALLAX SHOWCASE */}
          <section className="relative w-full rounded-3xl overflow-hidden border border-white/20 bg-black my-8 group shadow-[0_0_50px_rgba(0,0,0,0.9)]">
            <div className="relative aspect-[21/9] sm:aspect-[21/8] w-full overflow-hidden">
              <img
                ref={simpleParallaxRef}
                src={soulKingPalaceImg}
                alt="Soul King Palace (霊王宮)"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none z-10" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/80 pointer-events-none z-10" />
            </div>

            {/* Parallax Content Overlay */}
            <div className="absolute bottom-6 sm:bottom-10 left-6 sm:left-12 right-6 sm:right-12 z-20 flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <div className="font-inter text-xs tracking-[0.3em] uppercase text-amber-400 font-semibold flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>ROYAL REALM // 霊王宮</span>
                </div>
                <h3 className="font-podium text-3xl sm:text-4xl lg:text-5xl uppercase tracking-tight text-white leading-none">
                  SOUL KING PALACE.
                </h3>
                <p className="text-xs sm:text-sm font-inter text-white/80 leading-relaxed max-w-xl">
                  Floating above Soul Society in the Royal Realm, guarded by the elite Squad 0. The ultimate focal point of spiritual causality in the Thousand-Year Blood War.
                </p>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <div className="border border-white/20 bg-black/80 backdrop-blur-md px-4 py-2 text-center rounded">
                  <span className="text-[9px] font-inter uppercase text-white/50 block">Sanctuary</span>
                  <span className="font-podium text-sm text-white">SQUAD 0</span>
                </div>
                <div className="border border-white/20 bg-black/80 backdrop-blur-md px-4 py-2 text-center rounded">
                  <span className="text-[9px] font-inter uppercase text-white/50 block">Reishi Dimension</span>
                  <span className="font-podium text-sm text-amber-400">ROYAL REALM</span>
                </div>
              </div>
            </div>
          </section>

          {/* Search Matrix & Minimal Filters */}
          <section className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h3 className="text-2xl font-podium uppercase tracking-wide text-white">
                  REPOSITORY ARCHIVE ({filteredAnimes.length})
                </h3>
                <p className="text-xs font-inter text-white/50 tracking-wider mt-1">
                  Filter by metaphysics, studio, or search series title.
                </p>
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-3">
                <span className="text-xs font-inter uppercase tracking-widest text-white/40">Sort:</span>
                <select
                  value={selectedSort}
                  onChange={(e) => setSelectedSort(e.target.value as any)}
                  className="bg-black border border-white/20 text-xs font-inter uppercase tracking-wider text-white px-3 py-2 outline-none focus:border-white/60 cursor-pointer"
                >
                  <option value="rank" className="bg-black text-white">Canon Rank</option>
                  <option value="score" className="bg-black text-white">Highest Score</option>
                  <option value="events" className="bg-black text-white">Most Timeline Nodes</option>
                  <option value="episodes" className="bg-black text-white">Episode Count</option>
                </select>
              </div>
            </div>

            {/* Minimal Search Bar */}
            <div className="relative w-full">
              <div className="relative flex items-center w-full bg-black border-b border-white/30 focus-within:border-white transition-colors">
                <Search className="w-5 h-5 text-white/40 ml-2 shrink-0" />
                <input
                  type="text"
                  placeholder="SEARCH BY TITLE, JAPANESE KANJI, STUDIO, OR POWER SYSTEM..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent px-4 py-4 text-xs sm:text-sm font-inter tracking-wider text-white placeholder-white/40 outline-none uppercase"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="p-2 text-white/50 hover:text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Metaphysics Filter Tabs */}
              <div className="mt-4 flex items-center flex-wrap gap-2">
                <span className="text-xs font-inter uppercase tracking-widest text-white/40 mr-2">
                  Metaphysics:
                </span>
                {POWER_SYSTEM_FILTERS.map((f) => (
                  <button
                    key={f.value}
                    onClick={() => setSelectedPowerSystem(f.value)}
                    className={`text-xs font-inter uppercase tracking-wider px-3 py-1 transition-all cursor-pointer ${
                      selectedPowerSystem === f.value
                        ? 'bg-white text-black font-semibold'
                        : 'border border-white/20 text-white/60 hover:text-white hover:border-white/40'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Results Render */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <Skeleton key={n} className="h-96 rounded bg-zinc-900" />
                ))}
              </div>
            ) : filteredAnimes.length === 0 ? (
              <div className="border border-white/10 p-16 text-center space-y-4">
                <p className="text-xs font-inter uppercase tracking-widest text-white/40">
                  NO INDEXED SERIES MATCHED YOUR SEARCH "{searchQuery}"
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedPowerSystem('All');
                    setSelectedStudio('All');
                  }}
                  className="font-inter text-xs tracking-widest uppercase border-white/30 text-white"
                >
                  Reset Filters
                </Button>
              </div>
            ) : viewMode === 'grid' ? (
              /* Cards Grid */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
                {filteredAnimes.map((anime, index) => (
                  <AnimeCard
                    key={anime.id}
                    anime={anime}
                    onClick={onSelectAnime}
                    index={index}
                  />
                ))}
              </div>
            ) : (
              /* Editorial Index Table */
              <div className="border border-white/10 bg-black overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-inter text-white">
                    <thead className="border-b border-white/20 text-[10px] uppercase tracking-widest text-white/50 bg-zinc-950">
                      <tr>
                        <th className="p-4">Rank</th>
                        <th className="p-4">Series Title</th>
                        <th className="p-4">Original Kanji</th>
                        <th className="p-4">Studio</th>
                        <th className="p-4">Year</th>
                        <th className="p-4">Score</th>
                        <th className="p-4">Nodes</th>
                        <th className="p-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      {filteredAnimes.map((anime) => (
                        <tr
                          key={anime.id}
                          onClick={() => onSelectAnime(anime.slug)}
                          className="hover:bg-zinc-900/80 transition-colors cursor-pointer group"
                        >
                          <td className="p-4 font-bold text-white/60">
                            #{anime.rank}
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={anime.posterUrl}
                                alt={anime.title}
                                className="h-10 w-8 object-cover border border-white/20 shrink-0"
                              />
                              <div>
                                <p className="font-podium uppercase text-sm text-white group-hover:text-zinc-300 transition-colors tracking-wide">
                                  {anime.title}
                                </p>
                                <span className="text-[10px] text-white/50 block tracking-wider uppercase">
                                  {anime.episodes} episodes
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 text-white/60">
                            {anime.titleJapanese}
                          </td>
                          <td className="p-4 text-white/80">
                            {anime.studio}
                          </td>
                          <td className="p-4 text-white/60">
                            {anime.year}
                          </td>
                          <td className="p-4 font-bold text-amber-400">
                            ★ {anime.score}
                          </td>
                          <td className="p-4 font-bold text-indigo-300">
                            {anime.timelineEventCount} nodes
                          </td>
                          <td className="p-4 text-right">
                            <span className="font-inter text-xs tracking-widest uppercase text-white/60 group-hover:text-white flex items-center justify-end gap-1">
                              EXPLORE <ArrowUpRight className="w-3.5 h-3.5" />
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </section>

          {/* Editorial Manifesto Section */}
          <section id="manifesto-section" className="border-t border-white/10 pt-12 space-y-8">
            <div className="font-inter text-xs tracking-[0.3em] uppercase text-white/50 flex items-center gap-2">
              <span>02</span>
              <span className="w-8 h-px bg-white/30" />
              <span>THE ZANPAKUTŌ &amp; METAPHYSICS MANIFESTO</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="border border-white/10 p-6 space-y-3 bg-zinc-950">
                <div className="font-podium text-3xl text-white/30">01.</div>
                <h4 className="font-podium text-xl uppercase tracking-wide text-white">
                  BANKAI &amp; REISHI DENSITY
                </h4>
                <p className="text-xs font-inter text-white/60 leading-relaxed">
                  Soul Reapers imprint their soul onto an Asauchi blade. Unleashing Bankai multiplies combat power 5-to-10 fold, fundamentally altering surrounding Reishi density.
                </p>
              </div>

              <div className="border border-white/10 p-6 space-y-3 bg-zinc-950">
                <div className="font-podium text-3xl text-white/30">02.</div>
                <h4 className="font-podium text-xl uppercase tracking-wide text-white">
                  QUINCY SCHRIFT &amp; THE ALMIGHTY
                </h4>
                <p className="text-xs font-inter text-white/60 leading-relaxed">
                  Yhwach grants sacred alphabetic letters (Schrifts) via his blood. The Almighty enables him to perceive every possible future timeline and rewrite reality at will.
                </p>
              </div>

              <div className="border border-white/10 p-6 space-y-3 bg-zinc-950">
                <div className="font-podium text-3xl text-white/30">03.</div>
                <h4 className="font-podium text-xl uppercase tracking-wide text-white">
                  THE BLADE IS ME (HYBRID SOUL)
                </h4>
                <p className="text-xs font-inter text-white/60 leading-relaxed">
                  By accepting both his Quincy spirit and White Hollow drive as true components of his soul, Ichigo transcends standard Zanpakutō limits into dual blades.
                </p>
              </div>
            </div>
          </section>
        </main>

        {/* Minimalist Editorial Footer */}
        <footer className="w-full border-t border-white/10 py-12 pb-24 text-white/40 text-xs font-inter tracking-[0.3em] uppercase bg-black">
          <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="font-podium text-white text-sm tracking-wider">VANGUARD</span>
              <span>×</span>
              <span>ANIME CODEX ARCHIVE</span>
            </div>
            <p className="text-white/40">
              ALL RIGHTS RESERVED • CHRONOLOGY &amp; GRAPH SYSTEM
            </p>
          </div>
        </footer>
      </div>

      {/* FLOATING GLASSMORPHIC BOTTOM NAVBAR DOCK */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-4 sm:px-6 py-2.5 rounded-full bg-black/80 border border-white/20 shadow-[0_10px_35px_rgba(0,0,0,0.8)] backdrop-blur-2xl transition-all duration-300 hover:border-white/40">
        <a href="#" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="font-podium text-xs sm:text-sm font-bold tracking-wider text-white uppercase pr-3 border-r border-white/20">
          VANGUARD
        </a>

        <div className="hidden sm:flex items-center gap-4 text-[11px] font-inter uppercase tracking-widest text-white/70">
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-white transition-colors cursor-pointer">
            HERO
          </button>
          <button onClick={scrollToCodex} className="hover:text-white transition-colors cursor-pointer">
            ARCHIVE
          </button>
          <button onClick={() => document.getElementById('manifesto-section')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-white transition-colors cursor-pointer">
            MANIFESTO
          </button>
        </div>

        <div className="flex items-center gap-1 pl-2 border-l border-white/20">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-2.5 py-1 rounded-full text-[10px] font-inter uppercase tracking-widest transition-all cursor-pointer ${
              viewMode === 'grid' ? 'bg-white text-black font-bold' : 'text-white/60 hover:text-white'
            }`}
          >
            CARDS
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`px-2.5 py-1 rounded-full text-[10px] font-inter uppercase tracking-widest transition-all cursor-pointer ${
              viewMode === 'table' ? 'bg-white text-black font-bold' : 'text-white/60 hover:text-white'
            }`}
          >
            TABLE
          </button>
        </div>
      </nav>
    </div>
  );
}
