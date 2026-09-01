import * as React from 'react';
import cytoscape, { Core, NodeSingular } from 'cytoscape';
import { Character, Faction, Relationship } from '../../types';
import { CharacterDrawer } from './CharacterDrawer';
import { Button } from '../ui/button';
import { 
  Network, 
  Search, 
  RotateCcw, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Download, 
  Filter, 
  Sparkles, 
  Eye, 
  GitFork,
  X
} from 'lucide-react';

interface RelationshipGraphProps {
  characters: Character[];
  factions: Faction[];
  relationships: Relationship[];
}

type LayoutType = 'cose' | 'breadthfirst' | 'concentric' | 'circle';

export function RelationshipGraph({
  characters,
  factions,
  relationships,
}: RelationshipGraphProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const cyRef = React.useRef<Core | null>(null);

  // States
  const [selectedCharacter, setSelectedCharacter] = React.useState<Character | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = React.useState<boolean>(false);
  const [activeLayout, setActiveLayout] = React.useState<LayoutType>('cose');
  const [selectedFaction, setSelectedFaction] = React.useState<string>('all');
  const [selectedRelType, setSelectedRelType] = React.useState<string>('all');
  const [searchQuery, setSearchQuery] = React.useState<string>('');
  const [focusedNodeId, setFocusedNodeId] = React.useState<string | null>(null);

  // Character mapping
  const charMap = React.useMemo(() => {
    const map = new Map<string, Character>();
    characters.forEach((c) => {
      map.set(c.id, c);
    });
    return map;
  }, [characters]);

  // Faction mapping
  const factionMap = React.useMemo(() => {
    const map = new Map<string, Faction>();
    factions.forEach((f) => {
      map.set(f.id, f);
    });
    return map;
  }, [factions]);

  // Filtered dataset
  const filteredCharacters = React.useMemo(() => {
    return characters.filter((c) => {
      if (selectedFaction !== 'all' && c.factionId !== selectedFaction) return false;
      return true;
    });
  }, [characters, selectedFaction]);

  const filteredRelationships = React.useMemo(() => {
    const validCharIds = new Set(filteredCharacters.map((c) => c.id));
    return relationships.filter((r) => {
      if (!validCharIds.has(r.source) || !validCharIds.has(r.target)) return false;
      if (selectedRelType !== 'all' && r.type !== selectedRelType) return false;
      return true;
    });
  }, [relationships, filteredCharacters, selectedRelType]);

  // Initialize and update Cytoscape instance
  React.useEffect(() => {
    if (!containerRef.current) return;

    // Build elements
    const elements: cytoscape.ElementDefinition[] = [];

    // Add Character Nodes
    filteredCharacters.forEach((char) => {
      const faction = factionMap.get(char.factionId);
      const factionColor = faction?.color || '#6366f1';

      elements.push({
        group: 'nodes',
        data: {
          id: char.id,
          name: char.name,
          role: char.role,
          faction: char.factionName,
          factionColor: factionColor,
          avatarUrl: char.avatarUrl,
        },
      });
    });

    // Add Relationship Edges
    filteredRelationships.forEach((rel) => {
      let edgeColor = '#818cf8';
      let lineStyle: 'solid' | 'dashed' | 'dotted' = 'solid';

      switch (rel.type) {
        case 'enemy':
          edgeColor = '#ef4444';
          break;
        case 'rival':
          edgeColor = '#f59e0b';
          lineStyle = 'dashed';
          break;
        case 'romantic':
          edgeColor = '#ec4899';
          break;
        case 'mentor_student':
          edgeColor = '#10b981';
          break;
        case 'family':
          edgeColor = '#06b6d4';
          break;
      }

      elements.push({
        group: 'edges',
        data: {
          id: rel.id,
          source: rel.source,
          target: rel.target,
          label: rel.label,
          relType: rel.type,
          edgeColor: edgeColor,
          lineStyle: lineStyle,
        },
      });
    });

    // Initialize Cytoscape
    const cy = cytoscape({
      container: containerRef.current,
      elements: elements,
      boxSelectionEnabled: false,
      autounselectify: false,
      style: [
        {
          selector: 'node',
          style: {
            'background-color': '#18181b',
            'background-image': 'data(avatarUrl)',
            'background-fit': 'cover',
            'border-width': 3,
            'border-color': 'data(factionColor)',
            'width': 54,
            'height': 54,
            'label': 'data(name)',
            'color': '#f4f4f5',
            'font-family': 'Plus Jakarta Sans, sans-serif',
            'font-size': 11,
            'font-weight': 600,
            'text-valign': 'bottom',
            'text-margin-y': 6,
            'text-background-color': '#09090b',
            'text-background-opacity': 0.85,
            'text-background-padding': 3,
            'text-background-shape': 'roundrectangle',
          } as any,
        },
        {
          selector: 'node:selected',
          style: {
            'border-color': '#ffffff',
            'border-width': 4,
            'width': 64,
            'height': 64,
            'overlay-color': '#6366f1',
            'overlay-padding': 6,
            'overlay-opacity': 0.3,
          } as any,
        },
        {
          selector: 'edge',
          style: {
            'width': 2.5,
            'line-color': 'data(edgeColor)',
            'target-arrow-color': 'data(edgeColor)',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier',
            'label': 'data(label)',
            'color': '#a1a1aa',
            'font-size': 9,
            'font-weight': 500,
            'text-background-color': '#18181b',
            'text-background-opacity': 0.9,
            'text-background-padding': 2,
            'text-background-shape': 'roundrectangle',
            'text-rotation': 'autorotate',
            'opacity': 0.8,
          } as any,
        },
        {
          selector: '.highlighted',
          style: {
            'opacity': 1,
            'z-index': 999,
          } as any,
        },
        {
          selector: '.dimmed',
          style: {
            'opacity': 0.15,
            'z-index': 1,
          } as any,
        },
        {
          selector: 'node.focused',
          style: {
            'border-color': '#38bdf8',
            'border-width': 5,
            'width': 68,
            'height': 68,
            'overlay-color': '#38bdf8',
            'overlay-padding': 8,
            'overlay-opacity': 0.4,
          } as any,
        },
      ],
    });

    cyRef.current = cy;

    // Apply layout
    const runLayout = () => {
      let layoutOptions: cytoscape.LayoutOptions;
      if (activeLayout === 'breadthfirst') {
        layoutOptions = {
          name: 'breadthfirst',
          directed: true,
          padding: 50,
          spacingFactor: 1.2,
          animate: true,
          animationDuration: 500,
        };
      } else if (activeLayout === 'concentric') {
        layoutOptions = {
          name: 'concentric',
          padding: 50,
          animate: true,
          animationDuration: 500,
        };
      } else if (activeLayout === 'circle') {
        layoutOptions = {
          name: 'circle',
          padding: 50,
          animate: true,
          animationDuration: 500,
        };
      } else {
        layoutOptions = {
          name: 'cose',
          padding: 50,
          nodeRepulsion: () => 6500,
          idealEdgeLength: () => 100,
          edgeElasticity: () => 100,
          nestingFactor: 5,
          gravity: 80,
          numIter: 1000,
          animate: true,
          animationDuration: 500,
        };
      }
      cy.layout(layoutOptions).run();
    };

    runLayout();

    // Node click handler: Focus and highlight neighborhood
    cy.on('tap', 'node', (evt) => {
      const node = evt.target as NodeSingular;
      const charId = node.id();
      const character = charMap.get(charId);

      setFocusedNodeId(charId);
      if (character) {
        setSelectedCharacter(character);
      }

      // Highlight logic
      cy.elements().removeClass('highlighted dimmed focused');
      node.addClass('focused');

      const neighborhood = node.neighborhood();
      node.addClass('highlighted');
      neighborhood.addClass('highlighted');

      cy.elements().difference(node.union(neighborhood)).addClass('dimmed');
    });

    // Node double click: open sheet immediately
    cy.on('dbltap', 'node', (evt) => {
      const charId = (evt.target as NodeSingular).id();
      const character = charMap.get(charId);
      if (character) {
        setSelectedCharacter(character);
        setIsDrawerOpen(true);
      }
    });

    // Background click: reset focus
    cy.on('tap', (evt) => {
      if (evt.target === cy) {
        setFocusedNodeId(null);
        cy.elements().removeClass('highlighted dimmed focused');
      }
    });

    return () => {
      cy.destroy();
    };
  }, [filteredCharacters, filteredRelationships, activeLayout, charMap, factionMap]);

  // Search filter
  const handleSearchFocus = (charId: string) => {
    if (!cyRef.current) return;
    const cy = cyRef.current;
    const targetNode = cy.getElementById(charId);
    if (targetNode.length > 0) {
      setFocusedNodeId(charId);
      const character = charMap.get(charId);
      if (character) setSelectedCharacter(character);

      cy.elements().removeClass('highlighted dimmed focused');
      targetNode.addClass('focused');
      const neighborhood = targetNode.neighborhood();
      targetNode.addClass('highlighted');
      neighborhood.addClass('highlighted');
      cy.elements().difference(targetNode.union(neighborhood)).addClass('dimmed');

      cy.animate({
        center: { eles: targetNode },
        zoom: 1.4,
        duration: 400,
      });
    }
  };

  const handleResetZoom = () => {
    if (cyRef.current) {
      setFocusedNodeId(null);
      cyRef.current.elements().removeClass('highlighted dimmed focused');
      cyRef.current.animate({
        fit: { eles: cyRef.current.elements(), padding: 40 },
        duration: 400,
      });
    }
  };

  const handleExportPNG = () => {
    if (!cyRef.current) return;
    const png64 = cyRef.current.png({ full: true, bg: '#09090b', scale: 2 });
    const link = document.createElement('a');
    link.download = `character-network-graph.png`;
    link.href = png64;
    link.click();
  };

  // Compute relationships for selected character
  const characterDirectRelationships = React.useMemo(() => {
    if (!selectedCharacter) return [];
    const direct: { rel: Relationship; otherChar: Character }[] = [];

    relationships.forEach((rel) => {
      if (rel.source === selectedCharacter.id) {
        const other = charMap.get(rel.target);
        if (other) direct.push({ rel, otherChar: other });
      } else if (rel.target === selectedCharacter.id) {
        const other = charMap.get(rel.source);
        if (other) direct.push({ rel, otherChar: other });
      }
    });

    return direct;
  }, [selectedCharacter, relationships, charMap]);

  return (
    <div className="relative h-[650px] w-full rounded-2xl border border-zinc-800 bg-zinc-950 overflow-hidden shadow-2xl flex flex-col">
      {/* Cytoscape Canvas */}
      <div ref={containerRef} className="h-full w-full bg-zinc-950/90" />

      {/* Top Left Control Bar: Layouts & Filters */}
      <div className="absolute top-3 left-3 z-10 flex flex-wrap items-center gap-2 max-w-[85%]">
        {/* Layout Switcher */}
        <div className="flex items-center gap-1.5 rounded-xl bg-zinc-900/95 border border-zinc-800 p-1.5 backdrop-blur-md shadow-xl">
          <GitFork className="h-3.5 w-3.5 text-indigo-400 ml-1.5" />
          <select
            value={activeLayout}
            onChange={(e) => setActiveLayout(e.target.value as LayoutType)}
            className="bg-transparent text-xs text-zinc-200 font-medium px-2 py-1 outline-none cursor-pointer"
          >
            <option value="cose" className="bg-zinc-900 text-zinc-100">Force-Directed (Spring Web)</option>
            <option value="breadthfirst" className="bg-zinc-900 text-zinc-100">Hierarchical (Org Lineage)</option>
            <option value="concentric" className="bg-zinc-900 text-zinc-100">Concentric (Power Tiers)</option>
            <option value="circle" className="bg-zinc-900 text-zinc-100">Circular Orbital</option>
          </select>
        </div>

        {/* Faction Filter */}
        <div className="flex items-center gap-1.5 rounded-xl bg-zinc-900/95 border border-zinc-800 p-1.5 backdrop-blur-md shadow-xl">
          <Filter className="h-3.5 w-3.5 text-emerald-400 ml-1.5" />
          <select
            value={selectedFaction}
            onChange={(e) => setSelectedFaction(e.target.value)}
            className="bg-transparent text-xs text-zinc-200 font-medium px-2 py-1 outline-none cursor-pointer"
          >
            <option value="all" className="bg-zinc-900 text-zinc-100">All Factions</option>
            {factions.map((f) => (
              <option key={f.id} value={f.id} className="bg-zinc-900 text-zinc-100">
                {f.name}
              </option>
            ))}
          </select>
        </div>

        {/* Relationship Type Filter */}
        <div className="flex items-center gap-1.5 rounded-xl bg-zinc-900/95 border border-zinc-800 p-1.5 backdrop-blur-md shadow-xl">
          <Network className="h-3.5 w-3.5 text-amber-400 ml-1.5" />
          <select
            value={selectedRelType}
            onChange={(e) => setSelectedRelType(e.target.value)}
            className="bg-transparent text-xs text-zinc-200 font-medium px-2 py-1 outline-none cursor-pointer"
          >
            <option value="all" className="bg-zinc-900 text-zinc-100">All Ties</option>
            <option value="ally" className="bg-zinc-900 text-zinc-100">Allies & Comrades</option>
            <option value="enemy" className="bg-zinc-900 text-zinc-100">Enemies & Foes</option>
            <option value="rival" className="bg-zinc-900 text-zinc-100">Rivals</option>
            <option value="mentor_student" className="bg-zinc-900 text-zinc-100">Mentor & Student</option>
            <option value="family" className="bg-zinc-900 text-zinc-100">Family & Lineage</option>
            <option value="romantic" className="bg-zinc-900 text-zinc-100">Romantic Ties</option>
          </select>
        </div>
      </div>

      {/* Top Right Controls: Character Search & Actions */}
      <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
        <div className="relative flex items-center rounded-xl bg-zinc-900/95 border border-zinc-800 px-3 py-1.5 shadow-xl backdrop-blur-md">
          <Search className="h-3.5 w-3.5 text-zinc-400 mr-2" />
          <input
            type="text"
            placeholder="Find character..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent text-xs text-zinc-100 placeholder-zinc-500 outline-none w-28 sm:w-36 font-medium"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="text-zinc-500 hover:text-zinc-300">
              <X className="h-3 w-3" />
            </button>
          )}

          {/* Quick autocomplete dropdown */}
          {searchQuery.trim() && (
            <div className="absolute top-10 right-0 w-48 rounded-xl bg-zinc-900 border border-zinc-800 shadow-2xl p-1.5 max-h-48 overflow-y-auto z-50">
              {characters
                .filter((c) => c.name.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      handleSearchFocus(c.id);
                      setSearchQuery('');
                    }}
                    className="w-full flex items-center gap-2 p-1.5 rounded-lg hover:bg-zinc-800 text-left text-xs text-zinc-200 cursor-pointer"
                  >
                    <img src={c.avatarUrl} alt={c.name} className="h-5 w-5 rounded-full object-cover" />
                    <span className="truncate">{c.name}</span>
                  </button>
                ))}
            </div>
          )}
        </div>

        <Button
          size="icon"
          variant="outline"
          onClick={handleResetZoom}
          className="h-9 w-9 rounded-xl bg-zinc-900/90 border-zinc-800"
          title="Reset Graph Zoom"
        >
          <RotateCcw className="h-3.5 w-3.5 text-zinc-300" />
        </Button>

        <Button
          size="icon"
          variant="outline"
          onClick={handleExportPNG}
          className="h-9 w-9 rounded-xl bg-zinc-900/90 border-zinc-800"
          title="Export Network Diagram"
        >
          <Download className="h-3.5 w-3.5 text-zinc-300" />
        </Button>
      </div>

      {/* Bottom Floating Info Pill for Selected Node */}
      {selectedCharacter && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-3 rounded-2xl border border-indigo-500/50 bg-zinc-900/95 px-4 py-2.5 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-bottom-2">
          <img
            src={selectedCharacter.avatarUrl}
            alt={selectedCharacter.name}
            className="h-9 w-9 rounded-full object-cover border border-indigo-400 shrink-0"
          />
          <div className="overflow-hidden max-w-[200px] sm:max-w-xs text-left">
            <h6 className="font-bold text-xs text-zinc-100 truncate">
              {selectedCharacter.name}
            </h6>
            <p className="text-[11px] text-zinc-400 truncate">
              {selectedCharacter.factionName} • {characterDirectRelationships.length} direct ties
            </p>
          </div>
          <Button
            size="sm"
            variant="default"
            onClick={() => setIsDrawerOpen(true)}
            className="h-7 text-xs px-3 rounded-lg gap-1 shrink-0 ml-1"
          >
            <Eye className="h-3 w-3" /> Full Profile
          </Button>
        </div>
      )}

      {/* Character Profile Drawer */}
      <CharacterDrawer
        character={selectedCharacter}
        faction={selectedCharacter ? factionMap.get(selectedCharacter.factionId) : null}
        relationships={characterDirectRelationships}
        open={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        onSelectRelatedCharacter={(charId) => {
          handleSearchFocus(charId);
        }}
      />
    </div>
  );
}
