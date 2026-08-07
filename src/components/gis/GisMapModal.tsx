import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Navigation, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { GisRouteStep } from '../../types';

interface RoomNode {
  id: string;
  label: string;
  category: string;
  x: number;
  y: number;
  width: number;
  height: number;
  pathD: string;
  targetX: number;
  targetY: number;
  steps: GisRouteStep[];
}

const ROOM_NODES: RoomNode[] = [
  {
    id: 'cl-12',
    label: 'CL-12 OS Lab',
    category: 'Academic Laboratory',
    x: 520,
    y: 160,
    width: 140,
    height: 100,
    pathD: 'M 480 500 L 480 300 L 590 300 L 590 210',
    targetX: 590,
    targetY: 210,
    steps: [
      { stepNumber: 1, instruction: 'Enter Admin Block via Main Security Gate A', distance: '0m', icon: '🚪' },
      { stepNumber: 2, instruction: 'Take Central Elevator Bank to Floor 2', distance: '45m', icon: '🛗' },
      { stepNumber: 3, instruction: 'Turn Right into West Academic Corridor', distance: '20m', icon: '➡️' },
      { stepNumber: 4, instruction: 'Arrive at Room CL-12 Operating Systems Laboratory', distance: '15m', icon: '📍' },
    ],
  },
  {
    id: 'auditorium',
    label: 'Auditorium',
    category: 'Events & Cultural Hall',
    x: 680,
    y: 160,
    width: 150,
    height: 100,
    pathD: 'M 480 500 L 480 300 L 755 300 L 755 210',
    targetX: 755,
    targetY: 210,
    steps: [
      { stepNumber: 1, instruction: 'Enter Admin Block via Main Security Gate A', distance: '0m', icon: '🚪' },
      { stepNumber: 2, instruction: 'Ascend Grand Escalator to Level 2', distance: '50m', icon: '🪜' },
      { stepNumber: 3, instruction: 'Proceed East down Cultural Wing Foyer', distance: '40m', icon: '➡️' },
      { stepNumber: 4, instruction: 'Arrive at Main Auditorium (Seats 1,200)', distance: '10m', icon: '🎭' },
    ],
  },
  {
    id: 'central-library',
    label: 'Central Library',
    category: 'Knowledge Hub & Digital Archives',
    x: 340,
    y: 160,
    width: 150,
    height: 100,
    pathD: 'M 480 500 L 480 300 L 415 300 L 415 210',
    targetX: 415,
    targetY: 210,
    steps: [
      { stepNumber: 1, instruction: 'Enter Admin Block via Main Security Gate A', distance: '0m', icon: '🚪' },
      { stepNumber: 2, instruction: 'Take West Stairwell to Floor 2', distance: '35m', icon: '🪜' },
      { stepNumber: 3, instruction: 'Turn Left into Quiet Reading Hallway', distance: '15m', icon: '⬅️' },
      { stepNumber: 4, instruction: 'Arrive at Central Library & RFID Checkpost', distance: '5m', icon: '📚' },
    ],
  },
  {
    id: 'dean-office',
    label: 'Dean Office',
    category: 'Executive Administration',
    x: 160,
    y: 160,
    width: 150,
    height: 100,
    pathD: 'M 480 500 L 480 300 L 235 300 L 235 210',
    targetX: 235,
    targetY: 210,
    steps: [
      { stepNumber: 1, instruction: 'Enter Admin Block via Main Security Gate A', distance: '0m', icon: '🚪' },
      { stepNumber: 2, instruction: 'Take Executive Elevator Bank to Floor 2', distance: '40m', icon: '🛗' },
      { stepNumber: 3, instruction: 'Pass Dean Secretariat Reception Desk', distance: '25m', icon: '🏛️' },
      { stepNumber: 4, instruction: 'Arrive at Office of Dean Academic Affairs', distance: '10m', icon: '⚖️' },
    ],
  },
  {
    id: 'main-entrance',
    label: 'Main Entrance',
    category: 'Security Post Gate A',
    x: 400,
    y: 480,
    width: 160,
    height: 60,
    pathD: 'M 480 500 L 480 480',
    targetX: 480,
    targetY: 480,
    steps: [
      { stepNumber: 1, instruction: 'You are currently at Main Security Gate A Entrance', distance: '0m', icon: '🚪' },
      { stepNumber: 2, instruction: 'Present Digital Student RFID Smart Card at Turnstile', distance: '0m', icon: '🎴' },
    ],
  },
];

