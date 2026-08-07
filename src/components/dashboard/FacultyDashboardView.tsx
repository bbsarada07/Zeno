import React from 'react';
import { Users, AlertTriangle, CheckCircle2, FileCheck, Sparkles, TrendingUp } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const FacultyDashboardView: React.FC = () => {
  const { petitions } = useApp();

  return (
    <div className="space-y-6 text-slate-100 font-sans select-none">
      {/* Top Bar Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="zeno-glass-card p-4 flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold flex items-center space-x-1.5">
              <Users className="w-3.5 h-3.5 text-emerald-400" />
              <span>Section CSE-A Student Count</span>
            </div>
            <div className="text-xl font-extrabold font-mono text-emerald-400">64 Students</div>
            <div className="text-[10px] text-slate-400">Semester VI • Academic Year 2025-26</div>
          </div>
        </div>

        <div className="zeno-glass-card p-4 flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold flex items-center space-x-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              <span>Flagged Low-Attendance</span>
            </div>
            <div className="text-xl font-extrabold font-mono text-amber-400">4 Students (&lt;75%)</div>
            <div className="text-[10px] text-slate-400">Automated Condonation Alert</div>
          </div>
        </div>

        <div className="zeno-glass-card p-4 flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold flex items-center space-x-1.5">
              <FileCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>Verification Queue</span>
            </div>
            <div className="text-xl font-extrabold font-mono text-cyan-400">{petitions.length} Pending</div>
            <div className="text-[10px] text-slate-400">Preliminary Faculty Endorsement</div>
          </div>
        </div>
      </div>

      {/* Main Faculty Endorsement Table */}
      <div className="zeno-glass-card p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
          <h3 className="font-extrabold text-sm uppercase tracking-wider text-slate-200 flex items-center space-x-2">
            <FileCheck className="w-4 h-4 text-emerald-400" />
            <span>Class Batch Petition Verification & Recommendation Queue</span>
          </h3>
          <span className="text-xs font-mono text-emerald-400 font-bold">FACULTY ADVISOR PORTAL</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                <th className="pb-3">Student Name</th>
                <th className="pb-3">Roll Number</th>
                <th className="pb-3">Category</th>
                <th className="pb-3">Current %</th>
                <th className="pb-3">AI Certificate OCR</th>
                <th className="pb-3 text-right">Status / Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {petitions.map((pet) => (
                <tr key={pet.id} className="hover:bg-slate-900/40">
                  <td className="py-3 font-bold text-white">{pet.studentName}</td>
                  <td className="py-3 text-slate-300">{pet.rollNumber}</td>
                  <td className="py-3 text-cyan-400">{pet.category}</td>
                  <td className="py-3 font-bold text-amber-400">{pet.currentAttendance}%</td>
                  <td className="py-3 text-emerald-400 font-bold flex items-center space-x-1">
                    <Sparkles className="w-3 h-3" />
                    <span>{pet.ocrScore}% Valid</span>
                  </td>
                  <td className="py-3 text-right">
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/30">
                      {pet.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
