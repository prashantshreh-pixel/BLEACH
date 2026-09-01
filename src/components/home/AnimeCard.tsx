import * as React from 'react';
import { motion } from 'motion/react';
import { AnimeLight } from '../../types';
import { Star, Sparkles, Tv, GitBranch, Users, ArrowRight, Shield } from 'lucide-react';
import { Badge } from '../ui/badge';

interface AnimeCardProps {
  key?: React.Key;
  anime: AnimeLight;
  onClick: (slug: string) => void;
  index: number;
}

export function AnimeCard({ anime, onClick, index }: AnimeCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.3) }}
      whileHover={{ y: -6, scale: 1.015 }}
      whileTap={{ scale: 0.985 }}
      onClick={() => onClick(anime.slug)}
      className="group relative flex flex-col rounded-2xl border border-zinc-800/80 bg-gradient-to-b from-zinc-900/90 to-zinc-950 overflow-hidden shadow-xl hover:shadow-[0_0_35px_rgba(99,102,241,0.25)] hover:border-indigo-500/50 transition-all duration-300 cursor-pointer backdrop-blur-md"
    >
      {/* Poster Image Frame */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-zinc-950">
        <img
          src={anime.bannerUrl || anime.posterUrl}
          alt={anime.title}
          className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />

        {/* Studio & Rank Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <span className="font-podium text-[10px] font-bold text-zinc-200 uppercase tracking-wider bg-black/80 border border-white/20 px-2.5 py-0.5 rounded-full backdrop-blur-md">
            RANK #{anime.rank}
          </span>

          <div className="flex items-center gap-1 rounded-full bg-black/80 border border-amber-500/40 px-2.5 py-0.5 text-xs font-bold text-amber-400 backdrop-blur-md shadow-md">
            <Star className="h-3 w-3 fill-amber-400" />
            <span className="font-inter">{anime.score}</span>
          </div>
        </div>

        {/* Japanese Title & Main Name Overlay */}
        <div className="absolute bottom-3 left-3 right-3">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-inter tracking-widest text-indigo-300 font-semibold truncate uppercase">
              {anime.titleJapanese} • {anime.studio.split('/')[0]}
            </p>
            <span className="text-[10px] font-inter text-zinc-400 bg-black/80 px-2 py-0.5 rounded border border-white/10 uppercase">
              {anime.episodes} eps
            </span>
          </div>
          <h3 className="text-xl font-podium uppercase text-white group-hover:text-indigo-300 transition-colors line-clamp-1 mt-0.5 tracking-wide">
            {anime.title}
          </h3>
        </div>
      </div>

      {/* Card Body with Lore Details */}
      <div className="p-4 flex flex-col justify-between flex-1 gap-3">
        <p className="text-xs font-inter text-zinc-400 line-clamp-2 leading-relaxed">
          {anime.shortSynopsis}
        </p>

        {/* Wiki Metric Badges */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <div className="flex items-center gap-2 rounded-xl bg-zinc-950/80 border border-zinc-800/80 p-2 text-xs">
            <GitBranch className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
            <div>
              <span className="text-[9px] font-inter uppercase text-zinc-500 block leading-none">Chronology</span>
              <span className="font-inter text-zinc-200 text-[11px] font-bold">{anime.timelineEventCount} Nodes</span>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-xl bg-zinc-950/80 border border-zinc-800/80 p-2 text-xs">
            <Users className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
            <div>
              <span className="text-[9px] font-inter uppercase text-zinc-500 block leading-none">Cast/Factions</span>
              <span className="font-inter text-zinc-200 text-[11px] font-bold">{anime.characterCount} Profiles</span>
            </div>
          </div>
        </div>

        {/* Tags & Action Link */}
        <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between">
          <div className="flex flex-wrap gap-1">
            {anime.genres.slice(0, 2).map((genre) => (
              <span key={genre} className="font-inter text-[9px] uppercase tracking-wider px-2 py-0.5 rounded bg-zinc-800/80 text-zinc-300 border border-zinc-700/50">
                {genre}
              </span>
            ))}
          </div>

          <span className="text-xs font-inter uppercase tracking-widest font-semibold text-indigo-400 group-hover:text-white flex items-center gap-1 transition-colors">
            OPEN CODEX <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      </div>
    </motion.div>
  );
}


