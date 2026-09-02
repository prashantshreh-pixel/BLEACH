import React, { useState, useLayoutEffect, useCallback } from 'react';
import { Flame, Info, Compass, Layers, Sparkles, ChevronRight, ChevronLeft, Quote } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HellRealmPageProps {
  onBack: () => void;
}

// -----------------------------------------------------------------------------
// STATIC DATA & CONSTANTS
// -----------------------------------------------------------------------------

const HELL_CHARACTERS = [
  {
    id: 'ukitake',
    name: 'Jūshirō Ukitake',
    kanji: '浮竹 十郎太夫',
    role: 'Fallen Captain of Squad 13',
    zanpakuto: 'Sōgyo no Kotowari (双魚理)',
    status: 'Sanctified in Hell',
    reiatsuGrade: 'Grade 3 Reiatsu',
    avatarImg: '/hell/ukitake.jpg',
    fullImg: '/hell/ukitake.jpg',
    leftImg: '/hell/ukitake-left.jpg?v=5',
    description:
      'The former beloved Captain of Squad 13 who sacrificed his lungs to Mimihagi (the Right Hand of the Soul King). Following his death, his Grade 3 spiritual density could not be absorbed by Soul Society, resulting in his soul being cast into Hell during the Reishisai festival.',
    abilities: [
      'Energy Reflection & Redirection',
      'Kamikake Divine Sacrifice',
      'Hell Reishi Trident Manifestation',
    ],
    quote: 'There are two types of fights: the fight to protect life, and the fight to protect pride.',
    auraColor: 'rgba(239,35,60,0.5)',
    accentColor: 'text-red-400',
    badgeBg: 'bg-red-950/90 border-red-500/60 text-red-300',
  },
  {
    id: 'unohana',
    name: 'Retsu (Yachiru) Unohana',
    kanji: '卯ノ花 烈 / 八千流',
    role: 'First Kenpachi & Former Squad 4 Captain',
    zanpakuto: 'Minazuki (肉雫偞)',
    status: 'Fallen Captain in Hell',
    reiatsuGrade: 'Grade 3 Reiatsu',
    avatarImg: '/hell/unohana-left.jpg',
    fullImg: '/hell/unohana.jpg',
    leftImg: '/hell/unohana-left.jpg',
    description:
      'The diabolical First Kenpachi and founding master of the sword who served as Squad 4 Captain. Slain by Zaraki Kenpachi in Muken so he could unlock his true power, her dense soul was subsequently cast into Hell during the Reishisai ritual.',
    abilities: [
      'Bankai: Minazuki (Acid Blood Blade)',
      'Kaidō Healing Mastery',
      '1000 Sword Styles Mastery',
    ],
    quote: 'There is only one Kenpachi in any given era. That is the immutable law of the sword.',
    auraColor: 'rgba(225,29,72,0.4)',
    accentColor: 'text-rose-400',
    badgeBg: 'bg-rose-950/90 border-rose-500/50 text-rose-300',
  },
  {
    id: 'yamamoto',
    name: 'Genryūsai Shigekuni Yamamoto',
    kanji: '山本元柳斎 重國',
    role: 'Founder & Captain-Commander of Gotei 13',
    zanpakuto: 'Zanka no Tachi (残火の太刀)',
    status: 'Fallen Commander',
    reiatsuGrade: 'Grade 1 Reiatsu (Peak)',
    avatarImg: '/hell/yamamoto-left.jpg',
    fullImg: '/hell/yamamoto.jpg',
    leftImg: '/hell/yamamoto-left.jpg',
    description:
      'The 2,000-year patriarch of Soul Society whose Bankai incinerated anything it touched to ash at 15,000,000 degrees. Slain by Yhwach in the Quincy War, his immensity of spiritual power was cast into the Hell pit.',
    abilities: [
      'Zanka no Tachi East, West, South, North',
      'Sun God Heat Armor (15M Deg)',
      '10 Trillion Dead Corpse Summon',
    ],
    quote:
      'Why do you think I have served as Captain-Commander for a thousand years? Because no Soul Reaper stronger than me has been born in all that time.',
    auraColor: 'rgba(245,158,11,0.4)',
    accentColor: 'text-amber-400',
    badgeBg: 'bg-amber-950/90 border-amber-500/50 text-amber-300',
  },
  {
    id: 'szayelaporro',
    name: 'Szayelaporro Granz',
    kanji: 'ザエルアポロ・グランツ',
    role: 'Jailer of Hell / Former 8th Espada',
    zanpakuto: 'La Fornicarás (邪淫妃)',
    status: 'Hell Inmate / Jailer',
    reiatsuGrade: 'Arrancar Elite',
    avatarImg: '/hell/szayel-left.jpg?v=9',
    fullImg: '/hell/szayel.jpg?v=9',
    leftImg: '/hell/szayel-left.jpg?v=9',
    description:
      'The mad scientist Arrancar killed by Mayuri Kurotsuchi. Transformed within the depths of Jigoku into a chained Jailer of Hell who escaped through a breach during the Reishisai ritual to warn Soul Society of the shifting balance of power.',
    abilities: ['Gabriel Soul Rebirth', 'Hell Chain Projection', 'Reishi Corruption Spray'],
    quote:
      'The balance between worlds has crumbled. With Yhwach and Aizen gone, the gates of Hell can no longer be held shut from the outside.',
    auraColor: 'rgba(168,85,247,0.4)',
    accentColor: 'text-purple-400',
    badgeBg: 'bg-purple-950/90 border-purple-500/50 text-purple-300',
  },
  {
    id: 'shuren',
    name: 'Shuren',
    kanji: '朱蓮',
    role: 'Togabito Outcast Leader',
    zanpakuto: 'Hell Flame Manipulation',
    status: 'Togabito Outcast',
    reiatsuGrade: 'Togabito Commander',
    avatarImg: '/hell/shuren-left.jpg',
    fullImg: '/hell/shuren.jpg',
    leftImg: '/hell/shuren-left.jpg',
    description:
      'The cunning leader of the Togabito who seeks to break the chains of Hell by exploiting Ichigo Kurosaki\'s Hollow powers to shatter the Hell Gates.',
    abilities: ['Hellfire Manipulation', 'Flame Barrier', 'Soul Chain Absorption'],
    quote: 'We will break these chains and bring Hell to the upper worlds.',
    auraColor: 'rgba(249,115,22,0.4)',
    accentColor: 'text-orange-400',
    badgeBg: 'bg-orange-950/90 border-orange-500/50 text-orange-300',
  },
  {
    id: 'kokuto',
    name: 'Kokutō',
    kanji: '黒刀',
    role: 'Chained Sinner Outcast',
    zanpakuto: 'Black Hell Blade',
    status: 'Chained Sinner',
    reiatsuGrade: 'Togabito Elite',
    avatarImg: '/hell/kokuto-left.jpg',
    fullImg: null,
    leftImg: '/hell/kokuto-left.jpg',
    description:
      'A vengeful sinner condemned to Hell after murdering his sister\'s killers. He wears the unbreakable chains of Jigoku and wields a jagged dark blade.',
    abilities: ['Black Chain Telekinesis', 'Hell Reishi Speed', 'Unbreakable Regeneration'],
    quote: 'Hell is not a place of redemption. It is a furnace of eternal hatred.',
    auraColor: 'rgba(161,161,170,0.4)',
    accentColor: 'text-zinc-300',
    badgeBg: 'bg-zinc-800/90 border-zinc-600/50 text-zinc-200',
  },
];

