import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  FileCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  FileText,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Clock,
  Building2,
  Award,
  Layers,
  Zap,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { PetitionRecord } from '../../types';

export const HodGovernanceInbox: React.FC = () => {
  const { petitions, approvePetition, rejectPetition, batchApprovePetitions } = useApp();

  const [selectedPetitionId, setSelectedPetitionId] = useState<string>(
    petitions[0]?.id || 'pet-2026-001'
  );
  const [rejectReason, setRejectReason] = useState<string>('');
  const [showRejectModal, setShowRejectModal] = useState<boolean>(false);

  const selectedPetition =
    petitions.find((p) => p.id === selectedPetitionId) || petitions[0] || null;

  const pendingCount = petitions.filter((p) => p.status !== 'HOD Approved' && p.status !== 'Rejected').length;
  const approvedCount = petitions.filter((p) => p.status === 'HOD Approved').length;

  const handleApprove = (id: string) => {
    approvePetition(id);
  };

  const handleConfirmReject = () => {
    if (selectedPetition) {
      rejectPetition(selectedPetition.id, rejectReason || 'Document verification incomplete.');
      setShowRejectModal(false);
      setRejectReason('');
    }
  };

  return (
    <div className="space-y-6 text-slate-100 font-sans select-none">
      {/* Top Bar: Executive Department Health Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Metric 1: Department Attendance */}
        <div className="zeno-glass-card p-4 flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold flex items-center space-x-1.5">
              <Building2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Dept Attendance Avg</span>
            </div>
            <div className="text-xl font-extrabold font-mono text-amber-400">78.2%</div>
            <div className="text-[10px] text-slate-400">Threshold: 75.0%</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold font-mono">
            CSM
          </div>
        </div>

        {/* Metric 2: Pending Waivers */}
        <div className="zeno-glass-card p-4 flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold flex items-center space-x-1.5">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>Pending Governance Queue</span>
            </div>
            <div className="text-xl font-extrabold font-mono text-cyan-400">{pendingCount}</div>
            <div className="text-[10px] text-slate-400">Awaiting HOD Signature</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold font-mono">
            {pendingCount}
          </div>
        </div>

        {/* Metric 3: Approved Certificates */}
        <div className="zeno-glass-card p-4 flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold flex items-center space-x-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Crypto Audit Proofs Signed</span>
            </div>
            <div className="text-xl font-extrabold font-mono text-emerald-400">{approvedCount}</div>
            <div className="text-[10px] text-slate-400">Recorded on Ledger</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold font-mono">
            {approvedCount}
          </div>
        </div>

        {/* Metric 4: SLA & Batch Action Button */}
        <div className="zeno-glass-card p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[10px] font-mono uppercase font-bold text-slate-400">
            <span>SLA Breach Warnings</span>
            <span className="text-emerald-400">0 Warnings</span>
          </div>
          <button
            onClick={batchApprovePetitions}
            className="w-full py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-bold rounded-xl shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-all flex items-center justify-center space-x-1.5"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Batch Sign Low-Risk Queue</span>
          </button>
        </div>
      </div>

      {/* Split-Pane Governance Action Inbox */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Pane: Petitions Queue List (lg:col-span-4) */}
        <div className="lg:col-span-4 zeno-glass-card p-4 space-y-3 flex flex-col min-h-[500px]">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
            <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-200 flex items-center space-x-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>Department Waiver Queue</span>
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              {petitions.length} Total
            </span>
          </div>

          <div className="space-y-2.5 overflow-y-auto flex-1 pr-1">
            {petitions.map((pet) => {
              const isSelected = selectedPetition?.id === pet.id;
              const isApproved = pet.status === 'HOD Approved';
              const isRejected = pet.status === 'Rejected';

              return (
                <div
                  key={pet.id}
                  onClick={() => setSelectedPetitionId(pet.id)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all duration-200 space-y-2 relative overflow-hidden ${
                    isSelected
                      ? 'bg-slate-900/90 border-amber-500/80 shadow-[0_0_20px_rgba(245,158,11,0.2)]'
                      : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-900/50'
                  }`}
                >
                  {isSelected && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500 rounded-l-xl" />
                  )}

                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-white">{pet.studentName}</span>
                    <span
                      className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-full border ${
                        isApproved
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : isRejected
                          ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/30 animate-pulse'
                      }`}
                    >
                      {pet.status}
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-400 font-mono flex items-center justify-between">
                    <span>{pet.rollNumber}</span>
                    <span className="text-rose-400 font-bold">-{pet.shortfallPercentage}% Shortfall</span>
                  </div>

                  {/* AI Credibility Badge */}
                  <div className="flex items-center justify-between pt-1 border-t border-slate-800/60 text-[10px] font-mono">
                    <span className="text-slate-400 flex items-center space-x-1">
                      <Sparkles className="w-3 h-3 text-cyan-400" />
                      <span>AI Credibility:</span>
                    </span>
                    <span className="text-emerald-400 font-bold">{pet.ocrScore}% VALID</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Pane: Document Inspector & HOD Approval Controls (lg:col-span-8) */}
        <div className="lg:col-span-8 zeno-glass-card p-6 space-y-5 flex flex-col justify-between">
          {selectedPetition ? (
            <>
              {/* Header */}
              <div className="flex items-start justify-between border-b border-slate-800/80 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-extrabold text-base text-white">{selectedPetition.category}</h3>
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-[10px] font-mono text-cyan-400">
                      ID: {selectedPetition.id}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 font-mono">
                    Student: <strong className="text-white">{selectedPetition.studentName}</strong> ({selectedPetition.rollNumber}) • {selectedPetition.department}
                  </div>
                </div>

                <div className="text-right space-y-1">
                  <div className="text-xs font-mono text-slate-400">Submitted: {selectedPetition.submittedAt}</div>
                  <div className="text-xs font-mono font-bold text-amber-400">
                    Attendance: {selectedPetition.currentAttendance}% ➔ {selectedPetition.postWaiverAttendance}%
                  </div>
                </div>
              </div>

              {/* Side-by-Side Inspector Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                {/* Document Letter Box */}
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2 flex flex-col">
                  <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                    <span className="flex items-center space-x-1.5">
                      <FileText className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Student Formal Petition Payload</span>
                    </span>
                  </div>
                  <div className="text-xs text-slate-300 font-mono whitespace-pre-wrap leading-relaxed flex-1 overflow-y-auto p-3 rounded-lg bg-slate-900/60 border border-slate-800/60">
                    {selectedPetition.petitionLetter}
                  </div>
                </div>

                {/* AI OCR & Verification Evidence Box */}
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>AI OCR Extraction Verification</span>
                    </div>

                    <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 space-y-2 text-xs font-mono">
                      <div className="flex justify-between text-slate-400">
                        <span>Institution/Hospital:</span>
                        <span className="text-white font-bold">{selectedPetition.hospitalName || 'Apollo Hospitals'}</span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>Issuing Officer:</span>
                        <span className="text-white font-bold">{selectedPetition.doctorName || 'Dr. R. K. Sharma'}</span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>Dates Affected:</span>
                        <span className="text-amber-400">{selectedPetition.datesAffected}</span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>Classes Missed:</span>
                        <span className="text-white">{selectedPetition.classesMissed} hours</span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>Attached File:</span>
                        <span className="text-cyan-400">{selectedPetition.documentFileName}</span>
                      </div>
                    </div>

                    {/* AI Recommendation Banner */}
                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono space-y-1">
                      <div className="font-bold flex items-center space-x-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                        <span>AI VERDICT: RECOMMENDED FOR CONDONATION</span>
                      </div>
                      <div className="text-[11px] text-emerald-400/80">
                        Confidence: {selectedPetition.ocrScore}%. Document hash matches institutional database records.
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* HOD Action Bar */}
              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setShowRejectModal(true)}
                  disabled={selectedPetition.status === 'Rejected'}
                  className="px-4 py-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-bold rounded-xl border border-rose-500/30 transition-all flex items-center space-x-2 disabled:opacity-40"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Reject with Note</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleApprove(selectedPetition.id)}
                  disabled={selectedPetition.status === 'HOD Approved'}
                  className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-extrabold uppercase tracking-wider rounded-xl shadow-[0_0_25px_rgba(16,185,129,0.4)] transition-all flex items-center space-x-2 disabled:opacity-50"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{selectedPetition.status === 'HOD Approved' ? 'Approved & Signed' : 'Approve & Apply Cryptographic Signature'}</span>
                </button>
              </div>
            </>
          ) : (
            <div className="p-12 text-center text-slate-500 font-mono text-xs">
              Select a petition from the left queue to inspect.
            </div>
          )}
        </div>
      </div>

      {/* Reject Reason Modal */}
      <AnimatePresence>
        {showRejectModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-[#090D14] border border-slate-800 rounded-2xl p-6 space-y-4 text-slate-100"
            >
              <h4 className="font-bold text-sm text-rose-400">Reject Leave Petition</h4>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Enter rejection reason for student feedback..."
                className="w-full h-24 bg-slate-950 border border-slate-800 text-xs text-slate-100 p-3 rounded-xl outline-none focus:border-rose-500 font-mono"
              />
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowRejectModal(false)}
                  className="px-4 py-2 bg-slate-900 text-xs text-slate-400 rounded-xl hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmReject}
                  className="px-4 py-2 bg-rose-500 text-xs text-slate-950 font-bold rounded-xl hover:bg-rose-400"
                >
                  Confirm Reject
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
