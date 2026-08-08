import React from 'react';
import { Cpu, Radio } from 'lucide-react';
import type { AgentDomain } from '../../types';

interface AgentTopologyProps {
  activeDomain?: AgentDomain;
}

const SUB_AGENTS: Array<{
  id: string;
  domain: string;
  label: string;
  model: string;
  accent: string;
}> = [
  { id: 'agent-academic', domain: 'academic', label: 'ACADEMIC', model: 'Gemini-1.5-Pro', accent: '#00F0FF' },
  { id: 'agent-placement', domain: 'placement', label: 'PLACEMENT', model: 'Claude-3.5-Sonnet', accent: '#10B981' },
  { id: 'agent-communication', domain: 'communication', label: 'COMMUNICATION', model: 'WebSpeech/TTS', accent: '#F97316' },
  { id: 'agent-service', domain: 'service', label: 'SERVICE', model: 'SLA Router', accent: '#F43F5E' },
  { id: 'agent-event', domain: 'event', label: 'EVENT', model: 'GPT-4o-Mini', accent: '#F59E0B' },
  { id: 'agent-gps', domain: 'campus_gps', label: 'CAMPUS_GPS', model: 'Dijkstra 3D', accent: '#A855F7' },
];

export const AgentTopologyVisualizer: React.FC<AgentTopologyProps> = ({ activeDomain = 'ACADEMIC_GIS' }) => {
  return (
    <div className="p-3.5 rounded-2xl bg-slate-950/80 dark:bg-slate-950/80 html-light:bg-slate-100 border border-slate-800 dark:border-slate-800 html-light:border-slate-300 space-y-3 font-mono select-none">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-2 text-xs">
        <div className="flex items-center space-x-2 text-cyan-400 font-bold">
          <Cpu className="w-4 h-4 animate-pulse" />
          <span>Live Multi-Agent Topology Visualizer</span>
        </div>
        <div className="flex items-center space-x-1.5 text-[10px] text-slate-400">
          <Radio className="w-3 h-3 text-emerald-400 animate-ping" />
          <span>REALTIME TOKEN ROUTER</span>
        </div>
      </div>

      {/* Sub-Agent Nodes Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {SUB_AGENTS.map((agent) => {
          const isActive =
            activeDomain === agent.domain ||
            (activeDomain === 'ACADEMIC' && agent.domain === 'ACADEMIC_GIS') ||
            (activeDomain === 'PLACEMENT' && agent.domain === 'PLACEMENT_PIPELINE') ||
            (activeDomain === 'EVENTS' && agent.domain === 'EVENTS_ROUTER') ||
            (activeDomain === 'STUDENT_SERVICE' && agent.domain === 'GOVERNANCE_ROUTER') ||
            (activeDomain === 'COMMUNICATION' && agent.domain === 'GOVERNANCE_ROUTER');

          return (
            <div
              key={agent.id}
              className={`p-2.5 rounded-xl border flex flex-col justify-between transition-all duration-300 relative overflow-hidden ${
                isActive
                  ? 'bg-slate-900 border-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.3)] scale-[1.03]'
                  : 'bg-slate-950/60 border-slate-850 opacity-60'
              }`}
              style={{ borderColor: isActive ? agent.accent : undefined }}
            >
              {isActive && (
                <div
                  className="absolute top-0 right-0 w-2.5 h-2.5 rounded-full animate-ping"
                  style={{ backgroundColor: agent.accent }}
                />
              )}

              <div className="text-[11px] font-extrabold truncate text-white" style={{ color: isActive ? agent.accent : undefined }}>
                [AGENT: {agent.label}]
              </div>
              <div className="text-[10px] text-slate-400 truncate mt-0.5">{agent.model}</div>

              <div className="flex items-center justify-between pt-1.5 border-t border-slate-800/60 text-[9px] mt-2">
                <span className="text-slate-500">STATE:</span>
                <span className="font-bold" style={{ color: isActive ? agent.accent : '#64748B' }}>
                  {isActive ? 'ACTIVE' : 'IDLE'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
