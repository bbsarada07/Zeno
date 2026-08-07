import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, UserCheck, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const RecruiterPerspectiveModal: React.FC = () => {
  const { isRecruiterModalOpen, setIsRecruiterModalOpen, recruiterFeedback, student } = useApp();

  if (!isRecruiterModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xl p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-2xl bg-card border border-border rounded-2xl shadow-2xl overflow-hidden text-foreground flex flex-col max-h-[85vh]"
      >
        <div className="p-5 border-b border-border bg-muted/20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Recruiter Simulator Agent Analysis</h3>
              <p className="text-[11px] text-muted-foreground">Evaluating {student.name} ({student.rollNumber})</p>
            </div>
          </div>
          <button
            onClick={() => setIsRecruiterModalOpen(false)}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-5 text-xs">
          <div className="flex items-center justify-between p-4 rounded-xl bg-background border border-border">
            <div>
              <div className="text-[10px] text-muted-foreground uppercase font-semibold">Target Company Class</div>
              <div className="font-bold text-sm text-foreground mt-0.5">{recruiterFeedback.category}</div>
            </div>
            <div className="text-right">
              <div className="text-[10px] text-muted-foreground uppercase font-semibold">Rejection Risk Score</div>
              <div className="font-bold font-mono text-emerald-400 text-sm">{recruiterFeedback.rejectionRisk}% (Very Low)</div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="font-semibold text-emerald-400 uppercase tracking-wider text-[11px]">Key Candidate Strengths</div>
            <div className="space-y-1.5">
              {recruiterFeedback.strengths.map((str, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{str}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <div className="font-semibold text-amber-400 uppercase tracking-wider text-[11px]">Recruiter Risk Concerns</div>
            <div className="space-y-1.5">
              {recruiterFeedback.concerns.map((con, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-start space-x-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{con}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-5 border-t border-border bg-muted/20 flex justify-end">
          <button
            onClick={() => setIsRecruiterModalOpen(false)}
            className="px-4 py-2 bg-primary text-primary-foreground font-semibold text-xs rounded-xl"
          >
            Close Analysis
          </button>
        </div>
      </motion.div>
    </div>
  );
};
