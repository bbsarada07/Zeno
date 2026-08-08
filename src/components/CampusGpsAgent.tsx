import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  Navigation,
  Compass,
  Search,
  Building,
  RotateCw,
  Layers,
  Zap,
  CheckCircle2,
  Footprints,
  Sliders,
  ChevronRight,
  Sparkles,
  ArrowRight,
  Clock,
  Accessibility,
  Crosshair,
  User,
  X,
} from 'lucide-react';
import campusData from '../data/campusData.json';
import { runDijkstra, resolveClassroomQuery } from '../services/dijkstraRouter';
import type { DijkstraResult, ClassroomMatch, GraphNode } from '../services/dijkstraRouter';

export const CampusGpsAgent: React.FC = () => {
  // Navigation State
  const [sourceNodeId, setSourceNodeId] = useState<string>('n_canteen_ent'); // Default: Canteen
  const [destinationQuery, setDestinationQuery] = useState<string>('ECE-204');
  const [selectedClassroom, setSelectedClassroom] = useState<ClassroomMatch | null>(
    resolveClassroomQuery('ECE-204')
  );

  const [accessibilityMode, setAccessibilityMode] = useState<boolean>(false);
  const [routeResult, setRouteResult] = useState<DijkstraResult | null>(null);

  // 3D Map Viewport Camera Controls
  const [pitchAngle, setPitchAngle] = useState<number>(55);
  const [bearingAngle, setBearingAngle] = useState<number>(20);
  const [zoomLevel, setZoomLevel] = useState<number>(1.2);
  const [is3DMode, setIs3DMode] = useState<boolean>(true);

  // Selected Building Drawer State
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>('bldg-ece');

  // Navigation Status
  const [isNavigating, setIsNavigating] = useState<boolean>(false);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [gpsStatusNotice, setGpsStatusNotice] = useState<string | null>(null);

  // Available Current Location Options
  const currentLocationOptions = [
    { id: 'n_gate', label: 'Main Entrance Gate' },
    { id: 'n_canteen_ent', label: 'Campus Canteen' },
    { id: 'n_admin_ent', label: 'Admin Block Ground Floor' },
    { id: 'n_lib_ent', label: 'Central Library' },
    { id: 'n_ece_ent', label: 'ECE Block Main Lobby' },
    { id: 'n_csm_ent', label: 'CSM Block Entrance' },
    { id: 'n_it_ent', label: 'IT Block Ground Floor' },
  ];

  // Run Dijkstra Shortest Path Engine
  const calculateRoute = (srcId: string = sourceNodeId, destNodeId: string = selectedClassroom?.nodeId || 'n_ece_204') => {
    const res = runDijkstra(srcId, destNodeId, { accessibleOnly: accessibilityMode });
    setRouteResult(res);
    setIsNavigating(false);
    setCurrentStepIndex(0);
  };

  // Run Initial Route Calculation
  useEffect(() => {
    calculateRoute();
  }, [sourceNodeId, selectedClassroom, accessibilityMode]);

  // Handle Search Input Change
  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const match = resolveClassroomQuery(destinationQuery);
    if (match) {
      setSelectedClassroom(match);
      setSelectedBlockId(campusData.blocks.find((b) => b.name === match.block)?.id || null);
      calculateRoute(sourceNodeId, match.nodeId);
      setGpsStatusNotice(`Classroom resolved: ${match.name} on ${match.block} (Floor ${match.floor})`);
    } else {
      setGpsStatusNotice(`Could not resolve exact room "${destinationQuery}". Showing nearest block match.`);
    }
  };

  // Browser Geolocation GPS Handler
  const handleUseGpsLocation = () => {
    if ('geolocation' in navigator) {
      setGpsStatusNotice('Acquiring campus GPS location coordinates...');
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setSourceNodeId('n_gate'); // Snapped to campus gate node
          setGpsStatusNotice('Campus GPS acquired! Snapped location to Main Campus Entrance Gate.');
        },
        (_err) => {
          setSourceNodeId('n_admin_ent');
          setGpsStatusNotice('Campus GPS unavailable or denied. Defaulted to Admin Block Entrance.');
        }
      );
    } else {
      setSourceNodeId('n_admin_ent');
      setGpsStatusNotice('Geolocation API not supported in browser. Select current location manually.');
    }
  };

  // Start Live 3D Navigation Simulation
  const startNavigationMode = () => {
    setIsNavigating(true);
    setCurrentStepIndex(0);
    setPitchAngle(60);
    setZoomLevel(1.5);
  };

  const selectedBlock = campusData.blocks.find((b) => b.id === selectedBlockId);

  return (
    <div className="space-y-6 font-sans select-none text-slate-100 pb-16">
      {/* BRAND HEADER & CAMPUS GPS AGENT TITLE BAR */}
      <div className="p-6 zeno-glass-card border border-cyan-500/30 bg-gradient-to-r from-slate-950 via-[#071120] to-blue-950/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-[0_0_20px_rgba(0,240,255,0.3)]">
              <Navigation className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-extrabold text-white">ZENO Campus GPS Agent</h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                  DIJKSTRA ROUTER ACTIVE
                </span>
              </div>
              <p className="text-xs text-slate-300 font-mono mt-0.5">
                Google Maps-Style Indoor/Outdoor Campus Navigation • 3D Campus Mind-Map • Dijkstra Shortest Path
              </p>
            </div>
          </div>

          {/* Accessibility Toggle & GPS Button */}
          <div className="flex items-center space-x-2 font-mono text-xs shrink-0">
            <button
              onClick={() => setAccessibilityMode(!accessibilityMode)}
              className={`px-3 py-2 rounded-xl border font-bold transition-all flex items-center space-x-1.5 ${
                accessibilityMode
                  ? 'bg-purple-600 text-white border-purple-400 shadow-[0_0_12px_rgba(168,85,247,0.4)]'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              <Accessibility className="w-4 h-4" />
              <span>{accessibilityMode ? '♿ Accessible Route ON' : '♿ Accessible Route'}</span>
            </button>

            <button
              onClick={handleUseGpsLocation}
              className="px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold transition-all shadow-[0_0_15px_rgba(0,240,255,0.4)] flex items-center space-x-1.5"
            >
              <Crosshair className="w-4 h-4" />
              <span>Use Campus GPS</span>
            </button>
          </div>
        </div>

        {/* GPS Status Notice Bar */}
        {gpsStatusNotice && (
          <div className="mt-4 p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-cyan-400 shrink-0 fill-cyan-400" />
              <span>{gpsStatusNotice}</span>
            </div>
            <button onClick={() => setGpsStatusNotice(null)} className="text-xs text-slate-400 hover:text-white underline">
              Dismiss
            </button>
          </div>
        )}
      </div>

      {/* GOOGLE MAPS-STYLE CONTROLS HEADER BAR */}
      <div className="p-5 zeno-glass-card border border-slate-800 space-y-4 font-mono">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          {/* Current Location Selector */}
          <div className="md:col-span-5 space-y-1 text-xs">
            <label className="text-slate-400 font-bold flex items-center space-x-1">
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              <span>📍 CURRENT LOCATION:</span>
            </label>
            <select
              value={sourceNodeId}
              onChange={(e) => setSourceNodeId(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold focus:outline-none focus:border-cyan-500/50"
            >
              {currentLocationOptions.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Destination Natural Language Search Bar */}
          <div className="md:col-span-7 space-y-1 text-xs">
            <label className="text-slate-400 font-bold flex items-center space-x-1">
              <Search className="w-3.5 h-3.5 text-emerald-400" />
              <span>🔎 DESTINATION CLASSROOM / BLOCK:</span>
            </label>
            <form onSubmit={handleSearchSubmit} className="flex items-center space-x-2">
              <input
                type="text"
                value={destinationQuery}
                onChange={(e) => setDestinationQuery(e.target.value)}
                placeholder="Search 'ECE 204', 'CSM lab', 'Library', 'AIC'..."
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 font-bold focus:outline-none focus:border-emerald-500/50"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs shrink-0 shadow-[0_0_12px_rgba(16,185,129,0.4)] transition-all"
              >
                Find Route
              </button>
            </form>
          </div>
        </div>

        {/* Quick Location Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pt-1 text-xs">
          <span className="text-slate-400 font-bold shrink-0">Quick Search:</span>
          {['ECE-204', 'CSM Lab 204', 'Central Library', 'Campus Canteen', 'IT-204', 'AIC Block'].map((chip, idx) => (
            <button
              key={idx}
              onClick={() => {
                setDestinationQuery(chip);
                const match = resolveClassroomQuery(chip);
                if (match) {
                  setSelectedClassroom(match);
                  calculateRoute(sourceNodeId, match.nodeId);
                }
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-cyan-500/20 border border-slate-800 hover:border-cyan-500/40 text-slate-300 font-bold shrink-0 transition-all text-[11px]"
            >
              {chip}
            </button>
          ))}
        </div>
      </div>

      {/* MAIN WORKSPACE GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 font-mono">
        {/* LEFT COLUMN: UNIFIED 3D CAMPUS MIND-MAP (VISUAL CENTERPIECE) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="zeno-glass-card p-4 space-y-3 relative overflow-hidden">
            {/* 3D Map Header Controls */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Building className="w-4 h-4 text-cyan-400" />
                <h3 className="font-extrabold text-sm uppercase tracking-wider text-white">Unified 3D Campus Mind-Map Visualizer</h3>
              </div>

              <div className="flex items-center space-x-2 text-xs">
                <button
                  onClick={() => setIs3DMode(!is3DMode)}
                  className={`px-2.5 py-1 rounded-xl border text-[10px] font-bold ${
                    is3DMode ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' : 'bg-slate-900 text-slate-400 border-slate-800'
                  }`}
                >
                  {is3DMode ? '3D Extruded' : '2D Flat'}
                </button>

                <button
                  onClick={() => setBearingAngle((prev) => (prev + 45) % 360)}
                  title="Rotate Bearing Angle"
                  className="p-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
                >
                  <Compass className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* 3D MAP CANVAS SIMULATION */}
            <div
              className="w-full h-[480px] rounded-2xl bg-[#030712] border border-slate-800 relative overflow-hidden flex items-center justify-center select-none"
              style={{ perspective: '1000px' }}
            >
              {/* Radial Grid Background */}
              <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />

              {/* 3D Extruded Campus Buildings Layer */}
              <div
                className="w-full h-full relative transition-transform duration-500 flex items-center justify-center"
                style={{
                  transform: `rotateX(${is3DMode ? pitchAngle : 0}deg) rotateZ(${is3DMode ? bearingAngle : 0}deg) scale(${zoomLevel})`,
                  transformStyle: 'preserve-3d',
                }}
              >
                {/* SVG Walkways & Calculated Dijkstra Route Path */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 600 400">
                  <path
                    d="M 80 300 L 220 280 L 320 200 L 450 120 M 220 280 L 150 180 M 320 200 L 400 300"
                    stroke="#334155"
                    strokeWidth="3"
                    strokeDasharray="6 6"
                    fill="none"
                  />
                  {routeResult && (
                    <path
                      d="M 220 280 L 320 200 L 150 180"
                      stroke="#00F0FF"
                      strokeWidth="6"
                      fill="none"
                      className="animate-pulse"
                      filter="drop-shadow(0 0 10px rgba(0,240,255,0.8))"
                    />
                  )}
                </svg>

                {/* Extruded 3D Campus Blocks */}
                {campusData.blocks.map((bldg) => {
                  const isTarget = selectedClassroom?.block === bldg.name;
                  const isSelected = selectedBlockId === bldg.id;

                  return (
                    <div
                      key={bldg.id}
                      onClick={() => setSelectedBlockId(bldg.id)}
                      className={`absolute transition-all cursor-pointer group flex flex-col items-center justify-center p-3 rounded-2xl border backdrop-blur-md shadow-2xl ${
                        isTarget
                          ? 'border-emerald-400 bg-emerald-500/20 text-white shadow-[0_0_30px_rgba(16,185,129,0.5)] scale-105'
                          : isSelected
                          ? 'border-cyan-400 bg-cyan-500/20 text-white shadow-[0_0_20px_rgba(0,240,255,0.4)]'
                          : 'border-slate-800 bg-slate-950/80 text-slate-300 hover:border-cyan-500/50'
                      }`}
                      style={{
                        width: '105px',
                        height: '75px',
                        top: bldg.id.includes('ece') ? '40%' : bldg.id.includes('admin') ? '25%' : bldg.id.includes('canteen') ? '65%' : bldg.id.includes('csm') ? '20%' : '15%',
                        left: bldg.id.includes('ece') ? '25%' : bldg.id.includes('admin') ? '45%' : bldg.id.includes('canteen') ? '55%' : bldg.id.includes('csm') ? '70%' : '15%',
                        transform: `translateZ(${is3DMode ? bldg.heightMeters * 1.2 : 0}px)`,
                      }}
                    >
                      <Building className="w-4 h-4 mb-1" style={{ color: bldg.color }} />
                      <div className="text-[10px] font-mono font-extrabold text-white text-center leading-tight">
                        {bldg.name}
                      </div>
                      <div className="text-[8px] font-mono text-slate-400">{bldg.floorsCount} Floors</div>

                      {isTarget && (
                        <span className="mt-1 px-1.5 py-0.5 rounded text-[8px] font-bold bg-emerald-500 text-slate-950 animate-bounce">
                          TARGET
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Recenter & Map Controls Overlay */}
              <div className="absolute bottom-4 left-4 bg-slate-950/90 border border-slate-800 rounded-2xl p-2 font-mono text-xs flex items-center space-x-2 z-20">
                <button
                  onClick={() => {
                    setPitchAngle(55);
                    setBearingAngle(20);
                    setZoomLevel(1.2);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white font-bold"
                >
                  Re-center Map
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: DIJKSTRA TELEMETRY & TURN-BY-TURN GUIDANCE */}
        <div className="lg:col-span-4 space-y-4">
          {/* DIJKSTRA ALGORITHM TELEMETRY CARD */}
          {routeResult && (
            <div className="zeno-glass-card p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-extrabold text-sm uppercase tracking-wider text-white flex items-center space-x-2">
                  <Zap className="w-4 h-4 text-cyan-400" />
                  <span>Dijkstra Shortest Path Telemetry</span>
                </h3>
                <span className="text-[10px] text-cyan-400 font-bold">COMPUTED</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-850 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Source:</span>
                  <span className="font-bold text-white">{routeResult.sourceName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Destination:</span>
                  <span className="font-bold text-emerald-400">{routeResult.destName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Nodes Evaluated:</span>
                  <span className="font-bold text-purple-400">{routeResult.nodesEvaluated} Graph Nodes</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-[9px] text-slate-400">Distance</div>
                  <div className="font-bold text-cyan-400 mt-0.5">{routeResult.totalDistanceMeters} m</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-[9px] text-slate-400">Est. Walk</div>
                  <div className="font-bold text-emerald-400 mt-0.5">{routeResult.estimatedTimeMinutes} min</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-[9px] text-slate-400">Stairs</div>
                  <div className="font-bold text-amber-400 mt-0.5">{routeResult.floorChanges}</div>
                </div>
              </div>

              <button
                onClick={startNavigationMode}
                className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs transition-all shadow-[0_0_15px_rgba(16,185,129,0.4)] flex items-center justify-center space-x-2"
              >
                <Navigation className="w-4 h-4 fill-slate-950" />
                <span>START 3D NAVIGATION</span>
              </button>
            </div>
          )}

          {/* BUILDING DIRECTORY & ROOM FINDER DRAWER */}
          {selectedBlock && (
            <div className="zeno-glass-card p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-extrabold text-sm uppercase tracking-wider text-white flex items-center space-x-2">
                  <Building className="w-4 h-4 text-purple-400" />
                  <span>{selectedBlock.name} Directory</span>
                </h3>
                <span className="text-[10px] text-purple-400 font-bold">{selectedBlock.floorsCount} FLOORS</span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="text-slate-400 font-bold">Classroom Directory:</div>
                <div className="grid grid-cols-2 gap-1.5">
                  {selectedBlock.classrooms.map((rm) => (
                    <button
                      key={rm.id}
                      onClick={() => {
                        setDestinationQuery(rm.name);
                        const match = resolveClassroomQuery(rm.name);
                        if (match) {
                          setSelectedClassroom(match);
                          calculateRoute(sourceNodeId, match.nodeId);
                        }
                      }}
                      className="p-2 rounded-xl bg-slate-950 hover:bg-purple-500/20 border border-slate-800 hover:border-purple-500/40 text-left transition-all"
                    >
                      <div className="font-bold text-white text-[11px]">{rm.name}</div>
                      <div className="text-[9px] text-slate-400">Floor {rm.floor} • {rm.type}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TURN-BY-TURN NAVIGATION DRAWER */}
          {isNavigating && routeResult && (
            <div className="zeno-glass-card p-5 space-y-4 border border-emerald-500/40">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-extrabold text-sm uppercase tracking-wider text-white flex items-center space-x-2">
                  <Footprints className="w-4 h-4 text-emerald-400 animate-pulse" />
                  <span>Live Turn-By-Turn Guidance</span>
                </h3>
                <span className="text-[10px] text-emerald-400 font-bold">NAVIGATING...</span>
              </div>

              <div className="space-y-2 max-h-56 overflow-y-auto">
                {routeResult.steps.map((st, idx) => (
                  <div
                    key={idx}
                    onClick={() => setCurrentStepIndex(idx)}
                    className={`p-3 rounded-xl border text-xs transition-all flex items-center space-x-2 ${
                      currentStepIndex === idx
                        ? 'bg-emerald-500/20 border-emerald-500/40 text-white font-bold shadow-lg'
                        : 'bg-slate-950 border-slate-850 text-slate-400'
                    }`}
                  >
                    <span className="w-5 h-5 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-[10px] font-bold text-emerald-400 shrink-0">
                      {st.stepIndex}
                    </span>
                    <span>{st.instruction}</span>
                  </div>
                ))}
              </div>

              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold text-center">
                🎯 YOU HAVE ARRIVED: {selectedClassroom?.name || 'ECE-204'}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
