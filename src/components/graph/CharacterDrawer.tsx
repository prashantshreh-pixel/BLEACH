import * as React from 'react';
import { Character, Faction, Relationship } from '../../types';
import { Sheet, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from '../ui/sheet';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { 
  Shield, 
  Zap, 
  Quote, 
  Mic, 
  Heart, 
  Swords, 
  Crosshair, 
  Users, 
  Award,
  Sparkles
} from 'lucide-react';

export interface CharacterDrawerProps {
  character: Character | null;
  faction?: Faction | null;
  relationships?: { rel: Relationship; otherChar: Character }[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectRelatedCharacter?: (characterId: string) => void;
}

export function CharacterDrawer({
  character,
  faction,
  relationships = [],
  open,
  onOpenChange,
  onSelectRelatedCharacter,
}: CharacterDrawerProps) {
  if (!character) return null;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'alive':
        return <Badge variant="canon" className="capitalize font-bold">Alive</Badge>;
      case 'deceased':
        return <Badge variant="destructive" className="capitalize font-bold">Deceased</Badge>;
      case 'transformed':
        return <Badge variant="ova" className="capitalize font-bold">Transformed</Badge>;
      case 'erased_from_timeline':
        return <Badge variant="what_if" className="capitalize font-bold">Erased From Timeline</Badge>;
      default:
        return <Badge variant="secondary" className="capitalize font-bold">{status}</Badge>;
    }
  };

  const getRelIcon = (type: string) => {
    switch (type) {
      case 'romantic':
        return <Heart className="h-3.5 w-3.5 text-rose-400" />;
      case 'enemy':
        return <Swords className="h-3.5 w-3.5 text-red-500" />;
      case 'rival':
        return <Crosshair className="h-3.5 w-3.5 text-amber-400" />;
      case 'mentor_student':
        return <Award className="h-3.5 w-3.5 text-emerald-400" />;
      default:
        return <Users className="h-3.5 w-3.5 text-indigo-400" />;
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange} side="right" className="max-w-xl">
      <SheetHeader>
        <div className="flex flex-wrap items-center gap-2 mb-2">
          {getStatusBadge(character.status)}
          <Badge variant="outline" className="capitalize text-zinc-300">
            {character.role}
          </Badge>
          {faction && (
            <span
              className="text-xs font-semibold px-2.5 py-0.5 rounded-full border"
              style={{
                borderColor: `${faction.color}60`,
                backgroundColor: faction.badgeBg,
                color: faction.color,
              }}
            >
              {faction.name}
            </span>
          )}
        </div>

        <div className="flex items-center gap-4 pt-1">
          <img
            src={character.avatarUrl}
            alt={character.name}
            className="h-16 w-16 rounded-2xl object-cover border-2 border-indigo-500/40 shadow-xl"
          />
          <div>
            <SheetTitle className="text-2xl font-black text-white">
              {character.name}
            </SheetTitle>
            {character.japaneseName && (
              <p className="text-sm font-serif text-zinc-400">
                {character.japaneseName}
              </p>
            )}
          </div>
        </div>
      </SheetHeader>

      <div className="space-y-6 text-sm text-zinc-300 pb-6">
        {/* Power Level & Voice Actor */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {character.powerLevel && (
            <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-3 flex items-start gap-2.5">
              <Sparkles className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-[11px] uppercase tracking-wider font-bold text-zinc-400">Combat Capability</p>
                <p className="text-xs font-semibold text-zinc-200 mt-0.5 leading-snug">{character.powerLevel}</p>
              </div>
            </div>
          )}

          {character.voiceActor && (
            <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-3 flex items-start gap-2.5">
              <Mic className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-[11px] uppercase tracking-wider font-bold text-zinc-400">Voice Actor (CV)</p>
                <p className="text-xs font-semibold text-indigo-300 mt-0.5 leading-snug">{character.voiceActor}</p>
              </div>
            </div>
          )}
        </div>

        {/* Character Bio */}
        <div className="space-y-2">
          <h4 className="text-xs uppercase tracking-wider font-bold text-zinc-400">
            Character Profile & Lore
          </h4>
          <p className="text-sm leading-relaxed text-zinc-200 bg-zinc-900/60 p-4 rounded-xl border border-zinc-800/80">
            {character.summary}
          </p>
        </div>

        {/* Famous Quote */}
        {character.quote && (
          <div className="relative rounded-xl border border-indigo-500/20 bg-indigo-950/20 p-4 pl-10 text-indigo-200">
            <Quote className="absolute top-4 left-3 h-5 w-5 text-indigo-400/50" />
            <p className="italic text-sm leading-relaxed font-serif">
              "{character.quote}"
            </p>
          </div>
        )}

        {/* Signature Abilities & Jutsu */}
        {character.abilities && character.abilities.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs uppercase tracking-wider font-bold text-zinc-400 flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5 text-amber-400" />
              Signature Techniques & Abilities
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {character.abilities.map((ability) => (
                <div
                  key={ability}
                  className="flex items-center gap-2 p-2 rounded-lg bg-zinc-950/60 border border-zinc-800 text-xs text-zinc-200 font-medium"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                  <span className="truncate">{ability}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Direct Connections / Network Relationships */}
        {relationships.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-wider font-bold text-zinc-400 flex items-center gap-1.5">
              <Shield className="h-3.5 w-3.5 text-indigo-400" />
              Direct Network Ties ({relationships.length})
            </h4>
            <div className="space-y-2">
              {relationships.map(({ rel, otherChar }) => (
                <button
                  key={rel.id}
                  onClick={() => onSelectRelatedCharacter?.(otherChar.id)}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 hover:border-indigo-500/50 hover:bg-zinc-850 transition-all text-left group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={otherChar.avatarUrl}
                      alt={otherChar.name}
                      className="h-10 w-10 rounded-full object-cover border border-zinc-700 group-hover:border-indigo-400 transition-colors"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-zinc-200 group-hover:text-indigo-300">
                          {otherChar.name}
                        </span>
                        <div className="flex items-center gap-1 text-[11px] text-zinc-400">
                          {getRelIcon(rel.type)}
                          <span className="capitalize">{rel.type.replace('_', ' ')}</span>
                        </div>
                      </div>
                      <p className="text-[11px] text-zinc-400 mt-0.5 line-clamp-1">
                        {rel.label} {rel.description ? `• ${rel.description}` : ''}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-indigo-400 group-hover:translate-x-0.5 transition-transform">
                    →
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <SheetFooter>
        <Button variant="outline" size="sm" onClick={() => onOpenChange(false)} className="w-full">
          Close Profile
        </Button>
      </SheetFooter>
    </Sheet>
  );
}
