import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Navigation, Compass, Layers, Info, CheckCircle2, ChevronRight, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { GisRouteStep } from '../../types';

const ROUTE_STEPS: GisRouteStep[] = [
  { stepNumber: 1, instruction: 'Enter Admin Block via Main Security Gate A', distance: '0m', icon: '🚪' },
  { stepNumber: 2, instruction: 'Take Central Elevator Bank to Floor 2', distance: '45m', icon: '🛗' },
  { stepNumber: 3, instruction: 'Turn Right into West Academic Corridor', distance: '20m', icon: '➡️' },
  { stepNumber: 4, instruction: 'Arrive at Room CL-12 Operating Systems Laboratory', distance: '15m', icon: '📍' },
];

const ROOM_NODES = [
  { id: 'cl-12', label: 'CL-12 OS Lab', x: 520, y: 160, width: 140, height: 100, active: true },
  { id: 'cl-14', label: 'CL-14 AI Lab', x: 680, y: 160, width: 140, height: 100, active: false },
  { id: 'seminar-b', label: 'Seminar Hall B', x: 340, y: 160, width: 150, height: 100, active: false },
  { id: 'hod-cabin', label: 'HOD Executive Office', x: 160, y: 160, width: 150, height: 100, active: false },
  { id: 'faculty-204', label: 'Faculty Room 204', x: 160, y: 340, width: 150, height: 100, active: false },
  { id: 'elevator-bank', label: 'Elevator Bank', x: 420, y: 340, width: 120, height: 80, active: false },
  { id: 'main-entrance', label: 'Admin Block Entrance A', x: 420, y: 480, width: 160, height: 60, active: false },
];

export const GisMapModal: React.FC = () => {
  const { isGisModalOpen, setIsGisModalOpen } = useApp();
  const [selectedRoom, setSelectedRoom] = useState<string>('CL-12 OS Lab');
  const [activeStepIndex, setActiveStepIndex] = useState<number>(3);

  if (!isGisModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-xl p-4 font-sans select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="w-full max-w-6xl h-[90vh] bg-[#090D14]/95 border border-slate-800 rounded-3xl shadow-[0_0_80px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col text-slate-100"
      >
        {/* Modal Top Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Navigation className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-white flex items-center space-x-2">
                <span>Spatial Vector Campus Indoor Blueprint Map</span>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                  ADMIN BLOCK • FLOOR 2
                </span>
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Interactive SVG indoor turn-by-turn routing to target destination.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsGisModalOpen(false)}
            className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main Content Layout */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
          {/* Left Canvas: SVG Indoor Vector Blueprint (lg:col-span-8) */}
          <div className="lg:col-span-8 bg-[#05070A] p-6 relative flex flex-col items-center justify-center overflow-hidden border-b lg:border-b-0 lg:border-r border-slate-800">
            {/* SVG Vector Map Container */}
            <div className="w-full h-full flex items-center justify-center relative">
              <svg viewBox="0 0 1000 600" className="w-full h-full max-h-[500px]">
                {/* Background Grid Pattern */}
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
                  </pattern>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                <rect width="100%" height="100%" fill="url(#grid)" />

                {/* Main Academic Hallway Corridors */}
                <rect x="140" y="280" stroke="rgba(0,240,255,0.2)" strokeWidth="2" strokeDasharray="4 4" fill="rgba(15,23,42,0.4)" width="700" height="40" rx="6" />
                <rect x="460" y="320" stroke="rgba(0,240,255,0.2)" strokeWidth="2" strokeDasharray="4 4" fill="rgba(15,23,42,0.4)" width="40" height="150" rx="6" />

                {/* Animated Routing Path Dash Stroke */}
                <path
                  d="M 480 500 L 480 300 L 590 300 L 590 210"
                  fill="none"
                  stroke="#00F0FF"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeDasharray="12 8"
                  className="animate-[dash_2s_linear_infinite]"
                  filter="url(#glow)"
                />

                {/* Room Nodes */}
                {ROOM_NODES.map((room) => {
                  const isSelected = selectedRoom === room.label;
                  return (
                    <g key={room.id} onClick={() => setSelectedRoom(room.label)} className="cursor-pointer">
                      <rect
                        x={room.x}
                        y={room.y}
                        width={room.width}
                        height={room.height}
                        rx="12"
                        fill={isSelected ? 'rgba(0,240,255,0.15)' : 'rgba(15,23,42,0.8)'}
                        stroke={isSelected ? '#00F0FF' : 'rgba(51,65,85,0.8)'}
                        strokeWidth={isSelected ? '3' : '1.5'}
                        filter={isSelected ? 'url(#glow)' : undefined}
                      />
                      <text
                        x={room.x + room.width / 2}
                        y={room.y + room.height / 2}
                        fill={isSelected ? '#00F0FF' : '#CBD5E1'}
                        fontSize="13"
                        fontWeight="bold"
                        fontFamily="monospace"
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        {room.label}
                      </text>
                    </g>
                  );
                })}

                {/* Destination Pin Marker on Target Lab CL-12 */}
                <g transform="translate(590, 210)">
                  <circle r="12" fill="#00F0FF" opacity="0.3" className="animate-ping" />
                  <circle r="6" fill="#00F0FF" />
                  <text y="-14" fill="#00F0FF" fontSize="11" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
                    TARGET: OS LAB CL-12
                  </text>
                </g>
              </svg>
            </div>

            {/* Map Legend */}
            <div className="absolute bottom-4 left-4 right-4 p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs font-mono flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="flex items-center space-x-1.5 text-cyan-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                  <span>Active Destination</span>
                </span>
                <span className="flex items-center space-x-1.5 text-slate-400">
                  <span className="w-2.5 h-2.5 rounded bg-slate-700" />
                  <span>Interactive Rooms</span>
                </span>
              </div>
              <div className="text-slate-400">Click any room node to reroute</div>
            </div>
          </div>

          {/* Right Side Panel: Turn-by-Turn Routing Steps (lg:col-span-4) */}
          <div className="lg:col-span-4 p-6 space-y-6 flex flex-col justify-between overflow-y-auto bg-slate-950/40">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-extrabold text-sm uppercase tracking-wider text-white flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-cyan-400" />
                  <span>Turn-By-Turn Navigation</span>
                </h3>
                <span className="text-xs font-mono font-bold text-cyan-400">80m Total</span>
              </div>

              <div className="space-y-3">
                {ROUTE_STEPS.map((step, idx) => {
                  const isActive = activeStepIndex === idx;
                  return (
                    <div
                      key={step.stepNumber}
                      onClick={() => setActiveStepIndex(idx)}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all space-y-1 ${
                        isActive
                          ? 'bg-slate-900 border-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.2)]'
                          : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-900/50'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="font-bold text-white flex items-center space-x-2">
                          <span>{step.icon}</span>
                          <span>Step {step.stepNumber}</span>
                        </span>
                        <span className="text-slate-400">{step.distance}</span>
                      </div>
                      <p className="text-xs text-slate-300 font-sans pl-6">{step.instruction}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Target Room Details Box */}
            <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono space-y-2">
              <div className="font-bold flex items-center justify-between">
                <span className="flex items-center space-x-1.5">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span>Destination: {selectedRoom}</span>
                </span>
                <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 text-[10px]">
                  CLASS LIVE
                </span>
              </div>
              <div className="text-[11px] text-slate-300">
                Course: Operating Systems Laboratory (CS-302-LAB) • Faculty: Dr. K. Srinivas
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
