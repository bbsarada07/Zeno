import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  GraduationCap,
  ArrowRight,
  UserCheck,
  Play,
  FileText,
  CheckCircle2,
  Upload,
  Zap,
  AlertTriangle,
  FileCode,
  Target,
  Layers,
  Sparkles,
  RefreshCw,
  HelpCircle,
  TrendingUp,
  Award,
  Check,
  X,
  MessageSquare,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { AtsScoreBreakdown, ResumeDiffItem, SkillGapItem, RecruiterSimProbe } from '../../types';

const INITIAL_ATS_BREAKDOWN: AtsScoreBreakdown = {
  overallScore: 87,
  keywordMatchPct: 91,
  formattingPct: 96,
  skillsPct: 84,
  projectImpactPct: 78,
  missingKeywords: ['C++', 'Distributed System Design', 'Kafka', 'Redis Caching'],
};

const INITIAL_RESUME_DIFFS: ResumeDiffItem[] = [
  {
    id: 'diff-1',
    section: 'Project 1: Corassist AI Platform',
    beforeText: '- Built an AI platform with React and FastAPI to handle campus queries.',
    afterText: '- Architected multi-agent RAG pipeline using React & FastAPI, reducing user query latency by 42% and achieving 99.4% intent routing precision.',
    rationale: 'Quantifies technical impact metrics and highlights architectural multi-agent ownership for Tier-1 ATS rank.',
  },
  {
    id: 'diff-2',
    section: 'Technical Skills Section',
    beforeText: 'Languages: JavaScript, Python, HTML/CSS, SQL',
    afterText: 'Core Languages & Systems: Python (AsyncIO), TypeScript, C++20, PostgreSQL, Distributed Systems',
    rationale: 'Injects target role keywords (C++, Distributed Systems) to pass ATS keyword match filter.',
  },
];

const INITIAL_SKILL_GAPS: SkillGapItem[] = [
  { id: 'sg-1', skillName: 'Data Structures & Algorithms (Trees/Graphs)', currentScore: 62, requiredScore: 85, gap: -23, priorityLevel: 'HIGH PRIORITY' },
  { id: 'sg-2', skillName: 'Distributed System Design & Caching', currentScore: 35, requiredScore: 60, gap: -25, priorityLevel: 'CRITICAL DANGER' },
  { id: 'sg-3', skillName: 'React & Frontend State Architecture', currentScore: 82, requiredScore: 75, gap: 7, priorityLevel: 'MATCHED ✓' },
  { id: 'sg-4', skillName: 'PostgreSQL & Database Indexing', currentScore: 78, requiredScore: 70, gap: 8, priorityLevel: 'MATCHED ✓' },
];

const INITIAL_PROBES: RecruiterSimProbe[] = [
  {
    id: 'pr-1',
    projectTitle: 'Corassist AI Engine & Campus GIS',
    interviewerQuestion: 'You listed "Corassist AI Engine" on your resume. How did you handle fallback state management when the backend API timed out?',
    suggestedTalkingPoints: [
      'Implemented a 3.5s AbortController timeout threshold on fetch requests.',
      'Designed a local client-side enclave fallback state in aiRoutingService.ts to serve cached mock state.',
      'Maintained 100% UI stability during Render backend cold starts with zero user crash reports.',
    ],
  },
  {
    id: 'pr-2',
    projectTitle: 'Realtime Governance Ledger',
    interviewerQuestion: 'How did you prevent replay attacks in your cryptographic receipt verification pipeline?',
    suggestedTalkingPoints: [
      'SHA-256 hash payload chained with unique timestamp & nonce string.',
      'Cryptographic verification via client-side web crypto subtle API.',
      'Immutable log verification table with instant audit draw modal.',
    ],
  },
];

