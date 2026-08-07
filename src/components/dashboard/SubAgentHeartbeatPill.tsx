import React, { useState, useEffect } from 'react';
import { Activity, Shield, Cpu } from 'lucide-react';

interface SubAgentState {
  name: string;
  latency: string;
  status: 'ACTIVE' | 'STANDBY' | 'IDLE';
}

const INITIAL_AGENTS: SubAgentState[] = [
  { name: 'SPATIAL_GIS', latency: '0.12ms', status: 'ACTIVE' },
  { name: 'HITL_GATEKEEPER', latency: '0.05ms', status: 'STANDBY' },
  { name: 'ACADEMIC_OS', latency: '0.18ms', status: 'IDLE' },
  { name: 'PLACEMENT_TWIN', latency: '0.24ms', status: 'ACTIVE' },
];

export const SubAgentHeartbeatPill: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % INITIAL_AGENTS.length);
    }, 3500);

    return () => clearInterval(timer);
  }, []);

  const current = INITIAL_AGENTS[currentIndex];

  const getStatusBadge = (status: SubAgentState['status']) => {
    switch (status) {
      case 'ACTIVE':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
      case 'STANDBY':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      case 'IDLE':
        return 'text-sky-400 bg-sky-500/10 border-sky-500/30';
    }
  };

  return (
    <div className="hidden xl:flex items-center space-x-2 px-3 py-1 rounded-full bg-[#090D14]/90 border border-slate-800 text-[11px] font-mono shadow-inner select-none transition-all duration-500">
      <div className="flex items-center space-x-1.5 text-slate-400">
        <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
        <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">SUB-AGENT:</span>
      </div>

      <div className="flex items-center space-x-1.5 text-slate-200">
        <span className="font-bold text-white tracking-wide">{current.name}</span>
        <span className="text-slate-400 text-[10px]">({current.latency})</span>
      </div>

      <span
        className={`px-1.5 py-0.2 rounded text-[9px] font-extrabold uppercase border ${getStatusBadge(
          current.status
        )}`}
      >
        {current.status}
      </span>
    </div>
  );
};