const HELL_LAYERS = [
  {
    level: 1,
    kanji: '第一階層, Dai Ichi Kaisō',
    name: 'First Level: Floating Reishi Blocks',
    description: (
      <>
        The First Level of Hell features a multitude of white blocks floating in mid-air among a
        series of blue pathways. It is on this level that many of the dejected Togabito reside,
        having given up on resistance. Renji Abarai commented that the First Level of Hell has
        Reiatsu so strangled that people with normal Reiatsu would go insane. This level is where
        the majority of Kushanāda patrol frequently, in order to prey upon the weaker Togabito. At
        the edge of the blue pathway is a gaping abyss, through which the next level can be
        accessed.
      </>
    ),
    hazard: 'Strangled Reiatsu & Kushanāda Patrols',
  },
  {
    level: 2,
    kanji: '第二階層, Dai Nii Kaisō',
    name: 'Second Level: Sea of Water Lilies',
    description: (
      <>
        The Second Level of Hell is mostly composed of a large body of water. Within this large
        expanse of water, are a multitude of stone water lilies, in the center of which lies a
        pierced skeleton of a Kushanāda. It is on this level that Ichigo Kurosaki and his friends
        initially battle with the Togabito in Hell. The body of water can also be navigated
        through, and ultimately leads to the third level.
      </>
    ),
    hazard: 'Spirit-Dissolving Water & Pierced Kushanāda',
  },
  {
    level: 3,
    kanji: '第三階層, Dai San Kaisō',
    name: 'Third Level: Volcanic Lava & Shrines',
    description: (
      <>
        The Third Level of Hell is a rocky, barren landscape with various craters in which yellow
        lava forms. It is here that Szayelaporro Granz and Aaroniero Arruruerie battled with Shuren
        and his comrades. Ichigo and Kokutō navigate through this area to reach Shuren's base at
        the lowermost level of Hell. Taikon, Gunjō, and Garogai are all defeated on this level. After
        the rocky landscape is cleared, there is a narrow passageway lit with the dim lighting from
        various shrines.
      </>
    ),
    hazard: 'Yellow Lava Craters & Togabito Outpost',
  },
  {
    level: 4,
    kanji: '第四階層, Dai Shi Kaisō',
    name: 'Fourth Level: Lava Waterfall & Bone Desert',
    description: (
      <>
        The Fourth Level of Hell starts off with a hilly area in which there are a multitude of small
        domes jutting out of the ground. From the opening in the face of a cliff, a thundering
        waterfall with the yellow lava rains down around it. The sand which emits trace amounts of
        Reiatsu is comprised of the crushed bones of millions of Togabito, who turned to ash due to
        the hopelessness of their predicament. This section then crosses over into a giant skeleton
        resembling the ones which make up the Gates of Hell. This overlooks a pit of lava, which
        has the ability to resurrect killed Togabito. Around the skeletal structure, is a series of
        pillars and a set of stone fingers.
      </>
    ),
    hazard: 'Lava Waterfall, Ash Sand & Togabito Resurrection Pit',
  },
  {
    level: 5,
    kanji: '最奥部, Saiōbu',
    name: 'Lowermost Level: The Primordial Nether Pit',
    description: (
      <>
        The Lowermost Level of Hell is composed of a black landscape, with many irregular columns
        covered in veins of lava jutting out from the ground. The Kushanāda are capable of
        materializing from within these lava columns. This level was where Kokutō was imprisoned in
        Hell, and also where he subsequently awoke after witnessing Ichigo's Hollowfication.
        Lightning strikes are a frequent occurrence here. There are also withered trees composed of
        bones littered across the landscape, from which Kokutō hangs the bodies of Lieutenant Renji
        Abarai and Uryū Ishida for Ichigo to see.
      </>
    ),
    hazard: 'Lava Columns, Skeletal Trees & Unending Lightning',
  },
];

