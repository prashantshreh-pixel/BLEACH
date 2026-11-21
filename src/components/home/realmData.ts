export interface RealmStat {
  label: string;
  value: string;
  highlight?: boolean;
}

export interface RealmBarrier {
  kanji: string;
  name: string;
  subtitle: string;
  topColor: string;
  midColor: string;
  bottomColor: string;
  accentHex: string;
  waveStroke: string;
}

export interface BleachRealmLayer {
  id: string;
  layerNumber: string;
  romanNumeral: string;
  tierLabel: string;
  altitudeLabel: string;
  kanji: string;
  kanjiSub: string;
  titleLine1: string;
  titleLine2: string;
  epigraph: string;
  description: string;
  image: string;
  imageAlt: string;
  imageObjectPosition: string;
  alignment: 'left' | 'right' | 'center';
  accentHex: string;
  accentRgb: [number, number, number];
  secondaryRgb: [number, number, number];
  bgBaseHex: string;
  badgeClasses: string;
  accentTextClass: string;
  ctaLabel: string;
  ctaStyle: string;
  destinationSlug: string;
  stats: RealmStat[];
  barrierBelow?: RealmBarrier;
}

export const BLEACH_REALMS: BleachRealmLayer[] = [
  {
    id: 'royal-realm',
    layerNumber: '01',
    romanNumeral: 'I',
    tierLabel: 'HEAVEN • ROYAL REALM',
    altitudeLabel: '+72 BARRIERS',
    kanji: '霊王宮',
    kanjiSub: 'REIŌKYŪ',
    titleLine1: 'SOUL KING PALACE.',
    titleLine2: 'THE ROYAL REALM.',
    epigraph: 'Above seventy-two barriers of silent sky rests the lynchpin of all creation.',
    description:
      'Suspended at the luminous zenith of the Bleach cosmos, the Soul King Palace hovers over the five floating cities of Squad Zero—radiating pure Reishi down through every stratum below.',
    image: '/soul-king-palace.jpg',
    imageAlt: 'Soul King Palace — Royal Realm (霊王宮)',
    imageObjectPosition: 'center 35%',
    alignment: 'left',
    accentHex: '#fbbf24',
    accentRgb: [125, 211, 252],
    secondaryRgb: [253, 230, 138],
    bgBaseHex: '#0b2540',
    badgeClasses:
      'border-amber-300/45 bg-sky-950/55 text-amber-200 shadow-[0_0_24px_rgba(251,191,36,0.22)]',
    accentTextClass: 'text-amber-300',
    ctaLabel: 'ENTER ROYAL REALM ARCHIVE',
    ctaStyle:
      'bg-amber-500/20 hover:bg-amber-400/30 border-amber-300/60 hover:border-amber-200 text-amber-100 shadow-[0_0_32px_rgba(251,191,36,0.3)]',
    destinationSlug: 'soul-king-palace',
    stats: [
      { label: 'Cosmic Anchor', value: 'SOUL KING LYNCHPIN', highlight: true },
      { label: 'Royal Guard', value: 'SQUAD ZERO (5 CITIES)' },
      { label: 'Sky Seal', value: '72 SPIRIT BARRIERS' },
      { label: 'Key Passage', value: 'ŌKEN ROYAL KEY' },
    ],
    barrierBelow: {
      kanji: '七十二の障壁',
      name: 'SEVENTY-TWO BARRIERS • TENCHŪREN FALL',
      subtitle: 'Reishi cascades down from Heaven into the skies of Seireitei',
      topColor: 'rgba(14, 65, 118, 0)',
      midColor: 'rgba(28, 92, 152, 0.72)',
      bottomColor: 'rgba(23, 76, 134, 0.92)',
      accentHex: '#7dd3fc',
      waveStroke: 'rgba(253, 230, 138, 0.45)',
    },
  },
  {
    id: 'soul-society',
    layerNumber: '02',
    romanNumeral: 'II',
    tierLabel: 'SPIRITUAL PLANE • SEIREITEI',
    altitudeLabel: 'SEIREITEI',
    kanji: '尸魂界',
    kanjiSub: 'SŌRU SOSAETI',
    titleLine1: 'SOUL SOCIETY.',
    titleLine2: 'SEIREITEI & RUKONGAI.',
    epigraph: 'Pure Reishi flows down into white fortress walls where thirteen divisions guard the cycle of souls.',
    description:
      'The spiritual heart of the three worlds. Enclosed behind Sekiseki stone ramparts beneath Sōkyoku Hill stands the noble fortress of Seireitei, ringed by the 80 sprawling outer districts of Rukongai.',
    image: '/soul-society.jpg',
    imageAlt: 'Soul Society — Seireitei & Rukongai (瀞霊廷 & 流魂街)',
    imageObjectPosition: 'center 58%',
    alignment: 'left',
    accentHex: '#38bdf8',
    accentRgb: [56, 189, 248],
    secondaryRgb: [224, 242, 254],
    bgBaseHex: '#0d2238',
    badgeClasses:
      'border-cyan-300/45 bg-slate-950/60 text-cyan-200 shadow-[0_0_24px_rgba(56,189,248,0.22)]',
    accentTextClass: 'text-cyan-300',
    ctaLabel: 'EXPLORE TYBW CHRONOLOGY & GOTEI 13',
    ctaStyle:
      'bg-cyan-500/20 hover:bg-cyan-400/30 border-cyan-300/60 hover:border-cyan-200 text-cyan-100 shadow-[0_0_32px_rgba(34,211,238,0.28)]',
    destinationSlug: 'bleach-tybw',
    stats: [
      { label: 'Gotei 13 HQ', value: '13 SQUAD BARRACKS', highlight: true },
      { label: 'Outer Ring', value: '80 RUKONGAI SECTORS' },
      { label: 'Fortress Wall', value: 'SEKISEKI BARRIER' },
      { label: 'High Court', value: 'CENTRAL 46 & SŌKYOKU' },
    ],
    barrierBelow: {
      kanji: '断界・拘流',
      name: 'DANGAI PRECIPICE • KŌRYŪ CURRENT',
      subtitle: 'Crossing the flowing spiritual stream into the mortal horizon',
      topColor: 'rgba(13, 34, 56, 0)',
      midColor: 'rgba(19, 44, 74, 0.78)',
      bottomColor: 'rgba(17, 29, 49, 0.92)',
      accentHex: '#38bdf8',
      waveStroke: 'rgba(125, 211, 252, 0.45)',
    },
  },
  {
    id: 'world-of-the-living',
    layerNumber: '03',
    romanNumeral: 'III',
    tierLabel: 'MORTAL PLANE • KARAKURA',
    altitudeLabel: '0M MORTAL',
    kanji: '現世',
    kanjiSub: 'GENSEI',
    titleLine1: 'WORLD OF THE LIVING.',
    titleLine2: 'KARAKURA TOWN.',
    epigraph: 'Where the rain falls on mortal streets and the Jūreichi pulses beneath ordinary skies.',
    description:
      'The physical realm where living souls dwell. Anchored atop the spirit-dense Jūreichi focal zone, Karakura Town stands at the crossroads of Shinigami, Quincy, and Hollow destinies.',
    image: '/human-world.jpg',
    imageAlt: 'World of the Living — Karakura Town (現世・空座町)',
    imageObjectPosition: 'center 42%',
    alignment: 'right',
    accentHex: '#f59e0b',
    accentRgb: [147, 197, 253],
    secondaryRgb: [251, 191, 36],
    bgBaseHex: '#111827',
    badgeClasses:
      'border-amber-400/45 bg-slate-950/65 text-amber-200 shadow-[0_0_24px_rgba(245,158,11,0.22)]',
    accentTextClass: 'text-amber-300',
    ctaLabel: 'INSPECT KARAKURA & HYBRID LINEAGE',
    ctaStyle:
      'bg-amber-500/20 hover:bg-amber-400/30 border-amber-400/60 hover:border-amber-200 text-amber-100 shadow-[0_0_32px_rgba(245,158,11,0.28)]',
    destinationSlug: 'bleach-tybw',
    stats: [
      { label: 'Spirit Focal Zone', value: 'JŪREICHI NEXUS', highlight: true },
      { label: 'Hidden Outpost', value: 'URAHARA SHOTEN' },
      { label: 'Protector', value: 'ICHIGO KUROSAKI' },
      { label: 'Dimensional Door', value: 'SENKAIMON GATE' },
    ],
    barrierBelow: {
      kanji: '黒腔',
      name: 'GARGANTA RIFT • DARK CAVITY',
      subtitle: 'Dusk fractures into eternal lunar night and drifting quartz dust',
      topColor: 'rgba(17, 24, 39, 0)',
      midColor: 'rgba(6, 15, 20, 0.84)',
      bottomColor: 'rgba(2, 6, 9, 0.96)',
      accentHex: '#2dd4bf',
      waveStroke: 'rgba(45, 212, 191, 0.45)',
    },
  },
  {
    id: 'hueco-mundo',
    layerNumber: '04',
    romanNumeral: 'IV',
    tierLabel: 'HOLLOW REALM • LAS NOCHES',
    altitudeLabel: 'VOID RIFT',
    kanji: '虚圏',
    kanjiSub: 'WEKO MUNDO',
    titleLine1: 'HUECO MUNDO.',
    titleLine2: 'LAS NOCHES & DESERT.',
    epigraph: 'Beneath an unchanging crescent moon, hollow sands drift endlessly into the void.',
    description:
      'A desolate dimension of perpetual night and white quartz dunes suspended between worlds. At its heart rises Las Noches—the alabaster fortress commanded by the ten Espada.',
    image: '/hueco-mundo.jpg',
    imageAlt: 'Hueco Mundo — Las Noches & White Desert (虚圏・虚夜宮)',
    imageObjectPosition: 'center 48%',
    alignment: 'left',
    accentHex: '#2dd4bf',
    accentRgb: [45, 212, 191],
    secondaryRgb: [153, 246, 228],
    bgBaseHex: '#020709',
    badgeClasses:
      'border-teal-400/45 bg-teal-950/60 text-teal-200 shadow-[0_0_24px_rgba(45,212,191,0.25)]',
    accentTextClass: 'text-teal-300',
    ctaLabel: 'ENTER HUECO MUNDO & 10 ESPADA',
    ctaStyle:
      'bg-teal-500/20 hover:bg-teal-400/30 border-teal-400/60 hover:border-teal-200 text-teal-100 shadow-[0_0_32px_rgba(45,212,191,0.3)]',
    destinationSlug: 'hueco-mundo',
    stats: [
      { label: 'Dominant Citadel', value: 'LAS NOCHES', highlight: true },
      { label: 'Supreme Elite', value: 'THE 10 ESPADA' },
      { label: 'Terrain', value: 'QUARTZ REISHI SAND' },
      { label: 'Subterranean', value: 'MENOS FOREST' },
    ],
    barrierBelow: {
      kanji: '地獄蝶・境界',
      name: 'ABYSSAL SEAL • KONSO REISAI DESCENT',
      subtitle: 'Spirits too dense to dissolve sink past the bedrock of existence',
      topColor: 'rgba(2, 7, 9, 0)',
      midColor: 'rgba(24, 5, 8, 0.85)',
      bottomColor: 'rgba(18, 3, 5, 0.96)',
      accentHex: '#ef4444',
      waveStroke: 'rgba(239, 68, 68, 0.52)',
    },
  },
  {
    id: 'hell',
    layerNumber: '05',
    romanNumeral: 'V',
    tierLabel: 'PRIMORDIAL ABYSS • JIGOKU',
    altitudeLabel: 'DEPTH -∞',
    kanji: '地獄',
    kanjiSub: 'JIGOKU',
    titleLine1: 'HELL (JIGOKU).',
    titleLine2: "THE SINNERS' ABYSS.",
    epigraph: 'Older than the three worlds—where spirits too dense to return to Reishi sink beyond the chained gates.',
    description:
      'The bottommost pit predating the division of reality, sealed shut by the monumental skeletal Gates of Hell. Here reside the chained Togabito and fallen Grade 3+ Reiatsu Captains.',
    image: '/hell-jigoku.jpg',
    imageAlt: "Hell / Jigoku — The Gates of Hell (地獄・地獄の門)",
    imageObjectPosition: 'center center',
    alignment: 'center',
    accentHex: '#ef4444',
    accentRgb: [239, 68, 68],
    secondaryRgb: [249, 115, 22],
    bgBaseHex: '#0c0203',
    badgeClasses:
      'border-red-500/55 bg-red-950/75 text-red-200 shadow-[0_0_26px_rgba(239,68,68,0.35)]',
    accentTextClass: 'text-red-400',
    ctaLabel: 'UNSEAL THE HELL REALM CODEX',
    ctaStyle:
      'bg-red-600/30 hover:bg-red-600/45 border-red-500/75 hover:border-red-300 text-white shadow-[0_0_38px_rgba(239,68,68,0.5)]',
    destinationSlug: 'hell',
    stats: [
      { label: 'Primordial Seal', value: 'THE GATES OF HELL', highlight: true },
      { label: 'Chained Inmates', value: 'TOGABITO SINNERS' },
      { label: 'Abyss Guardians', value: 'KUSHANĀDA' },
      { label: 'Reiatsu Law', value: 'GRADE 3+ CAPTAINS' },
    ],
  },
];
