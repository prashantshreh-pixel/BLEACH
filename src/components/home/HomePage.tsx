import * as React from 'react';
import { useQuery } from '@apollo/client/react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
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
  onOpenHell?: () => void;
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

  // Hell Realm 3D Transition & Page State
  const [isHellDescentActive, setIsHellDescentActive] = React.useState(false);
  const [showHellRealmPage, setShowHellRealmPage] = React.useState(false);

  // Smooth Hardware-Accelerated Parallax Animations
  const { scrollY } = useScroll();

  // Stage 1: Soul King Palace (Sky / Royal Realm)
  const heroY = useTransform(scrollY, [0, 800], [0, 220]);
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0.05]);
  const heroImgY = useTransform(scrollY, [0, 1000], [0, 280]);
  const heroImgScale = useTransform(scrollY, [0, 1000], [1.08, 1.35]);

  // Stage 2: Soul Society (Seireitei & Rukongai - Ground Realm)
  const soulSocietyImgY = useTransform(scrollY, [200, 1600], [-80, 200]); // Moves to reveal buildings!
  const soulSocietyImgScale = useTransform(scrollY, [200, 1600], [1.12, 1.35]);
  const soulSocietyContentY = useTransform(scrollY, [300, 1200], [60, 0]);
  const soulSocietyOpacity = useTransform(scrollY, [250, 550, 1200, 1500], [0.2, 1, 1, 0.3]);

  // Stage 3: World of the Living (Human World / Karakura Town)
  const humanWorldImgY = useTransform(scrollY, [1000, 2400], [-60, 220]);
  const humanWorldImgScale = useTransform(scrollY, [1000, 2400], [1.1, 1.35]);
  const humanWorldContentY = useTransform(scrollY, [1200, 2000], [60, 0]);
  const humanWorldOpacity = useTransform(scrollY, [1100, 1400, 2000, 2400], [0.2, 1, 1, 0.3]);

  // Stage 4: Hueco Mundo & Las Noches (Hollow Realm)
  const huecoMundoImgY = useTransform(scrollY, [1800, 3200], [-60, 220]);
  const huecoMundoImgScale = useTransform(scrollY, [1800, 3200], [1.1, 1.35]);
  const huecoMundoContentY = useTransform(scrollY, [2000, 2800], [60, 0]);
  const huecoMundoOpacity = useTransform(scrollY, [1900, 2200, 2800, 3200], [0.2, 1, 1, 0.3]);

  // Stage 5: Hell / Jigoku (Nether Realm)
  const hellImgY = useTransform(scrollY, [2600, 4000], [-60, 240]);
  const hellImgScale = useTransform(scrollY, [2600, 4000], [1.1, 1.35]);
  const hellContentY = useTransform(scrollY, [2800, 3600], [60, 0]);
  const hellOpacity = useTransform(scrollY, [2700, 3000, 3600, 4000], [0.2, 1, 1, 0.3]);

  const { data, loading } = useQuery<{ animes: AnimeLight[] }>(
    GET_ALL_ANIMES_LIGHT,
    { fetchPolicy: 'cache-first' }
  );

  const rawAnimes = data?.animes || [];

  const filteredAnimes = React.useMemo(() => {
    return rawAnimes
      .filter((anime) => {
        const matchesSearch =
          anime.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          anime.titleJapanese?.includes(searchQuery) ||
          anime.romaji?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          anime.studio.toLowerCase().includes(searchQuery.toLowerCase());

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

  if (showHellRealmPage) {
    return <HellRealmPage onBack={() => setShowHellRealmPage(false)} />;
  }

  return (
    <div className="min-h-screen bg-black text-zinc-100 flex flex-col justify-between selection:bg-white selection:text-black">
      {/* STAGE 1: SOUL KING PALACE FULLSCREEN HERO SECTION (ROYAL REALM) */}
      <section className="relative w-full h-screen min-h-screen overflow-hidden bg-slate-950 text-white flex flex-col justify-between select-none">
        {/* Fullscreen Cover Soul King Palace Background Photo */}
        <div className="absolute inset-0 w-full h-full z-0 overflow-hidden bg-slate-950">
          <motion.img
            style={{ y: heroImgY, scale: heroImgScale }}
            src="/soul-king-palace.jpg"
            alt="Soul King Palace (霊王宮)"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-sky-950/20 z-10" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-slate-950/70 z-10" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-transparent to-black/75 z-10" />
        </div>

        <div className="relative z-20 w-full px-6 sm:px-10 lg:px-16 pt-8 pb-4 flex items-center justify-between">
          <a href="#" className="font-podium text-2xl sm:text-3xl font-bold tracking-[0.3em] text-white uppercase opacity-90 hover:opacity-100 transition-opacity">
            B L E A C H
          </a>
          <button
            onClick={() => onSelectAnime('soul-king-palace')}
            className="font-inter text-xs tracking-widest uppercase text-amber-300/90 hover:text-white border border-amber-500/40 hover:border-amber-400 px-3.5 py-1.5 rounded-lg bg-amber-950/60 hover:bg-amber-900/80 transition-all cursor-pointer hidden sm:inline-flex items-center gap-2 shadow-[0_0_15px_rgba(245,158,11,0.2)]"
          >
            <Crown className="w-3.5 h-3.5 text-amber-400" />
            <span>ENTER ROYAL REALM ARCHIVE →</span>
          </button>
        </div>

        <motion.main
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative z-10 px-6 sm:px-10 lg:px-16 flex-1 flex flex-col justify-center max-w-7xl w-full mx-auto my-auto py-6 sm:py-10"
        >
          <div className="animate-fade-up flex items-center gap-2 text-white/70 text-xs sm:text-sm font-inter tracking-[0.3em] uppercase mb-6 lg:mb-8">
            <Crown className="w-4 h-4 text-white/70 shrink-0" />
            <span>SOUL SOCIETY • GOTEI 13 • WANDENREICH • HUECO MUNDO</span>
          </div>

          <h1 className="animate-fade-up-delay-1 font-podium text-white uppercase leading-[0.92] tracking-tight text-[clamp(2.8rem,8vw,7rem)] flex flex-col">
            <span>BANKAI.</span>
            <span>SEIREITEI.</span>
            <span>CONQUER.</span>
          </h1>

          <p className="animate-fade-up-delay-2 text-white/70 text-sm sm:text-base font-inter leading-relaxed max-w-md mt-6 lg:mt-8">
            The definitive architectural codex for Bleach lore,
            <br />
            Gotei 13 captain hierarchies, Zanpakutō powers, and <strong className="font-bold text-white">the Thousand-Year Blood War.</strong>
          </p>

          <div className="animate-fade-up-delay-3 mt-8 lg:mt-10 flex flex-wrap items-center gap-4">
            <button
              onClick={() => onSelectAnime('soul-king-palace')}
              className="inline-flex items-center gap-2.5 text-xs font-podium uppercase tracking-widest text-amber-300 hover:text-white bg-amber-950/90 hover:bg-amber-900 border border-amber-500/60 hover:border-amber-400 px-5 py-3 rounded-xl transition-all shadow-[0_0_25px_rgba(245,158,11,0.35)] hover:shadow-[0_0_35px_rgba(245,158,11,0.6)] cursor-pointer group"
            >
              <Crown className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
              <span>EXPLORE ROYAL REALM (SOUL KING &amp; SQUAD 0) →</span>
            </button>

            <div className="flex items-center gap-2.5 text-white/60 text-xs tracking-wider uppercase font-inter">
              <Award className="w-7 h-7 text-amber-400/80 shrink-0" />
              <div className="leading-tight">
                <span className="text-amber-400 font-bold block">Grade 1 Canon</span>
                <span>Royal Realm Archive</span>
              </div>
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

        <div className="absolute bottom-0 inset-x-0 h-56 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent z-10 pointer-events-none overflow-hidden">
          <div className="absolute -bottom-8 inset-x-0 h-32 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-sky-950/30 via-slate-950/90 to-transparent blur-xl pointer-events-none" />
        </div>
      </section>

      <section className="relative w-full h-screen min-h-[750px] overflow-hidden bg-slate-950 text-white flex flex-col justify-center select-none">
        <div className="absolute top-0 inset-x-0 h-48 bg-gradient-to-b from-slate-950 via-slate-950/70 to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-0 w-full h-full z-0 overflow-hidden bg-slate-950">
          <motion.img
            style={{ y: soulSocietyImgY, scale: soulSocietyImgScale }}
            src="/soul-society.jpg"
            alt="Soul Society: Seireitei & Rukongai (瀞霊廷 & 流魂街)"
            className="w-full h-full object-cover object-[center_65%]"
          />
          <div className="absolute inset-0 bg-black/30 z-10" />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-transparent to-black/70 z-10" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/80 z-10" />
        </div>

        <motion.div
          style={{ y: soulSocietyContentY, opacity: soulSocietyOpacity }}
          className="relative z-20 max-w-7xl w-full mx-auto px-6 sm:px-10 lg:px-16"
        >
          <div className="space-y-4 max-w-2xl">
            <div className="font-inter text-xs tracking-[0.3em] uppercase text-cyan-400 font-semibold flex items-center gap-2">
              <Compass className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>GROUND REALM // 瀞霊廷 &amp; 流魂街</span>
            </div>

            <h2 className="font-podium text-4xl sm:text-5xl lg:text-6xl uppercase tracking-tight text-white leading-none">
              SOUL SOCIETY.
              <br />
              <span className="text-white/80">SEIREITEI &amp; RUKONGAI.</span>
            </h2>

            <p className="text-sm sm:text-base font-inter text-white/80 leading-relaxed max-w-xl">
              The spiritual center of the three worlds governed by the Gotei 13. Enclosed within Sekiseki stone walls lies the noble fortress of Seireitei, surrounded by the 80 sprawling outer districts of Rukongai.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6">
              <div className="border-l border-white/30 pl-3">
                <span className="text-[10px] font-inter uppercase tracking-widest text-white/50 block">Seireitei HQ</span>
                <span className="text-sm font-podium font-bold text-white tracking-wide">13 SQUAD BARRACKS</span>
              </div>
              <div className="border-l border-white/30 pl-3">
                <span className="text-[10px] font-inter uppercase tracking-widest text-white/50 block">Outer Realm</span>
                <span className="text-sm font-podium font-bold text-cyan-400 tracking-wide">80 RUKONGAI SECTORS</span>
              </div>
              <div className="border-l border-white/30 pl-3">
                <span className="text-[10px] font-inter uppercase tracking-widest text-white/50 block">Defense Wall</span>
                <span className="text-sm font-podium font-bold text-white tracking-wide">SEKISEKI BARRIER</span>
              </div>
              <div className="border-l border-white/30 pl-3">
                <span className="text-[10px] font-inter uppercase tracking-widest text-white/50 block">Judicial HQ</span>
                <span className="text-sm font-podium font-bold text-white tracking-wide">CENTRAL 46</span>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="absolute bottom-0 inset-x-0 h-56 bg-gradient-to-t from-black via-black/80 to-transparent z-10 pointer-events-none overflow-hidden">
          <div className="absolute -bottom-8 inset-x-0 h-32 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-indigo-950/20 via-black/90 to-transparent blur-xl pointer-events-none" />
        </div>
      </section>

      <section className="relative w-full h-screen min-h-[750px] overflow-hidden bg-black text-white flex flex-col justify-center select-none">
        <div className="absolute top-0 inset-x-0 h-48 bg-gradient-to-b from-black via-black/70 to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-0 w-full h-full z-0 overflow-hidden bg-zinc-950">
          <motion.img
            style={{ y: humanWorldImgY, scale: humanWorldImgScale }}
            src="/human-world.jpg"
            alt="World of the Living: Karakura Town (現世・空座町)"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/40 z-10" />
          <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black z-10" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/25 to-black/80 z-10" />
        </div>

        <motion.div
          style={{ y: humanWorldContentY, opacity: humanWorldOpacity }}
          className="relative z-20 max-w-7xl w-full mx-auto px-6 sm:px-10 lg:px-16"
        >
          <div className="space-y-4 max-w-2xl">
            <div className="font-inter text-xs tracking-[0.3em] uppercase text-amber-400 font-semibold flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <span>PHYSICAL REALM // 現世・空座町</span>
            </div>

            <h2 className="font-podium text-4xl sm:text-5xl lg:text-6xl uppercase tracking-tight text-white leading-none">
              WORLD OF THE LIVING.
              <br />
              <span className="text-amber-400">KARAKURA TOWN.</span>
            </h2>

            <p className="text-sm sm:text-base font-inter text-white/80 leading-relaxed max-w-xl">
              The mortal world where human souls reside. Located on the spirit-dense Jūreichi, Karakura Town is defended by Substitute Soul Reaper Ichigo Kurosaki and Kisuke Urahara's secret shop.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6">
              <div className="border-l border-white/30 pl-3">
                <span className="text-[10px] font-inter uppercase tracking-widest text-white/50 block">Spirit Focal Point</span>
                <span className="text-sm font-podium font-bold text-amber-400 tracking-wide">JŪREICHI ZONE</span>
              </div>
              <div className="border-l border-white/30 pl-3">
                <span className="text-[10px] font-inter uppercase tracking-widest text-white/50 block">Outpost</span>
                <span className="text-sm font-podium font-bold text-white tracking-wide">URAHARA SHOP</span>
              </div>
              <div className="border-l border-white/30 pl-3">
                <span className="text-[10px] font-inter uppercase tracking-widest text-white/50 block">Human Anchor</span>
                <span className="text-sm font-podium font-bold text-white tracking-wide">KARAKURA HIGH</span>
              </div>
              <div className="border-l border-white/30 pl-3">
                <span className="text-[10px] font-inter uppercase tracking-widest text-white/50 block">Gateway</span>
                <span className="text-sm font-podium font-bold text-white tracking-wide">SENKAIMON GATE</span>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="absolute bottom-0 inset-x-0 h-64 bg-gradient-to-t from-black via-black/90 to-transparent z-10 pointer-events-none overflow-hidden">
          <div className="absolute -bottom-10 inset-x-0 h-36 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-purple-950/20 via-black/90 to-transparent blur-2xl pointer-events-none" />
        </div>
      </section>

      {/* STAGE 4: HUECO MUNDO & LAS NOCHES (HOLLOW REALM - CLICK TO OPEN DEDICATED HUECO MUNDO REALM PAGE) */}
      <section
        onClick={() => onSelectAnime('hueco-mundo')}
        className="relative w-full h-screen min-h-[750px] overflow-hidden bg-black text-white flex flex-col justify-center select-none cursor-pointer group"
      >
        <div className="absolute top-0 inset-x-0 h-48 bg-gradient-to-b from-black via-black/70 to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-0 w-full h-full z-0 overflow-hidden bg-zinc-950">
          <motion.img
            style={{ y: huecoMundoImgY, scale: huecoMundoImgScale }}
            src="/hueco-mundo.jpg"
            alt="Hueco Mundo: Las Noches (虚圏・虚夜宮)"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/25 transition-colors duration-500 z-10" />
          <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black z-10" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-indigo-950/20 to-black/85 z-10" />
        </div>

        <motion.div
          style={{ y: huecoMundoContentY, opacity: huecoMundoOpacity }}
          className="relative z-20 max-w-7xl w-full mx-auto px-6 sm:px-10 lg:px-16"
        >
          <div className="space-y-4 max-w-2xl">
            <div className="font-inter text-xs tracking-[0.3em] uppercase text-purple-400 font-semibold flex items-center gap-2">
              <Shield className="w-4 h-4 text-purple-400 shrink-0" />
              <span>HOLLOW REALM // 虚圏・虚夜宮</span>
            </div>

            <h2 className="font-podium text-4xl sm:text-5xl lg:text-6xl uppercase tracking-tight text-white group-hover:text-purple-300 transition-colors leading-none">
              HUECO MUNDO.
              <br />
              <span className="text-purple-400">LAS NOCHES &amp; DESERT.</span>
            </h2>

            <p className="text-sm sm:text-base font-inter text-white/80 leading-relaxed max-w-xl">
              The endless dimension of perpetual night and white quartz sand. Dominated at its core by Las Noches, the massive white palace ruled by Sosuke Aizen and the ten Espada.
            </p>

            <div className="pt-2">
              <span className="inline-flex items-center gap-2 text-xs font-podium uppercase tracking-widest text-purple-300 group-hover:text-white bg-purple-950/80 group-hover:bg-purple-900 border border-purple-500/50 px-4 py-2 rounded-lg transition-all shadow-[0_0_20px_rgba(168,85,247,0.4)]">
                ENTER HUECO MUNDO REALM ARCHIVE →
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
              <div className="border-l border-white/30 pl-3">
                <span className="text-[10px] font-inter uppercase tracking-widest text-white/50 block">Dominant Citadel</span>
                <span className="text-sm font-podium font-bold text-white tracking-wide">LAS NOCHES</span>
              </div>
              <div className="border-l border-white/30 pl-3">
                <span className="text-[10px] font-inter uppercase tracking-widest text-white/50 block">Supreme Elite</span>
                <span className="text-sm font-podium font-bold text-purple-400 tracking-wide">10 ESPADA</span>
              </div>
              <div className="border-l border-white/30 pl-3">
                <span className="text-[10px] font-inter uppercase tracking-widest text-white/50 block">Reishi Landscape</span>
                <span className="text-sm font-podium font-bold text-white tracking-wide">QUARTZ DESERT</span>
              </div>
              <div className="border-l border-white/30 pl-3">
                <span className="text-[10px] font-inter uppercase tracking-widest text-white/50 block">Subterranean Lair</span>
                <span className="text-sm font-podium font-bold text-white tracking-wide">MENOS FOREST</span>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="absolute bottom-0 inset-x-0 h-64 bg-gradient-to-t from-black via-black/90 to-transparent z-10 pointer-events-none overflow-hidden">
          <div className="absolute -bottom-10 inset-x-0 h-36 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-red-950/20 via-black/90 to-transparent blur-2xl pointer-events-none" />
        </div>
      </section>

      {/* STAGE 5: HELL / JIGOKU (NETHER REALM - CLICK TO OPEN DEDICATED HELL REALM PAGE) */}
      <section
        onClick={() => onSelectAnime('hell')}
        className="relative w-full h-screen min-h-[750px] overflow-hidden bg-black text-white flex flex-col justify-center select-none cursor-pointer group"
      >
        <div className="absolute top-0 inset-x-0 h-48 bg-gradient-to-b from-black via-black/70 to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-0 w-full h-full z-0 overflow-hidden bg-zinc-950">
          <motion.img
            style={{ y: hellImgY, scale: hellImgScale }}
            src="/hell-jigoku.jpg"
            alt="Hell / Jigoku: The Sinners' Realm (地獄・咎人)"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/45 group-hover:bg-black/30 transition-colors duration-500 z-10" />
          <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black z-10" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-red-950/20 to-black/85 z-10" />
        </div>

        <motion.div
          style={{ y: hellContentY, opacity: hellOpacity }}
          className="relative z-20 max-w-7xl w-full mx-auto px-6 sm:px-10 lg:px-16"
        >
          <div className="space-y-4 max-w-2xl">
            <div className="font-inter text-xs tracking-[0.3em] uppercase text-red-500 font-semibold flex items-center gap-2">
              <Flame className="w-4 h-4 text-red-500 shrink-0 animate-pulse" />
              <span>NETHER REALM // 地獄・咎人</span>
            </div>

            <h2 className="font-podium text-4xl sm:text-5xl lg:text-6xl uppercase tracking-tight text-white leading-none group-hover:text-red-400 transition-colors">
              HELL (JIGOKU).
              <br />
              <span className="text-red-500 group-hover:text-red-300">THE SINNERS' ABYSS.</span>
            </h2>

            <p className="text-sm sm:text-base font-inter text-white/80 leading-relaxed max-w-xl">
              The primordial underworld predating the three worlds, sealed by the colossal Hell Gates. A bottomless pit of eternal judgment for unpardonable sinners and Captains whose spiritual density cannot return to Reishi.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6">
              <div className="border-l border-white/30 pl-3">
                <span className="text-[10px] font-inter uppercase tracking-widest text-white/50 block">Primordial Gate</span>
                <span className="text-sm font-podium font-bold text-red-500 tracking-wide">HELL GATES</span>
              </div>
              <div className="border-l border-white/30 pl-3">
                <span className="text-[10px] font-inter uppercase tracking-widest text-white/50 block">Chained Inmates</span>
                <span className="text-sm font-podium font-bold text-white tracking-wide">TOGABITO</span>
              </div>
              <div className="border-l border-white/30 pl-3">
                <span className="text-[10px] font-inter uppercase tracking-widest text-white/50 block">Nether Guardians</span>
                <span className="text-sm font-podium font-bold text-white tracking-wide">KUSHAJIDA</span>
              </div>
              <div className="border-l border-white/30 pl-3">
                <span className="text-[10px] font-inter uppercase tracking-widest text-white/50 block">Reiatsu Threshold</span>
                <span className="text-sm font-podium font-bold text-white tracking-wide">GRADE 3 REIATSU</span>
              </div>
            </div>

            {/* Prominent Action Button to Open Hell Realm Codex Page */}
            <div className="pt-6">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectAnime('hell');
                }}
                className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-red-950/90 border border-red-500/70 hover:border-red-400 text-white font-podium text-sm uppercase tracking-[0.2em] transition-all hover:scale-105 shadow-[0_0_30px_rgba(239,35,60,0.6)] cursor-pointer"
              >
                <Flame className="w-5 h-5 text-red-500 animate-pulse" />
                <span>ENTER THE HELL REALM CODEX</span>
                <ArrowRight className="w-4 h-4 text-red-400" />
              </button>
            </div>
          </div>
        </motion.div>

        <div className="absolute bottom-0 inset-x-0 h-56 bg-gradient-to-t from-black via-black/95 to-transparent z-10 pointer-events-none" />
      </section>

      <div id="anime-codex-section" className="relative z-20 bg-black text-white pt-6">
        <main className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-8 space-y-12">
          <section className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <p className="text-xs font-inter text-white/60 tracking-wider">
                  Filter Bleach content.
                </p>
              </div>

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

            <div className="relative w-full">
              <div className="relative flex items-center w-full bg-black border-b border-white/30 focus-within:border-white transition-colors">
                <Search className="w-5 h-5 text-white/40 ml-2 shrink-0" />
                <input
                  type="text"
                  placeholder="SEARCH BLEACH CONTENT, CHARACTERS, OR ZANPAKUTŌ..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent border-none px-4 py-4 text-sm font-inter text-white placeholder:text-white/40 outline-none uppercase tracking-wider"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="p-2 text-white/40 hover:text-white transition-colors cursor-pointer mr-2"
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

        </main>

        {/* Minimalist Editorial Footer */}
        <footer className="w-full border-t border-white/10 py-12 pb-24 text-white/40 text-xs font-inter tracking-[0.3em] uppercase bg-black">
          <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="font-podium text-white text-sm tracking-[0.25em]">B L E A C H</span>
            </div>
            <p className="text-white/40">
              ALL RIGHTS RESERVED • CHRONOLOGY &amp; GRAPH SYSTEM
            </p>
          </div>
        </footer>
      </div>

      {/* FLOATING GLASSMORPHIC BOTTOM NAVBAR DOCK */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 px-6 py-2.5 rounded-full bg-black/80 border border-white/20 shadow-[0_10px_35px_rgba(0,0,0,0.8)] backdrop-blur-2xl transition-all duration-300 hover:border-white/40">
        <a href="#" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="font-podium text-xs sm:text-sm font-bold tracking-[0.25em] text-white uppercase pr-3 border-r border-white/20">
          B L E A C H
        </a>

        <div className="flex items-center gap-4 text-[11px] font-inter uppercase tracking-widest text-white/70">
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-white transition-colors cursor-pointer">
            HERO
          </button>
          <button onClick={scrollToCodex} className="hover:text-white transition-colors cursor-pointer">
            ARCHIVE
          </button>
        </div>
      </nav>
    </div>
  );
}
