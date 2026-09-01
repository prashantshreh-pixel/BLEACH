export type CanonType = 'canon' | 'filler' | 'ova' | 'movie' | 'what_if';

export type EventType = 
  | 'arc'
  | 'major_event'
  | 'battle'
  | 'character_intro'
  | 'death'
  | 'power_up'
  | 'timeskip'
  | 'alternate_branch'
  | 'revelation';

export type RelationshipType = 
  | 'ally'
  | 'enemy'
  | 'mentor_student'
  | 'rival'
  | 'family'
  | 'romantic'
  | 'subordinate'
  | 'incarnation'
  | 'creator_creation';

export interface TimelineEvent {
  id: string;
  title: string;
  arcId: string;
  arcName: string;
  episodeStart?: number;
  episodeEnd?: number;
  type: EventType;
  canonType: CanonType;
  dateInUniverse: string;
  summary: string;
  impactScore: number; // 1-10
  keyCharacters: string[]; // character IDs or names
  consequences: string[];
  quote?: string;
  quoteSpeaker?: string;
  mediaUrl?: string;
  tags: string[];
  branchId?: string; // e.g. 'main', 'alpha', 'beta', 'ova-1'
  position?: { x: number; y: number };
}

export interface TimelineEdgeData {
  id: string;
  source: string;
  target: string;
  label?: string;
  type: 'chronological' | 'branch' | 'merge' | 'time_leap' | 'flashback' | 'parallel';
  animated?: boolean;
}

export interface Arc {
  id: string;
  title: string;
  episodes: string;
  season?: number;
  description: string;
  color: string;
  canonType: CanonType;
  startYearInUniverse?: string;
  endYearInUniverse?: string;
  eventCount: number;
}

export interface Character {
  id: string;
  name: string;
  japaneseName?: string;
  role: 'protagonist' | 'deuteragonist' | 'antagonist' | 'supporting' | 'mentor';
  factionId: string;
  factionName: string;
  avatarUrl: string;
  coverUrl?: string;
  status: 'alive' | 'deceased' | 'unknown' | 'erased_from_timeline' | 'transformed';
  powerLevel?: string;
  abilities: string[];
  summary: string;
  quote?: string;
  voiceActor?: string;
  firstAppearanceEpisode?: number;
  affiliations: string[];
}

export interface Faction {
  id: string;
  name: string;
  japaneseName?: string;
  leader?: string;
  color: string;
  badgeBg: string;
  description: string;
  moralAlignment: string;
  memberCount: number;
}

export interface Relationship {
  id: string;
  source: string; // Character ID
  target: string; // Character ID
  type: RelationshipType;
  label: string;
  description?: string;
  strength?: number; // 1-5
}

export interface CrossAnimeConnection {
  id: string;
  targetAnimeSlug: string;
  targetAnimeTitle: string;
  targetPosterUrl: string;
  connectionType: 'easter_egg' | 'shared_multiverse' | 'studio_crossover' | 'spiritual_successor' | 'director_signature';
  title: string;
  description: string;
  sharedElements: string[];
}

export interface AnimeLight {
  id: string;
  slug: string;
  title: string;
  titleJapanese: string;
  romaji: string;
  posterUrl: string;
  bannerUrl: string;
  year: number;
  season: string;
  studio: string;
  episodes: number;
  status: 'Completed' | 'Airing' | 'Upcoming';
  score: number;
  rank: number;
  genres: string[];
  tags: string[];
  shortSynopsis: string;
  timelineEventCount: number;
  characterCount: number;
}

export interface AnimeDetail extends AnimeLight {
  fullSynopsis: string;
  inUniverseTimelineSpan: string;
  canonPercentage: number;
  timelineBranches: string[];
  arcs: Arc[];
  events: TimelineEvent[];
  edges: TimelineEdgeData[];
  characters: Character[];
  factions: Faction[];
  relationships: Relationship[];
  crossConnections: CrossAnimeConnection[];
}

export interface FilterOptions {
  searchQuery: string;
  selectedGenre: string;
  selectedYear: string;
  selectedStudio: string;
  selectedStatus: string;
  sortBy: 'score' | 'year' | 'events' | 'title';
}
