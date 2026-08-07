import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, ArrowRight, UserCheck, Play, FileText, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

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

  return (
    <div className="h-full overflow-y-auto p-4 sm:p-6 space-y-6 bg-transparent text-slate-100 font-sans select-none">
      {/* Placement Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 zeno-glass-card">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-400 uppercase tracking-widest mb-1">
            <GraduationCap className="w-4 h-4" />
            <span>Autonomous Placement Intelligence Sub-System</span>
          </div>
          <h2 className="text-xl font-bold text-white">Placement & Digital Twin Workspace</h2>
          <p className="text-xs text-slate-400 mt-1">
            Readiness scoring, digital twin career simulations, and 1-click agent application for {student.name} ({student.rollNumber}).
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsRecruiterModalOpen(true)}
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl border border-slate-700 transition-all flex items-center space-x-1.5"
          >
            <UserCheck className="w-4 h-4 text-cyan-400" />
            <span>Recruiter Simulator</span>
          </button>
          <button
            onClick={() => setIsInterviewModalOpen(true)}
            className="px-4 py-2.5 bg-emerald-500 text-slate-950 text-xs font-bold rounded-xl hover:bg-emerald-400 transition-all flex items-center space-x-1.5 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
          >
            <Play className="w-4 h-4" />
            <span>Interview Coach</span>
          </button>
        </div>
      </div>

      {/* Readiness Gauge Cluster */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-5 zeno-glass-card space-y-2">
          <div className="text-xs text-slate-400 font-mono font-semibold">Overall Placement Score</div>
          <div className="text-3xl font-extrabold font-mono text-emerald-400">{student.overallPlacementScore}%</div>
          <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
            <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${student.overallPlacementScore}%` }} />
          </div>
        </div>

        <div className="p-5 zeno-glass-card space-y-2">
          <div className="text-xs text-slate-400 font-mono font-semibold">ATS Resume Match</div>
          <div className="text-3xl font-extrabold font-mono text-cyan-400">{student.resumeScore}%</div>
          <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
            <div className="h-full bg-cyan-400 rounded-full" style={{ width: `${student.resumeScore}%` }} />
          </div>
        </div>

        <div className="p-5 zeno-glass-card space-y-2">
          <div className="text-xs text-slate-400 font-mono font-semibold">Technical Mastery</div>
          <div className="text-3xl font-extrabold font-mono text-purple-400">{student.technicalScore}%</div>
          <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
            <div className="h-full bg-purple-400 rounded-full" style={{ width: `${student.technicalScore}%` }} />
          </div>
        </div>

        <div className="p-5 zeno-glass-card space-y-2">
          <div className="text-xs text-slate-400 font-mono font-semibold">Interview Readiness</div>
          <div className="text-3xl font-extrabold font-mono text-amber-400">{student.interviewScore}%</div>
          <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
            <div className="h-full bg-amber-400 rounded-full" style={{ width: `${student.interviewScore}%` }} />
          </div>
        </div>
      </div>

      {/* Candidate Active Cover Letter Pipeline Preview */}
      <div className="zeno-glass-card p-5 space-y-3 font-mono">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center space-x-2 text-xs font-bold text-cyan-400">
            <FileText className="w-4 h-4" />
            <span>Active Placement Application Draft Pipeline: {placementDraft.companyName} ({placementDraft.roleTitle})</span>
          </div>
          <span className="text-xs text-emerald-400 font-bold flex items-center space-x-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>READY FOR DISPATCH</span>
          </span>
        </div>
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 whitespace-pre-wrap leading-relaxed max-h-40 overflow-y-auto">
          {placementDraft.coverLetterBody}
        </div>
      </div>

      {/* Digital Twin Simulations */}
      <div className="space-y-4">
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">Digital Twin Career Path Simulations</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {digitalTwins.map((dt) => (
            <div key={dt.id} className="p-5 zeno-glass-card space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-base text-white">{dt.title}</h4>
                  <p className="text-xs text-slate-400">{dt.roleCategory}</p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-mono font-bold border border-emerald-500/30">
                  {dt.readinessPercentage}% Match
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-[10px] text-slate-400 font-mono">Salary Target</div>
                  <div className="font-bold font-mono text-white mt-0.5">{dt.avgSalaryRange}</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-[10px] text-slate-400 font-mono">Market Demand</div>
                  <div className="font-bold font-mono text-emerald-400 mt-0.5">{dt.industryDemand}</div>
                </div>
              </div>

              <div className="space-y-1 text-xs font-mono">
                <span className="text-slate-400 font-medium">Missing Skill Prerequisites:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {dt.missingSkills.map((sk, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/30 text-[11px]">
                      {sk}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Ranked Opportunity Drives */}
      <div className="space-y-4">
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">Ranked Active Placement Drives</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {placementDrives.map((drive) => {
            const driveKey = drive.companyName.toLowerCase().includes('google')
              ? 'google'
              : drive.companyName.toLowerCase().includes('microsoft')
              ? 'microsoft'
              : drive.companyName.toLowerCase().includes('amazon')
              ? 'amazon'
              : 'swiggy';

            return (
              <div key={drive.id} className="p-5 zeno-glass-card space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="text-3xl">{drive.logo}</div>
                    <div>
                      <h4 className="font-bold text-sm text-white">{drive.companyName}</h4>
                      <p className="text-xs text-slate-400">{drive.roleTitle}</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-mono font-bold border border-cyan-500/30">
                    {drive.ctc}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs pt-1 text-slate-400 font-mono">
                  <span>Location: {drive.location}</span>
                  <span>Deadline: {drive.deadline}</span>
                </div>

                <button
                  onClick={() => triggerPlacementApplication(driveKey)}
                  className="w-full py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold rounded-xl transition-all flex items-center justify-center space-x-2 shadow-[0_0_15px_rgba(0,240,255,0.3)]"
                >
                  <span>Apply to {drive.companyName} (HITL Gate)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
