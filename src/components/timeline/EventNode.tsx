import * as React from 'react';
import { Handle, Position } from '@xyflow/react';
import { TimelineEvent } from '../../types';
import { Badge } from '../ui/badge';
import { 
  Swords, 
  Skull, 
  Sparkles, 
  Clock, 
  Lightbulb, 
  GitBranch, 
  UserPlus, 
  BookOpen, 
  Flame,
  CheckCircle2
} from 'lucide-react';
import { cn } from '../../lib/utils';

export interface EventNodeProps {
  data: {
    event: TimelineEvent;
    isSelected?: boolean;
    isSimulatedCurrent?: boolean;
    onSelectEvent: (event: TimelineEvent) => void;
  };
}

export const EventNode = React.memo(({ data }: EventNodeProps) => {
  const { event, isSelected, isSimulatedCurrent, onSelectEvent } = data;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'battle':
        return <Swords className="h-3.5 w-3.5 text-rose-400" />;
      case 'death':
        return <Skull className="h-3.5 w-3.5 text-red-500" />;
      case 'power_up':
        return <Flame className="h-3.5 w-3.5 text-amber-400" />;
      case 'timeskip':
        return <Clock className="h-3.5 w-3.5 text-cyan-400" />;
      case 'revelation':
        return <Lightbulb className="h-3.5 w-3.5 text-yellow-300" />;
      case 'alternate_branch':
        return <GitBranch className="h-3.5 w-3.5 text-purple-400" />;
      case 'character_intro':
        return <UserPlus className="h-3.5 w-3.5 text-emerald-400" />;
      default:
        return <BookOpen className="h-3.5 w-3.5 text-indigo-400" />;
    }
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

  return (
    <div
      onClick={() => onSelectEvent(event)}
      className={cn(
        'group relative w-64 rounded-xl border p-3.5 shadow-xl transition-all duration-200 cursor-pointer select-none backdrop-blur-md text-left',
        isSelected
          ? 'border-indigo-400 bg-zinc-900/95 ring-2 ring-indigo-500/50 shadow-[0_0_25px_rgba(99,102,241,0.4)] scale-105'
          : isSimulatedCurrent
          ? 'border-amber-400 bg-amber-950/40 ring-2 ring-amber-400/80 shadow-[0_0_30px_rgba(251,191,36,0.6)] animate-pulse'
          : 'border-zinc-800/90 bg-zinc-900/85 hover:border-zinc-700 hover:bg-zinc-850 hover:shadow-2xl'
      )}
    >
      {/* React Flow Handles */}
      <Handle
        type="target"
        position={Position.Left}
        className="!h-3 !w-3 !rounded-full !border-2 !border-zinc-900 !bg-indigo-400 transition-transform group-hover:scale-125"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="!h-3 !w-3 !rounded-full !border-2 !border-zinc-900 !bg-indigo-400 transition-transform group-hover:scale-125"
      />

      {/* Simulation Pulse Marker */}
      {isSimulatedCurrent && (
        <div className="absolute -top-2.5 -right-2.5 flex items-center gap-1 rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-bold text-black shadow-lg animate-bounce">
          <Sparkles className="h-3 w-3" /> ACTIVE SIM
        </div>
      )}

      {/* Header with Type & Canon Badges */}
      <div className="flex items-center justify-between gap-1.5 mb-2">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-300">
          <div className="flex h-5 w-5 items-center justify-center rounded-md bg-zinc-800/90 border border-zinc-700/50">
            {getTypeIcon(event.type)}
          </div>
          <span className="capitalize text-[11px] text-zinc-400">
            {event.type.replace('_', ' ')}
          </span>
        </div>
        <Badge variant={getCanonBadgeVariant(event.canonType)} className="text-[10px] uppercase font-bold tracking-wider py-0 px-1.5">
          {event.canonType}
        </Badge>
      </div>

      {/* Title */}
      <h4 className="text-sm font-bold text-zinc-100 line-clamp-1 group-hover:text-indigo-300 transition-colors">
        {event.title}
      </h4>

      {/* Arc & Date Metadata */}
      <div className="mt-1 flex items-center justify-between text-[11px] text-zinc-400">
        <span className="truncate max-w-[130px] font-medium text-zinc-300">{event.arcName}</span>
        {event.episodeStart && (
          <span className="font-mono text-zinc-400 bg-zinc-800/70 px-1.5 py-0.5 rounded border border-zinc-700/40">
            Ep {event.episodeStart}{event.episodeEnd && event.episodeEnd !== event.episodeStart ? `-${event.episodeEnd}` : ''}
          </span>
        )}
      </div>

      {/* In-Universe Date Tag */}
      <div className="mt-2 text-[10px] font-mono text-indigo-300/90 bg-indigo-950/40 border border-indigo-800/30 rounded px-2 py-0.5 flex items-center justify-between">
        <span className="truncate">{event.dateInUniverse}</span>
        <span className="text-amber-400 font-bold ml-1">★ {event.impactScore}</span>
      </div>

      {/* Short Summary Preview */}
      <p className="mt-2 text-[11px] text-zinc-400 line-clamp-2 leading-tight">
        {event.summary}
      </p>

      {/* Interactive Footer Callout */}
      <div className="mt-2 pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[10px] text-zinc-400">
        <span className="flex items-center gap-1 text-zinc-400">
          <CheckCircle2 className="h-3 w-3 text-emerald-400" />
          {event.keyCharacters.length} Key Characters
        </span>
        <span className="text-indigo-400 font-medium group-hover:underline">Inspect Details →</span>
      </div>
    </div>
  );
});

EventNode.displayName = 'EventNode';
