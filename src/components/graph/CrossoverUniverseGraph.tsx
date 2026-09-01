import * as React from 'react';
import cytoscape, { Core } from 'cytoscape';
import { AnimeDetail, CrossAnimeConnection } from '../../types';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Sparkles, Globe2, RotateCcw, ExternalLink, ArrowRight } from 'lucide-react';

interface CrossoverUniverseGraphProps {
  currentAnime: AnimeDetail;
  onNavigateToAnime: (slug: string) => void;
}

export function CrossoverUniverseGraph({
  currentAnime,
  onNavigateToAnime,
}: CrossoverUniverseGraphProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const cyRef = React.useRef<Core | null>(null);

  const [selectedConnection, setSelectedConnection] = React.useState<CrossAnimeConnection | null>(
    currentAnime.crossConnections[0] || null
  );

  React.useEffect(() => {
    if (!containerRef.current) return;

    const elements: cytoscape.ElementDefinition[] = [];

    // Central Main Anime Node
    elements.push({
      group: 'nodes',
      data: {
        id: currentAnime.slug,
        title: currentAnime.title,
        posterUrl: currentAnime.posterUrl,
        isRoot: true,
        borderColor: '#6366f1',
      },
    });

    // Connected Target Anime Nodes & Edges
    currentAnime.crossConnections.forEach((conn) => {
      elements.push({
        group: 'nodes',
        data: {
          id: conn.targetAnimeSlug,
          title: conn.targetAnimeTitle,
          posterUrl: conn.targetPosterUrl,
          isRoot: false,
          borderColor: '#ec4899',
        },
      });

      elements.push({
        group: 'edges',
        data: {
          id: conn.id,
          source: currentAnime.slug,
          target: conn.targetAnimeSlug,
          label: conn.connectionType.replace('_', ' '),
          connData: conn,
        },
      });
    });

    const cy = cytoscape({
      container: containerRef.current,
      elements: elements,
      style: [
        {
          selector: 'node',
          style: {
            'background-color': '#18181b',
            'background-image': 'data(posterUrl)',
            'background-fit': 'cover',
            'border-width': 4,
            'border-color': 'data(borderColor)',
            'width': 75,
            'height': 75,
            'label': 'data(title)',
            'color': '#f4f4f5',
            'font-family': 'Plus Jakarta Sans, sans-serif',
            'font-size': '12px',
            'font-weight': 700,
            'text-valign': 'bottom',
            'text-margin-y': 8,
            'text-background-color': '#09090b',
            'text-background-opacity': 0.85,
            'text-background-padding': '4px',
            'text-background-shape': 'roundrectangle',
          },
        },
        {
          selector: 'edge',
          style: {
            'width': 3,
            'line-color': '#a855f7',
            'line-style': 'dashed',
            'target-arrow-color': '#a855f7',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier',
            'label': 'data(label)',
            'color': '#c084fc',
            'font-size': '10px',
            'font-weight': 600,
            'text-background-color': '#18181b',
            'text-background-opacity': 0.9,
            'text-background-padding': '3px',
            'text-background-shape': 'roundrectangle',
          },
        },
      ],
      layout: {
        name: 'concentric',
        concentric: (node) => (node.data('isRoot') ? 2 : 1),
        levelWidth: () => 1,
        padding: 50,
        animate: true,
        animationDuration: 500,
      },
    });

    cy.on('tap', 'node', (evt) => {
      const slug = evt.target.id();
      if (slug !== currentAnime.slug) {
        const found = currentAnime.crossConnections.find((c) => c.targetAnimeSlug === slug);
        if (found) setSelectedConnection(found);
      }
    });

    cy.on('tap', 'edge', (evt) => {
      const connData = evt.target.data('connData');
      if (connData) setSelectedConnection(connData);
    });

    cyRef.current = cy;

    return () => {
      cy.destroy();
    };
  }, [currentAnime]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[650px] w-full">
      {/* Cytoscape Canvas (2 cols) */}
      <div className="lg:col-span-2 relative rounded-2xl border border-zinc-800 bg-zinc-950 overflow-hidden shadow-2xl">
        <div ref={containerRef} className="h-full w-full" />
        <div className="absolute top-3 left-3 z-10 flex items-center gap-2 rounded-xl bg-zinc-900/95 border border-zinc-800 p-2 text-xs font-bold text-zinc-200">
          <Globe2 className="h-4 w-4 text-purple-400" />
          <span>Multiverse & Cross-Anime Nexus Graph</span>
        </div>
      </div>

      {/* Connection Detail Inspector (1 col) */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/90 p-5 overflow-y-auto shadow-2xl flex flex-col justify-between">
        {selectedConnection ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Badge variant="what_if" className="uppercase font-bold tracking-wider">
                {selectedConnection.connectionType.replace('_', ' ')}
              </Badge>
              <span className="text-xs text-purple-400 font-mono flex items-center gap-1">
                <Sparkles className="h-3 w-3" /> Universe Synergy
              </span>
            </div>

            <div>
              <h4 className="text-lg font-bold text-white">
                {selectedConnection.title}
              </h4>
              <p className="text-xs text-zinc-400 mt-1">
                Connecting <span className="text-indigo-300 font-semibold">{currentAnime.title}</span> ↔ <span className="text-purple-300 font-semibold">{selectedConnection.targetAnimeTitle}</span>
              </p>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-3.5 space-y-2">
              <p className="text-xs leading-relaxed text-zinc-300">
                {selectedConnection.description}
              </p>
            </div>

            {selectedConnection.sharedElements.length > 0 && (
              <div className="space-y-2">
                <h5 className="text-xs uppercase tracking-wider font-bold text-zinc-400">
                  Shared Tropes & Universe Mechanics
                </h5>
                <div className="space-y-1.5">
                  {selectedConnection.sharedElements.map((elem, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 p-2 rounded-lg bg-zinc-950/40 border border-zinc-800/80 text-xs text-zinc-300"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-purple-400" />
                      <span>{elem}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Button
              variant="glow"
              size="sm"
              onClick={() => onNavigateToAnime(selectedConnection.targetAnimeSlug)}
              className="w-full gap-2 mt-4"
            >
              Explore {selectedConnection.targetAnimeTitle} <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center text-zinc-500 p-6">
            <Globe2 className="h-8 w-8 mb-2 opacity-40" />
            <p className="text-xs">Click on any connection node to view the cross-universe analysis.</p>
          </div>
        )}
      </div>
    </div>
  );
}