// Helper functions for character stage artwork classes
const getRightImgPosition = (id: string): string => {
  switch (id) {
    case 'ukitake':
      return 'object-[75%_20%] sm:object-right-top scale-105';
    case 'unohana':
      return 'object-[20%_20%] scale-105';
    case 'shuren':
      return 'object-[15%_20%] scale-105';
    case 'szayelaporro':
      return 'object-[75%_15%] scale-105';
    case 'yamamoto':
      return 'object-contain sm:object-right-top object-center scale-105';
    default:
      return 'object-[50%_20%] sm:object-right-top scale-105';
  }
};

const getLeftImgPosition = (id: string): string => {
  switch (id) {
    case 'shuren':
      return 'object-cover object-top translate-y-0 translate-x-0';
    case 'ukitake':
      return 'object-cover object-bottom translate-y-12';
    case 'kokuto':
      return 'object-cover object-bottom translate-y-12 translate-x-2';
    case 'szayelaporro':
      return 'object-cover object-left-top translate-y-0 translate-x-0';
    default:
      return 'object-cover object-top translate-y-0';
  }
};

// -----------------------------------------------------------------------------
// MAIN COMPONENT
// -----------------------------------------------------------------------------

export const HellRealmPage: React.FC<HellRealmPageProps> = ({ onBack }) => {
  const [selectedLayer, setSelectedLayer] = useState<number>(1);
  const [activeCharIndex, setActiveCharIndex] = useState<number>(0);

  // Guarantee page starts at top of window synchronously BEFORE browser paint
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, []);

  const activeChar = HELL_CHARACTERS[activeCharIndex];

  const handleNextChar = useCallback(() => {
    setActiveCharIndex((prev) => (prev + 1) % HELL_CHARACTERS.length);
  }, []);

  const handlePrevChar = useCallback(() => {
    setActiveCharIndex((prev) => (prev - 1 + HELL_CHARACTERS.length) % HELL_CHARACTERS.length);
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 text-white selection:bg-red-600 selection:text-white font-inter pb-24">
      {/* 1. FULL-WIDTH 100VH GENSHIN CHARACTER STAGE */}
      <section className="relative w-full h-screen min-h-[700px] overflow-hidden bg-zinc-950 flex flex-col justify-between p-6 sm:p-10 lg:p-14 select-none">
        {/* FULL STAGE CHARACTER POP-OUT ARTWORK (RIGHT SIDE) */}
        <AnimatePresence mode="wait">
          {activeChar.fullImg ? (
            <motion.div
              key={`full-stage-${activeChar.id}`}
              initial={{ opacity: 0, x: 90, scale: 1.06 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -70, scale: 0.96 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="absolute right-0 top-0 bottom-0 w-full sm:w-[62%] h-full z-0 pointer-events-none overflow-hidden"
            >
              <img
                src={activeChar.fullImg}
                alt={activeChar.name}
                className={`w-full h-full object-cover ${getRightImgPosition(activeChar.id)}`}
              />
              {/* Ultra-Clean Gradient Vignetting */}
              <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/85 to-transparent z-10 w-full sm:w-[50%]" />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-zinc-950/50 z-10" />
              <div
                className="absolute inset-0 z-10 opacity-35 pointer-events-none"
                style={{
                  background: `radial-gradient(circle at 65% 40%, ${activeChar.auraColor} 0%, transparent 65%)`,
                }}
              />
            </motion.div>
          ) : (
            <div
              className="absolute inset-0 pointer-events-none transition-all duration-700 opacity-50 z-0"
              style={{
                background: `radial-gradient(circle at 65% 40%, ${activeChar.auraColor} 0%, transparent 65%)`,
              }}
            />
          )}
        </AnimatePresence>

        {/* LEFT SIDE ARTWORK */}
        <AnimatePresence mode="wait">
          {activeChar.leftImg && (
            <motion.div
              key={`left-stage-${activeChar.id}`}
              initial={{ opacity: 0, x: -60 }}
              animate={{ opacity: 0.85, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="absolute left-0 bottom-0 top-0 h-full z-0 w-auto max-w-[380px] pointer-events-none overflow-hidden hidden md:block"
            >
              <img
                src={activeChar.leftImg}
                alt={activeChar.name}
                className={`h-full w-full filter contrast-125 brightness-95 ${getLeftImgPosition(activeChar.id)}`}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-zinc-950/75 to-zinc-950 z-10" />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-zinc-950/80 z-10" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Japanese Kanji Background Stamp */}
        <div className="absolute right-8 top-8 text-white/[0.04] font-podium text-8xl sm:text-9xl font-black uppercase pointer-events-none select-none tracking-tighter z-10">
          {activeChar.kanji}
        </div>

        {/* TOP AREA INSIDE STAGE: Header Title */}
        <div className="relative z-30 flex items-center justify-between border-b border-white/10 pb-3 max-w-7xl w-full mx-auto shrink-0">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-red-500 animate-pulse" />
            <h2 className="font-podium text-xs sm:text-sm uppercase tracking-[0.25em] text-white/70 font-semibold">
              RESIDENTS OF THE NETHER REALM // 地獄・咎人
            </h2>
          </div>
        </div>

        {/* MIDDLE AREA INSIDE STAGE: Character Info */}
        <div className="relative z-20 max-w-7xl w-full mx-auto flex-1 flex flex-col justify-center py-6 min-h-0 overflow-hidden">
          <div className="max-h-[calc(100vh-250px)] overflow-y-auto scrollbar-none pr-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeChar.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="space-y-4 max-w-xl"
              >
                {/* Character Name & Role */}
                <div className="space-y-1">
                  <div className="text-xs font-inter text-red-400 uppercase tracking-[0.3em] font-semibold">
                    {activeChar.role}
                  </div>
                  <h3 className="font-podium text-4xl sm:text-6xl uppercase tracking-tight text-white leading-none drop-shadow-[0_4px_25px_rgba(0,0,0,0.95)]">
                    {activeChar.name}
                  </h3>
                  <div className="text-xs sm:text-sm font-inter text-white/60 italic tracking-wider">
                    {activeChar.kanji}
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm font-inter text-white/95 leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] max-w-lg">
                  {activeChar.description}
                </p>

                {/* Quote */}
                <div className="border-l-2 border-red-500 pl-4 py-1 italic text-xs font-inter text-white/90 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                  <Quote className="w-4 h-4 text-red-500 mb-1" />
                  <p>"{activeChar.quote}"</p>
                </div>

                {/* Zanpakutō & Abilities */}
                <div className="space-y-1.5 pt-2">
                  <div className="text-xs font-inter uppercase text-white/60 tracking-widest">
                    Zanpakutō:{' '}
                    <span className="text-white font-podium font-bold text-sm tracking-wide">
                      {activeChar.zanpakuto}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs font-inter text-white/90">
                    {activeChar.abilities.map((ability, idx) => (
                      <span key={idx} className="flex items-center gap-1.5">
                        <span className="text-red-500 font-bold">⚡</span>
                        <span>{ability}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* BOTTOM AREA INSIDE STAGE: Avatar Selection Dock */}
        <div className="relative z-30 max-w-7xl w-full mx-auto flex items-center justify-between gap-4 pt-3 pb-3 px-1 border-t border-white/10 shrink-0 mt-auto overflow-visible">
          {/* Avatar Icons Dock */}
          <div className="flex items-center gap-3 overflow-x-auto scrollbar-none py-1.5 px-1">
            {HELL_CHARACTERS.map((char, idx) => {
              const isActive = idx === activeCharIndex;
              return (
                <button
                  key={char.id}
                  onClick={() => setActiveCharIndex(idx)}
                  className={`group relative flex-shrink-0 p-1 rounded-full border transition-all duration-300 cursor-pointer flex items-center gap-3 ${
                    isActive
                      ? 'bg-red-950/90 border-red-500 shadow-[0_0_25px_rgba(239,35,60,0.7)] scale-105 pl-1.5 pr-4'
                      : 'bg-black/70 border-white/20 hover:border-red-500/50 hover:bg-zinc-900/80 px-1.5'
                  }`}
                >
                  {char.avatarImg ? (
                    <img
                      src={char.avatarImg}
                      alt={char.name}
                      className={`w-11 h-11 rounded-full object-cover border-2 transition-all ${
                        isActive
                          ? 'border-red-400 shadow-lg scale-105'
                          : 'border-white/30 group-hover:border-red-400/70'
                      }`}
                    />
                  ) : (
                    <div
                      className={`w-11 h-11 rounded-full flex items-center justify-center font-podium font-bold text-sm border transition-colors ${
                        isActive
                          ? 'bg-red-900 text-white border-red-400'
                          : 'bg-zinc-800 text-white/70 border-white/20 group-hover:border-red-400/50 group-hover:text-white'
                      }`}
                    >
                      {char.name[0]}
                    </div>
                  )}

                  {isActive && (
                    <span className="font-podium text-xs uppercase tracking-wider text-white pr-2 whitespace-nowrap">
                      {char.name.split(' ')[0]}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Carousel Arrows */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handlePrevChar}
              className="p-2.5 rounded-full border border-white/20 bg-black/70 hover:bg-red-950 hover:border-red-500 text-white transition-all cursor-pointer shadow-lg"
              title="Previous Character"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-xs font-inter text-white/70 tracking-widest uppercase px-2 font-semibold">
              {activeCharIndex + 1} / {HELL_CHARACTERS.length}
            </span>
            <button
              onClick={handleNextChar}
              className="p-2.5 rounded-full border border-white/20 bg-black/70 hover:bg-red-950 hover:border-red-500 text-white transition-all cursor-pointer shadow-lg"
              title="Next Character"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* LOWER SECTION: THE METAPHYSICS & THE 5 LEVELS OF HELL */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-16 space-y-20">
        {/* THE METAPHYSICS */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 border-b border-red-900/60 pb-3">
            <Info className="w-5 h-5 text-red-500" />
            <h2 className="font-podium text-2xl sm:text-3xl uppercase tracking-wide text-white">
              THE METAPHYSICS: WHY CAPTAINS GO TO HELL
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border border-red-900/40 bg-zinc-900 p-6 space-y-3 rounded-2xl hover:border-red-500/60 transition-colors">
              <div className="text-red-500 font-podium text-3xl font-bold">01.</div>
              <h3 className="font-podium text-lg uppercase text-white">Grade 3 Reiatsu Density</h3>
              <p className="text-xs text-white/80 leading-relaxed font-inter">
                Soul Reapers possess spiritual energy graded from 1 to 20. Captain-class Soul Reapers
                possess Grade 3 or higher Reiatsu—a concentration so dense that their spirit bodies
                cannot naturally decay or return to Soul Society's soil.
              </p>
            </div>

            <div className="border border-red-900/40 bg-zinc-900 p-6 space-y-3 rounded-2xl hover:border-red-500/60 transition-colors">
              <div className="text-red-500 font-podium text-3xl font-bold">02.</div>
              <h3 className="font-podium text-lg uppercase text-white">
                The Reishisai Ritual (Soul Burial)
              </h3>
              <p className="text-xs text-white/80 leading-relaxed font-inter">
                Twelve years after a Captain's death, Gotei 13 performs the Reishisai ritual (slaying a
                Hollow in front of the grave). Ostensibly held to return the Captain's soul to Soul
                Society, it is secretly a ceremony to cast their dense soul down into Hell.
              </p>
            </div>

            <div className="border border-red-900/40 bg-zinc-900 p-6 space-y-3 rounded-2xl hover:border-red-500/60 transition-colors">
              <div className="text-red-500 font-podium text-3xl font-bold">03.</div>
              <h3 className="font-podium text-lg uppercase text-white">
                Collapse of the Spiritual Balance
              </h3>
              <p className="text-xs text-white/80 leading-relaxed font-inter">
                With the deaths of Yhwach, Aizen's imprisonment, and Captains like Yamamoto, Unohana,
                and Ukitake cast into Hell, the pressure holding Hell shut from the outside has broken,
                unleashing Hell's gatekeepers onto the world.
              </p>
            </div>
          </div>
        </section>

        {/* THE 5 LEVELS OF HELL */}
        <section className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-red-900/60 pb-4">
            <div>
              <div className="font-inter text-xs tracking-[0.3em] uppercase text-red-500 font-semibold flex items-center gap-2">
                <Layers className="w-4 h-4 text-red-500" />
                <span>CANONICAL STRATA BREAKDOWN</span>
              </div>
              <h2 className="font-podium text-3xl sm:text-4xl uppercase tracking-tight text-white mt-1">
                THE 5 LEVELS OF HELL (地獄の階層)
              </h2>
            </div>
            <span className="text-xs font-inter text-white/60 tracking-widest uppercase">
              5 GEOGRAPHICAL STRATA
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="space-y-3">
              {HELL_LAYERS.map((layer) => (
                <button
                  key={layer.level}
                  onClick={() => setSelectedLayer(layer.level)}
                  className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-center ${
                    selectedLayer === layer.level
                      ? 'bg-red-950 border-red-500 text-white shadow-[0_0_20px_rgba(239,35,60,0.4)] font-bold'
                      : 'bg-zinc-900 border-white/10 text-white/70 hover:text-white hover:border-white/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-podium text-sm uppercase text-red-400">
                      Level {layer.level}
                    </span>
                    <span className="text-[10px] font-inter text-white/50 italic">
                      {layer.kanji}
                    </span>
                  </div>
                  <span className="text-xs font-inter font-semibold text-white/90 mt-1">
                    {layer.name.split(':')[1]}
                  </span>
                </button>
              ))}
            </div>

            {/* Selected Layer Display */}
            <div className="lg:col-span-2 border border-red-900/80 bg-gradient-to-b from-red-950/40 via-zinc-900 to-zinc-950 p-8 rounded-2xl space-y-6 flex flex-col justify-between shadow-[0_0_40px_rgba(0,0,0,0.8)]">
              {(() => {
                const current = HELL_LAYERS.find((l) => l.level === selectedLayer)!;
                return (
                  <>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between border-b border-white/10 pb-3">
                        <div className="inline-flex items-center gap-2 text-xs font-inter uppercase tracking-widest text-red-400">
                          <Compass className="w-4 h-4 text-red-500" />
                          <span>NETHER STRATA // LEVEL {current.level}</span>
                        </div>
                        <span className="text-xs font-inter text-white/50 italic">
                          {current.kanji}
                        </span>
                      </div>

                      <h3 className="font-podium text-3xl sm:text-4xl uppercase text-white leading-none">
                        {current.name}
                      </h3>

                      <div className="text-sm font-inter text-white/90 leading-relaxed space-y-2">
                        {current.description}
                      </div>
                    </div>

                    <div className="pt-6 border-t border-white/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <span className="text-xs font-inter uppercase text-white/60 tracking-widest">
                        Primary Environmental Hazard
                      </span>
                      <span className="text-xs font-podium font-bold text-red-400 uppercase tracking-wide border border-red-500/40 px-3.5 py-1.5 rounded bg-red-950/90 shadow-[0_0_15px_rgba(239,35,60,0.3)]">
                        {current.hazard}
                      </span>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-red-900/60 py-8 text-center text-xs font-inter tracking-[0.3em] text-white/50 uppercase bg-black">
        B L E A C H • HELL NO JUKU ARCHIVE • ALL RIGHTS RESERVED
      </footer>
    </div>
  );
};
