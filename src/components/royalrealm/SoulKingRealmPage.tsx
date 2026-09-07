import React, { useState, useRef, useEffect, useLayoutEffect, useCallback } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { 
  ArrowLeft, 
  ArrowRight,
  Shield, 
  Scale, 
  X,
  ChevronDown
} from 'lucide-react';

interface SoulKingRealmPageProps {
  onBack: () => void;
}

// -----------------------------------------------------------------------------
// CANONICAL DATA: SOUL KING HISTORY & DISMEMBERED ORGANS (SHOWN AFTER HERO)
// -----------------------------------------------------------------------------
const LORE_CHAPTERS = [
  {
    id: 'chapter-1',
    step: '01',
    title: 'The Primordial Void',
    subtitle: 'Era of Formless Chaos',
    image: '/soul-king-palace.jpg',
    lead: 'Before the separation of life and death, the universe was a stagnant, undivided reality.',
    desc: 'Creation had no boundaries between the Human World, Soul Society, and Hueco Mundo. Souls did not reincarnate; instead, emergent Hollows devoured them relentlessly. The Soul King manifested to slaughter Hollows and preserve the collective consciousness of human souls.',
    highlight: 'A formless cosmos without death or reincarnation.'
  },
  {
    id: 'chapter-2',
    step: '02',
    title: 'The Original Sin',
    subtitle: 'Betrayal of the Five Noble Ancestors (原罪)',
    image: '/soul-king-palace.jpg',
    lead: 'The ancestors of the Five Great Noble Families feared his omnipotence and chose treachery.',
    desc: 'Led by the Tsunayashiro ancestor, the Five Noble Clan Heads conspired to divide creation into three worlds. Offering zero resistance despite his absolute foresight, the Soul King was mutilated: limbs amputated, heart carved out, organs excised, and his will sealed forever in amber crystal.',
    highlight: 'Mutilated into a mindless living battery to sustain noble rule.'
  },
  {
    id: 'chapter-3',
    step: '03',
    title: 'Right Arm: Mimihagi',
    subtitle: 'Governance of Stillness & Stagnation (静止)',
    image: '/soul-king-palace.jpg',
    lead: 'Worshipped in Eastern Rukongai as the divine halting of all progression.',
    desc: 'Mimihagi governs stillness. In ancient times, it halted the fatal pulmonary decay of child Jūshirō Ukitake in exchange for consuming his lungs. In TYBW, Ukitake sacrificed his life via "Kamikake" so Mimihagi could manifest in the Royal Palace and temporarily hold the collapsing worlds together.',
    highlight: 'Halted decay and sacrificed to stabilize the worlds.'
  },
  {
    id: 'chapter-4',
    step: '04',
    title: 'Left Arm: Pernida',
    subtitle: 'Governance of Progress & Evolution (前進・進化)',
    image: '/soul-king-palace.jpg',
    lead: 'Possessed self-awareness and immense Quincy pride as Sternritter "C".',
    desc: 'The Left Arm embodies continuous evolution. Pernida shoots invisible nerve threads that forcibly invade anatomy, instantly seizing motor control and assimilating traits of anything it contacts. Defeated only when Mayuri Kurotsuchi induced fatal cellular hyper-regeneration.',
    highlight: 'Evolution so relentless it shattered all biological ceilings.'
  },
  {
    id: 'chapter-5',
    step: '05',
    title: 'The Heart: Gerard',
    subtitle: 'The Miracle & Manifested Faith (奇跡)',
    image: '/soul-king-palace.jpg',
    lead: 'The Soul King’s heart manifested as Sternritter "M" — The Miracle.',
    desc: 'Gerard Valkyrie did not receive power from Yhwach; the miracle was his innate birthright. By converting all physical injury and lethal damage into divine physical mass and surging spirit pressure, Gerard grew endlessly into an immortal titan.',
    highlight: 'All physical trauma converted into divine colossal power.'
  },
  {
    id: 'chapter-6',
    step: '06',
    title: 'Nails & The Hōgyoku',
    subtitle: 'Soul Slivers That Catalyzed Aizen’s Ambition',
    image: '/soul-king-palace.jpg',
    lead: 'Fragments of the Soul King gave birth to the completed Hōgyoku.',
    desc: 'Tiny fragments of the Soul King’s nail and spirit were scattered through Soul Society. Sōsuke Aizen stole a Soul King fragment embedded inside young Rangiku Matsumoto and fused it into his prototype Hōgyoku, granting it the divine ability to manifest desires.',
    highlight: 'The stolen divine catalyst behind the transcendent Hōgyoku.'
  }
];

