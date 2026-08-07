import React from 'react';
import { motion } from 'framer-motion';
import { FileCheck, AlertTriangle, CheckCircle2, ShieldCheck, ArrowRight, FileText, UploadCloud, Clock } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const WaiverPetitionHub: React.FC = () => {
  const { student, waiverPetition, setIsHitlDrawerOpen } = useApp();

  return (
    <div className="h-full overflow-y-auto p-4 sm:p-6 space-y-6 bg-background text-foreground">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-card border border-border">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-amber-500 uppercase tracking-widest mb-1">
            <AlertTriangle className="w-4 h-4" />
            <span>Attendance Shortage Alert • 72.5% (Threshold: 75.0%)</span>
          </div>
          <h2 className="text-xl font-bold">Medical Attendance Waiver & Condensation Hub</h2>
          <p className="text-xs text-muted-foreground mt-1">
            Automated OCR verification and HOD condensation petition workflow for Alex Rivera ({student.rollNumber}).
          </p>
        </div>

        <button
          onClick={() => setIsHitlDrawerOpen(true)}
          className="px-5 py-2.5 bg-primary text-primary-foreground font-semibold text-xs rounded-xl hover:opacity-90 transition-all flex items-center space-x-2 shadow-lg shadow-primary/10 self-start sm:self-auto"
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Review & Dispatch Petition via HITL</span>
        </button>
      </div>

      {/* Grid Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Attendance Condensation Math */}
        <div className="p-5 rounded-2xl bg-card border border-border space-y-3">
          <div className="flex items-center justify-between text-xs text-muted-foreground font-medium">
            <span>Attendance Percentage</span>
            <span className="font-mono text-amber-500 font-bold">Shortfall: -2.5%</span>
          </div>

          <div className="space-y-2">
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-extrabold font-mono">{waiverPetition.currentAttendance}%</span>
              <span className="text-xs text-muted-foreground">Target: 75.0%</span>
            </div>
            <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-500 rounded-full transition-all duration-500"
                style={{ width: `${(waiverPetition.currentAttendance / 100) * 100}%` }}
              />
            </div>
          </div>

          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 flex items-center justify-between font-mono">
            <span>Post-Waiver Condensation:</span>
            <span className="font-bold text-sm">{waiverPetition.postWaiverAttendance}% ✅</span>
          </div>
        </div>

        {/* Card 2: OCR Document Verification */}
        <div className="p-5 rounded-2xl bg-card border border-border space-y-3">
          <div className="flex items-center justify-between text-xs text-muted-foreground font-medium">
            <span>Medical Certificate OCR Status</span>
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono text-[10px] border border-emerald-500/20">
              VERIFIED
            </span>
          </div>

          <div className="flex items-center space-x-3 p-3 rounded-xl bg-muted/40 border border-border">
            <FileText className="w-8 h-8 text-primary" />
            <div className="overflow-hidden text-ellipsis">
              <div className="text-xs font-semibold truncate">{waiverPetition.documentFileName}</div>
              <div className="text-[11px] text-muted-foreground">{waiverPetition.hospitalName}</div>
            </div>
          </div>

          <div className="text-[11px] text-muted-foreground space-y-1">
            <div className="flex justify-between">
              <span>Attending Physician:</span>
              <span className="font-semibold text-foreground">{waiverPetition.doctorName}</span>
            </div>
            <div className="flex justify-between">
              <span>Dates Missed:</span>
              <span className="font-mono text-foreground">{waiverPetition.datesAffected}</span>
            </div>
          </div>
        </div>

        {/* Card 3: Petition Workflow Status */}
        <div className="p-5 rounded-2xl bg-card border border-border space-y-3">
          <div className="flex items-center justify-between text-xs text-muted-foreground font-medium">
            <span>Workflow Status</span>
            <span className="text-xs font-mono font-bold text-primary">{waiverPetition.status}</span>
          </div>

          <div className="space-y-2 pt-1">
            <div className="flex items-center space-x-3 text-xs">
              <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[10px]">
                1
              </div>
              <span className="text-muted-foreground line-through">Medical Certificate OCR Scan</span>
            </div>
            <div className="flex items-center space-x-3 text-xs">
              <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[10px]">
                2
              </div>
              <span className="text-muted-foreground line-through">Attendance Condensation Calculation</span>
            </div>
            <div className="flex items-center space-x-3 text-xs font-semibold text-foreground">
              <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-[10px]">
                3
              </div>
              <span>Human-in-the-Loop HOD Approval</span>
            </div>
          </div>

          <button
            onClick={() => setIsHitlDrawerOpen(true)}
            className="w-full py-2 bg-muted hover:bg-muted/80 text-foreground text-xs font-medium rounded-xl border border-border transition-all flex items-center justify-center space-x-2"
          >
            <span>Open HITL Drawer</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