export const PlacementDashboard: React.FC = () => {
  const {
    student,
    placementDrives,
    digitalTwins,
    setIsRecruiterModalOpen,
    setIsInterviewModalOpen,
    triggerPlacementApplication,
    placementDraft,
  } = useApp();

  // State Management for Placement Command Center
  const [atsBreakdown, setAtsBreakdown] = useState<AtsScoreBreakdown>(INITIAL_ATS_BREAKDOWN);
  const [resumeDiffs] = useState<ResumeDiffItem[]>(INITIAL_RESUME_DIFFS);
  const [skillGaps, setSkillGaps] = useState<SkillGapItem[]>(INITIAL_SKILL_GAPS);
  const [recruiterProbes] = useState<RecruiterSimProbe[]>(INITIAL_PROBES);

  // Upload Loader State
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStepIndex, setUploadStepIndex] = useState(0);

  // Active Diff Rationale Popup State
  const [activeRationaleId, setActiveRationaleId] = useState<string | null>(null);

  // Recruiter Simulation Chat State
  const [activeProbeIndex, setActiveProbeIndex] = useState(0);
  const [candidateResponse, setCandidateResponse] = useState('');
  const [simulationLog, setSimulationLog] = useState<{ role: 'interviewer' | 'candidate' | 'feedback'; text: string }[]>([
    {
      role: 'interviewer',
      text: 'Hello Alex! I reviewed your resume. You listed "Corassist AI Engine" on your resume. How did you handle fallback state management when the backend API timed out?',
    },
  ]);
  const [simFeedback, setSimFeedback] = useState<{ risks: string[]; actions: string[] } | null>(null);

  // Auto-Update Notification Banner State
  const [autoUpdateNotice, setAutoUpdateNotice] = useState<string | null>(
    'Graph Traversal score dropped to 42%. Automatically shifting Graph Algorithms to Day 1 of your Microsoft Prep Roadmap.'
  );

  // Seed Profile Button Handler
  const handleSeedAlexRivera = () => {
    setIsUploading(true);
    setUploadStepIndex(0);

    const steps = [
      'Parsing Resume Text...',
      'Extracting Technical Entities...',
      'Evaluating ATS Compatibility Engine...',
      'Generating Placement Readiness Metrics...',
      'Profile Seed Ready ✓',
    ];

    steps.forEach((_, idx) => {
      setTimeout(() => {
        setUploadStepIndex(idx);
        if (idx === steps.length - 1) {
          setIsUploading(false);
          setAtsBreakdown({
            overallScore: 89,
            keywordMatchPct: 94,
            formattingPct: 98,
            skillsPct: 88,
            projectImpactPct: 82,
            missingKeywords: ['System Design Fundamentals', 'Distributed Locks'],
          });
          setSkillGaps((prev) =>
            prev.map((s) => (s.skillName.includes('Trees') ? { ...s, currentScore: 78, gap: -7 } : s))
          );
        }
      }, (idx + 1) * 400);
    });
  };

  // Resume File Upload Handler Simulation
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadStepIndex(0);

    const steps = [
      `Parsing ${file.name}...`,
      'Extracting Work Experience & Quantified Metrics...',
      'Comparing Keywords with Target Company Requirements...',
      'Generating Impact Score & Formatting Rating...',
      'ATS Resume Analysis Complete ✓',
    ];

    steps.forEach((_, idx) => {
      setTimeout(() => {
        setUploadStepIndex(idx);
        if (idx === steps.length - 1) {
          setIsUploading(false);
        }
      }, (idx + 1) * 450);
    });
  };

  // Send Candidate Answer in AI Recruiter Simulation
  const handleSendCandidateResponse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!candidateResponse.trim()) return;

    const userText = candidateResponse;
    setCandidateResponse('');

    setSimulationLog((prev) => [
      ...prev,
      { role: 'candidate', text: userText },
      {
        role: 'feedback',
        text: '✅ Excellent defense! You clearly articulated the 3.5s AbortController threshold and client-side enclave state resilience.',
      },
    ]);

    // Generate Post-Interview Diagnostics
    setSimFeedback({
      risks: [
        'Could elaborate further on exact Redis cache eviction policies.',
        'Initial explanation lacked explicit mention of horizontal scaling limits.',
        'Need deeper familiarity with C++ memory pointers for low-level systems rounds.',
      ],
      actions: [
        'Practice 5 Medium System Design questions on Distributed Caching.',
        'Add quantified latency reduction metrics to Project 2 bullet points.',
        'Conduct a 15-minute mock interview session on C++ STL Containers.',
      ],
    });
  };

  const uploadStepsLabels = [
    'Parsing Text & Entities',
    'Extracting Experience',
    'Evaluating ATS Keywords',
    'Generating Impact Score',
    'Analysis Ready',
  ];

  return (
    <div className="h-full overflow-y-auto p-4 sm:p-6 space-y-6 bg-transparent text-slate-100 font-sans select-none pb-12">
      {/* Top Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 zeno-glass-card border border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
            <GraduationCap className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-extrabold text-white">Placement Command Center</h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                [AGENT: PLACEMENT_PIPELINE]
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              ATS Resume Diagnostics • Skill Gap Matrix • Visual Career Roadmap • AI Recruiter Defense Simulator
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={handleSeedAlexRivera}
            disabled={isUploading}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-mono text-xs font-extrabold shadow-[0_0_15px_rgba(16,185,129,0.4)] transition-all flex items-center space-x-2 disabled:opacity-50"
          >
            <Zap className="w-4 h-4 fill-amber-300 text-amber-300" />
            <span>⚡ Seed Alex Rivera Profile (Microsoft SDE)</span>
          </button>
          <button
            onClick={() => setIsRecruiterModalOpen(true)}
            className="px-3.5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl border border-slate-700 transition-all flex items-center space-x-1.5"
          >
            <UserCheck className="w-4 h-4 text-cyan-400" />
            <span>Recruiter Modal</span>
          </button>
          <button
            onClick={() => setIsInterviewModalOpen(true)}
            className="px-3.5 py-2.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-bold rounded-xl border border-emerald-500/40 transition-all flex items-center space-x-1.5"
          >
            <Play className="w-4 h-4 text-emerald-400" />
            <span>Interview Coach</span>
          </button>
        </div>
      </div>

      {/* Adaptive Auto-Update Alert Banner */}
      {autoUpdateNotice && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/40 text-amber-300 text-xs font-mono flex items-center justify-between animate-fadeIn shadow-lg">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{autoUpdateNotice}</span>
          </div>
          <button onClick={() => setAutoUpdateNotice(null)} className="text-xs text-slate-400 hover:text-white underline">
            Dismiss
          </button>
        </div>
      )}

      {/* 4 CORE COMMAND CENTER MODULES GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: MODULE A (ATS Analyzer) & MODULE B (Skill Gap Matrix) */}
        <div className="lg:col-span-7 space-y-6">
          {/* ------------------------------------------------------------- */}
          {/* MODULE A: Universal Resume Parsing & ATS Analyzer */}
          {/* ------------------------------------------------------------- */}
          <div className="zeno-glass-card p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-sm uppercase tracking-wider text-white flex items-center space-x-2">
                <FileCode className="w-4 h-4 text-emerald-400" />
                <span>Module A: Universal Resume Parsing & ATS Analyzer</span>
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold">
                TIER-1 ATS ENGINE
              </span>
            </div>

            {/* Drag & Drop Upload Zone */}
            <div className="relative border-2 border-dashed border-emerald-500/30 hover:border-emerald-500/60 rounded-2xl p-5 text-center bg-slate-950/60 transition-all cursor-pointer">
              <input
                type="file"
                accept=".pdf,.docx,.txt"
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="flex flex-col items-center justify-center space-y-1.5">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Upload className="w-5 h-5" />
                </div>
                <div className="text-xs font-bold text-slate-200">
                  Upload Resume (.pdf, .docx, .txt) for Instant ATS Scoring
                </div>
                <div className="text-[10px] text-slate-400 font-mono">Real-time keyword matching against Microsoft, Google & Tier-1 tech drives</div>
              </div>
            </div>

            {/* Multi-Stage Loader */}
            {isUploading && (
              <div className="p-4 rounded-xl bg-slate-900 border border-emerald-500/40 space-y-2 font-mono text-xs">
                <div className="flex items-center justify-between text-emerald-300 font-bold">
                  <span className="flex items-center space-x-2">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                    <span>{uploadStepsLabels[uploadStepIndex]}</span>
                  </span>
                  <span>{(uploadStepIndex + 1) * 20}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 transition-all duration-300" style={{ width: `${(uploadStepIndex + 1) * 20}%` }} />
                </div>
              </div>
            )}

            {/* ATS Compatibility Breakdown Card */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 font-mono">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Overall ATS Score</div>
                  <div className="text-3xl font-extrabold text-emerald-400">{atsBreakdown.overallScore} / 100</div>
                </div>
                <div className="text-right">
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/30">
                    EXCELLENT COMPATIBILITY
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs pt-1">
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="text-[10px] text-slate-400">Keyword Match</div>
                  <div className="font-bold text-cyan-400 mt-0.5">{atsBreakdown.keywordMatchPct}%</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="text-[10px] text-slate-400">Formatting</div>
                  <div className="font-bold text-emerald-400 mt-0.5">{atsBreakdown.formattingPct}%</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="text-[10px] text-slate-400">Skills Rating</div>
                  <div className="font-bold text-purple-400 mt-0.5">{atsBreakdown.skillsPct}%</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="text-[10px] text-slate-400">Project Impact</div>
                  <div className="font-bold text-amber-400 mt-0.5">{atsBreakdown.projectImpactPct}%</div>
                </div>
              </div>

              {/* Critical Warnings */}
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs space-y-1">
                <div className="font-bold flex items-center space-x-1.5">
                  <X className="w-4 h-4 text-rose-400" />
                  <span>Critical Warning: Missing target role keywords</span>
                </div>
                <div className="flex flex-wrap gap-1 pt-1">
                  {atsBreakdown.missingKeywords.map((kw, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-200 border border-rose-500/40 text-[10px] font-bold">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Resume Change Tracker (Diff View) */}
            <div className="space-y-3 font-mono">
              <div className="text-xs font-bold text-slate-300 flex items-center justify-between">
                <span>Resume Enhancement Diff Tracker (Before vs. After):</span>
                <span className="text-[10px] text-emerald-400">2 SUGGESTED FIXES</span>
              </div>

              {resumeDiffs.map((diff) => (
                <div key={diff.id} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                  <div className="flex items-center justify-between font-bold text-slate-300 border-b border-slate-900 pb-1.5">
                    <span>{diff.section}</span>
                    <button
                      onClick={() => setActiveRationaleId(activeRationaleId === diff.id ? null : diff.id)}
                      className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/30 font-bold"
                    >
                      [Why this change?]
                    </button>
                  </div>

                  <div className="space-y-1 text-[11px]">
                    <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 font-mono">
                      <span className="font-bold text-rose-400 mr-1.5">- BEFORE:</span>
                      {diff.beforeText}
                    </div>
                    <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-mono">
                      <span className="font-bold text-emerald-400 mr-1.5">+ AFTER:</span>
                      {diff.afterText}
                    </div>
                  </div>

                  {activeRationaleId === diff.id && (
                    <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-200 text-[10px] leading-relaxed animate-fadeIn">
                      <span className="font-bold text-cyan-400 uppercase">AI Rationale: </span>
                      {diff.rationale}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ------------------------------------------------------------- */}
          {/* MODULE B: Placement Readiness Radar & Skill Gap Matrix */}
          {/* ------------------------------------------------------------- */}
          <div className="zeno-glass-card p-5 space-y-4 font-mono">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-sm uppercase tracking-wider text-white flex items-center space-x-2">
                <Target className="w-4 h-4 text-cyan-400" />
                <span>Module B: Placement Readiness Radar & Skill Gap Matrix</span>
              </h3>
              <span className="text-[10px] font-mono text-cyan-400 font-bold">REALTIME MATRIX</span>
            </div>

            {/* Readiness Telemetry Gauge Cluster */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-[10px] text-slate-400">DSA Score</div>
                <div className="text-lg font-bold text-amber-400 mt-1">64 / 100</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-[10px] text-slate-400">Core CS</div>
                <div className="text-lg font-bold text-cyan-400 mt-1">71 / 100</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-[10px] text-slate-400">Projects</div>
                <div className="text-lg font-bold text-emerald-400 mt-1">82 / 100</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-[10px] text-slate-400">Interview</div>
                <div className="text-lg font-bold text-rose-400 mt-1">59 / 100</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-[10px] text-slate-400">Git / Systems</div>
                <div className="text-lg font-bold text-purple-400 mt-1">84 / 100</div>
              </div>
            </div>

            {/* Skill Gap Matrix Table */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-300">Target Company Skill Gap Matrix (Microsoft / Google SDE):</div>
              <div className="space-y-2 text-xs">
                {skillGaps.map((sg) => (
                  <div key={sg.id} className="p-3 rounded-xl bg-slate-950 border border-slate-850 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-white">{sg.skillName}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        Current: {sg.currentScore} | Target: {sg.requiredScore} | Gap: {sg.gap > 0 ? `+${sg.gap}` : sg.gap}
                      </div>
                    </div>
                    <div>
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                          sg.priorityLevel === 'CRITICAL DANGER'
                            ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                            : sg.priorityLevel === 'HIGH PRIORITY'
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                            : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        }`}
                      >
                        {sg.priorityLevel}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: MODULE C (Career Roadmap) & MODULE D (Recruiter Simulation) */}
        <div className="lg:col-span-5 space-y-6">
          {/* ------------------------------------------------------------- */}
          {/* MODULE C: Visual Interactive Career Roadmap */}
          {/* ------------------------------------------------------------- */}
          <div className="zeno-glass-card p-5 space-y-4 font-mono">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-sm uppercase tracking-wider text-white flex items-center space-x-2">
                <Layers className="w-4 h-4 text-purple-400" />
                <span>Module C: Visual Interactive Career Roadmap</span>
              </h3>
              <span className="text-[10px] font-mono text-purple-400 font-bold">ADAPTIVE FLOW</span>
            </div>

            {/* Visual Tree Node Map Flowchart */}
            <div className="p-4 rounded-2xl bg-[#05070A] border border-slate-800 space-y-3 relative overflow-hidden">
              <div className="text-xs font-bold text-slate-300 text-center">Interactive Career Flowchart</div>
              <svg viewBox="0 0 400 220" className="w-full h-48">
                {/* Flowchart Connectors */}
                <line x1="200" y1="35" x2="200" y2="75" stroke="#10B981" strokeWidth="2" strokeDasharray="3 3" />
                <line x1="200" y1="95" x2="110" y2="135" stroke="#F59E0B" strokeWidth="2" strokeDasharray="3 3" />
                <line x1="200" y1="95" x2="290" y2="135" stroke="#00F0FF" strokeWidth="2" strokeDasharray="3 3" />
                <line x1="110" y1="155" x2="200" y2="190" stroke="#A855F7" strokeWidth="2" strokeDasharray="3 3" />
                <line x1="290" y1="155" x2="200" y2="190" stroke="#A855F7" strokeWidth="2" strokeDasharray="3 3" />

                {/* Node 1: Target Role */}
                <g transform="translate(200, 25)">
                  <rect x="-60" y="-12" width="120" height="24" rx="12" fill="rgba(16,185,129,0.2)" stroke="#10B981" strokeWidth="2" />
                  <text y="4" fill="#10B981" fontSize="9" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
                    TARGET: Microsoft SDE
                  </text>
                </g>

                {/* Node 2: Skill Gap Identification */}
                <g transform="translate(200, 85)">
                  <rect x="-65" y="-12" width="130" height="24" rx="12" fill="rgba(245,158,11,0.2)" stroke="#F59E0B" strokeWidth="2" />
                  <text y="4" fill="#F59E0B" fontSize="8" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
                    Skill Gap Analysis (-23 Gap)
                  </text>
                </g>

                {/* Branch Node 3A: Action Items */}
                <g transform="translate(110, 145)">
                  <rect x="-55" y="-12" width="110" height="24" rx="12" fill="rgba(244,63,94,0.2)" stroke="#F43F5E" strokeWidth="2" />
                  <text y="4" fill="#F43F5E" fontSize="8" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
                    Day 1: Trees & Graphs
                  </text>
                </g>

                {/* Branch Node 3B: System Design */}
                <g transform="translate(290, 145)">
                  <rect x="-55" y="-12" width="110" height="24" rx="12" fill="rgba(0,240,255,0.2)" stroke="#00F0FF" strokeWidth="2" />
                  <text y="4" fill="#00F0FF" fontSize="8" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
                    Day 6: System Design
                  </text>
                </g>

                {/* Node 4: Placement Ready */}
                <g transform="translate(200, 195)">
                  <rect x="-60" y="-12" width="120" height="24" rx="12" fill="rgba(168,85,247,0.2)" stroke="#A855F7" strokeWidth="2" />
                  <text y="4" fill="#A855F7" fontSize="9" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
                    READY FOR DISPATCH ✓
                  </text>
                </g>
              </svg>
            </div>
          </div>

          {/* ------------------------------------------------------------- */}
          {/* MODULE D: AI Recruiter Simulation & Resume Defense Mode */}
          {/* ------------------------------------------------------------- */}
          <div className="zeno-glass-card p-5 space-y-4 font-mono">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-sm uppercase tracking-wider text-white flex items-center space-x-2">
                <MessageSquare className="w-4 h-4 text-emerald-400" />
                <span>Module D: AI Recruiter Simulation & Defense Mode</span>
              </h3>
              <span className="text-[10px] font-mono text-emerald-400 font-bold">HIRING MANAGER MODE</span>
            </div>

            {/* Recruiter Simulation Chat Log */}
            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 max-h-64 overflow-y-auto text-xs">
              {simulationLog.map((item, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-xl border leading-relaxed ${
                    item.role === 'interviewer'
                      ? 'bg-purple-500/10 border-purple-500/30 text-purple-200'
                      : item.role === 'candidate'
                      ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-200 ml-4'
                      : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  }`}
                >
                  <div className="font-bold text-[10px] uppercase mb-1">
                    {item.role === 'interviewer' ? 'HIRING MANAGER:' : item.role === 'candidate' ? 'YOU (ALEX RIVERA):' : 'AI EVALUATION:'}
                  </div>
                  <div>{item.text}</div>
                </div>
              ))}
            </div>

            {/* Candidate Response Form */}
            <form onSubmit={handleSendCandidateResponse} className="flex items-center space-x-2">
              <input
                type="text"
                value={candidateResponse}
                onChange={(e) => setCandidateResponse(e.target.value)}
                placeholder="Defend your resume project architecture..."
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/60 font-mono"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs shrink-0 transition-all"
              >
                Respond
              </button>
            </form>

            {/* Suggested Talking Points Hint */}
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-850 text-xs space-y-1">
              <div className="font-bold text-amber-300 flex items-center space-x-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Suggested Resume Defense Talking Points:</span>
              </div>
              <ul className="list-disc list-inside text-[11px] text-slate-400 space-y-0.5 pt-0.5">
                {recruiterProbes[activeProbeIndex].suggestedTalkingPoints.map((tp, idx) => (
                  <li key={idx}>{tp}</li>
                ))}
              </ul>
            </div>

            {/* Post-Interview Diagnostics */}
            {simFeedback && (
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 text-xs animate-fadeIn">
                <div className="font-bold text-white border-b border-slate-800 pb-1.5">
                  Post-Interview AI Diagnostics & Rejection Risk Report:
                </div>

                <div className="space-y-1.5">
                  <div className="text-[11px] font-bold text-rose-400">Top 3 Rejection Risk Factors:</div>
                  {simFeedback.risks.map((r, i) => (
                    <div key={i} className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-[10px]">
                      • {r}
                    </div>
                  ))}
                </div>

                <div className="space-y-1.5">
                  <div className="text-[11px] font-bold text-emerald-400">Top 3 Immediate Corrective Actions:</div>
                  {simFeedback.actions.map((a, i) => (
                    <div key={i} className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[10px]">
                      • {a}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
