import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, Database, Send, ShieldCheck, ArrowRight, Activity, CheckCircle2 } from 'lucide-react';

export const HeroNodePreview: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const steps = [
    {
      id: 0,
      name: 'Orchestrator',
      icon: Cpu,
      badge: 'Intent Router',
      status: 'Ready',
      detail: 'Analyzes prompt: "Am I eligible for Google Internship & Register Workshop?" Decomposes into 3 DAG sub-tasks.',
      payload: '{ intent: "PLACEMENT_INQUIRY", studentId: "2023CSE0892", targetDrive: "Google_2027" }',
    },
    {
      id: 1,
      name: 'RAG Retrieval Engine',
      icon: Database,
      badge: 'Vector Policy Audit',
      status: 'Verified',
      detail: 'Scans University Placement Regulations §3.1. Verified CGPA 8.84 ≥ 8.00 minimum threshold.',
      payload: '{ matchedSection: "§3.1", eligibility: true, confidence: 0.984, verifiedCgpa: 8.84 }',
    },
    {
      id: 2,
      name: 'Communication & HITL Gate',
      icon: Send,
      badge: 'Safety Dispatch',
      status: 'Awaiting User Endorsement',
      detail: 'Creates Google Calendar entry + drafts official registration endorsement email for HOD approval.',
      payload: '{ action: "EMAIL_HOD", recipient: "marcus.vance@zeno.edu", status: "WAITING_HITL_APPROVAL" }',
    },
  ];

  const handleStepClick = (idx: number) => {
    setActiveStep(idx);
  };

  const runSimulation = () => {
    setIsRunning(true);
    setActiveStep(0);
    setTimeout(() => {
      setActiveStep(1);
      setTimeout(() => {
        setActiveStep(2);
        setIsRunning(false);
      }, 1200);
    }, 1200);
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto rounded-2xl glass-panel p-6 border border-white/10 glow-box bg-zinc-950/80 overflow-hidden shadow-2xl backdrop-blur-xl">
      {/* Top Bar */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
        <div className="flex items-center space-x-3">
          <div className="flex space-x-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
          </div>
          <span className="text-xs font-mono tracking-widest text-zinc-400 uppercase">
            LIVE AGENT PIPELINE PREVIEW
          </span>
        </div>
        <div className="flex items-center space-x-3">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Activity className="w-3 h-3 mr-1.5 animate-pulse" />
            DAG STREAM: ACTIVE
          </span>
          <button
            onClick={runSimulation}
            disabled={isRunning}
            className="px-3 py-1 rounded-lg text-xs font-medium bg-white/10 hover:bg-white/20 text-white transition-all border border-white/10 flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
          >
            <span>{isRunning ? 'Running DAG...' : 'Simulate Flow'}</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Node Handoff Stepper */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 relative">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isActive = activeStep === idx;
          const isPast = activeStep > idx;

          return (
            <motion.div
              key={step.id}
              onClick={() => handleStepClick(idx)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`relative cursor-pointer p-4 rounded-xl border transition-all duration-300 ${
                isActive
                  ? 'bg-zinc-900/90 border-white/30 glow-box-cyan'
                  : isPast
                  ? 'bg-zinc-950/60 border-emerald-500/30'
                  : 'bg-zinc-950/40 border-white/5 opacity-70 hover:opacity-100'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2.5">
                  <div
                    className={`p-2 rounded-lg ${
                      isActive
                        ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                        : isPast
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-zinc-800 text-zinc-400'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-white tracking-wide">{step.name}</h4>
                    <span className="text-[10px] font-mono text-zinc-400">{step.badge}</span>
                  </div>
                </div>
                {isPast ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
                    Step 0{idx + 1}
                  </span>
                )}
              </div>

              <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed">{step.detail}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Payload Inspection Window */}
      <div className="bg-black/90 rounded-xl p-4 border border-white/10 font-mono text-xs">
        <div className="flex items-center justify-between text-zinc-400 mb-2 border-b border-white/5 pb-2">
          <span className="flex items-center space-x-2 text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
            <span>Agent Telemetry & Data Frame</span>
          </span>
          <span className="text-[10px] text-zinc-500">Node: {steps[activeStep].name}</span>
        </div>
        <AnimatePresence mode="wait">
          <motion.pre
            key={activeStep}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="text-emerald-400/90 overflow-x-auto text-[11px] leading-relaxed p-1"
          >
            {steps[activeStep].payload}
          </motion.pre>
        </AnimatePresence>
      </div>
    </div>
  );
};
