import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  Compass,
  Layers,
  Search,
  Navigation,
  Eye,
  RotateCw,
  Building,
  UserCheck,
  Coffee,
  CheckCircle2,
  AlertCircle,
  X,
  Zap,
  ArrowRight,
  ShieldAlert,
  Sliders,
  Maximize2,
  ChevronRight,
  Footprints,
} from 'lucide-react';
import campusData from '../data/campusData.json';
import { searchCampusLocations, findNearestFacility } from '../services/spatialSearchService';
import type { CampusLocation } from '../services/spatialSearchService';
import { calculateCampusRoute } from '../services/campusRouter';
import type { RouteResult } from '../services/campusRouter';

export const Campus3DMap: React.FC = () => {
  // Map Camera State
  const [pitchAngle, setPitchAngle] = useState<number>(55); // 55deg tilt
  const [bearingAngle, setBearingAngle] = useState<number>(25); // 25deg rotation
  const [zoomLevel, setZoomLevel] = useState<number>(1.2);
  const [is3DMode, setIs3DMode] = useState<boolean>(true);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  // Selected Item Inspector State
  const [selectedLocation, setSelectedLocation] = useState<CampusLocation | null>(null);
  const [selectedFloor, setSelectedFloor] = useState<number>(2);

  // Active Routing State
  const [activeRoute, setActiveRoute] = useState<RouteResult | null>(null);
  const [activeDemoNotice, setActiveDemoNotice] = useState<string | null>(null);

  // Locations Dataset
  const locations = campusData.entities as CampusLocation[];
  const buildings = campusData.buildings;

  const filteredLocations = searchCampusLocations(searchQuery, locations).filter((loc) =>
    selectedCategory === 'ALL' ? true : loc.category === selectedCategory
  );

  // Demo 1: Where is CSE HOD Cabin?
  const triggerDemo1HOD = () => {
    const hodLoc = locations.find((l) => l.id === 'ent-cse-hod');
    if (hodLoc) {
      setSelectedLocation(hodLoc);
      setSelectedFloor(2);
      setPitchAngle(60);
      setBearingAngle(35);
      setZoomLevel(1.6);
      setActiveRoute(null);
      setActiveDemoNotice('Demo 1 Active: Flying to Admin Block (Floor 2) • Highlighting Dr. V. Sharma (CSE HOD Cabin C-201).');
    }
  };

  // Demo 2: Find Nearest Canteen
  const triggerDemo2Canteen = () => {
    const startCoords: [number, number] = [78.3815, 17.2435]; // Main Gate
    const nearest = findNearestFacility(startCoords, 'CANTEEN', locations);
    if (nearest) {
      setSelectedLocation(nearest.location);
      setSelectedFloor(0);
      setPitchAngle(45);
      setBearingAngle(10);
      setZoomLevel(1.4);

      // Route from Main Gate to SAC Food Court
      const route = calculateCampusRoute('n-gate', 'n-sac', true);
      setActiveRoute(route);
      setActiveDemoNotice(
        `Demo 2 Active: Nearest Canteen found! ${nearest.location.name} (${nearest.distanceMeters}m away from Main Gate).`
      );
    }
  };

  // Demo 3: Take me to Room C-204 (Turn-by-turn)
  const triggerDemo3RoomC204 = () => {
    const roomLoc = locations.find((l) => l.id === 'ent-room-c204');
    if (roomLoc) {
      setSelectedLocation(roomLoc);
      setSelectedFloor(2);
      setPitchAngle(55);
      setBearingAngle(30);
      setZoomLevel(1.5);

      // Route from Main Gate to Room C-204
      const route = calculateCampusRoute('n-gate', 'n-c204', true);
      setActiveRoute(route);
      setActiveDemoNotice(
        'Demo 3 Active: Indoor & Outdoor Turn-by-Turn Route calculated from Main Gate to Admin Block Floor 2 Room C-204.'
      );
    }
  };

  // Demo 4: Show all CSE Faculty Cabins
  const triggerDemo4Faculty = () => {
    setSelectedCategory('FACULTY');
    setSearchQuery('CSE');
    setPitchAngle(40);
    setBearingAngle(0);
    setZoomLevel(1.3);
    setActiveRoute(null);
    setActiveDemoNotice('Demo 4 Active: Filtered map markers to display all CSE Department Faculty Cabins.');
  };

  const categories = [
    { id: 'ALL', label: 'All Items' },
    { id: 'FACULTY', label: 'Faculty Cabins' },
    { id: 'ROOM', label: 'Classrooms' },
    { id: 'CANTEEN', label: 'Food & Canteen' },
    { id: 'SERVICE', label: 'Labs & Services' },
    { id: 'SPORTS', label: 'Sports Complex' },
  ];

  return (
    <div className="space-y-6 font-sans select-none text-slate-100 pb-12">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 zeno-glass-card border border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-[0_0_20px_rgba(0,240,255,0.2)]">
            <Compass className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-extrabold text-white">Spatial 3D Campus Digital Twin Engine</h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                [AGENT: ACADEMIC_GIS]
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              3D Extrusion Canvas • Fuzzy Location & Faculty Indexing • A* Graph Indoor Pathfinding
            </p>
          </div>
        </div>

        {/* 4 Hackathon Demo Preset Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 shrink-0">
          <button
            onClick={triggerDemo1HOD}
            className="px-3 py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/40 font-mono text-[11px] font-bold transition-all flex items-center space-x-1"
          >
            <UserCheck className="w-3.5 h-3.5 text-purple-400" />
            <span>Demo 1: HOD Cabin</span>
          </button>

          <button
            onClick={triggerDemo2Canteen}
            className="px-3 py-2 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/40 font-mono text-[11px] font-bold transition-all flex items-center space-x-1"
          >
            <Coffee className="w-3.5 h-3.5 text-rose-400" />
            <span>Demo 2: Nearest Canteen</span>
          </button>

          <button
            onClick={triggerDemo3RoomC204}
            className="px-3 py-2 rounded-xl bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/40 font-mono text-[11px] font-bold transition-all flex items-center space-x-1"
          >
            <Navigation className="w-3.5 h-3.5 text-cyan-400" />
            <span>Demo 3: Room C-204</span>
          </button>

          <button
            onClick={triggerDemo4Faculty}
            className="px-3 py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 font-mono text-[11px] font-bold transition-all flex items-center space-x-1"
          >
            <Building className="w-3.5 h-3.5 text-emerald-400" />
            <span>Demo 4: CSE Faculty</span>
          </button>
        </div>
      </div>

      {/* Demo Active Notice Banner */}
      {activeDemoNotice && (
        <div className="p-3.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/40 text-cyan-300 text-xs font-mono flex items-center justify-between shadow-lg">
          <div className="flex items-center space-x-2">
            <Zap className="w-4 h-4 text-cyan-400 shrink-0 fill-cyan-400" />
            <span>{activeDemoNotice}</span>
          </div>
          <button onClick={() => setActiveDemoNotice(null)} className="text-xs text-slate-400 hover:text-white underline">
            Dismiss
          </button>
        </div>
      )}

      {/* MAIN WORKSPACE GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: 3D MAP CANVAS & CAMERA CONTROLS */}
        <div className="lg:col-span-8 space-y-4">
          <div className="zeno-glass-card p-4 space-y-3 relative overflow-hidden">
            {/* Search Input & Category Pills Header */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 font-mono">
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search faculty cabins, rooms, labs..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
                />
              </div>

              {/* Category Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto scrollbar-none py-1">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold shrink-0 transition-all ${
                      selectedCategory === cat.id
                        ? 'bg-cyan-500 text-slate-950 border border-cyan-400 shadow-[0_0_10px_rgba(0,240,255,0.4)]'
                        : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 3D MAP CANVAS & EXTRUDED VISUALIZER */}
            <div
              className="w-full h-[460px] rounded-2xl bg-[#030712] border border-slate-800 relative overflow-hidden flex items-center justify-center select-none"
              style={{
                perspective: '1000px',
              }}
            >
              {/* Grid Background Pattern */}
              <div
                className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40"
              />

              {/* 3D Extruded Building Layer Canvas Simulation */}
              <div
                className="w-full h-full relative transition-transform duration-500 flex items-center justify-center"
                style={{
                  transform: `rotateX(${is3DMode ? pitchAngle : 0}deg) rotateZ(${is3DMode ? bearingAngle : 0}deg) scale(${zoomLevel})`,
                  transformStyle: 'preserve-3d',
                }}
              >
                {/* Campus Walkway GeoJSON Line Paths */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 600 400">
                  <path
                    d="M 100 300 L 250 200 L 400 120 M 250 200 L 320 280 M 100 300 L 180 140"
                    stroke="#334155"
                    strokeWidth="4"
                    strokeDasharray="6 6"
                    fill="none"
                  />
                  {activeRoute && (
                    <path
                      d="M 100 300 L 250 200 L 250 180"
                      stroke="#00F0FF"
                      strokeWidth="6"
                      fill="none"
                      className="animate-pulse"
                    />
                  )}
                </svg>

                {/* 3D Extruded Buildings */}
                {buildings.map((bldg) => {
                  const isSelected = selectedLocation?.building === bldg.name;

                  return (
                    <div
                      key={bldg.id}
                      onClick={() => {
                        const firstEntity = locations.find((l) => l.building === bldg.name);
                        if (firstEntity) setSelectedLocation(firstEntity);
                      }}
                      className={`absolute transition-all cursor-pointer group flex flex-col items-center justify-center p-3 rounded-2xl border backdrop-blur-md shadow-2xl ${
                        isSelected
                          ? 'border-cyan-400 bg-cyan-500/20 text-white shadow-[0_0_30px_rgba(0,240,255,0.4)]'
                          : 'border-slate-800 bg-slate-950/80 text-slate-300 hover:border-cyan-500/50 hover:bg-slate-900/90'
                      }`}
                      style={{
                        width: `${bldg.dimensions.width * 1.5}px`,
                        height: `${bldg.dimensions.length * 1.4}px`,
                        top: bldg.id.includes('admin') ? '30%' : bldg.id.includes('sac') ? '60%' : '15%',
                        left: bldg.id.includes('admin') ? '40%' : bldg.id.includes('sac') ? '55%' : '15%',
                        transform: `translateZ(${is3DMode ? bldg.heightMeters * 1.2 : 0}px)`,
                        boxShadow: is3DMode ? '0 20px 40px rgba(0,0,0,0.8)' : 'none',
                      }}
                    >
                      {/* Translucent Glass Roof Layer */}
                      {bldg.roofGlassEffect && (
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-cyan-500/10 via-purple-500/10 to-transparent pointer-events-none" />
                      )}

                      <Building className="w-5 h-5 mb-1" style={{ color: bldg.color }} />
                      <div className="text-[11px] font-mono font-extrabold text-white text-center leading-tight">
                        {bldg.name}
                      </div>
                      <div className="text-[9px] font-mono text-slate-400 mt-0.5">
                        {bldg.floorsCount} Floors • Extruded {bldg.heightMeters}m
                      </div>

                      {/* Hover Highlight Badge */}
                      {isSelected && (
                        <span className="mt-1 px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-cyan-500 text-slate-950 animate-bounce">
                          ACTIVE INSPECTION
                        </span>
                      )}
                    </div>
                  );
                })}

                {/* Filtered Entity Pins */}
                {filteredLocations.map((loc) => (
                  <div
                    key={loc.id}
                    onClick={() => setSelectedLocation(loc)}
                    className="absolute cursor-pointer transition-all hover:scale-125"
                    style={{
                      top: loc.id.includes('c204') || loc.id.includes('hod') ? '38%' : loc.id.includes('canteen') ? '65%' : '20%',
                      left: loc.id.includes('c204') || loc.id.includes('hod') ? '46%' : loc.id.includes('canteen') ? '62%' : '20%',
                      transform: 'translateZ(40px)',
                    }}
                  >
                    <div className="p-1.5 rounded-full bg-slate-950 border border-cyan-400 text-cyan-400 shadow-[0_0_12px_rgba(0,240,255,0.6)]">
                      <MapPin className="w-4 h-4" />
                    </div>
                  </div>
                ))}
              </div>

              {/* Dynamic Camera Control Floating Toolbar */}
              <div className="absolute bottom-4 right-4 bg-slate-950/90 border border-slate-800 rounded-2xl p-2 font-mono text-xs flex items-center space-x-2 z-20">
                <button
                  onClick={() => setIs3DMode(!is3DMode)}
                  className={`px-2.5 py-1.5 rounded-xl border text-[10px] font-bold ${
                    is3DMode ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' : 'bg-slate-900 text-slate-400 border-slate-800'
                  }`}
                >
                  {is3DMode ? '3D Extruded' : '2D Flat'}
                </button>
                <button
                  onClick={() => setPitchAngle((prev) => (prev >= 60 ? 0 : prev + 20))}
                  title="Tilt Camera Pitch Angle"
                  className="p-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
                >
                  <RotateCw className="w-4 h-4" />
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
          </div>
        </div>

        {/* RIGHT COLUMN: FLOOR LEVEL INSPECTOR & TURN-BY-TURN ROUTE */}
        <div className="lg:col-span-4 space-y-4 font-mono">
          {/* FLOOR LEVEL INSPECTOR DRAWER */}
          <div className="zeno-glass-card p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-sm uppercase tracking-wider text-white flex items-center space-x-2">
                <Building className="w-4 h-4 text-cyan-400" />
                <span>Floor Level Inspector Drawer</span>
              </h3>
              <span className="text-[10px] text-cyan-400 font-bold">2D/3D BLUEPRINT</span>
            </div>

            {selectedLocation ? (
              <div className="space-y-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
                  <div className="font-bold text-sm text-white">{selectedLocation.name}</div>
                  <div className="text-[10px] text-slate-400">
                    Building: <span className="text-cyan-300 font-bold">{selectedLocation.building}</span> • Floor {selectedLocation.floor}
                  </div>
                  {selectedLocation.roomNumber && (
                    <div className="text-[10px] text-slate-400">
                      Room Number: <span className="text-emerald-300 font-bold">{selectedLocation.roomNumber}</span>
                    </div>
                  )}

                  {selectedLocation.facultyDetails && (
                    <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-200 space-y-1 mt-2">
                      <div className="font-bold text-purple-300">{selectedLocation.facultyDetails.name}</div>
                      <div className="text-[10px] text-slate-300">{selectedLocation.facultyDetails.designation}</div>
                      <div className="text-[10px] text-slate-400">Office Hours: {selectedLocation.facultyDetails.officeHours}</div>
                    </div>
                  )}
                </div>

                {/* 2D/3D Indoor Floor Blueprint Simulation */}
                <div className="p-4 rounded-2xl bg-[#030712] border border-slate-800 space-y-2 text-center relative overflow-hidden">
                  <div className="text-[10px] font-bold text-slate-400">
                    Indoor Floor Level {selectedLocation.floor} Architectural Blueprint
                  </div>

                  <div className="grid grid-cols-3 gap-2 py-2 text-[10px]">
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-300">
                      Elevator Bank 1
                    </div>
                    <div className="p-3 rounded-xl bg-cyan-500/20 border border-cyan-500/40 font-bold text-cyan-300">
                      {selectedLocation.roomNumber || 'Room C-204'}
                    </div>
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-300">
                      Stairway B
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 text-center text-xs text-slate-500 italic">
                Select any building or pin to inspect floor plans & faculty cabins.
              </div>
            )}
          </div>

          {/* TURN-BY-TURN ROUTING INSTRUCTIONS */}
          {activeRoute && (
            <div className="zeno-glass-card p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-extrabold text-sm uppercase tracking-wider text-white flex items-center space-x-2">
                  <Footprints className="w-4 h-4 text-emerald-400" />
                  <span>Turn-by-Turn Route Metadata</span>
                </h3>
                <span className="text-[10px] text-emerald-400 font-bold">A* PATH COMPUTED</span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-[9px] text-slate-400">Distance</div>
                  <div className="font-bold text-cyan-400 mt-0.5">{activeRoute.totalDistanceMeters}m</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-[9px] text-slate-400">Est. Walk</div>
                  <div className="font-bold text-emerald-400 mt-0.5">{activeRoute.estimatedTimeMinutes} min</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-[9px] text-slate-400">Step-Free</div>
                  <div className="font-bold text-purple-400 mt-0.5">{activeRoute.isStepFree ? 'YES ✓' : 'NO'}</div>
                </div>
              </div>

              {/* Turn-by-Turn Steps List */}
              <div className="space-y-1.5 text-xs max-h-48 overflow-y-auto">
                {activeRoute.steps.map((st) => (
                  <div key={st.stepNumber} className="p-2.5 rounded-xl bg-slate-950 border border-slate-850 flex items-center space-x-2">
                    <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-[10px] font-bold shrink-0">
                      {st.stepNumber}
                    </span>
                    <span className="text-slate-200 leading-snug">{st.instruction}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
