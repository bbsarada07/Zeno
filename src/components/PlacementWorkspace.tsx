import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  GraduationCap,
  Upload,
  Zap,
  ExternalLink,
  Video,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Target,
  Sparkles,
  RefreshCw,
  Code,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { analyzePlacementProfile } from '../services/placementAgentService';
import type { PlacementAnalysisResult } from '../services/placementAgentService';

const SAMPLE_ALEX_RIVERA_RESUME = `
ALEX RIVERA
Roll No: 2451-22-733-001 | Email: alex.rivera@csm.edu.in | CGPA: 8.84 / 10.0
B.Tech Computer Science & Engineering - VCE

TECHNICAL SKILLS:
- Languages: Python, JavaScript, HTML/CSS, SQL
- Frameworks: React.js, Express, FastAPI, Tailwind CSS
- Databases & Tools: MongoDB, PostgreSQL, Git, VS Code, Postman
- Coursework: Data Structures, Operating Systems, Database Management Systems

PROJECTS:
1. Corassist AI Engine & Campus GIS:
   - Developed multi-agent intent router using React & Python FastAPI.
   - Integrated spatial GIS indoor floor mapping for campus lab navigation.
2. Cryptographic Receipt Ledger:
   - Implemented SHA-256 hash verification for automated administrative workflow logging.

PRACTICE & ACHIEVEMENTS:
- Solved 45 LeetCode DSA problems (Arrays, Linked Lists, Stacks).
- Dean's List Honor Student (Semester IV & V).
`;

