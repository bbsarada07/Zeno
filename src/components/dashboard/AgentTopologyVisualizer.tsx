import React from 'react';
import { Cpu, Activity, Zap, CheckCircle2, Radio } from 'lucide-react';
import type { AgentDomain } from '../../types';

interface AgentTopologyProps {
  activeDomain?: AgentDomain;
}

const SUB_AGENTS: Array<{
  id: string;
  domain: AgentDomain;
  label: string;
  model: string;
  accent: string;
}> = [
  { id: 'agent-academic', domain: 'ACADEMIC', label: 'ACADEMIC_DS', model: 'Gemini-1.5-Pro', accent: '#00F0FF' },
  { id: 'agent-placement', domain: 'PLACEMENT', label: 'PLACEMENT_ENGINE', model: 'Claude-3.5-Sonnet', accent: '#10B981' },
  { id: 'agent-events', domain: 'EVENTS', label: 'EVENTS_ROUTER', model: 'GPT-4o-Mini', accent: '#F59E0B' },
  { id: 'agent-comm', domain: 'COMMUNICATION', label: 'COMM_STUDIO', model: 'DeepSeek-V3', accent: '#8B5CF6' },
  { id: 'agent-grievance', domain: 'STUDENT_SERVICE', label: 'GRIEVANCE_ROUTER', model: 'Mistral-Large', accent: '#F43F5E' },
];

export const AgentTopologyVisualizer: React.FC<AgentTopologyProps> = ({ activeDomain = 'ACADEMIC' }) => {
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
      <div className="grid grid-cols-5 gap-2">
        {SUB_AGENTS.map((agent) => {
          const isActive = activeDomain === agent.domain;
          return (
            <div
              key={agent.id}
              className={`p-2 rounded-xl border flex flex-col justify-between transition-all duration-300 relative overflow-hidden ${
                isActive
                  ? 'bg-slate-900 border-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.3)] scale-[1.03]'
                  : 'bg-slate-950/60 border-slate-850 opacity-60'
              }`}
              style={{ borderColor: isActive ? agent.accent : undefined }}
            >
              {isActive && (
                <div
                  className="absolute top-0 right-0 w-2 h-2 rounded-full animate-ping"
                  style={{ backgroundColor: agent.accent }}
                />
              )}

              <div className="text-[10px] font-extrabold truncate text-white" style={{ color: isActive ? agent.accent : undefined }}>
                {agent.label}
              </div>
              <div className="text-[9px] text-slate-400 truncate">{agent.model}</div>

              <div className="flex items-center justify-between pt-1 border-t border-slate-800/60 text-[9px]">
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
