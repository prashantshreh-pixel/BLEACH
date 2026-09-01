import * as React from 'react';
import { TimelineEvent, Character } from '../../types';
import { Sheet, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from '../ui/sheet';
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
  Play
} from 'lucide-react';

export interface EventDrawerProps {
  event: TimelineEvent | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  characters?: Character[];
  onSelectCharacter?: (characterId: string) => void;
  onPlayFromEvent?: (event: TimelineEvent) => void;
}

export function EventDrawer({
  event,
  open,
  onOpenChange,
  characters = [],
  onSelectCharacter,
  onPlayFromEvent,
}: EventDrawerProps) {
  const [copied, setCopied] = React.useState(false);

  if (!event) return null;

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

  const eventCharacters = characters.filter((c) =>
    event.keyCharacters.some(
      (kc) => kc.toLowerCase() === c.id.toLowerCase() || kc.toLowerCase() === c.name.toLowerCase()
    )
  );

  return (
    <Sheet open={open} onOpenChange={onOpenChange} side="right" className="max-w-xl">
      <SheetHeader>
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <Badge variant={getCanonBadgeVariant(event.canonType)} className="uppercase font-bold tracking-wider">
            {event.canonType}
          </Badge>
          <Badge variant="outline" className="capitalize text-zinc-300">
            {event.type.replace('_', ' ')}
          </Badge>
          {event.branchId && (
            <Badge variant="secondary" className="text-[11px] font-mono">
              Branch: {event.branchId}
            </Badge>
          )}
        </div>
        <SheetTitle className="text-2xl font-black tracking-tight text-white pr-6">
          {event.title}
        </SheetTitle>
        <SheetDescription className="flex items-center gap-2 text-indigo-300 font-medium">
          <span>{event.arcName}</span>
          <span>•</span>
          <span className="font-mono text-zinc-400 flex items-center gap-1">
            <Tv className="h-3.5 w-3.5" />
            Ep {event.episodeStart}{event.episodeEnd && event.episodeEnd !== event.episodeStart ? `–${event.episodeEnd}` : ''}
          </span>
        </SheetDescription>
      </SheetHeader>

      <div className="space-y-6 text-sm text-zinc-300 pb-6">
        {/* In-Universe Date & Impact Meter Card */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-zinc-400 text-xs">
              <Calendar className="h-4 w-4 text-indigo-400" />
              <span>In-Universe Chronology:</span>
            </div>
            <span className="font-mono font-bold text-xs text-indigo-200 bg-indigo-950/60 border border-indigo-800/40 px-2 py-0.5 rounded">
              {event.dateInUniverse}
            </span>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs font-semibold">
              <span className="flex items-center gap-1 text-zinc-300">
                <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                Timeline Impact Rating
              </span>
              <span className="text-amber-400 font-mono">{event.impactScore} / 10</span>
            </div>
            <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-amber-500 rounded-full transition-all duration-500"
                style={{ width: `${(event.impactScore / 10) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Full Narrative Summary */}
        <div className="space-y-2">
          <h4 className="text-xs uppercase tracking-wider font-bold text-zinc-400">
            Event Log & In-Universe Chronicle
          </h4>
          <p className="text-sm leading-relaxed text-zinc-200 bg-zinc-900/60 p-4 rounded-xl border border-zinc-800/80">
            {event.summary}
          </p>
        </div>

        {/* Famous Quote (if available) */}
        {event.quote && (
          <div className="relative rounded-xl border border-indigo-500/20 bg-indigo-950/20 p-4 pl-10 text-indigo-200">
            <Quote className="absolute top-4 left-3 h-5 w-5 text-indigo-400/50" />
            <p className="italic text-sm leading-relaxed font-serif">
              "{event.quote}"
            </p>
            {event.quoteSpeaker && (
              <p className="mt-2 text-xs font-bold uppercase tracking-wider text-indigo-400 text-right">
                — {event.quoteSpeaker}
              </p>
            )}
          </div>
        )}

        {/* Key Characters Participating */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs uppercase tracking-wider font-bold text-zinc-400 flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 text-indigo-400" />
              Key Key Figure & Actors ({event.keyCharacters.length})
            </h4>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {eventCharacters.length > 0 ? (
              eventCharacters.map((char) => (
                <button
                  key={char.id}
                  onClick={() => onSelectCharacter?.(char.id)}
                  className="flex items-center gap-2.5 p-2 rounded-lg bg-zinc-800/60 border border-zinc-700/40 hover:bg-zinc-800 hover:border-indigo-500/50 transition-all text-left group cursor-pointer"
                >
                  <img
                    src={char.avatarUrl}
                    alt={char.name}
                    className="h-9 w-9 rounded-full object-cover border border-zinc-700 group-hover:border-indigo-400 transition-colors"
                  />
                  <div className="overflow-hidden">
                    <p className="text-xs font-bold text-zinc-200 group-hover:text-indigo-300 truncate">
                      {char.name}
                    </p>
                    <p className="text-[10px] text-zinc-400 truncate">
                      {char.factionName}
                    </p>
                  </div>
                </button>
              ))
            ) : (
              event.keyCharacters.map((charName) => (
                <div
                  key={charName}
                  className="flex items-center gap-2 p-2 rounded-lg bg-zinc-800/40 border border-zinc-700/30 text-xs text-zinc-300"
                >
                  <span className="h-2 w-2 rounded-full bg-indigo-400" />
                  <span className="capitalize">{charName}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Consequences & Ripple Effects */}
        {event.consequences && event.consequences.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs uppercase tracking-wider font-bold text-zinc-400 flex items-center gap-1.5">
              <AlertCircle className="h-3.5 w-3.5 text-amber-400" />
              Timeline Ripple Effects & Consequences
            </h4>
            <ul className="space-y-2">
              {event.consequences.map((cons, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2 text-xs text-zinc-300 bg-zinc-950/40 p-2.5 rounded-lg border border-zinc-800/60"
                >
                  <span className="mt-0.5 text-indigo-400 font-bold font-mono">#{idx + 1}</span>
                  <span className="leading-relaxed">{cons}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Tags */}
        {event.tags && event.tags.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs uppercase tracking-wider font-bold text-zinc-400 flex items-center gap-1.5">
              <Tag className="h-3.5 w-3.5 text-zinc-400" />
              Thematic Tags
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {event.tags.map((t) => (
                <span
                  key={t}
                  className="text-[11px] font-medium bg-zinc-800/80 text-zinc-300 px-2 py-0.5 rounded-md border border-zinc-700/50"
                >
                  #{t}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <SheetFooter className="mt-auto pt-4 flex gap-2">
        {onPlayFromEvent && (
          <Button
            variant="default"
            size="sm"
            onClick={() => {
              onPlayFromEvent(event);
              onOpenChange(false);
            }}
            className="flex-1 gap-1.5"
          >
            <Play className="h-4 w-4" /> Simulate From Here
          </Button>
        )}
        <Button variant="outline" size="sm" onClick={handleCopy} className="gap-1.5">
          {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Share2 className="h-4 w-4" />}
          {copied ? 'Copied' : 'Share'}
        </Button>
      </SheetFooter>
    </Sheet>
  );
}
