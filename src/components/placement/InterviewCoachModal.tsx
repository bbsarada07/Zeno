import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Award, CheckCircle2, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const InterviewCoachModal: React.FC = () => {
  const { isInterviewModalOpen, setIsInterviewModalOpen, interviewReplays, student } = useApp();

  if (!isInterviewModalOpen) return null;

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
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center">
              <Play className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Interactive Mock Interview & Answer Replay</h3>
              <p className="text-[11px] text-muted-foreground">Candidate: {student.name} ({student.rollNumber})</p>
            </div>
          </div>
          <button
            onClick={() => setIsInterviewModalOpen(false)}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-5 text-xs">
          {interviewReplays.map((replay) => (
            <div key={replay.questionId} className="p-5 rounded-2xl bg-background border border-border space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-foreground">{replay.questionText}</span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono text-[11px] font-bold border border-emerald-500/20">
                  {replay.ratingScore} / 10
                </span>
              </div>

              <div className="p-3 rounded-xl bg-muted/30 border border-border space-y-1">
                <div className="text-[10px] text-muted-foreground uppercase font-semibold">Your Answer Summary</div>
                <p className="text-foreground">{replay.userAnswerSummary}</p>
              </div>

              <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 space-y-1">
                <div className="text-[10px] text-primary font-semibold uppercase flex items-center space-x-1">
                  <Sparkles className="w-3 h-3" />
                  <span>AI Suggested Answer Benchmark</span>
                </div>
                <p className="text-foreground leading-relaxed">{replay.aiSuggestedAnswer}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="p-5 border-t border-border bg-muted/20 flex justify-end">
          <button
            onClick={() => setIsInterviewModalOpen(false)}
            className="px-4 py-2 bg-primary text-primary-foreground font-semibold text-xs rounded-xl"
          >
            Close Replay Session
          </button>
        </div>
      </motion.div>
    </div>
  );
};
