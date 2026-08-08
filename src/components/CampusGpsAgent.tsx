import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Compass,
  Navigation,
  MapPin,
  Layers,
  Building,
  RotateCw,
  Footprints,
  Sparkles,
  ArrowRight,
  Clock,
  User,
  X,
  Trash2,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  RouteIcon,
  Timer,
  CornerUpRight,
} from 'lucide-react';
import {
  getCampusLocations,
  resolveSearchQuery,
  runDijkstra,
  findNearestLocation,
} from '../services/dijkstraRouter';
import type { CampusLocation, DijkstraResult, SearchResolution } from '../services/dijkstraRouter';
import { PhotorealisticCampus3D } from './PhotorealisticCampus3D';
import { Campus2DMap } from './Campus2DMap';

// Step icon map
const STEP_ICON: Record<string, string> = {
  START: '📍',
  WALK: '🚶',
  TURN_RIGHT: '↱',
  TURN_LEFT: '↰',
  STAIRS: '🪜',
  ELEVATOR: '🛗',
  DESTINATION: '🏁',
};

export const CampusGpsAgent: React.FC = () => {
  const locations = useMemo(() => getCampusLocations(), []);

  // ── SINGLE SOURCE OF TRUTH NAVIGATION STATE ──────────────────────────────
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>('loc-csm');
  const [selectedFloor, setSelectedFloor] = useState<number>(2);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>('csm-204');
  const [sourceLocationId, setSourceLocationId] = useState<string>('loc-canteen');

  // Search
  const [searchQuery, setSearchQuery] = useState<string>('CSM-204');

  // View mode (preserved on toggle)
  const [is3DMode, setIs3DMode] = useState<boolean>(true);

  // Status banner
  const [statusNotice, setStatusNotice] = useState<string | null>(
    'CSM-204 resolved: Deep Learning Lab on CSM Block (Floor 2)'
  );

  // ── STEP NAVIGATOR STATE ─────────────────────────────────────────────────
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);

  // Derived active locations
  const activeLocation = useMemo(
    () => locations.find((l) => l.id === selectedLocationId) || null,
    [locations, selectedLocationId]
  );
  const activeSourceLocation = useMemo(
    () => locations.find((l) => l.id === sourceLocationId) || locations[0],
    [locations, sourceLocationId]
  );
  const activeRoom = useMemo(() => {
    if (!activeLocation) return null;
    return activeLocation.rooms.find((r) => r.id === selectedRoomId) || activeLocation.rooms[0] || null;
  }, [activeLocation, selectedRoomId]);

  // ── DIJKSTRA ROUTE (SINGLE SOURCE OF TRUTH for 2D AND 3D) ────────────────
  const routeResult: DijkstraResult | null = useMemo(() => {
    if (!selectedLocationId || !activeLocation) return null;
    const srcNodeId = `n_${activeSourceLocation.code.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
    const dstNodeId = `n_${activeLocation.code.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
    return runDijkstra(srcNodeId, dstNodeId, {
      floor: selectedFloor,
      roomName: activeRoom?.name,
      facultyName: activeRoom?.faculty,
    });
  }, [activeSourceLocation, activeLocation, selectedLocationId, selectedFloor, activeRoom]);

  // Reset step index whenever route changes
  useEffect(() => {
    setActiveStepIndex(0);
  }, [routeResult]);

  // Count turn steps
  const turnCount = useMemo(
    () => routeResult?.steps.filter((s) => s.icon === 'TURN_LEFT' || s.icon === 'TURN_RIGHT').length ?? 0,
    [routeResult]
  );

  // ── SEARCH HANDLER ───────────────────────────────────────────────────────
  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    if (searchQuery.toLowerCase().includes('nearest')) {
      const kw = searchQuery.toLowerCase().replace('nearest', '').trim();
      const nearest = findNearestLocation(activeSourceLocation.id, kw || 'canteen');
      if (nearest) {
        setSelectedLocationId(nearest.location.id);
        setSelectedFloor(nearest.floor || 1);
        setSelectedRoomId(nearest.room?.id || null);
        setStatusNotice(`Nearest: ${nearest.location.name}`);
        return;
      }
    }

    const res: SearchResolution | null = resolveSearchQuery(searchQuery);
    if (res) {
      setSelectedLocationId(res.location.id);
      setSelectedFloor(res.floor || 1);
      setSelectedRoomId(res.room?.id || null);
      setStatusNotice(res.matchedText);
    } else {
      setStatusNotice(`"${searchQuery}" not found. Try CSM-204, Canteen, ECE, Professor Ahmed…`);
    }
  };

  // ── CLEAR ROUTE ──────────────────────────────────────────────────────────
  const handleClearRoute = () => {
    setSelectedLocationId(null);
    setSelectedRoomId(null);
    setSearchQuery('');
    setActiveStepIndex(0);
    setStatusNotice('Route cleared. All buildings returned to neutral state.');
  };

  // ── GPS LOCATION ─────────────────────────────────────────────────────────
  const handleUseGpsLocation = () => {
    if ('geolocation' in navigator) {
      setStatusNotice('Acquiring GPS coordinates…');
      navigator.geolocation.getCurrentPosition(
        () => {
          setSourceLocationId('loc-entrance');
          setStatusNotice('GPS acquired — snapped to Main Entrance.');
        },
        () => {
          setSourceLocationId('loc-entrance');
          setStatusNotice('GPS unavailable — snapped to Main Entrance.');
        }
      );
    } else {
      setSourceLocationId('loc-entrance');
      setStatusNotice('GPS unavailable — snapped to Main Entrance.');
    }
  };

  // Step navigator helpers
  const totalSteps = routeResult?.steps.length ?? 0;
  const canPrev = activeStepIndex > 0;
  const canNext = routeResult !== null && activeStepIndex < totalSteps - 1;
  const currentStep = routeResult?.steps[activeStepIndex] ?? null;

  return (
    <div className="w-full h-full flex flex-col font-mono text-slate-100 select-none space-y-4 pb-8">
      {/* ── BRAND HEADER & CONTROLS ─────────────────────────────────────── */}
      <div className="p-5 zeno-glass-card border border-blue-500/30 bg-gradient-to-r from-blue-950/40 via-slate-950 to-orange-950/30 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-[0_0_20px_rgba(0,240,255,0.3)]">
              <Compass className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-extrabold text-white">ZENO Campus GIS Navigation Engine</h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                  [LIVE_MAP: ACTIVE]
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Google Maps Style • Dijkstra Shortest Route • 3D Roads + Animated Directional Arrows • Indoor Navigation
              </p>
            </div>
          </div>

          {/* MAP MODE TOGGLE & CONTROLS */}
          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={() => setIs3DMode(false)}
              className={`px-3.5 py-2 rounded-xl font-bold text-xs transition-all flex items-center space-x-1.5 ${
                !is3DMode
                  ? 'bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(0,240,255,0.5)]'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>2D MAP</span>
            </button>

            <button
              onClick={() => setIs3DMode(true)}
              className={`px-3.5 py-2 rounded-xl font-bold text-xs transition-all flex items-center space-x-1.5 ${
                is3DMode
                  ? 'bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(0,240,255,0.5)]'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>3D DIGITAL TWIN</span>
            </button>

            <button
              onClick={() => setStatusNotice(selectedLocationId ? `View centered on ${activeLocation?.name}` : 'View centered on campus')}
              className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-xs font-bold transition-all flex items-center space-x-1"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">RECENTER</span>
            </button>

            {selectedLocationId && (
              <button
                onClick={handleClearRoute}
                className="px-3 py-2 rounded-xl bg-rose-600/20 border border-rose-500/40 hover:bg-rose-600/40 text-rose-300 text-xs font-bold transition-all flex items-center space-x-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>CLEAR ROUTE</span>
              </button>
            )}
          </div>
        </div>

        {/* SEARCH BAR */}
        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row items-center gap-3 pt-1">
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search destination (e.g. CSM-204, Professor Ahmed, Canteen, Basketball Ground, ECE)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono focus:outline-none focus:border-cyan-500"
            />
          </div>
          <button
            type="submit"
            className="w-full md:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-extrabold text-xs transition-all shadow-[0_0_15px_rgba(0,240,255,0.3)] shrink-0"
          >
            SEARCH DESTINATION ↗
          </button>
        </form>

        {/* QUICK CHIPS */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[10px]">
          <span className="text-slate-400 font-bold">Quick Destination:</span>
          {['CSM-204', 'Professor Ahmed', 'Canteen', 'Library / IT Block', 'ECE-204', 'Basketball Ground', 'Stadium', 'Hostel'].map(
            (chip, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setSearchQuery(chip);
                  const res = resolveSearchQuery(chip);
                  if (res) {
                    setSelectedLocationId(res.location.id);
                    setSelectedFloor(res.floor || 1);
                    setSelectedRoomId(res.room?.id || null);
                    setStatusNotice(res.matchedText);
                  }
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-cyan-500/20 border border-slate-800 text-slate-300 hover:text-cyan-300 transition-all"
              >
                {chip}
              </button>
            )
          )}
        </div>

        {/* STATUS BANNER */}
        {statusNotice && (
          <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-200 text-xs flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>{statusNotice}</span>
            </div>
            <button onClick={() => setStatusNotice(null)} className="text-slate-400 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* ── MAIN GIS WORKSPACE ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[620px]">

        {/* MAP VIEWPORT */}
        <div className="lg:col-span-8 h-full rounded-2xl border border-slate-800 overflow-hidden relative shadow-2xl">
          <AnimatePresence mode="wait">
            {is3DMode ? (
              <motion.div
                key="3d"
                className="w-full h-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <PhotorealisticCampus3D
                  selectedLocationId={selectedLocationId}
                  sourceLocationId={sourceLocationId}
                  onSelectBuilding={(id) => {
                    setSelectedLocationId(id);
                    const loc = locations.find((l) => l.id === id);
                    if (loc) {
                      setSelectedFloor(1);
                      setSelectedRoomId(loc.rooms[0]?.id || null);
                      setStatusNotice(`Destination: ${loc.name}`);
                    }
                  }}
                  routeResult={routeResult}
                  is3DMode={is3DMode}
                  isNavigating={false}
                  selectedFloor={selectedFloor}
                  activeStepIndex={activeStepIndex}
                />
              </motion.div>
            ) : (
              <motion.div
                key="2d"
                className="w-full h-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Campus2DMap
                  selectedLocationId={selectedLocationId}
                  sourceLocationId={sourceLocationId}
                  onSelectLocation={(id) => {
                    setSelectedLocationId(id);
                    const loc = locations.find((l) => l.id === id);
                    if (loc) {
                      setSelectedFloor(1);
                      setSelectedRoomId(loc.rooms[0]?.id || null);
                      setStatusNotice(`Destination: ${loc.name}`);
                    }
                  }}
                  routeResult={routeResult}
                  activeStepIndex={activeStepIndex}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── RIGHT CONTROL PANEL ───────────────────────────────────────── */}
        <div className="lg:col-span-4 h-full zeno-glass-card p-5 overflow-y-auto space-y-5 flex flex-col">

          {/* SOURCE SELECTOR */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold text-slate-400 flex items-center space-x-1.5">
                <MapPin className="w-3.5 h-3.5 text-teal-400" />
                <span>STARTING LOCATION (FROM):</span>
              </div>
              <button
                onClick={handleUseGpsLocation}
                className="text-[10px] text-cyan-400 hover:underline font-bold"
              >
                GPS Location
              </button>
            </div>
            <select
              value={sourceLocationId}
              onChange={(e) => setSourceLocationId(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold text-teal-300 focus:outline-none"
            >
              {locations.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  📍 {loc.name}
                </option>
              ))}
            </select>
          </div>

          {/* DESTINATION BUILDING CARD */}
          {activeLocation ? (
            <div className="space-y-4 p-4 rounded-2xl bg-slate-950 border border-blue-500/40">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div>
                  <div className="text-sm font-extrabold text-white flex items-center space-x-1.5">
                    <Building className="w-4 h-4 text-cyan-400" />
                    <span>{activeLocation.name}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{activeLocation.description}</div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                  {activeLocation.code}
                </span>
              </div>

              {/* FLOOR SELECTOR */}
              {activeLocation.floorsCount > 1 && (
                <div className="space-y-1.5">
                  <div className="text-[11px] text-slate-400 font-bold">Select Floor:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {Array.from({ length: activeLocation.floorsCount }, (_, i) => i + 1).map((fl) => (
                      <button
                        key={fl}
                        onClick={() => setSelectedFloor(fl)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                          selectedFloor === fl
                            ? 'bg-blue-600 text-white shadow-[0_0_12px_rgba(37,99,235,0.5)]'
                            : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
                        }`}
                      >
                        FLOOR {fl}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* ROOM DIRECTORY */}
              {activeLocation.rooms.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <div className="text-[11px] text-slate-400 font-bold">
                    Floor {selectedFloor} — Rooms & Faculty Cabins:
                  </div>
                  <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                    {activeLocation.rooms
                      .filter((r) => r.floor === selectedFloor)
                      .map((room) => (
                        <div
                          key={room.id}
                          onClick={() => setSelectedRoomId(room.id)}
                          className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                            selectedRoomId === room.id
                              ? 'bg-cyan-500/20 border-cyan-500 text-cyan-200 font-bold'
                              : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold">{room.name}</span>
                            <span className="text-[10px] text-slate-400">{room.type}</span>
                          </div>
                          {room.faculty && (
                            <div className="text-[10px] text-orange-300 mt-1 flex items-center space-x-1 font-mono">
                              <User className="w-3 h-3 text-orange-400" />
                              <span>Faculty Cabin: {room.faculty}</span>
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 text-center text-xs text-slate-500 italic">
              No destination selected. Click any building on the map or search above.
            </div>
          )}

          {/* ── ROUTE PANEL ───────────────────────────────────────────── */}
          {routeResult && (
            <div className="space-y-3 p-4 rounded-2xl bg-slate-950 border border-emerald-500/40 flex-1 flex flex-col">
              {/* Route header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="text-xs font-bold text-emerald-400 flex items-center space-x-1.5">
                  <Footprints className="w-4 h-4" />
                  <span>ROUTE NAVIGATION</span>
                </div>
                <span className="text-[10px] text-slate-400">{routeResult.nodesEvaluated} nodes evaluated</span>
              </div>

              {/* ── ROUTE STAT BAR ──────────────────────────────────── */}
              <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-center">
                  <div className="text-[9px] text-slate-400 mb-0.5 flex items-center justify-center space-x-0.5">
                    <RouteIcon className="w-3 h-3" /><span>Distance</span>
                  </div>
                  <div className="font-extrabold text-cyan-300">{routeResult.totalDistanceMeters}m</div>
                </div>
                <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-center">
                  <div className="text-[9px] text-slate-400 mb-0.5 flex items-center justify-center space-x-0.5">
                    <Timer className="w-3 h-3" /><span>Walk</span>
                  </div>
                  <div className="font-extrabold text-emerald-300">{routeResult.estimatedTimeMinutes} min</div>
                </div>
                <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-center">
                  <div className="text-[9px] text-slate-400 mb-0.5 flex items-center justify-center space-x-0.5">
                    <CornerUpRight className="w-3 h-3" /><span>Turns</span>
                  </div>
                  <div className="font-extrabold text-orange-300">{turnCount}</div>
                </div>
              </div>

              {/* ── TURN-BY-TURN LIST ────────────────────────────────── */}
              <div className="space-y-1 flex-1 overflow-y-auto pr-1 max-h-44">
                <div className="text-[11px] text-slate-400 font-bold mb-1">Turn-by-Turn Directions:</div>
                {routeResult.steps.map((st, idx) => (
                  <div
                    key={st.stepIndex}
                    onClick={() => setActiveStepIndex(idx)}
                    className={`p-2 rounded-xl border text-[11px] flex items-start space-x-2 font-mono cursor-pointer transition-all duration-200 ${
                      activeStepIndex === idx
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-100 shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                        : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <span className="text-base shrink-0 leading-none mt-0.5">
                      {STEP_ICON[st.icon] ?? '•'}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="truncate">{st.instruction}</div>
                      {st.distance > 0 && (
                        <div className="text-[9px] text-slate-500 mt-0.5">{st.distance}m</div>
                      )}
                    </div>
                    {activeStepIndex === idx && (
                      <span className="text-[9px] text-cyan-400 font-bold shrink-0">▶ NOW</span>
                    )}
                  </div>
                ))}
              </div>

              {/* ── PREV / NEXT STEP CONTROLS ───────────────────────── */}
              <div className="pt-2 border-t border-slate-800 space-y-2">
                {/* Current step summary */}
                {currentStep && (
                  <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-[11px] text-cyan-200 font-mono flex items-center space-x-2">
                    <span className="text-base shrink-0">{STEP_ICON[currentStep.icon] ?? '•'}</span>
                    <span className="flex-1 leading-snug">{currentStep.instruction}</span>
                  </div>
                )}

                {/* Step progress indicator */}
                <div className="flex items-center space-x-2">
                  <div className="flex-1 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-300"
                      style={{ width: totalSteps > 1 ? `${(activeStepIndex / (totalSteps - 1)) * 100}%` : '0%' }}
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono shrink-0">
                    {activeStepIndex + 1}/{totalSteps}
                  </span>
                </div>

                {/* Prev / Next buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setActiveStepIndex((i) => Math.max(0, i - 1))}
                    disabled={!canPrev}
                    className={`flex items-center justify-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                      canPrev
                        ? 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                        : 'bg-slate-900 text-slate-600 border border-slate-850 cursor-not-allowed'
                    }`}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>PREV STEP</span>
                  </button>
                  <button
                    onClick={() => setActiveStepIndex((i) => Math.min(totalSteps - 1, i + 1))}
                    disabled={!canNext}
                    className={`flex items-center justify-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                      canNext
                        ? 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                        : 'bg-slate-900 text-slate-600 border border-slate-850 cursor-not-allowed'
                    }`}
                  >
                    <span>NEXT STEP</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
