import * as React from 'react';
import { useQuery } from '@apollo/client/react';
import { motion } from 'motion/react';
import { GET_ANIME_BY_SLUG_HEAVY } from '../../lib/graphql/queries';
import { AnimeDetail } from '../../types';
import { TimelineViewer } from '../timeline/TimelineViewer';
import { RelationshipGraph } from '../graph/RelationshipGraph';
import { CrossoverUniverseGraph } from '../graph/CrossoverUniverseGraph';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Skeleton } from '../ui/skeleton';
import { 
  ArrowLeft, 
  Star, 
  Tv, 
  Calendar, 
  Building, 
  GitBranch, 
  Network, 
  Globe2, 
  BookOpen, 
  Sparkles,
  Layers,
  Clock,
  ShieldAlert,
  Share2,
  Check
} from 'lucide-react';

interface AnimeDetailPageProps {
  slug: string;
  onBack: () => void;
  onNavigateToAnime: (slug: string) => void;
}

export function AnimeDetailPage({ slug, onBack, onNavigateToAnime }: AnimeDetailPageProps) {
  const [activeTab, setActiveTab] = React.useState<string>('timeline');
  const [copied, setCopied] = React.useState<boolean>(false);

  // Heavy query for full detail page
  const { data, loading, error, refetch } = useQuery<{ anime: AnimeDetail }>(
    GET_ANIME_BY_SLUG_HEAVY,
    {
      variables: { slug },
      fetchPolicy: 'cache-first',
    }
  );

  const anime = data?.anime;

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 p-6 space-y-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-24 rounded-xl" />
          <Skeleton className="h-10 w-64 rounded-xl" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Skeleton className="aspect-[3/4] rounded-2xl md:col-span-1" />
          <div className="md:col-span-3 space-y-4">
            <Skeleton className="h-8 w-3/4 rounded-xl" />
            <Skeleton className="h-4 w-1/2 rounded-lg" />
            <Skeleton className="h-24 w-full rounded-xl" />
            <div className="flex gap-2">
              <Skeleton className="h-8 w-20 rounded-lg" />
              <Skeleton className="h-8 w-20 rounded-lg" />
              <Skeleton className="h-8 w-20 rounded-lg" />
            </div>
          </div>
        </div>
        <Skeleton className="h-[600px] w-full rounded-2xl" />
      </div>
    );
  }

  if (error || !anime) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center justify-center p-6 text-center space-y-4">
        <ShieldAlert className="h-12 w-12 text-rose-500" />
        <h2 className="text-2xl font-bold text-white">Anime Universe Not Found</h2>
        <p className="text-sm text-zinc-400 max-w-md">
          {error?.message || `The requested anime slug "${slug}" could not be located in the database.`}
        </p>
        <div className="flex gap-3">
          <Button variant="default" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Return to Home
          </Button>
          <Button variant="outline" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="min-h-screen bg-zinc-950 text-zinc-100 pb-16"
    >
      {/* Sticky Header Nav */}
      <header className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="gap-2 rounded-xl text-zinc-300 hover:text-white hover:bg-zinc-900 border border-zinc-800"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Search
          </Button>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="gap-1.5 rounded-xl border-zinc-800 text-xs"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Share2 className="h-3.5 w-3.5" />}
              {copied ? 'Link Copied' : 'Share'}
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Banner Section */}
      <div className="relative w-full overflow-hidden border-b border-zinc-800 bg-zinc-950">
        {/* Blurred backdrop image */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-15 blur-2xl scale-110"
          style={{ backgroundImage: `url(${anime.bannerUrl})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Poster Card (3 cols) */}
            <div className="md:col-span-3">
              <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden border-2 border-zinc-700/80 shadow-2xl bg-zinc-900">
                <img
                  src={anime.posterUrl}
                  alt={anime.title}
                  className="h-full w-full object-cover"
                />
                <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-zinc-950/90 border border-zinc-700/60 px-2.5 py-1 text-xs font-bold text-amber-400 backdrop-blur-md">
                  <Star className="h-3.5 w-3.5 fill-amber-400" />
                  <span>{anime.score}</span>
                </div>
              </div>
            </div>

            {/* Metadata & Synopsis (9 cols) */}
            <div className="md:col-span-9 space-y-4 text-left">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-inter text-xs tracking-widest text-indigo-400 uppercase font-semibold">
                    {anime.titleJapanese}
                  </span>
                  <span className="text-zinc-600">•</span>
                  <span className="text-xs font-inter text-zinc-400 uppercase">
                    {anime.romaji}
                  </span>
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-podium uppercase tracking-wider text-white">
                  {anime.title}
                </h1>
              </div>

              {/* Badges / Metrics Row */}
              <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-300 pt-1">
                <div className="flex items-center gap-1.5 bg-zinc-900/90 border border-zinc-800 px-3 py-1.5 rounded-xl font-medium">
                  <Building className="h-3.5 w-3.5 text-indigo-400" />
                  <span>{anime.studio}</span>
                </div>

                <div className="flex items-center gap-1.5 bg-zinc-900/90 border border-zinc-800 px-3 py-1.5 rounded-xl font-medium">
                  <Calendar className="h-3.5 w-3.5 text-indigo-400" />
                  <span>{anime.year} ({anime.season})</span>
                </div>

                <div className="flex items-center gap-1.5 bg-zinc-900/90 border border-zinc-800 px-3 py-1.5 rounded-xl font-medium">
                  <Tv className="h-3.5 w-3.5 text-indigo-400" />
                  <span>{anime.episodes} Episodes ({anime.status})</span>
                </div>

                <div className="flex items-center gap-1.5 bg-emerald-950/50 border border-emerald-800/40 text-emerald-300 px-3 py-1.5 rounded-xl font-medium">
                  <span>Canon Ratio: {anime.canonPercentage}%</span>
                </div>
              </div>

              {/* Genre Chips */}
              <div className="flex flex-wrap gap-1.5">
                {anime.genres.map((g) => (
                  <Badge key={g} variant="default" className="text-xs">
                    {g}
                  </Badge>
                ))}
                {anime.tags.map((t) => (
                  <Badge key={t} variant="secondary" className="text-xs font-normal">
                    #{t}
                  </Badge>
                ))}
              </div>

              {/* Synopsis */}
              <p className="text-sm leading-relaxed text-zinc-300 pt-1 max-w-4xl">
                {anime.fullSynopsis}
              </p>

              {/* In-Universe Time Horizon Pill */}
              <div className="rounded-xl border border-indigo-500/30 bg-indigo-950/30 p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2 text-indigo-300 font-semibold">
                  <Clock className="h-4 w-4" />
                  <span>In-Universe Temporal Scope:</span>
                </div>
                <span className="font-mono text-zinc-300 text-xs bg-zinc-900/80 px-2.5 py-1 rounded-lg border border-zinc-800">
                  {anime.inUniverseTimelineSpan}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Interactive Explorer Tabs Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          {/* Main Navigation Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
            <TabsList className="flex flex-wrap w-full sm:w-auto">
              <TabsTrigger value="timeline" className="gap-2">
                <GitBranch className="h-4 w-4 text-indigo-400" />
                <span>Event Timeline</span>
              </TabsTrigger>
              <TabsTrigger value="relationships" className="gap-2">
                <Network className="h-4 w-4 text-emerald-400" />
                <span>Characters & Factions</span>
              </TabsTrigger>
              {anime.crossConnections && anime.crossConnections.length > 0 && (
                <TabsTrigger value="crossovers" className="gap-2">
                  <Globe2 className="h-4 w-4 text-purple-400" />
                  <span>Multiverse Links ({anime.crossConnections.length})</span>
                </TabsTrigger>
              )}
              <TabsTrigger value="arcs" className="gap-2">
                <BookOpen className="h-4 w-4 text-amber-400" />
                <span>Story Arcs & Index ({anime.arcs.length})</span>
              </TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-3 text-xs text-zinc-400">
              <span className="flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                {anime.timelineEventCount} nodes • {anime.characterCount} characters
              </span>
            </div>
          </div>

          {/* TAB 1: React Flow Timeline */}
          <TabsContent value="timeline">
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-zinc-400 px-1">
                <p>
                  Interactive chronological graph. Click any node to dive into memory lore or drag fragments to customize layout (auto-saved).
                </p>
                <div className="flex items-center gap-3 font-mono text-[11px]">
                  <span className="flex items-center gap-1 text-emerald-400">● Canon</span>
                  <span className="flex items-center gap-1 text-amber-400">● Filler</span>
                  <span className="flex items-center gap-1 text-purple-400">● OVA/Special</span>
                </div>
              </div>

              <TimelineViewer
                events={anime.events}
                edgesData={anime.edges}
                characters={anime.characters}
                arcs={anime.arcs}
                animeSlug={anime.slug}
              />
            </div>
          </TabsContent>

          {/* TAB 2: Cytoscape Relationship Graph */}
          <TabsContent value="relationships">
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-zinc-400 px-1">
                <p>
                  Interactive character network & faction allegiance map. Click a character to spotlight direct relationships.
                </p>
                <span className="font-mono text-zinc-400 text-[11px]">
                  {anime.relationships.length} relationship ties mapped
                </span>
              </div>

              <RelationshipGraph
                characters={anime.characters}
                factions={anime.factions}
                relationships={anime.relationships}
              />
            </div>
          </TabsContent>

          {/* TAB 3: Cytoscape Crossover & Multiverse Graph (Only if cross connections exist) */}
          {anime.crossConnections && anime.crossConnections.length > 0 && (
            <TabsContent value="crossovers">
              <div className="space-y-4">
                <div className="text-xs text-zinc-400 px-1">
                  <p>
                    Crossover universe threads, shared director inspirations, and thematic multiverse echoes with other anime series.
                  </p>
                </div>

                <CrossoverUniverseGraph
                  currentAnime={anime}
                  onNavigateToAnime={onNavigateToAnime}
                />
              </div>
            </TabsContent>
          )}

          {/* TAB 4: Story Arcs & Chronology Index */}
          <TabsContent value="arcs">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {anime.arcs.map((arc, idx) => (
                  <div
                    key={arc.id}
                    className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5 shadow-lg space-y-3 flex flex-col justify-between hover:border-zinc-700 transition-colors"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono text-xs font-bold text-indigo-400 bg-indigo-950/60 border border-indigo-800/40 px-2 py-0.5 rounded">
                          Arc {idx + 1}
                        </span>
                        <Badge variant={arc.canonType === 'canon' ? 'canon' : 'filler'} className="text-[10px] uppercase font-bold">
                          {arc.canonType}
                        </Badge>
                      </div>
                      <h4 className="text-lg font-bold text-white">
                        {arc.title}
                      </h4>
                      <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                        {arc.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400">
                      <span className="font-mono">Episodes: {arc.episodes}</span>
                      <span className="font-mono text-zinc-400">
                        {arc.startYearInUniverse ? `Yr ${arc.startYearInUniverse}` : ''}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </motion.div>
  );
}
