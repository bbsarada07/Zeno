import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, X, AlertTriangle, Send, Edit3, XCircle, FileText, GraduationCap } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const HitlDrawer: React.FC = () => {
  const {
    hitlPayload,
    isHitlDrawerOpen,
    setIsHitlDrawerOpen,
    approveHitlAction,
    rejectHitlAction,
    student,
    placementDraft,
    setPlacementDraft,
    medicalWaiverDraft,
    setMedicalWaiverDraft,
  } = useApp();

  const isPlacementType = hitlPayload.metadata?.type === 'placement_enrollment';
  const initialBody = isPlacementType ? placementDraft.coverLetterBody : medicalWaiverDraft.petitionLetter;

  const [bodyText, setBodyText] = useState(initialBody);
  const [isEditing, setIsEditing] = useState(false);

  if (!isHitlDrawerOpen) return null;

  const handleApprove = () => {
    if (isPlacementType) {
      setPlacementDraft((prev) => ({ ...prev, coverLetterBody: bodyText }));
    } else {
      setMedicalWaiverDraft((prev) => ({ ...prev, petitionLetter: bodyText }));
    }
    approveHitlAction(bodyText);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden bg-black/75 backdrop-blur-md">
        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed bottom-0 inset-x-0 sm:inset-y-0 sm:right-0 sm:left-auto sm:max-w-lg w-full max-h-[90vh] sm:max-h-none bg-[#090D14] border-t sm:border-l border-slate-800 shadow-2xl rounded-t-3xl sm:rounded-l-3xl sm:rounded-tr-none overflow-hidden flex flex-col text-slate-100 font-sans select-none"
        >
          {/* Drawer Header */}
          <div className="p-5 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
                  <span>HITL Governance Approval Gate</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    REQUIRED
                  </span>
                </h3>
                <p className="text-xs text-slate-400 font-mono">Human Authorization Gatekeeper</p>
              </div>
            </div>

            <button
              onClick={() => setIsHitlDrawerOpen(false)}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="p-5 flex-1 overflow-y-auto space-y-4 text-xs font-mono">
            {/* Warning Alert */}
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 flex items-start space-x-3">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
              <div className="leading-relaxed">
                <span className="font-bold">Human Authorization Gate:</span> Reviewing workflow payload for <strong>{student.name}</strong> ({student.rollNumber}).
              </div>
            </div>

            {/* Request Summary Card */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
                {isPlacementType ? <GraduationCap className="w-3.5 h-3.5 text-emerald-400" /> : <FileText className="w-3.5 h-3.5 text-cyan-400" />}
                <span>Workflow Pipeline: {isPlacementType ? 'Placement Application' : 'Medical Attendance Waiver'}</span>
              </div>
              <div className="font-extrabold text-sm text-white">{hitlPayload.title}</div>
              <div className="text-slate-400 leading-relaxed text-[11px]">{hitlPayload.description}</div>
            </div>

            {/* Recipient Details */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Target Recipient
              </div>
              <div className="font-bold text-white text-xs">{hitlPayload.targetRecipient}</div>
              <div className="font-mono text-cyan-400 text-[11px]">{hitlPayload.recipientEmail}</div>
            </div>

            {/* Editable Body Payload */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Dispatch Email / Petition Body
                </label>
                <button
                  type="button"
                  onClick={() => setIsEditing(!isEditing)}
                  className="text-xs text-cyan-400 hover:underline flex items-center space-x-1 font-bold"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>{isEditing ? 'Done Editing' : 'Edit Text'}</span>
                </button>
              </div>

              {isEditing ? (
                <textarea
                  value={bodyText}
                  onChange={(e) => setBodyText(e.target.value)}
                  rows={8}
                  className="w-full p-3 font-mono text-xs bg-slate-950 border border-cyan-500/50 rounded-2xl text-slate-100 outline-none leading-relaxed"
                />
              ) : (
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">
                  {bodyText}
                </div>
              )}
            </div>
          </div>

          {/* Drawer Footer Actions */}
          <div className="p-5 border-t border-slate-800 bg-slate-950 flex items-center space-x-2">
            <button
              onClick={rejectHitlAction}
              className="px-4 py-3 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 text-xs font-bold rounded-xl border border-rose-500/30 transition-all flex items-center space-x-1.5"
            >
              <XCircle className="w-4 h-4" />
              <span>Reject</span>
            </button>

            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-3 bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-bold rounded-xl border border-slate-800 transition-all"
            >
              {isEditing ? 'Save Draft' : 'Edit Body'}
            </button>

            <button
              onClick={handleApprove}
              className="flex-1 py-3 px-4 bg-cyan-500 text-slate-950 text-xs font-extrabold uppercase tracking-wider rounded-xl hover:bg-cyan-400 transition-all flex items-center justify-center space-x-2 shadow-[0_0_20px_rgba(0,240,255,0.3)]"
            >
              <Send className="w-4 h-4" />
              <span>Approve & Apply Signature</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
