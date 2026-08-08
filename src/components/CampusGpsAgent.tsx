import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Compass,
  Navigation,
  MapPin,
  Layers,
  Building,
  RotateCw,
  Zap,
  CheckCircle2,
  Footprints,
  Sparkles,
  ArrowRight,
  Clock,
  User,
  Sliders,
  ChevronRight,
  X,
  Play,
  Pause,
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

export const CampusGpsAgent: React.FC = () => {
  const locations = useMemo(() => getCampusLocations(), []);

  // SINGLE SOURCE OF TRUTH NAVIGATION STATE
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>('loc-csm');
  const [selectedFloor, setSelectedFloor] = useState<number>(2);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>('csm-204');
  const [sourceLocationId, setSourceLocationId] = useState<string>('loc-canteen');

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState<string>('CSM-204');

  // View Mode & Navigation Controls
  const [is3DMode, setIs3DMode] = useState<boolean>(true);
  const [isNavigating, setIsNavigating] = useState<boolean>(false);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [statusNotice, setStatusNotice] = useState<string | null>(
    'CSM-204 resolved: Deep Learning Lab on CSM Block (Floor 2)'
  );

  // Derived Active Target Location
  const activeLocation = useMemo(
    () => locations.find((l) => l.id === selectedLocationId) || null,
    [locations, selectedLocationId]
  );

  const activeSourceLocation = useMemo(
    () => locations.find((l) => l.id === sourceLocationId) || locations[0],
    [locations, sourceLocationId]
  );

  // Active Room Details
  const activeRoom = useMemo(() => {
    if (!activeLocation) return null;
    return activeLocation.rooms.find((r) => r.id === selectedRoomId) || activeLocation.rooms[0] || null;
  }, [activeLocation, selectedRoomId]);

  // Dijkstra Route Calculation (SINGLE SOURCE OF TRUTH)
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

  // Automatic Step Sequence in 3D Animated Navigation Mode
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isNavigating && routeResult && routeResult.steps.length > 0) {
      if (currentStepIndex < routeResult.steps.length - 1) {
        timer = setTimeout(() => {
          setCurrentStepIndex((prev) => prev + 1);
        }, 2200);
      } else {
        setIsNavigating(false);
      }
    }
    return () => clearTimeout(timer);
  }, [isNavigating, currentStepIndex, routeResult]);

  // Natural Language Search Handler
  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    // Check for "nearest" query
    if (searchQuery.toLowerCase().includes('nearest')) {
      const kw = searchQuery.toLowerCase().replace('nearest', '').trim();
      const nearest = findNearestLocation(activeSourceLocation.id, kw || 'canteen');
      if (nearest) {
        setSelectedLocationId(nearest.location.id);
        setSelectedFloor(nearest.floor || 1);
        setSelectedRoomId(nearest.room?.id || null);
        setStatusNotice(`Resolved nearest facility: ${nearest.location.name}`);
        return;
      }
    }

    const res: SearchResolution | null = resolveSearchQuery(searchQuery);
    if (res) {
      setSelectedLocationId(res.location.id);
      setSelectedFloor(res.floor || 1);
      setSelectedRoomId(res.room?.id || null);
      setStatusNotice(res.matchedText);
      setIsNavigating(false);
      setCurrentStepIndex(0);
    } else {
      setStatusNotice(`Location "${searchQuery}" not found. Showing all 16 campus locations.`);
    }
  };

  // Demo Scenarios
  const runDemo = (demoType: 'canteen_csm' | 'entrance_cse' | 'canteen_ece' | 'csm_204' | 'faculty') => {
    setIsNavigating(false);
    setCurrentStepIndex(0);

    if (demoType === 'canteen_csm') {
      setSourceLocationId('loc-canteen');
      setSelectedLocationId('loc-csm');
      setSelectedFloor(2);
      setSelectedRoomId('csm-204');
      setSearchQuery('CSM-204');
      setStatusNotice('Demo: Shortest Route from Canteen → CSM Block');
    } else if (demoType === 'entrance_cse') {
      setSourceLocationId('loc-entrance');
      setSelectedLocationId('loc-cse');
      setSelectedFloor(1);
      setSelectedRoomId('cse-101');
      setSearchQuery('CSE');
      setStatusNotice('Demo: Shortest Route from Main Entrance → CSE Block');
    } else if (demoType === 'canteen_ece') {
      setSourceLocationId('loc-canteen');
      setSelectedLocationId('loc-ece');
      setSelectedFloor(2);
      setSelectedRoomId('ece-204');
      setSearchQuery('ECE-204');
      setStatusNotice('Demo: Shortest Route from Canteen → ECE-204');
    } else if (demoType === 'csm_204') {
      setSearchQuery('CSM-204');
      handleSearchSubmit();
    } else if (demoType === 'faculty') {
      setSearchQuery('Professor Ahmed');
      handleSearchSubmit();
    }
  };

  return (
    <div className="w-full h-full flex flex-col font-mono text-slate-100 select-none space-y-4 pb-8">
      {/* BRAND HEADER & SEARCH BAR BAR */}
      <div className="p-5 zeno-glass-card border border-blue-500/30 bg-gradient-to-r from-blue-950/40 via-slate-950 to-orange-950/30 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-[0_0_20px_rgba(0,240,255,0.3)]">
              <Compass className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-extrabold text-white">ZENO Campus GIS & 3D Digital Twin Engine</h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                  [GPS_AGENT: ACTIVE]
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Google Maps 3D • Dijkstra Shortest Path • Building-Floor-Room Hierarchy • Faculty Cabins
              </p>
            </div>
          </div>

          {/* 2D / 3D MAP VIEWPORT TOGGLE BUTTON */}
          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={() => setIs3DMode(false)}
              className={`px-4 py-2 rounded-xl font-bold text-xs transition-all flex items-center space-x-1.5 ${
                !is3DMode
                  ? 'bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(0,240,255,0.5)]'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>2D MAP VIEW</span>
            </button>
            <button
              onClick={() => setIs3DMode(true)}
              className={`px-4 py-2 rounded-xl font-bold text-xs transition-all flex items-center space-x-1.5 ${
                is3DMode
                  ? 'bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(0,240,255,0.5)]'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>3D DIGITAL TWIN</span>
            </button>
          </div>
        </div>

        {/* SEARCH BAR & AUTOCOMPLETE CHIPS */}
        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row items-center gap-3 pt-1">
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search building, room (e.g. CSM-204), faculty cabin (e.g. Prof. Ahmed), or facility..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono focus:outline-none focus:border-cyan-500"
            />
          </div>
          <button
            type="submit"
            className="w-full md:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-extrabold text-xs transition-all shadow-[0_0_15px_rgba(0,240,255,0.3)] shrink-0"
          >
            NAVIGATE ↗
          </button>
        </form>

        {/* QUICK SEARCH CHIPS */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[10px]">
          <span className="text-slate-400 font-bold">Quick Search:</span>
          {['CSM-204', 'Professor Ahmed', 'Canteen', 'Library / IT Block', 'ECE-204', 'Basketball Ground', 'Nearest canteen'].map(
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

        {/* STATUS NOTICE BANNER */}
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

      {/* MAIN GIS WORKSPACE (2D/3D CANVAS + RIGHT CONTROL PANEL) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[620px]">
        {/* MAP VIEWPORT CANVAS (2D OR 3D) */}
        <div className="lg:col-span-8 h-full rounded-2xl border border-slate-800 overflow-hidden relative shadow-2xl">
          {is3DMode ? (
            <PhotorealisticCampus3D
              selectedLocationId={selectedLocationId}
              sourceLocationId={sourceLocationId}
              onSelectBuilding={(id) => {
                setSelectedLocationId(id);
                const loc = locations.find((l) => l.id === id);
                if (loc) {
                  setSelectedFloor(1);
                  setSelectedRoomId(loc.rooms[0]?.id || null);
                  setStatusNotice(`Selected Location: ${loc.name}`);
                }
              }}
              routeResult={routeResult}
              is3DMode={is3DMode}
              isNavigating={isNavigating}
              selectedFloor={selectedFloor}
            />
          ) : (
            <Campus2DMap
              selectedLocationId={selectedLocationId}
              sourceLocationId={sourceLocationId}
              onSelectLocation={(id) => {
                setSelectedLocationId(id);
                const loc = locations.find((l) => l.id === id);
                if (loc) {
                  setSelectedFloor(1);
                  setSelectedRoomId(loc.rooms[0]?.id || null);
                  setStatusNotice(`Selected Location: ${loc.name}`);
                }
              }}
              routeResult={routeResult}
            />
          )}

          {/* QUICK DEMO PRESETS BAR */}
          <div className="absolute top-4 right-4 z-20 px-3 py-2 rounded-xl bg-slate-950/90 border border-slate-800 text-[10px] text-slate-300 flex items-center space-x-2 backdrop-blur-md shadow-lg">
            <span className="text-cyan-400 font-bold">DEMO MODE:</span>
            <button
              onClick={() => runDemo('canteen_csm')}
              className="px-2 py-1 rounded bg-slate-900 hover:bg-cyan-500/20 border border-slate-800 text-cyan-300 font-bold"
            >
              Canteen → CSM
            </button>
            <button
              onClick={() => runDemo('entrance_cse')}
              className="px-2 py-1 rounded bg-slate-900 hover:bg-cyan-500/20 border border-slate-800 text-cyan-300 font-bold"
            >
              Entrance → CSE
            </button>
            <button
              onClick={() => runDemo('canteen_ece')}
              className="px-2 py-1 rounded bg-slate-900 hover:bg-cyan-500/20 border border-slate-800 text-cyan-300 font-bold"
            >
              Canteen → ECE
            </button>
          </div>
        </div>

        {/* RIGHT CONTROL PANEL: BUILDING, FLOOR, ROOM & NAVIGATION DETAILS */}
        <div className="lg:col-span-4 h-full zeno-glass-card p-5 overflow-y-auto space-y-5 flex flex-col justify-between">
          {/* SOURCE LOCATION SELECTOR */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-slate-400 flex items-center space-x-1.5">
              <MapPin className="w-3.5 h-3.5 text-teal-400" />
              <span>CURRENT SOURCE LOCATION:</span>
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

          {/* ACTIVE TARGET BUILDING & FLOOR SELECTOR */}
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

              {/* FLOOR SELECTOR BUTTONS */}
              {activeLocation.floorsCount > 1 && (
                <div className="space-y-1.5">
                  <div className="text-[11px] text-slate-400 font-bold">Select Building Floor:</div>
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

              {/* ROOM & CLASSROOM DIRECTORY FOR SELECTED FLOOR */}
              {activeLocation.rooms.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <div className="text-[11px] text-slate-400 font-bold">
                    Floor {selectedFloor} Rooms & Faculty Cabins:
                  </div>
                  <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
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
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center text-xs text-slate-500 italic">
              Select a location on the 2D/3D map or use search bar.
            </div>
          )}

          {/* DIJKSTRA SHORTEST PATH & TURN-BY-TURN PANEL */}
          {routeResult && (
            <div className="space-y-3 p-4 rounded-2xl bg-slate-950 border border-emerald-500/40">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="text-xs font-bold text-emerald-400 flex items-center space-x-1.5">
                  <Footprints className="w-4 h-4 text-emerald-400" />
                  <span>DIJKSTRA SHORTEST ROUTE</span>
                </div>
                <span className="text-[10px] text-slate-400">{routeResult.nodesEvaluated} Nodes Evaluated</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="text-[10px] text-slate-400">Total Distance:</div>
                  <div className="font-extrabold text-cyan-300">{routeResult.totalDistanceMeters} meters</div>
                </div>
                <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="text-[10px] text-slate-400">Est. Walk Time:</div>
                  <div className="font-extrabold text-emerald-300">{routeResult.estimatedTimeMinutes} mins</div>
                </div>
              </div>

              {/* LIVE TURN-BY-TURN STEP DISPLAY */}
              <div className="space-y-1 pt-1">
                <div className="text-[11px] text-slate-400 font-bold flex items-center justify-between">
                  <span>Turn-by-Turn Guidance:</span>
                  <span className="text-cyan-400">
                    Step {currentStepIndex + 1} of {routeResult.steps.length}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-blue-600/20 border border-blue-500/40 text-xs font-bold text-blue-200">
                  {routeResult.steps[currentStepIndex]?.instruction || 'Route Ready.'}
                </div>
              </div>

              {/* START 3D ANIMATED NAVIGATION BUTTON */}
              <button
                onClick={() => setIsNavigating(!isNavigating)}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-extrabold text-xs transition-all shadow-[0_0_20px_rgba(16,185,129,0.4)] flex items-center justify-center space-x-2"
              >
                {isNavigating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{isNavigating ? 'PAUSE 3D NAVIGATION' : 'START 3D NAVIGATION ↗'}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
