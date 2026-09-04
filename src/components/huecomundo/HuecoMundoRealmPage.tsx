import React, { useState, useEffect, useLayoutEffect, useCallback, useRef } from 'react';
import { ArrowLeft, ArrowRight, Shield, Layers, Info, Moon, BookOpen, Globe, Skull, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HuecoMundoRealmPageProps {
  onBack: () => void;
}

// -----------------------------------------------------------------------------
// 3D CAROUSEL DATA (ALL 10 ESPADA FIGURINES)
// -----------------------------------------------------------------------------

const ESPADA_CAROUSEL_ITEMS = [
  {
    id: 'starrk',
    name: 'COYOTE STARRK',
    number: '01',
    roman: 'I',
    role: '1ST ESPADA (PRIMER ESPADA)',
    zanpakuto: 'Los Lobos (群狼)',
    aspectOfDeath: 'Solitude (孤独 - Kodoku)',
    desc: 'The Premier Espada whose immense soul split into Starrk and Lilynette to escape eternal loneliness. He fires infinite rapid Ceros and manifests soul-split Reishi wolves.',
    src: '/huecomundo/Stark.png?v=5',
    bg: '#14142B',
    panel: '#1E1E42',
    ghostText: 'STARRK',
    accent: '#818cf8',
    scaleDesktop: 1.3,
    scaleMobile: 1.5,
    heightDesktop: '85%',
    heightMobile: '60%',
    leftDesktop: '50%',
    leftMobile: '50%',
    rightDesktop: undefined,
    rightMobile: undefined,
    topDesktop: undefined,
    topMobile: undefined,
    bottomDesktop: '7%',
    bottomMobile: '22%',
  },
  {
    id: 'baraggan',
    name: 'BARAGGAN LOUISENBAIRN',
    number: '02',
    roman: 'II',
    role: '2ND ESPADA • FORMER KING',
    zanpakuto: 'Arrogante (髑髏大帝)',
    aspectOfDeath: 'Aging / Time (老衰 - Rōsuai)',
    desc: 'The ancient skeletal God-King who once ruled Hueco Mundo from an open throne. His Resurrección releases Respira—a miasma of absolute decay that turns all matter to dust.',
    src: '/huecomundo/Baraggan.png?v=2',
    bg: '#241400',
    panel: '#3D2200',
    ghostText: 'BARAGGAN',
    accent: '#facc15',
    scaleDesktop: 1.1,
    scaleMobile: 1.5,
    heightDesktop: '90%',
    heightMobile: '60%',
    leftDesktop: '51%',
    leftMobile: '50%',
    bottomDesktop: '5%',
    bottomMobile: '22%',
  },
  {
    id: 'harribel',
    name: 'TIER HARRIBEL',
    number: '03',
    roman: 'III',
    role: '3RD ESPADA • QUEEN OF HUECO MUNDO',
    zanpakuto: 'Tiburón (皇鮫后)',
    aspectOfDeath: 'Sacrifice (犠牲 - Gisei)',
    desc: 'The calm, honorable leader of the Tres Bestias who became ruler of Hueco Mundo. Her shark-themed Resurrección Tiburón commands boiling ocean torrents.',
    src: '/huecomundo/harribel.png?v=2',
    bg: '#041c24',
    panel: '#083442',
    ghostText: 'HARRIBEL',
    accent: '#22d3ee',
    scaleDesktop: 1.55,
    scaleMobile: 1.5,
    heightDesktop: '88%',
    heightMobile: '60%',
    leftDesktop: '50%',
    leftMobile: '50%',
    rightDesktop: undefined,
    rightMobile: undefined,
    topDesktop: undefined,
    topMobile: undefined,
    bottomDesktop: '0%',
    bottomMobile: '22%',
  },
  {
    id: 'ulquiorra',
    name: 'ULQUIORRA CIFER',
    number: '04',
    roman: 'IV',
    role: '4TH ESPADA • SEGUNDA ETAPA',
    zanpakuto: 'Murciélago (黒翼大魔)',
    aspectOfDeath: 'Emptiness (虚無 - Kyomu)',
    desc: 'Aizen’s most trusted enforcer and the only Espada to unlock a second release form. Cold and analytical, he wields Lanza del Relámpago and the black Cero Oscuras.',
    src: '/huecomundo/Ulquiorra.png?v=2',
    bg: '#051b14',
    panel: '#0a3628',
    ghostText: 'ULQUIORRA',
    accent: '#34d399',
    scaleDesktop: 1.55,
    scaleMobile: 1.5,
    heightDesktop: '150%',
    heightMobile: '60%',
    leftDesktop: '63%',
    leftMobile: '50%',
    bottomDesktop: '-26%',
    bottomMobile: '55%',
  },
  {
    id: 'nnoitra',
    name: 'NNOITRA GILGA',
    number: '05',
    roman: 'V',
    role: '5TH ESPADA (QUINTA ESPADA)',
    zanpakuto: 'Santa Teresa (聖泣き蟷螂)',
    aspectOfDeath: 'Despair (絶望 - Zetsubō)',
    desc: 'The battle-crazed warrior possessing the hardest Hierro skin among all Espada. Driven by a violent desire to fight the strongest, his release manifests six scythe-wielding arms.',
    src: '/huecomundo/nnoitra.png',
    bg: '#240808',
    panel: '#420f0f',
    ghostText: 'NNOITRA',
    accent: '#f87171',
    scaleDesktop: 1.2,
    scaleMobile: 1.3,
    heightDesktop: '80%',
    heightMobile: '47%',
    leftDesktop: '41%',
    leftMobile: '41%',
    bottomDesktop: '9%',
    bottomMobile: '19%',
  },
  {
    id: 'grimmjow',
    name: 'GRIMMJOW JAEGERJAQUEZ',
    number: '06',
    roman: 'VI',
    role: '6TH ESPADA (SEXTA ESPADA)',
    zanpakuto: 'Pantera (豹王)',
    aspectOfDeath: 'Destruction (破壊 - Hakai)',
    desc: 'The wild Panther King driven by predatory instinct and rivalry with Ichigo. Wields his Resurrección Pantera to unleash razor agility and Desgarrón Reishi claws.',
    src: '/huecomundo/grimmjow.png?v=2',
    bg: '#08172e',
    panel: '#0f2c57',
    ghostText: 'GRIMMJOW',
    accent: '#60a5fa',
    scaleDesktop: 1.9,
    scaleMobile: 1.3,
    heightDesktop: '88%',
    heightMobile: '60%',
    leftDesktop: '45%',
    leftMobile: '50%',
    bottomDesktop: '6%',
    bottomMobile: '8.5%',
  },
  {
    id: 'zommari',
    name: 'ZOMMARI RUREAUX',
    number: '07',
    roman: 'VII',
    role: '7TH ESPADA • GEMELOS SONÍDO',
    zanpakuto: 'Brujería (呪眼僧伽)',
    aspectOfDeath: 'Intoxication (陶酔 - Tōsui)',
    desc: 'The master of Gemelos Sonído who creates clone afterimages. His Resurrección Brujería opens dozens of eyes that claim absolute sovereignty over whatever they see with Amor.',
    src: '/huecomundo/Zommari.png?v=2',
    bg: '#1c0d28',
    panel: '#36194d',
    ghostText: 'ZOMMARI',
    accent: '#c084fc',
    scaleDesktop: 2.5,
    scaleMobile: 1.3,
    heightDesktop: '80%',
    heightMobile: '47%',
    leftDesktop: '50%',
    leftMobile: '50%',
    rightDesktop: undefined,
    rightMobile: undefined,
    topDesktop: undefined,
    topMobile: undefined,
    bottomDesktop: '0%',
    bottomMobile: '22%',

  },
  {
    id: 'szayelaporro',
    name: 'SZAYELAPORRO GRANZ',
    number: '08',
    roman: 'VIII',
    role: '8TH ESPADA • MAD SCIENTIST',
    zanpakuto: 'La Fornicarás (邪淫妃)',
    aspectOfDeath: 'Madness (狂気 - Kyōki)',
    desc: 'The sadistic scientist Espada who views warfare as a laboratory experiment. He crushes opponents using internal organ puppet dolls and achieves rebirth through Gabriel.',
    src: '/huecomundo/Szayelaporro.png?v=3',
    bg: '#250824',
    panel: '#471045',
    ghostText: 'SZAYELAPORRO',
    accent: '#f472b6',
    scaleDesktop: 1.55,
    scaleMobile: 1.5,
    heightDesktop: '88%',
    heightMobile: '60%',
    leftDesktop: '50%',
    leftMobile: '50%',
    rightDesktop: undefined,
    rightMobile: undefined,
    topDesktop: undefined,
    topMobile: undefined,
    bottomDesktop: '0%',
    bottomMobile: '22%',
  },
  {
    id: 'aaroniero',
    name: 'AARONIERO ARRURUERIE',
    number: '09',
    roman: 'IX',
    role: '9TH ESPADA • 33,650 HOLLOWS',
    zanpakuto: 'Glotonería (喰虚)',
    aspectOfDeath: 'Gluttony (貪欲 - Don\'yoku)',
    desc: 'The only Gillian among the Espada, composed of two floating heads in a fluid capsule. Having consumed 33,650 Hollows, he manifests all their powers and Kaien Shiba’s memories.',
    src: '/huecomundo/Aaroniero.png?v=2',
    bg: '#0d1f1c',
    panel: '#173b35',
    ghostText: 'AARONIERO',
    accent: '#2dd4bf',
    scaleDesktop: 1.3,
    scaleMobile: 1.5,
    heightDesktop: '90%',
    heightMobile: '60%',
    leftDesktop: '50%',
    leftMobile: '50%',
    rightDesktop: undefined,
    rightMobile: undefined,
    topDesktop: undefined,
    topMobile: undefined,
    bottomDesktop: '2%',
    bottomMobile: '22%',
  },
  {
    id: 'yammy',
    name: 'YAMMY LLARGO',
    number: '10 → 0',
    roman: 'X / 0',
    role: '10TH ESPADA → CERO ESPADA',
    zanpakuto: 'Ira (憤獣)',
    aspectOfDeath: 'Wrath / Rage (憤怒 - Fundo)',
    desc: 'The brute whose rank flips from 10 to 0 when released. As his rage swells, his body mutates into a colossal multi-legged dragon titan with power surpassing all other Espada.',
    src: '/huecomundo/Yammy.png?v=2',
    bg: '#260a0a',
    panel: '#4a1414',
    ghostText: 'YAMMY',
    accent: '#fb923c',
    scaleDesktop: 1.55,
    scaleMobile: 1.5,
    heightDesktop: '88%',
    heightMobile: '60%',
    leftDesktop: '50%',
    leftMobile: '50%',
    rightDesktop: undefined,
    rightMobile: undefined,
    topDesktop: undefined,
    topMobile: undefined,
    bottomDesktop: '0%',
    bottomMobile: '22%',
  },
];

// -----------------------------------------------------------------------------
// HUECO MUNDO REGIONS TABLE DATA
// -----------------------------------------------------------------------------

const HUECO_MUNDO_REGIONS = [
  {
    level: 1,
    order: 'Central Citadel',
    title: 'Las Noches (The White Palace)',
    dominantRuler: 'Sōsuke Aizen & 10 Espada',
    description:
      'The colossal white fortress located at the heart of Hueco Mundo. Enclosed beneath a massive dome featuring a simulated daytime blue sky created by Aizen, it contains individual towers and quarters for each of the 10 Espada.',
    image: '/hueco-mundo.jpg',
  },
  {
    level: 2,
    order: 'Endless Landscape',
    title: 'The White Quartz Sand Desert',
    dominantRuler: 'Wandering Hollows & Adjuchas',
    description:
      'An infinite desert composed of fine silver-white quartz sand stretching in all directions beneath a perpetual crescent moon and dark sky. The air is rich in spiritual particles (Reishi), sustaining Hollow life without need for food.',
    image: '/hueco-mundo.jpg',
  },
  {
    level: 3,
    order: 'Subterranean Lair',
    title: 'Forest of Menos (Menos no Mori)',
    dominantRuler: 'Gillians, Adjuchas & Ashido Kano',
    description:
      'The vast subterranean world hidden directly beneath the quartz sand. Filled with towering stone trees that resemble skeletal trunks, it is populated by millions of Gillians and fierce Adjuchas hunting for survival.',
    image: '/hueco-mundo.jpg',
  },
  {
    level: 4,
    order: 'The Abyss of Evolution',
    title: 'The Crucible of Soul Fusion',
    dominantRuler: 'Primordial Hollow Beasts',
    description:
      'The spiritual evolutionary environment where human Plus souls that fall into darkness fuse together. Hundreds of thousands of Hollows devour one another to evolve from Gillian to Adjuchas and finally into Vasto Lorde.',
    image: '/hueco-mundo.jpg',
  },
];

// SVG Grain Data URI for TOONHUB style texture
const GRAIN_DATA_URI = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><filter id="noise"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(%23noise)" opacity="0.08"/></svg>`;

export const HuecoMundoRealmPage: React.FC<HuecoMundoRealmPageProps> = ({ onBack }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // 3D Carousel State (Defaults to Coyote Starrk #01)
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(() => typeof window !== 'undefined' && window.innerWidth < 640);

  // Guarantee page starts at top of window and container
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  }, []);

  // Update window resize for mobile check
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Preload Images on Mount
  useEffect(() => {
    ESPADA_CAROUSEL_ITEMS.forEach((item) => {
      const img = new Image();
      img.src = item.src;
    });
  }, []);

  // TOONHUB Navigation Logic with 650ms Lock
  const navigate = useCallback(
    (dir: 'next' | 'prev') => {
      if (isAnimating) return;
      setIsAnimating(true);
      const total = ESPADA_CAROUSEL_ITEMS.length;
      if (dir === 'next') {
        setActiveIndex((prev) => (prev + 1) % total);
      } else {
        setActiveIndex((prev) => (prev + total - 1) % total);
      }
      setTimeout(() => {
        setIsAnimating(false);
      }, 650);
    },
    [isAnimating]
  );

  // Role calculation per index (10 items support with 3D depth layers)
  const getRole = (index: number) => {
    const total = ESPADA_CAROUSEL_ITEMS.length;
    const diff = (index - activeIndex + total) % total;
    if (diff === 0) return 'center';
    if (diff === total - 1) return 'left';
    if (diff === 1) return 'right';
    if (diff === total - 2) return 'far-left';   // Slides cleanly out to the left flank
    if (diff === 2) return 'far-right';          // Slides cleanly in from the right flank
    return 'hidden';
  };

  const activeItem = ESPADA_CAROUSEL_ITEMS[activeIndex];

  return (
    <div
      ref={containerRef}
      className="h-screen w-full overflow-y-auto snap-y snap-mandatory scroll-smooth bg-zinc-950 text-white selection:bg-purple-600 selection:text-white font-inter"
    >
      {/* -----------------------------------------------------------------------------
          1. BLEACH WIKI OVERVIEW SECTION (PANEL 1 - LOADS FIRST!)
          https://bleach.fandom.com/wiki/Hueco_Mundo
      ----------------------------------------------------------------------------- */}
      <header className="relative w-full min-h-screen snap-start snap-always shrink-0 bg-black border-b border-purple-900/50 py-8 px-4 sm:px-8 lg:px-16 overflow-y-auto flex flex-col justify-center">
        {/* Ambient Dark Purple Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-950/30 via-black to-black pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto space-y-8 w-full">
          {/* Top Bar Navigation */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-purple-400" />
              <span className="font-podium text-xs sm:text-sm uppercase tracking-[0.25em] text-purple-300 font-semibold">
                BLEACH WIKI ARCHIVE // 虚圏 (ウェコムンド)
              </span>
            </div>
            <button
              onClick={onBack}
              className="text-xs font-podium uppercase tracking-widest text-white/80 hover:text-white border border-white/20 hover:border-purple-500/60 px-4 py-2 rounded-lg bg-zinc-900/80 hover:bg-purple-950/80 transition-all cursor-pointer shadow-md"
            >
              ← BACK TO REALMS
            </button>
          </div>

          {/* Wiki Title Banner */}
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-inter uppercase tracking-[0.3em] text-purple-400 font-bold bg-purple-950/80 px-3 py-1 rounded border border-purple-500/40">
              <Globe className="w-3.5 h-3.5" />
              <span>DIMENSIONAL OVERVIEW &amp; CANON LORE</span>
            </div>
            <h1 className="font-podium text-4xl sm:text-6xl lg:text-7xl uppercase tracking-tight text-white leading-none drop-shadow-lg">
              HUECO MUNDO
              <span className="block text-purple-400 text-2xl sm:text-4xl mt-1 font-normal font-sans">
                虚圏 (Weko Mundo) — "The Hollow World"
              </span>
            </h1>
          </div>

          {/* Main Wiki Layout Grid (Article + Infobox) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4">
            {/* Left 2 Columns: Detailed Wiki Article Text */}
            <div className="lg:col-span-2 space-y-6 text-sm sm:text-base font-inter text-white/90 leading-relaxed">
              <div className="bg-zinc-900/90 border-l-4 border-purple-500 p-5 rounded-r-xl space-y-2">
                <p>
                  <strong>Hueco Mundo</strong> (虚圏 (ウェコムンド), <em>Weko Mundo</em>; Spanish for "Hollow World", Japanese for "Hollow Sphere") is the dimension located between the Human World and Soul Society. It is the natural home of Hollows, Menos Grande, and the unmasked Arrancar who serve Sōsuke Aizen within the white palace of Las Noches.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="font-podium text-xl uppercase text-purple-300 border-b border-purple-900/50 pb-1">
                  GEOGRAPHY &amp; ENVIRONMENT
                </h3>
                <p>
                  Hueco Mundo is an expansive, barren desert of silver-white quartz sand stretching endlessly in all directions. It exists under perpetual night beneath a dark sky with a static crescent moon. The atmosphere is saturated with extremely high concentrations of <strong>Reishi</strong> (spiritual particles), allowing Hollows to sustain themselves perpetually without needing to devour human souls for sustenance.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="font-podium text-xl uppercase text-purple-300 border-b border-purple-900/50 pb-1">
                  LAS NOCHES &amp; THE ESPADA CITADEL
                </h3>
                <p>
                  At the center of the desert lies <strong>Las Noches</strong> (虚夜宮 (ラス・ノーチェス), <em>Rasu Nōchesu</em>; Spanish for "The Nights"), a giant white fortress with a simulated blue daytime sky created beneath its inner dome by Sōsuke Aizen. The citadel contains individual towers and palace wings assigned to the <strong>10 Espada</strong>—the supreme elite Arrancar selected by Aizen to embody the ten aspects of human mortality.
                </p>
              </div>
            </div>

            {/* Right Column: Fandom-Style Infobox */}
            <div className="border border-purple-900/80 bg-zinc-900/90 rounded-2xl overflow-hidden shadow-2xl h-fit">
              <div className="bg-gradient-to-r from-purple-950 via-purple-900 to-purple-950 p-4 text-center border-b border-purple-800/80">
                <h3 className="font-podium text-lg uppercase text-white font-bold tracking-wider">
                  HUECO MUNDO METADATA
                </h3>
                <span className="text-xs font-inter text-purple-200 tracking-widest uppercase">
                  DIMENSIONAL ARCHIVE
                </span>
              </div>

              <div className="p-4 space-y-4 text-xs sm:text-sm font-inter">
                <div className="relative aspect-[16/10] rounded-xl overflow-hidden border border-purple-900/60">
                  <img
                    src="/hueco-mundo.jpg"
                    alt="Hueco Mundo Quartz Desert"
                    className="w-full h-full object-cover filter contrast-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                  <span className="absolute bottom-2 left-2 text-[10px] font-podium uppercase tracking-widest text-white/90">
                    Las Noches Dome &amp; Quartz Desert
                  </span>
                </div>

                <div className="divide-y divide-purple-900/40">
                  <div className="py-2 flex justify-between">
                    <span className="text-white/60 uppercase text-[11px] font-semibold">Kanji:</span>
                    <span className="text-white font-semibold">虚圏 (ウェコムンド)</span>
                  </div>
                  <div className="py-2 flex justify-between">
                    <span className="text-white/60 uppercase text-[11px] font-semibold">Romaji:</span>
                    <span className="text-purple-300 font-semibold">Weko Mundo</span>
                  </div>
                  <div className="py-2 flex justify-between">
                    <span className="text-white/60 uppercase text-[11px] font-semibold">Translation:</span>
                    <span className="text-white font-semibold">Hollow World</span>
                  </div>
                  <div className="py-2 flex justify-between">
                    <span className="text-white/60 uppercase text-[11px] font-semibold">Ruler:</span>
                    <span className="text-purple-400 font-bold">Sōsuke Aizen / Harribel</span>
                  </div>
                  <div className="py-2 flex justify-between">
                    <span className="text-white/60 uppercase text-[11px] font-semibold">Primary Citadel:</span>
                    <span className="text-white font-semibold">Las Noches</span>
                  </div>
                  <div className="py-2 flex justify-between">
                    <span className="text-white/60 uppercase text-[11px] font-semibold">Dominant Species:</span>
                    <span className="text-white font-semibold">Hollows &amp; Arrancar</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* -----------------------------------------------------------------------------
          2. TOONHUB-STYLE 3D CHARACTER FIGURINE CAROUSEL (PANEL 2)
      ----------------------------------------------------------------------------- */}
      <section
        id="espada-3d-carousel-section"
        className="relative w-full h-screen min-h-[650px] snap-start snap-always shrink-0 overflow-hidden select-none transition-colors duration-650"
        style={{
          backgroundColor: activeItem.bg,
          transition: 'background-color 650ms cubic-bezier(0.4, 0, 0.2, 1)',
          fontFamily: "'Inter', sans-serif",
        }}
      >
        <div className="relative w-full h-full overflow-hidden">
          {/* 1. Grain overlay */}
          <div
            className="absolute inset-0 pointer-events-none z-50 opacity-40"
            style={{
              backgroundImage: `url("${GRAIN_DATA_URI}")`,
              backgroundSize: '200px 200px',
              backgroundRepeat: 'repeat',
            }}
          />

          {/* 2. Giant ghost text */}
          <div
            className="absolute inset-x-0 flex items-center justify-center pointer-events-none select-none z-0"
            style={{ top: '18%' }}
          >
            <h2
              className="font-black uppercase text-white tracking-tighter whitespace-nowrap leading-none opacity-100 transition-all duration-500"
              style={{
                fontFamily: "'Anton', sans-serif",
                fontSize: 'clamp(90px, 28vw, 380px)',
                letterSpacing: '-0.02em',
                textShadow: `0 0 80px ${activeItem.accent}20`,
              }}
            >
              {activeItem.ghostText}
            </h2>
          </div>

          {/* 3. Top-left brand label */}
          <div className="absolute top-6 left-4 sm:left-8 z-[60] flex items-center gap-3">
            <span className="text-xs font-semibold uppercase text-white/90 tracking-[0.18em]">
              THE 10 ESPADA // 十刃 FIGURINES
            </span>
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider"
              style={{
                borderColor: `${activeItem.accent}60`,
                backgroundColor: `${activeItem.accent}20`,
                color: activeItem.accent,
              }}
            >
              RANK #{activeItem.number}
            </span>
          </div>

          {/* 4. 3D Role-Based Carousel Stack */}
          <div className="absolute inset-0 z-10">
            {ESPADA_CAROUSEL_ITEMS.map((item, index) => {
              const role = getRole(index);
              const isNnoitra = item.id === 'nnoitra';

              // Pull custom sizing directly from the character item if it exists, otherwise fall back to defaults
              const scaleMobile = (item as any).scaleMobile ?? (isNnoitra ? 1.1 : 1.5);
              const scaleDesktop = (item as any).scaleDesktop ?? (isNnoitra ? 1.2 : 1.55);
              const heightMobile = (item as any).heightMobile ?? (isNnoitra ? '75%' : '60%');
              const heightDesktop = (item as any).heightDesktop ?? (isNnoitra ? '98%' : '88%');

              const leftMobile = (item as any).leftMobile ?? '50%';
              const leftDesktop = (item as any).leftDesktop ?? '50%';
              const rightMobile = (item as any).rightMobile;
              const rightDesktop = (item as any).rightDesktop;

              const topMobile = (item as any).topMobile;
              const topDesktop = (item as any).topDesktop;
              const bottomMobile = (item as any).bottomMobile ?? (isNnoitra ? '19%' : '22%');
              const bottomDesktop = (item as any).bottomDesktop ?? (isNnoitra ? '9%' : '0%');

              let roleStyle: React.CSSProperties = {};

              if (role === 'center') {
                roleStyle = {
                  transform: `translateX(-50%) scale(${isMobile ? scaleMobile : scaleDesktop})`,
                  filter: 'blur(0px)',
                  opacity: 1,
                  zIndex: 20,
                  height: isMobile ? heightMobile : heightDesktop,
                  pointerEvents: 'auto',
                };

                // Horizontal Position (Right overrides Left if defined)
                const currentRight = isMobile ? rightMobile : rightDesktop;
                if (currentRight !== undefined) {
                  roleStyle.right = currentRight;
                  roleStyle.transform = `translateX(50%) scale(${isMobile ? scaleMobile : scaleDesktop})`;
                } else {
                  roleStyle.left = isMobile ? leftMobile : leftDesktop;
                }

                // Vertical Position (Top overrides Bottom if defined)
                const currentTop = isMobile ? topMobile : topDesktop;
                if (currentTop !== undefined) {
                  roleStyle.top = currentTop;
                } else {
                  roleStyle.bottom = isMobile ? bottomMobile : bottomDesktop;
                }
              } else if (role === 'left') {
                roleStyle = {
                  transform: `translateX(-50%) scale(${isNnoitra ? 1.25 : 1})`,
                  filter: 'blur(2px)',
                  opacity: 0.85,
                  zIndex: 10,
                  left: isMobile ? '18%' : '28%',
                  height: isNnoitra ? (isMobile ? '20%' : '32%') : (isMobile ? '16%' : '28%'),
                  bottom: isMobile ? '32%' : '12%',
                  pointerEvents: 'auto',
                };
              } else if (role === 'right') {
                roleStyle = {
                  transform: `translateX(-50%) scale(${isNnoitra ? 1.25 : 1})`,
                  filter: 'blur(2px)',
                  opacity: 0.85,
                  zIndex: 10,
                  left: isMobile ? '82%' : '72%',
                  height: isNnoitra ? (isMobile ? '20%' : '32%') : (isMobile ? '16%' : '28%'),
                  bottom: isMobile ? '32%' : '12%',
                  pointerEvents: 'auto',
                };
              } else if (role === 'far-left') {
                // Smooth slide out to the left flank
                roleStyle = {
                  transform: `translateX(-50%) scale(${isNnoitra ? 1.05 : 0.85})`,
                  filter: 'blur(4px)',
                  opacity: 0,
                  zIndex: 4,
                  left: isMobile ? '-8%' : '12%',
                  height: isMobile ? '14%' : '24%',
                  bottom: isMobile ? '32%' : '12%',
                  pointerEvents: 'none',
                };
              } else if (role === 'far-right') {
                // Smooth slide in from the right flank
                roleStyle = {
                  transform: `translateX(-50%) scale(${isNnoitra ? 1.05 : 0.85})`,
                  filter: 'blur(4px)',
                  opacity: 0,
                  zIndex: 4,
                  left: isMobile ? '108%' : '88%',
                  height: isMobile ? '14%' : '24%',
                  bottom: isMobile ? '32%' : '12%',
                  pointerEvents: 'none',
                };
              } else {
                // hidden outside the active visible depth, parked on respective flank
                const total = ESPADA_CAROUSEL_ITEMS.length;
                const diff = (index - activeIndex + total) % total;
                roleStyle = {
                  transform: 'translateX(-50%) scale(0.5)',
                  filter: 'blur(6px)',
                  opacity: 0,
                  zIndex: 0,
                  left: diff > 2 && diff < total / 2 ? '110%' : '-10%',
                  height: '10%',
                  bottom: '20%',
                  pointerEvents: 'none',
                };
              }

              return (
                <div
                  key={item.id}
                  onClick={() => {
                    if (role === 'left') navigate('prev');
                    if (role === 'right') navigate('next');
                  }}
                  className="absolute cursor-pointer"
                  style={{
                    aspectRatio: isNnoitra ? '0.85 / 1' : '0.6 / 1',
                    transition:
                      'transform 650ms cubic-bezier(0.4, 0, 0.2, 1), filter 650ms cubic-bezier(0.4, 0, 0.2, 1), opacity 650ms cubic-bezier(0.4, 0, 0.2, 1), left 650ms cubic-bezier(0.4, 0, 0.2, 1), height 650ms cubic-bezier(0.4, 0, 0.2, 1), bottom 650ms cubic-bezier(0.4, 0, 0.2, 1)',
                    willChange: 'transform, filter, opacity, left',
                    ...roleStyle,
                  }}
                >
                  <img
                    src={item.src}
                    alt={item.name}
                    draggable={false}
                    className="w-full h-full object-contain object-center select-none drop-shadow-[0_15px_35px_rgba(0,0,0,0.9)]"
                  />
                </div>
              );
            })}
          </div>

          {/* 5. Bottom-left text + nav buttons */}
          <div
            className="absolute bottom-6 left-4 sm:bottom-16 sm:left-20 z-[60] text-white"
            style={{ maxWidth: '340px' }}
          >
            <div className="flex items-center gap-2 mb-1.5">
              <span
                className="text-[11px] font-podium font-bold uppercase tracking-widest px-2 py-0.5 rounded border"
                style={{
                  borderColor: `${activeItem.accent}70`,
                  backgroundColor: `${activeItem.accent}25`,
                  color: activeItem.accent,
                }}
              >
                {activeItem.role}
              </span>
              <span className="text-xs font-inter text-white/60 uppercase tracking-widest">
                {activeItem.zanpakuto}
              </span>
            </div>

            <p className="font-bold uppercase tracking-widest text-lg sm:text-[24px] text-white mb-2 leading-tight drop-shadow-md">
              {activeItem.name}
            </p>

            <p className="hidden sm:block text-xs sm:text-sm text-white/85 leading-[1.6] mb-4 drop-shadow">
              {activeItem.desc}
            </p>

            {/* Nav Arrows */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('prev')}
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-white flex items-center justify-center text-white bg-transparent hover:bg-white/12 hover:scale-108 transition-all duration-150 cursor-pointer shadow-lg active:scale-95"
                title="Previous Espada"
              >
                <ArrowLeft className="w-6 h-6 stroke-[2.25]" />
              </button>
              <button
                onClick={() => navigate('next')}
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-white flex items-center justify-center text-white bg-transparent hover:bg-white/12 hover:scale-108 transition-all duration-150 cursor-pointer shadow-lg active:scale-95"
                title="Next Espada"
              >
                <ArrowRight className="w-6 h-6 stroke-[2.25]" />
              </button>
              <span className="text-xs font-inter text-white/60 uppercase tracking-widest ml-2">
                {activeIndex + 1} / {ESPADA_CAROUSEL_ITEMS.length}
              </span>
            </div>
          </div>

          {/* 6. Bottom-right Sleek Espada HUD Rank Display (REPLACED "DISCOVER IT") */}
          <div className="absolute bottom-6 right-4 sm:bottom-16 sm:right-16 z-[60] text-right pointer-events-none select-none">
            <div className="text-[10px] sm:text-xs font-inter tracking-[0.3em] uppercase text-white/50 mb-0.5">
              ASPECT OF MORTALITY
            </div>
            <div
              className="font-black uppercase leading-none tracking-tight transition-all duration-500"
              style={{
                fontFamily: "'Anton', sans-serif",
                fontSize: 'clamp(42px, 8vw, 96px)',
                color: activeItem.accent,
                textShadow: `0 0 45px ${activeItem.accent}90`,
              }}
            >
              #{activeItem.number}
            </div>
            <div className="text-xs sm:text-sm font-podium font-bold uppercase tracking-wider text-white/90 mt-1">
              {activeItem.aspectOfDeath}
            </div>
          </div>
        </div>
      </section>

      {/* -----------------------------------------------------------------------------
          3. HOLLOW METAPHYSICS SECTION (PANEL 3)
      ----------------------------------------------------------------------------- */}
      <section className="relative w-full min-h-screen snap-start snap-always shrink-0 flex flex-col justify-center px-4 sm:px-8 lg:px-12 py-16 bg-zinc-950">
        <div className="max-w-7xl mx-auto w-full space-y-6">
          <div className="flex items-center gap-3 border-b border-purple-900/60 pb-3">
            <Info className="w-5 h-5 text-purple-400" />
            <h2 className="font-podium text-2xl sm:text-3xl uppercase tracking-wide text-white">
              HOLLOW METAPHYSICS &amp; EVOLUTIONARY HIERARCHY
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border border-purple-900/40 bg-zinc-900/80 p-6 space-y-3 rounded-2xl hover:border-purple-500/60 transition-colors">
              <div className="text-purple-400 font-podium text-3xl font-bold">01.</div>
              <h3 className="font-podium text-lg uppercase text-white">The Three Menos Classes</h3>
              <p className="text-xs text-white/80 leading-relaxed font-inter">
                Hollows evolve through cannibalism. Hundreds of Hollows merge into a <strong>Gillian</strong> (giant Menos Grande). When one mind dominates, it shrinks into a fierce <strong>Adjuchas</strong>, and the rare elite ascend into human-sized <strong>Vasto Lorde</strong>.
              </p>
            </div>

            <div className="border border-purple-900/40 bg-zinc-900/80 p-6 space-y-3 rounded-2xl hover:border-purple-500/60 transition-colors">
              <div className="text-purple-400 font-podium text-3xl font-bold">02.</div>
              <h3 className="font-podium text-lg uppercase text-white">
                Arrancar &amp; Hōgyoku Transformation
              </h3>
              <p className="text-xs text-white/80 leading-relaxed font-inter">
                Hollows who tear off their bone masks gain Soul Reaper powers, sealing their primordial Hollow forms into Zanpakutō. Using the Hōgyoku, Sōsuke Aizen perfected this unmasking process to build the 10 Espada.
              </p>
            </div>

            <div className="border border-purple-900/40 bg-zinc-900/80 p-6 space-y-3 rounded-2xl hover:border-purple-500/60 transition-colors">
              <div className="text-purple-400 font-podium text-3xl font-bold">03.</div>
              <h3 className="font-podium text-lg uppercase text-white">
                The 10 Aspects of Mortality
              </h3>
              <p className="text-xs text-white/80 leading-relaxed font-inter">
                Each of the ten Espada embodies a fundamental cause of human death (Solitude, Aging, Sacrifice, Emptiness, Despair, Destruction, Intoxication, Madness, Gluttony, Wrath). Their tattoos rank them from 0 to 9.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* -----------------------------------------------------------------------------
          4. CANONICAL REGIONS TABLE & FOOTER (PANEL 4)
      ----------------------------------------------------------------------------- */}
      <section className="relative w-full min-h-screen snap-start snap-always shrink-0 flex flex-col justify-between pt-12 sm:pt-16 bg-zinc-950">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-8 lg:px-12 space-y-6 flex-1 flex flex-col justify-center">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-purple-900/60 pb-4">
            <div>
              <div className="font-inter text-xs tracking-[0.3em] uppercase text-purple-400 font-semibold flex items-center gap-2">
                <Layers className="w-4 h-4 text-purple-400" />
                <span>GEOGRAPHICAL STRATA BREAKDOWN</span>
              </div>
              <h2 className="font-podium text-3xl sm:text-4xl uppercase tracking-tight text-white mt-1">
                REGIONS OF HUECO MUNDO
              </h2>
            </div>
            <span className="text-xs font-inter text-white/60 tracking-widest uppercase">
              4 CANONICAL DOMAINS
            </span>
          </div>

          <div className="w-full overflow-hidden rounded-xl border border-purple-900/80 bg-zinc-950/90 shadow-[0_0_50px_rgba(0,0,0,0.9)]">
            <div className="bg-gradient-to-r from-purple-950 via-purple-900 to-purple-950 border-b border-purple-800/80 text-white font-podium font-bold uppercase tracking-widest text-center py-2.5 text-sm sm:text-base shadow-md">
              Territories of the Hollow Realm
            </div>

            <div className="overflow-x-auto scrollbar-none">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="bg-gradient-to-r from-purple-950/90 via-zinc-950 to-purple-950/90 text-white font-podium uppercase text-xs sm:text-sm font-bold tracking-wider border-b border-purple-900/80">
                    <th className="py-3 px-4 w-[22%] text-center border-r border-purple-900/60">Appearance</th>
                    <th className="py-3 px-4 w-[18%] text-center border-r border-purple-900/60">Domain Rank</th>
                    <th className="py-3 px-4 w-[42%] border-r border-purple-900/60">Description &amp; Lore</th>
                    <th className="py-3 px-4 w-[18%] text-center">Ruling Authority</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-purple-900/50 font-inter text-xs sm:text-sm">
                  {HUECO_MUNDO_REGIONS.map((region) => (
                    <tr
                      key={region.level}
                      className="bg-black/60 hover:bg-purple-950/20 transition-colors"
                    >
                      <td className="py-3 px-4 border-r border-purple-900/60 align-middle text-center">
                        <div className="relative w-full max-w-[200px] aspect-[16/10] mx-auto rounded overflow-hidden border border-purple-900/60 shadow-lg group">
                          <img
                            src={region.image}
                            alt={region.order}
                            className="w-full h-full object-cover filter contrast-110 brightness-95 group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      </td>
                      <td className="py-3 px-4 border-r border-purple-900/60 align-middle text-center font-podium font-bold text-sm sm:text-base text-white">
                        {region.order}
                      </td>
                      <td className="py-4 px-5 border-r border-purple-900/60 align-middle text-white/90 leading-relaxed">
                        <strong className="text-white font-podium text-sm sm:text-base font-bold tracking-wide mr-1.5">
                          {region.title}:
                        </strong>
                        {region.description}
                      </td>
                      <td className="py-3 px-4 align-middle text-center font-podium font-bold text-xs sm:text-sm text-purple-300">
                        {region.dominantRuler}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* STICKY FOOTER */}
        <footer className="w-full border-t border-purple-900/60 py-6 text-center text-xs font-inter tracking-[0.3em] text-white/50 uppercase bg-black mt-8 shrink-0">
          B L E A C H • HUECO MUNDO ARCHIVE • ALL RIGHTS RESERVED
        </footer>
      </section>
    </div>
  );
};
