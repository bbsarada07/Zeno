import React, { useState, useMemo } from 'react';
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
  CheckCircle2,
  ShieldCheck,
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

  // View Mode
  const [is3DMode, setIs3DMode] = useState<boolean>(true);

  // Status Notice Banner
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

  // Dijkstra Route Calculation (SINGLE SOURCE OF TRUTH FOR 2D AND 3D)
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

  // Instant Search Handler
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
    } else {
      setStatusNotice(`Location "${searchQuery}" not found. Select from the 16 campus locations.`);
    }
  };

  // CLEAR ROUTE HANDLER (Returns campus to normal state)
  const handleClearRoute = () => {
    setSelectedLocationId(null);
    setSelectedRoomId(null);
    setSearchQuery('');
    setStatusNotice('Route cleared. All campus buildings returned to neutral state.');
  };

  // RECENTER HANDLER
  const handleRecenterView = () => {
    if (selectedLocationId) {
      setStatusNotice(`Recentered view on ${activeLocation?.name || 'Campus'}`);
    } else {
      setStatusNotice('Recentered view on Central Campus');
    }
  };

  // GPS GEOLOCATION HANDLER
  const handleUseGpsLocation = () => {
    if ('geolocation' in navigator) {
      setStatusNotice('Acquiring browser GPS location coordinates...');
      navigator.geolocation.getCurrentPosition(
        () => {
          setSourceLocationId('loc-entrance');
          setStatusNotice('GPS location acquired! Snapped source to Main Entrance.');
        },
        () => {
          setSourceLocationId('loc-entrance');
          setStatusNotice('GPS unavailable. Snapped source location to Main Entrance.');
        }
      );
    } else {
      setSourceLocationId('loc-entrance');
      setStatusNotice('GPS unavailable. Snapped source location to Main Entrance.');
    }
  };

  return (
    <div className="w-full h-full flex flex-col font-mono text-slate-100 select-none space-y-4 pb-8">
      {/* BRAND HEADER & CONTROLS BAR */}
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
                Google Maps Style Campus Navigation • Dijkstra Shortest Route • Building-Floor-Room Directory
              </p>
            </div>
          </div>

          {/* MAP CONTROLS: 2D/3D TOGGLE, RECENTER, CLEAR ROUTE */}
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
              onClick={handleRecenterView}
              className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-xs font-bold transition-all flex items-center space-x-1"
              title="Recenter Camera View"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">RECENTER</span>
            </button>

            {selectedLocationId && (
              <button
                onClick={handleClearRoute}
                className="px-3 py-2 rounded-xl bg-rose-600/20 border border-rose-500/40 hover:bg-rose-600/40 text-rose-300 text-xs font-bold transition-all flex items-center space-x-1"
                title="Clear Active Route & Highlight"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>CLEAR ROUTE</span>
              </button>
            )}
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

        {/* QUICK SEARCH CHIPS */}
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
                  setStatusNotice(`Selected Destination: ${loc.name}`);
                }
              }}
              routeResult={routeResult}
              is3DMode={is3DMode}
              isNavigating={false}
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
                  setStatusNotice(`Selected Destination: ${loc.name}`);
                }
              }}
              routeResult={routeResult}
            />
          )}
        </div>

        {/* RIGHT CONTROL PANEL: SOURCE, DESTINATION, FLOOR, ROOM & DIRECTIONS */}
        <div className="lg:col-span-4 h-full zeno-glass-card p-5 overflow-y-auto space-y-5 flex flex-col justify-between">
          {/* SOURCE LOCATION SELECTOR */}
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

          {/* ACTIVE DESTINATION BUILDING & FLOOR SELECTOR */}
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

              {/* ROOM & FACULTY CABIN DIRECTORY FOR SELECTED FLOOR */}
              {activeLocation.rooms.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <div className="text-[11px] text-slate-400 font-bold">
                    Floor {selectedFloor} Rooms & Faculty Cabins:
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
              No destination selected. Click any building on the map or use destination search above.
            </div>
          )}

          {/* DIJKSTRA SHORTEST PATH & TURN-BY-TURN DIRECTIONS PANEL */}
          {routeResult && (
            <div className="space-y-3 p-4 rounded-2xl bg-slate-950 border border-emerald-500/40">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="text-xs font-bold text-emerald-400 flex items-center space-x-1.5">
                  <Footprints className="w-4 h-4 text-emerald-400" />
                  <span>GOOGLE MAPS STYLE ROUTE</span>
                </div>
                <span className="text-[10px] text-slate-400">{routeResult.nodesEvaluated} Nodes Evaluated</span>
              </div>

              {/* DISTANCE & WALKING TIME */}
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="text-[10px] text-slate-400">Total Distance:</div>
                  <div className="font-extrabold text-cyan-300 text-sm">{routeResult.totalDistanceMeters} meters</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="text-[10px] text-slate-400">Est. Walk Time:</div>
                  <div className="font-extrabold text-emerald-300 text-sm">{routeResult.estimatedTimeMinutes} mins</div>
                </div>
              </div>

              {/* REAL STEP-BY-STEP DIRECTIONS LIST */}
              <div className="space-y-1.5 pt-1">
                <div className="text-[11px] text-slate-400 font-bold">Turn-by-Turn Directions:</div>
                <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                  {routeResult.steps.map((st) => (
                    <div
                      key={st.stepIndex}
                      className="p-2 rounded-xl bg-slate-900/80 border border-slate-850 text-[11px] text-slate-200 flex items-start space-x-2 font-mono"
                    >
                      <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                        {st.stepIndex}
                      </span>
                      <span>{st.instruction}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
