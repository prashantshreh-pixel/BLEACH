import * as React from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  MarkerType,
  ReactFlowProvider,
  useReactFlow,
  Panel,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { motion, AnimatePresence } from 'motion/react';
import { TimelineEvent, TimelineEdgeData, Character, Arc } from '../../types';
import { EventNode } from './EventNode';
import { MemoryFragmentModal } from './MemoryFragmentModal';
import { Button } from '../ui/button';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  SkipForward, 
  SkipBack, 
  Filter, 
  GitBranch, 
  Sparkles, 
  Layers,
  ZoomIn,
  Clock,
  BookmarkCheck,
  Undo2
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface TimelineViewerInnerProps {
  events: TimelineEvent[];
  edgesData: TimelineEdgeData[];
  characters: Character[];
  arcs: Arc[];
  animeSlug?: string;
  onSelectCharacter?: (charId: string) => void;
}

const nodeTypes = {
  eventNode: EventNode,
};

function TimelineFlow({
  events,
  edgesData,
  characters,
  arcs,
  animeSlug,
  onSelectCharacter,
}: TimelineViewerInnerProps) {
  const { setCenter, fitView } = useReactFlow();

  const cacheKey = `anime_timeline_positions_${animeSlug || 'default'}`;

  // Helper to read cached positions
  const getCachedPositions = React.useCallback((): Record<string, { x: number; y: number }> => {
    try {
      const raw = localStorage.getItem(cacheKey);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      console.error('Failed to read cached positions', e);
    }
    return {};
  }, [cacheKey]);

  const [hasCustomPositions, setHasCustomPositions] = React.useState<boolean>(() => {
    try {
      return !!localStorage.getItem(cacheKey);
    } catch {
      return false;
    }
  });

  // Selected event for immersive memory dive inspection
  const [selectedEvent, setSelectedEvent] = React.useState<TimelineEvent | null>(null);
  const [isMemoryModalOpen, setIsMemoryModalOpen] = React.useState<boolean>(false);

  // Filters
  const [canonFilter, setCanonFilter] = React.useState<string>('all');
  const [typeFilter, setTypeFilter] = React.useState<string>('all');
  const [selectedBranch, setSelectedBranch] = React.useState<string>('all');

  // Simulation playback state
  const [isPlaying, setIsPlaying] = React.useState<boolean>(false);
  const [simIndex, setSimIndex] = React.useState<number>(-1);
  const [playbackSpeed, setPlaybackSpeed] = React.useState<number>(2000); // ms per step

  // Filtered Events
  const filteredEvents = React.useMemo(() => {
    return events.filter((evt) => {
      if (canonFilter !== 'all' && evt.canonType !== canonFilter) return false;
      if (typeFilter !== 'all' && evt.type !== typeFilter) return false;
      if (selectedBranch !== 'all' && evt.branchId && evt.branchId !== selectedBranch) return false;
      return true;
    });
  }, [events, canonFilter, typeFilter, selectedBranch]);

  // Distinct branches
  const branches = React.useMemo(() => {
    const set = new Set<string>();
    events.forEach((e) => {
      if (e.branchId) set.add(e.branchId);
    });
    return Array.from(set);
  }, [events]);

  // Convert events to React Flow Nodes, checking browser cache for saved positions
  const initialNodes: Node[] = React.useMemo(() => {
    const cached = getCachedPositions();
    return filteredEvents.map((evt, idx) => {
      const defaultPos = evt.position || { x: idx * 260 + 50, y: 150 };
      const finalPos = cached[evt.id] || defaultPos;
      return {
        id: evt.id,
        type: 'eventNode',
        position: finalPos,
        data: {
          event: evt,
          isSelected: selectedEvent?.id === evt.id,
          isSimulatedCurrent: simIndex >= 0 && filteredEvents[simIndex]?.id === evt.id,
          onSelectEvent: (eventToSelect: TimelineEvent) => {
            setSelectedEvent(eventToSelect);
            setIsMemoryModalOpen(true);
          },
        },
      };
    });
  }, [filteredEvents, selectedEvent, simIndex, getCachedPositions]);

  // Convert edge data to React Flow Edges
  const initialEdges: Edge[] = React.useMemo(() => {
    const validNodeIds = new Set(filteredEvents.map((e) => e.id));

    return edgesData
      .filter((edge) => validNodeIds.has(edge.source) && validNodeIds.has(edge.target))
      .map((edge) => {
        let strokeColor = '#6366f1'; // indigo
        let strokeDasharray = 'none';

        if (edge.type === 'branch') {
          strokeColor = '#a855f7'; // purple
          strokeDasharray = '5,5';
        } else if (edge.type === 'time_leap') {
          strokeColor = '#06b6d4'; // cyan
          strokeDasharray = '3,3';
        } else if (edge.type === 'merge') {
          strokeColor = '#f59e0b'; // amber
        }

        return {
          id: edge.id,
          source: edge.source,
          target: edge.target,
          label: edge.label,
          type: 'smoothstep',
          animated: edge.animated || edge.type === 'time_leap',
          style: {
            stroke: strokeColor,
            strokeWidth: 2.5,
            strokeDasharray: strokeDasharray,
          },
          labelStyle: {
            fill: '#d4d4d8',
            fontWeight: 600,
            fontSize: 11,
            backgroundColor: '#18181b',
          },
          labelBgStyle: {
            fill: '#18181b',
            fillOpacity: 0.9,
            stroke: '#27272a',
            strokeWidth: 1,
            rx: 6,
            ry: 6,
          },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: strokeColor,
            width: 16,
            height: 16,
          },
        };
      });
  }, [edgesData, filteredEvents]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Sync state when filters change
  React.useEffect(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [initialNodes, initialEdges, setNodes, setEdges]);

  // Persist dragged node positions in browser cache (localStorage)
  const handleNodeDragStop = (_: React.MouseEvent, node: Node) => {
    try {
      const cached = getCachedPositions();
      cached[node.id] = { x: node.position.x, y: node.position.y };
      localStorage.setItem(cacheKey, JSON.stringify(cached));
      setHasCustomPositions(true);
    } catch (e) {
      console.error('Failed to cache node position', e);
    }
  };

  // Reset layout to original canon coordinates
  const handleResetToCanonLayout = () => {
    try {
      localStorage.removeItem(cacheKey);
      setHasCustomPositions(false);
    } catch (e) {
      console.error('Failed to clear position cache', e);
    }
    setNodes((prevNodes) =>
      prevNodes.map((n, idx) => {
        const originalEvt = events.find((e) => e.id === n.id);
        const defaultPos = originalEvt?.position || { x: idx * 260 + 50, y: 150 };
        return {
          ...n,
          position: defaultPos,
        };
      })
    );
    fitView({ duration: 500, padding: 0.25 });
  };

  // Simulation playback ticker
  React.useEffect(() => {
    let timer: any = null;
    if (isPlaying) {
      timer = setInterval(() => {
        setSimIndex((prev) => {
          const next = prev + 1;
          if (next >= filteredEvents.length) {
            setIsPlaying(false);
            confetti({
              particleCount: 80,
              spread: 70,
              origin: { y: 0.6 },
            });
            return prev;
          }
          return next;
        });
      }, playbackSpeed);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying, playbackSpeed, filteredEvents.length]);

  // Smooth pan to active simulated node
  React.useEffect(() => {
    if (simIndex >= 0 && simIndex < filteredEvents.length) {
      const activeEvent = filteredEvents[simIndex];
      const cached = getCachedPositions();
      const pos = cached[activeEvent.id] || activeEvent.position || { x: simIndex * 260 + 50, y: 150 };
      setCenter(pos.x + 130, pos.y + 80, { zoom: 1.05, duration: 500 });
    }
  }, [simIndex, filteredEvents, setCenter, getCachedPositions]);

  const handleStartSimulation = () => {
    if (filteredEvents.length === 0) return;
    setSimIndex(0);
    setIsPlaying(true);
  };

  const handlePlayFromEvent = (evt: TimelineEvent) => {
    const idx = filteredEvents.findIndex((e) => e.id === evt.id);
    if (idx !== -1) {
      setSimIndex(idx);
      setIsPlaying(true);
    }
  };

  const handleResetSimulation = () => {
    setIsPlaying(false);
    setSimIndex(-1);
    fitView({ duration: 500, padding: 0.2 });
  };

  const handleNextStep = () => {
    setIsPlaying(false);
    setSimIndex((prev) => Math.min(filteredEvents.length - 1, prev + 1));
  };

  const handlePrevStep = () => {
    setIsPlaying(false);
    setSimIndex((prev) => Math.max(0, prev - 1));
  };

  const activeSimulatedEvent = simIndex >= 0 ? filteredEvents[simIndex] : null;

  return (
    <div className="relative h-[650px] w-full rounded-2xl border border-zinc-800 bg-zinc-950 overflow-hidden shadow-2xl">
      {/* React Flow Viewport */}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeDragStop={handleNodeDragStop}
        fitView
        fitViewOptions={{ padding: 0.25 }}
        minZoom={0.2}
        maxZoom={2}
        defaultEdgeOptions={{ type: 'smoothstep' }}
        className="touch-pan-y"
      >
        <Background color="#27272a" gap={24} size={1.2} />

        <Controls
          className="!bg-zinc-900/90 !border-zinc-800 !rounded-xl !text-zinc-200 !shadow-xl"
          showInteractive={false}
        />

        <MiniMap
          nodeColor={(node) => {
            const data = node.data as any;
            if (data?.event?.type === 'death') return '#ef4444';
            if (data?.event?.type === 'battle') return '#f43f5e';
            if (data?.event?.type === 'power_up') return '#f59e0b';
            return '#6366f1';
          }}
          maskColor="rgba(9, 9, 11, 0.75)"
          className="!bg-zinc-900/90 !border-zinc-800 !rounded-xl !overflow-hidden !shadow-2xl"
        />

        {/* Top Control Bar: Filters, Branches & Memory Position Controls */}
        <Panel position="top-left" className="m-3 flex flex-wrap items-center gap-2 max-w-[90%]">
          <div className="flex items-center gap-1.5 rounded-xl bg-zinc-900/95 border border-zinc-800 p-1.5 backdrop-blur-md shadow-xl">
            <Filter className="h-3.5 w-3.5 text-indigo-400 ml-1.5" />
            <select
              value={canonFilter}
              onChange={(e) => setCanonFilter(e.target.value)}
              className="bg-transparent text-xs text-zinc-200 font-medium px-2 py-1 outline-none cursor-pointer"
            >
              <option value="all" className="bg-zinc-900 text-zinc-100">All Canon Types</option>
              <option value="canon" className="bg-zinc-900 text-zinc-100">Canon Mainline</option>
              <option value="filler" className="bg-zinc-900 text-zinc-100">Filler Arcs</option>
              <option value="ova" className="bg-zinc-900 text-zinc-100">OVAs & Specials</option>
              <option value="movie" className="bg-zinc-900 text-zinc-100">Theatrical Movies</option>
              <option value="what_if" className="bg-zinc-900 text-zinc-100">Alternate / What-If</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 rounded-xl bg-zinc-900/95 border border-zinc-800 p-1.5 backdrop-blur-md shadow-xl">
            <Layers className="h-3.5 w-3.5 text-purple-400 ml-1.5" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-transparent text-xs text-zinc-200 font-medium px-2 py-1 outline-none cursor-pointer"
            >
              <option value="all" className="bg-zinc-900 text-zinc-100">All Event Categories</option>
              <option value="battle" className="bg-zinc-900 text-zinc-100">Major Battles</option>
              <option value="revelation" className="bg-zinc-900 text-zinc-100">Major Revelations</option>
              <option value="death" className="bg-zinc-900 text-zinc-100">Key Deaths & Sacrifices</option>
              <option value="power_up" className="bg-zinc-900 text-zinc-100">Power-Ups & Forms</option>
              <option value="timeskip" className="bg-zinc-900 text-zinc-100">Time Skips</option>
              <option value="alternate_branch" className="bg-zinc-900 text-zinc-100">Alternate Branches</option>
            </select>
          </div>

          {branches.length > 1 && (
            <div className="flex items-center gap-1.5 rounded-xl bg-zinc-900/95 border border-zinc-800 p-1.5 backdrop-blur-md shadow-xl">
              <GitBranch className="h-3.5 w-3.5 text-cyan-400 ml-1.5" />
              <select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                className="bg-transparent text-xs text-zinc-200 font-medium px-2 py-1 outline-none cursor-pointer"
              >
                <option value="all" className="bg-zinc-900 text-zinc-100">All Timeline Branches</option>
                {branches.map((b) => (
                  <option key={b} value={b} className="bg-zinc-900 text-zinc-100">
                    Branch: {b}
                  </option>
                ))}
              </select>
            </div>
          )}

          <Button
            size="sm"
            variant="secondary"
            onClick={() => fitView({ duration: 400, padding: 0.2 })}
            className="h-8 rounded-xl bg-zinc-900/90 border border-zinc-800 text-xs gap-1 shadow-lg"
          >
            <ZoomIn className="h-3.5 w-3.5 text-zinc-400" /> Fit View
          </Button>

          {/* Browser Cache Status & Layout Reset */}
          {hasCustomPositions && (
            <div className="flex items-center gap-1.5">
              <span className="flex items-center gap-1 rounded-xl bg-emerald-950/80 border border-emerald-800/60 px-2.5 py-1 text-[11px] font-medium text-emerald-300 backdrop-blur-md shadow-lg">
                <BookmarkCheck className="h-3.5 w-3.5 text-emerald-400" />
                <span>Layout Cached</span>
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={handleResetToCanonLayout}
                className="h-8 rounded-xl bg-zinc-900/90 border-zinc-700 text-zinc-300 hover:text-white text-xs gap-1 shadow-lg"
                title="Reset dragged fragments back to default positions"
              >
                <Undo2 className="h-3.5 w-3.5 text-amber-400" /> Reset Canon Positions
              </Button>
            </div>
          )}
        </Panel>

        {/* Bottom Panel: Interactive Chronology Event Simulator Playback Bar */}
        <Panel position="bottom-center" className="mb-4">
          <div className="flex flex-col items-center gap-2 rounded-2xl border border-zinc-700/80 bg-zinc-900/95 p-3 backdrop-blur-xl shadow-2xl max-w-xl w-[90vw]">
            <div className="flex items-center justify-between w-full px-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1">
                  <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                  In-Universe Chronology Simulator
                </span>
              </div>
              <span className="font-mono text-zinc-400 text-[11px]">
                {simIndex >= 0 ? `${simIndex + 1} / ${filteredEvents.length} Events` : `${filteredEvents.length} Events Loaded`}
              </span>
            </div>

            {/* Active Event Preview in Simulator */}
            {activeSimulatedEvent ? (
              <motion.div
                key={activeSimulatedEvent.id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full rounded-xl bg-zinc-950/80 border border-indigo-500/40 p-2.5 flex items-center justify-between gap-3 text-left"
              >
                <div className="overflow-hidden">
                  <div className="flex items-center gap-2 text-[11px] text-indigo-300 font-mono">
                    <Clock className="h-3 w-3" />
                    <span>{activeSimulatedEvent.dateInUniverse}</span>
                    <span>•</span>
                    <span className="text-zinc-400">{activeSimulatedEvent.arcName}</span>
                  </div>
                  <h5 className="font-bold text-sm text-zinc-100 truncate">
                    {activeSimulatedEvent.title}
                  </h5>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setSelectedEvent(activeSimulatedEvent);
                    setIsMemoryModalOpen(true);
                  }}
                  className="shrink-0 h-7 text-xs border-indigo-500/40 hover:bg-indigo-950/50 text-indigo-200"
                >
                  Dive Into Memory
                </Button>
              </motion.div>
            ) : (
              <div className="w-full text-center text-xs text-zinc-400 py-1 font-medium">
                Press Play to simulate in-universe timeline progression node by node (Drag any fragment to re-arrange; positions auto-save)
              </div>
            )}

            {/* Playback Controls */}
            <div className="flex items-center justify-between w-full pt-1">
              <div className="flex items-center gap-1.5">
                <Button
                  size="icon"
                  variant="outline"
                  onClick={handlePrevStep}
                  disabled={simIndex <= 0}
                  className="h-8 w-8 rounded-lg bg-zinc-800/80 border-zinc-700"
                  title="Previous event"
                >
                  <SkipBack className="h-3.5 w-3.5" />
                </Button>

                {isPlaying ? (
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => setIsPlaying(false)}
                    className="h-8 gap-1.5 px-3.5 rounded-lg font-bold"
                  >
                    <Pause className="h-3.5 w-3.5 fill-current" /> Pause
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="glow"
                    onClick={simIndex < 0 ? handleStartSimulation : () => setIsPlaying(true)}
                    className="h-8 gap-1.5 px-3.5 rounded-lg font-bold"
                  >
                    <Play className="h-3.5 w-3.5 fill-current" />
                    {simIndex < 0 ? 'Start Simulation' : 'Resume'}
                  </Button>
                )}

                <Button
                  size="icon"
                  variant="outline"
                  onClick={handleNextStep}
                  disabled={simIndex >= filteredEvents.length - 1}
                  className="h-8 w-8 rounded-lg bg-zinc-800/80 border-zinc-700"
                  title="Next event"
                >
                  <SkipForward className="h-3.5 w-3.5" />
                </Button>

                <Button
                  size="icon"
                  variant="ghost"
                  onClick={handleResetSimulation}
                  className="h-8 w-8 rounded-lg text-zinc-400 hover:text-white"
                  title="Reset simulator"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </Button>
              </div>

              {/* Playback Speed Toggles */}
              <div className="flex items-center gap-1 bg-zinc-800/60 rounded-lg p-0.5 border border-zinc-700/50">
                <button
                  onClick={() => setPlaybackSpeed(3000)}
                  className={`text-[10px] font-bold px-2 py-1 rounded cursor-pointer ${
                    playbackSpeed === 3000 ? 'bg-indigo-600 text-white' : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  0.7x
                </button>
                <button
                  onClick={() => setPlaybackSpeed(2000)}
                  className={`text-[10px] font-bold px-2 py-1 rounded cursor-pointer ${
                    playbackSpeed === 2000 ? 'bg-indigo-600 text-white' : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  1x
                </button>
                <button
                  onClick={() => setPlaybackSpeed(1000)}
                  className={`text-[10px] font-bold px-2 py-1 rounded cursor-pointer ${
                    playbackSpeed === 1000 ? 'bg-indigo-600 text-white' : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  2x
                </button>
              </div>
            </div>
          </div>
        </Panel>
      </ReactFlow>

      {/* Cinematic Memory Fragment Dive Modal */}
      <MemoryFragmentModal
        event={selectedEvent}
        open={isMemoryModalOpen}
        onClose={() => setIsMemoryModalOpen(false)}
        characters={characters}
        onSelectCharacter={onSelectCharacter}
        onPlayFromEvent={handlePlayFromEvent}
      />
    </div>
  );
}

export function TimelineViewer(props: TimelineViewerInnerProps) {
  return (
    <ReactFlowProvider>
      <TimelineFlow {...props} />
    </ReactFlowProvider>
  );
}

