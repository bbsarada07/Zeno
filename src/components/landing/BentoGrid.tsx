import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Cpu,
  ShieldAlert,
  FileScan,
  Database,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Zap,
  Lock,
  Search,
  Check,
} from 'lucide-react';

export const BentoGrid: React.FC = () => {
  // Interactive state for Bento Card 2 (HITL Approval Gate)
  const [hitlApproved, setHitlApproved] = useState(false);

  // Interactive state for Bento Card 3 (OCR Scanner)
  const [isScanning, setIsScanning] = useState(false);
  const [ocrSuccess, setOcrSuccess] = useState(false);

  // Interactive state for Bento Card 4 (RAG Search)
  const [ragQuery, setRagQuery] = useState('Medical absence attendance credit §7.2');
  const [ragResult, setRagResult] = useState<string | null>(
    'Handbook §7.2: Medical certificates issued by registered physicians entitle students up to 7 days attendance credit reinstatement upon HOD approval.'
  );

  const runOcrScan = () => {
    setIsScanning(true);
    setOcrSuccess(false);
    setTimeout(() => {
      setIsScanning(false);
      setOcrSuccess(true);
    }, 1200);
  };

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
      <div className="text-center mb-16">
        <span className="text-xs font-mono uppercase tracking-widest text-zinc-400 px-3 py-1 rounded-full bg-white/5 border border-white/10">
          ARCHITECTURE & CAPABILITIES
        </span>
        <h2 className="text-3xl md:text-5xl font-extrabold text-white mt-4 tracking-tight">
          Engineered for Autonomous Campus Governance
        </h2>
        <p className="text-zinc-400 mt-4 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
          Replacing static chatbots with active sub-agent DAGs, vector policy retrieval, document OCR vision, and strict Human-In-The-Loop safety gates.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Bento Card 1: Multi-Agent Orchestration (Large Card - 2 Columns) */}
        <motion.div
          whileHover={{ y: -4 }}
          className="md:col-span-2 glass-panel rounded-2xl p-6 md:p-8 border border-white/10 relative overflow-hidden bg-zinc-950/80 group"
        >
          <div className="absolute top-0 right-0 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-mono text-sky-400 tracking-wider uppercase">CORE ENGINE</span>
              <h3 className="text-xl font-bold text-white">Multi-Agent Orchestration Engine</h3>
            </div>
          </div>

          <p className="text-zinc-400 text-sm mb-6 max-w-xl leading-relaxed">
            Decomposes complex natural language prompts into sub-tasks. Routes requests to specialized agents for RAG lookups, calendar scheduling, risk checks, and OCR extraction.
          </p>

          {/* Mini Interactive Node Visualizer */}
          <div className="bg-black/60 rounded-xl p-4 border border-white/10 grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
            <div className="p-3 rounded-lg bg-zinc-900 border border-white/10 flex flex-col items-center">
              <Zap className="w-5 h-5 text-amber-400 mb-1" />
              <span className="text-xs font-semibold text-white">Orchestrator</span>
              <span className="text-[10px] text-zinc-400 font-mono mt-1">Intent Parsing</span>
            </div>
            <div className="p-3 rounded-lg bg-zinc-900 border border-white/10 flex flex-col items-center">
              <Database className="w-5 h-5 text-sky-400 mb-1" />
              <span className="text-xs font-semibold text-white">RAG Engine</span>
              <span className="text-[10px] text-zinc-400 font-mono mt-1">Vector Search</span>
            </div>
            <div className="p-3 rounded-lg bg-zinc-900 border border-white/10 flex flex-col items-center">
              <FileScan className="w-5 h-5 text-emerald-400 mb-1" />
              <span className="text-xs font-semibold text-white">OCR Vision</span>
              <span className="text-[10px] text-zinc-400 font-mono mt-1">Doc Parser</span>
            </div>
            <div className="p-3 rounded-lg bg-zinc-900 border border-white/10 flex flex-col items-center">
              <Lock className="w-5 h-5 text-rose-400 mb-1" />
              <span className="text-xs font-semibold text-white">HITL Gate</span>
              <span className="text-[10px] text-zinc-400 font-mono mt-1">Safety Guard</span>
            </div>
          </div>
        </motion.div>

        {/* Bento Card 2: Autonomous HITL Approval Gates */}
        <motion.div
          whileHover={{ y: -4 }}
          className="glass-panel rounded-2xl p-6 border border-white/10 relative overflow-hidden bg-zinc-950/80 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-mono text-amber-400 tracking-wider uppercase">SAFETY & CONTROL</span>
                <h3 className="text-lg font-bold text-white">HITL Approval Gates</h3>
              </div>
            </div>

            <p className="text-zinc-400 text-xs leading-relaxed mb-6">
              No high-stakes email or database write happens without human approval. Test the gate below:
            </p>
          </div>

          {/* Mini Interactive HITL Box */}
          <div className="bg-black/60 rounded-xl p-4 border border-white/10">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-semibold text-white">Action: Draft HOD Email</span>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                  hitlApproved ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                }`}
              >
                {hitlApproved ? 'DISPATCHED' : 'PENDING APPROVAL'}
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 font-mono mb-3 line-clamp-2">
              Subject: Makeup Exam Request for Alex Rivera (2023CSE0892)...
            </p>
            <button
              onClick={() => setHitlApproved(!hitlApproved)}
              className={`w-full py-2 rounded-lg text-xs font-semibold flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                hitlApproved
                  ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40'
                  : 'bg-white text-black hover:bg-zinc-200'
              }`}
            >
              {hitlApproved ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Approved & Dispatched</span>
                </>
              ) : (
                <span>Click to Test Approval</span>
              )}
            </button>
          </div>
        </motion.div>

        {/* Bento Card 3: OCR Policy & Medical Document Scanner */}
        <motion.div
          whileHover={{ y: -4 }}
          className="glass-panel rounded-2xl p-6 border border-white/10 relative overflow-hidden bg-zinc-950/80 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <FileScan className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-mono text-emerald-400 tracking-wider uppercase">VISION AI</span>
                <h3 className="text-lg font-bold text-white">OCR Document Scanner</h3>
              </div>
            </div>
            <p className="text-zinc-400 text-xs leading-relaxed mb-4">
              Upload medical certificates or transcripts. Extracts doctor IDs, ICD-10 codes, and dates automatically.
            </p>
          </div>

          <div className="bg-black/60 rounded-xl p-4 border border-white/10 text-center">
            <button
              onClick={runOcrScan}
              disabled={isScanning}
              className="w-full py-2.5 rounded-lg border border-dashed border-white/20 hover:border-white/40 bg-white/5 text-xs text-zinc-300 flex items-center justify-center space-x-2 cursor-pointer transition-all mb-2"
            >
              <FileScan className="w-4 h-4 text-emerald-400" />
              <span>{isScanning ? 'Scanning Certificate...' : 'Simulate OCR Upload'}</span>
            </button>

            {isScanning && (
              <div className="w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                <div className="bg-emerald-400 h-full animate-pulse w-3/4"></div>
              </div>
            )}

            {ocrSuccess && !isScanning && (
              <div className="text-[11px] text-emerald-400 font-mono text-left space-y-1 bg-emerald-950/30 p-2.5 rounded border border-emerald-500/20">
                <div>✓ Patient: Alex Rivera</div>
                <div>✓ ICD-10: B34.9 Pyrexia</div>
                <div>✓ Doctor Reg: #MC-99201</div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Bento Card 4: Real-time RAG Knowledge Retrieval (2 Columns) */}
        <motion.div
          whileHover={{ y: -4 }}
          className="md:col-span-2 glass-panel rounded-2xl p-6 md:p-8 border border-white/10 relative overflow-hidden bg-zinc-950/80 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <Database className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-mono text-purple-400 tracking-wider uppercase">KNOWLEDGE BASE</span>
                <h3 className="text-xl font-bold text-white">Real-Time RAG Knowledge Retrieval</h3>
              </div>
            </div>

            <p className="text-zinc-400 text-sm mb-6 max-w-xl">
              Queries vector indices of university handbooks, exam regulations, and credit policies with exact chunk citations and confidence scores.
            </p>
          </div>

          <div className="bg-black/60 rounded-xl p-4 border border-white/10">
            <div className="flex items-center space-x-2 mb-3">
              <Search className="w-4 h-4 text-zinc-400" />
              <input
                type="text"
                value={ragQuery}
                onChange={(e) => setRagQuery(e.target.value)}
                className="bg-transparent text-xs text-white placeholder-zinc-500 focus:outline-none w-full font-mono"
                placeholder="Search university policies..."
              />
            </div>
            {ragResult && (
              <div className="p-3 rounded-lg bg-zinc-900 border border-white/10 text-xs font-mono text-purple-300 leading-relaxed">
                <div className="text-[10px] text-zinc-500 mb-1 flex items-center justify-between">
                  <span>Citation: University_Handbook_v4.pdf</span>
                  <span className="text-emerald-400 font-bold">98.4% Confidence Match</span>
                </div>
                {ragResult}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
