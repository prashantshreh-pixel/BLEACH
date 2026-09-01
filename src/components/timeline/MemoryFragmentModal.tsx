import * as React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TimelineEvent, Character } from '../../types';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { 
  Sparkles, 
  Quote, 
  Tv, 
  Calendar, 
  Users, 
  AlertCircle, 
  Tag, 
  Check, 
  Share2,
  Play,
  X,
  Compass,
  Radio,
  Zap,
  Flame,
  Swords,
  Skull,
  Clock,
  Lightbulb,
  GitBranch,
  UserPlus,
  BookOpen,
  ArrowRight
} from 'lucide-react';

export interface MemoryFragmentModalProps {
  event: TimelineEvent | null;
  open: boolean;
  onClose: () => void;
  characters?: Character[];
  onSelectCharacter?: (characterId: string) => void;
  onPlayFromEvent?: (event: TimelineEvent) => void;
}

export function MemoryFragmentModal({
  event,
  open,
  onClose,
  characters = [],
  onSelectCharacter,
  onPlayFromEvent,
}: MemoryFragmentModalProps) {
  const [copied, setCopied] = React.useState(false);
  const [diveStage, setDiveStage] = React.useState<'diving' | 'resolved'>('diving');

  // Handle escape key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (open) {
      window.addEventListener('keydown', handleKeyDown);
      setDiveStage('diving');
      const timer = setTimeout(() => setDiveStage('resolved'), 300);
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        clearTimeout(timer);
      };
    }
  }, [open, onClose]);

  if (!open || !event) return null;

  const handleCopy = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getCanonBadgeVariant = (canon: string) => {
    switch (canon) {
      case 'canon':
        return 'canon';
      case 'filler':
        return 'filler';
      case 'ova':
        return 'ova';
      case 'movie':
        return 'movie';
      case 'what_if':
        return 'what_if';
      default:
        return 'default';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'battle':
        return <Swords className="h-4 w-4 text-rose-400" />;
      case 'death':
        return <Skull className="h-4 w-4 text-red-500" />;
      case 'power_up':
        return <Flame className="h-4 w-4 text-amber-400" />;
      case 'timeskip':
        return <Clock className="h-4 w-4 text-cyan-400" />;
      case 'revelation':
        return <Lightbulb className="h-4 w-4 text-yellow-300" />;
      case 'alternate_branch':
        return <GitBranch className="h-4 w-4 text-purple-400" />;
      case 'character_intro':
        return <UserPlus className="h-4 w-4 text-emerald-400" />;
      default:
        return <BookOpen className="h-4 w-4 text-indigo-400" />;
    }
  };

  const eventCharacters = characters.filter((c) =>
    event.keyCharacters.some(
      (kc) => kc.toLowerCase() === c.id.toLowerCase() || kc.toLowerCase() === c.name.toLowerCase()
    )
  );

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Memory Dive Portal Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-xl"
        >
          {/* Prismatic Chrono Distortion Waves */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.2)_0%,rgba(168,85,247,0.1)_35%,transparent_70%)] animate-pulse" />
          <div className="absolute inset-0 bg-radial-grid opacity-30 pointer-events-none" />
          
          {/* Subtle diving warp beam lines */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
            <div className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%] bg-[radial-gradient(circle,rgba(255,255,255,0.15)_1px,transparent_1px)] bg-[length:30px_30px]" />
          </div>
        </motion.div>

        {/* Memory Fragment Crystal Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.75, filter: 'blur(16px)' }}
          animate={{ 
            opacity: 1, 
            scale: 1, 
            filter: 'blur(0px)',
            transition: { 
              type: 'spring', 
              damping: 24, 
              stiffness: 280 
            } 
          }}
          exit={{ 
            opacity: 0, 
            scale: 0.85, 
            filter: 'blur(12px)',
            transition: { duration: 0.2 } 
          }}
          className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl border border-indigo-500/40 bg-zinc-950/95 shadow-[0_0_80px_rgba(99,102,241,0.35)] overflow-hidden z-10 backdrop-blur-2xl"
        >
          {/* Holographic Header Bar */}
          <div className="relative border-b border-zinc-800/90 bg-gradient-to-r from-indigo-950/60 via-purple-950/40 to-zinc-950/60 p-5 sm:p-6">
            {/* Shimmer line */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-indigo-400 to-transparent" />
            
            {/* Memory Coordinate Breadcrumb */}
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2 font-mono text-[11px] text-indigo-400 tracking-wider">
                <Radio className="h-3.5 w-3.5 text-indigo-400 animate-pulse" />
                <span className="bg-indigo-950/80 border border-indigo-800/50 px-2 py-0.5 rounded uppercase">
                  MEMORY FRAGMENT // #{event.id}
                </span>
                {event.branchId && (
                  <span className="text-purple-400 bg-purple-950/70 border border-purple-800/40 px-2 py-0.5 rounded">
                    WORLDLINE: {event.branchId.toUpperCase()}
                  </span>
                )}
              </div>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="h-8 w-8 rounded-full bg-zinc-900 border border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-800 flex items-center justify-center transition-colors"
                title="Resurface from memory (Esc)"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Badges & Type */}
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <Badge variant={getCanonBadgeVariant(event.canonType)} className="uppercase font-bold tracking-wider text-[10px]">
                {event.canonType}
              </Badge>
              <div className="flex items-center gap-1.5 rounded-full bg-zinc-900 border border-zinc-700 px-2.5 py-0.5 text-xs text-zinc-300">
                {getTypeIcon(event.type)}
                <span className="capitalize">{event.type.replace('_', ' ')}</span>
              </div>
            </div>

            {/* Main Event Title */}
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
              {event.title}
            </h2>

            {/* In-Universe Subtitle */}
            <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-indigo-300 font-medium">
              <span className="flex items-center gap-1">
                <Compass className="h-3.5 w-3.5 text-indigo-400" />
                {event.arcName}
              </span>
              <span>•</span>
              <span className="font-mono text-zinc-400 flex items-center gap-1">
                <Tv className="h-3.5 w-3.5 text-zinc-400" />
                Ep {event.episodeStart}{event.episodeEnd && event.episodeEnd !== event.episodeStart ? `–${event.episodeEnd}` : ''}
              </span>
              <span>•</span>
              <span className="font-mono text-amber-300 bg-amber-950/40 border border-amber-800/40 px-2 py-0.5 rounded flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {event.dateInUniverse}
              </span>
            </div>
          </div>

          {/* Scrollable Body Content */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 text-zinc-300 text-sm">
            {/* Impact Rating Meter */}
            <div className="rounded-2xl border border-zinc-800/90 bg-zinc-900/60 p-4 space-y-2.5">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="flex items-center gap-1.5 text-zinc-200">
                  <Sparkles className="h-4 w-4 text-amber-400" />
                  Timeline Causality & Fracture Impact
                </span>
                <span className="text-amber-400 font-mono font-bold text-sm">
                  {event.impactScore} / 10
                </span>
              </div>
              <div className="h-2.5 w-full bg-zinc-950 rounded-full overflow-hidden border border-zinc-800">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${event.impactScore * 10}%` }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  className={`h-full rounded-full ${
                    event.impactScore >= 9
                      ? 'bg-gradient-to-r from-amber-500 via-rose-500 to-red-600 shadow-[0_0_15px_rgba(239,68,68,0.5)]'
                      : event.impactScore >= 7
                      ? 'bg-gradient-to-r from-indigo-500 to-amber-500'
                      : 'bg-indigo-500'
                  }`}
                />
              </div>
            </div>

            {/* Narrative Lore Summary */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                <BookOpen className="h-3.5 w-3.5 text-indigo-400" />
                Historical Record & Synopsis
              </h4>
              <p className="text-sm leading-relaxed text-zinc-200 bg-zinc-900/40 rounded-2xl p-4 border border-zinc-800/70">
                {event.summary}
              </p>
            </div>

            {/* In-Universe Quote Banner */}
            {event.quote && (
              <div className="relative rounded-2xl border border-indigo-900/40 bg-gradient-to-r from-indigo-950/40 via-purple-950/30 to-zinc-950/40 p-4.5 pl-5">
                <div className="absolute left-0 top-3 bottom-3 w-1 bg-indigo-500 rounded-r" />
                <Quote className="h-5 w-5 text-indigo-400 mb-2 opacity-80" />
                <p className="font-serif italic text-base text-indigo-100 leading-snug">
                  "{event.quote}"
                </p>
                {event.quoteSpeaker && (
                  <p className="mt-2 text-right text-xs font-mono font-semibold text-indigo-300">
                    — {event.quoteSpeaker}
                  </p>
                )}
              </div>
            )}

            {/* Causal Consequences / Butterfly Effects */}
            {event.consequences && event.consequences.length > 0 && (
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                  <Zap className="h-3.5 w-3.5 text-amber-400" />
                  Causal Consequences & Butterfly Timeline Shifts
                </h4>
                <div className="space-y-2">
                  {event.consequences.map((consequence, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2.5 rounded-xl bg-zinc-900/50 border border-zinc-800/80 p-3 text-xs text-zinc-300"
                    >
                      <ArrowRight className="h-3.5 w-3.5 text-indigo-400 shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{consequence}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Key Characters in Memory Fragment */}
            {event.keyCharacters && event.keyCharacters.length > 0 && (
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5 text-emerald-400" />
                  Pivotal Characters Present ({event.keyCharacters.length})
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {eventCharacters.length > 0
                    ? eventCharacters.map((char) => (
                        <button
                          key={char.id}
                          onClick={() => {
                            if (onSelectCharacter) onSelectCharacter(char.id);
                          }}
                          className="flex items-center gap-3 rounded-xl bg-zinc-900/80 border border-zinc-800 p-2.5 text-left hover:border-indigo-500/60 hover:bg-zinc-850 transition-colors cursor-pointer group"
                        >
                          <img
                            src={char.avatarUrl}
                            alt={char.name}
                            className="h-10 w-10 rounded-lg object-cover border border-zinc-700 group-hover:border-indigo-400 shrink-0"
                          />
                          <div className="overflow-hidden">
                            <p className="font-bold text-xs text-white group-hover:text-indigo-300 truncate">
                              {char.name}
                            </p>
                            <p className="text-[10px] text-zinc-400 truncate">
                              {char.factionName}
                            </p>
                          </div>
                        </button>
                      ))
                    : event.keyCharacters.map((charName, idx) => (
                        <div
                          key={idx}
                          className="rounded-xl bg-zinc-900/60 border border-zinc-800 p-2.5 text-xs text-zinc-300 capitalize font-medium"
                        >
                          {charName}
                        </div>
                      ))}
                </div>
              </div>
            )}

            {/* Tags */}
            {event.tags && event.tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-zinc-800/80">
                <Tag className="h-3.5 w-3.5 text-zinc-500 mr-1" />
                {event.tags.map((t) => (
                  <span
                    key={t}
                    className="text-[11px] font-mono text-zinc-400 bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded-md"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Modal Footer Controls */}
          <div className="border-t border-zinc-800/90 bg-zinc-950/80 p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              {onPlayFromEvent && (
                <Button
                  variant="glow"
                  size="sm"
                  onClick={() => {
                    onPlayFromEvent(event);
                    onClose();
                  }}
                  className="gap-2 rounded-xl text-xs font-bold"
                >
                  <Play className="h-3.5 w-3.5 fill-current" />
                  Simulate From Here
                </Button>
              )}

              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className="gap-1.5 rounded-xl text-xs border-zinc-700 bg-zinc-900"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Share2 className="h-3.5 w-3.5" />}
                <span>{copied ? 'Anchor Copied' : 'Share Anchor'}</span>
              </Button>
            </div>

            <Button
              variant="secondary"
              size="sm"
              onClick={onClose}
              className="rounded-xl text-xs bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white"
            >
              Resurface (Close)
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
