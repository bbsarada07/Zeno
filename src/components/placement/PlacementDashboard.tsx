import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Award, CheckCircle2, AlertTriangle, ArrowRight, ShieldCheck, UserCheck, Play } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MOCK_SKILL_RADAR } from '../../data/mockData';

export const PlacementDashboard: React.FC = () => {
  const {
    student,
    placementDrives,
    digitalTwins,
    setIsRecruiterModalOpen,
    setIsInterviewModalOpen,
    setIsHitlDrawerOpen,
  } = useApp();

  return (
    <div className="h-full overflow-y-auto p-4 sm:p-6 space-y-6 bg-background text-foreground">
      {/* Placement Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-card border border-border">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-400 uppercase tracking-widest mb-1">
            <GraduationCap className="w-4 h-4" />
            <span>Autonomous Placement Intelligence Sub-System</span>
          </div>
          <h2 className="text-xl font-bold">Placement & Digital Twin Workspace</h2>
          <p className="text-xs text-muted-foreground mt-1">
            Readiness scoring, digital twin career simulations, and 1-click agent application for {student.name} ({student.rollNumber}).
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsRecruiterModalOpen(true)}
            className="px-4 py-2 bg-muted hover:bg-muted/80 text-foreground text-xs font-semibold rounded-xl border border-border transition-all flex items-center space-x-1.5"
          >
            <UserCheck className="w-4 h-4" />
            <span>Recruiter Simulator</span>
          </button>
          <button
            onClick={() => setIsInterviewModalOpen(true)}
            className="px-4 py-2 bg-primary text-primary-foreground text-xs font-semibold rounded-xl hover:opacity-90 transition-all flex items-center space-x-1.5 shadow-sm"
          >
            <Play className="w-4 h-4" />
            <span>Interview Coach</span>
          </button>
        </div>
      </div>

      {/* Readiness Gauge Cluster */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-card border border-border space-y-2">
          <div className="text-xs text-muted-foreground font-semibold">Overall Placement Score</div>
          <div className="text-3xl font-extrabold font-mono text-emerald-400">{student.overallPlacementScore}%</div>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${student.overallPlacementScore}%` }} />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-card border border-border space-y-2">
          <div className="text-xs text-muted-foreground font-semibold">ATS Resume Match</div>
          <div className="text-3xl font-extrabold font-mono text-blue-400">{student.resumeScore}%</div>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-blue-400 rounded-full" style={{ width: `${student.resumeScore}%` }} />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-card border border-border space-y-2">
          <div className="text-xs text-muted-foreground font-semibold">Technical Mastery</div>
          <div className="text-3xl font-extrabold font-mono text-purple-400">{student.technicalScore}%</div>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-purple-400 rounded-full" style={{ width: `${student.technicalScore}%` }} />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-card border border-border space-y-2">
          <div className="text-xs text-muted-foreground font-semibold">Interview Readiness</div>
          <div className="text-3xl font-extrabold font-mono text-amber-400">{student.interviewScore}%</div>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-amber-400 rounded-full" style={{ width: `${student.interviewScore}%` }} />
          </div>
        </div>
      </div>

      {/* Digital Twin Simulations */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Digital Twin Career Path Simulations</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {digitalTwins.map((dt) => (
            <div key={dt.id} className="p-5 rounded-2xl bg-card border border-border space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-base">{dt.title}</h4>
                  <p className="text-xs text-muted-foreground">{dt.roleCategory}</p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-mono font-bold border border-emerald-500/20">
                  {dt.readinessPercentage}% Match
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-3 rounded-xl bg-background border border-border">
                  <div className="text-[10px] text-muted-foreground">Salary Target</div>
                  <div className="font-bold font-mono text-foreground mt-0.5">{dt.avgSalaryRange}</div>
                </div>
                <div className="p-3 rounded-xl bg-background border border-border">
                  <div className="text-[10px] text-muted-foreground">Market Demand</div>
                  <div className="font-bold font-mono text-emerald-400 mt-0.5">{dt.industryDemand}</div>
                </div>
              </div>

              <div className="space-y-1 text-xs">
                <span className="text-muted-foreground font-medium">Missing Skill Prerequisites:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {dt.missingSkills.map((sk, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[11px]">
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
        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Ranked Active Placement Drives</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {placementDrives.map((drive) => (
            <div key={drive.id} className="p-5 rounded-2xl bg-card border border-border space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="text-3xl">{drive.logo}</div>
                  <div>
                    <h4 className="font-bold text-sm">{drive.companyName}</h4>
                    <p className="text-xs text-muted-foreground">{drive.roleTitle}</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-mono font-bold border border-primary/20">
                  {drive.ctc}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs pt-1 text-muted-foreground">
                <span>Location: {drive.location}</span>
                <span>Deadline: {drive.deadline}</span>
              </div>

              <button
                onClick={() => setIsHitlDrawerOpen(true)}
                className="w-full py-2 bg-primary text-primary-foreground text-xs font-semibold rounded-xl hover:opacity-90 transition-all flex items-center justify-center space-x-2 shadow-sm"
              >
                <span>Apply via Agent (HITL Gate)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