export const PlacementWorkspace: React.FC = () => {
  const [resumeInput, setResumeInput] = useState<string>(SAMPLE_ALEX_RIVERA_RESUME);
  const [targetRole, setTargetRole] = useState<string>('Software Engineer - AI Systems');
  const [analysisResult, setAnalysisResult] = useState<PlacementAnalysisResult>(
    analyzePlacementProfile(SAMPLE_ALEX_RIVERA_RESUME, 'Software Engineer - AI Systems')
  );
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  // Seed Alex Rivera Demo Button Handler
  const handleSeedAlexRivera = () => {
    setResumeInput(SAMPLE_ALEX_RIVERA_RESUME);
    handleAnalyze(SAMPLE_ALEX_RIVERA_RESUME);
  };

  // Run Profile Analysis
  const handleAnalyze = (textToAnalyze: string = resumeInput) => {
    setIsAnalyzing(true);
    setTimeout(() => {
      const result = analyzePlacementProfile(textToAnalyze, targetRole);
      setAnalysisResult(result);
      setIsAnalyzing(false);
    }, 500);
  };

  // Resume File Upload Simulation
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setResumeInput(content);
        handleAnalyze(content);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 font-sans select-none text-slate-100 pb-12">
      {/* Top Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 zeno-glass-card border border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
            <GraduationCap className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-extrabold text-white">Placement Agent Control Enclave</h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                [AGENT: PLACEMENT_PIPELINE]
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Structured Resume Parser • Skill Gap Matrix • Clickable Resource Mapping • ATS Telemetry
            </p>
          </div>
        </div>

        <button
          onClick={handleSeedAlexRivera}
          disabled={isAnalyzing}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-mono text-xs font-extrabold shadow-[0_0_15px_rgba(16,185,129,0.4)] transition-all flex items-center space-x-2 shrink-0 disabled:opacity-50"
        >
          <Zap className="w-4 h-4 fill-amber-300 text-amber-300" />
          <span>⚡ Seed Alex Rivera Resume</span>
        </button>
      </div>

      {/* Voice Activation Response Banner */}
      <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono space-y-1.5 shadow-lg">
        <div className="flex items-center space-x-2 text-emerald-300 font-bold">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>Placement Agent Voice Protocol:</span>
        </div>
        <p className="text-slate-200 font-bold leading-relaxed">"{analysisResult.speechText}"</p>
      </div>

      {/* 2-COLUMN MAIN LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: Resume Input & ATS Telemetry */}
        <div className="lg:col-span-5 space-y-6">
          {/* Resume Text & Drag/Drop Card */}
          <div className="zeno-glass-card p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-sm uppercase tracking-wider text-white flex items-center space-x-2">
                <FileText className="w-4 h-4 text-emerald-400" />
                <span>Resume Input & Parser Dropzone</span>
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold">
                PARSER READY
              </span>
            </div>

            {/* Target Role Input */}
            <div className="space-y-1 font-mono text-xs">
              <label className="text-slate-400 font-bold">Target Job Role:</label>
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold focus:outline-none focus:border-emerald-500/50"
              />
            </div>

            {/* File Drag/Drop Input */}
            <div className="relative border-2 border-dashed border-emerald-500/30 hover:border-emerald-500/60 rounded-2xl p-4 text-center bg-slate-950/60 transition-all cursor-pointer">
              <input
                type="file"
                accept=".txt,.pdf,.doc,.docx"
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="flex flex-col items-center justify-center space-y-1">
                <Upload className="w-5 h-5 text-emerald-400" />
                <div className="text-xs font-bold text-slate-200">Upload Resume File (.txt, .pdf)</div>
                <div className="text-[10px] text-slate-500 font-mono">Or paste plain resume text below</div>
              </div>
            </div>

            {/* Textarea */}
            <div className="space-y-2">
              <textarea
                value={resumeInput}
                onChange={(e) => setResumeInput(e.target.value)}
                rows={7}
                placeholder="Paste candidate resume text here..."
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500/50 leading-relaxed"
              />

              <button
                onClick={() => handleAnalyze()}
                disabled={isAnalyzing}
                className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all flex items-center justify-center space-x-2 shadow-[0_0_15px_rgba(16,185,129,0.3)] disabled:opacity-50"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Analyzing Resume Metrics...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Run Structured ATS & Gap Analysis</span>
                  </>
                )}
              </button>
            </div>

            {/* Extracted Skills Summary Badges */}
            <div className="space-y-2 font-mono text-xs border-t border-slate-800 pt-3">
              <div className="text-slate-400 font-bold">Extracted Skill Keywords:</div>
              <div className="flex flex-wrap gap-1.5">
                {[
                  ...analysisResult.extractedSkills.languages,
                  ...analysisResult.extractedSkills.frameworks,
                  ...analysisResult.extractedSkills.databases,
                  ...analysisResult.extractedSkills.tools,
                ].map((skill, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-emerald-300 font-bold text-[11px]">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* ATS Telemetry Gauge Card */}
          <div className="zeno-glass-card p-5 space-y-4 font-mono">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-sm uppercase tracking-wider text-white flex items-center space-x-2">
                <Target className="w-4 h-4 text-cyan-400" />
                <span>ATS Telemetry Breakdown Gauge</span>
              </h3>
              <span className="text-[10px] font-mono text-cyan-400 font-bold">TIER-1 VERIFIED</span>
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-bold">Overall ATS Score</div>
                <div className="text-3xl font-extrabold text-emerald-400 mt-1">{analysisResult.atsScore} / 100</div>
              </div>
              <div className="text-right">
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/30">
                  TIER-1 ATS READY
                </span>
              </div>
            </div>

            {/* 4 Score Pillars */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-[10px] text-slate-400">Keyword Match</div>
                <div className="text-base font-bold text-cyan-400 mt-0.5">91%</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-[10px] text-slate-400">Formatting</div>
                <div className="text-base font-bold text-emerald-400 mt-0.5">96%</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-[10px] text-slate-400">Skills Alignment</div>
                <div className="text-base font-bold text-purple-400 mt-0.5">84%</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-[10px] text-slate-400">Project Impact</div>
                <div className="text-base font-bold text-amber-400 mt-0.5">78%</div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Skill Gap Matrix Table & Visual Interactive Roadmap */}
        <div className="lg:col-span-7 space-y-6 font-mono">
          {/* Skill Gap Comparative Matrix Table */}
          <div className="zeno-glass-card p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-sm uppercase tracking-wider text-white flex items-center space-x-2">
                <Layers className="w-4 h-4 text-purple-400" />
                <span>Skill Gap Comparative Matrix & Verified Resource Links</span>
              </h3>
              <span className="text-[10px] font-mono text-purple-400 font-bold">4 TECH PILLARS</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                    <th className="py-2.5 px-3">Skill Topic</th>
                    <th className="py-2.5 px-3">Current</th>
                    <th className="py-2.5 px-3">Required</th>
                    <th className="py-2.5 px-3">Gap Status</th>
                    <th className="py-2.5 px-3 text-right">Verified Resource Links</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850">
                  {analysisResult.skillGaps.map((item, idx) => {
                    const gapValue = item.current - item.required;
                    const isMatched = gapValue >= 0;

                    return (
                      <tr key={idx} className="hover:bg-slate-900/40 transition-colors">
                        <td className="py-3 px-3 font-bold text-white max-w-[180px]">{item.skill}</td>
                        <td className="py-3 px-3 font-bold text-amber-400">{item.current}%</td>
                        <td className="py-3 px-3 font-bold text-slate-300">{item.required}%</td>
                        <td className="py-3 px-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                              isMatched
                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                : item.priority === 'HIGH'
                                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                                : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                            }`}
                          >
                            {isMatched ? '🟢 MATCHED ✓' : `🔴 ${gapValue}% Gap`}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right space-x-1">
                          <a
                            href={item.roadmapUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center space-x-1 px-2 py-1 rounded bg-slate-900 hover:bg-cyan-500/20 border border-slate-800 hover:border-cyan-500/40 text-[10px] text-cyan-300 transition-all font-bold"
                          >
                            <span>Roadmap</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                          <a
                            href={item.docsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center space-x-1 px-2 py-1 rounded bg-slate-900 hover:bg-purple-500/20 border border-slate-800 hover:border-purple-500/40 text-[10px] text-purple-300 transition-all font-bold"
                          >
                            <span>Docs</span>
                            <BookOpen className="w-3 h-3" />
                          </a>
                          {item.youtubeUrl && (
                            <a
                              href={item.youtubeUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center space-x-1 px-2 py-1 rounded bg-slate-900 hover:bg-rose-500/20 border border-slate-800 hover:border-rose-500/40 text-[10px] text-rose-300 transition-all font-bold"
                            >
                              <span>YT</span>
                              <Video className="w-3 h-3" />
                            </a>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Visual Interactive Skill Roadmap Node Chart */}
          <div className="zeno-glass-card p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-sm uppercase tracking-wider text-white flex items-center space-x-2">
                <Code className="w-4 h-4 text-emerald-400" />
                <span>Visual Interactive Skill Roadmap (Click Nodes for Resources)</span>
              </h3>
              <span className="text-[10px] font-mono text-emerald-400 font-bold">CLICKABLE NODES</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#030712] border border-slate-800 space-y-3 relative overflow-hidden">
              <div className="text-xs text-slate-400 font-bold text-center">Interactive Placement Readiness Roadmap Flow</div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2">
                {/* Node 1: Current State */}
                <div className="p-3 rounded-2xl bg-slate-950 border border-amber-500/40 space-y-2 text-center">
                  <div className="text-[10px] text-amber-400 font-bold uppercase">STEP 1: CURRENT STATE</div>
                  <div className="text-xs text-white font-bold">Alex Rivera Profile</div>
                  <div className="text-[10px] text-slate-500">CGPA 8.84 • 45 LeetCode</div>
                </div>

                {/* Node 2: Skill Gaps */}
                <a
                  href="https://roadmap.sh/datastructures-and-algorithms"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/40 space-y-2 text-center transition-all cursor-pointer group"
                >
                  <div className="text-[10px] text-rose-400 font-bold uppercase flex items-center justify-center space-x-1">
                    <span>STEP 2: GAP</span>
                    <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                  <div className="text-xs text-rose-200 font-bold">Advanced DSA & Graphs</div>
                  <div className="text-[10px] text-rose-300 font-mono">-40% Gap • Click for Roadmap</div>
                </a>

                {/* Node 3: Practice Tasks */}
                <a
                  href="https://roadmap.sh/system-design"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-2xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/40 space-y-2 text-center transition-all cursor-pointer group"
                >
                  <div className="text-[10px] text-purple-400 font-bold uppercase flex items-center justify-center space-x-1">
                    <span>STEP 3: TASKS</span>
                    <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                  <div className="text-xs text-purple-200 font-bold">System Design & REST</div>
                  <div className="text-[10px] text-purple-300 font-mono">-35% Gap • Click for Guide</div>
                </a>

                {/* Node 4: Target Readiness */}
                <a
                  href="https://sqlbolt.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/40 space-y-2 text-center transition-all cursor-pointer group"
                >
                  <div className="text-[10px] text-emerald-400 font-bold uppercase flex items-center justify-center space-x-1">
                    <span>STEP 4: READY</span>
                    <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                  <div className="text-xs text-emerald-200 font-bold">Software Engineer</div>
                  <div className="text-[10px] text-emerald-300 font-mono">94% Target Match</div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