// -----------------------------------------------------------------------------
// MERGED DATA: SQUAD ZERO & THE 5 FLOATING PALACES (ZERO BAN RIDEN)
// -----------------------------------------------------------------------------
const MERGED_SQUAD_ZERO = [
  {
    id: 'ichibe',
    number: '01',
    officer: 'Ichibē Hyōsube',
    kanji: '兵主部 一兵衛',
    alias: 'Monk Who Calls the Real Name (真名呼和尚)',
    role: 'Supreme Leader of the Royal Guard',
    palaceName: 'Hyōsube Palace / Main Outer Shrine (主部殿)',
    palaceDomain: 'Sanctuary of Primordial Names & True Black',
    image: '/squad0/ichibe.jpg',
    kanjiSeal: '真名',
    invention: 'Names of All Things in Soul Society',
    inventionBrief: 'Bestowed the name "Zanpakutō", "Shikai", and "Bankai". Controls all Black in creation.',
    zanpakuto: 'Ichimonji (一文字)',
    releaseCommand: 'Blacken (黒めよ - Kuromeyo)',
    bankai: 'Shirafude Ichimonji (白筆一文字)',
    powers: [
      'Erases names and metaphysical attributes with dark calligraphy ink',
      'Shirafude Ichimonji writes new names on blackened foes (e.g. "Black Ant")',
      'Senri Tsūtenshō: Golden palm swats foes 1,000 ri away',
      'Futen Taisatsuryō: Consumes 100 nights to erase reincarnation'
    ],
    palaceSpec: 'The innermost outer sanctuary where Ichibē regulates all conceptual ink in the three worlds.'
  },
  {
    id: 'oetsu',
    number: '02',
    officer: 'Ōetsu Nimaiya',
    kanji: '二枚屋 王悦',
    alias: 'God of the Sword (刀神 - Tōshin)',
    role: 'Creator of the Zanpakutō Core',
    palaceName: 'Hōōden (鳳凰殿 - Phoenix Palace)',
    palaceDomain: 'The Asauchi Cliff Abyss & Zanpakutō Forge',
    image: '/squad0/oetsu.jpg',
    kanjiSeal: '刀神',
    invention: 'The Asauchi (浅打 - Blank Katana Template)',
    inventionBrief: 'Created the forging process for every Zanpakutō in history, layering hundreds of souls.',
    zanpakuto: 'Sayafushi (鞘伏 - The Unsheathable Blade)',
    releaseCommand: 'Absolute Razor Keenness',
    bankai: 'Classified / Primordial Forge Ritual',
    powers: [
      'Sayafushi: Frictionless razor edge so keen no scabbard can hold it',
      'One-slices elite Schutzstaffel members with instantaneous speed',
      'Omnipresent connection to every single Zanpakutō in existence'
    ],
    palaceSpec: 'Beneath a party facade lies a dark flooded pit filled with thousands of unaligned Asauchi.'
  },
  {
    id: 'tenjiro',
    number: '03',
    officer: 'Tenjirō Kirinji',
    kanji: '麒麟寺 天示郎',
    alias: 'Hot Spring Demon (泉湯鬼) / Lightning Fast',
    role: 'First Defensive Officer',
    palaceName: 'Kirinden (麒麟殿 - Kirin Palace)',
    palaceDomain: 'White Bone Hell & Blood Pond Hell Springs',
    image: '/squad0/tenjiro.jpg',
    kanjiSeal: '泉湯',
    invention: 'Healing Hot Springs (Reishi Replenishment)',
    inventionBrief: 'Thermal springs that flush tainted spirit blood and flood damaged souls with raw Reishi.',
    zanpakuto: 'Kinpika (金毘迦 - Flash of Light)',
    releaseCommand: 'Flash and Illuminate (天照らせ)',
    bankai: 'Classified / Healing Blood Torrent',
    powers: [
      'Shunpō speed surpassing Squad 2 Captain Soi Fon without detection',
      'Summons scalding blood water that melts damaged spirit vessels',
      'Kinpika radiates searing celestial luminosity to strike down foes'
    ],
    palaceSpec: 'Kisuke Urahara modeled his underground healing hot spring directly after Kirinden.'
  },
  {
    id: 'senjumaru',
    number: '04',
    officer: 'Senjumaru Shutara',
    kanji: '修多羅 千手丸',
    alias: 'Great Weave (大織守)',
    role: 'Celestial Weaver of Reality',
    palaceName: 'Senshumaru Palace (丸千手殿 - Loom Palace)',
    palaceDomain: 'Cosmic Silk Looms & Ōken Garments',
    image: '/squad0/senjumaru.jpg',
    kanjiSeal: '織守',
    invention: 'Ōken Attire & Spiritual Fabric Weaving',
    inventionBrief: 'Celestial fabrics containing the Royal Key that resist dimensional friction.',
    zanpakuto: 'Shigarami (刺絡 - Piercing Loom)',
    releaseCommand: 'Weave and Bind (織り成せ)',
    bankai: 'Shatatsu Karagara Shigaraminotsuji (娑闥迦羅骸刺絡辻)',
    powers: [
      'Controls six agile mechanical prosthetic limbs with needle precision',
      'Bankai weaves tailored execution tapestry rooms for six foes simultaneously',
      'Crafts clothing that allows transit through the 72 spiritual barriers'
    ],
    palaceSpec: 'Endless bolts of Reishi silk suspended across atmospheric weaving chambers.'
  },
  {
    id: 'kirio',
    number: '05',
    officer: 'Kirio Hikifune',
    kanji: '曳舟 桐生',
    alias: 'Ruler of Grain (穀王)',
    role: 'Master of Spiritual Nutrition',
    palaceName: 'Gatonden (臥豚殿 - Banquet Pavilion)',
    palaceDomain: 'The Feast of Life & Spirit Nutrition',
    image: '/squad0/kirio.jpg',
    kanjiSeal: '穀王',
    invention: 'Gikongan (義魂丸 - Artificial Soul Candy)',
    inventionBrief: 'The logic of infusing foreign spiritual souls into biological vessels.',
    zanpakuto: 'Kubikiri Orochi (首切り大蛇)',
    releaseCommand: 'Harvest and Nourish',
    bankai: 'Sanbutsu / Cage of Life Manifestation',
    powers: [
      'The Cage of Life: Living tree sanctuary that feeds on enemy Reishi',
      'Super-metabolic cooking: Infuses divine spiritual density into consumers',
      'Pioneered artificial soul logic foundational to all Mod Souls'
    ],
    palaceSpec: 'A celestial banquet kitchen where Hikifune expends her reiatsu to forge divine food.'
  }
];

// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------
// DIRECTION-AWARE SLIDE IN/OUT ANIMATION VARIANTS
// -----------------------------------------------------------------------------
const titleVariants = {
  enter: (direction: 'down' | 'up') => ({
    y: direction === 'down' ? 50 : -50,
    opacity: 0,
    filter: 'blur(4px)'
  }),
  center: {
    y: 0,
    opacity: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 0.45,
      ease: [0.16, 1, 0.3, 1]
    }
  },
  exit: (direction: 'down' | 'up') => ({
    y: direction === 'down' ? -50 : 50,
    opacity: 0,
    filter: 'blur(4px)',
    transition: {
      duration: 0.3,
      ease: [0.7, 0, 0.84, 0]
    }
  })
};

const cardVariants = {
  enter: (direction: 'down' | 'up') => ({
    y: direction === 'down' ? 60 : -60,
    opacity: 0,
    scale: 0.94,
    filter: 'blur(4px)'
  }),
  center: {
    y: 0,
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 0.45,
      ease: [0.16, 1, 0.3, 1]
    }
  },
  exit: (direction: 'down' | 'up') => ({
    y: direction === 'down' ? -60 : 60,
    opacity: 0,
    scale: 0.94,
    filter: 'blur(4px)',
    transition: {
      duration: 0.3,
      ease: [0.7, 0, 0.84, 0]
    }
  })
};

const narrativeVariants = {
  enter: (direction: 'down' | 'up') => ({
    y: direction === 'down' ? 40 : -40,
    opacity: 0
  }),
  center: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.45,
      delay: 0.03,
      ease: [0.16, 1, 0.3, 1]
    }
  },
  exit: (direction: 'down' | 'up') => ({
    y: direction === 'down' ? -40 : 40,
    opacity: 0,
    transition: {
      duration: 0.28,
      ease: [0.7, 0, 0.84, 0]
    }
  })
};

