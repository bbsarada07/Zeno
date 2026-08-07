import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, X, CheckCircle2, AlertTriangle, Send, Edit3, XCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const HitlDrawer: React.FC = () => {
  const { hitlPayload, isHitlDrawerOpen, setIsHitlDrawerOpen, approveHitlAction, rejectHitlAction, student } = useApp();

  const [bodyText, setBodyText] = useState(hitlPayload.editableBody);
  const [isEditing, setIsEditing] = useState(false);

  if (!isHitlDrawerOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm">
        {/* Responsive Drawer Container: Bottom Sheet on Mobile (< sm), Slide-over Right Drawer on Desktop (≥ sm) */}
        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed bottom-0 inset-x-0 sm:inset-y-0 sm:right-0 sm:left-auto sm:max-w-lg w-full max-h-[85vh] sm:max-h-none bg-card border-t sm:border-l border-border shadow-2xl rounded-t-2xl sm:rounded-l-2xl sm:rounded-tr-none overflow-hidden flex flex-col text-foreground"
        >
          {/* Drawer Header */}
          <div className="p-5 border-b border-border bg-muted/20 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm flex items-center gap-2">
                  <span>HITL Governance Approval Gate</span>
                </h3>
                <p className="text-[11px] text-muted-foreground">Action Requires Human Authorization</p>
              </div>
            </div>

            <button
              onClick={() => setIsHitlDrawerOpen(false)}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="p-5 flex-1 overflow-y-auto space-y-4 text-xs">
            {/* Warning Alert */}
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-start space-x-3">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <span className="font-bold">Human Authorization Required:</span> This action will dispatch a formal governance petition on behalf of <strong>{student.name}</strong> ({student.rollNumber}).
              </div>
            </div>

            {/* Request Summary Card */}
            <div className="p-4 rounded-xl bg-background border border-border space-y-2">
              <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                Action Summary
              </div>
              <div className="font-bold text-sm">{hitlPayload.title}</div>
              <div className="text-muted-foreground leading-relaxed">{hitlPayload.description}</div>
            </div>

            {/* Recipient Details */}
            <div className="p-4 rounded-xl bg-background border border-border space-y-1">
              <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                Target Recipient
              </div>
              <div className="font-semibold">{hitlPayload.targetRecipient}</div>
              <div className="font-mono text-muted-foreground text-[11px]">{hitlPayload.recipientEmail}</div>
            </div>

            {/* Editable Body Payload */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Dispatch Email Payload Body
                </label>
                <button
                  type="button"
                  onClick={() => setIsEditing(!isEditing)}
                  className="text-xs text-primary hover:underline flex items-center space-x-1 font-medium"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>{isEditing ? 'Done Editing' : 'Edit Text'}</span>
                </button>
              </div>

              {isEditing ? (
                <textarea
                  value={bodyText}
                  onChange={(e) => setBodyText(e.target.value)}
                  rows={8}
                  className="w-full p-3 font-mono text-xs bg-background border border-primary/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 leading-relaxed"
                />
              ) : (
                <div className="p-4 rounded-xl bg-muted/30 border border-border font-mono text-xs whitespace-pre-wrap leading-relaxed">
                  {bodyText}
                </div>
              )}
            </div>
          </div>

          {/* Drawer Footer Actions */}
          <div className="p-5 border-t border-border bg-card flex items-center space-x-2">
            <button
              onClick={rejectHitlAction}
              className="px-4 py-2.5 bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 text-xs font-semibold rounded-xl border border-rose-500/20 transition-all flex items-center space-x-1.5"
            >
              <XCircle className="w-4 h-4" />
              <span>Reject</span>
            </button>

            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-3.5 py-2.5 bg-muted hover:bg-muted/80 text-foreground text-xs font-medium rounded-xl border border-border transition-all"
            >
              {isEditing ? 'Save Draft' : 'Edit Body'}
            </button>

            <button
              onClick={() => approveHitlAction(bodyText)}
              className="flex-1 py-2.5 px-4 bg-primary text-primary-foreground text-xs font-semibold rounded-xl hover:opacity-90 transition-all flex items-center justify-center space-x-2 shadow-lg shadow-primary/10"
            >
              <Send className="w-4 h-4" />
              <span>Approve & Dispatch Action</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
