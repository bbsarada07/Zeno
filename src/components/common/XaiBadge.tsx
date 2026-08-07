import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, ChevronDown, ChevronUp, Cpu, Database } from 'lucide-react';
import type { XaiBadgeData } from '../../types';

interface XaiBadgeProps {
  data: XaiBadgeData;
  compact?: boolean;
}

export const XaiBadge: React.FC<XaiBadgeProps> = ({ data }) => {
  const [isOpen, setIsOpen] = useState(false);

  const traces = Array.isArray(data.reasoningTrace)
    ? data.reasoningTrace
    : [data.reasoningTrace || 'Standard multi-agent heuristic rule evaluation.'];

  return (
    <div className="mt-3 rounded-xl border border-sky-500/30 bg-sky-950/20 overflow-hidden font-mono text-xs shadow-lg">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3.5 py-2 flex items-center justify-between bg-sky-900/30 hover:bg-sky-900/50 transition-colors text-left cursor-pointer"
      >
        <div className="flex items-center space-x-2">
          <div className="p-1 rounded bg-sky-500/20 text-sky-400">
            <ShieldCheck className="w-3.5 h-3.5" />
          </div>
          <span className="font-bold text-sky-300 text-[11px] uppercase tracking-wider">
            EXPLAINABLE AI (XAI) AUDIT BADGE
          </span>
          <span className="text-[10px] text-zinc-400 font-sans">• {data.agentSource}</span>
        </div>

        <div className="flex items-center space-x-3">
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            {data.confidenceScore}% CONFIDENCE
          </span>
          {isOpen ? <ChevronUp className="w-3.5 h-3.5 text-sky-400" /> : <ChevronDown className="w-3.5 h-3.5 text-sky-400" />}
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="p-3 border-t border-sky-500/20 bg-black/60 space-y-2.5 text-[11px]"
          >
            <div>
              <span className="text-[10px] text-sky-400 uppercase font-bold tracking-widest block mb-1 flex items-center space-x-1">
                <Cpu className="w-3 h-3 mr-1" />
                REASONING TRACE LOGIC:
              </span>
              <div className="space-y-1 pl-2 border-l-2 border-sky-500/40 text-zinc-300">
                {traces.map((step: string, sIdx: number) => (
                  <div key={sIdx} className="flex items-start space-x-1.5">
                    <span className="text-sky-400 font-bold">›</span>
                    <span className="leading-relaxed">{step}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <span className="text-[10px] text-purple-400 uppercase font-bold tracking-widest block mb-1 flex items-center space-x-1">
                <Database className="w-3 h-3 mr-1" />
                DATA POINTS EVALUATED:
              </span>
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20 text-[10px]">
                  {data.dataPointsEvaluated} Attributes Evaluated
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