export const SoulKingRealmPage: React.FC<SoulKingRealmPageProps> = ({ onBack }) => {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [activeLoreIndex, setActiveLoreIndex] = useState<number>(0);
  const [activeOfficerIndex, setActiveOfficerIndex] = useState<number>(0);
  const [scrollDirection, setScrollDirection] = useState<'down' | 'up'>('down');
  
  const containerRef = useRef<HTMLDivElement>(null);
  const squadZeroSectionRef = useRef<HTMLDivElement>(null);
  const isNavigatingRef = useRef<boolean>(false);

  // Parallax Scroll Tracking inside snap container
  const { scrollY } = useScroll({ container: containerRef });
  const heroImgY = useTransform(scrollY, [0, 800], [0, 180]);
  const heroScale = useTransform(scrollY, [0, 800], [1.02, 1.15]);
  const heroOpacity = useTransform(scrollY, [0, 600], [1, 0.25]);
  const watermarkY = useTransform(scrollY, [0, 800], [0, 200]);

  // Preload Squad Zero Artwork on Mount
  useEffect(() => {
    MERGED_SQUAD_ZERO.forEach((item) => {
      const img = new Image();
      img.src = item.image;
    });
  }, []);

  // Step Navigation with 500ms lock (stays firmly in place, no middle reset)
  const navigateOfficer = useCallback(
    (dir: 'next' | 'prev') => {
      if (isNavigatingRef.current) return;

      if (dir === 'next') {
        if (activeOfficerIndex < MERGED_SQUAD_ZERO.length - 1) {
          isNavigatingRef.current = true;
          setScrollDirection('down');
          setActiveOfficerIndex((prev) => prev + 1);
          setTimeout(() => {
            isNavigatingRef.current = false;
          }, 500);
        }
      } else {
        if (activeOfficerIndex > 0) {
          isNavigatingRef.current = true;
          setScrollDirection('up');
          setActiveOfficerIndex((prev) => prev - 1);
          setTimeout(() => {
            isNavigatingRef.current = false;
          }, 500);
        }
      }
    },
    [activeOfficerIndex]
  );

  // Jump directly to an officer
  const selectOfficer = (idx: number) => {
    if (idx === activeOfficerIndex || isNavigatingRef.current) return;
    isNavigatingRef.current = true;
    setScrollDirection(idx > activeOfficerIndex ? 'down' : 'up');
    setActiveOfficerIndex(idx);
    setTimeout(() => {
      isNavigatingRef.current = false;
    }, 500);
  };

  // ---------------------------------------------------------------------------
  // WHEEL HANDLER: Cleanly cycles officers on Squad Zero block
  // Scrolling down advances 1 officer and stays.
  // Scrolling up retreats 1 officer and stays.
  // Scrolling up on Officer 0 smoothly snaps back up to Soul King chronicles.
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const section = squadZeroSectionRef.current;
    if (!section) return;

    const handleWheel = (e: WheelEvent) => {
      const rect = section.getBoundingClientRect();
      // Squad Zero is currently in view (snapped into full screen)
      const inView = rect.top <= 120 && rect.bottom >= window.innerHeight * 0.6;
      if (!inView) return;

      if (Math.abs(e.deltaY) < 15) return;

      if (e.deltaY > 0) {
        // Scrolling DOWN
        if (activeOfficerIndex < MERGED_SQUAD_ZERO.length - 1) {
          e.preventDefault();
          e.stopPropagation();
          navigateOfficer('next');
        } else {
          // At the last officer (Kirio, index 4): prevent scrolling further since there is no footer
          e.preventDefault();
          e.stopPropagation();
        }
      } else if (e.deltaY < 0) {
        // Scrolling UP
        if (activeOfficerIndex > 0) {
          e.preventDefault();
          e.stopPropagation();
          navigateOfficer('prev');
        }
        // At Officer 0 (Ichibē): don't preventDefault, allowing smooth snap back up to #soul-king!
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      window.removeEventListener('wheel', handleWheel);
    };
  }, [activeOfficerIndex, navigateOfficer]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const section = squadZeroSectionRef.current;
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const inView = rect.top <= 120 && rect.bottom >= window.innerHeight * 0.6;
      if (!inView) return;

      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        if (activeOfficerIndex < MERGED_SQUAD_ZERO.length - 1) {
          e.preventDefault();
          navigateOfficer('next');
        }
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        if (activeOfficerIndex > 0) {
          e.preventDefault();
          navigateOfficer('prev');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeOfficerIndex, navigateOfficer]);

  // Touch swipe support
  useEffect(() => {
    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const section = squadZeroSectionRef.current;
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const inView = rect.top <= 120 && rect.bottom >= window.innerHeight * 0.6;
      if (!inView) return;

      const touchEndY = e.changedTouches[0].clientY;
      const diff = touchStartY - touchEndY;
      if (Math.abs(diff) > 40) {
        if (diff > 0 && activeOfficerIndex < MERGED_SQUAD_ZERO.length - 1) {
          navigateOfficer('next');
        } else if (diff < 0 && activeOfficerIndex > 0) {
          navigateOfficer('prev');
        }
      }
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [activeOfficerIndex, navigateOfficer]);

  // Ensure initial scroll position starts at top
  useLayoutEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  }, []);

  const scrollToAnchor = (id: string) => {
    setMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const activeLore = LORE_CHAPTERS[activeLoreIndex];
  const activeOfficer = MERGED_SQUAD_ZERO[activeOfficerIndex] || MERGED_SQUAD_ZERO[0];

  return (
    <div 
      ref={containerRef}
      className="h-screen w-full overflow-y-auto snap-y snap-mandatory scroll-smooth bg-[#000000] text-[#FFFFFF] font-sans selection:bg-[#DC2626] selection:text-white"
    >
      {/* -----------------------------------------------------------------------------
          BACKGROUND VERTICAL GUIDE LINES (TYBW Minimalist Grid)
      ----------------------------------------------------------------------------- */}
      <div className="fixed inset-0 pointer-events-none z-0 flex justify-between max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 opacity-[0.04]">
        <div className="w-[1px] h-full bg-white" />
        <div className="w-[1px] h-full bg-white hidden sm:block" />
        <div className="w-[1px] h-full bg-white" />
        <div className="w-[1px] h-full bg-white hidden sm:block" />
        <div className="w-[1px] h-full bg-white hidden md:block" />
        <div className="w-[1px] h-full bg-white" />
      </div>

      {/* -----------------------------------------------------------------------------
          FLOATING TOP CONTROLS (NO SOLID BLACK BAR OR LINE ACROSS SCREEN)
      ----------------------------------------------------------------------------- */}
      <div className="fixed top-5 inset-x-0 z-40 max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between pointer-events-none">
        {/* Floating Back Button */}
        <button
          onClick={onBack}
          className="pointer-events-auto text-xs font-mono font-bold tracking-widest uppercase text-white/80 hover:text-white bg-black/70 hover:bg-red-950/90 border border-white/15 hover:border-red-600 px-4 py-2 rounded-full backdrop-blur-md transition-all cursor-pointer shadow-lg group flex items-center gap-2"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-white/60 group-hover:text-red-500 transition-colors" />
          <span>REALMS</span>
        </button>

        {/* Floating Minimalist Menu Icon Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="pointer-events-auto w-11 h-11 rounded-full bg-black/70 hover:bg-red-600 border border-white/15 hover:border-red-500 text-white flex flex-col items-center justify-center gap-1.5 backdrop-blur-md transition-all cursor-pointer shadow-lg group"
          title="Open Navigation Menu"
        >
          <span className="w-4 h-[2px] bg-white group-hover:bg-white transition-all" />
          <span className="w-4 h-[2px] bg-red-500 group-hover:bg-white transition-all" />
        </button>
      </div>

      {/* -----------------------------------------------------------------------------
          SILKY SMOOTH FULLSCREEN CURTAIN NAVIGATION (ANIMATE PRESENCE)
      ----------------------------------------------------------------------------- */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ y: '-100%', opacity: 0 }}
            animate={{ y: '0%', opacity: 1 }}
            exit={{ y: '-100%', opacity: 0 }}
            transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-50 bg-[#050505]/98 backdrop-blur-3xl flex flex-col justify-between p-6 sm:p-12 lg:p-16 text-white"
          >
            {/* Top Bar */}
            <div className="flex items-center justify-between border-b border-white/10 pb-6">
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
                <span className="text-xs font-mono tracking-[0.3em] uppercase text-white/70">
                  REIŌKYŪ // TYBW ARCHIVE
                </span>
              </div>
              <button
                onClick={() => setMenuOpen(false)}
                className="w-11 h-11 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-red-600 hover:border-red-500 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Massive Angled Typography Links */}
            <ul className="space-y-6 my-auto">
              {[
                { id: 'hero', label: '01. The Sacred Realm (Hero Overview)' },
                { id: 'soul-king', label: '02. The Soul King & Dismembered Organs' },
                { id: 'squad-zero', label: '03. Squad Zero & The 5 Floating Palaces' }
              ].map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => scrollToAnchor(item.id)}
                    className="group flex items-center gap-4 text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tighter text-white/40 hover:text-white transition-colors cursor-pointer text-left"
                  >
                    <span className="text-xs font-mono text-red-500 tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                      → VIEW
                    </span>
                    <span className="group-hover:translate-x-3 group-hover:text-red-500 transition-all duration-300">
                      {item.label}
                    </span>
                  </button>
                </li>
              ))}
            </ul>

            {/* Bottom Footer */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs font-mono uppercase tracking-widest text-white/40">
              <span>CANON PROTOCOL: THOUSAND-YEAR BLOOD WAR</span>
              <button
                onClick={onBack}
                className="text-red-500 hover:text-white transition-colors cursor-pointer"
              >
                ← EXIT TO REALMS
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* -----------------------------------------------------------------------------
          1. HERO STAGE (1ST IMAGE) WITH TELEMETRY & PARALLAX (`#hero`)
      ----------------------------------------------------------------------------- */}
      <section id="hero" className="relative w-full h-screen flex flex-col justify-between overflow-hidden border-b border-white/10">
        {/* Parallax Ghost Watermark Typography */}
        <motion.div
          style={{ y: watermarkY }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0"
        >
          <span className="font-black text-[22vw] leading-none uppercase text-white/[0.02] tracking-tighter">
            REIŌKYŪ
          </span>
        </motion.div>

        {/* Parallax Image Background (Grayscale until subtle hover/scroll) */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <motion.img
            style={{ y: heroImgY, scale: heroScale }}
            src="/soul-king-palace.jpg"
            alt="Soul King Palace (霊王宮)"
            className="w-full h-full object-cover object-center filter grayscale contrast-125 brightness-75 hover:grayscale-0 transition-all duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#000000] via-[#000000]/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#000000] via-transparent to-[#000000]/90" />
        </div>

        {/* Top Spacer */}
        <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-8 pt-20 pb-4">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.3em] text-red-500">
            <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
            <span>DIMENSIONAL APEX // 霊王宮</span>
          </div>
        </div>

        {/* Hero Titles & Concise Typography */}
        <motion.div
          style={{ opacity: heroOpacity }}
          className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-8 space-y-6 my-auto"
        >
          <h1 className="font-black uppercase tracking-tight text-[clamp(2.8rem,8vw,7rem)] leading-[0.9] text-white">
            SOUL KING PALACE.
            <br />
            <span className="text-red-600">ROYAL REALM.</span>
          </h1>

          <p className="max-w-xl text-xs sm:text-sm text-zinc-400 font-mono uppercase tracking-wider leading-relaxed">
            The isolated sanctuary sealed behind 72 spiritual barriers. Enshrines the cosmic Lynchpin of creation and the five transcendent creators of Squad Zero.
          </p>

          {/* Minimal TYBW Telemetry HUD (Black & Red on hover) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 max-w-3xl border-t border-white/10">
            <div className="group space-y-1 p-3 rounded-lg border border-transparent hover:border-red-600/40 hover:bg-red-950/20 transition-all cursor-default">
              <span className="font-mono text-3xl font-black text-white group-hover:text-red-500 transition-colors block leading-none">
                72
              </span>
              <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 group-hover:text-white/80 transition-colors block">
                SPIRIT BARRIERS
              </span>
            </div>

            <div className="group space-y-1 p-3 rounded-lg border border-transparent hover:border-red-600/40 hover:bg-red-950/20 transition-all cursor-default">
              <span className="font-mono text-3xl font-black text-white group-hover:text-red-500 transition-colors block leading-none">
                05
              </span>
              <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 group-hover:text-white/80 transition-colors block">
                DISC PALACES
              </span>
            </div>

            <div className="group space-y-1 p-3 rounded-lg border border-transparent hover:border-red-600/40 hover:bg-red-950/20 transition-all cursor-default">
              <span className="font-mono text-3xl font-black text-white group-hover:text-red-500 transition-colors block leading-none">
                01
              </span>
              <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 group-hover:text-white/80 transition-colors block">
                COSMIC LYNCHPIN
              </span>
            </div>

            <div className="group space-y-1 p-3 rounded-lg border border-transparent hover:border-red-600/40 hover:bg-red-950/20 transition-all cursor-default">
              <span className="font-mono text-3xl font-black text-white group-hover:text-red-500 transition-colors block leading-none">
                &gt;13
              </span>
              <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 group-hover:text-white/80 transition-colors block">
                GOTEI SQUAD POWER
              </span>
            </div>
          </div>
        </motion.div>

        {/* Hero Bottom Telemetry Bar */}
        <div className="relative z-10 w-full border-t border-white/10 py-4 px-4 sm:px-8 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-zinc-500 uppercase tracking-widest gap-2">
          <span>THOUSAND-YEAR BLOOD WAR // CANON DATA</span>
          <button 
            onClick={() => scrollToAnchor('soul-king')}
            className="flex items-center gap-2 text-red-500 hover:text-white transition-colors cursor-pointer"
          >
            <span>SCROLL TO CHRONICLES</span>
            <ChevronDown className="w-3.5 h-3.5 animate-bounce" />
          </button>
        </div>
      </section>

      {/* -----------------------------------------------------------------------------
          2. THE SOUL KING & DISMEMBERED ORGANS (`#soul-king`)
      ----------------------------------------------------------------------------- */}
      <section 
        id="soul-king" 
        className="relative w-full h-screen snap-start snap-always shrink-0 flex flex-col justify-center overflow-hidden border-b border-white/10 py-8 sm:py-12 px-4 sm:px-8 lg:px-16"
      >
        <div className="max-w-7xl mx-auto w-full space-y-5 sm:space-y-6 my-auto min-h-0">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div className="space-y-1">
              <div className="text-xs font-mono tracking-[0.3em] uppercase text-red-500 flex items-center gap-2">
                <Scale className="w-3.5 h-3.5 text-red-500" />
                <span>COSMIC LYNCHPIN // 霊王と神体</span>
              </div>
              <h2 className="font-black text-2xl sm:text-4xl uppercase tracking-tight text-white">
                THE SOUL KING &amp; DISMEMBERED ORGANS
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono uppercase tracking-widest text-zinc-500">CHRONICLE:</span>
              <span className="text-sm font-black font-mono text-red-500">
                {activeLore.step} / 0{LORE_CHAPTERS.length}
              </span>
            </div>
          </div>

          {/* Minimalist Step Pills */}
          <div className="flex flex-wrap gap-2">
            {LORE_CHAPTERS.map((chapter, index) => {
              const isActive = activeLoreIndex === index;
              return (
                <button
                  key={chapter.id}
                  onClick={() => setActiveLoreIndex(index)}
                  className={`px-3 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
                    isActive
                      ? 'bg-red-600 text-white font-bold shadow-[0_0_20px_rgba(220,38,38,0.4)]'
                      : 'bg-zinc-950 text-zinc-400 hover:text-white hover:bg-zinc-900 border border-white/10'
                  }`}
                >
                  {chapter.step}. {chapter.title.split(':')[0]}
                </button>
              );
            })}
          </div>

          {/* Active Chapter Presentation Box (Hover Bloom) */}
          <div className="group bg-zinc-950 border border-white/10 hover:border-red-600/70 p-5 sm:p-8 rounded-2xl grid grid-cols-1 lg:grid-cols-12 gap-6 items-center transition-all duration-500 hover:shadow-[0_0_40px_rgba(220,38,38,0.2)]">
            {/* Left Visual Column */}
            <div className="lg:col-span-5 space-y-3">
              <div className="relative aspect-[16/10] max-h-[220px] rounded-xl overflow-hidden border border-white/10">
                <img
                  src={activeLore.image}
                  alt={activeLore.title}
                  className="w-full h-full object-cover filter grayscale contrast-125 opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                <div className="absolute bottom-2.5 left-2.5 text-[10px] font-mono uppercase tracking-widest text-red-400 bg-black/90 px-2.5 py-1 rounded border border-white/20">
                  {activeLore.subtitle}
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/10 text-xs font-mono text-zinc-400 group-hover:border-red-900/50 transition-colors">
                <span className="text-red-500 font-bold block mb-0.5">AXIOM:</span>
                {activeLore.highlight}
              </div>
            </div>

            {/* Right Text Column */}
            <div className="lg:col-span-7 space-y-3">
              <div className="space-y-1">
                <span className="text-xs font-mono uppercase tracking-[0.25em] text-red-500">
                  CHRONICLE {activeLore.step} // {activeLore.subtitle}
                </span>
                <h3 className="font-black text-xl sm:text-3xl uppercase tracking-tight text-white leading-tight group-hover:text-red-50 transition-colors">
                  {activeLore.title}
                </h3>
              </div>

              <p className="text-xs sm:text-sm font-bold text-white/90 leading-relaxed font-sans">
                {activeLore.lead}
              </p>

              <p className="text-xs text-zinc-400 font-normal leading-relaxed font-sans">
                {activeLore.desc}
              </p>

              {/* Next / Prev Steppers + Jump to Squad Zero */}
              <div className="pt-3 flex items-center justify-between border-t border-white/10">
                <div className="flex items-center gap-2">
                  <button
                    disabled={activeLoreIndex === 0}
                    onClick={() => setActiveLoreIndex((prev) => Math.max(0, prev - 1))}
                    className="px-3 py-1.5 rounded-full border border-white/20 text-xs font-mono uppercase tracking-wider text-white disabled:opacity-30 hover:bg-white/10 transition-all cursor-pointer disabled:cursor-not-allowed"
                  >
                    ← PREV
                  </button>
                  <button
                    disabled={activeLoreIndex === LORE_CHAPTERS.length - 1}
                    onClick={() => setActiveLoreIndex((prev) => Math.min(LORE_CHAPTERS.length - 1, prev + 1))}
                    className="px-3.5 py-1.5 rounded-full border border-red-600 text-xs font-mono uppercase tracking-wider text-white bg-red-600 font-bold disabled:opacity-30 hover:bg-red-500 transition-all cursor-pointer disabled:cursor-not-allowed shadow-md"
                  >
                    NEXT CHAPTER →
                  </button>
                </div>

                <button
                  onClick={() => scrollToAnchor('squad-zero')}
                  className="flex items-center gap-1.5 text-xs font-mono text-red-500 hover:text-white transition-colors cursor-pointer"
                >
                  <span className="hidden sm:inline">PROCEED TO</span>
                  <span>SQUAD ZERO</span>
                  <ChevronDown className="w-3.5 h-3.5 animate-bounce" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* -----------------------------------------------------------------------------
          3. SQUAD ZERO & THE 5 FLOATING PALACES (`#squad-zero`)
          Takes the entire screen cleanly like the 10 Espada block in Hueco Mundo!
          Direction-aware slide in/out animations with single active card (NO PREVIEWS).
          Fixed top clearance (no collisions) and bottom clearance (no counter cutoffs).
      ----------------------------------------------------------------------------- */}
      <section 
        id="squad-zero" 
        ref={squadZeroSectionRef}
        className="relative w-full h-screen snap-start snap-always shrink-0 bg-[#000000] flex flex-col justify-between pt-20 lg:pt-24 pb-6 sm:pb-8 px-6 sm:px-12 lg:px-16 xl:px-20 overflow-hidden select-none"
      >
        {/* Top Telemetry Header spanning across the canvas */}
        <div className="w-full flex items-center justify-between border-b border-white/10 pb-3 flex-shrink-0">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
            <span className="text-xs font-mono tracking-[0.3em] uppercase text-white/80">
              SQUAD ZERO // 零番隊 &amp; THE 5 FLOATING PALACES
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-zinc-500 uppercase tracking-widest">
            <span>ROYAL GUARD ARCHIVE</span>
            <span>•</span>
            <span className="text-red-500">SCROLL OR ARROWS TO CYCLE</span>
          </div>
        </div>

        {/* Main 3-Column Stage Taking the Entire Canvas */}
        <div className="flex-1 w-full flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-10 xl:gap-12 relative my-auto min-h-0 py-2 sm:py-3">
          
          {/* Column 1: Left Typography Title with Direction-Aware Slide */}
          <div className="w-full lg:w-[28%] flex flex-col justify-center text-left">
            <AnimatePresence mode="wait" custom={scrollDirection}>
              <motion.div
                key={activeOfficer.id}
                custom={scrollDirection}
                variants={titleVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="space-y-3 sm:space-y-4"
              >
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.25em] text-red-500">
                  <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                  <span>OFFICER {activeOfficer.number}</span>
                </div>

                <h2 className="font-black text-4xl sm:text-5xl lg:text-6xl xl:text-7xl uppercase tracking-tighter text-white leading-[0.9]">
                  {activeOfficer.officer.split(' ')[0]}
                  <br />
                  <span className="text-zinc-400 hover:text-red-500 transition-colors">
                    {activeOfficer.officer.split(' ')[1] || ''}
                  </span>
                </h2>

                <div className="space-y-1 pt-1 border-t border-white/10">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs font-mono text-zinc-500 tracking-widest">{activeOfficer.kanji}</span>
                    <span className="w-1 h-1 rounded-full bg-red-600" />
                    <span className="text-xs font-mono text-red-400 font-bold uppercase tracking-wider">{activeOfficer.role}</span>
                  </div>
                  <span className="text-[11px] font-mono text-zinc-400 block">
                    {activeOfficer.alias}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Column 2: Center Single Active Card (NO top/bottom preview cards!) */}
          <div className="w-full lg:w-[42%] flex items-center justify-center relative min-h-0 py-2">
            <AnimatePresence mode="wait" custom={scrollDirection}>
              <motion.div
                key={activeOfficer.id}
                custom={scrollDirection}
                variants={cardVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="relative w-full max-w-[320px] sm:max-w-[360px] lg:max-w-[400px] aspect-[4/5] max-h-[48vh] sm:max-h-[52vh] rounded-2xl overflow-hidden border border-red-600/80 ring-2 ring-red-600/50 shadow-[0_0_60px_rgba(220,38,38,0.45)] group select-none flex-shrink-0"
              >
                {/* High-Resolution Officer Artwork */}
                <img
                  src={activeOfficer.image}
                  alt={activeOfficer.officer}
                  draggable={false}
                  className="w-full h-full object-cover object-top filter contrast-105 group-hover:scale-105 transition-transform duration-500"
                />

                {/* Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />

                {/* Kanji Seal Watermark */}
                <div className="absolute top-4 right-4 text-white/30 group-hover:text-red-500/60 font-black text-2xl sm:text-3xl font-mono tracking-widest pointer-events-none transition-colors">
                  {activeOfficer.kanjiSeal}
                </div>

                {/* Top Left Floating Tag */}
                <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/15 text-[10px] font-mono text-red-400 uppercase tracking-widest pointer-events-none">
                  DIVINE REALM // 0{activeOfficer.number}
                </div>

                {/* Bottom Card Badge */}
                <div className="absolute bottom-4 inset-x-4 flex items-center justify-between pointer-events-none">
                  <div className="bg-black/85 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/15 text-xs font-mono text-white/95 flex items-center gap-2">
                    <span className="text-red-500 font-bold">{activeOfficer.number}</span>
                    <span>{activeOfficer.officer.split(' ')[0]}</span>
                  </div>
                  <div className="text-[10px] font-mono uppercase tracking-widest text-zinc-300 bg-black/85 px-3 py-1.5 rounded-full border border-white/10">
                    {activeOfficer.palaceName.split('(')[0].trim()}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Column 3: Right Narrative Block (Streamlined to prevent collision & cutoffs) */}
          <div className="w-full lg:w-[30%] flex flex-col justify-center text-left">
            <AnimatePresence mode="wait" custom={scrollDirection}>
              <motion.div
                key={activeOfficer.id}
                custom={scrollDirection}
                variants={narrativeVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="space-y-3 sm:space-y-4"
              >
                {/* Floating Palace Domain */}
                <div className="space-y-1 border-b border-white/10 pb-2.5">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">
                    FLOATING PALACE // DISC {activeOfficer.number}
                  </span>
                  <h3 className="font-black text-lg sm:text-xl lg:text-2xl text-white uppercase tracking-tight">
                    {activeOfficer.palaceName}
                  </h3>
                  <p className="text-xs font-mono text-red-400 font-semibold">
                    {activeOfficer.palaceDomain}
                  </p>
                  <p className="text-xs text-zinc-400 font-sans leading-relaxed line-clamp-2">
                    {activeOfficer.palaceSpec}
                  </p>
                </div>

                {/* Historic Invention */}
                <div className="p-2.5 sm:p-3 rounded-xl bg-zinc-950/90 border border-white/10 hover:border-red-600/50 transition-colors space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 block">
                    SOUL SOCIETY INVENTION
                  </span>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                    {activeOfficer.invention}
                  </h4>
                  <p className="text-[11px] sm:text-xs text-zinc-400 font-sans leading-relaxed line-clamp-2">
                    {activeOfficer.inventionBrief}
                  </p>
                </div>

                {/* Zanpakutō & Bankai Specs Grid */}
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="p-2 sm:p-2.5 rounded-lg bg-black/60 border border-white/10">
                    <span className="text-[10px] text-zinc-500 block">ZANPAKUTŌ</span>
                    <strong className="text-white text-xs block truncate mt-0.5">{activeOfficer.zanpakuto}</strong>
                    <span className="text-[10px] text-red-400 block mt-0.5 truncate">{activeOfficer.releaseCommand}</span>
                  </div>
                  <div className="p-2 sm:p-2.5 rounded-lg bg-black/60 border border-white/10">
                    <span className="text-[10px] text-zinc-500 block">BANKAI</span>
                    <strong className="text-white text-xs block truncate mt-0.5">{activeOfficer.bankai.split('(')[0]}</strong>
                    <span className="text-[10px] text-zinc-400 block mt-0.5">Absolute Authority</span>
                  </div>
                </div>

                {/* Divine Powers */}
                <div className="space-y-1 pt-0.5">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">
                    DIVINE CAPABILITIES
                  </span>
                  <ul className="space-y-1 text-xs text-zinc-300 font-sans">
                    {activeOfficer.powers.slice(0, 2).map((p, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-red-500 font-bold font-mono">›</span>
                        <span className="leading-snug line-clamp-2">{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Bottom Controls & Counter Bar spanning across the entire canvas */}
        <div className="w-full flex items-center justify-between border-t border-white/10 pt-3 sm:pt-4 flex-shrink-0">
          {/* Left: Clean Minimal Label */}
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-red-600" />
            <span className="text-white/80 font-bold">SQUAD ZERO</span>
            <span className="hidden sm:inline text-zinc-600">// 零番離殿</span>
          </div>

          {/* Center: Espada-style Previous & Next Buttons + Progress Dots */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigateOfficer('prev')}
              disabled={activeOfficerIndex === 0}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-white/20 flex items-center justify-center text-white bg-transparent hover:bg-white/10 hover:border-red-500 hover:text-red-400 transition-all cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed shadow-md active:scale-95"
              title="Previous Officer"
            >
              <ArrowLeft className="w-4 h-4 stroke-[2.25]" />
            </button>
            <div className="flex items-center gap-1.5 px-2">
              {MERGED_SQUAD_ZERO.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => selectOfficer(idx)}
                  className={`h-1.5 rounded-full transition-all cursor-pointer ${
                    idx === activeOfficerIndex
                      ? 'w-6 bg-red-600 shadow-[0_0_8px_rgba(220,38,38,0.8)]'
                      : 'w-1.5 bg-white/25 hover:bg-white/60'
                  }`}
                  title={`Officer 0${idx + 1}`}
                />
              ))}
            </div>
            <button
              onClick={() => navigateOfficer('next')}
              disabled={activeOfficerIndex === MERGED_SQUAD_ZERO.length - 1}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-white/20 flex items-center justify-center text-white bg-transparent hover:bg-white/10 hover:border-red-500 hover:text-red-400 transition-all cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed shadow-md active:scale-95"
              title="Next Officer"
            >
              <ArrowRight className="w-4 h-4 stroke-[2.25]" />
            </button>
          </div>

          {/* Right: Step Counter with Twin Offset Square Graphic */}
          <div className="flex items-center gap-3 select-none">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-red-600 rounded-[1px] shadow-[0_0_10px_rgba(220,38,38,0.8)]" />
              <div className="w-3 h-3 bg-red-600 rounded-[1px] -translate-y-1 shadow-[0_0_10px_rgba(220,38,38,0.8)]" />
            </div>
            <span className="font-black font-mono text-xl sm:text-2xl text-white tracking-tight">
              0{activeOfficerIndex + 1} / 0{MERGED_SQUAD_ZERO.length}
            </span>
          </div>
        </div>
      </section>
    </div>
  );
};