export const GisMapModal: React.FC = () => {
  const { isGisModalOpen, setIsGisModalOpen } = useApp();
  const [selectedNode, setSelectedNode] = useState<RoomNode>(ROOM_NODES[0]);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(3);

  useEffect(() => {
    const handleGisTrigger = (e: any) => {
      if (e.detail) {
        const roomNum = e.detail.room_number || '';
        const found = ROOM_NODES.find((n) => n.label.toLowerCase().includes(roomNum.toLowerCase()) || n.id.toLowerCase().includes(roomNum.toLowerCase()));
        if (found) {
          setSelectedNode(found);
        }
        setIsGisModalOpen(true);
      }
    };
    window.addEventListener('zeno:spatial_gis_trigger', handleGisTrigger);
    return () => window.removeEventListener('zeno:spatial_gis_trigger', handleGisTrigger);
  }, [setIsGisModalOpen]);

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
                Interactive SVG vector nodes: Click Main Entrance, CL-12 OS Lab, Auditorium, Central Library, or Dean Office to route.
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
            <div className="w-full h-full flex items-center justify-center relative">
              <svg viewBox="0 0 1000 600" className="w-full h-full max-h-[500px]">
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
                  </pattern>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                <rect width="100%" height="100%" fill="url(#grid)" />

                {/* Academic Corridors */}
                <rect x="140" y="280" stroke="rgba(0,240,255,0.2)" strokeWidth="2" strokeDasharray="4 4" fill="rgba(15,23,42,0.4)" width="700" height="40" rx="6" />
                <rect x="460" y="320" stroke="rgba(0,240,255,0.2)" strokeWidth="2" strokeDasharray="4 4" fill="rgba(15,23,42,0.4)" width="40" height="170" rx="6" />

                {/* Animated Routing Path */}
                <path
                  d={selectedNode.pathD}
                  fill="none"
                  stroke="#00F0FF"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeDasharray="12 8"
                  className="animate-[dash_2s_linear_infinite]"
                  filter="url(#glow)"
                />

                {/* Vector Nodes Rendering */}
                {ROOM_NODES.map((node) => {
                  const isSelected = selectedNode.id === node.id;
                  return (
                    <g key={node.id} onClick={() => setSelectedNode(node)} className="cursor-pointer">
                      <rect
                        x={node.x}
                        y={node.y}
                        width={node.width}
                        height={node.height}
                        rx="12"
                        fill={isSelected ? 'rgba(0,240,255,0.18)' : 'rgba(15,23,42,0.85)'}
                        stroke={isSelected ? '#00F0FF' : 'rgba(51,65,85,0.8)'}
                        strokeWidth={isSelected ? '3' : '1.5'}
                        filter={isSelected ? 'url(#glow)' : undefined}
                      />
                      <text
                        x={node.x + node.width / 2}
                        y={node.y + node.height / 2}
                        fill={isSelected ? '#00F0FF' : '#CBD5E1'}
                        fontSize="12"
                        fontWeight="bold"
                        fontFamily="monospace"
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        {node.label}
                      </text>
                    </g>
                  );
                })}

                {/* Destination Pin Marker */}
                <g transform={`translate(${selectedNode.targetX}, ${selectedNode.targetY})`}>
                  <circle r="14" fill="#00F0FF" opacity="0.3" className="animate-ping" />
                  <circle r="7" fill="#00F0FF" />
                  <text y="-16" fill="#00F0FF" fontSize="11" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
                    TARGET: {selectedNode.label.toUpperCase()}
                  </text>
                </g>
              </svg>
            </div>

            {/* Map Legend */}
            <div className="absolute bottom-4 left-4 right-4 p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs font-mono flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="flex items-center space-x-1.5 text-cyan-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                  <span>Selected Node: {selectedNode.label}</span>
                </span>
              </div>
              <div className="text-slate-400">Click any vector node to calculate route</div>
            </div>
          </div>

          {/* Right Side Panel: Turn-by-Turn Routing Steps */}
          <div className="lg:col-span-4 p-6 space-y-6 flex flex-col justify-between overflow-y-auto bg-slate-950/40">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-extrabold text-sm uppercase tracking-wider text-white flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-cyan-400" />
                  <span>Turn-By-Turn Navigation</span>
                </h3>
                <span className="text-xs font-mono font-bold text-cyan-400">Active Route</span>
              </div>

              <div className="space-y-3">
                {selectedNode.steps.map((step, idx) => {
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
                  <span>Destination: {selectedNode.label}</span>
                </span>
                <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 text-[10px]">
                  ONLINE
                </span>
              </div>
              <div className="text-[11px] text-slate-300">
                Category: {selectedNode.category} • Location: Admin Block Floor 2
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
